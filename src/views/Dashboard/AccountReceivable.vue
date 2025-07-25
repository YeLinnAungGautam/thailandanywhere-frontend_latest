<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="bg-white p-6 rounded-lg shadow-sm col-span-2">
      <div class="flex justify-between items-start mb-6">
        <div>
          <h2 class="text-lg font-semibold tracking-wide mb-2">
            Account Receivable - Unpaid Sales
          </h2>
          <p class="text-sm text-gray-600">
            Total Unpaid Amount:
            <span class="text-red-600 font-semibold"
              >{{ totalUnpaidAmount }} THB</span
            >
          </p>
          <p class="text-sm text-gray-600 mt-1">
            Total Unpaid Bookings:
            <span class="text-red-600 font-semibold">{{
              totalUnpaidBookings
            }}</span>
          </p>
        </div>
        <div class="flex items-center gap-3">
          <input
            type="month"
            v-model="monthForGraph"
            class="bg-white text-sm w-[200px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <!-- Chart Container -->
      <div class="h-[400px]">
        <BarChart :chartData="unpaidSaleData" :options="chartOptions" />
      </div>

      <!-- Agent Performance Table -->
      <div class="mt-8" v-if="agentUnpaidData.length > 0">
        <h3 class="text-md font-semibold mb-4">Agent Receivable Analysitic</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Agent Name
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total Unpaid Amount
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Unpaid Bookings
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="agent in agentUnpaidData" :key="agent.name">
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ agent.name }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold"
                >
                  {{ agent.unpaidAmount.toLocaleString() }} THB
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ agent.unpaidBookings }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ agent.percentage }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div>
      <ReceivableList :admin-only-list="adminOnlyList" />
    </div>
  </div>
</template>

<script setup>
import { BarChart } from "vue-chart-3";
import { useAuthStore } from "../../stores/auth";
import { useHomeStore } from "../../stores/home";
import { useAdminStore } from "../../stores/admin";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { Chart, registerables } from "chart.js";
import ReceivableList from "./ReceivableList.vue";

Chart.register(...registerables);

const authStore = useAuthStore();
const homeStore = useHomeStore();
const adminStore = useAdminStore();

const adminOnlyList = ref([]);
const getAdminListOnly = async () => {
  // Fetch admin list and set up permissions
  const res = await adminStore.getSimpleListAction();
  if (res && res.result && res.result.data) {
    adminOnlyList.value = res.result.data
      .filter((item) => item.role === "admin" || item.role === "sale_manager")
      .map((item) => ({
        id: item.id,
        name: item.name,
      }));
  } else {
    console.error("Failed to fetch admin list");
    adminOnlyList.value = [];
  }
};

// Reactive data for chart
const dataTest = reactive({ items: [] });
const dataNotPaid = reactive({ items: [] });
const monthForGraph = ref("");
const createdByList = ref([]);
const agentUnpaidData = ref([]);

// Computed total unpaid amount
const totalUnpaidAmount = computed(() => {
  if (dataNotPaid.items.length > 0) {
    return dataNotPaid.items.reduce((total, amount) => total + amount, 0);
  }
  return 0;
});

// Computed total unpaid bookings
const totalUnpaidBookings = computed(() => {
  return agentUnpaidData.value.reduce(
    (total, agent) => total + agent.unpaidBookings,
    0
  );
});

// Chart data configuration - only showing not_paid data
const unpaidSaleData = {
  labels: dataTest.items,
  datasets: [
    {
      label: "Unpaid Amount",
      type: "bar",
      data: dataNotPaid.items,
      backgroundColor: "rgba(223, 0, 0, 0.8)", // Red color for unpaid with transparency
      borderColor: "rgb(223, 0, 0)",
      borderWidth: 1,
      borderRadius: 4,
      borderSkipped: false,
    },
  ],
};

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Amount (THB)",
        color: "#374151",
        font: {
          size: 12,
          weight: "bold",
        },
      },
      grid: {
        color: "#f3f4f6",
      },
      ticks: {
        color: "#6b7280",
      },
    },
    x: {
      title: {
        display: true,
        text: "Date",
        color: "#374151",
        font: {
          size: 12,
          weight: "bold",
        },
      },
      grid: {
        color: "#f3f4f6",
      },
      ticks: {
        color: "#6b7280",
      },
    },
  },
  plugins: {
    legend: {
      display: true,
      position: "top",
      labels: {
        color: "#374151",
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      mode: "index",
      intersect: false,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "#ffffff",
      bodyColor: "#ffffff",
      borderColor: "rgb(223, 0, 0)",
      borderWidth: 1,
    },
  },
};

