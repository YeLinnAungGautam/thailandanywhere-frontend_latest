<template>
  <div class="h-[80px] flex items-center justify-between px-[20px] w-full">
    <div class="flex items-center gap-3">
      <button
        class="bg-white/60 p-2 rounded-md shadow cursor-pointer"
        @click.prevent="toggleSidebarHandler"
      >
        <Bars3Icon class="w-6 h-6" />
      </button>
      <p class="text-sm font-poppins text-blue-500 font-medium">
        Welcome back, Sai!
      </p>
    </div>
    <div class="">
      <div class="flex items-center justify-start space-x-6 cursor-pointer">
        <div class="hidden md:flex items-center justify-start space-x-6">
          <MagnifyingGlassIcon class="w-6 h-6" />
          <BellIcon class="w-6 h-6" />
        </div>
        <div class="flex items-center justify-start space-x-3 cursor-pointer">
          <img
            class="w-9 h-9 md:w-10 md:h-10 rounded-full shadow-lg"
            src="https://ui-avatars.com/api/?background=3B81F6&color=fff&name=Sai%20Main&font-size=0.33"
            alt=""
          />
          <div class="hidden md:block text-base">Sai Main</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  MagnifyingGlassIcon,
  BellIcon,
  Bars3Icon,
} from "@heroicons/vue/24/outline";
import { useSidebarStore } from "../stores/sidebar";

const sidebarStore = useSidebarStore();
const toggleSidebarHandler = () => {
  sidebarStore.toggleSidebar();
};
</script>

<style lang="scss" scoped></style>
