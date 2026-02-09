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
                <ActionBadge :action="room.action" />
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
        <!-- Action Selection -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex justify-between items-center pb-5">
            <h4 class="text-lg font-semibold text-gray-800">
              Choose Import Action
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
                <span>{{ isProcessing ? "Processing..." : "Save Room" }}</span>
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
          <div class="grid grid-cols-2 gap-4">
            <ActionButton
              action="create"
              :selected="currentRoom.action === 'create'"
              :disabled="isProcessing || isCompleted || isSkipped"
              @click="changeAction('create')"
            />
            <ActionButton
              action="merge"
              :selected="currentRoom.action === 'merge'"
              :disabled="
                isProcessing ||
                isCompleted ||
                isSkipped ||
                currentRooms.length === 0
              "
              @click="changeAction('merge')"
            />
          </div>

          <!-- Merge Target Selection -->
          <div
            v-if="currentRoom.action === 'merge'"
            class="mt-4 bg-blue-50 rounded-lg p-4 border-2 border-blue-200"
          >
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Select Existing Room to Merge:
            </label>
            <select
              v-model="currentRoom.targetRoomId"
              @change="loadTargetRoomData"
              :disabled="
                isProcessing || isCompleted || isSkipped || isLoadingRoomDetail
              "
              class="w-full px-4 py-2.5 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
            >
              <option :value="null">Choose a room...</option>
              <option
                v-for="existingRoom in currentRooms"
                :key="existingRoom.id"
                :value="existingRoom.id"
              >
                {{ existingRoom.name }} ({{ existingRoom.max_person }} guests,
                {{ existingRoom.room_price }} THB)
              </option>
            </select>

            <!-- Loading indicator for room detail -->
            <div
              v-if="isLoadingRoomDetail"
              class="mt-2 flex items-center gap-2 text-sm text-blue-600"
            >
              <LoadingSpinner />
              <span>Loading room details...</span>
            </div>
          </div>
        </div>

        <!-- Status Messages -->
        <StatusMessage
          :status="currentRoom.status"
          :action="currentRoom.action"
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
            <!-- ✅ FIXED: Pass currentRoomData properly -->
            <RoomInfoComparison
              v-if="
                currentRoom.action === 'merge' &&
                currentRoom.targetRoomId &&
                currentRoomData
              "
              :current="currentRoomData"
              :extracted="currentRoom.editableData"
              @update="updateEditableData"
            />
            <RoomInfoEditor v-else v-model="currentRoom.editableData" />
          </div>

          <!-- Periods Tab -->
          <div v-show="roomTab === 'periods'" class="p-6">
            <!-- ✅ FIXED: Pass currentRoomData periods properly -->
            <PeriodsComparison
              v-if="
                currentRoom.action === 'merge' &&
                currentRoom.targetRoomId &&
                currentRoomData
              "
              :current="currentRoomData.periods || []"
              :extracted="currentRoom.editableData.periods || []"
            />
            <PeriodsList
              v-else
              :periods="currentRoom.editableData.periods || []"
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
import ActionBadge from "./RoomComponents/ActionBadge.vue";
import ActionButton from "./RoomComponents/ActionButton.vue";
import StatusMessage from "./RoomComponents/StatusMessage.vue";
import LoadingSpinner from "./RoomComponents/LoadingSpinner.vue";
import RoomInfoComparison from "./RoomComponents/RoomInfoComparison.vue";
import RoomInfoEditor from "./RoomComponents/RoomInfoEditor.vue";
import PeriodsComparison from "./RoomComponents/PeriodsComparison.vue";
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
const isLoadingRoomDetail = ref(false); // ✅ NEW: Loading state for room detail
const currentRooms = ref([]);
const currentRoomData = ref(null);
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

  if (currentRoom.value.action === "create") return true;
  if (currentRoom.value.action === "merge") {
    return currentRoom.value.targetRoomId !== null;
  }
  return false;
});

