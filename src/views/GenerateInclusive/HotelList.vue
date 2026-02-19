<template>
  <div
    class="bg-white h-[81vh] rounded-xl border-2 border-slate-200 p-6 overflow-y-auto"
  >
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-slate-700">
        Hotels ({{ hotels.length }})
      </h3>

      <!-- Toggle View Buttons -->
      <div class="flex gap-2 bg-slate-100 rounded-xl p-1">
        <button
          @click="$emit('update:viewMode', 'list')"
          :class="[
            'px-3 py-1.5 rounded text-sm font-medium transition',
            viewMode === 'list'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-800',
          ]"
        >
          List
        </button>
        <button
          @click="$emit('update:viewMode', 'calendar')"
          :class="[
            'px-3 py-1.5 rounded text-sm font-medium transition',
            viewMode === 'calendar'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-800',
          ]"
        >
          Calendar
        </button>
      </div>
    </div>

    <!-- Day filter tabs (list view only) -->
    <div
      v-if="viewMode === 'list'"
      class="flex justify-start items-center gap-x-2 overflow-x-scroll no-scrollbar pb-3"
    >
      <div
        @click="selectedDay = ''"
        :class="
          selectedDay === ''
            ? 'bg-purple-600 text-white'
            : 'bg-gray-100 text-slate-600'
        "
        class="px-3 py-2 text-xs cursor-pointer whitespace-nowrap font-medium rounded-xl"
      >
        All Days
      </div>
      <div
        v-for="d in totalDays"
        :key="d"
        @click="selectedDay = d"
        :class="
          selectedDay === d
            ? 'bg-purple-600 text-white'
            : 'bg-gray-100 text-slate-600'
        "
        class="px-3 py-2 cursor-pointer text-xs whitespace-nowrap font-medium rounded-xl"
      >
        Day {{ d }}
      </div>
    </div>

    <!-- Calendar View -->
    <div v-if="viewMode === 'calendar' && totalDays > 0">
      <div
        class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-300"
      >
        <div class="bg-white rounded-xl shadow-inner overflow-hidden">
          <div
            class="grid gap-px bg-slate-200"
            :style="`grid-template-columns: repeat(${totalDays}, 1fr)`"
          >
            <div
              v-for="day in totalDays"
              :key="`hotel-header-${day}`"
              class="bg-slate-700 text-white p-3 text-center"
            >
              <div class="text-xs font-medium uppercase">
                {{ getDayName(day) }}
              </div>
              <div class="text-lg font-bold mt-1">{{ getDayNumber(day) }}</div>
            </div>
          </div>

          <div
            class="grid gap-px bg-slate-200"
            :style="`grid-template-columns: repeat(${totalDays}, 1fr)`"
          >
            <div
              v-for="day in totalDays"
              :key="`hotel-content-${day}`"
              class="bg-white p-3 min-h-[200px]"
            >
              <div class="space-y-2">
                <div
                  v-for="(hotel, idx) in getHotelsForDate(getDayDateRaw(day))"
                  :key="idx"
                  class="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-2 text-xs shadow-sm group relative"
                >
                  <button
                    @click="$emit('remove', hotels.indexOf(hotel))"
                    class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                  >
                    ×
                  </button>
                  <div class="font-semibold">{{ hotel.name }}</div>
                  <div class="opacity-90 mt-1">{{ hotel.roomName }}</div>
                  <div class="opacity-75 text-[10px] mt-1">
                    🛏 {{ hotel.rooms ?? 1 }} room{{
                      (hotel.rooms ?? 1) > 1 ? "s" : ""
                    }}
                  </div>
                  <div class="opacity-75 text-sm font-medium mt-1">
                    ฿{{ (hotel.sellingPrice || 0).toLocaleString() }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-if="viewMode === 'list'" class="space-y-2">
      <div
        v-for="(hotel, idx) in filteredHotels"
        :key="idx"
        class="bg-white border-2 border-purple-200 rounded-xl px-4 pt-4 pb-2 relative group hover:shadow-md transition"
      >
        <!-- Edit / Delete buttons -->
        <div class="flex gap-2 absolute top-2 right-2">
          <button
            @click="goToProduct(hotel)"
            class="w-6 h-6 bg-blue-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
            title="See"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-eye-icon lucide-eye w-4 h-4"
            >
              <path
                d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
              />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
          <button
            @click="$emit('remove', hotels.indexOf(hotel))"
            class="w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
            title="Delete"
          >
            ×
          </button>
        </div>

        <!-- Day tag (like attraction list) -->
        <div class="text-xs text-purple-500 font-semibold mb-1">
          Day {{ hotel.checkInDay }} {{ hotel.checkInLabel }}
          <span v-if="hotel.city"> • {{ hotel.city }}</span>
        </div>

        <h4 class="font-semibold text-slate-800 text-base">
          {{ hotel.name || "Unnamed Hotel" }}
        </h4>
        <div class="text-sm text-purple-600 mt-1">
          {{ hotel.roomName || "Room Type" }}
        </div>

        <div class="flex justify-between items-center mt-1">
          <div class="text-sm text-slate-500">
            <span v-if="hotel.checkIn && hotel.checkOut">
              {{ formatShortDate(hotel.checkIn) }} →
              {{ formatShortDate(hotel.checkOut) }}
            </span>
            <span class="font-medium text-purple-600 ml-1">
              ({{
                hotel.nights ?? calculateNights(hotel.checkIn, hotel.checkOut)
              }}
              night{{
                (hotel.nights ??
                  calculateNights(hotel.checkIn, hotel.checkOut)) > 1
                  ? "s"
                  : ""
              }})
            </span>
            <span class="ml-2 text-slate-400">
              🛏 {{ hotel.rooms ?? 1 }} room{{
                (hotel.rooms ?? 1) > 1 ? "s" : ""
              }}
            </span>
          </div>
          <div class="text-lg text-purple-600 font-semibold">
            ฿{{ (hotel.sellingPrice || 0).toLocaleString() }}
          </div>
        </div>
      </div>

      <div
        v-if="hotels.length === 0"
        class="text-center text-slate-400 text-sm py-12"
      >
        No hotels added yet
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  hotels: Array,
  viewMode: String,
  totalDays: Number,
  startDate: String,
});

