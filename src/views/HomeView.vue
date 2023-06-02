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
    <div class="mb-5">
      <h3 class="text-2xl font-medium text-gray-600">Dashboard</h3>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-1 md:gap-4 mb-5">
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
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 mb-5">
      <div
        class="bg-white/60 px-6 py-4 rounded-md shadow-lg backdrop-blur-lg backdrop-filter"
      >
        <p class="text-gray-600 mb-3 font-medium tracking-wide">Sales Today</p>
        <BarChart :chartData="saleData" />
      </div>
      <div
        class="bg-white/60 px-6 py-4 rounded-md shadow-lg backdrop-blur-lg backdrop-filter"
      >
        <p class="text-gray-600 mb-3 font-medium tracking-wide">
          Today Expenses
        </p>
        <BarChart :chartData="saleData" />
      </div>
    </div>
  </Layout>
</template>
