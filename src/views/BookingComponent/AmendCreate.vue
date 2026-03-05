<template>
  <div class="relative">
    <!-- Delete Request Button -->
    <!-- <div class="absolute -top-12 right-0">
      
    </div> -->

    <div class="space-y-1" v-if="amendData != null">
      <!-- Service Date -->
      <div class="grid grid-cols-9 gap-x-4 py-1 pt-3">
        <div
          class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-3"
        >
          <label
            class="text-[12px] text-[#FF613c] font-semibold flex items-center"
          >
            <CalendarIcon class="w-4 h-4 mr-2" /> Service date
          </label>
          <p class="font-medium text-sm">{{ amendData.service_date }}</p>
        </div>
        <div class="flex justify-center items-center">
          <ArrowRightCircleIcon
            class="w-7 h-7"
            :class="
              isChanged('service_date') ? 'text-red-600' : 'text-gray-400'
            "
          />
        </div>
        <div
          class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-2"
        >
          <label
            class="text-[12px] text-[#FF613c] font-semibold flex items-center"
          >
            <CalendarIcon class="w-4 h-4 mr-2" /> Service date
          </label>
          <input
            type="date"
            v-model="form.service_date"
            @change="onHotelDateChange"
            class="border border-blue-600 w-[150px] px-2 py-2 rounded-lg text-xs focus:outline-none"
          />
        </div>
      </div>

      <!-- Hotel: Checkout Date -->
      <div class="grid grid-cols-9 gap-x-4 py-1" v-if="isHotel">
        <div
          class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-3"
        >
          <label
            class="text-[12px] text-[#FF613c] font-semibold flex items-center"
          >
            <CalendarIcon class="w-4 h-4 mr-2" /> Checkout Date
          </label>
          <p class="font-medium text-sm">{{ amendData.checkout_date }}</p>
        </div>
        <div class="flex justify-center items-center">
          <ArrowRightCircleIcon
            class="w-7 h-7"
            :class="
              isChanged('checkout_date') ? 'text-red-600' : 'text-gray-400'
            "
          />
        </div>
        <div
          class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-2"
        >
          <label
            class="text-[12px] text-[#FF613c] font-semibold flex items-center"
          >
            <CalendarIcon class="w-4 h-4 mr-2" /> Checkout Date
          </label>
          <input
            type="date"
            v-model="form.checkout_date"
            @change="onHotelDateChange"
            class="border border-blue-600 w-[150px] px-2 py-2 rounded-lg text-xs focus:outline-none"
          />
        </div>
      </div>

      <!-- Hotel: Duration -->
      <div class="grid grid-cols-9 gap-x-4 py-1" v-if="isHotel">
        <div
          class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-3"
        >
          <label
            class="text-[12px] text-[#FF613c] font-semibold flex items-center"
          >
            <ClockIcon class="w-4 h-4 mr-2" /> Duration
          </label>
          <p class="text-sm font-medium">
            {{ amendData.days }} Night x {{ amendData.quantity }} Rooms
          </p>
        </div>
        <div class="flex justify-center items-center">
          <ArrowRightCircleIcon class="w-7 h-7 text-gray-400" />
        </div>
        <div
          class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-3 bg-gray-50"
        >
          <label
            class="text-[12px] text-[#FF613c] font-semibold flex items-center"
          >
            <ClockIcon class="w-4 h-4 mr-2" /> Duration
          </label>
          <p class="text-xs font-medium">
            <span v-if="isLoadingPrice" class="text-gray-400">Loading...</span>
            <span v-else>{{ newDays }} Night x {{ form.quantity }} Rooms</span>
          </p>
        </div>
      </div>

      <!-- Quantity -->
      <div class="grid grid-cols-9 gap-x-4 py-1">
        <div
          class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-3"
        >
          <label
            class="text-[12px] text-[#FF613c] font-semibold flex items-center"
          >
            <CalculatorIcon class="w-4 h-4 mr-2" />
            {{ isHotel ? "Total Rooms" : "Quantity" }}
          </label>
          <p class="text-sm font-medium">{{ amendData.quantity }}</p>
        </div>
        <div class="flex justify-center items-center">
          <ArrowRightCircleIcon
            class="w-7 h-7"
            :class="isChanged('quantity') ? 'text-red-600' : 'text-gray-400'"
          />
        </div>
        <div
          class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-2"
        >
          <label
            class="text-[12px] text-[#FF613c] font-semibold flex items-center"
          >
            <CalculatorIcon class="w-4 h-4 mr-2" />
            {{ isHotel ? "Total Rooms" : "Quantity" }}
          </label>
          <input
            type="number"
            v-model="form.quantity"
            class="border border-blue-600 w-[150px] px-2 py-2 rounded-lg text-xs focus:outline-none"
          />
        </div>
      </div>

      <!-- Child Quantity — Attraction (type 4) only, child_info ရှိမှ ပြမည် -->
      <div class="grid grid-cols-9 gap-x-4 py-1" v-if="hasChildInfo">
        <div
          class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-3"
        >
          <label class="text-xs text-[#FF613c] flex items-center">
            <CalculatorIcon class="w-4 h-4 mr-2" />
            Child Qty ({{ childSellPrice }} ฿)
          </label>
          <p class="text-sm font-medium">{{ childPricing?.quantity ?? 0 }}</p>
        </div>
        <div class="flex justify-center items-center">
          <ArrowRightCircleIcon
            class="w-7 h-7"
            :class="
              isChanged('child_quantity') ? 'text-red-600' : 'text-gray-400'
            "
          />
        </div>
        <div
          class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-2"
        >
          <label class="text-xs text-[#FF613c] flex items-center">
            <CalculatorIcon class="w-4 h-4 mr-2" /> Child Qty
          </label>
          <input
            type="number"
            v-model="form.child_quantity"
            class="border border-blue-600 w-[150px] px-2 py-2 rounded-lg text-xs focus:outline-none"
          />
        </div>
      </div>

      <!-- Selling Price -->
      <!-- <div class="grid grid-cols-9 gap-x-4 py-1">
        <div
          class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-3"
        >
          <label
            class="text-[12px] text-[#FF613c] font-semibold flex items-center"
          >
            <CurrencyDollarIcon class="w-4 h-4 mr-2" /> Selling Price
          </label>
          <p class="text-sm font-medium">{{ amendData.selling_price }} ฿</p>
        </div>
        <div class="flex justify-center items-center">
          <ArrowRightCircleIcon
            class="w-7 h-7"
            :class="
              isChanged('selling_price') ? 'text-red-600' : 'text-gray-400'
            "
          />
        </div>
        <div
          class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-2"
        >
          <label
            class="text-[12px] text-[#FF613c] font-semibold flex items-center"
          >
            <CurrencyDollarIcon class="w-4 h-4 mr-2" /> Selling Price
          </label>
          <input
            type="number"
            v-model="form.selling_price"
            :disabled="isLoadingPrice"
            class="border border-blue-600 w-[150px] px-2 py-2 rounded-lg text-xs focus:outline-none disabled:bg-gray-100"
          />
        </div>
      </div> -->

      <!-- Cost Price -->
      <!-- <div class="grid grid-cols-9 gap-x-4 py-1">
        <div
          class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-3"
        >
          <label
            class="text-[12px] text-[#FF613c] font-semibold flex items-center"
          >
            <BanknotesIcon class="w-4 h-4 mr-2" /> Cost Price
          </label>
          <p class="text-sm font-medium">{{ amendData.cost_price }} ฿</p>
        </div>
        <div class="flex justify-center items-center">
          <ArrowRightCircleIcon
            class="w-7 h-7"
            :class="isChanged('cost_price') ? 'text-red-600' : 'text-gray-400'"
          />
        </div>
        <div
          class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-2"
        >
          <label
            class="text-[12px] text-[#FF613c] font-semibold flex items-center"
          >
            <BanknotesIcon class="w-4 h-4 mr-2" /> Cost Price
          </label>
          <input
            type="number"
            v-model="form.cost_price"
            :disabled="isLoadingPrice"
            class="border border-blue-600 w-[150px] px-2 py-2 rounded-lg text-xs focus:outline-none disabled:bg-gray-100"
          />
        </div>
      </div> -->

      <!-- Variation — car_list ရှိမှ ပြမည် -->
      <!-- <div
        class="grid grid-cols-9 gap-x-4 py-1"
        v-if="amendData.car_list?.length > 0"
      >
        <div
          class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-3"
        >
          <label
            class="text-[12px] text-[#FF613c] font-semibold flex items-center"
          >
            <ArrowPathIcon class="w-4 h-4 mr-2" /> Variation
          </label>
          <p class="text-sm font-medium text-end">{{ amendData.item_name }}</p>
        </div>
        <div class="flex justify-center items-center">
          <ArrowRightCircleIcon
            class="w-7 h-7"
            :class="
              isChanged('variation_id') ? 'text-red-600' : 'text-gray-400'
            "
          />
        </div>
        <div
          class="col-span-4 border border-gray-200 rounded-lg flex justify-between items-center px-4 py-2"
        >
          <select
            v-model="form.variation_id"
            @change="onVariationChange"
            class="border border-blue-600 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
          >
            <option
              v-for="car in amendData.car_list"
              :key="car.id"
              :value="car.id"
            >
              {{ car.name }}
            </option>
          </select>
        </div>
      </div> -->

      <!-- Total Summary -->
      <div
        class="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-2"
      >
        <p class="text-xs font-semibold text-gray-600 mb-3">Total Summary</p>

        <div
          class="grid grid-cols-3 gap-2 text-center text-[10px] text-gray-500 font-medium pb-1 border-b border-gray-200"
        >
          <span class="text-left">Item</span>
          <span>Current</span>
          <span>New</span>
        </div>

        <!-- Breakdown rows -->
        <div
          class="grid grid-cols-3 gap-2 text-[10px] items-center text-gray-400"
        >
          <span>{{ isHotel ? "Rooms × Price" : "Qty × Price" }}</span>
          <span class="text-center">
            {{ amendData.quantity }} × {{ amendData.selling_price }}
          </span>
          <span class="text-center">
            {{ form.quantity }} × {{ form.selling_price }}
          </span>
        </div>

        <div
          class="grid grid-cols-3 gap-2 text-[10px] items-center text-gray-400"
          v-if="hasChildInfo"
        >
          <span>Child Qty × Price</span>
          <span class="text-center">
            {{ childPricing?.quantity ?? 0 }} × {{ childSellPrice }}
          </span>
          <span class="text-center">
            {{ form.child_quantity }} × {{ childSellPrice }}
          </span>
        </div>

        <div
          class="grid grid-cols-3 gap-2 text-[10px] items-center text-gray-400"
        >
          <span>Discount</span>
          <span class="text-center">-{{ amendData.discount ?? 0 }}</span>
          <span class="text-center">-{{ amendData.discount ?? 0 }}</span>
        </div>

        <div class="border-t border-gray-200 pt-2 space-y-1">
          <div class="grid grid-cols-3 gap-2 text-xs items-center font-medium">
            <span class="text-gray-600">Total Selling</span>
            <span class="text-center">{{ currentTotalAmount }} ฿</span>
            <span
              class="text-center"
              :class="
                newTotalAmount != currentTotalAmount
                  ? 'text-green-600'
                  : 'text-gray-700'
              "
            >
              <span v-if="isLoadingPrice" class="text-gray-400">...</span>
              <span v-else>{{ newTotalAmount }} ฿</span>
            </span>
          </div>

          <div class="grid grid-cols-3 gap-2 text-xs items-center font-medium">
            <span class="text-gray-600">Total Cost</span>
            <span class="text-center">{{ currentTotalCostPrice }} ฿</span>
            <span
              class="text-center"
              :class="
                newTotalCostPrice != currentTotalCostPrice
                  ? 'text-orange-600'
                  : 'text-gray-700'
              "
            >
              <span v-if="isLoadingPrice" class="text-gray-400">...</span>
              <span v-else>{{ newTotalCostPrice }} ฿</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end items-center gap-x-2 pt-4">
      <button
        @click="amendCloseAction"
        class="bg-white text-[#FF613c] border border-[#FF613c] px-4 py-2.5 rounded-lg text-xs"
      >
        Cancel
      </button>
      <button
        @click="amendRequestDelete"
        class="bg-red-600 text-white px-4 py-2.5 rounded-lg text-xs"
      >
        Amend Delete Request
      </button>
      <button
        @click="submitAmend"
        class="bg-[#ff613c] text-white px-4 py-2.5 rounded-lg text-xs"
      >
        Amend Request Create
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { daysBetween } from "../help/DateBetween";
import Swal from "sweetalert2";
import { useAmendStore } from "../../stores/amend";
import { useHotelStore } from "../../stores/hotel";
import { useToast } from "vue-toastification";
import {
  ArrowPathIcon,
  ArrowRightCircleIcon,
  CalculatorIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
} from "@heroicons/vue/24/outline";

