<template>
  <div class="mx-auto space-y-6 text-sm">
    <!-- Table Format -->
    <div class="bg-white rounded-lg border-2 border-slate-200 overflow-hidden">
      <table class="w-full">
        <!-- Table Header -->
        <thead>
          <tr class="bg-[#FF613c] text-white">
            <th
              class="px-4 py-3 text-left font-semibold text-white border-r border-slate-300"
            >
              SERVICE
            </th>
            <th
              class="px-4 py-3 text-left font-semibold text-white border-r border-slate-300"
            >
              DESCRIPTION
            </th>
            <th
              class="px-4 py-3 text-center font-semibold text-white border-r border-slate-300 w-24"
            >
              Estimate
            </th>
            <th
              class="px-4 py-3 text-center font-semibold text-white border-r border-slate-300 w-20"
            >
              QTY
            </th>
            <th class="px-4 py-3 text-center font-semibold text-white w-28">
              Est: Total
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Loop through each day -->
          <template v-for="day in totalDays" :key="`table-day-${day}`">
            <!-- Day Header Row -->
            <tr class="bg-white border-t-2 border-slate-300">
              <td colspan="5" class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-blue-700">
                    {{ formatTableDate(getDayDateRaw(day)) }}
                  </span>
                  <span
                    class="flex items-center gap-1 text-orange-600 font-semibold"
                  >
                    <span
                      class="w-2 h-2 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs"
                    >
                    </span>
                    {{ getTableDayTitle(day) }}
                  </span>
                </div>
              </td>
            </tr>

            <!-- Van Tours for this day -->
            <tr
              v-for="(van, vIdx) in getVanToursForDate(getDayDateRaw(day))"
              :key="`van-${day}-${vIdx}`"
              class="border-b border-slate-200 hover:bg-slate-50"
            >
              <td class="px-4 py-2 border-r border-slate-200">
                <div class="flex items-center gap-2">
                  <span class="text-orange-600">◆</span>
                  <span class="font-medium">{{ van.type }}</span>
                </div>
              </td>
              <td class="px-4 py-2 border-r border-slate-200">
                {{ van.route || van.service }}
              </td>
              <td
                class="px-4 py-2 text-right border-r border-slate-200 font-semibold"
              >
                Estimate
              </td>
              <td class="px-4 py-2 text-center border-r border-slate-200">
                {{ van.passengers }}
              </td>
              <td class="px-4 py-2 text-right font-semibold">Estimate</td>
            </tr>

            <!-- Attractions for this day -->
            <tr
              v-for="(attraction, aIdx) in getAttractionsForDate(
                getDayDateRaw(day),
              )"
              :key="`attraction-${day}-${aIdx}`"
              class="border-b border-slate-200 hover:bg-slate-50"
            >
              <td class="px-4 py-2 border-r border-slate-200">
                <div class="flex items-center gap-2">
                  <span class="text-orange-600">◆</span>
                  <span class="font-medium">
                    Entrance Fees <span class="text-blue-600">(by Guide)</span>
                  </span>
                </div>
              </td>
              <td class="px-4 py-2 border-r border-slate-200">
                {{ attraction.name }}
              </td>
              <td class="px-4 py-2 text-right border-r border-slate-200">
                {{ attraction.price }} ฿
              </td>
              <td class="px-4 py-2 text-center border-r border-slate-200">
                {{ attraction.adults + attraction.children }}
              </td>
              <td class="px-4 py-2 text-right font-semibold">
                {{
                  (
                    attraction.price *
                    (attraction.adults + attraction.children)
                  ).toLocaleString()
                }}
                ฿
              </td>
            </tr>

            <!-- Hotels for this day -->
            <tr
              v-for="(hotel, hIdx) in getHotelsForDate(getDayDateRaw(day))"
              :key="`hotel-${day}-${hIdx}`"
              class="border-b border-slate-200 hover:bg-slate-50"
            >
              <td class="px-4 py-2 border-r border-slate-200">
                <div class="flex items-center gap-2">
                  <span class="text-orange-600">◆</span>
                  <span class="font-medium">Hotel</span>
                </div>
              </td>
              <td class="px-4 py-2 border-r border-slate-200">
                {{ hotel.name }} - {{ hotel.variation }}
              </td>
              <td
                class="px-4 py-2 text-right border-r border-slate-200 font-semibold"
              >
                Estimate
              </td>
              <td class="px-4 py-2 text-center border-r border-slate-200">
                {{ hotel.persons }}
              </td>
              <td class="px-4 py-2 text-right font-semibold">Estimate</td>
            </tr>
          </template>

          <!-- Footer Note -->
          <tr
            class="border-t-2 border-slate-400"
            style="border-top-style: dashed"
          >
            <td colspan="5" class="px-4 py-4">
              <p class="text-sm text-blue-700 font-semibold">
                ** Please don't forget to attached all receipts.
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Totals Section -->
      <div class="bg-white px-6 py-4 border-t-2 border-slate-300">
        <div class="flex justify-end gap-8">
          <div class="text-right">
            <div class="mb-2">
              <span class="font-medium">Estimate Trip charges =</span>
              <span
                class="ml-4 inline-block border-2 border-slate-800 px-4 py-1 font-semibold min-w-[140px] text-right"
              >
                {{ calculateTotalEstimate() }} THB
              </span>
            </div>
            <div class="mb-2">
              <span class="font-medium">Advance payment to Guide =</span>
              <span
                class="ml-4 inline-block border-2 border-slate-800 px-4 py-1 font-semibold min-w-[140px] text-right"
              >
                {{ calculateAdvancePayment() }} THB
              </span>
            </div>
            <div>
              <span class="font-medium">Balance Payment =</span>
              <span class="ml-4 inline-block px-4 py-1 min-w-[140px]"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Finalize Button -->
    <div class="flex justify-end items-center pt-6">
      <button
        @click="$emit('finalize')"
        class="px-12 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 shadow-lg transition transform hover:scale-105"
      >
        Copy Button
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  totalDays: Number,
  startDate: String,
  dayCityMap: Object,
  attractions: Array,
  hotels: Array,
  vanTours: Array,
});

