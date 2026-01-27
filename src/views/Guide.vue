<template>
  <div
    class="bg-white/60 p-6 rounded-lg shadow-sm mb-5 md:col-span-3 hidden md:block"
  >
    <h3 class="text-xl font-medium text-gray-600 tracking-wide mb-3">Guides</h3>
    <!-- search input sort filter -->
    <div class="flex items-center justify-between mb-8">
      <div class="">
        <input
          v-model="search"
          type="text"
          class="w-3/5 sm:w-3/5 md:w-[300px] mr-3 border px-4 py-2 rounded-md shadow focus:ring-0 focus:outline-none text-gray-500"
          placeholder="Search for guides.."
        />
      </div>
      <div class="space-x-3">
        <Button :leftIcon="ShareIcon" intent="text"> Export </Button>
        <Button :leftIcon="PlusIcon" @click.prevent="openAddModal">
          Add Guide
        </Button>
      </div>
    </div>
    <div class="">
      <div class="overflow-auto rounded-lg shadow mb-5" v-if="!loading">
        <table class="w-full">
          <thead class="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th class="p-4 text-xs font-medium tracking-wide text-left">
                No.
              </th>
              <th class="p-4 text-xs font-medium tracking-wide text-left">
                Image
              </th>
              <th class="p-4 text-xs font-medium tracking-wide text-left">
                Name
              </th>
              <th class="p-4 text-xs font-medium tracking-wide text-left">
                Contact
              </th>
              <th class="p-4 text-xs font-medium tracking-wide text-left">
                Day Rate
              </th>
              <th class="p-4 text-xs font-medium tracking-wide text-left">
                Languages
              </th>
              <th class="p-4 text-xs font-medium tracking-wide text-left">
                Cities
              </th>
              <th class="p-4 text-xs font-medium tracking-wide text-left">
                Score
              </th>
              <th class="p-4 text-xs font-medium tracking-wide text-left">
                Status
              </th>
              <th class="p-4 text-xs font-medium tracking-wide text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="guide in guides?.data"
              :key="guide.id"
              class="bg-white even:bg-gray-50 hover:bg-gray-50"
            >
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                {{ guide.id }}
              </td>
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                <img
                  v-if="guide.image"
                  :src="guide.image"
                  alt="Guide"
                  class="w-12 h-12 rounded-full object-cover"
                />
                <div
                  v-else
                  class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center"
                >
                  <UsersIcon class="w-6 h-6 text-gray-400" />
                </div>
              </td>
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                {{ guide.name }}
              </td>
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                {{ guide.contact || "-" }}
              </td>
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                {{ guide.day_rate || 0 }}
              </td>
              <td class="p-4 text-xs text-gray-700">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="(lang, idx) in guide.languages"
                    :key="idx"
                    class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                  >
                    {{ lang }}
                  </span>
                  <span v-if="!guide.languages || guide.languages.length === 0">
                    -
                  </span>
                </div>
              </td>
              <td class="p-4 text-xs text-gray-700">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="city in guide.cities"
                    :key="city.id"
                    class="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                  >
                    {{ city.name }}
                  </span>
                  <span v-if="!guide.cities || guide.cities.length === 0">
                    -
                  </span>
                </div>
              </td>
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                {{ guide.renew_score || 0 }}
              </td>
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                <button
                  @click="toggleStatus(guide.id)"
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-medium transition',
                    guide.is_active
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200',
                  ]"
                >
                  {{ guide.is_active ? "Active" : "Inactive" }}
                </button>
              </td>
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <button
                    @click.prevent="openViewModal(guide)"
                    class="hover:bg-blue-500 p-2 bg-white text-blue-500 transition shadow rounded hover:text-white"
                    title="View"
                  >
                    <EyeIcon class="w-5 h-5" />
                  </button>
                  <button
                    @click.prevent="openEditModal(guide)"
                    class="hover:bg-yellow-500 p-2 bg-white text-blue-500 transition shadow rounded hover:text-white"
                    title="Edit"
                  >
                    <PencilSquareIcon class="w-5 h-5" />
                  </button>
                  <button
                    @click.prevent="onDeleteHandler(guide.id)"
                    class="hover:bg-red-500 p-2 bg-white text-blue-500 transition shadow rounded hover:text-white"
                    title="Delete"
                  >
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="flex justify-center items-center py-10">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
        ></div>
      </div>
      <!-- pagination -->
      <Pagination v-if="!loading" :data="guides" @change-page="changePage" />
    </div>

    <!-- Add/Edit Modal -->
    <Modal :isOpen="guideModalOpen" @closeModal="closeModal">
      <DialogPanel
        class="w-full max-w-4xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all max-h-[90vh] overflow-y-auto"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-5"
        >
          {{ formData.id ? "Edit Guide" : "Add New Guide" }}
        </DialogTitle>
        <form @submit.prevent="onSubmitHandler" class="mt-2">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Name -->
            <div class="space-y-1 mb-2">
              <label for="name" class="text-gray-800 text-sm font-medium"
                >Name <span class="text-red-500">*</span></label
              >
              <input
                type="text"
                v-model="formData.name"
                id="name"
                class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-400"
              />
              <p v-if="errors?.name" class="mt-1 text-sm text-red-600">
                {{ errors.name[0] }}
              </p>
            </div>

            <!-- Contact -->
            <div class="space-y-1 mb-2">
              <label for="contact" class="text-gray-800 text-sm font-medium"
                >Contact</label
              >
              <input
                type="text"
                v-model="formData.contact"
                id="contact"
                class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-400"
              />
              <p v-if="errors?.contact" class="mt-1 text-sm text-red-600">
                {{ errors.contact[0] }}
              </p>
            </div>

            <!-- day rate -->
            <div class="space-y-1 mb-2">
              <label for="day_rate" class="text-gray-800 text-sm font-medium"
                >Day Rate</label
              >
              <input
                type="number"
                v-model="formData.day_rate"
                id="day_rate"
                class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-400"
              />
              <p v-if="errors?.day_rate" class="mt-1 text-sm text-red-600">
                {{ errors.day_rate[0] }}
              </p>
            </div>

            <!-- Renew Score -->
            <div class="space-y-1 mb-2">
              <label for="renew_score" class="text-gray-800 text-sm font-medium"
                >Renew Score</label
              >
              <input
                type="number"
                v-model="formData.renew_score"
                id="renew_score"
                min="0"
                class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-400"
              />
              <p v-if="errors?.renew_score" class="mt-1 text-sm text-red-600">
                {{ errors.renew_score[0] }}
              </p>
            </div>
          </div>

          <!-- Licence Image Upload -->
          <div class="space-y-1 mb-4">
            <label for="licence" class="text-gray-800 text-sm font-medium"
              >Licence Image</label
            >
            <div class="flex items-center gap-4">
              <div
                v-if="licencePreview || formData.existing_licence"
                class="relative"
              >
                <img
                  :src="licencePreview || formData.existing_licence"
                  alt="Licence Preview"
                  class="w-32 h-32 rounded-lg object-cover border-2 border-gray-300"
                />
                <button
                  v-if="licencePreview"
                  @click="removeLicence"
                  type="button"
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
              <div class="flex-1">
                <input
                  type="file"
                  @change="handleLicenceChange"
                  id="licence"
                  accept="image/jpeg,image/png,image/jpg,image/gif"
                  class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                <p class="text-xs text-gray-500 mt-1">
                  Max size: 2MB. Formats: JPEG, PNG, JPG, GIF
                </p>
              </div>
            </div>
            <p v-if="errors?.licence" class="mt-1 text-sm text-red-600">
              {{ errors.licence[0] }}
            </p>
          </div>

          <!-- Image Upload -->
          <div class="space-y-1 mb-4">
            <label for="image" class="text-gray-800 text-sm font-medium"
              >Profile Image</label
            >
            <div class="flex items-center gap-4">
              <div
                v-if="imagePreview || formData.existing_image"
                class="relative"
              >
                <img
                  :src="imagePreview || formData.existing_image"
                  alt="Preview"
                  class="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                />
                <button
                  v-if="imagePreview"
                  @click="removeImage"
                  type="button"
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
              <div class="flex-1">
                <input
                  type="file"
                  @change="handleImageChange"
                  id="image"
                  accept="image/jpeg,image/png,image/jpg,image/gif"
                  class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p class="text-xs text-gray-500 mt-1">
                  Max size: 2MB. Formats: JPEG, PNG, JPG, GIF
                </p>
              </div>
            </div>
            <p v-if="errors?.image" class="mt-1 text-sm text-red-600">
              {{ errors.image[0] }}
            </p>
          </div>

          <!-- Languages -->
          <div class="space-y-1 mb-4">
            <label class="text-gray-800 text-sm font-medium">Languages</label>
            <div class="flex flex-wrap gap-2 mb-2 pt-2">
              <span
                v-for="(lang, index) in formData.languages"
                :key="index"
                class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
              >
                {{ lang }}
                <button
                  type="button"
                  @click="removeLanguage(index)"
                  class="hover:text-red-600"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </span>
            </div>
            <div class="flex gap-2 pt-2">
              <input
                type="text"
                v-model="newLanguage"
                @keypress.enter.prevent="addLanguage"
                placeholder="Add language (press Enter)"
                class="h-10 flex-1 bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-400"
              />
              <button
                type="button"
                @click="addLanguage"
                class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Add
              </button>
            </div>
            <p v-if="errors?.languages" class="mt-1 text-sm text-red-600">
              {{ errors.languages[0] }}
            </p>
          </div>

          <!-- Cities -->
          <div class="space-y-1 mb-4">
            <label class="text-gray-800 text-sm font-medium">Cities</label>
            <div v-if="citiesLoading" class="text-sm text-gray-500">
              Loading cities...
            </div>
            <div
              v-else
              class="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3"
            >
              <div
                v-for="city in availableCities"
                :key="city.id"
                class="flex items-center mb-2"
              >
                <input
                  type="checkbox"
                  :id="'city-' + city.id"
                  :value="city.id"
                  v-model="formData.cities"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  :for="'city-' + city.id"
                  class="ml-2 text-sm text-gray-700 cursor-pointer"
                >
                  {{ city.name }}
                </label>
              </div>
            </div>
            <p v-if="errors?.cities" class="mt-1 text-sm text-red-600">
              {{ errors.cities[0] }}
            </p>
          </div>

          <!-- Notes -->
          <div class="space-y-1 mb-4">
            <label for="notes" class="text-gray-800 text-sm font-medium"
              >Notes</label
            >
            <textarea
              v-model="formData.notes"
              id="notes"
              rows="3"
              class="w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-400"
            ></textarea>
            <p v-if="errors?.notes" class="mt-1 text-sm text-red-600">
              {{ errors.notes[0] }}
            </p>
          </div>

          <!-- Active Status -->
          <div class="flex items-center mb-4">
            <input
              type="checkbox"
              v-model="formData.is_active"
              id="is_active"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label for="is_active" class="ml-2 text-sm text-gray-700">
              Active
            </label>
          </div>

          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <Button type="submit" :disabled="submitting">
              {{ submitting ? "Saving..." : "Submit" }}
            </Button>
          </div>
        </form>
      </DialogPanel>
    </Modal>

    <!-- View Modal -->
    <Modal :isOpen="viewModalOpen" @closeModal="viewModalOpen = false">
      <DialogPanel
        class="w-full max-w-4xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all max-h-[90vh] overflow-y-auto"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-5"
        >
          Guide Details
        </DialogTitle>
        <div v-if="selectedGuide" class="space-y-4">
          <!-- Image -->
          <div class="flex justify-center mb-4">
            <img
              v-if="selectedGuide.image"
              :src="selectedGuide.image"
              alt="Guide"
              class="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
            />
            <div
              v-else
              class="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center"
            >
              <UsersIcon class="w-16 h-16 text-gray-400" />
            </div>
          </div>

          <!-- Details -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm font-medium text-gray-500">Name</p>
              <p class="text-base text-gray-900">{{ selectedGuide.name }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Contact</p>
              <p class="text-base text-gray-900">
                {{ selectedGuide.contact || "-" }}
              </p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Day Rate</p>
              <p class="text-base text-gray-900">
                {{ selectedGuide.day_rate || "-" }}
              </p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Renew Score</p>
              <p class="text-base text-gray-900">
                {{ selectedGuide.renew_score || 0 }}
              </p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Status</p>
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-medium inline-block',
                  selectedGuide.is_active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700',
                ]"
              >
                {{ selectedGuide.is_active ? "Active" : "Inactive" }}
              </span>
            </div>
          </div>

          <!-- Languages -->
          <div>
            <p class="text-sm font-medium text-gray-500 mb-2">Languages</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(lang, idx) in selectedGuide.languages"
                :key="idx"
                class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {{ lang }}
              </span>
              <span
                v-if="
                  !selectedGuide.languages ||
                  selectedGuide.languages.length === 0
                "
                class="text-gray-500"
              >
                No languages added
              </span>
            </div>
          </div>

          <!-- Licence Image -->
          <div>
            <p class="text-sm font-medium text-gray-500 mb-2">Licence</p>
            <div v-if="selectedGuide.licence">
              <img
                :src="selectedGuide.licence"
                alt="Licence"
                class="w-full max-w-md rounded-lg border-2 border-gray-300 cursor-pointer hover:border-blue-500 transition"
                @click="() => window.open(selectedGuide.licence, '_blank')"
              />
            </div>
            <p v-else class="text-gray-500">No licence uploaded</p>
          </div>

          <!-- Cities -->
          <div>
            <p class="text-sm font-medium text-gray-500 mb-2">Cities</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="city in selectedGuide.cities"
                :key="city.id"
                class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
              >
                {{ city.name }}
              </span>
              <span
                v-if="
                  !selectedGuide.cities || selectedGuide.cities.length === 0
                "
                class="text-gray-500"
              >
                No cities assigned
              </span>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <p class="text-sm font-medium text-gray-500 mb-2">Notes</p>
            <p class="text-base text-gray-900">
              {{ selectedGuide.notes || "No notes available" }}
            </p>
          </div>

          <!-- Timestamps -->
          <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p class="text-sm font-medium text-gray-500">Created At</p>
              <p class="text-sm text-gray-900">
                {{ formatDate(selectedGuide.created_at) }}
              </p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Updated At</p>
              <p class="text-sm text-gray-900">
                {{ formatDate(selectedGuide.updated_at) }}
              </p>
            </div>
          </div>
        </div>
        <div class="text-end mt-4">
          <button
            @click="viewModalOpen = false"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </DialogPanel>
    </Modal>
  </div>
