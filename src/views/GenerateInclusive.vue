<template>
  <Layout :title="'generate inclusive'">
    <div class="min-h-full bg-slate-50">
      <!-- Choose Step - Initial Selection -->
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

      <!-- Question Steps -->
      <div
        v-if="currentView === 'questions'"
        class="w-full min-h-full grid grid-cols-5 gap-4"
      >
        <!-- Left Sidebar - Questions Navigation -->
        <div class="col-span-1 space-y-3">
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
        </div>

        <!-- Right Content Area - Question Display -->
        <div
          class="col-span-4 border-2 border-slate-300 rounded-2xl overflow-y-auto bg-white p-4"
          style="height: calc(100vh - 7.5rem)"
        >
          <!-- Question 1: Basic Trip Info -->
          <div v-if="activeQuestion === 0" class="h-full">
            <div class="grid grid-cols-2 gap-6 h-full">
              <!-- LEFT SIDE: Basic Info -->
              <div>
                <!-- <h2 class="text-2xl font-bold text-slate-800 mb-6">
                  Basic Trip Info
                </h2> -->

                <!-- Number of People -->
                <div class="bg-white rounded-xl mb-6">
                  <h3 class="text-lg font-semibold text-slate-800 mb-4">
                    Number of People
                  </h3>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        class="block text-sm font-medium text-slate-700 mb-2"
                      >
                        Adults
                      </label>
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
                      >
                        Children
                      </label>
                      <input
                        v-model.number="packageData.children"
                        type="number"
                        min="0"
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-lg"
                      />
                    </div>
                  </div>
                </div>

                <!-- Trip Duration -->
                <div class="bg-white rounded-xl">
                  <h3 class="text-lg font-semibold text-slate-800 mb-4">
                    Trip Duration
                  </h3>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        class="block text-sm font-medium text-slate-700 mb-2"
                      >
                        Start Date
                      </label>
                      <input
                        v-model="packageData.startDate"
                        type="date"
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-lg"
                      />
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-slate-700 mb-2"
                      >
                        Number of Nights
                      </label>
                      <input
                        v-model.number="packageData.nights"
                        type="number"
                        min="1"
                        placeholder="e.g., 3 nights = 4 days"
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-lg"
                      />
                    </div>
                  </div>
                  <!-- <div
                    v-if="totalDays > 0"
                    class="mt-4 text-center text-orange-600 font-semibold text-lg bg-orange-50 rounded-xl py-3"
                  >
                    {{ packageData.nights }} nights = {{ totalDays }} days
                    <div class="text-sm text-slate-600 mt-1">
                      {{ formatDate(packageData.startDate) }} to
                      {{ formatDate(endDateCalculated) }}
                    </div>
                  </div> -->
                </div>
              </div>

              <!-- RIGHT SIDE: City Assignment - Step by Step -->
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
                        v-if="dayCityMap[day] && dayCityMap[day].length > 0"
                        class="text-xs mt-1"
                      >
                        {{ dayCityMap[day].length }}
                        {{ dayCityMap[day].length === 1 ? "city" : "cities" }}
                      </div>
                      <div v-else>
                        <div class="text-xs mt-1">-----</div>
                      </div>
                    </button>
                  </div>
                  <!-- Day Selection Tabs -->
                  <div class="mb-6">
                    <p class="text-sm text-slate-600 mb-3">
                      Select cities for each day (you can select multiple cities
                      per day)
                    </p>
                  </div>

                  <!-- City Selection for Selected Day -->
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
                          Click cities to add them to this day's itinerary
                        </p>
                      </div>
                      <button
                        v-if="
                          dayCityMap[selectedDayForCities] &&
                          dayCityMap[selectedDayForCities].length > 0
                        "
                        @click="clearDayCities(selectedDayForCities)"
                        class="text-sm text-red-500 hover:text-red-700 font-medium"
                      >
                        Clear All
                      </button>
                    </div>

                    <!-- Search/Filter Cities -->
                    <div class="mb-4">
                      <div class="relative">
                        <input
                          v-model="citySearchQuery"
                          type="text"
                          placeholder="Search cities..."
                          class="w-full px-4 py-2 pl-10 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
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

                    <!-- City Selection Chips -->
                    <div class="flex flex-wrap gap-2 mb-4">
                      <button
                        v-for="city in filteredCities.slice(0, 5)"
                        :key="city"
                        @click="toggleCity(selectedDayForCities, city)"
                        :class="[
                          ' px-3 py-1.5 rounded-xl text-xs transition shadow-sm',
                          isCitySelected(selectedDayForCities, city)
                            ? 'bg-orange-500 text-white hover:bg-orange-600'
                            : 'bg-white text-slate-700 hover:bg-orange-100 border-2 border-slate-200',
                        ]"
                      >
                        {{ city.name }}
                        <span
                          v-if="isCitySelected(selectedDayForCities, city)"
                          class="ml-1"
                          >✓</span
                        >
                      </button>
                    </div>

                    <!-- No Results -->
                    <div
                      v-if="filteredCities.length === 0"
                      class="text-center py-4 text-slate-400 text-sm"
                    >
                      No cities found matching "{{ citySearchQuery }}"
                    </div>

                    <!-- Selected Cities Display (Route) -->
                    <div
                      v-if="
                        dayCityMap[selectedDayForCities] &&
                        dayCityMap[selectedDayForCities].length > 0
                      "
                      class="mt-4 pt-4 border-t-2 border-orange-300"
                    >
                      <div class="flex items-center gap-2 mb-2">
                        <svg
                          class="w-4 h-4 text-orange-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span class="text-sm font-semibold text-slate-700"
                          >Route for Day {{ selectedDayForCities }}:</span
                        >
                      </div>
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
                        <svg
                          v-if="
                            idx < dayCityMap[selectedDayForCities].length - 1
                          "
                          class="w-4 h-4 text-orange-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </div>
                    </div>

                    <!-- Empty State for Selected Day -->
                    <div
                      v-else
                      class="text-center py-6 text-slate-400 text-sm bg-white rounded-lg border-2 border-dashed border-slate-300"
                    >
                      <svg
                        class="w-12 h-12 mx-auto mb-2 text-slate-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      No cities selected for this day yet
                    </div>

                    <!-- Navigation Buttons -->
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

                  <!-- Overall Trip Summary -->
                  <!-- <div
                    v-if="allSelectedCities.length > 0"
                    class="mt-6 pt-6 border-t-2 border-slate-200"
                  >
                    <h4
                      class="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                      </svg>
                      Trip Summary
                    </h4>

                    
                    <div class="mb-3">
                      <div class="flex items-center gap-2 text-sm">
                        <span class="text-slate-600">Days with cities:</span>
                        <span class="font-semibold text-slate-800">
                          {{
                            Object.keys(dayCityMap).filter(
                              (day) =>
                                dayCityMap[day] && dayCityMap[day].length > 0,
                            ).length
                          }}
                          / {{ totalDays }}
                        </span>
                      </div>
                    </div>

                    
                    <div>
                      <span class="text-xs text-slate-500 block mb-2"
                        >All cities in your trip:</span
                      >
                      <div class="flex flex-wrap gap-2">
                        <span
                          v-for="city in allSelectedCities"
                          :key="city"
                          class="inline-block bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold"
                        >
                          {{ city }}
                        </span>
                      </div>
                    </div>
                  </div> -->
                </div>
              </div>
            </div>
          </div>

          <!-- Question 2: Attractions -->
          <div v-if="activeQuestion === 1" class="h-full">
            <!-- <h2 class="text-2xl font-bold text-slate-800 mb-6">
              Where do you want to visit?
            </h2> -->

            <div
              :class="
                attractionViewMode === 'calendar'
                  ? 'grid grid-cols-1'
                  : 'grid grid-cols-2'
              "
              class="gap-6 h-full"
            >
              <!-- LEFT SIDE: Add Form -->
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

              <!-- RIGHT SIDE: List with Toggle View -->
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

          <!-- Question 3: Hotels -->
          <div v-if="activeQuestion === 2" class="h-full">
            <div
              :class="
                hotelViewMode === 'calendar'
                  ? 'grid grid-cols-1'
                  : 'grid grid-cols-2'
              "
              class="gap-6 h-[calc(100%-5rem)]"
            >
              <!-- LEFT SIDE: Add Form -->
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

              <!-- RIGHT SIDE: List with Toggle View -->
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

          <!-- Question 4: Van Tours -->
          <div v-if="activeQuestion === 3" class="h-full">
            <div
              :class="
                vanTourViewMode === 'calendar'
                  ? 'grid grid-cols-1'
                  : 'grid grid-cols-2'
              "
              class="gap-6 h-[calc(100%-5rem)]"
            >
              <!-- LEFT SIDE: Form -->
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

              <!-- RIGHT SIDE: List -->
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

          <!-- Question 5: Final Review -->
          <div v-if="activeQuestion === 4">
            <FinalReview
              :total-days="totalDays"
              :start-date="packageData.startDate"
              :day-city-map="dayCityMap"
              :ordered-items="packageData.orderedItems"
              @update:ordered-items="onOrderedItemsUpdate"
              @finalize="finalizePackage"
            />
          </div>

          <!-- Question 6: Description -->
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

          <!-- Question 6: Generate PDF -->
          <div v-if="activeQuestion === 6">
            <!-- <GeneratePDF
              :total-days="totalDays"
              :start-date="packageData.startDate"
              :ordered-items="packageData.orderedItems"
              :day-city-map="dayCityMap"
              :descriptions="packageData.descriptions"
            /> -->
            <p>this is generate part</p>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from "vue";
