<template>
  <div>
    <div
      class="bg-white/60 col-span-3 px-6 py-4 rounded-md shadow-lg backdrop-blur-lg backdrop-filter"
    >
      <div class="flex justify-between items-center">
        <div>
          <p
            class="text-gray-600 mb-3 font-medium tracking-wide"
            v-if="priceSalesGraph"
          >
            General Sales
          </p>
          <p
            class="text-gray-600 mb-3 font-medium tracking-wide"
            v-if="!priceSalesGraph"
          >
            Sale by Employee
          </p>
        </div>
        <div class="flex justify-end items-center gap-3">
          <input
            type="month"
            name=""
            v-model="monthForGraph"
            class="bg-white text-sm w-[200px] px-2 py-2"
            id=""
          />
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              @click="togglePriceSalesGraph"
              value=""
              class="sr-only peer"
            />
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"
            ></div>
          </label>
        </div>
      </div>
      <LineChart :chartData="saleData" v-if="priceSalesGraph" />
      <LineChart :chartData="saleDataAgent" v-if="!priceSalesGraph" />
    </div>
  </div>
</template>

<script setup>
import { LineChart } from "vue-chart-3";
import { useHomeStore } from "../stores/home";
import { Chart, registerables } from "chart.js";
import { ref, watch } from "vue";

const homeStore = useHomeStore();
const dataTest = reactive({ items: [] });
const dataAmount = reactive({ items: [] });

const saleData = {
  labels: dataTest.items,
  datasets: [
    {
      label: "General Sales",
      data: dataAmount.items,
      backgroundColor: ["#FF0000"],
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

const saleValueAgent = reactive({ items: [] });
const saleValueKoNayMyo = reactive({ items: [] });
const saleValueChitSu = reactive({ items: [] });
const saleValueEiMyat = reactive({ items: [] });
const saleValueChaw = reactive({ items: [] });

const saleDataAgent = {
  labels: dataTest.items,
  datasets: [
    {
      label: "Hnin N",
      data: saleValueAgent.items,
      backgroundColor: ["#FF0000"],
    },
    {
      label: "Ko Nay Myo",
      data: saleValueKoNayMyo.items,
      backgroundColor: ["#0032FF"],
    },
    {
      label: "Chit Su",
      data: saleValueChitSu.items,
      backgroundColor: ["#FF00B2"],
    },
    {
      label: "Ei Myat",
      data: saleValueEiMyat.items,
      backgroundColor: ["#00FFF7"],
    },
    {
      label: "Chaw Kalayar",
      data: saleValueChaw.items,
      backgroundColor: ["#FFE400"],
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

const monthForGraph = ref("");
const currentMonth = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");

  monthForGraph.value = `${year}-${month}`;
};

watch(monthForGraph, async (newValue) => {
  getAllDays(monthForGraph.value);
});
</script>
