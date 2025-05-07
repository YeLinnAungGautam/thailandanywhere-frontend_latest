<template>
  <div>
    <div class="flex justify-start items-center gap-x-4">
      <p class="text-lg text-[#FF613c] font-bold">{{ data?.crm_id }}</p>
      <p
        class="text-xs text-white px-3 py-1.5 rounded-lg"
        :class="{
          'bg-green-500': data?.payment_status === 'fully_paid',
          'bg-yellow-500': data?.payment_status === 'partially_paid',
          'bg-red-500': data?.payment_status === 'not_paid',
        }"
      >
        {{ data?.payment_status }}
      </p>
    </div>
    <div class="pt-3 pb-6">
      <div className="w-full">
        <table
          className="w-full rounded-lg overflow-hidden border border-gray-200"
        >
          <thead className="bg-orange-500">
            <tr>
              <th className="text-center text-xs text-white py-2">Code</th>
              <th className="text-center text-xs text-white py-2">Item Name</th>
              <th className="text-center text-xs text-white py-2">
                Service Date
              </th>
              <th className="text-center text-xs text-white py-2">Check-out</th>
              <th className="text-center text-xs text-white py-2">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            <tr
              className="bg-white even:bg-gray-50 hover:bg-gray-50"
              v-for="i in data?.items"
              :key="i.id"
            >
              <td className="text-center text-xs py-3">{{ i.crm_id }}</td>
              <td className="text-center text-xs py-3">
                {{ i?.variation?.name }}{{ i?.room?.name }}{{ i?.car?.name
                }}{{ i?.ticket?.name }}
              </td>
              <td className="text-center text-xs py-3">
                {{ getFormatDate(i.service_date) }}
              </td>
              <td
                className="text-center text-xs py-3"
                v-if="i?.product_type == 'App\\Models\\Hotel'"
              >
                {{ getFormatDate(i.checkout_date) }}
              </td>
              <td
                v-if="i?.product_type != 'App\\Models\\Hotel'"
                class="text-center"
              >
                -
              </td>
              <td className="text-center text-xs py-3">
                {{ formattedNumber(i?.amount) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-x-10">
      <div class="grid grid-cols-2 gap-2">
        <p class="text-[#FF613c] font-semibold text-xs py-2">Payment Summary</p>
        <p></p>
        <p class="text-xs font-semibold">Sub Total:</p>
        <p class="bg-gray-200 px-4 h-8 pt-2 text-xs rounded-lg">
          {{ data?.sub_total }}
        </p>
        <p class="text-xs font-semibold">Discount:</p>
        <p class="bg-gray-200 px-4 h-8 pt-2 text-xs rounded-lg">
          {{ data?.discount }}
        </p>
        <p class="text-xs font-semibold">Total:</p>
        <p class="bg-gray-200 px-4 h-8 pt-2 text-xs rounded-lg">
          {{ data?.grand_total }}
        </p>
        <p class="text-xs font-semibold">Deposit:</p>
        <p class="bg-gray-200 px-4 h-8 pt-2 text-xs rounded-lg">
          {{ data?.deposit }}
        </p>
        <p class="text-xs font-semibold">Balance Due:</p>
        <p class="bg-gray-200 px-4 h-8 pt-2 text-xs rounded-lg">
          {{ data?.balance_due }}
        </p>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <p class="text-[#FF613c] font-semibold text-xs py-2">Payment Detail</p>
        <p></p>
        <div>
          <p class="text-[10px] pb-2">CRM ID</p>
          <p class="bg-gray-200 px-4 py-2 text-xs rounded-lg">
            {{ data?.crm_id }}
          </p>
        </div>
        <div>
          <p class="text-[10px] pb-2">Sales Date</p>
          <p class="bg-gray-200 px-4 py-2 text-xs rounded-lg">
            {{ getFormatDate(data?.booking_date) }}
          </p>
        </div>
        <div>
          <p class="text-[10px] pb-2">Payment Method</p>
          <p class="bg-gray-200 px-4 py-2 text-xs rounded-lg">
            {{ data?.payment_method }}
          </p>
        </div>
        <div>
          <p class="text-[10px] pb-2">Payment Currency</p>
          <p class="bg-gray-200 px-4 py-2 text-xs rounded-lg">
            {{ data?.payment_currency }}
          </p>
        </div>
        <div>
          <p class="text-[10px] pb-2">Bank name</p>
          <p class="bg-gray-200 px-4 py-2 text-xs rounded-lg">-</p>
        </div>
        <div>
          <p class="text-[10px] pb-2">Exchange Rate</p>
          <p class="bg-gray-200 px-4 py-2 text-xs rounded-lg">0</p>
        </div>
        <div>
          <p class="text-[10px] pb-2">Is inclusive ?</p>
          <p class="bg-gray-200 px-4 py-2 text-xs rounded-lg">
            {{ data?.is_inclusive == 1 ? "Yes" : "No" }}
          </p>
        </div>
        <div>
          <p class="text-[10px] pb-2">Balance Due Date</p>
          <p class="bg-gray-200 px-4 py-2 text-xs rounded-lg">
            {{ getFormatDate(data?.balance_due_date) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import {
  formattedDate,
  formattedNumber,
  getFormatDate,
} from "../help/FormatData";

const props = defineProps({
  data: Object,
});
</script>
