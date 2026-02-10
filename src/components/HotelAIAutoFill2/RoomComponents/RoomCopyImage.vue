<template>
  <!-- Modal Overlay -->
  <TransitionRoot :show="isOpen" as="template">
    <Dialog as="div" class="relative z-50" @close="closeModal">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-50" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden"
            >
              <!-- Header -->
              <div
                class="bg-orange-600 px-6 py-4 flex justify-between items-center"
              >
                <DialogTitle class="text-xl font-semibold text-white">
                  Import Room Images
                </DialogTitle>
                <button
                  @click="closeModal"
                  class="text-white hover:text-gray-200 transition-colors"
                >
                  <i class="fa-solid fa-times text-xl"></i>
                </button>
              </div>

              <!-- Content -->
              <div class="p-6">
                <!-- Step 1: Select Source Room -->
                <div v-if="step === 1" class="space-y-4">
                  <div class="mb-4">
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">
                      Step 1: Select Source Room (with images)
                    </h3>
                    <p class="text-sm text-gray-600">
                      Choose a room that has images to copy from
                    </p>
                  </div>

                  <!-- Search -->
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search rooms..."
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
                  />

                  <!-- Loading -->
                  <div v-if="loading" class="flex justify-center py-12">
                    <div
                      class="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"
                    ></div>
                  </div>

                  <!-- Room List with Images -->
                  <div
                    v-else-if="roomsWithImages.length > 0"
                    class="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto"
                  >
                    <div
                      v-for="room in filteredRoomsWithImages"
                      :key="room.id"
                      @click="selectSourceRoom(room)"
                      :class="[
                        'p-4 rounded-lg border-2 cursor-pointer transition-all',
                        selectedSourceRoom?.id === room.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300 hover:shadow-md',
                      ]"
                    >
                      <h4 class="font-semibold text-gray-800 mb-2">
                        {{ room.name }}
                      </h4>
                      <div
                        class="flex items-center gap-2 text-xs text-gray-600 mb-3"
                      >
                        <span>👥 {{ room.max_person }} guests</span>
                        <span>💰 {{ room.room_price }} THB</span>
                      </div>
                      <div class="flex items-center gap-2 mb-2">
                        <i class="fa-solid fa-images text-blue-600"></i>
                        <span class="text-sm text-blue-600 font-medium">
                          {{ room.images?.length || 0 }} images
                        </span>
                      </div>
                      <!-- Image Preview -->
                      <div class="grid grid-cols-3 gap-1 mt-2">
                        <img
                          v-for="(image, idx) in room.images?.slice(0, 3)"
                          :key="idx"
                          :src="image.image"
                          class="w-full h-16 object-cover rounded"
                          alt="Room preview"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Empty State -->
                  <div v-else class="text-center py-12">
                    <i
                      class="fa-solid fa-image text-5xl text-gray-300 mb-3"
                    ></i>
                    <p class="text-gray-600">No rooms with images found</p>
                  </div>

                  <!-- Next Button -->
                  <div class="flex justify-end gap-3 pt-4 border-t">
                    <button
                      @click="closeModal"
                      class="px-6 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      @click="nextStep"
                      :disabled="!selectedSourceRoom"
                      class="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next: Preview Images
                    </button>
                  </div>
                </div>

                <!-- Step 2: Preview & Confirm -->
                <div v-if="step === 2" class="space-y-4">
                  <div class="mb-4">
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">
                      Step 2: Preview & Confirm
                    </h3>
                    <p class="text-sm text-gray-600">
                      These images will be copied to:
                      <strong>{{ targetRoomName }}</strong>
                    </p>
                  </div>

                  <!-- Source Room Info -->
                  <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="flex items-center gap-3 mb-3">
                      <i class="fa-solid fa-clone text-blue-600 text-xl"></i>
                      <div>
                        <p class="text-sm text-gray-600">Copying from:</p>
                        <p class="font-semibold text-gray-800">
                          {{ selectedSourceRoom.name }}
                        </p>
                      </div>
                    </div>
                    <p class="text-sm text-blue-700">
                      {{ selectedSourceRoom.images?.length || 0 }} images will
                      be copied
                    </p>
                  </div>

                  <!-- Image Grid Preview -->
                  <div
                    class="grid grid-cols-4 gap-3 max-h-96 overflow-y-auto p-2"
                  >
                    <div
                      v-for="(image, idx) in selectedSourceRoom.images"
                      :key="idx"
                      class="relative group"
                    >
                      <img
                        :src="image.image"
                        class="w-full h-24 object-cover rounded-lg border border-gray-200"
                        alt="Preview"
                      />
                      <div
                        class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity rounded-lg flex items-center justify-center"
                      >
                        <i
                          class="fa-solid fa-search-plus text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        ></i>
                      </div>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex justify-end gap-3 pt-4 border-t">
                    <button
                      @click="step = 1"
                      class="px-6 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                    >
                      Back
                    </button>
                    <button
                      @click="confirmCopy"
                      :disabled="copying"
                      class="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <i v-if="copying" class="fa-solid fa-spinner fa-spin"></i>
                      <i v-else class="fa-solid fa-check"></i>
                      <span>{{
                        copying ? "Copying..." : "Confirm & Copy"
                      }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";

const props = defineProps({
  isOpen: Boolean,
  targetRoomId: Number,
  targetRoomName: String,
  hotelId: Number,
  roomsWithImages: Array,
});

const emit = defineEmits(["close", "confirm"]);

// State
const step = ref(1);
const loading = ref(false);
const copying = ref(false);
const selectedSourceRoom = ref(null);
const searchQuery = ref("");

// Computed
const filteredRoomsWithImages = computed(() => {
  if (!searchQuery.value) return props.roomsWithImages;

  const query = searchQuery.value.toLowerCase();
  return props.roomsWithImages.filter((room) =>
    room.name.toLowerCase().includes(query),
  );
});

// Methods
const selectSourceRoom = (room) => {
  selectedSourceRoom.value = room;
};

const nextStep = () => {
  if (selectedSourceRoom.value) {
    step.value = 2;
  }
};

const confirmCopy = async () => {
  copying.value = true;

  try {
    await emit("confirm", {
      source_room_id: selectedSourceRoom.value.id,
      target_room_id: props.targetRoomId,
    });
  } finally {
    copying.value = false;
  }
};

const closeModal = () => {
  step.value = 1;
  selectedSourceRoom.value = null;
  searchQuery.value = "";
  emit("close");
};

// Reset when modal opens
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      step.value = 1;
      selectedSourceRoom.value = null;
      searchQuery.value = "";
    }
  },
);
</script>
