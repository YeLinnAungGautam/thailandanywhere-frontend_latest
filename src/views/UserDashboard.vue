<script setup>
import Layout from "./Layout.vue";
import { useAuthStore } from "../stores/auth";
import { useDashboardStore } from "../stores/dashboard";
import { useHomeStore } from "../stores/home";
import SaleByAgent from "../components/SaleByAgent.vue";
import { LineChart } from "vue-chart-3";
import ReservationPartHome from "../components/homeReservation/ReservationPartHome.vue";
import { Chart, registerables } from "chart.js";
import {
  ArchiveBoxIcon,
  CalendarIcon,
  UsersIcon,
} from "@heroicons/vue/24/outline";
import { onMounted, reactive, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import ReservationCalendarHome from "./Dashboard/ReservationCalendarHome.vue";
import { useSidebarStore } from "../stores/sidebar";
import AccountReceivable from "./Dashboard/AccountReceivable.vue";
const sidebarStore = useSidebarStore();
const { isShowSidebar } = storeToRefs(sidebarStore);

Chart.register(...registerables);

import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";
import Allowment from "./Dashboard/Allowment.vue";
import HomeNew from "./HomeNew.vue";

const dashboardReservation = ref("overView");

const userSalesShow = ref(false);

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const dashboardStore = useDashboardStore();
const homeStore = useHomeStore();

const dataTest = reactive({ items: [] });
const dataAmount = reactive({ items: [] });
const dataAmountLimit = reactive({ items: [] });

const companyAmount = reactive({ items: [] });
const companyAmountLimit = reactive({ items: [] });

const saleData = {
  labels: dataTest.items,
  datasets: [
    {
      label: "Daily Sale",
      data: dataAmount.items,
      backgroundColor: ["#F9FFF6"],
      borderColor: ["#FF0000"],
    },
    {
      label: "Target",
      data: dataAmountLimit.items,
      backgroundColor: ["#F9FFF6"],
      borderColor: ["#55FF00"],
    },
  ],
};
const saleDataCompany = {
  labels: dataTest.items,
  datasets: [
    {
      label: "Daily Sale",
      data: companyAmount.items,
      backgroundColor: ["#F9FFF6"],
      borderColor: ["#FF0000"],
    },
    {
      label: "Target",
      data: companyAmountLimit.items,
      backgroundColor: ["#F9FFF6"],
      borderColor: ["#55FF00"],
    },
  ],
};

const chartOptions = {
  responsive: true,
  tension: 0.4,
  maintainAspectRatio: false,
  scales: {
    y: {
      display: false, // Hide y-axis
    },
  },
  plugins: {
    tooltip: {
      mode: "index",
      intersect: false,
      enabled: false,
    },
  },
  hover: {
    mode: "index",
    intersect: false,
    mode: null,
  },
};

const { dashboard, loading, monthlyData } = storeToRefs(dashboardStore);

const checkIndex = ref("");
const check = (arr) => {
  if (arr != null) {
    checkIndex.value = Object.keys(arr).findIndex(
      (key) => arr[key] === authStore.user.name
    );
  }
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
  const preMonth = currentDate.getMonth();

  // Extract the selected year and month
  const [selectedYear, selectedMonth] = date.split("-").map(Number);

  if (selectedYear === currentYear && selectedMonth === currentMonth) {
    isCurrent.value = "current";
  } else if (selectedYear === currentYear && selectedMonth === preMonth) {
    isCurrent.value = "pre";
  } else if (selectedYear === currentYear && selectedMonth > currentMonth) {
    isCurrent.value = "next";
  } else if (selectedYear === currentYear && selectedMonth < currentMonth) {
    isCurrent.value = "prenoshow";
  }
  console.log(isCurrent.value, "this is current");
};

const commission_amount = ref("");
const commission_date = ref("");

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
    first: startDate,
    second: endDate,
  };
  commission_date.value = `${data.first} to ${data.second}`;

  const resSaleAgent = await homeStore.getAgentSales(data);
  console.log(resSaleAgent, "this is sale agent report");
  if (resSaleAgent.result) {
    resSaleAgent?.result.forEach((sale) => {
      if (sale.created_by?.name == authStore.user.name) {
        console.log("====================================");
        console.log(sale, "this is that user");
        commission_amount.value = sale.over_target_count * 2000;
        console.log("====================================");
      }
    });
  }
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

const currentMonth = () => {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");

  monthForGraph.value = `${year}-${month}`;
};

