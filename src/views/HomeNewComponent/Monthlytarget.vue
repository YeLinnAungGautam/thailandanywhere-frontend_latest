<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <p class="text-gray-500 text-sm font-medium mb-4">TARGET</p>
    <div class="mb-4">
      <div class="w-full bg-gray-200 rounded-full h-3">
        <div
          class="bg-gradient-to-r from-orange-400 to-red-600 h-3 rounded-full transition-all duration-300"
          :style="{ width: copercentage + '%' }"
        ></div>
      </div>
    </div>
    <div class="flex items-baseline gap-2">
      <span class="text-4xl font-bold text-gray-900">{{ percentage }}%</span>
      <div class="w-full bg-gray-200 rounded-full h-3">
        <div
          class="bg-gradient-to-r from-orange-400 to-red-600 h-3 rounded-full transition-all duration-300"
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
