<script setup>
import Layout from "./Layout.vue";
import { useRoute, useRouter } from "vue-router";
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
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useHomeStore } from "../stores/home";
import HomeFirstPartVue from "../components/HomeFirstPart.vue";
import HomeSecondPartVue from "../components/HomeSecondPart.vue";
import axios from "axios";
// import CombineBarLineVue from "../components/CombineBarLine.vue";
import VueApexCharts from "vue3-apexcharts";
import SaleByAgent from "../components/SaleByAgent.vue";
import TopSellingProductVue from "../components/TopSellingProduct.vue";
import SaleAgentReportByDate from "../components/SaleAgentReportByDate.vue";
import ReservationPartHome from "../components/homeReservation/ReservationPartHome.vue";

import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";

import { Chart, registerables } from "chart.js";

import {
  ArchiveBoxIcon,
  CalendarIcon,
  HeartIcon,
  SquaresPlusIcon,
  PuzzlePieceIcon,
  UsersIcon,
} from "@heroicons/vue/24/outline";
import ReservationCalendarHome from "./Dashboard/ReservationCalendarHome.vue";
import { useSidebarStore } from "../stores/sidebar";
import { formattedDate } from "./help/FormatData";

Chart.register(...registerables);

const authStore = useAuthStore();
const vantourStore = useVantourStore();
const grouptourStore = useGrouptourStore();
const airportStore = useAirportStore();
const entranceStore = useEntranceStore();
const bookingStore = useBookingStore();
const homeStore = useHomeStore();
const router = useRouter();
const route = useRoute();
const sidebarStore = useSidebarStore();
const { isShowSidebar } = storeToRefs(sidebarStore);

const { loading } = storeToRefs(homeStore);

const dataTest = reactive({ items: [] });
const dataAmount = reactive({ items: [] });
const dataPaid = reactive({ items: [] });
const dataNotPaid = reactive({ items: [] });

const totalSaleForShow = computed(() => {
  if (dataAmount.items.length > 0) {
    let total = 0;
    for (let i = 0; i < dataAmount.items.length; i++) {
      total += dataAmount.items[i];
    }
    return total;
  }
  return 0;
});

