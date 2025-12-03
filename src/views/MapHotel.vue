<template>
  <Layout>
    <div class="relative w-full h-full">
      <div class="fixed inset-0 w-full h-full overflow-hidden overscroll-none">
        <!-- Redesigned Filter Bar - Always Visible -->
        <div class="absolute top-5 right-4 transform w-[30%] z-[1001]">
          <div class="bg-white rounded-2xl shadow-lg p-4 space-y-3">
            <!-- Back Button Row -->
            <div class="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div class="flex-1" @click="showDateBox = true">
                <p class="text-xs text-gray-500">choose city & place & price</p>
              </div>
            </div>

            <!-- City Filter -->
            <div>
              <div class="flex justify-between items-center mb-3">
                <p class="text-xs font-semibold text-gray-700">City</p>
                <div class="flex justify-end">
                  <button
                    @click="toggleSearchPanel"
                    class="flex items-center gap-2 text-xs font-medium bg-white text-[#FF613c] rounded-full cursor-pointer transition-all"
                  >
                    See More
                  </button>
                </div>
              </div>
              <div
                class="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1"
              >
                <button
                  @click="setCity('')"
                  :class="[
                    selectedCity === ''
                      ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                      : 'border-gray-300 bg-white text-gray-700',
                    { 'bg-gray-300 text-black/30': loading },
                  ]"
                  class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                >
                  All Cities
                </button>
                <button
                  v-for="city in visibleCities"
                  :key="city.id"
                  @click="setCity(city.id)"
                  :class="[
                    selectedCity === city.id
                      ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                      : 'border-gray-300 bg-white text-gray-700',
                    { 'bg-gray-300 text-black/30': loading },
                  ]"
                  class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                >
                  {{ city.name }}
                </button>
                <!-- <button
                  @click="showCityModal = true"
                  class="whitespace-nowrap px-4 py-2 text-xs font-medium border border-gray-300 bg-white text-gray-700 rounded-full cursor-pointer transition-all hover:shadow-md hover:border-[#FF613c] hover:text-[#FF613c]"
                >
                  See more
                </button> -->
              </div>
            </div>

            <!-- Place Filter (shown when city is selected) -->
            <div v-if="selectedCity && visiblePlaces">
              <div class="flex justify-between items-center mb-3">
                <p class="text-xs font-semibold text-gray-700">Place</p>
                <div class="flex justify-end">
                  <button
                    @click="toggleSearchPanel"
                    class="flex items-center gap-2 text-xs font-medium bg-white text-[#FF613c] rounded-full cursor-pointer transition-all"
                  >
                    See More
                  </button>
                </div>
              </div>
              <div
                class="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1"
              >
                <button
                  @click="selectedPlace = ''"
                  :class="[
                    selectedPlace === ''
                      ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                      : 'border-gray-300 bg-white text-gray-700',
                    { 'bg-gray-300 text-black/30': loading },
                  ]"
                  class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                >
                  All Places
                </button>
                <button
                  v-for="place in visiblePlaces"
                  :key="place"
                  @click="setPlace(place.name)"
                  :class="[
                    selectedPlace === place.name
                      ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                      : 'border-gray-300 bg-white text-gray-700',
                    { 'bg-gray-300 text-black/30': loading },
                  ]"
                  class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                >
                  {{ place.name }}
                </button>
                <!-- <button
                  v-if="getPlaceList.length > 4"
                  @click="showPlaceModal = true"
                  class="whitespace-nowrap px-4 py-2 text-xs font-medium border border-gray-300 bg-white text-gray-700 rounded-full cursor-pointer transition-all hover:shadow-md hover:border-[#FF613c] hover:text-[#FF613c]"
                >
                  See more
                </button> -->
              </div>
            </div>

            <!-- Price Filter -->
            <div>
              <div class="flex justify-between items-center mb-3">
                <p class="text-xs font-semibold text-gray-700">Price Range</p>
                <div class="flex justify-end">
                  <button
                    @click="toggleSearchPanel"
                    class="flex items-center gap-2 text-xs font-medium bg-white text-[#FF613c] rounded-full cursor-pointer transition-all"
                  >
                    See More
                  </button>
                </div>
              </div>
              <div
                class="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1"
              >
                <button
                  @click="setPriceFilter('')"
                  :class="[
                    priceFilter === ''
                      ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                      : 'border-gray-300 bg-white text-gray-700',
                    { 'bg-gray-300 text-black/30': loading },
                  ]"
                  class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                >
                  All Prices
                </button>
                <button
                  @click="setPriceFilter('0-1200')"
                  :class="[
                    priceFilter === '0-1200'
                      ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                      : 'border-gray-300 bg-white text-gray-700',
                    { 'bg-gray-300 text-black/30': loading },
                  ]"
                  class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                >
                  Budget <span class="text-[10px]">(&lt; 1200฿)</span>
                </button>
                <button
                  @click="setPriceFilter('1200-1800')"
                  :class="[
                    priceFilter === '1200-1800'
                      ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                      : 'border-gray-300 bg-white text-gray-700',
                    { 'bg-gray-300 text-black/30': loading },
                  ]"
                  class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                >
                  Standard <span class="text-[10px]">(1200-1800฿)</span>
                </button>
                <button
                  @click="setPriceFilter('1800-3000')"
                  :class="[
                    priceFilter === '1800-3000'
                      ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                      : 'border-gray-300 bg-white text-gray-700',
                    { 'bg-gray-300 text-black/30': loading },
                  ]"
                  class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                >
                  Premium <span class="text-[10px]">(1800-3000฿)</span>
                </button>
                <button
                  @click="setPriceFilter('3000-100000')"
                  :class="[
                    priceFilter === '3000-100000'
                      ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                      : 'border-gray-300 bg-white text-gray-700',
                    { 'bg-gray-300 text-black/30': loading },
                  ]"
                  class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                >
                  Luxury <span class="text-[10px]">(3000+฿)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <Modal
          :isOpen="showSearchPanel"
          :marginTop="'mt-16'"
          @closeModal="toggleSearchPanel()"
        >
          <DialogPanel
            class="w-full max-w-lg p-6 overflow-hidden text-left align-middle transition-all transform bg-white rounded-2xl shadow-xl"
          >
            <div>
              <div class="grid grid-cols-2 gap-2">
                <div class="col-span-2 pb-3">
                  <div>
                    <p class="text-sm text-[#FF613c] font-medium mb-3">
                      Price Range
                    </p>
                    <div
                      class="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1"
                    >
                      <button
                        @click="setPriceFilter('')"
                        :class="[
                          priceFilter === ''
                            ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                            : 'border-gray-300 bg-white text-gray-700',
                          { 'bg-gray-300 text-black/30': loading },
                        ]"
                        class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                      >
                        All Prices
                      </button>
                      <button
                        @click="setPriceFilter('0-1200')"
                        :class="[
                          priceFilter === '0-1200'
                            ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                            : 'border-gray-300 bg-white text-gray-700',
                          { 'bg-gray-300 text-black/30': loading },
                        ]"
                        class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                      >
                        Budget <span class="text-[10px]">(&lt; 1200฿)</span>
                      </button>
                      <button
                        @click="setPriceFilter('1200-1800')"
                        :class="[
                          priceFilter === '1200-1800'
                            ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                            : 'border-gray-300 bg-white text-gray-700',
                          { 'bg-gray-300 text-black/30': loading },
                        ]"
                        class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                      >
                        Standard <span class="text-[10px]">(1200-1800฿)</span>
                      </button>
                      <button
                        @click="setPriceFilter('1800-3000')"
                        :class="[
                          priceFilter === '1800-3000'
                            ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                            : 'border-gray-300 bg-white text-gray-700',
                          { 'bg-gray-300 text-black/30': loading },
                        ]"
                        class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                      >
                        Premium <span class="text-[10px]">(1800-3000฿)</span>
                      </button>
                      <button
                        @click="setPriceFilter('3000-100000')"
                        :class="[
                          priceFilter === '3000-100000'
                            ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                            : 'border-gray-300 bg-white text-gray-700',
                          { 'bg-gray-300 text-black/30': loading },
                        ]"
                        class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                      >
                        Luxury <span class="text-[10px]">(3000+฿)</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 class="text-sm text-[#FF613c] font-medium">
                    Choose City
                  </h2>
                  <div
                    class="space-y-1 h-[250px] pr-2 pl-1 pt-3 overflow-y-scroll scroll-container-y"
                  >
                    <div
                      class="flex justify-between items-center space-y-2 pb-3 pt-1.5 px-3 border rounded-full"
                      v-for="c in cityList ?? []"
                      :key="c"
                      :class="
                        c.id == selectedCity
                          ? ' border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                          : ''
                      "
                      @click="
                        () => {
                          selectedCity = c.id;
                          chooseCityName = c.name;
                        }
                      "
                    >
                      <p
                        class="text-xs w-[110px] mt-1.5 line-clamp-1"
                        :class="c.id == selectedCity ? 'text-[#FF613c]' : ''"
                      >
                        {{ c.name }}
                      </p>
                      <input
                        type="checkbox"
                        class=""
                        name=""
                        :checked="c.id == selectedCity"
                        id=""
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h2 class="text-sm text-[#FF613c] font-medium">
                    Choose Place
                  </h2>
                  <div
                    class="space-y-1 h-[250px] overflow-y-scroll scroll-container-y pt-3"
                    v-if="!loadingPlace"
                  >
                    <div
                      class="flex justify-between items-center space-y-2 pb-3 pt-1.5 px-3 border rounded-full"
                      @click="selectedPlace = ''"
                      :class="
                        selectedPlace == ''
                          ? ' border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                          : ''
                      "
                    >
                      <p
                        class="text-xs w-[110px] mt-1.5 line-clamp-1"
                        :class="selectedPlace == '' ? 'text-[#FF613c]' : ''"
                      >
                        All places
                      </p>
                      <input
                        type="checkbox"
                        name=""
                        :checked="selectedPlace == ''"
                        id=""
                      />
                    </div>
                    <div
                      class="flex justify-between items-center space-y-2 pb-3 pt-1.5 px-3 border rounded-full"
                      v-for="p in getPlaceList ?? []"
                      :key="p"
                      :class="
                        p.name == selectedPlace
                          ? ' border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                          : ''
                      "
                      @click="selectedPlace = p.name"
                    >
                      <p
                        class="text-xs w-[110px] mt-1.5 line-clamp-1"
                        :class="p.name == selectedPlace ? 'text-[#FF613c]' : ''"
                      >
                        {{ p.name }}
                      </p>
                      <input
                        type="checkbox"
                        name=""
                        :checked="p.name == selectedPlace"
                        id=""
                      />
                    </div>
                  </div>
                  <div
                    v-else
                    class="flex justify-center items-center h-[200px]"
                  >
                    <div class="flex gap-1">
                      <div
                        class="w-2 h-2 rounded-full bg-[#FF613c] animate-bounce"
                      ></div>
                      <div
                        class="w-2 h-2 rounded-full bg-[#FF613c] animate-bounce [animation-delay:-.3s]"
                      ></div>
                      <div
                        class="w-2 h-2 rounded-full bg-[#FF613c] animate-bounce [animation-delay:-.5s]"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="flex justify-end items-center gap-x-3 pt-4 border-t border-black/5 mt-3"
              >
                <p
                  @click="showSearchPanel = false"
                  class="text-xs font-medium px-3 py-2 border border-black/10 rounded-full"
                >
                  Cancel
                </p>
                <p
                  @click="resetFilters"
                  class="text-xs font-medium px-3 py-2 bg-red-500 text-white rounded-full"
                >
                  Reset
                </p>
                <p
                  @click="applyFilters"
                  class="text-xs font-medium px-3 py-2 bg-[#FF613c] text-white rounded-full"
                >
                  Apply
                </p>
              </div>
            </div>
          </DialogPanel>
        </Modal>

        <!-- Detail Modal -->
        <Modal
          :isOpen="hotelModalOpen"
          :marginTop="'mt-4'"
          @closeModal="closeHotelModal()"
        >
          <DialogPanel
            class="w-full max-w-4xl overflow-hidden text-left align-middle transition-all transform bg-white rounded-2xl shadow-xl"
          >
            <DetailComponent
              :hotelId="hotelDetailId"
              :closeModal="closeHotelModal"
            />
          </DialogPanel>
        </Modal>

        <!-- Hotel List Toggle Button - FIXED -->
        <button
          @click="toggleHotelList"
          :style="{
            bottom: showHotelList ? `${250}px` : `${100}px`,
          }"
          :class="showHotelList ? 'rotate-[180deg]' : ''"
          class="absolute right-3 z-[1001] w-12 h-12 bg-white border border-black/10 hover:bg-gray-50 rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
        >
          <svg
            enable-background="new 0 0 32 32"
            height="20px"
            id="Layer_1"
            version="1.1"
            viewBox="0 0 32 32"
            width="32px"
            xml:space="preserve"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <path
              d="M18.221,7.206l9.585,9.585c0.879,0.879,0.879,2.317,0,3.195l-0.8,0.801c-0.877,0.878-2.316,0.878-3.194,0  l-7.315-7.315l-7.315,7.315c-0.878,0.878-2.317,0.878-3.194,0l-0.8-0.801c-0.879-0.878-0.879-2.316,0-3.195l9.587-9.585  c0.471-0.472,1.103-0.682,1.723-0.647C17.115,6.524,17.748,6.734,18.221,7.206z"
              fill="#515151"
            />
          </svg>
        </button>

        <!-- Map -->
        <div id="map" ref="mapRef" class="w-full h-full"></div>

        <!-- Scrollable Hotel Cards at Bottom - FIXED -->
        <transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-8"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-8"
        >
          <div
            v-if="showHotelList"
            class="absolute left-4 right-4 md:left-[100px] md:right-5 z-[999] bottom-5 tablet:bottom-[100px] ipad-pro:bottom-[120px] mobile:bottom-[140px] pointer-events-none"
          >
            <div
              ref="hotelListContainer"
              class="flex gap-3 overflow-x-auto pb-2 pointer-events-auto scrollbar-hide scroll-smooth"
            >
              <div
                v-for="hotel in filteredHotels"
                :key="hotel.id"
                :ref="(el) => setHotelCardRef(el, hotel.id)"
                :data-hotel-id="hotel.id"
                @click="scrollToHotel(hotel.id)"
                :class="[
                  'flex-shrink-0 w-80  rounded-xl shadow-md transition-all duration-300 cursor-pointer overflow-hidden',
                  selectedHotelId === hotel.id ? 'bg-[#FF613c]' : 'bg-white',
                ]"
              >
                <div class="flex">
                  <!-- Hotel Image - Left Side -->
                  <div class="relative w-32 h-[165px] flex-shrink-0">
                    <img
                      :src="
                        hotel.images?.[0]?.image ||
                        'https://via.placeholder.com/300x300?text=No+Image'
                      "
                      :alt="hotel.name"
                      class="w-full h-full object-cover"
                    />
                  </div>

                  <!-- Hotel Info - Right Side -->
                  <div class="flex-1 p-3 flex flex-col justify-between">
                    <!-- Top Section -->
                    <div>
                      <h3
                        class="font-semibold text-sm mb-1 line-clamp-1"
                        :class="
                          selectedHotelId === hotel.id
                            ? 'text-white'
                            : 'text-gray-900'
                        "
                      >
                        {{ hotel.name }}
                      </h3>

                      <!-- Star Rating -->
                      <div class="flex items-center gap-1 mb-1">
                        <span class="text-yellow-400 text-sm">{{
                          "★".repeat(hotel.rating || 0)
                        }}</span>
                      </div>
                      <p
                        class="text-[10px]"
                        :class="
                          selectedHotelId === hotel.id
                            ? 'text-white'
                            : 'text-gray-900'
                        "
                      >
                        Starting from
                      </p>
                      <div class="flex items-start justify-between mt-2">
                        <div class="text-right">
                          <!-- Current Price -->
                          <div
                            class="text-xl font-bold"
                            :class="
                              selectedHotelId === hotel.id
                                ? 'text-white'
                                : 'text-gray-900'
                            "
                          >
                            {{
                              hotel.lowest_room_price?.toLocaleString() || "999"
                            }}
                            <span class="text-base">฿</span>
                          </div>
                        </div>
                      </div>
                      <div
                        class="flex px-2 text-xs mt-2 rounded-full justify-center py-2"
                        @click="getViewDetail(hotel.id)"
                        :class="
                          selectedHotelId === hotel.id
                            ? 'text-white bg-white/20'
                            : 'text-gray-900 bg-gray-300/20'
                        "
                      >
                        View Detail
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- Loading Overlay -->
        <div
          v-if="loading"
          class="absolute inset-0 bg-white/80 flex items-center justify-center z-[2000]"
        >
          <div
            class="w-12 h-12 border-4 border-[#FF613c]/20 border-t-[#FF613c] rounded-full animate-spin"
          ></div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed, watch } from "vue";
