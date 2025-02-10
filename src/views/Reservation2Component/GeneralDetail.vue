<template>
  <div class="space-y-3">
    <p class="font-medium pb-2">Payment Detail</p>
    <div class="flex justify-start items-center gap-x-3">
      <p
        class="text-xs px-3 py-0.5 inline-block text-white rounded-lg"
        :class="{
          'bg-green-500': detail?.payment_status == 'fully_paid',
          'bg-red-500': detail?.payment_status != 'fully_paid',
        }"
      >
        {{ detail?.payment_status }}
      </p>
      <p
        class="text-xs px-3 py-0.5 inline-block text-white rounded-lg bg-[#FF613c]"
      >
        {{ detail?.crm_id }}
      </p>
      <!-- <p
        class="text-xs px-3 py-0.5 inline-block text-white rounded-lg bg-[#FF613c]"
      >
        res code
      </p> -->
    </div>
    <div class="pt-2 grid grid-cols-4 gap-x-4">
      <div v-for="i in detail?.booking?.receipts ?? []" :key="i">
        <img :src="i?.image" class="w-full rounded-lg" alt="" />
        <p class="text-[12px] flex justify-start items-center pt-2">
          <img
            src="https://cdn-icons-png.flaticon.com/128/17763/17763038.png"
            alt=""
            class="w-4 h-4 mr-2"
          />
          {{ i?.amount }}
        </p>
        <p class="text-[12px] flex justify-start items-center">
          <img
            src="https://cdn-icons-png.flaticon.com/128/3652/3652191.png"
            alt=""
            class="w-4 h-4 mr-2"
          />{{ i?.created_at }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import invoice from "../../assets/invoice_exp.jpg";
import { defineProps } from "vue";

const props = defineProps({
  detail: Object,
});
</script>
