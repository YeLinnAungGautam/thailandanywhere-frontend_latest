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
          class="border border-[#FF613c] border-dashed flex justify-center items-center text-xs text-[#FF613c] rounded h-12 p-3 cursor-pointer hover:bg-orange-50 transition-colors"
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

      <!-- Slip Images Section - Using TransferImageComponent -->
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <h4 class="font-medium text-gray-800">Transaction Images</h4>
          <div
            @click="openShowModal = true"
            class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-xs rounded transition-colors"
          >
            Add Images
          </div>
        </div>
        <div
          v-if="formData.images.length === 0"
          class="text-center py-4 text-gray-500 text-xs"
        >
          No images uploaded yet.
        </div>

        <div class="bg-white rounded-lg mt-4" v-if="formData.images.length > 0">
          <p class="text-xs font-medium text-[#ff613c] pb-2">Images Upload</p>

          <!-- Display receipts -->
          <div class="space-y-3">
            <div
              v-for="(receipt, index) in formData.images"
              :key="index"
              class="border border-gray-200 rounded-lg p-2"
            >
              <!-- Internal Transfer -->
              <div v-if="receipt.is_internal_transfer" class="space-y-2">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <span
                      class="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium"
                    >
                      Internal Transfer
                    </span>
                    <span class="text-xs text-gray-600">
                      Rate: {{ receipt.exchange_rate }}
                    </span>
                  </div>
                  <div class="flex justify-end items-center space-x-2">
                    <button
                      v-if="authStore.isSuperAdmin"
                      @click="editFeatureSelectImage(receipt)"
                      class="text-blue-500 hover:text-blue-700"
                    >
                      <PencilSquareIcon class="w-5 h-5" />
                    </button>
                    <button
                      v-if="authStore.isSuperAdmin"
                      @click="
                        receipt?.id
                          ? deleteInternalTransfer(receipt.id)
                          : removeFeatureSelectImage(index)
                      "
                      class="text-red-500 hover:text-red-700"
                    >
                      <XCircleIcon class="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <!-- FROM Section -->
                  <div class="bg-red-50 p-2 rounded">
                    <p class="text-xs font-semibold text-red-700 mb-2">FROM</p>
                    <div class="space-y-2">
                      <div
                        v-for="(fromFile, fIdx) in receipt.from_files"
                        :key="fIdx"
                        class="bg-white p-2 rounded"
                      >
                        <img
                          v-if="fromFile.preview"
                          :src="fromFile.preview"
                          class="w-full h-24 object-cover rounded mb-1"
                        />
                        <div class="text-[10px] space-y-0.5">
                          <p>
                            <strong>Amount:</strong> {{ fromFile.currency }}
                            {{ fromFile.amount.toLocaleString() }}
                          </p>
                          <p><strong>From:</strong> {{ fromFile.sender }}</p>
                          <p><strong>To:</strong> {{ fromFile.receiver }}</p>
                          <p>
                            <strong>Bank:</strong> {{ fromFile.interact_bank }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- TO Section -->
                  <div class="bg-green-50 p-2 rounded">
                    <p class="text-xs font-semibold text-green-700 mb-2">TO</p>
                    <div class="space-y-2">
                      <div
                        v-for="(toFile, tIdx) in receipt.to_files"
                        :key="tIdx"
                        class="bg-white p-2 rounded"
                      >
                        <img
                          v-if="toFile.preview"
                          :src="toFile.preview"
                          class="w-full h-24 object-cover rounded mb-1"
                        />
                        <div class="text-[10px] space-y-0.5">
                          <p>
                            <strong>Amount:</strong> {{ toFile.currency }}
                            {{ toFile.amount.toLocaleString() }}
                          </p>
                          <p><strong>From:</strong> {{ toFile.sender }}</p>
                          <p><strong>To:</strong> {{ toFile.receiver }}</p>
                          <p>
                            <strong>Bank:</strong> {{ toFile.interact_bank }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p v-if="receipt.note" class="text-xs text-gray-600 mt-2">
                  <strong>Note:</strong> {{ receipt.note }}
                </p>
              </div>

              <!-- Direct Banking -->
              <div v-else class="flex items-start gap-3">
                <img
                  v-if="receipt.preview"
                  :src="receipt.preview"
                  class="w-24 h-24 object-cover rounded"
                />
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-1">
                    <span
                      class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium"
                    >
                      Direct Banking
                    </span>
                    <button
                      v-if="authStore.isSuperAdmin"
                      @click="
                        receipt.id
                          ? deleteImage(receipt.id)
                          : removeFeatureSelectImage(index)
                      "
                      class="text-red-500 hover:text-red-700"
                    >
                      <XCircleIcon class="w-5 h-5" />
                    </button>
                  </div>
                  <div class="text-xs space-y-1">
                    <p>
                      <strong>Amount:</strong> {{ receipt.currency }}
                      {{ receipt.amount }}
                    </p>
                    <p><strong>From:</strong> {{ receipt.sender }}</p>
                    <p><strong>To:</strong> {{ receipt.receiver }}</p>
                    <p><strong>Bank:</strong> {{ receipt.interact_bank }}</p>
                    <p><strong>Date:</strong> {{ formatDate(receipt.date) }}</p>
                    <p v-if="receipt.note">
                      <strong>Note:</strong> {{ receipt.note }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
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

        <div class="space-y-2">
          <label class="text-xs font-medium text-gray-700">Date</label>
          <input
            v-model="formData.date_only"
            type="date"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
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
            <option value="pay_to_driver">Pay to Driver</option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-medium text-gray-700">Amount</label>
          <input
            v-model="formData.amount"
            type="number"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
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
              : 'bg-[#FF613c] hover:bg-orange-600 text-white',
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

      <Modal :isOpen="openShowModal" @closeModal="closeAction">
        <DialogPanel
          class="w-full max-w-5xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
        >
          <DialogTitle
            as="div"
            class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-2 px-4"
          >
            <p>Payment Slip Audit</p>
            <XCircleIcon class="w-5 h-5 text-white" @click="closeAction" />
          </DialogTitle>

          <TransferImageComponent
            :editData="transferImageData"
            @internal-transfer-submitted="handleInternalTransferSubmit"
            @direct-banking-submitted="handleDirectBankingSubmit"
          />
        </DialogPanel>
      </Modal>
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
import TransferImageComponent from "../CashImageCreate/CashImage.vue"; // Your second component
import Modal from "../../components/Modal.vue";
import { useAuthStore } from "../../stores/auth";
import { PencilSquareIcon, XCircleIcon } from "@heroicons/vue/24/outline";
import { useCashImageStore } from "../../stores/cashImage";
import Swal from "sweetalert2";
import { useInternalTransferStore } from "../../stores/internalTransfer";

// Store initialization
const cashStructureStore = useCashStructureStore();
const chartOfAccountStore = useChartOfAccountStore();
const cashBookStore = useCashBookStore();
const cashImageStore = useCashImageStore();
const cashImageEditStore = useCashImageEditStore();
const authStore = useAuthStore();
const toast = useToast();
const internalTransferStore = useInternalTransferStore();

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

const openShowModal = ref(false);
const closeAction = () => {
  openShowModal.value = false;
};

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
  amount: "",
  description: "",
  accounts: [],
  images: [], // This will store the transfer image data
  cash_book_images: [], // Simple prove images
});

// Local state
const loading = ref(false);
const cashBookImages = ref([]);
const inputFile = ref(null);
const transferImageData = ref(null);

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
    amount: "",
    description: "",
    accounts: [],
    images: [],
    cash_book_images: [],
  };
  cashBookImages.value = [];
  transferImageData.value = null;
};

