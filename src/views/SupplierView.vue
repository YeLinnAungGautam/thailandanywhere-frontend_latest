<template>
  <div
    class="hidden p-6 mb-5 rounded-lg shadow-sm bg-white/60 md:col-span-3 md:block"
  >
    <h3 class="mb-3 text-xl font-medium tracking-wide text-gray-600">
      Suppliers
    </h3>
    <!-- search input sort filter -->
    <div class="flex items-center justify-between mb-8">
      <div class="">
        <input
          v-model="search"
          type="text"
          class="w-3/5 sm:w-3/5 md:w-[300px] mr-3 border px-4 py-2 rounded-md shadow focus:ring-0 focus:outline-none text-gray-500"
          placeholder="Search for cities.."
        />
      </div>
      <div class="space-x-3">
        <Button :leftIcon="ShareIcon" intent="text"> Export </Button>
        <Button :leftIcon="PlusIcon" @click.prevent="cityModalOpen = true">
          Add Supplier
        </Button>
      </div>
    </div>
    <div class="p-6 mb-5 rounded-lg shadow-sm bg-white/60">
      <!-- search input sort filter -->
      <!-- <div class="flex items-center justify-between mb-5">
        
      </div> -->
      <div class="mb-5 overflow-auto rounded-lg shadow" v-if="!loading">
        <table class="w-full">
          <thead class="border-b-2 border-gray-200 bg-gray-50">
            <tr>
              <th class="p-4 text-xs font-medium tracking-wide text-left">
                No.
              </th>
              <th class="p-4 text-xs font-medium tracking-wide text-left">
                logo
              </th>
              <th class="p-4 text-xs font-medium tracking-wide text-left">
                Name
              </th>
              <th class="p-4 text-xs font-medium tracking-wide text-left">
                Email
              </th>
              <th class="p-4 text-xs font-medium tracking-wide text-left">
                bank_account_name
              </th>

              <th class="p-4 text-xs font-medium tracking-wide text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="supplier in suppliers?.data"
              :key="supplier.id"
              class="bg-white even:bg-gray-50 hover:bg-gray-50"
            >
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                {{ supplier.id }}
              </td>
              <td
                class="p-4 text-xs text-gray-700 whitespace-nowrap"
                v-if="supplier.logo"
              >
                <img class="rounded w-14 h-14" :src="supplier.logo" alt="" />
              </td>
              <td
                class="p-4 text-xs text-gray-700 whitespace-nowrap"
                v-if="!supplier.logo"
              >
                -
              </td>
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                {{ supplier.name }}
              </td>
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                {{ supplier?.email ? supplier.email : "-" }}
              </td>
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                {{
                  supplier?.bank_account_name ? supplier.bank_account_name : "-"
                }}
              </td>

              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <button
                    @click.prevent="editModalOpenHandler(supplier)"
                    class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                  >
                    <PencilSquareIcon class="w-5 h-5" />
                  </button>
                  <button
                    @click.prevent="onDeleteHandler(supplier.id)"
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
      <!-- pagination -->
      <Pagination v-if="!loading" :data="suppliers" @change-page="changePage" />
    </div>
    <!-- modal -->
    <Modal :isOpen="cityModalOpen" @closeModal="closeMethod">
      <DialogPanel
        class="w-full max-w-lg p-4 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl"
      >
        <DialogTitle
          as="h3"
          class="mb-5 text-lg font-medium leading-6 text-gray-900"
        >
          {{ formData.id ? "Edit Supplier" : "Add New Supplier" }}
        </DialogTitle>
        <form @submit.prevent="onSubmitHandler" class="mt-2">
          <div class="mb-2 space-y-1">
            <label for="name" class="text-sm text-gray-800">Name</label>
            <input
              type="text"
              v-model="formData.name"
              id="name"
              class="w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.name" class="mt-1 text-sm text-red-600">
              {{ errors.name[0] }}
            </p>
          </div>

          <div class="mb-2 space-y-1">
            <label for="name" class="text-sm text-gray-800">Contact</label>
            <input
              type="text"
              v-model="formData.contact"
              id="contact"
              class="w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.contact" class="mt-1 text-sm text-red-600">
              {{ errors.contact[0] }}
            </p>
          </div>
          <div class="mb-2 space-y-1">
            <label for="name" class="text-sm text-gray-800">Email</label>
            <input
              type="text"
              v-model="formData.email"
              id="email"
              class="w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.email" class="mt-1 text-sm text-red-600">
              {{ errors.email[0] }}
            </p>
          </div>
          <div class="mb-2 space-y-1" v-if="!formData.id">
            <label for="name" class="text-sm text-gray-800">Password</label>
            <input
              type="password"
              v-model="formData.password"
              id="password"
              class="w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.password" class="mt-1 text-sm text-red-600">
              {{ errors.password[0] }}
            </p>
          </div>
          <div class="mb-2 space-y-1" v-if="!formData.id">
            <label for="name" class="text-sm text-gray-800"
              >Password Confirmation</label
            >
            <input
              type="password"
              v-model="formData.password_confirmation"
              id="password_confirmation"
              class="w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p
              v-if="errors?.password_confirmation"
              class="mt-1 text-sm text-red-600"
            >
              {{ errors.password_confirmation[0] }}
            </p>
          </div>
          <div class="mb-2 space-y-1">
            <div>
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
            <p v-if="errors?.bank_name" class="mt-1 text-sm text-red-600">
              {{ errors.bank_name[0] }}
            </p>
          </div>
          <div class="mb-2 space-y-1">
            <label for="name" class="text-sm text-gray-800"
              >Bank Account Number</label
            >
            <input
              type="text"
              v-model="formData.bank_account_no"
              id="name"
              class="w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.bank_account_no" class="mt-1 text-sm text-red-600">
              {{ errors.bank_account_no[0] }}
            </p>
          </div>
          <div class="mb-2 space-y-1">
            <label for="name" class="text-sm text-gray-800"
              >Bank Account Name</label
            >
            <input
              type="text"
              v-model="formData.bank_account_name"
              id="name"
              class="w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p
              v-if="errors?.bank_account_name"
              class="mt-1 text-sm text-red-600"
            >
              {{ errors.bank_account_name[0] }}
            </p>
          </div>
          <div class="mb-2 space-y-1" v-if="formData.id">
            <label for="name" class="text-sm text-gray-800"
              >Relative Driver</label
            >
            <table class="w-full border border-gray-200 overflow-hidden">
              <thead class="border-b-2 border-gray-200 bg-gray-50">
                <tr>
                  <th class="p-4 text-xs font-medium text-left">No.</th>
                  <th class="p-4 text-xs font-medium text-left">Name</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr>
                  <td colspan="2" class="text-center py-3">
                    <p
                      @click="showList = !showList"
                      class="text-xs bg-[#FF6300] rounded-3xl inline-block px-8 py-1 text-white"
                    >
                      {{ showList ? "Open" : "close" }}
                    </p>
                  </td>
                </tr>
                <tr
                  v-for="(dri, index) in driverList ?? []"
                  :class="{ hidden: !showList }"
                  :key="dri.id"
                  class="bg-white even:bg-gray-50 hover:bg-gray-50"
                >
                  <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                    {{ index + 1 }}
                  </td>
                  <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                    {{ dri.name }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mb-2 space-y-1">
            <label for="image" class="relative text-sm text-gray-800"
              >Logo
              <span
                v-if="previewImage"
                @click.prevent="removeSelectedImage"
                class="text-red-400 text-xs cursor-pointer font-semibold underline absolute top-[10px] left-[391px]"
                ><i class="text-3xl fa-solid fa-circle-minus"></i></span
            ></label>
            <input
              type="file"
              id="image"
              ref="fileInput"
              class="hidden"
              @change="handleFileChange"
              accept="image/*"
            />
            <div v-if="previewImage" class="w-full h-auto">
              <img
                :src="previewImage"
                alt="Image preview"
                class="w-full h-auto rounded"
              />
            </div>
            <div
              v-else
              @click.prevent="openFilePicker"
              class="cursor-pointer w-full h-[250px] border-2 border-dashed border-gray-400 rounded flex justify-center items-center"
            >
              <span class="text-xs"
                ><i
                  class="fa-solid fa-plus text-4xl font-semibold py-4 px-5 bg-[#ff613c] rounded-full shadow text-white"
                ></i
              ></span>
            </div>
            <p v-if="errors?.image" class="mt-1 text-sm text-red-600">
              {{ errors.image[0] }}
            </p>
          </div>

          <div class="text-end">
            <Button type="submit"> Submit </Button>
          </div>
        </form>
      </DialogPanel>
    </Modal>
  </div>
</template>

<script setup>
import Layout from "./Layout.vue";
import Input from "../components/Input.vue";
import Button from "../components/Button.vue";
import Pagination from "../components/Pagination.vue";
import {
  PencilSquareIcon,
  TrashIcon,
  ShareIcon,
  EyeIcon,
  TicketIcon,
  BuildingOfficeIcon,
  PlusIcon,
  UserGroupIcon,
  UsersIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/vue/24/outline";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { onMounted, ref, watch } from "vue";
import Modal from "../components/Modal.vue";
import { storeToRefs } from "pinia";
import axios from "axios";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
// import { useDriverStore } from "../stores/driver";
import { useSupplierStore } from "../stores/supplier";
import debounce from "lodash/debounce";

// const driverStore = useDriverStore();
const supplierStore = useSupplierStore();
const toast = useToast();
const showList = ref(false);
const cityModalOpen = ref(false);
const fileInput = ref(null);
const previewImage = ref(null);

const formData = ref({
  name: "",
  contact: "",
  email: "",
  password: "",
  password_confirmation: "",
  logo: null,
  bank_name: "",
  bank_account_no: "",
  bank_account_name: "",
  id: "",
});
const showEntries = ref(10);
const errors = ref(null);
const search = ref("");
const { suppliers, loading } = storeToRefs(supplierStore);
// const { drivers } = storeToRefs(driverStore);

const closeMethod = () => {
  formData.value = {
    name: "",
    contact: "",
    email: "",
    password: "",
    password_confirmation: "",
    logo: null,
    bank_name: "",
    bank_account_no: "",
    bank_account_name: "",
    id: "",
  };
  driverList.value = [];
  previewImage.value = null;
  cityModalOpen.value = false;
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

const changePage = async (url) => {
  await supplierStore.getChangePage(url);
};

const openFilePicker = () => {
  fileInput.value.click();
};

const handleFileChange = (e) => {
  let selectedFile = e.target.files[0];
  if (selectedFile) {
    formData.value.logo = e.target.files[0];
    previewImage.value = URL.createObjectURL(selectedFile);
  }
};

const removeSelectedImage = () => {
  formData.value.profile = null;
  previewImage.value = null;
};

const addNewHandler = async () => {
  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("contact", formData.value.contact);
  frmData.append("email", formData.value.email);
  frmData.append("password", formData.value.password);
  frmData.append("password_confirmation", formData.value.password_confirmation);
  frmData.append("logo", formData.value.logo);
  frmData.append("bank_name", formData.value.bank_name);
  frmData.append("bank_account_no", formData.value.bank_account_no);
  frmData.append("bank_account_name", formData.value.bank_account_name);

  try {
    const response = await supplierStore.addNewAction(frmData);
    formData.value = {
      name: "",
      contact: "",
      email: "",
      password: "",
      password_confirmation: "",
      logo: null,
      bank_name: "",
      bank_account_no: "",
      bank_account_name: "",

      id: "",
    };
    previewImage.value = null;
    errors.value = null;
    cityModalOpen.value = false;
    await supplierStore.getListAction();
    toast.success(response.message);
  } catch (error) {
    if (error.response.data.errors) {
      errors.value = error.response.data.errors;
    }
    toast.error(error.response.data.message);
  }
};

const updateHandler = async () => {
  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("contact", formData.value.contact);
  frmData.append("email", formData.value.email);
  if (formData.value.logo) {
    frmData.append("logo", formData.value.logo);
  }
  frmData.append("bank_name", formData.value.bank_name);
  frmData.append("bank_account_no", formData.value.bank_account_no);
  frmData.append("bank_account_name", formData.value.bank_account_name);
  frmData.append("_method", "PUT");
  try {
    const response = await supplierStore.updateAction(
      frmData,
      formData.value.id
    );
    formData.value = {
      name: "",
      contact: "",
      email: "",
      password: "",
      password_confirmation: "",
      logo: null,
      bank_name: "",
      bank_account_no: "",
      bank_account_name: "",

      id: "",
    };
    driverList.value = [];
    previewImage.value = null;
    errors.value = null;
    cityModalOpen.value = false;
    await supplierStore.getListAction();
    toast.success(response.message);
  } catch (error) {
    if (error.response.data.errors) {
      errors.value = error.response.data.errors;
    }
    toast.error(error.response.data.message);
  }
};

const onSubmitHandler = async () => {
  if (formData.value.id) {
    updateHandler();
  } else {
    addNewHandler();
  }
};

const driverShow = ref(false);
const getDrivers = async () => {
  driverShow.value = true;
};
const driverList = ref([]);

const editModalOpenHandler = (data) => {
  formData.value.id = data.id;
  formData.value.name = data.name;
  formData.value.contact = data.contact;
  formData.value.bank_name = data.bank_name;
  formData.value.email = data.email;
  driverList.value = data.drivers;
  formData.value.bank_account_name = data.bank_account_name;
  formData.value.bank_account_no = data.bank_account_no;
  previewImage.value = data.logo;
  cityModalOpen.value = true;
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
        const response = await supplierStore.deleteAction(id);
        toast.success(response.message);
      } catch (error) {
        if (error.response.data.errors) {
          errors.value = error.response.data.errors;
        }
        toast.error(error.response.data.message);
      }
      await supplierStore.getListAction();
    }
  });
};

onMounted(async () => {
  await supplierStore.getListAction();
  // await driverStore.getSimpleListAction();
  console.log(suppliers.value, "this is driver");
});

watch(showEntries, async (newValue) => {
  await supplierStore.getListAction({ limit: showEntries.value });
});

// watch(search, async (newValue) => {
//   await supplierStore.getListAction({ search: search.value });
// });
watch(
  search,
  debounce(async (newValue) => {
    await supplierStore.getListAction({ search: search.value });
  }, 500)
);
</script>
