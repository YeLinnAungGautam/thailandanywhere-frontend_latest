<template>
  <div class="bg-white p-6 rounded-lg shadow-sm h-[45vh] overflow-scroll">
    <!-- Header with filters -->
    <div class="mb-4">
      <h3 class="text-lg font-semibold mb-3">Receivables</h3>
      <div class="space-y-2">
        <select
          v-if="showAgentFilter"
          v-model="selectedAgent"
          class="bg-white text-sm w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">All Agents</option>
          <option v-for="agent in agentsList" :key="agent.id" :value="agent.id">
            {{ agent.name }}
          </option>
        </select>

        <!-- <select
          v-model="selectedType"
          class="bg-white text-sm w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">All</option>
          <option value="have_flight">Have Flight</option>
          <option value="have_vantour">Have Vantour</option>
          <option value="no_flight_no_vantour">No Flight and Vantour</option>
        </select> -->
      </div>
    </div>

    <!-- Summary -->
    <div class="mb-4 pb-4 border-b">
      <p class="text-xs text-gray-500">
        Total Receivables:
        <span class="text-black font-semibold">{{ dataCount }}</span>
      </p>
      <p class="text-xs text-gray-500">
        Total Balance Due:
        <span class="text-red-600 font-semibold">{{
          formatCurrency(dataSummary)
        }}</span>
      </p>
    </div>

    <!-- Loading state -->
    <div v-if="receivablesLoading" class="text-center text-gray-500 py-4">
      Loading receivables...
    </div>

    <!-- Receivables list -->
    <div
      v-else-if="filteredReceivables.length > 0"
      class="max-h-[40vh] overflow-y-auto space-y-3"
    >
      <div
        v-for="r in filteredReceivables"
        :key="r.id"
        @click="goToBooking(r.id)"
        class="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
      >
        <div class="flex justify-between items-start mb-2">
          <div class="flex items-center gap-2">
            <span class="px-2 py-1 text-xs font-medium rounded bg-gray-200">
              {{ r.crm_id }}
            </span>
            <div class="flex gap-1">
              <span
                v-if="r.include_vantour"
                class="w-2 h-2 bg-orange-500 rounded-full"
                title="Includes Vantour"
              ></span>
              <span
                v-if="r.include_flight"
                class="w-2 h-2 bg-blue-600 rounded-full"
                title="Includes Flight"
              ></span>
            </div>
          </div>
          <span class="text-xs text-gray-500">
            {{ formatPaymentStatus(r.payment_status) }}
          </span>
        </div>

        <p class="text-sm font-medium mb-1">{{ r.customer?.name }}</p>

        <div class="flex justify-between items-end text-xs">
          <div class="text-gray-500">
            <p>Booking: {{ formatDate(r.booking_date) }}</p>
            <p>Due: {{ formatDate(r.balance_due_date) }}</p>
          </div>
          <div class="text-right">
            <p class="text-gray-600">
              Total: {{ formatCurrency(r.grand_total) }}
            </p>
            <p class="text-red-600 font-semibold">
              Due: {{ formatCurrency(r.balance_due) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center text-gray-500 py-8">
      No receivables found for this period
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { format } from "date-fns";
import { useAuthStore } from "../../stores/auth";
import { useAdminStore } from "../../stores/admin";
import { storeToRefs } from "pinia";

const props = defineProps({
  bookings: {
    type: Array,
    default: () => [],
  },
  selectedMonth: {
    type: String,
    default: "",
  },
  dataCount: {
    type: Number,
    default: 0,
  },
  dataSummary: {
    type: Number,
    default: 0,
  },
  receivablesList: {
    type: Array,
    default: () => [],
  },
  receivablesLoading: {
    type: Boolean,
    default: false,
  },
});

const authStore = useAuthStore();
const adminStore = useAdminStore();
const { user } = storeToRefs(authStore);
const { admin } = storeToRefs(adminStore);

const selectedAgent = ref("");
const selectedType = ref("");
const agentsList = ref([]);

// Computed properties
const showAgentFilter = computed(() => {
  return authStore.isSuperAdmin || authStore.isSaleManager;
});

const filteredReceivables = computed(() => {
  let filtered = props.receivablesList;

  if (selectedAgent.value) {
    filtered = filtered.filter((r) => r.agent_id === selectedAgent.value);
  }

  if (selectedType.value === "have_flight") {
    filtered = filtered.filter((r) => r.include_flight === true);
  } else if (selectedType.value === "have_vantour") {
    filtered = filtered.filter((r) => r.include_vantour === true);
  } else if (selectedType.value === "no_flight_no_vantour") {
    filtered = filtered.filter(
      (r) => r.include_flight === false && r.include_vantour === false
    );
  }

  return filtered;
});

// Format functions
const formatCurrency = (value) => {
  return `฿ ${parseFloat(value || 0).toLocaleString()}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  try {
    return format(new Date(dateString), "dd/MM/yyyy");
  } catch (error) {
    return dateString;
  }
};

const formatPaymentStatus = (status) => {
  if (!status) return "";
  return status.toUpperCase().replace(/_/g, " ");
};

const goToBooking = (id) => {
  window.open(`/bookings/new-update/${id}`, "_blank");
};

// Load agents list
const loadAgentsList = async () => {
  const res = await adminStore.getSimpleListAction();
  agentsList.value =
    res.result?.data?.filter(
      (a) => a.role === "admin" || a.role === "sale_manager"
    ) || [];
  console.log(agentsList.value);
};

onMounted(async () => {
  await loadAgentsList();
});
</script>