const saleData = {
  labels: dataTest.items,
  datasets: [
    {
      label: "Total Sales",
      type: "line",
      data: dataAmount.items,
      backgroundColor: "rgb(255, 87, 51)", // Set background color for dataset 1
      borderColor: "rgb(255, 87, 51)",
      borderWidth: 1,
    },
    {
      label: "Fully Paid",
      type: "bar",
      data: dataPaid.items,
      backgroundColor: "rgb(17, 223, 0)", // Set background color for dataset 2
      borderColor: "rgb(17, 223, 0)",
      borderWidth: 1,
    },
    {
      label: "Not Paid",
      type: "bar",
      data: dataNotPaid.items,
      backgroundColor: "rgb(223, 0, 0 )", // Set background color for dataset 3
      borderColor: "rgb(223, 0, 0 )",
      borderWidth: 1,
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

const saleDataAgent = {
  labels: [],
  datasets: [],
};

const saleDataAgentOption = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    tooltip: {
      callbacks: {
        footer: function (a) {
          console.log(a, "this is a footer");
          return `Booking - ${a[0].dataset.dataforFooter[a[0].dataIndex]}`;
        },
      },
    },
  },
};

const totalByAgent = reactive({ items: [] });
const paidByAgent = reactive({ items: [] });
const notPaidAgent = reactive({ items: [] });
const AgentName = ref([]);
const saleDataByAgent = {
  labels: [],
  datasets: [
    {
      label: "Total Sales",
      type: "line",
      data: totalByAgent.items,
      footerForCount: [],
      backgroundColor: "rgb(255, 87, 51)", // Set background color for dataset 1
      borderColor: "rgb(255, 87, 51)",
      borderWidth: 1,
    },
    {
      label: "Fully Paid",
      type: "bar",
      data: paidByAgent.items,
      backgroundColor: "rgb(17, 223, 0)", // Set background color for dataset 2
      borderColor: "rgb(17, 223, 0)",
      borderWidth: 1,
    },
    {
      label: "Not Paid",
      type: "bar",
      data: notPaidAgent.items,
      backgroundColor: "rgb(223, 0, 0 )", // Set background color for dataset 3
      borderColor: "rgb(223, 0, 0 )",
      borderWidth: 1,
    },
  ],
};
const saleDataByAgentOption = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const totalBookingsForShow = ref(0);
const getAllDays = async (monthGet) => {
  console.log(monthGet, "this is month");
  const res = await homeStore.getTimeFilterArray(monthGet);
  console.log(res, "this is for graph");

  dataAmount.items.splice(0);
  dataPaid.items.splice(0);
  dataNotPaid.items.splice(0);
  saleValueAgent.items.splice(0);
  saleValueKoNayMyo.items.splice(0);
  saleValueChitSu.items.splice(0);
  saleValueEiMyat.items.splice(0);
  saleValueChaw.items.splice(0);
  dataTest.items.splice(0);
  totalBookingsForShow.value = 0;

  for (let x = 0; x < res.result.sales.length; x++) {
    let dataArr = 0;
    let dataPaidArr = 0;
    let dataNotPaidArr = 0;

    for (let i = 0; i < res.result.sales[x].agents.length; i++) {
      dataArr += res.result.sales[x].agents[i].total;
    }
    for (let i = 0; i < res.result.sales[x].agents.length; i++) {
      dataPaidArr += res.result.sales[x].agents[i].total_deposit;
    }
    for (let i = 0; i < res.result.sales[x].agents.length; i++) {
      dataNotPaidArr += res.result.sales[x].agents[i].total_balance;
    }
    dataAmount.items.push(dataArr);
    dataPaid.items.push(dataPaidArr);
    dataNotPaid.items.push(dataNotPaidArr);
    dataTest.items.push(res.result.sales[x].date);
  }
  saleDataAgent.datasets = [];
  saleDataAgent.labels = [];

  saleDataByAgent.labels = [];
  totalByAgent.items.splice(0);
  paidByAgent.items.splice(0);
  notPaidAgent.items.splice(0);
  saleDataByAgent.datasets.footerForCount = [];

  res.result.sales.forEach((sale) => {
    saleDataAgent.labels.push(sale.date);
    saleDataByAgent.labels.push(sale.date);

    sale.agents.forEach((agent, index) => {
      totalBookingsForShow.value += agent.total_count;
      // AgentName.value.push(agent.name);
      const existingAgent = AgentName.value.find((a) => a === agent.name);
      if (!existingAgent) {
        AgentName.value.push(agent.name);
      }

      const existingDataset = saleDataAgent.datasets.find(
        (dataset) => dataset.label === agent.name
      );

      if (existingDataset) {
        existingDataset.data.push(agent.total);
        existingDataset.dataforFooter.push(agent.total_count);
      } else {
        saleDataAgent.datasets.push({
          label: agent.name,
          data: [agent.total],
          dataforFooter: [agent.total_count],
          backgroundColor: [agentColors[index]],
          type: "line",
        });
      }

      if (priceSalesGraphAgent.value != "") {
        if (agent.name == priceSalesGraphAgent.value) {
          totalByAgent.items.push(agent.total);
          paidByAgent.items.push(agent.total_deposit);
          notPaidAgent.items.push(agent.total_balance);
          saleDataByAgent.datasets[0].footerForCount.push(agent.total_count);
          console.log(agent.total_count);
        }
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
  options: {
    indexAxis: "y", // Display labels on the y-axis
    scales: {
      x: {
        position: "bottom", // Position x-axis at the bottom
      },
    },
  },
};

const dataReportChannal = reactive({ items: [] });
const dataReportChannalAmount = reactive({ items: [] });
const reportChannalData = {
  labels: dataReportChannal.items,
  datasets: [
    {
      label: "Selling Channal",
      data: dataReportChannalAmount.items,
      backgroundColor: ["rgb(255, 105, 14)"],
      hoverOffset: 4,
    },
  ],
};

const reportOptions = ref({
  responsive: true,
  indexAxis: "y", // Display labels on the y-axis
  scales: {
    y: {
      ticks: {
        display: true, // Display labels on the y-axis
      },
      grid: {
        display: false,
      },
    },
    x: {
      type: "linear", // Use linear scale for x-axis
      position: "bottom",
      grid: {
        display: false,
      },
      ticks: {
        stepSize: 1, // Set step size to 1 for numerical values
        callback: function (value, index, values) {
          return index; // Display numerical values (0, 1, 2, ...)
        },
      },
    },
  },
  plugins: {
    legend: {
      position: "bottom",
    },
    title: {
      display: false,
    },
  },
  borderRadius: 20,
  barPercentage: 0.6,
});
const methodOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
    title: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return context.parsed.y + " sales"; // Display sales amount in tooltip
        },
      },
    },
  },
});
const paymentOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
    title: {
      display: false,
    },
  },
});

