<script setup>
import {
  ClipboardDocumentListIcon,
  DocumentDuplicateIcon,
  PencilSquareIcon,
} from "@heroicons/vue/24/outline";
import { defineProps } from "vue";
import { useRouter } from "vue-router";
import { useReservationStore } from "../../stores/reservation";
import { useToast } from "vue-toastification";

const props = defineProps({
  reservations: Object,
  loading: Boolean,
});

const router = useRouter();
const reservationStore = useReservationStore();
const toast = useToast();

const limitedText = (text) => {
  if (text != "") {
    if (text?.length <= 10) {
      return text;
    } else {
      return text?.slice(0, 10);
    }
  }
};

const softList = (list) => {
  if (list.length > 0) {
    return [...list].sort(
      (a, b) => new Date(a.service_date) - new Date(b.service_date)
    );
  }
};

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
    🏩 Room Name : ${
      res.result.room_name != "null" ? res.result.room_name : "-"
    }
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
</script>
<template>
  <div>
    <div
      class="relative group space-y-2"
      v-for="d in reservations?.data"
      :key="d.id"
    >
      <div
        v-if="d.product_type == 'App\\Models\\Hotel'"
        class="grid w-auto grid-cols-10 col-span-8 bg-white rounded-xl mb-3 shadow-sm bg-opacity-30"
      >
        <div
          class="p-3 mt-2 text-xs font-semibold flex justify-center items-center text-gray-700 whitespace-nowrap"
        >
          <p class="bg-[#FF613c] text-white px-1.5 py-1 rounded-lg">
            {{ d.crm_id }}
          </p>
        </div>
        <div
          class="p-3 mt-2 text-sm font-semibold flex justify-center items-center text-gray-700 whitespace-nowrap overflow-hidden"
        >
          {{ d.checkin_date }}
        </div>
        <div
          class="p-3 mt-2 text-xs flex justify-center items-center text-gray-700 whitespace-nowrap overflow-hidden"
        >
          {{ d.checkout_date }}
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
          class="p-3 mt-2 text-xs flex justify-center items-center text-gray-700"
        >
          <p class="mr-6 whitespace-nowrap">
            {{ d.quantity * daysBetween(d.checkin_date, d.checkout_date) }} *
            {{ d.cost_price }}
          </p>
        </div>
        <div
          class="p-3 mt-2 text-xs flex justify-center items-center text-gray-700"
        >
          <p class="mr-6 whitespace-nowrap">
            {{ d.total_cost_price }}
          </p>
        </div>
        <div
          class="p-3 mt-2 text-xs flex justify-center items-center text-gray-700 space-x-2"
        >
          <button
            @click="copyReservation(d.id)"
            class="p-1 text-blue-500 transition bg-white rounded shadow hover:bg-blue-500 hover:text-white"
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
            class="p-1 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
          >
            <ClipboardDocumentListIcon class="w-5 h-5" />
          </button>

          <router-link :to="'/reservation/update/' + d.id + '/' + d.crm_id">
            <button
              class="p-1 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
            >
              <PencilSquareIcon class="w-5 h-5" />
            </button>
          </router-link>
        </div>
      </div>
      <div
        v-if="d.product_type == 'App\\Models\\EntranceTicket'"
        class="grid w-auto grid-cols-10 col-span-8 bg-white rounded-xl mb-3 shadow-sm bg-opacity-30"
      >
        <div
          class="p-3 mt-2 text-xs font-semibold flex justify-center items-center text-gray-700 whitespace-nowrap"
        >
          <p class="bg-[#FF613c] text-white px-1.5 py-1 rounded-lg">
            {{ d.crm_id }}
          </p>
        </div>
        <div
          class="p-3 mt-2 text-sm font-semibold flex justify-center items-center text-gray-700 whitespace-nowrap overflow-hidden"
        >
          {{ d.service_date }}
        </div>
        <div
          class="p-3 mt-2 text-xs flex justify-center items-center text-gray-700 whitespace-nowrap overflow-hidden"
        >
          ticket
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
          class="p-3 mt-2 text-xs flex justify-center items-center text-gray-700"
        >
          <p class="mr-6 whitespace-nowrap">
            {{ d.quantity }} *
            {{ d.cost_price }}
          </p>
        </div>
        <div
          class="p-3 mt-2 text-xs flex justify-center items-center text-gray-700"
        >
          <p class="mr-6 whitespace-nowrap">
            {{ d.total_cost_price }}
          </p>
        </div>
        <div
          class="p-3 mt-2 text-xs flex justify-center items-center text-gray-700 space-x-2"
        >
          <button
            @click="copyReservation(d.id)"
            class="p-1 text-blue-500 transition bg-white rounded shadow hover:bg-blue-500 hover:text-white"
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
            class="p-1 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
          >
            <ClipboardDocumentListIcon class="w-5 h-5" />
          </button>

          <router-link :to="'/reservation/update/' + d.id + '/' + d.crm_id">
            <button
              class="p-1 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
            >
              <PencilSquareIcon class="w-5 h-5" />
            </button>
          </router-link>
        </div>
      </div>
    </div>
    <div
      v-if="reservations?.data.length == 0"
      class="flex items-center justify-center py-20"
    >
      Data Empty ...
    </div>
    <div class="flex items-center justify-center py-20" v-if="loading">
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
