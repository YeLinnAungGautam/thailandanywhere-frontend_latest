<template>
  <!-- Modal Backdrop -->
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click="closeModal"
  >
    <!-- Modal Content -->
    <div
      class="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 my-4 max-h-[95vh] overflow-hidden"
      @click.stop
    >
      <!-- Modal Header -->
      <div
        class="flex items-center justify-between p-6 border-b border-gray-200"
      >
        <h2 class="text-xl font-semibold text-gray-800">Create Tax Receipt</h2>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center py-8">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF613c]"
          ></div>
          <span class="ml-2 text-gray-600">Creating tax receipt...</span>
        </div>

        <!-- Main Form -->
        <form
          v-else
          @submit.prevent="submitForm"
          class="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <!-- Left Column -->
          <div class="space-y-4">
            <!-- Invoice Number -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700"
                >Invoice Number *</label
              >
              <input
                v-model="formData.invoice_number"
                type="text"
                placeholder="Enter invoice number"
                class="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm rounded-lg p-3"
                required
              />
            </div>

            <!-- Product Type -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700"
                >Product Type *</label
              >
              <select
                v-model="formData.product_type"
                @change="onProductTypeChange"
                class="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm rounded-lg p-3"
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
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <label class="text-sm font-medium text-gray-700"
                  >Product Name *</label
                >
                <button
                  type="button"
                  @click="goToProductDetail"
                  class="text-sm text-blue-500 hover:text-blue-700"
                  :disabled="!formData.product_id"
                >
                  Go to product Detail &#128279;
                </button>
              </div>
              <div class="relative">
                <input
                  v-model="productSearch"
                  @input="onProductSearch"
                  @focus="showDropdown = true"
                  type="text"
                  placeholder="Search product..."
                  class="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm rounded-lg p-3"
                  :disabled="!formData.product_type"
                  required
                />

                <!-- Dropdown for filtered products -->
                <div
                  v-if="
                    showDropdown &&
                    (filteredProducts.length > 0 || isSearchLoading)
                  "
                  class="absolute z-20 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg"
                >
                  <!-- Loading state -->
                  <div
                    v-if="isSearchLoading"
                    class="p-3 text-center text-gray-500 text-sm"
                  >
                    <div class="flex items-center justify-center space-x-2">
                      <div
                        class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"
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
                    class="p-3 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-b-0"
                  >
                    <div class="font-medium">{{ product.name }}</div>
                    <div class="text-xs text-gray-500">
                      {{ product.company_legal_name || product.legal_name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Company Legal Name -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700"
                >Company Legal Name</label
              >
              <input
                v-model="formData.company_legal_name"
                type="text"
                class="w-full border border-gray-300 bg-gray-100 text-sm rounded-lg p-3 cursor-not-allowed"
                disabled
                readonly
              />
            </div>

            <!-- Receipt Date -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700"
                >Receipt Date *</label
              >
              <input
                v-model="formData.receipt_date"
                type="date"
                class="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm rounded-lg p-3"
                required
              />
            </div>

            <!-- Single Date Toggle -->
            <div
              class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <label class="text-sm font-medium text-gray-700"
                >Is single date?</label
              >
              <input
                v-model="isSingleDate"
                type="checkbox"
                class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>

            <!-- Service Start Date -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700"
                >Service Start Date *</label
              >
              <input
                v-model="formData.service_start_date"
                type="date"
                class="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm rounded-lg p-3"
                required
              />
            </div>

            <!-- Service End Date -->
            <div v-if="!isSingleDate" class="space-y-2">
              <label class="text-sm font-medium text-gray-700"
                >Service End Date *</label
              >
              <input
                v-model="formData.service_end_date"
                type="date"
                class="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm rounded-lg p-3"
                :min="formData.service_start_date"
                required
              />
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-4">
            <!-- Tax Image Upload -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700"
                >Tax Image *</label
              >
              <div class="w-full">
                <input
                  ref="fileInput"
                  @change="onFileChange"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  required
                />

                <div
                  @click="triggerFileInput"
                  @dragover.prevent
                  @drop.prevent="onFileDrop"
                  class="w-full h-[250px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:border-blue-400 transition-colors"
                  :class="{ 'border-blue-400 bg-blue-50': isDragOver }"
                >
                  <div v-if="!imagePreview" class="text-center">
                    <svg
                      class="w-12 h-12 text-gray-400 mx-auto mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p class="text-gray-400 text-sm font-medium">
                      Upload tax image here
                    </p>
                    <p class="text-gray-300 text-xs mt-1">
                      Click or drag & drop
                    </p>
                    <p class="text-gray-300 text-xs">PNG, JPG up to 5MB</p>
                  </div>

                  <div v-else class="relative w-full h-full">
                    <img
                      :src="imagePreview"
                      alt="Tax receipt preview"
                      class="w-full h-full object-contain rounded-lg"
                    />
                    <button
                      @click.stop="removeImage"
                      type="button"
                      class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total Before Tax -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700"
                >Total Before Tax *</label
              >
              <input
                v-model.number="formData.total_tax_amount"
                type="number"
                step="0.01"
                min="0"
                class="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm rounded-lg p-3"
                required
              />
            </div>

            <!-- Total Tax Withhold -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700"
                >Total Tax Withhold *</label
              >
              <input
                v-model.number="formData.total_tax_withold"
                type="number"
                step="0.01"
                min="0"
                class="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm rounded-lg p-3"
                required
              />
            </div>

            <!-- Total After Tax -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700"
                >Total After Tax</label
              >
              <input
                v-model.number="formData.total_after_tax"
                type="number"
                step="0.01"
                class="w-full border border-gray-300 bg-gray-100 text-sm rounded-lg p-3"
                readonly
              />
            </div>
          </div>
        </form>
      </div>

      <!-- Modal Footer -->
      <div
        class="flex items-center justify-end space-x-3 p-3 border-t border-gray-200 bg-gray-50"
      >
        <button
          type="button"
          @click="closeModal"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="submitForm"
          :disabled="loading"
          class="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="loading" class="flex items-center">
            <div
              class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
            ></div>
            Creating...
          </span>
          <span v-else>Create Tax Receipt</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from "vue";
import { useEntranceStore } from "../../stores/entrance";
import { useHotelStore } from "../../stores/hotel";
import { useTaxReceiptStore } from "../../stores/taxReceipt";
import { useToast } from "vue-toastification";

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  // Pre-fill data if needed
  initialData: {
    type: Object,
    default: () => ({}),
  },
});

