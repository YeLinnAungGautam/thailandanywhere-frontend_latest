<script setup>
import Layout from "./Layout.vue";
import {
  DoughnutChart,
  BarChart,
  LineChart,
  PieChart,
  PolarAreaChart,
  RadarChart,
  BubbleChart,
  ScatterChart,
} from "vue-chart-3";
import { useAuthStore } from "../stores/auth";
import { useVantourStore } from "../stores/vantour";
import { useGrouptourStore } from "../stores/grouptour";
import { useAirportStore } from "../stores/airport";
import { useEntranceStore } from "../stores/entrance";
import { useBookingStore } from "../stores/booking";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useHomeStore } from "../stores/home";
import axios from "axios";

import { Chart, registerables } from "chart.js";
import {
  ArchiveBoxIcon,
  CalendarIcon,
  UsersIcon,
} from "@heroicons/vue/24/outline";

Chart.register(...registerables);

const authStore = useAuthStore();
const vantourStore = useVantourStore();
const grouptourStore = useGrouptourStore();
const airportStore = useAirportStore();
const entranceStore = useEntranceStore();
const bookingStore = useBookingStore();
const homeStore = useHomeStore();

const {
  sales,
  salesAmount,
  salesCount,
  totalSales,
  totalSalesPrice,
  bookings,
  bookingsCount,
  totalBookings,
  reservationsHome,
  reservationAmount,
  reservationCount,
  totalReservationCount,
  totalReservationPrice,
} = storeToRefs(homeStore);

const saleData = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "Sales",
      data: [
        1000, 1200, 900, 1500, 1800, 1300, 2000, 2200, 1700, 1900, 2300, 2100,
      ],
      backgroundColor: ["#FF0000"],
    },
    {
      label: "Reservation",
      data: [
        1100, 1300, 1000, 1000, 1500, 1000, 2500, 2000, 1500, 1500, 2000, 2200,
      ],
      backgroundColor: ["#FF5B00"],
    },
  ],
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
};

const getfun = async () => {
  const res = await homeStore.getSaleAgent();
  console.log(sales.value, salesAmount.value);
};

const getBookingCount = async () => {
  const res = await homeStore.getBookingCount();
};
const getSaleCountHandle = async () => {
  const res = await homeStore.getSaleCount();
};

const getReservationCount = async () => {
  const res = await homeStore.getReservationCount();
};
const date = ref("");
const startDate = ref("");
const endDate = ref("");
const priceReservation = ref(false);
const togglePrice = () => {
  priceReservation.value = !priceReservation.value;
  console.log(priceReservation.value);
};
const priceSales = ref(true);
const togglePriceSales = async () => {
  priceSales.value = !priceSales.value;
  console.log(priceSales.value);
};

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

const dateFun = async () => {
  console.log(date.value);

  if (!date.value) {
    // window.location.reload();
    date.value = dateFormat(date.value);
    console.log(date.value);
    await getSaleCountHandle();
    await getfun();
    await getReservationCount();
    await getBookingCount();
  } else {
    console.log(date.value);
    startDate.value = dateFormat(date.value);
    // endDate.value = date.value[1] != null ? dateFormat(date.value[1]) : "";
    let data = {
      startDate: startDate.value,
    };
    console.log(data);
    const res = await homeStore.getTimeFilter(data);
  }
};

onMounted(async () => {
  // await getSaleCountHandle();
  // await getfun();
  // await getReservationCount();
  // await getBookingCount();
  date.value = dateFormat(new Date());
  if (date.value) {
    await dateFun();
  }
});
</script>

