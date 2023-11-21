<script setup>
import Layout from "./Layout.vue";
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { PlusIcon, ListBulletIcon } from "@heroicons/vue/24/outline";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { computed, onMounted, onUnmounted, ref } from "vue";
import Button from "../components/Button.vue";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { Switch } from "@headlessui/vue";
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
import { useInclusiveStore } from "../stores/inclusion";
import { useRoomStore } from "../stores/room";
import { useHotelStore } from "../stores/hotel";
import { useAirLineStore } from "../stores/airline";
import { useAuthStore } from "../stores/auth";
import { useAdminStore } from "../stores/admin";
import { addDays } from "date-fns";

// const enabled = ref(false);

const toast = useToast();
const router = useRouter();
const route = useRoute();
const customerStore = useCustomerStore();
const vantourStore = useVantourStore();
const grouptourStore = useGrouptourStore();
const airportStore = useAirportStore();
const entranceStore = useEntranceStore();
const bookingStore = useBookingStore();
const inclusiveStore = useInclusiveStore();
const hotelStore = useHotelStore();
const sidebar = useSidebarStore();
const roomStore = useRoomStore();
const airlineStore = useAirLineStore();
const authStore = useAuthStore();
const adminStore = useAdminStore();

const { customer, loading } = storeToRefs(customerStore);
const { vantours } = storeToRefs(vantourStore);
const { grouptours } = storeToRefs(grouptourStore);
const { airports } = storeToRefs(airportStore);
const { inclusives } = storeToRefs(inclusiveStore);
const { entrances } = storeToRefs(entranceStore);
const { airlines } = storeToRefs(airlineStore);
const { rooms } = storeToRefs(roomStore);
const { hotels } = storeToRefs(hotelStore);
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

const payment = ref([]);
const paymentValid = ref(true);
const choosePaymentBank = () => {
  if (formData.value.payment_currency == "MMK") {
    payment.value = payment_mm;
    paymentValid.value = true;
  } else if (formData.value.payment_currency == "THB") {
    payment.value = payment_thb;
    paymentValid.value = false;
  } else {
    payment.value = payment_usd;
    paymentValid.value = true;
  }
};
// Kasikorn, Bangkok Bank, Bank of Ayudhaya, SCB Bank , Others
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
  { id: "1", name: "Van Tour", data: "AppModelsPrivateVanTour" },
  { id: "2", name: "Group Tour", data: "AppModelsGroupTour" },
  { id: "3", name: "Airport Pickup", data: " AppModelsAirportPickup" },
  { id: "4", name: "Entrance Ticket", data: "AppModelsEntranceTicket" },
  { id: "5", name: "Inclusive", data: "AppModelsInclusive" },
  { id: "6", name: "Hotel Room", data: "AppModelsRoom" },
  { id: "7", name: "AirLine", data: "AppModelsAirline" },
];

const paymentArray = [
  // Bank Transfer, International Remittance, Cash, etc
  { id: "1", name: "Bank Transfer" },
  { id: "2", name: "International Remittance" },
  { id: "3", name: "Cash" },
  { id: "4", name: "Other ..." },
];

const formData = ref({
  customer_id: "",
  sold_from: "",
  payment_method: "",
  bank_name: "",
  payment_status: "",
  booking_date: "",
  payment_currency: "",
  items: [],
  money_exchange_rate: "",
  crm_id: "",
  discount: "0",
  comment: "",
  receipt_image: [],
  confirmation_letter: [],
  due_date: "",
  deposit: 0,
  balance_due_date: "",
  past_user_id: "",
  is_past_info: "",
  past_crm_id: "",
});

const sub_total = computed(() => {
  let totalsub = 0;
  for (let i = 0; i < formData.value.items.length; i++) {
    if (!formData.value.items[i].is_inclusive) {
      totalsub = totalsub + formData.value.items[i].total_amount;
    }
  }
  return totalsub;
});

const sub_qty_total = computed(() => {
  let totalsub = 0;
  if (formitem.value.days) {
    totalsub =
      formitem.value.quantity *
      formitem.value.selling_price *
      formitem.value.days;
    formitem.value.total_amount = totalsub;
    return totalsub;
  } else {
    totalsub = formitem.value.quantity * formitem.value.selling_price;
    formitem.value.total_amount = totalsub;
    return totalsub;
  }
});

const percentageValue = ref("");

