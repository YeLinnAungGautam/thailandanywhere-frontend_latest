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
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import ReservationDetail from "./Reservation2Component/ReservationDetail.vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter, useRoute } from "vue-router";
import { useAdminStore } from "../stores/admin";
import { useHotelStore } from "../stores/hotel";
import { useEntranceStore } from "../stores/entrance";
import AttractionUnlimited from "./Reservation2Component/AttractionUnlimited.vue";
import HotelUnlimited from "./Reservation2Component/HotelUnlimited.vue";
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
const customer_name = ref("");
const sorting = ref("");
const dateOnlyToggle = ref(false);

const showSide = ref(false);

const filterShow = ref(false);
const softShow = ref(false);

const userName = computed(() => {
  const filteredUser = adminLists?.value.find(
    (user) => user.id === userFilter.value
  );
  return filteredUser ? filteredUser.name : undefined;
});

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
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Add 90 days to startOfMonth to get the end date
  const endOfMonth = new Date(startOfMonth); // Create a copy of startOfMonth
  endOfMonth.setDate(endOfMonth.getDate() + 90);

  dateRange.value = [startOfMonth, endOfMonth];
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
  if (hotel_name.value != "" && hotel_name.value != undefined) {
    result.hotel_name = hotel_name.value;
  }
  if (attraction_name.value != "" && attraction_name.value != undefined) {
    result.attraction_name = attraction_name.value;
  }
  if (searchTime.value != "" && searchTime.value != undefined) {
    result.service_date = formatDate(searchTime.value);
  }
  if (empty_unit_cost.value != "" && empty_unit_cost.value != false) {
    result.empty_unit_cost = empty_unit_cost.value;
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
  }

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
  if (detailId == "") {
    await getDetailAction(res.result?.data[0]?.id);
  }
};

const searchAction = async () => {
  filterShow.value = false;
  await reservationStore.getListAction(watchSystem.value);
};

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
});
</script>

