<script setup>
import Layout from "./Layout.vue";
import Input from "../components/Input.vue";
import Pagination from "../components/Pagination.vue";
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  DocumentTextIcon,
  TicketIcon,
  BuildingOfficeIcon,
  SquaresPlusIcon,
  UserGroupIcon,
  UsersIcon,
  PlusIcon,
  ListBulletIcon,
} from "@heroicons/vue/24/outline";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { onMounted, ref, watch } from "vue";
import Modal from "../components/Modal.vue";
import Button from "../components/Button.vue";
import { storeToRefs } from "pinia";
import { useCategoryStore } from "../stores/category";
import axios from "axios";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";

const toast = useToast();

const categoryStore = useCategoryStore();
const categoryModalOpen = ref(false);
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
const { data, loading } = storeToRefs(categoryStore);

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
    const response = await categoryStore.addNewAction(frmData);
    formData.value = {
      name: "",
      image: null,
    };
    previewImage.value = null;
    errors.value = null;
    categoryModalOpen.value = false;
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
    const response = await categoryStore.updateAction(
      frmData,
      formData.value.id
    );
    formData.value = {
      name: "",
      image: null,
      id: "",
    };
    previewImage.value = null;
    errors.value = null;
    categoryModalOpen.value = false;
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
  await categoryStore.getListAction();
};

const editModalOpenHandler = (data) => {
  formData.value.id = data.id;
  formData.value.name = data.name;
  previewImage.value = data.image;
  categoryModalOpen.value = true;
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
        const response = await categoryStore.deleteAction(id);
        toast.success(response.message);
      } catch (error) {
        if (error.response.data.errors) {
          errors.value = error.response.data.errors;
        }
        toast.error(error.response.data.message);
      }
      await categoryStore.getListAction();
    }
  });
};

const changePage = async (url) => {
  const { data } = await axios.get(url);
  categoryStore.data = data.result;
};

onMounted(async () => {
  await categoryStore.getListAction();
});

watch(showEntries, async (newValue) => {
  await categoryStore.getListAction({ limit: showEntries.value });
});

watch(search, async (newValue) => {
  await categoryStore.getListAction({ search: search.value });
});
</script>

<template>
  <Layout>
    <div class="mb-5 flex items-center justify-between">
      <h3 class="text-2xl font-medium text-gray-600">Blog Categories</h3>
      <div class="space-x-3">
        <router-link to="/blogs">
          <Button :leftIcon="DocumentTextIcon"> Posts </Button>
        </router-link>
        <Button :leftIcon="PlusIcon" @click.prevent="categoryModalOpen = true">
          Add Category
        </Button>
      </div>
    </div>
    <Modal :isOpen="categoryModalOpen" @closeModal="categoryModalOpen = false">
      <DialogPanel
        class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-5"
        >
          {{ formData.id ? "Edit Category" : "Add New Category" }}
        </DialogTitle>
        <form @submit.prevent="onSubmitHandler" class="mt-2">
          <div class="space-y-1 mb-2">
            <label for="name" class="text-gray-800 text-sm">Name</label>
            <input
              type="text"
              v-model="formData.name"
              id="name"
              class="h-12 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-600"
            />
            <p v-if="errors?.name" class="mt-1 text-sm text-red-600">
              {{ errors.name[0] }}
            </p>
          </div>
          <div class="space-y-1 mb-2">
            <label for="image" class="text-gray-800 text-sm"
              >Image
              <span
                v-if="previewImage"
                @click.prevent="removeSelectedImage"
                class="text-red-400 text-xs cursor-pointer font-semibold underline"
                >Remove</span
              ></label
            >
            <input
              type="file"
              id="image"
              ref="fileInput"
              class="hidden"
              @change="handleFileChange"
              accept="image/*"
            />
            <div v-if="previewImage" class="w-[100px] h-[100px]">
              <img :src="previewImage" alt="Image preview" class="rounded" />
            </div>
            <div
              v-else
              @click.prevent="openFilePicker"
              class="cursor-pointer w-[100px] h-[100px] border-2 border-dashed border-gray-400 rounded flex justify-center items-center"
            >
              <span class="text-xs">Select Image</span>
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

    <div class="bg-white/60 p-6 rounded-lg shadow-sm mb-5">
      <!-- search input sort filter -->
      <div class="flex items-center justify-between mb-5">
        <div>
          <p class="inline-block mr-2 text-gray-500 font-medium">Show</p>
          <select
            v-model="showEntries"
            class="border-2 p-2 rounded-md w-16 focus:outline-none focus:ring-0"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <p class="inline-block ml-2 text-gray-500 font-medium">entries</p>
        </div>
        <div class="">
          <input
            v-model.lazy="search"
            type="text"
            class="w-3/5 sm:w-3/5 md:w-[300px] mr-3 border px-4 py-2 rounded-md shadow focus:ring-0 focus:outline-none text-gray-500"
            placeholder="Search for categories.."
          />
        </div>
      </div>
      <div class="overflow-auto rounded-lg shadow mb-5" v-if="!loading">
        <table class="w-full">
          <thead class="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th class="p-4 text-sm font-medium tracking-wide text-left">
                No.
              </th>
              <th class="p-4 text-sm font-medium tracking-wide text-left">
                Name
              </th>
              <th class="p-4 text-sm font-medium tracking-wide text-left">
                Image
              </th>
              <th class="p-4 text-sm font-medium tracking-wide text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="category in data?.data"
              :key="category.id"
              class="bg-white even:bg-gray-50 hover:bg-gray-50"
            >
              <td class="p-4 text-sm text-gray-700 whitespace-nowrap">
                {{ category.id }}
              </td>
              <td class="p-4 text-sm text-gray-700 whitespace-nowrap">
                {{ category.name }}
              </td>
              <td class="p-4 text-sm text-gray-700 whitespace-nowrap">
                <img class="rounded w-14 h-14" :src="category.image" alt="" />
              </td>
              <td class="p-4 text-sm text-gray-700 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <button
                    @click.prevent="editModalOpenHandler(category)"
                    class="hover:bg-yellow-500 p-2 bg-white text-blue-500 transition shadow rounded hover:text-white"
                  >
                    <PencilSquareIcon class="w-5 h-5" />
                  </button>
                  <button
                    @click.prevent="onDeleteHandler(category.id)"
                    class="hover:bg-red-500 p-2 bg-white text-blue-500 transition shadow rounded hover:text-white"
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
      <Pagination v-if="!loading" :data="data" @change-page="changePage" />
    </div>
  </Layout>
</template>
