<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Layout from "../views/Layout.vue";
import { useSupplierStore } from "../stores/supplier";
import { storeToRefs } from "pinia";
import UnassignedVue from "../components/CarBookingUnsign/Unassigned.vue";
import SupplierCarVue from "../components/CarBookingUnsign/SupplierCar.vue";
import { useCarBookingStore } from "../stores/carbooking";
import { useDriverStore } from "../stores/driver";
import { useAuthStore } from "../stores/auth";
import { useAdminStore } from "../stores/admin";
import HomeSecondPartVue from "../components/HomeSecondPart.vue";
import ReservationTranVue from "../components/CarBookingUnsign/ReservationTran.vue";
import {
  HeartIcon,
  ExclamationCircleIcon,
  PuzzlePieceIcon,
  BanknotesIcon,
  BriefcaseIcon,
} from "@heroicons/vue/24/outline";

const supplierStore = useSupplierStore();
const { suppliers } = storeToRefs(supplierStore);
const carBookingStore = useCarBookingStore();
const { carbookings, loading } = storeToRefs(carBookingStore);
const authStore = useAuthStore();
const adminStore = useAdminStore();
const { user } = storeToRefs(authStore);
const { admin } = storeToRefs(adminStore);
const driverStore = useDriverStore();
const { drivers } = storeToRefs(driverStore);
const route = useRoute();
const router = useRouter();
const part = ref("");
const dateFilterRange = ref("");

import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";

const presetDates = ref([
  { label: "Today", value: [new Date(), new Date()] },
  {
    label: "Today (Slot)",
    value: [new Date(), new Date()],
    slot: "preset-date-range-button",
  },
  {
    label: "This month",
    value: [startOfMonth(new Date()), endOfMonth(new Date())],
  },
  {
    label: "Last month",
    value: [
      startOfMonth(subMonths(new Date(), 1)),
      endOfMonth(subMonths(new Date(), 1)),
    ],
  },
  {
    label: "This year",
    value: [startOfYear(new Date()), endOfYear(new Date())],
  },
]);

const goSupplier = async (name) => {
  router.push({ name: "car-bookings", params: { part: name } });
  part.value = name;
};

const dateFormat = (inputDateString) => {
  if (inputDateString != null) {
    const inputDate = new Date(inputDateString);

    // Get the year, month, and day components
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
    const day = String(inputDate.getDate()).padStart(2, "0");

    // Format the date in "YYYY-MM-DD" format
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  } else {
    return null;
  }
};

const agent_id = ref("");

const changeFunction = (data) => {
  getWithDate(dateFilterRange.value);
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
    supplier_id: part.value != "unassigned" ? part.value : "",
  };
  if (user.value.role == "super_admin" || user.value.role == "reservation") {
    data.agent_id = agent_id.value;
  } else {
    data.agent_id = user.value.id;
  }
  console.log(data, "this is data from car booking");
  const res = await carBookingStore.getListAction(data);

  await getSummary(date);
};

const adminData = computed(() => {
  let data = [];
  if (admin.value) {
    data.push({ id: "", name: "all agents" });
    for (let i = 0; i < admin?.value.data?.length; i++) {
      data.push(admin.value.data[i]);
    }
    console.log(data, "this is agent array");
  }
  return data;
});

const summaryData = ref(null);
const getSummary = async (date) => {
  let data = {
    supplier_id: part.value != "unassigned" ? part.value : "",
    daterange: `${dateFormat(date[0])},${dateFormat(date[1])}`,
  };
  if (user.value.role == "super_admin" || user.value.role == "reservation") {
    data.agent_id = agent_id.value;
  } else {
    data.agent_id = user.value.id;
  }
  console.log(data, "this is summary");
  const res = await carBookingStore.getCarBookingSummary(data);
  console.log(res);
  summaryData.value = res.result;
};

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

const changeDate = ref("");
const changeServiceDate = (data) => {
  console.log(data);
  changeDate.value = data;
  if (data == "today") {
    let startDate = formatDate(new Date());
    let endDate = formatDate(new Date());
    console.log(`${startDate},${endDate}`);
    dateFilterRange.value = `${startDate},${endDate}`;
  } else if (data == "tomorrow") {
    let tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    let startDate = formatDate(tomorrowDate);
    let endDate = formatDate(tomorrowDate);
    console.log(`${startDate},${endDate}`);
    dateFilterRange.value = `${startDate},${endDate}`;
  } else if (data == "7day") {
    let startDate = formatDate(new Date());
    let endDate = formatDate(
      new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
    );
    console.log(`${startDate},${endDate}`);
    dateFilterRange.value = `${startDate},${endDate}`;
  } else if (data == "30day") {
    let startDate = formatDate(new Date());
    let endDate = formatDate(
      new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
    );
    console.log(`${startDate},${endDate}`);
    dateFilterRange.value = `${startDate},${endDate}`;
  }
};

watch(dateFilterRange, (newValue) => {
  if (dateFilterRange.value != null) {
    getWithDate(dateFilterRange.value);
  }
});

watch(part, async (newValue) => {
  if (dateFilterRange.value != null) {
    getWithDate(dateFilterRange.value);
  }
});

watch(agent_id, async (newValue) => {
  if (dateFilterRange.value != null) {
    getWithDate(dateFilterRange.value);
  }
});

