<script setup>
import HomePersent from "./HomePersent.vue";
import {
  TruckIcon,
  HomeModernIcon,
  TicketIcon,
  PaperAirplaneIcon,
} from "@heroicons/vue/24/outline";
import VantourTable from "./VantourTable.vue";
import { useCarBookingStore } from "../../stores/carbooking";
import { useHomeStore } from "../../stores/home";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";
import { useAuthStore } from "../../stores/auth";
import Pagination from "../Pagination.vue";
import HotelPartReservation from "./HotelPartReservation.vue";
import AttractionPartHome from "./AttractionPartHome.vue";

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

const changeServiceDate = (data) => {
  console.log(data);
  changeDate.value = data;
  if (data == "today") {
    let startDate = formatDate(new Date());
    let endDate = formatDate(new Date());
    console.log(`${startDate},${endDate}`);
    dateFilterRange.value = `${startDate},${endDate}`;
    dateRange.value = "";
  } else if (data == "tomorrow") {
    let tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    let startDate = formatDate(tomorrowDate);
    let endDate = formatDate(tomorrowDate);
    console.log(`${startDate},${endDate}`);
    dateFilterRange.value = `${startDate},${endDate}`;
    dateRange.value = "";
  } else if (data == "7day") {
    let startDate = formatDate(new Date());
    let endDate = formatDate(
      new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
    );
    console.log(`${startDate},${endDate}`);
    dateFilterRange.value = `${startDate},${endDate}`;
    dateRange.value = "";
  } else if (data == "30day") {
    let startDate = formatDate(new Date());
    let endDate = formatDate(
      new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
    );
    console.log(`${startDate},${endDate}`);
    dateFilterRange.value = `${startDate},${endDate}`;
    dateRange.value = "";
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
    supplier_id: "",
  };
  if (user.value.role == "reservation" || user.value.role == "super_admin") {
    data.agent_id = agent_id.value;
  } else {
    data.agent_id = user.value.id;
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

watch(dateRange, async (newValue) => {
  console.log(dateRange.value, "this is date");
  if (dateRange.value != "" && dateRange.value != null) {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const startDate = dateRange?.value[0]?.toLocaleDateString("en-GB", options);
    const endDate = dateRange?.value[1]?.toLocaleDateString("en-GB", options);

    // Custom function to format date as dd-MM-yyyy
    const formatDateAsDDMMYYYY = (date) => {
      if (date) {
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yyyy = date.getFullYear();
        return `${yyyy}-${mm}-${dd}`;
      }
    };

    // Format start and end dates
    const formattedStartDate = formatDateAsDDMMYYYY(dateRange.value[0]);
    const formattedEndDate = formatDateAsDDMMYYYY(dateRange.value[1]);

    dateFilterRange.value = `${formattedStartDate},${formattedEndDate}`;
    changeServiceDate("");
  } else {
    changeServiceDate("today");
  }
});

const carbookingPersent = ref("");

const getPersent = async () => {
  const data = {
    daterange: dateFilterRange.value,
    role: user.value.role,
    created_by:
      user.value.role != "super_admin" && user.value.role != "reservation"
        ? user.value.id
        : "",
  };
  const res = await homeStore.getPersent(data);
  console.log(res, "this is home result");
  carbookingPersent.value = res.data.data.complete_percentage.toFixed(2);
};

onMounted(async () => {
  changeServiceDate("today");
  console.log(user.value, "this is user ");
});
</script>

<template>
  <div>
    <div
      class="flex items-center justify-between py-5 bg-white/60 rounded-md shadow-sm p-4 mb-2"
    >
      <p class="text-lg font-semibold tracking-wider mr-4">Filter:</p>
      <div class="flex justify-start items-center gap-3">
        <div class="flex w-full text-xs justify-end items-center gap-4">
          <p
            @click="changeServiceDate('today')"
            class="flex gap-2 justify-start items-center cursor-pointer"
            :class="changeDate == 'today' ? ' text-[#FF5B00]' : 'text-black'"
          >
            <span
              class="w-2 h-2 rounded-full bg-[#FF5B00]"
              v-if="changeDate == 'today'"
            ></span
            >Today
          </p>
          <p
            @click="changeServiceDate('tomorrow')"
            class="flex gap-2 justify-start items-center cursor-pointer"
            :class="changeDate == 'tomorrow' ? ' text-[#FF5B00]' : 'text-black'"
          >
            <span
              class="w-2 h-2 rounded-full bg-[#FF5B00]"
              v-if="changeDate == 'tomorrow'"
            ></span
            >Tomorrow
          </p>
          <p
            @click="changeServiceDate('7day')"
            class="flex gap-2 justify-start items-center cursor-pointer whitespace-nowrap"
            :class="changeDate == '7day' ? ' text-[#FF5B00]' : 'text-black'"
          >
            <span
              class="w-2 h-2 rounded-full bg-[#FF5B00]"
              v-if="changeDate == '7day'"
            ></span
            >Next 7 Days
          </p>
          <p
            @click="changeServiceDate('30day')"
            class="flex gap-2 justify-start items-center cursor-pointer whitespace-nowrap"
            :class="changeDate == '30day' ? ' text-[#FF5B00]' : 'text-black'"
          >
            <span
              class="w-2 h-2 rounded-full bg-[#FF5B00]"
              v-if="changeDate == '30day'"
            ></span
            >Next 30 Days
          </p>
        </div>
        <VueDatePicker
          v-model="dateRange"
          range
          :format="'yyyy-MM-dd'"
          placeholder="date range"
        />
        <input
          v-model="searchId"
          v-if="part != 'vantour'"
          type="text"
          class="h-9 text-sm w-3/5 sm:w-3/5 md:w-full border px-4 py-2 rounded-md focus:ring-0 focus:outline-none text-gray-500"
          placeholder="Search CRM ID"
        />
      </div>
    </div>
    <!-- show data -->
    <div class="flex justify-start items-center space-x-4 col-span-3 my-4">
      <HomePersent
        :icon="TruckIcon"
        :title="'Van Tour'"
        :amount="carbookingPersent"
        :isActive="part == 'vantour'"
        @click="part = 'vantour'"
      />
      <HomePersent
        :icon="HomeModernIcon"
        :title="'Hotels'"
        :amount="20"
        :isActive="part == 'hotel'"
        @click="part = 'hotel'"
      />
      <HomePersent
        :icon="TicketIcon"
        :title="'Attractions'"
        :amount="20"
        :isActive="part == 'attraction'"
        @click="part = 'attraction'"
      />
      <HomePersent
        :icon="PaperAirplaneIcon"
        :title="'Air Tickets'"
        :amount="0"
        :isActive="part == 'airticket'"
      />
    </div>

    <!-- table for reservation -->
    <div class="space-y-1" v-if="part == 'vantour'">
      <div class="w-full bg-gray-50 flex rounded-md pl-2 items-center">
        <p class="w-[10%] text-[10px] font-semibold py-2 px-2">Resev ID</p>
        <p class="w-[10%] text-[10px] font-semibold py-2 px-2">Serv Date</p>
        <p class="w-[10%] text-[10px] font-semibold py-2 px-2">Customer</p>
        <p class="w-[20%] text-[10px] font-semibold py-2 px-2">Product Name</p>
        <p class="w-[10%] text-[10px] font-semibold py-2 px-2">Variation</p>
        <p class="w-[15%] text-[10px] font-semibold py-2 px-2">Dri_Collect?</p>
        <p class="w-[10%] text-[10px] font-semibold py-2 px-2">Assign</p>

        <p class="w-[10%] text-[10px] font-semibold py-2 px-2">Total Collect</p>
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
      <!-- pagination -->
      <div class="pt-4">
        <Pagination
          v-if="!loading"
          :data="carbookings"
          @change-page="changePage"
        />
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
