<script setup>
// ==================== IMPORTS ====================
// Vue Core
import { onMounted, ref, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";

// External Libraries
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { QuillEditor } from "@vueup/vue-quill";

// Icons
import {
  PencilSquareIcon,
  TrashIcon,
  PlusCircleIcon,
  ShareIcon,
  EyeIcon,
  TicketIcon,
  BuildingOfficeIcon,
  PlusIcon,
  StarIcon,
  DocumentPlusIcon,
  UserGroupIcon,
  XCircleIcon,
  UsersIcon,
  ArrowDownTrayIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  DocumentIcon,
  PhotoIcon,
} from "@heroicons/vue/24/outline";

// Stores
import { useCityStore } from "../stores/city";
import { useHotelStore } from "../stores/hotel";
import { useAuthStore } from "../stores/auth";
import { useHotelCategoryStore } from "../stores/hotelcategory";
import { usePlaceStore } from "../stores/place";

// Components
import Layout from "./Layout.vue";
import Button from "../components/Button.vue";
import Modal from "../components/Modal.vue";
import Pagination from "../components/Pagination.vue";
import FacilitoryStoreVue from "../components/FacilitoryStore.vue";
import AiDescriptionEditor from "./GenerateAI/DescriptionAi.vue";
import AddonPage from "./Addon/AddonPage.vue";
import HotelConfrimationDemo from "./PngGenerate/HotelConfirmationDemo.vue";
import AddSlugPage from "../components/Slug/HotelSlug.vue";
import GoodToKnow from "./GoodToKnow.vue";
import NearByPlace from "./NearByPlace.vue";
import KeyHighLight from "./KeyHighLight.vue";
import RoomTypeEditPage from "./RoomTypeEditPage.vue";

// AI Auto-Fill Components
import UploadContractModal from "../components/HotelAIAutoFill/UploadContractModal.vue";
import DataComparisonModal from "../components/HotelAIAutoFill/DataComparisonModal.vue";
import ContractSaveConfirmModal from "../components/HotelAIAutoFill/ContractSaveConfirmModal.vue";
import RoomPeriodImportModal from "../components/HotelAIAutoFill/RoomPeriodImportModal.vue";
// Add this to your imports section
import HotelAIImportPage from "../components/HotelAIAutoFill2/HotelAiImportPage.vue";

// ==================== STORE INITIALIZATION ====================
const toast = useToast();
const router = useRouter();
const route = useRoute();

const cityStore = useCityStore();
const hotelStore = useHotelStore();
const authStore = useAuthStore();
const hotelCategoryStore = useHotelCategoryStore();
const placeStore = usePlaceStore();

const { cities } = storeToRefs(cityStore);
const { places } = storeToRefs(placeStore);
const { hcategories } = storeToRefs(hotelCategoryStore);
const { hotels, loading, importLoading } = storeToRefs(hotelStore);

// ==================== STATIC DATA ====================
const bankName = [
  { id: "1", name: "K + " },
  { id: "2", name: "SCB " },
  { id: "3", name: "Bangkok Bank" },
  { id: "4", name: "Other Bank " },
  { id: "5", name: "CIMB Bank " },
  { id: "6", name: "Krungsri " },
  { id: "7", name: "Krungthai Bank " },
  { id: "8", name: "Land and Houses Bank " },
  { id: "9", name: "Standard Chartered Bank (Thai) " },
  { id: "10", name: "TMBThanachart " },
  { id: "11", name: "UOB " },
  { id: "12", name: "Government Savings Bank " },
  { id: "13", name: "Kiatnakin Phatra Bank " },
  { id: "14", name: "Citibank" },
  { id: "15", name: "Government Housing Bank " },
  { id: "16", name: "Bank for Agriculture and Agricultural Cooperatives " },
  { id: "17", name: "MHCB " },
  { id: "18", name: "Islamic Bank of Thailand " },
  { id: "19", name: "ICBC Thai" },
  { id: "20", name: "Thai Credit " },
  { id: "21", name: "SMBC " },
  { id: "22", name: "HSBC " },
  { id: "23", name: "BNPP " },
  { id: "24", name: "DEUTSCHE BANK AG " },
  { id: "25", name: "Bank of China " },
  { id: "26", name: "Indian Overseas Bank " },
];

const isAiMood = ref(false);
const isAiMoodPart = ref("general");

const paymentMethod = [
  { id: "1", name: "Bank Transfer" },
  { id: "2", name: "International Remittance" },
  { id: "3", name: "Cash" },
  { id: "4", name: "Other ..." },
];

const typeList = ref([
  { id: 1, name: "Direct Booking", value: "direct_booking" },
  { id: 2, name: "Other Booking", value: "other_booking" },
]);

const vat_inclusion_array = [
  { id: 1, name: "Inclusive of VAT" },
  { id: 2, name: "No VAT" },
];

// ==================== STATE DECLARATIONS ====================
// UI State
const quiteSwitch = ref(1);
const errors = ref([]);
const search = ref("");
const createModalOpen = ref(false);
const imageGalleryModal = ref(false);
const showConfirmation = ref(false);

// Dropdown Actions State
const cityAction = ref(false);
const placeAction = ref(false);
const categoryAction = ref(false);

// Display Data
const citylist = ref([]);
const cityName = ref("");
const placeName = ref("");
const categoryName = ref("");
const linkContract = ref({});

// AI Auto-Fill State
const showUploadModal = ref(false);
// const showComparisonModal = ref(false);
// const showContractSaveModal = ref(false);
// const showRoomPeriodModal = ref(false);
const extractedData = ref({});
const uploadedFile = ref(null);
const pendingChanges = ref({});
const saveContractFile = ref(false);

// Form Data
const formData = ref({
  id: "",
  name: "",
  rooms: [],
  city_id: null,
  place_id: null,
  category_id: null,
  vat_inclusion: "",
  type: "other_booking",
  payment_method: "",
  bank_name: "",
  bank_account_number: "",
  check_in: "",
  check_out: "",
  cancellation_policy: "",
  child_policy: "",
  official_address: "",
  vat_id: "",
  vat_name: "",
  vat_address: "",
  official_phone_number: "",
  official_email: "",
  official_remark: "",
  official_logo: "",
  official_logo_has: "",
  account_name: "",
  place: "",
  legal_name: "",
  email: [],
  description: "",
  full_description: null,
  full_description_en: null,
  location_map_title: "",
  location_map: "",
  latitude: "",
  longitude: "",
  rating: "",
  nearby_places: [],
  contract_due: "",
  data_checked: false,
  contracts: [],
  contract_files_preview: [],
  images: [],
  facilities: [],
  good_to_knows: [],
  key_highlights: [],
  near_by_places: [],
  youtube_link: {
    mm_link: "",
    en_link: "",
  },
  slug: [],
});

const originalFormData = ref({});

// Email Management
const addEmail = ref("");

// Image Management
const editImagesPreview = ref([]);
const imagesPreview = ref([]);
const imagesInput = ref(null);
const official_logo_preview = ref(null);
const official_logo_input = ref(null);
const galleryUploadInput = ref(null);

// Contract Management
const contractInput = ref(null);

// Editor
const textEditor = ref(null);
const editorOptions = {
  placeholder: "Description with editor ...",
};

// ==================== AI AUTO-FILL FUNCTIONS ====================
/**
 * Open AI Auto-Fill modal
 */
const openAIAutoFill = () => {
  showUploadModal.value = true;
};

/**
 * Handle data extracted from AI
 */
const handleDataExtracted = ({ extractedData: data, originalFile }) => {
  console.log("Data extracted:", data);
  extractedData.value = data;
  uploadedFile.value = originalFile;
  showUploadModal.value = false;
  nextTick(() => {
    // showComparisonModal.value = true;
    isAiMood.value = true;
  });
};

/**
 * Close comparison modal
 */
// const closeComparisonModal = () => {
//   showComparisonModal.value = false;
//   extractedData.value = {};
//   uploadedFile.value = null;
//   pendingChanges.value = {};
// };

/**
 * Handle apply changes from comparison modal
 */
const handleApplyChanges = (changes) => {
  console.log("Applying changes:", changes);
  pendingChanges.value = changes;
  showComparisonModal.value = false;

  // Check if there are rooms to import
  if (extractedData.value.rooms && extractedData.value.rooms.length > 0) {
    nextTick(() => {
      showRoomPeriodModal.value = true;
    });
  } else {
    nextTick(() => {
      showContractSaveModal.value = true;
    });
  }
};

const pendingHotelChanges = ref({});

const handleApplyHotelData = (changes) => {
  console.log("Applying hotel data changes:", changes);
  pendingHotelChanges.value = changes;

  const { fields, editableValues, extractedData: extracted } = changes;

  Object.keys(fields).forEach((key) => {
    if (fields[key]) {
      let value = editableValues[key] ?? getExtractedValue(key, extracted);

      if (key === "email" && typeof value === "string") {
        value = value
          .split(",")
          .map((email) => email.trim())
          .filter(Boolean);
      }

      if (value !== null && value !== undefined && value !== "") {
        formData.value[key] = value;
      }
    }
  });

  toast.success(
    `✅ ${
      Object.values(fields).filter(Boolean).length
    } hotel data changes applied!`,
    { timeout: 3000 },
  );
};

/**
 * Handle AI Import Complete - Simple Version
 */
const handleAIImportComplete = async () => {
  // Exit AI mode
  isAiMood.value = false;

  // Single confirmation with 3 options
  const result = await Swal.fire({
    title: "🎉 AI Import Complete!",
    html: `
      <div class="text-left space-y-3">
        <div class="bg-green-50 border-2 border-green-200 rounded-lg p-3">
          <p class="text-green-800 font-semibold">✅ Successfully processed:</p>
          <ul class="text-sm text-green-700 mt-2 ml-4 list-disc">
            <li>Hotel data updated</li>
            <li>Rooms processed</li>
          </ul>
        </div>
        
        <div class="bg-purple-50 border-2 border-purple-200 rounded-lg p-3">
          <p class="text-purple-800 font-semibold mb-2">📄 Contract File:</p>
          <p class="text-sm text-purple-700">${
            uploadedFile.value?.name || "Uploaded file"
          }</p>
        </div>
        
        <p class="text-gray-700 font-medium">What would you like to do?</p>
      </div>
    `,
    icon: "question",
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: "💾 Save All + Contract",
    denyButtonText: "💾 Save All (No Contract)",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#8b5cf6",
    denyButtonColor: "#3b82f6",
    cancelButtonColor: "#6b7280",
    customClass: {
      popup: "rounded-xl",
      confirmButton: "font-semibold",
      denyButton: "font-semibold",
      cancelButton: "font-semibold",
    },
  });

  if (result.isConfirmed) {
    // Option 1: Save everything WITH contract
    saveContractFile.value = true;
    await updateHandler();
  } else if (result.isDenied) {
    // Option 2: Save everything WITHOUT contract
    saveContractFile.value = false;
    await updateHandler();
  } else {
    // Option 3: Review first (don't save yet)
    saveContractFile.value = false;
    toast.info("💡 Review the data, then click 'Update' button to save", {
      timeout: 3000,
      position: "top-center",
    });
  }
};

/**
 * Cancel AI Import - Simplified
 */
const cancelAIImport = async () => {
  const result = await Swal.fire({
    title: "⚠️ Cancel AI Import?",
    text: "Any unapplied changes will be lost.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Cancel Import",
    cancelButtonText: "Continue Working",
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
  });

  if (result.isConfirmed) {
    // Reset everything
    isAiMood.value = false;
    extractedData.value = {};
    uploadedFile.value = null;
    pendingHotelChanges.value = {};
    saveContractFile.value = false;

    toast.info("AI import cancelled");
  }
};

/**
 * Handle room period import
 */
const handleRoomPeriodImport = (importData) => {
  console.log("Room import data:", importData);
  showRoomPeriodModal.value = false;
  nextTick(() => {
    showContractSaveModal.value = true;
  });
};

/**
 * Get extracted value by key from AI data
 */
const getExtractedValue = (key, extracted) => {
  const keyMap = {
    name: extracted?.basic_info?.hotel_name,
    legal_name: extracted?.basic_info?.legal_name,
    official_phone_number: extracted?.contact?.official_phone_number,
    official_email: extracted?.contact?.official_email,
    email: extracted?.contact?.email,
    official_address: extracted?.contact?.official_address,
    vat_inclusion: extracted?.financial?.vat_inclusion,
    vat_id: extracted?.financial?.vat_id,
    vat_name: extracted?.financial?.vat_name,
    vat_address: extracted?.financial?.vat_address,
    bank_name: extracted?.financial?.bank_name,
    bank_account_number: extracted?.financial?.bank_account_number,
    account_name: extracted?.financial?.account_name,
    payment_method: extracted?.financial?.payment_method,
    check_in: extracted?.policies?.check_in,
    check_out: extracted?.policies?.check_out,
    cancellation_policy: extracted?.policies?.cancellation_policy,
    child_policy: extracted?.policies?.child_policy,
    contract_due: extracted?.contract?.contract_due,
  };
  return keyMap[key];
};

/**
 * Apply approved changes to formData
 */
const applyChangesToFormData = () => {
  const {
    fields,
    editableValues,
    extractedData: extracted,
  } = pendingChanges.value;

  // Apply basic fields (use edited values if available, otherwise use extracted)
  Object.keys(fields).forEach((key) => {
    if (fields[key]) {
      // Priority: 1. Edited value, 2. Extracted value
      let value = editableValues[key] ?? getExtractedValue(key, extracted);

      // Special handling for array types (emails)
      if (key === "email" && typeof value === "string") {
        // Convert comma-separated string back to array
        value = value
          .split(",")
          .map((email) => email.trim())
          .filter(Boolean);
      }

      if (value !== null && value !== undefined && value !== "") {
        formData.value[key] = value;
      }
    }
  });

  // Handle rooms (if any)
  if (pendingChanges.value.rooms && pendingChanges.value.rooms.length > 0) {
    formData.value.ai_extracted_rooms = pendingChanges.value.rooms;
  }

  const changedCount = Object.values(fields).filter(Boolean).length;
  const editedCount = Object.keys(editableValues).length;

  let message = `✅ ${changedCount} changes applied!`;
  if (editedCount > 0) {
    message += ` (${editedCount} values edited)`;
  }
  message += " Review and save.";

  toast.success(message);
};

/**
 * Save with contract file
 */
// const saveWithContract = () => {
//   saveContractFile.value = true;
//   showContractSaveModal.value = false;
//   applyChangesToFormData();

//   Swal.fire({
//     icon: "success",
//     title: "Changes Applied!",
//     html: `
//       <p class="text-gray-700 mb-3">AI extracted data has been filled into the form.</p>
//       <p class="font-semibold text-blue-600">📝 Don't forget to click "Update" button to save!</p>
//       <p class="text-sm text-gray-600 mt-2">Contract file will be saved with the update.</p>
//     `,
//     confirmButtonText: "Got it!",
//     confirmButtonColor: "#8b5cf6",
//   });
// };
const saveWithContract = async () => {
  saveContractFile.value = true;
  showContractSaveModal.value = false;
  applyChangesToFormData();

  const result = await Swal.fire({
    icon: "success",
    title: "Changes Applied!",
    html: `
      <p class="text-gray-700 mb-3">AI extracted data has been filled into the form.</p>
      <p class="font-semibold text-blue-600">📝 Click "Save Now" to complete the update!</p>
      <p class="text-sm text-gray-600 mt-2">Contract file will be saved with the update.</p>
    `,
    confirmButtonText: "Save Now",
    confirmButtonColor: "#8b5cf6",
    showCancelButton: true,
    cancelButtonText: "Review First",
  });

  if (result.isConfirmed) {
    await updateHandler();
  }
};

/**
 * Save without contract file
 */
const saveWithoutContract = () => {
  saveContractFile.value = false;
  showContractSaveModal.value = false;
  applyChangesToFormData();

  Swal.fire({
    icon: "success",
    title: "Changes Applied!",
    html: `
      <p class="text-gray-700 mb-3">AI extracted data has been filled into the form.</p>
      <p class="font-semibold text-blue-600">📝 Don't forget to click "Update" button to save!</p>
    `,
    confirmButtonText: "Got it!",
    confirmButtonColor: "#8b5cf6",
  });
};

// ==================== EMAIL MANAGEMENT ====================
/**
 * Add email to list
 */
const addEmailAction = () => {
  if (addEmail.value.trim()) {
    formData.value.email.push(addEmail.value.trim());
    addEmail.value = "";
  }
};

/**
 * Remove email from list
 */
const removeEmail = (index) => {
  formData.value.email.splice(index, 1);
};

// ==================== FACILITY MANAGEMENT ====================
/**
 * Update facilities array
 */
const onGetArray = (data) => {
  formData.value.facilities = [];
  for (let i = 0; i < data.length; i++) {
    formData.value.facilities.push(data[i]);
  }
};

// ==================== IMAGE MANAGEMENT ====================
/**
 * Open official logo picker
 */
const openOfficialLogoImagePicker = () => {
  if (official_logo_input.value) {
    official_logo_input.value.click();
  }
};

/**
 * Handle official logo file change
 */
const handlerOfficialLogoFileChange = (e) => {
  let selectedFile = e.target.files[0];
  if (selectedFile) {
    formData.value.official_logo = selectedFile;
    official_logo_preview.value = URL.createObjectURL(selectedFile);
  }
};

/**
 * Open file image picker
 */
const openFileImagePicker = () => {
  if (imagesInput.value) {
    imagesInput.value.click();
  }
};

/**
 * Handle images file change
 */
const handlerImagesFileChange = (e) => {
  let selectedFiles = e.target.files;
  if (selectedFiles) {
    for (let index = 0; index < selectedFiles.length; index++) {
      formData.value.images.push(selectedFiles[index]);
      imagesPreview.value.push(URL.createObjectURL(selectedFiles[index]));
    }
  }
};

/**
 * Remove selected image
 */
const removeImageSelectImage = (index) => {
  formData.value.images.splice(index, 1);
  imagesPreview.value.splice(index, 1);
};

/**
 * Open image gallery modal
 */
const openImageGallery = () => {
  imageGalleryModal.value = true;
};

/**
 * Close image gallery modal
 */
const closeImageGallery = () => {
  imageGalleryModal.value = false;
};

/**
 * Handle gallery image change
 */
const handleGalleryImageChange = (e) => {
  let selectedFiles = e.target.files;
  if (selectedFiles) {
    for (let index = 0; index < selectedFiles.length; index++) {
      formData.value.images.push(selectedFiles[index]);
      imagesPreview.value.push(URL.createObjectURL(selectedFiles[index]));
    }
  }
};

/**
 * Remove image in gallery
 */
const removeImageInGallery = async (index, isEditImage = false) => {
  try {
    if (isEditImage) {
      const res = await hotelStore.deleteImageAction(
        formData.value.id,
        editImagesPreview.value[index].id,
      );
      toast.success("Image deleted successfully");
      editImagesPreview.value.splice(index, 1);
    } else {
      const newIndex = index - editImagesPreview.value.length;
      if (newIndex >= 0 && newIndex < formData.value.images.length) {
        formData.value.images.splice(newIndex, 1);
        imagesPreview.value.splice(newIndex, 1);
      }
    }
  } catch (error) {
    console.error("Error removing image:", error);
    toast.error("Failed to delete image");
  }
};

/**
 * Remove image during update
 */
const removeImageUpdateImage = async (id, imageID) => {
  const res = await hotelStore.deleteImageAction(id, imageID);
  toast.success("delete image success");
  closeModal();
  await getDetail(route.params.id);
};

/**
 * Get remaining image count
 */
const getRemainingImageCount = () => {
  const totalImages =
    editImagesPreview.value.length + imagesPreview.value.length;
  return Math.max(0, totalImages - 5);
};

// ==================== CONTRACT MANAGEMENT ====================
/**
 * Open contract file picker
 */
const openContractFilePicker = () => {
  if (contractInput.value) {
    contractInput.value.click();
  }
};

/**
 * Handle contract file change
 */
const handleContractFileChange = (e) => {
  let selectedFiles = e.target.files;
  if (selectedFiles && selectedFiles.length > 0) {
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      formData.value.contracts.push(file);

      const preview = {
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
        type: file.type,
        url: URL.createObjectURL(file),
        file: file,
      };
      formData.value.contract_files_preview.push(preview);
    }
  }
};

