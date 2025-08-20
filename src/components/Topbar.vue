<template>
  <div class="h-[80px] flex items-center justify-between px-[20px] w-full">
    <div class="flex items-center gap-3"></div>
    <div class="">
      <div class="flex items-center justify-start space-x-6 cursor-pointer">
        <div class="relative" @click="showOrder = !showOrder">
          <p
            class="absolute top-0 right-0 text-[10px] bg-[#FF613c] px-2 py-1 rounded-full text-white animate-pulse"
          >
            {{ todayOrders?.total_orders }}
          </p>
          <div
            :class="
              todayOrders?.total_orders > 0 ? 'border border-[#FF613c]/20 ' : ''
            "
            class="bg-white space-x-2 shadow pl-4 py-2 pr-2 rounded-full flex justify-center items-center"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/10962/10962237.png"
              alt=""
              class="w-6 h-6"
            />
            <div>
              <p class="text-xs">Today Orders</p>
              <p class="text-[10px]">To remind for all users</p>
            </div>
          </div>

          <div
            v-if="showOrder"
            class="z-50 my-4 w-[600px] text-base list-none divide-y divide-gray-100 rounded-md shadow-lg border border-[#FF613c]/10 absolute top-10 right-[0px] overflow-hidden bg-white"
          >
            <!-- Header -->
            <div class="px-4 py-3 bg-gray-50 border-b">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-semibold text-gray-800">
                  Today's Orders
                </h3>
                <span
                  class="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full"
                >
                  {{ todayOrders?.total_orders }} orders
                </span>
              </div>
            </div>

            <!-- Loading state -->
            <div v-if="loadingOrders" class="px-4 py-8 text-center">
              <div
                class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"
              ></div>
              <p class="text-xs text-gray-500 mt-2">Loading orders...</p>
            </div>

            <!-- Creator Stats Section -->
            <div
              v-else-if="todayOrders?.orders_detail?.length > 0"
              class="max-h-80 overflow-y-auto"
            >
              <!-- Creator List -->
              <div class="px-2 py-2 space-y-2">
                <div
                  v-for="(stats, creatorName) in creatorStats"
                  :key="creatorName"
                  class="bg-gray-50 rounded-lg p-3 border border-gray-200"
                >
                  <div class="flex items-center justify-between">
                    <!-- Creator Info -->
                    <div class="flex items-center space-x-3">
                      <div
                        class="w-10 h-10 bg-orange-500 bg-opacity-10 rounded-full flex items-center justify-center"
                      >
                        <svg
                          class="w-5 h-5 text-orange-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <h4 class="text-sm font-semibold text-gray-800">
                          {{ creatorName }}
                        </h4>
                        <p class="text-xs text-gray-500">
                          {{ stats.totalOrders }} total orders
                        </p>
                      </div>
                    </div>

                    <!-- Customer Stats -->
                    <div class="text-right">
                      <div
                        :class="getNewCustomerColor(stats.newCustomers)"
                        class="text-2xl font-bold"
                      >
                        {{ stats.newCustomers }}
                      </div>
                      <div class="text-xs text-gray-500">New Customers</div>
                    </div>
                  </div>

                  <!-- Progress Bar -->
                  <div class="mt-3">
                    <div
                      class="flex justify-between text-xs text-gray-500 mb-1"
                    >
                      <span>New Customer Rate</span>
                      <span>{{ stats.customerRate }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div
                        :class="getProgressBarColor(stats.customerRate)"
                        class="rounded-full h-2 transition-all duration-300"
                        :style="{ width: stats.customerRate + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Summary Stats -->
              <div class="px-4 py-3 bg-gray-50 border-t">
                <div class="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div class="text-lg font-bold text-gray-800">
                      {{ totalOrders }}
                    </div>
                    <div class="text-xs text-gray-500">Total Orders</div>
                  </div>
                  <div>
                    <div class="text-lg font-bold text-orange-600">
                      {{ totalNewCustomers }}
                    </div>
                    <div class="text-xs text-gray-500">New Customers</div>
                  </div>
                  <div>
                    <div class="text-lg font-bold text-blue-600">
                      {{ Object.keys(creatorStats).length }}
                    </div>
                    <div class="text-xs text-gray-500">Active Creators</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty state -->
            <div v-else class="px-4 py-8 text-center">
              <div class="text-gray-400 mb-2">
                <svg
                  class="w-8 h-8 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                  ></path>
                </svg>
              </div>
              <p class="text-sm text-gray-500">No orders today</p>
              <p class="text-xs text-gray-400">
                Orders will appear here when created
              </p>
            </div>

            <!-- Footer -->
            <div class="px-4 py-3 bg-gray-50 border-t">
              <button
                @click="viewAllOrders"
                class="w-full text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                View All Orders →
              </button>
            </div>
          </div>
        </div>
        <!-- drop down  -->
        <div class="relative">
          <div
            class="flex justify-end items-center gap-4"
            @click="toggleTopbarHandler"
          >
            <button
              type="button"
              class="flex text-sm bg-gray-800 rounded-full focus:ring-0 hover:shadow focus:ring-gray-300 dark:focus:ring-gray-600"
            >
              <img
                class="rounded-full w-9 h-9 md:w-10 md:h-10"
                :src="`https://ui-avatars.com/api/?background=ff613c&color=fff&name=${authStore.user.name}&font-size=0.33`"
                alt=""
              />
            </button>

            <div>
              <p class="text-xs font-semibold">{{ authStore.user.name }}</p>
              <p class="text-[12px]">{{ authStore.user.role }}</p>
            </div>
            <div>
              <ChevronDownIcon class="w-5 h-5 text-[#FF5B00] font-bold" />
            </div>
          </div>
          <div
            v-if="isTopBarDropdownShow"
            class="z-50 my-4 w-[300px] text-base list-none divide-y divide-gray-100 rounded-md shadow absolute top-7 right-[0px] overflow-hidden"
          >
            <div class="px-4 py-3 bg-white" role="none">
              <p class="text-sm text-gray-700" role="none">
                {{ authStore.user.name }}
              </p>
              <p class="text-xs text-gray-600 truncate" role="none">
                {{ authStore.user.email }}
              </p>
            </div>
            <ul class="py-0 divide-y divide-white" role="none">
              <li>
                <p
                  class="block px-4 py-2 text-sm text-gray-500 bg-white hover:text-blue-400 hover:scale-105"
                >
                  <i class="mr-2 fa-solid fa-gear"></i>Setting
                </p>
              </li>
              <li>
                <p
                  @click.prevent="logoutHandler"
                  class="block px-4 py-2 text-sm text-gray-500 bg-white hover:text-red-400 hover:scale-105"
                >
                  <i class="mr-1 fa-solid fa-arrow-right-from-bracket"></i>
                  Logout
                </p>
              </li>
              <li v-if="authStore.user.role == 'super_admin'">
                <p
                  @click.prevent="logoutHandlerAllUser"
                  class="block px-4 py-2 text-sm text-gray-500 bg-white hover:text-red-400 hover:scale-105"
                >
                  <i class="mr-1 fa-solid fa-arrow-right-from-bracket"></i>
                  All User Logout from Admin
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  MagnifyingGlassIcon,
  // BellIcon,
  Bars3Icon,
  ArrowUturnLeftIcon,
  ChevronDownIcon,
} from "@heroicons/vue/24/outline";
import { useSidebarStore } from "../stores/sidebar";
import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";
import { useToast } from "vue-toastification";
const sidebarStore = useSidebarStore();
const authStore = useAuthStore();
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { ref } from "vue";
import { useOrderStore } from "../stores/order";
import { computed } from "vue";
const router = useRouter();
const { isTopBarDropdownShow, isShowSidebar } = storeToRefs(sidebarStore);
const props = defineProps({});

