<script setup>
import Layout from "./Layout.vue";
import AvgCard from "./BookingListComponent/AvgCard.vue";
import FilterPart from "./BookingListComponent/FilterPart.vue";
import Table from "./BookingListComponent/Table.vue";
import {
  ChevronUpDownIcon,
  FunnelIcon,
  LanguageIcon,
  MagnifyingGlassCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/outline";
import { useBookingStore } from "../stores/booking";
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useAdminStore } from "../stores/admin";
import { useSidebarStore } from "../stores/sidebar";

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
const saleDate = ref("");
const createdBy = ref("");
const search = ref("");
const searchA = ref("");
const searchP = ref("");
const limit = ref(10);
const selectedDate = ref(null);
const customFilter = ref(true);

const clearFilter = async () => {
  showFilter.value = false;
  if (!showFilter.value) {
    limit.value = 10;
    search.value = "";
    searchA.value = "";
    searchP.value = "";
    customerName.value = "";
    balanceDueDate.value = "";
    createdBy.value = "";
    bookingStatus.value = "";
    saleDate.value = "";
    sale_date_order_by.value = "";
    inclusive_only.value = false;
  }
  console.log(showFilter.value, "this is showfilter");
  await bookingStore.getListAction(watchSystem.value);
};

const adminLists = ref([]);

const getListUser = async () => {
  try {
    const res = await await adminStore.getSimpleListAction();
    console.log(res, "this is admin list");

    adminLists.value = res.result.data
      .filter((item) => item.role === "admin" || item.role === "sale_manager")
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
  if (saleDate.value != "" && saleDate.value != undefined) {
    result.sale_date = saleDate.value;
  }
  if (searchA.value != "" && searchA.value != undefined) {
    result.filter = searchA.value;
  }
  if (searchP.value != "" && searchP.value != undefined) {
    result.status = searchP.value;
  }
  if (sale_date_order_by.value) {
    result.sale_date_order_by = sale_date_order_by.value;
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
  router.push({
    name: `bookings`,
    params: {
      crm_id: search.value ? search.value : "%",
      customer_name: customerName.value ? customerName.value : "%",
      sale_date: saleDate.value ? saleDate.value : "%",
    },
  });
};

const searchHandler = async () => {
  showFilter.value = true;
  SearchFunction();
  await bookingStore.getListAction(watchSystem.value);
};

onMounted(async () => {
  (sale_date_order_by.value = "desc"),
    // console.log(route.params);
    (search.value = route.params.crm_id == "%" ? "" : route.params.crm_id);
  customerName.value =
    route.params.customer_name == "%" ? "" : route.params.customer_name;
  saleDate.value = route.params.sale_date == "%" ? "" : route.params.sale_date;

  // console.log(admin.value, "this is admin");

  await getListUser();
  await bookingStore.getListAction(watchSystem.value);
});
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
      <AvgCard
        :title="'Daily Avg. Sales'"
        :value="'-'"
        :is_value="true"
        :is_show="true"
      />
      <AvgCard :title="'Daily Avg. Booking'" :value="'-'" :is_value="false" />
      <AvgCard :title="'Sales Today'" :value="'-'" :is_value="true" />
      <AvgCard :title="'Booking Today'" :value="'-'" :is_value="false" />
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
            v-model:searchP="searchP"
            v-model:inclusive_only="inclusive_only"
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
              <p
                @click="router.push(`/bookings/new-create`)"
                class="bg-[#FF613c] whitespace-nowrap cursor-pointer text-white px-3 text-xs py-1.5 rounded-lg inline-block"
              >
                + New
              </p>
              <div v-if="authStore.isSuperAdmin">
                <div>
                  <select
                    name=""
                    id=""
                    v-model="createdBy"
                    class="border border-coral-200 py-1 px-2 text-gray-400 bg-white text-xs rounded-lg min-w-[100px] w-full"
                  >
                    <option value="" class="text-xs">Select Agent</option>
                    <option
                      v-for="admin in adminLists"
                      :key="admin.id"
                      :value="admin.id"
                    >
                      {{ admin.name }}
                    </option>
                  </select>
                </div>
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
              <div
                class="p-2 bg-[#FF613c]/10 rounded-lg transition-all duration-150"
                :class="customFilter ? 'bg-[#FF613c]/20' : 'bg-[#FF613c]/10'"
                @click="customFilter = !customFilter"
              >
                <FunnelIcon class="h-4 w-4 text-[#FF613c] cursor-pointer" />
              </div>
              <div class="p-2 bg-[#FF613c]/10 rounded-lg relative group">
                <ChevronUpDownIcon
                  class="h-4 w-4 text-[#FF613c] cursor-pointer"
                />
                <div
                  class="absolute group-hover:block hidden -bottom-20 left-0 bg-white shadow-lg rounded-lg p-2"
                >
                  <p
                    class="whitespace-nowrap cursor-pointer py-2 px-4 text-xs hover:text-[#FF613c]"
                    :class="
                      sale_date_order_by === 'desc' ? 'text-[#FF613c]' : ''
                    "
                    @click="sale_date_order_by = `desc`"
                  >
                    Latest to First
                  </p>
                  <p
                    class="whitespace-nowrap cursor-pointer py-2 px-4 text-xs hover:text-[#FF613c]"
                    :class="
                      sale_date_order_by === 'asc' ? 'text-[#FF613c]' : ''
                    "
                    @click="sale_date_order_by = `asc`"
                  >
                    Fast to Latest
                  </p>
                </div>
              </div>
            </div>
            <div class="flex justify-end w-full items-center gap-x-2">
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
              <p
                @click="clearFilter"
                class="bg-[#FF613c] cursor-pointer text-white px-3 py-1 rounded-lg text-sm font-semibold"
              >
                CLEAR
              </p>
              <p
                @click="searchHandler"
                class="bg-[#FF613c] cursor-pointer text-white px-3 py-1 rounded-lg text-sm font-semibold"
              >
                FILTER
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
