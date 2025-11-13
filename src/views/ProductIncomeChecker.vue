<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import Layout from "./Layout.vue";
import { useCashImageStore } from "../stores/cashImage";
import debounce from "lodash/debounce";
import { BookOpenIcon, EyeIcon } from "@heroicons/vue/24/outline";
import router from "../router";

const cashImageStore = useCashImageStore();
const { loading } = storeToRefs(cashImageStore);

// Response data
const cashImages = ref(null);

// Current date
const currentDate = new Date();
const currentYear = currentDate.getFullYear();

// Filters
const year = ref(currentYear);
const selectedMonth = ref(currentDate.getMonth() + 1);
const product_type = ref("App\\Models\\Hotel");

// Active tab for categorization
const activeTab = ref("income");

// Year options (last 5 years + current + next year)
const yearOptions = computed(() => {
  const years = [];
  for (let i = currentYear - 5; i <= currentYear + 1; i++) {
    years.push(i);
  }
  return years;
});

// Month array
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

// Generate date range for selected month and year
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

// Categorize booking items based on payment status
const categorizeBookingItem = (item, bookingPaymentStatus) => {
  const itemFullyPaid = item == "fully_paid";
  const bookingFullyPaid = bookingPaymentStatus == "fully_paid";

  if (itemFullyPaid && bookingFullyPaid) {
    return "income";
  } else if (!itemFullyPaid && bookingFullyPaid) {
    return "payable";
  } else {
    return "others";
  }
};

const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Expand data to show all booking items with categorization
const expandedData = computed(() => {
  if (!cashImages.value?.data) return [];

  const expanded = [];
  let rowNumber = 1;

  cashImages.value.data.forEach((cashImage) => {
    if (cashImage.booking_items && cashImage.booking_items.length > 0) {
      cashImage.booking_items.forEach((item) => {
        const category = categorizeBookingItem(
          item.b_payment_status,
          item.payment_status
        );

        expanded.push({
          row_number: rowNumber++,
          crm_id: cashImage.crm_id,
          booking_id: cashImage.booking_id,
          cash_image_id: cashImage.cash_image_id,
          sender: cashImage.sender,
          receiver: cashImage.receiver,
          date: cashImage.date,
          currency: cashImage.currency,
          amount: cashImage.amount,
          b_payment_status:
            cashImage.b_payment_status || cashImage.payment_status,
          category: category,
          ...item,
        });
      });
    }
  });

  return expanded;
});

const amountTotal = computed(() => {
  return filteredData.value.reduce(
    (total, item) => total + parseFloat(item.amount || 0),
    0
  );
});

const costTotal = computed(() => {
  return filteredData.value.reduce(
    (total, item) => total + parseFloat(item.cost || 0),
    0
  );
});

const profitTotal = computed(() => {
  return filteredData.value.reduce(
    (total, item) => total + parseFloat(item.profit || 0),
    0
  );
});

// Filter data by active tab
const filteredData = computed(() => {
  return expandedData.value.filter((item) => item.category === activeTab.value);
});

// Calculate summary for each category
const categorySummary = computed(() => {
  const income = expandedData.value.filter(
    (item) => item.category === "income"
  );
  const payable = expandedData.value.filter(
    (item) => item.category === "payable"
  );
  const others = expandedData.value.filter(
    (item) => item.category === "others"
  );

  return {
    income: {
      count: income.length,
      total: income.reduce(
        (sum, item) => sum + parseFloat(item.amount || 0),
        0
      ),
    },
    payable: {
      count: payable.length,
      total: payable.reduce(
        (sum, item) => sum + parseFloat(item.amount || 0),
        0
      ),
    },
    others: {
      count: others.length,
      total: others.reduce(
        (sum, item) => sum + parseFloat(item.amount || 0),
        0
      ),
    },
  };
});

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

// Search parameters
const searchParams = computed(() => {
  const params = {
    date: generateDateRangeForMonth(selectedMonth.value, year.value),
    limit: 500,
    interact_bank: "company",
    include_relatable: true,
    relatable_type: "App\\Models\\Booking",
  };

  if (product_type.value) {
    params.product_type = product_type.value;
  }

  return params;
});

// Fetch data
const getAction = async () => {
  try {
    const res = await cashImageStore.cashImageProfitReport(searchParams.value);
    console.log("====================================");
    console.log(res, "this is response");
    console.log("====================================");

    // Set the response to cashImages
    if (res && res.success) {
      cashImages.value = res;
    }
  } catch (error) {
    console.error("Error fetching cash images:", error);
  }
};

// Change page
const changePage = async (url) => {
  try {
    const res = await cashImageStore.getChangePage(url, searchParams.value);
    if (res && res.success) {
      cashImages.value = res;
    }
  } catch (error) {
    console.error("Error changing page:", error);
  }
};

