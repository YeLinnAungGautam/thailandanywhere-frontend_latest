<script setup>
import {
  XCircleIcon,
  ArrowDownTrayIcon,
  UserIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/outline";
import { PlusIcon, ListBulletIcon } from "@heroicons/vue/24/outline";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { computed, onMounted, onUnmounted, ref, watch, defineProps } from "vue";
import Button from "../../components/Button.vue";
import OverView from "../BookingComponent/Vantour.vue";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { Switch } from "@headlessui/vue";
import Modal from "../../components/Modal.vue";
import { useToast } from "vue-toastification";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import Vantour from "./Vantour.vue";
import ItemList from "./ItemList.vue";
import VantourImage from "../../../src/assets/road-trip.png";
import HotelImage from "../../../src/assets/hotel.png";
import AttractionImage from "../../../src/assets/attractions icon.svg";
import AirlineImage from "../../../src/assets/flight icon.svg";
import { useBookingStore } from "../../stores/booking";
import Attraction from "./Attraction.vue";
import Hotel from "./Hotel.vue";
import Airline from "./Airline.vue";
import { useAdminStore } from "../../stores/admin";
// import RestaurantImage from "../../public/restaurant-svgrepo-com.svg";

// for tag
const currentTag = ref("Van Tours");
const addItemModal = ref(false);
const bookingStore = useBookingStore();
const toast = useToast();
const adminStore = useAdminStore();
const router = useRouter();

const props = defineProps({
  formData: Object,
});

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
    name: "Airline",
    image: AirlineImage,
  },
  // {
  //   id: 5,
  //   name: "Restaurants",
  //   image: RestaurantImage,
  // },
];

// Map tags to corresponding components
const componentsMap = {
  "Van Tours": Vantour,
  Attractions: Attraction,
  Hotels: Hotel,
  Restaurants: Vantour,
  Airline: Airline,
};

// Compute the current component based on the tag
const currentComponent = computed(
  () => componentsMap[currentTag.value] || Vantour
);

const sub_total = computed(() => {
  if (props.formData.is_inclusive != 1) {
    let totalsub = 0;
    for (let i = 0; i < props.formData.items.length; i++) {
      totalsub = totalsub + props.formData.items[i].total_amount;
    }
    return totalsub;
  }
});

const removeItemList = (message) => {
  if (
    !message ||
    typeof message.id === "undefined" ||
    typeof message.index === "undefined"
  ) {
    console.error("Invalid 'message' object. Must have both 'id' and 'index'.");
    return;
  }

  const items = props.formData.items;

  // Ensure 'items' is an array
  if (!Array.isArray(items)) {
    console.error("'props.formData.items' is not an array.");
    return;
  }

  // Validate the index and item
  const itemAtIndex = items[message.index];
  if (itemAtIndex && itemAtIndex.product_id === message.id) {
    items.splice(message.index, 1); // Remove the item if the conditions match
  } else {
    console.warn("No matching item found at the provided index.");
  }
};
const formitem = ref({});
const changeGetItem = (data) => {
  console.log(data, "this is data");
  if (props.formData.is_inclusive == 1) {
    formitem.value.is_inclusive = 1;
  } else {
    formitem.value.is_inclusive = "";
  }
  formitem.value = data;
  addNewitem();
  formitem.value = {};
  console.log(props.formData.items, "this is push items");
};
const changeItemList = (data) => {
  console.log(data, "this is change item value");
  if (props.formData.is_inclusive == 1) {
    props.formData.items[data.id].is_inclusive = 1;
  } else {
    props.formData.items[data.id].is_inclusive = "";
  }
  props.formData.items[data.id] = data.data;
};

const addNewitem = () => {
  props.formData.items.push(formitem.value);
};

onMounted(async () => {});
</script>

<template>
  <div class="grid grid-cols-6 gap-4">
    <div class="col-span-4 h-[85vh] overflow-hidden">
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
              class="w-12 h-12 p-2 rounded-xl"
              :class="
                currentTag == l.name
                  ? 'bg-[#ff613c]'
                  : ' bg-gradient-to-r to-[#ff613c] from-[#ff5b00]/50 text-[#FF5B00]'
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
          <component
            :is="currentComponent"
            :key="currentTag"
            :data="formData"
            @formData="changeGetItem"
          />
        </transition>
      </div>
    </div>
    <div class="col-span-2 h-[85vh] relative overflow-y-scroll space-y-4">
      <!-- tags result -->
      <div
        class="min-h-[10vh] max-h-[50vh] bg-white rounded-lg overflow-y-scroll px-3"
      >
        <ItemList :data="formData" @remove="removeItemList" />
      </div>

      <!-- suummary -->
      <div class="p-3 bg-white rounded-lg">
        <p class="text-xs font-medium text-[#ff613c] pb-2">Payment Summary</p>
        <div class="flex justify-between items-center">
          <p class="text-xs font-medium">Sub Total :</p>
          <input
            type="text"
            disabled
            v-model="sub_total"
            id="title"
            class="w-[140px] h-8 px-4 py-1.5 mt-1 text-gray-900 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-300 text-xs"
          />
        </div>
        <div class="flex justify-between items-center">
          <p class="text-xs font-medium">Sell Price :</p>
          <input
            type="text"
            disabled
            v-model="formData.price"
            id="title"
            class="w-[140px] h-8 px-4 py-1.5 mt-1 text-gray-900 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-300 text-xs"
          />
        </div>
        <p class="text-start text-red-500 text-[10px] py-2">
          this is display price
        </p>
        <div class="flex justify-between items-center">
          <p class="text-xs font-medium">Profit :</p>
          <p
            class="w-[140px] h-8 px-4 py-1.5 mt-1 text-gray-900 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-300 text-xs"
          >
            {{ formData.price - sub_total }}
          </p>
        </div>
      </div>
    </div>
  </div>
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
