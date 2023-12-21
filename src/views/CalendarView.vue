<script setup>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import Layout from "./Layout.vue";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { computed, onBeforeMount, onMounted, ref, watch } from "vue";
import { useReservationStore } from "../stores/reservation";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth";
import { PencilSquareIcon } from "@heroicons/vue/24/outline";
import { useAdminStore } from "../stores/admin";
import Pagination from "../components/Pagination.vue";
import Button from "../components/Button.vue";
import { addDays } from "date-fns";

const reservationStore = useReservationStore();
const authStore = useAuthStore();
const adminStore = useAdminStore();

const { reservations, loading, reservationCalendar, loadingCalendar } =
  storeToRefs(reservationStore);
const { admin } = storeToRefs(adminStore);
const router = useRouter();

const fetchData = async (month) => {
  const res = await reservationStore.getListCalendarAction({
    date: month,
    limit: limit.value,
  });
  console.log(res, "this is calendar data show");
  calendarAllData.value = res.result.meta.total;
};

const calendarAllData = ref(2000);
const currentTime = ref(null);
const currentDate = ref(null);
const currentMonth = ref(null);
const userId = ref("");

const getMonth = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  currentMonth.value = `${year}-${month}`;
};

const changeDate = ref("");
onMounted(async () => {
  if (authStore.isSuperAdmin || authStore.isReservation) {
    userId.value = "";
  } else {
    userId.value = authStore.user.id;
  }
  currentTime.value = new Date().toISOString();
  currentDate.value = currentTime.value.split("T")[0];
  changeDate.value = currentDate.value;
  getMonth();
  // currentDate.value = "2023-08-02";
  await fetchData(currentMonth.value);
  await adminStore.getSimpleListAction();
  // console.log(reservationCalendar.value, "this is reservation cal");
});

const events = computed(() => {
  if (!reservations.value) {
    return null;
  } else {
    const dateCounts = {}; // Object to store event counts by date

    reservations.value.data.forEach((entry) => {
      const date = new Date(entry.service_date).toDateString(); // Get the date portion

      if (entry.product_type === "App\\Models\\PrivateVanTour") {
        dateCounts[date] = {
          ...dateCounts[date],
          private: (dateCounts[date]?.private || 0) + 1,
        };
      }
      if (entry.product_type === "App\\Models\\EntranceTicket") {
        dateCounts[date] = {
          ...dateCounts[date],
          entrance: (dateCounts[date]?.entrance || 0) + 1,
        };
      }

      if (entry.product_type === "App\\Models\\GroupTour") {
        dateCounts[date] = {
          ...dateCounts[date],
          group: (dateCounts[date]?.group || 0) + 1,
        };
      }
      if (entry.product_type === "App\\Models\\AirportPickup") {
        dateCounts[date] = {
          ...dateCounts[date],
          airport: (dateCounts[date]?.airport || 0) + 1,
        };
      }
      if (entry.product_type === "App\\Models\\Hotel") {
        dateCounts[date] = {
          ...dateCounts[date],
          hotal: (dateCounts[date]?.hotal || 0) + 1,
        };
      }
      if (entry.product_type === "App\\Models\\Airline") {
        dateCounts[date] = {
          ...dateCounts[date],
          airline: (dateCounts[date]?.airline || 0) + 1,
        };
      }
    });

    const resultItems = [];

    for (const date in dateCounts) {
      if (dateCounts[date].private) {
        let eventTitle = `Private: ${dateCounts[date].private}`;

        resultItems.push({
          title: eventTitle,
          start: new Date(date),
        });
      }
      if (dateCounts[date].group) {
        let eventTitle = `Group: ${dateCounts[date].group}`;

        resultItems.push({
          title: eventTitle,
          start: new Date(date),
        });
      }
      if (dateCounts[date].entrance) {
        let eventTitle = `Entrance: ${dateCounts[date].entrance}`;

        resultItems.push({
          title: eventTitle,
          start: new Date(date),
        });
      }
      if (dateCounts[date].airport) {
        let eventTitle = `Airport: ${dateCounts[date].airport}`;

        resultItems.push({
          title: eventTitle,
          start: new Date(date),
        });
      }
      if (dateCounts[date].hotal) {
        let eventTitle = `Hotal: ${dateCounts[date].hotal}`;

        resultItems.push({
          title: eventTitle,
          start: new Date(date),
        });
      }
      if (dateCounts[date].airline) {
        let eventTitle = `Airline: ${dateCounts[date].airline}`;

        resultItems.push({
          title: eventTitle,
          start: new Date(date),
        });
      }
      // Add similar blocks for other properties.
    }

    return resultItems.map((r) => {
      return {
        title: r.title,
        start: r.start,
        extendedProps: {
          data: r,
        },
      };
    });
  }
});

