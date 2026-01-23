<template>
  <div
    class="h-[80px] relative flex items-center border-b border-gray-200 justify-between px-[20px] w-full"
  >
    <div class="flex items-center gap-3"></div>

    <div class="">
      <div class="flex justify-end items-center space-x-6 cursor-pointer">
        <!-- ✅ ORDERS NOTIFICATION (Keep existing) -->
        <div class="relative">
          <div class="relative" @click="showOrder = !showOrder">
            <p
              class="absolute -top-1 -right-1 text-[10px] bg-[#FF613c] px-2 py-1 rounded-full text-white animate-pulse"
              v-if="newCustomerOrdersCount > 0"
            >
              {{ newCustomerOrdersCount }}
            </p>
            <div
              :class="
                newCustomerOrdersCount > 0 ? 'border border-[#FF613c]/20' : ''
              "
              class="bg-white space-x-2 shadow pl-4 py-2 pr-2 rounded-full flex justify-center items-center hover:shadow-md transition-shadow"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/3565/3565856.png"
                alt="Orders"
                class="w-6 h-6"
              />
            </div>
          </div>

          <!-- Orders Dropdown (Keep existing) -->
          <div
            v-if="showOrder"
            class="z-[100] my-4 w-[650px] text-base list-none divide-y divide-gray-100 rounded-md shadow-lg border border-[#FF613c]/10 absolute top-12 right-0 overflow-hidden bg-white"
          >
            <!-- Keep your existing orders dropdown content -->
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

            <div v-if="loadingOrders" class="px-4 py-8 text-center">
              <div
                class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"
              ></div>
              <p class="text-xs text-gray-500 mt-2">Loading orders...</p>
            </div>

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

            <div v-else class="px-4 py-8 text-center">
              <p class="text-sm text-gray-500">No orders found today</p>
            </div>
          </div>
        </div>

        <!-- ✅ NEW - CHAT NOTIFICATIONS -->
        <div class="relative">
          <div class="relative cursor-pointer" @click="toggleNotifications">
            <!-- Unread Badge -->
            <p
              v-if="notificationStore.unreadCount > 0"
              class="absolute -top-1 -right-1 text-[10px] bg-blue-600 px-2 py-1 rounded-full text-white animate-pulse"
            >
              {{ notificationStore.unreadCount }}
            </p>

            <!-- Bell Icon -->
            <div
              :class="
                notificationStore.unreadCount > 0
                  ? 'border border-blue-600/20'
                  : ''
              "
              class="bg-white shadow p-2 rounded-full flex justify-center items-center hover:shadow-md transition-shadow"
            >
              <svg
                class="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
          </div>

          <!-- Notifications Dropdown -->
          <div
            v-if="showNotifications"
            class="z-[100] my-4 w-[400px] text-base list-none divide-y divide-gray-100 rounded-md shadow-lg border border-blue-600/10 absolute top-12 right-0 overflow-hidden bg-white"
          >
            <!-- Header -->
            <div class="px-4 py-3 bg-gray-50 border-b">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-semibold text-gray-800">
                  Notifications
                </h3>
                <div class="flex items-center gap-2">
                  <span
                    class="text-xs text-white bg-blue-600 px-2 py-1 rounded-full"
                  >
                    {{ notificationStore.unreadCount }} new
                  </span>
                  <button
                    v-if="notificationStore.unreadCount > 0"
                    @click="markAllAsRead"
                    class="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Mark all read
                  </button>
                </div>
              </div>
            </div>

            <!-- Loading -->
            <div v-if="notificationStore.loading" class="px-4 py-8 text-center">
              <div
                class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"
              ></div>
              <p class="text-xs text-gray-500 mt-2">Loading notifications...</p>
            </div>

            <!-- Notifications List -->
            <div
              v-else-if="notificationStore.unreadNotifications.length > 0"
              class="max-h-96 overflow-y-auto"
            >
              <div
                v-for="notification in notificationStore.unreadNotifications"
                :key="notification._id"
                @click="handleNotificationClick(notification)"
                class="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
                :class="{ 'bg-blue-50': !notification.isRead }"
              >
                <div class="flex items-start space-x-3">
                  <!-- Icon -->
                  <div
                    class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                  >
                    <svg
                      class="w-5 h-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                      />
                      <path
                        d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                      />
                    </svg>
                  </div>

                  <!-- Content -->
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900">
                      {{ notification.data.senderName }}
                    </p>
                    <p class="text-sm text-gray-600 truncate">
                      {{ notification.data.message }}
                    </p>
                    <p class="text-xs text-gray-500 mt-1">
                      {{ formatNotificationTime(notification.createdAt) }}
                    </p>
                  </div>

                  <!-- Unread Indicator -->
                  <div v-if="!notification.isRead" class="flex-shrink-0">
                    <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="px-4 py-8 text-center">
              <div class="text-gray-400 mb-2">
                <svg
                  class="w-12 h-12 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
              <p class="text-sm text-gray-500">No new notifications</p>
              <p class="text-xs text-gray-400 mt-1">You're all caught up!</p>
            </div>

            <!-- Footer - View All -->
            <div class="px-4 py-2 bg-gray-50 text-center">
              <button
                @click="goToChat"
                class="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View all in Chat
              </button>
            </div>
          </div>
        </div>

        <!-- User Dropdown (Keep existing) -->
        <div class="relative">
          <div
            class="flex justify-end items-center gap-4"
            @click="toggleTopbarHandler"
          >
            <button
              type="button"
              class="flex text-sm bg-gray-800 rounded-full focus:ring-0 hover:shadow focus:ring-gray-300"
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

          <!-- User Dropdown Menu (Keep existing) -->
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
              <li v-if="authStore.user.role == 'super_admin'">
                <p
                  @click.prevent="showDiscountModal = true"
                  class="block px-4 py-2 text-sm text-gray-500 bg-white hover:text-green-400 hover:scale-105"
                >
                  <i class="fa-solid fa-percent mr-1"></i>
                  Customer Web Discount
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Discount Modal (Keep existing) -->
    <Modal :isOpen="showDiscountModal" @closeModal="showDiscountModal = false">
      <DialogPanel
        class="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
      >
        <Discount @closeModal="showDiscountModal = false" />
      </DialogPanel>
    </Modal>
  </div>
