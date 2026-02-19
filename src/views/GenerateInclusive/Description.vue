<template>
  <!-- (template is unchanged — no modifications needed) -->
  <div class="space-y-4">
    <!-- Top bar: Tabs + Generate All Button -->
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
        :title="
          !hasOrderedItems
            ? 'Add services in Attractions/Van Tours first'
            : 'Generate all day descriptions with AI'
        "
      >
        <span
          v-if="isGenerating"
          class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
        ></span>
        <span v-else>✨</span>
        <span>
          {{ isGenerating ? `Generating all days...` : "Generate All with AI" }}
        </span>
      </button>
    </div>

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
          :title="
            !hasDayItems(selectedDay)
              ? 'No services on this day'
              : 'Generate description for this day only'
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
        No services added for this day yet. Add attractions or van tours to
        enable AI generation.
      </div>

      <!-- Title -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">
          Day Title <span class="text-red-400">*</span>
        </label>
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
    .sort((a, b) => a._order - b._order);

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
        label: item.name || "Attraction",
      };
    if (item._type === "hotel")
      return { type: "hotel", emoji: "🏨", label: item.name || "Hotel" };
    return { type: "", emoji: "", label: "" };
  });

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

// ── Build ONE prompt for ALL days ─────────────────────────────
const buildAllDaysPrompt = (daysToGenerate) => {
  const dayBlocks = daysToGenerate
    .map((day) => {
      const items = getItemsForDay(day);
      const cities =
        props.dayCityMap[day]?.map((c) => c.name).join(", ") || "Thailand";
      const dateLabel = getDayDateFull(day);

      const itemLines = items
        .map((item) => {
          if (item._type === "van")
            return `  🚐 Van Tour: ${item.vanTourName} (${item.carName}) in ${item.city}`;
          if (item._type === "attraction")
            return `  🎫 Attraction: ${item.name} — ${item.city}`;
          if (item._type === "hotel")
            return `  🏨 Hotel Check-in: ${item.name} (${item.roomName}), ${item.nights} night(s)`;
          return "";
        })
        .filter(Boolean)
        .join("\n");

      return `DAY ${day} — ${dateLabel}\nCities: ${cities}\nServices:\n${itemLines}`;
    })
    .join("\n\n---\n\n");

  return `You are a professional travel writer for a Myanmar tour company creating day-by-day itinerary descriptions.

Below are multiple days of a tour. Generate a description for EVERY day listed.

${dayBlocks}

Writing style to match exactly:
---
09:00 AM, Meet and welcome guests at the Hotel lobby and we will visit to *Laser Buddha (Khao Chi Chan)* that has become a Pattaya landmark due to its large golden Buddha laser engraving.

Then continue your trip to *Nong Nooch Tropical Garden*, famous for its vast, beautifully landscaped themed gardens.

Overnight at *Hotel Name*.
---

Rules for each day:
- Start with a time like "09:00 AM," for the first activity
- Use *PlaceName* formatting for attraction/place names
- Mention each service naturally in paragraph flow
- Include hotel check-in at the end if a hotel is present
- English: 3-5 paragraphs, vivid and informative
- Myanmar: Full, natural translation (not literal word-by-word)
- Title: Short English title, 4-6 words

Return ONLY this JSON structure with no markdown fences and no extra text:
{
  "days": {
    "1": { "title": "...", "summaryEn": "...", "summaryMm": "..." },
    "2": { "title": "...", "summaryEn": "...", "summaryMm": "..." }
  }
}

Include an entry for every day number provided above.`;
};

// ── Single Gemini call for ALL days ───────────────────────────
const callGeminiAllDays = async (daysToGenerate) => {
  const prompt = buildAllDaysPrompt(daysToGenerate);
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON in response");

  const parsed = JSON.parse(match[0]);
  // Support both { days: { "1": {...} } } and flat { "1": {...} }
  return parsed.days ?? parsed;
};

// ── Single Gemini call for ONE day (unchanged behaviour) ──────
const callGeminiSingleDay = async (day) => {
  const items = getItemsForDay(day);
  const cities = props.dayCityMap[day]?.map((c) => c.name).join(", ") || "";
  const dateLabel = getDayDateFull(day);

  const itemLines = items
    .map((item) => {
      if (item._type === "van")
        return `🚐 Van Tour: ${item.vanTourName} (${item.carName}) in ${item.city}`;
      if (item._type === "attraction")
        return `🎫 Attraction: ${item.name} — ${item.city}`;
      if (item._type === "hotel")
        return `🏨 Hotel Check-in: ${item.name} (${item.roomName}), ${item.nights} night(s)`;
      return "";
    })
    .filter(Boolean)
    .join("\n");

  const prompt = `You are a professional travel writer for a Myanmar tour company.

Day ${day} — ${dateLabel}
Cities: ${cities || "Thailand"}

Services planned for this day (in order):
${itemLines}

Write a travel itinerary description matching this style:
---
09:00 AM, Meet and welcome guests at the Hotel lobby and we will visit to *Laser Buddha (Khao Chi Chan)*.

Then continue to *Nong Nooch Tropical Garden*, famous for its vast landscaped gardens.

Overnight at *Hotel Name*.
---

Rules:
- Start with a time like "09:00 AM,"
- Use *PlaceName* for attraction names
- English: 3-5 paragraphs, vivid and informative
- Myanmar: Full, natural translation
- Title: 4-6 words

Return ONLY this JSON, no markdown fences:
{"title":"...","summaryEn":"...","summaryMm":"..."}`;

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

// ── Generate ALL days — single API call ───────────────────────
const generateAllDays = async (withRetry = true) => {
  if (isGenerating.value || !hasOrderedItems.value) return;

  // Collect only days that have services
  const daysToGenerate = [];
  for (let d = 1; d <= props.totalDays; d++) {
    if (hasDayItems(d)) daysToGenerate.push(d);
  }

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
    // ONE single API call returns data for every day
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
</style>
