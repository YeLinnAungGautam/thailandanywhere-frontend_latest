<script setup>
import Layout from "./Layout.vue";
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { PlusIcon, ListBulletIcon } from "@heroicons/vue/24/outline";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import Modal from "../components/Modal.vue";
import CustomerCreate from "../components/CustomerCreate.vue";
import { Switch } from "@headlessui/vue";
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
import { useRoomStore } from "../stores/room";
import { useHotelStore } from "../stores/hotel";
import { useAirLineStore } from "../stores/airline";
import { useAuthStore } from "../stores/auth";
import { useAdminStore } from "../stores/admin";
import { addDays } from "date-fns";

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
const hotelStore = useHotelStore();
const inclusiveStore = useInclusiveStore();
const roomStore = useRoomStore();
const airlineStore = useAirLineStore();
const authStore = useAuthStore();
const adminStore = useAdminStore();

const { customer, loading } = storeToRefs(customerStore);
const { vantours } = storeToRefs(vantourStore);
const { grouptours } = storeToRefs(grouptourStore);
const { airports } = storeToRefs(airportStore);
const { entrances } = storeToRefs(entranceStore);
const { inclusives } = storeToRefs(inclusiveStore);
const { rooms } = storeToRefs(roomStore);
const { hotels } = storeToRefs(hotelStore);
const { airlines } = storeToRefs(airlineStore);
const { isOpenCustomerCreate } = storeToRefs(sidebar);
const { admin } = storeToRefs(adminStore);

const soldFrom = [
  { id: "1", name: "Facebook" },
  { id: "2", name: "Twitter" },
  { id: "3", name: "Instagram" },
  { id: "4", name: "Twitter" },
  { id: "5", name: "Viber" },
  { id: "6", name: "Phone" },
  { id: "7", name: "Office" },
];
const payment_mm = [
  { id: "1", name: "KPAY" },
  { id: "2", name: "AYAPAY" },
  { id: "3", name: "CBPAY" },
  { id: "4", name: "KBZ BANKING" },
  { id: "5", name: "CB BANKING" },
  { id: "6", name: "MAB BANKING" },
  { id: "7", name: "YOMA BANK" },
];
const payment_thb = [
  { id: "1", name: "Kasikorn" },
  { id: "2", name: "Bangkok Bank" },
  { id: "3", name: "Bank of Ayudhaya" },
  { id: "4", name: "SCB Bank" },
  { id: "5", name: "Others..." },
];

const payment_usd = [
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
  { id: "12", name: "Others..." },
];

const paymentArray = [
  // Bank Transfer, International Remittance, Cash, etc
  { id: "1", name: "Bank Transfer" },
  { id: "2", name: "International Remittance" },
  { id: "3", name: "Cash" },
  { id: "4", name: "Other ..." },
];

const payment = ref([]);
const paymentValid = ref(true);

const choosePaymentBank = () => {
  console.log(formData.value.payment_currency);
  if (formData.value.payment_currency == "MMK") {
    payment.value = payment_mm;
    paymentValid.value = true;
  } else if (formData.value.payment_currency == "THB") {
    paymentValid.value = false;
    payment.value = payment_thb;
  } else {
    payment.value = payment_usd;
    paymentValid.value = true;
  }
};
const payment_status = [
  { id: "1", name: "fully_paid" },
  { id: "2", name: "not_paid" },
  { id: "3", name: "partially_paid" },
];

const payment_currency = [
  { id: "1", name: "MMK" },
  { id: "2", name: "USD" },
  { id: "3", name: "THB" },
];
const reservation_status = [
  { id: "1", name: "reserved" },
  { id: "2", name: "awaiting_payment" },
  { id: "3", name: "declined" },
];

const formItemType = [
  { id: "1", name: "Van Tour" },
  { id: "2", name: "Group Tour" },
  { id: "3", name: "---" },
  { id: "4", name: "Entrance Ticket" },
  { id: "5", name: "---" },
  { id: "6", name: "Hotel Room" },
  { id: "7", name: "AirLine" },
];

const formData = ref({
  payment_notes: "",
  customer_id: "",
  sold_from: "",
  payment_method: "",
  bank_name: "",
  payment_status: "",
  booking_date: "",
  items: [],
  money_exchange_rate: "",
  crm_id: "",
  discount: "",
  comment: "",
  receipt_image: [],
  confirmation_letter: [],
  due_date: "",
  deposit: 0,
  balance_due_date: "",
  receipt_images: [],
  special_request: "",
  past_user_id: "",
  is_past_info: "",
  past_crm_id: "",
  is_inclusive: "",
  inclusive_name: "",
  inclusive_quantity: "",
  inclusive_rate: "",
  inclusive_start_date: "",
  inclusive_end_date: "",
});

const enabledIn = ref(false);

const stateInclusive = computed(() => {
  if (enabledIn.value == true) {
    return true;
  } else {
    return false;
  }
});

const sub_total = ref("");
const getSubTotal = () => {
  let data = 0;
  if (enabledIn.value == false) {
    for (let i = 0; i < formData.value.items.length; i++) {
      // data = data + formData.value.items[i].total_amount;
      if (formData.value.items[i].is_inclusive != 1) {
        data = data + formData.value.items[i].total_amount;
      }
    }
  } else {
    data = formData.value.inclusive_rate * formData.value.inclusive_quantity;
  }
  sub_total.value = data;
};

const percentageValue = ref("");

const grand_total = computed(() => {
  console.log(sub_total.value, formData.value.discount);
  if (formData.value.discount == null) {
    formData.value.discount = 0;
  } else {
    if (formData.value.discount != "" || formData.value.discount != null) {
      if (formData.value.discount.trim().endsWith("%")) {
        let remove = parseFloat(formData.value.discount);
        let calculate = (sub_total.value * remove) / 100;
        percentageValue.value = calculate;
        let final = sub_total.value - calculate;
        return final;
      } else {
        let final = sub_total.value - formData.value.discount;
        percentageValue.value = formData.value.discount;
        return final;
      }
    }
  }
});

const balance_due = computed(() => {
  if (
    grand_total.value - formData.value.deposit == 0 &&
    formData.value.items.length != 0
  ) {
    formData.value.payment_status = "fully_paid";
    return grand_total.value - formData.value.deposit;
  } else if (
    grand_total.value - formData.value.deposit != 0 &&
    formData.value.items.length != 0 &&
    formData.value.deposit != 0
  ) {
    formData.value.payment_status = "partially_paid";
    return grand_total.value - formData.value.deposit;
  } else if (formData.value.deposit == 0 && formData.value.items.length != 0) {
    formData.value.payment_status = "not_paid";
    return grand_total.value - formData.value.deposit;
  }
});

// const sub_qty_total = computed(() => {
//   let totalsub = 0;
//   totalsub = formitem.value.quantity * formitem.value.selling_price;
//   formitem.value.total_amount = totalsub;
//   return totalsub;
// });

const enabled = ref(false);

const sub_qty_total = computed(() => {
  let totalsub = 0;
  if (formitem.value.days) {
    totalsub =
      formitem.value.quantity *
      formitem.value.selling_price *
      formitem.value.days;
    formitem.value.total_amount = totalsub;
    console.log(formitem.value.total_amount, "this is total amount");
    return totalsub;
  } else {
    totalsub = formitem.value.quantity * formitem.value.selling_price;
    formitem.value.total_amount = totalsub;
    return totalsub;
  }
});

const formitem = ref({
  reservation_id: "",
  product_type: "",
  product_id: "",
  service_date: "",
  quantity: "",
  days: "",
  duration: "",
  selling_price: "",
  pickup_location: "",
  checkin_date: "",
  room_number: "",
  checkout_date: "",
  pickup_time: "",
  customer_attachment: "",
  dropoff_location: "",
  route_plan: "",
  comment: "",
  car_id: "",
  car_list: [],
  reservation_status: "",
  payment_method: "",
  payment_status: "",
  exchange_rate: "",
  cost_price: "",
  total_amount: "",
  total_guest: "",
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
  } else if (formitem.value.product_type == "4") {
    await entranceStore.getSimpleListAction();
    productList.value = entrances.value.data;
    console.log(productList.value);
  } else if (formitem.value.product_type == "6") {
    await hotelStore.getSimpleListAction();
    productList.value = hotels.value.data;
    console.log(productList.value);
  } else if (formitem.value.product_type == "7") {
    await airlineStore.getSimpleListAction();
    productList.value = airlines.value.data;
    console.log(productList.value, "this is air");
  }
};

const customerFile = (e) => {
  let selectedFile = e.target.files[0];
  if (selectedFile) {
    formitem.value.customer_attachment = e.target.files[0];
    // featureImagePreview.value = URL.createObjectURL(selectedFile);
  }
};

const addNewitem = () => {
  if (enabledIn.value == true) {
    formitem.value.is_inclusive = 1;
  }
  formData.value.items.push(formitem.value);

  console.log(formData.value.items);
  formitem.value = {
    product_type: "",
    product_id: "",
    service_date: "",
    quantity: "1",
    days: "",
    duration: "",
    selling_price: "",
    car_id: "",
    car_list: [],
    pickup_location: "",
    pickup_time: "",
    customer_attachment: "",
    dropoff_location: "",
    route_plan: "",
    car_name: "",
    comment: "",
    reservation_status: "",
    payment_method: "",
    payment_status: "",
    exchange_rate: "",
    cost_price: "",
    total_amount: "",
    checkin_date: "",
    room_number: "",
    checkout_date: "",
  };
  todayVali.value = false;
  getSubTotal();
  addToggle();
};