</template>

<script setup>
import { ChevronDownIcon } from "@heroicons/vue/24/outline";
import { useSidebarStore } from "../stores/sidebar";
import { useAuthStore } from "../stores/auth";
import { useNotificationStore } from "../stores/notification"; // ✅ ADD THIS
import { storeToRefs } from "pinia";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import { onMounted, ref, computed } from "vue";
import { useOrderStore } from "../stores/order";
import Discount from "../views/Discount.vue";
import Modal from "./Modal.vue";
import { Dialog, DialogPanel } from "@headlessui/vue";

const sidebarStore = useSidebarStore();
const authStore = useAuthStore();
const notificationStore = useNotificationStore(); // ✅ ADD THIS
const orderStore = useOrderStore();
const router = useRouter();
const toast = useToast();

const { isTopBarDropdownShow, isShowSidebar } = storeToRefs(sidebarStore);

// State
const showDiscountModal = ref(false);
const showOrder = ref(false);
const showNotifications = ref(false); // ✅ ADD THIS
const todayOrdersData = ref(null);
const loadingOrders = ref(false);

// Methods
const toggleSidebarHandler = () => {
  sidebarStore.toggleSidebar();
};

const toggleTopbarHandler = () => {
  sidebarStore.toggleTopBarDropdown();
};

// ✅ ADD THIS - Toggle notifications
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;

  // Close orders dropdown if open
  if (showNotifications.value) {
    showOrder.value = false;
  }
};

// ✅ ADD THIS - Handle notification click
const handleNotificationClick = async (notification) => {
  try {
    // Mark as read
    await notificationStore.markAsRead(notification._id);

    // Navigate to chat with conversation
    router.push({
      path: "/chat",
      query: { conversation: notification.conversationId },
    });

    // Close dropdown
    showNotifications.value = false;
  } catch (error) {
    console.error("Error handling notification click:", error);
  }
};

// ✅ ADD THIS - Mark all as read
const markAllAsRead = async () => {
  try {
    await notificationStore.markAllAsRead();
    toast.success("All notifications marked as read");
  } catch (error) {
    console.error("Error marking all as read:", error);
    toast.error("Failed to mark notifications as read");
  }
};

// ✅ ADD THIS - Go to chat
const goToChat = () => {
  showNotifications.value = false;
  router.push("/chat");
};

// ✅ ADD THIS - Format notification time
const formatNotificationTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
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

const logoutHandlerAllUser = async () => {
  try {
    const response = await authStore.logoutAllUser();
    toast.success(response.message);
    router.push("/login");
  } catch (error) {
    console.log(error);
  }
};

// Orders methods (keep existing)
const fetchTodayOrders = async () => {
  try {
    loadingOrders.value = true;
    let params = {
      order_datetime: new Date().toISOString().split("T")[0],
      limit: 100,
    };

    const response = await orderStore.getListAction(params);

    if (response.status === 1 && response.result && response.result.data) {
      todayOrdersData.value = response.result;
    }
  } catch (error) {
    console.error("Error fetching today orders:", error);
    toast.error("Failed to load today's orders");
  } finally {
    loadingOrders.value = false;
  }
};

const newCustomerOrdersCount = computed(() => {
  return todayOrdersData.value?.data?.length || 0;
});

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

// ✅ ADD THIS - Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  const notifDropdown = event.target.closest(".relative");
  if (!notifDropdown) {
    showNotifications.value = false;
    showOrder.value = false;
  }
};

onMounted(async () => {
  const screenWidth = window.innerWidth;

  if (screenWidth > 1000) {
    if (isShowSidebar.value == true) {
      toggleSidebarHandler();
    }
  }

  // Fetch orders
  await fetchTodayOrders();

  // ✅ ADD THIS - Fetch notifications
  try {
    await notificationStore.fetchUnreadNotifications();
  } catch (error) {
    console.error("Failed to load notifications:", error);
  }

  // ✅ ADD THIS - Add click outside listener
  document.addEventListener("click", handleClickOutside);
});

// ✅ ADD THIS - Cleanup
import { onBeforeUnmount } from "vue";
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
