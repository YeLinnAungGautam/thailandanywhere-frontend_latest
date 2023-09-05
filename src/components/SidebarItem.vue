<template>
  <router-link
    :to="to"
    :class="{
      'text-[#FF5B00] bg-[#FF5B00]/10': isActive(),
      'text-gray-600 bg-[#ffede3]': !isActive(),
    }"
    class="inline-flex mb-1 shadow-sm text-[.75rem] rounded-md relative items-center py-[12px] px-[10px] w-full text-sm font-roboto hover:text-[#FF5B00] hover:bg-[rgb(255, 91, 0, 0.1) transition duration-150"
  >
    <component v-if="icon" :is="icon" class="w-4 h-4 mr-[1.2rem]"></component>
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
