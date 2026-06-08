<template>
  <div class="flex gap-4 w-full min-h-[580px]">
    <!-- ══════════════════ LEFT: Chart Panel ══════════════════ -->
    <div class="flex-[2] bg-white rounded-xl shadow-sm p-5 flex flex-col">
      <!-- Header row -->
      <div class="flex items-start justify-between flex-wrap gap-3 mb-4">
        <div>
          <p class="text-sm font-semibold text-gray-800">Car Booking Graph</p>
          <p class="text-xs text-gray-500 mt-1">
            Total:
            <span class="font-semibold text-gray-800">{{
              summary.total ?? 0
            }}</span>
            &nbsp;·&nbsp; Assigned:
            <span class="font-semibold text-emerald-600">{{
              summary.assigned ?? 0
            }}</span>
            &nbsp;·&nbsp; Cost Filled:
            <span class="font-semibold text-blue-600">{{
              summary.cost_filled ?? 0
            }}</span>
          </p>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <!-- Year -->
          <select
            v-model="selectedYear"
            @change="fetchGraph"
            class="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-indigo-400"
          >
            <option v-for="y in yearOptions" :key="y" :value="y">
              {{ y }}
            </option>
          </select>

          <!-- Month -->
          <select
            v-model="selectedMonth"
            @change="fetchGraph"
            class="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-indigo-400"
          >
            <option v-for="(m, i) in monthLabels" :key="i + 1" :value="i + 1">
              {{ m }}
            </option>
          </select>

          <!-- Refresh -->
          <button
            @click="fetchGraph"
            class="flex items-center gap-1.5 text-xs bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            <ArrowPathIcon
              class="w-3.5 h-3.5"
              :class="{ 'animate-spin': loadingGraph }"
            />
            Refresh
          </button>
        </div>
      </div>

      <!-- Summary cards -->
      <div class="grid grid-cols-3 gap-2 mb-4">
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="text-[10px] text-gray-500 mb-1">Total Bookings</p>
          <p class="text-sm font-semibold text-gray-800">
            {{ summary.total ?? 0 }}
          </p>
        </div>
        <div class="bg-emerald-50 rounded-lg p-3">
          <p class="text-[10px] text-emerald-600 mb-1">Assigned</p>
          <p class="text-sm font-semibold text-emerald-700">
            {{ summary.assigned ?? 0 }}
          </p>
        </div>
        <div class="bg-red-50 rounded-lg p-3">
          <p class="text-[10px] text-red-500 mb-1">Unassigned</p>
          <p class="text-sm font-semibold text-red-600">
            {{ (summary.total ?? 0) - (summary.assigned ?? 0) }}
          </p>
        </div>
      </div>

      <!-- Legend -->
      <div class="flex flex-wrap gap-3 text-[11px] text-gray-500 mb-3">
        <span class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-sm bg-gray-400"></span>Total
        </span>
        <span class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>Assigned
        </span>
        <span class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-sm bg-red-400"></span>Unassigned
        </span>
      </div>

      <!-- Chart -->
      <div class="flex-1 relative min-h-[360px]">
        <div
          v-if="loadingGraph"
          class="absolute inset-0 flex items-center justify-center"
        >
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"
          ></div>
        </div>
        <BarChart
          v-else
          :chartData="chartData"
          :options="chartOptions"
          class="w-full h-full"
        />
      </div>
    </div>

    <!-- ══════════════════ RIGHT: Detail Panel ══════════════════ -->
    <div class="flex-1 bg-white rounded-xl shadow-sm flex flex-col h-[85vh]">
      <!-- Header -->
      <div class="px-4 py-3 border-b border-gray-100">
        <div v-if="selectedDay">
          <p class="text-sm font-semibold text-gray-800">
            {{ formatDate(selectedDay.date) }}
          </p>
          <div class="flex items-center gap-2 mt-1 flex-wrap">
            <span
              class="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
            >
              {{ selectedDay.total }} total
            </span>
            <span
              class="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full"
            >
              {{ selectedDay.assigned }} assigned
            </span>
            <span
              class="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
            >
              {{ selectedDay.cost_filled }} cost filled
            </span>
          </div>
        </div>
        <p v-else class="text-sm text-gray-400 py-1">
          Select a date on the graph to view details
        </p>
      </div>

      <!-- Filter tabs (only when day selected) -->
      <div
        v-if="selectedDay"
        class="flex border-b border-gray-100 text-xs px-1"
      >
        <button
          v-for="tab in detailTabs"
          :key="tab.val"
          @click="activeTab = tab.val"
          :class="[
            'flex-1 py-2 font-medium transition-colors',
            activeTab === tab.val
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-400 hover:text-gray-600',
          ]"
        >
          {{ tab.label }}
          <span
            v-if="tab.count"
            class="ml-1 text-[10px] px-1.5 py-0.5 rounded-full"
            :class="tab.countCls"
            >{{ tab.count }}</span
          >
        </button>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto px-4 py-3">
        <!-- Empty state -->
        <div
          v-if="!selectedDay"
          class="flex flex-col items-center justify-center h-full text-gray-300 py-12"
        >
          <svg
            class="w-12 h-12 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p class="text-xs text-center leading-relaxed">
            Select a date on the<br />graph to view details
          </p>
        </div>

        <!-- Loading state -->
        <div
          v-else-if="loadingDetail"
          class="flex items-center justify-center h-40"
        >
          <div
            class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"
          ></div>
        </div>

        <!-- Items list -->
        <template v-else>
          <div
            v-if="filteredItems.length === 0"
            class="flex flex-col items-center justify-center h-40 text-gray-300"
          >
            <p class="text-xs">No bookings for this filter</p>
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="item in filteredItems"
              :key="item.id"
              class="border rounded-xl p-3 transition-all cursor-pointer hover:shadow-sm"
              :class="itemCardClass(item)"
            >
              <!-- Top row -->
              <div class="flex items-start justify-between gap-2 mb-2">
                <div class="min-w-0 flex-1">
                  <p class="text-xs font-semibold text-gray-800 truncate">
                    {{ item.customer_name ?? "—" }}
                  </p>
                  <p class="text-[10px] text-gray-400 mt-0.5 truncate">
                    {{ item.product_name ?? "—" }}
                  </p>
                </div>
                <!-- Status badges -->
                <div class="flex flex-col gap-1 items-end flex-shrink-0">
                  <span
                    class="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                    :class="
                      item.is_assigned
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-500'
                    "
                  >
                    {{ item.is_assigned ? "Assigned" : "Unassigned" }}
                  </span>
                  <span
                    class="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                    :class="
                      item.is_cost_filled
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-orange-100 text-orange-500'
                    "
                  >
                    {{ item.is_cost_filled ? "Cost ✓" : "No Cost" }}
                  </span>
                </div>
              </div>

              <!-- Detail rows -->
              <div class="space-y-1">
                <div
                  class="flex items-center gap-1.5 text-[10px] text-gray-500"
                  v-if="item.pickup_time"
                >
                  <ClockIcon class="w-3 h-3 flex-shrink-0" />
                  {{ item.pickup_time }}
                </div>
                <div
                  class="flex items-center gap-1.5 text-[10px] text-gray-500"
                  v-if="item.pickup_location"
                >
                  <MapPinIcon class="w-3 h-3 flex-shrink-0" />
                  <span class="truncate">{{ item.pickup_location }}</span>
                </div>
                <div
                  class="flex items-center gap-1.5 text-[10px] text-gray-500"
                  v-if="item.supplier_name"
                >
                  <TruckIcon class="w-3 h-3 flex-shrink-0" />
                  {{ item.supplier_name }}
                  <span v-if="item.driver_name" class="text-gray-400"
                    >· {{ item.driver_name }}</span
                  >
                  <span
                    v-if="item.car_number"
                    class="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[9px] ml-auto"
                  >
                    {{ item.car_number }}
                  </span>
                </div>
              </div>

              <!-- Cost row -->
              <div
                v-if="item.is_cost_filled"
                class="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between"
              >
                <span class="text-[10px] text-gray-400">Cost Price</span>
                <span class="text-xs font-semibold text-gray-700">
                  {{ Number(item.cost_price ?? 0).toLocaleString() }}
                  <span class="text-[10px] font-normal text-gray-400">THB</span>
                </span>
              </div>

              <!-- Action row -->
              <div
                class="mt-2 pt-2 border-t border-gray-50 flex items-center justify-between"
              >
                <span class="text-[10px] text-gray-400">#{{ item.id }}</span>
                <button
                  @click="goToBooking(item)"
                  class="text-[10px] text-indigo-500 hover:text-indigo-700 font-medium"
                >
                  Open →
                </button>
              </div>
            </div>

            <!-- Pagination -->
            <div
              v-if="detailItems.length >= perPage"
              class="flex items-center justify-center gap-2 pt-2"
            >
              <button
                @click="loadMoreDetail"
                class="text-xs text-indigo-500 hover:text-indigo-700 border border-indigo-200 hover:border-indigo-400 px-4 py-1.5 rounded-lg transition-colors"
              >
                Load more
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { BarChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
import { useRouter } from "vue-router";

import { useCarBookingStore } from "../../stores/carbooking";
import {
  ArrowPathIcon,
  ClockIcon,
  MapPinIcon,
  TruckIcon,
} from "@heroicons/vue/24/outline";

Chart.register(...registerables);

const router = useRouter();
const carBookingStore = useCarBookingStore();

// ── State ──────────────────────────────────────────────────────────────────
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth() + 1);
const mode = ref("count"); // 'count' | 'assigned' | 'cost'
const loadingGraph = ref(false);
const loadingDetail = ref(false);

