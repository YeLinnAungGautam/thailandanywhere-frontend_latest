<template>
  <div>
    <!-- Loading Screen -->
    <div
      v-if="loading"
      class="fixed inset-0 bg-white/80 flex justify-center items-center z-50"
    >
      <div
        aria-label="Loading..."
        role="status"
        class="flex items-center space-x-2"
      >
        <svg
          class="h-20 w-20 animate-spin stroke-gray-500"
          viewBox="0 0 256 256"
        >
          <line
            x1="128"
            y1="32"
            x2="128"
            y2="64"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="24"
          ></line>
          <line
            x1="195.9"
            y1="60.1"
            x2="173.3"
            y2="82.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="24"
          ></line>
          <line
            x1="224"
            y1="128"
            x2="192"
            y2="128"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="24"
          ></line>
          <line
            x1="195.9"
            y1="195.9"
            x2="173.3"
            y2="173.3"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="24"
          ></line>
          <line
            x1="128"
            y1="224"
            x2="128"
            y2="192"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="24"
          ></line>
          <line
            x1="60.1"
            y1="195.9"
            x2="82.7"
            y2="173.3"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="24"
          ></line>
          <line
            x1="32"
            y1="128"
            x2="64"
            y2="128"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="24"
          ></line>
          <line
            x1="60.1"
            y1="60.1"
            x2="82.7"
            y2="82.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="24"
          ></line>
        </svg>
        <span class="text-lg font-medium text-gray-500"
          >Please wait, loading...</span
        >
      </div>
    </div>

    <!-- Main Content -->
    <Layout title="Travel & Tour Agency">
      <div class="grid grid-cols-7 gap-2">
        <!-- Filter Section -->
        <div class="col-span-7 bg-white p-4 rounded-lg">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">Filter by Month</h2>
            <div class="flex items-center gap-4">
              <input
                type="month"
                v-model="selectMonth"
                class="bg-transparent focus:ring-0 focus:border-gray-300 rounded px-3 py-1"
              />
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
              <BookingStats
                :tours="bookingStats.tours"
                :tickets="bookingStats.tickets"
                :packages="bookingStats.packages"
              />

              <!-- Sales Overview Chart -->
              <div
                class="col-span-2"
                v-if="monthlySalesData.length > 0 && targetValue"
              >
                <SalesOverview
                  :salesData="monthlySalesData"
                  :averageValue="targetValue"
                />
              </div>
            </div>

            <div class="col-span-2">
              <div class="grid grid-cols-2 gap-2">
                <div class="col-span-2">
                  <RevenueByProduct :revenueData="revenueByProduct" />
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
              <div class="grid grid-cols-2 gap-2">
                <BookingsBySource :sourceData="bookingsBySource" />
                <AverageBookingValue :bookingData="averageBookingData" />
              </div>
            </div>
          </div>
        </div>

        <!-- Right Sidebar -->
        <div class="col-span-2 space-y-2">
          <MonthlyTarget
            :percentage="monthlyTargetPercentage"
            :copercentage="80"
          />
          <TopSalesReps :salesReps="topSalesReps" />
          <RecentBookings :bookings="recentBookings" />
        </div>
      </div>
    </Layout>
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
import { storeToRefs } from "pinia";
import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subMonths,
  format,
} from "date-fns";

// Stores
const authStore = useAuthStore();
const homeStore = useHomeStore();
const { user } = storeToRefs(authStore);

// Loading state
const loading = ref(false);

// Date filters
const selectMonth = ref("");
const dateRange = ref([startOfMonth(new Date()), endOfMonth(new Date())]);

// Preset dates for date picker
const presetDates = ref([
  { label: "Today", value: [new Date(), new Date()] },
  {
    label: "This month",
    value: [startOfMonth(new Date()), endOfMonth(new Date())],
  },
  {
    label: "Last month",
    value: [
      startOfMonth(subMonths(new Date(), 1)),
      endOfMonth(subMonths(new Date(), 1)),
    ],
  },
  {
    label: "This year",
    value: [startOfYear(new Date()), endOfYear(new Date())],
  },
]);

