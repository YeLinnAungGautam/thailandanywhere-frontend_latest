<script setup>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import Layout from "./Layout.vue";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { computed, onMounted, ref, watch } from "vue";
import { useReservationStore } from "../stores/reservation";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth";
import { PencilSquareIcon } from "@heroicons/vue/24/outline";
import { useAdminStore } from "../stores/admin";
import Pagination from "../components/Pagination.vue";

const reservationStore = useReservationStore();
const authStore = useAuthStore();
const adminStore = useAdminStore();

const { reservations, loading, reservationCalendar } =
  storeToRefs(reservationStore);
const { admin } = storeToRefs(adminStore);
const router = useRouter();

const fetchData = async (service_date) => {
  await reservationStore.getListAction({
    calender_filter: true,
    user_id: "",
    service_date: service_date ?? null,
    limit: 100,
  });
};

const currentTime = ref(null);
const currentDate = ref(null);
const userId = ref("");

onMounted(async () => {
  if (authStore.isSuperAdmin || authStore.isReservation) {
    userId.value = "";
  } else {
    userId.value = authStore.user.id;
  }
  currentTime.value = new Date().toISOString();
  currentDate.value = currentTime.value.split("T")[0];
  // currentDate.value = "2023-08-02";
  await fetchData(currentDate.value);
  await adminStore.getSimpleListAction();
});

const events = computed(() => {
  if (!reservations.value) {
    return null;
  } else {
    const resultItems = [];

    reservations.value.data.forEach((entry) => {
      resultItems.push(entry);
    });

    return resultItems.map((r) => {
      return {
        title: r?.product?.name,
        start: new Date(r?.service_date).toISOString(),
        extendedProps: {
          data: r,
        },
      };
    });
  }
});

const handleDateClick = (info) => {
  // info.date contains the clicked date
  const clickedDate = info.date;
  // You can perform any actions with the clickedDate here
  console.log("Clicked date:", clickedDate);
};

const calendarOptions = ref({
  plugins: [dayGridPlugin],
  displayEventTime: false,
  selectable: true,
  initialView: "dayGridMonth",
  headerToolbar: {
    left: "prev,next",
    center: "title",
    right: "dayGridMonth", // user can switch between the two
  },
  events: events,

  eventClick: async function (info) {
    const d = info.event.extendedProps.data;
    console.log(info.event._instance.range.start);
    const date = formattedDate(info.event._instance.range.start);
    // serviceDate.value = date;
    console.log(date);
    // router.push("/reservation/update/" + d.id + "/" + d.crm_id + "/" + null);
    const res = await reservationStore.getListCalendarAction({
      user_id: "",
      service_date: date,
    });
    // console.log(reservationCalendar.value, res, "this is value");
    reservationList.value = reservationCalendar.value.data.result;
    console.log(reservationList.value, "this is value");
  },
});

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

const byuser = ref("");
const productType = ref("");
const serviceDate = ref("");
const bookingStatus = ref("");
const expenseStatus = ref("");
const paymentStatus = ref("");
const limit = ref(100);

watch(byuser, async (newValue) => {
  await reservationStore.getListCalendarAction(watchSystem.value);
  reservationList.value = reservationCalendar.value.data.result;
});
watch(paymentStatus, async (newValue) => {
  await reservationStore.getListCalendarAction(watchSystem.value);
  reservationList.value = reservationCalendar.value.data.result;
});
watch(expenseStatus, async (newValue) => {
  await reservationStore.getListCalendarAction(watchSystem.value);
  reservationList.value = reservationCalendar.value.data.result;
});
watch(productType, async (newValue) => {
  await reservationStore.getListCalendarAction(watchSystem.value);
  reservationList.value = reservationCalendar.value.data.result;
});
watch(serviceDate, async (newValue) => {
  await reservationStore.getListCalendarAction(watchSystem.value);
  reservationList.value = reservationCalendar.value.data.result;
});
watch(bookingStatus, async (newValue) => {
  await reservationStore.getListCalendarAction(watchSystem.value);
  reservationList.value = reservationCalendar.value.data.result;
});

const watchSystem = computed(() => {
  const result = {};

  if (limit.value != "" && limit.value != undefined) {
    result.limit = limit.value;
  }

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
    result.payment_status = paymentStatus.value;
  }
  if (serviceDate.value != "" && serviceDate.value != undefined) {
    result.service_date = serviceDate.value;
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
    <div class="grid grid-cols-3 gap-4">
      <div class="col-span-1 bg-white">
        <div class="bg-white p-4 space-y-6">
          <p>Filter Result By :</p>
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
                :options="bookingList"
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
                :options="bookingList"
                label="name"
                :clearable="false"
                :reduce="(d) => d.name"
                placeholder="status ..."
              ></v-select>
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-2">
        <FullCalendar
          :options="calendarOptions"
          :selectable="true"
          @dateClick="handleDateClick"
        >
        </FullCalendar>
      </div>
      <div class="col-span-3" v-if="reservationList">
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
            v-for="d in reservationList?.data"
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
                <!-- {{ limitedText(d.product?.name) }} -->
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
      <!-- <div class="col-span-3">
        <Pagination
          v-if="!loading"
          :data="reservationList"
          @change-page="changePage"
        />
      </div> -->
    </div>
  </Layout>
</template>

<style></style>
