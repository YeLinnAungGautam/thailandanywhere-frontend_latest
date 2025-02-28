<template>
  <div>
    <div class="flex justify-between items-center"></div>
    <div class="col-span-2 h-1 overflow-hidden">
      <input type="text" class="opacity-0" name="" />
    </div>
    <div class="rounded-xl grid grid-cols-2 gap-4" v-if="!emailBooking">
      <div class="space-y-2 col-span-2 w-full">
        <!-- <p class="text-gray-800 text-[10px]">Receipt</p> -->
        <div class="space-y-4 mb-2">
          <p
            class="text-[10px]"
            v-if="formData.booking_receipt_image?.length != 0"
          >
            receipt slip
          </p>
          <div class="grid grid-cols-1 gap-4">
            <div
              v-for="(image, index) in detail?.receipt_images ?? []"
              :key="index"
              class="relative grid grid-cols-5 gap-4"
            >
              <!-- <p
                @click="openModal(image, index)"
                class="absolute top-4 cursor-pointer text-[8px] shadow right-2 text-xs text-white bg-[#FF613c] px-2 py-0.5 rounded-lg"
              >
                <span class="text-[10px]">edit</span>
              </p> -->
              <a
                :href="image.file"
                target="_blink"
                class="w-full h-auto col-span-2"
              >
                <img
                  :src="image.file"
                  alt=""
                  class="rounded-lg shadow hover:shadow-none h-full object-cover w-full"
                />
              </a>
              <div
                class="w-full px-4 pb-1 col-span-3 mt-2 border space-y-2 border-gray-200 shadow hover:shadow-none rounded-lg"
              >
                <div class="p-4">
                  <div>
                    <div class="gap-8">
                      <div class="flex justify-between items-center">
                        <label for="" class="text-[12px] font-medium"
                          >Date <span class="opacity-0">......</span></label
                        >
                        <div
                          class="flex justify-between items-center w-[260px]"
                        >
                          <p class="text-start text-sm" v-if="image?.date">
                            {{
                              image?.date?.includes("T")
                                ? formatDate(image.date)
                                : formatDateFromDb(image.date)
                            }}
                          </p>
                          <input
                            type="datetime-local"
                            name=""
                            v-model="image.date"
                            format="YYYY-MM-DD HH:mm:ss"
                            class="w-[35px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                            id=""
                          />
                        </div>
                      </div>
                      <div class="space-y-4 relative pt-4">
                        <div class="flex justify-between items-center">
                          <label for="" class="text-[12px] font-medium"
                            >Receiver Bank</label
                          >
                          <select
                            name=""
                            v-model="image.bank_name"
                            id=""
                            class="w-[260px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                          >
                            <option value="">Select Bank</option>
                            <option
                              :value="b.name"
                              v-for="b in bankList"
                              :key="b.id"
                            >
                              {{ b.name }}
                            </option>
                          </select>
                        </div>
                        <div class="flex justify-between items-center">
                          <label for="" class="text-[12px] font-medium"
                            >Receiver Name</label
                          >
                          <input
                            type="text"
                            name=""
                            placeholder=""
                            class="w-[260px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                            id=""
                          />
                        </div>
                        <div class="flex justify-between items-center">
                          <label for="" class="text-[12px] font-medium"
                            >Send From</label
                          >
                          <div
                            class="flex justify-start items-center w-[260px] space-x-2"
                          >
                            <select
                              name=""
                              v-model="image.is_corporate"
                              id=""
                              class="w-[260px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                            >
                              <option value="1">Company Bank Account</option>
                              <option value="0">Personal Bank Acount</option>
                            </select>
                          </div>
                        </div>

                        <div class="flex justify-between items-center">
                          <label for="" class="text-[12px] font-medium"
                            >Amount</label
                          >
                          <input
                            type="number"
                            v-model="image.amount"
                            name=""
                            placeholder="xxx"
                            class="w-[260px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                            id=""
                          />
                        </div>

                        <div class="flex justify-between items-start">
                          <label for="" class="text-[12px] font-medium"
                            >Comment</label
                          >
                          <textarea
                            v-model="image.comment"
                            class="px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs w-[260px]"
                          >
                          </textarea>
                        </div>

                        <div class="flex justify-end items-center space-x-2">
                          <p
                            @click="openModal(image, index)"
                            class="px-3 py-1 bg-green-500 text-white text-[12px] cursor-pointer rounded-lg"
                          >
                            Save
                          </p>

                          <p
                            @click="cancelAction"
                            class="px-3 py-1 bg-white border border-gray-300 text-[12px] cursor-pointer rounded-lg"
                          >
                            Close
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { ref, defineProps, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useReservationStore } from "../../stores/reservation";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useRoute } from "vue-router";
// import ExpenseBooking from "./ExpenseBooking.vue";

