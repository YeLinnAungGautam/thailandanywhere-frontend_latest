<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
    <div class="flex items-end gap-4 flex-wrap">
      <!-- Hotel Search Button (triggers modal) -->
      <div class="relative flex-1 min-w-[200px]">
        <label class="text-xs font-medium text-gray-700 mb-1.5 block">
          Hotel
        </label>
        <button
          @click="openModal"
          class="w-full text-sm px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-colors text-left flex items-center justify-between hover:bg-gray-50"
        >
          <span :class="selectedHotelName ? 'text-gray-900' : 'text-gray-400'">
            {{ selectedHotelName || "Search hotel..." }}
          </span>
          <svg
            class="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>

      <!-- Room Quantity (only for search mode) -->
      <div v-if="showRoomQuantity" class="min-w-[130px]">
        <label class="text-xs font-medium text-gray-700 mb-1.5 block">
          Room Quantity
        </label>
        <input
          class="w-full text-sm px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
          type="number"
          min="1"
          placeholder="Qty"
          :value="roomQuantity"
          @input="$emit('update:roomQuantity', parseInt($event.target.value))"
          :disabled="!selectedHotelId"
        />
      </div>

      <!-- Check-in Date -->
      <div class="min-w-[160px]">
        <label class="text-xs font-medium text-gray-700 mb-1.5 block">
          Check-In Date
        </label>
        <input
          class="w-full text-sm px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-colors"
          type="date"
          :value="checkInDate"
          @input="$emit('update:checkInDate', $event.target.value)"
        />
      </div>

      <!-- Check-out Date -->
      <div class="min-w-[160px]">
        <label class="text-xs font-medium text-gray-700 mb-1.5 block">
          Check-Out Date
        </label>
        <input
          class="w-full text-sm px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-colors"
          type="date"
          :value="checkOutDate"
          @input="$emit('update:checkOutDate', $event.target.value)"
        />
      </div>

      <!-- Search Button (only for search mode) -->
      <div v-if="showSearchButton">
        <button
          :disabled="!canSearch"
          @click="$emit('search')"
          :class="[
            'text-sm px-6 py-2.5 rounded-lg font-medium text-white transition-all',
            canSearch
              ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-sm hover:shadow-md cursor-pointer'
              : 'bg-gray-300 cursor-not-allowed',
          ]"
        >
          Search All Rooms
        </button>
      </div>
    </div>

    <!-- Selected Hotel Info -->
    <div
      v-if="selectedHotelId && selectedHotelName"
      class="mt-3 pt-3 border-t border-gray-100"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          <p class="text-xs text-gray-600">
            Selected:
            <span class="font-semibold text-gray-900">{{
              selectedHotelName
            }}</span>
          </p>
        </div>
        <div v-if="dateRange" class="text-xs text-gray-500">
          {{ dateRange }}
        </div>
      </div>
    </div>

    <!-- Hotel Selection Modal -->
    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="closeModal"
      >
        <div
          class="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col"
        >
          <!-- Modal Header -->
          <div
            class="px-6 py-4 border-b border-gray-200 flex items-center justify-between"
          >
            <h3 class="text-lg font-bold text-gray-900">Select Hotel</h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Search Input -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="relative">
              <input
                ref="modalSearchInput"
                class="w-full text-sm px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-colors"
                type="search"
                placeholder="Search hotel by name..."
                v-model="modalSearch"
                @input="onModalSearchInput"
              />
              <svg
                class="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <!-- Hotel List -->
          <div class="flex-1 overflow-y-auto p-6">
            <div
              v-if="isSearching && hotelLists.length === 0"
              class="text-center py-8"
            >
              <div class="inline-block">
                <div
                  class="w-8 h-8 border-3 border-orange-200 border-t-orange-600 rounded-full animate-spin"
                ></div>
              </div>
              <p class="text-sm text-gray-600 mt-3">Loading hotels...</p>
            </div>

            <div
              v-else-if="filteredHotels.length === 0"
              class="text-center py-8"
            >
              <svg
                class="w-16 h-16 mx-auto text-gray-300 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <p class="text-sm font-medium text-gray-700">No hotels found</p>
              <p class="text-xs text-gray-500 mt-1">
                Try a different search term
              </p>
            </div>

            <div v-else class="space-y-2">
              <div
                v-for="hotel in filteredHotels"
                :key="hotel.id"
                @click="selectHotel(hotel)"
                :class="[
                  'p-4 rounded-lg border-2 cursor-pointer transition-all',
                  tempSelectedHotelId === hotel.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50',
                ]"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <p class="text-sm font-bold text-gray-900">
                        {{ hotel.name }}
                      </p>
                      <span
                        v-if="tempSelectedHotelId === hotel.id"
                        class="px-2 py-0.5 text-xs font-semibold bg-orange-500 text-white rounded-full"
                      >
                        Selected
                      </span>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">
                      {{ hotel.rooms?.length || 0 }} room type{{
                        hotel.rooms?.length !== 1 ? "s" : ""
                      }}
                      available
                    </p>
                  </div>
                  <svg
                    v-if="tempSelectedHotelId === hotel.id"
                    class="w-6 h-6 text-orange-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div
            class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3"
          >
            <button
              @click="closeModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="confirmSelection"
              :disabled="!tempSelectedHotelId"
              :class="[
                'px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors',
                tempSelectedHotelId
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
                  : 'bg-gray-300 cursor-not-allowed',
              ]"
            >
              Confirm Selection
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from "vue";
import { useHotelStore } from "../../stores/hotel";
import debounce from "lodash/debounce";
import { useSharedHotel } from "./composables/useSharedHotel";

