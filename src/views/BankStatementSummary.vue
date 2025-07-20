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

    <div class="">
      <!-- Filters and Search -->
      <div class="pb-4 space-y-3">
        <!-- Date and Type Filters -->
        <div class="flex justify-start space-x-2 items-center">
          <p
            v-if="!authStore.isExternalAudit"
            @click="filterType = 'all'"
            class="px-5 py-2.5 rounded-lg text-xs cursor-pointer"
            :class="
              filterType == 'all'
                ? 'bg-[#FF613c] text-white'
                : ' border border-[#FF613c]'
            "
          >
            All
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
              v-model="crmSearch"
              type="text"
              placeholder="Search by CRM ID..."
              class="pl-3 pr-3 py-2 text-xs border border-gray-400/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20"
            />
          </div>
          <div class="relative">
            <input
              v-model="customerSearch"
              type="text"
              placeholder="Search by customer..."
              class="pl-3 pr-3 py-2 text-xs border border-gray-400/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20"
            />
          </div>
          <div class="relative">
            <select
              name=""
              v-model="per_page"
              class="pl-3 pr-3 py-2 text-xs border border-gray-400/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20"
              id=""
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
              <option value="60">60</option>
              <option value="70">70</option>
              <option value="80">80</option>
              <option value="90">90</option>
              <option value="100">100</option>
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

      <!-- Table Layout -->
      <div>
        <div v-if="loadingCash" class="text-center py-10">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF613c]"
          ></div>
          <p class="mt-2 text-gray-600">Loading summary data...</p>
        </div>
        <div
          v-else-if="cashAccounts?.data.length == 0 && !loadingCash"
          class="text-center py-10"
        >
          <div class="text-gray-400 text-6xl mb-4">📄</div>
          <p class="text-gray-600">No summary data found</p>
        </div>
        <table
          v-if="cashAccounts?.data.length > 0 && !loadingCash"
          class="w-full text-xs border border-gray-500"
        >
          <thead class="border border-gray-500">
            <tr class="bg-gray-200 divide-x divide-gray-500">
              <th class="text-xs text-center font-medium py-3 px-2">
                Invoice ID
              </th>
              <th class="text-xs text-center font-medium py-3 px-2">Date</th>

              <th class="text-xs text-center font-medium py-3 px-2">
                Customer Name
              </th>
              <th class="text-xs text-center font-medium py-3 px-2">
                Hotel Service
              </th>
              <th class="text-xs text-center font-medium py-3 px-2">
                Ticket Service
              </th>
              <th class="text-xs text-center font-medium py-3 px-2">
                Total Sales
              </th>
              <th class="text-xs text-center font-medium py-3 px-2">
                Profit Share
              </th>
              <th class="text-xs text-center font-medium py-3 px-2">Balance</th>
              <th class="text-xs text-center font-medium py-3 px-2">
                Total VAT
              </th>
              <th class="text-xs text-center font-medium py-3 px-2">
                Price Before VAT
              </th>

              <th class="text-xs text-center font-medium py-3 px-2">
                Cash Amount
              </th>
              <th class="text-xs text-center font-medium py-3 px-2">Bank</th>
              <th class="text-xs text-center font-medium py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in cashAccounts.data"
              :key="item.cash_image_id"
              class="bg-gray-50 odd:bg-white group relative divide-x divide-gray-500 hover:bg-gray-100"
            >
              <td class="px-2 py-2 text-xs text-center font-medium">
                {{ item.crm_id }}
              </td>
              <td class="px-2 py-2 text-xs text-center">
                {{ formatDateForTime(item.cash_image_date) }}
              </td>

              <td class="px-2 py-2 text-xs text-center">
                {{ item.customer_name }}
              </td>

              <td class="px-2 py-2 text-xs text-end">
                <div class="space-y-1">
                  <div class="text-gray-600">
                    +{{ formattedNumber(item.hotel_service_total) }}
                  </div>
                </div>
              </td>
              <td class="px-2 py-2 text-xs text-end">
                <div class="space-y-1">
                  <div class="text-gray-600">
                    +{{ formattedNumber(item.ticket_service_total) }}
                  </div>
                </div>
              </td>
              <td class="px-2 py-2 text-xs text-end font-medium">
                {{ formattedNumber(item.total_sales) }} {{ item.currency }}
              </td>
              <td class="px-2 py-2 text-xs text-end">
                {{ formattedNumber(item.commission) }}
              </td>
              <td class="px-2 py-2 text-xs text-end">
                {{ formattedNumber(item.total_sales - item.commission) }}
              </td>
              <td class="px-2 py-2 text-xs text-end">
                {{
                  formattedNumber(
                    calculateVat(item.total_sales, item.commission)
                  )
                }}
              </td>
              <td class="px-2 py-2 text-xs text-end">
                {{
                  formattedNumber(
                    item.total_sales -
                      item.commission -
                      calculateVat(item.total_sales, item.commission)
                  )
                }}
              </td>

              <td class="px-2 py-2 text-xs text-end">
                {{ formattedNumber(item.cash_amount) }} {{ item.currency }}
              </td>
              <td class="px-2 py-2 text-xs capitalize text-end">
                {{ item.bank + " Bank" }}
              </td>
              <td class="px-2 py-2 text-xs text-center">
                <div class="flex justify-center space-x-1">
                  <button
                    @click="getImage(item.cash_image_id)"
                    class="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="View Invoice"
                  >
                    <PencilSquareIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="openCredit(item.invoice_id)"
                    class="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="View Invoice"
                  >
                    <EyeIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="mt-8">
          <Pagination
            v-if="!loadingCash && cashAccounts?.data?.length > 0"
            :data="cashAccounts"
            @change-page="changePage"
          />
        </div>
      </div>
    </div>
    <Modal :isOpen="updateModalOpen" @closeModal="closeModal">
      <DialogPanel
        class="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white/95 backdrop-blur-md text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-3 px-4 rounded-t-xl"
        >
          <span class="uppercase">{{
            updateData?.relatable_type == "App\\Models\\Booking"
              ? "Booking"
              : updateData?.relatable_type == "App\\Models\\BookingItemGroup"
              ? "Group Expense"
              : "Cash Book"
          }}</span>
        </DialogTitle>
        <div class="p-4">
          <ReceiptEdit :updateData="updateData" @update="onChangeUpdate" />
        </div>
      </DialogPanel>
    </Modal>
  </Layout>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useSidebarStore } from "../stores/sidebar";
