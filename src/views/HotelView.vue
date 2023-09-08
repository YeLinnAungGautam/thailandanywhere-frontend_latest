<template>
  <div
    class="hidden p-6 mb-5 rounded-lg shadow-sm bg-white/60 md:col-span-3 md:block"
  >
    <h3 class="mb-3 text-xl font-medium tracking-wide text-gray-600">Hotels</h3>

    <!-- modal -->
    <Modal :isOpen="createModalOpen" @closeModal="createModalOpen = false">
      <DialogPanel
        class="max-w-xl p-4 text-left align-middle transition-all transform bg-white rounded-lg shadow-xl"
      >
        <DialogTitle
          as="h3"
          class="mb-5 text-lg font-medium leading-6 text-gray-900"
        >
          {{ formData.id ? "Edit Hotel" : "Add New Hotel" }}
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
          <div>
            <p class="mb-2 text-sm text-gray-800">Cities</p>
            <v-select
              v-model="formData.city_id"
              class="style-chooser"
              :options="citylist ?? []"
              label="name"
              :clearable="false"
              :reduce="(city) => city.id"
              placeholder="Choose City"
            ></v-select>
          </div>
          <div class="mb-2 space-y-1">
            <label for="name" class="text-sm text-gray-800">Place</label>
            <input
              type="text"
              v-model="formData.place"
              id="name"
              class="w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.name" class="mt-1 text-sm text-red-600">
              {{ errors.place[0] }}
            </p>
          </div>
          <div class="mb-2 space-y-1">
            <label for="name" class="text-sm text-gray-800">Legal Name</label>
            <input
              type="text"
              v-model="formData.legal_name"
              id="name"
              class="w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.legal_name" class="mt-1 text-sm text-red-600">
              {{ errors.legal_name[0] }}
            </p>
          </div>
          <div class="mb-2 space-y-1">
            <label for="name" class="text-sm text-gray-800"
              >Contract Due Date</label
            >
            <input
              v-model="formData.contract_due"
              type="date"
              id="title"
              class="w-full h-10 px-4 py-2 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-gray-300"
            />
            <p>{{ formData.contract_due }}</p>
          </div>
          <div class="mb-2 space-y-1">
            <label for="name" class="text-sm text-gray-800">Contracts</label>
            <input
              type="file"
              multiple
              @change="contract_file"
              id="name"
              class="w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.contracts" class="mt-1 text-sm text-red-600">
              {{ errors.contracts[0] }}
            </p>
          </div>
          <div class="text-end flex justify-end items-center">
            <p
              class="text-[#ff613c] cursor-pointer px-2 py-1.5 mr-2 rounded bg-transparent border border-[#ff613c]"
              @click="createModalOpen = false"
            >
              close
            </p>
            <Button type="submit"> Submit </Button>
          </div>
        </form>
      </DialogPanel>
    </Modal>

    <!-- search input sort filter -->
    <div class="flex items-center justify-between mb-8">
      <div class="">
        <input
          type="text"
          v-model="search"
          class="w-3/5 sm:w-3/5 md:w-[300px] mr-3 border px-4 py-2 rounded-md shadow-sm focus:ring-0 focus:outline-none text-gray-500"
          placeholder="Search Hotels..."
        />

        <AdjustmentsHorizontalIcon
          class="inline-block w-6 h-6 mx-2 text-gray-600 cursor-pointer"
        />
      </div>
      <div class="space-x-3">
        <Button :leftIcon="ShareIcon" intent="text"> Export </Button>
        <Button :leftIcon="PlusIcon" @click.prevent="createModalOpen = true">
          Create
        </Button>
      </div>
    </div>
    <div class="mb-5 overflow-auto rounded-lg shadow">
      <table class="w-full">
        <thead class="border-b-2 border-gray-200 bg-gray-50">
          <tr>
            <th class="w-20 p-3 text-sm font-medium tracking-wide text-left">
              No.
            </th>
            <th class="p-3 text-sm font-medium tracking-wide text-left">
              Name
            </th>
            <th class="p-3 text-sm font-medium tracking-wide text-left">
              City
            </th>
            <th class="p-3 text-sm font-medium tracking-wide text-left">
              Place
            </th>
            <th class="p-3 text-sm font-medium tracking-wide text-left w-30">
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
            <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
              {{ r.id }}
            </td>
            <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
              {{ r.name }}
            </td>
            <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
              {{ r.city.name }}
            </td>
            <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
              {{ r.place }}
            </td>
            <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <button
                  @click.prevent="editModalOpenHandler(r)"
                  class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                >
                  <PencilSquareIcon class="w-5 h-5" />
                </button>

                <button
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
    <!-- pagination -->
    <Pagination v-if="!loading" :data="hotels" @change-page="changePage" />
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
  UserGroupIcon,
  UsersIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/vue/24/outline";
