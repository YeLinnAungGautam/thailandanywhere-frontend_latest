<template>
  <div>
    <VueApexCharts :options="chartOptions" :series="series" type="treemap" />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import VueApexCharts from "vue3-apexcharts";

const series = [
  {
    data: [
      {
        x: "INTC",
        y: 1.2,
      },
      {
        x: "GS",
        y: 0.4,
      },
      {
        x: "CVX",
        y: -1.4,
      },
      {
        x: "GE",
        y: 2.7,
      },
      {
        x: "CAT",
        y: -0.3,
      },
      {
        x: "RTX",
        y: 5.1,
      },
    ],
  },
];

const chartOptions = {
  legend: { show: false },
  chart: { height: 650 },
  title: { text: "" },
  // Define a color scale for the treemap segments
  plotOptions: {
    treemap: {
      enableShades: true,
      shadeIntensity: 0.5,
      reverseNegativeShade: true,
      colorScale: {
        ranges: [
          {
            from: -6,
            to: 0,
            color: "#ff613c",
          },
          {
            from: 0.001,
            to: 6,
            color: "#ff6000",
          },
        ],
      },
    },
  },
};

onMounted(() => {
  console.log("hello");
});
</script>
