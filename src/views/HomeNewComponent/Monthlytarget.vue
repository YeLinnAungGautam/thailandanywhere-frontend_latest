<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Company Target Section (All Sales) -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-2">
        <p class="text-gray-500 text-sm font-medium">COMPANY TARGET</p>
        <!-- <p class="text-xs text-gray-400">
          {{ formatCurrency(companyCurrentSales) }} /
          {{ formatCurrency(companyTargetAmount) }}
        </p> -->
      </div>
      <div class="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
        <div
          class="absolute left-0 top-0 h-3 rounded-full transition-all duration-300"
          :class="
            companyPercentage >= 100
              ? 'bg-gradient-to-r from-green-400 to-green-600'
              : 'bg-gradient-to-r from-orange-400 to-red-600'
          "
          :style="{ width: Math.min(companyPercentage, 100) + '%' }"
        ></div>
      </div>
      <p
        class="text-right text-sm font-semibold mt-2"
        :class="companyPercentage >= 100 ? 'text-green-600' : 'text-orange-600'"
      >
        {{ companyPercentage.toFixed(1) }}%
      </p>
    </div>

    <!-- Personal Target Section (Selected Agent or Current User) -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <p class="text-gray-500 text-sm font-medium">
          PERSONAL TARGET
          <span v-if="personalAgentName" class="text-gray-400">
            ({{ personalAgentName }})
          </span>
        </p>
        <p class="text-xs text-gray-400">
          {{ formatCurrency(personalCurrentSales) }} /
          {{ formatCurrency(personalTargetAmount) }}
        </p>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
        <div
          class="absolute left-0 top-0 h-3 rounded-full transition-all duration-300"
          :class="
            personalPercentage >= 100
              ? 'bg-gradient-to-r from-green-400 to-green-600'
              : 'bg-gradient-to-r from-orange-400 to-red-600'
          "
          :style="{ width: Math.min(personalPercentage, 100) + '%' }"
        ></div>
      </div>
      <p
        class="text-right text-sm font-semibold mt-2"
        :class="
          personalPercentage >= 100 ? 'text-green-600' : 'text-orange-600'
        "
      >
        {{ personalPercentage.toFixed(1) }}%
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useAuthStore } from "../../stores/auth";
import { useHomeStore } from "../../stores/home";

const props = defineProps({
  selectedAgent: {
    type: [String, Number],
    default: "",
  },
  selectMonth: {
    type: String,
    required: true,
  },
  agentsList: {
    type: Array,
    default: () => [],
  },
});

const authStore = useAuthStore();
const homeStore = useHomeStore();

// Company Target Data (ALL sales combined)
const companyCurrentSales = ref(0);
const companyTargetAmount = ref(0);

// Personal Target Data (Individual agent)
const personalCurrentSales = ref(0);
const personalTargetAmount = ref(0);
const personalAgentName = ref("");

// Computed percentages
const companyPercentage = computed(() => {
  if (companyTargetAmount.value === 0) return 0;
  return (companyCurrentSales.value / companyTargetAmount.value) * 100;
});

const personalPercentage = computed(() => {
  if (personalTargetAmount.value === 0) return 0;
  return (personalCurrentSales.value / personalTargetAmount.value) * 100;
});

