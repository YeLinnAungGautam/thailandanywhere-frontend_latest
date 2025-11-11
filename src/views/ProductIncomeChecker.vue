<script setup>
import { storeToRefs } from "pinia";
import { useSidebarStore } from "../stores/sidebar";
import Layout from "./Layout.vue";
import { computed, onMounted, ref, watch } from "vue";
import Pagination from "../components/Pagination.vue";
import { useToast } from "vue-toastification";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";
import debounce from "lodash/debounce";
import Swal from "sweetalert2";
import YearPickerVue from "./AccountingComponent/yearPicker.vue";
import { useRoute } from "vue-router";
import router from "../router";
import { formattedNumber } from "./help/FormatData";
import { useCashImageStore } from "../stores/cashImage";

const sideBarStore = useSidebarStore();
const toast = useToast();
const { isShowSidebar } = storeToRefs(sideBarStore);
const route = useRoute();
const cashImageStore = useCashImageStore();

// Response data
const profitData = ref(null);
const loading = ref(false);

const product_type = ref("App\\Models\\Hotel");
const interact_bank = ref("company");

// Tabs for payment status
const activeTab = ref("income"); // income, payable, others

// Set current year and month
const currentDate = new Date();
const year = ref(currentDate.getFullYear());
const selectedMonth = ref(currentDate.getMonth() + 1);

const monthArray = [
  { id: 1, name: "January" },
  { id: 2, name: "February" },
  { id: 3, name: "March" },
  { id: 4, name: "April" },
  { id: 5, name: "May" },
  { id: 6, name: "June" },
  { id: 7, name: "July" },
  { id: 8, name: "August" },
  { id: 9, name: "September" },
  { id: 10, name: "October" },
  { id: 11, name: "November" },
  { id: 12, name: "December" },
];

const interactBankOptions = [
  { value: "company", label: "Company" },
  { value: "personal", label: "Personal" },
  { value: "cash_at_office", label: "Cash at Office" },
  { value: "to_money_changer", label: "To Money Changer" },
  { value: "deposit_management", label: "Deposit Management" },
  { value: "pay_to_driver", label: "Pay to Driver" },
];

// Computed property to get payment status based on active tab
const getPaymentStatusFilter = computed(() => {
  switch (activeTab.value) {
    case "income":
      return {
        booking_payment_status: "fully_paid",
        booking_item_payment_status: "fully_paid",
      };
    case "payable":
      return {
        booking_payment_status: "fully_paid",
        booking_item_payment_status: "not_paid", // or 'partially_paid'
      };
    case "others":
      return {
        booking_payment_status: "not_paid",
        booking_item_payment_status: "not_paid",
      };
    default:
      return {
        booking_payment_status: "fully_paid",
        booking_item_payment_status: "fully_paid",
      };
  }
});

// Filter booking items based on active tab
const filteredBookingItems = computed(() => {
  if (!profitData.value?.data?.booking_items) {
    return [];
  }

  return profitData.value.data.booking_items.filter((item) => {
    const bookingStatus = item.booking_payment_status;
    const itemStatus = item.payment_status;

    switch (activeTab.value) {
      case "income":
        return bookingStatus === "fully_paid" && itemStatus === "fully_paid";
      case "payable":
        return bookingStatus === "fully_paid" && itemStatus !== "fully_paid";
      case "others":
        return bookingStatus !== "fully_paid" && itemStatus !== "fully_paid";
      default:
        return true;
    }
  });
});

// Calculate summary for filtered items
const filteredSummary = computed(() => {
  const items = filteredBookingItems.value;

  if (items.length === 0) {
    return {
      total_items: 0,
      total_amount: 0,
      total_cost: 0,
      total_profit: 0,
      average_margin: 0,
    };
  }

  const totalAmount = items.reduce(
    (sum, item) => sum + parseFloat(item.amount || 0),
    0
  );
  const totalCost = items.reduce(
    (sum, item) => sum + parseFloat(item.total_cost_price || 0),
    0
  );
  const totalProfit = totalAmount - totalCost;
  const averageMargin = totalAmount > 0 ? totalProfit / totalAmount : 0;

  return {
    total_items: items.length,
    total_amount: totalAmount,
    total_cost: totalCost,
    total_profit: totalProfit,
    average_margin: averageMargin,
  };
});

