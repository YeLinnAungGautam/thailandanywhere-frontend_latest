<template>
  <div class="bg-white rounded-lg shadow-sm p-6 h-[40vh] overflow-scroll">
    <div class="flex items-center justify-between mb-4">
      <p class="text-gray-700 text-lg font-semibold">Top Sales Reps</p>

      <!-- Toggle Switch -->
      <!-- <div class="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        <button
          @click="viewMode = 'today'"
          :class="[
            'px-3 py-1 rounded text-[10px] font-medium transition-colors',
            viewMode === 'today'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700',
          ]"
        >
          Today
        </button>
        <button
          @click="viewMode = 'average'"
          :class="[
            'px-3 py-1 rounded text-[10px] font-medium transition-colors',
            viewMode === 'average'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700',
          ]"
        >
          Avg / Day
        </button>
      </div> -->
    </div>

    <div class="space-y-3">
      <div
        v-for="(rep, index) in displayReps"
        :key="rep.id ?? index"
        class="flex items-center justify-between py-2"
      >
        <div class="flex items-center gap-3">
          <div class="relative">
            <img
              :src="getImageByName(rep.id ? rep.id : rep.name)"
              alt="Agent Avatar"
              class="w-10 h-10 rounded-full object-contain"
            />
            <!-- Crown for top 3 -->
            <div
              v-if="index < 6"
              class="absolute -top-4 -right-1 text-lg"
              :title="getCrownTitle(index)"
            >
              {{ getCrownEmoji(index) }}
            </div>
          </div>
          <span class="text-gray-700 text-sm font-medium">{{ rep.name }}</span>
        </div>
        <span class="font-semibold text-[#FF613c]">
          ฿{{ rep.amount.toLocaleString() }}
        </span>
      </div>

      <div
        v-if="displayReps.length === 0"
        class="text-center text-gray-400 text-sm py-4"
      >
        No data available
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, computed } from "vue";
import chitSu from "../../assets/agents/chitsu.png";
import maHnin from "../../assets/agents/Hnin_Panei__Senior_Sales_Manager-removebg-preview.png";
import kaingHninKyi from "../../assets/agents/Khaing_Hnin_Kyi-removebg-preview.png";
import nyeinNyein from "../../assets/agents/NyeinNyein-removebg-preview.png";
import ShooneLei from "../../assets/agents/shoonelei2.png";
import ZarKyi from "../../assets/agents/zarkyi.png";

const props = defineProps({
  // Average daily sales reps (existing prop)
  salesReps: {
    type: Array,
    default: () => [],
  },
  // Today's sales reps (new prop)
  todaySalesReps: {
    type: Array,
    default: () => [],
  },
});

const viewMode = ref("average");

const displayReps = computed(() => {
  return viewMode.value === "today" ? props.todaySalesReps : props.salesReps;
});

const getImageByName = (idOrName) => {
  const byId = {
    11: chitSu,
    10: maHnin,
    20: kaingHninKyi,
    28: nyeinNyein,
    47: ShooneLei,
    46: ZarKyi,
  };

  const byName = {
    "Chit Su": chitSu,
    "Hnin N": maHnin,
    "Khaing Hnin Kyi": kaingHninKyi,
    "Nyein Nyein": nyeinNyein,
    "Shoon Lei": ShooneLei,
    "Zar Kyi": ZarKyi,
  };

  return (
    byId[idOrName] ??
    byName[idOrName] ??
    "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
  );
};

const getCrownEmoji = (index) => ["👑", "🥈", "🥉", "🥺", "😓", "😭"][index];
const getCrownTitle = (index) => ["1st Place", "2nd Place", "3rd Place"][index];
</script>
