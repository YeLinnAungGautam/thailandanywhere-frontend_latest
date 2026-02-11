<template>
  <div
    class="border border-gray-200 rounded-lg py-6 px-4 shadow-sm bg-gray-50/30"
  >
    <div
      class="flex justify-between items-center mb-6 pb-3 border-b border-gray-200"
    >
      <h4 class="text-lg font-semibold text-gray-800">Location Details</h4>
      <button
        v-if="!isGenerating"
        @click="generateLocationWithAI"
        class="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm"
      >
        <span class="text-lg">🤖</span>
        <span>AI Auto-Fill</span>
      </button>
      <div v-else class="flex items-center gap-2 text-purple-600">
        <div
          class="w-5 h-5 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"
        ></div>
        <span class="text-sm font-medium">Generating...</span>
      </div>
    </div>

    <div class="space-y-5">
      <!-- Address -->
      <div class="space-y-2">
        <label
          for="location-map-title"
          class="text-sm font-medium text-gray-700"
        >
          Location Map Title (Address)
        </label>
        <input
          type="text"
          v-model="formData.location_map_title"
          id="location-map-title"
          placeholder="Enter hotel address"
          class="w-full h-10 text-sm px-4 py-2 text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
        />
      </div>

      <!-- Google Maps Embed URL -->
      <div class="space-y-2">
        <label for="location-map" class="text-sm font-medium text-gray-700">
          Google Maps Embed URL
        </label>
        <textarea
          v-model="formData.location_map"
          id="location-map"
          rows="3"
          placeholder="AI will generate Google Maps embed URL automatically"
          class="w-full text-sm px-4 py-2 text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
        ></textarea>
        <p class="text-xs text-gray-500 flex items-start gap-2">
          <span>💡</span>
          <span
            >Click "AI Auto-Fill" to automatically generate the embed URL based
            on hotel location</span
          >
        </p>
      </div>

      <!-- Coordinates -->
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <label for="latitude" class="text-sm font-medium text-gray-700">
            Latitude
          </label>
          <input
            type="text"
            v-model="formData.latitude"
            id="latitude"
            placeholder="e.g., 16.8409"
            class="w-full h-10 text-sm px-4 py-2 text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
          />
        </div>

        <div class="space-y-2">
          <label for="longitude" class="text-sm font-medium text-gray-700">
            Longitude
          </label>
          <input
            type="text"
            v-model="formData.longitude"
            id="longitude"
            placeholder="e.g., 96.1735"
            class="w-full h-10 text-sm px-4 py-2 text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white"
          />
        </div>
      </div>

      <!-- Rating -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Rating</label>
        <div class="flex justify-start items-center gap-2">
          <div
            v-for="i in 5"
            :key="i"
            class="flex justify-center cursor-pointer items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md"
            :class="
              i == formData.rating
                ? 'bg-[#ff613c] text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            "
            @click="formData.rating = i"
          >
            <p class="text-sm">{{ i }}</p>
            <StarIcon
              class="w-4 h-4"
              :class="i == formData.rating ? 'text-white' : 'text-[#ff613c]'"
            />
          </div>
        </div>
      </div>

      <!-- AI Generation Result -->
      <div
        v-if="aiGenerationResult"
        class="p-4 bg-green-50 border-2 border-green-200 rounded-lg animate-fadeIn"
      >
        <div class="flex items-start gap-3">
          <span class="text-2xl">✅</span>
          <div class="flex-1">
            <p class="font-semibold text-green-800 mb-2">
              AI Generated Successfully!
            </p>
            <div class="text-sm text-green-700 space-y-1">
              <p>✓ Address: {{ aiGenerationResult.address }}</p>
              <p>
                ✓ Coordinates: {{ aiGenerationResult.latitude }},
                {{ aiGenerationResult.longitude }}
              </p>
              <p v-if="aiGenerationResult.rating">
                ✓ Rating: {{ aiGenerationResult.rating }}/5 stars
              </p>
              <p v-if="aiGenerationResult.mapUrl">
                ✓ Google Maps embed URL generated
              </p>
            </div>
            <p
              v-if="aiGenerationResult.notes"
              class="text-xs text-green-600 mt-2 italic"
            >
              {{ aiGenerationResult.notes }}
            </p>
          </div>
        </div>
      </div>

      <!-- AI Error -->
      <div
        v-if="aiError"
        class="p-4 bg-red-50 border-2 border-red-200 rounded-lg animate-fadeIn"
      >
        <div class="flex items-start gap-3">
          <span class="text-2xl">❌</span>
          <div class="flex-1">
            <p class="font-semibold text-red-800 mb-1">AI Generation Failed</p>
            <p class="text-sm text-red-700">{{ aiError }}</p>
            <button
              @click="generateLocationWithAI"
              class="mt-3 text-sm text-red-600 hover:text-red-700 font-medium underline"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { StarIcon } from "@heroicons/vue/24/solid";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useToast } from "vue-toastification";