</template>

<script setup>
import Button from "../components/Button.vue";
import Pagination from "../components/Pagination.vue";
import {
  PencilSquareIcon,
  TrashIcon,
  ShareIcon,
  EyeIcon,
  PlusIcon,
  UsersIcon,
} from "@heroicons/vue/24/outline";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { onMounted, ref, watch } from "vue";
import Modal from "../components/Modal.vue";
import { storeToRefs } from "pinia";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
import { useGuideStore } from "../stores/guide";
import { useCityStore } from "../stores/city";
import debounce from "lodash/debounce";

const guideStore = useGuideStore();
const cityStore = useCityStore();
const toast = useToast();

const guideModalOpen = ref(false);
const viewModalOpen = ref(false);
const selectedGuide = ref(null);
const submitting = ref(false);

const formData = ref({
  id: "",
  name: "",
  licence: null,
  existing_licence: "",
  contact: "",
  day_rate: "",
  image: null,
  existing_image: "",
  notes: "",
  renew_score: 0,
  is_active: true,
  languages: [],
  cities: [],
});

const newLanguage = ref("");
const imagePreview = ref(null);
const licencePreview = ref(null);
const errors = ref(null);
const search = ref("");
const availableCities = ref([]);
const citiesLoading = ref(false);

const { guides, loading } = storeToRefs(guideStore);

