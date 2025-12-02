<template>
  <div class="flex h-[62vh] bg-white">
    <!-- Left Sidebar - Room List -->
    <div class="w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto">
      <div class="p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-base font-semibold text-[#FF613c]">Hotel Rooms</h2>
          <span class="text-xs text-gray-500"
            >{{ roomList.length }} rooms type</span
          >
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-8">
          <div
            class="animate-spin h-8 w-8 border-4 border-[#FF613c] border-t-transparent rounded-full"
          ></div>
        </div>

        <!-- Room List -->
        <div v-else-if="roomList.length > 0" class="space-y-2">
          <div
            v-for="room in roomList"
            :key="room.id"
            @click="selectRoom(room)"
            :class="[
              'p-3 rounded-lg border cursor-pointer transition-all hover:border-[#FF613c]',
              selectedRoom?.id === room.id
                ? 'border-[#FF613c] bg-[#FF613c]/5'
                : 'border-gray-200 bg-white',
            ]"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="text-sm font-medium text-gray-900">
                  {{ room.name }}
                </h3>
                <p class="text-xs text-gray-500 mt-1">
                  Max: {{ room.max_person }} person{{
                    room.max_person > 1 ? "s" : ""
                  }}
                </p>
                <div class="flex items-center mt-2 space-x-2">
                  <div class="flex items-center space-x-1">
                    <div
                      :class="[
                        'w-2 h-2 rounded-full',
                        room.images && room.images.length > 0
                          ? 'bg-green-400'
                          : 'bg-red-400',
                      ]"
                    ></div>
                    <span class="text-xs text-gray-500">
                      {{ room.images?.length || 0 }} images
                    </span>
                  </div>
                </div>
              </div>
              <div v-if="selectedRoom?.id === room.id" class="ml-2">
                <div class="w-2 h-2 bg-[#FF613c] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-8">
          <BuildingOfficeIcon class="mx-auto h-12 w-12 text-gray-400" />
          <p class="mt-2 text-sm text-gray-600">No rooms found</p>
          <p class="text-xs text-gray-400 mt-1">This hotel has no rooms yet</p>
        </div>
      </div>
    </div>

    <!-- Right Content Area - Room Details -->
    <div class="flex-1 overflow-y-auto">
      <div class="p-6">
        <div
          v-if="!selectedRoom"
          class="flex items-center justify-center h-full"
        >
          <div class="text-center">
            <BuildingOfficeIcon class="mx-auto h-16 w-16 text-gray-300" />
            <h3 class="mt-4 text-lg font-medium text-gray-900">
              Select a Room
            </h3>
            <p class="mt-2 text-sm text-gray-500">
              Choose a room from the list to view details
            </p>
          </div>
        </div>

        <div v-else>
          <!-- Room Header -->
          <div class="flex justify-between items-start mb-6">
            <div>
              <h1 class="text-xl font-semibold text-gray-900">
                {{ selectedRoom.name }}
              </h1>
              <p class="text-sm text-gray-500 mt-1">
                Room ID: {{ selectedRoom.id }}
              </p>
            </div>
            <div class="flex gap-2">
              <button
                @click="openEditModal('details')"
                v-if="part == 'detail'"
                class="text-xs bg-[#FF613c] text-white px-3 py-1 rounded hover:bg-[#FF613c]/90"
              >
                <PencilSquareIcon class="w-4 h-4 inline-block mr-1" /> Edit
                Details
              </button>
              <!-- <button
                @click="openEditModal('images')"
                v-if="part == 'image'"
                class="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                <PhotoIcon class="w-4 h-4 inline-block mr-1" /> Edit Images
              </button> -->
            </div>
          </div>

          <div class="flex justify-between items-center mb-4 space-x-4">
            <p
              class="text-xs font-medium text-gray-900 text-center w-full py-2 rounded-lg cursor-pointer"
              @click="part = 'detail'"
              :class="
                part === 'detail' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
              "
            >
              Detail
            </p>
            <p
              class="text-xs font-medium text-gray-900 text-center w-full py-2 rounded-lg cursor-pointer"
              @click="part = 'image'"
              :class="
                part === 'image' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
              "
            >
              Images
            </p>
            <p
              class="text-xs font-medium text-gray-900 text-center w-full py-2 rounded-lg cursor-pointer"
              @click="part = 'facility'"
              :class="
                part === 'facility' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
              "
            >
              Facilities
            </p>
          </div>

          <!-- Room Details Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <!-- Basic Information -->
            <div class="bg-gray-50 p-4 rounded-lg" v-if="part == 'detail'">
              <h3 class="text-sm font-semibold text-gray-700 mb-3">
                Basic Information
              </h3>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">Max Person:</span>
                  <span class="text-gray-900">{{
                    selectedRoom.max_person
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Room Size:</span>
                  <span class="text-gray-900">{{
                    selectedRoom.meta?.room_size || "Not specified"
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Room Price:</span>
                  <span class="text-gray-900">{{
                    selectedRoom.room_price || "Not set"
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Extra Bed:</span>
                  <span
                    :class="
                      selectedRoom.is_extra ? 'text-green-600' : 'text-gray-400'
                    "
                  >
                    {{ selectedRoom.is_extra ? "Available" : "Not available" }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Breakfast:</span>
                  <span
                    :class="
                      selectedRoom.has_breakfast
                        ? 'text-green-600'
                        : 'text-gray-400'
                    "
                  >
                    {{
                      selectedRoom.has_breakfast ? "Included" : "Not included"
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="mt-6 bg-gray-50 p-4 rounded-lg" v-if="part == 'detail'">
            <h3 class="text-sm font-semibold text-gray-700 mb-3">
              Description
            </h3>
            <p class="text-sm text-gray-600 leading-relaxed">
              {{ selectedRoom.description || "No description available" }}
            </p>
          </div>

          <!-- Room Images -->
          <div class="mt-6" v-if="part == 'image'">
            <h3 class="text-sm font-semibold text-gray-700 mb-3">
              Room Images ({{ selectedRoom.images?.length || 0 }})
            </h3>
            <div
              v-if="selectedRoom.images && selectedRoom.images.length > 0"
              class="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              <div
                v-for="(image, index) in selectedRoom.images"
                :key="image.id"
                class="relative group"
              >
                <img
                  :src="image.image"
                  :alt="`Room image ${index + 1}`"
                  class="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <div
                  class="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all rounded-lg flex items-center justify-center"
                >
                  <button
                    @click="deleteImage(image.id)"
                    class="opacity-0 group-hover:opacity-100 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div
              v-else
              class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
            >
              <PhotoIcon class="mx-auto h-12 w-12 text-gray-400" />
              <p class="mt-2 text-sm text-gray-600">No images uploaded</p>
              <button
                @click="openEditModal('images')"
                class="mt-2 text-xs text-[#FF613c] hover:text-[#FF613c]/80"
              >
                Add room images
              </button>
            </div>
          </div>

          <!-- Facilities (Read Only) -->
          <div
            class="mt-6"
            v-if="
              selectedRoom.amenities &&
              selectedRoom.amenities.length > 0 &&
              part == 'facility'
            "
          >
            <h3 class="text-sm font-semibold text-gray-700 mb-3">
              Room Amenities (View Only)
            </h3>
            <div class="space-y-3">
              <div
                v-for="amenity in selectedRoom.amenities"
                :key="amenity.title"
                class="bg-gray-50 p-3 rounded-lg border border-gray-200"
              >
                <h4 class="text-sm font-medium text-gray-900 mb-2">
                  {{ amenity.title }}
                </h4>
                <ul class="space-y-1">
                  <li
                    v-for="item in amenity.list"
                    :key="item"
                    class="flex items-center text-xs text-gray-600"
                  >
                    <div
                      class="w-1.5 h-1.5 bg-[#FF613c] rounded-full mr-2"
                    ></div>
                    {{ item }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import {
  PencilSquareIcon,
  TrashIcon,
  PhotoIcon,
  XMarkIcon,
  BuildingOfficeIcon,
} from "@heroicons/vue/24/outline";
import { Dialog, DialogPanel, DialogTitle, Switch } from "@headlessui/vue";
import Modal from "../../../components/Modal.vue";
import { useRoomStore } from "../../../stores/room";
import { useToast } from "vue-toastification";

const props = defineProps({
  detail: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update"]);

// Store and utilities
const roomStore = useRoomStore();
const toast = useToast();

// Reactive data
const loading = ref(false);
const roomList = ref([]);
const selectedRoom = ref(null);
const imageInput = ref(null);
const newImages = ref([]);

// Modal states
const editModal = ref({
  isOpen: false,
  type: null,
});

const editData = ref({
  name: "",
  description: "",
  max_person: 1,
  room_price: 0,
  room_size: "",
  is_extra: false,
  has_breakfast: false,
  is_double: false,
  is_twin: false,
  is_show_on: false,
});

// Methods
const fetchRooms = async () => {
  if (!props.detail?.id) return;

  loading.value = true;
  try {
    const response = await roomStore.getListAction({
      hotel_id: props.detail.id,
      limit: 1000,
    });

    if (response && roomStore.rooms?.data) {
      roomList.value = roomStore.rooms.data;
      // Select first room by default
      if (roomList.value.length > 0 && !selectedRoom.value) {
        selectedRoom.value = roomList.value[0];
      }
    }
  } catch (error) {
    console.error("Error fetching rooms:", error);
    toast.error("Failed to load rooms");
  } finally {
    loading.value = false;
  }
};

const part = ref("detail");

const selectRoom = (room) => {
  selectedRoom.value = room;
};

const openEditModal = (type) => {
  window.open(
    `/products/3?hotel=${props.detail.id}&room_id=${selectedRoom.value.id}`,
    "_blank"
  );
};

const closeEditModal = () => {
  editModal.value = {
    isOpen: false,
    type: null,
  };
  newImages.value = [];
  editData.value = {
    name: "",
    description: "",
    max_person: 1,
    room_price: 0,
    room_size: "",
    is_extra: false,
    has_breakfast: false,
    is_double: false,
    is_twin: false,
    is_show_on: false,
  };
};

const saveChanges = async () => {
  if (!selectedRoom.value) return;

  loading.value = true;
  try {
    const formData = new FormData();

    // Basic details
    formData.append("name", editData.value.name);
    formData.append("description", editData.value.description);
    formData.append("max_person", editData.value.max_person);
    formData.append("room_price", editData.value.room_price);
    formData.append("is_extra", editData.value.is_extra ? 1 : 0);
    formData.append("has_breakfast", editData.value.has_breakfast ? 1 : 0);
    formData.append("meta[room_size]", editData.value.room_size);
    formData.append("meta[is_double]", editData.value.is_double ? 1 : 0);
    formData.append("meta[is_twin]", editData.value.is_twin ? 1 : 0);
    formData.append("meta[is_show_on]", editData.value.is_show_on ? 1 : 0);
    formData.append("hotel_id", props.detail.id);
    formData.append("_method", "PUT");

    const response = await roomStore.updateAction(
      formData,
      selectedRoom.value.id
    );

    toast.success(response.message || "Room updated successfully");
    closeEditModal();
    await fetchRooms(); // Refresh room list

    // Update selected room
    const updatedRoom = roomList.value.find(
      (r) => r.id === selectedRoom.value.id
    );
    if (updatedRoom) {
      selectedRoom.value = updatedRoom;
    }
  } catch (error) {
    console.error("Error updating room:", error);
    toast.error(error.response?.data?.message || "Failed to update room");
  } finally {
    loading.value = false;
  }
};

const openImagePicker = () => {
  imageInput.value?.click();
};

const handleImageUpload = (event) => {
  const files = Array.from(event.target.files);
  files.forEach((file) => {
    newImages.value.push({
      file,
      preview: URL.createObjectURL(file),
    });
  });
  event.target.value = "";
};

const removeNewImage = (index) => {
  const image = newImages.value[index];
  if (image.preview) {
    URL.revokeObjectURL(image.preview);
  }
  newImages.value.splice(index, 1);
};

const uploadImages = async () => {
  if (!selectedRoom.value || newImages.value.length === 0) return;

  loading.value = true;
  try {
    const formData = new FormData();

    // Add hotel_id and other required fields
    formData.append("hotel_id", props.detail.id);
    formData.append("name", selectedRoom.value.name);
    formData.append("description", selectedRoom.value.description || "");
    formData.append("max_person", selectedRoom.value.max_person || 1);
    formData.append("room_price", selectedRoom.value.room_price || 0);
    formData.append("is_extra", selectedRoom.value.is_extra ? 1 : 0);
    formData.append("has_breakfast", selectedRoom.value.has_breakfast ? 1 : 0);
    formData.append(
      "meta[room_size]",
      selectedRoom.value.meta?.room_size || ""
    );
    formData.append(
      "meta[is_double]",
      selectedRoom.value.meta?.is_double ? 1 : 0
    );
    formData.append("meta[is_twin]", selectedRoom.value.meta?.is_twin ? 1 : 0);
    formData.append(
      "meta[is_show_on]",
      selectedRoom.value.meta?.is_show_on ? 1 : 0
    );

    // Add new images
    newImages.value.forEach((image, index) => {
      formData.append(`images[${index}]`, image.file);
    });

    formData.append("_method", "PUT");

    const response = await roomStore.updateAction(
      formData,
      selectedRoom.value.id
    );

    toast.success(response.message || "Images uploaded successfully");
    closeEditModal();
    await fetchRooms(); // Refresh room list

    // Update selected room
    const updatedRoom = roomList.value.find(
      (r) => r.id === selectedRoom.value.id
    );
    if (updatedRoom) {
      selectedRoom.value = updatedRoom;
    }
  } catch (error) {
    console.error("Error uploading images:", error);
    toast.error(error.response?.data?.message || "Failed to upload images");
  } finally {
    loading.value = false;
  }
};

const deleteImage = async (imageId) => {
  if (
    !selectedRoom.value ||
    !confirm("Are you sure you want to delete this image?")
  )
    return;

  loading.value = true;
  try {
    await roomStore.deleteImageAction(selectedRoom.value.id, imageId);
    toast.success("Image deleted successfully");
    await fetchRooms(); // Refresh room list

    // Update selected room
    const updatedRoom = roomList.value.find(
      (r) => r.id === selectedRoom.value.id
    );
    if (updatedRoom) {
      selectedRoom.value = updatedRoom;
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    toast.error(error.response?.data?.message || "Failed to delete image");
  } finally {
    loading.value = false;
  }
};

// Initialize component
onMounted(() => {
  fetchRooms();
});

// Cleanup on unmount
onUnmounted(() => {
  newImages.value.forEach((image) => {
    if (image.preview) {
      URL.revokeObjectURL(image.preview);
    }
  });
});
</script>
