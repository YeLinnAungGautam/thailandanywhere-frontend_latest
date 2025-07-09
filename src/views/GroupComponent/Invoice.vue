<template>
  <div v-if="!loading.initial">
    <div class="grid grid-cols-3 gap-4">
      <!-- Left Panel - Invoice List -->
      <div
        class="rounded-lg py-3 relative border space-y-3 border-gray-200 h-auto"
      >
        <p class="text-lg font-medium text-[#FF613c] px-4">Add Invoice</p>

        <!-- Loading state for list -->
        <div
          v-if="loading.list"
          class="h-[46vh] flex items-center justify-center"
        >
          <div class="text-sm text-gray-500">Loading invoices...</div>
        </div>

        <!-- Invoice List -->
        <div v-else class="h-[46vh] overflow-y-auto px-3 space-y-1">
          <div
            v-for="(invoice, index) in invoiceLists"
            :key="invoice.id || index"
            class="flex justify-start items-center space-x-4 rounded-lg cursor-pointer py-1"
            :class="getListItemClass(invoice.id)"
            @click="selectInvoice(invoice, index)"
          >
            <div
              class="rounded-lg p-2 inline-block"
              :class="getIconWrapperClass(invoice.id)"
            >
              <UserCircleIcon
                class="w-4 h-4"
                :class="getIconClass(invoice.id)"
              />
            </div>
            <p class="text-[12px] font-medium">
              <span :class="getTextClass(invoice.id)">
                {{
                  invoice.meta.company_legal_name || "booking_confirm_letter"
                }}
              </span>
            </p>
          </div>
        </div>

        <!-- New Invoice Button -->
        <div class="w-full pt-4 px-4">
          <button
            @click="resetForm"
            :disabled="loading.action"
            class="bg-[#FF613c] cursor-pointer text-white rounded-xl text-center text-xs py-3 w-full hover:bg-[#FF613c]/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + New Invoice
          </button>
        </div>
      </div>

      <!-- Right Panel - Invoice Details -->
      <div class="col-span-2 py-3 rounded-lg relative border border-gray-200">
        <p class="text-lg font-medium text-[#FF613c] px-4 pb-4">Details</p>

        <div class="grid grid-cols-2 h-[46vh] overflow-y-auto px-4 gap-4">
          <!-- Form Fields -->
          <div class="col-span-2 grid grid-cols-2 gap-3">
            <!-- Invoice Number -->
            <div>
              <p class="text-xs pb-1.5 font-medium">Invoice Number</p>
              <input
                type="text"
                v-model="formData.invoice_number"
                placeholder="Enter invoice number"
                :disabled="loading.action"
                class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20 focus:border-[#FF613c] disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>

            <!-- Product Type -->
            <div>
              <p class="text-xs pb-1.5 font-medium">Product Type *</p>
              <select
                v-model="formData.product_type"
                @change="onProductTypeChange"
                :disabled="loading.action"
                class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20 focus:border-[#FF613c] disabled:bg-gray-50 disabled:cursor-not-allowed"
                required
              >
                <option value="">Select product type</option>
                <option value="App\Models\Hotel">Hotel</option>
                <option value="App\Models\EntranceTicket">
                  Entrance Ticket
                </option>
              </select>
            </div>

            <!-- Product Name with Search -->
            <div>
              <p class="text-xs pb-1.5 font-medium">Product Name *</p>
              <div class="relative">
                <input
                  v-model="productSearch"
                  @input="onProductSearch"
                  @focus="showDropdown = true"
                  type="text"
                  placeholder="Search product..."
                  :disabled="!formData.product_type || loading.action"
                  class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20 focus:border-[#FF613c] disabled:bg-gray-50 disabled:cursor-not-allowed"
                  required
                />

                <!-- Dropdown for filtered products -->
                <div
                  v-if="
                    showDropdown &&
                    (filteredProducts.length > 0 || isSearchLoading)
                  "
                  class="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg"
                >
                  <!-- Loading state -->
                  <div
                    v-if="isSearchLoading"
                    class="p-3 text-center text-gray-500 text-sm"
                  >
                    <div class="flex items-center justify-center space-x-2">
                      <div
                        class="animate-spin rounded-full h-4 w-4 border-b-2 border-[#FF613c]"
                      ></div>
                      <span>Searching...</span>
                    </div>
                  </div>

                  <!-- No results -->
                  <div
                    v-else-if="
                      !isSearchLoading &&
                      filteredProducts.length === 0 &&
                      productSearch.length >= 2
                    "
                    class="p-3 text-center text-gray-500 text-sm"
                  >
                    No products found
                  </div>

                  <!-- Product results -->
                  <div
                    v-for="product in filteredProducts"
                    :key="product.id"
                    @click="selectProduct(product)"
                    class="p-2 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-b-0"
                  >
                    <div class="font-medium">{{ product.name }}</div>
                    <div class="text-xs text-gray-500">
                      {{ product.company_legal_name || product.legal_name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Company Legal Name (Auto-filled) -->
            <div>
              <p class="text-xs pb-1.5 font-medium">Company Legal Name</p>
              <input
                v-model="formData.company_legal_name"
                type="text"
                placeholder="Auto-filled from product"
                :disabled="true"
                class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full bg-gray-100 cursor-not-allowed"
                readonly
              />
            </div>

            <!-- Receipt Date -->
            <div>
              <p class="text-xs pb-1.5 font-medium">Receipt Date</p>
              <div
                class="flex justify-between border text-xs border-gray-200 pl-4 items-center rounded-lg w-full focus-within:ring-2 focus-within:ring-[#FF613c]/20 focus-within:border-[#FF613c]"
              >
                <p class="text-start text-xs" v-if="formData?.receipt_date">
                  {{
                    formData.receipt_date.includes("T")
                      ? formatDate(formData.receipt_date)
                      : formatDateFromDb(formData.receipt_date)
                  }}
                </p>
                <p></p>
                <input
                  type="datetime-local"
                  v-model="formData.receipt_date"
                  :disabled="loading.action"
                  format="YYYY-MM-DD HH:mm:ss"
                  class="w-[35px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <!-- Service Start Date -->
            <div>
              <p class="text-xs pb-1.5 font-medium">Service Start Date</p>
              <div
                class="flex justify-between border text-xs border-gray-200 pl-4 items-center rounded-lg w-full focus-within:ring-2 focus-within:ring-[#FF613c]/20 focus-within:border-[#FF613c]"
              >
                <p
                  class="text-start text-xs"
                  v-if="formData?.service_start_date"
                >
                  {{
                    formData.service_start_date.includes("T")
                      ? formatDate(formData.service_start_date)
                      : formatDateFromDb(formData.service_start_date)
                  }}
                </p>
                <p></p>
                <input
                  type="datetime-local"
                  v-model="formData.service_start_date"
                  :disabled="loading.action"
                  format="YYYY-MM-DD HH:mm:ss"
                  class="w-[35px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <!-- Service End Date -->
            <div>
              <p class="text-xs pb-1.5 font-medium">Service End Date</p>
              <div
                class="flex justify-between border text-xs border-gray-200 pl-4 items-center rounded-lg w-full focus-within:ring-2 focus-within:ring-[#FF613c]/20 focus-within:border-[#FF613c]"
              >
                <p class="text-start text-xs" v-if="formData?.service_end_date">
                  {{
                    formData.service_end_date.includes("T")
                      ? formatDate(formData.service_end_date)
                      : formatDateFromDb(formData.service_end_date)
                  }}
                </p>
                <p></p>
                <input
                  type="datetime-local"
                  v-model="formData.service_end_date"
                  :disabled="loading.action"
                  format="YYYY-MM-DD HH:mm:ss"
                  class="w-[35px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <!-- Total Tax Withheld -->
            <div>
              <p class="text-xs pb-1.5 font-medium">Total Tax Withheld</p>
              <input
                type="number"
                step="0.01"
                v-model="formData.total_tax_withold"
                placeholder="Enter tax withheld amount"
                :disabled="loading.action"
                class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20 focus:border-[#FF613c] disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>

            <!-- Total Tax Amount -->
            <div>
              <p class="text-xs pb-1.5 font-medium">Total Before Tax</p>
              <input
                type="number"
                step="0.01"
                v-model="formData.total_tax_amount"
                placeholder="Enter tax amount"
                :disabled="loading.action"
                class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20 focus:border-[#FF613c] disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>

            <!-- Total After Tax (Auto-calculated) -->
            <div>
              <p class="text-xs pb-1.5 font-medium">Total After Tax</p>
              <input
                type="number"
                step="0.01"
                v-model="formData.total_after_tax"
                placeholder="Auto-calculated"
                :disabled="true"
                class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full bg-gray-100 cursor-not-allowed"
                readonly
              />
            </div>
          </div>

          <!-- Image Upload Section -->
          <div class="col-span-2">
            <!-- Existing Image -->
            <div
              v-if="formData.file && !invoicePreview"
              class="w-full h-[200px]"
            >
              <img
                :src="formData.file"
                class="rounded-lg shadow hover:shadow-none h-full object-contain object-left w-full cursor-pointer"
                alt="Current invoice document"
                @click="showPassport = true"
              />
            </div>

            <!-- Upload Area -->
            <div
              v-else-if="!formData.file && !invoicePreview"
              @click="openFileUpload"
              :class="getUploadAreaClass()"
              class="w-full col-span-3 h-[300px] border rounded-lg border-dashed flex justify-center items-center text-[#FF613c] border-[#FF613c] transition-colors"
            >
              <PlusCircleIcon class="w-8 h-8 text-[#FF613c]" />
              <span class="ml-2 text-sm">Upload Invoice Image</span>
            </div>

            <!-- Preview New Image -->
            <div v-else-if="invoicePreview" class="w-full col-span-3 h-[300px]">
              <img
                :src="invoicePreview"
                @click="openFileUpload"
                class="rounded-lg shadow hover:shadow-none h-full object-contain w-full cursor-pointer"
                alt="Invoice preview"
              />
            </div>

            <!-- Hidden File Input -->
            <input
              type="file"
              ref="featureImageInput"
              class="hidden"
              @change="handleFileChange"
              accept="image/*"
              :disabled="loading.action"
            />
          </div>

          <!-- Action Buttons -->
          <div
            class="flex justify-end text-[#FF613c] absolute bottom-2 items-center w-full col-span-2 border-t pt-3 space-x-3 px-7"
          >
            <div class="flex justify-end items-center space-x-2">
              <!-- Save/Update Button -->
              <button
                @click="handleSaveOrUpdate"
                :disabled="loading.action || !isFormValid"
                class="px-3 py-1 bg-green-500 text-white text-[12px] rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <span
                  v-if="loading.action && currentAction === 'save'"
                  class="mr-1"
                >
                  <svg class="animate-spin h-3 w-3" viewBox="0 0 24 24">
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                      fill="none"
                    />
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </span>
                {{ formData.id ? "Update" : "Save" }}
              </button>

              <button
                v-if="formData.id"
                @click="handleDelete"
                :disabled="loading.action"
                class="px-3 py-1 bg-red-600 text-white border border-gray-300 text-[12px] rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <span
                  v-if="loading.action && currentAction === 'delete'"
                  class="mr-1"
                >
                  <svg class="animate-spin h-3 w-3" viewBox="0 0 24 24">
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                      fill="none"
                    />
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </span>
                Delete
              </button>

              <!-- Cancel Button -->
              <button
                @click="resetForm"
                :disabled="loading.action"
                class="px-3 py-1 bg-white border border-gray-300 text-[12px] rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Initial Loading State -->
  <div v-else class="flex items-center justify-center h-96">
    <div class="text-center">
      <svg
        class="animate-spin h-8 w-8 text-[#FF613c] mx-auto mb-4"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
          fill="none"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <p class="text-gray-500">Loading invoice data...</p>
    </div>
  </div>
</template>

<script setup>
import { PlusCircleIcon, UserCircleIcon } from "@heroicons/vue/24/outline";
import { onMounted, ref, computed, onUnmounted, watch } from "vue";
import { useGroupStore } from "../../stores/group";
import { useEntranceStore } from "../../stores/entrance";
import { useHotelStore } from "../../stores/hotel";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";

// Props
const props = defineProps({
  detail: Object,
  getDetailAction: Function,
});

// Composables
const groupStore = useGroupStore();
const hotelStore = useHotelStore();
const entranceStore = useEntranceStore();
const route = useRoute();
const toast = useToast();

// Loading states
const loading = ref({
  initial: true,
  list: false,
  action: false,
});

const currentAction = ref("");

// Reactive data
const formData = ref({
  id: "",
  product_type: "",
  product_id: null,
  company_legal_name: "",
  receipt_date: "",
  service_start_date: "",
  service_end_date: "",
  receipt_image: null,
  total_tax_withold: 0,
  total_tax_amount: 0,
  total_after_tax: 0,
  invoice_number: "",
  file: "",
});

const invoiceLists = ref([]);
const featureImageInput = ref(null);
const invoicePreview = ref("");
const invoiceFile = ref(null);

// Product search related
const productSearch = ref("");
const showDropdown = ref(false);
const filteredProducts = ref([]);
const isSearchLoading = ref(false);
const searchTimeout = ref(null);

// Computed properties
const isFormValid = computed(() => {
  return formData.value.product_type && formData.value.product_id;
});

// CSS class helpers
const getListItemClass = (invoiceId) => {
  return invoiceId === formData.value.id ? "bg-[#FF613c]" : "";
};

const getIconWrapperClass = (invoiceId) => {
  return invoiceId === formData.value.id ? "bg-[#FF613c]/30" : "bg-[#FF613c]/5";
};

const getIconClass = (invoiceId) => {
  return invoiceId === formData.value.id ? "text-white" : "text-[#FF613c]";
};

const getTextClass = (invoiceId) => {
  return invoiceId === formData.value.id ? "text-white" : "text-[#FF613c]";
};

const getUploadAreaClass = () => {
  return loading.value.action
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer hover:bg-[#FF613c]/5";
};

// Utility methods (keeping original date formatting logic)
const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

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
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

const formatDateFromDb = (dateString) => {
  const [datePart, timePart] = dateString.split(" ");
  const [day, month, year] = datePart.split("-");
  const monthNames = [
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
  const monthName = monthNames[parseInt(month) - 1];
  return `${day}/${monthName}/${year} ${timePart}`;
};

const formatDateDb = (dateString) => {
  if (!dateString) return "";

  if (dateString.includes("T")) {
    return dateString.replace("T", " ");
  }

  const ddmmyyyyRegex = /^(\d{2})-(\d{2})-(\d{4})\s(.*)$/;
  const match = dateString.match(ddmmyyyyRegex);

  if (match) {
    return `${match[3]}-${match[2]}-${match[1]} ${match[4]}`;
  }

  return dateString;
};

// Methods
const selectInvoice = (invoice, index) => {
  if (loading.value.action) return;

  console.log(invoice, "this is data");
  formData.value = {
    id: invoice.id,
    file: invoice.file,
    product_type: invoice.meta.product_type || "",
    product_id: invoice.meta.product_id || null,
    company_legal_name: invoice.meta.company_legal_name || "",
    receipt_date: invoice.meta.receipt_date || "",
    service_start_date: invoice.meta.service_start_date || "",
    service_end_date: invoice.meta.service_end_date || "",
    receipt_image: invoice.meta.receipt_image || null,
    total_tax_withold: invoice.meta.total_tax_withold || 0,
    total_tax_amount: invoice.meta.total_tax_amount || 0,
    total_after_tax: invoice.meta.total_after_tax || 0,
    invoice_number: invoice.meta.invoice_number || "",
  };

  // Set product search field if available
  if (invoice.meta.product_name) {
    productSearch.value = invoice.meta.product_name;
  }

  invoicePreview.value = "";
  invoiceFile.value = null;
};

// Product search and selection methods
const onProductTypeChange = () => {
  // Reset product selection when type changes
  formData.value.product_id = null;
  formData.value.company_legal_name = "";
  productSearch.value = "";
  filteredProducts.value = [];
  showDropdown.value = false;

  // Clear any pending search timeout
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
};

const onProductSearch = async () => {
  // Clear existing timeout
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  // Set new timeout for debouncing (500ms delay)
  searchTimeout.value = setTimeout(async () => {
    console.log("Searching for:", productSearch.value);

    // Don't search if input is empty or less than 2 characters
    if (!productSearch.value || productSearch.value.length < 2) {
      filteredProducts.value = [];
      showDropdown.value = false;
      return;
    }

    if (!formData.value.product_type) {
      toast.error("Please select product type first");
      return;
    }

    isSearchLoading.value = true;
    let response = null;

    try {
      if (formData.value.product_type === "App\\Models\\Hotel") {
        response = await hotelStore.getListAction({
          search: productSearch.value,
          limit: 10,
        });
      } else if (
        formData.value.product_type === "App\\Models\\EntranceTicket"
      ) {
        response = await entranceStore.getListAction({
          search: productSearch.value,
          limit: 10,
        });
      }

      filteredProducts.value = response?.result?.data || [];
      showDropdown.value = true;
    } catch (error) {
      console.error("Search error:", error);
      filteredProducts.value = [];
      toast.error("Failed to search products");
    } finally {
      isSearchLoading.value = false;
    }
  }, 500);
};

const selectProduct = (product) => {
  formData.value.product_id = product.id;
  formData.value.company_legal_name =
    product.legal_name || product.company_legal_name || "";
  productSearch.value = product.name;
  showDropdown.value = false;

  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
};

const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];
  if (selectedFile) {
    invoiceFile.value = selectedFile;
    invoicePreview.value = URL.createObjectURL(selectedFile);
  }
};

const openFileUpload = () => {
  if (!loading.value.action) {
    featureImageInput.value?.click();
  }
};

const resetForm = () => {
  formData.value = {
    id: "",
    product_type: "",
    product_id: null,
    company_legal_name: "",
    receipt_date: "",
    service_start_date: "",
    service_end_date: "",
    receipt_image: null,
    total_tax_withold: 0,
    total_tax_amount: 0,
    total_after_tax: 0,
    invoice_number: "",
    file: "",
  };

  // Reset product search
  productSearch.value = "";
  filteredProducts.value = [];
  showDropdown.value = false;

  invoicePreview.value = "";
  invoiceFile.value = null;

  // Clear file input
  if (featureImageInput.value) {
    featureImageInput.value.value = "";
  }

  // Clear any pending search timeout
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
};

const fetchInvoiceList = async () => {
  try {
    loading.value.list = true;
    const id = route.query.id;
    const response = await groupStore.groupDocumentList(id, {
      document_type: "booking_confirm_letter",
    });

    console.log(response);
    if (response?.result) {
      invoiceLists.value = response.result;
    }
  } catch (error) {
    console.error("Error fetching invoice list:", error);
    toast.error("Failed to load invoice list");
  } finally {
    loading.value.list = false;
  }
};

const createNewInvoice = async () => {
  try {
    loading.value.action = true;
    currentAction.value = "save";

    const frmData = new FormData();

    // Document type
    frmData.append("document_type", "booking_confirm_letter");

    // Documents array - note the array notation
    frmData.append("documents[0][file]", invoiceFile.value);

    // Meta data for the first document
    frmData.append(
      "documents[0][meta][total_tax_amount]",
      formData.value.total_tax_amount
    );
    frmData.append(
      "documents[0][meta][total_tax_withold]",
      formData.value.total_tax_withold
    );
    frmData.append(
      "documents[0][meta][company_legal_name]",
      formData.value.company_legal_name
    );
    frmData.append(
      "documents[0][meta][receipt_date]",
      formData.value.receipt_date
    );
    frmData.append(
      "documents[0][meta][service_start_date]",
      formData.value.service_start_date
    );
    frmData.append(
      "documents[0][meta][service_end_date]",
      formData.value.service_end_date
    );
    frmData.append("documents[0][meta][product_id]", formData.value.product_id);
    frmData.append(
      "documents[0][meta][product_name]",
      productSearch.value || formData.value.product_name
    );

    frmData.append(
      "documents[0][meta][product_type]",
      formData.value.product_type
    );
    frmData.append(
      "documents[0][meta][total_after_tax]",
      formData.value.total_after_tax
    );
    frmData.append(
      "documents[0][meta][invoice_number]",
      formData.value.invoice_number
    );

    const response = await groupStore.groupDocumentCreateAction(
      frmData,
      route.query.id
    );

    console.log(response, "this is res");

    if (response?.status === "Request was successful.") {
      toast.success("Invoice successfully added");
      resetForm();
      await fetchInvoiceList();
    } else {
      throw new Error("Failed to create invoice");
    }
  } catch (error) {
    console.error("Error creating invoice:", error);
    toast.error("Failed to add invoice");
  } finally {
    loading.value.action = false;
    currentAction.value = "";
  }
};

const updateInvoice = async () => {
  try {
    loading.value.action = true;
    currentAction.value = "save";

    const frmData = new FormData();

    // Document type
    frmData.append("document_type", "booking_confirm_letter");

    // Single file (not array)
    if (invoiceFile.value) {
      frmData.append("file", invoiceFile.value);
    }

    // Meta data as individual fields
    frmData.append("meta[product_type]", formData.value.product_type);
    frmData.append("meta[product_id]", formData.value.product_id);
    frmData.append("meta[product_name]", productSearch.value);
    frmData.append(
      "meta[company_legal_name]",
      formData.value.company_legal_name
    );
    frmData.append(
      "meta[receipt_date]",
      formatDateDb(formData.value.receipt_date)
    );
    frmData.append(
      "meta[service_start_date]",
      formatDateDb(formData.value.service_start_date)
    );
    frmData.append(
      "meta[service_end_date]",
      formatDateDb(formData.value.service_end_date)
    );
    frmData.append("meta[total_tax_withold]", formData.value.total_tax_withold);
    frmData.append("meta[total_tax_amount]", formData.value.total_tax_amount);
    frmData.append("meta[total_after_tax]", formData.value.total_after_tax);
    frmData.append("meta[invoice_number]", formData.value.invoice_number);

    frmData.append("_method", "PUT");

    const response = await groupStore.groupDocumentUpdateAction(
      frmData,
      route.query.id,
      formData.value.id
    );

    console.log(response, "this is res");

    if (response?.status === "Request was successful.") {
      toast.success("Invoice successfully updated");
      resetForm();
      await fetchInvoiceList();
    } else {
      throw new Error("Failed to update invoice");
    }
  } catch (error) {
    console.error("Error updating invoice:", error);
    toast.error("Failed to update invoice");
  } finally {
    loading.value.action = false;
    currentAction.value = "";
  }
};

const deleteInvoice = async () => {
  try {
    loading.value.action = true;
    currentAction.value = "delete";

    const response = await groupStore.groupDocumentDeleteAction(
      route.query.id,
      formData.value.id
    );

    console.log(response, "this is res");

    if (response?.status === "Request was successful.") {
      toast.success("Invoice successfully deleted");
      resetForm();
      await fetchInvoiceList();
    } else {
      throw new Error("Failed to delete invoice");
    }
  } catch (error) {
    console.error("Error deleting invoice:", error);
    toast.error("Failed to delete invoice");
  } finally {
    loading.value.action = false;
    currentAction.value = "";
  }
};

// Event handlers
const handleSaveOrUpdate = () => {
  if (!isFormValid.value || loading.value.action) return;

  if (formData.value.id) {
    updateInvoice();
  } else {
    createNewInvoice();
  }
};

const handleDelete = () => {
  if (loading.value.action) return;

  if (confirm("Are you sure you want to delete this invoice?")) {
    deleteInvoice();
  }
};

// Click outside handler
const handleClickOutside = (event) => {
  if (!event.target.closest(".relative")) {
    showDropdown.value = false;
  }
};

// Lifecycle
onMounted(async () => {
  try {
    loading.value.initial = true;
    await fetchInvoiceList();

    // Add click outside listener for dropdown
    document.addEventListener("click", handleClickOutside);
  } finally {
    loading.value.initial = false;
  }
});

// Cleanup
onUnmounted(() => {
  if (invoicePreview.value) {
    URL.revokeObjectURL(invoicePreview.value);
  }

  // Remove click outside listener
  document.removeEventListener("click", handleClickOutside);

  // Clear any pending search timeout
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
});

// Watch for tax calculation
watch(
  () => [formData.value.total_tax_withold, formData.value.total_tax_amount],
  ([withheld, amount]) => {
    // Auto-calculate total after tax
    if (withheld != null && amount != null) {
      formData.value.total_after_tax = Number(amount) + Number(withheld);
    } else {
      formData.value.total_after_tax = 0;
    }
  },
  { immediate: true, deep: true }
);
</script>