/**
 * Remove contract file
 */
const removeContractFile = (index) => {
  if (formData.value.contracts[index]) {
    if (formData.value.contract_files_preview[index]?.url) {
      URL.revokeObjectURL(formData.value.contract_files_preview[index].url);
    }
    formData.value.contracts.splice(index, 1);
    formData.value.contract_files_preview.splice(index, 1);
  }
};

/**
 * Remove linked contract
 */
const removeLinkContract = async (id) => {
  const res = await hotelStore.deleteHotelContractAction(formData.value.id, id);
  toast.success("delete link contract success");
  await getDetail(route.params.id);
};

// ==================== HELPER FUNCTIONS ====================
/**
 * Check if value is empty
 */
const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === "object" && Object.keys(value).length === 0) return true;
  return false;
};

/**
 * Check if value has changed
 */
const hasChanged = (oldValue, newValue) => {
  if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
    return !isEmpty(newValue);
  }
  return false;
};

/**
 * Format date
 */
const formatDate = (getDate) => {
  if (getDate != null) {
    const dateParts = getDate?.split(" ");
    return dateParts[0];
  }
};

/**
 * Clear editor content
 */
const clearEditorContent = () => {
  if (textEditor.value && textEditor.value.quill) {
    textEditor.value.quill.setText("");
  }
};

/**
 * Close modal and reset form
 */
const closeModal = () => {
  formData.value = {
    id: "",
    name: "",
    place_id: null,
    city_id: null,
    category_id: null,
    vat_inclusion: "",
    rooms: [],
    type: "other_booking",
    payment_method: "",
    bank_name: "",
    bank_account_number: "",
    account_name: "",
    check_in: "",
    check_out: "",
    cancellation_policy: "",
    child_policy: "",
    official_address: "",
    vat_id: "",
    vat_name: "",
    vat_address: "",
    official_phone_number: "",
    official_email: "",
    official_remark: "",
    official_logo: "",
    official_logo_has: "",
    place: "",
    legal_name: "",
    email: [],
    description: "",
    full_description: null,
    full_description_en: null,
    location_map_title: "",
    location_map: "",
    rating: "",
    latitude: "",
    longitude: "",
    nearby_places: [],
    youtube_link: {
      mm_link: "",
      en_link: "",
    },
    contract_due: "",
    data_checked: false,
    contracts: [],
    contract_files_preview: [],
    images: [],
    facilities: [],
  };

  linkContract.value = {};
  editImagesPreview.value = [];
  quiteSwitch.value = true;
  imagesPreview.value = [];
  createModalOpen.value = false;
  imageGalleryModal.value = false;

  if (formData.value.full_description == null) {
    clearEditorContent();
  }
  if (formData.value.full_description_en == null) {
    clearEditorContent();
  }
};

// ==================== CRUD OPERATIONS ====================
/**
 * Add new hotel
 */
