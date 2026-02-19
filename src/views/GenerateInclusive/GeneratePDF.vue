<template>
  <div class="space-y-3">
    <!-- Controls Row -->
    <div class="flex items-center gap-2 flex-wrap">
      <!-- Tour Name Input -->
      <input
        type="text"
        v-model="tourName"
        placeholder="Tour name e.g. Pattaya – Kanchanaburi"
        class="flex-1 min-w-[200px] py-2.5 px-4 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none"
      />

      <!-- Language Toggle -->
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

      <!-- Preview Button -->
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

          <!-- BODY — switches based on language -->
          <div
            class="pdf-body"
            :class="{ 'pdf-myanmar': language === 'mm' }"
            v-html="renderSummary(getSummary(day))"
          ></div>

          <!-- IMAGES -->
          <div v-if="getDayImages(day).length > 0" class="pdf-images">
            <img
              v-for="(img, i) in getDayImages(day).slice(0, 3)"
              :key="i"
              :src="img"
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
import { ref, computed } from "vue";

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
const language = ref("en"); // "en" | "mm"

// ── Get correct summary based on language ────────────────────
const getSummary = (day) => {
  const d = props.descriptions[day];
  if (!d) return "";
  return language.value === "mm"
    ? d.summaryMm || d.summaryEn || ""
    : d.summaryEn || "";
};

// ── Date helpers ─────────────────────────────────────────────
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
    .sort((a, b) => a._order - b._order);

const getDayHotel = (day) =>
  (props.orderedItems || []).find(
    (i) => i._type === "hotel" && (i.checkInDay ?? 1) === day,
  )?.name || null;

const getDayImages = (day) =>
  getItemsForDay(day)
    .filter((i) => i._type === "attraction" && i.productImage)
    .map((i) => i.productImage);

// ── Render *Name* → orange italic ────────────────────────────
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
            // Inject Myanmar font into the cloned document html2canvas uses
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
  // Wait for fonts before capture
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

/* HEADER */
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

/* TITLE BLOCK */
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

/* DAY BAR */
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

/* BODY */
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

/* Myanmar override — more line height needed */
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

/* IMAGES */
.pdf-images {
  display: flex;
  gap: 8px;
  margin: 12px 0;
  width: 100%;
  overflow: hidden; /* prevent overflow breaking the page */
  flex-wrap: nowrap;
}

.pdf-img {
  width: 220px; /* matches IMG_WIDTH */
  height: 160px; /* matches IMG_HEIGHT */
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0; /* key fix: never shrink/stretch */
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
