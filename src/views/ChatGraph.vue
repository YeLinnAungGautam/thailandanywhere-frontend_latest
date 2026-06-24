<template>
  <div class="flex gap-4 w-full min-h-[580px]">
    <!-- LEFT: Chart -->
    <div class="flex-[2] bg-white rounded-xl shadow-sm p-5 flex flex-col">
      <!-- Header -->
      <div class="flex items-start justify-between flex-wrap gap-3 mb-4">
        <div>
          <p class="text-sm font-semibold text-gray-800">Messenger Analytics</p>
          <p class="text-xs text-gray-500 mt-1">
            New Conversations:
            <span class="text-orange-600 font-semibold">{{ totalNew }}</span>
            &nbsp;·&nbsp; Total Messages:
            <span class="font-semibold text-gray-700">{{ totalMessages }}</span>
          </p>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <!-- Year -->
          <select
            v-model="selectedYear"
            @change="fetchData"
            class="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-orange-500"
          >
            <option v-for="y in yearOptions" :key="y" :value="y">
              {{ y }}
            </option>
          </select>

          <!-- Month -->
          <select
            v-model="selectedMonth"
            @change="fetchData"
            class="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-orange-500"
          >
            <option v-for="(m, i) in monthLabels" :key="i + 1" :value="i + 1">
              {{ m }}
            </option>
          </select>

          <!-- Refresh -->
          <button
            @click="fetchData"
            class="flex items-center gap-1.5 text-xs text-white bg-orange-600 px-3 py-1.5 rounded-lg hover:bg-orange-500 transition-colors"
          >
            <span :class="loading && 'animate-spin inline-block'">⟳</span>
            Refresh
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-3 gap-2 mb-4">
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="text-[10px] text-gray-500 mb-1">New Conversations</p>
          <p class="text-sm font-semibold text-orange-600">{{ totalNew }}</p>
        </div>
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="text-[10px] text-gray-500 mb-1">Ongoing Messages</p>
          <p class="text-sm font-semibold text-blue-600">
            {{ totalMessages }}
          </p>
        </div>
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="text-[10px] text-gray-500 mb-1">Active Days</p>
          <p class="text-sm font-semibold text-gray-800">{{ activeDays }}</p>
        </div>
      </div>

      <!-- Legend -->
      <div class="flex gap-4 text-[11px] text-gray-500 mb-3">
        <span class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-sm bg-orange-500"></span>New
          Conversations
        </span>
        <span class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-sm bg-blue-500"></span>Ongoing
          Messages
        </span>
      </div>

      <!-- Chart -->
      <div class="flex-1 relative max-h-[55vh]">
        <div
          v-if="loading"
          class="absolute inset-0 flex items-center justify-center"
        >
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"
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

    <!-- RIGHT: Day detail + conversation list -->
    <div class="flex-1 bg-white rounded-xl shadow-sm flex flex-col h-[85vh]">
      <!-- Header -->
      <div class="px-4 py-3 border-b border-gray-100">
        <div v-if="selectedDay">
          <p class="text-sm font-semibold text-gray-800">
            {{ selectedDay.date }}
          </p>
          <p class="text-xs text-gray-400 mt-0.5">
            {{ selectedDay.newConversations }} new &nbsp;·&nbsp;
            {{ selectedDay.ongoingMessages }} messages
          </p>
        </div>
        <p v-else class="text-sm text-gray-400 py-1">
          Click a bar to see day detail
        </p>
      </div>

      <!-- Tab switcher -->
      <div v-if="selectedDay" class="flex border-b border-gray-100 text-xs">
        <button
          @click="activeTab = 'new'"
          :class="[
            'flex-1 py-2 font-medium transition-colors',
            activeTab === 'new'
              ? 'border-b-2 border-orange-500 text-orange-600'
              : 'text-gray-400 hover:text-gray-600',
          ]"
        >
          New
          <span
            class="ml-1 text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full"
          >
            {{ selectedDay.newConversations }}
          </span>
        </button>
        <button
          @click="activeTab = 'ongoing'"
          :class="[
            'flex-1 py-2 font-medium transition-colors',
            activeTab === 'ongoing'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-400 hover:text-gray-600',
          ]"
        >
          Ongoing
          <span
            class="ml-1 text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full"
          >
            {{ selectedDay.activeConversationIds?.length ?? 0 }}
          </span>
        </button>
      </div>

      <!-- Content -->
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
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3z"
            />
          </svg>
          <p class="text-xs text-center leading-relaxed">
            Select a date on the<br />graph to view details
          </p>
        </div>

        <!-- Loading -->
        <div
          v-else-if="loadingDetail"
          class="flex items-center justify-center h-40"
        >
          <div
            class="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"
          ></div>
        </div>

        <!-- New Conversations Tab -->
        <template v-else-if="activeTab === 'new'">
          <div
            v-if="newConvList.length === 0"
            class="flex flex-col items-center justify-center h-40 text-gray-300"
          >
            <p class="text-xs">No new conversations this day</p>
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="conv in newConvList"
              :key="conv.id"
              @click="openConversation(conv)"
              class="border border-gray-100 rounded-lg p-3 hover:border-orange-300 hover:bg-orange-50/30 transition-all cursor-pointer"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                >
                  {{ initials(conv.sender_name) }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold text-gray-800 truncate">
                    {{ conv.sender_name || "Unknown" }}
                  </p>
                  <p class="text-[10px] text-gray-400 truncate">
                    {{ conv.sender_id }}
                  </p>
                </div>
                <span
                  class="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex-shrink-0"
                  >New</span
                >
              </div>
              <div class="flex justify-end mt-2">
                <button
                  @click.stop="openConversation(conv)"
                  class="text-[10px] text-orange-500 hover:text-orange-700"
                >
                  Open Chat →
                </button>
              </div>
            </div>
          </div>
        </template>

        <!-- Ongoing Tab -->
        <template v-else-if="activeTab === 'ongoing'">
          <div
            v-if="ongoingConvList.length === 0"
            class="flex flex-col items-center justify-center h-40 text-gray-300"
          >
            <p class="text-xs">No ongoing conversations this day</p>
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="conv in ongoingConvList"
              :key="conv._id"
              @click="openConversation(conv)"
              class="border border-gray-100 rounded-lg p-3 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                >
                  {{ initials(conv.sender_name) }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold text-gray-800 truncate">
                    {{ conv.sender_name || "Unknown" }}
                  </p>
                  <p class="text-[10px] text-gray-400 truncate">
                    {{ conv.sender_id }}
                  </p>
                </div>
                <span
                  class="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex-shrink-0"
                  >Active</span
                >
              </div>
              <div class="flex justify-end mt-2">
                <button
                  @click.stop="openConversation(conv)"
                  class="text-[10px] text-blue-500 hover:text-blue-700"
                >
                  Open Chat →
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineEmits } from "vue";
import { BarChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
import { useRouter } from "vue-router";
import Layout from "./Layout.vue";
import axios from "axios";
import { useFacebookMessageStore } from "../stores/facebookMessage.js";

Chart.register(...registerables);

const router = useRouter();

// ── State ──
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth() + 1);
const loading = ref(false);
const loadingDetail = ref(false);
const days = ref([]);
const selectedDay = ref(null);
const activeTab = ref("new");
const store = useFacebookMessageStore();

// Detail lists
const newConvList = ref([]);
const ongoingConvList = ref([]);

// ── Options ──
const curYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 3 }, (_, i) => curYear - i);
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