import Layout from "./Layout.vue";
import { computed, onMounted, ref, watch } from "vue";
import Pagination from "../components/Pagination.vue";
import { useToast } from "vue-toastification";
import { EyeIcon, PencilSquareIcon } from "@heroicons/vue/24/outline";
import debounce from "lodash/debounce";
import { useAuthStore } from "../stores/auth";
import YearPickerVue from "./AccountingComponent/yearPicker.vue";
import { useRoute, useRouter } from "vue-router";
import { useCashImageStore } from "../stores/cashImage";
import { formattedNumber } from "./help/FormatData";
import Modal from "../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle, Tab } from "@headlessui/vue";
import ReceiptEdit from "./ReceiptEdit.vue";

const sideBarStore = useSidebarStore();
const toast = useToast();
const { isShowSidebar } = storeToRefs(sideBarStore);
const cashImageStore = useCashImageStore();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Updated to use cashAccounts instead of cashImages
const { cashAccounts, loadingCash } = storeToRefs(cashImageStore);

// Search and filter states
const date_range = ref("");
const filterType = ref("all");
const crmSearch = ref("");
const customerSearch = ref("");
const per_page = ref(100);

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

const formatDateForTime = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";

  const day = date.getDate().toString().padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear().toString().slice(-2);

  return `${day} ${month} ${year}`;
};

const calculateVat = (totalSales, commission) => {
  let vat = totalSales - commission - (totalSales - commission) / 1.07;
  return vat.toFixed(2);
};

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

const setMonthDateRange = (month, yearValue) => {
  date_range.value = generateDateRangeForMonth(month, yearValue);
};

const openCredit = (id) => {
  window.open(
    import.meta.env.VITE_API_URL + "/bookings/" + id + "/credit",
    "_blank"
  );
};

const updateModalOpen = ref(false);
const updateData = ref({
  id: "",
  date: "",
  file: "",
  sender: "",
  amount: "",
  receiver: "",
  interact_bank: "",
  currency: "",
  relatable_type: "",
});

const closeModal = () => {
  updateModalOpen.value = false;
  updateData.value = {
    id: "",
    date: "",
    sender: "",
    receiver: "",
    interact_bank: "",
    currency: "",
    amount: "",
    relatable_type: "",
    file: "",
  };
};

const getImage = async (id) => {
  const res = await cashImageStore.getDetailAction(id);
  console.log(res);

  if (res.status == 1) {
    updateModalOpen.value = true;

    updateData.value.id = res.result?.id;
    updateData.value.date = res.result?.date;
    updateData.value.file = res.result?.image;
    updateData.value.sender = res.result?.sender;
    updateData.value.amount = res.result?.amount;
    updateData.value.receiver = res.result?.receiver;
    updateData.value.interact_bank = res.result?.interact_bank;
    updateData.value.currency = res.result?.currency;
    updateData.value.relatable_type = res.result?.relatable_type;
  }
};

const searchParams = computed(() => {
  let params = {};

  if (date_range.value) {
    params.date = date_range.value;
  }

  if (crmSearch.value) {
    params.crm_id = crmSearch.value;
  }

  if (customerSearch.value) {
    params.customer_name = customerSearch.value;
  }

  params.interact_bank = "company";
  params.relatable_type = "App\\Models\\Booking";
  params.limit = per_page.value ? per_page.value : 100;

  return params;
});

const getAction = async () => {
  await cashImageStore.getSummary(searchParams.value);
  console.log(cashAccounts.value, "this is accounts value");
};

const changePage = async (url) => {
  await cashImageStore.getChangeSummaryPage(url, searchParams.value);
};

const handleYearChange = (message) => {
  year.value = message;
  setMonthDateRange(selectedMonth.value, year.value);
};

const handleMonthChange = (month) => {
  selectedMonth.value = month;
  setMonthDateRange(month, year.value);
};

const clearSearch = () => {
  crmSearch.value = "";
  customerSearch.value = "";
};

const viewInvoice = (invoiceId) => {
  if (invoiceId) {
    window.open(`/invoice/${invoiceId}`, "_blank");
  } else {
    toast.warning("No invoice available");
  }
};

onMounted(async () => {
  if (route.query.month && route.query.year) {
    selectedMonth.value = parseInt(route.query.month);
    year.value = parseInt(route.query.year);
  }

  setMonthDateRange(selectedMonth.value, year.value);
  await getAction();
});

watch(
  [date_range, crmSearch, customerSearch, per_page],
  debounce(async () => {
    await getAction();
  }, 500)
);
</script>
