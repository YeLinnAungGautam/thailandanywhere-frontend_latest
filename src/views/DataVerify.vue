<template>
  <Layout :is_white="true">
    <div
      :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
      class="space-x-8 col-span-3 flex justify-start items-center transition-all duration-200 gap-2 text-sm pb-4 absolute top-6"
    >
      <p class="text-xl font-medium text-[#FF613c]">
        Data Verify
        <span class="w-2 h-2 bg-[#FF613c] rounded-full inline-block"></span>
        <span class="pl-2" v-if="detailVal?.id">{{ detailVal.id }}</span>
      </p>
      <div class="flex items-center gap-4">
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
    </div>
    <div class="relative z-40">
      <VerifyList />
    </div>

    <div class="grid gap-4 relative grid-cols-3 pt-2">
      <transition name="slide">
        <div
          class="border shadow-sm rounded-lg p-4"
          :class="{
            hidden: showSide == 2,
            'col-span-1': showSide == 1,
            'col-span-2': showSide == 3,
          }"
        >
          <div class="pb-4 flex justify-start items-center gap-x-3 relative">
            <div
              @click="filterShow = !filterShow"
              class="bg-blue-600 px-2 rounded-lg shadow py-1 flex justify-center items-center gap-x-2 text-white text-xs cursor-pointer"
            >
              <FunnelIcon class="w-5 h-5 text-white" />
              <p>Filter</p>
              <p>{{ searchCount }}</p>
            </div>

            <transition name="slide">
              <div
                v-if="filterShow"
                class="absolute top-full px-4 left-0 w-[300px] transition-all duration-150 bg-white rounded-lg shadow-lg z-50 border border-gray-100 space-y-2 max-h-[50vh] overflow-y-scroll"
              >
                <div
                  class="flex justify-between items-center pt-4 border-b border-gray-100 pb-1 sticky top-0 bg-white"
                >
                  <p class="text-xs font-medium">Filter</p>
                  <p class="text-[10px] cursor-pointer" @click="clearFilter">
                    clear
                  </p>
                </div>

                <div class="relative w-full">
                  <p class="text-[10px] pb-2">Sender</p>
                  <input
                    type="search"
                    v-model="searchKey.sender"
                    placeholder="Search sender"
                    class="text-[10px] text-gray-500 focus:outline-none hover:text-gray-600 border border-gray-300 rounded-lg bg-white px-4 py-2 w-full"
                  />
                </div>

                <div class="relative w-full">
                  <p class="text-[10px] pb-2">Receiver</p>
                  <input
                    type="search"
                    v-model="searchKey.receiver"
                    placeholder="Search receiver"
                    class="text-[10px] text-gray-500 focus:outline-none hover:text-gray-600 border border-gray-300 rounded-lg bg-white px-4 py-2 w-full"
                  />
                </div>

                <div>
                  <p class="text-[10px] pb-2">Currency</p>
                  <select
                    v-model="searchKey.currency"
                    class="border border-gray-300 px-4 focus:outline-none w-full py-2 text-[10px] rounded-lg"
                  >
                    <option value="">All Currency</option>
                    <option value="THB">THB</option>
                    <option value="MMK">MMK</option>
                    <option value="USD">USD</option>
                  </select>
                </div>

                <div
                  class="sticky bottom-0 w-full pb-4 pt-2 border-t border-gray-200 bg-white"
                >
                  <p
                    class="text-[12px] bg-[#FF613c] px-2 py-2 rounded-lg text-center text-white cursor-pointer"
                    @click="searchAction"
                  >
                    Search
                  </p>
                </div>
              </div>
            </transition>

            <div class="relative w-full">
              <input
                type="search"
                v-model="searchKey.crm_id"
                placeholder="Search by CRM ID or Amount"
                class="w-full px-4 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
              />
              <div
                @click="searchAction"
                class="absolute right-1 top-1 rounded-lg text-xs p-1 bg-[#FF613c]"
              >
                <MagnifyingGlassIcon class="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          <!-- Active Filters Display -->
          <div
            class="flex justify-start items-center overflow-x-scroll no-sidebar-container pt-0.5 space-x-3 pb-2"
          >
            <p
              @click="clearFilter"
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap bg-red-500 text-white cursor-pointer"
            >
              clear
            </p>
            <p
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap relative"
              v-if="searchKey.sender"
            >
              <XCircleIcon
                class="w-4 h-4 text-[#FF613c] cursor-pointer absolute -top-1 -right-2"
                @click="
                  () => {
                    searchKey.sender = '';
                    searchAction();
                  }
                "
              />
              Sender: {{ searchKey.sender }}
            </p>
            <p
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap relative"
              v-if="searchKey.receiver"
            >
              <XCircleIcon
                class="w-4 h-4 text-[#FF613c] cursor-pointer absolute -top-1 -right-2"
                @click="
                  () => {
                    searchKey.receiver = '';
                    searchAction();
                  }
                "
              />
              Receiver: {{ searchKey.receiver }}
            </p>
            <p
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap relative"
              v-if="searchKey.currency"
            >
              <XCircleIcon
                class="w-4 h-4 text-[#FF613c] cursor-pointer absolute -top-1 -right-2"
                @click="
                  () => {
                    searchKey.currency = '';
                    searchAction();
                  }
                "
              />
              {{ searchKey.currency }}
            </p>
          </div>

          <!-- Cash Image List -->
          <div
            v-if="!loading"
            class="bg-white mt-2 shadow rounded-lg divide-y divide-gray-100 max-h-[59vh] overflow-y-scroll relative"
          >
            <div
              class="cursor-pointer p-3 transition-colors"
              v-for="item in cashImages?.data ?? []"
              :key="item.id"
              @click="getDetailAction(item.id)"
              :class="{
                'bg-[#FF613c]/30': selectedItem == item.id,
                'bg-green-50': selectedItem != item.id && item.data_verify == 1,
                'bg-red-50': selectedItem != item.id && item.data_verify != 1,
              }"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <p class="text-sm font-medium text-gray-900">
                      {{ item.crm_id || `#${item.id}` }}
                    </p>
                  </div>
                  <p class="text-xs text-gray-600 mb-1">
                    {{ item.sender }} → {{ item.receiver }}
                  </p>
                  <div class="flex items-center gap-4 text-xs text-gray-500">
                    <span>{{ formatDate(item.date) }}</span>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium">
                    {{ formatCurrency(item.amount) }}
                  </p>
                  <p class="text-xs text-gray-500">{{ item.currency }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="overflow-x-scroll no-sidebar-container py-2">
            <Pagination
              v-if="!loading"
              :data="cashImages"
              @change-page="changePage"
            />
          </div>

          <!-- Loading State -->
          <div
            v-if="loading"
            class="bg-white shadow rounded-lg divide-y-4 divide-gray-200 max-h-[75vh] overflow-y-scroll"
          >
            <div class="animate-pulse p-4" v-for="i in 10" :key="i">
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Right Side - Detail View -->
      <transition name="slide">
        <div
          class="relative"
          :class="{
            'col-span-2': showSide == 1,
            'col-span-1': showSide == 3,
            'col-span-3': showSide == 2,
          }"
        >
          <div class="absolute -top-4 -left-0 z-20">
            <ChevronLeftIcon
              class="w-6 cursor-pointer h-6 bg-white shadow-md border border-gray-200 p-1.5 rounded-full"
              @click="showSide = 2"
              v-if="showSide == 1"
            />
            <ChevronRightIcon
              class="w-6 cursor-pointer h-6 bg-white shadow-md border border-gray-200 p-1.5 rounded-full"
              @click="showSide = 1"
              v-if="showSide == 2"
            />
          </div>

          <div
            class="border shadow-sm relative rounded-lg p-4 h-[80vh] transition duration-150 overflow-y-scroll no-scrollbar"
          >
            <!-- Detail Content -->
            <div v-if="!loadingDetail && detailVal">
              <!-- Action Buttons -->
              <div class="flex justify-between items-center pb-4">
                <p class="text-lg font-medium">Cash Image Details</p>
                <div class="flex justify-end items-center gap-x-2">
                  <p
                    class="px-6 py-2 text-xs bg-red-500 text-white cursor-pointer rounded-lg"
                    @click="verifyStatus(false)"
                  >
                    Not Verified
                  </p>
                  <p
                    class="px-6 py-2 text-xs bg-green-500 text-white cursor-pointer rounded-lg"
                    @click="verifyStatus(true)"
                  >
                    Verified
                  </p>
                </div>
              </div>

              <!-- Image and Form -->
              <div class="grid grid-cols-2 gap-4">
                <!-- Image -->
                <div class="col-span-1">
                  <img
                    :src="detailVal.image"
                    class="w-full h-auto rounded-lg shadow"
                    alt="Cash image"
                  />
                </div>

                <!-- Form -->
                <div class="col-span-1 space-y-4">
                  <div>
                    <label class="text-xs font-medium pb-2 block">Date</label>
                    <div
                      class="flex justify-between items-center w-full bg-white overflow-hidden border border-gray-300 rounded-lg"
                    >
                      <p class="text-xs px-3 py-2 flex-1" v-if="formData.date">
                        {{ formatDisplayDate(formData.date) }}
                      </p>
                      <input
                        type="datetime-local"
                        v-model="formData.date"
                        class="px-2 py-2 text-xs focus:outline-none border-l border-gray-300"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label class="text-xs font-medium pb-2 block">Sender</label>
                    <input
                      type="text"
                      v-model="formData.sender"
                      placeholder="Sender name"
                      class="w-full px-2 py-2 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                    />
                  </div>

                  <div>
                    <label class="text-xs font-medium pb-2 block"
                      >Receiver</label
                    >
                    <input
                      type="text"
                      v-model="formData.receiver"
                      placeholder="Receiver name"
                      class="w-full px-2 py-2 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                    />
                  </div>

                  <div>
                    <label class="text-xs font-medium pb-2 block">Amount</label>
                    <input
                      type="number"
                      v-model="formData.amount"
                      placeholder="Amount"
                      class="w-full px-2 py-2 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                    />
                  </div>

                  <div>
                    <label class="text-xs font-medium pb-2 block"
                      >Interact Bank</label
                    >
                    <select
                      v-model="formData.interact_bank"
                      class="w-full px-2 py-2 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                    >
                      <option value="personal">Personal</option>
                      <option value="company">Company</option>
                      <option value="cash_at_office">Cash at Office</option>
                      <option value="to_money_changer">To Money Changer</option>
                      <option value="deposit_management">
                        Deposit Management
                      </option>
                      <option value="pay_to_driver">Pay to Driver</option>
                    </select>
                  </div>

                  <div>
                    <label class="text-xs font-medium pb-2 block"
                      >Currency</label
                    >
                    <select
                      v-model="formData.currency"
                      class="w-full px-2 py-2 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                    >
                      <option value="MMK">MMK</option>
                      <option value="THB">THB</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>

                  <div class="flex justify-end items-center space-x-2 pt-4">
                    <p
                      @click="submitUpdate"
                      class="px-6 py-2 bg-green-500 text-white text-xs cursor-pointer rounded-lg"
                    >
                      Save Changes
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Loading or No Selection State -->
            <div
              class="flex justify-center items-center h-[400px]"
              v-if="loadingDetail && !selectedItem"
            >
              <p class="text-xs">Please select one item from the left panel.</p>
            </div>
            <div
              class="flex justify-center items-center h-[400px]"
              v-if="loadingDetail && selectedItem"
            >
              <div
                class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF613c]"
              ></div>
              <p class="ml-2 text-xs">Loading details...</p>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </Layout>
