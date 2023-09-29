<script setup>
import Layout from "./Layout.vue";
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { PlusIcon, ListBulletIcon } from "@heroicons/vue/24/outline";
import { computed, onMounted, onUnmounted, ref } from "vue";
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
import { useAirLineStore } from "../stores/airline";

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
const airlineStore = useAirLineStore();

const { customer, loading } = storeToRefs(customerStore);
const { vantours } = storeToRefs(vantourStore);
const { grouptours } = storeToRefs(grouptourStore);
const { airports } = storeToRefs(airportStore);
const { entrances } = storeToRefs(entranceStore);
const { inclusives } = storeToRefs(inclusiveStore);
const { airlines } = storeToRefs(airlineStore);

const soldFrom = [
  { id: "1", name: "Facebook" },
  { id: "2", name: "Twitter" },
  { id: "3", name: "Instagram" },
  { id: "4", name: "Telegram" },
];
const payment = [
  { id: "1", name: "K + " },
  { id: "2", name: "SCB " },
  { id: "3", name: "Bangkok Bank" },
  { id: "4", name: "Other Bank " },
];
const paymentArray = [
  // Bank Transfer, International Remittance, Cash, etc
  { id: "1", name: "Bank Transfer" },
  { id: "2", name: "International Remittance" },
  { id: "3", name: "Cash" },
  { id: "4", name: "Other ..." },
];
const payment_status = [
  { id: "1", name: "fully_paid" },
  { id: "2", name: "not_paid" },
  { id: "3", name: "partially_paid" },
];
const reservation_status = [
  { id: "1", name: "confirmed" },
  { id: "2", name: "awaiting" },
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
  pickup_time: "",
  confirmation_letter: "",
  cost_price: "",
  duration: "",
  exchange_rate: "",
  payment_method: "",
  bank_name: "",
  bank_account_number: "",
  cost: "",
  paid_slip: "",
  payment_status: "",
  product_id: "",
  product_type: "",
  quantity: "",
  car_id: "",
  car_name: "",
  variation_name: "",
  hotel_name: "",
  reservation_status: "",
  selling_price: "",
  service_date: "",
  product_name: "",
  cus_name: "",
  cus_contact: "",
  cus_passport: "",
  cus_email: "",
  receipt_images: [],
  receipt_image: "",
  customer_attachment: "",
});

const expense_amount_upload = ref(null);
const expense_amount = ref(0);

