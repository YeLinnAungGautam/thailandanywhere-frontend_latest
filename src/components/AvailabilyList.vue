<script setup>
import {
  PencilSquareIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckBadgeIcon,
} from "@heroicons/vue/24/outline";
import { ref } from "vue";

const showList = ref(false);
</script>

<template>
  <div class="divide-y-2 divide-y-gray-600">
    <div
      class="grid grid-cols-5 gap-0 text-xs px-4 py-3 even:bg-gray-50 hover:bg-gray-50"
      :class="showList == true ? 'bg-gray-50' : 'bg-white'"
    >
      <p class="flex justify-start items-center">Product Type</p>
      <p class="flex justify-start items-center col-span-2">Product Name</p>
      <p class="flex justify-start items-center">Quantities</p>
      <div class="flex items-center justify-end gap-2">
        <!-- <button
          @click="showList = !showList"
          class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-blue-500 hover:text-white"
        >
          <ChevronDownIcon class="w-5 h-5" v-if="!showList" />
          <ChevronUpIcon class="w-5 h-5" v-if="showList" />
        </button> -->

        <!-- <button
          class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
        >
          <PencilSquareIcon class="w-5 h-5" />
        </button> -->

        <button
          @click.prevent="onDeleteHandler()"
          class="hover:bg-red-500 p-2 bg-white text-blue-500 transition shadow rounded hover:text-white"
        >
          <TrashIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>
