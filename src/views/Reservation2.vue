<script setup>
import { storeToRefs } from "pinia";
import { useReservationStore } from "../stores/reservation";
import Layout from "./Layout.vue";
import ListReservation from "./Reservation2Component/ListReservation.vue";
import ReservationCartLoadingVue from "./Dashboard/ReservationCartLoading.vue";
import { onMounted, ref, watch, computed } from "vue";
import { ArrowsUpDownIcon, FunnelIcon } from "@heroicons/vue/24/outline";
import ReservationDetail from "./Reservation2Component/ReservationDetail.vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter, useRoute } from "vue-router";
const reservationStore = useReservationStore();
const { reservations, loading } = storeToRefs(reservationStore);
const authStore = useAuthStore();

const router = useRouter();
const route = useRoute();

// filter keys
const limit = ref(10);
const search = ref("");
const searchId = ref("");
const oldCrmId = ref("");
const bookingStatus = ref("");
const expenseStatus = ref("");
const hotel_name = ref("");
const attraction_name = ref("");
const customerPaymentStatus = ref("");
const searchA = ref("");
const userFilter = ref("");
const searchReservation = ref("");
const dateRange = ref(null);
const searchTime = ref("");
const empty_unit_cost = ref("");
const booking_date = ref("");
const sale_daterange = ref(null);
const booking_daterange = ref(null);
const customer_name = ref("");
const sorting = ref("");
const dateOnlyToggle = ref(false);

// format action
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

const setStartAndEndDate = () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Add 90 days to startOfMonth to get the end date
  const endOfMonth = new Date(startOfMonth); // Create a copy of startOfMonth
  endOfMonth.setDate(endOfMonth.getDate() + 90);

  dateRange.value = [startOfMonth, endOfMonth];
};

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
  } else {
    search.value = "App\\Models\\EntranceTicket";
    result.product_type = "App\\Models\\EntranceTicket";
  }
  if (searchId.value != "" && searchId.value != undefined) {
    result.crm_id = searchId.value;
  }
  if (oldCrmId.value != "" && oldCrmId.value != undefined) {
    result.old_crm_id = oldCrmId.value;
  }
  if (bookingStatus.value != "" && bookingStatus.value != undefined) {
    result.booking_status = bookingStatus.value;
  }
  if (expenseStatus.value != "" && expenseStatus.value != undefined) {
    result.expense_status = expenseStatus.value;
  }
  if (hotel_name.value != "" && hotel_name.value != undefined) {
    result.hotel_name = hotel_name.value;
  }
  if (attraction_name.value != "" && attraction_name.value != undefined) {
    result.attraction_name = attraction_name.value;
  }
  if (
    customerPaymentStatus.value != "" &&
    customerPaymentStatus.value != undefined
  ) {
    result.customer_payment_status = customerPaymentStatus.value;
  }
  if (searchA.value != "" && searchA.value != undefined) {
    result.filter = searchA.value;
  }
  if (searchReservation.value != "" && searchReservation.value != undefined) {
    result.reservation_status = searchReservation.value;
  }
  if (
    searchTime.value != "" &&
    searchTime.value != undefined &&
    dateOnlyToggle.value
  ) {
    result.service_date = formatDate(searchTime.value);
  }
  if (empty_unit_cost.value != "" && empty_unit_cost.value != false) {
    result.empty_unit_cost = empty_unit_cost.value;
  }
  if (
    booking_date.value != "" &&
    booking_date.value != undefined &&
    dateOnlyToggle.value
  ) {
    result.booking_date = formatDate(booking_date.value);
  }
  if (sale_daterange.value != undefined && !dateOnlyToggle.value) {
    result.sale_daterange = sale_daterange.value;
  }
  if (booking_daterange.value != undefined && !dateOnlyToggle.value) {
    result.booking_daterange = booking_daterange.value;
  }
  if (userFilter.value != undefined) {
    result.user_id = userFilter.value;
  }

  if (customer_name.value != "" && customer_name.value != null) {
    result.order_by = customer_name.value;
  } else {
    result.order_by = "";
  }
  if (sorting.value != "") {
    result.order_direction = sorting.value;
  }

  console.log(result);
  return result;
});

const detailId = ref("");
const getDetailAction = async (id) => {
  detailId.value = id;
  router.push({
    name: "reservation-second",
    query: {
      id: detailId.value,
    },
  });
};

onMounted(async () => {
  if (route.query.id) {
    detailId.value = route.query.id;
  }
  console.log(reservations.value);
  setStartAndEndDate();
});

watch(dateRange, async (newValue) => {
  console.log(dateRange.value, "this is date");
  if (dateRange.value != "" && dateRange.value != null) {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };

    // Custom function to format date as dd-MM-yyyy
    const formatDateAsDDMMYYYY = (date) => {
      if (date) {
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yyyy = date.getFullYear();
        return `${yyyy}-${mm}-${dd}`;
      }
    };

    // Format start and end dates
    const formattedStartDate = formatDateAsDDMMYYYY(dateRange.value[0]);
    const formattedEndDate = formatDateAsDDMMYYYY(dateRange.value[1]);

    sale_daterange.value = `${formattedStartDate},${formattedEndDate}`;
  } else {
    sale_daterange.value = "";
  }
  // console.log(sale_daterange.value, "this is daterange");
  await reservationStore.getListAction(watchSystem.value);
});
</script>

<template>
  <Layout :is_white="true">
    <div class="grid grid-cols-3 gap-4">
      <div class="border shadow-sm rounded-lg p-4">
        <div class="pb-4 flex justify-start items-center gap-x-3">
          <div
            class="bg-blue-600 px-2 rounded-lg shadow py-1 flex justify-center items-center gap-x-2 text-white text-xs"
          >
            <FunnelIcon class="w-5 h-5 text-white" />
            <p>Filter</p>
            <p>2</p>
          </div>
          <div class="bg-white shadow rounded-full border border-gray-100 p-2">
            <ArrowsUpDownIcon class="w-3 h-3" />
          </div>
          <input
            type="search"
            name=""
            placeholder="Search CRM ID"
            class="w-full px-4 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
            id=""
          />
        </div>
        <div
          v-if="!loading"
          class="bg-white shadow rounded-lg divide-y divide-gray-100 max-h-[75vh] overflow-y-scroll"
        >
          <div
            class=""
            v-for="i in reservations?.data ?? []"
            :key="i"
            @click="getDetailAction(i.id)"
          >
            <ListReservation :data="i" :detailId="detailId" />
          </div>
        </div>
        <div
          v-if="loading"
          class="bg-white shadow rounded-lg divide-y-4 divide-gray-200 max-h-[75vh] overflow-y-scroll"
        >
          <div class="" v-for="i in 10 ?? []" :key="i">
            <ReservationCartLoadingVue />
          </div>
        </div>
      </div>
      <div
        class="col-span-2 border shadow-sm rounded-lg p-4 h-[85vh] overflow-y-scroll"
      >
        <ReservationDetail />
      </div>
    </div>
  </Layout>
</template>
