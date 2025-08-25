<template>
  <Layout :is_white="true" class="relative">
    <div
      :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
      class="space-x-8 col-span-3 flex justify-start items-center transition-all duration-200 gap-2 text-sm pb-4 absolute top-6"
    >
      <p
        class="text-2xl flex justify-start items-center font-medium text-[#FF613c]"
      >
        Tax Receipt Missing Report
        <span
          class="w-2 h-2 mx-3 bg-[#FF613c] rounded-full inline-block"
        ></span>
        <span>{{ formatDateDisplay(dateRange) }}</span>
      </p>
    </div>

    <div class="relative">
      <!-- Filters and Controls -->
      <div class="pb-4 space-y-3 sticky -top-5 bg-white z-40">
        <div class="flex justify-start items-center space-x-2">
          <p
            @click="router.push(`/bank_statement_purchese`)"
            class="px-3 rounded-lg py-2 text-xs border border-gray-100 cursor-pointer"
          >
            Cash View Table
          </p>

          <div
            class="flex justify-center cursor-pointer items-center gap-x-2 bg-blue-600 rounded-lg text-xs text-white px-3 py-2"
          >
            <p>Tax Report Table</p>
          </div>
        </div>
        <!-- Date Range and Main Controls -->
        <div class="flex justify-start items-center space-x-2">
          <!-- Date Range Picker -->
          <div class="flex items-center space-x-2">
            <YearPickerVue @year-change="handleYearChange" />
            <select
              v-model="selectedMonth"
              @change="handleMonthChange(selectedMonth)"
              class="px-3 py-2 text-xs border border-gray-400/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20"
            >
              <option :value="m.id" v-for="m in monthArray" :key="m.id">
                {{ m.name }}
              </option>
            </select>
          </div>

          <!-- Refresh Button -->
          <button
            @click="refreshData"
            :disabled="loading"
            class="px-3 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center space-x-1"
          >
            <svg
              class="w-4 h-4"
              :class="{ 'animate-spin': loading }"
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
            <span>Refresh</span>
          </button>
        </div>

        <!-- Search and Filter Controls -->
        <div class="flex space-x-2 items-center">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by product name..."
              class="pl-3 pr-3 py-2 text-xs border border-gray-400/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20"
            />
          </div>

          <select
            v-model="filterByType"
            class="px-3 py-2 text-xs border border-gray-400/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20"
          >
            <option value="">All Product Types</option>
            <option value="Hotel Service">Hotel Service</option>
            <option value="Ticket Service">Ticket Service</option>
            <option value="Car Rental Service">Car Rental Service</option>
            <option value="General Service">General Service</option>
          </select>

          <select
            v-model="sortBy"
            class="px-3 py-2 text-xs border border-gray-400/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20"
          >
            <option value="missing_count">Sort by Missing Count</option>
            <option value="total_records">Sort by Total Records</option>
            <option value="product_name">Sort by Product Name</option>
            <option value="completion_rate">Sort by Completion Rate</option>
          </select>

          <button
            @click="clearFilters"
            class="px-3 py-2 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Clear
          </button>
        </div>

        <!-- Summary Cards -->
        <div
          v-if="summary && !loading"
          class="grid grid-cols-2 md:grid-cols-5 gap-3"
        >
          <div class="bg-white p-3 rounded-lg shadow-sm border">
            <div class="text-lg font-bold text-[#FF613c]">
              {{ summary.total_products || 0 }}
            </div>
            <div class="text-xs text-gray-600">Total Products</div>
          </div>
          <div class="bg-white p-3 rounded-lg shadow-sm border">
            <div class="text-lg font-bold text-red-600">
              {{ summary.tax_receipt_summary?.total_missing_tax_receipt || 0 }}
            </div>
            <div class="text-xs text-gray-600">Missing Tax Receipts</div>
          </div>
          <div class="bg-white p-3 rounded-lg shadow-sm border">
            <div class="text-lg font-bold text-green-600">
              {{ summary.tax_receipt_summary?.total_have_tax_receipt || 0 }}
            </div>
            <div class="text-xs text-gray-600">Have Tax Receipts</div>
          </div>

          <div class="bg-white p-3 rounded-lg shadow-sm border">
            <div class="text-lg font-bold text-blue-600">
              {{ summary.total_cash_images || 0 }}
            </div>
            <div class="text-xs text-gray-600">Total Cash Images</div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF613c]"
        ></div>
        <p class="mt-2 text-gray-600 ml-3">Loading tax receipt data...</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!groupedData || groupedData.length === 0"
        class="text-center py-20"
      >
        <div class="text-gray-400 text-6xl mb-4">📋</div>
        <p class="text-gray-600 text-lg">No tax receipt data found</p>
        <p class="text-gray-500 text-sm">
          Try adjusting your date range or filters
        </p>
      </div>

      <!-- Data Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-xs border border-gray-500">
          <thead class="border border-gray-500">
            <tr class="bg-gray-200 divide-x divide-gray-500">
              <th class="text-xs text-center font-medium py-3 w-[200px]">
                Product Name
              </th>
              <th class="text-xs text-center font-medium py-3 w-[120px]">
                Product Type
              </th>
              <th class="text-xs text-center font-medium py-3 w-[150px]">
                Tax Receipt Status
              </th>
              <th class="text-xs text-center font-medium py-3 w-[120px]">
                Completion Rate
              </th>
              <th class="text-xs text-center font-medium py-3 w-[100px]">
                Total Items
              </th>
              <th class="text-xs text-center font-medium py-3 w-[100px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(product, index) in filteredProducts" :key="index">
              <!-- Main Row -->
              <tr
                class="bg-gray-50 odd:bg-white group relative divide-x divide-gray-500 hover:bg-gray-100 cursor-pointer transition-colors"
                :class="
                  expandedItems.includes(index) ? 'border border-[#FF613c]' : ''
                "
              >
                <td class="px-3 py-3 text-center">
                  <div class="flex items-center justify-start space-x-2">
                    <div
                      class="h-6 w-6 rounded-full bg-[#FF613c] flex items-center justify-center"
                    >
                      <span class="text-xs font-medium text-white">
                        {{ product.product_name.charAt(0) }}
                      </span>
                    </div>
                    <span class="text-xs font-medium line-clamp-1">{{
                      product.product_name
                    }}</span>
                  </div>
                </td>
                <td class="px-3 py-3 text-center">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getTypeColor(product.product_type)"
                  >
                    {{ product.product_type }}
                  </span>
                </td>
                <td class="px-3 py-3 text-center">
                  <div class="flex items-center justify-center space-x-2">
                    <span class="text-xs font-medium text-red-600">
                      {{
                        product.tax_receipt_summary?.missing_tax_receipt || 0
                      }}
                    </span>
                    <span class="text-xs text-gray-500">/</span>
                    <span class="text-xs text-gray-900">
                      {{ product.total_records }}
                    </span>
                    <span class="text-xs text-gray-500">missing</span>
                  </div>
                </td>
                <td class="px-3 py-3 text-center">
                  <div class="flex items-center justify-center space-x-2">
                    <div class="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        class="h-2 rounded-full transition-all duration-300"
                        :class="getCompletionColor(getCompletionRate(product))"
                        :style="{ width: getCompletionRate(product) + '%' }"
                      ></div>
                    </div>
                    <span class="text-xs text-gray-600">
                      {{ getCompletionRate(product).toFixed(1) }}%
                    </span>
                  </div>
                </td>
                <td class="px-3 py-3 text-center text-xs font-medium">
                  {{ product.total_records }}
                </td>
                <td class="px-3 py-3 text-center space-x-4">
                  <button @click="copyToClipboard(product)">
                    <ClipboardIcon class="w-4 h-4" />
                  </button>
                  <button
                    class="text-[#FF613c] hover:text-[#e55439] transition-colors"
                    @click.stop="toggleExpanded(index)"
                  >
                    <svg
                      :class="{
                        'transform rotate-180': expandedItems.includes(index),
                      }"
                      class="w-5 h-5 transition-transform mx-auto"
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
                  </button>
                </td>
              </tr>

              <!-- Expanded Details Row -->
              <tr v-if="expandedItems.includes(index)" class="bg-gray-50">
                <td colspan="6" class="px-6 py-4">
                  <div class="space-y-4">
                    <!-- Summary Stats for this product -->

                    <!-- Cash Images Details Table -->
                    <div class="bg-white rounded-lg border">
                      <div class="px-4 py-3 border-b bg-gray-50">
                        <h4 class="text-sm font-medium text-gray-700">
                          Cash Images Details ({{
                            product.cash_images?.length || 0
                          }}
                          items)
                        </h4>
                      </div>
                      <div class="overflow-x-auto">
                        <table class="min-w-full text-xs">
                          <thead class="bg-gray-50">
                            <tr class="divide-x divide-gray-200">
                              <th
                                class="px-3 py-2 text-left font-medium text-gray-700"
                              >
                                CRM ID
                              </th>
                              <th
                                class="px-3 py-2 text-left font-medium text-gray-700"
                              >
                                Date
                              </th>
                              <th
                                class="px-3 py-2 text-left font-medium text-gray-700"
                              >
                                Amount
                              </th>
                              <th
                                class="px-3 py-2 text-left font-medium text-gray-700"
                              >
                                Bank
                              </th>
                              <th
                                class="px-3 py-2 text-left font-medium text-gray-700"
                              >
                                Status
                              </th>
                              <th
                                class="px-3 py-2 text-center font-medium text-gray-700"
                              >
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody class="divide-y divide-gray-200">
                            <tr
                              v-for="cashImage in product.cash_images"
                              :key="cashImage.id"
                              class="hover:bg-gray-50"
                            >
                              <td class="px-3 py-2">
                                <span class="text-blue-600 font-mono">
                                  {{ cashImage.crm_id || "N/A" }}
                                </span>
                              </td>
                              <td class="px-3 py-2">
                                {{ formattedDateTime(cashImage.date) }}
                              </td>
                              <td class="px-3 py-2">
                                <span class="font-semibold text-green-600">
                                  {{ formatCurrency(cashImage.amount) }}
                                  {{ cashImage.currency }}
                                </span>
                              </td>
                              <td class="px-3 py-2">
                                {{ cashImage.interact_bank }}
                              </td>
                              <td class="px-3 py-2">
                                <span
                                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                                  :class="
                                    getTaxReceiptStatusColor(
                                      cashImage.tax_receipt_status
                                    )
                                  "
                                >
                                  {{
                                    getTaxReceiptStatusText(
                                      cashImage.tax_receipt_status
                                    )
                                  }}
                                </span>
                              </td>
                              <td class="px-3 py-2 text-center">
                                <div
                                  class="flex items-center justify-center space-x-1"
                                >
                                  <button
                                    @click="viewImage(cashImage)"
                                    class="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="View Image"
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
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                      />
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mt-8" v-if="pagination && pagination.last_page > 1">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ pagination.from }} to {{ pagination.to }} of
            {{ pagination.total }} results
          </div>
          <div class="flex gap-2">
            <button
              @click="changePage(pagination.current_page - 1)"
              :disabled="pagination.current_page <= 1"
              class="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            >
              Previous
            </button>
            <span class="px-3 py-1 text-sm font-medium">
              Page {{ pagination.current_page }} of {{ pagination.last_page }}
            </span>
            <button
              @click="changePage(pagination.current_page + 1)"
              :disabled="pagination.current_page >= pagination.last_page"
              class="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCashImageStore } from "../../stores/cashImage";
