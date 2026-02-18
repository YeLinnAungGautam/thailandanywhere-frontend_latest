<template>
  <div
    class="bg-white rounded-xl border-2 border-slate-200 p-4 overflow-y-auto"
  >
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-slate-700">
        Attractions ({{ attractions.length }})
      </h3>

      <!-- Toggle View Buttons -->
      <div class="flex gap-2 bg-slate-100 rounded-xl p-1">
        <button
          @click="$emit('update:viewMode', 'list')"
          :class="[
            'px-3 py-1.5 rounded-lg text-sm font-medium transition',
            viewMode === 'list'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-800',
          ]"
        >
          List
        </button>
        <button
          @click="$emit('update:viewMode', 'calendar')"
          :class="[
            'px-3 py-1.5 rounded-lg text-sm font-medium transition',
            viewMode === 'calendar'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-800',
          ]"
        >
          Calendar
        </button>
      </div>
    </div>

    <div
      v-if="viewMode != 'calendar'"
      class="flex justify-start items-center gap-x-2 overflow-x-scroll no-scrollbar pb-3"
    >
      <div
        @click="selectedDay = ''"
        :class="
          selectedDay == ''
            ? 'bg-[#FF613c] text-white'
            : 'bg-gray-100 text-slate-600'
        "
        class="px-3 py-2 text-xs cursor-pointer whitespace-nowrap font-medium rounded-xl"
      >
        <p>All Days</p>
      </div>
      <div
        v-for="d in totalDays"
        :key="d"
        @click="selectedDay = d"
        :class="
          selectedDay == d
            ? 'bg-[#FF613c] text-white'
            : 'bg-gray-100 text-slate-600'
        "
        class="px-3 py-2 cursor-pointer text-xs whitespace-nowrap font-medium rounded-xl"
      >
        <p>Day {{ d }}</p>
      </div>
    </div>

    <!-- Calendar View -->
    <div v-if="viewMode === 'calendar' && totalDays > 0">
      <div
        class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-300"
      >
        <div class="bg-white rounded-xl shadow-inner overflow-hidden">
          <div
            class="grid gap-px bg-slate-200"
            :style="`grid-template-columns: repeat(${totalDays}, 1fr)`"
          >
            <div
              v-for="day in totalDays"
              :key="`header-${day}`"
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
              :key="`content-${day}`"
              class="bg-white p-3 min-h-[200px]"
            >
              <div class="space-y-2">
                <div
                  v-for="(item, idx) in getAttractionsForDate(
                    getDayDateRaw(day),
                  )"
                  :key="idx"
                  class="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-2 text-xs shadow-sm group relative"
                >
                  <button
                    @click="$emit('remove', attractions.indexOf(item))"
                    class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                  >
                    ×
                  </button>
                  <div class="font-semibold">{{ item.name }}</div>
                  <div class="opacity-90 mt-1 text-[10px]">{{ item.type }}</div>
                  <div class="flex justify-start items-center gap-x-1">
                    <div class="opacity-75 text-sm font-medium mt-1">
                      ฿{{ (item.sellingPrice || 0).toLocaleString() }}
                    </div>
                    <div class="opacity-75 text-xs mt-1">
                      👤 A:{{ item.adults }}, C:{{ item.children }}
                    </div>
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
        v-for="(item, idx) in getAttractionsForDay(selectedDay)"
        :key="idx"
        class="bg-white border-2 border-blue-200 rounded-xl px-4 pt-4 pb-2 relative group hover:shadow-md transition"
      >
        <div class="flex gap-2 absolute top-2 right-2">
          <button
            @click="$emit('remove', idx)"
            class="w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
            title="Delete"
          >
            ×
          </button>
        </div>
        <div class="text-xs text-blue-500 font-semibold mb-1">
          {{ item.dayLabel }} •
          {{
            item.cities
              ? item.cities.map((city) => city.name).join(" → ")
              : item.city
          }}
        </div>
        <h4 class="font-semibold text-slate-800 text-base">
          {{ item.name || "Unnamed" }}
        </h4>

        <div class="flex justify-between items-center">
          <div class="text-[12px] text-slate-600">
            {{ item.adults }} Adults, {{ item.children }} Children
          </div>
          <div class="text-lg text-orange-600 font-semibold">
            ฿{{ (item.sellingPrice || 0).toLocaleString() }}
          </div>
        </div>
      </div>
      <div
        v-if="attractions.length === 0"
        class="text-center text-slate-400 text-sm py-12"
      >
        No attractions added yet
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  attractions: Array,
  viewMode: String,
  totalDays: Number,
  startDate: String,
  dayCityMap: Object,
});

const selectedDay = ref("");

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

const getDayCity = (dateStr) => {
  if (!props.startDate) return "";
  const start = new Date(props.startDate);
  const current = new Date(dateStr);
  const dayNumber = Math.floor((current - start) / (1000 * 60 * 60 * 24)) + 1;
  return props.dayCityMap[dayNumber] || "";
};

const getAttractionsForDate = (dateStr) => {
  return props.attractions.filter((a) => a.serviceDate === dateStr);
};

const getAttractionsForDay = (day) => {
  if (!day) return props.attractions;
  console.log(props.attractions);

  return props.attractions.filter((a) => a.dayNumber === day);
};
</script>