import Pagination from "../components/Pagination.vue";
import { onMounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import Modal from "../components/Modal.vue";
import { useCityStore } from "../stores/city";
import { useHotelStore } from "../stores/hotel";

const createModalOpen = ref(false);
const toast = useToast();
const cityStore = useCityStore();
const hotelStore = useHotelStore();

const { hotels, loading } = storeToRefs(hotelStore);

const search = ref("");
const errors = ref([]);

const { cities } = storeToRefs(cityStore);
const citylist = ref([]);

const formData = ref({
  id: "",
  name: "",
  city_id: null,
  place: "",
  legal_name: "",
  contract_due: "",
  contracts: [],
});

const addNewHandler = async () => {
  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("city_id", formData.value.city_id);
  frmData.append("place", formData.value.place);
  frmData.append("legal_name", formData.value.legal_name);
  frmData.append("contract_due", formData.value.contract_due);
  console.log(formData.value.contracts);
  if (formData.value.contracts) {
    // frmData.append("contracts", formData.value.contracts);
    for (let i = 0; i < formData.value.contracts.length; i++) {
      let file = formData.value.contracts[i];
      frmData.append("contracts[" + i + "]", file);
    }
  }

  try {
    const response = await hotelStore.addNewAction(frmData);
    formData.value = {
      name: "",
      city_id: null,
      place: "",
      legal_name: "",
      contract_due: "",
      contracts: [],
    };
    errors.value = null;
    createModalOpen.value = false;
    await hotelStore.getListAction();
    toast.success(response.message);
  } catch (error) {
    if (error.response.data.errors) {
      errors.value = error.response.data.errors;
    }
    toast.error(error.response.data.message);
  }
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
  frmData.append("legal_name", formData.value.legal_name);
  frmData.append("contract_due", formData.value.contract_due);
  if (formData.value.contracts) {
    // frmData.append("contracts", formData.value.contracts);
    for (let i = 0; i < formData.value.contracts.length; i++) {
      let file = formData.value.contracts[i];
      frmData.append("contracts[" + i + "]", file);
    }
  }

  frmData.append("_method", "PUT");
  try {
    const response = await hotelStore.updateAction(frmData, formData.value.id);
    formData.value = {
      name: "",
      city_id: null,
      place: "",
      id: "",
      legal_name: "",
      contract_due: "",
      contracts: "",
    };
    errors.value = null;
    createModalOpen.value = false;
    await hotelStore.getListAction();
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
  formData.value.city_id = data.city.id;
  formData.value.place = data.place;
  formData.value.legal_name = data.legal_name;
  formData.value.contract_due = data.contract_due;
  formData.value.contracts = [];
  console.log(formData.value.contract_due);
  createModalOpen.value = true;
};

const changePage = async (url) => {
  console.log(url);
  await hotelStore.getChangePage(url);
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

onMounted(async () => {
  await hotelStore.getListAction();
  await cityStore.getSimpleListAction();
  citylist.value = cities.value.data;
});

watch(search, async (newValue) => {
  await hotelStore.getListAction({ search: search.value });
});
</script>