const addNewHandler = async () => {
  const frmData = new FormData();

  // Basic Information
  frmData.append("name", formData.value.name);
  frmData.append("city_id", formData.value.city_id);

  if (formData.value.place_id != null) {
    frmData.append("place_id", formData.value.place_id);
  }

  if (
    formData.value.category_id != undefined &&
    formData.value.category_id != "undefined" &&
    formData.value.category_id != "" &&
    formData.value.category_id != "null"
  ) {
    frmData.append("category_id", formData.value.category_id);
  }

  if (formData.value.vat_inclusion != "") {
    frmData.append("vat_inclusion", formData.value.vat_inclusion);
  }

  frmData.append("type", formData.value.type);
  frmData.append("account_name", formData.value.account_name);
  frmData.append("official_address", formData.value.official_address);
  frmData.append("vat_id", formData.value.vat_id);
  frmData.append("vat_name", formData.value.vat_name);
  frmData.append("vat_address", formData.value.vat_address);
  frmData.append("official_phone_number", formData.value.official_phone_number);
  frmData.append("official_email", formData.value.official_email);
  frmData.append("official_remark", formData.value.official_remark);

  if (formData.value.official_logo) {
    frmData.append("official_logo", formData.value.official_logo);
  }

  frmData.append("check_in", formData.value.check_in);
  frmData.append("check_out", formData.value.check_out);
  frmData.append("cancellation_policy", formData.value.cancellation_policy);
  frmData.append("child_policy", formData.value.child_policy);
  frmData.append("place", formData.value.place);
  frmData.append("payment_method", formData.value.payment_method);
  frmData.append("bank_name", formData.value.bank_name);
  frmData.append("bank_account_number", formData.value.bank_account_number);
  frmData.append("legal_name", formData.value.legal_name);
  frmData.append("description", formData.value.description);
  frmData.append("full_description", formData.value.full_description);
  frmData.append("full_description_en", formData.value.full_description_en);
  frmData.append("location_map_title", formData.value.location_map_title);
  frmData.append("location_map", formData.value.location_map);

  if (formData.value.rating != "") {
    frmData.append("rating", formData.value.rating);
  }

  if (formData.value.latitude && formData.value.longitude) {
    frmData.append("latitude", formData.value.latitude);
    frmData.append("longitude", formData.value.longitude);
  }

  frmData.append("contract_due", formData.value.contract_due);
  frmData.append("data_checked", formData.value.data_checked ? 1 : 0);

  // Images
  if (formData.value.images.length > 0) {
    for (let i = 0; i < formData.value.images.length; i++) {
      let file = formData.value.images[i];
      frmData.append("images[" + i + "]", file);
    }
  }

  // YouTube Links
  frmData.append(
    "youtube_link[0][mm_link]",
    formData.value.youtube_link.mm_link
      ? formData.value.youtube_link.mm_link
      : "",
  );
  frmData.append(
    "youtube_link[0][en_link]",
    formData.value.youtube_link.en_link
      ? formData.value.youtube_link.en_link
      : "",
  );

  // Nearby Places
  if (formData.value.nearby_places.length > 0) {
    for (let i = 0; i < formData.value.nearby_places.length; i++) {
      frmData.append(
        "nearby_places[" + i + "][image]",
        formData.value.nearby_places[i].img,
      );
      frmData.append(
        "nearby_places[" + i + "][name]",
        formData.value.nearby_places[i].place,
      );
      frmData.append(
        "nearby_places[" + i + "][distance]",
        formData.value.nearby_places[i].distance,
      );
    }
  }

  // Emails
  if (formData.value.email.length > 0) {
    for (let i = 0; i < formData.value.email.length; i++) {
      frmData.append("email[" + i + "]", formData.value.email[i]);
    }
  }

  // Facilities
  if (formData.value.facilities.length > 0) {
    for (let f = 0; f < formData.value.facilities.length; f++) {
      frmData.append("facilities[" + f + "]", formData.value.facilities[f]);
    }
  }

  // Contracts
  let contractIndex = 0;

  // AI-uploaded contract
  if (saveContractFile.value && uploadedFile.value) {
    frmData.append(`contracts[${contractIndex}]`, uploadedFile.value);
    contractIndex++;
  }

  // Manually uploaded contracts
  if (formData.value.contracts.length > 0) {
    for (let i = 0; i < formData.value.contracts.length; i++) {
      let file = formData.value.contracts[i];
      frmData.append(`contracts[${contractIndex}]`, file);
      contractIndex++;
    }
  }

  try {
    const response = await hotelStore.addNewAction(frmData);

    // Reset state
    saveContractFile.value = false;
    uploadedFile.value = null;
    errors.value = null;
    imagesPreview.value = [];
    editImagesPreview.value = [];
    formData.value.contract_files_preview = [];

    closeModal();
    createModalOpen.value = false;
    toast.success(response.message);

    window.location.reload();
  } catch (error) {
    if (error.response.data.errors) {
      errors.value = error.response.data.errors;
    }
    toast.error(error.response.data.message, {
      maxToasts: 1,
    });
    setTimeout(async () => {
      await hotelStore.toggleLoading();
    }, 5000);
  }
};

/**
 * Update existing hotel
 */
const updateHandler = async () => {
  const frmData = new FormData();

  // Only add changed and non-empty fields
  if (hasChanged(originalFormData.value.name, formData.value.name)) {
    frmData.append("name", formData.value.name);
  }

  if (hasChanged(originalFormData.value.place, formData.value.place)) {
    frmData.append("place", formData.value.place);
  }

  if (hasChanged(originalFormData.value.city_id, formData.value.city_id)) {
    frmData.append("city_id", formData.value.city_id);
  }

  if (
    hasChanged(originalFormData.value.place_id, formData.value.place_id) &&
    formData.value.place_id != null
  ) {
    frmData.append("place_id", formData.value.place_id);
  }

  if (
    hasChanged(
      originalFormData.value.category_id,
      formData.value.category_id,
    ) &&
    formData.value.category_id != undefined &&
    formData.value.category_id != "undefined" &&
    formData.value.category_id != "" &&
    formData.value.category_id != "null"
  ) {
    frmData.append("category_id", formData.value.category_id);
  }

  if (
    hasChanged(
      originalFormData.value.vat_inclusion,
      formData.value.vat_inclusion,
    ) &&
    formData.value.vat_inclusion != ""
  ) {
    frmData.append("vat_inclusion", formData.value.vat_inclusion);
  }

  if (hasChanged(originalFormData.value.type, formData.value.type)) {
    frmData.append("type", formData.value.type);
  }

  if (
    hasChanged(
      originalFormData.value.payment_method,
      formData.value.payment_method,
    )
  ) {
    frmData.append("payment_method", formData.value.payment_method);
  }

  if (hasChanged(originalFormData.value.bank_name, formData.value.bank_name)) {
    frmData.append("bank_name", formData.value.bank_name);
  }

  if (
    hasChanged(
      originalFormData.value.bank_account_number,
      formData.value.bank_account_number,
    )
  ) {
    frmData.append("bank_account_number", formData.value.bank_account_number);
  }

  if (
    hasChanged(originalFormData.value.account_name, formData.value.account_name)
  ) {
    frmData.append("account_name", formData.value.account_name);
  }

  if (
    hasChanged(
      originalFormData.value.official_address,
      formData.value.official_address,
    )
  ) {
    frmData.append("official_address", formData.value.official_address);
  }

  if (hasChanged(originalFormData.value.vat_id, formData.value.vat_id)) {
    frmData.append("vat_id", formData.value.vat_id);
  }

  if (hasChanged(originalFormData.value.vat_name, formData.value.vat_name)) {
    frmData.append("vat_name", formData.value.vat_name);
  }

  if (
    hasChanged(originalFormData.value.vat_address, formData.value.vat_address)
  ) {
    frmData.append("vat_address", formData.value.vat_address);
  }

  if (
    hasChanged(
      originalFormData.value.official_phone_number,
      formData.value.official_phone_number,
    )
  ) {
    frmData.append(
      "official_phone_number",
      formData.value.official_phone_number,
    );
  }

  if (
    hasChanged(
      originalFormData.value.official_email,
      formData.value.official_email,
    ) &&
    formData.value.official_email &&
    formData.value.official_email !== null
  ) {
    frmData.append("official_email", formData.value.official_email);
  }

  if (
    hasChanged(
      originalFormData.value.official_remark,
      formData.value.official_remark,
    )
  ) {
    frmData.append("official_remark", formData.value.official_remark);
  }

  if (
    formData.value.official_logo &&
    formData.value.official_logo instanceof File
  ) {
    frmData.append("official_logo", formData.value.official_logo);
  }

  if (
    hasChanged(originalFormData.value.check_in, formData.value.check_in) &&
    formData.value.check_in &&
    formData.value.check_in !== null
  ) {
    frmData.append("check_in", formData.value.check_in);
  }

  if (
    hasChanged(originalFormData.value.check_out, formData.value.check_out) &&
    formData.value.check_out &&
    formData.value.check_out !== null
  ) {
    frmData.append("check_out", formData.value.check_out);
  }

  if (
    hasChanged(
      originalFormData.value.cancellation_policy,
      formData.value.cancellation_policy,
    )
  ) {
    frmData.append("cancellation_policy", formData.value.cancellation_policy);
  }

  if (
    hasChanged(originalFormData.value.child_policy, formData.value.child_policy)
  ) {
    frmData.append("child_policy", formData.value.child_policy);
  }

  if (
    hasChanged(originalFormData.value.legal_name, formData.value.legal_name)
  ) {
    frmData.append("legal_name", formData.value.legal_name);
  }

  if (
    hasChanged(originalFormData.value.description, formData.value.description)
  ) {
    frmData.append("description", formData.value.description);
  }

  if (
    hasChanged(
      originalFormData.value.full_description,
      formData.value.full_description,
    )
  ) {
    frmData.append("full_description", formData.value.full_description);
  }

  if (
    hasChanged(
      originalFormData.value.full_description_en,
      formData.value.full_description_en,
    )
  ) {
    frmData.append("full_description_en", formData.value.full_description_en);
  }

  if (
    hasChanged(
      originalFormData.value.contract_due,
      formData.value.contract_due,
    ) &&
    formData.value.contract_due != null &&
    formData.value.contract_due != undefined &&
    formData.value.contract_due != "null" &&
    formData.value.contract_due != "undefined"
  ) {
    frmData.append("contract_due", formData.value.contract_due);
  }

  frmData.append("data_checked", formData.value.data_checked ? 1 : 0);

  if (
    hasChanged(
      originalFormData.value.location_map_title,
      formData.value.location_map_title,
    )
  ) {
    frmData.append("location_map_title", formData.value.location_map_title);
  }

  if (
    hasChanged(originalFormData.value.location_map, formData.value.location_map)
  ) {
    frmData.append("location_map", formData.value.location_map);
  }

  if (
    hasChanged(originalFormData.value.rating, formData.value.rating) &&
    formData.value.rating !== "" &&
    formData.value.rating !== null
  ) {
    frmData.append("rating", formData.value.rating);
  }

  if (
    hasChanged(originalFormData.value.latitude, formData.value.latitude) ||
    hasChanged(originalFormData.value.longitude, formData.value.longitude)
  ) {
    if (formData.value.latitude && formData.value.longitude) {
      frmData.append("latitude", formData.value.latitude);
      frmData.append("longitude", formData.value.longitude);
    }
  }

  // Contracts
  let contractIndex = 0;

  // AI-uploaded contract
  if (saveContractFile.value && uploadedFile.value) {
    frmData.append(`contracts[${contractIndex}]`, uploadedFile.value);
    contractIndex++;
  }

  // Manually uploaded contracts
  if (formData.value.contracts.length > 0) {
    for (let i = 0; i < formData.value.contracts.length; i++) {
      let file = formData.value.contracts[i];
      frmData.append(`contracts[${contractIndex}]`, file);
      contractIndex++;
    }
  }

  // Only append email if changed
  if (hasChanged(originalFormData.value.email, formData.value.email)) {
    if (formData.value.email.length > 0) {
      for (let i = 0; i < formData.value.email.length; i++) {
        frmData.append("email[" + i + "]", formData.value.email[i]);
      }
    }
  }

  // Only append youtube links if changed
  if (
    hasChanged(originalFormData.value.youtube_link, formData.value.youtube_link)
  ) {
    frmData.append(
      "youtube_link[0][mm_link]",
      formData.value.youtube_link.mm_link
        ? formData.value.youtube_link.mm_link
        : "",
    );
    frmData.append(
      "youtube_link[0][en_link]",
      formData.value.youtube_link.en_link
        ? formData.value.youtube_link.en_link
        : "",
    );
  }

  // Add AI extracted rooms if any
  if (
    formData.value.ai_extracted_rooms &&
    formData.value.ai_extracted_rooms.length > 0
  ) {
    frmData.append(
      "ai_extracted_rooms",
      JSON.stringify(formData.value.ai_extracted_rooms),
    );
  }

  // Only append nearby places if changed
  if (
    hasChanged(
      originalFormData.value.nearby_places,
      formData.value.nearby_places,
    )
  ) {
    if (formData.value.nearby_places.length > 0) {
      for (let i = 0; i < formData.value.nearby_places.length; i++) {
        if (formData.value.nearby_places[i].img) {
          frmData.append(
            "nearby_places[" + i + "][image]",
            formData.value.nearby_places[i].img,
          );
        } else if (formData.value.nearby_places[i].image) {
          frmData.append(
            "nearby_places[" + i + "][image]",
            formData.value.nearby_places[i].image,
          );
        }
        frmData.append(
          "nearby_places[" + i + "][name]",
          formData.value.nearby_places[i].place,
        );
        frmData.append(
          "nearby_places[" + i + "][distance]",
          formData.value.nearby_places[i].distance,
        );
      }
    }
  }

  // Only append facilities if changed
  if (
    hasChanged(originalFormData.value.facilities, formData.value.facilities)
  ) {
    if (formData.value.facilities.length > 0) {
      for (let f = 0; f < formData.value.facilities.length; f++) {
        frmData.append("facilities[" + f + "]", formData.value.facilities[f]);
      }
    }
  }

  // Only append new images
  if (formData.value.images.length > 0) {
    for (let i = 0; i < formData.value.images.length; i++) {
      let file = formData.value.images[i];
      frmData.append("images[" + i + "]", file);
    }
  }

  frmData.append("_method", "PUT");

  try {
    const response = await hotelStore.updateAction(frmData, formData.value.id);

    // Reset AI state
    saveContractFile.value = false;
    uploadedFile.value = null;

    // Reset form
    errors.value = null;
    imagesPreview.value = [];
    editImagesPreview.value = [];
    formData.value.contract_files_preview = [];
    originalFormData.value = {};

    if (formData.value.ai_extracted_rooms) {
      delete formData.value.ai_extracted_rooms;
    }

    createModalOpen.value = false;
    closeModal();

    toast.success(response.message);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  } catch (error) {
    if (error.response.data.errors) {
      errors.value = error.response.data.errors;
    }
    toast.error(error.response.data.message);
    setTimeout(async () => {
      await hotelStore.toggleLoading();
    }, 5000);
  }
};

