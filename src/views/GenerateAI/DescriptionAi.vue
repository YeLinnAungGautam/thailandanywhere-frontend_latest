<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between mb-2">
      <label class="text-sm font-medium text-gray-700">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
      <button
        v-if="showAiButton"
        type="button"
        @click="generateWithAI"
        :disabled="isGenerating || !canGenerate"
        class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors duration-200"
        :class="[
          isGenerating || !canGenerate
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700 text-white',
        ]"
      >
        <span
          v-if="isGenerating"
          class="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"
        ></span>
        <span v-else class="text-base">✨</span>
        <span>{{ isGenerating ? "Generating..." : "AI Generate" }}</span>
      </button>
    </div>

    <QuillEditor
      :options="editorOptions"
      theme="snow"
      class="h-64 !bg-gray-100 !border-none !rounded-md !shadow-sm"
      toolbar="essential"
      contentType="html"
      v-model:content="internalValue"
      @update:content="handleUpdate"
    />

    <p v-if="hint" class="text-xs text-gray-500">{{ hint }}</p>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div
        v-if="toast.show"
        class="fixed bottom-6 right-6 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all"
        :class="{
          'bg-green-500 text-white': toast.type === 'success',
          'bg-red-500 text-white': toast.type === 'error',
          'bg-yellow-500 text-white': toast.type === 'warning',
        }"
      >
        <div class="flex items-center gap-3">
          <span v-if="toast.type === 'success'" class="text-2xl">✓</span>
          <span v-if="toast.type === 'error'" class="text-2xl">✕</span>
          <span v-if="toast.type === 'warning'" class="text-2xl">⚠</span>
          <span class="font-medium">{{ toast.message }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch, reactive, computed } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import { GoogleGenerativeAI } from "@google/generative-ai";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: "en",
    validator: (value) => ["en", "mm"].includes(value),
  },
  productData: {
    type: Object,
    default: () => ({}),
  },
  productType: {
    type: String,
    default: "hotel",
    validator: (value) => ["hotel", "product"].includes(value),
  },
  required: {
    type: Boolean,
    default: false,
  },
  hint: {
    type: String,
    default: "",
  },
  showAiButton: {
    type: Boolean,
    default: true,
  },
  placeholder: {
    type: String,
    default: "Enter description...",
  },
});

const emit = defineEmits(["update:modelValue"]);

// Gemini AI Setup
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_KEY_2 = import.meta.env.VITE_GEMINI_API_KEY_2;
let genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
let currentApiKeyIndex = 1;

// State
const internalValue = ref(props.modelValue);
const isGenerating = ref(false);

// Editor options
const editorOptions = {
  placeholder: props.placeholder,
};

// Toast notification
const toast = reactive({
  show: false,
  message: "",
  type: "success",
});

// Computed
const canGenerate = computed(() => {
  return props.productData?.name || props.productData?.description;
});

const languageLabel = computed(() => {
  return props.language === "mm" ? "Myanmar (Burmese)" : "English";
});

// Methods
const showToast = (message, type = "success") => {
  toast.message = message;
  toast.type = type;
  toast.show = true;
  setTimeout(() => {
    toast.show = false;
  }, 3000);
};

const switchToBackupKey = () => {
  if (currentApiKeyIndex === 1) {
    console.log("Switching to backup API key...");
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY_2);
    currentApiKeyIndex = 2;
    showToast("Switching to backup API key...", "warning");
    return true;
  }
  return false;
};