const toast = useToast();
const orderStore = useOrderStore();

const showOrder = ref(true);

const toggleSidebarHandler = () => {
  sidebarStore.toggleSidebar();
};

const toggleTopbarHandler = () => {
  sidebarStore.toggleTopBarDropdown();
};
const logoutHandler = async () => {
  try {
    const response = await authStore.logout();

    toast.success(response.message);
    router.push("/login");
  } catch (error) {
    console.log(error);
  }
};

const todayOrders = ref([]);
const loadingOrders = ref(false);
const fetchTodayOrders = async () => {
  try {
    loadingOrders.value = true;
    // Adjust this API call based on your order store method
    const response = await orderStore.getReport(); // You might need to create this method

    if (response.status == 1) {
      todayOrders.value = response.result.today;
    }

    console.log(todayOrders.value);
  } catch (error) {
    console.error("Error fetching today orders:", error);
    toast.error("Failed to load today's orders");
  } finally {
    loadingOrders.value = false;
  }
};

const logoutHandlerAllUser = async () => {
  try {
    const response = await authStore.logoutAllUser();
    // router.push("/login");
    console.log(response);

    toast.success(response.message);
    router.push("/login");
  } catch (error) {
    console.log(error);
  }
};

// const goBack = () => {
//   router.go(-1);
// };