// Emits
const emit = defineEmits(["update:modelValue", "created", "close"]);

// Stores
const hotelStore = useHotelStore();
const entranceStore = useEntranceStore();
const taxReceiptStore = useTaxReceiptStore();
const toast = useToast();

// Reactive form data
const formData = reactive({
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
});

// Component state
const productSearch = ref("");
const showDropdown = ref(false);
const imagePreview = ref("");
const isDragOver = ref(false);
const fileInput = ref(null);
const filteredProducts = ref([]);
const isSearchLoading = ref(false);
const searchTimeout = ref(null);
const loading = ref(false);
const isSingleDate = ref(false);

// Computed
const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// Methods
const closeModal = () => {
  resetForm();
  emit("close");
  isVisible.value = false;
};

const resetForm = () => {
  // Reset all form data
  Object.keys(formData).forEach((key) => {
    if (typeof formData[key] === "string") {
      formData[key] = "";
    } else if (typeof formData[key] === "number") {
      formData[key] = 0;
    } else {
      formData[key] = null;
    }
  });

  // Reset component state
  productSearch.value = "";
  imagePreview.value = "";
  showDropdown.value = false;
  filteredProducts.value = [];
  isSingleDate.value = false;

  // Clear file input
  if (fileInput.value) {
    fileInput.value.value = "";
  }

  // Set default date
  const today = new Date().toISOString().split("T")[0];
  formData.receipt_date = today;

  // Apply initial data if provided
  if (props.initialData) {
    Object.assign(formData, props.initialData);
  }
};

