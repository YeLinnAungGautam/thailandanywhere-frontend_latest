<template>
  <div class="bg-white rounded-lg shadow-sm p-6 h-[47vh] overflow-y-scroll">
    <div class="flex items-center justify-between mb-4">
      <p class="text-gray-700 text-lg font-semibold">AVA RANK</p>

      <!-- Period Type Selection -->
      <div class="flex gap-2">
        <button
          @click="periodType = 'day'"
          :class="[
            'px-3 py-1 rounded text-sm font-medium transition-colors',
            periodType === 'day'
              ? 'bg-[#FF613c] text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          Daily
        </button>
        <button
          @click="periodType = 'month'"
          :class="[
            'px-3 py-1 rounded text-sm font-medium transition-colors',
            periodType === 'month'
              ? 'bg-[#FF613c] text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          Monthly
        </button>
      </div>
    </div>

    <!-- Date Picker -->
    <div class="mb-4">
      <input
        v-if="periodType === 'day'"
        type="date"
        v-model="selectedDate"
        @change="fetchRankings"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF613c]"
      />
      <input
        v-else
        type="month"
        v-model="selectedMonth"
        @change="fetchRankings"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF613c]"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF613c]"
      ></div>
    </div>

    <!-- No Data State -->
    <div
      v-else-if="!salesReps || salesReps.length === 0"
      class="text-center py-8"
    >
      <p class="text-gray-500">No data available for this period</p>
    </div>

    <!-- Rankings List -->
    <div v-else class="space-y-3">
      <div
        v-for="(rep, index) in salesReps"
        :key="rep.user_id"
        class="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors"
      >
        <div class="flex items-center gap-3">
          <div class="relative">
            <img
              :src="getImageByName(rep.user_id)"
              :alt="rep.user_name"
              class="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            />
            <!-- Crown for top 3 -->
            <div
              v-if="index < 3"
              class="absolute -top-4 -right-1 text-lg"
              :title="getCrownTitle(index)"
            >
              {{ getCrownEmoji(index) }}
            </div>
          </div>
          <div>
            <span class="text-gray-700 text-sm font-medium block">
              {{ rep.user_name }}
            </span>

            <span class="text-xs text-[#FF613c] block">
              {{ rep.total_quantity }} units
            </span>
            <span class="text-gray-500 text-xs" v-if="rep.total_child_qty > 0">
              {{ rep.total_child_qty }} children
            </span>
          </div>
        </div>
        <div class="text-right">
          <span class="font-semibold text-[#FF613c] block">
            <!-- {{ rep.total_quantity }} units -->
            {{ rep.total_bookings }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useAvailableStore } from "@/stores/available"; // Adjust path as needed
import chitSu from "../../assets/agents/chitsu.png";
import maHnin from "../../assets/agents/Hnin_Panei__Senior_Sales_Manager-removebg-preview.png";
import kaingHninKyi from "../../assets/agents/Khaing_Hnin_Kyi-removebg-preview.png";
import nyeinNyein from "../../assets/agents/NyeinNyein-removebg-preview.png";
import ShooneLei from "../../assets/agents/shoonelei2.png";
import ZarKyi from "../../assets/agents/zarkyi.png";

const availableStore = useAvailableStore();

// State
const periodType = ref("day");
const selectedDate = ref(getCurrentDate());
const selectedMonth = ref(getCurrentMonth());
const salesReps = ref([]);
const loading = ref(false);

// Helper functions for date
function getCurrentDate() {
  return new Date().toISOString().split("T")[0];
}

function getCurrentMonth() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}`;
}

// Fetch rankings data
const fetchRankings = async () => {
  try {
    loading.value = true;

    const params = {
      period_type: periodType.value,
      date:
        periodType.value === "day"
          ? selectedDate.value
          : `${selectedMonth.value}-01`,
    };

    const response = await availableStore.getRankingListAction(params);

    if (response.result === 1) {
      salesReps.value = response.data;
    } else {
      salesReps.value = [];
    }
  } catch (error) {
    console.error("Error fetching rankings:", error);
    salesReps.value = [];
  } finally {
    loading.value = false;
  }
};

// Image mapping
const getImageByName = (id) => {
  const imageMap = {
    11: chitSu,
    10: maHnin,
    20: kaingHninKyi,
    28: nyeinNyein,
    47: ShooneLei,
    46: ZarKyi,
  };

  return (
    imageMap[id] ||
    "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
  );
};

// Crown functions
const getCrownEmoji = (index) => {
  const crowns = ["👑", "🥈", "🥉"];
  return crowns[index];
};

const getCrownTitle = (index) => {
  const titles = ["1st Place", "2nd Place", "3rd Place"];
  return titles[index];
};

// Watch for period type changes
import { watch } from "vue";
watch(periodType, () => {
  fetchRankings();
});

// Fetch initial data
onMounted(() => {
  fetchRankings();
});
</script>

<style scoped>
/* Add custom scrollbar styling if needed */
.overflow-scroll::-webkit-scrollbar {
  width: 6px;
}

.overflow-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-scroll::-webkit-scrollbar-thumb {
  background: #ff613c;
  border-radius: 10px;
}

.overflow-scroll::-webkit-scrollbar-thumb:hover {
  background: #e5512f;
}
</style>
