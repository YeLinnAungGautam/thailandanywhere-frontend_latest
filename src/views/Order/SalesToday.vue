<template>
  <div class="flex justify-start items-center gap-x-4">
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
        <p class="text-xs">Average Order/Day</p>
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
      :title="'Average Order/Day '"
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
        <p class="text-xs">Orders Today</p>
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
        <p class="text-xs">Total Amount Today</p>
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
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useHomeStore } from "../../stores/home";
import { useAuthStore } from "../../stores/auth";
import AvgCard from "../BookingListComponent/AvgCard.vue";
import { computed } from "vue";

const homeStore = useHomeStore();
const authStore = useAuthStore();
const saleAgentDataRes = ref([]);

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
