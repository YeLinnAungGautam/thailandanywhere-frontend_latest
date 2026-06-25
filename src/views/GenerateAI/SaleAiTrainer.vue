<template>
  <!-- Overlay -->
  <div
    class="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 p-0 md:p-4"
    @click.self="$emit('close')"
  >
    <!-- Panel -->
    <div
      class="bg-white w-full md:max-w-2xl md:rounded-2xl rounded-t-2xl flex flex-col max-h-[92dvh] md:max-h-[90vh] overflow-hidden shadow-2xl"
    >
      <!-- Header -->
      <div
        class="flex items-center gap-3 px-4 py-3 border-b border-gray-100 flex-shrink-0"
      >
        <div
          class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
        >
          AI
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-800">Sales AI Trainer</p>
          <p class="text-xs text-gray-400">
            Edit conversation · Get closing strategy
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 text-xl leading-none flex-shrink-0"
        >
          ✕
        </button>
      </div>

      <!-- Scrollable body -->
      <div class="flex-1 overflow-y-auto">
        <!-- Message Editor Section -->
        <div class="px-4 pt-4 pb-2">
          <div class="flex items-center justify-between mb-2">
            <p
              class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
            >
              Conversation History
            </p>
            <button
              @click="addMessage"
              class="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              + Add line
            </button>
          </div>

          <div class="space-y-2">
            <div
              v-for="(msg, i) in editableMessages"
              :key="i"
              class="flex gap-2 items-start"
            >
              <!-- Role toggle -->
              <button
                @click="toggleRole(i)"
                :class="[
                  'flex-shrink-0 text-[10px] font-semibold px-2 py-1.5 rounded-lg mt-0.5 w-16 text-center transition-colors',
                  msg.role === 'customer'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-blue-100 text-blue-700',
                ]"
              >
                {{ msg.role === "customer" ? "Customer" : "Admin" }}
              </button>

              <!-- Text input -->
              <textarea
                v-model="msg.text"
                rows="1"
                class="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-800 outline-none focus:ring-1 focus:ring-indigo-400 resize-none overflow-hidden"
                @input="autoResize($event)"
                @focus="autoResize($event)"
              />

              <!-- Delete -->
              <button
                @click="removeMessage(i)"
                class="flex-shrink-0 text-gray-300 hover:text-red-400 text-lg leading-none mt-1"
              >
                ×
              </button>
            </div>
          </div>

          <!-- Actions row -->
          <div class="flex gap-2 mt-3">
            <button
              @click="removeAll"
              class="text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-300 rounded-lg px-3 py-1.5 flex items-center gap-1.5 transition-colors"
            >
              🗑 Remove all
            </button>

            <!-- Paste textarea modal -->
          </div>
        </div>

        <div class="border-t border-gray-100 mx-4 my-3" />

        <!-- Context input -->
        <div class="px-4 pb-3">
          <label
            class="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5"
          >
            Extra context
            <span class="text-gray-300 font-normal normal-case"
              >(optional)</span
            >
          </label>
          <textarea
            v-model="context"
            rows="10"
            placeholder="e.g. Customer is a family with 2 kids, budget ~3000 THB/night, looking for hotel near BNH hospital…"
            class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-1 focus:ring-indigo-400 resize-none"
          />
        </div>

        <!-- Analyze button -->
        <div class="px-4 pb-4">
          <button
            @click="analyze"
            :disabled="
              loading || (editableMessages.length === 0 && context.length == 0)
            "
            class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="animate-spin inline-block">⟳</span>
            <span>{{ loading ? "Analyzing…" : "✦ Get Sales Strategy" }}</span>
          </button>
        </div>

        <!-- Result -->
        <div v-if="result" class="px-4 pb-6 space-y-3">
          <div class="border-t border-gray-100 mb-4" />

          <!-- Success Rate -->
          <div class="bg-gray-50 rounded-xl p-4">
            <div class="flex items-center justify-between mb-2">
              <p
                class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
              >
                Sale Success Rate
              </p>
              <span
                :class="[
                  'text-sm font-bold px-3 py-1 rounded-full',
                  result.rate >= 70
                    ? 'bg-green-100 text-green-700'
                    : result.rate >= 40
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700',
                ]"
                >{{ result.rate }}%</span
              >
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                :class="[
                  'h-2 rounded-full transition-all duration-700',
                  result.rate >= 70
                    ? 'bg-green-500'
                    : result.rate >= 40
                    ? 'bg-yellow-500'
                    : 'bg-red-500',
                ]"
                :style="{ width: result.rate + '%' }"
              />
            </div>
            <p class="text-xs text-gray-500 mt-2">{{ result.rateReason }}</p>
          </div>

          <!-- Suggested Message -->
          <div class="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <div class="flex items-start justify-between gap-2 mb-2">
              <p
                class="text-xs font-semibold text-indigo-600 uppercase tracking-wide"
              >
                Suggested Reply
              </p>
              <button
                @click="copySuggested"
                class="text-[10px] text-indigo-500 hover:text-indigo-700 border border-indigo-200 rounded px-2 py-0.5 flex-shrink-0"
              >
                {{ copiedSuggested ? "✓ Copied" : "Copy" }}
              </button>
            </div>
            <p
              class="text-sm text-indigo-900 leading-relaxed whitespace-pre-wrap"
            >
              {{ result.suggestedMessage }}
            </p>
          </div>

          <!-- Reason -->
          <div class="bg-white border border-gray-200 rounded-xl p-4">
            <p
              class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2"
            >
              Why This Works
            </p>
            <p class="text-sm text-gray-700 leading-relaxed">
              {{ result.reason }}
            </p>
          </div>

          <!-- Tips -->
          <div
            v-if="result.tips && result.tips.length"
            class="bg-white border border-gray-200 rounded-xl p-4"
          >
            <p
              class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2"
            >
              Quick Tips
            </p>
            <ul class="space-y-1.5">
              <li
                v-for="(tip, i) in result.tips"
                :key="i"
                class="flex gap-2 text-sm text-gray-700"
              >
                <span class="text-indigo-400 flex-shrink-0">•</span>
                <span>{{ tip }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Error -->
        <div v-if="error" class="px-4 pb-6">
          <div
            class="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600"
          >
            {{ error }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  messages: { type: Array, default: () => [] }, // raw store messages
  senderName: { type: String, default: "Customer" },
});

