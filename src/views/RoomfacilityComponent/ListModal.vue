<template>
  <div>
    <Modal :isOpen="isOpen" @closeModal="closeModal">
      <DialogPanel
        class="w-full max-w-5xl transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-lg font-medium flex justify-between items-center leading-6 text-gray-900 mb-5"
        >
          <p class="font-medium">Room Facilities</p>
          <button
            class="text-gray-500 hover:text-gray-700"
            @click.prevent="closeModal"
          >
            <XMarkIcon class="h-6 w-6" />
          </button>
        </DialogTitle>
        <div class="grid grid-cols-2 gap-6">
          <!-- Facilities Section -->
          <div>
            <p class="font-medium pb-2">Facilities title</p>
            <div class="flex justify-start space-x-2 pt-2 items-center">
              <div class="relative">
                <input
                  type="file"
                  @change="handleFacilityIconChange"
                  accept="image/*"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  class="w-[40px] h-[40px] border border-gray-400 border-dashed rounded-lg flex items-center justify-center"
                >
                  <img
                    v-if="facilityIcon"
                    :src="facilityIcon"
                    alt="Icon"
                    class="w-8 h-8 object-cover rounded"
                  />
                  <span v-else class="text-xs text-gray-400">+</span>
                </div>
              </div>
              <input
                type="text"
                v-model="newFacility.name"
                placeholder="Enter facility name"
                class="border min-w-[200px] border-gray-400 px-4 py-3 text-xs rounded-lg"
              />
              <button
                class="bg-[#ff613c] text-xs text-white px-4 py-3 rounded-lg hover:bg-[#e5552f] disabled:opacity-50"
                @click.prevent="addFacility"
                :disabled="!newFacility.name.trim() || addingFacility"
              >
                {{ addingFacility ? "Adding..." : "Add" }}
              </button>
            </div>
            <div>
              <ul class="mt-2 max-h-60 overflow-y-auto">
                <li
                  v-for="(item, index) in roomFacilities?.data ?? []"
                  :key="item.id || index"
                  class="flex justify-between items-center border-b border-gray-200 py-3"
                >
                  <!-- Edit Mode -->
                  <div
                    v-if="editingFacility?.id === item.id"
                    class="flex items-center space-x-2 flex-1"
                  >
                    <div class="relative">
                      <input
                        type="file"
                        @change="handleEditFacilityIconChange"
                        accept="image/*"
                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div
                        class="w-[30px] h-[30px] border border-gray-400 border-dashed rounded flex items-center justify-center"
                      >
                        <img
                          v-if="editFacilityIcon"
                          :src="editFacilityIcon"
                          alt="Icon"
                          class="w-6 h-6 object-cover rounded"
                        />
                        <span v-else class="text-xs text-gray-400">+</span>
                      </div>
                    </div>
                    <input
                      type="text"
                      v-model="editingFacility.name"
                      class="border border-gray-400 px-2 py-2 text-xs rounded flex-1"
                    />
                    <div class="space-x-2">
                      <button
                        class="bg-green-500 text-white text-xs px-2 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                        @click.prevent="updateFacility"
                        :disabled="
                          !editingFacility.name.trim() || updatingFacility
                        "
                      >
                        {{ updatingFacility ? "Saving..." : "Save" }}
                      </button>
                      <button
                        class="bg-gray-500 text-white text-xs px-2 py-2 rounded hover:bg-gray-600"
                        @click.prevent="cancelEditFacility"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  <!-- View Mode -->
                  <div v-else class="flex justify-between items-center w-full">
                    <div class="flex items-center space-x-2">
                      <img
                        v-if="item.icon"
                        :src="item.icon"
                        alt="Icon"
                        class="w-6 h-6 object-cover rounded"
                      />
                      <span class="text-xs">{{ item.name || item }}</span>
                    </div>
                    <div class="space-x-4">
                      <button
                        class="text-blue-500 text-xs hover:text-blue-700"
                        @click.prevent="editFacility(item)"
                      >
                        <PencilSquareIcon class="h-4 w-4" />
                      </button>
                      <button
                        class="text-red-500 text-xs hover:text-red-700"
                        @click.prevent="deleteFacility(item.id || index)"
                      >
                        <TrashIcon class="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
                <li
                  v-if="!roomFacilities?.data?.length"
                  class="text-center py-4 text-gray-500 text-xs"
                >
                  No facilities added yet
                </li>
              </ul>
            </div>
          </div>

          <!-- Room Items Section -->
          <div>
            <p class="font-medium pb-2">Facilities items</p>
            <div class="flex justify-start space-x-2 pt-2 items-center">
              <div class="relative">
                <input
                  type="file"
                  @change="handleItemIconChange"
                  accept="image/*"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  class="w-[40px] h-[40px] border border-gray-400 border-dashed rounded-lg flex items-center justify-center"
                >
                  <img
                    v-if="itemIcon"
                    :src="itemIcon"
                    alt="Icon"
                    class="w-8 h-8 object-cover rounded"
                  />
                  <span v-else class="text-xs text-gray-400">+</span>
                </div>
              </div>
              <input
                type="text"
                v-model="newItem.name"
                placeholder="Enter item name"
                class="border min-w-[200px] border-gray-400 px-4 py-3 text-xs rounded-lg"
              />
              <select
                v-model="newItem.category"
                class="border min-w-[100px] border-gray-400 px-4 py-3 text-xs rounded-lg"
              >
                <option value="">Select</option>
                <option
                  :value="l.id"
                  v-for="l in roomFacilities?.data ?? []"
                  :key="l.id"
                >
                  {{ l.name }}
                </option>
              </select>
              <button
                class="bg-[#ff613c] text-xs text-white px-4 py-3 rounded-lg hover:bg-[#e5552f] disabled:opacity-50"
                @click.prevent="addItem"
                :disabled="!newItem.name.trim() || addingItem"
              >
                {{ addingItem ? "Adding..." : "Add" }}
              </button>
            </div>
            <div>
              <ul class="mt-2 max-h-60 overflow-y-auto">
                <li
                  v-for="(item, index) in roomItems?.data ?? []"
                  :key="item.id || index"
                  class="flex justify-between items-center border-b border-gray-200 py-3"
                >
                  <!-- Edit Mode -->
                  <div
                    v-if="editingItem?.id === item.id"
                    class="flex items-center space-x-2 flex-1"
                  >
                    <div class="relative">
                      <input
                        type="file"
                        @change="handleEditItemIconChange"
                        accept="image/*"
                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div
                        class="w-[30px] h-[30px] border border-gray-400 border-dashed rounded flex items-center justify-center"
                      >
                        <img
                          v-if="editItemIcon"
                          :src="editItemIcon"
                          alt="Icon"
                          class="w-6 h-6 object-cover rounded"
                        />
                        <span v-else class="text-xs text-gray-400">+</span>
                      </div>
                    </div>
                    <input
                      type="text"
                      v-model="editingItem.name"
                      class="border border-gray-400 px-2 py-2 text-xs rounded flex-1"
                    />
                    <select
                      v-model="editingItem.category"
                      class="border border-gray-400 px-2 py-2 text-xs rounded"
                    >
                      <option value="">Select</option>
                      <option
                        :value="l.id"
                        v-for="l in roomFacilities?.data ?? []"
                        :key="l.id"
                      >
                        {{ l.name }}
                      </option>
                    </select>
                    <div class="space-x-2">
                      <button
                        class="bg-green-500 text-white text-xs px-2 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                        @click.prevent="updateItem"
                        :disabled="!editingItem.name.trim() || updatingItem"
                      >
                        {{ updatingItem ? "Saving..." : "Save" }}
                      </button>
                      <button
                        class="bg-gray-500 text-white text-xs px-2 py-2 rounded hover:bg-gray-600"
                        @click.prevent="cancelEditItem"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  <!-- View Mode -->
                  <div v-else class="flex justify-between items-center w-full">
                    <div class="flex items-center space-x-2">
                      <img
                        v-if="item.icon"
                        :src="item.icon"
                        alt="Icon"
                        class="w-6 h-6 object-cover rounded"
                      />
                      <div>
                        <span class="text-xs block">{{
                          item.name || item
                        }}</span>
                        <span
                          v-if="item.facility?.name"
                          class="text-xs text-gray-500"
                          >{{ item.facility?.name }}</span
                        >
                      </div>
                    </div>
                    <div class="space-x-4">
                      <button
                        class="text-blue-500 text-xs hover:text-blue-700"
                        @click.prevent="editItem(item)"
                      >
                        <PencilSquareIcon class="h-4 w-4" />
                      </button>
                      <button
                        class="text-red-500 text-xs hover:text-red-700"
                        @click.prevent="deleteItem(item.id || index)"
                      >
                        <TrashIcon class="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
                <li
                  v-if="!roomItems?.data?.length"
                  class="text-center py-4 text-gray-500 text-xs"
                >
                  No items added yet
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div
          v-if="loading"
          class="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center"
        >
          <div class="text-sm text-gray-600">Loading...</div>
        </div>
      </DialogPanel>
    </Modal>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, reactive } from "vue";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useRoomFacilityStore } from "../../stores/roomFacility";
