<template>
  <Layout :is_white="true">
    <div
      :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
      class="space-x-8 col-span-3 flex justify-start items-center transition-all duration-200 gap-2 text-sm pb-4 absolute top-6"
    >
      <p class="text-3xl font-medium text-[#FF613c]">
        Reservation Group Attractions
        <span class="w-2 h-2 bg-[#FF613c] rounded-full inline-block"></span>
        <!-- <span class="pl-2">{{ route.query.id }}</span> -->
      </p>
    </div>
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
                class="absolute top-full px-4 left-0 w-[300px] transition-all duration-150 bg-white rounded-lg shadow-lg z-50 border border-gray-100 space-y-2 max-h-[50vh] overflow-y-scroll"
              >
                <div
                  class="flex justify-between items-center pt-4 border-b border-gray-100 pb-1 sticky top-0 bg-white"
                >
                  <p class="text-xs font-medium">Filter</p>

                  <p class="text-[10px] cursor-pointer" @click="clearFilter">
                    clear
                  </p>
                </div>
                <p class="text-[10px] pt-1">Product Type</p>
                <div class="">
                  <div
                    class="flex items-center justify-start gap-1 overflow-x-scroll no-sidebar-container"
                  >
                    <p
                      class="text-[10px] px-2 cursor-pointer hover:bg-[#ff613c] hover:text-white hover:shadow-md py-1 border whitespace-nowrap border-gray-200 rounded-lg"
                    >
                      Entrance Ticket
                    </p>
                  </div>
                </div>
                <p class="text-[10px]">User</p>
                <select
                  name=""
                  id=""
                  v-model="searchKey.user_id"
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
                      Select Date filter for booking date
                    </DialogTitle>

                    <div>
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
                  <span v-if="!searchTime">{{
                    searchKey.booking_daterange
                      ? showFormat(searchKey.booking_daterange)
                      : ""
                  }}</span>
                  <span v-if="!searchKey.booking_daterange">Select Date</span>
                </p>

                <div class="relative w-full">
                  <p class="text-[10px] pb-2">Customer Name</p>
                  <input
                    type="search"
                    name=""
                    v-model="searchKey.customer_name"
                    placeholder="Search Customer name"
                    class="text-[10px] text-gray-500 focus:outline-none hover:text-gray-600 border border-gray-300 rounded-lg bg-white px-4 py-2 w-full"
                    id=""
                  />
                </div>

                <div class="">
                  <div class="flex justify-between items-center pb-2">
                    <p class="text-[10px]">Attraction</p>

                    <div class="flex justify-end items-center space-x-2">
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
                        searchKey.product_name
                          ? searchKey.product_name
                          : "Attraction search"
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
                    v-model="searchKey.payment_status"
                    id=""
                    class="border border-gray-300 px-4 focus:outline-none w-full py-2 text-[10px] rounded-lg"
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
                    v-model="searchKey.expense_item_status"
                    name=""
                    id=""
                    class="border border-gray-300 px-4 focus:outline-none w-full py-2 text-[10px] rounded-lg"
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
                    v-model="searchKey.invoice_status"
                    name=""
                    id=""
                    class="border border-gray-300 px-4 focus:outline-none w-full py-2 text-[10px] rounded-lg"
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
                v-model="searchKey.crm_id"
                placeholder="Search by ID"
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
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap relative"
              v-if="searchKey.customer_name != ''"
            >
              <XCircleIcon
                class="w-4 h-4 text-[#FF613c] cursor-pointer absolute -top-1 -right-2"
                @click="
                  () => {
                    searchKey.customer_name = '';
                    searchAction();
                  }
                "
              />
              {{ searchKey.customer_name }}
            </p>
            <p
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap relative"
              v-if="searchKey.crm_id != ''"
            >
              <XCircleIcon
                class="w-4 h-4 text-[#FF613c] cursor-pointer absolute -top-1 -right-2"
                @click="
                  () => {
                    searchKey.crm_id = '';
                    searchAction();
                  }
                "
              />
              {{ searchKey.crm_id }}
            </p>
            <p
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap relative"
              v-if="searchKey.product_name != ''"
            >
              <XCircleIcon
                class="w-4 h-4 text-[#FF613c] cursor-pointer absolute -top-1 -right-2"
                @click="
                  () => {
                    searchKey.product_name = '';
                    searchAction();
                  }
                "
              />
              {{ searchKey.product_name }}
            </p>
            <p
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap relative"
              v-if="searchKey.payment_status != ''"
            >
              <XCircleIcon
                class="w-4 h-4 text-[#FF613c] cursor-pointer absolute -top-1 -right-2"
                @click="
                  () => {
                    searchKey.payment_status = '';
                    searchAction();
                  }
                "
              />
              P: {{ searchKey.payment_status }}
            </p>
            <p
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap relative"
              v-if="searchKey.expense_item_status != ''"
            >
              <XCircleIcon
                class="w-4 h-4 text-[#FF613c] cursor-pointer absolute -top-1 -right-2"
                @click="
                  () => {
                    searchKey.expense_item_status = '';
                    searchAction();
                  }
                "
              />
              E: {{ searchKey.expense_item_status }}
            </p>
            <p
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap relative"
              v-if="searchKey.invoice_status != ''"
            >
              <XCircleIcon
                class="w-4 h-4 text-[#FF613c] cursor-pointer absolute -top-1 -right-2"
                @click="
                  () => {
                    searchKey.invoice_status = '';
                    searchAction();
                  }
                "
              />
              I: {{ searchKey.invoice_status }}
            </p>
            <p
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap relative"
              v-if="searchKey.booking_daterange != ''"
            >
              <XCircleIcon
                class="w-4 h-4 text-[#FF613c] cursor-pointer absolute -top-1 -right-2"
                @click="
                  () => {
                    searchKey.booking_daterange = '';
                    dateRange = '';
                    searchAction();
                  }
                "
              />
              {{ showFormat(searchKey.booking_daterange) }}
            </p>
          </div>
          <div class="flex justify-end items-center space-x-2">
            <div
              v-if="authStore.isSuperAdmin"
              class="text-[10px] rounded-lg px-2 py-1 text-white bg-[#FF613c]"
            >
              {{ formattedNumber(expense_total_amount) }}
            </div>
            <div
              class="text-[10px] rounded-lg px-2 py-1 text-white bg-[#FF613c]"
            >
              {{ groups?.meta?.total }} reser
            </div>
          </div>

          <div
            v-if="!loading"
            class="bg-white shadow rounded-lg divide-y divide-gray-100 max-h-[65vh] overflow-y-scroll"
          >
            <div
              class=""
              v-for="i in groups?.data ?? []"
              :key="i"
              @click="getDetailAction(i.id)"
            >
              <ListGroup :data="i" />
            </div>
          </div>
          <div class="overflow-x-scroll no-sidebar-container py-2">
            <Pagination
              v-if="!loading"
              :data="groups"
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
            class="border shadow-sm relative rounded-lg p-4 h-[85vh] transition duration-150 overflow-y-scroll no-scrollbar"
          >
            <GroupDetail :show="showSide" />
          </div>
        </div>
      </transition>
    </div>
  </Layout>
