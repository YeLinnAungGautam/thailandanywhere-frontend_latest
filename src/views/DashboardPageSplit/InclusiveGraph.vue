<template>
  <Layout>
    <div class="flex gap-4 w-full min-h-[600px]">
      <!-- LEFT: Graph (2/3) -->
      <div class="flex-[2] bg-white rounded-xl shadow-sm p-5 flex flex-col">
        <!-- Header controls -->
        <div class="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <p class="text-sm font-semibold tracking-wide text-gray-800">
              Inclusive Bookings
            </p>
            <div class="flex items-center gap-4 mt-1">
              <p class="text-xs text-gray-500">
                Total Amount:
                <span class="text-[#FF5B00] font-semibold"
                  >{{ formatNumber(totalAmount) }} THB</span
                >
              </p>
              <p class="text-xs text-gray-500">
                Total Bookings:
                <span class="text-[#FF5B00] font-semibold">{{
                  totalCount
                }}</span>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3 flex-wrap">
            <!-- Search By Toggle -->
            <div
              class="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden text-xs"
            >
              <button
                @click="searchBy = 'created_at'"
                :class="[
                  'px-3 py-1.5 transition-colors font-medium',
                  searchBy === 'created_at'
                    ? 'bg-[#FF5B00] text-white'
                    : 'text-gray-600 hover:bg-gray-50',
                ]"
              >
                Sale Date
              </button>
              <button
                @click="searchBy = 'inclusive_start_date'"
                :class="[
                  'px-3 py-1.5 transition-colors font-medium',
                  searchBy === 'inclusive_start_date'
                    ? 'bg-[#FF5B00] text-white'
                    : 'text-gray-600 hover:bg-gray-50',
                ]"
              >
                Start Date
              </button>
            </div>

            <!-- Graph Mode Toggle -->
            <div
              class="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden text-xs"
            >
              <button
                @click="graphMode = 'amount'"
                :class="[
                  'px-3 py-1.5 transition-colors font-medium',
                  graphMode === 'amount'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-50',
                ]"
              >
                Amount
              </button>
              <button
                @click="graphMode = 'count'"
                :class="[
                  'px-3 py-1.5 transition-colors font-medium',
                  graphMode === 'count'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-50',
                ]"
              >
                Count
              </button>
            </div>

            <!-- Month Picker -->
            <input
              type="month"
              v-model="selectedMonth"
              class="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#FF5B00] w-[160px]"
            />
          </div>
        </div>

        <!-- Chart -->
        <div class="flex-1 relative min-h-[420px]">
          <div
            v-if="loadingGraph"
            class="absolute inset-0 flex items-center justify-center"
          >
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF5B00]"
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

      <!-- RIGHT: Booking List (1/3) -->
      <div
        class="flex-1 bg-white rounded-xl shadow-sm flex flex-col overflow-hidden"
      >
        <!-- Panel Header -->
        <div class="px-4 py-3 border-b border-gray-100">
          <div v-if="selectedDay">
            <p class="text-sm font-semibold text-gray-800">
              {{ formatDisplayDate(selectedDay) }}
            </p>
            <p class="text-xs text-gray-400 mt-0.5">
              {{ dayBookings.length }} inclusive booking{{
                dayBookings.length !== 1 ? "s" : ""
              }}
            </p>
          </div>
          <div v-else class="text-center py-2">
            <p class="text-sm text-gray-400">Click a bar to see bookings</p>
          </div>
        </div>

        <!-- List -->
        <div class="flex-1 overflow-y-auto px-3 py-2">
          <div v-if="loadingList" class="flex items-center justify-center h-40">
            <div
              class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FF5B00]"
            ></div>
          </div>

          <div
            v-else-if="selectedDay && dayBookings.length === 0"
            class="flex flex-col items-center justify-center h-40 text-gray-400"
          >
            <svg
              class="w-10 h-10 mb-2 text-gray-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p class="text-xs">No bookings this day</p>
          </div>

          <div
            v-else-if="!selectedDay"
            class="flex flex-col items-center justify-center h-full text-gray-300 py-10"
          >
            <svg
              class="w-14 h-14 mb-3"
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
              Select a date on the<br />graph to view bookings
            </p>
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="booking in dayBookings"
              :key="booking.id"
              class="border border-gray-100 rounded-lg p-3 hover:border-[#FF5B00]/30 hover:bg-orange-50/30 transition-all cursor-pointer group"
              @click="goToBooking(booking.id)"
            >
              <div class="flex items-start justify-between mb-1.5">
                <div>
                  <p
                    class="text-xs font-semibold text-gray-800 group-hover:text-[#FF5B00] transition-colors"
                  >
                    {{ booking.customer?.name ?? "—" }}
                  </p>
                  <p class="text-[10px] text-gray-400 mt-0.5">
                    {{ booking.crm_id }}
                  </p>
                </div>
                <span
                  class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-orange-100 text-[#FF5B00]"
                >
                  Inclusive
                </span>
              </div>

              <div class="flex items-center justify-between">
                <p class="text-[11px] text-gray-500">
                  {{
                    booking.inclusive_start_date ?? booking.booking_date ?? "—"
                  }}
                </p>
                <p class="text-xs font-semibold text-gray-700">
                  {{ formatNumber(booking.grand_total ?? 0) }}
                  <span class="text-[10px] font-normal text-gray-400">THB</span>
                </p>
              </div>

              <div
                class="flex items-center gap-3 mt-1.5 pt-1.5 border-t border-gray-50"
              >
                <p class="text-[10px] text-gray-400">
                  Deposit:
                  <span class="text-gray-600">{{
                    formatNumber(booking.deposit ?? 0)
                  }}</span>
                </p>
                <p class="text-[10px] text-gray-400">
                  Balance:
                  <span class="text-gray-600">{{
                    formatNumber(booking.balance_due ?? 0)
                  }}</span>
                </p>
              </div>
            </div>

            <div
              v-if="totalPages > 1"
              class="flex items-center justify-center gap-2 pt-2"
            >
              <button
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="text-xs px-2 py-1 rounded border border-gray-200 disabled:opacity-40 hover:border-[#FF5B00] hover:text-[#FF5B00] transition-colors"
              >
                ‹
              </button>
              <span class="text-xs text-gray-500"
                >{{ currentPage }} / {{ totalPages }}</span
              >
              <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="text-xs px-2 py-1 rounded border border-gray-200 disabled:opacity-40 hover:border-[#FF5B00] hover:text-[#FF5B00] transition-colors"
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
import { ref, computed, watch, onMounted, reactive } from "vue";
import { BarChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
import { useHomeStore } from "../../stores/home";
import Layout from "../Layout.vue";
import { useRouter } from "vue-router";

Chart.register(...registerables);

const homeStore = useHomeStore();
const router = useRouter();

// ── State ─────────────────────────────────────────────────────────────────
const searchBy = ref("created_at");
const graphMode = ref("count"); // 'amount' | 'count'
const selectedMonth = ref("");
const selectedDay = ref(null);
const loadingGraph = ref(false);
const loadingList = ref(false);
const dayBookings = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const totalAmount = ref(0);
const totalCount = ref(0);

// ── Chart raw data ─────────────────────────────────────────────────────────
const chartLabels = reactive({ items: [] });
const chartAmounts = reactive({ items: [] });
const chartCounts = reactive({ items: [] });

// ── chartData switches dataset based on graphMode — no refetch needed ──────
const chartData = computed(() => {
  const isAmount = graphMode.value === "amount";
  const activeColor = isAmount ? "rgb(255, 87, 51)" : "rgb(59, 130, 246)";
  const activeFadeColor = isAmount
    ? "rgba(255, 87, 51, 0.35)"
    : "rgba(59, 130, 246, 0.35)";
  const activeBorderColor = isAmount
    ? "rgba(255, 87, 51, 0.6)"
    : "rgba(59, 130, 246, 0.6)";

  return {
    labels: chartLabels.items,
    datasets: [
      {
        label: isAmount ? "Grand Total (THB)" : "Booking Count",
        type: "bar",
        data: isAmount ? chartAmounts.items : chartCounts.items,
        backgroundColor: chartLabels.items.map((d) =>
          d === selectedDay.value ? activeColor : activeFadeColor,
        ),
        borderColor: chartLabels.items.map((d) =>
          d === selectedDay.value ? activeColor : activeBorderColor,
        ),
        borderWidth: 1,
        borderRadius: 4,
        yAxisID: "y",
      },
    ],
  };
});

const chartOptions = computed(() => {
  const isAmount = graphMode.value === "amount";

  return {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const day = chartLabels.items[elements[0].index];
        if (day) handleDayClick(day);
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: {
          font: { size: 10 },
          callback: (v) =>
            isAmount ? (v >= 1000 ? (v / 1000).toFixed(0) + "k" : v) : v,
        },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 }, maxRotation: 45 },
      },
    },
    plugins: {
      legend: { position: "bottom", labels: { font: { size: 11 } } },
      tooltip: {
        callbacks: {
          // Always show the "other" metric as extra info in tooltip
          afterBody: (ctx) => {
            const idx = ctx[0].dataIndex;
            return isAmount
              ? `Bookings: ${chartCounts.items[idx] ?? 0}`
              : `Amount: ${Number(
                  chartAmounts.items[idx] ?? 0,
                ).toLocaleString()} THB`;
          },
        },
      },
    },
  };
});

