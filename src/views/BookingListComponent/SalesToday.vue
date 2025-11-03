<template>
  <div class="flex justify-start items-center gap-x-4">
    <div
      class="bg-[#FF613c] border-l-4 border-[#FF613c] shadow gap-x-4 rounded-l-lg px-4 py-2 flex justify-between items-center relative overflow-hidden"
      @click="showModal = !showModal"
    >
      <!-- Background fill based on progress -->
      <div class="absolute top-0 left-0 bottom-0 bg-[#FF613c] z-0"></div>

      <!-- Content (on top of the fill) -->
      <div class="space-y-2 z-10 relative cursor-pointer">
        <p class="text-xs">Allowment</p>
        <p class="text-2xl text-white font-semibold">Check</p>
      </div>
    </div>
    <div
      v-if="authStore.isSuperAdmin"
      class="bg-white group relative border-l-4 border-[#FF613c] shadow gap-x-4 rounded-r-lg px-4 py-2 flex justify-between items-center"
    >
      <div class="space-y-2">
        <p class="text-xs">For Super Admin</p>
        <p class="text-2xl text-black font-semibold">
          {{ !createdByName ? "select user" : createdByName }}
        </p>
      </div>

      <div
        class="hidden group-hover:block absolute -bottom-[260px] p-4 bg-white left-0 w-full max-h-[400px] z-30"
      >
        <div class="space-y-2">
          <div class="flex gap-x-2 items-center w-full">
            <input
              type="checkbox"
              @click="createdByName = ''"
              :checked="createdByName == ''"
              class="w-4 h-4 text-[#FF5B00] border-gray-300 rounded focus:ring-[#FF5B00] cursor-pointer"
            />
            <p class="text-[11px] whitespace-nowrap font-medium">none</p>
          </div>
          <div
            class="flex gap-x-2 items-center w-full"
            v-for="admin in adminLists"
            :key="admin.id"
          >
            <input
              type="checkbox"
              @click="
                () => {
                  createdByName = admin.name;
                  createdBy = admin.id;
                  targetAmount = admin.target_amount;
                }
              "
              :checked="admin.name == createdByName"
              class="w-4 h-4 text-[#FF5B00] border-gray-300 rounded focus:ring-[#FF5B00] cursor-pointer"
            />
            <p class="text-[11px] whitespace-nowrap font-medium">
              {{ admin.name }}
            </p>
          </div>
        </div>
      </div>
      <div class="w-10 h-10"></div>
    </div>
    <!-- <AvgCard
      :title="'Daily Avg. Sales'"
      :value="monthlyAvgSaleTotal"
      :is_value="true"
      :is_show="true"
    /> -->
    <div
      class="bg-white border-l-4 border-[#FF613c] shadow gap-x-4 rounded-r-lg px-4 py-2 flex justify-between items-center relative overflow-hidden"
    >
      <!-- Background fill based on progress -->
      <div
        class="absolute top-0 left-0 bottom-0 bg-[#FF613c]/20 z-0"
        :style="{
          width: `${Math.min((monthlyAvgSaleTotal / average) * 100, 100)}%`,
        }"
      ></div>

      <!-- Content (on top of the fill) -->
      <div class="space-y-2 z-10 relative">
        <p class="text-xs">Daily Avg. Sales</p>
        <p class="text-2xl text-black font-semibold">
          ฿ {{ monthlyAvgSaleTotal ? monthlyAvgSaleTotal : 0 }}
        </p>
      </div>

      <div class="w-10 h-10 z-10 relative flex items-center justify-center">
        <span
          class="text-xs font-medium text-gray-600"
          v-if="monthlyAvgSaleTotal > 0 && average > 0"
          >{{ Math.round((monthlyAvgSaleTotal / average) * 100) }}%</span
        >
      </div>
    </div>
    <AvgCard
      :title="'Daily Avg. Booking'"
      :value="monthlyAvgBookingCount"
      :is_value="false"
    />
    <div
      class="bg-white border-l-4 border-[#FF613c] shadow gap-x-4 rounded-r-lg px-4 py-2 flex justify-between items-center relative overflow-hidden"
    >
      <!-- Background fill based on progress -->
      <div
        class="absolute top-0 left-0 bottom-0 bg-[#FF613c]/20 z-0"
        :style="{
          width: `${Math.min((saleToday / average) * 100, 100)}%`,
        }"
      ></div>

      <!-- Content (on top of the fill) -->
      <div class="space-y-2 z-10 relative">
        <p class="text-xs">Sales Today</p>
        <p class="text-2xl text-black font-semibold">
          ฿ {{ saleToday ? saleToday : 0 }}
        </p>
      </div>

      <div class="w-10 h-10 z-10 relative flex items-center justify-center">
        <span class="text-xs font-medium text-gray-600" v-if="saleToday > 0"
          >{{ Math.round((saleToday / average) * 100) }}%</span
        >
      </div>
    </div>

    <div
      class="bg-white border-l-4 border-[#FF613c] shadow gap-x-4 rounded-r-lg px-4 py-2 flex justify-between items-center relative overflow-hidden"
    >
      <!-- Background fill based on progress -->
      <div
        class="absolute top-0 left-0 bottom-0 bg-[#FF613c]/20 z-0"
        :style="{
          width: `${Math.min(
            (saleCount / monthlyAvgBookingCount) * 100,
            100
          )}%`,
        }"
      ></div>

      <!-- Content (on top of the fill) -->
      <div class="space-y-2 z-10 relative">
        <p class="text-xs">Bookings Today</p>
        <p class="text-2xl text-black font-semibold">
          {{ saleCount ? saleCount : 0 }}
        </p>
      </div>

      <div class="w-10 h-10 z-10 relative flex items-center justify-center">
        <span class="text-xs font-medium text-gray-600" v-if="saleCount > 0"
          >{{ Math.round((saleCount / monthlyAvgBookingCount) * 100) }}%</span
        >
      </div>
    </div>

    <Modal :isOpen="showModal" @closeModal="showModal = false">
      <DialogPanel
        class="w-full max-w-6xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-2 px-4"
        >
          <p>Check Allotment</p>
          <XCircleIcon
            class="w-5 h-5 text-white cursor-pointer"
            @click="showModal = false"
          />
        </DialogTitle>

        <div class="p-4">
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

            <div class="relative">
              <label class="text-xs text-gray-600 mb-1 block">Room Type</label>
              <input
                type="search"
                class="w-[190px] text-xs px-2 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
                placeholder="Select room..."
                @click="isRoomSearching = !isRoomSearching"
                v-model="room_search"
                :disabled="!hotel_id"
              />
              <div
                v-if="isRoomSearching && rooms && rooms.length > 0"
                class="absolute shadow-lg bg-white py-2 top-[75px] min-w-[190px] max-h-[200px] overflow-y-auto space-y-1 border border-gray-200 rounded-lg z-50"
              >
                <div
                  v-for="i in rooms"
                  :key="i.id"
                  @click="selectRoom(i)"
                  class="px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <p class="text-xs font-medium">{{ i.name }}</p>
                </div>
              </div>
            </div>

            <div>
              <label class="text-xs text-gray-600 mb-1 block"
                >Check-in Date</label
              >
              <input
                class="w-[190px] text-xs px-2 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
                type="date"
                v-model="start_date"
              />
            </div>

            <div>
              <label class="text-xs text-gray-600 mb-1 block"
                >Check-out Date</label
              >
              <input
                class="w-[190px] text-xs px-2 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
                type="date"
                v-model="end_date"
              />
            </div>

            <div class="flex items-end pt-5">
              <button
                :disabled="!room_id || !start_date || !end_date"
                @click="roomPeriodSearch"
                :class="[
                  'text-xs px-4 py-3 rounded-lg text-white border transition-colors',
                  !room_id || !start_date || !end_date
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-[#FF613c] hover:bg-[#FF4520] cursor-pointer',
                ]"
              >
                Search
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

          <!-- Results Display -->
          <div v-else-if="roomPeriodData" class="space-y-6">
            <!-- Room Information -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-sm font-semibold text-gray-800 mb-2">
                Room Details
              </h3>
              <p class="text-sm text-gray-700">
                {{ roomPeriodData.room?.name }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                Base Price: ฿
                {{ formatNumber(roomPeriodData.room?.room_price) }}
              </p>
            </div>

            <!-- Daily Availability Table -->
            <div class="overflow-hidden border border-gray-200 rounded-lg">
              <div class="overflow-x-auto max-h-[40vh] overflow-y-auto">
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
                        class="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider"
                      >
                        Room Price
                      </th>
                      <th
                        class="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider"
                      >
                        Current Price
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
                      v-for="(rateData, date) in roomPeriodData.room_rates"
                      :key="date"
                      :class="[
                        rateData.available_rooms === 0
                          ? 'bg-red-50'
                          : rateData.available_rooms <= 2
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
                            rateData.available_rooms === 0
                              ? 'bg-red-100 text-red-800'
                              : rateData.available_rooms <= 2
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800',
                          ]"
                        >
                          {{ rateData.available_rooms }}
                        </span>
                      </td>
                      <td
                        class="px-4 py-3 whitespace-nowrap text-right text-xs text-gray-900"
                      >
                        ฿ {{ formatNumber(rateData.room_price) }}
                      </td>
                      <td
                        class="px-4 py-3 whitespace-nowrap text-right text-xs font-medium text-gray-900"
                      >
                        ฿ {{ formatNumber(rateData.current_price) }}
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
            </div>

            <!-- Alert for incomplete allotment -->
            <div
              v-if="roomPeriodData.is_incomplete_allotment"
              class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded"
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
              Please select a hotel, room, and date range to view availability
            </p>
          </div>
        </div>
      </DialogPanel>
    </Modal>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useHomeStore } from "../../stores/home";
