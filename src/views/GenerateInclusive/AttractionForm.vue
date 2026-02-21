<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center pb-3">
      <h3 class="text-lg font-semibold text-slate-700">
        {{ editingIndex !== null ? "Edit Attraction" : "Add Attraction" }}
      </h3>
    </div>

    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">
        Choose Day
      </label>
      <div>
        <select
          v-model.number="localData.dayNumber"
          @change="onDayChange"
          class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
        >
          <option value="">Select Day</option>
          <option v-for="day in totalDays" :key="day" :value="day">
            Day {{ day }} - {{ getDayCitiesText(day) }}
          </option>
        </select>
      </div>
    </div>

    <!-- Search Products with Dropdown -->
    <div v-if="!localData.dayNumber">
      <label class="block text-sm font-medium text-slate-700 mb-2">
        Search Product
      </label>
      <p
        class="px-4 py-3 bg-gray-100 rounded-xl flex justify-start items-center gap-x-2 text-gray-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-ferris-wheel-icon lucide-ferris-wheel"
        >
          <circle cx="12" cy="12" r="2" />
          <path d="M12 2v4" />
          <path d="m6.8 15-3.5 2" />
          <path d="m20.7 7-3.5 2" />
          <path d="M6.8 9 3.3 7" />
          <path d="m20.7 17-3.5-2" />
          <path d="m9 22 3-8 3 8" />
          <path d="M8 22h8" />
          <path d="M18 18.7a9 9 0 1 0-12 0" />
        </svg>
        First you need to select a day
      </p>
    </div>
    <!-- FIX: Added `relative` wrapper + click-outside close + capped dropdown height with proper overflow -->
    <div
      v-if="localData.dayNumber"
      class="relative"
      v-click-outside="closeDropdown"
    >
      <label class="block text-sm font-medium text-slate-700 mb-2">
        Search Product
      </label>

      <div class="relative" v-if="!localData.selectedProduct">
        <MagnifyingGlassIcon
          class="w-6 h-6 absolute left-3 top-3.5 text-orange-500 cursor-pointer"
        />
        <input
          v-model="searchQuery"
          @input="onSearchChange"
          @focus="focusAction"
          type="text"
          placeholder="Search entrance tickets or destinations..."
          class="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
        />
        <div
          v-if="attractionStore.loading"
          class="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <div
            class="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"
          ></div>
        </div>
      </div>

      <!-- Dropdown List — FIX: position absolute but max-h + overflow-y-auto contained inside parent -->
      <div
        v-if="
          showDropdown &&
          !attractionStore.loading &&
          allMixedProducts.length > 0
        "
        class="z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl max-h-[380px] overflow-y-auto overscroll-contain"
        style="top: 100%"
      >
        <div
          v-for="product in allMixedProducts"
          :key="`${product.type}-${product.id}`"
          @click="selectProduct(product)"
          class="p-3 hover:bg-orange-50 cursor-pointer border-b border-slate-100 last:border-b-0 transition-colors"
        >
          <div class="flex items-center gap-3">
            <img
              v-if="product.cover_image || product.feature_img"
              :src="product.cover_image || product.feature_img"
              :alt="product.name"
              class="w-10 h-10 rounded-lg object-cover flex-shrink-0"
            />
            <div
              v-else
              class="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0"
            >
              <span class="text-orange-500 text-lg">🎫</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-semibold text-sm text-slate-800 truncate">
                {{ product.name }}
              </div>
              <div class="flex items-center gap-2 mt-0.5 flex-wrap">
                <span
                  :class="[
                    'text-xs px-2 py-0.5 rounded-full font-medium',
                    product.type === 'entrance_ticket'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-blue-100 text-blue-700',
                  ]"
                >
                  {{
                    product.type === "entrance_ticket"
                      ? "Entrance Ticket"
                      : "Destination"
                  }}
                </span>
                <span v-if="product.city" class="text-xs text-slate-400">
                  📍 {{ product.city }}
                </span>
                <span
                  v-if="product?.cities?.length > 0"
                  class="text-xs text-slate-400"
                >
                  <span v-for="i in product.cities" :key="i">📍 {{ i }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No results message -->
      <div
        v-if="
          showDropdown &&
          !attractionStore.loading &&
          searchQuery &&
          allMixedProducts.length === 0
        "
        class="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl p-4 text-center text-slate-400 text-sm"
        style="top: 100%"
      >
        No products found for "<span class="text-slate-600 font-medium">{{
          searchQuery
        }}</span
        >"
      </div>
    </div>

    <!-- Selected Product Display -->
    <div
      v-if="localData.selectedProduct"
      class="bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl p-4"
    >
      <div class="flex items-start gap-3">
        <img
          v-if="
            localData.selectedProduct.cover_image ||
            localData.selectedProduct.feature_img
          "
          :src="
            localData.selectedProduct.cover_image ||
            localData.selectedProduct.feature_img
          "
          :alt="localData.selectedProduct.name"
          class="w-16 h-16 rounded object-cover"
        />
        <div class="flex-1">
          <span class="font-semibold text-slate-800">
            {{ localData.selectedProduct.name }}
          </span>
          <button
            @click="clearSelection"
            class="mt-2 block text-xs text-red-600 hover:text-red-700 font-medium"
          >
            ✕ Change Product
          </button>
        </div>
      </div>
    </div>

    <!-- Select Variation (Entrance Ticket Only) -->
    <div
      v-if="
        localData.selectedProduct &&
        localData.productType === 'entrance_ticket' &&
        availableVariations.length > 0
      "
    >
      <label class="block text-sm font-medium text-slate-700 mb-2">
        Select Variation
      </label>
      <div class="space-y-2 h-[280px] overflow-y-auto rounded-lg">
        <div
          v-for="(variation, idx) in availableVariations"
          :key="idx"
          @click="selectVariation(variation)"
          :class="[
            'bg-white border-2 rounded-lg p-3 cursor-pointer transition',
            localData.selectedVariation?.id === variation.id
              ? 'border-orange-500 bg-orange-50'
              : 'border-slate-200 hover:border-orange-300 hover:bg-orange-50',
          ]"
        >
          <div class="font-semibold text-base text-slate-800">
            {{ variation.name }}
          </div>
          <div class="flex justify-between items-center mt-2 flex-wrap gap-x-4">
            <div class="flex justify-start items-center gap-x-4">
              <span
                class="text-sm bg-blue-100 px-2 py-1 rounded-lg text-blue-600 font-semibold"
              >
                Adult: ฿{{ variation.adult_price.toLocaleString() }}
              </span>
              <span
                v-if="variation.child_info[0].child_price > 0"
                class="text-sm bg-blue-100 px-2 py-1 rounded-lg text-blue-600 font-semibold"
              >
                Child: ฿{{
                  variation.child_info[0].child_price.toLocaleString()
                }}
              </span>
            </div>
            <span
              v-if="localData.selectedVariation?.id === variation.id"
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
        @click="openPriceSummaryModal"
        :disabled="!canSubmit"
        :class="[
          'px-6 py-3 rounded-xl font-semibold transition',
          editingIndex !== null ? 'w-2/3' : 'w-full',
          canSubmit
            ? 'bg-orange-500 text-white hover:bg-orange-600 cursor-pointer'
            : 'bg-slate-300 text-slate-500 cursor-not-allowed',
        ]"
      >
        {{ editingIndex !== null ? "✓ Update Attraction" : "+ Add to Package" }}
      </button>
    </div>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!--  Price Summary Modal                                    -->
    <!--  Teleported to <body> to escape any overflow:hidden     -->
    <!-- ═══════════════════════════════════════════════════════ -->
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
            <!-- ── Header ── -->
            <div
              class="bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-4 flex items-start justify-between"
            >
              <div>
                <h3 class="text-lg font-bold text-white leading-tight">
                  Price Summary
                </h3>
                <p class="text-orange-100 text-xs mt-1 line-clamp-1">
                  {{ localData.selectedProduct?.name }}
                </p>
              </div>
              <button
                @click="showPriceModal = false"
                class="w-7 h-7 ml-4 shrink-0 rounded-full bg-white/25 hover:bg-white/40 text-white flex items-center justify-center transition text-xl leading-none"
              >
                &times;
              </button>
            </div>

            <!-- ── Body ── -->
            <div class="px-6 pt-5 pb-2 space-y-4">
              <!-- FIX: Adults & Children Count — shown inside the modal -->
              <div class="grid grid-cols-2 gap-3">
                <!-- Adults -->
                <div class="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p
                    class="text-xs font-medium text-slate-500 mb-2 text-center"
                  >
                    Adults
                  </p>
                  <div class="flex items-center justify-between gap-1">
                    <button
                      @click="
                        localData.adults = Math.max(1, localData.adults - 1)
                      "
                      class="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-600 font-bold hover:bg-orange-50 hover:border-orange-400 hover:text-orange-600 transition flex items-center justify-center text-lg leading-none"
                    >
                      −
                    </button>
                    <span
                      class="text-2xl font-bold text-slate-800 w-8 text-center"
                    >
                      {{ localData.adults }}
                    </span>
                    <button
                      @click="localData.adults++"
                      class="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-600 font-bold hover:bg-orange-50 hover:border-orange-400 hover:text-orange-600 transition flex items-center justify-center text-lg leading-none"
                    >
                      +
                    </button>
                  </div>
                </div>

                <!-- Children -->
                <div class="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p
                    class="text-xs font-medium text-slate-500 mb-2 text-center"
                  >
                    Children
                  </p>
                  <div class="flex items-center justify-between gap-1">
                    <button
                      @click="
                        localData.children = Math.max(0, localData.children - 1)
                      "
                      class="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-600 font-bold hover:bg-orange-50 hover:border-orange-400 hover:text-orange-600 transition flex items-center justify-center text-lg leading-none"
                    >
                      −
                    </button>
                    <span
                      class="text-2xl font-bold text-slate-800 w-8 text-center"
                    >
                      {{ localData.children }}
                    </span>
                    <button
                      @click="localData.children++"
                      class="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-600 font-bold hover:bg-orange-50 hover:border-orange-400 hover:text-orange-600 transition flex items-center justify-center text-lg leading-none"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <!-- ── Entrance Ticket breakdown ── -->
              <template
                v-if="
                  localData.productType === 'entrance_ticket' &&
                  localData.selectedVariation
                "
              >
                <div class="divide-y divide-slate-100">
                  <div class="flex justify-between items-center py-2.5">
                    <div class="text-sm">
                      <span class="font-medium text-slate-700">Adult</span>
                      <span class="text-slate-400 ml-1.5 text-xs">
                        {{ localData.adults }} x ฿{{
                          localData.selectedVariation.adult_price.toLocaleString()
                        }}
                      </span>
                    </div>
                    <span class="font-semibold text-slate-800 text-sm">
                      ฿{{
                        (
                          localData.selectedVariation.adult_price *
                          localData.adults
                        ).toLocaleString()
                      }}
                    </span>
                  </div>
                  <div
                    v-if="
                      localData.children > 0 &&
                      localData.selectedVariation.child_info?.[0]?.child_price >
                        0
                    "
                    class="flex justify-between items-center py-2.5"
                  >
                    <div class="text-sm">
                      <span class="font-medium text-slate-700">Child</span>
                      <span class="text-slate-400 ml-1.5 text-xs">
                        {{ localData.children }} x ฿{{
                          localData.selectedVariation.child_info[0].child_price.toLocaleString()
                        }}
                      </span>
                    </div>
                    <span class="font-semibold text-slate-800 text-sm">
                      ฿{{
                        (
                          localData.selectedVariation.child_info[0]
                            .child_price * localData.children
                        ).toLocaleString()
                      }}
                    </span>
                  </div>
                </div>
              </template>

              <!-- ── Destination breakdown ── -->
              <template
                v-if="
                  localData.productType === 'destination' &&
                  localData.selectedProduct
                "
              >
                <div class="divide-y divide-slate-100">
                  <div class="flex justify-between items-center py-2.5">
                    <div class="text-sm">
                      <span class="font-medium text-slate-700">Per Person</span>
                      <span class="text-slate-400 ml-1.5 text-xs">
                        {{ localData.adults + localData.children }} pax x ฿{{
                          localData.selectedProduct.selling_price.toLocaleString()
                        }}
                      </span>
                    </div>
                    <span class="font-semibold text-slate-800 text-sm">
                      ฿{{ calculatedSellingPrice.toLocaleString() }}
                    </span>
                  </div>
                </div>
              </template>

              <!-- ── Totals box ── -->
              <div
                class="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 space-y-2"
              >
                <div class="flex justify-between items-center">
                  <span class="text-sm text-slate-500">Cost Price</span>
                  <span class="text-sm font-semibold text-slate-600">
                    ฿{{ calculatedCostPrice.toLocaleString() }}
                  </span>
                </div>
                <div
                  class="flex justify-between items-center pt-2 border-t border-orange-200"
                >
                  <span class="font-bold text-slate-800">Total Selling</span>
                  <span class="text-xl font-bold text-orange-600">
                    ฿{{ calculatedSellingPrice.toLocaleString() }}
                  </span>
                </div>
              </div>
            </div>

            <!-- ── Footer ── -->
            <div class="px-6 py-5 flex gap-3">
              <button
                @click="showPriceModal = false"
                class="flex-1 py-3 rounded-xl border-2 border-slate-300 text-slate-600 font-semibold hover:bg-slate-50 transition text-sm"
              >
                ← Back
              </button>
              <button
                @click="confirmSubmit"
                class="flex-1 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 active:bg-orange-700 transition text-sm"
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
import { computed, reactive, watch, ref } from "vue";
import { useAttractionStore } from "../../stores/attraction";
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  totalDays: Number,
  dayCityMap: Object,
  adults: Number,
  children: Number,
  startDate: String,
  editingIndex: Number,
  editingData: Object,
});

