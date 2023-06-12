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
import { Chart, registerables } from "chart.js";
import {
  ArchiveBoxIcon,
  CalendarIcon,
  UsersIcon,
} from "@heroicons/vue/24/outline";

Chart.register(...registerables);

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
      backgroundColor: ["#2563EB"],
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
</script>

<template>
  <Layout>
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
        <div class="flex items-center justify-between gap-3">
          <div class="bg-white/60 p-6 rounded-lg shadow-sm w-full">
            <div>
              <h3 class="text-gray-600 text-xl font-medium tracking-wide mb-1">
                Sales
              </h3>
              <p
                class="text-blue-500 text-3xl font-medium tracking-wide font-roboto"
              >
                80.5k
              </p>
            </div>
          </div>
          <div class="bg-white/60 p-6 rounded-lg shadow-sm w-full">
            <div>
              <h3 class="text-gray-600 text-xl font-medium tracking-wide mb-1">
                Gross
              </h3>
              <p
                class="text-blue-500 text-3xl font-medium tracking-wide font-roboto"
              >
                35.0k
              </p>
            </div>
          </div>
          <div class="bg-white/60 p-6 rounded-lg shadow-sm w-full">
            <div>
              <h3 class="text-gray-600 text-xl font-medium tracking-wide mb-1">
                Recievables
              </h3>
              <p
                class="text-blue-500 text-3xl font-medium tracking-wide font-roboto"
              >
                20.0k
              </p>
            </div>
          </div>
          <div class="bg-white/60 p-6 rounded-lg shadow-sm w-full">
            <div>
              <h3 class="text-gray-600 text-xl font-medium tracking-wide mb-1">
                Payables
              </h3>
              <p
                class="text-blue-500 text-3xl font-medium tracking-wide font-roboto"
              >
                15.0k
              </p>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 mb-3">
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
        </div>
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
