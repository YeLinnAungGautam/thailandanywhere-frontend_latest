<template>
  <div class="map-preview">
    <div
      v-if="latitude && longitude"
      id="map"
      class="w-full h-[600px] rounded-lg"
    ></div>
    <div
      v-else
      class="w-full h-[600px] rounded-lg bg-gray-100 flex items-center justify-center text-gray-500"
    >
      <p class="text-sm">Enter coordinates to preview map</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const props = defineProps({
  latitude: {
    type: [String, Number],
    default: null,
  },
  longitude: {
    type: [String, Number],
    default: null,
  },
  radiusKm: {
    type: [String, Number],
    default: 5,
  },
});

let map = null;
let marker = null;
let circle = null;

const initMap = () => {
  const lat = parseFloat(props.latitude);
  const lng = parseFloat(props.longitude);
  const radius = parseFloat(props.radiusKm) || 5;

  if (isNaN(lat) || isNaN(lng)) {
    return;
  }

  // Destroy existing map if it exists
  if (map) {
    map.remove();
    map = null;
  }

  // Create map
  map = L.map("map").setView([lat, lng], 12);

  // BEST OPTIONS FOR ENGLISH CITY/PLACE NAMES (No API Key Required):

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution: "© Stadia Maps © OpenStreetMap contributors",
      maxZoom: 20,
    }
  ).addTo(map);

  // Add marker
  marker = L.marker([lat, lng]).addTo(map);

  // Add circle (radius in meters, so convert km to meters)
  circle = L.circle([lat, lng], {
    color: "#3b82f6",
    fillColor: "#3b82f6",
    fillOpacity: 0.2,
    radius: radius * 1000,
  }).addTo(map);

  // Fit bounds to show circle
  map.fitBounds(circle.getBounds());
};

// Watch for prop changes
watch(
  [() => props.latitude, () => props.longitude, () => props.radiusKm],
  async () => {
    await nextTick();
    if (props.latitude && props.longitude) {
      initMap();
    }
  },
  { immediate: true }
);

onMounted(async () => {
  await nextTick();
  if (props.latitude && props.longitude) {
    initMap();
  }
});
</script>

<style scoped>
.map-preview {
  width: 100%;
}

#map {
  z-index: 0;
}
</style>
