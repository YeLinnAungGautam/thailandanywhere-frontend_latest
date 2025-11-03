<template>
  <div class="min-h-screen">
    <div
      class="mb-4 bg-white p-2 rounded-lg drop-shadow flex justify-between items-center"
    >
      <h1 class="text-base font-bold text-gray-800 pl-4">Cash Image Report</h1>

      <!-- Month Filter -->
      <div class="flex items-center gap-4">
        <label class="text-xs font-medium text-gray-700">Select Month:</label>
        <input
          type="month"
          v-model="monthForGraph"
          class="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="text-base text-gray-600">Loading...</div>
    </div>

    <!-- Charts Container -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Monthly Agent Summary Chart -->
      <div class="bg-white p-6 rounded-lg shadow-md col-span-1">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-base font-semibold text-gray-800">
            Monthly Agent Summary
            <span class="capitalize">({{ currentShow }})</span>
          </h2>
          <div class="flex items-center gap-2">
            <button
              @click="currentShow = 'thb'"
              :class="{
                'bg-orange-500 text-white': currentShow === 'thb',
                'bg-gray-200 text-gray-700': currentShow !== 'thb',
              }"
              class="px-3 py-1 rounded-md text-xs"
            >
              THB
            </button>
            <button
              @click="currentShow = 'mmk'"
              :class="{
                'bg-orange-500 text-white': currentShow === 'mmk',
                'bg-gray-200 text-gray-700': currentShow !== 'mmk',
              }"
              class="px-3 py-1 rounded-md text-xs"
            >
              MMK
            </button>
          </div>
        </div>

        <div class="min-h-80">
          <BarChart
            v-if="monthlyChartData.labels.length > 0 && currentShow === 'thb'"
            :chartData="monthlyChartData"
            :options="monthlyChartOptions"
          />
          <BarChart
            v-if="
              monthlyChartMMKData.labels.length > 0 && currentShow === 'mmk'
            "
            :chartData="monthlyChartMMKData"
            :options="monthlyChartMMKOptions"
          />
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="bg-white p-6 rounded-lg shadow-md col-span-1">
        <h2 class="text-base font-semibold text-gray-800 mb-4">
          Today Output & Input
        </h2>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
            <div
              class="text-lg font-bold text-green-600"
              v-if="cashImageData?.today_summary?.booking_summary"
            >
              THB
              {{
                formattedNumber(
                  cashImageData?.today_summary?.booking_summary.thb
                ) || 0
              }}
            </div>
            <div
              class="text-lg font-bold text-red-600"
              v-if="cashImageData?.today_summary?.other_summary"
            >
              THB -
              {{
                formattedNumber(
                  cashImageData?.today_summary?.other_summary.thb
                ) || 0
              }}
            </div>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
            <div
              class="text-lg font-bold text-green-600"
              v-if="cashImageData?.today_summary?.booking_summary"
            >
              MMK
              {{
                formattedNumber(
                  cashImageData?.today_summary?.booking_summary.mmk
                ) || 0
              }}
            </div>

            <div
              class="text-lg font-bold text-red-600"
              v-if="cashImageData?.today_summary?.other_summary"
            >
              MMK -
              {{
                formattedNumber(
                  cashImageData?.today_summary?.other_summary.mmk
                ) || 0
              }}
            </div>
          </div>
        </div>

        <!-- Currency Breakdown -->
        <div class="mt-3">
          <h3 class="text-md font-semibold text-gray-700 mb-3">
            Monthly Output & Input
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="(
                currencyData, currency
              ) in monthlyData?.grand_totals_by_currency"
              :key="currency"
              class="bg-green-50 p-4 rounded-lg border-l-4 border-green-400"
            >
              <div class="text-lg font-bold text-green-600">
                {{ currency }}
                {{ formatAmount(currencyData.total_cash_amount) }}
              </div>
              <div class="text-[10px] text-red-800">
                {{ currencyData.total_cash_images }} images
              </div>
              <div class="text-lg font-bold text-red-600">
                {{ currency }}
                {{
                  formatAmount(
                    monthlyData?.expense_summary[
                      currency == "THB" ? "thb" : "mmk"
                    ].amount
                  )
                }}
              </div>
              <div class="text-[10px] text-red-800">
                {{
                  monthlyData?.expense_summary[
                    currency == "THB" ? "thb" : "mmk"
                  ].count
                }}
                images
              </div>
            </div>
          </div>
        </div>

        <!-- Top Performer -->
        <div
          v-if="topPerformer"
          class="mt-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400"
        >
          <div class="text-xs pb-2 font-medium text-yellow-800">
            🏆 Top Performer
          </div>
          <div class="text-base font-bold text-yellow-900">
            {{ topPerformer.name }}
          </div>
          <div class="text-[10px] text-yellow-700 mt-1">
            {{ topPerformer.total_cash_images }} images total
          </div>
          <div class="mt-2 flex flex-wrap gap-2">
            <span
              v-for="(currencyData, currency) in topPerformer.currencies"
              :key="currency"
              class="text-sm bg-yellow-200 text-yellow-800 px-2 py-1 rounded"
            >
              {{ currency }}: {{ formatAmount(currencyData.total_cash_amount) }}
            </span>
          </div>
        </div>
      </div>

      <!-- NEW: Interact Bank Breakdown Section -->
      <div class="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-2">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-base font-semibold text-gray-800">
            Income & Expense by Bank/Account Type
          </h2>
          <div class="flex items-center gap-2">
            <button
              @click="showByType = !showByType"
              :class="{
                'bg-orange-500 text-white': showByType,
                'bg-gray-200 text-gray-700': !showByType,
              }"
              class="px-3 py-1 rounded-md text-xs"
            >
              {{ showByType ? "Hide By Type" : "Show By Type" }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6" v-if="showByType">
          <!-- Income by Interact Bank -->
          <div>
            <h3
              class="text-sm font-semibold text-green-700 mb-3 flex items-center"
            >
              <span class="mr-2">💰</span> Income by Bank/Account
            </h3>
            <div class="space-y-3">
              <div
                v-for="(
                  bankData, bankName
                ) in monthlyData?.income_by_interact_bank"
                :key="'income-' + bankName"
                class="bg-green-50 p-4 rounded-lg border border-green-200"
              >
                <div
                  class="text-sm font-semibold text-gray-800 mb-2 capitalize"
                >
                  {{ formatBankName(bankName) }}
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <!-- THB -->
                  <div
                    v-if="bankData.thb.amount > 0"
                    class="bg-white p-2 rounded"
                  >
                    <div class="text-xs text-gray-600">THB</div>
                    <div class="text-base font-bold text-green-600">
                      {{ formatAmount(bankData.thb.amount) }}
                    </div>
                    <div class="text-[10px] text-gray-500">
                      {{ bankData.thb.count }} images
                    </div>
                  </div>
                  <!-- MMK -->
                  <div
                    v-if="bankData.mmk.amount > 0"
                    class="bg-white p-2 rounded"
                  >
                    <div class="text-xs text-gray-600">MMK</div>
                    <div class="text-base font-bold text-green-600">
                      {{ formatAmount(bankData.mmk.amount) }}
                    </div>
                    <div class="text-[10px] text-gray-500">
                      {{ bankData.mmk.count }} images
                    </div>
                  </div>
                </div>
              </div>

              <!-- Show message if no income data -->
              <div
                v-if="
                  !monthlyData?.income_by_interact_bank ||
                  Object.keys(monthlyData.income_by_interact_bank).length === 0
                "
                class="text-center text-gray-500 py-4"
              >
                No income data available
              </div>
            </div>
          </div>

          <!-- Expense by Interact Bank -->
          <div>
            <h3
              class="text-sm font-semibold text-red-700 mb-3 flex items-center"
            >
              <span class="mr-2">💸</span> Expense by Bank/Account
            </h3>
            <div class="space-y-3">
              <div
                v-for="(
                  bankData, bankName
                ) in monthlyData?.expense_by_interact_bank"
                :key="'expense-' + bankName"
                class="bg-red-50 p-4 rounded-lg border border-red-200"
              >
                <div
                  class="text-sm font-semibold text-gray-800 mb-2 capitalize"
                >
                  {{ formatBankName(bankName) }}
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <!-- THB -->
                  <div
                    v-if="bankData.thb.amount > 0"
                    class="bg-white p-2 rounded"
                  >
                    <div class="text-xs text-gray-600">THB</div>
                    <div class="text-base font-bold text-red-600">
                      {{ formatAmount(bankData.thb.amount) }}
                    </div>
                    <div class="text-[10px] text-gray-500">
                      {{ bankData.thb.count }} images
                    </div>
                  </div>
                  <!-- MMK -->
                  <div
                    v-if="bankData.mmk.amount > 0"
                    class="bg-white p-2 rounded"
                  >
                    <div class="text-xs text-gray-600">MMK</div>
                    <div class="text-base font-bold text-red-600">
                      {{ formatAmount(bankData.mmk.amount) }}
                    </div>
                    <div class="text-[10px] text-gray-500">
                      {{ bankData.mmk.count }} images
                    </div>
                  </div>
                </div>
              </div>

              <!-- Show message if no expense data -->
              <div
                v-if="
                  !monthlyData?.expense_by_interact_bank ||
                  Object.keys(monthlyData.expense_by_interact_bank).length === 0
                "
                class="text-center text-gray-500 py-4"
              >
                No expense data available
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Daily Cash Amount Charts (THB & MMK) -->
      <div class="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-2">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-base font-semibold text-gray-800">
            Daily Cash Amount by Currency
          </h2>
          <div class="text-xs text-gray-600">
            {{ monthlyData?.month || "" }}
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- THB Chart -->
          <div class="min-h-80">
            <h3 class="text-xs font-medium text-gray-700 mb-2 text-center">
              THB Daily Amount
            </h3>
            <LineChart
              v-if="dailyTHBChartData.labels.length > 0"
              :chartData="dailyTHBChartData"
              :options="dailyTHBChartOptions"
            />
            <div
              v-else
              class="flex items-center justify-center h-full text-gray-500"
            >
              No THB data available
            </div>
          </div>

          <!-- MMK Chart -->
          <div class="h-80">
            <h3 class="text-xs font-medium text-gray-700 mb-2 text-center">
              MMK Daily Amount
            </h3>
            <LineChart
              v-if="dailyMMKChartData.labels.length > 0"
              :chartData="dailyMMKChartData"
              :options="dailyMMKChartOptions"
            />
            <div
              v-else
              class="flex items-center justify-center h-full text-gray-500"
            >
              No MMK data available
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed, reactive } from "vue";
import { useHomeStore } from "../../stores/home";
import { BarChart, LineChart } from "vue-chart-3";
import { Switch } from "@headlessui/vue";
import { formattedNumber } from "../help/FormatData";

