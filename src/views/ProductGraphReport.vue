<template>
  <Layout>
    <div class="flex gap-4 w-full min-h-[580px]">
      <!-- ── LEFT: Chart + filters ── -->
      <div class="flex-[2] bg-white rounded-xl shadow-sm p-5 flex flex-col">
        <!-- Header -->
        <div class="flex items-start justify-between flex-wrap gap-3 mb-4">
          <div>
            <p class="text-sm font-semibold text-gray-800">Product Sales</p>
            <p class="text-xs text-gray-500 mt-1">
              Total:
              <span class="text-[#D85A30] font-semibold"
                >{{ formatNumber(grandTotal) }} THB</span
              >
              &nbsp;·&nbsp; Qty:
              <span class="font-semibold text-gray-700">{{
                totalQuantity
              }}</span>
            </p>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <div
              class="flex border border-gray-200 rounded-lg overflow-hidden text-xs"
            >
              <button
                v-for="m in [
                  { val: 'amount', label: 'Amount' },
                  { val: 'qty', label: 'Qty / Nights' },
                ]"
                :key="m.val"
                @click="graphMetric = m.val"
                :class="[
                  'px-3 py-1.5 font-medium transition-colors',
                  graphMetric === m.val
                    ? 'bg-[#D85A30] text-white'
                    : 'text-gray-600 hover:bg-gray-50',
                ]"
              >
                {{ m.label }}
              </button>
            </div>
            <!-- Period toggle -->
            <div
              class="flex border border-gray-200 rounded-lg overflow-hidden text-xs"
            >
              <button
                v-for="p in periodOptions"
                :key="p.val"
                @click="
                  period = p.val;
                  fetchGraph();
                "
                :class="[
                  'px-3 py-1.5 font-medium transition-colors',
                  period === p.val
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-50',
                ]"
              >
                {{ p.label }}
              </button>
            </div>

            <!-- Year -->
            <select
              v-model="selectedYear"
              @change="fetchGraph"
              class="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#D85A30]"
            >
              <option v-for="y in yearOptions" :key="y" :value="y">
                {{ y }}
              </option>
            </select>

            <!-- Month (only when period = month) -->
            <select
              v-if="period === 'month'"
              v-model="selectedMonth"
              @change="fetchGraph"
              class="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#D85A30]"
            >
              <option v-for="(m, i) in monthLabels" :key="i + 1" :value="i + 1">
                {{ m }}
              </option>
            </select>

            <!-- Product type -->
            <select
              v-model="selectedProductType"
              @change="onTypeChange"
              class="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#D85A30]"
            >
              <option v-for="t in productTypes" :key="t.val" :value="t.val">
                {{ t.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- ── Product selector ── -->
        <div class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <p class="text-[10px] text-gray-400 uppercase tracking-wide">
              Products
              <span class="ml-1 text-gray-500 normal-case font-normal">
                ({{ selectedProductIds.length }} selected)
              </span>
            </p>
            <button
              v-if="selectedProductIds.length > 0"
              @click="clearProductSelection"
              class="text-[10px] text-[#D85A30] hover:underline"
            >
              clear all
            </button>
          </div>

          <!-- Search -->
          <div class="relative mb-2">
            <input
              v-model="productSearch"
              @input="onProductSearch"
              type="text"
              placeholder="Search by name…"
              class="w-full text-xs border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#D85A30] pr-8"
            />
            <div
              v-if="store.loadingProducts"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 animate-spin rounded-full h-3 w-3 border-b-2 border-[#D85A30]"
            ></div>
            <button
              v-else-if="productSearch"
              @click="clearProductSearch"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs leading-none"
            >
              ✕
            </button>
          </div>

          <!-- Chips -->
          <div class="flex flex-wrap gap-1.5 min-h-[32px]">
            <template v-if="!store.loadingProducts">
              <button
                v-for="p in store.availableProducts"
                :key="p.id"
                @click="toggleProduct(p.id, p.name)"
                :class="[
                  'text-[10px] px-2.5 py-1 rounded-full border font-medium transition-all',
                  selectedProductIds.includes(p.id)
                    ? 'bg-[#D85A30] text-white border-[#D85A30]'
                    : 'border-gray-200 text-gray-600 hover:border-[#D85A30]',
                ]"
              >
                {{ p.name }}
              </button>
              <span
                v-if="store.availableProducts.length === 0"
                class="text-[11px] text-gray-400 italic self-center"
                >No products found</span
              >
            </template>
            <template v-else>
              <div
                v-for="n in 6"
                :key="n"
                class="h-6 rounded-full bg-gray-100 animate-pulse"
                :style="{ width: `${60 + n * 12}px` }"
              ></div>
            </template>
          </div>

          <!-- Product list pagination -->
          <div
            v-if="store.productMeta.last_page > 1"
            class="flex items-center gap-2 mt-2"
          >
            <button
              @click="changeProductPage(productPage - 1)"
              :disabled="productPage === 1"
              class="text-[10px] px-2 py-0.5 rounded border border-gray-200 disabled:opacity-40 hover:border-[#D85A30] hover:text-[#D85A30]"
            >
              ‹ Prev
            </button>
            <span class="text-[10px] text-gray-400">
              {{ productPage }} / {{ store.productMeta.last_page }}
            </span>
            <button
              @click="changeProductPage(productPage + 1)"
              :disabled="productPage === store.productMeta.last_page"
              class="text-[10px] px-2 py-0.5 rounded border border-gray-200 disabled:opacity-40 hover:border-[#D85A30] hover:text-[#D85A30]"
            >
              Next ›
            </button>
            <span class="text-[10px] text-gray-400 ml-auto">
              {{ store.productMeta.total }} total
            </span>
          </div>

          <!-- Selected tags strip -->
          <div
            v-if="selectedProductNames.length > 0"
            class="flex flex-wrap gap-1 mt-2 pt-2 border-t border-gray-100"
          >
            <span
              v-for="(item, idx) in selectedProductNames"
              :key="item.id"
              class="flex items-center gap-1 text-[10px] bg-orange-50 text-[#D85A30] border border-orange-200 px-2 py-0.5 rounded-full"
            >
              {{ item.name }}
              <button
                @click="removeProduct(idx)"
                class="hover:text-red-600 leading-none"
              >
                ✕
              </button>
            </span>
          </div>
        </div>

        <!-- Bar chart -->
        <div class="flex-1 relative min-h-[320px]">
          <div
            v-if="store.loadingGraph"
            class="absolute inset-0 flex items-center justify-center"
          >
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D85A30]"
            ></div>
          </div>
          <!-- Fix 2: BarChart instead of LineChart -->
          <BarChart
            v-else
            :chartData="chartData"
            :options="chartOptions"
            class="w-full h-full"
          />
        </div>
      </div>

      <!-- ── RIGHT: Drill-down panel ── -->
      <div class="flex-1 bg-white rounded-xl shadow-sm flex flex-col h-[85vh]">
        <div class="px-4 py-3 border-b border-gray-100">
          <div v-if="selectedLine">
            <div class="flex items-center gap-2">
              <span
                class="w-2.5 h-2.5 rounded-full flex-shrink-0"
                :style="{ backgroundColor: selectedLine.color }"
              ></span>
              <p class="text-sm font-semibold text-gray-800 truncate">
                {{ selectedLine.name }}
              </p>
            </div>
            <p class="text-xs text-gray-400 mt-0.5">
              {{ selectedLine.period }}
              &nbsp;·&nbsp; {{ formatNumber(selectedLine.total_amount) }} THB
              &nbsp;·&nbsp; {{ selectedLine.booking_count }} bookings
            </p>
          </div>
          <p v-else class="text-sm text-gray-400 py-1">
            Click a bar on the chart to see reservations
          </p>
        </div>

        <div class="flex-1 overflow-y-auto px-4 py-3">
          <div
            v-if="!selectedLine"
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0
                   0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0
                   0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p class="text-xs text-center leading-relaxed">
              Click any bar on the chart<br />to view reservations
            </p>
          </div>

          <div
            v-else-if="store.loadingDetail"
            class="flex items-center justify-center h-40"
          >
            <div
              class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#D85A30]"
            ></div>
          </div>

          <div
            v-else-if="store.reservations.length === 0"
            class="flex flex-col items-center justify-center h-40 text-gray-300"
          >
            <p class="text-xs">No reservations found</p>
          </div>

          <div v-else class="space-y-2">
            <div
              class="grid grid-cols-5 gap-1 px-2 py-1.5 bg-gray-50 rounded text-[9px] font-semibold text-gray-500 uppercase tracking-wide"
            >
              <div class="col-span-2">CRM / Item</div>
              <div class="text-right">Amount</div>
              <div class="text-right">Cost</div>
              <div class="text-right">Profit</div>
            </div>

            <div
              v-for="item in store.reservations"
              :key="item.id"
              @click="goToBooking(item.booking_id)"
              class="border border-gray-100 rounded-lg px-3 py-2 hover:bg-orange-50/30 transition-colors"
            >
              <div class="flex items-center justify-between mb-1">
                <div class="flex items-center gap-1.5 min-w-0">
                  <span class="text-[10px] font-bold text-[#D85A30] shrink-0">
                    {{ item.crm_id ?? item.booking?.crm_id ?? "-" }}
                  </span>
                  <span class="text-[9px] text-gray-300">|</span>
                  <span class="text-[9px] text-gray-500 truncate">
                    {{ item.sub_product_name ?? "-" }}
                  </span>
                </div>
                <span class="text-[9px] text-gray-400 shrink-0 ml-2">
                  {{ item.service_date }}
                  <span v-if="item.checkout_date"
                    >/{{ item.checkout_date }}</span
                  >
                </span>
              </div>

              <div class="grid grid-cols-5 gap-1 items-center">
                <div class="col-span-2 text-[9px] text-gray-400">
                  Qty:
                  <span class="font-semibold text-gray-600">{{
                    item.quantity
                  }}</span>
                  &nbsp;·&nbsp; Sell:
                  <span class="font-semibold text-gray-600">{{
                    formatNumber(item.selling_price)
                  }}</span>
                </div>
                <div class="text-right">
                  <span class="text-[10px] font-semibold text-gray-700">
                    {{ formatNumber(item.amount) }}
                  </span>
                </div>
                <div class="text-right">
                  <span class="text-[10px] text-gray-500">
                    {{ formatNumber(item.cost_price) }}
                  </span>
                </div>
                <div class="text-right">
                  <span
                    class="text-[10px] font-semibold"
                    :class="
                      item.profit >= 0 ? 'text-green-600' : 'text-red-500'
                    "
                  >
                    {{ formatNumber(item.profit) }}
                  </span>
                </div>
              </div>

              <div class="flex gap-1.5 mt-1.5">
                <span
                  class="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                  :class="reservationStatusClass(item.reservation_status)"
                  >{{ item.reservation_status ?? "-" }}</span
                >
                <span
                  class="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                  :class="paymentStatusClass(item.payment_status)"
                  >{{ item.payment_status ?? "-" }}</span
                >
              </div>
            </div>

            <div
              v-if="store.detailMeta.last_page > 1"
              class="flex items-center justify-center gap-2 pt-2"
            >
              <button
                @click="changeDetailPage(detailPage - 1)"
                :disabled="detailPage === 1"
                class="text-xs px-2 py-1 rounded border border-gray-200 disabled:opacity-40 hover:border-[#D85A30] hover:text-[#D85A30]"
              >
                ‹
              </button>
              <span class="text-xs text-gray-500">
                {{ detailPage }} / {{ store.detailMeta.last_page }}
              </span>
              <button
                @click="changeDetailPage(detailPage + 1)"
                :disabled="detailPage === store.detailMeta.last_page"
                class="text-xs px-2 py-1 rounded border border-gray-200 disabled:opacity-40 hover:border-[#D85A30] hover:text-[#D85A30]"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { BarChart } from "vue-chart-3"; // Fix 2: BarChart
import { Chart, registerables } from "chart.js";
import { useProductSalesReportStore } from "../stores/productSaleReport.js";
import Layout from "./Layout.vue";

Chart.register(...registerables);

const store = useProductSalesReportStore();

// ── Constants ─────────────────────────────────────────────────────────────────
const BAR_COLORS = [
  "#D85A30",
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
  "#84cc16",
];

const productTypes = [
  { val: "App\\Models\\Hotel", label: "Hotel" },
  { val: "App\\Models\\EntranceTicket", label: "Entrance Ticket" },
  { val: "App\\Models\\PrivateVanTour", label: "Private Van Tour" },
];

const periodOptions = [
  { val: "month", label: "Month" }, // Fix 1: month → daily bars
  { val: "year", label: "Year" }, // Fix 1: year  → monthly bars
];

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

const curYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 4 }, (_, i) => curYear - i);
const graphMetric = ref("amount"); // 'amount' | 'qty'

