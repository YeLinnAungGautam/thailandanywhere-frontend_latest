<template>
  <div>
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
      <div class="space-y-2">
        <p class="text-gray-800 text-[10px]">Unit Cost</p>
        <input
          v-model="data.cost_price"
          type="number"
          id="title"
          class="h-9 rounded-lg w-full bg-white border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
        />
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
            class="h-9 w-full bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
            v-if="!data.checkin_date"
          >
            {{ data.cost_price * data.quantity }}
          </p>
          <p
            class="h-9 w-full bg-white border rounded-md border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
            v-if="data.checkin_date"
          >
            {{ data.cost_price * data.hotalQuantity }}
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
          <div
            @click.prevent="openFilePickerThree"
            class="py-4 px-4 flex justify-center rounded-lg items-center text-xs border border-gray-400 border-dashed"
          >
            <span class="text-xs"
              ><i class="fa-solid fa-plus text-2xl text-gray-800"></i
            ></span>
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
          <p class="text-[10px]" v-if="data.booking_receipt_image?.length != 0">
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
</template>

<script setup>
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { ref, defineProps, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useReservationStore } from "../../stores/reservation";

const toast = useToast();
const reservationStore = useReservationStore();

const props = defineProps({
  data: Object,
  expenseUpdateAction: Function,
  expenseCancelAction: Function,
});

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

onMounted(() => {
  // Your initial data setup
  if (props.data) {
    console.log(props.data, "cart value");
  }
});
</script>
