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
import { useChartOfAccountStore } from "../stores/chartofAccount";
import { useRoute } from "vue-router";
import router from "../router";
import { formattedNumber } from "./help/FormatData";

const sideBarStore = useSidebarStore();
const toast = useToast();
const { isShowSidebar } = storeToRefs(sideBarStore);
const chartOfAccountStore = useChartOfAccountStore();
const route = useRoute();
const { balances, loading } = storeToRefs(chartOfAccountStore);

const product_type = ref("App\\Models\\Hotel");
const limit = ref(10);

// Set current year and month
const currentDate = new Date();
const year = ref(currentDate.getFullYear());
const selectedMonth = ref(currentDate.getMonth() + 1); // Adding 1 since getMonth() returns 0-11

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

// Function to generate month string in Y-m format
const generateMonthString = (month, yearValue) => {
  const paddedMonth = month.toString().padStart(2, "0");
  return `${yearValue}-${paddedMonth}`;
};

const watchSystem = computed(() => {
  return {
    product_type: product_type.value,
    limit: limit.value,
    month: generateMonthString(selectedMonth.value, year.value),
  };
});

const getAction = async () => {
  try {
    await chartOfAccountStore.getOverBalanceDue(watchSystem.value);
  } catch (error) {
    toast.error("Error fetching balance due over data");
  }
};

const changePage = async (url) => {
  try {
    await chartOfAccountStore.getChangeBalanceDuePage(url, watchSystem.value);
  } catch (error) {
    toast.error("Error changing page");
  }
};

const handleYearChange = (message) => {
  year.value = message;
};

// Method to handle month change
const handleMonthChange = (month) => {
  selectedMonth.value = month;
};

onMounted(async () => {
  if (route.query.month && route.query.year) {
    selectedMonth.value = parseInt(route.query.month);
    year.value = parseInt(route.query.year);
  }

  const setProductType = () => {
    let type = "App\\Models\\Hotel"; // Default type

    if (route.query.type == "4-1000-01" || route.query.type == "3-1000-01") {
      type = "App\\Models\\PrivateVanTour";
    } else if (
      route.query.type == "4-1000-02" ||
      route.query.type == "3-1000-02"
    ) {
      type = "App\\Models\\Hotel";
    } else if (
      route.query.type == "4-1000-03" ||
      route.query.type == "3-1000-03"
    ) {
      type = "App\\Models\\EntranceTicket";
    }

    return type;
  };

  // Set product type
  product_type.value = setProductType();

  // Initial load
  await getAction();
});

// Watch for changes and trigger API call
watch(
  [selectedMonth, year, product_type, limit],
  debounce(async (newValue) => {
    if (newValue) {
      await getAction();
    }
  }, 500)
);
</script>

