<template>
  <div
    class="hidden p-6 mb-5 rounded-lg shadow-sm bg-white/60 md:col-span-3 md:block"
  >
    <h3 class="mb-3 text-xl font-medium tracking-wide text-gray-600">
      Airline Ticket
    </h3>

    <!-- modal -->
    <Modal :isOpen="createModalOpen" @closeModal="createModalOpen = false">
      <DialogPanel
        class="w-full max-w-md p-4 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl"
      >
        <DialogTitle
          as="h3"
          class="mb-5 text-lg font-medium leading-6 text-gray-900"
        >
          {{ formData.id ? "Edit Variation" : "Add New Variation" }}
        </DialogTitle>
        <form @submit.prevent="onSubmitHandler" class="mt-2">
          <div class="mb-2 space-y-1">
            <label for="name" class="text-sm text-gray-800">Airline Name</label>
            <v-select
              v-model="formData.airline_id"
              class="style-chooser"
              :options="airList ?? []"
              label="name"
              :clearable="false"
              :reduce="(airline) => airline.id"
              placeholder="Choose Airline"
            ></v-select>
          </div>

          <div class="mb-2 space-y-1">
            <label for="price" class="text-sm text-gray-800"
              >AirTicket Field</label
            >
            <input
              type="text"
              v-model="formData.price"
              id="price"
              class="w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.price" class="mt-1 text-sm text-red-600">
              {{ errors.price[0] }}
            </p>
          </div>
          <div class="col-span-2">
            <p class="text-gray-800 text-sm mb-2">Description</p>
            <textarea
              v-model="formData.description"
              rows="3"
              id="title"
              class="w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
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
          placeholder="Search airtickets..."
        />

        <AdjustmentsHorizontalIcon
          class="inline-block w-6 h-6 mx-2 text-gray-600 cursor-pointer"
        />
      </div>
      <div class="space-x-3">
        <Button :leftIcon="ShareIcon" intent="text"> Export </Button>
        <Button :leftIcon="PlusIcon" @click.prevent="openModal()">
          Create
        </Button>
      </div>
    </div>
    <div class="mb-5 overflow-auto rounded-lg shadow">
      <table class="w-full">
        <thead class="border-b-2 border-gray-200 bg-gray-50">
          <tr>
            <th class="w-20 p-3 text-xs font-medium tracking-wide text-left">
              No.
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              AirLine Name
            </th>

            <th class="p-3 text-xs font-medium tracking-wide text-left">
              AirTicket Field
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left w-30">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            class="bg-white even:bg-gray-50 hover:bg-gray-50"
            v-for="(r, index) in airtickets?.data"
            :key="index"
          >
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ r.id }}
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ r.airline?.name }}
            </td>

            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ r.price }}
            </td>

            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <button
                  @click.prevent="editModalOpenHandler(r)"
                  class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                >
                  <PencilSquareIcon class="w-5 h-5" />
                </button>

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
    <!-- pagination -->
    <Pagination v-if="!loading" :data="airtickets" @change-page="changePage" />
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
import { useAirTicketStore } from "../stores/airticket";
import { useAirLineStore } from "../stores/airline";
import { useAuthStore } from "../stores/auth";

const createModalOpen = ref(false);
const toast = useToast();
const airticketStore = useAirTicketStore();
const airlineStore = useAirLineStore();
const authStore = useAuthStore();

const { airtickets, loading } = storeToRefs(airticketStore);
const { airlines } = storeToRefs(airlineStore);

const search = ref("");
const errors = ref([]);

const openModal = () => {
  createModalOpen.value = true;
  formData.value = {
    id: "",
    airline_id: "",
    price: "",
    description: "",
  };
};

const formData = ref({
  id: "",
  airline_id: "",
  price: "",
  description: "",
});

const addNewHandler = async () => {
  const frmData = new FormData();

  frmData.append("airline_id", formData.value.airline_id);
  frmData.append("price", formData.value.price);
  frmData.append("description", formData.value.description);

  try {
    const response = await airticketStore.addNewAction(frmData);
    formData.value = {
      id: "",
      airline_id: "",
      price: "",
      description: "",
    };
    errors.value = null;
    createModalOpen.value = false;
    await airticketStore.getListAction();
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
  frmData.append("airline_id", formData.value.airline_id);
  frmData.append("price", formData.value.price);
  frmData.append("description", formData.value.description);

  frmData.append("_method", "PUT");
  try {
    const response = await airticketStore.updateAction(
      frmData,
      formData.value.id
    );
    formData.value = {
      id: "",
      airline_id: "",
      price: "",
      description: "",
    };
    errors.value = null;
    createModalOpen.value = false;
    await airticketStore.getListAction();
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
  formData.value.airline_id = data.airline.id;
  formData.value.price = data.price;
  formData.value.description = data.description;
  formData.value.id = data.id;
  createModalOpen.value = true;
};

const changePage = async (url) => {
  console.log(url);
  let data = {
    search: search.value,
  };
  await airticketStore.getChangePage(url, data);
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
        const response = await airticketStore.deleteAction(id);
        toast.success(response.message);
      } catch (error) {
        if (error.response.data.errors) {
          errors.value = error.response.data.errors;
        }
        toast.error(error.response.data.message);
      }
      await airticketStore.getListAction();
    }
  });
};

const airList = ref({});
onMounted(async () => {
  await airticketStore.getListAction();
  await airlineStore.getSimpleListAction();
  airList.value = airlines.value.data;
});

watch(search, async (newValue) => {
  await airticketStore.getListAction({ search: search.value });
});
</script>
