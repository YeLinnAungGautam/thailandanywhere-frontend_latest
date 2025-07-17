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
          @click="
            () => {
              show = false;
              detailValItem = detailVal.items[0];
            }
          "
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
            v-for="i in detailVal?.items ?? []"
            :key="i"
            class="rounded-lg px-2 py-1 mx-1"
            @click="
              () => {
                detailValItem = i;
                haveCrmId = i.crm_id;
              }
            "
            :class="detailValItem?.id == i?.id ? 'bg-[#FF613c] text-white' : ''"
          >
            <p class="whitespace-nowrap text-xs">
              -{{ i.crm_id.split("_")[1] }}
            </p>
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
              <p class="px-4 py-2 text-xs bg-gray-300 text-white rounded-lg">
                Raise Sale Issue
              </p>
              <p
                class="px-6 py-2 text-xs bg-red-500 text-white cursor-pointer rounded-lg"
                @click="verifyBooking(detailVal.id, 'unverified')"
              >
                No Verified
              </p>
              <p
                class="px-6 py-2 text-xs bg-green-500 text-white cursor-pointer rounded-lg"
                @click="verifyBooking(detailVal.id, 'verified')"
              >
                Verified
              </p>
            </div>
          </div>
          <!-- <div class="flex justify-between items-center" v-if="!show">
            <div class="flex justify-start items-center gap-x-2">
              <p class="px-4 py-2 text-xs bg-red-500 text-white rounded-lg">
                Raise Cost Issue
              </p>
            </div>
          </div> -->
        </div>
      </div>
      <div
        class="flex justify-center items-center h-[400px] pt-5 gap-x-4"
        v-if="loadingDetail && !route.query.id"
      >
        <p class="text-xs">Please select one reservation .</p>
      </div>
      <div
        class="flex justify-center items-center h-[400px] pt-5 gap-x-4"
        v-if="loadingDetail"
      >
        <p class="text-xs">loading detail, please wait ;</p>
      </div>
      <div class="grid grid-cols-3 pt-5 gap-x-4" v-if="!loadingDetail">
        <div class="col-span-1 grid grid-cols-3 gap-2" v-if="!show">
          <div class="space-y-2 rounded-lg overflow-y-auto h-[400px]">
            <div
              class="relative"
              v-for="i in detailValItem?.receipt_images ?? []"
              :key="i"
              @click="imageItemData = i"
            >
              <img
                :src="i?.file"
                alt=""
                :class="
                  imageItemData?.id == i?.id
                    ? checkDataFailOrSuccess(imageItemData)
                      ? 'border-2 border-green-500 rounded-lg'
                      : 'border-2 border-red-500 rounded-lg'
                    : ''
                "
              />
              <div
                class="absolute top-1 right-1 w-4 h-4 rounded-full"
                :class="
                  imageItemData?.id == i?.id
                    ? checkDataFailOrSuccess(imageItemData)
                      ? 'bg-green-500'
                      : 'bg-red-500'
                    : ''
                "
              >
                <XMarkIcon
                  class="w-4 h-4 text-white"
                  v-if="!checkDataFailOrSuccess(imageItemData)"
                />
                <CheckIcon
                  class="w-4 h-4 text-white"
                  v-if="checkDataFailOrSuccess(imageItemData)"
                />
              </div>
            </div>
          </div>
          <div class="relative col-span-2 w-full h-full">
            <div class="absolute top-1 right-1">
              <p
                @click="openModal(imageItemData)"
                class="text-[10px] shadow-lg cursor-pointer text-white bg-[#FF613c] px-2 py-1 rounded-lg"
              >
                Fill data
              </p>
            </div>
            <img
              class="col-span-2 w-full h-auto overflow-hidden rounded-lg"
              :src="imageItemData?.file"
              alt=""
            />
          </div>
        </div>
        <div class="col-span-1 grid grid-cols-3 gap-2" v-if="show">
          <div class="space-y-2 rounded-lg overflow-y-auto h-[400px]">
            <div
              class="relative"
              v-for="i in detailVal?.receipts"
              :key="i"
              @click="imageData = i"
            >
              <img
                :src="i?.image"
                alt=""
                :class="
                  imageData?.id == i?.id
                    ? checkDataFailOrSuccess(imageData)
                      ? 'border-2 border-green-500 rounded-lg'
                      : 'border-2 border-red-500 rounded-lg'
                    : ''
                "
              />
              <div
                class="absolute top-1 right-1 w-4 h-4 rounded-full"
                :class="
                  imageData?.id == i?.id
                    ? checkDataFailOrSuccess(imageData)
                      ? 'bg-green-500'
                      : 'bg-red-500'
                    : ''
                "
              >
                <XMarkIcon
                  class="w-4 h-4 text-white"
                  v-if="!checkDataFailOrSuccess(imageData)"
                />
                <CheckIcon
                  class="w-4 h-4 text-white"
                  v-if="checkDataFailOrSuccess(imageData)"
                />
              </div>
            </div>
          </div>
          <div class="relative col-span-2 w-full h-full">
            <div class="absolute top-1 right-1">
              <p
                @click="openModal(imageData)"
                class="text-[10px] shadow-lg cursor-pointer text-white bg-[#FF613c] px-2 py-1 rounded-lg"
              >
                Fill data
              </p>
            </div>
            <img
              class="col-span-2 w-full h-auto overflow-hidden rounded-lg"
              :src="
                !imageData ? detailVal?.receipts[0]?.image : imageData?.image
              "
              alt=""
            />
          </div>
        </div>
        <div class="col-span-2">
          <div class="p-3 rounded-lg border border-gray-200" v-if="!show">
            <VerifyExpense :data="detailVal" />
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
    <Modal :isOpen="carModalOpen" @closeModal="clearAction">
      <DialogPanel
        class="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white/80 backdrop-blur-md text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-2 px-4"
        >
          <p>Payment Slip Audit</p>
          <XCircleIcon class="w-5 h-5 text-white" @click="clearAction" />
        </DialogTitle>
        <!-- show date  -->
        <div class="p-4">
          <div class="grid grid-cols-2 gap-8">
            <div>
              <img
                :src="formData?.file"
                class="rounded-lg shadow hover:shadow-none min-h-[400px] w-full"
                alt=""
              />
            </div>
            <div class="space-y-4 relative pt-4 pb-14 pr-2">
              <div class="">
                <p for="" class="text-[12px] font-medium pb-2">
                  Date <span class="opacity-0">......</span>
                </p>
                <div
                  class="flex justify-between items-center w-full bg-white pl-2 rounded-lg"
                >
                  <p class="text-start text-xs" v-if="formData?.date">
                    {{
                      formData.date.includes("T")
                        ? formatDate(formData.date)
                        : formatDateFromDb(formData.date)
                    }}
                  </p>
                  <input
                    type="datetime-local"
                    name=""
                    v-model="formData.date"
                    format="YYYY-MM-DD HH:mm:ss"
                    class="w-[35px] px-2 py-2 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                    id=""
                  />
                </div>
              </div>

              <div class="">
                <p for="" class="text-[12px] font-medium pb-2">Sender</p>
                <input
                  type="text"
                  v-model="formData.sender"
                  :class="formData.sender.includes('-') ? 'text-gray-400' : ''"
                  name=""
                  placeholder="xxx"
                  class="w-full px-2 py-2 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                  id=""
                />
              </div>
              <div class="">
                <p for="" class="text-[12px] font-medium pb-2">Reciever</p>
                <input
                  type="text"
                  v-model="formData.reciever"
                  :class="
                    formData.reciever.includes('-') ? 'text-gray-400' : ''
                  "
                  name=""
                  placeholder="xxx"
                  class="w-full px-2 py-2 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                  id=""
                />
              </div>
              <div class="">
                <p for="" class="text-[12px] font-medium pb-2">Amount</p>
                <input
                  type="number"
                  v-model="formData.amount"
                  name=""
                  placeholder="xxx"
                  class="w-full px-2 py-2 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                  id=""
                />
              </div>
              <div class="">
                <p for="" class="text-[12px] font-medium pb-2">
                  Interact Bank <span class="opacity-0">.....</span>
                </p>
                <select
                  name=""
                  v-model="formData.interact_bank"
                  id=""
                  class="w-full px-2 py-2 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                >
                  <option value="personal">Personal</option>
                  <option value="company">Company</option>
                  <option value="cash_at_office">Cash at Office</option>
                  <option value="to_money_changer">To Money Changer</option>
                </select>
              </div>
              <div class="flex justify-between items-center">
                <label for="" class="text-[12px] font-medium">Currency </label>
                <select
                  name=""
                  v-model="formData.currency"
                  id=""
                  class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                >
                  <option value="MMK">MMK</option>
                  <option value="THB">THB</option>
                  <option value="USD">USD</option>
                </select>
              </div>

              <div
                class="flex justify-end items-center space-x-2 absolute bottom-0 right-0"
              >
                <p
                  @click.prevent="submit"
                  class="px-3 py-1 bg-green-500 text-white text-[12px] cursor-pointer rounded-lg"
                >
                  save
                </p>
                <p
                  @click="clearAction"
                  class="px-3 py-1 bg-white border border-gray-300 text-[12px] cursor-pointer rounded-lg"
                >
                  close
                </p>
              </div>
            </div>
          </div>
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
import {
  CheckIcon,
  DocumentIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import Modal from "../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import PngUsage from "./PngGenerate/PngUsage.vue";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
import { useReservationStore } from "../stores/reservation";
import { useCashImageStore } from "../stores/cashImage";

const bookingStore = useBookingStore();
const { bookings, loading } = storeToRefs(bookingStore);
const cashImageStore = useCashImageStore();
const reservationStore = useReservationStore();
const currentDate = new Date();
const year = ref(currentDate.getFullYear());
const selectedMonth = ref(currentDate.getMonth() + 1); // Adding 1 since getMonth() returns 0-11
const date_range = ref("");
const openPrintModal = ref(false);

const selectedItem = ref("");
const haveCrmId = ref("");
const router = useRouter();
const route = useRoute();
const toast = useToast();
const verify_status = ref("");
const carModalOpen = ref(false);

const loadingDetail = ref(true);

const formData = ref({
  id: "",
  file: null,
  amount: 0,
  date: "",
  bank_name: "",
  sender: "",
  reciever: "",
  interact_bank: "",
  currency: "THB",
  is_corporate: false,
  comment: "",
});

const openModal = (data) => {
  carModalOpen.value = true;
  // save.value = data;
  formData.value = {
    id: data.id,
    file: data.image || data.file,
    amount: data.amount,
    date: data.date,
    bank_name: data.bank_name,
    sender: data.sender
      ? data.sender
      : !show.value
      ? "MR. THIHA@KUMAR BHUSAL"
      : "",
    reciever: data.reciever
      ? data.reciever
      : show.value
      ? "MR. THIHA@KUMAR BHUSAL"
      : "",
    interact_bank: data.interact_bank,
    currency: data.currency,
    is_corporate: data.is_corporate == 1 ? true : false,
    comment: data.note,
  };
};

const clearAction = () => {
  formData.value = {
    id: "",
    file: null,
    amount: 0,
    date: "",
    bank_name: "",
    sender: "",
    reciever: "",
    interact_bank: "",
    currency: "THB",
    is_corporate: false,
    comment: "",
  };
  carModalOpen.value = false;
};

const formatDate = (dateString) => {
  // Parse the input string into a Date object
  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "Invalid Date"; // Handle invalid dates
  }

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

  // Extract date components
  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Extract time components
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Return formatted date and time
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

const formatDateFromDb = (dateString) => {
  // Split the input string into date and time parts
  const [datePart, timePart] = dateString.split(" ");

  // Split the date part into day, month, year
  const [day, month, year] = datePart.split("-");

  // Define month names
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

  // Get the month name
  const monthName = monthNames[parseInt(month) - 1]; // Subtract 1 because months are 0-indexed

  // Return the formatted date
  return `${day}/${monthName}/${year} ${timePart}`;
};

const formatDateDb = (dateString) => {
  if (!dateString) return "";

  // Case 1: Replace 'T' with space
  if (dateString.includes("T")) {
    return dateString.replace("T", " ");
  }

  // Case 2: Check if it's in DD-MM-YYYY format with regex
  const ddmmyyyyRegex = /^(\d{2})-(\d{2})-(\d{4})\s(.*)$/;
  const match = dateString.match(ddmmyyyyRegex);

  if (match) {
    // match[1] = day, match[2] = month, match[3] = year, match[4] = time part
    return `${match[3]}-${match[2]}-${match[1]} ${match[4]}`;
  }

  // If it doesn't match any of our cases, return as-is
  return dateString;
};

const bankList = ref([
  { id: "1", name: "Kasikorn" },
  { id: "2", name: "Bangkok Bank" },
  { id: "3", name: "Bank of Ayudhaya" },
  { id: "4", name: "SCB Bank" },
  { id: "5", name: "Others..." },
]);

const submit = async () => {
  // console.log(formData.value);
  loadingDetail.value = true;
  try {
    const frmData = new FormData();
    frmData.append("_method", "PUT");
    frmData.append("amount", formData.value.amount);
    frmData.append("date", formatDateDb(formData.value.date));
    frmData.append("bank_name", formData.value.bank_name ?? "others...");
    frmData.append("sender", formData.value.sender);
    frmData.append("reciever", formData.value.reciever);
    frmData.append("interact_bank", formData.value.interact_bank ?? "personal");
    frmData.append("currency", formData.value.currency);
    frmData.append("is_corporate", formData.value.is_corporate ? 1 : 0);
    frmData.append("note", formData.value.comment);

    // res = await bookingStore.receiptImageAction(
    //   detailVal.value.id,
    //   formData.value.id,
    //   frmData
    // );
    const res = await cashImageStore.updateAction(frmData, formData.value.id);
    console.log(res);

    console.log(res);
    toast.success({
      title: "Success",
      description: "Update success",
    });

    clearAction();
    detailVal.value = null;
    imageData.value = null;
    imageItemData.value = null;
    await getDetail();
    imageData.value = detailVal.value?.receipts[0];
    imageItemData.value = detailVal.value?.items[0]?.receipt_images[0];
  } catch (error) {
    console.log(error);
  } finally {
    loadingDetail.value = false;
    carModalOpen.value = false;
  }
};

const verifyBooking = async (id, data) => {
  verify_status.value = data;

  // Create the initial HTML with all items in gray
  const checklistHTML = `
    <div id="check-list" class="text-left px-6">
      <p class="mb-3 text-sm font-medium" id="check-heading">First step checking...</p>
      <div class="flex items-center justify-between mb-2 opacity-50" id="check-item-1">
        <span class="text-xs">Payment Check</span>
        <span class="text-gray-500 mr-2" id="check-icon-1">
          <i class="fas fa-circle"></i>
        </span>
      </div>
      <div class="flex items-center justify-between mb-2 opacity-50" id="check-item-2">
        <span class="text-xs">Invoice Check</span>
        <span class="text-gray-500 mr-2" id="check-icon-2">
          <i class="fas fa-circle"></i>
        </span>
      </div>
      <div class="flex items-center justify-between mb-2 opacity-50" id="check-item-3">
        <span class="text-xs">Other Check</span>
        <span class="text-gray-500 mr-2" id="check-icon-3">
          <i class="fas fa-circle"></i>
        </span>
      </div>
    </div>
  `;

  // Show the SweetAlert
  const swalInstance = Swal.fire({
    title: "Checking",
    html: checklistHTML,
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "#FF613c",
    cancelButtonColor: "#d33",
    confirmButtonText: data,
    allowOutsideClick: false,
    didOpen: () => {
      // Get DOM elements
      const heading = document.getElementById("check-heading");
      const items = [
        document.getElementById("check-item-1"),
        document.getElementById("check-item-2"),
        document.getElementById("check-item-3"),
      ];
      const icons = [
        document.getElementById("check-icon-1"),
        document.getElementById("check-icon-2"),
        document.getElementById("check-icon-3"),
      ];

      // Animation timing (in milliseconds)
      const startDelay = 500;
      const stepDelay = 800;

      // Animate heading first
      setTimeout(() => {
        heading.innerHTML = "Starting verification process...";
        heading.classList.add("font-bold");
      }, startDelay);

      // Animate each checklist item
      items.forEach((item, index) => {
        setTimeout(() => {
          // Show the item (remove opacity)
          item.classList.remove("opacity-50");

          // Change the heading text for each step
          if (index === 0) heading.innerHTML = "Checking payment status...";
          if (index === 1) heading.innerHTML = "Verifying invoice details...";
          if (index === 2) heading.innerHTML = "Finalizing verification...";

          // Animate the icon change
          setTimeout(() => {
            icons[index].classList.remove("text-gray-500");
            icons[index].classList.add("text-green-500");
            icons[index].innerHTML = '<i class="fas fa-check-circle"></i>';

            // Update final heading after all checks
            if (index === 2) {
              setTimeout(() => {
                heading.innerHTML = "All checks complete!";
                heading.classList.add("text-green-500");
              }, 500);
            }
          }, 500);
        }, startDelay + (index + 1) * stepDelay);
      });
    },
  });

  // Handle the confirm/cancel
  const result = await swalInstance;

  if (result.isConfirmed) {
    try {
      const frmData = new FormData();
      frmData.append("_method", "PUT");
      frmData.append("verify_status", verify_status.value);
      const res = await bookingStore.verifyBookingStatus(id, frmData);
      if (res.status == 1) {
        toast.success(res.message);
      }
      verify_status.value = "";
      await getDetail();
      await getAction();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
};

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
const imageData = ref(null);
const imageItemData = ref(null);

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
  result.user_id = "";
  return result;
});

const changeBookingUrl = async (message) => {
  await bookingStore.getChangePage(message, watchSystem.value);
  // showReceipt.value = detailVal.value?.receipts[0]?.image;
};

const getAction = async () => {
  const res = await bookingStore.getListAction(watchSystem.value);
};

const siderBarStore = useSidebarStore();
const { isShowSidebar } = storeToRefs(siderBarStore);

const show = ref(true);
const detailVal = ref(null);
const detailValItem = ref(null);

const getDetail = async () => {
  loadingDetail.value = true;
  detailVal.value = null;
  const res = await bookingStore.getDetailAction(selectedItem.value);
  detailVal.value = res.result;

  if (detailVal.value && haveCrmId.value) {
    detailValItem.value = detailVal.value?.items.find((item) => {
      return item.crm_id == haveCrmId.value;
    });
  } else {
    detailValItem.value = detailVal.value?.items[0];
  }

  console.log(detailVal.value);
  loadingDetail.value = false;
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

  if (route.query.crm_id) {
    haveCrmId.value = route.query.crm_id;
    show.value = false;
  }
});

