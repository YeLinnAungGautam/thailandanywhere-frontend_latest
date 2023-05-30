<template>
  <div class="w-[300px] h-full bg-blue-500/5 text-white relative shadow-sm">
    <div class="h-[80px] flex items-center">
      <div class="px-[20px] flex justify-center items-center">
        <h3 class="font-medium text-sm md:text-sm lg:text-base">
          <img src="../../public/logo.jpg" class="w-10 h-10 rounded" alt="" />
        </h3>
        <p class="font-medium tracking-wide ml-2 text-md text-gray-600">
          Thailand Anywhere
        </p>
      </div>
    </div>
    <div
      class="h-[calc(100vh-80px)] bg-opacity-0 py-[20px] px-[20px] z-2 relative"
    >
      <div class="flex flex-col justify-between h-full space-y-[10px]">
        <div class="flex flex-col justify-between space-y-3 mt-5">
          <SidebarItem name="Dashboard" :icon="Squares2X2Icon" to="/" />
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
import {
  Squares2X2Icon,
  ArchiveBoxIcon,
  CalendarDaysIcon,
  UsersIcon,
  WalletIcon,
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon,
  CalendarIcon,
  UserGroupIcon,
  DocumentCheckIcon,
  CircleStackIcon,
} from "@heroicons/vue/24/outline";
</script>

<style lang="scss" scoped></style>
