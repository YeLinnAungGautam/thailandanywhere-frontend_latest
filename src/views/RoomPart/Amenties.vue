<template>
  <div class="room-amenities-section">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-700">
          အခန်းသုံးပစ္စည်းများ
        </h3>
        <div class="flex items-center gap-2">
          <button
            v-if="localAmenities.length === 0 && !isGenerating"
            @click="generateWithAI"
            class="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm"
          >
            <span class="text-xl">✨</span>
            <span>AI နဲ့ အလိုအလျောက်ထည့်မယ်</span>
          </button>
          <button
            @click="openCreateModal"
            class="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm"
          >
            <span class="text-xl">+</span>
            <span>အသစ်ထည့်မယ်</span>
          </button>
        </div>
      </div>

      <p class="text-sm text-gray-500">
        "AI နဲ့ အလိုအလျောက်ထည့်မယ်" ကို နှိပ်ပြီး အလိုအလျောက် ဖန်တီးနိုင်ပါတယ်၊
        သို့မဟုတ် ကိုယ်တိုင် ထည့်လို့ရပါတယ်။
      </p>
    </div>

    <!-- AI Generation Loading State -->
    <div
      v-if="isGenerating"
      class="flex flex-col items-center justify-center py-8 bg-purple-50 rounded-xl border-2 border-purple-200 mb-6"
    >
      <div
        class="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"
      ></div>
      <p class="text-base font-semibold text-purple-900 mb-2">
        🤖 AI က အခန်းသုံးပစ္စည်းများကို ဖန်တီးနေပါတယ်...
      </p>
      <p class="text-sm text-purple-600">
        အခန်းအချက်အလက်များကို လေ့လာပြီး သင့်လျော်တဲ့ ပစ္စည်းများကို
        ဖန်တီးနေပါတယ်
      </p>
    </div>

    <!-- Amenities List -->
    <div class="amenities-list">
      <draggable
        v-model="localAmenities"
        @end="handleReorder"
        item-key="title"
        handle=".drag-handle"
        class="space-y-4"
        tag="div"
      >
        <template #item="{ element, index }">
          <div
            class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-200"
            :class="{ 'opacity-60': element.is_active === false }"
          >
            <div class="p-5">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3 flex-1">
                  <!-- Drag Handle -->
                  <div
                    class="drag-handle cursor-move text-gray-400 hover:text-gray-600 py-2"
                  >
                    <svg
                      class="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"
                      ></path>
                    </svg>
                  </div>

                  <!-- Content -->
                  <div class="flex-1">
                    <h4 class="text-lg font-semibold text-gray-800 mb-2">
                      {{ element.title }}
                    </h4>

                    <div class="space-y-2">
                      <div
                        v-for="(item, itemIndex) in element.list"
                        :key="itemIndex"
                        class="flex items-start gap-2 text-sm"
                      >
                        <div
                          class="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"
                        ></div>
                        <span class="text-gray-600">{{ item.list_name }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-2 ml-4">
                  <button
                    type="button"
                    @click.stop="openEditModal(element, index)"
                    class="p-2 rounded-lg hover:bg-blue-50 transition-colors text-blue-600"
                    title="Edit"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    @click.stop="confirmDelete(element, index)"
                    class="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                    title="Delete"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </draggable>

      <!-- Empty State -->
      <div
        v-if="localAmenities.length === 0"
        class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
      >
        <div class="text-gray-400 mb-4">
          <svg
            class="w-16 h-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <p class="text-gray-500 mb-2">အခန်းသုံးပစ္စည်းများ မရှိသေးပါ</p>
        <p class="text-sm text-gray-400">
          "Generate with AI" သို့မဟုတ် "Add Amenities" နှိပ်ပြီး စတင်ပါ
        </p>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Modal :isOpen="showModal" @closeModal="closeModal">
      <div
        class="w-full max-w-4xl overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50"
        >
          <h3 class="text-xl font-bold text-gray-900">
            {{ isEditMode ? "ပြင်ဆင်မယ်" : "အသစ်ထည့်မယ်" }}
          </h3>
          <button
            @click="closeModal"
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

        <!-- Content -->
        <div class="px-6 py-6 max-h-[70vh] overflow-y-auto">
          <div class="space-y-6">
            <!-- Title Input -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                အမျိုးအစား <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.title"
                type="text"
                placeholder="ဥပမာ: အခန်းပစ္စည်းများ, ရေချိုးခန်းပစ္စည်းများ"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                @input="validateForm"
              />
            </div>

            <!-- Amenity Items -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <label class="block text-sm font-medium text-gray-700">
                  ပစ္စည်းများ <span class="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  @click="addItem"
                  class="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  ထည့်မယ်
                </button>
              </div>

              <div
                v-for="(item, index) in formData.list"
                :key="index"
                class="flex items-center gap-3"
              >
                <div class="flex-1">
                  <input
                    v-model="item.list_name"
                    type="text"
                    :placeholder="`ပစ္စည်း ${index + 1}`"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    @input="validateForm"
                  />
                </div>
                <button
                  v-if="formData.list.length > 1"
                  type="button"
                  @click="removeItem(index)"
                  class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                  title="ဖယ်ရှားမယ်"
                >
                  <svg
                    class="w-5 h-5"
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

              <p v-if="formData.list.length === 0" class="text-sm text-red-500">
                အနည်းဆုံး ပစ္စည်း ၁ ခု လိုအပ်ပါတယ်
              </p>
            </div>

            <!-- Status Toggle -->
            <div class="flex items-center gap-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="formData.is_active"
                  type="checkbox"
                  class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span class="text-sm font-medium text-gray-700"
                  >အသုံးပြုမယ် (အခန်းအချက်အလက်မှာ ပြမယ်)</span
                >
              </label>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200"
        >
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium text-sm"
          >
            ပယ်ဖျက်မယ်
          </button>
          <button
            type="button"
            @click="saveAmenity"
            :disabled="!isFormValid"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isEditMode ? "ပြင်မယ်" : "ထည့်မယ်" }}
          </button>
        </div>
      </div>
    </Modal>

    <!-- Delete Confirmation Modal -->
    <Modal :isOpen="showDeleteModal" @closeModal="cancelDelete">
      <div
        class="w-full max-w-md overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-gray-900">ဖျက်မလား?</h3>
            <button
              @click="cancelDelete"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                class="w-5 h-5"
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

          <p class="text-gray-600 mb-6">
            '{{ deletingAmenity?.title }}' ကို ဖျက်မှာ သေချာလား?
          </p>

          <div class="flex justify-end gap-3">
            <button
              @click="cancelDelete"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium text-sm"
            >
              မလုပ်တော့ဘူး
            </button>
            <button
              @click="handleDelete"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm"
            >
              ဖျက်မယ်
            </button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, watch, toRaw, nextTick, computed } from "vue";