const userIdEvent = ref("");
const calendarRef = ref(null);
const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  displayEventTime: false,
  selectable: true,
  initialView: "dayGridMonth",
  headerToolbar: {
    left: "title",
    right: "prev,next",
  },
  initialDate: null,
  dateClick: async function (info) {
    const res = await reservationStore.getListCalendarTableAction({
      user_id: "",
      service_date: info.dateStr,
      limit: 10,
    });
    reservationList.value = true;
    serviceDate.value = info.dateStr;
  },
  events: events,

  eventClick: async function (info) {
    // console.log(info);
    const p = selectProductType(info.event._def.title);
    const d = info.event.extendedProps.data;
    // console.log(info.event._instance.range.start);
    const date = formattedDate(info.event._instance.range.start);
    serviceDate.value = date;
    productType.value = p;
    byuser.value = userId.value;

    // console.log(date);
    // router.push("/reservation/update/" + d.id + "/" + d.crm_id + "/" + null);
    const res = await reservationStore.getListCalendarTableAction(
      watchSystem.value
    );
    // console.log(watchSystem.value, "this is value");
  },
  datesSet: async function (info) {
    console.log("Dates set:", info);
    let monthChange = serviceDateCal(info.startStr, 10);
    lastMonth.value = monthSetup(monthChange);
    changeMonth.value = monthChange;
    calendarOptions.value.initialDate = changeMonth.value;
  },
});

const lastMonth = ref("");
const changeMonth = ref("");
const getThisMonth = async () => {
  console.log(lastMonth.value);
  await fetchData(lastMonth.value);

  console.log(calendarOptions.value.initialDate, "date");
};

const serviceDateCal = (dateCurrent, day) => {
  console.log(dateCurrent, day);
  let dayChoose = day;
  return addDays(new Date(dateCurrent), dayChoose).toISOString().split("T")[0];
};

const monthSetup = (text) => {
  console.log(text);
  const dateString = text;
  const dateObject = new Date(dateString);

  const year = dateObject.getFullYear();
  let month = dateObject.getMonth() + 1;

  return `${year}-${month}`;
};

const eventTitle = ref("");
const reservationList = ref(null);

const limitedText = (text) => {
  if (text != "") {
    if (text?.length <= 10) {
      return text;
    } else {
      return text?.slice(0, 10);
    }
  }
};

const selectProductType = (text) => {
  if (text.includes("Private")) {
    return "App\\Models\\PrivateVanTour";
  }
  if (text.includes("Group")) {
    return "App\\Models\\GroupTour";
  }
  if (text.includes("Entrance")) {
    return "App\\Models\\EntranceTicket";
  }
  if (text.includes("Airport")) {
    return "App\\Models\\AirportPickup";
  }
  if (text.includes("Hotal")) {
    return "App\\Models\\Hotel";
  }
  if (text.includes("Airline")) {
    return "App\\Models\\Airline";
  }
};

const formattedDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const productList = [
  { id: 1, name: "Private Van tour", value: "App\\Models\\PrivateVanTour" },
  { id: 2, name: "Group Tour", value: "App\\Models\\GroupTour" },
  { id: 3, name: "Entrance Ticket", value: "App\\Models\\EntranceTicket" },
  { id: 4, name: "Airport Pickup", value: "App\\Models\\AirportPickup" },
  { id: 5, name: "Hotel", value: "App\\Models\\Hotel" },
  { id: 6, name: "Airline", value: "App\\Models\\Airline" },
];

const bookingList = [
  { id: 1, name: "awaiting" },
  { id: 2, name: "confirmed" },
  { id: 3, name: "declined" },
];
const expenseStatusArr = [
  { id: "1", name: "fully_paid" },
  { id: "2", name: "not_paid" },
  { id: "3", name: "partially_paid" },
];
const customerPaymentStatusArr = [
  { id: "1", name: "fully_paid" },
  { id: "2", name: "not_paid" },
  { id: "3", name: "partially_paid" },
];

const byuser = ref("");
const productType = ref("");
const serviceDate = ref("");
const bookingStatus = ref("");
const expenseStatus = ref("");
const paymentStatus = ref("");
const limit = ref(5000);

const clearFilter = () => {
  byuser.value = "";
  productType.value = "";
  serviceDate.value = "";
  bookingStatus.value = "";
  expenseStatus.value = "";
  paymentStatus.value = "";
  reservationCalendar.value = null;
};

const monthlyDate = ref("");

watch(byuser, async (newValue) => {
  await reservationStore.getListCalendarTableAction(watchSystem.value);
});
watch(monthlyDate, async (newValue) => {
  await reservationStore.getListCalendarAction({
    date: monthlyDate.value,
    limit: limit.value,
  });
});
watch(paymentStatus, async (newValue) => {
  await reservationStore.getListCalendarTableAction(watchSystem.value);
});
watch(expenseStatus, async (newValue) => {
  await reservationStore.getListCalendarTableAction(watchSystem.value);
});
watch(productType, async (newValue) => {
  await reservationStore.getListCalendarTableAction(watchSystem.value);
});
watch(serviceDate, async (newValue) => {
  await reservationStore.getListCalendarTableAction(watchSystem.value);
});
watch(bookingStatus, async (newValue) => {
  await reservationStore.getListCalendarTableAction(watchSystem.value);
});
watch(limit, async (newValue) => {
  await fetchData();
});

const watchSystem = computed(() => {
  const result = {};

  result.limit = 10;

  if (authStore.isSuperAdmin || authStore.isReservation) {
    result.user_id = "";
  } else {
    result.user_id = authStore.user.id;
  }
  if (productType.value != "" && productType.value != undefined) {
    result.product_type = productType.value;
  }

  if (bookingStatus.value != "" && bookingStatus.value != undefined) {
    result.reservation_status = bookingStatus.value;
  }
  if (expenseStatus.value != "" && expenseStatus.value != undefined) {
    result.expense_status = expenseStatus.value;
  }
  if (paymentStatus.value != "" && paymentStatus.value != undefined) {
    result.customer_payment_status = paymentStatus.value;
  }
  if (serviceDate.value != "" && serviceDate.value != undefined) {
    result.service_date = serviceDate.value;
    // clearFilter();
  }
  if (byuser.value != undefined) {
    result.user_id = byuser.value;
  }

  console.log(result);
  return result;
});

const changePage = async (url) => {
  await reservationStore.getChangeCalPage(url, watchSystem.value);
};

