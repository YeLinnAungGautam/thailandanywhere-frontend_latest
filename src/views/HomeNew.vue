<template>
  <div>
    <!-- Loading Screen -->
    <div
      v-if="loading"
      class="fixed inset-0 bg-white/80 flex justify-center items-center z-50"
    >
      <!-- ... loading spinner ... -->
    </div>

    <!-- Main Content -->

    <div class="grid grid-cols-7 gap-2">
      <!-- Filter Section -->
      <div class="col-span-7 bg-white p-4 rounded-lg">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <MonthDropdown v-model="selectMonth" />
            <div class="flex items-center gap-4">
              <select
                v-if="showAgentFilter"
                v-model="selectedAgent"
                class="bg-white text-sm w-full px-3 focus:outline-none"
              >
                <option value="">All Agents</option>
                <option
                  v-for="agent in agentsList"
                  :key="agent.id"
                  :value="agent.id"
                >
                  {{ agent.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Dashboard Content -->
      <div class="col-span-5">
        <div class="grid grid-cols-5 gap-2">
          <div class="col-span-3 grid grid-cols-2 gap-2">
            <!-- Average Sales -->
            <StatCard
              title="AVERAGE SALES"
              :value="formatCurrency(averageSales)"
            />

            <!-- Booking Stats -->
            <BookingStats :summary="summary" />

            <!-- Sales Overview Chart -->
            <div
              class="col-span-2"
              v-if="displaySalesData.length > 0 && targetValue"
            >
              <SalesOverview
                :salesData="displaySalesData"
                :averageValue="targetValue"
                :viewMode="graphViewMode"
              >
                <div class="flex items-center gap-0 bg-gray-100 rounded-lg p-1">
                  <button
                    @click="graphViewMode = 'daily'"
                    :class="[
                      'px-3 py-1 rounded text-[10px] font-medium transition-colors',
                      graphViewMode === 'daily'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900',
                    ]"
                  >
                    Daily Sales
                  </button>
                  <button
                    @click="graphViewMode = 'average'"
                    :class="[
                      'px-3 py-1 rounded text-[10px] font-medium transition-colors',
                      graphViewMode === 'average'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900',
                    ]"
                  >
                    Cumulative Average
                  </button>
                </div>
              </SalesOverview>
            </div>
          </div>

          <!-- ... rest of your template ... -->
          <div class="col-span-2">
            <div class="grid grid-cols-2 gap-2">
              <div class="col-span-2">
                <RevenueByProduct :revenueData="summary" />
              </div>
              <div class="col-span-2">
                <ConversionRate
                  :rate="commissionAmount"
                  :value="daysToTarget"
                />
              </div>
            </div>
          </div>

          <!-- Bottom Section -->
          <div class="col-span-5">
            <div class="grid grid-cols-3 gap-2">
              <BookingsBySource :sources="bookingsBySource" />
              <AverageBookingValue :bookingData="summary" />
              <CreatorRanking />
            </div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar -->
      <div class="col-span-2 space-y-2">
        <MonthlyTarget
          :selectedAgent="selectedAgent"
          :selectMonth="selectMonth"
          :agentsList="agentsList"
        />
        <TopSalesReps :salesReps="topSalesReps" />
        <RecentBookings
          :bookings="recentBookings"
          :selectedMonth="selectMonth"
          :dataCount="receivableDataCount"
          :dataSummary="receivableDataSummary"
          :receivablesList="receivablesList"
          :receivablesLoading="receivablesLoading"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import Layout from "./Layout.vue";
