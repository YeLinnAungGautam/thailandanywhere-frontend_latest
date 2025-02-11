<script setup>
import { ref, watch, onMounted } from "vue";
import GeneralDetailPage from "./GeneralDetail.vue";
import PassportInfo from "./PassportInfo.vue";
import BookingRequest from "./BookingRequest.vue";
import InvoiceUpdate from "./InvoiceUpdate.vue";
import Expense from "./Expense.vue";
import Confirmation from "./Confirmation.vue";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
import { useRoute, useRouter } from "vue-router";
import { useReservationStore } from "../../stores/reservation";

const part = ref("general");
const route = useRoute();
const router = useRouter();
const reservationStore = useReservationStore();
const detail = ref(null);
const getLoading = ref(false);

watch(
  () => route.query.id,
  async (newId) => {
    if (newId) {
      getLoading.value = true;
      const res = await reservationStore.getDetailAction(newId);
      detail.value = res.result;
      console.log(detail.value, "this is get detail value");
      getLoading.value = false;
    }
  },
  { immediate: true } // This will run the watcher immediately when the component is created
);

watch(
  () => part.value,
  (newPart) => {
    router.push({ query: { id: route.query.id, part: newPart } });
  }
);

onMounted(() => {
  if (!route.query.id) {
    getLoading.value = true;
  }
  if (route.query.part) {
    part.value = route.query.part;
  }
});

const hide = ref(false);
</script>

