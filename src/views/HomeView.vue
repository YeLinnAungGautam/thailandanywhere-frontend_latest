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
import { onMounted } from "vue";

// import { Chart, registerables } from "chart.js";
// import {
//   ArchiveBoxIcon,
//   CalendarIcon,
//   UsersIcon,
// } from "@heroicons/vue/24/outline";

// Chart.register(...registerables);

const authStore = useAuthStore();
const vantourStore = useVantourStore();
const grouptourStore = useGrouptourStore();
const airportStore = useAirportStore();
const entranceStore = useEntranceStore();
const bookingStore = useBookingStore();

const { vantours, loading } = storeToRefs(vantourStore);
const { grouptours } = storeToRefs(grouptourStore);
const { airports } = storeToRefs(airportStore);
const { entrances } = storeToRefs(entranceStore);
const { bookings } = storeToRefs(bookingStore);

// const saleData = {
//   labels: [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ],
//   datasets: [
//     {
//       label: "Sales",
//       data: [
//         1000, 1200, 900, 1500, 1800, 1300, 2000, 2200, 1700, 1900, 2300, 2100,
//       ],
//       backgroundColor: ["#2563EB"],
//     },
//   ],
//   options: {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   },
// };
onMounted(async () => {
  await vantourStore.getSimpleListAction();
  await grouptourStore.getSimpleListAction();
  await airportStore.getSimpleListAction();
  await entranceStore.getSimpleListAction();
  await bookingStore.getSimpleListAction();
  console.log(vantours.value);
});
</script>

