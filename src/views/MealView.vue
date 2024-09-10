<template>
  <div
    class="hidden p-6 mb-5 rounded-lg shadow-sm bg-white/60 md:col-span-3 md:block"
  >
    <div class="flex justify-between items-center">
      <h3 class="text-xl font-medium text-gray-600 tracking-wide mb-3">
        Meals
      </h3>
      <p v-if="importLoading">import process is doing ...</p>
    </div>

    <!-- modal -->
    <Modal :isOpen="createModalOpen" @closeModal="closeModal">
      <DialogPanel
        class="w-full max-w-5xl p-4 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl"
      >
        <DialogTitle
          as="h3"
          class="mb-5 text-lg font-medium leading-6 text-gray-900"
        >
          {{ formData.id ? "Edit Meal" : "Add New Meal" }}
        </DialogTitle>
        <form
          @submit.prevent="onSubmitHandler"
          class="mt-2 grid grid-cols-2 gap-2"
        >
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
            <p class="mb-2 text-sm text-gray-800">Restaurant</p>
            <v-select
              v-model="formData.restaurant_id"
              class="style-chooser"
              :options="restaurant?.data"
              label="name"
              :clearable="false"
              :reduce="(a) => a.id"
              placeholder="Choose Restaurant"
            ></v-select>
          </div>

          <div class="mb-2 space-y-1">
            <label for="meal_price" class="text-sm text-gray-800"
              >Meal Price</label
            >
            <input
              type="text"
              v-model="formData.meal_price"
              id="meal_price"
              class="w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.meal_price" class="mt-1 text-sm text-red-600">
              {{ errors.meal_price[0] }}
            </p>
          </div>
          <div class="mb-2 space-y-1">
            <label for="meal_price" class="text-sm text-gray-800"
              >Extra Price</label
            >
            <input
              type="text"
              v-model="formData.extra_price"
              id="extra_price"
              class="w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.extra_price" class="mt-1 text-sm text-red-600">
              {{ errors.extra_price[0] }}
            </p>
          </div>
          <div class="mb-2 space-y-1">
            <label for="extra_price" class="text-sm text-gray-800"
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
            <label for="meal_price" class="text-sm text-gray-800">Cost</label>
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
            <label for="meal_price" class="text-sm text-gray-800"
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
          <!-- <div class="col-span-2">
            <div class="">
              <div class="flex items-center justify-start mb-2">
                <label class="text-sm block text-red-500 mr-3" for="">
                  Period (don't forget to click add button)</label
                >
              </div>
              <div class="flex items-center justify-between gap-3 mb-3">
                <div class="flex-1">
                  <input
                    v-model="formPeriod.period_name"
                    type="text"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="enter name"
                  />
                </div>
                <div class="flex-1">
                  <input
                    v-model="formPeriod.start_date"
                    type="date"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="enter prices"
                    title="start date"
                  />
                </div>
                <div class="flex-1">
                  <input
                    v-model="formPeriod.end_date"
                    type="date"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    title="end date"
                  />
                </div>
                <div class="flex-1">
                  <input
                    v-model="formPeriod.sale_price"
                    type="number"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="sale price"
                  />
                </div>
                <div class="flex-1">
                  <input
                    v-model="formPeriod.cost_price"
                    type="number"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="cost price"
                  />
                </div>
                <div>
                  <button @click.prevent="addNewPerid" class="">
                    <i
                      class="fa-solid fa-plus text-sm font-semibold px-2 py-1 bg-blue-600 rounded-full shadow text-white"
                    ></i>
                  </button>
                </div>
              </div>
              <div
                v-for="(p, index) in formData.period"
                :key="index"
                class="flex items-center justify-between gap-3 mb-3"
              >
                <div class="flex-1">
                  <input
                    v-model="p.period_name"
                    type="text"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="enter name"
                  />
                </div>
                <div class="flex-1">
                  <input
                    v-model="p.start_date"
                    type="date"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="enter prices"
                    title="start date"
                  />
                </div>
                <div class="flex-1">
                  <input
                    v-model="p.end_date"
                    type="date"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    title="end date"
                  />
                </div>
                <div class="flex-1">
                  <input
                    v-model="p.sale_price"
                    type="number"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="sale price"
                  />
                </div>
                <div class="flex-1">
                  <input
                    v-model="p.cost_price"
                    type="number"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="cost price"
                  />
                </div>
                <div>
                  <button
                    class="text-sm text-red-600"
                    @click.prevent="removeFromPerid(index)"
                  >
                    <i
                      class="fa-solid fa-minus text-sm font-semibold px-2 py-1 bg-red-500 rounded-full shadow text-white"
                    ></i>
                  </button>
                </div>
              </div>
            </div>
          </div> -->
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
                <button
                  @click.prevent="removeImageUpdateImage(formData.id, image.id)"
                  class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
                >
                  <XCircleIcon class="w-8 h-8 font-semibold" />
                </button>
                <img class="h-auto w-full rounded" :src="image.image" alt="" />
              </div>
            </div>
          </div>

          <div class="text-end flex justify-end items-center col-span-2">
            <p
              class="text-[#ff613c] cursor-pointer px-2 py-1.5 mr-2 rounded bg-transparent border border-[#ff613c]"
              @click="closeModal"
            >
              close
            </p>
            <Button type="submit" v-if="!authStore.isAgent"> Submit </Button>
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
          class="w-3/5 sm:w-3/5 md:w-[200px] border px-4 py-1.5 rounded-lg shadow-sm focus:ring-0 focus:outline-none text-gray-500"
          placeholder="Search meals..."
        />
        <v-select
          class="style-chooser min-w-[200px] bg-white"
          :options="restaurant?.data"
          v-model="restaurant_id"
          label="name"
          :clearable="false"
          :reduce="(hotel) => hotel.id"
          placeholder="Choose Restaurant"
        ></v-select>
        <!-- <AdjustmentsHorizontalIcon
          class="inline-block w-6 h-6 mx-2 text-gray-600 cursor-pointer"
        /> -->
        <!-- <input
          type="date"
          v-model="start_date"
          class="w-3/5 sm:w-3/5 md:w-[200px] border px-4 py-1.5 rounded-lg shadow-sm focus:ring-0 focus:outline-none text-gray-500"
          title="start date"
        />
        <input
          type="date"
          v-model="end_date"
          class="w-3/5 sm:w-3/5 md:w-[200px] border px-4 py-1.5 rounded-lg shadow-sm focus:ring-0 focus:outline-none text-gray-500"
          title="end date"
        /> -->
        <button
          class="px-2 py-1.5 bg-[#ff613c] rounded-md text-white"
          @click="searchFunction"
          v-if="start_date && end_date"
        >
          search
        </button>
        <button
          class="px-2 py-1.5 bg-[#ff613c] rounded-md text-white"
          @click="clearFunction"
          v-if="start_date || end_date || search || restaurant_id"
        >
          clear
        </button>
      </div>
      <div class="space-x-3">
        <Button
          :leftIcon="DocumentPlusIcon"
          intent="text"
          @click="importHandler"
        >
          Import
        </Button>
        <Button :leftIcon="ShareIcon" intent="text" @click="exportAction">
          Export
        </Button>
        <Button
          :leftIcon="PlusIcon"
          @click.prevent="createModalOpen = true"
          v-if="!authStore.isAgent"
        >
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
            v-for="(r, index) in meals?.data"
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
              {{ r.meal_price }}
            </td>

            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <button
                  @click.prevent="editModalOpenHandler(r)"
                  class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                >
                  <PencilSquareIcon class="w-5 h-5" v-if="!authStore.isAgent" />
                  <EyeIcon class="w-5 h-5" v-if="authStore.isAgent" />
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
    <Pagination v-if="!loading" :data="meals" @change-page="changePage" />
    <Modal :isOpen="importModal" @closeModal="importModal = false">
      <DialogPanel
        class="w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-5"
        >
          Import Process
        </DialogTitle>
        <form
          class="flex justify-between items-center"
          @submit.prevent="importActionHandler"
        >
          <input type="file" name="" @change="importFileAction" id="" />
          <button
            class="border hover:shadow-md border-gray-400 px-4 py-2 rounded-md"
          >
            Import
          </button>
        </form>
        <div class="mt-5 space-y-3 border border-gray-400 p-4 rounded-md">
          <p class="font-semibold">notice</p>
          <p class="text-xs">- file input must be CSV file .</p>
          <p class="text-xs">- All table data must be have .</p>
          <p class="text-xs">- Import process will take time may be longer</p>
          <p class="text-xs">- Process is working behind .</p>
          <p class="text-xs">
            - When finish process , system will show noti message
          </p>
          <p class="text-xs">
            - When fail the process , system will show noti message
          </p>
        </div>
      </DialogPanel>
    </Modal>
  </div>
</template>

<script setup>
import {
  PencilSquareIcon,
  TrashIcon,
  ShareIcon,
  EyeIcon,
  DocumentPlusIcon,
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
import { useRestaurantStore } from "../stores/restaurant";
import { useMealStore } from "../stores/meal";
import { useAuthStore } from "../stores/auth";
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { Switch } from "@headlessui/vue";
import debounce from "lodash/debounce";

const createModalOpen = ref(false);
const toast = useToast();
const cityStore = useCityStore();
const restaurantStore = useRestaurantStore();
const mealStore = useMealStore();
const authStore = useAuthStore();

const { meals, loading } = storeToRefs(mealStore);

const search = ref("");
const errors = ref([]);

const { restaurant } = storeToRefs(restaurantStore);

const hotelList = ref([]);
const enabled = ref(false);

const formData = ref({
  id: "",
  name: "",
  restaurant_id: null,
  description: "",
  max_person: "",
  is_extra: 0,
  period: [],
  images: [],
  meal_price: "",
  extra_price: "",
  cost: "",
});
const editImagesPreview = ref([]);

const closeModal = () => {
  formData.value = {
    id: "",
    name: "",
    restaurant_id: null,
    is_extra: 0,
    period: [],
    description: "",
    max_person: "",
    images: [],
    meal_price: "",
    extra_price: "",
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
  frmData.append("restaurant_id", formData.value.restaurant_id);
  frmData.append("description", formData.value.description);
  frmData.append("max_person", formData.value.max_person);
  frmData.append("meal_price", formData.value.meal_price);
  frmData.append("extra_price", formData.value.extra_price);
  frmData.append("cost", formData.value.cost);
  frmData.append("is_extra", enabled.value ? 1 : 0);
  if (formData.value.images.length > 0) {
    for (let i = 0; i < formData.value.images.length; i++) {
      let file = formData.value.images[i];
      frmData.append("images[" + i + "]", file);
    }
  }
  if (formData.value.period.length > 0) {
    for (let x = 0; x < formData.value.period.length; x++) {
      frmData.append(
        "periods[" + x + "][period_name]",
        formData.value.period[x].period_name
      );
      frmData.append(
        "periods[" + x + "][start_date]",
        formData.value.period[x].start_date
      );
      frmData.append(
        "periods[" + x + "][end_date]",
        formData.value.period[x].end_date
      );
      frmData.append(
        "periods[" + x + "][sale_price]",
        formData.value.period[x].sale_price
      );
      frmData.append(
        "periods[" + x + "][cost_price]",
        formData.value.period[x].cost_price
      );
    }
  }

  try {
    const response = await mealStore.addNewAction(frmData);
    formData.value = {
      id: "",
      name: "",
      restaurant_id: null,
      description: "",
      max_person: "",
      period: [],
      images: [],
      is_extra: 0,
      meal_price: "",
      extra_price: "",
      cost: "",
    };
    enabled.value = false;
    errors.value = null;
    createModalOpen.value = false;
    imagesPreview.value = [];
    editImagesPreview.value = [];
    await mealStore.getListAction();
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
  frmData.append("restaurant_id", formData.value.restaurant_id);
  frmData.append("description", formData.value.description);
  frmData.append("max_person", formData.value.max_person);
  frmData.append("is_extra", enabled.value ? 1 : 0);
  if (formData.value.images.length > 0) {
    for (let i = 0; i < formData.value.images.length; i++) {
      let file = formData.value.images[i];
      frmData.append("images[" + i + "]", file);
    }
  }
  if (formData.value.period.length > 0) {
    for (let x = 0; x < formData.value.period.length; x++) {
      frmData.append(
        "periods[" + x + "][period_name]",
        formData.value.period[x].period_name
      );
      frmData.append(
        "periods[" + x + "][start_date]",
        formData.value.period[x].start_date
      );
      frmData.append(
        "periods[" + x + "][end_date]",
        formData.value.period[x].end_date
      );
      frmData.append(
        "periods[" + x + "][sale_price]",
        formData.value.period[x].sale_price
      );
      frmData.append(
        "periods[" + x + "][cost_price]",
        formData.value.period[x].cost_price
      );
    }
  }
  frmData.append("meal_price", formData.value.meal_price);
  frmData.append("extra_price", formData.value.extra_price);
  frmData.append("cost", formData.value.cost);

  frmData.append("_method", "PUT");
  try {
    const response = await mealStore.updateAction(frmData, formData.value.id);
    formData.value = {
      id: "",
      name: "",
      restaurant_id: null,
      description: "",
      max_person: "",
      period: [],
      is_extra: 0,
      images: [],
      meal_price: "",
      cost: "",
    };
    enabled.value = false;
    imagesPreview.value = [];
    editImagesPreview.value = [];
    errors.value = null;
    createModalOpen.value = false;
    await mealStore.getListAction();
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
  formData.value.restaurant_id = data.restaurant.id;
  enabled.value = data.is_extra == 1 ? true : false;
  formData.value.max_person = data.max_person;
  formData.value.meal_price = data.meal_price;
  formData.value.extra_price = data.extra_price;
  formData.value.description = data.description;
  formData.value.cost = data.cost;
  createModalOpen.value = true;
  if (data.images.length > 0) {
    for (let i = 0; i < data.images.length; i++) {
      editImagesPreview.value.push(data.images[i]);
    }
  }
  if (data.room_periods.length > 0) {
    for (let i = 0; i < data.room_periods.length; i++) {
      // editImagesPreview.value.push(data.images[i]);
      let dataArray = {
        period_name: data.room_periods[i].period_name,
        start_date: data.room_periods[i].start_date,
        end_date: data.room_periods[i].end_date,
        sale_price: data.room_periods[i].sale_price,
        cost_price: data.room_periods[i].cost_price,
      };
      formData.value.period.push(dataArray);
    }
  }
};

const changePage = async (url) => {
  console.log(url);
  let data = {
    search: search.value,
    restaurant_id: restaurant_id.value,
    period: periodAjj.value,
  };
  await mealStore.getChangePage(url, data);
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
        const response = await mealStore.deleteAction(id);
        toast.success(response.message);
      } catch (error) {
        if (error.response.data.errors) {
          errors.value = error.response.data.errors;
        }
        toast.error(error.response.data.message);
      }
      await mealStore.getListAction();
    }
  });
};

const removeImageUpdateImage = async (id, imageID) => {
  const res = mealStore.deleteImageAction(id, imageID);
  console.log(res, "delete image res");
  closeModal();
  toast.success("deleted image");
  await mealStore.getListAction();
};

const formPeriod = ref({
  period_name: "",
  start_date: "",
  end_date: "",
  sale_price: "",
  cost_price: "",
});

const addNewPerid = () => {
  formData.value.period.push(formPeriod.value);
  formPeriod.value = {
    period_name: "",
    start_date: "",
    end_date: "",
    sale_price: "",
    cost_price: "",
  };
};

const removeFromPerid = (index) => {
  formData.value.period.splice(index, 1);
};

onMounted(async () => {
  await restaurantStore.getSimpleListAction();
  await mealStore.getListAction();
});

const restaurant_id = ref("");
const start_date = ref("");
const end_date = ref("");
const periodAjj = ref("");

const searchFunction = async () => {
  if (start_date.value && end_date.value) {
    periodAjj.value = `${start_date.value} , ${end_date.value}`;

    // await mealStore.getListAction({
    //   search: search.value,
    //   restaurant_id: restaurant_id.value,
    //   period: periodAjj.value,
    // });
    // console.log(periodAjj);
  }
};

const clearFunction = () => {
  restaurant_id.value = "";
  start_date.value = "";
  end_date.value = "";
  search.value = "";
  periodAjj.value = "";
};

const exportAction = async () => {
  const res = await mealStore.downloadExport();
  if (res) {
    window.open(res.result.download_link);
  }
};

// import functions
const importModal = ref(false);
const importHandler = () => {
  importModal.value = !importModal.value;
};
const fileImport = ref(null);
const importFileAction = (e) => {
  let file = e.target.files[0];
  fileImport.value = file;
};
const importActionHandler = async () => {
  const frmData = new FormData();
  frmData.append("file", fileImport.value);
  try {
    importModal.value = false;
    const res = await mealStore.importAction(frmData);
    fileImport.value = null;
    console.log(res);
    toast.success(`meals ${res.message}`);
  } catch (e) {
    // errors.value = e.response.data.errors;
    importModal.value = false;
    toast.error(e.response.data.message);
  }
};

// watch(search, async (newValue) => {
//   await mealStore.getListAction({
//     search: search.value,
//     restaurant_id: restaurant_id.value,
//     period: periodAjj.value,
//   });
// });

watch(
  search,
  debounce(async (newValue) => {
    await mealStore.getListAction({
      search: search.value,
      restaurant_id: restaurant_id.value,
      period: periodAjj.value,
    });
  }, 500)
);
watch(restaurant_id, async (newValue) => {
  await mealStore.getListAction({
    restaurant_id: restaurant_id.value,
    search: search.value,
    period: periodAjj.value,
  });
});
watch(periodAjj, async (newValue) => {
  await mealStore.getListAction({
    restaurant_id: restaurant_id.value,
    search: search.value,
    period: periodAjj.value,
  });
});
</script>
