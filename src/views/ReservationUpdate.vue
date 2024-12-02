<script setup>
import Layout from "./Layout.vue";
import { AtSymbolIcon, XCircleIcon } from "@heroicons/vue/24/outline";
import {
  PlusIcon,
  ListBulletIcon,
  PaperAirplaneIcon,
} from "@heroicons/vue/24/outline";
import { computed, onMounted, onUnmounted, ref } from "vue";
import Button from "../components/Button.vue";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { Switch } from "@headlessui/vue";

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
import { useAuthStore } from "../stores/auth";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import Swal from "sweetalert2";

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
const authStore = useAuthStore();

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
  slip_code: "",
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
  paid_slip: [],
  payment_status: "",
  product_id: "",
  product_type: "",
  quantity: "",
  hotalQuantity: "",
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
  receipt_image: [],
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
  is_associated: "",
  customer_name: "",
  customer_phone: "",
  customer_passport_number: "",
  customer_email: "",
});

const fileInput = ref(null);
const fileInputTwo = ref(null);
const fileInputThree = ref(null);
const previewImage = ref(null);

const openFilePicker = () => {
  fileInput.value.click();
};
const openFilePickerTwo = () => {
  fileInputTwo.value.click();
};
const openFilePickerThree = () => {
  fileInputThree.value.click();
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

const expPreviewImage = ref([]);

const exphandleFileChange = (e) => {
  console.log(e.target.files);
  let selectedFile = e.target.files;
  if (selectedFile) {
    for (let index = 0; index < selectedFile.length; index++) {
      let inputValue = {
        file: selectedFile[index],
        amount: 0,
      };
      formData.value.paid_slip.push(inputValue);
      let expData = {
        file: URL.createObjectURL(selectedFile[index]),
        amount: 0,
      };
      expPreviewImage.value.push(expData);
    }
  }
  console.log(formData.value.paid_slip, "this is paid slip");
};

const expremoveSelectedImage = (index) => {
  formData.value.paid_slip.splice(index, 1);
  expPreviewImage.value.splice(index, 1);
  console.log(formData.value.paid_slip, "this is remove");
};
const expremoveSecSelectedImage = (index) => {
  // formData.value.paid_slip = null;
  // expPreviewImage.value = [];
  formData.value.receipt_image.splice(index, 1);
  uploadRecePreview.value.splice(index, 1);
  console.log(formData.value.receipt_image, "this is remove");
};

const uploadRecePreview = ref([]);

const recehandleFileChange = (e) => {
  let selectedFile = e.target.files;
  if (selectedFile) {
    for (let index = 0; index < selectedFile.length; index++) {
      formData.value.receipt_image.push(selectedFile[index]);
      uploadRecePreview.value.push(URL.createObjectURL(selectedFile[index]));
    }
  }
  console.log(formData.value.receipt_image, "receipt");
};

const errors = ref(null);

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
  if (formData.value.payment_method) {
    frmData.append("payment_method", formData.value.payment_method);
  }

  formData.value.payment_status &&
    frmData.append("payment_status", formData.value.payment_status);

  frmData.append("product_type", formData.value.product_type);
  if (formData.value.cost_price) {
    frmData.append("cost_price", formData.value.cost_price);
  }
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

  formData.value.quantity &&
    frmData.append("quantity", formData.value.quantity);

  formData.value.reservation_status &&
    frmData.append("reservation_status", formData.value.reservation_status);
  formData.value.selling_price &&
    frmData.append("selling_price", formData.value.selling_price);
  formData.value.service_date &&
    frmData.append("service_date", formData.value.service_date);
  formData.value.car_id && frmData.append("car_id", formData.value.car_id);
  formData.value.slip_code &&
    frmData.append("slip_code", formData.value.slip_code);
  if (secForm.value.route_plan) {
    frmData.append("route_plan", secForm.value.route_plan);
  }
  if (secForm.value.dropoff_location) {
    frmData.append("dropoff_location", secForm.value.dropoff_location);
  }
  if (formData.value.pickup_time) {
    frmData.append("pickup_time", formData.value.pickup_time);
  }
  if (secForm.value.special_request) {
    frmData.append("special_request", secForm.value.special_request);
  }
  if (secForm.value.pickup_location) {
    frmData.append("pickup_location", secForm.value.pickup_location);
  }

  if (customer_passport.value.length != 0) {
    if (customer_passport.value.length > 0) {
      for (let i = 0; i < customer_passport.value.length; i++) {
        let file = customer_passport.value[i];
        frmData.append("customer_passport[" + i + "]", file);
      }
    }
  }

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
      if (secForm.value.customer_name) {
        secfrm.append("customer_name", secForm.value.customer_name);
      }
      if (secForm.value.customer_phone) {
        secfrm.append("customer_phone", secForm.value.customer_phone);
      }
      if (secForm.value.customer_passport_number) {
        secfrm.append(
          "customer_passport_number",
          secForm.value.customer_passport_number
        );
      }
      if (enabled.value == true) {
        secfrm.append("is_associated", 1);
      } else {
        secfrm.append("is_associated", 0);
      }

      expense_amount.value &&
        secfrm.append("expense_amount", expense_amount.value);

      if (formData.value.receipt_image.length != 0) {
        if (formData.value.receipt_image.length > 0) {
          for (let i = 0; i < formData.value.receipt_image.length; i++) {
            let file = formData.value.receipt_image[i];
            secfrm.append("receipt_image[" + i + "]", file);
          }
        }
      }
      if (formData.value.paid_slip.length != 0) {
        if (formData.value.paid_slip.length > 0) {
          for (let i = 0; i < formData.value.paid_slip.length; i++) {
            let file = formData.value.paid_slip[i].file;
            let amount = formData.value.paid_slip[i].amount;
            secfrm.append("paid_slip[" + i + "][file]", file);
            secfrm.append("paid_slip[" + i + "][amount]", amount);
          }
        }
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

      if (secForm.value.other_info) {
        secfrm.append("other_info", secForm.value.other_info);
      }

      // if (secForm.value.supplier_name) {
      //   secfrm.append("supplier_name", secForm.value.supplier_name);
      // }
      if (secForm.value.account_holder_name) {
        secfrm.append("account_holder_name", secForm.value.account_holder_name);
      }
      // if (secForm.value.driver_name) {
      //   secfrm.append("driver_name", secForm.value.driver_name);
      // }
      // if (secForm.value.driver_contact) {
      //   secfrm.append("driver_contact", secForm.value.driver_contact);
      // }
      // if (secForm.value.car_number) {
      //   secfrm.append("car_number", secForm.value.car_number);
      // }
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
      paid_slip: [],
      cost: "",
      payment_status: "",
      product_id: "",
      product_type: "",
      quantity: "",
      car_id: "",
      car_name: "",
      ticket_name: "",
      receipt_image: [],
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
    expPreviewImage.value = [];
    uploadRecePreview.value = [];
    toast.success(response.message);
    router.push(`/reservation/update/${route.params.id}/${crm.value}`);
    window.location.reload();
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

const route_plan = ref("");
const dropoff_location = ref("");
const booking_status = ref("");
const booking_confirm_letters = ref("");
const booking_receipt = ref("");
const checkin_date = ref("");
const checkout_date = ref("");
const roomName = ref("");
const paid_slip_image = ref([]);

const getDetail = async () => {
  try {
    const response = await reservationStore.getDetailAction(route.params.id);
    console.log(response, "this is response");
    old.value = response.result.booking?.past_crm_id
      ? response.result.booking?.past_crm_id
      : "";
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
      console.log(
        booking_receipt.value,
        response.result.receipt_images,
        "this is receipt image"
      );
    }
    if (response.result.customer_passports.length > 0) {
      customer_passport_data.value = response.result.customer_passports;
      console.log(
        customer_passport_data.value,
        "this is customer passport image"
      );
    }
    if (response.result.pickup_time) {
      formData.value.pickup_time = response.result.pickup_time;
    } else {
      formData.value.pickup_time =
        response.result.reservation_info?.pickup_time;
    }
    if (response.result.slip_code) {
      formData.value.slip_code = response.result.slip_code;
    } else {
      formData.value.slip_code = "-";
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

    secForm.value.special_request = response.result.special_request;

    // console.log(secForm.value.special_request, "this is special");
    if (response.result.product_type != "App\\Models\\Inclusive") {
      if (response.result.product?.name != null) {
        formData.value.product_name = response.result.product?.name;
      }
    } else {
      formData.value.product_name = "inclusive";
    }
    formData.value.cus_name = response.result.customer_info.name;
    formData.value.cus_contact = response.result.customer_info.phone_number;
    formData.value.cus_passport = response.result.customer_info.nrc_number;
    formData.value.cus_email = response.result.customer_info.email;

    secForm.value.route_plan = response.result.route_plan;

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

      secForm.value.other_info = response.result.reservation_info.other_info;
    } else {
      secForm.value.customer_feedback = "";
      secForm.value.customer_score = "";
      secForm.value.driver_score = "";
      secForm.value.product_score = "";
      secForm.value.other_info = "";
    }
    // if (response.result.is_associated == 1) {
    //   enabled.value = true;
    //   if (response.result.associated_customer != null) {
    //     secForm.value.customer_name =
    //       response.result.associated_customer[0].name;
    //     secForm.value.customer_phone =
    //       response.result.associated_customer[0].phone;
    //     secForm.value.customer_passport_number =
    //       response.result.associated_customer[0].passport;
    //   }
    // }
    if (response.result.associated_customer.length > 0) {
      enabled.value = true;
      if (response.result.associated_customer != null) {
        secForm.value.customer_name =
          response.result.associated_customer[0].name;
        secForm.value.customer_phone =
          response.result.associated_customer[0].phone;
        secForm.value.customer_passport_number =
          response.result.associated_customer[0].passport;
        secForm.value.customer_email =
          response.result.associated_customer[0].email;
      }
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
    if (response.result.paid_slip.length != 0) {
      paid_slip_image.value = response.result.paid_slip;
      console.log(paid_slip_image.value, "this is paid");
      formData.value.paid_slip = [];
      console.log(formData.value.paid_slip);
    }
    formData.value.receipt_image = [];
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
    // formData.value.cost = response.result.cost;

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

    if (response.result.car == null) {
      formData.value.car_id = "";
      formData.value.car_name = "-";
    } else if (response.result.car != null) {
      formData.value.car_id = response.result.car.id;
      formData.value.car_name = response.result.car.name;
    }
    if (response.result.ticket == null) {
      formData.value.ticket_id = "";
      formData.value.ticket_name = "-";
    } else if (response.result.ticket != null) {
      formData.value.ticket_id = response.result.ticket.id;
      formData.value.ticket_name = response.result.ticket.price;
    }
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

    console.log(formData.value.receipt_images, "this is receipt image");
    formData.value.product_id = response.result.product_id;
    formData.value.product_type = response.result.product_type;
    if (formData.value.checkin_date && formData.value.checkout_date) {
      formData.value.hotalQuantity =
        response.result.quantity *
        daysBetween(formData.value.checkin_date, formData.value.checkout_date);
    }
    console.log(formData.value.cost_price, "this is hotal Quantity");
    formData.value.selling_price = response.result.selling_price;
    formData.value.service_date = response.result.service_date;
    secForm.value.ref_number =
      response.result.reservation_supplier_info?.ref_number;

    if (response.result.cost_price == null) {
      formData.value.cost_price = 0;
    } else {
      formData.value.cost_price = response.result.cost_price;
    }
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

const email_info_part = ref(false);
const emailInfoHandle = () => {
  email_info_part.value = !email_info_part.value;
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
  routeArray.value = secForm.value.route_plan
    .split(",")
    .map((item) => item.trim());
  console.log(routeArray.value, "this is array");
};

const changeName = () => {
  if (formData.value.product_type == "App\\Models\\EntranceTicket") {
    secForm.value.supplier_name = formData.value.product_name;
  }
};

const printReservation = () => {
  window.open(
    import.meta.env.VITE_API_URL +
      "/reservations/" +
      route.params.id +
      "/receipt"
  );
};

const addUnderline = (text) => {
  return text.replace(/./g, "$&̲");
};

const copyReservation = async () => {
  const res = await reservationStore.copyReservationDetail(route.params.id);
  console.log(res);
  let formattedOutput;
  if (res.result.checkin_date != undefined) {
    formattedOutput = `
💰 Total Cost: ${res.result.total_cost} THB 🏦 Bank Name: ${
      res.result.bank_name != "null" ? res.result.bank_name : "-"
    }
🔢 Bank Account Number: ${
      res.result.bank_account_number != "null"
        ? `➖${res.result.bank_account_number}`
        : "-"
    }
🧑‍💼 Account Name: ${
      res.result.account_name != "null" ? res.result.account_name : "-"
    }
#️⃣ CRM ID: ${res.result.crm_id}
#️⃣ Reservation Code: ${res.result.reservation_code}
🏨 Hotel Name: ${res.result.product_name}
🏩 Room Name : ${res.result.room_name != "null" ? res.result.room_name : "-"}
🛌 Total Rooms: ${
      res.result.total_rooms != "null" ? res.result.total_rooms : "-"
    }
🌙 Total Nights: ${
      res.result.total_nights != "null" ? res.result.total_nights : "-"
    }
💵 Price: ${res.result.sale_price - res.result.discount} THB
💵 Total Sale Amount: ${res.result.total_sale_amount} THB
💸 Discount : ${res.result.discount} THB
💵 Balance Due: ${res.result.balance_due} THB
📝 Payment Status: ${res.result.payment_status}
📅 Sale Date: ${res.result.sale_date != "null" ? res.result.sale_date : "-"}
📅 Check-in Date: ${
      res.result.checkin_date != "null" ? res.result.checkin_date : "-"
    }
📅 Checkout Date: ${
      res.result.checkout_date != "null" ? res.result.checkout_date : "-"
    }
🤑 Score : ${res.result.score}
    `;
  } else if (res.result.entrance_ticket_variation_name) {
    formattedOutput = `
💰 Total Cost: ${res.result.total_cost} THB
🏦 Bank Name: ${res.result.bank_name != "null" ? res.result.bank_name : "-"}
🔢 Bank Account Number: ${
      res.result.bank_account_number != "null"
        ? `➖${res.result.bank_account_number}`
        : "-"
    }
🧑‍💼 Account Name: ${res.result.account_name}
#️⃣ CRM ID: ${res.result.crm_id}
#️⃣ Reservation Code: ${res.result.reservation_code}
🎫 Attraction : ${res.result.product_name}
🎫 Entrance Ticket Name : ${res.result.entrance_ticket_variation_name}
💵 Price: ${res.result.sale_price - res.result.discount} THB
💵 Total Sale Amount: ${res.result.total_sale_amount} THB
💸 Discount : ${res.result.discount} THB
💵 Balance Due: ${res.result.balance_due} THB
📝 Payment Status: ${res.result.payment_status}
📅 Sale Date: ${res.result.sale_date != "null" ? res.result.sale_date : "-"}
🗓️ Service Date: ${
      res.result.service_date != "null" ? res.result.service_date : "-"
    }
🤑 Score : ${res.result.score}
      `;
  } else if (res.result.ticket_type) {
    formattedOutput = `
💰 Total Cost: ${res.result.total_cost} THB
#️⃣ CRM ID: ${res.result.crm_id}
#️⃣ Reservation Code: ${res.result.reservation_code}
✈️ Airline Name : ${res.result.product_name}
🎫 Ticket Type : ${res.result.ticket_type}
🎫 Total Tickets : ${res.result.total_ticket}
💵 Price: ${res.result.sale_price - res.result.discount} THB
💵 Total Sale Amount: ${res.result.total_sale_amount} THB
💸 Discount : ${res.result.discount} THB
💵 Balance Due: ${res.result.balance_due} THB
📝 Payment Status: ${res.result.payment_status}
📅 Sale Date: ${res.result.sale_date != "null" ? res.result.sale_date : "-"}
🗓️ Service Date: ${
      res.result.service_date != "null" ? res.result.service_date : "-"
    }
🧾 Payment Status: ${res.result.payment_status}
🤑 Score : ${res.result.score}
📝 Expense Comment:
    `;
  }

  setTimeout(() => {
    navigator.clipboard.writeText(formattedOutput);
  }, 0);

  toast.success("success copy reservation");
};
const printPrivateVanTour = () => {
  window.open(
    import.meta.env.VITE_API_URL +
      "/vantour-reservation/" +
      route.params.id +
      "/receipt"
  );
};

const printHotelConfirm = () => {
  window.open(
    import.meta.env.VITE_API_URL +
      "/hotel-reservation/" +
      route.params.id +
      "/receipt"
  );
};

// reservations/{same id from url}/receipt

const allowUpdate = computed(() => {
  if (expense_amount.value == 0) {
    console.log(expense_amount.value, formData.value.receipt_image, "one");
    return true;
  } else if (expense_amount.value == expense_amount_upload.value) {
    console.log(expense_amount.value, formData.value.receipt_image, "three");
    return true;
  } else if (
    expense_amount.value != 0 &&
    formData.value.receipt_image.length == 0
  ) {
    console.log(expense_amount.value, formData.value.receipt_image, "two");
    return false;
  } else if (
    expense_amount.value != expense_amount_upload.value &&
    formData.value.receipt_image.length > 0
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

const old = ref("");

const deleteImage = async (id) => {
  console.log(id, "this is delete id");
  await reservationStore.deleteResImage(id);
  toast.success("success delete receipt");
  window.location.reload();
  await getDetail();
};
const deleteImagePaid = async (id) => {
  console.log(id, "this is delete id");
  await reservationStore.deletePaidImage(id);
  toast.success("success delete receipt paid slip");
  window.location.reload();
  await getDetail();
};

const featureImageInput = ref(null);
const featureCusPassPreview = ref([]);
const customer_passport = ref([]);
const customer_passport_data = ref([]);

const openFileFeaturePicker = () => {
  featureImageInput.value.click();
};

const handlerCustomerPassport = (e) => {
  let selectedFile = e.target.files;

  for (let index = 0; index < selectedFile.length; index++) {
    customer_passport.value.push(selectedFile[index]);
    featureCusPassPreview.value.push(URL.createObjectURL(selectedFile[index]));
    console.log(customer_passport.value, "this is customer passport array");
  }
};

const removeCustomerPassportImage = (index) => {
  customer_passport.value.splice(index, 1);
  featureCusPassPreview.value.splice(index, 1);
  console.log(customer_passport.value, "this is remove");
};

const deleteCustomerPassport = async (id) => {
  const res = await reservationStore.deleteCustomerPassportAction(id);
  toast.success("success delete customer passport");
  window.location.reload();
  await getDetail();
};

const cancelEmailFunction = () => {
  emailData.value = {
    mail_subject: "",
    mail_to: "",
    send_to_default: false,
    attachments: [],
  };
};

const emailLoading = ref(false);
const sendEmailFunction = async () => {
  Swal.fire({
    title: "Are you sure ?",
    text: `Send email to ${emailData.value.mail_to} `,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#FF6300",
    cancelButtonColor: "#C69B92",
    confirmButtonText: "Send",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        emailLoading.value = true;
        console.log(emailData.value);
        const frmData = new FormData();
        frmData.append("mail_to", emailData.value.mail_to);
        frmData.append("mail_subject", emailData.value.mail_subject);
        frmData.append("mail_body", emailData.value.mail_body);
        frmData.append("send_to_default", emailData.value.send_to_default);
        // frmData.append("attachments", emailData.value.attachments);
        if (emailData.value.attachments.length > 0) {
          for (let i = 0; i < emailData.value.attachments.length; i++) {
            let file = emailData.value.attachments[i];
            frmData.append("attachments[" + i + "]", file);
          }
        }
        const res = await reservationStore.emailSendReservation(
          route.params.id,
          frmData
        );
        if (res.data.status) {
          emailLoading.value = false;
          emailData.value = {
            mail_subject: "",
            mail_to: "",
            send_to_default: false,
            attachments: [],
          };
          toast.success(res.data.message);
        }
      } catch (error) {
        emailLoading.value = false;
        toast.error(error.response.data.message);
      }
    }
  });
};

const emailData = ref({
  mail_subject: "",
  mail_to: "",
  send_to_default: false,
  mail_body: "",
  attachments: [],
});

const addAttracted = (e) => {
  for (let i = 0; i < e.target.files.length; i++) {
    emailData.value.attachments.push(e.target.files[i]);
    console.log(e.target.files[i], "this is att");
  }
};

const editorOptions = {
  placeholder: "Write an awesome mail here ...",
};

const mailBodyChange = () => {
  if (formData.value.product_type == "App\\Models\\EntranceTicket") {
    emailData.value.mail_body = `<p>Dear Reservation Manager<b> of ${formData.value.product_name}</b>,</p><p>Greetings from Thailand Anywhere travel and tour.</p><p>We are pleased to book the tickets for our customers as per following description ka.</p>
    <p>Date :<b>${formData.value.service_date}</b></p><p>Ticket :<b>${formData.value.variation_name}</b></p><p>Total :<b>${formData.value.quantity}</b></p><p>Name :<b>${formData.value.cus_name}</b></p>
    <p>Passport and payment slips are attached with this email .</p><b><em>Please kindly arrange and invoice & voucher for our clients accordingly .</em></b><p>Should there be anything more required you can call us at +66983498197 and LINE ID 58858380 .</p>`;
  } else if (formData.value.product_type == "App\\Models\\Hotel") {
    emailData.value.mail_body = `<p>Dear Reservation Manager<b> of ${
      formData.value.product_name
    }</b>,</p><p>Greetings from Thailand Anywhere travel and tour. Good day to you ka.</p><p>We are pleased to book the room for our customers as per following description checks availability by phone.</p>
    <p>Check In :<strong>${
      checkin_date.value
    }</strong></p><p>Check Out :<strong>${
      checkout_date.value
    }</strong></p><p>Total :<strong>${
      formData.value.quantity
    } rooms & ${daysBetween(
      checkin_date.value,
      checkout_date.value
    )} nights</strong></p><p>Name :<strong>${formData.value.cus_name} & ${
      customer_passport_data.value.length
    } passports</strong></p><p>Room Type :<strong>${
      roomName.value
    }</strong></p><p>Special Request :<strong>${
      secForm.value.special_request
    }</strong></p>
    <p>Passport and payment slips are attached with this email .</p><b><em>Please arrange the invoice and confirmation letter ka.</em></b><p>Should there be anything more required you can call us at +66983498197 and LINE ID 58858380 .</p>`;
  }
};

onMounted(async () => {
  await getDetail();
  console.log(formData.value.receipt_image, "this is rece");
  changeName();
  console.log(booking_confirm_letters.value, "this is something");
  action.value = route.params.action;
  crm.value = route.params.crm;
  console.log(crm.value, old.value, "this is something wrong");
  // emailData.value.mail_body = "<h1>Hello world</h1>";
  mailBodyChange();
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
        <div class="flex justify-end items-center space-x-4">
          <p
            class="px-4 py-2 border border-[#ff613c] text-white bg-[#ff613c] text-xs cursor-pointer hover:bg-transparent hover:text-[#ff613c]"
            @click="copyReservation"
            v-if="
              formData.product_type == 'App\\Models\\Hotel' ||
              formData.product_type == 'App\\Models\\EntranceTicket' ||
              formData.product_type == 'App\\Models\\Airline'
            "
          >
            Copy
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
          <p
            class="px-4 py-2 border border-[#ff613c] text-white bg-[#ff613c] text-xs cursor-pointer hover:bg-transparent hover:text-[#ff613c]"
            @click="printReservation"
            v-if="
              formData.product_type == 'App\\Models\\EntranceTicket' &&
              (booking_status.payment_status == 'fully_paid' ||
                booking_status.payment_status == 'partially_paid')
            "
          >
            Print
          </p>
          <p
            class="px-4 py-2 border border-[#ff613c] text-white bg-[#ff613c] text-xs cursor-pointer hover:bg-transparent hover:text-[#ff613c]"
            @click="printPrivateVanTour"
            v-if="
              formData.product_type == 'App\\Models\\PrivateVanTour' &&
              (booking_status.payment_status == 'fully_paid' ||
                booking_status.payment_status == 'partially_paid' ||
                booking_status.payment_method == 'Cash')
            "
          >
            Print
          </p>
          <p
            class="px-4 py-2 border border-[#ff613c] text-white bg-[#ff613c] text-xs cursor-pointer hover:bg-transparent hover:text-[#ff613c]"
            @click="printHotelConfirm"
            v-if="
              formData.product_type == 'App\\Models\\Hotel' &&
              (booking_status.payment_status == 'fully_paid' ||
                booking_status.payment_status == 'partially_paid')
            "
          >
            Print
          </p>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-8">
        <div class="col-span-2">
          <div
            class="flex justify-between items-center text-xs bg-[#ff613c] text-white font-semibold px-4 py-2"
          >
            <div class="flex justify-start items-center gap-2">
              <p>Reservation Code :</p>
              <p class="ml-2 text-white">{{ crm }}</p>
            </div>
            <div
              class="flex justify-end items-center gap-2"
              v-if="old != 'null'"
            >
              <p>Old Crm ID :</p>
              <p class="ml-2 text-white">{{ old }}</p>
            </div>
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
                {{ formData.ticket_name }}
              </p>
            </div>

            <div class="pl-10 pr-10 space-y-2">
              <p class="text-gray-400 text-xs">Quantity</p>
              <p
                class="font-semibold text-xs py-1.5"
                v-if="!formData.checkin_date"
              >
                {{ formData.quantity }}
              </p>
              <p
                class="font-semibold text-xs py-1.5"
                v-if="formData.checkin_date"
              >
                {{ formData.hotalQuantity }}
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
              <p
                class="font-semibold text-xs py-1.5"
                v-if="!formData.checkin_date"
              >
                {{ formData.selling_price * formData.quantity }}
              </p>
              <p
                class="font-semibold text-xs py-1.5"
                v-if="formData.checkin_date"
              >
                {{ formData.selling_price * formData.hotalQuantity }}
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
              <p
                class="font-semibold text-xs py-1.5"
                v-if="!formData.checkin_date"
              >
                {{ formData.selling_price * formData.quantity }}
              </p>
              <p
                class="font-semibold text-xs py-1.5"
                v-if="formData.checkin_date"
              >
                {{ formData.selling_price * formData.hotalQuantity }}
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
            <p>Receipt Images : {{ crm }}</p>
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
            <div
              class="col-span-2 grid grid-cols-2 gap-4"
              v-if="
                formData.product_type == 'App\\Models\\EntranceTicket' ||
                formData.product_type == 'App\\Models\\Hotel' ||
                formData.product_type == 'App\\Models\\Airline'
              "
            >
              <div class="pl-10 space-y-2">
                <p class="text-xs text-gray-400">Is Associated ?</p>
                <p class="text-gray-400 text-xs">
                  <Switch
                    v-model="enabled"
                    :class="enabled ? ' bg-[#FF6300]' : 'bg-gray-500'"
                    class="relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                  >
                    <span class="sr-only">Use setting</span>
                    <span
                      aria-hidden="true"
                      :class="enabled ? 'translate-x-9' : 'translate-x-0'"
                      class="pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                    />
                  </Switch>
                </p>
              </div>
              <div class="pl-10 pr-4 space-y-2" v-if="enabled">
                <p class="text-xs text-gray-400">Associated Customer Name</p>
                <input
                  type="text"
                  name=""
                  v-model="secForm.customer_name"
                  class="h-8 w-full font-semibold bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
                  id=""
                />
              </div>
              <div class="pl-10 space-y-2" v-if="enabled">
                <p class="text-xs text-gray-400">Associated Customer Phone</p>
                <input
                  type="number"
                  v-model="secForm.customer_phone"
                  name=""
                  class="h-8 w-full font-semibold bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
                  id=""
                />
              </div>
              <div class="pl-10 pr-4 space-y-2" v-if="enabled">
                <p class="text-xs text-gray-400">Associated Customer Email</p>
                <input
                  type="text"
                  v-model="secForm.customer_email"
                  name=""
                  class="h-8 w-full font-semibold bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
                  id=""
                />
              </div>
              <div class="pl-10 space-y-2" v-if="enabled">
                <p class="text-xs text-gray-400">
                  Associated Customer Passport
                </p>
                <input
                  type="text"
                  v-model="secForm.customer_passport_number"
                  name=""
                  class="h-8 w-full font-semibold bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
                  id=""
                />
              </div>

              <div class="pl-10 pr-4 pt-4 space-y-2">
                <input
                  type="file"
                  ref="featureImageInput"
                  multiple
                  class="hidden"
                  @change="handlerCustomerPassport"
                  accept="image/*"
                />
                <p
                  class="text-white text-xs inline-block cursor-pointer bg-[#ff613c] rounded-lg w-full px-3 py-1.5"
                  @click.prevent="openFileFeaturePicker"
                >
                  Add New Customer Passport
                </p>
              </div>
              <div class="px-10 space-y-2 col-span-2">
                <p
                  class="text-gray-400 text-xs"
                  v-if="featureCusPassPreview.length > 0"
                >
                  Preview Images for Customer Passport
                </p>
                <div
                  v-if="featureCusPassPreview.length > 0"
                  class="grid grid-cols-3 gap-4"
                >
                  <div
                    v-for="(img, index) in featureCusPassPreview"
                    :key="index"
                    class="relative"
                  >
                    <img :src="img" alt="" />
                    <span
                      class="absolute top-[-10px] right-0"
                      @click="removeCustomerPassportImage(index)"
                    >
                      <i
                        class="fa-solid fa-circle-minus text-red-600 text-lg"
                      ></i>
                    </span>
                  </div>
                </div>
                <p
                  class="text-gray-400 text-xs"
                  v-if="customer_passport_data.length > 0"
                >
                  Customer Passports
                </p>
                <div
                  v-if="customer_passport_data.length > 0"
                  class="grid grid-cols-3 gap-4"
                >
                  <div
                    v-for="(img, index) in customer_passport_data"
                    :key="index"
                    class="relative"
                  >
                    <a :href="img.file">
                      <img :src="img.file" alt="" />
                    </a>
                    <span
                      class="absolute top-[-10px] right-0"
                      @click="deleteCustomerPassport(img.id)"
                    >
                      <i
                        class="fa-solid fa-circle-minus text-red-600 text-lg"
                      ></i>
                    </span>
                  </div>
                </div>
              </div>
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
              ></p>
              <p
                class="font-semibold text-xs"
                v-if="formData.product_type == 'App\\Models\\Airline'"
              >
                {{ formData.ticket_name }}
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
            @click="emailInfoHandle"
            v-if="
              formData.product_type == 'App\\Models\\EntranceTicket' ||
              formData.product_type == 'App\\Models\\Hotel'
            "
          >
            <i class="fa-solid fa-angle-down"></i>
            <p
              v-if="formData.product_type == 'App\\Models\\EntranceTicket'"
              class=""
            >
              Ticket Email Preview Information
            </p>
            <p v-if="formData.product_type == 'App\\Models\\Hotel'" class="">
              Hotel Email Preview Information
            </p>
          </div>
          <div
            class="grid grid-cols-1 gap-4 bg-gray-200/50 py-4 overflow-hidden"
            v-if="email_info_part"
          >
            <div class="w-[95%] mx-auto flex justify-between items-center">
              <div class="flex justify-start items-center gap-3">
                <img
                  src="../../public/logo.jpg"
                  class="w-10 h-10 rounded-full"
                  alt=""
                />
                <p>Email Preview</p>
              </div>
              <div class="space-x-2">
                <button
                  class="text-xs px-4 py-2 border border-[#FF6300] bg-[#FF6300] text-white"
                  @click="cancelEmailFunction"
                >
                  Clear Email
                </button>
                <button
                  v-if="formData.payment_status == 'fully_paid'"
                  class="text-xs px-4 py-2 border border-[#FF6300] bg-white"
                  @click="sendEmailFunction"
                >
                  Send Email
                </button>
                <button
                  v-if="formData.payment_status != 'fully_paid'"
                  class="text-xs px-4 py-2 border border-[#FF6300] bg-gray-300"
                >
                  Send Email
                </button>
              </div>
            </div>
            <div class="text-center" v-if="emailLoading">
              Email sending , Please wait loading .....
            </div>
            <div
              class="w-[95%] mx-auto shadow p-4 rounded bg-white mb-4 space-y-3 text-xs"
            >
              <div class="space-y-4">
                <div>
                  <input
                    type="email"
                    v-model="emailData.mail_to"
                    class="border-[#FF6300] px-4 py-2 border text-xs w-full"
                    placeholder="Sender Email"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    v-model="emailData.mail_subject"
                    class="border-[#FF6300] px-4 py-2 border text-xs w-full"
                    placeholder="Subject"
                  />
                </div>

                <div class="flex justify-start items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="emailData.send_to_default"
                    name=""
                    id=""
                    class="w-6 h-6 border border-[#FF6300]"
                  />
                  <p class="text-xs">default email send ?</p>
                </div>
                <div class="">
                  <QuillEditor
                    ref="textEditor"
                    :options="editorOptions"
                    theme="snow"
                    class="!bg-white/50 !border-1 !border-[#FF6300] !rounded-bl-md !rounded-br-md !shadow-sm !text-xs !text-gray-900 !h-[350px]"
                    toolbar="essential"
                    contentType="html"
                    v-model:content="emailData.mail_body"
                  />
                </div>
                <div class="space-y-2">
                  <p class="text-xs text-[#FF6300]">
                    Attachment Files must be under 25mb .
                  </p>
                  <input
                    type="file"
                    multiple
                    @change="addAttracted"
                    class="border-[#FF6300] px-4 py-2 border text-xs w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end items-center">
            <button
              v-if="
                (formData.product_type == 'App\\Models\\EntranceTicket' ||
                  formData.product_type == 'App\\Models\\Hotel' ||
                  formData.product_type == 'App\\Models\\PrivateVanTour' ||
                  formData.product_type == 'App\\Models\\GroupTour' ||
                  formData.product_type == 'App\\Models\\Airline') &&
                allowUpdate
              "
              @click.prevent="onSubmitHandler"
              class="my-10 px-4 py-2 bg-[#ff613c] text-white hover:bg-blue-600 shadow"
            >
              Update Reservation
            </button>

            <button
              v-if="
                formData.product_type != 'App\\Models\\EntranceTicket' &&
                formData.product_type != 'App\\Models\\Hotel' &&
                formData.product_type != 'App\\Models\\PrivateVanTour' &&
                formData.product_type != 'App\\Models\\GroupTour' &&
                formData.product_type != 'App\\Models\\Airline'
              "
              @click.prevent="onSubmitHandler"
              class="my-10 px-4 py-2 bg-[#ff613c] text-white hover:bg-blue-600 shadow"
            >
              Update Reservation
            </button>
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
            <div
              class="px-6 space-y-2"
              v-if="
                formData.product_type != 'App\\Models\\EntranceTicket' &&
                formData.product_type != 'App\\Models\\Hotel' &&
                formData.product_type != 'App\\Models\\Airline'
              "
            >
              <p class="text-gray-400 text-xs">Pickup Time</p>

              <input
                type="time"
                name=""
                v-model="formData.pickup_time"
                class="w-full bg-white border font-semibold border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
                id=""
              />
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
                disabled
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
                disabled
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
                disabled
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
                disabled
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
                <p class="text-gray-400 text-xs">Reservation Slip Code</p>
                <input
                  v-model="formData.slip_code"
                  type="title"
                  id="title"
                  class="h-8 w-full font-semibold bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
                />
              </div>

              <div class="pl-10 pr-10 space-y-2">
                <p
                  class="text-gray-400 text-xs"
                  v-if="formData.product_type == 'App\\Models\\Hotel'"
                >
                  Hotel Confirmation Receipt
                </p>
                <p class="text-gray-400 text-xs" v-else>Reservation Slip</p>
                <div class="space-y-4 mb-2">
                  <input
                    type="file"
                    id="image"
                    ref="fileInputTwo"
                    multiple
                    class="hidden"
                    @change="exphandleFileChange"
                    accept="image/*"
                  />
                  <div
                    @click.prevent="openFilePickerTwo"
                    class="font-semibold py-4 px-4 flex justify-center items-center text-xs border border-gray-400 border-dashed"
                  >
                    <span class="text-xs"
                      ><i class="fa-solid fa-plus text-2xl text-gray-400"></i
                    ></span>
                  </div>

                  <div class="grid grid-cols-3 gap-3 mt-4">
                    <div
                      class="relative"
                      v-for="(image, index) in expPreviewImage"
                      :key="index"
                    >
                      <button
                        @click.prevent="expremoveSelectedImage(index)"
                        class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
                      >
                        <XCircleIcon class="w-8 h-8 font-semibold" />
                      </button>

                      <img
                        class="h-auto w-full rounded"
                        :src="image.file"
                        alt=""
                      />
                      <!-- <p>{{ formData.paid_slip[index].amount }}</p> -->
                      <input
                        type="number"
                        name="amount"
                        v-model="formData.paid_slip[index].amount"
                        id=""
                        class="w-full h-8 bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
                      />
                    </div>
                  </div>
                  <div
                    class="grid grid-cols-2 gap-4 bg-gray-200/50"
                    v-if="paid_slip_image.length != 0"
                  >
                    <div v-for="(image, index) in paid_slip_image" :key="index">
                      <p class="text-xs mb-2 mt-2">
                        <span
                          ><i
                            class="fa-solid fa-trash-can text-lg text-red-500"
                            @click="deleteImagePaid(image.id)"
                          ></i
                        ></span>
                        <a
                          :href="image.file"
                          target="_blink"
                          class="text-xs text-blue-700 cursor-pointer"
                        >
                          <img :src="image.file" alt="" />
                        </a>
                      </p>
                    </div>
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
              <p class="text-gray-400 text-xs">Expense Method:</p>

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
              <p class="text-gray-400 text-xs">Expense Status</p>
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
              <p class="text-gray-400 text-xs">Bank Account Number</p>
              <input
                v-model="formData.bank_account_number"
                type="number"
                id="title"
                class="h-8 w-full font-semibold bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
              />
            </div>
            <div class="pl-10 pr-10 space-y-2">
              <p class="text-gray-400 text-xs">Unit Cost</p>
              <input
                v-model="formData.cost_price"
                type="number"
                id="title"
                class="h-8 w-full font-semibold bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
              />
            </div>
            <div
              class="space-y-2"
              v-if="
                formData.product_type == 'App\\Models\\EntranceTicket' ||
                formData.product_type == 'App\\Models\\Hotel' ||
                formData.product_type == 'App\\Models\\PrivateVanTour' ||
                formData.product_type == 'App\\Models\\GroupTour' ||
                formData.product_type == 'App\\Models\\Airline'
              "
            >
              <div class="pl-10 pr-10 space-y-2">
                <p class="text-gray-400 text-xs">Total Cost</p>
                <p
                  class="h-8 w-full font-semibold bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
                  v-if="!formData.checkin_date"
                >
                  {{ formData.cost_price * formData.quantity }}
                </p>
                <p
                  class="h-8 w-full font-semibold bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
                  v-if="formData.checkin_date"
                >
                  {{ formData.cost_price * formData.hotalQuantity }}
                </p>
              </div>

              <div class="pl-10 pr-10 space-y-2">
                <p class="text-gray-400 text-xs">Receipt</p>
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
                    class="font-semibold py-4 px-4 flex justify-center items-center text-xs border border-gray-400 border-dashed"
                  >
                    <span class="text-xs"
                      ><i class="fa-solid fa-plus text-2xl text-gray-400"></i
                    ></span>
                  </div>

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
                        <XCircleIcon class="w-8 h-8 font-semibold" />
                      </button>

                      <img class="h-auto w-full rounded" :src="image" alt="" />
                    </div>
                  </div>

                  <div
                    class="grid grid-cols-2 gap-4 bg-gray-200/50"
                    v-if="booking_receipt.length != 0"
                  >
                    <div v-for="(image, index) in booking_receipt" :key="index">
                      <span
                        ><i
                          class="fa-solid fa-trash-can text-lg text-red-500"
                          @click="deleteImage(image.id)"
                        ></i
                      ></span>
                      <a :href="image.file" target="_blink">
                        <img :src="image.file" alt="" />
                      </a>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <p class="text-gray-400 text-xs font">Expense Comment</p>

                    <textarea
                      class="w-full bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 font-semibold text-xs"
                      cols="4"
                      v-model="secForm.customer_feedback"
                    ></textarea>
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

.ql-toolbar.ql-snow {
  border: 1px solid #ff6300 !important;
  box-sizing: border-box;
  font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  padding: 8px;
}
</style>