const homeStore = useHomeStore();

const monthForGraph = ref("");
const loading = ref(false);
const cashImageData = ref(null);

// Initialize
const currentShow = ref("thb");

const showByType = ref(false);

// Chart data
const monthlyChartData = reactive({
  labels: [],
  datasets: [
    {
      label: "Total Cash Images",
      data: [],
      backgroundColor: [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
        "#FF9F40",
        "#FF6384",
        "#C9CBCF",
        "#4BC0C0",
      ],
      borderColor: [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
        "#FF9F40",
        "#FF6384",
        "#C9CBCF",
        "#4BC0C0",
      ],
      borderWidth: 1,
    },
  ],
});

const monthlyChartMMKData = reactive({
  labels: [],
  datasets: [
    {
      label: "Total Cash Images",
      data: [],
      backgroundColor: [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
        "#FF9F40",
        "#FF6384",
        "#C9CBCF",
        "#4BC0C0",
      ],
      borderColor: [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
        "#FF9F40",
        "#FF6384",
        "#C9CBCF",
        "#4BC0C0",
      ],
      borderWidth: 1,
    },
  ],
});

const dailyTHBChartData = reactive({
  labels: [],
  datasets: [],
});

const dailyMMKChartData = reactive({
  labels: [],
  datasets: [],
});