import { useHotelStore } from "../stores/hotel";
import Layout from "./Layout.vue";
import DetailComponent from "./MapComponent/Detail.vue";
import { useCityStore } from "../stores/city";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Modal from "../components/Modal.vue";
import { DialogPanel, DialogTitle } from "@headlessui/vue";
// Import marker cluster
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { useRoute, useRouter } from "vue-router";
import { FunnelIcon, XMarkIcon } from "@heroicons/vue/24/outline";

const hotelStore = useHotelStore();
const cityStore = useCityStore();
const router = useRouter();
const route = useRoute();

// State
const loading = ref(false);
const allHotels = ref([]);
const cityList = ref([]);
const selectedCity = ref(2);
const selectedPlace = ref("");
const priceFilter = ref("");
const showSearchPanel = ref(false);
const showHotelList = ref(true);
const selectedHotelId = ref(2);
const hotelListContainer = ref(null);
const hotelCardRefs = ref({});
const showDateBox = ref(false);
const safeAreaBottom = ref(0);
const loadingPlace = ref(false);
const chooseCityName = ref("");
const showCityModal = ref(false);
const showPlaceModal = ref(false);

const checkin_date = ref(
  localStorage.getItem("checkin_date")
    ? localStorage.getItem("checkin_date").replace('"', "")
    : ""
);
const checkout_date = ref(
  localStorage.getItem("checkout_date")
    ? localStorage.getItem("checkout_date").replace('"', "")
    : ""
);
const room_qty = ref(localStorage.getItem("room_qty") || "");

