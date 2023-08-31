<script setup>
import Layout from "./Layout.vue";
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { PlusIcon, ListBulletIcon } from "@heroicons/vue/24/outline";
import { onMounted, onUnmounted, ref } from "vue";
import Button from "../components/Button.vue";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

import { useToast } from "vue-toastification";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useCustomerStore } from "../stores/customer";
import { useVantourStore } from "../stores/vantour";
import { useGrouptourStore } from "../stores/grouptour";
import { useAirportStore } from "../stores/airport";
import { useEntranceStore } from "../stores/entrance";
import { useReservationStore } from "../stores/reservation";
import { useInclusiveStore } from "../stores/inclusion";

const enabled = ref(false);

const toast = useToast();
const router = useRouter();
const route = useRoute();
const customerStore = useCustomerStore();
const vantourStore = useVantourStore();
const grouptourStore = useGrouptourStore();
const airportStore = useAirportStore();
const entranceStore = useEntranceStore();
const reservationStore = useReservationStore();
const inclusiveStore = useInclusiveStore();

const { customer, loading } = storeToRefs(customerStore);
const { vantours } = storeToRefs(vantourStore);
const { grouptours } = storeToRefs(grouptourStore);
const { airports } = storeToRefs(airportStore);
const { entrances } = storeToRefs(entranceStore);
const { inclusives } = storeToRefs(inclusiveStore);

const soldFrom = [
  { id: "1", name: "Facebook" },
  { id: "2", name: "Twitter" },
  { id: "3", name: "Instagram" },
  { id: "4", name: "Telegram" },
];
const payment = [
  { id: "1", name: "K+" },
  { id: "2", name: "SCB" },
  { id: "3", name: "Bankok Bank" },
];
const payment_status = [
  { id: "1", name: "fully_paid" },
  { id: "2", name: "not_paid" },
  { id: "3", name: "partially_paid" },
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
  comment: "",
  confirmation_letter: "",
  cost_price: "",
  duration: "",
  exchange_rate: "",
  payment_method: "",
  payment_status: "",
  product_id: "",
  product_type: "",
  quantity: "",
  car_id: "",
  car_name: "",
  receipt_image: "",
  reservation_status: "",
  selling_price: "",
  service_date: "",
  product_name: "",
  cus_name: "",
  cus_contact: "",
  cus_passport: "",
  cus_email: "",
});

const secForm = ref({
  customer_feedback: "",
  customer_score: "",
  special_request: "",
  other_info: "",
  supplier_name: "",
  driver_name: "",
  driver_contact: "",
  car_number: "",
  car_photo: "",
  pickup_location: "",
  route_plan: "",
});

const fileInput = ref(null);
const previewImage = ref(null);

const openFilePicker = () => {
  fileInput.value.click();
};

const handleFileChange = (e) => {
  let selectedFile = e.target.files[0];
  if (selectedFile) {
    secForm.value.car_photo = e.target.files[0];
    previewImage.value = URL.createObjectURL(selectedFile);
  }
};

const removeSelectedImage = () => {
  secForm.value.car_photo = null;
  previewImage.value = null;
};

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

const errors = ref(null);

const handlerFeatureFileChange = (e) => {
  let selectedFile = e.target.files[0];
  formData.value.receipt_image = selectedFile;
};
const handlerConfirmFileChange = (e) => {
  let selectedFileCon = e.target.files[0];

  formData.value.confirmation_letter = selectedFileCon;
};

