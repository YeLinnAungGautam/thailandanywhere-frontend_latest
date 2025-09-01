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
              v-if="newCustomerOrdersCount > 0"
            >
              {{ newCustomerOrdersCount }}
            </p>
            <div
              :class="
                newCustomerOrdersCount > 0 ? 'border border-[#FF613c]/20 ' : ''
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
                    Orders Today
                  </h3>
                  <span
                    class="text-xs text-white bg-green-500 px-2 py-1 rounded-full"
                  >
                    {{ newCustomerOrdersCount }} orders
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

              <!-- Simple Order List -->
              <div
                v-else-if="
                  todayOrdersData &&
                  todayOrdersData.data &&
                  todayOrdersData.data.length > 0
                "
                class="max-h-80 overflow-y-auto"
              >
                <div class="p-2">
                  <div
                    v-for="order in todayOrdersData.data"
                    :key="order.id"
                    class="mb-2 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm"
                  >
                    <div class="text-sm space-y-1">
                      <div class="font-semibold text-gray-800">
                        {{ order.customer?.name || "Unknown" }}
                      </div>
                      <div class="flex justify-between items-center pt-1">
                        <span
                          :class="getStatusColor(order.order_status)"
                          class="px-2 py-1 text-xs rounded"
                        >
                          {{ formatOrderStatus(order.order_status) }}
                        </span>
                        <span class="text-green-600 font-semibold"
                          >${{ order.grand_total }}</span
                        >
                      </div>
                      <div class="text-xs text-gray-600 pt-1 space-y-1">
                        <div>Agent: {{ order.admin?.name || "Unknown" }}</div>
                        <div>
                          Phone: {{ order.customer?.phone_number || "N/A" }}
                        </div>
                        <div>Discount: ${{ order.discount || "0.00" }}</div>
                      </div>
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
                <p class="text-sm text-gray-500">No orders found today</p>
                <p class="text-xs text-gray-400">
                  Orders will appear here when available
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

const todayOrdersData = ref(null);
const loadingOrders = ref(false);

const fetchTodayOrders = async () => {
  try {
    loadingOrders.value = true;
    let params = {
      // Use today's date instead of hardcoded date
      order_datetime: new Date().toISOString().split("T")[0],
      // order_datetime: "2025-08-30", // Keep for testing
      limit: 100, // Increase limit to get more orders
    };

    const response = await orderStore.getListAction(params);

    console.log("API Response:", response);

    if (response.status === 1 && response.result && response.result.data) {
      todayOrdersData.value = response.result;
      console.log("Orders Data:", todayOrdersData.value);
    }
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

// Count of orders
const newCustomerOrdersCount = computed(() => {
  return todayOrdersData.value?.data?.length || 0;
});

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

// Format date helper
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return (
    date.toLocaleDateString() +
    " " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
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