defineEmits(["update:viewMode", "edit", "remove"]);

const selectedDay = ref("");

// ─────────────────────────────────────────────────────────────
// Filter by selected day tab
// ─────────────────────────────────────────────────────────────
const filteredHotels = computed(() => {
  if (!selectedDay.value) return props.hotels;
  return props.hotels.filter(
    (h) =>
      h.checkInDay <= selectedDay.value && selectedDay.value < h.checkOutDay,
  );
});

const goToProduct = (item) => {
  console.log(item, "this is hotel");
  window.open(
    `/products-v2/hotel/edit/${item.hotelId}?room_id=${item.roomId}&quiteSwitch=11`,
    "_blank",
  );
};

// ─────────────────────────────────────────────────────────────
// Date / day helpers
// ─────────────────────────────────────────────────────────────
const getDayDateRaw = (dayNumber) => {
  if (!props.startDate) return "";
  const start = new Date(props.startDate);
  const current = new Date(start);
  current.setDate(start.getDate() + dayNumber - 1);
  return current.toISOString().split("T")[0];
};

const getDayName = (dayNumber) => {
  if (!props.startDate) return "";
  const start = new Date(props.startDate);
  const current = new Date(start);
  current.setDate(start.getDate() + dayNumber - 1);
  return current
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase();
};

const getDayNumber = (dayNumber) => {
  if (!props.startDate) return "";
  const start = new Date(props.startDate);
  const current = new Date(start);
  current.setDate(start.getDate() + dayNumber - 1);
  return current.getDate();
};

const getHotelsForDate = (dateStr) => {
  const currentDate = new Date(dateStr);
  return props.hotels.filter((hotel) => {
    const checkIn = new Date(hotel.checkIn);
    const checkOut = new Date(hotel.checkOut);
    return checkIn <= currentDate && currentDate < checkOut;
  });
};

const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const nights = Math.ceil(
    (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24),
  );
  return nights > 0 ? nights : 0;
};

const formatShortDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
