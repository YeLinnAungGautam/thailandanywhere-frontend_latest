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
import Hotel from "../views/HotelView.vue";
import Room from "../views/RoomView.vue";
import Meal from "../views/MealView.vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";
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

const selectedTab = ref(0);

const changeTab = (index) => {
  selectedTab.value = index;
};

const changeUseRouter = () => {
  if (route.params.id) {
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
    <div class="mb-5">
      <h3 class="text-2xl font-medium text-gray-600">Products</h3>
    </div>
    <div class="w-full">
      <TabGroup :selectedIndex="selectedTab">
        <TabList
          class="flex p-6 mb-5 space-x-2 rounded-lg shadow-sm bg-white/60 overflow-x-scroll"
        >
          <Tab as="template" v-slot="{ selected }" @click="changeTab(0)">
            <button
              :class="{
                'bg-[#ff613c] text-white': selected,
                'bg-white text-gray-600': !selected,
              }"
              class="flex items-center gap-3 tracking-wide text-xs cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md min-w-[150px] text-center"
            >
              Van Tours
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(1)">
            <button
              :class="{
                'bg-[#ff613c] text-white': selected,
                'bg-white text-black': !selected,
              }"
              class="flex items-center gap-3 tracking-wide text-xs cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md min-w-[150px] text-center flex-nowrap"
            >
              Airport Pickup
            </button>
          </Tab>

          <Tab as="template" v-slot="{ selected }" @click="changeTab(2)">
            <button
              :class="{
                'bg-[#ff613c] text-white': selected,
                'bg-white text-black': !selected,
              }"
              class="flex items-center gap-3 tracking-wide text-xs cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md min-w-[150px] text-center"
            >
              Group Tours
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(3)">
            <button
              :class="{
                'bg-[#ff613c] text-white': selected,
                'bg-white text-black': !selected,
              }"
              class="flex items-center gap-3 tracking-wide text-xs cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md"
            >
              Inclusive
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(4)">
            <button
              :class="{
                'bg-[#ff613c] text-white': selected,
                'bg-white text-black': !selected,
              }"
              class="flex items-center gap-3 tracking-wide text-xs cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md"
            >
              Hotels
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(5)">
            <button
              :class="{
                'bg-[#ff613c] text-white': selected,
                'bg-white text-black': !selected,
              }"
              class="flex items-center gap-3 tracking-wide text-xs cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md"
            >
              Rooms
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(6)">
            <button
              :class="{
                'bg-[#ff613c] text-white': selected,
                'bg-white text-black': !selected,
              }"
              class="flex items-center gap-3 tracking-wide text-xs cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md"
            >
              AirLine
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(7)">
            <button
              :class="{
                'bg-[#ff613c] text-white': selected,
                'bg-white text-black': !selected,
              }"
              class="flex items-center gap-3 tracking-wide text-xs cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md min-w-[150px]"
            >
              AirLine Ticket
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(8)">
            <button
              :class="{
                'bg-[#ff613c] text-white': selected,
                'bg-white text-black': !selected,
              }"
              class="flex items-center gap-3 tracking-wide text-xs cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md"
            >
              Attractions
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(9)">
            <button
              :class="{
                'bg-[#ff613c] text-white': selected,
                'bg-white text-black': !selected,
              }"
              class="flex items-center gap-3 tracking-wide text-xs cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md min-w-[240px] text-center"
            >
              Entrance Tickets Variation
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(10)">
            <button
              :class="{
                'bg-[#ff613c] text-white': selected,
                'bg-white text-black': !selected,
              }"
              class="flex items-center gap-3 tracking-wide text-xs cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md"
            >
              Restaurants
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(11)">
            <button
              :class="{
                'bg-[#ff613c] text-white': selected,
                'bg-white text-black': !selected,
              }"
              class="flex items-center gap-3 tracking-wide text-xs cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md"
            >
              Meals
            </button>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <VanTour />
          </TabPanel>
          <TabPanel>
            <Airport />
          </TabPanel>

          <TabPanel>
            <GroupTour />
          </TabPanel>
          <TabPanel>
            <Inclusive />
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
        </TabPanels>
      </TabGroup>
    </div>
  </Layout>
</template>
