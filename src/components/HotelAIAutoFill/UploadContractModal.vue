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
          class="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl transform transition-all"
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
          <div class="p-6 max-h-[70vh] overflow-y-auto">
            <!-- Prompt Editor Section -->
            <div class="mb-6">
              <div class="flex items-center justify-between mb-3">
                <label
                  class="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <span>📝</span>
                  <span>AI Extraction Prompt</span>
                </label>
                <div class="flex items-center gap-2">
                  <button
                    @click="resetPrompt"
                    class="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors font-medium"
                  >
                    Reset to Default
                  </button>
                  <button
                    @click="showPromptPreview = !showPromptPreview"
                    class="text-xs px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-md transition-colors font-medium"
                  >
                    {{ showPromptPreview ? "Hide" : "Show" }} Prompt
                  </button>
                </div>
              </div>

              <Transition name="slide">
                <div v-if="showPromptPreview" class="space-y-3">
                  <textarea
                    v-model="customPrompt"
                    rows="12"
                    class="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all font-mono text-xs resize-y"
                    placeholder="Enter your custom prompt..."
                  ></textarea>
                </div>
              </Transition>
            </div>

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
import { ref, computed } from "vue";
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

// Enhanced Default Prompt Template
const DEFAULT_PROMPT = `You are an expert hotel contract analyst with deep experience in hospitality revenue management and contract negotiations. Your task is to extract ALL information from this hotel contract document with the precision and understanding of a seasoned product manager.

CRITICAL ANALYSIS APPROACH:
Read this contract as a human would - understanding context, implications, and business relationships between different sections. Pay special attention to:
- How different pricing periods relate to each other
- Seasonal patterns and their business logic
- Cancellation policies tied to specific date ranges
- Special conditions that modify base rates
- Relationships between room types and their pricing structures

EXTRACTION METHODOLOGY:

1. BASIC INFORMATION DISCOVERY:
   - Hotel legal name (often in headers or signature sections)
   - Hotel trading/brand name (may differ from legal name)
   - Extract ALL email addresses mentioned anywhere in the document
   - Phone numbers (official, reservation, sales contacts)
   - Physical address (look in headers, footers, contact sections)

2. FINANCIAL & TAX DETAILS:
   - VAT/Tax status: Determine if prices are "Inclusive of VAT" or "No VAT" or "Exclusive of VAT"
   - VAT ID / Tax ID number
   - VAT registered name (may differ from hotel name)
   - VAT registered address
   - Bank account details (account number, bank name, branch, SWIFT code)
   - Payment method: categorize as "Bank Transfer" / "International Remittance" / "Cash" / "Other"

3. OPERATIONAL POLICIES (Extract times in HH:MM format):
   - Check-in time (standard time, not early check-in)
   - Check-out time (standard time, not late check-out)
   - Cancellation policy (full text with all conditions)
   - Child policy (full text with all conditions)

4. CONTRACT VALIDITY PERIODS:
   - Contract signature/effective date
   - Contract start date (validity_start)
   - Contract end date (validity_end)
   - Contract due date (if renewal/signing deadline mentioned)

5. ROOM TYPE ANALYSIS (CRITICAL - read carefully):

   For EACH room type mentioned, extract:
   
   a) Room Identification:
      - room_type: Exact name as stated (e.g., "Superior Room", "Deluxe with Bathtub")
      - room_size: Size with unit (e.g., "32 sqm", "24 m2")
      - max_person: Maximum occupancy number
   
   b) Bed Configuration (count carefully):
      - bed_types.king: Number of king beds
      - bed_types.twin: Number of twin beds
   
   c) Pricing Logic (CRITICAL):
      - cost_price: The NET RATE from the contract (base price hotel charges)
      - sale_price: Calculate as cost_price / 0.85, then round to nearest 50 or 100
        Example: cost_price 2,000 → 2,000/0.85 = 2,353 → round to 2,400
      - agent_price: If mentioned separately
   
   d) Pricing Periods (Extract ALL mentioned periods):
      For each period found:
      - period_name: "High Season" / "Low Season" / "Peak Season" / specific name
      - start_date: YYYY-MM-DD format
      - end_date: YYYY-MM-DD format
      - cost_price: Net rate for this period
      - sale_price: Calculated rate (cost_price / 0.85, rounded)
      - agent_price: If different from cost_price
   
   e) Surcharges & Special Dates:
      - Look for "surcharge", "supplement", "blackout dates"
      - Add these as separate periods with adjusted pricing
      - Example: "THB 500 surcharge 25-31 Dec" means add 500 to base price
   
   f) Inclusions:
      - has_breakfast: true/false (look for "ABF", "with breakfast", "including breakfast")
      - is_extra: false for room types, true for extra bed charges

6. CONTEXT-AWARE INTERPRETATION:

   Date Format Intelligence:
   - "01 Nov 25 - 31 Mar 26" → "2025-11-01" to "2026-03-31"
   - "1 November 2025 Until 31 October 2026" → "2025-11-01" to "2026-10-31"
   - Handle both year formats: "25" and "2025"
   
   Price Interpretation:
   - "THB 2,000.-" or "2,000" or "Baht 2,000" → all mean 2000
   - "RO" = Room Only, "RB" or "ABF" = Room with Breakfast
   
   Period Logic:
   - If contract says "High Season: Nov-Mar" and "Low Season: Apr-Oct", create 2 separate period entries
   - If surcharges mentioned, create additional period with higher price
   - Blackout dates → create separate periods

7. Contract Due Date:
   - For contract due date use keywords such as validity to determine the last day the contract is valid.
- If contract due date is not defined clearly, use the last date in the contract as the due date.

8. Room Name:
   - For Room names use clear and easy to comprehend rooms. If rooms do not include breakfast add this in room name as: Room Name "without Breakfast"

9. Extra Bed do not add profit.
- For rooms that are extra beds do not add profit.

CRITICAL RULES:
✓ Extract ALL periods mentioned - don't consolidate or skip any
✓ Keep original room type names - don't abbreviate
✓ Extract ALL emails - they may be scattered throughout
✓ Preserve exact cancellation policy language
✓ Watch for footnotes and asterisks - crucial pricing conditions
✓ Surcharges CREATE NEW PERIODS - don't just note them
✓ Group rates (10+ rooms) are separate from FIT rates

COMMON PATTERNS:
1. Multiple Rate Tables: FIT, Group, Series rates
2. Seasonal Structure: High/Peak/Low seasons
3. Tax Variations: "Net, inclusive of tax" vs "Plus tax"

RETURN FORMAT: Valid JSON only (no markdown, no backticks)`;