const buildProductContext = () => {
  const data = props.productData;

  let context = `Product Type: ${props.productType}\n`;

  if (data.name) context += `Name: ${data.name}\n`;
  if (data.description) context += `Short Description: ${data.description}\n`;
  if (data.legal_name) context += `Legal Name: ${data.legal_name}\n`;

  // Location information
  if (data.city?.name) context += `City: ${data.city.name}\n`;
  if (data.hotel_place?.name) context += `Place: ${data.hotel_place.name}\n`;
  if (data.location_map_title)
    context += `Location: ${data.location_map_title}\n`;

  // Hotel-specific information
  if (props.productType === "hotel") {
    if (data.check_in) context += `Check-in: ${data.check_in}\n`;
    if (data.check_out) context += `Check-out: ${data.check_out}\n`;
    if (data.category?.name) context += `Category: ${data.category.name}\n`;
    if (data.rating) context += `Rating: ${data.rating} stars\n`;

    // Facilities
    if (data.facilities && data.facilities.length > 0) {
      const facilityNames = data.facilities.map((f) => f.name || f).join(", ");
      context += `Facilities: ${facilityNames}\n`;
    }

    if (data.cancellation_policy) {
      context += `Cancellation Policy: ${data.cancellation_policy}\n`;
    }
  }

  // Existing descriptions (if available)
  if (data.full_description) {
    context += `\nExisting Myanmar Description: ${data.full_description}\n`;
  }
  if (data.full_description_en) {
    context += `Existing English Description: ${data.full_description_en}\n`;
  }

  return context;
};

const generateWithAI = async (retryWithBackup = true) => {
  if (!canGenerate.value) {
    showToast(
      "Not enough product information to generate description",
      "warning",
    );
    return;
  }

  try {
    isGenerating.value = true;
    showToast("🤖 AI is generating content...", "success");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const productContext = buildProductContext();

    const languageInstruction =
      props.language === "mm"
        ? "Myanmar (Burmese) language. Write in fluent, natural Myanmar language using Myanmar script (ဗမာစာ)."
        : "English language. Write in clear, professional English.";

    const prompt = `You are a professional travel content writer creating a detailed, engaging description for a ${
      props.productType
    }.

Product Information:
${productContext}

Task: Write a comprehensive, well-structured description in ${languageInstruction}

Requirements:
1. Write in HTML format with proper tags (<p>, <h3>, <ul>, <li>, <strong>, <em>)
2. Length: 4-6 detailed paragraphs (300-500 words)
3. Structure:
   - Opening paragraph: Engaging introduction highlighting key features
   - Body paragraphs: Detailed information about facilities, location, services
   - Closing paragraph: Call-to-action or summary
4. Include:
   - Specific details about amenities and facilities
   - Location advantages and nearby attractions
   - Unique selling points
   - Guest experience highlights
5. Tone: Professional yet warm and inviting
6. Use descriptive, vivid language that helps readers visualize the experience
7. ${
      props.language === "mm"
        ? "Use proper Myanmar grammar and formal writing style"
        : "Use proper English grammar and varied sentence structures"
    }
8. Make it engaging and persuasive for potential guests/customers

${
  props.language === "mm"
    ? "IMPORTANT: Write ONLY in Myanmar script (ဗမာစာ). Do not use English transliteration."
    : ""
}

Return ONLY the HTML content, no markdown formatting, no code blocks, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up the response
    text = text
      .replace(/```html/g, "")
      .replace(/```/g, "")
      .trim();

    if (text) {
      internalValue.value = text;
      emit("update:modelValue", text);
      showToast("✅ Content generated successfully!", "success");
    } else {
      throw new Error("Empty response from AI");
    }
  } catch (error) {
    console.error("Error generating with AI:", error);

    // Check if it's a quota/rate limit error
    if (
      (error.message?.includes("429") ||
        error.message?.includes("quota") ||
        error.message?.includes("rate limit")) &&
      retryWithBackup
    ) {
      if (switchToBackupKey()) {
        showToast("🔄 Retrying with backup API key...", "warning");
        return await generateWithAI(false);
      }
    }

    showToast(
      "❌ AI generation failed. Please try again or write manually.",
      "error",
    );
  } finally {
    isGenerating.value = false;
  }
};

const handleUpdate = (value) => {
  emit("update:modelValue", value);
};

// Watch for external changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== internalValue.value) {
      internalValue.value = newValue;
    }
  },
);
</script>

<style scoped>
.ql-toolbar {
  @apply border-none !important;
  @apply bg-gray-100 !important;
}

.ql-container {
  @apply border-none !important;
  @apply bg-gray-100 !important;
}

/* Toast transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateY(50px);
  opacity: 0;
}

/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
