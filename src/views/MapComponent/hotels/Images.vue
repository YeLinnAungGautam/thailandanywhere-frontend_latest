<template>
  <div class="flex h-[62vh] bg-white">
    <!-- Left Side - Images -->
    <!-- <div class="w-2/3 pr-4 overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-base font-semibold text-[#FF613c]">Hotel Images</h2>
        </div>

        <ImageCenter
          :partImages="buildingImages"
          :part="'building'"
          :editImage="editImage"
          :deleteImage="deleteImage"
          :openImagePicker="openImagePicker"
          :loading="loading"
          :getImageUrl="getImageUrl"
        />

        <ImageCenter
          :partImages="restaurantImages"
          :part="'reception'"
          :editImage="editImage"
          :deleteImage="deleteImage"
          :openImagePicker="openImagePicker"
          :loading="loading"
          :getImageUrl="getImageUrl"
        />

        <ImageCenter
          :partImages="facilitiesImages"
          :part="'facilities'"
          :editImage="editImage"
          :deleteImage="deleteImage"
          :openImagePicker="openImagePicker"
          :loading="loading"
          :getImageUrl="getImageUrl"
        />

        <ImageCenter
          :partImages="fitnessImages"
          :part="'fitness'"
          :editImage="editImage"
          :deleteImage="deleteImage"
          :openImagePicker="openImagePicker"
          :loading="loading"
          :getImageUrl="getImageUrl"
        />

        <ImageCenter
          :partImages="otherImages"
          :part="'other'"
          :editImage="editImage"
          :deleteImage="deleteImage"
          :openImagePicker="openImagePicker"
          :loading="loading"
          :getImageUrl="getImageUrl"
        />
        <div
          v-if="loading"
          class="fixed inset-0 bg-white/30 rounded-3xl backdrop-blur-2xl flex items-center justify-center z-50"
        >
          <div class="bg-white p-4 rounded-lg">
            <div class="flex items-center space-x-2">
              <div
                class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FF613c]"
              ></div>
              <span>Processing...</span>
            </div>
          </div>
        </div>
      </div>
    </div> -->

    <!-- Right Side - YouTube Video (unchanged) -->
    <div class="w-[400px] border-l border-gray-200 overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-base font-semibold text-[#FF613c]">Videos</h2>
        </div>

        <!-- English Video -->
        <section class="mb-6">
          <div v-if="detail?.youtube_link?.[0]?.en_link" class="space-y-3">
            <div class="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                :src="`https://www.youtube.com/embed/${detail.youtube_link[0].en_link}`"
                class="w-full h-full"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </div>
          </div>
          <div
            v-if="
              !detail?.youtube_link?.[0]?.en_link &&
              detail?.youtube_link?.[0]?.mm_link
            "
            class="space-y-3"
          >
            <div class="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                :src="`https://www.youtube.com/embed/${detail.youtube_link[0].mm_link}`"
                class="w-full h-full"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </div>
          </div>
          <div
            class="text-sm text-gray-600 flex justify-start items-center"
            v-if="
              !detail?.youtube_link ||
              (!detail?.youtube_link?.[0]?.en_link &&
                !detail?.youtube_link?.[0]?.mm_link)
            "
          >
            coming soon
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from "vue";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  BuildingOfficeIcon,
  DocumentPlusIcon,
} from "@heroicons/vue/24/outline";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useHotelStore } from "../../../stores/hotel"; // Adjust the path as necessary
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
import ImageCenter from "./ImageCenter.vue";

const props = defineProps({
  detail: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["refresh-detail"]);

// Inject the book store (assuming it's provided in the parent component)
const hotelStore = useHotelStore(); // You might need to adjust this based on your setup
const toast = useToast();

// Reactive data
const imageInput = ref(null);
const editImageInput = ref(null);
const selectedImageType = ref("other");
const loading = ref(false);

// Computed properties for categorized images
const buildingImages = computed(() => {
  if (!props.detail?.images) return [];
  return props.detail.images.filter((img) => img.title == "building");
});

const restaurantImages = computed(() => {
  if (!props.detail?.images) return [];
  return props.detail.images.filter((img) => img.title == "reception");
});

const facilitiesImages = computed(() => {
  if (!props.detail?.images) return [];
  return props.detail.images.filter((img) => img.title == "facilities");
});

const fitnessImages = computed(() => {
  if (!props.detail?.images) return [];
  return props.detail.images.filter((img) => img.title == "fitness");
});

const otherImages = computed(() => {
  if (!props.detail?.images) return [];
  return props.detail.images.filter(
    (img) => img.title == "other" || !img.title || img.title == null
  );
});

// Edit modal state
const editModal = ref({
  isOpen: false,
  image: null,
  newImageFile: null,
  newImagePreview: null,
});

// Methods
const getImageUrl = (image) => {
  if (image.preview) {
    return image.preview;
  }
  if (image.image) {
    // Assuming your images are served from a base URL
    return image.image.startsWith("https")
      ? image.image
      : `/storage/images/${image.image}`;
  }
  return "";
};

const closeEditModal = () => {
  // Clean up preview URL
  if (editModal.value.newImagePreview) {
    URL.revokeObjectURL(editModal.value.newImagePreview);
  }

  editModal.value = {
    isOpen: false,
    image: null,
    newImageFile: null,
    newImagePreview: null,
  };

  // Clear the file input
  if (editImageInput.value) {
    editImageInput.value.value = "";
  }
};

// Cleanup on unmount
onMounted(() => {
  // Component initialization if needed
});
</script>

<style scoped>
.aspect-video {
  aspect-ratio: 16 / 20;
}
</style>
