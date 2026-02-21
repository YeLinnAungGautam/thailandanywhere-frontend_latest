<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center pb-3">
      <h3 class="text-lg font-semibold text-slate-700">
        {{ editingIndex !== null ? "Edit Hotel" : "Add Hotel" }}
      </h3>
    </div>

    <div class="">
      <label class="block text-sm font-medium text-slate-700 mb-2">
        Select Date
      </label>
      <div class="flex justify-end items-center gap-x-2">
        <select
          v-model.number="localData.checkInDay"
          @change="onCheckInDayChange"
          class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
        >
          <option value="">CheckIn</option>
          <option v-for="day in totalDays" :key="day" :value="day">
            Day {{ day }} - {{ getDayCitiesText(day) }}
          </option>
        </select>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-move-right-icon lucide-move-right min-w-4 mx-2 min-h-4"
        >
          <path d="M18 8L22 12L18 16" />
          <path d="M2 12H22" />
        </svg>
        <select
          v-model.number="localData.checkOutDay"
          @change="onCheckOutDayChange"
          class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
        >
          <option value="">CheckOut</option>
          <option
            v-for="day in totalDays"
            :key="day"
            :value="day"
            :disabled="!!localData.checkInDay && day <= localData.checkInDay"
          >
            Day {{ day }} - {{ getDayCitiesText(day) }}
          </option>
        </select>
      </div>
    </div>

    <!-- Search Hotel (only after both days selected) -->
    <div v-if="canSearch" class="relative" v-click-outside="closeDropdown">
      <label class="block text-sm font-medium text-slate-700 mb-2">
        Search Hotel for
        <span
          v-if="periodNights > 0"
          class="text-xs text-purple-600 font-semibold"
        >
          🌙 {{ periodNights }} night{{ periodNights > 1 ? "s" : "" }}
        </span>
      </label>

      <div class="relative" v-if="!localData.selectedHotel">
        <input
          v-model="searchQuery"
          @input="onSearchChange"
          @focus="onSearchFocus"
          type="text"
          placeholder="Search hotels..."
          class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
        />
        <div
          v-if="hotelStore.searchLoading"
          class="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <div
            class="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"
          ></div>
        </div>
      </div>

      <!-- Dropdown -->
      <div
        v-if="
          showDropdown &&
          !hotelStore.searchLoading &&
          hotelStore.searchResults.length > 0
        "
        class="w-full mt-2 bg-white border border-slate-300 rounded-xl max-h-[375px] overflow-y-auto"
      >
        <div
          v-for="hotel in hotelStore.searchResults"
          :key="hotel.id"
          @click="selectHotel(hotel)"
          class="p-3 hover:bg-purple-50 cursor-pointer border-b border-slate-100 last:border-b-0 transition"
        >
          <div class="flex items-start gap-3">
            <img
              v-if="hotel.images?.[0]?.image"
              :src="hotel.images[0].image"
              :alt="hotel.name"
              class="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            />
            <div
              v-else
              class="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0"
            >
              <span class="text-purple-500 text-lg">🏨</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-semibold text-sm text-slate-800 truncate">
                {{ hotel.name }}
              </div>
              <div class="flex items-center gap-2 mt-1 flex-wrap">
                <!-- <span
                  v-if="hotel.rating"
                  class="text-xs text-amber-500 font-semibold"
                >
                  ★ {{ hotel.rating }}
                </span> -->
                <span
                  v-if="hotel.period_summary?.cheapest_room_selling"
                  class="text-xs text-purple-600 font-bold"
                >
                  From ฿{{
                    hotel.period_summary.cheapest_room_selling.toLocaleString()
                  }}
                </span>
                <span
                  v-if="hotel.period_summary?.nights"
                  class="text-xs text-slate-400"
                >
                  / {{ hotel.period_summary.nights }} night{{
                    hotel.period_summary.nights > 1 ? "s" : ""
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No results -->
      <div
        v-if="
          showDropdown &&
          !hotelStore.searchLoading &&
          searchQuery &&
          hotelStore.searchResults.length === 0
        "
        class="absolute z-50 w-full mt-2 bg-white border border-slate-300 rounded-xl shadow-lg p-4 text-center text-slate-500 text-sm"
      >
        No hotels found for "{{ searchQuery }}"
      </div>
    </div>

    <!-- Helper when days not selected -->
    <div
      v-else
      class="text-sm text-slate-400 bg-slate-50 rounded-xl p-3 text-center flex items-center justify-center gap-2"
    >
      <span>🏨</span> Please select check-in and check-out days first
    </div>

    <!-- Selected Hotel Display -->
    <div
      v-if="localData.selectedHotel"
      class="bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-300 rounded-xl p-4"
    >
      <div class="flex items-start gap-3">
        <img
          v-if="localData.selectedHotel.images?.[0]?.image"
          :src="localData.selectedHotel.images[0].image"
          :alt="localData.selectedHotel.name"
          class="w-16 h-16 rounded-lg object-cover"
        />
        <div
          v-else
          class="w-16 h-16 rounded-lg bg-purple-200 flex items-center justify-center"
        >
          <span class="text-2xl">🏨</span>
        </div>
        <div class="flex-1">
          <span class="font-semibold text-slate-800 block">
            {{ localData.selectedHotel.name }}
          </span>
          <span
            v-if="localData.selectedHotel.rating"
            class="text-xs text-amber-500"
          >
            ★ {{ localData.selectedHotel.rating }}
          </span>
          <button
            @click="clearHotelSelection"
            class="mt-2 block text-xs text-red-600 hover:text-red-700 font-medium"
          >
            ✕ Change Hotel
          </button>
        </div>
      </div>
    </div>

    <!-- Select Room Type -->
    <div v-if="localData.selectedHotel && availableRooms.length > 0">
      <label class="block text-sm font-medium text-slate-700 mb-2">
        Select Room Type
      </label>
      <div class="space-y-2 max-h-[270px] overflow-y-auto">
        <div
          v-for="(room, idx) in availableRooms"
          :key="room.id ?? idx"
          @click="selectRoom(room)"
          :class="[
            'bg-white border-2 rounded-lg p-3 cursor-pointer transition',
            localData.selectedRoom?.id === room.id
              ? 'border-purple-500 bg-purple-50'
              : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50',
          ]"
        >
          <div class="font-semibold text-sm text-slate-800">
            {{ room.name }}
          </div>
          <div class="flex justify-between items-center mt-2 flex-wrap gap-x-4">
            <div class="flex items-center gap-x-4">
              <span class="text-sm text-purple-600 font-bold">
                ฿{{ room.total_selling_price.toLocaleString() }}
                <span class="font-normal text-xs text-slate-400">
                  / {{ periodNights }} night{{ periodNights > 1 ? "s" : "" }}
                </span>
              </span>
              <span class="text-xs text-slate-500">
                Cost: ฿{{ room.total_cost_price.toLocaleString() }}
              </span>
            </div>
            <span
              v-if="localData.selectedRoom?.id === room.id"
              class="text-xs text-purple-600 font-semibold"
            >
              ✓ Selected
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2">
      <button
        v-if="editingIndex !== null"
        @click="$emit('cancel')"
        class="w-1/3 px-6 py-3 bg-slate-400 text-white rounded-xl font-semibold hover:bg-slate-500 transition"
      >
        Cancel
      </button>
      <button
        @click="openPriceSummaryModal"
        :disabled="!canSubmit"
        :class="[
          'px-6 py-3 rounded-xl font-semibold transition',
          editingIndex !== null ? 'w-2/3' : 'w-full',
          canSubmit
            ? 'bg-purple-500 text-white hover:bg-purple-600 cursor-pointer'
            : 'bg-slate-300 text-slate-500 cursor-not-allowed',
        ]"
      >
        {{ editingIndex !== null ? "✓ Update Hotel" : "+ Add Hotel" }}
      </button>
    </div>

    <!-- Price Summary Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="showPriceModal"
          class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        >
          <!-- Backdrop -->
          <div
            class="absolute inset-0 bg-black/50 backdrop-blur-sm"
            @click="showPriceModal = false"
          />

          <!-- Modal Card -->
          <div
            class="modal-card relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
          >
            <!-- Header -->
            <div
              class="bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-4 flex items-start justify-between"
            >
              <div>
                <h3 class="text-lg font-bold text-white leading-tight">
                  Price Summary
                </h3>
                <p class="text-purple-100 text-xs mt-1 line-clamp-1">
                  {{ localData.selectedHotel?.name }}
                </p>
              </div>
              <button
                @click="showPriceModal = false"
                class="w-7 h-7 ml-4 shrink-0 rounded-full bg-white/25 hover:bg-white/40 text-white flex items-center justify-center transition text-xl leading-none"
              >
                &times;
              </button>
            </div>

            <!-- Body -->
            <div class="px-6 pt-5 pb-2 space-y-4">
              <!-- Stay info chips -->
              <div class="grid grid-cols-3 gap-2">
                <div
                  class="bg-slate-50 rounded-xl py-3 text-center border border-slate-200"
                >
                  <p class="text-xs text-slate-500 mb-0.5">Check-in</p>
                  <p class="text-sm font-bold text-slate-800">
                    {{ getDayDateShort(localData.checkInDay) }}
                  </p>
                  <p class="text-xs text-slate-400">
                    Day {{ localData.checkInDay }}
                  </p>
                </div>
                <div
                  class="bg-slate-50 rounded-xl py-3 text-center border border-slate-200"
                >
                  <p class="text-xs text-slate-500 mb-0.5">Nights</p>
                  <p class="text-2xl font-bold text-slate-800">
                    {{ periodNights }}
                  </p>
                </div>
                <div
                  class="bg-slate-50 rounded-xl py-3 text-center border border-slate-200"
                >
                  <p class="text-xs text-slate-500 mb-0.5">Check-out</p>
                  <p class="text-sm font-bold text-slate-800">
                    {{ getDayDateShort(localData.checkOutDay) }}
                  </p>
                  <p class="text-xs text-slate-400">
                    Day {{ localData.checkOutDay }}
                  </p>
                </div>
              </div>

              <!-- Room Qty -->
              <div class="grid grid-cols-1 gap-3">
                <div class="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p
                    class="text-xs font-medium text-slate-500 mb-2 text-center"
                  >
                    Rooms
                  </p>
                  <div class="flex items-center justify-between gap-1">
                    <button
                      @click="
                        localData.rooms = Math.max(1, localData.rooms - 1)
                      "
                      class="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-600 font-bold hover:bg-purple-50 hover:border-purple-400 hover:text-purple-600 transition flex items-center justify-center text-lg leading-none"
                    >
                      −
                    </button>
                    <span
                      class="text-2xl font-bold text-slate-800 w-8 text-center"
                    >
                      {{ localData.rooms }}
                    </span>
                    <button
                      @click="localData.rooms++"
                      class="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-600 font-bold hover:bg-purple-50 hover:border-purple-400 hover:text-purple-600 transition flex items-center justify-center text-lg leading-none"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <!-- Room breakdown -->
              <div class="divide-y divide-slate-100">
                <div class="flex justify-between items-center py-2.5">
                  <div class="text-sm">
                    <span class="font-medium text-slate-700">{{
                      localData.selectedRoom?.name
                    }}</span>
                    <span class="text-slate-400 ml-1.5 text-xs">
                      × {{ periodNights }} night{{
                        periodNights > 1 ? "s" : ""
                      }}
                      × {{ localData.rooms }} room{{
                        localData.rooms > 1 ? "s" : ""
                      }}
                    </span>
                  </div>
                  <span class="font-semibold text-slate-800 text-sm">
                    ฿{{ totalSellingPrice.toLocaleString() }}
                  </span>
                </div>
              </div>

              <!-- Totals box -->
              <div
                class="bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 space-y-2"
              >
                <div class="flex justify-between items-center">
                  <span class="text-sm text-slate-500">Cost Price</span>
                  <span class="text-sm font-semibold text-slate-600">
                    ฿{{ totalCostPrice.toLocaleString() }}
                  </span>
                </div>
                <div
                  class="flex justify-between items-center pt-2 border-t border-purple-200"
                >
                  <span class="font-bold text-slate-800">Total Selling</span>
                  <span class="text-xl font-bold text-purple-600">
                    ฿{{ totalSellingPrice.toLocaleString() }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-5 flex gap-3">
              <button
                @click="showPriceModal = false"
                class="flex-1 py-3 rounded-xl border-2 border-slate-300 text-slate-600 font-semibold hover:bg-slate-50 transition text-sm"
              >
                ← Back
              </button>
              <button
                @click="confirmSubmit"
                class="flex-1 py-3 rounded-xl bg-purple-500 text-white font-semibold hover:bg-purple-600 active:bg-purple-700 transition text-sm"
              >
                {{
                  editingIndex !== null ? "✓ Confirm Update" : "✓ Confirm & Add"
                }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import { useHotelStore } from "../../stores/hotel";

const props = defineProps({
  totalDays: Number,
  dayCityMap: Object, // { 1: [{id, name}, ...], ... }
  startDate: String,
  editingIndex: Number,
  editingData: Object,
});

const emit = defineEmits(["submit", "cancel"]);

const hotelStore = useHotelStore();
const searchQuery = ref("");
const showDropdown = ref(false);
const showPriceModal = ref(false);
let searchTimeout = null;

const localData = reactive({
  checkInDay: "",
  checkOutDay: "",
  rooms: 1,
  selectedHotel: null,
  selectedRoom: null,
  hotelImage: null,
  images: [],
});

// ─────────────────────────────────────────────────────────────
// Click-outside directive
// ─────────────────────────────────────────────────────────────
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutsideHandler = (event) => {
      if (!el.contains(event.target)) binding.value();
    };
    document.addEventListener("mousedown", el._clickOutsideHandler);
  },
  unmounted(el) {
    document.removeEventListener("mousedown", el._clickOutsideHandler);
  },
};

