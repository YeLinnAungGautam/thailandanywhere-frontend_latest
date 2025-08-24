<template>
  <div
    class="h-[80px] relative flex items-center justify-between px-[20px] w-full"
  >
    <div class="flex items-center gap-3"></div>
    <div class="">
      <div class="flex items-center justify-start space-x-6 cursor-pointer">
        <div
          class="absolute top-5 right-[400px] bg-white space-x-2 shadow px-5 py-3.5 rounded-full flex justify-center items-center"
          @click="showOrder = false"
          v-if="showOrder == true"
        >
          <p class="text-xs">Close Order List</p>
        </div>
        <div class="absolute top-5 right-[200px]">
          <div class="relative" @click="showOrder = true">
            <p
              class="absolute top-0 right-0 text-[10px] bg-[#FF613c] px-2 py-1 rounded-full text-white animate-pulse"
            >
              {{ todayOrders?.customer_create_yes }}
            </p>
            <div
              :class="
                todayOrders?.customer_create_yes > 0
                  ? 'border border-[#FF613c]/20 '
                  : ''
              "
              class="bg-white space-x-2 shadow pl-4 py-2 pr-2 rounded-full flex justify-center items-center"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/3565/3565856.png"
                alt=""
                class="w-6 h-6"
              />
              <div>
                <p class="text-xs">New Customers Today</p>
              </div>
            </div>

            <div
              v-if="showOrder"
              class="z-[100] my-4 w-[650px] text-base list-none divide-y divide-gray-100 rounded-md shadow-lg border border-[#FF613c]/10 absolute top-10 right-[0px] overflow-hidden bg-white"
            >
              <!-- Header -->
              <div class="px-4 py-3 bg-gray-50 border-b">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-semibold text-gray-800">
                    New Customers Created Today
                  </h3>

                  <span
                    class="text-xs text-white bg-green-500 px-2 py-1 rounded-full"
                  >
                    {{ newCustomerOrders.length }} new customers
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

              <!-- Agent Stats Section -->
              <div
                v-else-if="newCustomerOrders.length > 0"
                class="max-h-80 overflow-y-auto"
              >
                <!-- Orders Grouped by Agent -->
                <div class="px-2 py-2 space-y-3">
                  <!-- Agent Groups -->
                  <div
                    v-for="(agentOrders, agentName) in ordersByAgent"
                    :key="agentName"
                    class="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
                  >
                    <!-- Agent Header - Clickable -->
                    <div
                      @click="toggleAgentExpansion(agentName)"
                      class="bg-blue-50 px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-blue-100 transition-colors"
                    >
                      <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                          <div
                            class="w-8 h-8 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center"
                          >
                            <span class="text-sm font-bold text-blue-600">
                              {{ agentName.charAt(0) }}
                            </span>
                          </div>
                          <div class="flex-1">
                            <h4 class="text-sm font-semibold text-gray-800">
                              {{ agentName }}
                            </h4>
                            <p class="text-xs text-gray-600">Agent</p>

                            <!-- Progress Bar Section -->
                            <div class="mt-2 space-y-1">
                              <div
                                class="flex items-center space-x-2 justify-between text-xs"
                              >
                                <span class="text-green-600 font-medium">
                                  {{ getAgentSaleConverts(agentOrders) }}
                                  converted
                                </span>
                                <span class="text-gray-500">
                                  {{ getAgentPending(agentOrders) }} pending
                                </span>
                              </div>

                              <!-- Progress Bar -->
                              <div class="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  class="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                                  :style="{
                                    width:
                                      getConversionPercentage(agentOrders) +
                                      '%',
                                  }"
                                ></div>
                              </div>

                              <div class="text-xs text-gray-600 text-center">
                                {{ getConversionPercentage(agentOrders) }}%
                                conversion rate
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="flex items-center space-x-2">
                          <div class="text-right">
                            <div class="text-lg font-bold text-green-600">
                              {{ agentOrders.length }}
                            </div>
                            <div class="text-xs text-gray-600">
                              New Customers
                            </div>
                          </div>
                          <!-- Dropdown Arrow -->
                          <div class="ml-2">
                            <svg
                              :class="
                                expandedAgents[agentName] ? 'rotate-180' : ''
                              "
                              class="w-5 h-5 text-gray-400 transition-transform duration-200"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 9l-7 7-7-7"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Agent's Orders - Collapsible -->
                    <div
                      v-if="expandedAgents[agentName]"
                      class="p-3 space-y-2 bg-white"
                    >
                      <div
                        v-for="order in agentOrders"
                        :key="order.order_id"
                        class="bg-white rounded-lg p-3 border border-green-200 hover:shadow-sm transition-shadow"
                      >
                        <div class="flex items-start justify-between">
                          <!-- Order Info -->
                          <div class="flex-1">
                            <div class="flex items-center space-x-2 mb-2">
                              <h5 class="text-sm font-semibold text-gray-800">
                                Order
                              </h5>
                            </div>

                            <!-- Customer Details -->
                            <div class="space-y-1">
                              <!-- Customer Info -->
                              <div
                                class="flex items-center space-x-2 text-xs text-gray-700"
                              >
                                <svg
                                  class="w-3 h-3 text-green-600"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"
                                  ></path>
                                </svg>
                                <span class="font-medium">Customer:</span>
                                <span
                                  class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium"
                                >
                                  {{
                                    order.crm_id !== "N/A"
                                      ? order.crm_id
                                      : "New Customer (No ID yet)"
                                  }}
                                </span>
                              </div>

                              <!-- Booking Info -->
                              <div
                                v-if="order.booking_id"
                                class="flex items-center space-x-2 text-xs text-gray-700"
                              >
                                <svg
                                  class="w-3 h-3 text-purple-600"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                                  ></path>
                                  <path
                                    fill-rule="evenodd"
                                    d="M4 5a2 2 0 012-2v1a1 1 0 002 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 2a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                                    clip-rule="evenodd"
                                  ></path>
                                </svg>
                                <span class="font-medium">Booking:</span>
                                <span class="text-purple-700 font-medium"
                                  >#{{ order.booking_id }}</span
                                >
                              </div>

                              <!-- Admin Assignment (if different from creator) -->
                              <div
                                v-if="order.admin_name !== agentName"
                                class="flex items-center space-x-2 text-xs text-gray-600"
                              >
                                <svg
                                  class="w-3 h-3 text-gray-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  ></path>
                                </svg>
                                <span class="font-medium">Assigned to:</span>
                                <span class="text-gray-700">{{
                                  order.admin_name
                                }}</span>
                              </div>
                            </div>
                          </div>

                          <!-- Status Badge -->
                          <div class="ml-4">
                            <span
                              :class="getStatusColor(order.order_status)"
                              class="px-2 py-1 text-xs rounded-full font-medium"
                            >
                              {{ formatOrderStatus(order.order_status) }}
                            </span>
                          </div>
                        </div>
                      </div>

                      <!-- No orders message for expanded agent -->
                      <div
                        v-if="agentOrders.length === 0"
                        class="text-center py-4 text-gray-500 text-sm"
                      >
                        No new customer orders for this agent
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Summary Stats -->
                <div class="px-4 py-3 bg-gray-50 border-t">
                  <div class="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div class="text-lg font-bold text-green-600">
                        {{ newCustomerOrders.length }}
                      </div>
                      <div class="text-xs text-gray-600">New Customers</div>
                    </div>
                    <div>
                      <div class="text-lg font-bold text-blue-600">
                        {{ Object.keys(agentNewCustomerStats).length }}
                      </div>
                      <div class="text-xs text-gray-600">Active Agents</div>
                    </div>
                    <div>
                      <div class="text-lg font-bold text-purple-600">
                        {{ newCustomersWithBooking }}
                      </div>
                      <div class="text-xs text-gray-600">With Bookings</div>
                    </div>
                    <div>
                      <div class="text-lg font-bold text-orange-600">
                        {{ getTotalSaleConverts() }}
                      </div>
                      <div class="text-xs text-gray-600">Total Conversions</div>
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
                      d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"
                    ></path>
                  </svg>
                </div>
                <p class="text-sm text-gray-500">
                  No new customers created today
                </p>
                <p class="text-xs text-gray-400">
                  New customer orders will appear here
                </p>
              </div>
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
import { onMounted, watch } from "vue";
import { ref } from "vue";
import { useOrderStore } from "../stores/order";
import { computed } from "vue";
const router = useRouter();
const { isTopBarDropdownShow, isShowSidebar } = storeToRefs(sidebarStore);
const props = defineProps({});

