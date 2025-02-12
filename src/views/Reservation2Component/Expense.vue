<template>
  <div>
    <div class="flex justify-between items-center">
      <!-- <p class="font-medium pb-2">Expense Detail</p> -->
      <!-- <p
        class="bg-[#FF613c] text-white px-1.5 cursor-pointer inline-block rounded-full"
        @click.prevent="openFilePickerThree"
      >
        +
      </p> -->
    </div>
    <div class="col-span-2 h-1 overflow-hidden">
      <input type="text" class="opacity-0" name="" />
    </div>
    <div class="rounded-xl grid grid-cols-2 gap-4">
      <div class="space-y-2">
        <p class="text-gray-800 text-[10px]">Expense Method:</p>

        <v-select
          v-model="formData.payment_method"
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
          v-model="formData.bank_name"
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
          v-model="formData.payment_status"
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
          v-model="formData.bank_account_number"
          type="number"
          id="title"
          class="h-9 rounded-lg w-full bg-white border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
        />
      </div>
      <div class="space-y-2">
        <p class="text-gray-800 text-[10px]">Unit Cost</p>
        <input
          v-model="formData.cost_price"
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
            {{ formData.cost_price * formData.quantity }}
          </p>
          <p
            class="h-9 w-full bg-white border rounded-md border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
            v-if="data.checkin_date"
          >
            {{ formData.cost_price * formData.hotalQuantity }}
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
          <p class="text-[10px]" v-if="uploadRecePreview.length != 0">
            preview
          </p>
          <div class="grid grid-cols-4 gap-3 mt-4">
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
            v-if="formData.booking_receipt_image?.length != 0"
          >
            receipt slip
          </p>
          <div
            class="grid grid-cols-4 gap-4"
            v-if="formData.booking_receipt_image?.length != 0"
          >
            <div class="space-y-2" @click="carModalOpen = true">
              <div
                class="w-full h-[205px] border border-[#FF613c] text-[#FF613c] text-lg flex justify-center items-center rounded-lg border-dashed"
              >
                +
              </div>
              <div
                class="w-full px-4 pb-1 border-dashed border border-[#FF613c] space-y-2 text-[#FF613c] hover:shadow-none rounded-lg"
              >
                <p class="text-[10px] flex justify-start items-center pt-2">
                  <!-- <img :src="bathImage" alt="" class="w-4 h-4 mr-2" /> -->
                  Bank Name
                </p>
                <p class="text-[10px] flex justify-start items-center">
                  <!-- <img :src="dateImage" alt="" class="w-3 h-3 mr-2" /> -->
                  Amount
                </p>
                <p class="text-[10px] flex justify-start items-center pb-2">
                  <!-- <img :src="dateImage" alt="" class="w-3 h-3 mr-2" /> -->
                  Date
                </p>
              </div>
            </div>
            <div
              v-for="(image, index) in formData.booking_receipt_image"
              :key="index"
              class="relative"
            >
              <p class="absolute right-2 -top-4 bg-white p-1 rounded-lg">
                <i
                  class="fa-solid fa-trash-can text-base text-red-500"
                  @click="deleteImage(image.id, index)"
                ></i>
              </p>
              <a :href="image.file" target="_blink">
                <img :src="image.file" alt="" class="rounded-lg" />
              </a>
              <div
                class="w-full px-4 pb-1 mt-2 border space-y-2 text-[#FF613c] border-gray-200 shadow hover:shadow-none rounded-lg"
              >
                <p class="text-[10px] flex justify-start items-center pt-2">
                  <!-- <img :src="bathImage" alt="" class="w-4 h-4 mr-2" /> -->
                  Bank Name
                </p>
                <p class="text-[10px] flex justify-start items-center">
                  <!-- <img :src="dateImage" alt="" class="w-3 h-3 mr-2" /> -->
                  Amount
                </p>
                <p class="text-[10px] flex justify-start items-center pb-2">
                  <!-- <img :src="dateImage" alt="" class="w-3 h-3 mr-2" /> -->
                  Date
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end items-center col-span-2">
        <div class="flex justify-end items-center space-x-2">
          <p
            @click="expenseUpdateAction"
            class="bg-[#ff613c] text-white border border-gray-300 px-3 py-2.5 rounded-lg text-xs cursor-pointer"
          >
            Update Expense
          </p>
        </div>
      </div>
    </div>
    <Modal :isOpen="carModalOpen" @closeModal="carModalOpen = false">
      <DialogPanel
        class="w-full max-w-xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-2 px-4"
        >
          <p>Expense Add</p>
          <XCircleIcon
            class="w-5 h-5 text-white"
            @click="carModalOpen = false"
          />
        </DialogTitle>
        <!-- show date  -->
        <div class="p-4">
          <div class="p-4">
            <div class="grid grid-cols-2 gap-8">
              <div
                class="w-[200px] h-[280px] border rounded-lg border-dashed flex justify-center items-center text-[#FF613c] border-[#FF613c]"
              >
                +
              </div>
              <div class="space-y-4 relative pt-4">
                <div class="space-x-6">
                  <label for="" class="text-[12px] font-medium"
                    >Bank <span class="opacity-0">.....</span></label
                  >
                  <input
                    type="text"
                    name=""
                    placeholder="name"
                    class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                    id=""
                  />
                </div>
                <div class="space-x-6">
                  <label for="" class="text-[12px] font-medium">Amount</label>
                  <input
                    type="text"
                    name=""
                    placeholder="passport"
                    class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                    id=""
                  />
                </div>
                <div class="space-x-6">
                  <label for="" class="text-[12px] font-medium"
                    >Date <span class="opacity-0">......</span></label
                  >
                  <input
                    type="date"
                    name=""
                    placeholder=""
                    class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                    id=""
                  />
                </div>
                <div class="space-x-3 flex justify-start items-start">
                  <label for="" class="text-[12px] font-medium">Comment</label>
                  <textarea
                    class="px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs w-[160px]"
                  >
                  </textarea>
                </div>

                <div
                  class="flex justify-end items-center space-x-2 absolute bottom-0 right-0"
                >
                  <p
                    class="px-3 py-1 bg-gray-500 text-white text-[12px] cursor-pointer rounded-lg"
                  >
                    Save
                  </p>
                  <p
                    @click="
                      () => {
                        carModalOpen = false;
                      }
                    "
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
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { ref, defineProps, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useReservationStore } from "../../stores/reservation";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";

