<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      @click="closeModal"
    ></div>

    <!-- Modal -->
    <div class="flex items-center justify-center min-h-screen p-4">
      <div
        class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto"
      >
        <!-- Header -->
        <div
          class="bg-[#FF613c] text-white px-6 py-4 flex justify-between items-center"
        >
          <h3 class="text-lg font-medium">
            {{ isEditing ? "Edit Slip Image" : "Create Slip Image" }}
          </h3>
          <button @click="closeModal" class="text-white hover:text-gray-200">
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

        <!-- Content -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <!-- Image Upload Section -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Image</label
              >
              <div
                @click="openFileSelector"
                class="relative border rounded-lg cursor-pointer hover:border-[#FF613c] transition-colors"
                :class="
                  formImageData.preview ? '' : 'border-dashed border-[#FF613c]'
                "
              >
                <div v-if="!formImageData.preview" class="p-12 text-center">
                  <svg
                    class="mx-auto h-12 w-12 text-gray-400"
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
                  <p class="mt-2 text-sm text-gray-600">
                    Click to upload image
                  </p>
                  <p class="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </div>
                <img
                  v-else
                  :src="formImageData.preview"
                  class="w-full h-full object-cover rounded-lg"
                  alt="Preview"
                />
              </div>
              <input
                ref="fileInput"
                type="file"
                class="hidden"
                accept="image/*"
                @change="handleFileChange"
              />
            </div>
          </div>

          <!-- Form Fields Section -->
          <div class="space-y-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700"
                >Date & Time</label
              >
              <div class="relative">
                <input
                  v-model="formImageData.date"
                  type="datetime-local"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#FF613c] focus:border-[#FF613c]"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700"
                >Sender *</label
              >
              <input
                v-model="formImageData.sender"
                type="text"
                placeholder="Enter sender name"
                class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#FF613c] focus:border-[#FF613c]"
                required
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700"
                >Receiver *</label
              >
              <input
                v-model="formImageData.receiver"
                type="text"
                placeholder="Enter receiver name"
                class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#FF613c] focus:border-[#FF613c]"
                required
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700"
                >Amount *</label
              >
              <input
                v-model="formImageData.amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#FF613c] focus:border-[#FF613c]"
                required
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700"
                >Currency</label
              >
              <select
                v-model="formImageData.currency"
                class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#FF613c] focus:border-[#FF613c]"
              >
                <option value="THB">THB</option>
                <option value="USD">USD</option>
                <option value="MMK">MMK</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700"
                >Interact Bank</label
              >
              <select
                v-model="formImageData.interact_bank"
                class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#FF613c] focus:border-[#FF613c]"
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
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <div class="flex gap-2">
            <button
              v-if="isEditing && formImageData.id"
              @click="handleDelete"
              type="button"
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm font-medium rounded-md transition-colors"
            >
              Delete
            </button>
          </div>

          <div class="flex gap-3">
            <button
              @click="closeModal"
              type="button"
              class="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 text-sm font-medium rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleSave"
              type="button"
              :disabled="!isFormValid || loading"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                !isFormValid || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#FF613c] hover:bg-[#FF613c] text-white',
              ]"
            >
              <span v-if="loading" class="flex items-center">
                <svg
                  class="animate-spin -ml-1 mr-2 h-4 w-4"
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
                {{ isEditing ? "Updating..." : "Saving..." }}
              </span>
              <span v-else>
                {{ isEditing ? "Update" : "Save" }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  imageData: {
    type: Object,
    default: () => ({}),
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits(["close", "save", "update", "delete"]);

// Local state
const loading = ref(false);
const fileInput = ref(null);
const formImageData = ref({
  id: null,
  image: null,
  preview: "",
  sender: "",
  receiver: "",
  amount: 0,
  currency: "THB",
  interact_bank: "",
  date: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm format
  existing_image: null,
  is_existing: false,
});

// Computed
const isFormValid = computed(() => {
  return (
    formImageData.value.sender.trim() &&
    formImageData.value.receiver.trim() &&
    formImageData.value.amount > 0 &&
    (formImageData.value.image || formImageData.value.existing_image)
  );
});

// Methods
const openFileSelector = () => {
  fileInput.value?.click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    formImageData.value.image = file;
    formImageData.value.preview = URL.createObjectURL(file);
  }
};

const closeModal = () => {
  emit("close");
  resetForm();
};

const resetForm = () => {
  formImageData.value = {
    id: null,
    image: null,
    preview: "",
    sender: "",
    receiver: "",
    amount: 0,
    currency: "THB",
    interact_bank: "",
    date: new Date().toISOString().slice(0, 16),
    existing_image: null,
    is_existing: false,
  };

  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const handleSave = async () => {
  if (!isFormValid.value) return;

  loading.value = true;

  try {
    if (props.isEditing && formImageData.value.id) {
      // If editing an existing cash image, call separate update API
      emit("update", { ...formImageData.value });
    } else {
      // For new images or non-existing ones, just save to parent
      emit("save", { ...formImageData.value });
    }
  } finally {
    loading.value = false;
  }
};

const handleDelete = () => {
  if (formImageData.value.id) {
    emit("delete", formImageData.value.id);
  }
};

const formatDateForInput = (dateString) => {
  if (!dateString) return new Date().toISOString().slice(0, 16);

  let dateObj;

  // Handle DD-MM-YYYY HH:mm:ss format from API
  if (
    typeof dateString === "string" &&
    dateString.includes("-") &&
    dateString.split("-")[0].length === 2
  ) {
    const [datePart, timePart] = dateString.split(" ");
    const [day, month, year] = datePart.split("-");
    const isoDateStr = `${year}-${month}-${day} ${timePart}`;
    dateObj = new Date(isoDateStr);
  } else {
    dateObj = new Date(dateString);
  }

  if (isNaN(dateObj.getTime())) {
    return new Date().toISOString().slice(0, 16);
  }

  // Format for datetime-local input (YYYY-MM-DDTHH:mm)
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Watch for prop changes
watch(
  () => props.imageData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      formImageData.value = {
        ...newData,
        date: formatDateForInput(newData.date),
        preview: newData.preview || newData.existing_image || "",
      };
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) {
      resetForm();
    }
  }
);
</script>