<template>
  <div>
    <div v-if="getLoading">
      <div class="flex justify-center items-center h-[70vh]">
        <p>If finish select reservation one, please wait for loading !</p>
      </div>
    </div>
    <div class="space-y-6" v-if="!getLoading">
      <div class="flex justify-between items-center">
        <div class="flex justify-start items-center gap-x-2">
          <p class="text-[10px] bg-[#FF613c] text-white px-3 py-1.5 rounded-lg">
            View invoice
          </p>
          <p
            class="text-[10px] flex justify-center items-center gap-x-2 text-white px-3 py-1.5 rounded-lg"
            :class="{
              'bg-green-500': detail?.payment_status == 'fully_paid',
              'bg-red-500': detail?.payment_status != 'fully_paid',
            }"
          >
            <span
              class="h-1.5 mr-0.5 w-1.5 bg-white rounded-full inline-block"
            ></span
            >{{ detail?.payment_status }}
          </p>
        </div>
        <div class="flex justify-end items-center gap-x-2">
          <p class="text-[10px] bg-[#FF613c] text-white px-3 py-1.5 rounded-lg">
            Copy Expense
          </p>
          <p class="text-[10px] bg-[#FF613c] text-white px-3 py-1.5 rounded-lg">
            Generate Confirmation
          </p>
        </div>
      </div>
      <div class="grid grid-cols-5 gap-2">
        <div class="col-span-5 flex justify-between items-center">
          <div>
            <p class="text-[10px] text-gray-500">customer name</p>
            <p class="text-[22px] text-[#FF613c] font-medium pb-2">
              {{ detail?.customer_info.name }}
            </p>
            <div class="flex justify-start items-center gap-x-2">
              <p class="text-xs px-3 py-0.5 text-white rounded-lg bg-[#FF613c]">
                {{ detail?.crm_id }}
              </p>
              <p
                class="text-xs px-3 py-0.5 text-white rounded-lg bg-blue-600"
                v-if="detail?.product_type == 'App\\Models\\EntranceTicket'"
              >
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
                :src="
                  detail?.product?.cover_image
                    ? detail?.product?.cover_image
                    : 'https://placehold.co/400'
                "
                class="min-w-[140px] max-w-[140px] shadow object-cover rounded-lg h-[130px]"
                alt=""
              />
            </div>
            <div>
              <p class="text-[10px] text-gray-500">Attraction Name</p>
              <p class="text-[12px] text-[#FF613c] pb-2">
                {{ detail?.product?.name }}
              </p>
              <p class="text-[10px] text-gray-500">Variation</p>
              <p class="text-[12px] text-[#FF613c] pb-2">
                {{ detail?.variation?.name }}
              </p>
              <p class="text-[10px] text-gray-500">Service Date :</p>
              <p class="text-[12px] text-[#FF613c] pb-2">
                {{ detail?.service_date }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="col-span-3 flex justify-end items-end gap-x-16"
          v-if="!hide"
        >
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
              <p class="text-[12px] text-[#FF613c] pb-2">
                {{ detail?.quantity }} x {{ detail?.selling_price }}
              </p>
              <p class="text-[10px] text-gray-500">Total Child :</p>
              <p class="text-[12px] text-[#FF613c] pb-2">-</p>
              <!-- <p class="text-[10px] text-gray-500">Reser Discount :</p>
              <p class="text-[12px] text-[#FF613c] pb-2">2380 thb</p> -->
              <p class="text-[10px] text-gray-500">Reser Expense :</p>
              <p class="text-[12px] text-[#FF613c]">
                {{ detail?.total_cost_price }} thb
              </p>
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
              <p class="text-[12px] text-[#FF613c] pb-2">
                {{ detail?.discount }} thb
              </p>
              <!-- <p class="text-[10px] text-gray-500">Payment Method :</p>
              <p class="text-[12px] text-[#FF613c] pb-2">Cash</p> -->
              <!-- <p class="text-[10px] text-gray-500">Total Discount :</p>
              <p class="text-[12px] text-[#FF613c] pb-2">2380 thb</p> -->
              <p class="text-[10px] text-gray-500">Total Invoice :</p>
              <p class="text-[12px] text-[#FF613c] pb-2">
                {{ detail?.booking?.sub_total }} thb
              </p>
              <p class="text-[10px] text-gray-500">Balance Due</p>
              <p class="text-[12px] text-[#FF613c]">
                {{ detail?.booking?.balance_due }} thb
              </p>
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
              <p class="text-[12px] text-[#FF613c] pb-2">08/Feb/2025</p> -->
              <p class="text-[10px] text-gray-500">Total Items :</p>
              <p class="text-[12px] text-[#FF613c] pb-2">-</p>
              <!-- <p class="text-[10px] text-gray-500">Invoice Date :</p>
              <p class="text-[12px] text-[#FF613c] pb-2">-</p> -->
              <p class="text-[10px] text-gray-500">Score :</p>
              <p class="text-[12px] text-[#FF613c] pb-2">0.183</p>
              <!-- <p class="text-[10px] text-gray-500">Current Status</p>
              <p class="text-[12px] text-yellow-400">Booking Request</p> -->
              <p class="text-[10px] text-gray-500">Payment Method :</p>
              <p class="text-[12px] text-[#FF613c]">
                {{ detail?.booking?.payment_method }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="pt-2 relative flex justify-between items-center">
          <!-- line -->
          <div class="w-full h-[3px] absolute bottom-2.5 bg-gray-200"></div>
          <div
            class="w-6 h-6 flex justify-center items-center text-[10px] rounded-full relative z-10"
            :class="
              part == 'general' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
            "
          >
            1
          </div>
          <div
            class="w-36 h-[2px] rounded-full relative z-10 bg-gray-200"
          ></div>
          <div
            class="w-6 h-6 flex justify-center items-center text-[10px] rounded-full relative z-10"
            :class="
              part == 'passport' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
            "
          >
            2
          </div>
          <div
            class="w-36 h-[2px] rounded-full relative z-10 bg-gray-200"
          ></div>
          <div
            class="w-6 h-6 flex justify-center items-center text-[10px] rounded-full relative z-10"
            :class="
              part == 'booking' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
            "
          >
            3
          </div>
          <div
            class="w-36 h-[2px] rounded-full relative z-10 bg-gray-200"
          ></div>
          <div
            class="w-6 h-6 flex justify-center items-center text-[10px] rounded-full relative z-10"
            :class="
              part == 'invoice' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
            "
          >
            4
          </div>
          <div
            class="w-36 h-[2px] rounded-full relative z-10 bg-gray-200"
          ></div>
          <div
            class="w-6 h-6 flex justify-center items-center text-[10px] rounded-full relative z-10"
            :class="
              part == 'expense' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
            "
          >
            5
          </div>
          <div
            class="w-36 h-[2px] rounded-full relative z-10 bg-gray-200"
          ></div>
          <div
            class="w-6 h-6 flex justify-center items-center text-[10px] rounded-full relative z-10"
            :class="
              part == 'confirmation' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
            "
          >
            6
          </div>
        </div>
        <div class="flex justify-between pt-2 items-center">
          <!-- line -->
          <div
            class="text-xs cursor-pointer flex justify-center items-center"
            @click="part = 'general'"
            :class="part == 'general' ? 'text-[#FF613c]' : ''"
          >
            Payment
          </div>
          <div
            class="text-xs cursor-pointer flex justify-center items-center"
            @click="part = 'passport'"
            :class="part == 'passport' ? 'text-[#FF613c]' : ''"
          >
            Passport
          </div>
          <div
            class="text-xs cursor-pointer flex justify-center items-center"
            @click="part = 'booking'"
            :class="part == 'booking' ? 'text-[#FF613c]' : ''"
          >
            Booking
          </div>
          <div
            class="text-xs cursor-pointer flex justify-center items-center"
            @click="part = 'invoice'"
            :class="part == 'invoice' ? 'text-[#FF613c]' : ''"
          >
            Invoice
          </div>
          <div
            class="text-xs cursor-pointer flex justify-center items-center"
            @click="part = 'expense'"
            :class="part == 'expense' ? 'text-[#FF613c]' : ''"
          >
            Expense
          </div>
          <div
            class="text-xs cursor-pointer flex justify-center items-center"
            @click="part = 'confirmation'"
            :class="part == 'confirmation' ? 'text-[#FF613c]' : ''"
          >
            Confirm:
          </div>
        </div>
        <div class="pt-6" v-if="part == 'general'">
          <GeneralDetailPage :detail="detail" />
        </div>
        <div class="pt-6" v-if="part == 'passport'">
          <PassportInfo :data="detail" />
        </div>
        <div class="pt-6" v-if="part == 'booking'">
          <BookingRequest :detail="detail" />
        </div>
        <div class="pt-6" v-if="part == 'invoice'">
          <InvoiceUpdate :detail="detail" />
        </div>
        <div class="pt-6" v-if="part == 'expense'">
          <Expense :data="detail" />
        </div>
        <div class="pt-6" v-if="part == 'confirmation'">
          <Confirmation :data="detail" />
        </div>
      </div>
    </div>
  </div>
</template>