const props = defineProps({
  amendData: { type: Object, default: null },
  amendCloseAction: { type: Function, default: () => {} },
});

const amendStore = useAmendStore();
const hotelStore = useHotelStore();
const toast = useToast();

const isLoadingPrice = ref(false);

const form = ref({
  service_date: null,
  checkout_date: null,
  quantity: null,
  child_quantity: null,
  selling_price: null,
  cost_price: null,
  variation_id: null,
  variation_name: null,
});

// ================================================================
// HELPERS
// ================================================================

const isHotel = computed(() => props.amendData?.product_type == 6);

// individual_pricing — string ဖြစ်တာကို parse လုပ်မည်
const individualPricing = computed(() => {
  const raw = props.amendData?.individual_pricing;
  if (!raw) return null;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return raw;
});

// child_info — string ဖြစ်တာကို parse လုပ်မည်
const childInfo = computed(() => {
  const raw = props.amendData?.child_info;
  if (!raw) return [];
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
  return Array.isArray(raw) ? raw : [];
});

// child ရှိ/မရှိ — type 4 (attraction) နဲ့ child_info ရှိမှ true
const hasChildInfo = computed(() => {
  return props.amendData?.product_type == 4 && childInfo.value.length > 0;
});

const childPricing = computed(() => individualPricing.value?.child ?? null);

