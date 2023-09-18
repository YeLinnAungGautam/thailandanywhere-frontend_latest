<template>
  <div
    class="hidden p-6 mb-5 rounded-lg shadow-sm bg-white/60 md:col-span-3 md:block"
  >
    <h3 class="mb-3 text-xl font-medium tracking-wide text-gray-600">Rooms</h3>

    <!-- modal -->
    <Modal :isOpen="createModalOpen" @closeModal="createModalOpen = false">
      <DialogPanel
        class="w-full max-w-md p-4 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl"
      >
        <DialogTitle
          as="h3"
          class="mb-5 text-lg font-medium leading-6 text-gray-900"
        >
          {{ formData.id ? "Edit Room" : "Add New Room" }}
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
            <p class="mb-2 text-sm text-gray-800">Hotel</p>
            <v-select
              v-model="formData.hotel_id"
              class="style-chooser"
              :options="hotelList ?? []"
              label="name"
              :clearable="false"
              :reduce="(hotel) => hotel.id"
              placeholder="Choose Hotel"
            ></v-select>
          </div>

          <div class="mb-2 space-y-1">
            <label for="room_price" class="text-sm text-gray-800"
              >Room Price</label
            >
            <input
              type="text"
              v-model="formData.room_price"
              id="room_price"
              class="w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.room_price" class="mt-1 text-sm text-red-600">
              {{ errors.room_price[0] }}
            </p>
          </div>
          <div class="mb-2 space-y-1">
            <label for="room_price" class="text-sm text-gray-800">Cost</label>
            <input
              type="number"
              v-model="formData.cost"
              id="cost"
              class="w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.cost" class="mt-1 text-sm text-red-600">
              {{ errors.cost[0] }}
            </p>
          </div>
          <div class="mb-2 space-y-1">
            <label for="description" class="text-sm text-gray-800"
              >Description</label
            >
            <textarea
              v-model="formData.description"
              rows="3"
              id="description"
              class="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.description" class="mt-1 text-sm text-red-600">
              {{ errors.description[0] }}
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
          placeholder="Search Rooms..."
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
              Description
            </th>
            <th class="p-3 text-sm font-medium tracking-wide text-left">
              Hotel
            </th>
            <th class="p-3 text-sm font-medium tracking-wide text-left">
              Room Price
            </th>
            <th class="p-3 text-sm font-medium tracking-wide text-left">
              Extra Bed Price
            </th>
            <th class="p-3 text-sm font-medium tracking-wide text-left w-30">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            class="bg-white even:bg-gray-50 hover:bg-gray-50"
            v-for="(r, index) in rooms?.data"
            :key="index"
          >
            <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
              {{ r.id }}
            </td>
            <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
              {{ r.name }}
            </td>
            <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
              {{ r.description }}
            </td>
            <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
              {{ r.hotel.name }}
            </td>
            <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
              {{ r.room_price }}
            </td>
            <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
              {{ r.extra_price }}
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
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
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
import { useRoomStore } from "../stores/room";

const createModalOpen = ref(false);
const toast = useToast();
const cityStore = useCityStore();
const hotelStore = useHotelStore();
const roomStore = useRoomStore();

const { rooms, loading } = storeToRefs(roomStore);

const search = ref("");
const errors = ref([]);

const { hotels } = storeToRefs(hotelStore);

const hotelList = ref([]);

const formData = ref({
  id: "",
  name: "",
  hotel_id: null,
  description: "",
  extra_price: "",
  room_price: "",
  cost: "",
});

const addNewHandler = async () => {
  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("hotel_id", formData.value.hotel_id);
  frmData.append("description", formData.value.description);

  frmData.append("room_price", formData.value.room_price);
  frmData.append("cost", formData.value.cost);

  try {
    const response = await roomStore.addNewAction(frmData);
    formData.value = {
      id: "",
      name: "",
      hotel_id: null,
      description: "",
      extra_price: "",
      room_price: "",
      cost: "",
    };
    errors.value = null;
    createModalOpen.value = false;
    await roomStore.getListAction();
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
  frmData.append("hotel_id", formData.value.hotel_id);
  frmData.append("description", formData.value.description);

  frmData.append("room_price", formData.value.room_price);
  frmData.append("cost", formData.value.cost);

  frmData.append("_method", "PUT");
  try {
    const response = await roomStore.updateAction(frmData, formData.value.id);
    formData.value = {
      id: "",
      name: "",
      hotel_id: null,
      description: "",
      extra_price: "",
      room_price: "",
      cost: "",
    };
    errors.value = null;
    createModalOpen.value = false;
    await roomStore.getListAction();
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
  formData.value.hotel_id = data.hotel.id;

  formData.value.room_price = data.room_price;
  formData.value.description = data.description;
  formData.value.cost = data.cost;
  createModalOpen.value = true;
};

const changePage = async (url) => {
  console.log(url);
  await roomStore.getChangePage(url);
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
        const response = await roomStore.deleteAction(id);
        toast.success(response.message);
      } catch (error) {
        if (error.response.data.errors) {
          errors.value = error.response.data.errors;
        }
        toast.error(error.response.data.message);
      }
      await roomStore.getListAction();
    }
  });
};

onMounted(async () => {
  await hotelStore.getSimpleListAction();
  await roomStore.getListAction();
  hotelList.value = hotels.value.data;
});

watch(search, async (newValue) => {
  await roomStore.getListAction({ search: search.value });
});
</script>