const onSubmitHandler = async () => {
  const frmData = new FormData();
  frmData.append("_method", "PUT");
  frmData.append("duration", formData.value.duration);
  frmData.append("payment_method", formData.value.payment_method);
  frmData.append("payment_status", formData.value.payment_status);
  // frmData.append("product_id", formData.value.comment);
  frmData.append("product_type", formData.value.product_type);
  frmData.append("quantity", formData.value.quantity);
  frmData.append("receipt_image", formData.value.receipt_image);
  frmData.append("reservation_status", formData.value.reservation_status);
  frmData.append("selling_price", formData.value.selling_price);
  frmData.append("service_date", formData.value.service_date);
  frmData.append("car_id", formData.value.car_id);

  try {
    const response = await reservationStore.updateAction(
      frmData,
      route.params.id
    );
    if (response.status) {
      const secfrm = new FormData();
      secfrm.append("_method", "PUT");
      secfrm.append("customer_feedback", secForm.value.customer_feedback);
      secfrm.append("customer_score", secForm.value.customer_score);
      secfrm.append("special_request", secForm.value.special_request);
      secfrm.append("other_info", secForm.value.other_info);
      secfrm.append("supplier_name", secForm.value.supplier_name);
      secfrm.append("driver_name", secForm.value.driver_name);
      secfrm.append("driver_contact", secForm.value.driver_contact);
      secfrm.append("car_number", secForm.value.car_number);
      secfrm.append("car_photo", secForm.value.car_photo);
      await reservationStore.updateInfoAction(secfrm, route.params.id);
    }
    formData.value = {
      comment: "",
      confirmation_letter: "",
      cost_price: "",
      duration: "",
      exchange_rate: "",
      payment_method: "",
      payment_status: "",
      product_id: "",
      product_type: "",
      quantity: "",
      car_id: "",
      car_name: "",
      variation_name: "",
      receipt_image: "",
      reservation_status: "",
      selling_price: "",
      service_date: "",
      product_name: "",
      cus_name: "",
      cus_contact: "",
      cus_passport: "",
      cus_email: "",
      receipt_images: [],
    };
    secForm.value = {
      customer_feedback: "",
      customer_score: "",
      special_request: "",
      other_info: "",
      supplier_name: "",
      driver_name: "",
      driver_contact: "",
      pickup_location: "",
      route_plan: "",
      car_number: "",
      car_photo: "",
    };

    errors.value = null;
    toast.success(response.message);
    router.push("/reservation");
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

const route_plan = ref("");

const booking_status = ref("");

const getDetail = async () => {
  try {
    const response = await reservationStore.getDetailAction(route.params.id);
    console.log(response, "this is response");
    booking_status.value = response.result.booking;
    formData.value.duration = response.result.duration;
    if (response.result.reservation_info) {
      if (response.result.reservation_info.special_request != null) {
        secForm.value.special_request =
          response.result.reservation_info.special_request;
      }
    } else if (
      response.result.special_request &&
      !response.result.reservation_info
    ) {
      secForm.value.special_request = response.result.special_request;
    }
    console.log(secForm.value.special_request, "this is special");
    if (response.result.product_type != "App\\Models\\Inclusive") {
      if (response.result.product.name != null) {
        formData.value.product_name = response.result.product.name;
      }
    } else {
      formData.value.product_name = "inclusive";
    }
    formData.value.cus_name = response.result.customer_info.name;
    formData.value.cus_contact = response.result.customer_info.phone_number;
    formData.value.cus_passport = response.result.customer_info.nrc_number;
    formData.value.cus_email = response.result.customer_info.email;
    if (response.result.reservation_info != null) {
      secForm.value.route_plan = response.result.reservation_info.route_plan;
      updateArray();
    } else if (response.result.product_type === "App\\Models\\PrivateVanTour") {
      secForm.value.route_plan = response.result.product.description;
      updateArray();
    }
    console.log(secForm.value.route_plan);
    if (response.result.reservation_info != null) {
      secForm.value.customer_feedback =
        response.result.reservation_info.customer_feedback;
      secForm.value.customer_score =
        response.result.reservation_info.customer_score;
      secForm.value.route_plan = response.result.reservation_info.route_plan;
      secForm.value.other_info = response.result.reservation_info.other_info;
      secForm.value.pickup_location =
        response.result.reservation_info.pickup_location;
    } else {
      secForm.value.customer_feedback = "";
      secForm.value.customer_score = "";
      secForm.value.pickup_location = "";
      secForm.value.other_info = "";
    }

    if (response.result.reservation_car_info != null) {
      secForm.value.supplier_name =
        response.result.reservation_car_info.supplier_name;
      secForm.value.driver_name =
        response.result.reservation_car_info.driver_name;
      secForm.value.driver_contact =
        response.result.reservation_car_info.driver_contact;
      secForm.value.car_number =
        response.result.reservation_car_info.car_number;
      previewImage.value = response.result.reservation_car_info.car_photo;
    } else {
      secForm.value.supplier_name = "";
      secForm.value.driver_name = "";
      secForm.value.driver_contact = "";
      secForm.value.car_number = "";
      previewImage.value = "";
    }

    if (response.result.payment_method == "null") {
      formData.value.payment_method = "";
    } else {
      formData.value.payment_method = response.result.payment_method;
    }

    if (response.result.payment_status == "null") {
      formData.value.payment_status = "";
    } else {
      formData.value.payment_status = response.result.payment_status;
    }

    if (response.result.exchange_rate == "null") {
      formData.value.exchange_rate = "";
    } else {
      formData.value.exchange_rate = response.result.exchange_rate;
    }

    if (response.result.duration == "null") {
      formData.value.duration = "";
    } else {
      formData.value.duration = response.result.duration;
    }
    if (response.result.reservation_status == "null") {
      formData.value.reservation_status = "";
    } else {
      formData.value.reservation_status = response.result.reservation_status;
    }
    if (response.result.cost_price == "null") {
      formData.value.cost_price = "";
    } else {
      formData.value.cost_price = response.result.cost_price;
    }
    if (response.result.car == null) {
      formData.value.car_id = "";
      formData.value.car_name = "-";
    } else if (response.result.car != null) {
      formData.value.car_id = response.result.car.id;
      formData.value.car_name = response.result.car.name;
    }
    if (response.result.variation == null) {
      formData.value.variation_name = "";
    } else if (response.result.variation != null) {
      formData.value.variation_name = response.result.variation.name;
    }
    if (response.result.comment == "null") {
      formData.value.comment = "";
    } else {
      formData.value.comment = response.result.comment;
    }
    formData.value.receipt_images = response.result.booking?.receipts;
    formData.value.product_id = response.result.product_id;
    formData.value.product_type = response.result.product_type;
    formData.value.quantity = response.result.quantity;
    // showImage.value.receipt_image = response.result.receipt_image;
    // formData.value.reservation_status = response.result.reservation_status;
    formData.value.selling_price = response.result.selling_price;
    formData.value.service_date = response.result.service_date;

    console.log(formData.value, "first");
    console.log(secForm.value, "sec");
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

const payment_part = ref(true);
const paymentHandle = () => {
  payment_part.value = !payment_part.value;
};

const customer_info_part = ref(true);
const customerHandle = () => {
  customer_info_part.value = !customer_info_part.value;
};

const feedback_part = ref(true);
const feedbackHandle = () => {
  feedback_part.value = !feedback_part.value;
};
const receipt_part = ref(true);
const receiptHandle = () => {
  receipt_part.value = !receipt_part.value;
};

const carInfo_part = ref(true);
const carInfoPartHandle = () => {
  carInfo_part.value = !carInfo_part.value;
};

const route_plan_part = ref(true);
const routePlanHandle = () => {
  route_plan_part.value = !route_plan_part.value;
};

const reser_plan_part = ref(true);
const reserPlanHandle = () => {
  reser_plan_part.value = !reser_plan_part.value;
};

const other_info_part = ref(true);
const otherInfoHandle = () => {
  other_info_part.value = !other_info_part.value;
};

const car_info_sec = ref(true);
const carInfoSecHandle = () => {
  car_info_sec.value = !car_info_sec.value;
};

const routeArray = ref([]);
const updateArray = () => {
  routeArray.value = secForm.value.route_plan
    ?.split(",")
    .map((item) => item.trim());
  console.log(routeArray.value, "this is array");
};

const action = ref("");
const crm = ref("");
onMounted(async () => {
  await getDetail();
  await vantourStore.getSimpleListAction();
  await grouptourStore.getSimpleListAction();
  await airportStore.getSimpleListAction();
  await entranceStore.getSimpleListAction();
  await customerStore.getSimpleListAction();
  await inclusiveStore.getSimpleListAction();
  action.value = route.params.action;
  crm.value = route.params.crm;
});
</script>

<template>
  <Layout>
    <div>
      <div class="flex justify-between items-center pb-6">
        <p class="text-blue-500 font-semibold text-sm">
          Reservation : Car Rental
        </p>
        <p
          class="px-4 py-2 border border-blue-500 text-blue-500 text-xs"
          v-if="formData.reservation_status == 'reserved'"
        >
          Complete Booking
        </p>
        <p
          class="px-4 py-2 border border-blue-500 text-blue-500 text-xs"
          v-if="formData.reservation_status != 'reserved'"
        >
          Pending Booking
        </p>
      </div>
      <div class="grid grid-cols-3 gap-8">
        <div class="col-span-2">
          <div
            class="flex justify-start items-center text-xs bg-blue-500 text-white font-semibold px-4 py-2"
          >
            <p>Reservation Code :</p>
            <p class="ml-2">{{ crm }}</p>
          </div>

          <div
            class="flex justify-start items-center px-4 py-2 shadow bg-white space-x-4 text-xs border-b border-gray-300 cursor-pointer"
            @click="paymentHandle"
          >
            <i class="fa-solid fa-angle-down"></i>
            <p>Payment status</p>
          </div>
          <div
            class="grid grid-cols-2 gap-4 bg-gray-200/50 py-4"
            v-if="payment_part"
          >
            <div class="pl-10 space-y-2">
              <p class="text-gray-400 text-xs">Payment Currency</p>
              <p class="font-semibold text-xs py-1.5">
                {{ booking_status.payment_currency }}
              </p>
            </div>
            <div class="pl-10 pr-10 space-y-2">
              <p class="text-gray-400 text-xs">Payment Method:</p>
              <!-- <p class="font-semibold text-xs">Collect</p> -->
              <p class="font-semibold text-xs py-1.5">
                {{ booking_status.payment_method }}
              </p>
              <!-- <v-select
                v-model="formData.payment_method"
                class="style-chooser font-semibold text-xs py-1.5"
                :options="payment"
                label="name"
                :clearable="false"
                :reduce="(d) => d.name"
                placeholder=""
              ></v-select> -->
            </div>
            <div class="pl-10 pr-10 space-y-2">
              <p class="text-gray-400 text-xs">Payment Status</p>
              <p class="font-semibold text-xs py-1.5">
                {{ booking_status.payment_status }}
              </p>
              <!-- <v-select
                v-model="formData.payment_status"
                class="style-chooser font-semibold text-xs py-1.5"
                :options="payment_status"
                label="name"
                :clearable="false"
                :reduce="(d) => d.name"
                placeholder=""
              ></v-select> -->
            </div>
            <div class="pl-10 pr-10 space-y-2">
              <p class="text-gray-400 text-xs">Reservation Status</p>
              <p class="font-semibold text-xs py-1.5">
                {{ booking_status.reservation_status }}
              </p>
              <!-- <v-select
                v-model="formData.reservation_status"
                class="style-chooser font-semibold text-xs py-1.5"
                :options="reservation_status"
                label="name"
                :clearable="false"
                :reduce="(d) => d.name"
                placeholder=""
              ></v-select> -->
            </div>
            <div class="pl-10 pr-10 space-y-2">
              <p class="text-gray-400 text-xs">Payment Due:</p>
              <p class="font-semibold text-xs">{{ formData.service_date }}</p>
              <!-- <input
                v-model="formData.service_date"
                type="date"
                id="title"
                class="h-8 font-semibold w-full bg-transparent py-0 text-gray-900 focus:outline-none focus:border-0 text-xs"
              /> -->
            </div>
          </div>

          <div
            class="flex justify-start items-center px-4 py-2 shadow bg-white space-x-4 text-xs border-b border-gray-300 cursor-pointer"
            @click="customerHandle"
          >
            <i class="fa-solid fa-angle-down"></i>
            <p>Customer Infomation</p>
          </div>
          <div
            class="grid grid-cols-2 gap-4 bg-gray-200/50 py-4"
            v-if="customer_info_part"
          >
            <div class="pl-10 space-y-2">
              <p class="text-gray-400 text-xs">Name</p>
              <p class="font-semibold text-xs">{{ formData.cus_name }}</p>
            </div>
            <div class="pl-10 space-y-2">
              <p class="text-gray-400 text-xs">Contact</p>
              <p class="font-semibold text-xs">{{ formData.cus_contact }}</p>
            </div>
            <div class="pl-10 space-y-2">
              <p class="text-gray-400 text-xs">Passport Number</p>
              <p class="font-semibold text-xs">{{ formData.cus_passport }}</p>
            </div>
            <div class="pl-10 space-y-2">
              <p class="text-gray-400 text-xs">Email:</p>
              <p class="font-semibold text-xs">{{ formData.cus_email }}</p>
            </div>
          </div>

          <div
            class="flex justify-start items-center px-4 py-2 shadow bg-white space-x-4 text-xs border-b border-gray-300 cursor-pointer"
            @click="carInfoPartHandle"
          >
            <i class="fa-solid fa-angle-down"></i>
            <p>Car Infomation</p>
          </div>
          <div
            class="grid grid-cols-2 gap-4 bg-gray-200/50 py-4"
            v-if="carInfo_part"
          >
            <div class="pl-10 space-y-2">
              <p
                v-if="formData.product_type == 'App\\Models\\EntranceTicket'"
                class="text-gray-400 text-xs"
              >
                Variation Type
              </p>
              <p
                v-if="formData.product_type != 'App\\Models\\EntranceTicket'"
                class="text-gray-400 text-xs"
              >
                Car Type
              </p>
              <p
                class="font-semibold text-xs"
                v-if="formData.product_type == 'App\\Models\\EntranceTicket'"
              >
                {{ formData.variation_name }}
              </p>
              <p
                class="font-semibold text-xs"
                v-if="formData.product_type != 'App\\Models\\EntranceTicket'"
              >
                {{ formData.car_name }}
              </p>
            </div>
            <div class="pl-10 space-y-2">
              <p class="text-gray-400 text-xs">Product</p>
              <p class="font-semibold text-xs">{{ formData.product_name }}</p>
            </div>
            <div class="pl-10 space-y-2">
              <p class="text-gray-400 text-xs">Pickup Time</p>
              <p class="font-semibold text-xs">08:00 am</p>
            </div>
            <div class="pl-10 pr-10 space-y-2">
              <p class="text-gray-400 text-xs">Durations</p>
              <input
                v-model="formData.duration"
                type="text"
                id="title"
                class="h-8 w-full bg-transparent font-semibold py-2 text-gray-900 focus:outline-none text-xs"
              />
            </div>
          </div>

          <div
            class="flex justify-start items-center px-4 py-2 shadow bg-white space-x-4 text-xs border-b border-gray-300 cursor-pointer"
            @click="feedbackHandle"
          >
            <i class="fa-solid fa-angle-down"></i>
            <p>Customer Reviews</p>
          </div>
          <div class="bg-gray-200/50 py-4 space-y-2" v-if="feedback_part">
            <div class="pl-10 pr-10 space-y-2">
              <p class="text-gray-400 text-xs font">Feedback</p>

              <textarea
                class="w-full bg-transparent font-semibold py-2 text-gray-900 focus:outline-none text-xs"
                cols="4"
                v-model="secForm.customer_feedback"
              ></textarea>
            </div>
            <div class="pl-10 pr-10 pb-8 space-y-2">
              <p class="text-gray-400 text-xs font">Score</p>
              <input
                v-model="secForm.customer_score"
                type="text"
                id="title"
                class="h-8 w-full bg-transparent font-semibold py-2 text-gray-900 focus:outline-none text-xs"
              />
            </div>
          </div>
          <div
            class="flex justify-start items-center px-4 py-2 shadow bg-white space-x-4 text-xs border-b border-gray-300 cursor-pointer"
            @click="receiptHandle"
          >
            <i class="fa-solid fa-angle-down"></i>
            <p>Receipt Images</p>
          </div>
          <div class="grid grid-cols-3 gap-4" v-if="receipt_part">
            <div v-for="(image, index) in formData.receipt_images" :key="index">
              <p class="text-xs mb-2 mt-2">Receipt Image {{ index + 1 }}</p>
              <a :href="image.image" target="_blink">
                <img :src="image.image" alt="" />
              </a>
            </div>
          </div>
        </div>

        <div class=" ">
          <div
            class="flex justify-start items-center text-xs bg-blue-500 text-white font-semibold px-4 py-2"
          >
            <p>Add Reservation Detail</p>
          </div>
          <div
            class="flex justify-start items-center px-4 py-2 shadow bg-white space-x-4 text-xs border-b border-gray-300 cursor-pointer"
            @click="routePlanHandle"
          >
            <i class="fa-solid fa-angle-down"></i>
            <p>Route Plan</p>
          </div>
          <div class="bg-gray-200/50 p-6" v-if="route_plan_part">
            <div class="pl-4 space-y-2 border border-gray-200 p-4 bg-white">
              <ol v-for="r in routeArray" :key="r">
                <li class="text-xs font-semibold">
                  <i class="fa-solid fa-map-pin mr-2"></i>{{ r }}
                </li>
              </ol>
            </div>
          </div>

          <div
            class="flex justify-start items-center px-4 py-2 shadow bg-white space-x-4 text-xs border-b border-gray-300 cursor-pointer"
            @click="otherInfoHandle"
          >
            <i class="fa-solid fa-angle-down"></i>
            <p>Other Information</p>
          </div>
          <div
            class="bg-gray-200/50 px-3 py-5 space-y-2"
            v-if="other_info_part"
          >
            <div class="px-4 space-y-2">
              <p class="text-gray-400 text-xs">Special Requests</p>
              <textarea
                class="w-full bg-transparent border font-semibold border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
                cols="4"
                :class="secForm.special_request != '' ? 'bg-white' : ''"
                v-model="secForm.special_request"
              ></textarea>
            </div>
            <!-- <div class="px-6 space-y-2">
              <p class="text-gray-400 text-xs">Other Information</p>
              <textarea
                class="w-full bg-transparent border font-semibold border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
                cols="4"
                :class="secForm.other_info != '' ? 'bg-white' : ''"
                v-model="secForm.other_info"
              ></textarea>
            </div> -->
            <div class="space-y-2 px-4">
              <p class="text-gray-400 text-xs">Pickup Location Information</p>
              <div class="mapouter">
                <div class="gmap_canvas">
                  <iframe
                    class="w-full h-[400px]"
                    :src="
                      'https://maps.google.com/maps?q=' +
                      secForm.pickup_location +
                      '&hl=es;z=14&amp;output=embed'
                    "
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          <div
            class="flex justify-start items-center px-4 py-2 shadow bg-white space-x-4 text-xs border-b border-gray-300 cursor-pointer"
            @click="carInfoSecHandle"
          >
            <i class="fa-solid fa-angle-down"></i>
            <p>Car Information</p>
          </div>
          <div class="bg-gray-200/50 px-3 py-5 space-y-2" v-if="car_info_sec">
            <div class="px-6 space-y-2">
              <p class="text-gray-400 text-xs">Supplier Name</p>
              <input
                v-model="secForm.supplier_name"
                type="text"
                id="title"
                class="h-8 w-full font-semibold bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
              />
            </div>
            <div class="px-6 space-y-2">
              <p class="text-gray-400 text-xs">Driver Name</p>
              <input
                v-model="secForm.driver_name"
                type="text"
                id="title"
                class="h-8 w-full font-semibold bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
              />
            </div>
            <div class="px-6 space-y-2">
              <p class="text-gray-400 text-xs">Driver Contact</p>
              <input
                v-model="secForm.driver_contact"
                type="text"
                id="title"
                class="h-8 w-full font-semibold bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
              />
            </div>
            <div class="px-6 space-y-2">
              <p class="text-gray-400 text-xs">Car Number</p>
              <input
                v-model="secForm.car_number"
                type="text"
                id="title"
                class="h-8 w-full font-semibold bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
              />
            </div>
            <div class="px-6 space-y-2">
              <p class="text-gray-400 text-xs">Car Photos</p>
              <!-- <p
                class="font-semibold py-4 px-4 flex justify-center items-center text-xs border border-gray-400 border-dashed"
              >
                <i class="fa-solid fa-plus text-2xl text-gray-400"></i>
              </p> -->
              <div class="space-y-1 mb-2">
                <label for="image" class="text-gray-800 text-sm relative">
                  <span
                    v-if="previewImage"
                    @click.prevent="removeSelectedImage"
                    class="text-red-400 text-xs cursor-pointer font-semibold underline absolute top-0 left-0"
                    ><i class="fa-solid fa-circle-minus text-3xl"></i></span
                ></label>
                <input
                  type="file"
                  id="image"
                  ref="fileInput"
                  class="hidden"
                  @change="handleFileChange"
                  accept="image/*"
                />
                <div v-if="previewImage" class="w-full h-auto">
                  <img
                    :src="previewImage"
                    alt="Image preview"
                    class="rounded w-full h-auto"
                  />
                </div>
                <div
                  v-else
                  @click.prevent="openFilePicker"
                  class="font-semibold py-4 px-4 flex justify-center items-center text-xs border border-gray-400 border-dashed"
                >
                  <span class="text-xs"
                    ><i class="fa-solid fa-plus text-2xl text-gray-400"></i
                  ></span>
                </div>
              </div>
            </div>
          </div>

          <div
            class="flex justify-start items-center px-4 py-2 shadow bg-white space-x-4 text-xs border-b border-gray-300 cursor-pointer"
            @click="reserPlanHandle"
          >
            <i class="fa-solid fa-angle-down"></i>
            <p>Reservation Information</p>
          </div>
          <div class="bg-gray-200/50 py-5 space-y-3" v-if="reser_plan_part">
            <div class="pl-10 space-y-2">
              <p class="text-gray-400 text-xs">Payment Currency</p>
              <p class="font-semibold text-xs py-1.5">THB</p>
            </div>
            <div class="pl-10 pr-10 space-y-2">
              <p class="text-gray-400 text-xs">Payment Method:</p>
              <!-- <p class="font-semibold text-xs">Collect</p> -->
              <p class="font-semibold text-xs py-1.5">
                {{ formData.payment_method }}
              </p>
              <!-- <v-select
                v-model="formData.payment_method"
                class="style-chooser font-semibold text-xs py-1.5"
                :options="payment"
                label="name"
                :clearable="false"
                :reduce="(d) => d.name"
                placeholder=""
              ></v-select> -->
            </div>
            <div class="pl-10 pr-10 space-y-2">
              <p class="text-gray-400 text-xs">Payment Status</p>
              <p class="font-semibold text-xs py-1.5">
                {{ formData.payment_status }}
              </p>
              <!-- <v-select
                v-model="formData.payment_status"
                class="style-chooser font-semibold text-xs py-1.5"
                :options="payment_status"
                label="name"
                :clearable="false"
                :reduce="(d) => d.name"
                placeholder=""
              ></v-select> -->
            </div>
            <div class="pl-10 pr-10 space-y-2">
              <p class="text-gray-400 text-xs">Reservation Status</p>
              <p class="font-semibold text-xs py-1.5">
                {{ formData.reservation_status }}
              </p>
              <!-- <v-select
                v-model="formData.reservation_status"
                class="style-chooser font-semibold text-xs py-1.5"
                :options="reservation_status"
                label="name"
                :clearable="false"
                :reduce="(d) => d.name"
                placeholder=""
              ></v-select> -->
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

.mapouter {
  position: relative;
  text-align: right;
  width: 100%;
  height: 400px;
}
.gmap_canvas {
  overflow: hidden;
  background: none !important;
  width: 100%;
  height: 400px;
}
.gmap_iframe {
  width: 100% !important;
  height: 400px !important;
}
</style>
