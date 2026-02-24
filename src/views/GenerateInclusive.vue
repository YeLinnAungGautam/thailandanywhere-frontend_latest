<!-- GenerateInclusive.vue  (updated - replaced PackageListModal with PackageListPage full-page view) -->
<template>
  <Layout :title="'generate inclusive'">
    <div class="min-h-full bg-slate-50">
      <!-- ══════════════════════════════════════════
           PACKAGE LIST PAGE (full page, replaces modal)
      ══════════════════════════════════════════ -->
      <div v-if="currentView === 'packageList'">
        <PackageListPage
          @back="currentView = 'choose'"
          @edit="onExternalPackageEdit"
        />
      </div>

      <!-- ══════════════════════════════════════════
           CHOOSE STEP
      ══════════════════════════════════════════ -->
      <div
        v-if="currentView === 'choose'"
        class="w-full h-[80vh] flex justify-center items-center gap-10 px-6"
      >
        <div
          @click="startCreation('new')"
          class="w-[300px] h-[200px] border-2 border-orange-500 hover:bg-orange-50 flex justify-center items-center rounded-2xl cursor-pointer transition group"
        >
          <div class="text-center">
            <svg
              class="w-16 h-16 mx-auto mb-3 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <p class="text-lg font-semibold text-slate-800">Create New</p>
          </div>
        </div>

        <div
          @click="startCreation('external')"
          class="w-[300px] h-[200px] border-2 border-slate-400 bg-slate-100 hover:bg-slate-200 flex justify-center items-center rounded-2xl cursor-pointer transition"
        >
          <div class="text-center">
            <svg
              class="w-16 h-16 mx-auto mb-3 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p class="text-lg font-semibold text-slate-800">Choose External</p>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════
           QUESTION STEPS
      ══════════════════════════════════════════ -->
      <div
        v-if="currentView === 'questions'"
        class="w-full min-h-full grid grid-cols-5 gap-4"
      >
        <!-- ── Left Sidebar ── -->
        <div class="col-span-1 space-y-3">
          <!-- Edit Mode Badge -->
          <div
            v-if="editingPackageId"
            class="bg-blue-50 border-2 border-blue-300 rounded-xl p-3 text-center"
          >
            <p class="text-xs font-semibold text-blue-600">
              ✏️ Editing #{{ editingPackageId }}
            </p>
          </div>

          <!-- Step Navigation -->
          <div
            v-for="(question, idx) in questions"
            :key="idx"
            @click="activeQuestion = idx"
            :class="[
              'border-2 rounded-2xl p-4 cursor-pointer transition',
              activeQuestion === idx
                ? 'border-orange-500 bg-orange-50'
                : 'border-slate-300 bg-white hover:border-orange-300',
            ]"
          >
            <div class="flex items-center gap-3">
              <div
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                  activeQuestion === idx
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-200 text-slate-600',
                ]"
              >
                {{ idx + 1 }}
              </div>
              <p class="font-semibold text-sm text-slate-800">
                {{ question.title }}
              </p>
            </div>
          </div>

          <!-- Save Button -->
          <button
            @click="savePackage"
            :disabled="pkgStore.saveLoading"
            :class="[
              'w-full py-3 rounded-2xl font-semibold text-sm transition flex items-center justify-center gap-2',
              pkgStore.saveLoading
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md',
            ]"
          >
            <span
              v-if="pkgStore.saveLoading"
              class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
            />
            <span v-else>💾</span>
            {{
              pkgStore.saveLoading
                ? "Saving..."
                : editingPackageId
                ? "Update Package"
                : "Save Package"
            }}
          </button>

          <!-- Save Success -->
          <Transition name="fade">
            <div
              v-if="saveSuccess"
              class="bg-green-50 border-2 border-green-300 rounded-xl p-3 text-center"
            >
              <p class="text-xs font-semibold text-green-600">
                ✅ {{ editingPackageId ? "Updated!" : "Saved!" }} successfully
              </p>
            </div>
          </Transition>

          <!-- Save Error -->
          <Transition name="fade">
            <div
              v-if="pkgStore.error"
              class="bg-red-50 border-2 border-red-300 rounded-xl p-3 text-center"
            >
              <p class="text-xs font-semibold text-red-600">
                ❌ {{ pkgStore.error }}
              </p>
            </div>
          </Transition>

          <!-- Back Button -->
          <button
            @click="currentView = 'choose'"
            class="w-full py-2.5 rounded-2xl font-semibold text-sm border-2 border-slate-300 text-slate-600 hover:bg-slate-50 transition"
          >
            ← Back
          </button>
        </div>

        <!-- ── Right Content Area ── -->
        <div
          class="col-span-4 border-2 border-slate-300 rounded-2xl overflow-y-auto bg-white p-4"
          style="height: calc(100vh - 7.5rem)"
        >
          <!-- Step 1: Trip Info -->
          <div v-if="activeQuestion === 0" class="h-full">
            <div class="grid grid-cols-2 gap-6 h-full">
              <div>
                <div class="bg-white rounded-xl mb-6">
                  <h3 class="text-lg font-semibold text-slate-800 mb-4">
                    Number of People
                  </h3>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        class="block text-sm font-medium text-slate-700 mb-2"
                        >Adults</label
                      >
                      <input
                        v-model.number="packageData.adults"
                        type="number"
                        min="0"
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-lg"
                      />
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-slate-700 mb-2"
                        >Children</label
                      >
                      <input
                        v-model.number="packageData.children"
                        type="number"
                        min="0"
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-lg"
                      />
                    </div>
                  </div>
                </div>
                <div class="bg-white rounded-xl">
                  <h3 class="text-lg font-semibold text-slate-800 mb-4">
                    Trip Duration
                  </h3>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        class="block text-sm font-medium text-slate-700 mb-2"
                        >Start Date</label
                      >
                      <input
                        v-model="packageData.startDate"
                        type="date"
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-lg"
                      />
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-slate-700 mb-2"
                        >Number of Nights</label
                      >
                      <input
                        v-model.number="packageData.nights"
                        type="number"
                        min="1"
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Day City Map -->
              <div v-if="totalDays > 0">
                <div class="bg-white rounded-xl pb-6">
                  <div
                    class="flex justify-start items-center overflow-x-scroll no-scrollbar pb-6 gap-2"
                  >
                    <button
                      v-for="day in totalDays"
                      :key="`day-tab-${day}`"
                      @click="selectedDayForCities = day"
                      :class="[
                        'px-4 py-2 rounded-lg font-medium transition',
                        selectedDayForCities === day
                          ? 'bg-orange-500 text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-orange-100',
                      ]"
                    >
                      <div class="text-sm whitespace-nowrap">
                        Day {{ day }}
                        <span class="text-xs"
                          >- {{ getDayDateShort(day) }}</span
                        >
                      </div>
                      <div
                        v-if="dayCityMap[day]?.length > 0"
                        class="text-xs mt-1"
                      >
                        {{ dayCityMap[day].length }}
                        {{ dayCityMap[day].length === 1 ? "city" : "cities" }}
                      </div>
                      <div v-else class="text-xs mt-1">-----</div>
                    </button>
                  </div>

                  <div class="mb-6">
                    <p class="text-sm text-slate-600 mb-3">
                      Select cities for each day
                    </p>
                  </div>

                  <div
                    v-if="selectedDayForCities"
                    class="border-2 border-orange-200 rounded-xl p-4 bg-orange-50"
                  >
                    <div class="flex items-center justify-between mb-4">
                      <div>
                        <h3 class="text-lg font-semibold text-slate-800">
                          Day {{ selectedDayForCities }} -
                          {{ getDayDateShort(selectedDayForCities) }}
                        </h3>
                        <p class="text-xs text-slate-600 mt-1">
                          Click cities to add them
                        </p>
                      </div>
                      <button
                        v-if="dayCityMap[selectedDayForCities]?.length > 0"
                        @click="clearDayCities(selectedDayForCities)"
                        class="text-sm text-red-500 hover:text-red-700 font-medium"
                      >
                        Clear All
                      </button>
                    </div>

                    <div class="mb-4">
                      <div class="relative">
                        <input
                          v-model="citySearchQuery"
                          type="text"
                          placeholder="Search cities..."
                          class="w-full px-4 py-2 pl-10 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                        <svg
                          class="w-5 h-5 absolute left-3 top-2.5 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                    </div>

                    <div class="flex flex-wrap gap-2 mb-4">
                      <button
                        v-for="city in filteredCities.slice(0, 5)"
                        :key="city"
                        @click="toggleCity(selectedDayForCities, city)"
                        :class="[
                          'px-3 py-1.5 rounded-xl text-xs transition shadow-sm',
                          isCitySelected(selectedDayForCities, city)
                            ? 'bg-orange-500 text-white hover:bg-orange-600'
                            : 'bg-white text-slate-700 hover:bg-orange-100 border-2 border-slate-200',
                        ]"
                      >
                        {{ city.name
                        }}<span
                          v-if="isCitySelected(selectedDayForCities, city)"
                          class="ml-1"
                          >✓</span
                        >
                      </button>
                    </div>

                    <div
                      v-if="dayCityMap[selectedDayForCities]?.length > 0"
                      class="mt-4 pt-4 border-t-2 border-orange-300"
                    >
                      <div class="flex flex-wrap items-center gap-2">
                        <span
                          v-for="(city, idx) in dayCityMap[
                            selectedDayForCities
                          ]"
                          :key="`selected-${city}-${idx}`"
                          class="inline-flex items-center gap-2 bg-orange-500 text-white px-3 py-2 rounded-xl text-xs"
                        >
                          {{ city.name }}
                          <button
                            @click="removeCity(selectedDayForCities, city)"
                            class="hover:text-orange-900 ml-1"
                          >
                            ×
                          </button>
                        </span>
                      </div>
                    </div>
                    <div
                      v-else
                      class="text-center py-6 text-slate-400 text-sm bg-white rounded-lg border-2 border-dashed border-slate-300"
                    >
                      No cities selected for this day yet
                    </div>

                    <div class="flex gap-2 mt-4">
                      <button
                        v-if="selectedDayForCities > 1"
                        @click="selectedDayForCities--"
                        class="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition"
                      >
                        ← Previous Day
                      </button>
                      <button
                        v-if="selectedDayForCities < totalDays"
                        @click="selectedDayForCities++"
                        class="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition"
                      >
                        Next Day →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Attractions -->
          <div v-if="activeQuestion === 1" class="h-full">
            <div
              :class="
                attractionViewMode === 'calendar'
                  ? 'grid grid-cols-1'
                  : 'grid grid-cols-2'
              "
              class="gap-6 h-full"
            >
              <AttractionForm
                v-if="attractionViewMode === 'list'"
                :total-days="totalDays"
                :day-city-map="dayCityMap"
                :adults="packageData.adults"
                :children="packageData.children"
                :start-date="packageData.startDate"
                :mock-data="mockAttractions"
                :editing-index="editingAttraction"
                :editing-data="editingAttractionData"
                @submit="handleAttractionSubmit"
                @cancel="cancelEditAttraction"
              />
              <AttractionList
                :attractions="packageData.attractions"
                :view-mode="attractionViewMode"
                :total-days="totalDays"
                :start-date="packageData.startDate"
                :day-city-map="dayCityMap"
                @update:view-mode="attractionViewMode = $event"
                @edit="editAttraction"
                @remove="removeAttraction"
              />
            </div>
          </div>

          <!-- Step 3: Hotels -->
          <div v-if="activeQuestion === 2" class="h-full">
            <div
              :class="
                hotelViewMode === 'calendar'
                  ? 'grid grid-cols-1'
                  : 'grid grid-cols-2'
              "
              class="gap-6 h-[calc(100%-5rem)]"
            >
              <HotelForm
                v-if="hotelViewMode === 'list'"
                :total-days="totalDays"
                :day-city-map="dayCityMap"
                :start-date="packageData.startDate"
                :end-date="endDateCalculated"
                :mock-data="mockHotels"
                :editing-index="editingHotel"
                :editing-data="editingHotelData"
                @submit="handleHotelSubmit"
                @cancel="cancelEditHotel"
              />
              <HotelList
                :hotels="packageData.hotels"
                :view-mode="hotelViewMode"
                :total-days="totalDays"
                :start-date="packageData.startDate"
                @update:view-mode="hotelViewMode = $event"
                @edit="editHotel"
                @remove="removeHotel"
              />
            </div>
          </div>

          <!-- Step 4: Van Tours -->
          <div v-if="activeQuestion === 3" class="h-full">
            <div
              :class="
                vanTourViewMode === 'calendar'
                  ? 'grid grid-cols-1'
                  : 'grid grid-cols-2'
              "
              class="gap-6 h-[calc(100%-5rem)]"
            >
              <VanTourForm
                v-if="vanTourViewMode === 'list'"
                :total-days="totalDays"
                :day-city-map="dayCityMap"
                :start-date="packageData.startDate"
                :mock-data="mockVanTours"
                :adults="packageData.adults"
                :children="packageData.children"
                :editing-index="editingVanTour"
                :editing-data="editingVanTourData"
                @submit="handleVanTourSubmit"
                @cancel="cancelEditVanTour"
              />
              <VanTourList
                :van-tours="packageData.vanTours"
                :view-mode="vanTourViewMode"
                :total-days="totalDays"
                :start-date="packageData.startDate"
                @update:view-mode="vanTourViewMode = $event"
                @edit="editVanTour"
                @remove="removeVanTour"
              />
            </div>
          </div>

          <!-- Step 5: Sorting Items -->
          <div v-if="activeQuestion === 4">
            <FinalReview
              :total-days="totalDays"
              :start-date="packageData.startDate"
              :day-city-map="dayCityMap"
              :ordered-items="packageData.orderedItems"
              @update:ordered-items="onOrderedItemsUpdate"
              @finalize="savePackage"
            />
          </div>

          <!-- Step 6: Description -->
          <div v-if="activeQuestion === 5">
            <Description
              :total-days="totalDays"
              :start-date="packageData.startDate"
              :ordered-items="packageData.orderedItems"
              :day-city-map="dayCityMap"
              :descriptions="packageData.descriptions"
              @update:descriptions="packageData.descriptions = $event"
            />
          </div>

          <!-- Step 7: Generate PDF -->
          <div v-if="activeQuestion === 6">
            <GeneratePDF
              :total-days="totalDays"
              :start-date="packageData.startDate"
              :ordered-items="packageData.orderedItems"
              :day-city-map="dayCityMap"
              :descriptions="packageData.descriptions"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- SaveChoiceModal — shown when editing a loaded package -->
    <SaveChoiceModal
      :show="showSaveChoiceModal"
      :original-name="originalPackageName"
      :original-id="editingPackageId"
      @close="showSaveChoiceModal = false"
      @choose="onSaveChoiceMade"
    />

    <!-- SaveNameModal — shown for new package OR after "Save as New" choice -->
    <SaveNameModal
      :show="showSaveModal"
      v-model="packageName"
      :is-update="saveMode === 'update'"
      :loading="pkgStore.saveLoading"
      :start-date="packageData.startDate"
      :nights="packageData.nights"
      :adults="packageData.adults"
      :children="packageData.children"
      :total-selling="totalSellingPrice"
      @close="showSaveModal = false"
      @confirm="onSaveConfirmed"
    />
  </Layout>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from "vue";
