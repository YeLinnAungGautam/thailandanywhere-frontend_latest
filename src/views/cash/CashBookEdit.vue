<template>
  <div class="p-4 bg-white shadow rounded-lg">
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-gray-800">
        {{ formData.id ? "Edit Cash Book" : "Create Cash Book" }}
      </h3>
    </div>

    <div class="space-y-6">
      <!-- Prove Images Section -->
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <h4 class="font-medium text-gray-800">Prove Images</h4>
        </div>

        <input
          ref="inputFile"
          type="file"
          class="hidden"
          @change="onProveImageChange"
          accept="image/*"
          multiple
        />

        <div
          @click="addProveImage"
          class="border border-[#FF613c] border-dashed flex justify-center items-center text-xs text-[#FF613c] rounded h-12 p-3 cursor-pointer hover:bg-[#FF613c] transition-colors"
        >
          + Upload Prove Image
        </div>

        <div class="grid grid-cols-3 gap-2" v-if="cashBookImages.length > 0">
          <div
            v-for="(image, index) in cashBookImages"
            :key="index"
            class="relative group"
          >
            <button
              @click="removeProveImage(index)"
              class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors z-10"
            >
              ×
            </button>
            <img
              :src="image.preview || image.existing_image"
              class="h-24 w-full object-cover rounded border"
              :alt="`Prove image ${index + 1}`"
            />
          </div>
        </div>
      </div>

      <!-- Basic Information -->
      <div class="space-y-4">
        <h4 class="font-medium text-gray-800">Basic Information</h4>

        <div class="space-y-2">
          <label class="text-xs font-medium text-gray-700"
            >Reference Number</label
          >
          <input
            v-model="formData.reference_number"
            type="text"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Auto-generated if empty"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-2">
            <label class="text-xs font-medium text-gray-700">Date</label>
            <input
              v-model="formData.date_only"
              type="date"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="space-y-2">
            <label class="text-xs font-medium text-gray-700">Time</label>
            <input
              v-model="formData.time_only"
              type="time"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-medium text-gray-700">Type *</label>
          <select
            v-model="formData.income_or_expense"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Type</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-medium text-gray-700"
            >Cash Structure *</label
          >
          <select
            v-model="formData.cash_structure_id"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Structure</option>
            <option
              v-for="structure in cash_structures?.data ?? []"
              :key="structure.id"
              :value="structure.id"
            >
              {{ structure.name }}
            </option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-medium text-gray-700">Interact Bank</label>
          <select
            v-model="formData.interact_bank"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Interact Bank</option>
            <option value="personal">Personal</option>
            <option value="company">Company</option>
            <option value="cash_at_office">Cash at Office</option>
            <option value="to_money_changer">To Money Changer</option>
            <option value="deposit_management">Deposit Management</option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-medium text-gray-700">Description</label>
          <textarea
            v-model="formData.description"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="3"
            placeholder="Enter description..."
          ></textarea>
        </div>
      </div>

      <!-- Accounts Section -->
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <h4 class="font-medium text-gray-800">Accounts</h4>
          <button
            @click="addAccount"
            type="button"
            class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-xs rounded transition-colors"
          >
            Add Account
          </button>
        </div>

        <div
          v-for="(account, index) in formData.accounts"
          :key="index"
          class="border border-gray-200 rounded-lg p-3 space-y-3"
        >
          <div class="flex justify-between items-center">
            <span class="text-xs font-medium text-gray-700"
              >Account {{ index + 1 }}</span
            >
            <button
              @click="removeAccount(index)"
              type="button"
              class="text-red-500 hover:text-red-700 text-xs transition-colors"
            >
              Remove
            </button>
          </div>

          <div class="space-y-2">
            <SelectAccount
              v-model="account.id"
              :accounts="chartOfAccounts?.data ?? []"
              @change="onAccountChange($event, index)"
            />

            <input
              v-model="account.allocated_amount"
              type="number"
              step="0.01"
              min="0"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Amount"
              required
            />

            <select
              v-model="account.note"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="1">Debit ( + )</option>
              <option value="2">Credit ( - )</option>
            </select>
          </div>
        </div>

        <div
          v-if="formData.accounts.length === 0"
          class="text-center py-4 text-gray-500 text-xs"
        >
          No accounts added yet. Click "Add Account" to add an account.
        </div>
      </div>

      <!-- Slip Images Section -->
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <h4 class="font-medium text-gray-800">Slip Images (Detailed)</h4>
          <button
            @click="openSlipImageModal()"
            type="button"
            class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-xs rounded transition-colors"
          >
            Add Slip Image
          </button>
        </div>

        <div
          v-for="(image, index) in formData.images"
          :key="index"
          class="border border-blue-200 rounded-lg p-3 space-y-2"
        >
          <div class="flex justify-between items-center">
            <span class="text-xs font-medium text-gray-700">
              Slip Image {{ index + 1 }}
              <span v-if="image.is_existing" class="text-green-600 ml-1"
                >(Existing)</span
              >
              <span v-else class="text-blue-600 ml-1">(New)</span>
            </span>
            <div class="flex items-center gap-2">
              <button
                @click="openSlipImageModal(index)"
                type="button"
                class="text-blue-500 hover:text-blue-700 text-xs transition-colors"
              >
                Edit
              </button>
              <button
                @click="removeSlipImage(index)"
                type="button"
                class="text-red-500 hover:text-red-700 text-xs transition-colors"
              >
                Delete
              </button>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="relative">
              <img
                v-if="image.preview || image.existing_image"
                :src="image.preview || image.existing_image"
                class="w-16 h-16 object-cover rounded border"
                alt="Slip image preview"
              />
              <div
                v-else
                class="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center"
              >
                <svg
                  class="w-8 h-8 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div class="text-xs text-gray-600 flex-1">
              <p><strong>Sender:</strong> {{ image.sender || "Not set" }}</p>
              <p>
                <strong>Receiver:</strong> {{ image.receiver || "Not set" }}
              </p>
              <p>
                <strong>Amount:</strong> {{ image.amount || "0" }}
                {{ image.currency || "THB" }}
              </p>
              <p>
                <strong>Bank:</strong> {{ image.interact_bank || "Not set" }}
              </p>
            </div>
          </div>
        </div>

        <div
          v-if="formData.images.length === 0"
          class="text-center py-4 text-gray-500 text-xs"
        >
          No slip images added yet. Click "Add Slip Image" to upload detailed
          images.
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 pt-4">
        <button
          @click="submitForm"
          type="button"
          :disabled="loading || !isFormValid"
          :class="[
            'flex-1 px-4 py-2 text-xs font-medium rounded-lg transition-colors',
            loading || !isFormValid
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#FF613c] hover:bg-[#FF613c] text-white',
          ]"
        >
          <span v-if="loading" class="flex items-center justify-center">
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
            {{ formData.id ? "Updating..." : "Creating..." }}
          </span>
          <span v-else>
            {{ formData.id ? "Update" : "Save" }}
          </span>
        </button>
        <button
          @click="clearForm"
          type="button"
          class="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Slip Image Modal -->
    <SlipImageModal
      :isOpen="slipImageModal.isOpen"
      :imageData="slipImageModal.data"
      :isEditing="slipImageModal.isEditing"
      @close="closeSlipImageModal"
      @save="saveSlipImage"
      @update="updateSlipImage"
      @delete="deleteSlipImageFromModal"
    />

    <!-- Debug Info (remove in production) -->
    <div v-if="false" class="mt-4 p-2 bg-gray-100 text-xs">
      <p><strong>Modal State:</strong> {{ slipImageModal }}</p>
      <p><strong>Images Count:</strong> {{ formData.images.length }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useToast } from "vue-toastification";
