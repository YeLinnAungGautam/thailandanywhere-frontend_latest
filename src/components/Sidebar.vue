<template>
  <div
    class="w-[260px] bg-gray-100 text-white absolute md:relative transition duration-500 delay-100"
    v-show="isShowSidebar"
  >
    <div class="h-[80px] w-full flex items-center">
      <div class="flex w-full items-center justify-between px-[20px]">
        <div class="flex items-center">
          <h3 class="text-sm font-medium md:text-sm lg:text-base">
            <img
              src="../../public/web-logo.png"
              class="w-10 h-10 rounded"
              alt=""
            />
          </h3>
          <p class="ml-2 font-medium tracking-wide text-sm text-[#FF5B00]">
            thanywhere
          </p>
        </div>
        <button
          class="block p-3 text-white bg-blue-500 rounded-md shadow md:hidden"
          @click.prevent="toggleSidebarHandler"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
    <div class="h-[calc(100vh-80px)] bg-opacity-0 py-[20px] z-50 relative">
      <div class="flex flex-col justify-between h-full space-y-[10px]">
        <div
          class="flex flex-col justify-between space-y-3 mt-5 px-[14px] h-full overflow-y-auto no-scrollbar"
        >
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
              to="/user_dashboard"
              v-show="!authStore.isSuperAdmin"
            />
            <SidebarItem
              name="Sales"
              v-if="
                authStore.isSuperAdmin ||
                authStore.isCashier ||
                authStore.isAdmin ||
                authStore.isAgent
              "
              :icon="CalendarIcon"
              to="/bookings/%25/%25/%25"
              :activePaths="[
                'bookings',
                'bookings_create',
                'edit_bookings',
                'update_bookings',
              ]"
            />
            <SidebarItem
              name="Reservation"
              :icon="DocumentCheckIcon"
              to="/reservation/%25/%25/%25"
              :activePaths="['reservation', 'reservation-update']"
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
              ]"
              to="/products/page"
            />
            <SidebarItem
              v-if="!authStore.isAgent"
              name="Database"
              :icon="CircleStackIcon"
              to="/database"
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
              v-if="!authStore.isAgent"
              :icon="UsersIcon"
              to="/customers"
              :activePaths="['customers', 'customerscreate', 'customersupdate']"
            />
            <SidebarItem
              v-if="authStore.isSuperAdmin"
              name="Admins"
              :icon="UserCircleIcon"
              to="/admins"
              :activePaths="['admins']"
            />

            <!-- <SidebarItem
              name="Setting"
              :icon="Cog6ToothIcon"
              @click="settingHandle"
            /> -->
            <div
              class="inline-flex text-[.75rem] rounded-md relative items-center py-[12px] px-[10px] w-full text-sm font-roboto text-gray-600 bg-gray-100 mb-1 hover:text-[#FF5B00] hover:bg-[rgb(255, 91, 0, 0.1)] transition duration-150 hover:bg-[#FF5B00]/10"
              @click="toggleSidebarShowSetting"
            >
              <component
                :is="Cog6ToothIcon"
                class="w-4 h-4 mr-[1.2rem]"
              ></component>
              Setting
              <component
                v-if="!isShowSetting"
                :is="ChevronDownIcon"
                class="w-4 h-4 ml-[4.2rem]"
              ></component>
              <component
                v-if="isShowSetting"
                :is="ChevronUpIcon"
                class="w-4 h-4 ml-[4.2rem]"
              ></component>
            </div>

            <div class="transition-all duration-150" v-if="isShowSetting">
              <SidebarItem
                name="Partners"
                v-if="!authStore.isAgent"
                :icon="UserGroupIcon"
                to="/partners"
              />
              <SidebarItem
                name="Expenses"
                v-if="!authStore.isAgent"
                :icon="WalletIcon"
                to="/expenses"
              />
              <SidebarItem
                name="Calendar"
                :icon="CalendarDaysIcon"
                to="/calendar"
              />
            </div>
            <SidebarItem
              v-if="!authStore.isAgent"
              name="Car Bookings"
              :icon="DocumentTextIcon"
              to="/car-bookings/unassigned"
              :activePaths="['car-bookings']"
            />
          </div>

          <!-- <div>
            <SidebarItem name="Setting" :icon="Cog6ToothIcon" to="/setting" />
            <button
              @click.prevent="logoutHandler"
              class="inline-flex rounded-md relative items-center py-[12px] px-[10px] w-full text-sm text-gray-600 tracking-wider hover:shadow-md transition duration-150"
            >
              <ArrowLeftOnRectangleIcon class="w-6 h-6 mr-2" />
              Logout
            </button>
          </div> -->
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
  ArrowLeftOnRectangleIcon,
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
  ChevronUpIcon,
} from "@heroicons/vue/24/outline";
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth";
const sidebarStore = useSidebarStore();
import { useRouter } from "vue-router";
const router = useRouter();
const { isShowSidebar, isShowSetting } = storeToRefs(sidebarStore);
const authStore = useAuthStore();
const toggleSidebarHandler = () => {
  sidebarStore.toggleSidebar();
};

const toggleSidebarShowSetting = () => {
  sidebarStore.toggleShowSetting();
};

import { useToast } from "vue-toastification";
const toast = useToast();

onMounted(() => {
  // console.log(window.innerWidth);
  if (window.innerWidth < 991) {
    sidebarStore.customSideBar();
  }
  console.log(authStore.isAdmin);
});
</script>

<style lang="scss" scoped></style>
