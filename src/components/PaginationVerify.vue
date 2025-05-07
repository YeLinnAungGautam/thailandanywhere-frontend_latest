<template>
  <div class="flex items-center justify-between" v-if="data">
    <div class="flex items-center gap-4">
      <nav class="inline-flex gap-2 w-full" aria-label="Pagination">
        <!-- Left arrow -->
        <button
          @click.prevent="goToPreviousPage"
          :disabled="!hasPreviousPage"
          :class="[!hasPreviousPage ? 'opacity-50 cursor-not-allowed' : '']"
          class="relative z-10 inline-flex items-center w-8 h-8 justify-center text-xs rounded-full font-medium bg-[#ff613c] text-white border border-[#ff613c] focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Pre
        </button>

        <!-- Current page indicator -->
        <div class="flex items-center px-3 text-xs text-gray-700">
          {{ currentPage }} / {{ totalPages }} Pages
        </div>

        <!-- Right arrow -->
        <button
          @click.prevent="goToNextPage"
          :disabled="!hasNextPage"
          :class="[
            !hasNextPage
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-[#ff613c] hover:text-white',
          ]"
          class="relative z-10 inline-flex items-center w-8 h-8 justify-center text-xs rounded-full font-medium bg-[#ff613c] text-white border border-[#ff613c] focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Nxt
        </button>
      </nav>
    </div>
    <div>
      <p class="inline-block ml-4 text-gray-500 text-xs font-medium">
        {{ data.meta.total }} Invoices
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["changePage"]);

const currentPage = computed(() => props.data?.meta.current_page);
const totalPages = computed(() => props.data?.meta.last_page);
const hasPreviousPage = computed(() => props.data?.meta.current_page > 1);
const hasNextPage = computed(
  () => props.data?.meta.current_page < props.data?.meta.last_page
);

const goToPreviousPage = () => {
  if (hasPreviousPage.value) {
    const prevPage = currentPage.value - 1;
    emit("changePage", props.data?.meta.path + "?page=" + prevPage);
  }
};

const goToNextPage = () => {
  if (hasNextPage.value) {
    const nextPage = currentPage.value + 1;
    emit("changePage", props.data?.meta.path + "?page=" + nextPage);
  }
};
</script>

<style lang="scss" scoped></style>
