<template>
  <Modal :isOpen="isOpen" @closeModal="handleClose" :marginTop="5">
    <DialogPanel
      class="w-full max-w-5xl transform rounded-2xl bg-white text-left align-middle shadow-2xl transition-all max-h-[75vh] overflow-hidden flex flex-col"
    >
      <!-- Header -->
      <DialogTitle
        as="div"
        class="text-sm text-white bg-gradient-to-r from-[#FF613c] to-[#ff7c5c] font-semibold leading-6 flex justify-between items-center py-3 px-5"
      >
        <div class="flex items-center gap-2.5">
          <div class="bg-white/20 p-1.5 rounded-lg">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <p class="text-base">Edit Item Costs</p>
            <span class="text-xs font-normal opacity-90">
              Booking ID: {{ groupData?.booking_crm_id }}
            </span>
          </div>
        </div>
        <button
          @click="closeAction"
          class="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
        >
          <XMarkIcon class="w-5 h-5 text-white" />
        </button>
      </DialogTitle>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6 bg-gray-50">
        <!-- Page Header -->
        <div class="mb-6">
          <h3 class="text-xl font-bold text-gray-900 mb-1">Cost Management</h3>
          <p class="text-xs text-gray-600">
            Update the cost price for each item in this booking. Changes will be
            saved when you click "Save All Changes".
          </p>
        </div>

        <!-- Items Grid -->
        <div class="grid grid-cols-1 gap-4">
          <div
            v-for="(item, index) in localItems"
            :key="item.id"
            class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            <div class="p-5">
              <!-- Card Header -->
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div
                    class="bg-[#FF613c]/10 text-[#FF613c] px-3 py-1.5 rounded-lg font-semibold text-xs"
                  >
                    {{ groupData?.items[index]?.crm_id?.split("_")[1] }}
                  </div>
                  <div>
                    <h4 class="text-base font-semibold text-gray-900 mb-0.5">
                      <span
                        v-if="
                          item.product_type == 'App\\Models\\EntranceTicket'
                        "
                      >
                        {{ groupData?.items[index]?.variation?.name }}
                      </span>
                      <span v-if="item.product_type == 'App\\Models\\Hotel'">
                        {{ groupData?.items[index]?.room?.name }}
                      </span>
                      <span
                        v-if="
                          item.product_type == 'App\\Models\\PrivateVanTour'
                        "
                      >
                        {{ groupData?.items[index]?.car?.name }}
                      </span>
                    </h4>
                    <div class="flex items-center gap-2 text-xs text-gray-500">
                      <span class="inline-flex items-center gap-1">
                        <svg
                          class="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                        <span
                          v-if="
                            item.product_type == 'App\\Models\\EntranceTicket'
                          "
                          >Entrance Ticket</span
                        >
                        <span v-if="item.product_type == 'App\\Models\\Hotel'"
                          >Hotel</span
                        >
                        <span
                          v-if="
                            item.product_type == 'App\\Models\\PrivateVanTour'
                          "
                          >Private Van Tour</span
                        >
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Total Cost Badge -->
                <div class="text-right">
                  <p class="text-xs text-gray-500 mb-0.5">Total Cost</p>
                  <div
                    v-if="item.product_type != 'App\\Models\\Hotel'"
                    class="text-xl font-bold text-[#FF613c]"
                  >
                    {{ formattedNumber(item.total_cost_price) }}
                    <span class="text-xs text-gray-500">THB</span>
                  </div>
                  <input
                    v-if="item.product_type == 'App\\Models\\Hotel'"
                    type="text"
                    v-model="displayValues[index]"
                    @input="handleInput(index)"
                    @focus="handleFocus(index)"
                    @blur="handleBlur(index)"
                    :placeholder="
                      formattedNumber(groupData?.items[index]?.total_cost_price)
                    "
                    class="text-xl font-bold text-[#FF613c] text-right bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-1.5 w-40 focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
                  />
                </div>
              </div>

              <!-- Card Content -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- Date Information -->
                <div
                  v-if="
                    item.product_type == 'App\\Models\\EntranceTicket' ||
                    item.product_type == 'App\\Models\\PrivateVanTour'
                  "
                  class="space-y-1.5"
                >
                  <label
                    class="text-xs font-medium text-gray-500 uppercase tracking-wide"
                    >Service Date</label
                  >
                  <div class="flex items-center gap-2 text-gray-900 text-sm">
                    <svg
                      class="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span class="font-medium">{{
                      groupData?.items[index]?.service_date
                    }}</span>
                  </div>
                </div>

                <div
                  v-if="item.product_type == 'App\\Models\\Hotel'"
                  class="space-y-1.5"
                >
                  <label
                    class="text-xs font-medium text-gray-500 uppercase tracking-wide"
                    >Check-in Date</label
                  >
                  <div class="flex items-center gap-2 text-gray-900 text-sm">
                    <svg
                      class="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span class="font-medium">{{
                      groupData?.items[index]?.checkin_date
                    }}</span>
                  </div>
                </div>

                <div
                  v-if="item.product_type == 'App\\Models\\Hotel'"
                  class="space-y-1.5"
                >
                  <label
                    class="text-xs font-medium text-gray-500 uppercase tracking-wide"
                    >Check-out Date</label
                  >
                  <div class="flex items-center gap-2 text-gray-900 text-sm">
                    <svg
                      class="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span class="font-medium">{{
                      groupData?.items[index]?.checkout_date
                    }}</span>
                  </div>
                </div>

                <!-- Quantity/Nights Information -->
                <div
                  v-if="item.product_type == 'App\\Models\\Hotel'"
                  class="space-y-1.5"
                >
                  <label
                    class="text-xs font-medium text-gray-500 uppercase tracking-wide"
                    >Duration & Quantity</label
                  >
                  <div class="flex items-center gap-2 text-gray-900 text-sm">
                    <svg
                      class="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <span class="font-medium"
                      >{{ item.stay_nights }}N, {{ item.quantity }} Rooms</span
                    >
                  </div>
                  <button
                    @click="
                      showItemPriceBreakdown(groupData?.items[index], index)
                    "
                    class="mt-1 inline-flex items-center gap-1.5 text-xs text-[#FF613c] hover:text-[#e55139] font-medium transition-colors"
                  >
                    <svg
                      class="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    View Price Breakdown
                  </button>
                </div>

                <!-- Adult Unit Cost (Entrance Ticket & Private Van) -->
                <div
                  v-if="
                    item.product_type == 'App\\Models\\EntranceTicket' ||
                    item.product_type == 'App\\Models\\PrivateVanTour'
                  "
                  class="space-y-1.5"
                >
                  <label
                    class="text-xs font-medium text-gray-500 uppercase tracking-wide"
                  >
                    {{
                      item.product_type == "App\\Models\\EntranceTicket"
                        ? "Adult Unit Cost"
                        : "Unit Cost"
                    }}
                    *
                  </label>
                  <div class="flex items-center gap-2">
                    <span
                      class="text-xs text-gray-600 bg-gray-100 px-2.5 py-1.5 rounded-lg"
                      >{{ item.quantity }} ×</span
                    >
                    <div class="relative flex-1">
                      <input
                        v-model.number="item.cost_price"
                        type="number"
                        step="0.01"
                        @input="calculateTotalCost(index)"
                        class="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent text-sm font-medium"
                        placeholder="0.00"
                      />
                      <span
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400"
                        >THB</span
                      >
                    </div>
                  </div>
                </div>

                <!-- Child Unit Cost (Entrance Ticket only) -->
                <div
                  v-if="
                    item.product_type == 'App\\Models\\EntranceTicket' &&
                    item.individual_pricing?.child?.cost_price != null
                  "
                  class="space-y-1.5"
                >
                  <label
                    class="text-xs font-medium text-gray-500 uppercase tracking-wide"
                    >Child Unit Cost *</label
                  >
                  <div class="flex items-center gap-2">
                    <span
                      class="text-xs text-gray-600 bg-gray-100 px-2.5 py-1.5 rounded-lg"
                      >{{
                        item.individual_pricing?.child?.quantity || 0
                      }}
                      ×</span
                    >
                    <div class="relative flex-1">
                      <input
                        v-model.number="
                          item.individual_pricing.child.cost_price
                        "
                        type="number"
                        step="0.01"
                        @input="calculateTotalCost(index)"
                        class="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent text-sm font-medium"
                        placeholder="0.00"
                      />
                      <span
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400"
                        >THB</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="border-t bg-white p-5 flex items-center justify-between gap-4"
      >
        <div class="flex items-center gap-6">
          <p class="text-sm text-gray-600">
            <span class="font-medium">{{ localItems.length }}</span> item{{
              localItems.length !== 1 ? "s" : ""
            }}
          </p>
          <div class="h-6 w-px bg-gray-300"></div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-gray-600">Grand Total:</span>
            <span class="text-2xl font-bold text-[#FF613c]">{{
              formattedNumber(totalCostAll)
            }}</span>
            <span class="text-sm text-gray-500">THB</span>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="handleClose"
            class="px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleSaveAll"
            :disabled="loading"
            class="px-5 py-2.5 bg-gradient-to-r from-[#FF613c] to-[#ff7c5c] text-white font-medium text-sm rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
          >
            <span v-if="loading">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  fill="none"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </span>
            <svg
              v-else
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Save All Changes
          </button>
        </div>
      </div>

      <!-- Price Breakdown Modal -->
      <Modal
        :isOpen="showPriceBreakdown"
        @closeModal="showPriceBreakdown = false"
      >
        <DialogPanel
          class="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-2xl transition-all"
        >
          <DialogTitle
            as="div"
            class="text-base text-white bg-gradient-to-r from-[#FF613c] to-[#ff7c5c] font-semibold leading-6 flex justify-between items-center py-4 px-6"
          >
            <div class="flex items-center gap-3">
              <div class="bg-white/20 p-2 rounded-lg">
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p>Price Breakdown</p>
            </div>
            <button
              @click="showPriceBreakdown = false"
              class="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <XMarkIcon class="w-6 h-6 text-white" />
            </button>
          </DialogTitle>

          <div class="p-6">
            <div class="bg-gray-50 rounded-xl p-6 mb-6">
              <h4
                class="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide"
              >
                Daily Pricing Breakdown
              </h4>

              <div class="space-y-3">
                <div
                  class="grid grid-cols-3 gap-4 text-xs font-semibold text-gray-600 pb-3 border-b-2 border-gray-200"
                >
                  <div>Date</div>
                  <div class="text-right">Sale Price</div>
                  <div class="text-right">Cost Price</div>
                </div>

                <div
                  v-for="pricing in priceBreakdownData?.daily_pricing"
                  :key="pricing.date"
                  class="grid grid-cols-3 gap-4 text-sm py-3 border-b border-gray-100 hover:bg-white rounded-lg px-2 transition-colors"
                >
                  <div class="font-medium text-gray-900">
                    {{ pricing.date }}
                  </div>
                  <div class="text-right text-gray-700">
                    {{
                      formattedNumber(pricing.sale_price * selectedItemQuantity)
                    }}
                    THB
                  </div>
                  <div class="text-right text-gray-700">
                    {{
                      formattedNumber(pricing.cost_price * selectedItemQuantity)
                    }}
                    THB
                  </div>
                </div>
              </div>
            </div>

            <div
              class="bg-gradient-to-r from-[#FF613c] to-[#ff7c5c] rounded-xl p-6 text-white"
            >
              <div class="grid grid-cols-3 gap-4">
                <div class="font-semibold text-base">Total</div>
                <div class="text-right">
                  <div class="text-xs opacity-90 mb-1">Sale</div>
                  <div class="text-lg font-bold">
                    {{
                      formattedNumber(
                        priceBreakdownData?.total_sale_price *
                          selectedItemQuantity
                      )
                    }}
                    THB
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-xs opacity-90 mb-1">Cost</div>
                  <div class="text-lg font-bold">
                    {{
                      formattedNumber(
                        priceBreakdownData?.total_cost_price *
                          selectedItemQuantity
                      )
                    }}
                    THB
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Modal>
    </DialogPanel>
  </Modal>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import Modal from "../../../components/Modal.vue";
