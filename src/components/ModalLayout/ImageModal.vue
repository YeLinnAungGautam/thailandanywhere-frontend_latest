<!-- ImageModal.vue Component -->
<template>
  <Modal :isOpen="isOpen" @closeModal="closeModal">
    <DialogPanel
      class="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
    >
      <DialogTitle
        as="div"
        class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-2 px-4"
      >
        <p>{{ modalTitle }}</p>
        <XCircleIcon
          class="w-5 h-5 text-white cursor-pointer"
          @click="closeModal"
        />
      </DialogTitle>

      <div class="p-4">
        <div class="grid grid-cols-2 gap-8">
          <!-- Image Preview Section -->
          <div>
            <div class="mb-4">
              <label class="text-[12px] font-medium block mb-2">
                {{
                  imageData.is_existing
                    ? "Replace Image (Optional)"
                    : "Upload Image"
                }}
              </label>
              <input
                @change="handleImageUpload"
                type="file"
                accept="image/*"
                class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
                :class="{
                  'border-green-300': imageData.is_existing && !imageData.image,
                }"
              />
              <p
                v-if="localImageData?.is_existing && !localImageData?.image"
                class="text-[10px] text-green-600 mt-1"
              >
                Leave empty to keep current image
              </p>
            </div>

            <!-- Image Preview -->
            <div class="relative">
              <img
                v-if="previewImage"
                :src="previewImage"
                class="rounded-lg shadow hover:shadow-none min-h-[300px] w-full object-cover"
                alt="Image Preview"
              />
              <div
                v-else
                class="rounded-lg shadow min-h-[300px] w-full bg-gray-100 flex items-center justify-center"
              >
                <div class="text-center text-gray-500">
                  <svg
                    class="w-12 h-12 mx-auto mb-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <p class="text-xs">No image selected</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Section -->
          <div class="space-y-4 relative pt-4 pb-14 pr-2">
            <!-- Cash Image specific fields -->
            <template v-if="imageType === 'cash'">
              <div class="flex justify-between items-center">
                <label class="text-[12px] font-medium">Date & Time</label>
                <div class="flex justify-between items-center w-[160px]">
                  <p
                    class="text-start text-xs"
                    v-if="imageData.date && !showDateInput"
                  >
                    {{ formatDisplayDate(imageData.date) }}
                  </p>
                  <input
                    v-model="imageData.date"
                    type="datetime-local"
                    class="w-[35px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                    :class="{ 'w-full': showDateInput }"
                    @focus="showDateInput = true"
                    @blur="showDateInput = false"
                  />
                </div>
              </div>

              <div class="flex justify-between items-center">
                <label class="text-[12px] font-medium">Sender</label>
                <input
                  v-model="imageData.sender"
                  type="text"
                  placeholder="Sender name"
                  class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                />
              </div>

              <div class="flex justify-between items-center">
                <label class="text-[12px] font-medium">Receiver</label>
                <input
                  v-model="imageData.receiver"
                  type="text"
                  placeholder="Receiver name"
                  class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                />
              </div>

              <div class="flex justify-between items-center">
                <label class="text-[12px] font-medium">Amount</label>
                <input
                  v-model="imageData.amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Amount"
                  class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                />
              </div>

              <div class="flex justify-between items-center">
                <label class="text-[12px] font-medium">Interact Bank</label>
                <select
                  v-model="imageData.interact_bank"
                  class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                >
                  <option value="">Select Bank</option>
                  <option value="personal">Personal</option>
                  <option value="company">Company</option>
                  <option value="cash_at_office">Cash at Office</option>
                  <option value="to_money_changer">To Money Changer</option>
                  <option value="deposit_management">Deposit Management</option>
                </select>
              </div>

              <div class="flex justify-between items-center">
                <label class="text-[12px] font-medium">Currency</label>
                <select
                  v-model="imageData.currency"
                  class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                >
                  <option value="">Select Currency</option>
                  <option value="MMK">MMK</option>
                  <option value="THB">THB</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </template>

            <!-- Cash Book Image specific fields (minimal) -->
            <template v-else-if="imageType === 'cashbook'">
              <div class="text-center py-8">
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                  <svg
                    class="w-8 h-8 text-green-600 mx-auto mb-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <h3 class="text-sm font-medium text-green-800 mb-1">
                    Simple Image Upload
                  </h3>
                  <p class="text-xs text-green-600">
                    This is a simple image attachment for the cash book entry.
                    No additional details required.
                  </p>
                </div>
              </div>
            </template>

            <!-- Action Buttons -->
            <div
              class="flex justify-end items-center space-x-2 absolute bottom-0 right-0"
            >
              <button
                @click="saveImage"
                class="px-3 py-1 bg-green-500 text-white text-[12px] cursor-pointer rounded-lg hover:bg-green-600 transition-colors"
                :disabled="loading"
              >
                {{ loading ? "Saving..." : "Save" }}
              </button>
              <button
                @click="closeModal"
                class="px-3 py-1 bg-white border border-gray-300 text-[12px] cursor-pointer rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </DialogPanel>
  </Modal>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { DialogPanel, DialogTitle } from "@headlessui/vue";
import { XCircleIcon } from "@heroicons/vue/24/outline";
import Modal from "../Modal.vue"; // Adjust path as needed

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  imageType: {
    type: String,
    default: "cash", // 'cash' or 'cashbook'
    validator: (value) => ["cash", "cashbook"].includes(value),
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

const emit = defineEmits(["close", "save"]);

const loading = ref(false);
const showDateInput = ref(false);
const previewImage = ref("");

// Computed properties
const modalTitle = computed(() => {
  if (props.imageType === "cash") {
    return props.isEditing ? "Edit Detailed Image" : "Add Detailed Image";
  } else {
    return props.isEditing ? "Edit Simple Image" : "Add Simple Image";
  }
});

// Methods
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Update the image data
    emit("save", { ...props.imageData, image: file });

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const saveImage = () => {
  if (props.imageType === "cash") {
    // Validate required fields for cash images
    if (
      !props.imageData.sender ||
      !props.imageData.receiver ||
      !props.imageData.amount
    ) {
      alert("Please fill in all required fields (Sender, Receiver, Amount)");
      return;
    }
  }

  loading.value = true;

  // Simulate saving delay
  setTimeout(() => {
    loading.value = false;
    emit("save", props.imageData);
    closeModal();
  }, 500);
};

const closeModal = () => {
  emit("close");
  previewImage.value = "";
  showDateInput.value = false;
};

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";

  try {
    let dateObj;

    // Handle different date formats
    if (
      typeof dateString === "string" &&
      dateString.includes("-") &&
      dateString.split("-")[0].length === 2
    ) {
      // Convert DD-MM-YYYY HH:mm:ss to YYYY-MM-DD HH:mm:ss
      const [datePart, timePart] = dateString.split(" ");
      const [day, month, year] = datePart.split("-");
      const isoDateStr = `${year}-${month}-${day} ${timePart}`;
      dateObj = new Date(isoDateStr);
    } else {
      dateObj = new Date(dateString);
    }

    if (isNaN(dateObj.getTime())) return "Invalid Date";

    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return "Invalid Date";
  }
};

// Watch for existing image
watch(
  () => props.imageData,
  (newData) => {
    if (newData.existing_image) {
      previewImage.value = newData.existing_image;
    } else {
      previewImage.value = "";
    }
  },
  { immediate: true, deep: true }
);

// Watch for modal open/close
watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) {
      previewImage.value = "";
      showDateInput.value = false;
    } else if (props.imageData.existing_image) {
      previewImage.value = props.imageData.existing_image;
    }
  }
);
</script>
