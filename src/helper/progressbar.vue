<template>
  <div class="relative group">
    <div
      class="bg-[#FF613c] h-1.5 rounded-lg absolute top-0 z-10"
      :class="{
        'w-[16.67%]': rate == 1,
        'w-[33.33%]': rate == 2,
        'w-[50%]': rate == 3,
        'w-[66.67%]': rate == 4,
        'w-[83.33%]': rate == 5,
        'w-[100%]': rate == 6,
      }"
    ></div>
    <div class="w-full bg-gray-300 h-1.5 rounded-lg absolute top-0 z-0"></div>
    <p
      class="bg-[#FF613c] text-white group-hover:block hidden text-xs shadow absolute top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-lg border border-gray-200 z-0"
    >
      {{ status }}
    </p>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref, watch } from "vue";
import bookingstatus from "./bookingstatus";

const props = defineProps({
  rate: Number || String,
});

const status = ref("processing");

onMounted(() => {
  const foundStatus = bookingstatus.find((item) => item.value == props.rate);
  if (foundStatus) {
    status.value = foundStatus.name;
  }
});
</script>
