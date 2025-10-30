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

        <!-- Filters Section -->
        <!-- <div class="space-y-2 my-4 pb-4 border-b">
          <div>
            <label class="text-xs mb-1 block text-gray-600">Status</label>
            <select
              v-model="filters.has_transfer"
              @change="handleFilterChange"
              class="w-full px-2 py-1.5 text-xs border rounded-lg focus:outline-none focus:border-[#FF613c]"
            >
              <option :value="null">All Status</option>
              <option :value="false">Needs Setup</option>
              <option :value="true">Has Transfer</option>
            </select>
          </div>
        </div> -->

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
                class="text-sm text-blue-600 mt-1 underline"
                @click="goToBooking(selectedBooking?.booking?.id)"
              >
                <!-- Booking ID: {{ selectedBooking.booking.id }} -->
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

          <!-- Analysis Summary -->
          <div
            class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4"
          >
            <h3 class="text-sm font-semibold text-blue-900 mb-3">
              Transfer Analysis
            </h3>
            <div class="grid grid-cols-4 gap-4">
              <div class="text-center">
                <p class="text-xs text-gray-600">Total Images</p>
                <p class="text-2xl font-bold text-blue-600">
                  {{
                    selectedBooking.internal_transfer_analysis.total_cash_images
                  }}
                </p>
              </div>
              <div class="text-center">
                <p class="text-xs text-gray-600">Linked</p>
                <p class="text-2xl font-bold text-green-600">
                  {{
                    selectedBooking.internal_transfer_analysis
                      .images_with_internal_transfer_true
                  }}
                </p>
              </div>
              <div class="text-center">
                <p class="text-xs text-gray-600">Need Setup</p>
                <p class="text-2xl font-bold text-orange-600">
                  {{
                    selectedBooking.internal_transfer_analysis
                      .images_needing_transfer_setup.length
                  }}
                </p>
              </div>
              <div class="text-center">
                <p class="text-xs text-gray-600">Suggestions</p>
                <p class="text-2xl font-bold text-purple-600">
                  {{
                    selectedBooking.internal_transfer_analysis
                      .transfer_suggestions?.length || 0
                  }}
                </p>
              </div>
            </div>
          </div>

          <!-- Internal Transfer Display (for images with transfer = true) -->
          <div
            v-if="
              selectedBooking.internal_transfer_analysis
                .images_with_internal_transfer_true > 0
            "
            class="bg-white border rounded-lg p-4"
          >
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
                        class="w-16 h-16 object-cover rounded border"
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
                        class="w-16 h-16 object-cover rounded border"
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
              </div>
            </div>
          </div>

          <!-- Setup Transfer (for bookings needing setup) -->
          <div
            v-if="
              selectedBooking.internal_transfer_analysis
                .images_needing_transfer_setup.length > 0
            "
            class="bg-white border rounded-lg p-4"
          >
            <h3 class="text-lg font-semibold mb-4">Setup Internal Transfer</h3>

            <!-- Exchange Rate -->
            <div class="mb-4">
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
            </div>

            <!-- Notes -->
            <div class="mb-4">
              <label class="text-xs font-medium mb-2 block"
                >Notes (Optional)</label
              >
              <textarea
                v-model="transferNotes"
                class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#FF613c]"
                rows="2"
                placeholder="Add any notes here..."
              ></textarea>
            </div>

            <!-- Direction Toggle Buttons -->
            <div class="flex gap-3 mb-4">
              <button
                @click="transferDirection = 'from'"
                class="flex-1 px-4 py-2 rounded-lg font-semibold text-xs transition-all"
                :class="
                  transferDirection === 'from'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                "
              >
                FROM (Source)
              </button>
              <button
                @click="transferDirection = 'to'"
                class="flex-1 px-4 py-2 rounded-lg font-semibold text-xs transition-all"
                :class="
                  transferDirection === 'to'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                "
              >
                TO (Destination)
              </button>
            </div>

            <!-- Cash Images Horizontal Scroll -->
            <div class="mb-4">
              <div class="flex items-center justify-between mb-3">
                <h4 class="text-sm font-semibold">
                  Select
                  <span
                    :class="
                      transferDirection === 'from'
                        ? 'text-red-600'
                        : 'text-green-600'
                    "
                    >{{ transferDirection.toUpperCase() }}</span
                  >
                  Cash Images
                </h4>
                <span class="text-xs text-gray-600">
                  Selected: {{ selectedImageIds.length }} images
                </span>
              </div>

              <!-- Horizontal scroll container -->
              <div class="overflow-x-auto pb-2">
                <div class="flex gap-3" style="min-width: max-content">
                  <div
                    v-for="img in getUnlinkedImages()"
                    :key="img.id"
                    class="flex-shrink-0 w-64 bg-white border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md"
                    :class="{
                      'border-red-500 bg-red-50':
                        transferDirection === 'from' &&
                        selectedImageIds.includes(img.id),
                      'border-green-500 bg-green-50':
                        transferDirection === 'to' &&
                        selectedImageIds.includes(img.id),
                      'border-gray-200': !selectedImageIds.includes(img.id),
                    }"
                  >
                    <div class="flex items-start gap-2">
                      <input
                        type="checkbox"
                        :id="`img-${img.id}`"
                        :value="img.id"
                        v-model="selectedImageIds"
                        :class="
                          transferDirection === 'from'
                            ? 'text-red-600 focus:ring-red-500'
                            : 'text-green-600 focus:ring-green-500'
                        "
                        class="mt-1 w-4 h-4 rounded"
                      />
                      <label
                        :for="`img-${img.id}`"
                        class="flex-1 cursor-pointer"
                      >
                        <div
                          class="flex gap-2 mb-2"
                          @click="openViewImage(img)"
                        >
                          <img
                            :src="`https://thanywhere.sgp1.cdn.digitaloceanspaces.com/images/${img.image}`"
                            class="w-12 h-12 object-cover rounded border"
                            alt="Cash"
                          />
                          <div>
                            <p class="font-semibold text-sm">
                              {{ img.currency }}
                              {{ formatCurrency(img.amount) }}
                            </p>
                            <p class="text-xs text-gray-600">
                              {{ img.interact_bank }}
                            </p>
                          </div>
                        </div>
                        <div class="text-xs text-gray-600 space-y-1">
                          <p>
                            <span class="font-medium">From:</span>
                            {{ img.sender }}
                          </p>
                          <p>
                            <span class="font-medium">To:</span>
                            {{ img.receiver }}
                          </p>
                          <p>
                            <span class="font-medium">Date:</span>
                            {{ formatDate(img.date) }}
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Selected Total -->
              <div
                v-if="selectedImageIds.length > 0"
                class="mt-2 rounded p-2"
                :class="
                  transferDirection === 'from' ? 'bg-red-50' : 'bg-green-50'
                "
              >
                <p
                  class="text-sm font-semibold"
                  :class="
                    transferDirection === 'from'
                      ? 'text-red-700'
                      : 'text-green-700'
                  "
                >
                  Total: {{ calculateSelectedTotal() }}
                </p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3">
              <button
                @click="addToTransfer"
                :disabled="selectedImageIds.length === 0"
                class="px-6 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                :class="
                  transferDirection === 'from'
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                "
              >
                Add as {{ transferDirection.toUpperCase() }}
              </button>
              <button
                @click="clearSelection"
                v-if="selectedImageIds.length > 0"
                class="px-6 py-2 bg-gray-200 text-xs text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
              >
                Clear Selection
              </button>
            </div>

            <!-- Transfer Preview -->
            <div
              v-if="fromImageIds.length > 0 || toImageIds.length > 0"
              class="mt-6 bg-gradient-to-r from-red-50 via-white to-green-50 border rounded-lg p-4"
            >
              <h4 class="text-sm font-semibold mb-3">Transfer Preview</h4>
              <div class="grid grid-cols-2 gap-4">
                <!-- FROM Preview -->
                <div class="bg-red-50 rounded p-3">
                  <p class="text-xs font-semibold text-red-700 mb-2">
                    FROM ({{ fromImageIds.length }} images)
                  </p>
                  <p class="text-sm font-bold text-red-900">
                    {{ calculateTotal(fromImageIds) }}
                  </p>
                </div>

                <!-- TO Preview -->
                <div class="bg-green-50 rounded p-3">
                  <p class="text-xs font-semibold text-green-700 mb-2">
                    TO ({{ toImageIds.length }} images)
                  </p>
                  <p class="text-sm font-bold text-green-900">
                    {{ calculateTotal(toImageIds) }}
                  </p>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="mt-4">
                <button
                  @click="createInternalTransfer"
                  :disabled="
                    (fromImageIds.length == 0 && toImageIds.length == 0) ||
                    creatingTransfer
                  "
                  class="w-full bg-[#FF613c] text-white text-xs px-6 py-3 rounded-lg hover:bg-[#FF613c]/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {{
                    creatingTransfer
                      ? "Creating..."
                      : "Create Internal Transfer"
                  }}
                </button>
              </div>
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

    <Modal :isOpen="viewImage != null" @closeModal="clearViewImage">
      <DialogPanel
        class="w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-5"
        >
          Import Process
        </DialogTitle>
        <img
          v-if="viewImage?.image"
          :src="`https://thanywhere.sgp1.cdn.digitaloceanspaces.com/images/${viewImage.image}`"
          alt=""
        />
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

