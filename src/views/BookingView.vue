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
  FunnelIcon,
  ArrowDownTrayIcon,
} from "@heroicons/vue/24/outline";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import Modal from "../components/Modal.vue";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import { computed, onMounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import { useRouter, useRoute } from "vue-router";
import { useBookingStore } from "../stores/booking";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth";
import { useAdminStore } from "../stores/admin";
import debounce from "lodash/debounce";

const router = useRouter();
const route = useRoute();
const toast = useToast();
const bookingStore = useBookingStore();
const authStore = useAuthStore();
const adminStore = useAdminStore();

const { bookings, loading } = storeToRefs(bookingStore);
const { admin } = storeToRefs(adminStore);

const changePage = async (url) => {
  console.log(url);
  await bookingStore.getChangePage(url, watchSystem.value);
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
      await bookingStore.getListAction(watchSystem.value);
    }
  });
};

const search = ref("");
const searchA = ref("");
const searchArray = [
  { id: 1, name: "all" },
  { id: 2, name: "current" },
  { id: 3, name: "past" },
];
const searchP = ref("");
const searchPayment = [
  { id: 1, name: "all", value: "All" },
  { id: 2, name: "not_paid", value: "Not Paid" },
  { id: 3, name: "partially_paid", value: "Partially Paid" },
  { id: 4, name: "fully_paid", value: "Fully Paid" },
];
const showFilter = ref(false);
const customerName = ref("");
const sale_date_order_by = ref("");
const inclusive_only = ref(false);
const balanceDueDate = ref("");
const bookingStatus = ref("");
const saleDate = ref("");
const createdBy = ref("");
const bookingStatusArr = [
  { id: 1, name: "awaiting" },
  { id: 2, name: "confirmed" },
  { id: 3, name: "declined" },
];

const strippedNumber = (text) => {
  // Split the string by "_", and get the second part (index 1)
  return text.split("_")[1];
};

const limit = ref(10);

const limitedText = (text) => {
  if (text != "") {
    if (text?.length <= 10) {
      return text;
    } else {
      return text?.slice(0, 10);
    }
  }
};

const clearFilter = async () => {
  showFilter.value = false;
  if (!showFilter.value) {
    limit.value = 10;
    search.value = "";
    searchA.value = "";
    searchP.value = "";
    customerName.value = "";
    balanceDueDate.value = "";
    createdBy.value = "";
    bookingStatus.value = "";
    saleDate.value = "";
    sale_date_order_by.value = "";
    inclusive_only.value = false;
  }
  console.log(showFilter.value, "this is showfilter");
  await bookingStore.getListAction(watchSystem.value);
};

const SearchFunction = () => {
  router.push({
    name: `bookings`,
    params: {
      crm_id: search.value ? search.value : "%",
      customer_name: customerName.value ? customerName.value : "%",
      sale_date: saleDate.value ? saleDate.value : "%",
    },
  });
};

const showAgentSearch = ref(false);

// for sale create new version & old version
const showVersion = ref(false);
const showVersionUpdate = ref(false);
const editId = ref("");

const newUpdateHandler = (id) => {
  showVersionUpdate.value = true;
  editId.value = id;
};

const goCreatePage = (data) => {
  if (data == "new") {
    router.push("/bookings/new-create");
  } else {
    router.push("/bookings/create");
  }
};
const goEditPage = (data) => {
  if (data == "old") {
    router.push("/bookings/update/" + editId.value + "/edit");
  } else {
    router.push("/bookings/new-update/" + editId.value);
  }
};

const agentSearchAction = async () => {
  await adminStore.getSimpleListAction();
};

onMounted(async () => {
  await bookingStore.getListAction(watchSystem.value);
  (sale_date_order_by.value = "desc"),
    // console.log(route.params);
    (search.value = route.params.crm_id == "%" ? "" : route.params.crm_id);
  customerName.value =
    route.params.customer_name == "%" ? "" : route.params.customer_name;
  saleDate.value = route.params.sale_date == "%" ? "" : route.params.sale_date;

  console.log(admin.value, "this is admin");
});

