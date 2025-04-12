<template>
  <div class="flex justify-start items-center gap-x-4">
    <AvgCard
      :title="'Daily Avg. Sales'"
      :value="monthlyAvgSaleTotal"
      :is_value="true"
      :is_show="true"
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
    <AvgCard
      :title="'Daily Avg. Booking'"
      :value="monthlyAvgBookingCount"
      :is_value="false"
    />
    <div
      class="bg-white border-l-4 border-[#FF613c] shadow gap-x-4 rounded-r-lg px-4 py-2 flex justify-between items-center"
    >
      <div class="space-y-2">
        <p class="text-xs">Bookings Today</p>
        <p class="text-2xl text-black font-semibold">
          {{ saleCount ? saleCount : 0 }}
        </p>
      </div>
      <div class="w-10 h-10"></div>
    </div>
    <div v-if="authStore.isSuperAdmin"
      class="bg-white border-l-4 border-[#FF613c] shadow gap-x-4 rounded-r-lg px-4 py-2 flex justify-between items-center"
    >
      <div class="space-y-2">
        <p class="text-xs">For Super Admin </p>
        <p class="text-2xl text-black font-semibold">
          Process
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
import AvgCard from "./AvgCard.vue";

const homeStore = useHomeStore();
const authStore = useAuthStore();
const saleAgentDataRes = ref([]);

const saleToday = ref(0);
const saleCount = ref(0);
const average = ref(0);

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
    saleAgentDataRes.value.result.map((item) => {
      if (item?.created_by?.name == authStore?.user?.name) {
        saleToday.value = item?.total;
        average.value = item?.target_amount;
        saleCount.value = item?.total_booking;
      }
    });
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
    const currentUserData = resSaleAgent.result.find(
      (item) => item?.created_by?.name === authStore?.user?.name
    );

    if (currentUserData) {
      // Calculate average per day in the current month
      const daysInMonth = lastDay.getDate();
      const currentDay = date.getDate();

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
