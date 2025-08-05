<template>
  <Layout :is_white="true" class="relative">
    <div
      :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
      class="space-x-8 col-span-3 flex justify-start items-center transition-all duration-200 gap-2 text-sm pb-4 absolute top-6"
    >
      <p
        class="text-2xl flex justify-start items-center font-medium text-[#FF613c]"
      >
        External Audit
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

          <p
            @click="exportCSV"
            class="px-3 text-xs py-2 rounded-lg border border-gray-400/20 focus:outline-none bg-[#FF613c] text-white"
          >
            Export CSV
          </p>
          <p
            @click="printPDF"
            class="px-3 text-xs py-2 rounded-lg border border-gray-400/20 focus:outline-none bg-[#FF613c] text-white cursor-pointer"
            :class="{ 'opacity-50 cursor-not-allowed': !pdfStore.canGenerate }"
          >
            <span v-if="!pdfStore.isGenerating">Print All CashImages PDF</span>
            <span v-else class="flex items-center">
              <div
                class="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"
              ></div>
              {{ pdfStore.message }}
            </span>
          </p>
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
          <div>
            <select
              name=""
              id=""
              v-model="sort_order"
              class="pl-3 pr-3 py-2 text-xs border border-gray-400/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
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
        <div class="w-full overflow-x-auto">
          <table
            v-if="cashAccounts?.data.length > 0 && !loadingCash"
            class="w-full text-xs border border-gray-500"
          >
            <thead class="border border-gray-500">
              <tr class="bg-gray-200 divide-x divide-gray-500">
                <th class="text-xs text-center font-medium py-3 px-2">Date</th>
                <th class="text-xs text-center font-medium py-3 px-2">
                  Invoice Number
                </th>
                <th class="text-xs text-center font-medium py-3 px-2">
                  Customer Name
                </th>
                <th class="text-xs text-center font-medium py-3 px-2">
                  Taxpayer Identification Number
                </th>
                <th class="text-xs text-center font-medium py-3 px-2">
                  Establishment
                </th>
                <th class="text-xs text-center font-medium py-3 px-2">
                  Total Value
                </th>
                <th class="text-xs text-center font-medium py-3 px-2">
                  Amount VAT
                </th>
                <th class="text-xs text-center font-medium py-3 px-2">Hotel</th>
                <th class="text-xs text-center font-medium py-3 px-2">
                  Restaurant
                </th>
                <th class="text-xs text-center font-medium py-3 px-2">
                  Ticket
                </th>
                <th class="text-xs text-center font-medium py-3 px-2">
                  Hotel Amount
                </th>
                <th class="text-xs text-center font-medium py-3 px-2">
                  Ticket Amount
                </th>
                <th class="text-xs text-center font-medium py-3 px-2">
                  Profit Share
                </th>
                <th class="text-xs text-center font-medium py-3 px-2">
                  Cash Amount
                </th>
                <th class="text-xs text-center font-medium py-3 px-2">
                  Interact Bank
                </th>
                <th class="text-xs text-center font-medium py-3 px-2">
                  Deposit Count
                </th>
                <th class="text-xs text-center font-medium py-3 px-2">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in cashAccounts.data"
                :key="item.cash_image_id"
                class="bg-gray-50 odd:bg-white group relative divide-x divide-gray-500 hover:bg-gray-100"
              >
                <td class="px-2 py-2 text-xs whitespace-nowrap text-center">
                  {{ formatDateForTime(item.cash_image_date) }}
                </td>
                <td
                  class="px-2 py-2 text-xs whitespace-nowrap text-center font-medium"
                >
                  {{ item.crm_id }}
                </td>

                <td class="px-2 py-2 text-xs text-center">
                  {{ item.customer_name }}
                </td>
                <td class="px-2 py-2 text-xs text-center">0000000000000</td>
                <td class="px-2 py-2 text-xs text-center">00000</td>
                <td
                  class="px-2 py-2 text-xs whitespace-nowrap text-end font-medium"
                >
                  {{ formattedNumber(item.total_sales) }} {{ item.currency }}
                </td>
                <td class="px-2 py-2 text-xs text-end">
                  {{
                    formattedNumber(
                      calculateVat(item.total_sales, item.commission)
                    )
                  }}
                </td>
                <td class="px-2 py-2 text-xs text-center">
                  <CheckIcon
                    class="w-4 h-4"
                    v-if="item.hotel_service_total > 0"
                  />
                </td>
                <td class="px-2 py-2 text-xs text-center"></td>
                <td class="px-2 py-2 text-xs text-center">
                  <CheckIcon
                    class="w-4 h-4"
                    v-if="item.ticket_service_total > 0"
                  />
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

                <td class="px-2 py-2 text-xs text-end">
                  {{ formattedNumber(item.commission) }}
                </td>
                <!-- <td class="px-2 py-2 text-xs text-end">
                  {{ formattedNumber(item.total_sales - item.commission) }}
                </td>

                <td class="px-2 py-2 text-xs text-end">
                  {{
                    formattedNumber(
                      item.total_sales -
                        item.commission -
                        calculateVat(item.total_sales, item.commission)
                    )
                  }}
                </td> -->

                <td class="px-2 py-2 text-xs text-end">
                  {{ formattedNumber(item.cash_amount) }} {{ item.currency }}
                </td>
                <td class="px-2 py-2 text-xs capitalize text-end">
                  {{ item.bank + " Bank" }}
                </td>
                <td class="px-2 py-2 whitespace-nowrap text-xs text-end">
                  {{ item.deposit }}
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
        </div>
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

    <Modal :isOpen="showPdfModal" @closeModal="closePdfModal">
      <DialogPanel
        class="w-full max-w-md transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 p-4 border-b"
        >
          PDF Generation Status
        </DialogTitle>

        <div class="p-4">
          <!-- Progress Section -->
          <div v-if="pdfStore.isGenerating" class="space-y-4">
            <div class="text-center">
              <div class="text-sm text-gray-600 mb-2">
                {{ pdfStore.message }}
              </div>

              <!-- Progress Bar -->
              <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div
                  class="bg-[#FF613c] h-2.5 rounded-full transition-all duration-300"
                  :style="{ width: pdfStore.progress + '%' }"
                ></div>
              </div>

              <div class="text-xs text-gray-500">{{ pdfStore.progress }}%</div>
            </div>

            <!-- Status Info -->
            <div class="text-center">
              <div class="text-sm">
                <strong>Status:</strong>
                <span :class="getStatusClass()">{{ getStatusText() }}</span>
              </div>

              <div
                v-if="pdfStore.currentJob"
                class="text-xs text-gray-400 mt-2"
              >
                Job ID: {{ pdfStore.currentJob.id }}<br />
                Started: {{ formatDateTime(pdfStore.currentJob.startedAt) }}
              </div>
            </div>
          </div>

          <!-- Success Section -->
          <div v-if="pdfStore.isCompleted" class="text-center space-y-4">
            <div class="text-green-600 text-lg">
              <svg
                class="w-12 h-12 mx-auto mb-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              PDF ပြီးပါပြီ!
            </div>

            <div class="space-y-2">
              <div class="text-sm text-gray-600">{{ pdfStore.filename }}</div>
              <button
                @click="handleDownload"
                class="w-full px-4 py-2 bg-[#FF613c] text-white rounded-lg hover:bg-[#e55139] transition-colors"
              >
                📄 Download PDF
              </button>
            </div>
          </div>

          <!-- Error Section -->
          <div v-if="pdfStore.isFailed" class="text-center space-y-4">
            <div class="text-red-600 text-lg">
              <svg
                class="w-12 h-12 mx-auto mb-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              အမှားဖြစ်ပါတယ်
            </div>

            <div class="text-sm text-gray-600 mb-4">{{ pdfStore.error }}</div>

            <div class="space-x-2">
              <button
                @click="handleRetry"
                class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                🔄 Try Again
              </button>
              <button
                @click="closePdfModal"
                class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        <!-- Close button for completed/failed states -->
        <div v-if="!pdfStore.isGenerating" class="p-4 border-t text-right">
          <button
            @click="closePdfModal"
            class="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </DialogPanel>
    </Modal>
  </Layout>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useSidebarStore } from "../stores/sidebar";
