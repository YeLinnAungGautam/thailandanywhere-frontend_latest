<template>
  <div
    class="bg-white text-white absolute md:relative transition-all duration-500 ease-in-out"
    :class="isShowSidebar ? 'w-[260px]' : 'w-[80px]'"
  >
    <div class="h-[80px] w-full flex items-center">
      <div class="flex w-full items-center justify-between px-[20px]">
        <div class="flex items-center">
          <h3 class="text-sm font-medium md:text-sm lg:text-base">
            <img
              src="../../public/web-logo.png"
              class="min-w-10 max-w-10 max-h-10 min-h-10 rounded"
              alt=""
            />
          </h3>
          <p
            class="ml-2 font-medium tracking-wide text-sm text-[#FF5B00] transition-opacity duration-500 ease-in-out"
            :class="isShowSidebar ? 'opacity-100' : 'hidden'"
          >
            thanywhere
          </p>
        </div>
        <button
          class="block p-3 text-white bg-blue-500 rounded-md shadow md:hidden transition-transform duration-500 ease-in-out"
          @click.prevent="toggleSidebarHandler"
          :class="isShowSidebar ? 'rotate-180' : 'rotate-0'"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
    <div class="h-[calc(100vh-80px)] bg-opacity-0 py-[20px] z-50 relative">
      <div class="flex justify-between h-full space-y-[10px]">
        <div
          class="flex flex-col justify-between space-y-3 px-[14px] h-full overflow-y-auto no-scrollbar"
        >
          <div>
            <!-- Sidebar items here -->
            <div>
              <SidebarItem
                name="Dashboard"
                :icon="Squares2X2Icon"
                to="/"
                v-show="authStore.isSuperAdmin"
              />
              <SidebarItem
                name="Dashboard"
                :icon="Squares2X2Icon"
                to="/auditor_dashboard"
                v-show="authStore.isAuditor"
              />
              <SidebarItem
                name="Dashboard"
                :icon="Squares2X2Icon"
                to="/sales_dashboard"
                v-show="authStore.isSaleAdmin"
              />
              <SidebarItem
                name="Dashboard"
                :icon="Squares2X2Icon"
                to="/user_dashboard"
                v-show="
                  !authStore.isSuperAdmin &&
                  !authStore.isAuditor &&
                  !authStore.isSaleAdmin
                "
              />
              <SidebarItem
                name="Sales"
                v-if="
                  authStore.isSuperAdmin ||
                  authStore.isCashier ||
                  authStore.isAdmin ||
                  authStore.isSaleAdmin
                "
                :icon="CalendarIcon"
                to="/bookings/%25/%25/%25"
                :activePaths="[
                  'bookings',
                  'bookings_create',
                  'edit_bookings',
                  'update_bookings',
                  'bookings_new_create',
                  'update_new_bookings',
                ]"
              />
              <!-- <div
                v-if="!authStore.isAuditor"
                @click="toggleReservationShow"
                class="text-gray-600 bg-white cursor-pointer inline-flex mb-1 text-[.75rem] rounded-xl relative items-center py-[8px] px-[10px] w-full text-sm font-roboto hover:text-[#FF5B00] hover:bg-[#FF5B00]/20 transition duration-150"
              >
                <DocumentCheckIcon class="w-4 h-4" />
                <p
                  class="flex justify-between w-[80%] text-[12px] ml-[1.2rem] items-center"
                  v-if="isShowSidebar"
                >
                  Reservations
                  <ChevronDownIcon
                    class="w-4 h-4 transition-opacity duration-500 ease-in-out"
                    :class="isReservationShow ? 'opacity-0' : 'opacity-100'"
                    v-if="!isReservationShow"
                  />
                  <ChevronUpIcon
                    class="w-4 h-4 transition-opacity duration-500 ease-in-out"
                    :class="isReservationShow ? 'opacity-100' : 'opacity-0'"
                    v-if="isReservationShow"
                  />
                </p>
              </div> -->
              <!-- <div
                v-if="isReservationShow"
                class="transition-all duration-500 ease-in-out overflow-hidden"
                :class="
                  isReservationShow
                    ? 'ml-5 opacity-100 max-h-[500px]'
                    : 'opacity-0 max-h-0'
                "
              >
                <SidebarItem
                  name="v2"
                  :icon="DocumentCheckIcon"
                  to="/reservation-second"
                  :activePaths="['reservation-second']"
                />
                <SidebarItem
                  name="stable"
                  :icon="DocumentCheckIcon"
                  to="/reservation/%25/%25/%25"
                  :activePaths="['reservation', 'reservation-update']"
                />
              </div> -->

              <SidebarItem
                name="Reservation"
                :icon="TicketIcon"
                to="/reservation-second"
                :activePaths="['reservation-second']"
              />
              <SidebarItem
                name="Res Group"
                :icon="HomeModernIcon"
                to="/reservation-hotel"
                :activePaths="['reservation-hotel']"
              />
              <SidebarItem
                name="Accounting"
                :icon="CalculatorIcon"
                to="/accounting"
                :activePaths="['accounting']"
              />
              <SidebarItem
                name="Products"
                :icon="ArchiveBoxIcon"
                :activePaths="[
                  'products',
                  'inclusive-create',
                  'inclusive-view',
                  'vantourview',
                  'vantouredit',
                  'vantour',
                  'airportcreate',
                  'airportupdate',
                  'grouptour',
                  'grouptourview',
                  'grouptourcreate',
                  'entrance',
                  'entrancecreate',
                  'entranceupdate',
                  'hoteledit',
                  'inclusive-create-new',
                  'inclusive-view-new',
                ]"
                to="/products/page"
              />
              <SidebarItem
                v-if="!authStore.isAgent"
                name="Database"
                :icon="CircleStackIcon"
                :activePaths="['database', 'blog_categories']"
                to="/database/page"
              />
              <SidebarItem
                name="Blogs"
                v-if="!authStore.isAgent"
                :icon="DocumentTextIcon"
                to="/blogs"
                :activePaths="['new_blog']"
              />
              <SidebarItem
                name="Customers"
                v-if="!authStore.isAgent && !authStore.isAuditor"
                :icon="UsersIcon"
                to="/customers"
                :activePaths="[
                  'customers',
                  'customerscreate',
                  'customersupdate',
                ]"
              />
              <SidebarItem
                name="Users"
                v-if="authStore.isSuperAdmin"
                :icon="UsersIcon"
                to="/users"
                :activePaths="['users']"
              />
              <SidebarItem
                v-if="authStore.isSuperAdmin"
                name="Admins"
                :icon="UserCircleIcon"
                to="/admins"
                :activePaths="['admins']"
              />
              <div
                v-if="!authStore.isAuditor"
                @click="toggleSidebarShowSetting"
                class="text-gray-600 bg-white cursor-pointer inline-flex mb-1 text-[.75rem] rounded-xl relative items-center py-[8px] px-[10px] w-full text-sm font-roboto hover:text-[#FF5B00] hover:bg-[#FF5B00]/20 transition duration-150"
              >
                <Cog6ToothIcon class="w-4 h-4" />
                <p
                  class="flex justify-between w-[80%] text-[12px] ml-[1.2rem] items-center"
                  v-if="isShowSidebar"
                >
                  Setting
                  <ChevronDownIcon
                    class="w-4 h-4 transition-opacity duration-500 ease-in-out"
                    :class="isShowSetting ? 'opacity-0' : 'opacity-100'"
                    v-if="!isShowSetting"
                  />
                  <ChevronUpIcon
                    class="w-4 h-4 transition-opacity duration-500 ease-in-out"
                    :class="isShowSetting ? 'opacity-100' : 'opacity-0'"
                    v-if="isShowSetting"
                  />
                </p>
              </div>
              <div
                class="transition-all duration-150"
                :class="isShowSetting ? 'ml-5' : ''"
                v-if="isShowSetting"
              >
                <SidebarItem
                  name="Partners"
                  v-if="!authStore.isAgent && !authStore.isAuditor"
                  :icon="UserGroupIcon"
                  to="/partners"
                />
                <SidebarItem
                  v-if="!authStore.isAgent && !authStore.isAuditor"
                  name="Calendar"
                  :icon="CalendarDaysIcon"
                  to="/calendar"
                />
              </div>
              <SidebarItem
                v-if="!authStore.isAgent && !authStore.isAuditor"
                name="CarBookings"
                :icon="DocumentTextIcon"
                to="/car-bookings/unassigned"
                :activePaths="['car-bookings']"
              />
              <SidebarItem
                v-if="!authStore.isAgent && !authStore.isAuditor"
                name="Availabilities"
                :icon="CheckBadgeIcon"
                to="/availabilities"
                :activePaths="['availabilities']"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SidebarItem from "./SidebarItem.vue";
