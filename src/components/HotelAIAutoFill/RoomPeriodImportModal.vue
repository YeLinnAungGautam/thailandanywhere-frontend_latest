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
          class="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col"
        >
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold text-gray-900">
                  🛏️ Room Import from Contract
                </h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ extractedRooms.length }} room(s) found - Processing
                  {{ currentIndex + 1 }} of {{ extractedRooms.length }}
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
          <div class="flex-1 overflow-y-auto p-6">
            <!-- Current Room Being Processed -->
            <div
              v-if="currentRoom"
              class="border-2 rounded-xl p-4 mb-4"
              :class="
                currentRoom.action === 'create'
                  ? 'border-green-300 bg-green-50'
                  : currentRoom.action === 'merge'
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-300 bg-gray-50'
              "
            >
              <!-- Room Info -->
              <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <span
                      class="px-2 py-1 bg-purple-600 text-white rounded text-xs font-bold"
                    >
                      CURRENT
                    </span>
                    <h4 class="font-bold text-lg text-gray-900">
                      {{ currentRoom.extractedRoom.room_type }}
                    </h4>
                  </div>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    <div class="text-sm">
                      <span class="text-gray-600">Max Person:</span>
                      <span class="font-semibold ml-1">{{
                        currentRoom.extractedRoom.max_person
                      }}</span>
                    </div>
                    <div class="text-sm">
                      <span class="text-gray-600">Size:</span>
                      <span class="font-semibold ml-1">{{
                        currentRoom.extractedRoom.room_size || "N/A"
                      }}</span>
                    </div>
                    <div class="text-sm">
                      <span class="text-gray-600">Cost:</span>
                      <span class="font-semibold ml-1 text-orange-600"
                        >{{ currentRoom.extractedRoom.cost_price }} THB</span
                      >
                    </div>
                    <div class="text-sm">
                      <span class="text-gray-600">Sale:</span>
                      <span class="font-semibold ml-1 text-green-600"
                        >{{ currentRoom.extractedRoom.sale_price }} THB</span
                      >
                    </div>
                  </div>
                  <div class="flex gap-2 mt-2">
                    <span
                      v-if="currentRoom.extractedRoom.bed_types.king > 0"
                      class="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded"
                    >
                      {{ currentRoom.extractedRoom.bed_types.king }} King Bed
                    </span>
                    <span
                      v-if="currentRoom.extractedRoom.bed_types.twin > 0"
                      class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
                    >
                      {{ currentRoom.extractedRoom.bed_types.twin }} Twin Bed
                    </span>
                    <span
                      v-if="currentRoom.extractedRoom.has_breakfast"
                      class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded"
                    >
                      Breakfast Included
                    </span>
                  </div>
                </div>

                <!-- Status Badge -->
                <div
                  v-if="currentRoom.status === 'processing'"
                  class="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 rounded-lg"
                >
                  <div
                    class="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"
                  ></div>
                  <span class="text-sm font-medium text-yellow-700"
                    >Saving...</span
                  >
                </div>
              </div>

              <!-- Action Selection -->
              <div class="grid grid-cols-2 gap-3">
                <button
                  @click="currentRoom.action = 'create'"
                  :disabled="isProcessing"
                  class="px-4 py-3 rounded-lg font-medium transition-all"
                  :class="
                    currentRoom.action === 'create'
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-green-400'
                  "
                >
                  <div class="flex items-center justify-center gap-2">
                    <span class="text-xl">➕</span>
                    <div class="text-left">
                      <div class="font-bold">Create New Room</div>
                      <div class="text-xs opacity-80">Add as new room type</div>
                    </div>
                  </div>
                </button>

                <button
                  @click="currentRoom.action = 'merge'"
                  :disabled="isProcessing || currentRooms.length === 0"
                  class="px-4 py-3 rounded-lg font-medium transition-all"
                  :class="
                    currentRoom.action === 'merge'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-400'
                  "
                >
                  <div class="flex items-center justify-center gap-2">
                    <span class="text-xl">🔄</span>
                    <div class="text-left">
                      <div class="font-bold">Merge with Existing</div>
                      <div class="text-xs opacity-80">Add periods only</div>
                    </div>
                  </div>
                </button>
              </div>

              <!-- Merge Target Selection -->
              <div v-if="currentRoom.action === 'merge'" class="mt-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Select target room:
                </label>
                <select
                  v-model="currentRoom.targetRoomId"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  :disabled="isProcessing"
                >
                  <option :value="null">Choose a room...</option>
                  <option
                    v-for="existingRoom in currentRooms"
                    :key="existingRoom.id"
                    :value="existingRoom.id"
                  >
                    {{ existingRoom.name }} ({{ existingRoom.max_person }}
                    guests)
                  </option>
                </select>
              </div>

              <!-- Period Preview -->
              <div
                v-if="currentRoom.extractedRoom.periods?.length > 0"
                class="mt-3"
              >
                <p class="text-sm font-medium text-gray-700 mb-2">
                  {{ currentRoom.extractedRoom.periods.length }} Period(s):
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div
                    v-for="(period, pIndex) in currentRoom.extractedRoom
                      .periods"
                    :key="pIndex"
                    class="bg-white rounded-lg p-3 border border-gray-200"
                  >
                    <div class="font-medium text-sm text-gray-900">
                      {{ period.period_name }}
                    </div>
                    <div class="text-xs text-gray-600 mt-1">
                      {{ formatDate(period.start_date) }} →
                      {{ formatDate(period.end_date) }}
                    </div>
                    <div class="flex gap-3 mt-2 text-xs">
                      <div>
                        <span class="text-gray-500">Sale:</span>
                        <span class="font-semibold text-green-600 ml-1"
                          >{{ period.sale_price }} THB</span
                        >
                      </div>
                      <div>
                        <span class="text-gray-500">Cost:</span>
                        <span class="font-semibold text-orange-600 ml-1"
                          >{{ period.cost_price }} THB</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Error Message -->
              <div
                v-if="currentRoom.error"
                class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <p class="text-sm text-red-700">{{ currentRoom.error }}</p>
              </div>
            </div>

            <!-- Completed Rooms -->
            <div v-if="completedRooms.length > 0" class="space-y-3">
              <h4 class="font-semibold text-gray-700 mb-2">
                ✅ Completed ({{ completedRooms.length }})
              </h4>
              <div
                v-for="(room, index) in completedRooms"
                :key="index"
                class="border rounded-lg p-3"
                :class="
                  room.status === 'success'
                    ? 'border-green-300 bg-green-50'
                    : 'border-red-300 bg-red-50'
                "
              >
                <div class="flex justify-between items-center">
                  <div class="flex-1">
                    <h5 class="font-medium text-gray-900">
                      {{ room.extractedRoom.room_type }}
                    </h5>
                    <p class="text-xs text-gray-600 mt-1">
                      Action:
                      {{ room.action === "create" ? "Created New" : "Merged" }}
                    </p>
                  </div>
                  <div
                    v-if="room.status === 'success'"
                    class="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-lg"
                  >
                    <span class="text-green-600">✓</span>
                    <span class="text-sm font-medium text-green-700"
                      >Success</span
                    >
                  </div>
                  <div
                    v-else-if="room.status === 'error'"
                    class="flex items-center gap-2 px-3 py-1.5 bg-red-100 rounded-lg"
                  >
                    <span class="text-red-600">✗</span>
                    <span class="text-sm font-medium text-red-700">Failed</span>
                  </div>
                </div>
                <div
                  v-if="room.error"
                  class="mt-2 p-2 bg-white border border-red-200 rounded text-xs text-red-700"
                >
                  {{ room.error }}
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="px-6 py-4 border-t border-gray-200 flex justify-between items-center flex-shrink-0"
          >
            <div class="text-sm text-gray-600">
              <span class="font-semibold">{{ remainingCount }}</span>
              room(s) remaining
            </div>

            <div class="flex gap-3">
              <button
                @click="closeModal"
                :disabled="isProcessing"
                class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium disabled:opacity-50"
              >
                {{ isProcessing ? "Processing..." : "Cancel" }}
              </button>

              <button
                v-if="currentRoom"
                @click="processCurrentRoom"
                :disabled="isProcessing || !canProcess"
                class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span v-if="isProcessing">
                  <div
                    class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  ></div>
                </span>
                <span v-else>💾</span>
                <span>{{
                  isProcessing
                    ? "Processing..."
                    : isLastRoom
                    ? "Finish"
                    : "Next"
                }}</span>
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
const currentIndex = ref(0);
const isProcessing = ref(false);
const currentRooms = ref([]);
const loadingRooms = ref(false);