import {
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import { useRoomItemStore } from "../../stores/roomItem";
import { storeToRefs } from "pinia";

const roomFacilityStore = useRoomFacilityStore();
const roomItemStore = useRoomItemStore();

const { roomFacilities, loading } = storeToRefs(roomFacilityStore);
const { roomItems } = storeToRefs(roomItemStore);

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  closeModal: {
    type: Function,
    required: true,
  },
});

// Reactive data for new facility
const newFacility = reactive({
  name: "",
  icon: null,
});

// Reactive data for new item
const newItem = reactive({
  name: "",
  category: "",
  icon: null,
});

// Edit states
const editingFacility = ref(null);
const editingItem = ref(null);

// Loading states
const addingFacility = ref(false);
const addingItem = ref(false);
const updatingFacility = ref(false);
const updatingItem = ref(false);

// Icon preview URLs
const facilityIcon = ref(null);
const itemIcon = ref(null);
const editFacilityIcon = ref(null);
const editItemIcon = ref(null);

// Handle facility icon change
const handleFacilityIconChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    newFacility.icon = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      facilityIcon.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Handle item icon change
const handleItemIconChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    newItem.icon = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      itemIcon.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Handle edit facility icon change
const handleEditFacilityIconChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    editingFacility.value.icon = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      editFacilityIcon.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Handle edit item icon change
const handleEditItemIconChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    editingItem.value.icon = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      editItemIcon.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Reset facility form
const resetFacilityForm = () => {
  newFacility.name = "";
  newFacility.icon = null;
  facilityIcon.value = null;
};

