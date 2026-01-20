<template>
  <div class="w-full p-6 mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-xl font-bold text-gray-800">Good To Know Items</h2>
      <div class="flex items-center gap-3">
        <button
          v-if="items.length === 0 && !isGenerating"
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
          <span>Add New Item</span>
        </button>
        <!-- deteleAll -->
        <button
          @click="deteleAll"
          class="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
        >
          <span>Delete All Items</span>
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
        🤖 AI is generating Good to Know items...
      </p>
      <p class="text-sm text-purple-600">
        Analyzing {{ productType }} information to create helpful tips
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

    <!-- Items List -->
    <div v-else-if="items.length > 0" class="mt-6">
      <draggable
        v-model="items"
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
                  <div class="flex items-center gap-3">
                    <!-- Font Awesome Icon Preview -->
                    <div
                      v-if="element.icon"
                      class="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 text-2xl text-gray-700"
                    >
                      <i :class="element.icon"></i>
                    </div>
                    <div
                      v-else
                      class="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200"
                    >
                      <span class="text-gray-400 text-xs">No Icon</span>
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
                      <span v-if="element.is_active" class="text-xl">
                        <EyeIcon class="w-5 h-5" />
                      </span>
                      <span v-else class="text-xl opacity-50">
                        <EyeSlashIcon class="w-5 h-5" />
                      </span>
                    </button>
                    <button
                      @click="openEditModal(element)"
                      class="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                      title="Edit"
                    >
                      <span class="text-xl">
                        <PencilIcon class="w-5 h-5" />
                      </span>
                    </button>
                    <button
                      @click="confirmDelete(element)"
                      class="p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <span class="text-xl">
                        <TrashIcon class="w-5 h-5" />
                      </span>
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
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <p class="mt-4 text-lg text-gray-600">
        No items found. Generate with AI or create manually!
      </p>
    </div>

    <!-- Create/Edit Modal -->
    <Transition name="modal">
      <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div
          class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0"
        >
          <!-- Background overlay -->
          <div
            class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
            @click="closeModal"
          ></div>

          <!-- Modal panel -->
          <div
            class="relative inline-block w-full max-w-3xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
          >
            <!-- Header -->
            <div
              class="flex items-center justify-between px-6 py-4 border-b border-gray-200"
            >
              <h3 class="text-2xl font-bold text-gray-900">
                {{ isEditMode ? "Edit Item" : "Create New Items" }}
              </h3>
              <div class="flex justify-end items-center gap-x-4">
                <button
                  type="submit"
                  @click="handleSubmit"
                  class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="submitting"
                >
                  {{
                    submitting ? "Saving..." : isEditMode ? "Update" : "Create"
                  }}
                </button>
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
            </div>

            <!-- Body -->
            <div class="px-6 py-6 max-h-[70vh] overflow-y-auto">
              <form>
                <!-- Multiple Items (Create Mode) -->
                <div v-if="!isEditMode" class="space-y-6">
                  <div
                    v-for="(item, index) in formData.items"
                    :key="index"
                    class="p-5 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div class="flex items-center justify-between mb-4">
                      <h4 class="text-lg font-semibold text-gray-800">
                        Item {{ index + 1 }}
                      </h4>
                      <button
                        v-if="formData.items.length > 1"
                        type="button"
                        @click="removeItem(index)"
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
                          v-model="item.title"
                          type="text"
                          placeholder="Enter title"
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
                          v-model="item.description_mm"
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
                          v-model="item.description_en"
                          rows="3"
                          placeholder="Enter English description"
                          required
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                        ></textarea>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            class="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Font Awesome Icon Class
                          </label>
                          <input
                            v-model="item.icon"
                            type="text"
                            placeholder="fa-solid fa-home"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                          />
                          <p class="mt-1 text-xs text-gray-500">
                            Examples: fa-solid fa-home, fa-solid fa-clock,
                            fa-solid fa-info-circle
                          </p>
                          <a
                            href="https://fontawesome.com/icons"
                            target="_blank"
                            class="text-xs text-blue-600 hover:underline"
                          >
                            Browse Font Awesome icons →
                          </a>
                        </div>
                        <div>
                          <label
                            class="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Icon Preview
                          </label>
                          <div
                            class="w-full h-[116px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50"
                          >
                            <div
                              v-if="item.icon"
                              class="text-5xl text-gray-700"
                            >
                              <i :class="item.icon"></i>
                            </div>
                            <div
                              v-else
                              class="text-center text-gray-400 text-xs px-4"
                            >
                              <i class="fa-solid fa-icons text-3xl mb-2"></i>
                              <p>Icon Preview</p>
                            </div>
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
                            v-model.number="item.order"
                            type="number"
                            placeholder="0"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                          />
                        </div>
                        <div class="flex items-end">
                          <label class="flex items-center gap-2 cursor-pointer">
                            <input
                              v-model="item.is_active"
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
                    v-if="formData.items.length < 10"
                    type="button"
                    @click="addItem"
                    class="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors font-medium"
                  >
                    + Add Another Item
                  </button>
                </div>

                <!-- Single Item (Edit Mode) -->
                <div v-else class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Title <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="editingItem.title"
                      type="text"
                      placeholder="Enter title"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Description (Myanmar) <span class="text-red-500">*</span>
                    </label>
                    <textarea
                      v-model="editingItem.description_mm"
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
                      v-model="editingItem.description_en"
                      rows="3"
                      placeholder="Enter English description"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                    ></textarea>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Font Awesome Icon Class
                      </label>
                      <input
                        v-model="editingItem.icon"
                        type="text"
                        placeholder="fa-solid fa-home"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      />
                      <p class="mt-1 text-xs text-gray-500">
                        Examples: fa-solid fa-home, fa-solid fa-clock, fa-solid
                        fa-info-circle
                      </p>
                      <a
                        href="https://fontawesome.com/icons"
                        target="_blank"
                        class="text-xs text-blue-600 hover:underline"
                      >
                        Browse Font Awesome icons →
                      </a>
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Icon Preview
                      </label>
                      <div
                        class="w-full h-[116px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50"
                      >
                        <div
                          v-if="editingItem.icon"
                          class="text-5xl text-gray-700"
                        >
                          <i :class="editingItem.icon"></i>
                        </div>
                        <div
                          v-else
                          class="text-center text-gray-400 text-xs px-4"
                        >
                          <i class="fa-solid fa-icons text-3xl mb-2"></i>
                          <p>Icon Preview</p>
                        </div>
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
                        v-model.number="editingItem.order"
                        type="number"
                        placeholder="0"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      />
                    </div>
                    <div class="flex items-end">
                      <label class="flex items-center gap-2 cursor-pointer">
                        <input
                          v-model="editingItem.is_active"
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

                <!-- Modal Actions -->
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
          <!-- Background overlay -->
          <div
            class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
            @click="showDeleteModal = false"
          ></div>

          <!-- Modal panel -->
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
                <strong>"{{ itemToDelete?.title }}"</strong>?
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
import { useGoodToKnowStore } from "../stores/goodToKnow";
import draggable from "vuedraggable";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/vue/24/solid";
import Swal from "sweetalert2";