defineEmits(["finalize"]);

const getDayDateRaw = (dayNumber) => {
  if (!props.startDate) return "";
  const start = new Date(props.startDate);
  const current = new Date(start);
  current.setDate(start.getDate() + dayNumber - 1);
  return current.toISOString().split("T")[0];
};

const formatTableDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const getTableDayTitle = (dayNumber) => {
  const dayDate = getDayDateRaw(dayNumber);
  const city = props.dayCityMap[dayNumber];
  const vanTours = getVanToursForDate(dayDate);

  let parts = [];

  if (vanTours.length > 0) {
    parts.push(vanTours[0].route || vanTours[0].service);
  }

  if (city) {
    parts.push(`${city} Visit`);
  }

  return parts.length > 0 ? parts.join(" & ") : "Day activities";
};

const getVanToursForDate = (dateStr) => {
  return props.vanTours.filter((v) => v.serviceDate === dateStr);
};

const getAttractionsForDate = (dateStr) => {
  return props.attractions.filter((a) => a.serviceDate === dateStr);
};

const getHotelsForDate = (dateStr) => {
  const currentDate = new Date(dateStr);
  return props.hotels.filter((hotel) => {
    const checkIn = new Date(hotel.checkIn);
    const checkOut = new Date(hotel.checkOut);
    return checkIn <= currentDate && currentDate < checkOut;
  });
};

const calculateTotalEstimate = () => {
  let total = 0;
  props.attractions.forEach((item) => {
    total += (item.price || 0) * (item.adults + item.children);
  });
  return total.toLocaleString();
};

const calculateAdvancePayment = () => {
  const total = calculateTotalEstimate();
  const numTotal = parseInt(total.replace(/,/g, ""));
  return Math.floor(numTotal * 0.97).toLocaleString();
};
</script>
