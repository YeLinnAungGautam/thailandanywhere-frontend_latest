<template>
  <Layout :is_white="true">
    <!-- Header Section -->
    <div
      :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
      class="space-x-8 col-span-3 flex justify-start items-center transition-all duration-200 gap-2 text-sm pb-4 absolute top-6"
    >
      <p class="text-xl font-medium text-[#FF613c]">
        Internal Transfer Management
        <span class="w-2 h-2 bg-[#FF613c] rounded-full inline-block"></span>
      </p>
      <div class="flex items-center gap-4">
        <YearPickerVue @year-change="handleYearChange" />
        <select
          v-model="selectedMonth"
          @change="handleMonthChange"
          class="px-3 text-black text-xs py-2 rounded-lg border border-gray-400/20 focus:outline-none"
        >
          <option :value="m.id" v-for="m in monthArray" :key="m.id">
            {{ m.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="relative z-40">
      <VerifyList />
    </div>

    <!-- Main Content Grid -->
    <div class="grid gap-4 relative grid-cols-3 pt-2">
      <!-- Left Sidebar - Booking List -->
      <div class="border shadow-sm rounded-lg p-4 col-span-1">
        <div class="pb-4 flex justify-between items-center border-b">
          <div class="flex items-center gap-2">
            <p class="text-sm font-medium">Internal Transfer</p>
            <span
              class="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full"
            >
              {{ pagination.total }}
            </span>
          </div>
          <button
            @click="refreshList"
            :disabled="loading"
            class="text-xs bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {{ loading ? "Loading..." : "Refresh" }}
          </button>
        </div>

        <!-- Bookings List -->
        <div
          v-if="!loading"
          class="space-y-3 max-h-[60vh] overflow-y-auto pr-2"
        >
          <div
            v-for="item in bookingItems"
            :key="item.booking.id"
            @click="selectBooking(item)"
            class="border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md"
            :class="{
              'border-[#FF613c] bg-[#FF613c]/5':
                selectedBooking?.booking.id === item.booking.id,
              'border-gray-200':
                selectedBooking?.booking.id !== item.booking.id,
            }"
          >
            <!-- Booking Header -->
            <div class="flex justify-between items-start mb-2">
              <div>
                <p class="font-semibold text-sm text-[#FF613c]">
                  {{ item.booking.crm_id }}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  ID: {{ item.booking.id }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-sm font-semibold">
                  {{ formatCurrency(item.booking.grand_total) }}
                </p>
                <p class="text-xs text-gray-500">Grand Total</p>
              </div>
            </div>

            <!-- Status Badges -->
            <div class="flex flex-wrap gap-1 mb-2">
              <span
                class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded"
              >
                {{ item.internal_transfer_analysis.total_cash_images }} Images
              </span>
              <span
                v-if="
                  item.internal_transfer_analysis
                    .images_with_internal_transfer_true > 0
                "
                class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded"
              >
                ✓
                {{
                  item.internal_transfer_analysis
                    .images_with_internal_transfer_true
                }}
                Linked
              </span>
              <span
                v-if="
                  item.internal_transfer_analysis.images_needing_transfer_setup
                    .length > 0
                "
                class="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded"
              >
                ⚠
                {{
                  item.internal_transfer_analysis.images_needing_transfer_setup
                    .length
                }}
                Need Setup
              </span>
            </div>

            <!-- Quick Info -->
            <div class="text-xs text-gray-600 space-y-1">
              <div class="flex justify-between">
                <span>Sub Total:</span>
                <span class="font-medium">{{
                  formatCurrency(item.booking.sub_total)
                }}</span>
              </div>
              <div
                class="flex justify-between"
                v-if="item.booking.discount > 0"
              >
                <span>Discount:</span>
                <span class="font-medium text-red-600"
                  >-{{ formatCurrency(item.booking.discount) }}</span
                >
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-if="bookingItems.length === 0"
            class="text-center py-8 text-gray-500 text-sm"
          >
            <svg
              class="w-16 h-16 mx-auto mb-2 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p>No bookings found</p>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="space-y-3">
          <div
            class="animate-pulse border rounded-lg p-3"
            v-for="i in 5"
            :key="i"
          >
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        </div>

        <!-- Pagination -->
        <div
          v-if="!loading && bookingItems.length > 0"
          class="pt-4 border-t mt-4"
        >
          <div class="flex justify-between items-center text-xs">
            <button
              @click="changePage(pagination.current_page - 1)"
              :disabled="pagination.current_page === 1"
              class="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span class="text-gray-600">
              Page {{ pagination.current_page }} of {{ pagination.last_page }}
            </span>
            <button
              @click="changePage(pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.last_page"
              class="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Right Side - Details & Transfer Setup -->
      <div
        class="border shadow-sm rounded-lg p-4 col-span-2 h-[670px] overflow-scroll"
      >
        <div v-if="selectedBooking" class="space-y-4">
          <!-- Booking Header -->
          <div class="flex justify-between items-start pb-4 border-b">
            <div>
              <h2 class="text-xl font-semibold text-[#FF613c]">
                {{ selectedBooking.booking.crm_id }}
              </h2>
              <p
                class="text-sm text-blue-600 mt-1 underline cursor-pointer"
                @click="goToBooking(selectedBooking?.booking?.id)"
              >
                Go to booking
              </p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600">Grand Total</p>
              <p class="text-2xl font-bold text-[#FF613c]">
                {{ formatCurrency(selectedBooking.booking.grand_total) }}
              </p>
            </div>
          </div>

          <!-- Internal Transfer Display (for images with transfer = true) -->
          <div class="bg-white border rounded-lg p-4">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-purple-700">
                Internal Transfer
              </h3>
              <span class="text-sm text-gray-600" v-if="getTransferRate()">
                Rate: {{ getTransferRate() }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <!-- FROM Section -->
              <div class="bg-red-50 rounded-lg p-4">
                <h4 class="text-red-700 font-semibold mb-3">FROM</h4>
                <div class="space-y-3">
                  <div
                    v-for="img in getFromImages()"
                    :key="img.id"
                    class="bg-white border rounded-lg p-3"
                  >
                    <div class="flex gap-3 mb-2">
                      <img
                        @click="openViewImage(img)"
                        :src="`https://thanywhere.sgp1.cdn.digitaloceanspaces.com/images/${img.image}`"
                        class="w-16 h-16 object-cover rounded border cursor-pointer"
                        alt="Cash image"
                        @error="handleImageError"
                      />
                      <div class="flex-1">
                        <p class="font-semibold">
                          {{ img.currency }} {{ formatCurrency(img.amount) }}
                        </p>
                        <p class="text-xs text-gray-600">
                          {{ img.interact_bank }}
                        </p>
                      </div>
                    </div>
                    <div class="text-xs text-gray-600 space-y-1">
                      <p>
                        <span class="font-medium">From:</span> {{ img.sender }}
                      </p>
                      <p>
                        <span class="font-medium">To:</span> {{ img.receiver }}
                      </p>
                      <p>
                        <span class="font-medium">Date:</span>
                        {{ formatDate(img.date) }}
                      </p>
                    </div>
                  </div>
                </div>
                <!-- FROM Images Preview -->
                <div class="space-y-2 my-3">
                  <div
                    v-for="img in getSelectedFromImages()"
                    :key="img.id"
                    class="bg-white border rounded-lg p-2 flex items-center gap-2 relative group"
                  >
                    <img
                      @click="openViewImage(img)"
                      :src="`https://thanywhere.sgp1.cdn.digitaloceanspaces.com/images/${img.image}`"
                      class="w-12 h-12 object-cover rounded border cursor-pointer"
                      alt="Cash"
                    />
                    <div class="flex-1">
                      <p class="font-semibold text-xs">
                        {{ img.currency }} {{ formatCurrency(img.amount) }}
                      </p>
                      <p class="text-xs text-gray-600">
                        {{ img.interact_bank }}
                      </p>
                    </div>
                    <button
                      @click="removeFromList('from', img.id)"
                      class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center transition-opacity text-xs"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <!-- Add FROM Button -->
                <button
                  @click="openImageSelectionModal('from')"
                  class="w-full border-2 border-dashed border-red-300 rounded-lg py-3 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span class="font-medium">Add FROM Images</span>
                </button>
              </div>

              <!-- TO Section -->
              <div class="bg-green-50 rounded-lg p-4">
                <h4 class="text-green-700 font-semibold mb-3">TO</h4>
                <div class="space-y-3">
                  <div
                    v-for="img in getToImages()"
                    :key="img.id"
                    class="bg-white border rounded-lg p-3"
                  >
                    <div class="flex gap-3 mb-2">
                      <img
                        @click="openViewImage(img)"
                        :src="`https://thanywhere.sgp1.cdn.digitaloceanspaces.com/images/${img.image}`"
                        class="w-16 h-16 object-cover rounded border cursor-pointer"
                        alt="Cash image"
                        @error="handleImageError"
                      />
                      <div class="flex-1">
                        <p class="font-semibold">
                          {{ img.currency }} {{ formatCurrency(img.amount) }}
                        </p>
                        <p class="text-xs text-gray-600">
                          {{ img.interact_bank }}
                        </p>
                      </div>
                    </div>
                    <div class="text-xs text-gray-600 space-y-1">
                      <p>
                        <span class="font-medium">From:</span> {{ img.sender }}
                      </p>
                      <p>
                        <span class="font-medium">To:</span> {{ img.receiver }}
                      </p>
                      <p>
                        <span class="font-medium">Date:</span>
                        {{ formatDate(img.date) }}
                      </p>
                    </div>
                  </div>
                </div>
                <!-- TO Images Preview -->
                <div class="space-y-2 my-3">
                  <div
                    v-for="img in getSelectedToImages()"
                    :key="img.id"
                    class="bg-white border rounded-lg p-2 flex items-center gap-2 relative group"
                  >
                    <img
                      @click="openViewImage(img)"
                      :src="`https://thanywhere.sgp1.cdn.digitaloceanspaces.com/images/${img.image}`"
                      class="w-12 h-12 object-cover rounded border cursor-pointer"
                      alt="Cash"
                    />
                    <div class="flex-1">
                      <p class="font-semibold text-xs">
                        {{ img.currency }} {{ formatCurrency(img.amount) }}
                      </p>
                      <p class="text-xs text-gray-600">
                        {{ img.interact_bank }}
                      </p>
                    </div>
                    <button
                      @click="removeFromList('to', img.id)"
                      class="absolute top-1 right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center transition-opacity text-xs"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <!-- Add TO Button -->
                <button
                  @click="openImageSelectionModal('to')"
                  class="w-full border-2 border-dashed border-green-300 rounded-lg py-3 text-green-600 hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span class="font-medium">Add TO Images</span>
                </button>
              </div>
            </div>
          </div>

          <!-- NEW DESIGN: Setup Transfer Section -->
          <div
            v-if="
              selectedBooking.internal_transfer_analysis
                .images_needing_transfer_setup.length > 0
            "
            class="bg-white border rounded-lg p-4"
          >
            <h3 class="text-lg font-semibold mb-4">Receipts</h3>

            <!-- Exchange Rate -->
            <!-- <div class="mb-4">
              <label class="text-xs font-medium mb-2 block"
                >Exchange Rate</label
              >
              <input
                v-model="transferRate"
                type="number"
                step="0.000001"
                class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#FF613c]"
                placeholder="125.000000"
              />
            </div> -->

            <!-- Notes -->
            <!-- <div class="mb-4">
              <label class="text-xs font-medium mb-2 block"
                >Notes (Optional)</label
              >
              <textarea
                v-model="transferNotes"
                class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#FF613c]"
                rows="2"
                placeholder="Add any notes here..."
              ></textarea>
            </div> -->
            <div
              class="grid grid-cols-2 gap-4"
              v-if="getUnlinkedImages().length > 0"
            >
              <div
                v-for="img in getUnlinkedImages()"
                :key="img.id"
                @click="openViewImage(img)"
                class="bg-white border rounded-lg p-2 flex items-center gap-2 relative group"
              >
                <img
                  :src="`https://thanywhere.sgp1.cdn.digitaloceanspaces.com/images/${img.image}`"
                  class="w-12 h-12 object-cover rounded border cursor-pointer"
                  alt="Cash"
                />
                <div class="flex-1">
                  <p class="font-semibold text-xs">
                    {{ img.currency }} {{ formatCurrency(img.amount) }}
                  </p>
                  <p class="text-xs text-gray-600">
                    {{ img.interact_bank }}
                  </p>
                </div>
              </div>
            </div>

            <div class="" v-if="getUnlinkedImages().length == 0">
              <p class="text-start text-xs text-gray-500">
                No unlinked images available for transfer setup.
              </p>
            </div>

            <!-- Submit Button -->
            <div class="mt-4">
              <button
                @click="createInternalTransfer"
                :disabled="
                  (fromImageIds.length == 0 && toImageIds.length == 0) ||
                  creatingTransfer
                "
                class="w-full bg-[#FF613c] text-white text-sm px-6 py-3 rounded-lg hover:bg-[#FF613c]/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {{
                  creatingTransfer ? "Creating..." : "Create Internal Transfer"
                }}
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="!selectedBooking"
          class="flex flex-col items-center justify-center h-[70vh] text-gray-400"
        >
          <svg
            class="w-24 h-24 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p class="text-lg font-medium">Select a Booking</p>
          <p class="text-sm mt-2">
            Choose a booking from the left to manage internal transfers
          </p>
        </div>
      </div>
    </div>

    <!-- Image View Modal -->
    <Modal :isOpen="viewImage != null" @closeModal="clearViewImage">
      <DialogPanel
        class="w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-5"
        >
          Cash Image
        </DialogTitle>
        <img
          v-if="viewImage?.image"
          :src="`https://thanywhere.sgp1.cdn.digitaloceanspaces.com/images/${viewImage.image}`"
          alt=""
          class="w-full rounded-lg"
        />
      </DialogPanel>
    </Modal>

    <!-- Image Selection Modal -->
    <Modal
      :isOpen="showImageSelectionModal"
      @closeModal="closeImageSelectionModal"
    >
      <DialogPanel
        class="w-full max-w-4xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 mb-4"
          :class="
            currentSelectionDirection === 'from'
              ? 'text-red-700'
              : 'text-green-700'
          "
        >
          Select
          {{ currentSelectionDirection === "from" ? "FROM" : "TO" }} Images
        </DialogTitle>

        <!-- Selected Count -->
        <div class="mb-4 flex justify-between items-center">
          <p class="text-sm text-gray-600">
            Selected: {{ tempSelectedImageIds.length }} images
          </p>
          <button
            v-if="tempSelectedImageIds.length > 0"
            @click="tempSelectedImageIds = []"
            class="text-xs text-gray-600 hover:text-gray-800 underline"
          >
            Clear All
          </button>
        </div>

        <!-- Images Grid -->
        <div
          class="grid grid-cols-3 gap-4 max-h-[500px] overflow-y-auto mb-4 pr-2"
        >
          <div
            v-for="img in getUnlinkedImages()"
            :key="img.id"
            @click="toggleImageSelection(img.id)"
            class="border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md relative"
            :class="{
              'border-red-500 bg-red-50':
                currentSelectionDirection === 'from' &&
                tempSelectedImageIds.includes(img.id),
              'border-green-500 bg-green-50':
                currentSelectionDirection === 'to' &&
                tempSelectedImageIds.includes(img.id),
              'border-gray-200': !tempSelectedImageIds.includes(img.id),
            }"
          >
            <!-- Checkbox -->
            <div class="absolute top-2 left-2">
              <div
                class="w-5 h-5 rounded border-2 flex items-center justify-center"
                :class="
                  tempSelectedImageIds.includes(img.id)
                    ? currentSelectionDirection === 'from'
                      ? 'bg-red-500 border-red-500'
                      : 'bg-green-500 border-green-500'
                    : 'bg-white border-gray-300'
                "
              >
                <svg
                  v-if="tempSelectedImageIds.includes(img.id)"
                  class="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <!-- Image -->
            <img
              :src="`https://thanywhere.sgp1.cdn.digitaloceanspaces.com/images/${img.image}`"
              class="w-full h-24 object-cover rounded border mb-2"
              alt="Cash"
            />

            <!-- Details -->
            <div class="text-xs space-y-1">
              <p class="font-semibold">
                {{ img.currency }} {{ formatCurrency(img.amount) }}
              </p>
              <p class="text-gray-600">{{ img.interact_bank }}</p>
              <p class="text-gray-500 text-xs">
                {{ formatDate(img.date) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="flex gap-3 justify-end">
          <button
            @click="closeImageSelectionModal"
            class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            @click="confirmImageSelection"
            :disabled="tempSelectedImageIds.length === 0"
            class="px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            :class="
              currentSelectionDirection === 'from'
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-green-500 text-white hover:bg-green-600'
            "
          >
            Add {{ tempSelectedImageIds.length }} Image(s)
          </button>
        </div>
      </DialogPanel>
    </Modal>
  </Layout>
</template>

<script setup>
import Layout from "./Layout.vue";
import Modal from "../components/Modal.vue";
import { DialogPanel, DialogTitle } from "@headlessui/vue";
import { ref, computed, onMounted } from "vue";
import { useCashImageStore } from "../stores/cashImage";
import { useSidebarStore } from "../stores/sidebar";
import { storeToRefs } from "pinia";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
import YearPickerVue from "./AccountingComponent/yearPicker.vue";
import { useRouter } from "vue-router";
import VerifyList from "./CashImageCreate/VerifyList.vue";

const router = useRouter();
const toast = useToast();
const cashImageStore = useCashImageStore();
const sidebarStore = useSidebarStore();
const { isShowSidebar } = storeToRefs(sidebarStore);

// State
const loading = ref(false);
const bookingItems = ref([]);
const selectedBooking = ref(null);
const creatingTransfer = ref(false);

// Pagination
const pagination = ref({
  current_page: 1,
  per_page: 10,
  total: 0,
  last_page: 1,
  from: 0,
  to: 0,
});

const viewImage = ref(null);

// Image Selection Modal State
const showImageSelectionModal = ref(false);
const currentSelectionDirection = ref("from"); // 'from' or 'to'
const tempSelectedImageIds = ref([]);

// Date filters
const currentDate = new Date();
const year = ref(currentDate.getFullYear());
const selectedMonth = ref(currentDate.getMonth() + 1);

// Transfer setup state
const fromImageIds = ref([]);
const toImageIds = ref([]);
const transferRate = ref("");
const transferNotes = ref("");

const monthArray = [
  { id: 1, name: "January" },
  { id: 2, name: "February" },
  { id: 3, name: "March" },
  { id: 4, name: "April" },
  { id: 5, name: "May" },
  { id: 6, name: "June" },
  { id: 7, name: "July" },
  { id: 8, name: "August" },
  { id: 9, name: "September" },
  { id: 10, name: "October" },
  { id: 11, name: "November" },
  { id: 12, name: "December" },
];

// Methods
const openViewImage = (data) => {
  viewImage.value = data;
};

const clearViewImage = () => {
  viewImage.value = null;
};

const goToBooking = (bookingId) => {
  window.open(`/bookings/new-update/${bookingId}`, "_blank");
};

const generateDateRangeForMonth = (month, yearValue) => {
  const startDate = new Date(yearValue, month - 1, 1);
  const endDate = new Date(yearValue, month, 0);

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return `${formatDate(startDate)},${formatDate(endDate)}`;
};

const refreshList = async (page = 1) => {
  loading.value = true;
  try {
    const params = {
      date: generateDateRangeForMonth(selectedMonth.value, year.value),
      page: page,
      per_page: pagination.value.per_page,
    };

    const response = await cashImageStore.internalTransferCheck(params);

    if (response.result && response.result.items) {
      bookingItems.value = response.result.items;

      if (response.result.pagination) {
        pagination.value = response.result.pagination;
      }
    } else {
      bookingItems.value = [];
      toast.info("No bookings found");
    }

    // Reset selection if not in current page
    if (selectedBooking.value) {
      const stillExists = bookingItems.value.find(
        (item) => item.booking.id === selectedBooking.value.booking.id
      );
      if (!stillExists) {
        selectedBooking.value = null;
        transferRate.value = "";
        transferNotes.value = "";
        resetTransferForm();
      }
    }
  } catch (error) {
    console.error("Error fetching list:", error);
    toast.error(error.response?.data?.message || "Failed to load bookings");
    bookingItems.value = [];
  } finally {
    loading.value = false;
  }
};

const selectBooking = (item) => {
  selectedBooking.value = item;
  transferRate.value =
    item?.internal_transfer_analysis?.existing_transfers.length > 0
      ? item.internal_transfer_analysis.existing_transfers[0].rate
      : "";
  transferNotes.value =
    item?.internal_transfer_analysis?.existing_transfers.length > 0
      ? item.internal_transfer_analysis.existing_transfers[0].notes
      : "";
  resetTransferForm();
};

const resetTransferForm = () => {
  fromImageIds.value = [];
  toImageIds.value = [];
};

const getUnlinkedImages = () => {
  if (!selectedBooking.value) return [];
  return selectedBooking.value.all_booking_cash_images.filter(
    (img) =>
      !img.internal_transfer &&
      !fromImageIds.value.includes(img.id) &&
      !toImageIds.value.includes(img.id)
  );
};

const getSelectedFromImages = () => {
  if (!selectedBooking.value || fromImageIds.value.length === 0) return [];
  return selectedBooking.value.all_booking_cash_images.filter((img) =>
    fromImageIds.value.includes(img.id)
  );
};

const getSelectedToImages = () => {
  if (!selectedBooking.value || toImageIds.value.length === 0) return [];
  return selectedBooking.value.all_booking_cash_images.filter((img) =>
    toImageIds.value.includes(img.id)
  );
};

const openImageSelectionModal = (direction) => {
  currentSelectionDirection.value = direction;
  // Pre-select already selected images
  tempSelectedImageIds.value =
    direction === "from" ? [...fromImageIds.value] : [...toImageIds.value];
  showImageSelectionModal.value = true;
};

const closeImageSelectionModal = () => {
  showImageSelectionModal.value = false;
  tempSelectedImageIds.value = [];
};

const toggleImageSelection = (imageId) => {
  const index = tempSelectedImageIds.value.indexOf(imageId);
  if (index > -1) {
    tempSelectedImageIds.value.splice(index, 1);
  } else {
    tempSelectedImageIds.value.push(imageId);
  }
};

const confirmImageSelection = () => {
  if (currentSelectionDirection.value === "from") {
    fromImageIds.value = [...tempSelectedImageIds.value];
    toast.success(
      `Added ${tempSelectedImageIds.value.length} image(s) to FROM list`
    );
  } else {
    toImageIds.value = [...tempSelectedImageIds.value];
    toast.success(
      `Added ${tempSelectedImageIds.value.length} image(s) to TO list`
    );
  }
  closeImageSelectionModal();
};

const removeFromList = (direction, imageId) => {
  if (direction === "from") {
    fromImageIds.value = fromImageIds.value.filter((id) => id !== imageId);
    toast.info("Removed from FROM list");
  } else {
    toImageIds.value = toImageIds.value.filter((id) => id !== imageId);
    toast.info("Removed from TO list");
  }
};

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    refreshList(page);
  }
};