import Layout from "./Layout.vue";
import AttractionForm from "./GenerateInclusive/AttractionForm.vue";
import AttractionList from "./GenerateInclusive/AttractionList.vue";
import HotelForm from "./GenerateInclusive/HotelForm.vue";
import HotelList from "./GenerateInclusive/HotelList.vue";
import VanTourForm from "./GenerateInclusive/VantourForm.vue";
import VanTourList from "./GenerateInclusive/VantourList.vue";
import FinalReview from "./GenerateInclusive/FinalReview.vue";
import { watch } from "vue";
import { useCityStore } from "../stores/city";
import { storeToRefs } from "pinia";
import Description from "./GenerateInclusive/Description.vue";

// Store part
const cityStore = useCityStore();
const { cities } = storeToRefs(cityStore);

// ============================================
// VIEW STATES
// ============================================
const currentView = ref("choose");
const activeQuestion = ref(0);
const attractionViewMode = ref("list");
const hotelViewMode = ref("list");
const vanTourViewMode = ref("list");

// ============================================
// EDITING STATES
// ============================================
const editingAttraction = ref(null);
const editingHotel = ref(null);
const editingVanTour = ref(null);

// ============================================
// NAVIGATION DATA
// ============================================
const questions = ref([
  { title: "Trip Info", summary: "" },
  { title: "Attractions", summary: "" },
  { title: "Hotels", summary: "" },
  { title: "Van Tours", summary: "" },
  { title: "Sorting Items", summary: "" },
  { title: "Description", summary: "" },
  { title: "Generate PDF", summary: "" },
]);

