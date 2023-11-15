<script setup>
import Layout from "./Layout.vue";
import { useAuthStore } from "../stores/auth";
import { useDashboardStore } from "../stores/dashboard";

import {
  ArchiveBoxIcon,
  CalendarIcon,
  UsersIcon,
} from "@heroicons/vue/24/outline";
import { onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const dashboardStore = useDashboardStore();

const { dashboard, loading, monthlyData } = storeToRefs(dashboardStore);

const checkIndex = ref("");
const check = (arr) => {
  checkIndex.value = Object.keys(arr).findIndex(
    (key) => arr[key] === authStore.user.name
  );
};
const checkMonthIndex = ref("");
const checkIndexMonth = (arr) => {
  checkMonthIndex.value = Object.keys(arr).findIndex(
    (key) => arr[key] === authStore.user.name
  );
  console.log(checkMonthIndex.value, "index");
};

const selectMonth = ref("");

const dateFormat = (inputDateString) => {
  if (inputDateString != null) {
    const inputDate = new Date(inputDateString);

    // Get the year, month, and day components
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
    const day = String(inputDate.getDate()).padStart(2, "0");

    // Format the date in "YYYY-MM-DD" format
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  } else {
    return null;
  }
};

const isCurrent = ref("");
const isCurrentMonth = (date) => {
  const currentDate = new Date();

  // Extract the current year and month
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // Extract the selected year and month
  const [selectedYear, selectedMonth] = date.split("-").map(Number);

  if (selectedYear === currentYear && selectedMonth === currentMonth) {
    isCurrent.value = "current";
  } else if (selectedYear === currentYear && selectedMonth > currentMonth) {
    isCurrent.value = "next";
  } else if (selectedYear === currentYear && selectedMonth < currentMonth) {
    isCurrent.value = "pre";
  }
  console.log(isCurrent.value);
};

const updateStartAndEndDate = async () => {
  isCurrentMonth(selectMonth.value);

  const [year, month] = selectMonth.value.split("-");

  let startDate = new Date(year, month - 1, 1);

  let endDate = new Date(year, month, 1);

  endDate.setDate(endDate.getDate() - 1);

  startDate = dateFormat(startDate);
  endDate = dateFormat(endDate);
  console.log(startDate, endDate);
  let data = {
    start_date: startDate,
    end_date: endDate,
  };
  let res = await dashboardStore.getMonthData(data);
  console.log(monthlyData.value, "this is data");
  checkIndexMonth(monthlyData.value.agents);
};

const getCurrent = () => {
  const currentDate = new Date();

  // Extract the current year and month
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Months are zero-based

  // Format the current year and month as a string (you can adjust the format as needed)
  let data = `${currentYear}-${currentMonth < 10 ? "0" : ""}${currentMonth}`;
  console.log(data, "eh");
  selectMonth.value = data;
};

onMounted(async () => {
  await dashboardStore.getAction();
  getCurrent();
  console.log(dashboard.value.agents, "this is dash");
  check(dashboard.value.agents);
});

watch(selectMonth, async (newValue) => {
  updateStartAndEndDate();
});
</script>

<template>
  <Layout :title="`Welcome back, ${authStore.user.name.split(' ')[0]}!`">
    <div class="grid grid-cols-1 gap-1 md:gap-4 mb-3">
      <div class="col-span-2">
        <div
          class="flex items-center justify-between py-5 bg-white/60 rounded-md shadow-sm p-4 mb-4"
        >
          <p class="text-lg font-semibold tracking-wider mr-4">Filter:</p>
          <input
            type="month"
            id="monthInput"
            class="bg-transparent focus:ring-0 focus:border-0"
            v-model="selectMonth"
            @input="handleMonthChange"
          />
        </div>
        <div class="grid grid-cols-3 gap-4" v-if="!loading">
          <div class="bg-white/60 p-4 rounded-lg shadow-sm w-full space-y-4">
            <div class="flex justify-between items-center">
              <p>Filter with Month</p>
            </div>
            <div class="text-base flex justify-between items-center">
              <p
                class="text-base text-[#FF5B00]"
                v-if="
                  (checkMonthIndex == -1 || checkMonthIndex == '') &&
                  isCurrent == 'current'
                "
              >
                This month , isn't sales
              </p>
              <p class="text-base text-[#FF5B00]" v-if="isCurrent == 'pre'">
                commission already receipt
              </p>
              <p class="text-base text-[#FF5B00]" v-if="isCurrent == 'next'">
                no record found
              </p>
              <p
                class="text-base"
                v-if="
                  checkMonthIndex != -1 &&
                  checkMonthIndex != '' &&
                  isCurrent == 'current'
                "
              >
                {{ monthlyData?.agents[checkMonthIndex] }}
              </p>
              <p
                class="text-[#FF5B00] text-base"
                v-if="
                  checkMonthIndex != -1 &&
                  checkMonthIndex != '' &&
                  isCurrent == 'current'
                "
              >
                {{ monthlyData?.amount[checkMonthIndex] }}
              </p>
            </div>
          </div>
          <div class="bg-white/60 p-4 rounded-lg shadow-sm w-full space-y-4">
            <div class="flex justify-between items-center">
              <p>Commission Price</p>
            </div>
            <div class="text-base flex justify-between items-center">
              <p
                class="text-base text-[#FF5B00]"
                v-if="
                  (checkMonthIndex == -1 || checkMonthIndex == '') &&
                  isCurrent == 'current'
                "
              >
                This month , isn't sales
              </p>
              <p class="text-base text-[#FF5B00]" v-if="isCurrent == 'pre'">
                commission already receipt
              </p>
              <p class="text-base text-[#FF5B00]" v-if="isCurrent == 'next'">
                no record found
              </p>
              <p
                class="text-base"
                v-if="
                  checkMonthIndex != -1 &&
                  checkMonthIndex != '' &&
                  isCurrent == 'current'
                "
              >
                {{ monthlyData?.agents[checkMonthIndex] }}'s commissions :
              </p>
              <p
                class="text-[#FF5B00] text-base"
                v-if="
                  checkMonthIndex != -1 &&
                  checkMonthIndex != '' &&
                  isCurrent == 'current'
                "
              >
                {{ monthlyData?.amount[checkMonthIndex] * 1000 }}
              </p>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-4" v-if="loading">
          <div
            class="bg-white/60 p-4 rounded-lg shadow-sm w-full space-y-4 h-[500px] flex justify-center items-center"
          >
            <div
              aria-label="Loading..."
              role="status"
              class="flex items-center space-x-2"
            >
              <svg
                class="h-20 w-20 animate-spin stroke-gray-500"
                viewBox="0 0 256 256"
              >
                <line
                  x1="128"
                  y1="32"
                  x2="128"
                  y2="64"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="24"
                ></line>
                <line
                  x1="195.9"
                  y1="60.1"
                  x2="173.3"
                  y2="82.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="24"
                ></line>
                <line
                  x1="224"
                  y1="128"
                  x2="192"
                  y2="128"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="24"
                ></line>
                <line
                  x1="195.9"
                  y1="195.9"
                  x2="173.3"
                  y2="173.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="24"
                ></line>
                <line
                  x1="128"
                  y1="224"
                  x2="128"
                  y2="192"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="24"
                ></line>
                <line
                  x1="60.1"
                  y1="195.9"
                  x2="82.7"
                  y2="173.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="24"
                ></line>
                <line
                  x1="32"
                  y1="128"
                  x2="64"
                  y2="128"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="24"
                ></line>
                <line
                  x1="60.1"
                  y1="60.1"
                  x2="82.7"
                  y2="82.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="24"
                ></line>
              </svg>
              <span class="text-lg font-medium text-gray-500"
                >Loading Data ...</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
