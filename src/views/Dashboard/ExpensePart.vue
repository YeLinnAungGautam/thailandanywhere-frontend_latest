<template>
  <div class="grid grid-cols-1 gap-4 relative">
    <div
      class="absolute flex justify-between items-center top-10 left-0 w-full"
    >
      <p
        class="rounded-full border border-gray-500 p-1 shadow"
        @click="showInfo = false"
        :class="!showInfo ? 'bg-gray-200' : 'bg-white'"
      >
        <ChevronLeftIcon class="w-4 h-4" />
      </p>
      <p
        class="rounded-full border border-gray-500 p-1 shadow"
        :class="showInfo ? 'bg-gray-200' : 'bg-white'"
        @click="showInfo = true"
      >
        <ChevronRightIcon class="w-4 h-4" />
      </p>
    </div>
    <div v-if="!showInfo" class="px-6">
      <div class="col-span-2 h-1 overflow-hidden">
        <input type="text" class="opacity-0" name="" />
      </div>
      <div class="p-4 rounded-xl grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <p class="text-gray-800 text-[10px]">Expense Method:</p>

          <v-select
            v-model="data.payment_method"
            class="style-chooser text-xs rounded-lg bg-white"
            :options="paymentArray"
            label="name"
            :clearable="false"
            :reduce="(d) => d.name"
            placeholder=""
          ></v-select>
        </div>
        <div class="space-y-2">
          <p class="text-gray-800 text-[10px]">Bank Name:</p>

          <v-select
            v-model="data.bank_name"
            class="style-chooser text-xs rounded-lg bg-white"
            :options="payment"
            label="name"
            :clearable="false"
            :reduce="(d) => d.name"
            placeholder=""
          ></v-select>
        </div>
        <div class="space-y-2">
          <p class="text-gray-800 text-[10px]">Expense Status</p>
          <v-select
            v-model="data.payment_status"
            class="style-chooser text-xs rounded-lg bg-white"
            :options="payment_status"
            label="name"
            :clearable="false"
            :reduce="(d) => d.name"
            placeholder=""
          ></v-select>
        </div>
        <div class="space-y-2">
          <p class="text-gray-800 text-[10px]">Bank Account Number</p>
          <input
            v-model="data.bank_account_number"
            type="number"
            id="title"
            class="h-9 rounded-lg w-full bg-white border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
          />
        </div>
        <!-- <div class="space-y-2">
          <p class="text-gray-800 text-[10px]">Unit Cost</p>
          <input
            v-model="data.cost_price"
            type="number"
            id="title"
            class="h-9 rounded-lg w-full bg-white border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
          />
        </div> -->

        <div
          class="space-y-2"
          v-if="data?.product_type == 'App\\Models\\EntranceTicket'"
        >
          <p class="text-gray-800 text-[10px]">Adult Unit Cost *</p>
          <div class="grid grid-cols-3 gap-x-2">
            <input
              v-model="data.quantity"
              type="number"
              id="title"
              disabled
              class="h-9 rounded-lg w-full bg-white border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
            />
            <input
              v-model="data.cost_price"
              type="number"
              id="title"
              class="h-9 col-span-2 rounded-lg w-full bg-white border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
            />
          </div>
          <p class="text-xs text-red-500">! Unit cost can't be empty</p>
        </div>
        <div
          class="space-y-2"
          v-if="data?.product_type == 'App\\Models\\EntranceTicket'"
        >
          <p class="text-gray-800 text-[10px]">Child Unit Cost *</p>
          <div class="grid grid-cols-3 gap-x-2">
            <input
              v-model="data.child_quantity"
              type="number"
              disabled
              id="title"
              class="h-9 rounded-lg w-full bg-gray-2000 border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
            />
            <input
              v-model="data.child_price"
              type="number"
              id="title"
              class="h-9 col-span-2 rounded-lg w-full bg-gray-2000 border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
            />
          </div>
          <p class="text-xs text-red-500">! Unit cost can't be empty</p>
        </div>
        <div
          class="space-y-2"
          v-if="
            data.product_type == 'App\\Models\\EntranceTicket' ||
            data.product_type == 'App\\Models\\Hotel' ||
            data.product_type == 'App\\Models\\PrivateVanTour' ||
            data.product_type == 'App\\Models\\GroupTour' ||
            data.product_type == 'App\\Models\\Airline'
          "
        >
          <div class="space-y-2">
            <p class="text-gray-800 text-[10px]">Total Cost</p>

            <p
              class="h-9 w-full bg-white border rounded-md border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
            >
              {{ data.total_cost_price }}
            </p>
          </div>
        </div>
        <div class="space-y-2 col-span-2 w-full">
          <p class="text-gray-800 text-[10px]">Receipt</p>
          <div class="space-y-4 mb-2">
            <input
              type="file"
              id="image"
              ref="fileInputThree"
              multiple
              class="hidden"
              @change="recehandleFileChange"
              accept="image/*"
            />
            <!-- <div
              @click.prevent="openFilePickerThree"
              class="py-4 px-4 flex justify-center rounded-lg items-center text-xs border border-gray-400 border-dashed"
            >
              <span class="text-xs"
                ><i class="fa-solid fa-plus text-2xl text-gray-800"></i
              ></span>
            </div> -->
            <div
              @click="carModalOpen = true"
              class="bg-green-500 px-3 py-1 text-xs text-white inline-block rounded-lg"
            >
              add expense receipt
            </div>
            <p class="text-[10px]" v-if="uploadRecePreview.length != 0">
              preview
            </p>
            <div class="grid grid-cols-3 gap-3 mt-4">
              <div
                class="relative"
                v-for="(image, index) in uploadRecePreview"
                :key="index"
              >
                <button
                  @click.prevent="expremoveSecSelectedImage(index)"
                  class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
                >
                  <XCircleIcon class="w-8 h-8" />
                </button>

                <img class="h-auto w-full rounded" :src="image" alt="" />
              </div>
            </div>
            <p
              class="text-[10px]"
              v-if="data.booking_receipt_image?.length != 0"
            >
              receipt slip
            </p>
            <div
              class="grid grid-cols-4 gap-4"
              v-if="data.booking_receipt_image?.length != 0"
            >
              <div
                v-for="(image, index) in data.booking_receipt_image"
                :key="index"
              >
                <span
                  ><i
                    class="fa-solid fa-trash-can text-lg text-red-500"
                    @click="deleteImage(image.id, index)"
                  ></i
                ></span>
                <a :href="image.file" target="_blink">
                  <img :src="image.file" alt="" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-center items-center col-span-2">
          <div class="flex justify-start items-center space-x-2">
            <p
              @click="expenseUpdateAction"
              class="text-[10px] bg-green-600 shadow-lg rounded-lg text-white px-3 py-1 cursor-pointer"
            >
              update
            </p>
            <p
              @click="expenseCancelAction"
              class="text-[10px] bg-white shadow-lg rounded-lg text-black border border-gray-500 px-3 py-1 cursor-pointer"
            >
              cancel
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="pt-4 px-8 w-full" v-if="showInfo">
      <div class="w-full">
        <div class="gap-4 flex justify-start items-center">
          <div
            class="space-y-2 p-2 border border-gray-200 rounded-lg min-w-[120px] bg-[#FF613c] text-white"
          >
            <p class="text-sm font-medium">{{ info.crm_id }}</p>
          </div>
          <div
            class="space-y-2 p-2 border border-gray-200 rounded-lg min-w-[120px] bg-[#FF613c] text-white"
          >
            <p class="text-sm font-medium">
              {{ info.booking?.payment_status }}
            </p>
          </div>
          <div
            class="space-y-2 p-2 border border-gray-200 rounded-lg min-w-[120px] bg-[#FF613c] text-white"
          >
            <p class="text-sm font-medium">{{ info.booking?.grand_total }}</p>
          </div>
          <div
            class="space-y-2 p-2 border border-gray-200 rounded-lg min-w-[120px] bg-[#FF613c] text-white"
          >
            <p class="text-sm font-medium">{{ info.booking?.balance_due }}</p>
          </div>
        </div>
        <div class="w-full grid grid-cols-4 gap-4 pt-6 pb-14">
          <div
            v-for="i in info.booking?.receipts"
            :key="i"
            class="border border-gray-200 rounded-md"
          >
            <img :src="i.image" alt="" class="h-[80%] w-full rounded" />
            <p class="px-3 text-sm pt-2 font-medium text-[#FF613c]">
              {{ i.amount }}
            </p>
            <p class="px-3 text-sm pb-2">{{ i.created_at }}</p>
          </div>
        </div>
      </div>
    </div>
    <Modal :isOpen="carModalOpen" @closeModal="clearAction">
      <DialogPanel
        class="w-full max-w-xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-2 px-4"
        >
          <p>Expense Add</p>
          <XCircleIcon class="w-5 h-5 text-white" @click="clearAction" />
        </DialogTitle>
        <!-- show date  -->
        <div class="p-4">
          <div class="p-4">
            <div class="grid grid-cols-2 gap-8">
              <div
                @click="openFilePickerThree"
                v-if="uploadRecePreview.length == 0 && !expenseData.file"
                class="w-[200px] h-[300px] border rounded-lg border-dashed flex justify-center items-center text-[#FF613c] border-[#FF613c]"
              >
                +
              </div>
              <div
                v-if="uploadRecePreview.length != 0 && !expenseData.file"
                class="w-[200px] h-[300px] border rounded-lg border-dashed flex justify-center items-center text-[#FF613c] border-[#FF613c]"
              >
                <img :src="uploadRecePreview[0]" alt="" class="rounded-lg" />
              </div>
              <div
                v-if="expenseData.file"
                class="w-[200px] h-[300px] border rounded-lg border-dashed flex justify-center items-center text-[#FF613c] border-[#FF613c]"
              >
                <img :src="expenseData.file" alt="" class="rounded-lg" />
              </div>

              <div class="space-y-4 relative pt-4">
                <div class="flex justify-between items-center">
                  <label for="" class="text-[12px] font-medium"
                    >Bank <span class="opacity-0">.....</span></label
                  >
                  <select
                    name=""
                    v-model="expenseData.bank_name"
                    id=""
                    class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                  >
                    <option value="">Select Bank</option>
                    <option :value="b.name" v-for="b in bankList" :key="b.id">
                      {{ b.name }}
                    </option>
                  </select>
                </div>
                <div class="flex justify-between items-center">
                  <label for="" class="text-[12px] font-medium"
                    >Bank ? <span class="opacity-0">..</span></label
                  >
                  <div class="flex justify-start items-center space-x-2">
                    <input
                      type="checkbox"
                      v-model="expenseData.is_corporate"
                      name=""
                      placeholder="name"
                      class="py-1.5 focus:outline-none text-xs"
                      id=""
                    />
                    <p class="text-[12px]">Is Corporate ?</p>
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <label for="" class="text-[12px] font-medium">Amount</label>
                  <input
                    type="number"
                    v-model="expenseData.amount"
                    name=""
                    placeholder="xxx"
                    class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                    id=""
                  />
                </div>
                <div class="flex justify-between items-center">
                  <label for="" class="text-[12px] font-medium"
                    >Date <span class="opacity-0">......</span></label
                  >
                  <div class="flex justify-between items-center w-[160px]">
                    <p class="text-start text-xs" v-if="expenseData?.date">
                      {{
                        expenseData.date.includes("T")
                          ? formatDate(expenseData.date)
                          : formatDateFromDb(expenseData.date)
                      }}
                    </p>
                    <input
                      type="datetime-local"
                      name=""
                      v-model="expenseData.date"
                      format="YYYY-MM-DD HH:mm:ss"
                      class="w-[35px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                      id=""
                    />
                  </div>
                </div>
                <div class="flex justify-between items-start">
                  <label for="" class="text-[12px] font-medium">Comment</label>
                  <textarea
                    v-model="expenseData.comment"
                    class="px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs w-[160px]"
                  >
                  </textarea>
                </div>

                <div
                  class="flex justify-end items-center space-x-2 absolute bottom-0 right-0"
                >
                  <p
                    v-if="!expenseData?.id && !loading"
                    @click="createExpense"
                    class="px-3 py-1 bg-green-500 text-white text-[12px] cursor-pointer rounded-lg"
                  >
                    Save
                  </p>
                  <p
                    v-if="expenseData?.id && !loading"
                    @click="updateExpense"
                    class="px-3 py-1 bg-blue-500 text-white text-[12px] cursor-pointer rounded-lg"
                  >
                    Update
                  </p>
                  <p
                    v-if="loading"
                    class="px-3 py-1 flex justify-center items-center gap-x-2 bg-gray-500 text-white text-[12px] cursor-pointer rounded-lg"
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/25/25220.png"
                      class="animate-spin w-4 h-4"
                      alt=""
                    />
                    Loading
                  </p>
                  <p
                    v-if="expenseData?.id"
                    @click="
                      removeFeatureDeleteImage(
                        expenseData.index,
                        expenseData.id
                      )
                    "
                    class="px-3 py-1 bg-red-500 text-white text-[12px] cursor-pointer rounded-lg"
                  >
                    delete
                  </p>
                  <p
                    @click="clearAction"
                    class="px-3 py-1 bg-white border border-gray-300 text-[12px] cursor-pointer rounded-lg"
                  >
                    Close
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Modal>
  </div>
