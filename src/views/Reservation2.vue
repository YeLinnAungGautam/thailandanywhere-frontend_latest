<script setup>
import { storeToRefs } from "pinia";
import { useReservationStore } from "../stores/reservation";
import Layout from "./Layout.vue";
import ListReservation from "./Reservation2Component/ListReservation.vue";
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
import ReservationDetail from "./Reservation2Component/ReservationDetail.vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter, useRoute } from "vue-router";
import { useAdminStore } from "../stores/admin";
import { useHotelStore } from "../stores/hotel";
import Modal from "../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useEntranceStore } from "../stores/entrance";
import AttractionUnlimited from "./Reservation2Component/AttractionUnlimited.vue";
import HotelUnlimited from "./Reservation2Component/HotelUnlimited.vue";
import { XCircleIcon } from "@heroicons/vue/24/solid";
import { format } from "date-fns";
const reservationStore = useReservationStore();
const { reservations, loading } = storeToRefs(reservationStore);
const authStore = useAuthStore();

const router = useRouter();
const adminStore = useAdminStore();
const hotelStore = useHotelStore();
const entranceStore = useEntranceStore();
const route = useRoute();
const { hotels } = storeToRefs(hotelStore);
const { entrances } = storeToRefs(entranceStore);

// filter keys
const limit = ref(10);
const search = ref("");
const searchId = ref("");
const hotel_name = ref("");
const attraction_name = ref("");
const userFilter = ref("");
const dateRange = ref(null);
const searchTime = ref("");
const empty_unit_cost = ref("");
const sale_daterange = ref(null);
const booking_daterange = ref(null);
const customer_name = ref("service_date");
const sorting = ref("");
const dateOnlyToggle = ref(false);
const searchA = ref("");
const showSide = ref(1);
const changeDate = ref(null);
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
  await reservationStore.getChangePage(url, watchSystem.value);
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

  if (authStore.isSuperAdmin || authStore.isReservation) {
    result.user_id = "";
  } else {
    result.user_id = authStore.user.id;
  }
  if (search.value != "" && search.value != undefined) {
    result.product_type = search.value;
  } else {
    search.value = "App\\Models\\EntranceTicket";
    result.product_type = "App\\Models\\EntranceTicket";
  }
  if (searchId.value != "" && searchId.value != undefined) {
    result.crm_id = searchId.value;
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
  // if (sorting.value != "") {
  result.order_direction = "desc";
  // }

  console.log(result);
  return result;
});

const detailId = ref("");
const getDetailAction = async (id) => {
  detailId.value = id;
  router.push({
    name: "reservation-second",
    query: {
      id: detailId.value,
    },
  });

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
  console.log(reservations.value);
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
  const res = await reservationStore.getListAction(watchSystem.value);
  console.log(res, "this is reservation list");
  if (detailId.value == "") {
    await getDetailAction(res.result?.data[0]?.id);
  }
};

const searchAction = async () => {
  filterShow.value = false;
  await reservationStore.getListAction(watchSystem.value);
};

