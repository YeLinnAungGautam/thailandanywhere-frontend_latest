<template>
  <div class="space-y-3">
    <p>Payment Detail</p>
    <div class="flex justify-start items-center gap-x-3">
      <p
        class="text-xs px-3 py-0.5 inline-block text-white rounded-lg bg-green-600"
      >
        fully paid
      </p>
      <p
        class="text-xs px-3 py-0.5 inline-block text-white rounded-lg bg-[#FF613c]"
      >
        HN-2561_001
      </p>
      <!-- <p
        class="text-xs px-3 py-0.5 inline-block text-white rounded-lg bg-[#FF613c]"
      >
        res code
      </p> -->
    </div>
    <div class="pt-2 grid grid-cols-4 gap-x-4">
      <div v-for="i in 3" :key="i">
        <img :src="invoice" class="w-full rounded-lg" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup>
import invoice from "../../assets/invoice_exp.jpg";
</script>
