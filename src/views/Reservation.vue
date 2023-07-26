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

const search = ref("");

onMounted(async () => {
  await reservationStore.getListAction();
});

watch(search, async (newValue) => {
  await reservationStore.getListAction({ search: search.value });
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
        <div class="">
          <input
            v-model="search"
            type="text"
            class="w-3/5 sm:w-3/5 md:w-[300px] mr-3 border px-4 py-2 rounded-md shadow focus:ring-0 focus:outline-none text-gray-500"
            placeholder="Search for Reservation.."
          />
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
        <table class="w-full">
          <thead class="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th class="w-20 p-3 text-sm font-medium tracking-wide text-left">
                No.
              </th>
              <th class="p-3 text-sm font-medium tracking-wide text-left">
                CRM ID
              </th>
              <th class="p-3 text-sm font-medium tracking-wide text-left">
                Payment Status
              </th>
              <th class="p-3 text-sm font-medium tracking-wide text-left">
                Reservation Status
              </th>
              <th class="p-3 text-sm font-medium tracking-wide text-left">
                Service Date
              </th>
              <th class="w-30 p-3 text-sm font-medium tracking-wide text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="r in reservations?.data"
              :key="r.id"
              class="bg-white even:bg-gray-50 hover:bg-gray-50"
            >
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                {{ r.id }}
              </td>

              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                {{ r.booking.crm_id }}
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                <p
                  v-if="r.payment_status == 'Fully paid'"
                  class="bg-green-500 rounded-full px-3 py-1 inline-block text-white shadow"
                >
                  {{ r.payment_status }}
                </p>
                <p
                  v-if="r.payment_status == 'Not paid'"
                  class="bg-red-500 rounded-full px-3 py-1 inline-block text-white shadow"
                >
                  {{ r.payment_status }}
                </p>
                <p
                  v-if="r.payment_status == 'partially paid'"
                  class="bg-yellow-500 rounded-full px-3 py-1 inline-block text-white shadow"
                >
                  {{ r.payment_status }}
                </p>
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                <p v-if="r.reservation_status != 'null'">
                  {{ r.reservation_status }}
                </p>
                <p v-if="r.reservation_status == 'null'">-</p>
              </td>

              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                {{ r.service_date }}
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <router-link :to="'/reservation/update/' + r.id">
                    <button
                      class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-blue-500 hover:text-white"
                    >
                      <EyeIcon class="w-5 h-5" />
                    </button>
                  </router-link>
                  <router-link :to="'/reservation/update/' + r.id">
                    <button
                      class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                    >
                      <PencilSquareIcon class="w-5 h-5" />
                    </button>
                  </router-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
