<script setup>
import Layout from "./Layout.vue";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
} from "@heroicons/vue/24/outline";
import { computed, onMounted, ref } from "vue";
import Button from "../components/Button.vue";

const currentMonth = ref("");
const currentMonthYear = ref(0);
const currentMonthMonth = ref(0);
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

onMounted(() => {
  setCurrentMonth();
});

function setCurrentMonth() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  currentMonthYear.value = year;
  currentMonthMonth.value = month;

  const options = { month: "long", year: "numeric" };
  currentMonth.value = new Date(year, month).toLocaleDateString(
    "en-US",
    options
  );
}

function previousMonth() {
  currentMonthMonth.value -= 1;

  if (currentMonthMonth.value < 0) {
    currentMonthYear.value -= 1;
    currentMonthMonth.value = 11;
  }

  const options = { month: "long", year: "numeric" };
  currentMonth.value = new Date(
    currentMonthYear.value,
    currentMonthMonth.value
  ).toLocaleDateString("en-US", options);
}

function nextMonth() {
  currentMonthMonth.value += 1;

  if (currentMonthMonth.value > 11) {
    currentMonthYear.value += 1;
    currentMonthMonth.value = 0;
  }

  const options = { month: "long", year: "numeric" };
  currentMonth.value = new Date(
    currentMonthYear.value,
    currentMonthMonth.value
  ).toLocaleDateString("en-US", options);
}

const calendarDaysWithOffset = computed(() => {
  const numDays = new Date(
    currentMonthYear.value,
    currentMonthMonth.value + 1,
    0
  ).getDate();
  const startDay = new Date(
    currentMonthYear.value,
    currentMonthMonth.value,
    1
  ).getDay();
  const offset = startDay === 0 ? 6 : startDay - 1;

  const daysArray = [];

  // Add offset days
  for (let i = 0; i < offset; i++) {
    daysArray.push({
      date: "",
      day: "",
      month: currentMonthMonth.value,
      dayName: "",
    });
  }

  // Add month days
  for (let i = 1; i <= numDays; i++) {
    const date = new Date(currentMonthYear.value, currentMonthMonth.value, i);
    const dayIndex = (startDay + i - 1) % 7;
    daysArray.push({
      date: `${currentMonthYear.value}-${currentMonthMonth.value + 1}-${i}`,
      day: i,
      month: currentMonthMonth.value,
      dayName: days[dayIndex],
    });
  }

  return daysArray;
});
const rows = ref([]);

// Generate time events from 12:00 AM to 11:00 PM
for (let hour = 0; hour <= 23; hour++) {
  const time = formatTime(hour);
  const event = { title: "", time: "" }; // Initialize event as an empty object
  rows.value.push({ time, event });
}

// Function to format time in 12-hour AM/PM format
function formatTime(hour) {
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${formattedHour}:00 ${ampm}`;
}
</script>

<template>
  <Layout>
    <div class="mb-5 flex items-center justify-between">
      <h3 class="text-2xl font-medium text-gray-600">Calendar</h3>
    </div>
    <div class="bg-white/60 p-4 rounded-lg shadow-sm mb-5">
      <div class="flex items-center justify-between mb-5">
        <div class="">
          <p class="text-xl tracking-wide text-gray-600 font-medium mb-1">
            January 22, 2022
          </p>
          <p class="text-base text-gray-500">Saturday</p>
        </div>
        <div class="flex items-center gap-1">
          <div class="flex items-center gap-1 border-r px-6">
            <Button intent="text" class="text-gray-400">
              <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
            </Button>
            <Button intent="text" class="text-sm text-gray-400 font-medium">
              Today
            </Button>
            <Button intent="text" class="text-gray-400">
              <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
            </Button>
            <Button
              class="text-sm text-gray-400 font-medium"
              intent="text"
              :right-icon="ChevronDownIcon"
            >
              Day view
            </Button>
          </div>
          <Button :left-icon="CalendarDaysIcon" class="ml-6 text-sm"
            >Add Event</Button
          >
        </div>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div class="col-span-2">
          <div class="flex-1 overflow-y-auto no-scrollbar">
            <div class="flex flex-col gap-2 p-4 h-[600px]">
              <div
                v-for="row in rows"
                :key="row.time"
                class="flex items-center"
              >
                <div class="w-1/4">
                  <p class="text-gray-600 text-sm">{{ row.time }}</p>
                </div>
                <div class="w-3/4">
                  <div v-if="row.event" class="flex items-center w-full">
                    <div
                      class="border border-gray-100 text-gray-600 py-1 px-2 ml-2 h-40 rounded w-full"
                    >
                      {{ row.event.time }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="calendar p-4">
          <div class="calendar-header flex justify-between items-center mb-4">
            <button
              @click="previousMonth"
              class="text-gray-500 text-xl focus:outline-none"
            >
              <ChevronLeftIcon class="w-5 h-5" />
            </button>
            <h2 class="text-base text-gray-500">{{ currentMonth }}</h2>
            <button
              @click="nextMonth"
              class="text-gray-500 text-xl focus:outline-none"
            >
              <ChevronRightIcon class="w-5 h-5" />
            </button>
          </div>
          <div class="calendar-body grid grid-cols-7 gap-4">
            <div
              v-for="day in days"
              :key="day"
              class="calendar-day text-center py-2 text-gray-500 text-sm"
            >
              {{ day }}
            </div>
            <template v-for="(day, index) in calendarDaysWithOffset">
              <button
                v-if="day.date"
                :key="day.date"
                class="calendar-day border border-gray-300 py-2 hover:bg-blue-500 hover:text-white transition shadow rounded text-center text-gray-500"
                :class="{
                  'opacity-50': day.month !== currentMonthMonth && day.day > 31,
                }"
              >
                {{ day.day }}
              </button>
              <div v-else :key="'br-' + index" class="empty-day"></div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style>
.empty-day {
  visibility: hidden;
}
</style>
