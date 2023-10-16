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
import { computed, onMounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import { useRouter } from "vue-router";
import { useReservationStore } from "../stores/reservation";
import { useAdminStore } from "../stores/admin";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const toast = useToast();
const reservationStore = useReservationStore();
const adminStore = useAdminStore();
const authStore = useAuthStore();

const { reservations, loading } = storeToRefs(reservationStore);
const { admin } = storeToRefs(adminStore);

const changePage = async (url) => {
  await reservationStore.getChangePage(url, watchSystem.value);
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
// these are search function part
const search = ref("");
const searchId = ref("");
const seen = ref(true);
const seenClick = () => {
  seen.value = !seen.value;
};

const limitedText = (text) => {
  if (text != "") {
    if (text?.length <= 10) {
      return text;
    } else {
      return text?.slice(0, 10);
    }
  }
};

const searchValue = (val) => {
  search.value = val;
};

const searchA = ref("");
const userFilter = ref(null);
const limit = ref(10);
const searchArray = [
  { id: 1, name: "all" },
  { id: 2, name: "current" },
  { id: 3, name: "past" },
];

onMounted(async () => {
  await reservationStore.getListAction(watchSystem.value);
  await adminStore.getSimpleListAction();
});

const watchSystem = computed(() => {
  const result = {};

  if (limit.value != "" && limit.value != undefined) {
    result.limit = limit.value;
  }

  if (authStore.isSuperAdmin || authStore.isReservation) {
    result.user_id = "";
  } else {
    result.user_id = authStore.user.id;
  }
  if (search.value != "" && search.value != undefined) {
    result.product_type = search.value;
  }
  if (searchId.value != "" && searchId.value != undefined) {
    result.crm_id = searchId.value;
  }
  if (searchA.value != "" && searchA.value != undefined) {
    result.filter = searchA.value;
  }
  if (userFilter.value != undefined) {
    result.user_id = userFilter.value;
  }

  console.log(result);
  return result;
});

watch(search, async (newValue) => {
  await reservationStore.getListAction(watchSystem.value);
});
watch(limit, async (newValue) => {
  await reservationStore.getListAction(watchSystem.value);
});
watch(searchId, async (newValue) => {
  await reservationStore.getListAction(watchSystem.value);
});
watch(searchA, async (newValue) => {
  await reservationStore.getListAction(watchSystem.value);
});
watch(userFilter, async (newValue) => {
  await reservationStore.getListAction(watchSystem.value);
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
            class="text-xs px-4 cursor-pointer hover:bg-[#ff613c] hover:text-white shadow-md py-2 border border-gray-200 rounded"
            @click="searchValue('')"
            :class="search == '' ? 'bg-[#ff613c] text-white' : ''"
          >
            All
          </p>
          <p
            class="text-xs px-4 cursor-pointer hover:bg-[#ff613c] hover:text-white shadow-md py-2 border border-gray-200 rounded"
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
            class="text-xs px-4 cursor-pointer hover:bg-[#ff613c] hover:text-white shadow-md py-2 border border-gray-200 rounded"
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
            class="text-xs px-4 cursor-pointer hover:bg-[#ff613c] hover:text-white shadow-md py-2 border border-gray-200 rounded"
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
            class="text-xs px-4 cursor-pointer hover:bg-[#ff613c] hover:text-white shadow-md py-2 border border-gray-200 rounded"
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
            class="text-xs px-4 cursor-pointer hover:bg-[#ff613c] hover:text-white shadow-md py-2 border border-gray-200 rounded"
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
            class="text-xs px-4 cursor-pointer hover:bg-[#ff613c] hover:text-white shadow-md py-2 border border-gray-200 rounded"
            @click="searchValue('App\\Models\\Hotel')"
            :class="
              search == 'App\\Models\\Hotel' ? 'bg-[#ff613c] text-white' : ''
            "
          >
            Hotel
          </p>
          <p
            class="text-xs px-4 cursor-pointer hover:bg-[#ff613c] hover:text-white shadow-md py-2 border border-gray-200 rounded"
            @click="searchValue('App\\Models\\Airline')"
            :class="
              search == 'App\\Models\\Airline' ? 'bg-[#ff613c] text-white' : ''
            "
          >
            Airline
          </p>
        </div>
      </div>
      <div class="flex items-center justify-start mb-5 space-x-3">
        <div class="" v-if="authStore.isSuperAdmin || authStore.isReservation">
          <select
            name=""
            id=""
            v-model="userFilter"
            v-if="admin"
            class="px-2 py-2 focus:border-gray-300 border border-gray-300 placeholder-sm bg-white rounded-lg w-[200px] text-gray-400 space-y-2"
          >
            <option :value="null" disabled class="bg-gray-200 text-sm">
              Filter By User
            </option>
            <option value="" class="text-sm">All User</option>
            <option
              :value="key.id"
              v-for="(key, index) in admin"
              :key="index"
              class="text-sm"
            >
              {{ key.name }}
            </option>
          </select>
        </div>
        <div class="">
          <v-select
            v-model="searchA"
            class="style-chooser placeholder-sm bg-white rounded-lg w-[200px] text-gray-400"
            :options="searchArray"
            label="name"
            :clearable="false"
            :reduce="(d) => d.name"
            placeholder="choose Filter ..."
          ></v-select>
        </div>
        <div>
          <input
            v-model="searchId"
            type="text"
            class="w-3/5 sm:w-3/5 md:w-[200px] border px-4 py-2 rounded-md shadow focus:ring-0 focus:outline-none text-gray-500"
            placeholder="Search "
          />
        </div>
        <div>
          <p class="inline-block mr-2 text-xs font-medium text-gray-500">
            Show
          </p>
          <select
            v-model="limit"
            class="w-16 p-2 text-xs border-2 rounded-md focus:outline-none focus:ring-0"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>
          <p class="inline-block ml-2 text-xs font-medium text-gray-500">
            entries
          </p>
        </div>
      </div>
      <div class="w-auto mb-5 overflow-scroll bg-white rounded-lg shadow">
        <div class="grid grid-cols-8 gap-2 py-2">
          <div
            class="py-2 text-xs font-medium tracking-wide text-center min-w-[200px] overflow-hidden"
          >
            CRM ID
          </div>
          <div
            class="py-2 text-xs font-medium tracking-wide text-center min-w-[200px] overflow-hidden"
          >
            PAST CRM ID
          </div>
          <div
            class="py-2 text-xs font-medium tracking-wide text-center min-w-[200px] overflow-hidden"
          >
            Product Type
          </div>
          <div
            class="py-2 text-xs font-medium tracking-wide text-center min-w-[200px] overflow-hidden"
          >
            Product Name
          </div>
          <div
            class="py-2 text-xs font-medium tracking-wide text-center min-w-[200px] overflow-hidden"
          >
            Variation Name
          </div>
          <div
            class="py-2 text-xs font-medium tracking-wide text-center min-w-[200px] overflow-hidden"
          >
            Payment Status
          </div>
          <div
            class="py-2 text-xs font-medium tracking-wide text-center min-w-[200px] overflow-hidden"
          >
            Reservation Status
          </div>
          <div
            class="py-2 text-xs font-medium tracking-wide text-center min-w-[200px] overflow-hidden"
          >
            Service Date
          </div>
          <div
            class="py-2 text-xs font-medium tracking-wide text-center min-w-[200px] overflow-hidden"
          ></div>
        </div>
        <div
          v-show="!loading"
          class="relative group"
          v-for="d in reservations?.data"
          :key="d.id"
        >
          <div
            class="grid w-auto grid-cols-8 col-span-8 bg-white divide-y divide-gray-100"
          >
            <!-- <div
              class="col-span-6 px-3 py-1 mt-2 text-xs text-center text-gray-700 bg-gray-300 whitespace-nowrap"
              v-if="r.past_crm_id"
            >
              Cashiers CRM ID - {{ r.past_crm_id }}
            </div>
            <div
              class="col-span-6 px-3 py-1 mt-2 text-xs text-center text-gray-700 bg-gray-300 whitespace-nowrap"
              v-else
            >
              Current Reservation
            </div> -->

            <div
              class="p-3 mt-2 text-xs text-center text-gray-700 whitespace-nowrap min-w-[200px] overflow-hidden"
            >
              {{ d.crm_id }}
            </div>
            <div
              class="p-3 mt-2 text-xs text-center text-gray-700 whitespace-nowrap min-w-[200px] overflow-hidden"
            >
              <p v-if="d.booking?.past_crm_id">{{ d.booking?.past_crm_id }}</p>
              <p v-if="!d.booking?.past_crm_id">-</p>
            </div>
            <div
              class="p-3 mt-2 text-xs text-center text-gray-700 whitespace-nowrap min-w-[200px] overflow-hidden"
            >
              <p v-if="d.product_type == 'App\\Models\\PrivateVanTour'">
                PrivateVanTour
              </p>
              <p v-if="d.product_type == 'App\\Models\\GroupTour'">GroupTour</p>
              <p v-if="d.product_type == 'App\\Models\\AirportPickup'">
                Airpot Pickup
              </p>
              <p v-if="d.product_type == 'App\\Models\\EntranceTicket'">
                Entrance Ticket
              </p>
              <p v-if="d.product_type == 'App\\Models\\Inclusive'">Inclusive</p>
              <p v-if="d.product_type == 'App\\Models\\Hotel'">Hotel & Room</p>
              <p v-if="d.product_type == 'App\\Models\\Airline'">Airline</p>
            </div>
            <div
              class="p-3 mt-2 text-xs text-center text-gray-700 whitespace-nowrap min-w-[200px] overflow-hidden"
            >
              <!-- {{ limitedText(d.product?.name) }} -->
              {{ limitedText(d.product?.name) }}
            </div>
            <div
              class="p-3 mt-2 text-xs text-center text-gray-700 whitespace-nowrap min-w-[200px] overflow-hidden"
            >
              <p v-if="d.car?.name">{{ limitedText(d.car?.name) }}</p>
              <p v-if="d.variation?.name">
                {{ limitedText(d.variation?.name) }}
              </p>
              <p v-if="d.room?.name">{{ limitedText(d.room?.name) }}</p>
            </div>
            <div
              class="p-3 mt-2 text-xs text-center text-gray-700 whitespace-nowrap min-w-[200px] overflow-hidden"
            >
              <p v-if="!d.payment_status || d.payment_status == 'null'">-</p>
              <p
                v-if="d.payment_status == 'fully_paid'"
                class="inline-block px-3 py-1 mt-2 text-xs text-white bg-green-500 rounded-full shadow"
              >
                {{ d.payment_status }}
              </p>
              <p
                v-if="d.payment_status == 'not_paid'"
                class="inline-block px-3 py-1 mt-2 text-xs text-white bg-red-500 rounded-full shadow"
              >
                {{ d.payment_status }}
              </p>
              <p
                v-if="d.payment_status == 'partially_paid'"
                class="inline-block px-3 py-1 mt-2 text-xs text-white bg-yellow-500 rounded-full shadow"
              >
                {{ d.payment_status }}
              </p>
            </div>
            <div
              class="p-3 mt-2 text-xs text-gray-700 flex justify-center items-center whitespace-nowrap min-w-[200px] overflow-hidden"
            >
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
              class="p-3 mt-2 text-xs text-center bg-white divide-y divide-gray-100 text-gray-700 whitespace-nowrap min-w-[200px] overflow-hidden flex justify-end items-center"
            >
              <p class="mr-6">{{ d.service_date }}</p>
              <router-link
                :to="
                  '/reservation/update/' +
                  d.id +
                  '/' +
                  d.crm_id +
                  '/' +
                  d.booking?.past_crm_id
                "
              >
                <button
                  class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                >
                  <PencilSquareIcon class="w-5 h-5" />
                </button>
              </router-link>
            </div>
            <!-- <div
                class="py-3 pl-10 text-xs text-gray-700 whitespace-nowrap min-w-[200px] overflow-hidden"
              >
                <div class="flex items-center gap-2"> -->
            <!-- <router-link
                    :to="'/reservation/view/' + d.id + '/' + d.crm_id"
                  >
                    <button
                      class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-blue-500 hover:text-white"
                    >
                      <EyeIcon class="w-5 h-5" />
                    </button>
                  </router-link> -->

            <!-- </div>
              </div> -->
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
