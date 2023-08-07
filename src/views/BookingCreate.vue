<script setup>
import Layout from "./Layout.vue";
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { PlusIcon, ListBulletIcon } from "@heroicons/vue/24/outline";
import { computed, onMounted, onUnmounted, ref } from "vue";
import Button from "../components/Button.vue";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import CustomerCreate from "../components/CustomerCreate.vue";
import Modal from "../components/Modal.vue";
import { useToast } from "vue-toastification";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useCustomerStore } from "../stores/customer";
import { useVantourStore } from "../stores/vantour";
import { useGrouptourStore } from "../stores/grouptour";
import { useAirportStore } from "../stores/airport";
import { useEntranceStore } from "../stores/entrance";
import { useBookingStore } from "../stores/booking";
import { useSidebarStore } from "../stores/sidebar";

const enabled = ref(false);

const toast = useToast();
const router = useRouter();
const route = useRoute();
const customerStore = useCustomerStore();
const vantourStore = useVantourStore();
const grouptourStore = useGrouptourStore();
const airportStore = useAirportStore();
const entranceStore = useEntranceStore();
const bookingStore = useBookingStore();
const sidebar = useSidebarStore();

const { customer, loading } = storeToRefs(customerStore);
const { vantours } = storeToRefs(vantourStore);
const { grouptours } = storeToRefs(grouptourStore);
const { airports } = storeToRefs(airportStore);
const { entrances } = storeToRefs(entranceStore);
const { isOpenCustomerCreate } = storeToRefs(sidebar);

const soldFrom = [
  { id: "1", name: "Facebook" },
  { id: "2", name: "Twitter" },
  { id: "3", name: "Instagram" },
  { id: "4", name: "Telegram" },
];
const payment = [
  { id: "1", name: "KPAY" },
  { id: "2", name: "AYAPAY" },
  { id: "3", name: "CBPAY" },
  { id: "4", name: "KBZ BANKING" },
  { id: "5", name: "CB BANKING" },
  { id: "6", name: "MAB BANKING" },
];
const payment_status = [
  { id: "1", name: "fully_paid" },
  { id: "2", name: "not_paid" },
  { id: "3", name: "partially_paid" },
];
const payment_currency = [
  { id: "1", name: "MMK" },
  { id: "2", name: "USD" },
];
const reservation_status = [
  { id: "1", name: "reserved" },
  { id: "2", name: "awaiting_payment" },
  { id: "3", name: "declined" },
];

const formItemType = [
  { id: "1", name: "Van Tour", data: "App\Models\PrivateVanTour" },
  { id: "2", name: "Group Tour", data: "App\Models\GroupTour" },
  { id: "3", name: "Airport Pickup", data: " App\Models\AirportPickup" },
  { id: "4", name: "Entrance Ticket", data: "App\Models\EntranceTicket" },
];

const formData = ref({
  customer_id: "",
  sold_from: "",
  payment_method: "",
  payment_status: "",
  booking_date: "",
  payment_currency: "",
  items: [],
  money_exchange_rate: "",
  discount: "",
  comment: "",
  receipt_image: "",
  confirmation_letter: [],
  due_date: "",
  deposit: 0,
  balance_due_date: "",
});

const sub_total = computed(() => {
  let totalsub = 0;
  for (let i = 0; i < formData.value.items.length; i++) {
    totalsub =
      totalsub +
      formData.value.items[i].selling_price *
        formData.value.items[i].quantity *
        1;
  }
  return totalsub;
});

const grand_total = computed(() => {
  // console.log(sub_total.value, formData.value.discount);
  if (formData.value.discount.trim().endsWith("%")) {
    let remove = parseFloat(formData.value.discount);
    let calculate = (sub_total.value * remove) / 100;
    let final = sub_total.value - calculate;
    return final;
  } else {
    let final = sub_total.value - formData.value.discount;
    return final;
  }
});

const balance_due = computed(() => {
  return grand_total.value - formData.value.deposit;
});