watch(searchTime, async (newValue) => {
  await searchAction();
  searchModel.value = false;
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
    <div class="grid gap-4 relative grid-cols-3">
      <transition name="slide">
        <div
          class="border shadow-sm rounded-lg p-4"
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
                <p class="text-[10px] pt-1">Product Type</p>
                <div class="">
                  <div
                    class="flex items-center justify-start gap-1 overflow-x-scroll no-sidebar-container"
                  >
                    <!-- <p
                      class="text-[10px] px-2 cursor-pointer hover:bg-[#ff613c] hover:text-white hover:shadow-md py-1 border border-gray-200 rounded-lg"
                      @click="searchValue('App\\Models\\Hotel')"
                      :class="
                        search == 'App\\Models\\Hotel'
                          ? 'bg-[#ff613c] text-white'
                          : ''
                      "
                    >
                      Hotel
                    </p> -->
                    <p
                      class="text-[10px] px-2 cursor-pointer hover:bg-[#ff613c] hover:text-white hover:shadow-md py-1 border whitespace-nowrap border-gray-200 rounded-lg"
                      @click="searchValue('App\\Models\\EntranceTicket')"
                      :class="
                        search == 'App\\Models\\EntranceTicket'
                          ? 'bg-[#ff613c] text-white'
                          : ''
                      "
                    >
                      Entrance Ticket
                    </p>
                    <!-- <p
                      class="text-[10px] px-2 whitespace-nowrap cursor-pointer hover:bg-[#ff613c] hover:text-white hover:shadow-md py-1 border border-gray-200 rounded-lg"
                      @click="searchValue('App\\Models\\PrivateVanTour')"
                      :class="
                        search == 'App\\Models\\PrivateVanTour'
                          ? 'bg-[#ff613c] text-white'
                          : ''
                      "
                    >
                      Private Van tour
                    </p>
                    <p
                      class="text-[10px] px-2 cursor-pointer hover:bg-[#ff613c] hover:text-white hover:shadow-md py-1 border border-gray-200 rounded-lg"
                      @click="searchValue('App\\Models\\Airline')"
                      :class="
                        search == 'App\\Models\\Airline'
                          ? 'bg-[#ff613c] text-white'
                          : ''
                      "
                    >
                      Airline
                    </p> -->
                  </div>
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
                <!-- <div>
                  <VueDatePicker
                    v-model="searchTime"
                    :format="'yyyy-MM-dd'"
                    placeholder="Service Date"
                    text-input
                  />
                </div> -->
                <Modal :isOpen="searchModel" @closeModal="searchModel = false">
                  <DialogPanel
                    class="w-full max-w-lg transform rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
                  >
                    <DialogTitle
                      as="div"
                      class="text-xs flex justify-between items-center font-medium leading-6 text-gray-900 mb-5"
                    >
                      Select Date
                      <div
                        @click="dateOnlyToggle = !dateOnlyToggle"
                        class="flex justify-end items-center gap-2"
                      >
                        <p class="text-xs">date only filter</p>
                        <label
                          class="inline-flex items-center cursor-pointer"
                          v-if="dateOnlyToggle"
                        >
                          <input
                            type="checkbox"
                            value=""
                            class="sr-only peer"
                            disabled
                          />
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
                        <p class="text-xs">date range filter</p>
                      </div>
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

                <div class="" v-if="search == 'App\\Models\\Hotel'">
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
                <div class="" v-if="search == 'App\\Models\\EntranceTicket'">
                  <div class="flex justify-between items-center pb-2">
                    <p class="text-[10px]">Attraction</p>

                    <div class="flex justify-end items-center space-x-2">
                      <p
                        class="text-[10px] cursor-pointer"
                        @click="attraction_name = ''"
                      >
                        clear
                      </p>
                      <p
                        class="text-[10px] cursor-pointer"
                        @click="entranceAction = !entranceAction"
                      >
                        {{ !entranceAction ? "show" : "hide" }}
                      </p>
                    </div>
                  </div>
                  <div
                    v-if="!entranceAction"
                    @click="entranceAction = true"
                    class="text-sm text-gray-500 hover:text-gray-600 border border-gray-300 rounded-lg bg-white px-4 py-1.5 w-full"
                  >
                    <p class="text-[10px]">
                      {{
                        attraction_name ? attraction_name : "Attraction search"
                      }}
                    </p>
                  </div>
                  <div v-if="entranceAction" class="w-full">
                    <AttractionUnlimited @selectAction="ChangeAttractionName" />
                  </div>
                </div>
                <div>
                  <p class="text-[10px] pb-2">Customer Payment Status</p>
                  <!-- customer payment status -->
                  <select
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
                  <p class="text-[10px] pb-2">Expense Status</p>
                  <!-- expense status -->
                  <select
                    name=""
                    id=""
                    class="border border-gray-300 px-4 focus:outline-none bg-gray-50 text-gray-400 w-full py-2 text-[10px] rounded-lg"
                  >
                    <option class="text-[10px]" value=""></option>
                    <option class="text-[10px]" value="fully_paid">
                      Fully paid
                    </option>

                    <option class="text-[10px]" value="not_paid">
                      Not paid
                    </option>
                  </select>
                </div>
                <div>
                  <p class="text-[10px] pb-2">Passport Status</p>
                  <!-- passport status -->
                  <select
                    name=""
                    id=""
                    class="border border-gray-300 px-4 focus:outline-none bg-gray-50 text-gray-400 w-full py-2 text-[10px] rounded-lg"
                  >
                    <option class="text-[10px]" value=""></option>
                    <option class="text-[10px]" value="missing">Missing</option>

                    <option class="text-[10px]" value="included">
                      Included
                    </option>
                  </select>
                </div>
                <div>
                  <p class="text-[10px] pb-2">Booking Status</p>
                  <!-- passport status -->
                  <select
                    name=""
                    id=""
                    class="border border-gray-300 px-4 focus:outline-none bg-gray-50 text-gray-400 w-full py-2 text-[10px] rounded-lg"
                  >
                    <option class="text-[10px]" value=""></option>
                    <option class="text-[10px]" value="email_sent">
                      Email Sent
                    </option>

                    <option class="text-[10px]" value="email_not_sent">
                      Email not Sent
                    </option>
                  </select>
                </div>
                <div>
                  <p class="text-[10px] pb-2">Confirmation</p>
                  <!-- passport status -->
                  <select
                    name=""
                    id=""
                    class="border border-gray-300 px-4 focus:outline-none bg-gray-50 text-gray-400 w-full py-2 text-[10px] rounded-lg"
                  >
                    <option class="text-[10px]" value=""></option>
                    <option class="text-[10px]" value="included">
                      Included
                    </option>

                    <option class="text-[10px]" value="not_included">
                      Not Included
                    </option>
                  </select>
                </div>
                <div class="">
                  <p class="text-[10px] pb-2">Invoice</p>
                  <!-- passport status -->
                  <select
                    name=""
                    id=""
                    class="border border-gray-300 px-4 focus:outline-none bg-gray-50 text-gray-400 w-full py-2 text-[10px] rounded-lg"
                  >
                    <option class="text-[10px]" value=""></option>
                    <option class="text-[10px]" value="included">
                      Included
                    </option>

                    <option class="text-[10px]" value="not_included">
                      Not Included
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
                class="absolute top-full pb-3 px-4 left-0 w-[200px] transition-all duration-150 bg-white rounded-lg shadow-lg z-50 border border-gray-100 space-y-2 max-h-[70vh] overflow-y-scroll"
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
                  <div
                    class="flex justify-start items-center"
                    @click="customer_name = 'service_date'"
                  >
                    <input
                      type="checkbox"
                      name="sort-by"
                      id="id"
                      :checked="customer_name == 'service_date'"
                    />
                    <p class="text-xs py-2 px-4">Service Date</p>
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
          <div class="flex justify-end items-center pb-2">
            <div
              class="text-[10px] rounded-lg px-2 py-1 text-white bg-[#FF613c]"
            >
              Search Results: {{ reservations?.meta?.total }} reser
            </div>
          </div>
          <div
            v-if="!loading"
            class="bg-white shadow rounded-lg divide-y divide-gray-100 max-h-[62vh] overflow-y-scroll"
          >
            <div
              class=""
              v-for="i in reservations?.data ?? []"
              :key="i"
              @click="getDetailAction(i.id)"
            >
              <ListReservation :data="i" :detailId="detailId" />
            </div>
          </div>
          <div class="overflow-x-scroll no-sidebar-container py-2">
            <Pagination
              v-if="!loading"
              :data="reservations"
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
            class="border shadow-sm rounded-lg p-4 h-[85vh] transition duration-150 overflow-y-scroll no-scrollbar"
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
