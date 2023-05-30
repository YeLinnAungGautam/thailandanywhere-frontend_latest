<template>
  <div class="w-screen h-screen flex">
    <!-- Sidebar -->
    <Sidebar />
    <!-- Main -->
    <div class="w-full h-full  bg-blue-500/5">
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
</script>

<style lang="scss" scoped></style>
