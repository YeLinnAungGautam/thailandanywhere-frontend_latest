<template>
  <Layout>
    <div class="fixed inset-0 w-full h-full overflow-hidden overscroll-none">
      <!-- Centered Search Bar (Airbnb Style) -->
      <div
        class="absolute top-5 left-1/2 transform w-[50%] -translate-x-1/2 z-[1001]"
      >
        <button
          class="bg-white rounded-full w-full shadow-lg pl-5 pr-5 py-3 flex items-center justify-between gap-3 hover:shadow-xl transition-all duration-300"
        >
          <div @click="router.back()">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </div>
          <div class="text-left pl-4" @click="showDateBox = true">
            <p class="text-sm font-semibold text-gray-900 line-clamp-1">
              {{
                selectedCity ? getCityName(selectedCity) : "Hotels in map area"
              }}
              {{ selectedPlace ? ` · ${selectedPlace}` : "" }}
              {{ priceFilter ? ` · ${getFilterPriceName(priceFilter)}` : "" }}
            </p>
            <p class="text-[10px] text-gray-500">
              {{
                checkin_date && checkout_date && room_qty
                  ? checkin_date.replace('"', "") +
                    " - " +
                    checkout_date.replace('"', "") +
                    " · " +
                    room_qty +
                    " room"
                  : "Click here to choose dates"
              }}
            </p>
          </div>

          <div
            @click="toggleSearchPanel"
            class="w-8 h-8 bg-[#FF613c] rounded-full flex items-center justify-center"
          >
            <FunnelIcon class="w-4 h-4 text-white" />
          </div>
        </button>
      </div>

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

      <Modal :isOpen="showSearchPanel" @closeModal="showSearchPanel = false">
        <DialogPanel
          class="w-full max-w-xl p-4 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl"
        >
          <DialogTitle
            as="h3"
            class="text-lg font-medium leading-6 text-gray-900"
          >
            Search
          </DialogTitle>

          <div class="grid grid-cols-2 gap-2 pt-5">
            <div class="col-span-2 pb-4">
              <!-- Price Filter Bar - NEW -->
              <div class="">
                <div class="flex justify-start items-center space-x-1.5 pb-1">
                  <p
                    @click="setPriceFilter('')"
                    :class="[
                      priceFilter == ''
                        ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                        : 'border-black/10 bg-white',
                      { 'bg-gray-300 text-black/30': loading },
                    ]"
                    class="whitespace-nowrap px-3 py-1.5 shadow-md text-[10px] border rounded-full cursor-pointer transition-all"
                  >
                    all
                  </p>

                  <p
                    @click="setPriceFilter('0-1200')"
                    :class="[
                      priceFilter == '0-1200'
                        ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                        : 'border-black/10 bg-white',
                      { 'bg-gray-300 text-black/30': loading },
                    ]"
                    class="whitespace-nowrap px-3 py-1.5 shadow-md text-[10px] border rounded-full cursor-pointer transition-all"
                  >
                    budget <span class="text-[8px]">(&lt; 1200฿)</span>
                  </p>

                  <p
                    @click="setPriceFilter('1200-1800')"
                    :class="[
                      priceFilter == '1200-1800'
                        ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                        : 'border-black/10 bg-white',
                      { 'bg-gray-300 text-black/30': loading },
                    ]"
                    class="whitespace-nowrap px-3 py-1.5 shadow-md text-[10px] border rounded-full cursor-pointer transition-all"
                  >
                    standard <span class="text-[8px]">(1200 - 1800฿)</span>
                  </p>

                  <p
                    @click="setPriceFilter('1800-3000')"
                    :class="[
                      priceFilter == '1800-3000'
                        ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                        : 'border-black/10 bg-white',
                      { 'bg-gray-300 text-black/30': loading },
                    ]"
                    class="whitespace-nowrap px-3 py-1.5 shadow-md text-[10px] border rounded-full cursor-pointer transition-all"
                  >
                    premium <span class="text-[8px]">(1800 - 3000฿)</span>
                  </p>

                  <p
                    @click="setPriceFilter('3000-100000')"
                    :class="[
                      priceFilter == '3000-100000'
                        ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                        : 'border-black/10 bg-white',
                      { 'bg-gray-300 text-black/30': loading },
                    ]"
                    class="whitespace-nowrap px-3 py-1.5 shadow-md text-[10px] border rounded-full cursor-pointer transition-all"
                  >
                    luxury <span class="text-[8px]">(3000+฿)</span>
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h2 class="text-sm text-[#FF613c] font-medium">Choose City</h2>
              <div
                class="space-y-1 h-[200px] pr-2 pl-1 pt-3 overflow-y-scroll scroll-container-y"
              >
                <div
                  class="flex justify-between items-center space-y-2 pb-2 pt-0.5 px-2"
                  v-for="c in cityList ?? []"
                  :key="c"
                  :class="c.id == selectedCity ? ' shadow-md rounded-xl' : ''"
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
              <h2 class="text-sm text-[#FF613c] font-medium">Choose Place</h2>
              <div
                class="space-y-1 h-[200px] overflow-y-scroll scroll-container-y pt-3"
                v-if="!loadingPlace"
              >
                <div
                  class="flex justify-between items-center space-y-2 pb-2 pt-0.5 px-2"
                  @click="selectedPlace = ''"
                  :class="
                    selectedPlace == ''
                      ? ' shadow-md border border-black/5 rounded-xl'
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
                  class="flex justify-between items-center space-y-2 pb-2 pt-0.5 px-2"
                  v-for="p in getPlaceList ?? []"
                  :key="p"
                  :class="
                    p == selectedPlace
                      ? ' shadow-md border border-black/5 rounded-xl'
                      : ''
                  "
                  @click="selectedPlace = p"
                >
                  <p
                    class="text-xs w-[110px] mt-1.5 line-clamp-1"
                    :class="p == selectedPlace ? 'text-[#FF613c]' : ''"
                  >
                    {{ p }}
                  </p>
                  <input
                    type="checkbox"
                    name=""
                    :checked="p == selectedPlace"
                    id=""
                  />
                </div>
              </div>
              <div v-else class="flex justify-center items-center h-[200px]">
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
              class="text-xs font-medium px-3 py-2 border border-black/10 rounded-full cursor-pointer"
            >
              Cancel
            </p>
            <p
              @click="resetFilters"
              class="text-xs font-medium px-3 py-2 bg-red-500 text-white rounded-full cursor-pointer"
            >
              Reset
            </p>
            <p
              @click="applyFilters"
              class="text-xs font-medium px-3 py-2 bg-[#FF613c] text-white rounded-full cursor-pointer"
            >
              Apply
            </p>
          </div>
        </DialogPanel>
      </Modal>

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
          class="absolute left-5 right-5 z-[999] bottom-[100px] pointer-events-none"
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
  </Layout>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed, watch } from "vue";
