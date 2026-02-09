<template>
  <span :class="['px-1.5 py-0.5 text-xs rounded font-semibold', badgeClass]">
    {{ badgeText }}
  </span>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  status: String, // 'pending', 'processing', 'success', 'skipped', 'error'
});

const badgeClass = computed(() => {
  switch (props.status) {
    case "success":
      return "bg-green-100 text-green-700";
    case "skipped":
      return "bg-orange-100 text-orange-700";
    case "error":
      return "bg-red-100 text-red-700";
    case "processing":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
});

const badgeText = computed(() => {
  switch (props.status) {
    case "success":
      return "✓ Saved";
    case "skipped":
      return "⊘ Skipped";
    case "error":
      return "✗ Error";
    case "processing":
      return "⋯ Processing";
    default:
      return "○ Pending";
  }
});
</script>
