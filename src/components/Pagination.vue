<template>
  <div class="flex items-center justify-between mb-5" v-if="data">
    <div class="">
      <nav class="inline-flex gap-3 w-full" aria-label="Pagination">
        <button
          v-for="page in pages"
          :key="page"
          @click.prevent="changePage(page.url)"
          aria-current="page"
          :disabled="!page.url"
          :class="[
            page.active ? 'bg-[#ff613c] text-white' : 'bg-white text-[#ff613c]',
            !page.url ? 'bg-gray-100 border-none text-gray-500' : '',
          ]"
          class="relative z-10 inline-flex items-center w-10 h-10 justify-center text-xs rounded-full font-medium focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {{ page.label }}
        </button>
      </nav>
    </div>
    <div>
      <p class="inline-block mr-2 text-gray-500 text-xs font-medium">
        Showing {{ data.meta.from }} to {{ data.meta.to }} of
        {{ data.meta.total }} records
      </p>
    </div>
  </div>
</template>

<script setup>
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
import axios from "axios";
import { computed } from "vue";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["changePage"]);

const pages = computed(() => {
  return props.data?.meta.links.map((page) => {
    let label = page.label;
    if (label === "&laquo; Previous") {
      label = "<";
    }
    if (label === "Next &raquo;") {
      label = ">";
    }
    return { ...page, label: label };
  });
});
console.log("🚀 ~ file: Pagination.vue:54 ~ pages ~ pages:", pages.value);
const changePage = async (url) => {
  emit("changePage", url);
};
</script>

<style lang="scss" scoped></style>
