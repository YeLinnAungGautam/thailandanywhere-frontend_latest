<template>
  <router-link
    :to="to"
    :class="{
      'text-blue-800 bg-blue-500/10': isActive(),
    }"
    class="inline-flex rounded-md relative items-center py-[12px] px-[10px] w-full text-sm text-gray-600 font-roboto hover:text-blue-800 transition duration-150"
  >
    <component v-if="icon" :is="icon" class="w-4 h-4 mr-2"></component>
    {{ name }}
  </router-link>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import router from "../router";

const route = useRoute();

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
  activePaths: {
    type: Array,
    default: [],
  },
});

const isActive = () => {
  return (
    computed(() => props.activePaths.includes(route.name)).value ||
    props.to === route.path
  );
};
</script>

<style lang="scss" scoped></style>
