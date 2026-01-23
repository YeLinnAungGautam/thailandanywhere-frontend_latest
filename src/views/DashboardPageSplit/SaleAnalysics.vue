<template>
  <Layout :title="`Welcome back, ${authStore.user.name.split(' ')[0]}!`">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-[600px]">
      <div class="text-center">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5B00] mb-4"
        ></div>
        <p class="text-gray-600">Loading sales data...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 mb-3">
      <!-- filter -->
      <div
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

        <div
          class="flex justify-start col-span-3 bg-white px-4 py-4 rounded-lg items-center gap-x-6"
        >
          <p
            class="text-xs cursor-pointer hover:text-[#FF613c]"
            :class="graphPart == 'sale' ? 'text-[#FF613c] font-semibold' : ''"
            @click="graphPart = 'sale'"
          >
            Sale
          </p>
          <p
            class="text-xs cursor-pointer hover:text-[#FF613c]"
            :class="graphPart == 'agent' ? 'text-[#FF613c] font-semibold' : ''"
            @click="graphPart = 'agent'"
          >
            Agent
          </p>
          <p
            class="text-xs cursor-pointer hover:text-[#FF613c]"
            :class="
              graphPart == 'product' ? 'text-[#FF613c] font-semibold' : ''
            "
            @click="graphPart = 'product'"
          >
            Product Type (service)
          </p>
          <p
            class="text-xs cursor-pointer hover:text-[#FF613c]"
            :class="
              graphPart == 'product_booking'
                ? 'text-[#FF613c] font-semibold'
                : ''
            "
            @click="graphPart = 'product_booking'"
          >
            Product Type (sale)
          </p>
          <p
            class="text-xs cursor-pointer hover:text-[#FF613c]"
            :class="graphPart == 'profit' ? 'text-[#FF613c] font-semibold' : ''"
            @click="graphPart = 'profit'"
          >
            Profit
          </p>
          <p
            class="text-xs cursor-pointer hover:text-[#FF613c]"
            :class="
              graphPart == 'expense' ? 'text-[#FF613c] font-semibold' : ''
            "
            @click="graphPart = 'expense'"
          >
            Expense
          </p>
        </div>

        <div
          class="col-span-2 bg-white p-4 rounded-lg h-[520px]"
          v-if="graphPart == 'sale' || graphPart == 'agent'"
        >
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
              <div class="flex justify-start items-center gap-x-2">
                <p class="text-sm pb-3">
                  Total Sales :
                  <span class="text-[#FF5B00]"
                    >{{ formatNumber(totalSaleForShow) }} thb</span
                  >
                </p>
                <p class="text-sm pb-3">
                  Total Airline :
                  <span class="text-[#FF5B00]"
                    >{{ formatNumber(totalAirlineForShow) }} thb
                  </span>
                </p>
              </div>

              <p class="text-sm pb-3">
                Total Bookings :
                <span class="text-[#FF5B00]"
                  >{{ totalBookingsForShow }} Bookings</span
                >
              </p>
            </div>
            <div class="flex justify-end items-center gap-3">
              <!-- Airline toggle button -->
              <div class="flex items-center gap-2">
                <label class="text-sm font-medium">Include Airline:</label>
                <button
                  @click="includeAirline = !includeAirline"
                  :class="[
                    'px-3 py-1.5 rounded text-xs font-medium transition-colors',
                    includeAirline
                      ? 'bg-[#FF5B00] text-white'
                      : 'bg-gray-200 text-gray-700',
                  ]"
                >
                  {{ includeAirline ? "Yes" : "No" }}
                </button>
              </div>

              <input
                type="month"
                name=""
                v-model="monthForGraph"
                class="bg-white text-sm w-[200px] px-2 py-2"
                id=""
              />
            </div>
          </div>
          <LineChart :chartData="saleData" v-if="graphPart == 'sale'" />
          <LineChart
            :chartData="saleDataAgent"
            :options="saleDataAgentOption"
            v-if="graphPart == 'agent'"
          />
        </div>
        <div class="col-span-3" v-if="graphPart == 'product'">
          <ProductTypeBookingCount />
        </div>
        <div class="col-span-3" v-if="graphPart == 'product_booking'">
          <ProductTypeBooking />
        </div>
        <div class="col-span-3" v-if="graphPart == 'profit'">
          <ProductTypeProfit />
        </div>
        <div class="col-span-3" v-if="graphPart == 'expense'">
          <ProductTypeExpense />
        </div>
        <div
          v-if="graphPart == 'sale' || graphPart == 'agent'"
          class="py-6 rounded-lg shadow-sm backdrop-blur-lg backdrop-filter overflow-y-scroll h-[520px] px-3 bg-white"
        >
          <div class="flex justify-between items-center">
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
                  :includeAirline="includeAirline"
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
    </div>
  </Layout>
</template>

