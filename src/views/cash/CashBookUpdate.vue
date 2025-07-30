<template>
  <Modal :isOpen="show" @closeModal="closeAction">
    <DialogPanel
      class="w-full max-w-6xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
    >
      <DialogTitle
        as="div"
        class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-2 px-4"
      >
        <p>Edit Cash Book & Update Connections</p>
        <XCircleIcon
          class="w-5 h-5 text-white cursor-pointer"
          @click="closeAction"
        />
      </DialogTitle>

      <div class="p-4">
        <!-- Progress Steps -->
        <div class="flex justify-evenly items-center mb-6">
          <div class="flex items-center">
            <div
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
                selectionPart === 'edit'
                  ? 'bg-[#FF613c] text-white'
                  : 'bg-gray-200 text-gray-600',
              ]"
            >
              1
            </div>
            <p
              class="text-xs ml-2 cursor-pointer"
              :class="
                selectionPart === 'edit'
                  ? 'text-[#FF613c] font-semibold'
                  : 'text-gray-600'
              "
              @click="selectionPart = 'edit'"
            >
              Edit Cash Image
            </p>
          </div>

          <div class="bg-gray-300 h-0.5 w-[20%]"></div>

          <div class="flex items-center">
            <div
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
                selectionPart === 'connect'
                  ? 'bg-[#FF613c] text-white'
                  : 'bg-gray-200 text-gray-600',
              ]"
            >
              2
            </div>
            <p
              class="text-xs ml-2 cursor-pointer"
              :class="
                selectionPart === 'connect'
                  ? 'text-[#FF613c] font-semibold'
                  : 'text-gray-600'
              "
              @click="canProceedToConnect ? (selectionPart = 'connect') : null"
            >
              Update Connections
            </p>
          </div>
        </div>

        <!-- Step 1: Edit Cash Image -->
        <div
          v-if="selectionPart === 'edit'"
          class="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <!-- Image Upload Section -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-800">Update Image</h3>

            <input
              ref="imageInput"
              type="file"
              @change="onImageChange"
              accept="image/*"
              class="hidden"
            />

            <div
              @click="$refs.imageInput.click()"
              class="border-2 border-dashed border-[#FF613c] w-full h-64 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div v-if="!imagePreview && !currentImageUrl" class="text-center">
                <svg
                  class="mx-auto h-12 w-12 text-[#FF613c]"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <p class="mt-2 text-sm text-[#FF613c]">Click to upload image</p>
                <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>

              <div v-else class="relative w-full h-full">
                <img
                  :src="imagePreview || getImageUrl(currentImageUrl)"
                  alt="Preview"
                  class="w-full h-full object-cover rounded-lg"
                />
                <button
                  @click.stop="removeImage"
                  class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
                <div
                  v-if="!imagePreview && currentImageUrl"
                  class="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs"
                >
                  Current Image
                </div>
              </div>
            </div>
          </div>

          <!-- Form Section -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-800">
              Cash Image Details
            </h3>

            <div class="space-y-4">
              <div>
                <label class="text-xs font-medium text-gray-700 block mb-1"
                  >Date & Time *</label
                >
                <div
                  class="flex justify-between items-center w-full bg-white border border-gray-300 rounded-lg"
                >
                  <p class="text-xs px-3 py-2 flex-1" v-if="formData.date">
                    {{ formatDisplayDate(formData.date) }}
                  </p>
                  <input
                    type="datetime-local"
                    v-model="formData.date"
                    class="px-2 py-2 text-xs focus:outline-none border-l border-gray-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label class="text-xs font-medium text-gray-700 block mb-1"
                  >Sender *</label
                >
                <input
                  type="text"
                  v-model="formData.sender"
                  placeholder="Enter sender name"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF613c] text-xs"
                  required
                />
              </div>

              <div>
                <label class="text-xs font-medium text-gray-700 block mb-1"
                  >Receiver *</label
                >
                <input
                  type="text"
                  v-model="formData.receiver"
                  placeholder="Enter receiver name"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF613c] text-xs"
                  required
                />
              </div>

              <div>
                <label class="text-xs font-medium text-gray-700 block mb-1"
                  >Amount *</label
                >
                <input
                  type="number"
                  v-model="formData.amount"
                  step="0.01"
                  min="0"
                  placeholder="Enter amount"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF613c] text-xs"
                  required
                />
              </div>

              <div>
                <label class="text-xs font-medium text-gray-700 block mb-1"
                  >Interact Bank</label
                >
                <select
                  v-model="formData.interact_bank"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF613c] text-xs"
                >
                  <option value="">Select Bank</option>
                  <option value="personal">Personal</option>
                  <option value="company">Company</option>
                  <option value="cash_at_office">Cash at Office</option>
                  <option value="to_money_changer">To Money Changer</option>
                  <option value="deposit_management">Deposit Management</option>
                  <option value="pay_to_driver">Pay to Driver</option>
                </select>
              </div>

              <div>
                <label class="text-xs font-medium text-gray-700 block mb-1"
                  >Currency *</label
                >
                <select
                  v-model="formData.currency"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF613c] text-xs"
                  required
                >
                  <option value="THB">THB</option>
                  <option value="MMK">MMK</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex justify-between items-center pt-6 border-t">
              <button
                @click="closeAction"
                class="px-6 py-2 bg-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>

              <button
                @click="proceedToConnect"
                :disabled="!isEditFormValid"
                :class="[
                  'px-8 py-2 text-sm rounded-lg transition-colors',
                  isEditFormValid
                    ? 'bg-[#FF613c] text-white hover:bg-[#e55532]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed',
                ]"
              >
                Next: Update Connections
              </button>
            </div>
          </div>
        </div>

        <!-- Step 2: Update Connections -->
        <div
          v-if="selectionPart === 'connect'"
          class="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <!-- Image Display Section -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-800">Cash Image</h3>

            <!-- Cash Image Summary -->
            <div class="bg-blue-50 p-4 rounded-lg">
              <h4 class="font-semibold text-blue-800 mb-2">Image Details</h4>
              <div class="space-y-2 text-xs text-blue-700">
                <div>
                  <strong>Amount:</strong> {{ formatCurrency(formData.amount) }}
                </div>
                <div><strong>Currency:</strong> {{ formData.currency }}</div>
                <div><strong>Sender:</strong> {{ formData.sender }}</div>
                <div><strong>Receiver:</strong> {{ formData.receiver }}</div>
                <div>
                  <strong>Date:</strong> {{ formatDisplayDate(formData.date) }}
                </div>
              </div>
            </div>

            <!-- Image Preview -->
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <img
                v-if="imagePreview || currentImageUrl"
                :src="imagePreview || getImageUrl(currentImageUrl)"
                alt="Cash Image Preview"
                class="w-full min-h-80 object-cover"
              />
              <div
                v-else
                class="w-full min-h-80 bg-gray-100 flex items-center justify-center"
              >
                <p class="text-gray-500">No image selected</p>
              </div>
            </div>

            <!-- Summary -->
            <!-- <div class="bg-green-50 p-4 rounded-lg">
              <h4 class="font-semibold text-green-800 mb-2">
                Connection Summary
              </h4>
              <div class="space-y-1 text-xs text-green-700">
                <div>
                  <strong>Total Connections:</strong>
                  {{ bookingConnections.length }}
                </div>
                <div>
                  <strong>Total Deposit:</strong>
                  {{ formatCurrency(totalDeposit) }}
                </div>
                <div>
                  <strong>Remaining Amount:</strong>
                  {{ formatCurrency(remainingAmount) }}
                </div>
              </div>
            </div> -->
          </div>

          <!-- Booking Connection Section -->
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold text-gray-800">
                Update Connections
              </h3>
              <button
                @click="addBookingConnection"
                class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm rounded-lg transition-colors flex items-center gap-2"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
                Add Booking
              </button>
            </div>

            <!-- Booking Search and Selection -->
            <div class="space-y-4">
              <div>
                <label class="text-xs font-medium text-gray-700 block mb-1">
                  Search & Select Booking
                </label>
                <div class="relative">
                  <input
                    type="text"
                    v-model="bookingSearchQuery"
                    placeholder="Search by CRM ID..."
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs pr-10"
                  />
                  <button
                    @click="loadAllBookings"
                    class="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700"
                    :disabled="bookingStore.loading"
                  >
                    <svg
                      v-if="bookingStore.loading"
                      class="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <svg
                      v-else
                      class="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Available Bookings List -->
              <div
                class="max-h-40 overflow-y-auto border border-gray-200 rounded-lg"
              >
                <div
                  v-for="booking in filteredBookings"
                  :key="booking.id"
                  @click="selectBooking(booking)"
                  class="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div class="flex justify-between items-center">
                    <div class="flex-1">
                      <p class="text-xs font-medium text-gray-800">
                        {{ booking.crm_id }}
                      </p>
                      <p class="text-xs text-gray-600">
                        {{ booking.customer?.name || "No Name" }}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="text-xs font-medium text-green-600">
                        {{ formatCurrency(booking.grand_total) }}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  v-if="filteredBookings.length === 0 && !bookingStore.loading"
                  class="p-4 text-center text-gray-500 text-xs"
                >
                  No bookings found
                </div>
                <div
                  v-if="bookingStore.loading"
                  class="p-4 text-center text-gray-500 text-xs"
                >
                  Loading bookings...
                </div>
              </div>
            </div>

            <!-- Selected Booking Connections -->
            <div class="space-y-3">
              <h4 class="text-sm font-medium text-gray-800">
                Current Connections
              </h4>

              <div
                v-for="(connection, index) in bookingConnections"
                :key="connection.id || index"
                class="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div class="flex justify-between items-center mb-3">
                  <div class="flex-1">
                    <p class="text-xs font-medium text-gray-800">
                      {{ getBookingDisplay(connection.booking_id) }}
                    </p>
                    <p v-if="connection.id" class="text-xs text-blue-600">
                      Existing Connection (ID: {{ connection.id }})
                    </p>
                    <p v-else class="text-xs text-green-600">New Connection</p>
                  </div>
                  <button
                    @click="removeBookingConnection(index)"
                    class="text-red-500 hover:text-red-700 text-sm transition-colors"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label class="text-xs font-medium text-gray-700 block mb-1"
                      >Deposit Amount</label
                    >
                    <input
                      type="number"
                      v-model="connection.deposit"
                      step="0.01"
                      min="0"
                      placeholder="Enter deposit amount"
                      class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                    />
                  </div>

                  <div>
                    <label class="text-xs font-medium text-gray-700 block mb-1"
                      >Notes</label
                    >
                    <input
                      type="text"
                      v-model="connection.notes"
                      placeholder="Enter notes"
                      class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div
                v-if="bookingConnections.length === 0"
                class="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg"
              >
                <svg
                  class="mx-auto h-12 w-12 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                <p class="text-sm font-medium">No bookings connected</p>
                <p class="text-xs">
                  Search and select bookings to connect with this cash image
                </p>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex justify-between items-center pt-6 border-t">
              <button
                @click="selectionPart = 'edit'"
                class="px-6 py-2 bg-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-400 transition-colors"
              >
                Back to Edit
              </button>

              <button
                @click="updateAndConnect"
                :disabled="loading"
                :class="[
                  'px-8 py-2 text-sm rounded-lg transition-colors',
                  loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#FF613c] text-white hover:bg-[#e55532]',
                ]"
              >
                <span v-if="loading" class="flex items-center">
                  <svg
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </span>
                <span v-else>Update & Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DialogPanel>
  </Modal>
