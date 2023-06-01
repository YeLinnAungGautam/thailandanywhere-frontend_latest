<template>
  <div
    class="w-[300px] bg-white md:bg-white/50  text-white absolute md:relative shadow-sm transition duration-200"
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
          class="flex flex-col justify-between space-y-3 mt-5 px-[14px] overflow-y-auto no-scrollbar"
        >
          <SidebarItem name="Dashboard" :icon="Squares2X2Icon" to="/" />
          <!-- <SidebarItem
            name="Components"
            :icon="PuzzlePieceIcon"
            to="/components"
          /> -->
          <!-- <SidebarItem name="Tables" :icon="TableCellsIcon" to="/tables" /> -->
          <SidebarItem name="Products" :icon="ArchiveBoxIcon" to="/products" />
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
          <SidebarItem name="Database" :icon="CircleStackIcon" to="/database" />
          <SidebarItem
            name="Partnership"
            :icon="UserGroupIcon"
            to="/partnership"
          />
          <SidebarItem name="Setting" :icon="Cog6ToothIcon" to="/setting" />
          <SidebarItem
            name="Logout"
            :icon="ArrowLeftOnRectangleIcon"
            to="/setting"
          />
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
} from "@heroicons/vue/24/outline";
import { onMounted } from "vue";
import { storeToRefs } from "pinia";

const sidebarStore = useSidebarStore();
const { isShowSidebar } = storeToRefs(sidebarStore);

const toggleSidebarHandler = () => {
  sidebarStore.toggleSidebar();
};

onMounted(() => {
  // console.log(window.innerWidth);
  if (window.innerWidth < 991) {
    sidebarStore.customSideBar();
  }
});
</script>

<style lang="scss" scoped></style>
