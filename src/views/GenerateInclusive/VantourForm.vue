<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-slate-800 mb-4">
      {{ editingIndex !== null ? "Edit Van Tour" : "Add Van Tour" }}
    </h3>

    <!-- Select Day -->
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">
        Select Day
      </label>
      <select
        v-model.number="localData.dayNumber"
        @change="onDayChange"
        class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
      >
        <option value="">Select Day</option>
        <option v-for="day in totalDays" :key="day" :value="day">
          Day {{ day }} - {{ getDayDateShort(day) }}{{ getDayCitiesText(day) }}
        </option>
      </select>
    </div>

    <!-- Select Service Product -->
    <div v-if="localData.dayNumber">
      <label class="block text-sm font-medium text-slate-700 mb-2">
        Select Service
      </label>
      <select
        v-model="localData.selectedProduct"
        @change="onProductChange"
        class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
      >
        <option value="">Choose a service</option>
        <option
          v-for="service in availableProducts"
          :key="service"
          :value="service"
        >
          {{ service }}
        </option>
      </select>
    </div>

    <!-- Select Vehicle Variation -->
    <div v-if="localData.selectedProduct">
      <label class="block text-sm font-medium text-slate-700 mb-2">
        Select Vehicle Type
      </label>
      <div
        class="space-y-2 max-h-64 overflow-y-auto bg-slate-50 border-2 border-slate-200 rounded-xl p-4"
      >
        <div
          v-for="(variation, idx) in availableVariations"
          :key="idx"
          @click="selectVariation(variation)"
          :class="[
            'bg-white border-2 rounded-lg p-3 cursor-pointer transition',
            localData.selectedVariation?.type === variation.type
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50',
          ]"
        >
          <div class="font-semibold text-sm text-slate-800">
            {{ variation.type }}
          </div>
          <div class="text-xs text-slate-600 mt-1">
            Capacity: {{ variation.capacity }} passengers
          </div>
          <div class="flex justify-between items-center mt-2">
            <span class="text-xs text-emerald-600 font-bold">
              ฿{{ variation.pricePerDay.toLocaleString() }} / day
            </span>
            <span
              v-if="localData.selectedVariation?.type === variation.type"
              class="text-xs text-emerald-600 font-semibold"
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
            ? 'bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer'
            : 'bg-slate-300 text-slate-500 cursor-not-allowed',
        ]"
      >
        {{ editingIndex !== null ? "✓ Update Van Tour" : "+ Add Van Tour" }}
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
  mockData: Object,
  adults: Number,
  children: Number,
  editingIndex: Number,
  editingData: Object,
});

const emit = defineEmits(["submit", "cancel"]);

const localData = reactive({
  dayNumber: null,
  selectedProduct: "",
  selectedVariation: null,
  type: "",
  service: "",
  route: "",
  passengers: 2,
  pickupTime: "",
  duration: null,
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

// Watch for adults/children changes to update passengers
watch(
  () => [props.adults, props.children],
  ([adults, children]) => {
    if (props.editingIndex === null) {
      localData.passengers = adults + children;
    }
  },
  { immediate: true },
);

const availableProducts = computed(() => {
  return Object.keys(props.mockData);
});

const availableVariations = computed(() => {
  if (!localData.selectedProduct) return [];
  return props.mockData[localData.selectedProduct] || [];
});

const getDayDateShort = (dayNumber) => {
  if (!props.startDate) return "";
  const start = new Date(props.startDate);
  const current = new Date(start);
  current.setDate(start.getDate() + dayNumber - 1);
  return current.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const getDayCitiesText = (dayNumber) => {
  const cities = props.dayCityMap[dayNumber];
  if (!cities || cities.length === 0) return "";
  return ` (${cities.join(" → ")})`;
};

const getDayDateRaw = (dayNumber) => {
  if (!props.startDate) return "";
  const start = new Date(props.startDate);
  const current = new Date(start);
  current.setDate(start.getDate() + dayNumber - 1);
  return current.toISOString().split("T")[0];
};

const onDayChange = () => {
  localData.selectedProduct = "";
  localData.selectedVariation = null;
};

const onProductChange = () => {
  localData.selectedVariation = null;
};

const selectVariation = (variation) => {
  localData.selectedVariation = variation;
  localData.type = variation.type;
  localData.passengers = props.adults + props.children;
};

const handleSubmit = () => {
  if (!localData.dayNumber || !localData.selectedVariation) {
    alert("Please select a day and vehicle type");
    return;
  }

  const dayDate = getDayDateRaw(localData.dayNumber);
  const city = props.dayCityMap[localData.dayNumber];

  const vanTour = {
    dayNumber: localData.dayNumber,
    serviceDate: dayDate,
    city: city,
    dayLabel: `Feb ${getDayDateShort(localData.dayNumber).split(" ")[1]}`,
    route: localData.selectedProduct,
    type: localData.type,
    service: localData.selectedProduct,
    passengers: localData.passengers,
    pickupTime: localData.pickupTime,
    duration: localData.duration,
  };

  emit("submit", vanTour);

  // Reset form if adding new
  if (props.editingIndex === null) {
    Object.assign(localData, {
      dayNumber: null,
      selectedProduct: "",
      selectedVariation: null,
      type: "",
      service: "",
      route: "",
      passengers: props.adults + props.children,
      pickupTime: "",
      duration: null,
    });
  }
};
</script>