// State
const fileInput = ref(null);
const file = ref(null);
const isDragging = ref(false);
const isProcessing = ref(false);
const processingStep = ref("");
const error = ref("");
const showPromptPreview = ref(false);
const customPrompt = ref(DEFAULT_PROMPT);

// JSON Schema (fixed structure)
const JSON_SCHEMA = `{
  "basic_info": {
    "hotel_name": "string or null",
    "legal_name": "string or null"
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
    "bank_account_number": "string or null",
    "account_name": "string or null",
    "payment_method": "Bank Transfer or International Remittance or Cash or Other or null"
  },
  "policies": {
    "check_in": "time string (HH:MM format) or null",
    "check_out": "time string (HH:MM format) or null",
    "cancellation_policy": "string or null",
    "child_policy": "string or null"
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
      "cost_price": number,
      "sale_price": number,
      "agent_price": number or null,
      "periods": [
        {
          "period_name": "High Season or Low Season or specific name",
          "start_date": "YYYY-MM-DD",
          "end_date": "YYYY-MM-DD",
          "cost_price": number,
          "sale_price": number,
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
}`;

// Computed full prompt
const fullPrompt = computed(() => {
  return `${customPrompt.value}

Return ONLY valid JSON (no markdown, no backticks, no explanation) in this EXACT format:

${JSON_SCHEMA}

Current hotel data for context:
${JSON.stringify(props.hotelData, null, 2)}`;
});

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
  showPromptPreview.value = false;
};

const resetPrompt = () => {
  customPrompt.value = DEFAULT_PROMPT;
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

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: file.value.type,
      },
    };

    processingStep.value = "AI is analyzing contract data...";
    const result = await model.generateContent([fullPrompt.value, imagePart]);
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

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
