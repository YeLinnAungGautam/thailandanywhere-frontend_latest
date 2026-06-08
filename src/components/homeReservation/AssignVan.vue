<template>
  <div class="assign-van-wrapper">
    <!-- ── Filter Bar ─────────────────────────────────────────────────────── -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-3 mb-4">
      <div class="flex flex-wrap items-center gap-3">
        <!-- Status Tabs -->
        <div class="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            v-for="tab in statusTabs"
            :key="tab.value"
            @click="filterStatus = tab.value"
            class="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150"
            :class="
              filterStatus === tab.value
                ? 'bg-[#FF613c] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            "
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Quick Date Pills -->
        <div class="flex items-center gap-1.5 flex-wrap">
          <button
            v-for="q in quickDates"
            :key="q.value"
            @click="applyQuickDate(q.value)"
            class="px-3 py-1.5 text-xs rounded-full border transition-all duration-150 font-medium"
            :class="
              activeQuickDate === q.value
                ? 'bg-[#FF613c] text-white border-[#FF613c]'
                : 'border-gray-200 text-gray-600 hover:border-[#FF613c] hover:text-[#FF613c]'
            "
          >
            {{ q.label }}
          </button>
        </div>

        <!-- Date Range + Search + Reset -->
        <div class="flex items-center gap-2 ml-auto">
          <div
            class="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
          >
            <svg
              class="w-3.5 h-3.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <input
              type="date"
              v-model="dateFrom"
              @change="onDateRangeChange"
              class="text-xs bg-transparent focus:outline-none text-gray-600 w-28"
            />
            <span class="text-gray-300 text-xs">→</span>
            <input
              type="date"
              v-model="dateTo"
              @change="onDateRangeChange"
              class="text-xs bg-transparent focus:outline-none text-gray-600 w-28"
            />
          </div>

          <button
            @click="resetFilters"
            class="px-3 py-2 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
          >
            <svg
              class="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- ── Loading ────────────────────────────────────────────────────────── -->
    <div v-if="loading" class="flex justify-center items-center py-16">
      <div class="flex flex-col items-center gap-3">
        <div
          class="w-8 h-8 border-4 border-gray-200 border-t-[#FF613c] rounded-full animate-spin"
        ></div>
        <p class="text-xs text-gray-400">Loading reservations...</p>
      </div>
    </div>

    <!-- ── Empty ──────────────────────────────────────────────────────────── -->
    <div
      v-else-if="filteredItems.length === 0"
      class="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200"
    >
      <div
        class="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3"
      >
        <svg
          class="w-7 h-7 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
      </div>
      <p class="text-sm font-medium text-gray-500">
        No van tour reservations found
      </p>
      <p class="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
    </div>

    <!-- ── Table ──────────────────────────────────────────────────────────── -->
    <div
      v-else
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap"
              >
                Status
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap"
              >
                CRM ID
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap"
              >
                Customer
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap"
              >
                Product
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap"
              >
                Variation
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap"
              >
                Service Date
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap"
              >
                Qty
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap"
              >
                Supplier
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap"
              >
                Collect?
              </th>
              <th
                class="px-4 py-3 text-right text-xs font-semibold text-gray-600 whitespace-nowrap"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <template v-for="item in filteredItems" :key="item.id">
              <!-- Main Row -->
              <tr
                class="hover:bg-gray-50 transition-colors cursor-pointer"
                @click="toggleExpand(item.id)"
              >
                <!-- Status -->
                <td class="px-4 py-3">
                  <span
                    class="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium w-fit whitespace-nowrap"
                    :class="
                      item.supplier_name != '-'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    "
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      :class="
                        item.supplier_name != '-'
                          ? 'bg-green-500'
                          : 'bg-yellow-500'
                      "
                    ></span>
                    {{ item.supplier_name != "-" ? "Assigned" : "Pending" }}
                  </span>
                </td>

                <!-- CRM ID -->
                <td class="px-4 py-3">
                  <span
                    class="px-2.5 py-1 bg-[#FF613c] text-white text-xs font-semibold rounded-full shadow-sm whitespace-nowrap"
                  >
                    {{ item.crm_id }}
                  </span>
                </td>

                <!-- Customer -->
                <td class="px-4 py-3">
                  <p class="text-xs text-gray-700 whitespace-nowrap">
                    {{ item.customer_name || "—" }}
                  </p>
                </td>

                <!-- Product -->
                <td class="px-4 py-3 max-w-[180px]">
                  <p
                    class="text-xs text-gray-800 font-medium truncate"
                    :title="item.product_name"
                  >
                    {{ item.product_name || "—" }}
                  </p>
                </td>

                <!-- Variation -->
                <td class="px-4 py-3">
                  <p class="text-xs text-gray-600 whitespace-nowrap">
                    {{ item.variation_name || "—" }}
                  </p>
                </td>

                <!-- Service Date -->
                <td class="px-4 py-3">
                  <div class="text-xs text-gray-700 whitespace-nowrap">
                    {{ formatDate(item.service_date) }}
                  </div>
                </td>

                <!-- Pickup Location -->
                <td class="px-4 py-3 max-w-[150px]">
                  <p
                    v-if="item.qty"
                    class="text-xs text-gray-600 truncate"
                    :title="item.qty"
                  >
                    {{ item.qty }}
                  </p>
                  <p v-else class="text-xs text-gray-300">—</p>
                </td>

                <!-- Driver -->
                <td class="px-4 py-3">
                  <div
                    v-if="item.supplier_name"
                    class="flex items-center gap-2"
                  >
                    <div
                      class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"
                    >
                      <svg
                        class="w-3.5 h-3.5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div class="min-w-0">
                      <p
                        v-if="item.supplier_name"
                        class="text-xs text-gray-400 truncate"
                      >
                        {{ item.supplier_name }}
                      </p>
                    </div>
                  </div>
                  <p v-else class="text-xs text-gray-300">Not assigned</p>
                </td>

                <!-- Driver Collect -->
                <td class="px-4 py-3">
                  <span
                    v-if="item.is_driver_collect === 1"
                    class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium"
                    >Yes</span
                  >
                  <span
                    v-else-if="item.is_driver_collect === 0"
                    class="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium"
                    >No</span
                  >
                  <span v-else class="text-xs text-gray-300">—</span>
                </td>

                <!-- Actions -->
                <td class="px-4 py-3 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <!-- Assign / Reassign Driver -->
                    <button
                      @click.stop="openAssignModal(item)"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 whitespace-nowrap"
                      :class="
                        item.supplier_id
                          ? 'bg-gray-100 hover:bg-orange-50 text-gray-600 hover:text-[#FF613c] border border-gray-200 hover:border-[#FF613c]'
                          : 'bg-[#FF613c] hover:bg-[#e55139] text-white shadow-sm'
                      "
                    >
                      <svg
                        class="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      {{
                        authStore.isAdmin || authStore.isSaleAdmin
                          ? "Fill Data"
                          : "Assign Driver"
                      }}
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>

        <AssignDriverModal
          :isOpen="assignModalOpen"
          :itemData="selectedItem"
          @close="closeAssignDriverModal"
          @refresh="fetchData"
        />
      </div>
    </div>

    <!-- ── Pagination ──────────────────────────────────────────────────────── -->
    <div
      v-if="!loading && carbookings && filteredItems.length > 0"
      class="mt-4"
    >
      <Pagination :data="carbookings" @change-page="changePage" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { DialogPanel, DialogTitle } from "@headlessui/vue";
