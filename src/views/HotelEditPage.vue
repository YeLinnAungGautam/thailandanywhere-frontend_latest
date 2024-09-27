<script setup>
import Layout from "./Layout.vue";
import {
  PencilSquareIcon,
  TrashIcon,
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
} from "@heroicons/vue/24/outline";
import { QuillEditor } from "@vueup/vue-quill";
import Pagination from "../components/Pagination.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { onMounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import Modal from "../components/Modal.vue";
import { useCityStore } from "../stores/city";
import { useHotelStore } from "../stores/hotel";
import { useAuthStore } from "../stores/auth";
import FacilitoryStoreVue from "../components/FacilitoryStore.vue";
import { useHotelCategoryStore } from "../stores/hotelcategory";
import { usePlaceStore } from "../stores/place";
// import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";

const createModalOpen = ref(false);
const toast = useToast();
const cityStore = useCityStore();
const hotelStore = useHotelStore();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const hotelCategoryStore = useHotelCategoryStore();
const placeStore = usePlaceStore();

const { places } = storeToRefs(placeStore);
const { hcategories } = storeToRefs(hotelCategoryStore);
const { hotels, loading, importLoading } = storeToRefs(hotelStore);

const search = ref("");
const errors = ref([]);

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

const formData = ref({
  id: "",
  name: "",
  city_id: null,
  place_id: null,
  category_id: null,
  type: "other_booking",
  payment_method: "",
  bank_name: "",
  bank_account_number: "",
  account_name: "",
  place: "",
  legal_name: "",
  description: "",
  full_description: null,
  full_description_en: null,
  location_map_title: "",
  location_map: "",
  rating: "",
  nearby_places: [],
  contract_due: "",
  contracts: [],
  images: [],
  facilities: [],
});

const onGetArray = (data) => {
  formData.value.facilities = [];
  for (let i = 0; i < data.length; i++) {
    formData.value.facilities.push(data[i]);
  }
  console.log(formData.value.facilities, "this is on get data");
};

const editImagesPreview = ref([]);
const imagesPreview = ref([]);
const imagesInput = ref(null);

const openFileImagePicker = () => {
  imagesInput.value.click();
};

const handlerImagesFileChange = (e) => {
  console.log(e.target.files);
  let selectedFile = e.target.files;
  if (selectedFile) {
    for (let index = 0; index < selectedFile.length; index++) {
      formData.value.images.push(selectedFile[index]);
      imagesPreview.value.push(URL.createObjectURL(selectedFile[index]));
    }
  }
};

const removeImageSelectImage = (index) => {
  formData.value.images.splice(index, 1);
  imagesPreview.value.splice(index, 1);
  console.log(imagesPreview.value);
};

const textEditor = ref(null);

const closeModal = () => {
  formData.value = {
    id: "",
    name: "",
    place_id: null,
    city_id: null,
    category_id: null,
    type: "other_booking",
    payment_method: "",
    bank_name: "",
    bank_account_number: "",
    account_name: "",
    place: "",
    legal_name: "",
    description: "",
    full_description: null,
    full_description_en: null,
    location_map_title: "",
    location_map: "",
    rating: "",
    nearby_places: [],
    contract_due: "",
    contracts: [],
    images: [],
    facilities: [],
  };
  linkContract.value = {};
  editImagesPreview.value = [];
  quiteSwitch.value = true;
  imagesPreview.value = [];
  createModalOpen.value = false;
  console.log(formData.value, "thsi is check");
  if (formData.value.full_description == null) {
    clearEditorContent();
  }
  if (formData.value.full_description_en == null) {
    clearEditorContent();
  }
};

const clearEditorContent = () => {
  if (textEditor.value && textEditor.value.quill) {
    textEditor.value.quill.setText("");
  }
  console.log("hello");
};

// for nearby
const nearByImgInput = ref(null);

const openFileNearByPicker = () => {
  nearByImgInput.value.click();
};

const handlerNearByFileChange = (e) => {
  let selectedFile = e.target.files[0];
  if (selectedFile) {
    nearby.value.img = e.target.files[0];
    nearby.value.img_preview = URL.createObjectURL(selectedFile);
  }
};

const removeNearByImage = () => {
  nearby.value.img = null;
  nearby.value.img_preview = null;
};

