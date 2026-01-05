<template>
  <Modal :isOpen="isOpen" @closeModal="closeModal">
    <DialogPanel
      class="w-full max-w-4xl transform rounded-xl bg-white p-4 text-left align-middle shadow-xl transition-all max-h-[90vh] overflow-y-auto"
    >
      <DialogTitle
        as="div"
        class="text-lg font-semibold text-gray-900 mb-4 flex justify-between items-center"
      >
        <div class="flex items-center gap-2">
          <UserCircleIcon class="w-6 h-6 text-[#FF613c]" />
          {{ passportData ? "Edit Passport" : "Add New Passport" }}
        </div>
        <button
          @click="closeModal"
          class="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <XMarkIcon class="w-5 h-5 text-gray-500" />
        </button>
      </DialogTitle>

      <div class="grid grid-cols-2 p-6 gap-x-8">
        <!-- Passport Image Upload -->
        <div>
          <label class="text-xs font-medium text-gray-700 mb-1.5 block">
            Passport Image
          </label>

          <!-- Existing Image Display -->
          <div v-if="formData.file && !passportPreview" class="mb-3">
            <img
              :src="formData.file"
              class="rounded-lg shadow w-full h-56 object-contain object-center cursor-pointer border border-gray-200"
              alt="Current passport"
              @click="viewPassportImage(formData.file)"
            />
          </div>

          <!-- Preview New Image -->
          <div v-if="passportPreview" class="mb-3">
            <img
              :src="passportPreview"
              class="rounded-lg shadow w-full h-56 object-contain object-center border border-gray-200"
              alt="Passport preview"
            />
          </div>

          <!-- Upload Button -->
          <div
            v-if="!formData.file && !passportPreview"
            @click="openFilePicker"
            class="w-full h-56 border-2 border-dashed border-[#FF613c] rounded-lg flex flex-col justify-center items-center text-[#FF613c] cursor-pointer hover:bg-[#FF613c]/5 transition-colors"
          >
            <PlusCircleIcon class="w-12 h-12 mb-2" />
            <p class="text-sm font-medium">Click to upload passport image</p>
            <p class="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
          </div>

          <!-- Change/Remove Buttons -->
          <div v-if="formData.file || passportPreview" class="flex gap-2 mt-2">
            <button
              @click="openFilePicker"
              class="flex-1 px-4 py-2 text-sm font-medium text-[#FF613c] bg-white border border-[#FF613c] rounded-lg hover:bg-[#FF613c]/5 transition-colors"
            >
              Change Image
            </button>
            <button
              @click="clearPassportImage"
              class="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              Remove
            </button>
          </div>

          <input
            type="file"
            ref="fileInput"
            class="hidden"
            @change="handleFileChange"
            accept="image/*"
          />
        </div>
        <div class="space-y-4">
          <!-- Name Field -->
          <div>
            <label class="text-xs font-medium text-gray-700 mb-1.5 block">
              Name *
            </label>
            <input
              type="text"
              v-model="formData.name"
              placeholder="Enter traveller name"
              class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
            />
          </div>

          <!-- Passport Number -->
          <div>
            <label class="text-xs font-medium text-gray-700 mb-1.5 block">
              Passport Number
            </label>
            <input
              type="text"
              v-model="formData.passport"
              placeholder="Enter passport number"
              class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
            />
          </div>

          <!-- Date of Birth -->
          <div>
            <DOBInput v-model:formData="formData" />
          </div>
        </div>
        <!-- Action Buttons -->
        <div
          class="flex items-center col-span-2 mt-8 justify-end gap-3 pt-4 border-t border-gray-200"
        >
          <button
            v-if="passportData"
            @click="deletePassport"
            :disabled="loading"
            class="px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? "Deleting..." : "Delete" }}
          </button>
          <button
            @click="closeModal"
            class="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="savePassport"
            :disabled="!formData.name || loading"
            class="px-6 py-2.5 text-sm font-medium text-white bg-[#FF613c] rounded-lg hover:bg-[#e55139] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg
              v-if="loading"
              class="animate-spin h-4 w-4 text-white"
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
            {{ loading ? "Saving..." : passportData ? "Update" : "Save" }}
          </button>
        </div>
      </div>
    </DialogPanel>
  </Modal>
