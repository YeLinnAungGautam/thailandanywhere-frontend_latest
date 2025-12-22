<template>
  <Layout :is_white="true">
    <!-- Header -->
    <div
      :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
      class="flex justify-start items-center transition-all duration-200 gap-2 text-sm pb-4 absolute top-6"
    >
      <p class="text-2xl md:text-3xl font-medium text-[#FF613c]">
        Expense Management
        <span class="w-2 h-2 bg-[#FF613c] rounded-full inline-block"></span>
      </p>
    </div>

    <!-- Main Content -->
    <div class="bg-white/60 w-full rounded-lg shadow-sm">
      <!-- Filters -->
      <div
        class="p-3 md:p-4 border-b border-gray-200 sticky bg-white -top-6 z-20"
      >
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <!-- Search Input -->
            <div class="relative min-w-[200px] max-w-[400px]">
              <input
                type="search"
                v-model="searchKey"
                placeholder="Search by CRM ID"
                class="w-full px-4 py-3 rounded-full shadow border border-gray-100 focus:outline-none text-xs"
                @keyup.enter="searchAction"
              />
              <div
                @click="searchAction"
                class="absolute right-2 top-2 rounded-full text-xs p-1 bg-[#FF613c] cursor-pointer"
              >
                <MagnifyingGlassIcon class="w-4 h-4 text-white" />
              </div>
            </div>

            <!-- Filter Button -->
            <button
              @click="filterShow = !filterShow"
              class="bg-[#FF613c] px-4 rounded-full shadow py-2.5 flex justify-center items-center gap-x-2 text-white text-xs cursor-pointer"
            >
              <FunnelIcon class="w-5 h-5 text-white" />
              <p>Filter</p>
            </button>
          </div>

          <div class="flex items-center gap-2">
            <!-- Customer Status Dropdown -->
            <div class="relative">
              <select
                v-model="paymentStatus"
                @change="searchAction"
                class="appearance-none bg-[#FF613c] text-white text-xs px-4 py-3 pr-8 rounded-full shadow cursor-pointer focus:outline-none"
              >
                <option value="all">Customer Status</option>
                <option value="not_paid">Customer Not Paid</option>
                <option value="partially_paid">Customer Partially Paid</option>
                <option value="fully_paid">Customer Fully Paid</option>
              </select>
              <svg
                class="w-4 h-4 text-white absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            <!-- Expense Status Dropdown -->
            <div class="relative">
              <select
                v-model="statusFilter"
                @change="searchAction"
                class="appearance-none bg-[#FF613c] text-white text-xs px-4 py-3 pr-8 rounded-full shadow cursor-pointer focus:outline-none"
              >
                <option value="all">Expense Status</option>
                <option value="not_paid">Expense Not Paid</option>
                <option value="partially_paid">Expense Partially Paid</option>
                <option value="fully_paid">Expense Fully Paid</option>
              </select>
              <svg
                class="w-4 h-4 text-white absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            <!-- Refresh Button -->
            <button
              @click="searchAction"
              class="flex items-center gap-2 px-4 py-2.5 text-xs text-white bg-[#FF613c] rounded-full cursor-pointer hover:bg-[#e55139] transition-colors"
            >
              <svg
                class="w-5 h-5"
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
              Refresh
            </button>
          </div>
        </div>

        <!-- Filter Dropdown -->
        <transition name="slide-down">
          <div
            v-if="filterShow"
            class="mt-3 px-4 py-3 bg-white rounded-lg shadow-lg border border-gray-100 space-y-3"
          >
            <div class="grid grid-cols-2 gap-3">
              <div>
                <p class="text-xs font-medium mb-2">Start Date</p>
                <input
                  type="date"
                  v-model="startDate"
                  class="border border-gray-300 px-4 focus:outline-none w-full py-2 text-xs rounded-lg"
                />
              </div>
              <div>
                <p class="text-xs font-medium mb-2">End Date</p>
                <input
                  type="date"
                  v-model="endDate"
                  class="border border-gray-300 px-4 focus:outline-none w-full py-2 text-xs rounded-lg"
                />
              </div>
            </div>
            <div class="flex items-center gap-2 pt-2">
              <button
                @click="clearFilter"
                class="flex-1 text-xs bg-gray-100 px-2 py-2 rounded-lg text-center text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors"
              >
                Clear
              </button>
              <button
                @click="searchAction"
                class="flex-1 text-xs bg-[#FF613c] px-2 py-2 rounded-lg text-center text-white cursor-pointer hover:bg-[#e55139] transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </transition>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto relative">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <!-- <th
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 w-8"
              ></th> -->
              <th
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
              >
                CRM ID
              </th>
              <th
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700"
              >
                Expense Status
              </th>
              <th
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
              >
                Booking Date
              </th>
              <th
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700"
              >
                Hotel Name
              </th>
              <th
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
              >
                Customer Status
              </th>
              <th
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700"
              >
                Deadline
              </th>
              <th
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700"
              >
                Agent
              </th>
              <th
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
              >
                Sale Amount
              </th>
              <th
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
              >
                Expense Amount
              </th>
              <th
                class="px-2 md:px-4 py-3 text-right text-xs font-semibold text-gray-700"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody v-if="!loading" class="divide-y divide-gray-200">
            <template v-for="item in groups?.data || []" :key="item.id">
              <!-- Main row -->
              <tr
                class="hover:bg-gray-50 transition-colors"
                @click="toggleRow(item.id)"
              >
                <!-- CRM ID -->
                <td class="px-2 md:px-4 py-4">
                  <button
                    @click="openInfoDrawer(item)"
                    class="text-sm font-medium whitespace-nowrap text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {{ item.booking_crm_id }}
                  </button>
                </td>

                <!-- Expense Status -->
                <td class="px-2 md:px-4 py-4">
                  <span
                    class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                    :class="getExpenseStatusClass(item.expense_status)"
                  >
                    {{ formatExpenseStatus(item.expense_status) }}
                  </span>
                </td>

                <!-- Booking Date -->
                <td class="px-2 md:px-4 py-4">
                  <div class="text-sm text-gray-700">
                    <div>{{ formatDate(item.firstest_service_date) }}</div>
                    <div class="text-xs text-gray-500 whitespace-nowrap">
                      to {{ formatDate(item.latest_service_date) }}
                    </div>
                  </div>
                </td>

                <!-- Hotel Name -->
                <td class="px-2 md:px-4 py-4">
                  <div class="text-sm text-gray-900 max-w-[150px] truncate">
                    {{ item.product_name }}
                  </div>
                </td>

                <!-- Customer Payment Status -->
                <td class="px-2 md:px-4 py-4">
                  <span
                    class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                    :class="getPaymentStatusClass(item.customer_payment_status)"
                  >
                    {{ formatPaymentStatus(item.customer_payment_status) }}
                  </span>
                </td>

                <!-- Deadline -->
                <td class="px-2 md:px-4 py-4">
                  <div class="text-sm text-gray-900 whitespace-nowrap">
                    {{ getDeadlineDate(item.firstest_service_date) }}
                  </div>
                </td>

                <!-- Agent -->
                <td class="px-2 md:px-4 py-4">
                  <div class="text-sm text-gray-900 max-w-[120px] truncate">
                    {{ item.booking_crm_id.split("-")[0] }}
                  </div>
                </td>

                <!-- Sale Amount -->
                <td class="px-2 md:px-4 py-4 text-sm font-medium text-gray-900">
                  {{ formatCurrency(item.total_amount) }}
                </td>

                <!-- Expense Amount -->
                <td class="px-2 md:px-4 py-4 text-sm font-medium text-gray-900">
                  {{ formatCurrency(item.total_cost_price) }}
                </td>

                <!-- Actions -->
                <td class="px-2 md:px-4 py-4">
                  <div class="flex items-center justify-end gap-1">
                    <button
                      @click="openPayDrawer(item)"
                      class="px-3 py-2 text-xs text-white bg-green-600 rounded-lg transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95"
                    >
                      Pay
                    </button>
                    <button
                      @click="copyExpense(item)"
                      class="p-1.5 bg-orange-100 text-orange-600 rounded-lg transition-all duration-200 hover:bg-orange-200 hover:shadow-md active:scale-95"
                      title="Copy"
                    >
                      <DocumentDuplicateIcon class="w-5 h-5" />
                    </button>
                    <button
                      @click="openInfoDrawer(item)"
                      class="p-1.5 bg-blue-100 text-blue-600 rounded-lg transition-all duration-200 hover:bg-blue-200 hover:shadow-md active:scale-95"
                      title="View Details"
                    >
                      <InformationCircleIcon class="w-5 h-5" />
                    </button>
                    <button
                      class="p-1.5 bg-orange-100 text-orange-600 rounded-lg transition-all duration-200 hover:bg-orange-200 hover:shadow-md active:scale-95"
                      title="View Details"
                    >
                      <ChatBubbleBottomCenterIcon class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Expandable Room Details Row -->
              <tr v-show="expandedRows.includes(item.id)">
                <td colspan="11" class="px-2 md:px-4 py-0">
                  <div class="bg-gray-50 rounded-lg p-4 mb-2">
                    <div
                      class="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      Room Details
                    </div>
                    <div
                      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
                    >
                      <div
                        v-for="(roomItem, index) in item.items"
                        :key="index"
                        class="bg-white rounded-lg p-3 border border-gray-200 hover:border-[#FF613c] transition-colors"
                      >
                        <div class="flex items-start justify-between gap-2">
                          <div class="flex-1">
                            <p class="text-sm font-medium text-gray-900 mb-1">
                              {{ roomItem.variant_name }}
                            </p>
                            <div
                              class="flex items-center gap-1 text-xs text-gray-500"
                            >
                              <svg
                                class="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                />
                              </svg>
                              <span>Quantity: {{ roomItem.quantity }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="flex flex-col items-center gap-3">
            <div
              class="w-8 h-8 border-4 border-gray-200 border-t-[#ff613c] rounded-full animate-spin"
            ></div>
            <p class="text-xs text-gray-500">Loading...</p>
          </div>
        </div>

        <!-- Empty -->
        <div
          v-if="(!loading && !groups?.data) || groups?.data.length === 0"
          class="flex flex-col items-center justify-center py-12"
        >
          <BuildingOfficeIcon class="w-12 h-12 text-gray-300 mb-2" />
          <p class="text-sm text-gray-500">No expense records found</p>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="!loading && groups?.data && groups?.data.length > 0"
        class="px-3 md:px-4 py-3 border-t border-gray-200"
      >
        <Pagination v-if="!loading" :data="groups" @change-page="changePage" />
      </div>
    </div>

    <!-- Enhanced Info Drawer with Full Details -->
    <Teleport to="body">
      <div
        v-if="infoDrawerOpen"
        class="fixed inset-0 z-50 overflow-hidden"
        @click.self="closeInfoDrawer"
      >
        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
          @click="closeInfoDrawer"
        ></div>

        <!-- Drawer -->
        <div
          class="absolute right-0 top-0 h-full w-full sm:w-[600px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto"
          :class="infoDrawerOpen ? 'translate-x-0' : 'translate-x-full'"
        >
          <div class="p-6">
            <!-- Header -->
            <div
              class="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b z-10"
            >
              <h3
                class="text-xl font-semibold text-gray-900 flex items-center gap-2"
              >
                <InformationCircleIcon class="w-6 h-6 text-[#FF613c]" />
                Expense Details
              </h3>
              <button
                @click="closeInfoDrawer"
                class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon class="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <!-- Content -->
            <div v-if="detailData" class="space-y-6"></div>
          </div>
        </div>
      </div>
    </Teleport>
    <!-- Payment Drawer -->
    <!-- <Modal :isOpen="payDrawerOpen" @closeModal="closePayDrawer">
      <DialogPanel
        class="w-full max-w-4xl p-4 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl"
      >
        <DialogTitle
          as="h3"
          class="mb-5 text-lg font-medium leading-6 text-gray-900"
        >
          Change Payment
        </DialogTitle>
        <div>helo</div>
      </DialogPanel>
    </Modal> -->
    <!-- Change Status Modal -->
    <Modal :isOpen="payDrawerOpen" @closeModal="closePayDrawer">
      <DialogPanel
        class="w-full max-w-xl transform rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
        >
          <AdjustmentsHorizontalIcon class="w-6 h-6 text-[#FF613c]" />
          Change Status
        </DialogTitle>

        <!-- <Payment
          :paymentData="paymentData"
          @closeModal="closePayDrawer"
          @updatePayment="updatePayment"
        /> -->
        <div class="space-y-4">
          <!-- Status Options -->
          <div class="space-y-2">
            <button
              class="w-full flex items-center justify-between px-4 py-3 border-2 border-red-200 rounded-lg hover:bg-red-50 transition-all duration-200 group"
            >
              <div class="flex items-center gap-3">
                <div
                  class="p-2 bg-red-100 rounded-full group-hover:bg-red-200 transition-colors"
                >
                  <ExclamationTriangleIcon class="w-5 h-5 text-red-600" />
                </div>
                <div class="text-left">
                  <p class="text-sm font-medium text-gray-900">Not Paid</p>
                  <p class="text-xs text-gray-500">Awaiting</p>
                </div>
              </div>
              <!-- <CheckIcon class="w-5 h-5 text-red-600" /> -->
            </button>
            <button
              class="w-full flex items-center justify-between px-4 py-3 border-2 border-orange-200 rounded-lg hover:bg-orange-50 transition-all duration-200 group"
            >
              <div class="flex items-center gap-3">
                <div
                  class="p-2 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors"
                >
                  <WalletIcon class="w-5 h-5 text-orange-600" />
                </div>
                <div class="text-left">
                  <p class="text-sm font-medium text-gray-900">
                    Partially Paid
                  </p>
                  <p class="text-xs text-gray-500">payment isn't complete</p>
                </div>
              </div>
              <!-- <CheckIcon class="w-5 h-5 text-orange-600" /> -->
            </button>
            <button
              class="w-full flex items-center justify-between px-4 py-3 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-all duration-200 group"
            >
              <div class="flex items-center gap-3">
                <div
                  class="p-2 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors"
                >
                  <CheckIcon class="w-5 h-5 text-green-600" />
                </div>
                <div class="text-left">
                  <p class="text-sm font-medium text-gray-900">Fully Paid</p>
                  <p class="text-xs text-gray-500">payment is complete</p>
                </div>
              </div>
              <!-- <CheckIcon class="w-5 h-5 text-green-600" /> -->
            </button>
          </div>

          <!-- Cancel Button -->
          <div class="pt-4 border-t border-gray-200">
            <button
              @click="closePayDrawer"
              class="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogPanel>
    </Modal>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import Layout from "./Layout.vue";
import { useSidebarStore } from "../stores/sidebar";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import {
  FunnelIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CheckIcon,
  MinusIcon,
  PlusCircleIcon,
  XCircleIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  AdjustmentsHorizontalIcon,
  ExclamationTriangleIcon,
  ChatBubbleBottomCenterIcon,
  WalletIcon,
} from "@heroicons/vue/24/outline";
import { DocumentDuplicateIcon } from "@heroicons/vue/24/solid";
import { useToast } from "vue-toastification";
import { useGroupStore } from "../stores/group";
import Pagination from "../components/Pagination.vue";
import Payment from "./GroupComponent/ExpensePart/Payment.vue";
import Modal from "../components/Modal.vue";

const toast = useToast();
const sidebarStore = useSidebarStore();
const { isShowSidebar } = storeToRefs(sidebarStore);
const groupStore = useGroupStore();
const { groups } = storeToRefs(groupStore);

// State
const loading = ref(false);
const searchKey = ref("");
const statusFilter = ref("all");
const filterShow = ref(false);
const startDate = ref("");
const endDate = ref("");
const infoDrawerOpen = ref(false);
const payDrawerOpen = ref(false);
const selectedItem = ref(null);
const detailData = ref(null);
const paymentStep = ref(1);
const paymentAmount = ref("");
const paymentStatus = ref("all");
const paymentStatusNew = ref("");
const paymentSlip = ref(null);
const paymentSlipPreview = ref("");
const fileInput = ref(null);
const sorting_type = ref("service_date");
const sorting = ref("asc");
const expandedRows = ref([]);

const watchSystem = computed(() => {
  let result = {};

  if (searchKey.value) {
    result.crm_id = searchKey.value;
  }
  if (statusFilter.value && statusFilter.value !== "all") {
    result.expense_item_status = statusFilter.value;
  }
  if (paymentStatus.value != "all") {
    result.payment_status = paymentStatus.value;
  }
  if (startDate.value && endDate.value) {
    result.booking_daterange = startDate.value + "," + endDate.value;
  }

  if (sorting_type.value) {
    result.sorting_type = sorting_type.value;
  }

  result.sorting = sorting.value;
  result.product_type = "hotel";
  result.per_page = 10;

  return result;
});

const getListAction = async () => {
  loading.value = true;
  await groupStore.getListAction(watchSystem.value);
  loading.value = false;
};

const getDetailAction = async (id) => {
  try {
    const res = await groupStore.detailAction(id);
    detailData.value = res.result;
    return res.result;
  } catch (error) {
    console.error("Error fetching detail:", error);
    toast.error("Failed to load details");
  }
};

// Toggle row expansion
const toggleRow = (itemId) => {
  const index = expandedRows.value.indexOf(itemId);
  if (index > -1) {
    expandedRows.value.splice(index, 1);
  } else {
    expandedRows.value.push(itemId);
  }
};

// Methods
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const monthNames = [
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
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
  }).format(amount);
};