// ── Filter state ──────────────────────────────────────────────────────────────
const selectedYear = ref(curYear);
const selectedMonth = ref(new Date().getMonth() + 1);
const period = ref("month");
const selectedProductType = ref("App\\Models\\Hotel");

// ── Product selector state ────────────────────────────────────────────────────
const productSearch = ref("");
const productPage = ref(1);
const selectedProductIds = ref([]);
const selectedProductNames = ref([]);

// ── Detail panel state ────────────────────────────────────────────────────────
const selectedLine = ref(null);
const detailPage = ref(1);

let searchDebounceTimer = null;
onUnmounted(() => clearTimeout(searchDebounceTimer));

// ── Computed ──────────────────────────────────────────────────────────────────
const daterange = computed(() => {
  const y = selectedYear.value;
  const m = String(selectedMonth.value).padStart(2, "0");
  if (period.value === "year") return `${y}-01-01,${y}-12-31`;
  const last = new Date(y, selectedMonth.value, 0).getDate();
  return `${y}-${m}-01,${y}-${m}-${last}`;
});

const grandTotal = computed(() =>
  store.seriesData
    .flatMap((s) => s.data)
    .reduce((sum, d) => sum + (d.total_amount ?? 0), 0),
);

const totalQuantity = computed(() =>
  store.seriesData
    .flatMap((s) => s.data)
    .reduce((sum, d) => sum + (d.total_quantity ?? 0), 0),
);

