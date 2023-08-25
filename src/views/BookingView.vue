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

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import { onMounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import { useRouter } from "vue-router";
import { useBookingStore } from "../stores/booking";
import { storeToRefs } from "pinia";

const router = useRouter();
const toast = useToast();
const bookingStore = useBookingStore();

const { bookings, loading } = storeToRefs(bookingStore);

const changePage = async (url) => {
  console.log(url);
  await bookingStore.getChangePage(url);
};
const errors = ref([]);
const onDeleteHandler = async (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await bookingStore.deleteAction(id);
        toast.success(response.message);
      } catch (error) {
        console.log(
          "🚀 ~ file: BlogView.vue:65 ~ onDeleteHandler ~ error:",
          error
        );
        if (error.response.data.errors) {
          errors.value = error.response.data.errors;
        }
        toast.error(error.response.data.message);
      }
      await bookingStore.getListAction();
    }
  });
};

const search = ref("");

onMounted(async () => {
  await bookingStore.getListAction();
});

watch(search, async (newValue) => {
  await bookingStore.getListAction({ search: search.value });
});
</script>

<template>
  <Layout>
    <div class="mb-5 flex items-center justify-between">
      <h3 class="text-2xl font-medium text-gray-600">Sales List</h3>
      <div class="space-x-3">
        <router-link to="/bookings/create">
          <Button :leftIcon="PlusIcon" @click="CustomerCreate"> Create </Button>
        </router-link>
      </div>
    </div>
    <div class="bg-white/60 p-6 rounded-lg shadow-sm mb-5">
      <!-- search input sort filter -->
      <div class="flex items-center justify-between mb-5">
        <div class="">
          <input
            v-model="search"
            type="text"
            class="w-3/5 sm:w-3/5 md:w-[300px] mr-3 border px-4 py-2 rounded-md shadow focus:ring-0 focus:outline-none text-gray-500"
            placeholder="Search for bookings.."
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
      <!-- <div class="overflow-auto rounded-lg shadow mb-5">
        <table class="w-full">
          <thead class="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th class="w-20 p-3 text-sm font-medium tracking-wide text-left">
                No.
              </th>
              <th class="w-30 p-3 text-sm font-medium tracking-wide text-left">
                Customer
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
                Booking Date
              </th>
              <th class="w-30 p-3 text-sm font-medium tracking-wide text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="r in bookings?.data"
              :key="r.id"
              class="bg-white even:bg-gray-50 hover:bg-gray-50"
            >
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                {{ r.id }}
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                {{ r.customer.name }}
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                {{ r.crm_id }}
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                <p
                  v-if="r.payment_status == 'fully_paid'"
                  class="bg-green-500 rounded-full px-3 py-1 inline-block text-white shadow"
                >
                  {{ r.payment_status }}
                </p>
                <p
                  v-if="r.payment_status == 'not_paid'"
                  class="bg-red-500 rounded-full px-3 py-1 inline-block text-white shadow"
                >
                  {{ r.payment_status }}
                </p>
                <p
                  v-if="r.payment_status == 'partially_paid'"
                  class="bg-yellow-500 rounded-full px-3 py-1 inline-block text-white shadow"
                >
                  {{ r.payment_status }}
                </p>
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                {{ r.reservation_status }}
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                {{ r.booking_date }}
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <router-link :to="'/bookings/update/' + r.id + '/view'">
                    <button
                      class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-blue-500 hover:text-white"
                    >
                      <EyeIcon class="w-5 h-5" />
                    </button>
                  </router-link>
                  <router-link :to="'/bookings/update/' + r.id + '/edit'">
                    <button
                      class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                    >
                      <PencilSquareIcon class="w-5 h-5" />
                    </button>
                  </router-link>
                  <button
                    @click.prevent="onDeleteHandler(r.id)"
                    class="hover:bg-red-500 p-2 bg-white text-blue-500 transition shadow rounded hover:text-white"
                  >
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div> -->
      <div class="overflow-auto rounded-lg shadow mb-5">
        <div class="grid grid-cols-7 gap-2 bg-gray-100">
          <div class="text-center text-sm font-medium tracking-wide py-2">
            Customer
          </div>
          <div class="text-center text-sm font-medium tracking-wide py-2">
            CRM ID
          </div>
          <div class="text-center text-sm font-medium tracking-wide py-2">
            Payment Status
          </div>
          <div class="text-center text-sm font-medium tracking-wide py-2">
            Reservation Status
          </div>
          <div class="text-center text-sm font-medium tracking-wide py-2">
            Booking Date
          </div>
          <div class="text-center text-sm font-medium tracking-wide py-2"></div>
        </div>
        <div
          v-show="!loading"
          class="divide-y divide-gray-200 group relative"
          v-for="r in bookings?.data"
          :key="r.id"
        >
          <Disclosure>
            <DisclosureButton class="py-2 w-full">
              <div class="grid grid-cols-7 gap-2 bg-white">
                <div class="p-3 text-sm text-gray-700 whitespace-nowrap">
                  {{ r.customer.name }}
                </div>
                <div class="p-3 text-sm text-gray-700 whitespace-nowrap">
                  {{ r.crm_id }}
                </div>
                <div class="p-3 text-sm text-gray-700 whitespace-nowrap">
                  <p
                    v-if="r.payment_status == 'fully_paid'"
                    class="bg-green-500 rounded-full px-3 py-1 inline-block text-white shadow text-xs"
                  >
                    {{ r.payment_status }}
                  </p>
                  <p
                    v-if="r.payment_status == 'not_paid'"
                    class="bg-red-500 rounded-full px-3 py-1 inline-block text-white shadow text-xs"
                  >
                    {{ r.payment_status }}
                  </p>
                  <p
                    v-if="r.payment_status == 'partially_paid'"
                    class="bg-yellow-500 rounded-full px-3 py-1 inline-block text-white shadow text-xs"
                  >
                    {{ r.payment_status }}
                  </p>
                </div>
                <div class="p-3 text-sm text-gray-700 whitespace-nowrap">
                  <p v-if="r.reservation_status != 'null'">
                    {{ r.reservation_status }}
                  </p>
                  <p v-if="r.reservation_status == 'null'">-</p>
                </div>

                <div class="p-3 text-sm text-gray-700 whitespace-nowrap">
                  {{ r.booking_date }}
                </div>
                <div
                  class="p-3 text-sm space-x-2 col-span-2 flex justify-center items-center text-gray-700 whitespace-nowrap"
                  @click="seenClick"
                >
                  <p
                    class="py-2 px-3 text-blue-500 transition bg-white rounded shadow hover:bg-blue-500 hover:text-white inline-block"
                  >
                    <i class="fa-solid fa-chevron-down"></i>
                  </p>
                  <router-link :to="'/bookings/update/' + r.id + '/view'">
                    <button
                      class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-blue-500 hover:text-white"
                    >
                      <EyeIcon class="w-5 h-5" />
                    </button>
                  </router-link>
                  <router-link :to="'/bookings/update/' + r.id + '/edit'">
                    <button
                      class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                    >
                      <PencilSquareIcon class="w-5 h-5" />
                    </button>
                  </router-link>
                  <button
                    @click.prevent="onDeleteHandler(r.id)"
                    class="hover:bg-red-500 p-2 bg-white text-blue-500 transition shadow rounded hover:text-white"
                  >
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </DisclosureButton>
            <transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-out"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <DisclosurePanel class="text-gray-500 w-full">
                <div
                  class="grid grid-cols-7 gap-2 bg-gray-100"
                  v-for="d in r.items"
                  :key="d.id"
                >
                  <div
                    class="p-3 text-sm text-center text-gray-700 whitespace-nowrap"
                  ></div>
                  <div
                    class="p-3 text-sm text-center text-gray-700 whitespace-nowrap"
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
                  </div>
                  <div
                    class="p-3 text-sm text-center text-gray-700 whitespace-nowrap"
                  >
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
                    class="p-3 text-sm text-center text-gray-700 whitespace-nowrap"
                  >
                    <p v-if="d.reservation_status != 'null'">
                      {{ d.reservation_status }}
                    </p>
                  </div>

                  <div
                    class="p-3 text-sm text-center text-gray-700 whitespace-nowrap"
                  >
                    {{ d.service_date }}
                  </div>
                  <div
                    class="py-3 pl-10 col-span-2 text-sm text-gray-700 whitespace-nowrap"
                  ></div>
                </div>
              </DisclosurePanel>
            </transition>
          </Disclosure>
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
      <Pagination v-if="!loading" :data="bookings" @change-page="changePage" />
    </div>
  </Layout>
</template>