const openViewImage = (data) => {
  console.log(data, "this is view image");

  viewImage.value = data;
};

const clearViewImage = () => {
  viewImage.value = null;
};

// Date filters
const currentDate = new Date();
const year = ref(currentDate.getFullYear());
const selectedMonth = ref(currentDate.getMonth() + 1);

// Filters
const filters = ref({
  has_transfer: null,
});

const goToBooking = (bookingId) => {
  window.open(`/bookings/new-update/${bookingId}`, "_blank");
};

// Transfer setup state
const transferDirection = ref("from"); // 'from' or 'to'
const selectedImageIds = ref([]);
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

    if (filters.value.has_transfer !== null) {
      params.has_internal_transfer = filters.value.has_transfer ? 1 : 0;
    }

    const response = await cashImageStore.internalTransferCheck(params);

    console.log("API Response:", response);

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
  console.log("Selected booking:", item);
};

const resetTransferForm = () => {
  transferDirection.value = "from";
  selectedImageIds.value = [];
  fromImageIds.value = [];
  toImageIds.value = [];
};

const getUnlinkedImages = () => {
  if (!selectedBooking.value) return [];

  // Filter out images that already have internal_transfer = true
  return selectedBooking.value.all_booking_cash_images.filter(
    (img) => !img.internal_transfer
  );
};

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    refreshList(page);
  }
};

