<template>
  <div>
    <div class="">
      <!-- Search Filters -->
      <div class="flex justify-start items-center gap-x-4 mb-6">
        <div class="relative">
          <label class="text-xs text-gray-600 mb-1 block">Hotel</label>
          <input
            class="w-[190px] text-xs px-2 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
            type="search"
            placeholder="Search hotel..."
            v-model="search"
          />
          <div
            v-if="isSearching && hotelLists.length > 0"
            class="absolute shadow-lg bg-white py-2 top-[75px] min-w-[190px] max-h-[200px] overflow-y-auto space-y-1 border border-gray-200 rounded-lg z-50"
          >
            <div
              v-for="i in hotelLists"
              :key="i.id"
              @click="selectHotel(i)"
              class="px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <p class="text-xs font-medium">{{ i.name }}</p>
            </div>
          </div>
        </div>

        <div>
          <label class="text-xs text-gray-600 mb-1 block">Room Quantity</label>
          <input
            class="w-[120px] text-xs px-2 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
            type="number"
            min="1"
            placeholder="Qty"
            v-model.number="roomQuantity"
            :disabled="!hotel_id"
          />
        </div>

        <div>
          <label class="text-xs text-gray-600 mb-1 block">Check-in Date</label>
          <input
            class="w-[190px] text-xs px-2 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
            type="date"
            v-model="start_date"
          />
        </div>

        <div>
          <label class="text-xs text-gray-600 mb-1 block">Check-out Date</label>
          <input
            class="w-[190px] text-xs px-2 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
            type="date"
            v-model="end_date"
          />
        </div>

        <div class="flex items-end pt-5">
          <button
            :disabled="!hotel_id || !start_date || !end_date || !roomQuantity"
            @click="searchAllRooms"
            :class="[
              'text-xs px-4 py-3 rounded-lg text-white border transition-colors',
              !hotel_id || !start_date || !end_date || !roomQuantity
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-[#FF613c] hover:bg-[#FF4520] cursor-pointer',
            ]"
          >
            Search All Rooms
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="isLoadingRoomData"
        class="flex justify-center items-center h-[50vh]"
      >
        <div class="text-center">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF613c] mx-auto mb-4"
          ></div>
          <p class="text-sm text-gray-600">Loading room availability...</p>
        </div>
      </div>

      <!-- Results Display - All Rooms -->
      <div
        v-else-if="allRoomsData && allRoomsData.length > 0"
        class="space-y-4"
      >
        <div
          v-for="(roomData, index) in allRoomsData"
          :key="index"
          class="border border-gray-200 rounded-lg overflow-hidden"
        >
          <!-- Room Header -->
          <div
            @click="toggleRoomDropdown(index)"
            :class="[
              'bg-gradient-to-r from-gray-50 to-white p-4 cursor-pointer hover:from-gray-100 hover:to-gray-50 transition-all',
              roomData.isFullyBooked
                ? 'border-l-4 border-red-500'
                : 'border-l-4 border-green-500',
            ]"
          >
            <div class="flex justify-between items-center">
              <div class="flex-1">
                <div class="flex items-center gap-x-3">
                  <h3 class="text-sm font-semibold text-gray-800">
                    {{ roomData.room?.name }}
                  </h3>
                  <span
                    v-if="roomData.isFullyBooked"
                    class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full"
                  >
                    Fully Booked
                  </span>
                  <span
                    v-else
                    class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                  >
                    Available
                  </span>
                </div>
                <p class="text-xs text-gray-500 mt-1">
                  Base Price: ฿
                  {{ formatNumber(roomData.room?.room_price) }}
                </p>
              </div>

              <div class="flex items-center gap-x-6">
                <div class="text-right">
                  <p class="text-xs text-gray-600">
                    Total Selling ({{ roomQuantity }} rooms)
                  </p>
                  <p class="text-lg font-bold text-[#FF613c]">
                    ฿ {{ formatNumber(roomData.totalCost) }}
                  </p>
                </div>

                <svg
                  :class="[
                    'w-5 h-5 text-gray-600 transition-transform',
                    roomData.isExpanded ? 'transform rotate-180' : '',
                  ]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Room Details Dropdown - Split View -->
          <div
            v-show="roomData.isExpanded"
            class="p-4 bg-white border-t border-gray-200"
          >
            <div class="grid grid-cols-2 gap-6">
              <!-- Left Side - Table -->
              <div
                class="overflow-x-auto max-h-[60vh] overflow-y-auto border border-gray-200 rounded-lg"
              >
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th
                        class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                      >
                        Day
                      </th>
                      <th
                        class="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider"
                      >
                        Stock
                      </th>
                      <th
                        class="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider"
                      >
                        Booked
                      </th>
                      <th
                        class="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider"
                      >
                        Available
                      </th>
                      <th
                        class="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        class="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider"
                      >
                        Room Price (×{{ roomQuantity }})
                      </th>
                      <th
                        class="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider"
                      >
                        Cost (×{{ roomQuantity }})
                      </th>
                      <th
                        class="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider"
                      >
                        Discount
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                      v-for="(rateData, date) in roomData.room_rates"
                      :key="date"
                      :class="[
                        rateData.available_rooms < roomQuantity
                          ? 'bg-red-50'
                          : rateData.available_rooms <= roomQuantity + 2
                          ? 'bg-yellow-50'
                          : 'hover:bg-gray-50',
                      ]"
                      class="transition-colors"
                    >
                      <td
                        class="px-4 py-3 whitespace-nowrap text-xs text-gray-900 font-medium"
                      >
                        {{ formatDate(date) }}
                      </td>
                      <td
                        class="px-4 py-3 whitespace-nowrap text-xs text-gray-600"
                      >
                        {{ rateData.display_date.split(",")[0] }}
                      </td>
                      <td
                        class="px-4 py-3 whitespace-nowrap text-center text-xs text-gray-900"
                      >
                        {{ rateData.stock }}
                      </td>
                      <td
                        class="px-4 py-3 whitespace-nowrap text-center text-xs"
                      >
                        <span
                          :class="[
                            'px-2 py-1 rounded-full',
                            rateData.booked_count > 0
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-600',
                          ]"
                        >
                          {{ rateData.booked_count }}
                        </span>
                      </td>
                      <td
                        class="px-4 py-3 whitespace-nowrap text-center text-xs"
                      >
                        <span
                          :class="[
                            'px-2 py-1 rounded-full font-medium',
                            rateData.available_rooms < roomQuantity
                              ? 'bg-red-100 text-red-800'
                              : rateData.available_rooms <= roomQuantity + 2
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800',
                          ]"
                        >
                          {{ rateData.available_rooms }}
                        </span>
                      </td>
                      <td
                        class="px-4 py-3 whitespace-nowrap text-center text-xs"
                      >
                        <span
                          v-if="rateData.available_rooms < roomQuantity"
                          class="px-2 py-1 rounded-full bg-red-100 text-red-800 font-medium"
                        >
                          Insufficient
                        </span>
                        <span
                          v-else
                          class="px-2 py-1 rounded-full bg-green-100 text-green-800 font-medium"
                        >
                          OK
                        </span>
                      </td>
                      <td
                        class="px-4 py-3 whitespace-nowrap text-right text-xs text-gray-900"
                      >
                        ฿
                        {{ formatNumber(rateData.room_price * roomQuantity) }}
                      </td>
                      <td
                        class="px-4 py-3 whitespace-nowrap text-right text-xs font-bold text-[#FF613c]"
                      >
                        ฿
                        {{ formatNumber(roomData.room?.cost * roomQuantity) }}
                      </td>
                      <td
                        class="px-4 py-3 whitespace-nowrap text-center text-xs"
                      >
                        <span
                          v-if="rateData.discount > 0"
                          class="text-orange-600 font-medium"
                        >
                          {{ rateData.discount }}%
                        </span>
                        <span v-else class="text-gray-400">-</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Right Side - Graph -->
              <div
                class="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-gray-50 to-white"
              >
                <div class="mb-4">
                  <h3 class="text-sm font-bold text-gray-800">
                    {{ roomData.room?.name }} - Availability Overview
                  </h3>
                  <p class="text-xs text-gray-500 mt-1">
                    Daily room availability for the selected period
                  </p>
                </div>

                <div class="chart-container">
                  <canvas
                    :data-ref="'chartCanvas_' + index"
                    :id="'chartCanvas_' + index"
                  ></canvas>
                </div>

                <!-- Legend -->
                <div class="flex justify-center gap-4 mt-4">
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 bg-green-500 rounded"></div>
                    <span class="text-xs text-gray-600">Available</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 bg-[#FF613c] rounded"></div>
                    <span class="text-xs text-gray-600">Booked</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 bg-red-600 rounded"></div>
                    <span class="text-xs text-gray-600">Overbooked</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Alert for incomplete allotment -->
            <div
              v-if="roomData.is_incomplete_allotment"
              class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mt-4"
            >
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg
                    class="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-yellow-700 font-medium">
                    Warning: Incomplete allotment data detected
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="flex flex-col items-center justify-center h-[50vh] text-center"
      >
        <svg
          class="w-16 h-16 text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <p class="text-sm text-gray-600 mb-2">No data available</p>
        <p class="text-xs text-gray-500">
          Please select a hotel, room quantity, and date range to view
          availability
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import { useHotelStore } from "../../stores/hotel";
import { useRoomV2Store } from "../../stores/roomV2";
import debounce from "lodash/debounce";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["closeModal"]);

