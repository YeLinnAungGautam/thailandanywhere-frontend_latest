<template>
  <div class="space-y-4">
    <div
      v-if="periods.length > 0"
      class="bg-purple-50 border-2 border-purple-200 rounded-lg p-4"
    >
      <h4 class="text-sm font-semibold text-purple-900 mb-3">
        📅 Pricing Periods ({{ periods.length }})
      </h4>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div
          v-for="(period, index) in periods"
          :key="index"
          class="bg-white rounded-lg p-3 border border-purple-200"
        >
          <div class="font-medium text-sm text-gray-900 mb-1">
            {{ period.period_name }}
          </div>
          <div class="text-xs text-gray-600 mb-2">
            {{ formatDate(period.start_date) }} →
            {{ formatDate(period.end_date) }}
          </div>
          <div class="grid grid-cols-3 gap-2 text-xs">
            <div>
              <span class="text-gray-500">Sale:</span>
              <p class="font-semibold text-green-600">
                {{ period.sale_price }}
              </p>
            </div>
            <div>
              <span class="text-gray-500">Cost:</span>
              <p class="font-semibold text-orange-600">
                {{ period.cost_price }}
              </p>
            </div>
            <div>
              <span class="text-gray-500">Agent:</span>
              <p class="font-semibold text-blue-600">
                {{ period.agent_price }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
    >
      <i class="fa-solid fa-calendar-xmark text-4xl text-gray-300 mb-2"></i>
      <p class="text-sm text-gray-600">No pricing periods defined</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  periods: {
    type: Array,
    default: () => [],
  },
});

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
</script>
