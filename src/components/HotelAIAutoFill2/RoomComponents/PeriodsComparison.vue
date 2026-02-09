<template>
  <div class="space-y-4">
    <div class="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
      <div class="flex justify-between items-center mb-3">
        <h4 class="text-sm font-semibold text-purple-900">
          📅 Pricing Periods Comparison
        </h4>
        <span class="text-xs text-purple-700 font-medium">
          ⚠️ AI periods will replace all existing periods
        </span>
      </div>

      <!-- Current Periods -->
      <div v-if="current.length > 0" class="mb-4">
        <p class="text-xs font-semibold text-gray-600 mb-2">
          Current Periods ({{ current.length }}):
        </p>
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="(period, index) in current"
            :key="'current-' + index"
            class="bg-white rounded-lg p-2 border border-gray-200 opacity-60"
          >
            <div class="font-medium text-xs text-gray-700 mb-1">
              {{ period.period_name }}
            </div>
            <div class="text-xs text-gray-500">
              {{ formatDate(period.start_date) }} →
              {{ formatDate(period.end_date) }}
            </div>
            <div class="grid grid-cols-3 gap-1 text-xs mt-1">
              <div>
                <span class="text-gray-500">Sale:</span> {{ period.sale_price }}
              </div>
              <div>
                <span class="text-gray-500">Cost:</span> {{ period.cost_price }}
              </div>
              <div>
                <span class="text-gray-500">Agent:</span>
                {{ period.agent_price }}
              </div>
            </div>
            <div class="text-xs text-red-600 font-medium mt-1">
              Will be replaced ✗
            </div>
          </div>
        </div>
      </div>

      <!-- AI Extracted Periods -->
      <div v-if="extracted.length > 0">
        <p class="text-xs font-semibold text-purple-700 mb-2">
          New AI Periods ({{ extracted.length }}):
        </p>
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="(period, index) in extracted"
            :key="'extracted-' + index"
            class="bg-purple-100 rounded-lg p-2 border-2 border-purple-300"
          >
            <div class="font-medium text-xs text-purple-900 mb-1">
              {{ period.period_name }}
            </div>
            <div class="text-xs text-purple-700">
              {{ formatDate(period.start_date) }} →
              {{ formatDate(period.end_date) }}
            </div>
            <div class="grid grid-cols-3 gap-1 text-xs mt-1">
              <div>
                <span class="text-purple-600">Sale:</span>
                <span class="font-semibold text-green-600">{{
                  period.sale_price
                }}</span>
              </div>
              <div>
                <span class="text-purple-600">Cost:</span>
                <span class="font-semibold text-orange-600">{{
                  period.cost_price
                }}</span>
              </div>
              <div>
                <span class="text-purple-600">Agent:</span>
                <span class="font-semibold text-blue-600">{{
                  period.agent_price
                }}</span>
              </div>
            </div>
            <div class="text-xs text-green-600 font-medium mt-1">
              Will be saved ✓
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  current: {
    type: Array,
    default: () => [],
  },
  extracted: {
    type: Array,
    default: () => [],
  },
});

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};
</script>
