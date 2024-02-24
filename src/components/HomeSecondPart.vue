<script setup>
const props = defineProps({
  title: String,
  amount: String,
  icon: {
    type: [Object, Function],
  },
  isActive: Boolean,
});
</script>
<template>
  <div
    class="flex justify-center items-center gap-4 cursor-pointer py-3 px-4 rounded-lg"
    :class="isActive ? 'bg-[#FF5B00]' : 'bg-white'"
  >
    <!-- <HeartIcon class="w-8 h-8 p-2 bg-white rounded-lg" /> -->
    <component
      v-if="icon"
      :is="icon"
      class="w-8 h-8 p-2 rounded-lg"
      :class="isActive ? 'bg-white' : 'bg-[#FF5B00]/30 text-[#FF5B00]'"
    ></component>
    <div class="text-xs" :class="isActive ? 'text-white' : 'text-gray-900'">
      <p class="font-semibold">{{ amount }}</p>
      <p class="text-[10px]">{{ title }}</p>
    </div>
  </div>
</template>
