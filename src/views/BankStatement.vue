<script setup>
import { storeToRefs } from "pinia";
import { useSidebarStore } from "../stores/sidebar";
import Layout from "./Layout.vue";
import { computed, onMounted, ref, watch } from "vue";
import Pagination from "../components/Pagination.vue";
import { useToast } from "vue-toastification";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/outline";
import debounce from "lodash/debounce";
import Swal from "sweetalert2";
import AccountanceHeader from "../components/AccountanceHeader.vue";
import { useAuthStore } from "../stores/auth";
import YearPickerVue from "./AccountingComponent/yearPicker.vue";
import { useRoute } from "vue-router";
import router from "../router";
import { useBookingReceiptStore } from "../stores/bookingReceipt";
import Modal from "../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useReservationStore } from "../stores/reservation";
import ReceiptEdit from "./ReceiptEdit.vue";

const sideBarStore = useSidebarStore();
const toast = useToast();
const { isShowSidebar } = storeToRefs(sideBarStore);
const bookingReceiptStore = useBookingReceiptStore(); // Updated store
const reservationStore = useReservationStore();
const route = useRoute();
const authStore = useAuthStore();
const { receipts, loading } = storeToRefs(bookingReceiptStore);

// Search and filter states
const date_range = ref("");
const filterType = ref("all"); // complete, missing, incomplete
const senderSearch = ref("");
const crmSearch = ref("");
const bankNameSearch = ref("");
const amountSearch = ref("");
const interactSearch = ref("");

// Set current year and month
const currentDate = new Date();
const year = ref(currentDate.getFullYear());
const selectedMonth = ref(currentDate.getMonth() + 1);

const monthArray = [
  { id: 1, name: "January" },
  { id: 2, name: "February" },
  { id: 3, name: "March" },
  { id: 4, name: "April" },
  { id: 5, name: "May" },
  { id: 6, name: "June" },
  { id: 7, name: "July" },
  { id: 8, name: "August" },
  { id: 9, name: "September" },
  { id: 10, name: "October" },
  { id: 11, name: "November" },
  { id: 12, name: "December" },
];

// Function to generate date range string for a specific month
const generateDateRangeForMonth = (month, yearValue) => {
  const startDate = new Date(yearValue, month - 1, 1);
  const endDate = new Date(yearValue, month, 0);

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return `${formatDate(startDate)},${formatDate(endDate)}`;
};

// Set date range based on month and year
const setMonthDateRange = (month, yearValue) => {
  date_range.value = generateDateRangeForMonth(month, yearValue);
};

// Computed search parameters for API
const searchParams = computed(() => {
  let params = {};

  if (date_range.value) {
    params.date = date_range.value;
  }

  if (filterType.value) {
    params.type = filterType.value;
  } else {
    params.type = "all";
  }

  // Add specific search parameters
  if (senderSearch.value) {
    params.sender = senderSearch.value;
  }

  if (crmSearch.value) {
    params.crm_id = crmSearch.value;
  }

  if (bankNameSearch.value) {
    params.bank_name = bankNameSearch.value;
  }

  if (amountSearch.value) {
    params.amount = amountSearch.value;
  }

  if (interactSearch.value) {
    params.interact_bank = interactSearch.value;
  }

  return params;
});

// Get receipts action
const getAction = async () => {
  await bookingReceiptStore.getListAction(searchParams.value);
};

// Handle pagination
const changePage = async (url) => {
  await bookingReceiptStore.getChangePage(url, searchParams.value);
};

// Handle year change
const handleYearChange = (message) => {
  year.value = message;
  setMonthDateRange(selectedMonth.value, year.value);
};

// Handle month change
const handleMonthChange = (month) => {
  selectedMonth.value = month;
  setMonthDateRange(month, year.value);
};

