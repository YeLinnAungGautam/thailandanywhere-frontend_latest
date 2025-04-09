<script setup>
import { storeToRefs } from "pinia";
// import { usegroupByStore } from "../stores/reservation";
import Layout from "./Layout.vue";
import ListReservation from "./ReservationGroupByComponent/ListReservation.vue";
import ReservationCartLoadingVue from "./Dashboard/ReservationCartLoading.vue";
import { onMounted, ref, watch, computed } from "vue";
import Pagination from "../components/PaginationExpense.vue";
import {
  ArrowDownTrayIcon,
  ArrowsUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import ReservationDetail from "./ReservationGroupByComponent/ReservationDetail.vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter, useRoute } from "vue-router";
import { useAdminStore } from "../stores/admin";
import Modal from "../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import AttractionUnlimited from "./Reservation2Component/AttractionUnlimited.vue";
import HotelUnlimited from "./Reservation2Component/HotelUnlimited.vue";
import { XCircleIcon } from "@heroicons/vue/24/solid";
import { format } from "date-fns";
import { useGroupByStore } from "../stores/groupby";
import { useSidebarStore } from "../stores/sidebar";

const sidebarStore = useSidebarStore();
const { isShowSidebar } = storeToRefs(sidebarStore);

const groupByStore = useGroupByStore();
const { results, loading } = storeToRefs(groupByStore);
const authStore = useAuthStore();

const router = useRouter();
const adminStore = useAdminStore();
const route = useRoute();

// filter keys
const limit = ref(10);
const search = ref("");
const searchId = ref("");
const customerName = ref("");
const hotel_name = ref("");
const attraction_name = ref("");
const userFilter = ref("");
const dateRange = ref(null);
const searchTime = ref("");
const empty_unit_cost = ref("");
const sale_daterange = ref(null);
const booking_daterange = ref(null);
const customer_name = ref("service_date");
const sorting = ref("asc");
const dateOnlyToggle = ref(false);
const searchA = ref("");
const showSide = ref(1);
const oldCrmId = ref("");
const filterShow = ref(false);
const softShow = ref(false);
const booking_status = ref("");
const expense_status = ref("");
const customer_payment_status = ref("");
const booking_date = ref("");
const searchReservation = ref("");
const bookingStatus = ref("");
const expenseStatus = ref("");
const invoiceStatus = ref("");
const customerPaymentStatus = ref("");
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
  invoiceStatus.value = "";
  customerPaymentStatus.value = "";
  searchId.value = "";
  customerName.value = "";
  hotel_name.value = "";
  limit.value = 10;
  searchA.value = "";
  userFilter.value = "";
  attraction_name.value = "";
  // user_id.value =
  //   authStore.isSuperAdmin || authStore.isReservation ? "" : authStore.user.id;
  searchReservation.value = "";
  searchTime.value = "";
  booking_date.value = "";
  showFilter.value = false;
  customer_name.value = "service_date";
  sorting.value = "";

  filterShow.value = false;
};

const userName = computed(() => {
  const filteredUser = adminLists?.value.find(
    (user) => user.id === userFilter.value
  );
  return filteredUser ? filteredUser.name : undefined;
});

const searchModel = ref(false);

const searchValue = (val) => {
  search.value = val;
};

const changePage = async (url) => {
  await groupByStore.getChangePage(url, watchSystem.value);
};

// format action
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

const setStartAndEndDate = () => {
  const now = new Date(); // Today's date
  const startDate = new Date(now); // Start date is today

  // Add 90 days to the start date to get the end date
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + 90);

  dateRange.value = [startDate, endDate];
};

