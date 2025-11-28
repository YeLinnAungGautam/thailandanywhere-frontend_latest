<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <p class="text-gray-500 text-sm font-medium mb-4">BOOKINGS</p>
    <div class="flex items-center justify-between">
      <div
        class="text-center"
        v-for="i in summary?.product_type_summary || []"
        :key="i"
      >
        <p class="text-xl font-bold text-[#FF613c]">{{ i.count }}</p>
        <p class="text-[10px] text-gray-500 mt-1">
          {{ productType(i.product_type_name) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  summary: {
    type: Object,
    default: () => ({}),
  },
});

const productType = (type) => {
  switch (type) {
    case "Private Van Tour":
      return "Tours";
    case "Entrance Ticket":
      return "Tickets";
    case "Hotel & Room":
      return "Hotels";
    case "Airline":
      return "Airlines";
    default:
      return "Inclusive";
  }
};
</script>
