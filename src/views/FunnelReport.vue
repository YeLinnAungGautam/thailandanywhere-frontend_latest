<template>
  <Layout class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <div class="w-full mx-auto px-4 py-6">
      <!-- Header with Date Filter -->
      <div class="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h1 class="text-lg font-bold text-gray-900 mb-6">
          📊 Funnel Analytics Report
        </h1>

        <!-- <div class="flex flex-wrap gap-4 items-end">
          <div class="flex-1 min-w-[200px]">
            <label class="block text-xs font-semibold text-gray-700 mb-2">
              Start Date
            </label>
            <input
              v-model="startDate"
              type="date"
              class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
            />
          </div>

          <div class="flex-1 min-w-[200px]">
            <label class="block text-xs font-semibold text-gray-700 mb-2">
              End Date
            </label>
            <input
              v-model="endDate"
              type="date"
              class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
            />
          </div>

          <button
            @click="loadFunnelData"
            :disabled="funnelStore.loading"
            class="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {{ funnelStore.loading ? "Loading..." : "Apply Filter" }}
          </button>
        </div> -->

        <div class="flex justify-between items-center gap-x-2">
          <div class="flex-1 min-w-[200px]">
            <input
              v-model="selectedMonth"
              type="month"
              class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
            />
          </div>

          <button
            @click="loadFunnelData"
            :disabled="funnelStore.loading"
            class="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {{ funnelStore.loading ? "Loading..." : "Apply Filter" }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="funnelStore.loading"
        class="bg-white rounded-2xl shadow-sm p-12 text-center"
      >
        <div
          class="inline-block w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-4"
        ></div>
        <p class="text-gray-600 font-medium text-sm">Loading funnel data...</p>
      </div>

      <!-- Main Content -->
      <div v-else-if="funnelStore.funnel" class="space-y-6">
        <!-- Event Type Selector for Graphs -->
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">
            📈 Event Trends Over Time
          </h2>

          <!-- Event Type Tags -->
          <div class="flex flex-wrap gap-3 mb-6">
            <button
              v-for="event in eventTypes"
              :key="event.type"
              @click="selectEvent(event.type)"
              :class="[
                'px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 text-sm flex items-center gap-2',
                selectedEvent === event.type
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              ]"
            >
              <span>{{ event.icon }}</span>
              <span>{{ event.label }}</span>
              <span
                class="px-2 py-0.5 rounded-full text-xs font-bold"
                :class="
                  selectedEvent === event.type
                    ? 'bg-white text-orange-600'
                    : 'bg-gray-200 text-gray-700'
                "
              >
                {{ getEventCount(event.type).toLocaleString() }}
              </span>
            </button>
          </div>

          <!-- Granularity Selector -->
          <div class="flex gap-2 mb-6">
            <button
              v-for="gran in granularities"
              :key="gran.value"
              @click="selectedGranularity = gran.value"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
                selectedGranularity === gran.value
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              ]"
            >
              {{ gran.label }}
            </button>
          </div>

          <!-- Product Type Filter for Graph -->
          <div class="flex flex-wrap gap-2 mb-6">
            <button
              @click="selectedGraphProductType = null"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
                selectedGraphProductType === null
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              ]"
            >
              All Products
            </button>
            <button
              v-for="type in productTypes"
              :key="type.key"
              @click="selectedGraphProductType = type.key"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
                selectedGraphProductType === type.key
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              ]"
            >
              {{ type.icon }} {{ type.label }}
            </button>
          </div>

          <!-- Graph -->
          <div
            v-if="funnelStore.timeSeriesLoading"
            class="h-96 flex items-center justify-center"
          >
            <div
              class="inline-block w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"
            ></div>
          </div>
          <div v-else-if="funnelStore.timeSeriesData" class="h-96">
            <canvas ref="chartCanvas"></canvas>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useFunnelStore } from "../stores/funnel";
import Layout from "./Layout.vue";
import Chart from "chart.js/auto";

const funnelStore = useFunnelStore();

const startDate = ref("");
const endDate = ref("");
const selectedProductType = ref("hotel");
const selectedEvent = ref("visit_site");
const selectedGranularity = ref("daily");
const selectedGraphProductType = ref(null);

const chartCanvas = ref(null);
let chartInstance = null;

const eventTypes = [
  { type: "visit_site", label: "Visits Site", icon: "👥" },
  { type: "view_detail", label: "View Details", icon: "👁️" },
  { type: "add_to_cart", label: "Add to Cart", icon: "🛒" },
  { type: "go_checkout", label: "Checkout", icon: "💳" },
  { type: "complete_purchase", label: "Purchase", icon: "✅" },
  { type: "messenger_click", label: "Messenger", icon: "💬" },
];