const graphData = ref([]); // array of { date, total, assigned, cost_filled, unassigned }
const summary = ref({ total: 0, assigned: 0, cost_filled: 0 });

const selectedDay = ref(null); // one item from graphData
const detailItems = ref([]); // raw items from date-detail API
const activeTab = ref("all"); // 'all' | 'assigned' | 'unassigned' | 'no_cost'
const perPage = ref(20);

// ── Options ────────────────────────────────────────────────────────────────
const curYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 4 }, (_, i) => curYear - i);
const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const modeOptions = [
  { val: "count", label: "Count" },
  { val: "assigned", label: "Assigned" },
  { val: "cost", label: "Cost" },
];

// ── Computed ───────────────────────────────────────────────────────────────
const filteredItems = computed(() => {
  if (activeTab.value === "all") return detailItems.value;
  if (activeTab.value === "unassigned")
    return detailItems.value.filter((i) => !i.is_assigned);
  if (activeTab.value.startsWith("supplier:")) {
    const name = activeTab.value.replace("supplier:", "");
    return detailItems.value.filter((i) => i.supplier_name === name);
  }
  return detailItems.value;
});

const chartData = computed(() => {
  const labels = graphData.value.map((d) => formatDateShort(d.date));
  return {
    labels,
    datasets: [
      {
        label: "Assigned",
        data: graphData.value.map((d) => d.assigned),
        backgroundColor: "rgba(16,185,129,0.8)",
        borderColor: "#10B981",
        borderWidth: 0,
        borderRadius: 4,
        stack: "s1",
      },
      {
        label: "Unassigned",
        data: graphData.value.map((d) => d.unassigned),
        backgroundColor: "rgba(239,68,68,0.7)",
        borderColor: "#EF4444",
        borderWidth: 0,
        borderRadius: 4,
        stack: "s1",
      },
    ],
  };
});