// Chart options
const monthlyChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const agent = getAgentData(context.label);
          let tooltip = `${context.parsed.y} images`;
          if (agent?.currencies) {
            tooltip += "\n";
            tooltip += `\nTHB: ${agent.currencies.THB?.total_cash_amount.toLocaleString()} (${
              agent.currencies.THB?.total_cash_images
            } images)`;
          }
          return tooltip;
        },
      },
    },
  },
};

const monthlyChartMMKOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const agent = getAgentData(context.label);
          let tooltip = `${context.parsed.y} images`;
          if (agent?.currencies) {
            tooltip += "\n";
            tooltip += `\nMMK: ${agent.currencies.MMK?.total_cash_amount.toLocaleString()} (${
              agent.currencies.MMK?.total_cash_images
            } images)`;
          }
          return tooltip;
        },
      },
    },
  },
};

const dailyTHBChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Amount (THB)",
      },
      ticks: {
        callback: function (value) {
          return value.toLocaleString() + " ฿";
        },
      },
    },
    x: {
      title: {
        display: true,
        text: "Date",
      },
    },
  },
  plugins: {
    legend: {
      position: "bottom",
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${
            context.dataset.label
          }: ${context.parsed.y.toLocaleString()} ฿`;
        },
      },
    },
  },
};

const dailyMMKChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Amount (MMK)",
      },
      ticks: {
        callback: function (value) {
          return value.toLocaleString() + " K";
        },
      },
    },
    x: {
      title: {
        display: true,
        text: "Date",
      },
    },
  },
  plugins: {
    legend: {
      position: "bottom",
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${
            context.dataset.label
          }: ${context.parsed.y.toLocaleString()} K`;
        },
      },
    },
  },
};

// Computed properties
const monthlyData = computed(() => {
  return cashImageData.value?.monthly_summary || null;
});

