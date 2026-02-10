<template>
  <div class="flex gap-4 h-[calc(100vh-200px)]">
    <!-- Left Side - Room List -->
    <div class="w-1/3 bg-white rounded-lg shadow-sm p-4 overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-700">Rooms</h3>
        <div class="flex justify-end items-center gap-x-3">
          <!-- <div class="flex justify-end gap-x-2 items-center">
            <p
              @click="onlyShowOn = !onlyShowOn"
              :class="onlyShowOn ? 'bg-[#FF613c] text-white' : 'bg-gray-300'"
              class="px-2 cursor-pointer py-1.5 text-sm rounded-lg"
            >
              Only show on
            </p>
          </div> -->
          <div class="flex justify-end gap-x-2 items-center">
            <p
              @click="allRemoveShowOn"
              class="px-2 cursor-pointer py-1.5 text-sm rounded-lg bg-[#FF613c] text-white"
            >
              {{ allRemoveLoading ? "Loading..." : "R. Show on" }}
            </p>
          </div>
          <button
            @click="createNewRoom"
            class="px-3 py-1.5 bg-[#FF613c] hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <i class="fa-solid fa-plus mr-1"></i>
            New Room
          </button>
        </div>
      </div>
      <div class="flex justify-between items-center gap-x-2 mb-4">
        <div class="flex justify-end items-center gap-x-3">
          <div class="flex justify-end gap-x-2 items-center">
            <p
              @click="onlyShowOn = ''"
              :class="
                onlyShowOn == '' ? 'bg-[#FF613c] text-white' : 'bg-gray-300'
              "
              class="px-2 cursor-pointer py-1.5 text-sm rounded-lg"
            >
              All
            </p>
          </div>
          <div class="flex justify-end gap-x-2 items-center">
            <p
              @click="onlyShowOn = '1'"
              :class="
                onlyShowOn == '1' ? 'bg-[#FF613c] text-white' : 'bg-gray-300'
              "
              class="px-2 cursor-pointer py-1.5 text-sm rounded-lg"
            >
              Show On
            </p>
          </div>
          <div class="flex justify-end gap-x-2 items-center">
            <p
              @click="onlyShowOn = '0'"
              :class="
                onlyShowOn == '0' ? 'bg-[#FF613c] text-white' : 'bg-gray-300'
              "
              class="px-2 cursor-pointer py-1.5 text-sm rounded-lg"
            >
              Other
            </p>
          </div>
        </div>
      </div>

      <!-- Search -->
      <div class="mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search rooms..."
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
        />
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-8">
        <div
          class="w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"
        ></div>
      </div>

      <!-- Room List -->
      <div v-else-if="filteredRooms.length > 0" class="space-y-2">
        <div
          v-for="room in filteredRooms"
          :key="room.id"
          @click="selectRoom(room)"
          :class="[
            'p-3 rounded-lg border-2 cursor-pointer transition-all hover:border-orange-300',
            selectedRoomId === room.id
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-200 hover:shadow-md',
          ]"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h4 class="font-medium text-gray-800 text-sm">
                {{ room.name }}
              </h4>
              <p class="text-[10px] pb-2 pt-2 text-gray-500">
                {{ room.hotel?.name }}
              </p>
              <div class="flex items-center gap-3 text-xs text-gray-600">
                <span class="flex items-center gap-1">
                  <i class="fa-solid fa-user"></i>
                  {{ room.max_person }} guests
                </span>
                <span class="flex items-center gap-1">
                  <i class="fa-solid fa-dollar-sign"></i>
                  {{ room.room_price }}
                </span>
              </div>
              <div class="mt-2 flex flex-wrap gap-1">
                <span
                  v-if="room.is_extra"
                  class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs"
                >
                  Extra Bed
                </span>
                <span
                  v-if="room.has_breakfast"
                  class="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs"
                >
                  Breakfast
                </span>
                <span
                  v-if="room.meta?.is_show_on == '1'"
                  class="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs"
                >
                  Show
                </span>
                <span
                  class="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs"
                >
                  {{ room.score }}
                </span>
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <button
                @click.stop="duplicateRoom(room)"
                class="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                title="Duplicate"
              >
                <i class="fa-solid fa-copy text-xs"></i>
              </button>
              <button
                @click.stop="deleteRoom(room.id)"
                class="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                title="Delete"
              >
                <i class="fa-solid fa-trash text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-8 text-gray-500">
        <i class="fa-solid fa-bed text-4xl mb-3 text-gray-300"></i>
        <p class="text-sm">No rooms found</p>
        <button
          @click="createNewRoom"
          class="mt-3 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Create First Room
        </button>
      </div>
    </div>

    <!-- Right Side - Room Form -->
    <div class="flex-1 bg-white rounded-lg shadow-sm p-6 overflow-y-auto">
      <!-- Form Header -->
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold text-gray-700">
          {{ isEditing ? "Edit Room" : "Create New Room" }}
        </h3>
        <div class="flex gap-2">
          <button
            v-if="isEditing"
            @click="cancelEdit"
            class="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            @click="saveRoom"
            :disabled="saving"
            class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
          >
            <i v-if="saving" class="fa-solid fa-spinner fa-spin mr-2"></i>
            {{ isEditing ? "Update" : "Create" }} Room
          </button>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="flex gap-2 mb-6 border-b">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="currentTab = tab.id"
          :class="[
            'px-4 py-2 text-sm font-medium transition-colors border-b-2',
            currentTab === tab.id
              ? 'text-orange-600 border-orange-600'
              : 'text-gray-600 border-transparent hover:text-gray-800',
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Form Content -->
      <form @submit.prevent="saveRoom" class="space-y-6">
        <!-- Basic Info Tab -->
        <div v-show="currentTab === 'basic'" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <!-- Room Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Room Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.name"
                type="text"
                required
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
                placeholder="e.g., Deluxe Double Room"
              />
            </div>

            <!-- Max Person -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Max Person <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.max_person"
                type="number"
                required
                min="1"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
              />
            </div>

            <!-- Room Price -->
            <div>
              <div class="flex justify-between items-center mb-1">
                <label class="block text-sm font-medium text-gray-700">
                  Room Price <span class="text-red-500">*</span>
                </label>
                <p class="text-red-600 text-xs">
                  Suggest Price : {{ suggestPrice(formData.cost) }}
                </p>
              </div>
              <input
                v-model="formData.room_price"
                type="number"
                required
                min="0"
                step="0.01"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
              />
            </div>

            <!-- Cost -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Cost
              </label>
              <input
                v-model="formData.cost"
                type="number"
                min="0"
                step="0.01"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
              />
            </div>

            <!-- Owner Price -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Walk-in Price
              </label>
              <input
                v-model="formData.owner_price"
                type="number"
                min="0"
                step="0.01"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
              />
            </div>

            <!-- Agent Price -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Agent Price
              </label>
              <input
                v-model="formData.agent_price"
                type="number"
                min="0"
                step="0.01"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
              />
            </div>

            <!-- Room Size -->
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Room Size
              </label>
              <input
                v-model="formData.room_size"
                type="text"
                placeholder="e.g., 25 sqm"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
              />
            </div>
          </div>

          <!-- Toggles -->
          <div
            class="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700">Extra Bed</label>
              <Switch
                v-model="formData.is_extra"
                :class="formData.is_extra ? 'bg-orange-600' : 'bg-gray-300'"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              >
                <span
                  :class="formData.is_extra ? 'translate-x-6' : 'translate-x-1'"
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                />
              </Switch>
            </div>

            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700">Breakfast</label>
              <Switch
                v-model="formData.has_breakfast"
                :class="
                  formData.has_breakfast ? 'bg-orange-600' : 'bg-gray-300'
                "
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              >
                <span
                  :class="
                    formData.has_breakfast ? 'translate-x-6' : 'translate-x-1'
                  "
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                />
              </Switch>
            </div>

            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700"
                >Double Bed</label
              >
              <Switch
                v-model="formData.is_double"
                :class="formData.is_double ? 'bg-orange-600' : 'bg-gray-300'"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              >
                <span
                  :class="
                    formData.is_double ? 'translate-x-6' : 'translate-x-1'
                  "
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                />
              </Switch>
            </div>

            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700">Twin Bed</label>
              <Switch
                v-model="formData.is_twin"
                :class="formData.is_twin ? 'bg-orange-600' : 'bg-gray-300'"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              >
                <span
                  :class="formData.is_twin ? 'translate-x-6' : 'translate-x-1'"
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                />
              </Switch>
            </div>

            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700"
                >Show Online</label
              >
              <Switch
                v-model="formData.is_show_on"
                :class="formData.is_show_on ? 'bg-orange-600' : 'bg-gray-300'"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              >
                <span
                  :class="
                    formData.is_show_on ? 'translate-x-6' : 'translate-x-1'
                  "
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                />
              </Switch>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              v-model="formData.description"
              rows="4"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
              placeholder="Describe the room features..."
            ></textarea>
          </div>

          <!-- Images -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Room Images
            </label>
            <input
              ref="imageInput"
              type="file"
              multiple
              accept="image/*"
              @change="handleImageUpload"
              class="hidden"
            />
            <button
              type="button"
              @click="$refs.imageInput.click()"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <i class="fa-solid fa-image mr-2"></i>
              Add Images
            </button>
            <button
              type="button"
              @click="chooseImportRoomImages"
              class="px-4 py-2 bg-blue-600 ml-3 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <i class="fa-solid fa-image mr-2"></i>
              Choose Room Import Images
            </button>

            <div
              v-if="imagePreviews.length > 0"
              class="grid grid-cols-4 gap-3 mt-3"
            >
              <div
                v-for="(preview, index) in imagePreviews"
                :key="index"
                class="relative group"
              >
                <img
                  :src="preview"
                  class="w-full h-24 object-cover rounded-lg"
                  alt="Room preview"
                />
                <button
                  type="button"
                  @click="removeImage(index)"
                  class="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <i class="fa-solid fa-times text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Amenities Tab -->
        <div v-show="currentTab === 'amenities'">
          <RoomAmenitiesComponent
            :room-data="formData"
            :initial-amenities="formData.room_amen"
            @update:amenities="(val) => (formData.room_amen = val)"
          />
        </div>

        <!-- Periods Tab -->
        <div v-show="currentTab === 'periods'" class="space-y-4">
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-lg font-semibold text-gray-700">Pricing Periods</h4>
            <button
              type="button"
              @click="openPeriodModal()"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <i class="fa-solid fa-plus mr-1"></i>
              Add Period
            </button>
          </div>

          <!-- Period List (Display Only) -->
          <div v-if="formData.period.length > 0" class="space-y-3">
            <div
              v-for="(period, index) in formData.period"
              :key="index"
              class="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h5 class="font-semibold text-gray-900 mb-2">
                    {{ period.period_name }}
                  </h5>
                  <div class="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span class="text-gray-600">Duration:</span>
                      <p class="font-medium text-gray-900">
                        {{ formatDate(period.start_date) }} -
                        {{ formatDate(period.end_date) }}
                      </p>
                    </div>
                    <div>
                      <span class="text-gray-600">Sale Price:</span>
                      <p class="font-bold text-green-600">
                        THB {{ formatPrice(period.sale_price) }}
                      </p>
                    </div>
                    <div>
                      <span class="text-gray-600">Cost:</span>
                      <p class="font-medium text-orange-600">
                        THB {{ formatPrice(period.cost_price) }}
                      </p>
                    </div>
                    <div>
                      <span class="text-gray-600">Agent Price:</span>
                      <p class="font-medium text-blue-600">
                        THB {{ formatPrice(period.agent_price) }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="flex gap-2 ml-4">
                  <button
                    type="button"
                    @click="openPeriodModal(index)"
                    class="p-2 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                    title="Edit period"
                  >
                    <i class="fa-solid fa-edit text-sm"></i>
                  </button>
                  <button
                    type="button"
                    @click="removePeriod(index)"
                    class="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                    title="Remove period"
                  >
                    <i class="fa-solid fa-trash text-sm"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-else
            class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
          >
            <i
              class="fa-solid fa-calendar-xmark text-5xl text-gray-300 mb-3"
            ></i>
            <p class="text-gray-600 font-medium mb-2">No pricing periods</p>
            <p class="text-sm text-gray-500 mb-4">
              Add periods to define seasonal pricing
            </p>
            <button
              type="button"
              @click="openPeriodModal()"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <i class="fa-solid fa-plus mr-1"></i>
              Add First Period
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Period Modal -->
    <PeriodModal
      :isOpen="showPeriodModal"
      :period="editingPeriod"
      :isEditing="editingPeriodIndex !== null"
      @close="closePeriodModal"
      @save="handlePeriodSave"
    />

    <!-- Modal Overlay -->
    <RoomImageImportModal
      :isOpen="showImageImportModal"
      :targetRoomId="formData.id"
      :targetRoomName="formData.name"
      :hotelId="props.id"
      :roomsWithImages="roomsWithImages"
      @close="showImageImportModal = false"
      @confirm="handleImageCopy"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { Switch } from "@headlessui/vue";
import { useRoomStore } from "../stores/room";
import RoomAmenitiesComponent from "./RoomPart/Amenties.vue";
import PeriodModal from "./RoomPart/RoomPeriodModal.vue";
import Swal from "sweetalert2";
import router from "../router";
import { useRoute } from "vue-router";
import RoomImageImportModal from "../components/HotelAIAutoFill2/RoomComponents/RoomCopyImage.vue";

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const toast = useToast();
const route = useRoute();
const roomStore = useRoomStore();

// State
const loading = ref(false);
const saving = ref(false);
const rooms = ref([]);
const selectedRoomId = ref(null);
const searchQuery = ref("");
const currentTab = ref("basic");
const imageInput = ref(null);
const onlyShowOn = ref("");
const showPeriodModal = ref(false);
const editingPeriod = ref(null);
const editingPeriodIndex = ref(null);
const showImageImportModal = ref(false);
const roomsWithImages = ref([]);

const tabs = [
  { id: "basic", label: "Basic Info" },
  { id: "amenities", label: "Amenities" },
  { id: "periods", label: "Periods" },
];

const suggestPrice = (cost) => {
  if (!cost) return 0;
  let amount = cost / 0.85;
  let lastTwoDigits = amount % 100;
  if (lastTwoDigits > 50) {
    return (Math.ceil(amount / 100) * 100).toFixed(0);
  } else {
    return (Math.round(amount / 50) * 50).toFixed(0);
  }
};

// Form data
const formData = ref({
  id: null,
  name: "",
  hotel_id: props.id,
  description: "",
  max_person: 1,
  room_price: 0,
  cost: 0,
  agent_price: 0,
  owner_price: 0,
  room_size: "",
  is_extra: false,
  has_breakfast: false,
  is_double: false,
  is_twin: false,
  is_show_on: true,
  images: [],
  room_amen: [],
  period: [],
});

const imagePreviews = ref([]);

// Computed
const isEditing = computed(() => selectedRoomId.value !== null);

const filteredRooms = computed(() => {
  let filtered = rooms.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (room) =>
        room.name.toLowerCase().includes(query) ||
        room.description?.toLowerCase().includes(query),
    );
  }

  if (onlyShowOn.value == "1") {
    filtered = filtered.filter((room) => room?.meta?.is_show_on === "1");
  } else if (onlyShowOn.value == "0") {
    filtered = filtered.filter((room) => room?.meta?.is_show_on === "0");
  }

  return filtered;
});

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatPrice = (price) => {
  if (!price) return "0";
  return Number(price).toLocaleString();
};

