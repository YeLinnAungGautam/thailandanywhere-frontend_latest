<template>
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
</template>

<script setup>
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

<style lang="scss" scoped></style>
