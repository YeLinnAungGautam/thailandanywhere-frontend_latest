<template>
  <div
    class="hidden p-6 mb-5 rounded-lg shadow-sm bg-white/60 md:col-span-3 md:block"
  >
    <h3 class="mb-3 text-xl font-medium tracking-wide text-gray-600">City</h3>
    <!-- search input sort filter -->
    <div class="flex items-center justify-between mb-8">
      <div class=""></div>
      <div class="space-x-3">
        <Button :leftIcon="ShareIcon" intent="text"> Export </Button>
        <Button :leftIcon="PlusIcon" @click.prevent="cityModalOpen = true">
          Add City
        </Button>
      </div>
    </div>
    <div class="p-6 mb-5 rounded-lg shadow-sm bg-white/60">
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
        <!-- <div>
          <p class="inline-block mr-2 font-medium text-gray-500">Show</p>
          <select
            v-model="showEntries"
            class="w-16 p-2 border-2 rounded-md focus:outline-none focus:ring-0"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <p class="inline-block ml-2 font-medium text-gray-500">entries</p>
        </div> -->
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
                Image
              </th>
              <th class="p-4 text-xs font-medium tracking-wide text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="city in cities?.data"
              :key="city.id"
              class="bg-white even:bg-gray-50 hover:bg-gray-50"
            >
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                {{ city.id }}
              </td>
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                {{ city.name }}
              </td>
              <td
                class="p-4 text-xs text-gray-700 whitespace-nowrap"
                v-if="city.image"
              >
                <img class="rounded w-14 h-14" :src="city.image" alt="" />
              </td>
              <td
                class="p-4 text-xs text-gray-700 whitespace-nowrap"
                v-if="!city.image"
              >
                -
              </td>
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <button
                    @click.prevent="editModalOpenHandler(city)"
                    class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                  >
                    <PencilSquareIcon class="w-5 h-5" />
                  </button>
                  <button
                    @click.prevent="onDeleteHandler(city.id)"
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
      <Pagination v-if="!loading" :data="cities" @change-page="changePage" />
    </div>
    <!-- modal -->
    <Modal :isOpen="cityModalOpen" @closeModal="cityModalOpen = false">
      <DialogPanel
        class="w-full max-w-md p-4 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl"
      >
        <DialogTitle
          as="h3"
          class="mb-5 text-lg font-medium leading-6 text-gray-900"
        >
          {{ formData.id ? "Edit City" : "Add New City" }}
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
            <label for="image" class="relative text-sm text-gray-800"
              >Image
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
import { useCityStore } from "../stores/city";

const cityStore = useCityStore();
const toast = useToast();

const cityModalOpen = ref(false);
const fileInput = ref(null);
const previewImage = ref(null);
const formData = ref({
  name: "",
  id: "",
  image: null,
});
const showEntries = ref(10);
const errors = ref(null);
const search = ref("");
const { cities, loading } = storeToRefs(cityStore);

const changePage = async (url) => {
  await cityStore.getChangePage(url);
};

const openFilePicker = () => {
  fileInput.value.click();
};

const handleFileChange = (e) => {
  let selectedFile = e.target.files[0];
  if (selectedFile) {
    formData.value.image = e.target.files[0];
    previewImage.value = URL.createObjectURL(selectedFile);
  }
};

const removeSelectedImage = () => {
  formData.value.image = null;
  previewImage.value = null;
};

const addNewHandler = async () => {
  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("image", formData.value.image);
  try {
    const response = await cityStore.addNewAction(frmData);
    formData.value = {
      name: "",
      image: null,
    };
    previewImage.value = null;
    errors.value = null;
    cityModalOpen.value = false;
    await cityStore.getListAction();
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
  frmData.append("image", formData.value.image);
  frmData.append("_method", "PUT");
  try {
    const response = await cityStore.updateAction(frmData, formData.value.id);
    formData.value = {
      name: "",
      image: null,
      id: "",
    };
    previewImage.value = null;
    errors.value = null;
    cityModalOpen.value = false;
    await cityStore.getListAction();
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

const editModalOpenHandler = (data) => {
  formData.value.id = data.id;
  formData.value.name = data.name;
  previewImage.value = data.image;
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
        const response = await cityStore.deleteAction(id);
        toast.success(response.message);
      } catch (error) {
        if (error.response.data.errors) {
          errors.value = error.response.data.errors;
        }
        toast.error(error.response.data.message);
      }
      await cityStore.getListAction();
    }
  });
};

onMounted(async () => {
  await cityStore.getListAction();
});

watch(showEntries, async (newValue) => {
  await cityStore.getListAction({ limit: showEntries.value });
});

watch(search, async (newValue) => {
  await cityStore.getListAction({ search: search.value });
});
</script>