const hotelStore = useHotelStore();
const roomV2Store = useRoomV2Store();

const search = ref("");
const isSearching = ref(false);
const hotel_id = ref("");
const rooms = ref([]);
const hotelLists = ref([]);
const start_date = ref("");
const end_date = ref("");
const roomQuantity = ref(1);
const allRoomsData = ref([]);
const isLoadingRoomData = ref(false);
const chartInstances = ref({});

const hotelSearch = async () => {
  let data = {
    search: search.value,
    allowment: 1,
  };
  const res = await hotelStore.getListAction(data);
  hotelLists.value = res.result.data.filter((item) => item.allowment == true);
  isSearching.value = true;
};

const searchAllRooms = async () => {
  if (
    !hotel_id.value ||
    !start_date.value ||
    !end_date.value ||
    !roomQuantity.value
  ) {
    return;
  }

  isLoadingRoomData.value = true;
  allRoomsData.value = [];

  try {
    const roomPromises = rooms.value.map(async (room) => {
      let data = {
        checkin_date: start_date.value,
        checkout_date: end_date.value,
      };
      const res = await roomV2Store.getRoomPeriod(data, room.id);

      if (res.status === 1 && res.data) {
        let totalCost = 0;
        let isFullyBooked = false;

        for (const [date, rateData] of Object.entries(res.data.room_rates)) {
          totalCost += rateData.current_price * roomQuantity.value;

          if (rateData.available_rooms < roomQuantity.value) {
            isFullyBooked = true;
          }
        }

        return {
          ...res.data,
          totalCost: totalCost,
          isFullyBooked: isFullyBooked,
          isExpanded: false,
        };
      }
      return null;
    });

    const results = await Promise.all(roomPromises);
    allRoomsData.value = results.filter((item) => item !== null);

    console.log("All Rooms Data:", allRoomsData.value);
  } catch (error) {
    console.error("Error fetching room periods:", error);
  } finally {
    isLoadingRoomData.value = false;
  }
};

