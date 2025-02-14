<template>
  <router-link
    :to="to"
    :class="{
      'text-white bg-[#FF5B00]': isActive(),
      'text-gray-600 bg-white': !isActive(),
    }"
    class="inline-flex mb-1 text-[10px] rounded-xl relative items-center py-[12px] px-[10px] w-full text-sm font-roboto hover:text-[#FF5B00] hover:bg-[#FF5B00]/20 transition duration-150"
  >
    <component v-if="icon" :is="icon" class="w-4 h-4"></component>
    <p
      v-show="isShowSidebar"
      class="transition-all text-[12px] ml-[1.2rem] duration-150"
    >
      {{ name }}
    </p>
    <!-- <p v-show="!isShowSidebar">.</p> -->
  </router-link>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import router from "../router";
import { useSidebarStore } from "../stores/sidebar";
import { storeToRefs } from "pinia";
const sidebarStore = useSidebarStore();
const { isShowSidebar } = storeToRefs(sidebarStore);

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