// Unique suppliers from current day's items
const supplierTabs = computed(() => {
  const seen = new Map();
  for (const item of detailItems.value) {
    if (
      item.is_assigned &&
      item.supplier_name &&
      !seen.has(item.supplier_name)
    ) {
      seen.set(item.supplier_name, {
        val: `supplier:${item.supplier_name}`,
        label: item.supplier_name,
        count: 0,
        countCls: "bg-indigo-100 text-indigo-600",
      });
    }
  }
  // Count items per supplier
  for (const item of detailItems.value) {
    if (item.supplier_name && seen.has(item.supplier_name)) {
      seen.get(item.supplier_name).count++;
    }
  }
  return [...seen.values()];
});

const detailTabs = computed(() => [
  {
    val: "all",
    label: "All",
    count: detailItems.value.length,
    countCls: "bg-gray-100 text-gray-600",
  },
  {
    val: "unassigned",
    label: "Unassigned",
    count: detailItems.value.filter((i) => !i.is_assigned).length || null,
    countCls: "bg-red-100 text-red-500",
  },
  ...supplierTabs.value,
]);

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  onClick: (evt, els) => {
    if (!els.length) return;
    const day = graphData.value[els[0].index];
    if (!day) return;
    selectedDay.value = day;
    activeTab.value = "all";
    fetchDetail(day.date);
  },
  scales: {
    x: {
      stacked: true,
      grid: { display: false },
      ticks: { font: { size: 9 }, maxRotation: 55, autoSkip: false },
    },
    y: {
      stacked: true,
      beginAtZero: true,
      grid: { color: "rgba(0,0,0,0.04)" },
      ticks: {
        font: { size: 10 },
        stepSize: 1, // ← whole numbers only
        precision: 0, // ← no decimals
      },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        title: (ctx) => graphData.value[ctx[0].dataIndex]?.date ?? "",
        afterBody: (ctx) => {
          const d = graphData.value[ctx[0].dataIndex];
          if (!d) return [];
          return [
            `Total:      ${d.total}`,
            `Assigned:   ${d.assigned}`,
            `Unassigned: ${d.unassigned}`,
            `Cost filled:${d.cost_filled}`,
          ];
        },
      },
    },
  },
}));