const closeDropdown = () => {
  showDropdown.value = false;
};

// ─────────────────────────────────────────────────────────────
// Watch editing data
// ─────────────────────────────────────────────────────────────
watch(
  () => props.editingData,
  (newData) => {
    if (newData) Object.assign(localData, newData);
  },
  { deep: true, immediate: true },
);

// ─────────────────────────────────────────────────────────────
// Period nights (checkOutDay - checkInDay)
// ─────────────────────────────────────────────────────────────
const periodNights = computed(() => {
  if (!localData.checkInDay || !localData.checkOutDay) return 0;
  return Math.max(0, localData.checkOutDay - localData.checkInDay);
});

// ─────────────────────────────────────────────────────────────
// City IDs covered between check-in and check-out days
// ─────────────────────────────────────────────────────────────
const coveredCityIds = computed(() => {
  if (!localData.checkInDay || !localData.checkOutDay) return [];
  const idSet = new Set();
  for (let d = localData.checkInDay; d < localData.checkOutDay; d++) {
    const cities = props.dayCityMap[d] || [];
    cities.forEach((c) => idSet.add(c.id));
  }
  return Array.from(idSet);
});

// ─────────────────────────────────────────────────────────────
// Can show search?
// ─────────────────────────────────────────────────────────────
const canSearch = computed(
  () =>
    localData.checkInDay &&
    localData.checkOutDay &&
    coveredCityIds.value.length > 0,
);