// child selling/cost price — child_info[0] မှ ယူမည်
const childSellPrice = computed(
  () => parseFloat(childInfo.value[0]?.child_price) || 0,
);
const childCostPrice = computed(
  () => parseFloat(childInfo.value[0]?.child_cost_price) || 0,
);

const newDays = computed(() => {
  if (!form.value.service_date || !form.value.checkout_date) {
    return props.amendData?.days ?? 0;
  }
  return daysBetween(form.value.service_date, form.value.checkout_date);
});

const isChanged = (field) => {
  const d = props.amendData;
  if (!d) return false;
  switch (field) {
    case "service_date":
      return form.value.service_date !== d.service_date;
    case "checkout_date":
      return form.value.checkout_date !== d.checkout_date;
    case "quantity":
      return form.value.quantity != d.quantity;
    case "child_quantity":
      return form.value.child_quantity != (childPricing.value?.quantity ?? 0);
    case "selling_price":
      return form.value.selling_price != d.selling_price;
    case "cost_price":
      return form.value.cost_price != d.cost_price;
    case "variation_id":
      return form.value.variation_id != d.car_id;
    default:
      return false;
  }
};

// ================================================================
// CALCULATION — getFunction() logic အတိုင်း
//
// HOTEL (days > 1):
//   total_amount     = qty × selling_price - discount
//   total_cost_price = qty × cost_price
//   * selling_price = period API total (all nights combined) — qty × only
//
// VAN TOUR (type 1) / TICKET (type 7):
//   total_amount     = qty × selling_price - discount
//   total_cost_price = qty × cost_price
//   * child မရှိ
//
// ATTRACTION (type 4):
//   total_amount     = (adult_qty × adult_price) - discount + (child_qty × child_price)
//   total_cost_price = (adult_qty × adult_cost)  + (child_qty × child_cost)
// ================================================================

