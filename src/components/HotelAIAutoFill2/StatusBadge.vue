<template>
  <div>
    <span
      v-if="!field.extracted"
      class="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] whitespace-nowrap rounded-full font-medium"
    >
      No Data
    </span>
    <span
      v-else-if="hasChanged(field.extracted, field.current)"
      class="px-2 py-1 bg-orange-100 text-orange-700 text-[10px] whitespace-nowrap rounded-full font-medium"
    >
      🔄 Change
    </span>
    <span
      v-else
      class="px-2 py-1 bg-green-100 text-green-700 text-[10px] whitespace-nowrap rounded-full font-medium"
    >
      ✓ Same
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  field: Object,
});

const hasChanged = (newValue, oldValue) => {
  if (newValue === null || newValue === undefined || newValue === "")
    return false;
  if (oldValue === null || oldValue === undefined || oldValue === "")
    return true;
  return JSON.stringify(newValue) !== JSON.stringify(oldValue);
};
</script>