import { useCashStructureStore } from "../../stores/cashStructure";
import { useChartOfAccountStore } from "../../stores/chartofAccount";
import { useCashBookStore } from "../../stores/cashBook";
import { useCashImageEditStore } from "../../stores/cashImageEdit";
import SelectAccount from "../../components/SelectAccount.vue";
import SlipImageModal from "../../components/ModalLayout/ImageCreate.vue";

// Store initialization
const cashStructureStore = useCashStructureStore();
const chartOfAccountStore = useChartOfAccountStore();
const cashBookStore = useCashBookStore();
const cashImageEditStore = useCashImageEditStore();
const toast = useToast();

// Store refs
const { cash_structures } = storeToRefs(cashStructureStore);
const { chartOfAccounts } = storeToRefs(chartOfAccountStore);

// Props
const props = defineProps({
  getData: {
    type: Object,
    default: null,
  },
});

// Emits
const emit = defineEmits(["refresh"]);

// Form data
const formData = ref({
  id: null,
  reference_number: "",
  date_only: new Date().toISOString().split("T")[0],
  time_only: new Date().toTimeString().slice(0, 5),
  income_or_expense: "",
  cash_structure_id: "",
  interact_bank: "",
  description: "",
  accounts: [],
  images: [], // Detailed slip images
  cash_book_images: [], // Simple prove images
});

