<template>
  <div
    class="bg-white rounded-xl border-2 border-slate-200 p-6 overflow-y-auto"
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
              <div class="text-lg font-bold mt-1">
                {{ getDayNumber(day) }}
              </div>
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
                  <div class="opacity-90 mt-1">
                    {{ hotel.variation }}
                  </div>
                  <div class="opacity-75 text-[10px] mt-1">
                    👥 {{ hotel.persons }} person(s)
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
        v-for="(hotel, idx) in hotels"
        :key="idx"
        class="bg-white border-2 border-purple-200 rounded-xl p-4 relative group hover:shadow-md transition"
      >
        <div class="flex gap-2 absolute top-2 right-2">
          <button
            @click="$emit('edit', idx)"
            class="w-6 h-6 bg-blue-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
            title="Edit"
          >
            ✎
          </button>
          <button
            @click="$emit('remove', idx)"
            class="w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
            title="Delete"
          >
            ×
          </button>
        </div>
        <h4 class="font-semibold text-slate-800 text-base">
          {{ hotel.name || "Unnamed Hotel" }}
        </h4>
        <div class="text-sm text-purple-600 mt-1">
          {{ hotel.variation || "Room Type" }}
        </div>
        <div class="text-sm text-slate-600 mt-1">
          {{ hotel.persons }} Person(s)
        </div>
        <div
          v-if="hotel.checkIn && hotel.checkOut"
          class="text-sm text-slate-500 mt-1"
        >
          {{ formatShortDate(hotel.checkIn) }} -
          {{ formatShortDate(hotel.checkOut) }}
          <span class="font-medium text-purple-600 ml-1">
            ({{ calculateNights(hotel.checkIn, hotel.checkOut) }} night{{
              calculateNights(hotel.checkIn, hotel.checkOut) > 1 ? "s" : ""
            }})
          </span>
        </div>
        <div v-if="hotel.citiesCovered" class="mt-2">
          <span class="text-xs text-slate-500">Cities: </span>
          <span
            class="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium"
          >
            {{ hotel.citiesCovered }}
          </span>
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
const props = defineProps({
  hotels: Array,
  viewMode: String,
  totalDays: Number,
  startDate: String,
});

defineEmits(["update:viewMode", "edit", "remove"]);

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
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 0;
};

const formatShortDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
</script>