import StatCard from "./HomeNewComponent/Statcard.vue";
import BookingStats from "./HomeNewComponent/Bookingstats.vue";
import RevenueByProduct from "./HomeNewComponent/Revenuebyproduct.vue";
import MonthlyTarget from "./HomeNewComponent/Monthlytarget.vue";
import SalesOverview from "./HomeNewComponent/Salesoverview.vue";
import ConversionRate from "./HomeNewComponent/Conversionrate.vue";
import TopSalesReps from "./HomeNewComponent/Topsalesreps.vue";
import BookingsBySource from "./HomeNewComponent/Bookingsbysource.vue";
import AverageBookingValue from "./HomeNewComponent/Averagebookingvalue.vue";
import RecentBookings from "./HomeNewComponent/Recentbookings.vue";
import { ref, onMounted, watch, computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { useHomeStore } from "../stores/home";
import { useReceivableStore } from "../stores/receivable";
import { useAdminStore } from "../stores/admin";
import { storeToRefs } from "pinia";
import MonthDropdown from "./HomeNewComponent/SelectMonth.vue";
import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subMonths,
  format,
} from "date-fns";
import { useDashboardStore } from "../stores/dashboard";
import CreatorRanking from "./HomeNewComponent/CreatorRanking.vue";

// Stores
const authStore = useAuthStore();
const homeStore = useHomeStore();
const dashboardStore = useDashboardStore();
const receivableStore = useReceivableStore();
const adminStore = useAdminStore();
const { user } = storeToRefs(authStore);
const { receivables } = storeToRefs(receivableStore);

// Loading state
const loading = ref(false);
const receivablesLoading = ref(false);

// Date filters
const selectMonth = ref("");
const dateRange = ref([startOfMonth(new Date()), endOfMonth(new Date())]);

// Graph view mode
const graphViewMode = ref("daily"); // 'daily' or 'average'

// Dashboard data
const monthlySalesData = ref([]); // Cumulative average data
const dailySalesData = ref([]); // Daily sales data
const averageSales = ref(0);
const bookingStats = ref({
  tours: 0,
  tickets: 0,
  packages: 0,
});
const revenueByProduct = ref([
  { name: "Hotels", percentage: 0 },
  { name: "Tours", percentage: 0 },
  { name: "Tickets", percentage: 0 },
  { name: "Packages", percentage: 0 },
]);
const commissionAmount = ref(0);
const daysToTarget = ref(0);
const topSalesReps = ref([]);
const bookingsBySource = ref([]);

const recentBookings = ref([]);
const targetValue = ref(0);

// Receivables data
const receivableDataCount = ref(0);
const receivableDataSummary = ref(0);
const receivablesList = computed(() => receivables.value || []);

// Computed property for display data based on view mode
const displaySalesData = computed(() => {
  return graphViewMode.value === "daily"
    ? dailySalesData.value
    : monthlySalesData.value;
});

// Utility functions
const dateFormat = (inputDateString) => {
  if (!inputDateString) return null;
  const inputDate = new Date(inputDateString);
  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, "0");
  const day = String(inputDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatCurrency = (value) => {
  value = Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `฿ ${value}`;
};

const formatDateForAPI = (dateString) => {
  if (!dateString) return "";
  const [year, month] = dateString.split("-");
  return `${month}-${year}`;
};

const showAgentFilter = computed(() => {
  return authStore.isSuperAdmin || authStore.isSaleManager;
});
const selectedAgent = ref("");

const getCurrentMonth = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  return `${year}-${month}`;
};

