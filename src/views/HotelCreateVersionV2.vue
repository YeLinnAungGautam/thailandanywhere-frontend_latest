<script setup>
import Layout from "./Layout.vue";
import {
  PlusIcon,
  TrashIcon,
  PlusCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  PhotoIcon,
} from "@heroicons/vue/24/outline";
import { QuillEditor } from "@vueup/vue-quill";
import { onMounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useCityStore } from "../stores/city";
import { useHotelStore } from "../stores/hotel";
import { useHotelCategoryStore } from "../stores/hotelcategory";
import { usePlaceStore } from "../stores/place";

const toast = useToast();
const cityStore = useCityStore();
const hotelStore = useHotelStore();
const router = useRouter();
const hotelCategoryStore = useHotelCategoryStore();
const placeStore = usePlaceStore();

const { places } = storeToRefs(placeStore);
const { hcategories } = storeToRefs(hotelCategoryStore);
const { loading } = storeToRefs(hotelStore);

const errors = ref({});
const validationErrors = ref({});

const editorOptions = {
  placeholder: "Description with editor ...",
};

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

const paymentMethod = [
  { id: "1", name: "Bank Transfer" },
  { id: "2", name: "International Remittance" },
  { id: "3", name: "Cash" },
  { id: "4", name: "Other ..." },
];

const { cities } = storeToRefs(cityStore);
const citylist = ref([]);

const typeList = ref([
  { id: 1, name: "Direct Booking", value: "direct_booking" },
  { id: 2, name: "Other Booking", value: "other_booking" },
]);

const vat_inclusion_array = [
  { id: 1, name: "Inclusive of VAT" },
  { id: 2, name: "No VAT" },
];

const formData = ref({
  name: "",
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
  official_address: "",
  vat_id: "",
  vat_name: "",
  vat_address: "",
  official_phone_number: "",
  official_email: "",
  official_remark: "",
  official_logo: "",
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
  contracts: [],
  contract_files_preview: [],
  images: [],
  facilities: [],
  youtube_link: {
    mm_link: "",
    en_link: "",
  },
});

const addEmail = ref("");

const addEmailAction = () => {
  if (addEmail.value.trim()) {
    formData.value.email.push(addEmail.value.trim());
    addEmail.value = "";
  }
};

const removeEmail = (index) => {
  formData.value.email.splice(index, 1);
};

const imagesPreview = ref([]);
const imagesInput = ref(null);
const official_logo_preview = ref(null);
const official_logo_input = ref(null);
const contractInput = ref(null);

const openOfficialLogoImagePicker = () => {
  official_logo_input.value.click();
};

const handlerOfficialLogoFileChange = (e) => {
  let selectedFile = e.target.files[0];
  if (selectedFile) {
    formData.value.official_logo = selectedFile;
    official_logo_preview.value = URL.createObjectURL(selectedFile);
  }
};

const openFileImagePicker = () => {
  imagesInput.value.click();
};

const handlerImagesFileChange = (e) => {
  let selectedFiles = e.target.files;
  if (selectedFiles) {
    for (let index = 0; index < selectedFiles.length; index++) {
      formData.value.images.push(selectedFiles[index]);
      imagesPreview.value.push(URL.createObjectURL(selectedFiles[index]));
    }
  }
};

const removeImageSelectImage = (index) => {
  formData.value.images.splice(index, 1);
  imagesPreview.value.splice(index, 1);
};

const openContractFilePicker = () => {
  contractInput.value.click();
};

const handlePlaceChange = (placeId) => {
  if (placeId && places.value?.data) {
    const selectedPlace = places.value.data.find((p) => p.id === placeId);
    if (selectedPlace) {
      formData.value.place = selectedPlace.name;
    }
  }
  console.log(formData.value.place);
};

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
  // Clear validation error when files are added
  if (formData.value.contracts.length > 0) {
    delete validationErrors.value.contracts;
  }
};

