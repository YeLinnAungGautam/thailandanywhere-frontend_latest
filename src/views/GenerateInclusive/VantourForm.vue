<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center pb-3">
      <h3 class="text-lg font-semibold text-slate-700">
        {{ editingIndex !== null ? "Edit Van Tour" : "Add Van Tour" }}
      </h3>
      <div>
        <select
          v-model.number="localData.dayNumber"
          @change="onDayChange"
          class="w-[150px] px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
        >
          <option value="">Select Day</option>
          <option v-for="day in totalDays" :key="day" :value="day">
            Day {{ day }}
          </option>
        </select>
      </div>
    </div>

    <!-- Search Van Tour (only after day is selected) -->
    <div
      v-if="localData.dayNumber"
      class="relative"
      v-click-outside="closeDropdown"
    >
      <label class="block text-sm font-medium text-slate-700 mb-2">
        Search Van Tour
      </label>

      <div class="relative" v-if="!localData.selectedVanTour">
        <input
          v-model="searchQuery"
          @input="onSearchChange"
          @focus="onSearchFocus"
          type="text"
          placeholder="Search van tours..."
          class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
        />
        <div
          v-if="vanTourStore.searchLoading"
          class="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <div
            class="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"
          ></div>
        </div>
      </div>

      <!-- Dropdown -->
      <div
        v-if="
          showDropdown &&
          !vanTourStore.searchLoading &&
          vanTourStore.searchResults.length > 0
        "
        class="w-full mt-2 bg-white border border-slate-300 rounded-xl shadow-lg max-h-[450px] overflow-y-auto"
      >
        <div
          v-for="vt in vanTourStore.searchResults"
          :key="vt.id"
          @click="selectVanTour(vt)"
          class="p-3 hover:bg-green-50 cursor-pointer border-b border-slate-100 last:border-b-0 transition"
        >
          <div class="flex items-start gap-3">
            <img
              v-if="vt.cover_image"
              :src="vt.cover_image"
              :alt="vt.name"
              class="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            />
            <div
              v-else
              class="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0"
            >
              <span class="text-green-600 text-lg">🚐</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-semibold text-sm text-slate-800 truncate">
                {{ vt.name }}
              </div>
              <div class="flex items-center gap-2 mt-1 flex-wrap">
                <span
                  class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded"
                >
                  {{ vt.type }}
                </span>
                <span v-if="vt.cars?.length" class="text-xs text-slate-500">
                  {{ vt.cars.length }} car option{{
                    vt.cars.length > 1 ? "s" : ""
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No results -->
      <div
        v-if="
          showDropdown &&
          !vanTourStore.searchLoading &&
          searchQuery &&
          vanTourStore.searchResults.length === 0
        "
        class="absolute z-50 w-full mt-2 bg-white border border-slate-300 rounded-xl shadow-lg p-4 text-center text-slate-500 text-sm"
      >
        No van tours found for "{{ searchQuery }}"
      </div>
    </div>

    <!-- Helper when day not selected -->
    <div
      v-else
      class="text-sm text-slate-400 bg-slate-50 rounded-xl p-3 text-center flex items-center justify-center gap-2"
    >
      <span>🚐</span> Please select a day first
    </div>

    <!-- Selected Van Tour Display -->
    <div
      v-if="localData.selectedVanTour"
      class="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-4"
    >
      <div class="flex items-start gap-3">
        <img
          v-if="localData.selectedVanTour.cover_image"
          :src="localData.selectedVanTour.cover_image"
          :alt="localData.selectedVanTour.name"
          class="w-16 h-16 rounded-lg object-cover"
        />
        <div
          v-else
          class="w-16 h-16 rounded-lg bg-green-200 flex items-center justify-center"
        >
          <span class="text-2xl">🚐</span>
        </div>
        <div class="flex-1">
          <span class="font-semibold text-slate-800 block">
            {{ localData.selectedVanTour.name }}
          </span>
          <span
            class="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded mt-1 inline-block"
          >
            {{ localData.selectedVanTour.type }}
          </span>
          <button
            @click="clearVanTourSelection"
            class="mt-2 block text-xs text-red-600 hover:text-red-700 font-medium"
          >
            ✕ Change Van Tour
          </button>
        </div>
      </div>
    </div>

    <!-- Select Car -->
    <div v-if="localData.selectedVanTour && availableCars.length > 0">
      <label class="block text-sm font-medium text-slate-700 mb-2">
        Select Car
      </label>
      <div class="space-y-2 h-[350px] overflow-y-auto rounded-lg">
        <div
          v-for="(car, idx) in availableCars"
          :key="car.car_id ?? idx"
          @click="selectCar(car)"
          :class="[
            'bg-white border-2 rounded-lg p-3 cursor-pointer transition',
            localData.selectedCar?.car_id === car.car_id
              ? 'border-green-500 bg-green-50'
              : 'border-slate-200 hover:border-green-300 hover:bg-green-50',
          ]"
        >
          <div class="font-semibold text-sm text-slate-800">{{ car.name }}</div>
          <div class="flex justify-between items-center mt-2 flex-wrap gap-x-4">
            <div class="flex items-center gap-x-4">
              <span class="text-sm text-green-600 font-bold">
                ฿{{ car.price.toLocaleString() }}
              </span>
              <span class="text-xs text-slate-500">
                Cost: ฿{{ car.cost.toLocaleString() }}
              </span>
              <span v-if="car.capacity" class="text-xs text-slate-400">
                👥 {{ car.capacity }} pax
              </span>
            </div>
            <span
              v-if="localData.selectedCar?.car_id === car.car_id"
              class="text-xs text-green-600 font-semibold"
            >
              ✓ Selected
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Button -->
    <div class="flex gap-2">
      <button
        v-if="editingIndex !== null"
        @click="$emit('cancel')"
        class="w-1/3 px-6 py-3 bg-slate-400 text-white rounded-xl font-semibold hover:bg-slate-500 transition"
      >
        Cancel
      </button>
      <button
        @click="openPriceSummaryModal"
        :disabled="!canSubmit"
        :class="[
          'px-6 py-3 rounded-xl font-semibold transition',
          editingIndex !== null ? 'w-2/3' : 'w-full',
          canSubmit
            ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'
            : 'bg-slate-300 text-slate-500 cursor-not-allowed',
        ]"
      >
        {{ editingIndex !== null ? "✓ Update Van Tour" : "+ Add Van Tour" }}
      </button>
    </div>

    <!-- Price Summary Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="showPriceModal"
          class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        >
          <!-- Backdrop -->
          <div
            class="absolute inset-0 bg-black/50 backdrop-blur-sm"
            @click="showPriceModal = false"
          />

          <!-- Modal Card -->
          <div
            class="modal-card relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
          >
            <!-- Header -->
            <div
              class="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 flex items-start justify-between"
            >
              <div>
                <h3 class="text-lg font-bold text-white leading-tight">
                  Price Summary
                </h3>
                <p class="text-green-100 text-xs mt-1 line-clamp-1">
                  {{ localData.selectedVanTour?.name }}
                </p>
              </div>
              <button
                @click="showPriceModal = false"
                class="w-7 h-7 ml-4 shrink-0 rounded-full bg-white/25 hover:bg-white/40 text-white flex items-center justify-center transition text-xl leading-none"
              >
                &times;
              </button>
            </div>

            <!-- Body -->
            <div class="px-6 pt-5 pb-2 space-y-4">
              <!-- Day chip -->
              <div class="grid grid-cols-1 gap-3">
                <div
                  class="bg-slate-50 rounded-xl py-3 text-center border border-slate-200"
                >
                  <p class="text-xs text-slate-500 mb-0.5">Day</p>
                  <p class="text-xl font-bold text-slate-800">
                    {{ localData.dayNumber }}
                  </p>
                  <p class="text-xs text-slate-400">
                    {{ getDayDateShort(localData.dayNumber) }}
                  </p>
                </div>
              </div>

              <!-- Car Qty stepper -->
              <div class="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p class="text-xs font-medium text-slate-500 mb-2 text-center">
                  Cars
                </p>
                <div class="flex items-center justify-between gap-1">
                  <button
                    @click="localData.cars = Math.max(1, localData.cars - 1)"
                    class="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-600 font-bold hover:bg-green-50 hover:border-green-400 hover:text-green-600 transition flex items-center justify-center text-lg leading-none"
                  >
                    −
                  </button>
                  <span
                    class="text-2xl font-bold text-slate-800 w-8 text-center"
                  >
                    {{ localData.cars }}
                  </span>
                  <button
                    @click="localData.cars++"
                    class="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-600 font-bold hover:bg-green-50 hover:border-green-400 hover:text-green-600 transition flex items-center justify-center text-lg leading-none"
                  >
                    +
                  </button>
                </div>
              </div>

              <!-- Car breakdown -->
              <div class="divide-y divide-slate-100">
                <div class="flex justify-between items-center py-2.5">
                  <div class="text-sm">
                    <span class="font-medium text-slate-700">{{
                      localData.selectedCar?.name
                    }}</span>
                    <span class="text-slate-400 ml-1.5 text-xs">
                      × {{ localData.cars }} car{{
                        localData.cars > 1 ? "s" : ""
                      }}
                    </span>
                    <span
                      v-if="localData.selectedCar?.capacity"
                      class="text-slate-400 ml-1.5 text-xs"
                    >
                      (max {{ localData.selectedCar.capacity }} pax each)
                    </span>
                  </div>
                  <span class="font-semibold text-slate-800 text-sm">
                    ฿{{ totalSellingPrice.toLocaleString() }}
                  </span>
                </div>
              </div>

              <!-- Totals box -->
              <div
                class="bg-green-50 border border-green-200 rounded-xl px-4 py-3 space-y-2"
              >
                <div class="flex justify-between items-center">
                  <span class="text-sm text-slate-500">Cost Price</span>
                  <span class="text-sm font-semibold text-slate-600">
                    ฿{{ totalCostPrice.toLocaleString() }}
                  </span>
                </div>
                <div
                  class="flex justify-between items-center pt-2 border-t border-green-200"
                >
                  <span class="font-bold text-slate-800">Total Selling</span>
                  <span class="text-xl font-bold text-green-600">
                    ฿{{ totalSellingPrice.toLocaleString() }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-5 flex gap-3">
              <button
                @click="showPriceModal = false"
                class="flex-1 py-3 rounded-xl border-2 border-slate-300 text-slate-600 font-semibold hover:bg-slate-50 transition text-sm"
              >
                ← Back
              </button>
              <button
                @click="confirmSubmit"
                class="flex-1 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 active:bg-green-700 transition text-sm"
              >
                {{
                  editingIndex !== null ? "✓ Confirm Update" : "✓ Confirm & Add"
                }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import { useVantourStore } from "../../stores/vantour";

const props = defineProps({
  totalDays: Number,
  dayCityMap: Object, // { 1: [{id, name}, ...], ... }
  startDate: String,
  editingIndex: Number,
  editingData: Object,
});

const emit = defineEmits(["submit", "cancel"]);

const vanTourStore = useVantourStore();
const searchQuery = ref("");
const showDropdown = ref(false);
const showPriceModal = ref(false);
let searchTimeout = null;

const localData = reactive({
  dayNumber: "",
  cars: 1,
  selectedVanTour: null,
  selectedCar: null,
});

// ─────────────────────────────────────────────────────────────
// Click-outside directive
// ─────────────────────────────────────────────────────────────
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutsideHandler = (event) => {
      if (!el.contains(event.target)) binding.value();
    };
    document.addEventListener("mousedown", el._clickOutsideHandler);
  },
  unmounted(el) {
    document.removeEventListener("mousedown", el._clickOutsideHandler);
  },
};