// Fix 1: all unique period labels sorted — daily when month view, monthly when year view
// const allPeriods = computed(() => {
//   const set = new Set();
//   store.seriesData.forEach((s) => s.data.forEach((d) => set.add(d.period)));
//   return [...set].sort();
// });
const allPeriods = computed(() => {
  if (period.value === "month") {
    // Return ALL days in the selected month, not just days with data
    return getAllDaysInMonth(selectedYear.value, selectedMonth.value);
  } else {
    // Return ALL months in the selected year
    return getAllMonthsInYear(selectedYear.value);
  }
});

// Fix 1 + 2: x-axis labels formatted nicely for daily vs monthly
const periodLabels = computed(() =>
  allPeriods.value.map((p) => {
    if (period.value === "month") {
      // "2025-03-15" → "15" (just the day number)
      const day = p.split("-")[2];
      return day;
    }
    // "2025-03" → "Mar"
    const [, m] = p.split("-");
    return monthLabels[parseInt(m, 10) - 1];
  }),
);

// Fix 2: grouped bar datasets — one dataset per product, each with its own color
const chartData = computed(() => ({
  labels: periodLabels.value,
  datasets: store.seriesData.map((s, i) => {
    const color = BAR_COLORS[i % BAR_COLORS.length];

    // Create a map of existing data by period
    const dataMap = new Map();
    s.data.forEach((d) => {
      dataMap.set(d.period, {
        amount: d.total_amount,
        qty: d.total_quantity,
        profit: d.total_profit,
        booking_count: d.booking_count,
      });
    });

    // Build data array for all periods (use 0 for missing periods)
    const data = allPeriods.value.map((period) => {
      const existingData = dataMap.get(period);
      if (existingData) {
        return graphMetric.value === "amount"
          ? existingData.amount
          : existingData.qty;
      }
      return 0; // Return 0 for periods with no data
    });

    // Build background colors (dimmed for periods with no data if selected)
    const backgroundColors = allPeriods.value.map((period) => {
      if (!selectedLine.value) return color;
      const isSelected =
        selectedLine.value.product_id === s.product_id &&
        selectedLine.value.period === period;
      return isSelected ? color : color + "44";
    });

    return {
      label: s.product_name,
      data: data,
      backgroundColor: backgroundColors,
      borderColor: color,
      borderWidth: 1,
      borderRadius: 0,
      borderSkipped: false,
    };
  }),
}));

