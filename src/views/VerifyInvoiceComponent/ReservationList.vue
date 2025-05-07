<template>
  <div class="flex justify-between items-center">
    <div
      v-if="!loading"
      class="flex w-[70vw] justify-start items-center cursor-pointer overflow-x-scroll no-sidebar-container py-2 border-y border-gray-200"
    >
      <div
        v-for="i in lists?.data ?? []"
        :key="i"
        class="rounded-lg px-2 py-1 mx-1"
        :class="selectedItem == i.id ? 'bg-[#FF613c] text-white' : ''"
        @click="selectItem(i.id)"
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
    <div v-if="lists && !loading" class="">
      <PaginationExpense :data="lists" @change-page="changePage" />
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps, onMounted } from "vue";
import PaginationExpense from "../../components/PaginationVerify.vue";

const props = defineProps({
  lists: [Array || Object],
  loading: Boolean,
  selectedItem: [Number || String],
});
const emit = defineEmits(["change_url", "update:selectedItem"]);

const changePage = (url) => {
  emit("change_url", url);
  // console.log(url);
};

const selectItem = (item) => {
  emit("update:selectedItem", item);
};

onMounted(() => {
  console.log(props.lists);
});
</script>
