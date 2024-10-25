<script setup>
import Layout from "./Layout.vue";
import { onMounted, ref } from "vue";
import Button from "../components/Button.vue";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import VanTour from "../views/VanTour.vue";
import GroupTour from "../views/Grouptour.vue";
import Restaurant from "../views/RestaurantsView.vue";
import Airline from "../views/Airline.vue";
import AirlineTicket from "../views/AirlineTicket.vue";
import Airport from "../views/AirportTicket.vue";
import Entrance from "../views/EntranceTicket.vue";
import EntranceVariation from "../views/EntranceTicketVariation.vue";
import Inclusive from "../views/InclusiveView.vue";
import HotelRoomSwitch from "../views/HotelRoomSwitch.vue";
import Hotel from "../views/HotelView.vue";
import Room from "../views/RoomView.vue";
import Meal from "../views/MealView.vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useSidebarStore } from "../stores/sidebar";

import {
  PencilSquareIcon,
  TrashIcon,
  ShareIcon,
  EyeIcon,
  TicketIcon,
  BuildingOfficeIcon,
  PlusIcon,
  UserGroupIcon,
  UsersIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/vue/24/outline";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const sidebarStore = useSidebarStore();

const selectedTab = ref(0);

const changeTab = (index) => {
  selectedTab.value = index;
  router.push({
    name: "products",
    params: {
      id: index,
    },
    query: {
      edit: route.query.edit,
    },
  });
};

const changeUseRouter = () => {
  if (route.params.id) {
    if (route.query.edit) {
      changeTab(route.params.id);
    }
    changeTab(route.params.id);
  } else if (route.params.id == "page") {
    changeTab(0);
  }
};

onMounted(() => {
  changeUseRouter();
});
</script>

<template>
  <Layout>
    <div class="mb-5 w-[90%]">
      <!-- <h3 class="text-2xl font-medium text-gray-600">Products</h3> -->
    </div>
    <div :class="sidebarStore.isShowSidebar ? 'w-[80vw]' : 'w-[90vw]'">
      <TabGroup :selectedIndex="selectedTab">
        <TabList
          class="flex w-full p-6 mb-5 space-x-2 rounded-lg shadow-sm bg-white/60 overflow-x-scroll"
        >
          <Tab as="template" v-slot="{ selected }" @click="changeTab(0)">
            <button
              :class="selected ? 'bg-[#FF5B00]' : 'bg-white'"
              class="flex items-center gap-3 tracking-wide text-xs cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md min-w-[180px] text-center"
            >
              <img
                src="../../public/van-svgrepo-com.svg"
                class="w-12 h-12 p-2 rounded-lg"
                :class="
                  selected ? 'bg-white' : 'bg-[#FF5B00]/30 text-[#FF5B00]'
                "
                alt=""
              />
              <div
                class="text-xs"
                :class="selected ? 'text-white' : 'text-gray-900'"
              >
                <p class="font-semibold">124</p>
                <p class="text-[10px]">Van Tours</p>
              </div>
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(1)">
            <button
              :class="selected ? 'bg-[#FF5B00]' : 'bg-white'"
              class="flex items-center gap-3 tracking-wide text-xs cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md min-w-[180px] text-center"
            >
              <img
                src="../../public/group-svgrepo-com.svg"
                class="w-12 h-12 p-2 rounded-lg"
                :class="
                  selected ? 'bg-white' : 'bg-[#FF5B00]/30 text-[#FF5B00]'
                "
                alt=""
              />
              <div
                class="text-xs"
                :class="selected ? 'text-white' : 'text-gray-900'"
              >
                <p class="font-semibold">124</p>
                <p class="text-[10px]">Group Tours</p>
              </div>
            </button>
          </Tab>

          <Tab as="template" v-slot="{ selected }" @click="changeTab(2)">
            <button
              :class="selected ? 'bg-[#FF5B00]' : 'bg-white'"
              class="flex items-center gap-3 tracking-wide text-xs cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md min-w-[180px] text-center"
            >
              <img
                src="../../public/holiday-hotel-tourism-svgrepo-com.svg"
                class="w-12 h-12 p-2 rounded-lg"
                :class="
                  selected ? 'bg-white' : 'bg-[#FF5B00]/30 text-[#FF5B00]'
                "
                alt=""
              />
              <div
                class="text-xs"
                :class="selected ? 'text-white' : 'text-gray-900'"
              >
                <p class="font-semibold">124</p>
                <p class="text-[10px]">Hotels</p>
              </div>
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(3)">
            <button
              :class="selected ? 'bg-[#FF5B00]' : 'bg-white'"
              class="flex items-center gap-3 tracking-wide text-xs cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md min-w-[180px] text-center"
            >
              <img
                src="../../public/holiday-hotel-tourism-svgrepo-com.svg"
                class="w-12 h-12 p-2 rounded-lg"
                :class="
                  selected ? 'bg-white' : 'bg-[#FF5B00]/30 text-[#FF5B00]'
                "
                alt=""
              />
              <div
                class="text-xs"
                :class="selected ? 'text-white' : 'text-gray-900'"
              >
                <p class="font-semibold">124</p>
                <p class="text-[10px]">Rooms</p>
              </div>
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(4)">
            <button
              :class="selected ? 'bg-[#FF5B00]' : 'bg-white'"
              class="flex items-center gap-3 tracking-wide text-xs cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md min-w-[180px] text-center"
            >
              <img
                src="../../public/airline-boarding-pass-flight-svgrepo-com.svg"
                class="w-12 h-12 p-2 rounded-lg"
                :class="
                  selected ? 'bg-white' : 'bg-[#FF5B00]/30 text-[#FF5B00]'
                "
                alt=""
              />
              <div
                class="text-xs"
                :class="selected ? 'text-white' : 'text-gray-900'"
              >
                <p class="font-semibold">124</p>
                <p class="text-[10px]">AirLines</p>
              </div>
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(5)">
            <button
              :class="selected ? 'bg-[#FF5B00]' : 'bg-white'"
              class="flex items-center gap-3 tracking-wide text-xs cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md min-w-[180px] text-center"
            >
              <img
                src="../../public/airline-boarding-pass-flight-svgrepo-com.svg"
                class="w-12 h-12 p-2 rounded-lg"
                :class="
                  selected ? 'bg-white' : 'bg-[#FF5B00]/30 text-[#FF5B00]'
                "
                alt=""
              />
              <div
                class="text-xs"
                :class="selected ? 'text-white' : 'text-gray-900'"
              >
                <p class="font-semibold">124</p>
                <p class="text-[10px]">AirLine Tickets</p>
              </div>
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(6)">
            <button
              :class="selected ? 'bg-[#FF5B00]' : 'bg-white'"
              class="flex items-center gap-3 tracking-wide text-xs cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md min-w-[180px] text-center"
            >
              <img
                src="../../public/favorite-place-svgrepo-com.svg"
                class="w-12 h-12 p-2 rounded-lg"
                :class="
                  selected ? 'bg-white' : 'bg-[#FF5B00]/30 text-[#FF5B00]'
                "
                alt=""
              />
              <div
                class="text-xs"
                :class="selected ? 'text-white' : 'text-gray-900'"
              >
                <p class="font-semibold">124</p>
                <p class="text-[10px]">Attractions</p>
              </div>
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(7)">
            <button
              :class="selected ? 'bg-[#FF5B00]' : 'bg-white'"
              class="flex items-center gap-3 tracking-wide text-xs cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md min-w-[200px] text-center"
            >
              <img
                src="../../public/favorite-place-svgrepo-com.svg"
                class="w-12 h-12 p-2 rounded-lg"
                :class="
                  selected ? 'bg-white' : 'bg-[#FF5B00]/30 text-[#FF5B00]'
                "
                alt=""
              />
              <div
                class="text-xs"
                :class="selected ? 'text-white' : 'text-gray-900'"
              >
                <p class="font-semibold">124</p>
                <p class="text-[10px]">Entrance Tickets</p>
              </div>
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(8)">
            <button
              :class="selected ? 'bg-[#FF5B00]' : 'bg-white'"
              class="flex items-center gap-3 tracking-wide text-xs cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md min-w-[180px] text-center"
            >
              <img
                src="../../public/restaurant-svgrepo-com.svg"
                class="w-12 h-12 p-2 rounded-lg"
                :class="
                  selected ? 'bg-white' : 'bg-[#FF5B00]/30 text-[#FF5B00]'
                "
                alt=""
              />
              <div
                class="text-xs"
                :class="selected ? 'text-white' : 'text-gray-900'"
              >
                <p class="font-semibold">124</p>
                <p class="text-[10px]">Restaurants</p>
              </div>
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(9)">
            <button
              :class="selected ? 'bg-[#FF5B00]' : 'bg-white'"
              class="flex items-center gap-3 tracking-wide text-xs cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md min-w-[180px] text-center"
            >
              <img
                src="../../public/restaurant-svgrepo-com.svg"
                class="w-12 h-12 p-2 rounded-lg"
                :class="
                  selected ? 'bg-white' : 'bg-[#FF5B00]/30 text-[#FF5B00]'
                "
                alt=""
              />
              <div
                class="text-xs"
                :class="selected ? 'text-white' : 'text-gray-900'"
              >
                <p class="font-semibold">124</p>
                <p class="text-[10px]">Meals</p>
              </div>
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(10)">
            <button
              :class="selected ? 'bg-[#FF5B00]' : 'bg-white'"
              class="flex items-center gap-3 tracking-wide text-xs cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md min-w-[180px] text-center"
            >
              <img
                src="../../public/web-logo.png"
                class="w-12 h-12 p-2 rounded-lg"
                :class="
                  selected ? 'bg-white' : 'bg-[#FF5B00]/30 text-[#FF5B00]'
                "
                alt=""
              />
              <div
                class="text-xs"
                :class="selected ? 'text-white' : 'text-gray-900'"
              >
                <p class="font-semibold">124</p>
                <p class="text-[10px]">Inclusive</p>
              </div>
            </button>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <VanTour />
          </TabPanel>
          <TabPanel>
            <GroupTour />
          </TabPanel>
          <TabPanel>
            <Hotel />
          </TabPanel>
          <TabPanel>
            <Room />
          </TabPanel>
          <TabPanel>
            <Airline />
          </TabPanel>
          <TabPanel>
            <AirlineTicket />
          </TabPanel>
          <TabPanel>
            <Entrance />
          </TabPanel>
          <TabPanel>
            <EntranceVariation />
          </TabPanel>
          <TabPanel>
            <Restaurant />
          </TabPanel>
          <TabPanel>
            <Meal />
          </TabPanel>
          <TabPanel>
            <Inclusive />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  </Layout>
</template>