<template>
  <Layout :is_white="true" class="relative">
    <div
      :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
      class="space-x-8 col-span-3 flex justify-start items-center transition-all duration-200 gap-2 text-sm pb-4 absolute top-6"
    >
      <p
        class="text-2xl flex justify-start items-center font-medium text-[#FF613c]"
      >
        Balance Due Over
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
        <!-- header -->
        <div
          class="mb-4 bg-white rounded-lg shadow grid grid-cols-3 divide-x divide-gray-300 overflow-hidden uppercase"
        >
          <div
            @click="product_type = 'App\\Models\\Hotel'"
            class="col-span-1 text-center text-sm cursor-pointer font-medium py-2"
            :class="
              product_type == 'App\\Models\\Hotel'
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
              product_type == 'App\\Models\\EntranceTicket'
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
              product_type == 'App\\Models\\PrivateVanTour'
                ? 'bg-[#FF613c] text-white'
                : 'text-gray-500'
            "
          >
            Private Van Tour
          </div>
        </div>

        <div class="pb-4 flex justify-start space-x-2 items-center">
          <select
            v-model="selectedMonth"
            @change="handleMonthChange(selectedMonth)"
            class="px-3 text-black text-xs py-2 rounded-lg border border-gray-400/20 focus:outline-none"
          >
            <option :value="m.id" v-for="m in monthArray" :key="m.id">
              {{ m.name }}
            </option>
          </select>
          <input
            v-model="year"
            @input="handleYearChange(year)"
            type="number"
            min="2020"
            max="2030"
            class="px-3 text-black text-xs py-2 rounded-lg border border-gray-400/20 focus:outline-none w-20"
            placeholder="Year"
          />
          <select
            v-model="limit"
            class="px-3 text-black text-xs py-2 rounded-lg border border-gray-400/20 focus:outline-none"
          >
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </select>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div class="overflow-x-auto col-span-3">
            <table
              class="w-full text-sm text-left text-gray-500 mb-4 dark:text-gray-400 rounded overflow-hidden"
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
                    Product
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    Variation
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    Sale Date
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
                    Balance Due Date
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    Payment Status
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    Expense Status
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    Income
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    Expense
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
                    Payment Verified
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    Exp Verified
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    Invoice Verified
                  </th>
                  <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody class="border border-gray-400/20" v-if="!loading">
                <tr
                  v-for="item in balances?.data ?? []"
                  :key="item.crm_id"
                  class="border border-gray-400/20 even:bg-gray-50"
                >
                  <td
                    scope="col"
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 whitespace-nowrap border-l border-gray-400/20"
                  >
                    {{ item?.crm_id }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] min-w-[200px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{ item?.product_name || "-" }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] min-w-[200px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{ item?.variation_name || "-" }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] font-medium whitespace-nowrap text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{ item?.sale_date || item?.booking?.booking_date }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] font-medium whitespace-nowrap text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{ item?.service_date }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] font-medium whitespace-nowrap text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{ item?.balance_due_date || "-" }}
                  </td>
                  <td
                    scope="col"
                    class="text-[10px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                    :class="{
                      'text-green-600':
                        (item?.payment_status ||
                          item?.booking?.payment_status) == 'fully_paid',
                      'text-yellow-600':
                        (item?.payment_status ||
                          item?.booking?.payment_status) == 'partially_paid',
                      'text-red-600':
                        (item?.payment_status ||
                          item?.booking?.payment_status) == 'not_paid',
                    }"
                  >
                    {{ item?.payment_status || item?.booking?.payment_status }}
                  </td>
                  <td
                    scope="col"
                    class="text-[10px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                    :class="{
                      'text-green-600': item?.expense_status == 'fully_paid',
                      'text-yellow-600':
                        item?.expense_status == 'partially_paid',
                      'text-red-600': item?.expense_status == 'not_paid',
                    }"
                  >
                    {{ item?.expense_status || "-" }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{ formattedNumber(item?.income || item?.amount) }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{
                      formattedNumber(item?.expense || item?.total_cost_price)
                    }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{
                      formattedNumber(
                        (item?.income || item?.amount) -
                          (item?.expense || item?.total_cost_price)
                      )
                    }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    <p
                      :class="{
                        'text-green-600 bg-green-200 px-2 py-0 rounded-lg text-[10px] text-center':
                          (item?.payment_verify_status ||
                            item?.booking?.verify_status) == 'verified',
                        'text-red-600 bg-red-200 px-2 py-0 rounded-lg text-[10px] text-center':
                          (item?.payment_verify_status ||
                            item?.booking?.verify_status) == 'not_verified',
                        'text-[#FF613c] bg-[#FF613c]/20 px-2 py-0 rounded-lg text-[10px] text-center':
                          (item?.payment_verify_status ||
                            item?.booking?.verify_status) == 'pending',
                      }"
                    >
                      {{
                        item?.payment_verify_status ||
                        item?.booking?.verify_status
                      }}
                    </p>
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    -
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    -
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] flex justify-end items-center gap-x-8 font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    <!-- <EyeIcon class="w-4 h-4 cursor-pointer text-blue-600" /> -->
                    <EyeIcon
                      @click="
                        router.push({
                          name: 'verifyInvoices',
                          query: {
                            month: selectedMonth,
                            year: year,
                            id: item?.booking_id,
                            crm_id: item?.crm_id,
                          },
                        })
                      "
                      class="w-4 h-4 cursor-pointer text-blue-600"
                    />
                    <TrashIcon class="w-4 h-4 cursor-pointer text-red-600" />
                  </td>
                </tr>
              </tbody>
              <tbody v-if="loading">
                <tr>
                  <td colspan="12" class="text-center py-10 text-xs">
                    Loading...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="">
          <!-- pagination -->
          <Pagination
            v-if="!loading"
            :data="balances"
            @change-page="changePage"
          />
        </div>
      </div>
    </div>
  </Layout>
</template>