// ── Helpers ────────────────────────────────────────────────────────────────
const formatDateShort = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const itemCardClass = (item) => {
  if (!item.is_assigned && !item.is_cost_filled)
    return "border-red-200 bg-red-50/30 hover:border-red-300";
  if (!item.is_assigned)
    return "border-orange-200 bg-orange-50/30 hover:border-orange-300";
  if (!item.is_cost_filled)
    return "border-blue-200 bg-blue-50/20 hover:border-blue-300";
  return "border-gray-100 hover:border-emerald-300 hover:bg-emerald-50/20";
};

// ── API calls ──────────────────────────────────────────────────────────────
async function fetchGraph() {
  loadingGraph.value = true;
  selectedDay.value = null;
  detailItems.value = [];
  try {
    const res = await carBookingStore.getMonthlyGraph(
      selectedYear.value,
      selectedMonth.value,
    );
    console.log("result", res);

    const results = res?.result ?? {};
    graphData.value = results.graph_data ?? [];
    summary.value = results.summary ?? {
      total: 0,
      assigned: 0,
      cost_filled: 0,
    };
  } catch (e) {
    console.error("Car booking graph error:", e);
    graphData.value = [];
    summary.value = { total: 0, assigned: 0, cost_filled: 0 };
  } finally {
    loadingGraph.value = false;
  }
}

async function fetchDetail(date) {
  loadingDetail.value = true;
  detailItems.value = [];
  try {
    const res = await carBookingStore.getDateDetail(date);
    console.log(res, "this is list data");

    detailItems.value = res?.result?.items ?? [];
  } catch (e) {
    console.error("Car booking detail error:", e);
    detailItems.value = [];
  } finally {
    loadingDetail.value = false;
  }
}

function loadMoreDetail() {
  perPage.value += 20;
}

function goToBooking(item) {
  window.open(`/car-bookings?id=${item.id}`, "_blank");
}

onMounted(fetchGraph);
</script>