const toast = useToast();
const reservationStore = useReservationStore();

const props = defineProps({
  detail: Object,
  getDetailAction: Function,
});

const carModalOpen = ref(false);
const route = useRoute();
const fileInputThree = ref(null);

const formData = ref({
  id: "",
  reservation_id: "",
  cost_price: "",
  payment_method: "",
  bank_name: "",
  bank_account_number: "",
  payment_status: "",
  hotalQuantity: "",
  quantity: "",
  receipt_image: [],
  booking_receipt_image: [],
  product_type: "",
  customer_feedback: "",
  child_quantity: "",
  child_price: "",
});

const expenseData = ref({
  index: "",
  id: "",
  file: null,
  amount: 0,
  date: "",
  bank_name: "",
  sender: "",
  is_corporate: false,
  comment: "",
});

const openModal = (data, index) => {
  carModalOpen.value = true;
  console.log(data, index, "this is data");

  // save.value = data;
  expenseData.value = {
    index: index,
    id: data.id,
    file: data.file,
    amount: data.amount,
    date: data.date,
    bank_name: data.bank_name,
    sender: data.sender,
    is_corporate: data.is_corporate == 1 ? true : false,
    comment: data.comment,
  };

  updateExpense();
};

const clearAction = () => {
  expenseData.value = {
    index: "",
    id: "",
    file: null,
    amount: 0,
    date: "",
    bank_name: "",
    sender: "",
    is_corporate: false,
    comment: "",
  };
  carModalOpen.value = false;
};

const openFilePickerThree = () => {
  fileInputThree.value.click();
};

const bankList = ref([
  { id: "1", name: "KPAY" },
  { id: "2", name: "AYAPAY" },
  { id: "3", name: "CBPAY" },
  { id: "4", name: "KBZ BANKING" },
  { id: "5", name: "CB BANKING" },
  { id: "6", name: "MAB BANKING" },
  { id: "7", name: "YOMA BANK" },
  { id: "8", name: "Kasikorn" },
  { id: "9", name: "Bangkok Bank" },
  { id: "10", name: "Bank of Ayudhaya" },
  { id: "11", name: "SCB Bank" },
  { id: "12", name: "KPAY" },
  { id: "13", name: "AYAPAY" },
  { id: "14", name: "CBPAY" },
  { id: "15", name: "KBZ BANKING" },
  { id: "16", name: "CB BANKING" },
  { id: "17", name: "MAB BANKING" },
  { id: "18", name: "YOMA BANK" },
  { id: "19", name: "Kasikorn" },
  { id: "20", name: "Bangkok Bank" },
  { id: "21", name: "Bank of Ayudhaya" },
  { id: "22", name: "SCB Bank" },
  { id: "23", name: "Others..." },
]);

const recehandleFileChange = (e) => {
  let selectedFile = e.target.files;
  if (selectedFile) {
    for (let index = 0; index < selectedFile.length; index++) {
      formData.value.receipt_image.push(selectedFile[index]);
      uploadRecePreview.value.push(URL.createObjectURL(selectedFile[index]));
    }
  }
};

const uploadRecePreview = ref([]);

const cancelAction = () => {
  // your logic to cancel the update goes here
  formData.value.receipt_image = [];
  uploadRecePreview.value = [];
  carModalOpen.value = false;

  clearAction();
};

const paymentArray = [
  // Bank Transfer, International Remittance, Cash, etc
  { id: "1", name: "Bank Transfer" },
  { id: "2", name: "International Remittance" },
  { id: "3", name: "Cash" },
  { id: "4", name: "Other ..." },
];

