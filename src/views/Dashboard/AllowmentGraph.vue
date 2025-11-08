<template>
  <div class="allowment-graph-container">
    <!-- Header -->
    <div class="mb-6">
      <h2
        class="text-xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"
      >
        Room Availability Overview
      </h2>
      <p class="text-slate-600 text-xs mt-1">
        Daily availability for selected room
      </p>
    </div>

    <!-- Filters Row -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div class="flex items-end gap-4 flex-wrap">
        <!-- Hotel Search Button (triggers modal) -->
        <div class="relative flex-1 min-w-[200px]">
          <label class="text-xs font-medium text-gray-700 mb-1.5 block">
            Hotel
          </label>
          <button
            @click="openModal"
            class="w-full text-sm px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-colors text-left flex items-center justify-between hover:bg-gray-50"
          >
            <span
              :class="selectedHotelName ? 'text-gray-900' : 'text-gray-400'"
            >
              {{ selectedHotelName || "Search hotel..." }}
            </span>
            <svg
              class="w-4 h-4 text-gray-400"
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
          </button>
        </div>

        <!-- Month Selector -->
        <div class="min-w-[140px]">
          <label class="text-xs font-medium text-gray-700 mb-1.5 block">
            Month
          </label>
          <select
            v-model="selectedMonth"
            @change="onPeriodChange"
            class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white font-medium text-slate-700"
          >
            <option
              v-for="month in monthOptions"
              :key="month.value"
              :value="month.value"
            >
              {{ month.label }}
            </option>
          </select>
        </div>

        <!-- Year Selector -->
        <div class="min-w-[120px]">
          <label class="text-xs font-medium text-gray-700 mb-1.5 block">
            Year
          </label>
          <select
            v-model="selectedYear"
            @change="onPeriodChange"
            class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white font-medium text-slate-700"
          >
            <option v-for="year in yearOptions" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>

        <!-- Room Selector -->
        <div class="flex-1 min-w-[200px]">
          <label class="text-xs font-medium text-gray-700 mb-1.5 block">
            Room Type
          </label>
          <select
            v-model="selectedRoomId"
            @change="onRoomChange"
            :disabled="!selectedHotelId"
            class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white font-medium text-slate-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option v-for="room in rooms" :key="room.id" :value="room.id">
              {{ room.name }}
            </option>
          </select>
        </div>

        <!-- Stats Display -->
        <div class="bg-orange-50 px-4 py-2 rounded-lg border border-orange-200">
          <p class="text-xs text-orange-600 font-medium">
            {{ dates.length }} days
          </p>
          <p class="text-xs text-orange-500">in period</p>
        </div>
      </div>

      <!-- Selected Hotel Info -->
      <div
        v-if="selectedHotelId && selectedHotelName"
        class="mt-3 pt-3 border-t border-gray-100"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <p class="text-xs text-gray-600">
              Selected:
              <span class="font-semibold text-gray-900">{{
                selectedHotelName
              }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Area -->
    <div class="chart-wrapper" v-if="!loading && rooms.length > 0">
      <canvas ref="chartCanvas"></canvas>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="text-center py-12">
      <div class="inline-block">
        <div
          class="w-10 h-10 border-3 border-orange-200 border-t-orange-600 rounded-full animate-spin"
        ></div>
      </div>
      <p class="text-slate-600 mt-4 text-sm font-medium">
        Loading chart data...
      </p>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg
        class="w-16 h-16 mx-auto text-slate-300 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        ></path>
      </svg>
      <p class="text-slate-600 font-medium">No room data available</p>
      <p class="text-slate-400 text-sm mt-1">
        Please select a hotel to see availability
      </p>
    </div>

    <!-- Hotel Selection Modal -->
    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="closeModal"
      >
        <div
          class="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col"
        >
          <!-- Modal Header -->
          <div
            class="px-6 py-4 border-b border-gray-200 flex items-center justify-between"
          >
            <h3 class="text-lg font-bold text-gray-900">Select Hotel</h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Search Input -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="relative">
              <input
                ref="modalSearchInput"
                class="w-full text-sm px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-colors"
                type="search"
                placeholder="Search hotel by name..."
                v-model="modalSearch"
                @input="onModalSearchInput"
              />
              <svg
                class="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
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
            </div>
          </div>

          <!-- Hotel List -->
          <div class="flex-1 overflow-y-auto p-6">
            <div
              v-if="isSearchingHotels && hotelLists.length === 0"
              class="text-center py-8"
            >
              <div class="inline-block">
                <div
                  class="w-8 h-8 border-3 border-orange-200 border-t-orange-600 rounded-full animate-spin"
                ></div>
              </div>
              <p class="text-sm text-gray-600 mt-3">Loading hotels...</p>
            </div>

            <div
              v-else-if="filteredHotels.length === 0"
              class="text-center py-8"
            >
              <svg
                class="w-16 h-16 mx-auto text-gray-300 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <p class="text-sm font-medium text-gray-700">No hotels found</p>
              <p class="text-xs text-gray-500 mt-1">
                Try a different search term
              </p>
            </div>

            <div v-else class="space-y-2">
              <div
                v-for="hotel in filteredHotels"
                :key="hotel.id"
                @click="selectHotel(hotel)"
                :class="[
                  'p-4 rounded-lg border-2 cursor-pointer transition-all',
                  tempSelectedHotelId === hotel.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50',
                ]"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <p class="text-sm font-bold text-gray-900">
                        {{ hotel.name }}
                      </p>
                      <span
                        v-if="tempSelectedHotelId === hotel.id"
                        class="px-2 py-0.5 text-xs font-semibold bg-orange-500 text-white rounded-full"
                      >
                        Selected
                      </span>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">
                      {{ hotel.rooms?.length || 0 }} room type{{
                        hotel.rooms?.length !== 1 ? "s" : ""
                      }}
                      available
                    </p>
                  </div>
                  <svg
                    v-if="tempSelectedHotelId === hotel.id"
                    class="w-6 h-6 text-orange-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div
            class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3"
          >
            <button
              @click="closeModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="confirmSelection"
              :disabled="!tempSelectedHotelId"
              :class="[
                'px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors',
                tempSelectedHotelId
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
                  : 'bg-gray-300 cursor-not-allowed',
              ]"
            >
              Confirm Selection
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from "vue";
import { Chart, registerables } from "chart.js";
import { useRoomStore } from "../../stores/room";
import { useHotelStore } from "../../stores/hotel";
import debounce from "lodash/debounce";