const calculateMargin = (sale, cost) => {
  if (sale === 0) return 0;
  return ((sale - cost) / sale) * 100;
};

const getDeadlineDate = (serviceDateStr) => {
  const serviceDate = new Date(serviceDateStr);
  const deadline = new Date(serviceDate);
  deadline.setDate(deadline.getDate() - 1);
  return deadline.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getExpenseStatusClass = (status) => {
  const classes = {
    not_paid: "bg-red-100 text-red-800",
    partially_paid: "bg-yellow-100 text-yellow-800",
    fully_paid: "bg-green-100 text-green-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

const formatExpenseStatus = (status) => {
  const statuses = {
    not_paid: "Not Paid",
    partially_paid: "Partially Paid",
    fully_paid: "Fully Paid",
  };
  return statuses[status] || status;
};

const getPaymentStatusClass = (status) => {
  const classes = {
    fully_paid: "bg-green-100 text-green-800",
    not_paid: "bg-red-100 text-red-800",
    partially_paid: "bg-yellow-100 text-yellow-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

const formatPaymentStatus = (status) => {
  const statuses = {
    fully_paid: "Paid",
    not_paid: "Not Paid",
    partially_paid: "Partial",
  };
  return statuses[status] || status;
};

const getPaymentPercentage = (status) => {
  const percentages = {
    fully_paid: 100,
    partially_paid: 50,
    not_paid: 0,
  };
  return percentages[status] || 0;
};

const searchAction = async () => {
  filterShow.value = false;
  await getListAction();
};

const clearFilter = () => {
  startDate.value = "";
  endDate.value = "";
  searchKey.value = "";
  statusFilter.value = "all";
  filterShow.value = false;
};

const copyExpense = (item) => {
  const text = `
CRM ID: ${item.booking_crm_id}
Hotel: ${item.product_name}
Check-in: ${formatDate(item.firstest_service_date)}
Check-out: ${formatDate(item.latest_service_date)}
Sale Amount: ${formatCurrency(item.total_amount)}
Expense Amount: ${formatCurrency(item.total_cost_price)}
Profit: ${formatCurrency(item.total_amount - item.total_cost_price)}
  `;
  navigator.clipboard.writeText(text);
  toast.success("Copied to clipboard!");
};

const openInfoDrawer = async (item) => {
  selectedItem.value = item;
  infoDrawerOpen.value = true;
  await getDetailAction(item.id);
};

const closeInfoDrawer = () => {
  infoDrawerOpen.value = false;
  selectedItem.value = null;
  detailData.value = null;
};

const openPayDrawer = async (item) => {
  selectedItem.value = item;
  payDrawerOpen.value = true;
  await getDetailAction(item.id);
};

const closePayDrawer = () => {
  payDrawerOpen.value = false;
  selectedItem.value = null;
  paymentStep.value = 1;
  paymentAmount.value = "";
  paymentStatusNew.value = "";
  paymentSlip.value = null;
  paymentSlipPreview.value = "";
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    paymentSlip.value = file;
    paymentSlipPreview.value = URL.createObjectURL(file);
  }
};

const removePaymentSlip = () => {
  paymentSlip.value = null;
  paymentSlipPreview.value = "";
};

const submitPayment = async () => {
  // TODO: Implement actual payment submission logic
  toast.success("Payment submitted successfully!");
  closePayDrawer();

  // Refresh the data
  await getListAction();

  // If detail drawer is open, refresh its data too
  if (infoDrawerOpen.value && selectedItem.value) {
    await getDetailAction(selectedItem.value.id);
  }
};

const setStartAndEndDate = () => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);
  end.setDate(start.getDate() + 90);

  startDate.value = start.toISOString().split("T")[0];
  endDate.value = end.toISOString().split("T")[0];
};

const changePage = async (url) => {
  await groupStore.getChangePage(url, watchSystem.value);
};

onMounted(async () => {
  setStartAndEndDate();
  await getListAction();
});
</script>

<style scoped>
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

.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f9fafb;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f9fafb;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}
</style>
