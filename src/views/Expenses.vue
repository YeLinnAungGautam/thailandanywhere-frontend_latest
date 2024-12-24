<script setup>
import Layout from "./Layout.vue";
import Input from "../components/Input.vue";
import InputField from "../components/InputField.vue";
import Pagination from "../components/PaginationExpense.vue";
import debounce from "lodash/debounce";

import CFPaidVue from "./ExpenseComponent/CFPaid.vue";
import EverythingElseVue from "./ExpenseComponent/EverythingElse.vue";

import Modal from "../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import {
  PencilSquareIcon,
  TrashIcon,
  ShareIcon,
  EyeIcon,
  TicketIcon,
  InformationCircleIcon,
  BuildingOfficeIcon,
  PlusIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  DocumentDuplicateIcon,
  UsersIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  PrinterIcon,
  ArrowPathIcon,
} from "@heroicons/vue/24/outline";
import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import { computed, onMounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import { useRouter, useRoute } from "vue-router";
import { useReservationStore } from "../stores/reservation";
import { useAdminStore } from "../stores/admin";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth";
import { useHotelStore } from "../stores/hotel";
import { useEntranceStore } from "../stores/entrance";

const router = useRouter();
const route = useRoute();
const toast = useToast();
const reservationStore = useReservationStore();
const adminStore = useAdminStore();
const hotelStore = useHotelStore();
const authStore = useAuthStore();
const entranceStore = useEntranceStore();

const { reservations, loading } = storeToRefs(reservationStore);
const { hotels } = storeToRefs(hotelStore);
const { entrances } = storeToRefs(entranceStore);

const { admin } = storeToRefs(adminStore);

const changePage = async (url) => {
  await reservationStore.getChangePage(url, watchSystem.value);
};

const partOfshow = ref(0);

const partOfshowFunction = async (data) => {
  if (partOfshow.value != 1) {
    expenseStatus.value = "not_paid";
    customerPaymentStatus.value = "fully_paid"; //
    customer_name.value = "service_date";
    partOfshow.value = data;
  } else {
    partOfshow.value = 0;
  }
};

const partOfshowFunction2 = async (data) => {
  if (partOfshow.value != 2) {
    expenseStatus.value = "not_paid";
    customerPaymentStatus.value = "partially_paid"; //
    customer_name.value = "service_date";
    partOfshow.value = data;
  } else {
    partOfshow.value = 0;
  }
};

const partOfshowFunction3 = (data) => {
  if (partOfshow.value != 3) {
    expenseStatus.value = "";
    customerPaymentStatus.value = "not_paid"; //
    customer_name.value = "service_date";
    partOfshow.value = data;
  } else {
    partOfshow.value = 0;
  }
};

const errors = ref([]);

const product_type = [
  { id: "1", name: "Inclusive", type: "App\\Models\\Inclusive" },
  { id: "2", name: "Entrance Ticket", type: "App\\Models\\EntranceTicket" },
  { id: "3", name: "Private Van Tour", type: "App\\Models\\PrivateVanTour" },
  { id: "4", name: "Group Tour", type: "App\\Models\\GroupTour" },
  { id: "5", name: "Airport Pickup", type: "App\\Models\\AirportPickup" },

  { id: "6", name: "ALL", type: "" },
];

const chooseType = () => {
  console.log(search.value);
};
// these are search function part
const search = ref("");
const searchId = ref("");
const seen = ref(true);
const seenClick = () => {
  seen.value = !seen.value;
};

const searchValue = (val) => {
  search.value = val;
};

const searchA = ref("");
const userFilter = ref(null);
const limit = ref(10);
const searchArray = [
  { id: 1, name: "all" },
  { id: 2, name: "current" },
  { id: 3, name: "past" },
];
const searchReservation = ref("");
const searchResArray = [
  { id: 1, name: "awaiting" },
  { id: 2, name: "confirmed" },
  { id: 3, name: "declined" },
];
const bookingStatusArr = [
  { id: 1, name: "awaiting" },
  { id: 2, name: "confirmed" },
  { id: 3, name: "declined" },
];
const expenseStatusArr = [
  { id: "1", name: "fully_paid" },
  { id: "2", name: "not_paid" },
  { id: "3", name: "partially_paid" },
];
const customerPaymentStatusArr = [
  { id: "1", name: "fully_paid" },
  { id: "2", name: "not_paid" },
  { id: "3", name: "partially_paid" },
];
const searchTime = ref("");
const empty_unit_cost = ref("");
const booking_date = ref("");
const booking_daterange = ref("");
const dateRange = ref();
const sale_daterange = ref(null);
const oldCrmId = ref("");
const bookingStatus = ref("");
const expenseStatus = ref("");
const customerPaymentStatus = ref("");
const hotel_name = ref("");
const attraction_name = ref("");
const customer_name = ref("");
const sortingArr = ref([
  { id: 1, name: "latest", value: "desc" },
  { id: 2, name: "oldest", value: "asc" },
]);
const sorting = ref("");

const dateOnlyToggle = ref(false);

const showFilter = ref(false);
const clearFilter = () => {
  search.value = "";
  changeDate.value = "";
  oldCrmId.value = "";
  dateRange.value = "";
  sale_daterange.value = "";
  booking_daterange.value = "";
  bookingStatus.value = "";
  expenseStatus.value = "";
  customerPaymentStatus.value = "";
  searchId.value = "";
  hotel_name.value = "";
  limit.value = 10;
  searchA.value = "";
  userFilter.value = "";
  attraction_name.value = "";
  // user_id.value =
  //   authStore.isSuperAdmin || authStore.isReservation ? "" : authStore.user.id;
  searchReservation.value = "";
  searchTime.value = "";
  empty_unit_cost.value = "";
  booking_date.value = "";
  showFilter.value = false;
  customer_name.value = "";
  sorting.value = "";
  toggleSearchHandler();
};

const isOpenSearch = ref(false);

const toggleSearchHandler = () => {
  isOpenSearch.value = !isOpenSearch.value;
};

const private_van_tour_show = ref(false);
const private_van_handle = () => {
  // searchValue("App\\Models\\PrivateVanTour");
  search.value = "App\\Models\\PrivateVanTour";
  private_van_tour_show.value = true;
};

const adminAction = ref(false);
const hotelAction = ref(false);
const entranceAction = ref(false);

watch(
  [adminAction, hotelAction, entranceAction],
  async ([newValue, secValue, thridValue]) => {
    if (newValue == true) {
      if (admin.value == null) {
        await adminStore.getSimpleListAction();
      }
    }
    if (secValue == true) {
      if (hotels.value == null) {
        await hotelStore.getSimpleListAction();
      }
    }
    if (thridValue == true) {
      if (entrances.value == null) {
        await entranceStore.getSimpleListAction();
      }
    }
  }
);

// excel for tax

const presetDates = ref([
  { label: "Today", value: [new Date(), new Date()] },
  {
    label: "Today (Slot)",
    value: [new Date(), new Date()],
    slot: "preset-date-range-button",
  },
  {
    label: "This month",
    value: [startOfMonth(new Date()), endOfMonth(new Date())],
  },
  {
    label: "Last month",
    value: [
      startOfMonth(subMonths(new Date(), 1)),
      endOfMonth(subMonths(new Date(), 1)),
    ],
  },
  {
    label: "This year",
    value: [startOfYear(new Date()), endOfYear(new Date())],
  },
]);

const openExcelModal = ref(false);
const product_type_array = [
  { id: 1, name: "private_van_tour" },
  { id: 2, name: "hotel" },
  { id: 3, name: "entrance_ticket" },
  { id: 4, name: "airline" },
  { id: 5, name: "group_tour" },
];
const select_date_type = [
  { id: 1, name: "service_date" },
  { id: 2, name: "sale_date" },
];

const openExcelData = ref({
  daterange: "",
  product: "",
  filter_type: "",
});
const clearExcelData = () => {
  openExcelData.value = {
    daterange: "",
    product: "",
    filter_type: "",
  };
};
const openExcelModalAction = () => {
  clearExcelData();
  openExcelModal.value = true;
};

const closeExcelModal = () => {
  clearExcelData();
  openExcelModal.value = false;
};

// end excel for tax

const setStartAndEndDate = () => {
  const now = new Date(); // Today's date
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ); // Start date (today)

  // Calculate the end date as the same day of the month, 3 months (90 days approx) later
  const endOfRange = new Date(
    now.getFullYear(),
    now.getMonth() + 3, // Add 3 months
    now.getDate()
  );

  // Ensure the end date is valid (handles cases where the current date exceeds the days in the target month)
  if (endOfRange.getDate() !== now.getDate()) {
    // Set to the last day of the target month
    endOfRange.setDate(0);
  }

  dateRange.value = [startOfToday, endOfRange];
};