// Map variables
let map = null;
let markerClusterGroup = null;

// Show only first 4 cities
const visibleCities = computed(() => {
  const selectedIndex = cityList.value.findIndex(
    (city) => city.id === selectedCity.value
  );
  const startIndex = selectedIndex !== -1 ? selectedIndex : 0;
  return cityList.value.slice(startIndex, startIndex + 4);
});

const visiblePlaces = computed(() => {
  const selectedIndex = getPlaceList.value.findIndex(
    (place) => place.name == selectedPlace.value
  );
  const startIndex = selectedIndex !== -1 ? selectedIndex : 0;
  return getPlaceList.value.slice(startIndex, startIndex + 4);
});

const closeShowDateBox = () => {
  checkin_date.value = localStorage.getItem("checkin_date") || "";
  checkout_date.value = localStorage.getItem("checkout_date") || "";
  room_qty.value = localStorage.getItem("room_qty") || "";
  showDateBox.value = false;
};

const setCity = (cityId) => {
  if (loading.value) return;
  selectedCity.value = cityId;
  selectedPlace.value = ""; // Reset place when city changes
  updateMapMarkers();
  setTimeout(() => {
    centerMapOnFilteredHotels();
  }, 300);
};

const setPlace = (place) => {
  if (loading.value) return;
  selectedPlace.value = place;
  updateMapMarkers();
  setTimeout(() => {
    centerMapOnFilteredHotels();
  }, 300);
};