// const isPreMonth = ref(false);
const getAllDays = async (monthGet) => {
  console.log(monthGet, "this is month");
  let data = {
    date: monthGet,
    created_by: authStore.user.id,
  };
  const res = await homeStore.getTimeFilterAdminArray(data);
  console.log(res, "this is for graph");

  dataAmount.items.splice(0);
  dataAmountLimit.items.splice(0);
  dataTest.items.splice(0);
  for (let x = 0; x < res.result.sales.length; x++) {
    let dataArr = 0;

    for (let i = 0; i < res.result.sales[x].agents.length; i++) {
      dataArr += res.result.sales[x].agents[i].total;
    }
    dataAmount.items.push(dataArr);
    dataAmountLimit.items.push(authStore.target);
    dataTest.items.push(res.result.sales[x].date);
  }

  const response = await homeStore.getTimeFilterArray(monthGet);
  companyAmount.items.splice(0);
  companyAmountLimit.items.splice(0);
  for (let x = 0; x < response.result.sales.length; x++) {
    let dataArr = 0;

    for (let i = 0; i < response.result.sales[x].agents.length; i++) {
      const agent = response.result.sales[x].agents[i];

      dataArr += agent.total;
    }

    companyAmount.items.push(dataArr);
    companyAmountLimit.items.push(275000);
  }
};

const monthForGraph = ref("");

const dateForUnpaid = ref("");
const unpaidDataList = ref(null);
const presetDates = ref([
  { label: "Today", value: [new Date(), new Date()] },
  {
    label: "Today (Slot)",
    value: [new Date(), new Date()],
    slot: "preset-date-range-button",
  },
  {
    label: "This month",
    value: [startOfMonth(new Date()), endOfMonth(new Date())],
  },
  {
    label: "Last month",
    value: [
      startOfMonth(subMonths(new Date(), 1)),
      endOfMonth(subMonths(new Date(), 1)),
    ],
  },
  {
    label: "This year",
    value: [startOfYear(new Date()), endOfYear(new Date())],
  },
]);

const getUnpaidHandler = async (date) => {
  let first = date[0];
  let second = date[1];
  console.log(dateFormat(first), "this is date", dateFormat(second));
  let data = {
    first: dateFormat(first),
    second: dateFormat(second),
    agent_id: user.value.id,
  };
  unpaidDataList.value = await homeStore.unpaidAgentSales(data);
  console.log(unpaidDataList.value, "this is unpaid");
};

onMounted(async () => {
  // await dashboardStore.getAction();
  currentMonth();
  getCurrent();
  check(dashboard.value?.agents);
  getAllDays(monthForGraph.value);

  dateForUnpaid.value = [startOfMonth(new Date()), endOfMonth(new Date())];
});

watch(selectMonth, async (newValue) => {
  console.log(selectMonth.value, "this is select month");
  await updateStartAndEndDate();
  await getAllDays(selectMonth.value);
});

watch(dateForUnpaid, async (newValue) => {
  if (dateForUnpaid.value != "" && dateForUnpaid.value != null) {
    await getUnpaidHandler(dateForUnpaid.value);
  }
});
</script>