const dataReportMethod = reactive({ items: [] });
const dataReportMethodAmount = reactive({ items: [] });
const reportMethodData = {
  labels: dataReportMethod.items,
  datasets: [
    {
      label: "Selling Method",
      data: dataReportMethodAmount.items,
      backgroundColor: [
        "rgb(232, 88, 0)",
        "rgb(255, 105, 14)",
        "rgb(255, 142, 74)",
        "rgb(255, 168, 115)",
        "rgb(255, 203, 171)",
      ],
      hoverOffset: 4,
    },
  ],
  options: {
    indexAxis: "y", // Display labels on the y-axis
    scales: {
      x: {
        position: "bottom", // Position x-axis at the bottom
      },
    },
  },
};

const dataReportStatus = reactive({ items: [] });
const dataReportStatusAmount = reactive({ items: [] });
const reportStatusData = {
  labels: dataReportStatus.items,
  datasets: [
    {
      label: "Selling Status",
      data: dataReportStatusAmount.items,
      backgroundColor: [
        "rgb(14, 232, 0)",
        "rgb(232, 0, 0)",
        "rgb(255, 126, 11)",
      ],
      hoverOffset: 4,
    },
  ],
};

const series = ref([
  {
    data: [],
  },
]);

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
            from: 1000,
            to: 50000,
            color: "#FF5B00",
          },
          {
            from: 50000,
            to: 1000000,
            color: "#ff4B00",
          },
        ],
      },
    },
  },
};

const date = ref("");
const partOfAgent = ref("sale");
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

const priceSalesGraph = ref("1");
const togglePriceSalesGraph = async () => {
  if (priceSalesGraph.value == 0) {
    priceSalesGraph.value = 1;
  } else {
    priceSalesGraph.value = 0;
  }
};

const priceSalesGraphAgent = ref("");

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

const dateArrFromSelect = ref([]);
const loopData = ref([]);
const monthForGraph = ref("");

