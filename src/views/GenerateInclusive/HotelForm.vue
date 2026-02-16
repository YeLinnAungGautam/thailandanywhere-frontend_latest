<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-slate-700 mb-4">
      {{ editingIndex !== null ? "Edit Hotel" : "Add Hotel" }}
    </h3>

    <!-- Check-in/Check-out -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">
          Check-in
        </label>
        <input
          v-model="localData.checkIn"
          @change="onDateChange"
          type="date"
          :min="startDate"
          :max="endDate"
          class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
        />
        <div v-if="localData.checkIn" class="mt-2 text-sm text-slate-600">
          📅 {{ getDateDayInfo(localData.checkIn) }}
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">
          Check-out
        </label>
        <input
          v-model="localData.checkOut"
          @change="onDateChange"
          type="date"
          :min="localData.checkIn || startDate"
          :max="endDate"
          class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
        />
        <div v-if="localData.checkOut" class="mt-2 text-sm text-slate-600">
          📅 {{ getDateDayInfo(localData.checkOut) }}
        </div>
      </div>
    </div>

    <!-- Persons -->
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">
        Persons
      </label>
      <input
        v-model.number="localData.persons"
        type="number"
        min="1"
        class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
      />
    </div>

    <!-- Select Hotel -->
    <div v-if="dateRangeInfo.cities.length > 0">
      <label class="block text-sm font-medium text-slate-700 mb-2">
        Select Hotel
      </label>
      <select
        v-model="localData.selectedProduct"
        @change="onProductChange"
        class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
      >
        <option value="">Choose a hotel</option>
        <option v-for="hotel in availableProducts" :key="hotel" :value="hotel">
          {{ hotel }}
        </option>
      </select>
    </div>

    <!-- Select Room Type -->
    <div v-if="localData.selectedProduct">
      <label class="block text-sm font-medium text-slate-700 mb-2">
        Select Room Type
      </label>
      <div class="space-y-2 max-h-64 overflow-y-auto bg-slate-50">
        <div
          v-for="(variation, idx) in availableVariations"
          :key="idx"
          @click="selectVariation(variation)"
          :class="[
            'bg-white border-2 rounded-lg p-3 cursor-pointer transition',
            localData.selectedVariation?.roomType === variation.roomType
              ? 'border-purple-500 bg-purple-50'
              : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50',
          ]"
        >
          <div class="font-semibold text-sm text-slate-800">
            {{ variation.roomType }}
          </div>
          <div class="flex justify-between items-center mt-2">
            <span class="text-xs text-purple-600 font-bold">
              ฿{{ variation.pricePerNight.toLocaleString() }} / night
            </span>
            <span
              v-if="
                localData.selectedVariation?.roomType === variation.roomType
              "
              class="text-xs text-purple-600 font-semibold"
            >
              ✓ Selected
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2">
      <button
        v-if="editingIndex !== null"
        @click="$emit('cancel')"
        class="w-1/3 px-6 py-3 bg-slate-400 text-white rounded-xl font-semibold hover:bg-slate-500 transition"
      >
        Cancel
      </button>
      <button
        @click="handleSubmit"
        :disabled="!localData.selectedVariation"
        :class="[
          'px-6 py-3 rounded-xl font-semibold transition',
          editingIndex !== null ? 'w-2/3' : 'w-full',
          localData.selectedVariation
            ? 'bg-purple-500 text-white hover:bg-purple-600 cursor-pointer'
            : 'bg-slate-300 text-slate-500 cursor-not-allowed',
        ]"
      >
        {{ editingIndex !== null ? "✓ Update Hotel" : "+ Add Hotel" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from "vue";

const props = defineProps({
  totalDays: Number,
  dayCityMap: Object,
  startDate: String,
  endDate: String,
  mockData: Object,
  editingIndex: Number,
  editingData: Object,
});

const emit = defineEmits(["submit", "cancel"]);

const localData = reactive({
  name: "",
  variation: "",
  persons: 2,
  checkIn: "",
  checkOut: "",
  selectedProduct: "",
  selectedVariation: null,
  pricePerNight: 0,
});

// Watch for editing data changes
watch(
  () => props.editingData,
  (newData) => {
    if (newData) {
      Object.assign(localData, newData);
    }
  },
  { deep: true, immediate: true },
);

const dateRangeInfo = computed(() => {
  if (!localData.checkIn || !localData.checkOut || !props.startDate) {
    return { days: [], nights: 0, cities: [] };
  }

  const checkIn = new Date(localData.checkIn);
  const checkOut = new Date(localData.checkOut);
  const tripStart = new Date(props.startDate);

  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

  const days = [];
  const citiesSet = new Set();

  for (
    let date = new Date(checkIn);
    date < checkOut;
    date.setDate(date.getDate() + 1)
  ) {
    const dayNumber =
      Math.floor((date - tripStart) / (1000 * 60 * 60 * 24)) + 1;
    if (dayNumber >= 1 && dayNumber <= props.totalDays) {
      const dayCities = props.dayCityMap[dayNumber] || [];
      days.push({ day: dayNumber, cities: dayCities });
      dayCities.forEach((city) => citiesSet.add(city));
    }
  }

  return {
    days,
    nights,
    cities: Array.from(citiesSet),
  };
});

// In HotelForm.vue
const availableProducts = computed(() => {
  if (dateRangeInfo.value.cities.length === 0) return [];
  const cities = dateRangeInfo.value.cities;

  let hotels = [];
  cities.forEach((city) => {
    if (props.mockData[city]) {
      hotels = [...hotels, ...Object.keys(props.mockData[city])];
    }
  });

  return [...new Set(hotels)];
});

const availableVariations = computed(() => {
  if (!localData.selectedProduct || dateRangeInfo.value.cities.length === 0)
    return [];

  for (const city of dateRangeInfo.value.cities) {
    if (
      props.mockData[city] &&
      props.mockData[city][localData.selectedProduct]
    ) {
      return props.mockData[city][localData.selectedProduct];
    }
  }

  return [];
});

const getDateDayInfo = (dateStr) => {
  if (!props.startDate || !dateStr) return "";
  const start = new Date(props.startDate);
  const current = new Date(dateStr);
  const dayNumber = Math.floor((current - start) / (1000 * 60 * 60 * 24)) + 1;

  if (dayNumber < 1 || dayNumber > props.totalDays) return "Outside trip dates";

  const city = props.dayCityMap[dayNumber];
  return city
    ? `Day ${dayNumber} - ${city}`
    : `Day ${dayNumber} - No city assigned`;
};

const onDateChange = () => {
  localData.selectedProduct = "";
  localData.selectedVariation = null;
};

const onProductChange = () => {
  localData.selectedVariation = null;
};

const selectVariation = (variation) => {
  localData.selectedVariation = variation;
  localData.variation = variation.roomType;
  localData.pricePerNight = variation.pricePerNight;
};

const handleSubmit = () => {
  if (
    !localData.checkIn ||
    !localData.checkOut ||
    !localData.selectedVariation
  ) {
    alert("Please select dates and a room variation");
    return;
  }

  const citiesCovered = dateRangeInfo.value.cities.join(", ");

  const hotel = {
    name: localData.selectedProduct,
    variation: localData.variation,
    persons: localData.persons,
    checkIn: localData.checkIn,
    checkOut: localData.checkOut,
    citiesCovered: citiesCovered,
    pricePerNight: localData.pricePerNight,
  };

  emit("submit", hotel);

  // Reset form if adding new
  if (props.editingIndex === null) {
    Object.assign(localData, {
      name: "",
      variation: "",
      persons: 2,
      checkIn: "",
      checkOut: "",
      selectedProduct: "",
      selectedVariation: null,
      pricePerNight: 0,
    });
  }
};
</script>
