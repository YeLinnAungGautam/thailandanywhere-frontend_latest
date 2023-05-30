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
    <div class="grid grid-cols-2 gap-4 mb-5">
      <div
        class="bg-white px-4 py-8 rounded-lg shadow-lg flex items-center justify-center backdrop-blur-lg backdrop-filter"
      >
        <DoughnutChart :chartData="testData" class="w-[400px]" />
      </div>
      <div
        class="bg-white px-4 py-8 rounded-md shadow-lg backdrop-blur-lg backdrop-filter"
      >
        <BarChart :chartData="testData" />
      </div>
      <div
        class="bg-white px-4 py-8 rounded-md shadow-lg backdrop-blur-lg backdrop-filter"
      >
        <LineChart :chartData="testData" />
      </div>
      <div
        class="bg-white px-4 py-8 rounded-md shadow-lg backdrop-blur-lg backdrop-filter"
      >
        <PieChart :chartData="testData" />
      </div>
      <div
        class="bg-white px-4 py-8 rounded-md shadow-lg backdrop-blur-lg backdrop-filter"
      >
        <PolarAreaChart :chartData="testData" />
      </div>
      <div
        class="bg-white px-4 py-8 rounded-md shadow-lg backdrop-blur-lg backdrop-filter"
      >
        <RadarChart :chartData="testData" />
      </div>
      <div
        class="bg-white px-4 py-8 rounded-md shadow-lg backdrop-blur-lg backdrop-filter"
      >
        <BubbleChart :chartData="testData" />
      </div>
      <div
        class="bg-white px-4 py-8 rounded-md shadow-lg backdrop-blur-lg backdrop-filter"
      >
        <ScatterChart :chartData="testData" />
      </div>
    </div>
  </Layout>
</template>
