<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <!-- Header -->
      <div class="mb-6">
        <p class="text-gray-600">
          Add searchable keywords for better search results
        </p>
      </div>

      <!-- Current Slugs Display -->
      <div class="mb-6" v-if="currentSlugs.length > 0">
        <h3 class="text-lg font-semibold text-gray-700 mb-3">Current Slugs:</h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(slug, index) in currentSlugs"
            :key="index"
            class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
          >
            {{ slug }}
            <button
              @click="removeSlug(index)"
              class="ml-2 text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        </div>
      </div>

      <!-- Add New Slug -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Add New Slug
        </label>
        <div class="flex gap-2">
          <input
            v-model="newSlug"
            @keyup.enter="addNewSlug"
            type="text"
            placeholder="Enter slug keyword..."
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            @click="addNewSlug"
            :disabled="!newSlug.trim()"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>

      <!-- Bulk Add Textarea -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Bulk Add Slugs (one per line)
        </label>
        <textarea
          v-model="bulkSlugs"
          rows="4"
          placeholder="Enter multiple slugs, one per line..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
        <button
          @click="addBulkSlugs"
          :disabled="!bulkSlugs.trim()"
          class="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Bulk Slugs
        </button>
      </div>

      <!-- Suggested Slugs (if you want to add auto-suggestions) -->
      <div class="mb-6" v-if="suggestedSlugs.length > 0">
        <h3 class="text-lg font-semibold text-gray-700 mb-3">
          Suggested Slugs:
        </h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="(slug, index) in suggestedSlugs"
            :key="index"
            @click="addSuggestedSlug(slug)"
            class="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
          >
            + {{ slug }}
          </button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 pt-4 border-t">
        <button
          @click="saveSlugs"
          :disabled="loading || currentSlugs.length === 0"
          class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span v-if="loading" class="animate-spin">⏳</span>
          {{ loading ? "Saving..." : "Save Slugs" }}
        </button>

        <button
          @click="clearAllSlugs"
          :disabled="loading || currentSlugs.length === 0"
          class="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear All
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useHotelStore } from "../../stores/hotel"; // Adjust path as needed
import { useToast } from "vue-toastification";

// Props
const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
  type: {
    type: String,
    default: "hotel",
  },
  slugs: {
    type: Array,
    default: () => [],
  },
});

// Store
const hotelStore = useHotelStore();
const toast = useToast();

// Reactive data
const currentSlugs = ref([]);
const newSlug = ref("");
const bulkSlugs = ref("");
const loading = ref(false);
const message = ref("");
const messageType = ref("success");

// Example suggested slugs (you can make this dynamic)
const suggestedSlugs = ref([
  "luxury hotel",
  "business hotel",
  "budget hotel",
  "boutique hotel",
  "city center",
  "near airport",
  "beach resort",
]);

// Methods
const addNewSlug = () => {
  const slug = newSlug.value.trim().toLowerCase();
  if (slug && !currentSlugs.value.includes(slug)) {
    currentSlugs.value.push(slug);
    newSlug.value = "";
  }
};

const addBulkSlugs = () => {
  const slugs = bulkSlugs.value
    .split("\n")
    .map((slug) => slug.trim().toLowerCase())
    .filter((slug) => slug && !currentSlugs.value.includes(slug));

  currentSlugs.value.push(...slugs);
  bulkSlugs.value = "";
};

const addSuggestedSlug = (slug) => {
  if (!currentSlugs.value.includes(slug.toLowerCase())) {
    currentSlugs.value.push(slug.toLowerCase());
  }
};

const removeSlug = (index) => {
  currentSlugs.value.splice(index, 1);
};

const clearAllSlugs = () => {
  if (confirm("Are you sure you want to clear all slugs?")) {
    currentSlugs.value = [];
  }
};

const saveSlugs = async () => {
  if (currentSlugs.value.length === 0) {
    showMessage("Please add at least one slug", "error");
    return;
  }

  loading.value = true;
  message.value = "";

  try {
    const data = {
      slugs: currentSlugs.value,
    };

    const response = await hotelStore.addSlugAction(data, props.id);

    if (response.status === 1) {
      toast.success(response.message);
      // Update current slugs with response data
      if (response.data && response.data.slugs) {
        currentSlugs.value = response.data.slugs;
      }
    } else {
      // showMessage(response.message || "Failed to save slugs", "error");
      toast.error(response.message || "Failed to save slugs");
    }
  } catch (error) {
    console.error("Error saving slugs:", error);
    toast.error("Failed to save slugs");
  } finally {
    loading.value = false;
  }
};

// Load initial data (if you have an endpoint to get current slugs)
onMounted(() => {
  // You can add logic here to fetch current slugs if needed
  // For example: loadCurrentSlugs()

  // Example: Load current slugs from props
  currentSlugs.value = props.slugs || [];
});
</script>