import { useHotelStore } from "../stores/hotel";
import Layout from "./Layout.vue";
import { useCityStore } from "../stores/city";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Modal from "../components/Modal.vue";
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
const priceFilter = ref(""); // NEW - Price filter state
const showSearchPanel = ref(false);
const showHotelList = ref(true);
const selectedHotelId = ref(2);
const hotelListContainer = ref(null);
const hotelCardRefs = ref({});
const showDateBox = ref(false);
const safeAreaBottom = ref(0);
const loadingPlace = ref(false);
const chooseCityName = ref("");

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
let markerClusterGroup = null; // Cluster group

const closeShowDateBox = () => {
  checkin_date.value = localStorage.getItem("checkin_date") || "";
  checkout_date.value = localStorage.getItem("checkout_date") || "";
  room_qty.value = localStorage.getItem("room_qty") || "";
  showDateBox.value = false;
};

// NEW - Price filter function
const setPriceFilter = (filter) => {
  if (loading.value) return;
  priceFilter.value = filter;
  updateMapMarkers();

  // Center map on filtered hotels after a short delay
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

// NEW - Check if hotel price is within the selected range
const isHotelInPriceRange = (hotel) => {
  if (!priceFilter.value) return true; // No filter applied

  const price = hotel.lowest_room_price || 0;
  const [min, max] = priceFilter.value.split("-").map(Number);

  return price >= min && price <= max;
};

const filteredHotels = computed(() => {
  let filtered = allHotels.value;

  if (selectedCity.value) {
    filtered = filtered.filter((hotel) => hotel.city_id == selectedCity.value);
  }

  if (selectedPlace.value) {
    filtered = filtered.filter((hotel) => hotel.place === selectedPlace.value);
  }

  // NEW - Apply price filter
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
};

const getPlaceList = computed(() => {
  if (selectedCity.value != "") {
    const resp = cityList.value.filter((c) => c.id == selectedCity.value);
    if (resp.length > 0) {
      return resp[0].places;
    }
  }
  return [];
});

// Helper method to get city name
const getCityName = (cityId) => {
  const city = cityList.value.find((c) => c.id == cityId);
  return city ? city.name : "All cities";
};

// Methods
const toggleSearchPanel = () => {
  showSearchPanel.value = !showSearchPanel.value;
};

const toggleHotelList = () => {
  showHotelList.value = !showHotelList.value;
};

// Set hotel card refs for scrolling
const setHotelCardRef = (el, hotelId) => {
  if (el) {
    hotelCardRefs.value[hotelId] = el;
  }
};

// Scroll to specific hotel in the list
const scrollToHotel = (hotelId) => {
  // Remove active class from all markers
  const allMarkers = document.querySelectorAll(".price-badge");
  allMarkers.forEach((marker) => {
    marker.classList.remove("active");
  });

  // Add active class to clicked marker
  const activeMarker = document.querySelector(
    `.price-badge[data-hotel-id="${hotelId}"]`
  );
  if (activeMarker) {
    activeMarker.classList.add("active");
  }

  // Make sure hotel list is visible
  if (!showHotelList.value) {
    showHotelList.value = true;
  }

  // Set selected hotel
  selectedHotelId.value = hotelId;

  // Wait for next tick to ensure DOM is updated
  setTimeout(() => {
    const hotelCard = hotelCardRefs.value[hotelId];
    if (hotelCard && hotelListContainer.value) {
      // Calculate scroll position to center the card
      const containerRect = hotelListContainer.value.getBoundingClientRect();
      const cardRect = hotelCard.getBoundingClientRect();
      const scrollLeft =
        hotelCard.offsetLeft - containerRect.width / 2 + cardRect.width / 2;

      // Smooth scroll to the hotel card
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
  // Update markers based on filtered hotels
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
  priceFilter.value = ""; // NEW - Reset price filter
  updateMapMarkers();
};

const initializeMap = () => {
  // Initialize map centered on Thailand
  map = L.map("map").setView([13.7563, 100.5018], 6);

  // Add light-styled tile layer with English labels
  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    }
  ).addTo(map);

  // Initialize marker cluster group with updated settings
  markerClusterGroup = L.markerClusterGroup({
    // Clustering options
    maxClusterRadius: 80,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    disableClusteringAtZoom: 14,

    // Custom cluster icon
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

  // Add initial hotel markers
  updateMapMarkers();
};

const updateMapMarkers = () => {
  // Clear existing markers from cluster group
  if (markerClusterGroup) {
    markerClusterGroup.clearLayers();
  }

  const markers = [];

  filteredHotels.value.forEach((hotel) => {
    if (hotel.latitude && hotel.longitude) {
      // Format price for display
      const formattedPrice = hotel.lowest_room_price
        ? `฿${hotel.lowest_room_price.toLocaleString()}`
        : "N/A";

      // Custom marker icon with price badge
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

      // Add click event to scroll to hotel instead of showing popup
      marker.on("click", () => {
        scrollToHotel(hotel.id);
      });

      markers.push(marker);
    }
  });

  // Add all markers to cluster group at once
  if (markerClusterGroup) {
    markerClusterGroup.addLayers(markers);
  }

  // Fit map to show all markers
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

// Add this computed property to watch for filter changes
watch([selectedCity, selectedPlace, priceFilter], () => {
  if (selectedCity.value || selectedPlace.value || priceFilter.value) {
    centerMapOnFilteredHotels();
  }
});

// Add this method to center and zoom the map
const centerMapOnFilteredHotels = () => {
  if (!map || filteredHotels.value.length === 0) return;

  const validCoordinates = filteredHotels.value
    .filter((hotel) => hotel.latitude && hotel.longitude)
    .map((hotel) => [parseFloat(hotel.latitude), parseFloat(hotel.longitude)]);

  if (validCoordinates.length === 0) return;

  if (validCoordinates.length === 1) {
    // If only one hotel, center on it with a close zoom
    map.setView(validCoordinates[0], 16, {
      animate: true,
      duration: 1,
    });
  } else {
    // Calculate center point of all hotels
    const latitudes = validCoordinates.map((coord) => coord[0]);
    const longitudes = validCoordinates.map((coord) => coord[1]);

    const centerLat = latitudes.reduce((a, b) => a + b) / latitudes.length;
    const centerLng = longitudes.reduce((a, b) => a + b) / longitudes.length;

    // Zoom to center point with fixed zoom level (closer zoom)
    map.setView([centerLat, centerLng], 15, {
      animate: true,
      duration: 1,
    });
  }
};

onMounted(async () => {
  console.log("Map Page Loaded");

  // Prevent body scroll
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

/* Smooth scrolling */
.scroll-smooth {
  scroll-behavior: smooth;
}

/* Line clamp for text overflow */
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

/* Cluster marker styles - New Design */
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

:deep(.cluster-hotel-count) {
  font-size: 10px;
  font-weight: 500;
  color: #666666;
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

/* Slide down transition */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
