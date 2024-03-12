<template>
  <div>
    <div
      class="text-sm flex justify-between cursor-pointer items-center px-4 py-2 hover:bg-gray-100 rounded-md"
      @click="show = !show"
    >
      <div class="flex justify-start items-center gap-4">
        <img
          src="https://img.freepik.com/free-psd/3d-illustration-person_23-2149436182.jpg?t=st=1709107594~exp=1709111194~hmac=719ca64b61d1a37f5d78b41a7b08ae7ebcc1a32aa8a5ca144d29b607535ab609&w=740"
          class="w-14 h-14 rounded-full"
          alt=""
        />
        <div>
          <p class="text-xs font-semibold">{{ data?.agent_name }}</p>
          <p class="text-xs text-gray-800">{{ data.total_booking }} Booking</p>
        </div>
      </div>

      <p
        class="text-[#FF5B00] text-sm flex justify-end font-semibold items-center gap-3"
        v-if="data.total_balance"
      >
        {{ data.total_balance }} thb
        <ChevronDownIcon class="w-4 h-4" />
      </p>
    </div>
    <div
      class="px-4 py-2 bg-gray-50 text-sm rounded-md space-y-2 divide-y-2 divide-y-gray-400"
      v-if="show"
    >
      <p class="text-xs font-semibold text-center">Show Sale Not Fully Paid</p>
      <div
        v-for="(l, index) in data.booking_infos"
        :key="index"
        @click="router.push('/bookings/update/' + l.id + '/edit')"
        class="cursor-pointer hover:bg-orange-100/50 px-2 pt-2 text-xs flex justify-between items-center"
      >
        <div class="space-y-1">
          <p>{{ l.customer_name }}</p>
          <p class="text-[10px] text-orange-500">{{ l.crm_id }}</p>
        </div>
        <p class="text-sm text-black font-semibold">{{ l.balance_due }} THB</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";

const router = useRouter();

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const show = ref(false);
</script>