</template>

<script setup>
import { ref, watch } from "vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import {
  UserCircleIcon,
  XMarkIcon,
  PlusCircleIcon,
} from "@heroicons/vue/24/outline";
import { useToast } from "vue-toastification";
import { useGroupStore } from "../../../stores/group";
import Modal from "../../../components/Modal.vue";
import DOBInput from "../../Reservation2Component/DOBInput.vue";

const props = defineProps({
  isOpen: Boolean,
  passportData: Object,
  groupId: [String, Number],
  groupData: Object,
});

const emit = defineEmits(["close", "refresh"]);

const toast = useToast();
const groupStore = useGroupStore();

const loading = ref(false);
const fileInput = ref(null);
const passportPreview = ref("");
const passportFile = ref(null);

const formData = ref({
  name: "",
  passport: "",
  dob: "",
  file: "",
});

const resetForm = () => {
  formData.value = {
    name: "",
    passport: "",
    dob: "",
    file: "",
  };
  passportPreview.value = "";
  passportFile.value = null;
};

const openFilePicker = () => {
  fileInput.value.click();
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    passportFile.value = file;
    passportPreview.value = URL.createObjectURL(file);
  }
};

const clearPassportImage = () => {
  formData.value.file = "";
  passportPreview.value = "";
  passportFile.value = null;
};

const viewPassportImage = (url) => {
  if (url) {
    window.open(url, "_blank");
  }
};

const savePassport = async () => {
  if (!formData.value.name) {
    toast.error("Name is required");
    return;
  }

  loading.value = true;

  try {
    if (props.passportData) {
      // Update existing passport
      await updatePassport();
    } else {
      // Create new passport
      await createPassport();
    }
  } catch (error) {
    console.error("Error saving passport:", error);
    toast.error("Failed to save passport");
  } finally {
    loading.value = false;
  }
};

const createPassport = async () => {
  const frmData = new FormData();
  frmData.append("document_type", "passport");

  if (passportFile.value) {
    frmData.append("documents[0][file]", passportFile.value);
  }

  frmData.append("documents[0][meta][name]", formData.value.name);
  frmData.append(
    "documents[0][meta][passport_number]",
    formData.value.passport
  );
  frmData.append("documents[0][meta][dob]", formData.value.dob);

  const response = await groupStore.groupDocumentCreateAction(
    frmData,
    props.groupId
  );

  if (response.status === 1) {
    toast.success("Passport added successfully");
    emit("refresh");
    closeModal();
  } else {
    toast.error("Failed to add passport");
  }
};

const updatePassport = async () => {
  const frmData = new FormData();
  frmData.append("document_type", "passport");
  frmData.append("_method", "PUT");

  if (passportFile.value) {
    frmData.append("file", passportFile.value);
  }

  frmData.append("meta[name]", formData.value.name);
  frmData.append("meta[passport_number]", formData.value.passport);
  frmData.append("meta[dob]", formData.value.dob);

  const response = await groupStore.groupDocumentUpdateAction(
    frmData,
    props.groupId,
    props.passportData.id
  );

  if (response.status === 1) {
    toast.success("Passport updated successfully");
    emit("refresh");
    closeModal();
  } else {
    toast.error("Failed to update passport");
  }
};

const deletePassport = async () => {
  if (!confirm("Are you sure you want to delete this passport?")) {
    return;
  }

  loading.value = true;

  try {
    const response = await groupStore.groupDocumentDeleteAction(
      props.groupId,
      props.passportData.id
    );

    if (response.status === 1) {
      toast.success("Passport deleted successfully");
      emit("refresh");
      closeModal();
    } else {
      toast.error("Failed to delete passport");
    }
  } catch (error) {
    console.error("Error deleting passport:", error);
    toast.error("Failed to delete passport");
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  resetForm();
  emit("close");
};

// Watch for passport data changes
watch(
  () => props.passportData,
  (newData) => {
    if (newData) {
      formData.value = {
        name: newData.meta?.name || "",
        passport: newData.meta?.passport_number || "",
        dob: newData.meta?.dob || "",
        file: newData.file || "",
      };
      passportPreview.value = "";
      passportFile.value = null;
    } else {
      resetForm();
    }
  },
  { immediate: true }
);
</script>
