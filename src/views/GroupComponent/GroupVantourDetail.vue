<script setup>
import { ref, watch, onMounted, computed, defineProps } from "vue";
import GeneralDetailPage from "./GeneralDetail.vue";
import BookingRequest from "./BookingVantour.vue";
import Assign from "./AssignDriver.vue";
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
import Extra from "./PaymentDetail.vue";
import { useGroupStore } from "../../stores/group";

const props = defineProps({
  show: Number,
});

const part = ref("general");
const route = useRoute();
const router = useRouter();
const groupbyStore = useGroupByStore();
const groupStore = useGroupStore();
const authStore = useAuthStore();
const detail = ref(null);
const getLoading = ref(false);
const toast = useToast();
const hasRouteId = ref(false);

const state = ref({
  general: false,
  extra: false,
  booking: false,
  assign: false,
});

const showCommentPropup = ref(false);

const partArray = ref([
  { id: 1, name: "general" },
  { id: 2, name: "extra" },
  { id: 3, name: "booking" },
  { id: 4, name: "assign" },
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
    `/reservation/confirmations/entrance/${reservation_ids.value.id}?variation_name=${reservation_ids.value.name}`
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
    extra: Extra,
    booking: BookingRequest,
    assign: Assign,
  };
  return components[part];
};

const getDetailAction = async (id) => {
  try {
    getLoading.value = true;
    console.log("getDetailAction", id);
    const res = await groupStore.detailAction(id);
    detail.value = res.result;
    changeState(res.result);
    console.log(res);
  } catch (error) {
    console.log(error);
  } finally {
    getLoading.value = false;
    hasRouteId.value = false;
  }
};

const showWarningModal = ref(false);
const customerPassportLength = ref(false);

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

const copyReservation = async () => {
  try {
    let res = detail.value?.booking;
    console.log(res, "this is copy reservation");

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

    // Calculate discount - safely handling potential undefined values
    let discount = 0;
    for (let i = 0; i < res.items.length; i++) {
      discount += parseFloat(res.items[i].discount || 0);
    }

    // Calculate score safely
    let score = 0;

    // Check for earliest service date across all items
    let earliestServiceDate = null;
    for (const item of res.items) {
      // Fixed typo from "serivce_date" to "service_date" with fallback
      const serviceDate = item.service_date || item.serivce_date;
      if (serviceDate && serviceDate !== "null") {
        if (!earliestServiceDate || serviceDate < earliestServiceDate) {
          earliestServiceDate = serviceDate;
        }
      }
    }

    // Get urgency label based on earliest service date
    const urgencyLabel = earliestServiceDate
      ? getUrgencyLabel(earliestServiceDate)
      : "";

    // Create formatted output for all items
    let allFormattedOutput = "";

    // Add urgency label at the top if needed
    if (urgencyLabel) {
      allFormattedOutput += urgencyLabel;
    }

    // Add booking header - safely handling missing values
    const totalCost = "0";
    const totalAmount = res.grand_total || "0";
    const balanceDue = res.balance_due || "0";
    const paymentStatus = res.payment_status || "Unknown";

    allFormattedOutput += `💰 Total Cost: ${totalCost} THB 
💵 Price: ${totalAmount} THB 
💵 Balance Due: ${balanceDue} THB 
📝 Payment Status: ${paymentStatus}
---------------------
🏦 Bank Name: ${
      res.items[0]?.bank_name !== "null" && res.items[0]?.bank_name
        ? res.items[0].bank_name
        : "-"
    } 
🔢 Bank Account Number: ${
      res.items[0]?.bank_account_number !== "null" &&
      res.items[0]?.bank_account_number
        ? `➖${res.items[0].bank_account_number}`
        : "-"
    }
🧑‍💼 Account Name: ${
      res.items[0]?.account_name !== "null" && res.items[0]?.account_name
        ? res.items[0].account_name
        : "-"
    } 
#️⃣ CRM ID: ${res.crm_id || "-"}\n`;

    // Process each item with proper error handling
    res.items.forEach((item) => {
      // Fix typo in service_date field name and provide fallbacks
      const serviceDate = item.service_date || item.serivce_date || "-";
      const itemUrgencyLabel = getUrgencyLabel(serviceDate).trim();
      const urgencyPrefix = itemUrgencyLabel ? `[${itemUrgencyLabel}] ` : "";

      allFormattedOutput += `🏩 Name: ${item.product?.name || "-"}
📆 Service Date: ${urgencyPrefix}${serviceDate}
#️⃣ Reservation Code: ${item.crm_id || "-"}: S: (${item.selling_price || "-"})
---------------------\n`;
    });

    // Add summary information with proper fallbacks
    allFormattedOutput += `💵 Total Sale Amount: ${res.sub_total || "0"} THB 
💸 Discount: ${discount} THB 
📅 Sale Date: ${res.booking_date || "-"}
🤑 Score: ${score.toFixed(2)}\n`;

    // Add customer information if available
    if (res.customer_info) {
      allFormattedOutput += `👤 Customer Name: ${res.customer_info.name || "-"}
📱 Contact: ${res.customer_info.phone_number || "-"}
✉️ Email: ${res.customer_info.email || "-"}\n`;
    }

    // Copy to clipboard with a short timeout to ensure UI isn't blocked
    setTimeout(() => {
      navigator.clipboard.writeText(allFormattedOutput);
      toast.success("Reservation copied successfully");
    }, 0);

    return allFormattedOutput;
  } catch (error) {
    console.error("Error copying reservations:", error);
    toast.error("Failed to copy reservation");
    return "Error: Failed to format reservation information";
  }
};