// City search and selection
const selectedDayForCities = ref(1); // Start with Day 1 selected
const citySearchQuery = ref("");

// ============================================
// PACKAGE DATA
// ============================================
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

// Available cities
// const availableCities = ref([]);

// Filtered cities based on search
const filteredCities = computed(() => {
  if (!citySearchQuery.value) {
    return cities.value.data;
  }
  const query = citySearchQuery.value.toLowerCase();
  return cities?.value.data?.filter((city) =>
    city.name.toLowerCase().includes(query),
  );
});

// Update this computed
const allSelectedCities = computed(() => {
  return uniqueCitiesInTrip.value;
});

// Update uniqueCitiesInTrip to handle arrays
const uniqueCitiesInTrip = computed(() => {
  const cities = Object.values(dayCityMap)
    .filter((citiesArray) => citiesArray && citiesArray.length > 0)
    .flat();
  return [...new Set(cities)];
});

// ============================================
// CITY SELECTION HANDLERS
// ============================================
const toggleCity = (day, city) => {
  if (!dayCityMap[day]) {
    dayCityMap[day] = [];
  }

  const index = dayCityMap[day].indexOf(city);
  if (index > -1) {
    dayCityMap[day].splice(index, 1);
  } else {
    dayCityMap[day].push(city);
  }

  console.log(dayCityMap, "this is day city map");

  // Clear search after selection
  citySearchQuery.value = "";
};