const handleSelect = (e) => {
  console.log(e);
};
</script>
<template>
  <Layout>
    <!-- <pre>
      {{ events }}
    </pre> -->
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-2xl font-medium text-gray-600">Calendar</h3>
    </div>
    <div class="grid grid-cols-4 gap-4">
      <div class="col-span-1 bg-white">
        <div class="bg-white p-4 space-y-3">
          <div class="space-y-3 cursor-pointer">
            <p
              @click="getThisMonth"
              class="bg-[#ff613c] px-4 py-2 text-white rounded text-sm"
            >
              Calendar data Monthly :
            </p>
          </div>
          <!-- <p class="flex justify-start items-center">
            <span>Calendar data :</span>
            <select
              v-model="limit"
              class="w-20 ml-4 p-2 text-xs border-2 rounded-md focus:outline-none focus:ring-0"
            >
              <option value="100">100</option>
              <option value="250">250</option>
              <option value="500">500</option>
              <option value="750">750</option>
              <option value="1000">1000</option>
              <option :value="calendarAllData">All</option>
            </select>
          </p> -->

          <p class="">Filter For Reservation Table</p>
          <div class="space-y-4">
            <p>Filter By Sale Team</p>
            <div class="">
              <select
                v-model="byuser"
                name=""
                id=""
                v-if="admin"
                class="px-2 py-2 focus:border-gray-300 border border-gray-300 placeholder-sm bg-white rounded-lg w-full text-gray-400 space-y-2"
              >
                <option :value="null" disabled class="bg-gray-200 text-sm">
                  Filter By User
                </option>
                <option value="" class="text-sm">All User</option>
                <option
                  :value="key.id"
                  v-for="(key, index) in admin?.data"
                  :key="index"
                  class="text-sm"
                >
                  {{ key.name }}
                </option>
              </select>
            </div>

            <p>By Product</p>
            <div class="">
              <v-select
                v-model="productType"
                class="style-chooser placeholder-sm bg-white rounded-lg w-full text-gray-400"
                :options="productList"
                label="name"
                :clearable="false"
                :reduce="(d) => d.value"
                placeholder="product type ..."
              ></v-select>
            </div>
            <p>Service Date</p>
            <div class="">
              <input
                type="date"
                v-model="serviceDate"
                name=""
                class="w-full px-2 py-2 focus:border-gray-300 border border-gray-300 placeholder-sm text-sm bg-white rounded-lg text-gray-400 space-y-2"
                id=""
              />
            </div>
            <p>Booking Status</p>
            <div>
              <v-select
                v-model="bookingStatus"
                class="style-chooser placeholder-sm bg-white rounded-lg w-full text-gray-400"
                :options="bookingList"
                label="name"
                :clearable="false"
                :reduce="(d) => d.name"
                placeholder="status ..."
              ></v-select>
            </div>
            <p>By Expense Status</p>
            <div>
              <v-select
                v-model="expenseStatus"
                class="style-chooser placeholder-sm bg-white rounded-lg w-full text-gray-400"
                :options="expenseStatusArr"
                label="name"
                :clearable="false"
                :reduce="(d) => d.name"
                placeholder="status ..."
              ></v-select>
            </div>
            <p>By Customer Payment Status</p>
            <div>
              <v-select
                v-model="paymentStatus"
                class="style-chooser placeholder-sm bg-white rounded-lg w-full text-gray-400"
                :options="customerPaymentStatusArr"
                label="name"
                :clearable="false"
                :reduce="(d) => d.name"
                placeholder="status ..."
              ></v-select>
            </div>
            <div @click="clearFilter" class="w-full">
              <Button :leftIcon="FunnelIcon"> clear </Button>
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-3 bg-white p-2" v-if="!loadingCalendar">
        <FullCalendar
          :options="calendarOptions"
          :selectable="true"
          ref="calendarRef"
        >
        </FullCalendar>
      </div>
      <div
        class="col-span-3 bg-white p-2 flex justify-center items-center"
        v-if="loadingCalendar"
      >
        <div
          aria-label="Loading..."
          role="status"
          class="flex items-center space-x-2"
        >
          <svg
            class="h-20 w-20 animate-spin stroke-gray-500"
            viewBox="0 0 256 256"
          >
            <line
              x1="128"
              y1="32"
              x2="128"
              y2="64"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="24"
            ></line>
            <line
              x1="195.9"
              y1="60.1"
              x2="173.3"
              y2="82.7"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="24"
            ></line>
            <line
              x1="224"
              y1="128"
              x2="192"
              y2="128"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="24"
            ></line>
            <line
              x1="195.9"
              y1="195.9"
              x2="173.3"
              y2="173.3"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="24"
            ></line>
            <line
              x1="128"
              y1="224"
              x2="128"
              y2="192"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="24"
            ></line>
            <line
              x1="60.1"
              y1="195.9"
              x2="82.7"
              y2="173.3"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="24"
            ></line>
            <line
              x1="32"
              y1="128"
              x2="64"
              y2="128"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="24"
            ></line>
            <line
              x1="60.1"
              y1="60.1"
              x2="82.7"
              y2="82.7"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="24"
            ></line>
          </svg>
          <span class="text-4xl font-medium text-gray-500"
            >Loading Calendar ...</span
          >
        </div>
      </div>
      <div class="col-span-4" v-if="reservationCalendar != null && !loading">
        <div class="w-auto mb-5 overflow-scroll bg-white rounded-lg shadow">
          <div class="grid grid-cols-8 gap-2 py-2">
            <div
              class="py-2 text-xs font-medium tracking-wide text-center min-w-[200px] overflow-hidden"
            >
              CRM ID
            </div>
            <div
              class="py-2 text-xs font-medium tracking-wide text-center min-w-[200px] overflow-hidden"
            >
              PAST CRM ID
            </div>
            <div
              class="py-2 text-xs font-medium tracking-wide text-center min-w-[200px] overflow-hidden"
            >
              Product Type
            </div>
            <div
              class="py-2 text-xs font-medium tracking-wide text-center min-w-[200px] overflow-hidden"
            >
              Product Name
            </div>
            <div
              class="py-2 text-xs font-medium tracking-wide text-center min-w-[200px] overflow-hidden"
            >
              Variation Name
            </div>
            <div
              class="py-2 text-xs font-medium tracking-wide text-center min-w-[200px] overflow-hidden"
            >
              Payment Status
            </div>
            <div
              class="py-2 text-xs font-medium tracking-wide text-center min-w-[200px] overflow-hidden"
            >
              Reservation Status
            </div>
            <div
              class="py-2 text-xs font-medium tracking-wide text-center min-w-[200px] overflow-hidden"
            >
              Service Date
            </div>
            <div
              class="py-2 text-xs font-medium tracking-wide text-center min-w-[200px] overflow-hidden"
            ></div>
          </div>
          <div
            class="relative group"
            v-for="d in reservationCalendar.result?.data"
            :key="d.id"
          >
            <div
              class="grid w-auto grid-cols-8 col-span-8 bg-white divide-y divide-gray-100"
            >
              <div
                class="p-3 mt-2 text-xs text-center text-gray-700 whitespace-nowrap min-w-[200px] overflow-hidden"
              >
                {{ d.crm_id }}
              </div>
              <div
                class="p-3 mt-2 text-xs text-center text-gray-700 whitespace-nowrap min-w-[200px] overflow-hidden"
              >
                <p v-if="d.booking?.past_crm_id">
                  {{ d.booking?.past_crm_id }}
                </p>
                <p v-if="!d.booking?.past_crm_id">-</p>
              </div>
              <div
                class="p-3 mt-2 text-xs text-center text-gray-700 whitespace-nowrap min-w-[200px] overflow-hidden"
              >
                <p v-if="d.product_type == 'App\\Models\\PrivateVanTour'">
                  PrivateVanTour
                </p>
                <p v-if="d.product_type == 'App\\Models\\GroupTour'">
                  GroupTour
                </p>
                <p v-if="d.product_type == 'App\\Models\\AirportPickup'">
                  Airpot Pickup
                </p>
                <p v-if="d.product_type == 'App\\Models\\EntranceTicket'">
                  Entrance Ticket
                </p>
                <p v-if="d.product_type == 'App\\Models\\Inclusive'">
                  Inclusive
                </p>
                <p v-if="d.product_type == 'App\\Models\\Hotel'">
                  Hotel & Room
                </p>
                <p v-if="d.product_type == 'App\\Models\\Airline'">Airline</p>
              </div>
              <div
                class="p-3 mt-2 text-xs text-center text-gray-700 whitespace-nowrap min-w-[200px] overflow-hidden"
              >
                {{ limitedText(d.product?.name) }}
              </div>
              <div
                class="p-3 mt-2 text-xs text-center text-gray-700 whitespace-nowrap min-w-[200px] overflow-hidden"
              >
                <p v-if="d.car?.name">{{ limitedText(d.car?.name) }}</p>
                <p v-if="d.variation?.name">
                  {{ limitedText(d.variation?.name) }}
                </p>
                <p v-if="d.room?.name">{{ limitedText(d.room?.name) }}</p>
              </div>
              <div
                class="p-3 mt-2 text-xs text-center text-gray-700 whitespace-nowrap min-w-[200px] overflow-hidden"
              >
                <p v-if="!d.payment_status || d.payment_status == 'null'">-</p>
                <p
                  v-if="d.payment_status == 'fully_paid'"
                  class="inline-block px-3 py-1 mt-2 text-xs text-white bg-green-500 rounded-full shadow"
                >
                  {{ d.payment_status }}
                </p>
                <p
                  v-if="d.payment_status == 'not_paid'"
                  class="inline-block px-3 py-1 mt-2 text-xs text-white bg-red-500 rounded-full shadow"
                >
                  {{ d.payment_status }}
                </p>
                <p
                  v-if="d.payment_status == 'partially_paid'"
                  class="inline-block px-3 py-1 mt-2 text-xs text-white bg-yellow-500 rounded-full shadow"
                >
                  {{ d.payment_status }}
                </p>
              </div>
              <div
                class="p-3 mt-2 text-xs text-gray-700 flex justify-center items-center whitespace-nowrap min-w-[200px] overflow-hidden"
              >
                <p v-if="!d.reservation_status">-</p>

                <p
                  v-if="d.reservation_status == 'confirmed'"
                  class="inline-block px-3 py-1 text-xs text-white bg-green-500 rounded-full shadow"
                >
                  {{ d.reservation_status }}
                </p>
                <p
                  v-if="d.reservation_status == 'declined'"
                  class="inline-block px-3 py-1 text-xs text-white bg-red-500 rounded-full shadow"
                >
                  {{ d.reservation_status }}
                </p>
                <p
                  v-if="d.reservation_status == 'awaiting'"
                  class="inline-block px-3 py-1 text-xs text-white bg-yellow-500 rounded-full shadow"
                >
                  {{ d.reservation_status }}
                </p>
              </div>

              <div
                class="p-3 mt-2 text-xs text-center bg-white divide-y divide-gray-100 text-gray-700 whitespace-nowrap min-w-[200px] overflow-hidden flex justify-end items-center"
              >
                <p class="mr-6">{{ d.service_date }}</p>
                <router-link
                  :to="
                    '/reservation/update/' +
                    d.id +
                    '/' +
                    d.crm_id +
                    '/' +
                    d.booking?.past_crm_id
                  "
                >
                  <button
                    class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                  >
                    <PencilSquareIcon class="w-5 h-5" />
                  </button>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="col-span-4 flex justify-center items-center py-10 bg-white"
        v-if="loading"
      >
        <div
          aria-label="Loading..."
          role="status"
          class="flex items-center space-x-2"
        >
          <svg
            class="h-20 w-20 animate-spin stroke-gray-500"
            viewBox="0 0 256 256"
          >
            <line
              x1="128"
              y1="32"
              x2="128"
              y2="64"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="24"
            ></line>
            <line
              x1="195.9"
              y1="60.1"
              x2="173.3"
              y2="82.7"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="24"
            ></line>
            <line
              x1="224"
              y1="128"
              x2="192"
              y2="128"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="24"
            ></line>
            <line
              x1="195.9"
              y1="195.9"
              x2="173.3"
              y2="173.3"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="24"
            ></line>
            <line
              x1="128"
              y1="224"
              x2="128"
              y2="192"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="24"
            ></line>
            <line
              x1="60.1"
              y1="195.9"
              x2="82.7"
              y2="173.3"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="24"
            ></line>
            <line
              x1="32"
              y1="128"
              x2="64"
              y2="128"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="24"
            ></line>
            <line
              x1="60.1"
              y1="60.1"
              x2="82.7"
              y2="82.7"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="24"
            ></line>
          </svg>
          <span class="text-4xl font-medium text-gray-500"
            >Loading List ...</span
          >
        </div>
      </div>
      <div class="col-span-4">
        <Pagination
          v-if="!loading"
          :data="reservationCalendar?.result"
          @change-page="changePage"
        />
      </div>
    </div>
  </Layout>