// ─────────────────────────────────────────────────────────────
// Rooms from selected hotel
// ─────────────────────────────────────────────────────────────
const availableRooms = computed(() => localData.selectedHotel?.rooms ?? []);

// ─────────────────────────────────────────────────────────────
// Totals (rooms multiplier)
// ─────────────────────────────────────────────────────────────
const totalSellingPrice = computed(() => {
  if (!localData.selectedRoom) return 0;
  return (localData.selectedRoom.total_selling_price ?? 0) * localData.rooms;
});

const totalCostPrice = computed(() => {
  if (!localData.selectedRoom) return 0;
  return (localData.selectedRoom.total_cost_price ?? 0) * localData.rooms;
});

// ─────────────────────────────────────────────────────────────
// Can submit?
// ─────────────────────────────────────────────────────────────
const canSubmit = computed(
  () =>
    localData.checkInDay &&
    localData.checkOutDay &&
    localData.selectedHotel &&
    localData.selectedRoom,
);

// ─────────────────────────────────────────────────────────────
// Day / date helpers
// ─────────────────────────────────────────────────────────────
const getDayDateShort = (dayNumber) => {
  if (!props.startDate || !dayNumber) return "";
  const start = new Date(props.startDate);
  const d = new Date(start);
  d.setDate(start.getDate() + dayNumber - 1);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getDayDateRaw = (dayNumber) => {
  if (!props.startDate || !dayNumber) return "";
  const start = new Date(props.startDate);
  const d = new Date(start);
  d.setDate(start.getDate() + dayNumber - 1);
  return d.toISOString().split("T")[0];
};

const getDayCitiesText = (dayNumber) => {
  const cities = props.dayCityMap[dayNumber];
  if (!cities || cities.length === 0) return "";
  return ` (${cities.map((c) => c.name).join(" → ")})`;
};

// ─────────────────────────────────────────────────────────────
// Search handlers
// ─────────────────────────────────────────────────────────────
const fetchHotels = async () => {
  if (!canSearch.value) return;
  await hotelStore.searchHotels(
    coveredCityIds.value,
    searchQuery.value,
    getDayDateRaw(localData.checkInDay),
    getDayDateRaw(localData.checkOutDay),
  );
  showDropdown.value = true;
};

const onSearchChange = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(fetchHotels, 500);
};

