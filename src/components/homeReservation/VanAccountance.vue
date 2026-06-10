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
            <span :class="tab.have ? '' : 'text-gray-800/50'">{{
              tab.label
            }}</span>
          </button>
        </div>

        <!-- Day Navigator -->
        <div class="flex items-center gap-2 ml-auto">
          <!-- Today / Tomorrow pills -->
          <button
            @click="selectQuick('today')"
            class="px-3 py-1.5 text-xs rounded-full border transition-all duration-150 font-medium whitespace-nowrap"
            :class="
              activeQuick === 'today'
                ? 'bg-[#FF613c] text-white border-[#FF613c]'
                : 'border-gray-200 text-gray-600 hover:border-[#FF613c] hover:text-[#FF613c]'
            "
          >
            Today
          </button>

          <button
            @click="selectQuick('tomorrow')"
            class="px-3 py-1.5 text-xs rounded-full border transition-all duration-150 font-medium whitespace-nowrap"
            :class="
              activeQuick === 'tomorrow'
                ? 'bg-[#FF613c] text-white border-[#FF613c]'
                : 'border-gray-200 text-gray-600 hover:border-[#FF613c] hover:text-[#FF613c]'
            "
          >
            Tomorrow
          </button>

          <!-- Prev Arrow -->
          <button
            @click="shiftDay(-1)"
            class="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg
              class="w-3.5 h-3.5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <!-- Date Display (click to open calendar) -->
          <!-- Date Display (click to open calendar) -->
          <div class="relative" @click="toggleCalendar">
            <label
              class="px-4 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:border-[#FF613c] hover:text-[#FF613c] transition-colors whitespace-nowrap min-w-[90px] text-center cursor-pointer block"
            >
              {{ formatPill(currentDate) }}
              <input
                type="date"
                ref="calendarInput"
                v-model="calendarValue"
                @change="onCalendarPick"
                class="absolute opacity-0 w-0 h-0 pointer-events-none"
              />
            </label>
          </div>

          <!-- Next Arrow -->
          <button
            @click="shiftDay(1)"
            class="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg
              class="w-3.5 h-3.5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <!-- Reset -->
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
      <div class="flex justify-start items-center gap-x-2 pt-3">
        <p class="text-sm font-medium">Total Balance :</p>
        <p
          class="text-sm font-medium"
          :class="totalBalance != 0 ? 'text-[#FF613c] ' : ''"
        >
          {{ totalBalance != 0 ? totalBalance : "select one supplier" }}
        </p>
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
                CRM ID
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap"
              >
                Service Date
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
                Qty
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap"
              >
                Sale Amount
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap"
              >
                Cost Amount
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap"
              >
                Profit/Loss
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap"
              >
                Collect
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap"
              >
                Collect Amount
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap"
              >
                Balance
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
              <tr
                class="hover:bg-gray-50 transition-colors cursor-pointer"
                :class="item.is_checked == 1 ? 'bg-green-50' : ''"
                @click="toggleExpand(item.id)"
              >
                <!-- CRM ID -->
                <td class="px-4 py-3" @click="goToBooking(item.booking_id)">
                  <span
                    class="px-2.5 py-1 bg-[#FF613c] text-white text-xs font-semibold rounded-full shadow-sm whitespace-nowrap"
                  >
                    {{ item.crm_id }}
                  </span>
                </td>
                <!-- Service Date -->
                <td class="px-4 py-3">
                  <div class="text-xs text-gray-700 whitespace-nowrap">
                    {{ formatDate(item.service_date) }}
                  </div>
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
                <!-- Qty -->
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
                <!-- Sale Amount -->
                <td class="px-4 py-3">
                  <p class="text-xs text-gray-600 whitespace-nowrap">
                    {{ item.amount || "—" }}
                  </p>
                </td>
                <!-- cost Amount -->
                <td class="px-4 py-3">
                  <p class="text-xs text-gray-600 whitespace-nowrap">
                    {{ item.total_cost || "—" }}
                  </p>
                </td>
                <!-- Profit/Loss -->
                <td class="px-4 py-3">
                  <p
                    class="whitespace-nowrap font-medium text-sm"
                    :class="
                      item.amount - item.total_cost >= 0
                        ? 'text-green-600'
                        : 'text-red-500'
                    "
                  >
                    {{ item.amount - item.total_cost || "—" }}
                  </p>
                </td>
                <!-- Collect -->
                <td class="px-4 py-3">
                  <p
                    class="text-xs text-gray-600 whitespace-nowrap"
                    :class="
                      item.is_driver_collect == 1
                        ? 'bg-green-600 px-1.5 py-0.5 rounded-lg text-white'
                        : 'bg-red-600 px-1.5 py-0.5 rounded-lg text-white'
                    "
                  >
                    {{
                      item.is_driver_collect == 1 ? "collect" : "not collect"
                    }}
                  </p>
                </td>
                <!-- Collect Amount -->
                <td class="px-4 py-3">
                  <p class="text-xs text-gray-600 whitespace-nowrap">
                    {{ item.car_total_collect || "—" }}
                  </p>
                </td>
                <!-- Balance -->
                <td class="px-4 py-3">
                  <p
                    class="text-sm font-medium whitespace-nowrap"
                    :class="
                      (item.is_driver_collect == 1
                        ? item.car_total_collect - item.total_cost
                        : -item.total_cost) >= 0
                        ? 'text-green-600'
                        : 'text-red-500'
                    "
                  >
                    {{
                      item.is_driver_collect == 1
                        ? item.car_total_collect - item.total_cost
                        : -item.total_cost
                    }}
                  </p>
                </td>
                <!-- Actions -->
                <td class="px-4 py-3 text-right">
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
import { useToast } from "vue-toastification";
import { useCarBookingStore } from "../../stores/carbooking";
import { useSupplierStore } from "../../stores/supplier";
import { useDriverStore } from "../../stores/driver";
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
const dateFrom = ref("");
const dateTo = ref("");

