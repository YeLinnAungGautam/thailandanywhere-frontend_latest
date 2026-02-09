<template>
  <span
    :class="[
      'px-1.5 py-0.5 text-xs rounded',
      action === 'create'
        ? 'bg-green-100 text-green-700'
        : 'bg-blue-100 text-blue-700',
    ]"
  >
    {{ action === "create" ? "➕ New" : "🔄 Merge" }}
  </span>
</template>

<script setup>
defineProps({
  action: String, // 'create' or 'merge'
});
</script>