const toggleRoomDropdown = async (index) => {
  allRoomsData.value[index].isExpanded = !allRoomsData.value[index].isExpanded;

  if (allRoomsData.value[index].isExpanded) {
    await nextTick();
    createChart(index);
  } else {
    // Destroy chart when closing
    if (chartInstances.value[index]) {
      chartInstances.value[index].destroy();
      delete chartInstances.value[index];
    }
  }
};

const createChart = (index) => {
  const roomData = allRoomsData.value[index];
  const canvasId = `chartCanvas_${index}`;

  // Wait a bit for DOM to be ready
  setTimeout(() => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.error(`Canvas not found for index ${index}`);
      return;
    }

    const ctx = canvas.getContext("2d");

    // Destroy existing chart
    if (chartInstances.value[index]) {
      chartInstances.value[index].destroy();
    }

    // Prepare data from room_rates
    const dates = Object.keys(roomData.room_rates).sort();
    const labels = dates.map((date) => formatDateShort(date));
    const availableData = [];
    const bookedData = [];
    const overflowData = [];

    dates.forEach((date) => {
      const rateData = roomData.room_rates[date];
      const stock = rateData.stock || 0;
      const booked = rateData.booked_count || 0;

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

    // Calculate max value for y-axis
    const maxValue = Math.max(
      ...dates.map((date) => {
        const rateData = roomData.room_rates[date];
        return Math.max(rateData.stock || 0, rateData.booked_count || 0);
      })
    );
    const yAxisMax = Math.ceil(maxValue * 1.15) + 2;

    chartInstances.value[index] = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Available",
            data: availableData,
            backgroundColor: "#22c55e",
            borderWidth: 0,
            barThickness: 20,
          },
          {
            label: "Booked",
            data: bookedData,
            backgroundColor: "#FF613c",
            borderWidth: 0,
            barThickness: 20,
          },
          {
            label: "Overbooked",
            data: overflowData,
            backgroundColor: "#dc2626",
            borderWidth: 0,
            barThickness: 20,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.5,
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
            display: false,
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
              size: 11,
            },
            titleFont: {
              size: 12,
              weight: "bold",
            },
            callbacks: {
              title: function (context) {
                const dateIndex = context[0].dataIndex;
                const date = dates[dateIndex];
                return formatDateLong(date);
              },
              footer: function (tooltipItems) {
                const dateIndex = tooltipItems[0].dataIndex;
                const date = dates[dateIndex];
                const rateData = roomData.room_rates[date];
                const stock = rateData.stock || 0;
                const booked = rateData.booked_count || 0;

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
    });
  }, 100);
};

const formatNumber = (value) => {
  if (!value) return "0";
  return parseFloat(value).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

const formatDateShort = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const formatDateLong = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const selectHotel = (data) => {
  search.value = data.name;
  hotel_id.value = data.id;
  rooms.value = data.rooms;
  isSearching.value = false;
  allRoomsData.value = [];
};

const closeModal = () => {
  emit("closeModal");
};

watch(
  search,
  debounce(async (newValue) => {
    await hotelSearch();
  }, 500)
);
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 350px;
}

canvas {
  max-width: 100%;
  height: auto !important;
}
</style>