const topAgents = computed(() => {
  if (!monthlyData.value?.agents) return [];
  return monthlyData.value.agents.slice(0, 8);
});

const topPerformer = computed(() => {
  if (!monthlyData.value?.agents?.length) return null;

  return monthlyData.value?.agents
    .slice()
    .sort(
      (a, b) =>
        b.currencies?.THB?.total_cash_amount -
        a.currencies?.THB?.total_cash_amount
    )[0];
});

const activeAgentsCount = computed(() => {
  if (!monthlyData.value?.agents) return 0;
  return monthlyData.value.agents.filter((agent) => agent.total_cash_images > 0)
    .length;
});

const formattedGrandTotals = computed(() => {
  if (!monthlyData.value?.grand_totals_by_currency) return {};

  const formatted = {};
  Object.entries(monthlyData.value.grand_totals_by_currency).forEach(
    ([currency, data]) => {
      formatted[currency] = formatAmount(data.total_cash_amount);
    }
  );
  return formatted;
});

// Helper functions
const formatAmount = (amount) => {
  if (!amount) return "0";
  return parseFloat(amount).toLocaleString();
};

const formatBankName = (bankName) => {
  if (!bankName) return "Unknown";
  // Convert underscore to space and capitalize each word
  return bankName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getAgentData = (agentName) => {
  return monthlyData.value?.agents?.find((a) => a.name === agentName);
};

const currentMonth = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  monthForGraph.value = `${year}-${month}`;
};

const getCashImageReport = async (month) => {
  loading.value = true;
  try {
    const res = await homeStore.generalCashImageReport(month);
    console.log(res, "cash image report");
    cashImageData.value = res.result;
    updateCharts();
  } catch (error) {
    console.error("Error fetching cash image report:", error);
  } finally {
    loading.value = false;
  }
};

const updateCharts = () => {
  if (!cashImageData.value) return;

  // Update monthly chart
  if (monthlyData.value?.agents) {
    const activeAgents = monthlyData.value.agents.filter(
      (agent) => agent.total_cash_images > 0
    );

    monthlyChartData.labels = activeAgents.map((agent) => agent.name);
    monthlyChartData.datasets[0].data = activeAgents.map(
      (agent) => agent?.currencies?.THB?.total_cash_amount || 0
    );

    monthlyChartMMKData.labels = activeAgents.map((agent) => agent.name);
    monthlyChartMMKData.datasets[0].data = activeAgents.map(
      (agent) => agent?.currencies?.MMK?.total_cash_amount || 0
    );
  }

  // Update daily charts
  if (cashImageData.value.daily_summary) {
    const dailyData = cashImageData.value.daily_summary;

    const agentsWithTHB = [
      ...new Set(
        dailyData.flatMap((day) =>
          day.agents
            .filter((agent) => agent.currencies?.THB?.total_cash_amount > 0)
            .map((agent) => agent.name)
        )
      ),
    ];

    const agentsWithMMK = [
      ...new Set(
        dailyData.flatMap((day) =>
          day.agents
            .filter((agent) => agent.currencies?.MMK?.total_cash_amount > 0)
            .map((agent) => agent.name)
        )
      ),
    ];

    const dateLabels = dailyData.map((day) => {
      const date = new Date(day.date);
      return date.getDate().toString();
    });

    // THB Chart Data
    dailyTHBChartData.labels = dateLabels;
    dailyTHBChartData.datasets = agentsWithTHB.map((agentName, index) => ({
      label: agentName,
      data: dailyData.map((day) => {
        const agent = day.agents.find((a) => a.name === agentName);
        return agent?.currencies?.THB?.total_cash_amount || 0;
      }),
      borderColor: monthlyChartData.datasets[0].backgroundColor[index % 9],
      backgroundColor:
        monthlyChartData.datasets[0].backgroundColor[index % 9] + "20",
      tension: 0.1,
      fill: false,
    }));

    // MMK Chart Data
    dailyMMKChartData.labels = dateLabels;
    dailyMMKChartData.datasets = agentsWithMMK.map((agentName, index) => ({
      label: agentName,
      data: dailyData.map((day) => {
        const agent = day.agents.find((a) => a.name === agentName);
        return agent?.currencies?.MMK?.total_cash_amount || 0;
      }),
      borderColor: monthlyChartData.datasets[0].backgroundColor[index % 9],
      backgroundColor:
        monthlyChartData.datasets[0].backgroundColor[index % 9] + "20",
      tension: 0.1,
      fill: false,
    }));
  }
};

watch(monthForGraph, async (newValue) => {
  if (newValue) {
    getCashImageReport(newValue);
  }
});

onMounted(() => {
  currentMonth();
});
</script>
