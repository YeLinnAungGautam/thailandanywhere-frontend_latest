<template>
  <Layout>
    <div class="flex gap-4 w-full min-h-[580px]">
      <!-- LEFT: Chart -->
      <div class="flex-[2] bg-white rounded-xl shadow-sm p-5 flex flex-col">
        <!-- Header -->
        <div class="flex items-start justify-between flex-wrap gap-3 mb-4">
          <div>
            <p class="text-sm font-semibold text-gray-800">
              Account Receivable — Balance Due Overdue
            </p>
            <p class="text-xs text-gray-500 mt-1">
              Total Overdue:
              <span class="text-red-600 font-semibold">
                {{ formatNumber(summary.total_balance_due) }} THB
              </span>
              &nbsp; Bookings:
              <span class="font-semibold text-gray-700">
                {{ summary.total_count ?? 0 }}
              </span>
            </p>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <!-- Year -->
            <select
              v-model="selectedYear"
              @change="fetchData"
              class="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-red-500"
            >
              <option v-for="y in yearOptions" :key="y" :value="y">
                {{ y }}
              </option>
            </select>

            <!-- Month -->
            <select
              v-model="selectedMonth"
              @change="fetchData"
              class="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-red-500"
            >
              <option v-for="(m, i) in monthLabels" :key="i + 1" :value="i + 1">
                {{ m }}
              </option>
            </select>

            <!-- Refresh -->
            <div
              class="p-2 border border-gray-200 flex justify-center items-center gap-x-2 text-xs text-white bg-red-500 rounded-lg cursor-pointer"
              @click="fetchData"
            >
              <ArrowPathIcon class="w-4 h-4 text-white" /> Refresh
            </div>
          </div>
        </div>

        <!-- Summary cards (super admin only) -->
        <div class="grid grid-cols-3 gap-2 mb-4" v-if="authStore.isSuperAdmin">
          <div class="bg-red-50 rounded-lg p-3">
            <p class="text-[10px] text-gray-500 mb-1">Total Balance Due</p>
            <p class="text-sm font-semibold text-red-600">
              {{ formatNumber(summary.total_balance_due) }} THB
            </p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-[10px] text-gray-500 mb-1">Overdue Bookings</p>
            <p class="text-sm font-semibold text-gray-800">
              {{ summary.total_count ?? 0 }}
            </p>
          </div>
          <div class="bg-orange-50 rounded-lg p-3">
            <p class="text-[10px] text-gray-500 mb-1">Admins with Overdue</p>
            <p class="text-sm font-semibold text-orange-700">
              {{ adminNames.length }}
            </p>
          </div>
        </div>

        <!-- Legend (per-admin colors) -->
        <div class="flex flex-wrap gap-3 text-[11px] text-gray-500 mb-3">
          <span
            v-for="(admin, idx) in adminNames"
            :key="admin"
            class="flex items-center gap-1.5"
          >
            <span
              class="w-2.5 h-2.5 rounded-sm"
              :style="{ background: adminColors[idx % adminColors.length] }"
            ></span>
            {{ admin }}
          </span>
        </div>

        <!-- Chart -->
        <div class="flex-1 relative min-h-[360px]">
          <div
            v-if="loadingGraph"
            class="absolute inset-0 flex items-center justify-center"
          >
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"
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

      <!-- RIGHT: Day detail + booking list -->
      <div class="flex-1 bg-white rounded-xl shadow-sm flex flex-col h-[85vh]">
        <!-- Header -->
        <div class="px-4 py-3 border-b border-gray-100">
          <div v-if="selectedDay" class="flex justify-between items-center">
            <div>
              <p class="text-sm font-semibold text-gray-800">
                {{ selectedDay.date_label }}
              </p>
              <p class="text-xs text-gray-400 mt-0.5">
                {{ selectedDay.total_count }} bookings &nbsp;·&nbsp;
                {{ formatNumber(selectedDay.total_balance_due) }} THB overdue
              </p>
            </div>
            <div>
              <button
                v-if="activeAdminFilter"
                @click="copyFilteredBookings"
                :class="[
                  'ml-auto text-[10px] px-2 py-1 rounded-full font-medium flex items-center gap-1 transition-colors',
                  copiedAdmin
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
                ]"
              >
                <DocumentDuplicateIcon class="w-4 h-4" v-if="!copiedAdmin" />
                <CheckIcon class="w-4 h-4" v-if="copiedAdmin" />
                {{ copiedAdmin ? "Copied!" : "Copy" }}
              </button>
            </div>
          </div>
          <p v-else class="text-sm text-gray-400 py-1">
            Click a bar to see overdue bookings
          </p>
        </div>

        <!-- Admin filter tabs (when day selected) -->
        <div
          v-if="selectedDay && dayAdminNames.length > 1"
          class="flex gap-1 px-3 pt-2 flex-wrap"
        >
          <button
            @click="activeAdminFilter = null"
            :class="[
              'text-[10px] px-2 py-1 rounded-full font-medium transition-colors',
              activeAdminFilter === null
                ? 'bg-gray-700 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
            ]"
          >
            All
          </button>
          <button
            v-for="(admin, idx) in dayAdminNames"
            :key="admin"
            @click="activeAdminFilter = admin"
            :class="[
              'text-[10px] px-2 py-1 rounded-full font-medium transition-colors',
              activeAdminFilter === admin
                ? 'text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
            ]"
            :style="
              activeAdminFilter === admin
                ? { background: adminColorByName(admin) }
                : {}
            "
          >
            {{ admin }}
          </button>
        </div>

        <!-- Booking list -->
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p class="text-xs text-center leading-relaxed">
              Select a date on the<br />graph to view bookings
            </p>
          </div>

          <!-- Loading -->
          <div
            v-else-if="loadingBookings"
            class="flex items-center justify-center h-40"
          >
            <div
              class="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"
            ></div>
          </div>

          <!-- No results -->
          <div
            v-else-if="filteredBookings.length === 0"
            class="flex flex-col items-center justify-center h-40 text-gray-300"
          >
            <p class="text-xs">No overdue bookings found</p>
          </div>

          <!-- Booking cards -->
          <div v-else class="space-y-2">
            <div
              v-for="booking in filteredBookings"
              :key="booking.id"
              class="border rounded-xl p-3 transition-all hover:shadow-sm"
              :style="{
                borderColor: adminColorByName(booking.created_by_name) + '60',
              }"
            >
              <!-- Top row -->
              <div class="flex items-start justify-between gap-2 mb-1.5">
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold text-gray-800 truncate">
                    {{ booking.customer_name }}
                  </p>
                  <p
                    @click="goToBooking(booking.id)"
                    class="text-[10px] px-4 py-1 bg-[#FF613c] inline-block rounded-lg text-white mt-0.5"
                  >
                    {{ booking.booking_crm_id }}
                  </p>
                </div>
                <div class="text-right flex-shrink-0 space-y-1">
                  <span
                    class="text-[9px] font-medium px-2 py-0.5 rounded-full block"
                    :style="{
                      background:
                        adminColorByName(booking.created_by_name) + '22',
                      color: adminColorByName(booking.created_by_name),
                    }"
                  >
                    {{ booking.created_by_name }}
                  </span>
                  <span
                    class="text-[9px] px-2 py-0.5 rounded-full block bg-red-100 text-red-700 font-medium"
                  >
                    {{ booking.payment_status?.replace("_", " ") }}
                  </span>
                </div>
              </div>

              <!-- Middle info -->
              <div class="flex items-center gap-2 flex-wrap mt-1">
                <span class="text-[10px] text-gray-500">
                  Due:
                  <span class="font-medium text-red-500">{{
                    booking.balance_due_date
                  }}</span>
                </span>
                <span
                  class="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full"
                >
                  {{ booking.booking_date }}
                </span>
              </div>

              <!-- Footer -->
              <div
                class="flex items-center justify-between mt-2 pt-2 border-t border-gray-50"
              >
                <div>
                  <p class="text-[10px] text-gray-400">
                    Total:
                    <span class="text-gray-600 font-medium"
                      >{{ formatNumber(booking.total_amount) }} THB</span
                    >
                  </p>
                  <p class="text-[10px] text-gray-400">
                    Paid:
                    <span class="text-green-600 font-medium"
                      >{{ formatNumber(booking.paid_amount) }} THB</span
                    >
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-[10px] text-gray-400">Balance Due</p>
                  <p class="text-sm font-bold text-red-600">
                    {{ formatNumber(booking.balance_due) }} THB
                  </p>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div
              v-if="totalPages > 1"
              class="flex items-center justify-center gap-2 pt-2"
            >
              <button
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="text-xs px-2 py-1 rounded border border-gray-200 disabled:opacity-40 hover:border-red-500 hover:text-red-500"
              >
                ‹
              </button>
              <span class="text-xs text-gray-500"
                >{{ currentPage }} / {{ totalPages }}</span
              >
              <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="text-xs px-2 py-1 rounded border border-gray-200 disabled:opacity-40 hover:border-red-500 hover:text-red-500"
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
import Layout from "../Layout.vue";
import { useHomeStore } from "../../stores/home";
import { useAuthStore } from "../../stores/auth";
import {
  ArrowPathIcon,
  CheckIcon,
  DocumentDuplicateIcon,
} from "@heroicons/vue/24/outline";

