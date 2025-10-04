<script setup>
import { reactive, ref, watch, onMounted, computed } from "vue";
import { BarChart, LineChart } from "vue-chart-3";
import { useHomeStore } from "../../stores/home";
import { formattedDate } from "../help/FormatData";
import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";

const homeStore = useHomeStore();

const dateLabels = ref([]);
const productTypeColors = [
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#EC4899",
  "#14B8A6",
];

// Chart type toggle
const chartType = ref("bar"); // 'bar' or 'line'

const chartData = reactive({
  labels: [],
  datasets: [],
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          return value.toLocaleString() + " THB";
        },
      },
    },
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${
            context.dataset.label
          }: ${context.parsed.y.toLocaleString()} THB`;
        },
      },
    },
  },
  onClick: (event, elements) => {
    if (elements.length > 0) {
      const element = elements[0];
      const datasetIndex = element.datasetIndex;
      const index = element.index;

      const productType = chartData.datasets[datasetIndex].label;
      const date = dateLabels.value[index];

      fetchBookingItems(productType, date);
    }
  },
};

// Line chart specific options
const lineChartOptions = computed(() => ({
  ...chartOptions,
  elements: {
    line: {
      tension: 0.4, // Smooth curves
    },
    point: {
      radius: 4,
      hoverRadius: 6,
    },
  },
}));

// Add missing reactive references for booking details
const bookingItems = ref([]);
const isLoadingBookings = ref(false);
const selectedProductType = ref(null);
const selectedDate = ref(null);

const fetchBookingItems = async (productType, date) => {
  isLoadingBookings.value = true;
  selectedProductType.value = productType;
  selectedDate.value = date;

  try {
    const params = {
      product_type: `App\\Models\\${productType}`,
      date: date,
    };

    const response = await homeStore.getProductTypeBookingItems(params);
    bookingItems.value = response.data.result;
    console.log("Booking Items:", bookingItems.value);
  } catch (error) {
    console.error("Error fetching booking items:", error);
    bookingItems.value = [];
  } finally {
    isLoadingBookings.value = false;
  }
};

const dateFilterRange = ref([startOfMonth(new Date()), endOfMonth(new Date())]);
const presetDates = ref([
  { label: "Today", value: [new Date(), new Date()] },
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

const totalProfit = ref(0);
const productTypeProfits = ref(new Map());

// Computed property to get sorted product type profit breakdown
const productTypeProfitBreakdown = computed(() => {
  return Array.from(productTypeProfits.value.entries())
    .map(([type, profit]) => ({ type, profit }))
    .sort((a, b) => b.profit - a.profit);
});

const getProductTypeData = async (dateRange) => {
  const first = formattedDate(dateRange[0]);
  const second = formattedDate(dateRange[1]);
  const params = {
    daterange: `${first},${second}`,
  };

  try {
    const response = await homeStore.getProductTypeReport(params);
    const result = response.data.result;

    dateLabels.value = [];
    chartData.labels = [];
    chartData.datasets = [];
    totalProfit.value = 0;
    productTypeProfits.value = new Map();

    result.forEach((item) => {
      dateLabels.value.push(item.date);
      chartData.labels.push(item.date);
    });

    const productTypeMap = new Map();

    result.forEach((dateItem) => {
      dateItem.product_types.forEach((pt) => {
        const productType = pt.product_type.split("\\").pop();

        if (!productTypeMap.has(productType)) {
          const color =
            productTypeColors[productTypeMap.size % productTypeColors.length];
          productTypeMap.set(productType, {
            label: productType,
            data: [],
            backgroundColor: color,
            borderColor: color,
            borderWidth: chartType.value === "line" ? 2 : 1,
            fill: chartType.value === "line" ? false : true,
          });
        }
      });
    });

    result.forEach((dateItem) => {
      const productTypesInDate = new Map();

      dateItem.product_types.forEach((pt) => {
        const productType = pt.product_type.split("\\").pop();
        const profit = parseFloat(pt.total_profit) || 0;
        productTypesInDate.set(productType, profit);
        totalProfit.value += profit;

        // Update product type profit totals
        const currentProfit = productTypeProfits.value.get(productType) || 0;
        productTypeProfits.value.set(productType, currentProfit + profit);
      });

      productTypeMap.forEach((dataset, productType) => {
        dataset.data.push(productTypesInDate.get(productType) || 0);
      });
    });

    chartData.datasets = Array.from(productTypeMap.values());
  } catch (error) {
    console.error("Error fetching product type profit data:", error);
  }
};

// Get color for product type
const getProductTypeColor = (index) => {
  return productTypeColors[index % productTypeColors.length];
};

// Calculate percentage of total profit
const getProfitPercentage = (profit) => {
  if (totalProfit.value === 0) return 0;
  return ((profit / totalProfit.value) * 100).toFixed(1);
};

// Update chart datasets when chart type changes
watch(chartType, () => {
  chartData.datasets = chartData.datasets.map((dataset) => ({
    ...dataset,
    borderWidth: chartType.value === "line" ? 2 : 1,
    fill: chartType.value === "line" ? false : true,
  }));
});

watch(dateFilterRange, async (newValue) => {
  if (newValue && newValue.length === 2) {
    await getProductTypeData(newValue);
  }
});

onMounted(() => {
  getProductTypeData(dateFilterRange.value);
});
</script>

<template>
  <div class="grid grid-cols-3 gap-4 h-[520px]">
    <div class="bg-white p-4 rounded-lg col-span-2">
      <div class="flex justify-between items-start mb-4">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-3">
            <p class="font-semibold tracking-wide text-sm">
              Product Type - Profit Analysis
            </p>
            <!-- Chart Type Toggle -->
            <div class="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                @click="chartType = 'bar'"
                :class="[
                  'px-3 py-1 text-xs font-medium rounded transition-colors',
                  chartType === 'bar'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900',
                ]"
              >
                Bar
              </button>
              <button
                @click="chartType = 'line'"
                :class="[
                  'px-3 py-1 text-xs font-medium rounded transition-colors',
                  chartType === 'line'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900',
                ]"
              >
                Line
              </button>
            </div>
          </div>
          <div class="flex items-start gap-6">
            <p class="text-sm">
              Total Profit:
              <span class="text-[#10B981] font-semibold">
                {{ totalProfit.toLocaleString() }} THB
              </span>
            </p>
          </div>
          <div class="text-sm">
            <div class="flex flex-wrap gap-x-4 gap-y-1">
              <span
                v-for="(item, index) in productTypeProfitBreakdown"
                :key="item.type"
                class="flex items-center gap-1"
              >
                <span
                  class="inline-block w-3 h-3 rounded-sm"
                  :style="{ backgroundColor: getProductTypeColor(index) }"
                ></span>
                <span class="text-gray-700 text-xs">{{ item.type }}:</span>
                <span class="font-medium"
                  >{{ item.profit.toLocaleString() }} THB</span
                >
              </span>
            </div>
          </div>
        </div>
        <div class="w-[250px]">
          <VueDatePicker
            v-model="dateFilterRange"
            range
            :preset-dates="presetDates"
            :format="'yyyy-MM-dd'"
            placeholder="Select date range"
          >
            <template #preset-date-range-button="{ label, value, presetDate }">
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
      <div class="h-[400px]">
        <BarChart
          v-if="chartType === 'bar'"
          :chartData="chartData"
          :options="chartOptions"
        />
        <LineChart v-else :chartData="chartData" :options="lineChartOptions" />
      </div>
    </div>
    <div
      class="col-span-1 bg-white p-4 rounded-lg overflow-hidden flex flex-col"
    >
      <div
        v-if="selectedProductType && selectedDate"
        class="flex flex-col h-full"
      >
        <div class="mb-3 pb-3 border-b">
          <h3 class="font-semibold text-sm mb-1">Booking Details</h3>
          <p class="text-xs text-gray-600">
            <span class="font-medium">{{ selectedProductType }}</span> -
            {{ selectedDate }}
          </p>
        </div>

        <div
          v-if="isLoadingBookings"
          class="flex items-center justify-center flex-1"
        >
          <p class="text-sm text-gray-500">Loading...</p>
        </div>

        <div v-else-if="bookingItems.length > 0" class="flex-1 overflow-y-auto">
          <div class="space-y-2">
            <div
              v-for="(item, index) in bookingItems"
              :key="index"
              class="p-3 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <p class="text-xs font-semibold text-gray-800 mb-1">
                Crm ID #{{ item.crm_id }}
              </p>
              <div class="text-xs text-gray-600 space-y-0.5">
                <p v-if="item.service_date">
                  <span class="font-medium">Service:</span>
                  {{ item.service_date }}
                </p>
                <p v-if="item.amount">
                  <span class="font-medium">Product Type:</span>
                  {{ item.product_type.split("\\").pop() }}
                </p>
                <p>
                  <span class="font-medium">Profit:</span>
                  <span class="text-[#10B981] font-semibold"
                    >{{ item.amount - item.total_cost_price }} THB</span
                  >
                </p>
                <p v-if="item.payment_status">
                  <span class="font-medium">Status:</span>
                  <span class="capitalize">{{ item.payment_status }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="flex items-center justify-center flex-1">
          <p class="text-sm text-gray-500">No booking items found</p>
        </div>
      </div>

      <div v-else class="flex items-center justify-center h-full">
        <p class="text-sm text-gray-500 text-center px-4">
          Click on a bar in the chart to view booking details
        </p>
      </div>
    </div>
  </div>
</template>
