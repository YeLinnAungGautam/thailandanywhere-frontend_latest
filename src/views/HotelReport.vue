<template>
  <Layout>
    <div class="flex gap-4 w-full min-h-[580px]">
      <!-- LEFT: Chart -->
      <div class="flex-[2] bg-white rounded-xl shadow-sm p-5 flex flex-col">
        <div class="flex items-start justify-between flex-wrap gap-3 mb-4">
          <div>
            <p class="text-sm font-semibold text-gray-800">Hotel Price Group</p>
            <p class="text-xs text-gray-500 mt-1">
              Total Sales:
              <span class="text-[#D85A30] font-semibold"
                >{{ formatNumber(totalAmount) }} THB</span
              >
              &nbsp; Total Qty:
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
                v-for="m in modeOptions"
                :key="m.val"
                @click="mode = m.val"
                :class="[
                  'px-3 py-1.5 font-medium transition-colors',
                  mode === m.val
                    ? 'bg-[#D85A30] text-white'
                    : 'text-gray-600 hover:bg-gray-50',
                ]"
              >
                {{ m.label }}
              </button>
            </div>
            <div
              class="flex border border-gray-200 rounded-lg overflow-hidden text-xs"
            >
              <button
                v-for="p in periodOptions"
                :key="p.val"
                @click="
                  period = p.val;
                  fetchData();
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
            <select
              v-model="selectedYear"
              @change="fetchData"
              class="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#D85A30]"
            >
              <option v-for="y in yearOptions" :key="y" :value="y">
                {{ y }}
              </option>
            </select>
            <select
              v-if="period === 'month'"
              v-model="selectedMonth"
              @change="fetchData"
              class="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#D85A30]"
            >
              <option v-for="(m, i) in monthLabels" :key="i + 1" :value="i + 1">
                {{ m }}
              </option>
            </select>
          </div>
        </div>

        <!-- Summary cards -->
        <div class="grid grid-cols-4 gap-2 mb-4">
          <div
            v-for="g in priceGroups"
            :key="g.key"
            class="rounded-lg p-3 cursor-pointer border-2 transition-all"
            :class="[
              selectedGroup === g.key
                ? 'border-[#D85A30] bg-orange-50'
                : 'border-transparent bg-gray-50 hover:border-gray-200',
            ]"
            @click="selectGroup(g.key)"
          >
            <div class="flex items-center gap-1.5 mb-1">
              <span
                class="w-2 h-2 rounded-full"
                :style="{ backgroundColor: g.color }"
              ></span>
              <p class="text-[10px] text-gray-500 font-medium">{{ g.label }}</p>
            </div>
            <p class="text-sm font-semibold" :style="{ color: g.color }">
              {{ formatNumber(groupSummary(g.key).total_amount) }}
              <span class="text-[10px] font-normal text-gray-400">THB</span>
            </p>
            <p class="text-[10px] text-gray-400 mt-0.5">
              {{ groupSummary(g.key).total_quantity }} sold
            </p>
          </div>
        </div>

        <!-- Legend -->
        <div class="flex flex-wrap gap-3 text-[11px] text-gray-500 mb-3">
          <span
            v-for="g in priceGroups"
            :key="g.key"
            class="flex items-center gap-1.5"
          >
            <span
              class="w-2.5 h-2.5 rounded-sm"
              :style="{ backgroundColor: g.color }"
            ></span>
            {{ g.label }}
          </span>
        </div>

        <!-- Chart -->
        <div class="flex-1 relative min-h-[320px]">
          <div
            v-if="reportStore.loadingPriceGroup"
            class="absolute inset-0 flex items-center justify-center"
          >
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D85A30]"
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

      <!-- RIGHT: Drill-down panel -->
      <div class="flex-1 bg-white rounded-xl shadow-sm flex flex-col h-[85vh]">
        <!-- Header -->
        <div class="px-4 py-3 border-b border-gray-100">
          <div v-if="selectedGroup">
            <div class="flex items-center gap-2">
              <span
                class="w-2.5 h-2.5 rounded-full"
                :style="{ backgroundColor: activeGroupMeta?.color }"
              ></span>
              <p class="text-sm font-semibold text-gray-800">
                {{ activeGroupMeta?.label }}
              </p>
            </div>
            <p class="text-xs text-gray-400 mt-0.5">
              {{ formatNumber(groupSummary(selectedGroup).total_amount) }} THB
              &nbsp;·&nbsp;
              {{ groupSummary(selectedGroup).total_quantity }} bookings
              &nbsp;·&nbsp; {{ groupSummary(selectedGroup).hotel_count }} hotels
            </p>
          </div>
          <p v-else class="text-sm text-gray-400 py-1">
            Click a group bar to see hotel detail
          </p>
        </div>

        <div class="flex-1 overflow-y-auto px-4 py-3">
          <!-- Empty state -->
          <div
            v-if="!selectedGroup"
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <p class="text-xs text-center leading-relaxed">
              Select a price group on the<br />chart to view hotels
            </p>
          </div>

          <!-- Loading -->
          <div
            v-else-if="reportStore.loadingPriceGroupDetail"
            class="flex items-center justify-center h-40"
          >
            <div
              class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#D85A30]"
            ></div>
          </div>

          <!-- No data -->
          <div
            v-else-if="hotelDetails.length === 0"
            class="flex flex-col items-center justify-center h-40 text-gray-300"
          >
            <p class="text-xs">No hotels in this group</p>
          </div>

          <!-- Hotel cards with booking items dropdown -->
          <div v-else class="space-y-2">
            <div
              v-for="hotel in hotelDetails"
              :key="hotel.product_id"
              class="border rounded-lg overflow-hidden transition-all duration-200"
              :class="[
                expandedHotelId === hotel.product_id
                  ? 'border-[#D85A30]/40 shadow-sm'
                  : 'border-gray-100',
              ]"
            >
              <!-- Hotel header row — click to toggle -->
              <div
                class="p-3 cursor-pointer transition-colors"
                :class="[
                  expandedHotelId === hotel.product_id
                    ? 'bg-orange-50/50'
                    : 'hover:bg-gray-50/60',
                ]"
                @click="toggleHotel(hotel.product_id)"
              >
                <div class="flex items-start justify-between mb-2">
                  <p
                    class="text-xs font-semibold text-gray-800 flex-1 pr-2 leading-tight"
                  >
                    {{ hotel.hotel_name }}
                  </p>
                  <div class="flex items-center gap-1.5 shrink-0">
                    <span
                      class="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      :style="{
                        backgroundColor: activeGroupMeta?.colorLight,
                        color: activeGroupMeta?.color,
                      }"
                    >
                      {{ activeGroupMeta?.label }}
                    </span>
                    <!-- Chevron icon -->
                    <svg
                      class="w-3.5 h-3.5 text-gray-400 transition-transform duration-200"
                      :class="{
                        'rotate-180': expandedHotelId === hotel.product_id,
                      }"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                <!-- Stats -->
                <div class="grid grid-cols-3 gap-1">
                  <div
                    class="bg-white rounded p-1.5 text-center border border-gray-100"
                  >
                    <p class="text-[9px] text-gray-400">Amount</p>
                    <p class="text-[11px] font-semibold text-gray-700">
                      {{ formatNumber(hotel.total_amount) }}
                    </p>
                  </div>
                  <div
                    class="bg-white rounded p-1.5 text-center border border-gray-100"
                  >
                    <p class="text-[9px] text-gray-400">Qty</p>
                    <p class="text-[11px] font-semibold text-gray-700">
                      {{ hotel.total_quantity }}
                    </p>
                  </div>
                  <div
                    class="bg-white rounded p-1.5 text-center border border-gray-100"
                  >
                    <p class="text-[9px] text-gray-400">Bookings</p>
                    <p class="text-[11px] font-semibold text-gray-700">
                      {{ hotel.booking_count }}
                    </p>
                  </div>
                </div>

                <!-- Room price range -->
                <div
                  class="flex items-center justify-between mt-2 pt-1.5 border-t border-gray-100"
                >
                  <p class="text-[10px] text-gray-400">
                    Room price:
                    <span class="text-gray-600"
                      >{{ formatNumber(hotel.room_min_price) }} –
                      {{ formatNumber(hotel.room_max_price) }} THB</span
                    >
                  </p>
                  <p
                    class="text-[10px]"
                    :style="{ color: activeGroupMeta?.color }"
                  >
                    {{ hotel.booking_items?.length ?? 0 }} items
                    <span>{{
                      expandedHotelId === hotel.product_id ? "▲" : "▼"
                    }}</span>
                  </p>
                </div>
              </div>

              <!-- ── Booking items dropdown ── -->
              <div
                v-if="expandedHotelId === hotel.product_id"
                class="border-t border-gray-100"
              >
                <!-- Column headers -->
                <div
                  class="grid grid-cols-5 gap-1 px-3 py-1.5 bg-gray-100 text-[9px] font-semibold text-gray-500 uppercase tracking-wide"
                >
                  <div class="col-span-2">CRM / Room</div>
                  <div class="text-right">Amount</div>
                  <div class="text-right">Cost</div>
                  <div class="text-right">Profit</div>
                </div>

                <div
                  v-if="hotel.booking_items && hotel.booking_items.length > 0"
                  class="divide-y divide-gray-50"
                >
                  <div
                    v-for="item in hotel.booking_items"
                    :key="item.id"
                    class="px-3 py-2 hover:bg-orange-50/20 transition-colors"
                  >
                    <!-- Row 1: CRM + status + service date -->
                    <div class="flex items-center justify-between mb-1">
                      <div class="flex items-center gap-1.5">
                        <span class="text-[10px] font-bold text-[#D85A30]">{{
                          item.crm_id
                        }}</span>
                        <span class="text-[9px] text-gray-300">|</span>
                        <span
                          class="text-[9px] text-gray-500 truncate max-w-[100px]"
                          >{{ item.room_name }}</span
                        >
                      </div>
                      <div class="flex items-center gap-1.5">
                        <span class="text-[9px] text-gray-400">{{
                          item.service_date
                        }}</span>
                      </div>
                    </div>

                    <!-- Row 2: financials -->
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
                        <span class="text-[10px] font-semibold text-gray-700">{{
                          formatNumber(item.amount)
                        }}</span>
                      </div>
                      <div class="text-right">
                        <span class="text-[10px] text-gray-500">{{
                          formatNumber(item.cost_price)
                        }}</span>
                      </div>
                      <div class="text-right">
                        <span
                          class="text-[10px] font-semibold"
                          :class="[
                            item.profit >= 0
                              ? 'text-green-600'
                              : 'text-red-500',
                          ]"
                        >
                          {{ formatNumber(item.profit) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="px-3 py-4 text-center">
                  <p class="text-[11px] text-gray-300">No booking items</p>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div
              v-if="detailTotalPages > 1"
              class="flex items-center justify-center gap-2 pt-2"
            >
              <button
                @click="changePage(detailPage - 1)"
                :disabled="detailPage === 1"
                class="text-xs px-2 py-1 rounded border border-gray-200 disabled:opacity-40 hover:border-[#D85A30] hover:text-[#D85A30]"
              >
                ‹
              </button>
              <span class="text-xs text-gray-500"
                >{{ detailPage }} / {{ detailTotalPages }}</span
              >
              <button
                @click="changePage(detailPage + 1)"
                :disabled="detailPage === detailTotalPages"
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
import { ref, computed, onMounted } from "vue";
import { BarChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
import { useReportStore } from "../stores/hotelReport";
import Layout from "./Layout.vue";

Chart.register(...registerables);

const reportStore = useReportStore();

const priceGroups = [
  {
    key: "budget",
    label: "Budget",
    range: "0 – 1,200",
    color: "#22c55e",
    colorLight: "#dcfce7",
  },
  {
    key: "standard",
    label: "Standard",
    range: "1,200 – 2,000",
    color: "#3b82f6",
    colorLight: "#dbeafe",
  },
  {
    key: "premium",
    label: "Premium",
    range: "2,000 – 4,000",
    color: "#f59e0b",
    colorLight: "#fef3c7",
  },
  {
    key: "luxury",
    label: "Luxury",
    range: "4,000+",
    color: "#8b5cf6",
    colorLight: "#ede9fe",
  },
];

// ── State ──────────────────────────────────────────────────────────────────
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth() + 1);
const period = ref("month");
const mode = ref("amount");
const selectedGroup = ref(null);
const expandedHotelId = ref(null); // which hotel's booking items are shown
const hotelDetails = ref([]);
const detailPage = ref(1);
const detailTotalPages = ref(1);

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
  { val: "amount", label: "Amount" },
  { val: "quantity", label: "Quantity" },
];
const periodOptions = [
  { val: "month", label: "Month" },
  { val: "year", label: "Year" },
];

const formatNumber = (n) => Math.round(n ?? 0).toLocaleString();

const daterange = computed(() => {
  if (period.value === "year")
    return `${selectedYear.value}-01-01,${selectedYear.value}-12-31`;
  const y = selectedYear.value;
  const m = String(selectedMonth.value).padStart(2, "0");
  const lastDay = new Date(y, selectedMonth.value, 0).getDate();
  return `${y}-${m}-01,${y}-${m}-${lastDay}`;
});

const summaryData = computed(() => reportStore.priceGroupSummary ?? []);
const activeGroupMeta = computed(() =>
  priceGroups.find((g) => g.key === selectedGroup.value),
);
const groupSummary = (key) =>
  summaryData.value.find((d) => d.group === key) ?? {
    total_amount: 0,
    total_quantity: 0,
    hotel_count: 0,
  };
const totalAmount = computed(() =>
  summaryData.value.reduce((s, d) => s + (d.total_amount ?? 0), 0),
);
const totalQuantity = computed(() =>
  summaryData.value.reduce((s, d) => s + (d.total_quantity ?? 0), 0),
);

// ── Chart ──────────────────────────────────────────────────────────────────
const chartData = computed(() => ({
  labels: priceGroups.map((g) => `${g.label}\n${g.range}`),
  datasets: [
    {
      label: mode.value === "amount" ? "Total Amount (THB)" : "Total Quantity",
      data: priceGroups.map((g) => {
        const s = groupSummary(g.key);
        return mode.value === "amount" ? s.total_amount : s.total_quantity;
      }),
      backgroundColor: priceGroups.map((g) =>
        selectedGroup.value === g.key ? g.color : g.color + "aa",
      ),
      borderColor: priceGroups.map((g) => g.color),
      borderWidth: priceGroups.map((g) =>
        selectedGroup.value === g.key ? 2 : 1,
      ),
      borderRadius: 6,
      borderSkipped: false,
    },
  ],
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  onClick: (evt, els) => {
    if (!els.length) return;
    const key = priceGroups[els[0].index]?.key;
    if (key) selectGroup(key);
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 10 } } },
    y: {
      beginAtZero: true,
      grid: { color: "rgba(0,0,0,0.04)" },
      ticks: {
        font: { size: 10 },
        callback: (v) =>
          mode.value === "amount"
            ? v >= 1000
              ? (v / 1000).toFixed(0) + "k"
              : v
            : v,
      },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        title: (ctx) => {
          const g = priceGroups[ctx[0].dataIndex];
          return `${g.label} (${g.range} THB)`;
        },
        afterBody: (ctx) => {
          const s = groupSummary(priceGroups[ctx[0].dataIndex].key);
          return [
            `Amount:   ${formatNumber(s.total_amount)} THB`,
            `Quantity: ${s.total_quantity}`,
            `Hotels:   ${s.hotel_count}`,
          ];
        },
      },
    },
  },
}));

// ── Actions ────────────────────────────────────────────────────────────────
async function fetchData() {
  selectedGroup.value = null;
  expandedHotelId.value = null;
  hotelDetails.value = [];
  await reportStore.fetchHotelPriceGroupSummary(daterange.value);
}

async function selectGroup(key) {
  selectedGroup.value = key;
  expandedHotelId.value = null;
  detailPage.value = 1;
  hotelDetails.value = [];
  await loadDetail();
}

async function loadDetail() {
  const res = await reportStore.fetchHotelPriceGroupDetail(
    daterange.value,
    selectedGroup.value,
    detailPage.value,
  );
  hotelDetails.value = res?.data ?? [];
  detailTotalPages.value = res?.meta?.last_page ?? 1;
}

async function changePage(page) {
  if (page < 1 || page > detailTotalPages.value) return;
  expandedHotelId.value = null;
  detailPage.value = page;
  await loadDetail();
}

// Toggle expand/collapse booking items for a hotel
function toggleHotel(hotelId) {
  expandedHotelId.value = expandedHotelId.value === hotelId ? null : hotelId;
}

onMounted(fetchData);
</script>
