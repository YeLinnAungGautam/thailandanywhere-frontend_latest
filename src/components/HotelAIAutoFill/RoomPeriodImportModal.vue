<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20"
      >
        <!-- Background -->
        <div class="fixed inset-0 bg-gray-900 bg-opacity-75"></div>

        <!-- Modal -->
        <div
          class="relative bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col"
        >
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold text-gray-900">
                  🛏️ AI Room Import & Merge
                </h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ extractedRooms.length }} room(s) extracted •
                  <span class="text-green-600 font-semibold"
                    >{{ completedCount }} completed</span
                  >
                  •
                  <span class="text-orange-600 font-semibold"
                    >{{ skippedCount }} skipped</span
                  >
                  •
                  <span class="text-gray-600">{{ pendingCount }} pending</span>
                </p>
              </div>
              <button
                @click="closeModal"
                :disabled="isProcessing"
                class="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <XMarkIcon class="w-6 h-6" />
              </button>
            </div>
          </div>

          <!-- Body -->
          <div class="flex-1 flex overflow-hidden">
            <!-- Left Side - AI Extracted Room List -->
            <div
              class="w-1/3 border-r border-gray-200 overflow-y-auto p-4 bg-gray-50"
            >
              <h4
                class="text-sm font-semibold text-gray-700 mb-3 sticky top-0 bg-gray-50 pb-2 z-10"
              >
                AI Extracted Rooms ({{ extractedRooms.length }})
              </h4>

              <div class="space-y-2">
                <div
                  v-for="(room, index) in roomConfigs"
                  :key="index"
                  @click="selectRoom(index)"
                  :class="[
                    'p-3 rounded-lg border-2 cursor-pointer transition-all relative',
                    selectedIndex === index
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-gray-200 hover:border-purple-300 bg-white',
                    room.status === 'success' ? 'opacity-75' : '',
                    room.status === 'skipped' ? 'opacity-60' : '',
                  ]"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-1">
                        <h5 class="font-semibold text-sm text-gray-900">
                          {{ room.extractedRoom.room_type }}
                        </h5>
                        <span
                          v-if="room.status === 'success'"
                          class="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded font-semibold"
                        >
                          ✓ Saved
                        </span>
                        <span
                          v-else-if="room.status === 'skipped'"
                          class="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs rounded font-semibold"
                        >
                          ⊘ Skipped
                        </span>
                        <span
                          v-else-if="room.status === 'error'"
                          class="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded font-semibold"
                        >
                          ✗ Error
                        </span>
                        <span
                          v-else-if="room.status === 'processing'"
                          class="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-semibold"
                        >
                          <div class="flex items-center gap-1">
                            <div
                              class="w-3 h-3 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"
                            ></div>
                            Processing
                          </div>
                        </span>
                      </div>

                      <div
                        class="flex items-center gap-3 text-xs text-gray-600 mb-1"
                      >
                        <span
                          >👥 {{ room.extractedRoom.max_person }} guests</span
                        >
                        <span class="text-green-600 font-semibold">
                          💰 {{ room.extractedRoom.sale_price }} THB
                        </span>
                      </div>

                      <div class="flex gap-1 flex-wrap">
                        <span
                          v-if="room.action === 'create'"
                          class="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded"
                        >
                          ➕ New
                        </span>
                        <span
                          v-else-if="room.action === 'merge'"
                          class="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded"
                        >
                          🔄 Merge
                        </span>
                        <span
                          v-if="room.extractedRoom.periods?.length"
                          class="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded"
                        >
                          📅 {{ room.extractedRoom.periods.length }} periods
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Side - Room Details & Actions -->
            <div class="flex-1 overflow-y-auto p-6">
              <div v-if="currentRoom" class="space-y-6">
                <!-- Action Selection -->
                <div>
                  <h4 class="text-sm font-semibold text-gray-700 mb-3">
                    Choose Action
                  </h4>
                  <div class="grid grid-cols-2 gap-3">
                    <button
                      @click="changeAction('create')"
                      :disabled="
                        isProcessing ||
                        currentRoom.status === 'success' ||
                        currentRoom.status === 'skipped'
                      "
                      class="p-4 rounded-xl font-medium transition-all text-left"
                      :class="
                        currentRoom.action === 'create'
                          ? 'bg-green-600 text-white shadow-lg ring-2 ring-green-300'
                          : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-green-400'
                      "
                    >
                      <div class="flex items-center gap-3">
                        <span class="text-2xl">➕</span>
                        <div>
                          <div class="font-bold">Create New Room</div>
                          <div class="text-xs opacity-80">
                            Add as new room type
                          </div>
                        </div>
                      </div>
                    </button>

                    <button
                      @click="changeAction('merge')"
                      :disabled="
                        isProcessing ||
                        currentRooms.length === 0 ||
                        currentRoom.status === 'success' ||
                        currentRoom.status === 'skipped'
                      "
                      class="p-4 rounded-xl font-medium transition-all text-left"
                      :class="
                        currentRoom.action === 'merge'
                          ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-300'
                          : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-400'
                      "
                    >
                      <div class="flex items-center gap-3">
                        <span class="text-2xl">🔄</span>
                        <div>
                          <div class="font-bold">Merge with Existing</div>
                          <div class="text-xs opacity-80">
                            Update existing room
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <!-- Merge Target Selection -->
                <div
                  v-if="currentRoom.action === 'merge'"
                  class="bg-blue-50 rounded-xl p-4 border-2 border-blue-200"
                >
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Select Existing Room to Merge With:
                  </label>
                  <select
                    v-model="currentRoom.targetRoomId"
                    @change="loadTargetRoomData"
                    :disabled="
                      isProcessing ||
                      currentRoom.status === 'success' ||
                      currentRoom.status === 'skipped'
                    "
                    class="w-full px-4 py-2.5 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option :value="null">Choose a room...</option>
                    <option
                      v-for="existingRoom in currentRooms"
                      :key="existingRoom.id"
                      :value="existingRoom.id"
                    >
                      {{ existingRoom.name }} ({{
                        existingRoom.max_person
                      }}
                      guests, {{ existingRoom.room_price }} THB)
                    </option>
                  </select>
                </div>

                <!-- Status Display for Completed/Skipped -->
                <div
                  v-if="currentRoom.status === 'success'"
                  class="bg-green-50 rounded-xl p-4 border-2 border-green-200"
                >
                  <div class="flex items-center gap-3">
                    <span class="text-2xl">✅</span>
                    <div>
                      <h4 class="font-bold text-green-800">
                        Room Saved Successfully!
                      </h4>
                      <p class="text-sm text-green-700">
                        This room has been
                        {{
                          currentRoom.action === "create"
                            ? "created"
                            : "merged"
                        }}.
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  v-else-if="currentRoom.status === 'skipped'"
                  class="bg-orange-50 rounded-xl p-4 border-2 border-orange-200"
                >
                  <div class="flex items-center gap-3">
                    <span class="text-2xl">⊘</span>
                    <div>
                      <h4 class="font-bold text-orange-800">Room Skipped</h4>
                      <p class="text-sm text-orange-700">
                        You chose to skip this room. You can select it again to
                        process it.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Editable Room Data (only show if pending or error) -->
                <div
                  v-if="
                    currentRoom.status === 'pending' ||
                    currentRoom.status === 'error'
                  "
                  class="bg-gray-50 rounded-xl p-4 border-2 border-gray-200"
                >
                  <h4 class="text-sm font-semibold text-gray-700 mb-4">
                    {{
                      currentRoom.action === "create"
                        ? "✨ New Room Data (Editable)"
                        : "🔄 Merged Room Data (Editable)"
                    }}
                  </h4>

                  <div class="space-y-4">
                    <!-- Room Name -->
                    <div>
                      <label
                        class="block text-xs font-medium text-gray-600 mb-1"
                      >
                        Room Name *
                      </label>
                      <input
                        v-model="currentRoom.editableData.name"
                        type="text"
                        class="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                        placeholder="Enter room name"
                      />
                    </div>

                    <!-- Max Person & Room Size -->
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          class="block text-xs font-medium text-gray-600 mb-1"
                        >
                          Max Person *
                        </label>
                        <input
                          v-model.number="currentRoom.editableData.max_person"
                          type="number"
                          min="1"
                          class="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label
                          class="block text-xs font-medium text-gray-600 mb-1"
                        >
                          Room Size
                        </label>
                        <input
                          v-model="currentRoom.editableData.room_size"
                          type="text"
                          class="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                          placeholder="e.g., 25 sqm"
                        />
                      </div>
                    </div>

                    <!-- Prices -->
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          class="block text-xs font-medium text-gray-600 mb-1"
                        >
                          Sale Price (THB) *
                        </label>
                        <input
                          v-model.number="currentRoom.editableData.sale_price"
                          type="number"
                          min="0"
                          step="0.01"
                          class="w-full px-3 py-2 text-sm border-2 border-green-300 rounded-lg focus:outline-none focus:border-green-500 bg-green-50 font-semibold text-green-700"
                        />
                      </div>
                      <div>
                        <label
                          class="block text-xs font-medium text-gray-600 mb-1"
                        >
                          Cost Price (THB)
                        </label>
                        <input
                          v-model.number="currentRoom.editableData.cost_price"
                          type="number"
                          min="0"
                          step="0.01"
                          class="w-full px-3 py-2 text-sm border-2 border-orange-300 rounded-lg focus:outline-none focus:border-orange-500 bg-orange-50 font-semibold text-orange-700"
                        />
                      </div>
                    </div>

                    <!-- Agent Price -->
                    <div>
                      <label
                        class="block text-xs font-medium text-gray-600 mb-1"
                      >
                        Agent Price (THB)
                      </label>
                      <input
                        v-model.number="currentRoom.editableData.agent_price"
                        type="number"
                        min="0"
                        step="0.01"
                        class="w-full px-3 py-2 text-sm border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 bg-blue-50 font-semibold text-blue-700"
                      />
                    </div>

                    <!-- Bed Types & Options -->
                    <!-- <div class="grid grid-cols-2 gap-3">
                      <div
                        class="flex items-center justify-between p-2 bg-white rounded border"
                      >
                        <span class="text-xs font-medium">King Bed</span>
                        <input
                          v-model.number="
                            currentRoom.editableData.bed_types.king
                          "
                          type="number"
                          min="0"
                          class="w-16 px-2 py-1 text-xs border rounded"
                        />
                      </div>
                      <div
                        class="flex items-center justify-between p-2 bg-white rounded border"
                      >
                        <span class="text-xs font-medium">Twin Bed</span>
                        <input
                          v-model.number="
                            currentRoom.editableData.bed_types.twin
                          "
                          type="number"
                          min="0"
                          class="w-16 px-2 py-1 text-xs border rounded"
                        />
                      </div>
                    </div> -->

                    <!-- Toggles -->
                    <div class="grid grid-cols-2 gap-3">
                      <label
                        class="flex items-center gap-2 p-2 bg-white rounded border cursor-pointer"
                      >
                        <input
                          v-model="currentRoom.editableData.has_breakfast"
                          type="checkbox"
                          class="w-4 h-4 text-purple-600 rounded"
                        />
                        <span class="text-xs font-medium"
                          >Include Breakfast</span
                        >
                      </label>
                      <label
                        class="flex items-center gap-2 p-2 bg-white rounded border cursor-pointer"
                      >
                        <input
                          v-model="currentRoom.editableData.is_extra"
                          type="checkbox"
                          class="w-4 h-4 text-purple-600 rounded"
                        />
                        <span class="text-xs font-medium"
                          >Extra Bed Available</span
                        >
                      </label>
                    </div>

                    <!-- Description -->
                    <div>
                      <label
                        class="block text-xs font-medium text-gray-600 mb-1"
                      >
                        Description
                      </label>
                      <textarea
                        v-model="currentRoom.editableData.description"
                        rows="2"
                        class="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                        placeholder="Room description..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                <!-- Periods Preview -->
                <div
                  v-if="currentRoom.editableData.periods?.length > 0"
                  class="bg-purple-50 rounded-xl p-4 border-2 border-purple-200"
                >
                  <div class="flex justify-between items-center mb-3">
                    <h4 class="text-sm font-semibold text-purple-900">
                      📅 Pricing Periods ({{
                        currentRoom.editableData.periods.length
                      }})
                    </h4>
                    <span
                      v-if="currentRoom.action === 'merge'"
                      class="text-xs text-purple-700 font-medium"
                    >
                      ⚠️ Will replace all existing periods
                    </span>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div
                      v-for="(period, pIndex) in currentRoom.editableData
                        .periods"
                      :key="pIndex"
                      class="bg-white rounded-lg p-3 border border-purple-200"
                    >
                      <div class="font-medium text-sm text-gray-900 mb-1">
                        {{ period.period_name }}
                      </div>
                      <div class="text-xs text-gray-600 mb-2">
                        {{ formatDate(period.start_date) }} →
                        {{ formatDate(period.end_date) }}
                      </div>
                      <div class="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span class="text-gray-500">Sale:</span>
                          <p class="font-semibold text-green-600">
                            {{ period.sale_price }}
                          </p>
                        </div>
                        <div>
                          <span class="text-gray-500">Cost:</span>
                          <p class="font-semibold text-orange-600">
                            {{ period.cost_price }}
                          </p>
                        </div>
                        <div>
                          <span class="text-gray-500">Agent:</span>
                          <p class="font-semibold text-blue-600">
                            {{ period.agent_price }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Error Message -->
                <div
                  v-if="currentRoom.error"
                  class="bg-red-50 border-2 border-red-200 rounded-lg p-3"
                >
                  <p class="text-sm text-red-700">{{ currentRoom.error }}</p>
                </div>
              </div>

              <!-- Empty State -->
              <div
                v-else
                class="flex items-center justify-center h-full text-gray-400"
              >
                <div class="text-center">
                  <i class="fa-solid fa-arrow-left text-4xl mb-3"></i>
                  <p class="text-sm">Select a room from the left to begin</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="px-6 py-4 border-t border-gray-200 flex justify-between items-center flex-shrink-0"
          >
            <div class="text-sm text-gray-600">
              Progress:
              <span class="font-semibold text-green-600"
                >{{ completedCount }} saved</span
              >
              •
              <span class="font-semibold text-orange-600"
                >{{ skippedCount }} skipped</span
              >
              •
              <span class="font-semibold text-gray-600"
                >{{ pendingCount }} remaining</span
              >
            </div>

            <div class="flex gap-3">
              <!-- Skip Button - Only for pending/error rooms -->
              <button
                v-if="
                  currentRoom &&
                  (currentRoom.status === 'pending' ||
                    currentRoom.status === 'error')
                "
                @click="skipCurrentRoom"
                :disabled="isProcessing"
                class="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <span>⊘</span>
                <span>Skip This Room</span>
              </button>

              <!-- Save Button - Only for pending/error rooms -->
              <button
                v-if="
                  currentRoom &&
                  (currentRoom.status === 'pending' ||
                    currentRoom.status === 'error')
                "
                @click="processCurrentRoom"
                :disabled="isProcessing || !canProcess"
                class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                <span v-if="isProcessing">
                  <div
                    class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  ></div>
                </span>
                <span v-else>💾</span>
                <span>{{ isProcessing ? "Processing..." : "Save Room" }}</span>
              </button>

              <!-- Next Button - For completed/skipped rooms when there are more pending -->
              <button
                v-else-if="
                  currentRoom &&
                  (currentRoom.status === 'success' ||
                    currentRoom.status === 'skipped') &&
                  hasNextPending
                "
                @click="moveToNextPending"
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <span>→</span>
                <span>Next Room</span>
              </button>

              <!-- Finish Button - Always available -->
              <button
                @click="finishImport"
                :disabled="isProcessing"
                class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <span>✓</span>
                <span>Finish Import</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { useRoomStore } from "../../stores/room";
import { useToast } from "vue-toastification";

const props = defineProps({
  isOpen: Boolean,
  extractedRooms: Array,
  hotelId: Number,
});

const emit = defineEmits(["close", "complete"]);

const roomStore = useRoomStore();
const toast = useToast();

// State
const roomConfigs = ref([]);
const selectedIndex = ref(0);
const isProcessing = ref(false);
const currentRooms = ref([]);
const loadingRooms = ref(false);

// Computed
const currentRoom = computed(() => {
  if (selectedIndex.value !== null && roomConfigs.value[selectedIndex.value]) {
    return roomConfigs.value[selectedIndex.value];
  }
  return null;
});

const completedCount = computed(() => {
  return roomConfigs.value.filter((r) => r.status === "success").length;
});

const skippedCount = computed(() => {
  return roomConfigs.value.filter((r) => r.status === "skipped").length;
});

const pendingCount = computed(() => {
  return roomConfigs.value.filter(
    (r) => r.status === "pending" || r.status === "error",
  ).length;
});

const hasNextPending = computed(() => {
  return roomConfigs.value.some(
    (r, idx) =>
      idx > selectedIndex.value &&
      (r.status === "pending" || r.status === "error"),
  );
});

const canProcess = computed(() => {
  if (!currentRoom.value) return false;
  if (
    currentRoom.value.status === "success" ||
    currentRoom.value.status === "skipped"
  )
    return false;
  if (!currentRoom.value.editableData.name) return false;
  if (!currentRoom.value.editableData.sale_price) return false;

  if (currentRoom.value.action === "create") return true;
  if (currentRoom.value.action === "merge") {
    return currentRoom.value.targetRoomId !== null;
  }
  return false;
});

// Methods
const closeModal = () => {
  if (!isProcessing.value) {
    emit("close");
  }
};

const finishImport = () => {
  const successCount = completedCount.value;
  const skipped = skippedCount.value;
  const pending = pendingCount.value;

  let message = `Import complete! `;
  if (successCount > 0) message += `✅ ${successCount} saved `;
  if (skipped > 0) message += `⊘ ${skipped} skipped `;
  if (pending > 0) message += `⚠️ ${pending} not processed`;

  toast.success(message);
  emit("complete");
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
};

const fetchCurrentRooms = async () => {
  loadingRooms.value = true;
  try {
    const response = await roomStore.getListAction({
      hotel_id: props.hotelId,
      limit: 100,
    });
    currentRooms.value = response.result.data || [];
  } catch (error) {
    console.error("Failed to fetch current rooms:", error);
    toast.error("Failed to load existing rooms");
    currentRooms.value = [];
  } finally {
    loadingRooms.value = false;
  }
};

const suggestBestMatch = (extractedRoom) => {
  if (!currentRooms.value || currentRooms.value.length === 0) return null;

  let bestMatch = null;
  let bestScore = 0;

  for (const currentRoom of currentRooms.value) {
    let score = 0;

    if (
      currentRoom.name.toLowerCase() === extractedRoom.room_type.toLowerCase()
    ) {
      score = 90;
    } else if (
      currentRoom.name
        .toLowerCase()
        .includes(extractedRoom.room_type.toLowerCase()) &&
      currentRoom.max_person === extractedRoom.max_person
    ) {
      score = 70;
    } else if (currentRoom.max_person === extractedRoom.max_person) {
      score = 50;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = currentRoom.id;
    }
  }

  return bestScore > 60 ? bestMatch : null;
};

const selectRoom = (index) => {
  if (!isProcessing.value) {
    selectedIndex.value = index;
  }
};

const skipCurrentRoom = () => {
  if (currentRoom.value) {
    currentRoom.value.status = "skipped";
    toast.info(`Room "${currentRoom.value.extractedRoom.room_type}" skipped`);

    // Move to next pending room if available
    moveToNextPending();
  }
};

const moveToNextPending = () => {
  const nextIndex = roomConfigs.value.findIndex(
    (r, idx) =>
      idx > selectedIndex.value &&
      (r.status === "pending" || r.status === "error"),
  );

  if (nextIndex !== -1) {
    selectedIndex.value = nextIndex;
  } else {
    toast.info("No more pending rooms. Click 'Finish Import' when ready.");
  }
};

const changeAction = (action) => {
  if (
    currentRoom.value &&
    (currentRoom.value.status === "pending" ||
      currentRoom.value.status === "error")
  ) {
    currentRoom.value.action = action;

    if (action === "merge" && currentRoom.value.targetRoomId) {
      loadTargetRoomData();
    }
  }
};

const loadTargetRoomData = async () => {
  if (!currentRoom.value || !currentRoom.value.targetRoomId) return;

  try {
    const response = await roomStore.detailAction(
      currentRoom.value.targetRoomId,
    );
    const existingRoom = response.result;

    currentRoom.value.editableData = {
      name: currentRoom.value.extractedRoom.room_type,
      max_person: currentRoom.value.extractedRoom.max_person,
      sale_price: currentRoom.value.extractedRoom.sale_price,
      cost_price:
        currentRoom.value.extractedRoom.cost_price || existingRoom.cost,
      agent_price:
        currentRoom.value.extractedRoom.agent_price || existingRoom.agent_price,
      room_size:
        currentRoom.value.extractedRoom.room_size ||
        existingRoom.meta?.room_size ||
        "",
      bed_types: currentRoom.value.extractedRoom.bed_types || {
        king: 0,
        twin: 0,
      },
      has_breakfast: currentRoom.value.extractedRoom.has_breakfast,
      is_extra: currentRoom.value.extractedRoom.is_extra || false,
      description:
        currentRoom.value.extractedRoom.description ||
        existingRoom.description ||
        "",
      periods: currentRoom.value.extractedRoom.periods || [],
    };
  } catch (error) {
    console.error("Failed to load target room:", error);
    toast.error("Failed to load room details");
  }
};

const processCurrentRoom = async () => {
  if (!currentRoom.value || !canProcess.value) return;

  isProcessing.value = true;
  currentRoom.value.status = "processing";

  try {
    if (currentRoom.value.action === "create") {
      await createNewRoom(currentRoom.value);
    } else if (currentRoom.value.action === "merge") {
      await mergeRoomPeriods(currentRoom.value);
    }

    currentRoom.value.status = "success";
    toast.success(`✅ Room saved successfully!`);

    // Refresh room list
    await fetchCurrentRooms();

    // Move to next pending room automatically
    moveToNextPending();
  } catch (error) {
    currentRoom.value.status = "error";
    currentRoom.value.error = error.response?.data?.message || error.message;
    toast.error(`Failed to process room: ${currentRoom.value.error}`);
    console.error("Failed to import room:", error);
  } finally {
    isProcessing.value = false;
  }
};

const createNewRoom = async (config) => {
  const data = config.editableData;
  const frmData = new FormData();

  frmData.append("name", data.name);
  frmData.append("hotel_id", props.hotelId);
  frmData.append("description", data.description || "");
  frmData.append("max_person", data.max_person);
  frmData.append("room_price", data.sale_price);
  frmData.append("cost", data.cost_price || 0);
  frmData.append("agent_price", data.agent_price || 0);
  frmData.append("owner_price", 0);

  frmData.append("meta[room_size]", data.room_size || "");
  frmData.append("meta[is_double]", data.bed_types.king > 0 ? 1 : 0);
  frmData.append("meta[is_twin]", data.bed_types.twin > 0 ? 1 : 0);
  frmData.append("meta[is_show_on]", 1);

  frmData.append("is_extra", data.is_extra ? 1 : 0);
  frmData.append("has_breakfast", data.has_breakfast ? 1 : 0);

  if (data.periods && data.periods.length > 0) {
    for (let x = 0; x < data.periods.length; x++) {
      const period = data.periods[x];
      frmData.append(`periods[${x}][period_name]`, period.period_name);
      frmData.append(`periods[${x}][start_date]`, period.start_date);
      frmData.append(`periods[${x}][end_date]`, period.end_date);
      frmData.append(`periods[${x}][sale_price]`, period.sale_price);
      frmData.append(`periods[${x}][cost_price]`, period.cost_price || 0);
      frmData.append(`periods[${x}][agent_price]`, period.agent_price || 0);
    }
  }

  await roomStore.addNewAction(frmData);
};

const mergeRoomPeriods = async (config) => {
  const data = config.editableData;
  const targetRoomId = config.targetRoomId;

  const response = await roomStore.detailAction(targetRoomId);
  const existingRoom = response.result;

  const frmData = new FormData();

  frmData.append("name", data.name);
  frmData.append("hotel_id", props.hotelId);
  frmData.append("description", data.description);
  frmData.append("max_person", data.max_person);
  frmData.append("room_price", data.sale_price);
  frmData.append("cost", data.cost_price || 0);
  frmData.append("agent_price", data.agent_price || 0);
  frmData.append("owner_price", existingRoom.owner_price || 0);

  frmData.append("meta[room_size]", data.room_size || "");
  frmData.append("meta[is_double]", data.bed_types.king > 0 ? 1 : 0);
  frmData.append("meta[is_twin]", data.bed_types.twin > 0 ? 1 : 0);
  frmData.append("meta[is_show_on]", existingRoom.meta?.is_show_on || 1);

  frmData.append("is_extra", data.is_extra ? 1 : 0);
  frmData.append("has_breakfast", data.has_breakfast ? 1 : 0);

  if (data.periods && data.periods.length > 0) {
    for (let x = 0; x < data.periods.length; x++) {
      const period = data.periods[x];
      frmData.append(`periods[${x}][period_name]`, period.period_name);
      frmData.append(`periods[${x}][start_date]`, period.start_date);
      frmData.append(`periods[${x}][end_date]`, period.end_date);
      frmData.append(`periods[${x}][sale_price]`, period.sale_price);
      frmData.append(`periods[${x}][cost_price]`, period.cost_price || 0);
      frmData.append(`periods[${x}][agent_price]`, period.agent_price || 0);
    }
  }

  if (existingRoom.amenities && existingRoom.amenities.length > 0) {
    for (let i = 0; i < existingRoom.amenities.length; i++) {
      frmData.append(`amenities[${i}][title]`, existingRoom.amenities[i].title);
      const lists = existingRoom.amenities[i].list || [];
      for (let l = 0; l < lists.length; l++) {
        const listName =
          typeof lists[l] === "string" ? lists[l] : lists[l].list_name;
        frmData.append(`amenities[${i}][list][${l}]`, listName);
      }
    }
  }

  frmData.append("_method", "PUT");

  await roomStore.updateAction(frmData, targetRoomId);
};

watch(
  () => props.isOpen,
  async (isOpen) => {
    if (isOpen && props.extractedRooms) {
      await fetchCurrentRooms();

      roomConfigs.value = props.extractedRooms.map((room, index) => {
        const suggestedTarget = suggestBestMatch(room);

        return {
          id: `extracted_${index}`,
          extractedRoom: room,
          action: suggestedTarget ? "merge" : "create",
          targetRoomId: suggestedTarget,
          editableData: {
            name: room.room_type,
            max_person: room.max_person,
            sale_price: room.sale_price,
            cost_price: room.cost_price || 0,
            agent_price: room.agent_price || 0,
            room_size: room.room_size || "",
            bed_types: room.bed_types || { king: 0, twin: 0 },
            has_breakfast: room.has_breakfast || false,
            is_extra: room.is_extra || false,
            description: room.description || "",
            periods: room.periods || [],
          },
          status: "pending",
          error: null,
        };
      });

      selectedIndex.value = 0;

      if (
        roomConfigs.value[0]?.action === "merge" &&
        roomConfigs.value[0]?.targetRoomId
      ) {
        await loadTargetRoomData();
      }
    }
  },
);

watch(
  () => currentRoom.value?.action,
  (newAction) => {
    if (
      newAction === "create" &&
      currentRoom.value &&
      (currentRoom.value.status === "pending" ||
        currentRoom.value.status === "error")
    ) {
      currentRoom.value.editableData = {
        name: currentRoom.value.extractedRoom.room_type,
        max_person: currentRoom.value.extractedRoom.max_person,
        sale_price: currentRoom.value.extractedRoom.sale_price,
        cost_price: currentRoom.value.extractedRoom.cost_price || 0,
        agent_price: currentRoom.value.extractedRoom.agent_price || 0,
        room_size: currentRoom.value.extractedRoom.room_size || "",
        bed_types: currentRoom.value.extractedRoom.bed_types || {
          king: 0,
          twin: 0,
        },
        has_breakfast: currentRoom.value.extractedRoom.has_breakfast || false,
        is_extra: currentRoom.value.extractedRoom.is_extra || false,
        description: currentRoom.value.extractedRoom.description || "",
        periods: currentRoom.value.extractedRoom.periods || [],
      };
    }
  },
);
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
