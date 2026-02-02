<template>
  <div class="w-full p-2 mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h2 class="text-xl font-bold text-gray-800">Hotel Facilities</h2>
        <p class="text-sm">
          Don't forget to click update after changes or reorder.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <!-- Delete All Button -->
        <button
          v-if="selectedFacilityIds.length > 0"
          type="button"
          @click="confirmDeleteAll"
          class="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
        >
          <TrashIcon class="w-5 h-5" />
          <span>Delete All ({{ selectedFacilityIds.length }})</span>
        </button>

        <!-- AI Generate Button -->
        <button
          type="button"
          v-if="!isGenerating"
          @click="generateWithAI"
          class="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
        >
          <span class="text-xl">✨</span>
          <span>Generate with AI</span>
        </button>

        <!-- Add Manual Button -->
        <button
          type="button"
          @click="openCreateModal"
          class="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
        >
          <span class="text-xl">+</span>
          <span>Add Manually</span>
        </button>
      </div>
    </div>

    <!-- AI Generation Loading State -->
    <div
      v-if="isGenerating"
      class="flex flex-col items-center justify-center py-16 bg-purple-50 rounded-xl border-2 border-purple-200"
    >
      <div
        class="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"
      ></div>
      <p class="text-lg font-semibold text-purple-900 mb-2">
        🤖 AI is generating hotel facilities...
      </p>
      <p class="text-sm text-purple-600">
        Analyzing hotel information to suggest appropriate facilities
      </p>
    </div>

    <!-- Selected Facilities Section -->
    <div v-else-if="!loading" class="space-y-4">
      <!-- Select from Existing Facilities -->
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Select Facilities for This Hotel
        </label>
        <v-select
          class="style-chooser"
          multiple
          v-model="selectedFacilityIds"
          :options="allFacilities"
          :reduce="(facility) => facility.id"
          :get-option-label="(option) => option.name"
          placeholder="Choose facilities..."
          @option:selected="onFacilityChange"
          @option:deselected="onFacilityChange"
        >
          <template #option="{ image, icon, name }">
            <div class="flex items-center gap-2">
              <img
                v-if="image"
                :src="image"
                :alt="name"
                class="w-8 h-8 rounded"
              />
              <i
                v-else-if="icon"
                :class="icon"
                class="text-xl text-gray-700"
              ></i>
              <div v-else class="w-8 h-8 bg-gray-200 rounded"></div>
              <span>{{ name }}</span>
            </div>
          </template>
        </v-select>
        <p class="mt-2 text-xs text-gray-500">
          Selected: {{ selectedFacilityIds.length }} facilities
        </p>
      </div>

      <!-- Drag to Reorder Selected Facilities -->
      <div
        v-if="selectedFacilities.length > 0"
        class="bg-white p-4 rounded-lg border border-gray-200"
      >
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-sm font-medium text-gray-700">
            Drag to Reorder (Display Order on Hotel Page)
          </h3>
          <button
            @click="confirmDeleteAll"
            class="text-xs text-red-600 hover:text-red-800 hover:underline font-medium flex items-center gap-1"
          >
            <TrashIcon class="w-4 h-4" />
            Clear All
          </button>
        </div>
        <draggable
          v-model="selectedFacilities"
          @end="onDragEnd"
          item-key="id"
          handle=".drag-handle"
          class="space-y-2"
        >
          <template #item="{ element, index }">
            <div
              class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
            >
              <!-- Drag Handle -->
              <div
                class="drag-handle cursor-move text-gray-400 hover:text-gray-600"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"
                  ></path>
                </svg>
              </div>

              <!-- Order Number -->
              <div
                class="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold"
              >
                {{ index + 1 }}
              </div>

              <!-- Facility Icon/Image -->
              <div class="w-10 h-10 flex items-center justify-center">
                <img
                  v-if="element.image"
                  :src="element.image"
                  :alt="element.name"
                  class="w-full h-full object-cover rounded"
                />
                <i
                  v-else-if="element.icon"
                  :class="element.icon"
                  class="text-2xl text-gray-700"
                ></i>
                <div v-else class="w-full h-full bg-gray-200 rounded"></div>
              </div>

              <!-- Facility Name -->
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-800">
                  {{ element.name }}
                </p>
              </div>

              <!-- Remove Button -->
              <button
                @click="removeFacility(element.id)"
                type="button"
                class="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </template>
        </draggable>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
      >
        <svg
          class="mx-auto h-16 w-16 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <p class="mt-4 text-gray-600">
          No facilities selected. Use AI to generate or select manually!
        </p>
      </div>
    </div>

    <!-- Create Manual Facility Modal -->
    <Transition name="modal">
      <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div
          class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0"
        >
          <div
            class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
            @click="closeModal"
          ></div>

          <div
            class="relative inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
          >
            <!-- Header -->
            <div
              class="flex items-center justify-between px-6 py-4 border-b border-gray-200"
            >
              <h3 class="text-2xl font-bold text-gray-900">Add New Facility</h3>
              <button
                @click="closeModal"
                type="button"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="px-6 py-6">
              <form @submit.prevent="handleManualCreate" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Facility Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="manualForm.name"
                    type="text"
                    placeholder="e.g., Free WiFi"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Font Awesome Icon Class
                    </label>
                    <input
                      v-model="manualForm.icon"
                      type="text"
                      placeholder="fa-solid fa-wifi"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <p class="mt-1 text-xs text-gray-500">
                      Optional: Add Font Awesome icon class
                    </p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Icon Preview</label
                    >
                    <div
                      class="w-full h-[52px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50"
                    >
                      <i
                        v-if="manualForm.icon"
                        :class="manualForm.icon"
                        class="text-3xl text-gray-700"
                      ></i>
                      <span v-else class="text-gray-400 text-xs">No Icon</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Image (Optional)</label
                  >
                  <div class="flex items-center gap-4">
                    <input
                      type="file"
                      ref="imageInput"
                      class="hidden"
                      @change="handleImageChange"
                      accept="image/*"
                    />
                    <button
                      type="button"
                      @click="openFilePicker"
                      class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      Choose Image
                    </button>
                    <div v-if="imagePreview" class="relative w-16 h-16">
                      <img
                        :src="imagePreview"
                        class="w-full h-full object-cover rounded border border-gray-300"
                      />
                      <button
                        type="button"
                        @click="removeImage"
                        class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  class="flex justify-end gap-3 pt-4 border-t border-gray-200"
                >
                  <button
                    type="button"
                    @click="closeModal"
                    class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="submitting"
                    class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                  >
                    {{ submitting ? "Creating..." : "Create Facility" }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete All Confirmation Modal -->
    <Transition name="modal">
      <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 overflow-y-auto">
        <div
          class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0"
        >
          <div
            class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
            @click="showDeleteConfirm = false"
          ></div>

          <div
            class="relative inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
          >
            <!-- Header -->
            <div class="px-6 py-4 bg-red-50 border-b border-red-100">
              <div class="flex items-center gap-3">
                <div
                  class="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full"
                >
                  <TrashIcon class="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900">
                    Delete All Facilities?
                  </h3>
                  <p class="text-sm text-gray-600">
                    This will remove all {{ selectedFacilityIds.length }}
                    facilities
                  </p>
                </div>
              </div>
            </div>

            <!-- Body -->
            <div class="px-6 py-4">
              <p class="text-sm text-gray-700">
                Are you sure you want to remove all selected facilities from
                this hotel? This action cannot be undone.
              </p>
              <div
                class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <p class="text-xs text-yellow-800">
                  ⚠️ Note: This only removes facilities from this hotel. The
                  facilities themselves will still exist in the system.
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div
              class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3"
            >
              <button
                type="button"
                @click="showDeleteConfirm = false"
                class="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                @click="deleteAllFacilities"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                Yes, Delete All
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div
        v-if="toast.show"
        class="fixed bottom-6 right-6 z-50 px-6 py-4 rounded-lg shadow-lg"
        :class="{
          'bg-green-500 text-white': toast.type === 'success',
          'bg-red-500 text-white': toast.type === 'error',
          'bg-yellow-500 text-white': toast.type === 'warning',
        }"
      >
        <div class="flex items-center gap-3">
          <span v-if="toast.type === 'success'">✓</span>
          <span v-if="toast.type === 'error'">✕</span>
          <span v-if="toast.type === 'warning'">⚠</span>
          <span class="font-medium">{{ toast.message }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from "vue";
import { useFacilityStore } from "../stores/facility";
import { storeToRefs } from "pinia";
import { GoogleGenerativeAI } from "@google/generative-ai";
import draggable from "vuedraggable";
import { TrashIcon } from "@heroicons/vue/24/outline";

// Props
const props = defineProps({
  data: Array, // Selected facility IDs from hotel
  hotelData: Object, // Hotel information for AI context
});

// Emits
const emit = defineEmits(["change"]);

// Store
const facilityStore = useFacilityStore();
const { facilities, loading } = storeToRefs(facilityStore);

// Gemini AI Setup
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_KEY_2 = import.meta.env.VITE_GEMINI_API_KEY_2;
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-pro";
let genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
let currentApiKeyIndex = 1;

// State
const isGenerating = ref(false);
const submitting = ref(false);
const showModal = ref(false);
const showDeleteConfirm = ref(false);
const selectedFacilityIds = ref([]);
const imagePreview = ref(null);
const imageInput = ref(null);

// All available facilities
const allFacilities = computed(() => facilities.value?.data || []);

// Selected facilities with full data (for drag and drop)
const selectedFacilities = computed({
  get() {
    return selectedFacilityIds.value
      .map((id) => allFacilities.value.find((f) => f.id === id))
      .filter(Boolean);
  },
  set(newValue) {
    selectedFacilityIds.value = newValue.map((f) => f.id);
  },
});

// Manual form
const manualForm = reactive({
  name: "",
  icon: "",
  image: null,
  is_active: true,
});

// Toast
const toast = reactive({
  show: false,
  message: "",
  type: "success",
});

// Helper: Show toast
const showToast = (message, type = "success") => {
  toast.message = message;
  toast.type = type;
  toast.show = true;
  setTimeout(() => {
    toast.show = false;
  }, 3000);
};

// Helper: Switch API key
const switchToBackupKey = () => {
  if (currentApiKeyIndex === 1) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY_2);
    currentApiKeyIndex = 2;
    showToast("Switching to backup API key...", "warning");
    return true;
  }
  return false;
};

