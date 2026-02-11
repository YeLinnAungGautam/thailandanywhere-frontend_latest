<template>
  <div class="grid grid-cols-2 gap-8">
    <div class="space-y-8">
      <div
        class="border border-gray-200 rounded-lg py-6 px-4 shadow-sm bg-gray-50/30"
      >
        <h4
          class="text-lg font-semibold text-gray-800 mb-6 pb-3 border-gray-200"
        >
          Location Details
        </h4>
        <div class="space-y-5">
          <div class="space-y-2">
            <label
              for="location-map-title"
              class="text-sm font-medium text-gray-700"
              >Location Map Title (Address)</label
            >
            <input
              type="text"
              v-model="currentData.location_map_title"
              id="location-map-title"
              placeholder="Enter hotel address"
              class="w-full h-10 text-sm px-4 py-2 text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
            />
          </div>

          <div class="space-y-2">
            <label for="location-map" class="text-sm font-medium text-gray-700"
              >Location Link</label
            >
            <input
              type="text"
              v-model="currentData.location_map"
              id="location-map"
              placeholder="Paste hotel location map link"
              class="w-full h-10 text-sm px-4 py-2 text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label for="latitude" class="text-sm font-medium text-gray-700"
                >Latitude</label
              >
              <input
                type="text"
                v-model="currentData.latitude"
                id="latitude"
                class="w-full h-10 text-sm px-4 py-2 text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
              />
            </div>

            <div class="space-y-2">
              <label for="longitude" class="text-sm font-medium text-gray-700"
                >Longitude</label
              >
              <input
                type="text"
                v-model="currentData.longitude"
                id="longitude"
                class="w-full h-10 text-sm px-4 py-2 text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Rating</label>
            <div class="flex justify-start items-center gap-2">
              <div
                v-for="i in 5"
                :key="i"
                class="flex justify-center cursor-pointer items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md"
                :class="
                  i == currentData.rating
                    ? 'bg-[#ff613c] text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                "
                @click="currentData.rating = i"
              >
                <p class="text-sm">{{ i }}</p>
                <StarIcon
                  class="w-4 h-4"
                  :class="
                    i == currentData.rating ? 'text-white' : 'text-[#ff613c]'
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-8">
      <div
        class="border border-gray-200 rounded-lg py-4 px-4 shadow-sm bg-gray-50/30"
      >
        <div class="space-y-5">
          <div
            v-if="
              currentData.location_map && currentData.location_map !== 'null'
            "
            class=""
          >
            <iframe
              :src="currentData.location_map"
              class="w-full h-[422px] rounded-lg border-0"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { StarIcon } from "@heroicons/vue/24/solid";

const props = defineProps({
  currentData: Object,
});
</script>