import { useToast } from "vue-toastification";
import { useReservationStore } from "../../../stores/reservation";
import { useHotelStore } from "../../../stores/hotel";
import { useGroupStore } from "../../../stores/group";
import { formattedNumber } from "../../help/FormatData";
import { daysBetween } from "../../help/DateBetween";
import { onMounted } from "vue";

const props = defineProps({
  isOpen: Boolean,
  groupData: Object,
  closeAction: Function,
  refreshAction: Function,
});

const emit = defineEmits(["close", "refresh"]);

const toast = useToast();
const reservationStore = useReservationStore();
const hotelStore = useHotelStore();
const groupStore = useGroupStore();

const loading = ref(false);
const showPriceBreakdown = ref(false);
const priceBreakdownData = ref(null);
const selectedItemQuantity = ref(0);

// Local state for editing - directly bind to these
const localItems = ref([]);
const displayValues = ref([]);

// Calculate total cost for all items
const totalCostAll = computed(() => {
  return localItems.value.reduce(
    (sum, item) => sum + (item.total_cost_price || 0),
    0
  );
});

// Handle input for hotel total cost
const handleInput = (index) => {
  const inputValue = displayValues.value[index] || "";
  const numericValue = inputValue.replace(/[^\d.]/g, "");
  const parsedValue = parseFloat(numericValue) || 0;
  localItems.value[index].total_cost_price = parsedValue;
};