// ✅ Confirm Delete All
const confirmDeleteAll = () => {
  if (selectedFacilityIds.value.length === 0) {
    showToast("No facilities to delete", "warning");
    return;
  }
  showDeleteConfirm.value = true;
};

// ✅ Delete All Facilities
const deleteAllFacilities = () => {
  const count = selectedFacilityIds.value.length;
  selectedFacilityIds.value = [];
  emit("change", selectedFacilityIds.value);
  showDeleteConfirm.value = false;
  showToast(`🗑️ Removed all ${count} facilities`, "success");
};

// ✅ Generate facilities with AI
const generateWithAI = async (retryWithBackup = true) => {
  try {
    isGenerating.value = true;
    showToast("🤖 AI is generating facilities...", "success");

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const hotelContext = `
Hotel Name: ${props.hotelData?.name || "N/A"}
Hotel Type: ${props.hotelData?.type || "N/A"}
Description: ${props.hotelData?.description || "N/A"}
Location: ${
      props.hotelData?.location_map_title ||
      props.hotelData?.city?.name ||
      "N/A"
    }
Rating: ${props.hotelData?.rating || "N/A"} stars
`;

    const prompt = `You are a hotel facilities expert. Based on this hotel information, generate 10-15 essential hotel facilities.

Hotel Information:
${hotelContext}

Requirements:
1. Generate 10-15 common hotel facilities that would be appropriate for this hotel
2. Each facility should have a clear, concise name (in English)
3. Provide Font Awesome solid icon class for each facility (e.g., "fa-solid fa-wifi")
4. All facilities should be active (is_active: true)
5. DO NOT include order field - it will be set automatically

Common hotel facilities to consider:
- Free WiFi
- Swimming Pool
- Restaurant
- Fitness Center / Gym
- Free Parking
- 24-Hour Room Service
- Air Conditioning
- Airport Shuttle
- Spa & Wellness Center
- Business Center
- Laundry Service
- Bar / Lounge
- Non-Smoking Rooms
- Pet Friendly
- Electric Vehicle Charging Station
- Meeting Rooms
- Concierge Service
- Room Service
- Breakfast Included
- Mini Bar

Font Awesome icon suggestions:
- WiFi: fa-solid fa-wifi
- Pool: fa-solid fa-person-swimming
- Restaurant: fa-solid fa-utensils
- Gym: fa-solid fa-dumbbell
- Parking: fa-solid fa-square-parking
- Room Service: fa-solid fa-bell-concierge
- AC: fa-solid fa-temperature-low
- Shuttle: fa-solid fa-van-shuttle
- Spa: fa-solid fa-spa
- Business: fa-solid fa-briefcase
- Laundry: fa-solid fa-shirt
- Bar: fa-solid fa-martini-glass
- No Smoking: fa-solid fa-ban-smoking
- Pet: fa-solid fa-paw
- EV Charging: fa-solid fa-charging-station
- Meeting: fa-solid fa-users
- Concierge: fa-solid fa-bell-concierge
- Mini Bar: fa-solid fa-champagne-glasses
- Breakfast: fa-solid fa-mug-saucer

Return ONLY valid JSON array (no markdown, no explanation):
[
  {
    "name": "Free WiFi",
    "icon": "fa-solid fa-wifi",
    "is_active": true
  }
]

Generate facilities appropriate for a ${
      props.hotelData?.rating || "3"
    }-star hotel.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    console.log("AI Response:", text);

    // ✅ Remove markdown code blocks if present
    text = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Parse JSON
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const generatedFacilities = JSON.parse(jsonMatch[0]);

      if (
        Array.isArray(generatedFacilities) &&
        generatedFacilities.length > 0
      ) {
        console.log("Generated Facilities:", generatedFacilities);

        // ✅ Send to backend - it will check duplicates and return all facilities
        const backendResponse = await facilityStore.getOrCreateBulkAction({
          facilities: generatedFacilities,
        });

        console.log("Backend Response:", backendResponse);

        // ✅ Fix: Access the correct response structure
        // Backend returns: { status, message, result: { data: { facilities, stats } } }
        const facilitiesData = backendResponse.result?.facilities || [];
        const stats = backendResponse.result?.stats || {
          created: 0,
          existing: 0,
          total: 0,
        };

        showToast(
          `✅ ${stats.created} new, ${stats.existing} existing facilities ready!`,
          "success",
        );

        // ✅ Reload facilities list
        await facilityStore.getSimpleListAction();

        // ✅ Auto-select the generated facilities
        if (facilitiesData.length > 0) {
          const facilityIds = facilitiesData.map((f) => f.id);
          selectedFacilityIds.value = facilityIds;

          // Emit to parent
          emit("change", selectedFacilityIds.value);
        }
      }
    } else {
      throw new Error("Could not parse AI response");
    }
  } catch (error) {
    console.error("Error generating with AI:", error);

    if (
      (error.message?.includes("429") ||
        error.message?.includes("quota") ||
        error.message?.includes("rate limit")) &&
      retryWithBackup
    ) {
      if (switchToBackupKey()) {
        return await generateWithAI(false);
      }
    }

    showToast("❌ AI generation failed. Please add manually.", "error");
  } finally {
    isGenerating.value = false;
  }
};

// Open/Close modal
const openCreateModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  manualForm.name = "";
  manualForm.icon = "";
  manualForm.image = null;
  imagePreview.value = null;
};

// Image handling
const openFilePicker = () => {
  imageInput.value.click();
};

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    manualForm.image = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const removeImage = () => {
  manualForm.image = null;
  imagePreview.value = null;
};

// ✅ Create facility manually
const handleManualCreate = async () => {
  if (!manualForm.name.trim()) {
    showToast("Please enter facility name", "error");
    return;
  }

  submitting.value = true;

  try {
    const formData = new FormData();
    formData.append("name", manualForm.name.trim());
    if (manualForm.icon) {
      formData.append("icon", manualForm.icon);
    }
    if (manualForm.image) {
      formData.append("image", manualForm.image);
    }
    formData.append("is_active", manualForm.is_active);

    const response = await facilityStore.addNewAction(formData);

    showToast(response.message || "Facility created successfully!", "success");

    // Reload facilities
    await facilityStore.getSimpleListAction();

    // Auto-select the newly created facility
    if (response.data && response.data.id) {
      selectedFacilityIds.value.push(response.data.id);
      emit("change", selectedFacilityIds.value);
    }

    closeModal();
  } catch (error) {
    console.error("Error creating facility:", error);
    showToast(
      error.response?.data?.message || "Failed to create facility",
      "error",
    );
  } finally {
    submitting.value = false;
  }
};

// ✅ Facility selection change
const onFacilityChange = () => {
  emit("change", selectedFacilityIds.value);
};

// ✅ Remove facility from selection
const removeFacility = (id) => {
  selectedFacilityIds.value = selectedFacilityIds.value.filter(
    (fid) => fid !== id,
  );
  emit("change", selectedFacilityIds.value);
};

// ✅ Drag and drop reorder
const onDragEnd = () => {
  // After drag, selectedFacilities is already in new order
  // Extract IDs in new order
  selectedFacilityIds.value = selectedFacilities.value.map((f) => f.id);
  emit("change", selectedFacilityIds.value);
  showToast("Order updated!", "success");
};

// Watch for changes from parent
watch(
  () => props.data,
  (newData) => {
    if (newData && Array.isArray(newData)) {
      selectedFacilityIds.value = [...newData];
    }
  },
  { immediate: true },
);

// Initialize
onMounted(async () => {
  // Load all facilities
  if (!facilities.value) {
    await facilityStore.getSimpleListAction();
  }

  // Load selected facilities from props
  if (props.data && Array.isArray(props.data)) {
    selectedFacilityIds.value = [...props.data];
  }

  console.log(props.hotelData, props.data, "this is facilities");
});
</script>

<style scoped>
/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Toast transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateY(50px);
  opacity: 0;
}

/* Drag and drop cursor */
.drag-handle {
  cursor: move;
}
</style>
