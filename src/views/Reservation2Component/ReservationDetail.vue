<script setup>
import { ref } from "vue";
import GeneralDetailPage from "./GeneralDetail.vue";
import PassportInfo from "./PassportInfo.vue";
import BookingRequest from "./BookingRequest.vue";
import InvoiceUpdate from "./InvoiceUpdate.vue";
import Expense from "./Expense.vue";
import Confirmation from "./Confirmation.vue";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";

const part = ref("general");

const hide = ref(false);
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div class="flex justify-start items-center gap-x-2">
        <p class="text-xs bg-[#FF613c] text-white px-3 py-1.5 rounded-lg">
          View invoice
        </p>
        <p
          class="text-xs bg-green-600 flex justify-center items-center gap-x-2 text-white px-3 py-1.5 rounded-lg"
        >
          <span
            class="h-1.5 mr-0.5 w-1.5 bg-white rounded-full inline-block"
          ></span
          >fully paid
        </p>
      </div>
      <div class="flex justify-end items-center gap-x-2">
        <p class="text-xs bg-[#FF613c] text-white px-3 py-1.5 rounded-lg">
          Copy Expense
        </p>
        <p class="text-xs bg-[#FF613c] text-white px-3 py-1.5 rounded-lg">
          Generate Confirmation
        </p>
      </div>
    </div>
    <div class="grid grid-cols-5 gap-2">
      <div class="col-span-5 flex justify-between items-center">
        <div>
          <p class="text-[10px] text-gray-500">customer name</p>
          <p class="text-2xl text-[#FF613c] font-medium pb-2">
            Kaung Myat Kyaw
          </p>
          <div class="flex justify-start items-center gap-x-2">
            <p class="text-xs px-3 py-0.5 text-white rounded-lg bg-[#FF613c]">
              CS-00000
            </p>
            <p class="text-xs px-3 py-0.5 text-white rounded-lg bg-blue-600">
              Ticket
            </p>
            <p class="text-xs px-3 py-0.5 text-white rounded-lg bg-black">
              Contact
            </p>
          </div>
        </div>
        <div class="">
          <p class="text-[10px] text-gray-500 text-end">score</p>
          <p class="text-2xl text-red-500 font-medium pb-2 text-end">0.09</p>
          <div class="flex justify-start items-center gap-x-2">
            <p
              class="text-xs cursor-pointer px-2 py-0.5 flex justify-center gap-x-2 items-center text-white rounded-lg bg-[#FF613c]"
            >
              Product <ChevronRightIcon class="w-3 h-3 text-white" />
            </p>
            <p
              @click="hide = !hide"
              class="text-xs cursor-pointer px-2 py-0.5 flex justify-center gap-x-2 items-center text-white rounded-lg bg-black"
            >
              {{ !hide ? "Hide" : "Show"
              }}<ChevronDownIcon class="w-3 h-3 text-white" />
            </p>
          </div>
        </div>
      </div>
      <div class="col-span-2" v-if="!hide">
        <div class="flex justify-start items-start gap-x-4 pt-6">
          <div>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR68pY9CYdqcdiQugy9v-MbB5udT_mEbzDjPQ&s"
              class="w-[100px] shadow object-cover rounded-lg h-[130px]"
              alt=""
            />
          </div>
          <div>
            <p class="text-[10px] text-gray-500">Attraction Name</p>
            <p class="text-md text-[#FF613c] pb-2">Dream World</p>
            <p class="text-[10px] text-gray-500">Variation</p>
            <p class="text-md text-[#FF613c] pb-2">Entrance Ticket</p>
            <p class="text-[10px] text-gray-500">Service Date :</p>
            <p class="text-md text-[#FF613c] pb-2">02/Feb/2025</p>
          </div>
        </div>
      </div>

      <div class="col-span-3 flex justify-end items-end gap-x-16" v-if="!hide">
        <div class="relative grid grid-cols-[auto_1fr] gap-4">
          <!-- Vertical "Invoice Information" Text -->
          <p
            class="text-xs font-semibold text-[#FF613c] writing-mode-vertical-lr absolute bottom-[44%] text-nowrap transform -rotate-90 -left-[80px]"
          >
            Booking Information
          </p>

          <!-- Rest of the Content -->
          <div>
            <p class="text-[10px] text-gray-500">Total Adult :</p>
            <p class="text-base text-[#FF613c] pb-2">4 x 1360</p>
            <p class="text-[10px] text-gray-500">Total Child :</p>
            <p class="text-base text-[#FF613c] pb-2">3 x 1050</p>
            <!-- <p class="text-[10px] text-gray-500">Reser Discount :</p>
            <p class="text-base text-[#FF613c] pb-2">2380 thb</p> -->
            <p class="text-[10px] text-gray-500">Reser Expense :</p>
            <p class="text-base text-[#FF613c]">13,000 thb</p>
            <!-- <p class="text-[10px] text-gray-500">Reser Price</p>
            <p class="text-sm text-[#FF613c]">15500 thb</p> -->
          </div>
        </div>
        <div class="relative grid grid-cols-[auto_1fr] gap-4">
          <!-- Vertical "Invoice Information" Text -->
          <p
            class="text-xs font-semibold text-[#FF613c] writing-mode-vertical-lr absolute bottom-[42%] text-nowrap transform -rotate-90 -left-[80px]"
          >
            Invoice Information
          </p>

          <!-- Rest of the Content -->
          <div>
            <p class="text-[10px] text-gray-500">Reser Discount :</p>
            <p class="text-base text-[#FF613c] pb-2">2380 thb</p>
            <!-- <p class="text-[10px] text-gray-500">Payment Method :</p>
            <p class="text-base text-[#FF613c] pb-2">Cash</p> -->
            <!-- <p class="text-[10px] text-gray-500">Total Discount :</p>
            <p class="text-base text-[#FF613c] pb-2">2380 thb</p> -->
            <p class="text-[10px] text-gray-500">Total Invoice :</p>
            <p class="text-base text-[#FF613c] pb-2">135,000 thb</p>
            <p class="text-[10px] text-gray-500">Balance Due</p>
            <p class="text-base text-[#FF613c]">0 thb</p>
          </div>
        </div>

        <div class="relative grid grid-cols-[auto_1fr] gap-4">
          <!-- Vertical "Invoice Information" Text -->
          <p
            class="text-xs font-semibold text-[#FF613c] writing-mode-vertical-lr absolute bottom-[33%] text-nowrap transform -rotate-90 -left-[65px]"
          >
            Dates & Details
          </p>

          <!-- Rest of the Content -->
          <div>
            <!-- <p class="text-[10px] text-gray-500">Service Date :</p>
            <p class="text-sm text-[#FF613c] pb-2">02/Feb/2025</p> -->
            <!-- <p class="text-[10px] text-gray-500">Sale Date :</p>
            <p class="text-base text-[#FF613c] pb-2">08/Feb/2025</p> -->
            <p class="text-[10px] text-gray-500">Total Items :</p>
            <p class="text-base text-[#FF613c] pb-2">4</p>
            <!-- <p class="text-[10px] text-gray-500">Invoice Date :</p>
            <p class="text-base text-[#FF613c] pb-2">-</p> -->
            <p class="text-[10px] text-gray-500">Score :</p>
            <p class="text-base text-[#FF613c] pb-2">0.183</p>
            <!-- <p class="text-[10px] text-gray-500">Current Status</p>
            <p class="text-base text-yellow-400">Booking Request</p> -->
            <p class="text-[10px] text-gray-500">Payment Method :</p>
            <p class="text-base text-[#FF613c]">Cash</p>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="pt-2 relative flex justify-between items-center">
        <!-- line -->
        <div class="w-full h-[3px] absolute bottom-1.5 bg-gray-200"></div>
        <div
          class="w-4 h-4 rounded-full relative z-10"
          :class="part == 'general' ? 'bg-[#FF613c]' : 'bg-gray-200'"
        ></div>
        <div class="w-36 h-[2px] rounded-full relative z-10 bg-gray-200"></div>
        <div
          class="w-4 h-4 rounded-full relative z-10"
          :class="part == 'passport' ? 'bg-[#FF613c]' : 'bg-gray-200'"
        ></div>
        <div class="w-36 h-[2px] rounded-full relative z-10 bg-gray-200"></div>
        <div
          class="w-4 h-4 rounded-full relative z-10"
          :class="part == 'booking' ? 'bg-[#FF613c]' : 'bg-gray-200'"
        ></div>
        <div class="w-36 h-[2px] rounded-full relative z-10 bg-gray-200"></div>
        <div
          class="w-4 h-4 rounded-full relative z-10"
          :class="part == 'invoice' ? 'bg-[#FF613c]' : 'bg-gray-200'"
        ></div>
        <div class="w-36 h-[2px] rounded-full relative z-10 bg-gray-200"></div>
        <div
          class="w-4 h-4 rounded-full relative z-10"
          :class="part == 'expense' ? 'bg-[#FF613c]' : 'bg-gray-200'"
        ></div>
        <div class="w-36 h-[2px] rounded-full relative z-10 bg-gray-200"></div>
        <div
          class="w-4 h-4 rounded-full relative z-10"
          :class="part == 'confirmation' ? 'bg-[#FF613c]' : 'bg-gray-200'"
        ></div>
      </div>
      <div class="flex justify-between pt-2 items-center">
        <!-- line -->
        <div
          class="text-xs cursor-pointer flex justify-center items-center"
          @click="part = 'general'"
          :class="part == 'general' ? 'text-[#FF613c]' : ''"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/128/4626/4626473.png"
            class="w-5 h-5 mr-1.5"
            alt=""
          />
          Payment
        </div>
        <div
          class="text-xs cursor-pointer flex justify-center items-center"
          @click="part = 'passport'"
          :class="part == 'passport' ? 'text-[#FF613c]' : ''"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/128/11183/11183354.png"
            class="w-5 h-5 mr-1.5"
            alt=""
          />
          Passport
        </div>
        <div
          class="text-xs cursor-pointer flex justify-center items-center"
          @click="part = 'booking'"
          :class="part == 'booking' ? 'text-[#FF613c]' : ''"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/128/8068/8068125.png"
            class="w-5 h-5 mr-1.5"
            alt=""
          />
          Booking
        </div>
        <div
          class="text-xs cursor-pointer flex justify-center items-center"
          @click="part = 'invoice'"
          :class="part == 'invoice' ? 'text-[#FF613c]' : ''"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/128/4626/4626473.png"
            class="w-5 h-5 mr-1.5"
            alt=""
          />
          Invoice
        </div>
        <div
          class="text-xs cursor-pointer flex justify-center items-center"
          @click="part = 'expense'"
          :class="part == 'expense' ? 'text-[#FF613c]' : ''"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/128/4626/4626473.png"
            class="w-5 h-5 mr-1.5"
            alt=""
          />
          Expense
        </div>
        <div
          class="text-xs cursor-pointer flex justify-center items-center"
          @click="part = 'confirmation'"
          :class="part == 'confirmation' ? 'text-[#FF613c]' : ''"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/128/4626/4626473.png"
            class="w-5 h-5 mr-1.5"
            alt=""
          />
          Confirm:
        </div>
      </div>
      <div class="pt-6" v-if="part == 'general'">
        <GeneralDetailPage />
      </div>
      <div class="pt-6" v-if="part == 'passport'">
        <PassportInfo />
      </div>
      <div class="pt-6" v-if="part == 'booking'">
        <BookingRequest />
      </div>
      <div class="pt-6" v-if="part == 'invoice'">
        <InvoiceUpdate />
      </div>
      <div class="pt-6" v-if="part == 'expense'">
        <Expense />
      </div>
      <div class="pt-6" v-if="part == 'confirmation'">
        <Confirmation />
      </div>
    </div>
  </div>
</template>
