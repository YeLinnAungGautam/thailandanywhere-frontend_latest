<script setup>
import Layout from "./Layout.vue";
import {
  XCircleIcon,
  ArrowDownTrayIcon,
  UserIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/outline";
import { PlusIcon, ListBulletIcon } from "@heroicons/vue/24/outline";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import OverView from "./BookingComponent/Vantour.vue";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { Switch } from "@headlessui/vue";
import Modal from "../components/Modal.vue";
import { useToast } from "vue-toastification";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import Vantour from "./BookingComponent/Vantour.vue";
import ItemList from "./BookingComponent/ItemList.vue";
import VantourImage from "../../public/van-svgrepo-com.svg";
import HotelImage from "../../public/holiday-hotel-tourism-svgrepo-com.svg";
import AttractionImage from "../../public/favorite-place-svgrepo-com.svg";
import AirlineImage from "../../public/airline-boarding-pass-flight-svgrepo-com.svg";
import RestaurantImage from "../../public/restaurant-svgrepo-com.svg";

// for tag
const currentTag = ref("Van Tours");
const currentSubTag = ref("items");

const productArray = [
  {
    id: 1,
    name: "Van Tours",
    image: VantourImage,
  },
  {
    id: 2,
    name: "Attractions",
    image: AttractionImage,
  },
  {
    id: 3,
    name: "Hotels",
    image: HotelImage,
  },
  {
    id: 4,
    name: "Airline Tickets",
    image: AirlineImage,
  },
  {
    id: 5,
    name: "Restaurants",
    image: RestaurantImage,
  },
];

// Map tags to corresponding components
const componentsMap = {
  "Van Tours": Vantour,
  Attractions: Vantour,
  Hotels: Vantour,
  Restaurants: Vantour,
};

// Compute the current component based on the tag
const currentComponent = computed(
  () => componentsMap[currentTag.value] || Vantour
);
</script>

<template>
  <Layout>
    <div class="grid grid-cols-6 gap-4">
      <div class="col-span-4">
        <div class="space-y-4">
          <!-- sale info part -->
          <div
            class="flex justify-start items-center gap-x-2 overflow-x-scroll pb-2 border-r border-gray-300"
          >
            <div
              v-for="l in productArray"
              :key="l"
              @click="currentTag = l.name"
              class="p-2 shadow-sm rounded-md flex justify-start items-center gap-x-2 cursor-pointer hover:bg-[#ff613c]/20"
              :class="
                currentTag == l.name
                  ? 'bg-[#ff613c] text-white font-semibold'
                  : 'bg-white'
              "
            >
              <img
                :src="l.image"
                class="w-12 h-12 p-2 rounded-lg"
                :class="
                  currentTag == l.name
                    ? 'bg-white'
                    : 'bg-[#FF5B00]/30 text-[#FF5B00]'
                "
                alt=""
              />
              <div class="w-[130px] space-y-1">
                <p class="whitespace-nowrap text-[10px] font-medium">
                  {{ l.name }}
                </p>
                <p
                  :class="currentTag == l.name ? 'test-white' : 'text-gray-500'"
                  class="text-[8px] font-normal whitespace-nowrap"
                >
                  +100 Products
                </p>
              </div>
            </div>
          </div>

          <!-- tag part -->

          <transition name="slide" mode="out-in">
            <component :is="currentComponent" :key="currentTag" />
          </transition>
        </div>
      </div>
      <div class="col-span-2 space-y-4">
        <!-- create -->
        <div class="text-end">
          <button
            class="text-center bg-[#ff613c] py-1.5 px-2 text-sm text-white rounded-lg"
          >
            + create
          </button>
        </div>
        <!-- tags -->
        <div
          class="bg-white flex justify-start items-center gap-x-2 rounded-xl p-1"
        >
          <p
            class="rounded-lg px-5 py-1.5 text-[10px] cursor-pointer hover:bg-[#ff613c]/20"
            @click="currentSubTag = 'items'"
            :class="currentSubTag == 'items' ? 'bg-[#ff613c] text-white' : ' '"
          >
            Items
          </p>
          <p
            class="rounded-lg px-5 py-1.5 text-[10px] cursor-pointer hover:bg-[#ff613c]/20"
            @click="currentSubTag = 'info'"
            :class="currentSubTag == 'info' ? 'bg-[#ff613c] text-white' : ' '"
          >
            Customer Informations
          </p>
          <p
            class="rounded-lg px-5 py-1.5 text-[10px] cursor-pointer hover:bg-[#ff613c]/20"
            @click="currentSubTag = 'payment'"
            :class="
              currentSubTag == 'payment' ? 'bg-[#ff613c] text-white' : ' '
            "
          >
            Payment detail
          </p>
        </div>
        <!-- tags result -->
        <div class="h-[35vh] bg-white rounded-lg overflow-y-scroll px-3">
          <ItemList />
        </div>
        <!-- suummary -->
        <div class="p-3 bg-white rounded-lg">
          <p class="text-xs font-medium text-[#ff613c] pb-2">Payment Summary</p>
          <div class="flex justify-between items-center">
            <p class="text-xs font-medium">Sub Total :</p>
            <input
              type="text"
              disabled
              id="title"
              class="w-[140px] h-8 px-4 py-1.5 mt-1 text-gray-900 bg-gray-300 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-300 text-xs"
            />
          </div>
          <div class="flex justify-between items-center">
            <p class="text-xs font-medium">Discount :</p>
            <input
              type="text"
              id="title"
              class="w-[140px] h-8 px-4 py-1.5 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-300 text-xs"
            />
          </div>
          <div class="flex justify-between items-center">
            <p class="text-xs font-medium">Total :</p>
            <input
              type="text"
              id="title"
              class="w-[140px] h-8 px-4 py-1.5 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-300 text-xs"
            />
          </div>
          <div class="flex justify-between items-center">
            <p class="text-xs font-medium">Deposit :</p>
            <input
              type="text"
              id="title"
              class="w-[140px] h-8 px-4 py-1.5 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-300 text-xs"
            />
          </div>
          <div class="flex justify-between items-center">
            <p class="text-xs font-medium">Balance Due :</p>
            <input
              type="text"
              id="title"
              class="w-[140px] h-8 px-4 py-1.5 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-300 text-xs"
            />
          </div>
          <div class="flex justify-between items-start">
            <p class="text-xs font-medium pt-2">Reciept Image :</p>
            <div
              class="cursor-pointer mt-2 w-[140px] h-[80px] border-2 border-dashed border-gray-300 rounded flex justify-center items-center"
            >
              <span class="text-xs"
                ><i
                  class="px-2 py-1 text-sm font-semibold text-white bg-[#ff613c] rounded-full shadow fa-solid fa-plus"
                ></i
              ></span>
            </div>
          </div>
        </div>
        <!-- receipt image -->
        <div class="h-[20vh] rounded-lg text-sm text-[#ff613c]">Images</div>
      </div>
    </div>
  </Layout>
</template>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease-in-out;
}

.slide-enter {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}
</style>
