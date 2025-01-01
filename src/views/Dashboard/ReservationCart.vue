<template>
  <div class="px-4 pb-2 relative cursor-pointer" @click="open = !open">
    <div
      class="absolute top-[20px] left-3 rounded-full w-2 h-2"
      :class="backgroundCustom"
    ></div>
    <div class="pl-5 pt-2 pb-2 gap-y-4 gap-x-3">
      <div class="py-2 flex justify-start items-center gap-x-1">
        <p
          class="text-xs bg-[#ff613c] px-1 py-0.5 text-white inline-block rounded-lg"
        >
          CM-01010
        </p>
        <p
          class="text-xs bg-gray-600 ml-2 px-1 py-0.5 text-white inline-block rounded-lg"
        >
          Customer Name
        </p>
      </div>
      <div class="flex justify-between items-center">
        <p class="text-[14px] font-medium space-x-2 text-gray-900">
          <span>Berkley Hotel</span>
          <span class="bg-gray-900 w-1 h-1 rounded-full inline-block"></span
          ><span>Superior room</span>
        </p>
        <p class="text-[10px] space-x-2 text-gray-500">3 rooms, 2 nights</p>
      </div>
      <div class="flex justify-start space-x-4 pt-2 items-center">
        <div class="flex justify-start space-x-1 items-center">
          <CurrencyDollarIcon class="w-4 h-4 text-green-600" />
          <p class="text-[9px] text-green-600">Customer paid</p>
        </div>
        <div class="flex justify-start space-x-1 items-center">
          <CreditCardIcon class="w-4 h-4 text-yellow-600" />
          <p class="text-[9px] text-yellow-600">Expense not paid</p>
        </div>
        <div class="flex justify-start space-x-1 items-center">
          <CurrencyDollarIcon class="w-4 h-4 text-red-600" />
          <p class="text-[9px] text-red-600">Confirmation not recieved</p>
        </div>
      </div>
    </div>
    <div class="absolute top-5 right-4">
      <p class="text-[10px] space-x-1">
        <span class="font-medium">12-1-2024</span>
        <span class="bg-[#ff613c] w-1 h-1 rounded-full inline-block"></span>
        <span class="font-medium">10-2-2024</span>
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

const props = defineProps({
  backgroundCustom: {
    type: String,
    required: true,
  },
});
</script>
