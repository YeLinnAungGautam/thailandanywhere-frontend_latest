<script setup>
import { ChevronDownIcon } from "@heroicons/vue/24/outline";
import PriceRangeSlider from "../BookingListComponent/PriceRangeSlider.vue";
import DatePicker from "../BookingListComponent/DatePicker.vue";
import { ref, defineProps, defineEmits, computed, onMounted, watch } from "vue";
import { formattedDate } from "../help/FormatData";
import { useAuthStore } from "../../stores/auth";

const selectedDate = ref(null);
const payment_status = ref("");
const inclusive = ref(false);
const authStore = useAuthStore();

const props = defineProps({
  saleDate: {
    type: String,
    default: "",
  },
  searchP: {
    type: String,
    default: "",
  },
  connection_status: {
    type: String,
    default: "",
  },
  inclusive_only: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: String,
    default: "",
  },
  adminLists: {
    type: Array,
    default: () => [],
  },
  searchHandler: {
    type: Function,
    default: () => {},
  },
  clearFilter: {
    type: Function,
    default: () => {},
  },
});

const emit = defineEmits([
  "update:saleDate",
  "update:searchP",
  "update:connection_status",
  "update:inclusive_only",
  "update:createdBy",
]);

// filter open close
const dateFilter = ref(false);
const paymentFilter = ref(false);
const priceFilter = ref(false);
const inclusiveFilter = ref(false);
const connectionFilter = ref(false);
const agentFilter = ref(false);

const isDateSelected = (date) => {
  if (!selectedDate.value && date == "") return true;
  if (!date || !selectedDate.value) return false;

  const compareDate = new Date(date);
  return compareDate.toDateString() === selectedDate.value.toDateString();
};

// Add these functions to your script section
const selectToday = () => {
  const today = new Date();
  selectedDate.value = today;
  emit("update:saleDate", formattedDate(today));
};

const selectYesterday = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  selectedDate.value = yesterday;
  emit("update:saleDate", formattedDate(yesterday));
};