const nearby = ref({
  img: null,
  img_preview: null,
  place: null,
  distance: "",
});
const addNewNearBy = () => {
  formData.value.nearby_places.push(nearby.value);
  console.log(formData.value.nearby_places);
  nearby.value = {
    img: null,
    img_preview: null,
    place: null,
    distance: "",
  };
};
const removeNearByItem = (index) => {
  formData.value.nearby_places.splice(index, 1);
};
// end near by

const addNewHandler = async () => {
  console.log(loading.value);
  const frmData = new FormData();
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
  frmData.append("type", formData.value.type);
  frmData.append("account_name", formData.value.account_name);
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
  frmData.append("contract_due", formData.value.contract_due);
  if (formData.value.images.length > 0) {
    for (let i = 0; i < formData.value.images.length; i++) {
      let file = formData.value.images[i];
      frmData.append("images[" + i + "]", file);
    }
  }
  if (formData.value.nearby_places.length > 0) {
    for (let i = 0; i < formData.value.nearby_places.length; i++) {
      frmData.append(
        "nearby_places[" + i + "][image]",
        formData.value.nearby_places[i].img
      );
      frmData.append(
        "nearby_places[" + i + "][name]",
        formData.value.nearby_places[i].place
      );
      frmData.append(
        "nearby_places[" + i + "][distance]",
        formData.value.nearby_places[i].distance
      );
    }
  }
  if (formData.value.facilities.length > 0) {
    for (let f = 0; f < formData.value.facilities.length; f++) {
      frmData.append("facilities[" + f + "]", formData.value.facilities[f]);
    }
  }
  console.log(formData.value.contracts);
  if (formData.value.contracts) {
    // frmData.append("contracts", formData.value.contracts);
    for (let i = 0; i < formData.value.contracts.length; i++) {
      let file = formData.value.contracts[i];
      frmData.append("contracts[" + i + "]", file);
    }
  }

  console.log(
    formData.value.bank_account_number,
    "this is bank account number"
  );

  try {
    const response = await hotelStore.addNewAction(frmData);
    console.log(loading.value);
    formData.value = {
      name: "",
      city_id: null,
      place_id: null,
      category_id: null,
      type: "other_booking",
      payment_method: "",
      bank_name: "",
      account_name: "",
      bank_account_number: "",
      place: "",
      legal_name: "",
      description: "",
      full_description: null,
      full_description_en: null,
      location_map_title: "",
      location_map: "",
      rating: "",
      nearby_places: [],
      contract_due: "",
      images: [],
      contracts: [],
    };
    errors.value = null;
    imagesPreview.value = [];
    editImagesPreview.value = [];
    closeModal();
    createModalOpen.value = false;
    toast.success(response.message);
    let id = response.result.id;
    // router.push("/product/hotel/edit/" + id);
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

const cancelButtonAction = () => {
  router.push("/products/2");
  // window.location.back();
  // router.go(-1);
};

const openCreate = () => {
  formData.value.name = "";
  formData.value.city_id = null;
  formData.value.category_id = null;
  formData.value.place_id = null;
  formData.value.type = "other_booking";
  formData.value.payment_method = "";
  formData.value.bank_name = "";
  formData.value.account_name = "";
  formData.value.bank_account_number = "";
  formData.value.place = "";
  formData.value.legal_name = "";
  formData.value.description = "";
  formData.value.full_description = "";
  formData.value.full_description_en = "";
  formData.value.location_map_title = "";
  formData.value.location_map = "";
  formData.value.rating = "";
  formData.value.nearby_places = [];
  formData.value.contract_due = "";
  formData.value.contracts = [];
  linkContract.value = {};
  imagesPreview.value = [];
  editImagesPreview.value = [];
  createModalOpen.value = true;
};

const contract_file = (e) => {
  let selectedFile = e.target.files;
  if (selectedFile) {
    for (let index = 0; index < selectedFile.length; index++) {
      // formData.value.contracts.push(selectedFile[index]);
      let file = selectedFile[index];
      formData.value.contracts.push(file);
    }
    console.log(formData.value.contracts, "this is contracts");
  }
};

const updateHandler = async () => {
  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("place", formData.value.place);
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
  frmData.append("type", formData.value.type);
  frmData.append("payment_method", formData.value.payment_method);
  frmData.append("bank_name", formData.value.bank_name);
  frmData.append("bank_account_number", formData.value.bank_account_number);
  frmData.append("account_name", formData.value.account_name);
  frmData.append("legal_name", formData.value.legal_name);
  frmData.append("description", formData.value.description);
  frmData.append("full_description", formData.value.full_description);
  frmData.append("full_description_en", formData.value.full_description_en);
  // frmData.append("contract_due", formData.value.contract_due);
  if (
    formData.value.contract_due != null &&
    formData.value.contract_due != undefined &&
    formData.value.contract_due != "null" &&
    formData.value.contract_due != "undefinded"
  ) {
    frmData.append("contract_due", formData.value.contract_due);
  }
  frmData.append("location_map_title", formData.value.location_map_title);
  frmData.append("location_map", formData.value.location_map);
  if (formData.value.rating != "") {
    frmData.append("rating", formData.value.rating);
  }
  if (formData.value.contracts) {
    // frmData.append("contracts", formData.value.contracts);
    for (let i = 0; i < formData.value.contracts.length; i++) {
      let file = formData.value.contracts[i];
      frmData.append("contracts[" + i + "]", file);
    }
  }
  if (formData.value.nearby_places.length > 0) {
    for (let i = 0; i < formData.value.nearby_places.length; i++) {
      if (formData.value.nearby_places[i].img) {
        frmData.append(
          "nearby_places[" + i + "][image]",
          formData.value.nearby_places[i].img
        );
      } else {
        frmData.append(
          "nearby_places[" + i + "][image]",
          formData.value.nearby_places[i].image
        );
      }
      frmData.append(
        "nearby_places[" + i + "][name]",
        formData.value.nearby_places[i].place
      );
      frmData.append(
        "nearby_places[" + i + "][distance]",
        formData.value.nearby_places[i].distance
      );
    }
  }
  if (formData.value.facilities.length > 0) {
    for (let f = 0; f < formData.value.facilities.length; f++) {
      frmData.append("facilities[" + f + "]", formData.value.facilities[f]);
    }
  }
  if (formData.value.images.length > 0) {
    for (let i = 0; i < formData.value.images.length; i++) {
      let file = formData.value.images[i];
      frmData.append("images[" + i + "]", file);
    }
  }

  frmData.append("_method", "PUT");
  try {
    const response = await hotelStore.updateAction(frmData, formData.value.id);
    formData.value = {
      name: "",
      city_id: null,
      place_id: null,
      category_id: null,
      type: "other_booking",
      place: "",
      id: "",
      payment_method: "",
      bank_name: "",
      bank_account_number: "",
      account_name: "",
      legal_name: "",
      contract_due: "",
      description: "",
      full_description: null,
      full_description_en: null,
      location_map_title: "",
      location_map: "",
      rating: "",
      nearby_places: [],
      contracts: [],
      images: [],
    };
    errors.value = null;
    imagesPreview.value = [];
    editImagesPreview.value = [];
    createModalOpen.value = false;
    closeModal();

    toast.success(response.message);
    router.push("/product/hotel/edit/" + route.params.id);
    window.location.reload();
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

const onSubmitHandler = async () => {
  if (formData.value.id) {
    updateHandler();
  } else {
    addNewHandler();
  }
};

const formatDate = (getDate) => {
  if (getDate != null) {
    const dateParts = getDate?.split(" ");
    return dateParts[0];
  }
};

const linkContract = ref({});
const nearByPlaceArray = ref([]);
const cityName = ref("");
const placeName = ref("");
const categoryName = ref("");

const getDetail = async (params) => {
  console.log(params);
  if (params == "create") {
    formData.value.id = "";
  } else {
    formData.value.id = params;
    const res = await hotelStore.getDetailAction(params);
    console.log(res);
    let data = res.result;
    closeModal();
    formData.value.id = data.id;
    formData.value.name = data.name;
    cityName.value = data.city?.name;
    placeName.value = data.hotel_place?.name;
    categoryName.value = data.category?.name;
    formData.value.city_id = data.city?.id;
    formData.value.place_id = data.hotel_place?.id;
    formData.value.category_id = data.category?.id;
    formData.value.type = data.type;
    formData.value.place = data.place;
    formData.value.legal_name = data.legal_name;
    formData.value.description = data.description;
    formData.value.full_description = data.full_description;
    formData.value.full_description_en = data.full_description_en;
    formData.value.location_map_title = "";
    formData.value.location_map = "";
    formData.value.rating = "";
    formData.value.nearby_places = [];
    formData.value.contract_due = formatDate(data.contract_due);
    formData.value.bank_account_number = data.bank_account_number;
    formData.value.account_name = data.account_name;
    formData.value.payment_method = data.payment_method;
    formData.value.bank_name = data.bank_name;
    formData.value.contracts = [];
    console.log(formData.value.contract_due);
    linkContract.value = data;
    console.log(data, "this is file");
    if (data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        editImagesPreview.value.push(data.images[i]);
      }
    }
    if (data.facilities.length > 0) {
      formData.value.facilities = [];
      for (let i = 0; i < data.facilities.length; i++) {
        formData.value.facilities.push(data.facilities[i].id);
      }
    }
    formData.value.location_map = data.location_map;
    formData.value.location_map_title = data.location_map_title;
    formData.value.rating = data.rating;
    //nearByPlaceArray.value =
    // data.nearby_places == null ? [] : data.nearby_places;

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
    console.log(formData.value.facilities);
    createModalOpen.value = true;
  }
};

const removeImageUpdateImage = async (id, imageID) => {
  const res = await hotelStore.deleteImageAction(id, imageID);
  console.log(res, "delete image res");
  toast.success("delete image success");
  closeModal();
  await getDetail(route.params.id);
};

const quiteSwitch = ref(1);

const exportAction = async () => {
  const res = await hotelStore.downloadExport();
  if (res) {
    window.open(res.result.download_link);
  }
};

const forSale = ref(false);
const toggleSale = () => {
  forSale.value = !forSale.value;
};

// for import
const importModal = ref(false);
const importHandler = () => {
  importModal.value = !importModal.value;
};
const fileImport = ref(null);
const importFileAction = (e) => {
  let file = e.target.files[0];
  fileImport.value = file;
};
const importActionHandler = async () => {
  const frmData = new FormData();
  frmData.append("file", fileImport.value);
  try {
    importModal.value = false;
    const res = await hotelStore.importAction(frmData);
    fileImport.value = null;
    console.log(res);
    toast.success(`Hotel ${res.message}`);
  } catch (e) {
    // errors.value = e.response.data.errors;
    importModal.value = false;
    toast.error(e.response.data.message);
  }
};

const removeLinkContract = async (id) => {
  const res = await hotelStore.deleteHotelContractAction(formData.value.id, id);
  console.log(res);
  toast.success("delete link contract success");
  await getDetail(route.params.id);
};

const cityAction = ref(false);
const placeAction = ref(false);
const categoryAction = ref(false);

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
      console.log(places.value, "this is places");
    }
  }
);

