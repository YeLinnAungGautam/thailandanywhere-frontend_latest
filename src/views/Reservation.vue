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
  console.log(reservations.value.data.length, "this is reservations");
});
</script>

<template>
  <Layout>
    <div class="mb-5 flex items-center justify-between">
      <h3 class="text-2xl font-medium text-gray-600">Reservation Lists</h3>
    </div>
    <div class="bg-white/60 p-6 rounded-lg shadow-sm mb-5">
      <!-- search input sort filter -->
      <div class="flex items-center justify-between mb-5">
        <!-- <v-select
          v-model="search"
          class="style-chooser text-xs py-2 w-[350px]"
          :options="product_type"
          label="name"
          :clearable="false"
          :reduce="(d) => d.type"
          @option:selected="chooseType"
          placeholder="please choose product type"
        ></v-select> -->
        <div class="space-x-2 flex justify-start items-center gap-2">
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
        </div>
        <div>
          <p class="inline-block mr-2 text-gray-500 font-medium">Show</p>
          <select
            class="border-2 p-2 rounded-md w-16 focus:outline-none focus:ring-0"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>
          <p class="inline-block ml-2 text-gray-500 font-medium">entries</p>
        </div>
      </div>
      <div class="overflow-auto rounded-lg shadow mb-5">
        <div class="grid grid-cols-6 gap-2 bg-gray-200 py-2">
          <div class="text-center text-sm font-medium tracking-wide py-2">
            CRM ID
          </div>
          <div class="text-center text-sm font-medium tracking-wide py-2">
            Product Type
          </div>
          <div class="text-center text-sm font-medium tracking-wide py-2">
            Payment Status
          </div>
          <div class="text-center text-sm font-medium tracking-wide py-2">
            Reservation Status
          </div>
          <div class="text-center text-sm font-medium tracking-wide py-2">
            Service Date
          </div>
          <div class="text-center text-sm font-medium tracking-wide py-2"></div>
        </div>
        <div
          v-show="!loading"
          class="group relative"
          v-for="r in reservations?.data"
          :key="r.id"
        >
          <div class="">
            <div
              class="grid grid-cols-6 col-span-6 divide-y divide-gray-100 bg-white"
              v-for="d in r.items"
              :key="d.id"
            >
              <div
                class="p-3 text-sm mt-2 text-center text-gray-700 whitespace-nowrap"
              >
                {{ d.crm_id }}
              </div>
              <div
                class="p-3 text-sm mt-2 text-center text-gray-700 whitespace-nowrap"
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
              </div>
              <div
                class="p-3 text-sm mt-2 text-center text-gray-700 whitespace-nowrap"
              >
                <p v-if="!d.payment_status || d.payment_status == 'null'">-</p>
                <p
                  v-if="d.payment_status == 'fully_paid'"
                  class="bg-green-500 rounded-full px-3 py-1 inline-block text-white shadow text-xs"
                >
                  {{ d.payment_status }}
                </p>
                <p
                  v-if="d.payment_status == 'not_paid'"
                  class="bg-red-500 rounded-full px-3 py-1 inline-block text-white shadow text-xs"
                >
                  {{ d.payment_status }}
                </p>
                <p
                  v-if="d.payment_status == 'partially_paid'"
                  class="bg-yellow-500 rounded-full px-3 py-1 inline-block text-white shadow text-xs"
                >
                  {{ d.payment_status }}
                </p>
              </div>
              <div
                class="p-3 text-sm mt-2 text-center text-gray-700 whitespace-nowrap"
              >
                <p
                  v-if="!d.reservation_status || d.reservation_status == 'null'"
                >
                  -
                </p>
                <p
                  v-if="d.reservation_status == 'reserved'"
                  class="bg-green-500 rounded-full px-3 py-1 inline-block text-white shadow text-xs"
                >
                  {{ d.reservation_status }}
                </p>
                <p
                  v-if="d.reservation_status == 'declined'"
                  class="bg-red-500 rounded-full px-3 py-1 inline-block text-white shadow text-xs"
                >
                  {{ d.reservation_status }}
                </p>
                <p
                  v-if="d.reservation_status == 'awaiting_payment'"
                  class="bg-yellow-500 rounded-full px-3 py-1 inline-block text-white shadow text-xs"
                >
                  {{ d.reservation_status }}
                </p>
              </div>

              <div
                class="p-3 text-sm mt-2 text-center text-gray-700 whitespace-nowrap"
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
          class="flex justify-center items-center py-20"
        >
          Data Empty ...
        </div>
        <div v-if="loading" class="flex justify-center items-center py-20">
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
