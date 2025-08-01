<template>
  <div class="w-full max-w-md mx-auto">
    <div v-if="isOpen" class="space-y-4">
      <div class="flex justify-between gap-4">
        <div class="relative flex-1">
          <span
            class="absolute text-gray-400 left-3 top-1/2 transform -translate-y-1/2"
            >$</span
          >
          <input
            type="number"
            class="w-[100px] pr-4 pl-8 py-1 text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-coral-500"
            v-model="minPrice"
            :min="rangeMin"
            :max="maxPrice - 1"
            @change="handleInputChange('min')"
          />
        </div>
        <div class="relative flex-1">
          <span
            class="absolute text-gray-400 left-3 top-1/2 transform -translate-y-1/2"
            >$</span
          >
          <input
            type="number"
            class="w-[100px] pr-4 pl-8 py-1 text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-coral-500"
            v-model="maxPrice"
            :min="minPrice + 1"
            :max="rangeMax"
            @change="handleInputChange('max')"
          />
        </div>
      </div>

      <div class="relative pt-2 pb-1">
        <!-- Track background -->
        <div class="absolute h-1 w-full bg-coral-100 rounded"></div>

        <!-- Active track -->
        <div
          class="absolute h-1 bg-coral-500 rounded"
          :style="{
            left: `${minPositionPercent}%`,
            width: `${maxPositionPercent - minPositionPercent}%`,
          }"
        ></div>

        <!-- Min thumb -->
        <div
          class="absolute w-5 h-5 -mt-2 -ml-3 bg-white border-2 border-coral-500 rounded-full cursor-pointer shadow"
          :style="{
            left: `${minPositionPercent}%`,
          }"
          @mousedown="startDrag($event, 'min')"
          @touchstart="startDrag($event, 'min')"
        ></div>

        <!-- Max thumb -->
        <div
          class="absolute w-5 h-5 -mt-2 -ml-3 bg-white border-2 border-coral-500 rounded-full cursor-pointer shadow"
          :style="{
            left: `${maxPositionPercent}%`,
          }"
          @mousedown="startDrag($event, 'max')"
          @touchstart="startDrag($event, 'max')"
        ></div>
      </div>

      <!-- <button
        class="w-full bg-coral-500 hover:bg-coral-600 text-xs text-white py-1.5 rounded-md transition-colors"
        @click="applyFilter"
      >
        Apply
      </button> -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";

// Props with default values
const props = defineProps({
  initialMin: {
    type: Number,
    default: 0,
  },
  initialMax: {
    type: Number,
    default: 10000,
  },
  rangeMin: {
    type: Number,
    default: 0,
  },
  rangeMax: {
    type: Number,
    default: 100000,
  },
  step: {
    type: Number,
    default: 1,
  },
  // Control the visual scale of the slider
  scaleType: {
    type: String,
    default: "log", // "linear" or "log"
    validator: (value) => ["linear", "log"].includes(value),
  },
  // For log scale, adjust this to control the curve
  logBase: {
    type: Number,
    default: 10,
  },
});

// Emit events to parent component
const emit = defineEmits(["update:min", "update:max", "apply"]);

// Component state
const isOpen = ref(true);
const minPrice = ref(props.initialMin);
const maxPrice = ref(props.initialMax);
const dragging = ref(null);

// Convert a value to its position percentage based on the scale type
const valueToPosition = (value) => {
  if (props.scaleType === "linear") {
    // Linear scale
    return ((value - props.rangeMin) / (props.rangeMax - props.rangeMin)) * 100;
  } else {
    // Logarithmic scale (with special handling for zero)
    // Add 1 to all values to handle zero gracefully
    const adjustedValue = Math.max(value, 1);
    const adjustedMin = Math.max(props.rangeMin, 1);
    const adjustedMax = Math.max(props.rangeMax, 2);

    const logValue = Math.log(adjustedValue) / Math.log(props.logBase);
    const logMin = Math.log(adjustedMin) / Math.log(props.logBase);
    const logMax = Math.log(adjustedMax) / Math.log(props.logBase);

    return ((logValue - logMin) / (logMax - logMin)) * 100;
  }
};

