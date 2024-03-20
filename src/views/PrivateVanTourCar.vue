<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Layout from "../views/Layout.vue";
import { useSupplierStore } from "../stores/supplier";
import { storeToRefs } from "pinia";
import UnassignedVue from "../components/CarBookingUnsign/Unassigned.vue";
import SupplierCarVue from "../components/CarBookingUnsign/SupplierCar.vue";
import { useCarBookingStore } from "../stores/carbooking";
import { useDriverStore } from "../stores/driver";

const supplierStore = useSupplierStore();
const { suppliers } = storeToRefs(supplierStore);
const carBookingStore = useCarBookingStore();
const { carbookings, loading } = storeToRefs(carBookingStore);
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

const getWithDate = async (date) => {
  let first = date[0];
  let second = date[1];
  console.log(dateFormat(first), "this is date", dateFormat(second));
  let data = {
    first: dateFormat(first),
    second: dateFormat(second),
    supplier_id: part.value != "unassigned" ? part.value : "",
  };
  const res = await carBookingStore.getListAction(data);
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

onMounted(async () => {
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
      <div class="flex px-4 py-1.5 mb-5 space-x-2 rounded-lg overflow-x-scroll">
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
          class="px-4 py-1 text-xs rounded-full cursor-pointer flex justify-start items-center gap-1.5"
          :class="part == s.id ? 'text-[#FF5B00]' : ''"
          @click="goSupplier(s.id)"
        >
          <p class="w-2 h-2 rounded-full bg-[#FF5B00]" v-if="part == s.id"></p>
          {{ s.name }}
        </div>
      </div>
      <!-- filter -->
      <div
        class="flex col-span-3 items-center justify-between py-3 bg-white rounded-md shadow-sm px-4"
      >
        <p class="text-md font-semibold tracking-wider mr-4">Filter:</p>
        <div class="w-[30%]">
          <VueDatePicker
            v-model="dateFilterRange"
            range
            :preset-dates="presetDates"
            placeholder="select date range"
          >
            <template #preset-date-range-button="{ label, value, presetDate }">
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

      <!-- unsign or supplier -->
      <div v-if="part == 'unassigned'">
        <UnassignedVue
          :list="carbookings && carbookings"
          :loading="loading"
          :part="part"
          :daterange="dateFilterRange"
        />
      </div>
      <div v-if="part != 'unassigned'">
        <SupplierCarVue :list="carbookings && carbookings" :loading="loading" />
      </div>
    </div>
  </Layout>
</template>
