<template>
  <div>
    <div class="grid gap-4 relative grid-cols-3">
      <!-- LEFT SIDE - Tax Receipt List -->
      <transition name="slide">
        <div
          class="border shadow-sm rounded-lg p-4"
          :class="{
            hidden: showSide == 2,
            'col-span-1': showSide == 1,
            'col-span-2': showSide == 3,
          }"
        >
          <!-- Tax Receipt List -->
          <div
            v-if="!loading"
            class="bg-white shadow rounded-lg divide-y divide-gray-100 max-h-[65vh] overflow-y-scroll"
          >
            <div
              v-for="receipt in taxReceipts?.data ?? []"
              :key="receipt.id"
              @click="getDetailAction(receipt.id)"
            >
              <ListTax :data="receipt" :selectedId="selectedReceiptId" />
            </div>
          </div>

          <!-- Pagination -->
          <div class="overflow-x-scroll no-sidebar-container py-2">
            <Pagination
              v-if="!loading"
              :data="taxReceipts"
              @change-page="changePage"
            />
          </div>

          <!-- Loading State -->
          <div
            v-if="loading"
            class="bg-white shadow rounded-lg divide-y-4 divide-gray-200 max-h-[65vh] overflow-y-scroll"
          >
            <div v-for="i in 10" :key="i">
              <div class="animate-pulse p-4">
                <div class="flex items-center space-x-4">
                  <div class="rounded-lg bg-gray-200 h-12 w-12"></div>
                  <div class="flex-1 space-y-2">
                    <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div class="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- RIGHT SIDE - Tax Receipt Detail/Form -->
      <transition name="slide">
        <div
          class="relative"
          :class="{
            'col-span-2': showSide == 1,
            'col-span-1': showSide == 3,
            'col-span-3': showSide == 2,
          }"
        >
          <!-- View Toggle Buttons -->
          <div class="absolute -top-4 -left-0 z-20">
            <ChevronLeftIcon
              class="w-6 cursor-pointer h-6 bg-white shadow-md border border-gray-200 p-1.5 rounded-full hover:bg-gray-50"
              @click="showSide = 2"
              v-if="showSide == 1"
            />
            <ChevronRightIcon
              class="w-6 cursor-pointer h-6 bg-white shadow-md border border-gray-200 p-1.5 rounded-full hover:bg-gray-50"
              @click="showSide = 1"
              v-if="showSide == 2"
            />
          </div>
          <div class="absolute -top-4 -left-10 z-20">
            <ChevronRightIcon
              class="w-6 cursor-pointer h-6 bg-white shadow-md border border-gray-200 p-1.5 rounded-full hover:bg-gray-50"
              @click="showSide = 3"
              v-if="showSide == 1"
            />
            <ChevronLeftIcon
              class="w-6 cursor-pointer h-6 bg-white shadow-md border border-gray-200 p-1.5 rounded-full hover:bg-gray-50"
              @click="showSide = 1"
              v-if="showSide == 3"
            />
          </div>

          <!-- Detail Content -->
          <div
            class="border shadow-sm relative rounded-lg p-4 h-[85vh] transition duration-150 overflow-y-scroll no-scrollbar"
          >
            <!-- Loading state -->
            <div
              v-if="formLoading"
              class="flex justify-center items-center py-8"
            >
              <div
                class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF613c]"
              ></div>
              <span class="ml-2 text-gray-600">Loading tax receipt...</span>
            </div>

            <!-- Main content -->
            <div v-else>
              <!-- Edit mode indicator -->
              <div
                v-if="isEditMode"
                class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <svg
                      class="w-5 h-5 text-blue-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span class="text-blue-800 font-medium"
                      >Editing Tax Receipt #{{ selectedReceiptId }}</span
                    >
                  </div>
                  <div class="flex justify-end items-center space-x-2">
                    <button
                      @click="deleteTaxReceipt"
                      class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                    <button
                      @click="cancelEdit"
                      class="text-blue-600 hover:text-blue-800 bg-blue-600/10 hover:bg-blue-600/20 px-3 py-1 rounded text-sm font-medium"
                    >
                      Cancel Edit
                    </button>
                  </div>
                </div>
              </div>

              <div class="flex justify-between items-center mb-4">
                <p class="text-lg font-medium text-[#FF613c]">
                  {{ isEditMode ? "Edit Tax Receipt" : "Tax Receipt" }}
                </p>
                <button
                  v-if="!isEditMode"
                  @click="createNewTax"
                  class="bg-[#FF613c] px-3 py-1.5 rounded-xl text-white text-xs hover:bg-[#e5552f] transition-colors"
                >
                  + Create New Tax
                </button>
              </div>

              <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-4">
                <div class="space-y-3 pt-2">
                  <div class="space-y-1.5">
                    <label class="text-xs">Invoice Number</label>
                    <input
                      v-model="formData.invoice_number"
                      type="text"
                      placeholder="Enter invoice number"
                      class="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm rounded-lg p-2"
                      required
                    />
                  </div>

                  <!-- Product Type -->
                  <div class="space-y-1.5">
                    <label class="text-xs pb-1">Product Type *</label>
                    <select
                      v-model="formData.product_type"
                      @change="onProductTypeChange"
                      class="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm rounded-lg p-2"
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
                  <div class="space-y-1.5 pt-1">
                    <div class="flex justify-between items-center pb-1">
                      <label class="text-xs">Product Name *</label>
                      <p
                        class="text-xs text-blue-500 cursor-pointer"
                        @click="goToProductDetail"
                      >
                        Go to product Detail &#128279;
                      </p>
                    </div>
                    <div class="relative">
                      <input
                        v-model="productSearch"
                        @input="onProductSearch"
                        @focus="showDropdown = true"
                        type="text"
                        placeholder="Search product..."
                        class="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm rounded-lg p-2"
                        :disabled="!formData.product_type"
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
                          <div
                            class="flex items-center justify-center space-x-2"
                          >
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
                          class="p-2 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-b-0"
                        >
                          <div class="font-medium">{{ product.name }}</div>
                          <div class="text-xs text-gray-500">
                            {{
                              product.company_legal_name || product.legal_name
                            }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Company Legal Name -->
                  <div class="space-y-1.5">
                    <label class="text-xs">Company Legal Name</label>
                    <input
                      v-model="formData.company_legal_name"
                      type="text"
                      class="w-full border border-gray-300 bg-gray-100 text-sm rounded-lg p-2 cursor-not-allowed"
                      disabled
                      readonly
                    />
                  </div>

                  <!-- Receipt Date -->
                  <div class="space-y-1.5">
                    <label class="text-xs">Receipt Date *</label>
                    <input
                      v-model="formData.receipt_date"
                      type="date"
                      class="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm rounded-lg p-2"
                      required
                    />
                  </div>

                  <div class="flex justify-between items-center">
                    <label class="text-sm">Is single date ?</label>
                    <input
                      v-model="IsSingleDate"
                      type="checkbox"
                      class="focus:outline-none w-5 h-5 text-sm rounded-lg p-2"
                    />
                  </div>

                  <!-- Service Start Date -->
                  <div class="space-y-1.5">
                    <label class="text-xs">Service Start Date *</label>
                    <input
                      v-model="formData.service_start_date"
                      type="date"
                      class="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm rounded-lg p-2"
                      required
                    />
                  </div>

                  <!-- Service End Date -->
                  <div class="space-y-1.5" v-if="!IsSingleDate">
                    <label class="text-xs">Service End Date *</label>
                    <input
                      v-model="formData.service_end_date"
                      type="date"
                      class="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm rounded-lg p-2"
                      :min="formData.service_start_date"
                      required
                    />
                  </div>
                </div>

                <div class="space-y-3 pt-2">
                  <!-- Tax Image Upload -->
                  <div class="space-y-1.5">
                    <label class="text-xs pb-1">Tax Image *</label>
                    <div class="w-full">
                      <input
                        ref="fileInput"
                        @change="onFileChange"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        :required="!isEditMode"
                      />

                      <div
                        @click="triggerFileInput"
                        @dragover.prevent
                        @drop.prevent="onFileDrop"
                        class="w-full h-[200px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:border-blue-400 transition-colors"
                        :class="{ 'border-blue-400 bg-blue-50': isDragOver }"
                      >
                        <div v-if="!imagePreview" class="text-center">
                          <svg
                            class="w-8 h-8 text-gray-400 mx-auto mb-2"
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
                          <p class="text-gray-400 text-sm">
                            {{
                              isEditMode
                                ? "Change tax image"
                                : "Upload tax image here"
                            }}
                          </p>
                          <p class="text-gray-300 text-xs mt-1">
                            Click or drag & drop
                          </p>
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
                            class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Total Tax Amount -->
                  <div class="space-y-1.5">
                    <label class="text-xs">Total Before Tax *</label>
                    <input
                      v-model.number="formData.total_tax_amount"
                      type="number"
                      step="0.01"
                      min="0"
                      class="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm rounded-lg p-2"
                      required
                    />
                  </div>

                  <!-- Total Tax Withhold -->
                  <div class="space-y-1.5">
                    <label class="text-xs">Total Tax Withhold *</label>
                    <input
                      v-model.number="formData.total_tax_withold"
                      type="number"
                      step="0.01"
                      min="0"
                      class="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm rounded-lg p-2"
                      required
                    />
                  </div>

                  <!-- Total After Tax -->
                  <div class="space-y-1.5">
                    <label class="text-xs">Total After Tax</label>
                    <input
                      v-model.number="formData.total_after_tax"
                      type="number"
                      step="0.01"
                      class="w-full border border-gray-300 text-sm rounded-lg p-2"
                    />
                  </div>

                  <!-- Submit Button -->
                  <div class="pt-4">
                    <button
                      type="submit"
                      class="w-full bg-blue-600 text-sm text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      :disabled="formLoading"
                    >
                      {{
                        isEditMode ? "Update Tax Receipt" : "Create Tax Receipt"
                      }}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import Pagination from "../../components/PaginationExpense.vue";
import ListTax from "../TaxComponent/ListTax.vue";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useEntranceStore } from "../../stores/entrance";
import { useHotelStore } from "../../stores/hotel";
import { useTaxReceiptStore } from "../../stores/taxReceipt";
import { storeToRefs } from "pinia";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";

