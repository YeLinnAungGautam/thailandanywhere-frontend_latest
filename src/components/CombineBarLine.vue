<template>
  <div>
    <BarChart ref="barChartRef" :chartData="testData" :options="options" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { BarChart, LineChart } from "vue-chart-3";

const data1 = [30, 40, 60, 70, 5];
const data2 = [20, 30, 40, 30, 3];
const data3 = [10, 10, 20, 40, 2];

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Bar Chart with Multiple Datasets",
    },
  },
  // Adjust the width and spacing of bars
  scales: {
    x: {
      barPercentage: 0.3, // Adjust bar width
      categoryPercentage: 0.7, // Adjust spacing between bars
    },
  },
};

const testData = computed(() => ({
  labels: ["Paris", "Nîmes", "Toulon", "Perpignan", "Autre"],
  datasets: [
    {
      label: "Dataset 1",
      type: "line",
      data: data1,
      backgroundColor: "rgba(255, 99, 132, 0.2)", // Set background color for dataset 1
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    },
    {
      label: "Dataset 2",
      type: "bar",
      data: data2,
      backgroundColor: "rgba(54, 162, 235, 0.2)", // Set background color for dataset 2
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
    },
    {
      label: "Dataset 3",
      type: "bar",
      data: data3,
      backgroundColor: "rgba(255, 206, 86, 0.2)", // Set background color for dataset 3
      borderColor: "rgba(255, 206, 86, 1)",
      borderWidth: 1,
    },
  ],
}));
</script>
