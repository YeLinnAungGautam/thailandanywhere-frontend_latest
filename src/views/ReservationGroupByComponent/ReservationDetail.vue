<script setup>
import { ref, watch, onMounted, computed, defineProps } from "vue";
import GeneralDetailPage from "./GeneralDetail.vue";
import PassportInfo from "./PassportInfo.vue";
import BookingRequest from "./BookingRequest.vue";
import InvoiceUpdate from "./InvoiceUpdate.vue";
import Expense from "./Expense.vue";
import ExpenseBooking from "./ExpenseBooking.vue";
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
import { useAuthStore } from "../../stores/auth";
import { daysBetween } from "../help/DateBetween";
import { getFormatDate } from "../help/FormatData";
import { get } from "lodash";

const props = defineProps({
  show: Number,
});

const part = ref("general");
const route = useRoute();
const router = useRouter();
const groupbyStore = useGroupByStore();
const authStore = useAuthStore();
const detail = ref(null);
const getLoading = ref(false);
const toast = useToast();
const hasRouteId = ref(false);

const state = ref({
  general: false,
  passport: false,
  booking: false,
  invoice: false,
  expense: false,
  expensemail: false,
  confirmation: false,
});

const showCommentPropup = ref(false);

const partArray = ref([
  { id: 1, name: "general" },
  { id: 2, name: "passport" },
  { id: 3, name: "booking" },
  { id: 4, name: "invoice" },
  { id: 5, name: "expense" },
  { id: 6, name: "expensemail" },
  { id: 7, name: "confirmation" },
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

const reservation_ids = ref({
  id: null,
  name: null,
  invoice_code: null,
});
const showFailModal = ref(false);
const selectTicketModal = ref(false);
const generateConfirmation = () => {
  if (detail.value?.booking?.payment_status != "not_paid") {
    selectTicketModal.value = true;
  } else {
    showFailModal.value = true;
  }
};

const goToPrint = () => {
  router.push(
    `/reservation/confirmations/entrance/${reservation_ids.value.id}?variation_name=${reservation_ids.value.name}&invoice_code=${reservation_ids.value.invoice_code}`
  );
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
    expensemail: ExpenseBooking,
    confirmation: Confirmation,
  };
  return components[part];
};

const getDetailAction = async (id, product_id) => {
  getLoading.value = true;
  reservation_ids.value = [];
  const productType = route.path.includes("reservation-attraction")
    ? "App\\Models\\EntranceTicket"
    : "App\\Models\\Hotel"; // Default to Hotel

  let data = {
    product_type: productType,
  };
  const res = await groupbyStore.ReservationHotelDetailAction(
    id,
    product_id,
    data
  );
  detail.value = res;
  console.log(detail.value, "this is detail");

  getLoading.value = false;
};

const printHotelConfirm = () => {
  window.open(
    import.meta.env.VITE_API_URL +
      "/hotel-reservation/" +
      route.query.id +
      "/receipt"
  );
};

const expenseStatus = (i) => {
  // If no bookings or items exist, return 'not_paid' as default
  if (!i?.booking || !i?.booking.items || i?.booking.items.length === 0) {
    return "not_paid";
  }

  const items = i?.booking.items;
  let hasFullyPaid = false;
  let hasNotPaid = false;

  // Check the status of each item
  for (let a = 0; a < items.length; a++) {
    const item_status = items[a].payment_status;

    if (item_status === "fully_paid") {
      hasFullyPaid = true;
    } else if (item_status === "not_paid") {
      hasNotPaid = true;
    }
  }

  console.log(hasFullyPaid, hasNotPaid, "this is has fully paid");

  // Determine overall status based on individual item statuses
  if (hasFullyPaid && hasNotPaid) {
    return "partially_paid";
  } else if (hasFullyPaid && !hasNotPaid) {
    return "fully_paid";
  } else {
    return "not_paid";
  }
};

const showWarningModal = ref(false);
const customerPassportLength = ref(false);

const goToHotelConfirmation = () => {
  router.push(
    `/reservation/confirmations/group/hotel/png?id=${route.query.id}&product_id=${route.query.product_id}`
  );
};

const goToFillPassport = () => {
  part.value = "passport";
  showWarningModal.value = false;
  customerPassportLength.value = false;
};

const goToGenerate = () => {
  router.push(
    `/reservation/confirmations/group/hotel/png?id=${route.query.id}&product_id=${route.query.product_id}`
  );
  showWarningModal.value = false;
  customerPassportLength.value = false;
};

const goToProduct = () => {
  if (route.path.includes("reservation-hotel")) {
    router.push(`/product/hotel/edit/${route.query.product_id}`);
  }
};

const copyReservation = async (id) => {
  try {
    const productType = route.path.includes("reservation-attraction")
      ? "App\\Models\\EntranceTicket"
      : "App\\Models\\Hotel"; // Default to Hotel

    let data = {
      product_type: productType,
    };
    const res = await groupbyStore.ReservationHotelDetailCopyAction(
      id,
      route.query.product_id,
      data
    );
    console.log(res, "this is cpy reservation");

    // Check if we have data and items
    if (!res || !res.items || res.items.length === 0) {
      toast.error("No reservation items found");
      return;
    }

    // Helper function to check if a date is today, tomorrow, or the day after tomorrow
    function getUrgencyLabel(dateString) {
      if (!dateString || dateString === "null" || dateString === "-") return "";

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const dayAfterTomorrow = new Date(today);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

      // Parse the service date
      const serviceDateParts = dateString.split("-");
      // Assuming format is YYYY-MM-DD or DD-MM-YYYY
      let serviceDate;

      if (serviceDateParts[0].length === 4) {
        // YYYY-MM-DD format
        serviceDate = new Date(dateString);
      } else {
        // DD-MM-YYYY format
        serviceDate = new Date(
          `${serviceDateParts[2]}-${serviceDateParts[1]}-${serviceDateParts[0]}`
        );
      }

      serviceDate.setHours(0, 0, 0, 0);

      if (serviceDate.getTime() === today.getTime()) {
        return "*Urgent: Today*  \n";
      } else if (serviceDate.getTime() === tomorrow.getTime()) {
        return "*Urgent: Tomorrow*  \n";
      } else if (serviceDate.getTime() === dayAfterTomorrow.getTime()) {
        return "*Urgent: Day After Tomorrow*  \n";
      }

      return "";
    }

    let discount = 0;
    for (let i = 0; i < res.items.length; i++) {
      discount += res.items[i].discount;
    }
    let score =
      (res.summary.total_amount * 1 - res.summary.total_cost * 1) /
      (res.summary.total_cost * 1);

    // Check for earliest check-in date across all items
    let earliestCheckinDate = null;
    for (const item of res.items) {
      if (item.service_date && item.service_date !== "null") {
        if (!earliestCheckinDate || item.service_date < earliestCheckinDate) {
          earliestCheckinDate = item.service_date;
        }
      }
    }

    // Get urgency label based on earliest check-in date
    const urgencyLabel = earliestCheckinDate
      ? getUrgencyLabel(earliestCheckinDate)
      : "";

    // Create formatted output for all items
    let allFormattedOutput = "";

    // Add urgency label at the top if needed
    if (urgencyLabel) {
      allFormattedOutput += urgencyLabel;
    }

    // Add booking header
    allFormattedOutput += `💰 Total Cost: ${res.summary.total_cost} THB 
💵 Price: ${res.summary.total_amount} THB 
💵 Balance Due: ${res.balance_due} THB 
📝 Payment Status: ${res.payment_status}
---------------------
🏦 Bank Name: ${
      res.items[0].bank_name != "null" ? res.items[0].bank_name : "-"
    } 
🔢 Bank Account Number: ${
      res.items[0].bank_account_number != "null"
        ? `➖${res.items[0].bank_account_number}`
        : "-"
    }
🧑‍💼 Account Name: ${
      res.items[0].account_name != "null" ? res.items[0].account_name : "-"
    } 
#️⃣ CRM ID: ${res.crm_id}\n`;

    if (res.product_type == "App\\Models\\Hotel") {
      allFormattedOutput += `🏨 ${res.items[0].product_name}
---------------------\n`;
    } else {
      allFormattedOutput += `🎟️ ${res.items[0].product_name}
---------------------\n`;
    }

    if (res.product_type == "App\\Models\\Hotel") {
      res.items.forEach((a, index) => {
        const itemUrgencyLabel = getUrgencyLabel(a.checkin_date).trim();
        const urgencyPrefix = itemUrgencyLabel ? `[${itemUrgencyLabel}] ` : "";
        allFormattedOutput += `🏩 Room Name: ${a.room_name}
📆 Check-in Date: ${urgencyPrefix}${a.checkin_date}-${a.checkout_date}
#️⃣ Reservation Code: ${a.reservation_code}: S: (${a.sale_price})
---------------------\n`;
      });
    } else {
      res.items.forEach((a, index) => {
        const itemUrgencyLabel = getUrgencyLabel(a.checkin_date).trim();
        const urgencyPrefix = itemUrgencyLabel ? `[${itemUrgencyLabel}] ` : "";
        allFormattedOutput += `🎫 Ticket Name: ${
          a.entrance_ticket_variation_name
        }
📆 Service Date: ${urgencyPrefix}${a.service_date}
#️⃣ Reservation Code: ${a.reservation_code}: S: (${a.sale_price})
🧑‍🧑‍🧒 Quantity: ${a.quantity}A - ${
          a.individual_pricing?.child?.quantity
            ? a.individual_pricing?.child?.quantity
            : ""
        }${a.individual_pricing?.child?.quantity ? "C" : ""}
---------------------\n`;
      });
    }

    allFormattedOutput += `💵 Total Sale Amount: ${res.selling_price} THB 
💸 Discount : ${discount} THB 
📅 Sale Date: ${res.booking_date}
🤑 Score : ${score.toFixed(2)}\n`;

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

watch(
  () => detail.value,
  (newValue) => {
    if (newValue != null) {
      // Check payment status for general state
      if (detail.value.booking.payment_status == "fully_paid") {
        state.value.general = true;
      } else {
        state.value.general = false;
      }

      // Initialize all states to false
      state.value.passport = false;
      state.value.booking = false;
      state.value.invoice = false;
      state.value.expense = false;
      state.value.expensemail = false;
      state.value.confirmation = false;

      // Loop through all booking items
      if (detail.value.booking.items && detail.value.booking.items.length > 0) {
        detail.value.booking.items.forEach((item) => {
          // Check passport condition
          if (item.customer_passports && item.customer_passports.length > 0) {
            state.value.passport = true;
          }

          // Check booking request condition
          if (item.is_booking_request == 1) {
            state.value.booking = true;
          }

          // Check invoice condition
          if (
            item.booking_confirm_letters &&
            item.booking_confirm_letters.length > 0
          ) {
            state.value.invoice = true;
          }

          // Check expense condition
          if (item.payment_status == "fully_paid") {
            state.value.expense = true;
          }

          if (item.is_expense_email_sent == 1) {
            state.value.expensemail = true;
          }

          // Check confirmation condition
          if (item.reservation_status == "confirmed") {
            state.value.confirmation = true;
          }
        });
      }
    }
  }
);

watch(
  [() => route.query.id, () => route.query.product_id],
  async ([newId, newProductId], [oldId, oldProductId]) => {
    if (
      (newId && newId !== oldId) ||
      (newProductId && newProductId !== oldProductId)
    ) {
      hasRouteId.value = false;
      getDetailAction(newId, newProductId);
    }
  },
  { immediate: true }
);

watch(
  () => part.value,
  (newPart) => {
    router.push({
      query: {
        id: route.query.id,
        product_id: route.query.product_id,
        part: newPart,
      },
    });
  }
);

onMounted(() => {
  if (!route.query.id) {
    hasRouteId.value = true;
  }
  if (route.query.part) {
    part.value = route.query.part;
  }
});

const hide = ref(true);
</script>

<template>
  <div>
    <div v-if="hasRouteId">
      <div class="flex justify-center text-xs items-center h-[70vh]">
        <p>Please select one reservation group.</p>
      </div>
    </div>
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
    <div class="space-y-4" v-if="!getLoading && !hasRouteId">
      <div class="space-y-4 border border-gray-200 p-3 rounded-lg">
        <div class="grid grid-cols-5 gap-2">
          <div class="col-span-5 flex justify-between items-center">
            <div>
              <p class="text-[10px] text-gray-500">customer name</p>
              <p class="text-[18px] text-[#FF613c] font-medium pb-2">
                {{ detail?.booking.customer_info?.name }}
              </p>
              <div class="flex justify-start items-center gap-x-2">
                <p
                  @click="
                    router.push(`/bookings/new-update/${detail?.booking?.id}`)
                  "
                  class="text-[10px] bg-[#FF613c] text-white whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-lg"
                >
                  {{ detail?.booking?.crm_id }}
                </p>
                <p
                  @click="goToProduct()"
                  class="text-[10px] bg-green-500 text-white whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-lg"
                >
                  {{
                    detail?.booking?.items[0]?.product_type ==
                    "App\\Models\\Hotel"
                      ? "Hotel"
                      : "Ticket"
                  }}: {{ detail?.booking?.items[0]?.product?.name }}
                </p>
                <div>
                  <div
                    v-if="
                      detail?.booking?.items[0]?.product_type ==
                      'App\\Models\\Hotel'
                    "
                  >
                    <p
                      v-if="detail?.booking?.payment_status == 'fully_paid'"
                      class="text-[10px] bg-[#FF613c] shadow hover:shadow-none whitespace-nowrap text-white px-3 py-1.5 rounded-lg cursor-pointer"
                      @click="goToHotelConfirmation()"
                    >
                      Hotel Confirmation
                    </p>
                    <p
                      v-if="detail?.booking?.payment_status != 'fully_paid'"
                      class="text-[10px] bg-gray-400 whitespace-nowrap text-white px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      Hotel Confirmation {{ expenseStatus(detail) }}
                    </p>
                  </div>
                  <p
                    class="text-[10px] bg-[#FF613c] whitespace-nowrap text-white px-3 py-1.5 rounded-lg cursor-pointer"
                    v-if="
                      detail?.booking?.items[0]?.product_type ==
                      'App\\Models\\EntranceTicket'
                    "
                    @click="
                      detail?.booking?.items[0]?.product_type ==
                      'App\\Models\\EntranceTicket'
                        ? generateConfirmation()
                        : printHotelConfirm()
                    "
                  >
                    Generate Confirmation
                  </p>
                </div>
              </div>
            </div>
            <div class="">
              <p class="text-[10px] text-gray-500 text-end">score</p>
              <p class="text-lg text-red-500 font-medium pb-2 text-end">
                {{ score }}
              </p>
              <div class="flex justify-end items-center gap-x-2">
                <p
                  @click="showCommentPropup = true"
                  class="text-[10px] bg-[#FF613c] text-white whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-lg flex justify-center items-center gap-x-1"
                >
                  <img :src="productIcon" alt="" class="w-3 h-3" />Note
                </p>
                <p
                  class="text-[10px] bg-[#FF613c] text-white whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-lg"
                  @click="copyReservation(detail?.booking?.id)"
                >
                  Copy Expense
                </p>
                <p
                  @click="hide = !hide"
                  class="text-[10px] bg-black text-white whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-lg flex justify-center items-center gap-x-1"
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
                  v-if="
                    detail?.booking?.items[0]?.product_type ==
                    'App\\Models\\EntranceTicket'
                  "
                  :src="
                    detail?.booking?.items[0]?.product?.cover_image
                      ? detail?.booking?.items[0]?.product?.cover_image
                      : 'https://placehold.co/400'
                  "
                  class="min-w-[120px] max-w-[120px] shadow object-cover rounded-lg h-[130px]"
                  alt=""
                />
                <img
                  v-if="
                    detail?.booking?.items[0]?.product_type ==
                    'App\\Models\\Hotel'
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
                        v-if="
                          detail?.booking?.items[0]?.product_type ==
                          'App\\Models\\Hotel'
                        "
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        Check-in
                      </th>
                      <th
                        v-if="
                          detail?.booking?.items[0]?.product_type ==
                          'App\\Models\\Hotel'
                        "
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        Check-out
                      </th>
                      <th
                        v-if="
                          detail?.booking?.items[0]?.product_type ==
                          'App\\Models\\EntranceTicket'
                        "
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        Service Date
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
                        v-if="
                          detail?.booking?.items[0]?.product_type ==
                          'App\\Models\\EntranceTicket'
                        "
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        Child Price
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
                        v-if="item?.product_type == 'App\\Models\\Hotel'"
                        class="py-1 px-4 text-[10px] w-[300px] font-normal text-left"
                      >
                        {{ item?.room?.name }}
                      </td>
                      <td
                        v-if="
                          item?.product_type == 'App\\Models\\EntranceTicket'
                        "
                        class="py-1 px-4 text-[10px] w-[300px] font-normal text-left"
                      >
                        {{ item?.variation?.name }}
                      </td>
                      <td
                        v-if="item?.product_type == 'App\\Models\\Hotel'"
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        {{ getFormatDate(item.checkin_date) }}
                      </td>
                      <td
                        v-if="item?.product_type == 'App\\Models\\Hotel'"
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        {{ getFormatDate(item.checkout_date) }}
                      </td>
                      <td
                        v-if="
                          item?.product_type == 'App\\Models\\EntranceTicket'
                        "
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        {{ getFormatDate(item?.service_date) }}
                      </td>
                      <td
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        {{ item.quantity }}
                        {{
                          item?.product_type != "App\\Models\\EntranceTicket"
                            ? `x ${daysBetween(
                                item.checkin_date,
                                item.checkout_date
                              )}`
                            : `, ${
                                item.individual_pricing != "null" &&
                                item.individual_pricing?.child
                                  ? item.individual_pricing?.child?.quantity
                                  : 0
                              }`
                        }}
                      </td>
                      <td
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        {{ item.selling_price }}
                      </td>
                      <td
                        v-if="
                          item?.product_type == 'App\\Models\\EntranceTicket'
                        "
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        {{
                          item.individual_pricing != "null" &&
                          item.individual_pricing?.child
                            ? item.individual_pricing.child.selling_price
                            : 0
                        }}
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
      </div>
      <div>
        <div class="pt-2 relative flex justify-between items-center">
          <!-- line -->
          <!-- <div class="w-full h-[3px] absolute bottom-2.5 bg-gray-200"></div> -->
          <div
            class="flex justify-start items-center gap-x-3 cursor-pointer"
            @click="part = 'general'"
          >
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
            <p
              class="text-xs"
              :class="state.general ? 'text-[#04BA00]' : 'text-gray-800'"
            >
              Review
            </p>
          </div>
          <div
            class="relative z-10"
            :class="state.general ? 'text-[#04BA00]' : 'text-gray-800'"
          >
            <ChevronRightIcon class="w-4 h-4" />
          </div>
          <div
            class="flex justify-start items-center gap-x-3 cursor-pointer"
            @click="part = 'passport'"
          >
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
            <p
              class="text-xs"
              :class="state.passport ? 'text-[#04BA00]' : 'text-gray-800'"
            >
              Passport
            </p>
          </div>
          <div
            class="relative z-10"
            :class="state.passport ? 'text-[#04BA00]' : 'text-gray-800'"
          >
            <ChevronRightIcon class="w-4 h-4" />
          </div>

          <div
            class="flex justify-start items-center gap-x-3 cursor-pointer"
            @click="part = 'booking'"
          >
            <div
              v-if="
                !state.booking &&
                (authStore.isReservation || authStore.isSuperAdmin)
              "
              @click="part = 'booking'"
              class="w-6 h-6 flex justify-center cursor-pointer items-center text-[10px] rounded-full relative z-10"
              :class="
                part == 'booking' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
              "
            >
              3
            </div>
            <div
              v-if="
                state.booking &&
                (authStore.isReservation || authStore.isSuperAdmin)
              "
              @click="part = 'booking'"
              class="w-6 h-6 flex justify-center cursor-pointer shadow hover:shadow-none items-center text-[10px] rounded-full relative z-10"
              :class="part == 'booking' ? 'bg-white text-white' : ''"
            >
              <img :src="checkImage" alt="" />
            </div>
            <p
              class="text-xs"
              :class="state.booking ? 'text-[#04BA00]' : 'text-gray-800'"
            >
              Booking
            </p>
          </div>
          <div
            class="relative z-10"
            :class="state.booking ? 'text-[#04BA00]' : 'text-gray-800'"
          >
            <ChevronRightIcon class="w-4 h-4" />
          </div>
          <div
            class="flex justify-start items-center gap-x-3 cursor-pointer"
            @click="part = 'invoice'"
          >
            <div
              v-if="
                !state.invoice &&
                (authStore.isReservation || authStore.isSuperAdmin)
              "
              @click="part = 'invoice'"
              class="w-6 h-6 flex justify-center items-center shadow hover:shadow-nano cursor-pointer text-[10px] rounded-full relative z-10"
              :class="
                part == 'invoice' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
              "
            >
              4
            </div>
            <div
              v-if="
                state.invoice &&
                (authStore.isReservation || authStore.isSuperAdmin)
              "
              @click="part = 'invoice'"
              class="w-6 h-6 flex justify-center shadow hover:shadow-nano cursor-pointer items-center text-[10px] rounded-full relative z-10"
              :class="part == 'invoice' ? 'bg-white text-white' : ''"
            >
              <img :src="checkImage" alt="" />
            </div>
            <p
              class="text-xs"
              :class="state.invoice ? 'text-[#04BA00]' : 'text-gray-800'"
            >
              Invoice
            </p>
          </div>
          <div
            class="relative z-10"
            :class="state.invoice ? 'text-[#04BA00]' : 'text-gray-800'"
          >
            <ChevronRightIcon class="w-4 h-4" />
          </div>
          <div
            class="flex justify-start items-center gap-x-3 cursor-pointer"
            @click="part = 'expense'"
          >
            <div
              v-if="
                !state.expense &&
                (authStore.isReservation || authStore.isSuperAdmin)
              "
              @click="part = 'expense'"
              class="w-6 h-6 flex justify-center items-center shadow hover:shadow-nano cursor-pointer text-[10px] rounded-full relative z-10"
              :class="
                part == 'expense' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
              "
            >
              5
            </div>
            <div
              v-if="
                state.expense &&
                (authStore.isReservation || authStore.isSuperAdmin)
              "
              @click="part = 'expense'"
              class="w-6 h-6 flex justify-center shadow hover:shadow-nano cursor-pointer items-center text-[10px] rounded-full relative z-10"
              :class="part == 'expense' ? 'bg-white text-white' : ''"
            >
              <img :src="checkImage" alt="" />
            </div>
            <p
              class="text-xs"
              :class="state.expense ? 'text-[#04BA00]' : 'text-gray-800'"
            >
              Expense
            </p>
          </div>
          <div
            class="relative z-10"
            :class="state.expense ? 'text-[#04BA00]' : 'text-gray-800'"
          >
            <ChevronRightIcon class="w-4 h-4" />
          </div>
          <div
            class="flex justify-start items-center gap-x-3 cursor-pointer"
            @click="part = 'expensemail'"
          >
            <div
              v-if="
                !state.expensemail &&
                (authStore.isReservation || authStore.isSuperAdmin)
              "
              @click="part = 'expensemail'"
              class="w-6 h-6 flex justify-center items-center shadow hover:shadow-nano cursor-pointer text-[10px] rounded-full relative z-10"
              :class="
                part == 'expensemail'
                  ? 'bg-[#FF613c] text-white'
                  : 'bg-gray-200'
              "
            >
              6
            </div>
            <div
              v-if="
                state.expensemail &&
                (authStore.isReservation || authStore.isSuperAdmin)
              "
              @click="part = 'expensemail'"
              class="w-6 h-6 flex justify-center shadow hover:shadow-nano cursor-pointer items-center text-[10px] rounded-full relative z-10"
              :class="part == 'expensemail' ? 'bg-white text-white' : ''"
            >
              <img :src="checkImage" alt="" />
            </div>
            <p
              class="text-xs"
              :class="state.expensemail ? 'text-[#04BA00]' : 'text-gray-800'"
            >
              Exp. Mail
            </p>
          </div>
          <div
            class="relative z-10"
            :class="state.expensemail ? 'text-[#04BA00]' : 'text-gray-800'"
          >
            <ChevronRightIcon class="w-4 h-4" />
          </div>
          <div
            class="flex justify-start items-center gap-x-3 cursor-pointer"
            @click="part = 'confirmation'"
          >
            <div
              v-if="!state.confirmation"
              @click="part = 'confirmation'"
              class="w-6 h-6 flex justify-center items-center shadow hover:shadow-nano cursor-pointer text-[10px] rounded-full relative z-10"
              :class="
                part == 'confirmation'
                  ? 'bg-[#FF613c] text-white'
                  : 'bg-gray-200'
              "
            >
              7
            </div>
            <div
              v-if="state.confirmation"
              @click="part = 'confirmation'"
              class="w-6 h-6 flex justify-center shadow hover:shadow-nano cursor-pointer items-center text-[10px] rounded-full relative z-10"
              :class="part == 'confirmation' ? 'bg-white text-white' : ''"
            >
              <img :src="checkImage" alt="" />
            </div>
            <p
              class="text-xs"
              :class="state.confirmation ? 'text-[#04BA00]' : 'text-gray-800'"
            >
              Confirmation
            </p>
          </div>
        </div>

        <div class="pt-2 flex justify-between items-center gap-x-2">
          <p
            class="w-full rounded-lg h-1"
            :class="{
              'bg-green-500': part === 'general' && state.general,
              'bg-[#FF613c]': part === 'general' && !state.general,
              'opacity-0': part !== 'general',
            }"
          ></p>
          <p
            class="w-full rounded-lg h-1"
            :class="{
              'bg-green-500': part === 'passport' && state.passport,
              'bg-[#FF613c]': part === 'passport' && !state.passport,
              'opacity-0': part !== 'passport',
            }"
          ></p>
          <p
            class="w-full rounded-lg h-1"
            :class="{
              'bg-green-500': part === 'booking' && state.booking,
              'bg-[#FF613c]': part === 'booking' && !state.booking,
              'opacity-0': part !== 'booking',
            }"
          ></p>
          <p
            class="w-full rounded-lg h-1"
            :class="{
              'bg-green-500': part === 'invoice' && state.invoice,
              'bg-[#FF613c]': part === 'invoice' && !state.invoice,
              'opacity-0': part !== 'invoice',
            }"
          ></p>
          <p
            class="w-full rounded-lg h-1"
            :class="{
              'bg-green-500': part === 'expense' && state.expense,
              'bg-[#FF613c]': part === 'expense' && !state.expense,
              'opacity-0': part !== 'expense',
            }"
          ></p>
          <p
            class="w-full rounded-lg h-1"
            :class="{
              'bg-green-500': part === 'expensemail' && state.expensemail,
              'bg-[#FF613c]': part === 'expensemail' && !state.expensemail,
              'opacity-0': part !== 'expensemail',
            }"
          ></p>
          <p
            class="w-full rounded-lg h-1"
            :class="{
              'bg-green-500': part === 'confirmation' && state.confirmation,
              'bg-[#FF613c]': part === 'confirmation' && !state.confirmation,
              'opacity-0': part !== 'confirmation',
            }"
          ></p>
        </div>

        <div class="relative" v-if="show != 3">
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
    <Modal :isOpen="showWarningModal">
      <DialogPanel
        class="w-full max-w-sm transform overflow-hidden rounded-lg mt-10 bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-start pb-20 pt-4 px-4"
        >
          <p></p>
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
            <p class="font-medium text-lg text-[#FF613c]">
              Passports Warning !
            </p>
            <p class="text-xs">
              Please sure customer passport is filled before generate
              confirmation,
              {{
                customerPassportLength
                  ? `only ${detail.booking?.items[0]?.customer_passports.length} passport do you wanna go generate confirmation?`
                  : "please fill customer passport"
              }}
            </p>
            <p
              @click="goToGenerate"
              class="cursor-pointer mr-2 inline-block text-white text-[10px] bg-[#FF613c] px-2 py-1 rounded-lg"
            >
              Go To Generate
            </p>
            <p
              @click="goToFillPassport"
              class="cursor-pointer mr-2 inline-block text-white text-[10px] bg-[#FF613c] px-2 py-1 rounded-lg"
            >
              Go To Fill
            </p>
            <p
              @click="showWarningModal = false"
              class="cursor-pointer inline-block text-[#FF613c] border border-[#FF613c] text-[10px] bg-white px-2 py-1 rounded-lg"
            >
              Cancel
            </p>
          </div>
        </div>
      </DialogPanel>
    </Modal>
    <Modal :isOpen="selectTicketModal">
      <DialogPanel
        class="w-full max-w-xl transform overflow-hidden rounded-lg mt-10 bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-start pb-20 pt-4 px-4"
        >
          <p></p>
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
          <div class="pt-10 pb-5 text-center space-y-2">
            <p class="font-medium text-lg text-[#FF613c]">Select Ticket Type</p>
            <p class="text-xs">
              မည်သည့် ticket အတွက် confirmation ထုတ်မည်ကို အတည်ပြုပေးပါ။,
            </p>
            <div
              class="flex justify-between items-center text-xs px-4 pt-5 pb-2"
            >
              <p>Ticket Type</p>
              <p class="w-[150px] text-start">Slip Code</p>
            </div>
            <div class="space-y-2 px-4">
              <div
                v-for="item in detail?.booking?.items"
                class="flex justify-between space-x-2 items-center"
                :key="item"
                @click="
                  () => {
                    reservation_ids.id = item.id;
                    reservation_ids.name = item.variation?.name;
                    reservation_ids.invoice_code = item.slip_code;
                  }
                "
              >
                <div
                  :class="
                    reservation_ids.id == item.id
                      ? 'bg-[#FF613c] text-white'
                      : ''
                  "
                  class="border border-gray-300 w-full px-3 flex justify-start items-center space-x-2 py-3 rounded-lg"
                >
                  <input
                    type="radio"
                    :checked="reservation_ids.id == item.id"
                    class="w-5 h-5 text-white border border-[#FF613c] rounded-full"
                  />
                  <label
                    :for="item.id"
                    class="ml-2 text-sm line-clamp-1 font-medium"
                  >
                    {{ item.variation?.name }}
                  </label>
                </div>
                <div>
                  <input
                    type="text"
                    v-model="reservation_ids.invoice_code"
                    class="border border-gray-300 w-[150px] px-3 py-3 text-sm rounded-lg"
                    :placeholder="item.slip_code ? item.slip_code : 'Slip Code'"
                  />
                </div>
              </div>
            </div>
            <div class="pt-4">
              <p
                v-if="reservation_ids.id != null"
                @click="goToPrint"
                class="cursor-pointer mr-2 inline-block text-white text-[10px] bg-[#FF613c] px-2 py-2 border border-[#FF613c] rounded-lg"
              >
                Go To Generate
              </p>
              <p
                v-if="reservation_ids.id == null"
                class="cursor-pointer mr-2 inline-block text-white text-[10px] bg-gray-200 px-2 py-2 border border-gray-200 rounded-lg"
              >
                Go To Generate
              </p>
              <p
                @click="selectTicketModal = false"
                class="cursor-pointer inline-block text-[#FF613c] border border-[#FF613c] text-[10px] bg-white px-2 py-2 rounded-lg"
              >
                Cancel
              </p>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Modal>
    <Modal :isOpen="showCommentPropup" @closeModal="showCommentPropup = false">
      <DialogPanel
        class="w-full max-w-3xl transform overflow-hidden rounded-lg mt-10 bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-start pb-20 pt-4 px-4"
        >
          <p></p>
        </DialogTitle>
        <!-- show date  -->
        <div class="relative">
          <div class="absolute -top-8 left-[45%]">
            <img
              :src="logo"
              class="w-16 h-16 bg-white rounded-full p-3"
              alt=""
            />
          </div>
          <div class="py-10 text-center space-y-4">
            <p class="font-medium text-lg text-[#FF613c]">Reservation Note</p>
            <div class="grid grid-cols-3 gap-4 px-4">
              <div v-for="i in 3" :key="i">
                <p class="text-xs font-medium pb-2">
                  For CRM ID: SA-0023_00{{ i }}
                </p>
                <textarea
                  name=""
                  class="w-full min-h-[100px] border border-[#FF613c] rounded-lg px-4 py-2 focus:outline-none"
                  id=""
                ></textarea>
                <p
                  @click="showCommentPropup = false"
                  class="cursor-pointer mr-2 inline-block text-white text-[10px] bg-[#FF613c] px-2 py-1 rounded-lg"
                >
                  Save Note
                </p>
                <p
                  @click="showCommentPropup = false"
                  class="cursor-pointer inline-block text-[#FF613c] border border-[#FF613c] text-[10px] bg-white px-2 py-1 rounded-lg"
                >
                  Cancel
                </p>
              </div>
            </div>
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
