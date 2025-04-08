<template>
  <div class="flex justify-start items-center gap-x-4">
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
        <span class="text-xs font-medium text-gray-600"
          >{{ Math.round((saleToday / average) * 100) }}%</span
        >
      </div>
    </div>
    <div
      class="bg-white border-l-4 border-[#FF613c] shadow gap-x-4 rounded-r-lg px-4 py-2 flex justify-between items-center"
    >
      <div class="space-y-2">
        <p class="text-xs">Booking Count</p>
        <p class="text-2xl text-black font-semibold">
          {{ saleCount ? saleCount : 0 }}
        </p>
      </div>
      <div class="w-10 h-10"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useHomeStore } from "../../stores/home";
import { useAuthStore } from "../../stores/auth";

const homeStore = useHomeStore();
const authStore = useAuthStore();
const saleAgentDataRes = ref([]);

const saleToday = ref("");
const saleCount = ref("");
const average = ref("");

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
    saleAgentDataRes.value.result.map((item) => {
      if (item?.created_by?.name === authStore?.user?.name) {
        saleToday.value = item?.total;
        average.value = item?.target_amount;
        saleCount.value = item?.total_booking;
      }
    });
  }
};

onMounted(() => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const date = [today, tomorrow];
  getSaleAgentData(date);
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