const props = defineProps({
  formData: {
    type: Object,
    required: true,
  },
  cityName: {
    type: String,
    default: "",
  },
  placeName: {
    type: String,
    default: "",
  },
});

const toast = useToast();

// Gemini AI Setup
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_KEY_2 = import.meta.env.VITE_GEMINI_API_KEY_2;
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL;
let genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
let currentApiKeyIndex = 1;

// State
const isGenerating = ref(false);
const aiGenerationResult = ref(null);
const aiError = ref(null);

// Get city and place names
const getCityName = computed(() => {
  return props.cityName || props.formData?.city?.name || "Unknown City";
});

const getPlaceName = computed(() => {
  return (
    props.placeName ||
    props.formData?.hotel_place?.name ||
    props.formData?.place ||
    ""
  );
});

// Switch to backup API key
const switchToBackupKey = () => {
  if (currentApiKeyIndex === 1) {
    console.log("Switching to backup API key...");
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY_2);
    currentApiKeyIndex = 2;
    return true;
  }
  return false;
};

// Generate Location with AI
const generateLocationWithAI = async (retryWithBackup = true) => {
  try {
    isGenerating.value = true;
    aiError.value = null;
    aiGenerationResult.value = null;

    toast.info("🤖 AI is searching for location information...");

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    // Build comprehensive context
    const hotelContext = `
Hotel Name: ${props.formData?.name || "N/A"}
City: ${getCityName.value}
Place/Area: ${getPlaceName.value || "N/A"}
Legal Name: ${props.formData?.legal_name || "N/A"}
Current Address: ${
      props.formData?.location_map_title ||
      props.formData?.official_address ||
      "N/A"
    }
Current Latitude: ${props.formData?.latitude || "N/A"}
Current Longitude: ${props.formData?.longitude || "N/A"}
Current Rating: ${props.formData?.rating || "N/A"}
Category: ${props.formData?.category?.name || "N/A"}
Description: ${props.formData?.description || "N/A"}
`;

    const prompt = `You are a location information expert specializing in Myanmar geography and Google Maps integration. Based on the hotel information below, generate complete and accurate location details.

${hotelContext}

CRITICAL REQUIREMENTS:

1. **Full Address Format**: Generate a complete, professional address in this exact format:
   "[Hotel Name], [Street/Building], [Area/Township], [City], Myanmar"
   Example: "Sedona Hotel Yangon, 1 Kaba Aye Pagoda Road, Yankin Township, Yangon, Myanmar"

2. **Accurate Coordinates** (Very Important for Myanmar):
   - Yangon Region: lat 16.7-17.0°N, lon 96.0-96.3°E
   - Mandalay Region: lat 21.8-22.1°N, lon 95.9-96.2°E
   - Bagan/Nyaung U: lat 21.1-21.3°N, lon 94.8-95.0°E
   - Naypyitaw: lat 19.7-19.8°N, lon 96.1-96.2°E
   - Inle Lake: lat 20.5-20.6°N, lon 96.9-97.0°E
   - Ngapali Beach: lat 18.9-19.0°N, lon 94.3-94.4°E
   
   If the exact location is unknown, use the city center coordinates.

3. **Real Google Maps Embed URL**: Generate a WORKING Google Maps embed URL in this exact format:
   https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15275.123456789!2d[longitude]!3d[latitude]!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM[encoded_coords]!5e0!3m2!1sen!2smm!4v1234567890123!5m2!1sen!2smm
   
   IMPORTANT: Replace [latitude], [longitude], and calculate the distance parameter (1d) properly.
   The distance should be ~15000 for city view, ~3000 for neighborhood view.

4. **Rating Estimation**: 
   - 5-star: Luxury hotels, international chains
   - 4-star: Upper mid-range, quality hotels
   - 3-star: Standard comfortable hotels
   - 2-star: Budget hotels
   - If information is insufficient, suggest 3 stars

5. **Confidence Level**:
   - "high": Hotel name and city are well-known, coordinates are accurate
   - "medium": General area known, coordinates are estimated
   - "low": Limited information, coordinates are city center

EXAMPLE OUTPUT FOR YANGON:
{
  "address": "Sule Shangri-La Yangon, 223 Sule Pagoda Road, Kyauktada Township, Yangon, Myanmar",
  "latitude": "16.7794",
  "longitude": "96.1603",
  "rating": 5,
  "mapUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15275.123456!2d96.1603!3d16.7794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDQ2JzQ1LjgiTiA5NsKwMDknMzcuMSJF!5e0!3m2!1sen!2smm!4v1234567890!5m2!1sen!2smm",
  "confidence": "high",
  "notes": "Located in the heart of downtown Yangon, near Sule Pagoda"
}

Now generate the location data in JSON format (no markdown, no code blocks):`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("AI Location Response:", text);

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const locationData = JSON.parse(jsonMatch[0]);

      // Validate data
      if (
        !locationData.address ||
        !locationData.latitude ||
        !locationData.longitude
      ) {
        throw new Error("Incomplete location data from AI");
      }

      // Validate Myanmar coordinates
      const lat = parseFloat(locationData.latitude);
      const lon = parseFloat(locationData.longitude);

      if (lat < 9 || lat > 29 || lon < 92 || lon > 102) {
        console.warn("Coordinates seem outside Myanmar. Using anyway...");
      }

      // Update form data
      props.formData.location_map_title = locationData.address;
      props.formData.latitude = locationData.latitude;
      props.formData.longitude = locationData.longitude;

      if (locationData.mapUrl) {
        props.formData.location_map = locationData.mapUrl;
      }

      if (
        locationData.rating &&
        (!props.formData.rating ||
          props.formData.rating === "N/A" ||
          props.formData.rating === 0)
      ) {
        props.formData.rating = locationData.rating;
      }

      // Store result for display
      aiGenerationResult.value = locationData;

      toast.success(
        `✅ Location generated! (${locationData.confidence} confidence)`,
      );

      if (locationData.notes) {
        setTimeout(() => {
          toast.info(`💡 ${locationData.notes}`, { timeout: 5000 });
        }, 1000);
      }

      // Clear result after 10 seconds
      setTimeout(() => {
        aiGenerationResult.value = null;
      }, 10000);
    } else {
      throw new Error("Could not parse AI response");
    }
  } catch (error) {
    console.error("Error generating location with AI:", error);

    // Check if it's a quota/rate limit error
    if (
      (error.message?.includes("429") ||
        error.message?.includes("quota") ||
        error.message?.includes("rate limit")) &&
      retryWithBackup
    ) {
      if (switchToBackupKey()) {
        toast.warning("🔄 Switching to backup API key...");
        return await generateLocationWithAI(false);
      }
    }

    const errorMessage =
      error.message || "Failed to generate location information";
    aiError.value = errorMessage;
    toast.error(`❌ ${errorMessage}`);

    // Clear error after 10 seconds
    setTimeout(() => {
      aiError.value = null;
    }, 10000);
  } finally {
    isGenerating.value = false;
  }
};

// Clear AI messages when user manually edits
watch(
  () => props.formData.location_map_title,
  () => {
    if (aiGenerationResult.value) {
      setTimeout(() => {
        aiGenerationResult.value = null;
      }, 2000);
    }
  },
);
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
