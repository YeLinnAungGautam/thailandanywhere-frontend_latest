<script setup>
import Layout from "./Layout.vue";
import { useRouter } from "vue-router";
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
import { onMounted, reactive, ref, watch } from "vue";
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
const router = useRouter();

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
  loading,
} = storeToRefs(homeStore);

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

const agentColors = [
  "#FF0000",
  "#0032FF",
  "#04FF00",
  "#00FFF7",
  "#FFE400",
  "#0027FF",
  "#C500FF",
  "#FF00A2",
  "#00BDFF",
];

// const saleDataAgent = {
//   labels: dataTest.items,
//   datasets: [
//     {
//       label: "Hnin N",
//       data: saleValueAgent.items,
//       backgroundColor: ["#FF0000"],
//     },
//     {
//       label: "Ko Nay Myo",
//       data: saleValueKoNayMyo.items,
//       backgroundColor: ["#0032FF"],
//     },
//     {
//       label: "Chit Su",
//       data: saleValueChitSu.items,
//       backgroundColor: ["#04FF00"],
//     },
//     {
//       label: "Ei Myat",
//       data: saleValueEiMyat.items,
//       backgroundColor: ["#00FFF7"],
//     },
//     {
//       label: "Chaw Kalayar",
//       data: saleValueChaw.items,
//       backgroundColor: ["#FFE400"],
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

