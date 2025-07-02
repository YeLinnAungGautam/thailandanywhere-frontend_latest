<template>
  <div class="grid grid-cols-2 gap-4">
    <div>
      <img v-if="updateData.file" :src="updateData.file" alt="" />
      <img v-else :src="placeholderFile" alt="" />
    </div>
    <div class="space-y-4 relative pt-4 pb-14">
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
          :class="formData.reciever.includes('-') ? 'text-gray-400' : ''"
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
          <option value="deposit_management">Deposit Management</option>
        </select>
      </div>
      <div class="">
        <p class="text-[12px] pb-2 font-medium">Currency</p>
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
          v-if="formData?.id"
          @click="updateAction"
          class="px-5 py-2 bg-blue-500 text-white text-[12px] cursor-pointer rounded-lg"
        >
          Update
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useCashImageStore } from "../stores/cashImage";

const props = defineProps({
  updateData: Object,
});

const emit = defineEmits(["update"]);
const toast = useToast();
const cashImageStore = useCashImageStore();

const placeholderFile = ref(
  "https://img.freepik.com/premium-vector/payment-check-buying-financial-invoice-bill-purchasing-calculate-pay-vector-isolated-receipt_966580-342.jpg"
);

const formData = ref({
  id: "",
  date: "",
  bank_name: "",
  sender: "",
  reciever: "",
  interact_bank: "",
  currency: "THB",
  amount: "",
  table_source: "",
  file: "",
});

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

const loading = ref(false);
const updateAction = async () => {
  console.log("====================================");
  console.log(formData.value);
  console.log("====================================");
  loading.value = true;
  try {
    const frmData = new FormData();
    frmData.append("_method", "PUT");
    frmData.append("amount", formData.value.amount);
    frmData.append("date", formatDateDb(formData.value.date));
    frmData.append("sender", formData.value.sender);
    frmData.append("reciever", formData.value.reciever);
    frmData.append("interact_bank", formData.value.interact_bank ?? "personal");
    frmData.append("currency", formData.value.currency);

    // const res = await reservationStore.ReservationExpenseReceiptUpdateAction(
    //   id,
    //   formData.value.id,
    //   frmData
    // );
    // if (props.updateData.table_source == "booking_receipt") {
    //   res = await bookingStore.receiptImageAction(
    //     props.updateData.booking_id,
    //     props.updateData.id,
    //     frmData
    //   );
    // } else {
    //   res = await reservationStore.ReservationExpenseReceiptUpdateAction(
    //     props.updateData.booking_id,
    //     props.updateData.id,
    //     frmData
    //   );
    // }
    const res = await cashImageStore.updateAction(frmData, props.updateData.id);
    console.log(res);
    toast.success({
      title: "Success",
      description: "Update success",
    });
    emit("update");
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (props.updateData) {
    formData.value.id = props.updateData.id;
    formData.value.date = props.updateData.date;
    formData.value.bank_name = props.updateData.bank_name;
    formData.value.sender = props.updateData.sender
      ? props.updateData.sender
      : props.updateData.table_source == "expense_receipt"
      ? "MR. THIHA@KUMAR BHUSAL"
      : "";
    formData.value.reciever = props.updateData.reciever
      ? props.updateData.reciever
      : props.updateData.table_source == "booking_receipt"
      ? "MR. THIHA@KUMAR BHUSAL"
      : "";
    formData.value.interact_bank = props.updateData.interact_bank ?? "personal";
    formData.value.currency = props.updateData.currency;
    formData.value.amount = props.updateData.amount;
    formData.value.table_source = props.updateData.table_source;
    formData.value.file = props.updateData.file;
  }
});
</script>
