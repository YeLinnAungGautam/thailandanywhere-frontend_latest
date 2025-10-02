<script setup>
import { reactive, ref, watch, onMounted, computed } from "vue";
import { BarChart } from "vue-chart-3";
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
  "#FF0000",
  "#0032FF",
  "#04FF00",
  "#00FFF7",
  "#FFE400",
  "#0027FF",
  "#C500FF",
  "#FF00A2",
];

// Make chartData reactive
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
    },
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${context.dataset.label}: ${context.parsed.y} bookings`;
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

// Add missing reactive references
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

const totalBookings = ref(0);
const productTypeTotals = ref(new Map());

// Computed property to get sorted product type breakdown
const productTypeBreakdown = computed(() => {
  return Array.from(productTypeTotals.value.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
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
    console.log("Product Type Booking Count Data:", result);

    // Clear existing data
    dateLabels.value = [];
    chartData.labels = [];
    chartData.datasets = [];
    totalBookings.value = 0;
    productTypeTotals.value = new Map();

    // Extract unique dates
    result.forEach((item) => {
      dateLabels.value.push(item.date);
      chartData.labels.push(item.date);
    });

    // Create datasets for each product type
    const productTypeMap = new Map();

    result.forEach((dateItem) => {
      dateItem.product_types.forEach((pt, index) => {
        const productType = pt.product_type.split("\\").pop(); // Get class name only

        if (!productTypeMap.has(productType)) {
          productTypeMap.set(productType, {
            label: productType,
            data: [],
            backgroundColor:
              productTypeColors[productTypeMap.size % productTypeColors.length],
            borderColor:
              productTypeColors[productTypeMap.size % productTypeColors.length],
            borderWidth: 1,
          });
        }
      });
    });

    // Fill data for each product type and calculate totals
    result.forEach((dateItem) => {
      const productTypesInDate = new Map();

      dateItem.product_types.forEach((pt) => {
        const productType = pt.product_type.split("\\").pop();
        productTypesInDate.set(productType, pt.booking_item_count);
        totalBookings.value += pt.booking_item_count;

        // Update product type totals
        const currentTotal = productTypeTotals.value.get(productType) || 0;
        productTypeTotals.value.set(
          productType,
          currentTotal + pt.booking_item_count
        );
      });

      productTypeMap.forEach((dataset, productType) => {
        dataset.data.push(productTypesInDate.get(productType) || 0);
      });
    });

    chartData.datasets = Array.from(productTypeMap.values());
  } catch (error) {
    console.error("Error fetching product type data:", error);
  }
};

// Get color for product type
const getProductTypeColor = (index) => {
  return productTypeColors[index % productTypeColors.length];
};

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
          <p class="mb-3 font-semibold tracking-wide text-sm">
            Product Type - Booking Item Count
          </p>
          <div class="flex items-start gap-6">
            <!-- <p class="text-sm">
              Total Booking Items:
              <span class="text-[#FF5B00] font-semibold"
                >{{ totalBookings }} items</span
              >
            </p> -->
            <div class="text-sm">
              <!-- <p class="font-medium mb-1">Breakdown by Product Type:</p> -->
              <div class="flex flex-wrap gap-x-4 gap-y-1">
                <span
                  v-for="(item, index) in productTypeBreakdown"
                  :key="item.type"
                  class="flex items-center gap-1"
                >
                  <span
                    class="inline-block w-3 h-3 rounded-sm"
                    :style="{ backgroundColor: getProductTypeColor(index) }"
                  ></span>
                  <span class="text-gray-700 text-xs">{{ item.type }}:</span>
                  <span class="font-medium">{{ item.count }}</span>
                </span>
              </div>
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
        <BarChart :chartData="chartData" :options="chartOptions" />
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
                <p v-if="item.customer_name">
                  <span class="font-medium">Customer:</span>
                  {{ item.customer_name }}
                </p>
                <p v-if="item.service_date">
                  <span class="font-medium">Service:</span>
                  {{ item.service_date }}
                </p>
                <p v-if="item.amount">
                  <span class="font-medium">Product Type:</span>
                  {{ item.product_type.split("\\").pop() }}
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
