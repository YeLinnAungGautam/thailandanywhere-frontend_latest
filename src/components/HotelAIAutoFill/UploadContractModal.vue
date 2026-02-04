<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20"
      >
        <!-- Background overlay -->
        <div
          class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
          @click="closeModal"
        ></div>

        <!-- Modal panel -->
        <div
          class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all"
        >
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center"
                >
                  <span class="text-xl">🤖</span>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900">
                    AI Auto-Fill from Contract
                  </h3>
                  <p class="text-sm text-gray-600 mt-0.5">
                    Upload contract PDF/Image to extract hotel information
                  </p>
                </div>
              </div>
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon class="w-6 h-6" />
              </button>
            </div>
          </div>

          <!-- Body -->
          <div class="p-6">
            <!-- Upload Area -->
            <div
              v-if="!isProcessing && !file"
              @drop.prevent="handleDrop"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              class="border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer"
              :class="
                isDragging
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
              "
              @click="triggerFileInput"
            >
              <input
                ref="fileInput"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,image/*"
                @change="handleFileSelect"
                class="hidden"
              />

              <div class="flex flex-col items-center gap-3">
                <div
                  class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center"
                >
                  <DocumentIcon class="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <p class="text-lg font-semibold text-gray-700 mb-1">
                    Drop contract file here or click to browse
                  </p>
                  <p class="text-sm text-gray-500">
                    Supports: PDF, JPG, PNG (Max 10MB)
                  </p>
                </div>
              </div>
            </div>

            <!-- File Preview -->
            <div
              v-if="file && !isProcessing"
              class="border-2 border-purple-200 bg-purple-50 rounded-xl p-4"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div
                    class="w-12 h-12 bg-white rounded-lg flex items-center justify-center"
                  >
                    <DocumentIcon class="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">{{ file.name }}</p>
                    <p class="text-sm text-gray-600">
                      {{ formatFileSize(file.size) }}
                    </p>
                  </div>
                </div>
                <button
                  @click="removeFile"
                  class="p-2 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <XMarkIcon class="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>

            <!-- Processing State -->
            <div
              v-if="isProcessing"
              class="flex flex-col items-center justify-center py-12 bg-purple-50 rounded-xl"
            >
              <div
                class="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"
              ></div>
              <p class="text-lg font-semibold text-purple-900 mb-2">
                🤖 AI is reading the contract...
              </p>
              <p class="text-sm text-purple-600">
                {{ processingStep }}
              </p>
            </div>

            <!-- Error State -->
            <div
              v-if="error"
              class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div class="flex items-start gap-2">
                <span class="text-red-600 text-xl">⚠️</span>
                <div>
                  <p class="font-semibold text-red-900">Error</p>
                  <p class="text-sm text-red-700">{{ error }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="px-6 py-4 border-t border-gray-200 flex justify-between items-center"
          >
            <p class="text-sm text-gray-600">
              <span class="font-semibold">Tip:</span> Use high-quality scans for
              better accuracy
            </p>
            <div class="flex gap-3">
              <button
                @click="closeModal"
                class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                v-if="file && !isProcessing"
                @click="processFile"
                class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <span>✨</span>
                <span>Extract with AI</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from "vue";
import { XMarkIcon, DocumentIcon } from "@heroicons/vue/24/outline";
import { GoogleGenerativeAI } from "@google/generative-ai";

const props = defineProps({
  isOpen: Boolean,
  hotelData: Object,
});

const emit = defineEmits(["close", "dataExtracted"]);

// Gemini Setup
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_KEY_2 = import.meta.env.VITE_GEMINI_API_KEY_2;
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL;

let genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
let currentApiKeyIndex = 1;

// State
const fileInput = ref(null);
const file = ref(null);
const isDragging = ref(false);
const isProcessing = ref(false);
const processingStep = ref("");
const error = ref("");

// Methods
const closeModal = () => {
  if (!isProcessing.value) {
    emit("close");
    resetState();
  }
};

const resetState = () => {
  file.value = null;
  isDragging.value = false;
  isProcessing.value = false;
  processingStep.value = "";
  error.value = "";
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    validateAndSetFile(selectedFile);
  }
};

const handleDrop = (event) => {
  isDragging.value = false;
  const droppedFile = event.dataTransfer.files[0];
  if (droppedFile) {
    validateAndSetFile(droppedFile);
  }
};

const validateAndSetFile = (selectedFile) => {
  error.value = "";

  const validTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];
  if (!validTypes.includes(selectedFile.type)) {
    error.value = "Invalid file type. Please upload PDF, JPG, or PNG.";
    return;
  }

  const maxSize = 10 * 1024 * 1024;
  if (selectedFile.size > maxSize) {
    error.value = "File size exceeds 10MB. Please upload a smaller file.";
    return;
  }

  file.value = selectedFile;
};

const removeFile = () => {
  file.value = null;
  error.value = "";
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const switchToBackupKey = () => {
  if (currentApiKeyIndex === 1) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY_2);
    currentApiKeyIndex = 2;
    return true;
  }
  return false;
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

const processFile = async (retryWithBackup = true) => {
  if (!file.value) return;

  isProcessing.value = true;
  error.value = "";

  try {
    processingStep.value = "Converting file to base64...";
    const base64Data = await fileToBase64(file.value);

    processingStep.value = "Sending to AI for analysis...";
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const prompt = `You are a hotel contract data extraction expert. Extract ALL hotel information from this contract document.

Return ONLY valid JSON (no markdown, no backticks, no explanation) in this EXACT format:

{
  "basic_info": {
    "hotel_name": "string or null",
    "legal_name": "string or null",
    "place": "string or null"
  },
  "contact": {
    "official_phone_number": "string or null",
    "official_email": "string or null",
    "email": ["array of email strings or empty array"],
    "official_address": "string or null"
  },
  "financial": {
    "vat_inclusion": "Inclusive of VAT or No VAT or null",
    "vat_id": "string or null",
    "vat_name": "string or null",
    "vat_address": "string or null",
    "bank_name": "string or null",
    "bank_account_number": "string or null",
    "account_name": "string or null",
    "payment_method": "Bank Transfer or International Remittance or Cash or Other or null"
  },
  "policies": {
    "check_in": "time string (HH:MM format) or null",
    "check_out": "time string (HH:MM format) or null",
    "cancellation_policy": "string or null"
  },
  "contract": {
    "contract_due": "YYYY-MM-DD format or null",
    "validity_start": "YYYY-MM-DD format or null",
    "validity_end": "YYYY-MM-DD format or null"
  },
  "rooms": [
    {
      "room_type": "string (room name)",
      "max_person": number,
      "room_size": "string with unit (e.g., '24 sqm') or null",
      "bed_types": {
        "king": number,
        "twin": number
      },
      "cost_price": number (the net rate from contract),
      "sale_price": number (calculated as cost_price / 0.85, rounded to nearest 50 or 100),
      "agent_price": number or null,
      "periods": [
        {
          "period_name": "High Season or Low Season or specific name",
          "start_date": "YYYY-MM-DD",
          "end_date": "YYYY-MM-DD",
          "sale_price": number,
          "cost_price": number,
          "agent_price": number or null
        }
      ],
      "has_breakfast": boolean,
      "is_extra": boolean
    }
  ],
  "ai_confidence": {
    "overall": 0-100,
    "notes": "string with extraction notes"
  }
}

CRITICAL RULES:
1. Extract ALL fields you can find - use null for missing data
2. For emails array: extract ALL email addresses mentioned
3. For dates: convert to YYYY-MM-DD format
4. For times: use HH:MM 24-hour format
5. For prices: extract as numbers only (remove currency symbols)
6. For VAT inclusion: must be exactly "Inclusive of VAT" or "No VAT"
7. ROOM PRICING: cost_price = net rate, sale_price = cost_price/0.85 (round to nearest 50 or 100)
8. Extract ALL pricing periods with their specific dates and prices
9. Count bed types accurately (king beds and twin beds)
10. max_person = maximum guests allowed
11. Set ai_confidence.overall based on data quality (0-100)
12. Return ONLY the JSON object - no markdown formatting

Current hotel data for context:
${JSON.stringify(props.hotelData, null, 2)}`;

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: file.value.type,
      },
    };

    processingStep.value = "AI is analyzing contract data...";
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    console.log("AI Response:", text);

    processingStep.value = "Parsing extracted data...";

    // Clean the response
    let cleanedText = text.trim();
    cleanedText = cleanedText.replace(/```json\n?/g, "");
    cleanedText = cleanedText.replace(/```\n?/g, "");
    cleanedText = cleanedText.trim();

    const extractedData = JSON.parse(cleanedText);

    if (!extractedData || typeof extractedData !== "object") {
      throw new Error("Invalid data format received from AI");
    }

    processingStep.value = "Data extracted successfully!";

    emit("dataExtracted", {
      extractedData,
      originalFile: file.value,
    });

    setTimeout(() => {
      closeModal();
    }, 500);
  } catch (err) {
    console.error("Error processing file:", err);

    if (
      (err.message?.includes("429") ||
        err.message?.includes("quota") ||
        err.message?.includes("rate limit")) &&
      retryWithBackup
    ) {
      if (switchToBackupKey()) {
        processingStep.value = "Retrying with backup API key...";
        return await processFile(false);
      }
    }

    error.value =
      err.message ||
      "Failed to process file. Please try again or enter data manually.";
    isProcessing.value = false;
  }
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