const toast = useToast();
const reservationStore = useReservationStore();

const props = defineProps({
  data: Object,
});

const carModalOpen = ref(false);

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
});

const openFilePickerThree = () => {
  fileInputThree.value.click();
};

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

const expremoveSecSelectedImage = (index) => {
  formData.value.receipt_image.splice(index, 1);
  uploadRecePreview.value.splice(index, 1);
};

const expenseUpdateAction = async () => {
  // your logic to update the expense data goes here
  const frmData = new FormData();
  frmData.append("_method", "PUT");
  formData.value.cost_price &&
    frmData.append("cost_price", formData.value.cost_price);
  formData.value.payment_method &&
    frmData.append("payment_method", formData.value.payment_method);
  formData.value.quantity &&
    frmData.append("quantity", formData.value.quantity);
  formData.value.payment_status &&
    frmData.append("payment_status", formData.value.payment_status);
  if (formData.value.cost_price) {
    if (!formData.value.hotalQuantity) {
      frmData.append(
        "total_cost_price",
        formData.value.cost_price * formData.value.quantity
      );
    } else {
      frmData.append(
        "total_cost_price",
        formData.value.cost_price * formData.value.hotalQuantity
      );
    }
  }
  const response = await reservationStore.updateAction(
    frmData,
    formData.value.id
  );

  if (response.status) {
    const secfrm = new FormData();
    secfrm.append("_method", "PUT");
    if (formData.value.customer_feedback) {
      secfrm.append("customer_feedback", formData.value.customer_feedback);
    }

    if (formData.value.bank_name) {
      secfrm.append("bank_name", formData.value.bank_name);
    }
    if (formData.value.bank_account_number) {
      secfrm.append("bank_account_number", formData.value.bank_account_number);
    }
    if (formData.value.receipt_image.length != 0) {
      if (formData.value.receipt_image.length > 0) {
        for (let i = 0; i < formData.value.receipt_image.length; i++) {
          let file = formData.value.receipt_image[i];
          secfrm.append("receipt_image[" + i + "]", file);
        }
      }
    }

    await reservationStore.updateInfoAction(secfrm, formData.value.id);

    toast.success(response.message);
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }
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
  formData.value.booking_receipt_image.splice(index, 1);
  toast.success("success delete receipt");
};

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

onMounted(() => {
  // Your initial data setup
  if (props.data) {
    console.log(props.data, "cart value");
  }
  if (props.data) {
    formData.value.id = props.data?.id;
    formData.value.cost_price = props.data?.cost_price;
    formData.value.payment_method = props.data?.payment_method;
    formData.value.bank_name =
      props.data?.reservation_info?.bank_name ||
      props.data?.bank_name ||
      props.data?.product.bank_name ||
      "";
    formData.value.bank_account_number =
      props.data?.reservation_info?.bank_account_number ||
      props.data?.bank_account_number ||
      props.data?.product.bank_account_number ||
      "";
    formData.value.payment_status = props.data?.payment_status;
    formData.value.hotalQuantity =
      props.data?.quantity *
      daysBetween(props.data?.checkin_date, props.data?.checkout_date);
    formData.value.quantity = props.data?.quantity;
    // formData.value.receipt_image = props.data?.receipt_image;
    formData.value.booking_receipt_image = props.data?.receipt_images;
    formData.value.product_type = props.data?.product_type;
    formData.value.customer_feedback =
      props.data?.reservation_info?.customer_feedback || "";
  }
});
</script>