</template>

<script setup>
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XCircleIcon,
} from "@heroicons/vue/24/outline";
import { ref, defineProps, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useReservationStore } from "../../stores/reservation";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";

const toast = useToast();
const reservationStore = useReservationStore();

const props = defineProps({
  data: Object,
  info: Object,
  expenseUpdateAction: Function,
  expenseCancelAction: Function,
});

const showInfo = ref(false);

const fileInputThree = ref(null);

const openFilePickerThree = () => {
  fileInputThree.value.click();
};

const recehandleFileChange = (e) => {
  let selectedFile = e.target.files;
  if (selectedFile) {
    for (let index = 0; index < selectedFile.length; index++) {
      props.data.receipt_image.push(selectedFile[index]);
      uploadRecePreview.value.push(URL.createObjectURL(selectedFile[index]));
    }
  }
  console.log(props.data.receipt_image, "receipt");
};

const uploadRecePreview = ref([]);

const expremoveSecSelectedImage = (index) => {
  props.data.receipt_image.splice(index, 1);
  uploadRecePreview.value.splice(index, 1);
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

const deleteImage = async (id, index) => {
  console.log(id, "this is delete id");
  await reservationStore.deleteResImage(id);
  props.data.booking_receipt_image.splice(index, 1);
  toast.success("success delete receipt");
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

const carModalOpen = ref(false);
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
  props.data.receipt_image = [];
  carModalOpen.value = false;
};

const loading = ref(false);

const createExpense = async () => {
  // console.log(formData.value);
  loading.value = true;
  try {
    const frmData = new FormData();
    frmData.append("amount", expenseData.value.amount);
    frmData.append("date", formatDateDb(expenseData.value.date));
    frmData.append("bank_name", expenseData.value.bank_name);
    frmData.append("is_corporate", expenseData.value.is_corporate ? 1 : 0);
    frmData.append("comment", expenseData.value.comment);

    if (props.data.receipt_image.length != 0) {
      if (props.data.receipt_image.length > 0) {
        for (let i = 0; i < props.data.receipt_image.length; i++) {
          let file = props.data.receipt_image[0];
          frmData.append("file", file);
        }
      }
    }

    const res = await reservationStore.ReservationExpenseReceiptAction(
      props.info.id,
      frmData
    );
    console.log(res);
    toast.success({
      title: "Success",
      description: "Create success",
    });

    setTimeout(() => {
      window.location.reload();
    }, 2000);
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

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
    carModalOpen.value = false;
  }
};

onMounted(() => {
  // Your initial data setup
  if (props.data) {
    console.log(props.info, "cart value");
  }
});
</script>
