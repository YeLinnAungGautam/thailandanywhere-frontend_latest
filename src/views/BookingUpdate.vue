<script setup>
import Layout from "./Layout.vue";
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { PlusIcon, ListBulletIcon } from "@heroicons/vue/24/outline";
import { computed, onMounted, onUnmounted, ref } from "vue";
import Button from "../components/Button.vue";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import Modal from "../components/Modal.vue";
import CustomerCreate from "../components/CustomerCreate.vue";
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
import { useInclusiveStore } from "../stores/inclusion";

const enabled = ref(false);

const toast = useToast();
const sidebar = useSidebarStore();
const router = useRouter();
const route = useRoute();
const customerStore = useCustomerStore();
const vantourStore = useVantourStore();
const grouptourStore = useGrouptourStore();
const airportStore = useAirportStore();
const entranceStore = useEntranceStore();
const bookingStore = useBookingStore();
const inclusiveStore = useInclusiveStore();

const { customer, loading } = storeToRefs(customerStore);
const { vantours } = storeToRefs(vantourStore);
const { grouptours } = storeToRefs(grouptourStore);
const { airports } = storeToRefs(airportStore);
const { entrances } = storeToRefs(entranceStore);
const { inclusives } = storeToRefs(inclusiveStore);
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
  { id: "2", name: "THB" },
];
const reservation_status = [
  { id: "1", name: "reserved" },
  { id: "2", name: "awaiting_payment" },
  { id: "3", name: "declined" },
];

const formItemType = [
  { id: "1", name: "Van Tour" },
  { id: "2", name: "Group Tour" },
  { id: "3", name: "Airport Pickup" },
  { id: "4", name: "Entrance Ticket" },
  { id: "5", name: "Inclusive" },
];

