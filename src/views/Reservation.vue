<script setup>
import Layout from "./Layout.vue";
import Input from "../components/Input.vue";
import InputField from "../components/InputField.vue";
import Pagination from "../components/Pagination.vue";
import {
  PencilSquareIcon,
  TrashIcon,
  ShareIcon,
  EyeIcon,
  TicketIcon,
  BuildingOfficeIcon,
  PlusIcon,
  UserGroupIcon,
  UsersIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/vue/24/outline";

import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import { onMounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import { useRouter } from "vue-router";
import { useReservationStore } from "../stores/reservation";
import { storeToRefs } from "pinia";

const router = useRouter();
const toast = useToast();
const reservationStore = useReservationStore();

const { reservations, loading } = storeToRefs(reservationStore);

const changePage = async (url) => {
  console.log(url);
  await reservationStore.getChangePage(url);
};
const errors = ref([]);

const product_type = [
  { id: "1", name: "Inclusive", type: "App\\Models\\Inclusive" },
  { id: "2", name: "Entrance Ticket", type: "App\\Models\\EntranceTicket" },
  { id: "3", name: "Private Van Tour", type: "App\\Models\\PrivateVanTour" },
  { id: "4", name: "Group Tour", type: "App\\Models\\GroupTour" },
  { id: "5", name: "Airport Pickup", type: "App\\Models\\AirportPickup" },

  { id: "6", name: "ALL", type: "" },
];

const chooseType = () => {
  console.log(search.value);
};

const search = ref("");
const searchId = ref("");
const seen = ref(true);
const seenClick = () => {
  seen.value = !seen.value;
};

const searchValue = (val) => {
  search.value = val;
};

onMounted(async () => {
  await reservationStore.getListAction();
  console.log(reservations.value.data.length, "this is reservations");
});

watch(search, async (newValue) => {
  await reservationStore.getListAction({ product_type: search.value });
  searchId.value = "";
  console.log(reservations.value.data.length, "this is reservations");
});
watch(searchId, async (newValue) => {
  console.log(search.value, "this is serarch");
  await reservationStore.getListAction({
    product_type: search.value,
    crm_id: searchId.value,
  });
  console.log(reservations.value.data.length, "this is reservations");
});
</script>

<template>
  <Layout>
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-2xl font-medium text-gray-600">Reservation Lists</h3>
    </div>
    <div class="p-6 mb-5 rounded-lg shadow-sm bg-white/60">
      <!-- search input sort filter -->
      <div class="flex items-center justify-between mb-5">
        <div class="flex items-center justify-start gap-2 space-x-2">
          <p
            class="text-sm px-4 cursor-pointer hover:bg-[#ff613c] hover:text-white shadow-md py-2 border border-gray-200 rounded"
            @click="searchValue('')"
            :class="search == '' ? 'bg-[#ff613c] text-white' : ''"
          >
            All
          </p>
          <p
            class="text-sm px-4 cursor-pointer hover:bg-[#ff613c] hover:text-white shadow-md py-2 border border-gray-200 rounded"
            @click="searchValue('App\\Models\\PrivateVanTour')"
            :class="
              search == 'App\\Models\\PrivateVanTour'
                ? 'bg-[#ff613c] text-white'
                : ''
            "
          >
            Private Van tour
          </p>
          <p
            class="text-sm px-4 cursor-pointer hover:bg-[#ff613c] hover:text-white shadow-md py-2 border border-gray-200 rounded"
            @click="searchValue('App\\Models\\GroupTour')"
            :class="
              search == 'App\\Models\\GroupTour'
                ? 'bg-[#ff613c] text-white'
                : ''
            "
          >
            Group Tour
          </p>
          <p
            class="text-sm px-4 cursor-pointer hover:bg-[#ff613c] hover:text-white shadow-md py-2 border border-gray-200 rounded"
            @click="searchValue('App\\Models\\EntranceTicket')"
            :class="
              search == 'App\\Models\\EntranceTicket'
                ? 'bg-[#ff613c] text-white'
                : ''
            "
          >
            Entrance Ticket
          </p>
          <p
            class="text-sm px-4 cursor-pointer hover:bg-[#ff613c] hover:text-white shadow-md py-2 border border-gray-200 rounded"
            @click="searchValue('App\\Models\\AirportPickup')"
            :class="
              search == 'App\\Models\\AirportPickup'
                ? 'bg-[#ff613c] text-white'
                : ''
            "
          >
            Airport Pickup
          </p>
          <p
            class="text-sm px-4 cursor-pointer hover:bg-[#ff613c] hover:text-white shadow-md py-2 border border-gray-200 rounded"
            @click="searchValue('App\\Models\\Inclusive')"
            :class="
              search == 'App\\Models\\Inclusive'
                ? 'bg-[#ff613c] text-white'
                : ''
            "
          >
            Inclusive
          </p>
          <p
            class="text-sm px-4 cursor-pointer hover:bg-[#ff613c] hover:text-white shadow-md py-2 border border-gray-200 rounded"
            @click="searchValue('App\\Models\\Hotel')"
            :class="
              search == 'App\\Models\\Hotel' ? 'bg-[#ff613c] text-white' : ''
            "
          >
            Hotel
          </p>
          <p
            class="text-sm px-4 cursor-pointer hover:bg-[#ff613c] hover:text-white shadow-md py-2 border border-gray-200 rounded"
            @click="searchValue('App\\Models\\Airline')"
            :class="
              search == 'App\\Models\\Airline' ? 'bg-[#ff613c] text-white' : ''
            "
          >
            Airline
          </p>
        </div>
        <div>
          <input
            v-model="searchId"
            type="text"
            class="w-3/5 sm:w-3/5 md:w-[200px] border px-4 py-2 rounded-md shadow focus:ring-0 focus:outline-none text-gray-500"
            placeholder="Search "
          />
        </div>
      </div>
      <div class="mb-5 overflow-auto rounded-lg shadow">
        <div class="grid grid-cols-7 gap-2 py-2 bg-gray-200">
          <div class="py-2 text-sm font-medium tracking-wide text-center">
            Cashiers ID
          </div>
          <div class="py-2 text-sm font-medium tracking-wide text-center">
            CRM ID
          </div>
          <div class="py-2 text-sm font-medium tracking-wide text-center">
            Product Type
          </div>
          <div class="py-2 text-sm font-medium tracking-wide text-center">
            Payment Status
          </div>
          <div class="py-2 text-sm font-medium tracking-wide text-center">
            Reservation Status
          </div>
          <div class="py-2 text-sm font-medium tracking-wide text-center">
            Service Date
          </div>
          <div class="py-2 text-sm font-medium tracking-wide text-center"></div>
        </div>
        <div
          v-show="!loading"
          class="relative group"
          v-for="r in reservations?.data"
          :key="r.id"
        >
          <div
            class="grid grid-cols-7 col-span-7 bg-white divide-y divide-gray-100"
          >
            <div
              class="p-3 mt-2 text-sm text-center text-gray-700 whitespace-nowrap"
            >
              {{ r.past_crm_id }}
            </div>
            <div
              class="grid grid-cols-6 col-span-6 bg-white divide-y divide-gray-100"
              v-for="d in r.items"
              :key="d.id"
            >
              <div
                class="p-3 mt-2 text-sm text-center text-gray-700 whitespace-nowrap"
              >
                {{ d.crm_id }}
              </div>
              <div
                class="p-3 mt-2 text-sm text-center text-gray-700 whitespace-nowrap"
              >
                <p v-if="d.product_type == 'App\\Models\\PrivateVanTour'">
                  PrivateVanTour
                </p>
                <p v-if="d.product_type == 'App\\Models\\GroupTour'">
                  GroupTour
                </p>
                <p v-if="d.product_type == 'App\\Models\\AirportPickup'">
                  Airpot Pickup
                </p>
                <p v-if="d.product_type == 'App\\Models\\EntranceTicket'">
                  Entrance Ticket
                </p>
                <p v-if="d.product_type == 'App\\Models\\Inclusive'">
                  Inclusive
                </p>
                <p v-if="d.product_type == 'App\\Models\\Hotel'">
                  Hotel & Room
                </p>
                <p v-if="d.product_type == 'App\\Models\\Airline'">Airline</p>
              </div>
              <div
                class="p-3 mt-2 text-sm text-center text-gray-700 whitespace-nowrap"
              >
                <p v-if="!d.payment_status || d.payment_status == 'null'">-</p>
                <p
                  v-if="d.payment_status == 'fully_paid'"
                  class="inline-block px-3 py-1 text-xs text-white bg-green-500 rounded-full shadow"
                >
                  {{ d.payment_status }}
                </p>
                <p
                  v-if="d.payment_status == 'not_paid'"
                  class="inline-block px-3 py-1 text-xs text-white bg-red-500 rounded-full shadow"
                >
                  {{ d.payment_status }}
                </p>
                <p
                  v-if="d.payment_status == 'partially_paid'"
                  class="inline-block px-3 py-1 text-xs text-white bg-yellow-500 rounded-full shadow"
                >
                  {{ d.payment_status }}
                </p>
              </div>
              <div class="p-3 mt-2 text-sm text-gray-700 whitespace-nowrap">
                <p v-if="!d.reservation_status">-</p>

                <p
                  v-if="d.reservation_status == 'confirmed'"
                  class="inline-block px-3 py-1 text-xs text-white bg-green-500 rounded-full shadow"
                >
                  {{ d.reservation_status }}
                </p>
                <p
                  v-if="d.reservation_status == 'declined'"
                  class="inline-block px-3 py-1 text-xs text-white bg-red-500 rounded-full shadow"
                >
                  {{ d.reservation_status }}
                </p>
                <p
                  v-if="d.reservation_status == 'awaiting'"
                  class="inline-block px-3 py-1 text-xs text-white bg-yellow-500 rounded-full shadow"
                >
                  {{ d.reservation_status }}
                </p>
              </div>

              <div
                class="p-3 mt-2 text-sm text-center text-gray-700 whitespace-nowrap"
              >
                {{ d.service_date }}
              </div>
              <div class="py-3 pl-10 text-sm text-gray-700 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <!-- <router-link
                    :to="'/reservation/view/' + d.id + '/' + d.crm_id"
                  >
                    <button
                      class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-blue-500 hover:text-white"
                    >
                      <EyeIcon class="w-5 h-5" />
                    </button>
                  </router-link> -->
                  <router-link
                    :to="'/reservation/update/' + d.id + '/' + d.crm_id"
                  >
                    <button
                      class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                    >
                      <PencilSquareIcon class="w-5 h-5" />
                    </button>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="reservations?.data.length == 0"
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
      <!-- pagination -->
      <Pagination
        v-if="!loading"
        :data="reservations"
        @change-page="changePage"
      />
    </div>
  </Layout>
</template>