// Local state
const loading = ref(false);
const cashBookImages = ref([]);
const inputFile = ref(null);

// Slip Image Modal state
const slipImageModal = ref({
  isOpen: false,
  data: {},
  isEditing: false,
  currentIndex: -1,
});

// Computed properties
const isFormValid = computed(() => {
  return (
    formData.value.income_or_expense &&
    formData.value.cash_structure_id &&
    formData.value.accounts.length > 0 &&
    formData.value.accounts.every(
      (account) => account.id && account.allocated_amount > 0
    )
  );
});

// Methods
const clearForm = () => {
  formData.value = {
    id: null,
    reference_number: "",
    date_only: new Date().toISOString().split("T")[0],
    time_only: new Date().toTimeString().slice(0, 5),
    income_or_expense: "",
    cash_structure_id: "",
    interact_bank: "",
    description: "",
    accounts: [],
    images: [],
    cash_book_images: [],
  };
  cashBookImages.value = [];
};

// Prove Images Management
const addProveImage = () => {
  inputFile.value?.click();
};

const onProveImageChange = (event) => {
  const files = Array.from(event.target.files);
  files.forEach((file) => {
    const imageData = {
      id: null,
      image: file,
      preview: URL.createObjectURL(file),
      is_existing: false,
    };
    formData.value.cash_book_images.push(imageData);
    cashBookImages.value.push(imageData);
  });
  // Reset input
  event.target.value = "";
};

const removeProveImage = async (index) => {
  const image = cashBookImages.value[index];

  // If it's an existing image, delete from server
  if (image.is_existing && image.id) {
    try {
      await cashImageEditStore.deleteCashBookImage(image.id);
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error("Failed to delete image");
      return;
    }
  }

  // Remove from local arrays
  cashBookImages.value.splice(index, 1);
  formData.value.cash_book_images.splice(index, 1);
};

// Account Management
const addAccount = () => {
  formData.value.accounts.push({
    id: "",
    allocated_amount: 0,
    note: "1",
  });
};

const removeAccount = (index) => {
  formData.value.accounts.splice(index, 1);
};

const onAccountChange = (account, index) => {
  console.log("Account selected:", account);
};

// Slip Image Management
const openSlipImageModal = (index = -1) => {
  console.log("Opening slip image modal, index:", index);

  slipImageModal.value.currentIndex = index;
  slipImageModal.value.isEditing = index >= 0;

  if (index >= 0) {
    // Editing existing image
    console.log("Editing existing image:", formData.value.images[index]);
    slipImageModal.value.data = { ...formData.value.images[index] };
  } else {
    // Adding new image
    const now = new Date();
    const defaultData = {
      id: null,
      image: null,
      preview: "",
      sender: "",
      receiver: "",
      amount: 0,
      currency: "THB",
      interact_bank: "",
      date: now.toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm format
      existing_image: null,
      is_existing: false,
    };
    console.log("Adding new image with default data:", defaultData);
    slipImageModal.value.data = defaultData;
  }

  slipImageModal.value.isOpen = true;
  console.log("Modal state after opening:", slipImageModal.value);
};

const closeSlipImageModal = () => {
  slipImageModal.value.isOpen = false;
  slipImageModal.value.data = {};
  slipImageModal.value.currentIndex = -1;
  slipImageModal.value.isEditing = false;
};