const profitAction = async () => {
  loading.value = true;
  try {
    const monthFormatted = `${year.value}-${String(
      selectedMonth.value
    ).padStart(2, "0")}`;

    const data = {
      month: monthFormatted,
      interact_bank: interact_bank.value,
      product_type: product_type.value,
      ...getPaymentStatusFilter.value,
    };

    const res = await cashImageStore.cashImageProfitReport(data);

    console.log(res);

    if (res.success) {
      profitData.value = res;
      console.log(profitData.value);
    } else {
      toast.error(res.message || "Failed to load profit report");
    }
  } catch (error) {
    console.error("Error loading profit report:", error);
    toast.error("An error occurred while loading profit report");
  } finally {
    loading.value = false;
  }
};

const goToPage = (month, year, bookingId) => {
  // Get the route object
  const route = router.resolve({
    name: "verifyInvoices",
    query: {
      month: month,
      year: year,
      id: bookingId,
    },
  });

  // Open in new tab
  window.open(route.href, "_blank");
};

const handleYearChange = (message) => {
  year.value = message;
};

const handleMonthChange = (month) => {
  selectedMonth.value = month;
};

const handleTabChange = (tab) => {
  activeTab.value = tab;
};

// Watch for changes
watch(
  [year, selectedMonth, product_type, interact_bank, activeTab],
  debounce(async () => {
    await profitAction();
  }, 500)
);

onMounted(async () => {
  if (route.query.month && route.query.year) {
    selectedMonth.value = parseInt(route.query.month);
    year.value = parseInt(route.query.year);
  }

  // Set product type from query
  if (route.query.type) {
    if (route.query.type === "4-1000-01" || route.query.type === "3-1000-01") {
      product_type.value = "App\\Models\\PrivateVanTour";
    } else if (
      route.query.type === "4-1000-02" ||
      route.query.type === "3-1000-02"
    ) {
      product_type.value = "App\\Models\\Hotel";
    } else if (
      route.query.type === "4-1000-03" ||
      route.query.type === "3-1000-03"
    ) {
      product_type.value = "App\\Models\\EntranceTicket";
    }
  }

  await profitAction();
});
</script>