<template>
  <Layout :is_white="true">
    <div class="grid gap-4 relative grid-cols-3">
      <transition name="slide">
        <div class="border shadow-sm rounded-lg p-4" v-if="showSide">
          <div class="pb-4 flex justify-start items-center gap-x-3 relative">
            <div
              @click="filterShow = !filterShow"
              class="bg-blue-600 px-2 rounded-lg shadow py-1 flex justify-center items-center gap-x-2 text-white text-xs cursor-pointer"
            >
              <FunnelIcon class="w-5 h-5 text-white" />
              <p>Filter</p>
              <p>{{ searchCount }}</p>
            </div>
            <transition name="slide">
              <div
                v-if="filterShow"
                class="absolute top-full pb-3 px-4 left-0 w-[300px] transition-all duration-150 bg-white rounded-lg shadow-lg z-50 border border-gray-100 space-y-2 max-h-[50vh] overflow-y-scroll overflow-x-hidden"
              >
                <div
                  class="flex justify-between items-center pt-4 border-b border-gray-100 pb-1 sticky top-0 bg-white"
                >
                  <p class="text-xs font-medium">Filter</p>
                  <XCircleIcon
                    class="w-6 h-6 text-[#FF613c] cursor-pointer"
                    @click="filterShow = !filterShow"
                  />
                </div>
                <p class="text-[10px] pt-1">Product Type</p>
                <div class="">
                  <div
                    class="flex items-center justify-start gap-1 overflow-x-scroll no-sidebar-container"
                  >
                    <p
                      class="text-[10px] px-2 cursor-pointer hover:bg-[#ff613c] hover:text-white hover:shadow-md py-1 border border-gray-200 rounded-lg"
                      @click="searchValue('App\\Models\\Hotel')"
                      :class="
                        search == 'App\\Models\\Hotel'
                          ? 'bg-[#ff613c] text-white'
                          : ''
                      "
                    >
                      Hotel
                    </p>
                    <p
                      class="text-[10px] px-2 cursor-pointer hover:bg-[#ff613c] hover:text-white hover:shadow-md py-1.5 border whitespace-nowrap border-gray-200 rounded-lg"
                      @click="searchValue('App\\Models\\EntranceTicket')"
                      :class="
                        search == 'App\\Models\\EntranceTicket'
                          ? 'bg-[#ff613c] text-white'
                          : ''
                      "
                    >
                      Entrance Ticket
                    </p>
                    <p
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
                    </p>
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
                <div>
                  <VueDatePicker
                    v-model="searchTime"
                    :format="'yyyy-MM-dd'"
                    placeholder="Service Date"
                    text-input
                  />
                </div>
                <p class="text-[10px]">Product</p>
                <div
                  class="flex justify-center items-center"
                  v-if="search == 'App\\Models\\Hotel'"
                >
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
                    <div class="flex justify-between items-center pb-2">
                      <p class="text-[10px]">Hotel</p>
                      <XMarkIcon
                        class="w-4 h-4 cursor-pointer"
                        @click="hotelAction = !hotelAction"
                      />
                    </div>
                    <HotelUnlimited @selectAction="ChangeHotelName" />
                  </div>
                </div>
                <div
                  class="flex justify-center items-center"
                  v-if="search == 'App\\Models\\EntranceTicket'"
                >
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
                    <div class="flex justify-between items-center pb-2">
                      <p class="text-[10px]">Attraction</p>
                      <XMarkIcon
                        class="w-4 h-4 cursor-pointer"
                        @click="entranceAction = !entranceAction"
                      />
                    </div>
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
                <div>
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
              </div>
            </transition>
            <div
              class="bg-white shadow rounded-full border border-gray-100 p-2"
              @click="softShow = !softShow"
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
                  <XCircleIcon
                    class="w-6 h-6 text-[#FF613c] cursor-pointer"
                    @click="softShow = !softShow"
                  />
                </div>
                <div class="space-y-1">
                  <div class="flex justify-start items-center">
                    <input type="checkbox" name="sort-by" id="id" />
                    <p class="text-xs py-2 px-4">Service Date</p>
                  </div>
                  <div class="flex justify-start items-center">
                    <input type="checkbox" name="sort-by" id="id" />
                    <p class="text-xs py-2 px-4">Expense Status</p>
                  </div>
                  <div class="flex justify-start items-center">
                    <input type="checkbox" name="sort-by" id="id" />
                    <p class="text-xs py-2 px-4">C. Payment Status</p>
                  </div>
                </div>
              </div>
            </transition>
            <input
              type="search"
              name=""
              v-model="searchId"
              placeholder="Search CRM ID"
              class="w-full px-4 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
              id=""
            />
            <p
              class="text-[12px] bg-[#FF613c] px-2 py-1.5 rounded-lg text-white cursor-pointer"
              @click="searchAction"
            >
              Search
            </p>
          </div>
          <div class="flex justify-start items-center space-x-2 pb-4">
            <p
              v-if="search == 'App\\Models\\PrivateVanTour'"
              class="text-[12px] shadow px-2 py-0.5 rounded-lg"
            >
              Van Tour
            </p>
            <p
              v-if="search == 'App\\Models\\Hotel'"
              class="text-[12px] shadow px-2 py-0.5 rounded-lg"
            >
              Hotel
            </p>
            <p
              v-if="search == 'App\\Models\\EntranceTicket'"
              class="text-[12px] shadow px-2 py-0.5 rounded-lg"
            >
              Attraction
            </p>
            <p
              v-if="search == 'App\\Models\\Airline'"
              class="text-[12px] shadow px-2 py-0.5 rounded-lg"
            >
              Airline
            </p>
            <p
              class="text-[12px] shadow px-2 py-0.5 rounded-lg"
              v-if="userName != undefined"
            >
              {{ userName }}
            </p>
            <p
              class="text-[12px] shadow px-2 py-0.5 rounded-lg"
              v-if="!searchTime"
            >
              {{ sale_daterange }}
            </p>
            <p
              class="text-[12px] shadow px-2 py-0.5 rounded-lg"
              v-if="searchTime"
            >
              {{ formatDate(searchTime) }}
            </p>
          </div>
          <div
            v-if="!loading"
            class="bg-white shadow rounded-lg divide-y divide-gray-100 max-h-[65vh] overflow-y-scroll"
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
          <div class="overflow-x-scroll scroll-container py-2">
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
        <div class="relative" :class="showSide ? 'col-span-2' : 'col-span-3'">
          <div
            class="absolute top-1/2 -left-4 z-20"
            @click="showSide = !showSide"
          >
            <ChevronLeftIcon
              class="w-6 cursor-pointer h-6 bg-[#FF613c] text-white shadow p-1.5 rounded-full"
              v-if="showSide"
            />
            <ChevronRightIcon
              class="w-6 cursor-pointer h-6 bg-[#FF613c] text-white shadow p-1.5 rounded-full"
              v-if="!showSide"
            />
          </div>

          <div
            class="border shadow-sm rounded-lg p-4 h-[85vh] transition duration-150 overflow-y-scroll"
          >
            <ReservationDetail />
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
