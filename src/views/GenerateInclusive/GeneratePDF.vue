<template>
  <div class="space-y-3">
    <!-- Controls Row -->
    <div class="flex items-center gap-2 flex-wrap">
      <input
        type="text"
        v-model="tourName"
        placeholder="Tour name e.g. Pattaya – Kanchanaburi"
        class="flex-1 min-w-[200px] py-2.5 px-4 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none"
      />

      <div
        class="flex rounded-xl border border-gray-300 overflow-hidden shrink-0"
      >
        <button
          @click="language = 'en'"
          :class="
            language === 'en'
              ? 'bg-orange-500 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          "
          class="px-4 py-2.5 text-sm font-semibold transition flex items-center gap-1.5"
        >
          🇬🇧 English
        </button>
        <button
          @click="language = 'mm'"
          :class="
            language === 'mm'
              ? 'bg-orange-500 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          "
          class="px-4 py-2.5 text-sm font-semibold transition flex items-center gap-1.5 border-l border-gray-300"
        >
          🇲🇲 Myanmar
        </button>
      </div>

      <button
        @click="previewPDF"
        :disabled="isGenerating"
        class="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-blue-500 hover:bg-blue-600 text-white transition disabled:opacity-50 shrink-0"
      >
        <span
          v-if="isGenerating"
          class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
        />
        <span v-else>👁️</span>
        {{ isGenerating ? "Preparing..." : "Preview PDF" }}
      </button>
    </div>

    <!-- ══════════════════════════════════════════════════════
         PER-DAY IMAGE SELECTOR
    ══════════════════════════════════════════════════════ -->
    <div class="space-y-4">
      <div
        v-for="day in totalDays"
        :key="`img-day-${day}`"
        class="border-2 border-slate-200 rounded-2xl p-4 bg-white"
      >
        <!-- Day header -->
        <div class="flex items-center justify-between mb-3">
          <h4 class="font-semibold text-slate-700 text-sm">
            📅 Day {{ day }} — {{ getDayDateFull(day) }}
            <span class="ml-2 text-xs text-slate-400 font-normal">
              ({{ selectedImages[day]?.length ?? 0 }} selected, max 3 shown in
              PDF)
            </span>
          </h4>
          <button
            v-if="selectedImages[day]?.length > 0"
            @click="selectedImages[day] = []"
            class="text-xs text-red-400 hover:text-red-600 font-medium transition"
          >
            Clear
          </button>
        </div>

        <!-- Image grid — all images from items on this day -->
        <div
          v-if="getDayAllImages(day).length > 0"
          class="flex flex-wrap gap-2"
        >
          <div
            v-for="img in getDayAllImages(day)"
            :key="img.id"
            @click="toggleImage(day, img)"
            class="relative cursor-pointer group"
          >
            <img
              :src="img.image"
              class="w-20 h-20 object-cover rounded-xl transition"
              :class="
                isImageSelected(day, img)
                  ? 'ring-4 ring-orange-500 opacity-100'
                  : 'opacity-60 hover:opacity-90'
              "
            />
            <!-- Checkbox overlay -->
            <div
              class="absolute top-1 left-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition"
              :class="
                isImageSelected(day, img)
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/80 text-slate-400 border border-slate-300'
              "
            >
              {{ isImageSelected(day, img) ? getImageOrder(day, img) : "" }}
            </div>
          </div>
        </div>

        <div v-else class="text-sm text-slate-400 py-3 text-center">
          No images available for this day
        </div>

        <!-- Preview of selected (ordered) -->
        <div
          v-if="selectedImages[day]?.length > 0"
          class="mt-3 pt-3 border-t border-slate-100"
        >
          <p class="text-xs text-slate-500 mb-2 font-medium">
            PDF preview order (max 3):
          </p>
          <div class="flex gap-2">
            <div
              v-for="(img, idx) in selectedImages[day].slice(0, 3)"
              :key="`preview-${img.id}`"
              class="relative"
            >
              <img :src="img.image" class="w-16 h-12 object-cover rounded-lg" />
              <span
                class="absolute -top-1 -left-1 w-4 h-4 bg-orange-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center"
              >
                {{ idx + 1 }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <Transition name="fade">
      <div
        v-if="showPreview"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        @click.self="showPreview = false"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl w-[80vw] h-[90vh] flex flex-col overflow-hidden"
        >
          <div class="flex items-center justify-between px-5 py-3 border-b">
            <span class="font-semibold text-slate-700">
              PDF Preview
              <span
                class="ml-2 text-xs font-normal px-2 py-0.5 rounded-lg"
                :class="
                  language === 'en'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-orange-100 text-orange-700'
                "
              >
                {{ language === "en" ? "🇬🇧 English" : "🇲🇲 Myanmar" }}
              </span>
            </span>
            <div class="flex gap-2">
              <button
                @click="downloadFromPreview"
                class="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg font-medium transition"
              >
                ⬇ Download
              </button>
              <button
                @click="showPreview = false"
                class="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm rounded-lg font-medium transition"
              >
                ✕ Close
              </button>
            </div>
          </div>
          <iframe
            v-if="previewUrl"
            :src="previewUrl"
            class="flex-1 w-full border-0"
          />
        </div>
      </div>
    </Transition>

    <!-- PDF Template (hidden) -->
    <div
      style="
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        overflow: hidden;
        opacity: 0;
        pointer-events: none;
      "
    >
      <div
        ref="pdfContent"
        style="width: 720px; background: white"
        :style="
          language === 'mm'
            ? 'font-family: Pyidaungsu, Myanmar Text, Noto Sans Myanmar, Arial, sans-serif;'
            : 'font-family: Arial, sans-serif;'
        "
      >
        <div v-for="day in totalDays" :key="day" class="pdf-page">
          <!-- HEADER -->
          <div class="pdf-header">
            <div class="pdf-header-left">
              <img
                src="../../assets/web-logo.png"
                alt="logo"
                class="pdf-logo"
                onerror="this.style.display='none'"
              />
              <div>
                <div class="pdf-company-name">TH ANYWHERE Co.,Ltd</div>
                <div class="pdf-company-tagline">
                  Our success is measured by your smiles
                </div>
              </div>
            </div>
            <div class="pdf-header-right">
              TAT License : <strong>14/03632</strong>
            </div>
          </div>

          <hr class="pdf-divider" />

          <!-- TITLE BLOCK — Day 1 only -->
          <div v-if="day === 1" class="pdf-title-block">
            <div class="pdf-title-name">{{ tourName }}</div>
            <div class="pdf-title-sub">
              ({{ totalDays }} Days - {{ totalDays - 1 }} Nights trip)
            </div>
            <div class="pdf-title-sub">{{ coverDateRange }}</div>
          </div>
          <hr v-if="day === 1" class="pdf-divider" style="margin-top: 14px" />

          <!-- DAY TITLE BAR -->
          <div class="pdf-day-bar">
            <span class="pdf-day-label">
              {{ getDayDateFull(day) }} :
              {{ descriptions[day]?.title || `Day ${day}` }}
            </span>
            <span class="pdf-meal-badge">(- / L / -)</span>
          </div>

          <!-- BODY -->
          <div
            class="pdf-body"
            :class="{ 'pdf-myanmar': language === 'mm' }"
            v-html="renderSummary(getSummary(day))"
          ></div>

          <!-- IMAGES — user selected, max 3 -->
          <div v-if="getPdfImages(day).length > 0" class="pdf-images">
            <img
              v-for="(img, i) in getPdfImages(day)"
              :key="i"
              :src="img.image"
              class="pdf-img"
              crossorigin="anonymous"
              @error="(e) => (e.target.style.display = 'none')"
            />
          </div>

          <!-- OVERNIGHT -->
          <div
            v-if="getDayHotel(day)"
            class="pdf-overnight"
            :class="{ 'pdf-myanmar': language === 'mm' }"
          >
            Overnight at
            <span class="pdf-orange-italic">{{ getDayHotel(day) }}</span
            >.
          </div>
        </div>

        <!-- Thank you -->
        <div class="pdf-thankyou">Thank you for choosing us for your tour.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from "vue";

const props = defineProps({
  totalDays: { type: Number, default: 0 },
  startDate: { type: String, default: "" },
  orderedItems: { type: Array, default: () => [] },
  dayCityMap: { type: Object, default: () => ({}) },
  descriptions: { type: Object, default: () => ({}) },
});

const pdfContent = ref(null);
const isGenerating = ref(false);
const showPreview = ref(false);
const previewUrl = ref(null);
const tourName = ref("Tour Itinerary");
const language = ref("en");

// ── Per-day selected images — { [day]: [{id, image}, ...] } ──
const selectedImages = reactive({});

// ── Collect ALL images available for a day ───────────────────
// Pulls from: attraction.productImage + attraction.images[] + hotel.images[]
const getDayAllImages = (day) => {
  const items = getItemsForDay(day);
  const seen = new Set();
  const result = [];

  items.forEach((item) => {
    // images array (array of {id, image})
    if (Array.isArray(item.images)) {
      item.images.forEach((img) => {
        if (img?.image && !seen.has(img.image)) {
          seen.add(img.image);
          result.push({ id: img.id ?? img.image, image: img.image });
        }
      });
    }
    // single productImage
    if (item.productImage && !seen.has(item.productImage)) {
      seen.add(item.productImage);
      result.push({ id: `pi_${item._uid}`, image: item.productImage });
    }
  });

  return result;
};

// ── Image selection helpers ───────────────────────────────────
const toggleImage = (day, img) => {
  if (!selectedImages[day]) selectedImages[day] = [];
  const idx = selectedImages[day].findIndex((i) => i.id === img.id);
  if (idx > -1) {
    selectedImages[day].splice(idx, 1);
  } else {
    selectedImages[day].push(img);
  }
};

const isImageSelected = (day, img) =>
  selectedImages[day]?.some((i) => i.id === img.id) ?? false;

// Returns 1-based position for display inside the checkbox circle
const getImageOrder = (day, img) => {
  const idx = selectedImages[day]?.findIndex((i) => i.id === img.id) ?? -1;
  return idx > -1 ? idx + 1 : "";
};

// ── Images that go into the PDF (max 3, in selection order) ──
const getPdfImages = (day) => (selectedImages[day] ?? []).slice(0, 3);

// ── Language ──────────────────────────────────────────────────
const getSummary = (day) => {
  const d = props.descriptions[day];
  if (!d) return "";
  return language.value === "mm"
    ? d.summaryMm || d.summaryEn || ""
    : d.summaryEn || "";
};

// ── Date helpers ──────────────────────────────────────────────
const coverDateRange = computed(() => {
  if (!props.startDate || !props.totalDays) return "";
  const start = new Date(props.startDate);
  const end = new Date(props.startDate);
  end.setDate(end.getDate() + props.totalDays - 1);
  const startDay = start.getDate();
  const endStr = end.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${startDay} – ${endStr}`;
});

const getDayDateFull = (n) => {
  if (!props.startDate || !n) return `Day ${n}`;
  const d = new Date(props.startDate);
  d.setDate(d.getDate() + n - 1);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ── Items helpers ─────────────────────────────────────────────
const getItemsForDay = (day) =>
  (props.orderedItems || [])
    .filter((i) =>
      i._type === "hotel" ? (i.checkInDay ?? 1) === day : i.dayNumber === day,
    )
    .sort((a, b) => (a._order ?? 0) - (b._order ?? 0));

const getDayHotel = (day) =>
  (props.orderedItems || []).find(
    (i) => i._type === "hotel" && (i.checkInDay ?? 1) === day,
  )?.name || null;

// ── Render *text* → orange italic ────────────────────────────
const renderSummary = (text) => {
  if (!text) return "";
  return text
    .replace(/\*([^*]+)\*/g, '<span class="pdf-orange-italic">$1</span>')
    .replace(/\n/g, "<br/>");
};

// ── PDF options ───────────────────────────────────────────────
const getPdfOptions = () => ({
  margin: 8,
  filename: `itinerary-${props.startDate || "tour"}-${language.value}.pdf`,
  image: { type: "jpeg", quality: 0.95 },
  html2canvas: {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
    windowWidth: 720,
    onclone:
      language.value === "mm"
        ? (clonedDoc) => {
            const style = clonedDoc.createElement("style");
            style.textContent = `
              @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Myanmar:wght@400;700&display=swap');
              .pdf-myanmar {
                font-family: 'Noto Sans Myanmar', Pyidaungsu, 'Myanmar Text', sans-serif !important;
                line-height: 2 !important;
              }
            `;
            clonedDoc.head.appendChild(style);
          }
        : undefined,
  },
  jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  pagebreak: { mode: ["css"], before: ".pdf-page + .pdf-page" },
});

const buildBlob = async () => {
  await document.fonts.ready;
  const html2pdf = (await import("html2pdf.js")).default;
  return await html2pdf()
    .set(getPdfOptions())
    .from(pdfContent.value)
    .outputPdf("blob");
};

const previewPDF = async () => {
  isGenerating.value = true;
  try {
    const blob = await buildBlob();
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = URL.createObjectURL(blob);
    showPreview.value = true;
  } catch (e) {
    console.error("Preview error:", e);
  } finally {
    isGenerating.value = false;
  }
};

const generatePDF = async () => {
  isGenerating.value = true;
  try {
    const html2pdf = (await import("html2pdf.js")).default;
    await html2pdf().set(getPdfOptions()).from(pdfContent.value).save();
  } catch (e) {
    console.error("PDF error:", e);
  } finally {
    isGenerating.value = false;
  }
};

const downloadFromPreview = async () => {
  showPreview.value = false;
  await generatePDF();
};

onMounted(() => {
  // Pre-initialize selectedImages for each day so reactivity works
  for (let d = 1; d <= props.totalDays; d++) {
    if (!selectedImages[d]) selectedImages[d] = [];
  }
});
</script>

<style scoped>
.pdf-page {
  width: 720px;
  padding: 24px 28px;
  box-sizing: border-box;
  background: white;
}
.pdf-page + .pdf-page {
  page-break-before: always;
}
.pdf-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 12px;
}
.pdf-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}
.pdf-header-right {
  flex-shrink: 0;
  font-size: 12px;
  color: #333;
  text-align: right;
  white-space: nowrap;
}
.pdf-header-right strong {
  color: #ff613c;
}
.pdf-logo {
  width: 44px;
  height: 44px;
  object-fit: contain;
  flex-shrink: 0;
}
.pdf-company-name {
  font-size: 15px;
  font-weight: 700;
  color: #ff613c;
  white-space: nowrap;
}
.pdf-company-tagline {
  font-size: 9px;
  color: #888;
}
.pdf-divider {
  border: none;
  border-top: 1px solid #ddd;
  margin: 8px 0 12px;
}
.pdf-title-block {
  text-align: center;
  padding: 8px 0 4px;
}
.pdf-title-name {
  font-size: 20px;
  font-weight: 700;
  color: #ff613c;
  margin-bottom: 4px;
}
.pdf-title-sub {
  font-size: 14px;
  font-weight: 600;
  color: #ff613c;
  margin-bottom: 2px;
}
.pdf-day-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  gap: 8px;
}
.pdf-day-label {
  font-size: 13px;
  font-weight: 700;
  color: #ff613c;
  flex: 1;
}
.pdf-meal-badge {
  font-size: 12px;
  font-weight: 600;
  color: #555;
  white-space: nowrap;
  flex-shrink: 0;
}
.pdf-body {
  font-size: 12px;
  line-height: 1.8;
  text-align: justify;
  color: #1e1e1e;
  margin-bottom: 12px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  max-width: 100%;
}
.pdf-myanmar {
  font-family: "Pyidaungsu", "Myanmar Text", "Noto Sans Myanmar", sans-serif !important;
  line-height: 2 !important;
  font-size: 13px !important;
}
:deep(.pdf-orange-italic) {
  color: #ff613c;
  font-style: italic;
}
.pdf-orange-italic {
  color: #ff613c;
  font-style: italic;
}
.pdf-images {
  display: flex;
  gap: 8px;
  margin: 12px 0;
  width: 100%;
  overflow: hidden;
  flex-wrap: nowrap;
}
.pdf-img {
  width: 220px;
  height: 160px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
  display: block;
}
.pdf-overnight {
  font-size: 12px;
  margin-top: 8px;
}
.pdf-thankyou {
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #ff613c;
  padding: 28px 0 10px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