const toast = useToast();
const orderStore = useOrderStore();

const showOrder = ref(false);
const expandedAgents = ref({}); // Track which agents are expanded

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
    const response = await orderStore.getReport();

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

const closeFunction = () => {
  showOrder.value = false;
};

const logoutHandlerAllUser = async () => {
  try {
    const response = await authStore.logoutAllUser();
    console.log(response);

    toast.success(response.message);
    router.push("/login");
  } catch (error) {
    console.log(error);
  }
};

const viewAllOrders = () => {
  router.push("/orders");
};

// Function to toggle agent expansion
const toggleAgentExpansion = (agentName) => {
  expandedAgents.value[agentName] = !expandedAgents.value[agentName];
  showOrder.value = true; // Ensure dropdown stays open when toggling
};

// Only show orders where is_customer_create === "1"
const newCustomerOrders = computed(() => {
  if (!todayOrders.value?.orders_detail) return [];
  return todayOrders.value.orders_detail.filter(
    (order) => order.is_customer_create == "1"
  );
});

// Group new customer orders by agent
const ordersByAgent = computed(() => {
  if (!newCustomerOrders.value.length) return {};

  const grouped = {};

  newCustomerOrders.value.forEach((order) => {
    // Use created_by_name if available, otherwise use admin_name
    const agentName =
      order.created_by_name !== "N/A"
        ? order.created_by_name
        : order.admin_name;

    if (!grouped[agentName]) {
      grouped[agentName] = [];
    }

    grouped[agentName].push(order);
  });

  // Sort agents by number of new customers (descending)
  const sortedGrouped = {};
  Object.keys(grouped)
    .sort((a, b) => grouped[b].length - grouped[a].length)
    .forEach((key) => {
      // Also sort orders within each agent by order_id (newest first)
      grouped[key].sort((a, b) => b.order_id - a.order_id);
      sortedGrouped[key] = grouped[key];
    });

  return sortedGrouped;
});