// Prove Images Management
const addProveImage = () => {
  inputFile.value?.click();
};

const removeFeatureSelectImage = (index) => {
  formData.value.images.splice(index, 1);
  featureImagePreview.value.splice(index, 1);
  console.log(formData.value.images, "this is remove");
};

const editFeatureSelectImage = (data) => {
  transferImageData.value = data;
  openShowModal.value = true;
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
  event.target.value = "";
};

const removeProveImage = async (index) => {
  const image = cashBookImages.value[index];

  if (image.is_existing && image.id) {
    try {
      await cashImageEditStore.deleteCashBookImage(image.id);
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error("Failed to delete image");
      return;
    }
  }

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

const formatDate = (dateString) => {
  // Parse the input string into a Date object
  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "Invalid Date"; // Handle invalid dates
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

  // Extract date components
  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Extract time components
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Return formatted date and time
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

// Transfer Image Handlers
const handleInternalTransferSubmit = (data) => {
  console.log("Internal transfer data:", data);

  // Format data for backend
  const transferData = {
    is_internal_transfer: true,
    exchange_rate: data.data.exchange_rate,
    note: data.data.notes,
    id: data.data.id,
    from_files: data.data.from_images.map((img) => ({
      file: img.image,
      date: img.date,
      sender: img.sender,
      receiver: img.receiver,
      amount: img.amount,
      currency: img.currency,
      interact_bank: img.interact_bank,
    })),
    to_files: data.data.to_images.map((img) => ({
      file: img.image,
      date: img.date,
      sender: img.sender,
      receiver: img.receiver,
      amount: img.amount,
      currency: img.currency,
      interact_bank: img.interact_bank,
    })),
  };

  // formData.value.images.push(transferData);
  if (transferData.id) {
    const index = formData.value.images.findIndex(
      (item) => item.id === transferData.id && item.is_internal_transfer
    );

    if (index !== -1) {
      // Update existing item
      formData.value.images[index] = transferData;
    } else {
      // If not found, push as new
      formData.value.images.push(transferData);
    }
  } else {
    // No ID means new item, push to array
    formData.value.images.push(transferData);
  }
  closeAction();
};

const handleDirectBankingSubmit = (data) => {
  console.log("Direct banking data:", data);

  // Format data for backend
  const directData = {
    is_internal_transfer: false,
    file: data.data.image,
    date: data.data.date,
    sender: data.data.sender,
    reciever: data.data.receiver,
    amount: data.data.amount,
    currency: data.data.currency,
    interact_bank: data.data.interact_bank,
  };

  formData.value.images.push(directData);
  closeAction();
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
  frmData.append("amount", formData.value.amount);
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

  // Add transaction images (both internal transfer and direct banking)
  formData.value.images.forEach((image, index) => {
    if (image.is_internal_transfer) {
      // Internal transfer
      frmData.append(`images[${index}][is_internal_transfer]`, "true");
      frmData.append(`images[${index}][exchange_rate]`, image.exchange_rate);
      frmData.append(`images[${index}][note]`, image.note || "");
      if (image.id) {
        frmData.append(`images[${index}][id]`, image.id);
      }

      // From files
      image.from_files.forEach((fromFile, fromIndex) => {
        if (fromFile.file != undefined) {
          frmData.append(
            `images[${index}][from_files][${fromIndex}][file]`,
            fromFile.file
          );
          frmData.append(
            `images[${index}][from_files][${fromIndex}][date]`,
            fromFile.date
          );
          frmData.append(
            `images[${index}][from_files][${fromIndex}][sender]`,
            fromFile.sender
          );
          frmData.append(
            `images[${index}][from_files][${fromIndex}][receiver]`,
            fromFile.receiver
          );
          frmData.append(
            `images[${index}][from_files][${fromIndex}][amount]`,
            fromFile.amount
          );
          frmData.append(
            `images[${index}][from_files][${fromIndex}][currency]`,
            fromFile.currency
          );
          frmData.append(
            `images[${index}][from_files][${fromIndex}][interact_bank]`,
            fromFile.interact_bank
          );
        }
      });

      // To files
      image.to_files.forEach((toFile, toIndex) => {
        if (toFile.file != undefined) {
          frmData.append(
            `images[${index}][to_files][${toIndex}][file]`,
            toFile.file
          );
          frmData.append(
            `images[${index}][to_files][${toIndex}][date]`,
            toFile.date
          );
          frmData.append(
            `images[${index}][to_files][${toIndex}][sender]`,
            toFile.sender
          );
          frmData.append(
            `images[${index}][to_files][${toIndex}][receiver]`,
            toFile.receiver
          );
          frmData.append(
            `images[${index}][to_files][${toIndex}][amount]`,
            toFile.amount
          );
          frmData.append(
            `images[${index}][to_files][${toIndex}][currency]`,
            toFile.currency
          );
          frmData.append(
            `images[${index}][to_files][${toIndex}][interact_bank]`,
            toFile.interact_bank
          );
        }
      });
    } else {
      // Direct banking
      frmData.append(`images[${index}][is_internal_transfer]`, "false");
      frmData.append(`images[${index}][file]`, image.file);
      frmData.append(`images[${index}][date]`, image.date);
      frmData.append(`images[${index}][sender]`, image.sender);
      frmData.append(`images[${index}][reciever]`, image.reciever);
      frmData.append(`images[${index}][amount]`, image.amount);
      frmData.append(`images[${index}][currency]`, image.currency);
      frmData.append(`images[${index}][interact_bank]`, image.interact_bank);
    }
  });

  // Add simple prove images
  formData.value.cash_book_images.forEach((image, index) => {
    if (image.image) {
      frmData.append(`cash_book_images[${index}][image]`, image.image);
    }
  });

  return frmData;
};

const editGetFormData = (data) => {
  console.log("Edit data:", data);

  formData.value.id = data.id;
  formData.value.reference_number = data.reference || "";

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
  formData.value.amount = data.amount || 0;

  formData.value.accounts =
    data.chart_of_accounts?.map((account) => ({
      id: account.id,
      allocated_amount: account.pivot?.allocated_amount || 0,
      note: account.pivot?.note || "1",
    })) || [];

  // Map simple images
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

  // Prepare transfer image data for editing
  // if (data.internal_transfers && data.internal_transfers.length > 0) {
  //   const transfer = data.internal_transfers[0];
  //   transferImageData.value = {
  //     id: transfer.id,
  //     exchange_rate: transfer.exchange_rate,
  //     notes: transfer.notes,
  //     from_images: transfer.from_files || [],
  //     to_images: transfer.to_files || [],
  //   };
  // }

  formData.value.images = data.cash_images?.map(processReceipt);
};

const deleteInternalTransfer = async (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await internalTransterStore.deleteAction(id);
        console.log(response, "this is internal delete");

        toast.success(response.message);
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        window.location.reload();
      }
    }
  });
};