const formatDate = (datePut) => {
  const date = new Date(datePut);

  // Get the year, month, and day
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month starts from 0
  const day = String(date.getDate()).padStart(2, "0");

  // Form the formatted date string
  let formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

// const searchParam = ref({});
const watchSystem = computed(() => {
  const result = {};

  if (limit.value != "" && limit.value != undefined) {
    result.limit = limit.value;
  }
  if (search.value != "" && search.value != undefined) {
    result.crm_id = search.value;
  }
  if (createdBy.value != "" && createdBy.value != undefined) {
    result.created_by = createdBy.value;
  }
  if (customerName.value != "" && customerName.value != undefined) {
    result.customer_name = customerName.value;
  }
  if (balanceDueDate.value != "" && balanceDueDate.value != undefined) {
    result.balance_due_date = formatDate(balanceDueDate.value);
  }
  if (bookingStatus.value != "" && bookingStatus.value != undefined) {
    result.booking_status = bookingStatus.value;
  }
  if (saleDate.value != "" && saleDate.value != undefined) {
    result.sale_date = formatDate(saleDate.value);
  }
  if (searchA.value != "" && searchA.value != undefined) {
    result.filter = searchA.value;
  }
  if (searchP.value != "" && searchP.value != undefined) {
    result.status = searchP.value;
  }
  if (sale_date_order_by.value) {
    result.sale_date_order_by = sale_date_order_by.value;
  }
  if (inclusive_only.value) {
    result.inclusive_only = inclusive_only.value;
  }

  console.log(result);
  return result;
});

watch(showAgentSearch, async (newValue) => {
  if (newValue == true) {
    if (admin.value == null) {
      await agentSearchAction();
    }
  }
});

const searchHandler = async () => {
  showFilter.value = true;
  SearchFunction();
  await bookingStore.getListAction(watchSystem.value);
};

const subTotal = (a, b) => {
  if (b != null || !b) {
    return a * 1 + b;
  } else {
    return b;
  }
};

watch(
  [
    searchA,
    sale_date_order_by,
    inclusive_only,
    balanceDueDate,
    bookingStatus,
    saleDate,
    searchP,
    limit,
  ],
  () => {
    showFilter.value = true;
  }
);

watch(
  [search, customerName],
  debounce(async ([newValue, secValue]) => {
    if (newValue || secValue) {
      showFilter.value = true;
      await searchHandler();
    }
  }, 500)
);
</script>

<template>
  <Layout>
    <div class="flex items-center justify-between mb-5">
      <div class="flex justify-start items-center gap-4">
        <h3 class="text-2xl font-medium text-gray-600">Sales List</h3>
        <div class="bg-white/60 px-2 rounded border-2">
          <p class="inline-block mr-2 font-medium text-gray-500">Show</p>
          <select
            v-model="limit"
            class="w-16 h-9 rounded-md focus:outline-none bg-white/60 focus:ring-0"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>
          <p class="inline-block ml-2 font-medium text-gray-500">entries</p>
        </div>
      </div>
      <div class="space-x-3 flex justify-end items-center">
        <Button :leftIcon="FunnelIcon" @click="clearFilter" v-if="showFilter">
          Clear
        </Button>
        <Button :leftIcon="FunnelIcon" @click="searchHandler"> Search </Button>

        <!-- <router-link to="/bookings/create">
          <Button :leftIcon="PlusIcon"> Create </Button>
        </router-link> -->
        <div class="relative">
          <Button :leftIcon="PlusIcon" @click="showVersion = !showVersion">
            Create
          </Button>
        </div>
      </div>
    </div>
    <div class="p-6 mb-5 rounded-lg shadow-sm bg-white/60">
      <!-- search input sort filter -->
      <div class="mb-5">
        <div class="grid grid-cols-4 gap-2">
          <div v-if="authStore.isSuperAdmin">
            <div
              v-if="
                (!admin?.data || admin?.data.length > 10) && !showAgentSearch
              "
              @click="showAgentSearch = true"
              class="text-sm text-gray-500 hover:text-gray-600 border border-gray-300 rounded-md bg-white px-4 py-1.5 w-full flex justify-between items-center"
            >
              <p>select agent</p>
              <ArrowDownTrayIcon class="w-4 h-4" />
            </div>
            <div v-if="admin?.data.length > 10 && showAgentSearch">
              <v-select
                v-model="createdBy"
                class="style-chooser placeholder-sm bg-white rounded-lg w-full text-gray-400"
                :options="admin?.data"
                label="name"
                :clearable="false"
                :reduce="(d) => d.id"
                placeholder="agent ..."
              ></v-select>
            </div>
          </div>
          <div class="">
            <v-select
              v-model="searchP"
              class="style-chooser placeholder-sm bg-white rounded-lg w-full text-gray-400"
              :options="searchPayment"
              label="value"
              :clearable="false"
              :reduce="(d) => d.name"
              placeholder="payment ..."
            ></v-select>
          </div>

          <!-- <div class="">
            <v-select
              v-model="bookingStatus"
              class="style-chooser placeholder-sm text-sm bg-white rounded-lg w-full text-gray-400"
              :options="bookingStatusArr"
              label="name"
              :clearable="false"
              :reduce="(d) => d.name"
              placeholder="booking status ..."
            ></v-select>
          </div> -->
          <div>
            <input
              v-model="search"
              type="text"
              class="w-3/5 sm:w-3/5 h-9 text-sm md:w-full border px-4 py-2 rounded-md focus:ring-0 focus:outline-none text-gray-500"
              placeholder="bookings id.."
            />
          </div>
          <div>
            <input
              v-model="customerName"
              type="text"
              class="h-9 w-3/5 sm:w-3/5 text-sm md:w-full border px-4 py-2 rounded-md focus:ring-0 focus:outline-none text-gray-500"
              placeholder="Customer Name"
            />
          </div>
          <div class="">
            <!-- <input
              v-model="balanceDueDate"
              type="date"
              class="h-9 w-3/5 sm:w-3/5 md:w-full text-md border px-4 py-2 rounded-md shadow-sm focus:ring-0 focus:outline-none text-gray-500"
              placeholder="Search Date"
              title="service_date"
            /> -->
            <VueDatePicker
              v-model="balanceDueDate"
              placeholder="Balance Due Date"
              text-input
            />
          </div>
          <div>
            <!-- <input
              v-model="saleDate"
              type="date"
              class="h-9 w-3/5 sm:w-3/5 md:w-full text-md border px-4 py-2 rounded-md shadow-sm focus:ring-0 focus:outline-none text-gray-500"
              placeholder="Search Date"
              title="sale_date"
            /> -->
            <VueDatePicker
              v-model="saleDate"
              placeholder="Sale Date"
              text-input
            />
          </div>
          <div class="flex justify-start items-center w-full">
            <p class="inline-block mr-2 font-medium text-gray-500">Sorting</p>
            <select
              class="w-full h-9 text-gray-500 border rounded-md focus:outline-none focus:ring-0"
              v-model="sale_date_order_by"
            >
              <option value="desc">Latest to First</option>
              <option value="asc">First to Latest</option>
            </select>
          </div>
          <div class="flex justify-start items-center w-full">
            <input
              type="checkbox"
              name=""
              value=""
              class="w-6 h-6 border-2 rounded-md focus:outline-none focus:ring-0"
              v-model="inclusive_only"
              id=""
            />
            <p class="inline-block ml-2 font-medium text-gray-500">
              Only Inclusive ?
            </p>
          </div>
        </div>
      </div>

      <div class="mb-5 overflow-auto rounded-lg shadow">
        <div class="grid grid-cols-9 gap-2 bg-gray-100">
          <div class="py-2 text-xs font-medium tracking-wide text-center">
            Customer
          </div>
          <div class="py-2 text-xs font-medium tracking-wide text-center">
            Past CRM ID
          </div>
          <div class="py-2 text-xs font-medium tracking-wide text-center">
            CRM ID
          </div>
          <div class="py-2 text-xs font-medium tracking-wide text-center">
            Sale Date
          </div>
          <div class="py-2 text-xs font-medium tracking-wide text-center">
            Payment
          </div>
          <div class="py-2 text-xs font-medium tracking-wide text-center">
            Reservation Status
          </div>
          <div class="py-2 text-xs font-medium tracking-wide text-center">
            Total Sale Amount
          </div>

          <div class="py-2 text-xs font-medium tracking-wide text-center"></div>
        </div>
        <div
          v-show="!loading"
          class="relative divide-y divide-gray-200 group"
          v-for="r in bookings?.data"
          :key="r.id"
        >
          <Disclosure>
            <DisclosureButton class="w-full py-2">
              <div class="grid grid-cols-9 gap-2 bg-white">
                <div class="p-3 text-xs text-gray-700 whitespace-nowrap">
                  {{ r.customer?.name }}
                </div>
                <!-- r.past_crm_id ? r.past_crm_id :  -->
                <div class="p-3 text-xs text-gray-700 whitespace-nowrap">
                  {{ r.past_crm_id ? r.past_crm_id : "-" }}
                </div>
                <div class="p-3 text-xs text-gray-700 whitespace-nowrap">
                  {{ r.crm_id }}
                </div>
                <div class="p-3 text-xs text-gray-700 whitespace-nowrap">
                  {{ r.booking_date }}
                </div>
                <div class="p-3 text-xs text-gray-700 whitespace-nowrap">
                  <p v-if="!r.payment_status">-</p>
                  <p
                    v-if="r.payment_status == 'fully_paid'"
                    class="inline-block px-3 py-1 text-xs text-white bg-green-500 rounded-full shadow"
                  >
                    {{ r.payment_status }}
                  </p>
                  <p
                    v-if="r.payment_status == 'not_paid'"
                    class="inline-block px-3 py-1 text-xs text-white bg-red-500 rounded-full shadow"
                  >
                    {{ r.payment_status }}
                  </p>
                  <p
                    v-if="r.payment_status == 'partially_paid'"
                    class="inline-block px-3 py-1 text-xs text-white bg-yellow-500 rounded-full shadow"
                  >
                    {{ r.payment_status }}
                  </p>
                </div>
                <div class="p-3 text-xs text-gray-700 whitespace-nowrap">
                  <p v-if="!r.reservation_status">-</p>

                  <p
                    v-if="r.reservation_status == 'confirmed'"
                    class="inline-block px-3 py-1 text-xs text-white bg-green-500 rounded-full shadow"
                  >
                    {{ r.reservation_status }}
                  </p>
                  <p
                    v-if="r.reservation_status == 'declined'"
                    class="inline-block px-3 py-1 text-xs text-white bg-red-500 rounded-full shadow"
                  >
                    {{ r.reservation_status }}
                  </p>
                  <p
                    v-if="r.reservation_status == 'awaiting'"
                    class="inline-block px-3 py-1 text-xs text-white bg-yellow-500 rounded-full shadow"
                  >
                    {{ r.reservation_status }}
                  </p>
                </div>
                <div class="p-3 text-xs text-gray-700 whitespace-nowrap">
                  <!-- {{ subTotal(r.sub_total, r.exclude_amount) }} -->
                  {{ r.sub_total }}
                </div>
                <div
                  class="flex items-center justify-end col-span-2 p-3 space-x-2 text-xs text-gray-700 whitespace-nowrap"
                  @click="seenClick"
                >
                  <p
                    class="inline-block px-3 py-2 text-blue-500 transition bg-white rounded shadow hover:bg-blue-500 hover:text-white"
                  >
                    <i class="fa-solid fa-chevron-down"></i>
                  </p>
                  <!-- <router-link :to="'/bookings/update/' + r.id + '/view'">
                    <button
                      class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-blue-500 hover:text-white"
                    >
                      <EyeIcon class="w-5 h-5" />
                    </button>
                  </router-link> -->
                  <!-- <router-link :to="'/bookings/update/' + r.id + '/edit'">
                    <button
                      class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                    >
                      <PencilSquareIcon class="w-5 h-5" />
                    </button>
                  </router-link> -->
                  <!-- <router-link :to="'/bookings/new-update/' + r.id"> -->
                  <button
                    @click="newUpdateHandler(r.id)"
                    class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                  >
                    <PencilSquareIcon class="w-5 h-5" />
                  </button>
                  <!-- </router-link> -->
                  <button
                    v-if="authStore.isSuperAdmin"
                    @click.prevent="onDeleteHandler(r.id)"
                    class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-red-500 hover:text-white"
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
              <DisclosurePanel class="w-full text-gray-500">
                <div class="grid grid-cols-9 gap-2 bg-gray-300">
                  <div
                    class="py-2 text-xs font-medium tracking-wide text-center"
                  >
                    Sale No.
                  </div>
                  <div
                    class="py-2 text-xs font-medium tracking-wide text-center"
                  >
                    Product Type
                  </div>
                  <div
                    class="py-2 text-xs font-medium tracking-wide text-center"
                  >
                    Product Name
                  </div>
                  <div
                    class="py-2 text-xs font-medium tracking-wide text-center"
                  >
                    Variation Name
                  </div>
                  <div
                    class="py-2 text-xs font-medium tracking-wide text-center"
                  >
                    Expense Status
                  </div>
                  <div
                    class="py-2 text-xs font-medium tracking-wide text-center"
                  >
                    Reservation Status
                  </div>

                  <div
                    class="py-2 text-xs font-medium tracking-wide text-center"
                  >
                    Service Date
                  </div>
                </div>
                <div
                  class="grid w-full grid-cols-9 gap-2 bg-gray-100"
                  v-for="d in r.items"
                  :key="d.id"
                >
                  <div
                    class="p-3 text-xs text-center text-gray-700 whitespace-nowrap"
                  >
                    {{ strippedNumber(d.crm_id) }}
                  </div>
                  <div
                    class="p-3 text-xs text-center text-gray-700 whitespace-nowrap"
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
                      Hotel / Roam
                    </p>
                    <p v-if="d.product_type == 'App\\Models\\Airline'">
                      Airline
                    </p>
                  </div>
                  <div
                    class="p-3 text-xs text-center text-gray-700 whitespace-nowrap"
                  >
                    <p>{{ limitedText(d.product?.name) }}</p>
                  </div>
                  <div
                    class="p-3 text-xs text-center text-gray-700 whitespace-nowrap"
                  >
                    <p v-if="d.car?.name">{{ limitedText(d.car?.name) }}</p>
                    <p v-if="d.variation?.name">
                      {{ limitedText(d.variation?.name) }}
                    </p>
                    <p v-if="d.room?.name">{{ limitedText(d.room?.name) }}</p>
                  </div>
                  <div
                    class="p-3 text-xs text-center text-gray-700 whitespace-nowrap"
                  >
                    <p v-if="!d.payment_status || d.payment_status == 'null'">
                      -
                    </p>
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
                  <div
                    class="p-3 text-xs text-center text-gray-700 whitespace-nowrap"
                  >
                    <p
                      v-if="
                        !d.reservation_status || d.reservation_status == 'null'
                      "
                    >
                      -
                    </p>

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
                    class="p-3 text-xs text-center text-gray-700 whitespace-nowrap"
                  >
                    {{ d.service_date }}
                  </div>
                  <div></div>
                  <div
                    class="col-span-1 p-3 text-xs text-center text-gray-700 whitespace-nowrap"
                  >
                    <router-link
                      :to="'/reservation/update/' + d.id + '/' + d.crm_id"
                    >
                      <button
                        class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-blue-500 hover:text-white"
                      >
                        <PencilSquareIcon class="w-5 h-5" />
                      </button>
                    </router-link>
                  </div>
                  <div
                    class="col-span-2 py-3 pl-10 text-xs text-gray-700 whitespace-nowrap"
                  ></div>
                </div>
              </DisclosurePanel>
            </transition>
          </Disclosure>
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
      <Pagination v-if="!loading" :data="bookings" @change-page="changePage" />
    </div>
    <Modal :isOpen="showVersion" @closeModal="showVersion = false">
      <DialogPanel
        class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-5"
        >
          select version controll !
        </DialogTitle>
        <div class="space-y-2">
          <div>
            <Button
              :leftIcon="PlusIcon"
              class="w-full"
              @click="goCreatePage('new')"
            >
              <p class="text-xs w-full whitespace-nowrap">
                New Version (recommended)
              </p>
            </Button>
          </div>
          <div>
            <Button
              class="w-full bg-gray-500"
              :leftIcon="PlusIcon"
              @click="goCreatePage('old')"
            >
              <p class="text-xs w-full whitespace-nowrap">
                Old Version (stable)
              </p>
            </Button>
          </div>
        </div>
      </DialogPanel>
    </Modal>
    <Modal :isOpen="showVersionUpdate" @closeModal="showVersionUpdate = false">
      <DialogPanel
        class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-5"
        >
          select version controll !
        </DialogTitle>
        <div class="space-y-2">
          <div>
            <Button
              :leftIcon="PlusIcon"
              class="w-full"
              @click="goEditPage('new')"
            >
              <p class="text-xs w-full whitespace-nowrap">
                New Version Edit (recommended)
              </p>
            </Button>
          </div>
          <div>
            <Button
              class="w-full bg-gray-500"
              :leftIcon="PlusIcon"
              @click="goEditPage('old')"
            >
              <p class="text-xs w-full whitespace-nowrap">
                Old Version Edit (stable)
              </p>
            </Button>
          </div>
        </div>
      </DialogPanel>
    </Modal>
  </Layout>
</template>

<style>
.focus\:ring-0:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
    var(--tw-ring-offset-width) #ff613c;
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
    calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
    var(--tw-shadow, 0 0 #0000);
}
</style>