const closeDropdown = () => {
  showDropdown.value = false;
};

// ─────────────────────────────────────────────────────────────
// Watch editing data
// ─────────────────────────────────────────────────────────────
watch(
  () => props.editingData,
  (newData) => {
    if (newData) Object.assign(localData, newData);
  },
  { deep: true, immediate: true },
);

// ─────────────────────────────────────────────────────────────
// City IDs for the selected day
// ─────────────────────────────────────────────────────────────
const dayCityIds = computed(() => {
  if (!localData.dayNumber) return [];
  return (props.dayCityMap[localData.dayNumber] ?? []).map((c) => c.id);
});

// ─────────────────────────────────────────────────────────────
// Cars from the selected van tour
// ─────────────────────────────────────────────────────────────
const availableCars = computed(() => localData.selectedVanTour?.cars ?? []);

// ─────────────────────────────────────────────────────────────
// Totals (cars multiplier)
// ─────────────────────────────────────────────────────────────
const totalSellingPrice = computed(() => {
  if (!localData.selectedCar) return 0;
  return (localData.selectedCar.price ?? 0) * localData.cars;
});

const totalCostPrice = computed(() => {
  if (!localData.selectedCar) return 0;
  return (
    (localData.selectedCar.cost
      ? localData.selectedCar.cost
      : localData.selectedCar.price) * localData.cars
  );
});

