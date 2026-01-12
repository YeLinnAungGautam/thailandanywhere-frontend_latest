<template>
  <div class="w-full p-6 mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-xl font-bold text-gray-800">Key Highlights</h2>
      <div class="flex items-center gap-3">
        <button
          v-if="highlights.length === 0 && !isGenerating"
          @click="generateWithAI"
          class="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
        >
          <span class="text-xl">✨</span>
          <span>Generate with AI</span>
        </button>
        <button
          @click="openCreateModal"
          class="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
        >
          <span class="text-xl">+</span>
          <span>Add New Highlight</span>
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
        🤖 AI is generating key highlights...
      </p>
      <p class="text-sm text-purple-600">
        Analyzing {{ highlightType }} information to create highlights
      </p>
    </div>

    <!-- Loading State -->
    <div
      v-else-if="loading"
      class="flex flex-col items-center justify-center py-16"
    >
      <div
        class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"
      ></div>
      <p class="mt-4 text-gray-600">Loading...</p>
    </div>

    <!-- Highlights List -->
    <div v-else-if="highlights.length > 0" class="mt-6">
      <draggable
        v-model="highlights"
        @end="onDragEnd"
        item-key="id"
        handle=".drag-handle"
        class="space-y-4"
        tag="div"
      >
        <template #item="{ element }">
          <div
            class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
            :class="{ 'opacity-50': !element.is_active }"
          >
            <div class="flex items-start p-5">
              <!-- Drag Handle -->
              <div
                class="drag-handle cursor-move mr-4 text-gray-400 hover:text-gray-600 py-2"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"
                  ></path>
                </svg>
              </div>

              <!-- Content -->
              <div class="flex-1">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center gap-4">
                    <!-- Image Preview -->
                    <div
                      v-if="element.image_url"
                      class="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 border-gray-200"
                    >
                      <img
                        :src="getImageUrl(element.image_url)"
                        :alt="element.title"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      v-else
                      class="w-24 h-24 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-lg border-2 border-gray-200"
                    >
                      <span class="text-gray-400 text-xs">No Image</span>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-800">
                        {{ element.title }}
                      </h3>
                      <span
                        class="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        Order: {{ element.order }}
                      </span>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center gap-2">
                    <button
                      @click="toggleStatus(element)"
                      class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      :title="element.is_active ? 'Deactivate' : 'Activate'"
                    >
                      <EyeIcon v-if="element.is_active" class="w-5 h-5" />
                      <EyeSlashIcon v-else class="w-5 h-5 opacity-50" />
                    </button>
                    <button
                      @click="openEditModal(element)"
                      class="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                      title="Edit"
                    >
                      <PencilIcon class="w-5 h-5" />
                    </button>
                    <button
                      @click="confirmDelete(element)"
                      class="p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <TrashIcon class="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <!-- Descriptions -->
                <div class="space-y-3">
                  <div class="border-l-4 border-blue-500 pl-4">
                    <strong class="text-sm font-semibold text-gray-700"
                      >Myanmar:</strong
                    >
                    <p class="mt-1 text-sm text-gray-600">
                      {{ element.description_mm }}
                    </p>
                  </div>
                  <div class="border-l-4 border-green-500 pl-4">
                    <strong class="text-sm font-semibold text-gray-700"
                      >English:</strong
                    >
                    <p class="mt-1 text-sm text-gray-600">
                      {{ element.description_en }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <svg
        class="mx-auto h-24 w-24 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
      </svg>
      <p class="mt-4 text-lg text-gray-600">
        No highlights found. Generate with AI or add manually!
      </p>
    </div>

    <!-- Create/Edit Modal -->
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
            class="relative inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
          >
            <div
              class="flex items-center justify-between px-6 py-4 border-b border-gray-200"
            >
              <h3 class="text-2xl font-bold text-gray-900">
                {{ isEditMode ? "Edit Highlight" : "Create New Highlights" }}
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

            <div class="px-6 py-6 max-h-[70vh] overflow-y-auto">
              <form @submit.prevent="handleSubmit">
                <!-- Multiple Highlights (Create Mode) -->
                <div v-if="!isEditMode" class="space-y-6">
                  <div
                    v-for="(highlight, index) in formData.highlights"
                    :key="index"
                    class="p-5 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div class="flex items-center justify-between mb-4">
                      <h4 class="text-lg font-semibold text-gray-800">
                        Highlight {{ index + 1 }}
                      </h4>
                      <button
                        v-if="formData.highlights.length > 1"
                        type="button"
                        @click="removeHighlight(index)"
                        class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>

                    <div class="space-y-4">
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Title <span class="text-red-500">*</span>
                        </label>
                        <input
                          v-model="highlight.title"
                          type="text"
                          placeholder="Enter highlight title"
                          required
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Description (Myanmar)
                          <span class="text-red-500">*</span>
                        </label>
                        <textarea
                          v-model="highlight.description_mm"
                          rows="3"
                          placeholder="Enter Myanmar description"
                          required
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                        ></textarea>
                      </div>

                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Description (English)
                          <span class="text-red-500">*</span>
                        </label>
                        <textarea
                          v-model="highlight.description_en"
                          rows="3"
                          placeholder="Enter English description"
                          required
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                        ></textarea>
                      </div>

                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Image <span class="text-red-500">*</span>
                        </label>
                        <input
                          type="file"
                          @change="handleImageChange($event, index)"
                          accept="image/jpeg,image/png,image/jpg,image/gif"
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        />
                        <p class="mt-1 text-xs text-gray-500">
                          Accepted formats: JPEG, PNG, JPG, GIF (max 2MB)
                        </p>
                        <!-- Image Preview -->
                        <div
                          v-if="highlight.imagePreview"
                          class="mt-3 relative inline-block"
                        >
                          <img
                            :src="highlight.imagePreview"
                            alt="Preview"
                            class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                          />
                          <button
                            type="button"
                            @click="removeImage(index)"
                            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Order</label
                          >
                          <input
                            v-model.number="highlight.order"
                            type="number"
                            placeholder="0"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                          />
                        </div>
                        <div class="flex items-end">
                          <label class="flex items-center gap-2 cursor-pointer">
                            <input
                              v-model="highlight.is_active"
                              type="checkbox"
                              class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span class="text-sm font-medium text-gray-700"
                              >Active</span
                            >
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    v-if="formData.highlights.length < 5"
                    type="button"
                    @click="addHighlight"
                    class="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors font-medium"
                  >
                    + Add Another Highlight
                  </button>
                </div>

                <!-- Single Highlight (Edit Mode) -->
                <div v-else class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Title <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="editingHighlight.title"
                      type="text"
                      placeholder="Enter highlight title"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Description (Myanmar) <span class="text-red-500">*</span>
                    </label>
                    <textarea
                      v-model="editingHighlight.description_mm"
                      rows="3"
                      placeholder="Enter Myanmar description"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                    ></textarea>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Description (English) <span class="text-red-500">*</span>
                    </label>
                    <textarea
                      v-model="editingHighlight.description_en"
                      rows="3"
                      placeholder="Enter English description"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                    ></textarea>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Image
                    </label>
                    <input
                      type="file"
                      @change="handleEditImageChange"
                      accept="image/jpeg,image/png,image/jpg,image/gif"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                    <p class="mt-1 text-xs text-gray-500">
                      Leave empty to keep current image
                    </p>
                    <!-- Current/New Image Preview -->
                    <div class="mt-3">
                      <div
                        v-if="editingHighlight.imagePreview"
                        class="relative inline-block"
                      >
                        <img
                          :src="editingHighlight.imagePreview"
                          alt="Preview"
                          class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                        />
                        <button
                          type="button"
                          @click="removeEditImage"
                          class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                      <div
                        v-else-if="editingHighlight.image_url"
                        class="relative inline-block"
                      >
                        <img
                          :src="getImageUrl(editingHighlight.image_url)"
                          alt="Current"
                          class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                        />
                        <span
                          class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center py-1"
                        >
                          Current Image
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 mb-2"
                        >Order</label
                      >
                      <input
                        v-model.number="editingHighlight.order"
                        type="number"
                        placeholder="0"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      />
                    </div>
                    <div class="flex items-end">
                      <label class="flex items-center gap-2 cursor-pointer">
                        <input
                          v-model="editingHighlight.is_active"
                          type="checkbox"
                          class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span class="text-sm font-medium text-gray-700"
                          >Active</span
                        >
                      </label>
                    </div>
                  </div>
                </div>

                <div
                  class="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200"
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
                    class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="submitting"
                  >
                    {{
                      submitting
                        ? "Saving..."
                        : isEditMode
                        ? "Update"
                        : "Create"
                    }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirmation Modal -->
    <Transition name="modal">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div
          class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0"
        >
          <div
            class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
            @click="showDeleteModal = false"
          ></div>

          <div
            class="relative inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
          >
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-gray-900">Confirm Delete</h3>
                <button
                  @click="showDeleteModal = false"
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

              <p class="text-gray-600 mb-2">
                Are you sure you want to delete
                <strong>"{{ highlightToDelete?.title }}"</strong>?
              </p>
              <p class="text-sm text-red-600 font-medium">
                This action cannot be undone.
              </p>

              <div class="flex justify-end gap-3 mt-6">
                <button
                  @click="showDeleteModal = false"
                  class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  @click="handleDelete"
                  class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="submitting"
                >
                  {{ submitting ? "Deleting..." : "Delete" }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div
        v-if="toast.show"
        class="fixed bottom-6 right-6 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all"
        :class="{
          'bg-green-500 text-white': toast.type === 'success',
          'bg-red-500 text-white': toast.type === 'error',
          'bg-yellow-500 text-white': toast.type === 'warning',
        }"
      >
        <div class="flex items-center gap-3">
          <span v-if="toast.type === 'success'" class="text-2xl">✓</span>
          <span v-if="toast.type === 'error'" class="text-2xl">✕</span>
          <span v-if="toast.type === 'warning'" class="text-2xl">⚠</span>
          <span class="font-medium">{{ toast.message }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useKeyHighLightStore } from "../stores/keyHighLight";
import draggable from "vuedraggable";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/vue/24/solid";

const props = defineProps({
  id: {
    type: [Number, String],
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  highlightData: {
    type: Object,
    default: () => ({}),
  },
});

const store = useKeyHighLightStore();

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_KEY_2 = import.meta.env.VITE_GEMINI_API_KEY_2;
let genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
let currentApiKeyIndex = 1;

const highlights = ref([]);
const loading = ref(false);
const submitting = ref(false);
const isGenerating = ref(false);
const showModal = ref(false);
const showDeleteModal = ref(false);
const isEditMode = ref(false);
const highlightToDelete = ref(null);

const highlightType = computed(() => {
  return props.type === "hotel" ? "Hotel" : "Attraction";
});

const highlightTypeModel = computed(() => {
  return props.type === "hotel" ? "App\\Models\\Hotel" : "App\\Models\\Product";
});

const formData = reactive({
  highlights: [
    {
      title: "",
      description_mm: "",
      description_en: "",
      highlightable_type: highlightTypeModel.value,
      highlightable_id: props.id,
      image: null,
      imagePreview: null,
      order: 0,
      is_active: true,
    },
  ],
});

const editingHighlight = reactive({
  id: null,
  title: "",
  description_mm: "",
  description_en: "",
  highlightable_type: highlightTypeModel.value,
  highlightable_id: props.id,
  image: null,
  image_url: null,
  imagePreview: null,
  order: 0,
  is_active: true,
});

const toast = reactive({
  show: false,
  message: "",
  type: "success",
});

const getImageUrl = (filename) => {
  return `/storage/images/${filename}`;
};

const switchToBackupKey = () => {
  if (currentApiKeyIndex === 1) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY_2);
    currentApiKeyIndex = 2;
    showToast("Switching to backup API key...", "warning");
    return true;
  }
  return false;
};

const generateWithAI = async (retryWithBackup = true) => {
  try {
    isGenerating.value = true;
    showToast("🤖 AI is generating key highlights...", "success");

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const highlightContext = `
Type: ${props.type}
Name: ${props.highlightData?.name || "N/A"}
Description: ${props.highlightData?.description || "N/A"}
Full Description: ${props.highlightData?.full_description || "N/A"}
Location: ${
      props.highlightData?.location_map_title ||
      props.highlightData?.city?.name ||
      "N/A"
    }
Facilities: ${props.highlightData?.facilities || "N/A"}
Rating: ${props.highlightData?.rating || "N/A"}
`;

    const prompt = `You are a travel marketing expert creating key highlight titles and descriptions for a ${props.type}.

Based on this information:
${highlightContext}

Generate exactly 4 key highlights in JSON format. Each highlight should emphasize the most attractive and unique features.

Requirements:
1. Create 4 unique highlights focusing on: location/access, facilities/amenities, experience/atmosphere, and value/service
2. Each title should be catchy and concise (3-6 words)
3. Descriptions should be compelling and highlight benefits (2-3 sentences)
4. Provide both Myanmar (Burmese) and English descriptions
5. Set order from 0 to 3
6. All items should be active (is_active: true)
7. DO NOT include any image URLs or image-related fields

Example highlight types to focus on:
- "Prime Location" - Easy access to attractions, transport
- "Modern Amenities" - Quality facilities and services
- "Authentic Experience" - Unique cultural or local atmosphere
- "Exceptional Value" - Great service, comfort, or pricing

Return ONLY valid JSON in this exact format (no markdown, no additional text):
[
  {
    "title": "Prime City Location",
    "description_mm": "မြို့လယ်ခေါင်တွင်တည်ရှိပြီး အဓိကနေရာများသို့ အလွယ်တကူသွားရောက်နိုင်သည်။ BTS station မှ ၅ မိနစ်အကွာတွင်ရှိသည်။",
    "description_en": "Located in the heart of the city with easy access to major attractions. Just 5 minutes walk from BTS station.",
    "order": 0,
    "is_active": true
  }
]

Focus on creating compelling highlights that would attract guests to stay at this ${props.type}.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const generatedHighlights = JSON.parse(jsonMatch[0]);

      if (
        Array.isArray(generatedHighlights) &&
        generatedHighlights.length > 0
      ) {
        // Add required fields to each highlight
        formData.highlights = generatedHighlights.map((h, index) => ({
          ...h,
          highlightable_type: highlightTypeModel.value,
          highlightable_id: props.id,
          image: null,
          imagePreview: null,
        }));

        showToast(
          `✅ AI generated ${generatedHighlights.length} highlights! Add images and save.`,
          "success"
        );
        openCreateModal();
      } else {
        throw new Error("Invalid AI response format");
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
        showToast("🔄 Retrying with backup API key...", "warning");
        return await generateWithAI(false);
      }
    }

    showToast("❌ AI generation failed. Please create manually.", "error");
  } finally {
    isGenerating.value = false;
  }
};

const handleImageChange = (event, index) => {
  const file = event.target.files[0];
  if (file) {
    formData.highlights[index].image = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      formData.highlights[index].imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = (index) => {
  formData.highlights[index].image = null;
  formData.highlights[index].imagePreview = null;
};

const handleEditImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    editingHighlight.image = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      editingHighlight.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const removeEditImage = () => {
  editingHighlight.image = null;
  editingHighlight.imagePreview = null;
};

const showToast = (message, type = "success") => {
  toast.message = message;
  toast.type = type;
  toast.show = true;
  setTimeout(() => {
    toast.show = false;
  }, 3000);
};

const openCreateModal = () => {
  isEditMode.value = false;
  showModal.value = true;

  if (formData.highlights.length === 1 && formData.highlights[0].title === "") {
    resetForm();
  }
};

const openEditModal = (highlight) => {
  isEditMode.value = true;
  showModal.value = true;
  Object.assign(editingHighlight, {
    ...highlight,
    image: null,
    imagePreview: null,
  });
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const resetForm = () => {
  formData.highlights = [
    {
      title: "",
      description_mm: "",
      description_en: "",
      highlightable_type: highlightTypeModel.value,
      highlightable_id: props.id,
      image: null,
      imagePreview: null,
      order: 0,
      is_active: true,
    },
  ];

  editingHighlight.id = null;
  editingHighlight.title = "";
  editingHighlight.description_mm = "";
  editingHighlight.description_en = "";
  editingHighlight.image = null;
  editingHighlight.image_url = null;
  editingHighlight.imagePreview = null;
  editingHighlight.order = 0;
  editingHighlight.is_active = true;
};

const addHighlight = () => {
  if (formData.highlights.length < 5) {
    formData.highlights.push({
      title: "",
      description_mm: "",
      description_en: "",
      highlightable_type: highlightTypeModel.value,
      highlightable_id: props.id,
      image: null,
      imagePreview: null,
      order: formData.highlights.length,
      is_active: true,
    });
  }
};

const removeHighlight = (index) => {
  formData.highlights.splice(index, 1);
};

const handleSubmit = async () => {
  submitting.value = true;

  try {
    if (isEditMode.value) {
      const formDataToSend = new FormData();
      formDataToSend.append("title", editingHighlight.title);
      formDataToSend.append("description_mm", editingHighlight.description_mm);
      formDataToSend.append("description_en", editingHighlight.description_en);
      formDataToSend.append(
        "highlightable_type",
        editingHighlight.highlightable_type
      );
      formDataToSend.append(
        "highlightable_id",
        editingHighlight.highlightable_id
      );
      formDataToSend.append("order", editingHighlight.order);
      formDataToSend.append("is_active", editingHighlight.is_active ? 1 : 0);

      if (editingHighlight.image) {
        formDataToSend.append("image", editingHighlight.image);
      }

      formDataToSend.append("_method", "PUT");

      let response = await store.updateAction(
        formDataToSend,
        editingHighlight.id
      );

      console.log(response, "tisi ");

      const index = highlights.value.findIndex(
        (h) => h.id === editingHighlight.id
      );
      if (index !== -1) {
        highlights.value[index] = response.message;
      }

      // const index = highlights.value.findIndex(
      //   (item) => item.id === editingHighlight.id
      // );
      // if (index !== -1) {
      //   highlights.value[index] = { ...highlights.value[index], response.data.result };
      // }

      showToast("Highlight updated successfully!");
    } else {
      const formDataToSend = new FormData();

      formData.highlights.forEach((highlight, index) => {
        formDataToSend.append(`highlights[${index}][title]`, highlight.title);
        formDataToSend.append(
          `highlights[${index}][description_mm]`,
          highlight.description_mm
        );
        formDataToSend.append(
          `highlights[${index}][description_en]`,
          highlight.description_en
        );
        formDataToSend.append(
          `highlights[${index}][highlightable_type]`,
          highlight.highlightable_type
        );
        formDataToSend.append(
          `highlights[${index}][highlightable_id]`,
          highlight.highlightable_id
        );
        formDataToSend.append(`highlights[${index}][order]`, highlight.order);
        formDataToSend.append(
          `highlights[${index}][is_active]`,
          highlight.is_active ? 1 : 0
        );

        if (highlight.image) {
          formDataToSend.append(`highlights[${index}][image]`, highlight.image);
        }
      });

      const response = await store.addNewAction(formDataToSend);

      // if (response.data && Array.isArray(response.data)) {
      //   highlights.value.push(...response.data);
      // }

      window.location.reload();

      showToast("Highlights created successfully!");
    }

    closeModal();
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = error.response?.data?.message || "An error occurred";
    showToast(errorMessage, "error");
  } finally {
    submitting.value = false;
  }
};

const toggleStatus = async (highlight) => {
  try {
    const formDataToSend = new FormData();
    formDataToSend.append("is_active", highlight.is_active ? 0 : 1);
    formDataToSend.append("title", highlight.title);
    formDataToSend.append("description_mm", highlight.description_mm);
    formDataToSend.append("description_en", highlight.description_en);
    formDataToSend.append("highlightable_type", highlight.highlightable_type);
    formDataToSend.append("highlightable_id", highlight.highlightable_id);
    formDataToSend.append("_method", "PUT");

    await store.updateAction(formDataToSend, highlight.id);
    highlight.is_active = !highlight.is_active;

    showToast(
      `Highlight ${
        highlight.is_active ? "activated" : "deactivated"
      } successfully!`
    );
  } catch (error) {
    console.error("Error:", error);
    showToast("Failed to update status", "error");
  }
};

const confirmDelete = (highlight) => {
  highlightToDelete.value = highlight;
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  submitting.value = true;

  try {
    await store.deleteAction(highlightToDelete.value.id);

    highlights.value = highlights.value.filter(
      (h) => h.id !== highlightToDelete.value.id
    );

    showToast("Highlight deleted successfully!");
    showDeleteModal.value = false;
    highlightToDelete.value = null;
  } catch (error) {
    console.error("Error:", error);
    showToast("Failed to delete highlight", "error");
  } finally {
    submitting.value = false;
  }
};

const onDragEnd = async () => {
  const frmData = new FormData();
  for (let x = 0; x < highlights.value.length; x++) {
    const element = highlights.value[x];
    frmData.append(`items[${x}][id]`, element.id);
    frmData.append(`items[${x}][order]`, x);
  }
  frmData.append("_method", "PUT");

  try {
    await store.updateOrderAction(frmData);

    highlights.value.forEach((highlight, index) => {
      highlight.order = index;
    });

    showToast("Order updated successfully!");
  } catch (error) {
    console.error("Error:", error);
    showToast("Failed to update order", "error");
  }
};

onMounted(() => {
  if (
    props.highlightData?.key_highlights &&
    props.highlightData.key_highlights.length > 0
  ) {
    highlights.value = [...props.highlightData.key_highlights].sort(
      (a, b) => a.order - b.order
    );
  }
});
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

.modal-enter-active > div > div:last-child,
.modal-leave-active > div > div:last-child {
  transition: transform 0.3s ease;
}

.modal-enter-from > div > div:last-child,
.modal-leave-to > div > div:last-child {
  transform: scale(0.95);
}

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
</style>