</template>

<script setup>
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { ref, computed, onMounted, onUnmounted, watch, toRefs } from "vue";
import { useToast } from "vue-toastification";
import { storeToRefs } from "pinia";
import { useBookingStore } from "../../stores/booking";
import { useCashImageBookingStore } from "../../stores/cashImageBooking";

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  closeAction: {
    type: Function,
    required: true,
  },
  cashImageData: {
    type: Object,
    required: true,
  },
});

// Emits
const emit = defineEmits(["refresh"]);

// Stores
const bookingStore = useBookingStore();
const cashImageBookingStore = useCashImageBookingStore();
const { bookings } = storeToRefs(bookingStore);

// Composables
const toast = useToast();

// Reactive data
const selectionPart = ref("edit");
const loading = ref(false);
const searchLoading = ref(false);
const imagePreview = ref("");
const currentImageUrl = ref("");
const bookingSearchQuery = ref("");
const searchTimeout = ref(null);

// Form data
const formData = ref({
  image: null,
  date: "",
  sender: "",
  receiver: "",
  amount: "",
  interact_bank: "",
  currency: "THB",
});

// Booking connections
const bookingConnections = ref([]);
const originalConnections = ref([]);

// Computed properties
const isEditFormValid = computed(() => {
  return (
    formData.value.date &&
    formData.value.sender &&
    formData.value.receiver &&
    formData.value.amount &&
    formData.value.currency
  );
});