const currentTotalAmount = computed(() => {
  const d = props.amendData;
  if (!d) return "0.00";

  const qty = parseFloat(d.quantity) || 0;
  const price = parseFloat(d.selling_price) || 0;
  const discount = parseFloat(d.discount) || 0;
  const days = parseFloat(d.days) || 1;

  if (days > 1) {
    // HOTEL
    return (qty * price - discount).toFixed(2);
  } else {
    // VAN TOUR / ATTRACTION / TICKET
    // child.amount = child_qty × child_selling_price (stored in individual_pricing)
    const childAmt = parseFloat(childPricing.value?.amount) || 0;
    return (qty * price - discount + childAmt).toFixed(2);
  }
});

const currentTotalCostPrice = computed(() => {
  const d = props.amendData;
  if (!d) return "0.00";

  const qty = parseFloat(d.quantity) || 0;
  const cost = parseFloat(d.cost_price) || 0;
  const days = parseFloat(d.days) || 1;

  if (days > 1) {
    // HOTEL
    return (qty * cost).toFixed(2);
  } else {
    // VAN TOUR / ATTRACTION / TICKET
    const childCostTotal =
      parseFloat(childPricing.value?.total_cost_price) || 0;
    return (qty * cost + childCostTotal).toFixed(2);
  }
});