// ── Helpers ────────────────────────────────────────────────────────────────
const formatNumber = (n) =>
  Number(n ?? 0).toLocaleString("en-US", { maximumFractionDigits: 0 });

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const currentMonth = () => {
  const d = new Date();
  selectedMonth.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0",
  )}`;
};

// ── API calls ──────────────────────────────────────────────────────────────
const fetchGraphData = async () => {
  if (!selectedMonth.value) return;
  loadingGraph.value = true;
  try {
    const res = await homeStore.getInclusiveGraphList(selectedMonth.value, {
      search_by: searchBy.value,
    });

    const inclusive = res.data?.result?.inclusive_sales ?? [];

    chartLabels.items.splice(0);
    chartAmounts.items.splice(0);
    chartCounts.items.splice(0);
    totalAmount.value = 0;
    totalCount.value = 0;

    inclusive.forEach((day) => {
      const dayTotal = day.agents.reduce((s, a) => s + (a.total ?? 0), 0);
      const dayCount = day.agents.reduce((s, a) => s + (a.total_count ?? 0), 0);

      chartLabels.items.push(day.date);
      chartAmounts.items.push(dayTotal);
      chartCounts.items.push(dayCount);
      totalAmount.value += dayTotal;
      totalCount.value += dayCount;
    });

    if (selectedDay.value && !chartLabels.items.includes(selectedDay.value)) {
      selectedDay.value = null;
      dayBookings.value = [];
    }
  } catch (e) {
    console.error("Inclusive graph fetch error:", e);
  } finally {
    loadingGraph.value = false;
  }
};

const fetchDayBookings = async (day, page = 1) => {
  loadingList.value = true;
  try {
    const res = await homeStore.getInclusiveGraphBooking(selectedMonth.value, {
      day,
      search_by: searchBy.value,
      limit: 10,
      page,
    });

    dayBookings.value = res.data?.result?.data ?? [];
    totalPages.value = res.data?.result?.meta?.total_page ?? 1;
    currentPage.value = page;
  } catch (e) {
    console.error("Day bookings fetch error:", e);
    dayBookings.value = [];
  } finally {
    loadingList.value = false;
  }
};

const handleDayClick = (day) => {
  selectedDay.value = day;
  currentPage.value = 1;
  fetchDayBookings(day, 1);
};

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  fetchDayBookings(selectedDay.value, page);
};

const goToBooking = (id) => {
  window.open(`/bookings/new-update/${id}`, "_blank");
};

// ── Watchers ───────────────────────────────────────────────────────────────
watch(selectedMonth, (v) => {
  if (v) {
    selectedDay.value = null;
    dayBookings.value = [];
    fetchGraphData();
  }
});
watch(searchBy, () => {
  selectedDay.value = null;
  dayBookings.value = [];
  fetchGraphData();
});
// graphMode: no watch needed — chartData computed auto-updates instantly

onMounted(() => {
  currentMonth();
  fetchGraphData();
});
</script>
