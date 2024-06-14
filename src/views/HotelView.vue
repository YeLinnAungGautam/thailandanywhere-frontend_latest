<template>
  <div
    class="hidden p-6 mb-5 rounded-lg shadow-sm bg-white/60 md:col-span-3 md:block"
  >
    <!-- search input sort filter -->
    <div class="grid grid-cols-6 gap-4">
      <div class="col-span-6">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-medium text-gray-600 tracking-wide mb-3">
            Hotels
          </h3>
          <p v-if="importLoading">import process is doing ...</p>
          <div
            class="flex justify-center items-center border-2 shadow-sm rounded-md overflow-hidden"
          >
            <div
              class="cursor-pointer px-3 py-2.5 text-xs"
              :class="forSale ? 'bg-[#ff613c] text-white' : 'bg-white'"
              @click="toggleSale"
            >
              for Sale Part
            </div>
            <div
              class="cursor-pointer px-3 py-2.5 text-xs"
              @click="toggleSale"
              :class="!forSale ? 'bg-[#ff613c] text-white' : 'bg-white'"
            >
              for User Web
            </div>
          </div>
        </div>
        <div class="mb-4 mt-2">
          <div class="space-x-3 flex justify-between items-center gap-2">
            <div class="">
              <input
                type="text"
                v-model="search"
                class="w-3/5 sm:w-3/5 md:w-[300px] border px-4 py-2 rounded-md shadow-sm focus:ring-0 focus:outline-none text-gray-500"
                placeholder="Search Hotels..."
              />
            </div>
            <div class="flex justify-end items-center gap-3">
              <Button
                :leftIcon="DocumentPlusIcon"
                intent="text"
                @click="importHandler"
              >
                Import
              </Button>
              <Button :leftIcon="ShareIcon" intent="text" @click="exportAction">
                Export
              </Button>
              <Button
                :leftIcon="PlusIcon"
                @click="goEditPage(`create`)"
                v-if="!authStore.isAgent"
              >
                Create
              </Button>
            </div>
          </div>
        </div>
        <div class="mb-5 overflow-auto rounded-lg shadow">
          <table class="w-full">
            <thead class="border-b-2 border-gray-200 bg-gray-50">
              <tr>
                <th
                  class="w-20 p-3 text-xs font-medium tracking-wide text-left"
                >
                  No.
                </th>
                <th class="p-3 text-xs font-medium tracking-wide text-left">
                  Name
                </th>
                <th class="p-3 text-xs font-medium tracking-wide text-left">
                  City
                </th>
                <th class="p-3 text-xs font-medium tracking-wide text-left">
                  Place
                </th>
                <th
                  class="p-3 text-xs font-medium tracking-wide text-left w-30"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                class="bg-white even:bg-gray-50 hover:bg-gray-50"
                v-for="(r, index) in hotels?.data"
                :key="index"
              >
                <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
                  {{ r.id }}
                </td>
                <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
                  {{ r.name }}
                </td>
                <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
                  {{ r.city?.name }}
                </td>
                <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
                  {{ r.place }}
                </td>
                <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <button
                      @click.prevent="goEditPage(r.id)"
                      class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                    >
                      <PencilSquareIcon
                        class="w-5 h-5"
                        v-if="!authStore.isAgent"
                      />
                      <EyeIcon class="w-5 h-5" v-if="authStore.isAgent" />
                    </button>
                    <!-- v-if="authStore.isSuperAdmin" -->
                    <button
                      v-if="authStore.isSuperAdmin"
                      @click.prevent="onDeleteHandler(r.id)"
                      class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-red-500 hover:text-white"
                    >
                      <TrashIcon class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- pagination -->
    <Pagination v-if="!loading" :data="hotels" @change-page="changePage" />
    <Modal :isOpen="importModal" @closeModal="importModal = false">
      <DialogPanel
        class="w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-5"
        >
          Import Process
        </DialogTitle>
        <form
          class="flex justify-between items-center"
          @submit.prevent="importActionHandler"
        >
          <input type="file" name="" @change="importFileAction" id="" />
          <button
            class="border hover:shadow-md border-gray-400 px-4 py-2 rounded-md"
          >
            Import
          </button>
        </form>
        <div class="mt-5 space-y-3 border border-gray-400 p-4 rounded-md">
          <p class="font-semibold">notice</p>
          <p class="text-xs">- file input must be CSV file .</p>
          <p class="text-xs">- All table data must be have .</p>
          <p class="text-xs">- Import process will take time may be longer</p>
          <p class="text-xs">- Process is working behind .</p>
          <p class="text-xs">
            - When finish process , system will show noti message
          </p>
          <p class="text-xs">
            - When fail the process , system will show noti message
          </p>
        </div>
      </DialogPanel>
    </Modal>
  </div>
</template>