/**
 * Submit handler - routes to add or update
 */
const onSubmitHandler = async () => {
  if (formData.value.id) {
    updateHandler();
  } else {
    addNewHandler();
  }
};

/**
 * Get hotel details
 */
const getDetail = async (params) => {
  if (params == "create") {
    formData.value.id = "";
  } else {
    formData.value.id = params;
    const res = await hotelStore.getDetailAction(params);
    let data = res.result;

    closeModal();

    // Basic Info
    formData.value.id = data.id;
    formData.value.slug = data.slug;
    formData.value.name = data.name;
    cityName.value = data.city?.name;
    placeName.value = data.hotel_place?.name;
    categoryName.value = data.category?.name;
    formData.value.city_id = data.city?.id;
    formData.value.place_id = data.hotel_place?.id;
    formData.value.category_id = data.category?.id;
    formData.value.vat_inclusion = data.vat_inclusion;
    formData.value.type = data.type;
    formData.value.place = data.place;
    formData.value.legal_name = data.legal_name;
    formData.value.email = data.email == null ? [] : data.email;

    // Descriptions
    formData.value.description = data.description;
    formData.value.full_description = data.full_description;
    formData.value.full_description_en = data.full_description_en;

    // Location
    formData.value.location_map_title = "";
    formData.value.location_map = "";
    formData.value.rating = "";
    formData.value.latitude = data.latitude;
    formData.value.longitude = data.longitude;

    // Additional Data
    formData.value.nearby_places = [];
    formData.value.good_to_knows = data.good_to_knows;
    formData.value.key_highlights = data.key_highlights;
    formData.value.near_by_places = data.near_by_places;
    formData.value.youtube_link = {
      mm_link: "",
      en_link: "",
    };

    // Financial
    formData.value.contract_due = formatDate(data.contract_due);
    formData.value.data_checked = data.data_checked;
    formData.value.bank_account_number = data.bank_account_number;
    formData.value.account_name = data.account_name;

    // Policies
    formData.value.check_in = data.check_in;
    formData.value.check_out = data.check_out;
    formData.value.cancellation_policy = data.cancellation_policy;
    formData.value.child_policy = data.child_policy;

    // Official Info
    formData.value.official_address = data.official_address;
    formData.value.vat_id = data.vat_id;
    formData.value.vat_name = data.vat_name;
    formData.value.vat_address = data.vat_address;
    formData.value.official_phone_number = data.official_phone_number;
    formData.value.official_email = data.official_email;
    formData.value.official_remark = data.official_remark;
    formData.value.official_logo_has = data.official_logo;
    formData.value.payment_method = data.payment_method;
    formData.value.bank_name = data.bank_name;

    // Contracts
    formData.value.contracts = [];
    formData.value.contract_files_preview = [];
    linkContract.value = data;

    // Images
    if (data.images.length > 0) {
      editImagesPreview.value = [];
      for (let i = 0; i < data.images.length; i++) {
        editImagesPreview.value.push(data.images[i]);
      }
    }

    // Facilities
    if (data.facilities.length > 0) {
      formData.value.facilities = [];
      for (let i = 0; i < data.facilities.length; i++) {
        formData.value.facilities.push(data.facilities[i].id);
      }
    }

    // Location Details
    formData.value.location_map = data.location_map;
    formData.value.location_map_title = data.location_map_title;
    formData.value.rating = data.rating;

    // YouTube
    if (data.youtube_link != null && data.youtube_link.length > 0) {
      formData.value.youtube_link = {
        mm_link: data.youtube_link[0].mm_link,
        en_link: data.youtube_link[0].en_link,
      };
    }

    // Nearby Places
    if (data?.nearby_places?.length > 0) {
      for (let i = 0; i < data.nearby_places.length; i++) {
        let obj = {
          image: data.nearby_places[i].image,
          place: data.nearby_places[i].name,
          distance: data.nearby_places[i].distance,
        };
        formData.value.nearby_places.push(obj);
      }
    }

    // Store original for comparison
    originalFormData.value = JSON.parse(JSON.stringify(formData.value));

    createModalOpen.value = true;

    if (route.query.quiteSwitch) {
      quiteSwitch.value = route.query.quiteSwitch;
    }
  }
};

// ==================== NAVIGATION ====================
/**
 * Change tab/switch
 */
const changeSwitch = (val) => {
  quiteSwitch.value = val;
  router.push({
    name: "hoteledit-v2",
    params: {
      id: route.params.id,
    },
    query: {
      quiteSwitch: val,
    },
  });
};

// ==================== WATCHERS ====================
/**
 * Watch dropdown actions to load data
 */
watch(
  [cityAction, categoryAction, placeAction],
  async ([newCity, newCategory, newPlace]) => {
    if (newCity == true) {
      await cityStore.getSimpleListAction();
      citylist.value = cities.value.data;
    }
    if (newCategory == true) {
      await hotelCategoryStore.getSimpleListAction();
    }
    if (newPlace == true) {
      await placeStore.getSimpleListAction();
    }
  },
);

/**
 * Watch city change to enable place selection
 */
watch(
  () => formData.value.city_id,
  (newCityId) => {
    if (newCityId) {
      placeAction.value = true;
    }
  },
);

// ==================== LIFECYCLE HOOKS ====================
/**
 * Initialize component
 */
onMounted(async () => {
  await getDetail(route.params.id);
});
</script>