// Props
const props = defineProps({
  id: {
    type: [Number, String],
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  productData: {
    type: Object,
    default: () => ({}),
  },
});

// Store
const store = useGoodToKnowStore();

// Gemini AI Setup
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_KEY_2 = import.meta.env.VITE_GEMINI_API_KEY_2;
let genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
let currentApiKeyIndex = 1;

// State
const items = ref([]);
const loading = ref(false);
const submitting = ref(false);
const isGenerating = ref(false);
const showModal = ref(false);
const showDeleteModal = ref(false);
const isEditMode = ref(false);
const itemToDelete = ref(null);

// Computed
const productType = computed(() => {
  return props.type === "hotel" ? "Hotel" : "Ticket";
});

const knowableType = computed(() => {
  return props.type === "hotel"
    ? "App\\Models\\Hotel"
    : "App\\Models\\EntranceTicket";
});

// Form Data
const formData = reactive({
  knowable_type: knowableType.value,
  knowable_id: props.id,
  items: [
    {
      title: "",
      description_mm: "",
      description_en: "",
      icon: "",
      order: 0,
      is_active: true,
    },
  ],
});

const editingItem = reactive({
  id: null,
  title: "",
  description_mm: "",
  description_en: "",
  icon: "",
  order: 0,
  is_active: true,
});

// Toast notification
const toast = reactive({
  show: false,
  message: "",
  type: "success",
});

// Helper function to switch API keys
const switchToBackupKey = () => {
  if (currentApiKeyIndex === 1) {
    console.log("Switching to backup API key...");
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY_2);
    currentApiKeyIndex = 2;
    showToast("Switching to backup API key...", "warning");
    return true;
  }
  return false;
};

