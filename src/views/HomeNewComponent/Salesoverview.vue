<template>
  <div class="bg-white rounded-lg shadow-sm pt-6 pb-10 px-6 col-span-2">
    <div class="flex justify-between items-center mb-4">
      <p class="text-gray-700 text-base font-semibold">Sales Overview</p>
      <slot />
    </div>
    <div class="relative h-64">
      <!-- Y-axis labels -->
      <div
        class="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500"
      >
        <span>฿ {{ maxValue.toLocaleString() }}</span>
        <span>฿ {{ Math.round(maxValue * 0.75).toLocaleString() }}</span>
        <span>฿ {{ Math.round(maxValue * 0.5).toLocaleString() }}</span>
        <span>฿ {{ Math.round(maxValue * 0.25).toLocaleString() }}</span>
        <span>0</span>
      </div>

      <!-- Chart area -->
      <div class="ml-20 h-full relative">
        <!-- Grid lines -->
        <div class="absolute inset-0 flex flex-col justify-between">
          <div class="border-t border-gray-200"></div>
          <div class="border-t border-gray-200"></div>
          <div class="border-t border-gray-200"></div>
          <div class="border-t border-gray-200"></div>
          <div class="border-t border-gray-200"></div>
        </div>

        <!-- SVG Chart -->
        <svg
          class="w-full h-full"
          viewBox="0 0 560 240"
          preserveAspectRatio="none"
        >
          <!-- Area fill gradient -->
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop
                offset="0%"
                style="stop-color: #ff613c; stop-opacity: 0.3"
              />
              <stop
                offset="100%"
                style="stop-color: #ff613c; stop-opacity: 0"
              />
            </linearGradient>
          </defs>

          <!-- Area fill -->
          <path :d="areaPath" fill="url(#areaGradient)" />

          <!-- Average line (red dashed) -->
          <line
            :x1="0"
            :y1="averageLineY"
            :x2="560"
            :y2="averageLineY"
            stroke="#EF4444"
            stroke-width="2"
            stroke-dasharray="5,5"
            opacity="0.8"
          />

          <!-- Sales line (cyan) -->
          <polyline
            :points="linePoints"
            fill="none"
            stroke="#FF613c"
            stroke-width="3"
          />

          <!-- Data points -->
          <circle
            v-for="(point, i) in chartPoints"
            :key="i"
            :cx="point.x"
            :cy="point.y"
            r="4"
            fill="#FF613c"
            stroke="white"
            stroke-width="2"
            class="hover:r-6 transition-all cursor-pointer"
            @mouseenter="hoveredPoint = i"
            @mouseleave="hoveredPoint = null"
          >
            <title>Day {{ i + 1 }}: ฿{{ salesData[i].toLocaleString() }}</title>
          </circle>
        </svg>

        <!-- Hover tooltip -->
        <div
          v-if="hoveredPoint !== null"
          class="absolute bg-gray-900 text-white px-3 py-2 rounded-lg text-xs pointer-events-none z-10"
          :style="{
            left: (chartPoints[hoveredPoint].x / 560) * 100 + '%',
            top: (chartPoints[hoveredPoint].y / 240) * 100 + '%',
            transform: 'translate(-50%, -120%)',
          }"
        >
          <div class="font-semibold">Day {{ hoveredPoint + 1 }}</div>
          <div>฿{{ salesData[hoveredPoint].toLocaleString() }}</div>
        </div>

        <!-- X-axis labels (showing every 5 days) -->
        <div
          class="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-gray-500"
        >
          <span v-for="day in xAxisLabels" :key="day">{{ day }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  salesData: {
    type: Array,
    default: () => [
      45000, 52000, 48000, 61000, 58000, 63000, 59000, 67000, 71000, 68000,
      74000, 78000, 82000, 79000, 85000, 88000, 92000, 89000, 95000, 98000,
      94000, 102000, 105000, 108000, 112000, 115000, 118000, 122000, 125000,
      130000,
    ],
  },
  averageValue: {
    type: Number,
    default: 80000,
  },
});

const hoveredPoint = ref(null);

// Calculate max value for Y-axis scaling (ensure average line is visible)
const maxValue = computed(() => {
  const dataMax = Math.max(...props.salesData);
  const max = Math.max(dataMax, props.averageValue);
  // Round up to nearest 50000 for cleaner axis labels
  return Math.ceil(max / 20000) * 20000;
});

// Generate chart points based on sales data
const chartPoints = computed(() => {
  const points = [];
  const width = 560;
  const height = 240;
  const spacing = width / (props.salesData.length - 1);

  props.salesData.forEach((value, index) => {
    const x = index * spacing;
    // Invert Y (SVG coords) and scale based on maxValue
    const y = height - (value / maxValue.value) * height;
    points.push({ x, y });
  });

  return points;
});

// Generate polyline points string
const linePoints = computed(() => {
  return chartPoints.value.map((p) => `${p.x},${p.y}`).join(" ");
});

// Generate area path (includes bottom edge for fill)
const areaPath = computed(() => {
  const points = chartPoints.value;
  let path = `M ${points[0].x} ${points[0].y}`;

  // Add all points
  points.forEach((p, i) => {
    if (i > 0) path += ` L ${p.x} ${p.y}`;
  });

  // Close the path at bottom
  path += ` L 560 240 L 0 240 Z`;
  return path;
});

// Calculate Y position for average line
const averageLineY = computed(() => {
  const height = 240;
  return height - (props.averageValue / maxValue.value) * height;
});

// X-axis labels (every 5 days + day 30)
const xAxisLabels = computed(() => {
  const labels = [];
  for (let i = 1; i <= 30; i += 5) {
    labels.push(i);
  }
  if (labels[labels.length - 1] !== 30) {
    labels.push(30);
  }
  return labels;
});
</script>