// Computed
const currentRoom = computed(() => {
  if (currentIndex.value < roomConfigs.value.length) {
    return roomConfigs.value[currentIndex.value];
  }
  return null;
});

const completedRooms = computed(() => {
  return roomConfigs.value.slice(0, currentIndex.value);
});

const remainingCount = computed(() => {
  return roomConfigs.value.length - currentIndex.value;
});

const isLastRoom = computed(() => {
  return currentIndex.value === roomConfigs.value.length - 1;
});

const canProcess = computed(() => {
  if (!currentRoom.value) return false;
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

    // Exact name match
    if (
      currentRoom.name.toLowerCase() === extractedRoom.room_type.toLowerCase()
    ) {
      score = 90;
    }
    // Similar name + matching capacity
    else if (
      currentRoom.name
        .toLowerCase()
        .includes(extractedRoom.room_type.toLowerCase()) &&
      currentRoom.max_person === extractedRoom.max_person
    ) {
      score = 70;
    }
    // Matching capacity
    else if (currentRoom.max_person === extractedRoom.max_person) {
      score = 50;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = currentRoom.id;
    }
  }

  return bestScore > 60 ? bestMatch : null;
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
    toast.success(`Room ${currentIndex.value + 1} processed successfully!`);

    // Refresh current rooms list after successful operation
    await fetchCurrentRooms();

    // Move to next room or complete
    if (isLastRoom.value) {
      // All done
      const successCount = roomConfigs.value.filter(
        (c) => c.status === "success",
      ).length;
      const failCount = roomConfigs.value.filter(
        (c) => c.status === "error",
      ).length;

      toast.success(
        `✅ Import complete! ${successCount} succeeded, ${failCount} failed.`,
      );

      setTimeout(() => {
        emit("complete");
      }, 1000);
    } else {
      currentIndex.value++;
    }
  } catch (error) {
    currentRoom.value.status = "error";
    currentRoom.value.error = error.response?.data?.message || error.message;
    toast.error(`Failed to process room: ${currentRoom.value.error}`);
    console.error(`Failed to import room ${currentIndex.value + 1}:`, error);
  } finally {
    isProcessing.value = false;
  }
};