// Generate Good to Know items with AI
const generateWithAI = async (retryWithBackup = true) => {
  try {
    isGenerating.value = true;
    showToast("🤖 AI is generating Good to Know items...", "success");

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Build context from product data - For entrance tickets/attractions
    const productContext = `
Attraction Name: ${props.productData?.name || "N/A"}
Description: ${props.productData?.description || "N/A"}
Full Description (English): ${props.productData?.full_description_en || "N/A"}
Location: ${props.productData?.location_map_title || "N/A"}
City: ${props.productData?.cities?.map((c) => c.name).join(", ") || "N/A"}
Categories: ${
      props.productData?.categories?.map((c) => c.name).join(", ") || "N/A"
    }
Coordinates: ${props.productData?.latitude || "N/A"}, ${
      props.productData?.longitude || "N/A"
    }
Ticket Price: ${props.productData?.lowest_variation_price || "N/A"} THB
Walk-in Price: ${props.productData?.lowest_walk_in_price || "N/A"} THB
`;

    const prompt = `You are a travel expert creating "Good to Know" tips for a tourist attraction/entertainment venue in Thailand.

Based on this attraction information:
${productContext}

Generate exactly 8 helpful "Good to Know" items in JSON format. Each item should provide valuable, practical information for travelers visiting this attraction.

Requirements:
1. Create 8 unique items covering different important aspects:
   - Opening hours and best time to visit
   - Ticket booking information (advance booking, walk-in, etc.)
   - Dress code requirements (especially for temples/cultural sites)
   - What to bring (camera, water, comfortable shoes, sunscreen, etc.)
   - Available facilities (restrooms, parking, food court, lockers, etc.)
   - Photography and video rules
   - Accessibility information (wheelchair access, elevators, etc.)
   - Local tips and important warnings
   
2. Each title should be SHORT (3-5 words maximum) in English only
3. Descriptions should be informative and helpful (2-3 sentences each)
4. Provide BOTH Myanmar (Burmese) and English descriptions
5. Use Font Awesome icon classes (e.g., "fa-solid fa-clock", "fa-solid fa-camera")
6. Use appropriate Font Awesome solid icons
7. Set order from 0 to 7 (most important first)
8. All items should be active (is_active: true)
9. Focus on PRACTICAL visitor information specific to Thailand attractions
10. Make it helpful for international tourists visiting Thailand

Font Awesome icon suggestions for attractions:
- Time/Schedule: fa-solid fa-clock, fa-solid fa-calendar, fa-solid fa-hourglass-half
- Tickets/Pricing: fa-solid fa-ticket, fa-solid fa-money-bill-wave, fa-solid fa-credit-card
- Location/Map: fa-solid fa-map-marker-alt, fa-solid fa-location-dot, fa-solid fa-map
- Dress Code: fa-solid fa-shirt, fa-solid fa-user-tie, fa-solid fa-person-dress
- Photography: fa-solid fa-camera, fa-solid fa-camera-retro, fa-solid fa-image
- Facilities: fa-solid fa-restroom, fa-solid fa-wheelchair, fa-solid fa-square-parking
- Food/Drinks: fa-solid fa-utensils, fa-solid fa-mug-hot, fa-solid fa-droplet
- Weather/Items: fa-solid fa-umbrella, fa-solid fa-sun, fa-solid fa-shoe-prints
- Rules/Info: fa-solid fa-info-circle, fa-solid fa-circle-info, fa-solid fa-triangle-exclamation
- Language: fa-solid fa-language, fa-solid fa-comments
- Children: fa-solid fa-baby, fa-solid fa-child
- Transport: fa-solid fa-car, fa-solid fa-bus, fa-solid fa-taxi

IMPORTANT: Return ONLY valid JSON array. No markdown formatting, no code blocks, no additional text.

Format:
[
  {
    "title": "Opening Hours",
    "description_mm": "နေ့စဉ် နံနက် ၉:၀၀ နာရီမှ ညနေ ၆:၀၀ နာရီအထိ ဖွင့်လှစ်ထားပါသည်။ နောက်သုံး၀င်ခွင့်သည် ပိတ်ရက်မတိုင်မီ ၃၀ မိနစ်ဖြစ်ပါသည်။ လူစည်ကားမှုရှောင်ရှားရန် စောစောရောက်ရှိရန် အကြံပြုပါသည်။",
    "description_en": "Open daily from 9:00 AM to 6:00 PM. Last entry is 30 minutes before closing time. It's recommended to arrive early to avoid crowds and enjoy a better experience.",
    "icon": "fa-solid fa-clock",
    "order": 0,
    "is_active": true
  },
  {
    "title": "Dress Code Required",
    "description_mm": "လေးစားမှုရှိသော ၀တ်စားဆင်ယင်မှု လိုအပ်ပါသည်။ ပခုံးနှင့် ဒူးများကို ဖုံးအုပ်ထားသော အ၀တ်အစားများ ၀တ်ဆင်ရမည်။ လက်မဲ့အင်္ကျီနှင့် ဘောင်းဘီတို၀တ်ခွင့် မပြုပါ။",
    "description_en": "Respectful clothing is required for entry. Shoulders and knees must be covered. Sleeveless tops, shorts, and revealing clothing are not permitted inside the venue.",
    "icon": "fa-solid fa-shirt",
    "order": 1,
    "is_active": true
  },
  {
    "title": "Photography Guidelines",
    "description_mm": "ဓာတ်ပုံရိုက်ခွင့်ပြုပါသည်။ သို့သော် အချို့နေရာများတွင် ဖလက်ရှမသုံးရန်နှင့် သီးသန့်ခွင့်ပြုချက်လိုအပ်နိုင်ပါသည်။ ဗီဒီယိုရိုက်ကူးခအတွက် သီးသန့်ကောက်ခံနိုင်ပါသည်။",
    "description_en": "Photography is generally allowed, but flash photography may be prohibited in certain areas. Video recording might require an additional fee. Please respect signage and staff instructions.",
    "icon": "fa-solid fa-camera",
    "order": 2,
    "is_active": true
  },
  {
    "title": "What to Bring",
    "description_mm": "ရေဘူး၊ နေကာထီး၊ နေကာမျက်မှန်နှင့် သက်သောင့်သက်သာရှိသော ဖိနပ်များ ယူဆောင်လာရန် အကြံပြုပါသည်။ ထီးကလေးများအတွက် အပိုအ၀တ်အစားယူလာသင့်ပါသည်။",
    "description_en": "Bring water bottle, sunscreen, sunglasses, and comfortable walking shoes. For children, bring extra clothes and snacks. Power bank for your phone is also recommended.",
    "icon": "fa-solid fa-bag-shopping",
    "order": 3,
    "is_active": true
  }
]

Generate 8 items total following this exact format. Focus on making the information practical, accurate, and helpful for visitors to this Thailand attraction.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("AI Response:", text);

    // Parse the JSON response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const generatedItems = JSON.parse(jsonMatch[0]);

      if (Array.isArray(generatedItems) && generatedItems.length > 0) {
        // Populate formData with AI-generated items
        formData.items = generatedItems;

        showToast("✅ AI generated 8 items! Review and save them.", "success");

        // Automatically open the modal to let user review
        openCreateModal();
      } else {
        throw new Error("Invalid AI response format");
      }
    } else {
      throw new Error("Could not parse AI response");
    }
  } catch (error) {
    console.error("Error generating with AI:", error);

    // Check if it's a quota/rate limit error
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

// Methods
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

  // Only reset if not coming from AI generation
  if (formData.items.length === 1 && formData.items[0].title === "") {
    resetForm();
  }
};

const openEditModal = (item) => {
  isEditMode.value = true;
  showModal.value = true;
  Object.assign(editingItem, item);
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const resetForm = () => {
  formData.knowable_type = knowableType.value;
  formData.knowable_id = props.id;
  formData.items = [
    {
      title: "",
      description_mm: "",
      description_en: "",
      icon: "",
      order: 0,
      is_active: true,
    },
  ];

  editingItem.id = null;
  editingItem.title = "";
  editingItem.description_mm = "";
  editingItem.description_en = "";
  editingItem.icon = "";
  editingItem.order = 0;
  editingItem.is_active = true;
};

const addItem = () => {
  if (formData.items.length < 10) {
    formData.items.push({
      title: "",
      description_mm: "",
      description_en: "",
      icon: "",
      order: formData.items.length,
      is_active: true,
    });
  }
};

const removeItem = (index) => {
  formData.items.splice(index, 1);
};

const handleSubmit = async () => {
  submitting.value = true;

  try {
    if (isEditMode.value) {
      // Update existing item
      const { id, ...updateData } = editingItem;

      const response = await store.updateAction(updateData, id);

      // Update local items
      const index = items.value.findIndex((item) => item.id === id);
      if (index !== -1) {
        items.value[index] = { ...items.value[index], ...updateData };
      }

      showToast("Item updated successfully!");
    } else {
      // Create new items
      const response = await store.addNewAction(formData);

      // Add new items to local list
      window.location.reload();

      showToast("Items created successfully!");
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

const toggleStatus = async (item) => {
  try {
    const updateData = {
      is_active: !item.is_active,
    };

    await store.updateAction(updateData, item.id);
    item.is_active = !item.is_active;

    showToast(
      `Item ${item.is_active ? "activated" : "deactivated"} successfully!`,
    );
  } catch (error) {
    console.error("Error:", error);
    showToast("Failed to update status", "error");
  }
};

const confirmDelete = (item) => {
  itemToDelete.value = item;
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  submitting.value = true;

  try {
    await store.deleteAction(itemToDelete.value.id);

    // Remove from local list
    items.value = items.value.filter(
      (item) => item.id !== itemToDelete.value.id,
    );

    showToast("Item deleted successfully!");
    showDeleteModal.value = false;
    itemToDelete.value = null;
  } catch (error) {
    console.error("Error:", error);
    showToast("Failed to delete item", "error");
  } finally {
    submitting.value = false;
  }
};

const deteleAll = async () => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        for (let i = 0; i < items.value.length; i++) {
          await store.deleteAction(items.value[i].id);
          // items.value.splice(i, 1);
        }
        showToast("All Items are deleted");
        items.value = [];
      } catch (error) {
        console.log(error);
      }
    }
  });
};

const onDragEnd = async () => {
  // Update order based on new positions
  const orderData = {
    items: items.value.map((item, index) => ({
      id: item.id,
      order: index,
    })),
  };

  const frmData = new FormData();
  for (let x = 0; x < items.value.length; x++) {
    const element = items.value[x];
    frmData.append(`items[${x}][id]`, element.id);
    frmData.append(`items[${x}][order]`, x);
  }
  frmData.append("_method", "PUT");

  try {
    await store.updateOrderAction(frmData);

    // Update local order values
    items.value.forEach((item, index) => {
      item.order = index;
    });

    showToast("Order updated successfully!");
  } catch (error) {
    console.error("Error:", error);
    showToast("Failed to update order", "error");
  }
};

// Initialize - Load existing items from props
onMounted(() => {
  console.log(props.productData);

  if (
    props.productData?.good_to_knows &&
    props.productData.good_to_knows.length > 0
  ) {
    items.value = [...props.productData.good_to_knows].sort(
      (a, b) => a.order - b.order,
    );
  }
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

.modal-enter-active > div > div:last-child,
.modal-leave-active > div > div:last-child {
  transition: transform 0.3s ease;
}

.modal-enter-from > div > div:last-child,
.modal-leave-to > div > div:last-child {
  transform: scale(0.95);
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
</style>
