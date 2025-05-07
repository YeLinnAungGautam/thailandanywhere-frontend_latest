<template>
  <Layout :is_white="true" class="relative">
    <div class="">
      <div
        :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
        class="space-x-8 col-span-3 flex justify-start items-center transition-all duration-200 gap-2 text-sm pb-4 absolute top-6"
      >
        <p
          class="text-2xl flex justify-start items-center font-medium text-[#FF613c]"
        >
          Verify Invoice
          <span
            class="w-2 h-2 mx-3 bg-[#FF613c] rounded-full inline-block"
          ></span>
          <span class="mr-4">{{ detailVal?.crm_id }}</span>
          <YearPickerVue @year-change="handleYearChange" />
          <select
            v-model="selectedMonth"
            @change="handleMonthChange(selectedMonth)"
            class="px-3 text-black text-xs py-2 ml-4 rounded-lg border border-gray-400/20 focus:outline-none"
          >
            <option :value="m.id" v-for="m in monthArray" :key="m.id">
              {{ m.name }}
            </option>
          </select>
        </p>
      </div>
      <div class="w-full" v-if="bookings?.data">
        <ReservationList
          :lists="bookings ?? []"
          :loading="loading"
          v-model:selectedItem="selectedItem"
          @change_url="changeBookingUrl"
        />
      </div>
      <div class="flex justify-start items-center gap-x-2 py-4">
        <p
          @click="show = true"
          :class="show ? 'bg-[#FF613c] text-white' : ''"
          class="border border-gray-200 rounded-lg text-xs cursor-pointer px-4 py-2 w-[200px] text-center"
        >
          Sales
        </p>
        <p
          @click="show = false"
          :class="!show ? 'bg-[#FF613c] text-white' : ''"
          class="border border-gray-200 rounded-lg text-xs cursor-pointer px-4 py-2 w-[200px] text-center"
        >
          Expense
        </p>
      </div>
      <div class="grid grid-cols-3 col-span-2 gap-x-4">
        <div
          v-if="!show"
          class="flex justify-start items-center border-y border-gray-200 py-2 pr-4 mr-4 overflow-x-scroll no-sidebar-container"
        >
          <div
            v-for="i in 20 ?? []"
            :key="i"
            class="rounded-lg px-2 py-1 mx-1"
            :class="i == 2 ? 'text-[#FF613c] font-semibold' : ''"
          >
            <p class="whitespace-nowrap text-xs">-00{{ i }}</p>
          </div>
        </div>
        <div v-if="show">
          <div
            @click="openPrintModal = true"
            class="bg-[#FF613c] text-white rounded-lg text-xs text-center cursor-pointer px-4 py-2 flex justify-center items-center gap-x-4"
          >
            <DocumentIcon class="w-4 h-4 text-white" />
            <p>See Invoice</p>
          </div>
        </div>
        <div class="flex justify-between items-center col-span-2">
          <p class="text-lg font-medium">{{ show ? "Sales" : "Expense" }}</p>
          <div class="flex justify-between items-center">
            <div class="flex justify-start items-center gap-x-2">
              <p class="px-4 py-2 text-xs bg-red-500 text-white rounded-lg">
                Raise Issue
              </p>
              <p class="px-6 py-2 text-xs bg-green-500 text-white rounded-lg">
                Verify
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-3 pt-5 gap-x-4">
        <div class="col-span-1 grid grid-cols-3 gap-2" v-if="!show">
          <div class="space-y-2 rounded-lg overflow-y-auto h-[400px]">
            <div class="" v-for="i in 5" :key="i">
              <img
                src="https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE="
                alt=""
              />
            </div>
          </div>
          <img
            class="col-span-2 w-full h-auto overflow-hidden rounded-lg"
            src="https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE="
            alt=""
          />
        </div>
        <div class="col-span-1 grid grid-cols-3 gap-2" v-if="show">
          <div class="space-y-2 rounded-lg overflow-y-auto h-[400px]">
            <div
              class=""
              v-for="i in detailVal?.receipts"
              :key="i"
              @click="showReceipt = i?.image"
            >
              <img :src="i?.image" alt="" />
            </div>
          </div>
          <img
            class="col-span-2 w-full h-auto overflow-hidden rounded-lg"
            :src="!showReceipt ? detailVal?.receipts[0]?.image : showReceipt"
            alt=""
          />
        </div>
        <div class="col-span-2">
          <div class="p-3 rounded-lg border border-gray-200" v-if="!show">
            <VerifyExpense />
          </div>
          <div class="p-3 rounded-lg border border-gray-200" v-if="show">
            <VerifySale :data="detailVal" />
          </div>
        </div>
      </div>
    </div>
    <Modal :isOpen="openPrintModal" @closeModal="openPrintModal = false">
      <DialogPanel
        class="w-full max-w-6xl transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-lg font-medium leading-6 text-gray-900 mb-5 flex justify-between items-center"
        >
          <span class="pl-4">Print Invoice as PNG</span>
          <XMarkIcon
            class="w-6 h-6 text-black cursor-pointer"
            @click="openPrintModal = false"
          />
        </DialogTitle>
        <div>
          <PngUsage :invoice_id="route.query.id" />
        </div>
      </DialogPanel>
    </Modal>
  </Layout>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useSidebarStore } from "../stores/sidebar";
