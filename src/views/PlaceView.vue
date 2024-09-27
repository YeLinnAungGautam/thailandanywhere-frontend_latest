<template>
  <div
    class="bg-white/60 p-6 rounded-lg shadow-sm mb-5 md:col-span-3 hidden md:block"
  >
    <h3 class="text-xl font-medium text-gray-600 tracking-wide mb-3">Places</h3>
    <!-- search input sort filter -->
    <div class="flex items-center justify-between mb-8">
      <div class="">
        <input
          v-model="search"
          type="text"
          class="w-3/5 sm:w-3/5 md:w-[300px] mr-3 border px-4 py-2 rounded-md shadow focus:ring-0 focus:outline-none text-gray-500"
          placeholder="Search for places.."
        />
      </div>
      <div class="space-x-3">
        <Button :leftIcon="ShareIcon" intent="text"> Export </Button>
        <Button :leftIcon="PlusIcon" @click.prevent="carModalOpen = true">
          Add places
        </Button>
      </div>
    </div>
    <div class="bg-white/60 p-6 rounded-lg shadow-sm mb-5">
      <div class="overflow-auto rounded-lg shadow mb-5" v-if="!loading">
        <table class="w-full">
          <thead class="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th class="p-4 text-xs font-medium tracking-wide text-left">
                No.
              </th>
              <th class="p-4 text-xs font-medium tracking-wide text-left">
                Name
              </th>

              <th class="p-4 text-xs font-medium tracking-wide text-left">
                Address
              </th>
              <th class="p-4 text-xs font-medium tracking-wide text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="tag in places?.data ?? []"
              :key="tag.id"
              class="bg-white even:bg-gray-50 hover:bg-gray-50"
            >
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                {{ tag.id }}
              </td>
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                {{ tag.name }}
              </td>
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                {{ tag.address }}
              </td>
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <button
                    @click.prevent="editModalOpenHandler(tag)"
                    class="hover:bg-yellow-500 p-2 bg-white text-blue-500 transition shadow rounded hover:text-white"
                  >
                    <PencilSquareIcon class="w-5 h-5" />
                  </button>
                  <button
                    @click.prevent="onDeleteHandler(tag.id)"
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
      <Pagination
        v-if="!loading && places != null"
        :data="places"
        @change-page="changePage"
      />
    </div>
    <!-- modal -->
    <Modal :isOpen="carModalOpen" @closeModal="closeAction">
      <DialogPanel
        class="w-full max-w-md transform rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-5"
        >
          {{ formData.id ? "Edit places" : "Add places" }}
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
          <div class="space-y-1 mb-2">
            <label for="city_id" class="text-gray-800 text-sm">City</label>
            <v-select
              v-model="formData.city_id"
              class="style-chooser"
              :options="cities?.data ?? []"
              label="name"
              :clearable="false"
              :reduce="(d) => d.id"
              placeholder="Choose City"
            ></v-select>
          </div>
          <div class="space-y-1 mb-2">
            <label for="address" class="text-gray-800 text-sm">Address</label>
            <input
              type="text"
              v-model="formData.address"
              id="address"
              class="h-12 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.address" class="mt-1 text-sm text-red-600">
              {{ errors.address[0] }}
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
import { usePlaceStore } from "../stores/place";
import { useCityStore } from "../stores/city";
import debounce from "lodash/debounce";

const placeStore = usePlaceStore();
const cityStore = useCityStore();
const toast = useToast();

const carModalOpen = ref(false);

const closeAction = () => {
  formData.value = {
    name: "",
    city_id: "",
    address: "",
    id: "",
  };
  errors.value = null;
  carModalOpen.value = false;
};

const formData = ref({
  name: "",
  city_id: "",
  address: "",
  id: "",
});
const showEntries = ref(10);
const errors = ref(null);
const search = ref("");
const { places, loading } = storeToRefs(placeStore);
const { cities } = storeToRefs(cityStore);

const changePage = async (url) => {
  await placeStore.getChangePage(url);
};

const addNewHandler = async () => {
  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("city_id", formData.value.city_id);
  frmData.append("address", formData.value.address);
  try {
    const response = await placeStore.addNewAction(frmData);
    formData.value = {
      name: "",
      city_id: "",
      address: "",
    };
    errors.value = null;
    carModalOpen.value = false;
    await placeStore.getListAction();
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
  frmData.append("city_id", formData.value.city_id);
  frmData.append("address", formData.value.address);
  frmData.append("_method", "PUT");
  try {
    const response = await placeStore.updateAction(frmData, formData.value.id);
    formData.value = {
      name: "",
      city_id: "",
      address: "",
      id: "",
    };
    errors.value = null;
    carModalOpen.value = false;
    await placeStore.getListAction();
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
  formData.value.city_id = data.city_id * 1;
  formData.value.address = data.address;
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
        const response = await placeStore.deleteAction(id);
        toast.success(response.message);
      } catch (error) {
        if (error.response.data.errors) {
          errors.value = error.response.data.errors;
        }
        toast.error(error.response.data.message);
      }
      await placeStore.getListAction();
    }
  });
};

onMounted(async () => {
  await placeStore.getListAction();
  await cityStore.getSimpleListAction();
  console.log(places.value, "this is value");
});

watch(showEntries, async (newValue) => {
  await placeStore.getListAction({ limit: showEntries.value });
});

// watch(search, async (newValue) => {
//   await placeStore.getListTagAction({ search: search.value });
// });
watch(
  search,
  debounce(async (newValue) => {
    await placeStore.getListAction({ search: search.value });
  }, 500)
);
</script>
