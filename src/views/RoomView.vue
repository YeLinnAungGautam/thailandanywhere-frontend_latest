<template>
  <div
    class="hidden p-6 mb-5 rounded-lg shadow-sm bg-white/60 md:col-span-3 md:block"
  >
    <h3 class="mb-3 text-xl font-medium tracking-wide text-gray-600">Rooms</h3>

    <!-- modal -->
    <Modal :isOpen="createModalOpen" @closeModal="closeModal">
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
            <label for="room_price" class="text-sm text-gray-800"
              >Max Preson</label
            >
            <input
              type="text"
              v-model="formData.max_person"
              id="max_person"
              class="w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.max_person" class="mt-1 text-sm text-red-600">
              {{ errors.max_person[0] }}
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
          <div class="mb-2 space-y-1 flex justify-start items-center gap-3">
            <label for="room_price" class="text-sm text-gray-800"
              >Is Extra ?</label
            >
            <Switch
              v-model="enabled"
              :class="enabled ? ' bg-orange-600' : 'bg-gray-500'"
              class="relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            >
              <span class="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                :class="enabled ? 'translate-x-9' : 'translate-x-0'"
                class="pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
              />
            </Switch>
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
          <div class="mb-2 space-y-1">
            <label for="description" class="text-sm text-gray-800"
              >Images</label
            >
            <input
              multiple
              type="file"
              name=""
              ref="imagesInput"
              id=""
              @change="handlerImagesFileChange"
              class="hidden w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
              accept="image/*"
            />
            <button
              class="text-sm text-blue-600 ml-4"
              @click.prevent="openFileImagePicker"
            >
              <i
                class="fa-solid fa-plus text-sm font-semibold px-2 py-1 bg-blue-600 rounded-full shadow text-white"
              ></i>
            </button>
            <div
              class="grid grid-cols-3 gap-2"
              v-if="imagesPreview.length != 0"
            >
              <div
                class="relative"
                v-for="(image, index) in imagesPreview"
                :key="index"
              >
                <button
                  @click.prevent="removeImageSelectImage(index)"
                  class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
                >
                  <XCircleIcon class="w-8 h-8 font-semibold" />
                </button>

                <img class="h-auto w-full rounded" :src="image" alt="" />
              </div>
            </div>
            <div
              class="grid grid-cols-3 gap-2"
              v-if="editImagesPreview.length != 0 && imagesPreview.length == 0"
            >
              <div
                class="relative"
                v-for="(image, index) in editImagesPreview"
                :key="index"
              >
                <img class="h-auto w-full rounded" :src="image" alt="" />
              </div>
            </div>
          </div>

          <div class="text-end flex justify-end items-center">
            <p
              class="text-[#ff613c] cursor-pointer px-2 py-1.5 mr-2 rounded bg-transparent border border-[#ff613c]"
              @click="closeModal"
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
      <div class="flex justify-start items-center space-x-2">
        <input
          type="text"
          v-model="search"
          class="w-3/5 sm:w-3/5 md:w-[300px] mr-3 border px-4 py-2 rounded-lg shadow-sm focus:ring-0 focus:outline-none text-gray-500"
          placeholder="Search Rooms..."
        />
        <v-select
          class="style-chooser min-w-[250px] bg-white"
          :options="hotelList ?? []"
          v-model="hotel_id"
          label="name"
          :clearable="false"
          :reduce="(hotel) => hotel.id"
          placeholder="Choose Hotel"
        ></v-select>
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
            <th class="w-20 p-3 text-xs font-medium tracking-wide text-left">
              No.
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              Name
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              Description
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              Hotel
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              Room Price
            </th>

            <th class="p-3 text-xs font-medium tracking-wide text-left w-30">
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
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ r.id }}
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ r.name }}
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ limitedText(r.description) }}
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ r.hotel?.name }}
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ r.room_price }}
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
    <Pagination v-if="!loading" :data="rooms" @change-page="changePage" />
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
import { useAuthStore } from "../stores/auth";
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { Switch } from "@headlessui/vue";

const createModalOpen = ref(false);
const toast = useToast();
const cityStore = useCityStore();
const hotelStore = useHotelStore();
const roomStore = useRoomStore();
const authStore = useAuthStore();

const { rooms, loading } = storeToRefs(roomStore);

const search = ref("");
const errors = ref([]);

