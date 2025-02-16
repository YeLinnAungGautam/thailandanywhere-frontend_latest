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
      <div class="flex justify-end w-full pt-2.5 items-center col-span-2">
        <div class="flex justify-end items-center space-x-2">
          <p
            @click="expenseUpdateAction"
            class="bg-green-500 text-white border border-gray-300 px-3 py-1 rounded-lg text-[10px] cursor-pointer"
          >
            Update Expense
          </p>
        </div>
      </div>
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
        <p class="text-gray-800 text-[10px]">Adult Unit Cost</p>
        <div class="grid grid-cols-3 gap-x-2">
          <input
            v-model="formData.quantity"
            type="number"
            id="title"
            disabled
            class="h-9 rounded-lg w-full bg-white border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
          />
          <input
            v-model="formData.cost_price"
            type="number"
            id="title"
            class="h-9 col-span-2 rounded-lg w-full bg-white border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
          />
        </div>
      </div>
      <div class="space-y-2">
        <p class="text-gray-800 text-[10px]">Child Unit Cost</p>
        <div class="grid grid-cols-3 gap-x-2">
          <input
            v-model="formData.child_quantity"
            type="number"
            id="title"
            disabled
            class="h-9 rounded-lg w-full bg-white border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
          />
          <input
            v-model="formData.child_price"
            type="number"
            id="title"
            class="h-9 col-span-2 rounded-lg w-full bg-white border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
          />
        </div>
      </div>
      <div
        class="space-y-2"
        v-if="
          detail?.product_type == 'App\\Models\\EntranceTicket' ||
          detail?.product_type == 'App\\Models\\Hotel' ||
          detail?.product_type == 'App\\Models\\PrivateVanTour' ||
          detail?.product_type == 'App\\Models\\GroupTour' ||
          detail?.product_type == 'App\\Models\\Airline'
        "
      >
        <div class="space-y-2">
          <p class="text-gray-800 text-[10px]">Total Cost</p>
          <p
            class="h-9 w-full bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
            v-if="!detail?.checkin_date"
          >
            {{
              formData.cost_price * formData.quantity +
              formData.child_price * formData.child_quantity
            }}
          </p>
          <p
            class="h-9 w-full bg-white border rounded-md border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
            v-if="detail?.checkin_date"
          >
            {{ formData.cost_price * formData.hotalQuantity }}
          </p>
        </div>
      </div>
      <div class="space-y-2 col-span-2 w-full">
        <!-- <p class="text-gray-800 text-[10px]">Receipt</p> -->
        <div class="space-y-4 mb-2">
          <input
            type="file"
            id="image"
            ref="fileInputThree"
            class="hidden"
            @change="recehandleFileChange"
            accept="image/*"
          />

          <p
            class="text-[10px]"
            v-if="formData.booking_receipt_image?.length != 0"
          >
            receipt slip
          </p>
          <div class="grid grid-cols-4 gap-4">
            <div class="space-y-2" @click="carModalOpen = true">
              <div
                class="w-full h-[210px] border border-[#FF613c] text-[#FF613c] text-lg flex justify-center items-center rounded-lg border-dashed"
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
              v-for="(image, index) in formData.booking_receipt_image ?? []"
              :key="index"
              class="relative"
            >
              <p
                @click="openPassportModal(image, index)"
                class="absolute top-4 cursor-pointer text-[8px] shadow right-2 text-xs text-white bg-[#FF613c] px-2 py-0.5 rounded-lg"
              >
                <span class="text-[10px]">edit</span>
              </p>
              <a :href="image.file" target="_blink" class="w-full h-auto">
                <img
                  :src="image.file"
                  alt=""
                  class="rounded-lg w-full h-[210px] object-cover"
                />
              </a>
              <div
                class="w-full px-4 pb-1 mt-2 border space-y-2 text-[#FF613c] border-gray-200 shadow hover:shadow-none rounded-lg"
              >
                <p class="text-[10px] flex justify-start items-center pt-2">
                  Bank Name
                </p>
                <p class="text-[10px] flex justify-start items-center">
                  Amount
                </p>
                <p class="text-[10px] flex justify-start items-center pb-2">
                  Date
                </p>
              </div>
            </div>
          </div>
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
          <XCircleIcon class="w-5 h-5 text-white" @click="cancelAction" />
        </DialogTitle>
        <!-- show date  -->
        <div class="p-4">
          <div class="p-4">
            <div class="grid grid-cols-2 gap-8">
              <div
                @click="openFilePickerThree"
                v-if="uploadRecePreview.length == 0 && save?.index == ''"
                class="w-[200px] h-[300px] border rounded-lg border-dashed flex justify-center items-center text-[#FF613c] border-[#FF613c]"
              >
                +
              </div>
              <div
                v-if="uploadRecePreview.length != 0 && save?.index == ''"
                class="w-[200px] h-[300px] border rounded-lg border-dashed flex justify-center items-center text-[#FF613c] border-[#FF613c]"
              >
                <img :src="uploadRecePreview[0]" alt="" class="rounded-lg" />
              </div>
              <div
                v-if="save?.index != ''"
                class="w-[200px] h-[300px] border rounded-lg border-dashed flex justify-center items-center text-[#FF613c] border-[#FF613c]"
              >
                <img :src="save?.data.file" alt="" class="rounded-lg" />
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
                    disabled
                    class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                    id=""
                  />
                </div>
                <div class="space-x-6 flex justify-start">
                  <label for="" class="text-[12px] font-medium"
                    >Bank ? <span class="opacity-0">..</span></label
                  >
                  <div class="flex justify-start items-center space-x-2">
                    <input
                      type="checkbox"
                      name=""
                      disabled
                      placeholder="name"
                      class="py-1.5 focus:outline-none text-xs"
                      id=""
                    />
                    <p class="text-[12px]">Is Corporate ?</p>
                  </div>
                </div>
                <div class="space-x-6">
                  <label for="" class="text-[12px] font-medium">Amount</label>
                  <input
                    type="number"
                    disabled
                    name=""
                    placeholder="xxx"
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
                    disabled
                    placeholder=""
                    class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                    id=""
                  />
                </div>
                <div class="space-x-3 flex justify-start items-start">
                  <label for="" class="text-[12px] font-medium">Comment</label>
                  <textarea
                    disabled
                    class="px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs w-[160px]"
                  >
                  </textarea>
                </div>

                <div
                  class="flex justify-end items-center space-x-2 absolute bottom-0 right-0"
                >
                  <p
                    v-if="save?.index == ''"
                    @click="expenseUpdateAction"
                    class="px-3 py-1 bg-green-500 text-white text-[12px] cursor-pointer rounded-lg"
                  >
                    Save
                  </p>
                  <p
                    v-if="save?.index != ''"
                    @click="
                      removeFeatureDeleteImage(save?.index, save?.data.id)
                    "
                    class="px-3 py-1 bg-red-500 text-white text-[12px] cursor-pointer rounded-lg"
                  >
                    delete
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
import { useRoute } from "vue-router";

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

const cancelAction = () => {
  // your logic to cancel the update goes here
  formData.value.receipt_image = [];
  uploadRecePreview.value = [];
  carModalOpen.value = false;
};

const save = ref({
  data: {},
  index: 0,
});

const openPassportModal = (data, index) => {
  save.value.data = data;
  save.value.index = index;
  console.log("====================================");
  console.log(save.value, "this is save");
  console.log("====================================");
  carModalOpen.value = true;
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
    setTimeout(async () => {
      await props.getDetailAction(route.query.id);
    }, 1000);
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

const removeFeatureDeleteImage = async (index, id) => {
  const res = await reservationStore.deleteResImage(id);
  toast.success("detected successfully");
  carModalOpen.value = false;
  // console.log(editData.value.customer_passport, "this is remove");

  save.value = {
    data: "",
    index: "",
  };

  setTimeout(async () => {
    await props.getDetailAction(route.query.id);
  }, 1000);
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
