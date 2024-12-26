<script setup>
import {
  TruckIcon,
  HomeModernIcon,
  TicketIcon,
  PaperAirplaneIcon,
  ChevronDownIcon,
} from "@heroicons/vue/24/outline";
import VantourTable from "../../components/homeReservation/VantourTable.vue";
import { useCarBookingStore } from "../../stores/carbooking";
import { useHomeStore } from "../../stores/home";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch, defineProps } from "vue";
import { useAuthStore } from "../../stores/auth";
import Pagination from "../../components/PaginationExpense.vue";

const props = defineProps({
  saleDate: String,
});

const carBookingStore = useCarBookingStore();
const homeStore = useHomeStore();

const authStore = useAuthStore();
const { carbookings, loading } = storeToRefs(carBookingStore);
const { user } = storeToRefs(authStore);

const formatDate = (datePut) => {
  const date = new Date(datePut);

  // Get the year, month, and day
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month starts from 0
  const day = String(date.getDate()).padStart(2, "0");

  // Form the formatted date string
  let formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

const dateFilterRange = ref("");
const changeDate = ref("");
const agent_id = ref("");

const partOfReservation = ref("");
const partOfAssign = ref("");

const openUnassigned = () => {
  if (partOfReservation.value != "unassigned") {
    partOfReservation.value = "unassigned";
    partOfAssign.value = "";
    getWithDate(dateFilterRange.value);
  } else {
    partOfReservation.value = "";
    partOfAssign.value = "";
    getWithDate(dateFilterRange.value);
  }
};

const openElse = () => {
  if (partOfAssign.value != "open") {
    partOfAssign.value = "open";
    partOfReservation.value = "";
    getWithDate(dateFilterRange.value);
  } else {
    partOfAssign.value = "";
    partOfReservation.value = "";
    getWithDate(dateFilterRange.value);
  }
};

const getWithDate = async (date) => {
  console.log(date, "this is date data for function");
  let first;
  let second;
  if (Array.isArray(date) && date.length >= 2) {
    first = dateFormat(date[0]);
    second = dateFormat(date[1]);
  } else if (typeof date == "string" && date.includes(",")) {
    first = date.split(",")[0];
    second = date.split(",")[1];
  }
  // console.log(dateFormat(first), "this is date", dateFormat(second));
  let data = {
    first: first,
    second: second,
  };
  if (user.value.role == "reservation" || user.value.role == "super_admin") {
    data.agent_id = agent_id.value;
  } else {
    data.agent_id = user.value.id;
  }
  if (partOfReservation.value != "") {
    data.supplier_id = partOfReservation.value;
  }
  console.log(data, "this is data from car booking");
  const res = await carBookingStore.getListAction(data);
  console.log(carbookings.value?.data, "this is data from car booking");
  await getPersent();
};

watch(dateFilterRange, (newValue) => {
  if (dateFilterRange.value != null) {
    getWithDate(dateFilterRange.value);
  }
});

const changePage = async (url) => {
  let first = dateFilterRange.value.split(",")[0];
  let second = dateFilterRange.value.split(",")[1];
  let data = {
    first,
    second,
    supplier_id: "",
  };
  if (user.value.role == "reservation" || user.value.role == "super_admin") {
    data.agent_id = "";
  } else {
    data.agent_id = user.value.id;
  }
  await carBookingStore.getChangePage(url, data);
  console.log(data, "thsi is params");
};

const changeFunction = (data) => {
  if (data == "updated") {
    getWithDate(dateFilterRange.value);
  }
};

const part = ref("vantour");
const dateRange = ref("");
const searchId = ref("");

const carbookingPersent = ref("");

const getPersent = async () => {
  const data = {
    daterange: dateFilterRange.value,
  };
  const res = await homeStore.getPersent(data);
  console.log(res, "this is home result");
  carbookingPersent.value = res.data?.data?.complete_percentage;
};

watch(
  () => props.saleDate,
  (newValue, oldValue) => {
    if (newValue) {
      dateFilterRange.value = newValue;
      console.log(`saleDate changed from ${oldValue} to ${newValue}`);
    }
  },
  { immediate: true } // Execute the watcher immediately on component mount
);

onMounted(async () => {
  // if (props.saleDate) {
  //   dateFilterRange.value = props.saleDate;
  // }
  console.log(user.value, "this is user ");
});
</script>

<template>
  <div>
    <!-- table for reservation -->
    <div class="space-y-1" v-if="part == 'vantour'">
      <!-- part of unasign -->
      <div
        :class="
          partOfReservation != '' ? 'bg-[#FF5B00] text-white' : 'bg-white'
        "
        class="rounded-lg px-4 py-5 flex justify-between items-center gap-2 cursor-pointer"
      >
        <div
          class="flex justify-start items-center gap-2 cursor-pointer"
          @click="openUnassigned"
        >
          <TruckIcon class="w-5 h-5" />
          <p class="text-sm">unassigned</p>
          <ChevronDownIcon class="w-5 h-5" />
        </div>
        <Pagination
          v-if="!loading & (partOfReservation != '')"
          :data="carbookings"
          @change-page="changePage"
        />
      </div>
      <div
        class="w-full bg-gray-50 flex rounded-md pl-2 items-center"
        v-if="partOfReservation != ''"
      >
        <p class="w-[10%] text-[10px] font-semibold py-2 px-2">Resev ID</p>
        <p class="w-[10%] text-[10px] font-semibold py-2 px-2">Serv Date</p>
        <p class="w-[10%] text-[10px] font-semibold py-2 px-2">Customer</p>
        <p class="w-[20%] text-[10px] font-semibold py-2 px-2">Product Name</p>
        <p class="w-[10%] text-[10px] font-semibold py-2 px-2">Car Type</p>
        <p class="w-[15%] text-[10px] font-semibold py-2 px-2">Dri_Collect?</p>
        <p class="w-[10%] text-[10px] font-semibold py-2 px-2">Assign</p>

        <p class="w-[10%] text-[10px] font-semibold py-2 px-2">Total Collect</p>
        <p class="w-[10%] text-[10px] font-semibold py-2 px-2">complete?</p>
        <p class="w-[12%] text-[10px] font-semibold py-2 px-2"></p>
      </div>
      <div class="space-y-1" v-if="partOfReservation != ''">
        <div v-for="(l, index) in carbookings?.data" :key="index">
          <VantourTable
            :data="l"
            :loading="loading"
            :pag="carbookings"
            @change="changeFunction"
          />
        </div>
      </div>
      <div
        :class="partOfAssign != '' ? 'bg-[#FF5B00] text-white' : 'bg-white'"
        class="rounded-lg px-4 py-5 flex justify-between items-center gap-2"
      >
        <div
          class="flex justify-start items-center gap-2 cursor-pointer"
          @click="openElse"
        >
          <TruckIcon class="w-5 h-5" />
          <p class="text-sm">assigned & everying else</p>
          <ChevronDownIcon class="w-5 h-5" />
        </div>

        <Pagination
          v-if="!loading & (partOfAssign != '')"
          :data="carbookings"
          @change-page="changePage"
        />
      </div>
      <div class="space-y-1" v-if="partOfAssign != ''">
        <div class="w-full bg-gray-50 flex rounded-md pl-2 items-center">
          <p class="w-[10%] text-[10px] font-semibold py-2 px-2">Resev ID</p>
          <p class="w-[10%] text-[10px] font-semibold py-2 px-2">Serv Date</p>
          <p class="w-[10%] text-[10px] font-semibold py-2 px-2">Customer</p>
          <p class="w-[20%] text-[10px] font-semibold py-2 px-2">
            Product Name
          </p>
          <p class="w-[10%] text-[10px] font-semibold py-2 px-2">Car Type</p>
          <p class="w-[15%] text-[10px] font-semibold py-2 px-2">
            Dri_Collect?
          </p>
          <p class="w-[10%] text-[10px] font-semibold py-2 px-2">Assign</p>

          <p class="w-[10%] text-[10px] font-semibold py-2 px-2">
            Total Collect
          </p>
          <p class="w-[10%] text-[10px] font-semibold py-2 px-2">complete?</p>
          <p class="w-[12%] text-[10px] font-semibold py-2 px-2"></p>
        </div>
        <div v-for="(l, index) in carbookings?.data" :key="index">
          <VantourTable
            :data="l"
            :loading="loading"
            :pag="carbookings"
            @change="changeFunction"
          />
        </div>
      </div>
    </div>
    <div v-if="part == 'hotel'">
      <HotelPartReservation :date="dateFilterRange" :searchId="searchId" />
    </div>
    <div v-if="part == 'attraction'">
      <AttractionPartHome :date="dateFilterRange" :searchId="searchId" />
    </div>
  </div>
</template>