import Layout from "./Layout.vue";
import AttractionForm from "./GenerateInclusive/AttractionForm.vue";
import AttractionList from "./GenerateInclusive/AttractionList.vue";
import HotelForm from "./GenerateInclusive/HotelForm.vue";
import HotelList from "./GenerateInclusive/HotelList.vue";
import VanTourForm from "./GenerateInclusive/VantourForm.vue";
import VanTourList from "./GenerateInclusive/VantourList.vue";
import FinalReview from "./GenerateInclusive/FinalReview.vue";
import Description from "./GenerateInclusive/Description.vue";
import GeneratePDF from "./GenerateInclusive/GeneratePDF.vue";
import SaveNameModal from "./GenerateInclusive/SaveNameModal.vue";
import SaveChoiceModal from "./GenerateInclusive/SaveChoiceModal.vue";
import PackageListPage from "./GenerateInclusive/PackageListModal.vue";
import { useInclusivePackageStore } from "../stores/inclusivePackage";
import { useCityStore } from "../stores/city";
import { useHotelStore } from "../stores/hotel";
import { storeToRefs } from "pinia";

// ══════════════════════════════════════════
// STORES
// ══════════════════════════════════════════
const cityStore = useCityStore();
const pkgStore = useInclusivePackageStore();
const hotelStore = useHotelStore();
const { cities } = storeToRefs(cityStore);