const setPriceFilter = (filter) => {
  if (loading.value) return;
  priceFilter.value = filter;
  updateMapMarkers();
  setTimeout(() => {
    centerMapOnFilteredHotels();
  }, 300);
};

const getFilterPriceName = (filter) => {
  switch (filter) {
    case "0-1200":
      return "budget (< 1200฿)";
    case "1200-1800":
      return "standard (1200 - 1800฿)";
    case "1800-3000":
      return "premium (1800 - 3000฿)";
    case "3000-100000":
      return "luxury (3000+฿)";
    default:
      return "all";
  }
};

const isHotelInPriceRange = (hotel) => {
  if (!priceFilter.value) return true;
  const price = hotel.lowest_room_price || 0;
  const [min, max] = priceFilter.value.split("-").map(Number);
  return price >= min && price <= max;
};

// ... existing refs
const citySearchQuery = ref("");
const placeSearchQuery = ref("");

// ... existing code

// Filtered cities based on search
const filteredCities = computed(() => {
  if (!citySearchQuery.value) {
    return cityList.value;
  }

  const query = citySearchQuery.value.toLowerCase().trim();
  return cityList.value.filter((city) =>
    city.name.toLowerCase().includes(query)
  );
});

// Filtered places based on search
const filteredPlaces = computed(() => {
  const places = getPlaceList.value;

  if (!placeSearchQuery.value) {
    return places;
  }

  const query = placeSearchQuery.value.toLowerCase().trim();
  return places.filter((place) => place.name.toLowerCase().includes(query));
});

