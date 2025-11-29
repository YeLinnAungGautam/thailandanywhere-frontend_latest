<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <p class="text-gray-500 text-sm font-medium mb-4">BOOKINGS</p>
    <div class="flex items-center space-x-2 justify-between">
      <div
        class="flex space-x-2 items-center"
        v-for="i in summary?.product_type_summary || []"
        :key="i"
      >
        <div class="text-center">
          <p class="text-base font-bold text-[#FF613c]">{{ i.count }}</p>
          <p class="text-[10px] text-gray-500 mt-1">
            {{ productType(i.product_type_name) }}
          </p>
        </div>
        <div class="w-1 h-1 rounded-full bg-black"></div>
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
      return "Cars";
    case "Entrance Ticket":
      return "Tickets";
    case "Hotel & Room":
      return "Hotels";
    case "Airline":
      return "Airlines";
    default:
      return "Inclu..";
  }
};
</script>
