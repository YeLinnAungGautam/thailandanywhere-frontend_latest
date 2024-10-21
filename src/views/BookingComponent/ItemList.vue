<script setup>
import { TrashIcon, PencilSquareIcon } from "@heroicons/vue/24/outline";
</script>
<template>
  <div class="relative">
    <h1
      class="sticky top-0 bg-white z-10 py-2 text-xs font-medium text-[#ff613c]"
    >
      Added items (10)
    </h1>
    <div class="space-y-3 divide-y-2 pb-3 divide-gray-200">
      <div
        class="flex justify-start items-start gap-x-2 pt-3"
        v-for="i in 2"
        :key="i"
      >
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRe9T8SKEUfmlT126AsItTHDRjLChxgPq7wwA&s"
          class="w-16 h-16 rounded-lg"
          alt=""
        />
        <div class="w-full space-y-0.5">
          <div class="flex justify-between items-center">
            <p class="text-xs font-medium">Sea Life Tickets</p>
            <div class="flex justify-end items-center gap-x-2">
              <PencilSquareIcon class="w-4 h-4 cursor-pointer text-blue-800" />
              <TrashIcon class="w-4 h-4 cursor-pointer text-red-800" />
            </div>
          </div>
          <p class="text-[10px] pt-1">Standard Ticket</p>
          <div class="flex justify-between items-center">
            <p class="text-[10px]">4-1-2025</p>
            <p class="text-[10px]">
              Amount : <span class="font-medium text-sm">4800 ฿</span>
            </p>
          </div>
          <div class="flex justify-between items-center">
            <p class="text-[10px]">4 x 1200 ฿</p>
            <p class="text-[10px]">
              Discount : <span class="font-medium text-xs">100 ฿</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
