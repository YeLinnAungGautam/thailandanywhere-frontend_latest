<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <p class="text-gray-500 text-sm font-medium mb-4">BOOKINGS</p>
    <div class="flex items-center justify-between">
      <div class="text-center">
        <p class="text-3xl font-bold text-gray-900">{{ tours }}</p>
        <p class="text-xs text-gray-500 mt-1">Tours</p>
      </div>
      <div class="text-center">
        <p class="text-3xl font-bold text-gray-900">{{ tickets }}</p>
        <p class="text-xs text-gray-500 mt-1">Tickets</p>
      </div>
      <div class="text-center">
        <p class="text-3xl font-bold text-gray-900">{{ packages }}</p>
        <p class="text-xs text-gray-500 mt-1">Packages</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  tours: {
    type: Number,
    default: 0,
  },
  tickets: {
    type: Number,
    default: 0,
  },
  packages: {
    type: Number,
    default: 0,
  },
});
</script>