// Period Modal Methods
const openPeriodModal = (index = null) => {
  if (index !== null) {
    // Edit existing period
    editingPeriodIndex.value = index;
    editingPeriod.value = { ...formData.value.period[index] };
  } else {
    // Add new period
    editingPeriodIndex.value = null;
    editingPeriod.value = {
      period_name: "",
      start_date: "",
      end_date: "",
      sale_price: null,
      cost_price: null,
      agent_price: null,
    };
  }
  showPeriodModal.value = true;
};

const closePeriodModal = () => {
  showPeriodModal.value = false;
  editingPeriod.value = null;
  editingPeriodIndex.value = null;
};

const handlePeriodSave = async (period) => {
  if (editingPeriodIndex.value !== null) {
    // Update existing period
    formData.value.period[editingPeriodIndex.value] = { ...period };
    // toast.success("Period updated successfully");
    await saveRoom();
  } else {
    // Add new period
    formData.value.period.push({ ...period });
    // toast.success("Period added successfully");
    await saveRoom();
  }
  closePeriodModal();
};

const removePeriod = async (index) => {
  const result = await Swal.fire({
    title: "Remove Period?",
    text: `Remove "${formData.value.period[index].period_name}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, remove it",
  });

  if (result.isConfirmed) {
    formData.value.period.splice(index, 1);
    // toast.success("Period removed");
    await saveRoom();
  }
};

// Methods
const fetchRooms = async () => {
  loading.value = true;
  try {
    const response = await roomStore.getListAction({
      hotel_id: props.id,
      limit: 100,
    });
    rooms.value = response.result.data || [];

    if (route.query.room_id) {
      const roomToSelect = filteredRooms.value.find(
        (r) => r.id == route.query.room_id,
      );
      if (roomToSelect) {
        selectRoom(roomToSelect);
      }
    }
  } catch (error) {
    toast.error("Failed to load rooms");
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const selectRoom = async (room) => {
  selectedRoomId.value = room.id;
  router.push({ query: { room_id: room.id, quiteSwitch: 11 } });
  // currentTab.value = "basic";

  try {
    const response = await roomStore.detailAction(room.id);
    const data = response.result;

    formData.value = {
      id: data.id,
      name: data.name,
      hotel_id: props.id,
      description: data.description,
      max_person: data.max_person,
      room_price: data.room_price,
      cost: data.cost,
      agent_price: data.agent_price,
      owner_price: data.owner_price,
      room_size: data.meta?.room_size || "",
      is_extra: data.is_extra == 1,
      has_breakfast: data.has_breakfast == 1,
      is_double: data.meta?.is_double == 1,
      is_twin: data.meta?.is_twin == 1,
      is_show_on: data.meta?.is_show_on == 1,
      images: [],
      room_amen:
        data.amenities?.map((amenity) => ({
          title: amenity.title,
          list: (amenity.list || []).map((item) => ({
            list_name: typeof item === "string" ? item : item.list_name,
          })),
        })) || [],
      period:
        data.room_periods?.map((period) => ({
          period_name: period.period_name,
          start_date: period.start_date,
          end_date: period.end_date,
          sale_price: period.sale_price,
          cost_price: period.cost_price,
          agent_price: period.agent_price,
        })) || [],
    };

    if (data.images?.length > 0) {
      imagePreviews.value = data.images.map((img) => img.image);
    } else {
      imagePreviews.value = [];
    }
  } catch (error) {
    toast.error("Failed to load room details");
  }
};

const createNewRoom = () => {
  selectedRoomId.value = null;
  currentTab.value = "basic";
  formData.value = {
    id: null,
    name: "",
    hotel_id: props.id,
    description: "",
    max_person: 1,
    room_price: 0,
    cost: 0,
    agent_price: 0,
    owner_price: 0,
    room_size: "",
    is_extra: false,
    has_breakfast: false,
    is_double: false,
    is_twin: false,
    is_show_on: true,
    images: [],
    room_amen: [],
    period: [],
  };
  imagePreviews.value = [];
};

const cancelEdit = () => {
  selectedRoomId.value = null;
  createNewRoom();
};

const handleImageUpload = (e) => {
  const files = e.target.files;
  if (files) {
    for (let i = 0; i < files.length; i++) {
      formData.value.images.push(files[i]);
      imagePreviews.value.push(URL.createObjectURL(files[i]));
    }
  }
};

const removeImage = (index) => {
  formData.value.images.splice(index, 1);
  imagePreviews.value.splice(index, 1);
};

const duplicateRoom = async (room) => {
  const result = await Swal.fire({
    title: "Duplicate Room?",
    text: `Create a copy of "${room.name}"?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#ff613c",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, duplicate it",
  });

  if (result.isConfirmed) {
    await selectRoom(room);
    formData.value.id = null;
    formData.value.name = `${formData.value.name} (Copy)`;
    selectedRoomId.value = null;
    toast.success("Room duplicated. Click save to create.");
  }
};

