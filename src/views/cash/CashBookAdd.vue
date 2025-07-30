<template>
  <Modal :isOpen="show" @closeModal="closeAction">
    <DialogPanel
      class="w-full max-w-6xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
    >
      <DialogTitle
        as="div"
        class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-2 px-4"
      >
        <p>Cash Book Create & Connect Multiple</p>
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
                selectionPart === 'create'
                  ? 'bg-[#FF613c] text-white'
                  : 'bg-gray-200 text-gray-600',
              ]"
            >
              1
            </div>
            <p
              class="text-xs ml-2 cursor-pointer"
              :class="
                selectionPart === 'create'
                  ? 'text-[#FF613c] font-semibold'
                  : 'text-gray-600'
              "
              @click="selectionPart = 'create'"
            >
              Create Cash Image
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
              Connect to Bookings
            </p>
          </div>
        </div>

        <!-- Step 1: Create Cash Image -->
        <div
          v-if="selectionPart === 'create'"
          class="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <!-- Image Upload Section -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-800">Upload Image</h3>

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
              <div v-if="!imagePreview" class="text-center">
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
                  :src="imagePreview"
                  alt="Preview"
                  class="w-full h-auto object-contain rounded-lg"
                />
                <button
                  @click.stop="removeImage"
                  class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
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
                :disabled="!isCreateFormValid"
                :class="[
                  'px-8 py-2 text-sm rounded-lg transition-colors',
                  isCreateFormValid
                    ? 'bg-[#FF613c] text-white hover:bg-[#e55532]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed',
                ]"
              >
                Next: Connect to Bookings
              </button>
            </div>
          </div>
        </div>

        <!-- Step 2: Connect to Bookings -->
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
                v-if="imagePreview"
                :src="imagePreview"
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
                Connect to Bookings
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
                Selected Bookings
              </h4>

              <div
                v-for="(connection, index) in bookingConnections"
                :key="index"
                class="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div class="flex justify-between items-center mb-3">
                  <div class="flex-1">
                    <p class="text-xs font-medium text-gray-800">
                      {{ getBookingDisplay(connection.booking_id) }}
                    </p>
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
                @click="selectionPart = 'create'"
                class="px-6 py-2 bg-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-400 transition-colors"
              >
                Back to Create
              </button>

              <button
                @click="createAndConnect"
                :disabled="loading || !isConnectFormValid"
                :class="[
                  'px-8 py-2 text-sm rounded-lg transition-colors',
                  loading || !isConnectFormValid
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
                  Creating...
                </span>
                <span v-else>Create & Connect</span>
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
const selectionPart = ref("create");
const loading = ref(false);
const searchLoading = ref(false);
const imagePreview = ref("");
const bookingSearchQuery = ref("");
const searchTimeout = ref(null);

// Form data
const formData = ref({
  image: null,
  date: new Date().toISOString().slice(0, 16), // Format for datetime-local
  sender: "",
  receiver: "",
  amount: "",
  interact_bank: "company",
  currency: "THB",
});

// Booking connections
const bookingConnections = ref([]);

// Computed properties
const isCreateFormValid = computed(() => {
  return (
    formData.value.image &&
    formData.value.date &&
    formData.value.sender &&
    formData.value.receiver &&
    formData.value.amount &&
    formData.value.currency
  );
});

const isConnectFormValid = computed(() => {
  return (
    bookingConnections.value.length > 0 &&
    bookingConnections.value.every((booking) => booking.booking_id)
  );
});

const canProceedToConnect = computed(() => {
  return isCreateFormValid.value;
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

  // Convert datetime-local format to Y-m-d H:i:s
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
  formData.value.image = null;
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value);
  }
  imagePreview.value = "";
};

// Navigation
const proceedToConnect = () => {
  if (isCreateFormValid.value) {
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
  bookingConnections.value.splice(index, 1);
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
    }, 500); // Debounce for 500ms
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

const createAndConnect = async () => {
  if (!isCreateFormValid.value || !isConnectFormValid.value) {
    toast.error("Please fill in all required fields");
    return;
  }

  try {
    loading.value = true;

    // Prepare form data
    const formDataToSend = new FormData();
    formDataToSend.append("image", formData.value.image);
    formDataToSend.append("date", formatDateForServer(formData.value.date));
    formDataToSend.append("sender", formData.value.sender);
    formDataToSend.append("receiver", formData.value.receiver);
    formDataToSend.append("amount", formData.value.amount);
    formDataToSend.append("currency", formData.value.currency);
    formDataToSend.append("interact_bank", formData.value.interact_bank || "");
    formDataToSend.append("relatable_type", "App\\Models\\Booking");
    formDataToSend.append("relatable_id", "0"); // This will be set later

    // Add booking connections
    bookingConnections.value.forEach((booking, index) => {
      formDataToSend.append(
        `bookings[${index}][booking_id]`,
        booking.booking_id
      );
      formDataToSend.append(
        `bookings[${index}][deposit]`,
        booking.deposit || 0
      );
      formDataToSend.append(`bookings[${index}][notes]`, booking.notes || "");
    });

    const response = await cashImageBookingStore.createAndAttachAction(
      formDataToSend
    );

    toast.success(
      `Cash image created and connected to ${bookingConnections.value.length} booking(s) successfully`
    );
    emit("refresh");
    resetForm();
    props.closeAction();
  } catch (error) {
    console.error("Failed to create and connect:", error);
    toast.error(
      error.response?.data?.message || "Failed to create and connect"
    );
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
    date: new Date().toISOString().slice(0, 16),
    sender: "",
    receiver: "",
    amount: "",
    interact_bank: "company",
    currency: "THB",
  };
  bookingConnections.value = [];
  bookingSearchQuery.value = "";
  searchLoading.value = false;
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value);
  }
  imagePreview.value = "";
  selectionPart.value = "create";
};

// Lifecycle
onMounted(async () => {
  try {
    await loadAllBookings();
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
  }
});

onUnmounted(() => {
  cleanup();
});
</script>
