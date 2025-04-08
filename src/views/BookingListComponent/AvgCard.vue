<template>
  <div>
    <div
      class="bg-white border-l-4 border-[#FF613c] shadow gap-x-4 rounded-r-lg px-4 py-2 flex justify-between items-center"
    >
      <div class="space-y-2">
        <p class="text-xs">{{ title }}</p>
        <p class="text-2xl text-black font-semibold">
          {{ is_value ? "฿" : "" }} {{ value }}
        </p>
      </div>
      <img
        v-if="is_show"
        src="https://cdn-icons-png.flaticon.com/128/12546/12546298.png"
        alt=""
        class="w-10 h-10"
      />
      <div class="w-10 h-10" v-if="!is_show"></div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  title: { type: String, required: true },
  value: { type: [Number, String], required: true },
  is_value: { type: Boolean, default: false },
  is_show: { type: Boolean, default: false },
});
</script>
