<script setup>
import Layout from "./Layout.vue";
import AvgCard from "./BookingListComponent/AvgCard.vue";
import FilterPart from "./BookingListComponent/FilterPart.vue";
import Table from "./BookingListComponent/Table.vue";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronUpDownIcon,
  FunnelIcon,
  LanguageIcon,
  MagnifyingGlassCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/outline";
import { useBookingStore } from "../stores/booking";
import { computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useAdminStore } from "../stores/admin";
import { useSidebarStore } from "../stores/sidebar";
import SalesToday from "./BookingListComponent/SalesToday.vue";
import debounce from "lodash/debounce";
import CashBookAdd from "./cash/CashBookAdd.vue";

const bookingStore = useBookingStore();
const { bookings, loading } = storeToRefs(bookingStore);
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const adminStore = useAdminStore();
const sidebarStore = useSidebarStore();
const { isShowSidebar } = storeToRefs(sidebarStore);

const showFilter = ref(false);
const customerName = ref("");
const sale_date_order_by = ref("");
const inclusive_only = ref(false);
const balanceDueDate = ref("");
const bookingStatus = ref("");
const saleDate = ref(""); // Single date
const bookingDateFrom = ref(""); // Range start date
const bookingDateTo = ref(""); // Range end date
const createdBy = ref("");
const search = ref("");
const searchA = ref("");
const searchP = ref("");
const priceMin = ref("");
const priceMax = ref("");
const sort_by = ref("");
const limit = ref(10);
const connection_status = ref("");
const selectedDate = ref(null);
const customFilter = ref(true);

const clearFilter = async () => {
  showFilter.value = false;
  if (!showFilter.value) {
    limit.value = 10;
    search.value = "";
    searchA.value = "";
    searchP.value = "";
    priceMin.value = "";
    priceMax.value = "";
    connection_status.value = "";
    customerName.value = "";
    balanceDueDate.value = "";
    createdBy.value = "";
    bookingStatus.value = "";
    saleDate.value = "";
    bookingDateFrom.value = ""; // Clear range dates
    bookingDateTo.value = "";
    sale_date_order_by.value = "";
    sort_by.value = "";
    inclusive_only.value = false;
  }
  console.log(showFilter.value, "this is showfilter");
  await bookingStore.getListAction(watchSystem.value);
};

const adminLists = ref([]);