// Fetch daily sales data for chart
const fetchDailySalesData = async (month) => {
  try {
    const data = {
      date: month,
    };

    if (!authStore.isSuperAdmin && !authStore.isAuditor) {
      data.created_by = authStore.user?.id;
    } else {
      data.created_by = selectedAgent.value;
    }

    const res = await homeStore.getTimeFilterAdminArray(data);

    console.log("====================================");
    console.log("testing", res.result);
    console.log("====================================");

    if (res?.result?.sales && res?.result?.airline_sales) {
      monthlySalesData.value = [];
      dailySalesData.value = [];
      let cumulativeTotal = 0;

      // Determine if the selected month is the current month
      const selectedDate = new Date(month);
      const currentDate = new Date();
      const isCurrentMonth =
        selectedDate.getFullYear() === currentDate.getFullYear() &&
        selectedDate.getMonth() === currentDate.getMonth();

      res.result.sales.forEach((sale, index) => {
        // Calculate daily total for this day (sales)
        let dailySalesTotal = 0;
        sale.agents.forEach((agent) => {
          dailySalesTotal += agent.total;
        });

        // Calculate daily airline total for this day
        let dailyAirlineTotal = 0;
        const airlineSaleForDay = res.result.airline_sales[index];
        if (airlineSaleForDay && airlineSaleForDay.agents) {
          airlineSaleForDay.agents.forEach((agent) => {
            dailyAirlineTotal += agent.total;
          });
        }

        // Calculate net sales (sales - airline)
        const dailyNetTotal = dailySalesTotal - dailyAirlineTotal;

        // Store daily net total for daily view
        dailySalesData.value.push(dailyNetTotal);

        // Add to cumulative total
        cumulativeTotal += dailyNetTotal;

        // Get the day number from the date (e.g., "2025-11-01" -> 1)
        const dayNumber = parseInt(sale.date.split("-")[2]);

        // Calculate cumulative average: total of all days so far / day number
        const cumulativeAverage = Math.round(cumulativeTotal / dayNumber);

        // Push the cumulative average to the array
        monthlySalesData.value.push(cumulativeAverage);

        averageSales.value = Math.round(
          cumulativeTotal /
            (isCurrentMonth ? currentDate.getDate() : res.result.sales.length),
        );
      });
    }
  } catch (error) {
    console.error("Error fetching daily sales data:", error);
  }
};