</template>

<script setup>
import Layout from "./Layout.vue";
import Modal from "../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { computed, onMounted, ref } from "vue";
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
import { storeToRefs } from "pinia";
import ReservationCartLoadingVue from "./Dashboard/ReservationCartLoading.vue";
import { useRoute, useRouter } from "vue-router";
import { useSidebarStore } from "../stores/sidebar";
// import ListTax from "./TaxComponent/ListTax.vue";
import ListGroup from "./GroupComponent/ListGroup.vue";
import { useGroupStore } from "../stores/group";
import GroupDetail from "./GroupComponent/GroupDetail.vue";
import { useAdminStore } from "../stores/admin";
import AttractionUnlimited from "./Reservation2Component/AttractionUnlimited.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import { watch } from "vue";
import { format } from "date-fns";
import { XCircleIcon } from "@heroicons/vue/24/solid";
import { formattedNumber } from "./help/FormatData";
import { useAuthStore } from "../stores/auth";

const showSide = ref(1);
const filterShow = ref(false);
const router = useRouter();
const route = useRoute();
const softShow = ref(false);
const groupStore = useGroupStore();
const { groups, loading } = storeToRefs(groupStore);
const sidebarStore = useSidebarStore();
const { isShowSidebar } = storeToRefs(sidebarStore);
const adminStore = useAdminStore();
const searchModel = ref(false);
const authStore = useAuthStore();

