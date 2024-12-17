<script setup>
import { defineProps } from "vue";
const props = defineProps({
  formData: Object,
});
</script>
<template>
  <div class="bg-white relative h-[85vh]">
    <!-- image carousel -->
    <div
      class="w-full overflow-x-auto no-sidebar flex justify-start items-center"
    >
      <!-- images go here -->
      <div
        v-for="d in formData.details.length > 0 ? formData.details : []"
        class="min-w-[300px]"
        :key="d"
      >
        <img
          :src="d.image_url ? d.image_url : 'https://placehold.co/400'"
          alt="Product Image"
          class="w-full object-cover h-[200px]"
        />
      </div>
      <div v-if="formData.details.length == 0" class="min-w-[400px]">
        <img
          src="https://placehold.co/400"
          alt="Product Image"
          class="w-full object-cover h-[200px]"
        />
      </div>
    </div>
    <div class="flex justify-between items-center px-4 py-2">
      <p class="text-sm text-[#FF613c] font-medium">
        {{ formData.name ? formData.name : "Product Name" }}
      </p>
      <p class="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-lg">
        {{ formData.night ? formData.night : "-" }} Nights
        {{ formData.day ? formData.day : "-" }} Days
      </p>
    </div>
    <div
      class="w-full overflow-x-auto no-sidebar flex justify-start items-center"
    >
      <!-- images go here -->
      <div
        v-for="d in formData.details.length > 0 ? formData.details : []"
        class="min-w-[150px] pr-2"
        :key="d"
      >
        <img
          :src="d.image_url ? d.image_url : 'https://placehold.co/400'"
          alt="Product Image"
          class="w-full h-[100px] object-cover"
        />
        <p class="text-[12px] text-center line-clamp-1 whitespace-nowrap">
          Day {{ d?.day_name }}: {{ d?.title ? d.title : "missing title" }}
        </p>
      </div>
      <div v-if="formData.details.length == 0" class="min-w-[100px]">
        <img
          src="https://placehold.co/400"
          alt="Product Image"
          class="w-full object-cover h-[100px]"
        />
        <p class="text-[12px] text-center line-clamp-1 whitespace-nowrap">
          Day -: missing title
        </p>
      </div>
    </div>
    <!-- price -->
    <div
      class="sticky border-t border-gray-300 bg-white bottom-0 left-0 w-full z-30"
    >
      <div class="py-2">
        <div class="flex justify-between items-center px-2">
          <p class="text-[10px] bg-gray-100 px-2 py-0.5 rounded-lg font-medium">
            price per pax
          </p>
          <p class="text-[#FF613c] font-semibold">
            {{ formData.price ? formData.price : "-" }} thb
          </p>
        </div>
        <div class="flex justify-between items-center px-2 space-x-2 pt-2">
          <p
            class="text-center w-[90%] bg-yellow-400 text-xs text-white py-2 rounded-xl"
          >
            Add to Cart
          </p>
          <p
            class="text-center w-[90%] bg-orange-600 text-xs text-white py-2 rounded-xl"
          >
            Book now
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