// Convert a position percentage to a value based on the scale type
const positionToValue = (position) => {
  const normalizedPosition = position / 100;

  if (props.scaleType === "linear") {
    // Linear scale
    return Math.round(
      props.rangeMin + normalizedPosition * (props.rangeMax - props.rangeMin)
    );
  } else {
    // Logarithmic scale
    const adjustedMin = Math.max(props.rangeMin, 1);
    const adjustedMax = Math.max(props.rangeMax, 2);

    const logMin = Math.log(adjustedMin) / Math.log(props.logBase);
    const logMax = Math.log(adjustedMax) / Math.log(props.logBase);

    const logValue = logMin + normalizedPosition * (logMax - logMin);
    return Math.round(Math.pow(props.logBase, logValue));
  }
};

// Computed positions for the slider thumbs and track
const minPositionPercent = computed(() => {
  return valueToPosition(minPrice.value);
});

const maxPositionPercent = computed(() => {
  return valueToPosition(maxPrice.value);
});

// Handle slider dragging
const startDrag = (event, handle) => {
  event.preventDefault();
  dragging.value = handle;

  // Add event listeners for mouse/touch movement
  window.addEventListener("mousemove", handleDrag);
  window.addEventListener("touchmove", handleDrag);
  window.addEventListener("mouseup", stopDrag);
  window.addEventListener("touchend", stopDrag);
};

const handleDrag = (event) => {
  if (!dragging.value) return;

  const sliderRect = event.target.parentElement.getBoundingClientRect();
  const sliderWidth = sliderRect.width;

  // Get position (handle touch and mouse events)
  const clientX = event.touches ? event.touches[0].clientX : event.clientX;
  let position = ((clientX - sliderRect.left) / sliderWidth) * 100;

  // Constrain position between 0 and 100
  position = Math.max(0, Math.min(100, position));

  // Calculate the new price based on position
  const newPrice = positionToValue(position);

  if (dragging.value === "min") {
    minPrice.value = Math.min(newPrice, maxPrice.value - props.step);
    emit("update:min", minPrice.value);
  } else {
    maxPrice.value = Math.max(newPrice, minPrice.value + props.step);
    emit("update:max", maxPrice.value);
  }
};

const stopDrag = () => {
  dragging.value = null;
  window.removeEventListener("mousemove", handleDrag);
  window.removeEventListener("touchmove", handleDrag);
  window.removeEventListener("mouseup", stopDrag);
  window.removeEventListener("touchend", stopDrag);
};

// Handle direct input changes
const handleInputChange = (type) => {
  if (type === "min") {
    minPrice.value = Number(minPrice.value);
    // Ensure min stays below max
    if (minPrice.value >= maxPrice.value) {
      minPrice.value = maxPrice.value - props.step;
    }
    emit("update:min", minPrice.value);
  } else {
    maxPrice.value = Number(maxPrice.value);
    // Ensure max stays above min
    if (maxPrice.value <= minPrice.value) {
      maxPrice.value = minPrice.value + props.step;
    }
    emit("update:max", maxPrice.value);
  }
};

const applyFilter = () => {
  emit("apply", { min: minPrice.value, max: maxPrice.value });
};

// Watch for prop changes
watch(
  () => props.initialMin,
  (newVal) => {
    minPrice.value = newVal;
  }
);

watch(
  () => props.initialMax,
  (newVal) => {
    maxPrice.value = newVal;
  }
);

// Clean up event listeners when component is destroyed
onUnmounted(() => {
  window.removeEventListener("mousemove", handleDrag);
  window.removeEventListener("touchmove", handleDrag);
  window.removeEventListener("mouseup", stopDrag);
  window.removeEventListener("touchend", stopDrag);
});
</script>

<style>
/* Define custom Tailwind colors if needed */
:root {
  --color-coral-100: #ffe8e0;
  --color-coral-500: #ff6347;
  --color-coral-600: #e5573e;
}

/* These classes are only needed if your Tailwind config doesn't include these colors */
.bg-coral-100 {
  background-color: var(--color-coral-100);
}
.bg-coral-500 {
  background-color: var(--color-coral-500);
}
.bg-coral-600 {
  background-color: var(--color-coral-600);
}
.text-coral-500 {
  color: var(--color-coral-500);
}
.border-coral-500 {
  border-color: var(--color-coral-500);
}
.focus\:ring-coral-500:focus {
  --tw-ring-color: var(--color-coral-500);
}
.hover\:bg-coral-600:hover {
  background-color: var(--color-coral-600);
}
</style>