const deleteRoom = async (roomId) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      await roomStore.deleteAction(roomId);
      toast.success("Room deleted successfully");

      if (selectedRoomId.value === roomId) {
        createNewRoom();
      }

      await fetchRooms();
    } catch (error) {
      toast.error("Failed to delete room");
    }
  }
};

const saveRoom = async () => {
  saving.value = true;

  const frmData = new FormData();

  frmData.append("name", formData.value.name);
  frmData.append("hotel_id", formData.value.hotel_id);
  frmData.append("description", formData.value.description);
  frmData.append("max_person", formData.value.max_person);
  frmData.append("room_price", formData.value.room_price);
  frmData.append("cost", formData.value.cost || 0);
  frmData.append("agent_price", formData.value.agent_price || 0);
  frmData.append("owner_price", formData.value.owner_price || 0);

  frmData.append("is_extra", formData.value.is_extra ? 1 : 0);
  frmData.append("has_breakfast", formData.value.has_breakfast ? 1 : 0);
  frmData.append("meta[is_double]", formData.value.is_double ? 1 : 0);
  frmData.append("meta[is_twin]", formData.value.is_twin ? 1 : 0);
  frmData.append("meta[is_show_on]", formData.value.is_show_on ? 1 : 0);
  frmData.append("meta[room_size]", formData.value.room_size);

  if (formData.value.images.length > 0) {
    for (let i = 0; i < formData.value.images.length; i++) {
      frmData.append(`images[${i}]`, formData.value.images[i]);
    }
  }

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
  }

  if (isEditing.value) {
    frmData.append("_method", "PUT");
  }

  try {
    const response = isEditing.value
      ? await roomStore.updateAction(frmData, formData.value.id)
      : await roomStore.addNewAction(frmData);

    toast.success(response.message);
    await fetchRooms();

    if (!isEditing.value) {
      createNewRoom();
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to save room");
  } finally {
    saving.value = false;
  }
};