// Fix 2: chart options for grouped bar
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  onClick: (evt, els) => {
    if (!els.length) return;
    const datasetIdx = els[0].datasetIndex;
    const pointIdx = els[0].index;
    const series = store.seriesData[datasetIdx];
    const periodVal = allPeriods.value[pointIdx];
    const point = series?.data.find((d) => d.period === periodVal);
    if (!series || !point) return;

    selectedLine.value = {
      product_id: series.product_id,
      product_type: series.product_type,
      name: series.product_name,
      color: BAR_COLORS[datasetIdx % BAR_COLORS.length],
      period: periodVal,
      total_amount: point.total_amount,
      booking_count: point.booking_count,
    };
    detailPage.value = 1;
    loadDetail();
  },
  plugins: {
    legend: {
      position: "bottom",
      labels: { boxWidth: 12, font: { size: 10 } },
    },
    tooltip: {
      callbacks: {
        title: (ctx) => allPeriods.value[ctx[0].dataIndex],
        label: (ctx) => {
          const s = store.seriesData[ctx.datasetIndex];
          const d = s?.data.find(
            (r) => r.period === allPeriods.value[ctx.dataIndex],
          );
          if (!d) return "";
          if (graphMetric.value === "amount") {
            return ` ${s.product_name}: ${formatNumber(d.total_amount)} THB`;
          } else {
            return ` ${s.product_name}: ${d.total_quantity} qty`;
          }
        },
        afterBody: (ctx) => {
          const s = store.seriesData[ctx[0].datasetIndex];
          const d = s?.data.find(
            (r) => r.period === allPeriods.value[ctx[0].dataIndex],
          );
          if (!d) return [];
          if (graphMetric.value === "amount") {
            return [
              `Qty: ${d.total_quantity}`,
              `Profit: ${formatNumber(d.total_profit)} THB`,
            ];
          } else {
            return [
              `Amount: ${formatNumber(d.total_amount)} THB`,
              `Profit: ${formatNumber(d.total_profit)} THB`,
            ];
          }
        },
      },
    },
  },
  scales: {
    x: {
      stacked: true,
      grid: { display: false },
      ticks: { font: { size: 10 } },
    },
    y: {
      stacked: true,
      beginAtZero: true,
      title: {
        display: true,
        text: graphMetric.value === "amount" ? "THB" : "Nights / Qty",
        font: { size: 10 },
      },
      ticks: {
        font: { size: 10 },
        callback: (v) => (v >= 1000 ? (v / 1000).toFixed(0) + "k" : v),
      },
    },
  },
}));

