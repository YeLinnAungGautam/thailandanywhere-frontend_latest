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
  ClipboardDocumentListIcon,
} from "@heroicons/vue/24/outline";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { onMounted, ref, watch } from "vue";
import Modal from "../components/Modal.vue";
import { storeToRefs } from "pinia";
import axios from "axios";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
import { useDriverStore } from "../stores/driver";
import { useSupplierStore } from "../stores/supplier";
import listPlugin from "@fullcalendar/list";

const driverStore = useDriverStore();
const supplierStore = useSupplierStore();
const { suppliers } = storeToRefs(supplierStore);
const { drivers, loading, car_numbers, loading_car } = storeToRefs(driverStore);
const toast = useToast();

const cityModalOpen = ref(false);
const fileInput = ref(null);
const fileCarInput = ref(null);
const previewImage = ref(null);
const previewCarImage = ref(null);
const formData = ref({
  name: "",
  contact: "",
  profile: null,
  vendor_name: "",
  id: "",
  car_photo: null,
  supplier_id: "",
});
const showEntries = ref(10);
const errors = ref(null);
const search = ref("");

const createFormShow = ref(false);
const carNumberListShow = ref(false);

const closeMethod = () => {
  formData.value = {
    name: "",
    contact: "",
    profile: null,
    vendor_name: "",
    id: "",
    car_photo: null,
    supplier_id: "",
  };
  previewImage.value = null;
  previewCarImage.value = null;
  cityModalOpen.value = false;
  createFormShow.value = false;
  carNumberListShow.value = false;
};

const changePage = async (url) => {
  await driverStore.getChangePage(url);
};

const openFilePicker = () => {
  fileInput.value.click();
};
const openFileCarPicker = () => {
  fileCarInput.value.click();
};

const handleFileChange = (e) => {
  let selectedFile = e.target.files[0];
  if (selectedFile) {
    formData.value.profile = e.target.files[0];
    previewImage.value = URL.createObjectURL(selectedFile);
  }
};
const handleFileCarChange = (e) => {
  let selectedFile = e.target.files[0];
  if (selectedFile) {
    formData.value.car_photo = e.target.files[0];
    previewCarImage.value = URL.createObjectURL(selectedFile);
  }
};

const removeSelectedImage = () => {
  formData.value.profile = null;
  previewImage.value = null;
};
const removeSelectedCarImage = () => {
  formData.value.car_photo = null;
  previewCarImage.value = null;
};

const addNewHandler = async () => {
  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("contact", formData.value.contact);

  frmData.append("car_photo", formData.value.car_photo);
  frmData.append("profile", formData.value.profile);
  frmData.append("supplier_id", formData.value.supplier_id);

  try {
    const response = await driverStore.addNewAction(frmData);
    formData.value = {
      name: "",
      contact: "",
      profile: null,
      vendor_name: "",
      id: "",
      car_photo: null,
      supplier_id: "",
    };
    previewImage.value = null;
    previewCarImage.value = null;
    errors.value = null;
    cityModalOpen.value = false;
    await driverStore.getListAction();
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

  frmData.append("supplier_id", formData.value.supplier_id);

  if (formData.value.car_photo) {
    frmData.append("car_photo", formData.value.car_photo);
  }
  if (formData.value.profile) {
    frmData.append("profile", formData.value.profile);
  }
  frmData.append("_method", "PUT");
  try {
    const response = await driverStore.updateAction(frmData, formData.value.id);
    formData.value = {
      name: "",
      contact: "",
      profile: null,
      vendor_name: "",
      id: "",
      car_photo: null,
      supplier_id: "",
    };
    previewImage.value = null;
    previewCarImage.value = null;
    errors.value = null;
    cityModalOpen.value = false;
    await driverStore.getListAction();
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

const editModalOpenHandler = async (data) => {
  formData.value.id = data.id;
  formData.value.name = data.name;
  formData.value.contact = data.contact;

  formData.value.supplier_id = data.supplier?.id;
  previewImage.value = data.profile;
  previewCarImage.value = data.car_photo;
  cityModalOpen.value = true;
  await getCarList();
};

const getCarList = async () => {
  if (formData.value.id) {
    const res = await driverStore.getListCarAction({ id: formData.value.id });
    console.log(res, "this is driver car");
  }
};

const formCarData = ref({
  id: "",
  car_number: "",
  is_default: false,
});

const carNumberCreateHandler = async () => {
  const frmData = new FormData();
  frmData.append("car_number", formCarData.value.car_number);
  frmData.append("is_default", formCarData.value.is_default ? 1 : 0);

  try {
    const response = await driverStore.addNewCarAction(
      frmData,
      formData.value.id
    );
    formCarData.value = {
      id: "",
      car_number: "",
      is_default: false,
    };
    toast.success(response.message);
    errors.value = null;
    await getCarList();
  } catch (error) {
    if (error.response.data.errors) {
      errors.value = error.response.data.errors;
    }
    toast.error(error.response.data.message);
  }
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
        const response = await driverStore.deleteAction(id);
        toast.success(response.message);
      } catch (error) {
        if (error.response.data.errors) {
          errors.value = error.response.data.errors;
        }
        toast.error(error.response.data.message);
      }
      await driverStore.getListAction();
    }
  });
};