const changePage = async (url) => {
  await guideStore.getChangePage(url);
};

const loadCities = async () => {
  try {
    citiesLoading.value = true;
    const response = await cityStore.getSimpleListAction();
    availableCities.value = response.result.data || [];
  } catch (error) {
    toast.error("Failed to load cities");
  } finally {
    citiesLoading.value = false;
  }
};

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.value.image = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleLicenceChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.value.licence = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      licencePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  formData.value.image = null;
  imagePreview.value = null;
  const fileInput = document.getElementById("image");
  if (fileInput) fileInput.value = "";
};

const removeLicence = () => {
  formData.value.licence = null;
  licencePreview.value = null;
  const fileInput = document.getElementById("licence");
  if (fileInput) fileInput.value = "";
};

const addLanguage = () => {
  if (
    newLanguage.value.trim() &&
    !formData.value.languages.includes(newLanguage.value.trim())
  ) {
    formData.value.languages.push(newLanguage.value.trim());
    newLanguage.value = "";
  }
};

const removeLanguage = (index) => {
  formData.value.languages.splice(index, 1);
};

const resetForm = () => {
  formData.value = {
    id: "",
    name: "",
    licence: null,
    existing_licence: "",
    contact: "",
    day_rate: "",
    image: null,
    existing_image: "",
    notes: "",
    renew_score: 0,
    is_active: true,
    languages: [],
    cities: [],
  };
  newLanguage.value = "";
  imagePreview.value = null;
  licencePreview.value = null;
  errors.value = null;
};

