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
    class="flex justify-center items-center gap-4 cursor-pointer py-5 pl-6 pr-16 rounded-lg"
    :class="isActive ? 'bg-[#FF5B00]' : 'bg-white'"
  >
    <!-- <HeartIcon class="w-8 h-8 p-2 bg-white rounded-lg" /> -->
    <component
      v-if="icon"
      :is="icon"
      class="w-10 h-10 p-2 rounded-lg"
      :class="isActive ? 'bg-white' : 'bg-[#FF5B00]/30 text-[#FF5B00]'"
    ></component>
    <div class="text-xs" :class="isActive ? 'text-white' : 'text-gray-900'">
      <p class="text-[10px]">{{ title }}</p>
      <p class="font-semibold text-xl">{{ amount }} %</p>
    </div>
  </div>
</template>