import { useSidebarStore } from "../../stores/sidebar";
import { storeToRefs } from "pinia";
import Layout from "../Layout.vue";
import { ChevronLeftIcon, ClipboardIcon } from "@heroicons/vue/24/outline";
import { useToast } from "vue-toastification";
import YearPickerVue from "../AccountingComponent/yearPicker.vue";
import { formattedDate } from "../help/FormatData";

const route = useRoute();
const router = useRouter();
const cashImageStore = useCashImageStore();
const sideBarStore = useSidebarStore();
const { isShowSidebar } = storeToRefs(sideBarStore);

// Reactive data
const loading = ref(false);
const groupedData = ref([]);
const summary = ref(null);
const pagination = ref(null);
const expandedItems = ref([]);
const searchQuery = ref("");
const filterByType = ref("");
const sortBy = ref("missing_count");
const per_page = ref(100);

const currentDate = new Date();
const year = ref(currentDate.getFullYear());
const selectedMonth = ref(currentDate.getMonth() + 1);

const toast = useToast();

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

// Generate date range from year and month
const generateDateRangeForMonth = (month, yearValue) => {
  const startDate = new Date(yearValue, month - 1, 1);
  const endDate = new Date(yearValue, month, 0);

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return `${formatDate(startDate)},${formatDate(endDate)}`;
};

