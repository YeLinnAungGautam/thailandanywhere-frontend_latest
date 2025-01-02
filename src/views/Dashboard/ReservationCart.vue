<template>
  <div class="px-4 pb-2 relative cursor-pointer" @click="open = !open">
    <div
      class="absolute top-[20px] left-3 rounded-full w-2 h-2"
      :class="backgroundCustom"
    ></div>
    <div class="pl-5 pt-2 pb-2 gap-y-4 gap-x-3">
      <div class="py-2 flex justify-start items-center gap-x-2">
        <p
          class="text-xs px-1 py-0.5 text-white inline-block rounded-lg"
          :class="backgroundCustom"
        >
          {{ data?.product_type.split("\\").pop() }}
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
      <div class="flex justify-start space-x-4 pt-2 items-center">
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="data?.booking?.payment_status == 'fully_paid'"
        >
          <CurrencyDollarIcon class="w-4 h-4 text-green-600" />
          <p class="text-[9px] text-green-600">Customer paid</p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="data?.booking?.payment_status == 'partially_paid'"
        >
          <CurrencyDollarIcon class="w-4 h-4 text-yellow-600" />
          <p class="text-[9px] text-yellow-600">C.partially paid</p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="data?.booking?.payment_status == 'not_paid'"
        >
          <CurrencyDollarIcon class="w-4 h-4 text-red-600" />
          <p class="text-[9px] text-red-600">C.not paid</p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="data?.payment_status == 'fully_paid'"
        >
          <CreditCardIcon class="w-4 h-4 text-green-600" />
          <p class="text-[9px] text-green-600">Expense paid</p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="data?.payment_status == 'partially_paid'"
        >
          <CreditCardIcon class="w-4 h-4 text-yellow-600" />
          <p class="text-[9px] text-yellow-600">E.partially paid</p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="data?.payment_status == 'not_paid'"
        >
          <CreditCardIcon class="w-4 h-4 text-red-600" />
          <p class="text-[9px] text-red-600">Expense not paid</p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="data?.reservation_status == 'confirmed'"
        >
          <CurrencyDollarIcon class="w-4 h-4 text-green-600" />
          <p class="text-[9px] text-green-600">Confirmation recieved</p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="data?.reservation_status == 'awaiting'"
        >
          <CurrencyDollarIcon class="w-4 h-4 text-yellow-600" />
          <p class="text-[9px] text-yellow-600">Confirmation awaiting</p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="data?.reservation_status == 'declined'"
        >
          <CurrencyDollarIcon class="w-4 h-4 text-red-600" />
          <p class="text-[9px] text-red-600">Confirmation not recieved</p>
        </div>
      </div>
    </div>
    <div class="absolute top-5 right-4">
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
    <div class="" v-if="open">
      <div class="flex justify-start items-center px-5 py-1 gap-x-2">
        <CheckCircleIcon class="w-4 h-4 text-green-600" />
        <p class="text-[10px] text-gray-600">detail 1</p>
      </div>
      <div class="flex justify-start items-center px-5 py-1 gap-x-2">
        <CheckCircleIcon class="w-4 h-4 text-green-600" />
        <p class="text-[10px] text-gray-600">detail 1</p>
      </div>
      <div class="flex justify-start items-center px-5 py-1 gap-x-2">
        <XMarkIcon class="w-4 h-4 text-red-600" />
        <p class="text-[10px] text-gray-600">detail 1</p>
      </div>
      <div class="flex justify-start items-center px-5 py-1 gap-x-2">
        <CheckCircleIcon class="w-4 h-4 text-green-600" />
        <p class="text-[10px] text-gray-600">detail 1</p>
      </div>
      <div class="flex justify-start items-center px-5 py-1 gap-x-2">
        <XMarkIcon class="w-4 h-4 text-red-600" />
        <p class="text-[10px] text-gray-600">detail 1</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
import {
  CurrencyDollarIcon,
  CreditCardIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";

const open = ref(false);

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
  }
};

const props = defineProps({
  backgroundCustom: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
});
</script>
