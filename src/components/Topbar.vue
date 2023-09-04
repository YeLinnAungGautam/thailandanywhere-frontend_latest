<template>
  <div class="h-[80px] flex items-center justify-between px-[20px] w-full">
    <div class="flex items-center gap-3">
      <button
        class="bg-white/60 p-2 rounded-md shadow cursor-pointer"
        @click.prevent="toggleSidebarHandler"
      >
        <Bars3Icon class="w-6 h-6" />
      </button>
      <p
        class="bg-white/60 p-2 rounded-md shadow cursor-pointer"
        @click="goBack()"
      >
        <ArrowUturnLeftIcon class="w-6 h-6" />
      </p>
      <p class="text-sm font-poppins text-blue-500 font-medium">
        Welcome back, {{ authStore.user.name.split(" ")[0] }} !
      </p>
    </div>
    <div class="">
      <div class="flex items-center justify-start space-x-6 cursor-pointer">
        <!-- drop down  -->
        <div class="relative">
          <button
            @click="toggleTopbarHandler"
            type="button"
            class="flex text-sm bg-gray-800 rounded-full focus:ring-0 hover:shadow focus:ring-gray-300 dark:focus:ring-gray-600"
          >
            <img
              class="w-9 h-9 md:w-10 md:h-10 rounded-full shadow-lg"
              :src="`https://ui-avatars.com/api/?background=3B81F6&color=fff&name=${authStore.user.name}&font-size=0.33`"
              alt=""
            />
          </button>
          <div
            v-if="isTopBarDropdownShow"
            class="z-50 my-4 w-[200px] text-base list-none divide-y divide-gray-100 rounded-md shadow absolute top-7 right-[0px] overflow-hidden"
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
                  <i class="fa-solid fa-gear mr-2"></i>Setting
                </p>
              </li>
              <li>
                <p
                  @click.prevent="logoutHandler"
                  class="block px-4 py-2 text-sm text-gray-500 bg-white hover:text-red-400 hover:scale-105"
                >
                  <i class="fa-solid fa-arrow-right-from-bracket mr-1"></i>
                  Logout
                </p>
              </li>
            </ul>
          </div>
        </div>
        <!-- <div class="flex items-center justify-start space-x-3 cursor-pointer">
          <img
            class="w-9 h-9 md:w-10 md:h-10 rounded-full shadow-lg"
            :src="`https://ui-avatars.com/api/?background=3B81F6&color=fff&name=${authStore.user.name}&font-size=0.33`"
            alt=""
          />
          <div class="hidden md:block text-base">{{ authStore.user.name }}</div>
        </div> -->
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
} from "@heroicons/vue/24/outline";
import { useSidebarStore } from "../stores/sidebar";
import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";
const sidebarStore = useSidebarStore();
const authStore = useAuthStore();
import { useRouter } from "vue-router";
const router = useRouter();
const { isTopBarDropdownShow } = storeToRefs(sidebarStore);
const props = defineProps({});
const toggleSidebarHandler = () => {
  sidebarStore.toggleSidebar();
};
const toggleTopbarHandler = () => {
  sidebarStore.toggleTopBarDropdown();
};
const logoutHandler = async () => {
  try {
    const response = await authStore.logout();
    router.push("/login");
    toast.success(response.message);
  } catch (error) {
    console.log(error);
  }
};

const goBack = () => {
  router.go(-1);
};
</script>

<style lang="scss" scoped></style>
