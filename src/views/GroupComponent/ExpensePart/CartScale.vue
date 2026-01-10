<template>
  <div
    @click="$emit('click')"
    class="bg-white rounded-xl group shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
    :class="isActive ? 'border-4' : 'border border-gray-100'"
    :style="isActive ? `border-color: ${borderColor}` : ''"
  >
    <!-- Header with gradient -->
    <div
      class="p-4"
      :style="`background: linear-gradient(to right, ${gradientFrom}, ${gradientTo})`"
    >
      <div class="flex items-center justify-between">
        <div class="group-hover:hidden">
          <p class="text-white text-sm font-medium opacity-90">
            {{ title }}
          </p>
          <div class="flex items-baseline gap-2 mt-2">
            <span class="text-3xl font-bold text-white">
              {{ currentValue }}
            </span>
            <span
              v-if="totalValue !== null"
              class="text-white text-lg opacity-75"
              >/</span
            >
            <span
              v-if="totalValue !== null"
              class="text-xl text-white opacity-90"
            >
              {{ totalValue }}
            </span>
          </div>
        </div>
        <div class="hidden group-hover:block">
          <p class="text-white text-sm font-medium pt-1.5 pb-5">
            {{ explain_text }}
          </p>
        </div>
        <div class="bg-white/20 p-3 rounded-full">
          <component :is="icon" class="w-8 h-8 text-white" />
        </div>
      </div>
    </div>

    <!-- Footer with progress -->
    <div class="p-4 bg-gray-50">
      <div class="flex items-center justify-between text-xs">
        <span class="text-gray-600">{{ footerLabel }}</span>
        <span class="font-semibold text-gray-900">{{ footerValue }}</span>
      </div>
      <div v-if="showProgress" class="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div
          class="h-2 rounded-full transition-all duration-500"
          :style="{
            width: progressWidth,
            backgroundColor: progressColor,
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  // Card identification
  isActive: {
    type: Boolean,
    default: false,
  },

  // Header content
  title: {
    type: String,
    required: true,
  },
  explain_text: {
    type: String,
    default: "",
  },
  currentValue: {
    type: [Number, String],
    default: 0,
  },
  totalValue: {
    type: [Number, String],
    default: null,
  },
  icon: {
    type: Object,
    required: true,
  },

  // Colors
  gradientFrom: {
    type: String,
    default: "#ca8a04", // yellow-600
  },
  gradientTo: {
    type: String,
    default: "#a16207", // yellow-700
  },
  borderColor: {
    type: String,
    default: "#ca8a04", // yellow-600
  },
  progressColor: {
    type: String,
    default: "#f97316", // orange-500
  },

  // Footer content
  footerLabel: {
    type: String,
    default: "Finish Rate",
  },
  footerValue: {
    type: String,
    default: "",
  },
  showProgress: {
    type: Boolean,
    default: true,
  },
  progressWidth: {
    type: String,
    default: "0%",
  },
});

defineEmits(["click"]);
</script>
