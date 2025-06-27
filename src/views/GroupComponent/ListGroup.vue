<template>
  <div
    @click="showList = !showList"
    :class="data?.id == route.query.id ? 'bg-[#FF613c]/10 shadow-lg' : ''"
    class="px-4 pb-2 relative cursor-pointer border-b border-gray-100"
  >
    <div
      class="absolute top-[36px] left-3 rounded-full w-2 h-2"
      :class="{
        'bg-blue-600': data?.product_type === 'EntranceTicket',
        'bg-green-600': data?.product_type === 'Hotel',
        'bg-yellow-600': data?.product_type === 'PrivateVanTour',
        'bg-red-600': data?.product_type === 'AirportPickup',
      }"
    ></div>
    <div v-if="checkDate" class="absolute top-[50px] left-2.5 rounded-full">
      <StarIcon class="w-3 h-3 text-[#FF613c]" />
    </div>

    <div class="pl-5 pt-2 gap-y-4 gap-x-3">
      <div class="flex justify-between items-center">
        <div>
          <p class="text-[10px] space-x-1">
            <span class="font-medium"
              >{{ data?.firstest_service_date }} :
              {{ data?.latest_service_date }}</span
            >
          </p>
        </div>
        <div class="">
          <div
            class="text-[10px] text-[#ff613c] space-x-1 flex justify-end items-center"
          >
            <p class="font-medium">E-{{ data?.total_cost_price }}</p>

            <p class="font-medium" v-if="authStore.isSuperAdmin">
              : S-{{ data?.total_amount }}
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
            'bg-blue-600': data?.product_type === 'EntranceTicket',
            'bg-green-600': data?.product_type === 'Hotel',
            'bg-yellow-600': data?.product_type === 'PrivateVanTour',
            'bg-red-600': data?.product_type === 'AirportPickup',
          }"
        >
          {{ data?.product_type == "EntranceTicket" ? "Ticket" : "" }}
          {{ data?.product_type == "Hotel" ? "Hotel" : "" }}
          {{ data?.product_type == "PrivateVanTour" ? "Vantour" : "" }}
          {{ data?.product_type == "AirportPickup" ? "Pickup" : "" }}
        </p>
        <p
          class="text-[10px] bg-[#ff613c] whitespace-nowrap px-1 py-0.5 text-white inline-block rounded-lg"
        >
          {{ data?.booking_crm_id }}
        </p>
        <p
          class="text-[10px] bg-gray-600 px-1 py-0.5 text-white whitespace-nowrap inline-block rounded-lg"
        >
          {{ data?.customer_name }}
        </p>
      </div>
      <div class="flex justify-start items-center">
        <div
          class="text-[12px] font-medium space-x-2 text-gray-900 line-clamp-1"
        >
          <span class="whitespace-nowrap">{{
            data?.items[0].product_name
          }}</span>
          <span
            class="bg-gray-900 w-1 h-1 mb-0.5 rounded-full inline-block"
          ></span
          ><span class="whitespace-nowrap">{{ data?.items.length }} items</span>
        </div>
      </div>
      <div class="pt-1 flex justify-start items-center gap-x-3">
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="data?.customer_payment_status == 'fully_paid'"
        >
          <CurrencyDollarIcon class="w-3 h-3 text-green-600" />
          <p class="text-[10px] whitespace-nowrap text-green-600">
            Customer paid
          </p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="data?.customer_payment_status == 'partially_paid'"
        >
          <CurrencyDollarIcon class="w-3 h-3 text-yellow-600" />
          <p class="text-[10px] whitespace-nowrap text-yellow-600">
            C.partially paid
          </p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="data?.customer_payment_status == 'not_paid'"
        >
          <CurrencyDollarIcon class="w-3 h-3 text-red-600" />
          <p class="text-[10px] whitespace-nowrap text-red-600">C.not paid</p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="
            data?.expense_status == 'fully_paid' &&
            data?.product_type != 'PrivateVanTour'
          "
        >
          <CurrencyDollarIcon class="w-3 h-3 text-green-600" />
          <p class="text-[10px] whitespace-nowrap text-green-600">Exp paid</p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="
            data?.expense_status != 'fully_paid' &&
            data?.product_type != 'PrivateVanTour'
          "
        >
          <CurrencyDollarIcon class="w-3 h-3 text-red-600" />
          <p class="text-[10px] whitespace-nowrap text-red-600">Exp not paid</p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="
            data?.has_booking_confirm_letter &&
            data?.product_type != 'PrivateVanTour'
          "
        >
          <CurrencyDollarIcon class="w-3 h-3 text-green-600" />
          <p class="text-[10px] whitespace-nowrap text-green-600">
            Invoice have
          </p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="
            data?.has_booking_confirm_letter == false &&
            data?.product_type != 'PrivateVanTour'
          "
        >
          <CurrencyDollarIcon class="w-3 h-3 text-red-600" />
          <p class="text-[10px] whitespace-nowrap text-red-600">
            Invoice empty
          </p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="
            data?.booking_items_payment_detail == true &&
            data?.product_type == 'PrivateVanTour'
          "
        >
          <CurrencyDollarIcon class="w-3 h-3 text-green-600" />
          <p class="text-[10px] whitespace-nowrap text-green-600">
            Collect Fill
          </p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="
            data?.booking_items_payment_detail == false &&
            data?.product_type == 'PrivateVanTour'
          "
        >
          <CurrencyDollarIcon class="w-3 h-3 text-red-600" />
          <p class="text-[10px] whitespace-nowrap text-red-600">
            Collect Empty
          </p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="
            data?.booking_items_assigned == true &&
            data?.product_type == 'PrivateVanTour'
          "
        >
          <CurrencyDollarIcon class="w-3 h-3 text-green-600" />
          <p class="text-[10px] whitespace-nowrap text-green-600">
            Assigned Fill
          </p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="
            data?.booking_items_assigned == false &&
            data?.product_type == 'PrivateVanTour'
          "
        >
          <CurrencyDollarIcon class="w-3 h-3 text-red-600" />
          <p class="text-[10px] whitespace-nowrap text-red-600">
            Assigned Empty
          </p>
        </div>
      </div>
      <div v-if="showList" class="">
        <div
          class="transition-all mb-2 relative duration-200 ease-in bg-gray-50 shadow rounded-md px-3 mt-3"
        >
          <div v-for="item in data?.items" :key="item.id" class="">
            <div>
              <div
                class="text-[12px] font-medium space-x-2 text-gray-900 flex justify-start items-center overflow-x-scroll no-sidebar-container pt-2"
                :class="index == 0 ? '' : ' border-t border-gray-200'"
              >
                <p class="whitespace-nowrap font-medium text-[10px]">
                  {{ item.product_name }}
                </p>
              </div>
              <div
                class="flex justify-start overflow-x-scroll no-sidebar-container space-x-4 py-2 items-center transition-all duration-150"
              >
                <div
                  class="flex justify-start space-x-1 items-center"
                  v-if="item.booking_status == 'fully_paid'"
                >
                  <CurrencyDollarIcon class="w-3 h-3 text-green-600" />
                  <p class="text-[10px] whitespace-nowrap text-green-600">
                    Customer paid
                  </p>
                </div>
                <div
                  class="flex justify-start space-x-1 items-center"
                  v-if="item.booking_status == 'partially_paid'"
                >
                  <CurrencyDollarIcon class="w-3 h-3 text-yellow-600" />
                  <p class="text-[10px] whitespace-nowrap text-yellow-600">
                    C.partially paid
                  </p>
                </div>
                <div
                  class="flex justify-start space-x-1 items-center"
                  v-if="item.booking_status == 'not_paid'"
                >
                  <CurrencyDollarIcon class="w-3 h-3 text-red-600" />
                  <p class="text-[10px] whitespace-nowrap text-red-600">
                    C.not paid
                  </p>
                </div>
                <div
                  class="flex justify-start space-x-1 items-center"
                  v-if="
                    item.booking_status == 'fully_paid' &&
                    item.product_type != 'PrivateVanTour'
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
                    item.booking_status == 'partially_paid' &&
                    item.product_type != 'PrivateVanTour'
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
                    item.booking_status == 'not_paid' &&
                    item.product_type != 'PrivateVanTour'
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
                    item.product_type != 'PrivateVanTour'
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
                    item.product_type != 'PrivateVanTour'
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
                    item.product_type != 'PrivateVanTour'
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
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, computed } from "vue";
import { useAuthStore } from "../../stores/auth";
import {
  CurrencyDollarIcon,
  CreditCardIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilSquareIcon,
  TruckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckBadgeIcon,
  IdentificationIcon,
  StarIcon,
} from "@heroicons/vue/24/solid";
import {
  PencilIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/vue/24/outline";
import { useToast } from "vue-toastification";
import { useRoute } from "vue-router";
import { getFormatDate } from "../help/FormatData";

const authStore = useAuthStore();
const toast = useToast();
const route = useRoute();
const showList = ref(false);

const props = defineProps({
  data: Object,
  detailId: String,
});

const checkDate = computed(() => {
  if (!props.data?.firstest_service_date) return false;

  const today = new Date();
  const serviceDate = new Date(props.data.firstest_service_date);

  if (isNaN(serviceDate.getTime())) return false;

  const daysDiff = Math.ceil((serviceDate - today) / (1000 * 60 * 60 * 24));

  return daysDiff >= 0 && daysDiff <= 5;
});
</script>
