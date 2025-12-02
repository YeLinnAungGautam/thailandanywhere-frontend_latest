<template>
  <div class="flex h-[62vh] bg-white">
    <!-- Left Sidebar - Navigation -->
    <div class="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
      <div class="p-4">
        <nav>
          <ul class="space-y-1">
            <li v-if="detail?.nearby_places && detail.nearby_places.length > 0">
              <a
                href="#nearby"
                @click="setActiveSection('nearby')"
                :class="
                  activeSection === 'nearby'
                    ? 'bg-[#FF613c]/10 text-[#FF613c]'
                    : 'text-gray-700 hover:bg-gray-100'
                "
                class="block px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer"
              >
                <span
                  class="w-2 h-2 inline-block rounded-full mr-1"
                  :class="
                    activeSection === 'nearby' ? 'bg-[#FF613c]' : 'bg-gray-400'
                  "
                ></span>
                Nearby Places
              </a>
            </li>
            <li v-if="detail?.description">
              <a
                href="#description"
                @click="setActiveSection('description')"
                :class="
                  activeSection === 'description'
                    ? 'bg-[#FF613c]/10 text-[#FF613c]'
                    : 'text-gray-700 hover:bg-gray-100'
                "
                class="block px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer"
              >
                <span
                  class="w-2 h-2 inline-block rounded-full mr-1"
                  :class="
                    activeSection === 'description'
                      ? 'bg-[#FF613c]'
                      : 'bg-gray-400'
                  "
                ></span>
                Description
              </a>
            </li>

            <li v-if="detail?.facilities && detail.facilities.length > 0">
              <a
                href="#facilities"
                @click="setActiveSection('facilities')"
                :class="
                  activeSection === 'facilities'
                    ? 'bg-[#FF613c]/10 text-[#FF613c]'
                    : 'text-gray-700 hover:bg-gray-100'
                "
                class="block px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer"
              >
                <span
                  class="w-2 h-2 inline-block rounded-full mr-1"
                  :class="
                    activeSection === 'facilities'
                      ? 'bg-[#FF613c]'
                      : 'bg-gray-400'
                  "
                ></span>
                Facilities
              </a>
            </li>

            <li v-if="detail?.location_map_title || detail?.place">
              <a
                href="#location"
                @click="setActiveSection('location')"
                :class="
                  activeSection === 'location'
                    ? 'bg-[#FF613c]/10 text-[#FF613c]'
                    : 'text-gray-700 hover:bg-gray-100'
                "
                class="block px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer"
              >
                <span
                  class="w-2 h-2 inline-block rounded-full mr-1"
                  :class="
                    activeSection === 'location'
                      ? 'bg-[#FF613c]'
                      : 'bg-gray-400'
                  "
                ></span>
                Location
              </a>
            </li>

            <li v-if="detail?.check_in || detail?.check_out">
              <a
                href="#hours"
                @click="setActiveSection('hours')"
                :class="
                  activeSection === 'hours'
                    ? 'bg-[#FF613c]/10 text-[#FF613c]'
                    : 'text-gray-700 hover:bg-gray-100'
                "
                class="block px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer"
              >
                <span
                  class="w-2 h-2 inline-block rounded-full mr-1"
                  :class="
                    activeSection === 'hours' ? 'bg-[#FF613c]' : 'bg-gray-400'
                  "
                ></span>
                Check-in & Check-out
              </a>
            </li>

            <li v-if="detail?.cancellation_policy">
              <a
                href="#policy"
                @click="setActiveSection('policy')"
                :class="
                  activeSection === 'policy'
                    ? 'bg-[#FF613c]/10 text-[#FF613c]'
                    : 'text-gray-700 hover:bg-gray-100'
                "
                class="block px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer"
              >
                <span
                  class="w-2 h-2 inline-block rounded-full mr-1"
                  :class="
                    activeSection === 'policy' ? 'bg-[#FF613c]' : 'bg-gray-400'
                  "
                ></span>
                Cancellation Policy
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Right Content Area -->
    <div class="flex-1 overflow-y-auto">
      <div class="p-6 max-w-full">
        <!-- Nearby Places Section (Editable) -->
        <section
          id="nearby"
          v-if="detail?.nearby_places && detail.nearby_places.length > 0"
          class="mb-8 scroll-mt-4"
        >
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-base font-semibold text-[#FF613c]">
              Nearby Places
            </h2>
            <button
              @click="openEditModal('nearby')"
              class="text-xs bg-[#FF613c] text-white px-3 py-1 rounded hover:bg-[#FF613c]/90"
            >
              <PencilSquareIcon class="w-4 h-4 inline-block mr-1" /> Edit
            </button>
          </div>
          <div class="space-y-3 bg-gray-50 p-6 rounded-lg min-h-[300px]">
            <div
              v-for="place in detail.nearby_places"
              :key="place.name"
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white"
            >
              <div class="flex items-center space-x-3">
                <MapPinIcon class="w-5 h-5 text-[#FF613c]" />
                <div>
                  <p class="text-sm font-medium text-gray-700">
                    {{ place.name }}
                  </p>
                  <p class="text-xs text-gray-500">{{ place.distance }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <!-- Description Section (Editable) -->
        <section
          id="description"
          v-if="detail?.description || detail?.full_description_en"
          class="mb-8 scroll-mt-4"
        >
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-base font-semibold text-[#FF613c]">Description</h2>
            <button
              @click="openEditModal('description')"
              class="text-xs bg-[#FF613c] text-white px-3 py-1 rounded hover:bg-[#FF613c]/90"
            >
              <PencilSquareIcon class="w-4 h-4 inline-block mr-1" /> Edit
            </button>
          </div>
          <div class="space-y-3 text-sm">
            <div v-if="detail?.full_description_en">
              <div
                class="text-gray-700 bg-gray-50 p-6 rounded-lg leading-relaxed min-h-[300px]"
                v-html="detail.full_description_en"
              ></div>
            </div>
          </div>
        </section>

        <!-- Facilities Section (Editable) -->
        <section
          id="facilities"
          v-if="detail?.facilities && detail.facilities.length > 0"
          class="mb-8 scroll-mt-4"
        >
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-base font-semibold text-[#FF613c]">Facilities</h2>
            <button
              @click="openEditModal('facilities')"
              class="text-xs bg-[#FF613c] text-white px-3 py-1 rounded hover:bg-[#FF613c]/90"
            >
              <PencilSquareIcon class="w-4 h-4 inline-block mr-1" /> Edit
            </button>
          </div>
          <div
            class="grid grid-cols-2 gap-4 p-6 bg-gray-50 rounded-lg min-h-[300px]"
          >
            <div
              v-for="facility in detail.facilities"
              :key="facility.id"
              class="text-sm text-gray-700 flex items-center"
            >
              <img :src="facility.image" alt="" class="w-6 h-6 mr-2" />
              {{ facility.name }}
            </div>
          </div>
        </section>

        <!-- Location Section (Read-only) -->
        <section
          id="location"
          v-if="detail?.location_map_title || detail?.place"
          class="mb-8 scroll-mt-4"
        >
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-base font-semibold text-[#FF613c]">Location</h2>
          </div>
          <div class="space-y-2 text-sm">
            <p
              v-if="detail?.place"
              class="text-gray-700 p-6 bg-gray-50 rounded-lg"
            >
              {{ detail.place }}
            </p>
            <p v-if="detail?.location_map_title" class="text-gray-600 px-6">
              {{ detail.location_map_title }}
            </p>
            <div v-if="detail?.location_map" class="mt-4">
              <iframe
                :src="detail.location_map"
                class="w-full h-80 rounded-lg"
                style="border: 0"
                allowfullscreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </section>

        <!-- Check-in & Check-out Section (Editable) -->
        <section
          id="hours"
          v-if="detail?.check_in || detail?.check_out"
          class="mb-8 scroll-mt-4"
        >
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-base font-semibold text-[#FF613c]">
              Check-in & Check-out
            </h2>
            <button
              @click="openEditModal('hours')"
              class="text-xs bg-[#FF613c] text-white px-3 py-1 rounded hover:bg-[#FF613c]/90"
            >
              <PencilSquareIcon class="w-4 h-4 inline-block mr-1" /> Edit
            </button>
          </div>
          <div class="bg-gray-50 p-6 rounded-lg min-h-[300px]">
            <div class="space-y-6 text-sm">
              <div
                v-if="detail?.check_in"
                class="flex items-center justify-between border-b border-gray-200 pb-4"
              >
                <div class="flex items-center space-x-3">
                  <div
                    class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"
                  >
                    <svg
                      class="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <span class="block text-lg font-semibold text-gray-700"
                      >Check-in</span
                    >
                    <span class="text-gray-500 text-xs">Arrival time</span>
                  </div>
                </div>
                <span class="text-xl font-bold text-[#FF613c]">{{
                  detail.check_in
                }}</span>
              </div>
              <div
                v-if="detail?.check_out"
                class="flex items-center justify-between"
              >
                <div class="flex items-center space-x-3">
                  <div
                    class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center"
                  >
                    <svg
                      class="w-6 h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <span class="block text-lg font-semibold text-gray-700"
                      >Check-out</span
                    >
                    <span class="text-gray-500 text-xs">Departure time</span>
                  </div>
                </div>
                <span class="text-xl font-bold text-[#FF613c]">{{
                  detail.check_out
                }}</span>
              </div>
            </div>
            <!-- <div class="mt-6 p-4 bg-blue-50 rounded-lg"></div> -->
          </div>
        </section>

        <!-- Cancellation Policy Section (Editable) -->
        <section
          id="policy"
          v-if="detail?.cancellation_policy"
          class="mb-8 scroll-mt-4"
        >
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-base font-semibold text-[#FF613c]">
              Cancellation Policy
            </h2>
            <button
              @click="openEditModal('policy')"
              class="text-xs bg-[#FF613c] text-white px-3 py-1 rounded hover:bg-[#FF613c]/90"
            >
              <PencilSquareIcon class="w-4 h-4 inline-block mr-1" /> Edit
            </button>
          </div>
          <div class="bg-white rounded-lg min-h-[300px]">
            <div class="bg-gray-50 p-6 rounded-lg mb-4">
              <p
                class="text-sm text-gray-700 leading-relaxed whitespace-pre-line"
              >
                {{ detail.cancellation_policy }}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import {
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
// You'll need to import your Modal component here
import Modal from "../../../components/Modal.vue";
import { MapPinIcon } from "@heroicons/vue/24/solid";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { useHotelStore } from "../../../stores/hotel";

const hotelStore = useHotelStore();

const props = defineProps({
  detail: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update"]);

const activeSection = ref("description");
const loading = ref(false);
const editModal = ref({
  isOpen: false,
  type: null,
});

const editData = ref({});
const availableFacilities = ref([]);
const selectedFacilities = ref([]);

const setActiveSection = (section) => {
  activeSection.value = section;
};

const openEditModal = async (type) => {
  window.open(`/product/hotel/edit/${props.detail.id}`, "_blank");
};

const searchFacilities = ref("");
const filteredFacilities = computed(() => {
  if (!searchFacilities.value) {
    return availableFacilities.value;
  }
  return availableFacilities.value.filter((facility) =>
    facility.name.toLowerCase().includes(searchFacilities.value.toLowerCase())
  );
});

// Intersection Observer to track which section is in view
onMounted(() => {
  const sections = document.querySelectorAll("section[id]");

  if (sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          activeSection.value = entry.target.id;
        }
      });
    },
    {
      threshold: 0.5,
      rootMargin: "-50px 0px -50px 0px",
    }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });

  // Cleanup observer on unmount
  return () => {
    sections.forEach((section) => {
      observer.unobserve(section);
    });
  };
});
</script>
