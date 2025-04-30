<script setup>
import { defineEmits, defineProps } from "vue";
import { getFormatDate } from "../help/FormatData";
import { CheckBadgeIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  data: Object,
  detailId: String,
});

const emit = defineEmits("detailId");

const handleClick = () => {
  let result = {
    id: props.data.id,
    crm_id: props.data.booking_item.crm_id,
  };
  emit("detailId", result);
};
</script>

<template>
  <div class="relative px-2 py-2 bg-white shadow-md" @click="handleClick">
    <div
      class="absolute top-[35px] left-3 rounded-full w-2 h-2"
      :class="{
        'bg-blue-600':
          data?.booking_item?.product_type === 'App\\Models\\EntranceTicket',
        'bg-green-600':
          data?.booking_item?.product_type === 'App\\Models\\Hotel',
        'bg-yellow-600':
          data?.booking_item?.product_type === 'App\\Models\\PrivateVanTour',
        'bg-red-600':
          data?.booking_item?.product_type === 'App\\Models\\AirportPickup',
      }"
    ></div>
    <div class="pl-5 pt-2 gap-y-4 gap-x-3">
      <div class="flex justify-between items-center">
        <div>
          <p class="text-[10px] space-x-1">
            <span class="font-medium"
              >Book:
              {{
                getFormatDate(data?.booking_item?.booking?.booking_date)
              }}</span
            >
          </p>
        </div>
        <div class="">
          <div
            class="text-[10px] text-[#ff613c] space-x-1 flex justify-end items-center"
          >
            <p class="font-medium">
              E-{{ data?.booking_item?.total_cost_price }}
            </p>

            <p class="font-medium">
              : S-{{ data?.booking_item?.selling_price }}
            </p>
            <p
              class="text-white bg-gray-800 px-1 rounded-md"
              v-if="data?.booking_item.booking?.is_inclusive == 1"
            >
              Inclusive
            </p>
          </div>
        </div>
      </div>
    </div>
    <div
      class="py-2 pl-5 flex justify-start overflow-x-scroll no-sidebar-container items-center gap-x-2"
    >
      <p
        class="text-[10px] px-1 py-0.5 text-white inline-block rounded-lg"
        :class="{
          'bg-blue-600':
            data?.booking_item?.product_type === 'App\\Models\\EntranceTicket',
          'bg-green-600':
            data?.booking_item?.product_type === 'App\\Models\\Hotel',
          'bg-yellow-600':
            data?.booking_item?.product_type === 'App\\Models\\PrivateVanTour',
          'bg-red-600':
            data?.booking_item?.product_type === 'App\\Models\\AirportPickup',
        }"
      >
        {{
          data?.booking_item?.product_type == "App\\Models\\EntranceTicket"
            ? "Ticket"
            : ""
        }}
        {{
          data?.booking_item?.product_type == "App\\Models\\Hotel"
            ? "Hotel"
            : ""
        }}
        {{
          data?.booking_item?.product_type == "App\\Models\\PrivateVanTour"
            ? "Vantour"
            : ""
        }}
        {{
          data?.booking_item?.product_type == "App\\Models\\AirportPickup"
            ? "Pickup"
            : ""
        }}
      </p>
      <p
        class="text-[10px] bg-[#ff613c] whitespace-nowrap px-1 py-0.5 text-white inline-block rounded-lg"
      >
        {{ data?.booking_item?.crm_id }}
      </p>
      <p
        class="text-[10px] bg-gray-600 px-1 py-0.5 text-white whitespace-nowrap inline-block rounded-lg"
      >
        {{ data?.booking_item?.customer_info?.name }}
      </p>
    </div>
    <div class="flex pl-5 justify-start items-center">
      <div class="text-[12px] font-medium space-x-2 text-gray-900 line-clamp-1">
        <span class="whitespace-nowrap">{{
          data?.booking_item?.product?.name
        }}</span>
        <span
          class="bg-gray-900 w-1 h-1 mb-0.5 rounded-full inline-block"
        ></span>
      </div>
    </div>
    <div class="pt-1 pl-5 flex justify-start items-center gap-x-3">
      <div
        class="flex justify-start space-x-1 items-center"
        v-if="data.amend_request"
      >
        <CheckBadgeIcon class="w-3 h-3 text-green-600" />
        <p class="text-[10px] whitespace-nowrap text-green-600">Request</p>
      </div>
      <div
        class="flex justify-start space-x-1 items-center"
        v-if="data.amend_approve"
      >
        <CheckBadgeIcon class="w-3 h-3 text-green-600" />
        <p class="text-[10px] whitespace-nowrap text-green-600">Approve</p>
      </div>
      <div
        class="flex justify-start space-x-1 items-center"
        v-if="data.amend_mail_sent"
      >
        <CheckBadgeIcon class="w-3 h-3 text-green-600" />
        <p class="text-[10px] whitespace-nowrap text-green-600">Mail Sent</p>
      </div>
      <div class="flex justify-start space-x-1 items-center">
        <CheckBadgeIcon
          class="w-3 h-3"
          :class="{
            'text-yellow-600':
              data.amend_status === 'pending' ||
              data.amend_status === 'request' ||
              data.amend_status === 'approve',
            'text-green-600': data.amend_status === 'completed',
            'text-red-600': data.amend_status === 'rejected',
          }"
        />
        <p
          class="text-[10px] whitespace-nowrap"
          :class="{
            'text-yellow-600':
              data.amend_status === 'pending' ||
              data.amend_status === 'requested' ||
              data.amend_status === 'approved',
            'text-green-600': data.amend_status === 'completed',
            'text-red-600': data.amend_status === 'rejected',
          }"
        >
          {{ data.amend_status }}
        </p>
      </div>
    </div>
  </div>
</template>