const grand_total = computed(() => {
  // console.log(sub_total.value, formData.value.discount);
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

const formitem = ref({
  product_type: "",
  product_id: "",
  car_id: "",
  car_list: [],
  room_id: "",
  room: null,
  service_date: "",
  quantity: "1",
  days: "",
  duration: "",
  selling_price: "",
  comment: "",
  reservation_status: "",
  payment_method: "",
  payment_status: "",
  amount: "",
  exchange_rate: "",
  cost_price: "",
  special_request: "",
  total_amount: "",
  pickup_location: "",
  pickup_time: "",
  dropoff_location: "",
  route_plan: "",
  checkin_date: "",
  room_number: "",
  checkout_date: "",
  customer_attachment: "",
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
const carType = ref([]);
const roomType = ref([]);

const addArrayToListPush = async (d) => {
  const res = await inclusiveStore.getDetailAction(d.product_id);
  console.log(d.quantity, "this is array result");
  addArrayToList(res.result, d.service_date, d.quantity);
};
const serviceDateCal = (dateCurrent, day) => {
  console.log(dateCurrent, day);
  let dayChoose = day - 1;
  return addDays(new Date(dateCurrent), dayChoose).toISOString().split("T")[0];
};

const addArrayToList = (arr, date, qty) => {
  console.log(arr, "this is array");
  if (arr.private_van_tours.length > 0) {
    for (let x = 0; x < arr.private_van_tours.length; x++) {
      let data = {};
      data.product_type = "1";
      data.product_id = arr.private_van_tours[x].product.id;
      data.car_id = arr.private_van_tours[x].car.id;
      data.car_list = arr.private_van_tours[x].product.cars;
      // data.service_date = serviceDateCal(date, arr.private_van_tours[x].day);
      if (arr.private_van_tours[x].day != 100) {
        data.service_date = serviceDateCal(date, arr.private_van_tours[x].day);
      } else {
        data.service_date = date;
      }
      data.selling_price = arr.private_van_tours[x].selling_price;
      data.quantity = arr.private_van_tours[x].quantity;
      data.description = "";
      data.total_amount = data.selling_price * data.quantity;
      data.is_inclusive = 1;
      formData.value.items.push(data);
    }
  }
  if (arr.group_tours.length > 0) {
    for (let x = 0; x < arr.group_tours.length; x++) {
      let data = {};
      data.product_type = "2";
      data.product_id = arr.group_tours[x].product.id;
      if (arr.group_tours[x].day != 100) {
        data.service_date = serviceDateCal(date, arr.group_tours[x].day);
      } else {
        data.service_date = date;
      }
      data.selling_price = arr.group_tours[x].selling_price;
      data.quantity = arr.group_tours[x].quantity;
      data.description = "";
      data.total_amount = data.selling_price * data.quantity;
      data.is_inclusive = 1;
      formData.value.items.push(data);
    }
  }
  if (arr.airport_pickups.length > 0) {
    for (let x = 0; x < arr.airport_pickups.length; x++) {
      let data = {};
      data.product_type = "3";
      data.product_id = arr.airport_pickups[x].product.id;
      data.car_id = arr.airport_pickups[x].car.id;
      data.car_list = arr.airport_pickups[x].product.cars;
      // data.service_date = serviceDateCal(date, arr.airport_pickups[x].day);
      if (arr.airport_pickups[x].day != 100) {
        data.service_date = serviceDateCal(date, arr.airport_pickups[x].day);
      } else {
        data.service_date = date;
      }
      data.selling_price = arr.airport_pickups[x].selling_price;
      data.quantity = arr.airport_pickups[x].quantity;
      data.description = "";
      data.total_amount = data.selling_price * data.quantity;
      data.is_inclusive = 1;
      formData.value.items.push(data);
    }
  }
  if (arr.entrance_tickets.length > 0) {
    for (let x = 0; x < arr.entrance_tickets.length; x++) {
      let data = {};
      data.product_type = "4";
      data.product_id = arr.entrance_tickets[x].product.id;
      data.car_id = arr.entrance_tickets[x].variation.id;
      data.car_list =
        arr.entrance_tickets[x].variation.entrance_ticket.variations;
      // data.service_date = serviceDateCal(date, arr.entrance_tickets[x].day);
      if (arr.entrance_tickets[x].day != 100) {
        data.service_date = serviceDateCal(date, arr.entrance_tickets[x].day);
      } else {
        data.service_date = date;
      }
      data.selling_price = arr.entrance_tickets[x].selling_price;
      data.quantity = arr.entrance_tickets[x].quantity;
      data.description = "";
      data.total_amount = data.selling_price * data.quantity;
      data.is_inclusive = 1;
      formData.value.items.push(data);
    }
  }
  if (arr.hotels.length > 0) {
    for (let x = 0; x < arr.hotels.length; x++) {
      let data = {};
      data.product_type = "6";
      data.product_id = arr.hotels[x].product.id;
      data.car_id = arr.hotels[x].room.id;
      data.car_list = arr.hotels[x].room.hotel.rooms;
      if (arr.hotels[x].day != 100) {
        data.service_date = serviceDateCal(date, arr.hotels[x].day);
        data.checkin_date = date;
        data.checkout_date = serviceDateCal(date, arr.night);
        data.days = arr.hotels[x].day;
      } else {
        data.service_date = date;
        data.checkin_date = date;
        data.checkout_date = serviceDateCal(date, arr.night + 1);
        data.days = arr.night;
      }
      data.selling_price = arr.hotels[x].selling_price;
      data.quantity = Math.ceil(qty / 2);
      data.description = "";
      data.total_amount = data.selling_price * data.quantity;
      data.is_inclusive = 1;
      formData.value.items.push(data);
    }
  }
  if (arr.airline_tickets.length > 0) {
    for (let x = 0; x < arr.airline_tickets.length; x++) {
      let data = {};
      data.product_type = "7";
      data.product_id = arr.airline_tickets[x].product.id;
      data.car_id = arr.airline_tickets[x].ticket.airline.id;
      data.car_list = arr.airline_tickets[x].ticket.airline.tickets;
      // data.service_date = serviceDateCal(date, arr.airline_tickets[x].day);
      if (arr.airline_tickets[x].day != 100) {
        data.service_date = serviceDateCal(date, arr.airline_tickets[x].day);
      } else {
        data.service_date = date;
      }
      data.selling_price = arr.airline_tickets[x].selling_price;
      data.quantity = arr.airline_tickets[x].quantity;
      data.description = "";
      data.total_amount = data.selling_price * data.quantity;
      data.is_inclusive = 1;
      formData.value.items.push(data);
    }
  }
};

const chooseCar = async (id) => {
  if (formitem.value.product_type == "1" && id) {
    const res = await vantourStore.getDetailAction(id);
    formitem.value.comment = res.result.long_description;
    console.log(res, "this is des");
    carType.value = res.result.cars;
  } else if (formitem.value.product_type == "2") {
    const res = await grouptourStore.getDetailAction(id);
    formitem.value.comment = res.result.description;
    formitem.value.selling_price = res.result.price;
    carType.value = res.result.cars;
    console.log(res);
  } else if (formitem.value.product_type == "3") {
    const res = await airportStore.getDetailAction(id);
    formitem.value.comment = res.result.description;
    carType.value = res.result.cars;
    console.log(res);
  } else if (formitem.value.product_type == "4") {
    const res = await entranceStore.getDetailAction(id);
    // formitem.value.comment = res.result.description;
    console.log(res, "choose");
    carType.value = res.result.variations;
    // console.log(res.result.variations[0].price);
  } else if (formitem.value.product_type == "5") {
    const res = await inclusiveStore.getDetailAction(id);
    console.log(res);
    formitem.value.comment = res.result.description;
    formitem.value.selling_price = res.result.price;
    // addArrayToList(res.result);
  } else if (formitem.value.product_type == "6") {
    const res = await hotelStore.getDetailAction(id);
    // formitem.value.comment = res.result.description;
    roomType.value = res.result.rooms;
  } else if (formitem.value.product_type == "7") {
    const res = await airlineStore.getDetailAction(id);
    console.log(res.result.tickets, "this is ");
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
        console.log(res.result.cars[i]);
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
    formitem.value.car_list = res.result.variations;

    for (let i = 0; i < res.result.variations.length; i++) {
      if (res.result.variations[i].id == id) {
        formitem.value.selling_price = res.result.variations[i].price;
        formitem.value.cost_price = res.result.variations[i].cost_price;
        formitem.value.comment = res.result.variations[i].description;
        console.log(formitem.value.cost_price, "this is cost price detail");
      }
    }
    console.log(res);
  } else if (type == "6") {
    const res = await hotelStore.getDetailAction(productId);
    formitem.value.room_list = res.result.rooms;
    const room = res.result.rooms.filter((r) => r.id === id)[0];
    formitem.value.room = room;
    formitem.value.selling_price = room.room_price;
    formitem.value.cost_price = room.cost;
    console.log(formitem.value.cost_price, "this is room cost");
    formitem.value.extra_price = room.extra_price;
    formitem.value.comment = room.description;
    console.log(room);
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
const addNewitem = () => {
  formData.value.items.push(formitem.value);
  if (formitem.value.product_type == "5") {
    addArrayToListPush(formitem.value);
  }
  console.log(formData.value.items, "this is items");
  formitem.value = {
    product_type: "",
    product_id: "",
    service_date: "",
    car_id: "",
    car_list: [],
    quantity: "1",
    days: "",
    room_id: "",
    duration: "",
    selling_price: "",
    comment: "",
    reservation_status: "",
    payment_method: "",
    payment_status: "",
    exchange_rate: "",
    cost_price: "",
    special_request: "",
    total_amount: "",
    route_plan: "",
    pickup_location: "",
    pickup_time: "",
    amount: "",
    customer_attachment: "",
    dropoff_location: "",
    checkin_date: "",
    checkout_date: "",
    room_number: "",
  };
  todayVali.value = false;

  addToggle();
};

const calculateRateRoom = () => {
  if (formitem.value.checkin_date && formitem.value.checkout_date) {
    formitem.value.days = calculateDaysBetween(
      formitem.value.checkin_date,
      formitem.value.checkout_date
    );
  }
  closedes();
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

const removeFromitem = (index) => {
  formData.value.items.splice(index, 1);
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

const customerFile = (e) => {
  let selectedFile = e.target.files[0];
  if (selectedFile) {
    formitem.value.customer_attachment = e.target.files[0];
  }
};

const removeFeatureSelectImage = (index) => {
  // formData.value.receipt_image = "";
  // featureImagePreview.value = null;
  formData.value.receipt_image.splice(index, 1);
  featureImagePreview.value.splice(index, 1);
  console.log(formData.value.receipt_image, "this is remove");
};

const addComment = ref(false);
const addToggle = () => {
  if (addComment.value) {
    addComment.value = false;
  } else {
    addComment.value = true;
  }
};

const enabled = ref(false);

const statePast = computed(() => {
  if (enabled.value == true) {
    return true;
  } else {
    return false;
  }
});

const onSubmitHandler = async () => {
  const frmData = new FormData();
  frmData.append("customer_id", formData.value.customer_id);
  frmData.append("sold_from", formData.value.sold_from);
  frmData.append("payment_method", formData.value.payment_method);
  frmData.append("bank_name", formData.value.bank_name);

  // if (enabled.value = true) {
  //   frmData.append("is_past_info", "1");
  //   frmData.append("past_user_id", formData.value.past_user_id);
  //   frmData.append("past_crm_id", formData.value.past_crm_id);
  // } else {
  //   frmData.append("is_past_info", "0");
  // }
  frmData.append("is_past_info", enabled.value ? "1" : "0");
  formData.value.past_crm_id
    ? frmData.append("past_crm_id", formData.value.past_crm_id)
    : "";
  formData.value.past_user_id
    ? frmData.append("past_user_id", formData.value.past_user_id)
    : "";

  frmData.append("payment_status", formData.value.payment_status);
  frmData.append("booking_date", formData.value.booking_date);
  if (formData.value.money_exchange_rate) {
    frmData.append("money_exchange_rate", formData.value.money_exchange_rate);
  } else {
    frmData.append("money_exchange_rate", 0);
  }

  if (formData.value.discount == "" || formData.value.discount == 0) {
    frmData.append("discount", 0);
  } else {
    frmData.append("discount", percentageValue.value);
  }

  // frmData.append(
  //   "discount",
  //   formData.value.discount == "" ? 0 : percentageValue.value
  // );
  // frmData.append("comment", formData.value.comment);
  frmData.append("sub_total", sub_total.value);
  frmData.append("grand_total", grand_total.value);
  frmData.append("deposit", formData.value.deposit);
  frmData.append("payment_currency", formData.value.payment_currency);
  frmData.append("balance_due", balance_due.value);
  frmData.append("balance_due_date", formData.value.balance_due_date);

  // frmData.append("receipt_image", formData.value.receipt_image);
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
    } else if (formData.value.items[x].product_type == "5") {
      frmData.append(
        "items[" + x + "][product_type]",
        `App\\Models\\Inclusive`
      );
    } else if (formData.value.items[x].product_type == "6") {
      frmData.append("items[" + x + "][product_type]", `App\\Models\\Hotel`);
    } else if (formData.value.items[x].product_type == "7") {
      frmData.append("items[" + x + "][product_type]", `App\\Models\\Airline`);
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
    frmData.append(
      "items[" + x + "][product_id]",
      formData.value.items[x].product_id
    );
    if (formData.value.items[x].is_inclusive) {
      frmData.append(
        "items[" + x + "][is_inclusive]",
        formData.value.items[x].is_inclusive
      );
    }

    if (formData.value.items[x].product_type != "6") {
      frmData.append(
        "items[" + x + "][amount]",
        formData.value.items[x].selling_price * formData.value.items[x].quantity
      );
    } else if (formData.value.items[x].product_type == "6") {
      frmData.append(
        "items[" + x + "][amount]",
        formData.value.items[x].selling_price *
          formData.value.items[x].quantity *
          formData.value.items[x].days
      );
    }

    formData.value.items[x].pickup_location
      ? frmData.append(
          "items[" + x + "][pickup_location]",
          formData.value.items[x].pickup_location
        )
      : "";

    // formData.value.items[x].cost_price
    //   ? frmData.append(
    //       "items[" + x + "][cost_price]",
    //       formData.value.items[x].cost_price
    //     )
    //   : "";

    if (formData.value.items[x].pickup_time) {
      frmData.append(
        "items[" + x + "][pickup_time]",
        formData.value.items[x].pickup_time
      );
    }
    if (formData.value.items[x].customer_attachment) {
      frmData.append(
        "items[" + x + "][customer_attachment]",
        formData.value.items[x].customer_attachment
      );
    }

    if (formData.value.items[x].dropoff_location) {
      frmData.append(
        "items[" + x + "][dropoff_location]",
        formData.value.items[x].dropoff_location
      );
    }
    if (formData.value.items[x].checkin_date) {
      frmData.append(
        "items[" + x + "][checkin_date]",
        formData.value.items[x].checkin_date
      );
    }
    if (formData.value.items[x].room_number) {
      frmData.append(
        "items[" + x + "][room_number]",
        formData.value.items[x].room_number
      );
    }
    if (formData.value.items[x].checkout_date) {
      frmData.append(
        "items[" + x + "][checkout_date]",
        formData.value.items[x].checkout_date
      );
    }
    if (formData.value.items[x].route_plan) {
      frmData.append(
        "items[" + x + "][route_plan]",
        formData.value.items[x].route_plan
      );
    }

    if (
      formData.value.items[x].product_type === "6" &&
      formData.value.items[x].room_id
    ) {
      frmData.append(
        "items[" + x + "][room_id]",
        formData.value.items[x].room_id
      );
    }
    if (
      formData.value.items[x].product_type != "4" &&
      formData.value.items[x].product_type != "7"
    ) {
      if (formData.value.items[x].car_id) {
        frmData.append(
          "items[" + x + "][car_id]",
          formData.value.items[x].car_id
        );
      }
    } else if (formData.value.items[x].product_type == "4") {
      frmData.append(
        "items[" + x + "][variation_id]",
        formData.value.items[x].car_id
      );
    } else if (formData.value.items[x].product_type == "7") {
      frmData.append(
        "items[" + x + "][ticket_id]",
        formData.value.items[x].car_id
      );
    }
    frmData.append(
      "items[" + x + "][service_date]",
      formData.value.items[x].service_date
    );
    frmData.append(
      "items[" + x + "][quantity]",
      formData.value.items[x].quantity
    );
    formData.value.days
      ? frmData.append("items[" + x + "][days]", formData.value.items[x].days)
      : "";
    if (formData.value.items[x].duration) {
      frmData.append(
        "items[" + x + "][duration]",
        formData.value.items[x].duration
      );
    }
    if (formData.value.items[x].special_request) {
      frmData.append(
        "items[" + x + "][special_request]",
        formData.value.items[x].special_request
      );
    }
    frmData.append(
      "items[" + x + "][selling_price]",
      formData.value.items[x].selling_price
    );
    if (formData.value.items[x].comment) {
      frmData.append(
        "items[" + x + "][comment]",
        formData.value.items[x].comment
      );
    }
    // console.log(formData.value.items[x].comment, "this is comment");
    frmData.append(
      "items[" + x + "][reservation_status]",
      formData.value.items[x].reservation_status
    );
    frmData.append(
      "items[" + x + "][payment_method]",
      formData.value.items[x].payment_method
    );
    formData.value.items[x].payment_status
      ? frmData.append(
          "items[" + x + "][payment_status]",
          formData.value.items[x].payment_status
        )
      : "";
    // frmData.append(
    //   "items[" + x + "][exchange_rate]",
    //   formData.value.items[x].exchange_rate
    // );
    formData.value.items[x].exchange_rate
      ? frmData.append(
          "items[" + x + "][exchange_rate]",
          formData.value.items[x].exchange_rate
        )
      : "";
  }

  try {
    const response = await bookingStore.addNewAction(frmData);
    console.log(response, "create response");
    formData.value = {
      customer_id: "",
      sold_from: "",
      payment_method: "",
      bank_name: "",
      payment_status: "",
      booking_date: "",
      items: [],
      receipt_image: [],
      money_exchange_rate: "",
      crm_id: "",
      discount: "",
      comment: "",
      past_user_id: "",
      is_past_info: "",
      past_crm_id: "",
    };
    enabled.value = false;
    errors.value = null;
    toast.success(response.message);
    featureImagePreview.value = [];
    router.push("/bookings/update/" + response.result.id + "/edit");
    // bookings/update/65/edit
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
  file,
  i,
  o,
  days,
  room,
  quantity,
  is_inclusive
) => {
  console.log(a, b, index, is_inclusive);
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
  itemFile.value = file;
  itemCheckIn.value = i;
  itemCheckOut.value = o;
  itemDays.value = days;
  itemRoom.value = room;
  itemQ.value = quantity;
  itemIs.value = is_inclusive != undefined ? is_inclusive : 0;
  console.log(itemIs.value, "this is item is");
};
const itemType = ref("");
const itemRoutePlan = ref("");
const itemFile = ref("");
const indexValue = ref("");
const itemPickup = ref("");
const itemDropoff = ref("");
const itemPickupTime = ref("");
const itemCheckIn = ref("");
const itemCheckOut = ref("");
const itemDays = ref("");
const itemRoom = ref("");
const itemQ = ref("");
const itemIs = ref("");

const clickdetaildesUpdate = (x) => {
  formData.value.items[x].comment = itemDes.value;
  formData.value.items[x].special_request = itemSpecial.value;
  formData.value.items[x].service_date = itemServiceDate.value;
  formData.value.items[x].pickup_location = itemPickup.value;
  formData.value.items[x].customer_attachment = itemFile;
  formData.value.items[x].checkin_date = itemCheckIn.value;
  formData.value.items[x].room_number = itemRoom.value;
  formData.value.items[x].checkout_date = itemCheckOut.value;
  formData.value.items[x].quantity = itemQ.value;
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
  let totalsub =
    formData.value.items[x].quantity *
    formData.value.items[x].selling_price *
    formData.value.items[x].days;
  formData.value.items[x].total_amount = totalsub;
  clickdetaildes.value = false;
};

const itemSpecial = ref("");
const itemServiceDate = ref("");

const clickdetaildesClose = () => {
  clickdetaildes.value = false;
  itemDes.value = "";
  itemSpecial.value = "";
  itemServiceDate.value = "";
  itemPickup.value = "";
  itemPickupTime.value = "";
  itemDropoff.value = "";
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

const allowCreate = computed(() => {
  if (
    formData.value.items.length != 0 &&
    formData.value.deposit != 0 &&
    formData.value.receipt_image.length != 0
  ) {
    return true;
  } else if (formData.value.items.length != 0 && formData.value.deposit == 0) {
    return true;
  } else {
    return false;
  }
});

const hotelQ = (t, d, q) => {
  let data = 0;
  if (t == 6 || t == "App\\Models\\Hotel") {
    return (data = d * q);
  }
};

onMounted(async () => {
  await customerStore.getSimpleListAction();

  await adminStore.getSimpleListAction();
  await vantourStore.getSimpleListAction();
  await grouptourStore.getSimpleListAction();
  await entranceStore.getSimpleListAction();
  await airportStore.getSimpleListAction();
  await airlineStore.getSimpleListAction();
  await hotelStore.getSimpleListAction();
  console.log(admin.value, "this is admin");
  getTodayDate();
});
</script>

<template>
  <Layout>
    <div
      class="grid grid-cols-3 col-span-2 gap-3 p-6 mb-5 rounded-lg shadow-sm"
    >
      <div class="flex items-center justify-between col-span-3 mb-5">
        <h3 class="text-2xl font-medium text-[#ff613c]">Create New Sales</h3>
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
                <p class="mb-2 text-xs text-[#ff613c]">Customer Name</p>

                <v-select
                  v-model="formData.customer_id"
                  class="style-chooser placeholder-sm bg-white rounded-lg"
                  :options="customer?.data"
                  label="name"
                  :clearable="false"
                  :reduce="(d) => d.id"
                ></v-select>
              </div>
              <div class="">
                <p class="mb-2 text-xs text-[#ff613c]">Sale Date</p>
                <input
                  v-model="formData.booking_date"
                  type="date"
                  id="title"
                  class="w-full h-10 px-4 py-2 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-gray-300"
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
                <p class="mb-2 text-xs text-[#ff613c]">Sold From</p>
                <v-select
                  v-model="formData.sold_from"
                  class="style-chooser bg-white rounded-lg"
                  :options="soldFrom"
                  label="name"
                  :clearable="false"
                  :reduce="(d) => d.name"
                ></v-select>
              </div>

              <div>
                <p class="mb-2 text-xs text-[#ff613c]">Payment Currency</p>
                <v-select
                  v-model="formData.payment_currency"
                  class="style-chooser bg-white rounded-lg"
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
                <p class="mb-2 text-xs text-[#ff613c]">Bank Name</p>
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
                <p class="mb-2 text-xs text-[#ff613c]">Payment Method</p>
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
                <p class="mb-2 text-xs text-[#ff613c]">Payment Status</p>

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
              <div class="relative" v-if="authStore.isCashier">
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
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="mb-2 text-xs text-[#ff613c]">Balance Due Date</p>

                <input
                  v-model="formData.balance_due_date"
                  type="date"
                  id="title"
                  class="w-full h-10 px-4 py-2 bg-white text-xs text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-gray-300"
                />
                <p
                  v-if="errors?.balance_due_date"
                  class="mt-1 text-sm text-red-600"
                >
                  {{ errors.balance_due_date[0] }}
                </p>
              </div>
              <div>
                <p class="mb-2 text-xs text-[#ff613c]">Money Exchange Rate</p>

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
            </div>
          </div>
          <div class="col-span-1 space-y-4 text-end">
            <p class="text-xs text-[#ff613c]">Balance Due</p>
            <p class="text-4xl font-bold tracking-wide text-[#ff613c]">
              {{ balance_due }} thb
            </p>
            <p
              class="inline-block px-4 py-2 text-sm text-[#ff613c] border border-[#ff613c]"
            >
              Receive Payment
            </p>
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
                    <div class="grid grid-cols-1 space-y-2">
                      <p class="text-xs">Description</p>
                      <textarea
                        name=""
                        id=""
                        class="px-4 py-4 text-sm border border-gray-300 rounded-sm focus:outline-none"
                        cols="30"
                        rows="3"
                        v-model="formitem.comment"
                      ></textarea>
                    </div>

                    <div class="grid grid-cols-1 space-y-2">
                      <p class="text-xs">Special request</p>
                      <textarea
                        name=""
                        id=""
                        class="px-4 py-4 text-sm border border-gray-300 rounded-sm focus:outline-none"
                        cols="30"
                        rows="3"
                        v-model="formitem.special_request"
                      ></textarea>
                    </div>

                    <div
                      class="grid grid-cols-1 space-y-2"
                      v-if="formitem.product_type == '6'"
                    >
                      <p class="text-xs">Total Number of Rooms</p>
                      <input
                        type="text"
                        v-model="formitem.quantity"
                        name=""
                        class="px-4 py-4 text-sm border border-gray-300 rounded-sm focus:outline-none"
                        id=""
                        placeholder="xxx , xxx , xxx"
                      />
                    </div>
                    <div
                      class="grid grid-cols-1 space-y-2"
                      v-if="
                        formitem.product_type == '1' ||
                        formitem.product_type == '3'
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
                        formitem.product_type == '3'
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
                        formitem.product_type == '3'
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
                        formitem.product_type == '3'
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
                      v-if="formitem.product_type == '3'"
                    >
                      <p class="text-xs">Customer Attachment</p>
                      <input type="file" name="" @change="customerFile" id="" />
                    </div>
                    <div
                      class="grid grid-cols-1 space-y-2"
                      v-if="formitem.product_type == '6'"
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
                      v-if="formitem.product_type == '6'"
                    >
                      <p class="text-xs">Checkout Date</p>
                      <input
                        type="date"
                        class="p-2 border text-sm border-gray-300 rounded-sm focus:outline-none"
                        id=""
                        v-model="formitem.checkout_date"
                      />
                    </div>
                    <div
                      class="grid grid-cols-1 space-y-2"
                      v-if="formitem.product_type == '6'"
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
                        class="px-2 py-1 text-sm text-white bg-[#ff613c] rounded"
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
                    <div class="grid grid-cols-1 space-y-2">
                      <p class="text-sm">Description</p>
                      <textarea
                        name=""
                        id=""
                        class="px-4 py-4 text-sm border border-gray-300 rounded-sm focus:outline-none"
                        cols="30"
                        rows="5"
                        v-model="itemDes"
                      ></textarea>
                    </div>
                    <div class="grid grid-cols-1 space-y-2">
                      <p class="text-sm">Special Request</p>
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
                      v-if="itemType == '6'"
                    >
                      <p class="text-xs">Total Number of Room</p>
                      <input
                        v-model="itemQ"
                        type="text"
                        name=""
                        class="px-4 py-4 text-sm border border-gray-300 rounded-sm focus:outline-none"
                        id=""
                        placeholder="xxx , xxx , xxx"
                      />
                    </div>
                    <div
                      class="grid grid-cols-1 space-y-2"
                      v-if="itemType == '1' || itemType == '3'"
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
                      v-if="itemType == '1' || itemType == '3'"
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
                      v-if="itemType == '1' || itemType == '3'"
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
                      v-if="itemType == '1' || itemType == '3'"
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
                      v-if="itemType == '3'"
                    >
                      <p class="text-sm">customer_attachment</p>
                      <p>...</p>
                    </div>
                    <div
                      class="grid grid-cols-1 space-y-2"
                      v-if="itemType == '6'"
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
                      v-if="itemType == '6'"
                    >
                      <p class="text-sm">Checkout Date</p>
                      <input
                        type="date"
                        class="p-2 border border-gray-300 focus:outline-none rounded-sm text-xs"
                        v-model="itemCheckOut"
                        id=""
                      />
                    </div>
                    <div
                      class="grid grid-cols-1 space-y-2"
                      v-if="itemType == '6'"
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
                    <div class="grid grid-cols-1 space-y-2" v-if="itemIs == 1">
                      <p class="text-xs">Change Quantity</p>
                      <input
                        type="number"
                        v-model="itemQ"
                        name=""
                        class="px-4 py-4 text-sm border border-gray-300 rounded-sm focus:outline-none"
                        id=""
                        placeholder="xx"
                      />
                    </div>
                    <div class="flex items-center justify-between">
                      <button @click="clickdetaildesClose" class="text-sm">
                        close
                      </button>
                      <button
                        @click="clickdetaildesUpdate(indexValue)"
                        class="px-2 py-1 text-sm text-white bg-[#ff613c] rounded"
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
                          class="px-4 py-2 text-xs text-[#ff613c] text-start"
                        ></th>

                        <th
                          class="px-4 py-2 text-xs text-[#ff613c] border-r border-gray-300 text-start"
                        >
                          P Type
                        </th>
                        <th
                          class="px-4 py-2 text-xs text-[#ff613c] border-r border-gray-300 text-start"
                        >
                          Product Name
                        </th>
                        <th
                          class="px-4 py-2 text-xs text-[#ff613c] border-r border-gray-300 text-start"
                        >
                          Variable
                        </th>

                        <th
                          class="px-4 py-2 text-xs text-[#ff613c] border-r border-gray-300 text-start"
                        >
                          Service Date
                        </th>
                        <th
                          class="px-4 py-2 text-xs text-[#ff613c] border-r border-gray-300 text-start"
                        >
                          Rate
                        </th>
                        <th
                          class="px-4 py-2 text-xs text-[#ff613c] border-r border-gray-300 text-start"
                        >
                          Quantity
                        </th>
                        <th
                          class="px-4 py-2 text-xs text-[#ff613c] border-r border-gray-300 text-start"
                        >
                          Amount
                        </th>
                        <th
                          class="px-4 py-2 text-xs text-[#ff613c] border-gray-300 text-start"
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
                          <div class="" v-if="formitem.product_type == '4'">
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
                          <div class="" v-if="formitem.product_type == '6'">
                            <v-select
                              v-model="formitem.room_id"
                              class="style-chooser"
                              :options="roomType"
                              label="name"
                              :clearable="false"
                              :reduce="(d) => d.id"
                              @option:selected="
                                chooseCarPrice(
                                  formitem.product_type,
                                  formitem.product_id,
                                  formitem.room_id
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
                            after & today
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
                          v-if="formitem.product_type == '6'"
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
                          v-if="formitem.product_type != '6'"
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
                          <!-- <p>{{ formitem.selling_price }}</p> -->
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
                              class="fa-solid fa-plus text-xs font-semibold px-1 py-[1.5px] rounded-full shadow text-white bg-[#ff613c]"
                            ></i>
                          </button>
                        </td>
                      </tr>
                      <tr class="text-xs text-red-500 border-b border-gray-300">
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
                        :class="item.total_amount == 0 ? 'bg-gray-100' : ''"
                      >
                        <td
                          class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
                        >
                          <!-- <i
                            class="text-lg text-green-600 fa-solid fa-circle-check"
                          ></i>
                          <i
                            class="text-lg text-yellow-500 fa-solid fa-circle-exclamation"
                          ></i> -->
                          <i
                            v-if="!item.is_inclusive"
                            class="text-lg text-red-600 fa-solid fa-circle-xmark"
                          ></i>
                          <i
                            v-if="item.is_inclusive"
                            class="text-lg text-orange-600 fa-solid fa-circle-info"
                          ></i>
                        </td>
                        <td
                          class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
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
                          <p v-if="item.product_type == '5'">Inclusive</p>
                          <p v-if="item.product_type == '6'">Hotel</p>
                          <p v-if="item.product_type == '7'">AirLine</p>
                        </td>
                        <td
                          class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
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
                          <v-select
                            v-if="item.product_type == '5'"
                            v-model="item.product_id"
                            class="style-chooser"
                            :options="inclusives?.data"
                            label="name"
                            :clearable="false"
                            :reduce="(d) => d.id"
                            placeholder="Choose product type"
                          ></v-select>
                          <v-select
                            v-if="item.product_type == '6'"
                            v-model="item.product_id"
                            class="style-chooser"
                            :options="hotels?.data"
                            label="name"
                            disabled
                            :clearable="false"
                            :reduce="(d) => d.id"
                            placeholder="Choose product type"
                          ></v-select>
                          <v-select
                            v-if="item.product_type == '7'"
                            v-model="item.product_id"
                            class="style-chooser"
                            :options="airlines?.data"
                            label="name"
                            disabled
                            :clearable="false"
                            :reduce="(d) => d.id"
                            placeholder="Choose product type"
                          ></v-select>
                        </td>
                        <td
                          class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
                        >
                          <v-select
                            v-if="item.car_id && item.product_type != '7'"
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
                            v-if="item.car_id && item.product_type == '7'"
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
                            v-if="item.room_id"
                            v-model="item.room_id"
                            class="style-chooser"
                            disabled
                            :options="item.room_list"
                            label="name"
                            :clearable="false"
                            :reduce="(d) => d.id"
                            placeholder="Choose product type"
                          ></v-select>
                          <p v-if="!item.car_id && !item.room_id">-</p>
                        </td>
                        <td
                          class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
                        >
                          <input
                            v-if="!item.is_inclusive"
                            type="date"
                            v-model="item.service_date"
                            class="text-xs focus:outline-none"
                          />
                          <p class="text-xs" v-if="item.is_inclusive == 1">
                            {{ item.service_date }}
                          </p>
                        </td>
                        <td
                          class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
                        >
                          <p>
                            {{ item.selling_price }}
                          </p>
                        </td>
                        <td
                          v-if="item.product_type == '6'"
                          class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
                        >
                          <p v-if="!item.is_inclusive">
                            {{
                              hotelQ(
                                item.product_type,
                                item.days,
                                item.quantity
                              )
                            }}
                          </p>

                          <input
                            v-if="item.is_inclusive == 1"
                            type="number"
                            v-model="item.quantity"
                            name=""
                            class="px-4 py-4 text-sm border border-gray-300 rounded-sm w-[50px] focus:outline-none"
                            id=""
                            placeholder="xx"
                          />
                        </td>
                        <td
                          v-if="item.product_type != '6'"
                          class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
                        >
                          <p v-if="!item.is_inclusive">{{ item.quantity }}</p>
                          <input
                            v-if="item.is_inclusive == 1"
                            type="number"
                            v-model="item.quantity"
                            name=""
                            class="px-4 py-4 text-sm border border-gray-300 rounded-sm w-[50px] focus:outline-none"
                            id=""
                            placeholder="xx"
                          />
                        </td>
                        <td
                          class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
                        >
                          <p v-if="item.product_type != '6'">
                            {{ item.selling_price * item.quantity }}
                          </p>
                          <p v-if="item.product_type == '6'">
                            {{ item.selling_price * item.quantity * item.days }}
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
                                item.customer_attachment,
                                item.checkin_date,
                                item.checkout_date,
                                item.days,
                                item.room_number,
                                item.quantity,
                                item.is_inclusive
                              )
                            "
                          >
                            <i
                              class="fa-solid fa-ellipsis text-xs font-semibold px-1 py-[1.5px] bg-blue-500 rounded-full shadow text-white"
                              title="add description"
                            ></i>
                          </button>
                          <button
                            v-if="!item.is_inclusive"
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
                          class="px-4 py-3 text-sm text-center text-red-500 border-gray-300"
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
                  <div class="px-6 mt-6">
                    <div class="grid grid-cols-2 gap-4">
                      <p class="pr-8 mt-3 mb-2 text-sm text-gray-800 text-end">
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
                      <p class="pr-8 mt-3 mb-2 text-sm text-gray-800 text-end">
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
                      <p class="pr-8 mt-3 mb-2 text-sm text-gray-800 text-end">
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
                      <p class="pr-8 mt-3 mb-2 text-sm text-gray-800 text-end">
                        Deposit:
                      </p>
                      <input
                        type="text"
                        v-model="formData.deposit"
                        id="title"
                        class="w-full h-8 px-4 py-2 mt-2 text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
                      />
                    </div>
                    <!-- <div class="grid grid-cols-2 gap-4">
                      <p class="pr-8 mt-3 mb-2 text-sm text-gray-800 text-end">
                        Reciept Image
                      </p>
                      <input
                        @change="handlerFeatureFileChange"
                        type="file"
                        id="title"
                        class="w-full h-12 px-4 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
                      />
                    </div> -->
                    <div
                      class="grid grid-cols-2 gap-4"
                      v-if="formData.deposit > 0"
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
                          multiple
                          class="hidden"
                          @change="handlerFeatureFileChange"
                          accept="image/*"
                        />
                        <button
                          @click.prevent="openFileFeaturePicker"
                          class="text-sm text-[#ff613c]"
                        ></button>
                        <!-- <button
                          v-else
                          @click.prevent="removeFeatureSelectImage"
                          class="rounded-full text-sm text-red-600 absolute top-[4px] right-[-33px]"
                        >
                          <XCircleIcon class="w-8 h-8 font-semibold" />
                        </button> -->
                      </div>
                      <div
                        @click.prevent="openFileFeaturePicker"
                        class="cursor-pointer mt-2 w-full h-[100px] border-2 border-dashed border-gray-400 rounded flex justify-center items-center"
                      >
                        <span class="text-xs"
                          ><i
                            class="px-5 py-3 text-lg font-semibold text-white bg-[#ff613c] rounded-full shadow fa-solid fa-plus"
                          ></i
                        ></span>
                      </div>
                      <!-- <div v-if="featureImagePreview" class="">
                        <img
                          class="w-full h-auto mt-2 rounded"
                          :src="featureImagePreview"
                          alt=""
                        />
                      </div> -->
                      <!-- <div
                        class="grid grid-cols-2 col-span-2 gap-4 bg-gray-200/50"
                        v-if="featureImagePreview.length != 0"
                      >
                        <div
                          v-for="(image, index) in featureImagePreview"
                          :key="index"
                        >
                          <a :href="image" target="_blink">
                            <img :src="image" alt="" />
                          </a>
                        </div>
                      </div> -->
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
                    <div class="grid grid-cols-2 gap-4">
                      <p class="pr-8 mt-3 mb-2 text-sm text-gray-800 text-end">
                        Balance Due:
                      </p>
                      <input
                        type="text"
                        disabled
                        v-model="balance_due"
                        id="title"
                        class="w-full h-8 px-4 py-2 mt-2 text-gray-900 bg-gray-300 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-300"
                      />
                    </div>
                    <!-- <div class="grid grid-cols-2 gap-4">
                      <p class="pr-8 mt-3 mb-2 text-sm text-gray-800 text-end">
                        Due Date:
                      </p>
                      <input
                        type="date"
                        v-model="formData.balance_due_date"
                        id="title"
                        class="w-full h-8 px-4 py-2 mt-2 text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
                      />
                    </div> -->
                    <div class="mt-6 mb-3 text-end" v-show="allowCreate">
                      <Button
                        @click.prevent="onSubmitHandler"
                        class="py-2 px-14"
                      >
                        Create
                      </Button>
                    </div>
                    <div class="mt-6 mb-3 text-end" v-show="!allowCreate">
                      <Button class="py-2 bg-gray-400 px-14"> Create </Button>
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