const isCitySelected = (day, city) => {
  return dayCityMap[day] && dayCityMap[day].includes(city);
};

const removeCity = (day, city) => {
  if (dayCityMap[day]) {
    const index = dayCityMap[day].indexOf(city);
    if (index > -1) {
      dayCityMap[day].splice(index, 1);
    }
  }
};

const clearDayCities = (day) => {
  dayCityMap[day] = [];
};

// ============================================
// MOCK DATA (Replace with API calls)
// ============================================
const mockAttractions = {
  "Chiang Mai": {
    "Doi Inthanon National Park": [
      {
        name: "Standard Package",
        description: "Includes waterfall visits and summit",
        price: 300,
      },
      {
        name: "Premium Package",
        description: "With lunch and local guide",
        price: 450,
      },
    ],
    "Wat Phra That Doi Suthep": [
      {
        name: "Temple Entry Only",
        description: "Basic entrance to the temple",
        price: 100,
      },
      {
        name: "With Guide Tour",
        description: "Guided temple tour included",
        price: 200,
      },
    ],
    "Queen Sirikit Botanic Garden": [
      {
        name: "General Admission",
        description: "Access to all gardens",
        price: 100,
      },
      {
        name: "VIP Tour",
        description: "Private garden tour with botanist",
        price: 350,
      },
    ],
  },
  "Chiang Rai": {
    "White Temple (Wat Rong Khun)": [
      {
        name: "Standard Entry",
        description: "Basic temple entrance",
        price: 200,
      },
      {
        name: "Photography Package",
        description: "With special photo spots",
        price: 300,
      },
    ],
    "Black House Museum": [
      {
        name: "Museum Entry",
        description: "Access to all exhibits",
        price: 100,
      },
      {
        name: "Guided Tour",
        description: "With art historian guide",
        price: 250,
      },
    ],
    "Blue Temple (Wat Rong Suea Ten)": [
      {
        name: "Temple Entry",
        description: "General admission",
        price: 60,
      },
    ],
  },
  Bangkok: {
    "Grand Palace": [
      {
        name: "Standard Entry",
        description: "Access to palace complex",
        price: 500,
      },
      {
        name: "VIP Tour",
        description: "Skip line with guide",
        price: 800,
      },
    ],
    "Wat Arun": [
      {
        name: "Temple Entry",
        description: "Climb the central prang",
        price: 100,
      },
    ],
    "Chatuchak Market": [
      {
        name: "Market Walking Tour",
        description: "Guided tour with tastings",
        price: 150,
      },
    ],
  },
};

