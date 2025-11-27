<template>
  <div class="bg-white rounded-lg shadow-sm p-6 h-[35vh] overflow-scroll">
    <p class="text-gray-700 text-lg font-semibold mb-4">Top Sales Reps</p>
    <div class="space-y-3">
      <div
        v-for="(rep, index) in salesReps"
        :key="index"
        class="flex items-center justify-between py-2"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-medium"
          >
            {{ rep.initials }}
          </div>
          <span class="text-gray-700 text-sm font-medium">{{ rep.name }}</span>
        </div>
        <span> ฿{{ rep.amount.toLocaleString() }} </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
const props = defineProps({
  salesReps: {
    type: Array,
    default: () => [
      { name: "Somchai P.", amount: 340000, initials: "SP" },
      { name: "Narat S.", amount: 280000, initials: "NS" },
      { name: "Kanya M.", amount: 250000, initials: "KM" },
    ],
  },
});
</script>
