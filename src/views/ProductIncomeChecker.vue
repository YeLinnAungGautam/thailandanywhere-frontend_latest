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
import { useReservationStore } from "../stores/reservation";
import AccountanceHeader from "../components/AccountanceHeader.vue";
import { useAuthStore } from "../stores/auth";
import YearPickerVue from "./AccountingComponent/yearPicker.vue";
import { useRoute } from "vue-router";
import router from "../router";

const sideBarStore = useSidebarStore();
const toast = useToast();
const { isShowSidebar } = storeToRefs(sideBarStore);
const reservationStore = useReservationStore();
const route = useRoute();
const authStore = useAuthStore();
const { reservations, loading } = storeToRefs(reservationStore);

const date_range = ref("");
const product_type = ref("App\\Models\\Hotel");
const search = ref("");
const payment_status = ref("fully_paid");

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

// Function to generate date range string for a specific month
const generateDateRangeForMonth = (month, yearValue) => {
  // Month should be 1-12 (for Jan-Dec)
  const startDate = new Date(yearValue, month - 1, 1);

  // Get the last day of the month
  const endDate = new Date(yearValue, month, 0);

  // Format dates as YYYY-MM-DD
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return `${formatDate(startDate)},${formatDate(endDate)}`;
};

// Set date range based on month and year
const setMonthDateRange = (month, yearValue) => {
  date_range.value = generateDateRangeForMonth(month, yearValue);
};

const watchSystem = computed(() => {
  let result = {};
  if (date_range.value) {
    result.sale_daterange = date_range.value;
  }
  if (
    authStore.isSuperAdmin ||
    authStore.isReservation ||
    authStore.isAuditor
  ) {
    result.user_id = "";
  } else {
    result.user_id = authStore.user.id;
  }
  if (payment_status.value != "") {
    result.customer_payment_status = payment_status.value;
  }
  result.product_type = product_type.value ?? "App\\Models\\Hotel";
  return result;
});

const getAction = async () => {
  const res = await reservationStore.getListAction(watchSystem.value);
};

const changePage = async (url) => {
  await reservationStore.getChangePage(url, watchSystem.value);
};

const handleYearChange = (message) => {
  year.value = message;
  // Update date range when year changes
  setMonthDateRange(selectedMonth.value, year.value);
};

// Method to handle month change
const handleMonthChange = (month) => {
  selectedMonth.value = month;
  // Update date range when month changes
  setMonthDateRange(month, year.value);
};

onMounted(async () => {
  // Initialize date range with current month and year
  setMonthDateRange(selectedMonth.value, year.value);
  // await getAction();
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
});

// watch(
//   product_type,
//   debounce(async (newValue) => {
//     await getAction();
//   }, 500)
// );

// Watch date_range changes
watch(
  [date_range, product_type, payment_status],
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
        Income Checker
        <span
          class="w-2 h-2 mx-3 bg-[#FF613c] rounded-full inline-block"
        ></span>
        <span>{{ year }}</span>
        <span
          class="w-2 h-2 mx-3 bg-[#FF613c] rounded-full inline-block"
        ></span>
        <span>{{ monthArray.find((m) => m.id == selectedMonth).name }}</span>
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
            v-model="payment_status"
            name=""
            id=""
            class="w-1/4 border border-gray-400/20 focus:outline-none rounded-lg px-3 py-2 text-xs"
          >
            <option value="">All</option>
            <option value="fully_paid">Fully Paid</option>
            <option value="not_paid">Not Paid</option>
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
                    CRM_Res
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
                    Sales Date
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    Se. Date
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    P. Status
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
                    p. Verified
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
                    E.Verified
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
                    I.Verified
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    Proof of service Coming
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20"
                  ></th>
                </tr>
              </thead>

              <tbody class="border border-gray-400/20" v-if="!loading">
                <tr
                  v-for="item in reservations?.data ?? []"
                  :key="item"
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
                    {{ item?.variation?.name }}{{ item?.room?.name
                    }}{{ item?.car?.name }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] font-medium whitespace-nowrap text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{ item?.booking?.booking_date }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] font-medium whitespace-nowrap text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{ item?.service_date }}
                  </td>
                  <td
                    scope="col"
                    class="text-[10px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                    :class="{
                      'text-green-600':
                        item?.booking?.payment_status == 'fully_paid',
                      'text-yellow-600':
                        item?.booking?.payment_status == 'partially_paid',
                      'text-red-600':
                        item?.booking?.payment_status == 'not_paid',
                    }"
                  >
                    {{ item?.booking?.payment_status }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{ item?.amount }}
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
                    {{ item?.total_cost_price }}
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
                    {{ item?.amount * 1 - item?.total_cost_price * 1 }}
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
                    coming ...
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] flex justify-end items-center gap-x-8 font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    <PencilSquareIcon
                      @click="router.push('verify_invoices')"
                      class="w-4 h-4 cursor-pointer text-blue-600"
                    />
                    <TrashIcon class="w-4 h-4 cursor-pointer text-red-600" />
                  </td>
                </tr>
              </tbody>
              <tbody class=" " v-if="loading">
                <tr class="">
                  <td colspan="13" class="text-center py-10 text-xs">
                    loading ...
                  </td>
                </tr>
              </tbody>
            </table>
            <div>
              <!-- pagination -->
              <Pagination
                v-if="!loading"
                :data="reservations"
                @change-page="changePage"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