import { useToast } from "vue-toastification";
import { GoogleGenerativeAI } from "@google/generative-ai";
import draggable from "vuedraggable";
import Modal from "../../components/Modal.vue";

const props = defineProps({
  roomData: {
    type: Object,
    required: true,
  },
  initialAmenities: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:amenities"]);

const toast = useToast();

// API Configuration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_KEY_2 = import.meta.env.VITE_GEMINI_API_KEY_2;
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL;
let genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
let currentApiKeyIndex = 1;

// State
const localAmenities = ref([]);
const isGenerating = ref(false);
const showModal = ref(false);
const showDeleteModal = ref(false);
const isEditMode = ref(false);
const editingIndex = ref(-1);
const deletingIndex = ref(-1);
const deletingAmenity = ref(null);
const isFormValid = ref(false);
const isUpdating = ref(false); // ✅ Prevent loop

// Form data
const formData = ref({
  title: "",
  list: [{ list_name: "" }],
  is_active: true,
});

// ✅ Initialize only once
const initializeAmenities = () => {
  if (props.initialAmenities && Array.isArray(props.initialAmenities)) {
    localAmenities.value = JSON.parse(JSON.stringify(props.initialAmenities));
  }
};

// ✅ Watch with debounce to prevent loop
let watchTimeout = null;
watch(
  () => props.initialAmenities,
  (newAmenities) => {
    if (isUpdating.value) return; // Skip if we're updating

    clearTimeout(watchTimeout);
    watchTimeout = setTimeout(() => {
      if (newAmenities && Array.isArray(newAmenities)) {
        localAmenities.value = JSON.parse(JSON.stringify(newAmenities));
      }
    }, 100);
  },
  { deep: true },
);

// Initialize on mount
initializeAmenities();

// ✅ Emit helper with flag
const emitUpdate = (amenities) => {
  isUpdating.value = true;
  emit("update:amenities", amenities);

  nextTick(() => {
    setTimeout(() => {
      isUpdating.value = false;
    }, 200);
  });
};

// Generate with AI
const generateWithAI = async (retryWithBackup = true) => {
  try {
    isGenerating.value = true;

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const roomContext = `
Room Information:
- Name: ${props.roomData.name}
- Description: ${props.roomData.description || "N/A"}
- Max Persons: ${props.roomData.max_person}
- Room Size: ${props.roomData.room_size || "N/A"}
- Room Type: ${
      props.roomData.is_double
        ? "Double Bed"
        : props.roomData.is_twin
        ? "Twin Bed"
        : "Standard"
    }
- Has Breakfast: ${props.roomData.has_breakfast ? "Yes" : "No"}
- Is Extra Bed: ${props.roomData.is_extra ? "Yes" : "No"}
- Hotel: ${props.roomData.hotel?.name || "N/A"}
- Hotel Category: ${props.roomData.hotel?.category || "N/A"}
`;

    const prompt = `You are a hotel expert creating comprehensive room amenities list.

Based on this room information:
${roomContext}

Generate a structured list of room amenities in JSON format.

REQUIRED STRUCTURE:
Generate amenities in these categories (choose 4-5 most relevant):

1. Room Features (Essential amenities)
2. Bathroom (Bathroom amenities)
3. Entertainment & Technology (Entertainment options)
4. Comfort & Bedding (Comfort features)
5. Services (Room services)
6. Accessibility (Accessibility features if applicable)
7. View & Outdoor (View and balcony features)
8. Safety & Security (Safety features)

For each amenity category, include:
- A descriptive title
- 3-8 specific items that belong to that category
- Make items practical and relevant to the room type

Requirements:
- Be realistic and practical
- Match the room type and hotel category
- Include standard amenities for the room type
- Add unique amenities based on room description
- All items should be active
- Use proper formatting

Return ONLY valid JSON in this exact format (no markdown):
[
  {
    "title": "Room Features",
    "list": [
      {"list_name": "Air conditioning"},
      {"list_name": "Private balcony"},
      {"list_name": "Desk/workspace"},
      {"list_name": "Sitting area"},
      {"list_name": "Iron/ironing board (on request)"}
    ]
  },
  {
    "title": "Bathroom",
    "list": [
      {"list_name": "Private bathroom"},
      {"list_name": "Hairdryer"},
      {"list_name": "Premium toiletries"},
      {"list_name": "Bathrobes and slippers"}
    ]
  }
]

IMPORTANT: Generate 4-6 amenity categories with relevant items.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const generatedAmenities = JSON.parse(jsonMatch[0]);

      if (Array.isArray(generatedAmenities) && generatedAmenities.length > 0) {
        localAmenities.value = generatedAmenities;
        emitUpdate(generatedAmenities);
        toast.success(
          `✅ AI က ${generatedAmenities.length} မျိုး ဖန်တီးပေးပြီးပါပြီ!`,
        );
      } else {
        throw new Error("Invalid AI response format");
      }
    } else {
      throw new Error("Could not parse AI response");
    }
  } catch (error) {
    console.error("Error generating amenities with AI:", error);

    if (
      (error.message?.includes("429") ||
        error.message?.includes("quota") ||
        error.message?.includes("rate limit")) &&
      retryWithBackup
    ) {
      if (switchToBackupKey()) {
        toast.warning("🔄 Backup API key နဲ့ ထပ်ကြိုးစားနေပါတယ်...");
        return await generateWithAI(false);
      }
    }

    toast.error("❌ AI generation မအောင်မြင်ပါ။ ကိုယ်တိုင် ထည့်ပါ။");
  } finally {
    isGenerating.value = false;
  }
};

const switchToBackupKey = () => {
  if (currentApiKeyIndex === 1 && GEMINI_API_KEY_2) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY_2);
    currentApiKeyIndex = 2;
    return true;
  }
  return false;
};

// Form validation
const validateForm = () => {
  const hasTitle = formData.value.title.trim().length > 0;
  const hasItems =
    formData.value.list.length > 0 &&
    formData.value.list.every((item) => item.list_name.trim().length > 0);
  isFormValid.value = hasTitle && hasItems;
};

// Modal handlers
const openCreateModal = () => {
  isEditMode.value = false;
  editingIndex.value = -1;
  formData.value = {
    title: "",
    list: [{ list_name: "" }],
    is_active: true,
  };
  validateForm();
  nextTick(() => {
    showModal.value = true;
  });
};

const openEditModal = (amenity, index) => {
  const rawAmenity = toRaw(amenity);
  const clonedAmenity = JSON.parse(JSON.stringify(rawAmenity));

  isEditMode.value = true;
  editingIndex.value = index;
  formData.value = clonedAmenity;
  validateForm();

  nextTick(() => {
    showModal.value = true;
  });
  console.log("Editing Amenity:", clonedAmenity);
};

const closeModal = () => {
  showModal.value = false;

  setTimeout(() => {
    formData.value = {
      title: "",
      list: [{ list_name: "" }],
      is_active: true,
    };
    isEditMode.value = false;
    editingIndex.value = -1;
    isFormValid.value = false;
  }, 300);
};

const saveAmenity = () => {
  if (!isFormValid.value) return;

  const plainData = JSON.parse(JSON.stringify(formData.value));

  if (isEditMode.value && editingIndex.value !== -1) {
    const newAmenities = [...localAmenities.value];
    newAmenities[editingIndex.value] = plainData;
    localAmenities.value = newAmenities;
    // toast.success("✅ ပြင်ဆင်ပြီးပါပြီ!");
  } else {
    localAmenities.value = [...localAmenities.value, plainData];
    // toast.success("✅ အသစ်ထည့်ပြီးပါပြီ!");
  }

  emitUpdate([...localAmenities.value]);
  closeModal();
};

// Item management
const addItem = () => {
  formData.value.list.push({ list_name: "" });
  validateForm();
};

const removeItem = (index) => {
  formData.value.list.splice(index, 1);
  validateForm();
};

// Delete handlers
const confirmDelete = (amenity, index) => {
  deletingIndex.value = index;
  deletingAmenity.value = toRaw(amenity);
  showDeleteModal.value = true;
  console.log("Deleting Amenity:", amenity);
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  setTimeout(() => {
    deletingIndex.value = -1;
    deletingAmenity.value = null;
  }, 300);
};

const handleDelete = () => {
  if (
    deletingIndex.value === -1 ||
    deletingIndex.value >= localAmenities.value.length
  ) {
    return;
  }

  const newAmenities = [...localAmenities.value];
  newAmenities.splice(deletingIndex.value, 1);
  localAmenities.value = newAmenities;

  emitUpdate([...localAmenities.value]);
  // toast.success("✅ ဖျက်ပြီးပါပြီ!");

  showDeleteModal.value = false;
  setTimeout(() => {
    deletingIndex.value = -1;
    deletingAmenity.value = null;
  }, 300);
};

// Reorder
const handleReorder = () => {
  emitUpdate([...localAmenities.value]);
};
</script>

<style scoped>
.sortable-ghost {
  opacity: 0.4;
  background: #f3f4f6;
}
</style>