</template>

<script setup>
import Layout from "./Layout.vue";
import { computed, onMounted, ref, watch } from "vue";
import Pagination from "../components/PaginationExpense.vue";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/outline";
import { XCircleIcon } from "@heroicons/vue/24/solid";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { useSidebarStore } from "../stores/sidebar";
import { useCashImageStore } from "../stores/cashImage";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
import YearPickerVue from "./AccountingComponent/yearPicker.vue";
import VerifyList from "./CashImageCreate/VerifyList.vue";
import { formattedDateTime, formattedDateTimeDB } from "./help/FormatData";

// Store instances
const showSide = ref(1);
const filterShow = ref(false);
const router = useRouter();
const route = useRoute();
const sidebarStore = useSidebarStore();
const { isShowSidebar } = storeToRefs(sidebarStore);
const cashImageStore = useCashImageStore();
const { cashImages, loading } = storeToRefs(cashImageStore);
const toast = useToast();

// Date and time management
const currentDate = new Date();
const year = ref(currentDate.getFullYear());
const selectedMonth = ref(currentDate.getMonth() + 1);

// Search and filter
const searchKey = ref({
  crm_id: "",
  sender: "",
  receiver: "",
  currency: "",
});

// Detail management
const selectedItem = ref("");
const detailVal = ref(null);
const loadingDetail = ref(false);