const canProceedToConnect = computed(() => {
  return isEditFormValid.value;
});

const totalDeposit = computed(() => {
  return bookingConnections.value.reduce((sum, booking) => {
    return sum + (parseFloat(booking.deposit) || 0);
  }, 0);
});

const remainingAmount = computed(() => {
  return (parseFloat(formData.value.amount) || 0) - totalDeposit.value;
});

const filteredBookings = computed(() => {
  if (!bookings.value?.data) return [];

  if (!bookingSearchQuery.value.trim()) {
    return bookings.value.data;
  }

  return bookings.value.data.filter(
    (booking) =>
      booking.crm_id &&
      booking.crm_id
        .toLowerCase()
        .includes(bookingSearchQuery.value.toLowerCase())
  );
});

// Methods
const formatDisplayDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

const formatCurrency = (amount) => {
  const num = parseFloat(amount) || 0;
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: formData.value.currency || "THB",
  }).format(num);
};

const formatDateForServer = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const convertDateForInput = (dateString) => {
  if (!dateString) return "";

  // Convert from "29-07-2025 13:12:00" format to datetime-local format
  const parts = dateString.split(" ");
  if (parts.length !== 2) return "";

  const datePart = parts[0].split("-");
  const timePart = parts[1];

  if (datePart.length !== 3) return "";

  // Rearrange from DD-MM-YYYY to YYYY-MM-DD
  const formattedDate = `${datePart[2]}-${datePart[1]}-${datePart[0]}`;

  // Remove seconds if present
  const timeWithoutSeconds = timePart.substring(0, 5);

  return `${formattedDate}T${timeWithoutSeconds}`;
};