// ── Computed ──
const totalNew = computed(() =>
  days.value.reduce((s, d) => s + (d.newConversations ?? 0), 0),
);
const totalMessages = computed(() =>
  days.value.reduce((s, d) => s + (d.ongoingMessages ?? 0), 0),
);
const activeDays = computed(
  () => days.value.filter((d) => d.ongoingMessages > 0).length,
);

function initials(name = "") {
  if (!name || name === "Unknown") return "U";
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
}

// ── Chart ──
const chartData = computed(() => ({
  labels: days.value.map((d) => {
    const date = new Date(d.date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }),
  datasets: [
    {
      label: "New Conversations",
      data: days.value.map((d) => d.newConversations ?? 0),
      backgroundColor: "rgba(234,88,12,0.75)",
      borderColor: "#ea580c",
      borderWidth: 1,
      borderRadius: 3,
      stack: "stack",
    },
    {
      label: "Ongoing Messages",
      data: days.value.map((d) => d.ongoingMessages ?? 0),
      backgroundColor: "rgba(59,130,246,0.65)",
      borderColor: "#3b82f6",
      borderWidth: 1,
      borderRadius: 3,
      stack: "stack2", // separate stack so bars are side-by-side
    },
  ],
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  onClick: (evt, els) => {
    if (!els.length) return;
    const clickedDay = days.value[els[0].index];
    if (!clickedDay) return;
    selectedDay.value = clickedDay;
    // auto-switch tab based on which dataset was clicked
    activeTab.value = els[0].datasetIndex === 0 ? "new" : "ongoing";
    fetchDayDetail(clickedDay);
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 9 }, maxRotation: 55, autoSkip: false },
    },
    y: {
      beginAtZero: true,
      grid: { color: "rgba(0,0,0,0.04)" },
      ticks: { font: { size: 10 } },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        title: (ctx) => days.value[ctx[0].dataIndex]?.date ?? "",
        afterBody: (ctx) => {
          const d = days.value[ctx[0].dataIndex];
          if (!d) return [];
          return [
            `New conversations: ${d.newConversations}`,
            `Ongoing messages:  ${d.ongoingMessages}`,
          ];
        },
      },
    },
  },
}));

// ── API ──
async function fetchData() {
  loading.value = true;
  selectedDay.value = null;
  days.value = [];

  // Build start/end from selected year+month
  const start = `${selectedYear.value}-${String(selectedMonth.value).padStart(
    2,
    "0",
  )}-01`;
  const lastDay = new Date(
    selectedYear.value,
    selectedMonth.value,
    0,
  ).getDate();
  const end = `${selectedYear.value}-${String(selectedMonth.value).padStart(
    2,
    "0",
  )}-${lastDay}`;

  try {
    const { data } = await store.analysics(start, end);
    days.value = data.data ?? [];
  } catch (e) {
    console.error("Analytics fetch error:", e);
  } finally {
    loading.value = false;
  }
}

async function fetchDayDetail(day) {
  loadingDetail.value = true;
  newConvList.value = [];
  ongoingConvList.value = [];

  try {
    newConvList.value = day.newConversationIds ?? [];

    if (day.activeConversationIds?.length) {
      // ensure conversations are loaded
      await store.fetchConversations();

      // filter from store state directly
      ongoingConvList.value = store.conversations.filter((c) =>
        day.activeConversationIds.map(String).includes(String(c._id)),
      );
    }
  } catch (e) {
    console.error("Day detail fetch error:", e);
  } finally {
    loadingDetail.value = false;
  }
}

const emit = defineEmits(["open-conversation"]);

function openConversation(conv) {
  emit("open-conversation", conv._id ?? conv.id);
}

onMounted(fetchData);
</script>