const emit = defineEmits(["close"]);

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";

const editableMessages = ref([]);
const context = ref("");
const loading = ref(false);
const result = ref(null);
const error = ref(null);
const pasted = ref(false);
const copiedSuggested = ref(false);

// Known admin sender names/keywords to detect admin messages
// We treat the senderName prop as the customer; everything else is admin
onMounted(() => {
  editableMessages.value = props.messages
    .map((m) => ({
      role: m.type === "admin" ? "admin" : "customer",
      text: m.message_text || "",
    }))
    .filter((m) => m.text.trim());
});

function toggleRole(i) {
  editableMessages.value[i].role =
    editableMessages.value[i].role === "customer" ? "admin" : "customer";
}

function removeMessage(i) {
  editableMessages.value.splice(i, 1);
}

function removeAll() {
  editableMessages.value = [];
}

function addMessage() {
  editableMessages.value.push({ role: "customer", text: "" });
}

function autoResize(e) {
  const el = e.target;
  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";
}

function buildPlainText() {
  return editableMessages.value
    .map(
      (m) => `${m.role === "customer" ? props.senderName : "Admin"}: ${m.text}`,
    )
    .join("\n");
}

/**
 * Smart paste parser for Facebook Messenger copy-paste format.
 *
 * Facebook messages when copied look like:
 *   Hi, Soe! Please let us know how we can help you.
 *   Soe Soe
 *   ဝင်ကြေးလက်မှတ်အကြောင်း...
 *   Sent by
 *   Khaing Hnin Kyi
 *   Apr 4, 2026, 3:41 PM
 *   Soe Soe
 *   ဟိုတယ်နဲ့ ...
 *
 * Strategy:
 * - Lines that are only a person's name (short, no verb, no Myanmar long text) = speaker label
 * - "Sent by" line → next non-empty line is an admin name → mark as admin
 * - Timestamp lines (Apr 4, 2026…) → skip
 * - "replied to an ad" → skip
 * - Actual message text follows the speaker name
 */

