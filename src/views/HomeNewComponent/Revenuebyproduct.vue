<template>
  <div
    class="bg-white rounded-lg h-[39vh] overflow-scroll shadow-sm px-6 pt-6 pb-8"
  >
    <p class="text-gray-500 text-sm font-medium mb-6">REVENUE BY PRODUCT</p>
    <div class="space-y-4">
      <div v-for="product in revenueData?.product_type_summary" :key="product">
        <div class="flex justify-between items-center mb-1">
          <span class="text-sm text-gray-700">{{
            productType(product.product_type_name)
          }}</span>
          <span class="text-sm font-medium text-gray-900"
            >{{ product.percentage }}%</span
          >
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="h-2 rounded-full transition-all duration-300"
            :style="{
              width: product.percentage + '%',
              backgroundColor: '#FF613c',
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  revenueData: {
    type: Array,
    default: () => [],
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