import { Switch } from "@headlessui/vue";
import { useToast } from "vue-toastification";
import { useCarBookingStore } from "../../stores/carbooking";
import { useSupplierStore } from "../../stores/supplier";
import { useDriverStore } from "../../stores/driver";
import Modal from "../Modal.vue";
import Pagination from "../Pagination.vue";
import AssignDriverModal from "../../views/GroupComponent/ExpensePart/AssignDriverModal.vue";
import { useAuthStore } from "../../stores/auth.js";

const toast = useToast();
const carBookingStore = useCarBookingStore();
const supplierStore = useSupplierStore();
const driverStore = useDriverStore();
const authStore = useAuthStore();

const { carbookings, loading } = storeToRefs(carBookingStore);
const { suppliers } = storeToRefs(supplierStore);
const { drivers } = storeToRefs(driverStore);

// ── Filter state ───────────────────────────────────────────────────────────
const filterStatus = ref("all");
const searchCrm = ref("");
const dateFrom = ref("");
const dateTo = ref("");
const activeQuickDate = ref("today&90day");
const expandedId = ref(null);

const statusTabs = [
  { value: "all", label: "All" },
  { value: "unassigned", label: "Unassigned" },
  { value: "assigned", label: "Assigned" },
];

const quickDates = [
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "7day", label: "Next 7 Days" },
  { value: "30day", label: "Next 30 Days" },
  { value: "today&90day", label: "Next 90 Days" },
];

