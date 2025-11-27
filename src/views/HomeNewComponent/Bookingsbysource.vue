<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <p class="text-gray-700 text-lg font-semibold mb-6">Bookings by Source</p>
    <div class="space-y-4">
      <div
        v-for="source in sourcesWithPercentage"
        :key="source.sold_from"
        class="flex items-center gap-3"
      >
        <span class="text-sm text-gray-700 w-24 text-right">{{
          source.sold_from
        }}</span>
        <div
          class="flex-1 bg-gray-200 rounded-full h-7 relative overflow-hidden"
        >
          <div
            class="h-full rounded-full transition-all duration-500"
            :style="{
              width: source.percentage + '%',
              backgroundColor: '#FF613c',
            }"
          ></div>
        </div>
        <span class="text-sm text-gray-600 w-16 text-right">
          {{ source.percentage.toFixed(1) }}%
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  sources: {
    type: Array,
    default: () => [],
  },
});

const sourcesWithPercentage = computed(() => {
  // Calculate total amount
  const total = props.sources.reduce(
    (sum, source) => sum + source.total_amount,
    0
  );

  // Calculate percentage for each source
  return props.sources.map((source) => ({
    ...source,
    percentage: total > 0 ? (source.total_amount / total) * 100 : 0,
  }));
});
</script>