// Get current date range based on selected year and month
const dateRange = computed(() => {
  return generateDateRangeForMonth(selectedMonth.value, year.value);
});

// Handle year change from YearPicker component
const handleYearChange = (newYear) => {
  year.value = newYear;
  updateUrlAndRefresh();
};

const formattedDateTime = (dateTimeString) => {
  const dateTime = new Date(dateTimeString);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = dateTime.getDate();
  const month = months[dateTime.getMonth()];
  const year = dateTime.getFullYear();
  const hours = dateTime.getHours().toString().padStart(2, "0");
  const minutes = dateTime.getMinutes().toString().padStart(2, "0");

  return `${day} ${month} ${year} ${hours}:${minutes}`;
};

// Test with your data
console.log(formattedDateTime("2025-07-31T20:39:00.000000Z"));
// Output: "31 July 2025 20:39"

// Handle month change
const handleMonthChange = (month) => {
  selectedMonth.value = month;
  updateUrlAndRefresh();
};

// Update URL with daterange and refresh data
const updateUrlAndRefresh = () => {
  const currentDateRange = generateDateRangeForMonth(
    selectedMonth.value,
    year.value
  );

  // Update URL with clean daterange-only format
  router.push({
    query: {
      daterange: currentDateRange,
    },
  });

  // Then refresh data
  getRemainList();
};

