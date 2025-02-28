<template>
  <div class="space-y-3">
    <div class="flex justify-between items-center pt-3">
      <p
        class="px-2 py-1 bg-[#FF613c] text-white inline-block text-xs rounded-lg"
      >
        {{ detail?.crm_id }}
      </p>
    </div>
    <div class="grid grid-cols-1 gap-4">
      <div
        v-for="i in detail?.booking?.receipts ?? []"
        :key="i"
        class="grid grid-cols-5 relative justify-stretch group border-b border-gray-200 pb-4 gap-4 w-full"
      >
        <div class="h-[350px] col-span-2 w-full">
          <img
            :src="i?.image"
            class="rounded-lg shadow hover:shadow-none h-full object-cover w-full"
            alt=""
          />
        </div>
        <div class="col-span-3 bg-white shadow rounded-lg">
          <div class="px-4 pt-3">
            <div class="grid grid-cols-1 gap-4">
              <div class="space-y-4 relative pr-2">
                <div class="flex justify-between items-center">
                  <label for="" class="text-[12px] font-medium"
                    >Date & Time
                  </label>
                  <div class="flex justify-between items-center w-[260px]">
                    <p class="text-start text-sm">{{ formatDate(i.date) }}</p>
                    <input
                      type="datetime-local"
                      name=""
                      v-model="i.date"
                      format="YYYY-MM-DDTHH:mm"
                      class="w-[35px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                      id=""
                    />
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <label for="" class="text-[12px] font-medium">Amount</label>
                  <input
                    type="text"
                    name=""
                    v-model="i.amount"
                    placeholder="xxxx.xx"
                    class="w-[260px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                    id=""
                  />
                </div>

                <div class="flex justify-between items-center">
                  <label for="" class="text-[12px] font-medium"
                    >Sender Bank
                  </label>
                  <select
                    name=""
                    v-model="i.bank_name"
                    id=""
                    class="w-[260px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                  >
                    <option value="">Select Bank</option>
                    <option :value="b.name" v-for="b in bankList" :key="b.id">
                      {{ b.name }}
                    </option>
                  </select>
                </div>
                <div class="flex justify-between items-center">
                  <label for="" class="text-[12px] font-medium"
                    >Sender Name
                  </label>
                  <input
                    v-model="i.sender"
                    type="text"
                    name=""
                    placeholder="eg: MR NAING TUN AUNG"
                    class="w-[260px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                    id=""
                  />
                </div>
                <div class="flex justify-between items-center">
                  <label for="" class="text-[12px] font-medium"
                    >Received At</label
                  >
                  <div
                    class="flex justify-start items-center w-[260px] space-x-2"
                  >
                    <select
                      name=""
                      v-model="i.is_corporate"
                      id=""
                      class="w-[260px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                    >
                      <option value="1">Company Bank Account</option>
                      <option value="0">Personal Bank Acount</option>
                    </select>
                  </div>
                </div>
                <div class="flex justify-between items-start">
                  <label for="" class="text-[12px] font-medium">Comment</label>
                  <textarea
                    v-model="i.note"
                    class="px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs w-[260px]"
                  >
                  </textarea>
                </div>
                <div class="flex justify-end items-center space-x-2">
                  <p
                    @click.prevent="openModal(i)"
                    class="px-3 py-1 bg-green-500 text-white text-[12px] cursor-pointer rounded-lg"
                  >
                    Update
                  </p>
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
import invoice from "../../assets/invoice_exp.jpg";
import { defineProps, onMounted, ref } from "vue";
import dateImage from "../../assets/date.png";
import bathImage from "../../assets/baht.png";
import { PencilSquareIcon, XCircleIcon } from "@heroicons/vue/24/outline";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useRouter, useRoute } from "vue-router";
import { useBookingStore } from "../../stores/booking";
import { useToast } from "vue-toastification";

const bookingStore = useBookingStore();
const route = useRoute();

const props = defineProps({
  detail: Object,
  getDetailAction: Function,
});

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

const router = useRouter();
const toast = useToast();
const carModalOpen = ref(false);

const formData = ref({
  id: "",
  file: null,
  amount: 0,
  date: "",
  bank_name: "",
  sender: "",
  is_corporate: false,
  comment: "",
});

const openModal = async (data) => {
  // carModalOpen.value = true;
  console.log(data);

  // save.value = data;
  formData.value = {
    id: data.id,
    file: data.image,
    amount: data.amount,
    date: data.date,
    bank_name: data.bank_name,
    sender: data.sender,
    is_corporate: data.is_corporate == 1 ? true : false,
    comment: data.note,
  };

  await submit();
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

const calculateDaysBetween = (a, b) => {
  if (a && b) {
    const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const startDateTimestamp = new Date(a).getTime();
    const endDateTimestamp = new Date(b).getTime();
    let result = Math.abs(
      Math.round((endDateTimestamp - startDateTimestamp) / oneDay)
    );
    // formitem.value.days = result;
    return result;
  }
};

const clearAction = () => {
  formData.value = {
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

const loading = ref(false);

const submit = async () => {
  // console.log(formData.value);
  loading.value = true;
  try {
    const frmData = new FormData();
    frmData.append("_method", "PUT");
    frmData.append("amount", formData.value.amount);
    frmData.append("date", formData.value.date);
    frmData.append("bank_name", formData.value.bank_name);
    frmData.append("sender", formData.value.sender);
    frmData.append("is_corporate", formData.value.is_corporate ? 1 : 0);
    frmData.append("note", formData.value.comment);

    const res = await bookingStore.receiptImageAction(
      props.detail.booking.id,
      formData.value.id,
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
</script>