const handleFocus = (index) => {
  // Show the raw number without formatting when focused
  const value = localItems.value[index].total_cost_price;
  displayValues.value[index] = value > 0 ? String(value) : "";
};

const handleBlur = (index) => {
  // Show formatted value when not focused
  const value = localItems.value[index].total_cost_price;
  displayValues.value[index] = value > 0 ? formattedNumber(value) : "";
};

// Calculate total cost for entrance tickets (auto-calculate when inputs change)
const calculateTotalCost = (index) => {
  const item = localItems.value[index];

  if (item.product_type === "App\\Models\\EntranceTicket") {
    let adultCost = (item.cost_price || 0) * (item.quantity || 0);
    let childCost = 0;

    if (item.individual_pricing?.child) {
      childCost =
        (item.individual_pricing.child.cost_price || 0) *
        (item.individual_pricing.child.quantity || 0);
    }

    item.total_cost_price = adultCost + childCost;
  } else if (item.product_type === "App\\Models\\PrivateVanTour") {
    item.total_cost_price = (item.cost_price || 0) * (item.quantity || 0);
  }
};

// Fetch price breakdown for hotels
const showItemPriceBreakdown = async (item, index) => {
  if (item.product_type !== "App\\Models\\Hotel") return;

  try {
    selectedItemQuantity.value = item.quantity;

    const data = {
      checkin_date: item.checkin_date,
      checkout_date: item.checkout_date,
    };

    const res = await hotelStore.getRoomPrice(data, item.room.id);
    if (res?.data) {
      priceBreakdownData.value = res.data;
      showPriceBreakdown.value = true;
    }
  } catch (error) {
    console.error("Error fetching price breakdown:", error);
    toast.error("Failed to fetch price breakdown");
  }
};