// Agent stats focused only on new customer creation
const agentNewCustomerStats = computed(() => {
  if (!newCustomerOrders.value.length) return {};

  const stats = {};

  newCustomerOrders.value.forEach((order) => {
    // Use created_by_name if available, otherwise use admin_name
    const agentName =
      order.created_by_name !== "N/A"
        ? order.created_by_name
        : order.admin_name;

    if (!stats[agentName]) {
      stats[agentName] = {
        newCustomerCount: 0,
      };
    }

    stats[agentName].newCustomerCount++;
  });

  // Sort by new customer count (descending)
  const sortedStats = {};
  Object.keys(stats)
    .sort((a, b) => stats[b].newCustomerCount - stats[a].newCustomerCount)
    .forEach((key) => {
      sortedStats[key] = stats[key];
    });

  return sortedStats;
});

// Count new customers with booking
const newCustomersWithBooking = computed(() => {
  return newCustomerOrders.value.filter((order) => order.booking_id !== null)
    .length;
});

// Helper methods for progress bar
const getAgentSaleConverts = (agentOrders) => {
  return agentOrders.filter((order) => order.order_status === "sale_convert")
    .length;
};

const getAgentPending = (agentOrders) => {
  return agentOrders.filter((order) => order.order_status !== "sale_convert")
    .length;
};

const getConversionPercentage = (agentOrders) => {
  if (agentOrders.length === 0) return 0;
  const converted = getAgentSaleConverts(agentOrders);
  return Math.round((converted / agentOrders.length) * 100);
};

const getTotalSaleConverts = () => {
  return newCustomerOrders.value.filter(
    (order) => order.order_status === "sale_convert"
  ).length;
};

// Helper methods for styling
const getStatusColor = (status) => {
  switch (status) {
    case "sale_convert":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatOrderStatus = (status) => {
  switch (status) {
    case "sale_convert":
      return "Sale Converted";
    case "cancelled":
      return "Cancelled";
    case "pending":
      return "Pending";
    case "processing":
      return "Processing";
    case "completed":
      return "Completed";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

onMounted(async () => {
  const screenWidth = window.innerWidth;
  console.log("Screen Width:", screenWidth);

  if (screenWidth > 1000) {
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
