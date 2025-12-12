<template>
  <div class="flex h-[62vh] bg-white">
    <!-- Left Side - Images -->
    <div class="w-2/3 pr-4 overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-base font-semibold text-[#FF613c]">Cruise Images</h2>
          <span class="text-xs text-gray-500"
            >{{ detail?.images?.length || 0 }} images</span
          >
        </div>

        <!-- All Images Grid -->
        <section class="mb-6">
          <div
            v-if="detail?.images && detail.images.length > 0"
            class="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            <div
              v-for="(image, index) in detail.images"
              :key="image.id || index"
              class="relative group"
            >
              <img
                :src="getImageUrl(image)"
                :alt="`Cruise image ${index + 1}`"
                class="w-full h-48 object-cover rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                @click="openImageModal(image)"
              />
              <div
                class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded"
              >
                {{ index + 1 }} / {{ detail.images.length }}
              </div>
            </div>
          </div>
          <div
            v-else
            class="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center"
          >
            <svg
              class="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            <p class="mt-2 text-sm text-gray-600">No images available</p>
          </div>
        </section>

        <!-- Cover Image Section -->
        <section class="mb-6" v-if="detail?.cover_image">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-sm font-semibold text-gray-700">Cover Image</h3>
          </div>
          <div class="relative">
            <img
              :src="detail.cover_image"
              alt="Cover image"
              class="w-full h-64 object-cover rounded-lg border border-gray-200"
            />
            <div
              class="absolute top-2 left-2 bg-[#FF613c] text-white text-xs px-2 py-1 rounded"
            >
              Cover
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Right Side - YouTube Video -->
    <div class="w-1/3 bg-gray-50 border-l border-gray-200 overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-base font-semibold text-[#FF613c]">Videos</h2>
        </div>

        <!-- English Video -->
        <section class="mb-6" v-if="detail?.youtube_link?.[0]?.en_link">
          <h3 class="text-xs font-medium text-gray-600 mb-2">English Video</h3>
          <div class="space-y-3">
            <div class="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                :src="`https://www.youtube.com/embed/${detail.youtube_link[0].en_link}`"
                class="w-full h-full"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </section>

        <!-- Myanmar Video -->
        <section class="mb-6" v-if="detail?.youtube_link?.[0]?.mm_link">
          <h3 class="text-xs font-medium text-gray-600 mb-2">Myanmar Video</h3>
          <div class="space-y-3">
            <div class="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                :src="`https://www.youtube.com/embed/${detail.youtube_link[0].mm_link}`"
                class="w-full h-full"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </section>

        <!-- No Videos State -->
        <div
          v-if="
            !detail?.youtube_link?.[0]?.en_link &&
            !detail?.youtube_link?.[0]?.mm_link
          "
          class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
        >
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            ></path>
          </svg>
          <p class="mt-2 text-sm text-gray-600">No videos available</p>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div
      v-if="selectedImage"
      @click="closeImageModal"
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    >
      <div class="relative max-w-5xl max-h-[90vh]" @click.stop>
        <button
          @click="closeImageModal"
          class="absolute -top-10 right-0 text-white hover:text-gray-300"
        >
          <svg
            class="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
        <img
          :src="getImageUrl(selectedImage)"
          alt="Full size image"
          class="max-w-full max-h-[90vh] object-contain rounded-lg"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  detail: {
    type: Object,
    required: true,
  },
});

const selectedImage = ref(null);

const getImageUrl = (image) => {
  if (typeof image === "string") {
    return image;
  }
  if (image?.image) {
    return image.image.startsWith("https")
      ? image.image
      : `/storage/images/${image.image}`;
  }
  return "";
};

const openImageModal = (image) => {
  selectedImage.value = image;
};

const closeImageModal = () => {
  selectedImage.value = null;
};
</script>

<style scoped>
.aspect-video {
  aspect-ratio: 16 / 9;
}
</style>