const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  // Handle both full URLs and relative paths
  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  return `${window.location.origin}${imagePath}`;
};

const getBookingDisplay = (bookingId) => {
  if (!bookingId || !bookings.value?.data) return "Select a booking";

  const booking = bookings.value.data.find((b) => b.id == bookingId);
  if (!booking) return "Booking not found";

  return `${booking.crm_id} - ${booking.customer?.name || "No Name"}`;
};

// Image handling
const onImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.value.image = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const removeImage = () => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value);
    imagePreview.value = "";
  }
  formData.value.image = null;
};

// Navigation
const proceedToConnect = () => {
  if (isEditFormValid.value) {
    selectionPart.value = "connect";
  } else {
    toast.error("Please fill in all required fields");
  }
};

// Booking connections
const addBookingConnection = () => {
  bookingConnections.value.push({
    booking_id: "",
    deposit: 0,
    notes: "",
  });
};

const removeBookingConnection = (index) => {
  const connection = bookingConnections.value[index];

  // If it's an existing connection, we'll delete it via API later
  if (connection.id) {
    // Mark for deletion in UI
    bookingConnections.value.splice(index, 1);
  } else {
    // If it's a new connection, just remove from array
    bookingConnections.value.splice(index, 1);
  }
};

const selectBooking = (booking) => {
  // Check if booking is already selected
  const existingConnection = bookingConnections.value.find(
    (connection) => connection.booking_id == booking.id
  );

  if (existingConnection) {
    toast.warning("This booking is already selected");
    return;
  }

  // Add new booking connection
  bookingConnections.value.push({
    booking_id: booking.id,
    deposit: 0,
    notes: "",
  });

  toast.success(`Added ${booking.crm_id} to connections`);
};

// Booking search
const searchBookings = async () => {
  if (bookingSearchQuery.value.trim()) {
    try {
      await bookingStore.getListAction({
        crm_id: bookingSearchQuery.value.trim(),
      });
    } catch (error) {
      console.error("Failed to search bookings:", error);
      toast.error("Failed to search bookings");
    }
  }
};

watch(bookingSearchQuery, (newValue) => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  if (newValue.trim()) {
    searchLoading.value = true;
    searchTimeout.value = setTimeout(() => {
      searchBookings();
      searchLoading.value = false;
    }, 500);
  } else {
    loadAllBookings();
  }
});