<template>
  <Layout :title="`Welcome back, ${authStore.user.name.split(' ')[0]}!`">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 mb-3">
      <div class="col-span-2">
        <div
          class="flex items-center justify-between py-3 bg-white/60 rounded-md shadow-sm p-4 mb-4"
        >
          <p class="text-gray-600 font-medium tracking-wider">Filter by:</p>
          <div>
            <select
              class="border-2 p-2 rounded-md focus:outline-none focus:ring-0"
            >
              <option value="10">Last 30 Days</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white/60 p-6 rounded-lg shadow-sm w-full">
            <router-link to="/products/0">
              <div>
                <h3
                  class="text-gray-600 text-xl font-medium tracking-wide mb-1"
                >
                  Van Tour
                </h3>
                <p
                  class="text-blue-500 text-3xl font-medium tracking-wide font-roboto"
                >
                  {{ vantours?.data.length }}
                </p>
              </div>
            </router-link>
          </div>
          <div class="bg-white/60 p-6 rounded-lg shadow-sm w-full">
            <router-link to="products/3">
              <div>
                <h3
                  class="text-gray-600 text-xl font-medium tracking-wide mb-1"
                >
                  Group Tour
                </h3>
                <p
                  class="text-blue-500 text-3xl font-medium tracking-wide font-roboto"
                >
                  {{ grouptours?.data.length }}
                </p>
              </div>
            </router-link>
          </div>
          <div class="bg-white/60 p-6 rounded-lg shadow-sm w-full">
            <router-link to="/products/1">
              <div>
                <h3
                  class="text-gray-600 text-xl font-medium tracking-wide mb-1"
                >
                  Airport pickup
                </h3>
                <p
                  class="text-blue-500 text-3xl font-medium tracking-wide font-roboto"
                >
                  {{ airports?.data.length }}
                </p>
              </div>
            </router-link>
          </div>
          <div class="bg-white/60 p-6 rounded-lg shadow-sm w-full">
            <router-link to="/products/2">
              <div>
                <h3
                  class="text-gray-600 text-xl font-medium tracking-wide mb-1"
                >
                  Entrance Ticket
                </h3>
                <p
                  class="text-blue-500 text-3xl font-medium tracking-wide font-roboto"
                >
                  {{ entrances?.data.length }}
                </p>
              </div>
            </router-link>
          </div>
          <div class="bg-white/60 p-6 rounded-lg shadow-sm w-full col-span-2">
            <router-link to="bookings">
              <div class="">
                <h3
                  class="text-gray-600 text-xl font-medium tracking-wide mb-1"
                >
                  Booking List Count
                </h3>
                <p
                  class="text-blue-500 text-3xl font-medium tracking-wide font-roboto"
                >
                  {{ bookings?.data.length }}
                </p>
              </div>
            </router-link>
          </div>
        </div>
        <!-- <div class="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 mb-3">
          <div
            class="bg-white/60 px-6 py-4 rounded-md shadow-lg backdrop-blur-lg backdrop-filter"
          >
            <p class="text-gray-600 mb-3 font-medium tracking-wide">Sales</p>
            <BarChart :chartData="saleData" />
          </div>
          <div
            class="bg-white/60 px-6 py-4 rounded-md shadow-lg backdrop-blur-lg backdrop-filter"
          >
            <p class="text-gray-600 mb-3 font-medium tracking-wide">Expenses</p>
            <BarChart :chartData="saleData" />
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
          </div>
        </div> -->
      </div>
      <div class="bg-white/60 rounded-md shadow-sm p-4">
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-gray-600 text-xl font-medium tracking-wide mb-1">
            Operations
          </h3>
          <p class="text-gray-400 text-base font-medium tracking-wide mb-1">
            Sales
          </p>
        </div>
        <div class="space-y-3">
          <div
            class="bg-white/60 p-4 shadow-sm rounded-lg flex items-center justify-between"
          >
            <div class="">
              <p class="text-gray-500 text-sm font-medium tracking-wide">
                1 - Van - Pattaya
              </p>
              <p class="text-gray-600 text-lg tracking-wide font-medium">
                Victor
              </p>
            </div>
            <div>
              <p class="text-2xl font-medium text-gray-600 tracking-wide">
                4500 THB
              </p>
            </div>
          </div>
          <div
            class="bg-white/60 p-4 shadow-sm rounded-lg flex items-center justify-between"
          >
            <div class="">
              <p class="text-gray-500 text-sm font-medium tracking-wide">
                4 rooms - Double Bed
              </p>
              <p class="text-gray-600 text-lg tracking-wide font-medium">
                Chatrium Hotel
              </p>
            </div>
            <div>
              <p class="text-2xl font-medium text-gray-600 tracking-wide">
                20K THB
              </p>
            </div>
          </div>
          <div
            class="bg-white/60 p-4 shadow-sm rounded-lg flex items-center justify-between"
          >
            <div class="">
              <p class="text-gray-500 text-sm font-medium tracking-wide">
                1 pax - Group Tour
              </p>
              <p class="text-gray-600 text-lg tracking-wide font-medium">
                Pattaya
              </p>
            </div>
            <div>
              <p class="text-2xl font-medium text-gray-600 tracking-wide">
                1950 THB
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="grid grid-cols-1 md:grid-cols-4 gap-1 md:gap-4 mb-5">
      <div
        class="bg-white/60 p-6 rounded-lg shadow-sm mb-5 flex justify-start gap-5"
      >
        <div class="text-gray-500 shadow-lg p-4 rounded-lg">
          <ArchiveBoxIcon class="w-10 h-10" />
        </div>
        <div>
          <h3 class="text-gray-600 text-xl font-medium tracking-wide mb-1">
            Total Products
          </h3>
          <p
            class="text-blue-500 text-2xl font-medium tracking-wide font-roboto"
          >
            +138
          </p>
        </div>
      </div>
      <div
        class="bg-white/60 p-6 rounded-lg shadow-sm mb-5 flex justify-start gap-5"
      >
        <div class="text-gray-500 shadow-lg p-4 rounded-lg">
          <CalendarIcon class="w-10 h-10" />
        </div>
        <div>
          <h3 class="text-gray-600 text-xl font-medium tracking-wide mb-1">
            Total Booking
          </h3>
          <p
            class="text-blue-500 text-2xl font-medium tracking-wide font-roboto"
          >
            +19
          </p>
        </div>
      </div>
      <div
        class="bg-white/60 p-6 rounded-lg shadow-sm mb-5 flex justify-start gap-5"
      >
        <div class="text-gray-500 shadow-lg p-4 rounded-lg">
          <UsersIcon class="w-10 h-10" />
        </div>
        <div>
          <h3 class="text-gray-600 text-xl font-medium tracking-wide mb-1">
            Total Customers
          </h3>
          <p
            class="text-blue-500 text-2xl font-medium tracking-wide font-roboto"
          >
            +1400
          </p>
        </div>
      </div>
      <div
        class="bg-white/60 p-6 rounded-lg shadow-sm mb-5 flex justify-start gap-5"
      >
        <div class="text-gray-500 shadow-lg p-4 rounded-lg">
          <ArchiveBoxIcon class="w-10 h-10" />
        </div>
        <div>
          <h3 class="text-gray-600 text-xl font-medium tracking-wide mb-1">
            Total Expenses
          </h3>
          <p
            class="text-blue-500 text-2xl font-medium tracking-wide font-roboto"
          >
            +132
          </p>
        </div>
      </div>
    </div> -->
  </Layout>
</template>