// ══════════════════════════════════════════
// UID MANAGER
// ══════════════════════════════════════════
let uidCounter = 0;
const mkUid = () => `_uid_${++uidCounter}`;
const ensureUid = (item) => {
  if (!item._uid) item._uid = mkUid();
  return item;
};

// ══════════════════════════════════════════
// VIEW STATE
// ══════════════════════════════════════════
// currentView: 'choose' | 'questions' | 'packageList'  ← added 'packageList'
const currentView = ref("choose");
const activeQuestion = ref(0);
const attractionViewMode = ref("list");
const hotelViewMode = ref("list");
const vanTourViewMode = ref("list");
const showSaveModal = ref(false);
const showSaveChoiceModal = ref(false); // ← NEW: choice modal (update vs new)
const editingPackageId = ref(null);
const originalPackageName = ref(""); // ← name of the package being edited
const saveMode = ref("new"); // ← 'update' | 'new'
const saveSuccess = ref(false);
const packageName = ref("");
const selectedDayForCities = ref(1);
const citySearchQuery = ref("");

// ══════════════════════════════════════════
// EDITING STATE
// ══════════════════════════════════════════
const editingAttraction = ref(null);
const editingHotel = ref(null);
const editingVanTour = ref(null);

// ══════════════════════════════════════════
// QUESTIONS NAV
// ══════════════════════════════════════════
const questions = ref([
  { title: "Trip Info" },
  { title: "Attractions" },
  { title: "Hotels" },
  { title: "Van Tours" },
  { title: "Sorting Items" },
  { title: "Description" },
  { title: "Generate PDF" },
]);

