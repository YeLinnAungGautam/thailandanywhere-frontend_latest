<template>
  <div class="space-y-6">
    <!-- Info Banner -->
    <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
      <div class="flex items-start gap-3">
        <span class="text-2xl">⚠️</span>
        <div>
          <h4 class="font-semibold text-orange-900">
            Period Strategy Required
          </h4>
          <p class="text-sm text-orange-700 mt-1">
            You're updating {{ roomConfigurations.length }} room(s). Choose how
            to handle existing periods for each room.
          </p>
        </div>
      </div>
    </div>

    <!-- Room List with Strategy Selection -->
    <div class="space-y-4">
      <div
        v-for="config in roomConfigurations"
        :key="config.id"
        class="bg-white border-2 border-orange-200 rounded-xl overflow-hidden"
      >
        <!-- Room Header -->
        <div class="bg-orange-600 px-4 py-3">
          <h3 class="text-white font-bold flex items-center gap-2">
            <span>🔄</span>
            <span>{{ config.extractedRoom.room_type }}</span>
            <span class="text-orange-200 text-sm font-normal">
              → Updating: {{ getTargetRoomName(config.targetRoomId) }}
            </span>
          </h3>
        </div>

        <div class="p-4">
          <!-- Current vs New Periods Comparison -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <!-- Current Periods -->
            <div>
              <h4 class="text-sm font-semibold text-gray-700 mb-2">
                📋 Current Periods ({{
                  getCurrentPeriods(config.targetRoomId).length
                }})
              </h4>
              <div class="space-y-1">
                <div
                  v-for="(period, index) in getCurrentPeriods(
                    config.targetRoomId,
                  )"
                  :key="index"
                  class="bg-gray-100 rounded p-2 text-xs"
                >
                  <div class="font-medium">{{ period.period_name }}</div>
                  <div class="text-gray-600">
                    {{ formatDate(period.start_date) }} -
                    {{ formatDate(period.end_date) }}
                  </div>
                  <div class="text-purple-600 font-bold">
                    {{ period.sale_price }} THB
                  </div>
                </div>
              </div>
            </div>

            <!-- New Periods -->
            <div>
              <h4 class="text-sm font-semibold text-gray-700 mb-2">
                📄 New Periods ({{ config.extractedRoom.periods.length }})
              </h4>
              <div class="space-y-1">
                <div
                  v-for="(period, index) in config.extractedRoom.periods"
                  :key="index"
                  class="bg-green-100 rounded p-2 text-xs"
                >
                  <div class="font-medium">{{ period.period_name }}</div>
                  <div class="text-gray-600">
                    {{ formatDate(period.start_date) }} -
                    {{ formatDate(period.end_date) }}
                  </div>
                  <div class="text-green-600 font-bold">
                    {{ period.room_price }} THB
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Strategy Selection -->
          <div class="space-y-3">
            <label class="block text-sm font-medium text-gray-700">
              Choose Import Strategy:
            </label>

            <!-- Replace All -->
            <label
              class="flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer"
              :class="getStrategyClass('replace_all', config.id)"
            >
              <input
                type="radio"
                :name="`strategy-${config.id}`"
                value="replace_all"
                v-model="localStrategies[config.id]"
                class="w-4 h-4 mt-1"
              />
              <div class="flex-1">
                <div
                  class="font-semibold text-gray-900 flex items-center gap-2"
                >
                  <span>🔄</span>
                  <span>Replace All</span>
                  <span class="text-xs text-red-600 font-normal"
                    >(Recommended)</span
                  >
                </div>
                <p class="text-xs text-gray-600 mt-1">
                  Delete all
                  {{ getCurrentPeriods(config.targetRoomId).length }} existing
                  periods and add {{ config.extractedRoom.periods.length }} new
                  periods from contract.
                </p>
                <div class="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                  <p class="text-xs text-red-700 flex items-start gap-1">
                    <span>⚠️</span>
                    <span>All special periods will be lost!</span>
                  </p>
                </div>
              </div>
            </label>

            <!-- Smart Merge -->
            <label
              class="flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer"
              :class="getStrategyClass('smart_merge', config.id)"
            >
              <input
                type="radio"
                :name="`strategy-${config.id}`"
                value="smart_merge"
                v-model="localStrategies[config.id]"
                class="w-4 h-4 mt-1"
              />
              <div class="flex-1">
                <div
                  class="font-semibold text-gray-900 flex items-center gap-2"
                >
                  <span>🧠</span>
                  <span>Smart Merge</span>
                  <span class="text-xs text-blue-600 font-normal"
                    >(Intelligent)</span
                  >
                </div>
                <p class="text-xs text-gray-600 mt-1">
                  Update matching periods (by name), keep special periods
                  untouched.
                </p>
                <div class="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                  <p class="text-xs text-blue-700">
                    ✅ Will update:
                    {{ getMatchingPeriodsCount(config) }} matching periods<br />
                    ✅ Will keep: {{ getUnmatchedPeriodsCount(config) }} special
                    periods
                  </p>
                </div>
              </div>
            </label>

            <!-- Add Only -->
            <label
              class="flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer"
              :class="getStrategyClass('add_only', config.id)"
            >
              <input
                type="radio"
                :name="`strategy-${config.id}`"
                value="add_only"
                v-model="localStrategies[config.id]"
                class="w-4 h-4 mt-1"
              />
              <div class="flex-1">
                <div
                  class="font-semibold text-gray-900 flex items-center gap-2"
                >
                  <span>➕</span>
                  <span>Add Only</span>
                  <span class="text-xs text-yellow-600 font-normal"
                    >(May Duplicate)</span
                  >
                </div>
                <p class="text-xs text-gray-600 mt-1">
                  Keep all existing periods and add new ones. Total:
                  {{
                    getCurrentPeriods(config.targetRoomId).length +
                    config.extractedRoom.periods.length
                  }}
                  periods.
                </p>
                <div
                  class="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded"
                >
                  <p class="text-xs text-yellow-700 flex items-start gap-1">
                    <span>⚠️</span>
                    <span>May create overlapping or duplicate periods!</span>
                  </p>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  roomConfigurations: Array,
  modelValue: Object,
});