// Dashboard data
const monthlySalesData = ref([]);
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
const monthlyTargetPercentage = ref(0);
const topSalesReps = ref([]);
const bookingsBySource = ref([
  { source: "Website", value: 0 },
  { source: "Facebook", value: 0 },
  { source: "LINE", value: 0 },
  { source: "Phone", value: 0 },
]);
const averageBookingData = ref({
  value: 0,
  customers: [],
});
const recentBookings = ref([]);
const targetValue = ref(0);

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
  return `฿ ${value.toLocaleString()}`;
};

const currentDate = new Date();

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
      created_by: authStore.user.id,
    };
    const res = await homeStore.getTimeFilterAdminArray(data);

    console.log("====================================");
    console.log("testing", res.result);
    console.log("====================================");

    if (res?.result?.sales) {
      monthlySalesData.value = [];
      let cumulativeTotal = 0;

      res.result.sales.forEach((sale, index) => {
        // Calculate daily total for this day
        let dailyTotal = 0;
        sale.agents.forEach((agent) => {
          dailyTotal += agent.total;
        });

        // Add to cumulative total
        cumulativeTotal += dailyTotal;

        // Get the day number from the date (e.g., "2025-11-01" -> 1)
        const dayNumber = parseInt(sale.date.split("-")[2]);

        // Calculate cumulative average: total of all days so far / day number
        const cumulativeAverage = Math.round(cumulativeTotal / dayNumber);

        // Push the cumulative average to the array
        monthlySalesData.value.push(cumulativeAverage);
      });

      // For the overall average sales display, use the last cumulative average
      averageSales.value =
        monthlySalesData.value.length > 0
          ? monthlySalesData.value[monthlySalesData.value.length - 1]
          : 0;
    }
  } catch (error) {
    console.error("Error fetching daily sales data:", error);
  }
};

// Fetch commission and target data
const fetchCommissionData = async () => {
  try {
    const [year, month] = selectMonth.value.split("-");
    let startDate = new Date(year, month - 1, 1);
    let endDate = new Date(year, month, 0);

    const data = {
      first: dateFormat(startDate),
      second: dateFormat(endDate),
    };

    const resSaleAgent = await homeStore.getAgentSales(data);

    console.log("====================================");
    console.log("testing commission", resSaleAgent.result);
    console.log("====================================");

    if (resSaleAgent?.result) {
      resSaleAgent.result.forEach((sale) => {
        if (sale.created_by?.name == authStore.user.name) {
          commissionAmount.value = sale.over_target_count * 2000;
          daysToTarget.value = sale.over_target_count || 10;
        }
      });

      // Calculate monthly target percentage
      const userTarget = authStore.target || 275000;
      const currentTotal = monthlySalesData.value.reduce(
        (sum, val) => sum + val,
        0
      );
      monthlyTargetPercentage.value = Math.round(currentTotal / userTarget);
      targetValue.value = userTarget;

      // Set top sales reps
      topSalesReps.value = resSaleAgent.result
        .map((sale) => ({
          name: sale.created_by?.name || "Unknown",
          initials: getInitials(sale.created_by?.name || "Unknown"),
          amount: sale.total || 0,
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 10);

      console.log(topSalesReps.value, "top");
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
    ]);

    console.log("====================================");
    console.log(monthlySalesData.value, "this is monthly sale data");
    console.log("====================================");
  } catch (error) {
    console.error("Error initializing dashboard:", error);
  } finally {
    loading.value = false;
  }
};

// Watchers
watch(selectMonth, async (newValue) => {
  if (newValue) {
    loading.value = true;
    await Promise.all([fetchDailySalesData(newValue), fetchCommissionData()]);
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
