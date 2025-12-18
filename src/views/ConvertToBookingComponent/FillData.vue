<template>
  <div class="">
    <div class="grid grid-cols-1 gap-4">
      <div class="space-y-4">
        <label
          :for="`payment_method`"
          class="block text-xs font-medium text-gray-700 mb-2"
        >
          Payment Method <span class="text-red-500">*</span>
        </label>
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
      <div class="space-y-4">
        <label
          :for="`payment_currency`"
          class="block text-xs font-medium text-gray-700 mb-2"
        >
          Payment Currency <span class="text-red-500">*</span>
        </label>
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
      <div class="space-y-4">
        <label
          :for="`bank_name`"
          class="block text-xs font-medium text-gray-700 mb-2"
        >
          Bank Name <span class="text-red-500">*</span>
        </label>
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
      <div class="space-y-4">
        <label
          :for="`money_exchange_rate`"
          class="block text-xs font-medium text-gray-700 mb-2"
        >
          Exchange Rate <span class="text-red-500">*</span>
        </label>
        <input
          v-model="formData.money_exchange_rate"
          :disabled="!paymentValid || disabled"
          type="number"
          id="title"
          class="text-xs px-4 py-3 w-full text-gray-900 border-main border rounded-lg shadow-sm focus:outline-none focus:border-gray-200"
          :class="!paymentValid ? 'bg-gray-200' : 'bg-white'"
        />
      </div>

      <div class="pt-4">
        <button
          @click="changeGetInclusiveForm"
          :disabled="!isFormValid"
          :class="[
            'w-full px-6 py-3 rounded-lg text-xs font-medium transition-all shadow-lg',
            isFormValid
              ? 'bg-[#ff613c] text-white hover:bg-[#e5562f] cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed',
          ]"
        >
          Confirm Selected Customer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref, watch, computed } from "vue";
import { Switch } from "@headlessui/vue";

const enabled = ref(false);

import { defineEmits } from "vue";

const props = defineProps({
  fillData: Function,
  selectedRows: Array,
});

const emit = defineEmits();

const changeGetInclusiveForm = () => {
  formData.value.is_inclusive = enabled.value ? 1 : 0;

  // emit("formData", formData.value);
  props.fillData(formData.value);
};

const isFormValid = computed(() => {
  return (
    formData.value.payment_method &&
    formData.value.payment_currency &&
    formData.value.bank_name
  );
});

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
  crm_id: "",
  balance_due_date: "",
  booking_date: "",
  money_exchange_rate: "",
  payment_currency: "",
  payment_method: "",
  // sold_from: "",
  bank_name: "",
  is_inclusive: "",
});

onMounted(() => {});
</script>