const payment = [
  { id: "1", name: "K + " },
  { id: "2", name: "SCB " },
  { id: "3", name: "Bangkok Bank" },
  { id: "4", name: "Other Bank " },
];

const payment_status = [
  { id: "1", name: "fully_paid" },
  { id: "2", name: "not_paid" },
  { id: "3", name: "partially_paid" },
];

const emailBooking = ref(false);

const daysBetween = (a, b) => {
  console.log(a, b);
  if (a && b) {
    const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const startDateTimestamp = new Date(a).getTime();
    const endDateTimestamp = new Date(b).getTime();
    let result = Math.abs(
      Math.round((endDateTimestamp - startDateTimestamp) / oneDay)
    );
    console.log(formData.value.checkin_date, result, "this is result");
    return result;
  }
};

const loading = ref(false);

const createExpense = async () => {
  // console.log(formData.value);
  loading.value = true;
  try {
    const frmData = new FormData();
    frmData.append("amount", expenseData.value.amount);
    frmData.append("date", expenseData.value.date);
    frmData.append("bank_name", expenseData.value.bank_name);
    frmData.append("is_corporate", expenseData.value.is_corporate ? 1 : 0);
    frmData.append("comment", expenseData.value.comment);

    if (formData.value.receipt_image.length != 0) {
      if (formData.value.receipt_image.length > 0) {
        for (let i = 0; i < formData.value.receipt_image.length; i++) {
          let file = formData.value.receipt_image[0];
          frmData.append("file", file);
        }
      }
    }

    const res = await reservationStore.ReservationExpenseReceiptAction(
      props.detail.id,
      frmData
    );
    console.log(res);
    toast.success({
      title: "Success",
      description: "Create success",
    });

    setTimeout(async () => {
      await props.getDetailAction(route.query.id);
    }, 1000);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
    carModalOpen.value = false;
  }
};

const updateExpense = async () => {
  // console.log(formData.value);
  loading.value = true;
  try {
    const frmData = new FormData();
    frmData.append("_method", "PUT");
    frmData.append("amount", expenseData.value.amount);
    frmData.append("date", formatDateDb(expenseData.value.date));
    frmData.append("bank_name", expenseData.value.bank_name);
    frmData.append("is_corporate", expenseData.value.is_corporate ? 1 : 0);
    frmData.append("comment", expenseData.value.comment);

    const res = await reservationStore.ReservationExpenseReceiptUpdateAction(
      props.detail.id,
      expenseData.value.id,
      frmData
    );
    console.log(res);
    toast.success({
      title: "Success",
      description: "Update success",
    });

    setTimeout(async () => {
      await props.getDetailAction(route.query.id);
    }, 1000);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
    carModalOpen.value = false;
  }
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
  // Parse the input string into a Date object
  return dateString.replace("T", " ");
};

onMounted(() => {
  // Your initial data setup
  if (props.detail) {
    console.log(props.detail, "cart value");
  }
  if (props.detail) {
    formData.value.id = props.detail?.id;
    formData.value.cost_price = props.detail?.cost_price;
    formData.value.payment_method = props.detail?.payment_method;
    formData.value.bank_name =
      props.detail?.reservation_info?.bank_name ||
      props.detail?.bank_name ||
      props.detail?.product.bank_name ||
      "";
    formData.value.bank_account_number =
      props.detail?.reservation_info?.bank_account_number ||
      props.detail?.bank_account_number ||
      props.detail?.product.bank_account_number ||
      "";
    formData.value.payment_status = props.detail?.payment_status;
    formData.value.hotalQuantity =
      props.detail?.quantity *
      daysBetween(props.detail?.checkin_date, props.detail?.checkout_date);
    formData.value.quantity = props.detail?.quantity;
    // formData.value.receipt_image = props.detail?.receipt_image;
    formData.value.booking_receipt_image = props.detail?.receipt_images;
    formData.value.product_type = props.detail?.product_type;
    formData.value.customer_feedback =
      props.detail?.reservation_info?.customer_feedback || "";

    formData.value.child_quantity = props.detail?.individual_pricing
      ? props?.detail?.individual_pricing?.child?.quantity
      : 0;
    formData.value.child_price = props.detail?.individual_pricing
      ? props?.detail?.individual_pricing?.child?.cost_price
      : 0;
  }
});
</script>