const onSearchFocus = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(fetchHotels, 300);
};

const onCheckInDayChange = () => {
  // Reset if check-out is now invalid
  if (localData.checkOutDay && localData.checkOutDay <= localData.checkInDay) {
    localData.checkOutDay = "";
  }
  resetSelection();
};

const onCheckOutDayChange = () => {
  resetSelection();
};

const resetSelection = () => {
  localData.selectedHotel = null;
  localData.selectedRoom = null;
  searchQuery.value = "";
  showDropdown.value = false;
  hotelStore.clearSearchResults();
};

// ─────────────────────────────────────────────────────────────
// Hotel / room selection
// ─────────────────────────────────────────────────────────────
const selectHotel = (hotel) => {
  console.log(hotel, "this is hotel select part");

  localData.selectedHotel = hotel;
  localData.selectedRoom = null;
  showDropdown.value = false;
  localData.hotelImage = hotel.images[0].image;
  localData.images = hotel.images;
};

const clearHotelSelection = () => {
  localData.selectedHotel = null;
  localData.selectedRoom = null;
  searchQuery.value = "";
  showDropdown.value = false;
  hotelStore.clearSearchResults();
};

const selectRoom = (room) => {
  localData.selectedRoom = room;
};

// ─────────────────────────────────────────────────────────────
// Modal
// ─────────────────────────────────────────────────────────────
const openPriceSummaryModal = () => {
  if (!canSubmit.value) return;
  showPriceModal.value = true;
};