const calculateRateRoom = () => {
  if (formitem.value.checkin_date && formitem.value.checkout_date) {
    calculateDaysBetween();
  }
  closedes();
};
const calculateDaysBetween = () => {
  if (formitem.value.checkin_date && formitem.value.checkout_date) {
    const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const startDateTimestamp = new Date(formitem.value.checkin_date).getTime();
    const endDateTimestamp = new Date(formitem.value.checkout_date).getTime();
    let result = Math.abs(
      Math.round((endDateTimestamp - startDateTimestamp) / oneDay)
    );
    formitem.value.days = result;
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

const removeFromitem = (indexGet, item, type) => {
  console.log(type, "this is type");

  formData.value.items.splice(indexGet, 1);

  console.log(formData.value.items);
};

const errors = ref(null);

const featureImageInput = ref(null);
const featureImagePreview = ref([]);

const openFileFeaturePicker = () => {
  featureImageInput.value.click();
};

const handlerFeatureFileChange = (e) => {
  let selectedFile = e.target.files;
  // if (selectedFile) {
  //   formData.value.receipt_image = e.target.files[0];
  //   featureImagePreview.value = URL.createObjectURL(selectedFile);
  // }
  for (let index = 0; index < selectedFile.length; index++) {
    formData.value.receipt_image.push(selectedFile[index]);
    featureImagePreview.value.push(URL.createObjectURL(selectedFile[index]));
  }
};

const removeFeatureSelectImage = (index) => {
  // formData.value.receipt_image = "";
  // featureImagePreview.value = null;
  formData.value.receipt_image.splice(index, 1);
  featureImagePreview.value.splice(index, 1);
  console.log(formData.value.receipt_image, "this is remove");
};

const nullData = ref(" ");

const statePast = computed(() => {
  if (enabled.value == true) {
    return true;
  } else {
    return false;
  }
});

const onSubmitHandler = async () => {
  const frmData = new FormData();
  frmData.append("_method", "PUT");
  frmData.append("payment_notes", formData.value.payment_notes);
  frmData.append("customer_id", formData.value.customer_id);
  frmData.append("sold_from", formData.value.sold_from);
  frmData.append("payment_method", formData.value.payment_method);
  frmData.append("bank_name", formData.value.bank_name);
  console.log(enabled, "this is status");
  // if (enabled.value == true) {
  //   frmData.append("is_past_info", "1");
  //   frmData.append("past_user_id", formData.value.past_user_id);
  //   frmData.append("past_crm_id", formData.value.past_crm_id);
  // } else {
  //   frmData.append("is_past_info", "0");
  // }
  if (enabledIn.value) {
    frmData.append("is_inclusive", enabledIn.value ? "1" : "0");
    formData.value.inclusive_name &&
      frmData.append("inclusive_name", formData.value.inclusive_name);
    formData.value.inclusive_quantity &&
      frmData.append("inclusive_quantity", formData.value.inclusive_quantity);
    formData.value.inclusive_rate &&
      frmData.append("inclusive_rate", formData.value.inclusive_rate);
    formData.value.inclusive_start_date &&
      frmData.append(
        "inclusive_start_date",
        formData.value.inclusive_start_date
      );
    formData.value.inclusive_end_date &&
      frmData.append("inclusive_end_date", formData.value.inclusive_end_date);
  }

  frmData.append("payment_status", formData.value.payment_status);
  frmData.append("booking_date", formData.value.booking_date);
  frmData.append("money_exchange_rate", formData.value.money_exchange_rate);
  console.log(formData.value.money_exchange_rate, "this is ex money");
  // frmData.append("crm_id", formData.value.crm_id);

  if (formData.value.discount == "" || formData.value.discount == 0) {
    frmData.append("discount", 0);
  } else {
    frmData.append("discount", percentageValue.value);
  }
  formData.value.comment && frmData.append("comment", formData.value.comment);
  // frmData.append("receipt_image", formData.value.receipt_image);
  frmData.append("sub_total", sub_total.value);
  frmData.append("grand_total", grand_total.value);
  frmData.append("deposit", formData.value.deposit);
  frmData.append("payment_currency", formData.value.payment_currency);
  if (balance_due.value) {
    frmData.append("balance_due", balance_due.value);
  } else {
    frmData.append("balance_due", 0);
  }
  frmData.append("balance_due_date", formData.value.balance_due_date);

  if (formData.value.confirmation_letter.length > 0) {
    for (let i = 0; i < formData.value.confirmation_letter.length; i++) {
      let file = formData.value.confirmation_letter[i];
      frmData.append("items[" + i + "][confirmation_letter]", file);
    }
  }
  if (formData.value.receipt_image.length != 0) {
    for (let x = 0; x < formData.value.receipt_image.length; x++) {
      frmData.append(
        "receipt_image[" + x + "]",
        formData.value.receipt_image[x]
      );
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
    } else if (
      formData.value.items[x].product_type == "6" ||
      formData.value.items[x].product_type == "App\\Models\\Hotel"
    ) {
      frmData.append("items[" + x + "][product_type]", `App\\Models\\Hotel`);
    } else if (
      formData.value.items[x].product_type == "7" ||
      formData.value.items[x].product_type == "App\\Models\\Airline"
    ) {
      frmData.append("items[" + x + "][product_type]", `App\\Models\\Airline`);
    }
  }
  for (var x = 0; x < formData.value.items.length; x++) {
    frmData.append(
      "items[" + x + "][product_id]",
      formData.value.items[x].product_id
    );
    if (
      !formData.value.items[x].days ||
      formData.value.items[x].days == undefined
    ) {
      frmData.append(
        "items[" + x + "][amount]",
        formData.value.items[x].selling_price * formData.value.items[x].quantity
      );
    } else if (
      formData.value.items[x].days ||
      formData.value.items[x].days != undefined
    ) {
      frmData.append(
        "items[" + x + "][amount]",
        formData.value.items[x].selling_price *
          formData.value.items[x].quantity *
          formData.value.items[x].days
      );
    }
  }
  for (var x = 0; x < formData.value.items.length; x++) {
    if (
      formData.value.items[x].product_type == "7" ||
      formData.value.items[x].product_type == "App\\Models\\Airline"
    ) {
      if (
        !formData.value.items[x].ticket_id ||
        formData.value.items[x].ticket_id == ""
      ) {
        frmData.append(
          "items[" + x + "][ticket_id]",
          formData.value.items[x].car_id
        );
      } else {
        frmData.append(
          "items[" + x + "][ticket_id]",
          formData.value.items[x].ticket_id
        );
      }
    } else if (
      formData.value.items[x].product_type == "6" ||
      formData.value.items[x].product_type == "App\\Models\\Hotel"
    ) {
      if (!formData.value.items[x].room_id) {
        frmData.append(
          "items[" + x + "][room_id]",
          formData.value.items[x].car_id
        );
      } else {
        frmData.append(
          "items[" + x + "][room_id]",
          formData.value.items[x].room_id
        );
      }
    } else if (
      formData.value.items[x].product_type == "4" ||
      formData.value.items[x].product_type == "App\\Models\\EntranceTicket"
    ) {
      if (!formData.value.items[x].variation_id) {
        frmData.append(
          "items[" + x + "][variation_id]",
          formData.value.items[x].car_id
        );
      } else {
        frmData.append(
          "items[" + x + "][variation_id]",
          formData.value.items[x].car_id
        );
      }
    } else if (
      formData.value.items[x].product_type == "2" ||
      formData.value.items[x].product_type == "App\\Models\\GroupTour"
    ) {
      frmData.append(
        "items[" + x + "][car_id]",
        formData.value.items[x].car_id
      );
    } else if (
      formData.value.items[x].product_type == "1" ||
      formData.value.items[x].product_type == "App\\Models\\PrivateVanTour"
    ) {
      if (!formData.value.items[x].car_id) {
        frmData.append(
          "items[" + x + "][car_id]",
          formData.value.items[x].car_id
        );
      } else {
        frmData.append(
          "items[" + x + "][car_id]",
          formData.value.items[x].car_id
        );
      }
    }
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
    formData.value.items[x].days &&
      frmData.append("items[" + x + "][days]", formData.value.items[x].days);
  }
  for (var x = 0; x < formData.value.items.length; x++) {
    formData.value.items[x].pickup_location &&
      frmData.append(
        "items[" + x + "][pickup_location]",
        formData.value.items[x].pickup_location
      );
  }
  for (var x = 0; x < formData.value.items.length; x++) {
    formData.value.items[x].checkin_date &&
      frmData.append(
        "items[" + x + "][checkin_date]",
        formData.value.items[x].checkin_date
      );
    formData.value.items[x].reservation_id != ""
      ? frmData.append(
          "items[" + x + "][reservation_id]",
          formData.value.items[x].reservation_id
        )
      : frmData.append("items[" + x + "][reservation_id]", null);
    formData.value.items[x].room_number &&
      frmData.append(
        "items[" + x + "][room_number]",
        formData.value.items[x].room_number
      );
    formData.value.items[x].total_guest &&
      frmData.append(
        "items[" + x + "][total_guest]",
        formData.value.items[x].total_guest
      );
  }
  for (var x = 0; x < formData.value.items.length; x++) {
    formData.value.items[x].checkout_date &&
      frmData.append(
        "items[" + x + "][checkout_date]",
        formData.value.items[x].checkout_date
      );
  }
  for (var x = 0; x < formData.value.items.length; x++) {
    formData.value.items[x].pickup_time &&
      frmData.append(
        "items[" + x + "][pickup_time]",
        formData.value.items[x].pickup_time
      );
    if (formData.value.items[x].customer_attachment) {
      frmData.append(
        "items[" + x + "][customer_attachment]",
        formData.value.items[x].customer_attachment
      );
    }
    if (formData.value.items[x].is_inclusive) {
      frmData.append(
        "items[" + x + "][is_inclusive]",
        formData.value.items[x].is_inclusive
      );
    }
    formData.value.items[x].dropoff_location &&
      frmData.append(
        "items[" + x + "][dropoff_location]",
        formData.value.items[x].dropoff_location
      );
    formData.value.items[x].route_plan &&
      frmData.append(
        "items[" + x + "][route_plan]",
        formData.value.items[x].route_plan
      );
    formData.value.items[x].duration &&
      frmData.append(
        "items[" + x + "][duration]",
        formData.value.items[x].duration
      );
    formData.value.items[x].special_request &&
      frmData.append(
        "items[" + x + "][special_request]",
        formData.value.items[x].special_request
      );
    formData.value.items[x].comment &&
      frmData.append(
        "items[" + x + "][comment]",
        formData.value.items[x].comment
      );
    formData.value.items[x].selling_price &&
      frmData.append(
        "items[" + x + "][selling_price]",
        formData.value.items[x].selling_price
      );
    formData.value.items[x].exchange_rate &&
      frmData.append(
        "items[" + x + "][exchange_rate]",
        formData.value.items[x].exchange_rate
      );
    formData.value.items[x].cost_price &&
      frmData.append(
        "items[" + x + "][cost_price]",
        formData.value.items[x].cost_price
      );
  }

  for (var x = 0; x < formData.value.items.length; x++) {
    formData.value.items[x].reservation_status
      ? frmData.append(
          "items[" + x + "][reservation_status]",
          formData.value.items[x].reservation_status
        )
      : frmData.append("items[" + x + "][reservation_status]", null);
  }
  for (var x = 0; x < formData.value.items.length; x++) {
    formData.value.items[x].payment_method &&
      frmData.append(
        "items[" + x + "][payment_method]",
        formData.value.items[x].payment_method
      );
  }
  for (var x = 0; x < formData.value.items.length; x++) {
    formData.value.items[x].payment_status &&
      frmData.append(
        "items[" + x + "][payment_status]",
        formData.value.items[x].payment_status
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
      crm_id: "",
      car_name: "",
      discount: "",
      comment: "",
      receipt_image: [],
      receipt_images: [],
      confirmation_letter: [],
      due_date: "",
      deposit: 0,
      balance_due_date: "",
      special_request: "",
      past_user_id: "",
      is_past_info: "",
      past_crm_id: "",
      is_inclusive: "",
      inclusive_name: "",
      inclusive_quantity: "",
      inclusive_rate: "",
      inclusive_start_date: "",
      inclusive_end_date: "",
    };
    balance_due.value = "";
    featureImagePreview.value = [];
    enabledIn.value = false;
    errors.value = null;
    toast.success(response.message);
    // router.push("/bookings/update/" + route.params.id);
    getDetail();
    // window.location.reload(true);
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
const roomType = ref([]);
const chooseCar = async (id) => {
  if (formitem.value.product_type == "1" && id) {
    const res = await vantourStore.getDetailAction(id);
    formitem.value.comment = res.result.long_description;
    console.log(res);
    carType.value = res.result.cars;
  } else if (formitem.value.product_type == "2") {
    const res = await grouptourStore.getDetailAction(id);
    formitem.value.comment = res.result.description;
    formitem.value.selling_price = res.result.price;
    carType.value = res.result.cars;
    console.log(res);
  } else if (formitem.value.product_type == "4") {
    const res = await entranceStore.getDetailAction(id);
    // formitem.value.comment = res.result.description;
    console.log(res, "choose");
    carType.value = res.result.variations;
    console.log(res.result.variations[0].price);
  } else if (formitem.value.product_type == "6") {
    const res = await hotelStore.getDetailAction(id);
    // formitem.value.comment = res.result.description;
    carType.value = res.result.rooms;
  } else if (formitem.value.product_type == "7") {
    const res = await airlineStore.getDetailAction(id);
    // formitem.value.comment = res.result.description;
    carType.value = res.result.tickets;
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
  } else if (type == "4") {
    const res = await entranceStore.getDetailAction(productId);
    formitem.value.car_list = res.result.variations;

    for (let i = 0; i < res.result.variations.length; i++) {
      if (res.result.variations[i].id == id) {
        formitem.value.selling_price = res.result.variations[i].price;
        formitem.value.cost_price = res.result.variations[i].cost_price;
        formitem.value.comment = res.result.variations[i].description;
        console.log(res.result.variations[i].price);
      }
    }
    console.log(res);
  } else if (type == "6") {
    const res = await hotelStore.getDetailAction(productId);
    formitem.value.car_list = res.result.rooms;
    const room = res.result.rooms.filter((r) => r.id === id)[0];
    formitem.value.room = room;
    formitem.value.selling_price = room.room_price;
    formitem.value.extra_price = room.extra_price;
    formitem.value.cost_price = room.cost;
    formitem.value.comment = room.description;
    console.log(formitem.value.room);
  } else if (type == "7") {
    const res = await airlineStore.getDetailAction(productId);
    formitem.value.car_list = res.result.tickets;
    console.log(formitem.value.car_list);
    for (let i = 0; i < res.result.tickets.length; i++) {
      if (res.result.tickets[i].id == id) {
        // formitem.value.selling_price = res.result.tickets[i].price;
        formitem.value.comment = res.result.tickets[i].description;
        console.log(res.result.tickets[i].description);
      }
    }
    console.log(res);
  }
};

const checkType = (product) => {
  if (product?.cars) {
    return product.cars;
  }
  if (product?.variations) {
    return product.variations;
  }
  if (product?.rooms) {
    return product.rooms;
  }
  if (product?.tickets) {
    return product.tickets;
  }
};

const paymentStatus = ref("");
const getDetail = async () => {
  try {
    const response = await bookingStore.getDetailAction(route.params.id);
    console.log(response, "this is response get");
    formData.value.customer_id = response.result.customer.id;
    if (response.result.is_inclusive == 1) {
      formData.value.is_inclusive = response.result.is_inclusive;
      enabledIn.value = true;
      formData.value.inclusive_name = response.result.inclusive_name;
      formData.value.inclusive_quantity = response.result.inclusive_quantity;
      formData.value.inclusive_rate = response.result.inclusive_rate;
      formData.value.inclusive_start_date =
        response.result.inclusive_start_date;
      formData.value.inclusive_end_date = response.result.inclusive_end_date;
    }
    formData.value.payment_notes = response.result.payment_notes;
    formData.value.sold_from = response.result.sold_from;
    formData.value.payment_method = response.result.payment_method;
    formData.value.bank_name = response.result.bank_name;

    formData.value.payment_status = response.result.payment_status;
    paymentStatus.value = response.result.payment_status;
    formData.value.payment_currency = response.result.payment_currency;
    formData.value.booking_date = response.result.booking_date;
    formData.value.money_exchange_rate = response.result.money_exchange_rate;
    formData.value.crm_id = response.result.crm_id;
    formData.value.comment = response.result.comment;
    formData.value.past_user_id = response.result.past_user_id
      ? response.result.past_user_id
      : "";
    formData.value.past_crm_id = response.result.past_crm_id
      ? response.result.past_crm_id
      : "";
    formData.value.is_past_info = response.result.is_past_info
      ? response.result.is_past_info
      : "";
    enabled.value = response.result.is_past_info == 1 ? true : false;
    console.log(enabled.value, formData.value.is_past_info, "this is shit");
    formData.value.special_request = response.result.special_request;
    depositStoreValue.value = response.result.deposit;
    if (formData.value.discount != "" || formData.value.discount != null) {
      formData.value.discount = response.result.discount;
    } else {
      formData.value.discount = 0;
    }
    formData.value.balance_due_date = response.result.balance_due_date;
    formData.value.deposit = response.result.deposit;
    // formData.value.receipt_images = response.result.receipts;
    // console.log(formData.value.receipt_images, "this is image");
    for (let i = 0; i < response.result.receipts?.length; i++) {
      let data = {
        id: response.result.receipts[i].id,
        image: response.result.receipts[i].image,
      };
      formData.value.receipt_images.push(data);
    }
    console.log(formData.value.receipt_images, "this is image");
    for (const x in response.result.items) {
      const itemData = {
        reservation_id: response.result.items[x].id,
        product_type: response.result.items[x].product_type,
        crm_id: response.result.items[x].crm_id,
        product_id: response.result.items[x].product_id,
        service_date: response.result.items[x].service_date,
        is_inclusive: response.result.is_inclusive == 1 ? 1 : 0,
        quantity: response.result.items[x].quantity,
        total_guest: response.result.items[x].total_guest,
        days: response.result.items[x].days
          ? response.result.items[x].days
          : "",
        duration: response.result.items[x].duration,
        selling_price: response.result.items[x].selling_price,
        comment:
          response.result.items[x].comment != "null"
            ? response.result.items[x].comment
            : "",
        special_request:
          response.result.items[x].special_request != "null"
            ? response.result.items[x].special_request
            : "",
        reservation_status: response.result.items[x].reservation_status,
        payment_method: response.result.items[x].payment_method,
        payment_status: response.result.items[x].payment_status,
        exchange_rate: response.result.items[x].exchange_rate,
        cost_price: response.result.items[x].cost_price,
        pickup_location:
          response.result.items[x].pickup_location != "null"
            ? response.result.items[x].pickup_location
            : "",
        pickup_time:
          response.result.items[x].pickup_time != "null"
            ? response.result.items[x].pickup_time
            : "",
        dropoff_location:
          response.result.items[x].dropoff_location != "null"
            ? response.result.items[x].dropoff_location
            : "",
        route_plan:
          response.result.items[x].route_plan != "null"
            ? response.result.items[x].route_plan
            : "",
        car_id: response.result.items[x].car
          ? response.result.items[x].car.id
          : "",
        variation_id: response.result.items[x].variation
          ? response.result.items[x].variation.id
          : "",
        car_name: response.result.items[x].car
          ? response.result.items[x].car.name
          : "",
        variation_name: response.result.items[x].variation
          ? response.result.items[x].variation.name
          : "",
        room_name: response.result.items[x].room
          ? response.result.items[x].room.name
          : "",
        room_id: response.result.items[x].room
          ? response.result.items[x].room.id
          : "",

        ticket_id:
          response.result.items[x].ticket == null &&
          response.result.items[x].product_type == "App\\Models\\Airline"
            ? response.result.items[x].product?.tickets[0]?.id
            : response.result.items[x].ticket?.id || "",
        //
        variation_type: checkType(response.result.items[x].product),
        checkin_date: response.result.items[x].checkin_date
          ? response.result.items[x].checkin_date
          : "",
        room_number: response.result.items[x].room_number
          ? response.result.items[x].room_number
          : "",
        checkout_date: response.result.items[x].checkout_date
          ? response.result.items[x].checkout_date
          : "",
        days: daysBetween(
          response.result.items[x].checkin_date,
          response.result.items[x].checkout_date
        ),

        total_amount: response.result.items[x].checkin_date
          ? totalAmountCheck(
              response.result.items[x].quantity,
              response.result.items[x].selling_price,
              daysBetween(
                response.result.items[x].checkin_date,
                response.result.items[x].checkout_date
              )
            )
          : response.result.items[x].selling_price *
            response.result.items[x].quantity,
      };
      formData.value.items.push(itemData);
      getSubTotal();
      console.log(itemData.ticket_id, "this is id");
    }
    choosePaymentBank();
    console.log(formData.value.items, "this is formData");
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

const totalAmountCheck = (q, s, d) => {
  let totalsub = 0;
  totalsub = q * s * d;
  console.log(q, s, d, "this is total amount");
  return totalsub;
};

const todayVali = ref("");
const getTodayDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  formData.value.booking_date = `${year}-${month}-${day}`;
};
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isBeforeToday = (date) => {
  const today = new Date();
  let selectDate = new Date(date);
  // console.log(formatDate(today) == formatDate(selectDate), "this is date ");

  return formatDate(selectDate) <= formatDate(today);
};
const isAfterToday = (date) => {
  const today = new Date();
  let selectDate = new Date(date);
  // console.log(formatDate(today) == formatDate(selectDate), "this is date ");

  return formatDate(selectDate) >= formatDate(today);
};

// const todayCheck = () => {
//   console.log(formitem.value.service_date);
//   todayVali.value = isAfterToday(formitem.value.service_date);
//   console.log(todayVali.value, "this is value");
// };

const todayCheck = () => {
  if (enabled.value) {
    todayVali.value = true;
  } else {
    console.log(formitem.value.service_date);
    todayVali.value = isAfterToday(formitem.value.service_date);
    console.log(todayVali.value, "this is value");
  }
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
const clickdetaildesToggle = (
  a,
  b,
  c,
  x,
  d,
  index,
  t,
  r,
  s,
  i,
  o,
  days,
  room,
  quantity,
  guest
) => {
  console.log(a, b, index);
  clickdetaildes.value = true;
  itemDes.value = a;
  itemSpecial.value = b;
  itemServiceDate.value = s;
  itemPickup.value = c;
  itemPickupTime.value = x;
  itemDropoff.value = d;
  indexValue.value = index;
  itemType.value = t;
  itemRoutePlan.value = r;
  itemCheckIn.value = i;
  itemCheckOut.value = o;
  itemDays.value = days;
  itemRoom.value = room;
  itemQ.value = quantity;
  itemGuest.value = guest;
  console.log(itemCheckIn.value, itemCheckOut.value);
};
const itemType = ref("");
const itemRoutePlan = ref("");
const itemDays = ref("");
const indexValue = ref("");
const itemPickup = ref("");
const itemDropoff = ref("");
const itemPickupTime = ref("");
const itemCheckIn = ref("");
const itemCheckOut = ref("");
const itemRoom = ref("");
const itemQ = ref("");
const itemIs = ref("");
const itemGuest = ref("");

const itemCheckoutCheck = () => {
  if (!itemCheckOut.value || itemCheckOut.value < itemCheckIn.value) {
    itemCheckOut.value = "";
    console.log("this is vali");
  }
};

const clickdetaildesUpdate = (x) => {
  formData.value.items[x].comment = itemDes.value;
  formData.value.items[x].special_request = itemSpecial.value;
  formData.value.items[x].service_date = itemServiceDate.value;
  formData.value.items[x].pickup_location = itemPickup.value;
  formData.value.items[x].pickup_time = itemPickupTime.value;
  formData.value.items[x].checkin_date = itemCheckIn.value;
  formData.value.items[x].room_number = itemRoom.value;
  formData.value.items[x].quantity = itemQ.value;
  formData.value.items[x].total_guest = itemGuest.value;
  formData.value.items[x].checkout_date = itemCheckOut.value;
  formData.value.items[x].dropoff_location = itemDropoff.value;
  formData.value.items[x].route_plan = itemRoutePlan.value;
  if (itemCheckIn.value && itemCheckOut.value) {
    let oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    let startDateTimestamp = new Date(itemCheckIn.value).getTime();
    let endDateTimestamp = new Date(itemCheckOut.value).getTime();
    let result = Math.abs(
      Math.round((endDateTimestamp - startDateTimestamp) / oneDay)
    );
    formData.value.items[x].days = result;
  }
  let totalsub;
  if (formData.value.items[x].days) {
    totalsub =
      formData.value.items[x].quantity *
      formData.value.items[x].selling_price *
      formData.value.items[x].days;
  } else {
    totalsub =
      formData.value.items[x].quantity * formData.value.items[x].selling_price;
  }
  formData.value.items[x].total_amount = totalsub;
  clickdetaildes.value = false;
  console.log(
    formData.value.items[x].total_amount,
    formData.value.items[x].quantity,
    formData.value.items[x].selling_price,
    formData.value.items[x].days,

    "this is total amount"
  );
  getSubTotal();
};

const itemSpecial = ref("");
const itemServiceDate = ref("");

const clickdetaildesClose = () => {
  clickdetaildes.value = false;
  itemDes.value = "";
  itemSpecial.value = "";
  itemServiceDate.value = "";
  itemPickup.value = "";
  itemDropoff.value = "";
  itemPickupTime.value = "";
  itemCheckIn.value = "";
  itemCheckOut.value = "";
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

const checkCondition = ref(false);

const allowCreate = computed(() => {
  console.log(checkCondition.value, "this is check");
  if (
    formData.value.items.length != 0 &&
    formData.value.deposit != 0 &&
    formData.value.receipt_image.length != 0
  ) {
    return true;
  } else if (formData.value.items.length != 0 && formData.value.deposit == 0) {
    return true;
  } else if (formData.value.items.length != 0 && checkCondition.value) {
    return true;
  } else {
    return false;
  }
});

const depositStoreValue = ref("");
const allowImage = ref(true);
const allowDeposite = computed(() => {
  if (formData.value.deposit == 0) {
    return false;
  } else if (
    formData.value.deposit == depositStoreValue.value &&
    formData.value.deposit != 0
  ) {
    console.log("this is true");
    allowImage.value = false;
    return true;
  } else {
    allowImage.value = true;
    return false;
  }
});

const strippedNumber = (text) => {
  // Split the string by "_", and get the second part (index 1)
  return text.split("_")[1];
};

const chooseSellingPrice = (id, arr, index) => {
  console.log("this is selling price", id, arr, index);
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].id == id) {
      if (typeof formData.value.items[index].selling_price === "number") {
        formData.value.items[index].selling_price = arr[i].price;
      }
      console.log(
        typeof formData.value.items[index].selling_price,
        "this is type"
      );
    }
  }
};

const deleteImage = async (id) => {
  await bookingStore.deleteBookingImage(id);
  toast.success("success delete sale Image");
  window.location.reload();
  await getDetail();
};

const hotelQ = (t, d, q) => {
  let data = 0;
  if (t == 6 || t == "App\\Models\\Hotel") {
    return (data = d * q);
  }
};

const openPaid = () => {
  window.open(
    // "https://api-blog.thanywhere.com/admin/bookings/" +
    //   route.params.id +
    //   "/receipt?paid=1"
    import.meta.env.VITE_API_URL +
      "/bookings/" +
      route.params.id +
      "/receipt?paid=1"
  );
};

const checkCheckout = () => {
  if (
    !formitem.value.checkout_date ||
    formitem.value.checkout_date < formitem.value.checkin_date
  ) {
    formitem.value.checkout_date = "";
    console.log("this is vali");
  }
};

onMounted(async () => {
  loadingState.value = true;
  await adminStore.getSimpleListAction();
  await vantourStore.getSimpleListAction();
  await grouptourStore.getSimpleListAction();
  await airportStore.getSimpleListAction();
  await entranceStore.getSimpleListAction();
  await inclusiveStore.getSimpleListAction();
  await airlineStore.getSimpleListAction();
  await customerStore.getSimpleListAction();
  await hotelStore.getSimpleListAction();
  await getDetail();
  // url.value =
  //   "https://api-blog.thanywhere.com/admin/bookings/" +
  //   route.params.id +
  //   "/receipt";
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
        class="flex items-center justify-center w-full h-screen"
      >
        <div class="flex items-center justify-center space-x-4">
          <p class="">Loading , Please wait</p>
          <div role="status">
            <svg
              aria-hidden="true"
              class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-[#ff613c]"
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
        class="grid grid-cols-3 col-span-2 gap-3 p-6 mb-5 rounded-lg shadow-sm"
      >
        <div class="flex items-center justify-between col-span-3 mb-5">
          <h3
            class="text-2xl font-medium text-[#ff613c]"
            v-if="action == 'view'"
          >
            View Sale
          </h3>
          <h3
            class="text-2xl font-medium text-[#ff613c]"
            v-if="action == 'edit'"
          >
            Update Sale
          </h3>
          <div
            class="space-x-3 px-2 text-xs py-1.5 hover:shadow-lg border shadow-sm rounded cursor-pointer bg-[#ff613c] text-white"
            @click="customerOpenH"
          >
            <i class="fa-solid fa-user-plus"></i> Create New Customer
          </div>
        </div>
        <div class="col-span-3">
          <div class="grid grid-cols-3">
            <div class="grid grid-cols-2 col-span-2 gap-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="">
                  <p class="text-[#ff613c] text-xs mb-2">Customer Name</p>

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
                  <p class="text-[#ff613c] text-xs mb-2">Sale Date</p>
                  <input
                    v-model="formData.booking_date"
                    :class="{
                      'bg-white rounded-lg': formData.booking_date !== '',
                    }"
                    type="date"
                    id="title"
                    class="w-full h-10 px-4 py-2 text-xs text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-gray-300"
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
                  <p class="text-[#ff613c] text-xs mb-2">Sold From</p>
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

                <div>
                  <p class="text-[#ff613c] text-xs mb-2">Payment Currency</p>
                  <v-select
                    v-model="formData.payment_currency"
                    class="style-chooser"
                    :class="{
                      'bg-white rounded-lg': formData.payment_currency !== '',
                    }"
                    :options="payment_currency"
                    @option:selected="choosePaymentBank"
                    label="name"
                    :clearable="false"
                    :reduce="(d) => d.name"
                  ></v-select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="">
                  <p class="text-[#ff613c] text-xs mb-2">Bank Name</p>
                  <v-select
                    v-model="formData.bank_name"
                    class="style-chooser bg-white rounded-lg"
                    :options="payment"
                    label="name"
                    :clearable="false"
                    :reduce="(d) => d.name"
                  ></v-select>
                </div>
                <div class="">
                  <p class="text-[#ff613c] text-xs mb-2">Payment Method</p>
                  <v-select
                    v-model="formData.payment_method"
                    class="style-chooser bg-white rounded-lg"
                    :options="paymentArray"
                    label="name"
                    :clearable="false"
                    :reduce="(d) => d.name"
                  ></v-select>
                </div>
                <div>
                  <p class="text-[#ff613c] text-xs mb-2">Payment Status</p>

                  <input
                    v-model="formData.payment_status"
                    :class="{
                      'bg-white rounded-lg': formData.payment_status !== '',
                    }"
                    type="text"
                    disabled
                    id="title"
                    class="w-full h-10 px-4 py-2 text-xs text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-gray-300"
                  />
                </div>
                <div>
                  <p class="text-[#ff613c] text-xs mb-2">CRMID</p>

                  <input
                    v-model="formData.crm_id"
                    type="text"
                    id="title"
                    disabled
                    class="w-full h-10 px-4 py-2 text-xs bg-transparent text-gray-900 rounded-lg focus:outline-none"
                  />
                </div>
                <div class="relative">
                  <p class="mb-3 text-xs text-[#ff613c]">Is Past Info</p>

                  <Switch
                    v-model="enabled"
                    :class="enabled ? ' bg-orange-600' : 'bg-gray-500'"
                    class="relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                  >
                    <span class="sr-only">Use setting</span>
                    <span
                      aria-hidden="true"
                      :class="enabled ? 'translate-x-9' : 'translate-x-0'"
                      class="pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                    />
                  </Switch>
                  <!-- <p class="text-xs text-red-600 mt-3" v-if="!statePast">
                    # When it is current , you can't change past
                  </p> -->
                </div>
                <div class="relative">
                  <p class="mb-3 text-xs text-[#ff613c]">Is Inclusive</p>

                  <Switch
                    v-model="enabledIn"
                    :class="enabledIn ? ' bg-orange-600' : 'bg-gray-500'"
                    class="relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                  >
                    <span class="sr-only">Use setting</span>
                    <span
                      aria-hidden="true"
                      :class="enabledIn ? 'translate-x-9' : 'translate-x-0'"
                      class="pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                    />
                  </Switch>
                </div>
                <p class="col-span-2 text-red-600 text-xs">
                  # noted : if this sale is inclusive , first switch
                  is_inclusive and add items krup.
                </p>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-[#ff613c] text-xs mb-2">Balance Due Date</p>

                  <input
                    v-model="formData.balance_due_date"
                    type="date"
                    id="title"
                    :class="
                      formData.balance_due_date != ''
                        ? 'bg-white'
                        : ' bg-transparent'
                    "
                    class="w-full h-10 px-4 py-2 text-xs text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-gray-300"
                  />
                  <p
                    v-if="errors?.balance_due_date"
                    class="mt-1 text-sm text-red-600"
                  >
                    {{ errors.balance_due_date[0] }}
                  </p>
                </div>
                <div>
                  <p class="text-[#ff613c] text-xs mb-2">Money Exchange Rate</p>
                  <input
                    v-model="formData.money_exchange_rate"
                    v-if="paymentValid"
                    type="number"
                    id="title"
                    class="w-full bg-white h-10 px-4 py-2 text-xs text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-gray-300"
                  />
                  <input
                    v-if="!paymentValid"
                    disabled
                    type="number"
                    id="title"
                    class="w-full bg-gray-100 h-10 px-4 py-2 text-xs text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-gray-300"
                  />
                  <p
                    v-if="errors?.money_exchange_rate"
                    class="mt-1 text-sm text-red-600"
                  >
                    {{ errors.money_exchange_rate[0] }}
                  </p>
                </div>
              </div>
            </div>
            <div class="col-span-1 space-y-4 text-end">
              <p class="text-[#ff613c] text-xs">Balance Due</p>
              <p class="text-[#ff613c] font-bold text-4xl tracking-wide">
                {{ balance_due }} thb
              </p>

              <!-- <a :href="urlPaid"> -->
              <h2
                class="border border-[#ff613c] inline-block py-2 px-4 cursor-pointer"
                @click="openPaid()"
              >
                <p class="text-[#ff613c] text-sm">Receive Payment</p>
              </h2>
              <!-- </a> -->
            </div>
            <div
              class="col-span-3"
              :class="statePast || stateInclusive ? 'pt-4' : ''"
            >
              <div class="grid grid-cols-6 gap-4">
                <div v-if="authStore.isCashier && statePast">
                  <p class="mb-2 text-xs text-[#ff613c]">Past User ID</p>

                  <v-select
                    v-model="formData.past_user_id"
                    class="style-chooser bg-white rounded-lg"
                    :options="admin?.data"
                    label="name"
                    :clearable="false"
                    :reduce="(d) => d.id"
                  ></v-select>
                </div>
                <div v-if="authStore.isCashier && statePast">
                  <p class="mb-2 text-xs text-[#ff613c]">Past CRM ID</p>

                  <input
                    v-model="formData.past_crm_id"
                    type="text"
                    id="title"
                    class="w-full bg-white h-10 px-4 py-2 text-xs text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-gray-300"
                  />
                </div>
                <div v-if="stateInclusive" class="col-span-1">
                  <p class="mb-2 text-xs text-[#ff613c]">Inclusive Name</p>

                  <input
                    type="text"
                    v-model="formData.inclusive_name"
                    id="title"
                    class="w-full bg-white h-10 px-4 py-2 text-xs text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-gray-300"
                  />
                </div>
                <div v-if="stateInclusive" class="col-span-1">
                  <p class="mb-2 text-xs text-[#ff613c]">Quantity Inclusive</p>
                  <input
                    type="number"
                    v-model="formData.inclusive_quantity"
                    id="title"
                    class="w-full bg-white h-10 px-4 py-2 text-xs text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-gray-300"
                  />
                </div>
                <div v-if="stateInclusive" class="col-span-1">
                  <p class="mb-2 text-xs text-[#ff613c]">Rate Per Person</p>

                  <input
                    type="number"
                    v-model="formData.inclusive_rate"
                    id="title"
                    class="w-full bg-white h-10 px-4 py-2 text-xs text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-gray-300"
                  />
                </div>
                <div v-if="stateInclusive" class="col-span-1">
                  <p class="mb-2 text-xs text-[#ff613c]">
                    Service Date (start)
                  </p>

                  <input
                    type="date"
                    v-model="formData.inclusive_start_date"
                    id="title"
                    class="w-full bg-white h-10 px-4 py-2 text-xs text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-gray-300"
                  />
                </div>
                <div v-if="stateInclusive" class="col-span-1">
                  <p class="mb-2 text-xs text-[#ff613c]">Service Date (end)</p>

                  <input
                    type="date"
                    v-model="formData.inclusive_end_date"
                    id="title"
                    class="w-full bg-white h-10 px-4 py-2 text-xs text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-gray-300"
                  />
                </div>
              </div>
            </div>
            <div class="grid-cols-1 col-span-3 pt-10 gird">
              <div
                class="flex justify-end mb-3 text-sm font-semibold cursor-pointer"
              >
                <p @click="addToggle" v-if="!addComment">+ Add Item</p>
                <p @click="addToggle" v-if="addComment">- Remove Item</p>
              </div>
              <div class="col-span-1 p-3 bg-white rounded">
                <div class="col-span-1">
                  <Modal :isOpen="desopen" @closeModal="desopen = false">
                    <DialogPanel
                      class="w-full max-w-md p-4 space-y-2 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl"
                    >
                      <DialogTitle
                        as="h3"
                        class="mb-5 font-medium leading-6 text-gray-900 text-md"
                      >
                        Description & Special Request
                      </DialogTitle>
                      <div class="grid grid-cols-1 py-4 space-y-2">
                        <p class="text-xs">Description</p>
                        <textarea
                          name=""
                          id=""
                          class="px-4 py-4 text-sm border border-gray-300 rounded-sm focus:outline-none"
                          cols="30"
                          rows="5"
                          v-model="formitem.comment"
                        ></textarea>
                      </div>
                      <div class="grid grid-cols-1 py-4 space-y-2">
                        <p class="text-xs">Special request</p>
                        <textarea
                          name=""
                          id=""
                          class="px-4 py-4 text-sm border border-gray-300 rounded-sm focus:outline-none"
                          cols="30"
                          rows="5"
                          v-model="formitem.special_request"
                        ></textarea>
                      </div>
                      <div
                        class="grid grid-cols-1 space-y-2"
                        v-if="
                          formitem.product_type == '6' ||
                          formitem.product_type == 'App\\Models\\Hotel'
                        "
                      >
                        <p class="text-xs">Total Number of Room</p>
                        <input
                          type="text"
                          v-model="formitem.quantity"
                          name=""
                          class="px-4 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none"
                          id=""
                          placeholder="xxx , xxx , xxx"
                        />
                      </div>
                      <div
                        class="grid grid-cols-1 space-y-2"
                        v-if="
                          formitem.product_type == '6' ||
                          formitem.product_type == 'App\\Models\\Hotel'
                        "
                      >
                        <p class="text-xs">Number of Guest</p>
                        <input
                          type="text"
                          v-model="formitem.total_guest"
                          name=""
                          class="px-4 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none"
                          id=""
                        />
                      </div>
                      <div
                        class="grid grid-cols-1 space-y-2"
                        v-if="
                          formitem.product_type == '1' ||
                          formitem.product_type == '3' ||
                          formitem.product_type ==
                            'App\\Models\\PrivateVanTour' ||
                          formitem.product_type == 'App\\Models\\AirportPickup'
                        "
                      >
                        <p class="text-xs">Pickup Location</p>
                        <textarea
                          name=""
                          id=""
                          class="px-4 py-4 text-sm border border-gray-300 rounded-sm focus:outline-none"
                          cols="30"
                          rows="1"
                          v-model="formitem.pickup_location"
                        ></textarea>
                      </div>
                      <div
                        class="grid grid-cols-1 space-y-2"
                        v-if="
                          formitem.product_type == '1' ||
                          formitem.product_type == '3' ||
                          formitem.product_type ==
                            'App\\Models\\PrivateVanTour' ||
                          formitem.product_type == 'App\\Models\\AirportPickup'
                        "
                      >
                        <p class="text-xs">Pickup Time</p>
                        <input
                          type="time"
                          name=""
                          v-model="formitem.pickup_time"
                          class="px-4 py-4 text-sm border border-gray-300 rounded-sm focus:outline-none"
                          id=""
                        />
                      </div>
                      <div
                        class="grid grid-cols-1 space-y-2"
                        v-if="
                          formitem.product_type == '1' ||
                          formitem.product_type == '3' ||
                          formitem.product_type ==
                            'App\\Models\\PrivateVanTour' ||
                          formitem.product_type == 'App\\Models\\AirportPickup'
                        "
                      >
                        <p class="text-xs">Dropoff Location</p>
                        <textarea
                          name=""
                          id=""
                          class="px-4 py-4 text-sm border border-gray-300 rounded-sm focus:outline-none"
                          cols="30"
                          rows="1"
                          v-model="formitem.dropoff_location"
                        ></textarea>
                      </div>
                      <div
                        class="grid grid-cols-1 space-y-2"
                        v-if="
                          formitem.product_type == '1' ||
                          formitem.product_type == '3' ||
                          formitem.product_type ==
                            'App\\Models\\PrivateVanTour' ||
                          formitem.product_type == 'App\\Models\\AirportPickup'
                        "
                      >
                        <p class="text-xs">Route Plan</p>
                        <textarea
                          name=""
                          id=""
                          class="px-4 py-4 text-sm border border-gray-300 rounded-sm focus:outline-none"
                          cols="30"
                          rows="1"
                          v-model="formitem.route_plan"
                        ></textarea>
                      </div>
                      <div
                        class="grid grid-cols-1 space-y-2"
                        v-if="
                          formitem.product_type == '3' ||
                          formitem.product_type == 'App\\Models\\AirportPickup'
                        "
                      >
                        <p class="text-xs">Customer Attachment</p>
                        <input
                          type="file"
                          name=""
                          @change="customerFile"
                          id=""
                        />
                      </div>
                      <div
                        class="grid grid-cols-1 space-y-2"
                        v-if="
                          formitem.product_type == '6' ||
                          formitem.product_type == 'App\\Models\\Hotel'
                        "
                      >
                        <p class="text-xs">Checkin Date</p>
                        <input
                          type="date"
                          class="p-2 border text-sm border-gray-300 rounded-sm focus:outline-none"
                          id=""
                          v-model="formitem.checkin_date"
                        />
                      </div>
                      <div
                        class="grid grid-cols-1 space-y-2"
                        v-if="
                          formitem.product_type == '6' ||
                          formitem.product_type == 'App\\Models\\Hotel'
                        "
                      >
                        <p class="text-xs">Checkout Date</p>
                        <input
                          type="date"
                          class="p-2 border text-sm border-gray-300 rounded-sm focus:outline-none"
                          id=""
                          v-model="formitem.checkout_date"
                          @change="checkCheckout"
                        />
                      </div>
                      <div
                        class="grid grid-cols-1 space-y-2"
                        v-if="
                          formitem.product_type == '6' ||
                          formitem.product_type == 'App\\Models\\Hotel'
                        "
                      >
                        <p class="text-xs">Days</p>
                        <input
                          type="number"
                          disabled
                          class="p-2 border text-sm border-gray-300 rounded-sm focus:outline-none"
                          id=""
                          v-model="formitem.days"
                        />
                      </div>
                      <div class="flex items-center justify-between">
                        <button @click="closedes" class="text-sm">close</button>
                        <button
                          @click="calculateRateRoom"
                          class="text-sm px-2 py-1 bg-[#ff613c] text-white rounded"
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
                      <div class="flex items-center justify-end">
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
                      class="w-full max-w-md p-4 space-y-2 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl"
                    >
                      <DialogTitle
                        as="h3"
                        class="mb-5 font-medium leading-6 text-gray-900 text-md"
                      >
                        Detail Description & Special Request
                      </DialogTitle>
                      <div class="grid grid-cols-1 py-4">
                        <p class="text-xs">Description</p>
                        <textarea
                          name=""
                          id=""
                          class="px-4 py-4 text-sm border border-gray-300 rounded-sm focus:outline-none"
                          cols="30"
                          rows="5"
                          v-model="itemDes"
                        ></textarea>
                      </div>
                      <div class="grid grid-cols-1 py-4 space-y-2">
                        <p class="text-xs">Special request</p>
                        <textarea
                          name=""
                          id=""
                          class="px-4 py-4 text-sm border border-gray-300 rounded-sm focus:outline-none"
                          cols="30"
                          rows="5"
                          v-model="itemSpecial"
                        ></textarea>
                      </div>
                      <div
                        class="grid grid-cols-1 space-y-2"
                        v-if="
                          itemType == '6' || itemType == 'App\\Models\\Hotel'
                        "
                      >
                        <p class="text-xs">Total Number of Room</p>
                        <input
                          v-if="itemIs == 0"
                          v-model="itemQ"
                          type="text"
                          name=""
                          class="px-4 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none"
                          id=""
                          placeholder="xxx , xxx , xxx"
                        />
                        <input
                          v-if="itemIs == 1"
                          v-model="itemQ"
                          disabled
                          type="text"
                          name=""
                          class="px-4 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none"
                          id=""
                          placeholder="xxx , xxx , xxx"
                        />
                      </div>
                      <div
                        class="grid grid-cols-1 space-y-2"
                        v-if="
                          itemType == '6' || itemType == 'App\\Models\\Hotel'
                        "
                      >
                        <p class="text-xs">Number of Guest</p>
                        <input
                          v-model="itemGuest"
                          type="text"
                          name=""
                          class="px-4 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none"
                          id=""
                        />
                      </div>
                      <div
                        class="grid grid-cols-1 space-y-2"
                        v-if="
                          itemType == '1' ||
                          itemType == '3' ||
                          itemType == 'App\\Models\\PrivateVanTour' ||
                          itemType == 'App\\Models\\AirportPickup'
                        "
                      >
                        <p class="text-sm">Pickup Location</p>
                        <textarea
                          name=""
                          id=""
                          class="px-4 py-4 text-sm border border-gray-300 rounded-sm focus:outline-none"
                          cols="30"
                          rows="1"
                          v-model="itemPickup"
                        ></textarea>
                      </div>
                      <div
                        class="grid grid-cols-1 space-y-2"
                        v-if="
                          itemType == '1' ||
                          itemType == '3' ||
                          itemType == 'App\\Models\\PrivateVanTour' ||
                          itemType == 'App\\Models\\AirportPickup'
                        "
                      >
                        <p class="text-sm">Pickup Time</p>

                        <input
                          type="time"
                          name=""
                          v-model="itemPickupTime"
                          class="px-4 py-4 text-sm border border-gray-300 rounded-sm focus:outline-none"
                          id=""
                        />
                      </div>
                      <div
                        class="grid grid-cols-1 space-y-2"
                        v-if="
                          itemType == '1' ||
                          itemType == '3' ||
                          itemType == 'App\\Models\\PrivateVanTour' ||
                          itemType == 'App\\Models\\AirportPickup'
                        "
                      >
                        <p class="text-sm">Dropoff Location</p>
                        <textarea
                          name=""
                          id=""
                          class="px-4 py-4 text-sm border border-gray-300 rounded-sm focus:outline-none"
                          cols="30"
                          rows="1"
                          v-model="itemDropoff"
                        ></textarea>
                      </div>
                      <div
                        class="grid grid-cols-1 space-y-2"
                        v-if="
                          itemType == '1' ||
                          itemType == '3' ||
                          itemType === 'App\\Models\\PrivateVanTour' ||
                          itemType == 'App\\Models\\AirportPickup'
                        "
                      >
                        <p class="text-sm">Route Plan</p>
                        <textarea
                          name=""
                          id=""
                          class="px-4 py-4 text-sm border border-gray-300 rounded-sm focus:outline-none"
                          cols="30"
                          rows="1"
                          v-model="itemRoutePlan"
                        ></textarea>
                      </div>
                      <div
                        class="grid grid-cols-1 space-y-2"
                        v-if="
                          itemType == '6' || itemType == 'App\\Models\\Hotel'
                        "
                      >
                        <p class="text-sm">Checkin Date</p>
                        <input
                          type="date"
                          class="p-2 border border-gray-300 focus:outline-none rounded-sm text-xs"
                          v-model="itemCheckIn"
                          id=""
                        />
                      </div>
                      <div
                        class="grid grid-cols-1 space-y-2"
                        v-if="
                          itemType == '6' || itemType == 'App\\Models\\Hotel'
                        "
                      >
                        <p class="text-sm">Checkout Date</p>
                        <input
                          type="date"
                          class="p-2 border border-gray-300 focus:outline-none rounded-sm text-xs"
                          v-model="itemCheckOut"
                          @change="itemCheckoutCheck"
                          id=""
                        />
                      </div>
                      <div
                        class="grid grid-cols-1 space-y-2"
                        v-if="
                          itemType == '6' || itemType == 'App\\Models\\Hotel'
                        "
                      >
                        <p class="text-xs">Days</p>
                        <input
                          type="number"
                          disabled
                          class="p-2 border text-sm border-gray-300 rounded-sm focus:outline-none"
                          id=""
                          v-model="itemDays"
                        />
                      </div>
                      <!-- <div
                        class="grid grid-cols-1 space-y-2"
                        v-if="itemIs == 1"
                      >
                        <p class="text-xs">Change Quantity</p>
                        <input
                          type="number"
                          v-model="itemQ"
                          name=""
                          class="px-4 py-4 text-sm border border-gray-300 rounded-sm focus:outline-none"
                          id=""
                          placeholder="xx"
                        />
                      </div> -->
                      <div class="flex items-center justify-between">
                        <button @click="clickdetaildesClose" class="text-sm">
                          close
                        </button>
                        <button
                          @click="clickdetaildesUpdate(indexValue)"
                          class="text-sm px-2 py-1 bg-[#ff613c] text-white rounded"
                        >
                          update
                        </button>
                      </div>
                    </DialogPanel>
                  </Modal>
                  <div class="px-6 pt-3">
                    <table class="w-full">
                      <thead>
                        <tr class="border-b border-gray-300">
                          <th
                            class="py-2 text-start px-4 text-xs text-[#ff613c]"
                          ></th>

                          <th
                            class="border-r py-2 text-start px-4 border-gray-300 text-xs text-[#ff613c]"
                          >
                            P Type
                          </th>
                          <th
                            class="border-r py-2 text-start px-4 border-gray-300 text-xs text-[#ff613c]"
                          >
                            Product Name
                          </th>
                          <th
                            class="border-r py-2 text-start px-4 border-gray-300 text-xs text-[#ff613c]"
                          >
                            Variation
                          </th>
                          <th
                            class="border-r py-2 text-start px-4 border-gray-300 text-xs text-[#ff613c]"
                          >
                            Service Date
                          </th>
                          <th
                            class="border-r py-2 text-start px-4 border-gray-300 text-xs text-[#ff613c]"
                          >
                            Rate
                          </th>
                          <th
                            class="border-r py-2 text-start px-4 border-gray-300 text-xs text-[#ff613c]"
                          >
                            Quantity
                          </th>
                          <th
                            class="border-r py-2 text-start px-4 border-gray-300 text-xs text-[#ff613c]"
                          >
                            Amount
                          </th>
                          <th
                            class="py-2 text-start px-4 border-gray-300 text-xs text-[#ff613c]"
                          ></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="rounded-lg" v-if="addComment">
                          <td
                            colspan="2"
                            class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
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
                            class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
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
                            class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
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
                            <div
                              class=""
                              v-if="
                                formitem.product_type == '4' ||
                                formitem.product_type == '6'
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
                            <div class="" v-if="formitem.product_type == '7'">
                              <v-select
                                v-model="formitem.car_id"
                                class="style-chooser"
                                :options="carType"
                                label="price"
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
                            class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
                          >
                            <input
                              type="date"
                              v-model="formitem.service_date"
                              @change="todayCheck"
                              id="title"
                              class="px-1 py-1.5 focus:outline-none text-xs rounded"
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
                            class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
                          >
                            <p v-if="formitem.product_type != '7'">
                              {{ formitem.selling_price }}
                            </p>
                            <input
                              v-if="formitem.product_type == '7'"
                              type="number"
                              v-model="formitem.selling_price"
                              class="border-gray-400 px-1 py-1.5 max-w-[50px] focus:outline-none rounded border"
                            />
                          </td>
                          <td
                            v-if="
                              formitem.product_type == '6' ||
                              formitem.product_type == 'App\\Models\\Hotel'
                            "
                            class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
                          >
                            <p>
                              {{
                                hotelQ(
                                  formitem.product_type,
                                  formitem.days,
                                  formitem.quantity
                                )
                              }}
                            </p>
                          </td>
                          <td
                            v-if="
                              formitem.product_type != '6' &&
                              formitem.product_type != 'App\\Models\\Hotel'
                            "
                            class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
                          >
                            <input
                              type="number"
                              v-model="formitem.quantity"
                              class="border-gray-400 px-1 py-1.5 max-w-[50px] focus:outline-none rounded border"
                            />
                          </td>
                          <td
                            class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
                          >
                            <p>{{ sub_qty_total }}</p>
                          </td>

                          <td
                            class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
                          >
                            <button
                              class="mr-4 text-sm text-blue-600"
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
                          class="text-xs text-red-500 border-b border-gray-300"
                        >
                          <td
                            class="pb-2 text-right"
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
                            v-if="item.crm_id"
                            class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
                          >
                            <p v-if="item.is_inclusive == 0">
                              {{ strippedNumber(item.crm_id) }}
                            </p>
                            <p
                              v-if="item.is_inclusive == 1"
                              class="bg-orange-400 p-1 rounded"
                            >
                              {{ strippedNumber(item.crm_id) }}
                            </p>
                          </td>
                          <td
                            v-if="!item.crm_id && !item.is_inclusive"
                            class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
                          >
                            -
                          </td>
                          <td
                            v-if="!item.crm_id && item.is_inclusive == 1"
                            class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
                          >
                            <i
                              v-if="item.is_inclusive == 1"
                              class="text-lg text-orange-600 fa-solid fa-circle-info"
                            ></i>
                          </td>
                          <td
                            class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
                          >
                            <div class="col-span-1">
                              <div
                                class="py-2 text-gray-600"
                                v-if="
                                  item.product_type ==
                                    'App\\Models\\PrivateVanTour' ||
                                  item.product_type == '1'
                                "
                              >
                                <p class="inline-block text-sm">
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
                                <p class="inline-block text-sm">Group Tour</p>
                              </div>
                              <div
                                class="py-2 text-gray-600"
                                v-if="
                                  item.product_type ==
                                    'App\\Models\\AirportPickup' ||
                                  item.product_type == '3'
                                "
                              >
                                <p class="inline-block text-sm">
                                  Airport Pickup
                                </p>
                              </div>
                              <div
                                class="py-2 text-gray-600 text-md text-bold"
                                v-if="
                                  item.product_type ==
                                    'App\\Models\\EntranceTicket' ||
                                  item.product_type == '4'
                                "
                              >
                                <p class="inline-block text-sm">
                                  Entrance Ticket
                                </p>
                              </div>
                              <div
                                class="py-2 text-gray-600 text-md text-bold"
                                v-if="
                                  item.product_type ==
                                    'App\\Models\\Inclusive' ||
                                  item.product_type == '5'
                                "
                              >
                                <p class="inline-block text-sm">Inclusive</p>
                              </div>
                              <div
                                class="py-2 text-gray-600 text-md text-bold"
                                v-if="
                                  item.product_type == 'App\\Models\\Hotel' ||
                                  item.product_type == '6'
                                "
                              >
                                <p class="inline-block text-sm">Hotel room</p>
                              </div>
                              <div
                                class="py-2 text-gray-600 text-md text-bold"
                                v-if="
                                  item.product_type == 'App\\Models\\Airline' ||
                                  item.product_type == '7'
                                "
                              >
                                <p class="inline-block text-sm">Airline</p>
                              </div>
                            </div>
                          </td>
                          <td
                            class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
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
                              disabled
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
                              disabled
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
                              disabled
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
                              disabled
                              :options="inclusives?.data"
                              label="name"
                              :clearable="false"
                              :reduce="(d) => d.id"
                              placeholder="Choose product type"
                            ></v-select>
                            <v-select
                              v-if="
                                item.product_type == 'App\\Models\\Hotel' ||
                                item.product_type == '6'
                              "
                              v-model="item.product_id"
                              class="style-chooser"
                              disabled
                              :options="hotels?.data"
                              label="name"
                              :clearable="false"
                              :reduce="(d) => d.id"
                              placeholder="Choose product type"
                            ></v-select>
                            <v-select
                              v-if="
                                item.product_type == 'App\\Models\\Airline' ||
                                item.product_type == '7'
                              "
                              v-model="item.product_id"
                              class="style-chooser"
                              disabled
                              :options="airlines?.data"
                              label="name"
                              :clearable="false"
                              :reduce="(d) => d.id"
                              placeholder="Choose product type"
                            ></v-select>
                          </td>
                          <td
                            class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
                          >
                            <v-select
                              v-if="
                                item.car_id &&
                                !item.car_name &&
                                item.product_type != '7'
                              "
                              v-model="item.car_id"
                              class="style-chooser"
                              disabled
                              :options="item.car_list"
                              label="name"
                              :clearable="false"
                              :reduce="(d) => d.id"
                              placeholder="Choose product type"
                            ></v-select>
                            <v-select
                              v-if="
                                item.car_id &&
                                !item.car_name &&
                                item.product_type == '7'
                              "
                              v-model="item.car_id"
                              class="style-chooser"
                              disabled
                              :options="item.car_list"
                              label="price"
                              :clearable="false"
                              :reduce="(d) => d.id"
                              placeholder="Choose product type"
                            ></v-select>
                            <v-select
                              v-if="item.car_id && item.car_name"
                              v-model="item.car_id"
                              class="style-chooser"
                              disabled
                              :options="item.variation_type"
                              label="name"
                              :clearable="false"
                              :reduce="(d) => d.id"
                              placeholder="Choose product type"
                            ></v-select>
                            <v-select
                              v-if="item.variation_name"
                              v-model="item.variation_id"
                              class="style-chooser"
                              disabled
                              :options="item.variation_type"
                              label="name"
                              :clearable="false"
                              :reduce="(d) => d.id"
                              placeholder="Choose product type"
                            ></v-select>
                            <v-select
                              v-if="item.room_name"
                              v-model="item.room_id"
                              class="style-chooser"
                              disabled
                              :options="item.variation_type"
                              label="name"
                              :clearable="false"
                              :reduce="(d) => d.id"
                              placeholder="Choose product type"
                            ></v-select>
                            <v-select
                              v-if="item.ticket_id"
                              v-model="item.ticket_id"
                              class="style-chooser"
                              :options="item.variation_type"
                              label="price"
                              :clearable="false"
                              :reduce="(d) => d.id"
                              placeholder="Choose product type"
                            ></v-select>
                            <p
                              v-if="
                                !item.car_id &&
                                !item.variation_name &&
                                !item.room_name &&
                                !item.ticket_id
                              "
                            >
                              -
                            </p>
                          </td>
                          <td
                            class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
                          >
                            <input
                              type="date"
                              v-model="item.service_date"
                              class="text-xs focus:outline-none"
                            />
                          </td>
                          <td
                            class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
                          >
                            <p>{{ item.selling_price }}</p>
                          </td>
                          <td
                            v-if="
                              item.product_type == '6' ||
                              item.product_type == 'App\\Models\\Hotel'
                            "
                            class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
                          >
                            <p>
                              {{
                                hotelQ(
                                  item.product_type,
                                  item.days,
                                  item.quantity
                                )
                              }}
                            </p>
                          </td>
                          <td
                            v-if="
                              item.product_type != '6' &&
                              item.product_type != 'App\\Models\\Hotel'
                            "
                            class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
                          >
                            <p v-if="item.is_inclusive != 1">
                              {{ item.quantity }}
                            </p>
                            <p
                              v-if="
                                item.is_inclusive == 1 &&
                                item.product_type ==
                                  'App\\Models\\PrivateVanTour'
                              "
                            >
                              {{ item.quantity }}
                            </p>
                            <input
                              v-if="
                                item.is_inclusive == 1 &&
                                item.product_type !=
                                  'App\\Models\\PrivateVanTour'
                              "
                              type="number"
                              v-model="item.quantity"
                              name=""
                              class="px-4 py-4 text-sm border border-gray-300 rounded-sm w-[65px] focus:outline-none"
                              id=""
                              placeholder="xx"
                            />
                          </td>
                          <td
                            class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
                          >
                            <p
                              v-if="
                                item.product_type != 'App\\Models\\Hotel' &&
                                item.product_type != '6'
                              "
                            >
                              {{ item.selling_price * item.quantity }}
                            </p>
                            <p
                              v-if="
                                item.product_type == '6' ||
                                item.product_type == 'App\\Models\\Hotel'
                              "
                            >
                              {{
                                item.selling_price * item.quantity * item.days
                              }}
                            </p>
                          </td>

                          <td
                            class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
                          >
                            <button
                              class="mr-4 text-sm text-blue-600"
                              @click="
                                clickdetaildesToggle(
                                  item.comment,
                                  item.special_request,
                                  item.pickup_location,
                                  item.pickup_time,
                                  item.dropoff_location,
                                  index,
                                  item.product_type,
                                  item.route_plan,
                                  item.service_date,
                                  item.checkin_date,
                                  item.checkout_date,
                                  item.days,
                                  item.room_number,
                                  item.quantity,
                                  item.total_guest
                                )
                              "
                            >
                              <i
                                class="fa-solid fa-ellipsis text-xs font-semibold px-1 py-[1.5px] bg-blue-500 rounded-full shadow text-white"
                                title="add description"
                              ></i>
                            </button>
                            <button
                              v-if="authStore.isSuperAdmin"
                              class="text-sm text-red-600"
                              @click.prevent="
                                removeFromitem(index, item, item.product_type)
                              "
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
                            class="px-4 py-3 text-sm text-center text-red-500 border-gray-300"
                          >
                            there isn't item !
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="grid grid-cols-3">
                    <div class="grid grid-cols-3 col-span-2 gap-4 mt-4">
                      <!-- <div
                        v-for="(image, index) in formData.receipt_images"
                        :key="index"
                      >
                        <a :href="image.image" target="_blink">
                          <img :src="image.image" alt="" />
                        </a>
                      </div> -->
                    </div>

                    <div class="px-6 mt-6">
                      <div class="grid grid-cols-2 gap-4">
                        <p
                          class="pr-8 mt-3 mb-2 text-sm text-gray-800 text-end"
                        >
                          Subtotal
                        </p>
                        <input
                          v-model="sub_total"
                          disabled
                          type="text"
                          id="title"
                          class="w-full h-8 px-4 py-2 mt-2 text-gray-900 bg-gray-300 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-300"
                        />
                      </div>
                      <div class="grid grid-cols-2 gap-4">
                        <p
                          class="pr-8 mt-3 mb-2 text-sm text-gray-800 text-end"
                        >
                          Discount
                        </p>
                        <input
                          v-model="formData.discount"
                          type="text"
                          id="title"
                          class="w-full h-8 px-4 py-2 mt-2 text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
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
                          class="pr-8 mt-3 mb-2 text-sm text-gray-800 text-end"
                        >
                          Total:
                        </p>
                        <input
                          v-model="grand_total"
                          disabled
                          type="text"
                          id="title"
                          class="w-full h-8 px-4 py-2 mt-2 text-gray-900 bg-gray-300 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-300"
                        />
                      </div>
                      <div class="grid grid-cols-2 gap-4">
                        <p
                          class="pr-8 mt-3 mb-2 text-sm text-gray-800 text-end"
                        >
                          Deposit:
                        </p>
                        <input
                          type="text"
                          v-model="formData.deposit"
                          id="title"
                          class="w-full h-8 px-4 py-2 mt-2 text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
                        />
                      </div>

                      <div
                        class="grid grid-cols-2 gap-4"
                        v-if="formData.deposit > 0 && allowImage"
                      >
                        <div class="relative">
                          <p
                            class="pr-8 mt-3 mb-2 text-sm text-gray-800 text-end"
                          >
                            Reciept Image
                          </p>
                          <input
                            type="file"
                            ref="featureImageInput"
                            class="hidden"
                            multiple
                            @change="handlerFeatureFileChange"
                            accept="image/*"
                          />
                          <button
                            @click.prevent="openFileFeaturePicker"
                            class="text-sm text-blue-500"
                          ></button>
                        </div>
                        <div
                          @click.prevent="openFileFeaturePicker"
                          class="cursor-pointer mt-2 w-full h-[100px] border-2 border-dashed border-gray-400 rounded flex justify-center items-center"
                        >
                          <span class="text-xs"
                            ><i
                              class="fa-solid fa-plus text-lg font-semibold py-3 px-5 bg-[#ff613c] rounded-full shadow text-white"
                            ></i
                          ></span>
                        </div>

                        <div class="grid grid-cols-3 col-span-2 gap-3 mt-4">
                          <div
                            class="relative"
                            v-for="(image, index) in featureImagePreview"
                            :key="index"
                          >
                            <button
                              @click.prevent="removeFeatureSelectImage(index)"
                              class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
                            >
                              <XCircleIcon class="w-8 h-8 font-semibold" />
                            </button>

                            <img
                              class="h-auto w-full rounded"
                              :src="image"
                              alt=""
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        class="grid grid-cols-2 gap-4"
                        :class="action == 'view' ? 'mb-4' : ''"
                      >
                        <p
                          class="pr-8 mt-3 mb-2 text-sm text-gray-800 text-end"
                        >
                          Balance Due:
                        </p>
                        <input
                          type="text"
                          v-model="balance_due"
                          id="title"
                          disabled
                          class="w-full h-8 px-4 py-2 mt-2 text-gray-900 bg-gray-300 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-300"
                        />
                      </div>
                      <div class="mt-3">
                        <textarea
                          v-model="formData.payment_notes"
                          id="title"
                          class="w-full px-4 py-2 text-xs text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-gray-300"
                          placeholder="Payment Notes"
                        ></textarea>
                      </div>

                      <div
                        v-if="allowDeposite"
                        class="flex items-center justify-end mt-4 mb-4 space-x-3 flex-nowrap"
                      >
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          v-model="checkCondition"
                          class="w-6 h-6 bg-[#ff613c] border-gray-300 rounded-md"
                        />
                        <p class="text-xs">
                          click want update when deposit not change
                        </p>
                      </div>
                      <div class="mt-6 mb-3 text-end" v-if="allowCreate">
                        <Button
                          @click.prevent="onSubmitHandler"
                          class="py-2 px-14"
                        >
                          Update
                        </Button>
                      </div>
                      <div class="mt-6 mb-3 text-end" v-if="!allowCreate">
                        <Button class="py-2 bg-gray-300 px-14"> Update </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-4 col-span-3 gap-4 mt-4">
                <div
                  v-for="(image, index) in formData.receipt_images"
                  :key="index"
                >
                  <div class="flex justify-between items-center">
                    <p class="mb-2 text-sm">Receipt Image {{ index + 1 }}</p>
                    <i
                      v-if="authStore.isSuperAdmin"
                      class="fa-solid fa-trash-can text-lg text-red-500"
                      @click="deleteImage(image.id)"
                    ></i>
                  </div>
                  <a :href="image.image" target="_blink">
                    <img :src="image.image" alt="" />
                  </a>

                  <!-- <p>{{ image.image }}</p> -->
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