import { useAuthStore } from "../../stores/auth";
import AvgCard from "./AvgCard.vue";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { computed } from "vue";
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { useHotelStore } from "../../stores/hotel";
import { useRoomV2Store } from "../../stores/roomV2";
import { storeToRefs } from "pinia";
import debounce from "lodash/debounce";

const homeStore = useHomeStore();
const hotelStore = useHotelStore();
const { hotels } = storeToRefs(hotelStore);
const roomV2Store = useRoomV2Store();
const authStore = useAuthStore();
const saleAgentDataRes = ref([]);

const showModal = ref(false);
const search = ref("");
const isSearching = ref(false);
const hotel_id = ref("");
const room_search = ref("");
const rooms = ref("");
const isRoomSearching = ref(false);
const room_id = ref("");
const hotelLists = ref([]);
const start_date = ref("");
const end_date = ref("");

const hotelSearch = async () => {
  let data = {
    search: search.value,
  };
  const res = await hotelStore.getListAction(data);
  hotelLists.value = res.result.data;
  isSearching.value = true;
};

// Add these new refs
const roomPeriodData = ref(null);
const isLoadingRoomData = ref(false);

// Update the roomPeriodSearch function
const roomPeriodSearch = async () => {
  isLoadingRoomData.value = true;
  roomPeriodData.value = null;

  try {
    let data = {
      checkin_date: start_date.value,
      checkout_date: end_date.value,
    };
    const res = await roomV2Store.getRoomPeriod(data, room_id.value);
    console.log("Room Period Response:", res);

    if (res.status === 1 && res.data) {
      roomPeriodData.value = res.data;
    }
  } catch (error) {
    console.error("Error fetching room period:", error);
  } finally {
    isLoadingRoomData.value = false;
  }
};