const filteredHotels = computed(() => {
  let filtered = allHotels.value;

  if (selectedCity.value) {
    filtered = filtered.filter((hotel) => hotel.city_id == selectedCity.value);
  }

  if (selectedPlace.value) {
    filtered = filtered.filter((hotel) => hotel.place === selectedPlace.value);
  }

  if (priceFilter.value) {
    filtered = filtered.filter(isHotelInPriceRange);
  }

  return filtered;
});

const getCities = async () => {
  const res = await cityStore.getListHotelCityAction({
    limit: 100,
  });
  cityList.value = res.data;
  console.log("====================================");
  console.log(cityList.value, "this is city list");
  console.log("====================================");
};

const getPlaceList = computed(() => {
  if (!selectedCity.value || !cityList.value.length) {
    return [];
  }

  const city = cityList.value.find((c) => c.id == selectedCity.value);

  if (city?.places) {
    if (typeof city.places === "object" && !Array.isArray(city.places)) {
      // Convert to array of objects with id and name
      return Object.entries(city.places).map(([id, name]) => ({
        id,
        name,
      }));
    }
    return city.places;
  }

  return [];
});

const getCityName = (cityId) => {
  const city = cityList.value.find((c) => c.id == cityId);
  return city ? city.name : "All cities";
};

const toggleSearchPanel = () => {
  showSearchPanel.value = !showSearchPanel.value;
};