// Form data
const formData = ref({
  id: "",
  date: "",
  sender: "",
  receiver: "",
  amount: 0,
  interact_bank: "personal",
  currency: "THB",
});

// Month array
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

// Computed properties
const searchCount = computed(() => {
  let count = 0;
  Object.values(searchKey.value).forEach((val) => {
    if (val && val !== "") count++;
  });
  return count;
});

const watchSystem = computed(() => {
  let result = {};

  Object.keys(searchKey.value).forEach((key) => {
    if (searchKey.value[key] && searchKey.value[key] !== "") {
      result[key] = searchKey.value[key];
    }
  });

  // Date range for current month/year
  if (year.value && selectedMonth.value) {
    const dateRange = generateDateRangeForMonth(
      selectedMonth.value,
      year.value
    );
    // result.date_from = dateRange.split(",")[0];
    // result.date_to = dateRange.split(",")[1];
    result.date = dateRange.split(",")[0] + "," + dateRange.split(",")[1];
  }

  result.limit = 20;

  return result;
});

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";

  const months = [
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

  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

// Methods
const searchAction = async () => {
  filterShow.value = false;
  await getAction();
};

const clearFilter = () => {
  searchKey.value = {
    crm_id: "",
    sender: "",
    receiver: "",
    currency: "",
  };
  filterShow.value = false;
  getAction();
};

const getAction = async () => {
  const res = await cashImageStore.getListAction(watchSystem.value);

  console.log(res, "this is get action");
};

const getDetailAction = async (id) => {
  selectedItem.value = id;
  router.push({
    name: route.name,
    query: {
      id: id,
      month: selectedMonth.value,
      year: year.value,
    },
  });
  await getDetail();
};

const getDetail = async () => {
  if (!selectedItem.value) return;

  loadingDetail.value = true;
  try {
    const res = await cashImageStore.getDetailAction(selectedItem.value);
    detailVal.value = res.result;

    // Populate form
    formData.value = {
      id: detailVal.value.id,
      date: formattedDateTime(detailVal.value.date),
      sender: detailVal.value.sender,
      receiver: detailVal.value.receiver,
      amount: detailVal.value.amount,
      interact_bank: detailVal.value.interact_bank || "personal",
      currency: detailVal.value.currency,
    };
  } catch (error) {
    console.error("Error fetching detail:", error);
    toast.error("Failed to load details");
  } finally {
    loadingDetail.value = false;
  }
};

const changePage = async (url) => {
  await cashImageStore.getChangePage(url, watchSystem.value);
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

const handleYearChange = (newYear) => {
  year.value = newYear;
  getAction();
};

const handleMonthChange = (month) => {
  selectedMonth.value = month;
  getAction();
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString();
};

const formatCurrency = (amount) => {
  if (!amount) return "0";
  return new Intl.NumberFormat().format(amount);
};

const formatDateForSubmit = (dateString) => {
  if (!dateString) return "";
  if (dateString.includes("T")) {
    return dateString.replace("T", " ");
  }
  return dateString;
};

const submitUpdate = async () => {
  loadingDetail.value = true;
  try {
    const frmData = new FormData();
    frmData.append("_method", "PUT");
    frmData.append("amount", formData.value.amount);
    frmData.append("date", formattedDateTimeDB(formData.value.date));
    frmData.append("sender", formData.value.sender);
    frmData.append("receiver", formData.value.receiver);
    frmData.append("interact_bank", formData.value.interact_bank);
    frmData.append("currency", formData.value.currency);

    await cashImageStore.updateAction(frmData, formData.value.id);

    toast.success("Update success");
    await getDetail();
    await getAction();
  } catch (error) {
    console.error("Error updating:", error);
    toast.error("Update failed");
  } finally {
    loadingDetail.value = false;
  }
};

const verifyStatus = async (status) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: `Mark this item as ${status}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#FF613c",
    cancelButtonColor: "#d33",
    confirmButtonText: `Yes, ${status}!`,
  });

  if (result.isConfirmed) {
    try {
      const frmData = new FormData();
      frmData.append("_method", "PUT");
      frmData.append("data_verify", status ? 1 : 0);

      await cashImageStore.cashImageVerify(frmData, selectedItem.value);

      toast.success(`Item marked as ${status}`);
      await getDetail();
      await getAction();
    } catch (error) {
      toast.error("Verification failed");
    }
  }
};

// Lifecycle
onMounted(async () => {
  if (route.query.month && route.query.year) {
    selectedMonth.value = parseInt(route.query.month);
    year.value = parseInt(route.query.year);
  }

  if (route.query.id) {
    selectedItem.value = route.query.id;
  }

  await getAction();

  if (selectedItem.value) {
    await getDetail();
  }
});
</script>

<style scoped>
.slide-enter-active {
  animation: slideIn 0.3s ease-out;
}

.slide-leave-active {
  animation: slideOut 0.3s ease-in;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}
</style>