const goToPage = (bookingId) => {
  const route = router.resolve({
    name: "verifyInvoices",
    query: {
      month: selectedMonth.value,
      year: year.value,
      id: bookingId,
    },
  });
  window.open(route.href, "_blank");
};

const goToBooking = (bookingId) => {
  window.open(`/bookings/new-update/${bookingId}`, "_blank");
};

// Watch for filter changes
watch(
  [year, selectedMonth, product_type],
  debounce(async () => {
    await getAction();
  }, 500)
);

// Initial load
onMounted(async () => {
  await getAction();
});
</script>

<template>
  <Layout :is_white="true">
    <div class="p-6">
      <h1 class="text-2xl font-bold text-[#FF613c] mb-6">
        Income Checker - Booking Items
      </h1>

      <!-- Product Type Tabs -->
      <div
        class="mb-4 bg-white rounded-lg shadow grid grid-cols-3 divide-x divide-gray-300 overflow-hidden"
      >
        <div
          @click="product_type = 'App\\Models\\Hotel'"
          class="col-span-1 text-center text-xs cursor-pointer font-medium py-2 uppercase"
          :class="
            product_type === 'App\\Models\\Hotel'
              ? 'bg-[#FF613c] text-white'
              : 'text-gray-500 hover:bg-gray-50'
          "
        >
          Hotel
        </div>
        <div
          @click="product_type = 'App\\Models\\EntranceTicket'"
          class="col-span-1 text-center text-xs cursor-pointer font-medium py-2 uppercase"
          :class="
            product_type === 'App\\Models\\EntranceTicket'
              ? 'bg-[#FF613c] text-white'
              : 'text-gray-500 hover:bg-gray-50'
          "
        >
          Entrance Ticket
        </div>
        <div
          @click="product_type = 'App\\Models\\PrivateVanTour'"
          class="col-span-1 text-center text-xs cursor-pointer font-medium py-2 uppercase"
          :class="
            product_type === 'App\\Models\\PrivateVanTour'
              ? 'bg-[#FF613c] text-white'
              : 'text-gray-500 hover:bg-gray-50'
          "
        >
          Private Van Tour
        </div>
      </div>

      <div class="flex justify-between items-center mb-6">
        <!-- Filters -->
        <div class="flex gap-4">
          <!-- Year Picker -->
          <select
            v-model="year"
            class="px-4 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]"
          >
            <option v-for="y in yearOptions" :key="y" :value="y">
              {{ y }}
            </option>
          </select>

          <!-- Month Picker -->
          <select
            v-model="selectedMonth"
            class="px-4 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]"
          >
            <option v-for="m in monthArray" :key="m.id" :value="m.id">
              {{ m.name }}
            </option>
          </select>
        </div>

        <div
          class="px-3 py-2 bg-white rounded-lg shadow-lg flex justify-between items-center gap-x-5"
        >
          <div class="space-y-2">
            <p class="text-[10px] text-[#FF613c]">items</p>
            <p class="text-sm">{{ filteredData.length }}</p>
          </div>
          <div class="space-y-2">
            <p class="text-[10px] text-[#FF613c]">Amount</p>
            <p class="text-sm">{{ formatNumber(amountTotal.toFixed(2)) }}</p>
          </div>
          <div class="space-y-2">
            <p class="text-[10px] text-[#FF613c]">Costs</p>
            <p class="text-sm">{{ formatNumber(costTotal.toFixed(2)) }}</p>
          </div>
          <div class="space-y-2">
            <p class="text-[10px] text-[#FF613c]">Profit</p>
            <p class="text-sm">{{ formatNumber(profitTotal.toFixed(2)) }}</p>
          </div>
          <div class="space-y-2">
            <p class="text-[10px] text-[#FF613c]">Margin</p>
            <p class="text-sm">
              {{ formatNumber((profitTotal / amountTotal).toFixed(2)) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Category Tabs (Income/Payable/Others) -->
      <div
        class="mb-4 bg-white rounded-lg shadow grid grid-cols-3 divide-x divide-gray-300 overflow-hidden"
      >
        <div
          @click="activeTab = 'income'"
          class="col-span-1 text-center flex justify-center items-center gap-x-2 cursor-pointer py-3 transition-colors"
          :class="
            activeTab === 'income'
              ? 'bg-green-500 text-white'
              : 'text-gray-600 hover:bg-gray-50'
          "
        >
          <div class="font-semibold text-xs uppercase">Income</div>
          <div class="text-xs mt-1">
            {{ categorySummary.income.count }} items
          </div>
        </div>
        <div
          @click="activeTab = 'payable'"
          class="col-span-1 text-center flex justify-center items-center gap-x-2 cursor-pointer py-3 transition-colors"
          :class="
            activeTab === 'payable'
              ? 'bg-orange-500 text-white'
              : 'text-gray-600 hover:bg-gray-50'
          "
        >
          <div class="font-semibold text-xs uppercase">Payable</div>
          <div class="text-xs mt-1">
            {{ categorySummary.payable.count }} items
          </div>
        </div>
        <div
          @click="activeTab = 'others'"
          class="col-span-1 text-center flex justify-center items-center gap-x-2 cursor-pointer py-3 transition-colors"
          :class="
            activeTab === 'others'
              ? 'bg-gray-500 text-white'
              : 'text-gray-600 hover:bg-gray-50'
          "
        >
          <div class="font-semibold text-xs uppercase">Others</div>
          <div class="text-xs mt-1">
            {{ categorySummary.others.count }} items
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-10">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF613c]"
        ></div>
        <p class="mt-2 text-gray-600">Loading...</p>
      </div>

      <!-- Table -->
      <div v-else-if="filteredData.length > 0" class="overflow-x-auto">
        <table class="w-full border border-gray-300">
          <thead>
            <tr class="bg-[#FF613c] text-white">
              <th
                class="px-4 py-3 text-left text-xs font-medium border-r border-white whitespace-nowrap"
              >
                No.
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium border-r border-white whitespace-nowrap"
              >
                CRM ID
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium border-r border-white whitespace-nowrap"
              >
                B. Crm Id
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium border-r border-white whitespace-nowrap"
              >
                Customer
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium border-r border-white whitespace-nowrap"
              >
                Serivce Date
              </th>

              <th
                class="px-4 py-3 text-left text-xs font-medium border-r border-white whitespace-nowrap"
              >
                Item Name
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium border-r border-white whitespace-nowrap"
              >
                C. Payment Status
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium border-r border-white whitespace-nowrap"
              >
                E. Payment Status
              </th>

              <th
                class="px-4 py-3 text-left text-xs font-medium border-r border-white whitespace-nowrap"
              >
                Amount
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium border-r border-white whitespace-nowrap"
              >
                Cost
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium border-r border-white whitespace-nowrap"
              >
                Profit
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium whitespace-nowrap"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in filteredData"
              :key="`${item.cash_image_id}-${item.id}`"
              class="border-b border-gray-300 hover:bg-gray-50 even:bg-gray-50"
            >
              <td class="px-4 py-3 text-xs border-r border-gray-300">
                {{ index + 1 }}
              </td>
              <td class="px-4 py-3 text-xs border-r border-gray-300">
                {{ item.crm_id || "-" }}
              </td>
              <td class="px-4 py-3 text-xs border-r border-gray-300">
                {{ item.b_crm_id || "-" }}
              </td>
              <td class="px-4 py-3 text-xs border-r border-gray-300">
                {{ item.customer || "-" }}
              </td>
              <td
                class="px-4 py-3 text-xs border-r border-gray-300 whitespace-nowrap"
              >
                {{ formatDate(item.service_date) }}
              </td>

              <td class="px-4 py-3 text-xs border-r border-gray-300">
                {{ item.product_name || "-" }}
              </td>

              <td class="px-4 py-3 text-xs border-r border-gray-300">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="
                    item.b_payment_status === 'fully_paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  "
                >
                  {{ item.b_payment_status || "-" }}
                </span>
              </td>
              <td class="px-4 py-3 text-xs border-r border-gray-300">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="
                    item.payment_status === 'fully_paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  "
                >
                  {{ item.payment_status || "-" }}
                </span>
              </td>
              <td class="px-4 py-3 text-xs border-r border-gray-300">
                {{ item.amount }}
              </td>
              <td class="px-4 py-3 text-xs border-r border-gray-300">
                {{ item.cost }}
              </td>
              <td class="px-4 py-3 text-xs border-r border-gray-300">
                {{ item.profit }}
              </td>
              <td
                class="px-4 py-3 space-x-2 flex justify-center items-center text-xs text-center"
              >
                <EyeIcon
                  @click="goToPage(item.booking_id)"
                  class="w-5 h-5 cursor-pointer text-blue-600 hover:text-blue-800 inline-block"
                />
                <BookOpenIcon
                  @click="goToBooking(item.booking_id)"
                  class="w-5 h-5 cursor-pointer text-red-600 hover:text-blue-800 inline-block"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-10">
        <div class="text-gray-400 text-6xl mb-4">📄</div>
        <p class="text-gray-600">
          No booking items found for {{ activeTab }} category
        </p>
      </div>
    </div>
  </Layout>
</template>