// Utility function
const formatCurrency = (value) => {
  const num = Number(value) || 0;
  return `฿${num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

// Fetch company target data (ALL SALES - no agent filter)
const fetchCompanyTarget = async () => {
  try {
    const data = {
      date: props.selectMonth,
      created_by: "",
    };

    const res = await homeStore.getTimeFilterAdminArray(data);

    console.log(res, "this is from target");

    if (res?.result?.sales && res?.result?.airline_sales) {
      let totalSales = 0;
      let totalAirline = 0;

      // Calculate total sales from ALL agents (excluding airline)
      res.result.sales.forEach((sale, index) => {
        let dailySalesTotal = 0;
        sale.agents.forEach((agent) => {
          dailySalesTotal += agent.total;
        });

        let dailyAirlineTotal = 0;
        const airlineSaleForDay = res.result.airline_sales[index];
        if (airlineSaleForDay && airlineSaleForDay.agents) {
          airlineSaleForDay.agents.forEach((agent) => {
            dailyAirlineTotal += agent.total;
          });
        }

        totalSales += dailySalesTotal;
        totalAirline += dailyAirlineTotal;
      });

      const currentDate = new Date();
      const [year, month] = props.selectMonth.split("-");
      const selectedDate = new Date(year, month - 1, 1); // month - 1 because JS months are 0-indexed

      const isCurrentMonth =
        selectedDate.getFullYear() === currentDate.getFullYear() &&
        selectedDate.getMonth() === currentDate.getMonth();

      const totalDateInMonth = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0
      ).getDate();

      const divisor = isCurrentMonth ? currentDate.getDate() : totalDateInMonth;

      companyCurrentSales.value = (totalSales - totalAirline) / divisor;

      // Company target = sum of all agents' targets

      // Fallback if agentsList is not available
      companyTargetAmount.value = 350000; // Default company target

      console.log(companyCurrentSales.value, "this is from target");
    }
  } catch (error) {
    console.error("Error fetching company target:", error);
  }
};

// Fetch personal target data (individual agent's performance)
const fetchPersonalTarget = async () => {
  try {
    const [year, month] = props.selectMonth.split("-");
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const data = {
      first: dateFormat(startDate),
      second: dateFormat(endDate),
    };

    const res = await homeStore.getAgentSales(data);

    console.log(res, "this is agent get list");

    if (res?.result) {
      // Determine which agent to show:
      // - If super admin/auditor and agent selected: show that agent
      // - Otherwise: show current user
      const targetUserId =
        (authStore.isSuperAdmin || authStore.isAuditor) && props.selectedAgent
          ? props.selectedAgent
          : authStore.user?.id;

      // Find the agent's sales data
      const agentSale = res.result.find(
        (sale) => sale.created_by?.id == targetUserId
      );

      if (agentSale) {
        const currentDate = new Date();
        const [year, month] = props.selectMonth.split("-");
        const selectedDate = new Date(year, month - 1, 1);

        const isCurrentMonth =
          selectedDate.getFullYear() === currentDate.getFullYear() &&
          selectedDate.getMonth() === currentDate.getMonth();

        const totalDateInMonth = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth() + 1,
          0
        ).getDate();

        const divisor = isCurrentMonth
          ? currentDate.getDate()
          : totalDateInMonth;

        personalCurrentSales.value =
          agentSale.total_without_airline / divisor || 0;
        personalAgentName.value = agentSale.created_by?.name || "";

        // Get target from agent's profile
        const agent = props.agentsList.find((a) => a.id == targetUserId);
        console.log(agent, "this is selected agent");

        personalTargetAmount.value = agent?.target_amount || 350000;
      } else {
        // No sales data found for this agent this month
        personalCurrentSales.value = 0;

        // Get agent info
        const agent = props.agentsList.find((a) => a.id == targetUserId);
        personalAgentName.value = agent?.name || authStore.user?.name || "";
        personalTargetAmount.value =
          agent?.target || authStore.user?.target || 350000;
      }
    }
  } catch (error) {
    console.error("Error fetching personal target:", error);
  }
};

// Helper function
const dateFormat = (inputDateString) => {
  if (!inputDateString) return null;
  const inputDate = new Date(inputDateString);
  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, "0");
  const day = String(inputDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Initialize data
const loadTargets = async () => {
  await Promise.all([fetchCompanyTarget(), fetchPersonalTarget()]);
};

// Watch for changes
watch(
  () => props.selectMonth,
  () => {
    loadTargets();
  }
);

watch(
  () => props.selectedAgent,
  () => {
    // Company target doesn't change with agent selection
    // Only reload personal target
    fetchPersonalTarget();
  }
);

// Load on mount
onMounted(() => {
  loadTargets();
});
</script>