const watchSystem = computed(() => {
  const result = {};

  if (limit.value != "" && limit.value != undefined) {
    result.limit = limit.value;
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

  if (searchId.value != "" && searchId.value != undefined) {
    result.crm_id = searchId.value;
  }
  if (customerName.value != "" && customerName.value != undefined) {
    result.customer_name = customerName.value;
  }
  if (bookingStatus.value != "" && bookingStatus.value != undefined) {
    result.booking_status = bookingStatus.value;
  }
  if (expenseStatus.value != "" && expenseStatus.value != undefined) {
    result.expense_status = expenseStatus.value;
  }
  if (invoiceStatus.value != "" && invoiceStatus.value != undefined) {
    result.invoice_status = invoiceStatus.value;
  }
  if (hotel_name.value != "" && hotel_name.value != undefined) {
    result.hotel_name = hotel_name.value;
  }
  if (attraction_name.value != "" && attraction_name.value != undefined) {
    result.hotel_name = attraction_name.value;
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
    result.booking_daterange = sale_daterange.value;
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
  if (sorting.value != "") {
    result.order_direction = sorting.value;
  } else {
    result.order_direction = "desc";
  }

  console.log(result);
  return result;
});

const detailId = ref("");
const product_id = ref("");
const getDetailAction = async (id) => {
  detailId.value = id.id;
  product_id.value = id.product_id;

  if (detailId.value) {
    router.push(
      "reservation-hotel?id=" +
        detailId.value +
        "&product_id=" +
        product_id.value +
        "&crm_id=" +
        id.crm_id
    );
  }

  // showSide.value = false;
};

const adminLists = ref([]);

const ChangeAttractionName = (data) => {
  if (data) {
    attraction_name.value = data;
  }
};

const ChangeHotelName = (data) => {
  if (data) {
    hotel_name.value = data;
  }
};

const changeDate = ref("");
const changeServiceDate = async (data) => {
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

  await searchAction();
};

const getListUser = async () => {
  try {
    const res = await adminStore.getSimpleListAction();
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

const showFormat = (dateStr) => {
  // Regular expression for matching a single date (YYYY-MM-DD)
  const singleDatePattern = /^\d{4}-\d{2}-\d{2}$/;

  // Regular expression for multiple comma-separated dates (YYYY-MM-DD,YYYY-MM-DD,...)
  const multipleDatesPattern = /^(\d{4}-\d{2}-\d{2})(,\d{4}-\d{2}-\d{2})*$/;

  if (singleDatePattern.test(dateStr)) {
    return format(new Date(dateStr), "MMM, dd");
  } else if (multipleDatesPattern.test(dateStr)) {
    const dateArray = dateStr.split(",");

    // Format each date and join them with " to "
    const formattedDates = dateArray.map((date) => {
      return format(new Date(date), "MMM, dd");
    });

    return formattedDates.join(" to ");
  } else {
    return "Invalid format";
  }
  // if (date ) {
  //   const dateArray = date.split(',');

  //   // Format each date and join them with " to "
  //   const formattedDates = dateArray.map((date) => {
  //     return format(new Date(date), 'MMM, dd');
  //   });

  //   return formattedDates.join(' to ');
  // }
  // return format(new Date(date), "MMM, dd");
};

onMounted(async () => {
  if (route.query.id) {
    detailId.value = route.query.id;
  }
  console.log(results.value);
  setStartAndEndDate();
  await getListUser();
});

const searchCount = computed(() => {
  let count = 0;
  if (search.value) {
    count = count + 1;
  }
  if (searchTime.value) {
    count = count + 1;
  }
  if (userFilter.value) {
    count = count + 1;
  }
  if (hotel_name.value) {
    count = count + 1;
  }
  if (attraction_name.value) {
    count = count + 1;
  }

  return count;
});

const adminAction = ref(false);
const hotelAction = ref(false);
const entranceAction = ref(false);

watch([adminAction], async ([newValue]) => {
  if (newValue == true) {
    if (admin.value == null) {
      await adminStore.getSimpleListAction();
    }
  }
});

const getReservationListAction = async () => {
  const res = await groupByStore.ReservationHotelList(watchSystem.value);
  console.log(res, "this is reservation list");
  // if (detailId.value == "") {
  //   await getDetailAction(res.result?.data[0]?.id);
  // }
};

const detailGetAction = (id) => {
  // detailId.value = id;
  getDetailAction(id);
  console.log(detailId.value);
};

const searchAction = async () => {
  filterShow.value = false;
  await groupByStore.ReservationHotelList(watchSystem.value);
};

watch(searchTime, async (newValue) => {
  await searchAction();
  searchModel.value = false;
  changeDate.value = "";
});

const getDateRangeCategory = (dateRange) => {
  if (!dateRange) return "other";

  const [startDateStr, endDateStr] = dateRange.split(",");
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday =
    formatDate(startDate) === formatDate(today) &&
    formatDate(endDate) === formatDate(today);

  const isTomorrow =
    formatDate(startDate) === formatDate(tomorrow) &&
    formatDate(endDate) === formatDate(tomorrow);

  const isNext7Days =
    formatDate(startDate) === formatDate(today) &&
    endDate.getTime() ===
      new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).getTime();

  const isNext30Days =
    formatDate(startDate) === formatDate(today) &&
    endDate.getTime() ===
      new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).getTime();

  if (isToday) return "today";
  if (isTomorrow) return "tomorrow";
  if (isNext7Days) return "7day";
  if (isNext30Days) return "30day";

  return "other";
};

watch(sale_daterange, (newValue) => {
  const category = getDateRangeCategory(newValue);

  switch (category) {
    case "today":
      console.log("The date range is today.");
      // Perform actions for today
      break;
    case "tomorrow":
      console.log("The date range is tomorrow.");
      // Perform actions for tomorrow
      break;
    case "7day":
      console.log("The date range is the next 7 days.");
      // Perform actions for the next 7 days
      break;
    case "30day":
      console.log("The date range is the next 30 days.");
      // Perform actions for the next 30 days
      break;
    default:
      changeDate.value = "";
      // Perform actions for other cases
      break;
  }
});

watch(dateRange, async (newValue) => {
  console.log(dateRange.value, "this is date");
  if (dateRange.value != "" && dateRange.value != null) {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };

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
  getReservationListAction();

  searchModel.value = false;
});
</script>

<template>
  <Layout :is_white="true">
    <div
      :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
      class="space-x-8 col-span-3 flex justify-start items-center transition-all duration-200 gap-2 text-sm pb-4 absolute top-6"
    >
      <p class="text-3xl font-medium text-[#FF613c]">
        Hotel Reservations
        <span class="w-2 h-2 bg-[#FF613c] rounded-full inline-block"></span>
        <span class="pl-2">{{ route.query.crm_id }}</span>
      </p>
    </div>
    <div class="grid gap-4 relative grid-cols-3">
      <transition name="slide">
        <div
          class="border shadow-sm rounded-lg px-4 py-2"
          :class="{
            hidden: showSide == 2,
            'col-span-1': showSide == 1,
            'col-span-2': showSide == 3,
          }"
        >
          <div class="pb-4 flex justify-start items-center gap-x-3 relative">
            <div
              @click="
                () => {
                  filterShow = !filterShow;
                  softShow = false;
                }
              "
              class="bg-blue-600 px-2 rounded-lg shadow py-1 flex justify-center items-center gap-x-2 text-white text-xs cursor-pointer"
            >
              <FunnelIcon class="w-5 h-5 text-white" />
              <p>Filter</p>
              <p>{{ searchCount }}</p>
            </div>
            <transition name="slide">
              <div
                v-if="filterShow"
                class="absolute top-full px-4 left-0 w-[300px] transition-all duration-150 bg-white rounded-lg shadow-lg z-50 border border-gray-100 space-y-2 max-h-[50vh] overflow-y-scroll overflow-x-hidden"
              >
                <div
                  class="flex justify-between items-center pt-4 border-b border-gray-100 pb-1 sticky top-0 bg-white"
                >
                  <p class="text-xs font-medium">Filter</p>
                  <!-- <XCircleIcon
                    class="w-6 h-6 text-[#FF613c] cursor-pointer"
                    @click="filterShow = !filterShow"
                  /> -->
                  <p class="text-[10px] cursor-pointer" @click="clearFilter">
                    clear
                  </p>
                </div>

                <p class="text-[10px]">User</p>
                <select
                  name=""
                  id=""
                  v-model="userFilter"
                  class="px-2 py-1 focus:outline-none border border-gray-300 placeholder-sm bg-white rounded-lg w-3/5 sm:w-3/5 text-[10px] md:w-full text-gray-400 space-y-2 h-9"
                >
                  <option :value="null" disabled class="bg-gray-200 text-sm">
                    Filter By User
                  </option>
                  <option value="" class="text-[12px]">All User</option>
                  <option
                    :value="key.id"
                    v-for="(key, index) in adminLists"
                    :key="index"
                    class="text-[12px]"
                  >
                    {{ key.name }}
                  </option>
                </select>
                <p class="text-[10px]">Service Date</p>
                <Modal :isOpen="searchModel" @closeModal="searchModel = false">
                  <DialogPanel
                    class="w-full max-w-lg transform rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
                  >
                    <DialogTitle
                      as="div"
                      class="text-xs flex justify-between items-center font-medium leading-6 text-gray-900 mb-5"
                    >
                      Select Date filter for booking date
                    </DialogTitle>
                    <div v-if="dateOnlyToggle">
                      <VueDatePicker
                        v-model="searchTime"
                        multi-calendars
                        :format="'yyyy-MM-dd'"
                        placeholder="Service Date"
                        text-input
                      />
                    </div>
                    <div v-if="!dateOnlyToggle">
                      <VueDatePicker
                        v-model="dateRange"
                        range
                        multi-calendars
                        :format="'yyyy-MM-dd'"
                        placeholder="Service Date range"
                        text-input
                      />
                    </div>
                  </DialogPanel>
                </Modal>
                <p
                  @click="searchModel = !searchModel"
                  class="text-[10px] text-gray-500 cursor-pointer px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <!-- Select Date -->
                  <span v-if="searchTime">{{
                    searchTime ? showFormat(formatDate(searchTime)) : ""
                  }}</span>
                  <span v-if="!searchTime">{{
                    sale_daterange ? showFormat(sale_daterange) : ""
                  }}</span>
                  <span v-if="!searchTime && !sale_daterange">Select Date</span>
                </p>

                <div class="relative w-full">
                  <p class="text-[10px] pb-2">Customer Name</p>
                  <input
                    type="search"
                    name=""
                    v-model="customerName"
                    placeholder="Search Customer name"
                    class="text-[10px] text-gray-500 focus:outline-none hover:text-gray-600 border border-gray-300 rounded-lg bg-white px-4 py-2 w-full"
                    id=""
                  />
                  <div
                    @click="searchAction"
                    class="absolute right-1 top-7 rounded-lg text-xs p-1 bg-[#FF613c]"
                  >
                    <MagnifyingGlassIcon class="w-4 h-4 text-white" />
                  </div>
                </div>

                <div class="">
                  <div class="flex justify-between items-center pb-2">
                    <p class="text-[10px]">Hotel</p>

                    <div class="flex justify-end items-center space-x-2">
                      <p
                        class="text-[10px] cursor-pointer"
                        @click="hotel_name = ''"
                      >
                        clear
                      </p>
                      <p
                        class="text-[10px] cursor-pointer"
                        @click="hotelAction = !hotelAction"
                      >
                        {{ !hotelAction ? "show" : "hide" }}
                      </p>
                    </div>
                  </div>
                  <div
                    v-if="!hotelAction"
                    @click="hotelAction = true"
                    class="text-sm text-gray-500 hover:text-gray-600 border border-gray-300 rounded-lg bg-white px-4 py-1.5 w-full"
                  >
                    <p class="text-[10px]">
                      {{ hotel_name ? hotel_name : "Hotel search" }}
                    </p>
                  </div>
                  <div v-if="hotelAction" class="w-full">
                    <HotelUnlimited @selectAction="ChangeHotelName" />
                  </div>
                </div>

                <div>
                  <p class="text-[10px] pb-2">Customer Payment Status</p>
                  <!-- customer payment status -->
                  <select
                    name=""
                    v-model="customerPaymentStatus"
                    id=""
                    class="border border-gray-300 px-4 focus:outline-none bg-gray-50 text-gray-400 w-full py-2 text-[10px] rounded-lg"
                  >
                    <option class="text-[10px]" value=""></option>
                    <option class="text-[10px]" value="fully_paid">
                      Fully paid
                    </option>
                    <option class="text-[10px]" value="partially_paid">
                      Partially paid
                    </option>
                    <option class="text-[10px]" value="not_paid">
                      Not paid
                    </option>
                  </select>
                </div>
                <div>
                  <p class="text-[10px] pb-2">Expense Status</p>
                  <!-- expense status -->
                  <select
                    v-model="expenseStatus"
                    name=""
                    id=""
                    class="border border-gray-300 px-4 focus:outline-none bg-gray-50 text-gray-400 w-full py-2 text-[10px] rounded-lg"
                  >
                    <option class="text-[10px]" value=""></option>
                    <option class="text-[10px]" value="fully_paid">
                      Fully paid
                    </option>
                    <option class="text-[10px]" value="partially_paid">
                      Partially paid
                    </option>
                    <option class="text-[10px]" value="not_paid">
                      Not paid
                    </option>
                  </select>
                </div>
                <div>
                  <p class="text-[10px] pb-2">Invoice Status</p>
                  <!-- expense status -->
                  <select
                    v-model="invoiceStatus"
                    name=""
                    id=""
                    class="border border-gray-300 px-4 focus:outline-none bg-gray-50 text-gray-400 w-full py-2 text-[10px] rounded-lg"
                  >
                    <option class="text-[10px]" value=""></option>
                    <option class="text-[10px]" value="receive">Receive</option>
                    <option class="text-[10px]" value="not_receive">
                      Not Receive
                    </option>
                  </select>
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
            <div
              class="bg-white shadow rounded-full border border-gray-100 p-2"
              @click="
                () => {
                  softShow = !softShow;
                  filterShow = false;
                }
              "
            >
              <ArrowsUpDownIcon class="w-3 h-3" />
            </div>
            <transition name="slide">
              <div
                v-if="softShow"
                class="absolute top-full pb-3 px-4 left-0 w-[250px] transition-all duration-150 bg-white rounded-lg shadow-lg z-50 border border-gray-100 space-y-2 max-h-[70vh] overflow-y-scroll"
              >
                <div
                  class="flex justify-between items-center pt-4 border-b border-gray-100 pb-1 sticky top-0 bg-white"
                >
                  <p class="text-xs font-medium">Sort</p>
                  <!-- <XCircleIcon
                    class="w-6 h-6 text-[#FF613c] cursor-pointer"
                    @click="softShow = !softShow"
                  /> -->
                  <p
                    class="text-[10px] cursor-pointer"
                    @click="
                      () => {
                        softShow = !softShow;
                        filterShow = false;
                      }
                    "
                  >
                    clear
                  </p>
                </div>
                <div class="space-y-1">
                  <div class="flex justify-between items-center">
                    <p class="text-[10px]">Sort By</p>
                    <select
                      name=""
                      id=""
                      v-model="sorting"
                      class="border border-gray-300 px-4 focus:outline-none bg-gray-50 text-gray-400 w-[50%] py-2 text-[10px] rounded-lg"
                    >
                      <option class="text-[10px]" value="desc">
                        Last to First
                      </option>
                      <option class="text-[10px]" value="asc">
                        First to Last
                      </option>
                    </select>
                  </div>
                  <div
                    class="flex justify-between items-center"
                    @click="customer_name = 'service_date'"
                  >
                    <div class="flex justify-start items-center">
                      <input
                        type="checkbox"
                        name="sort-by"
                        id="id"
                        :checked="customer_name == 'service_date'"
                      />
                      <p class="text-xs py-2 px-4">Service Date</p>
                    </div>
                  </div>
                  <div
                    class="flex justify-start items-center"
                    @click="customer_name = 'expense_status'"
                  >
                    <input
                      type="checkbox"
                      name="sort-by"
                      id="id"
                      :checked="customer_name == 'expense_status'"
                    />
                    <p class="text-xs py-2 px-4">Expense Status</p>
                  </div>
                  <div
                    class="flex justify-start items-center"
                    @click="customer_name = 'payment_status'"
                  >
                    <input
                      type="checkbox"
                      name="sort-by"
                      id="id"
                      :checked="customer_name == 'payment_status'"
                    />
                    <p class="text-xs py-2 px-4">C. Payment Status</p>
                  </div>
                </div>
                <div
                  @click="
                    () => {
                      searchAction();
                      softShow = !softShow;
                      filterShow = false;
                    }
                  "
                  class="bg-[#FF613c] text-white px-1.5 cursor-pointer inline-block rounded-lg text-sm w-full py-1.5 text-center"
                >
                  sort
                </div>
              </div>
            </transition>
            <div class="relative w-full">
              <input
                type="search"
                name=""
                v-model="searchId"
                placeholder="Search CRM ID"
                class="w-full px-4 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                id=""
              />
              <div
                @click="searchAction"
                class="absolute right-1 top-1 rounded-lg text-xs p-1 bg-[#FF613c]"
              >
                <MagnifyingGlassIcon class="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <div
            class="flex justify-start items-center overflow-x-scroll no-sidebar-container pt-0.5 space-x-3 pb-2"
          >
            <p
              @click="clearFilter"
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap bg-red-500 text-white cursor-pointer"
            >
              clear
            </p>
            <p
              v-if="search == 'App\\Models\\PrivateVanTour'"
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap"
            >
              Van Tour
            </p>
            <p
              v-if="search == 'App\\Models\\Hotel'"
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap"
            >
              Hotel
            </p>
            <p
              v-if="search == 'App\\Models\\EntranceTicket'"
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap"
            >
              Attraction
            </p>
            <p
              v-if="search == 'App\\Models\\Airline'"
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap"
            >
              Airline
            </p>
            <p
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap relative"
              v-if="searchId != ''"
            >
              <XCircleIcon
                class="w-4 h-4 text-[#FF613c] cursor-pointer absolute -top-1 -right-2"
                @click="
                  () => {
                    searchId = '';
                    searchAction();
                  }
                "
              />
              {{ searchId }}
            </p>
            <p
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap relative"
              v-if="customerName != ''"
            >
              <XCircleIcon
                class="w-4 h-4 text-[#FF613c] cursor-pointer absolute -top-1 -right-2"
                @click="
                  () => {
                    customerName = '';
                    searchAction();
                  }
                "
              />
              {{ customerName }}
            </p>
            <p
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap relative"
              v-if="userName != '' && userName != undefined"
            >
              <XCircleIcon
                class="w-4 h-4 text-[#FF613c] cursor-pointer absolute -top-1 -right-2"
                @click="
                  () => {
                    userFilter = '';
                    searchAction();
                  }
                "
              />
              {{ userName }}
            </p>
            <p
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap relative"
              v-if="!searchTime && !sale_daterange == ''"
            >
              <XCircleIcon
                class="w-4 h-4 text-[#FF613c] cursor-pointer absolute -top-1 -right-2"
                @click="
                  () => {
                    sale_daterange = '';
                    searchAction();
                  }
                "
              />
              {{ showFormat(sale_daterange) }}
            </p>
            <p
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap relative"
              v-if="searchTime"
            >
              <XCircleIcon
                class="w-4 h-4 text-[#FF613c] cursor-pointer absolute -top-1 -right-2"
                @click="
                  () => {
                    searchTime = '';
                    searchAction();
                  }
                "
              />
              {{ showFormat(formatDate(searchTime)) }}
            </p>
            <p
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap"
              v-if="customer_name"
            >
              sort: {{ customer_name }}
            </p>
            <p
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap"
              v-if="attraction_name"
            >
              {{ attraction_name }}
            </p>
          </div>
          <div class="flex justify-between items-center pb-2">
            <div class="col-span-2">
              <div
                class="flex w-full text-[10px] justify-end items-center gap-4"
              >
                <p
                  @click="changeServiceDate('today')"
                  class="flex gap-2 justify-start items-center cursor-pointer"
                  :class="
                    changeDate == 'today' ? ' text-[#FF5B00]' : 'text-black'
                  "
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
                  :class="
                    changeDate == '7day' ? ' text-[#FF5B00]' : 'text-black'
                  "
                >
                  <span
                    class="w-2 h-2 rounded-full whitespace-nowrap bg-[#FF5B00]"
                    v-if="changeDate == '7day'"
                  ></span
                  >Next 7 Days
                </p>
              </div>
            </div>
            <div
              class="text-[10px] rounded-lg px-2 py-1 text-white bg-[#FF613c]"
            >
              {{ results?.meta?.total }} reser
            </div>
          </div>
          <div
            v-if="!loading"
            class="bg-white shadow rounded-lg divide-y divide-gray-100 max-h-[62vh] overflow-y-scroll"
          >
            <div class="relative" v-for="i in results?.data ?? []" :key="i">
              <!-- <div
                @click="getDetailAction(i.bookings[0]?.id)"
                class="absolute top-7 text-[10px] z-30 cursor-pointer right-2 px-2 py-0.5 rounded-lg bg-[#FF613c] text-white"
              >
                Detial
              </div> -->
              <ListReservation
                :data="i"
                :detailId="detailId"
                @detailId="detailGetAction"
              />
            </div>
          </div>
          <div class="overflow-x-scroll no-sidebar-container py-2">
            <Pagination
              v-if="!loading"
              :data="results"
              @change-page="changePage"
            />
          </div>
          <div
            v-if="loading"
            class="bg-white shadow rounded-lg divide-y-4 divide-gray-200 max-h-[75vh] overflow-y-scroll"
          >
            <div class="" v-for="i in 10 ?? []" :key="i">
              <ReservationCartLoadingVue />
            </div>
          </div>
        </div>
      </transition>

      <transition name="slide">
        <div
          @click="
            () => {
              filterShow = false;
              softShow = false;
            }
          "
          class="relative"
          :class="{
            'col-span-2': showSide == 1,
            'col-span-1': showSide == 3,
            'col-span-3': showSide == 2,
          }"
        >
          <div class="absolute -top-4 -left-0 z-20">
            <ChevronLeftIcon
              class="w-6 cursor-pointer h-6 bg-white shadow-md border border-gray-200 p-1.5 rounded-full"
              @click="showSide = 2"
              v-if="showSide == 1"
            />
            <ChevronRightIcon
              class="w-6 cursor-pointer h-6 bg-white shadow-md border border-gray-200 p-1.5 rounded-full"
              @click="showSide = 1"
              v-if="showSide == 2"
            />
          </div>
          <div class="absolute -top-4 -left-10 z-20">
            <ChevronRightIcon
              class="w-6 cursor-pointer h-6 bg-white shadow-md border border-gray-200 p-1.5 rounded-full"
              @click="showSide = 3"
              v-if="showSide == 1"
            />
            <ChevronLeftIcon
              class="w-6 cursor-pointer h-6 bg-white shadow-md border border-gray-200 p-1.5 rounded-full"
              @click="showSide = 1"
              v-if="showSide == 3"
            />
          </div>
          <div
            class="rounded-lg h-[85vh] transition duration-150 overflow-y-scroll no-scrollbar"
          >
            <ReservationDetail :show="showSide" />
          </div>
        </div>
      </transition>
    </div>
  </Layout>
</template>

<style scoped>
/* Slide-in and slide-out animations */
.slide-enter-active {
  animation: slideIn 0.3s ease-out;
}

.slide-leave-active {
  animation: slideOut 0.3s ease-in;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}
</style>