<template>
  <Layout :title="`Welcome back, ${authStore.user.name.split(' ')[0]}!`">
    <div
      :class="isShowSidebar ? 'left-[250px]' : 'left-[100px]'"
      class="space-x-8 col-span-3 flex justify-start transistion-all duration-200 items-center gap-2 text-sm pb-4 absolute top-8"
    >
      <div
        class="px-2 py-1 text-xs rounded-lg cursor-pointer flex justify-start items-center gap-1.5"
        :class="
          dashboardReservation == 'overView' ? 'text-white bg-[#ff613c]' : ''
        "
        @click="dashboardReservation = 'overView'"
      >
        Sales Overview
      </div>
      <div
        class="px-2 py-1 text-xs rounded-lg cursor-pointer flex justify-start items-center gap-1.5"
        :class="dashboardReservation == 'sale' ? 'text-white bg-[#ff613c]' : ''"
        @click="dashboardReservation = 'sale'"
      >
        Calendar & Sales
      </div>
      <div
        class="px-2 py-1 text-xs rounded-lg cursor-pointer flex justify-start items-center gap-1.5"
        :class="
          dashboardReservation == 'reservation' ? 'text-white bg-[#ff613c]' : ''
        "
        @click="dashboardReservation = 'reservation'"
      >
        Reservations
      </div>
      <div
        class="px-2 py-1 text-xs rounded-lg cursor-pointer flex justify-start items-center gap-1.5"
        :class="
          dashboardReservation == 'account-receivable'
            ? 'text-white bg-[#ff613c]'
            : ''
        "
        @click="dashboardReservation = 'account-receivable'"
      >
        Account Receivable
      </div>
      <div
        class="px-2 py-1 text-xs rounded-lg cursor-pointer flex justify-start items-center gap-1.5"
        :class="
          dashboardReservation == 'allowment' ? 'text-white bg-[#ff613c]' : ''
        "
        @click="dashboardReservation = 'allowment'"
      >
        Availability
      </div>
    </div>

    <div class="" v-if="dashboardReservation == 'sale'">
      <ReservationCalendarHome />
    </div>
    <div class="pt-4">
      <div class="grid grid-cols-3 gap-2" v-if="dashboardReservation == 'sale'">
        <div
          class="col-span-3 flex items-center justify-between py-5 bg-white/60 rounded-md shadow-sm p-4 mb-2"
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
        <div class="col-span-2">
          <div class="grid grid-cols-1 gap-4" v-if="loading">
            <div
              class="bg-white/60 p-4 rounded-lg shadow-sm w-full space-y-4 h-[100px] flex justify-center items-center"
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
                  >Please wait , loading ...</span
                >
              </div>
            </div>
          </div>
          <div class="grid grid-cols-4 gap-4" v-if="!loading">
            <div
              class="bg-white/60 col-span-2 p-4 rounded-lg shadow-sm w-full space-y-2"
            >
              <div class="flex justify-between items-center">
                <p class="text-xs font-semibold">Filter with Month</p>
              </div>
              <div class="text-sm flex justify-between items-center">
                <p class="text-[#FF5B00] text-sm font-medium">
                  {{ commission_date }}
                </p>
              </div>
            </div>

            <div
              class="bg-white/60 p-4 rounded-lg shadow-sm w-full col-span-2 space-y-2"
            >
              <div class="flex justify-between items-center">
                <p class="text-xs font-semibold">Commission Price by Month</p>
              </div>
              <div class="text-sm flex justify-between items-center">
                <p class="text-sm">{{ authStore.user.name }}'s commissions :</p>
                <p class="text-[#FF5B00] text-base">
                  {{ commission_amount }}
                </p>
              </div>
            </div>
          </div>
          <div>
            <div
              class="mt-4 bg-white/60 flex justify-between items-center rounded-md shadow-sm p-4"
            >
              <p class="text-xs font-semibold">
                {{ userSalesShow ? "Company Sales" : "My Sales" }}
              </p>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  @click="userSalesShow = !userSalesShow"
                  value=""
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"
                ></div>
              </label>
            </div>
            <div
              class="bg-white/60 shadow rounded-md pb-6 px-4 my-4"
              v-if="!userSalesShow"
            >
              <LineChart :chartData="saleData" :options="chartOptions" />
            </div>
            <div
              class="bg-white/60 shadow rounded-md pb-6 px-4 my-4"
              v-if="userSalesShow"
            >
              <LineChart :chartData="saleDataCompany" :options="chartOptions" />
            </div>
          </div>
        </div>
        <div class="pl-2 pb-4">
          <div
            class="bg-white/60 h-[530px] rounded-md shadow-sm p-3 space-y-4 overflow-y-scroll"
          >
            <div class="flex justify-between items-center tracking-wide">
              <p class="text-sm font-medium mr-2">Unpaid</p>
              <VueDatePicker
                v-model="dateForUnpaid"
                :format="'yyyy-MM-dd'"
                range
                :preset-dates="presetDates"
                placeholder="select date range"
              >
                <template
                  #preset-date-range-button="{ label, value, presetDate }"
                >
                  <span
                    role="button"
                    :tabindex="0"
                    @click="presetDate(value)"
                    @keyup.enter.prevent="presetDate(value)"
                    @keyup.space.prevent="presetDate(value)"
                  >
                    {{ label }}
                  </span>
                </template>
              </VueDatePicker>
            </div>

            <div
              class=""
              v-for="(s, index) in unpaidDataList?.result"
              :key="index"
            >
              <SaleByAgent :data="s" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="" v-if="dashboardReservation == 'reservation'">
      <ReservationPartHome />
    </div>
    <div class="" v-if="dashboardReservation == 'overView'">
      <HomeNew />
    </div>
    <div class="col-span-3 w-full" v-if="dashboardReservation == 'allowment'">
      <Allowment />
    </div>
  </Layout>
</template>
