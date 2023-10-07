<script setup>
import Layout from "./Layout.vue";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
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
  ChevronDownIcon,
} from "@heroicons/vue/24/outline";
import { computed, onMounted, ref } from "vue";
import Button from "../components/Button.vue";
import { useReservationStore } from "../stores/reservation";
import { storeToRefs } from "pinia";
import Pagination from "../components/Pagination.vue";
const currentMonth = ref("");
const currentMonthYear = ref(0);
const currentMonthMonth = ref(0);
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const fullDayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const currentDate = ref(null);
const currentDateName = ref(null);
const currentDay = ref(null);
const selectedDay = ref(null);

const reservationStore = useReservationStore();
const { reservations, loading } = storeToRefs(reservationStore);

const fetchData = async (service_date) => {
  await reservationStore.getListAction({
    calender_filter: 1,
    service_date: service_date ?? null,
    limit: 10,
  });
};
onMounted(async () => {
  setCurrentMonth();
  selectedDay.value = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}`;
  await fetchData(selectedDay.value);
});

function setCurrentMonth() {
  currentDate.value = new Date();
  currentDateName.value = new Date().getDay();
  currentDay.value = new Date();
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();

  currentMonthYear.value = year;
  currentMonthMonth.value = month;

  const options = { month: "long", year: "numeric" };
  currentMonth.value = new Date(year, month).toLocaleDateString(
    "en-US",
    options
  );
}

function previousMonth() {
  currentMonthMonth.value -= 1;

  if (currentMonthMonth.value < 0) {
    currentMonthYear.value -= 1;
    currentMonthMonth.value = 11;
  }

  const options = { month: "long", year: "numeric" };
  currentMonth.value = new Date(
    currentMonthYear.value,
    currentMonthMonth.value
  ).toLocaleDateString("en-US", options);
}

function nextMonth() {
  currentMonthMonth.value += 1;

  if (currentMonthMonth.value > 11) {
    currentMonthYear.value += 1;
    currentMonthMonth.value = 0;
  }

  const options = { month: "long", year: "numeric" };
  currentMonth.value = new Date(
    currentMonthYear.value,
    currentMonthMonth.value
  ).toLocaleDateString("en-US", options);
}

const calendarDaysWithOffset = computed(() => {
  const numDays = new Date(
    currentMonthYear.value,
    currentMonthMonth.value + 1,
    0
  ).getDate();
  const startDay = new Date(
    currentMonthYear.value,
    currentMonthMonth.value,
    1
  ).getDay();
  const offset = startDay === 0 ? 6 : startDay - 1;

  const daysArray = [];

  // Add offset days
  for (let i = 0; i < offset; i++) {
    daysArray.push({
      date: "",
      day: "",
      month: currentMonthMonth.value,
      dayName: "",
    });
  }

  // Add month days
  for (let i = 1; i <= numDays; i++) {
    const date = new Date(currentMonthYear.value, currentMonthMonth.value, i);
    const dayIndex = (startDay + i - 1) % 7;
    daysArray.push({
      date: `${currentMonthYear.value}-${currentMonthMonth.value + 1}-${i}`,
      day: i,
      month: currentMonthMonth.value,
      dayName: days[dayIndex],
    });
  }

  return daysArray;
});

const limitedText = (text) => {
  if (text != "") {
    if (text?.length <= 10) {
      return text;
    } else {
      return text?.slice(0, 10);
    }
  }
};

const rows = ref([]);

// Generate time events from 12:00 AM to 11:00 PM
for (let hour = 0; hour <= 23; hour++) {
  const time = formatTime(hour);
  const event = { title: "", time: "" }; // Initialize event as an empty object
  rows.value.push({ time, event });
}

// Function to format time in 12-hour AM/PM format
function formatTime(hour) {
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${formattedHour}:00 ${ampm}`;
}

async function selectDay(day) {
  selectedDay.value = day.date;
  await fetchData(selectedDay.value);

}
</script>

