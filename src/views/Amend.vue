<script setup>
import { storeToRefs } from "pinia";
import Layout from "./Layout.vue";
import ListReservation from "./AmendComponent/ListAmend.vue";
import ReservationCartLoadingVue from "./Dashboard/ReservationCartLoading.vue";
import { onMounted, ref, watch, computed } from "vue";
import Pagination from "../components/PaginationExpense.vue";
import {
  ArrowsUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/outline";
import ReservationDetail from "./AmendComponent/AmendDetail.vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter, useRoute } from "vue-router";
import { useAdminStore } from "../stores/admin";
import Modal from "../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { XCircleIcon } from "@heroicons/vue/24/solid";
import { format } from "date-fns";
import { useSidebarStore } from "../stores/sidebar";
import { useSupplierStore } from "../stores/supplier";
import { useReservationStore } from "../stores/reservation";
import { formattedDate } from "./help/FormatData";
import { useAmendStore } from "../stores/amend";

const sidebarStore = useSidebarStore();
const { isShowSidebar } = storeToRefs(sidebarStore);

const amendStore = useAmendStore();
const { amends, loading } = storeToRefs(amendStore);
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const supplierStore = useSupplierStore();
const reservationStore = useReservationStore();
const { suppliers } = storeToRefs(supplierStore);

const router = useRouter();
const adminStore = useAdminStore();
const route = useRoute();

// filter keys
const limit = ref(10);
const search = ref("");
const searchId = ref("");
const customerName = ref("");
const userFilter = ref("");
const sale_daterange = ref(null);
const customer_name = ref("service_date");
const sorting = ref("asc");
const dateOnlyToggle = ref(false);
const searchA = ref("");
const showSide = ref(1);
const filterShow = ref(false);
const softShow = ref(false);
const searchReservation = ref("");
const bookingStatus = ref("");
const expenseStatus = ref("");
const invoiceStatus = ref("");
const customerPaymentStatus = ref("");
const showFilter = ref(false);
const searchTime = ref("");
const searchModel = ref(false);

const clearFilter = () => {
  search.value = "";
  searchId.value = "";
  customerName.value = "";
  sale_daterange.value = "";
  bookingStatus.value = "";
  expenseStatus.value = "";
  invoiceStatus.value = "";
  customerPaymentStatus.value = "";
  userFilter.value =
    authStore.isSuperAdmin || authStore.isReservation || authStore.isAuditor
      ? ""
      : user?.value.id;
  searchTime.value = "";
  customer_name.value = "service_date";
  sorting.value = "asc";
  filterShow.value = false;
  showFilter.value = false;
  limit.value = 10;
};

const userName = computed(() => {
  const found = adminLists?.value.find((u) => u.id === userFilter.value);
  return found ? found.name : undefined;
});

const changePage = async (url) => {
  await amendStore.getChangePage(url, watchSystem.value);
};

const formatDate = (datePut) => {
  const date = new Date(datePut);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const setStartAndEndDate = () => {
  const now = new Date();
  searchTime.value = now;
};

// ✅ Fixed: user_id logic no longer overwrites userFilter
const watchSystem = computed(() => {
  const result = {};

  if (limit.value) result.limit = limit.value;

  if (userFilter.value) {
    result.user_id = userFilter.value;
  } else if (
    !authStore.isSuperAdmin &&
    !authStore.isReservation &&
    !authStore.isAuditor
  ) {
    result.user_id = user?.value.id;
  } else {
    result.user_id = "";
  }

  if (sale_daterange.value) result.daterange = sale_daterange.value;

  result.order_by = "created_at";
  result.order_direction = sorting.value || "asc";

  console.log(result);
  return result;
});

const detailId = ref("");

const getDetailAction = async (id) => {
  detailId.value = id.id;
  if (detailId.value) {
    router.push("amend?id=" + detailId.value + "&crm_id=" + id.crm_id);
  }
};

const adminLists = ref([]);

const changeDate = ref("");
const changeServiceDate = async (data) => {
  changeDate.value = data;
  if (data == "today") {
    searchTime.value = formatDate(new Date());
  } else if (data == "tomorrow") {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    searchTime.value = formatDate(tomorrow);
  } else if (data == "7day") {
    searchTime.value = formatDate(
      new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
    );
  } else if (data == "30day") {
    searchTime.value = formatDate(
      new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
    );
  }
  await searchAction();
};

const getListUser = async () => {
  try {
    const res = await adminStore.getSimpleListAction();
    adminLists.value = res.result.data
      .filter((item) => item.role === "admin")
      .map((item) => ({ id: item.id, name: item.name }));
  } catch (error) {
    console.log(error);
  }
};

const showFormat = (dateStr) => {
  const singleDatePattern = /^\d{4}-\d{2}-\d{2}$/;
  const multipleDatesPattern = /^(\d{4}-\d{2}-\d{2})(,\d{4}-\d{2}-\d{2})*$/;

  if (singleDatePattern.test(dateStr)) {
    return format(new Date(dateStr), "MMM, dd");
  } else if (multipleDatesPattern.test(dateStr)) {
    return dateStr
      .split(",")
      .map((date) => format(new Date(date), "MMM, dd"))
      .join(" to ");
  }
  return "Invalid format";
};

onMounted(async () => {
  if (route.query.id) detailId.value = route.query.id;
  setStartAndEndDate();
  await getListUser();
  await supplierStore.getSimpleListAction();
});

const searchCount = computed(() => {
  let count = 0;
  if (search.value) count++;
  if (searchTime.value) count++;
  if (userFilter.value) count++;
  return count;
});

const getReservationListAction = async () => {
  await amendStore.getListAction(watchSystem.value);
};

const detailGetAction = (id) => {
  getDetailAction(id);
};

const searchAction = async () => {
  filterShow.value = false;
  await amendStore.getListAction(watchSystem.value);
};

const getDateRangeCategory = (dateRange) => {
  if (!dateRange) return "other";
  const [startDateStr, endDateStr] = dateRange.split(",");
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (
    formatDate(startDate) === formatDate(today) &&
    formatDate(endDate) === formatDate(today)
  )
    return "today";
  if (
    formatDate(startDate) === formatDate(tomorrow) &&
    formatDate(endDate) === formatDate(tomorrow)
  )
    return "tomorrow";
  return "other";
};

watch(sale_daterange, (newValue) => {
  const category = getDateRangeCategory(newValue);
  if (category === "other") changeDate.value = "";
});

// ✅ Auto search when userFilter changes
watch(userFilter, () => {
  searchAction();
});

watch(
  searchTime,
  (newValue) => {
    if (!newValue || newValue === "") {
      sale_daterange.value = "";
      getReservationListAction();
      searchModel.value = false;
      return;
    }

    const date = new Date(newValue);
    if (isNaN(date.getTime())) return;

    const formatDateAsDDMMYYYY = (d) => {
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      return `${yyyy}-${mm}-${dd}`;
    };

    sale_daterange.value = formatDateAsDDMMYYYY(date);
    getReservationListAction();
    searchModel.value = false;
  },
  { immediate: true },
);
</script>

<template>
  <Layout :is_white="true">
    <div
      :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
      class="space-x-8 col-span-3 flex justify-start items-center transition-all duration-200 gap-2 text-sm pb-4 absolute top-6"
    >
      <p class="text-3xl font-medium text-[#FF613c]">
        Amend Reservations
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
          <!-- Filter Bar -->
          <div class="pb-4 flex justify-start items-center gap-x-3 relative">
            <!-- Filter Button -->
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

            <!-- Filter Dropdown -->
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

                <!-- Date Filter -->
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
                    <VueDatePicker
                      v-model="searchTime"
                      multi-calendars
                      :format="'yyyy-MM-dd'"
                      placeholder="Service Date"
                      text-input
                    />
                  </DialogPanel>
                </Modal>
                <p
                  @click="searchModel = !searchModel"
                  class="text-[10px] text-gray-500 cursor-pointer px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <span v-if="searchTime">{{
                    showFormat(formatDate(searchTime))
                  }}</span>
                  <span v-else-if="sale_daterange">{{
                    showFormat(sale_daterange)
                  }}</span>
                  <span v-else>Select Date</span>
                </p>

                <!-- Customer Name -->
                <div class="relative w-full">
                  <p class="text-[10px] pb-2">Customer Name</p>
                  <input
                    type="search"
                    v-model="customerName"
                    placeholder="Search Customer name"
                    class="text-[10px] text-gray-500 focus:outline-none hover:text-gray-600 border border-gray-300 rounded-lg bg-white px-4 py-2 w-full"
                  />
                  <div
                    @click="searchAction"
                    class="absolute right-1 top-7 rounded-lg text-xs p-1 bg-[#FF613c]"
                  >
                    <MagnifyingGlassIcon class="w-4 h-4 text-white" />
                  </div>
                </div>

                <!-- ✅ NEW: Agent / User Filter -->
                <div>
                  <p class="text-[10px] pb-2">Agent / User</p>
                  <select
                    v-model="userFilter"
                    class="border border-gray-300 px-4 focus:outline-none bg-gray-50 text-gray-400 w-full py-2 text-[10px] rounded-lg"
                  >
                    <option value="">All Users</option>
                    <option
                      v-for="admin in adminLists"
                      :key="admin.id"
                      :value="admin.id"
                    >
                      {{ admin.name }}
                    </option>
                  </select>
                </div>

                <!-- Customer Payment Status -->
                <div>
                  <p class="text-[10px] pb-2">Customer Payment Status</p>
                  <select
                    v-model="customerPaymentStatus"
                    class="border border-gray-300 px-4 focus:outline-none bg-gray-50 text-gray-400 w-full py-2 text-[10px] rounded-lg"
                  >
                    <option value=""></option>
                    <option value="fully_paid">Fully paid</option>
                    <option value="partially_paid">Partially paid</option>
                    <option value="not_paid">Not paid</option>
                  </select>
                </div>

                <!-- Expense Status -->
                <div>
                  <p class="text-[10px] pb-2">Expense Status</p>
                  <select
                    v-model="expenseStatus"
                    class="border border-gray-300 px-4 focus:outline-none bg-gray-50 text-gray-400 w-full py-2 text-[10px] rounded-lg"
                  >
                    <option value=""></option>
                    <option value="fully_paid">Fully paid</option>
                    <option value="partially_paid">Partially paid</option>
                    <option value="not_paid">Not paid</option>
                  </select>
                </div>

                <!-- Invoice Status -->
                <div>
                  <p class="text-[10px] pb-2">Invoice Status</p>
                  <select
                    v-model="invoiceStatus"
                    class="border border-gray-300 px-4 focus:outline-none bg-gray-50 text-gray-400 w-full py-2 text-[10px] rounded-lg"
                  >
                    <option value=""></option>
                    <option value="receive">Receive</option>
                    <option value="not_receive">Not Receive</option>
                  </select>
                </div>

                <!-- Search Button -->
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

            <!-- Sort Button -->
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

            <!-- Sort Dropdown -->
            <transition name="slide">
              <div
                v-if="softShow"
                class="absolute top-full pb-3 px-4 left-0 w-[250px] transition-all duration-150 bg-white rounded-lg shadow-lg z-50 border border-gray-100 space-y-2 max-h-[70vh] overflow-y-scroll"
              >
                <div
                  class="flex justify-between items-center pt-4 border-b border-gray-100 pb-1 sticky top-0 bg-white"
                >
                  <p class="text-xs font-medium">Sort</p>
                  <p
                    class="text-[10px] cursor-pointer"
                    @click="
                      () => {
                        softShow = false;
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
                      v-model="sorting"
                      class="border border-gray-300 px-4 focus:outline-none bg-gray-50 text-gray-400 w-[50%] py-2 text-[10px] rounded-lg"
                    >
                      <option value="desc">Last to First</option>
                      <option value="asc">First to Last</option>
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
                      :checked="customer_name == 'payment_status'"
                    />
                    <p class="text-xs py-2 px-4">C. Payment Status</p>
                  </div>
                </div>
                <div
                  @click="
                    () => {
                      searchAction();
                      softShow = false;
                    }
                  "
                  class="bg-[#FF613c] text-white px-1.5 cursor-pointer inline-block rounded-lg text-sm w-full py-1.5 text-center"
                >
                  sort
                </div>
              </div>
            </transition>

            <!-- Search CRM ID -->
            <div class="relative w-full">
              <input
                type="search"
                v-model="searchId"
                placeholder="Search CRM ID"
                class="w-full px-4 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
              />
              <div
                @click="searchAction"
                class="absolute right-1 top-1 rounded-lg text-xs p-1 bg-[#FF613c]"
              >
                <MagnifyingGlassIcon class="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          <!-- Active Filter Tags -->
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
              v-if="searchId != ''"
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap relative"
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
              v-if="customerName != ''"
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap relative"
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
              v-if="userName"
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap relative"
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
              v-if="searchTime"
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap relative"
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
              v-else-if="sale_daterange"
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap relative"
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
              v-if="customer_name"
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap"
            >
              sort: {{ customer_name }}
            </p>
          </div>

          <!-- Date Quick Filters + Count -->
          <div class="flex justify-between items-center pb-2">
            <div class="col-span-2">
              <div
                class="flex w-full text-[10px] justify-end items-center gap-4"
              >
                <p
                  @click="changeServiceDate('today')"
                  class="flex gap-2 justify-start items-center cursor-pointer"
                  :class="
                    changeDate == 'today' ? 'text-[#FF5B00]' : 'text-black'
                  "
                >
                  <span
                    v-if="changeDate == 'today'"
                    class="w-2 h-2 rounded-full bg-[#FF5B00]"
                  ></span>
                  Today
                </p>
                <p
                  @click="changeServiceDate('tomorrow')"
                  class="flex gap-2 justify-start items-center cursor-pointer"
                  :class="
                    changeDate == 'tomorrow' ? 'text-[#FF5B00]' : 'text-black'
                  "
                >
                  <span
                    v-if="changeDate == 'tomorrow'"
                    class="w-2 h-2 rounded-full bg-[#FF5B00]"
                  ></span>
                  Tomorrow
                </p>
                <p
                  @click="changeServiceDate('7day')"
                  class="flex gap-2 justify-start items-center cursor-pointer"
                  :class="
                    changeDate == '7day' ? 'text-[#FF5B00]' : 'text-black'
                  "
                >
                  <span
                    v-if="changeDate == '7day'"
                    class="w-2 h-2 rounded-full bg-[#FF5B00]"
                  ></span>
                  Next 7 Days
                </p>
              </div>
            </div>
            <div
              class="text-[10px] rounded-lg px-2 py-1 text-white bg-[#FF613c]"
            >
              {{ amends?.meta?.total }} reser
            </div>
          </div>

          <!-- List -->
          <div
            v-if="!loading"
            class="bg-white shadow rounded-lg divide-y divide-gray-100 max-h-[62vh] overflow-y-scroll"
          >
            <div class="relative" v-for="i in amends?.data ?? []" :key="i">
              <ListReservation
                :data="i"
                :detailId="detailId"
                @detailId="detailGetAction"
              />
            </div>
          </div>

          <!-- Pagination -->
          <div class="overflow-x-scroll no-sidebar-container py-2">
            <Pagination
              v-if="!loading"
              :data="amends"
              @change-page="changePage"
            />
          </div>

          <!-- Loading Skeleton -->
          <div
            v-if="loading"
            class="bg-white shadow rounded-lg divide-y-4 divide-gray-200 max-h-[75vh] overflow-y-scroll"
          >
            <div v-for="i in 10" :key="i">
              <ReservationCartLoadingVue />
            </div>
          </div>
        </div>
      </transition>

      <!-- Detail Panel -->
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
              v-if="showSide == 1"
              class="w-6 cursor-pointer h-6 bg-white shadow-md border border-gray-200 p-1.5 rounded-full"
              @click="showSide = 2"
            />
            <ChevronRightIcon
              v-if="showSide == 2"
              class="w-6 cursor-pointer h-6 bg-white shadow-md border border-gray-200 p-1.5 rounded-full"
              @click="showSide = 1"
            />
          </div>
          <div class="absolute -top-4 -left-10 z-20">
            <ChevronRightIcon
              v-if="showSide == 1"
              class="w-6 cursor-pointer h-6 bg-white shadow-md border border-gray-200 p-1.5 rounded-full"
              @click="showSide = 3"
            />
            <ChevronLeftIcon
              v-if="showSide == 3"
              class="w-6 cursor-pointer h-6 bg-white shadow-md border border-gray-200 p-1.5 rounded-full"
              @click="showSide = 1"
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
