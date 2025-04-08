<template>
  <div class="w-full max-w-md mx-auto">
    <!-- Date picker content -->
    <div v-if="isOpen">
      <!-- Input field -->
      <div class="relative mb-4">
        <input
          type="text"
          class="w-full pl-10 pr-4 py-1.5 text-xs border border-coral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-coral-500 text-gray-500"
          :value="getDisplayValue()"
          readonly
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      <!-- Calendar -->
      <div v-if="showCalendar" class="mb-4">
        <!-- Month navigation -->
        <div class="flex items-center justify-between mb-4">
          <button
            class="p-1 hover:bg-gray-100 rounded-full"
            @click="previousMonth"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div class="text-gray-700 font-medium">
            {{ formatYearMonth(currentYear, currentMonth) }}
          </div>
          <button class="p-1 hover:bg-gray-100 rounded-full" @click="nextMonth">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <!-- Days of week -->
        <div class="grid grid-cols-7 gap-1 mb-2">
          <div
            v-for="day in daysOfWeek"
            :key="day"
            class="text-center text-[10px] text-coral-500 font-medium"
          >
            {{ day }}
          </div>
        </div>

        <!-- Calendar days -->
        <div class="grid grid-cols-7 gap-1">
          <div
            v-for="(date, index) in calendarDays"
            :key="index"
            class="text-center py-2 text-[12px] font-medium relative"
            :class="[
              date.month !== 'current' ? 'text-gray-300' : 'text-gray-600',
              getDateClass(date.date),
              date.month === 'current'
                ? 'hover:bg-gray-100 rounded-full cursor-pointer'
                : '',
            ]"
            @click="date.month === 'current' ? handleDateClick(date.date) : null"
          >
            {{ date.day }}
            <!-- Today indicator dot -->
            <div
              v-if="isToday(date.date)"
              class="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-coral-500 rounded-full"
            ></div>
          </div>
        </div>
      </div>

      <!-- Selection type toggle -->
      <div class="flex mb-4 space-x-2">
        <button
          class="flex-1 py-1.5 text-xs rounded-md transition-colors"
          :class="selectionMode === 'single' ? 'bg-coral-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          @click="setSelectionMode('single')"
        >
          Single Date
        </button>
        <button
          class="flex-1 py-1.5 text-xs rounded-md transition-colors"
          :class="selectionMode === 'range' ? 'bg-coral-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          @click="setSelectionMode('range')"
        >
          Date Range
        </button>
      </div>

      <!-- Clear button -->
      <button
        class="w-full bg-coral-500 hover:bg-coral-600 text-white py-1.5 text-xs rounded-md transition-colors"
        @click="clearSelection"
      >
        Clear All
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

// Props
const props = defineProps({
  modelValue: {
    type: [Date, Object],
    default: null,
  },
  mode: {
    type: String,
    default: 'single', // 'single' or 'range'
    validator: (value) => ['single', 'range'].includes(value)
  }
});

// Emits
const emit = defineEmits(["update:modelValue"]);

// Component state
const isOpen = ref(true);
const showCalendar = ref(true);
const selectionMode = ref(props.mode);
const selectedDate = ref(null);
const startDate = ref(null);
const endDate = ref(null);
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth());
const selectingSecondDate = ref(false);

// Initialize from props
const initializeFromProps = () => {
  if (props.modelValue) {
    if (selectionMode.value === 'single' && props.modelValue instanceof Date) {
      selectedDate.value = props.modelValue;
    } else if (selectionMode.value === 'range' && typeof props.modelValue === 'object') {
      startDate.value = props.modelValue.start || null;
      endDate.value = props.modelValue.end || null;
      selectingSecondDate.value = startDate.value && !endDate.value;
    }
  }
};

// Set selection mode
const setSelectionMode = (mode) => {
  selectionMode.value = mode;
  clearSelection();
};

// Initialize
initializeFromProps();

// Set initial view to selected date's month/year if available
if (selectedDate.value) {
  currentYear.value = selectedDate.value.getFullYear();
  currentMonth.value = selectedDate.value.getMonth();
} else if (startDate.value) {
  currentYear.value = startDate.value.getFullYear();
  currentMonth.value = startDate.value.getMonth();
}

// Days of week labels
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Format date for display in input
const formatDisplayDate = (date) => {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Get display value for input field
const getDisplayValue = () => {
  if (selectionMode.value === 'single') {
    return selectedDate.value ? formatDisplayDate(selectedDate.value) : 'Pick a date';
  } else {
    if (startDate.value && endDate.value) {
      return `${formatDisplayDate(startDate.value)} - ${formatDisplayDate(endDate.value)}`;
    } else if (startDate.value) {
      return `${formatDisplayDate(startDate.value)} - Pick end date`;
    } else {
      return 'Pick a date range';
    }
  }
};

// Format year and month for calendar header
const formatYearMonth = (year, month) => {
  const date = new Date(year, month, 1);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
};

// Calculate calendar days for current month view
const calendarDays = computed(() => {
  const days = [];

  // First day of current month
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  // Last day of current month
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);

  // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
  let firstDayOfWeek = firstDay.getDay();
  // Adjust to make Monday as first day (0)
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  // Add days from previous month
  const prevMonthLastDay = new Date(
    currentYear.value,
    currentMonth.value,
    0
  ).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const date = new Date(currentYear.value, currentMonth.value - 1, day);
    days.push({ day, month: "previous", date });
  }

  // Add days from current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(currentYear.value, currentMonth.value, i);
    days.push({ day: i, month: "current", date });
  }

  // Add days from next month
  const remainingDays = 42 - days.length; // 6 rows of 7 days
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(currentYear.value, currentMonth.value + 1, i);
    days.push({ day: i, month: "next", date });
  }

  return days;
});