// ─────────────────────────────────────────────────────────────
// Can submit?
// ─────────────────────────────────────────────────────────────
const canSubmit = computed(
  () =>
    localData.dayNumber && localData.selectedVanTour && localData.selectedCar,
);

// ─────────────────────────────────────────────────────────────
// Day / date helpers
// ─────────────────────────────────────────────────────────────
const getDayDateShort = (dayNumber) => {
  if (!props.startDate || !dayNumber) return "";
  const start = new Date(props.startDate);
  const d = new Date(start);
  d.setDate(start.getDate() + dayNumber - 1);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getDayDateRaw = (dayNumber) => {
  if (!props.startDate || !dayNumber) return "";
  const start = new Date(props.startDate);
  const d = new Date(start);
  d.setDate(start.getDate() + dayNumber - 1);
  return d.toISOString().split("T")[0];
};

const getDayCitiesText = (dayNumber) => {
  const cities = props.dayCityMap[dayNumber];
  if (!cities || cities.length === 0) return "";
  return ` (${cities.map((c) => c.name).join(" → ")})`;
};

// ─────────────────────────────────────────────────────────────
// Search handlers
// ─────────────────────────────────────────────────────────────
const fetchVanTours = async () => {
  if (!dayCityIds.value.length) return;
  await vanTourStore.searchVanTours(dayCityIds.value, searchQuery.value);
  showDropdown.value = true;
};

const onSearchChange = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(fetchVanTours, 500);
};

