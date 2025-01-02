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
    <div class="space-y-2 col-span-2">
      <div
        class="flex justify-between items-center gap-x-2 shadow bg-white py-4 px-3 rounded-lg"
      >
        <p class="text-[10px] font-medium pb-1">Type:</p>
        <div class="relative">
          <p
            class="flex justify-start items-center gap-x-2 mr-2"
            @click="openSelection = !openSelection"
          >
            <span
              class="text-xs w-2 h-2 inline-block rounded-lg"
              :class="backgroundCustom"
            ></span
            ><span class="text-[10px] font-medium">{{ chooseType }}</span>
            <ChevronDownIcon class="w-3 h-3" />
          </p>
          <div
            v-if="openSelection"
            class="absolute top-8 right-0 bg-white duration-150 shadow rounded-lg divide-y-2 divide-white"
          >
            <p
              @click="changeBackground('all')"
              class="px-2 py-2 text-[12px] flex justify-start cursor-pointer items-center gap-x-2"
            >
              <span
                class="text-xs bg-gray-600 w-2 h-2 inline-block rounded-lg"
              ></span
              >All
            </p>
            <p
              @click="changeBackground('attraction')"
              class="px-2 py-2 text-[12px] flex justify-start cursor-pointer items-center gap-x-2"
            >
              <span
                class="text-xs bg-blue-600 w-2 h-2 inline-block rounded-lg"
              ></span
              >Attraction
            </p>
            <p
              @click="changeBackground('hotel')"
              class="px-2 py-2 text-[12px] flex justify-start cursor-pointer items-center gap-x-2"
            >
              <span
                class="text-xs bg-green-600 w-2 h-2 inline-block rounded-lg"
              ></span
              >Hotel
            </p>
            <p
              @click="changeBackground('private-van-tour')"
              class="px-2 py-2 text-[12px] flex justify-start cursor-pointer items-center gap-x-2"
            >
              <span
                class="text-xs bg-yellow-600 w-2 h-2 inline-block rounded-lg"
              ></span
              >Vantour
            </p>
          </div>
        </div>
      </div>
      <div class="">
        <div>
          <InformationVue
            :selectedDay="selectedDay"
            :backgroundCustom="backgroundCustom"
            :reservationTotal="reservationTotal"
            :expense="expense"
            :booking_receipt="booking_receipt"
            :loading="loading"
            :customer_not_paid="customer_not_paid"
            :filterType="filterType"
            @filterType="changeFilterType"
          />
        </div>
      </div>
    </div>

    <div class="col-span-4 space-y-2">
      <!-- <p class="text-sm">
        Calendar
        <span class="text-[#ff613c] rounded-lg font-medium">{{
          selectedDay ? `at ${selectedDay}` : ``
        }}</span>
      </p> -->
      <div
        class="text-xs font-medium shadow bg-white py-4 px-4 rounded-lg flex justify-between items-center"
      >
        <p class="">Chosen Date</p>
        <p>
          <span class="text-[#ff613c] rounded-lg font-medium">{{
            selectedDay ? `${selectedDay}` : ``
          }}</span>
        </p>
      </div>
      <div class="bg-white shadow p-2 rounded-lg">
        <div class="h-auto font-poppins">
          <CalendarPartVue @change="changesFromCalendar" />
        </div>
      </div>
    </div>
    <div class="col-span-5 space-y-2">
      <div
        class="text-xs font-medium shadow flex justify-between items-center bg-white px-4 rounded-lg"
        :class="filterType != '' ? 'py-3' : 'py-4'"
      >
        <p>Filtered By</p>
        <div class="flex justify-end items-center gap-x-2">
          <!-- <select
            v-if="authStore.isSuperAdmin || authStore.isReservation"
            name=""
            id=""
            v-model="userFilter"
            class="px-2 py-1 focus:border-gray-300 border border-gray-300 placeholder-sm bg-white rounded-lg w-3/5 sm:w-3/5 md:w-full text-gray-400 space-y-2 h-9"
          >
            <option :value="null" disabled class="bg-gray-200 text-sm">
              Filter By User
            </option>
            <option value="" class="text-sm">All User</option>
            <option
              :value="key.id"
              v-for="(key, index) in adminLists"
              :key="index"
              class="text-sm"
            >
              {{ key.name }}
            </option>
          </select> -->
          <p
            class="text-white text-[10px] px-2 py-1 rounded-lg"
            v-if="chooseType"
            :class="backgroundCustom"
          >
            {{ chooseType }}
          </p>
          <p
            class="text-white text-[10px] bg-[#ff613c] px-2 py-1 rounded-lg"
            v-if="filterType"
          >
            {{ filterType }}
          </p>
        </div>
      </div>
      <div
        v-if="!loading"
        class="bg-white shadow rounded-lg divide-y-2 divide-gray-300 max-h-[405px] overflow-scroll"
      >
        <div class="" v-for="i in getListing ?? []" :key="i">
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
import { ref, onMounted, watch, computed } from "vue";

