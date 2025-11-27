<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <p class="text-gray-700 text-lg font-semibold mb-6">Receiable Bookings</p>
    <div class="space-y-3">
      <div
        v-for="(booking, index) in bookings"
        :key="index"
        class="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
      >
        <div>
          <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">
            BOOKING
          </p>
          <p class="text-sm font-medium text-gray-900">
            {{ booking.destination }}
          </p>
        </div>
        <div class="text-right">
          <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Receiable
          </p>
          <div class="flex gap-0.5">
            <span class="text-sm font-semibold text-gray-900">฿</span>
            <span class="text-sm font-semibold text-gray-900">{{
              booking?.receiable?.toLocaleString()
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  bookings: {
    type: Array,
    default: () => [
      { destination: "Customer 1", receiable: 4000 },
      { destination: "Customer 2", receiable: 4000 },
      { destination: "Customer 3", receiable: 5000 },
    ],
  },
});
</script>
