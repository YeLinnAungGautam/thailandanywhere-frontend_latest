<template>
  <Layout>
    <div class="p-6 mb-5 rounded-lg shadow-sm bg-white/60">
      <!-- Header -->
      <div class="flex justify-between items-center mb-5">
        <div class="flex items-center gap-3">
          <button
            @click="goBack"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              class="w-6 h-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <h3 class="text-2xl font-medium text-gray-700 tracking-wide">
            {{ isEditMode ? "Edit Room" : "Add New Room" }}
          </h3>
        </div>

        <!-- Tab Navigation -->
        <div class="flex justify-end items-center gap-2 text-xs">
          <button
            class="px-4 py-2 cursor-pointer rounded-md transition-colors"
            @click="currentTab = 'basic'"
            :class="
              currentTab === 'basic'
                ? 'bg-[#ff613c] text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            "
          >
            Basic Info
          </button>
          <button
            class="px-4 py-2 cursor-pointer rounded-md transition-colors"
            @click="currentTab = 'amenities'"
            :class="
              currentTab === 'amenities'
                ? 'bg-[#ff613c] text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            "
          >
            Room Amenities
          </button>
          <button
            class="px-4 py-2 cursor-pointer rounded-md transition-colors"
            @click="currentTab = 'periods'"
            :class="
              currentTab === 'periods'
                ? 'bg-[#ff613c] text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            "
          >
            Periods
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center h-64">
        <div
          class="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"
        ></div>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="onSubmitHandler" class="space-y-6">
        <!-- Basic Information Tab -->
        <div v-show="currentTab === 'basic'" class="grid grid-cols-2 gap-4">
          <!-- Name -->
          <div class="space-y-1">
            <label for="name" class="text-sm text-gray-800 font-medium"
              >Room Name <span class="text-red-500">*</span></label
            >
            <input
              type="text"
              v-model="formData.name"
              id="name"
              required
              class="w-full h-10 text-sm px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-orange-400"
            />
            <p v-if="errors?.name" class="text-sm text-red-600">
              {{ errors.name[0] }}
            </p>
          </div>

          <!-- Hotel Selection -->
          <div class="space-y-1">
            <label class="text-sm text-gray-800 font-medium"
              >Hotel <span class="text-red-500">*</span></label
            >
            <div class="relative">
              <input
                type="text"
                v-model="hotelSearchQuery"
                @input="searchHotels"
                @focus="showHotelDropdown = true"
                required
                class="w-full h-10 text-sm px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-orange-400"
                placeholder="Search and select hotel..."
              />
              <div
                v-if="showHotelDropdown && hotelResults.length > 0"
                class="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1"
              >
                <div
                  v-for="hotel in hotelResults"
                  :key="hotel.id"
                  @click="selectHotel(hotel)"
                  class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {{ hotel.name }}
                </div>
              </div>
              <button
                v-if="selectedHotel"
                @click="clearHotelSelection"
                type="button"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>

          <!-- Room Price -->
          <div class="space-y-1" v-if="!authStore.isAgent">
            <label for="room_price" class="text-sm text-gray-800 font-medium"
              >Room Price <span class="text-red-500">*</span></label
            >
            <input
              type="number"
              v-model="formData.room_price"
              id="room_price"
              required
              class="w-full h-10 text-sm px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-orange-400"
            />
            <p v-if="errors?.room_price" class="text-sm text-red-600">
              {{ errors.room_price[0] }}
            </p>
          </div>

          <!-- Max Person -->
          <div class="space-y-1">
            <label for="max_person" class="text-sm text-gray-800 font-medium"
              >Max Person <span class="text-red-500">*</span></label
            >
            <input
              type="number"
              v-model="formData.max_person"
              id="max_person"
              required
              class="w-full h-10 text-sm px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-orange-400"
            />
            <p v-if="errors?.max_person" class="text-sm text-red-600">
              {{ errors.max_person[0] }}
            </p>
          </div>

          <!-- Cost -->
          <div class="space-y-1" v-if="!authStore.isAgent">
            <label for="cost" class="text-sm text-gray-800 font-medium"
              >Cost</label
            >
            <input
              type="number"
              v-model="formData.cost"
              id="cost"
              class="w-full h-10 text-sm px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-orange-400"
            />
          </div>

          <!-- Owner Price -->
          <div class="space-y-1">
            <label for="owner_price" class="text-sm text-gray-800 font-medium"
              >Walk-in Price (Owner Price)</label
            >
            <input
              type="number"
              v-model="formData.owner_price"
              id="owner_price"
              class="w-full h-10 text-sm px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-orange-400"
            />
          </div>

          <!-- Agent Price -->
          <div class="space-y-1">
            <label for="agent_price" class="text-sm text-gray-800 font-medium"
              >Agent Price</label
            >
            <input
              type="number"
              v-model="formData.agent_price"
              id="agent_price"
              class="w-full h-10 text-sm px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-orange-400"
            />
          </div>

          <!-- Room Size -->
          <div class="space-y-1">
            <label for="room_size" class="text-sm text-gray-800 font-medium"
              >Room Size</label
            >
            <input
              type="text"
              v-model="formData.room_size"
              id="room_size"
              placeholder="e.g., 25 sqm"
              class="w-full h-10 text-sm px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-orange-400"
            />
          </div>

          <!-- Room Features Toggles -->
          <div
            class="col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center justify-between gap-3">
              <label class="text-sm text-gray-800 font-medium"
                >Is Extra Bed?</label
              >
              <Switch
                v-model="formData.is_extra"
                :class="formData.is_extra ? 'bg-orange-600' : 'bg-gray-400'"
                class="relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
              >
                <span
                  aria-hidden="true"
                  :class="formData.is_extra ? 'translate-x-9' : 'translate-x-0'"
                  class="pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                />
              </Switch>
            </div>

            <div class="flex items-center justify-between gap-3">
              <label class="text-sm text-gray-800 font-medium"
                >Has Breakfast?</label
              >
              <Switch
                v-model="formData.has_breakfast"
                :class="
                  formData.has_breakfast ? 'bg-orange-600' : 'bg-gray-400'
                "
                class="relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
              >
                <span
                  aria-hidden="true"
                  :class="
                    formData.has_breakfast ? 'translate-x-9' : 'translate-x-0'
                  "
                  class="pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                />
              </Switch>
            </div>

            <div class="flex items-center justify-between gap-3">
              <label class="text-sm text-gray-800 font-medium"
                >Double Bed?</label
              >
              <Switch
                v-model="formData.is_double"
                :class="formData.is_double ? 'bg-orange-600' : 'bg-gray-400'"
                class="relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
              >
                <span
                  aria-hidden="true"
                  :class="
                    formData.is_double ? 'translate-x-9' : 'translate-x-0'
                  "
                  class="pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                />
              </Switch>
            </div>

            <div class="flex items-center justify-between gap-3">
              <label class="text-sm text-gray-800 font-medium">Twin Bed?</label>
              <Switch
                v-model="formData.is_twin"
                :class="formData.is_twin ? 'bg-orange-600' : 'bg-gray-400'"
                class="relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
              >
                <span
                  aria-hidden="true"
                  :class="formData.is_twin ? 'translate-x-9' : 'translate-x-0'"
                  class="pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                />
              </Switch>
            </div>

            <div class="flex items-center justify-between gap-3">
              <label class="text-sm text-gray-800 font-medium"
                >Show on Website?</label
              >
              <Switch
                v-model="formData.is_show_on"
                :class="formData.is_show_on ? 'bg-orange-600' : 'bg-gray-400'"
                class="relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
              >
                <span
                  aria-hidden="true"
                  :class="
                    formData.is_show_on ? 'translate-x-9' : 'translate-x-0'
                  "
                  class="pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                />
              </Switch>
            </div>
          </div>

          <!-- Description -->
          <div class="col-span-2 space-y-1">
            <label for="description" class="text-sm text-gray-800 font-medium"
              >Description</label
            >
            <textarea
              v-model="formData.description"
              rows="4"
              id="description"
              class="w-full px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-orange-400"
            />
          </div>

          <!-- Images -->
          <div class="col-span-2 space-y-1">
            <label class="text-sm text-gray-800 font-medium">Room Images</label>
            <input
              multiple
              type="file"
              ref="imagesInput"
              @change="handleImagesChange"
              class="hidden"
              accept="image/*"
            />
            <button
              type="button"
              @click="openFilePicker"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <i class="fa-solid fa-plus mr-2"></i>
              Add Images
            </button>

            <div
              v-if="imagesPreview.length > 0"
              class="grid grid-cols-3 md:grid-cols-4 gap-3 mt-3"
            >
              <div
                v-for="(image, index) in imagesPreview"
                :key="index"
                class="relative group"
              >
                <img
                  :src="image"
                  class="w-full h-32 object-cover rounded-lg"
                  alt="Room image"
                />
                <button
                  type="button"
                  @click="removeImage(index)"
                  class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XCircleIcon class="w-5 h-5" />
                </button>
              </div>
            </div>

            <div
              v-if="editImagesPreview.length > 0 && imagesPreview.length === 0"
              class="grid grid-cols-3 md:grid-cols-4 gap-3 mt-3"
            >
              <div
                v-for="(image, index) in editImagesPreview"
                :key="index"
                class="relative group"
              >
                <img
                  :src="image.image"
                  class="w-full h-32 object-cover rounded-lg"
                  alt="Room image"
                />
                <button
                  type="button"
                  @click="removeEditImage(formData.id, image.id)"
                  class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XCircleIcon class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Room Amenities Tab -->
        <div v-show="currentTab === 'amenities'">
          <RoomAmenitiesComponent
            :room-data="formData"
            :initial-amenities="formData.room_amen"
            @update:amenities="(val) => (formData.room_amen = val)"
          />
        </div>

        <!-- Periods Tab -->
        <div v-show="currentTab === 'periods'" class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700"
              >Room Periods (Pricing by Date Range)</label
            >
          </div>

          <!-- Add Period Form -->
          <div class="grid grid-cols-6 gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              v-model="newPeriod.period_name"
              type="text"
              placeholder="Period name"
              class="h-10 text-sm px-4 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:border-orange-400"
            />
            <input
              v-model="newPeriod.start_date"
              type="date"
              class="h-10 text-sm px-4 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:border-orange-400"
            />
            <input
              v-model="newPeriod.end_date"
              type="date"
              class="h-10 text-sm px-4 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:border-orange-400"
            />
            <input
              v-if="!authStore.isAgent"
              v-model="newPeriod.sale_price"
              type="number"
              placeholder="Sale price"
              class="h-10 text-sm px-4 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:border-orange-400"
            />
            <input
              v-if="!authStore.isAgent"
              v-model="newPeriod.cost_price"
              type="number"
              placeholder="Cost price"
              class="h-10 text-sm px-4 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:border-orange-400"
            />
            <input
              v-model="newPeriod.agent_price"
              type="number"
              placeholder="Agent price"
              class="h-10 text-sm px-4 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:border-orange-400"
            />
            <button
              type="button"
              @click="addPeriod"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>

          <!-- Periods List -->
          <div v-if="formData.period.length > 0" class="space-y-3">
            <div
              v-for="(period, index) in formData.period"
              :key="index"
              class="grid grid-cols-6 gap-3 p-3 bg-white border border-gray-200 rounded-lg"
            >
              <input
                v-model="period.period_name"
                type="text"
                class="h-10 text-sm px-4 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-orange-400"
              />
              <input
                v-model="period.start_date"
                type="date"
                class="h-10 text-sm px-4 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-orange-400"
              />
              <input
                v-model="period.end_date"
                type="date"
                class="h-10 text-sm px-4 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-orange-400"
              />
              <input
                v-if="!authStore.isAgent"
                v-model="period.sale_price"
                type="number"
                class="h-10 text-sm px-4 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-orange-400"
              />
              <input
                v-if="!authStore.isAgent"
                v-model="period.cost_price"
                type="number"
                class="h-10 text-sm px-4 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-orange-400"
              />
              <input
                v-model="period.agent_price"
                type="number"
                class="h-10 text-sm px-4 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-orange-400"
              />
              <div class="flex gap-2">
                <button
                  type="button"
                  @click="copyPeriod(index)"
                  class="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <i class="fa-solid fa-copy"></i>
                </button>
                <button
                  type="button"
                  @click="removePeriod(index)"
                  class="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  <i class="fa-solid fa-minus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end items-center gap-3 pt-6 border-t">
          <button
            type="button"
            @click="goBack"
            class="px-6 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="saving">
              <i class="fa-solid fa-spinner fa-spin mr-2"></i>
              Saving...
            </span>
            <span v-else>
              {{ isEditMode ? "Update Room" : "Create Room" }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </Layout>
</template>

<script setup>
import Layout from "./Layout.vue";
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { Switch } from "@headlessui/vue";
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { useRoomStore } from "../stores/room";
import { useHotelStore } from "../stores/hotel";
import { useAuthStore } from "../stores/auth";
import RoomAmenitiesComponent from "./RoomPart/Amenties.vue";
import debounce from "lodash/debounce";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const roomStore = useRoomStore();
const hotelStore = useHotelStore();
const authStore = useAuthStore();

// State
const loading = ref(false);
const saving = ref(false);
const currentTab = ref("basic");
const errors = ref({});

// Check if edit mode
const isEditMode = computed(() => !!route.params.id);

// Form data
const formData = ref({
  id: null,
  name: "",
  hotel_id: null,
  description: "",
  max_person: "",
  room_price: "",
  cost: "",
  agent_price: "",
  owner_price: "",
  room_size: "",
  is_extra: false,
  has_breakfast: false,
  is_double: false,
  is_twin: false,
  is_show_on: false,
  images: [],
  room_amen: [],
  period: [],
});

// Hotel search
const hotelSearchQuery = ref("");
const hotelResults = ref([]);
const showHotelDropdown = ref(false);
const selectedHotel = ref(null);

// Images
const imagesInput = ref(null);
const imagesPreview = ref([]);
const editImagesPreview = ref([]);

// Period
const newPeriod = ref({
  period_name: "",
  start_date: "",
  end_date: "",
  sale_price: "",
  cost_price: "",
  agent_price: "",
});

// Hotel search
const searchHotels = debounce(async (event) => {
  const query = {
    search: event.target.value,
    limit: 10,
  };

  try {
    const response = await hotelStore.getListAction(query);
    hotelResults.value = response.result.data || [];
    showHotelDropdown.value = true;
  } catch (error) {
    console.error("Hotel search error:", error);
    hotelResults.value = [];
  }
}, 300);

const selectHotel = (hotel) => {
  selectedHotel.value = hotel;
  hotelSearchQuery.value = hotel.name;
  formData.value.hotel_id = hotel.id;
  showHotelDropdown.value = false;
};

const clearHotelSelection = () => {
  selectedHotel.value = null;
  hotelSearchQuery.value = "";
  formData.value.hotel_id = null;
};

// Images
const openFilePicker = () => {
  imagesInput.value.click();
};

const handleImagesChange = (e) => {
  const files = e.target.files;
  if (files) {
    for (let i = 0; i < files.length; i++) {
      formData.value.images.push(files[i]);
      imagesPreview.value.push(URL.createObjectURL(files[i]));
    }
  }
};

const removeImage = (index) => {
  formData.value.images.splice(index, 1);
  imagesPreview.value.splice(index, 1);
};

const removeEditImage = async (roomId, imageId) => {
  try {
    await roomStore.deleteImageAction(roomId, imageId);
    toast.success("Image deleted");
    editImagesPreview.value = editImagesPreview.value.filter(
      (img) => img.id !== imageId,
    );
  } catch (error) {
    toast.error("Failed to delete image");
  }
};

// Periods
const addPeriod = () => {
  if (newPeriod.value.period_name.trim()) {
    formData.value.period.push({ ...newPeriod.value });
    newPeriod.value = {
      period_name: "",
      start_date: "",
      end_date: "",
      sale_price: "",
      cost_price: "",
      agent_price: "",
    };
  }
};

const removePeriod = (index) => {
  formData.value.period.splice(index, 1);
};

const copyPeriod = (index) => {
  const period = formData.value.period[index];
  newPeriod.value = {
    period_name: period.period_name,
    start_date: "",
    end_date: "",
    sale_price: period.sale_price,
    cost_price: period.cost_price,
    agent_price: period.agent_price,
  };
};

// Load room data for edit
const loadRoomData = async () => {
  loading.value = true;
  try {
    const response = await roomStore.detailAction(route.params.id);
    const data = response.result;

    formData.value.id = data.id;
    formData.value.name = data.name;
    formData.value.hotel_id = data.hotel.id;
    formData.value.description = data.description;
    formData.value.max_person = data.max_person;
    formData.value.room_price = data.room_price;
    formData.value.cost = data.cost;
    formData.value.agent_price = data.agent_price;
    formData.value.owner_price = data.owner_price;
    formData.value.room_size = data.meta?.room_size || "";
    formData.value.is_extra = data.is_extra == 1;
    formData.value.has_breakfast = data.has_breakfast == 1;
    formData.value.is_double = data.meta?.is_double == 1;
    formData.value.is_twin = data.meta?.is_twin == 1;
    formData.value.is_show_on = data.meta?.is_show_on == 1;

    // Hotel
    selectedHotel.value = data.hotel;
    hotelSearchQuery.value = data.hotel?.name;

    // Images
    if (data.images?.length > 0) {
      editImagesPreview.value = [...data.images];
    }

    // Amenities
    if (data.amenities?.length > 0) {
      formData.value.room_amen = data.amenities.map((amenity) => ({
        title: amenity.title,
        list: (amenity.list || []).map((item) => ({
          list_name: typeof item === "string" ? item : item.list_name,
        })),
      }));
    }

    // Periods
    if (data.room_periods?.length > 0) {
      formData.value.period = data.room_periods.map((period) => ({
        period_name: period.period_name,
        start_date: period.start_date,
        end_date: period.end_date,
        sale_price: period.sale_price,
        cost_price: period.cost_price,
        agent_price: period.agent_price,
      }));
    }
  } catch (error) {
    toast.error("Failed to load room data");
    // router.push({ name: "rooms" });
  } finally {
    loading.value = false;
  }
};

// Submit form
const onSubmitHandler = async () => {
  console.log("click from some hwere");
  saving.value = true;
  errors.value = {};

  const frmData = new FormData();

  // Basic fields
  frmData.append("name", formData.value.name);
  frmData.append("hotel_id", formData.value.hotel_id);
  frmData.append("description", formData.value.description);
  frmData.append("max_person", formData.value.max_person);
  frmData.append("room_price", formData.value.room_price);
  frmData.append("cost", formData.value.cost || 0);
  frmData.append("agent_price", formData.value.agent_price || 0);
  frmData.append("owner_price", formData.value.owner_price || 0);

  // Boolean fields
  frmData.append("is_extra", formData.value.is_extra ? 1 : 0);
  frmData.append("has_breakfast", formData.value.has_breakfast ? 1 : 0);
  frmData.append("meta[is_double]", formData.value.is_double ? 1 : 0);
  frmData.append("meta[is_twin]", formData.value.is_twin ? 1 : 0);
  frmData.append("meta[is_show_on]", formData.value.is_show_on ? 1 : 0);
  frmData.append("meta[room_size]", formData.value.room_size);

  // Images
  if (formData.value.images.length > 0) {
    for (let i = 0; i < formData.value.images.length; i++) {
      frmData.append(`images[${i}]`, formData.value.images[i]);
    }
  }

  // Amenities
  if (formData.value.room_amen.length > 0) {
    for (let i = 0; i < formData.value.room_amen.length; i++) {
      frmData.append(
        `amenities[${i}][title]`,
        formData.value.room_amen[i].title,
      );
      for (let l = 0; l < formData.value.room_amen[i].list.length; l++) {
        frmData.append(
          `amenities[${i}][list][${l}]`,
          formData.value.room_amen[i].list[l].list_name,
        );
      }
    }
  }

  // Periods
  if (formData.value.period.length > 0) {
    for (let x = 0; x < formData.value.period.length; x++) {
      frmData.append(
        `periods[${x}][period_name]`,
        formData.value.period[x].period_name,
      );
      frmData.append(
        `periods[${x}][start_date]`,
        formData.value.period[x].start_date,
      );
      frmData.append(
        `periods[${x}][end_date]`,
        formData.value.period[x].end_date,
      );
      frmData.append(
        `periods[${x}][sale_price]`,
        formData.value.period[x].sale_price,
      );
      frmData.append(
        `periods[${x}][cost_price]`,
        formData.value.period[x].cost_price,
      );
      frmData.append(
        `periods[${x}][agent_price]`,
        formData.value.period[x].agent_price,
      );
    }
  } else if (formData.value.period.length === 0 && formData.value.id) {
    frmData.append("periods", JSON.stringify([]));
  }

  if (isEditMode.value) {
    frmData.append("_method", "PUT");
  }

  try {
    const response = isEditMode.value
      ? await roomStore.updateAction(frmData, formData.value.id)
      : await roomStore.addNewAction(frmData);

    toast.success(response.message);
    window.location.reload();
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
    }
    toast.error(error.response?.data?.message || "An error occurred");
  } finally {
    saving.value = false;
  }
};

// Navigation
const goBack = () => {
  router.back();
};

// Mount
onMounted(() => {
  if (isEditMode.value) {
    loadRoomData();
  }
});
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