const mockHotels = {
  "Chiang Mai": {
    "Asana Grove Hotel": [
      { roomType: "Deluxe Room", pricePerNight: 2500 },
      { roomType: "Suite", pricePerNight: 4000 },
      { roomType: "Villa", pricePerNight: 6500 },
    ],
    "Hyatt Regency": [
      { roomType: "Standard Room", pricePerNight: 3500 },
      { roomType: "Deluxe Room", pricePerNight: 4500 },
      { roomType: "Executive Suite", pricePerNight: 7000 },
    ],
    "Sheraton Yogyakarta": [
      { roomType: "Superior Room", pricePerNight: 3000 },
      { roomType: "Suite", pricePerNight: 4500 },
    ],
  },
  Bangkok: {
    "Mandarin Oriental": [
      { roomType: "Deluxe Room", pricePerNight: 8000 },
      { roomType: "Suite", pricePerNight: 15000 },
    ],
    "Lebua Hotel": [
      { roomType: "Standard Room", pricePerNight: 10000 },
      { roomType: "Sky Suite", pricePerNight: 12000 },
    ],
  },
  "Chiang Rai": {
    "Le Meridien": [
      { roomType: "Standard Room", pricePerNight: 2800 },
      { roomType: "Deluxe Room", pricePerNight: 3500 },
    ],
    "Katiliya Hotel": [
      { roomType: "Superior Room", pricePerNight: 2200 },
      { roomType: "Deluxe Room", pricePerNight: 3000 },
    ],
  },
};

const mockVanTours = {
  "Airport Transfer": [
    { type: "Sedan (3 pax)", capacity: 3, pricePerDay: 1500 },
    { type: "Van (9 pax)", capacity: 9, pricePerDay: 2500 },
    { type: "Minibus (15 pax)", capacity: 15, pricePerDay: 4000 },
  ],
  "City Tour": [
    { type: "Van (9 pax)", capacity: 9, pricePerDay: 3000 },
    { type: "Minibus (15 pax)", capacity: 15, pricePerDay: 4500 },
    { type: "Bus (30 pax)", capacity: 30, pricePerDay: 7000 },
  ],
  "Day Trip": [
    { type: "Van (9 pax)", capacity: 9, pricePerDay: 3500 },
    { type: "Minibus (15 pax)", capacity: 15, pricePerDay: 5000 },
    { type: "Bus (30 pax)", capacity: 30, pricePerDay: 8000 },
  ],
  "Temple Tour": [
    { type: "Van (9 pax)", capacity: 9, pricePerDay: 2800 },
    { type: "Minibus (15 pax)", capacity: 15, pricePerDay: 4200 },
  ],
};

// ============================================
// COMPUTED PROPERTIES
// ============================================
const totalDays = computed(() =>
  packageData.nights > 0 ? packageData.nights + 1 : 0,
);

const endDateCalculated = computed(() => {
  if (!packageData.startDate || packageData.nights <= 0) return "";
  const start = new Date(packageData.startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + packageData.nights);
  return end.toISOString().split("T")[0];
});

const editingAttractionData = computed(() => {
  if (editingAttraction.value === null) return null;
  const item = packageData.attractions[editingAttraction.value];
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
  return {
    dayNumber: item.dayNumber,
    selectedProduct: item.route,
    selectedVariation: {
      type: item.type,
      capacity: item.passengers,
    },
    type: item.type,
    service: item.service,
    route: item.route,
    passengers: item.passengers,
    pickupTime: item.pickupTime || "",
    duration: item.duration || null,
  };
});