const emit = defineEmits(["submit", "cancel"]);

const attractionStore = useAttractionStore();
const searchQuery = ref("");
const showDropdown = ref(false);
const showPriceModal = ref(false);
let searchTimeout = null;

const focusAction = () => {
  // showDropdown.value = true;
  console.log("this is focus action");
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    if (localData.dayNumber) fetchProductsForDay(localData.dayNumber);
  }, 500);
};

// ─────────────────────────────────────────────
// Custom directive: click-outside
// ─────────────────────────────────────────────
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutsideHandler = (event) => {
      if (!el.contains(event.target)) {
        binding.value();
      }
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

const localData = reactive({
  dayNumber: "",
  type: "Attraction",
  productType: "",
  selectedProduct: null,
  selectedVariation: null,
  name: "",
  variation: "",
  adults: props.adults ?? 2,
  children: props.children ?? 0,
  costPrice: 0,
  sellingPrice: 0,
  productImage: null,
  images: [],
});

// ─────────────────────────────────────────────
// Live computed prices
// ─────────────────────────────────────────────
const calculatedSellingPrice = computed(() => {
  if (!localData.selectedProduct) return 0;

  if (
    localData.productType === "entrance_ticket" &&
    localData.selectedVariation
  ) {
    const v = localData.selectedVariation;
    const adultTotal = (v.adult_price ?? 0) * localData.adults;
    const childPrice =
      v.child_info?.[0]?.child_price != "null"
        ? v.child_info[0].child_price
        : "null";
    return (
      adultTotal +
      (childPrice != "null" ? childPrice : v.adult_price) * localData.children
    );
  }

  if (localData.productType === "destination") {
    return (
      (localData.selectedProduct.selling_price ?? 0) *
      (localData.adults + localData.children)
    );
  }

  return 0;
});

const calculatedCostPrice = computed(() => {
  if (!localData.selectedProduct) return 0;

  if (
    localData.productType === "entrance_ticket" &&
    localData.selectedVariation
  ) {
    const v = localData.selectedVariation;
    const adultCostTotal = (v.adult_cost_price ?? 0) * localData.adults;
    const childCostPrice =
      v.child_info?.[0]?.child_cost_price != "null"
        ? v.child_info[0].child_cost_price
        : "null";
    return (
      adultCostTotal +
      (childCostPrice != "null" ? childCostPrice : v.adult_cost_price) *
        localData.children
    );
  }

  if (localData.productType === "destination") {
    return (
      (localData.selectedProduct.cost_price ?? 0) *
      (localData.adults + localData.children)
    );
  }

  return 0;
});

// ─────────────────────────────────────────────
// Watch editing data
// ─────────────────────────────────────────────
watch(
  () => props.editingData,
  (newData) => {
    if (newData) {
      Object.assign(localData, newData);
      if (newData.dayNumber) fetchProductsForDay(newData.dayNumber);
    }
  },
  { deep: true, immediate: true },
);

// ─────────────────────────────────────────────
// Day / date helpers
// ─────────────────────────────────────────────
const getDayCitiesText = (dayNumber) => {
  const cities = props.dayCityMap[dayNumber];
  if (!cities || cities.length === 0) return "";
  return ` (${cities.map((c) => c.name).join(" → ")})`;
};

const getDayDateShort = (dayNumber) => {
  if (!props.startDate) return "";
  const start = new Date(props.startDate);
  const d = new Date(start);
  d.setDate(start.getDate() + dayNumber - 1);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getDayDateRaw = (dayNumber) => {
  if (!props.startDate) return "";
  const start = new Date(props.startDate);
  const d = new Date(start);
  d.setDate(start.getDate() + dayNumber - 1);
  return d.toISOString().split("T")[0];
};

// ─────────────────────────────────────────────
// Fetch products
// ─────────────────────────────────────────────
const fetchProductsForDay = async (dayNumber) => {
  const cities = props.dayCityMap[dayNumber];
  if (!cities || cities.length === 0) return;
  const cityIds = cities.map((c) => c.id);
  await attractionStore.fetchProductsByCities(
    cityIds,
    searchQuery.value,
    "both",
  );
  if (attractionStore.allProducts.length > 0) showDropdown.value = true;
};

const onDayChange = () => {
  localData.productType = "";
  localData.selectedProduct = null;
  localData.selectedVariation = null;
  searchQuery.value = "";
  showDropdown.value = false;
  attractionStore.clearProducts();
};

const onSearchChange = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    if (localData.dayNumber) fetchProductsForDay(localData.dayNumber);
  }, 500);
};