import Layout from "./Layout.vue";
import { computed, onMounted, ref, watch, onUnmounted } from "vue";
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
import { CheckIcon } from "@heroicons/vue/24/solid";
import { usePdfStore } from "../stores/pdf";

const sideBarStore = useSidebarStore();
const toast = useToast();
const { isShowSidebar } = storeToRefs(sideBarStore);
const cashImageStore = useCashImageStore();
const pdfStore = usePdfStore();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const showPdfModal = ref(false);

const {
  isGenerating: pdfIsGenerating,
  progress: pdfProgress,
  status: pdfStatus,
  message: pdfMessage,
  downloadUrl: pdfDownloadUrl,
  filename: pdfFilename,
  error: pdfError,
  currentJob: pdfCurrentJob,
  canGenerate: pdfCanGenerate,
  isCompleted: pdfIsCompleted,
  isFailed: pdfIsFailed,
  isProcessing: pdfIsProcessing,
} = storeToRefs(pdfStore);

// Updated to use cashAccounts instead of cashImages
const { cashAccounts, loadingCash } = storeToRefs(cashImageStore);

// Search and filter states
const date_range = ref("");
const filterType = ref("all");
const crmSearch = ref("");
const customerSearch = ref("");
const per_page = ref(100);
const sort_order = ref("desc");
const sort_by = ref("date");

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

  // Add time formatting
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day} ${month} ${year}, ${hours}:${minutes}`;
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

  if (sort_order.value) {
    params.sort_by = "date";
    params.sort_order = sort_order.value;
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

const exportCSV = async () => {
  const res = await cashImageStore.exportCsv(searchParams.value);
  if (res.status == 1) {
    window.open(res.result.download_link);
  } else {
    toast.error(res.message);
  }
};

const printPDF = async () => {
  if (!pdfStore.canGenerate) {
    toast.warning("PDF generation လုပ်နေဆဲပါ၊ ခဏစောင့်ပါ...");
    return;
  }

  try {
    showPdfModal.value = true; // Show the modal
    await pdfStore.generatePdf(searchParams.value);
  } catch (error) {
    console.error("PDF Generation failed:", error);
    toast.error("PDF generation မှာ အမှားဖြစ်ပါတယ်");
  }
};

// Modal management functions
const closePdfModal = () => {
  // Only close if not generating
  if (!pdfStore.isGenerating) {
    showPdfModal.value = false;
    pdfStore.resetState();
  }
};

const handleDownload = () => {
  if (pdfStore.downloadUrl && pdfStore.filename) {
    pdfStore.downloadPdf(pdfStore.downloadUrl, pdfStore.filename);
    toast.success("PDF downloaded successfully!");
  }
};

const handleRetry = async () => {
  try {
    await pdfStore.retryGeneration();
  } catch (error) {
    console.error("Retry failed:", error);
    toast.error("Retry မှာ အမှားဖြစ်ပါတယ်");
  }
};

// Helper functions for the modal
const getStatusClass = () => {
  switch (pdfStore.status) {
    case "completed":
      return "text-green-600";
    case "failed":
      return "text-red-600";
    case "processing":
      return "text-blue-600";
    default:
      return "text-gray-600";
  }
};

const getStatusText = () => {
  const statusTexts = {
    queued: "Queue မှာ စောင့်နေတယ်",
    processing: "လုပ်နေတယ်",
    completed: "ပြီးပါပြီ",
    failed: "အမှားဖြစ်တယ်",
  };
  return statusTexts[pdfStore.status] || pdfStore.status;
};

const formatDateTime = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Watch for PDF completion to show success message
watch(
  () => pdfStore.isCompleted,
  (newVal) => {
    if (newVal) {
      toast.success("PDF ပြီးပါပြီ! Download လုပ်လို့ရပါပြီ။");
    }
  }
);

// Watch for PDF errors
watch(
  () => pdfStore.isFailed,
  (newVal) => {
    if (newVal) {
      toast.error("PDF generation မှာ အမှားဖြစ်ပါတယ်");
    }
  }
);

// Cleanup on component unmount
onUnmounted(() => {
  pdfStore.stopStatusChecking();
});

onMounted(async () => {
  if (route.query.month && route.query.year) {
    selectedMonth.value = parseInt(route.query.month);
    year.value = parseInt(route.query.year);
  }

  setMonthDateRange(selectedMonth.value, year.value);
  // await getAction();
});

watch(
  [date_range, crmSearch, customerSearch, per_page, sort_order],
  debounce(async () => {
    await getAction();
  }, 500)
);
</script>
