<template>
  <div class="space-y-4">
    <!-- Top bar: Tabs + Prompt Toggle + Generate All Button -->
    <div class="flex items-center gap-3">
      <div
        class="flex-1 flex justify-start items-center gap-x-2 overflow-x-scroll no-scrollbar pb-1"
      >
        <div
          v-for="day in totalDays"
          :key="day"
          @click="selectedDay = day"
          :class="
            selectedDay === day
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-gray-100 text-slate-600 hover:bg-orange-100'
          "
          class="px-4 py-2 text-xs cursor-pointer whitespace-nowrap font-medium rounded-xl transition flex items-center gap-1"
        >
          Day {{ day }}
          <span v-if="getDayDate(day)" class="opacity-80"
            >- {{ getDayDate(day) }}</span
          >
          <span v-if="isDayComplete(day)" class="text-green-300 font-bold"
            >✓</span
          >
        </div>
      </div>

      <!-- Prompt Editor Toggle -->
      <button
        @click="openPromptModal"
        class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition shrink-0 border-2"
        :class="
          promptOverride
            ? 'bg-amber-50 border-amber-400 text-amber-700 hover:bg-amber-100'
            : 'bg-slate-50 border-slate-300 text-slate-600 hover:bg-slate-100'
        "
        title="Edit AI prompt"
      >
        <span>✏️</span>
        <span>Prompt</span>
        <span
          v-if="promptOverride"
          class="w-2 h-2 rounded-full bg-amber-400 inline-block"
          title="Custom prompt active"
        ></span>
      </button>

      <!-- Generate ALL days button -->
      <button
        @click="generateAllDays"
        :disabled="isGenerating || !hasOrderedItems"
        class="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition shrink-0 shadow-sm"
        :class="
          isGenerating || !hasOrderedItems
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white hover:shadow-md'
        "
      >
        <span
          v-if="isGenerating"
          class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
        ></span>
        <span v-else>✨</span>
        <span>{{
          isGenerating ? "Generating all days..." : "Generate All with AI"
        }}</span>
      </button>
    </div>

    <!-- Custom prompt active notice -->
    <Transition name="fade">
      <div
        v-if="promptOverride"
        class="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-sm bg-amber-50 border border-amber-300 text-amber-800"
      >
        <div class="flex items-center gap-2">
          <span>✏️</span>
          <span class="font-medium">Custom prompt is active</span>
          <span class="text-amber-600 text-xs"
            >— AI will use your edited rules</span
          >
        </div>
        <button
          @click="resetPrompt"
          class="text-xs text-amber-700 hover:text-amber-900 font-semibold underline"
        >
          Reset to default
        </button>
      </div>
    </Transition>

    <!-- Status banner -->
    <Transition name="fade">
      <div
        v-if="aiStatus.show"
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border"
        :class="{
          'bg-purple-50 text-purple-800 border-purple-200':
            aiStatus.type === 'generating',
          'bg-green-50 text-green-800 border-green-200':
            aiStatus.type === 'success',
          'bg-red-50 text-red-800 border-red-200': aiStatus.type === 'error',
        }"
      >
        <span
          v-if="aiStatus.type === 'generating'"
          class="w-4 h-4 border-2 border-purple-300 border-t-purple-700 rounded-full animate-spin shrink-0"
        ></span>
        <span v-else-if="aiStatus.type === 'success'" class="shrink-0">✅</span>
        <span v-else class="shrink-0">❌</span>
        {{ aiStatus.message }}
      </div>
    </Transition>

    <!-- Day Form -->
    <div
      v-if="selectedDay"
      class="border-2 border-orange-200 rounded-2xl p-5 space-y-4"
    >
      <!-- Day Header -->
      <div class="flex items-center gap-3 flex-wrap">
        <div
          class="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm shrink-0"
        >
          {{ selectedDay }}
        </div>
        <div>
          <p class="font-semibold text-slate-800 text-base">
            Day {{ selectedDay }}
          </p>
          <p class="text-xs text-slate-500">{{ getDayDate(selectedDay) }}</p>
        </div>

        <!-- Generate THIS day only -->
        <button
          @click="generateSingleDay(selectedDay)"
          :disabled="isGenerating || !hasDayItems(selectedDay)"
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-medium transition border"
          :class="
            isGenerating || !hasDayItems(selectedDay)
              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
              : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
          "
        >
          <span
            v-if="isGenerating && generatingDay === selectedDay"
            class="w-3 h-3 border-2 border-purple-300 border-t-purple-700 rounded-full animate-spin"
          ></span>
          <span v-else>✨</span>
          This day only
        </button>

        <div class="ml-auto">
          <span
            v-if="isDayComplete(selectedDay)"
            class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg font-medium"
            >✓ Complete</span
          >
          <span
            v-else
            class="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-lg font-medium"
            >Incomplete</span
          >
        </div>
      </div>

      <!-- Day services preview -->
      <div
        v-if="getDayItemsSummary(selectedDay).length > 0"
        class="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200"
      >
        <p class="text-xs font-semibold text-slate-500 mb-2">
          Services on this day (used for AI)
        </p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(s, i) in getDayItemsSummary(selectedDay)"
            :key="i"
            class="text-xs px-2 py-1 rounded-lg"
            :class="{
              'bg-green-100 text-green-700': s.type === 'van',
              'bg-orange-100 text-orange-700': s.type === 'attraction',
              'bg-purple-100 text-purple-700': s.type === 'hotel',
            }"
          >
            {{ s.emoji }} {{ s.label }}
          </span>
        </div>
      </div>
      <div v-else class="text-xs text-slate-400 italic px-1">
        No services added for this day yet.
      </div>

      <!-- Title -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1"
          >Day Title <span class="text-red-400">*</span></label
        >
        <input
          v-model="dayData[selectedDay].title"
          type="text"
          placeholder="e.g. Explore Chiang Mai Old City"
          class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white text-slate-800"
        />
      </div>

      <!-- English -->
      <div>
        <label
          class="text-sm font-medium text-slate-700 mb-1 flex items-center gap-2"
        >
          <span>🇬🇧</span> Summary (English) <span class="text-red-400">*</span>
        </label>
        <textarea
          v-model="dayData[selectedDay].summaryEn"
          rows="6"
          placeholder="Write a brief description of this day's activities in English..."
          class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none bg-white text-slate-800 leading-relaxed"
        />
        <p class="text-xs text-slate-400 mt-1 text-right">
          {{ dayData[selectedDay].summaryEn?.length ?? 0 }} characters
        </p>
      </div>

      <!-- Myanmar -->
      <div>
        <label
          class="text-sm font-medium text-slate-700 mb-1 flex items-center gap-2"
        >
          <span>🇲🇲</span> Summary (Myanmar) <span class="text-red-400">*</span>
        </label>
        <textarea
          v-model="dayData[selectedDay].summaryMm"
          rows="6"
          placeholder="ဤနေ့၏ လှုပ်ရှားမှုများကို မြန်မာဘာသာဖြင့် ဖော်ပြပါ..."
          class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none bg-white text-slate-800 font-myanmar leading-loose"
        />
        <p class="text-xs text-slate-400 mt-1 text-right">
          {{ dayData[selectedDay].summaryMm?.length ?? 0 }} characters
        </p>
      </div>

      <!-- Navigation -->
      <div class="flex gap-2 pt-2">
        <button
          v-if="selectedDay > 1"
          @click="selectedDay--"
          class="flex-1 px-4 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-300 transition text-sm"
        >
          ← Previous Day
        </button>
        <button
          v-if="selectedDay < totalDays"
          @click="selectedDay++"
          class="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition text-sm"
        >
          Next Day →
        </button>
      </div>
    </div>

    <!-- Progress grid -->
    <div class="bg-white border-2 border-slate-200 rounded-2xl p-4">
      <p class="text-sm font-semibold text-slate-700 mb-3">
        Progress — {{ completedDays }} / {{ totalDays }} days completed
      </p>
      <div class="flex gap-1.5 flex-wrap">
        <div
          v-for="day in totalDays"
          :key="`prog-${day}`"
          @click="selectedDay = day"
          :class="[
            'w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer transition',
            isDayComplete(day)
              ? 'bg-green-500 text-white'
              : selectedDay === day
              ? 'bg-orange-500 text-white'
              : 'bg-slate-100 text-slate-500 hover:bg-orange-100',
          ]"
        >
          {{ day }}
        </div>
      </div>
    </div>
    <!-- ═══════════════════════════════════════════ -->
    <!--  Prompt Editor Modal                        -->
    <!-- ═══════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="showPromptModal"
          class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        >
          <div
            class="absolute inset-0 bg-black/50 backdrop-blur-sm"
            @click="closePromptModal"
          />

          <div
            class="prompt-modal-card relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden"
            style="max-height: 90vh"
          >
            <!-- Header -->
            <div
              class="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4 flex items-start justify-between shrink-0"
            >
              <div>
                <h3 class="text-lg font-bold text-white leading-tight">
                  ✏️ Edit AI Prompt Rules
                </h3>
                <p class="text-slate-300 text-xs mt-1">
                  Edit the writing instructions. Tour data and JSON format are
                  appended automatically.
                </p>
              </div>
              <button
                @click="closePromptModal"
                class="w-7 h-7 ml-4 shrink-0 rounded-full bg-white/20 hover:bg-white/35 text-white flex items-center justify-center transition text-xl leading-none"
              >
                &times;
              </button>
            </div>

            <!-- Mode selector -->
            <div class="px-6 pt-4 pb-0 flex items-center gap-3 shrink-0">
              <span
                class="text-xs font-semibold text-slate-500 uppercase tracking-wide"
                >Apply to:</span
              >
              <div class="flex gap-2">
                <button
                  @click="promptMode = 'all'"
                  :class="
                    promptMode === 'all'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
                  "
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                >
                  ✨ Generate All Days
                </button>
                <button
                  @click="promptMode = 'single'"
                  :class="
                    promptMode === 'single'
                      ? 'bg-purple-600 text-white shadow'
                      : 'bg-slate-100 text-slate-600 hover:bg-purple-50 hover:text-purple-700'
                  "
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                >
                  ✨ This Day Only
                </button>
              </div>
            </div>

            <!-- Hint -->
            <div class="px-6 pt-3 pb-0 shrink-0">
              <div
                class="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-amber-800 flex items-start gap-2"
              >
                <span class="shrink-0 mt-0.5">💡</span>
                <span>
                  Write only the
                  <strong>writing rules and instructions</strong> here. Tour
                  data (attractions with venue + ticket names, van tours,
                  hotels) and the JSON return format are automatically appended
                  — no need to include them.
                </span>
              </div>
            </div>

            <!-- Textarea -->
            <div class="px-6 pt-3 pb-0 flex-1 overflow-y-auto min-h-0">
              <textarea
                v-model="editingPrompt"
                spellcheck="false"
                placeholder="Write your custom prompt rules here..."
                class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none text-sm text-slate-800 font-mono leading-relaxed bg-slate-50"
                style="min-height: 340px; height: 340px"
              />
              <p class="text-xs text-slate-400 text-right mt-1 mb-2">
                {{ editingPrompt?.length ?? 0 }} characters
              </p>
            </div>

            <!-- Footer -->
            <div
              class="px-6 py-4 flex gap-3 border-t border-slate-100 bg-slate-50 shrink-0"
            >
              <button
                @click="resetEditingPrompt"
                class="px-4 py-2.5 rounded-xl border-2 border-slate-300 text-slate-600 font-semibold hover:bg-white transition text-sm"
                title="Reset to default rules"
              >
                🔄 Reset Default
              </button>
              <button
                @click="closePromptModal"
                class="flex-1 py-2.5 rounded-xl border-2 border-slate-300 text-slate-600 font-semibold hover:bg-white transition text-sm"
              >
                Cancel
              </button>
              <button
                @click="saveAndGenerate"
                :disabled="isGenerating || !editingPrompt.trim()"
                :class="
                  isGenerating || !editingPrompt.trim()
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md'
                "
                class="flex-1 py-2.5 rounded-xl font-semibold transition text-sm flex items-center justify-center gap-2"
              >
                <span
                  v-if="isGenerating"
                  class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                ></span>
                <span v-else>✨</span>
                {{ isGenerating ? "Generating..." : "Save & Generate" }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { GoogleGenerativeAI } from "@google/generative-ai";

const props = defineProps({
  totalDays: { type: Number, default: 0 },
  startDate: { type: String, default: "" },
  orderedItems: { type: Array, default: () => [] },
  dayCityMap: { type: Object, default: () => ({}) },
  descriptions: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["update:descriptions"]);

const selectedDay = ref(1);
const dayData = reactive({});

watch(
  () => props.totalDays,
  (newVal) => {
    for (let d = 1; d <= newVal; d++) {
      if (!dayData[d]) {
        const saved = props.descriptions?.[d];
        dayData[d] = saved
          ? {
              title: saved.title || "",
              summaryEn: saved.summaryEn || "",
              summaryMm: saved.summaryMm || "",
            }
          : { title: "", summaryEn: "", summaryMm: "" };
      }
    }
    if (!selectedDay.value || selectedDay.value > newVal) selectedDay.value = 1;
  },
  { immediate: true },
);

const emitDescriptions = () => {
  emit("update:descriptions", JSON.parse(JSON.stringify(dayData)));
};

watch(dayData, emitDescriptions, { deep: true });

// ── Helpers ───────────────────────────────────────────────────
const getDayDate = (n) => {
  if (!props.startDate || !n) return "";
  const d = new Date(props.startDate);
  d.setDate(d.getDate() + n - 1);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getDayDateFull = (n) => {
  if (!props.startDate || !n) return "";
  const d = new Date(props.startDate);
  d.setDate(d.getDate() + n - 1);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const isDayComplete = (day) => {
  const d = dayData[day];
  return d && d.title?.trim() && d.summaryEn?.trim() && d.summaryMm?.trim();
};

const completedDays = computed(() => {
  let count = 0;
  for (let d = 1; d <= props.totalDays; d++) {
    if (isDayComplete(d)) count++;
  }
  return count;
});

const hasOrderedItems = computed(() => props.orderedItems?.length > 0);

const getItemsForDay = (day) =>
  (props.orderedItems || [])
    .filter((item) => {
      if (item._type === "hotel") return (item.checkInDay ?? 1) === day;
      return item.dayNumber === day;
    })
    .sort((a, b) => (a._order ?? 0) - (b._order ?? 0));

const hasDayItems = (day) => getItemsForDay(day).length > 0;

const getDayItemsSummary = (day) =>
  getItemsForDay(day).map((item) => {
    if (item._type === "van")
      return {
        type: "van",
        emoji: "🚐",
        label: item.vanTourName || "Van Tour",
      };
    if (item._type === "attraction")
      return {
        type: "attraction",
        emoji: "🎫",
        // Show "ProductName (TicketName)" if different, otherwise just one
        label:
          item.productName && item.productName !== item.name
            ? `${item.productName} — ${item.name}`
            : item.productName || item.name || "Attraction",
      };
    if (item._type === "hotel")
      return { type: "hotel", emoji: "🏨", label: item.name || "Hotel" };
    return { type: "", emoji: "", label: "" };
  });

const getDaysToGenerate = () => {
  const days = [];
  for (let d = 1; d <= props.totalDays; d++) {
    if (hasDayItems(d)) days.push(d);
  }
  return days;
};

// ── AI Setup ──────────────────────────────────────────────────
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_KEY_2 = import.meta.env.VITE_GEMINI_API_KEY_2;
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-1.5-flash";

let genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
let keyIdx = 1;

const switchKey = () => {
  if (keyIdx === 1 && GEMINI_API_KEY_2) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY_2);
    keyIdx = 2;
    return true;
  }
  return false;
};

const isGenerating = ref(false);
const generatingDay = ref(null);
const aiStatus = reactive({ show: false, message: "", type: "generating" });

const showStatus = (message, type = "generating", duration = 0) => {
  aiStatus.show = true;
  aiStatus.message = message;
  aiStatus.type = type;
  if (duration > 0)
    setTimeout(() => {
      aiStatus.show = false;
    }, duration);
};

// ── Default writing rules ─────────────────────────────────────
const DEFAULT_RULES = `You are a travel agency writing a professional itinerary for travellers before they travel.

Rules:
- Write in a concise and easy to read format.
- Write about the highlights of each attraction explaining readers why these items are a must visit. You can also include positive points about the attractions from online reviews such as TripAdvisor and Google reviews.
- Write in an exciting but professional tone so that it makes customers want to purchase and travel as per itinerary.
- Mention each service naturally in paragraph flow.
- Include hotel check-in at the end if a hotel is present.
- English: 3-5 paragraphs, vivid and informative.
- Myanmar: Full, natural translation (not literal word-by-word). For attraction names, keep English names in the Myanmar text — do not translate attraction names into Myanmar.
- Title: Short English title, 4-6 words.
- Do not mention specific departure times (the trip is free and flexible). You may mention approximate travel durations between destinations (e.g. "it takes approximately X hours to drive from X to Y with no traffic").
- Write professionally. Avoid excessive adjectives and do not oversell. Write only 2-3 brief sentences about each attraction.`;

// ── JSON format instructions (always appended, not user-editable) ──
const JSON_FORMAT_ALL = `

Return ONLY this JSON structure with no markdown fences and no extra text:
{
  "days": {
    "1": { "title": "...", "summaryEn": "...", "summaryMm": "..." },
    "2": { "title": "...", "summaryEn": "...", "summaryMm": "..." }
  }
}
Include an entry for every day number provided above.`;

const JSON_FORMAT_SINGLE = `

Return ONLY this JSON with no markdown fences and no extra text:
{"title":"...","summaryEn":"...","summaryMm":"..."}`;

// ── Build item lines for one day ──────────────────────────────
/**
 * Formats ordered items for a given day into readable lines for the prompt.
 * Attractions use:  productName (the venue) + name (the ticket type) + variation (full description)
 */
const buildItemLines = (day) => {
  return getItemsForDay(day)
    .map((item) => {
      if (item._type === "van") {
        return (
          `  🚐 Van / Transfer: ${item.vanTourName}` +
          (item.carName ? ` (vehicle: ${item.carName})` : "") +
          `, city: ${item.city}`
        );
      }

      if (item._type === "attraction") {
        // productName = venue (e.g. "Dream World")
        // name        = ticket tier (e.g. "Super Visa Plus Buffet Lunch")
        // variation   = full description (e.g. "Dream World: Super Visa + Snow Town + Buffet Lunch")
        const venue = item.productName || item.name;
        const ticket =
          item.name && item.name !== item.productName ? item.name : null;
        const variation =
          item.variation && item.variation !== item.name
            ? item.variation
            : null;

        let line = `  🎫 Attraction venue: ${venue}`;
        if (ticket) line += ` | ticket: ${ticket}`;
        if (variation) line += ` | includes: ${variation}`;
        line += ` | city: ${item.city}`;
        return line;
      }

      if (item._type === "hotel") {
        return (
          `  🏨 Hotel check-in: ${item.name}` +
          (item.roomName ? ` | room: ${item.roomName}` : "") +
          ` | ${item.nights} night(s) | city: ${item.city}`
        );
      }

      return "";
    })
    .filter(Boolean)
    .join("\n");
};

// ── Build ALL-days prompt ─────────────────────────────────────
const buildAllDaysPrompt = (daysToGenerate, customRules = null) => {
  const totalNights = props.totalDays > 0 ? props.totalDays - 1 : 0;
  const rules = customRules ?? DEFAULT_RULES;

  const dayBlocks = daysToGenerate
    .map((day) => {
      const cities =
        props.dayCityMap[day]?.map((c) => c.name).join(", ") || "Thailand";
      const dateLabel = getDayDateFull(day);
      const itemLines = buildItemLines(day);
      return `DAY ${day} — ${dateLabel}\nCities visited: ${cities}\nServices (in chronological order):\n${
        itemLines || "  (no services listed)"
      }`;
    })
    .join("\n\n---\n\n");

  return `${rules}

---
TRIP OVERVIEW:
- Total: ${totalNights} night(s) and ${props.totalDays} day(s)
- Start date: ${getDayDateFull(1)}

DAILY ITINERARY DATA:

${dayBlocks}
${JSON_FORMAT_ALL}`;
};

// ── Build SINGLE-day prompt ───────────────────────────────────
const buildSingleDayPrompt = (day, customRules = null) => {
  const totalNights = props.totalDays > 0 ? props.totalDays - 1 : 0;
  const rules = customRules ?? DEFAULT_RULES;
  const cities =
    props.dayCityMap[day]?.map((c) => c.name).join(", ") || "Thailand";
  const dateLabel = getDayDateFull(day);
  const itemLines = buildItemLines(day);

  return `${rules}

---
TRIP OVERVIEW:
- Total: ${totalNights} night(s) and ${props.totalDays} day(s)
- Start date: ${getDayDateFull(1)}

DAY ${day} — ${dateLabel}
Cities visited: ${cities}
Services (in chronological order):
${itemLines || "  (no services listed)"}
${JSON_FORMAT_SINGLE}`;
};

// ── Prompt Editor State ───────────────────────────────────────
const showPromptModal = ref(false);
const promptMode = ref("all"); // 'all' | 'single'
const editingPrompt = ref("");

// Store custom RULES only (data + JSON format always appended by code)
const promptOverrideAll = ref(null);
const promptOverrideSingle = ref(null);

const promptOverride = computed(
  () => promptOverrideAll.value !== null || promptOverrideSingle.value !== null,
);

const openPromptModal = () => {
  editingPrompt.value =
    promptMode.value === "all"
      ? promptOverrideAll.value ?? DEFAULT_RULES
      : promptOverrideSingle.value ?? DEFAULT_RULES;
  showPromptModal.value = true;
};

const closePromptModal = () => {
  showPromptModal.value = false;
};

const resetEditingPrompt = () => {
  editingPrompt.value = DEFAULT_RULES;
  if (promptMode.value === "all") promptOverrideAll.value = null;
  else promptOverrideSingle.value = null;
};

const resetPrompt = () => {
  promptOverrideAll.value = null;
  promptOverrideSingle.value = null;
};

const saveAndGenerate = async () => {
  if (!editingPrompt.value.trim()) return;

  if (promptMode.value === "all") promptOverrideAll.value = editingPrompt.value;
  else promptOverrideSingle.value = editingPrompt.value;

  showPromptModal.value = false;

  if (promptMode.value === "all") await generateAllDays();
  else await generateSingleDay(selectedDay.value);
};

// Re-fill textarea when switching mode inside the open modal
watch(promptMode, () => {
  if (!showPromptModal.value) return;
  editingPrompt.value =
    promptMode.value === "all"
      ? promptOverrideAll.value ?? DEFAULT_RULES
      : promptOverrideSingle.value ?? DEFAULT_RULES;
});

// ── Gemini calls ──────────────────────────────────────────────
const callGeminiAllDays = async (daysToGenerate) => {
  const prompt = buildAllDaysPrompt(daysToGenerate, promptOverrideAll.value);
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON in response");
  const parsed = JSON.parse(match[0]);
  return parsed.days ?? parsed;
};

const callGeminiSingleDay = async (day) => {
  const prompt = buildSingleDayPrompt(day, promptOverrideSingle.value);
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON in response");
  return JSON.parse(match[0]);
};

// ── Generate single day ───────────────────────────────────────
const generateSingleDay = async (day, withRetry = true) => {
  if (isGenerating.value) return;
  if (!hasDayItems(day)) {
    showStatus(`Day ${day} has no services to describe.`, "error", 3000);
    return;
  }

  isGenerating.value = true;
  generatingDay.value = day;
  showStatus(`✨ Generating Day ${day} description...`, "generating");

  try {
    const data = await callGeminiSingleDay(day);
    if (data?.title) dayData[day].title = data.title;
    if (data?.summaryEn) dayData[day].summaryEn = data.summaryEn;
    if (data?.summaryMm) dayData[day].summaryMm = data.summaryMm;
    emitDescriptions();
    showStatus(`✅ Day ${day} generated successfully!`, "success", 4000);
  } catch (err) {
    console.error("Gemini error day", day, err);
    const isQuota =
      err.message?.includes("429") || err.message?.includes("quota");
    if (isQuota && withRetry && switchKey()) {
      isGenerating.value = false;
      return generateSingleDay(day, false);
    }
    showStatus(
      `❌ Day ${day} failed: ${isQuota ? "API quota exceeded." : err.message}`,
      "error",
      5000,
    );
  } finally {
    isGenerating.value = false;
    generatingDay.value = null;
  }
};

// ── Generate ALL days ─────────────────────────────────────────
const generateAllDays = async (withRetry = true) => {
  if (isGenerating.value || !hasOrderedItems.value) return;

  const daysToGenerate = getDaysToGenerate();
  if (daysToGenerate.length === 0) {
    showStatus("No days have services to generate.", "error", 3000);
    return;
  }

  isGenerating.value = true;
  showStatus(
    `✨ Generating all ${daysToGenerate.length} days in one request...`,
    "generating",
  );

  try {
    const allData = await callGeminiAllDays(daysToGenerate);
    let ok = 0;
    for (const day of daysToGenerate) {
      const data = allData[String(day)] ?? allData[day];
      if (data?.title) {
        dayData[day].title = data.title;
        dayData[day].summaryEn = data.summaryEn || "";
        dayData[day].summaryMm = data.summaryMm || "";
        ok++;
      }
    }
    emitDescriptions();
    showStatus(`✅ All ${ok} days generated with 1 API call!`, "success", 5000);
  } catch (err) {
    console.error("Gemini all-days error:", err);
    const isQuota =
      err.message?.includes("429") || err.message?.includes("quota");
    if (isQuota && withRetry && switchKey()) {
      isGenerating.value = false;
      return generateAllDays(false);
    }
    showStatus(
      `❌ Generation failed: ${isQuota ? "API quota exceeded." : err.message}`,
      "error",
      5000,
    );
  } finally {
    isGenerating.value = false;
    generatingDay.value = null;
  }
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.font-myanmar {
  font-family: "Pyidaungsu", "Myanmar Text", "Noto Sans Myanmar", sans-serif;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active .prompt-modal-card,
.modal-fade-leave-active .prompt-modal-card {
  transition: transform 0.22s ease, opacity 0.22s ease;
}
.modal-fade-enter-from .prompt-modal-card {
  transform: scale(0.95) translateY(12px);
  opacity: 0;
}
.modal-fade-leave-to .prompt-modal-card {
  transform: scale(0.95) translateY(12px);
  opacity: 0;
}
</style>