<template>
  <Layout>
    <!-- <button
      @click="$router.push('/hotel-v2')"
      class="p-3 mb-5 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-50"
    >
      <svg
        class="w-5 h-5 text-gray-700"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button> -->
    <HotelAIImportPage
      v-if="isAiMood"
      :extractedData="extractedData"
      :currentData="formData"
      :originalFile="uploadedFile"
      @applyHotelData="handleApplyHotelData"
      @complete="handleAIImportComplete"
      @cancel="cancelAIImport"
    />
    <div class="h-auto col-span-2 bg-white" v-else>
      <div class="h-auto pb-4">
        <div class="py-2 px-6">
          <div class="flex gap-6 items-center mt-5 justify-between">
            <div class="flex justify-start items-center space-x-4">
              <h3 class="text-xl font-bold text-gray-800">
                {{ formData.id ? `${formData.name}` : `${formData.name}` }}
              </h3>

              <div class="flex gap-2 items-center">
                <div class="relative">
                  <v-select
                    v-model="formData.type"
                    class="style-chooser-type bg-[#FF613C] rounded-lg p-0.5 w-full max-w-[170px]"
                    :class="errors?.name ? 'border border-red-500' : ''"
                    :options="typeList ?? []"
                    :style="{
                      '--vs-dropdown-bg': '#ffffff',
                      '--vs-selected-bg': '#f97316',
                      '--vs-selected-color': '#ffffff',
                      '--vs-dropdown-option-color': '#ffffff',
                      '--vs-border-color': 'transparent',
                      '--vs-border-width': '0px',
                    }"
                    label="name"
                    :clearable="false"
                    :reduce="(d) => d.value"
                    placeholder="Select Type"
                  >
                    <template #open-indicator="{ attributes }">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-chevron-down"
                        v-bind="attributes"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </template>
                    <template #option="{ name }">
                      <div class="text-black hover:text-white">{{ name }}</div>
                    </template>
                    <template #selected-option="{ name }">
                      <div class="text-white">{{ name }}</div>
                    </template>
                  </v-select>
                  <p v-if="errors?.type" class="mt-1 text-sm text-red-500">
                    {{ errors.type[0] }}
                  </p>
                </div>
              </div>
            </div>

            <button
              v-if="formData.id"
              @click="openAIAutoFill"
              class="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
            >
              <span class="text-lg">🤖</span>
              <span>AI Auto-Fill</span>
            </button>
          </div>

          <div class="flex gap-4 mt-7">
            <div
              class="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-5 w-full max-w-52"
            >
              <div class="flex items-center gap-2 mb-1">
                <span class="text-2xl font-medium text-black-800">23</span>
                <span class="text-sm text-green-600 font-semibold">
                  ▲ 32%
                </span>
                <span class="text-sm text-red-600 font-semibold"> ▼ 2% </span>
              </div>
              <p class="text-sm text-black-500">Total Sales This Month</p>
            </div>
            <div
              class="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-5 w-full max-w-52"
            >
              <div class="flex items-center gap-2 mb-1">
                <span class="text-2xl font-medium text-black-800">23</span>
                <span class="text-sm text-green-600 font-semibold">
                  ▲ 32%
                </span>
                <span class="text-sm text-red-600 font-semibold"> ▼ 2% </span>
              </div>
              <p class="text-sm text-black-500">Hotel Views</p>
            </div>
          </div>

          <div
            class="flex justify-start overflow-x-scroll w-full no-sidebar-container items-center gap-2 mt-6"
          >
            <p
              class="px-4 py-2 cursor-pointer text-sm rounded-lg transition-all duration-200 whitespace-nowrap"
              @click="quiteSwitch = 1"
              :class="
                quiteSwitch == 1
                  ? 'bg-[#FF613c] text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              "
            >
              General
            </p>
            <p
              class="px-4 py-2 cursor-pointer rounded-lg text-sm transition-all duration-200 whitespace-nowrap"
              @click="quiteSwitch = 2"
              :class="
                quiteSwitch == 2
                  ? 'bg-[#FF613c] text-white shadow-md'
                  : 'bg-white text-gray-700  hover:bg-gray-50'
              "
            >
              Hotel Detail & Info
            </p>
            <p
              class="px-4 py-2 cursor-pointer rounded-lg text-sm transition-all duration-200 whitespace-nowrap"
              @click="quiteSwitch = 3"
              :class="
                quiteSwitch == 3
                  ? 'bg-[#FF613c] text-white shadow-md'
                  : 'bg-white text-gray-700  hover:bg-gray-50'
              "
            >
              Facilities
            </p>
            <p
              class="px-4 py-2 cursor-pointer rounded-lg text-sm transition-all duration-200 whitespace-nowrap"
              @click="quiteSwitch = 4"
              :class="
                quiteSwitch == 4
                  ? 'bg-[#FF613c] text-white shadow-md'
                  : 'bg-white text-gray-700  hover:bg-gray-50'
              "
            >
              Location & More Details
            </p>
            <p
              v-if="formData.id"
              class="px-4 py-2 cursor-pointer rounded-lg text-sm transition-all duration-200 whitespace-nowrap"
              @click="quiteSwitch = 5"
              :class="
                quiteSwitch == 5
                  ? 'bg-[#FF613c] text-white shadow-md'
                  : 'bg-white text-gray-700  hover:bg-gray-50'
              "
            >
              Add On
            </p>

            <p
              v-if="formData.id"
              class="px-4 py-2 cursor-pointer rounded-lg text-sm transition-all duration-200 whitespace-nowrap"
              @click="quiteSwitch = 7"
              :class="
                quiteSwitch == 7
                  ? 'bg-[#FF613c] text-white shadow-md'
                  : 'bg-white text-gray-700  hover:bg-gray-50'
              "
            >
              Slugs
            </p>
            <p
              v-if="formData.id"
              class="px-4 py-2 cursor-pointer rounded-lg text-sm transition-all duration-200 whitespace-nowrap"
              @click="changeSwitch(8)"
              :class="
                quiteSwitch == 8
                  ? 'bg-[#FF613c] text-white shadow-md'
                  : 'bg-white text-gray-700  hover:bg-gray-50'
              "
            >
              Good to Know
            </p>
            <p
              v-if="formData.id"
              class="px-4 py-2 cursor-pointer rounded-lg text-sm transition-all duration-200 whitespace-nowrap"
              @click="changeSwitch(9)"
              :class="
                quiteSwitch == 9
                  ? 'bg-[#FF613c] text-white shadow-md'
                  : 'bg-white text-gray-700  hover:bg-gray-50'
              "
            >
              Key Highlight
            </p>
            <p
              v-if="formData.id"
              class="px-4 py-2 cursor-pointer rounded-lg text-sm transition-all duration-200 whitespace-nowrap"
              @click="changeSwitch(10)"
              :class="
                quiteSwitch == 10
                  ? 'bg-[#FF613c] text-white shadow-md'
                  : 'bg-white text-gray-700  hover:bg-gray-50'
              "
            >
              Near Places
            </p>
            <p
              v-if="formData.id"
              class="px-4 py-2 cursor-pointer rounded-lg text-sm transition-all duration-200 whitespace-nowrap"
              @click="changeSwitch(11)"
              :class="
                quiteSwitch == 11
                  ? 'bg-[#FF613c] text-white shadow-md'
                  : 'bg-white text-gray-700  hover:bg-gray-50'
              "
            >
              Rooms
            </p>
          </div>
        </div>

        <div v-if="quiteSwitch == 1" class="">
          <form
            @submit.prevent="onSubmitHandler"
            class="bg-white rounded-xl px-6 pb-6 pt-4 relative"
          >
            <button
              type="submit"
              :disabled="loading"
              class="absolute -top-[100px] right-6 text-sm py-2 px-4 font-medium text-white bg-[#ff613c] border border-transparent rounded-lg shadow-sm hover:bg-[#e05530] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff613c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <div class="flex gap-1">
                <span>{{ loading ? "Updating..." : "Update" }}</span>
                <PlusIcon class="w-4 h-4" />
              </div>
            </button>
            <div class="grid grid-cols-2 gap-8">
              <div class="space-y-8">
                <div
                  class="border border-gray-200 rounded-lg py-6 px-4 shadow-sm bg-gray-50/30"
                >
                  <h4
                    class="text-lg font-semibold text-gray-800 mb-6 pb-3 border-gray-200"
                  >
                    General Information
                  </h4>
                  <div class="space-y-5">
                    <div class="space-y-2">
                      <label
                        for="hotel-name"
                        class="text-sm font-medium text-gray-700"
                        >Hotel Name *</label
                      >
                      <input
                        type="text"
                        v-model="formData.name"
                        id="hotel-name"
                        class="w-full h-10 text-sm px-4 py-2 text-gray-900 bg-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
                        :class="errors?.name ? 'border-2 border-red-500' : ''"
                      />
                      <p v-if="errors?.name" class="mt-1 text-sm text-red-500">
                        {{ errors.name[0] }}
                      </p>
                    </div>

                    <div class="space-y-2">
                      <label
                        for="legal-name"
                        class="text-sm font-medium text-gray-700"
                        >Legal Name</label
                      >
                      <input
                        type="text"
                        v-model="formData.legal_name"
                        id="legal-name"
                        class="w-full h-10 text-sm px-4 py-2 text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
                      />
                    </div>

                    <div class="space-y-2">
                      <label
                        for="city"
                        class="text-sm font-medium text-gray-700"
                        >Cities
                        <span :class="errors?.city_id ? 'text-red-500' : ''"
                          >*</span
                        ></label
                      >
                      <div
                        v-if="!cityAction"
                        @click="cityAction = true"
                        class="text-sm text-gray-500 hover:text-gray-600 bg-gray-100 rounded-md px-4 py-2.5 w-full flex justify-between items-center cursor-pointer"
                      >
                        <p>{{ cityName == "" ? "Choose city" : cityName }}</p>
                        <ArrowDownTrayIcon class="w-4 h-4" />
                      </div>
                      <v-select
                        v-model="formData.city_id"
                        v-if="cityAction"
                        class="style-chooser bg-gray-100 border-0"
                        :options="citylist ?? []"
                        :class="errors?.city_id ? 'border border-red-500' : ''"
                        label="name"
                        :clearable="false"
                        :reduce="(city) => city.id"
                        placeholder="Choose City"
                        @input="
                          placeAction = false;
                          formData.place_id = null;
                          placeName = '';
                        "
                      ></v-select>
                      <p
                        v-if="errors?.city_id"
                        class="mt-1 text-sm text-red-500"
                      >
                        {{ errors.city_id[0] }}
                      </p>
                    </div>

                    <div class="space-y-2">
                      <label
                        for="place"
                        class="text-sm font-medium text-gray-700 flex justify-between items-center"
                      >
                        <div>
                          Place
                          <span :class="errors?.place_id ? 'text-red-500' : ''"
                            >*</span
                          >
                        </div>
                        <router-link
                          class="text-xs text-orange-500 hover:text-orange-600 hover:underline transition-colors"
                          to="/database/5"
                        >
                          <div class="flex items-center gap-1">
                            <PlusIcon class="w-4 h-4" />
                            <p>Create place</p>
                          </div>
                        </router-link>
                      </label>
                      <div
                        v-if="!placeAction || !formData.city_id"
                        @click="placeAction = true"
                        class="text-sm text-gray-500 hover:text-gray-600 bg-gray-100 rounded-md px-4 py-2.5 w-full flex justify-between items-center"
                        :class="
                          !formData.city_id
                            ? 'opacity-50 cursor-not-allowed'
                            : 'cursor-pointer'
                        "
                        :disabled="!formData.city_id"
                      >
                        <p>
                          {{ placeName == "" ? "Choose place" : placeName }}
                        </p>
                        <ArrowDownTrayIcon class="w-4 h-4" />
                      </div>
                      <v-select
                        v-model="formData.place_id"
                        v-if="placeAction && formData.city_id"
                        class="style-chooser bg-gray-100 border-0"
                        :class="errors?.place_id ? 'border border-red-500' : ''"
                        :options="places?.data ?? []"
                        label="name"
                        :clearable="false"
                        :reduce="(place) => place.id"
                        placeholder="Choose Place"
                        :disabled="!formData.city_id"
                      ></v-select>
                      <p
                        v-if="!formData.city_id"
                        class="text-xs text-gray-500 mt-1"
                      >
                        Please select a city first
                      </p>
                      <p
                        v-if="errors?.place_id"
                        class="mt-1 text-sm text-red-500"
                      >
                        {{ errors.place_id[0] }}
                      </p>
                    </div>

                    <div class="space-y-2">
                      <label
                        for="category"
                        class="text-sm font-medium text-gray-700"
                        >Category</label
                      >
                      <div
                        v-if="!categoryAction"
                        @click="categoryAction = true"
                        class="text-sm text-gray-500 hover:text-gray-600 bg-gray-100 rounded-md px-4 py-2.5 w-full flex justify-between items-center cursor-pointer"
                      >
                        <p>
                          {{
                            categoryName == ""
                              ? "Choose category"
                              : categoryName
                          }}
                        </p>
                        <ArrowDownTrayIcon class="w-4 h-4" />
                      </div>
                      <v-select
                        v-model="formData.category_id"
                        v-if="categoryAction"
                        class="style-chooser bg-gray-100"
                        :options="hcategories?.data ?? []"
                        label="name"
                        :clearable="false"
                        :reduce="(h) => h.id"
                        placeholder="Choose Category"
                      ></v-select>
                    </div>
                  </div>
                </div>

                <div
                  class="border border-gray-200 rounded-lg py-6 px-4 shadow-sm bg-gray-50/30"
                >
                  <h4
                    class="text-lg font-semibold text-gray-800 mb-6 pb-3 border-gray-200"
                  >
                    Contact Detail
                  </h4>
                  <div class="space-y-5">
                    <div class="space-y-2">
                      <label
                        for="official-phone"
                        class="text-sm font-medium text-gray-700"
                        >Official Phone Number *</label
                      >
                      <input
                        type="text"
                        v-model="formData.official_phone_number"
                        id="official-phone"
                        class="w-full h-10 text-sm px-4 py-2 text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
                      />
                    </div>

                    <div class="space-y-2">
                      <label
                        for="official-email"
                        class="text-sm font-medium text-gray-700"
                        >Official Email</label
                      >
                      <input
                        type="email"
                        v-model="formData.official_email"
                        id="official-email"
                        class="w-full h-10 text-sm px-4 py-2 text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
                      />
                    </div>

                    <div class="space-y-2">
                      <label
                        for="booking-emails"
                        class="text-sm font-medium text-gray-700"
                        >Emails for booking</label
                      >
                      <div class="space-y-2">
                        <div class="flex gap-2">
                          <input
                            type="email"
                            v-model="addEmail"
                            id="booking-emails"
                            placeholder="Add email address"
                            class="flex-1 h-10 text-sm px-4 py-2 text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
                          />
                          <div
                            class="h-10 w-10 flex items-center justify-center"
                          >
                            <button
                              type="button"
                              @click="addEmailAction"
                              class="p-1 bg-blue-500 text-white text-sm font-medium rounded-full transition-colors"
                            >
                              <PlusIcon class="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        <div
                          v-for="(email, index) in formData.email"
                          :key="index"
                          class="flex items-center gap-2"
                        >
                          <input
                            type="email"
                            v-model="formData.email[index]"
                            class="flex-1 h-10 text-sm px-4 py-2 text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
                          />
                          <button
                            type="button"
                            @click="removeEmail(index)"
                            class="h-10 w-10 flex items-center justify-center bg-[#ff613c] text-white text-sm font-medium rounded-md hover:bg-[#e05530] transition-colors"
                          >
                            <TrashIcon class="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-8">
                <div
                  class="border border-gray-200 rounded-lg py-6 px-4 shadow-sm bg-gray-50/30"
                >
                  <h4
                    class="text-lg font-semibold text-gray-800 mb-6 pb-3 border-gray-200"
                  >
                    Payment Detail
                  </h4>
                  <div class="space-y-5">
                    <div class="space-y-2">
                      <label
                        for="vat-inclusion"
                        class="text-sm font-medium text-gray-700"
                        >VAT Inclusion
                        <span
                          :class="errors?.vat_inclusion ? 'text-red-500' : ''"
                          >*</span
                        ></label
                      >
                      <v-select
                        v-model="formData.vat_inclusion"
                        class="style-chooser bg-gray-100 border-0"
                        :options="vat_inclusion_array ?? []"
                        :class="
                          errors?.vat_inclusion ? 'border border-red-500' : ''
                        "
                        label="name"
                        :clearable="false"
                        :reduce="(h) => h.name"
                        placeholder="Select VAT inclusion"
                      ></v-select>
                      <p
                        v-if="errors?.vat_inclusion"
                        class="mt-1 text-sm text-red-500"
                      >
                        {{ errors.vat_inclusion[0] }}
                      </p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <label
                          for="vat-id"
                          class="text-sm font-medium text-gray-700"
                          >VAT ID</label
                        >
                        <input
                          type="text"
                          v-model="formData.vat_id"
                          id="vat-id"
                          class="w-full h-10 text-sm px-4 py-2 text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
                        />
                      </div>

                      <div class="space-y-2">
                        <label
                          for="vat-name"
                          class="text-sm font-medium text-gray-700"
                          >VAT Name</label
                        >
                        <input
                          type="text"
                          v-model="formData.vat_name"
                          id="vat-name"
                          class="w-full h-10 text-sm px-4 py-2 text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div class="space-y-2">
                      <label
                        for="vat-address"
                        class="text-sm font-medium text-gray-700"
                        >VAT Address</label
                      >
                      <textarea
                        v-model="formData.vat_address"
                        id="vat-address"
                        rows="2"
                        class="w-full text-sm px-4 py-2 text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
                      ></textarea>
                    </div>

                    <div class="space-y-2">
                      <label
                        for="bank-account-name"
                        class="text-sm font-medium text-gray-700"
                        >Bank Account Name</label
                      >
                      <input
                        type="text"
                        v-model="formData.account_name"
                        id="bank-account-name"
                        class="w-full h-10 text-sm px-4 py-2 text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
                      />
                    </div>

                    <div class="space-y-2">
                      <label
                        for="bank-name"
                        class="text-sm font-medium text-gray-700"
                        >Bank Name</label
                      >
                      <v-select
                        v-model="formData.bank_name"
                        class="style-chooser bg-gray-100"
                        :options="bankName ?? []"
                        label="name"
                        :clearable="false"
                        :reduce="(bank) => bank.name"
                        placeholder="Choose Bank"
                      ></v-select>
                    </div>

                    <div class="space-y-2">
                      <label
                        for="bank-acc-number"
                        class="text-sm font-medium text-gray-700"
                        >Bank Account Number</label
                      >
                      <input
                        type="text"
                        v-model="formData.bank_account_number"
                        id="bank-acc-number"
                        class="w-full h-10 text-sm px-4 py-2 text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
                      />
                    </div>

                    <div class="space-y-2">
                      <label
                        for="payment-method"
                        class="text-sm font-medium text-gray-700"
                        >Payment Method</label
                      >
                      <v-select
                        v-model="formData.payment_method"
                        class="style-chooser bg-gray-100"
                        :options="paymentMethod ?? []"
                        label="name"
                        :clearable="false"
                        :reduce="(payment) => payment.name"
                        placeholder="Choose Payment Method"
                      ></v-select>
                    </div>
                  </div>
                </div>

                <div
                  class="border border-gray-200 rounded-lg py-6 px-4 shadow-sm bg-gray-50/30"
                >
                  <div
                    class="flex justify-between items-center mb-6 pb-3 border-gray-200"
                  >
                    <h4 class="text-lg font-semibold text-gray-800">
                      Contracts
                    </h4>
                    <input
                      type="file"
                      ref="contractInput"
                      multiple
                      @change="handleContractFileChange"
                      class="hidden"
                    />
                    <button
                      type="button"
                      @click="openContractFilePicker"
                      class="h-8 px-3 font-medium rounded-md shadow-sm text-[11px] transition-colors flex items-center gap-1"
                      :class="[
                        errors?.contracts
                          ? 'border border-red-500 bg-white text-red-600 hover:bg-red-50'
                          : 'bg-[#ff613c] text-white hover:bg-[#e05530]',
                      ]"
                    >
                      <PlusCircleIcon class="w-4 h-4" />
                      <p v-if="errors?.contracts">Files needed</p>
                      <p v-else>Add Files</p>
                    </button>
                  </div>
                  <div class="flex justify-between items-center">
                    <div class="mb-2 space-y-1">
                      <label for="name" class="text-sm text-gray-800"
                        >Contract Due Date</label
                      >
                      <input
                        v-model="formData.contract_due"
                        type="date"
                        class="w-full h-10 px-4 py-2 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-gray-300"
                      />
                      <!-- <p>{{ formData.contract_due }}</p> -->
                    </div>
                    <div class="mb-2 space-y-1">
                      <label for="name" class="text-sm text-gray-800"
                        >Data Checked</label
                      >
                      <div class="text-end">
                        <input
                          type="checkbox"
                          v-model="formData.data_checked"
                          class="w-8 h-8 px-4 py-2 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-gray-300"
                        />
                      </div>
                      <!-- <p>{{ formData.contract_due }}</p> -->
                    </div>
                  </div>
                  <div class="space-y-4">
                    <div
                      v-if="
                        linkContract.contacts &&
                        linkContract.contacts.length > 0
                      "
                      class="space-y-2"
                    >
                      <p class="text-sm font-medium text-gray-700">
                        Existing Contracts:
                      </p>
                      <div
                        v-for="(contract, index) in linkContract.contacts"
                        :key="index"
                        class="flex items-center gap-2"
                      >
                        <a
                          :href="contract.file"
                          target="_blank"
                          class="flex-1 text-sm hover:underline bg-gray-100 px-3 py-2 rounded truncate"
                        >
                          contract link {{ index + 1 }}
                        </a>
                        <button
                          type="button"
                          @click.prevent="removeLinkContract(contract.id)"
                          class="h-10 w-10 flex items-center justify-center bg-[#ff613c] text-white text-sm font-medium rounded-md hover:bg-[#e05530] transition-colors"
                        >
                          <TrashIcon class="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div
                      v-if="formData.contract_files_preview.length > 0"
                      class="space-y-2 mt-4"
                    >
                      <p class="text-sm font-medium text-gray-700">
                        New Contracts to Upload:
                      </p>
                      <div
                        v-for="(
                          contract, index
                        ) in formData.contract_files_preview"
                        :key="'new-' + index"
                        class="flex items-center gap-2"
                      >
                        <div
                          class="flex-1 text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded truncate"
                        >
                          <div class="font-medium">{{ contract.name }}</div>
                          <div class="text-xs text-gray-500">
                            {{ contract.size }} • {{ contract.type }}
                          </div>
                        </div>
                        <button
                          type="button"
                          @click.prevent="removeContractFile(index)"
                          class="h-10 w-10 flex items-center justify-center bg-[#ff613c] text-white text-sm font-medium rounded-md hover:bg-[#e05530] transition-colors"
                        >
                          <TrashIcon class="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p class="text-xs text-gray-500">
                      You can upload multiple contract files (PDF, DOC, JPG,
                      JPEG, PNG, XLSX)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div v-if="quiteSwitch == 2" class="">
          <form
            @submit.prevent="onSubmitHandler"
            class="bg-white rounded-xl px-6 pb-6 pt-4 relative"
          >
            <button
              type="submit"
              :disabled="loading"
              class="absolute -top-[100px] right-6 text-sm py-2 px-4 font-medium text-white bg-[#ff613c] border border-transparent rounded-lg shadow-sm hover:bg-[#e05530] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff613c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <div class="flex gap-1">
                <span>{{ loading ? "Updating..." : "Update" }}</span>
                <PlusIcon class="w-4 h-4" />
              </div>
            </button>
            <div class="grid grid-cols-2 gap-8">
              <div class="space-y-8">
                <div
                  class="border border-gray-200 rounded-lg py-6 px-4 shadow-sm bg-gray-50/30"
                >
                  <h4
                    class="text-lg font-semibold text-gray-800 mb-6 pb-3 border-gray-200"
                  >
                    Description (Myanmar)
                  </h4>
                  <div class="space-y-4">
                    <div class="space-y-2">
                      <AiDescriptionEditor
                        v-model="formData.full_description"
                        label="Full description (mm)"
                        language="mm"
                        :product-data="formData"
                        :product-type="'hotel'"
                        :show-ai-button="true"
                        placeholder="Enter Myanmar description..."
                        hint="AI can generate a professional description based on your hotel information"
                      />
                    </div>
                  </div>
                </div>

                <div
                  class="border border-gray-200 rounded-lg py-6 px-4 shadow-sm bg-gray-50/30"
                >
                  <h4
                    class="text-lg font-semibold text-gray-800 mb-6 pb-3 border-gray-200"
                  >
                    Hotel Images
                  </h4>
                  <div class="space-y-4">
                    <div class="grid grid-cols-3 gap-4">
                      <div class="col-span-1">
                        <input
                          multiple
                          type="file"
                          ref="imagesInput"
                          @change="handlerImagesFileChange"
                          class="hidden"
                          accept="image/*"
                        />
                        <div
                          @click.prevent="openFileImagePicker"
                          class="cursor-pointer h-[200px] border-2 border-dashed border-gray-400 rounded-lg flex flex-col justify-center items-center hover:border-[#ff613c] transition-colors bg-gray-100"
                        >
                          <span class="text-gray-400">
                            <PhotoIcon
                              class="w-8 h-8 mx-auto mb-2 text-[#ff613c]"
                            />
                            <span class="text-xs block text-center"
                              >Click to upload image</span
                            >
                          </span>
                        </div>
                      </div>

                      <div class="col-span-2">
                        <div class="grid grid-cols-2 gap-3 h-full">
                          <template
                            v-if="
                              imagesPreview.length > 0 ||
                              editImagesPreview.length > 0
                            "
                          >
                            <div class="relative group row-span-2">
                              <template v-if="imagesPreview[0]">
                                <button
                                  @click.prevent="removeImageSelectImage(0)"
                                  class="absolute top-2 right-2 bg-[#ff613c] text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                >
                                  <XMarkIcon class="w-4 h-4" />
                                </button>
                                <img
                                  :src="imagesPreview[0]"
                                  alt="Hotel image"
                                  class="w-full h-[200px] object-cover rounded-md"
                                />
                              </template>
                              <template v-else-if="editImagesPreview[0]">
                                <button
                                  @click.prevent="
                                    removeImageUpdateImage(
                                      formData.id,
                                      editImagesPreview[0].id,
                                    )
                                  "
                                  class="absolute top-2 right-2 bg-[#ff613c] text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                >
                                  <XMarkIcon class="w-4 h-4" />
                                </button>
                                <img
                                  :src="editImagesPreview[0].image"
                                  alt="Hotel image"
                                  class="w-full h-[200px] object-cover rounded-md"
                                />
                              </template>
                            </div>
                            <!-- smaller images -->
                            <div class="grid grid-cols-2 gap-2">
                              <template v-for="index in 4">
                                <div
                                  v-if="
                                    imagesPreview[index] ||
                                    editImagesPreview[index]
                                  "
                                  :key="`image-${index}`"
                                  class="relative group"
                                >
                                  <template v-if="imagesPreview[index]">
                                    <button
                                      @click.prevent="
                                        removeImageSelectImage(index)
                                      "
                                      class="absolute top-1 right-1 bg-[#ff613c] text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    >
                                      <XMarkIcon class="w-3 h-3" />
                                    </button>
                                    <img
                                      :src="imagesPreview[index]"
                                      alt="Hotel image"
                                      class="w-full h-[94px] object-cover rounded-md"
                                    />
                                    <div
                                      v-if="index === 4"
                                      class="absolute inset-0 bg-black/40 rounded-md flex flex-col items-center justify-center cursor-pointer"
                                      @click="openImageGallery"
                                    >
                                      <span class="text-white font-bold text-lg"
                                        >+{{ getRemainingImageCount() }}</span
                                      >
                                      <span class="text-white text-xs"
                                        >More</span
                                      >
                                    </div>
                                  </template>
                                  <template
                                    v-else-if="editImagesPreview[index]"
                                  >
                                    <button
                                      @click.prevent="
                                        removeImageUpdateImage(
                                          formData.id,
                                          editImagesPreview[index].id,
                                        )
                                      "
                                      class="absolute top-1 right-1 bg-[#ff613c] text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    >
                                      <XMarkIcon class="w-3 h-3" />
                                    </button>
                                    <img
                                      :src="editImagesPreview[index].image"
                                      alt="Hotel image"
                                      class="w-full h-[94px] object-cover rounded-md"
                                    />
                                    <div
                                      v-if="index === 4"
                                      @click="openImageGallery"
                                      class="absolute inset-0 bg-black/40 rounded-md flex flex-col items-center justify-center cursor-pointer"
                                    >
                                      <span class="text-white font-bold text-lg"
                                        >+{{ getRemainingImageCount() }}</span
                                      >
                                      <span class="text-white text-xs"
                                        >More</span
                                      >
                                    </div>
                                  </template>
                                </div>
                                <div
                                  v-else
                                  :key="`empty-${index}`"
                                  class="w-full h-[94px] bg-gray-100 rounded-md flex items-center justify-center"
                                >
                                  <span class="text-xs text-gray-400"
                                    >No image</span
                                  >
                                </div>
                              </template>
                            </div>
                          </template>

                          <template v-else>
                            <div
                              class="row-span-2 bg-gray-100 rounded-md flex items-center justify-center"
                            >
                              <span class="text-gray-400 text-sm"
                                >No images</span
                              >
                            </div>
                            <div class="grid grid-cols-2 gap-2">
                              <div
                                v-for="i in 4"
                                :key="i"
                                class="bg-gray-100 rounded-md h-[94px] flex items-center justify-center"
                              >
                                <span class="text-xs text-gray-400"
                                  >No image</span
                                >
                              </div>
                            </div>
                          </template>
                        </div>
                      </div>
                    </div>

                    <div class="pt-4 flex justify-between items-center">
                      <div class="flex items-center gap-2">
                        <button
                          type="button"
                          @click.prevent="openFileImagePicker"
                          class="h-8 px-3 bg-[#ff613c] text-white text-xs font-medium rounded-md hover:bg-[#e05530] transition-colors flex items-center gap-1"
                        >
                          <PlusCircleIcon class="w-4 h-4" />
                          Add Images
                        </button>
                        <button
                          type="button"
                          @click="openImageGallery"
                          class="h-8 px-3 bg-white text-gray-700 text-xs font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-1"
                        >
                          <EyeIcon class="w-4 h-4" />
                          View All Images
                        </button>
                      </div>
                      <p class="text-sm text-gray-600">
                        Total
                        {{ editImagesPreview.length + imagesPreview.length }}
                        images
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-8">
                <div
                  class="border border-gray-200 rounded-lg py-6 px-4 shadow-sm bg-gray-50/30"
                >
                  <h4
                    class="text-lg font-semibold text-gray-800 mb-6 pb-3 border-gray-200"
                  >
                    Description (English)
                  </h4>
                  <div class="space-y-4">
                    <div class="space-y-2">
                      <AiDescriptionEditor
                        v-model="formData.full_description_en"
                        label="Full description (en)"
                        language="en"
                        :product-data="formData"
                        :product-type="'hotel'"
                        :show-ai-button="true"
                        placeholder="Enter English description..."
                        hint="AI can generate a professional description based on your hotel information"
                      />
                    </div>
                  </div>
                </div>

                <div
                  class="border border-gray-200 rounded-lg py-6 px-4 shadow-sm bg-gray-50/30"
                >
                  <h4
                    class="text-lg font-semibold text-gray-800 mb-6 pb-3 border-gray-200"
                  >
                    Additional Detail
                  </h4>
                  <div class="space-y-6">
                    <div class="grid grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <label
                          for="check-in"
                          class="text-sm font-medium text-gray-700"
                          >Check In Time</label
                        >
                        <input
                          type="text"
                          v-model="formData.check_in"
                          id="check-in"
                          placeholder="e.g., 14:00"
                          class="w-full h-10 text-sm px-4 py-2 text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
                        />
                      </div>

                      <div class="space-y-2">
                        <label
                          for="check-out"
                          class="text-sm font-medium text-gray-700"
                          >Check Out Time</label
                        >
                        <input
                          type="text"
                          v-model="formData.check_out"
                          id="check-out"
                          placeholder="e.g., 12:00"
                          class="w-full h-10 text-sm px-4 py-2 text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div class="space-y-2">
                      <label
                        for="cancellation-policy"
                        class="text-sm font-medium text-gray-700"
                        >Cancellation Policy</label
                      >
                      <textarea
                        v-model="formData.cancellation_policy"
                        id="cancellation-policy"
                        rows="4"
                        placeholder="Enter cancellation policy details..."
                        class="w-full text-sm px-4 py-2 text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
                      ></textarea>
                    </div>
                    <div class="space-y-2">
                      <label
                        for="child-policy"
                        class="text-sm font-medium text-gray-700"
                        >child Policy</label
                      >
                      <textarea
                        v-model="formData.child_policy"
                        id="child-policy"
                        rows="4"
                        placeholder="Enter child policy details..."
                        class="w-full text-sm px-4 py-2 text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
                      ></textarea>
                    </div>

                    <div class="space-y-2">
                      <label class="text-sm font-medium text-gray-700"
                        >Official Logo</label
                      >
                      <input
                        type="file"
                        id="official-logo"
                        ref="official_logo_input"
                        class="hidden"
                        @change="handlerOfficialLogoFileChange"
                        accept="image/*"
                      />
                      <div class="flex items-center gap-4">
                        <div
                          @click.prevent="openOfficialLogoImagePicker"
                          class="cursor-pointer w-40 h-40 border-2 border-dashed border-gray-400 rounded-lg flex flex-col justify-center items-center hover:border-[#ff613c] transition-colors bg-gray-100"
                        >
                          <span
                            v-if="
                              !official_logo_preview &&
                              !formData.official_logo_has
                            "
                            class="text-gray-400"
                          >
                            <PhotoIcon
                              class="w-8 h-8 mx-auto mb-2 text-[#ff613c]"
                            />
                            <span class="text-xs">Upload Logo</span>
                          </span>
                          <div
                            v-if="official_logo_preview"
                            class="relative w-full h-full"
                          >
                            <img
                              :src="official_logo_preview"
                              alt="Official logo preview"
                              class="w-full h-full object-contain p-2"
                            />
                            <button
                              type="button"
                              @click.prevent="openOfficialLogoImagePicker"
                              class="absolute top-2 right-2 bg-[#ff613c] text-white text-xs px-2 py-1 rounded hover:bg-[#e05530]"
                            >
                              Change
                            </button>
                          </div>
                          <div
                            v-if="
                              formData.official_logo_has &&
                              !official_logo_preview
                            "
                            class="relative w-full h-full"
                          >
                            <img
                              :src="formData.official_logo_has"
                              alt="Official logo"
                              class="w-full h-full object-contain p-2"
                            />
                            <button
                              type="button"
                              @click.prevent="openOfficialLogoImagePicker"
                              class="absolute top-2 right-2 bg-[#ff613c] text-white text-xs px-2 py-1 rounded hover:bg-[#e05530]"
                            >
                              Change
                            </button>
                          </div>
                        </div>
                        <div>
                          <p class="text-sm text-gray-600">
                            Upload official hotel logo
                          </p>
                          <p class="text-xs text-gray-500">
                            Recommended size: 200x200px
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div v-if="quiteSwitch == 3" class="">
          <form
            @submit.prevent="onSubmitHandler"
            class="bg-white rounded-xl px-6 pb-6 pt-4 relative"
          >
            <button
              type="submit"
              :disabled="loading"
              class="absolute -top-[100px] right-6 text-sm py-2 px-4 font-medium text-white bg-[#ff613c] border border-transparent rounded-lg shadow-sm hover:bg-[#e05530] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff613c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <div class="flex gap-1">
                <span>{{ loading ? "Updating..." : "Update" }}</span>
                <PlusIcon class="w-4 h-4" />
              </div>
            </button>

            <div
              class="border border-gray-200 rounded-lg py-6 px-4 shadow-sm bg-gray-50/30"
            >
              <FacilitoryStoreVue
                @Change="onGetArray"
                :data="formData.facilities"
                :hotelData="formData"
              />

              <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                <p class="text-sm text-blue-700">
                  <span class="font-medium">Selected facilities:</span>
                  {{ formData.facilities.length }}
                </p>
                <p class="text-xs text-blue-600 mt-1">
                  The selected facilities will be saved when you create the
                  hotel.
                </p>
              </div>
            </div>
          </form>
        </div>

        <div v-if="quiteSwitch == 4" class="">
          <form
            @submit.prevent="onSubmitHandler"
            class="bg-white rounded-xl px-6 pb-6 pt-4 relative"
          >
            <button
              type="submit"
              :disabled="loading"
              class="absolute -top-20 right-6 text-xs p-1.5 px-5 font-medium text-white bg-[#ff613c] border border-transparent rounded-lg shadow-sm hover:bg-[#e05530] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff613c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ loading ? "Updating..." : "Update" }}
            </button>
            <div class="grid grid-cols-2 gap-8">
              <div class="space-y-8">
                <div
                  class="border border-gray-200 rounded-lg py-6 px-4 shadow-sm bg-gray-50/30"
                >
                  <h4
                    class="text-lg font-semibold text-gray-800 mb-6 pb-3 border-gray-200"
                  >
                    Location Details
                  </h4>
                  <div class="space-y-5">
                    <div class="space-y-2">
                      <label
                        for="location-map-title"
                        class="text-sm font-medium text-gray-700"
                        >Location Map Title (Address)</label
                      >
                      <input
                        type="text"
                        v-model="formData.location_map_title"
                        id="location-map-title"
                        placeholder="Enter hotel address"
                        class="w-full h-10 text-sm px-4 py-2 text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
                      />
                    </div>

                    <div class="space-y-2">
                      <label
                        for="location-map"
                        class="text-sm font-medium text-gray-700"
                        >Location Link</label
                      >
                      <input
                        type="text"
                        v-model="formData.location_map"
                        id="location-map"
                        placeholder="Paste hotel location map link"
                        class="w-full h-10 text-sm px-4 py-2 text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
                      />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <label
                          for="latitude"
                          class="text-sm font-medium text-gray-700"
                          >Latitude</label
                        >
                        <input
                          type="text"
                          v-model="formData.latitude"
                          id="latitude"
                          class="w-full h-10 text-sm px-4 py-2 text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
                        />
                      </div>

                      <div class="space-y-2">
                        <label
                          for="longitude"
                          class="text-sm font-medium text-gray-700"
                          >Longitude</label
                        >
                        <input
                          type="text"
                          v-model="formData.longitude"
                          id="longitude"
                          class="w-full h-10 text-sm px-4 py-2 text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div class="space-y-2">
                      <label class="text-sm font-medium text-gray-700"
                        >Rating</label
                      >
                      <div class="flex justify-start items-center gap-2">
                        <div
                          v-for="i in 5"
                          :key="i"
                          class="flex justify-center cursor-pointer items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md"
                          :class="
                            i == formData.rating
                              ? 'bg-[#ff613c] text-white'
                              : 'bg-gray-100 hover:bg-gray-200'
                          "
                          @click="formData.rating = i"
                        >
                          <p class="text-sm">{{ i }}</p>
                          <StarIcon
                            class="w-4 h-4"
                            :class="
                              i == formData.rating
                                ? 'text-white'
                                : 'text-[#ff613c]'
                            "
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="border border-gray-200 rounded-lg py-6 px-4 shadow-sm bg-gray-50/30"
                >
                  <h4
                    class="text-lg font-semibold text-gray-800 mb-6 pb-3 border-gray-200"
                  >
                    YouTube Links
                  </h4>
                  <div class="space-y-5">
                    <div class="space-y-2">
                      <label
                        for="youtube-mm"
                        class="text-sm font-medium text-gray-700"
                        >YouTube Link (Myanmar)</label
                      >
                      <input
                        type="text"
                        v-model="formData.youtube_link.mm_link"
                        id="youtube-mm"
                        placeholder="Enter YouTube video code (e.g., 8E7X00VVApo)"
                        class="w-full h-10 text-sm px-4 py-2 text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
                      />
                    </div>

                    <div class="space-y-2">
                      <label
                        for="youtube-en"
                        class="text-sm font-medium text-gray-700"
                        >YouTube Link (English)</label
                      >
                      <input
                        type="text"
                        v-model="formData.youtube_link.en_link"
                        id="youtube-en"
                        placeholder="Enter YouTube video code (e.g., 8E7X00VVApo)"
                        class="w-full h-10 text-sm px-4 py-2 text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
                      />
                    </div>

                    <div class="p-3 bg-gray-100 rounded-md">
                      <p class="text-xs text-gray-600">
                        <span class="font-medium">Note:</span> Use only the code
                        after v= in YouTube URL. For example, from
                        https://www.youtube.com/watch?v=
                        <span class="font-semibold text-blue-600"
                          >8E7X00VVApo</span
                        >, use <span class="font-semibold">8E7X00VVApo</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-8">
                <div
                  class="border border-gray-200 rounded-lg py-6 px-4 shadow-sm bg-gray-50/30"
                >
                  <h4
                    class="text-lg font-semibold text-gray-800 mb-6 pb-3 border-gray-200"
                  >
                    Location Map Preview
                  </h4>
                  <div class="space-y-5">
                    <div
                      v-if="
                        formData.location_map &&
                        formData.location_map !== 'null'
                      "
                      class="mt-6"
                    >
                      <iframe
                        :src="formData.location_map"
                        class="w-full h-[500px] rounded-lg border-0"
                        allowfullscreen=""
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div v-if="quiteSwitch == 5" class="">
          <AddonPage :id="formData.id" :type="'hotel'" />
        </div>

        <div v-if="quiteSwitch == 6" class="">
          <form
            @submit.prevent="onSubmitHandler"
            class="bg-white rounded-xl px-6 pb-6 pt-4"
          >
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-bold text-gray-800">
                VAT & Confirmation Details
              </h3>
              <button
                type="button"
                @click="showConfirmation = true"
                class="px-4 py-2 text-sm font-medium text-white bg-[#ff613c] rounded-lg hover:bg-[#e05530] transition-colors flex items-center gap-2"
              >
                <DocumentIcon class="w-4 h-4" />
                Generate Confirmation PNG (DEMO)
              </button>
            </div>
            <div class="grid grid-cols-2 gap-8">
              <div class="space-y-8">
                <div
                  class="border border-gray-200 rounded-lg py-6 px-4 shadow-sm bg-gray-50/30"
                >
                  <h4
                    class="text-lg font-semibold text-gray-800 mb-6 pb-3 border-gray-200"
                  >
                    Hotel Information
                  </h4>
                  <div class="space-y-5">
                    <div class="space-y-2">
                      <label
                        for="official-address"
                        class="text-sm font-medium text-gray-700"
                        >Official Address</label
                      >
                      <textarea
                        v-model="formData.official_address"
                        id="official-address"
                        rows="3"
                        class="w-full text-sm px-4 py-2 text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
                      ></textarea>
                    </div>

                    <div class="space-y-2">
                      <label
                        for="official-remark"
                        class="text-sm font-medium text-gray-700"
                        >Official Remark</label
                      >
                      <textarea
                        v-model="formData.official_remark"
                        id="official-remark"
                        rows="3"
                        class="w-full text-sm px-4 py-2 text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-end mt-8">
              <button
                type="submit"
                :disabled="loading"
                class="absolute -top-[100px] right-6 text-sm py-2 px-4 font-medium text-white bg-[#ff613c] border border-transparent rounded-lg shadow-sm hover:bg-[#e05530] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff613c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <div class="flex gap-1">
                  <span>{{ loading ? "Updating..." : "Update" }}</span>
                  <PlusIcon class="w-4 h-4" />
                </div>
              </button>
            </div>
          </form>
        </div>

        <div v-if="quiteSwitch == 7" class="">
          <AddSlugPage
            :id="formData.id"
            :type="'hotel'"
            :slugs="formData.slug"
          />
        </div>

        <div v-if="quiteSwitch == 8" class="">
          <GoodToKnow
            :id="formData.id"
            :type="'hotel'"
            :productData="formData"
          />
        </div>

        <div v-if="quiteSwitch == 9" class="">
          <KeyHighLight
            :id="formData.id"
            :type="'hotel'"
            :highlightData="formData"
          />
        </div>

        <div v-if="quiteSwitch == 10" class="">
          <NearByPlace
            :id="formData.id"
            :type="'hotel'"
            :placeData="formData"
          />
        </div>

        <div v-if="quiteSwitch == 11" class="">
          <RoomTypeEditPage :id="formData.id" />
        </div>
      </div>
    </div>

    <!-- <div v-if="isAiMood"> -->
    <!-- <DataComparisonModal
        :isOpen="showComparisonModal"
        :extractedData="extractedData"
        :currentData="formData"
        :originalFile="uploadedFile"
        @close="closeComparisonModal"
        @applyChanges="handleApplyChanges"
      />

      <ContractSaveConfirmModal
        :isOpen="showContractSaveModal"
        :file="uploadedFile"
        @yes="saveWithContract"
        @no="saveWithoutContract"
      />
      <RoomPeriodImportModal
        :isOpen="showRoomPeriodModal"
        :hotelId="formData.id"
        :extractedRooms="extractedData.rooms || []"
        @close="showRoomPeriodModal = false"
        @complete="handleRoomPeriodImport"
        @import="handleRoomPeriodImport"
      /> -->
    <!-- </div> -->

    <Dialog
      :open="imageGalleryModal"
      @close="closeImageGallery"
      class="relative z-50"
    >
      <div class="fixed inset-0 bg-black/70" aria-hidden="true" />
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            class="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div class="bg-white border-b border-gray-200 px-8 py-6">
              <div class="flex items-center justify-between">
                <DialogTitle class="text-2xl font-bold text-gray-800">
                  Hotel Images Gallery
                </DialogTitle>
                <button
                  @click="closeImageGallery"
                  class="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon class="w-6 h-6" />
                </button>
              </div>
              <p class="text-gray-600 mt-2">
                Manage your hotel images. You can upload new images or delete
                existing ones.
              </p>
            </div>

            <div class="p-8">
              <div class="mb-8">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">
                  All Images ({{
                    editImagesPreview.length + imagesPreview.length
                  }}
                  total)
                </h3>

                <div class="grid grid-cols-3 gap-3">
                  <div
                    v-for="(image, index) in editImagesPreview"
                    :key="`edit-${index}`"
                    class="relative group"
                  >
                    <div
                      class="aspect-video rounded-lg overflow-hidden bg-gray-100"
                    >
                      <img
                        :src="image.image"
                        :alt="`Hotel image ${index + 1}`"
                        class="w-full h-32 object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <button
                      @click="removeImageInGallery(index, true)"
                      class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      <XMarkIcon class="w-4 h-4" />
                    </button>
                  </div>

                  <div
                    v-for="(image, index) in imagesPreview"
                    :key="`new-${index}`"
                    class="relative group"
                  >
                    <div
                      class="aspect-video rounded-lg overflow-hidden bg-gray-100"
                    >
                      <img
                        :src="image"
                        :alt="`New image ${index + 1}`"
                        class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <button
                      @click="
                        removeImageInGallery(
                          editImagesPreview.length + index,
                          false,
                        )
                      "
                      class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      <XMarkIcon class="w-4 h-4" />
                    </button>
                  </div>
                  <div class="">
                    <input
                      type="file"
                      ref="galleryUploadInput"
                      multiple
                      @change="handleGalleryImageChange"
                      class="hidden"
                      accept="image/*"
                    />
                    <div
                      @click="galleryUploadInput?.click()"
                      class="w-full border-2 border-dashed border-gray-400 rounded-xl p-6 hover:border-[#ff613c] transition-colors bg-gray-50 flex text-center flex-col items-center justify-center cursor-pointer"
                    >
                      <PlusCircleIcon class="w-10 h-10 text-[#ff613c] mb-3" />
                      <p class="text-base font-medium text-gray-700 mb-2">
                        Upload More Images
                      </p>
                      <p class="text-sm text-gray-500">
                        Click here or drag and drop to add more images
                      </p>
                      <p class="text-xs text-gray-400 mt-2">
                        Supports JPG, PNG, GIF • Max 10MB per image
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>

    <Modal :isOpen="showConfirmation" @closeModal="showConfirmation = false">
      <DialogPanel
        class="w-full max-w-6xl transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
        >
          <span class="">Hotel Confirmation DEMO</span>
          <XMarkIcon
            class="w-6 h-6 text-black cursor-pointer"
            @click="showConfirmation = false"
          />
        </DialogTitle>
        <div>
          <HotelConfrimationDemo :data="formData" />
        </div>
      </DialogPanel>
    </Modal>

    <UploadContractModal
      :isOpen="showUploadModal"
      :hotelData="formData"
      @close="showUploadModal = false"
      @dataExtracted="handleDataExtracted"
    />
  </Layout>
