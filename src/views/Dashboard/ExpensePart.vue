<template>
  <div class="p-4 rounded-xl grid grid-cols-2 gap-4">
    <div class="space-y-2">
      <p class="text-gray-800 text-[10px]">Expense Method:</p>

      <v-select
        v-model="formData.payment_method"
        class="style-chooser text-xs rounded-lg bg-white"
        :options="paymentArray"
        label="name"
        :clearable="false"
        :reduce="(d) => d.name"
        placeholder=""
      ></v-select>
    </div>
    <div class="space-y-2">
      <p class="text-gray-800 text-[10px]">Bank Name:</p>

      <v-select
        v-model="formData.bank_name"
        class="style-chooser text-xs rounded-lg bg-white"
        :options="payment"
        label="name"
        :clearable="false"
        :reduce="(d) => d.name"
        placeholder=""
      ></v-select>
    </div>
    <div class="space-y-2">
      <p class="text-gray-800 text-[10px]">Expense Status</p>
      <v-select
        v-model="formData.payment_status"
        class="style-chooser text-xs rounded-lg bg-white"
        :options="payment_status"
        label="name"
        :clearable="false"
        :reduce="(d) => d.name"
        placeholder=""
      ></v-select>
    </div>
    <div class="space-y-2">
      <p class="text-gray-800 text-[10px]">Bank Account Number</p>
      <input
        v-model="formData.bank_account_number"
        type="number"
        id="title"
        class="h-9 rounded-lg w-full bg-white border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
      />
    </div>
    <div class="space-y-2">
      <p class="text-gray-800 text-[10px]">Unit Cost</p>
      <input
        v-model="formData.cost_price"
        type="number"
        id="title"
        class="h-9 rounded-lg w-full bg-white border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
      />
    </div>
    <div
      class="space-y-2"
      v-if="
        formData.product_type == 'App\\Models\\EntranceTicket' ||
        formData.product_type == 'App\\Models\\Hotel' ||
        formData.product_type == 'App\\Models\\PrivateVanTour' ||
        formData.product_type == 'App\\Models\\GroupTour' ||
        formData.product_type == 'App\\Models\\Airline'
      "
    >
      <div class="space-y-2">
        <p class="text-gray-800 text-[10px]">Total Cost</p>
        <p
          class="h-8 w-full bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
          v-if="!formData.checkin_date"
        >
          {{ formData.cost_price * formData.quantity }}
        </p>
        <p
          class="h-8 w-full bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
          v-if="formData.checkin_date"
        >
          {{ formData.cost_price * formData.hotalQuantity }}
        </p>
      </div>

      <div class="space-y-2">
        <p class="text-gray-800 text-[10px]">Receipt</p>
        <div class="space-y-4 mb-2">
          <input
            type="file"
            id="image"
            ref="fileInputThree"
            multiple
            class="hidden"
            @change="recehandleFileChange"
            accept="image/*"
          />
          <div
            @click.prevent="openFilePickerThree"
            class="py-4 px-4 flex justify-center items-center text-xs border border-gray-400 border-dashed"
          >
            <span class="text-xs"
              ><i class="fa-solid fa-plus text-2xl text-gray-800"></i
            ></span>
          </div>

          <div class="grid grid-cols-3 gap-3 mt-4">
            <div
              class="relative"
              v-for="(image, index) in uploadRecePreview"
              :key="index"
            >
              <button
                @click.prevent="expremoveSecSelectedImage(index)"
                class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
              >
                <XCircleIcon class="w-8 h-8" />
              </button>

              <img class="h-auto w-full rounded" :src="image" alt="" />
            </div>
          </div>

          <div
            class="grid grid-cols-2 gap-4 bg-gray-200/50"
            v-if="booking_receipt.length != 0"
          >
            <div v-for="(image, index) in booking_receipt" :key="index">
              <span
                ><i
                  class="fa-solid fa-trash-can text-lg text-red-500"
                  @click="deleteImage(image.id)"
                ></i
              ></span>
              <a :href="image.file" target="_blink">
                <img :src="image.file" alt="" />
              </a>
            </div>
          </div>
          <div class="space-y-2">
            <p class="text-gray-800 text-[10px] font">Expense Comment</p>

            <textarea
              class="w-full bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
              cols="4"
              v-model="secForm.customer_feedback"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const formData = ref({
  payment_method: "",
  bank_name: "",
  payment_status: "",
  bank_account_number: "",
  cost_price: "",
  product_type: "",
  quantity: 0,
  hotalQuantity: 0,
  checkin_date: "",
  customer_feedback: "",
  booking_receipt: [],
  checkout_date: "",
});

const paymentArray = [
  // Bank Transfer, International Remittance, Cash, etc
  { id: "1", name: "Bank Transfer" },
  { id: "2", name: "International Remittance" },
  { id: "3", name: "Cash" },
  { id: "4", name: "Other ..." },
];

const payment = [
  { id: "1", name: "K + " },
  { id: "2", name: "SCB " },
  { id: "3", name: "Bangkok Bank" },
  { id: "4", name: "Other Bank " },
];

const payment_status = [
  { id: "1", name: "fully_paid" },
  { id: "2", name: "not_paid" },
  { id: "3", name: "partially_paid" },
];
</script>
