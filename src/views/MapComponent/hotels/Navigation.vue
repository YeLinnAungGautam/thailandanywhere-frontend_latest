<template>
  <div
    class="w-full relative overflow-x-auto scroll-container bg-white border-b border-gray-200"
  >
    <div
      class="flex justify-between items-center text-xs relative min-w-full px-4 py-3"
    >
      <div
        ref="navItem"
        class="flex-1 text-center relative cursor-pointer hover:text-[#FF613c] transition-colors duration-200 py-2"
        @click="setPart('detail')"
        :class="part == 'detail' ? 'text-[#FF613c]' : 'text-gray-600'"
      >
        <span class="text-xs font-medium whitespace-nowrap">Detail</span>
      </div>

      <div
        ref="navItem"
        class="flex-1 text-center relative cursor-pointer hover:text-[#FF613c] transition-colors duration-200 py-2"
        @click="setPart('rooms')"
        :class="part == 'rooms' ? 'text-[#FF613c]' : 'text-gray-600'"
      >
        <span class="text-xs font-medium whitespace-nowrap">Rooms</span>
      </div>

      <!-- Animated sliding underline -->
      <div
        class="absolute bottom-0 h-0.5 bg-[#FF613c] transition-all duration-300 ease-in-out"
        :style="underlineStyle"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";

// Define props to accept initial part value from parent
const props = defineProps({
  modelValue: {
    type: String,
    default: "detail",
  },
});

// Use modelValue from props or default to 'detail'
const part = ref(props.modelValue);

// Define emits for proper v-model support
const emit = defineEmits(["update:modelValue", "partChanged"]);

// Navigation items configuration
const navItems = [
  { key: "detail", label: "Detail" },
  { key: "rooms", label: "Rooms" },
];

// Ref for the container to calculate positions
const navContainer = ref(null);

// Computed style for the sliding underline
const underlineStyle = computed(() => {
  const activeIndex = navItems.findIndex((item) => item.key === part.value);
  const totalItems = navItems.length;

  if (activeIndex === -1) return { width: "0px", left: "0px" };

  // Calculate width and position
  const itemWidth = 100 / totalItems; // Percentage width per item
  const leftPosition = activeIndex * itemWidth;

  return {
    width: `${itemWidth}%`,
    left: `${leftPosition}%`,
  };
});

// Function to set the active part and emit changes
const setPart = (p) => {
  part.value = p;
  emit("update:modelValue", p); // For v-model support
  emit("partChanged", p); // Additional custom event
};

// Watch for changes in modelValue prop to sync with parent
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== part.value) {
      part.value = newValue;
    }
  }
);
</script>

<style scoped>
.scroll-container {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}

.scroll-container::-webkit-scrollbar {
  display: none; /* WebKit */
}
</style>