</template>

<style>
.fc-daygrid-event {
  white-space: normal !important;
  align-items: normal !important;
}
.fc-daygrid-event-dot {
  border: none !important;
  border-radius: calc(var(--fc-daygrid-event-dot-width) / 2);
  box-sizing: content-box;
  height: 0px;
  margin: 0px 4px;
  width: 0px;
}
.fc .fc-button-primary {
  background-color: white !important;
  border-color: var(--fc-button-border-color);
  color: var(--fc-button-text-color);
}
.fc-icon {
  color: black !important;

  -webkit-font-smoothing: antialiased;
  display: inline-block;
  font-style: normal;
  font-variant: normal;
  font-weight: 400;
  height: 1em;
  line-height: 1;
  text-align: center;
  text-transform: none;
  user-select: none;
  width: 1em;
  font-family: fcicons !important;
}
.fc-daygrid-dot-event .fc-event-title {
  flex-grow: 1;
  flex-shrink: 1;
  font-weight: 400 !important;
  min-width: 0px;
  overflow: hidden;
}
/* .fc .fc-daygrid-event {
  margin-top: 1px;
  z-index: 6;
  background-color: #ff9f89c2 !important;
} */
.fc .fc-daygrid-day.fc-day-today {
  background-color: #bab9b96a;
}
.fc-daygrid-day-events .fc-daygrid-event-harness:nth-child(1n) {
  background-color: #ff5e0193;
  margin: 2px 2px 2px 2px;

  font-weight: 300 !important;
  border-radius: 10px;
}
.fc-daygrid-day-events .fc-daygrid-event-harness:nth-child(2n) {
  background-color: #4b4efe6a;
  margin: 2px 2px 2px 2px;

  font-weight: 300 !important;
  border-radius: 10px;
}
.fc-daygrid-day-events .fc-daygrid-event-harness:nth-child(3n) {
  background-color: #ffb5477f;
  margin: 2px 2px 2px 2px;

  font-weight: 300 !important;
  border-radius: 10px;
}

.fc-daygrid-day-events .fc-daygrid-event-harness:nth-child(4n) {
  background-color: #f2ff00;
  margin: 2px 2px 2px 2px;

  font-weight: 300 !important;
  border-radius: 10px;
}
.fc-daygrid-day-events .fc-daygrid-event-harness:nth-child(5n) {
  background-color: #00eaff;
  margin: 2px 2px 2px 2px;

  font-weight: 300 !important;
  border-radius: 10px;
}
.fc-daygrid-day-events .fc-daygrid-event-harness:nth-child(6n) {
  background-color: #ea01ff81;
  margin: 2px 2px 2px 2px;

  font-weight: 300 !important;
  border-radius: 10px;
}
</style>