const saleDataAgent = {
  labels: [],
  datasets: [],
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

const getAllDays = async (monthGet) => {
  console.log(monthGet, "this is month");
  const res = await homeStore.getTimeFilterArray(monthGet);
  console.log(res, "this is for graph");

  dataAmount.items.splice(0);
  saleValueAgent.items.splice(0);
  saleValueKoNayMyo.items.splice(0);
  saleValueChitSu.items.splice(0);
  saleValueEiMyat.items.splice(0);
  saleValueChaw.items.splice(0);
  dataTest.items.splice(0);
  for (let x = 0; x < res.result.sales.length; x++) {
    let dataArr = 0;

    for (let i = 0; i < res.result.sales[x].agents.length; i++) {
      dataArr += res.result.sales[x].agents[i].total;
    }
    dataAmount.items.push(dataArr);
    dataTest.items.push(res.result.sales[x].date);
  }
  res.result.sales.forEach((sale) => {
    saleDataAgent.labels.push(sale.date);
    sale.agents.forEach((agent, index) => {
      const existingDataset = saleDataAgent.datasets.find(
        (dataset) => dataset.label === agent.name
      );

      if (existingDataset) {
        existingDataset.data.push(agent.total);
      } else {
        saleDataAgent.datasets.push({
          label: agent.name,
          data: [agent.total],
          backgroundColor: [agentColors[index]],
        });
      }
    });
  });
  console.log(saleDataAgent);
};

const isError = ref(false);
const dataRes = reactive({ items: [] });
const dataAmountRes = reactive({ items: [] });
const dateRes = reactive({ items: [] });

const saleDataRes = {
  labels: dateRes.items,
  datasets: [
    {
      label: "Reservations",
      data: dataAmountRes.items,
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

const dataPie = reactive({ items: [] });
const dataPieQ = reactive({ items: [] });
const hotelPieData = {
  labels: dataPie.items,
  datasets: [
    {
      label: "Most Selling Hotels",
      data: dataPieQ.items,
      backgroundColor: [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)",
        "rgb(255,0,0)",
        "rgb(89, 245, 0 )",
        "rgb(9, 244, 255)",
        "rgb(4, 0, 255)",
        "rgb(200, 41, 255)",
        "rgb(255, 0, 224 )",
        "rgb(255, 247, 0)",
      ],
      hoverOffset: 4,
    },
  ],
};

const getfun = async () => {
  const res = await homeStore.getSaleAgent();
  // console.log(sales.value, salesAmount.value);
};

const getBookingCount = async () => {
  const res = await homeStore.getBookingCount();
};
const getSaleCountHandle = async () => {
  const res = await homeStore.getSaleCount();
  // console.log(res, "this is get sales");
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
  // console.log(priceReservation.value);
};
const priceSales = ref(true);
const togglePriceSales = async () => {
  priceSales.value = !priceSales.value;
  // console.log(priceSales.value);
};

const priceSalesGraph = ref(true);
const togglePriceSalesGraph = async () => {
  priceSalesGraph.value = !priceSalesGraph.value;
};

const hotelPerDay = ref(true);
const toggleHotalSales = () => {
  hotelPerDay.value = !hotelPerDay.value;
  if (hotelPerDay.value) {
    getHotelMostSelling(hotelSaleDate.value);
    console.log(hotelSaleDate.value, "this is date for hotel");
  } else {
    getHotelMostSelling(onlyMonth(hotelSaleDate.value));
  }
};

const onlyMonth = (dateString) => {
  return dateString.slice(0, 7); // Extracts the substring from index 0 to 6
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
  // console.log(date.value);

  if (!date.value) {
    // window.location.reload();

    date.value = dateFormat(date.value);

    // console.log(date.value);
    await getSaleCountHandle();
    await getfun();
    await getReservationCount();
    await getBookingCount();
  } else {
    startDate.value = dateFormat(date.value);
    // endDate.value = date.value[1] != null ? dateFormat(date.value[1]) : "";
    let data = {
      startDate: startDate.value,
    };

    const res = await homeStore.getTimeFilter(data);
    // console.log(loading.value, res, "this is res");
  }
};

const change = (a) => {
  let rate = `${sales.value.agents[Object.keys(sales.value.agents)[a]]}`;
  return rate;
};
const changeValue = (a) => {
  let ratev = `${sales.value.amount[Object.keys(sales.value.amount)[a]]}`;
  return ratev;
};
const changer = (a) => {
  let rate = `${
    reservationsHome.value.agents[Object.keys(reservationsHome.value.agents)[a]]
  }`;
  return rate;
};
const changeValuer = (a) => {
  let ratev = `${
    reservationsHome.value.prices[Object.keys(reservationsHome.value.prices)[a]]
  }`;
  return ratev;
};

const dateArrFromSelect = ref([]);
const loopData = ref([]);
const monthForGraph = ref("");

const currentMonth = () => {
  const currentDate = new Date();
  hotelSaleDate.value = dateFormat(currentDate);
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");

  monthForGraph.value = `${year}-${month}`;
};

const hotelSaleDate = ref("");
const hotelCondition = ref(false);
const getHotelMostSelling = async (a) => {
  const res = await homeStore.getHotelMostSell({ service_date: a });
  console.log(res, "this is hotel");
  hotelCondition.value = res.result.length == 0 ? true : false;
  dataPie.items.splice(0);
  dataPieQ.items.splice(0);
  for (let i = 0; i < res.result.length; i++) {
    dataPie.items.push(res.result[i].hotel_name);
    dataPieQ.items.push(res.result[i].total_bookings);
  }
};

onMounted(async () => {
  // console.log(authStore.isSuperAdmin, "hello");
  if (!authStore.isSuperAdmin) {
    router.push({ name: "dashboard" });
  }
  // generateDateArray();
  date.value = dateFormat(new Date());
  if (date.value) {
    await dateFun();
  }
  // getSaleAgentData();
  currentMonth();
  // console.log(hotelSaleDate.value, "this is current date");
  toggleHotalSales();
});

watch(monthForGraph, async (newValue) => {
  getAllDays(monthForGraph.value);
});
watch(hotelSaleDate, async (newValue) => {
  toggleHotalSales();
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
        <div class="grid grid-cols-3 gap-4" v-if="!loading">
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
          <div
            class="bg-white/60 p-4 rounded-lg shadow-sm w-full space-y-4 hidden"
          >
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
        <div class="grid grid-cols-1 gap-4" v-if="loading">
          <div
            class="bg-white/60 p-4 rounded-lg shadow-sm w-full space-y-4 h-[500px] flex justify-center items-center"
          >
            There isn't Data
          </div>
        </div>
      </div>
      <div class="bg-white/60 rounded-md shadow-sm p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-gray-600 text-xl font-medium tracking-wide mb-1">
            Reservations
          </h3>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-3">
          <div class="space-y-1">
            <p class="text-xs">Payment Status</p>
            <select
              name=""
              id=""
              class="bg-white border border-gray-100 rounded-sm w-full px-2 py-1 text-xs"
            >
              <option value="">confirm</option>
            </select>
          </div>
          <div class="space-y-1">
            <p class="text-xs">Reservation Status</p>
            <select
              name=""
              id=""
              class="bg-white border border-gray-100 rounded-sm w-full px-2 py-1 text-xs"
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
      <div class="py-5 col-span-4 mt-4">
        <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-3">
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
          <div class="bg-white/10 col-span-3">
            <div class="grid grid-cols-2 gap-6">
              <div
                class="py-6 rounded-md shadow-lg backdrop-blur-lg backdrop-filter px-3 bg-white/60"
              >
                <div class="flex justify-between items-center">
                  <p class="text-gray-600 font-medium tracking-wide">
                    Most selling Hotels
                  </p>

                  <div class="flex justify-center items-center gap-4">
                    <p class="text-xs font-semibold">By day</p>
                    <label
                      v-if="hotelPerDay"
                      class="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value=""
                        class="sr-only peer"
                        @click="toggleHotalSales"
                      />
                      <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"
                      ></div>
                    </label>
                    <label
                      v-if="!hotelPerDay"
                      class="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value=""
                        checked
                        class="sr-only peer"
                        @click="toggleHotalSales"
                      />
                      <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"
                      ></div>
                    </label>
                    <p class="text-xs font-semibold">By Month</p>
                  </div>
                  <div class="">
                    <input
                      type="date"
                      v-model="hotelSaleDate"
                      name=""
                      class="bg-white text-sm w-[200px] px-2 py-2"
                      id=""
                    />
                  </div>
                </div>
                <PieChart :chartData="hotelPieData" v-if="!hotelCondition" />
                <div v-if="hotelCondition" class="">
                  <p
                    class="w-full text-red-600 h-72 flex justify-center items-center"
                  >
                    Empty hotel booking
                  </p>
                </div>
              </div>
              <!-- <div
                class="py-6 rounded-md shadow-lg backdrop-blur-lg backdrop-filter px-3 bg-white/60"
              >
                <p class="text-gray-600 mb-3 font-medium tracking-wide">
                  Most selling Hotels
                </p>
                <PieChart :chartData="hotelPieData" />
              </div> -->
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="bg-white/60 rounded-md shadow-sm p-4 w-full h-full"></div> -->
    </div>
  </Layout>
</template>