<template>
  <Layout>
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-2xl font-medium text-gray-600">Calendar</h3>
    </div>
    <div class="p-4 mb-5 rounded-lg shadow-sm bg-white/60">
      <div class="flex items-center justify-between mb-5">
        <div class="">
          <p class="mb-1 text-xl font-medium tracking-wide text-gray-600">
            {{ currentMonth }}
          </p>
          <p class="text-base text-gray-500">
            {{ fullDayNames[currentDateName] }}
          </p>
        </div>
        <div class="flex items-center gap-1">
          <div class="flex items-center gap-1 px-6 border-r">
            <Button intent="text" class="text-gray-400">
              <ChevronLeftIcon class="w-5 h-5" aria-hidden="true" />
            </Button>
            <Button intent="text" class="text-sm font-medium text-gray-400">
              Today
            </Button>
            <Button intent="text" class="text-gray-400">
              <ChevronRightIcon class="w-5 h-5" aria-hidden="true" />
            </Button>
            <Button
              class="text-sm font-medium text-gray-400"
              intent="text"
              :right-icon="ChevronDownIcon"
            >
              Day view
            </Button>
          </div>
          <Button :left-icon="CalendarDaysIcon" class="ml-6 text-sm"
            >Add Event</Button
          >
        </div>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div class="col-span-2">
          <div class="flex-1 overflow-y-auto no-scrollbar">
            <div class="flex flex-col gap-2 p-4 h-[600px]">
              <div
                class="w-auto mb-5 overflow-scroll bg-white rounded-lg shadow"
              >
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
                  v-show="!loading"
                  class="relative group"
                  v-for="r in reservations?.data"
                  :key="r.id"
                >
                  <div
                    class="grid w-auto grid-cols-8 col-span-8 bg-white divide-y divide-gray-100"
                  >
                    <!-- <div
              class="col-span-6 px-3 py-1 mt-2 text-xs text-center text-gray-700 bg-gray-300 whitespace-nowrap"
              v-if="r.past_crm_id"
            >
              Cashiers CRM ID - {{ r.past_crm_id }}
            </div>
            <div
              class="col-span-6 px-3 py-1 mt-2 text-xs text-center text-gray-700 bg-gray-300 whitespace-nowrap"
              v-else
            >
              Current Reservation
            </div> -->
                    <div
                      class="grid grid-cols-8 col-span-8 bg-white divide-y divide-gray-100"
                      v-for="d in r.items"
                      :key="d.id"
                    >
                      <div
                        class="p-3 mt-2 text-xs text-center text-gray-700 whitespace-nowrap min-w-[200px] overflow-hidden"
                      >
                        {{ d.crm_id }}
                      </div>
                      <div
                        class="p-3 mt-2 text-xs text-center text-gray-700 whitespace-nowrap min-w-[200px] overflow-hidden"
                      >
                        <p v-if="r.past_crm_id">{{ r.past_crm_id }}</p>
                        <p v-if="!r.past_crm_id">-</p>
                      </div>
                      <div
                        class="p-3 mt-2 text-xs text-center text-gray-700 whitespace-nowrap min-w-[200px] overflow-hidden"
                      >
                        <p
                          v-if="d.product_type == 'App\\Models\\PrivateVanTour'"
                        >
                          PrivateVanTour
                        </p>
                        <p v-if="d.product_type == 'App\\Models\\GroupTour'">
                          GroupTour
                        </p>
                        <p
                          v-if="d.product_type == 'App\\Models\\AirportPickup'"
                        >
                          Airpot Pickup
                        </p>
                        <p
                          v-if="d.product_type == 'App\\Models\\EntranceTicket'"
                        >
                          Entrance Ticket
                        </p>
                        <p v-if="d.product_type == 'App\\Models\\Inclusive'">
                          Inclusive
                        </p>
                        <p v-if="d.product_type == 'App\\Models\\Hotel'">
                          Hotel & Room
                        </p>
                        <p v-if="d.product_type == 'App\\Models\\Airline'">
                          Airline
                        </p>
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
                        <p v-if="d.room?.name">
                          {{ limitedText(d.room?.name) }}
                        </p>
                      </div>
                      <div
                        class="p-3 mt-2 text-xs text-center text-gray-700 whitespace-nowrap min-w-[200px] overflow-hidden"
                      >
                        <p
                          v-if="!d.payment_status || d.payment_status == 'null'"
                        >
                          -
                        </p>
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
                            r.past_crm_id
                          "
                        >
                          <button
                            class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                          >
                            <PencilSquareIcon class="w-5 h-5" />
                          </button>
                        </router-link>
                      </div>
                      <!-- <div
                class="py-3 pl-10 text-xs text-gray-700 whitespace-nowrap min-w-[200px] overflow-hidden"
              >
                <div class="flex items-center gap-2"> -->
                      <!-- <router-link
                    :to="'/reservation/view/' + d.id + '/' + d.crm_id"
                  >
                    <button
                      class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-blue-500 hover:text-white"
                    >
                      <EyeIcon class="w-5 h-5" />
                    </button>
                  </router-link> -->

                      <!-- </div>
              </div> -->
                    </div>
                  </div>
                </div>
                <div
                  v-if="reservations?.data.length == 0"
                  class="flex items-center justify-center py-20"
                >
                  Data Empty ...
                </div>
                <div
                  v-if="loading"
                  class="flex items-center justify-center py-20"
                >
                  <div
                    class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-4"
                    role="status"
                  >
                    <span
                      class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                      >Loading...</span
                    >
                  </div>
                  Loading ...
                </div>
              </div>
              <Pagination
                v-if="!loading"
                :data="reservations"
                @change-page="changePage"
              />
              <!-- <div
                v-for="row in rows"
                :key="row.time"
                class="flex items-center"
              >
                <div class="w-1/4">
                  <p class="text-sm text-gray-600">{{ row.time }}</p>
                </div>
                <div class="w-3/4">
                  <div v-if="row.event" class="flex items-center w-full">
                    <div
                      class="w-full h-40 px-2 py-1 ml-2 text-gray-600 border border-gray-100 rounded"
                    >
                      {{ row.event.time }}
                    </div>
                  </div>
                </div>
              </div> -->
              <!-- <div
                v-for="row in rows"
                :key="row.time"
                class="flex items-center"
              >
                <div class="w-1/4">
                  <p class="text-sm text-gray-600">{{ row.time }}</p>
                </div>
                <div class="w-3/4">
                  <div v-if="row.event" class="flex items-center w-full">
                    <div
                      class="w-full h-40 px-2 py-1 ml-2 text-gray-600 border border-gray-100 rounded"
                    >
                      {{ row.event.time }}
                    </div>
                  </div>
                </div> -->
              <!-- </div> -->
            </div>
          </div>
        </div>
        <div class="p-4 calendar">
          <div class="flex items-center justify-between mb-4 calendar-header">
            <button
              @click="previousMonth"
              class="text-xl text-gray-500 focus:outline-none"
            >
              <ChevronLeftIcon class="w-5 h-5" />
            </button>
            <h2 class="text-base text-gray-500">{{ currentMonth }}</h2>
            <button
              @click="nextMonth"
              class="text-xl text-gray-500 focus:outline-none"
            >
              <ChevronRightIcon class="w-5 h-5" />
            </button>
          </div>
          <div class="grid grid-cols-7 gap-4 calendar-body">
            <div
              v-for="day in days"
              :key="day"
              class="py-2 text-sm text-center text-gray-500 calendar-day"
            >
              {{ day }}
            </div>
            <template v-for="(day, index) in calendarDaysWithOffset">
              <button
                v-if="day.date"
                :key="day.date"
                @click.prevent="selectDay(day)"
                class="py-2 text-center text-gray-500 transition border border-gray-300 rounded shadow calendar-day hover:bg-blue-500 hover:text-white"
                :class="{
                  'bg-blue-500 text-white': day.date === selectedDay,
                  'opacity-50': day.month !== currentMonthMonth && day.day > 31,
                }"
              >
                {{ day.day }}
              </button>
              <div v-else :key="'br-' + index" class="empty-day"></div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style>
.empty-day {
  visibility: hidden;
}
</style>