const searchKey = ref({
  crm_id: "",
  product_name: "",
  invoice_status: "",
  expense_item_status: "not_paid",
  customer_name: "",
  user_id: "",
  payment_status: "fully_paid",
  booking_daterange: "",
});
const entranceAction = ref(false);

const searchValue = (val) => {
  search.value = val;
};

const searchAction = async () => {
  console.log("searchAction", searchKey.value);
  filterShow.value = false;
  softShow.value = false;
  await getAllAction();
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
};

// const formatDate = (datePut) => {
//   const date = new Date(datePut);

//   // Get the year, month, and day
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0"); // Month starts from 0
//   const day = String(date.getDate()).padStart(2, "0");

//   // Form the formatted date string
//   let formattedDate = `${year}-${month}-${day}`;
//   return formattedDate;
// };

const dateRange = ref("");

const clearFilter = () => {
  filterShow.value = false;
  searchKey.value = {
    crm_id: "",
    product_name: "",
    invoice_status: "",
    expense_item_status: "",
    customer_name: "",
    user_id: "",
    payment_status: "",
    booking_daterange: "",
  };
  getAllAction();
};

const ChangeAttractionName = (data) => {
  if (data) {
    searchKey.value.product_name = data;
  }
};

const sorting = ref("asc");

const watchSystem = computed(() => {
  let result = {};

  if (searchKey.value.crm_id) {
    result.crm_id = searchKey.value.crm_id;
  }

  if (searchKey.value.product_name) {
    result.product_name = searchKey.value.product_name;
  }
  if (searchKey.value.invoice_status) {
    result.invoice_status = searchKey.value.invoice_status;
  }
  if (searchKey.value.expense_item_status) {
    result.expense_item_status = searchKey.value.expense_item_status;
  }
  if (searchKey.value.customer_name) {
    result.customer_name = searchKey.value.customer_name;
  }
  if (searchKey.value.user_id) {
    result.user_id = searchKey.value.user_id;
  }
  if (searchKey.value.payment_status) {
    result.payment_status = searchKey.value.payment_status;
  }
  if (searchKey.value.booking_daterange) {
    result.booking_daterange = searchKey.value.booking_daterange;
  }

  if (sorting.value) {
    result.sorting = sorting.value;
  }

  result.product_type = "attraction";
  result.per_page = 10;

  return result;
});

const getAllAction = async () => {
  await groupStore.getListAction(watchSystem.value);
};

const getDetailAction = (id) => {
  console.log("getDetailAction", id);

  router.push({
    name: "group-attraction",
    query: {
      id: id,
    },
  });
};

const changePage = async (url) => {
  await groupStore.getChangePage(url, watchSystem.value);
};

const addNewAction = () => {
  router.push({
    name: "group-attraction",
    query: {
      new: "new",
    },
  });
};

const adminLists = ref([]);
const getListUser = async () => {
  try {
    const res = await adminStore.getSimpleListAction();
    console.log(res, "this is admin list");

    adminLists.value = res.result.data
      .filter((item) => item.role == "admin" || item.role == "sale_manager")
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

    searchKey.value.booking_daterange = `${formattedStartDate},${formattedEndDate}`;
  } else {
    searchKey.value.booking_daterange = "";
  }
  // console.log(searchKey.value.booking_daterange, "this is daterange");

  searchModel.value = false;
  await getAllAction();
});

const setStartAndEndDate = () => {
  const now = new Date(); // Today's date
  const startDate = new Date(now); // Start date is today

  // Add 90 days to the start date to get the end date
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + 90);

  dateRange.value = [startDate, endDate];
};

const expense_total_amount = computed(() => {
  let total = 0;
  if (groups.value) {
    groups.value.data.forEach((item) => {
      total += item.expense_amount;
    });
  }
  return total;
});

onMounted(async () => {
  setStartAndEndDate();
  // await getAllAction();
  await getListUser();
  console.log("====================================");
  console.log("groups", groups.value);
  console.log("====================================");
});
</script>

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