// ── Add this helper function to get all days in a month ──
function getAllDaysInMonth(year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const dayStr = `${year}-${String(month).padStart(2, "0")}-${String(
      i,
    ).padStart(2, "0")}`;
    days.push(dayStr);
  }
  return days;
}

// ── Add this helper function to get all months in a year ──
function getAllMonthsInYear(year) {
  const months = [];
  for (let i = 1; i <= 12; i++) {
    months.push(`${year}-${String(i).padStart(2, "0")}`);
  }
  return months;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatNumber = (n) => Math.round(n ?? 0).toLocaleString();

function reservationStatusClass(val) {
  if (val === "confirmed") return "bg-green-100 text-green-700";
  if (val === "reserved") return "bg-blue-100 text-blue-700";
  return "bg-gray-100 text-gray-500";
}

function paymentStatusClass(val) {
  if (val === "fully_paid") return "bg-green-100 text-green-700";
  if (val === "partially_paid") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-500";
}

// ── Product selector ──────────────────────────────────────────────────────────
function onProductSearch() {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    productPage.value = 1;
    store.searchAvailableProducts(
      selectedProductType.value,
      productSearch.value,
      1,
    );
  }, 350);
}

const goToBooking = (id) => {
  window.open(`/bookings/new-update/${id}`, "_blink");
};

