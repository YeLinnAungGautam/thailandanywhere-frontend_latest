<template>
  <div class="bg-white rounded-lg shadow-sm px-6 pt-6 pb-8">
    <p class="text-gray-500 text-sm font-medium mb-6">REVENUE BY PRODUCT</p>
    <div class="space-y-4">
      <div v-for="product in products" :key="product.name">
        <div class="flex justify-between items-center mb-1">
          <span class="text-sm text-gray-700">{{ product.name }}</span>
          <span class="text-sm font-medium text-gray-900"
            >{{ product.percentage }}%</span
          >
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="h-2 rounded-full transition-all duration-300"
            :style="{
              width: product.percentage + '%',
              backgroundColor: product.color,
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  products: {
    type: Array,
    default: () => [
      { name: "Hotels", percentage: 0, color: "#ff6300" },
      { name: "Tours", percentage: 0, color: "#ff6300" },
      { name: "Tickets", percentage: 0, color: "#ff6300" },
      { name: "Packages", percentage: 0, color: "#ff6300" },
    ],
  },
});
</script>
