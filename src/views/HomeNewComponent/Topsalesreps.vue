<template>
  <div class="bg-white rounded-lg shadow-sm p-6 h-[40vh] overflow-scroll">
    <div class="flex items-center justify-between mb-4">
      <p class="text-gray-700 text-lg font-semibold">Top Sales Reps</p>
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
            <div
              v-if="index < 6"
              class="absolute -top-4 -right-1 text-lg"
              :title="getCrownTitle(index)"
            >
              {{ getCrownEmoji(index) }}
            </div>
          </div>

          <!-- Name + cash image count -->
          <div>
            <span class="text-gray-700 text-sm font-medium block">
              {{ rep.name }}
            </span>
            <span v-if="rep.cash_image_count > 0" class="text-gray-400 text-xs">
              {{ rep.cash_image_count }} payment(s)
            </span>
          </div>
        </div>

        <!-- Sales amount + cash received -->
        <div class="text-right">
          <!-- Cash received -->
          <div
            v-if="rep.total_cash_received > 0"
            class="text-base text-green-600 font-medium"
          >
            ฿{{ Math.round(rep.total_cash_received).toLocaleString() }}
          </div>
          <!-- Difference indicator -->
          <div
            v-if="rep.total_cash_received > 0"
            class="text-[10px]"
            :class="getCashDiffClass(rep)"
          >
            {{ getCashDiffText(rep) }}
          </div>
          <!-- Sales amount -->
          <div class="font-semibold text-[#FF613c] text-sm">
            ฿{{ Math.round(rep.amount).toLocaleString() }}
          </div>
        </div>
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
  salesReps: { type: Array, default: () => [] },
  todaySalesReps: { type: Array, default: () => [] },
});

const viewMode = ref("average");

const displayReps = computed(() =>
  viewMode.value === "today" ? props.todaySalesReps : props.salesReps,
);

// Sales amount (daily avg * days) vs cash received
const getCashDiffClass = (rep) => {
  const monthlySales = rep.amount * 30; // approximate
  const diff = rep.total_cash_received - monthlySales;
  if (Math.abs(diff) < 1000) return "text-gray-400";
  return diff >= 0 ? "text-green-500" : "text-red-400";
};

const getCashDiffText = (rep) => {
  // Compare total_cash_received vs total_without_airline (monthly)
  // rep.amount is avg/day so we just show ratio
  const ratio =
    rep.total_cash_received > 0
      ? Math.round((rep.total_cash_received / (rep.amount * 30)) * 100)
      : 0;
  if (ratio >= 100) return `+${ratio - 100}% overpaid`;
  if (ratio > 0) return `${ratio}% collected`;
  return "";
};

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