Chart.register(...registerables);

const roomStore = useRoomStore();
const hotelStore = useHotelStore();

const chartCanvas = ref(null);
let chartInstance = null;
const rooms = ref([]);
const loading = ref(false);
const selectedRoomId = ref(null);
const selectedMonth = ref(new Date().getMonth() + 1);
const selectedYear = ref(new Date().getFullYear());

// Hotel selection state
const selectedHotelId = ref(47);
const selectedHotelName = ref("");
const isModalOpen = ref(false);
const modalSearch = ref("");
const modalSearchInput = ref(null);
const isSearchingHotels = ref(false);
const hotelLists = ref([]);
const allHotels = ref([]);
const tempSelectedHotelId = ref(null);
const tempSelectedHotelName = ref("");

const monthOptions = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear();
  return [currentYear - 1, currentYear, currentYear + 1, currentYear + 2];
});

const filteredHotels = computed(() => {
  if (!modalSearch.value.trim()) {
    return allHotels.value.filter((item) => item.allowment == 1);
  }
  return hotelLists.value.filter((item) => item.allowment == 1);
});

const dates = computed(() => {
  if (rooms.value.length === 0) return [];

  const currentYear = selectedYear.value;
  const currentMonth = selectedMonth.value - 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isCurrentMonth =
    currentYear === today.getFullYear() && currentMonth === today.getMonth();

  const dateKeysSet = new Set();

  rooms.value.forEach((room) => {
    if (room.room_rates && typeof room.room_rates === "object") {
      Object.keys(room.room_rates).forEach((dateKey) => {
        try {
          const dateObj = new Date(dateKey + "T00:00:00");
          const isValidDate =
            dateObj.getFullYear() === currentYear &&
            dateObj.getMonth() === currentMonth &&
            (!isCurrentMonth || dateObj >= today);

          if (isValidDate) {
            dateKeysSet.add(dateKey);
          }
        } catch (error) {
          console.warn("Invalid date key:", dateKey);
        }
      });
    }
  });

  if (dateKeysSet.size === 0) {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const startDay = isCurrentMonth ? today.getDate() : 1;

    for (let day = startDay; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      dateKeysSet.add(formatDateKey(date));
    }
  }

  return Array.from(dateKeysSet)
    .sort()
    .map((dateKey) => new Date(dateKey + "T00:00:00"));
});

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getRoomStock = (room, date) => {
  const dateKey = formatDateKey(date);
  if (room.room_rates && room.room_rates[dateKey]) {
    const rateData = room.room_rates[dateKey];
    if (rateData.stock !== undefined && rateData.stock !== null) {
      return rateData.stock;
    }
  }
  if (room.meta && room.meta.stock !== undefined && room.meta.stock !== null) {
    return room.meta.stock;
  }
  return 0;
};