Chart.register(...registerables);

const homeStore = useHomeStore();
const authStore = useAuthStore();

// ── State ──────────────────────────────────────────────────────────────────
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth() + 1);
const loadingGraph = ref(false);
const loadingBookings = ref(false);

const days = ref([]); // [{ date, date_label, total_balance_due, total_count, admins: [{name, balance_due, count}] }]
const summary = ref({ total_balance_due: 0, total_count: 0 });
const selectedDay = ref(null);
const activeAdminFilter = ref(null);
const dayBookings = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);

// ── Admin color palette (distinct, readable) ──────────────────────────────
const adminColors = [
  "#E54B4B",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#6366F1",
  "#84CC16",
  "#06B6D4",
  "#D946EF",
];

// All distinct admin names across all days
const adminNames = computed(() => {
  const names = new Set();
  days.value.forEach((d) => d.admins?.forEach((a) => names.add(a.name)));
  return [...names];
});

const adminColorByName = (name) => {
  const idx = adminNames.value.indexOf(name);
  return adminColors[idx >= 0 ? idx % adminColors.length : 0];
};

const goToBooking = (id) => {
  window.open(`/bookings/new-update/${id}`, "_blink");
};

// Admin names present in the selected day
const dayAdminNames = computed(() => {
  if (!selectedDay.value) return [];
  return selectedDay.value.admins?.map((a) => a.name) ?? [];
});

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