</template>

<style scoped>
.style-chooser {
  @apply text-sm border-none;
}

.style-chooser .vs__dropdown-toggle {
  @apply bg-gray-100 border-none rounded-md h-10 min-h-10;
}

.style-chooser .vs__selected {
  @apply text-sm bg-transparent;
}

.style-chooser .vs__search {
  @apply text-sm bg-transparent;
}

.style-chooser .vs__dropdown-menu {
  @apply text-sm;
}

.style-chooser-type {
  @apply text-sm w-48;
}

.style-chooser-type .vs__dropdown-toggle {
  @apply bg-[#ff613c] text-white border-none rounded-md h-10 min-h-10;
}

.style-chooser-type .vs__selected {
  @apply text-sm text-white;
}

.style-chooser-type .vs__search {
  @apply text-sm text-white placeholder:text-white/70;
}

.style-chooser-type .vs__dropdown-menu {
  @apply text-sm bg-white;
}

.ql-toolbar {
  @apply border-none !important;
  @apply bg-gray-100 !important;
}

.ql-container {
  @apply border-none !important;
  @apply bg-gray-100 !important;
}

.bg-gray-50\/30 {
  background-color: rgba(249, 250, 251, 0.3);
}

input:focus,
textarea:focus,
select:focus {
  @apply ring-2 ring-[#ff613c] ring-opacity-50;
}
</style>