const selectDayBefore = () => {
  const dayBefore = new Date();
  dayBefore.setDate(dayBefore.getDate() - 2);
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

const modelConnectionStatus = computed({
  get: () => props.connection_status,
  set: (value) => {
    emit("update:connection_status", value);
  },
});

const createdBy = computed({
  get: () => props.createdBy,
  set: (value) => {
    emit("update:createdBy", value);
  },
});

const modelInclusive = computed({
  get: () => inclusive.value,
  set: (value) => {
    inclusive.value = value;
    emit("update:inclusive_only", value);
  },
});

const filterCount = computed(() => {
  let count = 0;
  if (selectedDate.value) count++;
  if (payment_status.value) count++;
  if (inclusive.value) count++;
  if (createdBy.value) count++;
  return count;
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
  if (props.connection_status) {
    modelConnectionStatus.value = props.connection_status;
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
      <p
        class="px-2 py-1 text-xs text-[#FF613c]"
        :class="[
          !selectedDate
            ? 'bg-[#FF613c] text-white rounded-lg'
            : 'text-[#FF613c]',
        ]"
        @click="selectAll"
      >
        All
      </p>
      <p
        class="px-2 py-1 text-xs text-[#FF613c]"
        :class="[
          isDateSelected(new Date())
            ? 'bg-[#FF613c] text-white rounded-lg'
            : 'text-[#FF613c]',
        ]"
        @click="selectToday"
      >
        Today
      </p>
      <p
        class="px-2 py-1 text-xs text-[#FF613c]"
        :class="[
          isDateSelected(new Date(new Date().setDate(new Date().getDate() - 1)))
            ? 'bg-[#FF613c] text-white rounded-lg'
            : 'text-[#FF613c]',
        ]"
        @click="selectYesterday"
      >
        Yesterday
      </p>
      <p
        class="px-2 py-1 text-xs text-[#FF613c] whitespace-nowrap"
        :class="[
          isDateSelected(new Date(new Date().setDate(new Date().getDate() - 2)))
            ? 'bg-[#FF613c] text-white rounded-lg'
            : 'text-[#FF613c]',
        ]"
        @click="selectDayBefore"
      >
        Day Before
      </p>
    </div>
    <div class="border border-gray-100 rounded-lg mt-4 py-3">
      <div
        class="w-full border-b border-gray-300 flex justify-between items-center px-4 pb-3"
      >
        <div class="flex justify-start items-center gap-x-4">
          <img
            src="https://cdn-icons-png.flaticon.com/128/7693/7693332.png"
            alt=""
            class="w-4 h-4 cursor-pointer"
          />
          <p class="text-sm font-semibold">FILTER</p>
        </div>
        <div class="flex justify-end items-center gap-x-2">
          <p
            class="bg-[#FF613c] text-white cursor-pointer rounded-lg px-2 py-1 text-[10px]"
            @click="clearFilter"
          >
            CLEAR
          </p>
          <p
            class="bg-[#FF613c] text-white cursor-pointer rounded-lg px-2 py-1 text-[10px]"
            @click="searchHandler"
          >
            SEARCH {{ filterCount }}
          </p>
        </div>
      </div>
      <div class="gap-x-4 w-full border-b border-gray-300 px-4 py-3">
        <div
          class="flex justify-between items-center w-full"
          @click="dateFilter = !dateFilter"
        >
          <p class="text-xs font-semibold">
            <span
              class="w-2 h-2 inline-block rounded-full mr-2"
              :class="selectedDate ? 'bg-[#FF613c]' : 'bg-gray-200'"
            ></span
            >Order Date
          </p>
          <ChevronDownIcon
            class="w-4 h-4 text-[#FF5B00] font-bold transition-all duration-150 cursor-pointer"
            :class="{ 'rotate-180': dateFilter }"
          />
        </div>
        <div
          class="max-w-md mx-auto pt-4 transition-all duration-150"
          v-if="dateFilter"
        >
          <DatePicker v-model="modelDate" />
        </div>
      </div>
      <div class="gap-x-4 w-full border-b border-gray-300 px-4 py-3">
        <div
          class="flex justify-between items-center w-full"
          @click="agentFilter = !agentFilter"
        >
          <p class="text-xs font-semibold">
            <span
              class="w-2 h-2 inline-block rounded-full mr-2"
              :class="createdBy ? 'bg-[#FF613c]' : 'bg-gray-200'"
            ></span>
            Select Agent
          </p>
          <ChevronDownIcon
            :class="{ 'rotate-180': agentFilter }"
            class="w-4 h-4 text-[#FF5B00] font-bold cursor-pointer transition-all duration-150"
          />
        </div>
        <div v-if="authStore.isSuperAdmin && agentFilter" class="pt-4">
          <div class="space-y-2">
            <div class="flex gap-x-2 items-center w-full">
              <input
                type="checkbox"
                @click="createdBy = ''"
                :checked="createdBy == ''"
                class="w-4 h-4 text-[#FF5B00] border-gray-300 rounded focus:ring-[#FF5B00] cursor-pointer"
              />
              <p class="text-[11px] whitespace-nowrap font-medium">All</p>
            </div>
            <div
              class="flex gap-x-2 items-center w-full"
              v-for="admin in adminLists"
              :key="admin.id"
            >
              <input
                type="checkbox"
                @click="createdBy = admin.id"
                :checked="admin.id == createdBy"
                class="w-4 h-4 text-[#FF5B00] border-gray-300 rounded focus:ring-[#FF5B00] cursor-pointer"
              />
              <p class="text-[11px] whitespace-nowrap font-medium">
                {{ admin.name }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="gap-x-4 w-full border-b border-gray-300 px-4 py-3">
        <div
          class="flex justify-between items-center w-full"
          @click="paymentFilter = !paymentFilter"
        >
          <p class="text-xs font-semibold">
            <span
              class="w-2 h-2 inline-block rounded-full mr-2"
              :class="payment_status ? 'bg-[#FF613c]' : 'bg-gray-200'"
            ></span
            >Payment Status
          </p>
          <ChevronDownIcon
            :class="{ 'rotate-180': paymentFilter }"
            class="w-4 h-4 text-[#FF5B00] font-bold cursor-pointer transition-all duration-150"
          />
        </div>
        <div class="grid grid-cols-2 gap-4 pt-4" v-if="paymentFilter">
          <div class="flex gap-x-2 items-center w-full">
            <input
              type="checkbox"
              @click="modelPaymentStatus = ''"
              :checked="modelPaymentStatus === ''"
              class="w-4 h-4 text-[#FF5B00] border-gray-300 rounded focus:ring-[#FF5B00] cursor-pointer"
            />
            <p class="text-[11px] whitespace-nowrap font-medium">
              All Bookings
            </p>
          </div>
          <div class="flex gap-x-2 items-center w-full">
            <input
              type="checkbox"
              :checked="modelPaymentStatus === 'fully_paid'"
              @click="modelPaymentStatus = 'fully_paid'"
              class="w-4 h-4 text-[#FF5B00] border-gray-300 rounded focus:ring-[#FF5B00] cursor-pointer"
            />
            <p class="text-[11px] whitespace-nowrap font-medium">Fully Paid</p>
          </div>
          <div class="flex gap-x-2 items-center w-full">
            <input
              type="checkbox"
              @click="modelPaymentStatus = 'partially_paid'"
              :checked="modelPaymentStatus === 'partially_paid'"
              class="w-4 h-4 text-[#FF5B00] border-gray-300 rounded focus:ring-[#FF5B00] cursor-pointer"
            />
            <p class="text-[11px] whitespace-nowrap font-medium">
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
            <p class="text-[11px] whitespace-nowrap font-medium">Not Paid</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