const toggleHotelList = () => {
  showHotelList.value = !showHotelList.value;
};

const setHotelCardRef = (el, hotelId) => {
  if (el) {
    hotelCardRefs.value[hotelId] = el;
  }
};

const scrollToHotel = (hotelId) => {
  const allMarkers = document.querySelectorAll(".price-badge");
  allMarkers.forEach((marker) => {
    marker.classList.remove("active");
  });

  const activeMarker = document.querySelector(
    `.price-badge[data-hotel-id="${hotelId}"]`
  );
  if (activeMarker) {
    activeMarker.classList.add("active");
  }

  if (!showHotelList.value) {
    showHotelList.value = true;
  }

  selectedHotelId.value = hotelId;

  setTimeout(() => {
    const hotelCard = hotelCardRefs.value[hotelId];
    if (hotelCard && hotelListContainer.value) {
      const containerRect = hotelListContainer.value.getBoundingClientRect();
      const cardRect = hotelCard.getBoundingClientRect();
      const scrollLeft =
        hotelCard.offsetLeft - containerRect.width / 2 + cardRect.width / 2;

      hotelListContainer.value.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, 100);
};

const getMapList = async () => {
  try {
    loading.value = true;
    const res = await hotelStore.getMapListAction();
    console.log(res, "this is map");

    if (res.result == 1) {
      allHotels.value = res.data;
      console.log(allHotels.value, "this is map");
      initializeMap();
    }
  } catch (error) {
    console.error("Error fetching hotels:", error);
  } finally {
    loading.value = false;
  }
};

const onFilterChange = () => {
  updateMapMarkers();
};

const applyFilters = () => {
  onFilterChange();
  toggleSearchPanel();
  setTimeout(() => {
    centerMapOnFilteredHotels();
  }, 300);
};

const resetFilters = () => {
  selectedCity.value = "";
  selectedPlace.value = "";
  priceFilter.value = "";
  updateMapMarkers();
};

const initializeMap = () => {
  map = L.map("map").setView([13.7563, 100.5018], 6);

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    }
  ).addTo(map);

  markerClusterGroup = L.markerClusterGroup({
    maxClusterRadius: 80,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    disableClusteringAtZoom: 14,

    iconCreateFunction: function (cluster) {
      const childCount = cluster.getChildCount();

      return L.divIcon({
        html: `
          <div class="cluster-marker-new">
            <div class="cluster-content">
              ${childCount} hotels
            </div>
          </div>
        `,
        className: "custom-cluster-icon",
        iconSize: L.point(100, 40),
        iconAnchor: [50, 20],
      });
    },
  });

  map.addLayer(markerClusterGroup);
  updateMapMarkers();
};

