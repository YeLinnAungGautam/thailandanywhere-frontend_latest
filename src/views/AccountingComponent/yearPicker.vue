<!-- YearPicker.vue -->
<template>
  <div class="year-picker">
    <select
      v-model="selectedYear"
      class="rounded-lg px-3 py-2 text-xs focus:outline-none border border-gray-400/20"
      @change="emitYearChange"
    >
      <option v-for="year in years" :key="year" :value="year">
        {{ year }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const props = defineProps({
  initialYear: {
    type: Number,
    default: () => new Date().getFullYear(),
  },
  yearRange: {
    type: Number,
    default: 10,
  },
});

const emit = defineEmits(["year-change"]);

const selectedYear = ref(props.initialYear);

// Generate array of years from current year - yearRange to current year + yearRange
const years = computed(() => {
  const currentYear = new Date().getFullYear();
  const start = currentYear - props.yearRange;
  const end = currentYear + props.yearRange;

  const yearArray = [];
  for (let year = start; year <= end; year++) {
    yearArray.push(year);
  }

  return yearArray;
});

const emitYearChange = () => {
  emit("year-change", selectedYear.value);
};

onMounted(() => {
  // Emit initial year on mount
  emitYearChange();
});
</script>
