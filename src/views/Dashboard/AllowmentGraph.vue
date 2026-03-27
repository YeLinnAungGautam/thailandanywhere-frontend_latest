<template>
  <div
    class="flex h-full min-h-[690px] rounded-lg overflow-hidden shadow-xl bg-slate-100 font-sans"
  >
    <!-- ═══ LEFT PANEL ═══ -->
    <div
      class="w-1/4 min-w-[200px] bg-white flex flex-col overflow-hidden border-r border-slate-200"
    >
      <!-- Header -->
      <div class="px-4 pt-5 pb-4 border-b border-slate-100 flex-shrink-0">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-base">🏨</span>
          <h2 class="text-lg font-bold text-slate-700 tracking-wide flex-1">
            Hotels
          </h2>
          <span
            class="text-[10px] font-bold font-mono bg-orange-50 text-orange-500 border border-orange-200 px-2 py-0.5 rounded-full"
          >
            {{ filteredHotelList.length }}
          </span>
        </div>
        <div class="relative">
          <svg
            class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            v-model="hotelSearch"
            type="text"
            placeholder="Search hotels..."
            class="w-full bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 text-xs py-2 pl-8 pr-3 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 transition-all"
          />
        </div>
      </div>

      <!-- Hotel List -->
      <div class="flex-1 overflow-y-auto p-2 space-y-0.5">
        <div
          v-if="loadingHotels"
          class="flex flex-col items-center justify-center py-12 gap-3"
        >
          <div
            class="w-5 h-5 border-2 border-slate-200 border-t-orange-500 rounded-full animate-spin"
          ></div>
          <span class="text-xs text-slate-400">Loading…</span>
        </div>
        <template v-else>
          <div
            v-for="hotel in filteredHotelList"
            :key="hotel.id"
            @click="selectHotel(hotel)"
            class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 border"
            :class="
              selectedHotelId === hotel.id
                ? 'bg-orange-50 border-orange-200 shadow-sm'
                : 'border-transparent hover:bg-slate-50 hover:border-slate-200'
            "
          >
            <div
              class="w-1.5 h-1.5 rounded-full flex-shrink-0"
              :class="
                selectedHotelId === hotel.id
                  ? 'bg-orange-500'
                  : 'bg-emerald-400'
              "
            ></div>
            <span
              class="text-xs font-semibold flex-1 truncate"
              :class="
                selectedHotelId === hotel.id
                  ? 'text-orange-600'
                  : 'text-slate-600'
              "
            >
              {{ hotel.name }}
            </span>
            <svg
              v-if="selectedHotelId === hotel.id"
              class="w-3 h-3 text-orange-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </template>
      </div>
    </div>

    <!-- ═══ RIGHT PANEL ═══ -->
    <div class="flex-1 flex flex-col overflow-hidden bg-slate-50">
      <!-- No hotel selected -->
      <div
        v-if="!selectedHotelId"
        class="flex-1 flex flex-col items-center justify-center gap-3 p-10"
      >
        <div class="text-5xl opacity-20">🏨</div>
        <h3 class="text-base font-bold text-slate-400">Select a hotel</h3>
        <p class="text-xs text-slate-400 text-center max-w-xs leading-relaxed">
          Pick a hotel from the left panel to view room availability.
        </p>
      </div>

      <template v-else>
        <!-- Right panel header -->
        <div
          class="px-6 py-4 border-b border-slate-200 bg-white flex-shrink-0 flex items-center justify-between flex-wrap gap-2"
        >
          <div>
            <h2
              class="text-lg font-extrabold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent"
            >
              {{ selectedHotelName }}
            </h2>
            <p class="text-[11px] text-slate-400 mt-0.5">
              {{
                selectedRoomId
                  ? selectedRoomName + " · " + checkin + "-" + checkout
                  : "Select a room to view chart"
              }}
            </p>
          </div>
          <!-- Legend shown only when chart is visible -->
          <!-- <div v-if="selectedRoomId" class="flex items-center gap-3 flex-wrap">
            <div
              v-for="l in legend"
              :key="l.label"
              class="flex items-center gap-1.5"
            >
              <div
                class="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                :style="`background:${l.color}`"
              ></div>
              <span class="text-[10px] font-semibold text-slate-500">{{
                l.label
              }}</span>
            </div>
          </div> -->
          <!-- Date range picker -->
          <div class="flex items-center gap-2 flex-shrink-0">
            <div
              class="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5"
            >
              <svg
                class="w-3.5 h-3.5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <input
                type="date"
                v-model="checkin"
                class="text-xs text-slate-600 bg-transparent outline-none cursor-pointer"
                @change="selectedRoomId && buildChart()"
              />
            </div>
            <span class="text-slate-400 text-xs">→</span>
            <div
              class="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5"
            >
              <svg
                class="w-3.5 h-3.5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <input
                type="date"
                v-model="checkout"
                :min="checkin"
                class="text-xs text-slate-600 bg-transparent outline-none cursor-pointer"
                @change="selectedRoomId && buildChart()"
              />
            </div>
            <!-- Quick presets -->
            <div class="flex gap-1">
              <button
                v-for="preset in datePresets"
                :key="preset.label"
                @click="applyPreset(preset.days)"
                class="text-[12px] px-2 py-1.5 rounded-full border transition-colors"
                :class="
                  activeDays === preset.days
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-orange-300 hover:text-orange-500'
                "
              >
                {{ preset.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Body -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- ── Room strip with scroll arrows ── -->
          <div class="flex-shrink-0 border-b border-slate-200 bg-white">
            <div v-if="loadingRooms" class="flex items-center gap-2 px-6 py-4">
              <div
                class="w-4 h-4 border-2 border-slate-200 border-t-orange-500 rounded-full animate-spin"
              ></div>
              <span class="text-xs text-slate-400">Loading rooms…</span>
            </div>
            <div v-else-if="visibleRooms.length === 0" class="px-6 py-4">
              <p class="text-xs text-slate-400">
                No rooms available for this hotel.
              </p>
            </div>
            <!-- Scroll container with arrow buttons -->
            <div v-else class="relative flex items-center">
              <!-- Left arrow -->
              <button
                v-if="canScrollLeft"
                @click="scrollRooms('left')"
                class="absolute left-0 z-10 h-full px-2 bg-gradient-to-r from-white via-white to-transparent flex items-center text-slate-400 hover:text-orange-500 transition-colors"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <!-- Scrollable room list -->
              <div
                ref="roomScrollRef"
                class="flex gap-2 px-4 py-3 overflow-x-auto scroll-smooth"
                style="scrollbar-width: none; -ms-overflow-style: none"
                @scroll="updateScrollState"
              >
                <div
                  v-for="room in visibleRooms"
                  :key="room.id"
                  @click="selectRoom(room)"
                  class="flex-shrink-0 rounded-xl border px-3 py-2.5 cursor-pointer transition-all duration-150 w-[230px]"
                  :class="
                    selectedRoomId === room.id
                      ? 'bg-orange-50 border-orange-300 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-orange-200 hover:bg-orange-50/50'
                  "
                >
                  <p
                    class="text-[14px] font-bold mb-2 truncate"
                    :class="
                      selectedRoomId === room.id
                        ? 'text-orange-600'
                        : 'text-slate-700'
                    "
                  >
                    {{ room.name }}
                  </p>
                  <div class="flex gap-1 flex-wrap">
                    <span
                      v-if="getRoomCount(room, 'green') > 0"
                      class="text-[12px] pr-2 font-bold font-mono text-emerald-700"
                    >
                      🟢 {{ getRoomCount(room, "green") }}
                    </span>
                    <span
                      v-if="getRoomCount(room, 'yellow') > 0"
                      class="text-[12px] pr-2 font-bold font-mono text-amber-700"
                    >
                      🟡 {{ getRoomCount(room, "yellow") }}
                    </span>
                    <span
                      v-if="getRoomCount(room, 'red') > 0"
                      class="text-[12px] pr-2 font-bold font-mono text-red-700"
                    >
                      🔴 {{ getRoomCount(room, "red") }}
                    </span>
                    <span
                      v-if="getRoomCount(room, 'overbooked') > 0"
                      class="text-[12px] pr-2 font-bold font-mono text-red-800"
                    >
                      ⛔ {{ getRoomCount(room, "overbooked") }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Right arrow -->
              <button
                v-if="canScrollRight"
                @click="scrollRooms('right')"
                class="absolute right-0 z-10 h-full px-2 bg-gradient-to-l from-white via-white to-transparent flex items-center text-slate-400 hover:text-orange-500 transition-colors"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- ── Chart area ── -->
          <div class="flex-1 flex flex-col p-5 gap-4 overflow-hidden">
            <!-- No room selected -->
            <div
              v-if="!selectedRoomId"
              class="flex-1 flex flex-col items-center justify-center gap-2"
            >
              <div class="text-3xl opacity-20">📊</div>
              <p class="text-xs text-slate-400">
                Click a room above to view the availability chart
              </p>
            </div>

            <template v-else>
              <!-- Summary cards -->
              <div class="grid grid-cols-4 gap-3 flex-shrink-0">
                <div
                  v-for="card in summaryCards"
                  :key="card.label"
                  class="bg-white rounded-xl border-t-4 border border-slate-100 px-4 py-3 text-center shadow-sm"
                  :class="card.topBorder"
                >
                  <p
                    class="text-2xl font-black font-mono"
                    :class="card.textColor"
                  >
                    {{ card.value }}
                  </p>
                  <p
                    class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5"
                  >
                    {{ card.label }}
                  </p>
                </div>
              </div>
              <!-- Chart -->
              <div
                class="flex-1 bg-white rounded-xl border border-slate-200 p-4 shadow-sm overflow-hidden"
              >
                <canvas ref="chartCanvas"></canvas>
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { Chart, registerables } from "chart.js";
import { useRoomStore } from "../../stores/room";
import { useHotelStore } from "../../stores/hotel";

Chart.register(...registerables);

const roomStore = useRoomStore();
const hotelStore = useHotelStore();

// ── State ──────────────────────────────────────────────────────────────────────
const allHotels = ref([]);
const hotelSearch = ref("");
const loadingHotels = ref(false);
const selectedHotelId = ref(null);
const selectedHotelName = ref("");
const hotelRooms = ref([]);
const loadingRooms = ref(false);
const selectedRoomId = ref(null);
const selectedRoomName = ref("");
const chartCanvas = ref(null);
const roomScrollRef = ref(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);
const checkin = ref("");
const checkout = ref("");
let chartInstance = null;

// ── Dates: next 30 days ────────────────────────────────────────────────────────
// const dates = computed(() => {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   return Array.from({ length: 30 }, (_, i) => {
//     const d = new Date(today);
//     d.setDate(today.getDate() + i);
//     return d;
//   });
// });
const dates = computed(() => {
  if (!checkin.value || !checkout.value) return [];
  const start = new Date(checkin.value);
  const end = new Date(checkout.value);
  const result = [];
  const cur = new Date(start);
  while (cur <= end) {
    result.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return result;
});

// const first = visibleRooms.value[0];
// if (first) {
//   await selectRoom(first);
// }

const legend = [
  { label: "Available", color: "#22c55e" },
  { label: "Booked", color: "rgba(100,116,139,0.4)" },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmtKey = (d) => {
  const y = d.getFullYear();
  const mon = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${mon}-${day}`;
};

const getStock = (room, d) =>
  room?.room_rates?.[fmtKey(d)]?.stock ?? room?.meta?.stock ?? 0;
const getBooked = (room, d) => room?.room_rates?.[fmtKey(d)]?.booked_count ?? 0;

const classifyDay = (stock, booked) => {
  if (booked > stock) return "overbooked";
  const avail = stock - booked;
  if (avail <= Math.ceil(stock * 0.2)) return "red";
  if (avail <= Math.ceil(stock * 0.4)) return "yellow";
  return "green";
};

const getRoomCount = (room, status) =>
  dates.value.filter(
    (d) => classifyDay(getStock(room, d), getBooked(room, d)) === status,
  ).length;

// ── FIX 1: Filter rooms by meta.is_show_on === "1" ────────────────────────────
const visibleRooms = computed(() =>
  hotelRooms.value.filter(
    (r) => r.meta?.is_show_on === "1" || r.meta?.is_show_on === 1,
  ),
);

// ── Filtered hotel list ────────────────────────────────────────────────────────
const filteredHotelList = computed(() => {
  const q = hotelSearch.value.trim().toLowerCase();
  const list = allHotels.value.filter((h) => h.allowment == 1);
  return q ? list.filter((h) => h.name.toLowerCase().includes(q)) : list;
});

// ── Summary cards ──────────────────────────────────────────────────────────────
const summaryCards = computed(() => {
  const room = hotelRooms.value.find((r) => r.id === selectedRoomId.value);
  if (!room) return [];
  const c = { green: 0, yellow: 0, red: 0, overbooked: 0 };
  dates.value.forEach((d) => {
    c[classifyDay(getStock(room, d), getBooked(room, d))]++;
  });
  return [
    {
      label: "Green Days",
      value: c.green,
      textColor: "text-emerald-600",
      topBorder: "border-t-emerald-400",
    },
    {
      label: "Yellow Days",
      value: c.yellow,
      textColor: "text-amber-500",
      topBorder: "border-t-amber-400",
    },
    {
      label: "Red Days",
      value: c.red,
      textColor: "text-red-500",
      topBorder: "border-t-red-400",
    },
    {
      label: "Overbooked",
      value: c.overbooked,
      textColor: "text-red-800",
      topBorder: "border-t-red-800",
    },
  ];
});

// ── FIX 2: Scroll arrow state ──────────────────────────────────────────────────
const updateScrollState = () => {
  const el = roomScrollRef.value;
  if (!el) return;
  canScrollLeft.value = el.scrollLeft > 0;
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
};

const scrollRooms = (dir) => {
  const el = roomScrollRef.value;
  if (!el) return;
  el.scrollBy({ left: dir === "right" ? 200 : -200, behavior: "smooth" });
};

// ── FIX 3 & 4 & 5: Chart — 2 colors + counts on top + empty bar placeholder ──
const buildChart = async () => {
  await nextTick();
  const canvas = chartCanvas.value;
  if (!canvas) return;

  const room = hotelRooms.value.find((r) => r.id === selectedRoomId.value);
  if (!room) return;

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  const labels = [];
  const availData = [];
  const bookedData = [];

  dates.value.forEach((d) => {
    labels.push(
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    );
    const stock = getStock(room, d);
    const booked = getBooked(room, d);
    const avail = Math.max(0, stock - booked);
    // FIX 5: if no data at all, push a tiny placeholder (0.15) so bar is visible
    availData.push(stock === 0 && booked === 0 ? 0 : avail);
    bookedData.push(Math.min(booked, stock));
  });

  const maxVal = Math.max(...availData.map((a, i) => a + bookedData[i]));
  const yMax = Math.max(Math.ceil(maxVal * 1.35), 5); // extra top room for labels

  chartInstance = new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          // Green available segment
          label: "Available",
          data: availData,
          backgroundColor: dates.value.map((d) => {
            const stock = getStock(room, d);
            const booked = getBooked(room, d);
            if (stock === 0 && booked === 0) return "rgba(203,213,225,0.3)"; // empty placeholder
            const status = classifyDay(stock, booked);
            return status === "overbooked"
              ? "#dc2626"
              : status === "red"
              ? "#ef4444"
              : status === "yellow"
              ? "#22c55e"
              : "#22c55e";
          }),
          borderWidth: 0,
          barThickness: 25,
          stack: "s",
          // FIX 3: show count label on top of bar
          datalabels: undefined, // handled via custom plugin below
        },
        {
          // Gray booked segment
          label: "Booked",
          data: bookedData,
          backgroundColor: "rgba(100,116,139,0.35)",
          borderWidth: 0,
          barThickness: 25,
          stack: "s",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      layout: { padding: { top: 24 } }, // space for count labels above bars
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: {
            font: { size: 9, weight: "600" },
            color: "#64748b",
            maxRotation: 45,
            minRotation: 45,
            autoSkip: true,
            maxTicksLimit: 15,
          },
          border: { display: false },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          max: yMax,
          grid: { color: "rgba(148,163,184,0.1)" },
          border: { display: false },
          ticks: {
            stepSize: 1,
            callback: (v) => (Number.isInteger(v) ? v : null),
            font: { size: 10 },
            color: "#94a3b8",
          },
          title: {
            display: true,
            text: "Rooms",
            font: { size: 10 },
            color: "#94a3b8",
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(15,23,42,0.95)",
          titleColor: "#f1f5f9",
          bodyColor: "#cbd5e1",
          footerColor: "#94a3b8",
          cornerRadius: 8,
          padding: 12,
          borderWidth: 1,
          borderColor: "rgba(148,163,184,0.15)",
          callbacks: {
            title: (ctx) => {
              const d = dates.value[ctx[0].dataIndex];
              return d.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              });
            },
            footer: (items) => {
              const d = dates.value[items[0].dataIndex];
              const stock = getStock(room, d);
              const booked = getBooked(room, d);
              const avail = Math.max(0, stock - booked);
              const emoji = {
                green: "🟢",
                yellow: "🟡",
                red: "🔴",
                overbooked: "⛔",
              }[classifyDay(stock, booked)];
              return [
                `Stock: ${stock}  |  Booked: ${booked}  |  Avail: ${avail}  ${emoji}`,
              ];
            },
          },
        },
      },
    },
    // FIX 3: inline plugin to draw available count above each bar
    plugins: [
      {
        id: "topLabels",
        afterDatasetsDraw(chart) {
          const ctx = chart.ctx;
          const meta0 = chart.getDatasetMeta(0); // available dataset
          const meta1 = chart.getDatasetMeta(1); // booked dataset

          ctx.save();
          ctx.font = "600 9px system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";

          meta0.data.forEach((bar, i) => {
            const avail = availData[i];
            const booked = bookedData[i];
            const total = avail + booked;
            if (total === 0) return; // skip truly empty

            // top of stacked bar = bottom of available bar's top edge
            const bar1 = meta1.data[i];
            const topY = bar1 ? Math.min(bar.y, bar1.y) : bar.y;
            const label = String(avail);

            // color matching the available bar
            const d = dates.value[i];
            const stock = getStock(room, d);
            const bk = getBooked(room, d);
            const status = classifyDay(stock, bk);
            ctx.fillStyle =
              status === "overbooked"
                ? "#dc2626"
                : status === "red"
                ? "#ef4444"
                : status === "yellow"
                ? "#d97706"
                : "#16a34a";

            ctx.fillText(label, bar.x, topY - 3);
          });
          ctx.restore();
        },
      },
    ],
  });
};

// ── Data loading ───────────────────────────────────────────────────────────────
const loadHotels = async () => {
  loadingHotels.value = true;
  try {
    const res = await hotelStore.getListAction({ allowment: 1 });
    allHotels.value = res.result.data || [];
  } catch (e) {
    console.error(e);
  } finally {
    loadingHotels.value = false;
  }
};

const loadRoomsForHotel = async (hotelId) => {
  loadingRooms.value = true;
  hotelRooms.value = [];
  selectedRoomId.value = null;
  selectedRoomName.value = "";
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  try {
    const today = new Date();
    const next = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const [r1, r2] = await Promise.all([
      roomStore.getListAction({
        hotel_id: hotelId,
        include_rates: true,
        year: today.getFullYear(),
        month: today.getMonth() + 1,
      }),
      roomStore.getListAction({
        hotel_id: hotelId,
        include_rates: true,
        year: next.getFullYear(),
        month: next.getMonth() + 1,
      }),
    ]);

    const rooms1 =
      r1.status === 1 ? r1.result.data.filter((r) => r.is_extra === 0) : [];
    const rooms2 =
      r2.status === 1 ? r2.result.data.filter((r) => r.is_extra === 0) : [];

    hotelRooms.value = rooms1.map((base) => {
      const extra = rooms2.find((x) => x.id === base.id);
      return {
        ...base,
        room_rates: {
          ...(base.room_rates || {}),
          ...(extra?.room_rates || {}),
        },
      };
    });

    // Update scroll state after rooms load
    await nextTick();
    updateScrollState();
    await nextTick();
    updateScrollState();
    const first = visibleRooms.value[0];
    if (first) {
      await selectRoom(first);
    }
  } catch (e) {
    console.error(e);
    hotelRooms.value = [];
  } finally {
    loadingRooms.value = false;
  }
};

const datePresets = [
  { label: "14d", days: 14 },
  { label: "30d", days: 30 },
  { label: "60d", days: 60 },
  { label: "90d", days: 90 },
];

const activeDays = computed(() => {
  if (!checkin.value || !checkout.value) return null;
  const diff = Math.round(
    (new Date(checkout.value) - new Date(checkin.value)) / 86400000,
  );
  return diff;
});

const applyPreset = (days) => {
  const today = new Date();
  const end = new Date(today);
  end.setDate(today.getDate() + days);
  checkin.value = fmtKey(today);
  checkout.value = fmtKey(end);
  if (selectedRoomId.value) buildChart();
};

// ── Interactions ───────────────────────────────────────────────────────────────
const selectHotel = async (hotel) => {
  if (selectedHotelId.value === hotel.id) return;
  selectedHotelId.value = hotel.id;
  selectedHotelName.value = hotel.name;
  await loadRoomsForHotel(hotel.id);
};

const selectRoom = async (room) => {
  selectedRoomId.value = room.id;
  selectedRoomName.value = room.name;
  await nextTick();
  await buildChart();
};

// onMounted(loadHotels);
onMounted(() => {
  // Set default range: today → today+30
  const today = new Date();
  const end = new Date(today);
  end.setDate(today.getDate() + 30);
  checkin.value = fmtKey(today);
  checkout.value = fmtKey(end);

  loadHotels().then(() => {
    // Auto-select hotel from ?id= query param
    const urlParams = new URLSearchParams(window.location.search);
    const hotelId = Number(urlParams.get("id"));
    if (hotelId) {
      const hotel = allHotels.value.find((h) => h.id === hotelId);
      if (hotel) selectHotel(hotel);
    }
  });
});

watch([checkin, checkout], async () => {
  if (selectedHotelId.value) {
    await loadRoomsForHotel(selectedHotelId.value);
  }
});
</script>

<style scoped>
/* Hide scrollbar on room strip */
div[ref="roomScrollRef"]::-webkit-scrollbar {
  display: none;
}
</style>
