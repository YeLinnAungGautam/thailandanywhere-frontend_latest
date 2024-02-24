<script setup>
const props = defineProps({
  title: String,
  isActive: Boolean,
});
</script>
<template>
  <div>
    <div class="flex justify-center items-center gap-2 cursor-pointer">
      <p class="bg-[#FF5B00] w-1.5 h-1.5 rounded-full" v-if="isActive"></p>
      <p
        class="text-sm font-semibold hover:text-[#FF5B00]"
        :class="isActive ? 'text-[#FF5B50]' : 'text-gray-500'"
      >
        {{ title }}
      </p>
    </div>
  </div>
</template>