const getBookedCount = (room, date) => {
  const dateKey = formatDateKey(date);
  if (room.room_rates && room.room_rates[dateKey]) {
    return room.room_rates[dateKey].booked_count || 0;
  }
  return 0;
};

const chartData = computed(() => {
  const selectedRoom = rooms.value.find((r) => r.id === selectedRoomId.value);
  if (!selectedRoom)
    return {
      labels: [],
      availableData: [],
      bookedData: [],
      overflowData: [],
    };

  const labels = dates.value.map((date) => formatDateShort(date));
  const availableData = [];
  const bookedData = [];
  const overflowData = [];

  dates.value.forEach((date) => {
    const stock = getRoomStock(selectedRoom, date);
    const booked = getBookedCount(selectedRoom, date);

    if (booked <= stock) {
      availableData.push(stock - booked);
      bookedData.push(booked);
      overflowData.push(0);
    } else {
      availableData.push(0);
      bookedData.push(stock);
      overflowData.push(booked - stock);
    }
  });

  return {
    labels,
    availableData,
    bookedData,
    overflowData,
  };
});

const formatDateShort = (date) => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

// Hotel Modal Functions
const openModal = () => {
  isModalOpen.value = true;
  tempSelectedHotelId.value = selectedHotelId.value;
  tempSelectedHotelName.value = selectedHotelName.value;
  modalSearch.value = "";

  nextTick(() => {
    modalSearchInput.value?.focus();
  });
};

const closeModal = () => {
  isModalOpen.value = false;
  modalSearch.value = "";
};

const loadAllHotels = async () => {
  isSearchingHotels.value = true;

  let data = {
    allowment: 1,
  };

  try {
    const res = await hotelStore.getListAction(data);
    allHotels.value = res.result.data || [];
    hotelLists.value = allHotels.value;

    // Set initial hotel name if ID is 47
    if (selectedHotelId.value === 47 && allHotels.value.length > 0) {
      const defaultHotel = allHotels.value.find((h) => h.id === 47);
      if (defaultHotel) {
        selectedHotelName.value = defaultHotel.name;
      }
    }
  } catch (error) {
    console.error("Error loading hotels:", error);
    allHotels.value = [];
    hotelLists.value = [];
  } finally {
    isSearchingHotels.value = false;
  }
};

const hotelSearch = async () => {
  if (!modalSearch.value.trim()) {
    hotelLists.value = allHotels.value;
    return;
  }

  isSearchingHotels.value = true;

  let data = {
    search: modalSearch.value,
    allowment: 1,
  };

  try {
    const res = await hotelStore.getListAction(data);
    hotelLists.value = res.result.data || [];
  } catch (error) {
    console.error("Error searching hotels:", error);
    hotelLists.value = allHotels.value;
  } finally {
    isSearchingHotels.value = false;
  }
};

const onModalSearchInput = debounce(() => {
  hotelSearch();
}, 500);

const selectHotel = (hotel) => {
  tempSelectedHotelId.value = hotel.id;
  tempSelectedHotelName.value = hotel.name;
};

const confirmSelection = async () => {
  if (tempSelectedHotelId.value) {
    selectedHotelId.value = tempSelectedHotelId.value;
    selectedHotelName.value = tempSelectedHotelName.value;
    closeModal();

    // Reload room data for the new hotel
    await loadRoomData();
    createChart();
  }
};

