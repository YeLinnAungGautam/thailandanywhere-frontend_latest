<template>
  <div class="grid grid-cols-3 gap-6">
    <!-- Left: Room List -->
    <div
      class="col-span-1 bg-white rounded-xl shadow-sm p-4 max-h-[calc(100vh-300px)] overflow-y-auto"
    >
      <h3
        class="text-lg font-semibold text-gray-800 mb-4 sticky top-0 bg-white"
      >
        AI Extracted Rooms ({{ roomConfigs.length }})
      </h3>

      <div class="space-y-3">
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
                <StatusBadge :status="room.status" />
              </div>

              <div class="flex items-center gap-3 text-xs text-gray-600 mb-1">
                <span>👥 {{ room.extractedRoom.max_person }} guests</span>
                <span class="text-green-600 font-semibold">
                  💰 {{ room.extractedRoom.sale_price }} THB
                </span>
              </div>

              <div class="flex gap-1 flex-wrap mt-2">
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

    <!-- Right: Room Details (2 columns) -->
    <div class="col-span-2 space-y-6">
      <div v-if="currentRoom" class="space-y-6">
        <!-- Action Buttons -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex justify-between items-center">
            <h4 class="text-lg font-semibold text-gray-800">
              Review & Create Room
            </h4>
            <!-- Action Buttons -->
            <div class="flex justify-end gap-3">
              <button
                v-if="!isCompleted && !isSkipped"
                @click="skipCurrentRoom"
                :disabled="isProcessing"
                class="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <span>⊘</span>
                <span>Skip This Room</span>
              </button>

              <button
                v-if="!isCompleted && !isSkipped"
                @click="processCurrentRoom"
                :disabled="isProcessing || !canProcess"
                class="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                <LoadingSpinner v-if="isProcessing" />
                <span v-else>💾</span>
                <span>{{
                  isProcessing ? "Processing..." : "Create Room"
                }}</span>
              </button>

              <button
                v-else-if="hasNextPending"
                @click="moveToNextPending"
                class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <span>→</span>
                <span>Next Room</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Status Messages -->
        <StatusMessage
          :status="currentRoom.status"
          action="create"
          :error="currentRoom.error"
        />

        <!-- Tab Navigation for Room Details -->
        <div
          class="bg-white rounded-xl shadow-sm"
          v-if="!isCompleted && !isSkipped"
        >
          <div class="border-b border-gray-200 px-6 pt-4">
            <div class="flex gap-1">
              <button
                @click="roomTab = 'info'"
                :class="[
                  'px-4 py-2 text-sm font-medium transition-all border-b-2',
                  roomTab === 'info'
                    ? 'text-purple-600 border-purple-600'
                    : 'text-gray-600 border-transparent hover:text-gray-800',
                ]"
              >
                Room Information
              </button>
              <button
                @click="roomTab = 'periods'"
                :class="[
                  'px-4 py-2 text-sm font-medium transition-all border-b-2',
                  roomTab === 'periods'
                    ? 'text-purple-600 border-purple-600'
                    : 'text-gray-600 border-transparent hover:text-gray-800',
                ]"
              >
                Pricing Periods
                <span
                  v-if="currentRoom.editableData.periods?.length"
                  class="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full"
                >
                  {{ currentRoom.editableData.periods.length }}
                </span>
              </button>
            </div>
          </div>

          <!-- Room Info Tab -->
          <div v-show="roomTab === 'info'" class="p-6">
            <RoomInfoEditor v-model="currentRoom.editableData" />
          </div>

          <!-- Periods Tab -->
          <div v-show="roomTab === 'periods'" class="p-6">
            <PeriodsList
              :periods="currentRoom.editableData.periods || []"
              @update:periods="updatePeriods"
            />
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-xl shadow-sm p-12 text-center">
        <i class="fa-solid fa-arrow-left text-4xl text-gray-300 mb-3"></i>
        <p class="text-gray-500">Select a room from the left to begin</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useToast } from "vue-toastification";