// Apply date range and update URL
// Initialize from route params and ensure daterange is set
const initializeFromRoute = () => {
  // Priority 1: Extract from daterange parameter (your route format)
  if (route.query.daterange) {
    const [startDate, endDate] = route.query.daterange.split(",");
    const date = new Date(startDate);
    year.value = date.getFullYear();
    selectedMonth.value = date.getMonth() + 1;
    console.log("Initialized from daterange:", route.query.daterange);
    console.log("Extracted year:", year.value, "month:", selectedMonth.value);
  }
  // Priority 2: Fallback to year/month parameters
  else if (route.query.month && route.query.year) {
    selectedMonth.value = parseInt(route.query.month);
    year.value = parseInt(route.query.year);
    console.log("Initialized from year/month params");
  }
  // Priority 3: Default to current month if no params
  else {
    console.log("No route params, using current date");
  }

  // Always ensure URL stays consistent with current values
  const currentDateRange = generateDateRangeForMonth(
    selectedMonth.value,
    year.value
  );
  console.log("Generated daterange:", currentDateRange);

  // Only update URL if the daterange has changed
  if (route.query.daterange !== currentDateRange) {
    router.replace({
      query: {
        ...route.query,
        daterange: currentDateRange,
      },
    });
  }
};

// Format date display
const formatDateDisplay = (dateRangeStr) => {
  if (!dateRangeStr) return "No date range selected";

  const [start, end] = dateRangeStr.split(",");
  if (start === end) {
    return new Date(start).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  const startFormatted = new Date(start).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const endFormatted = new Date(end).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${startFormatted} - ${endFormatted}`;
};

const copyToClipboard = (product) => {
  console.log(product, "this is product");

  // Helper function to format date from "DD-MM-YYYY HH:MM:SS" to "YYYY MMM DD"
  const formatDate = (dateString) => {
    const [datePart] = dateString.split(" ");
    const [day, month, year] = datePart.split("-");
    const months = [
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
    return `${year} ${months[parseInt(month) - 1]} ${day}`;
  };

  // Get current month and year for report header
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("en", { month: "long" });

  // Separate records by tax receipt status
  const withTaxReceipt = product.cash_images.filter(
    (item) => item.tax_receipt_status !== "missing"
  );

  const withoutTaxReceipt = product.cash_images.filter(
    (item) => item.tax_receipt_status === "missing"
  );

  // Build the report
  let report = `${currentMonth} Report: "${product.product_name}"\n\n`;

  // Tax Receipt Received section
  if (withTaxReceipt.length > 0) {
    report += `Tax Receipt Received:\n`;
    withTaxReceipt.forEach((item) => {
      const formattedDate = formattedDateTime(item.date);
      report += `- ${
        item.amount
      } ${item.currency.toLowerCase()} ; ${formattedDate} ; ${item.crm_id} ; ${
        item.customer_name
      }\n`;
    });
    report += `\n`;
  }

  // Tax Receipt Not Received section
  if (withoutTaxReceipt.length > 0) {
    report += `Tax Receipt Not Received:\n`;
    withoutTaxReceipt.forEach((item) => {
      const formattedDate = formattedDateTime(item.date);
      report += `- ${
        item.amount
      } ${item.currency.toLowerCase()} ; ${formattedDate} ; ${item.crm_id} ; ${
        item.customer_name
      }\n`;
    });
  }

  // Copy to clipboard
  navigator.clipboard
    .writeText(report)
    .then(() => {
      console.log("Report copied to clipboard successfully!");
      toast.success("Report copied to clipboard");
    })
    .catch((err) => {
      console.error("Failed to copy to clipboard:", err);
      // Fallback: log the report so user can manually copy
      console.log("Report text:\n", report);
    });

  return report;
};

// Computed properties
const filteredProducts = computed(() => {
  let filtered = [...groupedData.value];

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.product_name.toLowerCase().includes(query) ||
        product.product_type.toLowerCase().includes(query)
    );
  }

  // Filter by type
  if (filterByType.value) {
    filtered = filtered.filter(
      (product) => product.product_type === filterByType.value
    );
  }

  // Sort
  filtered.sort((a, b) => {
    if (sortBy.value === "missing_count") {
      return (
        (b.tax_receipt_summary?.missing_tax_receipt || 0) -
        (a.tax_receipt_summary?.missing_tax_receipt || 0)
      );
    } else if (sortBy.value === "total_records") {
      return b.total_records - a.total_records;
    } else if (sortBy.value === "product_name") {
      return a.product_name.localeCompare(b.product_name);
    } else if (sortBy.value === "completion_rate") {
      return getCompletionRate(b) - getCompletionRate(a);
    }
    return 0;
  });

  return filtered;
});

// Methods
const getRemainList = async (page = 1) => {
  loading.value = true;
  try {
    const params = {
      date: dateRange.value,
      sort_by: "receiver",
      sort_order: "asc",
      include_relatable: true,
      filter_type_invoice: "invoice_have",
      relatable_type: "App\\Models\\BookingItemGroup",
      page: page,
      limit: per_page.value,
    };

    const res = await cashImageStore.getRemainTaxReceipt(params);
    console.log("API Response:", res);

    if (res.status === 1) {
      groupedData.value = res.result.grouped_data || [];
      summary.value = res.result.summary || {};
      pagination.value = res.result.pagination || {};
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loading.value = false;
  }
};

const refreshData = () => {
  getRemainList();
};

const toggleExpanded = (index) => {
  const expandedIndex = expandedItems.value.indexOf(index);
  if (expandedIndex > -1) {
    expandedItems.value.splice(expandedIndex, 1);
  } else {
    expandedItems.value.push(index);
  }
};

const clearFilters = () => {
  searchQuery.value = "";
  filterByType.value = "";
  sortBy.value = "missing_count";
  per_page.value = 25;
};

const getTypeColor = (type) => {
  const colors = {
    "Hotel Service": "bg-blue-100 text-blue-800",
    "Ticket Service": "bg-green-100 text-green-800",
    "Car Rental Service": "bg-purple-100 text-purple-800",
    "General Service": "bg-gray-100 text-gray-800",
  };
  return colors[type] || "bg-gray-100 text-gray-800";
};

const getCompletionRate = (product) => {
  const total = product.total_records || 0;
  const have = product.tax_receipt_summary?.have_tax_receipt || 0;
  return total > 0 ? (have / total) * 100 : 0;
};

const getCompletionColor = (rate) => {
  if (rate >= 80) return "bg-green-500";
  if (rate >= 60) return "bg-yellow-500";
  if (rate >= 40) return "bg-orange-500";
  return "bg-red-500";
};

const getTaxReceiptStatusColor = (status) => {
  const colors = {
    have: "bg-green-100 text-green-800",
    missing: "bg-red-100 text-red-800",
    not_applicable: "bg-gray-100 text-gray-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

const getTaxReceiptStatusText = (status) => {
  const texts = {
    have: "Have Receipt",
    missing: "Missing Receipt",
    not_applicable: "Not Applicable",
  };
  return texts[status] || "Unknown";
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US").format(parseFloat(amount || 0));
};

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    getRemainList(page);
  }
};

const viewImage = (cashImage) => {
  if (cashImage.image) {
    window.open(
      `https://thanywhere.sgp1.cdn.digitaloceanspaces.com/images/${cashImage.image}`,
      "_blank"
    );
  } else {
    console.warn("No image available for this cash image");
  }
};