// ─────────────────────────────────────────────
// Product / variation selection
// ─────────────────────────────────────────────
const selectProduct = (product) => {
  console.log(product, "this is selected product");

  localData.selectedProduct = product;
  localData.productType = product.type;
  localData.selectedVariation = null;
  localData.name = product.name;
  localData.productImage = product.cover_image || product.feature_img;
  localData.images = product.images;
  showDropdown.value = false;
};

const clearSelection = () => {
  localData.selectedProduct = null;
  localData.productType = "";
  localData.selectedVariation = null;
  searchQuery.value = "";
  showDropdown.value = false;
};

const selectVariation = (variation) => {
  localData.selectedVariation = variation;
  localData.name = variation.name;
  localData.variation = variation.description;
};

// ─────────────────────────────────────────────
// Computed helpers
// ─────────────────────────────────────────────
const allMixedProducts = computed(() =>
  [...attractionStore.entranceTickets, ...attractionStore.destinations].slice(
    0,
    10,
  ),
);

const availableVariations = computed(() => {
  if (!localData.selectedProduct || localData.productType !== "entrance_ticket")
    return [];
  return localData.selectedProduct.variations || [];
});

const canSubmit = computed(() => {
  if (!localData.dayNumber || !localData.selectedProduct) return false;
  if (
    localData.productType === "entrance_ticket" &&
    !localData.selectedVariation
  )
    return false;
  return true;
});