onMounted(async () => {
  await driverStore.getListAction();
  await supplierStore.getSimpleListAction();
  console.log(drivers.value, "this is driver");
});

watch(showEntries, async (newValue) => {
  await driverStore.getListAction({ limit: showEntries.value });
});

watch(search, async (newValue) => {
  await driverStore.getListAction({ search: search.value });
});
</script>

<template>
  <div
    class="hidden p-6 mb-5 rounded-lg shadow-sm bg-white/60 md:col-span-3 md:block"
  >
    <!-- search input sort filter -->
    <div class="flex items-center justify-between">
      <h3 class="mb-3 text-xl font-medium tracking-wide text-gray-600">
        Drivers
      </h3>
      <div class="space-x-3">
        <Button :leftIcon="ShareIcon" intent="text"> Export </Button>
        <Button :leftIcon="PlusIcon" @click.prevent="cityModalOpen = true">
          Add Driver
        </Button>
      </div>
    </div>
    <div class="pb-2 pt-2 mb-5 rounded-lg">
      <!-- search input sort filter -->
      <div class="flex items-center justify-between mb-5">
        <div class="">
          <input
            v-model="search"
            type="text"
            class="w-3/5 sm:w-3/5 md:w-[300px] mr-3 border px-4 py-2 rounded-md shadow focus:ring-0 focus:outline-none text-gray-500"
            placeholder="Search for cities.."
          />
        </div>
      </div>
      <div class="mb-5 overflow-auto rounded-lg shadow" v-if="!loading">
        <table class="w-full">
          <thead class="border-b-2 border-gray-200 bg-gray-50">
            <tr>
              <th class="p-4 text-xs font-medium tracking-wide text-left">
                No.
              </th>
              <th class="p-4 text-xs font-medium tracking-wide text-left">
                Name
              </th>
              <th class="p-4 text-xs font-medium tracking-wide text-left">
                Contact
              </th>
              <th class="p-4 text-xs font-medium tracking-wide text-left">
                Supplier Name
              </th>

              <th class="p-4 text-xs font-medium tracking-wide text-left">
                Car Number
              </th>
              <th class="p-4 text-xs font-medium tracking-wide text-left">
                Car Photo
              </th>
              <th class="p-4 text-xs font-medium tracking-wide text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="driver in drivers?.data"
              :key="driver.id"
              class="bg-white even:bg-gray-50 hover:bg-gray-50"
            >
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                {{ driver.id }}
              </td>
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                {{ driver.name }}
              </td>
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                {{ driver.contact }}
              </td>
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                {{ driver.supplier?.name }}
              </td>
              <td>-</td>
              <td
                class="p-4 text-xs text-gray-700 whitespace-nowrap"
                v-if="driver.car_photo"
              >
                <img class="rounded w-14 h-14" :src="driver.car_photo" alt="" />
              </td>
              <td
                class="p-4 text-xs text-gray-700 whitespace-nowrap"
                v-if="!driver.car_photo"
              >
                -
              </td>
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <button
                    @click.prevent="editModalOpenHandler(driver)"
                    class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                  >
                    <PencilSquareIcon class="w-5 h-5" />
                  </button>
                  <button
                    @click.prevent="onDeleteHandler(driver.id)"
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
      <Pagination v-if="!loading" :data="drivers" @change-page="changePage" />
    </div>
    <!-- modal -->
    <Modal :isOpen="cityModalOpen" @closeModal="closeMethod">
      <DialogPanel
        class="w-full max-w-lg p-4 text-left align-middle transition-all transform bg-white rounded-lg shadow-xl"
      >
        <DialogTitle
          as="h3"
          class="mb-5 text-lg font-medium leading-6 text-gray-900"
        >
          {{ formData.id ? "Edit Driver" : "Add New Driver" }}
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

          <div class="space-y-1 mb-4">
            <p class="text-gray-800 text-sm mb-2">Choose Supplier</p>
            <v-select
              v-model="formData.supplier_id"
              class="style-chooser"
              :options="suppliers.data ?? []"
              label="name"
              :clearable="false"
              :reduce="(product) => product.id"
              placeholder="Choose Driver"
            ></v-select>
          </div>
          <div class="space-y-1 mb-4">
            <div class="flex justify-between items-center">
              <p class="text-gray-800 text-sm mb-2">Driver's Car Numbers</p>
              <div class="flex justify-end items-center gap-2">
                <button
                  @click.prevent="carNumberListShow = !carNumberListShow"
                  class="bg-orange-500 text-white text-xs px-3 py-2 rounded-md flex justify-center items-center gap-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                    />
                  </svg>
                  See List
                </button>
                <button
                  @click.prevent="createFormShow = !createFormShow"
                  class="bg-orange-500 text-white text-xs px-3 py-2 rounded-md flex justify-center items-center gap-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>

                  {{
                    createFormShow == false
                      ? "Open Car No. Form"
                      : "Close Car No. Form"
                  }}
                </button>
              </div>
            </div>
            <div
              v-if="createFormShow"
              class="absolute -top-1 -right-[370px] z-40 bg-white p-4 rounded-md shadow-md space-y-4"
            >
              <p class="mb-5 text-lg font-medium leading-6 text-gray-900">
                Driver Car Number Form
              </p>
              <div class="mb-2 space-y-1">
                <label for="name" class="text-sm text-gray-800"
                  >Car Number</label
                >
                <input
                  type="text"
                  v-model="formCarData.car_number"
                  id="name"
                  class="w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
                />
                <p v-if="errors?.car_number" class="mt-1 text-sm text-red-600">
                  {{ errors.car_number[0] }}
                </p>
              </div>
              <div class="mb-2 space-y-1">
                <div class="flex justify-start items-center gap-4">
                  <input
                    type="checkbox"
                    v-model="formCarData.is_default"
                    id="name"
                    class="h-8 w-8 px-4 py-2 text-gray-900 rounded-md shadow-sm bg-white/50"
                  />
                  Is Default ?
                </div>
                <p v-if="errors?.is_default" class="mt-1 text-sm text-red-600">
                  {{ errors.is_default[0] }}
                </p>
              </div>
              <div class="mb-2">
                <button
                  @click.prevent="carNumberCreateHandler"
                  class="bg-orange-500 text-white px-4 py-2 text-center rounded-md w-full"
                >
                  Create Car Number
                </button>
              </div>
            </div>
            <div
              class="absolute -left-[420px] -top-1 rounded-md bg-white p-4 w-[400px]"
              v-if="carNumberListShow"
            >
              <p class="mb-5 text-lg font-medium leading-6 text-gray-900">
                Driver Car Number Table
              </p>
              <table class="w-full border border-gray-200">
                <thead class="border-b-2 border-gray-200 bg-gray-50">
                  <tr>
                    <th class="p-4 text-xs font-medium tracking-wide text-left">
                      Car No.
                    </th>
                    <th class="p-4 text-xs font-medium tracking-wide text-left">
                      is_default
                    </th>
                    <th class="p-4 text-xs font-medium tracking-wide text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr
                    class="bg-white even:bg-gray-50 hover:bg-gray-50"
                    v-for="c in car_numbers?.data"
                    :key="c.id"
                  >
                    <td
                      class="p-4 text-xs text-gray-700 whitespace-nowrap max-w-[140px] overflow-hidden"
                    >
                      {{ c.car_number }}
                    </td>
                    <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                      <p class="" v-if="c.is_default">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="w-6 h-6 text-green-700"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                          />
                        </svg>
                      </p>
                      <p v-else>-</p>
                    </td>

                    <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                      <div class="flex items-center gap-2">
                        <button
                          class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                        >
                          <PencilSquareIcon class="w-5 h-5" />
                        </button>
                        <button
                          class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-red-500 hover:text-white"
                        >
                          <TrashIcon class="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      colspan="4"
                      class="text-xs text-center py-2"
                      v-if="car_numbers?.data?.length == 0"
                    >
                      there isn't data now
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="mb-2 space-y-1">
            <label for="image" class="relative text-sm text-gray-800"
              >Profile
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
          <div class="mb-2 space-y-1">
            <label for="image" class="relative text-sm text-gray-800"
              >Car Image
              <span
                v-if="previewCarImage"
                @click.prevent="removeSelectedCarImage"
                class="text-red-400 text-xs cursor-pointer font-semibold underline absolute top-[10px] left-[391px]"
                ><i class="text-3xl fa-solid fa-circle-minus"></i></span
            ></label>
            <input
              type="file"
              id="image"
              ref="fileCarInput"
              class="hidden"
              @change="handleFileCarChange"
              accept="image/*"
            />
            <div v-if="previewCarImage" class="w-full h-auto">
              <img
                :src="previewCarImage"
                alt="Image preview"
                class="w-full h-auto rounded"
              />
            </div>
            <div
              v-else
              @click.prevent="openFileCarPicker"
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