// ── Modal state ────────────────────────────────────────────────────────────
const assignModalOpen = ref(false);
const modalLoading = ref(false);
const submitting = ref(false);
const selectedItem = ref(null);
const driverCarList = ref([]);

const assignForm = ref({
  supplier_id: "",
  driver_id: "",
  car_number: "",
  driver_contact: "",
  cost_price: "",
  extra_collect_amount: "",
  is_driver_collect: false,
  pickup_time: "",
  pickup_location: "",
  dropoff_location: "",
  route_plan: "",
  special_request: "",
  quantity: 1,
});

// ── Helpers ────────────────────────────────────────────────────────────────
const toYMD = (d) => {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const m = [
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
  return `${String(d.getDate()).padStart(2, "0")} ${
    m[d.getMonth()]
  } ${d.getFullYear()}`;
};

// ── Computed ───────────────────────────────────────────────────────────────
const flatItems = computed(() => carbookings.value?.data ?? []);

const filteredItems = computed(() => {
  let list = flatItems.value;

  return list;
});

// ── Fetch ──────────────────────────────────────────────────────────────────
const fetchData = async () => {
  let data = {
    first: dateFrom.value,
    second: dateTo.value,
    agent_id: "",
  };
  if (filterStatus.value != "all") {
    if (filterStatus.value == "assigned") {
      data.assigned_only = true;
    } else {
      data.supplier_id = "unassigned";
    }
  }
  await carBookingStore.getListAction(data);
};

const changePage = async (url) => {
  let data = {
    first: dateFrom.value,
    second: dateTo.value,
    agent_id: "",
  };
  if (filterStatus.value != "all") {
    if (filterStatus.value == "assigned") {
      data.assigned_only = true;
    } else {
      data.supplier_id = "unassigned";
    }
  }
  await carBookingStore.getChangePage(url, data);
};

// ── Quick date ─────────────────────────────────────────────────────────────
const applyQuickDate = (val) => {
  activeQuickDate.value = val;
  const today = new Date();
  const addDays = (d, n) => {
    const r = new Date(d);
    r.setDate(r.getDate() + n);
    return r;
  };

  const map = {
    today: [today, today],
    tomorrow: [addDays(today, 1), addDays(today, 1)],
    "7day": [today, addDays(today, 7)],
    "30day": [today, addDays(today, 30)],
    "today&90day": [today, addDays(today, 90)],
  };

  const [from, to] = map[val] || [today, addDays(today, 90)];
  dateFrom.value = toYMD(from);
  dateTo.value = toYMD(to);
  fetchData();
};

const onDateRangeChange = () => {
  activeQuickDate.value = "";
  fetchData();
};

const resetFilters = () => {
  filterStatus.value = "all";
  searchCrm.value = "";
  applyQuickDate("today&90day");
};

const openAssignModal = (item) => {
  console.log(item);
  assignModalOpen.value = true;
  selectedItem.value = item;
};

const closeAssignDriverModal = () => {
  assignModalOpen.value = false;
  selectedItem.value = null;
};

// ── Row expand ─────────────────────────────────────────────────────────────

// ── Watch filters ──────────────────────────────────────────────────────────
watch(filterStatus, () => {
  /* client-side only filtering, no refetch needed */
  fetchData();
});

onMounted(() => applyQuickDate("today&90day"));
</script>