import { useRoomStore } from "../../stores/room";
import StatusBadge from "./RoomComponents/StatusBadge.vue";
import StatusMessage from "./RoomComponents/StatusMessage.vue";
import LoadingSpinner from "./RoomComponents/LoadingSpinner.vue";
import RoomInfoEditor from "./RoomComponents/RoomInfoEditor.vue";
import PeriodsList from "./RoomComponents/PeriodsList.vue";

const props = defineProps({
  extractedRooms: Array,
  hotelId: Number,
  hotelData: Object,
});

const emit = defineEmits(["complete", "back"]);

const toast = useToast();
const roomStore = useRoomStore();

// State
const roomConfigs = ref([]);
const selectedIndex = ref(0);
const isProcessing = ref(false);
const roomTab = ref("info");

// Computed
const currentRoom = computed(() => {
  if (selectedIndex.value !== null && roomConfigs.value[selectedIndex.value]) {
    return roomConfigs.value[selectedIndex.value];
  }
  return null;
});

const isCompleted = computed(() => currentRoom.value?.status === "success");
const isSkipped = computed(() => currentRoom.value?.status === "skipped");

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
  if (isCompleted.value || isSkipped.value) return false;
  if (!currentRoom.value.editableData.name) return false;
  if (!currentRoom.value.editableData.sale_price) return false;
  return true;
});

// Methods
const selectRoom = (index) => {
  if (!isProcessing.value) {
    selectedIndex.value = index;
    roomTab.value = "info";
  }
};

const updatePeriods = (periods) => {
  if (currentRoom.value) {
    currentRoom.value.editableData.periods = periods;
  }
};

const skipCurrentRoom = () => {
  if (currentRoom.value) {
    currentRoom.value.status = "skipped";
    toast.info(`Room "${currentRoom.value.extractedRoom.room_type}" skipped`);
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
    selectRoom(nextIndex);
  } else {
    toast.info("No more pending rooms");
  }
};

const processCurrentRoom = async () => {
  if (!currentRoom.value || !canProcess.value) return;

  isProcessing.value = true;
  currentRoom.value.status = "processing";

  try {
    await createNewRoom(currentRoom.value);

    currentRoom.value.status = "success";
    toast.success(`✅ Room created successfully!`);

    updateStatus();
    moveToNextPending();
  } catch (error) {
    currentRoom.value.status = "error";
    currentRoom.value.error = error.response?.data?.message || error.message;
    toast.error(`Failed to create room: ${currentRoom.value.error}`);
    console.error("Failed to create room:", error);
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
  frmData.append("owner_price", data.owner_price || 0);

  frmData.append("meta[room_size]", data.room_size || "");
  frmData.append("meta[is_double]", data.bed_types?.king > 0 ? 1 : 0);
  frmData.append("meta[is_twin]", data.bed_types?.twin > 0 ? 1 : 0);
  frmData.append("meta[is_show_on]", data.is_show_on ? 1 : 0);

  frmData.append("is_extra", data.is_extra ? 1 : 0);
  frmData.append("has_breakfast", data.has_breakfast ? 1 : 0);

  // Add periods
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

const updateStatus = () => {
  emit("complete", {
    completed: completedCount.value,
    skipped: skippedCount.value,
    pending: pendingCount.value,
  });
};

// Initialize
watch(
  () => props.extractedRooms,
  (rooms) => {
    if (rooms && rooms.length > 0) {
      roomConfigs.value = rooms.map((room, index) => ({
        id: `extracted_${index}`,
        extractedRoom: room,
        editableData: {
          name: room.room_type,
          max_person: room.max_person,
          sale_price: room.sale_price,
          cost_price: room.cost_price || 0,
          agent_price: room.agent_price || 0,
          owner_price: room.owner_price || 0,
          room_size: room.room_size || "",
          bed_types: room.bed_types || { king: 0, twin: 0 },
          has_breakfast: room.has_breakfast || false,
          is_extra: room.is_extra || false,
          is_show_on: true, // ✅ Default to true
          description: room.description || "",
          periods: room.periods || [],
        },
        status: "pending",
        error: null,
      }));

      selectedIndex.value = 0;
      updateStatus();
    }
  },
  { immediate: true },
);
</script>
