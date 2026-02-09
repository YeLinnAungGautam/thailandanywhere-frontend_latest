<template>
  <button
    @click="$emit('click')"
    :disabled="disabled"
    class="p-4 rounded-xl font-medium transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
    :class="selected ? selectedClass : defaultClass"
  >
    <div class="flex items-center gap-3">
      <span class="text-2xl">{{ icon }}</span>
      <div>
        <div class="font-bold">{{ title }}</div>
        <div class="text-xs opacity-80">{{ subtitle }}</div>
      </div>
    </div>
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  action: String, // 'create' or 'merge'
  selected: Boolean,
  disabled: Boolean,
});

defineEmits(["click"]);

const icon = computed(() => (props.action === "create" ? "➕" : "🔄"));
const title = computed(() =>
  props.action === "create" ? "Create New Room" : "Merge with Existing",
);
const subtitle = computed(() =>
  props.action === "create" ? "Add as new room type" : "Update existing room",
);

const selectedClass = computed(() => {
  return props.action === "create"
    ? "bg-green-600 text-white shadow-lg ring-2 ring-green-300"
    : "bg-blue-600 text-white shadow-lg ring-2 ring-blue-300";
});

const defaultClass =
  "bg-white border-2 border-gray-300 text-gray-700 hover:border-green-400";
</script>