const formitem = ref({
  product_type: "",
  product_id: "",
  car_id: "",
  car_list: [],
  service_date: "",
  quantity: "1",
  duration: "",
  selling_price: "",
  comment: "",
  reservation_status: "",
  payment_method: "",
  payment_status: "",
  exchange_rate: "",
  cost_price: "",
});
const productList = ref([]);
const chooseType = async () => {
  if (formitem.value.product_type == "1") {
    await vantourStore.getSimpleListAction();
    productList.value = vantours.value.data;
    console.log(productList.value);
  } else if (formitem.value.product_type == "2") {
    await grouptourStore.getSimpleListAction();
    productList.value = grouptours.value.data;
    console.log(productList.value);
  } else if (formitem.value.product_type == "3") {
    await airportStore.getSimpleListAction();
    productList.value = airports.value.data;
    console.log(productList.value);
  } else if (formitem.value.product_type == "4") {
    await entranceStore.getSimpleListAction();
    productList.value = entrances.value.data;
    console.log(productList.value);
  }
};
const carType = ref([]);
const chooseCar = async (id) => {
  if (formitem.value.product_type == "1" && id) {
    const res = await vantourStore.getDetailAction(id);
    console.log(res);
    carType.value = res.result.cars;
  } else if (formitem.value.product_type == "2") {
    const res = await grouptourStore.getDetailAction(id);
    formitem.value.selling_price = res.result.price;
    carType.value = res.result.cars;
    console.log(res);
  } else if (formitem.value.product_type == "3") {
    const res = await airportStore.getDetailAction(id);
    carType.value = res.result.cars;
    console.log(res);
  } else if (formitem.value.product_type == "4") {
    const res = await entranceStore.getDetailAction(id);
    formitem.value.selling_price = res.result.variations[0].price;
    console.log(res.result.variations[0].price);
  }
};
const chooseCarPrice = async (type, productId, id) => {
  if (type == "1") {
    const res = await vantourStore.getDetailAction(productId);
    console.log(res);
    for (let i = 0; i < res.result.cars.length; i++) {
      formitem.value.car_list = res.result.cars;
      if (res.result.cars[i].id == id) {
        formitem.value.selling_price = res.result.cars[i].price;
        console.log(res.result.cars[i].price);
      }
    }
  } else if (type == "2") {
    const res = await grouptourStore.getDetailAction(productId);
    formitem.value.car_list = res.result.cars;
    for (let i = 0; i < res.result.cars.length; i++) {
      if (res.result.cars[i].id == id) {
        formitem.value.selling_price = res.result.cars[i].price;
        console.log(res.result.cars[i].price);
      }
    }
    console.log(res);
  } else if (type == "3") {
    const res = await airportStore.getDetailAction(productId);
    formitem.value.car_list = res.result.cars;
    for (let i = 0; i < res.result.cars.length; i++) {
      if (res.result.cars[i].id == id) {
        formitem.value.selling_price = res.result.cars[i].price;
        console.log(res.result.cars[i].price);
      }
    }
    console.log(res);
  } else if (type == "4") {
    const res = await entranceStore.getDetailAction(productId);
    formitem.value.car_list = res.result.cars;
    for (i = 0; i < res.result.cars.length; i++) {
      if (res.result.cars[i].id == id) {
        formitem.value.selling_price = res.result.cars[i].price;
        console.log(res.result.cars[i].price);
      }
    }
    console.log(res);
  }
};
const addNewitem = () => {
  formData.value.items.push(formitem.value);
  console.log(formData.value.items);
  formitem.value = {
    product_type: "",
    product_id: "",
    service_date: "",
    car_id: "",
    car_list: [],
    quantity: "",
    duration: "",
    selling_price: "",
    comment: "",
    reservation_status: "",
    payment_method: "",
    payment_status: "",
    exchange_rate: "",
    cost_price: "",
  };
  todayVali.value = false;
  addToggle();
};

const removeFromitem = (index) => {
  formData.value.items.splice(index, 1);
};

const errors = ref(null);

const featureImageInput = ref(null);
const featureImagePreview = ref(null);

const openFileFeaturePicker = () => {
  featureImageInput.value.click();
};

const handlerFeatureFileChange = (e) => {
  let selectedFile = e.target.files[0];
  if (selectedFile) {
    formData.value.receipt_image = e.target.files[0];
    featureImagePreview.value = URL.createObjectURL(selectedFile);
  }
};

const removeFeatureSelectImage = () => {
  formData.value.receipt_image = "";
  featureImagePreview.value = null;
};

const addComment = ref(false);
const addToggle = () => {
  if (addComment.value) {
    addComment.value = false;
  } else {
    addComment.value = true;
  }
};