const saveSlipImage = async (imageData) => {
  try {
    if (slipImageModal.value.isEditing) {
      // Update existing image
      formData.value.images[slipImageModal.value.currentIndex] = {
        ...imageData,
        is_existing: imageData.id ? true : false,
      };
    } else {
      // For new cash book entries, just add to local array
      if (!formData.value.id) {
        formData.value.images.push({
          ...imageData,
          is_existing: false,
        });
      } else {
        // For existing cash book entries, create the cash image via API
        const cashImagePayload = {
          ...imageData,
          relatable_type: "App\\Models\\CashBook",
          relatable_id: formData.value.id,
        };

        const response = await cashImageEditStore.createCashImage(
          cashImagePayload
        );

        // Add the created image to local array
        formData.value.images.push({
          ...response,
          is_existing: true,
          preview: response.image,
        });

        toast.success("Slip image added successfully");
      }
    }
    closeSlipImageModal();
  } catch (error) {
    toast.error("Failed to add slip image");
    console.error("Error adding slip image:", error);
  }
};

const updateSlipImage = async (imageData) => {
  try {
    const response = await cashImageEditStore.updateCashImage(
      imageData.id,
      imageData
    );

    // Update the image in the local array
    console.log("response", response);

    const index = slipImageModal.value.currentIndex;
    formData.value.images[index] = {
      ...response.result,
      is_existing: true,
      preview: response.result.image, // Use the updated image URL
    };

    toast.success("Slip image updated successfully");
    closeSlipImageModal();
  } catch (error) {
    toast.error("Failed to update slip image");
  }
};

const deleteSlipImageFromModal = async (imageId) => {
  try {
    await cashImageEditStore.deleteCashImage(imageId);

    // Remove from local array
    const index = slipImageModal.value.currentIndex;
    formData.value.images.splice(index, 1);

    toast.success("Slip image deleted successfully");
    closeSlipImageModal();
  } catch (error) {
    toast.error("Failed to delete slip image");
  }
};

const removeSlipImage = async (index) => {
  const image = formData.value.images[index];

  // If it's an existing image, delete from server
  if (image.is_existing && image.id) {
    try {
      await cashImageEditStore.deleteCashImage(image.id);
      toast.success("Slip image deleted successfully");
    } catch (error) {
      toast.error("Failed to delete slip image");
      return;
    }
  }

  // Remove from local array
  formData.value.images.splice(index, 1);
};

// Form submission
const submitForm = async () => {
  if (!isFormValid.value) {
    toast.error("Please fill in all required fields");
    return;
  }

  loading.value = true;

  try {
    const payload = prepareFormData();

    if (formData.value.id) {
      await cashBookStore.updateAction(payload, formData.value.id);
      toast.success("Cash book entry updated successfully");
    } else {
      await cashBookStore.addNewAction(payload);
      toast.success("Cash book entry created successfully");
    }

    clearForm();
    emit("refresh");
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to save cash book entry"
    );
  } finally {
    loading.value = false;
  }
};

const prepareFormData = () => {
  const frmData = new FormData();

  if (formData.value.id) {
    frmData.append("_method", "PUT");
  }

  frmData.append("reference_number", formData.value.reference_number || "");

  // Combine date and time
  if (formData.value.date_only && formData.value.time_only) {
    const datetime = `${formData.value.date_only} ${formData.value.time_only}:00`;
    frmData.append("date", datetime);
  } else if (formData.value.date_only) {
    const datetime = `${formData.value.date_only} 00:00:00`;
    frmData.append("date", datetime);
  }

  frmData.append("income_or_expense", formData.value.income_or_expense);
  frmData.append("cash_structure_id", formData.value.cash_structure_id);
  frmData.append("interact_bank", formData.value.interact_bank || "");
  frmData.append("description", formData.value.description || "");

  // Add accounts
  formData.value.accounts.forEach((account, index) => {
    frmData.append(`accounts[${index}][id]`, account.id);
    frmData.append(
      `accounts[${index}][allocated_amount]`,
      account.allocated_amount
    );
    frmData.append(`accounts[${index}][note]`, account.note);
  });

  // Add detailed images (only new ones for create, exclude for update as they're handled separately)
  if (!formData.value.id) {
    formData.value.images.forEach((image, index) => {
      if (image.image) {
        frmData.append(`images[${index}][image]`, image.image);
        frmData.append(`images[${index}][sender]`, image.sender || "");
        frmData.append(`images[${index}][receiver]`, image.receiver || "");
        frmData.append(`images[${index}][amount]`, image.amount || 0);
        frmData.append(`images[${index}][currency]`, image.currency || "THB");
        frmData.append(
          `images[${index}][interact_bank]`,
          image.interact_bank || ""
        );

        if (image.date) {
          const formattedDate = formatDateTimeForServer(image.date);
          frmData.append(`images[${index}][date]`, formattedDate);
        }
      }
    });
  }

  // Add simple images (cash book images)
  formData.value.cash_book_images.forEach((image, index) => {
    // if (image.id && image.is_existing) {
    //   frmData.append(`cash_book_images[${index}][id]`, image.id);
    // }

    if (image.image) {
      frmData.append(`cash_book_images[${index}][image]`, image.image);
    }
  });

  return frmData;
};

