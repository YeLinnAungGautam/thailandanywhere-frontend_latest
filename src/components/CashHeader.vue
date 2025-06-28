<script setup>
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
</script>

<template>
  <div class="mb-4 flex justify-start space-x-4 overflow-hidden uppercase">
    <div
      @click="router.push('/cash_book')"
      class="col-span-1 text-center text-sm cursor-pointer rounded-lg px-6 font-medium py-2"
      :class="
        route.name == 'cashBook'
          ? 'bg-[#FF613c] text-white'
          : 'text-gray-500 border border-gray-300'
      "
    >
      Cash Book
    </div>
    <div
      @click="router.push('/cash_structure')"
      class="col-span-1 text-center text-sm cursor-pointer rounded-lg px-6 font-medium py-2"
      :class="
        route.name == 'cashStructure'
          ? 'bg-[#FF613c] text-white'
          : 'text-gray-500 border border-gray-300'
      "
    >
      Cash Structure
    </div>
  </div>
</template>
