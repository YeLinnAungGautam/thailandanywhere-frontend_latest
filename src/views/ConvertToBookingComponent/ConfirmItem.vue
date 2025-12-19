<template>
  <div class="w-full h-full relative">
    <!-- Content -->
    <div class="">
      <!-- Summary Card -->
      <div
        class="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mb-6"
      >
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-500">Total Items</p>
            <p class="text-2xl font-bold text-[#ff613c]">
              {{ selectedRows?.length || 0 }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-500">Grand Total</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ calculateGrandTotal() }} ฿
            </p>
            <p class="text-xs text-red-600 mt-1" v-if="getTotalDiscount() > 0">
              Total Discount: -{{ getTotalDiscount() }} ฿
            </p>
            <p class="text-xs text-gray-500 mt-1">
              Total Cost: {{ calculateTotalCostPrice() }} ฿
            </p>
          </div>
        </div>
      </div>

      <!-- Items List -->
      <div v-if="selectedRows && selectedRows.length > 0" class="space-y-4">
        <!-- Hotel Items -->
        <div
          v-for="(item, index) in selectedRows"
          :key="item.id || index"
          class="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
        >
          <!-- Hotel Type -->
          <div v-if="isHotel(item)">
            <div class="flex items-start gap-3 mb-4">
              <div
                class="bg-[#ff613c] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium flex-shrink-0"
              >
                {{ index + 1 }}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <h3 class="font-semibold text-gray-900 text-lg">
                    {{ item.ownerable?.name || "Hotel Name" }}
                  </h3>
                  <span
                    class="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                  >
                    Hotel
                  </span>
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-1">Room Type</p>
                  <p class="text-sm font-medium text-gray-900">
                    {{ item.variable?.name || "N/A" }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Hotel Details Grid -->
            <div class="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p class="text-xs text-gray-500 mb-1">Check-in</p>
                <p class="text-sm font-medium text-gray-900">
                  {{ formatDate(item.checkin_date) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Check-out</p>
                <p class="text-sm font-medium text-gray-900">
                  {{ formatDate(item.checkout_date) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Nights</p>
                <p class="text-sm font-medium text-gray-900">
                  {{ calculateNights(item.checkin_date, item.checkout_date) }}
                  nights
                </p>
              </div>
            </div>

            <!-- Hotel Pricing -->
            <div class="mt-4 pt-4 border-t border-gray-200">
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <div class="space-y-1">
                    <p class="text-sm text-gray-600">
                      Quantity:
                      <span class="font-medium"
                        >{{ item.quantity || 0 }} room(s)</span
                      >
                    </p>
                    <p class="text-sm text-gray-600">
                      Price per night:
                      <span class="font-medium"
                        >{{ item.variable?.room_price || 0 }} ฿</span
                      >
                    </p>
                    <p class="text-xs text-gray-500">
                      Cost per night:
                      <span class="font-medium"
                        >{{ getCostPrice(item) }} ฿</span
                      >
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-xs text-gray-500">Subtotal</p>
                    <p class="text-lg font-semibold text-gray-900">
                      {{ calculateHotelSubtotal(item) }} ฿
                    </p>
                    <p class="text-xs text-gray-500 mt-1">
                      ({{ item.quantity }} Q ×
                      {{ item.variable?.room_price || 0 }} ฿ ×
                      {{
                        calculateNights(item.checkin_date, item.checkout_date)
                      }}
                      N)
                    </p>
                    <p class="text-xs text-blue-600 mt-1">
                      Total Cost: {{ calculateHotelTotalCost(item) }} ฿
                    </p>
                  </div>
                </div>

                <!-- Discount Input -->
                <div
                  class="flex items-center gap-3 pt-3 border-t border-gray-200"
                >
                  <label class="text-sm font-medium text-gray-700 min-w-[50%]">
                    Discount:
                  </label>
                  <div class="flex items-center gap-2 flex-1">
                    <input
                      type="number"
                      v-model.number="item.discount"
                      @input="updateDiscount(item)"
                      min="0"
                      :max="calculateHotelSubtotal(item)"
                      step="0.01"
                      class="flex-1 px-3 py-2 border border-gray-300 focus:outline-none rounded-lg text-sm focus:ring-2 focus:ring-[#ff613c] focus:border-transparent"
                      placeholder="0.00"
                    />
                    <span class="text-sm text-gray-600">฿</span>
                  </div>
                </div>

                <!-- Total After Discount -->
                <div
                  class="flex justify-between items-center pt-3 border-t-2 border-gray-300"
                >
                  <p class="text-sm font-medium text-gray-700">Total Amount</p>
                  <div class="text-right">
                    <p class="text-2xl font-bold text-[#ff613c]">
                      {{ calculateHotelTotal(item) }} ฿
                    </p>
                    <p
                      class="text-xs text-red-600 mt-1"
                      v-if="item.discount > 0"
                    >
                      (After -{{ item.discount }} ฿ discount)
                    </p>
                    <p class="text-xs text-green-600 mt-1">
                      Profit: {{ calculateHotelProfit(item) }} ฿
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Entrance Ticket Type -->
          <div v-else-if="isEntranceTicket(item)">
            <div class="flex items-start gap-3 mb-4">
              <div
                class="bg-[#ff613c] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium flex-shrink-0"
              >
                {{ index + 1 }}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <h3 class="font-semibold text-gray-900 text-lg">
                    {{ item.ownerable?.name || "Attraction Name" }}
                  </h3>
                  <span
                    class="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full"
                  >
                    Attraction
                  </span>
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-1">Ticket Type</p>
                  <p class="text-sm font-medium text-gray-900">
                    {{
                      item.variable?.name || item.variable?.description || "N/A"
                    }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Ticket Details Grid -->
            <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p class="text-xs text-gray-500 mb-1">Service Date</p>
                <p class="text-sm font-medium text-gray-900">
                  {{ formatDate(item.checkin_date) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Adult Qty</p>
                <p class="text-sm font-medium text-gray-900">
                  {{ item.quantity || 0 }}
                </p>
              </div>
            </div>

            <!-- Ticket Pricing -->
            <div class="mt-4 pt-4 border-t border-gray-200">
              <div class="space-y-3">
                <!-- Adult Pricing -->
                <div class="flex justify-between items-center">
                  <div class="space-y-1">
                    <p class="text-sm font-medium text-gray-700">Adult</p>
                    <p class="text-xs text-gray-600">
                      {{ item.quantity || 0 }} ×
                      {{ item.variable?.price || 0 }} ฿
                    </p>
                    <p class="text-xs text-gray-500">
                      Cost: {{ getAdultCostPrice(item) }} ฿ each
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-lg font-semibold text-gray-900">
                      {{ (item.quantity || 0) * (item.variable?.price || 0) }} ฿
                    </p>
                    <p class="text-xs text-blue-600 mt-1">
                      Cost: {{ calculateAdultTotalCost(item) }} ฿
                    </p>
                  </div>
                </div>

                <!-- Child Pricing (if applicable) -->
                <div
                  v-if="item.child_qty > 0"
                  class="flex justify-between items-center pt-2 border-t border-gray-100"
                >
                  <div class="space-y-1">
                    <p class="text-sm font-medium text-gray-700">Child</p>
                    <p class="text-xs text-gray-600">
                      {{ item.child_qty || 0 }} × {{ getChildPrice(item) }} ฿
                    </p>
                    <p class="text-xs text-gray-500">
                      Cost: {{ getChildCostPrice(item) }} ฿ each
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-lg font-semibold text-gray-900">
                      {{ (item.child_qty || 0) * getChildPrice(item) }} ฿
                    </p>
                    <p class="text-xs text-blue-600 mt-1">
                      Cost: {{ calculateChildTotalCost(item) }} ฿
                    </p>
                  </div>
                </div>

                <!-- Subtotal -->
                <div
                  class="flex justify-between items-center pt-2 border-t border-gray-200"
                >
                  <p class="text-sm text-gray-600">Subtotal</p>
                  <div class="text-right">
                    <p class="text-lg font-semibold text-gray-900">
                      {{ calculateTicketSubtotal(item) }} ฿
                    </p>
                    <p class="text-xs text-blue-600 mt-1">
                      Total Cost: {{ calculateTicketTotalCost(item) }} ฿
                    </p>
                  </div>
                </div>

                <!-- Discount Input -->
                <div class="flex items-center gap-3">
                  <label class="text-sm font-medium text-gray-700 min-w-[50%]">
                    Discount:
                  </label>
                  <div class="flex items-center gap-2 flex-1">
                    <input
                      type="number"
                      v-model.number="item.discount"
                      @input="updateDiscount(item)"
                      min="0"
                      :max="calculateTicketSubtotal(item)"
                      step="0.01"
                      class="flex-1 px-3 py-2 border border-gray-300 focus:outline-none rounded-lg text-sm focus:ring-2 focus:ring-[#ff613c] focus:border-transparent"
                      placeholder="0.00"
                    />
                    <span class="text-sm text-gray-600">฿</span>
                  </div>
                </div>

                <!-- Total After Discount -->
                <div
                  class="flex justify-between items-center pt-3 border-t-2 border-gray-300"
                >
                  <p class="text-sm font-medium text-gray-700">Total Amount</p>
                  <div class="text-right">
                    <p class="text-2xl font-bold text-[#ff613c]">
                      {{ calculateTicketTotal(item) }} ฿
                    </p>
                    <p
                      class="text-xs text-red-600 mt-1"
                      v-if="item.discount > 0"
                    >
                      (After -{{ item.discount }} ฿ discount)
                    </p>
                    <p class="text-xs text-green-600 mt-1">
                      Profit: {{ calculateTicketProfit(item) }} ฿
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Other Types (fallback) -->
          <div v-else>
            <div class="flex items-start gap-3">
              <div
                class="bg-gray-400 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium flex-shrink-0"
              >
                {{ index + 1 }}
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">
                  {{ item.ownerable?.name || "Unknown Product" }}
                </h3>
                <p class="text-sm text-gray-500 mt-1">
                  Type: {{ item.ownerable_type || "N/A" }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-lg shadow-sm p-12 text-center">
        <div class="text-gray-400 mb-4">
          <svg
            class="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          No Items Selected
        </h3>
        <p class="text-sm text-gray-500">
          Please select items to confirm booking
        </p>
      </div>
    </div>
    <!-- Action Buttons -->
    <div
      class="flex justify-end items-center gap-3 mt-6 border-t border-gray-200 sticky w-full bg-white z-20 py-4 bottom-0"
      v-if="selectedRows && selectedRows.length > 0"
    >
      <button
        @click="handleCancel"
        class="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
      <button
        @click="handleConfirm"
        class="px-6 py-2.5 bg-[#ff613c] text-white w-full rounded-lg text-sm font-medium hover:bg-[#e5562f] transition-colors shadow-lg"
      >
        Generate Booking ({{ selectedRows.length }} items)
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

const props = defineProps({
  confirmItem: Function,
  selectedRows: Array,
  cancel: Function,
});

const emit = defineEmits(["cancel", "confirm"]);

// Initialize discount field for all items
onMounted(() => {
  if (props.selectedRows) {
    props.selectedRows.forEach((item) => {
      if (item.discount === undefined) {
        item.discount = 0;
      }
    });
  }
});

// Update discount (can add validation here)
const updateDiscount = (item) => {
  if (item.discount < 0) {
    item.discount = 0;
  }

  // Prevent discount from exceeding subtotal
  const subtotal = isHotel(item)
    ? parseFloat(calculateHotelSubtotal(item))
    : parseFloat(calculateTicketSubtotal(item));

  if (item.discount > subtotal) {
    item.discount = subtotal;
  }
};

// Check if item is Hotel
const isHotel = (item) => {
  return item.ownerable_type?.includes("Hotel");
};

// Check if item is Entrance Ticket
const isEntranceTicket = (item) => {
  return item.ownerable_type?.includes("EntranceTicket");
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Calculate nights between dates
const calculateNights = (checkin, checkout) => {
  if (!checkin || !checkout) return 0;
  const checkinDate = new Date(checkin);
  const checkoutDate = new Date(checkout);
  const diffTime = Math.abs(checkoutDate - checkinDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// ============== COST PRICE FUNCTIONS ==============

// Get cost price for hotel (per night) - FIXED: use 'cost' instead of 'cost_price'
const getCostPrice = (item) => {
  // For hotels, the cost field is named 'cost', not 'cost_price'
  return parseFloat(item.variable?.cost || item.variable?.cost_price || 0);
};

// Calculate total cost for hotel
const calculateHotelTotalCost = (item) => {
  const quantity = item.quantity || 0;
  const costPerNight = getCostPrice(item);
  const nights = calculateNights(item.checkin_date, item.checkout_date);
  return (quantity * costPerNight * nights).toFixed(2);
};

// Get adult cost price for entrance ticket
const getAdultCostPrice = (item) => {
  return parseFloat(item.variable?.cost_price || 0);
};

// Calculate adult total cost
const calculateAdultTotalCost = (item) => {
  const adultQty = item.quantity || 0;
  const adultCostPrice = getAdultCostPrice(item);
  return (adultQty * adultCostPrice).toFixed(2);
};

// Get child cost price from variable
const getChildCostPrice = (item) => {
  if (!item.variable?.child_info) return 0;

  try {
    const childInfo =
      typeof item.variable.child_info === "string"
        ? JSON.parse(item.variable.child_info)
        : item.variable.child_info;

    if (Array.isArray(childInfo) && childInfo.length > 0) {
      return parseFloat(childInfo[0].child_cost_price) || 0;
    }
  } catch (e) {
    console.error("Error parsing child info:", e);
  }

  return 0;
};

// Calculate child total cost
const calculateChildTotalCost = (item) => {
  const childQty = item.child_qty || 0;
  const childCostPrice = getChildCostPrice(item);
  return (childQty * childCostPrice).toFixed(2);
};

// Calculate total cost for entrance ticket
const calculateTicketTotalCost = (item) => {
  const adultCost = parseFloat(calculateAdultTotalCost(item));
  const childCost = parseFloat(calculateChildTotalCost(item));
  return (adultCost + childCost).toFixed(2);
};

// Calculate hotel profit
const calculateHotelProfit = (item) => {
  const total = parseFloat(calculateHotelTotal(item));
  const cost = parseFloat(calculateHotelTotalCost(item));
  return (total - cost).toFixed(2);
};

// Calculate ticket profit
const calculateTicketProfit = (item) => {
  const total = parseFloat(calculateTicketTotal(item));
  const cost = parseFloat(calculateTicketTotalCost(item));
  return (total - cost).toFixed(2);
};

// Calculate total cost price for all items
const calculateTotalCostPrice = () => {
  if (!props.selectedRows || props.selectedRows.length === 0) return 0;

  return props.selectedRows
    .reduce((total, item) => {
      if (isHotel(item)) {
        return total + parseFloat(calculateHotelTotalCost(item));
      } else if (isEntranceTicket(item)) {
        return total + parseFloat(calculateTicketTotalCost(item));
      }
      return total;
    }, 0)
    .toFixed(2);
};

// ============== SELLING PRICE FUNCTIONS ==============

// Calculate hotel subtotal (before discount)
const calculateHotelSubtotal = (item) => {
  const quantity = item.quantity || 0;
  const pricePerNight = item.variable?.room_price || 0;
  const nights = calculateNights(item.checkin_date, item.checkout_date);
  return (quantity * pricePerNight * nights).toFixed(2);
};

// Calculate hotel total (after discount)
const calculateHotelTotal = (item) => {
  const subtotal = parseFloat(calculateHotelSubtotal(item));
  const discount = item.discount || 0;
  return (subtotal - discount).toFixed(2);
};

// Get child price from variable
const getChildPrice = (item) => {
  if (!item.variable?.child_info) return 0;

  try {
    const childInfo =
      typeof item.variable.child_info === "string"
        ? JSON.parse(item.variable.child_info)
        : item.variable.child_info;

    if (Array.isArray(childInfo) && childInfo.length > 0) {
      return parseFloat(childInfo[0].child_price) || 0;
    }
  } catch (e) {
    console.error("Error parsing child info:", e);
  }

  return 0;
};

// Calculate ticket subtotal (before discount)
const calculateTicketSubtotal = (item) => {
  const adultQty = item.quantity || 0;
  const adultPrice = item.variable?.price || 0;
  const childQty = item.child_qty || 0;
  const childPrice = getChildPrice(item);

  const adultTotal = adultQty * adultPrice;
  const childTotal = childQty * childPrice;

  return (adultTotal + childTotal).toFixed(2);
};

// Calculate ticket total (after discount)
const calculateTicketTotal = (item) => {
  const subtotal = parseFloat(calculateTicketSubtotal(item));
  const discount = item.discount || 0;
  return (subtotal - discount).toFixed(2);
};

// Calculate total discount amount
const getTotalDiscount = () => {
  if (!props.selectedRows || props.selectedRows.length === 0) return 0;

  return props.selectedRows
    .reduce((total, item) => {
      return total + (item.discount || 0);
    }, 0)
    .toFixed(2);
};

// Calculate grand total (after all discounts)
const calculateGrandTotal = () => {
  if (!props.selectedRows || props.selectedRows.length === 0) return 0;

  return props.selectedRows
    .reduce((total, item) => {
      if (isHotel(item)) {
        return total + parseFloat(calculateHotelTotal(item));
      } else if (isEntranceTicket(item)) {
        return total + parseFloat(calculateTicketTotal(item));
      }
      return total;
    }, 0)
    .toFixed(2);
};

// Create formItem data for each selected row
const createFormItemData = (item) => {
  const baseData = {
    id: item.id,
    ownerable_type: item.ownerable_type,
    ownerable_id: item.ownerable_id,
    variable_id: item.variable_id,
    variable_type: item.variable_type,
    customer_name: item.customer_name,
    customer_phnumber: item.customer_phnumber,
    quantity: item.quantity,
    child_qty: item.child_qty || 0,
    commands: item.commands,
    status: item.status,
    checkin_date: item.checkin_date,
    checkout_date: item.checkout_date,
    discount: item.discount || 0,
  };

  if (isHotel(item)) {
    const subtotal = calculateHotelSubtotal(item);
    const total = calculateHotelTotal(item);
    const costPrice = getCostPrice(item); // This now uses 'cost' field
    const totalCostPrice = calculateHotelTotalCost(item);

    return {
      ...baseData,
      product_type: "hotel",
      hotel_name: item.ownerable?.name,
      room_name: item.variable?.name,
      selling_price: item.variable?.room_price || 0,
      cost_price: costPrice,
      total_cost_price: totalCostPrice,
      nights: calculateNights(item.checkin_date, item.checkout_date),
      subtotal_amount: subtotal,
      total_amount: total,
    };
  } else if (isEntranceTicket(item)) {
    const subtotal = calculateTicketSubtotal(item);
    const total = calculateTicketTotal(item);
    const adultCostPrice = getAdultCostPrice(item);
    const childCostPrice = getChildCostPrice(item);
    const totalCostPrice = calculateTicketTotalCost(item);

    return {
      ...baseData,
      product_type: "entrance_ticket",
      attraction_name: item.ownerable?.name,
      variation_name: item.variable?.name || item.variable?.description,
      service_date: item.checkin_date,
      adult_selling_price: item.variable?.price || 0,
      adult_cost_price: adultCostPrice,
      child_selling_price: getChildPrice(item),
      child_cost_price: childCostPrice,
      total_cost_price: totalCostPrice,
      subtotal_amount: subtotal,
      total_amount: total,
    };
  }

  return baseData;
};

// Handle confirm - emit formItem data
const handleConfirm = () => {
  const formItems = props.selectedRows.map((item) => createFormItemData(item));

  console.log("Confirming items:", formItems);

  props.confirmItem(formItems);
};

// Handle cancel
const handleCancel = () => {
  props.cancel();
};
</script>

<style scoped>
/* Add smooth transitions */
.bg-white {
  transition: box-shadow 0.2s ease-in-out;
}

.bg-white:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Style for number input to hide arrows in some browsers */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
