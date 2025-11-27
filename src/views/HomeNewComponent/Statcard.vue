<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <p class="text-gray-500 text-sm font-medium mb-4">{{ title }}</p>
    <p class="text-3xl font-bold text-gray-900">{{ value }}</p>
    <p class="text-xs mt-1 text-gray-900">no include airline</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number],
});
</script>
