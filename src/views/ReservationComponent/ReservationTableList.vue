<template>
  <div>
    <div
      v-show="!loading"
      class="relative group"
      v-for="d in reservations"
      :key="d.id"
    >
      <div
        class="grid w-auto grid-cols-10 col-span-8 bg-white divide-y divide-gray-100 pr-2"
        :class="d.cancellation == 'cancel_confirm' ? 'bg-yellow-200/50' : ''"
      >
        <div
          class="p-3 mt-2 text-xs flex justify-center items-center text-gray-700 whitespace-nowrap"
        >
          {{ d.crm_id }}
        </div>
        <div
          class="p-3 mt-2 text-xs flex justify-center items-center text-gray-700"
        >
          <p class="mr-6 whitespace-nowrap">{{ d.service_date }}</p>
        </div>
        <div
          class="p-3 mt-2 text-xs flex justify-center items-center text-gray-700 whitespace-nowrap overflow-hidden"
        >
          {{ d.customer_info?.name }}
        </div>
        <div
          class="p-3 mt-2 text-xs flex justify-center items-center text-gray-700 whitespace-nowrap"
        >
          <p v-if="d.product_type == 'App\\Models\\PrivateVanTour'">
            PrivateVanTour
          </p>
          <p v-if="d.product_type == 'App\\Models\\GroupTour'">GroupTour</p>
          <p v-if="d.product_type == 'App\\Models\\AirportPickup'">Airpot</p>
          <p v-if="d.product_type == 'App\\Models\\EntranceTicket'">Entrance</p>
          <p v-if="d.product_type == 'App\\Models\\Inclusive'">Inclusive</p>
          <p
            v-if="d.product_type == 'App\\Models\\Hotel'"
            class="flex justify-center items-center gap-2"
          >
            Hotel
            <!-- <InformationCircleIcon
              class="w-6 h-6 text-orange-500"
              v-if="d.paid_slip.length > 0"
            /> -->
          </p>
          <p v-if="d.product_type == 'App\\Models\\Airline'">Airline</p>
        </div>
        <div
          class="p-3 mt-2 text-xs flex justify-center items-center text-gray-700"
        >
          <!-- {{ limitedText(d.product?.name) }} -->
          {{ limitedText(d.product?.name) }}
        </div>
        <div
          class="p-3 mt-2 text-xs flex justify-center items-center text-gray-700"
        >
          <p v-if="d.car?.name">{{ limitedText(d.car?.name) }}</p>
          <p v-if="d.variation?.name">
            {{ limitedText(d.variation?.name) }}
          </p>
          <p v-if="d.room?.name">{{ limitedText(d.room?.name) }}</p>
          <p v-if="d.ticket?.price">{{ limitedText(d.ticket?.price) }}</p>
        </div>
        <div
          class="p-3 mt-2 text-xs text-center text-gray-700 whitespace-nowrap"
        >
          <p
            v-if="
              !d.booking?.payment_status || d.booking?.payment_status == 'null'
            "
          >
            -
          </p>
          <p
            v-if="d.booking?.payment_status == 'fully_paid'"
            class="inline-block px-3 py-1 mt-2 text-xs text-white bg-green-500 rounded-full shadow"
          >
            {{ d.booking?.payment_status }}
          </p>
          <p
            v-if="d.booking?.payment_status == 'not_paid'"
            class="inline-block px-3 py-1 mt-2 text-xs text-white bg-red-500 rounded-full shadow"
          >
            {{ d.booking?.payment_status }}
          </p>
          <p
            v-if="d.booking?.payment_status == 'partially_paid'"
            class="inline-block px-3 py-1 mt-2 text-xs text-white bg-yellow-500 rounded-full shadow"
          >
            {{ d.booking?.payment_status }}
          </p>
        </div>
        <div
          class="py-3 mt-2 text-xs text-gray-700 flex justify-center items-center whitespace-nowrap"
        >
          <p v-if="!d.reservation_status">-</p>

          <p
            v-if="d.reservation_status == 'confirmed'"
            class="inline-block px-3 py-1 mt-2 text-xs text-white bg-green-500 rounded-full shadow"
          >
            {{ d.reservation_status }}
          </p>
          <p
            v-if="d.reservation_status == 'declined'"
            class="inline-block px-3 py-1 mt-2 text-xs text-white bg-red-500 rounded-full shadow"
          >
            {{ d.reservation_status }}
          </p>
          <p
            v-if="d.reservation_status == 'awaiting'"
            class="inline-block px-3 py-1 mt-2 text-xs text-white bg-yellow-500 rounded-full shadow"
          >
            {{ d.reservation_status }}
          </p>
        </div>
        <div
          class="py-3 mt-2 text-xs text-center text-gray-700 whitespace-nowrap z-10"
        >
          <p v-if="!d?.payment_status || d?.payment_status == 'null'">-</p>
          <p
            v-if="d?.payment_status == 'fully_paid'"
            class="inline-block px-3 py-1 mt-2 text-xs text-white bg-green-500 rounded-full shadow"
          >
            {{ d?.payment_status }}
          </p>
          <p
            v-if="d?.payment_status == 'not_paid'"
            class="inline-block px-3 py-1 mt-2 text-xs text-white bg-red-500 rounded-full shadow"
          >
            {{ d?.payment_status }}
          </p>
          <p
            v-if="d?.payment_status == 'partially_paid'"
            class="inline-block px-3 py-1 mt-2 text-xs text-white bg-yellow-500 rounded-full shadow"
          >
            {{ d?.payment_status }}
          </p>
        </div>

        <div
          class="p-3 mt-2 text-xs flex justify-center items-center text-gray-700 space-x-2"
        >
          <button
            @click="copyReservation(d.id)"
            class="p-1 text-blue-500 transition bg-white rounded-lg shadow hover:bg-blue-500 hover:text-white"
          >
            <DocumentDuplicateIcon class="w-5 h-5" />
          </button>
          <button
            @click="
              router.push({
                name: 'update_bookings',
                params: { id: d.booking.id, action: 'edit' },
              })
            "
            class="p-1 text-blue-500 transition bg-white rounded-lg shadow hover:bg-yellow-500 hover:text-white"
          >
            <ClipboardDocumentListIcon class="w-5 h-5" />
          </button>

          <router-link :to="'/reservation/update/' + d.id + '/' + d.crm_id">
            <button
              class="p-1 text-blue-500 transition bg-white rounded-lg shadow hover:bg-yellow-500 hover:text-white"
            >
              <PencilSquareIcon class="w-5 h-5" />
            </button>
          </router-link>
        </div>
      </div>
    </div>
    <div
      v-if="reservations.length == 0"
      class="flex items-center justify-center py-20"
    >
      Data Empty ...
    </div>
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div
        class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-4"
        role="status"
      >
        <span
          class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >Loading...</span
        >
      </div>
      Loading ...
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import {
  PencilSquareIcon,
  TrashIcon,
  ShareIcon,
  EyeIcon,
  TicketIcon,
  InformationCircleIcon,
  BuildingOfficeIcon,
  PlusIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  DocumentDuplicateIcon,
  UsersIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  PrinterIcon,
} from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";
const router = useRouter();

const props = defineProps({
  reservations: Object,
  loading: Boolean,
  copyReservation: Function,
});

const limitedText = (text) => {
  if (text != "") {
    if (text?.length <= 10) {
      return text;
    } else {
      return text?.slice(0, 10);
    }
  }
};
</script>
