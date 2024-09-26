<script setup>
import Layout from "./Layout.vue";
import Productcategory from "../views/ProductCategory.vue";
import CityView from "../views/CityView.vue";
import CarView from "../views/CarView.vue";
import ProductTag from "../views/ProductTag.vue";
import SupplierView from "../views/SupplierView.vue";
import ProductSubCategory from "../views/ProductSubCategory.vue";
import DestinationView from "../views/DestinationView.vue";
import DriverView from "../views/DriverView.vue";
import { ref, onMounted } from "vue";
import Button from "../components/Button.vue";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import Pagination from "../components/Pagination.vue";
import { useSidebarStore } from "../stores/sidebar";
import { useRouter, useRoute } from "vue-router";
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
import PlaceView from "./PlaceView.vue";

const sidebarStore = useSidebarStore();
const router = useRouter();
const route = useRoute();
const selectedTab = ref(0);

const changeTab = (index) => {
  selectedTab.value = index;
  router.push({
    name: "database",
    params: {
      page: index,
    },
  });
};

const changeUseRouter = () => {
  if (route.params.page) {
    changeTab(route.params.page);
  } else if (route.params.page == "page") {
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
      <h3 class="text-2xl font-medium text-gray-600">Database</h3>
    </div>
    <div :class="sidebarStore.isShowSidebar ? 'w-[80vw]' : 'w-[96vw]'">
      <TabGroup :selectedIndex="selectedTab">
        <TabList
          class="space-x-2 bg-white/60 p-6 rounded-lg shadow-sm mb-5 flex"
        >
          <Tab as="template" v-slot="{ selected }" @click="changeTab(0)">
            <button
              :class="{
                'bg-[#ff613c] text-white': selected,
                'bg-white text-gray-600': !selected,
              }"
              class="flex items-center gap-3 tracking-wide text-sm cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md"
            >
              Product Category
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(1)">
            <button
              :class="{
                'bg-[#ff613c] text-white': selected,
                'bg-white text-gray-600': !selected,
              }"
              class="flex items-center gap-3 tracking-wide text-sm text-gray-600 cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none shadow rounded-md"
            >
              Hotel Category
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(2)">
            <button
              :class="{
                'bg-[#ff613c] text-white': selected,
                'bg-white text-black': !selected,
              }"
              class="flex items-center gap-3 tracking-wide text-sm cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md"
            >
              Product Tag
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(3)">
            <button
              :class="{
                'bg-[#ff613c] text-white': selected,
                'bg-white text-black': !selected,
              }"
              class="flex items-center gap-3 tracking-wide text-sm cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md"
            >
              Destination
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(4)">
            <button
              :class="{
                'bg-[#ff613c] text-white': selected,
                'bg-white text-black': !selected,
              }"
              class="flex items-center gap-3 tracking-wide text-sm cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md"
            >
              City
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(5)">
            <button
              :class="{
                'bg-[#ff613c] text-white': selected,
                'bg-white text-black': !selected,
              }"
              class="flex items-center gap-3 tracking-wide text-sm cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md"
            >
              Place
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(6)">
            <button
              :class="{
                'bg-[#ff613c] text-white': selected,
                'bg-white text-black': !selected,
              }"
              class="flex items-center gap-3 tracking-wide text-sm cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md"
            >
              Car
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(7)">
            <button
              :class="{
                'bg-[#ff613c] text-white': selected,
                'bg-white text-black': !selected,
              }"
              class="flex items-center gap-3 tracking-wide text-sm cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md"
            >
              Driver
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }" @click="changeTab(8)">
            <button
              :class="{
                'bg-[#ff613c] text-white': selected,
                'bg-white text-black': !selected,
              }"
              class="flex items-center gap-3 tracking-wide text-sm cursor-pointer py-3 px-5 bg-[#ff613c] focus:outline-none text-gray-600 shadow rounded-md"
            >
              Supplier
            </button>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Productcategory />
          </TabPanel>
          <TabPanel>
            <ProductSubCategory />
          </TabPanel>
          <TabPanel>
            <ProductTag />
          </TabPanel>
          <TabPanel>
            <DestinationView />
          </TabPanel>
          <TabPanel>
            <CityView />
          </TabPanel>
          <TabPanel>
            <PlaceView />
          </TabPanel>
          <TabPanel>
            <CarView />
          </TabPanel>
          <TabPanel>
            <DriverView />
          </TabPanel>
          <TabPanel>
            <SupplierView />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  </Layout>
</template>