<template>
  <Layout :title="`Welcome back, ${authStore.user.name.split(' ')[0]}!`">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 mb-3">
      <div class="col-span-2">
        <div
          class="flex items-center justify-between py-5 bg-white/60 rounded-md shadow-sm p-4 mb-4"
        >
          <p class="text-lg font-semibold tracking-wider mr-4">Filter:</p>

          <!-- <VueDatePicker
            v-model="date"
            multi-calendars
            class="w-40"
            type="date"
            @update:model-value="dateFun"
          /> -->
          <input
            type="date"
            v-model="date"
            @change="dateFun"
            name=""
            class="bg-white text-sm w-[200px] px-2 py-2"
            id=""
          />
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-white/60 p-4 rounded-lg shadow-sm w-full space-y-4">
            <div class="flex justify-between items-center">
              <p>Total Reservations</p>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="priceReservation"
                  @click="togglePrice()"
                  value=""
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"
                ></div>
              </label>
            </div>
            <p class="text-4xl text-[#FF5B00]" v-if="!priceReservation">
              {{ totalReservationCount }}
            </p>
            <p class="text-4xl text-[#FF5B00]" v-if="priceReservation">
              {{ totalReservationPrice }}
            </p>
            <div
              class="text-sm flex justify-between items-center"
              v-for="(r, index) in reservationsHome?.agents"
              :key="index"
            >
              <p class="text-sm">{{ r }}</p>
              <p class="text-[#FF5B00] text-sm" v-if="!priceReservation">
                {{ reservationAmount[index] }}
              </p>
              <p class="text-[#FF5B00] text-sm" v-if="priceReservation">
                {{ reservationCount[index] }}
              </p>
            </div>
          </div>
          <div class="bg-white/60 p-4 rounded-lg shadow-sm w-full space-y-4">
            <div class="flex justify-between items-center">
              <p>Total Bookings</p>
            </div>
            <p class="text-4xl text-[#FF5B00]">{{ totalBookings }}</p>
            <div
              class="text-sm flex justify-between items-center"
              v-for="(b, index) in bookings?.agents"
              :key="index"
            >
              <p class="text-sm">{{ b }}</p>
              <p class="text-[#FF5B00] text-sm">
                {{ bookingsCount[index] }}
              </p>
            </div>
          </div>
          <div class="bg-white/60 p-4 rounded-lg shadow-sm w-full space-y-4">
            <div class="flex justify-between items-center">
              <p>Sales by Agent</p>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  @click="togglePriceSales"
                  value=""
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"
                ></div>
              </label>
            </div>
            <p class="text-4xl text-[#FF5B00]" v-if="!priceSales">
              {{ totalSales }}
            </p>
            <p class="text-4xl text-[#FF5B00]" v-if="priceSales">
              {{ totalSalesPrice }}
            </p>
            <div
              class="text-sm flex justify-between items-center"
              v-for="(s, index) in sales?.agents"
              :key="index"
            >
              <p class="text-sm">{{ s }}</p>
              <p class="text-[#FF5B00] text-sm" v-if="!priceSales">
                {{ salesAmount[index] }}
              </p>
              <p class="text-[#FF5B00] text-sm" v-if="priceSales">
                {{ salesCount[index] }}
              </p>
            </div>
          </div>
        </div>
        <div class="py-5 bg-white/60 rounded-md shadow-sm p-4 mt-4">
          <div class="grid grid-cols-1 md:grid-cols-1 gap-1 md:gap-4 mb-3">
            <div
              class="bg-white/60 px-6 py-4 rounded-md shadow-lg backdrop-blur-lg backdrop-filter"
            >
              <p class="text-gray-600 mb-3 font-medium tracking-wide">Sales</p>
              <LineChart :chartData="saleData" />
            </div>
            <!-- <div
              class="bg-white/60 px-6 py-4 rounded-md shadow-lg backdrop-blur-lg backdrop-filter"
            >
              <p class="text-gray-600 mb-3 font-medium tracking-wide">
                Expenses
              </p>
              <PieChart :chartData="saleData" />
            </div>
            <div
              class="bg-white/60 px-6 py-4 rounded-md shadow-lg backdrop-blur-lg backdrop-filter"
            >
              <p class="text-gray-600 mb-3 font-medium tracking-wide">
                Payable & Recievables
              </p>
              <BarChart :chartData="saleData" />
            </div>
            <div
              class="bg-white/60 px-6 py-4 rounded-md shadow-lg backdrop-blur-lg backdrop-filter"
            >
              <p class="text-gray-600 mb-3 font-medium tracking-wide">
                Booking Share
              </p>
              <DoughnutChart :chartData="saleData" />
            </div> -->
          </div>
        </div>
      </div>
      <div class="bg-white/60 rounded-md shadow-sm p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-gray-600 text-xl font-medium tracking-wide mb-1">
            Reservations
          </h3>
        </div>
        <div class="flex justify-start items-center gap-4 mb-3">
          <div class="space-y-1">
            <p class="text-xs">Payment Status</p>
            <select
              name=""
              id=""
              class="bg-white border border-gray-100 rounded-sm w-40 px-2 py-1 text-xs"
            >
              <option value="">confirm</option>
            </select>
          </div>
          <div class="space-y-1">
            <p class="text-xs">Reservation Status</p>
            <select
              name=""
              id=""
              class="bg-white border border-gray-100 rounded-sm w-40 px-2 py-1 text-xs"
            >
              <option value="">confirm</option>
            </select>
          </div>
        </div>
        <div class="space-y-3">
          <div
            class="bg-white/60 p-4 shadow-sm rounded-lg flex items-center justify-between"
            v-for="(l, index) in reservationsHome?.agents"
            :key="index"
          >
            <div class="">
              <!-- <p class="text-gray-500 text-sm font-medium tracking-wide">
                Van Tour
              </p> -->
              <p class="text-gray-600 text-lg tracking-wide font-medium">
                {{ l }}
              </p>
            </div>
            <div>
              <p class="text-2xl font-medium text-[#ff613c] tracking-wide">
                {{ reservationCount[index] }} thb
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="bg-white/60 rounded-md shadow-sm p-4 w-full h-full"></div> -->
    </div>
  </Layout>
</template>