import { useSidebarStore } from "../stores/sidebar";

import {
  Squares2X2Icon,
  UserCircleIcon,
  XMarkIcon,
  ArchiveBoxIcon,
  CalendarDaysIcon,
  UsersIcon,
  DocumentTextIcon,
  WalletIcon,
  Cog6ToothIcon,
  CalendarIcon,
  UserGroupIcon,
  DocumentCheckIcon,
  PuzzlePieceIcon,
  TableCellsIcon,
  CircleStackIcon,
  PresentationChartBarIcon,
  ClockIcon,
  ChevronDownIcon,
  NewspaperIcon,
  ClipboardDocumentListIcon,
  CheckBadgeIcon,
  ChevronUpIcon,
  CalculatorIcon,
  HomeModernIcon,
  TicketIcon,
} from "@heroicons/vue/24/outline";
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth";
const sidebarStore = useSidebarStore();
import { useRouter } from "vue-router";
const router = useRouter();
const { isShowSidebar, isShowSetting, isReservationShow } =
  storeToRefs(sidebarStore);
const authStore = useAuthStore();
const toggleSidebarHandler = () => {
  sidebarStore.toggleSidebar();
};

const toggleSidebarShowSetting = () => {
  sidebarStore.toggleShowSetting();
};

const toggleReservationShow = () => {
  sidebarStore.toggleReservation();
};

import { useToast } from "vue-toastification";
const toast = useToast();

const reservationTypeShow = ref(false);

onMounted(() => {
  // console.log(window.innerWidth);
  if (window.innerWidth < 991) {
    sidebarStore.customSideBar();
  }
  console.log(authStore.isAdmin);
});
</script>

<style scoped>
.sidebar-enter-active,
.sidebar-leave-active {
  transition: width 0.5s ease-in-out;
}

.sidebar-enter-from,
.sidebar-leave-to {
  width: 80px;
}

.sidebar-enter-to,
.sidebar-leave-from {
  width: 260px;
}
</style>
