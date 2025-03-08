<template>
  <div class="px-4 pb-2 relative cursor-pointer" @click="showList = !showList">
    <div
      class="absolute top-[36px] left-3 rounded-full w-2 h-2"
      :class="{
        'bg-blue-600':
          data?.bookings[0]?.items[0]?.product_type ===
          'App\\Models\\EntranceTicket',
        'bg-green-600':
          data?.bookings[0]?.items[0]?.product_type === 'App\\Models\\Hotel',
        'bg-yellow-600':
          data?.bookings[0]?.items[0]?.product_type ===
          'App\\Models\\PrivateVanTour',
        'bg-red-600':
          data?.bookings[0]?.items[0]?.product_type ===
          'App\\Models\\AirportPickup',
      }"
    ></div>
    <div class="pl-5 pt-2 gap-y-4 gap-x-3">
      <div class="flex justify-between items-center">
        <div>
          <p
            class="text-[10px] space-x-1"
            v-if="
              data?.bookings[0]?.items[0]?.product_type == 'App\\Models\\Hotel'
            "
          >
            <span class="font-medium"
              >Book: {{ data?.bookings[0]?.booking_date }} / Due:
              {{ data?.bookings[0]?.balance_due_date }}</span
            >
          </p>
        </div>
        <div class="">
          <div
            class="text-[10px] text-[#ff613c] space-x-1 flex justify-end items-center"
          >
            <p class="font-medium">E-{{ expense(data?.bookings[0]?.items) }}</p>

            <p class="font-medium" v-if="authStore.isSuperAdmin">
              : S-{{ selling(data?.bookings[0]?.items) }}
            </p>
            <p
              class="text-white bg-gray-800 px-1 rounded-md"
              v-if="data?.booking?.is_inclusive == 1"
            >
              Inclusive
            </p>
          </div>
        </div>
      </div>
      <div
        class="py-2 flex justify-start overflow-x-scroll no-sidebar-container items-center gap-x-2"
      >
        <p
          class="text-[10px] px-1 py-0.5 text-white inline-block rounded-lg"
          :class="{
            'bg-blue-600':
              data?.bookings[0]?.items[0]?.product_type ===
              'App\\Models\\EntranceTicket',
            'bg-green-600':
              data?.bookings[0]?.items[0]?.product_type ===
              'App\\Models\\Hotel',
            'bg-yellow-600':
              data?.bookings[0]?.items[0]?.product_type ===
              'App\\Models\\PrivateVanTour',
            'bg-red-600':
              data?.bookings[0]?.items[0]?.product_type ===
              'App\\Models\\AirportPickup',
          }"
        >
          {{
            data?.bookings[0]?.items[0]?.product_type ==
            "App\\Models\\EntranceTicket"
              ? "Ticket"
              : ""
          }}
          {{
            data?.bookings[0]?.items[0]?.product_type == "App\\Models\\Hotel"
              ? "Hotel"
              : ""
          }}
          {{
            data?.bookings[0]?.items[0]?.product_type ==
            "App\\Models\\PrivateVanTour"
              ? "Vantour"
              : ""
          }}
          {{
            data?.bookings[0]?.items[0]?.product_type ==
            "App\\Models\\AirportPickup"
              ? "Pickup"
              : ""
          }}
        </p>
        <p
          class="text-[10px] bg-[#ff613c] whitespace-nowrap px-1 py-0.5 text-white inline-block rounded-lg"
        >
          {{ data?.bookings[0]?.crm_id }}
        </p>
        <p
          class="text-[10px] bg-gray-600 px-1 py-0.5 text-white whitespace-nowrap inline-block rounded-lg"
        >
          {{ data?.bookings[0]?.customer?.name }}
        </p>
      </div>
      <div class="flex justify-start items-center">
        <div
          class="text-[12px] font-medium space-x-2 text-gray-900 line-clamp-1"
        >
          <span class="whitespace-nowrap">{{
            data?.bookings[0]?.items[0]?.product?.name
          }}</span>
          <span
            class="bg-gray-900 w-1 h-1 mb-0.5 rounded-full inline-block"
          ></span
          ><span class="whitespace-nowrap"
            >{{ data?.bookings[0]?.items?.length }} items in hotel.</span
          >
        </div>
      </div>
      <div
        v-if="showList"
        class="transition-all duration-200 ease-in bg-gray-50 shadow rounded-md px-3 mt-3"
      >
        <div v-for="item in data?.bookings[0]?.items" :key="item.id">
          <div
            class="text-[12px] font-medium space-x-2 text-gray-900 flex justify-start items-center overflow-x-scroll no-sidebar-container border-t border-gray-200 pt-2"
          >
            <p
              v-if="item.product_type == 'App\\Models\\Hotel'"
              class="whitespace-nowrap text-[#FF613c] text-[10px]"
            >
              {{ item.room?.name }}
            </p>
            <p class="whitespace-nowrap text-[#FF613c] text-[10px]">
              ({{ item.product?.name }})
            </p>
          </div>
          <div
            class="flex justify-start overflow-x-scroll no-sidebar-container space-x-4 py-2 items-center transition-all duration-150"
          >
            <div
              class="flex justify-start space-x-1 items-center"
              v-if="item.booking?.payment_status == 'fully_paid'"
            >
              <CurrencyDollarIcon class="w-3 h-3 text-green-600" />
              <p class="text-[10px] whitespace-nowrap text-green-600">
                Customer paid
              </p>
            </div>
            <div
              class="flex justify-start space-x-1 items-center"
              v-if="item.booking?.payment_status == 'partially_paid'"
            >
              <CurrencyDollarIcon class="w-3 h-3 text-yellow-600" />
              <p class="text-[10px] whitespace-nowrap text-yellow-600">
                C.partially paid
              </p>
            </div>
            <div
              class="flex justify-start space-x-1 items-center"
              v-if="item.booking?.payment_status == 'not_paid'"
            >
              <CurrencyDollarIcon class="w-3 h-3 text-red-600" />
              <p class="text-[10px] whitespace-nowrap text-red-600">
                C.not paid
              </p>
            </div>
            <div
              class="flex justify-start space-x-1 items-center"
              v-if="
                item.payment_status == 'fully_paid' &&
                item.product_type != 'App\\Models\\PrivateVanTour'
              "
            >
              <CreditCardIcon class="w-3 h-3 text-green-600" />
              <p class="text-[10px] whitespace-nowrap text-green-600">
                Expense paid
              </p>
            </div>
            <div
              class="flex justify-start space-x-1 items-center"
              v-if="
                item.payment_status == 'partially_paid' &&
                item.product_type != 'App\\Models\\PrivateVanTour'
              "
            >
              <CreditCardIcon class="w-3 h-3 text-yellow-600" />
              <p class="text-[10px] whitespace-nowrap text-yellow-600">
                E.partially paid
              </p>
            </div>
            <div
              class="flex justify-start space-x-1 items-center"
              v-if="
                item.payment_status == 'not_paid' &&
                item.product_type != 'App\\Models\\PrivateVanTour'
              "
            >
              <CreditCardIcon class="w-3 h-3 text-red-600" />
              <p class="text-[10px] whitespace-nowrap text-red-600">
                Expense not paid
              </p>
            </div>
            <div
              class="flex justify-start space-x-1 items-center"
              v-if="
                item.reservation_status == 'confirmed' &&
                item.product_type != 'App\\Models\\PrivateVanTour'
              "
            >
              <CurrencyDollarIcon class="w-3 h-3 text-green-600" />
              <p class="text-[10px] whitespace-nowrap text-green-600">
                Confirmation recieved
              </p>
            </div>
            <div
              class="flex justify-start space-x-1 items-center"
              v-if="
                item.reservation_status == 'awaiting' &&
                item.product_type != 'App\\Models\\PrivateVanTour'
              "
            >
              <CurrencyDollarIcon class="w-3 h-3 text-yellow-600" />
              <p class="text-[10px] whitespace-nowrap text-yellow-600">
                Confirmation awaiting
              </p>
            </div>
            <div
              class="flex justify-start space-x-1 items-center"
              v-if="
                item.reservation_status == 'declined' &&
                item.product_type != 'App\\Models\\PrivateVanTour'
              "
            >
              <CurrencyDollarIcon class="w-3 h-3 text-red-600" />
              <p class="text-[10px] whitespace-nowrap text-red-600">
                Confirmation not recieved
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from "vue";
import {
  CurrencyDollarIcon,
  CreditCardIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilSquareIcon,
  TruckIcon,
} from "@heroicons/vue/24/solid";
import { useAuthStore } from "../../stores/auth";
import {
  PencilIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/vue/24/outline";

import { useReservationStore } from "../../stores/reservation";
import { useToast } from "vue-toastification";

const authStore = useAuthStore();
const toast = useToast();
const showList = ref(false);
const reservationStore = useReservationStore();
const props = defineProps({
  data: Object,
  detailId: String,
});

const daysBetween = (a, b) => {
  console.log(a, b);
  if (a && b) {
    const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const startDateTimestamp = new Date(a).getTime();
    const endDateTimestamp = new Date(b).getTime();
    let result = Math.abs(
      Math.round((endDateTimestamp - startDateTimestamp) / oneDay)
    );
    return result;
  } else {
    return 1;
  }
};

const formatDate = (date) => {
  const [datePart] = date.split(" ");
  const [day, month, year] = datePart.split("-");
  return `${day}/${month}/${year}`;
};

const expense = (data) => {
  let result = 0;
  for (let i = 0; i < data.length; i++) {
    result = result + data[i].total_cost_price * 1;
  }
  return result;
};

const selling = (data) => {
  let result = 0;
  for (let i = 0; i < data.length; i++) {
    result = result + data[i].amount * 1;
  }
  return result;
};

onMounted(() => {
  console.log(props.data);
});
</script>