const formData = ref({
  customer_id: "",
  sold_from: "",
  payment_method: "",
  payment_status: "",
  booking_date: "",
  items: [],
  money_exchange_rate: "",
  discount: "",
  comment: "",
  receipt_image: "",
  confirmation_letter: [],
  due_date: "",
  deposit: 0,
  balance_due_date: "",
  receipt_images: [],
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
  service_date: "",
  quantity: "",
  duration: "",
  selling_price: "",
  comment: "",
  car_id: "",
  car_list: [],
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
  } else if (formitem.value.product_type == "5") {
    await inclusiveStore.getSimpleListAction();
    productList.value = inclusives.value.data;
    console.log(productList.value);
  }
};
const addNewitem = () => {
  formData.value.items.push(formitem.value);
  console.log(formData.value.items);
  formitem.value = {
    product_type: "",
    product_id: "",
    service_date: "",
    quantity: "",
    duration: "",
    selling_price: "",
    car_id: "",
    car_list: [],
    car_name: "",
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

const onSubmitHandler = async () => {
  const frmData = new FormData();
  frmData.append("_method", "PUT");
  frmData.append("customer_id", formData.value.customer_id);
  frmData.append("sold_from", formData.value.sold_from);
  frmData.append("payment_method", formData.value.payment_method);
  frmData.append("payment_status", formData.value.payment_status);
  frmData.append("booking_date", formData.value.booking_date);
  frmData.append("money_exchange_rate", formData.value.money_exchange_rate);
  frmData.append("discount", formData.value.discount);
  frmData.append("comment", formData.value.comment);
  frmData.append("receipt_image", formData.value.receipt_image);
  frmData.append("sub_total", sub_total.value);
  frmData.append("grand_total", grand_total.value);
  frmData.append("deposit", formData.value.deposit);
  frmData.append("payment_currency", formData.value.payment_currency);
  frmData.append("balance_due", balance_due.value);
  frmData.append("balance_due_date", formData.value.balance_due_date);
  // if (formData.value.reciept_image.length > 0) {
  //   for (let i = 0; i < formData.value.reciept_image.length; i++) {
  //     let file = formData.value.reciept_image[i];
  //     frmData.append("items[" + i + "][receipt_image]", file);
  //   }
  // }
  if (formData.value.confirmation_letter.length > 0) {
    for (let i = 0; i < formData.value.confirmation_letter.length; i++) {
      let file = formData.value.confirmation_letter[i];
      frmData.append("items[" + i + "][confirmation_letter]", file);
    }
  }
  for (var x = 0; x < formData.value.items.length; x++) {
    if (
      formData.value.items[x].product_type == "1" ||
      formData.value.items[x].product_type == "App\\Models\\PrivateVanTour"
    ) {
      frmData.append(
        "items[" + x + "][product_type]",
        `App\\Models\\PrivateVanTour`
      );
    } else if (
      formData.value.items[x].product_type == "2" ||
      formData.value.items[x].product_type == "App\\Models\\GroupTour"
    ) {
      frmData.append(
        "items[" + x + "][product_type]",
        `App\\Models\\GroupTour`
      );
    } else if (
      formData.value.items[x].product_type == "3" ||
      formData.value.items[x].product_type == "App\\Models\\AirportPickup"
    ) {
      frmData.append(
        "items[" + x + "][product_type]",
        `App\\Models\\AirportPickup`
      );
    } else if (
      formData.value.items[x].product_type == "4" ||
      formData.value.items[x].product_type == "App\\Models\\EntranceTicket"
    ) {
      frmData.append(
        "items[" + x + "][product_type]",
        `App\\Models\\EntranceTicket`
      );
    } else if (
      formData.value.items[x].product_type == "5" ||
      formData.value.items[x].product_type == "App\\Models\\Inclusive"
    ) {
      frmData.append(
        "items[" + x + "][product_type]",
        `App\\Models\\Inclusive`
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
    const response = await bookingStore.updateAction(frmData, route.params.id);
    formData.value = {
      customer_id: "",
      sold_from: "",
      payment_method: "",
      payment_status: "",
      booking_date: "",
      items: [],
      reciept_image: [],
      money_exchange_rate: "",
      car_name: "",
      discount: "",
      comment: "",
      receipt_image: "",
      confirmation_letter: [],
      due_date: "",
      deposit: 0,
      balance_due_date: "",
    };
    balance_due.value = "";

    errors.value = null;
    toast.success(response.message);
    // router.push("/bookings/update/" + route.params.id);
    window.location.reload(true);
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
  } else if (formitem.value.product_type == "5") {
    const res = await inclusiveStore.getDetailAction(id);
    formitem.value.selling_price = res.result.price;
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
  } else if (type == "5") {
    const res = await inclusiveStore.getDetailAction(productId);
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
const getDetail = async () => {
  try {
    const response = await bookingStore.getDetailAction(route.params.id);
    console.log(response, "this is response");
    formData.value.customer_id = response.result.customer.id;
    formData.value.sold_from = response.result.sold_from;
    formData.value.payment_method = response.result.payment_method;
    formData.value.payment_status = response.result.payment_status;
    formData.value.payment_currency = response.result.payment_currency;
    formData.value.booking_date = response.result.booking_date;
    formData.value.money_exchange_rate = response.result.money_exchange_rate;
    formData.value.money_exchange_rate = response.result.money_exchange_rate;
    formData.value.comment = response.result.comment;
    formData.value.discount = response.result.discount;
    formData.value.balance_due_date = response.result.balance_due_date;
    formData.value.deposit = response.result.deposit;
    formData.value.receipt_images = response.result.receipts;
    console.log(formData.value.receipt_images, "this is image");
    for (const x in response.result.items) {
      const itemData = {
        product_type: response.result.items[x].product_type,
        product_id: response.result.items[x].product_id,
        service_date: response.result.items[x].service_date,
        quantity: response.result.items[x].quantity,
        duration: response.result.items[x].duration,
        selling_price: response.result.items[x].selling_price,
        comment: response.result.items[x].comment,
        reservation_status: response.result.items[x].reservation_status,
        payment_method: response.result.items[x].payment_method,
        payment_status: response.result.items[x].payment_status,
        exchange_rate: response.result.items[x].exchange_rate,
        cost_price: response.result.items[x].cost_price,
        car_id: response.result.items[x].car
          ? response.result.items[x].car.id
          : "",
        car_name: response.result.items[x].car
          ? response.result.items[x].car.name
          : "",
      };
      formData.value.items.push(itemData);
    }
    loadingState.value = false;
  } catch (error) {
    console.log(error);
  }
};
const changeType = (a) => {
  if (a == "App\\Models\\PrivateVanTour") {
    return (a.value = "1");
  } else if (a == "App\\Models\\GroupTour") {
    return (a.value = "2");
  } else if (a == "App\\Models\\Airport Pickup") {
    return (a.value = "3");
  } else if (a == "App\\Models\\Entrance Ticket") {
    return (a.value = "4");
  } else if (a == "App\\Models\\Inclusive") {
    return (a.value = "5");
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

const addComment = ref(false);
const addToggle = () => {
  if (addComment.value) {
    addComment.value = false;
  } else {
    addComment.value = true;
  }
};

const url = ref("");
const urlPaid = ref("");
const action = ref("");

const loadingState = ref(false);

const allowCreate = computed(() => {
  if (
    formData.value.items.length != 0 &&
    formData.value.deposit != 0 &&
    formData.value.receipt_image != ""
  ) {
    return true;
  } else if (formData.value.items.length != 0 && formData.value.deposit == 0) {
    return true;
  } else {
    return false;
  }
});

onMounted(async () => {
  loadingState.value = true;
  await getDetail();
  await vantourStore.getSimpleListAction();
  await grouptourStore.getSimpleListAction();
  await airportStore.getSimpleListAction();
  await entranceStore.getSimpleListAction();
  await inclusiveStore.getSimpleListAction();
  await customerStore.getSimpleListAction();
  url.value =
    "https://api-blog.thanywhere.com/admin/bookings/" +
    route.params.id +
    "/receipt";
  urlPaid.value =
    "https://api-blog.thanywhere.com/admin/bookings/" +
    route.params.id +
    "/receipt?paid=1";
  action.value = route.params.action;
});
</script>

<template>
  <Layout>
    <div>
      <div
        v-if="loadingState"
        class="h-screen w-full flex justify-center items-center"
      >
        <div class="flex space-x-4 justify-center items-center">
          <p class=" ">Loading , Please wait</p>
          <div role="status">
            <svg
              aria-hidden="true"
              class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      </div>
      <div
        v-if="!loadingState"
        class="grid grid-cols-3 gap-3 bg-blue-100/50 col-span-2 p-6 rounded-lg shadow-sm mb-5"
      >
        <div class="mb-5 flex items-center justify-between col-span-3">
          <h3
            class="text-2xl font-medium text-blue-400"
            v-if="action == 'view'"
          >
            View Sale
          </h3>
          <h3
            class="text-2xl font-medium text-blue-400"
            v-if="action == 'edit'"
          >
            Update Sale
          </h3>
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
                    :class="{
                      'bg-white rounded-lg': formData.customer_id !== '',
                    }"
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
                    :class="{
                      'bg-white rounded-lg': formData.booking_date !== '',
                    }"
                    type="date"
                    id="title"
                    class="h-10 w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
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
                    :class="{
                      'bg-white rounded-lg': formData.sold_from !== '',
                    }"
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
                    :class="{
                      'bg-white rounded-lg': formData.payment_method !== '',
                    }"
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
                    :class="{
                      'bg-white rounded-lg': formData.payment_currency !== '',
                    }"
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
                    :class="{
                      'bg-white rounded-lg': formData.payment_status !== '',
                    }"
                    :options="payment_status"
                    label="name"
                    :clearable="false"
                    :reduce="(d) => d.name"
                  ></v-select>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-blue-400 text-xs mb-2">Balance Due Date</p>

                  <input
                    v-model="formData.balance_due_date"
                    type="date"
                    id="title"
                    :class="
                      formData.balance_due_date != ''
                        ? 'bg-white'
                        : ' bg-transparent'
                    "
                    class="h-10 w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
                  />
                  <p
                    v-if="errors?.balance_due_date"
                    class="mt-1 text-sm text-red-600"
                  >
                    {{ errors.balance_due_date[0] }}
                  </p>
                </div>
              </div>
            </div>
            <div class="col-span-1 text-end space-y-4">
              <p class="text-blue-400 text-xs">Balance Due</p>
              <p class="text-blue-400 font-bold text-4xl tracking-wide">
                {{ balance_due }} thb
              </p>

              <a
                :href="urlPaid"
                target="_blink"
                class="border border-blue-400 inline-block py-2 px-4"
              >
                <p class="text-blue-400 text-sm">Receive Payment</p>
              </a>
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
                            class="py-2 text-start px-4 text-xs text-blue-400"
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
                              class="style-chooser max-w-[200px]"
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
                              class="style-chooser min-w-[200px]"
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
                              class="px-1 py-1.5 text-xs focus:outline-none rounded"
                              :class="
                                todayVali == true
                                  ? 'text-blue-600'
                                  : 'text-red-600'
                              "
                            />
                            <p class="text-xs text-red-400" v-if="!todayVali">
                              fill after today
                            </p>
                          </td>
                          <td
                            class="py-3 text-start px-4 border-gray-300 text-sm text-gray-800"
                          >
                            <input
                              type="number"
                              v-model="formitem.quantity"
                              class="border-gray-400 px-1 py-1.5 max-w-[50px] focus:outline-none rounded border"
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
                        <tr
                          class="border-b border-gray-300 text-xs text-red-500"
                        >
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
                            <i
                              v-if="item.reservation_status == 'reserved'"
                              class="fa-solid fa-circle-check text-lg text-green-600"
                            ></i>
                            <i
                              v-if="
                                item.reservation_status == 'awaiting_payment'
                              "
                              class="fa-solid fa-circle-exclamation text-lg text-yellow-500"
                            ></i>
                            <i
                              v-if="item.reservation_status == 'declined'"
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
                            <!-- <p v-if="item.product_type == '1'">Vantour</p>
                            <p v-if="item.product_type == '2'">Group</p>
                            <p v-if="item.product_type == '3'">Airport</p>
                            <p v-if="item.product_type == '4'">Entrance</p> -->
                            <div class="col-span-1">
                              <div
                                class="py-2 text-gray-600"
                                v-if="
                                  item.product_type ==
                                    'App\\Models\\PrivateVanTour' ||
                                  item.product_type == '1'
                                "
                              >
                                <p class="text-sm inline-block">
                                  Private Van Tour
                                </p>
                              </div>
                              <div
                                class="py-2 text-gray-600"
                                v-if="
                                  item.product_type ==
                                    'App\\Models\\GroupTour' ||
                                  item.product_type == '2'
                                "
                              >
                                <p class="text-sm inline-block">Group Tour</p>
                              </div>
                              <div
                                class="py-2 text-gray-600"
                                v-if="
                                  item.product_type ==
                                    'App\\Models\\AirportPickup' ||
                                  item.product_type == '3'
                                "
                              >
                                <p class="text-sm inline-block">
                                  Airport Pickup
                                </p>
                              </div>
                              <div
                                class="text-md py-2 text-bold text-gray-600"
                                v-if="
                                  item.product_type ==
                                    'App\\Models\\EntranceTicket' ||
                                  item.product_type == '4'
                                "
                              >
                                <p class="text-sm inline-block">
                                  Entrance Ticket
                                </p>
                              </div>
                              <div
                                class="text-md py-2 text-bold text-gray-600"
                                v-if="
                                  item.product_type ==
                                    'App\\Models\\Inclusive' ||
                                  item.product_type == '5'
                                "
                              >
                                <p class="text-sm inline-block">Inclusive</p>
                              </div>
                            </div>
                          </td>
                          <td
                            class="py-3 text-start px-4 border-gray-300 text-sm text-gray-800"
                          >
                            <v-select
                              v-if="
                                item.product_type ==
                                  'App\\Models\\PrivateVanTour' ||
                                item.product_type == '1'
                              "
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
                              v-if="
                                item.product_type == 'App\\Models\\GroupTour' ||
                                item.product_type == '2'
                              "
                              v-model="item.product_id"
                              class="style-chooser"
                              :options="grouptours?.data"
                              label="name"
                              :clearable="false"
                              :reduce="(d) => d.id"
                              placeholder="Choose product type"
                            ></v-select>
                            <v-select
                              v-if="
                                item.product_type ==
                                  'App\\Models\\AirportPickup' ||
                                item.product_type == '3'
                              "
                              v-model="item.product_id"
                              class="style-chooser"
                              :options="airports?.data"
                              label="name"
                              :clearable="false"
                              :reduce="(d) => d.id"
                              placeholder="Choose product type"
                            ></v-select>
                            <v-select
                              v-if="
                                item.product_type ==
                                  'App\\Models\\EntranceTicket' ||
                                item.product_type == '4'
                              "
                              v-model="item.product_id"
                              class="style-chooser"
                              :options="entrances?.data"
                              label="name"
                              :clearable="false"
                              :reduce="(d) => d.id"
                              placeholder="Choose product type"
                            ></v-select>
                            <v-select
                              v-if="
                                item.product_type == 'App\\Models\\Inclusive' ||
                                item.product_type == '5'
                              "
                              v-model="item.product_id"
                              class="style-chooser"
                              :options="inclusives?.data"
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
                              v-if="item.car_id && !item.car_name"
                              v-model="item.car_id"
                              class="style-chooser"
                              :options="item.car_list"
                              label="name"
                              disabled
                              :clearable="false"
                              :reduce="(d) => d.id"
                              placeholder="Choose product type"
                            ></v-select>
                            <p v-if="item.car_id && item.car_name">
                              {{ item.car_name }}
                            </p>
                            <p v-if="!item.car_id">-</p>
                          </td>
                          <td
                            class="py-3 text-start px-4 border-gray-300 text-sm text-gray-800"
                          >
                            <input
                              type="date"
                              v-model="item.service_date"
                              class="focus:outline-none text-xs"
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
                    <div class="col-span-2 grid grid-cols-3 gap-4 mt-4">
                      <!-- <div
                        v-for="(image, index) in formData.receipt_images"
                        :key="index"
                      >
                        <a :href="image.image" target="_blink">
                          <img :src="image.image" alt="" />
                        </a>
                      </div> -->
                    </div>

                    <div class="mt-6 px-6">
                      <div class="grid grid-cols-2 gap-4">
                        <p
                          class="text-gray-800 text-sm mb-2 text-end pr-8 mt-3"
                        >
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
                        <p
                          class="text-gray-800 text-sm mb-2 text-end pr-8 mt-3"
                        >
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
                        <p
                          class="text-gray-800 text-sm mb-2 text-end pr-8 mt-3"
                        >
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
                        <p
                          class="text-gray-800 text-sm mb-2 text-end pr-8 mt-3"
                        >
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
                      <div
                        class="grid grid-cols-2 gap-4"
                        :class="action == 'view' ? 'mb-4' : ''"
                      >
                        <p
                          class="text-gray-800 text-sm mb-2 text-end pr-8 mt-3"
                        >
                          Balance Due:
                        </p>
                        <input
                          type="text"
                          v-model="balance_due"
                          id="title"
                          class="h-8 mt-2 w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                        />
                      </div>
                      <!-- <div
                        class="grid grid-cols-2 gap-4"
                        :class="action == 'view' ? 'mb-4' : ''"
                      >
                        <p class="text-gray-800 text-sm mb-2 text-end pr-8 mt-3">
                          Due Date:
                        </p>
                        <input
                          type="date"
                          v-model="formData.balance_due_date"
                          id="title"
                          class="h-8 mt-2 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-sm"
                        />
                      </div> -->
                      <div
                        class="text-end mt-6 mb-3"
                        v-if="allowCreate && action == 'edit'"
                      >
                        <Button
                          @click.prevent="onSubmitHandler"
                          class="px-14 py-2"
                        >
                          Update
                        </Button>
                      </div>
                      <div
                        class="text-end mt-6 mb-3"
                        v-if="!allowCreate && action == 'edit'"
                      >
                        <Button class="px-14 py-2 bg-gray-300"> Update </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-span-3 grid grid-cols-4 gap-4 mt-4">
                <div
                  v-for="(image, index) in formData.receipt_images"
                  :key="index"
                >
                  <p class="text-sm mb-2">Receipt Image {{ index + 1 }}</p>
                  <a :href="image.image" target="_blink">
                    <img :src="image.image" alt="" />
                  </a>
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
  padding: 10px 5px;
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