const confirmSubmit = () => {
  showPriceModal.value = false;

  const room = localData.selectedRoom;
  const hotel = localData.selectedHotel;
  const cities = [];
  for (let d = localData.checkInDay; d < localData.checkOutDay; d++) {
    (props.dayCityMap[d] || []).forEach((c) => {
      if (!cities.find((x) => x.id === c.id)) cities.push(c);
    });
  }

  const hotelEntry = {
    type: "Hotel",
    name: hotel.name,
    hotelId: hotel.id,
    hotelImage: localData.hotelImage,
    images: localData.images,
    roomId: room.id,
    roomName: room.name,
    rooms: localData.rooms,
    checkInDay: localData.checkInDay,
    checkOutDay: localData.checkOutDay,
    checkIn: getDayDateRaw(localData.checkInDay),
    checkOut: getDayDateRaw(localData.checkOutDay),
    checkInLabel: getDayDateShort(localData.checkInDay),
    checkOutLabel: getDayDateShort(localData.checkOutDay),
    nights: periodNights.value,
    cities,
    city: cities.map((c) => c.name).join(" → "),
    // pricing
    costPrice: totalCostPrice.value,
    sellingPrice: totalSellingPrice.value,
    totalDiscount: room.total_discount_price,
    discountPercent: room.overall_discount_percent,
    dailyPricing: room.daily_pricing ?? [],
    coveredCityIds: coveredCityIds.value,
  };

  emit("submit", hotelEntry);

  // Reset if adding new
  if (props.editingIndex === null) {
    Object.assign(localData, {
      checkInDay: "",
      checkOutDay: "",
      rooms: 1,
      selectedHotel: null,
      selectedRoom: null,
    });
    searchQuery.value = "";
    showDropdown.value = false;
    hotelStore.clearSearchResults();
  }
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active .modal-card,
.modal-fade-leave-active .modal-card {
  transition: transform 0.22s ease, opacity 0.22s ease;
}
.modal-fade-enter-from .modal-card {
  transform: scale(0.94) translateY(10px);
  opacity: 0;
}
.modal-fade-leave-to .modal-card {
  transform: scale(0.94) translateY(10px);
  opacity: 0;
}
</style>
