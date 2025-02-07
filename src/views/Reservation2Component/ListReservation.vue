<template>
  <div class="px-4 pb-2 relative cursor-pointer">
    <div
      class="absolute top-[36px] left-3 rounded-full w-2 h-2 bg-[#FF613c]"
    ></div>
    <div class="pl-5 pt-2 gap-y-4 gap-x-3">
      <div class="flex justify-between items-center">
        <div>
          <p
            class="text-[10px] space-x-1"
            v-if="data?.product_type != 'App\\Models\\Hotel'"
          >
            <span class="font-medium">{{ data?.service_date }}</span>
          </p>
          <p
            class="text-[10px] space-x-1"
            v-if="data?.product_type == 'App\\Models\\Hotel'"
          >
            <span class="font-medium"
              >{{ data?.checkin_date }} / {{ data?.checkout_date }}</span
            >
          </p>
        </div>
        <div class="">
          <div
            class="text-[10px] text-[#ff613c] space-x-1 flex justify-end items-center"
            v-if="data?.product_type != 'App\\Models\\Hotel'"
          >
            <p class="font-medium">E-{{ data?.cost_price * data?.quantity }}</p>

            <p class="font-medium" v-if="authStore.isSuperAdmin">
              : P-{{ data?.selling_price * data?.quantity }}
            </p>
            <p
              class="text-white bg-gray-800 px-1 rounded-md"
              v-if="data?.booking?.is_inclusive == 1"
            >
              Inclusive
            </p>
          </div>
          <p
            class="text-[10px] text-[#ff613c] space-x-1"
            v-if="data?.product_type == 'App\\Models\\Hotel'"
          >
            <span class="font-medium"
              >E-{{
                data?.cost_price *
                data?.quantity *
                daysBetween(data?.checkin_date, data?.checkout_date)
              }}</span
            >

            <span class="font-medium" v-if="authStore.isSuperAdmin"
              >: P-{{
                data?.selling_price *
                data?.quantity *
                daysBetween(data?.checkin_date, data?.checkout_date)
              }}</span
            >
          </p>
        </div>
      </div>
      <div class="py-2 flex justify-start items-center gap-x-2">
        <p
          class="text-xs px-1 py-0.5 text-white inline-block rounded-lg"
          :class="{
            'bg-blue-600': data.product_type === 'App\\Models\\EntranceTicket',
            'bg-green-600': data.product_type === 'App\\Models\\Hotel',
            'bg-yellow-600':
              data.product_type === 'App\\Models\\PrivateVanTour',
            'bg-red-600': data.product_type === 'App\\Models\\AirportPickup',
          }"
        >
          {{
            data?.product_type == "App\\Models\\EntranceTicket" ? "Ticket" : ""
          }}
          {{ data?.product_type == "App\\Models\\Hotel" ? "Hotel" : "" }}
          {{
            data?.product_type == "App\\Models\\PrivateVanTour" ? "Vantour" : ""
          }}
          {{
            data?.product_type == "App\\Models\\AirportPickup" ? "Pickup" : ""
          }}
        </p>
        <p
          class="text-xs bg-[#ff613c] px-1 py-0.5 text-white inline-block rounded-lg"
        >
          {{ data?.crm_id }}
        </p>
        <p
          class="text-xs bg-gray-600 px-1 py-0.5 text-white inline-block rounded-lg"
        >
          {{ data.customer_info?.name }}
        </p>
      </div>
      <div class="flex justify-between items-center">
        <p class="text-[14px] font-medium space-x-2 text-gray-900 line-clamp-1">
          <span>{{ data.product?.name }}</span>
          <span class="bg-gray-900 w-1 h-1 rounded-full inline-block"></span
          ><span v-if="data.product_type == 'App\\Models\\EntranceTicket'">{{
            data.variation?.name
          }}</span>
          <span v-if="data.product_type == 'App\\Models\\Hotel'">{{
            data.room?.name
          }}</span>
          <span v-if="data.product_type == 'App\\Models\\PrivateVanTour'">{{
            data.car?.name
          }}</span>
        </p>
        <p
          class="text-[10px] space-x-2 text-gray-500 whitespace-nowrap"
          v-if="data?.product_type == 'App\\Models\\Hotel'"
        >
          {{ data?.quantity }} rooms,
          {{ daysBetween(data?.checkin_date, data?.checkout_date) }} nights
        </p>
        <p
          class="text-[10px] space-x-2 text-gray-500 whitespace-nowrap"
          v-if="data?.product_type == 'App\\Models\\EntranceTicket'"
        >
          {{ data?.quantity }} tickets
        </p>
        <p
          class="text-[10px] space-x-2 text-gray-500 whitespace-nowrap"
          v-if="data?.product_type == 'App\\Models\\PrivateVanTour'"
        >
          {{ data?.quantity }} cars
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from "vue";
import {
  CurrencyDollarIcon,
  CreditCardIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilSquareIcon,
  TruckIcon,
} from "@heroicons/vue/24/solid";
import { useAuthStore } from "../../stores/auth";
import {
  PencilIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/vue/24/outline";

import { useReservationStore } from "../../stores/reservation";
import { useToast } from "vue-toastification";

const authStore = useAuthStore();
const toast = useToast();
const reservationStore = useReservationStore();
const props = defineProps(["data"]);

const daysBetween = (a, b) => {
  console.log(a, b);
  if (a && b) {
    const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const startDateTimestamp = new Date(a).getTime();
    const endDateTimestamp = new Date(b).getTime();
    let result = Math.abs(
      Math.round((endDateTimestamp - startDateTimestamp) / oneDay)
    );
    return result;
  } else {
    return 1;
  }
};

const formatDate = (date) => {
  const [datePart] = date.split(" ");
  const [day, month, year] = datePart.split("-");
  return `${day}/${month}/${year}`;
};
</script>