const onProductTypeChange = () => {
  // Reset product selection when type changes
  formData.product_id = null;
  formData.company_legal_name = "";
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
    // Don't search if input is empty or less than 2 characters
    if (!productSearch.value || productSearch.value.length < 2) {
      filteredProducts.value = [];
      showDropdown.value = false;
      return;
    }

    if (!formData.product_type) {
      toast.error("Please select product type first");
      return;
    }

    isSearchLoading.value = true;
    let res = null;

    try {
      if (formData.product_type === "App\\Models\\Hotel") {
        const response = await hotelStore.getListAction({
          search: productSearch.value,
          limit: 10,
        });
        res = response.result.data;
      } else if (formData.product_type === "App\\Models\\EntranceTicket") {
        const response = await entranceStore.getListAction({
          search: productSearch.value,
          limit: 10,
        });
        res = response.result.data;
      }

      filteredProducts.value = res || [];
      showDropdown.value = true;
    } catch (error) {
      console.error("Search error:", error);
      filteredProducts.value = [];
    } finally {
      isSearchLoading.value = false;
    }
  }, 500);
};

const selectProduct = (product) => {
  formData.product_id = product.id;
  formData.company_legal_name =
    product.legal_name || product.company_legal_name;
  productSearch.value = product.name;
  showDropdown.value = false;

  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
};

const goToProductDetail = () => {
  if (formData.product_id) {
    if (formData.product_type === "App\\Models\\Hotel") {
      window.open(`product/hotel/edit/${formData.product_id}`, "_blank");
    } else if (formData.product_type === "App\\Models\\EntranceTicket") {
      window.open(`products/6?edit=${formData.product_id}`, "_blank");
    }
  } else {
    toast.error("Please select a product first");
  }
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    handleFile(file);
  }
};

const onFileDrop = (event) => {
  isDragOver.value = false;
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) {
    handleFile(file);
  }
};

const handleFile = (file) => {
  if (file.size > 5 * 1024 * 1024) {
    toast.error("File size must be less than 5MB");
    return;
  }

  formData.receipt_image = file;

  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const removeImage = () => {
  formData.receipt_image = null;
  imagePreview.value = "";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const submitForm = async () => {
  // Validate required fields
  const requiredFields = [
    "product_type",
    "product_id",
    "receipt_date",
    "service_start_date",
    "service_end_date",
    "total_tax_withold",
    "total_tax_amount",
    "invoice_number",
    "receipt_image",
  ];

  for (const field of requiredFields) {
    if (!formData[field] && formData[field] !== 0) {
      toast.error(`Please fill in ${field.replace("_", " ")}`);
      return;
    }
  }

  // Validate date logic
  if (formData.service_end_date < formData.service_start_date) {
    toast.error("Service end date must be after start date");
    return;
  }

  try {
    loading.value = true;

    // Create FormData for file upload
    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "") {
        submitData.append(key, formData[key]);
      }
    });

    // Create new tax receipt
    const res = await taxReceiptStore.addNewAction(submitData);

    if (res.status == 1) {
      toast.success("Tax receipt created successfully!");
      emit("created", res.result); // Emit the created tax receipt data

      // Refresh the list if available
      if (taxReceiptStore.getListAction) {
        await taxReceiptStore.getListAction();
      }

      closeModal();
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    toast.error("Failed to create tax receipt");
  } finally {
    loading.value = false;
  }
};

// Handle clicks outside dropdown
const handleClickOutside = (event) => {
  if (!event.target.closest(".relative")) {
    showDropdown.value = false;
  }
};

// Handle ESC key
const handleEscKey = (event) => {
  if (event.key === "Escape" && isVisible.value) {
    closeModal();
  }
};

// Watchers
watch(
  () => [formData.total_tax_withold, formData.total_tax_amount],
  ([withheld, amount]) => {
    if (withheld != null && amount != null) {
      formData.total_after_tax = amount + withheld;
    } else {
      formData.total_after_tax = 0;
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => isSingleDate.value,
  () => {
    if (isSingleDate.value) {
      formData.service_end_date = formData.service_start_date;
    }
  }
);

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      resetForm();
    }
  }
);

// Lifecycle
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("keydown", handleEscKey);

  // Set default date
  const today = new Date().toISOString().split("T")[0];
  formData.receipt_date = today;
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("keydown", handleEscKey);

  // Clear timeout on unmount
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
});
</script>