const onSubmitHandler = async () => {
  const frmData = new FormData();
  frmData.append("customer_id", formData.value.customer_id);
  frmData.append("sold_from", formData.value.sold_from);
  frmData.append("payment_method", formData.value.payment_method);
  frmData.append("payment_status", formData.value.payment_status);
  frmData.append("booking_date", formData.value.booking_date);

  frmData.append("discount", formData.value.discount);
  frmData.append("comment", formData.value.comment);
  frmData.append("sub_total", sub_total.value);
  frmData.append("grand_total", grand_total.value);
  frmData.append("deposit", formData.value.deposit);
  frmData.append("payment_currency", formData.value.payment_currency);
  frmData.append("balance_due", balance_due.value);
  frmData.append("balance_due_date", formData.value.balance_due_date);
  // if (formData.value.receipt_image.length > 0) {
  //   for (let i = 0; i < formData.value.receipt_image.length; i++) {
  //     let file = formData.value.receipt_image[i];
  //     frmData.append("items[" + i + "][receipt_image]", file);
  //   }
  // }
  frmData.append("receipt_image", formData.value.receipt_image);
  if (formData.value.confirmation_letter.length > 0) {
    for (let i = 0; i < formData.value.confirmation_letter.length; i++) {
      let file = formData.value.confirmation_letter[i];
      frmData.append("items[" + i + "][confirmation_letter]", file);
    }
  }
  for (var x = 0; x < formData.value.items.length; x++) {
    if (formData.value.items[x].product_type == "1") {
      frmData.append(
        "items[" + x + "][product_type]",
        `App\\Models\\PrivateVanTour`
      );
    } else if (formData.value.items[x].product_type == "2") {
      frmData.append(
        "items[" + x + "][product_type]",
        `App\\Models\\GroupTour`
      );
    } else if (formData.value.items[x].product_type == "3") {
      frmData.append(
        "items[" + x + "][product_type]",
        `App\\Models\\AirportPickup`
      );
    } else if (formData.value.items[x].product_type == "4") {
      frmData.append(
        "items[" + x + "][product_type]",
        `App\\Models\\EntranceTicket`
      );
    }
  }
  for (var x = 0; x < formData.value.items.length; x++) {
    frmData.append(
      "items[" + x + "][product_id]",
      formData.value.items[x].product_id
    );
  }
  for (var x = 0; x < formData.value.items.length; x++) {
    frmData.append("items[" + x + "][car_id]", formData.value.items[x].car_id);
  }
  for (var x = 0; x < formData.value.items.length; x++) {
    frmData.append(
      "items[" + x + "][service_date]",
      formData.value.items[x].service_date
    );
  }
  for (var x = 0; x < formData.value.items.length; x++) {
    frmData.append(
      "items[" + x + "][quantity]",
      formData.value.items[x].quantity
    );
  }
  for (var x = 0; x < formData.value.items.length; x++) {
    frmData.append(
      "items[" + x + "][duration]",
      formData.value.items[x].duration
    );
  }
  for (var x = 0; x < formData.value.items.length; x++) {
    frmData.append(
      "items[" + x + "][selling_price]",
      formData.value.items[x].selling_price
    );
  }
  for (var x = 0; x < formData.value.items.length; x++) {
    frmData.append(
      "items[" + x + "][comment]",
      formData.value.items[x].comment
    );
  }
  for (var x = 0; x < formData.value.items.length; x++) {
    frmData.append(
      "items[" + x + "][reservation_status]",
      formData.value.items[x].reservation_status
    );
  }
  for (var x = 0; x < formData.value.items.length; x++) {
    frmData.append(
      "items[" + x + "][payment_method]",
      formData.value.items[x].payment_method
    );
  }
  for (var x = 0; x < formData.value.items.length; x++) {
    frmData.append(
      "items[" + x + "][payment_status]",
      formData.value.items[x].payment_status
    );
  }
  for (var x = 0; x < formData.value.items.length; x++) {
    frmData.append(
      "items[" + x + "][exchange_rate]",
      formData.value.items[x].exchange_rate
    );
  }
  for (var x = 0; x < formData.value.items.length; x++) {
    frmData.append(
      "items[" + x + "][cost_price]",
      formData.value.items[x].cost_price
    );
  }

  try {
    const response = await bookingStore.addNewAction(frmData);
    formData.value = {
      customer_id: "",
      sold_from: "",
      payment_method: "",
      payment_status: "",
      booking_date: "",
      items: [],
      receipt_image: [],
      money_exchange_rate: "",
      discount: "",
      comment: "",
    };
    enabled.value = false;
    errors.value = null;
    toast.success(response.message);
    router.push("/bookings");
  } catch (error) {
    console.log(
      "🚀 ~ file: NewBlogView.vue:38 ~ onSubmitHandler ~ error:",
      error
    );
    if (error.response.data.errors) {
      errors.value = error.response.data.errors;
    }
    toast.error(error.response.data.message);
  }
};
const todayVali = ref("");
const getTodayDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  formData.value.booking_date = `${year}-${month}-${day}`;
};
const isBeforeToday = (date) => {
  const today = new Date();
  return new Date(date) < today;
};
const isAfterToday = (date) => {
  const today = new Date();
  return new Date(date) > today;
};