onMounted(async () => {
  await authStore.getMe();
  await adminStore.getSimpleListAction();
  console.log(user.value, "this is user");
  dateFilterRange.value = [startOfMonth(new Date()), endOfMonth(new Date())];
  part.value = route.params.part;
  console.log(part.value);
  await supplierStore.getSimpleListAction();
  console.log(dateFilterRange.value);
});
</script>

<template>
  <Layout>
    <div class="space-y-4">
      <div
        class="flex px-4 py-1.5 space-x-2 w-[500px] lg:w-[1000px] xl:w-[1250px] rounded-lg overflow-x-scroll"
      >
        <div
          class="px-4 py-1 text-xs rounded-full cursor-pointer flex justify-start items-center gap-1.5"
          :class="part == 'unassigned' ? 'text-[#FF5B00]' : ''"
          @click="goSupplier('unassigned')"
        >
          <p
            class="w-2 h-2 rounded-full bg-[#FF5B00]"
            v-if="part == 'unassigned'"
          ></p>
          Unassigned
        </div>
        <div
          v-for="s in suppliers?.data"
          :key="s.id"
          class="px-4 py-1 text-xs rounded-full cursor-pointer flex whitespace-nowrap justify-start items-center gap-1.5"
          :class="part == s.id ? 'text-[#FF5B00]' : ''"
          @click="goSupplier(s.id)"
        >
          <p
            class="w-2 h-2 rounded-full bg-[#FF5B00] whitespace-nowrap"
            v-if="part == s.id"
          ></p>
          {{ s.name }}
        </div>
      </div>
      <!-- filter -->
      <div
        class="flex col-span-3 items-center justify-between py-3 bg-white rounded-md shadow-sm px-4"
      >
        <p class="text-md font-semibold tracking-wider mr-4">Filter:</p>
        <div class="flex justify-end items-center gap-4">
          <div class="">
            <div class="flex w-full text-xs justify-end items-center gap-4">
              <p
                @click="changeServiceDate('today')"
                class="flex gap-2 justify-start items-center cursor-pointer"
                :class="
                  changeDate == 'today' ? ' text-[#FF5B00]' : 'text-black'
                "
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
                :class="
                  changeDate == 'tomorrow' ? ' text-[#FF5B00]' : 'text-black'
                "
              >
                <span
                  class="w-2 h-2 rounded-full bg-[#FF5B00]"
                  v-if="changeDate == 'tomorrow'"
                ></span
                >Tomorrow
              </p>
              <p
                @click="changeServiceDate('7day')"
                class="flex gap-2 justify-start items-center cursor-pointer"
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
                class="flex gap-2 justify-start items-center cursor-pointer"
                :class="
                  changeDate == '30day' ? ' text-[#FF5B00]' : 'text-black'
                "
              >
                <span
                  class="w-2 h-2 rounded-full bg-[#FF5B00]"
                  v-if="changeDate == '30day'"
                ></span
                >Next 30 Days
              </p>
            </div>
          </div>
          <div v-if="authStore.isSuperAdmin || authStore.isReservation">
            <v-select
              v-model="agent_id"
              class="style-chooser bg-white rounded-lg w-[250px]"
              :options="adminData ?? []"
              label="name"
              :clearable="false"
              :reduce="(d) => d.id"
              placeholder="choose agent name"
            ></v-select>
          </div>
          <div class="">
            <VueDatePicker
              v-model="dateFilterRange"
              range
              :preset-dates="presetDates"
              :format="'yyyy-MM-dd'"
              placeholder="select date range"
            >
              <template
                #preset-date-range-button="{ label, value, presetDate }"
              >
                <span
                  role="button"
                  :tabindex="0"
                  @click="presetDate(value)"
                  @keyup.enter.prevent="presetDate(value)"
                  @keyup.space.prevent="presetDate(value)"
                >
                  {{ label }}
                </span>
              </template>
            </VueDatePicker>
          </div>
        </div>
      </div>

      <!-- show data -->
      <div class="flex justify-start items-center space-x-3 col-span-3 mb-4">
        <HomeSecondPartVue
          :icon="HeartIcon"
          :title="'Total Bookings'"
          :amount="summaryData?.total_booking"
          :isActive="true"
        />
        <HomeSecondPartVue
          :icon="PuzzlePieceIcon"
          :title="'Total Sales'"
          :amount="summaryData?.total_sales"
          :isActive="false"
        />
        <HomeSecondPartVue
          :icon="BanknotesIcon"
          :title="'Total Cost'"
          :amount="summaryData?.total_cost"
          :isActive="false"
        />
        <HomeSecondPartVue
          :icon="BriefcaseIcon"
          :title="'Balance'"
          :amount="summaryData?.total_balance"
          :isActive="false"
        />
      </div>
      <!-- unsign or supplier -->
      <div v-if="part == 'unassigned'">
        <UnassignedVue
          :list="carbookings && carbookings"
          :loading="loading"
          :part="part"
          :agent="agent_id"
          :daterange="dateFilterRange"
          @change="changeFunction"
        />
      </div>
      <div v-if="part != 'unassigned'">
        <SupplierCarVue
          :list="carbookings && carbookings"
          :loading="loading"
          :part="part"
          :agent="agent_id"
          :daterange="dateFilterRange"
          @change="changeFunction"
        />
        <div>
          <div>
            <ReservationTranVue :vendor="part" />
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