const formatDateTimeForServer = (dateTimeString) => {
  if (!dateTimeString) return "";

  // Convert datetime-local format (YYYY-MM-DDTHH:mm) to Y-m-d H:i:s
  const date = new Date(dateTimeString);
  if (isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const formatDateTimeForInput = (dateTimeString) => {
  if (!dateTimeString) return "";

  let dateObj;

  // Handle DD-MM-YYYY HH:mm:ss format from API
  if (
    typeof dateTimeString === "string" &&
    dateTimeString.includes("-") &&
    dateTimeString.split("-")[0].length === 2
  ) {
    const [datePart, timePart] = dateTimeString.split(" ");
    const [day, month, year] = datePart.split("-");
    const isoDateStr = `${year}-${month}-${day} ${timePart}`;
    dateObj = new Date(isoDateStr);
  } else {
    dateObj = new Date(dateTimeString);
  }

  if (isNaN(dateObj.getTime())) return "";

  // Format for datetime-local input (YYYY-MM-DDTHH:mm)
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Watch for props changes (for editing)
watch(
  () => props.getData,
  (newData) => {
    if (newData) {
      editGetFormData(newData);
    }
  },
  { immediate: true }
);

const editGetFormData = (data) => {
  console.log("Edit data:", data);

  formData.value.id = data.id;
  formData.value.reference_number = data.reference || "";

  // Parse date - handle DD-MM-YYYY HH:mm:ss format
  if (data.date) {
    const dateStr = data.date;
    const [datePart, timePart] = dateStr.split(" ");
    const [day, month, year] = datePart.split("-");
    const isoDateStr = `${year}-${month}-${day} ${timePart}`;

    const date = new Date(isoDateStr);
    if (!isNaN(date.getTime())) {
      formData.value.date_only = date.toISOString().split("T")[0];
      formData.value.time_only = date
        .toTimeString()
        .split(" ")[0]
        .substring(0, 5);
    }
  }

  formData.value.income_or_expense = data.income_or_expense || "";
  formData.value.cash_structure_id = data.cash_structure?.id || "";
  formData.value.interact_bank = data.interact_bank || "";
  formData.value.description = data.description || "";

  // Map accounts
  formData.value.accounts =
    data.chart_of_accounts?.map((account) => ({
      id: account.id,
      allocated_amount: account.pivot?.allocated_amount || 0,
      note: account.pivot?.note || "1",
    })) || [];

  // Map detailed images (CashImage)
  formData.value.images =
    data.cash_images?.map((img) => ({
      id: img.id,
      sender: img.sender || "",
      receiver: img.receiver || "",
      amount: img.amount || 0,
      currency: img.currency || "THB",
      interact_bank: img.interact_bank || "",
      date: formatDateTimeForInput(img.date),
      image: null,
      existing_image: img.image,
      preview: img.image,
      is_existing: true,
    })) || [];

  // Map simple images (CashBookImage)
  const mappedCashBookImages =
    data.cash_book_images?.map((img) => ({
      id: img.id,
      image: null,
      existing_image: img.image,
      preview: img.image,
      is_existing: true,
    })) || [];

  formData.value.cash_book_images = mappedCashBookImages;
  cashBookImages.value = mappedCashBookImages;
};

// Initialize data on component mount
onMounted(async () => {
  await Promise.all([
    cashStructureStore.getSimpleListAction(),
    chartOfAccountStore.getSimpleListAction(),
  ]);
});
</script>