const createChart = () => {
  if (!chartCanvas.value) return;

  const ctx = chartCanvas.value.getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  const selectedRoom = rooms.value.find((r) => r.id === selectedRoomId.value);
  let maxValue = 0;

  dates.value.forEach((date) => {
    const stock = getRoomStock(selectedRoom, date);
    const booked = getBookedCount(selectedRoom, date);
    maxValue = Math.max(maxValue, stock, booked);
  });

  const yAxisMax = Math.ceil(maxValue * 1.15) + 2;

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: chartData.value.labels,
      datasets: [
        {
          label: "Available",
          data: chartData.value.availableData,
          backgroundColor: "#22c55e",
          borderWidth: 0,
          barThickness: 30,
        },
        {
          label: "Booked",
          data: chartData.value.bookedData,
          backgroundColor: "#ff6347",
          borderWidth: 0,
          barThickness: 30,
        },
        {
          label: "Overbooked",
          data: chartData.value.overflowData,
          backgroundColor: "#dc2626",
          borderWidth: 0,
          barThickness: 30,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 3.5,
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            font: {
              size: 9,
              weight: "600",
            },
            color: "#334155",
            maxRotation: 45,
            minRotation: 45,
            padding: 8,
          },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          max: yAxisMax > 0 ? yAxisMax : 10,
          grid: {
            color: "rgba(148, 163, 184, 0.1)",
            drawBorder: false,
          },
          ticks: {
            callback: function (value) {
              return Math.round(value);
            },
            font: {
              size: 10,
              weight: "500",
            },
            color: "#64748b",
            stepSize: Math.max(1, Math.ceil(yAxisMax / 8)),
          },
          title: {
            display: true,
            text: "Number of Rooms",
            font: {
              size: 11,
              weight: "500",
            },
            color: "#64748b",
          },
        },
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 12,
            boxHeight: 12,
            padding: 15,
            font: {
              size: 11,
              weight: "600",
            },
            color: "#334155",
            usePointStyle: false,
          },
        },
        tooltip: {
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          borderColor: "rgba(148, 163, 184, 0.2)",
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          displayColors: true,
          bodyFont: {
            size: 12,
          },
          titleFont: {
            size: 13,
            weight: "bold",
          },
          callbacks: {
            title: function (context) {
              const dateIndex = context[0].dataIndex;
              const date = dates.value[dateIndex];
              return date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              });
            },
            footer: function (tooltipItems) {
              const index = tooltipItems[0].dataIndex;
              const selectedRoom = rooms.value.find(
                (r) => r.id === selectedRoomId.value
              );
              const date = dates.value[index];
              const stock = getRoomStock(selectedRoom, date);
              const booked = getBookedCount(selectedRoom, date);

              return [
                `\nTotal Stock: ${stock}`,
                `Total Booked: ${booked}`,
                `Available: ${Math.max(0, stock - booked)}`,
              ];
            },
          },
        },
      },
    },
    plugins: [
      {
        id: "customLabels",
        afterDatasetsDraw: function (chart) {
          const ctx = chart.ctx;
          ctx.save();

          chart.data.labels.forEach((label, index) => {
            const selectedRoom = rooms.value.find(
              (r) => r.id === selectedRoomId.value
            );
            const date = dates.value[index];
            const stock = getRoomStock(selectedRoom, date);
            const booked = getBookedCount(selectedRoom, date);
            const displayValue = Math.max(stock, booked);

            if (displayValue === 0) return;

            const availableMeta = chart.getDatasetMeta(0);
            const bookedMeta = chart.getDatasetMeta(1);
            const overflowMeta = chart.getDatasetMeta(2);

            const topBar =
              overflowMeta.data[index] &&
              chartData.value.overflowData[index] > 0
                ? overflowMeta.data[index]
                : bookedMeta.data[index] &&
                  chartData.value.bookedData[index] > 0
                ? bookedMeta.data[index]
                : availableMeta.data[index];

            if (topBar) {
              const x = topBar.x;
              const y = topBar.y - 8;

              ctx.fillStyle = "#1e293b";
              ctx.font = `bold 10px sans-serif`;
              ctx.textAlign = "center";
              ctx.textBaseline = "bottom";
              ctx.fillText(displayValue, x, y);
            }
          });

          ctx.restore();
        },
      },
    ],
  });
};

const onRoomChange = () => {
  createChart();
};

const onPeriodChange = async () => {
  await loadRoomData();
  createChart();
};

const loadRoomData = async () => {
  if (!selectedHotelId.value) return;

  loading.value = true;
  try {
    const res = await roomStore.getListAction({
      hotel_id: selectedHotelId.value,
      include_rates: true,
      year: selectedYear.value,
      month: selectedMonth.value,
    });

    if (res.status === 1) {
      rooms.value = res.result.data.filter((room) => room.is_extra === 0);

      if (rooms.value.length > 0) {
        selectedRoomId.value = rooms.value[0].id;
      } else {
        selectedRoomId.value = null;
      }
    }
  } catch (error) {
    console.error("Error loading room data:", error);
    rooms.value = [];
    selectedRoomId.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadAllHotels();
  await loadRoomData();
  createChart();
});

watch(
  () => [rooms.value, dates.value],
  () => {
    if (rooms.value.length > 0) {
      createChart();
    }
  },
  { deep: true }
);
</script>

<style scoped>
.allowment-graph-container {
  width: 100%;
}

.chart-wrapper {
  position: relative;
  width: 100%;
  max-width: 100%;
  background: linear-gradient(135deg, #f8fafc 0%, #fff5f0 100%);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

canvas {
  max-width: 100%;
  height: auto !important;
}

/* Custom scrollbar for modal */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
