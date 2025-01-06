<template>
  <div class="px-4 pb-2 relative cursor-pointer" @click="open = !open">
    <div
      class="absolute top-[36px] left-3 rounded-full w-2 h-2"
      :class="backgroundCustom"
    ></div>
    <div class="pl-5 pt-2 gap-y-4 gap-x-3">
      <div class="flex justify-between items-center">
        <div>
          <p
            class="text-[10px] space-x-1"
            v-if="data?.product_type != 'App\\Models\\Hotel'"
          >
            <span class="font-medium">{{ data?.service_date }}</span>
          </p>
          <p
            class="text-[10px] space-x-1"
            v-if="data?.product_type == 'App\\Models\\Hotel'"
          >
            <span class="font-medium"
              >{{ data?.checkin_date }} / {{ data?.checkout_date }}</span
            >
          </p>
        </div>
        <div class="">
          <div
            class="text-[10px] text-[#ff613c] space-x-1 flex justify-end items-center"
            v-if="data?.product_type != 'App\\Models\\Hotel'"
          >
            <p class="font-medium">E-{{ data?.cost_price * data?.quantity }}</p>

            <p class="font-medium" v-if="authStore.isSuperAdmin">
              : P-{{ data?.selling_price * data?.quantity }}
            </p>
            <p
              class="text-white bg-gray-800 px-1 rounded-md"
              v-if="data?.booking?.is_inclusive == 1"
            >
              Inclusive
            </p>
          </div>
          <p
            class="text-[10px] text-[#ff613c] space-x-1"
            v-if="data?.product_type == 'App\\Models\\Hotel'"
          >
            <span class="font-medium"
              >E-{{
                data?.cost_price *
                data?.quantity *
                daysBetween(data?.checkin_date, data?.checkout_date)
              }}</span
            >

            <span class="font-medium" v-if="authStore.isSuperAdmin"
              >: P-{{
                data?.selling_price *
                data?.quantity *
                daysBetween(data?.checkin_date, data?.checkout_date)
              }}</span
            >
          </p>
        </div>
      </div>
      <div class="py-2 flex justify-start items-center gap-x-2">
        <p
          class="text-xs px-1 py-0.5 text-white inline-block rounded-lg"
          :class="{
            'bg-blue-600': data.product_type === 'App\\Models\\EntranceTicket',
            'bg-green-600': data.product_type === 'App\\Models\\Hotel',
            'bg-yellow-600':
              data.product_type === 'App\\Models\\PrivateVanTour',
          }"
        >
          {{
            data?.product_type == "App\\Models\\EntranceTicket" ? "Ticket" : ""
          }}
          {{ data?.product_type == "App\\Models\\Hotel" ? "Hotel" : "" }}
          {{
            data?.product_type == "App\\Models\\PrivateVanTour" ? "Vantour" : ""
          }}
        </p>
        <p
          class="text-xs bg-[#ff613c] px-1 py-0.5 text-white inline-block rounded-lg"
        >
          {{ data?.crm_id }}
        </p>
        <p
          class="text-xs bg-gray-600 px-1 py-0.5 text-white inline-block rounded-lg"
        >
          {{ data.customer_info?.name }}
        </p>
      </div>
      <div class="flex justify-between items-center">
        <p class="text-[14px] font-medium space-x-2 text-gray-900 line-clamp-1">
          <span>{{ data.product?.name }}</span>
          <span class="bg-gray-900 w-1 h-1 rounded-full inline-block"></span
          ><span v-if="data.product_type == 'App\\Models\\EntranceTicket'">{{
            data.variation?.name
          }}</span>
          <span v-if="data.product_type == 'App\\Models\\Hotel'">{{
            data.room?.name
          }}</span>
          <span v-if="data.product_type == 'App\\Models\\PrivateVanTour'">{{
            data.car?.name
          }}</span>
        </p>
        <p
          class="text-[10px] space-x-2 text-gray-500 whitespace-nowrap"
          v-if="data?.product_type == 'App\\Models\\Hotel'"
        >
          {{ data?.quantity }} rooms,
          {{ daysBetween(data?.checkin_date, data?.checkout_date) }} nights
        </p>
        <p
          class="text-[10px] space-x-2 text-gray-500 whitespace-nowrap"
          v-if="data?.product_type == 'App\\Models\\EntranceTicket'"
        >
          {{ data?.quantity }} tickets
        </p>
        <p
          class="text-[10px] space-x-2 text-gray-500 whitespace-nowrap"
          v-if="data?.product_type == 'App\\Models\\PrivateVanTour'"
        >
          {{ data?.quantity }} cars
        </p>
      </div>
      <div
        class="flex justify-start space-x-4 pt-2 items-center transition-all duration-150"
        v-if="!open"
      >
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="data?.booking?.payment_status == 'fully_paid'"
        >
          <CurrencyDollarIcon class="w-4 h-4 text-green-600" />
          <p class="text-[9px] text-green-600">Customer paid</p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="data?.booking?.payment_status == 'partially_paid'"
        >
          <CurrencyDollarIcon class="w-4 h-4 text-yellow-600" />
          <p class="text-[9px] text-yellow-600">C.partially paid</p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="data?.booking?.payment_status == 'not_paid'"
        >
          <CurrencyDollarIcon class="w-4 h-4 text-red-600" />
          <p class="text-[9px] text-red-600">C.not paid</p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="
            data?.payment_status == 'fully_paid' &&
            data.product_type != 'App\\Models\\PrivateVanTour'
          "
        >
          <CreditCardIcon class="w-4 h-4 text-green-600" />
          <p class="text-[9px] text-green-600">Expense paid</p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="
            data?.payment_status == 'partially_paid' &&
            data.product_type != 'App\\Models\\PrivateVanTour'
          "
        >
          <CreditCardIcon class="w-4 h-4 text-yellow-600" />
          <p class="text-[9px] text-yellow-600">E.partially paid</p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="
            data?.payment_status == 'not_paid' &&
            data.product_type != 'App\\Models\\PrivateVanTour'
          "
        >
          <CreditCardIcon class="w-4 h-4 text-red-600" />
          <p class="text-[9px] text-red-600">Expense not paid</p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="
            data?.reservation_status == 'confirmed' &&
            data.product_type != 'App\\Models\\PrivateVanTour'
          "
        >
          <CurrencyDollarIcon class="w-4 h-4 text-green-600" />
          <p class="text-[9px] text-green-600">Confirmation recieved</p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="
            data?.reservation_status == 'awaiting' &&
            data.product_type != 'App\\Models\\PrivateVanTour'
          "
        >
          <CurrencyDollarIcon class="w-4 h-4 text-yellow-600" />
          <p class="text-[9px] text-yellow-600">Confirmation awaiting</p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="
            data?.reservation_status == 'declined' &&
            data.product_type != 'App\\Models\\PrivateVanTour'
          "
        >
          <CurrencyDollarIcon class="w-4 h-4 text-red-600" />
          <p class="text-[9px] text-red-600">Confirmation not recieved</p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="
            data?.reservation_car_info?.supplier_id != null &&
            data.product_type == 'App\\Models\\PrivateVanTour'
          "
        >
          <TruckIcon class="w-4 h-4 text-green-600" />
          <p class="text-[9px] text-green-600">Supplier</p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="
            data?.reservation_car_info?.supplier_id == null &&
            data.product_type == 'App\\Models\\PrivateVanTour'
          "
        >
          <TruckIcon class="w-4 h-4 text-yellow-600" />
          <p class="text-[9px] text-yellow-600">Supplier Missing</p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="
            data?.reservation_car_info?.driver_id != null &&
            data.product_type == 'App\\Models\\PrivateVanTour'
          "
        >
          <TruckIcon class="w-4 h-4 text-green-600" />
          <p class="text-[9px] text-green-600">Driver</p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="
            data?.reservation_car_info?.driver_id == null &&
            data.product_type == 'App\\Models\\PrivateVanTour'
          "
        >
          <TruckIcon class="w-4 h-4 text-yellow-600" />
          <p class="text-[9px] text-yellow-600">Driver Missing</p>
        </div>
      </div>
    </div>

    <div
      class="relative space-y-4 pb-2 transition-all duration-150"
      v-if="open"
    >
      <div
        class="w-[1px] bg-black/20 absolute top-1 left-[27px]"
        :class="
          data?.product_type == 'App\\Models\\PrivateVanTour'
            ? 'h-[130px]'
            : 'h-[160px]'
        "
      ></div>
      <div
        class="flex justify-start items-center px-5 gap-x-2 z-2 bg-white relative"
      >
        <div
          v-if="data?.booking?.payment_status == 'fully_paid'"
          class="h-[30px] w-[1px] bg-green-500 absolute top-1 z-1 left-[27px]"
        ></div>
        <CurrencyDollarIcon
          class="w-4 h-4 text-green-600 bg-white z-4 relative"
          v-if="data?.booking?.payment_status == 'fully_paid'"
        />
        <CurrencyDollarIcon
          class="w-4 h-4 text-yellow-600 bg-white z-4 relative"
          v-if="data?.booking?.payment_status != 'fully_paid'"
        />
        <div class="grid grid-cols-6 gap-x-4 w-full">
          <p class="text-[10px] text-gray-600 col-span-2">Customer Payment</p>
          <p
            class="text-[10px] col-span-2"
            :class="{
              'text-green-600': data?.booking?.payment_status == 'fully_paid',
              'text-yellow-600':
                data?.booking?.payment_status == 'partially_paid',
              'text-red-600': data?.booking?.payment_status == 'not_paid',
            }"
          >
            {{ data?.booking?.payment_status }}
          </p>
          <p class="text-[10px] text-gray-600 flex justify-end">
            {{
              data?.booking?.receipts.length > 0
                ? formatDate(data?.booking?.receipts[0]?.created_at)
                : "--/--/--"
            }}
          </p>
          <p class="text-[10px] text-gray-600">
            <PencilSquareIcon class="w-4 h-4" />
          </p>
        </div>
      </div>
      <div
        v-if="data?.product_type != 'App\\Models\\PrivateVanTour'"
        class="flex justify-start items-center px-5 gap-x-2 z-2 bg-white relative"
      >
        <div
          v-if="data?.customer_passports.length != 0"
          class="h-[30px] w-[1px] bg-green-500 absolute top-1 z-1 left-[27px]"
        ></div>
        <CurrencyDollarIcon
          class="w-4 h-4 text-green-600 bg-white z-4 relative"
          v-if="data?.customer_passports.length != 0"
        />
        <CurrencyDollarIcon
          class="w-4 h-4 text-yellow-600 bg-white z-4 relative"
          v-if="data?.customer_passports.length == 0"
        />
        <div class="grid grid-cols-6 gap-x-4 w-full">
          <p class="text-[10px] text-gray-600 col-span-2">Passport Info</p>
          <p
            class="text-[10px] col-span-2"
            :class="{
              'text-green-600': data?.customer_passports.length != 0,
              'text-red-600': data?.customer_passports.length == 0,
            }"
          >
            {{
              data?.customer_passports.length == 0
                ? "not available"
                : "available"
            }}
          </p>
          <p class="text-[10px] text-gray-600 flex justify-end">
            {{
              data?.customer_passports.length > 0
                ? formatDate(data?.customer_passports[0]?.created_at)
                : "--/--/--"
            }}
          </p>
          <p class="text-[10px] text-gray-600">
            <PencilSquareIcon class="w-4 h-4" />
          </p>
        </div>
      </div>
      <div
        class="flex justify-start items-center px-5 gap-x-2 z-2 bg-white relative"
      >
        <CheckCircleIcon class="w-4 h-4 text-gray-300" />
        <div class="grid grid-cols-6 gap-x-4 w-full">
          <p class="text-[10px] text-gray-600 col-span-2">Booking Request</p>
          <p class="text-[10px] text-gray-600 col-span-2">pending</p>
          <p class="text-[10px] text-gray-600 flex justify-end">--/--/--</p>
          <p class="text-[10px] text-gray-600">
            <PencilSquareIcon class="w-4 h-4" />
          </p>
        </div>
      </div>
      <div
        class="flex justify-start items-center px-5 gap-x-2 z-2 bg-white relative"
      >
        <CheckCircleIcon class="w-4 h-4 text-gray-300" />
        <div class="grid grid-cols-6 gap-x-4 w-full">
          <p class="text-[10px] text-gray-600 col-span-2">Invoice Update</p>
          <p class="text-[10px] text-gray-600 col-span-2">pending</p>
          <p class="text-[10px] text-gray-600 flex justify-end">--/--/--</p>
          <p class="text-[10px] text-gray-600">
            <PencilSquareIcon class="w-4 h-4" />
          </p>
        </div>
      </div>
      <div
        v-if="data?.product_type != 'App\\Models\\PrivateVanTour'"
        class="flex justify-start items-center px-5 gap-x-2 z-2 bg-white relative"
      >
        <div
          v-if="data?.payment_status == 'fully_paid'"
          class="h-[30px] w-[1px] bg-green-500 absolute top-1 z-1 left-[27px]"
        ></div>
        <CurrencyDollarIcon
          class="w-4 h-4 text-green-600 bg-white z-4 relative"
          v-if="data?.payment_status == 'fully_paid'"
        />
        <CurrencyDollarIcon
          class="w-4 h-4 text-yellow-600 bg-white z-4 relative"
          v-if="data?.payment_status != 'fully_paid'"
        />
        <div class="grid grid-cols-6 gap-x-4 w-full">
          <p class="text-[10px] text-gray-600 col-span-2">Expense</p>
          <p
            class="text-[10px] col-span-2"
            :class="{
              'text-green-600': data?.payment_status == 'fully_paid',
              'text-yellow-600': data?.payment_status == 'partially_paid',
              'text-red-600': data?.payment_status == 'not_paid',
            }"
          >
            {{ data?.payment_status }}
          </p>
          <p class="text-[10px] text-gray-600 flex justify-end">
            {{
              data?.paid_slip.length > 0
                ? formatDate(data?.paid_slip[0]?.created_at)
                : "--/--/--"
            }}
          </p>
          <p class="text-[10px] text-gray-600">
            <PencilSquareIcon class="w-4 h-4" />
          </p>
        </div>
      </div>
      <div
        v-if="data?.product_type != 'App\\Models\\PrivateVanTour'"
        class="flex justify-start items-center px-5 gap-x-2 z-2 bg-white relative"
      >
        <!-- <div
          v-if="data?.payment_status == 'fully_paid'"
          class="h-[30px] w-[1px] bg-green-500 absolute top-1 z-1 left-[27px]"
        ></div> -->
        <CurrencyDollarIcon
          class="w-4 h-4 text-green-600 bg-white z-4 relative"
          v-if="data?.reservation_status == 'confirmed'"
        />
        <CurrencyDollarIcon
          class="w-4 h-4 text-yellow-600 bg-white z-4 relative"
          v-if="data?.reservation_status != 'confirmed'"
        />
        <div class="grid grid-cols-6 gap-x-4 w-full">
          <p class="text-[10px] text-gray-600 col-span-2">Confirmation</p>
          <p
            class="text-[10px] col-span-2"
            :class="{
              'text-green-600': data?.reservation_status == 'confirmed',
              'text-yellow-600': data?.reservation_status == 'awaiting',
            }"
          >
            {{ data?.reservation_status }}
          </p>
          <p class="text-[10px] text-gray-600 flex justify-end">
            {{
              data?.receipt_images.length > 0
                ? formatDate(data?.receipt_images[0]?.created_at)
                : "--/--/--"
            }}
          </p>
          <p class="text-[10px] text-gray-600">
            <PencilSquareIcon class="w-4 h-4" />
          </p>
        </div>
      </div>
      <div
        v-if="data?.product_type === 'App\\Models\\PrivateVanTour'"
        class="flex justify-start items-center px-5 gap-x-2 z-2 bg-white relative"
      >
        <!-- <div
          v-if="data?.payment_status == 'fully_paid'"
          class="h-[30px] w-[1px] bg-green-500 absolute top-1 z-1 left-[27px]"
        ></div> -->
        <CurrencyDollarIcon
          class="w-4 h-4 text-green-600 bg-white z-4 relative"
          v-if="
            data?.reservation_car_info != null &&
            data?.reservation_car_info?.supplier_id != null
          "
        />
        <CurrencyDollarIcon
          class="w-4 h-4 text-gray-600 bg-white z-4 relative"
          v-if="data?.reservation_car_info == null"
        />
        <div class="grid grid-cols-6 gap-x-4 w-full">
          <p class="text-[10px] text-gray-600 col-span-2">Supplier</p>
          <p
            class="text-[10px] col-span-2"
            :class="{
              'text-green-600': data?.reservation_car_info != 'null',
              'text-yellow-600': data?.reservation_car_info == 'null',
            }"
          >
            {{ data?.reservation_car_info?.supplier_name }}
          </p>
          <p class="text-[10px] text-gray-600 flex justify-end">--/--/--</p>
          <p class="text-[10px] text-gray-600">
            <PencilSquareIcon class="w-4 h-4" />
          </p>
        </div>
      </div>
      <div
        v-if="data?.product_type === 'App\\Models\\PrivateVanTour'"
        class="flex justify-start items-center px-5 gap-x-2 z-2 bg-white relative"
      >
        <!-- <div
          v-if="data?.payment_status == 'fully_paid'"
          class="h-[30px] w-[1px] bg-green-500 absolute top-1 z-1 left-[27px]"
        ></div> -->
        <CurrencyDollarIcon
          class="w-4 h-4 text-green-600 bg-white z-4 relative"
          v-if="
            data?.reservation_car_info != null &&
            data?.reservation_car_info?.driver_id != null
          "
        />
        <CurrencyDollarIcon
          class="w-4 h-4 text-gray-600 bg-white z-4 relative"
          v-if="data?.reservation_car_info == null"
        />
        <div class="grid grid-cols-6 gap-x-4 w-full">
          <p class="text-[10px] text-gray-600 col-span-2">Supplier</p>
          <p
            class="text-[10px] col-span-2"
            :class="{
              'text-green-600': data?.reservation_car_info != 'null',
              'text-yellow-600': data?.reservation_car_info == 'null',
            }"
          >
            {{ data?.reservation_car_info?.driver_name }}
          </p>
          <p class="text-[10px] text-gray-600 flex justify-end">--/--/--</p>
          <p class="text-[10px] text-gray-600">
            <PencilSquareIcon class="w-4 h-4" />
          </p>
        </div>
      </div>
      <div class="flex justify-center items-center">
        <div class="flex justify-start items-center space-x-2">
          <p
            @click="
              router.push(`/reservation/update/${data.id}/${data.crm_id}`)
            "
            class="text-[10px] bg-blue-600 shadow-lg rounded-lg text-white px-3 py-1 cursor-pointer"
          >
            reservation
          </p>
          <p
            @click="
              router.push({
                name: 'update_new_bookings',
                params: { id: data.booking.id },
              })
            "
            class="text-[10px] bg-green-600 shadow-lg rounded-lg text-white px-3 py-1 cursor-pointer"
          >
            sales invoice
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
import {
  CurrencyDollarIcon,
  CreditCardIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilSquareIcon,
  TruckIcon,
} from "@heroicons/vue/24/solid";
import { useAuthStore } from "../../stores/auth";
import { PencilIcon } from "@heroicons/vue/24/outline";
import router from "../../router";

const authStore = useAuthStore();
const open = ref(false);

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
  }
};

const props = defineProps({
  backgroundCustom: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
});

const formatDate = (date) => {
  const [datePart] = date.split(" ");
  const [day, month, year] = datePart.split("-");
  return `${day}/${month}/${year}`;
};
</script>
