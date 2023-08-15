<template>
  <router-link
    :to="to"
    active-class="text-blue-800 bg-blue-500/10"
    class="inline-flex rounded-md relative items-center py-[12px] px-[10px] w-full text-sm text-gray-600 font-roboto  hover:text-blue-800 transition duration-150"
  >
    <component v-if="icon" :is="icon" class="w-4 h-4 mr-2"></component>
    {{ name }}
  </router-link>
</template>

<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: [Object, Function],
  },
  to: {
    type: String,
    required: true,
    default: "/",
  },
});
</script>

<style lang="scss" scoped></style>