// Function to get admin list and set up permissions
const getAdminList = async () => {
  try {
    const res = await adminStore.getSaleManager();
    let manager = res.result.data.find((a) => a.id == authStore.user?.id);

    if (authStore.isSuperAdmin) {
      // Super admin sees all data - set createdByList to null to include all
      createdByList.value = null;
    } else if (manager) {
      // Sale manager sees their subsidiaries + themselves
      createdByList.value =
        manager.subsidiaries?.map((item) => item.name) || [];
      createdByList.value.push(manager.name);
    } else {
      // Regular admin sees only their own data
      createdByList.value = [authStore.user.name];
    }

    console.log("Created by list for account receivable:", createdByList.value);
  } catch (error) {
    console.error("Error fetching admin list:", error);
    createdByList.value = [authStore.user.name]; // Fallback to user's own data
  }
};

// Function to get unpaid data based on user role
const getUnpaidData = async (monthGet) => {
  try {
    // Use existing API that's already being called
    const res = await homeStore.getTimeFilterArray(monthGet);

    // Clear existing data
    dataTest.items.splice(0);
    dataNotPaid.items.splice(0);
    agentUnpaidData.value = [];

    // Object to track agent unpaid data
    const agentUnpaidMap = {};

    // Process the API response to extract only unpaid amounts
    if (res?.result?.sales) {
      for (let x = 0; x < res.result.sales.length; x++) {
        let dailyUnpaidTotal = 0;

        // Calculate total unpaid amount for the day
        for (let i = 0; i < res.result.sales[x].agents.length; i++) {
          const agent = res.result.sales[x].agents[i];

          // Apply role-based filtering
          const shouldIncludeAgent =
            authStore.isSuperAdmin ||
            createdByList.value === null ||
            createdByList.value.includes(agent.name);

          if (shouldIncludeAgent) {
            const unpaidAmount = agent.total_balance || 0;
            dailyUnpaidTotal += unpaidAmount;

            // Track agent unpaid data
            if (!agentUnpaidMap[agent.name]) {
              agentUnpaidMap[agent.name] = {
                name: agent.name,
                unpaidAmount: 0,
                unpaidBookings: 0,
              };
            }

            agentUnpaidMap[agent.name].unpaidAmount += unpaidAmount;
            // Count bookings that have unpaid balance
            if (unpaidAmount > 0) {
              agentUnpaidMap[agent.name].unpaidBookings +=
                agent.total_count || 0;
            }
          }
        }

        dataNotPaid.items.push(dailyUnpaidTotal);
        dataTest.items.push(res.result.sales[x].date);
      }
    }

    // Convert agent map to array and calculate percentages
    const totalUnpaid = Object.values(agentUnpaidMap).reduce(
      (sum, agent) => sum + agent.unpaidAmount,
      0
    );
    agentUnpaidData.value = Object.values(agentUnpaidMap)
      .filter((agent) => agent.unpaidAmount > 0) // Only show agents with unpaid amounts
      .map((agent) => ({
        ...agent,
        percentage:
          totalUnpaid > 0
            ? ((agent.unpaidAmount / totalUnpaid) * 100).toFixed(1)
            : 0,
      }))
      .sort((a, b) => b.unpaidAmount - a.unpaidAmount); // Sort by unpaid amount descending
  } catch (error) {
    console.error("Error fetching unpaid data:", error);
  }
};

// Set current month on component mount
const currentMonth = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  monthForGraph.value = `${year}-${month}`;
};

// Watch for month changes
watch(monthForGraph, async (newValue) => {
  if (newValue) {
    await getUnpaidData(newValue);
  }
});

// Initialize component
onMounted(async () => {
  // Check basic authorization
  if (!authStore.user) {
    console.warn("User not authenticated");
    return;
  }

  await getAdminList();
  await getAdminListOnly();
  currentMonth();
  await getUnpaidData(monthForGraph.value);
});
</script>

<style scoped>
/* Add any specific styles for the component here */
</style>