const newTotalAmount = computed(() => {
  const d = props.amendData;
  if (!d) return "0.00";

  const qty = parseFloat(form.value.quantity) || 0;
  const price = parseFloat(form.value.selling_price) || 0;
  const discount = parseFloat(d.discount) || 0;
  const days = parseFloat(newDays.value) || 1;

  if (days > 1) {
    // HOTEL: selling_price = period API total → qty × price only
    return (qty * price - discount).toFixed(2);
  } else {
    // child: new child_qty × child_info selling price
    const childQty = parseFloat(form.value.child_quantity) || 0;
    const childAmt = childQty * childSellPrice.value;
    return (qty * price - discount + childAmt).toFixed(2);
  }
});

const newTotalCostPrice = computed(() => {
  const d = props.amendData;
  if (!d) return "0.00";

  const qty = parseFloat(form.value.quantity) || 0;
  const cost = parseFloat(form.value.cost_price) || 0;
  const days = parseFloat(newDays.value) || 1;

  if (days > 1) {
    // HOTEL
    return (qty * cost).toFixed(2);
  } else {
    const childQty = parseFloat(form.value.child_quantity) || 0;
    const childCostTotal = childQty * childCostPrice.value;
    return (qty * cost + childCostTotal).toFixed(2);
  }
});

// ================================================================
// HOTEL DATE CHANGE → period price API
// ================================================================
const onHotelDateChange = async () => {
  if (!isHotel.value) return;
  if (!form.value.service_date || !form.value.checkout_date) return;

  const roomId = props.amendData?.car_id;
  if (!roomId) return;

  isLoadingPrice.value = true;
  try {
    const res = await hotelStore.getRoomPrice(
      {
        checkin_date: form.value.service_date,
        checkout_date: form.value.checkout_date,
      },
      roomId,
    );
    if (res?.data) {
      form.value.selling_price = res.data.total_sale_price;
      form.value.cost_price = res.data.total_cost_price;
    }
  } catch {
    toast.error("This room is deleted so can't change");
  } finally {
    isLoadingPrice.value = false;
  }
};

// ================================================================
// VARIATION CHANGE
// ================================================================
const onVariationChange = () => {
  const selected = props.amendData?.car_list?.find(
    (c) => c.id === form.value.variation_id,
  );
  if (selected) form.value.variation_name = selected.name;
};

