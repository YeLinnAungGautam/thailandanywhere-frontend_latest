<template>
  <div class="h-[80px] flex items-center justify-between px-[20px] w-full">
    <div class="flex items-center gap-3">
      <button
        class="p-2 rounded-md shadow cursor-pointer bg-white/60"
        @click.prevent="toggleSidebarHandler"
      >
        <Bars3Icon class="w-6 h-6" />
      </button>
      <p
        class="p-2 rounded-md shadow cursor-pointer bg-white/60"
        @click="goBack()"
      >
        <ArrowUturnLeftIcon class="w-6 h-6" />
      </p>
      <p class="text-sm font-poppins text-[#ff613c] font-medium">
        Welcome back, {{ authStore.user.name.split(" ")[0] }} !
      </p>
    </div>
    <div class="">
      <div class="flex items-center justify-start space-x-6 cursor-pointer">
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
        <!-- <div class="flex items-center justify-start space-x-3 cursor-pointer">
          <img
            class="rounded-full shadow-lg w-9 h-9 md:w-10 md:h-10"
            :src="`https://ui-avatars.com/api/?background=3B81F6&color=fff&name=${authStore.user.name}&font-size=0.33`"
            alt=""
          />
          <div class="hidden text-base md:block">{{ authStore.user.name }}</div>
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
  ChevronDownIcon,
} from "@heroicons/vue/24/outline";
import { useSidebarStore } from "../stores/sidebar";
import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";
import { useToast } from "vue-toastification";
const sidebarStore = useSidebarStore();
const authStore = useAuthStore();
import { useRouter } from "vue-router";
const router = useRouter();
const { isTopBarDropdownShow } = storeToRefs(sidebarStore);
const props = defineProps({});

const toast = useToast();

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

const logoutHandlerAllUser = async () => {
  try {
    const response = await authStore.logoutAllUser();
    // router.push("/login");
    console.log(response);

    toast.success(response.message);
    router.push("/login");
  } catch (error) {
    console.log(error);
  }
};

const goBack = () => {
  router.go(-1);
};
</script>

<style lang="scss" scoped></style>
