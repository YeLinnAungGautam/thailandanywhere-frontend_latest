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
            ฿{{ bookingData?.average_grand_total || "0" }}
          </p>
        </div>
      </div>

      <div class="pt-2">
        <div class="text-right space-y-2">
          <p class="text-sm font-medium text-gray-700">
            Period : {{ bookingData?.period }}
          </p>
          <p class="text-xs text-gray-500">
            Bookings : {{ bookingData?.total_bookings }}
          </p>
          <p class="text-xs text-gray-500">
            Booking Items : {{ bookingData?.total_booking_items }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  bookingData: {
    type: Object,
    default: () => ({}),
  },
});
</script>