const removeContractFile = (index) => {
  if (formData.value.contracts[index]) {
    if (formData.value.contract_files_preview[index]?.url) {
      URL.revokeObjectURL(formData.value.contract_files_preview[index].url);
    }
    formData.value.contracts.splice(index, 1);
    formData.value.contract_files_preview.splice(index, 1);
  }
};

const validateForm = () => {
  validationErrors.value = {};

  // Required field validations
  if (!formData.value.name || formData.value.name.trim() === "") {
    validationErrors.value.name = "Hotel name is required";
  }

  if (!formData.value.city_id) {
    validationErrors.value.city_id = "City is required";
  }

  if (!formData.value.place_id) {
    validationErrors.value.place_id = "Place is required";
  }

  if (!formData.value.vat_inclusion || formData.value.vat_inclusion === "") {
    validationErrors.value.vat_inclusion = "VAT inclusion is required";
  }

  if (!formData.value.type || formData.value.type === "") {
    validationErrors.value.type = "Booking type is required";
  }

  if (!formData.value.contracts || formData.value.contracts.length === 0) {
    validationErrors.value.contracts = "At least one contract file is required";
  }

  return Object.keys(validationErrors.value).length === 0;
};

const addNewHandler = async () => {
  // Validate form before submission
  if (!validateForm()) {
    toast.error("Please fill in all required fields", {
      maxToasts: 1,
    });
    // Scroll to first error
    const firstErrorElement = document.querySelector(".border-red-500");
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("city_id", formData.value.city_id);

  if (formData.value.place_id != null) {
    frmData.append("place_id", formData.value.place_id);
  }
  if (formData.value.place && formData.value.place.trim() !== "") {
    frmData.append("place", formData.value.place);
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

  if (formData.value.images.length > 0) {
    for (let i = 0; i < formData.value.images.length; i++) {
      let file = formData.value.images[i];
      frmData.append("images[" + i + "]", file);
    }
  }

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

  if (formData.value.email.length > 0) {
    for (let i = 0; i < formData.value.email.length; i++) {
      frmData.append("email[" + i + "]", formData.value.email[i]);
    }
  }

  if (formData.value.facilities.length > 0) {
    for (let f = 0; f < formData.value.facilities.length; f++) {
      frmData.append("facilities[" + f + "]", formData.value.facilities[f]);
    }
  }

  // Append contract files
  if (formData.value.contracts.length > 0) {
    for (let i = 0; i < formData.value.contracts.length; i++) {
      let file = formData.value.contracts[i];
      frmData.append("contracts[" + i + "]", file);
    }
  }

  try {
    const response = await hotelStore.addNewAction(frmData);
    toast.success(response.message);
    let id = response.result.id;
    router.push("/products-v2/hotel/edit/" + id);
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

const cancelButtonAction = () => {
  router.push("/products/2");
};

const cityAction = ref(false);
const placeAction = ref(false);
const categoryAction = ref(false);

const activeTab = ref(1);

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

watch(
  () => formData.value.city_id,
  (newCityId) => {
    if (newCityId) {
      placeAction.value = true;
    }
  },
);

// Clear validation errors when fields are updated
watch(
  () => formData.value.name,
  () => {
    if (formData.value.name && formData.value.name.trim() !== "") {
      delete validationErrors.value.name;
    }
  },
);

watch(
  () => formData.value.city_id,
  () => {
    if (formData.value.city_id) {
      delete validationErrors.value.city_id;
    }
  },
);

watch(
  () => formData.value.place_id,
  () => {
    if (formData.value.place_id) {
      delete validationErrors.value.place_id;
    }
  },
);

watch(
  () => formData.value.vat_inclusion,
  () => {
    if (formData.value.vat_inclusion) {
      delete validationErrors.value.vat_inclusion;
    }
  },
);

watch(
  () => formData.value.type,
  () => {
    if (formData.value.type) {
      delete validationErrors.value.type;
    }
  },
);

onMounted(async () => {
  // Initialize data if needed
});
</script>

<template>
  <Layout>
            <button
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
      </button>
    <div class="h-auto col-span-2 bg-white">
      <div class="h-auto pb-4">
        <div class="py-2 px-6">
          <div class="flex gap-6 items-center mt-5">
            <h3 class="text-xl font-bold text-gray-800">Create New Hotel</h3>
            <div class="flex gap-2 items-center">
              <div class="relative">
                <v-select
                  v-model="formData.type"
                  class="style-chooser-type  bg-orange-500 rounded-lg p-0.5 w-full max-w-[170px]"
                  :class="
                    validationErrors?.type
                      ? 'border-2 border-red-500'
                      : 'border border-orange-600'
                  "
                  :style="{
                    '--vs-dropdown-bg': '#ffffff',
                    '--vs-selected-bg': '#f97316',
                    '--vs-selected-color': '#ffffff',
                    '--vs-dropdown-option-color': '#ffffff',
                    '--vs-border-color': 'transparent',
                    '--vs-border-width': '0px',
                  }"
                  :options="typeList ?? []"
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
                <p
                  v-if="validationErrors?.type"
                  class="mt-1 text-sm text-red-500"
                >
                  {{ validationErrors.type }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex justify-start items-center gap-2 mt-6">
            <p
              class="px-4 py-2 cursor-pointer text-sm rounded-lg  transition-all duration-200"
              @click="activeTab = 1"
              :class="
                activeTab == 1
                  ? 'bg-white text-[#ff613c] shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              "
            >
              General
            </p>
            <p
              class="px-4 py-2 cursor-pointer text-sm rounded-lg  transition-all duration-200"
              @click="activeTab = 2"
              :class="
                activeTab == 2
                  ? 'bg-white text-[#ff613c] shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              "
            >
              Product Description
            </p>
          </div>
        </div>

        <div v-if="activeTab == 1">
          <form @submit.prevent="addNewHandler" class="bg-white rounded-xl p-6 relative">
                <button
                type="submit"
                :disabled="loading"
                class="absolute  -top-20 right-6  text-xs p-1.5 px-4 font-medium text-white bg-[#ff613c] border border-transparent rounded-lg shadow-sm hover:bg-[#e05530] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff613c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
              <div class="flex gap-1">
                <span>{{ loading ? 'Creating...' : 'Create' }}</span>
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
                      >
                        Hotel Name <span class="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        v-model="formData.name"
                        id="hotel-name"
                        class="w-full h-10 text-sm px-4 py-2 text-gray-900 bg-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
                        :class="
                          validationErrors?.name || errors?.name
                            ? 'border-2 border-red-500'
                            : ''
                        "
                      />
                      <p
                        v-if="validationErrors?.name"
                        class="mt-1 text-sm text-red-500"
                      >
                        {{ validationErrors.name }}
                      </p>
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
                      >
                        Cities <span class="text-red-500">*</span>
                      </label>
                      <div
                        v-if="!cityAction"
                        @click="cityAction = true"
                        class="text-sm text-gray-500 hover:text-gray-600 bg-gray-100 rounded-md px-4 py-2.5 w-full flex justify-between items-center cursor-pointer"
                        :class="
                          validationErrors?.city_id || errors?.city_id
                            ? 'border-2 border-red-500'
                            : ''
                        "
                      >
                        <p>Choose city</p>
                        <ArrowDownTrayIcon class="w-4 h-4" />
                      </div>
                      <v-select
                        v-model="formData.city_id"
                        v-if="cityAction"
                        class="style-chooser bg-gray-100 border-0"
                        :options="citylist ?? []"
                        :class="
                          validationErrors?.city_id || errors?.city_id
                            ? 'border-2 border-red-500'
                            : ''
                        "
                        label="name"
                        :clearable="false"
                        :reduce="(city) => city.id"
                        placeholder="Choose City"
                        @input="
                          placeAction = false;
                          formData.place_id = null;
                        "
                      ></v-select>
                      <p
                        v-if="validationErrors?.city_id"
                        class="mt-1 text-sm text-red-500"
                      >
                        {{ validationErrors.city_id }}
                      </p>
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
                        <div>Place <span class="text-red-500">*</span></div>
                            <router-link class="text-xs text-orange-500 hover:text-orange-600 hover:underline transition-colors" to="/database/5">
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
                        :class="[
                          !formData.city_id
                            ? 'opacity-50 cursor-not-allowed'
                            : 'cursor-pointer',
                          validationErrors?.place_id || errors?.place_id
                            ? 'border-2 border-red-500'
                            : '',
                        ]"
                        :disabled="!formData.city_id"
                      >
                        <p>Choose place</p>
                        <ArrowDownTrayIcon class="w-4 h-4" />
                      </div>
                      <v-select
                        v-model="formData.place_id"
                        v-if="placeAction && formData.city_id"
                        class="style-chooser bg-gray-100 border-0"
                        :class="
                          validationErrors?.place_id || errors?.place_id
                            ? 'border-2 border-red-500'
                            : ''
                        "
                        :options="places?.data ?? []"
                        label="name"
                        :clearable="false"
                        :reduce="(place) => place.id"
                        placeholder="Choose Place"
                        :disabled="!formData.city_id"
                        @update:modelValue="handlePlaceChange"
                      ></v-select>
                      <p
                        v-if="!formData.city_id"
                        class="text-xs text-gray-500 mt-1"
                      >
                        Please select a city first
                      </p>
                      <p
                        v-if="validationErrors?.place_id"
                        class="mt-1 text-sm text-red-500"
                      >
                        {{ validationErrors.place_id }}
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
                        <p>Choose category</p>
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
                      >
                        VAT Inclusion <span class="text-red-500">*</span>
                      </label>
                      <v-select
                        v-model="formData.vat_inclusion"
                        class="style-chooser bg-gray-100 border-0"
                        :options="vat_inclusion_array ?? []"
                        :class="
                          validationErrors?.vat_inclusion ||
                          errors?.vat_inclusion
                            ? 'border-2 border-red-500'
                            : ''
                        "
                        label="name"
                        :clearable="false"
                        :reduce="(h) => h.name"
                        placeholder="Select VAT inclusion"
                      ></v-select>
                      <p
                        v-if="validationErrors?.vat_inclusion"
                        class="mt-1 text-sm text-red-500"
                      >
                        {{ validationErrors.vat_inclusion }}
                      </p>
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
                      Contracts <span class="text-red-500">*</span>
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
                        validationErrors?.contracts || errors?.contracts
                          ? 'border-2 border-red-500 bg-white text-red-600 hover:bg-red-50'
                          : 'bg-[#ff613c] text-white hover:bg-[#e05530]',
                      ]"
                    >
                        <PlusCircleIcon class="w-4 h-4" /> 
                      <p
                        v-if="validationErrors?.contracts || errors?.contracts"
                      >
                        Files needed
                      </p>
                      <p v-else>Add Contract</p>
                    </button>
                  </div>
                  <div class="space-y-4">
                    <div
                      v-if="formData.contract_files_preview.length > 0"
                      class="space-y-2"
                    >
                      <p class="text-sm font-medium text-gray-700">
                        Contract Files:
                      </p>
                      <div
                        v-for="(
                          contract, index
                        ) in formData.contract_files_preview"
                        :key="index"
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

                    <div
                      v-if="validationErrors?.contracts"
                      class="text-sm text-red-500 bg-red-50 px-3 py-2 rounded"
                    >
                      {{ validationErrors.contracts }}
                    </div>

                    <div
                      v-if="errors?.contracts"
                      class="text-sm text-red-500 bg-red-50 px-3 py-2 rounded"
                    >
                      {{ errors.contracts[0] }}
                    </div>

                    <p class="text-xs text-gray-500">
                      You can upload multiple contract files (PDF, DOC, DOCX,
                      TXT, XLS, XLSX)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- <div
              class="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-4"
            >
              <button
                type="button"
                @click="cancelButtonAction"
                class="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff613c] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-6 py-2.5 text-sm font-medium text-white bg-[#ff613c] border border-transparent rounded-full shadow-sm hover:bg-[#e05530] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff613c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ loading ? "Creating..." : "Create Hotel" }}
              </button>
            </div> -->
          </form>
        </div>

        <div v-if="activeTab == 2">
          <form
            @submit.prevent="addNewHandler"
            class="bg-white rounded-xl p-6 relative"
          >
          <button
                type="submit"
                :disabled="loading"
                class="absolute  -top-20 right-6  text-xs p-1.5 px-4 font-medium text-white bg-[#ff613c] border border-transparent rounded-lg shadow-sm hover:bg-[#e05530] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff613c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
              <div class="flex gap-1">
                <span>{{ loading ? 'Creating...' : 'Create' }}</span>
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
                      <label
                        for="description-mm"
                        class="text-sm font-medium text-gray-700"
                        >Full description (mm)</label
                      >
                      <QuillEditor
                        :options="editorOptions"
                        theme="snow"
                        class="h-64 !bg-gray-100 !border-none !rounded-md !shadow-sm"
                        toolbar="essential"
                        contentType="html"
                        v-model:content="formData.full_description"
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
                          <template v-if="imagesPreview.length > 0">
                            <div
                              v-if="imagesPreview[0]"
                              class="relative group row-span-2"
                            >
                              <button
                                @click.prevent="removeImageSelectImage(0)"
                                class="absolute top-2 right-2 bg-[#ff613c] text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                              >
                                <XCircleIcon class="w-5 h-5" />
                              </button>
                              <img
                                :src="imagesPreview[0]"
                                alt="Hotel image"
                                class="w-full h-[200px] object-cover rounded-md"
                              />
                            </div>

                            <div class="grid grid-cols-2 gap-2">
                              <div
                                v-for="(image, index) in imagesPreview.slice(
                                  1,
                                  5,
                                )"
                                :key="`new-${index}`"
                                class="relative group"
                              >
                                <button
                                  @click.prevent="
                                    removeImageSelectImage(index + 1)
                                  "
                                  class="absolute top-1 right-1 bg-[#ff613c] text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                >
                                  <XCircleIcon class="w-4 h-4" />
                                </button>
                                <img
                                  :src="image"
                                  alt="Hotel image"
                                  class="w-full h-[94px] object-cover rounded-md"
                                />
                              </div>
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
                                class="bg-gray-100 rounded-md h-[94px]"
                              ></div>
                            </div>
                          </template>
                        </div>
                      </div>
                    </div>

                    <div class="pt-4 ms-8">
                      <button
                        type="button"
                        @click.prevent="openFileImagePicker"
                        class="h-8 px-3 bg-[#ff613c] text-white text-xs font-medium rounded-md hover:bg-[#e05530] transition-colors flex items-center gap-1"
                      >
                        <PlusCircleIcon class="w-4 h-4" />
                        Add Images
                      </button>
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
                      <label
                        for="full-description-en"
                        class="text-sm font-medium text-gray-700"
                        >Full description (en)</label
                      >
                      <QuillEditor
                        :options="editorOptions"
                        theme="snow"
                        class="h-64 !bg-gray-100 !border-none !rounded-md !shadow-sm"
                        toolbar="essential"
                        contentType="html"
                        v-model:content="formData.full_description_en"
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
                            v-if="!official_logo_preview"
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

            <!-- <div
              class="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-4"
            >
              <button
                type="button"
                @click="cancelButtonAction"
                class="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff613c] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-6 py-2.5 text-sm font-medium text-white bg-[#ff613c] border border-transparent rounded-md shadow-sm hover:bg-[#e05530] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff613c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ loading ? "Creating..." : "Create Hotel" }}
              </button>
            </div> -->
          </form>
        </div>
      </div>
    </div>
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
