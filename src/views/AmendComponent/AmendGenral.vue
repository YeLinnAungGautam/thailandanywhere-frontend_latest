<template>
  <div class="">
    <div class="">
      <div class="text-2xl font-bold">General</div>
      <div class="text-sm text-gray-500 pt-2">
        General information about the amendment. This information is used to
        determine the type of amendment and the reason for the amendment.
      </div>
    </div>
    <div class="pt-4">
      <div class="font-semibold">
        Amendment Changes by {{ detail?.amend_history[0]?.user_name }}
      </div>
      <table class="w-full mt-4">
        <thead>
          <tr
            class="border border-gray-200 bg-[#FF613c] text-white divide-x-2 divide-gray-200"
          >
            <th class="text-left font-medium text-sm px-4 py-2">Field</th>
            <th class="text-left font-medium text-sm px-4 py-2">Changes</th>
            <th class="text-left font-medium text-sm px-4 py-2">
              Previous Value
            </th>
          </tr>
        </thead>
        <tbody>
          <template
            v-if="detail?.amend_history && detail.amend_history.length > 0"
          >
            <tr v-for="(value, key) in getChangeFields()" :key="key">
              <td class="border px-4 py-3 text-xs font-medium">
                {{ formatFieldName(key) }}
              </td>
              <td class="border px-4 py-3 text-xs">
                {{ formatValue(detail.amend_history[0].changes?.[key]) }}
              </td>
              <td class="border px-4 py-3 text-xs">
                {{
                  formatValue(
                    detail.amend_history[0].previous_values?.[
                      getPreviousValueKey(key)
                    ]
                  )
                }}
              </td>
            </tr>
          </template>
          <tr v-else>
            <td colspan="3" class="text-center py-4">
              No amendment history available
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pt-4">
      <div class="font-semibold">Reservation Information</div>
      <div class="flex justify-start items-center gap-x-3 pt-4">
        <p
          class="text-[12px] bg-[#ff613c] whitespace-nowrap text-white inline-block rounded-lg px-4 py-2"
        >
          {{ detail?.booking_item?.crm_id }}
        </p>
        <p
          class="text-[12px] bg-gray-600 text-white whitespace-nowrap inline-block rounded-lg px-4 py-2"
        >
          {{ detail?.booking_item?.customer_info?.name }}
        </p>
        <p
          :class="{
            'bg-green-600':
              detail?.booking_item?.booking?.payment_status == 'fully_paid',
            'bg-yellow-600':
              detail?.booking_item?.booking?.payment_status == 'partially_paid',
            'bg-red-600':
              detail?.booking_item?.booking?.payment_status == 'not_paid',
          }"
          class="text-[12px] bg-gray-600 text-white whitespace-nowrap inline-block rounded-lg px-4 py-2"
        >
          Pay: {{ detail?.booking_item?.booking?.payment_status }}
        </p>
        <p
          :class="{
            'bg-green-600':
              detail?.booking_item?.payment_status == 'fully_paid',
            'bg-yellow-600':
              detail?.booking_item?.payment_status == 'partially_paid',
            'bg-red-600': detail?.booking_item?.payment_status == 'not_paid',
          }"
          class="text-[12px] bg-gray-600 text-white whitespace-nowrap inline-block rounded-lg px-4 py-2"
        >
          Exp: {{ detail?.booking_item?.payment_status }}
        </p>
        <p
          class="text-[12px] bg-orange-600 text-white whitespace-nowrap inline-block rounded-lg px-4 py-2"
        >
          Bal: {{ detail?.booking_item?.booking?.balance_due }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  detail: Object,
  getDetailAction: Function,
});

const getChangeFields = () => {
  if (!props.detail?.amend_history?.[0]?.changes) return {};
  return props.detail.amend_history[0].changes;
};

const formatFieldName = (key) => {
  // Convert snake_case to proper capitalized text
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatValue = (value) => {
  if (value === undefined || value === null) return "-";

  // Format date if it looks like a date
  if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}/)) {
    return new Date(value).toLocaleDateString();
  }

  return value;
};

const getPreviousValueKey = (key) => {
  // Map the change field name to its corresponding previous value field name
  const mapping = {
    quantity: "current_quantity",
    service_date: "current_service_date",
    // Add more mappings as needed
  };

  return mapping[key] || `current_${key}`;
};
</script>
