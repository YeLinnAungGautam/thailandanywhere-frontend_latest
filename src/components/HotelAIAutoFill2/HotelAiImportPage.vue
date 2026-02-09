<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 sticky -top-5 z-10">
      <div class="max-w-full px-4 mx-auto py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button
              @click="cancelImport"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                class="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">
                🤖 AI Hotel Data Import
              </h1>
              <p class="text-sm text-gray-600 mt-1">
                Review and apply AI-extracted hotel information
              </p>
            </div>
          </div>

          <!-- Progress Indicator -->
          <div class="flex items-center gap-4">
            <div
              v-if="currentStep === 'data-compare'"
              class="bg-blue-50 px-4 py-2 rounded-lg"
            >
              <p class="text-sm font-medium text-blue-800">
                Step 1: Review Hotel Data
              </p>
            </div>
            <div
              v-else-if="currentStep === 'rooms'"
              class="bg-purple-50 px-4 py-2 rounded-lg"
            >
              <p class="text-sm font-medium text-purple-800">
                Step 2: Process Rooms ({{ completedRooms }}/{{ totalRooms }})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-full mx-auto">
        <div class="flex gap-1">
          <button
            @click="currentStep = 'data-compare'"
            :class="[
              'px-6 py-3 text-sm font-medium transition-all border-b-2',
              currentStep === 'data-compare'
                ? 'text-blue-600 border-blue-600 bg-blue-50'
                : 'text-gray-600 border-transparent hover:bg-gray-50',
            ]"
          >
            Data Comparison
            <span
              v-if="approvedFieldsCount > 0"
              class="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full"
            >
              {{ approvedFieldsCount }} selected
            </span>
          </button>

          <button
            @click="currentStep = 'rooms'"
            :class="[
              'px-6 py-3 text-sm font-medium transition-all border-b-2',
              currentStep === 'rooms'
                ? 'text-purple-600 border-purple-600 bg-purple-50'
                : 'text-gray-600 border-transparent hover:bg-gray-50',
            ]"
          >
            Rooms & Periods
            <span
              v-if="totalRooms > 0"
              class="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full"
            >
              {{ totalRooms }} rooms
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-full mx-auto px-5 pt-6 pb-20">
      <!-- Data Comparison View -->
      <DataComparisonView
        v-show="currentStep === 'data-compare'"
        :extractedData="extractedData"
        :currentData="currentData"
        v-model:approvedFields="approvedFields"
        v-model:editableValues="editableValues"
        @next="goToRooms"
      />

      <!-- Rooms Processing View -->
      <RoomsProcessingView
        v-show="currentStep === 'rooms'"
        :extractedRooms="extractedData.rooms || []"
        :hotelId="currentData.id"
        :hotelData="currentData"
        @complete="handleRoomsComplete"
        @back="currentStep = 'data-compare'"
      />
    </div>

    <!-- Bottom Action Bar -->
    <div
      class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg"
    >
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-600">
            <span v-if="currentStep === 'data-compare'">
              <span class="font-semibold text-gray-900">{{
                approvedFieldsCount
              }}</span>
              hotel data changes selected
              <span v-if="editCount > 0" class="ml-2 text-blue-600 font-medium">
                ({{ editCount }} edited)
              </span>
            </span>
            <span v-else-if="currentStep === 'rooms'">
              <span class="font-semibold text-green-600">{{
                completedRooms
              }}</span>
              completed •
              <span class="font-semibold text-orange-600">{{
                skippedRooms
              }}</span>
              skipped •
              <span class="font-semibold text-gray-600">{{
                pendingRooms
              }}</span>
              pending
            </span>
          </div>

          <div class="flex gap-3">
            <button
              @click="cancelImport"
              class="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
            >
              Cancel Import
            </button>

            <button
              v-if="currentStep === 'data-compare'"
              @click="goToRooms"
              :disabled="approvedFieldsCount === 0"
              class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <span>Apply & Continue to Rooms</span>
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <button
              v-if="currentStep === 'rooms'"
              @click="finishImport"
              class="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <span>✓</span>
              <span>Click When All Finish</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import DataComparisonView from "./DataComparisonView.vue";
import RoomsProcessingView from "./RoomsProcessingView.vue";

const props = defineProps({
  extractedData: Object,
  currentData: Object,
  originalFile: Object,
});

const emit = defineEmits(["complete", "cancel"]);

const router = useRouter();
const toast = useToast();

// State
const currentStep = ref("data-compare"); // 'data-compare' | 'rooms'
const approvedFields = ref({});
const editableValues = ref({});
const roomsStatus = ref({
  completed: 0,
  skipped: 0,
  pending: 0,
});

// Computed
const approvedFieldsCount = computed(() => {
  return Object.values(approvedFields.value).filter(Boolean).length;
});

const editCount = computed(() => {
  return Object.keys(editableValues.value).length;
});

const totalRooms = computed(() => {
  return props.extractedData?.rooms?.length || 0;
});

const completedRooms = computed(() => roomsStatus.value.completed);
const skippedRooms = computed(() => roomsStatus.value.skipped);
const pendingRooms = computed(() => roomsStatus.value.pending);

// Methods
const goToRooms = () => {
  if (approvedFieldsCount.value === 0) {
    toast.warning("Please select at least one field to update");
    return;
  }

  // Apply hotel data changes to parent
  const changes = {
    fields: approvedFields.value,
    editableValues: editableValues.value,
    extractedData: props.extractedData,
  };

  emit("applyHotelData", changes);

  // Move to rooms step
  currentStep.value = "rooms";
  roomsStatus.value.pending = totalRooms.value;
};

const handleRoomsComplete = (status) => {
  roomsStatus.value = status;
};

const finishImport = () => {
  const message = `Import complete! ✅ ${completedRooms.value} rooms saved, ⊘ ${skippedRooms.value} skipped`;
  toast.success(message);
  emit("complete");
};

const cancelImport = () => {
  emit("cancel");
};
</script>

<style scoped>
/* Add any additional styles here */
</style>
