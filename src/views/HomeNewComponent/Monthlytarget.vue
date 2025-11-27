<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <p class="text-gray-500 text-sm font-medium mb-4">COMPANY TARGET</p>
    <div class="mb-4">
      <div class="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
        <!-- Base bar (0-100%) - Orange/Red -->
        <div
          class="absolute left-0 top-0 h-3 rounded-full transition-all duration-300 bg-gradient-to-r from-orange-400 to-red-600"
          :style="{ width: Math.min(copercentage, 100) + '%' }"
        ></div>
        <!-- Overflow bar (100%+) - Green -->
        <div
          v-if="copercentage > 100"
          class="absolute left-0 top-0 h-3 rounded-full transition-all duration-300 bg-gradient-to-r from-green-400 to-green-600"
          :style="{ width: copercentage + '%' }"
        ></div>
      </div>
    </div>
    <p class="text-gray-500 text-sm font-medium mb-4">PERSONAL TARGET</p>
    <div class="flex items-baseline gap-2">
      <div class="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
        <!-- Base bar (0-100%) - Orange/Red -->
        <div
          class="absolute left-0 top-0 h-3 rounded-full transition-all duration-300 bg-gradient-to-r from-orange-400 to-red-600"
          :style="{ width: Math.min(percentage, 100) + '%' }"
        ></div>
        <!-- Overflow bar (100%+) - Green -->
        <div
          v-if="percentage > 100"
          class="absolute left-0 top-0 h-3 rounded-full transition-all duration-300 bg-gradient-to-r from-green-400 to-green-600"
          :style="{ width: percentage + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  percentage: {
    type: Number,
    default: 72,
  },
  copercentage: {
    type: Number,
    default: 72,
  },
});
</script>
