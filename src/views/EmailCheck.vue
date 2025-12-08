<template>
  <Layout :is_white="true">
    <!-- Header -->
    <div
      :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
      class="flex justify-start items-center transition-all duration-200 gap-2 text-sm pb-4 absolute top-6"
    >
      <p class="text-3xl font-medium text-[#FF613c]">
        Mail Management
        <span class="w-2 h-2 bg-[#FF613c] rounded-full inline-block"></span>
      </p>
    </div>

    <!-- Main Container -->
    <div class="relative">
      <!-- Table Section -->
      <div class="border shadow-sm rounded-lg p-4 transition-all duration-300">
        <!-- Tags Row -->
        <div class="flex justify-between items-center mb-3">
          <div class="flex justify-start items-center gap-3">
            <div
              @click="filterByType('prove_booking')"
              class="px-4 py-2 rounded-lg cursor-pointer transition-colors"
              :class="
                activeTag === 'prove_booking'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              "
            >
              <p class="text-xs font-medium">Prove Booking</p>
            </div>
            <div
              @click="filterByType('invoice')"
              class="px-4 py-2 rounded-lg cursor-pointer transition-colors"
              :class="
                activeTag === 'invoice'
                  ? 'bg-green-600 text-white'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              "
            >
              <p class="text-xs font-medium">Invoice</p>
            </div>
            <div
              @click="filterByType('expense')"
              class="px-4 py-2 rounded-lg cursor-pointer transition-colors"
              :class="
                activeTag === 'expense'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
              "
            >
              <p class="text-xs font-medium">Expense</p>
            </div>
          </div>
          <div class="text-xs text-gray-500">
            {{ groups?.data?.length || 0 }} items
          </div>
        </div>
        <!-- Filter and Tags Header -->
        <div class="space-y-4 pb-4">
          <!-- Filter Button and Search Row -->
          <div class="flex justify-start items-center gap-x-3 relative">
            <div
              @click="filterShow = !filterShow"
              class="bg-blue-600 px-2 rounded-lg shadow py-1 flex justify-center items-center gap-x-2 text-white text-xs cursor-pointer"
            >
              <FunnelIcon class="w-5 h-5 text-white" />
              <p>Filter</p>
            </div>

            <!-- Filter Dropdown -->
            <transition name="slide-down">
              <div
                v-if="filterShow"
                class="absolute top-full px-4 left-0 w-[300px] mt-2 transition-all duration-150 bg-white rounded-lg shadow-lg z-50 border border-gray-100 space-y-2 max-h-[50vh] overflow-y-scroll"
              >
                <div
                  class="flex justify-between items-center pt-4 border-b border-gray-100 pb-1 sticky top-0 bg-white"
                >
                  <p class="text-xs font-medium">Filter</p>
                  <p class="text-[10px] cursor-pointer" @click="clearFilter">
                    clear
                  </p>
                </div>

                <div>
                  <p class="text-[10px] pb-2">Date Range</p>
                  <input
                    type="date"
                    v-model="searchKey.startDate"
                    class="border border-gray-300 px-4 focus:outline-none w-full py-2 text-[10px] rounded-lg mb-2"
                    placeholder="Start Date"
                  />
                  <input
                    type="date"
                    v-model="searchKey.endDate"
                    class="border border-gray-300 px-4 focus:outline-none w-full py-2 text-[10px] rounded-lg"
                    placeholder="End Date"
                  />
                </div>

                <div
                  class="sticky bottom-0 w-full pb-4 pt-2 border-t border-gray-200 bg-white"
                >
                  <p
                    class="text-[12px] bg-[#FF613c] px-2 py-2 rounded-lg text-center text-white cursor-pointer"
                    @click="searchAction"
                  >
                    Search
                  </p>
                </div>
              </div>
            </transition>

            <!-- Search Input -->
            <div class="relative max-w-[300px] flex-1">
              <input
                type="search"
                v-model="searchKey.searchId"
                placeholder="Search by CRM ID"
                class="w-full px-4 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                @keyup.enter="searchAction"
              />
              <div
                @click="searchAction"
                class="absolute right-1 top-1 rounded-lg text-xs p-1 bg-[#FF613c] cursor-pointer"
              >
                <MagnifyingGlassIcon class="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          <!-- Active Filters -->
          <div
            v-if="hasActiveFilters"
            class="flex justify-start items-center overflow-x-scroll no-sidebar-container pt-0.5 space-x-3"
          >
            <p
              @click="clearFilter"
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap bg-red-500 text-white cursor-pointer"
            >
              clear all
            </p>

            <p
              v-if="searchKey.startDate || searchKey.endDate"
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap relative"
            >
              <XCircleIcon
                class="w-4 h-4 text-[#FF613c] cursor-pointer absolute -top-1 -right-2"
                @click="clearDateFilter"
              />
              Date: {{ searchKey.startDate }} - {{ searchKey.endDate }}
            </p>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto max-h-[65vh] overflow-y-scroll">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 sticky top-0">
              <tr class="border-b">
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500"
                >
                  CRM ID
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500"
                >
                  Product Name
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500"
                >
                  Customer
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500"
                >
                  Service Date
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500"
                >
                  Amount
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500"
                >
                  C.Status
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500"
                >
                  Mail Status
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="item in groups?.data ?? []"
                :key="item.id"
                @click="selectItem(item)"
                class="hover:bg-gray-50 cursor-pointer transition-colors"
                :class="{ 'bg-blue-50': selectedItem?.id === item.id }"
              >
                <td class="px-4 py-3 text-xs text-gray-900">
                  {{ item.booking_crm_id }}
                </td>
                <td class="px-4 py-3 text-xs text-gray-900">
                  {{ item.product_name }}
                </td>
                <td class="px-4 py-3 text-xs text-gray-600">
                  {{ item.customer_name }}
                </td>
                <td class="px-4 py-3 text-xs text-gray-600">
                  {{ item.firstest_service_date }}
                  <span
                    v-if="
                      item.latest_service_date !== item.firstest_service_date
                    "
                  >
                    - {{ item.latest_service_date }}
                  </span>
                </td>
                <td class="px-4 py-3 text-xs text-gray-900">
                  {{ formatCurrency(item.total_amount) }}
                </td>
                <td class="px-4 py-3">
                  <span
                    class="px-2 py-1 rounded-full text-[10px] font-medium"
                    :class="getPaymentStatusClass(item.customer_payment_status)"
                  >
                    {{ formatPaymentStatus(item.customer_payment_status) }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span
                    class="px-2 py-1 rounded-full text-[10px] font-medium"
                    :class="getStatusClass(item.booking_request_proof)"
                  >
                    {{ item.booking_request_proof ? "Sent" : "Not Sent" }}
                  </span>
                </td>
              </tr>
              <tr v-if="loading">
                <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
              <tr
                v-if="!loading && (!groups?.data || groups.data.length === 0)"
              >
                <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                  No data found
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          v-if="groups?.meta"
          class="flex justify-between items-center pt-4 border-t"
        >
          <div class="text-xs text-gray-500">
            Showing {{ groups.meta.from }} to {{ groups.meta.to }} of
            {{ groups.meta.total }} entries
          </div>
          <div class="flex gap-2">
            <button
              @click="changePage(groups.meta.current_page - 1)"
              :disabled="groups.meta.current_page === 1"
              class="px-3 py-1 text-xs border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              @click="changePage(groups.meta.current_page + 1)"
              :disabled="groups.meta.current_page === groups.meta.last_page"
              class="px-3 py-1 text-xs border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Detail Panel - Overlays on Right Side -->
      <transition name="slide-right">
        <div
          v-if="showDetail"
          class="fixed right-0 top-0 h-screen w-1/2 border-l overflow-hidden shadow-2xl bg-white z-50"
        >
          <!-- Close Button -->
          <div
            class="sticky top-0 bg-white z-10 p-4 border-b flex items-center justify-between"
          >
            <h3 class="text-lg font-medium text-gray-900">Booking Details</h3>
            <button
              @click="closeDetail"
              class="text-gray-400 hover:text-gray-600"
            >
              <XCircleIcon class="w-6 h-6" />
            </button>
          </div>

          <!-- Detail Content -->
          <div class="p-6 overflow-y-scroll h-[calc(100vh-80px)]">
            <div v-if="selectedItem">
              <!-- Booking Header -->
              <div class="border-b pb-4 mb-4">
                <div class="flex items-center gap-2 mb-3">
                  <span
                    class="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {{ selectedItem.product_type }}
                  </span>
                  <span
                    class="px-3 py-1 rounded-full text-xs font-medium"
                    :class="
                      getPaymentStatusClass(
                        selectedItem.customer_payment_status
                      )
                    "
                  >
                    {{
                      formatPaymentStatus(selectedItem.customer_payment_status)
                    }}
                  </span>
                </div>
                <h2 class="text-xl font-semibold text-gray-900 mb-2">
                  {{ selectedItem.product_name }}
                </h2>
                <div class="space-y-1 text-sm text-gray-600">
                  <p>
                    <span class="font-medium">CRM ID:</span>
                    {{ selectedItem.booking_crm_id }}
                  </p>
                  <p>
                    <span class="font-medium">Customer:</span>
                    {{ selectedItem.customer_name }}
                  </p>
                  <p>
                    <span class="font-medium">Service Date:</span>
                    {{ selectedItem.firstest_service_date }}
                    <span
                      v-if="
                        selectedItem.latest_service_date !==
                        selectedItem.firstest_service_date
                      "
                    >
                      - {{ selectedItem.latest_service_date }}
                    </span>
                  </p>
                </div>
              </div>

              <!-- Financial Details -->
              <div class="mb-6">
                <h3 class="text-lg font-medium text-gray-900 mb-3">
                  Financial Details
                </h3>
                <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-medium text-gray-600"
                      >Total Amount</span
                    >
                    <span class="text-sm font-bold text-gray-900">{{
                      formatCurrency(selectedItem.total_amount)
                    }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-medium text-gray-600"
                      >Cost Price</span
                    >
                    <span class="text-sm text-gray-900">{{
                      formatCurrency(selectedItem.total_cost_price)
                    }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-medium text-gray-600"
                      >Expense Amount</span
                    >
                    <span class="text-sm text-gray-900">{{
                      formatCurrency(selectedItem.expense_amount)
                    }}</span>
                  </div>
                  <div class="flex justify-between items-center pt-2 border-t">
                    <span class="text-sm font-medium text-gray-600"
                      >Expense Status</span
                    >
                    <span
                      class="px-2 py-1 rounded-full text-xs font-medium"
                      :class="
                        getPaymentStatusClass(selectedItem.expense_status)
                      "
                    >
                      {{ formatPaymentStatus(selectedItem.expense_status) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Document Status -->
              <div class="mb-6">
                <h3 class="text-lg font-medium text-gray-900 mb-3">
                  Document Status
                </h3>
                <div class="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600"
                      >Booking Confirm Letter</span
                    >
                    <span
                      class="px-2 py-1 rounded-full text-xs font-medium"
                      :class="
                        selectedItem.has_booking_confirm_letter
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      "
                    >
                      {{
                        selectedItem.has_booking_confirm_letter
                          ? "Available"
                          : "Not Available"
                      }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Confirm Letter</span>
                    <span
                      class="px-2 py-1 rounded-full text-xs font-medium"
                      :class="
                        selectedItem.has_confirm_letter
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      "
                    >
                      {{
                        selectedItem.has_confirm_letter
                          ? "Available"
                          : "Not Available"
                      }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Passport</span>
                    <span
                      class="px-2 py-1 rounded-full text-xs font-medium"
                      :class="
                        selectedItem.has_passport
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      "
                    >
                      {{
                        selectedItem.has_passport
                          ? "Available"
                          : "Not Available"
                      }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Tax Receipt</span>
                    <span
                      class="px-2 py-1 rounded-full text-xs font-medium"
                      :class="
                        selectedItem.have_tax_receipt
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      "
                    >
                      {{
                        selectedItem.have_tax_receipt
                          ? "Available"
                          : "Not Available"
                      }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Booking Items -->
              <div v-if="selectedItem.items?.length" class="mb-6">
                <h3 class="text-lg font-medium text-gray-900 mb-3">
                  Booking Items ({{ selectedItem.items.length }})
                </h3>
                <div class="space-y-2">
                  <div
                    v-for="item in selectedItem.items"
                    :key="item.id"
                    class="p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div class="flex justify-between items-start mb-2">
                      <div>
                        <p class="text-sm font-medium text-gray-900">
                          {{ item.product_name }}
                        </p>
                        <p class="text-xs text-gray-500">
                          {{ item.variant_name }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-3 sticky bottom-0 bg-white pt-4">
                <button
                  class="flex-1 bg-[#FF613c] text-white px-4 py-2 rounded-lg hover:bg-[#e5552f] transition-colors text-sm"
                >
                  Send Email
                </button>
                <button
                  class="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import Layout from "./Layout.vue";
import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/vue/24/outline";
import { XCircleIcon } from "@heroicons/vue/24/solid";
import { useSidebarStore } from "../stores/sidebar";
import { useGroupStore } from "../stores/group";

const sidebarStore = useSidebarStore();
const { isShowSidebar } = storeToRefs(sidebarStore);

const groupStore = useGroupStore();
const { groups, loading } = storeToRefs(groupStore);

// State
const showDetail = ref(false);
const selectedItem = ref(null);
const activeTag = ref("");
const filterShow = ref(false);
const currentPage = ref(1);

const searchKey = ref({
  searchId: "",
  startDate: "",
  endDate: "",
  sent_booking_request: null,
  booking_request_proof: null,
  sent_expense_mail: null,
  expense_mail_proof: null,
  invoice_status: null,
});

// Computed
const watchSystem = computed(() => {
  let result = {};

  if (searchKey.value.searchId) {
    result.crm_id = searchKey.value.searchId;
  }

  if (searchKey.value.startDate && searchKey.value.endDate) {
    result.booking_daterange = `${searchKey.value.startDate},${searchKey.value.endDate}`;
  } else {
    let today = new Date();
    let nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 3);
    result.booking_daterange = `${today.toISOString().split("T")[0]},${
      nextMonth.toISOString().split("T")[0]
    }`;
  }

  result.product_type = "hotel";

  // Tag-based filters
  if (searchKey.value.sent_booking_request !== null) {
    result.sent_booking_request = searchKey.value.sent_booking_request;
  }
  if (searchKey.value.booking_request_proof !== null) {
    result.booking_request_proof = searchKey.value.booking_request_proof;
  }
  if (searchKey.value.sent_expense_mail !== null) {
    result.sent_expense_mail = searchKey.value.sent_expense_mail;
  }
  if (searchKey.value.expense_mail_proof !== null) {
    result.expense_mail_proof = searchKey.value.expense_mail_proof;
  }
  if (searchKey.value.invoice_status !== null) {
    result.invoice_status = searchKey.value.invoice_status;
  }

  result.page = currentPage.value;
  result.per_page = 10;

  return result;
});

const hasActiveFilters = computed(() => {
  return (
    searchKey.value.searchId ||
    searchKey.value.startDate ||
    searchKey.value.endDate
  );
});

// Methods
const filterByType = (type) => {
  if (activeTag.value === type) {
    // Clear the tag
    activeTag.value = "";
    clearTagFilters();
  } else {
    // Set new tag
    activeTag.value = type;
    clearTagFilters();

    if (type === "prove_booking") {
      // Prove Booking: sent_booking_request = false AND booking_request_proof = 'not_proved'
      searchKey.value.sent_booking_request = 0;
      searchKey.value.booking_request_proof = "not_proved";
    } else if (type === "invoice") {
      // Invoice: invoice_status = 'not_receive' (no booking_confirm_letter)
      searchKey.value.invoice_status = "not_receive";
    } else if (type === "expense") {
      // Expense: sent_expense_mail = false AND expense_mail_proof = 'not_proved'
      searchKey.value.sent_expense_mail = 0;
      searchKey.value.expense_mail_proof = "not_proved";
    }
  }

  searchAction();
};

const clearTagFilters = () => {
  searchKey.value.sent_booking_request = null;
  searchKey.value.booking_request_proof = null;
  searchKey.value.sent_expense_mail = null;
  searchKey.value.expense_mail_proof = null;
  searchKey.value.invoice_status = null;
};

const clearTagFilter = () => {
  activeTag.value = "";
  clearTagFilters();
  searchAction();
};

const clearDateFilter = () => {
  searchKey.value.startDate = "";
  searchKey.value.endDate = "";
  searchAction();
};

const selectItem = (item) => {
  selectedItem.value = item;
  showDetail.value = true;
};

const closeDetail = () => {
  showDetail.value = false;
  selectedItem.value = null;
};

const searchAction = async () => {
  filterShow.value = false;
  currentPage.value = 1;
  await groupStore.getListAction(watchSystem.value);
};

const changePage = (page) => {
  if (page >= 1 && page <= (groups.value?.meta?.last_page || 1)) {
    currentPage.value = page;
  }
};

const clearFilter = () => {
  searchKey.value = {
    searchId: "",
    startDate: "",
    endDate: "",
    sent_booking_request: null,
    booking_request_proof: null,
    sent_expense_mail: null,
    expense_mail_proof: null,
    invoice_status: null,
  };
  activeTag.value = "";
  filterShow.value = false;
  searchAction();
};

const getPaymentStatusClass = (status) => {
  const classes = {
    paid: "bg-green-100 text-green-800",
    not_paid: "bg-red-100 text-red-800",
    partial: "bg-yellow-100 text-yellow-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

const getStatusClass = (status) => {
  const classes = {
    1: "bg-green-100 text-green-800",
    0: "bg-red-100 text-red-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

const formatPaymentStatus = (status) => {
  const statuses = {
    paid: "Paid",
    not_paid: "Not Paid",
    partial: "Partial",
  };
  return statuses[status] || status;
};

const formatMailType = (type) => {
  const types = {
    prove_booking: "Prove Booking",
    invoice: "Invoice",
    expense: "Expense",
  };
  return types[type] || type;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
  }).format(amount);
};

// Watch for page changes
watch(currentPage, () => {
  groupStore.getListAction(watchSystem.value);
});

// API call
const fetchData = async () => {
  try {
    await groupStore.getListAction(watchSystem.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-right-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.no-sidebar-container::-webkit-scrollbar {
  display: none;
}

.no-sidebar-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