const route = useRoute();
const hotelStore = useHotelStore();
const entranceStore = useEntranceStore();
const taxReceiptStore = useTaxReceiptStore();
const { taxReceipts, loading } = storeToRefs(taxReceiptStore);
const toast = useToast();

// Layout controls
const showSide = ref(1);

// Selected receipt ID for highlighting
const selectedReceiptId = ref(null);

const props = defineProps({
  detail: Object,
  getDetailAction: Function,
});

// Reactive form data
const formData = reactive({
  id: null,
  product_type: props.detail?.items[0]?.product_type,
  product_id: props.detail?.items[0]?.product?.id,
  company_legal_name: props.detail?.items[0]?.product?.legal_name,
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
const productSearch = ref(props.detail?.items[0]?.product?.name || "");
const showDropdown = ref(false);
const imagePreview = ref("");
const isDragOver = ref(false);
const fileInput = ref(null);
const filteredProducts = ref([]);
const isSearchLoading = ref(false);
const searchTimeout = ref(null);
const formLoading = ref(false);

// Computed
const isEditMode = computed(() => !!selectedReceiptId.value);
const IsSingleDate = ref(false);

const getAllAction = async () => {
  await taxReceiptStore.getListAction({
    group_id: route.query.id,
  });
};

const getDetailAction = (id) => {
  selectedReceiptId.value = id;
  loadTaxReceiptDetail(id);
};

const changePage = async (url) => {
  await taxReceiptStore.getChangePage(url);
};

// Methods
const loadTaxReceiptDetail = async (id) => {
  try {
    formLoading.value = true;
    const response = await taxReceiptStore.getDetailAction(id);
    const data = response.result;

    // Fill form with existing data
    formData.id = data.id;
    formData.product_type = data.product_type;
    formData.product_id = data.product_id;
    formData.invoice_number = data.invoice_number || "";
    formData.company_legal_name = data.company_legal_name;
    formData.receipt_date = data.receipt_date;
    formData.service_start_date = data.service_start_date;
    formData.service_end_date = data.service_end_date;
    formData.total_tax_withold = parseFloat(data.total_tax_withold || 0);
    formData.total_tax_amount = parseFloat(data.total_tax_amount || 0);
    formData.total_after_tax = parseFloat(data.total_after_tax || 0);

    // Set product search and image preview
    if (data.product) {
      productSearch.value = data.product.name;
    }

    if (data.receipt_image) {
      imagePreview.value = data.receipt_image.startsWith("http")
        ? data.receipt_image
        : `${window.location.origin}${data.receipt_image}`;
    }
  } catch (error) {
    console.error("Error loading tax receipt:", error);
    toast.error("Failed to load tax receipt data");
  } finally {
    formLoading.value = false;
  }
};

const onProductTypeChange = () => {
  if (!isEditMode.value) {
    formData.product_id = null;
    formData.company_legal_name = "";
    productSearch.value = "";
  }

  filteredProducts.value = [];
  showDropdown.value = false;

  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
};

const onProductSearch = async () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  searchTimeout.value = setTimeout(async () => {
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

const createNewTax = () => {
  Object.keys(formData).forEach((key) => {
    if (typeof formData[key] === "string") {
      formData[key] = "";
    } else if (typeof formData[key] === "number") {
      formData[key] = 0;
    } else {
      formData[key] = null;
    }
  });

  productSearch.value = "";
  imagePreview.value = "";

  const today = new Date().toISOString().split("T")[0];
  formData.receipt_date = today;
};

const cancelEdit = () => {
  createNewTax();
  selectedReceiptId.value = null;
};

const submitForm = async () => {
  const requiredFields = [
    "product_type",
    "product_id",
    "receipt_date",
    "service_start_date",
    "service_end_date",
    "total_tax_withold",
    "total_tax_amount",
    "invoice_number",
  ];

  if (!isEditMode.value) {
    requiredFields.push("receipt_image");
  }

  for (const field of requiredFields) {
    if (!formData[field] && formData[field] !== 0) {
      toast.error(`Please fill in ${field.replace("_", " ")}`);
      return;
    }
  }

  if (formData.service_end_date < formData.service_start_date) {
    toast.error("Service end date must be after start date");
    return;
  }

  try {
    formLoading.value = true;

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "") {
        submitData.append(key, formData[key]);
      }
    });

    // Add group_ids if route has group id (for both create and update)
    if (route.query.id) {
      submitData.append("group_ids[]", route.query.id);
    }

    if (isEditMode.value) {
      submitData.append("_method", "PUT");
      const res = await taxReceiptStore.updateAction(
        submitData,
        selectedReceiptId.value
      );

      if (res.status == "Request was successful.") {
        toast.success("Tax receipt updated successfully!");
        await getAllAction();
      }
    } else {
      const res = await taxReceiptStore.addNewAction(submitData);

      if (res.status == "Request was successful.") {
        toast.success("Tax receipt created successfully!");
        createNewTax();
        await getAllAction();
      }
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    toast.error(
      isEditMode.value
        ? "Failed to update tax receipt"
        : "Failed to create tax receipt"
    );
  } finally {
    formLoading.value = false;
  }
};

const deleteTaxReceipt = async () => {
  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete Tax Receipt #${selectedReceiptId.value}? This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      formLoading.value = true;

      await taxReceiptStore.deleteAction(selectedReceiptId.value);

      await Swal.fire({
        title: "Deleted!",
        text: "Tax receipt has been deleted successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      toast.success("Tax receipt deleted successfully!");
      createNewTax();
      selectedReceiptId.value = null;
      await getAllAction();
    }
  } catch (error) {
    console.error("Error deleting tax receipt:", error);

    await Swal.fire({
      title: "Error!",
      text: "Failed to delete tax receipt. Please try again.",
      icon: "error",
      confirmButtonColor: "#ef4444",
    });

    toast.error("Failed to delete tax receipt");
  } finally {
    formLoading.value = false;
  }
};

const handleClickOutside = (event) => {
  if (!event.target.closest(".relative")) {
    showDropdown.value = false;
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
  () => IsSingleDate.value,
  () => {
    if (IsSingleDate.value) {
      formData.service_end_date = formData.service_start_date;
    }
  }
);

onMounted(async () => {
  document.addEventListener("click", handleClickOutside);
  await getAllAction();

  const today = new Date().toISOString().split("T")[0];
  formData.receipt_date = today;
});
</script>

<style scoped>
.slide-enter-active {
  animation: slideIn 0.3s ease-out;
}

.slide-leave-active {
  animation: slideOut 0.3s ease-in;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.no-sidebar-container::-webkit-scrollbar {
  display: none;
}

.no-sidebar-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