onMounted(async () => {
  await getDetail(route.params.id);
});
</script>

<template>
  <!-- bg-[#ff613c] -->
  <Layout>
    <div class="h-auto col-span-2">
      <div class="h-auto pb-4">
        <div class="flex px-4 justify-between items-center py-2">
          <h3>
            {{
              formData.id
                ? `Editing Hotel ${formData.name}`
                : `Creating Hotel ${formData.name}`
            }}
          </h3>
          <div class="flex justify-end items-center gap-2 text-xs">
            <p
              class="px-4 py-2 cursor-pointer rounded-md"
              @click="quiteSwitch = 1"
              :class="
                quiteSwitch == 1 ? 'bg-[#ff613c] text-white' : 'bg-gray-200'
              "
            >
              quit
            </p>
            <p
              class="px-4 py-2 cursor-pointer rounded-md"
              @click="quiteSwitch = 2"
              :class="
                quiteSwitch == 2 ? 'bg-[#ff613c] text-white' : 'bg-gray-200'
              "
            >
              hotel description
            </p>
            <p
              class="px-4 py-2 cursor-pointer rounded-md"
              @click="quiteSwitch = 3"
              :class="
                quiteSwitch == 3 ? 'bg-[#ff613c] text-white' : 'bg-gray-200'
              "
            >
              facilities
            </p>
            <p
              class="px-4 py-2 cursor-pointer rounded-md"
              @click="quiteSwitch = 4"
              :class="
                quiteSwitch == 4 ? 'bg-[#ff613c] text-white' : 'bg-gray-200'
              "
            >
              location & more details
            </p>
          </div>
        </div>
        <div class="px-4">
          <form
            @submit.prevent="onSubmitHandler"
            class="mt-2 grid grid-cols-3 gap-4 bg-white rounded-xl p-6"
          >
            <div v-if="quiteSwitch == 1" class="mb-2 space-y-1">
              <p class="text-gray-800 text-sm mb-2">Type</p>
              <v-select
                v-model="formData.type"
                class="style-chooser text-xs"
                :options="typeList ?? []"
                label="name"
                :clearable="false"
                :reduce="(d) => d.value"
                placeholder="Choose Type"
              ></v-select>
            </div>
            <div v-if="quiteSwitch == 1" class="mb-2 space-y-1">
              <label for="name" class="text-sm text-gray-800">Name</label>
              <input
                type="text"
                v-model="formData.name"
                id="name"
                class="w-full h-10 text-xs px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.name" class="mt-1 text-sm text-red-600">
                {{ errors.name[0] }}
              </p>
            </div>
            <div v-if="quiteSwitch == 1">
              <p class="mb-2 text-sm text-gray-800">Cities</p>
              <div
                v-if="citylist.length == 0 && !cityAction"
                @click="cityAction = true"
                class="text-sm text-gray-500 hover:text-gray-600 border border-gray-300 rounded-md bg-white px-4 py-1.5 w-full flex justify-between items-center"
              >
                <!-- <div class="flex justify-start items-center gap-2 flex-wrap" v-if="city_list_array">
                  <p
                    v-for="i in city_list_array"
                    :key="i.id"
                    class="text-xs py-1 px-2 bg-gray-100 rounded-md whitespace-nowrap"
                  >
                    {{ i.name }}
                  </p>
                </div> -->
                <p class="text-sm">
                  {{ cityName == "" ? "choose city" : cityName }}
                </p>
                <ArrowDownTrayIcon class="w-4 h-4" />
              </div>
              <v-select
                v-model="formData.city_id"
                v-if="citylist.length != 0 && cityAction"
                class="style-chooser"
                :options="citylist ?? []"
                label="name"
                :clearable="false"
                :reduce="(city) => city.id"
                placeholder="Choose City"
              ></v-select>
            </div>
            <div v-if="quiteSwitch == 1">
              <p class="mb-2 text-sm text-gray-800">Place</p>
              <div
                v-if="!placeAction"
                @click="placeAction = true"
                class="text-sm text-gray-500 hover:text-gray-600 border border-gray-300 rounded-md bg-white px-4 py-1.5 w-full flex justify-between items-center"
              >
                <p class="text-sm">
                  {{ placeName == "" ? "choose place" : placeName }}
                </p>
                <ArrowDownTrayIcon class="w-4 h-4" />
              </div>
              <v-select
                v-model="formData.place_id"
                v-if="placeAction"
                class="style-chooser"
                :options="places?.data?.data ?? []"
                label="name"
                :clearable="false"
                :reduce="(place) => place.id"
                placeholder="Choose Place"
              ></v-select>
            </div>
            <div v-if="quiteSwitch == 1">
              <p class="mb-2 text-sm text-gray-800">Hotel Category</p>
              <div
                v-if="!categoryAction"
                @click="categoryAction = true"
                class="text-sm text-gray-500 hover:text-gray-600 border border-gray-300 rounded-md bg-white px-4 py-1.5 w-full flex justify-between items-center"
              >
                <!-- <div class="flex justify-start items-center gap-2 flex-wrap" v-if="city_list_array">
                  <p
                    v-for="i in city_list_array"
                    :key="i.id"
                    class="text-xs py-1 px-2 bg-gray-100 rounded-md whitespace-nowrap"
                  >
                    {{ i.name }}
                  </p>
                </div> -->
                <p class="text-sm">
                  {{ categoryName == "" ? "choose category" : categoryName }}
                </p>
                <ArrowDownTrayIcon class="w-4 h-4" />
              </div>
              <v-select
                v-model="formData.category_id"
                v-if="categoryAction"
                class="style-chooser"
                :options="hcategories?.data ?? []"
                label="name"
                :clearable="false"
                :reduce="(h) => h.id"
                placeholder="Choose Category"
              ></v-select>
            </div>
            <div v-if="quiteSwitch == 1" class="mb-2 space-y-1">
              <label for="name" class="text-sm text-gray-800">Place</label>
              <input
                type="text"
                v-model="formData.place"
                id="name"
                class="w-full h-10 text-xs px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.name" class="mt-1 text-sm text-red-600">
                {{ errors.place[0] }}
              </p>
            </div>
            <div v-if="quiteSwitch == 1" class="mb-2 space-y-1">
              <label for="name" class="text-sm text-gray-800">Legal Name</label>
              <input
                type="text"
                v-model="formData.legal_name"
                id="name"
                class="w-full h-10 text-xs px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.legal_name" class="mt-1 text-sm text-red-600">
                {{ errors.legal_name[0] }}
              </p>
            </div>
            <div v-if="quiteSwitch == 1">
              <p class="mb-2 text-sm text-gray-800 space-y-1">Bank Name</p>
              <v-select
                v-model="formData.bank_name"
                class="style-chooser"
                :options="bankName ?? []"
                label="name"
                :clearable="false"
                :reduce="(bank) => bank.name"
                placeholder="Choose Bank"
              ></v-select>
            </div>

            <div v-if="quiteSwitch == 1">
              <p class="mb-2 mt-2 text-sm text-gray-800 space-y-1">
                Payment Method
              </p>
              <v-select
                v-model="formData.payment_method"
                class="style-chooser"
                :options="paymentMethod ?? []"
                label="name"
                :clearable="false"
                :reduce="(payment) => payment.name"
                placeholder="Choose Payment"
              ></v-select>
            </div>
            <div v-if="quiteSwitch == 1" class="mb-2 mt-2 space-y-1">
              <label for="name" class="text-sm text-gray-800"
                >Bank Account Number</label
              >
              <input
                v-model="formData.bank_account_number"
                type="text"
                class="w-full h-10 px-4 py-2 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-gray-300"
              />
            </div>
            <div v-if="quiteSwitch == 1" class="mb-2 mt-2 space-y-1">
              <label for="name" class="text-sm text-gray-800">
                Account Name</label
              >
              <input
                v-model="formData.account_name"
                type="text"
                class="w-full h-10 px-4 py-2 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-gray-300"
              />
            </div>
            <div v-if="quiteSwitch == 1" class="mb-2 space-y-1">
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
            <div v-if="quiteSwitch == 1" class="mb-2 space-y-1">
              <label for="name" class="text-sm text-gray-800">Contracts</label>
              <input
                type="file"
                multiple
                @change="contract_file"
                id="name"
                class="w-full h-10 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.contracts" class="mt-1 text-sm text-red-600">
                {{ errors.contracts[0] }}
              </p>
            </div>
            <div
              class="mb-2 space-y-3 gap-4"
              v-if="linkContract.length != 0 && quiteSwitch == 1"
            >
              <div v-for="(a, index) in linkContract.contacts" :key="index">
                <p>
                  <a
                    :href="a.file"
                    target="_blink"
                    class="text-sm text-red-500 bg-gray-200 px-3 py-1 rounded-lg"
                    >contracts link {{ index + 1 }}</a
                  >
                  <button
                    @click.prevent="removeLinkContract(a.id)"
                    class="text-sm text-white bg-red-600 px-4 py-1 rounded-lg ml-2"
                  >
                    delete
                  </button>
                </p>
              </div>
            </div>

            <div v-if="quiteSwitch == 1" class="mb-2 space-y-1">
              <label for="description" class="text-sm text-gray-800"
                >Images</label
              >
              <input
                multiple
                type="file"
                name=""
                ref="imagesInput"
                id=""
                @change="handlerImagesFileChange"
                class="hidden w-full h-10 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
                accept="image/*"
              />
              <button
                class="text-sm text-blue-600 ml-4"
                @click.prevent="openFileImagePicker"
              >
                <i
                  class="fa-solid fa-plus text-sm font-semibold px-2 py-1 bg-blue-600 rounded-full shadow text-white"
                ></i>
              </button>
              <div
                class="grid grid-cols-3 gap-2"
                v-if="imagesPreview.length != 0"
              >
                <div
                  class="relative"
                  v-for="(image, index) in imagesPreview"
                  :key="index"
                >
                  <button
                    @click.prevent="removeImageSelectImage(index)"
                    class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
                  >
                    <XCircleIcon class="w-8 h-8 font-semibold" />
                  </button>

                  <img class="h-auto w-full rounded" :src="image" alt="" />
                </div>
              </div>
              <div
                class="grid grid-cols-3 gap-2"
                v-if="
                  editImagesPreview.length != 0 && imagesPreview.length == 0
                "
              >
                <div
                  class="relative"
                  v-for="(image, index) in editImagesPreview"
                  :key="index"
                >
                  <button
                    @click.prevent="
                      removeImageUpdateImage(formData.id, image.id)
                    "
                    class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
                  >
                    <XCircleIcon class="w-8 h-8 font-semibold" />
                  </button>
                  <img
                    class="h-auto w-full rounded"
                    :src="image.image"
                    alt=""
                  />
                </div>
              </div>
            </div>

            <!-- 2 -->
            <div class="col-span-3 grid grid-cols-2 gap-4">
              <div v-if="quiteSwitch == 2" class="mb-2 space-y-1">
                <label for="name" class="text-sm text-gray-800"
                  >Description</label
                >
                <textarea
                  v-model="formData.description"
                  id="description"
                  class="w-full h-[400px] px-4 py-2 text-gray-900 border-2 text-xs border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
                ></textarea>
                <p v-if="errors?.description" class="mt-1 text-sm text-red-600">
                  {{ errors.description[0] }}
                </p>
              </div>
              <div v-if="quiteSwitch == 2" class="mb-2 space-y-1">
                <label for="name" class="text-sm text-gray-800"
                  >Full Description (with editor)</label
                >
                <QuillEditor
                  ref="textEditor"
                  :options="editorOptions"
                  theme="snow"
                  class="!bg-white/50 !border-1 !border-gray-300 !rounded-bl-md !rounded-br-md !shadow-sm !text-xs !text-gray-900 !h-[350px]"
                  toolbar="essential"
                  contentType="html"
                  v-model:content="formData.full_description"
                />
              </div>
              <div v-if="quiteSwitch == 2" class="mb-2 space-y-1">
                <label for="name" class="text-sm text-gray-800"
                  >Full Description ( english )</label
                >
                <QuillEditor
                  ref="textEditor"
                  :options="editorOptions"
                  theme="snow"
                  class="!bg-white/50 !border-1 !border-gray-300 !rounded-bl-md !rounded-br-md !shadow-sm !text-xs !text-gray-900 !h-[350px]"
                  toolbar="essential"
                  contentType="html"
                  v-model:content="formData.full_description_en"
                />
              </div>
            </div>

            <!-- 3 -->
            <div v-if="quiteSwitch == 3" class="col-span-3">
              <FacilitoryStoreVue
                @Change="onGetArray"
                :data="formData.facilities"
              />
            </div>

            <!-- 4 -->
            <div class="col-span-3 grid grid-cols-2 gap-4">
              <div v-if="quiteSwitch == 4" class="mb-2 space-y-1">
                <label for="name" class="text-sm text-gray-800"
                  >Location map title (address)</label
                >
                <input
                  type="text"
                  id="name"
                  v-model="formData.location_map_title"
                  placeholder="enter hotel address"
                  class="w-full h-10 text-xs px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
                />
              </div>
              <div v-if="quiteSwitch == 4" class="mb-2 space-y-1">
                <label for="name" class="text-sm text-gray-800">Rating</label>
                <div class="flex justify-start items-center gap-4">
                  <div
                    v-for="i in 5"
                    :key="i"
                    class="flex justify-center cursor-pointer items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg"
                    :class="
                      i == formData.rating
                        ? 'bg-[#ff613c] text-white'
                        : 'bg-gray-200'
                    "
                    @click="formData.rating = i"
                  >
                    <p>{{ i }}</p>
                    <StarIcon
                      class="w-6 h-6"
                      :class="
                        i == formData.rating
                          ? 'bg- text-white'
                          : 'text-[#ff613c]'
                      "
                    />
                  </div>
                </div>
              </div>
              <div v-if="quiteSwitch == 4" class="mb-2 space-y-1">
                <label for="name" class="text-sm text-gray-800"
                  >Location Link</label
                >
                <input
                  type="text"
                  id="name"
                  v-model="formData.location_map"
                  placeholder="paste hotel location map link"
                  class="w-full h-10 text-xs px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
                />
              </div>
              <div v-if="quiteSwitch == 4" class="mb-2 space-y-1">
                <label for="name" class="text-sm text-gray-800"
                  >Nearby Places</label
                >
                <div class="flex justify-between items-center gap-2">
                  <div
                    @click="openFileNearByPicker"
                    v-if="!nearby.img_preview"
                    class="rounded px-2 py-1.5 border-2 cursor-pointer border-gray-300"
                  >
                    📦
                  </div>
                  <div
                    @click="openFileNearByPicker"
                    v-if="nearby.img_preview"
                    class="rounded border-2 cursor-pointer border-gray-300"
                  >
                    <img :src="nearby.img_preview" alt="" class="w-28 h-10" />
                  </div>
                  <input
                    type="file"
                    ref="nearByImgInput"
                    class="hidden"
                    @change="handlerNearByFileChange"
                    accept="image/*"
                  />
                  <input
                    type="text"
                    id="name"
                    v-model="nearby.place"
                    placeholder="enter place name"
                    class="w-full h-10 text-xs px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
                  />
                  <input
                    type="text"
                    id="name"
                    v-model="nearby.distance"
                    placeholder="3 min drive"
                    class="w-full h-10 text-xs px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
                  />
                  <div
                    @click="addNewNearBy"
                    class="rounded px-2 py-1.5 border-2 cursor-pointer border-gray-300"
                  >
                    ➕
                  </div>
                </div>
              </div>
              <!-- location map preview -->
              <div
                v-if="
                  quiteSwitch == 4 &&
                  formData.location_map &&
                  formData.location_map != 'null'
                "
                class="mb-2 space-y-1"
              >
                <label for="name" class="text-sm text-gray-800"
                  >Location map preview</label
                >
                <iframe
                  :src="formData.location_map"
                  class="w-[100%] h-[400px] rounded-2xl"
                  style="border: 0"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div
                v-if="quiteSwitch == 4 && !formData.location_map"
                class="mb-2 space-y-1"
              ></div>
              <div>
                <div
                  v-if="quiteSwitch == 4 && formData?.nearby_places.length > 0"
                  class="mb-2 space-y-1"
                >
                  <label for="name" class="text-sm text-gray-800"
                    >Add New Nearby preview</label
                  >
                  <div
                    class="flex justify-between items-center gap-2"
                    v-for="(f, index) in formData.nearby_places"
                    :key="index"
                  >
                    <div
                      v-if="f.img_preview"
                      class="rounded border-2 cursor-pointer border-gray-300"
                    >
                      <img :src="f.img_preview" alt="" class="w-28 h-10" />
                    </div>
                    <div
                      v-if="f.icon"
                      class="rounded border-2 cursor-pointer border-gray-300"
                    >
                      <img :src="f.icon" alt="" class="w-28 h-10" />
                    </div>
                    <div
                      v-if="f.image"
                      class="rounded border-2 cursor-pointer border-gray-300"
                    >
                      <img :src="f.image" alt="" class="w-28 h-10" />
                    </div>

                    <input
                      type="text"
                      id="name"
                      v-model="f.place"
                      placeholder="enter place name"
                      class="w-full h-10 text-xs px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
                    />
                    <input
                      type="text"
                      id="name"
                      v-model="f.distance"
                      placeholder="3 min drive"
                      class="w-full h-10 text-xs px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
                    />
                    <div
                      @click="removeNearByItem(index)"
                      class="rounded px-2 py-1.5 border-2 cursor-pointer border-gray-300"
                    >
                      ➖
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-end flex justify-end items-center col-span-3">
              <p
                class="text-[#ff613c] cursor-pointer px-2 py-1.5 mr-2 rounded bg-transparent border border-[#ff613c]"
                @click="cancelButtonAction"
              >
                cancel
              </p>
              <Button type="submit" v-if="!loading && !authStore.isAgent">
                Submit
              </Button>
              <Button type="button" class="bg-gray-300" v-if="loading">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Layout>
</template>
