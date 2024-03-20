<script setup>
import HomeSecondPartVue from "../HomeSecondPart.vue";
import {
  HeartIcon,
  ExclamationCircleIcon,
  PuzzlePieceIcon,
  BanknotesIcon,
  BriefcaseIcon,
} from "@heroicons/vue/24/outline";
import { useCarBookingStore } from "../../stores/carbooking";
import { ref } from "vue";
import Pagination from "../Pagination.vue";

const assignModalOpen = ref(false);
const carBookingStore = useCarBookingStore();

const props = defineProps({
  list: Object,
  loading: Boolean,
});
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-start items-center space-x-3 col-span-3">
      <HomeSecondPartVue
        :icon="HeartIcon"
        :title="'Total Bookings'"
        :amount="list?.summary?.total_booking"
        :isActive="true"
      />
      <HomeSecondPartVue
        :icon="PuzzlePieceIcon"
        :title="'Total Sales'"
        :amount="list?.summary?.total_sales"
        :isActive="false"
      />
      <HomeSecondPartVue
        :icon="BanknotesIcon"
        :title="'Total Cost'"
        :amount="list?.summary?.total_cost"
        :isActive="false"
      />
      <HomeSecondPartVue
        :icon="BriefcaseIcon"
        :title="'Balance'"
        :amount="list?.summary?.total_balance"
        :isActive="false"
      />
    </div>
    <div class="overflow-auto rounded-lg shadow mb-5" v-if="!loading">
      <table class="w-full">
        <thead class="bg-gray-50 border-b-2 border-gray-200">
          <tr>
            <th class="px-4 py-2 text-xs font-medium tracking-wide text-left">
              CRM.ID
            </th>
            <th class="px-4 py-2 text-xs font-medium tracking-wide text-left">
              Service Date
            </th>
            <th class="px-4 py-2 text-xs font-medium tracking-wide text-left">
              Product Name
            </th>
            <th class="px-4 py-2 text-xs font-medium tracking-wide text-left">
              Variation
            </th>
            <th class="px-4 py-2 text-xs font-medium tracking-wide text-left">
              Payment
            </th>
            <th class="px-4 py-2 text-xs font-medium tracking-wide text-left">
              Payment Method
            </th>
            <th class="px-4 py-2 text-xs font-medium tracking-wide text-left">
              Price
            </th>
            <th class="px-4 py-2 text-xs font-medium tracking-wide text-left">
              Extras
            </th>
            <th class="px-4 py-2 text-xs font-medium tracking-wide text-left">
              Cost
            </th>
            <th class="px-4 py-2 text-xs font-medium tracking-wide text-left">
              Balance
            </th>
            <th
              class="px-4 py-2 text-xs font-medium tracking-wide text-left"
            ></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            class="bg-white even:bg-gray-50 hover:bg-gray-50"
            v-for="l in list?.data"
            :key="l"
          >
            <td class="p-4 text-xs text-gray-700 whitespace-nowrap">1234</td>
            <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
              1-1-2024
            </td>
            <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
              Test Name
            </td>
            <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
              Test Name
            </td>
            <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
              Test Name
            </td>
            <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
              Test Name
            </td>
            <td class="p-4 text-xs text-gray-700 whitespace-nowrap">20</td>
            <td class="p-4 text-xs text-gray-700 whitespace-nowrap">20</td>
            <td class="p-4 text-xs text-gray-700 whitespace-nowrap">20</td>
            <td class="p-4 text-xs text-gray-700 whitespace-nowrap">3000</td>
            <td
              class="p-4 text-xs text-gray-700 whitespace-nowrap flex justify-center items-center gap-4"
            >
              <ExclamationCircleIcon class="w-5 h-5 cursor-pointer" />
              <button
                class="bg-[#FF5B00] text-white px-4 text-xs py-1 rounded-lg hover:shadow-md"
              >
                edit
              </button>
            </td>
          </tr>
          <tr class="">
            <td colspan="10 " class="text-center py-5">
              Ohh ! there isn't data !
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="px-4">
      <Pagination v-if="!loading" :data="list" @change-page="changePage" />
    </div>
  </div>
</template>