const todayCheck = () => {
  console.log(formitem.value.service_date);
  todayVali.value = isAfterToday(formitem.value.service_date);
  console.log(todayVali.value, "this is value");
};

const desopen = ref(false);

const clickdes = () => {
  desopen.value = true;
};
const closedes = () => {
  desopen.value = false;
};
const clickdetaildes = ref(false);
const itemDes = ref();
const clickdetaildesToggle = (a) => {
  clickdetaildes.value = true;
  itemDes.value = a;
};
const clickdetaildesClose = () => {
  clickdetaildes.value = false;
  itemDes.value = "";
};

const customerOpen = ref(false);
const customerOpenH = () => {
  sidebar.toggleCustomerCreate();
};
const customerClose = async () => {
  sidebar.toggleCustomerCreate();
  await customerStore.getSimpleListAction();
};

onMounted(async () => {
  await customerStore.getSimpleListAction();
  getTodayDate();
});
</script>

<template>
  <Layout>
    <div
      class="grid grid-cols-3 gap-3 bg-blue-100/50 col-span-2 p-6 rounded-lg shadow-sm mb-5"
    >
      <div class="mb-5 flex items-center justify-between col-span-3">
        <h3 class="text-2xl font-medium text-blue-400">Create New Sales</h3>
        <div
          class="space-x-3 px-2 text-xs py-1.5 hover:shadow-lg border shadow-sm rounded cursor-pointer bg-blue-400 text-white"
          @click="customerOpenH"
        >
          <i class="fa-solid fa-user-plus"></i> Create New Customer
        </div>
      </div>
      <div class="col-span-3">
        <div class="grid grid-cols-3">
          <div class="grid grid-cols-2 gap-4 col-span-2">
            <div class="grid grid-cols-2 gap-4">
              <div class="">
                <p class="text-blue-400 text-xs mb-2">Customer Name</p>

                <v-select
                  v-model="formData.customer_id"
                  class="style-chooser placeholder-sm"
                  :options="customer?.data"
                  label="name"
                  :clearable="false"
                  :reduce="(d) => d.id"
                ></v-select>
              </div>
              <div class="">
                <p class="text-blue-400 text-xs mb-2">Sale Date</p>
                <input
                  v-model="formData.booking_date"
                  type="date"
                  id="title"
                  class="h-10 w-full bg-white/50 border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
                />
                <p
                  v-if="errors?.booking_date"
                  class="mt-1 text-sm text-red-600"
                >
                  {{ errors.booking_date[0] }}
                </p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="">
                <p class="text-blue-400 text-xs mb-2">Sold From</p>
                <v-select
                  v-model="formData.sold_from"
                  class="style-chooser"
                  :options="soldFrom"
                  label="name"
                  :clearable="false"
                  :reduce="(d) => d.name"
                ></v-select>
              </div>
              <div class="">
                <p class="text-blue-400 text-xs mb-2">Payment Method</p>
                <v-select
                  v-model="formData.payment_method"
                  class="style-chooser"
                  :options="payment"
                  label="name"
                  :clearable="false"
                  :reduce="(d) => d.name"
                ></v-select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-blue-400 text-xs mb-2">Payment Currency</p>
                <v-select
                  v-model="formData.payment_currency"
                  class="style-chooser"
                  :options="payment_currency"
                  label="name"
                  :clearable="false"
                  :reduce="(d) => d.name"
                ></v-select>
              </div>
              <div>
                <p class="text-blue-400 text-xs mb-2">Payment Status</p>
                <v-select
                  v-model="formData.payment_status"
                  class="style-chooser"
                  :options="payment_status"
                  label="name"
                  :clearable="false"
                  :reduce="(d) => d.name"
                ></v-select>
              </div>
            </div>
          </div>
          <div class="col-span-1 text-end space-y-4">
            <p class="text-blue-400 text-xs">Balance Due</p>
            <p class="text-blue-400 font-bold text-4xl tracking-wide">
              {{ balance_due }} thb
            </p>
            <p
              class="text-blue-400 border border-blue-400 inline-block py-2 px-4 text-sm"
            >
              Receive Payment
            </p>
          </div>

          <div class="gird grid-cols-1 col-span-3 pt-10">
            <div
              class="mb-3 text-sm font-semibold cursor-pointer flex justify-end"
            >
              <p @click="addToggle" v-if="!addComment">+ Add Item</p>
              <p @click="addToggle" v-if="addComment">- Remove Item</p>
            </div>
            <div class="col-span-1 bg-white p-3 rounded">
              <div class="col-span-1">
                <Modal :isOpen="desopen" @closeModal="desopen = false">
                  <DialogPanel
                    class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
                  >
                    <DialogTitle
                      as="h3"
                      class="text-md font-medium leading-6 text-gray-900 mb-5"
                    >
                      Description
                    </DialogTitle>
                    <div class="grid grid-cols-1 py-4">
                      <textarea
                        name=""
                        id=""
                        class="border border-gray-300 rounded-sm focus:outline-none px-4 py-4 text-sm"
                        cols="30"
                        rows="10"
                        v-model="formitem.comment"
                      ></textarea>
                    </div>
                    <div class="flex justify-between items-center">
                      <button @click="closedes" class="text-sm">close</button>
                      <button
                        @click="closedes"
                        class="text-sm px-2 py-1 bg-blue-500 text-white rounded"
                      >
                        + add
                      </button>
                    </div>
                  </DialogPanel>
                </Modal>
                <Modal
                  :isOpen="isOpenCustomerCreate"
                  @closeModal="isOpenCustomerCreate = false"
                >
                  <DialogPanel
                    class="w-full max-w-[800px] transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
                  >
                    <CustomerCreate action="sales" />
                    <div class="flex justify-end items-center">
                      <button @click="customerClose" class="text-sm">
                        close
                      </button>
                    </div>
                  </DialogPanel>
                </Modal>
                <Modal
                  :isOpen="clickdetaildes"
                  @closeModal="clickdetaildesToggle = false"
                >
                  <DialogPanel
                    class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
                  >
                    <DialogTitle
                      as="h3"
                      class="text-md font-medium leading-6 text-gray-900 mb-5"
                    >
                      Detail Description
                    </DialogTitle>
                    <div class="grid grid-cols-1 py-4">
                      <textarea
                        name=""
                        id=""
                        class="border border-gray-300 rounded-sm focus:outline-none px-4 py-4 text-sm"
                        cols="30"
                        rows="10"
                        v-model="itemDes"
                      ></textarea>
                    </div>
                    <div class="flex justify-between items-center">
                      <button @click="clickdetaildesClose" class="text-sm">
                        close
                      </button>
                    </div>
                  </DialogPanel>
                </Modal>
                <div class="px-6 pt-3">
                  <table class="w-full">
                    <thead>
                      <tr class="border-b border-gray-300">
                        <th
                          class="border-r py-2 text-start px-4 border-gray-300 text-xs text-blue-400"
                        ></th>

                        <th
                          class="border-r py-2 text-start px-4 border-gray-300 text-xs text-blue-400"
                        >
                          P Type
                        </th>
                        <th
                          class="border-r py-2 text-start px-4 border-gray-300 text-xs text-blue-400"
                        >
                          Product Name
                        </th>
                        <th
                          class="border-r py-2 text-start px-4 border-gray-300 text-xs text-blue-400"
                        >
                          Car Type
                        </th>

                        <th
                          class="border-r py-2 text-start px-4 border-gray-300 text-xs text-blue-400"
                        >
                          Service Date
                        </th>
                        <th
                          class="border-r py-2 text-start px-4 border-gray-300 text-xs text-blue-400"
                        >
                          Quantity
                        </th>
                        <th
                          class="border-r py-2 text-start px-4 border-gray-300 text-xs text-blue-400"
                        >
                          Amount
                        </th>
                        <th
                          class="py-2 text-start px-4 border-gray-300 text-xs text-blue-400"
                        ></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="rounded-lg" v-if="addComment">
                        <td
                          colspan="2"
                          class="py-3 text-start px-4 border-gray-300 text-sm text-gray-800"
                        >
                          <v-select
                            v-model="formitem.product_type"
                            class="style-chooser min-w-[80px]"
                            :options="formItemType"
                            label="name"
                            :clearable="false"
                            :reduce="(d) => d.id"
                            @option:selected="chooseType"
                          ></v-select>
                        </td>
                        <td
                          class="py-3 text-start px-4 border-gray-300 text-sm text-gray-800"
                        >
                          <v-select
                            v-model="formitem.product_id"
                            class="style-chooser min-w-[100px]"
                            :options="productList"
                            label="name"
                            :clearable="false"
                            :reduce="(d) => d.id"
                            @option:selected="chooseCar(formitem.product_id)"
                          ></v-select>
                        </td>
                        <td
                          class="py-3 text-start px-4 border-gray-300 text-sm text-gray-800"
                        >
                          <div
                            class=""
                            v-if="
                              formitem.product_type == '1' ||
                              formitem.product_type == '3'
                            "
                          >
                            <v-select
                              v-model="formitem.car_id"
                              class="style-chooser"
                              :options="carType"
                              label="name"
                              :clearable="false"
                              :reduce="(d) => d.id"
                              @option:selected="
                                chooseCarPrice(
                                  formitem.product_type,
                                  formitem.product_id,
                                  formitem.car_id
                                )
                              "
                            ></v-select>
                          </div>
                        </td>
                        <td
                          class="py-3 text-start px-4 border-gray-300 text-sm text-gray-800"
                        >
                          <input
                            type="date"
                            v-model="formitem.service_date"
                            @change="todayCheck"
                            id="title"
                            class="px-1 py-1.5 focus:outline-none rounded"
                            :class="
                              todayVali == true
                                ? 'text-blue-600'
                                : 'text-red-600'
                            "
                          />
                          <p class="text-xs text-red-400" v-if="!todayVali">
                            must be another day after today
                          </p>
                        </td>
                        <td
                          class="py-3 text-start px-4 border-gray-300 text-sm text-gray-800"
                        >
                          <input
                            type="number"
                            v-model="formitem.quantity"
                            class="border-gray-400 px-1 py-1.5 focus:outline-none rounded border"
                          />
                        </td>
                        <td
                          class="py-3 text-start px-4 border-gray-300 text-sm text-gray-800"
                        >
                          <p>{{ formitem.selling_price }}</p>
                        </td>

                        <td
                          class="py-3 text-start px-4 border-gray-300 text-sm text-gray-800"
                        >
                          <button
                            class="text-sm text-blue-600 mr-4"
                            @click="clickdes"
                          >
                            <i
                              class="fa-solid fa-ellipsis text-xs font-semibold px-1 py-[1.5px] bg-blue-500 rounded-full shadow text-white"
                              title="add description"
                            ></i>
                          </button>
                          <button
                            @click.prevent="addNewitem"
                            class="flex-1"
                            v-if="formitem.product_id && todayVali"
                          >
                            <i
                              class="fa-solid fa-plus text-xs font-semibold px-1 py-[1.5px] rounded-full shadow text-white bg-blue-600"
                            ></i>
                          </button>
                        </td>
                      </tr>
                      <tr class="border-b border-gray-300 text-xs text-red-500">
                        <td
                          class="text-right pb-2"
                          colspan="8"
                          v-if="addComment"
                        >
                          don't forget to click add button for new item!
                        </td>
                      </tr>
                      <tr
                        class="border-b border-gray-300"
                        v-for="(item, index) in formData.items"
                        :key="index"
                      >
                        <td
                          class="py-3 text-start px-4 border-gray-300 text-sm text-gray-800"
                        >
                          <!-- <i
                            class="fa-solid fa-circle-check text-lg text-green-600"
                          ></i>
                          <i
                            class="fa-solid fa-circle-exclamation text-lg text-yellow-500"
                          ></i> -->
                          <i
                            class="fa-solid fa-circle-xmark text-lg text-red-600"
                          ></i>
                        </td>
                        <td
                          class="py-3 text-start px-4 border-gray-300 text-sm text-gray-800"
                        >
                          <!-- <v-select
                            v-model="item.product_type"
                            class="style-chooser"
                            :options="formItemType"
                            label="name"
                            disabled
                            :clearable="false"
                            :reduce="(d) => d.id"
                            placeholder="Choose product type"
                          ></v-select> -->
                          <p v-if="item.product_type == '1'">Vantour</p>
                          <p v-if="item.product_type == '2'">Group</p>
                          <p v-if="item.product_type == '3'">Airport</p>
                          <p v-if="item.product_type == '4'">Entrance</p>
                        </td>
                        <td
                          class="py-3 text-start px-4 border-gray-300 text-sm text-gray-800"
                        >
                          <v-select
                            v-if="item.product_type == '1'"
                            v-model="item.product_id"
                            class="style-chooser"
                            disabled
                            :options="vantours?.data"
                            label="name"
                            :clearable="false"
                            :reduce="(d) => d.id"
                            placeholder="Choose product type"
                          ></v-select>
                          <v-select
                            v-if="item.product_type == '2'"
                            v-model="item.product_id"
                            class="style-chooser"
                            :options="grouptours?.data"
                            label="name"
                            :clearable="false"
                            :reduce="(d) => d.id"
                            placeholder="Choose product type"
                          ></v-select>
                          <v-select
                            v-if="item.product_type == '3'"
                            v-model="item.product_id"
                            class="style-chooser"
                            :options="airports?.data"
                            label="name"
                            :clearable="false"
                            :reduce="(d) => d.id"
                            placeholder="Choose product type"
                          ></v-select>
                          <v-select
                            v-if="item.product_type == '4'"
                            v-model="item.product_id"
                            class="style-chooser"
                            :options="entrances?.data"
                            label="name"
                            :clearable="false"
                            :reduce="(d) => d.id"
                            placeholder="Choose product type"
                          ></v-select>
                        </td>
                        <td
                          class="py-3 text-start px-4 border-gray-300 text-sm text-gray-800"
                        >
                          <v-select
                            v-if="item.car_id"
                            v-model="item.car_id"
                            class="style-chooser"
                            disabled
                            :options="item.car_list"
                            label="name"
                            :clearable="false"
                            :reduce="(d) => d.id"
                            placeholder="Choose product type"
                          ></v-select>
                          <p v-if="!item.car_id">-</p>
                        </td>
                        <td
                          class="py-3 text-start px-4 border-gray-300 text-sm text-gray-800"
                        >
                          <input
                            type="date"
                            v-model="item.service_date"
                            class="focus:outline-none"
                          />
                        </td>
                        <td
                          class="py-3 text-start px-4 border-gray-300 text-sm text-gray-800"
                        >
                          <p>{{ item.quantity }}</p>
                        </td>
                        <td
                          class="py-3 text-start px-4 border-gray-300 text-sm text-gray-800"
                        >
                          <p>{{ item.selling_price }}</p>
                        </td>

                        <td
                          class="py-3 text-start px-4 border-gray-300 text-sm text-gray-800"
                        >
                          <button
                            class="text-sm text-blue-600 mr-4"
                            @click="clickdetaildesToggle(item.comment)"
                          >
                            <i
                              class="fa-solid fa-ellipsis text-xs font-semibold px-1 py-[1.5px] bg-blue-500 rounded-full shadow text-white"
                              title="add description"
                            ></i>
                          </button>
                          <button
                            class="text-sm text-red-600"
                            @click.prevent="removeFromitem(index)"
                          >
                            <i
                              class="fa-solid fa-minus text-xs font-semibold px-1 py-[1.5px] bg-red-500 rounded-full shadow text-white"
                            ></i>
                          </button>
                        </td>
                      </tr>
                      <tr
                        class="border-b border-gray-300"
                        v-if="formData.items.length == 0"
                      >
                        <td
                          colspan="10"
                          class="py-3 px-4 text-center border-gray-300 text-sm text-red-500"
                        >
                          there isn't item !
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="grid grid-cols-3">
                  <div></div>
                  <div></div>
                  <div class="mt-6 px-6">
                    <div class="grid grid-cols-2 gap-4">
                      <p class="text-gray-800 text-sm mb-2 text-end pr-8 mt-3">
                        Subtotal
                      </p>
                      <input
                        v-model="sub_total"
                        disabled
                        type="text"
                        id="title"
                        class="h-8 mt-2 w-full bg-gray-300 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                      />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <p class="text-gray-800 text-sm mb-2 text-end pr-8 mt-3">
                        Discount
                      </p>
                      <input
                        v-model="formData.discount"
                        type="text"
                        id="title"
                        class="h-8 mt-2 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                      />
                      <p
                        v-if="errors?.discount"
                        class="mt-1 text-sm text-red-600"
                      >
                        {{ errors.discount[0] }}
                      </p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <p class="text-gray-800 text-sm mb-2 text-end pr-8 mt-3">
                        Total:
                      </p>
                      <input
                        v-model="grand_total"
                        disabled
                        type="text"
                        id="title"
                        class="h-8 mt-2 w-full bg-gray-300 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                      />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <p class="text-gray-800 text-sm mb-2 text-end pr-8 mt-3">
                        Deposit:
                      </p>
                      <input
                        type="text"
                        v-model="formData.deposit"
                        id="title"
                        class="h-8 mt-2 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                      />
                    </div>
                    <!-- <div class="grid grid-cols-2 gap-4">
                      <p class="text-gray-800 text-sm mb-2 text-end pr-8 mt-3">
                        Reciept Image
                      </p>
                      <input
                        @change="handlerFeatureFileChange"
                        type="file"
                        id="title"
                        class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                      />
                    </div> -->
                    <div
                      class="grid grid-cols-2 gap-4"
                      v-if="formData.deposit > 0"
                    >
                      <div class="relative">
                        <p
                          class="text-gray-800 text-sm mb-2 text-end pr-8 mt-3"
                        >
                          Reciept Image
                        </p>
                        <input
                          type="file"
                          ref="featureImageInput"
                          class="hidden"
                          @change="handlerFeatureFileChange"
                          accept="image/*"
                        />
                        <button
                          v-if="!featureImagePreview"
                          @click.prevent="openFileFeaturePicker"
                          class="text-sm text-blue-500"
                        ></button>
                        <button
                          v-else
                          @click.prevent="removeFeatureSelectImage"
                          class="rounded-full text-sm text-red-600 absolute top-[4px] right-[-33px]"
                        >
                          <XCircleIcon class="w-8 h-8 font-semibold" />
                        </button>
                      </div>
                      <div
                        v-if="!featureImagePreview"
                        @click.prevent="openFileFeaturePicker"
                        class="cursor-pointer mt-2 w-full h-[100px] border-2 border-dashed border-gray-400 rounded flex justify-center items-center"
                      >
                        <span class="text-xs"
                          ><i
                            class="fa-solid fa-plus text-lg font-semibold py-3 px-5 bg-blue-500 rounded-full shadow text-white"
                          ></i
                        ></span>
                      </div>
                      <div v-if="featureImagePreview" class="">
                        <img
                          class="h-auto w-full rounded mt-2"
                          :src="featureImagePreview"
                          alt=""
                        />
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <p class="text-gray-800 text-sm mb-2 text-end pr-8 mt-3">
                        Balance Due:
                      </p>
                      <input
                        type="text"
                        disabled
                        v-model="balance_due"
                        id="title"
                        class="h-8 mt-2 w-full bg-gray-300 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                      />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <p class="text-gray-800 text-sm mb-2 text-end pr-8 mt-3">
                        Due Date:
                      </p>
                      <input
                        type="date"
                        v-model="formData.balance_due_date"
                        id="title"
                        class="h-8 mt-2 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-sm"
                      />
                    </div>
                    <div
                      class="text-end mt-6 mb-3"
                      v-if="
                        formData.items.length != 0 &&
                        formData.receipt_image != ''
                      "
                    >
                      <Button
                        @click.prevent="onSubmitHandler"
                        class="px-14 py-2"
                      >
                        Create
                      </Button>
                    </div>
                    <div
                      class="text-end mt-6 mb-3"
                      v-if="
                        formData.items.length == 0 ||
                        formData.receipt_image == ''
                      "
                    >
                      <Button class="px-14 py-2 bg-gray-400"> Create </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style>
.style-chooser .vs__dropdown-toggle {
  border: 1px solid #d1d5db;
  padding: 4px 2px 4px 2px !important;
  border-radius: 8px;
}

.style-chooser .vs__dropdown-menu .vs__dropdown-option--highlight {
  background: #2563eb;
}

.style-chooser .vs__dropdown-menu .vs__dropdown-option {
  padding: 10px 18px;
}

.style-chooser .vs__dropdown-toggle .vs__selected-options .vs__selected {
  padding: 4px 10px;
  border: none;
}
.vs__selected {
  font-size: 14px !important;
}

.table-responsive {
  overflow-y: visible !important;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for Firefox */
.scrollbar-hide {
  scrollbar-width: none;
}
</style>
