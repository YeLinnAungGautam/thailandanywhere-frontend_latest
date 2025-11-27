<template>
  <div class="bg-white rounded-lg shadow-sm p-6 h-[33.5vh] overflow-scroll">
    <p class="text-gray-700 text-lg font-semibold mb-4">Top Sales Reps</p>
    <div class="space-y-3">
      <div
        v-for="(rep, index) in salesReps"
        :key="index"
        class="flex items-center justify-between py-2"
      >
        <div class="flex items-center gap-3">
          <div class="relative">
            <img
              :src="getImageByName(rep.id)"
              alt="Agent Avatar"
              class="w-10 h-10 rounded-full object-contain"
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
          <span class="text-gray-700 text-sm font-medium">{{ rep.name }}</span>
        </div>
        <span> ฿{{ rep.amount.toLocaleString() }} </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted } from "vue";
import chitSu from "../../assets/agents/chitsu.png";
import maHnin from "../../assets/agents/Hnin_Panei__Senior_Sales_Manager-removebg-preview.png";
import kaingHninKyi from "../../assets/agents/Khaing_Hnin_Kyi-removebg-preview.png";
import nyeinNyein from "../../assets/agents/NyeinNyein-removebg-preview.png";

const props = defineProps({
  salesReps: {
    type: Array,
    default: () => [
      { name: "Somchai P.", amount: 340000, initials: "SP" },
      { name: "Narat S.", amount: 280000, initials: "NS" },
      { name: "Kanya M.", amount: 250000, initials: "KM" },
    ],
  },
});

const getImageByName = (id) => {
  switch (id) {
    case 11:
      return chitSu;
    case 10:
      return maHnin;
    case 20:
      return kaingHninKyi;
    case 28:
      return nyeinNyein;
    default:
      return "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";
  }
};

const getCrownEmoji = (index) => {
  const crowns = ["👑", "🥈", "🥉"];
  return crowns[index];
};

const getCrownTitle = (index) => {
  const titles = ["1st Place", "2nd Place", "3rd Place"];
  return titles[index];
};

onMounted(() => {
  console.log("====================================");
  console.log(props.salesReps);
  console.log("====================================");
});
</script>