const openAddModal = () => {
  resetForm();
  guideModalOpen.value = true;
};

const openEditModal = (guide) => {
  formData.value = {
    id: guide.id,
    name: guide.name,
    licence: null,
    existing_licence: guide.licence || "",
    contact: guide.contact || "",
    day_rate: guide.day_rate || "",
    image: null,
    existing_image: guide.image || "",
    notes: guide.notes || "",
    renew_score: guide.renew_score || 0,
    is_active: guide.is_active,
    languages: guide.languages ? [...guide.languages] : [],
    cities: guide.cities ? guide.cities.map((city) => city.id) : [],
  };
  imagePreview.value = null;
  licencePreview.value = null;
  guideModalOpen.value = true;
};

const openViewModal = (guide) => {
  selectedGuide.value = guide;
  viewModalOpen.value = true;
};

const closeModal = () => {
  guideModalOpen.value = false;
  resetForm();
};

const addNewHandler = async () => {
  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("contact", formData.value.contact);
  frmData.append("day_rate", formData.value.day_rate);
  frmData.append("notes", formData.value.notes);
  frmData.append("renew_score", formData.value.renew_score);
  frmData.append("is_active", formData.value.is_active ? 1 : 0);

  if (formData.value.image) {
    frmData.append("image", formData.value.image);
  }

  if (formData.value.licence) {
    frmData.append("licence", formData.value.licence);
  }

  formData.value.languages.forEach((lang, index) => {
    frmData.append(`languages[${index}]`, lang);
  });

  formData.value.cities.forEach((cityId, index) => {
    frmData.append(`cities[${index}]`, cityId);
  });

  try {
    submitting.value = true;
    const response = await guideStore.addNewAction(frmData);
    closeModal();
    await guideStore.getListAction();
    toast.success(response.message);
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
    }
    toast.error(error.response?.data?.message || "Failed to add guide");
  } finally {
    submitting.value = false;
  }
};