// Navigation methods
const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

// Check if a date is today
const isToday = (date) => {
  if (!date) return false;
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// Check if a date is selected
const isDateSelected = (date) => {
  if (!date) return false;
  
  if (selectionMode.value === 'single' && selectedDate.value) {
    return (
      date.getDate() === selectedDate.value.getDate() &&
      date.getMonth() === selectedDate.value.getMonth() &&
      date.getFullYear() === selectedDate.value.getFullYear()
    );
  }
  
  return false;
};

// Check if a date is in the selected range
const isDateInRange = (date) => {
  if (!date || !startDate.value || !endDate.value) return false;
  
  return date >= startDate.value && date <= endDate.value;
};

// Check if a date is the start of the range
const isRangeStart = (date) => {
  if (!date || !startDate.value) return false;
  
  return (
    date.getDate() === startDate.value.getDate() &&
    date.getMonth() === startDate.value.getMonth() &&
    date.getFullYear() === startDate.value.getFullYear()
  );
};

// Check if a date is the end of the range
const isRangeEnd = (date) => {
  if (!date || !endDate.value) return false;
  
  return (
    date.getDate() === endDate.value.getDate() &&
    date.getMonth() === endDate.value.getMonth() &&
    date.getFullYear() === endDate.value.getFullYear()
  );
};

// Get the class for a date
const getDateClass = (date) => {
  if (!date) return '';
  
  if (selectionMode.value === 'single') {
    if (isDateSelected(date)) {
      return 'bg-coral-500 text-white rounded-full';
    }
  } else {
    if (isRangeStart(date) && isRangeEnd(date)) {
      return 'bg-coral-500 text-white rounded-full';
    } else if (isRangeStart(date)) {
      return 'bg-coral-500 text-white rounded-l-full';
    } else if (isRangeEnd(date)) {
      return 'bg-coral-500 text-white rounded-r-full';
    } else if (isDateInRange(date)) {
      return 'bg-coral-100 text-coral-600';
    }
  }
  
  return '';
};

// Handle date click
const handleDateClick = (date) => {
  if (selectionMode.value === 'single') {
    selectedDate.value = date;
    emit("update:modelValue", date);
  } else {
    if (!startDate.value) {
      // First click - set start date
      startDate.value = date;
      endDate.value = null;
      selectingSecondDate.value = true;
    } else if (!endDate.value) {
      // Second click - set end date
      if (date < startDate.value) {
        endDate.value = startDate.value;
        startDate.value = date;
      } else {
        endDate.value = date;
      }
      emit("update:modelValue", { start: startDate.value, end: endDate.value });
    } else {
      // Range already selected - start a new range
      startDate.value = date;
      endDate.value = null;
      selectingSecondDate.value = true;
    }
  }
};

// Clear selection
const clearSelection = () => {
  selectedDate.value = null;
  startDate.value = null;
  endDate.value = null;
  selectingSecondDate.value = false;
  
  if (selectionMode.value === 'single') {
    emit("update:modelValue", null);
  } else {
    emit("update:modelValue", { start: null, end: null });
  }
};

// Watch for external changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (selectionMode.value === 'single') {
      selectedDate.value = newValue;
      
      if (newValue) {
        currentYear.value = newValue.getFullYear();
        currentMonth.value = newValue.getMonth();
      }
    } else {
      if (newValue && typeof newValue === 'object') {
        startDate.value = newValue.start || null;
        endDate.value = newValue.end || null;
        
        if (newValue.start) {
          currentYear.value = newValue.start.getFullYear();
          currentMonth.value = newValue.start.getMonth();
        }
      }
    }
  }
);
</script>

<style>
/* Define custom Tailwind colors */
:root {
  --color-coral-100: #ffe8e0;
  --color-coral-200: #ffcfc0;
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
.text-coral-600 {
  color: var(--color-coral-600);
}
.border-coral-200 {
  border-color: var(--color-coral-200);
}
.focus\:ring-coral-500:focus {
  --tw-ring-color: var(--color-coral-500);
}
.hover\:bg-coral-600:hover {
  background-color: var(--color-coral-600);
}

/* Custom styles for range selection */
.rounded-l-full {
  border-top-left-radius: 9999px;
  border-bottom-left-radius: 9999px;
}
.rounded-r-full {
  border-top-right-radius: 9999px;
  border-bottom-right-radius: 9999px;
}
</style>