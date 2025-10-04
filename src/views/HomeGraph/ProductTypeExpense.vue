<script setup>
import { reactive, ref, watch, onMounted, computed } from "vue";
import { BarChart, LineChart } from "vue-chart-3";
import { useHomeStore } from "../../stores/home";
import { formattedDate } from "../help/FormatData";
import {
  addDays,
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";

const homeStore = useHomeStore();

const dateLabels = ref([]);
const productTypeColors = [
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#EAB308",
  "#84CC16",
  "#22C55E",
  "#10B981",
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

      fetchExpenseItems(productType, date);
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

// Add missing reactive references for expense details
const expenseItems = ref([]);
const isLoadingExpenses = ref(false);
const selectedProductType = ref(null);
const selectedDate = ref(null);

const fetchExpenseItems = async (productType, date) => {
  isLoadingExpenses.value = true;
  selectedProductType.value = productType;
  selectedDate.value = date;

  try {
    const params = {
      product_type: `App\\Models\\${productType}`,
      date: date,
    };

    const response = await homeStore.getProductTypeRemainExpense(params);
    expenseItems.value = response.data.result;
    console.log("Expense Items:", expenseItems.value);
  } catch (error) {
    console.error("Error fetching expense items:", error);
    expenseItems.value = [];
  } finally {
    isLoadingExpenses.value = false;
  }
};

const dateFilterRange = ref([new Date(), addDays(new Date(), 30)]);
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

const totalRemainExpense = ref(0);
const productTypeExpenses = ref(new Map());
const numberOfDates = ref(0);

// Computed property to get sorted product type expense averages
const productTypeExpenseBreakdown = computed(() => {
  return Array.from(productTypeExpenses.value.entries())
    .map(([type, total]) => ({
      type,
      total,
      average: numberOfDates.value > 0 ? total / numberOfDates.value : 0,
    }))
    .sort((a, b) => b.average - a.average);
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
    totalRemainExpense.value = 0;
    productTypeExpenses.value = new Map();
    numberOfDates.value = result.length;

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
        const remainExpense = parseFloat(pt.remain_expense_total) || 0;
        productTypesInDate.set(productType, remainExpense);
        totalRemainExpense.value += remainExpense;

        // Update product type expense totals
        const currentExpense = productTypeExpenses.value.get(productType) || 0;
        productTypeExpenses.value.set(
          productType,
          currentExpense + remainExpense
        );
      });

      productTypeMap.forEach((dataset, productType) => {
        dataset.data.push(productTypesInDate.get(productType) || 0);
      });
    });

    chartData.datasets = Array.from(productTypeMap.values());
  } catch (error) {
    console.error("Error fetching product type remain expense data:", error);
  }
};

// Get color for product type
const getProductTypeColor = (index) => {
  return productTypeColors[index % productTypeColors.length];
};

// Calculate percentage of total expense
const getExpensePercentage = (total) => {
  if (totalRemainExpense.value === 0) return 0;
  return ((total / totalRemainExpense.value) * 100).toFixed(1);
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
  <div class="grid grid-cols-3 gap-x-4 h-[520px]">
    <div class="bg-white p-4 rounded-lg col-span-2">
      <div class="flex justify-between items-start mb-4">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-3">
            <p class="font-semibold tracking-wide text-sm">
              Product Type - Remaining Expenses
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
              Total Remaining Expense Average:
              <span class="text-[#EF4444] font-semibold">
                {{
                  (totalRemainExpense / (numberOfDates || 1)).toLocaleString(
                    undefined,
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                  )
                }}
                THB
              </span>
            </p>
          </div>
          <div class="text-sm">
            <div class="flex flex-wrap gap-x-4 gap-y-1">
              <span
                v-for="(item, index) in productTypeExpenseBreakdown"
                :key="item.type"
                class="flex items-center gap-1"
              >
                <span
                  class="inline-block w-3 h-3 rounded-sm"
                  :style="{ backgroundColor: getProductTypeColor(index) }"
                ></span>
                <span class="text-gray-700 text-xs">{{ item.type }}:</span>
                <span class="font-medium">
                  {{
                    item.average.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  }}
                  THB
                </span>
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
      <div class="h-[380px]">
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
          <h3 class="font-semibold text-sm mb-1">Expense Details</h3>
          <p class="text-xs text-gray-600">
            <span class="font-medium">{{ selectedProductType }}</span> -
            {{ selectedDate }}
          </p>
        </div>

        <div
          v-if="isLoadingExpenses"
          class="flex items-center justify-center flex-1"
        >
          <p class="text-sm text-gray-500">Loading...</p>
        </div>

        <div v-else-if="expenseItems.length > 0" class="flex-1 overflow-y-auto">
          <div class="space-y-2">
            <div
              v-for="(item, index) in expenseItems"
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
                  <span class="font-medium">Expense:</span>
                  <span class="text-[#b91010] font-semibold"
                    >{{ item.total_cost_price }} THB</span
                  >
                </p>
                <p v-if="item.payment_status">
                  <span class="font-medium">B. Status:</span>
                  <span class="capitalize">{{
                    item.booking.payment_status
                  }}</span>
                </p>
                <p v-if="item.payment_status">
                  <span class="font-medium">E. Status:</span>
                  <span class="capitalize">{{ item.payment_status }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="flex items-center justify-center flex-1">
          <p class="text-sm text-gray-500">No expense items found</p>
        </div>
      </div>

      <div v-else class="flex items-center justify-center h-full">
        <p class="text-sm text-gray-500 text-center px-4">
          Click on a bar in the chart to view expense details
        </p>
      </div>
    </div>
  </div>
</template>
