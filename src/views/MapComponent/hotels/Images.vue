<template>
  <div class="flex h-[62vh] bg-white">
    <!-- Left Side - Images -->
    <div class="w-2/3 pr-4 overflow-y-auto">
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

        <!-- Loading Indicator -->
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
    </div>

    <!-- Right Side - YouTube Video (unchanged) -->
    <div class="w-1/3 bg-gray-50 border-l border-gray-200 overflow-y-auto">
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

const openImagePicker = (type) => {
  selectedImageType.value = type;
  imageInput.value?.click();
};

const handleImageUpload = async (event) => {
  const files = Array.from(event.target.files);
  try {
    loading.value = true;

    for (const file of files) {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", selectedImageType.value);
      // Call the API to add the image
      const response = await hotelStore.addImageAction(
        props.detail.id,
        formData
      );

      if (response.status !== 1) {
        // throw new Error(response.message || 'Failed to upload image');
        toast.error(response.message || "Failed to upload image");
      } else {
        toast.success("Image uploaded successfully!");
      }
    }

    // Clear input
    event.target.value = "";

    // Refresh the hotel detail to get updated images
    emit("refresh-detail");
  } catch (error) {
    console.error("Error uploading images:", error);
    toast.error("Error uploading images. Please try again.");
  } finally {
    loading.value = false;
  }
};

const editImage = (image) => {
  editModal.value = {
    isOpen: true,
    image: image,
    newImageFile: null,
    newImagePreview: null,
  };
  selectedImageType.value = image.title;
};

const handleEditImageSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    editModal.value.newImageFile = file;
    editModal.value.newImagePreview = URL.createObjectURL(file);
  }
};

const saveImageEdit = async () => {
  try {
    loading.value = true;

    const formData = new FormData();
    if (editModal.value.newImageFile) {
      formData.append("image", editModal.value.newImageFile);
    }
    formData.append("title", selectedImageType.value);
    // Call the API to edit the image
    const res = await hotelStore.editImageAction(
      props.detail.id,
      editModal.value.image.id,
      formData
    );

    if (res.status !== 1) {
      // throw new Error(res.message || 'Failed to update image');
      toast.error(res.message || "Failed to update image");
    } else {
      toast.success("Image updated successfully!");
    }

    // Refresh the hotel detail to get updated images
    emit("refresh-detail");

    closeEditModal();
  } catch (error) {
    console.error("Error updating image:", error);
    toast.error("Error updating image. Please try again.");
  } finally {
    loading.value = false;
  }
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

const deleteImage = async (image) => {
  Swal.fire({
    title: "Are you sure?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        loading.value = true;

        // Call the API to delete the image
        const res = await hotelStore.deleteImageAction(
          props.detail.id,
          image.id
        );

        if (res.status !== 1) {
          // throw new Error(res.message || 'Failed to delete image');
          toast.error(res.message || "Failed to delete image");
        } else {
          toast.success("Image deleted successfully!");
        }
        // Refresh the hotel detail to get updated images
        emit("refresh-detail");
      } catch (error) {
        console.error("Error deleting image:", error);
        toast.error("Error deleting image. Please try again.");
      } finally {
        loading.value = false;
      }
    }
  });
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
