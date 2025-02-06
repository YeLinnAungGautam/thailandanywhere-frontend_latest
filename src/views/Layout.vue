<template>
  <div class="relative flex min-h-screen">
    <!-- Sidebar -->
    <Sidebar />
    <!-- Main -->
    <div
      class="w-full h-full"
      :class="is_white ? 'bg-[#FDFDFD]' : 'bg-gray-100'"
    >
      <Topbar :title="title" />
      <div class="h-[calc(100vh-80px)] px-[20px] overflow-y-auto py-[20px]">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from "../components/Sidebar.vue";
import Topbar from "../components/Topbar.vue";

const props = defineProps({
  title: String,
  is_white: Boolean,
});
</script>

<style></style>