watch(
  () => route.query.id,
  (newId) => {
    if (newId) {
      hasRouteId.value = false;
      getDetailAction(newId);
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
        crm_id: route.query.crm_id,
        part: newPart,
      },
    });
  }
);

const changeState = (data) => {
  state.value.general = data.booking.payment_status == "fully_paid";
  state.value.extra = data.booking_items_payment_detail;
  state.value.booking = false;
  state.value.assign = data.booking_items_assigned;
};

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
                {{ detail?.customer_name }}
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
                  @click="copyReservation()"
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
                        Product Name
                      </th>
                      <th
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        Item Name
                      </th>

                      <th
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
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        Total
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
                      v-for="item in detail?.items ?? []"
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
                        {{ item?.product?.name }}
                      </td>
                      <td class="py-1 px-4 text-[10px] font-normal text-left">
                        {{ item?.car?.name }}
                      </td>
                      <top-destination-cart
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        {{ getFormatDate(item?.service_date) }}
                      </top-destination-cart>
                      <td
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        {{ item.quantity }}
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
            @click="part = 'extra'"
          >
            <div
              v-if="
                !state.extra &&
                (authStore.isReservation || authStore.isSuperAdmin)
              "
              @click="part = 'extra'"
              class="w-6 h-6 flex justify-center cursor-pointer items-center text-[10px] rounded-full relative z-10"
              :class="
                part == 'extra' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
              "
            >
              2
            </div>
            <div
              v-if="
                state.extra &&
                (authStore.isReservation || authStore.isSuperAdmin)
              "
              @click="part = 'extra'"
              class="w-6 h-6 flex justify-center cursor-pointer shadow hover:shadow-none items-center text-[10px] rounded-full relative z-10"
              :class="part == 'extra' ? 'bg-white text-white' : ''"
            >
              <img :src="checkImage" alt="" />
            </div>
            <p
              class="text-xs"
              :class="state.extra ? 'text-[#04BA00]' : 'text-gray-800'"
            >
              Payment Detail
            </p>
          </div>
          <div
            class="relative z-10"
            :class="state.extra ? 'text-[#04BA00]' : 'text-gray-800'"
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
            @click="part = 'assign'"
          >
            <div
              v-if="
                !state.assign &&
                (authStore.isReservation || authStore.isSuperAdmin)
              "
              @click="part = 'assign'"
              class="w-6 h-6 flex justify-center items-center shadow hover:shadow-nano cursor-pointer text-[10px] rounded-full relative z-10"
              :class="
                part == 'assign' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
              "
            >
              4
            </div>
            <div
              v-if="
                state.assign &&
                (authStore.isReservation || authStore.isSuperAdmin)
              "
              @click="part = 'assign'"
              class="w-6 h-6 flex justify-center shadow hover:shadow-nano cursor-pointer items-center text-[10px] rounded-full relative z-10"
              :class="part == 'assign' ? 'bg-white text-white' : ''"
            >
              <img :src="checkImage" alt="" />
            </div>
            <p
              class="text-xs"
              :class="state.assign ? 'text-[#04BA00]' : 'text-gray-800'"
            >
              Assign Driver
            </p>
          </div>
        </div>

        <div class="pt-2 flex justify-between items-center gap-x-6">
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
              'bg-green-500': part === 'extra' && state.extra,
              'bg-[#FF613c]': part === 'extra' && !state.extra,
              'opacity-0': part !== 'extra',
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
              'bg-green-500': part === 'assign' && state.assign,
              'bg-[#FF613c]': part === 'assign' && !state.assign,
              'opacity-0': part !== 'assign',
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
        class="w-full max-w-lg transform overflow-hidden rounded-lg mt-10 bg-white text-left align-middle shadow-xl transition-all"
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
            <p class="font-medium text-lg text-[#FF613c]">Select Ticket Type</p>
            <p class="text-xs">
              မည်သည့် ticket အတွက် confirmation ထုတ်မည်ကို အတည်ပြုပေးပါ။,
            </p>
            <div class="space-y-2">
              <div
                v-for="item in detail?.booking?.items"
                class="flex justify-center items-center"
                :key="item"
              >
                <input
                  @click="
                    () => {
                      reservation_ids.id = item.id;
                      reservation_ids.name = item.variation?.name;
                    }
                  "
                  type="radio"
                  :checked="reservation_ids.id == item.id"
                  class="w-5 h-5 text-white border border-[#FF613c] rounded-full"
                />
                <label
                  :for="item.id"
                  class="ml-2 text-sm font-medium text-[#FF613c]"
                >
                  {{ item.variation?.name }}
                </label>
              </div>
            </div>
            <p
              v-if="reservation_ids.id != null"
              @click="goToPrint"
              class="cursor-pointer mr-2 inline-block text-white text-[10px] bg-[#FF613c] px-2 py-1 rounded-lg"
            >
              Go To Generate
            </p>
            <p
              v-if="reservation_ids.id == null"
              class="cursor-pointer mr-2 inline-block text-white text-[10px] bg-gray-200 px-2 py-1 rounded-lg"
            >
              Go To Generate
            </p>
            <p
              @click="selectTicketModal = false"
              class="cursor-pointer inline-block text-[#FF613c] border border-[#FF613c] text-[10px] bg-white px-2 py-1 rounded-lg"
            >
              Cancel
            </p>
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
