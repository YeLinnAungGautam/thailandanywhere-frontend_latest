<template>
  <!-- Main container for places management -->
  <div
    class="bg-white/60 p-6 rounded-lg shadow-sm mb-5 md:col-span-3 hidden md:block"
  >
    <h3 class="text-xl font-medium text-gray-600 tracking-wide mb-3">Places</h3>

    <!-- Search and action buttons section -->
    <div class="flex items-center justify-between mb-8">
      <!-- Search input -->
      <div>
        <input
          v-model="search"
          type="text"
          class="w-3/5 sm:w-3/5 md:w-[300px] mr-3 border px-4 py-2 rounded-md shadow focus:ring-0 focus:outline-none text-gray-500"
          placeholder="Search for places.."
        />
      </div>

      <!-- Action buttons -->
      <div class="space-x-3">
        <Button :leftIcon="ShareIcon" intent="text">Export</Button>
        <Button :leftIcon="PlusIcon" @click.prevent="carModalOpen = true">
          Add places
        </Button>
      </div>
    </div>

    <!-- Places table section -->
    <div class="bg-white/60 p-6 rounded-lg shadow-sm mb-5">
      <div class="overflow-auto rounded-lg shadow mb-5" v-if="!loading">
        <table class="w-full">
          <!-- Table header -->
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

          <!-- Table body -->
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="place in places?.data ?? []"
              :key="place.id"
              class="bg-white even:bg-gray-50 hover:bg-gray-50"
            >
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                {{ place.id }}
              </td>
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                {{ place.name }}
              </td>
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                {{ place.address }}
              </td>
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <button
                    @click.prevent="editModalOpenHandler(place)"
                    class="hover:bg-yellow-500 p-2 bg-white text-blue-500 transition shadow rounded hover:text-white"
                  >
                    <PencilSquareIcon class="w-5 h-5" />
                  </button>
                  <button
                    @click.prevent="onDeleteHandler(place.id)"
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

      <!-- Pagination component -->
      <Pagination
        v-if="!loading && places != null"
        :data="places"
        @change-page="changePage"
      />
    </div>

    <!-- Add/Edit Modal -->
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

        <!-- Place form -->
        <form @submit.prevent="onSubmitHandler" class="mt-2">
          <!-- Name input -->
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

          <!-- City select -->
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
            />
          </div>

          <!-- Address input -->
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
          <div class="space-y-1 mb-2">
            <label for="latitude" class="text-gray-800 text-sm">Latitude</label>
            <input
              type="text"
              v-model="formData.latitude"
              id="latitude"
              class="h-12 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.latitude" class="mt-1 text-sm text-red-600">
              {{ errors.latitude[0] }}
            </p>
          </div>
          <div class="space-y-1 mb-2">
            <label for="longitude" class="text-gray-800 text-sm"
              >Longitude</label
            >
            <input
              type="text"
              v-model="formData.longitude"
              id="longitude"
              class="h-12 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.longitude" class="mt-1 text-sm text-red-600">
              {{ errors.longitude[0] }}
            </p>
          </div>
          <div class="space-y-1 mb-2">
            <label for="radius_km" class="text-gray-800 text-sm"
              >radius_km</label
            >
            <input
              type="text"
              v-model="formData.radius_km"
              id="radius_km"
              class="h-12 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.radius_km" class="mt-1 text-sm text-red-600">
              {{ errors.radius_km[0] }}
            </p>
          </div>

          <!-- Submit button -->
          <div class="text-end">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </DialogPanel>
    </Modal>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import debounce from "lodash/debounce";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import {
  PencilSquareIcon,
  TrashIcon,
  ShareIcon,
  PlusIcon,
} from "@heroicons/vue/24/outline";

// Component imports
import Layout from "./Layout.vue";
import Input from "../components/Input.vue";
import Button from "../components/Button.vue";
import Pagination from "../components/Pagination.vue";
import Modal from "../components/Modal.vue";

// Store imports
import { usePlaceStore } from "../stores/place";
import { useCityStore } from "../stores/city";

// Initialize stores and services
const placeStore = usePlaceStore();
const cityStore = useCityStore();
const toast = useToast();

// Component state
const carModalOpen = ref(false);
const formData = ref({
  name: "",
  city_id: "",
  address: "",
  latitude: "",
  longitude: "",
  radius_km: "",
  id: "",
});
const showEntries = ref(10);
const errors = ref(null);
const search = ref("");

// Store refs
const { places, loading } = storeToRefs(placeStore);
const { cities } = storeToRefs(cityStore);

// Methods for modal handling
const closeAction = () => {
  formData.value = {
    name: "",
    city_id: "",
    address: "",
    latitude: "",
    longitude: "",
    radius_km: "",
    id: "",
  };
  errors.value = null;
  carModalOpen.value = false;
};

// CRUD operations
const addNewHandler = async () => {
  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("city_id", formData.value.city_id);
  frmData.append("address", formData.value.address);

  if (
    formData.value.latitude &&
    formData.value.longitude &&
    formData.value.radius_km
  ) {
    frmData.append("latitude", formData.value.latitude);
    frmData.append("longitude", formData.value.longitude);
    frmData.append("radius_km", formData.value.radius_km);
  }

  try {
    const response = await placeStore.addNewAction(frmData);
    closeAction();
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
  if (
    formData.value.latitude &&
    formData.value.longitude &&
    formData.value.radius_km
  ) {
    frmData.append("latitude", formData.value.latitude);
    frmData.append("longitude", formData.value.longitude);
    frmData.append("radius_km", formData.value.radius_km);
  }

  frmData.append("_method", "PUT");

  try {
    const response = await placeStore.updateAction(frmData, formData.value.id);
    closeAction();
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
  formData.value = {
    id: data.id,
    name: data.name,
    city_id: data.city_id * 1,
    address: data.address,
    latitude: data.latitude,
    longitude: data.longitude,
    radius_km: data.radius_km,
  };
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
        await placeStore.getListAction();
      } catch (error) {
        if (error.response.data.errors) {
          errors.value = error.response.data.errors;
        }
        toast.error(error.response.data.message);
      }
    }
  });
};

// Pagination handler
const changePage = async (url) => {
  await placeStore.getChangePage(url);
};

// Lifecycle hooks and watchers
onMounted(async () => {
  await placeStore.getListAction();
  await cityStore.getSimpleListAction();
});

watch(showEntries, async (newValue) => {
  await placeStore.getListAction({ limit: showEntries.value });
});

// Debounced search
watch(
  search,
  debounce(async (newValue) => {
    await placeStore.getListAction({ search: search.value });
  }, 500)
);
</script>
