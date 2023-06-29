<template>
  <div
    class="w-[300px] bg-white md:bg-white/50 text-white absolute md:relative shadow-sm transition duration-200"
    v-show="isShowSidebar"
  >
    <div class="h-[80px] w-full flex items-center">
      <div class="flex w-full items-center justify-between px-[20px]">
        <div class="flex items-center">
          <h3 class="font-medium text-sm md:text-sm lg:text-base">
            <img src="../../public/logo.jpg" class="w-10 h-10 rounded" alt="" />
          </h3>
          <p class="font-medium tracking-wide ml-2 text-md text-gray-600">
            Thailand Anywhere
          </p>
        </div>
        <button
          class="bg-blue-500 block md:hidden rounded-md shadow text-white p-3"
          @click.prevent="toggleSidebarHandler"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
    <div class="h-[calc(100vh-80px)] bg-opacity-0 py-[20px] z-2 relative">
      <div class="flex flex-col justify-between h-full space-y-[10px]">
        <div
          class="flex flex-col justify-between space-y-3 mt-5 px-[14px] h-full overflow-y-auto no-scrollbar"
        >
          <div>
            <SidebarItem name="Dashboard" :icon="Squares2X2Icon" to="/" />
            <SidebarItem
              name="Products"
              :icon="ArchiveBoxIcon"
              to="/products"
            />
            <SidebarItem
              name="Sales"
              :icon="PresentationChartBarIcon"
              to="/sales"
            />
            <SidebarItem name="Partners" :icon="UserGroupIcon" to="/partners" />

            <SidebarItem name="Blogs" :icon="DocumentTextIcon" to="/blogs" />
            <SidebarItem name="Bookings" :icon="CalendarIcon" to="/bookings" />
            <SidebarItem name="Customers" :icon="UsersIcon" to="/customers" />
            <SidebarItem name="Expenses" :icon="WalletIcon" to="/expenses" />
            <SidebarItem
              name="Calendar"
              :icon="CalendarDaysIcon"
              to="/calendar"
            />
            <SidebarItem
              name="Reservation"
              :icon="DocumentCheckIcon"
              to="/reservation"
            />
            <SidebarItem
              name="Database"
              :icon="CircleStackIcon"
              to="/database"
            />
          </div>
          <div>
            <SidebarItem name="Setting" :icon="Cog6ToothIcon" to="/setting" />
            <button
              @click.prevent="logoutHandler"
              class="inline-flex rounded-md relative items-center py-[12px] px-[10px] w-full text-sm text-gray-600 tracking-wider hover:shadow-md transition duration-150"
            >
              <ArrowLeftOnRectangleIcon class="w-6 h-6 mr-2" />
              Logout
            </button>
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
} from "@heroicons/vue/24/outline";
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth";
const sidebarStore = useSidebarStore();
import { useRouter } from "vue-router";
const router = useRouter();
const { isShowSidebar } = storeToRefs(sidebarStore);
const authStore = useAuthStore();
const toggleSidebarHandler = () => {
  sidebarStore.toggleSidebar();
};

import { useToast } from "vue-toastification";
const toast = useToast();

const logoutHandler = async () => {
  try {
    const response = await authStore.logout();
    router.push("/login");
    toast.success(response.message);
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  // console.log(window.innerWidth);
  if (window.innerWidth < 991) {
    sidebarStore.customSideBar();
  }
});
</script>

<style lang="scss" scoped></style>