// Clear all search filters
const clearSearch = () => {
  senderSearch.value = "";
  crmSearch.value = "";
  bankNameSearch.value = "";
  amountSearch.value = "";
  interactSearch.value = "";
  filterType.value = "";
  // date_range.value = "";
};

// View receipt file
const placeholderFile = ref("");
const viewReceipt = (item) => {
  if (item.file_url) {
    // window.open(item.file_url, "_blank");
    placeholderFile.value = item.file_url;
    console.log("====================================");
    console.log(placeholderFile.value);
    console.log("====================================");
  } else {
    toast.warning("No receipt file available");
  }
};

// Format amount display
const formatAmount = (amount) => {
  if (!amount) return "-";
  return new Intl.NumberFormat("en-US").format(amount);
};

// Get badge color for receipt type
const getTypeBadgeColor = (type) => {
  switch (type) {
    case "customer_payment":
      return "bg-green-100 text-green-800";
    case "expense":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const goToView = async (data) => {
  console.log(data);
  if (data.table_source == "booking_receipt") {
    router.push(`bookings/new-update/${data?.booking_id}`);
  } else {
    const res = await reservationStore.getDetailAction(data?.booking_id);
    // console.log(res);
    if (res.result) {
      if (res.result.product_type == "App\\Models\\EntranceTicket") {
        router.push(
          `/reservation-attraction?id=${res.result.id}&product_id=${res.result?.product?.id}&crm_id=${res.result?.booking?.crm_id}`
        );
      } else if (res.result.product_type == "App\\Models\\Hotel") {
        router.push(
          `/reservation-hotel?id=${res.result?.booking?.id}&product_id=${res.result?.product?.id}&crm_id=${res.result?.booking?.crm_id}`
        );
      } else if (res.result.product_type == "App\\Models\\PrivateVanTour") {
        router.push(
          `/reservation-vantour?id=${res.result?.booking?.id}&crm_id=${res.result?.booking?.crm_id}`
        );
      }
    }
  }
};
const updateModalOpen = ref(false);
const updateData = ref({
  id: "",
  date: "",
  file: "",
  bank_name: "",
  sender: "",
  amount: "",
  reciever: "",
  interact_bank: "",
  table_source: "",
});
const update = (data) => {
  console.log(data, "this is update");
  updateModalOpen.value = true;
  updateData.value.id = data.id;
  updateData.value.date = data.date;
  updateData.value.bank_name = data.bank_name;
  updateData.value.sender = data.sender;
  updateData.value.amount = data.amount;
  updateData.value.reciever = data.reciever;
  updateData.value.interact_bank = data.interact_bank;
  updateData.value.table_source = data.table_source;
  updateData.value.file = data.file_url;
};
const closeModal = () => {
  updateModalOpen.value = false;
  updateData.value = {
    id: "",
    date: "",
    bank_name: "",
    sender: "",
    reciever: "",
    interact_bank: "",
    amount: "",
    table_source: "",
    file: "",
  };
};
const onChangeUpdate = async (message) => {
  console.log(message);
  closeModal();
  await getAction();
};

onMounted(async () => {
  if (route.query.month && route.query.year) {
    selectedMonth.value = parseInt(route.query.month);
    year.value = parseInt(route.query.year);
  }

  setMonthDateRange(selectedMonth.value, year.value);
  await getAction();
});

// Watch for changes and debounce API calls
watch(
  [
    date_range,
    filterType,
    senderSearch,
    crmSearch,
    bankNameSearch,
    amountSearch,
    interactSearch,
  ],
  debounce(async () => {
    await getAction();
  }, 500)
);
</script>

<template>
  <Layout :is_white="true" class="relative">
    <div
      :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
      class="space-x-8 col-span-3 flex justify-start items-center transition-all duration-200 gap-2 text-sm pb-4 absolute top-6"
    >
      <p
        class="text-2xl flex justify-start items-center font-medium text-[#FF613c]"
      >
        Bank Statement
        <span
          class="w-2 h-2 mx-3 bg-[#FF613c] rounded-full inline-block"
        ></span>
        <span>{{ year }}</span>
        <span
          class="w-2 h-2 mx-3 bg-[#FF613c] rounded-full inline-block"
        ></span>
        <span>{{ monthArray.find((m) => m.id == selectedMonth)?.name }}</span>
      </p>
    </div>

    <div class="grid grid-cols-5 gap-4">
      <div class="col-span-5">
        <!-- Filters and Search -->
        <div class="pb-4 space-y-3">
          <!-- Date and Type Filters -->
          <div class="flex justify-start space-x-2 items-center">
            <p
              @click="filterType = 'all'"
              class="px-5 py-2.5 rounded-lg text-xs"
              :class="
                filterType == 'all'
                  ? 'bg-[#FF613c] text-white'
                  : ' border border-[#FF613x]'
              "
            >
              All
            </p>
            <p
              @click="filterType = 'complete'"
              class="px-5 py-2.5 rounded-lg text-xs"
              :class="
                filterType == 'complete'
                  ? 'bg-[#FF613c] text-white'
                  : ' border border-[#FF613x]'
              "
            >
              Complete
            </p>
            <p
              @click="filterType = 'missing'"
              class="px-5 py-2.5 rounded-lg text-xs"
              :class="
                filterType == 'missing'
                  ? 'bg-[#FF613c] text-white'
                  : ' border border-[#FF613x]'
              "
            >
              Missing
            </p>
            <YearPickerVue @year-change="handleYearChange" />
            <select
              v-model="selectedMonth"
              @change="handleMonthChange(selectedMonth)"
              class="px-3 text-black text-xs py-2 rounded-lg border border-gray-400/20 focus:outline-none"
            >
              <option :value="m.id" v-for="m in monthArray" :key="m.id">
                {{ m.name }}
              </option>
            </select>
          </div>

          <!-- Search Filters -->
          <div class="flex space-x-2 items-center">
            <div class="relative">
              <input
                v-model="senderSearch"
                type="text"
                placeholder="Search by sender..."
                class="pl-3 pr-3 py-2 text-xs border border-gray-400/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20"
              />
            </div>
            <div class="relative">
              <input
                v-model="crmSearch"
                type="text"
                placeholder="Search by crm..."
                class="pl-3 pr-3 py-2 text-xs border border-gray-400/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20"
              />
            </div>
            <div class="relative">
              <input
                v-model="bankNameSearch"
                type="text"
                placeholder="Search by bank name..."
                class="pl-3 pr-3 py-2 text-xs border border-gray-400/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20"
              />
            </div>
            <div class="relative">
              <input
                v-model="amountSearch"
                type="number"
                placeholder="Search by amount..."
                class="pl-3 pr-3 py-2 text-xs border border-gray-400/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20"
              />
            </div>
            <div class="relative">
              <select
                name=""
                v-model="interactSearch"
                class="pl-3 pr-3 py-2 text-xs border border-gray-400/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20"
                id=""
              >
                <option value="">Search by interact bank</option>
                <option value="personal">Personal</option>
                <option value="company">Company</option>
              </select>
            </div>
            <button
              @click="clearSearch"
              class="px-3 py-2 text-xs bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div class="overflow-x-auto col-span-3">
            <table
              class="w-full text-sm text-left text-gray-500 mb-4 dark:text-gray-400 rounded overflow-hidden"
            >
              <thead
                class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-[#FF613c] dark:text-gray-100"
              >
                <tr>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    Source
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    CRM
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    File
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    Bank
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    Sender
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    Reciever
                  </th>
                  <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody class="border border-gray-400/20" v-if="!loading">
                <tr
                  v-for="item in receipts?.data ?? []"
                  :key="item.id"
                  class="border border-gray-400/20 even:bg-gray-50 hover:bg-gray-100"
                >
                  <td
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 whitespace-nowrap border-l border-gray-400/20"
                  >
                    {{ item?.id }}
                  </td>
                  <td
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 whitespace-nowrap border-l border-gray-400/20"
                  >
                    <span
                      class="px-2 py-1 rounded-full text-[10px]"
                      :class="
                        item?.table_source === 'booking_receipt'
                          ? 'bg-[#FF613c]/20 text-[#FF613c]'
                          : 'bg-blue-100 text-blue-800'
                      "
                    >
                      {{
                        item?.table_source === "booking_receipt"
                          ? "Booking"
                          : "Expense"
                      }}
                    </span>
                  </td>
                  <td
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 whitespace-nowrap border-l border-gray-400/20"
                  >
                    {{ item?.crm_id }}
                  </td>
                  <td
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 whitespace-nowrap border-l border-gray-400/20"
                  >
                    <button
                      v-if="item?.file_url"
                      @click="viewReceipt(item)"
                      class="text-blue-500 hover:text-blue-700 underline"
                    >
                      View Receipt
                    </button>
                    <span v-else class="text-gray-400">No file</span>
                  </td>
                  <td
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 whitespace-nowrap border-l border-gray-400/20"
                  >
                    {{ item?.table_source === "booking_receipt" ? "" : "-"
                    }}{{ formatAmount(item?.amount) }}
                  </td>
                  <td
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 whitespace-nowrap border-l border-gray-400/20"
                  >
                    {{ item?.date }}
                  </td>
                  <td
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 whitespace-nowrap border-l border-gray-400/20"
                  >
                    {{ item?.bank_name != "null" ? item?.bank_name : "-" }}
                  </td>
                  <td
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 whitespace-nowrap border-l border-gray-400/20"
                  >
                    {{ item?.sender != "null" ? item?.sender : "-" }}
                  </td>
                  <td
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 whitespace-nowrap border-l border-gray-400/20"
                  >
                    {{ item?.reciever != "null" ? item?.reciever : "-" }}
                  </td>
                  <td
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 whitespace-nowrap border-l border-gray-400/20"
                  >
                    <div class="flex space-x-1">
                      <button
                        @click="goToView(item)"
                        class="p-1 text-blue-600 hover:text-blue-800"
                        title="View Receipt"
                      >
                        <EyeIcon class="w-4 h-4" />
                      </button>
                      <button
                        @click="update(item)"
                        class="p-1 text-blue-600 hover:text-blue-800"
                        title="View Receipt"
                      >
                        <PencilSquareIcon class="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>

              <tbody v-if="loading">
                <tr>
                  <td colspan="11" class="text-center py-10 text-xs">
                    Loading...
                  </td>
                </tr>
              </tbody>

              <tbody
                v-if="
                  !loading && (!receipts?.data || receipts.data.length === 0)
                "
              >
                <tr>
                  <td
                    colspan="11"
                    class="text-center py-10 text-xs text-gray-500"
                  >
                    No receipts found
                  </td>
                </tr>
              </tbody>
            </table>

            <div>
              <Pagination
                v-if="!loading && receipts?.data?.length > 0"
                :data="receipts"
                @change-page="changePage"
              />
            </div>
          </div>
          <Modal
            :isOpen="placeholderFile != ''"
            @closeModal="placeholderFile = ''"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900 mb-5"
              >
                Receipt
              </DialogTitle>
              <div>
                <img :src="placeholderFile" alt="" />
              </div>
            </DialogPanel>
          </Modal>
          <Modal :isOpen="updateModalOpen" @closeModal="closeModal">
            <DialogPanel
              class="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white/70 backdrop-blur-lg p-4 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900 mb-5"
              >
                <span class="uppercase">{{ updateData?.table_source }}</span>
              </DialogTitle>
              <ReceiptEdit :updateData="updateData" @update="onChangeUpdate" />
            </DialogPanel>
          </Modal>
        </div>
      </div>
    </div>
  </Layout>
</template>