const adminLists = ref([]);
const getListUser = async () => {
  try {
    const res = await await adminStore.getSimpleListAction();
    console.log(res, "this is admin list");

    adminLists.value = res.result.data
      .filter((item) => item.role === "admin")
      .map((item) => {
        // Return desired structure or transformation here
        return {
          id: item.id,
          name: item.name,
        };
      });
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
  }
};

onMounted(async () => {
  console.log(entrances.value, "this is hotel list");
  searchId.value = route.params.crm_id == "%" ? "" : route.params.crm_id;
  if (route.params.product_type != "%") {
    search.value =
      route.params.product_type == "%" ? "" : route.params.product_type;
  } else {
    search.value = "App\\Models\\Hotel";
  }

  searchTime.value =
    route.params.service_date == "%" ? "" : route.params.service_date;

  setStartAndEndDate();
  await getListUser();
});

const watchSystem = computed(() => {
  const result = {};

  if (limit.value != "" && limit.value != undefined) {
    result.limit = limit.value;
  }

  if (authStore.isSuperAdmin || authStore.isReservation) {
    result.user_id = "";
  } else {
    result.user_id = authStore.user.id;
  }
  if (search.value != "" && search.value != undefined) {
    result.product_type = search.value;
  } else {
    search.value = "App\\Models\\Hotel";
    result.product_type = "App\\Models\\Hotel";
  }
  if (searchId.value != "" && searchId.value != undefined) {
    result.crm_id = searchId.value;
  }
  if (oldCrmId.value != "" && oldCrmId.value != undefined) {
    result.old_crm_id = oldCrmId.value;
  }
  if (bookingStatus.value != "" && bookingStatus.value != undefined) {
    result.booking_status = bookingStatus.value;
  }
  if (expenseStatus.value != "" && expenseStatus.value != undefined) {
    result.expense_status = expenseStatus.value;
  }
  if (hotel_name.value != "" && hotel_name.value != undefined) {
    result.hotel_name = hotel_name.value;
  }
  if (attraction_name.value != "" && attraction_name.value != undefined) {
    result.attraction_name = attraction_name.value;
  }
  if (
    customerPaymentStatus.value != "" &&
    customerPaymentStatus.value != undefined
  ) {
    result.customer_payment_status = customerPaymentStatus.value;
  }
  if (searchA.value != "" && searchA.value != undefined) {
    result.filter = searchA.value;
  }
  if (searchReservation.value != "" && searchReservation.value != undefined) {
    result.reservation_status = searchReservation.value;
  }
  if (
    searchTime.value != "" &&
    searchTime.value != undefined &&
    dateOnlyToggle.value
  ) {
    result.service_date = formatDate(searchTime.value);
  }
  if (empty_unit_cost.value != "" && empty_unit_cost.value != false) {
    result.empty_unit_cost = empty_unit_cost.value;
  }
  if (
    booking_date.value != "" &&
    booking_date.value != undefined &&
    dateOnlyToggle.value
  ) {
    result.booking_date = formatDate(booking_date.value);
  }
  if (sale_daterange.value != undefined && !dateOnlyToggle.value) {
    result.sale_daterange = sale_daterange.value;
  }
  if (booking_daterange.value != undefined && !dateOnlyToggle.value) {
    result.booking_daterange = booking_daterange.value;
  }
  if (userFilter.value != undefined) {
    result.user_id = userFilter.value;
  }
  if (customer_name.value != "" && customer_name.value != null) {
    result.order_by = customer_name.value;
  } else {
    result.order_by = "";
  }

  result.order_direction = "asc";

  console.log(result);
  return result;
});

