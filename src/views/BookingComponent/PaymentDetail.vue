<template>
  <div class="py-4">
    <div class="flex justify-between items-center">
      <h1
        class="sticky top-0 bg-white z-10 py-1 text-xs font-medium text-[#ff613c]"
      >
        Inclusive Detail
      </h1>
    </div>
    <div class="space-y-1">
      <div class="space-y-2">
        <label for="name" class="text-gray-800 text-[10px]">Booking Date</label>
        <input
          type="date"
          v-model="formData.booking_date"
          :disabled="formData.id || disabled"
          id="name"
          class="min-w-full text-xs px-4 py-1.5 text-gray-900 border-main border rounded-lg shadow-sm bg-white focus:outline-none focus:border-gray-300"
        />
      </div>
      <div class="space-y-2">
        <label for="name" class="text-gray-800 text-[10px]"
          >Balance Due Date</label
        >
        <input
          type="date"
          v-model="formData.balance_due_date"
          :disabled="formData.id || disabled"
          id="name"
          class="min-w-full text-xs px-4 py-1.5 text-gray-900 border-main border rounded-lg shadow-sm bg-white focus:outline-none focus:border-gray-300"
        />
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div class="space-y-2">
          <label for="name" class="text-gray-800 text-[10px]">Sold From</label>
          <v-select
            :style="{ fontSize: '11px !important' }"
            v-model="formData.sold_from"
            class="style-chooser text-xs"
            :options="soldFrom"
            label="name"
            :clearable="false"
            :reduce="(d) => d.name"
            placeholder=""
          ></v-select>
        </div>
        <div class="space-y-2">
          <label for="name" class="text-gray-800 text-[10px]"
            >Payment Currency</label
          >
          <v-select
            :style="{ fontSize: '11px !important' }"
            v-model="formData.payment_currency"
            class="style-chooser text-xs"
            :options="payment_currency"
            @option:selected="choosePaymentBank"
            label="name"
            :clearable="false"
            :reduce="(d) => d.name"
            placeholder=""
          ></v-select>
        </div>
        <div class="space-y-2 col-span-2">
          <label for="name" class="text-gray-800 text-[10px]">Bank name</label>
          <v-select
            v-model="formData.bank_name"
            class="style-chooser text-xs"
            :options="payment"
            label="name"
            :clearable="false"
            :reduce="(d) => d.name"
            placeholder=""
          ></v-select>
        </div>
      </div>
      <div class="space-y-2">
        <label for="name" class="text-gray-800 text-[10px]"
          >Money Exchange Rate</label
        >
        <input
          v-model="formData.money_exchange_rate"
          :disabled="!paymentValid || disabled"
          type="number"
          id="title"
          class="text-xs px-4 py-1.5 w-full text-gray-900 border-main border rounded-lg shadow-sm focus:outline-none focus:border-gray-300"
          :class="!paymentValid ? 'bg-gray-200' : 'bg-white'"
        />
      </div>

      <div class="space-y-2">
        <label for="name" class="text-gray-800 text-[10px]"
          >Payment Method</label
        >
        <v-select
          v-model="formData.payment_method"
          class="style-chooser text-xs"
          :options="paymentArray"
          label="name"
          :clearable="false"
          :reduce="(d) => d.name"
          placeholder=""
        ></v-select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref, watch, computed } from "vue";
import { Switch } from "@headlessui/vue";

const enabled = ref(false);

import { defineEmits } from "vue";

const emit = defineEmits();

const changeGetInclusiveForm = () => {
  emit("formData", formData.value);
};

const soldFrom = [
  { id: "1", name: "Facebook" },
  { id: "2", name: "Twitter" },
  { id: "3", name: "Instagram" },
  { id: "4", name: "Twitter" },
  { id: "5", name: "Viber" },
  { id: "6", name: "Phone" },
  { id: "7", name: "Office" },
];
const payment_mm = [
  { id: "1", name: "KPAY" },
  { id: "2", name: "AYAPAY" },
  { id: "3", name: "CBPAY" },
  { id: "4", name: "KBZ BANKING" },
  { id: "5", name: "CB BANKING" },
  { id: "6", name: "MAB BANKING" },
  { id: "7", name: "YOMA BANK" },
];
const payment_thb = [
  { id: "1", name: "Kasikorn" },
  { id: "2", name: "Bangkok Bank" },
  { id: "3", name: "Bank of Ayudhaya" },
  { id: "4", name: "SCB Bank" },
  { id: "5", name: "Others..." },
];
const payment_usd = [
  { id: "1", name: "KPAY" },
  { id: "2", name: "AYAPAY" },
  { id: "3", name: "CBPAY" },
  { id: "4", name: "KBZ BANKING" },
  { id: "5", name: "CB BANKING" },
  { id: "6", name: "MAB BANKING" },
  { id: "7", name: "YOMA BANK" },
  { id: "8", name: "Kasikorn" },
  { id: "9", name: "Bangkok Bank" },
  { id: "10", name: "Bank of Ayudhaya" },
  { id: "11", name: "SCB Bank" },
  { id: "12", name: "Others..." },
];

const payment_currency = [
  { id: "1", name: "MMK" },
  { id: "2", name: "USD" },
  { id: "3", name: "THB" },
];

const paymentArray = [
  // Bank Transfer, International Remittance, Cash, etc
  { id: "1", name: "Bank Transfer" },
  { id: "2", name: "International Remittance" },
  { id: "3", name: "Cash" },
  { id: "4", name: "Other ..." },
];

const payment = ref([]);
const paymentValid = computed(() => {
  if (formData.value.payment_currency == "MMK") {
    payment.value = payment_mm;
    return true;
  } else if (formData.value.payment_currency == "THB") {
    payment.value = payment_thb;
    return false;
  } else {
    payment.value = payment_usd;
    return true;
  }
});
const choosePaymentBank = () => {
  if (formData.value.payment_currency == "MMK") {
    payment.value = payment_mm;
  } else if (formData.value.payment_currency == "THB") {
    payment.value = payment_thb;
  } else {
    payment.value = payment_usd;
  }
};

const formData = ref({
  id: "",
  balance_due_date: "",
  booking_date: "",
  money_exchange_rate: "",
  payment_currency: "",
  payment_method: "",
  sold_from: "",
  bank_name: "",
});

const props = defineProps({
  data: Object,
});

watch(
  () => [
    formData.value.balance_due_date,
    formData.value.booking_date,
    formData.value.money_exchange_rate,
    formData.value.payment_currency,
    formData.value.payment_method,
    formData.value.sold_from,
    formData.value.bank_name,
  ],
  (newVal) => {
    changeGetInclusiveForm();
  }
);

onMounted(() => {
  if (props.data) {
    formData.value.id = props.data.id;
    formData.value.balance_due_date = props.data.balance_due_date;
    formData.value.booking_date = props.data.booking_date;
    formData.value.money_exchange_rate = props.data.money_exchange_rate;
    formData.value.payment_currency = props.data.payment_currency;
    formData.value.payment_method = props.data.payment_method;
    formData.value.sold_from = props.data.sold_from;
    formData.value.bank_name = props.data.bank_name;
  }
});
</script>
