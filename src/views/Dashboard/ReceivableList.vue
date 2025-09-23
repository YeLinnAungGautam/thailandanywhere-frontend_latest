<template>
  <div class="bg-white p-6 rounded-lg shadow-sm col-span-1">
    <div class="flex justify-between items-center mb-4 gap-x-4">
      <input
        type="month"
        v-model="selectedMonthForSidebar"
        class="bg-white text-sm max-w-[150px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <select
        v-model="selectedAgent"
        class="bg-white text-sm max-w-[150px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <option value="">All Agents</option>
        <option
          v-for="agent in adminOnlyLists"
          :key="agent.id"
          :value="agent.id"
        >
          {{ agent.name }}
        </option>
      </select>
    </div>
    <div class="mb-4">
      <p class="text-sm text-gray-500">
        Total Receivables:
        <span class="text-black font-semibold">{{
          formattedNumber(dataCount)
        }}</span>
        | Total Balance Due:
        <span class="text-red-600 font-semibold">{{
          formattedNumber(dataSummary)
        }}</span>
      </p>
    </div>
    <div v-if="loading" class="text-center text-gray-500">Loading...</div>
    <div
      v-if="!loading && receivables?.length > 0"
      class="h-[calc(100vh-270px)] overflow-y-auto"
    >
      <div
        v-for="r in receivables ?? []"
        :key="r.id"
        class="mb-4 p-4 bg-white border border-gray-200 rounded-lg shadow text-sm"
      >
        <p class="pb-1 text-end font-medium">
          {{ r.payment_status.toUpperCase().replace("_", " ") }}
        </p>
        <div class="flex justify-between items-end gap-x-4">
          <div class="space-y-1 relative">
            <p>{{ getFormatDate(r.booking_date) }}</p>
            <p
              class="absolute top-4 left-0 w-2 h-2 bg-[#FF613c] rounded-full"
              v-if="r.include_vantour"
            ></p>
            <p
              class="absolute top-4 left-3 w-2 h-2 bg-blue-600 rounded-full"
              v-if="r.include_flight"
            ></p>
            <p
              @click="goToBooking(r.id)"
              class="font-semibold text-base px-2 rounded-md bg-gray-200 text-center inline-block"
            >
              {{ r.crm_id }}
            </p>
            <p>{{ r.customer.name }}</p>
            <p>{{ getFormatDate(r.balance_due_date) }}</p>
          </div>
          <div class="text-end space-y-1">
            <p>Total: {{ formattedNumber(r.grand_total) }}</p>
            <p>Deposit: {{ formattedNumber(r.deposit) }}</p>
            <p class="font-semibold text-red-600 text-base">
              Due: {{ formattedNumber(r.balance_due) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useAdminStore } from "../../stores/admin";
import { storeToRefs } from "pinia";
import { useReceivableStore } from "../../stores/receivable";
import { format } from "date-fns";
import {
  formattedDate,
  formattedNumber,
  getFormatDate,
} from "../help/FormatData";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";

const selectedMonthForSidebar = ref("");
const selectedAgent = ref("");
const dataCount = ref(0);
const dataSummary = ref(0);

const adminStore = useAdminStore();
const receivableStore = useReceivableStore();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const { admin } = storeToRefs(adminStore);
const { receivables, loading } = storeToRefs(receivableStore);

const router = useRouter();

const adminOnlyList = async () => {
  const res = await adminStore.getSimpleListAction();
  console.log("Admin Only List:", res);
};

const adminOnlyLists = ref([]);
const adminOnlyListAction = async () => {
  if (user.value != null) {
    if (
      admin.value &&
      admin.value.data &&
      admin.value.data.length > 0 &&
      user.value?.role === "super_admin"
    ) {
      adminOnlyLists.value = admin.value.data.filter(
        (admin) => admin.role === "admin" || admin.role === "sale_manager"
      );
    } else if (
      admin.value &&
      admin.value.data &&
      admin.value.data.length > 0 &&
      user.value?.role === "sale_manager"
    ) {
      const res = await adminStore.getSaleManager();
      console.log("Sale Manager Admin List:", res);
      let manager = res.result.data.find((a) => a.id == authStore.user?.id);

      adminOnlyLists.value = manager.subsidiaries?.map((item) => item) || [];
      adminOnlyLists.value.push(manager);
    }
  }
};

const getCurrentMonth = () => {
  const date = new Date();
  selectedMonthForSidebar.value = date.toISOString().slice(0, 7);
};

const goToBooking = (id) => {
  window.open(`/bookings/new-update/${id}`, "_blank");
  console.log("Navigating to booking:", id);
};

// Fix 1: Convert YYYY-MM to MM-YYYY format for the API
const formatDateForAPI = (dateString) => {
  if (!dateString) return "";
  const [year, month] = dateString.split("-");
  return `${month}-${year}`; // Convert "2024-01" to "01-2024"
};

// Fix 2: Only call API when we have valid data
const getReceivables = async () => {
  if (!selectedMonthForSidebar.value) {
    console.log("No month selected, skipping API call");
    return;
  }

  try {
    const params = {
      date: formatDateForAPI(selectedMonthForSidebar.value), // Now sends "01-2024" format
    };

    // Only add admin_id if a specific agent is selected
    if (selectedAgent.value || authStore.isSuperAdmin) {
      params.admin_id = selectedAgent.value;
    }

    // if (authStore.isSuperAdmin) {
    //   params.admin_id = "";
    // }

    if (!authStore.isSuperAdmin) {
      params.admin_id = authStore.user?.id;
    }

    console.log("API Parameters:", params);
    const res = await receivableStore.getSimpleList(params);
    console.log("Receivables:", receivables.value);

    if (receivables.value) {
      dataCount.value = receivables.value.length;
      dataSummary.value = receivables.value.reduce(
        (sum, r) => sum + parseFloat(r.balance_due || 0),
        0
      );
    } else {
      dataCount.value = 0;
      dataSummary.value = 0;
    }
  } catch (error) {
    console.error("Error fetching receivables:", error);
  }
};

onMounted(async () => {
  await authStore.getMe();
  await adminOnlyListAction();
  await adminOnlyList();

  getCurrentMonth();

  // Fix 3: Call getReceivables after initializing the current month
  await getReceivables();
});

// Fix 4: Better watch logic - call API whenever values change
watch(
  [selectedMonthForSidebar, selectedAgent],
  async ([newMonth, newAgent], [oldMonth, oldAgent]) => {
    // Only call API if month has actually changed or agent changed
    if (newMonth && (newMonth !== oldMonth || newAgent !== oldAgent)) {
      await getReceivables();
    }
  }
);

// Fix 5: Also watch for when month is cleared
watch(selectedMonthForSidebar, async (newMonth) => {
  if (!newMonth) {
    console.log(
      "Month cleared, you might want to clear receivables or show all data"
    );
    // Optionally clear receivables or fetch all data
  }
});
</script>
