<template>
  <div class="flex items-center justify-between mb-5">
    <div class="">
      <nav class="inline-flex gap-3 w-full" aria-label="Pagination">
        <a
          href="#"
          class="relative inline-flex items-center rounded-full px-2 text-sm tracking-wide py-2 text-gray-400 border border-gray-400 hover:text-white hover:bg-blue-600 focus:z-20 focus:outline-offset-0"
        >
          <span>
            <ChevronLeftIcon class="w-4 h-4" />
          </span>
        </a>
        <!-- Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900  hover:bg-gray-50 focus:outline-offset-0" -->
        <a
          href="#"
          aria-current="page"
          class="relative z-10 inline-flex items-center bg-blue-500 px-4 text-xs rounded-full font-medium text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >1</a
        >
        <a
          href="#"
          class="relative z-10 inline-flex items-center px-4 text-sm rounded-full font-medium text-gray-600 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >2</a
        >
        <a
          href="#"
          class="relative z-10 inline-flex items-center px-4 text-sm rounded-full font-medium text-gray-600 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >3</a
        >
        <span
          class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 focus:outline-offset-0"
          >...</span
        >
        <a
          href="#"
          class="relative z-10 inline-flex items-center px-4 text-sm rounded-full font-medium text-gray-600 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >8</a
        >
        <a
          href="#"
          class="relative inline-flex items-center rounded-full px-2 text-sm tracking-wide py-2 text-gray-400 border border-gray-400 hover:text-white hover:bg-blue-600 focus:z-20 focus:outline-offset-0"
        >
          <span>
            <ChevronRightIcon class="w-4 h-4" />
          </span>
        </a>
      </nav>
    </div>
    <div>
      <!-- <p class="inline-block mr-2 text-gray-500 font-medium">
        Showing 1 to 10 of 97 results
      </p> -->
    </div>
  </div>
</template>

<script setup>
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
</script>

<style lang="scss" scoped></style>