<script setup>
import Layout from "../Layout.vue";
import { useRouter } from "vue-router";
import { LineChart, BarChart, DoughnutChart } from "vue-chart-3";
import { useAuthStore } from "../../stores/auth";
import { useHomeStore } from "../../stores/home";
import HomeSecondPartVue from "../../components/HomeSecondPart.vue";
import VueApexCharts from "vue3-apexcharts";
import SaleByAgent from "../../components/SaleByAgent.vue";
import TopSellingProductVue from "../../components/TopSellingProduct.vue";
import SaleAgentReportByDate from "../../components/SaleAgentReportByDate.vue";
import ProductTypeBookingCount from "../HomeGraph/ProductTypeBookingCount.vue";
import ProductTypeBooking from "../HomeGraph/ProductTypeBooking.vue";
import ProductTypeProfit from "../HomeGraph/ProductTypeProfit.vue";
import ProductTypeExpense from "../HomeGraph/ProductTypeExpense.vue";
import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";
import { Chart, registerables } from "chart.js";
import {
  HeartIcon,
  SquaresPlusIcon,
  PuzzlePieceIcon,
} from "@heroicons/vue/24/outline";
import { formattedDate } from "../help/FormatData";
import { computed, onMounted, reactive, ref, watch } from "vue";

Chart.register(...registerables);

const authStore = useAuthStore();
const homeStore = useHomeStore();
const router = useRouter();

// Loading state
const loading = ref(true);

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

const graphPart = ref("sale");

const saleData = {
  labels: dataTest.items,
  datasets: [
    {
      label: "Total Sales",
      type: "line",
      data: dataAmount.items,
      backgroundColor: "rgb(255, 87, 51)",
      borderColor: "rgb(255, 87, 51)",
      borderWidth: 1,
    },
    {
      label: "Fully Paid",
      type: "bar",
      data: dataPaid.items,
      backgroundColor: "rgb(17, 223, 0)",
      borderColor: "rgb(17, 223, 0)",
      borderWidth: 1,
    },
    {
      label: "Not Paid",
      type: "bar",
      data: dataNotPaid.items,
      backgroundColor: "rgb(223, 0, 0 )",
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

const saleDataAgent = reactive({
  labels: [],
  datasets: [],
});

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
          return `Booking - ${a[0].dataset.dataforFooter[a[0].dataIndex]}`;
        },
      },
    },
  },
};

const totalBookingsForShow = ref(0);
const totalAirlineForShow = ref(0);

const includeAirline = ref(true);