const { hotels } = storeToRefs(hotelStore);

const hotelList = ref([]);
const enabled = ref(false);

const formData = ref({
  id: "",
  name: "",
  hotel_id: null,
  description: "",
  max_person: "",
  is_extra: 0,
  images: [],
  room_price: "",
  cost: "",
});
const editImagesPreview = ref([]);

const closeModal = () => {
  formData.value = {
    id: "",
    name: "",
    hotel_id: null,
    is_extra: 0,
    description: "",
    max_person: "",
    images: [],
    room_price: "",
    cost: "",
  };
  errors.value = null;
  enabled.value = false;
  createModalOpen.value = false;
  imagesPreview.value = [];
  editImagesPreview.value = [];
};

const limitedText = (text) => {
  if (text != "") {
    if (text?.length <= 30) {
      return text;
    } else {
      return text?.slice(0, 30) + "...";
    }
  }
};

const addNewHandler = async () => {
  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("hotel_id", formData.value.hotel_id);
  frmData.append("description", formData.value.description);
  frmData.append("max_person", formData.value.max_person);
  frmData.append("room_price", formData.value.room_price);
  frmData.append("cost", formData.value.cost);
  frmData.append("is_extra", enabled.value ? 1 : 0);
  if (formData.value.images.length > 0) {
    for (let i = 0; i < formData.value.images.length; i++) {
      let file = formData.value.images[i];
      frmData.append("images[" + i + "]", file);
    }
  }

  try {
    const response = await roomStore.addNewAction(frmData);
    formData.value = {
      id: "",
      name: "",
      hotel_id: null,
      description: "",
      max_person: "",
      images: [],
      is_extra: 0,
      room_price: "",
      cost: "",
    };
    enabled.value = false;
    errors.value = null;
    createModalOpen.value = false;
    imagesPreview.value = [];
    editImagesPreview.value = [];
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
  frmData.append("max_person", formData.value.max_person);
  frmData.append("is_extra", enabled.value ? 1 : 0);
  if (formData.value.images.length > 0) {
    for (let i = 0; i < formData.value.images.length; i++) {
      let file = formData.value.images[i];
      frmData.append("images[" + i + "]", file);
    }
  }
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
      max_person: "",
      is_extra: 0,
      images: [],
      room_price: "",
      cost: "",
    };
    enabled.value = false;
    imagesPreview.value = [];
    editImagesPreview.value = [];
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

const imagesPreview = ref([]);
const imagesInput = ref(null);
const openFileImagePicker = () => {
  imagesInput.value.click();
};

const handlerImagesFileChange = (e) => {
  console.log(e.target.files);
  let selectedFile = e.target.files;
  if (selectedFile) {
    for (let index = 0; index < selectedFile.length; index++) {
      formData.value.images.push(selectedFile[index]);
      imagesPreview.value.push(URL.createObjectURL(selectedFile[index]));
    }
  }
};

const removeImageSelectImage = (index) => {
  formData.value.images.splice(index, 1);
  imagesPreview.value.splice(index, 1);
  console.log(imagesPreview.value);
};
const removeEditImageSelectImage = (index) => {
  formData.value.images.splice(index, 1);
  editImagesPreview.value.splice(index, 1);
  console.log(editImagesPreview.value);
};

const editModalOpenHandler = (data) => {
  console.log(data);
  formData.value.id = data.id;
  formData.value.name = data.name;
  formData.value.hotel_id = data.hotel.id;
  enabled.value = data.is_extra == 1 ? true : false;
  formData.value.max_person = data.max_person;
  formData.value.room_price = data.room_price;
  formData.value.description = data.description;
  formData.value.cost = data.cost;
  createModalOpen.value = true;
  if (data.images.length > 0) {
    for (let i = 0; i < data.images.length; i++) {
      editImagesPreview.value.push(data.images[i].image);
    }
  }
};

const changePage = async (url) => {
  console.log(url);
  let data = {
    search: search.value,
    hotel_id: hotel_id.value,
  };
  await roomStore.getChangePage(url, data);
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

const hotel_id = ref("");

watch(search, async (newValue) => {
  await roomStore.getListAction({
    search: search.value,
    hotel_id: hotel_id.value,
  });
});
watch(hotel_id, async (newValue) => {
  await roomStore.getListAction({
    hotel_id: hotel_id.value,
    search: search.value,
  });
});
</script>
