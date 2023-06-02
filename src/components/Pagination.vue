<template>
  <div class="flex items-center justify-between mb-5">
    <div>
      <p class="inline-block mr-2 text-gray-500 font-medium">
        Showing 1 to 10 of 97 results
      </p>
    </div>
    <div class="">
      <nav
        class="inline-flex rounded-md shadow-md w-full"
        aria-label="Pagination"
      >
        <a
          href="#"
          class="relative inline-flex items-center rounded-l-md px-2 text-sm tracking-wide py-2 text-gray-400 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        >
          <span>Previous</span>
        </a>
        <!-- Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900  hover:bg-gray-50 focus:outline-offset-0" -->
        <a
          href="#"
          aria-current="page"
          class="relative z-10 inline-flex items-center bg-blue-500 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >1</a
        >
        <a
          href="#"
          class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          >2</a
        >
        <a
          href="#"
          class="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
          >3</a
        >
        <span
          class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 focus:outline-offset-0"
          >...</span
        >
        <a
          href="#"
          class="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
          >8</a
        >
        <a
          href="#"
          class="relative inline-flex items-center text-sm rounded-r-md px-2 py-2 text-gray-400 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        >
          <span >Next</span>
        </a>
      </nav>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