// Fetch commission and target data
const fetchCommissionData = async () => {
  try {
    // Get current date
    const today = new Date();
    const currentDay = today.getDate();

    const [year, month] = selectMonth.value.split("-");
    let startDate = new Date(year, month - 1, 1);
    let endDate = new Date(year, month, 0);

    const data = {
      first: dateFormat(startDate),
      second: dateFormat(endDate),
    };

    const resSaleAgent = await homeStore.getAgentSales(data);

    console.log("====================================");
    console.log("testing commission", resSaleAgent.result, today.getDate());
    console.log("====================================");

    if (resSaleAgent?.result) {
      resSaleAgent.result.forEach((sale) => {
        if (sale.created_by?.name == authStore.user.name) {
          commissionAmount.value = sale.over_target_count * 2000;
          averageSales.value = (
            sale.total_without_airline / today.getDate()
          ).toFixed(2);
          daysToTarget.value = sale.over_target_count || 10;
        }
      });

      // Calculate monthly target percentage
      const userTarget = authStore.target || 350000;

      // Get total days in the selected month
      const totalDaysInMonth = new Date(year, month, 0).getDate();

      // Determine if the selected month is the current month
      const selectedDate = new Date(year, month - 1);
      const isCurrentMonth =
        selectedDate.getFullYear() === today.getFullYear() &&
        selectedDate.getMonth() === today.getMonth();

      // Use current day for current month, total days for past months
      const daysToCalculate = isCurrentMonth ? currentDay : totalDaysInMonth;

      targetValue.value = userTarget;

      // Set top sales reps - use the same days calculation
      topSalesReps.value = resSaleAgent.result
        .map((sale) => ({
          id: sale.created_by?.id,
          name: sale.created_by?.name || "Unknown",
          initials: getInitials(sale.created_by?.name || "Unknown"),
          amount: sale.total_without_airline / daysToCalculate || 0,
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 10);
    }
  } catch (error) {
    console.error("Error fetching commission data:", error);
  }
};

// Fetch unpaid bookings
const fetchUnpaidBookings = async () => {
  try {
    const data = {
      first: dateFormat(dateRange.value[0]),
      second: dateFormat(dateRange.value[1]),
      agent_id: user.value.id,
    };

    const result = await homeStore.unpaidAgentSales(data);

    if (result?.result) {
      recentBookings.value = result.result
        .slice(0, 3)
        .map((booking, index) => ({
          customerName: `Customer ${index + 1}`,
          amount: booking.receivable_amount || 0,
        }));
    }
  } catch (error) {
    console.error("Error fetching unpaid bookings:", error);
  }
};

// Fetch receivables data
const fetchReceivables = async () => {
  if (!selectMonth.value) {
    console.log("No month selected, skipping receivables API call");
    return;
  }

  try {
    receivablesLoading.value = true;
    const params = {
      date: formatDateForAPI(selectMonth.value),
    };

    // Add admin_id based on user role
    if (!authStore.isSuperAdmin && !authStore.isAuditor) {
      params.admin_id = authStore.user?.id;
    } else {
      params.admin_id = selectedAgent.value;
    }

    console.log("Receivables API Parameters:", params);
    const res = await receivableStore.getSimpleList(params);
    console.log("Receivables Response:", receivables.value);

    if (receivables.value) {
      receivableDataCount.value = receivables.value.length;
      receivableDataSummary.value = receivables.value.reduce(
        (sum, r) => sum + parseFloat(r.balance_due || 0),
        0,
      );
    } else {
      receivableDataCount.value = 0;
      receivableDataSummary.value = 0;
    }
  } catch (error) {
    console.error("Error fetching receivables:", error);
  } finally {
    receivablesLoading.value = false;
  }
};

const summary = ref({});

const fetchSummary = async () => {
  if (!selectMonth.value) {
    console.log("No month selected, skipping receivables API call");
    return;
  }

  try {
    receivablesLoading.value = true;
    const params = {
      daterange: formatDateForAPI(selectMonth.value),
    };

    // Add admin_id based on user role
    if (!authStore.isSuperAdmin && !authStore.isAuditor) {
      params.admin_id = authStore.user?.id;
    } else {
      params.admin_id = selectedAgent.value;
    }

    const res = await dashboardStore.getDashboardSummary(params);
    console.log(" Response for summary:", res);

    if (res?.data?.result) {
      summary.value = res.data.result;
      console.log("====================================");
      console.log(summary.value);
      console.log("====================================");
    }
  } catch (error) {
    console.error("Error fetching receivables:", error);
  } finally {
    receivablesLoading.value = false;
  }
};

// Fetch channel source
const fetchChannelSource = async () => {
  try {
    const data = {
      first: dateFormat(dateRange.value[0]),
      second: dateFormat(dateRange.value[1]),
    };
    const res = await homeStore.getReportByChannel(data);
    console.log("this is channel", res);

    if (res?.result) {
      bookingsBySource.value = res.result;
    }
  } catch (error) {
    console.error("Error fetching channel source:", error);
  }
};

const agentsList = ref([]);
// Fetch agents list
const loadAgentsList = async () => {
  const res = await adminStore.getSimpleListAction();
  agentsList.value =
    res.result?.data?.filter(
      (a) => a.role === "admin" || a.role === "sale_manager",
    ) || [];
  console.log(agentsList.value);
};

// Helper function to get initials
const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Initialize dashboard
const initializeDashboard = async () => {
  loading.value = true;
  try {
    selectMonth.value = getCurrentMonth();
    await Promise.all([
      fetchDailySalesData(selectMonth.value),
      fetchCommissionData(),
      fetchUnpaidBookings(),
      fetchChannelSource(),
      fetchReceivables(),
      fetchSummary(),
      loadAgentsList(),
    ]);

    console.log("====================================");
    console.log(selectMonth.value, "this is monthly sale data");
    console.log("====================================");
  } catch (error) {
    console.error("Error initializing dashboard:", error);
  } finally {
    loading.value = false;
  }
};

// Watchers
watch(selectMonth, async (newValue, oldValue) => {
  if (newValue && newValue !== oldValue) {
    loading.value = true;
    await Promise.all([
      fetchDailySalesData(newValue),
      fetchCommissionData(),
      fetchReceivables(),
      fetchSummary(),
    ]);
    loading.value = false;
  }
});

watch(selectedAgent, async (newValue, oldValue) => {
  if (newValue && newValue !== oldValue) {
    loading.value = true;
    await Promise.all([
      fetchDailySalesData(selectMonth.value),
      fetchCommissionData(),
      fetchReceivables(),
      fetchSummary(),
    ]);
    loading.value = false;
  }
});

watch(dateRange, async (newValue) => {
  if (newValue && newValue.length === 2) {
    await fetchUnpaidBookings();
  }
});

// Lifecycle
onMounted(() => {
  initializeDashboard();
});
</script>