const checkDataFailOrSuccess = (data) => {
  if (!data) {
    return false;
  }

  // List of required fields that cannot be null (note is excluded as it can be null)
  const requiredFields = [
    "amount",
    "created_at",
    "date",
    "id",
    "sender",
    "reciever",
    "updated_at",
  ];

  // Check each required field
  for (const field of requiredFields) {
    if (
      data[field] === null ||
      data[field] === "null" ||
      data[field] === undefined
    ) {
      return false;
    }
  }

  return true;
};

watch([selectedItem, haveCrmId], async (newValue) => {
  if (newValue) {
    router.push({
      name: "verifyInvoices",
      query: {
        id: newValue,
        month: selectedMonth.value,
        year: year.value,
        crm_id: haveCrmId.value ? haveCrmId.value : "",
      },
    });
  }
  await getDetail();
  showReceipt.value = detailVal.value?.receipts[0]?.image;
  imageData.value = detailVal.value?.receipts[0];
  imageItemData.value = detailVal.value?.items[0]?.receipt_images[0];
  console.log("====================================");
  console.log(imageData.value, "this is image data");
  console.log("====================================");
});

watch(
  () => route.query.id,
  async (newValue) => {
    showReceipt.value = null;
    imageData.value = null;
    imageItemData.value = null;
  },
  {
    immediate: true,
  }
);

watch(date_range, async (newValue) => {
  if (newValue) {
    await getAction();
    // console.log(watchSystem.value);
  }
});
</script>
