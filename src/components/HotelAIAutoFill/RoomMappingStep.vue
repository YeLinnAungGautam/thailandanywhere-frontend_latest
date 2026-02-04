<template>
  <div class="space-y-6">
    <!-- Summary -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-lg">📊</span>
        <h4 class="font-semibold text-blue-900">Room Mapping Overview</h4>
      </div>
      <div class="grid grid-cols-3 gap-4 text-sm">
        <div>
          <span class="text-blue-700 font-medium">Extracted:</span>
          <span class="ml-2 font-bold">{{ extractedRooms.length }}</span>
        </div>
        <div>
          <span class="text-blue-700 font-medium">In System:</span>
          <span class="ml-2 font-bold">{{ currentRooms.length }}</span>
        </div>
        <div>
          <span class="text-blue-700 font-medium">Selected:</span>
          <span class="ml-2 font-bold">{{ selectedCount }}</span>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="flex gap-2">
      <button
        @click="selectAll"
        class="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium"
      >
        ✓ Select All
      </button>
      <button
        @click="deselectAll"
        class="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded text-sm font-medium"
      >
        ✗ Deselect All
      </button>
      <button
        @click="autoMatch"
        class="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium"
      >
        🤖 Auto-Match
      </button>
    </div>

    <!-- Room List -->
    <div class="grid grid-cols-2 gap-6">
      <!-- Current Rooms -->
      <div class="bg-white border-2 border-gray-200 rounded-xl">
        <div class="bg-gray-700 px-4 py-3">
          <h3 class="text-sm font-bold text-white flex items-center gap-2">
            <span>🏨</span>
            <span>Current Rooms in System</span>
          </h3>
        </div>
        <div class="p-4 max-h-[500px] overflow-y-auto">
          <div v-if="currentRooms.length === 0" class="text-center py-8">
            <span class="text-4xl">📭</span>
            <p class="mt-2 text-gray-600 text-sm">No rooms in system</p>
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="room in currentRooms"
              :key="room.id"
              class="p-3 border-2 rounded-lg"
              :class="getRoomHighlight(room.id)"
            >
              <h4 class="font-semibold text-gray-900 text-sm">
                {{ room.name }}
              </h4>
              <div class="flex items-center gap-2 mt-1 text-xs text-gray-600">
                <span>👥 {{ room.max_person }}</span>
                <span v-if="room.room_size">📏 {{ room.room_size }}</span>
              </div>
              <div class="mt-2">
                <span
                  class="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs"
                >
                  {{ room.periods?.length || 0 }} periods
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Extracted Rooms -->
      <div class="bg-white border-2 border-gray-200 rounded-xl">
        <div class="bg-purple-700 px-4 py-3">
          <h3 class="text-sm font-bold text-white flex items-center gap-2">
            <span>📄</span>
            <span>Extracted from Contract</span>
          </h3>
        </div>
        <div class="p-4 max-h-[500px] overflow-y-auto">
          <div class="space-y-4">
            <div
              v-for="(config, index) in modelValue"
              :key="config.id"
              class="border-2 rounded-lg overflow-hidden"
              :class="
                config.selected
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200'
              "
            >
              <!-- Room Header -->
              <div class="bg-white px-3 py-2 border-b">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <input
                      type="checkbox"
                      v-model="config.selected"
                      class="w-4 h-4 text-green-600 rounded"
                    />
                    <div>
                      <h4 class="font-bold text-gray-900 text-sm">
                        {{ config.extractedRoom.room_type }}
                      </h4>
                      <div class="text-xs text-gray-600">
                        👥 {{ config.extractedRoom.max_person }}
                        <span v-if="config.extractedRoom.room_size">
                          | 📏 {{ config.extractedRoom.room_size }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Match confidence badge -->
                  <div v-if="config.confidence > 0" class="text-xs">
                    <span
                      class="px-2 py-1 rounded font-medium"
                      :class="getConfidenceBadgeClass(config.confidence)"
                    >
                      {{ config.confidence }}% match
                    </span>
                  </div>
                </div>
              </div>

              <!-- Configuration -->
              <div
                v-if="config.selected"
                class="p-3 bg-gradient-to-br from-green-50 to-blue-50"
              >
                <!-- Action Selection -->
                <div class="mb-3">
                  <label class="block text-xs font-medium text-gray-700 mb-1">
                    Import Action:
                  </label>
                  <div class="flex gap-2">
                    <label
                      class="flex-1 flex items-center gap-2 p-2 border-2 rounded-lg cursor-pointer"
                      :class="
                        config.action === 'create_new'
                          ? 'border-blue-500 bg-blue-100'
                          : 'border-gray-300 bg-white'
                      "
                    >
                      <input
                        type="radio"
                        :name="`action-${index}`"
                        value="create_new"
                        v-model="config.action"
                        class="w-4 h-4"
                      />
                      <div class="flex-1">
                        <p class="text-xs font-medium">➕ Create New</p>
                        <p class="text-[10px] text-gray-600">Add as new room</p>
                      </div>
                    </label>

                    <label
                      class="flex-1 flex items-center gap-2 p-2 border-2 rounded-lg cursor-pointer"
                      :class="
                        config.action === 'update_existing'
                          ? 'border-orange-500 bg-orange-100'
                          : 'border-gray-300 bg-white'
                      "
                    >
                      <input
                        type="radio"
                        :name="`action-${index}`"
                        value="update_existing"
                        v-model="config.action"
                        class="w-4 h-4"
                      />
                      <div class="flex-1">
                        <p class="text-xs font-medium">🔄 Update Existing</p>
                        <p class="text-[10px] text-gray-600">Replace periods</p>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Target Room Selection (if update_existing) -->
                <div v-if="config.action === 'update_existing'" class="mb-3">
                  <label class="block text-xs font-medium text-gray-700 mb-1">
                    Target Room:
                  </label>
                  <select
                    v-model="config.targetRoomId"
                    class="w-full px-2 py-1.5 text-xs border border-gray-300 rounded"
                  >
                    <option :value="null">Select room to update...</option>
                    <option
                      v-for="room in currentRooms"
                      :key="room.id"
                      :value="room.id"
                    >
                      {{ room.name }} ({{ room.max_person }} pax)
                    </option>
                  </select>

                  <div
                    class="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded"
                  >
                    <p class="text-[10px] text-yellow-800">
                      ⚠️ This will update the room and handle periods in next
                      step
                    </p>
                  </div>
                </div>

                <!-- Periods Preview -->
                <div class="mt-3">
                  <p class="text-xs font-medium text-gray-700 mb-2">
                    📅
                    {{ config.extractedRoom.periods?.length || 0 }} Period(s):
                  </p>
                  <div class="space-y-1">
                    <div
                      v-for="(period, pIndex) in config.extractedRoom.periods"
                      :key="pIndex"
                      class="bg-white border rounded p-2 text-xs"
                    >
                      <div class="font-semibold">{{ period.period_name }}</div>
                      <div class="text-[10px] text-gray-600">
                        {{ formatDate(period.start_date) }} -
                        {{ formatDate(period.end_date) }}
                      </div>
                      <div class="text-[10px] text-green-600 font-bold">
                        Sale: {{ period.room_price }} THB
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  extractedRooms: Array,
  currentRooms: Array,
  modelValue: Array,
});

const emit = defineEmits(["update:modelValue"]);

// Computed
const selectedCount = computed(() => {
  return props.modelValue.filter((c) => c.selected).length;
});

// Methods
const selectAll = () => {
  const updated = props.modelValue.map((c) => ({ ...c, selected: true }));
  emit("update:modelValue", updated);
};

const deselectAll = () => {
  const updated = props.modelValue.map((c) => ({ ...c, selected: false }));
  emit("update:modelValue", updated);
};

const autoMatch = () => {
  const updated = props.modelValue.map((config) => {
    if (config.confidence > 60 && config.targetRoomId) {
      return { ...config, action: "update_existing" };
    }
    return config;
  });
  emit("update:modelValue", updated);
};

const getRoomHighlight = (roomId) => {
  const isMapped = props.modelValue.some(
    (c) => c.selected && c.targetRoomId === roomId,
  );
  return isMapped ? "border-orange-500 bg-orange-50" : "border-gray-200";
};

const getConfidenceBadgeClass = (confidence) => {
  if (confidence >= 80) return "bg-green-100 text-green-700";
  if (confidence >= 60) return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-700";
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};
</script>