// Watchers
// Watch for route daterange changes (for direct URL navigation)
watch(
  () => route.query.daterange,
  (newDateRange) => {
    if (newDateRange && newDateRange !== dateRange.value) {
      console.log("Route daterange changed to:", newDateRange);
      const [startDate] = newDateRange.split(",");
      const date = new Date(startDate);
      year.value = date.getFullYear();
      selectedMonth.value = date.getMonth() + 1;
      console.log("Updated year:", year.value, "month:", selectedMonth.value);
      getRemainList();
    }
  }
);

// Watch for year and month changes to update URL with daterange only
watch([year, selectedMonth], () => {
  const currentDateRange = generateDateRangeForMonth(
    selectedMonth.value,
    year.value
  );

  // Only update if daterange actually changed
  if (route.query.daterange !== currentDateRange) {
    router.replace({
      query: {
        daterange: currentDateRange,
      },
    });
  }
});

let searchTimeout;

// Lifecycle
onMounted(() => {
  console.log("Component mounted");
  console.log("Route query:", route.query);
  console.log("Initial daterange from route:", route.query.daterange);

  initializeFromRoute();

  // Log the final values before API call
  console.log("Final year:", year.value, "month:", selectedMonth.value);
  console.log("Final dateRange for API:", dateRange.value);

  // Make the first API call
  getRemainList();
});
</script>