const formatNumber = (n) => Math.round(n ?? 0).toLocaleString();

// ── Filtered bookings (right panel) ───────────────────────────────────────
const filteredBookings = computed(() => {
  if (!activeAdminFilter.value) return dayBookings.value;
  return dayBookings.value.filter(
    (b) => b.created_by_name === activeAdminFilter.value,
  );
});

// ── Chart data — stacked by admin ─────────────────────────────────────────
const chartData = computed(() => {
  const labels = days.value.map((d) => d.date_label);

  const datasets = adminNames.value.map((adminName, idx) => ({
    label: adminName,
    data: days.value.map((d) => {
      const found = d.admins?.find((a) => a.name === adminName);
      return found?.balance_due ?? 0;
    }),
    backgroundColor: adminColors[idx % adminColors.length] + "CC",
    borderColor: adminColors[idx % adminColors.length],
    borderWidth: 1,
    borderRadius: 3,
    stack: "stack",
  }));

  return { labels, datasets };
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  onClick: (evt, els) => {
    if (!els.length) return;
    const clickedDay = days.value[els[0].index];
    if (!clickedDay) return;
    selectedDay.value = clickedDay;
    console.log(selectedDay.value, "this is selected day");

    activeAdminFilter.value = null;
    currentPage.value = 1;
    fetchDayBookings(clickedDay.date);
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 9 }, maxRotation: 55, autoSkip: false },
      stacked: true,
    },
    y: {
      beginAtZero: true,
      stacked: true,
      grid: { color: "rgba(0,0,0,0.04)" },
      ticks: {
        font: { size: 10 },
        callback: (v) => (v >= 1000 ? (v / 1000).toFixed(0) + "k" : v),
      },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        title: (ctx) => days.value[ctx[0].dataIndex]?.date_label ?? "",
        label: (ctx) => {
          const adminName = ctx.dataset.label;
          const d = days.value[ctx.dataIndex];
          const admin = d?.admins?.find((a) => a.name === adminName);
          const count = admin?.count ?? 0;
          const amount = formatNumber(ctx.parsed.y);
          return ` ${adminName}: ${amount} THB (${count} bookings)`; // ← added count
        },
        afterBody: (ctx) => {
          const d = days.value[ctx[0].dataIndex];
          if (!d) return [];
          return [
            `─────────────────────`,
            `Total: ${formatNumber(d.total_balance_due)} THB`,
            `Total bookings: ${d.total_count}`, // ← total count
          ];
        },
      },
    },
  },
}));

const copyFilteredBookings = () => {
  const adminName = activeAdminFilter.value;
  const bookings = filteredBookings.value;
  if (!bookings.length) return;

  const dateLabel = selectedDay.value?.date_label ?? "";

  const lines = bookings
    .map(
      (b) =>
        `${b.booking_crm_id}, ${b.customer_name}, ${formatNumber(
          b.balance_due,
        )}`,
    )
    .join("\n");

  const text = `${adminName} (${dateLabel})\n${lines}`;
  navigator.clipboard.writeText(text);

  copiedAdmin.value = true;
  setTimeout(() => (copiedAdmin.value = false), 2000);
};

const copiedAdmin = ref(false);

// ── API calls ──────────────────────────────────────────────────────────────
async function fetchData() {
  loadingGraph.value = true;
  selectedDay.value = null;
  dayBookings.value = [];
  try {
    const res = await homeStore.getBalanceDueOverGraph(
      selectedYear.value,
      selectedMonth.value,
    );
    const result = res.data?.result ?? res.data ?? {};
    days.value = result.days ?? [];
    summary.value = result.summary ?? {};
  } catch (e) {
    console.error("Balance due graph error:", e);
    days.value = [];
    summary.value = {};
  } finally {
    loadingGraph.value = false;
  }
}

async function fetchDayBookings(date, page = 1) {
  loadingBookings.value = true;
  try {
    const res = await homeStore.getBalanceDueOverList({
      date,
      page,
      per_page: 20,
    });
    const result = res.data?.result ?? res.data ?? {};
    dayBookings.value = result.data ?? [];
    totalPages.value = result.meta?.total_page ?? 1;
    currentPage.value = page;
    console.log(res.data, "this is balance due");
  } catch (e) {
    console.error("Balance due list error:", e);
    dayBookings.value = [];
  } finally {
    loadingBookings.value = false;
  }
}

function changePage(page) {
  if (!selectedDay.value || page < 1 || page > totalPages.value) return;
  fetchDayBookings(selectedDay.value.date, page);
}

onMounted(fetchData);
</script>
