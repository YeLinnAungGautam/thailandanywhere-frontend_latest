<template>
  <div
    class="bg-white/60 p-6 rounded-lg shadow-sm mb-5 md:col-span-3 hidden md:block"
  >
    <h3 class="text-xl font-medium text-gray-600 tracking-wide mb-3">
      Destination
    </h3>
    <!-- search input sort filter -->
    <div class="flex items-center justify-between mb-8">
      <div class=""></div>
      <div class="space-x-3">
        <Button :leftIcon="ShareIcon" intent="text"> Export </Button>
        <Button :leftIcon="PlusIcon" @click.prevent="carModalOpen = true">
          Add Destination
        </Button>
      </div>
    </div>
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
            v-model="search"
            type="text"
            class="w-3/5 sm:w-3/5 md:w-[300px] mr-3 border px-4 py-2 rounded-md shadow focus:ring-0 focus:outline-none text-gray-500"
            placeholder="Search for destination.."
          />
        </div>
      </div>
      <div class="overflow-auto rounded-lg shadow mb-5" v-if="!loading">
        <table class="w-full">
          <thead class="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th class="p-4 text-sm font-medium tracking-wide text-left">
                Name
              </th>
              <th class="p-4 text-sm font-medium tracking-wide text-left">
                Category
              </th>
              <th class="p-4 text-sm font-medium tracking-wide text-left">
                Description
              </th>
              <th class="p-4 text-sm font-medium tracking-wide text-left">
                Entry_fee
              </th>
              <th class="p-4 text-sm font-medium tracking-wide text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="des in dests?.data"
              :key="des.id"
              class="bg-white even:bg-gray-50 hover:bg-gray-50"
            >
              <td class="p-4 text-sm text-gray-700 whitespace-nowrap">
                {{ des.name }}
              </td>
              <td
                class="p-4 text-sm text-gray-700 whitespace-nowrap"
                v-if="des.category.name"
              >
                {{ des.category.name }}
              </td>
              <td class="p-4 text-sm text-gray-700 whitespace-nowrap">
                {{ des.description }}
              </td>
              <td class="p-4 text-sm text-gray-700 whitespace-nowrap">
                {{ des.entry_fee }}
              </td>
              <td class="p-4 text-sm text-gray-700 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <button
                    @click.prevent="editModalOpenHandler(des)"
                    class="hover:bg-yellow-500 p-2 bg-white text-blue-500 transition shadow rounded hover:text-white"
                  >
                    <PencilSquareIcon class="w-5 h-5" />
                  </button>
                  <button
                    @click.prevent="onDeleteHandler(des.id)"
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
      <Pagination v-if="!loading" :data="dests" @change-page="changePage" />
    </div>
    <!-- modal -->
    <Modal :isOpen="carModalOpen" @closeModal="carModalOpen = false">
      <DialogPanel
        class="w-full max-w-md transform rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-5"
        >
          {{ formData.id ? "Edit Destination" : "Add New Destination" }}
        </DialogTitle>
        <form @submit.prevent="onSubmitHandler" class="mt-2">
          <div class="space-y-1 mb-2">
            <label for="name" class="text-gray-800 text-sm">Name</label>
            <input
              type="text"
              v-model="formData.name"
              id="name"
              class="h-12 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.name" class="mt-1 text-sm text-red-600">
              {{ errors.name[0] }}
            </p>
          </div>
          <div class="space-y-1 mb-4">
            <p class="text-gray-800 text-sm mb-2">Category</p>
            <v-select
              v-model="formData.category_id"
              class="style-chooser"
              :options="products.data ?? []"
              label="name"
              :clearable="false"
              :reduce="(product) => product.id"
              placeholder="Choose category"
            ></v-select>
          </div>
          <div class="space-y-1 mb-2">
            <label for="name" class="text-gray-800 text-sm">Description</label>
            <!-- <input
              type="text"
              v-model="formData.description"
              id="name"
              class="h-12 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
            /> -->
            <textarea
              class="w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
              name=""
              id=""
              cols="30"
              rows="5"
              v-model="formData.description"
            ></textarea>
            <p v-if="errors?.description" class="mt-1 text-sm text-red-600">
              {{ errors.description[0] }}
            </p>
          </div>
          <div class="space-y-1 mb-2">
            <label for="name" class="text-gray-800 text-sm">Entry_fee</label>
            <input
              type="text"
              v-model="formData.entry_fee"
              id="name"
              class="h-12 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.entry_fee" class="mt-1 text-sm text-red-600">
              {{ errors.entry_fee[0] }}
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
import { useDestinationStore } from "../stores/destination";
import { useProductStore } from "../stores/product";

const destStore = useDestinationStore();
const productStore = useProductStore();
const toast = useToast();

const carModalOpen = ref(false);

const formData = ref({
  name: "",
  category_id: "",
  description: "",
  entry_fee: "",
});
const showEntries = ref(10);
const errors = ref(null);
const search = ref("");
const { dests, loading } = storeToRefs(destStore);
const { products } = storeToRefs(productStore);

const changePage = async (url) => {
  await destStore.getChangePage(url);
};

const addNewHandler = async () => {
  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("category_id", formData.value.category_id);
  frmData.append("description", formData.value.description);
  frmData.append("entry_fee", formData.value.entry_fee);

  try {
    const response = await destStore.addNewAction(frmData);
    formData.value = {
      name: "",
      category_id: "",
      description: "",
      entry_fee: "",
    };
    errors.value = null;
    carModalOpen.value = false;
    await destStore.getListAction();
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
  frmData.append("category_id", formData.value.category_id);
  frmData.append("description", formData.value.description);
  frmData.append("entry_fee", formData.value.entry_fee);
  frmData.append("_method", "PUT");
  try {
    const response = await destStore.updateAction(frmData, formData.value.id);
    formData.value = {
      category_id: "",
      description: "",
      entry_fee: "",
    };
    errors.value = null;
    carModalOpen.value = false;
    await destStore.getListAction();
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
  formData.value.name = data.name;
  formData.value.category_id = data.category.id;
  formData.value.description = data.description;
  formData.value.entry_fee = data.entry_fee;
  carModalOpen.value = true;
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
        const response = await destStore.deleteAction(id);
        toast.success(response.message);
      } catch (error) {
        if (error.response.data.errors) {
          errors.value = error.response.data.errors;
        }
        toast.error(error.response.data.message);
      }
      await destStore.getListAction();
    }
  });
};

onMounted(async () => {
  await destStore.getListAction();
  await productStore.getSimpleListAction();
  // console.log(dest.value, "pro");
});

watch(showEntries, async (newValue) => {
  await destStore.getListAction({ limit: showEntries.value });
});

watch(search, async (newValue) => {
  await destStore.getListAction({ search: search.value });
});
</script>
