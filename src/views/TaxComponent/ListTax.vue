<template>
  <div
    class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
  >
    <div class="flex justify-between items-start mb-2">
      <div class="flex-1">
        <h3 class="font-semibold text-gray-900 text-sm mb-1">
          {{ data?.company_legal_name }}
        </h3>
        <!-- <p class="text-sm text-gray-600">{{ data?.product?.name }}</p> -->
      </div>
      <div class="text-right">
        <span
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
          :class="getProductTypeClass(data?.product_type)"
        >
          {{ getProductTypeName(data?.product_type) }}
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-2 mb-3">
      <div>
        <p class="text-[10px] text-gray-500">Receipt Date</p>
        <p class="text-xs font-medium">
          {{ formatDate(data?.receipt_date) }} (IN: {{ data?.invoice_number }})
        </p>
      </div>

      <div>
        <p class="text-[10px] text-gray-500">Service Period</p>
        <p class="text-xs font-medium">
          {{ formatDate(data?.service_start_date) }} -
          {{ formatDate(data?.service_end_date) }}
        </p>
      </div>
    </div>

    <div
      class="flex justify-between items-center pt-3 border-t border-gray-100"
    >
      <div class="flex space-x-4">
        <div>
          <p class="text-[10px] text-gray-500">Tax Amount</p>
          <p class="text-sm font-semibold">
            {{ formatAmount(data?.total_tax_amount) }} THB
          </p>
        </div>
        <div>
          <p class="text-[10px] text-gray-500">Tax Withold</p>
          <p class="text-sm font-semibold text-blue-600">
            {{ formatAmount(data?.total_tax_withold) }} THB
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["view"]);

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatAmount = (amount) => {
  if (!amount) return "0.00";
  return parseFloat(amount).toFixed(2);
};

const getProductTypeName = (productType) => {
  if (!productType) return "";
  if (productType.includes("Hotel")) return "Hotel";
  if (productType.includes("EntranceTicket")) return "Attraction";
  return productType;
};

const getProductTypeClass = (productType) => {
  if (!productType) return "bg-gray-100 text-gray-800";
  if (productType.includes("Hotel")) {
    return "bg-blue-100 text-blue-800";
  }
  if (productType.includes("EntranceTicket")) {
    return "bg-green-100 text-green-800";
  }
  return "bg-gray-100 text-gray-800";
};
</script>