const loadAllBookings = async () => {
  try {
    await bookingStore.getListAction();
    bookingSearchQuery.value = "";
  } catch (error) {
    console.error("Failed to load bookings:", error);
    toast.error("Failed to load bookings");
  }
};

// Load initial data
const loadCashImageData = () => {
  if (!props.cashImageData) return;

  const data = props.cashImageData;

  // Set form data
  formData.value = {
    image: null,
    date: convertDateForInput(data.date),
    sender: data.sender || "",
    receiver: data.receiver || "",
    amount: data.amount || "",
    interact_bank: data.interact_bank || "",
    currency: data.currency || "THB",
  };

  // Set current image URL
  currentImageUrl.value = data.image || "";

  // Set booking connections from attached_bookings
  if (data.attached_bookings && data.attached_bookings.length > 0) {
    bookingConnections.value = data.attached_bookings.map((attached) => ({
      id: attached.pivot.id,
      booking_id: attached.booking.id,
      deposit: attached.pivot.deposit || 0,
      notes: attached.pivot.notes || "",
    }));
  } else {
    bookingConnections.value = [];
  }

  // Store original connections for comparison
  originalConnections.value = JSON.parse(
    JSON.stringify(bookingConnections.value)
  );
};

// Delete cash image using existing endpoint

// Update cash image and connections using existing endpoints
const updateAndConnect = async () => {
  if (!isEditFormValid.value) {
    toast.error("Please fill in all required fields");
    return;
  }

  try {
    loading.value = true;

    // Step 1: Update cash image basic info using createAndAttach endpoint
    const formDataToSend = new FormData();

    if (formData.value.image) {
      formDataToSend.append("image", formData.value.image);
    }
    formDataToSend.append("date", formatDateForServer(formData.value.date));
    formDataToSend.append("sender", formData.value.sender);
    formDataToSend.append("receiver", formData.value.receiver);
    formDataToSend.append("amount", formData.value.amount);
    formDataToSend.append("currency", formData.value.currency);
    formDataToSend.append("interact_bank", formData.value.interact_bank || "");
    formDataToSend.append("relatable_type", "App\\Models\\Booking");
    formDataToSend.append("relatable_id", "0");
    formDataToSend.append("_method", "PUT");

    bookingConnections.value.forEach((booking, index) => {
      if (booking.booking_id) {
        if (booking.id) {
          formDataToSend.append(`bookings[${index}][id]`, booking.id);
        }
        formDataToSend.append(
          `bookings[${index}][booking_id]`,
          booking.booking_id
        );
        formDataToSend.append(
          `bookings[${index}][deposit]`,
          booking.deposit || 0
        );
        formDataToSend.append(`bookings[${index}][notes]`, booking.notes || "");
      }
    });

    await cashImageBookingStore.updateAction(
      formDataToSend,
      props.cashImageData.id
    );

    toast.success(`Cash image updated successfully with connection(s)`);
    emit("refresh");
    props.closeAction();
  } catch (error) {
    console.error("Failed to update cash image:", error);
    toast.error(error.response?.data?.message || "Failed to update cash image");
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  // Clear any pending search timeout
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
    searchTimeout.value = null;
  }

  formData.value = {
    image: null,
    date: "",
    sender: "",
    receiver: "",
    amount: "",
    interact_bank: "",
    currency: "THB",
  };
  bookingConnections.value = [];
  originalConnections.value = [];
  bookingSearchQuery.value = "";
  searchLoading.value = false;
  currentImageUrl.value = "";
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value);
  }
  imagePreview.value = "";
  selectionPart.value = "edit";
};

// Lifecycle
onMounted(async () => {
  try {
    await loadAllBookings();
    loadCashImageData();
  } catch (error) {
    console.error("Failed to load initial data:", error);
  }
});

// Cleanup on unmount
const cleanup = () => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value);
  }
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
};

// Watch for modal close to cleanup
const { show } = toRefs(props);
watch(show, (newValue) => {
  if (!newValue) {
    cleanup();
    resetForm();
  } else {
    // Reset form when modal opens
    resetForm();
    loadAllBookings();
    loadCashImageData();
  }
});

// Watch for cashImageData changes
watch(
  () => props.cashImageData,
  (newData) => {
    if (newData && props.show) {
      loadCashImageData();
    }
  },
  { deep: true }
);

onUnmounted(() => {
  cleanup();
});
</script>