const emit = defineEmits(["update:modelValue"]);

// Local state
const localStrategies = reactive({});

// Initialize strategies
watch(
  () => props.roomConfigurations,
  (configs) => {
    configs.forEach((config) => {
      if (!localStrategies[config.id]) {
        localStrategies[config.id] = "replace_all"; // Default
      }
    });
  },
  { immediate: true },
);

// Emit changes
watch(
  localStrategies,
  (strategies) => {
    emit("update:modelValue", { ...strategies });
  },
  { deep: true },
);

// Methods
const getCurrentPeriods = (roomId) => {
  // Mock - you'll get this from currentRooms prop
  const room = props.roomConfigurations[0]; // Get from parent
  return room?.currentPeriods || [];
};

const getTargetRoomName = (roomId) => {
  // Get from currentRooms
  return "Target Room Name"; // Placeholder
};

const getStrategyClass = (strategy, configId) => {
  if (localStrategies[configId] === strategy) {
    const classes = {
      replace_all: "border-red-500 bg-red-50",
      smart_merge: "border-blue-500 bg-blue-50",
      add_only: "border-yellow-500 bg-yellow-50",
    };
    return classes[strategy];
  }
  return "border-gray-300 bg-white hover:border-gray-400";
};

const getMatchingPeriodsCount = (config) => {
  // Logic to find matching periods
  return 2; // Placeholder
};

const getUnmatchedPeriodsCount = (config) => {
  return (
    getCurrentPeriods(config.targetRoomId).length -
    getMatchingPeriodsCount(config)
  );
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
</script>