const handleYearChange = (newYear) => {
  year.value = newYear;
  refreshList();
};

const handleMonthChange = () => {
  refreshList();
};

const getFromImages = () => {
  if (!selectedBooking.value) return [];
  const fromImages = [];
  selectedBooking.value.all_booking_cash_images.forEach((img) => {
    if (img.internal_transfer && img.internal_transfer_info) {
      img.internal_transfer_info.forEach((transfer) => {
        if (transfer.direction === "from") {
          fromImages.push(img);
        }
      });
    }
  });
  return fromImages;
};

const getToImages = () => {
  if (!selectedBooking.value) return [];
  const toImages = [];
  selectedBooking.value.all_booking_cash_images.forEach((img) => {
    if (img.internal_transfer && img.internal_transfer_info) {
      img.internal_transfer_info.forEach((transfer) => {
        if (transfer.direction === "to") {
          toImages.push(img);
        }
      });
    }
  });
  return toImages;
};

const getTransferRate = () => {
  if (!selectedBooking.value) return null;
  for (const img of selectedBooking.value.all_booking_cash_images) {
    if (img.internal_transfer_info && img.internal_transfer_info.length > 0) {
      return img.internal_transfer_info[0].rate;
    }
  }
  return null;
};

const calculateTotal = (imageIds) => {
  if (!selectedBooking.value || imageIds.length === 0) return "0";
  const images = selectedBooking.value.all_booking_cash_images.filter((img) =>
    imageIds.includes(img.id)
  );
  const total = images.reduce((sum, img) => sum + parseFloat(img.amount), 0);
  const currency = images[0]?.currency || "";
  return `${currency} ${formatCurrency(total)}`;
};