// ================================================================
// SUBMIT AMEND
// ================================================================
const submitAmend = () => {
  const fields = [
    "service_date",
    "checkout_date",
    "quantity",
    "child_quantity",
    "selling_price",
    "cost_price",
    "variation_id",
  ];
  const hasChange = fields.some((f) => isChanged(f));

  if (!hasChange) {
    Swal.fire({ title: "No changes detected", icon: "info" });
    return;
  }

  Swal.fire({
    title: "Create Amend Request?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, create!",
  }).then(async (result) => {
    if (!result.isConfirmed) return;

    const d = props.amendData;

    const changes = {
      // ── Previous values ──
      current_service_date: d.service_date,
      current_checkout_date: d.checkout_date,
      current_quantity: d.quantity,
      current_child_quantity: childPricing.value?.quantity ?? 0,
      current_selling_price: d.selling_price,
      current_cost_price: d.cost_price,
      current_variation_id: d.car_id,
      current_variation_name: d.item_name,
      current_total_amount: currentTotalAmount.value,
      current_total_cost_price: currentTotalCostPrice.value,
      // ✅ ဒါများ ထပ်ထည့်ရမည် — child previous prices
      current_child_selling_price: childSellPrice.value,
      current_child_cost_price: childCostPrice.value,

      // ── New values ──
      service_date: form.value.service_date,
      checkout_date: form.value.checkout_date,
      quantity: form.value.quantity,
      child_quantity: form.value.child_quantity,
      selling_price: form.value.selling_price,
      cost_price: form.value.cost_price,
      variation_id: form.value.variation_id,
      variation_name: form.value.variation_name,
      // ✅ ဒါများ ထပ်ထည့်ရမည် — child new prices (same prices, only qty changes)
      child_selling_price: childSellPrice.value,
      child_cost_price: childCostPrice.value,

      // ── Calculated totals (getFunction logic) ──
      total_amount: newTotalAmount.value,
      total_cost_price: newTotalCostPrice.value,
    };

    const frmData = new FormData();
    frmData.append("booking_item_id", d.reservation_id);
    frmData.append("changes", JSON.stringify(changes));

    const res = await amendStore.addNewAction(frmData);
    if (res.status == 1) {
      toast.success("Amend request created successfully.");
      props.amendCloseAction();
    } else {
      toast.error("Failed to create amend request.");
    }
  });
};

// ================================================================
// DELETE REQUEST
// ================================================================
const amendRequestDelete = () => {
  Swal.fire({
    title: "Delete Request?",
    text: "This will request to remove this booking item.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Yes, request delete!",
  }).then(async (result) => {
    if (!result.isConfirmed) return;

    const changes = {
      delete: true,
      total_amount: currentTotalAmount.value,
      total_cost_price: currentTotalCostPrice.value,
    };

    const frmData = new FormData();
    frmData.append("booking_item_id", props.amendData.reservation_id);
    frmData.append("changes", JSON.stringify(changes));

    const res = await amendStore.addNewAction(frmData);
    if (res.status == 1) {
      toast.success("Delete request created successfully.");
      props.amendCloseAction();
    } else {
      toast.error("Failed to create delete request.");
    }
  });
};

// ================================================================
// INIT FORM
// ================================================================
watch(
  () => props.amendData,
  (d) => {
    if (!d) return;

    const pricing = (() => {
      const raw = d.individual_pricing;
      if (!raw) return null;
      if (typeof raw === "string") {
        try {
          return JSON.parse(raw);
        } catch {
          return null;
        }
      }
      return raw;
    })();

    form.value = {
      service_date: d.service_date,
      checkout_date: d.checkout_date,
      quantity: d.quantity,
      child_quantity: pricing?.child?.quantity ?? 0,
      selling_price: d.selling_price,
      cost_price: d.cost_price,
      variation_id: d.car_id,
      variation_name: d.item_name,
    };
  },
  { immediate: true },
);
</script>
