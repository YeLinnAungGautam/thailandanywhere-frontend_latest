<template>
  <div class="grid grid-cols-11 gap-4 relative">
    <!-- <div
      v-if="loading"
      class="absolute top-[30%] left-[30%] rounded-2xl bg-black/50 z-20 w-[300px] h-[300px]"
    >
      <div class="flex justify-center items-center h-full">
        <p class="text-center my-auto text-white">loading</p>
      </div>
    </div> -->
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
              @click="changeBackground('private-van-tour')"
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
            :reservationTotal="reservationTotal"
            :expense="expense"
            :booking_receipt="booking_receipt"
            :loading="loading"
          />
        </div>
      </div>
    </div>

    <div class="col-span-4 space-y-2">
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
    <div class="col-span-5 space-y-2">
      <p class="text-sm">
        Today Event
        <span class="text-[#ff613c] rounded-lg font-medium">{{
          selectedDay ? `at ${selectedDay}` : ``
        }}</span>
      </p>
      <div
        v-if="!loading"
        class="bg-white shadow rounded-lg divide-y-2 divide-gray-300 max-h-[405px] overflow-scroll"
      >
        <div class="" v-for="i in reservation_list ?? []" :key="i">
          <ReservationCartVue :backgroundCustom="backgroundCustom" :data="i" />
        </div>
      </div>
      <div
        v-if="loading"
        class="bg-white shadow rounded-lg divide-y-4 divide-gray-200 max-h-[405px] overflow-scroll"
      >
        <div class="" v-for="i in 5 ?? []" :key="i">
          <ReservationCartLoadingVue :backgroundCustom="backgroundCustom" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { format } from "date-fns";
import CalendarPartVue from "./CalendarPart.vue";
import InformationVue from "./Information.vue";
import { ref, onMounted, watch } from "vue";

import ReservationCartVue from "./ReservationCart.vue";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";
import { useDashboardStore } from "../../stores/dashboard";
import { useReservationStore } from "../../stores/reservation";
import ReservationCartLoadingVue from "./ReservationCartLoading.vue";
import { useAuthStore } from "../../stores/auth";

const authStore = useAuthStore();
const dashboardStore = useDashboardStore();
const reservationStore = useReservationStore();

const selectedDay = ref(new Date());

const loading = ref(false);

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
    case "private-van-tour":
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

const reservationTotal = ref(0);
const expense = ref(0);
const booking_receipt = ref(0);
const reservation_list = ref([]);

const getTodaySale = async () => {
  loading.value = true;

  let dataFilter = {
    limit: 100,
    page: 1,
    product_type: productType.value,
    service_date: selectedDay.value,
  };

  if (authStore.isSuperAdmin || authStore.isReservation) {
    dataFilter.user_id = "";
  } else {
    dataFilter.user_id = authStore.user.id;
  }

  const res = await reservationStore.getSimpleListAction(dataFilter);

  reservation_list.value = res.result.data;
  filterGetTodaySale(res.result);
  loading.value = false;
};

const filterGetTodaySale = (data) => {
  reservationTotal.value = data.data.length;

  const expense_data = data.data.filter(
    (item) => item.payment_status === "fully_paid"
  );
  expense.value = expense_data.length;

  const reservation_data = data.data.filter(
    (item) => item.paid_slip.length > 0
  );
  booking_receipt.value = reservation_data.length;

  console.log("====================================");
  console.log("data", data);
  console.log("====================================");
  console.log("expense", expense.value);
};

watch([selectedDay, productType], async (value) => {
  await getTodaySale();
});

onMounted(async () => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  selectedDay.value = formatter.format(new Date());

  // await getTodaySale();
});
</script>
