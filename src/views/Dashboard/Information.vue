<template>
  <div class="divide-y-4 divide-gray-200">
    <div class="p-3">
      <div class=" ">
        <div class="text-xs font-medium flex justify-between items-center">
          <p>Reservations</p>
          <p
            class="text-xs w-2 h-2 mr-2 inline-block rounded-lg"
            :class="backgroundCustom"
          ></p>
        </div>
      </div>
      <p
        class="font-semibold text-2xl pt-2"
        :class="loading ? 'animate-bounce' : ''"
      >
        {{ loading ? "..." : reservationTotal }}
      </p>
    </div>
    <div class="p-3">
      <div class=" ">
        <div class="text-xs font-medium flex justify-between items-center">
          <p>Expense</p>
          <p
            class="text-xs w-2 h-2 mr-2 inline-block rounded-lg"
            :class="backgroundCustom"
          ></p>
        </div>
      </div>
      <p
        class="font-semibold text-2xl pt-2"
        :class="loading ? 'animate-bounce' : ''"
      >
        {{ loading ? "..." : expense }}
        <span class="text-lg">/{{ loading ? "..." : reservationTotal }}</span>
      </p>
    </div>
    <div class="p-3">
      <div class=" ">
        <div class="text-xs font-medium flex justify-between items-center">
          <p>Booking receipt</p>
          <p
            class="text-xs w-2 h-2 mr-2 inline-block rounded-lg"
            :class="backgroundCustom"
          ></p>
        </div>
      </div>
      <p
        class="font-semibold text-2xl pt-2"
        :class="loading ? 'animate-bounce' : ''"
      >
        {{ loading ? "..." : booking_receipt }}
        <span class="text-lg">/{{ loading ? "..." : reservationTotal }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ChevronDownIcon } from "@heroicons/vue/24/outline";
import { ref, defineProps, watch, defineEmits } from "vue";
import { useReservationStore } from "../../stores/reservation";
import { storeToRefs } from "pinia";

const reservationStore = useReservationStore();
const { reservation, loading } = storeToRefs(reservationStore);

const props = defineProps({
  selectedDay: {
    type: String,
    required: true,
  },
  backgroundCustom: {
    type: String,
    required: true,
  },
  reservationTotal: {
    type: Number,
    required: true,
  },
  expense: {
    type: Number,
    required: true,
  },
  booking_receipt: {
    type: Number,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
});

watch(
  () => props.selectedDay,
  (value) => {
    // getReservationList(value);
    console.log(value);
  }
);
</script>
