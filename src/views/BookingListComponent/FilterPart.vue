<script setup>
import { ChevronDownIcon } from "@heroicons/vue/24/outline";
import PriceRangeSlider from "./PriceRangeSlider.vue";
import DatePicker from "./DatePicker.vue";
import { ref, defineProps, defineEmits, computed, onMounted, watch } from "vue";
import { formattedDate } from "../help/FormatData";

const selectedDate = ref(null);
const payment_status = ref("");
const inclusive = ref(false);

const props = defineProps({
  saleDate: {
    type: String,
    default: "",
  },
  searchP: {
    type: String,
    default: "",
  },
  inclusive_only: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "update:saleDate",
  "update:searchP",
  "update:inclusive_only",
]);

// Add these functions to your script section
const selectToday = () => {
  const today = new Date();
  selectedDate.value = today;
  emit("update:saleDate", formattedDate(today));
};

const selectYesterday = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() + 1);
  selectedDate.value = yesterday;
  emit("update:saleDate", formattedDate(yesterday));
};

const selectDayBefore = () => {
  const dayBefore = new Date();
  dayBefore.setDate(dayBefore.getDate() + 2);
  selectedDate.value = dayBefore;
  emit("update:saleDate", formattedDate(dayBefore));
};

const selectAll = () => {
  selectedDate.value = null;
  emit("update:saleDate", "");
};

const modelDate = computed({
  get: () => selectedDate.value,
  set: (value) => {
    selectedDate.value = value;
    emit("update:saleDate", formattedDate(value));
  },
});

const modelPaymentStatus = computed({
  get: () => payment_status.value,
  set: (value) => {
    payment_status.value = value;
    emit("update:searchP", value);
  },
});

const modelInclusive = computed({
  get: () => inclusive.value,
  set: (value) => {
    inclusive.value = value;
    emit("update:inclusive_only", value);
  },
});

function parseDate(dateString) {
  if (!dateString) return null;

  // Assuming your dateString is in format "YYYY-MM-DD"
  const [year, month, day] = dateString.split("-").map(Number);
  // Month in JS Date is 0-indexed, so subtract 1 from month
  return new Date(year, month - 1, day);
}

onMounted(() => {
  // Check if props have initial values and set the internal state
  if (props.saleDate) {
    // You would need a function to convert string date back to Date object
    selectedDate.value = parseDate(props.saleDate);
  }

  if (props.searchP) {
    payment_status.value = props.searchP;
  }

  // Set inclusive based on inclusive_only prop
  inclusive.value = props.inclusive_only;
});

watch(
  () => props.saleDate,
  (newValue) => {
    if (newValue && newValue !== formattedDate(selectedDate.value)) {
      selectedDate.value = parseDate(newValue);
    }
  }
);

watch(
  () => props.searchP,
  (newValue) => {
    if (newValue !== payment_status.value) {
      payment_status.value = newValue;
    }
  }
);

watch(
  () => props.inclusive_only,
  (newValue) => {
    if (newValue !== inclusive.value) {
      inclusive.value = newValue;
    }
  }
);
</script>