function clearProductSearch() {
  productSearch.value = "";
  productPage.value = 1;
  store.searchAvailableProducts(selectedProductType.value, "", 1);
}

async function changeProductPage(page) {
  if (page < 1 || page > store.productMeta.last_page) return;
  productPage.value = page;
  await store.searchAvailableProducts(
    selectedProductType.value,
    productSearch.value,
    page,
  );
}

function toggleProduct(id, name) {
  const existingIdx = selectedProductNames.value.findIndex((p) => p.id === id);
  if (existingIdx === -1) {
    selectedProductIds.value.push(id);
    selectedProductNames.value.push({ id, name });
  } else {
    removeProduct(existingIdx);
    return;
  }
  fetchGraph();
}

function removeProduct(nameIdx) {
  const item = selectedProductNames.value[nameIdx];
  if (!item) return;
  selectedProductIds.value = selectedProductIds.value.filter(
    (id) => id !== item.id,
  );
  selectedProductNames.value.splice(nameIdx, 1);
  fetchGraph();
}

function clearProductSelection() {
  selectedProductIds.value = [];
  selectedProductNames.value = [];
  fetchGraph();
}

// ── Main actions ──────────────────────────────────────────────────────────────
async function onTypeChange() {
  selectedProductIds.value = [];
  selectedProductNames.value = [];
  selectedLine.value = null;
  productSearch.value = "";
  productPage.value = 1;
  store.clearDetail();
  await store.fetchAvailableProducts(selectedProductType.value);
  await fetchGraph();
}

async function fetchGraph() {
  selectedLine.value = null;
  store.clearDetail();
  await store.fetchProductSalesGraph(
    daterange.value,
    period.value,
    selectedProductType.value,
    selectedProductIds.value,
  );

  // Optional: If your backend doesn't return all periods, you might need to
  // transform the data here to include zero values for missing periods
  transformSeriesDataToIncludeAllPeriods();
}

// ── Add this function to ensure all periods are represented (backend fallback) ──
function transformSeriesDataToIncludeAllPeriods() {
  if (!store.seriesData.length) return;

  const allPossiblePeriods = allPeriods.value;

  store.seriesData.forEach((series) => {
    const existingPeriods = new Set(series.data.map((d) => d.period));
    const missingPeriods = allPossiblePeriods.filter(
      (p) => !existingPeriods.has(p),
    );

    // Add missing periods with zero values
    missingPeriods.forEach((period) => {
      series.data.push({
        period: period,
        total_amount: 0,
        total_quantity: 0,
        total_profit: 0,
        booking_count: 0,
      });
    });

    // Sort by period
    series.data.sort((a, b) => a.period.localeCompare(b.period));
  });
}

async function loadDetail() {
  if (!selectedLine.value) return;
  await store.fetchProductSalesDetail(
    selectedLine.value.product_id,
    selectedLine.value.product_type,
    selectedLine.value.period, // "2025-03-15" (day) or "2025-03" (month)
    period.value, // "month" or "year" — tells backend which format
    detailPage.value,
  );
}

async function changeDetailPage(page) {
  if (page < 1 || page > store.detailMeta.last_page) return;
  detailPage.value = page;
  await loadDetail();
}

watch([selectedYear, selectedMonth], () => {
  if (period.value === "month") {
    fetchGraph();
  }
});

watch(selectedYear, () => {
  if (period.value === "year") {
    fetchGraph();
  }
});

// ── Init ──────────────────────────────────────────────────────────────────────
onMounted(async () => {
  await store.fetchAvailableProducts(selectedProductType.value);
  await fetchGraph();
});
</script>