const updateHandler = async () => {
  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("contact", formData.value.contact);
  frmData.append("day_rate", formData.value.day_rate);
  frmData.append("notes", formData.value.notes);
  frmData.append("renew_score", formData.value.renew_score);
  frmData.append("is_active", formData.value.is_active ? 1 : 0);
  frmData.append("_method", "PUT");

  if (formData.value.image) {
    frmData.append("image", formData.value.image);
  }

  if (formData.value.licence) {
    frmData.append("licence", formData.value.licence);
  }

  formData.value.languages.forEach((lang, index) => {
    frmData.append(`languages[${index}]`, lang);
  });

  formData.value.cities.forEach((cityId, index) => {
    frmData.append(`cities[${index}]`, cityId);
  });

  try {
    submitting.value = true;
    const response = await guideStore.updateAction(frmData, formData.value.id);
    closeModal();
    await guideStore.getListAction();
    toast.success(response.message);
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
    }
    toast.error(error.response?.data?.message || "Failed to update guide");
  } finally {
    submitting.value = false;
  }
};

const onSubmitHandler = async () => {
  if (formData.value.id) {
    await updateHandler();
  } else {
    await addNewHandler();
  }
};

const onDeleteHandler = async (id) => {
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
        const response = await guideStore.deleteAction(id);
        toast.success(response.message);
        await guideStore.getListAction();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete guide");
      }
    }
  });
};

const toggleStatus = async (id) => {
  try {
    const response = await guideStore.toggleStatusAction(id);
    toast.success(response.message);
    await guideStore.getListAction();
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to toggle status");
  }
};

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(async () => {
  await guideStore.getListAction();
  await loadCities();
});

watch(
  search,
  debounce(async (newValue) => {
    await guideStore.getListAction({ search: search.value });
  }, 500),
);
</script>