import Layout from "./Layout.vue";
import ReservationList from "./VerifyInvoiceComponent/ReservationList.vue";
import VerifyExpense from "./VerifyInvoiceComponent/VerifyExpense.vue";
import { ref, computed, onMounted, watch } from "vue";
import VerifySale from "./VerifyInvoiceComponent/VerifySale.vue";
import YearPickerVue from "./AccountingComponent/yearPicker.vue";
import { useBookingStore } from "../stores/booking";
import { useRoute, useRouter } from "vue-router";
import { DocumentIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import Modal from "../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import PngUsage from "./PngGenerate/PngUsage.vue";

const bookingStore = useBookingStore();
const { bookings, loading } = storeToRefs(bookingStore);
const currentDate = new Date();
const year = ref(currentDate.getFullYear());
const selectedMonth = ref(currentDate.getMonth() + 1); // Adding 1 since getMonth() returns 0-11
const date_range = ref("");
const openPrintModal = ref(false);

const selectedItem = ref("");
const router = useRouter();
const route = useRoute();

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

const generateDateRangeForMonth = (month, yearValue) => {
  // Month should be 1-12 (for Jan-Dec)
  const startDate = new Date(yearValue, month - 1, 1);

  // Get the last day of the month
  const endDate = new Date(yearValue, month, 0);

  // Format dates as YYYY-MM-DD
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return `${formatDate(startDate)},${formatDate(endDate)}`;
};

const showReceipt = ref("");

const setMonthDateRange = (month, yearValue) => {
  date_range.value = generateDateRangeForMonth(month, yearValue);
};

const handleYearChange = (message) => {
  year.value = message;
  // Update date range when year changes
  setMonthDateRange(selectedMonth.value, year.value);
};

// Method to handle month change
const handleMonthChange = (month) => {
  selectedMonth.value = month;
  // Update date range when month changes
  setMonthDateRange(month, year.value);
};

const watchSystem = computed(() => {
  let result = {};
  if (date_range.value) {
    // result.sale_daterange = date_range.value;
    result.booking_date_from = date_range.value.split(",")[0];
    result.booking_date_to = date_range.value.split(",")[1];
  }
  result.status = "fully_paid";
  result.limit = 20;
  return result;
});

const changeBookingUrl = async (message) => {
  await bookingStore.getChangePage(message, watchSystem.value);
  showReceipt.value = null;
};

const getAction = async () => {
  const res = await bookingStore.getListAction(watchSystem.value);
};

const siderBarStore = useSidebarStore();
const { isShowSidebar } = storeToRefs(siderBarStore);

const show = ref(true);
const detailVal = ref(null);

const getDetail = async () => {
  const res = await bookingStore.getDetailAction(selectedItem.value);
  detailVal.value = res.result;
  console.log(detailVal.value);
};

onMounted(async () => {
  if (route.query.month && route.query.year) {
    selectedMonth.value = route.query.month;
    year.value = route.query.year;
  }
  // Initialize date range with current month and year
  setMonthDateRange(selectedMonth.value, year.value);

  if (route.query.id) {
    selectedItem.value = route.query.id;
  }
});

watch(selectedItem, async (newValue) => {
  if (newValue) {
    router.push({
      name: "verifyInvoices",
      query: {
        id: newValue,
        month: selectedMonth.value,
        year: year.value,
      },
    });
  }
  await getDetail();
});

watch(date_range, async (newValue) => {
  if (newValue) {
    await getAction();
    // console.log(watchSystem.value);
  }
});
</script>