const calculateTotalAmount = (imageIds) => {
  if (!selectedBooking.value || imageIds.length === 0) return 0;
  const images = selectedBooking.value.all_booking_cash_images.filter((img) =>
    imageIds.includes(img.id)
  );
  const total = images.reduce((sum, img) => sum + parseFloat(img.amount), 0);
  return total;
};

const createInternalTransfer = async () => {
  if (fromImageIds.value.length === 0 && toImageIds.value.length === 0) {
    toast.warning("Please add cash images to both FROM and TO lists");
    return;
  }

  let exchangeRateCalculated =
    calculateTotalAmount(fromImageIds.value) /
    calculateTotalAmount(toImageIds.value);

  const result = await Swal.fire({
    title: "Create Internal Transfer?",
    html: `
      <div class="text-left space-y-2">
        <p class="font-semibold mb-2">Confirm internal transfer:</p>
        <div class="bg-red-50 p-3 rounded">
          <p class="text-sm"><strong>FROM:</strong> ${
            fromImageIds.value.length
          } cash images</p>
          <p class="text-sm">${calculateTotal(fromImageIds.value)}</p>
        </div>
        <div class="text-center py-2">↓</div>
        <div class="bg-green-50 p-3 rounded">
          <p class="text-sm"><strong>TO:</strong> ${
            toImageIds.value.length
          } cash images</p>
          <p class="text-sm">${calculateTotal(toImageIds.value)}</p>
        </div>
        <div class="bg-blue-50 p-3 rounded mt-2">
          <p class="text-sm mb-2"><strong>Exchange Rate:</strong></p>
          <input
            id="swal-rate-input"
            type="number"
            step="0.000001"
            value="${transferRate.value || ""}"
            class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#FF613c]"
            placeholder="Enter exchange rate (${exchangeRateCalculated.toFixed(
              2
            )})"
          />
        </div>
      </div>
    `,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#FF613c",
    cancelButtonColor: "#6B7280",
    confirmButtonText: "Yes, Create Transfer",
    cancelButtonText: "Cancel",
    focusConfirm: false,
    preConfirm: () => {
      const rateInput = document.getElementById("swal-rate-input");
      const rateValue = rateInput.value;

      if (!rateValue || rateValue <= 0) {
        Swal.showValidationMessage("Please enter a valid exchange rate");
        return false;
      }

      return {
        rate: rateValue,
      };
    },
    didOpen: () => {
      // Focus on the input when modal opens
      const input = document.getElementById("swal-rate-input");
      if (input) {
        input.focus();
      }
    },
  });

  if (result.isConfirmed && result.value) {
    creatingTransfer.value = true;
    try {
      const response = await cashImageStore.editInternalTransfer({
        from_cash_image_ids: fromImageIds.value,
        to_cash_image_ids: toImageIds.value,
        exchange_rate: result.value.rate, // Use the rate from the modal
        notes: transferNotes.value || null,
        internal_transfer_id:
          selectedBooking.value.internal_transfer_analysis?.existing_transfers
            .length > 0
            ? selectedBooking.value.internal_transfer_analysis
                .existing_transfers[0].internal_transfer_id
            : null,
      });

      if (response.status === 1) {
        toast.success("Internal transfer created successfully!");
        resetTransferForm();
        await refreshList(pagination.value.current_page);
      }
    } catch (error) {
      console.error("Error creating transfer:", error);
      toast.error(
        error.response?.data?.message || "Failed to create internal transfer"
      );
    } finally {
      creatingTransfer.value = false;
    }
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (amount) => {
  if (!amount) return "0";
  return new Intl.NumberFormat().format(amount);
};

const handleImageError = (event) => {
  event.target.src = "https://via.placeholder.com/150?text=No+Image";
};

// Lifecycle
onMounted(() => {
  refreshList();
});
</script>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #ff613c;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #e5532f;
}
</style>