const handleFilterChange = () => {
  pagination.value.current_page = 1;
  refreshList();
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

  // Get all cash images with internal_transfer = true and direction = 'from'
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

  // Get all cash images with internal_transfer = true and direction = 'to'
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

  // Get rate from any cash image with transfer info
  for (const img of selectedBooking.value.all_booking_cash_images) {
    if (img.internal_transfer_info && img.internal_transfer_info.length > 0) {
      return img.internal_transfer_info[0].rate;
    }
  }

  return null;
};

const addToTransfer = () => {
  if (selectedImageIds.value.length === 0) {
    toast.warning("Please select at least one cash image");
    return;
  }

  if (transferDirection.value === "from") {
    // Add to FROM list
    const newIds = selectedImageIds.value.filter(
      (id) => !fromImageIds.value.includes(id)
    );
    fromImageIds.value = [...fromImageIds.value, ...newIds];
    toast.success(`Added ${newIds.length} image(s) to FROM list`);
  } else {
    // Add to TO list
    const newIds = selectedImageIds.value.filter(
      (id) => !toImageIds.value.includes(id)
    );
    toImageIds.value = [...toImageIds.value, ...newIds];
    toast.success(`Added ${newIds.length} image(s) to TO list`);
  }

  // Clear selection
  selectedImageIds.value = [];
};

const clearSelection = () => {
  selectedImageIds.value = [];
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

const calculateSelectedTotal = () => {
  return calculateTotal(selectedImageIds.value);
};

const createInternalTransfer = async () => {
  if (fromImageIds.value.length === 0 && toImageIds.value.length === 0) {
    toast.warning("Please add cash images to both FROM and TO lists");
    return;
  }

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
          <p class="text-sm"><strong>Rate:</strong> ${transferRate.value}</p>
        </div>
      </div>
    `,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#FF613c",
    cancelButtonColor: "#6B7280",
    confirmButtonText: "Yes, Create Transfer",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    creatingTransfer.value = true;
    try {
      const response = await cashImageStore.editInternalTransfer({
        from_cash_image_ids: fromImageIds.value,
        to_cash_image_ids: toImageIds.value,
        exchange_rate: transferRate.value,
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

const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (amount) => {
  if (!amount) return "0";
  return new Intl.NumberFormat().format(amount);
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

.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #ff613c;
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #e5532f;
}
</style>
