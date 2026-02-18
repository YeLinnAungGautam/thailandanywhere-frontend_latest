<template>
  <div
    class="bg-white rounded-xl h-[81vh] border-2 border-slate-200 p-6 overflow-y-auto"
  >
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-slate-700">
        Van Tours ({{ vanTours.length }})
      </h3>

      <!-- Toggle View Buttons -->
      <div class="flex gap-2 bg-slate-100 rounded-xl p-1">
        <button
          @click="$emit('update:viewMode', 'list')"
          :class="[
            'px-3 py-1.5 rounded text-sm font-medium transition',
            viewMode === 'list'
              ? 'bg-white text-emerald-600 shadow-sm'
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
              ? 'bg-white text-emerald-600 shadow-sm'
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
            ? 'bg-emerald-600 text-white'
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
            ? 'bg-emerald-600 text-white'
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
        class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border-2 border-emerald-300"
      >
        <div class="bg-white rounded-xl shadow-inner overflow-hidden">
          <div
            class="grid gap-px bg-slate-200"
            :style="`grid-template-columns: repeat(${totalDays}, 1fr)`"
          >
            <div
              v-for="day in totalDays"
              :key="`van-header-${day}`"
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
              :key="`van-content-${day}`"
              class="bg-white p-3 min-h-[200px]"
            >
              <div class="space-y-2">
                <div
                  v-for="(van, idx) in getVanToursForDate(getDayDateRaw(day))"
                  :key="idx"
                  class="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl p-2 text-xs shadow-sm group relative"
                >
                  <button
                    @click="$emit('remove', vanTours.indexOf(van))"
                    class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                  >
                    ×
                  </button>
                  <div class="font-semibold">{{ van.vanTourName }}</div>
                  <div class="opacity-90 mt-1">{{ van.carName }}</div>
                  <div class="opacity-75 text-[10px] mt-1">
                    🚗 {{ van.cars }} Rooms
                  </div>
                  <div v-if="van.sellingPrice" class="text-sm mt-1">
                    ฿{{ van.sellingPrice.toLocaleString() }}
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
        v-for="(van, idx) in filteredVanTours"
        :key="idx"
        class="bg-white border-2 border-emerald-200 rounded-xl px-4 pt-4 pb-2 relative group hover:shadow-md transition"
      >
        <!-- Edit / Delete buttons -->
        <div class="flex gap-2 absolute top-2 right-2">
          <button
            @click="$emit('remove', vanTours.indexOf(van))"
            class="w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
            title="Delete"
          >
            ×
          </button>
        </div>

        <!-- Day tag -->
        <div class="text-xs text-emerald-500 font-semibold mb-1">
          Day {{ van.dayNumber }} {{ van.dayLabel }}
          <span v-if="van.city"> • {{ van.city }}</span>
        </div>

        <h4 class="font-semibold text-slate-800 text-base">
          {{ van.vanTourName || "Van Tour" }}
        </h4>
        <div class="text-sm text-emerald-600 mt-1">
          {{ van.carName || "Service" }}
        </div>

        <div class="flex justify-between items-center mt-1">
          <div class="text-sm text-slate-500">🚗 {{ van.cars }}</div>
          <div class="text-lg text-emerald-600 font-semibold">
            ฿{{ (van.sellingPrice || 0).toLocaleString() }}
          </div>
        </div>

        <div v-if="van.pickupTime" class="text-sm text-slate-500 mt-1">
          Pickup: {{ van.pickupTime }}
          <span v-if="van.duration" class="ml-2">({{ van.duration }} hrs)</span>
        </div>
      </div>

      <div
        v-if="vanTours.length === 0"
        class="text-center text-slate-400 text-sm py-12"
      >
        No van tours added yet
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  vanTours: Array,
  viewMode: String,
  totalDays: Number,
  startDate: String,
});

defineEmits(["update:viewMode", "edit", "remove"]);

const selectedDay = ref("");

// ─────────────────────────────────────────────────────────────
// Filter by selected day tab
// ─────────────────────────────────────────────────────────────
const filteredVanTours = computed(() => {
  console.log(props.vanTours, "this is vantour");

  if (!selectedDay.value) return props.vanTours;
  return props.vanTours.filter((v) => v.dayNumber === selectedDay.value);
});

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

const getVanToursForDate = (dateStr) => {
  return props.vanTours.filter((v) => v.serviceDate === dateStr);
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