<template>
  <div class="h-[75vh] w-full overflow-y-auto">
    <div
      class="flex justify-start overflow-x-auto cursor-pointer items-center no-scrollbar gap-x-4"
    >
      <p class="px-2 py-1 text-xs text-[#FF613c]" @click="selectAll">All</p>
      <p class="px-2 py-1 text-xs text-[#FF613c]" @click="selectToday">Today</p>
      <p class="px-2 py-1 text-xs text-[#FF613c]" @click="selectYesterday">
        Yesterday
      </p>
      <p
        class="whitespace-nowrap text-xs text-[#FF613c]"
        @click="selectDayBefore"
      >
        Day Before
      </p>
    </div>
    <div class="border border-gray-100 rounded-lg mt-4 py-3">
      <div
        class="w-full border-b-2 border-gray-300 flex justify-between items-center px-4 pb-3"
      >
        <div class="flex justify-start items-center gap-x-4">
          <img
            src="https://cdn-icons-png.flaticon.com/128/7693/7693332.png"
            alt=""
            class="w-4 h-4 cursor-pointer"
          />
          <p class="text-sm font-semibold">FILTER</p>
        </div>
        <!-- <p class="bg-[#FF613c] text-white rounded-lg px-2 py-1 text-[10px]">
          FILTER
        </p> -->
      </div>
      <div class="gap-x-4 w-full border-b-2 border-gray-300 px-4 py-3">
        <div class="flex justify-between items-center w-full">
          <p class="text-xs font-semibold">Sales Date</p>
          <ChevronDownIcon
            class="w-4 h-4 text-[#FF5B00] font-bold cursor-pointer"
          />
        </div>
        <div class="max-w-md mx-auto pt-4">
          <DatePicker v-model="modelDate" />
        </div>
      </div>
      <div class="gap-x-4 w-full border-b-2 border-gray-300 px-4 py-3">
        <div class="flex justify-between items-center w-full">
          <p class="text-xs font-semibold">Payment Status</p>
          <ChevronDownIcon
            class="w-4 h-4 text-[#FF5B00] font-bold cursor-pointer"
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex gap-x-2 items-center pt-4 w-full">
            <input
              type="checkbox"
              @click="modelPaymentStatus = 'all'"
              :checked="modelPaymentStatus === 'all'"
              class="w-4 h-4 text-[#FF5B00] border-gray-300 rounded focus:ring-[#FF5B00] cursor-pointer"
            />
            <p class="text-[10px] whitespace-nowrap font-medium">
              All Bookings
            </p>
          </div>
          <div class="flex gap-x-2 items-center pt-2 w-full">
            <input
              type="checkbox"
              :checked="modelPaymentStatus === 'fully_paid'"
              @click="modelPaymentStatus = 'fully_paid'"
              class="w-4 h-4 text-[#FF5B00] border-gray-300 rounded focus:ring-[#FF5B00] cursor-pointer"
            />
            <p class="text-[10px] whitespace-nowrap font-medium">Fully Paid</p>
          </div>
          <div class="flex gap-x-2 items-center w-full">
            <input
              type="checkbox"
              @click="modelPaymentStatus = 'partially_paid'"
              :checked="modelPaymentStatus === 'partially_paid'"
              class="w-4 h-4 text-[#FF5B00] border-gray-300 rounded focus:ring-[#FF5B00] cursor-pointer"
            />
            <p class="text-[10px] whitespace-nowrap font-medium">
              Partially Paid
            </p>
          </div>
          <div class="flex gap-x-2 items-center w-full">
            <input
              type="checkbox"
              @click="modelPaymentStatus = 'not_paid'"
              :checked="modelPaymentStatus === 'not_paid'"
              class="w-4 h-4 text-[#FF5B00] border-gray-300 rounded focus:ring-[#FF5B00] cursor-pointer"
            />
            <p class="text-[10px] whitespace-nowrap font-medium">Not Paid</p>
          </div>
        </div>
      </div>
      <div class="gap-x-4 w-full border-b-2 border-gray-300 px-4 py-3">
        <div class="flex justify-between items-center w-full">
          <p class="text-xs font-semibold">Price Range</p>
          <ChevronDownIcon
            class="w-4 h-4 text-[#FF5B00] font-bold cursor-pointer"
          />
        </div>
        <div class="w-full max-w-md mx-auto">
          <div class="pt-3">
            <PriceRangeSlider
              :initial-min="minValue"
              :initial-max="maxValue"
              :range-min="0"
              :range-max="90000"
              @update:min="minValue = $event"
              @update:max="maxValue = $event"
              @apply="handleApply"
            />
          </div>
        </div>
      </div>

      <div class="gap-x-4 w-full px-4 py-3">
        <div class="flex justify-between items-center w-full">
          <p class="text-xs font-semibold">Inclusive</p>
          <ChevronDownIcon
            class="w-4 h-4 text-[#FF5B00] font-bold cursor-pointer"
          />
        </div>
        <div class="flex gap-x-2 items-center pt-4 w-full">
          <input
            type="checkbox"
            @click="modelInclusive = false"
            :checked="!modelInclusive"
            class="w-4 h-4 text-[#FF5B00] border-gray-300 rounded focus:ring-[#FF5B00] cursor-pointer"
          />
          <p class="text-xs font-medium">Regular</p>
        </div>
        <div class="flex gap-x-2 items-center pt-2 w-full">
          <input
            type="checkbox"
            @click="modelInclusive = true"
            :checked="modelInclusive"
            class="w-4 h-4 text-[#FF5B00] border-gray-300 rounded focus:ring-[#FF5B00] cursor-pointer"
          />
          <p class="text-xs font-medium">Inclusive</p>
        </div>
      </div>
    </div>
  </div>
</template>