const getAllDays = async (monthGet) => {
  console.log(monthGet, "this is month");
  const res = await homeStore.getTimeFilterArray(monthGet);
  console.log(res, "this is for graph");

  dataAmount.items.splice(0);
  dataPaid.items.splice(0);
  dataNotPaid.items.splice(0);
  dataTest.items.splice(0);
  totalBookingsForShow.value = 0;
  totalAirlineForShow.value = 0;

  for (let x = 0; x < res.result.airline_sales.length; x++) {
    for (let i = 0; i < res.result.airline_sales[x].agents.length; i++) {
      totalAirlineForShow.value += res.result.airline_sales[x].agents[i].total;
    }
  }

  for (let x = 0; x < res.result.sales.length; x++) {
    let dataArr = 0;
    let dataPaidArr = 0;
    let dataNotPaidArr = 0;

    let airlineDataArr = 0;
    let airlinePaidArr = 0;
    let airlineNotPaidArr = 0;

    if (res.result.airline_sales[x]) {
      for (let i = 0; i < res.result.airline_sales[x].agents.length; i++) {
        airlineDataArr += res.result.airline_sales[x].agents[i].total;
        airlinePaidArr += res.result.airline_sales[x].agents[i].total_deposit;
        airlineNotPaidArr +=
          res.result.airline_sales[x].agents[i].total_balance;
      }
    }

    for (let i = 0; i < res.result.sales[x].agents.length; i++) {
      dataArr += res.result.sales[x].agents[i].total;
    }
    for (let i = 0; i < res.result.sales[x].agents.length; i++) {
      dataPaidArr += res.result.sales[x].agents[i].total_deposit;
    }
    for (let i = 0; i < res.result.sales[x].agents.length; i++) {
      dataNotPaidArr += res.result.sales[x].agents[i].total_balance;
    }

    if (!includeAirline.value) {
      dataArr -= airlineDataArr;
      dataPaidArr -= airlinePaidArr;
      dataNotPaidArr -= airlineNotPaidArr;
    }

    dataAmount.items.push(dataArr);
    dataPaid.items.push(dataPaidArr);
    dataNotPaid.items.push(dataNotPaidArr);
    dataTest.items.push(res.result.sales[x].date);
  }

  saleDataAgent.datasets.splice(0);
  saleDataAgent.labels.splice(0);

  res.result.sales.forEach((sale, saleIndex) => {
    saleDataAgent.labels.push(sale.date);

    const airlineSaleForDay = res.result.airline_sales[saleIndex];

    sale.agents.forEach((agent, index) => {
      totalBookingsForShow.value += agent.total_count;

      let airlineAgentTotal = 0;
      let airlineAgentDeposit = 0;
      let airlineAgentBalance = 0;

      if (airlineSaleForDay) {
        const airlineAgent = airlineSaleForDay.agents.find(
          (a) => a.name === agent.name,
        );
        if (airlineAgent) {
          airlineAgentTotal = airlineAgent.total;
          airlineAgentDeposit = airlineAgent.total_deposit;
          airlineAgentBalance = airlineAgent.total_balance;
        }
      }

      let finalTotal = agent.total;
      let finalDeposit = agent.total_deposit;
      let finalBalance = agent.total_balance;

      if (!includeAirline.value) {
        finalTotal -= airlineAgentTotal;
        finalDeposit -= airlineAgentDeposit;
        finalBalance -= airlineAgentBalance;
      }

      const existingDataset = saleDataAgent.datasets.find(
        (dataset) => dataset.label === agent.name,
      );

      if (existingDataset) {
        existingDataset.data.push(finalTotal);
        existingDataset.dataforFooter.push(agent.total_count);
      } else {
        saleDataAgent.datasets.push({
          label: agent.name,
          data: [finalTotal],
          dataforFooter: [agent.total_count],
          backgroundColor: [agentColors[index]],
          type: "line",
        });
      }
    });
  });
  console.log(saleDataAgent);
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
  indexAxis: "y",
  scales: {
    y: {
      ticks: {
        display: true,
      },
      grid: {
        display: false,
      },
    },
    x: {
      type: "linear",
      position: "bottom",
      grid: {
        display: false,
      },
      ticks: {
        stepSize: 1,
        callback: function (value, index, values) {
          return index;
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
          return context.parsed.y + " sales";
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
    indexAxis: "y",
    scales: {
      x: {
        position: "bottom",
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

const partOfAgent = ref("sale");
const priceSalesGraph = ref("1");

const monthForGraph = ref("");
const dateFilterRange = ref("");
const dateForUnpaid = ref("");
const dateForSaleAgent = ref("");

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
const unpaidDataList = ref(null);

const formatNumber = (num) => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

const currentMonth = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  monthForGraph.value = `${year}-${month}`;
};

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
  dataReportChannal.items.splice(0);
  dataReportChannalAmount.items.splice(0);
  for (let i = 0; i < res.result.length; i++) {
    dataReportChannal.items.push(res.result[i].sold_from);
    dataReportChannalAmount.items.push(res.result[i].total_amount);
  }

  // sale count
  allSaleList.value = await homeStore.getSaleCount(data);

  // method
  const resMethod = await homeStore.getReportByMethod(data);
  dataReportMethod.items.splice(0);
  dataReportMethodAmount.items.splice(0);
  for (let i = 0; i < resMethod.result.length; i++) {
    dataReportMethod.items.push(resMethod.result[i].payment_method);
    dataReportMethodAmount.items.push(resMethod.result[i].total_amount);
  }

  // status
  const resStatus = await homeStore.getReportByStatus(data);
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

// Initialize data sequentially
const initializeData = async () => {
  loading.value = true;

  try {
    // Set initial dates
    dateFilterRange.value = [startOfMonth(new Date()), endOfMonth(new Date())];
    dateForUnpaid.value = [startOfMonth(new Date()), endOfMonth(new Date())];
    dateForSaleAgent.value = [startOfMonth(new Date()), endOfMonth(new Date())];

    currentMonth();

    // Load data sequentially - one by one
    console.log("Step 1: Loading month data...");
    await getAllDays(monthForGraph.value);

    console.log("Step 2: Loading date range data...");
    await getDataRangeChangeFunction(dateFilterRange.value);

    console.log("Step 3: Loading agent data...");
    await getSaleAgentData(dateForSaleAgent.value);

    console.log("Step 4: Loading unpaid data...");
    await getUnpaidHandler(dateForUnpaid.value);

    console.log("All data loaded successfully!");
  } catch (error) {
    console.error("Error initializing data:", error);
  } finally {
    loading.value = false;
  }
};

watch(monthForGraph, async (newValue) => {
  if (newValue) {
    await getAllDays(monthForGraph.value);
  }
});

watch(includeAirline, async (newValue) => {
  console.log("Include airline:", newValue);
  await getAllDays(monthForGraph.value);
});

watch(dateFilterRange, async (newValue) => {
  if (newValue != "" && newValue != null) {
    await getDataRangeChangeFunction(dateFilterRange.value);
  }
});

watch(dateForUnpaid, async (newValue) => {
  if (newValue != "" && newValue != null) {
    await getUnpaidHandler(dateForUnpaid.value);
  }
});

watch(dateForSaleAgent, async (newValue) => {
  if (newValue != "" && newValue != null) {
    await getSaleAgentData(dateForSaleAgent.value);
  }
});

onMounted(async () => {
  if (!authStore.isSuperAdmin && !authStore.isExternalAudit) {
    router.push({ name: "dashboard" });
    return;
  }

  if (authStore.isExternalAudit) {
    router.push({ name: "bankStatementList" });
    return;
  }

  await initializeData();
});
</script>