const granularities = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const productTypes = [
  { key: "hotel", label: "Hotels", icon: "🏨" },
  { key: "entrance_ticket", label: "Entrance Tickets", icon: "🎫" },
  { key: "private_van_tour", label: "Private Van Tours", icon: "🚐" },
];

const selectedMonth = ref("");

const formattedDates = computed(() => {
  if (!selectedMonth.value) return null;

  const [year, month] = selectedMonth.value.split("-").map(Number);
  const lastDay = new Date(year, month, 0).getDate();

  return {
    start: `${selectedMonth.value}-01`,
    end: `${selectedMonth.value}-${String(lastDay).padStart(2, "0")}`,
  };
});

const loadFunnelData = async () => {
  if (!selectedMonth.value) {
    alert("Please select a month");
    return;
  }

  const dates = formattedDates.value;

  try {
    await funnelStore.getFunnelReport({
      start_date: dates.start,
      end_date: dates.end,
    });
    await loadTimeSeriesData();
  } catch (error) {
    console.error("Error loading funnel data:", error);
    alert("Failed to load funnel data. Please try again.");
  }
};

const funnelStages = computed(() => {
  if (!funnelStore.funnel || !funnelStore.funnel.total_counts) return [];

  const data = funnelStore.funnel.total_counts;
  const maxCount = Math.max(data.visits || 1, 1);

  const calculateActualPercentage = (count) => {
    return maxCount > 0 ? Math.round((count / maxCount) * 100) : 0;
  };

  return [
    {
      key: "visits",
      label: "Visits Site",
      count: data.visits || 0,
      displayPercentage: 100,
    },
    {
      key: "views",
      label: "Visits Product Page",
      count: data.view_details || 0,
      displayPercentage: calculateActualPercentage(data.view_details || 0),
    },
    {
      key: "cart",
      label: "Add to Cart",
      count: data.add_to_cart || 0,
      displayPercentage: calculateActualPercentage(data.add_to_cart || 0),
    },
    {
      key: "checkout",
      label: "Go to Checkout",
      count: data.go_checkout || 0,
      displayPercentage: calculateActualPercentage(data.go_checkout || 0),
    },
    {
      key: "purchase",
      label: "Complete Purchase",
      count: data.complete_purchase || 0,
      displayPercentage: calculateActualPercentage(data.complete_purchase || 0),
    },
    {
      key: "messenger",
      label: "Messenger Click",
      count: data.messenger_click || 0,
      displayPercentage: calculateActualPercentage(data.messenger_click || 0),
    },
  ];
});

const getEventCount = (eventType) => {
  if (!funnelStore.funnel?.total_counts) return 0;
  const mapping = {
    visit_site: "visits",
    view_detail: "view_details",
    add_to_cart: "add_to_cart",
    go_checkout: "go_checkout",
    complete_purchase: "complete_purchase",
    messenger_click: "messenger_click",
  };
  return funnelStore.funnel.total_counts[mapping[eventType]] || 0;
};

const selectEvent = async (eventType) => {
  selectedEvent.value = eventType;
  await loadTimeSeriesData();
};

const loadTimeSeriesData = async () => {
  if (!selectedMonth.value) return;

  const dates = formattedDates.value;

  try {
    await funnelStore.getTimeSeries({
      start_date: dates.start,
      end_date: dates.end,
      event_type: selectedEvent.value,
      granularity: selectedGranularity.value,
      product_type: selectedGraphProductType.value,
    });
    renderChart();
  } catch (error) {
    console.error("Error loading time series data:", error);
  }
};

const setDefaultDates = () => {
  const today = new Date();
  selectedMonth.value = today.toISOString().slice(0, 7); // e.g. "2026-04"
};

const renderChart = () => {
  if (!funnelStore.timeSeriesData || !chartCanvas.value) return;

  const ctx = chartCanvas.value.getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  const data = funnelStore.timeSeriesData.data;

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map((d) => d.label),
      datasets: [
        {
          label:
            eventTypes.find((e) => e.type === selectedEvent.value)?.label ||
            "Events",
          data: data.map((d) => d.count),
          borderColor: "rgb(255, 91, 0)",
          backgroundColor: "rgba(255, 91, 0, 0.1)",
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        tooltip: {
          mode: "index",
          intersect: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
          },
        },
      },
    },
  });
};

watch([selectedGranularity, selectedGraphProductType], () => {
  loadTimeSeriesData();
});

onMounted(() => {
  setDefaultDates();
});
</script>

<style scoped>
.funnel-stage:hover path {
  filter: brightness(1.1);
  transition: all 0.3s ease;
}
</style>