async function copySuggested() {
  if (!result.value?.suggestedMessage) return;
  try {
    await navigator.clipboard.writeText(result.value.suggestedMessage);
    copiedSuggested.value = true;
    setTimeout(() => (copiedSuggested.value = false), 2000);
  } catch {}
}

async function analyze() {
  if (loading.value) return;
  loading.value = true;
  result.value = null;
  error.value = null;

  const conversationText = buildPlainText();
  const contextNote = context.value.trim()
    ? `\n\nExtra context: ${context.value.trim()}`
    : "";

  // Keep suggestedMessage short so it fits within token budget
  const prompt = `You are an expert hotel/travel sales coach. Analyze this customer conversation and help the sales admin close the sale.

Conversation:
${conversationText}${contextNote}

Rules:
- suggestedMessage: max 3 sentences, warm and helpful tone matching the customer's language
- reason: MUST be written in Myanmar (Burmese) language only, max 2 sentences
- rateReason: MUST be written in Myanmar (Burmese) language only, 1 sentence
- tips: MUST be written in Myanmar (Burmese) language only, exactly 2 items, each max 15 words

Respond ONLY with raw JSON, no markdown fences, no extra text:
{"suggestedMessage":"...","reason":"...","rate":0,"rateReason":"...","tips":["...","..."]}`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
            responseMimeType: "application/json",
          },
        }),
      },
    );

    const data = await res.json();
    const finishReason = data?.candidates?.[0]?.finishReason;
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!raw) {
      const apiErr = data?.error?.message;
      error.value = apiErr || "Empty response from Gemini. Try again.";
      return;
    }

    // Strip markdown fences if present despite responseMimeType
    let clean = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    // If truncated (MAX_TOKENS), attempt to repair the JSON
    if (finishReason === "MAX_TOKENS") {
      clean = repairTruncatedJson(clean);
    }

    try {
      result.value = JSON.parse(clean);
    } catch {
      // Last resort: extract fields with regex
      result.value = extractFieldsFallback(clean);
      if (!result.value) {
        error.value = "Could not parse AI response. Please try again.";
      }
    }
  } catch (e) {
    error.value = "Network error. Check your connection and API key.";
    console.error(e);
  } finally {
    loading.value = false;
  }
}

// Close uncompleted JSON so JSON.parse has a chance
function repairTruncatedJson(str) {
  // Count open brackets/braces
  let obj = 0,
    arr = 0,
    inStr = false,
    esc = false;
  for (const ch of str) {
    if (esc) {
      esc = false;
      continue;
    }
    if (ch === "\\" && inStr) {
      esc = true;
      continue;
    }
    if (ch === '"' && !esc) {
      inStr = !inStr;
      continue;
    }
    if (inStr) continue;
    if (ch === "{") obj++;
    if (ch === "}") obj--;
    if (ch === "[") arr++;
    if (ch === "]") arr--;
  }
  // Close unclosed string
  if (inStr) str += '"';
  // Close unclosed arrays then objects
  str += "]".repeat(Math.max(0, arr));
  str += "}".repeat(Math.max(0, obj));
  return str;
}

// Regex fallback extraction when JSON is too broken to parse
function extractFieldsFallback(str) {
  try {
    const get = (key) => {
      const m = str.match(
        new RegExp(`"${key}"\\s*:\\s*"((?:[^"\\\\]|\\\\[\\s\\S])*)"`, "s"),
      );
      return m ? m[1].replace(/\\n/g, "\n").replace(/\\"/g, '"') : "";
    };
    const getNum = (key) => {
      const m = str.match(new RegExp(`"${key}"\\s*:\\s*(\\d+)`));
      return m ? parseInt(m[1]) : 50;
    };
    return {
      suggestedMessage:
        get("suggestedMessage") || "Could not extract suggestion.",
      reason: get("reason") || "",
      rate: getNum("rate"),
      rateReason: get("rateReason") || "",
      tips: [],
    };
  } catch {
    return null;
  }
}
</script>
