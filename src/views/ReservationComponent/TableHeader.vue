<template>
  <div>
    <div class="grid grid-cols-10 gap-2 py-2">
      <div
        class="py-2 text-xs font-medium flex justify-center items-center gap-2 tracking-wide text-center"
      >
        Crm ID
        <div>
          <span
            ><ChevronUpIcon
              class="w-4 cursor-pointer"
              :class="
                customer_name == 'crm_id' && sorting == 'asc'
                  ? 'text-gray-900'
                  : 'text-gray-500'
              "
              @click="upFunction(`crm_id`)"
            />
          </span>
          <span>
            <ChevronDownIcon
              class="w-4 cursor-pointer"
              :class="
                customer_name == 'crm_id' && sorting == 'desc'
                  ? 'text-gray-900'
                  : 'text-gray-500'
              "
              @click="downFunction(`crm_id`)"
            />
          </span>
        </div>
      </div>
      <div
        class="py-2 text-xs font-medium flex justify-center items-center gap-2 tracking-wide text-center"
      >
        Service Date
        <div>
          <span
            ><ChevronUpIcon
              class="w-4 cursor-pointer"
              :class="
                customer_name == 'service_date' && sorting == 'asc'
                  ? 'text-gray-900'
                  : 'text-gray-500'
              "
              @click="upFunction(`service_date`)"
            />
          </span>
          <span>
            <ChevronDownIcon
              class="w-4 cursor-pointer"
              :class="
                customer_name == 'service_date' && sorting == 'desc'
                  ? 'text-gray-900'
                  : 'text-gray-500'
              "
              @click="downFunction(`service_date`)"
            />
          </span>
        </div>
      </div>
      <div
        class="py-2 text-xs font-medium flex justify-center items-center gap-2 tracking-wide text-center"
      >
        Customer
        <div>
          <span
            ><ChevronUpIcon
              class="w-4 cursor-pointer"
              :class="
                customer_name == 'customer_name' && sorting == 'asc'
                  ? 'text-gray-900'
                  : 'text-gray-500'
              "
              @click="upFunction(`customer_name`)"
            />
          </span>
          <span>
            <ChevronDownIcon
              class="w-4 cursor-pointer"
              :class="
                customer_name == 'customer_name' && sorting == 'desc'
                  ? 'text-gray-900'
                  : 'text-gray-500'
              "
              @click="downFunction(`customer_name`)"
            />
          </span>
        </div>
      </div>
      <div
        class="py-2 text-xs font-medium flex justify-center items-center gap-2 tracking-wide text-center"
      >
        Type
        <div>
          <span
            ><ChevronUpIcon
              class="w-4 cursor-pointer"
              :class="
                customer_name == 'product_type' && sorting == 'asc'
                  ? 'text-gray-900'
                  : 'text-gray-500'
              "
              @click="upFunction(`product_type`)"
            />
          </span>
          <span>
            <ChevronDownIcon
              class="w-4 cursor-pointer"
              :class="
                customer_name == 'product_type' && sorting == 'desc'
                  ? 'text-gray-900'
                  : 'text-gray-500'
              "
              @click="downFunction(`product_type`)"
            />
          </span>
        </div>
      </div>
      <div
        class="flex justify-center items-center text-xs font-medium tracking-wide text-center"
      >
        Product Name
      </div>
      <div
        class="flex justify-center items-center text-xs font-medium tracking-wide text-center"
      >
        Variation Name
      </div>
      <div
        class="py-2 text-xs font-medium flex justify-center items-center gap-2 tracking-wide text-center"
      >
        Pay Status
        <div>
          <span
            ><ChevronUpIcon
              class="w-4 cursor-pointer"
              :class="
                customer_name == 'payment_status' && sorting == 'asc'
                  ? 'text-gray-900'
                  : 'text-gray-500'
              "
              @click="upFunction(`payment_status`)"
            />
          </span>
          <span>
            <ChevronDownIcon
              class="w-4 cursor-pointer"
              :class="
                customer_name == 'payment_status' && sorting == 'desc'
                  ? 'text-gray-900'
                  : 'text-gray-500'
              "
              @click="downFunction(`payment_status`)"
            />
          </span>
        </div>
      </div>
      <div
        class="py-2 text-xs font-medium flex justify-center items-center gap-2 tracking-wide text-center"
      >
        Res Status
        <div>
          <span
            ><ChevronUpIcon
              class="w-4 cursor-pointer"
              :class="
                customer_name == 'reservation_status' && sorting == 'asc'
                  ? 'text-gray-900'
                  : 'text-gray-500'
              "
              @click="upFunction(`reservation_status`)"
            />
          </span>
          <span>
            <ChevronDownIcon
              class="w-4 cursor-pointer"
              :class="
                customer_name == 'reservation_status' && sorting == 'desc'
                  ? 'text-gray-900'
                  : 'text-gray-500'
              "
              @click="downFunction(`reservation_status`)"
            />
          </span>
        </div>
      </div>
      <div
        class="py-2 text-xs font-medium flex justify-center items-center gap-2 tracking-wide text-center"
      >
        Exp Status
        <div>
          <span
            ><ChevronUpIcon
              class="w-4 cursor-pointer"
              :class="
                customer_name == 'expense_status' && sorting == 'asc'
                  ? 'text-gray-900'
                  : 'text-gray-500'
              "
              @click="upFunction(`expense_status`)"
            />
          </span>
          <span>
            <ChevronDownIcon
              class="w-4 cursor-pointer"
              :class="
                customer_name == 'expense_status' && sorting == 'desc'
                  ? 'text-gray-900'
                  : 'text-gray-500'
              "
              @click="downFunction(`expense_status`)"
            />
          </span>
        </div>
      </div>

      <div class="py-2 text-xs font-medium tracking-wide text-center"></div>
    </div>
  </div>
</template>

<script setup>
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/vue/24/outline";
import { defineProps } from "vue";

const props = defineProps({
  customer_name: String,
  sorting: String,
  upFunction: Function,
  downFunction: Function,
});
</script>