// ══════════════════════════════════════════
// PACKAGE DATA
// ══════════════════════════════════════════
const packageData = reactive({
  adults: 2,
  children: 0,
  startDate: "",
  nights: 3,
  attractions: [],
  hotels: [],
  vanTours: [],
  descriptions: {},
  orderedItems: [],
});

const dayCityMap = reactive({});
const mockAttractions = {};
const mockHotels = {};
const mockVanTours = {};

// ══════════════════════════════════════════
// COMPUTED
// ══════════════════════════════════════════
const totalDays = computed(() =>
  packageData.nights > 0 ? packageData.nights + 1 : 0,
);

const endDateCalculated = computed(() => {
  if (!packageData.startDate || packageData.nights <= 0) return "";
  const d = new Date(packageData.startDate);
  d.setDate(d.getDate() + packageData.nights);
  return d.toISOString().split("T")[0];
});

const totalSellingPrice = computed(() =>
  [
    ...packageData.attractions,
    ...packageData.hotels,
    ...packageData.vanTours,
  ].reduce((sum, i) => sum + (Number(i.sellingPrice) || 0), 0),
);

const filteredCities = computed(() => {
  const data = cities.value?.data ?? [];
  if (!citySearchQuery.value) return data;
  const q = citySearchQuery.value.toLowerCase();
  return data.filter((c) => c.name.toLowerCase().includes(q));
});

