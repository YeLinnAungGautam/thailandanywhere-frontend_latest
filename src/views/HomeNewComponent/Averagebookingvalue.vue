<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <p class="text-gray-700 text-lg font-semibold mb-6">
      AVERAGE BOOKING VALUE
    </p>
    <div class="space-y-4">
      <div
        class="flex items-center justify-between py-3 border-b border-gray-100"
      >
        <div>
          <p class="text-2xl font-bold text-gray-900">
            ฿{{ value.toLocaleString() }}
          </p>
        </div>
        <div class="text-right">
          <p class="text-sm font-medium text-gray-700">{{ customerName }}</p>
          <p class="text-xs text-gray-500">{{ location }}</p>
        </div>
      </div>

      <div class="pt-2">
        <div class="flex items-center gap-3 mb-3">
          <span class="text-sm text-gray-600">International</span>
          <span class="text-sm font-medium text-gray-900">Customer</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600">Chiang Mai</span>
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-gray-900">Daneit L.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  value: {
    type: Number,
    default: 0,
  },
  customerName: {
    type: String,
    default: "Customer Name",
  },
  location: {
    type: String,
    default: "Chiang Mai",
  },
});
</script>