const secForm = ref({
  customer_feedback: "",
  customer_score: "",
  driver_score: "",
  product_score: "",
  special_request: "",
  other_info: "",
  pickup_location: "",
  dropoff_location: "",
  route_plan: "",
  supplier_name: "",
  account_holder_name: "",
  driver_name: "",
  driver_contact: "",
  car_number: "",
  car_photo: "",
  ref_number: "",
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

const expPreviewImage = ref(null);

const exphandleFileChange = (e) => {
  let selectedFile = e.target.files[0];
  if (selectedFile) {
    formData.value.paid_slip = e.target.files[0];
    expPreviewImage.value = URL.createObjectURL(selectedFile);
  }
};

const expremoveSelectedImage = () => {
  formData.value.paid_slip = null;
  expPreviewImage.value = null;
};

const uploadRecePreview = ref("");

const recehandleFileChange = (e) => {
  let selectedFile = e.target.files[0];
  console.log(selectedFile);
  if (selectedFile) {
    formData.value.receipt_image = e.target.files[0];
    uploadRecePreview.value = URL.createObjectURL(selectedFile);
  }
};

const receremoveSelectedImage = () => {
  formData.value.receipt_image = "";
  uploadRecePreview.value = null;
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
  if (formData.value.duration) {
    frmData.append("duration", formData.value.duration);
  }
  frmData.append("payment_method", formData.value.payment_method);
  // frmData.append("bank_name", formData.value.bank_name);
  // frmData.append("bank_account_number", formData.value.bank_account_number);
  // frmData.append("cost", formData.value.cost);

  frmData.append("payment_status", formData.value.payment_status);

  frmData.append("product_type", formData.value.product_type);
  frmData.append("quantity", formData.value.quantity);
  // frmData.append("receipt_image", formData.value.receipt_image);
  frmData.append("reservation_status", formData.value.reservation_status);
  frmData.append("selling_price", formData.value.selling_price);
  frmData.append("service_date", formData.value.service_date);
  frmData.append("car_id", formData.value.car_id);
  // frmData.append("paid_slip", formData.value.paid_slip);

  try {
    const response = await reservationStore.updateAction(
      frmData,
      route.params.id
    );
    if (response.status) {
      const secfrm = new FormData();
      secfrm.append("_method", "PUT");
      if (secForm.value.customer_feedback) {
        secfrm.append("customer_feedback", secForm.value.customer_feedback);
      }
      if (formData.value.bank_name) {
        secfrm.append("bank_name", formData.value.bank_name);
      }
      if (formData.value.bank_account_number) {
        secfrm.append(
          "bank_account_number",
          formData.value.bank_account_number
        );
      }

      secfrm.append("expense_amount", expense_amount.value);

      if (formData.value.receipt_image) {
        secfrm.append("receipt_image", formData.value.receipt_image);
      }
      if (formData.value.paid_slip) {
        secfrm.append("paid_slip", formData.value.paid_slip);
      }
      if (formData.value.cost) {
        secfrm.append("cost", formData.value.cost);
      }
      if (secForm.value.customer_score) {
        secfrm.append("customer_score", secForm.value.customer_score);
      }
      if (secForm.value.driver_score) {
        secfrm.append("driver_score", secForm.value.driver_score);
      }
      if (secForm.value.product_score) {
        secfrm.append("product_score", secForm.value.product_score);
      }
      if (secForm.value.ref_number) {
        secfrm.append("ref_number", secForm.value.ref_number);
      }

      secfrm.append("special_request", secForm.value.special_request);

      if (secForm.value.other_info) {
        secfrm.append("other_info", secForm.value.other_info);
      }
      if (secForm.value.pickup_location) {
        secfrm.append("pickup_location", secForm.value.pickup_location);
      }
      if (secForm.value.dropoff_location) {
        secfrm.append("dropoff_location", secForm.value.dropoff_location);
      }
      if (secForm.value.route_plan) {
        secfrm.append("route_plan", secForm.value.route_plan);
      }
      if (secForm.value.supplier_name) {
        secfrm.append("supplier_name", secForm.value.supplier_name);
      }
      if (secForm.value.account_holder_name) {
        secfrm.append("account_holder_name", secForm.value.account_holder_name);
      }
      if (secForm.value.driver_name) {
        secfrm.append("driver_name", secForm.value.driver_name);
      }
      if (secForm.value.driver_contact) {
        secfrm.append("driver_contact", secForm.value.driver_contact);
      }
      if (secForm.value.car_number) {
        secfrm.append("car_number", secForm.value.car_number);
      }
      if (secForm.value.car_photo) {
        if (
          formData.value.product_type == "App\\Models\\EntranceTicket" ||
          formData.value.product_type == "App\\Models\\Hotel"
        ) {
          secfrm.append("booking_confirm_letter", secForm.value.car_photo);
        } else {
          secfrm.append("car_photo", secForm.value.car_photo);
        }
      }
      await reservationStore.updateInfoAction(secfrm, route.params.id);
    }
    formData.value = {
      comment: "",
      confirmation_letter: "",
      cost_price: "",
      duration: "",
      exchange_rate: "",
      payment_method: "",
      bank_name: "",
      bank_account_number: "",
      paid_slip: "",
      cost: "",
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
    };
    secForm.value = {
      customer_feedback: "",
      customer_score: "",
      driver_score: "",
      product_score: "",
      special_request: "",
      other_info: "",
      pickup_location: "",
      dropoff_location: "",
      supplier_name: "",
      account_holder_name: "",
      driver_name: "",
      driver_contact: "",
      car_number: "",
      route_plan: "",
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
const dropoff_location = ref("");
const booking_status = ref("");
const booking_confirm_letters = ref("");
const booking_receipt = ref("");
const checkin_date = ref("");
const checkout_date = ref("");
const roomName = ref("");

const getDetail = async () => {
  try {
    const response = await reservationStore.getDetailAction(route.params.id);
    console.log(response, "this is response");
    titleDataChanges(response.result.product_type);
    checkin_date.value = response.result.checkin_date
      ? response.result.checkin_date
      : "";
    checkout_date.value = response.result.checkout_date
      ? response.result.checkout_date
      : "";
    if (response.result.customer_attachment != null) {
      formData.customer_attachment = response.result.customer_attachment;
    }
    if (response.result.receipt_images) {
      booking_receipt.value = response.result.receipt_images;
    }
    if (response.result.pickup_time) {
      formData.value.pickup_time = response.result.pickup_time;
    } else {
      formData.value.pickup_time = "-";
    }
    roomName.value = response.result.room?.name
      ? response.result.room.name
      : "";
    console.log(roomName.value, "this is room name");
    if (response.result.booking_confirm_letters) {
      booking_confirm_letters.value = response.result.booking_confirm_letters;
    }
    booking_status.value = response.result.booking;
    formData.value = response.result;
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
    // console.log(secForm.value.special_request, "this is special");
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
    if (response.result.route_plan) {
      secForm.value.route_plan = response.result.route_plan;
    } else if (response.result.product_type === "App\\Models\\PrivateVanTour") {
      secForm.value.route_plan = response.result.product.description;
    }
    secForm.value.pickup_location = response.result.pickup_location;
    secForm.value.dropoff_location = response.result.dropoff_location;
    console.log(secForm.value.pickup_location, "this is pickup");
    if (response.result.reservation_info != null) {
      expense_amount.value = response.result.reservation_info.expense_amount;
      expense_amount_upload.value =
        response.result.reservation_info.expense_amount;
      secForm.value.customer_feedback =
        response.result.reservation_info.customer_feedback;

      secForm.value.customer_score =
        response.result.reservation_info.customer_score;
      formData.value.bank_name = response.result.reservation_info.bank_name;
      formData.value.bank_account_number =
        response.result.reservation_info.bank_account_number;
      formData.value.cost = response.result.reservation_info.cost;
      secForm.value.driver_score =
        response.result.reservation_info.driver_score;
      secForm.value.product_score =
        response.result.reservation_info.product_score;
      secForm.value.route_plan = response.result.reservation_info.route_plan;
      secForm.value.other_info = response.result.reservation_info.other_info;
      secForm.value.pickup_location =
        response.result.reservation_info.pickup_location;
    } else {
      secForm.value.customer_feedback = "";
      secForm.value.customer_score = "";
      secForm.value.driver_score = "";
      secForm.value.product_score = "";
      secForm.value.other_info = "";
    }

    if (response.result.reservation_car_info != null) {
      secForm.value.supplier_name =
        response.result.reservation_car_info.supplier_name;
      secForm.value.account_holder_name =
        response.result.reservation_car_info.account_holder_name;
      secForm.value.driver_name =
        response.result.reservation_car_info.driver_name;
      secForm.value.driver_contact =
        response.result.reservation_car_info.driver_contact;

      secForm.value.car_number =
        response.result.reservation_car_info.car_number;
      previewImage.value = response.result.reservation_car_info.car_photo;
    } else {
      secForm.value.supplier_name = "";
      (secForm.value.account_holder_name = ""),
        (secForm.value.driver_name = "");
      secForm.value.driver_contact = "";
      secForm.value.car_number = "";
      previewImage.value = "";
    }

    if (response.result.payment_method == null) {
      formData.value.payment_method = response.result.product.payment_method;
    } else {
      formData.value.payment_method = response.result.payment_method;
    }
    if (response.result.reservation_info?.paid_slip != null) {
      expPreviewImage.value =
        "https://api-blog.thanywhere.com/storage/images/" +
        response.result.reservation_info.paid_slip;
    }
    if (response.result.bank_name == null) {
      formData.value.bank_name = response.result.product.bank_name;
    } else {
      formData.value.bank_name = response.result.bank_name;
    }
    if (response.result.bank_account_number == null) {
      formData.value.bank_account_number =
        response.result.product.bank_account_number;
    } else {
      formData.value.bank_account_number = response.result.bank_account_number;
    }
    if (response.result.cost == null) {
      formData.value.cost =
        formData.value.quantity * formData.value.selling_price;
    } else {
      formData.value.cost = response.result.cost;
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
    console.log(formData.value.car_name, "this is car name");
    if (response.result.variation == null) {
      formData.value.variation_name = "";
    } else if (response.result.variation != null) {
      formData.value.variation_name = response.result.variation.name;
    }
    if (response.result.room == null) {
      formData.value.hotel_name = "";
    } else if (response.result.room != null) {
      formData.value.hotel_name = response.result.room.name;
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
    formData.value.selling_price = response.result.selling_price;
    formData.value.service_date = response.result.service_date;
    secForm.value.ref_number =
      response.result.reservation_supplier_info?.ref_number;
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

const payment_part = ref(false);
const paymentHandle = () => {
  payment_part.value = !payment_part.value;
};

const customer_info_part = ref(false);
const customerHandle = () => {
  customer_info_part.value = !customer_info_part.value;
};

const feedback_part = ref(false);
const feedbackHandle = () => {
  feedback_part.value = !feedback_part.value;
};

const receipt_part = ref(false);
const receiptHandle = () => {
  receipt_part.value = !receipt_part.value;
};

const carInfo_part = ref(false);
const carInfoPartHandle = () => {
  carInfo_part.value = !carInfo_part.value;
};

const route_plan_part = ref(false);
const routePlanHandle = () => {
  route_plan_part.value = !route_plan_part.value;
};

const other_info_part = ref(false);
const otherInfoHandle = () => {
  other_info_part.value = !other_info_part.value;
};

const booking_summmary_part = ref(true);
const bookingSummaryHandle = () => {
  booking_summmary_part.value = !booking_summmary_part.value;
};

const reservation_info_part = ref(false);
const reservationInfoHandle = () => {
  reservation_info_part.value = !reservation_info_part.value;
};
const expen_info_part = ref(false);
const expenInfoHandle = () => {
  expen_info_part.value = !expen_info_part.value;
};

const car_info_sec = ref(false);
const carInfoSecHandle = () => {
  car_info_sec.value = !car_info_sec.value;
};

const action = ref("");
const crm = ref("");

const routeArray = ref([]);
const updateArray = () => {
  routeArray.value = secForm.value.route_plan.value
    .split(",")
    .map((item) => item.trim());
  console.log(routeArray.value, "this is array");
};

const changeName = () => {
  if (formData.value.product_type == "App\\Models\\EntranceTicket") {
    secForm.value.supplier_name = formData.value.product_name;
  }
};

const allowUpdate = computed(() => {
  if (expense_amount.value == 0) {
    console.log(expense_amount.value, formData.value.receipt_image, "one");
    return true;
  } else if (expense_amount.value == expense_amount_upload.value) {
    console.log(expense_amount.value, formData.value.receipt_image, "three");
    return true;
  } else if (
    expense_amount.value != 0 &&
    (formData.value.receipt_image == undefined ||
      formData.value.receipt_image == "")
  ) {
    console.log(expense_amount.value, formData.value.receipt_image, "two");
    return false;
  } else if (
    expense_amount.value != expense_amount_upload.value &&
    (formData.value.receipt_image != undefined ||
      formData.value.receipt_image != "")
  ) {
    console.log(expense_amount.value, formData.value.receipt_image, "four");
    return true;
  }
});

const titleData = ref("");
const titleDataChanges = (data) => {
  if (data == "App\\Models\\EntranceTicket") {
    titleData.value = "Attractions";
  } else if (data == "App\\Models\\AirportPickup") {
    titleData.value = "Airport Pickup";
  } else if (data == "App\\Models\\Hotel") {
    titleData.value = "Hotel & Room";
  } else if (data == "App\\Models\\PrivateVanTour") {
    titleData.value = "Private Van Tour";
  } else if (data == "App\\Models\\GroupTour") {
    titleData.value = "Group Tour";
  } else if (data == "App\\Models\\Inclusive") {
    titleData.value = "Inclusive";
  } else if (data == "App\\Models\\Airline") {
    titleData.value = "Airline Ticket";
  }
};

onMounted(async () => {
  await getDetail();
  changeName();
  await vantourStore.getSimpleListAction();
  await grouptourStore.getSimpleListAction();
  await airportStore.getSimpleListAction();
  await entranceStore.getSimpleListAction();
  await customerStore.getSimpleListAction();
  await inclusiveStore.getSimpleListAction();
  await airlineStore.getSimpleListAction();
  console.log(booking_confirm_letters.value, "this is something");
  action.value = route.params.action;
  crm.value = route.params.crm;
});
</script>

<template>
  <Layout>
    <div>
      <div class="flex justify-between items-center pb-6">
        <p class="text-[#ff613c] font-semibold text-sm">
          Reservation : {{ titleData }} / {{ formData.product_name }} /
          {{ formData.variation_name }}
          {{ formData.car_name }}
          {{ roomName }}
        </p>
        <p
          class="px-4 py-2 border border-[#ff613c] text-[#ff613c] text-xs"
          v-if="formData.reservation_status == 'reserved'"
        >
          Complete Booking
        </p>
        <p
          class="px-4 py-2 border border-[#ff613c] text-[#ff613c] text-xs"
          v-if="formData.reservation_status != 'reserved'"
        >
          Pending Booking
        </p>
      </div>
      <div class="grid grid-cols-3 gap-8">
        <div class="col-span-2">
          <div
            class="flex justify-start items-center text-xs bg-[#ff613c] text-white font-semibold px-4 py-2"
          >
            <p>Reservation Code :</p>
            <p class="ml-2 text-white">{{ crm }}</p>
          </div>

          <div
            class="flex justify-start items-center px-4 py-2 shadow bg-white space-x-4 text-xs border-b border-gray-300 cursor-pointer"
            @click="bookingSummaryHandle"
          >
            <i class="fa-solid fa-angle-down"></i>
            <p>Booking Summary</p>
          </div>
          <div
            class="grid grid-cols-2 gap-4 bg-gray-200/50 py-4"
            v-if="booking_summmary_part"
          >
            <div class="pl-10 space-y-2">
              <p class="text-gray-400 text-xs">Customer Name</p>
              <p class="font-semibold text-xs py-1.5">
                {{ formData.cus_name }}
              </p>
            </div>
            <div class="pl-10 space-y-2">
              <p class="text-gray-400 text-xs">Customer Contact</p>
              <p class="font-semibold text-xs py-1.5">
                {{ formData.cus_contact }}
              </p>
            </div>
            <div class="pl-10 pr-10 space-y-2">
              <p class="text-gray-400 text-xs">Product Name</p>
              <p class="font-semibold text-xs py-1.5">
                {{ formData.product_name }}
              </p>
            </div>
            <div class="pl-10 pr-10 space-y-2">
              <p class="text-gray-400 text-xs">Product Variation</p>
              <p class="font-semibold text-xs py-1.5">
                {{ formData.variation_name }}
                {{ formData.car_name }}
                {{ roomName }}
              </p>
            </div>

            <div class="pl-10 pr-10 space-y-2">
              <p class="text-gray-400 text-xs">Quantity</p>
              <p class="font-semibold text-xs py-1.5">
                {{ formData.quantity }}
              </p>
            </div>
            <div class="pl-10 pr-10 space-y-2">
              <p
                class="text-gray-400 text-xs"
                v-if="formData.product_type != 'App\\Models\\Hotel'"
              >
                Service Date:
              </p>
              <p
                class="text-gray-400 text-xs"
                v-if="formData.product_type == 'App\\Models\\Hotel'"
              >
                Check in - Check out
              </p>

              <input
                v-if="formData.product_type != 'App\\Models\\Hotel'"
                v-model="formData.service_date"
                type="date"
                id="title"
                disabled
                class="h-8 font-semibold w-full py-0 text-gray-900 focus:outline-none focus:border-0 text-xs"
              />
              <div
                class="flex justify-start items-center space-x-2"
                v-if="formData.product_type == 'App\\Models\\Hotel'"
              >
                <p class="font-semibold text-xs py-1.5">
                  {{ checkin_date }}
                </p>
                <p>-</p>
                <p class="font-semibold text-xs py-1.5">
                  {{ checkout_date }}
                </p>
              </div>
            </div>
            <div class="pl-10 pr-10 space-y-2">
              <p class="text-gray-400 text-xs">Payment Method:</p>
              <p class="font-semibold text-xs py-1.5">
                {{ booking_status.payment_method }}
              </p>
            </div>
            <div class="pl-10 pr-10 space-y-2">
              <p class="text-gray-400 text-xs">Payment Status</p>
              <p class="font-semibold text-xs py-1.5">
                {{ booking_status.payment_status }}
              </p>
            </div>
            <div
              class="pl-10 space-y-2"
              v-if="
                formData.product_type != 'App\\Models\\EntranceTicket' &&
                formData.product_type != 'App\\Models\\Hotel' &&
                formData.product_type != 'App\\Models\\Airline'
              "
            >
              <p class="text-gray-400 text-xs">Pickup Time</p>
              <p class="font-semibold text-xs">{{ formData.pickup_time }}</p>
            </div>
            <div class="pl-10 space-y-2">
              <p class="text-gray-400 text-xs">Price</p>
              <p class="font-semibold text-xs py-1.5">
                {{ formData.selling_price * formData.quantity }}
              </p>
            </div>
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
              <p class="text-gray-400 text-xs">Total Amount</p>
              <p class="font-semibold text-xs py-1.5">
                {{ formData.selling_price * formData.quantity }}
              </p>
            </div>
            <div class="pl-10 space-y-2">
              <p class="text-gray-400 text-xs">Payment Currency</p>
              <p class="font-semibold text-xs py-1.5">
                {{ booking_status.payment_currency }}
              </p>
            </div>
            <div class="pl-10 pr-10 space-y-2">
              <p class="text-gray-400 text-xs">Payment Method:</p>
              <p class="font-semibold text-xs py-1.5">
                {{ booking_status.payment_method }}
              </p>
            </div>
            <div class="pl-10 pr-10 space-y-2">
              <p class="text-gray-400 text-xs">Payment Status</p>
              <p class="font-semibold text-xs py-1.5">
                {{ booking_status.payment_status }}
              </p>
            </div>

            <div class="pl-10 pr-10 space-y-2">
              <p class="text-gray-400 text-xs">Payment Due:</p>
              <!-- <p class="font-semibold text-xs">09/08/2023</p> -->
              <input
                v-model="formData.service_date"
                type="date"
                disabled
                id="title"
                class="h-8 font-semibold w-full py-0 text-gray-900 focus:outline-none focus:border-0 text-xs"
              />
            </div>
            <div class="pl-10 pr-10 space-y-2">
              <p class="text-gray-400 text-xs">Service Date:</p>
              <!-- <p class="font-semibold text-xs">09/08/2023</p> -->
              <input
                v-model="formData.service_date"
                type="date"
                id="title"
                disabled
                class="h-8 font-semibold w-full py-0 text-gray-900 focus:outline-none focus:border-0 text-xs"
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
          <div
            class="grid grid-cols-3 gap-4 px-6 py-5 bg-gray-200/50"
            v-if="receipt_part"
          >
            <div v-for="(image, index) in formData.receipt_images" :key="index">
              <p class="text-xs mb-2 mt-2">Receipt Image {{ index + 1 }}</p>
              <a :href="image.image" target="_blink">
                <img :src="image.image" alt="" />
              </a>
            </div>
          </div>
          <div
            class="grid grid-cols-3 gap-4 px-6 py-5 bg-gray-200/50"
            v-if="receipt_part && booking_confirm_letters.length != 0"
          >
            <div v-for="(image, index) in booking_confirm_letters" :key="index">
              <p class="text-xs mb-2 mt-2">
                Booking Confirm Letter {{ index + 1 }}
              </p>
              <a :href="image.file" target="_blink">
                <img :src="image.file" alt="" />
              </a>
            </div>
          </div>
          <div
            class="grid grid-cols-3 gap-4 px-6 py-5 bg-gray-200/50"
            v-if="receipt_part && booking_receipt.length != 0"
          >
            <div v-for="(image, index) in booking_receipt" :key="index">
              <p class="text-xs mb-2 mt-2">
                Upload Payment Receipt {{ index + 1 }}
              </p>
              <a :href="image.file" target="_blink">
                <img :src="image.file" alt="" />
              </a>
            </div>
          </div>
          <div
            class="px-6 py-5 bg-gray-200/50 flex justify-start items-center space-x-4"
            v-if="receipt_part && formData.customer_attachment"
          >
            <p class="text-xs mb-2 mt-2">Customer Attachment File --</p>
            <p class="text-sm font-semibold text-blue-500">
              <a :href="formData.customer_attachment" target="_blink">Link</a>
            </p>
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
            <p
              v-if="formData.product_type == 'App\\Models\\EntranceTicket'"
              class=""
            >
              Ticket Information
            </p>
            <p v-if="formData.product_type == 'App\\Models\\Hotel'" class="">
              Hotel Information
            </p>
            <p v-if="formData.product_type == 'App\\Models\\Airline'" class="">
              Airline Information
            </p>
            <p
              v-if="
                formData.product_type != 'App\\Models\\EntranceTicket' &&
                formData.product_type != 'App\\Models\\Hotel' &&
                formData.product_type != 'App\\Models\\Airline'
              "
              class=""
            >
              Car Information
            </p>
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
              <!-- <p
                v-if="formData.product_type == 'App\\Models\\Hotel'"
                class="text-gray-400 text-xs"
              >
                Hotel Type
              </p> -->
              <p
                v-if="formData.product_type == 'App\\Models\\Airline'"
                class="text-gray-400 text-xs"
              >
                Ticket Type
              </p>
              <p
                v-if="
                  formData.product_type != 'App\\Models\\EntranceTicket' &&
                  formData.product_type != 'App\\Models\\Hotel' &&
                  formData.product_type != 'App\\Models\\Airline'
                "
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
                v-if="formData.product_type == 'App\\Models\\Hotel'"
              >
                <!-- {{ formData.hotel_name }} -->
              </p>
              <p
                class="font-semibold text-xs"
                v-if="
                  formData.product_type != 'App\\Models\\EntranceTicket' &&
                  formData.product_type != 'App\\Models\\Hotel'
                "
              >
                {{ formData.car_name }}
              </p>
            </div>
            <div class="pl-10 space-y-2">
              <p class="text-gray-400 text-xs">Product</p>
              <p class="font-semibold text-xs">{{ formData.product_name }}</p>
            </div>
            <div
              class="pl-10 space-y-2"
              v-if="
                formData.product_type != 'App\\Models\\EntranceTicket' &&
                formData.product_type != 'App\\Models\\Hotel' &&
                formData.product_type != 'App\\Models\\Airline'
              "
            >
              <p class="text-gray-400 text-xs">Pickup Time</p>
              <p class="font-semibold text-xs">{{ formData.pickup_time }}</p>
            </div>
            <div
              class="pl-10 pr-10 space-y-2"
              v-if="
                formData.product_type != 'App\\Models\\EntranceTicket' &&
                formData.product_type != 'App\\Models\\Hotel' &&
                formData.product_type != 'App\\Models\\Airline'
              "
            >
              <p class="text-gray-400 text-xs">Durations</p>
              <input
                v-model="formData.duration"
                type="text"
                id="title"
                class="h-8 w-full bg-white font-semibold border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
              />
            </div>
            <div
              class="pl-10 pr-10 space-y-2"
              v-if="formData.product_type == 'App\\Models\\Hotel'"
            >
              <p class="text-gray-400 text-xs">Checkin Date</p>
              <input
                v-model="checkin_date"
                type="date"
                disabled
                id="title"
                class="h-8 font-semibold w-full bg-transparent text-xs"
              />
            </div>
            <div
              class="pl-10 pr-10 space-y-2"
              v-if="formData.product_type == 'App\\Models\\Hotel'"
            >
              <p class="text-gray-400 text-xs">Checkout Date</p>
              <input
                v-model="checkout_date"
                type="date"
                disabled
                id="title"
                class="h-8 font-semibold w-full bg-transparent text-xs"
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
                class="w-full bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 font-semibold text-xs"
                cols="4"
                v-model="secForm.customer_feedback"
              ></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="pl-10 pr-10 space-y-2">
                <p class="text-gray-400 text-xs font">Customer Score</p>
                <input
                  v-model="secForm.customer_score"
                  type="number"
                  id="title"
                  class="h-8 w-full bg-white font-semibold border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
                />
              </div>
              <div class="pl-10 pr-10 space-y-2">
                <p class="text-gray-400 text-xs font">Driver Score</p>
                <input
                  v-model="secForm.driver_score"
                  type="number"
                  id="title"
                  class="h-8 w-full bg-white font-semibold border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
                />
              </div>
              <div class="pl-10 pr-10 pb-8 space-y-2">
                <p class="text-gray-400 text-xs font">Product Score</p>
                <input
                  v-model="secForm.product_score"
                  type="number"
                  id="title"
                  class="h-8 w-full bg-white font-semibold border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        <div class=" ">
          <div
            class="flex justify-start items-center text-xs bg-[#ff613c] text-white font-semibold px-4 py-2"
          >
            <p>Add Reservation Detail</p>
          </div>
          <div
            class="flex justify-start items-center px-4 py-2 shadow bg-white space-x-4 text-xs border-b border-gray-300 cursor-pointer"
            v-if="
              formData.product_type != 'App\\Models\\EntranceTicket' &&
              formData.product_type != 'App\\Models\\Hotel' &&
              formData.product_type != 'App\\Models\\Airline'
            "
            @click="routePlanHandle"
          >
            <i class="fa-solid fa-angle-down"></i>
            <p>Route Plan</p>
          </div>
          <div
            class="bg-gray-200/50 p-6"
            v-if="
              route_plan_part &&
              formData.product_type != 'App\\Models\\EntranceTicket' &&
              formData.product_type != 'App\\Models\\Hotel' &&
              formData.product_type != 'App\\Models\\Airline'
            "
          >
            <div class="pl-4 space-y-2 border border-gray-200 p-4 bg-white">
              <textarea
                class="w-full bg-transparent font-semibold shadow-sm px-4 py-2 text-gray-900 focus:outline-none text-xs border border-gray-300"
                placeholder="enter like one, two, three"
                cols="4"
                v-model="secForm.route_plan"
              ></textarea>
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
            <div class="px-6 space-y-2">
              <p class="text-gray-400 text-xs">Special Requests</p>
              <textarea
                class="w-full bg-white border font-semibold border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
                cols="4"
                v-model="secForm.special_request"
              ></textarea>
            </div>

            <div
              class="px-6 space-y-2"
              v-if="
                formData.product_type != 'App\\Models\\EntranceTicket' &&
                formData.product_type != 'App\\Models\\Hotel' &&
                formData.product_type != 'App\\Models\\Airline'
              "
            >
              <p class="text-gray-400 text-xs">Pickup Location</p>
              <textarea
                class="w-full bg-white border font-semibold border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
                cols="4"
                v-model="secForm.pickup_location"
              ></textarea>
            </div>
            <div
              class="px-6 space-y-2"
              v-if="
                formData.product_type != 'App\\Models\\EntranceTicket' &&
                formData.product_type != 'App\\Models\\Hotel' &&
                formData.product_type != 'App\\Models\\Airline'
              "
            >
              <p class="text-gray-400 text-xs">Dropoff Location</p>
              <textarea
                class="w-full bg-white border font-semibold border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
                cols="4"
                v-model="secForm.dropoff_location"
              ></textarea>
            </div>
          </div>

          <div
            v-if="formData.product_type != 'App\\Models\\Airline'"
            class="flex justify-start items-center px-4 py-2 shadow bg-white space-x-4 text-xs border-b border-gray-300 cursor-pointer"
            @click="carInfoSecHandle"
          >
            <i class="fa-solid fa-angle-down"></i>
            <p
              v-if="
                formData.product_type == 'App\\Models\\EntranceTicket' ||
                formData.product_type == 'App\\Models\\Hotel'
              "
            >
              Supplier Information
            </p>
            <p v-if="formData.product_type == 'App\\Models\\AirportPickup'">
              Assign Driver
            </p>
            <p
              v-if="
                formData.product_type != 'App\\Models\\EntranceTicket' &&
                formData.product_type != 'App\\Models\\Hotel' &&
                formData.product_type != 'App\\Models\\AirportPickup'
              "
            >
              Car Information
            </p>
          </div>
          <div
            class="bg-gray-200/50 px-3 py-5 space-y-2"
            v-if="
              car_info_sec && formData.product_type != 'App\\Models\\Airline'
            "
          >
            <div
              class="px-6 space-y-2"
              v-if="
                formData.product_type != 'App\\Models\\EntranceTicket' &&
                formData.product_type != 'App\\Models\\Hotel' &&
                formData.product_type != 'App\\Models\\AirportPickup'
              "
            >
              <p class="text-gray-400 text-xs">Account Holder Name</p>
              <input
                v-model="secForm.account_holder_name"
                type="text"
                id="title"
                class="h-8 w-full font-semibold bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
              />
            </div>
            <div class="px-6 space-y-2">
              <p class="text-gray-400 text-xs">Supplier Name</p>
              <input
                v-model="secForm.supplier_name"
                type="text"
                id="title"
                class="h-8 w-full font-semibold bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
              />
            </div>
            <div
              class="px-6 space-y-2"
              v-if="
                formData.product_type != 'App\\Models\\EntranceTicket' &&
                formData.product_type != 'App\\Models\\Hotel'
              "
            >
              <p class="text-gray-400 text-xs">Driver Name</p>
              <input
                v-model="secForm.driver_name"
                type="text"
                id="title"
                class="h-8 w-full font-semibold bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
              />
            </div>
            <div
              class="px-6 space-y-2"
              v-if="
                formData.product_type != 'App\\Models\\EntranceTicket' &&
                formData.product_type != 'App\\Models\\Hotel'
              "
            >
              <p class="text-gray-400 text-xs">Driver Contact</p>
              <input
                v-model="secForm.driver_contact"
                type="text"
                id="title"
                class="h-8 w-full font-semibold bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
              />
            </div>
            <div
              class="px-6 space-y-2"
              v-if="
                formData.product_type == 'App\\Models\\EntranceTicket' ||
                formData.product_type == 'App\\Models\\Hotel'
              "
            >
              <p class="text-gray-400 text-xs">Reference Number</p>
              <input
                v-model="secForm.ref_number"
                type="text"
                id="title"
                class="h-8 w-full font-semibold bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
              />
            </div>
            <div
              class="px-6 space-y-2"
              v-if="
                formData.product_type != 'App\\Models\\EntranceTicket' &&
                formData.product_type != 'App\\Models\\Hotel'
              "
            >
              <p class="text-gray-400 text-xs">Car Number</p>

              <input
                v-model="secForm.car_number"
                type="text"
                id="title"
                class="h-8 w-full font-semibold bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
              />
            </div>
            <div class="px-6 space-y-2">
              <p
                class="text-gray-400 text-xs"
                v-if="
                  formData.product_type == 'App\\Models\\EntranceTicket' ||
                  formData.product_type == 'App\\Models\\Hotel'
                "
              >
                Booking Confirmation Letter
              </p>
              <p class="text-gray-400 text-xs" v-else>Car Photos</p>
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
            @click="reservationInfoHandle"
          >
            <i class="fa-solid fa-angle-down"></i>

            <p>Reservation Information</p>
          </div>
          <div
            class="bg-gray-200/50 py-5 space-y-2"
            v-if="reservation_info_part"
          >
            <div class="space-y-2">
              <div class="pl-10 pr-10 space-y-2">
                <p class="text-gray-400 text-xs">Payment Status</p>
                <v-select
                  v-model="formData.payment_status"
                  class="style-chooser font-semibold text-xs rounded-lg bg-white"
                  :options="payment_status"
                  label="name"
                  :clearable="false"
                  :reduce="(d) => d.name"
                  placeholder=""
                ></v-select>
              </div>
              <div class="pl-10 pr-10 space-y-2">
                <p class="text-gray-400 text-xs">Reservation Status</p>
                <v-select
                  v-model="formData.reservation_status"
                  class="style-chooser font-semibold text-xs rounded-lg bg-white"
                  :options="reservation_status"
                  label="name"
                  :clearable="false"
                  :reduce="(d) => d.name"
                  placeholder=""
                ></v-select>
              </div>

              <div class="pl-10 pr-10 space-y-2">
                <p
                  class="text-gray-400 text-xs"
                  v-if="formData.product_type == 'App\\Models\\Hotel'"
                >
                  Hotel Confirmation Receipt
                </p>
                <p class="text-gray-400 text-xs" v-else>Expensive Paid Slip</p>
                <div class="space-y-1 mb-2">
                  <label for="image" class="text-gray-800 text-sm relative">
                    <span
                      v-if="expPreviewImage"
                      @click.prevent="expremoveSelectedImage"
                      class="text-red-400 text-xs cursor-pointer font-semibold underline absolute top-0 left-0"
                      ><i class="fa-solid fa-circle-minus text-3xl"></i></span
                  ></label>
                  <input
                    type="file"
                    id="image"
                    class=""
                    v-if="!expPreviewImage"
                    @change="exphandleFileChange"
                    accept="image/*"
                  />
                  <div v-if="expPreviewImage" class="w-full h-auto">
                    <img
                      :src="expPreviewImage"
                      alt="Image preview"
                      class="rounded w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="flex justify-start items-center px-4 py-2 shadow bg-white space-x-4 text-xs border-b border-gray-300 cursor-pointer"
            @click="expenInfoHandle"
          >
            <i class="fa-solid fa-angle-down"></i>

            <p>Expense Information</p>
          </div>

          <div class="bg-gray-200/50 py-5 space-y-2" v-if="expen_info_part">
            <div class="pl-10 pr-10 space-y-2">
              <p class="text-gray-400 text-xs">Payment Method:</p>

              <v-select
                v-model="formData.payment_method"
                class="style-chooser font-semibold text-xs rounded-lg bg-white"
                :options="paymentArray"
                label="name"
                :clearable="false"
                :reduce="(d) => d.name"
                placeholder=""
              ></v-select>
            </div>
            <div class="pl-10 pr-10 space-y-2">
              <p class="text-gray-400 text-xs">Bank Name:</p>

              <v-select
                v-model="formData.bank_name"
                class="style-chooser font-semibold text-xs rounded-lg bg-white"
                :options="payment"
                label="name"
                :clearable="false"
                :reduce="(d) => d.name"
                placeholder=""
              ></v-select>
            </div>
            <div class="pl-10 pr-10 space-y-2">
              <p class="text-gray-400 text-xs">Bank Account Number</p>
              <input
                v-model="formData.bank_account_number"
                type="number"
                id="title"
                class="h-8 w-full font-semibold bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
              />
            </div>
            <div class="pl-10 pr-10 space-y-2">
              <p class="text-gray-400 text-xs">Cost</p>
              <input
                v-model="formData.cost"
                type="number"
                id="title"
                class="h-8 w-full font-semibold bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
              />
            </div>
            <div
              class="space-y-2"
              v-if="
                formData.product_type == 'App\\Models\\EntranceTicket' ||
                formData.product_type == 'App\\Models\\Hotel'
              "
            >
              <div class="pl-10 pr-10 space-y-2">
                <p class="text-gray-400 text-xs">Expense Amount</p>
                <input
                  v-model="expense_amount"
                  type="number"
                  class="h-8 w-full font-semibold bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
                />
              </div>

              <div
                class="pl-10 pr-10 space-y-2"
                v-if="
                  formData.product_type == 'App\\Models\\EntranceTicket' ||
                  formData.product_type == 'App\\Models\\Hotel'
                "
              >
                <p class="text-gray-400 text-xs">Upload Payment Receipt</p>
                <div class="space-y-1 mb-2">
                  <label for="image" class="text-gray-800 text-sm relative">
                    <span
                      v-if="uploadRecePreview"
                      @click.prevent="receremoveSelectedImage"
                      class="text-red-400 text-xs cursor-pointer font-semibold underline absolute top-0 left-0"
                      ><i class="fa-solid fa-circle-minus text-3xl"></i></span
                  ></label>
                  <input
                    type="file"
                    id="image"
                    class=""
                    v-if="!uploadRecePreview"
                    @change="recehandleFileChange"
                    accept="image/*"
                  />
                  <div v-if="uploadRecePreview" class="w-full h-auto">
                    <img
                      :src="uploadRecePreview"
                      alt="Image preview"
                      class="rounded w-full h-auto"
                    />
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