const editingAttractionData = computed(() => {
  if (editingAttraction.value === null) return null;
  const item = packageData.attractions[editingAttraction.value];
  if (!item) return null;
  return {
    dayNumber: item.dayNumber,
    type: item.type,
    selectedProduct: item.product,
    selectedVariation: {
      name: item.name,
      description: item.variation,
      price: item.price,
    },
    name: item.name,
    variation: item.variation,
    adults: item.adults,
    children: item.children,
    price: item.price,
  };
});

const editingHotelData = computed(() => {
  if (editingHotel.value === null) return null;
  const item = packageData.hotels[editingHotel.value];
  if (!item) return null;
  return {
    name: item.name,
    variation: item.variation,
    persons: item.persons,
    checkIn: item.checkIn,
    checkOut: item.checkOut,
    selectedProduct: item.name,
    selectedVariation: {
      roomType: item.variation,
      pricePerNight: item.pricePerNight,
    },
    pricePerNight: item.pricePerNight,
  };
});

const editingVanTourData = computed(() => {
  if (editingVanTour.value === null) return null;
  const item = packageData.vanTours[editingVanTour.value];
  if (!item) return null;
  return {
    dayNumber: item.dayNumber,
    selectedProduct: item.route,
    selectedVariation: { type: item.type, capacity: item.passengers },
    type: item.type,
    service: item.service,
    route: item.route,
    passengers: item.passengers,
    pickupTime: item.pickupTime || "",
    duration: item.duration || null,
  };
});

// ══════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════
const getDayDateRaw = (dayNumber, startDate = packageData.startDate) => {
  if (!startDate || !dayNumber) return "";
  const d = new Date(startDate);
  d.setDate(d.getDate() + dayNumber - 1);
  return d.toISOString().split("T")[0];
};