const getListUser = async () => {
  try {
    const res = await adminStore.getSimpleListAction();
    console.log(res, "this is admin list");

    adminLists.value = res.result.data
      .filter((item) => item.role === "admin" || item.role === "sale_manager")
      .map((item) => {
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

const showCashImageModal = ref(false);

const watchSystem = computed(() => {
  const result = {};

  if (limit.value != "" && limit.value != undefined) {
    result.limit = limit.value;
  }
  if (search.value != "" && search.value != undefined) {
    result.crm_id = search.value;
  }
  if (createdBy.value != "" && createdBy.value != undefined) {
    result.created_by = createdBy.value;
  }
  if (customerName.value != "" && customerName.value != undefined) {
    result.customer_name = customerName.value;
  }
  if (balanceDueDate.value != "" && balanceDueDate.value != undefined) {
    result.balance_due_date = formatDate(balanceDueDate.value);
  }
  if (bookingStatus.value != "" && bookingStatus.value != undefined) {
    result.booking_status = bookingStatus.value;
  }

  // Handle single date vs date range
  if (saleDate.value != "" && saleDate.value != undefined) {
    result.sale_date = saleDate.value;
  }
  if (bookingDateFrom.value != "" && bookingDateFrom.value != undefined) {
    result.booking_date_from = bookingDateFrom.value;
  }
  if (bookingDateTo.value != "" && bookingDateTo.value != undefined) {
    result.booking_date_to = bookingDateTo.value;
  }

  if (searchA.value != "" && searchA.value != undefined) {
    result.filter = searchA.value;
  }
  if (searchP.value != "" && searchP.value != undefined) {
    result.status = searchP.value;
  }

  // FIXED: Price range handling - separate conditions
  // if (priceMin.value != "" && priceMin.value != undefined) {
  //   result.price_min = priceMin.value;
  // }
  if (priceMax.value != "" && priceMax.value != undefined) {
    result.price_min = priceMin.value ? priceMin.value : 0;
    result.price_max = priceMax.value;
  }

  if (connection_status.value != "" && connection_status.value != undefined) {
    result.connection_status = connection_status.value;
  }
  if (sale_date_order_by.value) {
    result.sale_date_order_by = sale_date_order_by.value;
  }
  if (sort_by.value) {
    result.sort_by = sort_by.value;
    result.sort_direction = sale_date_order_by.value;
  }
  if (inclusive_only.value) {
    result.inclusive_only = inclusive_only.value;
  }

  console.log(result);
  return result;
});

const changePage = async (url) => {
  console.log(url);
  await bookingStore.getChangePage(url, watchSystem.value);
};

const SearchFunction = () => {
  // Update route params to handle both single date and date range
  const params = {
    crm_id: search.value ? search.value : "%",
    customer_name: customerName.value ? customerName.value : "%",
  };

  // Add date param based on which type is being used
  if (saleDate.value) {
    params.sale_date = saleDate.value;
  } else if (bookingDateFrom.value || bookingDateTo.value) {
    params.booking_date_from = bookingDateFrom.value || "%";
    params.booking_date_to = bookingDateTo.value || "%";
  } else {
    params.sale_date = "%";
  }

  router.push({
    name: "bookings",
    params: params,
  });
};

const searchHandler = async () => {
  showFilter.value = true;
  SearchFunction();
  await bookingStore.getListAction(watchSystem.value);
};

// FIXED: Watch for changes in filter values - added price values
watch(
  [
    createdBy,
    sale_date_order_by,
    saleDate,
    bookingDateFrom,
    bookingDateTo,
    priceMin,
    priceMax,
  ],
  debounce(
    async ([
      newCreatedBy,
      newSaleDateOrder,
      newSaleDate,
      newBookingFrom,
      newBookingTo,
      newPriceMin,
      newPriceMax,
    ]) => {
      showFilter.value = true;
      await searchHandler();
    },
    500
  )
);

onMounted(async () => {
  sale_date_order_by.value = "desc";

  // Handle route params
  search.value = route.params.crm_id == "%" ? "" : route.params.crm_id;
  customerName.value =
    route.params.customer_name == "%" ? "" : route.params.customer_name;

  // Handle date params from route
  if (route.params.sale_date && route.params.sale_date !== "%") {
    saleDate.value = route.params.sale_date;
  }
  if (
    route.params.booking_date_from &&
    route.params.booking_date_from !== "%"
  ) {
    bookingDateFrom.value = route.params.booking_date_from;
  }
  if (route.params.booking_date_to && route.params.booking_date_to !== "%") {
    bookingDateTo.value = route.params.booking_date_to;
  }

  // ADDED: Handle price params from route (if you want to support URL params for prices)
  if (route.params.price_min && route.params.price_min !== "%") {
    priceMin.value = route.params.price_min;
  }
  if (route.params.price_max && route.params.price_max !== "%") {
    priceMax.value = route.params.price_max;
  }

  await getListUser();
  await bookingStore.getListAction(watchSystem.value);
});

// Helper function to format date (assuming this exists somewhere)
const formatDate = (date) => {
  if (!date) return "";
  // Add your date formatting logic here
  return date;
};
</script>

<template>
  <Layout :is_white="true">
    <div
      @click="router.push(`/bookings/new-create`)"
      class="space-x-8 col-span-3 flex justify-start items-center transition-all duration-200 gap-2 text-xs absolute right-[220px] top-6 bg-[#FF613c] text-white rounded-xl px-4 py-2 cursor-pointer"
    >
      <div class="">+ Create new Invoice</div>
    </div>
    <div
      class="transition-all duration-200 gap-2 text-xs absolute top-4"
      :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
    >
      <p class="text-2xl text-[#FF613c] font-semibold">Sales.</p>

      <p class="text-xs">Manage your daily sales easily.</p>
    </div>
    <div class="flex justify-start items-center gap-x-4">
      <SalesToday :adminLists="adminLists" v-model:createdBy="createdBy" />
    </div>
    <!-- div -->
    <div
      class="grid gap-x-4 w-full pt-4 transition-all duration-300"
      :class="customFilter ? 'grid-cols-8' : 'grid-cols-6'"
    >
      <!-- Use transition for the filter component -->
      <transition name="filter-slide" appear>
        <div
          class="col-span-2 relative overflow-hidden"
          v-if="customFilter"
          key="filter"
        >
          <FilterPart
            v-model:saleDate="saleDate"
            v-model:bookingDateFrom="bookingDateFrom"
            v-model:bookingDateTo="bookingDateTo"
            v-model:searchP="searchP"
            v-model:priceMin="priceMin"
            v-model:priceMax="priceMax"
            v-model:connection_status="connection_status"
            v-model:inclusive_only="inclusive_only"
            v-model:createdBy="createdBy"
            :adminLists="adminLists"
            :searchHandler="searchHandler"
            :clearFilter="clearFilter"
          />
        </div>
      </transition>

      <!-- Use transition for the main content to animate size change -->
      <transition name="content-resize" appear>
        <div
          class="space-y-3 transition-all duration-300"
          :class="customFilter ? 'col-span-6' : 'col-span-6'"
          :key="customFilter ? 'content-small' : 'content-full'"
        >
          <div class="flex justify-between items-start w-full">
            <div class="flex justify-start w-full items-center gap-x-2">
              <div
                class="p-2 rounded-lg transition-all duration-150"
                :class="customFilter ? 'bg-[#FF613c]' : 'bg-[#FF613c]'"
                @click="customFilter = !customFilter"
              >
                <ChevronLeftIcon
                  class="h-4 w-4 text-white cursor-pointer transition-all duration-150"
                  :class="{ 'rotate-180': !customFilter }"
                />
              </div>
              <div class="p-2 bg-[#FF613c]/10 rounded-lg relative group">
                <div
                  class="flex justify-center items-center cursor-pointer gap-x-1"
                >
                  <ChevronUpDownIcon
                    class="h-4 w-4 text-[#FF613c] cursor-pointer"
                  />
                  <span class="text-xs text-[#FF613c] uppercase">{{
                    sort_by ? sort_by : "TYPE"
                  }}</span>
                </div>
                <div
                  class="absolute group-hover:block hidden -bottom-30 left-0 bg-white shadow-lg rounded-lg p-2 z-10"
                >
                  <p
                    class="whitespace-nowrap flex justify-start items-center cursor-pointer py-2 px-4 text-xs hover:text-[#FF613c]"
                    :class="sort_by === '' ? 'text-[#FF613c]' : ''"
                    @click="sort_by = ``"
                  >
                    <CheckIcon
                      class="w-4 h-4 mr-3"
                      :class="sort_by == '' ? '' : 'opacity-0'"
                    />
                    None
                  </p>
                  <p
                    class="whitespace-nowrap flex justify-start items-center cursor-pointer py-2 px-4 text-xs hover:text-[#FF613c]"
                    :class="sort_by === 'name' ? 'text-[#FF613c]' : ''"
                    @click="sort_by = `name`"
                  >
                    <CheckIcon
                      class="w-4 h-4 mr-3"
                      :class="sort_by == 'name' ? '' : 'opacity-0'"
                    />
                    Customer Name
                  </p>
                  <p
                    class="whitespace-nowrap cursor-pointer py-2 px-4 flex justify-start items-center text-xs hover:text-[#FF613c]"
                    :class="sort_by === 'booking_date' ? 'text-[#FF613c]' : ''"
                    @click="sort_by = `booking_date`"
                  >
                    <CheckIcon
                      class="w-4 h-4 mr-3"
                      :class="sort_by == 'booking_date' ? '' : 'opacity-0'"
                    />
                    Booking Date
                  </p>
                  <p
                    class="whitespace-nowrap cursor-pointer py-2 px-4 flex justify-start items-center text-xs hover:text-[#FF613c]"
                    :class="sort_by === 'amount' ? 'text-[#FF613c]' : ''"
                    @click="sort_by = `amount`"
                  >
                    <CheckIcon
                      class="w-4 h-4 mr-3"
                      :class="sort_by == 'amount' ? '' : 'opacity-0'"
                    />
                    Amount
                  </p>
                </div>
              </div>
              <div class="p-2 bg-[#FF613c]/10 rounded-lg relative group">
                <div
                  class="flex justify-center items-center cursor-pointer gap-x-1"
                >
                  <ChevronUpDownIcon
                    class="h-4 w-4 text-[#FF613c] cursor-pointer"
                  />
                  <span class="text-xs text-[#FF613c]">{{
                    sale_date_order_by && sale_date_order_by == "desc"
                      ? "ZA"
                      : "AZ"
                  }}</span>
                </div>
                <div
                  class="absolute group-hover:block hidden -bottom-20 left-0 bg-white shadow-lg rounded-lg p-2 z-10"
                >
                  <p
                    class="whitespace-nowrap flex justify-start items-center cursor-pointer py-2 px-4 text-xs hover:text-[#FF613c]"
                    :class="
                      sale_date_order_by === 'desc' ? 'text-[#FF613c]' : ''
                    "
                    @click="sale_date_order_by = `desc`"
                  >
                    <CheckIcon
                      class="w-4 h-4 mr-3"
                      :class="sale_date_order_by == 'desc' ? '' : 'opacity-0'"
                    />
                    Latest to First
                  </p>
                  <p
                    class="whitespace-nowrap cursor-pointer py-2 px-4 flex justify-start items-center text-xs hover:text-[#FF613c]"
                    :class="
                      sale_date_order_by === 'asc' ? 'text-[#FF613c]' : ''
                    "
                    @click="sale_date_order_by = `asc`"
                  >
                    <CheckIcon
                      class="w-4 h-4 mr-3"
                      :class="sale_date_order_by == 'asc' ? '' : 'opacity-0'"
                    />
                    First to Latest
                  </p>
                </div>
              </div>
            </div>
            <div class="flex justify-end w-full items-center gap-x-2">
              <div
                @click="showCashImageModal = true"
                class="bg-[#FF613c] text-white text-xs whitespace-nowrap rounded-lg px-2 py-1.5 flex justify-center items-center cursor-pointer gap-x-1"
              >
                + Cash Image
              </div>
              <div class="relative">
                <input
                  type="text"
                  class="w-[250px] pl-8 pr-4 py-1.5 text-xs border border-coral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-coral-500 text-gray-500"
                  v-model="customerName"
                  placeholder="Search by Customer Name"
                />
                <MagnifyingGlassIcon
                  class="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
              <div class="relative">
                <input
                  type="text"
                  class="w-[180px] pl-8 pr-4 py-1.5 text-xs border border-coral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-coral-500 text-gray-500"
                  v-model="search"
                  placeholder="Search by CRM ID"
                />
                <MagnifyingGlassIcon
                  class="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
              <p
                @click="searchHandler"
                class="bg-[#FF613c] whitespace-nowrap cursor-pointer text-white px-3 text-xs py-1.5 rounded-lg inline-block"
              >
                Search
              </p>
              <p
                @click="router.push(`/bookings/new-create`)"
                class="bg-[#FF613c] whitespace-nowrap cursor-pointer text-white px-3 text-xs py-1.5 rounded-lg inline-block"
              >
                + New
              </p>
            </div>
          </div>
          <div>
            <Table
              :booking="bookings"
              :changePage="changePage"
              :loading="loading"
              :watchSystem="watchSystem"
            />
          </div>
        </div>
      </transition>
    </div>
    <CashBookAdd
      :show="showCashImageModal"
      :closeAction="
        () => {
          showCashImageModal = false;
        }
      "
      @refresh="() => {}"
    />
  </Layout>
</template>

<style scoped>
/* Filter slide-in animation */
.filter-slide-enter-active,
.filter-slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease, max-width 0.3s ease;
  max-width: 25%;
}

.filter-slide-enter-from {
  transform: translateX(-30px);
  opacity: 0;
  max-width: 0;
}

.filter-slide-leave-to {
  transform: translateX(-30px);
  opacity: 0;
  max-width: 0;
}

/* Content resize animation */
.content-resize-enter-active,
.content-resize-leave-active {
  transition: all 0.3s ease;
}

.content-resize-enter-from,
.content-resize-leave-to {
  opacity: 0.7;
  transform: scale(0.98);
}
</style>