const formatDate = (datePut) => {
  const date = new Date(datePut);

  // Get the year, month, and day
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month starts from 0
  const day = String(date.getDate()).padStart(2, "0");

  // Form the formatted date string
  let formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

const searchHandler = async () => {
  await reservationStore.getListAction(watchSystem.value);
};

watch(dateRange, async (newValue) => {
  showFilter.value = true;
  console.log(dateRange.value, "this is date");
  if (dateRange.value != "" && dateRange.value != null) {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const startDate = dateRange?.value[0]?.toLocaleDateString("en-GB", options);
    const endDate = dateRange?.value[1]?.toLocaleDateString("en-GB", options);

    // Custom function to format date as dd-MM-yyyy
    const formatDateAsDDMMYYYY = (date) => {
      if (date) {
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yyyy = date.getFullYear();
        return `${yyyy}-${mm}-${dd}`;
      }
    };

    // Format start and end dates
    const formattedStartDate = formatDateAsDDMMYYYY(dateRange.value[0]);
    const formattedEndDate = formatDateAsDDMMYYYY(dateRange.value[1]);

    sale_daterange.value = `${formattedStartDate},${formattedEndDate}`;
  } else {
    sale_daterange.value = "";
  }
  // console.log(sale_daterange.value, "this is daterange");
  await reservationStore.getListAction(watchSystem.value);
});

const bookingDateRange = ref("");

const changeDate = ref("");
const changeServiceDate = (data) => {
  console.log(data);
  changeDate.value = data;
  if (data == "today") {
    let startDate = formatDate(new Date());
    let endDate = formatDate(new Date());
    sale_daterange.value = `${startDate},${endDate}`;
  } else if (data == "tomorrow") {
    let tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    let startDate = formatDate(tomorrowDate);
    let endDate = formatDate(tomorrowDate);
    sale_daterange.value = `${startDate},${endDate}`;
  } else if (data == "7day") {
    let startDate = formatDate(new Date());
    let endDate = formatDate(
      new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
    );
    sale_daterange.value = `${startDate},${endDate}`;
  } else if (data == "30day") {
    let startDate = formatDate(new Date());
    let endDate = formatDate(
      new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
    );
    sale_daterange.value = `${startDate},${endDate}`;
  }
};

watch(partOfshow, async (newValue) => {
  if (newValue) {
    await reservationStore.getListAction(watchSystem.value);
  }
});

watch(search, async (newValue) => {
  if (newValue) {
    await reservationStore.getListAction(watchSystem.value);
  }
});
</script>

<template>
  <Layout>
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-xl font-medium text-gray-600">Expense Lists</h3>
      <div class="space-x-2 flex justify-end gap-1">
        <div
          @click="searchHandler"
          class="px-3 py-1.5 flex justify-start items-center gap-x-2 bg-[#ff613c] text-white rounded-lg cursor-pointer text-xs"
        >
          <ArrowPathIcon class="w-4 h-4" />
          <p>refresh</p>
        </div>
      </div>
    </div>
    <div class="p-6 mb-5 rounded-lg shadow-sm bg-white/60">
      <!-- search input sort filter -->
      <div class="flex items-center justify-between mb-5">
        <div class="flex items-center justify-start gap-2">
          <p
            class="text-xs px-4 cursor-pointer hover:bg-[#ff613c] hover:text-white hover:shadow-md py-1.5 border border-gray-200 rounded-lg"
            @click="searchValue('App\\Models\\Hotel')"
            :class="
              search == 'App\\Models\\Hotel' ? 'bg-[#ff613c] text-white' : ''
            "
          >
            Hotel
          </p>
          <p
            class="text-xs px-4 cursor-pointer hover:bg-[#ff613c] hover:text-white hover:shadow-md py-1.5 border border-gray-200 rounded-lg"
            @click="searchValue('App\\Models\\EntranceTicket')"
            :class="
              search == 'App\\Models\\EntranceTicket'
                ? 'bg-[#ff613c] text-white'
                : ''
            "
          >
            Entrance Ticket
          </p>
        </div>
        <div class="flex justify-end items-center gap-2">
          <div
            @click="dateOnlyToggle = !dateOnlyToggle"
            class="flex justify-end items-center gap-2"
          >
            <p class="text-xs px-3 py-1.5 bg-gray-100 rounded-lg">date only</p>
            <label
              class="inline-flex items-center cursor-pointer"
              v-if="dateOnlyToggle"
            >
              <input type="checkbox" value="" class="sr-only peer" disabled />
              <div
                class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
              ></div>
            </label>

            <label
              class="inline-flex items-center cursor-pointer"
              v-if="!dateOnlyToggle"
            >
              <input
                type="checkbox"
                value=""
                class="sr-only peer"
                checked
                disabled
              />
              <div
                class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"
              ></div>
            </label>
            <p class="text-xs px-3 py-1.5 bg-gray-100 rounded-lg">date range</p>
          </div>
          <div v-if="authStore.isSuperAdmin">
            <p class="text-xs bg-[#FF5B00] text-white px-3 py-1.5 rounded-lg">
              expense - {{ reservations?.meta.total_expense_amount }} thb
            </p>
          </div>
          <div v-if="authStore.isSuperAdmin">
            <p class="text-xs bg-[#FF5B00] text-white px-3 py-1.5 rounded-lg">
              total amount - {{ reservations?.meta.total_amount }} thb
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-5 gap-2 mb-5 flex-wrap">
        <div class="" v-if="authStore.isSuperAdmin || authStore.isReservation">
          <!-- <div
            v-if="(!admin?.data || admin?.data.length > 10) && !adminAction"
            @click="adminAction = true"
            class="text-sm text-gray-500 hover:text-gray-600 border border-gray-300 rounded-md bg-white px-4 py-1.5 w-full flex justify-between items-center"
          >
            <p>select user</p>
            <ArrowDownTrayIcon class="w-4 h-4" />
          </div> -->
          <select
            name=""
            id=""
            v-model="userFilter"
            class="px-2 py-1 focus:border-gray-300 border border-gray-300 placeholder-sm bg-white rounded-md w-3/5 sm:w-3/5 md:w-full text-gray-400 space-y-2 h-9 text-sm focus:outline-none"
          >
            <option :value="null" disabled class="bg-gray-200 text-xs">
              Filter By User
            </option>
            <option value="" class="text-sm">All User</option>
            <option
              :value="key.id"
              v-for="(key, index) in adminLists"
              :key="index"
              class="text-sm"
            >
              {{ key.name }}
            </option>
          </select>
        </div>

        <div v-if="dateOnlyToggle">
          <VueDatePicker
            v-model="searchTime"
            :format="'yyyy-MM-dd'"
            placeholder="Service Date"
            text-input
          />
        </div>
        <div v-if="dateOnlyToggle">
          <VueDatePicker
            v-model="booking_date"
            :format="'yyyy-MM-dd'"
            placeholder="Sale Date"
            text-input
          />
        </div>
        <div v-if="!dateOnlyToggle">
          <VueDatePicker
            v-model="dateRange"
            range
            :format="'yyyy-MM-dd'"
            placeholder="Service Date range"
            text-input
          />
        </div>
        <div v-if="!dateOnlyToggle">
          <VueDatePicker
            v-model="bookingDateRange"
            range
            :format="'yyyy-MM-dd'"
            placeholder="Sale Date range"
            text-input
          />
        </div>
        <div>
          <input
            v-model="searchId"
            type="text"
            class="h-9 text-sm w-3/5 sm:w-3/5 md:w-full border px-4 py-2 rounded-md focus:ring-0 focus:outline-none text-gray-500"
            placeholder="Search CRM ID"
          />
        </div>

        <div class="flex justify-end items-center gap-2">
          <p class="inline-block mr-2 text-sm font-medium text-gray-500">
            Show
          </p>
          <select
            v-model="limit"
            class="w-16 p-2 text-xs border border-gray-300 rounded-md focus:outline-none"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>
        </div>

        <!-- <div v-if="!dateOnlyToggle" class="col-span-8">
          <div class="flex w-full text-xs pt-4 justify-end items-center gap-4">
            <p
              @click="changeServiceDate('today')"
              class="flex gap-2 justify-start items-center cursor-pointer"
              :class="changeDate == 'today' ? ' text-[#FF5B00]' : 'text-black'"
            >
              <span
                class="w-2 h-2 rounded-full bg-[#FF5B00]"
                v-if="changeDate == 'today'"
              ></span
              >Today
            </p>
            <p
              @click="changeServiceDate('tomorrow')"
              class="flex gap-2 justify-start items-center cursor-pointer"
              :class="
                changeDate == 'tomorrow' ? ' text-[#FF5B00]' : 'text-black'
              "
            >
              <span
                class="w-2 h-2 rounded-full bg-[#FF5B00]"
                v-if="changeDate == 'tomorrow'"
              ></span
              >Tomorrow
            </p>
            <p
              @click="changeServiceDate('7day')"
              class="flex gap-2 justify-start items-center cursor-pointer"
              :class="changeDate == '7day' ? ' text-[#FF5B00]' : 'text-black'"
            >
              <span
                class="w-2 h-2 rounded-full bg-[#FF5B00]"
                v-if="changeDate == '7day'"
              ></span
              >Next 7 Days
            </p>
            <p
              @click="changeServiceDate('30day')"
              class="flex gap-2 justify-start items-center cursor-pointer"
              :class="changeDate == '30day' ? ' text-[#FF5B00]' : 'text-black'"
            >
              <span
                class="w-2 h-2 rounded-full bg-[#FF5B00]"
                v-if="changeDate == '30day'"
              ></span
              >Next 30 Days
            </p>
          </div>
        </div> -->
      </div>
      <div class="space-y-2">
        <div class="">
          <div
            class="flex justify-between items-center px-4 cursor-pointer py-5 rounded-lg"
            :class="
              partOfshow == 1
                ? 'bg-[#FF5B00] text-white'
                : 'border border-gray-300'
            "
          >
            <div @click="partOfshowFunction(1)" class="flex items-center gap-2">
              <ChevronDownIcon class="w-5 h-5" />
              <p class="text-sm">Customer Fully Paid & Expense Not Paid</p>
            </div>
            <Pagination
              v-if="!loading && partOfshow == 1"
              :data="reservations"
              @change-page="changePage"
            />
          </div>
          <div v-if="partOfshow == 1">
            <CFPaidVue
              :reservations="reservations"
              :loading="loading"
              v-if="!loading"
            />
            <div class="flex items-center justify-center py-20" v-if="loading">
              <div
                class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-4"
                role="status"
              >
                <span
                  class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                  >Loading...</span
                >
              </div>
              Loading ...
            </div>
          </div>
        </div>
        <div class="">
          <div
            class="flex justify-between items-center px-4 cursor-pointer py-5 rounded-lg"
            :class="
              partOfshow == 2
                ? 'bg-[#FF5B00] text-white'
                : 'border border-gray-300'
            "
          >
            <div
              @click="partOfshowFunction2(2)"
              class="flex items-center gap-2"
            >
              <ChevronDownIcon class="w-5 h-5" />
              <p class="text-sm">Customer Partially Paid & Expense Not Paid</p>
            </div>
            <Pagination
              v-if="!loading && partOfshow == 2"
              :data="reservations"
              @change-page="changePage"
            />
          </div>
          <div v-if="partOfshow == 2">
            <CFPaidVue
              :reservations="reservations"
              :loading="loading"
              v-if="!loading"
            />
            <div class="flex items-center justify-center py-20" v-if="loading">
              <div
                class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-4"
                role="status"
              >
                <span
                  class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                  >Loading...</span
                >
              </div>
              Loading ...
            </div>
          </div>
        </div>
        <div class="pb-3">
          <div
            class="flex justify-between items-center px-4 cursor-pointer py-5 rounded-lg"
            :class="
              partOfshow == 3
                ? 'bg-[#FF5B00] text-white'
                : 'border border-gray-300'
            "
          >
            <!-- <p class="text-sm">Everything else</p> -->
            <div
              @click="partOfshowFunction3(3)"
              class="flex items-center gap-2"
            >
              <ChevronDownIcon class="w-5 h-5" />
              <p class="text-sm">Everything else</p>
            </div>
            <Pagination
              v-if="!loading && partOfshow == 3"
              :data="reservations"
              @change-page="changePage"
            />
          </div>
          <div v-if="partOfshow == 3">
            <EverythingElseVue
              :reservations="reservations"
              :loading="loading"
              v-if="!loading"
            />
            <div class="flex items-center justify-center py-20" v-if="loading">
              <div
                class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-4"
                role="status"
              >
                <span
                  class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                  >Loading...</span
                >
              </div>
              Loading ...
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style>
.style-chooser .v-select-placeholder {
  font-size: 12px !important; /* Adjust the font size to your preference */
}
</style>
