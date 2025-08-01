<script setup>
import { ChevronDownIcon } from "@heroicons/vue/24/outline";
import PriceRangeSlider from "./PriceRangeSlider.vue";
import DatePicker from "./DatePicker.vue";
import { ref, defineProps, defineEmits, computed, onMounted, watch } from "vue";
import { formattedDate } from "../help/FormatData";
import { useAuthStore } from "../../stores/auth";

const selectedDate = ref(null);
const startDate = ref(null);
const endDate = ref(null);
const multiSelectMode = ref(false); // Toggle between single and range selection
const payment_status = ref("");
const inclusive = ref(false);
const authStore = useAuthStore();

// Price range variables
const minValue = ref(0);
const maxValue = ref(90000);
const priceRangeApplied = ref(false);

const props = defineProps({
  saleDate: {
    type: String,
    default: "",
  },
  bookingDateFrom: {
    type: String,
    default: "",
  },
  bookingDateTo: {
    type: String,
    default: "",
  },
  searchP: {
    type: String,
    default: "",
  },
  priceMin: {
    type: [String, Number],
    default: "",
  },
  priceMax: {
    type: [String, Number],
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
  "update:bookingDateFrom",
  "update:bookingDateTo",
  "update:searchP",
  "update:priceMin",
  "update:priceMax",
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

// Helper function to check if dates match
const isSameDate = (date1, date2) => {
  if (!date1 || !date2) return false;
  const d1 = date1 instanceof Date ? date1 : new Date(date1);
  const d2 = date2 instanceof Date ? date2 : new Date(date2);
  return d1.toDateString() === d2.toDateString();
};

const isDateSelected = (date) => {
  if (multiSelectMode.value) {
    // Range mode - check if date is in range
    if (!startDate.value || !endDate.value) return false;
    const checkDate = date instanceof Date ? date : new Date(date);
    return checkDate >= startDate.value && checkDate <= endDate.value;
  } else {
    // Single mode - check if date matches selected date
    if (date === "" && !selectedDate.value) return true;
    if (!selectedDate.value || !date) return false;
    return isSameDate(selectedDate.value, date);
  }
};

// Emit date changes to parent
const emitDateChanges = () => {
  if (multiSelectMode.value) {
    // Range mode - emit booking_date_from and booking_date_to
    emit("update:saleDate", ""); // Clear single date
    emit(
      "update:bookingDateFrom",
      startDate.value ? formattedDate(startDate.value) : ""
    );
    emit(
      "update:bookingDateTo",
      endDate.value ? formattedDate(endDate.value) : ""
    );
  } else {
    // Single mode - emit sale_date
    emit("update:bookingDateFrom", ""); // Clear range dates
    emit("update:bookingDateTo", "");
    emit(
      "update:saleDate",
      selectedDate.value ? formattedDate(selectedDate.value) : ""
    );
  }
};

// Price range handlers
const handlePriceUpdate = (type, value) => {
  if (type === "min") {
    minValue.value = value;
  } else {
    maxValue.value = value;
  }
};

const handleApplyPrice = () => {
  console.log(minValue.value, maxValue.value);

  priceRangeApplied.value = true;
  emit("update:priceMin", minValue.value);
  emit("update:priceMax", maxValue.value);
};

const clearPriceRange = () => {
  minValue.value = 0;
  maxValue.value = 90000;
  priceRangeApplied.value = false;
  emit("update:priceMin", "");
  emit("update:priceMax", "");
};

// Quick select functions
const selectToday = () => {
  const today = new Date();
  if (multiSelectMode.value) {
    startDate.value = today;
    endDate.value = today;
  } else {
    selectedDate.value = today;
  }
  emitDateChanges();
};

const selectYesterday = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (multiSelectMode.value) {
    startDate.value = yesterday;
    endDate.value = yesterday;
  } else {
    selectedDate.value = yesterday;
  }
  emitDateChanges();
};

const selectDayBefore = () => {
  const dayBefore = new Date();
  dayBefore.setDate(dayBefore.getDate() - 2);
  if (multiSelectMode.value) {
    startDate.value = dayBefore;
    endDate.value = dayBefore;
  } else {
    selectedDate.value = dayBefore;
  }
  emitDateChanges();
};

const selectAll = () => {
  selectedDate.value = null;
  startDate.value = null;
  endDate.value = null;
  emitDateChanges();
};

// Toggle between single and range mode
const toggleSelectionMode = () => {
  multiSelectMode.value = !multiSelectMode.value;
  // Clear all selections when switching mode
  selectedDate.value = null;
  startDate.value = null;
  endDate.value = null;
  emitDateChanges();
};

// Handle date picker model
const modelDate = computed({
  get: () => {
    if (multiSelectMode.value) {
      return startDate.value && endDate.value
        ? { start: startDate.value, end: endDate.value }
        : null;
    } else {
      return selectedDate.value;
    }
  },
  set: (value) => {
    if (multiSelectMode.value) {
      // Range mode
      if (value && typeof value === "object" && value.start) {
        startDate.value = value.start;
        endDate.value = value.end || value.start;
      } else {
        startDate.value = null;
        endDate.value = null;
      }
    } else {
      // Single mode
      selectedDate.value = value;
    }
    emitDateChanges();
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
  if (multiSelectMode.value) {
    if (startDate.value || endDate.value) count++;
  } else {
    if (selectedDate.value) count++;
  }
  if (payment_status.value) count++;
  if (inclusive.value) count++;
  if (createdBy.value) count++;
  if (priceRangeApplied.value) count++;
  return count;
});

// Price range display text
const priceRangeText = computed(() => {
  if (priceRangeApplied.value) {
    return `$${minValue.value.toLocaleString()} - $${maxValue.value.toLocaleString()}`;
  }
  return "Select price range";
});

function parseDate(dateString) {
  if (!dateString) return null;
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

onMounted(() => {
  // Initialize from props
  if (props.bookingDateFrom || props.bookingDateTo) {
    // Range mode
    multiSelectMode.value = true;
    startDate.value = props.bookingDateFrom
      ? parseDate(props.bookingDateFrom)
      : null;
    endDate.value = props.bookingDateTo ? parseDate(props.bookingDateTo) : null;
  } else if (props.saleDate) {
    // Single mode
    multiSelectMode.value = false;
    selectedDate.value = parseDate(props.saleDate);
  }

  if (props.searchP) {
    payment_status.value = props.searchP;
  }
  if (props.connection_status) {
    modelConnectionStatus.value = props.connection_status;
  }
  inclusive.value = props.inclusive_only;

  // Initialize price range
  if (props.priceMin && props.priceMin !== "") {
    minValue.value = Number(props.priceMin);
    priceRangeApplied.value = true;
  }
  if (props.priceMax && props.priceMax !== "") {
    maxValue.value = Number(props.priceMax);
    priceRangeApplied.value = true;
  }
});

// Watch for prop changes
watch(
  () => [props.saleDate, props.bookingDateFrom, props.bookingDateTo],
  ([newSaleDate, newBookingFrom, newBookingTo]) => {
    if (newBookingFrom || newBookingTo) {
      multiSelectMode.value = true;
      startDate.value = newBookingFrom ? parseDate(newBookingFrom) : null;
      endDate.value = newBookingTo ? parseDate(newBookingTo) : null;
    } else if (newSaleDate) {
      multiSelectMode.value = false;
      selectedDate.value = parseDate(newSaleDate);
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

// Watch for price prop changes
watch(
  () => [props.priceMin, props.priceMax],
  ([newMin, newMax]) => {
    if (newMin && newMin !== "") {
      minValue.value = Number(newMin);
      priceRangeApplied.value = true;
    }
    if (newMax && newMax !== "") {
      maxValue.value = Number(newMax);
      priceRangeApplied.value = true;
    }
    if ((!newMin || newMin === "") && (!newMax || newMax === "")) {
      minValue.value = 0;
      maxValue.value = 90000;
      priceRangeApplied.value = false;
    }
  }
);
</script>

<template>
  <div class="h-[75vh] w-full overflow-y-auto">
    <!-- Quick date selection buttons -->
    <div
      class="flex justify-start overflow-x-auto cursor-pointer items-center no-scrollbar gap-x-4"
    >
      <p
        class="px-2 py-1 text-xs text-[#FF613c]"
        :class="[
          !selectedDate && !startDate && !endDate
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
          isDateSelected(new Date(Date.now() - 24 * 60 * 60 * 1000))
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
          isDateSelected(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000))
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

      <!-- Sales Date Section -->
      <div class="gap-x-4 w-full border-b border-gray-300 px-4 py-3">
        <div
          class="flex justify-between items-center w-full"
          @click="dateFilter = !dateFilter"
        >
          <p class="text-xs font-semibold">
            <span
              class="w-2 h-2 inline-block rounded-full mr-2"
              :class="
                selectedDate || startDate || endDate
                  ? 'bg-[#FF613c]'
                  : 'bg-gray-200'
              "
            ></span>
            Sales Date
          </p>
          <ChevronDownIcon
            class="w-4 h-4 text-[#FF5B00] font-bold transition-all duration-150 cursor-pointer"
            :class="{ 'rotate-180': dateFilter }"
          />
        </div>

        <div class="pt-4 transition-all duration-150" v-if="dateFilter">
          <!-- Selection mode toggle -->
          <div class="flex justify-between items-center mb-3">
            <button
              @click="multiSelectMode = false"
              class="text-xs px-3 py-1 rounded-lg border border-[#FF613c] text-[#FF613c] hover:bg-[#FF613c] hover:text-white transition-colors"
              :class="{ 'bg-[#FF613c] text-white': !multiSelectMode }"
            >
              Single Date
            </button>
            <button
              @click="multiSelectMode = true"
              class="text-xs px-3 py-1 rounded-lg border border-[#FF613c] text-[#FF613c] hover:bg-[#FF613c] hover:text-white transition-colors"
              :class="{ 'bg-[#FF613c] text-white': multiSelectMode }"
            >
              Date Range
            </button>
          </div>

          <!-- Date picker -->
          <div class="max-w-md mx-auto">
            <DatePicker
              v-model="modelDate"
              :mode="multiSelectMode ? 'range' : 'single'"
            />
          </div>
        </div>
      </div>

      <!-- Select Agent Section -->
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

      <!-- Payment Status Section -->
      <div class="gap-x-4 w-full border-b border-gray-300 px-4 py-3">
        <div
          class="flex justify-between items-center w-full"
          @click="paymentFilter = !paymentFilter"
        >
          <p class="text-xs font-semibold">
            <span
              class="w-2 h-2 inline-block rounded-full mr-2"
              :class="payment_status ? 'bg-[#FF613c]' : 'bg-gray-200'"
            ></span>
            Payment Status
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

      <!-- Price Range Section - UPDATED -->
      <div class="gap-x-4 w-full border-b border-gray-300 px-4 py-3">
        <div
          class="flex justify-between items-center w-full"
          @click="priceFilter = !priceFilter"
        >
          <p class="text-xs font-semibold">
            <span
              class="w-2 h-2 inline-block rounded-full mr-2"
              :class="priceRangeApplied ? 'bg-[#FF613c]' : 'bg-gray-200'"
            ></span>
            Price Range
          </p>
          <ChevronDownIcon
            :class="{ 'rotate-180': priceFilter }"
            class="w-4 h-4 text-[#FF5B00] font-bold cursor-pointer transition-all duration-150"
          />
        </div>
        <div class="w-full max-w-md mx-auto" v-if="priceFilter">
          <div class="pt-3 space-y-3">
            <!-- Price range display -->
            <div class="text-center">
              <p class="text-xs text-gray-600 mb-2">{{ priceRangeText }}</p>
            </div>

            <!-- Price Range Slider -->
            <PriceRangeSlider
              :initial-min="minValue"
              :initial-max="maxValue"
              :range-min="0"
              :range-max="90000"
              @update:min="handlePriceUpdate('min', $event)"
              @update:max="handlePriceUpdate('max', $event)"
              @apply="handleApplyPrice"
            />

            <!-- Price range controls -->
            <div class="flex justify-between items-center gap-2 mt-3">
              <button
                @click="clearPriceRange"
                class="flex-1 text-xs py-1.5 px-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                :class="{ 'opacity-50 cursor-not-allowed': !priceRangeApplied }"
                :disabled="!priceRangeApplied"
              >
                Clear
              </button>
              <button
                @click="handleApplyPrice"
                class="flex-1 text-xs py-1.5 px-3 bg-[#FF613c] text-white rounded-lg hover:bg-[#FF613c]/90 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Inclusive Section -->
      <div class="gap-x-4 w-full px-4 py-3 border-b border-gray-300">
        <div
          class="flex justify-between items-center w-full"
          @click="inclusiveFilter = !inclusiveFilter"
        >
          <p class="text-xs font-semibold">
            <span
              class="w-2 h-2 inline-block rounded-full mr-2"
              :class="inclusive ? 'bg-[#FF613c]' : 'bg-gray-200'"
            ></span>
            Inclusive
          </p>
          <ChevronDownIcon
            :class="{ 'rotate-180': inclusiveFilter }"
            class="w-4 h-4 text-[#FF5B00] font-bold cursor-pointer transition-all duration-150"
          />
        </div>
        <div v-if="inclusiveFilter">
          <div class="flex gap-x-2 items-center pt-4 w-full">
            <input
              type="checkbox"
              @click="modelInclusive = false"
              :checked="!modelInclusive"
              class="w-4 h-4 text-[#FF5B00] border-gray-300 rounded focus:ring-[#FF5B00] cursor-pointer"
            />
            <p class="text-[11px] font-medium">Regular</p>
          </div>
          <div class="flex gap-x-2 items-center pt-2 w-full">
            <input
              type="checkbox"
              @click="modelInclusive = true"
              :checked="modelInclusive"
              class="w-4 h-4 text-[#FF5B00] border-gray-300 rounded focus:ring-[#FF5B00] cursor-pointer"
            />
            <p class="text-[11px] font-medium">Inclusive</p>
          </div>
        </div>
      </div>

      <!-- Connected Section -->
      <div class="gap-x-4 w-full px-4 py-3">
        <div
          class="flex justify-between items-center w-full"
          @click="connectionFilter = !connectionFilter"
        >
          <p class="text-xs font-semibold">
            <span
              class="w-2 h-2 inline-block rounded-full mr-2"
              :class="connection_status ? 'bg-[#FF613c]' : 'bg-gray-200'"
            ></span>
            Connected
          </p>
          <ChevronDownIcon
            :class="{ 'rotate-180': connectionFilter }"
            class="w-4 h-4 text-[#FF5B00] font-bold cursor-pointer transition-all duration-150"
          />
        </div>
        <div v-if="connectionFilter">
          <div class="flex gap-x-2 items-center pt-4 w-full">
            <input
              type="checkbox"
              @click="modelConnectionStatus = 'connected'"
              :checked="modelConnectionStatus == 'connected'"
              class="w-4 h-4 text-[#FF5B00] border-gray-300 rounded focus:ring-[#FF5B00] cursor-pointer"
            />
            <p class="text-[11px] font-medium">Connected</p>
          </div>
          <div class="flex gap-x-2 items-center pt-2 w-full">
            <input
              type="checkbox"
              @click="modelConnectionStatus = 'not_connected'"
              :checked="modelConnectionStatus == 'not_connected'"
              class="w-4 h-4 text-[#FF5B00] border-gray-300 rounded focus:ring-[#FF5B00] cursor-pointer"
            />
            <p class="text-[11px] font-medium">Not Connected</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