// ─────────────────────────────────────────────
// Modal open → confirm flow
// ─────────────────────────────────────────────
const openPriceSummaryModal = () => {
  if (!canSubmit.value) return;
  showPriceModal.value = true;
  console.log(localData);
};

const confirmSubmit = () => {
  showPriceModal.value = false;

  const dayDate = getDayDateRaw(localData.dayNumber);
  const cities = props.dayCityMap[localData.dayNumber] || [];

  let attraction = {
    type: localData.type,
    dayNumber: localData.dayNumber,
    serviceDate: dayDate,
    cities,
    city: cities.map((c) => c.name).join(" → "),
    dayLabel: getDayDateShort(localData.dayNumber),
    productType: localData.productType,
    productId: localData.selectedProduct.id,
    productName: localData.selectedProduct.name,
    productImage: localData.productImage,
    images: localData.images,
    name: localData.name,
    adults: localData.adults,
    children: localData.children,
    costPrice: calculatedCostPrice.value,
    sellingPrice: calculatedSellingPrice.value,
  };

  if (localData.productType === "entrance_ticket") {
    const v = localData.selectedVariation;
    const childPrice = v.child_info?.[0]?.child_price ?? 0;
    const childCostPrice = v.child_info?.[0]?.child_cost_price ?? 0;

    attraction = {
      ...attraction,
      variationId: v.id,
      variation: v.description,
      adultPrice: v.adult_price,
      childPrice,
      adultCostPrice: v.adult_cost_price,
      childCostPrice,
      adultTotal: v.adult_price * localData.adults,
      childTotal: childPrice * localData.children,
      adultCostTotal: v.adult_cost_price * localData.adults,
      childCostTotal: childCostPrice * localData.children,
    };
  } else {
    attraction = {
      ...attraction,
      unitCostPrice: localData.selectedProduct.cost_price,
      unitSellingPrice: localData.selectedProduct.selling_price,
      destinationCity: localData.selectedProduct.city,
      destinationCityId: localData.selectedProduct.city_id,
    };
  }

  emit("submit", attraction);

  // Reset form if adding new
  if (props.editingIndex === null) {
    Object.assign(localData, {
      dayNumber: null,
      type: "Attraction",
      productType: "",
      selectedProduct: null,
      selectedVariation: null,
      name: "",
      variation: "",
      adults: props.adults ?? 2,
      children: props.children ?? 0,
      costPrice: 0,
      sellingPrice: 0,
    });
    searchQuery.value = "";
    showDropdown.value = false;
    attractionStore.clearProducts();
  }
};
</script>

<style scoped>
/* ── Modal fade + scale-up animation ── */
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