// Initialize local data
const initializeLocalData = () => {
  if (props.groupData?.items && props.groupData.items.length > 0) {
    // Initialize local data

    localItems.value = props.groupData.items.map((item) => ({
      id: item.id,
      cost_price: item.cost_price || 0,
      total_cost_price: item.total_cost_price || 0,
      quantity: item.quantity || 0,
      stay_nights:
        item.stay_nights ||
        daysBetween(item.checkin_date, item.checkout_date) ||
        0,
      product_type: item.product_type,
      individual_pricing: item.individual_pricing
        ? JSON.parse(JSON.stringify(item.individual_pricing))
        : null,
    }));

    // Initialize display values with formatted numbers
    displayValues.value = localItems.value.map((item) =>
      item.total_cost_price > 0 ? formattedNumber(item.total_cost_price) : ""
    );

    console.log(localItems.value, "this is item");
  }
};

// Watch for data changes
watch(
  () => props.groupData,
  (newData) => {
    if (newData && newData.items) {
      initializeLocalData();
    }
  },
  { immediate: true, deep: true }
);

// Also watch when modal opens to re-initialize
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && props.groupData?.items) {
      initializeLocalData();
    }
  }
);

// Save all items - matching the reference component logic
const handleSaveAll = async () => {
  loading.value = true;
  let successCount = 0;
  let failCount = 0;

  try {
    if (!localItems.value || localItems.value.length === 0) {
      toast.error("No items found to update");
      loading.value = false;
      return;
    }

    // Process each item
    for (let i = 0; i < localItems.value.length; i++) {
      try {
        const localItem = localItems.value[i];
        const originalItem = props.groupData.items[i];

        // Create form data for the update
        const frmData = new FormData();
        frmData.append("_method", "PUT");

        const costPrice = localItem.cost_price;
        const quantity = localItem.quantity;

        // Handle entrance ticket individual pricing
        if (
          originalItem.product_type == "App\\Models\\EntranceTicket" &&
          localItem.individual_pricing != null
        ) {
          frmData.append(
            "individual_pricing[child][quantity]",
            localItem.individual_pricing?.child?.quantity ?? 0
          );
          frmData.append(
            "individual_pricing[child][selling_price]",
            localItem.individual_pricing?.child?.selling_price ?? 0
          );
          frmData.append(
            "individual_pricing[child][cost_price]",
            localItem.individual_pricing?.child?.cost_price ?? 0
          );
          frmData.append(
            "individual_pricing[child][total_cost_price]",
            (localItem.individual_pricing?.child?.cost_price ?? 0) *
              (localItem.individual_pricing?.child?.quantity ?? 0)
          );
          frmData.append(
            "individual_pricing[child][amount]",
            localItem.individual_pricing?.child?.selling_price
              ? localItem.individual_pricing.child.selling_price *
                  localItem.individual_pricing.child.quantity
              : 0
          );
        }

        // Append cost price
        if (costPrice) frmData.append("cost_price", costPrice);
        if (quantity) frmData.append("quantity", quantity);

        // Calculate and append total cost price based on product type
        if (costPrice) {
          if (originalItem.product_type == "App\\Models\\EntranceTicket") {
            // For tickets: calculate adult cost + child cost
            let childCostTotal = 0;

            if (
              localItem.individual_pricing &&
              localItem.individual_pricing.child
            ) {
              const childCost =
                localItem.individual_pricing.child.cost_price * 1 || 0;
              const childQty =
                localItem.individual_pricing.child.quantity * 1 || 0;
              childCostTotal = childCost * childQty;
            }

            const totalCostPrice = costPrice * quantity + childCostTotal;
            frmData.append("total_cost_price", totalCostPrice);
          } else {
            // For hotels: use the manually entered total cost
            const totalCostPrice = localItem.total_cost_price;
            frmData.append("total_cost_price", totalCostPrice);
          }
        } else if (localItem.total_cost_price) {
          frmData.append("total_cost_price", localItem.total_cost_price);
        }

        // Send update request
        const response = await reservationStore.updateAction(
          frmData,
          localItem.id
        );

        if (response.status == 1) {
          successCount++;
        } else {
          console.error(
            `Failed to update item ${localItem.id}: ${response.message}`
          );
          failCount++;
        }
      } catch (error) {
        console.error(`Error updating item:`, error);
        failCount++;
      }
    }

    // Show appropriate toast based on results
    if (failCount === 0) {
      toast.success(`Successfully updated ${successCount} items`);
      props.refreshAction();
      handleClose();
    } else if (successCount === 0) {
      toast.error(`Failed to update all ${failCount} items`);
    } else {
      toast.info(
        `Updated ${successCount} items, failed to update ${failCount} items`
      );
      props.refreshAction();
    }
  } catch (error) {
    console.error("Error in handleSaveAll:", error);
    toast.error("An unexpected error occurred");
  } finally {
    loading.value = false;
  }
};

const handleClose = () => {
  showPriceBreakdown.value = false;
  props.closeAction();
};
</script>