// Reset item form
const resetItemForm = () => {
  newItem.name = "";
  newItem.category = "";
  newItem.icon = null;
  itemIcon.value = null;
};

// Reset edit forms
const resetEditForms = () => {
  editingFacility.value = null;
  editingItem.value = null;
  editFacilityIcon.value = null;
  editItemIcon.value = null;
};

const getFacilities = async () => {
  try {
    await roomFacilityStore.getSimpleListAction();
  } catch (error) {
    console.error("Error fetching room facilities:", error);
  }
};

const addFacility = async () => {
  if (!newFacility.name.trim()) return;

  try {
    addingFacility.value = true;
    let formData = new FormData();
    formData.append("name", newFacility.name);
    if (newFacility.icon) {
      formData.append("icon", newFacility.icon);
    }
    await roomFacilityStore.addNewAction(formData);
    await getFacilities();
    resetFacilityForm();
  } catch (error) {
    console.error("Error adding facility:", error);
  } finally {
    addingFacility.value = false;
  }
};

const editFacility = (facility) => {
  editingFacility.value = { ...facility, icon: null }; // Clone the facility object
  editFacilityIcon.value = facility.icon; // Set current icon for preview
};

const updateFacility = async () => {
  if (!editingFacility.value.name.trim()) return;

  try {
    updatingFacility.value = true;
    let formData = new FormData();
    formData.append("name", editingFacility.value.name);
    formData.append("_method", "PUT"); // Laravel method spoofing

    if (editingFacility.value.icon) {
      formData.append("icon", editingFacility.value.icon);
    }

    await roomFacilityStore.updateAction(formData, editingFacility.value.id);
    await getFacilities();
    resetEditForms();
  } catch (error) {
    console.error("Error updating facility:", error);
  } finally {
    updatingFacility.value = false;
  }
};

const cancelEditFacility = () => {
  editingFacility.value = null;
  editFacilityIcon.value = null;
};

const deleteFacility = async (id) => {
  if (!confirm("Are you sure you want to delete this facility?")) return;

  try {
    await roomFacilityStore.deleteAction(id);
    await getFacilities();
  } catch (error) {
    console.error("Error deleting facility:", error);
  }
};

const getRoomItems = async () => {
  try {
    await roomItemStore.getSimpleListAction();
  } catch (error) {
    console.error("Error fetching room items:", error);
  }
};

const addItem = async () => {
  if (!newItem.name.trim()) return;

  try {
    addingItem.value = true;
    let formData = new FormData();
    formData.append("name", newItem.name);
    if (newItem.category) {
      formData.append("rofacility_id", newItem.category);
    }
    if (newItem.icon) {
      formData.append("icon", newItem.icon);
    }
    await roomItemStore.addNewAction(formData);
    await getRoomItems();
    resetItemForm();
  } catch (error) {
    console.error("Error adding item:", error);
  } finally {
    addingItem.value = false;
  }
};

const editItem = (item) => {
  editingItem.value = { ...item, icon: null, category: item.rofacility_id }; // Clone the item object
  editItemIcon.value = item.icon; // Set current icon for preview
};

const updateItem = async () => {
  if (!editingItem.value.name.trim()) return;

  try {
    updatingItem.value = true;
    let formData = new FormData();
    formData.append("name", editingItem.value.name);
    formData.append("_method", "PUT"); // Laravel method spoofing

    if (editingItem.value.category) {
      formData.append("rofacility_id", editingItem.value.category);
    }

    if (editingItem.value.icon) {
      formData.append("icon", editingItem.value.icon);
    }

    await roomItemStore.updateAction(formData, editingItem.value.id);
    await getRoomItems();
    resetEditForms();
  } catch (error) {
    console.error("Error updating item:", error);
  } finally {
    updatingItem.value = false;
  }
};

const cancelEditItem = () => {
  editingItem.value = null;
  editItemIcon.value = null;
};

const deleteItem = async (id) => {
  if (!confirm("Are you sure you want to delete this item?")) return;

  try {
    await roomItemStore.deleteAction(id);
    await getRoomItems();
  } catch (error) {
    console.error("Error deleting item:", error);
  }
};

onMounted(async () => {
  await getFacilities();
  await getRoomItems();
});
</script>