// ============================================
// UTILITY FUNCTIONS
// ============================================
const getDayDateShort = (dayNumber) => {
  if (!packageData.startDate) return "";
  const start = new Date(packageData.startDate);
  const current = new Date(start);
  current.setDate(start.getDate() + dayNumber - 1);
  return current.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

// ============================================
// NAVIGATION HANDLERS
// ============================================
const startCreation = (type) => {
  currentView.value = "questions";
};

// ============================================
// ATTRACTION HANDLERS
// ============================================
const handleAttractionSubmit = (attraction) => {
  console.log(attraction, "this is attraction");

  if (editingAttraction.value !== null) {
    packageData.attractions[editingAttraction.value] = attraction;
    editingAttraction.value = null;
  } else {
    packageData.attractions.push(attraction);
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
  packageData.attractions.splice(index, 1);
  if (editingAttraction.value === index) {
    editingAttraction.value = null;
  }
};

// ============================================
// HOTEL HANDLERS
// ============================================
const handleHotelSubmit = (hotel) => {
  console.log(hotel, "this is hotel");
  if (editingHotel.value !== null) {
    packageData.hotels[editingHotel.value] = hotel;
    editingHotel.value = null;
  } else {
    packageData.hotels.push(hotel);
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
  packageData.hotels.splice(index, 1);
  if (editingHotel.value === index) {
    editingHotel.value = null;
  }
};

// ============================================
// VAN TOUR HANDLERS
// ============================================
const handleVanTourSubmit = (vanTour) => {
  console.log(vanTour, "this is van tour");
  if (editingVanTour.value !== null) {
    packageData.vanTours[editingVanTour.value] = vanTour;
    editingVanTour.value = null;
  } else {
    packageData.vanTours.push(vanTour);
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
  packageData.vanTours.splice(index, 1);
  if (editingVanTour.value === index) {
    editingVanTour.value = null;
  }
};

// Watch totalDays to auto-select first day
watch(totalDays, (newVal) => {
  if (newVal > 0 && !selectedDayForCities.value) {
    selectedDayForCities.value = 1;
  }
});

// ============================================
// FINAL ACTIONS
// ============================================
const finalizePackage = () => {
  alert("Package created successfully! 🎉\n\nReady to send to customer.");
  console.log("Final Package:", packageData);
};

// get city data
const getCityData = async () => {
  try {
    const res = await cityStore.getSimpleListAction();
    console.log(cities.value, "this is city list");
  } catch (error) {
    console.log(error);
  }
};

let uidCounter = 0;
const mkUid = () => `_uid_${++uidCounter}`;

const onOrderedItemsUpdate = (updated) => {
  // 1. Save new ordered list
  packageData.orderedItems = updated;

  // 2. Write day changes back into source arrays so AttractionList / VanTourList stay in sync
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
    // Hotels: date is intentionally NOT written back (day-change blocked in FinalReview)
  });
};

// (e.g. when user adds an attraction then comes back to FinalReview)
watch(
  () => [
    packageData.attractions.length,
    packageData.hotels.length,
    packageData.vanTours.length,
  ],
  () => {
    const existingUids = new Set(packageData.orderedItems.map((i) => i._uid));

    // ── Van Tours ──
    packageData.vanTours.forEach((v) => {
      if (!v._uid) v._uid = mkUid();
      if (!existingUids.has(v._uid)) {
        packageData.orderedItems.push({
          ...v,
          _type: "van",
          _order: packageData.orderedItems.filter((x) => x._type === "van")
            .length,
        });
        existingUids.add(v._uid);
      }
    });

    // ── Attractions ──
    packageData.attractions.forEach((a) => {
      if (!a._uid) a._uid = mkUid();
      if (!existingUids.has(a._uid)) {
        packageData.orderedItems.push({
          ...a,
          _type: "attraction",
          _order: packageData.orderedItems.filter(
            (x) => x._type === "attraction",
          ).length,
        });
        existingUids.add(a._uid);
      }
    });

    // ── Hotels ──
    packageData.hotels.forEach((h) => {
      if (!h._uid) h._uid = mkUid();
      if (!existingUids.has(h._uid)) {
        packageData.orderedItems.push({
          ...h,
          _type: "hotel",
          _order: packageData.orderedItems.filter((x) => x._type === "hotel")
            .length,
        });
        existingUids.add(h._uid);
      }
    });

    // ── Remove items deleted from source arrays ──
    const vanUids = new Set(
      packageData.vanTours.map((v) => v._uid).filter(Boolean),
    );
    const attUids = new Set(
      packageData.attractions.map((a) => a._uid).filter(Boolean),
    );
    const hotUids = new Set(
      packageData.hotels.map((h) => h._uid).filter(Boolean),
    );

    packageData.orderedItems = packageData.orderedItems.filter((item) => {
      if (item._type === "van") return vanUids.has(item._uid);
      if (item._type === "attraction") return attUids.has(item._uid);
      if (item._type === "hotel") return hotUids.has(item._uid);
      return true;
    });
  },
  { immediate: true },
);

onMounted(async () => {
  await getCityData();
});
</script>

<style scoped>
/* Custom scrollbar */
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
</style>
