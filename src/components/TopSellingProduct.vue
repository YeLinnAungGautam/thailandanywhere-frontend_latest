<template>
  <div class="bg-white w-full rounded-md">
    <div class="flex justify-between items-center py-4 px-4">
      <div class="flex justify-start items-center space-x-10">
        <p class="font-semibold text-base">Top Selling Products</p>
        <div
          class="flex justify-start items-center gap-4 text-xs"
          v-if="!openModal"
        >
          <p
            class="cursor-pointer hover:text-[#FF613c]"
            @click="changeProductType(' ')"
          >
            All
          </p>
          <p
            class="cursor-pointer hover:text-[#FF613c]"
            @click="changeProductType('App\\Models\\Hotel')"
          >
            Hotels
          </p>
          <p
            class="cursor-pointer hover:text-[#FF613c]"
            @click="changeProductType('App\\Models\\PrivateVanTour')"
          >
            Van Tours
          </p>
          <p
            class="cursor-pointer hover:text-[#FF613c]"
            @click="changeProductType('App\\Models\\Airline')"
          >
            AirLine
          </p>
          <p
            class="cursor-pointer hover:text-[#FF613c]"
            @click="changeProductType('App\\Models\\EntranceTicket')"
          >
            Attractions
          </p>
        </div>
      </div>
      <div class="flex justify-end items-center space-x-4">
        <CalendarDaysIcon
          class="w-6 h-6 cursor-pointer"
          @click="openModal = !openModal"
        />
        <div v-if="openModal">
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
    </div>

    <div class="overflow-auto">
      <table class="w-full px-4" v-if="!loading">
        <thead class="border-b-2 border-gray-200 bg-gray-50">
          <tr>
            <th class="w-20 p-3 text-xs font-medium tracking-wide text-left">
              P Type
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              P Name
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              Variation
            </th>

            <th class="p-3 text-xs font-medium tracking-wide text-right w-30">
              Quantity
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left w-30">
              Amount
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            class="bg-white even:bg-gray-50 hover:bg-gray-50"
            v-for="t in top_sell_list?.result"
            :key="t.id"
            @click="router.push(`/reservation/update/${t.id}/${t.crm_id}`)"
          >
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ t.product_type.split("\\")[2] }}
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ t.product_name }}
            </td>
            <td
              class="p-3 text-xs text-gray-700 whitespace-nowrap max-w-[250px] overflow-hidden"
            >
              {{ t.variation_name }}
            </td>

            <td class="p-3 text-xs text-gray-700 text-right whitespace-nowrap">
              {{ t.quantity }}
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ t.total_amount }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";
import { CalendarDaysIcon } from "@heroicons/vue/24/outline";
import { useHomeStore } from "../stores/home";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const router = useRouter();
const homeStore = useHomeStore();
const { top_sell_list, loading } = storeToRefs(homeStore);

const dateFilterRange = ref("");
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

const openModal = ref(false);
const toggleModal = () => {
  openModal.value = !openModal.value;
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

const product_type = ref("");

const changeProductType = (data) => {
  product_type.value = data;
};

const topSelling = async (date) => {
  let first = date[0];
  let second = date[1];
  console.log(dateFormat(first), "this is date", dateFormat(second));

  let data = {
    daterange: `${dateFormat(first)},${dateFormat(second)}`,
    limit: 10,
    product_type: product_type.value,
  };
  const res = await homeStore.topSellingProducts(data);
  console.log(top_sell_list.value, "this is top sale part");
};

onMounted(() => {
  dateFilterRange.value = [startOfMonth(new Date()), endOfMonth(new Date())];
  topSelling(dateFilterRange.value);
});

watch(dateFilterRange, async (newValue) => {
  if (dateFilterRange.value != "" && dateFilterRange.value != null) {
    topSelling(dateFilterRange.value);
  }
});
watch(product_type, async (newValue) => {
  if (dateFilterRange.value != "" && dateFilterRange.value != null) {
    topSelling(dateFilterRange.value);
  }
});
</script>
