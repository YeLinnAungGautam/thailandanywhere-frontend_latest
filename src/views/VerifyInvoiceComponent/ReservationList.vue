<template>
  <div class="flex justify-between items-center relative">
    <div
      v-if="!loading"
      class="flex w-[70vw] justify-start items-center cursor-pointer overflow-x-scroll no-sidebar-container py-2 border-y border-gray-200"
      ref="scrollContainer"
    >
      <div
        v-for="(i, index) in lists?.data ?? []"
        :key="i.id"
        class="rounded-lg px-2 py-1 mx-1"
        :class="selectedItem == i.id ? 'bg-[#FF613c] text-white' : ''"
        @click="selectItem(i.id)"
        :ref="
          (el) => {
            if (selectedItem == i.id) currentItemRef = el;
          }
        "
      >
        <p class="whitespace-nowrap text-xs">{{ i.crm_id }}</p>
      </div>
    </div>
    <div
      v-if="loading"
      class="flex w-[80vw] text-xs justify-center items-center overflow-x-scroll no-sidebar-container py-2 border-y border-gray-200"
    >
      loading please wait ...
    </div>
    <div class="flex justify-end items-center gap-x-4" v-if="!loading">
      <button
        class="bg-[#FF613c] w-8 rounded-full h-8 flex justify-center items-center"
        @click="selectPreviousItem"
      >
        <ChevronLeftIcon class="w-4 h-4 text-white" />
      </button>
      <button
        class="bg-[#FF613c] w-8 rounded-full h-8 flex justify-center items-center"
        @click="selectNextItem"
      >
        <ChevronRightIcon class="w-4 h-4 text-white" />
      </button>
    </div>

    <div v-if="lists && !loading" class="absolute -bottom-12 right-0">
      <PaginationExpense :data="lists" @change-page="changePage" />
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps, onMounted, ref, computed } from "vue";
import PaginationExpense from "../../components/PaginationVerify.vue";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  lists: [Array || Object],
  loading: Boolean,
  selectedItem: [Number || String],
});

const emit = defineEmits(["change_url", "update:selectedItem"]);
const scrollContainer = ref(null);
const currentItemRef = ref(null);

// Get the index of the currently selected item
const currentIndex = computed(() => {
  if (!props.lists?.data) return -1;
  return props.lists.data.findIndex((item) => item.id === props.selectedItem);
});

// Select previous item
const selectPreviousItem = () => {
  if (!props.lists?.data || props.lists.data.length === 0) return;

  const currentIdx = currentIndex.value;
  if (currentIdx > 0) {
    // Select the previous item
    const prevItem = props.lists.data[currentIdx - 1];
    selectItem(prevItem.id);

    // Scroll to the selected item if needed
    setTimeout(() => {
      if (currentItemRef.value) {
        scrollToItem(currentItemRef.value);
      }
    }, 10);
  }
};

// Select next item
const selectNextItem = () => {
  if (!props.lists?.data || props.lists.data.length === 0) return;

  const currentIdx = currentIndex.value;
  if (currentIdx < props.lists.data.length - 1) {
    // Select the next item
    const nextItem = props.lists.data[currentIdx + 1];
    selectItem(nextItem.id);

    // Scroll to the selected item if needed
    setTimeout(() => {
      if (currentItemRef.value) {
        scrollToItem(currentItemRef.value);
      }
    }, 10);
  }
};

// Helper function to scroll to element
const scrollToItem = (element) => {
  if (!scrollContainer.value) return;

  const container = scrollContainer.value;
  const scrollLeft = container.scrollLeft;
  const containerWidth = container.clientWidth;
  const elementLeft = element.offsetLeft;
  const elementWidth = element.clientWidth;

  // If element is not fully visible, scroll to it
  if (
    elementLeft < scrollLeft ||
    elementLeft + elementWidth > scrollLeft + containerWidth
  ) {
    container.scrollTo({
      left: elementLeft - containerWidth / 2 + elementWidth / 2,
      behavior: "smooth",
    });
  }
};

const changePage = (url) => {
  emit("change_url", url);
};

const selectItem = (item) => {
  emit("update:selectedItem", item);
};

onMounted(() => {
  console.log(props.lists);

  // Scroll to the initially selected item if it exists
  setTimeout(() => {
    if (currentItemRef.value) {
      scrollToItem(currentItemRef.value);
    }
  }, 100);
});
</script>

<style scoped>
.no-sidebar-container::-webkit-scrollbar {
  display: none;
}
.no-sidebar-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