const { sharedHotelId, sharedHotelName, setHotel } = useSharedHotel();

const props = defineProps({
  showRoomQuantity: {
    type: Boolean,
    default: false,
  },
  showSearchButton: {
    type: Boolean,
    default: false,
  },
  roomQuantity: {
    type: Number,
    default: 1,
  },
  checkInDate: {
    type: String,
    default: "",
  },
  checkOutDate: {
    type: String,
    default: "",
  },
  selectedHotelId: {
    type: [String, Number],
    default: null,
  },
  selectedHotelName: {
    type: String,
    default: "",
  },
});

const emit = defineEmits([
  "update:roomQuantity",
  "update:checkInDate",
  "update:checkOutDate",
  "hotelSelected",
  "search",
]);

const hotelStore = useHotelStore();

const isModalOpen = ref(false);
const modalSearch = ref("");
const modalSearchInput = ref(null);
const isSearching = ref(false);
const hotelLists = ref([]);
const allHotels = ref([]); // Store all hotels
const tempSelectedHotelId = ref(null);
const tempSelectedHotelName = ref("");

const canSearch = computed(() => {
  if (props.showSearchButton) {
    return (
      props.selectedHotelId &&
      props.checkInDate &&
      props.checkOutDate &&
      (!props.showRoomQuantity || props.roomQuantity > 0)
    );
  }
  return false;
});

const dateRange = computed(() => {
  if (props.checkInDate && props.checkOutDate) {
    const checkin = new Date(props.checkInDate);
    const checkout = new Date(props.checkOutDate);
    const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
    return `${nights} night${nights !== 1 ? "s" : ""}`;
  }
  return "";
});

const filteredHotels = computed(() => {
  if (!modalSearch.value.trim()) {
    // Show all hotels when no search term
    return allHotels.value.filter((item) => item.allowment == 1);
  }
  // Filter hotels based on search term
  return hotelLists.value.filter((item) => item.allowment == 1);
});

const openModal = () => {
  isModalOpen.value = true;
  tempSelectedHotelId.value = props.selectedHotelId;
  tempSelectedHotelName.value = props.selectedHotelName;
  modalSearch.value = "";

  nextTick(() => {
    modalSearchInput.value?.focus();
  });
};

const closeModal = () => {
  isModalOpen.value = false;
  modalSearch.value = "";
  // Don't clear hotelLists - keep the data
};

// Load all hotels on mount
const loadAllHotels = async () => {
  isSearching.value = true;

  let data = {
    allowment: 1,
  };

  try {
    const res = await hotelStore.getListAction(data);
    allHotels.value = res.result.data || [];
    hotelLists.value = allHotels.value; // Initially show all hotels
    console.log("All hotels loaded:", allHotels.value);
  } catch (error) {
    console.error("Error loading hotels:", error);
    allHotels.value = [];
    hotelLists.value = [];
  } finally {
    isSearching.value = false;
  }
};

const hotelSearch = async () => {
  if (!modalSearch.value.trim()) {
    // Show all hotels when search is cleared
    hotelLists.value = allHotels.value;
    return;
  }

  isSearching.value = true;

  let data = {
    search: modalSearch.value,
    allowment: 1,
  };

  try {
    const res = await hotelStore.getListAction(data);
    hotelLists.value = res.result.data || [];
    console.log("Search results:", hotelLists.value);
  } catch (error) {
    console.error("Error searching hotels:", error);
    hotelLists.value = allHotels.value; // Fallback to all hotels on error
  } finally {
    isSearching.value = false;
  }
};

const onModalSearchInput = debounce(() => {
  hotelSearch();
}, 500);

const selectHotel = (hotel) => {
  tempSelectedHotelId.value = hotel.id;
  tempSelectedHotelName.value = hotel.name;
};

const confirmSelection = () => {
  if (tempSelectedHotelId.value) {
    const selectedHotel =
      hotelLists.value.find((h) => h.id === tempSelectedHotelId.value) ||
      allHotels.value.find((h) => h.id === tempSelectedHotelId.value);

    if (selectedHotel) {
      emit("hotelSelected", selectedHotel);
      closeModal();
    }
  }
};

// Watch for external hotel name changes
watch(
  () => props.selectedHotelName,
  (newName) => {
    if (newName && tempSelectedHotelName.value !== newName) {
      tempSelectedHotelName.value = newName;
    }
  }
);

onMounted(async () => {
  await loadAllHotels();
});
</script>

<style scoped>
/* Custom scrollbar for modal */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
