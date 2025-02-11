<script setup>
import { ref, watch, onMounted, computed } from "vue";
import GeneralDetailPage from "./GeneralDetail.vue";
import PassportInfo from "./PassportInfo.vue";
import BookingRequest from "./BookingRequest.vue";
import InvoiceUpdate from "./InvoiceUpdate.vue";
import Expense from "./Expense.vue";
import Confirmation from "./Confirmation.vue";
import {
  ChevronDoubleRightIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/vue/24/outline";
import { useRoute, useRouter } from "vue-router";
import { useReservationStore } from "../../stores/reservation";
import productIcon from "../../assets/window.png";
import checkImage from "../../assets/check.png";
import { useToast } from "vue-toastification";

const part = ref("general");
const route = useRoute();
const router = useRouter();
const reservationStore = useReservationStore();
const detail = ref(null);
const getLoading = ref(false);
const toast = useToast();

const state = ref({
  general: false,
  passport: false,
  booking: false,
  invoice: false,
  expense: false,
  confirmation: false,
});

const partArray = ref([
  { id: 1, name: "general" },
  { id: 2, name: "passport" },
  { id: 3, name: "booking" },
  { id: 4, name: "invoice" },
  { id: 5, name: "expense" },
  { id: 6, name: "confirmation" },
]);

const rightButtonAction = () => {
  const index = partArray.value.findIndex((item) => item.name == part.value);
  part.value = partArray.value[index + 1].name;
};

const leftButtonAction = () => {
  const index = partArray.value.findIndex((item) => item.name == part.value);
  part.value = partArray.value[index - 1].name;
};

const score = computed(() => {
  if (detail.value?.amount && detail.value?.total_cost_price) {
    let score =
      (detail.value?.amount * 1 - detail.value?.total_cost_price) /
      (detail.value?.amount * 1);
    return score.toFixed(4);
  }
  return 0;
});

const copyReservation = async (id) => {
  const res = await reservationStore.copyReservationDetail(id);
  console.log(res, "this is cpy reservation");
  let formattedOutput;
  if (res.result.checkin_date != undefined) {
    formattedOutput = `
💰 Total Cost: ${res.result.total_cost} THB 🏦 Bank Name: ${
      res.result.bank_name != "null" ? res.result.bank_name : "-"
    }
🔢 Bank Account Number: ${
      res.result.bank_account_number != "null"
        ? `➖${res.result.bank_account_number}`
        : "-"
    }
🧑‍💼 Account Name: ${
      res.result.account_name != "null" ? res.result.account_name : "-"
    }
#️⃣ CRM ID: ${res.result.crm_id}
#️⃣ Reservation Code: ${res.result.reservation_code}
🏨 Hotel Name: ${res.result.product_name}
🏩 Room Name : ${res.result.room_name != "null" ? res.result.room_name : "-"}
🛌 Total Rooms: ${
      res.result.total_rooms != "null" ? res.result.total_rooms : "-"
    }
🌙 Total Nights: ${
      res.result.total_nights != "null" ? res.result.total_nights : "-"
    }
💵 Price: ${res.result.sale_price} THB
💵 Total Sale Amount: ${res.result.total_sale_amount} THB
💸 Discount : ${res.result.discount} THB
💵 Balance Due: ${res.result.balance_due} THB
📝 Payment Status: ${res.result.payment_status}
📅 Sale Date: ${res.result.sale_date != "null" ? res.result.sale_date : "-"}
📅 Check-in Date: ${
      res.result.checkin_date != "null" ? res.result.checkin_date : "-"
    }
📅 Checkout Date: ${
      res.result.checkout_date != "null" ? res.result.checkout_date : "-"
    }
🤑 Score : ${res.result.score}
    `;
  } else if (res.result.entrance_ticket_variation_name) {
    formattedOutput = `
💰 Total Cost: ${res.result.total_cost} THB
🏦 Bank Name: ${res.result.bank_name != "null" ? res.result.bank_name : "-"}
🔢 Bank Account Number: ${
      res.result.bank_account_number != "null"
        ? `➖${res.result.bank_account_number}`
        : "-"
    }
🧑‍💼 Account Name: ${res.result.account_name}
#️⃣ CRM ID: ${res.result.crm_id}
#️⃣ Reservation Code: ${res.result.reservation_code}
🎫 Attraction : ${res.result.product_name}
🎫 Entrance Ticket Name : ${res.result.entrance_ticket_variation_name}
💵 Price: ${res.result.sale_price} THB
💵 Total Sale Amount: ${res.result.total_sale_amount} THB
💸 Discount : ${res.result.discount} THB
💵 Balance Due: ${res.result.balance_due} THB
📝 Payment Status: ${res.result.payment_status}
📅 Sale Date: ${res.result.sale_date != "null" ? res.result.sale_date : "-"}
🗓️ Service Date: ${
      res.result.service_date != "null" ? res.result.service_date : "-"
    }
🤑 Score : ${res.result.score}
    `;
  } else if (res.result.ticket_type) {
    formattedOutput = `
💰 Total Cost: ${res.result.total_cost} THB
#️⃣ CRM ID: ${res.result.crm_id}
#️⃣ Reservation Code: ${res.result.reservation_code}
✈️ Airline Name : ${res.result.product_name}
🎫 Ticket Type : ${res.result.ticket_type}
🎫 Total Tickets : ${res.result.total_ticket}
💵 Price: ${res.result.sale_price} THB
💵 Total Sale Amount: ${res.result.total_sale_amount} THB
💸 Discount : ${res.result.discount} THB
💵 Balance Due: ${res.result.balance_due} THB
📝 Payment Status: ${res.result.payment_status}
📅 Sale Date: ${res.result.sale_date != "null" ? res.result.sale_date : "-"}
🗓️ Service Date: ${
      res.result.service_date != "null" ? res.result.service_date : "-"
    }
🧾 Payment Status: ${res.result.payment_status}
🤑 Score : ${res.result.score}
📝 Expense Comment:
  `;
  }

  setTimeout(() => {
    navigator.clipboard.writeText(formattedOutput);
  }, 0);

  toast.success("success copy reservation");
};

watch(
  () => detail.value,
  () => {
    if (detail.value.booking.payment_status == "fully_paid") {
      state.value.general = true;
    } else {
      state.value.general = false;
    }
    if (detail.value.customer_passports.length > 0) {
      state.value.passport = true;
    } else {
      state.value.passport = false;
    }
    if (detail.value.booking_confirm_letters.length > 0) {
      state.value.invoice = true;
    } else {
      state.value.invoice = false;
    }
  }
);

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
    <div class="space-y-4" v-if="!getLoading">
      <div class="flex justify-between items-center">
        <div class="flex justify-start items-center gap-x-2">
          <p
            @click="router.push(`/bookings/new-update/${detail?.booking?.id}`)"
            class="text-[10px] bg-[#FF613c] cursor-pointer shadow text-white px-3 py-1.5 rounded-lg"
          >
            View invoice
          </p>
          <p
            class="text-[10px] shadow flex justify-center items-center gap-x-2 text-white px-3 py-1.5 rounded-lg"
            :class="{
              'bg-green-500': detail?.booking?.payment_status == 'fully_paid',
              'bg-red-500': detail?.booking?.payment_status != 'fully_paid',
            }"
          >
            <span
              class="h-1 mr-0.5 w-1 bg-white rounded-full inline-block"
            ></span
            >{{ detail?.booking?.payment_status }}
          </p>
        </div>
        <div class="flex justify-end items-center gap-x-2">
          <p
            class="text-[10px] bg-[#FF613c] text-white cursor-pointer px-3 py-1.5 rounded-lg"
            @click="copyReservation(detail?.id)"
          >
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
            <p class="text-[18px] text-[#FF613c] font-medium pb-2">
              {{ detail?.customer_info.name }}
            </p>
            <div class="flex justify-start items-center gap-x-2">
              <p
                class="text-[10px] px-1.5 py-0.5 text-white rounded-lg bg-[#FF613c]"
              >
                {{ detail?.crm_id }}
              </p>
              <p
                class="text-[10px] px-1.5 py-0.5 text-white rounded-lg bg-blue-600"
                v-if="detail?.product_type == 'App\\Models\\EntranceTicket'"
              >
                Ticket
              </p>
              <p
                class="text-[10px] px-1.5 py-0.5 text-white rounded-lg bg-black"
              >
                Contact
              </p>
            </div>
          </div>
          <div class="">
            <p class="text-[10px] text-gray-500 text-end">score</p>
            <p class="text-2xl text-red-500 font-medium pb-2 text-end">
              {{ score }}
            </p>
            <div class="flex justify-start items-center gap-x-2">
              <p
                class="text-xs cursor-pointer px-2 py-0.5 flex justify-center gap-x-1.5 items-center text-white rounded-lg bg-[#FF613c]"
              >
                <img :src="productIcon" alt="" class="w-3 h-3" />Product
              </p>
              <p
                @click="hide = !hide"
                class="text-xs cursor-pointer px-2 py-0.5 flex justify-center gap-x-1 items-center text-white rounded-lg bg-black"
              >
                <ChevronDownIcon class="w-3 h-3 text-white" />{{
                  !hide ? "Hide" : "Show"
                }}
              </p>
            </div>
          </div>
        </div>
        <div class="col-span-2" v-if="!hide">
          <div class="flex justify-start items-start gap-x-4 pt-3">
            <div>
              <img
                :src="
                  detail?.product?.cover_image
                    ? detail?.product?.cover_image
                    : 'https://placehold.co/400'
                "
                class="min-w-[120px] max-w-[120px] shadow object-cover rounded-lg h-[130px]"
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
              <p class="text-[12px] text-[#FF613c] pb-2">{{ score }}</p>
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
            v-if="!state.general"
            @click="part = 'general'"
            class="w-6 h-6 flex justify-center shadow hover:shadow-nano cursor-pointer items-center text-[10px] rounded-full relative z-10"
            :class="
              part == 'general' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
            "
          >
            1
          </div>
          <div
            v-if="state.general"
            class="w-6 h-6 flex justify-center shadow hover:shadow-nano cursor-pointer items-center text-[10px] rounded-full relative z-10"
            :class="part == 'general' ? 'bg-white text-white' : ''"
            @click="part = 'general'"
          >
            <img :src="checkImage" alt="" />
          </div>
          <div
            class="w-36 h-[2px] rounded-full relative z-10"
            :class="state.general ? 'bg-[#04BA00]' : 'bg-gray-200'"
          ></div>
          <div
            v-if="!state.passport"
            @click="part = 'passport'"
            class="w-6 h-6 flex justify-center cursor-pointer items-center text-[10px] rounded-full relative z-10"
            :class="
              part == 'passport' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
            "
          >
            2
          </div>
          <div
            v-if="state.passport"
            @click="part = 'passport'"
            class="w-6 h-6 flex justify-center cursor-pointer shadow hover:shadow-none items-center text-[10px] rounded-full relative z-10"
            :class="part == 'passport' ? 'bg-white text-white' : ''"
          >
            <img :src="checkImage" alt="" />
          </div>
          <div
            class="w-36 h-[2px] rounded-full relative z-10"
            :class="state.passport ? 'bg-[#04BA00]' : 'bg-gray-200'"
          ></div>
          <div
            @click="part = 'booking'"
            class="w-6 h-6 flex justify-center shadow hover:shadow-nano cursor-pointer items-center text-[10px] rounded-full relative z-10"
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
            v-if="!state.invoice"
            @click="part = 'invoice'"
            class="w-6 h-6 flex justify-center items-center shadow hover:shadow-nano cursor-pointer text-[10px] rounded-full relative z-10"
            :class="
              part == 'invoice' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
            "
          >
            4
          </div>
          <div
            v-if="state.invoice"
            @click="part = 'invoice'"
            class="w-6 h-6 flex justify-center shadow hover:shadow-nano cursor-pointer items-center text-[10px] rounded-full relative z-10"
            :class="part == 'invoice' ? 'bg-white text-white' : ''"
          >
            <img :src="checkImage" alt="" />
          </div>
          <div
            class="w-36 h-[2px] rounded-full relative z-10"
            :class="state.invoice ? 'bg-[#04BA00]' : 'bg-gray-200'"
          ></div>

          <div
            @click="part = 'expense'"
            class="w-6 h-6 flex justify-center items-center text-[10px] shadow hover:shadow-none cursor-pointer rounded-full relative z-10"
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
            @click="part = 'confirmation'"
            class="w-6 h-6 flex justify-center items-center text-[10px] shadow hover:shadow-none cursor-pointer rounded-full relative z-10"
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
            :class="[
              state.general ? 'text-[#04BA00]' : '',
              part === 'general' ? 'text-[#FF613c]' : 'text-gray-500',
            ]"
          >
            Payment<span
              v-if="part == 'general' && state.general"
              class="w-1 h-1 rounded-full inline-block bg-[#04BA00] ml-2"
            ></span>
          </div>
          <div
            class="text-xs cursor-pointer flex justify-center items-center"
            @click="part = 'passport'"
            :class="[
              state.passport ? 'text-[#04BA00]' : '',
              part === 'passport' ? 'text-[#FF613c]' : 'text-gray-500',
            ]"
          >
            Passport<span
              v-if="part == 'passport' && state.passport"
              class="w-1 h-1 rounded-full inline-block bg-[#04BA00] ml-2"
            ></span>
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
            :class="[
              part === 'invoice' ? 'text-[#FF613c]' : 'text-gray-500',
              state.invoice ? 'text-[#04BA00]' : '',
            ]"
          >
            invoice<span
              v-if="part == 'invoice' && state.invoice"
              class="w-1 h-1 rounded-full inline-block bg-[#04BA00] ml-2"
            ></span>
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
        <div class="px-16 relative">
          <ChevronRightIcon
            @click="rightButtonAction"
            class="w-6 cursor-pointer h-6 bg-[#FF613c] text-white shadow p-1 rounded-full absolute right-0 top-[35px]"
          />
          <ChevronLeftIcon
            @click="leftButtonAction"
            class="w-6 cursor-pointer h-6 bg-[#FF613c] text-white shadow p-1 rounded-full absolute left-0 top-[35px]"
          />
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
  </div>
</template>
