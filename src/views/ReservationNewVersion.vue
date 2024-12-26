<script setup>
import Layout from "./Layout.vue";
import Input from "../components/Input.vue";
import InputField from "../components/InputField.vue";
import Pagination from "../components/PaginationExpense.vue";
import debounce from "lodash/debounce";
import PrivateVanTourList from "./ReservationComponent/PrivateVanTourList.vue";
import TableHeaderVue from "./ReservationComponent/TableHeader.vue";
import ReservationTableListVue from "./ReservationComponent/ReservationTableList.vue";

import Modal from "../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
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
import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import { computed, onMounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import { useRouter, useRoute } from "vue-router";
import { useReservationStore } from "../stores/reservation";
import { useAdminStore } from "../stores/admin";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth";
import { useHotelStore } from "../stores/hotel";
import { useEntranceStore } from "../stores/entrance";

const router = useRouter();
const route = useRoute();
const toast = useToast();
const reservationStore = useReservationStore();
const adminStore = useAdminStore();
const hotelStore = useHotelStore();
const authStore = useAuthStore();
const entranceStore = useEntranceStore();

const { reservations, loading } = storeToRefs(reservationStore);
const { hotels } = storeToRefs(hotelStore);
const { entrances } = storeToRefs(entranceStore);

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
const search = ref("App\\Models\\Hotel");
const searchId = ref("");
const seen = ref(true);
const seenClick = () => {
  seen.value = !seen.value;
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
const searchReservation = ref("");
const searchResArray = [
  { id: 1, name: "awaiting" },
  { id: 2, name: "confirmed" },
  { id: 3, name: "declined" },
];
const bookingStatusArr = [
  { id: 1, name: "awaiting" },
  { id: 2, name: "confirmed" },
  { id: 3, name: "declined" },
];
const expenseStatusArr = [
  { id: "1", name: "fully_paid" },
  { id: "2", name: "not_paid" },
  { id: "3", name: "partially_paid" },
];
const customerPaymentStatusArr = [
  { id: "1", name: "fully_paid" },
  { id: "2", name: "not_paid" },
  { id: "3", name: "partially_paid" },
];
const searchTime = ref("");
const empty_unit_cost = ref("");
const booking_date = ref("");
const booking_daterange = ref("");
const dateRange = ref();
const sale_daterange = ref(null);
const oldCrmId = ref("");
const bookingStatus = ref("");
const expenseStatus = ref("");
const customerPaymentStatus = ref("");
const hotel_name = ref("");
const attraction_name = ref("");
const customer_name = ref("");
const sortingArr = ref([
  { id: 1, name: "latest", value: "desc" },
  { id: 2, name: "oldest", value: "asc" },
]);
const sorting = ref("");

const dateOnlyToggle = ref(false);

const showFilter = ref(false);
const clearFilter = () => {
  search.value = "";
  changeDate.value = "";
  oldCrmId.value = "";
  dateRange.value = "";
  sale_daterange.value = "";
  booking_daterange.value = "";
  bookingStatus.value = "";
  expenseStatus.value = "";
  customerPaymentStatus.value = "";
  searchId.value = "";
  hotel_name.value = "";
  limit.value = 10;
  searchA.value = "";
  userFilter.value = "";
  attraction_name.value = "";
  // user_id.value =
  //   authStore.isSuperAdmin || authStore.isReservation ? "" : authStore.user.id;
  searchReservation.value = "";
  searchTime.value = "";
  empty_unit_cost.value = "";
  booking_date.value = "";
  showFilter.value = false;
  customer_name.value = "";
  sorting.value = "";
  toggleSearchHandler();
};

const isOpenSearch = ref(false);

const toggleSearchHandler = () => {
  isOpenSearch.value = !isOpenSearch.value;
};

const private_van_tour_show = ref(false);
const private_van_handle = () => {
  // searchValue("App\\Models\\PrivateVanTour");
  search.value = "App\\Models\\PrivateVanTour";
  private_van_tour_show.value = true;
};

const searchFunction = () => {
  router.push({
    name: `reservation-new`,
    params: {
      crm_id: searchId.value ? searchId.value : "%",
      product_type: search.value ? search.value : "%",
      service_date: searchTime.value ? searchTime.value : "%",
    },
  });

  EverythingElse.value = true;
};

const openExport = (date) => {
  // const res = await reservationStore.exportLink(date);
  // if ((res.statusText = "OK")) {
  //   toast.success("export success");
  // }
  window.open(
    import.meta.env.VITE_API_URL +
      "/reservations/report/export?sale_daterange=" +
      date
  );
};

const adminAction = ref(false);
const hotelAction = ref(false);
const entranceAction = ref(false);

watch(
  [adminAction, hotelAction, entranceAction],
  async ([newValue, secValue, thridValue]) => {
    if (newValue == true) {
      if (admin.value == null) {
        await adminStore.getSimpleListAction();
      }
    }
    if (secValue == true) {
      if (hotels.value == null) {
        await hotelStore.getSimpleListAction();
      }
    }
    if (thridValue == true) {
      if (entrances.value == null) {
        await entranceStore.getSimpleListAction();
      }
    }
  }
);

// excel for tax

const presetDates = ref([
  { label: "Today", value: [new Date(), new Date()] },
  {
    label: "Today (Slot)",
    value: [new Date(), new Date()],
    slot: "preset-date-range-button",
  },
  {
    label: "This month",
    value: [startOfMonth(new Date()), endOfMonth(new Date())],
  },
  {
    label: "Last month",
    value: [
      startOfMonth(subMonths(new Date(), 1)),
      endOfMonth(subMonths(new Date(), 1)),
    ],
  },
  {
    label: "This year",
    value: [startOfYear(new Date()), endOfYear(new Date())],
  },
]);

const openExcelModal = ref(false);
const product_type_array = [
  { id: 1, name: "private_van_tour" },
  { id: 2, name: "hotel" },
  { id: 3, name: "entrance_ticket" },
  { id: 4, name: "airline" },
  { id: 5, name: "group_tour" },
];
const select_date_type = [
  { id: 1, name: "service_date" },
  { id: 2, name: "sale_date" },
];

const openExcelData = ref({
  daterange: "",
  product: "",
  filter_type: "",
});
const clearExcelData = () => {
  openExcelData.value = {
    daterange: "",
    product: "",
    filter_type: "",
  };
};
const openExcelModalAction = () => {
  clearExcelData();
  openExcelModal.value = true;
};

const closeExcelModal = () => {
  clearExcelData();
  openExcelModal.value = false;
};

const exportTaxAction = async () => {
  let date;
  if (openExcelData.value.daterange != "") {
    // Format start and end dates
    const formattedStartDate = formatDate(openExcelData.value.daterange[0]);
    const formattedEndDate = formatDate(openExcelData.value.daterange[1]);

    date = `${formattedStartDate},${formattedEndDate}`;
  }

  const res = await reservationStore.exportTaxExcelFile({
    filter_type: openExcelData.value.filter_type,
    product: openExcelData.value.product,
    daterange: date,
  });

  console.log("====================================");
  console.log(res, "this is data");
  console.log("====================================");
  if (res.data.message == "success export") {
    toast.success("export success");
    window.open(res.data.data.download_link);
  }
  closeExcelModal();
};

// end excel for tax

const setStartAndEndDate = () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Add 90 days to startOfMonth to get the end date
  const endOfMonth = new Date(startOfMonth); // Create a copy of startOfMonth
  endOfMonth.setDate(endOfMonth.getDate() + 90);

  dateRange.value = [startOfMonth, endOfMonth];
};

const adminLists = ref([]);

const getListUser = async () => {
  try {
    const res = await await adminStore.getSimpleListAction();
    console.log(res, "this is admin list");

    adminLists.value = res.result.data
      .filter((item) => item.role === "admin")
      .map((item) => {
        // Return desired structure or transformation here
        return {
          id: item.id,
          name: item.name,
        };
      });
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
  }
};

// this is for reservation new versions of the lists

const partOfEFullAndBookNC = ref(false);
const partOfEFullAndBookWait = ref(false);
const EverythingElse = ref(false);

const reservationFilterList = ref([]);

const partOfEFullAndBookNCAction = async () => {
  partOfEFullAndBookNC.value = !partOfEFullAndBookNC.value;

  partOfEFullAndBookWait.value = false;
  EverythingElse.value = false;

  if (partOfEFullAndBookNC.value == true) {
    // fully_paid
    expenseStatus.value = "fully_paid";
    searchReservation.value = "awaiting";

    await searchHandler();
  }

  if (partOfEFullAndBookNC.value == false) {
    expenseStatus.value = "";
    searchReservation.value = "";
  }
};

const partOfEFullAndBookWaitAction = async () => {
  partOfEFullAndBookWait.value = !partOfEFullAndBookWait.value;

  partOfEFullAndBookNC.value = false;
  EverythingElse.value = false;

  if (partOfEFullAndBookWait.value == true) {
    // fully_paid
    expenseStatus.value = "fully_paid";
    // awaiting
    searchReservation.value = "";

    await searchHandler();
  }

  if (partOfEFullAndBookWait.value == false) {
    expenseStatus.value = "";
    searchReservation.value = "";
  }
};

const EverythingElseAction = async () => {
  EverythingElse.value = !EverythingElse.value;
  partOfEFullAndBookNC.value = false;
  partOfEFullAndBookWait.value = false;

  expenseStatus.value = "";
  // awaiting
  searchReservation.value = "";

  await searchHandler();
};

// this is end for reservation new versions of the lists

onMounted(async () => {
  console.log(entrances.value, "this is hotel list");
  searchId.value = route.params.crm_id == "%" ? "" : route.params.crm_id;
  if (route.params.product_type != "%") {
    search.value =
      route.params.product_type == "%" ? "" : route.params.product_type;
  } else {
    search.value = "App\\Models\\Hotel";
  }

  searchTime.value =
    route.params.service_date == "%" ? "" : route.params.service_date;

  setStartAndEndDate();

  await getListUser();
});

watch(reservations, (newValue) => {
  if (newValue) {
    if (partOfEFullAndBookWait.value) {
      reservationFilterList.value = newValue.data.filter(
        (item) => item.paid_slip.length === 0
      );
    } else {
      reservationFilterList.value = newValue.data;
    }
  }
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
  } else {
    search.value = "App\\Models\\Hotel";
    result.product_type = "App\\Models\\Hotel";
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

const upFunction = (data) => {
  customer_name.value = data;
  sorting.value = "asc";
};

const downFunction = (data) => {
  customer_name.value = data;
  sorting.value = "desc";
};

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

const searchHandler = async () => {
  await reservationStore.getListAction(watchSystem.value);
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
🏩 Room Name : ${res.result.room_name != "null" ? res.result.room_name : "-"}
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

watch(
  searchId,
  debounce(async (newValue) => {
    if (newValue) {
      showFilter.value = true;
      searchFunction();
    }
  }, 500)
);
watch(dateRange, async (newValue) => {
  showFilter.value = true;
  console.log(dateRange.value, "this is date");
  if (dateRange.value != "" && dateRange.value != null) {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const startDate = dateRange?.value[0]?.toLocaleDateString("en-GB", options);
    const endDate = dateRange?.value[1]?.toLocaleDateString("en-GB", options);

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

const bookingDateRange = ref("");
watch(bookingDateRange, async (newValue) => {
  showFilter.value = true;
  console.log(bookingDateRange.value, "this is date");
  if (bookingDateRange.value != "" && bookingDateRange.value != null) {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const startDate = bookingDateRange?.value[0]?.toLocaleDateString(
      "en-GB",
      options
    );
    const endDate = bookingDateRange?.value[1]?.toLocaleDateString(
      "en-GB",
      options
    );

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
    const formattedStartDate = formatDateAsDDMMYYYY(bookingDateRange.value[0]);
    const formattedEndDate = formatDateAsDDMMYYYY(bookingDateRange.value[1]);

    booking_daterange.value = `${formattedStartDate},${formattedEndDate}`;
  } else {
    booking_daterange.value = "";
  }
  // console.log(sale_daterange.value, "this is daterange");
  await reservationStore.getListAction(watchSystem.value);
});
watch(search, async (newValue) => {
  if (newValue) {
    showFilter.value = true;
    await reservationStore.getListAction(watchSystem.value);
  }
});
watch(sale_daterange, async (newValue) => {
  showFilter.value = true;
  await reservationStore.getListAction(watchSystem.value);
});
watch(booking_daterange, async (newValue) => {
  showFilter.value = true;
  await reservationStore.getListAction(watchSystem.value);
});
const changeDate = ref("");
const changeServiceDate = (data) => {
  console.log(data);
  changeDate.value = data;
  if (data == "today") {
    let startDate = formatDate(new Date());
    let endDate = formatDate(new Date());
    sale_daterange.value = `${startDate},${endDate}`;
  } else if (data == "tomorrow") {
    let tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    let startDate = formatDate(tomorrowDate);
    let endDate = formatDate(tomorrowDate);
    sale_daterange.value = `${startDate},${endDate}`;
  } else if (data == "7day") {
    let startDate = formatDate(new Date());
    let endDate = formatDate(
      new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
    );
    sale_daterange.value = `${startDate},${endDate}`;
  } else if (data == "30day") {
    let startDate = formatDate(new Date());
    let endDate = formatDate(
      new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
    );
    sale_daterange.value = `${startDate},${endDate}`;
  }
};
</script>

<template>
  <Layout>
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-2xl font-medium text-gray-600">
        Reservation New Version Lists
      </h3>
      <div class="space-x-2 flex justify-end gap-1">
        <Button :leftIcon="FunnelIcon" v-if="showFilter" @click="clearFilter">
          Clear
        </Button>
        <Button :leftIcon="FunnelIcon" @click="searchHandler"> Search </Button>
        <div
          v-if="sale_daterange && dateRange"
          @click="openExport(sale_daterange)"
          class="text-base px-4 cursor-pointer bg-[#ff613c] text-white shadow-md py-2 border border-gray-200 rounded-lg"
        >
          Export
        </div>
        <div
          @click="openExcelModalAction"
          class="text-base flex justify-start items-center gap-x-2 px-4 cursor-pointer bg-[#ff613c] text-white shadow-md py-2 border border-gray-200 rounded-lg"
        >
          <PrinterIcon class="w-6 h-6" />
          Export For Tax
        </div>
      </div>
    </div>
    <div class="p-6 mb-5 rounded-lg shadow-sm bg-white/60">
      <!-- search input sort filter -->
      <div class="flex items-center justify-between mb-5">
        <div class="flex items-center justify-start gap-2 space-x-2">
          <p
            class="text-xs px-4 cursor-pointer hover:bg-[#ff613c] hover:text-white hover:shadow-md py-2 border border-gray-200 rounded"
            @click="private_van_handle"
            :class="
              search == 'App\\Models\\PrivateVanTour'
                ? 'bg-[#ff613c] text-white'
                : ''
            "
          >
            Private Van tour
          </p>
          <p
            class="text-xs px-4 cursor-pointer hover:bg-[#ff613c] hover:text-white hover:shadow-md py-2 border border-gray-200 rounded"
            @click="searchValue('App\\Models\\Hotel')"
            :class="
              search == 'App\\Models\\Hotel' ? 'bg-[#ff613c] text-white' : ''
            "
          >
            Hotel
          </p>
          <p
            class="text-xs px-4 cursor-pointer hover:bg-[#ff613c] hover:text-white hover:shadow-md py-2 border border-gray-200 rounded"
            @click="searchValue('App\\Models\\EntranceTicket')"
            :class="
              search == 'App\\Models\\EntranceTicket'
                ? 'bg-[#ff613c] text-white'
                : ''
            "
          >
            Entrance Ticket
          </p>
        </div>
        <div class="flex justify-end items-center gap-2">
          <div
            @click="dateOnlyToggle = !dateOnlyToggle"
            class="flex justify-end items-center gap-2"
          >
            <p class="text-xs">date only filter</p>
            <label
              class="inline-flex items-center cursor-pointer"
              v-if="dateOnlyToggle"
            >
              <input type="checkbox" value="" class="sr-only peer" disabled />
              <div
                class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
              ></div>
            </label>

            <label
              class="inline-flex items-center cursor-pointer"
              v-if="!dateOnlyToggle"
            >
              <input
                type="checkbox"
                value=""
                class="sr-only peer"
                checked
                disabled
              />
              <div
                class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"
              ></div>
            </label>
            <p class="text-xs">date range filter</p>
          </div>
          <div v-if="authStore.isSuperAdmin">
            <p class="text-xs bg-[#FF5B00] text-white px-2 py-2 rounded-lg">
              expense - {{ reservations?.meta.total_expense_amount }} thb
            </p>
          </div>
          <div v-if="authStore.isSuperAdmin">
            <p class="text-xs bg-[#FF5B00] text-white px-2 py-2 rounded-lg">
              total amount - {{ reservations?.meta.total_amount }} thb
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-5 gap-2 mb-5 flex-wrap">
        <div class="" v-if="authStore.isSuperAdmin || authStore.isReservation">
          <select
            name=""
            id=""
            v-model="userFilter"
            class="px-2 py-1 focus:border-gray-300 border border-gray-300 placeholder-sm bg-white rounded-lg w-3/5 sm:w-3/5 md:w-full text-gray-400 space-y-2 h-9"
          >
            <option :value="null" disabled class="bg-gray-200 text-sm">
              Filter By User
            </option>
            <option value="" class="text-sm">All User</option>
            <option
              :value="key.id"
              v-for="(key, index) in adminLists"
              :key="index"
              class="text-sm"
            >
              {{ key.name }}
            </option>
          </select>
        </div>
        <div v-if="dateOnlyToggle">
          <VueDatePicker
            v-model="searchTime"
            :format="'yyyy-MM-dd'"
            placeholder="Service Date"
            text-input
          />
        </div>
        <div v-if="dateOnlyToggle">
          <VueDatePicker
            v-model="booking_date"
            :format="'yyyy-MM-dd'"
            placeholder="Booking Date"
            text-input
          />
        </div>
        <div v-if="!dateOnlyToggle">
          <VueDatePicker
            v-model="dateRange"
            range
            :format="'yyyy-MM-dd'"
            placeholder="Service Date range"
            text-input
          />
        </div>
        <div v-if="!dateOnlyToggle">
          <VueDatePicker
            v-model="bookingDateRange"
            range
            :format="'yyyy-MM-dd'"
            placeholder="Booking Date range"
            text-input
          />
        </div>
        <div>
          <input
            v-model="searchId"
            type="text"
            class="h-9 text-sm w-3/5 sm:w-3/5 md:w-full border px-4 py-2 rounded-md focus:ring-0 focus:outline-none text-gray-500"
            placeholder="Search CRM ID"
          />
        </div>

        <!-- <div>
          <v-select
            class="style-chooser placeholder-sm bg-white rounded-lg w-3/5 sm:w-3/5 md:w-full text-gray-400"
            v-model="sorting"
            :options="sortingArr"
            label="name"
            :clearable="false"
            :reduce="(d) => d.value"
            placeholder="sorting ..."
          ></v-select>
        </div> -->

        <div
          class="flex justify-end items-center gap-2"
          :class="
            authStore.isSuperAdmin || authStore.isReservation
              ? 'col-span-1'
              : 'col-span-2'
          "
        >
          <p class="inline-block mr-2 text-sm font-medium text-gray-500">
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
        </div>
        <div
          @click="empty_unit_cost = !empty_unit_cost"
          :class="
            empty_unit_cost == true
              ? 'bg-[#FF5B00] text-white'
              : 'text-gray-500'
          "
          class="border border-gray-300 text-sm rounded-md px-4 py-2"
        >
          <p>empty unit cost</p>
        </div>
        <div v-if="!dateOnlyToggle" class="col-span-4">
          <div class="flex w-full text-xs pt-4 justify-end items-center gap-4">
            <p
              @click="changeServiceDate('today')"
              class="flex gap-2 justify-start items-center cursor-pointer"
              :class="changeDate == 'today' ? ' text-[#FF5B00]' : 'text-black'"
            >
              <span
                class="w-2 h-2 rounded-full bg-[#FF5B00]"
                v-if="changeDate == 'today'"
              ></span
              >Today
            </p>
            <p
              @click="changeServiceDate('tomorrow')"
              class="flex gap-2 justify-start items-center cursor-pointer"
              :class="
                changeDate == 'tomorrow' ? ' text-[#FF5B00]' : 'text-black'
              "
            >
              <span
                class="w-2 h-2 rounded-full bg-[#FF5B00]"
                v-if="changeDate == 'tomorrow'"
              ></span
              >Tomorrow
            </p>
            <p
              @click="changeServiceDate('7day')"
              class="flex gap-2 justify-start items-center cursor-pointer"
              :class="changeDate == '7day' ? ' text-[#FF5B00]' : 'text-black'"
            >
              <span
                class="w-2 h-2 rounded-full bg-[#FF5B00]"
                v-if="changeDate == '7day'"
              ></span
              >Next 7 Days
            </p>
            <p
              @click="changeServiceDate('30day')"
              class="flex gap-2 justify-start items-center cursor-pointer"
              :class="changeDate == '30day' ? ' text-[#FF5B00]' : 'text-black'"
            >
              <span
                class="w-2 h-2 rounded-full bg-[#FF5B00]"
                v-if="changeDate == '30day'"
              ></span
              >Next 30 Days
            </p>
          </div>
        </div>
      </div>
      <div
        class="w-full mb-5 overflow-scroll space-y-4 bg-white rounded-lg"
        v-if="
          search == 'App\\Models\\Hotel' ||
          search == 'App\\Models\\EntranceTicket'
        "
      >
        <div>
          <div
            class="flex justify-between items-center px-4 cursor-pointer py-5 rounded-lg"
            :class="
              partOfEFullAndBookNC
                ? 'bg-[#FF5B00] text-white'
                : 'border border-gray-300'
            "
          >
            <div
              @click="partOfEFullAndBookNCAction"
              class="flex items-center gap-2"
            >
              <ChevronDownIcon class="w-5 h-5" />
              <p class="text-sm">Expense Fully Paid & Booking Not Confirmed</p>
            </div>
            <Pagination
              v-if="partOfEFullAndBookNC"
              :data="reservations"
              @change-page="changePage"
            />
          </div>
          <div v-if="partOfEFullAndBookNC">
            <TableHeaderVue
              :customer_name="customer_name"
              :sorting="sorting"
              :upFunction="upFunction"
              :downFunction="downFunction"
            />
          </div>
          <div v-if="partOfEFullAndBookNC">
            <ReservationTableListVue
              :loading="loading"
              :reservations="reservationFilterList"
              :copyReservation="copyReservation"
            />
          </div>
        </div>
        <div>
          <div
            class="flex justify-between items-center px-4 cursor-pointer py-5 rounded-lg"
            :class="
              partOfEFullAndBookWait
                ? 'bg-[#FF5B00] text-white'
                : 'border border-gray-300'
            "
          >
            <div
              @click="partOfEFullAndBookWaitAction"
              class="flex items-center gap-2"
            >
              <ChevronDownIcon class="w-5 h-5" />
              <p class="text-sm">Expense Fully Paid & Booked Receipt Waiting</p>
            </div>
            <Pagination
              v-if="partOfEFullAndBookWait"
              :data="reservations"
              @change-page="changePage"
            />
          </div>
          <div v-if="partOfEFullAndBookWait">
            <TableHeaderVue
              :customer_name="customer_name"
              :sorting="sorting"
              :upFunction="upFunction"
              :downFunction="downFunction"
            />
          </div>
          <div v-if="partOfEFullAndBookWait">
            <ReservationTableListVue
              :loading="loading"
              :reservations="reservationFilterList"
              :copyReservation="copyReservation"
            />
          </div>
        </div>
        <div>
          <div
            class="flex justify-between items-center px-4 cursor-pointer py-5 rounded-lg"
            :class="
              EverythingElse
                ? 'bg-[#FF5B00] text-white'
                : 'border border-gray-300'
            "
          >
            <div @click="EverythingElseAction" class="flex items-center gap-2">
              <ChevronDownIcon class="w-5 h-5" />
              <p class="text-sm">Everything Else</p>
            </div>
            <Pagination
              v-if="EverythingElse"
              :data="reservations"
              @change-page="changePage"
            />
          </div>
          <div v-if="EverythingElse">
            <TableHeaderVue
              :customer_name="customer_name"
              :sorting="sorting"
              :upFunction="upFunction"
              :downFunction="downFunction"
            />
          </div>
          <div v-if="EverythingElse">
            <ReservationTableListVue
              :loading="loading"
              :reservations="reservationFilterList"
              :copyReservation="copyReservation"
            />
          </div>
        </div>
      </div>

      <div v-if="search == 'App\\Models\\PrivateVanTour'">
        <PrivateVanTourList :saleDate="sale_daterange" />
      </div>

      <!-- <Pagination
        v-if="
          (!loading && search == 'App\\Models\\Hotel') ||
          search == 'App\\Models\\EntranceTicket'
        "
        :data="reservations"
        @change-page="changePage"
      /> -->
      <Modal :isOpen="openExcelModal" @closeModal="closeExcelModal">
        <DialogPanel
          class="w-full max-w-[500px] transform rounded-lg bg-white pt-4 text-left align-middle shadow-xl transition-all"
        >
          <div class="pb-4 px-8">
            <h1 class="font-medium text-sm">Reservations Export for Tax</h1>
            <input type="text" name="" class="opacity-0 h-0" id="" />
            <div class="space-y-2">
              <div class="space-y-1">
                <label for="" class="text-xs"
                  >Product Type <span class="text-red-600">*</span>
                </label>
                <v-select
                  v-model="openExcelData.product"
                  class="style-chooser placeholder-xs bg-white rounded-lg w-3/5 sm:w-3/5 md:w-full text-gray-400"
                  :options="product_type_array"
                  label="name"
                  :clearable="false"
                  :reduce="(d) => d.name"
                ></v-select>
              </div>
              <div class="space-y-1">
                <label for="" class="text-xs"
                  >Filter Date Type <span class="text-red-600">*</span></label
                >
                <v-select
                  v-model="openExcelData.filter_type"
                  class="style-chooser placeholder-xs bg-white rounded-lg w-3/5 sm:w-3/5 md:w-full text-gray-400"
                  :options="select_date_type"
                  label="name"
                  :clearable="false"
                  :reduce="(d) => d.name"
                ></v-select>
              </div>
              <div class="space-y-1">
                <label for="" class="text-xs"
                  >Choose Date <span class="text-red-600">*</span></label
                >
                <VueDatePicker
                  v-model="openExcelData.daterange"
                  range
                  :preset-dates="presetDates"
                >
                  <template
                    #preset-date-range-button="{ label, value, presetDate }"
                  >
                    <span
                      role="button"
                      :tabindex="0"
                      @click="presetDate(value)"
                      @keyup.enter.prevent="presetDate(value)"
                      @keyup.space.prevent="presetDate(value)"
                    >
                      {{ label }}
                    </span>
                  </template>
                </VueDatePicker>
              </div>
              <div
                @click="exportTaxAction"
                class="text-sm bg-[#ff613c] rounded-lg w-full text-white flex items-center justify-center py-2 gap-x-2"
              >
                <PrinterIcon class="w-5 h-5" />
                <p>Export</p>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Modal>
    </div>
  </Layout>
</template>

<style>
.style-chooser .v-select-placeholder {
  font-size: 12px !important; /* Adjust the font size to your preference */
}
</style>