// Add helper functions
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

// Update selectHotel to close dropdown
const selectHotel = (data) => {
  search.value = data.name;
  hotel_id.value = data.id;
  rooms.value = data.rooms;
  isSearching.value = false;
  // Reset room selection when hotel changes
  room_search.value = "";
  room_id.value = "";
  roomPeriodData.value = null;
};

// Update selectRoom to close dropdown
const selectRoom = (data) => {
  room_search.value = data.name;
  room_id.value = data.id;
  isRoomSearching.value = false;
  roomPeriodData.value = null;
};

watch(
  search,
  debounce(async (newValue) => {
    await hotelSearch();
  }, 500)
);

const props = defineProps({
  adminLists: {
    type: Array,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:createdBy"]);

const createdByName = ref("");
const saleToday = ref(0);
const saleCount = ref(0);
const average = ref(0);

const createdBy = computed({
  get: () => props.createdBy,
  set: (value) => {
    emit("update:createdBy", value);
  },
});

const targetAmount = ref(0);

// New refs for monthly averages
const monthlyAvgSaleTotal = ref(0);
const monthlyAvgBookingCount = ref(0);

const getSaleAgentData = async (date) => {
  let first = date[0];
  let second = date[1];
  console.log(dateFormat(first), "this is date", dateFormat(second));
  let data = {
    first: dateFormat(first),
    second: dateFormat(second),
  };
  const resSaleAgent = await homeStore.getAgentSales(data);
  console.log(resSaleAgent, "this is sale agent report");
  saleAgentDataRes.value = resSaleAgent;

  if (saleAgentDataRes.value) {
    if (authStore?.isSuperAdmin && createdByName.value != "") {
      saleAgentDataRes.value.result.map((item) => {
        if (item?.created_by?.name == createdByName.value) {
          saleToday.value = item?.total;
          average.value = item?.target_amount;
          saleCount.value = item?.total_booking;
        }
      });
    } else {
      saleAgentDataRes.value.result.map((item) => {
        if (item?.created_by?.name == authStore?.user?.name) {
          saleToday.value = item?.total;
          average.value = item?.target_amount;
          saleCount.value = item?.total_booking;
        }
      });
    }
  }
};

const getSaleAverageData = async () => {
  // Get first and last day of current month
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  console.log(
    dateFormat(firstDay),
    "first day of month",
    dateFormat(lastDay),
    "last day of month"
  );

  let data = {
    first: dateFormat(firstDay),
    second: dateFormat(lastDay),
  };

  const resSaleAgent = await homeStore.getAgentSales(data);
  console.log(resSaleAgent, "this is monthly sale agent report");

  if (resSaleAgent && resSaleAgent.result) {
    // Find current user's data
    let currentUserData;
    if (authStore?.isSuperAdmin && createdByName.value != "") {
      currentUserData = resSaleAgent.result.find(
        (item) => item?.created_by?.name == createdByName.value
      );
    } else {
      currentUserData = resSaleAgent.result.find(
        (item) => item?.created_by?.name == authStore?.user?.name
      );
    }

    if (currentUserData) {
      // Calculate average per day in the current month
      const daysInMonth = lastDay.getDate();
      const currentDay = date.getDate();

      average.value = currentUserData.target_amount;

      // Calculate averages based on days elapsed in the month so far
      monthlyAvgSaleTotal.value = (currentUserData.total / currentDay).toFixed(
        2
      );
      monthlyAvgBookingCount.value = (
        currentUserData.total_booking / currentDay
      ).toFixed(2);

      console.log("Monthly average sale total:", monthlyAvgSaleTotal.value);
      console.log(
        "Monthly average booking count:",
        monthlyAvgBookingCount.value
      );
    }
  }
};

onMounted(() => {
  // For daily data
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const date = [today, tomorrow];
  getSaleAgentData(date);

  // For monthly average data
  getSaleAverageData();
});

watch(createdByName, () => {
  monthlyAvgBookingCount.value = 0;
  monthlyAvgSaleTotal.value = 0;
  saleToday.value = 0;
  saleCount.value = 0;
  average.value = 0;
  // For daily data
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const date = [today, tomorrow];
  getSaleAgentData(date);

  // For monthly average data
  getSaleAverageData();
});

const dateFormat = (date) => {
  let d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  let year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};
</script>