// Methods
const fetchCurrentRooms = async () => {
  try {
    const response = await roomStore.getListAction({
      hotel_id: props.hotelId,
      limit: 100,
    });
    currentRooms.value = response.result.data || [];
  } catch (error) {
    console.error("Failed to fetch current rooms:", error);
    toast.error("Failed to load existing rooms");
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

const selectRoom = async (index) => {
  if (!isProcessing.value) {
    selectedIndex.value = index;
    roomTab.value = "info";

    // ✅ FIXED: Load room detail when selecting room with merge action
    if (
      currentRoom.value?.action === "merge" &&
      currentRoom.value?.targetRoomId
    ) {
      await loadTargetRoomData();
    } else {
      // Clear previous room data when switching to create or different room
      currentRoomData.value = null;
    }
  }
};

const changeAction = async (action) => {
  if (currentRoom.value && !isCompleted.value && !isSkipped.value) {
    currentRoom.value.action = action;
    roomTab.value = "info";

    if (action === "merge" && currentRoom.value.targetRoomId) {
      // ✅ Load detail when switching to merge
      await loadTargetRoomData();
    } else if (action === "create") {
      // ✅ Clear detail when switching to create
      currentRoomData.value = null;

      // Reset to original extracted data
      currentRoom.value.editableData = {
        name: currentRoom.value.extractedRoom.room_type,
        max_person: currentRoom.value.extractedRoom.max_person,
        sale_price: currentRoom.value.extractedRoom.sale_price,
        cost_price: currentRoom.value.extractedRoom.cost_price || 0,
        agent_price: currentRoom.value.extractedRoom.agent_price || 0,
        owner_price: currentRoom.value.extractedRoom.owner_price || 0,
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
  }
};

// ✅ FIXED: Improved loadTargetRoomData function
const loadTargetRoomData = async () => {
  if (!currentRoom.value || !currentRoom.value.targetRoomId) {
    currentRoomData.value = null;
    return;
  }

  isLoadingRoomDetail.value = true;

  try {
    console.log(
      "🔍 Loading room detail for ID:",
      currentRoom.value.targetRoomId,
    );

    // ✅ Call detail API
    const response = await roomStore.detailAction(
      currentRoom.value.targetRoomId,
    );

    console.log("✅ Room detail loaded:", response.result);

    // ✅ Store the full room detail data
    currentRoomData.value = response.result;

    // ✅ Merge AI data with existing room data for editing
    currentRoom.value.editableData = {
      name: currentRoom.value.extractedRoom.room_type,
      max_person: currentRoom.value.extractedRoom.max_person,
      sale_price: currentRoom.value.extractedRoom.sale_price,
      cost_price:
        currentRoom.value.extractedRoom.cost_price ||
        currentRoomData.value.cost ||
        0,
      agent_price:
        currentRoom.value.extractedRoom.agent_price ||
        currentRoomData.value.agent_price ||
        0,
      owner_price:
        currentRoom.value.extractedRoom.owner_price ||
        currentRoomData.value.owner_price ||
        0,
      room_size:
        currentRoom.value.extractedRoom.room_size ||
        currentRoomData.value.meta?.room_size ||
        "",
      bed_types: currentRoom.value.extractedRoom.bed_types || {
        king: currentRoomData.value.meta?.is_double ? 1 : 0,
        twin: currentRoomData.value.meta?.is_twin ? 1 : 0,
      },
      has_breakfast: currentRoom.value.extractedRoom.has_breakfast ?? false,
      is_extra: currentRoom.value.extractedRoom.is_extra ?? false,
      is_show_on: currentRoomData.value.meta?.is_show_on ?? true,
      description:
        currentRoom.value.extractedRoom.description ||
        currentRoomData.value.description ||
        "",
      periods: currentRoom.value.extractedRoom.periods || [],
    };

    toast.success("Room details loaded successfully");
  } catch (error) {
    console.error("Failed to load target room:", error);
    toast.error("Failed to load room details");
    currentRoomData.value = null;
  } finally {
    isLoadingRoomDetail.value = false;
  }
};

const updateEditableData = (key, value) => {
  if (currentRoom.value) {
    currentRoom.value.editableData[key] = value;
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
    selectRoom(nextIndex); // ✅ Use selectRoom to trigger data loading
  } else {
    toast.info("No more pending rooms");
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
      await mergeRoom(currentRoom.value);
    }

    currentRoom.value.status = "success";
    toast.success(`✅ Room saved successfully!`);

    await fetchCurrentRooms();
    updateStatus();
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
  frmData.append("owner_price", data.owner_price || 0);

  frmData.append("meta[room_size]", data.room_size || "");
  frmData.append("meta[is_double]", data.bed_types.king > 0 ? 1 : 0);
  frmData.append("meta[is_twin]", data.bed_types.twin > 0 ? 1 : 0);
  frmData.append("meta[is_show_on]", data.is_show_on ? 1 : 0);

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

const mergeRoom = async (config) => {
  const data = config.editableData;
  const targetRoomId = config.targetRoomId;

  // ✅ Use already loaded currentRoomData instead of fetching again
  const existingRoom = currentRoomData.value;

  if (!existingRoom) {
    throw new Error("Room detail not loaded");
  }

  const frmData = new FormData();

  frmData.append("name", data.name);
  frmData.append("hotel_id", props.hotelId);
  frmData.append("description", data.description);
  frmData.append("max_person", data.max_person);
  frmData.append("room_price", data.sale_price);
  frmData.append("cost", data.cost_price || 0);
  frmData.append("agent_price", data.agent_price || 0);
  frmData.append(
    "owner_price",
    data.owner_price || existingRoom.owner_price || 0,
  );

  frmData.append("meta[room_size]", data.room_size || "");
  frmData.append("meta[is_double]", data.bed_types.king > 0 ? 1 : 0);
  frmData.append("meta[is_twin]", data.bed_types.twin > 0 ? 1 : 0);
  frmData.append("meta[is_show_on]", data.is_show_on ? 1 : 0);

  frmData.append("is_extra", data.is_extra ? 1 : 0);
  frmData.append("has_breakfast", data.has_breakfast ? 1 : 0);

  // ✅ AI periods REPLACE existing periods
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

  // ✅ Preserve amenities from existing room
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
  async (rooms) => {
    if (rooms && rooms.length > 0) {
      await fetchCurrentRooms();

      roomConfigs.value = rooms.map((room, index) => {
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
            owner_price: room.owner_price || 0,
            room_size: room.room_size || "",
            bed_types: room.bed_types || { king: 0, twin: 0 },
            has_breakfast: room.has_breakfast || false,
            is_extra: room.is_extra || false,
            is_show_on: true,
            description: room.description || "",
            periods: room.periods || [],
          },
          status: "pending",
          error: null,
        };
      });

      selectedIndex.value = 0;
      updateStatus();

      // ✅ Load detail for first suggested merge room
      if (
        roomConfigs.value[0]?.action === "merge" &&
        roomConfigs.value[0]?.targetRoomId
      ) {
        await loadTargetRoomData();
      }
    }
  },
  { immediate: true },
);
</script>