const currentMonth = () => {
  const currentDate = new Date();
  hotelSaleDate.value = formattedDate(currentDate);
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

const dateFilterRange = ref("");
const presetDates = ref([
  { label: "Today", value: [new Date(), new Date()] },
  {
    label: "Today (Slot)",
    value: [new Date(), new Date()],
    slot: "preset-date-range-button",
  },
  {
    label: "This month",
    value: [startOfMonth(new Date()), endOfMonth(new Date())],
  },
  {
    label: "Last month",
    value: [
      startOfMonth(subMonths(new Date(), 1)),
      endOfMonth(subMonths(new Date(), 1)),
    ],
  },
  {
    label: "This year",
    value: [startOfYear(new Date()), endOfYear(new Date())],
  },
]);

const saleAgentDataRes = ref(null);
const allSaleList = ref(null);

onMounted(async () => {
  // console.log(authStore.isSuperAdmin, "hello");

  if (route.query.day) {
    homeSectionPartView.value = "sale-analysis";
  }

  console.log(allSaleList.value, "this is sale");
  if (!authStore.isSuperAdmin && !authStore.isExternalAudit) {
    router.push({ name: "dashboard" });
  }

  if (authStore.isExternalAudit) {
    router.push({ name: "bankStatementList" });
  }
  // generateDateArray();
  date.value = new Date();
  console.log(date.value, "this is date format");
  // if (date.value) {
  //   await dateFun();
  // }
  // getSaleAgentData();
  currentMonth();
  // console.log(hotelSaleDate.value, "this is current date");
  toggleHotalSales();
  dateFilterRange.value = [startOfMonth(new Date()), endOfMonth(new Date())];
  dateForUnpaid.value = [startOfMonth(new Date()), endOfMonth(new Date())];
  dateForSaleAgent.value = [startOfMonth(new Date()), endOfMonth(new Date())];
  // console.log(dateFilterRange.value, "this is date filter range");
});

const unpaidDataList = ref(null);
const getUnpaidHandler = async (date) => {
  let first = date[0];
  let second = date[1];
  console.log(formattedDate(first), "this is date", formattedDate(second));
  let data = {
    first: formattedDate(first),
    second: formattedDate(second),
  };
  unpaidDataList.value = await homeStore.getUnpaidSales(data);
  console.log(unpaidDataList.value, "this is unpaid");
};

const getDataRangeChangeFunction = async (date) => {
  let first = date[0];
  let second = date[1];
  console.log(formattedDate(first), "this is date", formattedDate(second));
  let data = {
    first: formattedDate(first),
    second: formattedDate(second),
  };

  // channel
  const res = await homeStore.getReportByChannel(data);
  // console.log(res, "this is channel report");
  dataReportChannal.items.splice(0);
  dataReportChannalAmount.items.splice(0);
  for (let i = 0; i < res.result.length; i++) {
    dataReportChannal.items.push(res.result[i].sold_from);
    dataReportChannalAmount.items.push(res.result[i].total_amount);
  }

  allSaleList.value = await homeStore.getSaleCount(data);

  // method
  const resMethod = await homeStore.getReportByMethod(data);
  // console.log(resMethod, "this is channel report");
  dataReportMethod.items.splice(0);
  dataReportMethodAmount.items.splice(0);
  for (let i = 0; i < resMethod.result.length; i++) {
    dataReportMethod.items.push(resMethod.result[i].payment_method);
    dataReportMethodAmount.items.push(resMethod.result[i].total_amount);
  }

  // status
  const resStatus = await homeStore.getReportByStatus(data);
  // console.log(resStatus, "this is channel report");
  dataReportStatus.items.splice(0);
  dataReportStatusAmount.items.splice(0);
  for (let i = 0; i < resStatus.result.length; i++) {
    if (
      resStatus.result[i].payment_status == "fully_paid" ||
      resStatus.result[i].payment_status == "not_paid"
    ) {
      dataReportStatus.items.push(resStatus.result[i].payment_status);
      dataReportStatusAmount.items.push(resStatus.result[i].total_amount);
    }
  }

  // sale method
  // status
  const resSaleMethod = await homeStore.getReportByPaymentMethod(data);
  console.log(resSaleMethod, "this is channel report");
  series.value[0].data = [];
  for (let i = 0; i < resSaleMethod.result.length; i++) {
    series.value[0].data.push({
      x: `${resSaleMethod.result[i].payment_currency}-${resSaleMethod.result[
        i
      ].product_type
        .split("\\")
        .pop()}`,
      y: resSaleMethod.result[i].total_selling_amount,
    });
  }
};

const getSaleAgentData = async (date) => {
  let first = date[0];
  let second = date[1];
  console.log(formattedDate(first), "this is date", formattedDate(second));
  let data = {
    first: formattedDate(first),
    second: formattedDate(second),
  };
  const resSaleAgent = await homeStore.getAgentSales(data);
  console.log(resSaleAgent, "this is sale agent report");
  saleAgentDataRes.value = resSaleAgent;
};

const dateForUnpaid = ref("");
const dateForSaleAgent = ref("");

// watch(date, async (newValue) => {
//   await getSaleAgentData(date.value);
// });

watch(monthForGraph, async (newValue) => {
  getAllDays(monthForGraph.value);
});

watch(priceSalesGraphAgent, async (newValue) => {
  priceSalesGraph.value = 0;
  getAllDays(monthForGraph.value);
});

watch(dateFilterRange, async (newValue) => {
  if (dateFilterRange.value != "" && dateFilterRange.value != null) {
    await getDataRangeChangeFunction(dateFilterRange.value);
  }
});

watch(dateForUnpaid, async (newValue) => {
  if (dateForUnpaid.value != "" && dateForUnpaid.value != null) {
    await getUnpaidHandler(dateForUnpaid.value);
  }
});
watch(dateForSaleAgent, async (newValue) => {
  if (dateForSaleAgent.value != "" && dateForSaleAgent.value != null) {
    await getSaleAgentData(dateForSaleAgent.value);
  }
});

watch(hotelSaleDate, async (newValue) => {
  toggleHotalSales();
});
watch(priceSalesGraph, async (newValue) => {
  console.log(priceSalesGraph.value);
});

const homeSectionPartView = ref("sale");

watch(homeSectionPartView, (newValue) => {
  if (newValue == "sale") {
    router.push({
      name: "home",
    });
  }
});
</script>

<template>
  <Layout :title="`Welcome back, ${authStore.user.name.split(' ')[0]}!`">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 mb-3">
      <div
        :class="isShowSidebar ? 'left-[250px]' : 'left-[100px]'"
        class="space-x-8 col-span-3 flex justify-start transistion-all duration-200 items-center gap-2 text-sm pb-4 absolute top-8"
      >
        <HomeFirstPartVue
          :title="'Sales Analysis'"
          :isActive="homeSectionPartView == 'sale'"
          @click="homeSectionPartView = 'sale'"
        />
        <HomeFirstPartVue
          :title="'Calendar'"
          :isActive="homeSectionPartView == 'sale-analysis'"
          @click="homeSectionPartView = 'sale-analysis'"
        />
      </div>
      <!-- filter -->
      <div
        v-if="homeSectionPartView == 'sale'"
        class="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 mb-3 col-span-3"
      >
        <div
          class="flex col-span-3 items-center justify-between py-3 bg-white rounded-md shadow-sm px-4"
        >
          <p class="text-md font-semibold tracking-wider mr-4">Filter:</p>
          <div class="w-[30%]">
            <VueDatePicker
              v-model="dateFilterRange"
              range
              :preset-dates="presetDates"
              :format="'yyyy-MM-dd'"
              placeholder="select date range"
            >
              <template
                #preset-date-range-button="{ label, value, presetDate }"
              >
                <span
                  role="button"
                  :tabindex="0"
                  @click="presetDate(value)"
                  @keyup.enter.prevent="presetDate(value)"
                  @keyup.space.prevent="presetDate(value)"
                >
                  {{ label }}
                </span>
              </template>
            </VueDatePicker>
          </div>
        </div>
        <div class="flex justify-start items-center space-x-2 col-span-3">
          <HomeSecondPartVue
            :icon="HeartIcon"
            :title="'Total Bookings'"
            :amount="allSaleList?.result?.booking_count"
            :isActive="true"
          />
          <HomeSecondPartVue
            :icon="PuzzlePieceIcon"
            :title="'Van Tour Sales'"
            :amount="allSaleList?.result?.van_tour_sale_count"
            :isActive="false"
          />
          <HomeSecondPartVue
            :icon="SquaresPlusIcon"
            :title="'Attraction Sales'"
            :amount="allSaleList?.result?.attraction_sale_count"
            :isActive="false"
          />
          <HomeSecondPartVue
            :icon="SquaresPlusIcon"
            :title="'Hotels Sales'"
            :amount="allSaleList?.result?.hotel_sale_count"
            :isActive="false"
          />
          <HomeSecondPartVue
            :icon="SquaresPlusIcon"
            :title="'Airticket Sales'"
            :amount="allSaleList?.result?.air_ticket_sale_count"
            :isActive="false"
          />
        </div>

        <div class="col-span-2 bg-white p-4 rounded-lg h-[520px]">
          <div class="flex justify-between items-start">
            <div>
              <p
                class="mb-3 font-semibold tracking-wide text-sm"
                v-if="priceSalesGraph"
              >
                Overall Sales
              </p>

              <p
                class="mb-3 font-semibold tracking-wide text-sm"
                v-if="!priceSalesGraph"
              >
                Sale by Employee
              </p>
              <p class="text-sm pb-3">
                Total Sales :
                <span class="text-[#FF5B00]">{{ totalSaleForShow }} thb</span>
              </p>
              <p class="text-sm pb-3">
                Total Bookings :
                <span class="text-[#FF5B00]"
                  >{{ totalBookingsForShow }} Bookings</span
                >
              </p>
            </div>
            <div class="flex justify-end items-center gap-3">
              <select
                name=""
                id=""
                v-if="!priceSalesGraph"
                v-model="priceSalesGraphAgent"
                class="px-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none"
              >
                <option value="" class="py-2">All</option>
                <!-- AgentName -->
                <option
                  :value="a"
                  class="py-2"
                  v-for="(a, index) in AgentName ?? []"
                  :key="index"
                >
                  {{ a }}
                </option>
              </select>

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
          <LineChart :chartData="saleData" v-if="priceSalesGraph == '1'" />
          <LineChart
            :chartData="saleDataAgent"
            :options="saleDataAgentOption"
            v-if="priceSalesGraph == '0' && priceSalesGraphAgent == ''"
          />
          <LineChart
            :chartData="saleDataByAgent"
            :options="saleDataByAgentOption"
            v-if="priceSalesGraph == '0' && priceSalesGraphAgent != ''"
          />
        </div>
        <div
          class="py-6 rounded-lg shadow-sm backdrop-blur-lg backdrop-filter overflow-y-scroll h-[520px] px-3 bg-white"
        >
          <div class="flex justify-between items-center">
            <!-- <p class="text-gray-600 text-xs font-semibold tracking-wide">
              Sale By Agent
            </p> -->
            <div class="bg-white px-4 w-full space-y-4">
              <div class="flex justify-between items-center tracking-wide">
                <p class="text-sm font-medium mr-2">AgentSales</p>
                <VueDatePicker
                  v-model="dateForSaleAgent"
                  :format="'yyyy-MM-dd'"
                  range
                  :preset-dates="presetDates"
                  placeholder="select date range"
                >
                  <template
                    #preset-date-range-button="{ label, value, presetDate }"
                  >
                    <span
                      role="button"
                      :tabindex="0"
                      @click="presetDate(value)"
                      @keyup.enter.prevent="presetDate(value)"
                      @keyup.space.prevent="presetDate(value)"
                    >
                      {{ label }}
                    </span>
                  </template>
                </VueDatePicker>
              </div>
              <div
                class="grid grid-cols-2 border border-gray-300 rounded-md divide-x-2 divide-gray-300"
              >
                <p
                  class="text-xs text-center py-1.5 rounded-s-lg"
                  @click="partOfAgent = 'sale'"
                  :class="
                    partOfAgent == 'sale' ? 'bg-[#FF5B00] text-white' : ''
                  "
                >
                  amount
                </p>
                <p
                  class="text-xs text-center py-1.5 rounded-e-lg"
                  @click="partOfAgent = 'average'"
                  :class="
                    partOfAgent == 'average' ? 'bg-[#FF5B00] text-white' : ''
                  "
                >
                  target
                </p>
              </div>

              <div
                class=""
                v-for="(s, index) in saleAgentDataRes?.result"
                :key="index"
              >
                <SaleAgentReportByDate
                  :data="s"
                  :part="partOfAgent"
                  :date="dateForSaleAgent"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-3 grid grid-cols-4 gap-4">
          <div class="bg-white p-2">
            <p class="text-sm font-semibold py-2">Channels Sold From</p>
            <BarChart :chartData="reportChannalData" :options="reportOptions" />
          </div>
          <div class="bg-white p-2">
            <p class="text-sm font-semibold py-2">Payment Method</p>
            <!-- <DoughnutChart :chartData="reportStatusData" /> -->
            <!-- <CombineBarLineVue /> -->
            <VueApexCharts
              :options="chartOptions"
              :series="series"
              type="treemap"
            />
          </div>
          <div class="bg-white p-2">
            <p class="text-sm font-semibold py-2">Method of Payment</p>
            <DoughnutChart
              :chartData="reportMethodData"
              :options="methodOptions"
            />
          </div>

          <div class="bg-white p-2">
            <p class="text-sm font-semibold py-2">Payment Statuses</p>
            <DoughnutChart
              :chartData="reportStatusData"
              :options="paymentOptions"
            />
          </div>
        </div>
        <div class="col-span-3 grid grid-cols-6 gap-4">
          <div class="col-span-4">
            <TopSellingProductVue />
          </div>
          <div class="col-span-2 bg-white">
            <div
              class="py-6 rounded-lg shadow-sm backdrop-blur-lg backdrop-filter overflow-y-scroll h-[490px] px-3 bg-white"
            >
              <div class="flex justify-between items-center">
                <!-- <p class="text-gray-600 text-xs font-semibold tracking-wide">
                  Sale By Agent
                </p> -->
                <div class="bg-white px-4 w-full space-y-4">
                  <div class="flex justify-between items-center tracking-wide">
                    <p class="text-sm font-medium mr-2">Unpaid</p>
                    <VueDatePicker
                      v-model="dateForUnpaid"
                      :format="'yyyy-MM-dd'"
                      range
                      :preset-dates="presetDates"
                      placeholder="select date range"
                    >
                      <template
                        #preset-date-range-button="{ label, value, presetDate }"
                      >
                        <span
                          role="button"
                          :tabindex="0"
                          @click="presetDate(value)"
                          @keyup.enter.prevent="presetDate(value)"
                          @keyup.space.prevent="presetDate(value)"
                        >
                          {{ label }}
                        </span>
                      </template>
                    </VueDatePicker>
                  </div>

                  <div
                    class=""
                    v-for="(s, index) in unpaidDataList?.result"
                    :key="index"
                  >
                    <SaleByAgent :data="s" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- reservation -->
      <!-- <div
        class="col-span-3 w-full"
        v-if="homeSectionPartView == 'reservation'"
      >
        <ReservationPartHome />
      </div> -->

      <div
        class="col-span-3 w-full"
        v-if="homeSectionPartView == 'sale-analysis'"
      >
        <ReservationCalendarHome />
      </div>
    </div>
  </Layout>
</template>
