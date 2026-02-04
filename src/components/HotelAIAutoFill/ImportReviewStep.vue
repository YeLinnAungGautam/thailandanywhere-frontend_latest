<template>
  <div class="space-y-6">
    <!-- Summary Cards -->
    <div class="grid grid-cols-3 gap-4">
      <!-- Create New -->
      <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center"
          >
            <span class="text-2xl">➕</span>
          </div>
          <div>
            <div class="text-3xl font-bold text-blue-900">
              {{ createNewCount }}
            </div>
            <div class="text-sm text-blue-700">New Rooms</div>
          </div>
        </div>
      </div>

      <!-- Update Existing -->
      <div class="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center"
          >
            <span class="text-2xl">🔄</span>
          </div>
          <div>
            <div class="text-3xl font-bold text-orange-900">
              {{ updateExistingCount }}
            </div>
            <div class="text-sm text-orange-700">Updates</div>
          </div>
        </div>
      </div>

      <!-- Total Periods -->
      <div class="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center"
          >
            <span class="text-2xl">📅</span>
          </div>
          <div>
            <div class="text-3xl font-bold text-purple-900">
              {{ totalPeriods }}
            </div>
            <div class="text-sm text-purple-700">Periods</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Review -->
    <div class="space-y-4">
      <!-- New Rooms -->
      <div
        v-if="createNewRooms.length > 0"
        class="bg-white border-2 border-blue-200 rounded-xl"
      >
        <div class="bg-blue-600 px-4 py-3">
          <h3 class="text-white font-bold">
            ➕ New Rooms ({{ createNewRooms.length }})
          </h3>
        </div>
        <div class="p-4 space-y-3">
          <div
            v-for="config in createNewRooms"
            :key="config.id"
            class="border rounded-lg p-3"
          >
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-bold text-gray-900">
                  {{ config.extractedRoom.room_type }}
                </h4>
                <p class="text-sm text-gray-600">
                  {{ config.extractedRoom.max_person }} pax |
                  {{ config.extractedRoom.room_size }}
                </p>
                <div class="mt-2">
                  <span
                    class="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium"
                  >
                    {{ config.extractedRoom.periods.length }} periods
                  </span>
                </div>
              </div>
              <span
                class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold"
              >
                NEW
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Update Rooms -->
      <div
        v-if="updateExistingRooms.length > 0"
        class="bg-white border-2 border-orange-200 rounded-xl"
      >
        <div class="bg-orange-600 px-4 py-3">
          <h3 class="text-white font-bold">
            🔄 Room Updates ({{ updateExistingRooms.length }})
          </h3>
        </div>
        <div class="p-4 space-y-3">
          <div
            v-for="config in updateExistingRooms"
            :key="config.id"
            class="border rounded-lg p-3"
          >
            <div class="flex justify-between items-start mb-2">
              <div>
                <h4 class="font-bold text-gray-900">
                  {{ config.extractedRoom.room_type }}
                </h4>
                <p class="text-xs text-gray-600">
                  → Updating:
                  <span class="font-semibold">{{
                    getTargetRoomName(config.targetRoomId)
                  }}</span>
                </p>
              </div>
              <span
                class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold"
              >
                UPDATE
              </span>
            </div>

            <!-- Strategy Badge -->
            <div class="mt-2">
              <span
                class="px-2 py-1 rounded text-xs font-medium"
                :class="getStrategyBadgeClass(periodStrategies[config.id])"
              >
                {{ getStrategyLabel(periodStrategies[config.id]) }}
              </span>
              <span class="ml-2 text-xs text-gray-600">
                {{ config.extractedRoom.periods.length }} periods from contract
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Warning Notice -->
    <div class="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
      <div class="flex items-start gap-3">
        <span class="text-2xl">⚠️</span>
        <div>
          <h4 class="font-semibold text-yellow-900">Final Check</h4>
          <p class="text-sm text-yellow-800 mt-1">
            Please review the changes carefully. Once confirmed, these actions
            cannot be automatically undone.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  roomConfigurations: Array,
  periodStrategies: Object,
  currentRooms: Array,
});

// Computed
const createNewRooms = computed(() => {
  return props.roomConfigurations.filter(
    (c) => c.selected && c.action === "create_new",
  );
});

const updateExistingRooms = computed(() => {
  return props.roomConfigurations.filter(
    (c) => c.selected && c.action === "update_existing",
  );
});

const createNewCount = computed(() => createNewRooms.value.length);
const updateExistingCount = computed(() => updateExistingRooms.value.length);

const totalPeriods = computed(() => {
  return props.roomConfigurations
    .filter((c) => c.selected)
    .reduce((sum, c) => sum + (c.extractedRoom.periods?.length || 0), 0);
});

// Methods
const getTargetRoomName = (roomId) => {
  const room = props.currentRooms?.find((r) => r.id === roomId);
  return room?.name || "Unknown Room";
};

const getStrategyLabel = (strategy) => {
  const labels = {
    replace_all: "🔄 Replace All Periods",
    smart_merge: "🧠 Smart Merge",
    add_only: "➕ Add Only",
  };
  return labels[strategy] || strategy;
};

const getStrategyBadgeClass = (strategy) => {
  const classes = {
    replace_all: "bg-red-100 text-red-700",
    smart_merge: "bg-blue-100 text-blue-700",
    add_only: "bg-yellow-100 text-yellow-700",
  };
  return classes[strategy] || "bg-gray-100 text-gray-700";
};
</script>