<template>
  <Layout :is_white="true" class="relative">
    <!-- Header -->
    <div
      :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
      class="space-x-8 col-span-3 flex justify-start items-center transition-all duration-200 gap-2 text-sm pb-4 absolute top-6"
    >
      <p
        class="text-2xl flex justify-start items-center font-medium text-[#FF613c]"
      >
        Profit Report
        <span
          class="w-2 h-2 mx-3 bg-[#FF613c] rounded-full inline-block"
        ></span>
        <span>{{ year }}</span>
        <span
          class="w-2 h-2 mx-3 bg-[#FF613c] rounded-full inline-block"
        ></span>
        <span>{{ monthArray.find((m) => m.id == selectedMonth)?.name }}</span>
      </p>
    </div>

    <div class="grid grid-cols-5 gap-4">
      <div class="col-span-5">
        <!-- Product Type Tabs -->
        <div
          class="mb-4 bg-white rounded-lg shadow grid grid-cols-3 divide-x divide-gray-300 overflow-hidden uppercase"
        >
          <div
            @click="product_type = 'App\\Models\\Hotel'"
            class="col-span-1 text-center text-sm cursor-pointer font-medium py-2"
            :class="
              product_type === 'App\\Models\\Hotel'
                ? 'bg-[#FF613c] text-white'
                : 'text-gray-500'
            "
          >
            Hotel
          </div>
          <div
            @click="product_type = 'App\\Models\\EntranceTicket'"
            class="col-span-1 text-center text-sm cursor-pointer font-medium py-2"
            :class="
              product_type === 'App\\Models\\EntranceTicket'
                ? 'bg-[#FF613c] text-white'
                : 'text-gray-500'
            "
          >
            Entrance Ticket
          </div>
          <div
            @click="product_type = 'App\\Models\\PrivateVanTour'"
            class="col-span-1 text-center text-sm cursor-pointer font-medium py-2"
            :class="
              product_type === 'App\\Models\\PrivateVanTour'
                ? 'bg-[#FF613c] text-white'
                : 'text-gray-500'
            "
          >
            Private Van Tour
          </div>
        </div>

        <!-- Filters -->
        <div class="pb-4 flex justify-start space-x-2 items-center">
          <YearPickerVue @year-change="handleYearChange" />

          <select
            v-model="selectedMonth"
            @change="handleMonthChange(selectedMonth)"
            class="px-3 text-black text-xs py-2 rounded-lg border border-gray-400/20 focus:outline-none"
          >
            <option :value="m.id" v-for="m in monthArray" :key="m.id">
              {{ m.name }}
            </option>
          </select>

          <select
            v-model="interact_bank"
            class="px-3 text-black text-xs py-2 rounded-lg border border-gray-400/20 focus:outline-none"
          >
            <option
              :value="bank.value"
              v-for="bank in interactBankOptions"
              :key="bank.value"
            >
              {{ bank.label }}
            </option>
          </select>

          <!-- Overall Summary from API -->
          <!-- <div class="w-full flex justify-end items-center space-x-3 text-end">
            <div class="text-xs">
              <p class="text-gray-500 text-[10px]">Total Sales</p>
              <p class="text-[#FF613c] font-semibold">
                {{
                  formattedNumber(profitData?.data?.summary?.total_sales || 0)
                }}
              </p>
            </div>
            <div class="text-xs">
              <p class="text-gray-500 text-[10px]">Total Expense</p>
              <p class="text-red-600 font-semibold">
                {{
                  formattedNumber(profitData?.data?.summary?.total_expense || 0)
                }}
              </p>
            </div>
            <div class="text-xs">
              <p class="text-gray-500 text-[10px]">Total Profit</p>
              <p class="text-green-600 font-semibold">
                {{
                  formattedNumber(profitData?.data?.summary?.total_profit || 0)
                }}
              </p>
            </div>
            <div class="text-xs">
              <p class="text-gray-500 text-[10px]">Profit Margin %</p>
              <p class="text-blue-600 font-semibold">
                {{
                  profitData?.data?.summary?.profit_margin_percentage?.toFixed(
                    2
                  ) || 0
                }}%
              </p>
            </div>
          </div> -->
        </div>

        <!-- Payment Status Tabs -->
        <div
          class="mb-4 bg-white rounded-lg shadow grid grid-cols-3 divide-x divide-gray-300 overflow-hidden"
        >
          <div
            @click="handleTabChange('income')"
            class="col-span-1 text-center text-xs cursor-pointer font-medium py-3 transition-all"
            :class="
              activeTab === 'income'
                ? 'bg-green-500 text-white'
                : 'text-gray-500 hover:bg-gray-50'
            "
          >
            <div class="font-semibold">INCOME</div>
          </div>
          <div
            @click="handleTabChange('payable')"
            class="col-span-1 text-center text-xs cursor-pointer font-medium py-3 transition-all"
            :class="
              activeTab === 'payable'
                ? 'bg-yellow-500 text-white'
                : 'text-gray-500 hover:bg-gray-50'
            "
          >
            <div class="font-semibold">PAYABLE</div>
          </div>
          <div
            @click="handleTabChange('others')"
            class="col-span-1 text-center text-xs cursor-pointer font-medium py-3 transition-all"
            :class="
              activeTab === 'others'
                ? 'bg-red-500 text-white'
                : 'text-gray-500 hover:bg-gray-50'
            "
          >
            <div class="font-semibold">OTHERS</div>
          </div>
        </div>

        <!-- Filtered Summary -->
        <div
          class="mb-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow p-4"
        >
          <div class="flex justify-between items-center">
            <h3 class="text-sm font-semibold text-gray-700">
              {{ activeTab.toUpperCase() }} Summary
            </h3>
            <div class="flex space-x-6 text-xs">
              <div class="text-center">
                <p class="text-gray-500 text-[10px]">Items</p>
                <p class="font-semibold text-gray-800">
                  {{ filteredSummary.total_items }}
                </p>
              </div>
              <div class="text-center">
                <p class="text-gray-500 text-[10px]">Amount</p>
                <p class="font-semibold text-[#FF613c]">
                  {{ formattedNumber(filteredSummary.total_amount) }}
                </p>
              </div>
              <div class="text-center">
                <p class="text-gray-500 text-[10px]">Cost</p>
                <p class="font-semibold text-red-600">
                  {{ formattedNumber(filteredSummary.total_cost) }}
                </p>
              </div>
              <div class="text-center">
                <p class="text-gray-500 text-[10px]">Profit</p>
                <p class="font-semibold text-green-600">
                  {{ formattedNumber(filteredSummary.total_profit) }}
                </p>
              </div>
              <div class="text-center">
                <p class="text-gray-500 text-[10px]">Margin %</p>
                <p class="font-semibold text-blue-600">
                  {{ filteredSummary.average_margin.toFixed(2) }}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="grid grid-cols-3 gap-4">
          <div class="overflow-x-auto col-span-3">
            <table
              class="w-full text-sm text-left text-gray-500 mb-4 rounded overflow-hidden"
            >
              <thead
                class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-[#FF613c] dark:text-gray-100"
              >
                <tr>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    CRM ID
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    Service Date
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    Qty
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    C. Status
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    E. Status
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    Cost
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    Profit
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    Margin %
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20"
                  ></th>
                </tr>
              </thead>

              <tbody class="border border-gray-400/20" v-if="!loading">
                <tr
                  v-for="item in filteredBookingItems"
                  :key="item.booking_item_id"
                  class="border border-gray-400/20 even:bg-gray-50 hover:bg-blue-50"
                >
                  <td
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 whitespace-nowrap border-l border-gray-400/20"
                  >
                    {{ item.crm_id }}
                  </td>
                  <td
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{ item.customer?.name }}
                  </td>
                  <td
                    class="text-[11px] min-w-[200px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{ item.product_name }}
                  </td>
                  <td
                    class="text-[11px] font-medium whitespace-nowrap text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{ item.service_date }}
                  </td>
                  <td
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20 text-center"
                  >
                    {{ item.quantity }}
                  </td>
                  <td
                    class="text-[10px] font-medium px-3 py-3 border-l border-gray-400/20"
                  >
                    <span
                      :class="{
                        'text-green-600 bg-green-100':
                          item.booking_payment_status === 'fully_paid',
                        'text-yellow-600 bg-yellow-100':
                          item.booking_payment_status === 'partially_paid',
                        'text-red-600 bg-red-100':
                          item.booking_payment_status === 'not_paid',
                      }"
                      class="px-2 py-1 rounded text-[9px] font-semibold"
                    >
                      {{ item.booking_payment_status }}
                    </span>
                  </td>
                  <td
                    class="text-[10px] font-medium px-3 py-3 border-l border-gray-400/20"
                  >
                    <span
                      :class="{
                        'text-green-600 bg-green-100':
                          item.payment_status === 'fully_paid',
                        'text-yellow-600 bg-yellow-100':
                          item.payment_status === 'partially_paid',
                        'text-red-600 bg-red-100':
                          item.payment_status === 'not_paid',
                      }"
                      class="px-2 py-1 rounded text-[9px] font-semibold"
                    >
                      {{ item.payment_status }}
                    </span>
                  </td>
                  <td
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20 text-right"
                  >
                    {{ formattedNumber(item.amount) }}
                  </td>
                  <td
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20 text-right"
                  >
                    {{ formattedNumber(item.total_cost_price) }}
                  </td>
                  <td
                    class="text-[11px] font-semibold text-green-600 px-3 py-3 border-l border-gray-400/20 text-right"
                  >
                    {{ formattedNumber(item.profit) }}
                  </td>
                  <td
                    class="text-[11px] font-semibold text-blue-600 px-3 py-3 border-l border-gray-400/20 text-right"
                  >
                    {{ item.profit_margin_percentage }}%
                  </td>
                  <td
                    class="text-[11px] flex justify-end items-center gap-x-4 font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    <EyeIcon
                      @click="
                        // router.push({
                        //   name: 'verifyInvoices',
                        //   query: {
                        //     month: selectedMonth,
                        //     year: year,
                        //     id: item?.booking_id,
                        //   },
                        // })
                        goToPage(selectedMonth, year, item?.booking_id)
                      "
                      class="w-4 h-4 cursor-pointer text-blue-600 hover:text-blue-800"
                    />
                  </td>
                </tr>

                <!-- Empty State -->
                <tr v-if="filteredBookingItems.length === 0">
                  <td
                    colspan="12"
                    class="text-center py-10 text-sm text-gray-500"
                  >
                    No booking items found for selected filters
                  </td>
                </tr>
              </tbody>

              <tbody v-if="loading">
                <tr>
                  <td colspan="12" class="text-center py-10 text-xs">
                    <div class="flex justify-center items-center space-x-2">
                      <svg
                        class="animate-spin h-5 w-5 text-[#FF613c]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Loading...</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style scoped>
/* Add any custom styles if needed */
</style>
