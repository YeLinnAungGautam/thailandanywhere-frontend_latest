<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-slate-700 mb-4">
      {{ editingIndex !== null ? "Edit Attraction" : "Add Attraction" }}
    </h3>

    <!-- Select Day -->
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">
        Select Day
      </label>
      <select
        v-model.number="localData.dayNumber"
        @change="onDayChange"
        class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
      >
        <option value="">Select Day</option>
        <option v-for="day in totalDays" :key="day" :value="day">
          Day {{ day }} - {{ getDayDateShort(day) }}{{ getDayCitiesText(day) }}
        </option>
      </select>
    </div>

    <!-- Select Product -->
    <div v-if="localData.dayNumber">
      <label class="block text-sm font-medium text-slate-700 mb-2">
        Select Product
      </label>
      <select
        v-model="localData.selectedProduct"
        @change="onProductChange"
        class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
      >
        <option value="">Choose a product</option>
        <option
          v-for="product in availableProducts"
          :key="product"
          :value="product"
        >
          {{ product }}
        </option>
      </select>
    </div>

    <!-- Select Variation -->
    <div v-if="localData.selectedProduct">
      <label class="block text-sm font-medium text-slate-700 mb-2">
        Select Variation
      </label>
      <div class="space-y-2 max-h-64 overflow-y-auto bg-slate-50">
        <div
          v-for="(variation, idx) in availableVariations"
          :key="idx"
          @click="selectVariation(variation)"
          :class="[
            'bg-white border-2 rounded-lg p-3 cursor-pointer transition',
            localData.selectedVariation?.name === variation.name
              ? 'border-orange-500 bg-orange-50'
              : 'border-slate-200 hover:border-orange-300 hover:bg-orange-50',
          ]"
        >
          <div class="font-semibold text-sm text-slate-800">
            {{ variation.name }}
          </div>
          <div class="text-xs text-slate-600 mt-1">
            {{ variation.description }}
          </div>
          <div class="flex justify-between items-center mt-2">
            <span class="text-xs text-orange-600 font-bold">
              ฿{{ variation.price.toLocaleString() }} / person
            </span>
            <span
              v-if="localData.selectedVariation?.name === variation.name"
              class="text-xs text-orange-600 font-semibold"
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
            ? 'bg-orange-500 text-white hover:bg-orange-600 cursor-pointer'
            : 'bg-slate-300 text-slate-500 cursor-not-allowed',
        ]"
      >
        {{ editingIndex !== null ? "✓ Update Attraction" : "+ Add to Package" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from "vue";

const props = defineProps({
  totalDays: Number,
  dayCityMap: Object,
  adults: Number,
  children: Number,
  startDate: String,
  mockData: Object,
  editingIndex: Number,
  editingData: Object,
});

const emit = defineEmits(["submit", "cancel"]);

const localData = reactive({
  dayNumber: null,
  type: "Attraction",
  selectedProduct: "",
  selectedVariation: null,
  name: "",
  variation: "",
  adults: props.adults,
  children: props.children,
  price: 0,
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

// In AttractionForm.vue script
const getDayCitiesText = (dayNumber) => {
  const cities = props.dayCityMap[dayNumber];
  if (!cities || cities.length === 0) return "";
  return ` (${cities.join(" → ")})`;
};

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
  localData.name = variation.name;
  localData.variation = variation.description;
  localData.price = variation.price;
  localData.adults = props.adults;
  localData.children = props.children;
};

const availableProducts = computed(() => {
  if (!localData.dayNumber) return [];
  const cities = props.dayCityMap[localData.dayNumber];
  if (!cities || cities.length === 0) return [];

  // Combine products from all cities for that day
  let allProducts = [];
  cities.forEach((city) => {
    if (props.mockData[city]) {
      allProducts = [...allProducts, ...Object.keys(props.mockData[city])];
    }
  });

  return [...new Set(allProducts)]; // Remove duplicates
});

const availableVariations = computed(() => {
  if (!localData.selectedProduct || !localData.dayNumber) return [];
  const cities = props.dayCityMap[localData.dayNumber];
  if (!cities || cities.length === 0) return [];

  // Find variations from any city that has this product
  for (const city of cities) {
    if (
      props.mockData[city] &&
      props.mockData[city][localData.selectedProduct]
    ) {
      return props.mockData[city][localData.selectedProduct];
    }
  }

  return [];
});

// In AttractionForm.vue handleSubmit
const handleSubmit = () => {
  if (!localData.dayNumber || !localData.selectedVariation) {
    alert("Please select a day and a variation");
    return;
  }

  const dayDate = getDayDateRaw(localData.dayNumber);
  const cities = props.dayCityMap[localData.dayNumber] || [];

  const attraction = {
    type: localData.type,
    dayNumber: localData.dayNumber,
    serviceDate: dayDate,
    cities: cities, // Store as array
    city: cities.join(" → "), // For backward compatibility
    dayLabel: `Feb ${getDayDateShort(localData.dayNumber).split(" ")[1]}`,
    product: localData.selectedProduct,
    name: localData.name,
    variation: localData.variation,
    adults: localData.adults,
    children: localData.children,
    price: localData.price,
  };

  emit("submit", attraction);

  // Reset form if adding new
  if (props.editingIndex === null) {
    Object.assign(localData, {
      dayNumber: null,
      type: "Attraction",
      selectedProduct: "",
      selectedVariation: null,
      name: "",
      variation: "",
      adults: props.adults,
      children: props.children,
      price: 0,
    });
  }
};
</script>