const updateMapMarkers = () => {
  if (markerClusterGroup) {
    markerClusterGroup.clearLayers();
  }

  const markers = [];

  filteredHotels.value.forEach((hotel) => {
    if (hotel.latitude && hotel.longitude) {
      const formattedPrice = hotel.lowest_room_price
        ? `฿${hotel.lowest_room_price.toLocaleString()}`
        : "N/A";

      const priceIcon = L.divIcon({
        className: "custom-price-marker",
        html: `<div class="price-badge" data-hotel-id="${hotel.id}">${formattedPrice}</div>`,
        iconSize: [80, 32],
        iconAnchor: [40, 16],
        popupAnchor: [0, -16],
      });

      const marker = L.marker(
        [parseFloat(hotel.latitude), parseFloat(hotel.longitude)],
        {
          icon: priceIcon,
          hotelData: hotel,
        }
      );

      marker.on("click", () => {
        scrollToHotel(hotel.id);
      });

      markers.push(marker);
    }
  });

  if (markerClusterGroup) {
    markerClusterGroup.addLayers(markers);
  }

  if (markers.length > 0) {
    const bounds = markerClusterGroup.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.1));
    }
  }

  if (markers.length > 0) {
    setTimeout(() => {
      centerMapOnFilteredHotels();
    }, 100);
  }
};

watch([selectedCity, selectedPlace, priceFilter], () => {
  if (selectedCity.value || selectedPlace.value || priceFilter.value) {
    centerMapOnFilteredHotels();
  }
});

const centerMapOnFilteredHotels = () => {
  if (!map || filteredHotels.value.length === 0) return;

  const validCoordinates = filteredHotels.value
    .filter((hotel) => hotel.latitude && hotel.longitude)
    .map((hotel) => [parseFloat(hotel.latitude), parseFloat(hotel.longitude)]);

  if (validCoordinates.length === 0) return;

  if (validCoordinates.length === 1) {
    map.setView(validCoordinates[0], 16, {
      animate: true,
      duration: 1,
    });
  } else {
    const latitudes = validCoordinates.map((coord) => coord[0]);
    const longitudes = validCoordinates.map((coord) => coord[1]);

    const centerLat = latitudes.reduce((a, b) => a + b) / latitudes.length;
    const centerLng = longitudes.reduce((a, b) => a + b) / longitudes.length;

    map.setView([centerLat, centerLng], 15, {
      animate: true,
      duration: 1,
    });
  }
};

const hotelModalOpen = ref(false);
const hotelDetailId = ref(null);
const getViewDetail = async (hotelId) => {
  hotelDetailId.value = hotelId;
  hotelModalOpen.value = true;
};

const closeHotelModal = () => {
  hotelModalOpen.value = false;
  hotelDetailId.value = null;
};

onMounted(async () => {
  console.log("Map Page Loaded");
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";

  await getCities();
  await getMapList();
});

onUnmounted(() => {
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
});
</script>

<style scoped>
/* Hide scrollbar but keep functionality */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scroll-smooth {
  scroll-behavior: smooth;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom price marker styles */
:deep(.custom-price-marker) {
  background: none;
  border: none;
}

:deep(.price-badge) {
  background: #ffffff;
  color: black;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(52, 52, 52, 0.4);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 0.5px solid #7272727d;
}

:deep(.price-badge:hover) {
  background: #ffffff;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(104, 104, 104, 0.6);
}

:deep(.price-badge.active) {
  background: #f97316 !important;
  color: white !important;
  border-color: #f97316 !important;
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(249, 115, 22, 0.6);
}

/* Cluster marker styles */
:deep(.custom-cluster-icon) {
  background: none;
  border: none;
}

:deep(.cluster-marker-new) {
  background: #ffffff;
  border-radius: 24px;
  padding: 8px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e0e0e0;
  white-space: nowrap;
}

:deep(.cluster-marker-new:hover) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

:deep(.cluster-content) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: #000000;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.2;
}

/* Custom scrollbar for modal */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #e5e7eb #f9fafb;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f9fafb;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}
</style>
