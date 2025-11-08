<template>
  <div class="allowment-search-container">
    <!-- Header -->
    <div class="mb-6">
      <h2
        class="text-xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"
      >
        Room Availability Search
      </h2>
      <p class="text-slate-600 text-xs mt-1">
        Search and compare room availability across multiple room types
      </p>
    </div>

    <SharedSearchFilters
      :show-room-quantity="true"
      :show-search-button="true"
      v-model:room-quantity="roomQuantity"
      v-model:check-in-date="start_date"
      v-model:check-out-date="end_date"
      :selectedHotelId="sharedHotelId"
      :selectedHotelName="sharedHotelName"
      @hotel-selected="handleHotelSelected"
      @search="searchAllRooms"
    />

    <!-- Loading State -->
    <div
      v-if="isLoadingRoomData"
      class="flex justify-center items-center h-[40vh]"
    >
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"
        ></div>
        <p class="text-sm text-gray-600 font-medium">
          Loading room availability...
        </p>
      </div>
    </div>

    <!-- Results Display - Compact Cards -->
    <div v-else-if="allRoomsData && allRoomsData.length > 0" class="space-y-3">
      <div
        v-for="(roomData, index) in allRoomsData"
        :key="index"
        class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
      >
        <!-- Compact Room Header -->
        <div
          @click="toggleRoomDropdown(index)"
          :class="[
            'p-3 cursor-pointer transition-all flex items-center justify-between',
            roomData.isFullyBooked
              ? 'bg-red-50 border-l-4 border-red-500'
              : 'bg-green-50 border-l-4 border-green-500',
          ]"
        >
          <div class="flex items-center gap-3 flex-1">
            <!-- Room Icon -->
            <div
              :class="[
                'w-10 h-10 rounded-lg flex items-center justify-center',
                roomData.isFullyBooked ? 'bg-red-100' : 'bg-green-100',
              ]"
            >
              <svg
                class="w-5 h-5"
                :class="
                  roomData.isFullyBooked ? 'text-red-600' : 'text-green-600'
                "
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>

            <!-- Room Info -->
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-bold text-gray-900">
                  {{ roomData.room?.name }}
                </h3>
                <span
                  v-if="roomData.isFullyBooked"
                  class="px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-700 rounded-full"
                >
                  Fully Booked
                </span>
                <span
                  v-else
                  class="px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded-full"
                >
                  Available
                </span>
              </div>
              <p class="text-xs text-gray-500 mt-0.5">
                Base Price: ฿{{ formatNumber(roomData.room?.room_price) }}
              </p>
            </div>

            <!-- Price Display -->
            <div class="text-right mr-4">
              <p class="text-xs text-gray-500">
                Total ({{ roomQuantity }} room{{ roomQuantity > 1 ? "s" : "" }})
              </p>
              <p class="text-lg font-black text-orange-600">
                ฿{{ formatNumber(roomData.totalCost) }}
              </p>
            </div>

            <!-- Expand Icon -->
            <svg
              :class="[
                'w-5 h-5 text-gray-500 transition-transform',
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

        <!-- Expandable Details -->
        <div v-show="roomData.isExpanded" class="p-4 bg-gray-50 border-t">
          <!-- Table -->
          <div
            class="overflow-x-auto max-h-[50vh] overflow-y-auto border border-gray-200 rounded-lg bg-white"
          >
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th
                    class="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase"
                  >
                    Date
                  </th>
                  <th
                    class="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase"
                  >
                    Day
                  </th>
                  <th
                    class="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase"
                  >
                    Stock
                  </th>
                  <th
                    class="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase"
                  >
                    Booked
                  </th>
                  <th
                    class="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase"
                  >
                    Available
                  </th>
                  <th
                    class="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase"
                  >
                    Status
                  </th>
                  <th
                    class="px-3 py-2 text-right text-xs font-semibold text-gray-700 uppercase"
                  >
                    Price (×{{ roomQuantity }})
                  </th>
                  <th
                    class="px-3 py-2 text-right text-xs font-semibold text-gray-700 uppercase"
                  >
                    Cost (×{{ roomQuantity }})
                  </th>
                  <th
                    class="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase"
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
                    class="px-3 py-2 whitespace-nowrap text-xs text-gray-900 font-medium"
                  >
                    {{ formatDate(date) }}
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                    {{ rateData.display_date.split(",")[0] }}
                  </td>
                  <td
                    class="px-3 py-2 whitespace-nowrap text-center text-xs text-gray-900 font-medium"
                  >
                    {{ rateData.stock }}
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-center text-xs">
                    <span
                      :class="[
                        'px-2 py-0.5 rounded-full font-medium',
                        rateData.booked_count > 0
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-600',
                      ]"
                    >
                      {{ rateData.booked_count }}
                    </span>
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-center text-xs">
                    <span
                      :class="[
                        'px-2 py-0.5 rounded-full font-semibold',
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
                  <td class="px-3 py-2 whitespace-nowrap text-center text-xs">
                    <span
                      v-if="rateData.available_rooms < roomQuantity"
                      class="px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-semibold text-xs"
                    >
                      Insufficient
                    </span>
                    <span
                      v-else
                      class="px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-semibold text-xs"
                    >
                      OK
                    </span>
                  </td>
                  <td
                    class="px-3 py-2 whitespace-nowrap text-right text-xs text-gray-900 font-medium"
                  >
                    ฿{{ formatNumber(rateData.room_price * roomQuantity) }}
                  </td>
                  <td
                    class="px-3 py-2 whitespace-nowrap text-right text-xs font-bold text-orange-600"
                  >
                    ฿{{ formatNumber(roomData.room?.cost * roomQuantity) }}
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-center text-xs">
                    <span
                      v-if="rateData.discount > 0"
                      class="text-orange-600 font-semibold"
                    >
                      {{ rateData.discount }}%
                    </span>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Alert for incomplete allotment -->
          <div
            v-if="roomData.is_incomplete_allotment"
            class="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded mt-3"
          >
            <div class="flex items-start">
              <svg
                class="h-5 w-5 text-yellow-400 mt-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <div class="ml-2">
                <p class="text-xs text-yellow-700 font-semibold">
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
      class="flex flex-col items-center justify-center h-[40vh] text-center bg-white rounded-lg border-2 border-dashed border-gray-300"
    >
      <div
        class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"
      >
        <svg
          class="w-8 h-8 text-gray-400"
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
      </div>
      <p class="text-sm font-semibold text-gray-700 mb-1">No data available</p>
      <p class="text-xs text-gray-500">
        Select a hotel, room quantity, and date range to view availability
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoomV2Store } from "../../stores/roomV2";
import SharedSearchFilters from "./SharedSearchFilters.vue";
import { useSharedHotel } from "./composables/useSharedHotel";

const { sharedHotelId, sharedHotelName, setHotel } = useSharedHotel();

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["closeModal"]);

const roomV2Store = useRoomV2Store();

const rooms = ref([]);
const start_date = ref("");
const end_date = ref("");
const hotel_id = ref("");
const roomQuantity = ref(1);
const allRoomsData = ref([]);
const isLoadingRoomData = ref(false);

const handleHotelSelected = (hotel) => {
  setHotel(hotel.id, hotel.name); // Update shared state
  rooms.value = hotel.rooms;
  hotel_id.value = hotel.id;
  allRoomsData.value = [];
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

const toggleRoomDropdown = (index) => {
  allRoomsData.value[index].isExpanded = !allRoomsData.value[index].isExpanded;
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
  return `${months[date.getMonth()]} ${date.getDate()}`;
};

const closeModal = () => {
  emit("closeModal");
};
</script>

<style scoped>
.allowment-search-container {
  width: 100%;
}

/* Custom scrollbar for table */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
  height: 6px;
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
