<template>
  <div class="grid grid-cols-11 gap-4">
    <div class="space-y-1 col-span-2">
      <div class="flex justify-between items-center gap-x-2">
        <p class="text-sm pb-1">Information</p>
        <div class="relative">
          <p
            class="flex justify-start items-center gap-x-2 mr-2"
            @click="openSelection = !openSelection"
          >
            <ChevronDownIcon class="w-3 h-3" />
            <span
              class="text-xs w-2 h-2 inline-block rounded-lg"
              :class="backgroundCustom"
            ></span>
          </p>
          <div
            v-if="openSelection"
            class="absolute top-8 right-0 bg-white duration-150 shadow rounded-lg divide-y-2 divide-white"
          >
            <p
              class="px-2 py-1 text-[10px] flex justify-start cursor-pointer items-center gap-x-2"
            >
              <span
                class="text-xs bg-gray-600 w-2 h-2 inline-block rounded-lg"
              ></span
              >All
            </p>
            <p
              @click="changeBackground('attraction')"
              class="px-2 py-1 text-[10px] flex justify-start cursor-pointer items-center gap-x-2"
            >
              <span
                class="text-xs bg-blue-600 w-2 h-2 inline-block rounded-lg"
              ></span
              >Attraction
            </p>
            <p
              @click="changeBackground('hotel')"
              class="px-2 py-1 text-[10px] flex justify-start cursor-pointer items-center gap-x-2"
            >
              <span
                class="text-xs bg-green-600 w-2 h-2 inline-block rounded-lg"
              ></span
              >Hotel
            </p>
            <p
              @click="changeBackground('vantour')"
              class="px-2 py-1 text-[10px] flex justify-start cursor-pointer items-center gap-x-2"
            >
              <span
                class="text-xs bg-yellow-600 w-2 h-2 inline-block rounded-lg"
              ></span
              >Vantour
            </p>
          </div>
        </div>
      </div>
      <div class="bg-white shadow rounded-lg">
        <div>
          <InformationVue
            :selectedDay="selectedDay"
            :backgroundCustom="backgroundCustom"
          />
        </div>
      </div>
    </div>

    <div class="col-span-5 space-y-2">
      <p class="text-sm">
        Calendar
        <span class="text-[#ff613c] rounded-lg font-medium">{{
          selectedDay ? `at ${selectedDay}` : ``
        }}</span>
      </p>
      <div class="bg-white shadow p-2 rounded-lg">
        <div class="h-auto font-poppins">
          <CalendarPartVue @change="changesFromCalendar" />
        </div>
      </div>
    </div>
    <div class="col-span-4 space-y-2">
      <p class="text-sm">
        Today Event
        <span class="text-[#ff613c] rounded-lg font-medium">{{
          selectedDay ? `at ${selectedDay}` : ``
        }}</span>
      </p>
      <div
        class="bg-white shadow rounded-lg divide-y-4 divide-gray-200 max-h-[452px] overflow-scroll"
      >
        <div class="" v-for="i in 5" :key="i">
          <ReservationCartVue :backgroundCustom="backgroundCustom" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { format } from "date-fns";
import CalendarPartVue from "./CalendarPart.vue";
import InformationVue from "./Information.vue";
import { ref, onMounted } from "vue";

import ReservationCartVue from "./ReservationCart.vue";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";

const selectedDay = ref(new Date());

const openSelection = ref(false);
const selectedProductType = ref("attraction");

const backgroundCustom = ref("bg-blue-600");
const productType = ref("App\\Models\\EntranceTicket");

const changeBackground = (type) => {
  selectedProductType.value = type;
  switch (type) {
    case "attraction":
      backgroundCustom.value = "bg-blue-600";
      productType.value = "App\\Models\\EntranceTicket";
      openSelection.value = false;
      break;
    case "hotel":
      backgroundCustom.value = "bg-green-600";
      productType.value = "App\\Models\\Hotel";
      openSelection.value = false;
      break;
    case "vantour":
      backgroundCustom.value = "bg-yellow-600";
      productType.value = "App\\Models\\PrivateVanTour";
      openSelection.value = false;
      break;
    default:
      backgroundCustom.value = "bg-blue-600";
  }
};

const changesFromCalendar = (value) => {
  console.log(value);
  selectedDay.value = value;
};

onMounted(() => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  selectedDay.value = formatter.format(new Date());
});
</script>
