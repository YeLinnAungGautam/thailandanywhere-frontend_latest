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

const testData = {
  labels: ["Paris", "Nîmes", "Toulon", "Perpignan", "Autre"],
  datasets: [
    {
      data: [30, 40, 60, 70, 5],
      backgroundColor: ["#77CEFF", "#0079AF", "#123E6B", "#97B0C4", "#A5C8ED"],
    },
  ],
};
</script>

<template>
  <Layout>
    <div class="mb-5">
      <h3 class="text-2xl font-medium text-gray-600">Dashboard</h3>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-1 md:gap-4 mb-5">
      <div
        class="bg-white/60 p-6 rounded-lg shadow-sm mb-5 flex justify-between"
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
        class="bg-white/60 p-6 rounded-lg shadow-sm mb-5 flex justify-between"
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
            +18
          </p>
        </div>
      </div>
      <div
        class="bg-white/60 p-6 rounded-lg shadow-sm mb-5 flex justify-between"
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
        class="bg-white/60 p-6 rounded-lg shadow-sm mb-5 flex justify-between"
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
    </div>
  </Layout>
</template>