// Add these computed properties and methods to your existing script setup

// Computed properties for creator stats
const creatorStats = computed(() => {
  if (!todayOrders.value?.orders_detail) return {};

  const stats = {};
  const orders = todayOrders.value.orders_detail;

  orders.forEach((order) => {
    const creatorName = order.admin_name || "Unknown Creator";

    if (!stats[creatorName]) {
      stats[creatorName] = {
        totalOrders: 0,
        newCustomers: 0,
        customerRate: 0,
      };
    }

    stats[creatorName].totalOrders++;

    if (order.is_customer_create === "1") {
      stats[creatorName].newCustomers++;
    }
  });

  // Calculate customer creation rate for each creator
  Object.keys(stats).forEach((creatorName) => {
    const creator = stats[creatorName];
    creator.customerRate =
      creator.totalOrders > 0
        ? Math.round((creator.newCustomers / creator.totalOrders) * 100)
        : 0;
  });

  // Sort by new customers count (descending)
  const sortedStats = {};
  Object.keys(stats)
    .sort((a, b) => stats[b].newCustomers - stats[a].newCustomers)
    .forEach((key) => {
      sortedStats[key] = stats[key];
    });

  return sortedStats;
});

const totalOrders = computed(() => {
  return todayOrders.value?.orders_detail?.length || 0;
});

const totalNewCustomers = computed(() => {
  if (!todayOrders.value?.orders_detail) return 0;
  return todayOrders.value.orders_detail.filter(
    (order) => order.is_customer_create === "1"
  ).length;
});

// Helper methods for styling
const getNewCustomerColor = (count) => {
  if (count >= 3) return "text-green-600";
  if (count >= 2) return "text-orange-600";
  if (count >= 1) return "text-blue-600";
  return "text-gray-600";
};

const getProgressBarColor = (rate) => {
  if (rate >= 70) return "bg-green-500";
  if (rate >= 50) return "bg-orange-500";
  if (rate >= 30) return "bg-yellow-500";
  return "bg-red-500";
};

onMounted(async () => {
  const screenWidth = window.innerWidth;
  console.log("Screen Width:", screenWidth);

  if (screenWidth > 1000) {
    // Assuming '1024px' is the breakpoint for tablets
    if (isShowSidebar.value == true) {
      toggleSidebarHandler();
    }
  }

  await fetchTodayOrders();

  console.log("====================================");
  console.log("isShowSidebar:", isShowSidebar.value);
  console.log("====================================");
});
</script>

<style lang="scss" scoped></style>