const onSearchFocus = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(fetchVanTours, 300);
};

const onDayChange = () => {
  localData.selectedVanTour = null;
  localData.selectedCar = null;
  searchQuery.value = "";
  showDropdown.value = false;
  vanTourStore.clearSearchResults();
};

// ─────────────────────────────────────────────────────────────
// Van Tour / Car selection
// ─────────────────────────────────────────────────────────────
const selectVanTour = (vt) => {
  localData.selectedVanTour = vt;
  localData.selectedCar = null;
  showDropdown.value = false;
};

const clearVanTourSelection = () => {
  localData.selectedVanTour = null;
  localData.selectedCar = null;
  searchQuery.value = "";
  showDropdown.value = false;
  vanTourStore.clearSearchResults();
};

const selectCar = (car) => {
  localData.selectedCar = car;
};

// ─────────────────────────────────────────────────────────────
// Modal
// ─────────────────────────────────────────────────────────────
const openPriceSummaryModal = () => {
  if (!canSubmit.value) return;
  showPriceModal.value = true;
};

const confirmSubmit = () => {
  showPriceModal.value = false;

  const vt = localData.selectedVanTour;
  const car = localData.selectedCar;

  const vanTourEntry = {
    type: "VanTour",
    dayNumber: localData.dayNumber,
    serviceDate: getDayDateRaw(localData.dayNumber),
    dayLabel: getDayDateShort(localData.dayNumber),
    cities: props.dayCityMap[localData.dayNumber] ?? [],
    city: (props.dayCityMap[localData.dayNumber] ?? [])
      .map((c) => c.name)
      .join(" → "),
    cars: localData.cars,
    vanTourId: vt.id,
    vanTourName: vt.name,
    vanTourType: vt.type,
    carId: car.car_id,
    carName: car.name,
    carCapacity: car.capacity,
    costPrice: totalCostPrice.value,
    sellingPrice: totalSellingPrice.value,
    agentPrice: (car.agent_price ?? 0) * localData.cars,
  };

  emit("submit", vanTourEntry);

  if (props.editingIndex === null) {
    Object.assign(localData, {
      dayNumber: null,
      cars: 1,
      selectedVanTour: null,
      selectedCar: null,
    });
    searchQuery.value = "";
    showDropdown.value = false;
    vanTourStore.clearSearchResults();
  }
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active .modal-card,
.modal-fade-leave-active .modal-card {
  transition: transform 0.22s ease, opacity 0.22s ease;
}
.modal-fade-enter-from .modal-card {
  transform: scale(0.94) translateY(10px);
  opacity: 0;
}
.modal-fade-leave-to .modal-card {
  transform: scale(0.94) translateY(10px);
  opacity: 0;
}
</style>