const allRemoveLoading = ref(false);
const allRemoveShowOn = async () => {
  // formData.value.is_show_on = false;
  // rooms.value.forEach((room) => {
  //   room.is_show_on = false;
  // });
  // console.log(props.id, "this is id");
  allRemoveLoading.value = true;
  await roomStore
    .hideAllRoomAction({
      hotel_id: props.id,
    })
    .then((response) => {
      toast.success(response.message);
      fetchRooms();
    })
    .catch((error) => {
      toast.error(error.response?.data?.message || "Failed to save room");
    })
    .finally(() => {
      allRemoveLoading.value = false;
    });
};

// Update chooseImportRoomImages method
const chooseImportRoomImages = async () => {
  if (!formData.value.id) {
    toast.error("Please save the room first before importing images");
    return;
  }

  try {
    // Fetch rooms with images
    const response = await roomStore.getRoomsWithImages(props.id);
    roomsWithImages.value = response.result.rooms || [];

    // Open modal
    showImageImportModal.value = true;
  } catch (error) {
    toast.error("Failed to load rooms with images");
    console.error(error);
  }
};

// Handle image copy confirmation
const handleImageCopy = async (params) => {
  try {
    const response = await roomStore.copyImages(params);

    toast.success(response.message);

    // Reload current room to show new images
    await selectRoom({ id: formData.value.id });

    // Close modal
    showImageImportModal.value = false;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to copy images");
    console.error(error);
  }
};

onMounted(() => {
  fetchRooms();
});
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>