const statusTabs = ref([
  { value: "all", label: "All", have: true },
  { value: "unassigned", label: "Unassigned", have: true },
]);

// ── Day navigator state ────────────────────────────────────────────────────
const currentDate = ref(new Date());
const activeQuick = ref("today");
const calendarInput = ref(null);
const calendarValue = ref("");

// ── Modal state ────────────────────────────────────────────────────────────
const assignModalOpen = ref(false);
const selectedItem = ref(null);

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

const formatPill = (d) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return `${days[d.getDay()]} ${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1,
  ).padStart(2, "0")}`;
};

// ── Computed ───────────────────────────────────────────────────────────────
const flatItems = computed(() => carbookings.value?.data ?? []);
const filteredItems = computed(() => flatItems.value);
const totalBalance = ref(0);

// ── Fetch ──────────────────────────────────────────────────────────────────
const fetchData = async () => {
  const data = {
    first: dateFrom.value,
    second: dateTo.value,
    agent_id: "",
  };
  if (filterStatus.value === "unassigned") {
    data.supplier_id = "unassigned";
  } else if (
    filterStatus.value !== "unassigned" &&
    filterStatus.value != "" &&
    filterStatus.value != "all"
  ) {
    data.supplier_id = filterStatus.value;
  }
  const res = await carBookingStore.getListAction(data);
  console.log(res, "this is accountance");
  totalBalance.value = res.total_balance != null ? res.total_balance : 0;
  statusTabs.value = [
    { value: "all", label: "All", have: true },
    { value: "unassigned", label: "Unassigned", have: true },
  ];

  if (res.supplierLists && Object.keys(res.supplierLists).length > 0) {
    Object.entries(res.supplierLists).forEach(([id, name]) => {
      statusTabs.value.push({ value: id, label: name, have: false });
    });
  }

  if (res.suppliers && Object.keys(res.suppliers).length > 0) {
    Object.entries(res.suppliers).forEach(([id, name]) => {
      const existing = statusTabs.value.find((tab) => tab.value === id);
      if (existing) {
        // Update existing entry instead of adding duplicate
        existing.have = true;
      } else {
        statusTabs.value.push({ value: id, label: name, have: true });
      }
    });
  }
};

const changePage = async (url) => {
  const data = {
    first: dateFrom.value,
    second: dateTo.value,
    agent_id: "",
  };
  if (filterStatus.value === "unassigned") {
    data.supplier_id = "unassigned";
  } else if (
    filterStatus.value !== "unassigned" &&
    filterStatus.value != "" &&
    filterStatus.value != "all"
  ) {
    data.supplier_id = filterStatus.value;
  }
  const res = await carBookingStore.getChangePage(url, data);
  totalBalance.value = res.total_balance != null ? res.total_balance : 0;
  statusTabs.value = [
    { value: "all", label: "All", have: true },
    { value: "unassigned", label: "Unassigned", have: true },
  ];

  if (res.supplierLists && Object.keys(res.supplierLists).length > 0) {
    Object.entries(res.supplierLists).forEach(([id, name]) => {
      statusTabs.value.push({ value: id, label: name, have: false });
    });
  }

  if (res.suppliers && Object.keys(res.suppliers).length > 0) {
    Object.entries(res.suppliers).forEach(([id, name]) => {
      const existing = statusTabs.value.find((tab) => tab.value === id);
      if (existing) {
        // Update existing entry instead of adding duplicate
        existing.have = true;
      } else {
        statusTabs.value.push({ value: id, label: name, have: true });
      }
    });
  }
};

const goToBooking = (id) => {
  window.open(`/bookings/new-update/${id}`, "_blink");
};

// ── Day navigator ──────────────────────────────────────────────────────────
const applyDate = (d) => {
  const ymd = toYMD(d);
  dateFrom.value = ymd;
  dateTo.value = ymd;
  calendarValue.value = ymd;
  const todayYMD = toYMD(new Date());
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowYMD = toYMD(tomorrowDate);
  if (ymd === todayYMD) activeQuick.value = "today";
  else if (ymd === tomorrowYMD) activeQuick.value = "tomorrow";
  else activeQuick.value = "";
  fetchData();
};

const selectQuick = (val) => {
  const d = new Date();
  if (val === "tomorrow") d.setDate(d.getDate() + 1);
  currentDate.value = d;
  activeQuick.value = val;
  applyDate(d);
};

const shiftDay = (n) => {
  const d = new Date(currentDate.value);
  d.setDate(d.getDate() + n);
  currentDate.value = d;
  applyDate(d);
};

const toggleCalendar = () => {
  calendarInput.value?.showPicker?.();
  calendarInput.value?.click();
};

const onCalendarPick = () => {
  console.log("hello");

  if (!calendarValue.value) return;
  const [y, m, day] = calendarValue.value.split("-").map(Number);
  const d = new Date(y, m - 1, day);
  currentDate.value = d;
  applyDate(d);
};

const resetFilters = () => {
  filterStatus.value = "all";
  currentDate.value = new Date();
  selectQuick("today");
};

// ── Modal ──────────────────────────────────────────────────────────────────
const openAssignModal = (item) => {
  assignModalOpen.value = true;
  selectedItem.value = item;
};

const closeAssignDriverModal = async () => {
  assignModalOpen.value = false;
  selectedItem.value = null;
  await fetchData();
};

// ── Watch ──────────────────────────────────────────────────────────────────
watch(filterStatus, () => fetchData());

onMounted(() => selectQuick("today"));
</script>
