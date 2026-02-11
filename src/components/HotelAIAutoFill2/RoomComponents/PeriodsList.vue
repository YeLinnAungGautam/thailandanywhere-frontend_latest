<template>
  <div class="space-y-4">
    <!-- Header with Add Button -->
    <div class="flex items-center justify-between mb-4">
      <h4 class="text-sm font-semibold text-purple-900">
        📅 Pricing Periods ({{ localPeriods.length }})
      </h4>
      <button
        @click="addNewPeriod"
        class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <i class="fa-solid fa-plus"></i>
        <span>Add Period</span>
      </button>
    </div>

    <!-- Periods List -->
    <div v-if="localPeriods.length > 0" class="space-y-3">
      <div
        v-for="(period, index) in localPeriods"
        :key="period.id"
        class="bg-white rounded-lg border-2 border-purple-200 p-4 hover:border-purple-300 transition-colors"
      >
        <!-- Period Header with Delete Button -->
        <div class="flex items-center justify-between mb-3">
          <h5 class="text-sm font-semibold text-gray-800">
            Period {{ index + 1 }}
          </h5>
          <button
            @click="removePeriod(index)"
            class="text-red-500 hover:text-red-700 transition-colors p-1"
            title="Remove period"
          >
            <i class="fa-solid fa-trash text-sm"></i>
          </button>
        </div>

        <!-- Period Form -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <!-- Period Name -->
          <div class="col-span-2">
            <label class="block text-xs font-medium text-gray-600 mb-1">
              Period Name *
            </label>
            <input
              v-model="period.period_name"
              @input="emitUpdate"
              type="text"
              required
              class="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              placeholder="e.g., High Season, Low Season"
            />
          </div>

          <!-- Start Date -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">
              Start Date *
            </label>
            <input
              v-model="period.start_date"
              @change="emitUpdate"
              type="date"
              required
              class="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
          </div>

          <!-- End Date -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">
              End Date *
            </label>
            <input
              v-model="period.end_date"
              @change="emitUpdate"
              type="date"
              required
              class="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
          </div>

          <!-- Sale Price -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">
              Sale Price (THB) *
              <span class="text-red-500"
                >Suggest : {{ suggestPrice(period.cost_price) }}</span
              >
            </label>
            <input
              v-model.number="period.sale_price"
              @input="emitUpdate"
              type="number"
              min="0"
              step="0.01"
              required
              class="w-full px-3 py-2 text-sm border-2 border-green-300 rounded-lg focus:outline-none focus:border-green-500 bg-green-50 font-semibold text-green-700"
            />
          </div>

          <!-- Cost Price -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">
              Cost Price (THB)
            </label>
            <input
              v-model.number="period.cost_price"
              @input="emitUpdate"
              type="number"
              min="0"
              step="0.01"
              class="w-full px-3 py-2 text-sm border-2 border-orange-300 rounded-lg focus:outline-none focus:border-orange-500 bg-orange-50 font-semibold text-orange-700"
            />
          </div>

          <!-- Agent Price -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">
              Agent Price (THB)
            </label>
            <input
              v-model.number="period.agent_price"
              @input="emitUpdate"
              type="number"
              min="0"
              step="0.01"
              class="w-full px-3 py-2 text-sm border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 bg-blue-50 font-semibold text-blue-700"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
    >
      <i class="fa-solid fa-calendar-xmark text-4xl text-gray-300 mb-3"></i>
      <p class="text-sm text-gray-600 mb-4">No pricing periods defined</p>
      <button
        @click="addNewPeriod"
        class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg font-medium transition-colors inline-flex items-center gap-2"
      >
        <i class="fa-solid fa-plus"></i>
        <span>Add First Period</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import Swal from "sweetalert2";
import { ref, watch } from "vue";

const props = defineProps({
  periods: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:periods"]);

// Counter for unique IDs
let periodIdCounter = Date.now();

// Flag to prevent watch loops
let isInternalUpdate = false;

// Local state for periods - ensure each has a unique ID
const localPeriods = ref(
  props.periods.map((period) => ({
    ...period,
    id: period.id || `period_${periodIdCounter++}`,
  })),
);

const suggestPrice = (cost) => {
  if (!cost) return 0;
  let amount = cost / 0.85;
  let lastTwoDigits = amount % 100;
  if (lastTwoDigits > 50) {
    return (Math.ceil(amount / 100) * 100).toFixed(0);
  } else {
    return (Math.round(amount / 50) * 50).toFixed(0);
  }
};

// Watch for external changes only
watch(
  () => props.periods,
  (newPeriods) => {
    if (!isInternalUpdate) {
      localPeriods.value = newPeriods.map((period) => ({
        ...period,
        id: period.id || `period_${periodIdCounter++}`,
      }));
    }
  },
  { deep: true },
);

// Manual emit function instead of watch
const emitUpdate = () => {
  isInternalUpdate = true;
  // Remove the internal id before emitting
  const cleanPeriods = localPeriods.value.map(({ id, ...period }) => period);
  emit("update:periods", cleanPeriods);

  // Reset flag after a tick
  setTimeout(() => {
    isInternalUpdate = false;
  }, 0);
};

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// Get date 30 days from now
const getDefaultEndDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().split("T")[0];
};

// Add new period
const addNewPeriod = () => {
  const newPeriod = {
    id: `period_${periodIdCounter++}`, // Unique ID for Vue tracking
    period_name: "",
    start_date: getTodayDate(),
    end_date: getDefaultEndDate(),
    sale_price: 0,
    cost_price: 0,
    agent_price: 0,
  };

  localPeriods.value.push(newPeriod);
  emitUpdate();
};

// Remove period
const removePeriod = (index) => {
  // if (confirm("Are you sure you want to remove this period?")) {
  //   localPeriods.value.splice(index, 1);
  //   emitUpdate();
  // }
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      localPeriods.value.splice(index, 1);
      emitUpdate();
    }
  });
};
</script>