const processReceipt = (receipt) => {
  if (receipt.is_internal_transfer) {
    // Process internal transfer
    return {
      is_internal_transfer: true,
      id: receipt.internal_transfer_id,
      exchange_rate: receipt.exchange_rate,
      note: receipt.notes || "",
      from_files: receipt.from_files.map((file) => ({
        id: file.id,
        file: null, // Can't recreate File object from URL
        preview: file.image, // Use the image URL as preview
        amount: file.amount,
        currency: file.currency,
        sender: file.sender,
        receiver: file.receiver,
        interact_bank: file.interact_bank,
        date: file.date,
      })),
      to_files: receipt.to_files.map((file) => ({
        id: file.id,
        file: null,
        preview: file.image,
        amount: file.amount,
        currency: file.currency,
        sender: file.sender,
        receiver: file.receiver,
        interact_bank: file.interact_bank,
        date: file.date,
      })),
    };
  } else {
    // Process regular receipt (already exists in receipts_original)
    return {
      is_internal_transfer: false,
      id: receipt.id,
      file: null,
      preview: receipt.image,
      amount: receipt.amount,
      date: receipt.date,
      receiver: receipt.receiver,
      sender: receipt.sender,
      currency: receipt.currency,
      interact_bank: receipt.interact_bank,
      bank_name: receipt.bank_name || "",
      is_corporate: receipt.is_corporate || false,
      note: receipt.note || "",
    };
  }
};

const deleteImage = async (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await cashImageStore.deleteAction(id);
        toast.success("success delete sale Image");
      } catch (error) {
        toast.error(error);
        console.log(error);
      } finally {
        window.location.reload();
      }
    }
  });

  // await getDetail();
};

// Initialize data on component mount
onMounted(async () => {
  await Promise.all([
    cashStructureStore.getSimpleListAction(),
    chartOfAccountStore.getSimpleListAction(),
  ]);
});

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
</script>