const createNewRoom = async (config) => {
  const room = config.extractedRoom;
  const frmData = new FormData();

  // Basic Info
  frmData.append("name", room.room_type);
  frmData.append("hotel_id", props.hotelId);
  frmData.append("description", room.description || "");
  frmData.append("max_person", room.max_person);
  frmData.append("room_price", room.sale_price);
  frmData.append("cost", room.cost_price || 0);
  frmData.append("agent_price", room.agent_price || 0);
  frmData.append("owner_price", 0);

  // Meta
  frmData.append("meta[room_size]", room.room_size || "");
  frmData.append("meta[is_double]", room.bed_types.king > 0 ? 1 : 0);
  frmData.append("meta[is_twin]", room.bed_types.twin > 0 ? 1 : 0);
  frmData.append("meta[is_show_on]", 0);

  // Boolean fields
  frmData.append("is_extra", room.is_extra ? 1 : 0);
  frmData.append("has_breakfast", room.has_breakfast ? 1 : 0);

  // Periods
  if (room.periods && room.periods.length > 0) {
    for (let x = 0; x < room.periods.length; x++) {
      const period = room.periods[x];
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
  const room = config.extractedRoom;
  const targetRoomId = config.targetRoomId;

  // Get existing room details
  const response = await roomStore.detailAction(targetRoomId);
  const existingRoom = response.result;

  const frmData = new FormData();

  // Keep existing basic info
  frmData.append("name", existingRoom.name);
  frmData.append("hotel_id", props.hotelId);
  frmData.append("description", existingRoom.description || "");
  frmData.append("max_person", existingRoom.max_person);
  frmData.append("room_price", existingRoom.room_price);
  frmData.append("cost", existingRoom.cost || 0);
  frmData.append("agent_price", existingRoom.agent_price || 0);
  frmData.append("owner_price", existingRoom.owner_price || 0);

  // Keep existing meta
  frmData.append("meta[room_size]", existingRoom.meta?.room_size || "");
  frmData.append("meta[is_double]", existingRoom.meta?.is_double || 0);
  frmData.append("meta[is_twin]", existingRoom.meta?.is_twin || 0);
  frmData.append("meta[is_show_on]", existingRoom.meta?.is_show_on || 1);

  // Keep existing booleans
  frmData.append("is_extra", existingRoom.is_extra ? 1 : 0);
  frmData.append("has_breakfast", existingRoom.has_breakfast ? 1 : 0);
  // frmData.append("all_delete_period", true);

  // Merge periods - combine existing + new
  const existingPeriods =
    existingRoom.room_periods?.map((p) => ({
      period_name: p.period_name,
      start_date: p.start_date,
      end_date: p.end_date,
      sale_price: p.sale_price,
      cost_price: p.cost_price,
      agent_price: p.agent_price,
    })) || [];

  const allPeriods = [...existingPeriods];

  for (let x = 0; x < allPeriods.length; x++) {
    const period = allPeriods[x];
    frmData.append(`periods[${x}][period_name]`, period.period_name);
    frmData.append(`periods[${x}][start_date]`, period.start_date);
    frmData.append(`periods[${x}][end_date]`, period.end_date);
    frmData.append(`periods[${x}][sale_price]`, period.sale_price);
    frmData.append(`periods[${x}][cost_price]`, period.cost_price || 0);
    frmData.append(`periods[${x}][agent_price]`, period.agent_price || 0);
  }

  // Keep existing amenities
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

// Initialize configs when modal opens
watch(
  () => props.isOpen,
  async (isOpen) => {
    if (isOpen && props.extractedRooms) {
      // Fetch current rooms from API
      await fetchCurrentRooms();

      // Initialize room configs
      roomConfigs.value = props.extractedRooms.map((room, index) => {
        const suggestedTarget = suggestBestMatch(room);

        return {
          id: `extracted_${index}`,
          extractedRoom: room,
          action: suggestedTarget ? "merge" : "create",
          targetRoomId: suggestedTarget,
          status: "pending",
          error: null,
        };
      });

      // Reset to first room
      currentIndex.value = 0;
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