import ReservationCartVue from "./ReservationCart.vue";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";
import { useDashboardStore } from "../../stores/dashboard";
import { useReservationStore } from "../../stores/reservation";
import ReservationCartLoadingVue from "./ReservationCartLoading.vue";
import { useAuthStore } from "../../stores/auth";
import { useAdminStore } from "../../stores/admin";

const authStore = useAuthStore();
const dashboardStore = useDashboardStore();
const reservationStore = useReservationStore();
const userFilter = ref(null);
const adminStore = useAdminStore();

const selectedDay = ref(new Date());

const loading = ref(false);

const openSelection = ref(false);
const selectedProductType = ref("attraction");

const backgroundCustom = ref("bg-blue-600");
const productType = ref("App\\Models\\EntranceTicket");

const chooseType = ref("Attraction");

const adminLists = ref([]);

const getListUser = async () => {
  try {
    const res = await adminStore.getSimpleListAction();
    console.log(res, "this is admin list");

    adminLists.value = res.result.data
      .filter((item) => item.role === "admin")
      .map((item) => {
        // Return desired structure or transformation here
        return {
          id: item.id,
          name: item.name,
        };
      });
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
  }
};

const changeBackground = (type) => {
  selectedProductType.value = type;
  switch (type) {
    case "all":
      backgroundCustom.value = "bg-gray-600";
      productType.value = "";
      chooseType.value = "All";
      openSelection.value = false;
      break;
    case "attraction":
      backgroundCustom.value = "bg-blue-600";
      productType.value = "App\\Models\\EntranceTicket";
      chooseType.value = "Attraction";
      openSelection.value = false;
      break;
    case "hotel":
      backgroundCustom.value = "bg-green-600";
      productType.value = "App\\Models\\Hotel";
      chooseType.value = "Hotel";
      openSelection.value = false;
      break;
    case "private-van-tour":
      backgroundCustom.value = "bg-yellow-600";
      productType.value = "App\\Models\\PrivateVanTour";
      chooseType.value = "Van Tour";
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
const customer_not_paid = ref(0);

const getTodaySale = async () => {
  loading.value = true;

  let dataFilter = {
    limit: 100,
    page: 1,

    service_date: selectedDay.value,
  };

  if (productType.value != "") {
    dataFilter.product_type = productType.value;
  }

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

const getListing = computed(() => {
  if (filterType.value == "") {
    return reservation_list.value;
  } else if (filterType.value == "customer not paid") {
    return customer_not.value;
  } else if (filterType.value == "expense not paid") {
    return expense_data.value;
  } else if (filterType.value == "missing receipt") {
    return reservation_data.value;
  }
});

const expense_data = ref(null);
const reservation_data = ref(null);
const customer_not = ref(null);

const filterGetTodaySale = (data) => {
  reservationTotal.value = data.data.length;

  expense_data.value = data.data.filter(
    (item) => item.payment_status === "not_paid"
  );
  expense.value = expense_data.value.length;

  reservation_data.value = data.data.filter(
    (item) => item.paid_slip.length == 0
  );
  booking_receipt.value = reservation_data.value.length;

  customer_not.value = data.data.filter(
    (item) => item.booking.payment_status == "not_paid"
  );
  customer_not_paid.value = customer_not.value.length;

  console.log("====================================");
  console.log("data", data);
  console.log("====================================");
  console.log("expense", expense.value);
};

const filterType = ref("");

const changeFilterType = (value) => {
  filterType.value = value;
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

  await getListUser();

  // await getTodaySale();
});
</script>
