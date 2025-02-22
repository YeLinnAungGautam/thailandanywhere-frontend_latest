<template>
  <div class="space-y-3">
    <div class="grid grid-cols-5 col-span-2 gap-4 py-3">
      <div
        class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
      >
        <p class="text-[10px] text-gray-500">Sales Date</p>
        <p class="text-sm">{{ detail?.booking.booking_date }}</p>
      </div>
      <div
        class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
      >
        <p class="text-[10px] text-gray-500">Item Sale Amount</p>
        <p class="text-sm">{{ detail?.amount }} thb</p>
      </div>
      <div
        class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
      >
        <p class="text-[10px] text-gray-500">Total Discount</p>
        <p class="text-sm">{{ detail?.booking?.discount }}</p>
      </div>
      <div
        class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
      >
        <p class="text-[10px] text-gray-500">Balance Due</p>
        <p class="text-sm">{{ detail?.booking?.balance_due }}</p>
      </div>
      <div
        class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
      >
        <p class="text-[10px] text-gray-500">Payment Method</p>
        <p class="text-sm">{{ detail?.booking?.payment_method }}</p>
      </div>
      <div
        v-if="detail?.product_type == 'App\\Models\\EntranceTicket'"
        class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
      >
        <p class="text-[10px] text-gray-500">Total Quantity</p>
        <p class="text-sm">
          {{
            detail?.quantity +
            (detail?.individual_pricing?.child?.quantity ?? 0) * 1
          }}
        </p>
      </div>
      <div
        v-if="detail?.product_type == 'App\\Models\\Hotel'"
        class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
      >
        <p class="text-[10px] text-gray-500">Rooms & Nights</p>
        <p class="text-sm">
          {{ detail?.quantity }} R x
          {{
            calculateDaysBetween(detail?.checkin_date, detail?.checkout_date)
          }}
          N
        </p>
      </div>
      <div
        class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
      >
        <p class="text-[10px] text-gray-500">Total Cost</p>
        <p class="text-sm">{{ detail?.total_cost_price ?? 0 }}</p>
      </div>
      <div
        class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
      >
        <p class="text-[10px] text-gray-500">Item Discount</p>
        <p class="text-sm">{{ detail?.discount }}</p>
      </div>
      <div
        v-if="detail?.product_type == 'App\\Models\\EntranceTicket'"
        class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
      >
        <p class="text-[10px] text-gray-500">Adult Qty</p>
        <p class="text-sm">{{ detail?.quantity }}</p>
      </div>
      <div
        v-if="detail?.product_type == 'App\\Models\\Hotel'"
        class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
      >
        <p class="text-[10px] text-gray-500">Total Qty</p>
        <p class="text-sm">
          {{
            detail?.quantity *
            calculateDaysBetween(detail?.checkin_date, detail?.checkout_date)
          }}
        </p>
      </div>
      <div
        v-if="detail?.product_type == 'App\\Models\\EntranceTicket'"
        class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
      >
        <p class="text-[10px] text-gray-500">Child Qty</p>
        <p class="text-sm">
          {{ detail?.individual_pricing?.child?.quantity ?? 0 }}
        </p>
      </div>
      <div
        v-if="detail?.product_type == 'App\\Models\\Hotel'"
        class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
      >
        <p class="text-[10px] text-gray-500">Extra Bed Qty</p>
        <p class="text-sm">-</p>
      </div>
    </div>
    <div class="flex justify-between items-center">
      <p
        class="px-2 py-1 bg-[#FF613c] text-white inline-block text-xs rounded-lg"
      >
        {{ detail?.crm_id }}
      </p>
      <p
        @click="router.push(`/bookings/new-update/${detail?.booking?.id}`)"
        class="text-[12px] bg-[#FF613c] px-3 py-1 rounded-lg text-white"
      >
        + click to add payment
      </p>
    </div>
    <div class="pt-2 grid grid-cols-4 gap-4">
      <!-- <div
        @click="router.push(`/bookings/new-update/${detail?.booking?.id}`)"
        class="w-full min-h-[230px] border rounded-lg border-dashed flex justify-center items-center text-[#FF613c] border-[#FF613c] cursor-pointer"
      >
        <p class="px-2 py-1 text-[10px] text-[#FF613c] rounded-lg">
          Click to add payment
        </p>
      </div> -->
      <div
        v-for="i in detail?.booking?.receipts ?? []"
        :key="i"
        class="flex flex-col relative justify-stretch group space-y-2 w-full"
      >
        <p
          @click="openModal(i)"
          class="absolute top-4 cursor-pointer text-[8px] shadow right-2 text-xs text-white bg-[#FF613c] px-2 py-0.5 rounded-lg"
        >
          <span class="text-[10px]">edit</span>
        </p>
        <div
          @click="openModal(i)"
          class="w-full px-4 pb-1 border space-y-2 text-[#FF613c] border-gray-200 shadow hover:shadow-none rounded-lg"
        >
          <p class="text-[12px] flex justify-start items-center pt-2">
            <!-- <img :src="bathImage" alt="" class="w-4 h-4 mr-2" /> -->
            {{ i?.amount }} thb
          </p>
          <p class="text-[12px] flex justify-start items-center">
            <!-- <img :src="dateImage" alt="" class="w-3 h-3 mr-2" /> -->
            {{ i?.date ? i?.date : "--/--/--" }}
          </p>
        </div>
        <div class="h-[180px] w-full" @click="openModal(i)">
          <img
            :src="i?.image"
            class="rounded-lg shadow hover:shadow-none h-full object-cover w-full"
            alt=""
          />
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
            <div class="space-y-4 relative pt-4 pr-2">
              <div class="flex justify-between items-center">
                <label for="" class="text-[12px] font-medium">Amount</label>
                <input
                  type="text"
                  name=""
                  v-model="formData.amount"
                  placeholder="Search CRM ID"
                  class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                  id=""
                />
              </div>
              <div class="flex justify-between items-center">
                <label for="" class="text-[12px] font-medium">Date </label>
                <input
                  type="date"
                  name=""
                  v-model="formData.date"
                  class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                  id=""
                />
              </div>
              <div class="flex justify-between items-center">
                <label for="" class="text-[12px] font-medium">Bank </label>
                <select
                  name=""
                  v-model="formData.bank_name"
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
                <label for="" class="text-[12px] font-medium">Sender </label>
                <input
                  v-model="formData.sender"
                  type="text"
                  name=""
                  placeholder="sender name"
                  class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                  id=""
                />
              </div>
              <div class="flex justify-between items-center">
                <label for="" class="text-[12px] font-medium">Bank ? </label>
                <div class="flex justify-start items-center space-x-2">
                  <input
                    type="checkbox"
                    v-model="formData.is_corporate"
                    name=""
                    placeholder="name"
                    class="py-1.5 focus:outline-none text-xs"
                    id=""
                  />
                  <p class="text-[12px]">Is Corporate ?</p>
                </div>
              </div>
              <div class="flex justify-between items-start">
                <label for="" class="text-[12px] font-medium">Comment</label>
                <textarea
                  v-model="formData.comment"
                  class="px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs w-[160px]"
                >
                </textarea>
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
  </div>
</template>

<script setup>
import invoice from "../../assets/invoice_exp.jpg";
import { defineProps, ref } from "vue";
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

const openModal = (data) => {
  carModalOpen.value = true;
  // save.value = data;
  formData.value = {
    id: data.id,
    file: data.image,
    amount: data.amount,
    date: data.date,
    bank_name: data.bank_name,
    sender: data.sender,
    is_corporate: data.is_corporate == 1 ? true : false,
    comment: data.comment,
  };
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
    frmData.append("comment", formData.value.comment);

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
