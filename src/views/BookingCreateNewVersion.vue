<script setup>
import Layout from "./Layout.vue";
import {
  XCircleIcon,
  ArrowDownTrayIcon,
  UserIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/outline";
import { PlusIcon, ListBulletIcon } from "@heroicons/vue/24/outline";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import OverView from "./BookingComponent/Vantour.vue";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { Switch } from "@headlessui/vue";
import Modal from "../components/Modal.vue";
import { useToast } from "vue-toastification";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import Vantour from "./BookingComponent/Vantour.vue";
import ItemList from "./BookingComponent/ItemList.vue";
import VantourImage from "../../src/assets/road-trip.png";
import HotelImage from "../../src/assets/hotel.png";
import AttractionImage from "../../src/assets/attractions icon.svg";
import AirlineImage from "../../src/assets/flight icon.svg";
import InclusivePart from "./BookingComponent/InclusivePart.vue";
import CustomerInfo from "./BookingComponent/CustomerInfo.vue";
import PaymentDetail from "./BookingComponent/PaymentDetail.vue";
import { useBookingStore } from "../stores/booking";
import Attraction from "./BookingComponent/Attraction.vue";
import Hotel from "./BookingComponent/Hotel.vue";
import Airline from "./BookingComponent/Airline.vue";
import TaxInfo from "./BookingComponent/TaxInfo.vue";
import { useAdminStore } from "../stores/admin";
// import RestaurantImage from "../../public/restaurant-svgrepo-com.svg";

// for tag
const currentTag = ref("Van Tours");
const currentSubTag = ref("items");
const addItemModal = ref(false);
const bookingStore = useBookingStore();
const toast = useToast();
const adminStore = useAdminStore();
const router = useRouter();

const productArray = [
  {
    id: 1,
    name: "Van Tours",
    image: VantourImage,
  },
  {
    id: 2,
    name: "Attractions",
    image: AttractionImage,
  },
  {
    id: 3,
    name: "Hotels",
    image: HotelImage,
  },
  {
    id: 4,
    name: "Airline",
    image: AirlineImage,
  },
  // {
  //   id: 5,
  //   name: "Restaurants",
  //   image: RestaurantImage,
  // },
];

// Map tags to corresponding components
const componentsMap = {
  "Van Tours": Vantour,
  Attractions: Attraction,
  Hotels: Hotel,
  Restaurants: Vantour,
  Airline: Airline,
};

// Compute the current component based on the tag
const currentComponent = computed(
  () => componentsMap[currentTag.value] || Vantour
);

// data add action part
const formData = ref({
  payment_notes: "",
  transfer_code: "",
  customer_id: "",
  customer_name: "",
  customer_phone: "",
  customer_email: "",
  is_corporate: "",
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
  is_inclusive: "",
  inclusive_name: "",
  inclusive_description: "",
  inclusive_quantity: "",
  inclusive_rate: "",
  inclusive_start_date: "",
  inclusive_end_date: "",
});

const sub_total = computed(() => {
  if (formData.value.is_inclusive != 1) {
    let totalsub = 0;
    for (let i = 0; i < formData.value.items.length; i++) {
      // if (!formData.value.items[i].is_inclusive) {
      //   totalsub = totalsub + formData.value.items[i].total_amount;
      // }
      totalsub = totalsub + formData.value.items[i].total_amount * 1;
    }
    return totalsub + sub_total_discount.value * 1;
  } else {
    return formData.value.inclusive_rate * formData.value.inclusive_quantity;
  }
});

const sub_total_real = computed(() => {
  if (formData.value.is_inclusive != 1) {
    let totalsub = 0;
    for (let i = 0; i < formData.value.items.length; i++) {
      if (!formData.value.items[i].is_inclusive) {
        if (formData.value.items[i].product_type != "7") {
          totalsub = totalsub + formData.value.items[i].total_amount * 1;
        }
      }
    }
    return totalsub + sub_total_discount.value * 1;
  } else {
    return formData.value.inclusive_rate * formData.value.inclusive_quantity;
  }
});

const sub_total_discount = computed(() => {
  if (formData.value.is_inclusive != 1) {
    let totalsub = 0;
    for (let i = 0; i < formData.value.items.length; i++) {
      if (!formData.value.items[i].is_inclusive) {
        totalsub = totalsub + formData.value.items[i].discount;
      }
    }
    return totalsub;
  } else {
    return 0;
  }
});

const sub_qty_total = computed(() => {
  let totalsub = 0;
  if (formitem.value.days) {
    totalsub =
      formitem.value.quantity *
        formitem.value.selling_price *
        formitem.value.days -
      formitem.value.discount;
    formitem.value.total_amount = totalsub;
    return totalsub;
  } else {
    totalsub =
      formitem.value.quantity * formitem.value.selling_price -
      formitem.value.discount;
    formitem.value.total_amount = totalsub;
    return totalsub;
  }
});

const sub_total_airline = computed(() => {
  if (formData.value.is_inclusive != 1) {
    let totalsub = 0;
    for (let i = 0; i < formData.value.items.length; i++) {
      if (!formData.value.items[i].is_inclusive) {
        if (formData.value.items[i].product_type == "7") {
          totalsub = totalsub + formData.value.items[i].total_amount;
        }
      }
    }
    return totalsub;
  } else {
    return 0;
  }
});

const grand_total_real = computed(() => {
  let final = sub_total_real.value - sub_total_discount.value * 1;
  return final;
});

const balance_due_real = computed(() => {
  if (
    grand_total_real.value - formData.value.deposit == 0 &&
    formData.value.items.length != 0
  ) {
    return grand_total_real.value - formData.value.deposit;
  } else if (
    grand_total_real.value - formData.value.deposit != 0 &&
    formData.value.items.length != 0 &&
    formData.value.deposit != 0
  ) {
    return grand_total_real.value - formData.value.deposit;
  } else if (formData.value.deposit == 0 && formData.value.items.length != 0) {
    return grand_total_real.value - formData.value.deposit;
  }
});

const grand_total = computed(() => {
  let final = sub_total.value - sub_total_discount.value * 1;
  return final;
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

const removeItemList = (message) => {
  if (
    !message ||
    typeof message.id === "undefined" ||
    typeof message.index === "undefined"
  ) {
    console.error("Invalid 'message' object. Must have both 'id' and 'index'.");
    return;
  }

  const items = formData.value.items;

  // Ensure 'items' is an array
  if (!Array.isArray(items)) {
    console.error("'formData.value.items' is not an array.");
    return;
  }

  // Validate the index and item
  const itemAtIndex = items[message.index];
  if (itemAtIndex && itemAtIndex.product_id === message.id) {
    items.splice(message.index, 1); // Remove the item if the conditions match
  } else {
    console.warn("No matching item found at the provided index.");
  }
};
const changeGetForm = (data) => {
  console.log(data);
  formData.value.balance_due_date = data.balance_due_date;
  formData.value.booking_date = data.booking_date;
  formData.value.money_exchange_rate = data.money_exchange_rate;
  formData.value.payment_currency = data.payment_currency;
  formData.value.payment_method = data.payment_method;
  formData.value.bank_name = data.bank_name;

  formData.value.is_inclusive = data.is_inclusive;
  // console.log("====================================");
  // console.log(formData.value, "this is inclusive ");
  // console.log("====================================");
};

const changeGetTaxForm = (data) => {
  formData.value.transfer_code = data.transfer_code;
};

const changeGetInclusiveForm = (data) => {
  // console.log(data);
  // formData.value.is_inclusive = data.is_inclusive;
  formData.value.inclusive_name = data.inclusive_name;
  formData.value.inclusive_quantity = data.inclusive_quantity;
  formData.value.inclusive_rate = data.inclusive_rate;
  formData.value.inclusive_start_date = data.inclusive_start_date;
  formData.value.inclusive_end_date = data.inclusive_end_date;
  formData.value.inclusive_description = data.inclusive_description;

  // currentSubTag.value = "items";
  // console.log(formData.value, "this is inclusive ");
};
const formitem = ref({});
const changeGetItem = (data) => {
  console.log(data, "this is data");
  if (formData.value.is_inclusive == 1) {
    formitem.value.is_inclusive = 1;
  } else {
    formitem.value.is_inclusive = "";
  }
  formitem.value = data;
  addNewitem();
  formitem.value = {};
  console.log(formData.value.items, "this is push items");
};
const changeItemList = (data) => {
  console.log(data, "this is change item value");
  if (formData.value.is_inclusive == 1) {
    formData.value.items[data.id].is_inclusive = 1;
  } else {
    formData.value.items[data.id].is_inclusive = "";
  }
  formData.value.items[data.id] = data.data;
};

const addNewitem = () => {
  formData.value.items.push(formitem.value);
};

const customerId = (data) => {
  console.log(data);
  formData.value.customer_id = data.id;
  formData.value.customer_name = data.name;
  formData.value.customer_email = data.email;
  formData.value.customer_phone = data.phone_number;
  formData.value.is_corporate = data.is_corporate_customer;
  formData.value.sold_from = data.sold_from;
  formData.value.is_past_info = data.is_past_info;
  formData.value.past_crm_id = data.past_crm_id;
  formData.value.past_user_id = data.past_user_id;
};

// const getDeleteFunction = (id) => {
//   formData.value.items.splice(id, 1);
// };

const featureImageInput = ref(null);
const featureImagePreview = ref([]);

const openFileFeaturePicker = () => {
  featureImageInput.value.click();
};

const handlerFeatureFileChange = (e) => {
  let selectedFile = e.target.files;

  for (let index = 0; index < selectedFile.length; index++) {
    let inputValue = {
      file: selectedFile[index],
      amount: 0,
    };
    formData.value.receipt_image.push(inputValue);
    let expData = {
      file: URL.createObjectURL(selectedFile[index]),
      amount: 0,
    };
    featureImagePreview.value.push(expData);
  }
};

const removeFeatureSelectImage = (index) => {
  formData.value.receipt_image.splice(index, 1);
  featureImagePreview.value.splice(index, 1);
  console.log(formData.value.receipt_image, "this is remove");
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

const errors = ref(null);
const onSubmitHandler = async () => {
  if (sub_total_real.value != NaN || sub_total_real.value != null) {
    const frmData = new FormData();
    formData.value.customer_id &&
      frmData.append("customer_id", formData.value.customer_id);
    formData.value.payment_notes &&
      frmData.append("payment_notes", formData.value.payment_notes);
    formData.value.transfer_code &&
      frmData.append("transfer_code", formData.value.transfer_code);
    formData.value.sold_from &&
      frmData.append("sold_from", formData.value.sold_from);
    formData.value.payment_method &&
      frmData.append("payment_method", formData.value.payment_method);
    formData.value.bank_name &&
      frmData.append("bank_name", formData.value.bank_name);
    formData.value.comment && frmData.append("comment", formData.value.comment);

    formData.value.is_past_info
      ? frmData.append("is_past_info", 1)
      : frmData.append("is_past_info", 0);
    formData.value.past_crm_id &&
      frmData.append("past_crm_id", formData.value.past_crm_id);
    formData.value.past_user_id &&
      frmData.append("past_user_id", formData.value.past_user_id);

    formData.value.payment_status &&
      frmData.append("payment_status", formData.value.payment_status);
    formData.value.booking_date &&
      frmData.append("booking_date", formData.value.booking_date);
    if (formData.value.money_exchange_rate) {
      frmData.append("money_exchange_rate", formData.value.money_exchange_rate);
    } else {
      frmData.append("money_exchange_rate", 0);
    }
    sub_total_discount.value
      ? frmData.append("discount", sub_total_discount.value)
      : frmData.append("discount", 0);

    if (formData.value.is_inclusive == 1) {
      frmData.append("is_inclusive", formData.value.is_inclusive);
      frmData.append("inclusive_name", formData.value.inclusive_name);
      frmData.append("inclusive_quantity", formData.value.inclusive_quantity);
      frmData.append("inclusive_rate", formData.value.inclusive_rate);
      frmData.append(
        "inclusive_start_date",
        formData.value.inclusive_start_date
      );
      frmData.append("inclusive_end_date", formData.value.inclusive_end_date);
      frmData.append(
        "inclusive_description",
        formData.value.inclusive_description
      );
    }

    sub_total_real.value && frmData.append("sub_total", sub_total_real.value);
    sub_total_airline.value &&
      frmData.append("exclude_amount", sub_total_airline.value);
    grand_total_real.value &&
      frmData.append("grand_total", grand_total_real.value);
    formData.value.deposit && frmData.append("deposit", formData.value.deposit);
    formData.value.payment_currency &&
      frmData.append("payment_currency", formData.value.payment_currency);
    balance_due_real.value &&
      frmData.append("balance_due", balance_due_real.value);
    formData.value.balance_due_date &&
      frmData.append("balance_due_date", formData.value.balance_due_date);

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
        frmData.append(
          "items[" + x + "][product_type]",
          `App\\Models\\Airline`
        );
      }
    }

    if (formData.value.receipt_image.length != 0) {
      for (let x = 0; x < formData.value.receipt_image.length; x++) {
        let file = formData.value.receipt_image[x].file;
        let amount = formData.value.receipt_image[x].amount;
        frmData.append("receipt_image[" + x + "][file]", file);
        frmData.append("receipt_image[" + x + "][amount]", amount);
      }
    }

    for (var x = 0; x < formData.value.items.length; x++) {
      frmData.append(
        "items[" + x + "][product_id]",
        formData.value.items[x].product_id
      );
      if (formData.value.is_inclusive == 1) {
        frmData.append("items[" + x + "][is_inclusive]", 1);
      } else {
        frmData.append("items[" + x + "][is_inclusive]", 0);
      }

      frmData.append(
        "items[" + x + "][amount]",
        formData.value.items[x].total_amount
      );

      formData.value.items[x].pickup_location
        ? frmData.append(
            "items[" + x + "][pickup_location]",
            formData.value.items[x].pickup_location
          )
        : "";

      if (formData.value.items[x].pickup_time) {
        frmData.append(
          "items[" + x + "][pickup_time]",
          formData.value.items[x].pickup_time
        );
      }
      frmData.append(
        "items[" + x + "][is_driver_collect]",
        formData.value.items[x].is_driver_collect ? 1 : 0
      );
      if (formData.value.items[x].customer_attachment) {
        frmData.append(
          "items[" + x + "][customer_attachment]",
          formData.value.items[x].customer_attachment
        );
      }
      // add new cost price & total_cost_price
      if (formData.value.items[x].cost_price) {
        frmData.append(
          "items[" + x + "][cost_price]",
          formData.value.items[x].cost_price
        );
      }

      if (formData.value.items[x].individual_pricing) {
        frmData.append(
          "items[" + x + "][individual_pricing][adult][quantity]",
          formData.value.items[x].individual_pricing.adult.quantity
        );
        frmData.append(
          "items[" + x + "][individual_pricing][adult][selling_price]",
          formData.value.items[x].individual_pricing.adult.selling_price
        );
        frmData.append(
          "items[" + x + "][individual_pricing][adult][cost_price]",
          formData.value.items[x].individual_pricing.adult.cost_price
        );
        frmData.append(
          "items[" + x + "][individual_pricing][adult][total_cost_price]",
          formData.value.items[x].individual_pricing.adult.total_cost_price
        );
        frmData.append(
          "items[" + x + "][individual_pricing][adult][amount]",
          formData.value.items[x].individual_pricing.adult.amount
        );
        frmData.append(
          "items[" + x + "][individual_pricing][child][quantity]",
          formData.value.items[x].individual_pricing.child.quantity
        );
        frmData.append(
          "items[" + x + "][individual_pricing][child][selling_price]",
          formData.value.items[x].individual_pricing.child.selling_price
        );
        frmData.append(
          "items[" + x + "][individual_pricing][child][cost_price]",
          formData.value.items[x].individual_pricing.child.cost_price
        );
        frmData.append(
          "items[" + x + "][individual_pricing][child][total_cost_price]",
          formData.value.items[x].individual_pricing.child.total_cost_price
        );
        frmData.append(
          "items[" + x + "][individual_pricing][child][amount]",
          formData.value.items[x].individual_pricing.child.amount
        );
      }

      if (formData.value.items[x].discount) {
        frmData.append(
          "items[" + x + "][discount]",
          formData.value.items[x].discount
        );
      } else {
        frmData.append("items[" + x + "][discount]", 0);
      }
      frmData.append(
        "items[" + x + "][total_cost_price]",
        formData.value.items[x].total_cost_price
      );
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

      if (formData.value.items[x].product_type == "6") {
        frmData.append(
          "items[" + x + "][room_id]",
          formData.value.items[x].car_id
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
      formData.value.items[x].service_date &&
        frmData.append(
          "items[" + x + "][service_date]",
          formData.value.items[x].service_date
        );
      formData.value.items[x].quantity &&
        frmData.append(
          "items[" + x + "][quantity]",
          formData.value.items[x].quantity
        );
      formData.value.days &&
        frmData.append("items[" + x + "][days]", formData.value.items[x].days);
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
      formData.value.items[x].selling_price &&
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
      formData.value.items[x].reservation_status &&
        frmData.append(
          "items[" + x + "][reservation_status]",
          formData.value.items[x].reservation_status
        );
      formData.value.items[x].payment_method &&
        frmData.append(
          "items[" + x + "][payment_method]",
          formData.value.items[x].payment_method
        );
      formData.value.items[x].payment_status &&
        frmData.append(
          "items[" + x + "][payment_status]",
          formData.value.items[x].payment_status
        );
      // frmData.append(
      //   "items[" + x + "][exchange_rate]",
      //   formData.value.items[x].exchange_rate
      // );
      formData.value.items[x].exchange_rate &&
        frmData.append(
          "items[" + x + "][exchange_rate]",
          formData.value.items[x].exchange_rate
        );
    }

    try {
      const response = await bookingStore.addNewAction(frmData);
      console.log(response, "create response");
      formData.value = {
        customer_id: "",
        transfer_code: "",
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
        is_past_info: false,
        past_crm_id: "",
      };

      errors.value = null;
      toast.success(response.message);
      featureImagePreview.value = [];
      // router.push("/bookings/new-update/" + response.result.id);
      // bookings/update/65/edit
    } catch (error) {
      console.log(
        "🚀 ~ file: NewBlogView.vue:38 ~ onSubmitHandler ~ error:",
        error
      );
      if (error.response.data.errors) {
        errors.value = error.response.data.errors;
      }
      toast.error(error.response?.data?.message);
    }
  } else {
    toast.warning("please check again , item have issue !");
  }
};

onMounted(async () => {
  await adminStore.getSimpleListAction();
});
</script>

<template>
  <Layout>
    <div class="grid grid-cols-6 gap-4">
      <div class="col-span-4 h-[85vh] overflow-hidden">
        <div class="space-y-4">
          <!-- sale info part -->
          <div
            class="flex justify-start items-center gap-x-2 overflow-x-scroll no-sidebar-container pb-2 border-r border-gray-300"
          >
            <div
              v-for="l in productArray"
              :key="l"
              @click="currentTag = l.name"
              class="p-2 shadow-sm rounded-md flex justify-start items-center gap-x-2 cursor-pointer hover:bg-[#ff613c]/20"
              :class="
                currentTag == l.name
                  ? 'bg-[#ff613c] text-white font-semibold'
                  : 'bg-white'
              "
            >
              <img
                :src="l.image"
                class="w-12 h-12 p-2 rounded-xl"
                :class="
                  currentTag == l.name
                    ? 'bg-[#ff613c]'
                    : ' bg-gradient-to-r to-[#ff613c] from-[#ff5b00]/50 text-[#FF5B00]'
                "
                alt=""
              />
              <div class="w-[130px] space-y-1">
                <p class="whitespace-nowrap text-[10px] font-medium">
                  {{ l.name }}
                </p>
                <p
                  :class="currentTag == l.name ? 'test-white' : 'text-gray-500'"
                  class="text-[8px] font-normal whitespace-nowrap"
                >
                  +100 Products
                </p>
              </div>
            </div>
          </div>

          <!-- tag part -->

          <transition name="slide" mode="out-in">
            <component
              :is="currentComponent"
              :key="currentTag"
              @formData="changeGetItem"
            />
          </transition>
        </div>
      </div>
      <div
        class="col-span-2 h-[85vh] relative overflow-y-scroll no-sidebar-container space-y-4"
      >
        <!-- create -->
        <div class="text-end">
          <button
            @click="onSubmitHandler"
            v-show="allowCreate"
            class="text-center bg-[#ff613c] py-2 px-4 text-xs text-white rounded-lg"
          >
            + Create
          </button>
          <button
            v-show="!allowCreate"
            class="text-center bg-gray-400 py-2 px-4 text-xs text-white rounded-lg"
          >
            + Create
          </button>
        </div>
        <!-- tags -->
        <div
          class="bg-white flex justify-start sticky top-0 overflow-x-scroll no-sidebar-container z-30 items-center gap-x-2 rounded-xl p-1.5"
        >
          <p
            class="rounded-lg px-5 py-1.5 text-[10px] cursor-pointer hover:bg-[#ff613c]/20 whitespace-nowrap"
            @click="currentSubTag = 'items'"
            :class="currentSubTag == 'items' ? 'bg-[#ff613c] text-white' : ' '"
          >
            Items
          </p>

          <p
            class="rounded-lg px-5 py-1.5 text-[10px] cursor-pointer hover:bg-[#ff613c]/20 whitespace-nowrap"
            @click="currentSubTag = 'info'"
            :class="currentSubTag == 'info' ? 'bg-[#ff613c] text-white' : ' '"
          >
            Customer Information
          </p>
          <p
            class="rounded-lg px-5 py-1.5 text-[10px] cursor-pointer hover:bg-[#ff613c]/20 whitespace-nowrap"
            @click="currentSubTag = 'payment'"
            :class="
              currentSubTag == 'payment' ? 'bg-[#ff613c] text-white' : ' '
            "
          >
            Payment detail
          </p>
          <p
            class="rounded-lg px-5 py-1.5 text-[10px] cursor-pointer hover:bg-[#ff613c]/20 whitespace-nowrap"
            @click="currentSubTag = 'tax'"
            :class="currentSubTag == 'tax' ? 'bg-[#ff613c] text-white' : ' '"
          >
            Tax Infomation
          </p>
          <!-- <p
            class="rounded-lg px-5 py-1.5 text-[10px] cursor-pointer hover:bg-[#ff613c]/20 whitespace-nowrap"
            @click="currentSubTag = 'payment'"
            :class="
              currentSubTag == 'inclusive' ? 'bg-[#ff613c] text-white' : ' '
            "
          >
            Inclusive
          </p> -->
        </div>
        <!-- tags result -->
        <div
          v-if="currentSubTag == 'items'"
          class="min-h-[10vh] max-h-[50vh] bg-white rounded-lg overflow-y-scroll no-sidebar-container px-3"
        >
          <ItemList :data="formData" @remove="removeItemList" />
        </div>

        <div v-if="currentSubTag == 'info'" class="">
          <CustomerInfo @checked="customerId" :data="formData" />
        </div>
        <div v-if="currentSubTag == 'payment'" class="bg-white rounded-lg px-3">
          <PaymentDetail :data="formData" @formData="changeGetForm" />
        </div>
        <div v-if="currentSubTag == 'tax'" class="bg-white rounded-lg px-3">
          <TaxInfo :data="formData" @formData="changeGetTaxForm" />
        </div>
        <div
          v-if="(formData.is_inclusive == 1) & (currentSubTag == 'payment')"
          class="bg-white rounded-lg px-3"
        >
          <InclusivePart :data="formData" @formData="changeGetInclusiveForm" />
        </div>
        <!-- comment -->
        <div class="px-3 pt-2 pb-1 bg-white rounded-lg">
          <div class="">
            <p class="text-xs font-medium whitespace-nowrap">Sale Comment :</p>
            <textarea
              name=""
              v-model="formData.comment"
              id=""
              class="px-2 py-1.5 mt-1.5 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-300 text-xs w-full"
            ></textarea>
          </div>
        </div>
        <!-- suummary -->
        <div class="p-3 bg-white rounded-lg">
          <p class="text-xs font-medium text-[#ff613c] pb-2">Payment Summary</p>
          <div class="flex justify-between items-center">
            <p class="text-xs font-medium">Sub Total :</p>
            <input
              type="text"
              disabled
              v-model="sub_total"
              id="title"
              class="w-[140px] h-8 px-4 py-1.5 mt-1 text-gray-900 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-300 text-xs"
            />
          </div>
          <div class="flex justify-between items-center">
            <p class="text-xs font-medium">Discount :</p>
            <input
              type="text"
              v-model="sub_total_discount"
              id="title"
              disabled
              class="w-[140px] h-8 px-4 py-1.5 mt-1 text-gray-900 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-300 text-xs"
            />
          </div>
          <div class="flex justify-between items-center">
            <p class="text-xs font-medium">Total :</p>
            <input
              type="text"
              disabled
              v-model="grand_total"
              id="title"
              class="w-[140px] h-8 px-4 py-1.5 mt-1 text-gray-900 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-300 text-xs"
            />
          </div>
          <div class="flex justify-between items-center">
            <p class="text-xs font-medium">Deposit :</p>
            <input
              type="text"
              v-model="formData.deposit"
              id="title"
              class="w-[140px] h-8 px-4 py-1.5 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-300 text-xs"
            />
          </div>
          <div class="flex justify-between items-center">
            <p class="text-xs font-medium">Balance Due :</p>
            <input
              type="text"
              v-model="balance_due"
              disabled
              id="title"
              class="w-[140px] h-8 px-4 py-1.5 mt-1 text-gray-900 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-300 text-xs"
            />
          </div>

          <div
            class="flex justify-between items-start"
            v-if="formData.deposit > 0"
          >
            <p class="text-xs font-medium pt-2">Reciept Image :</p>
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
            <div
              class="cursor-pointer mt-2 w-[140px] h-[80px] border-2 border-dashed border-gray-300 rounded flex justify-center items-center"
              @click.prevent="openFileFeaturePicker"
            >
              <span class="text-xs"
                ><i
                  class="px-2 py-1 text-sm font-semibold text-white bg-[#ff613c] rounded-full shadow fa-solid fa-plus"
                ></i
              ></span>
            </div>
          </div>
        </div>
        <!-- receipt image -->
        <!-- <div class="h-[20vh] rounded-lg text-sm text-[#ff613c]">Images</div> -->
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

            <img class="h-auto w-full rounded" :src="image.file" alt="" />
            <input
              type="number"
              name="amount"
              v-model="formData.receipt_image[index].amount"
              id=""
              class="w-full h-8 bg-white border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease-in-out;
}

.slide-enter {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

.no-sidebar-container {
  scrollbar-width: none; /* For Firefox */
  -ms-overflow-style: none; /* For IE and Edge */
}
.no-sidebar-container::-webkit-scrollbar {
  display: none; /* For Chrome, Safari, and Opera */
}
</style>
