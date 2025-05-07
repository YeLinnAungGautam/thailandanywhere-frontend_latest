<template>
  <div
    class="flex w-[90vw] justify-start items-center overflow-x-scroll no-sidebar-container py-2 border-y border-gray-200"
  >
    <div
      v-for="i in 20 ?? []"
      :key="i"
      class="rounded-lg px-2 py-1 mx-1"
      :class="i == 2 ? 'bg-[#FF613c] text-white' : ''"
    >
      <p class="whitespace-nowrap text-xs">HN-{{ i }}00</p>
    </div>
  </div>
</template>

<script setup></script>