<script setup>
import {
  PencilSquareIcon,
  TrashIcon,
  ShareIcon,
  EyeIcon,
  TicketIcon,
  BuildingOfficeIcon,
  PlusIcon,
  DocumentPlusIcon,
  UserGroupIcon,
  XCircleIcon,
  UsersIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/vue/24/outline";
import { QuillEditor } from "@vueup/vue-quill";
import Pagination from "../components/Pagination.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { onMounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import Modal from "../components/Modal.vue";
import { useCityStore } from "../stores/city";
import { useHotelStore } from "../stores/hotel";
import { useAuthStore } from "../stores/auth";
import FacilitoryStoreVue from "../components/FacilitoryStore.vue";
// import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";

const createModalOpen = ref(false);
const toast = useToast();
const cityStore = useCityStore();
const hotelStore = useHotelStore();
const authStore = useAuthStore();
const router = useRouter();

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

const goEditPage = (data) => {
  router.push({ name: "hoteledit", params: { id: data } });
  console.log(data);
};

const formData = ref({
  id: "",
  name: "",
  city_id: null,
  type: "other_booking",
  payment_method: "",
  bank_name: "",
  bank_account_number: "",
  account_name: "",
  place: "",
  legal_name: "",
  description: "",
  full_description: null,
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
    city_id: null,
    type: "other_booking",
    payment_method: "",
    bank_name: "",
    bank_account_number: "",
    account_name: "",
    place: "",
    legal_name: "",
    description: "",
    full_description: null,
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
};

const clearEditorContent = () => {
  if (textEditor.value && textEditor.value.quill) {
    textEditor.value.quill.setText("");
  }
  console.log("hello");
};

const addNewHandler = async () => {
  console.log(loading.value);
  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("city_id", formData.value.city_id);
  frmData.append("type", formData.value.type);
  frmData.append("account_name", formData.value.account_name);
  frmData.append("place", formData.value.place);
  frmData.append("payment_method", formData.value.payment_method);
  frmData.append("bank_name", formData.value.bank_name);
  frmData.append("bank_account_number", formData.value.bank_account_number);
  frmData.append("legal_name", formData.value.legal_name);
  frmData.append("description", formData.value.description);
  frmData.append("full_description", formData.value.full_description);
  frmData.append("contract_due", formData.value.contract_due);
  if (formData.value.images.length > 0) {
    for (let i = 0; i < formData.value.images.length; i++) {
      let file = formData.value.images[i];
      frmData.append("images[" + i + "]", file);
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
      type: "other_booking",
      payment_method: "",
      bank_name: "",
      account_name: "",
      bank_account_number: "",
      place: "",
      legal_name: "",
      description: "",
      full_description: null,
      contract_due: "",
      images: [],
      contracts: [],
    };
    errors.value = null;
    imagesPreview.value = [];
    editImagesPreview.value = [];
    closeModal();
    createModalOpen.value = false;
    await hotelStore.getListAction();
    toast.success(response.message);
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

const openCreate = () => {
  formData.value.name = "";
  formData.value.city_id = null;
  formData.value.type = "other_booking";
  formData.value.payment_method = "";
  formData.value.bank_name = "";
  formData.value.account_name = "";
  formData.value.bank_account_number = "";
  formData.value.place = "";
  formData.value.legal_name = "";
  formData.value.description = "";
  formData.value.full_description = "";
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
  frmData.append("type", formData.value.type);
  frmData.append("payment_method", formData.value.payment_method);
  frmData.append("bank_name", formData.value.bank_name);
  frmData.append("bank_account_number", formData.value.bank_account_number);
  frmData.append("account_name", formData.value.account_name);
  frmData.append("legal_name", formData.value.legal_name);
  frmData.append("description", formData.value.description);
  frmData.append("full_description", formData.value.full_description);
  frmData.append("contract_due", formData.value.contract_due);
  if (formData.value.contracts) {
    // frmData.append("contracts", formData.value.contracts);
    for (let i = 0; i < formData.value.contracts.length; i++) {
      let file = formData.value.contracts[i];
      frmData.append("contracts[" + i + "]", file);
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
      contracts: [],
      images: [],
    };
    errors.value = null;
    imagesPreview.value = [];
    editImagesPreview.value = [];
    createModalOpen.value = false;
    closeModal();
    await hotelStore.getListAction();
    toast.success(response.message);
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
const editModalOpenHandler = (data) => {
  closeModal();
  formData.value.id = data.id;
  formData.value.name = data.name;
  formData.value.city_id = data.city.id;
  formData.value.type = data.type;
  formData.value.place = data.place;
  formData.value.legal_name = data.legal_name;
  formData.value.description = data.description;
  formData.value.full_description = data.full_description;
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
  console.log(formData.value.facilities);
  createModalOpen.value = true;
};

const changePage = async (url) => {
  console.log(url);
  let data = {
    search: search.value,
    type: forSale.value ? "other_booking" : "direct_booking",
  };
  await hotelStore.getChangePage(url, data);
};

const onDeleteHandler = async (id) => {
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
        const response = await hotelStore.deleteAction(id);
        toast.success(response.message);
      } catch (error) {
        if (error.response.data.errors) {
          errors.value = error.response.data.errors;
        }
        toast.error(error.response.data.message);
      }
      await hotelStore.getListAction();
    }
  });
};

const removeImageUpdateImage = async (id, imageID) => {
  const res = hotelStore.deleteImageAction(id, imageID);
  console.log(res, "delete image res");
  toast.success("delete image success");
  closeModal();
  await hotelStore.getListAction({ search: search.value });
};

const quiteSwitch = ref(true);
const toggleQuiteSwitch = () => {
  quiteSwitch.value = !quiteSwitch.value;
};

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

onMounted(async () => {
  await hotelStore.getListAction({
    search: search.value,
    type: forSale.value ? "other_booking" : "direct_booking",
  });
  await cityStore.getSimpleListAction();
  citylist.value = cities.value.data;
});

watch(search, async (newValue) => {
  await hotelStore.getListAction({
    search: search.value,
    type: forSale.value ? "other_booking" : "direct_booking",
  });
});

watch(forSale, async (newValue) => {
  await hotelStore.getListAction({
    search: search.value,
    type: forSale.value ? "other_booking" : "direct_booking",
  });
});
</script>
