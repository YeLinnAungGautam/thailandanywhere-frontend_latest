<script setup>
import { ref, watch, onMounted, computed, defineProps } from "vue";
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
  XCircleIcon,
} from "@heroicons/vue/24/outline";
import { useRoute, useRouter } from "vue-router";
import { useGroupByStore } from "../../stores/groupby";
import productIcon from "../../assets/window.png";
import checkImage from "../../assets/check.png";
import { useToast } from "vue-toastification";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import logo from "../../assets/web-logo.png";

const props = defineProps({
  show: Number,
});

const part = ref("general");
const route = useRoute();
const router = useRouter();
const groupbyStore = useGroupByStore();
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

const transition = ref("slide-right");

const rightButtonAction = () => {
  transition.value = "slide-right";
  const index = partArray.value.findIndex((item) => item.name == part.value);
  part.value = partArray.value[index + 1].name;
};

const leftButtonAction = () => {
  transition.value = "slide-left";
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

const showFailModal = ref(false);
const generateConfirmation = () => {
  if (detail.value?.booking?.payment_status != "not_paid") {
    router.push(`/reservation/confirmations/entrance/${route.query.id}`);
  } else {
    showFailModal.value = true;
  }
};

const goToFill = () => {
  router.push({
    name: "update_new_bookings",
    params: {
      id: detail.value?.booking?.id,
    },
  });

  showFailModal.value = false;
};

const getComponent = (part) => {
  const components = {
    general: GeneralDetailPage,
    passport: PassportInfo,
    booking: BookingRequest,
    invoice: InvoiceUpdate,
    expense: Expense,
    confirmation: Confirmation,
  };
  return components[part];
};

const getDetailAction = async (id) => {
  getLoading.value = true;
  const res = await groupbyStore.ReservationHotelDetailAction(id);
  detail.value = res;
  console.log(detail.value, "this is detail");

  getLoading.value = false;
};

const calculateDaysBetween = (a, b) => {
  if (a && b) {
    const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const startDateTimestamp = new Date(a).getTime();
    const endDateTimestamp = new Date(b).getTime();
    let result = Math.abs(
      Math.round((endDateTimestamp - startDateTimestamp) / oneDay)
    );
    // formitem.value.days = result;
    return result;
  }
};

const printHotelConfirm = () => {
  window.open(
    import.meta.env.VITE_API_URL +
      "/hotel-reservation/" +
      route.query.id +
      "/receipt"
  );
};

const copyReservation = async (id) => {
  try {
    const res = await groupbyStore.ReservationHotelDetailCopyAction(id);
    console.log(res, "this is cpy reservation");

    // Check if we have data and items
    if (!res || !res.items || res.items.length === 0) {
      toast.error("No reservation items found");
      return;
    }

    let discount = 0;
    for (let i = 0; i < res.items.length; i++) {
      discount += res.items[i].discount;
    }
    let score =
      (res.summary.total_amount * 1 - res.summary.total_cost * 1) /
      (res.summary.total_cost * 1);

    // Create formatted output for all items
    let allFormattedOutput = "";

    // Add booking header
    allFormattedOutput += `💰 Total Cost: ${res.summary.total_cost} THB
🏦 Bank Name: ${res.items[0].bank_name != "null" ? res.items[0].bank_name : "-"}
🔢 Bank Account Number: ${
      res.items[0].bank_account_number != "null"
        ? `➖${res.items[0].bank_account_number}`
        : "-"
    }
🧑‍💼 Account Name: ${
      res.items[0].account_name != "null" ? res.items[0].account_name : "-"
    }
#️⃣ CRM ID: ${res.crm_id}\n`;

    res.items.forEach((item, index) => {
      allFormattedOutput += `#️⃣ Reservation Code: ${item.reservation_code}: (${item.selling_price})\n`;
    });

    allFormattedOutput += `🏨 ${res.items[0].product_name}\n`;

    res.items.forEach((a, index) => {
      allFormattedOutput += `🏩 Room Name: ${a.room_name}\n`;
    });

    allFormattedOutput += `💵 Price: ${res.summary.total_amount} THB
💵 Total Sale Amount: ${res.selling_price} THB
💸 Discount : ${discount} THB
💵 Balance Due: ${res.balance_due} THB
📝 Payment Status: ${res.payment_status}
📅 Sale Date: ${res.booking_date}
🤑 Score : ${score.toFixed(2)}
    \n`;

    // Copy to clipboard with a short timeout to ensure UI isn't blocked
    setTimeout(() => {
      navigator.clipboard.writeText(allFormattedOutput);
      toast.success("success copy reservation");
    }, 0);

    return allFormattedOutput;
  } catch (error) {
    console.error("Error copying reservations:", error);
    toast.error("Failed to copy reservation");
  }
};

// watch(
//   () => detail.value,
//   () => {
//     if (detail.value.booking.payment_status == "fully_paid") {
//       state.value.general = true;
//     } else {
//       state.value.general = false;
//     }
//     if (detail.value.customer_passports.length > 0) {
//       state.value.passport = true;
//     } else {
//       state.value.passport = false;
//     }
//     if (detail.value.is_booking_request == 1) {
//       state.value.booking = true;
//     } else {
//       state.value.booking = false;
//     }
//     if (detail.value.booking_confirm_letters.length > 0) {
//       state.value.invoice = true;
//     } else {
//       state.value.invoice = false;
//     }
//     if (detail.value.payment_status == "fully_paid") {
//       state.value.expense = true;
//     } else {
//       state.value.expense = false;
//     }
//     if (detail.value.reservation_status == "confirmed") {
//       state.value.confirmation = true;
//     } else {
//       state.value.confirmation = false;
//     }
//   }
// );

watch(
  () => route.query.id,
  async (newId) => {
    if (newId) {
      getDetailAction(newId);
      // console.log(detail.value, "this is get detail value");
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
      <div class="flex justify-center text-xs items-center h-[70vh]">
        <svg
          class="text-gray-300 animate-spin mr-2"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
        >
          <path
            d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
            stroke="currentColor"
            stroke-width="5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
            stroke="currentColor"
            stroke-width="5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-gray-900"
          ></path>
        </svg>
        <p>loading</p>
      </div>
    </div>
    <div class="space-y-4" v-if="!getLoading">
      <div
        class="flex justify-between items-center space-x-2 overflow-x-scroll no-sidebar-container"
      >
        <div class="flex justify-start items-center gap-x-2">
          <p
            @click="router.push(`/bookings/new-update/${detail?.booking?.id}`)"
            class="text-[10px] bg-[#FF613c] whitespace-nowrap cursor-pointer shadow text-white px-3 py-1.5 rounded-lg"
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
            class="text-[10px] bg-[#FF613c] text-white whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-lg"
            @click="copyReservation(detail?.booking?.id)"
          >
            Copy Expense
          </p>
          <p
            class="text-[10px] bg-[#FF613c] whitespace-nowrap text-white px-3 py-1.5 rounded-lg cursor-pointer"
            @click="
              detail?.product_type == 'App\\Models\\EntranceTicket'
                ? generateConfirmation()
                : printHotelConfirm()
            "
          >
            Generate Confirmation
          </p>
        </div>
      </div>
      <div class="grid grid-cols-5 gap-2">
        <div class="col-span-5 flex justify-between items-center">
          <div>
            <p class="text-[10px] text-gray-500">customer name</p>
            <p class="text-[18px] text-[#FF613c] font-medium pb-2">
              {{ detail?.booking.customer_info?.name }}
            </p>
            <div class="flex justify-start items-center gap-x-2">
              <p
                class="text-[10px] px-1.5 whitespace-nowrap py-0.5 text-white rounded-lg bg-[#FF613c]"
              >
                {{ detail?.booking?.crm_id }}
              </p>
              <!-- <p
                class="text-[10px] px-1.5 py-0.5 text-white rounded-lg bg-blue-600"
                v-if="detail?.product_type == 'App\\Models\\EntranceTicket'"
              >
                Ticket
              </p> -->
              <p
                class="text-[10px] px-1.5 py-0.5 text-white rounded-lg bg-green-600"
              >
                Hotel: {{ detail?.booking?.items[0].product?.name }}
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
            <p class="text-lg text-red-500 font-medium pb-2 text-end">
              {{ score }}
            </p>
            <div class="flex justify-start items-center gap-x-2">
              <p
                class="text-[10px] cursor-pointer px-2 py-0.5 flex justify-center gap-x-1.5 items-center text-white rounded-lg bg-[#FF613c]"
              >
                <img :src="productIcon" alt="" class="w-3 h-3" />Product
              </p>
              <p
                @click="hide = !hide"
                class="text-[10px] cursor-pointer px-2 py-0.5 flex justify-center gap-x-1 items-center text-white rounded-lg bg-black"
              >
                <ChevronDownIcon class="w-3 h-3 text-white" />{{
                  !hide ? "Hide" : "Show"
                }}
              </p>
            </div>
          </div>
        </div>
        <div :class="show != 3 ? 'col-span-5' : 'col-span-5'" v-if="!hide">
          <div class="flex justify-between items-start gap-x-4 pt-3">
            <div>
              <img
                v-if="detail?.product_type == 'App\\Models\\EntranceTicket'"
                :src="
                  detail?.product?.cover_image
                    ? detail?.product?.cover_image
                    : 'https://placehold.co/400'
                "
                class="min-w-[120px] max-w-[120px] shadow object-cover rounded-lg h-[130px]"
                alt=""
              />
              <img
                v-if="
                  detail?.booking?.items[0].product_type == 'App\\Models\\Hotel'
                "
                :src="
                  detail?.booking?.items[0]?.product?.images?.length > 0
                    ? detail?.booking?.items[0]?.product?.images[0]?.image
                    : 'https://placehold.co/400'
                "
                class="min-w-[120px] max-w-[120px] shadow object-cover rounded-lg h-[150px]"
                alt=""
              />
            </div>
            <div class="w-full overflow-scroll max-h-[200px]">
              <table
                class="w-full rounded-xl overflow-hidden border border-gray-700 shadow-sm"
              >
                <thead
                  class="bg-[#FF613c] text-white border-b-2 border-gray-200"
                >
                  <tr>
                    <th
                      class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                    >
                      Code
                    </th>
                    <th
                      class="py-1 px-4 text-[10px] whitespace-nowrap min-w-[120px] font-normal text-left"
                    >
                      Item Name
                    </th>
                    <th
                      class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                    >
                      Check-in
                    </th>
                    <th
                      class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                    >
                      Check-out
                    </th>
                    <th
                      class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                    >
                      Qty
                    </th>
                    <th
                      class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                    >
                      Price
                    </th>

                    <th
                      class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                    >
                      Total
                    </th>
                    <th
                      class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                    >
                      Expense
                    </th>
                    <th
                      class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                    >
                      Discount
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr
                    v-for="item in detail?.booking?.items ?? []"
                    :key="item"
                    class="bg-white even:bg-gray-50 hover:bg-gray-50"
                  >
                    <td
                      class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                    >
                      {{ item.crm_id }}
                    </td>
                    <td
                      class="py-1 px-4 text-[10px] w-[300px] font-normal text-left"
                    >
                      {{ item?.room?.name }}
                    </td>
                    <td
                      class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                    >
                      {{ item.checkin_date }}
                    </td>
                    <td
                      class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                    >
                      {{ item.checkout_date }}
                    </td>
                    <td
                      class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                    >
                      {{ item.quantity }} x
                      {{
                        calculateDaysBetween(
                          item.checkin_date,
                          item.checkout_date
                        )
                      }}
                    </td>
                    <td
                      class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                    >
                      {{ item.selling_price }}
                    </td>

                    <td
                      class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                    >
                      {{ item.amount }}
                    </td>
                    <td
                      class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                    >
                      {{ item.total_cost_price }}
                    </td>
                    <td
                      class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                    >
                      {{ item.discount }}
                    </td>
                  </tr>
                </tbody>
              </table>
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
            class="w-30 h-[2px] rounded-full relative z-10"
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
            class="w-30 h-[2px] rounded-full relative z-10"
            :class="state.passport ? 'bg-[#04BA00]' : 'bg-gray-200'"
          ></div>

          <div
            v-if="!state.booking"
            @click="part = 'booking'"
            class="w-6 h-6 flex justify-center cursor-pointer items-center text-[10px] rounded-full relative z-10"
            :class="
              part == 'booking' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
            "
          >
            3
          </div>
          <div
            v-if="state.booking"
            @click="part = 'booking'"
            class="w-6 h-6 flex justify-center cursor-pointer shadow hover:shadow-none items-center text-[10px] rounded-full relative z-10"
            :class="part == 'booking' ? 'bg-white text-white' : ''"
          >
            <img :src="checkImage" alt="" />
          </div>
          <div
            class="w-30 h-[2px] rounded-full relative z-10 bg-gray-200"
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
            class="w-30 h-[2px] rounded-full relative z-10"
            :class="state.invoice ? 'bg-[#04BA00]' : 'bg-gray-200'"
          ></div>
          <div
            v-if="!state.expense"
            @click="part = 'expense'"
            class="w-6 h-6 flex justify-center items-center shadow hover:shadow-nano cursor-pointer text-[10px] rounded-full relative z-10"
            :class="
              part == 'expense' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
            "
          >
            5
          </div>
          <div
            v-if="state.expense"
            @click="part = 'expense'"
            class="w-6 h-6 flex justify-center shadow hover:shadow-nano cursor-pointer items-center text-[10px] rounded-full relative z-10"
            :class="part == 'expense' ? 'bg-white text-white' : ''"
          >
            <img :src="checkImage" alt="" />
          </div>
          <div
            class="w-30 h-[2px] rounded-full relative z-10"
            :class="state.invoice ? 'bg-[#04BA00]' : 'bg-gray-200'"
          ></div>
          <!-- <div
            @click="part = 'confirmation'"
            class="w-6 h-6 flex justify-center items-center text-[10px] shadow hover:shadow-none cursor-pointer rounded-full relative z-10"
            :class="
              part == 'confirmation' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
            "
          >
            6
          </div> -->
          <div
            v-if="!state.confirmation"
            @click="part = 'confirmation'"
            class="w-6 h-6 flex justify-center items-center shadow hover:shadow-nano cursor-pointer text-[10px] rounded-full relative z-10"
            :class="
              part == 'confirmation' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
            "
          >
            5
          </div>
          <div
            v-if="state.confirmation"
            @click="part = 'confirmation'"
            class="w-6 h-6 flex justify-center shadow hover:shadow-nano cursor-pointer items-center text-[10px] rounded-full relative z-10"
            :class="part == 'confirmation' ? 'bg-white text-white' : ''"
          >
            <img :src="checkImage" alt="" />
          </div>
        </div>
        <div class="flex justify-between pt-2 items-center">
          <!-- line -->
          <div
            class="text-xs cursor-pointer flex justify-center items-center"
            @click="part = 'general'"
            :class="[
              state.general && part == 'general' ? 'text-[#04BA00]' : '',
            ]"
          >
            Payment<span
              v-if="part == 'general'"
              class="w-1 h-1 rounded-full inline-block bg-[#FF613c] ml-2"
            ></span>
          </div>
          <div
            class="text-xs cursor-pointer flex justify-center items-center"
            @click="part = 'passport'"
            :class="[
              state.passport && part == 'passport' ? 'text-[#04BA00]' : '',
            ]"
          >
            Passport<span
              v-if="part == 'passport'"
              class="w-1 h-1 rounded-full inline-block bg-[#FF613c] ml-2"
            ></span>
          </div>
          <div
            class="text-xs cursor-pointer flex justify-center items-center"
            @click="part = 'booking'"
            :class="[
              state.booking && part == 'booking' ? 'text-[#04BA00]' : '',
            ]"
          >
            Booking<span
              v-if="part == 'booking'"
              class="w-1 h-1 rounded-full inline-block bg-[#FF613c] ml-2"
            ></span>
          </div>
          <div
            class="text-xs cursor-pointer flex justify-center items-center"
            @click="part = 'invoice'"
            :class="[
              part === 'invoice' && state.invoice ? 'text-[#04BA00]' : '',
            ]"
          >
            Invoice<span
              v-if="part == 'invoice'"
              class="w-1 h-1 rounded-full inline-block bg-[#FF613c] ml-2"
            ></span>
          </div>
          <div
            class="text-xs cursor-pointer flex justify-center items-center"
            @click="part = 'expense'"
            :class="[
              state.expense && part == 'expense' ? 'text-[#04BA00]' : '',
            ]"
          >
            Expense<span
              v-if="part == 'expense'"
              class="w-1 h-1 rounded-full inline-block bg-[#FF613c] ml-2"
            ></span>
          </div>
          <div
            class="text-xs cursor-pointer flex justify-center items-center"
            @click="part = 'confirmation'"
            :class="[
              state.confirmation && part == 'confirmation'
                ? 'text-[#04BA00]'
                : '',
            ]"
          >
            Confirm<span
              v-if="part == 'confirmation'"
              class="w-1 h-1 rounded-full inline-block bg-[#FF613c] ml-2"
            ></span>
          </div>
        </div>
        <div class="px-16 relative" v-if="show != 3">
          <ChevronRightIcon
            @click="rightButtonAction"
            class="w-6 cursor-pointer h-6 bg-[#FF613c] text-white shadow p-1.5 rounded-full absolute right-0 top-[35px]"
          />
          <ChevronLeftIcon
            @click="leftButtonAction"
            class="w-6 cursor-pointer h-6 bg-[#FF613c] text-white shadow p-1.5 rounded-full absolute left-0 top-[35px]"
          />
          <Transition :name="transition" mode="out-in">
            <div class="pt-6" :key="part">
              <component
                :is="getComponent(part)"
                :detail="detail"
                :getDetailAction="getDetailAction"
              />
            </div>
          </Transition>
        </div>
      </div>
    </div>
    <Modal :isOpen="showFailModal" @closeModal="showFailModal = false">
      <DialogPanel
        class="w-full max-w-sm transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-start pb-20 pt-4 px-4"
        >
          <p></p>
          <XCircleIcon
            class="w-5 h-5 text-white"
            @click="showFailModal = false"
          />
        </DialogTitle>
        <!-- show date  -->
        <div class="relative">
          <div class="absolute -top-8 left-[43%]">
            <img
              :src="logo"
              class="w-16 h-16 bg-white rounded-full p-3"
              alt=""
            />
          </div>
          <div class="py-10 text-center space-y-4">
            <p class="font-medium text-lg text-[#FF613c]">Data Missing !</p>
            <p class="text-xs">Please sure customer payment is paid</p>
            <p
              @click="goToFill"
              class="cursor-pointer inline-block text-white text-[10px] bg-[#FF613c] px-2 py-1 rounded-lg"
            >
              Go To Fill Data
            </p>
          </div>
        </div>
      </DialogPanel>
    </Modal>
  </div>
</template>

<style scoped>
/* Slide Right (enter from right, leave to left) */
.slide-right-enter-active {
  transition: transform 0.4s ease-out, opacity 0.4s ease-out;
}
.slide-right-leave-active {
  transition: transform 0.3s ease-in, opacity 0.3s ease-in;
}
.slide-right-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-right-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* Slide Left (enter from left, leave to right) */
.slide-left-enter-active {
  transition: transform 0.4s ease-out, opacity 0.4s ease-out;
}
.slide-left-leave-active {
  transition: transform 0.3s ease-in, opacity 0.3s ease-in;
}
.slide-left-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-left-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