const getDayDateShort = (dayNumber, startDate = packageData.startDate) => {
  if (!startDate || !dayNumber) return "";
  const d = new Date(startDate);
  d.setDate(d.getDate() + dayNumber - 1);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// ══════════════════════════════════════════
// ORDERED ITEMS SYNC
// ══════════════════════════════════════════
const pushToOrderedItems = (type, item) => {
  packageData.orderedItems.push({ ...item, _type: type });
};

const syncOrderedItem = (type, item) => {
  const idx = packageData.orderedItems.findIndex((o) => o._uid === item._uid);
  if (idx !== -1)
    packageData.orderedItems.splice(idx, 1, { ...item, _type: type });
};

const removeFromOrderedItems = (uid) => {
  const idx = packageData.orderedItems.findIndex((o) => o._uid === uid);
  if (idx !== -1) packageData.orderedItems.splice(idx, 1);
};

// ══════════════════════════════════════════
// RESET
// ══════════════════════════════════════════
const resetAllData = () => {
  packageData.adults = 2;
  packageData.children = 0;
  packageData.startDate = "";
  packageData.nights = 3;
  packageData.attractions.splice(0);
  packageData.hotels.splice(0);
  packageData.vanTours.splice(0);
  packageData.descriptions = {};
  packageData.orderedItems.splice(0);
  Object.keys(dayCityMap).forEach((k) => delete dayCityMap[k]);
  uidCounter = 0;
  pkgStore.error = null;
  editingAttraction.value = null;
  editingHotel.value = null;
  editingVanTour.value = null;
};

// ══════════════════════════════════════════
// FILL FROM PACKAGE
// ══════════════════════════════════════════
const fillFromPackage = (pkg) => {
  uidCounter = 0;

  const attractions = (pkg.attractions ?? []).map((a) => ensureUid({ ...a }));
  const hotels = (pkg.hotels ?? []).map((h) => ensureUid({ ...h }));
  const vanTours = (pkg.van_tours ?? []).map((v) => ensureUid({ ...v }));

  const attMap = new Map(
    attractions.map((a) => [`${a.name}::${a.dayNumber}`, a]),
  );
  const hotMap = new Map(hotels.map((h) => [`${h.name}::${h.checkIn}`, h]));
  const vanMap = new Map(
    vanTours.map((v) => [`${v.route}::${v.dayNumber}`, v]),
  );

  let newOrderedItems;
  if (pkg.ordered_items?.length > 0) {
    newOrderedItems = pkg.ordered_items.map((stored) => {
      if (stored._type === "attraction") {
        const live = attMap.get(`${stored.name}::${stored.dayNumber}`);
        if (live) return { ...live, _type: "attraction" };
        return { ...stored, _uid: stored._uid ?? mkUid(), _type: "attraction" };
      }
      if (stored._type === "hotel") {
        const live = hotMap.get(`${stored.name}::${stored.checkIn}`);
        if (live) return { ...live, _type: "hotel" };
        return { ...stored, _uid: stored._uid ?? mkUid(), _type: "hotel" };
      }
      if (stored._type === "van") {
        const live = vanMap.get(`${stored.route}::${stored.dayNumber}`);
        if (live) return { ...live, _type: "van" };
        return { ...stored, _uid: stored._uid ?? mkUid(), _type: "van" };
      }
      return { ...stored, _uid: stored._uid ?? mkUid() };
    });
  } else {
    newOrderedItems = [
      ...vanTours.map((v) => ({ ...v, _type: "van" })),
      ...attractions.map((a) => ({ ...a, _type: "attraction" })),
      ...hotels.map((h) => ({ ...h, _type: "hotel" })),
    ];
  }

  Object.keys(dayCityMap).forEach((k) => delete dayCityMap[k]);
  if (pkg.day_city_map) {
    Object.entries(pkg.day_city_map).forEach(([day, citiesArr]) => {
      dayCityMap[day] = citiesArr;
    });
  }

  packageData.adults = pkg.adults ?? 2;
  packageData.children = pkg.children ?? 0;
  packageData.startDate = pkg.start_date?.split("T")[0] ?? pkg.start_date ?? "";
  packageData.nights = pkg.nights ?? 3;
  packageData.descriptions = pkg.descriptions ?? {};

  packageData.attractions.splice(
    0,
    packageData.attractions.length,
    ...attractions,
  );
  packageData.hotels.splice(0, packageData.hotels.length, ...hotels);
  packageData.vanTours.splice(0, packageData.vanTours.length, ...vanTours);
  packageData.orderedItems.splice(
    0,
    packageData.orderedItems.length,
    ...newOrderedItems,
  );

  syncUidCounter();
};

const syncUidCounter = () => {
  let max = 0;
  [
    ...packageData.attractions,
    ...packageData.hotels,
    ...packageData.vanTours,
    ...packageData.orderedItems,
  ].forEach((item) => {
    if (item._uid) {
      const num = parseInt(item._uid.replace("_uid_", ""), 10);
      if (!isNaN(num) && num > max) max = num;
    }
  });
  uidCounter = max;
};

// ══════════════════════════════════════════
// NAVIGATION HANDLERS
// ══════════════════════════════════════════
const startCreation = (type) => {
  if (type === "external") {
    // Go to full-page package list instead of opening modal
    currentView.value = "packageList";
  } else {
    resetAllData();
    editingPackageId.value = null;
    packageName.value = "";
    currentView.value = "questions";
    activeQuestion.value = 0;
  }
};

const onExternalPackageSelected = (pkg) => {
  resetAllData();
  fillFromPackage(pkg);
  editingPackageId.value = null; // create new copy
  packageName.value = "";
  currentView.value = "questions";
  activeQuestion.value = 0;
};

const onExternalPackageEdit = (pkg) => {
  resetAllData();
  fillFromPackage(pkg);
  editingPackageId.value = pkg.id;
  originalPackageName.value = pkg.package_name ?? ""; // ← store for SaveChoiceModal
  packageName.value = pkg.package_name ?? ""; // ← pre-fill SaveNameModal
  currentView.value = "questions";
  activeQuestion.value = 0;
};

// ══════════════════════════════════════════
// SAVE
// ══════════════════════════════════════════
const savePackage = () => {
  if (editingPackageId.value) {
    // Loaded from an existing package → ask: Update Existing or Save as New?
    showSaveChoiceModal.value = true;
  } else {
    // Brand-new package → go straight to name modal
    saveMode.value = "new";
    packageName.value = packageName.value || "";
    showSaveModal.value = true;
  }
};

// Called when user picks a choice in SaveChoiceModal
const onSaveChoiceMade = (mode) => {
  showSaveChoiceModal.value = false;
  saveMode.value = mode; // 'update' | 'new'

  if (mode === "update") {
    // Keep existing name, open SaveNameModal pre-filled (isUpdate = true)
    packageName.value = originalPackageName.value;
    showSaveModal.value = true;
  } else {
    // Save as new: clear name so user types a fresh one
    packageName.value = "";
    showSaveModal.value = true;
  }
};

const onSaveConfirmed = async (name) => {
  const payload = pkgStore.buildPayload(packageData, dayCityMap, name);
  let result;

  if (saveMode.value === "update" && editingPackageId.value) {
    // Update the original package
    result = await pkgStore.updatePackage(editingPackageId.value, payload);
  } else {
    // Create a brand-new package
    result = await pkgStore.createPackage(payload);
    if (result.success) {
      // Now we're editing this new package going forward
      editingPackageId.value = result.data?.data?.id ?? null;
      originalPackageName.value = name;
      saveMode.value = "update"; // subsequent saves default to update
    }
  }

  if (result.success) {
    showSaveModal.value = false;
    saveSuccess.value = true;
    setTimeout(() => {
      saveSuccess.value = false;
    }, 3000);
  }
};

// ══════════════════════════════════════════
// CITY HANDLERS
// ══════════════════════════════════════════
const toggleCity = (day, city) => {
  if (!dayCityMap[day]) dayCityMap[day] = [];
  const idx = dayCityMap[day].indexOf(city);
  if (idx > -1) dayCityMap[day].splice(idx, 1);
  else dayCityMap[day].push(city);
  citySearchQuery.value = "";
};

const isCitySelected = (day, city) => dayCityMap[day]?.includes(city) ?? false;
const removeCity = (day, city) => {
  const idx = dayCityMap[day]?.indexOf(city) ?? -1;
  if (idx > -1) dayCityMap[day].splice(idx, 1);
};
const clearDayCities = (day) => {
  dayCityMap[day] = [];
};

// ══════════════════════════════════════════
// ATTRACTION HANDLERS
// ══════════════════════════════════════════
const handleAttractionSubmit = (attraction) => {
  if (editingAttraction.value !== null) {
    const existingUid = packageData.attractions[editingAttraction.value]._uid;
    const updated = { ...attraction, _uid: existingUid };
    packageData.attractions.splice(editingAttraction.value, 1, updated);
    syncOrderedItem("attraction", updated);
    editingAttraction.value = null;
  } else {
    const newItem = ensureUid({ ...attraction });
    packageData.attractions.push(newItem);
    pushToOrderedItems("attraction", newItem);
  }
};

const editAttraction = (index) => {
  editingAttraction.value = index;
  attractionViewMode.value = "list";
};
const cancelEditAttraction = () => {
  editingAttraction.value = null;
};
const removeAttraction = (index) => {
  const uid = packageData.attractions[index]?._uid;
  packageData.attractions.splice(index, 1);
  if (uid) removeFromOrderedItems(uid);
  if (editingAttraction.value === index) editingAttraction.value = null;
};

// ══════════════════════════════════════════
// HOTEL HANDLERS
// ══════════════════════════════════════════
const handleHotelSubmit = (hotel) => {
  if (editingHotel.value !== null) {
    const existingUid = packageData.hotels[editingHotel.value]._uid;
    const updated = { ...hotel, _uid: existingUid };
    packageData.hotels.splice(editingHotel.value, 1, updated);
    syncOrderedItem("hotel", updated);
    editingHotel.value = null;
  } else {
    const newItem = ensureUid({ ...hotel });
    packageData.hotels.push(newItem);
    pushToOrderedItems("hotel", newItem);
  }
};

const editHotel = (index) => {
  editingHotel.value = index;
  hotelViewMode.value = "list";
};
const cancelEditHotel = () => {
  editingHotel.value = null;
};
const removeHotel = (index) => {
  const uid = packageData.hotels[index]?._uid;
  packageData.hotels.splice(index, 1);
  if (uid) removeFromOrderedItems(uid);
  if (editingHotel.value === index) editingHotel.value = null;
};

// ══════════════════════════════════════════
// VAN TOUR HANDLERS
// ══════════════════════════════════════════
const handleVanTourSubmit = (vanTour) => {
  if (editingVanTour.value !== null) {
    const existingUid = packageData.vanTours[editingVanTour.value]._uid;
    const updated = { ...vanTour, _uid: existingUid };
    packageData.vanTours.splice(editingVanTour.value, 1, updated);
    syncOrderedItem("van", updated);
    editingVanTour.value = null;
  } else {
    const newItem = ensureUid({ ...vanTour });
    packageData.vanTours.push(newItem);
    pushToOrderedItems("van", newItem);
  }
};

const editVanTour = (index) => {
  editingVanTour.value = index;
  vanTourViewMode.value = "list";
};
const cancelEditVanTour = () => {
  editingVanTour.value = null;
};
const removeVanTour = (index) => {
  const uid = packageData.vanTours[index]?._uid;
  packageData.vanTours.splice(index, 1);
  if (uid) removeFromOrderedItems(uid);
  if (editingVanTour.value === index) editingVanTour.value = null;
};

// ══════════════════════════════════════════
// ORDERED ITEMS UPDATE (from FinalReview drag)
// ══════════════════════════════════════════
const onOrderedItemsUpdate = (updated) => {
  packageData.orderedItems.splice(
    0,
    packageData.orderedItems.length,
    ...updated,
  );
  updated.forEach((item) => {
    if (item._type === "attraction") {
      const src = packageData.attractions.find((a) => a._uid === item._uid);
      if (src) {
        src.dayNumber = item.dayNumber;
        src.serviceDate = item.serviceDate;
        src.dayLabel = item.dayLabel;
      }
    } else if (item._type === "van") {
      const src = packageData.vanTours.find((v) => v._uid === item._uid);
      if (src) {
        src.dayNumber = item.dayNumber;
        src.serviceDate = item.serviceDate;
        src.dayLabel = item.dayLabel;
      }
    }
  });
};

// ══════════════════════════════════════════
// DATE CHANGE WATCHER
// ══════════════════════════════════════════
watch(
  () => [packageData.startDate, packageData.nights],
  async ([newStartDate, newNights], [oldStartDate, oldNights]) => {
    if (!newStartDate || !newNights) return;
    if (newStartDate === oldStartDate && newNights === oldNights) return;

    packageData.attractions.forEach((a) => {
      if (!a.dayNumber) return;
      a.serviceDate = getDayDateRaw(a.dayNumber, newStartDate);
      a.dayLabel = getDayDateShort(a.dayNumber, newStartDate);
    });

    packageData.vanTours.forEach((v) => {
      if (!v.dayNumber) return;
      v.serviceDate = getDayDateRaw(v.dayNumber, newStartDate);
      v.dayLabel = getDayDateShort(v.dayNumber, newStartDate);
    });

    for (const h of packageData.hotels) {
      if (!h.checkInDay || !h.checkOutDay) continue;
      h.checkIn = getDayDateRaw(h.checkInDay, newStartDate);
      h.checkOut = getDayDateRaw(h.checkOutDay, newStartDate);
      h.checkInLabel = getDayDateShort(h.checkInDay, newStartDate);
      h.checkOutLabel = getDayDateShort(h.checkOutDay, newStartDate);

      const res = await hotelStore.searchHotels(
        [],
        "",
        h.checkIn,
        h.checkOut,
        h.hotelId,
      );
      if (res?.result?.data?.length > 0) {
        const rooms = res.result.data[0].rooms ?? [];
        for (const room of rooms) {
          if (room.id === h.roomId) {
            h.costPrice = room.total_cost_price * h.rooms;
            h.sellingPrice = room.total_selling_price * h.rooms;
          }
        }
      }
    }

    packageData.orderedItems.forEach((item) => {
      if (item._type === "attraction" || item._type === "van") {
        item.serviceDate = getDayDateRaw(item.dayNumber, newStartDate);
        item.dayLabel = getDayDateShort(item.dayNumber, newStartDate);
      }
      if (item._type === "hotel") {
        item.checkIn = getDayDateRaw(item.checkInDay, newStartDate);
        item.checkOut = getDayDateRaw(item.checkOutDay, newStartDate);
        item.checkInLabel = getDayDateShort(item.checkInDay, newStartDate);
        item.checkOutLabel = getDayDateShort(item.checkOutDay, newStartDate);
      }
    });
  },
);

watch(totalDays, (newVal) => {
  if (newVal > 0 && !selectedDayForCities.value) selectedDayForCities.value = 1;
});

// ══════════════════════════════════════════
// MOUNT
// ══════════════════════════════════════════
onMounted(async () => {
  await cityStore.getSimpleListAction();
});
</script>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
