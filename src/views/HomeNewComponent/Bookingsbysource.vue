<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <p class="text-gray-700 text-lg font-semibold mb-6">Bookings by Source</p>
    <div class="space-y-4">
      <div
        v-for="source in sources"
        :key="source.name"
        class="flex items-center gap-3"
      >
        <span class="text-sm text-gray-700 w-24 text-right">{{
          source.name
        }}</span>
        <div
          class="flex-1 bg-gray-200 rounded-full h-7 relative overflow-hidden"
        >
          <div
            class="h-full rounded-full transition-all duration-500"
            :style="{
              width: source.percentage + '%',
              backgroundColor: source.color,
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  sources: {
    type: Array,
    default: () => [
      { name: "Website", percentage: 65, color: "#FF6300" },
      { name: "Facebook", percentage: 50, color: "#FF6300" },
      { name: "LINE", percentage: 35, color: "#FF6300" },
      { name: "Phone", percentage: 25, color: "#FF6300" },
    ],
  },
});
</script>
