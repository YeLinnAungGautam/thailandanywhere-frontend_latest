<script setup>
import Layout from "./Layout.vue";
import {
  XCircleIcon,
  ArrowDownTrayIcon,
  UserIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  PrinterIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";
import { PlusIcon, ListBulletIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import OverView from "./BookingComponent/Vantour.vue";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { Switch } from "@headlessui/vue";
import Modal from "../components/Modal.vue";
import Swal from "sweetalert2";
// import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useToast } from "vue-toastification";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import Vantour from "./BookingComponent/Vantour.vue";
import Airline from "./BookingComponent/Airline.vue";
import ItemList from "./BookingComponent/ItemList.vue";
import VantourImage from "../../src/assets/road-trip.png";
import HotelImage from "../../src/assets/hotel.png";
import AttractionImage from "../../src/assets/attractions icon.svg";
import AirlineImage from "../../src/assets/flight icon.svg";
import InclusivePart from "./BookingComponent/InclusivePart.vue";
import CustomerInfo from "./BookingComponent/CustomerInfo.vue";
import PaymentDetail from "./BookingComponent/PaymentDetail.vue";
import { useBookingStore } from "../stores/booking";
import { useAdminStore } from "../stores/admin";
import Attraction from "./BookingComponent/Attraction.vue";
import Hotel from "./BookingComponent/Hotel.vue";
import DetailItemVue from "./BookingComponent/DetailItem.vue";
import DetailListVue from "./BookingComponent/DetailList.vue";
import { useAuthStore } from "../stores/auth";
import { useUserStore } from "../stores/user";
import TaxInfo from "./BookingComponent/TaxInfo.vue";
import PngUsage from "./PngGenerate/PngUsage.vue";
import { daysBetween } from "./help/DateBetween";
import ArchiveConfirmationModal from "./BookingComponent/ConfirmationModel.vue";
// import RestaurantImage from "../../public/restaurant-svgrepo-com.svg";

// for tag
const currentTag = ref("Van Tours");
const currentSubTag = ref("items");
const addItemModal = ref(false);
const bookingStore = useBookingStore();
const toast = useToast();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const userStore = useUserStore();
const adminStore = useAdminStore();

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
    name: "Airlines",
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
  Airlines: Airline,
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
  user_id: "",
  user_name: "",
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
  receipt_images: [],
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
      if (formData.value.items[i].cancellation != "cancel_confirm") {
        totalsub = totalsub + formData.value.items[i].total_amount;
      }
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
          if (formData.value.items[i].cancellation != "cancel_confirm") {
            totalsub = totalsub + formData.value.items[i].total_amount;
          }
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
        if (formData.value.items[i].cancellation != "cancel_confirm") {
          totalsub = totalsub + formData.value.items[i].discount;
        }
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
          if (formData.value.items[i].cancellation != "cancel_confirm") {
            totalsub = totalsub + formData.value.items[i].total_amount;
          }
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
  formData.value.is_past_info = data.is_past_info;
  formData.value.past_crm_id = data.past_crm_id;
  formData.value.past_user_id = data.past_user_id;
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

const checkCondition = ref(false);
const allowCreate = computed(() => {
  // console.log(checkCondition.value, "this is check");
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

const errors = ref(null);
const updatingLoading = ref(false);
const required_archive = ref(false);

const openModalArchive = ref(false);
const openModalArchiveConfirmation = ref(false);
const openPrintModal = ref(false);

const validateItemByType = (item) => {
  switch (item.product_type) {
    case "1": // PrivateVanTour
    case "2": // GroupTour
    case "3": // AirportPickup
      if (!item.service_date) {
        toast.warning(
          "ပစ္စည်းတစ်ခု၏ ဝန်ဆောင်မှုရက်စွဲကို ထည့်သွင်းရန် လိုအပ်ပါသည်"
        );
        return false;
      }
      if (!item.car_id) {
        toast.warning("ကားအမျိုးအစား ရွေးချယ်ရန် လိုအပ်ပါသည်");
        return false;
      }
      break;
    case "4": // EntranceTicket
      if (!item.car_id) {
        toast.warning("Variation ကို ရွေးချယ်ရန် လိုအပ်ပါသည်");
        return false;
      }
      if (!item.service_date) {
        toast.warning("ဝန်ဆောင်မှုရက်စွဲကို ထည့်သွင်းရန် လိုအပ်ပါသည်");
        return false;
      }
      break;
    case "5": // Inclusive
      if (!item.service_date) {
        toast.warning(
          "Inclusive ဝန်ဆောင်မှုရက်စွဲကို ထည့်သွင်းရန် လိုအပ်ပါသည်"
        );
        return false;
      }
      break;
    case "6": // Hotel
      if (!item.car_id) {
        toast.warning("အခန်းအမျိုးအစားကို ရွေးချယ်ရန် လိုအပ်ပါသည်");
        return false;
      }
      if (!item.checkin_date || !item.checkout_date) {
        toast.warning(
          "ဟိုတယ်အတွက် Check-in နှင့် Check-out ရက်စွဲများ ထည့်သွင်းရန် လိုအပ်ပါသည်"
        );
        return false;
      }
      break;
    case "7": // Airline
      if (!item.car_id) {
        toast.warning("လက်မှတ်အမျိုးအစားကို ရွေးချယ်ရန် လိုအပ်ပါသည်");
        return false;
      }
      if (!item.service_date) {
        toast.warning("ခရီးစဉ်ရက်စွဲကို ထည့်သွင်းရန် လိုအပ်ပါသည်");
        return false;
      }
      break;
  }

  if (!item.total_amount) {
    toast.warning("စုစုပေါင်းတန်ဖိုး ထည့်သွင်းရန် လိုအပ်ပါသည်");
    return false;
  }

  return true;
};

const validateBasicInfo = () => {
  if (!formData.value.customer_id) {
    toast.warning("ဖောက်သည် ရွေးချယ်ရန် လိုအပ်ပါသည်");
    return false;
  }

  if (!formData.value.payment_method) {
    toast.warning("ငွေပေးချေမှု နည်းလမ်း ရွေးရန် လိုအပ်ပါသည်");
    return false;
  }

  if (!formData.value.booking_date) {
    toast.warning("စာရင်းသွင်းသည့်ရက်စွဲ ထည့်သွင်းရန် လိုအပ်ပါသည်");
    return false;
  }

  if (!formData.value.payment_status) {
    toast.warning("ငွေပေးချေမှု အခြေအနေ ရွေးချယ်ရန် လိုအပ်ပါသည်");
    return false;
  }

  if (formData.value.items.length === 0) {
    toast.warning("အနည်းဆုံး ပစ္စည်းတစ်ခု ထည့်သွင်းရန် လိုအပ်ပါသည်");
    return false;
  }

  return true;
};

const onSubmitHandler = async () => {
  if (!isNaN(sub_total_real.value) && sub_total_real.value !== null) {
    // Show the confirmation modal instead of immediately submitting
    openModalArchiveConfirmation.value = true;
  } else {
    toast.warning("please check again, item have issue!");
  }
};

// Event handlers for the modal
const handleArchiveUpdate = () => {
  // Handle archive update
  updateAuthAction();
  openModalArchiveConfirmation.value = false;
};

const handleNormalUpdate = () => {
  // Handle normal update
  updateAuthAction();
  openModalArchiveConfirmation.value = false;
};

const closeModal = () => {
  openModalArchiveConfirmation.value = false;
};

const updateAuthAction = async () => {
  if (authStore.isSuperAdmin) {
    openModalArchive.value = true;
  } else {
    await processSubmission();
  }
};
const archiveUpdate = async () => {
  required_archive.value = true;
  await processSubmission();
  openModalArchive.value = false;
};
const normalUpdate = async () => {
  required_archive.value = false;
  await processSubmission();
  openModalArchive.value = false;
};

const processSubmission = async () => {
  updatingLoading.value = true;
  if (!isNaN(sub_total_real.value) && sub_total_real.value !== null) {
    if (!validateBasicInfo()) {
      return;
    }

    const frmData = new FormData();
    frmData.append("_method", "PUT");
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
    frmData.append(
      "user_id",
      formData.value.user_id ? formData.value.user_id : 0
    );

    formData.value.payment_status &&
      frmData.append("payment_status", formData.value.payment_status);
    formData.value.booking_date &&
      frmData.append("booking_date", formData.value.booking_date);
    if (formData.value.money_exchange_rate) {
      frmData.append("money_exchange_rate", formData.value.money_exchange_rate);
    } else {
      frmData.append("money_exchange_rate", 0);
    }

    required_archive.value && frmData.append("required_archive", true);

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

    if (formData.value.receipt_image?.length > 0) {
      for (let x = 0; x < formData.value.receipt_image.length; x++) {
        let file = formData.value.receipt_image[x].file;
        let amount = formData.value.receipt_image[x].amount;
        frmData.append("receipt_image[" + x + "][file]", file);
        frmData.append("receipt_image[" + x + "][amount]", amount);
      }
    }

    for (var x = 0; x < formData.value?.items.length; x++) {
      if (!validateItemByType(formData.value.items[x])) {
        return;
      }
      frmData.append(
        "items[" + x + "][product_id]",
        formData.value.items[x].product_id
      );
      if (formData.value.is_inclusive) {
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
      if (formData.value.items[x].cancellation) {
        frmData.append(
          "items[" + x + "][cancellation]",
          formData.value.items[x].cancellation
        );
      }
      // if (formData.value.items[x].is_driver_collect) {
      //   frmData.append(
      //     "items[" + x + "][is_driver_collect]",
      //     formData.value.items[x].is_driver_collect ? 1 : 0
      //   );
      // }
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
      if (
        formData.value.items[x].individual_pricing?.adult &&
        formData.value.items[x].individual_pricing?.child
      ) {
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
      } else {
        frmData.append("items[" + x + "][individual_pricing]", null);
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
      formData.value.items[x].reservation_id != "" &&
        frmData.append(
          "items[" + x + "][reservation_id]",
          formData.value.items[x].reservation_id
        );

      if (formData.value.items[x].product_type == "6") {
        if (formData.value.items[x].car_id) {
          frmData.append(
            "items[" + x + "][room_id]",
            formData.value.items[x].car_id
          );
        } else {
          toast.warning("အခန်းအမျိုးအစား ရွေးချယ်ရန် လိုအပ်ပါသည်");
          return;
        }
      }
      if (
        formData.value.items[x].product_type == "1" ||
        formData.value.items[x].product_type == "2" ||
        formData.value.items[x].product_type == "3"
      ) {
        if (formData.value.items[x].car_id) {
          frmData.append(
            "items[" + x + "][car_id]",
            formData.value.items[x].car_id
          );
        } else {
          toast.warning("အခန်းအမျိုးအစား ရွေးချယ်ရန် လိုအပ်ပါသည်");
          return;
        }
      }
      if (formData.value.items[x].product_type == "4") {
        if (formData.value.items[x].car_id) {
          frmData.append(
            "items[" + x + "][variation_id]",
            formData.value.items[x].car_id
          );
        } else {
          toast.warning("ticket အမျိုးအစား ရွေးချယ်ရန် လိုအပ်ပါသည်");
          return;
        }
      }
      if (formData.value.items[x].product_type == "7") {
        if (formData.value.items[x].car_id) {
          frmData.append(
            "items[" + x + "][ticket_id]",
            formData.value.items[x].car_id
          );
        } else {
          toast.warning("ticket အမျိုးအစား ရွေးချယ်ရန် လိုအပ်ပါသည်");
          return;
        }
      }

      // if (
      //   formData.value.items[x].product_type == "6" &&
      //   formData.value.items[x].car_id
      // ) {
      //   frmData.append(
      //     "items[" + x + "][room_id]",
      //     formData.value.items[x].car_id
      //   );
      // }
      // if (
      //   formData.value.items[x].product_type != "4" &&
      //   formData.value.items[x].product_type != "7"
      // ) {
      //   if (formData.value.items[x].car_id) {
      //     frmData.append(
      //       "items[" + x + "][car_id]",
      //       formData.value.items[x].car_id
      //     );
      //   }
      // } else if (formData.value.items[x].product_type == "4") {
      //   frmData.append(
      //     "items[" + x + "][variation_id]",
      //     formData.value.items[x].car_id
      //   );
      // } else if (formData.value.items[x].product_type == "7") {
      //   frmData.append(
      //     "items[" + x + "][ticket_id]",
      //     formData.value.items[x].car_id
      //   );
      // }
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
      const response = await bookingStore.updateAction(
        frmData,
        route.params.id
      );
      console.log(response, "create response");
      if (response.status == "Request was successful.") {
        formData.value = {
          customer_id: "",
          sold_from: "",
          user_id: "",
          user_name: "",
          payment_method: "",
          bank_name: "",
          payment_status: "",
          booking_date: "",
          items: [],
          receipt_image: [],
          receipt_images: [],
          money_exchange_rate: "",
          crm_id: "",
          discount: "",
          comment: "",
          past_user_id: "",
          is_past_info: "",
          past_crm_id: "",
        };

        errors.value = null;
        toast.success(response.message);
        featureImagePreview.value = [];

        router.push("/bookings/new-update/" + response.result.id);

        await getDetail();
        updatingLoading.value = false;
      }
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
      updatingLoading.value = false;
    }
  } else {
    toast.warning("please check again , item have issue !");
    updatingLoading.value = false;
  }
};

const choiceProductType = (type) => {
  console.log(type);
  if (type == "App\\Models\\PrivateVanTour") {
    return "1";
  }
  if (type == "App\\Models\\GroupTour") {
    return "2";
  }
  if (type == "App\\Models\\AirportPickup") {
    return "3";
  }
  if (type == "App\\Models\\EntranceTicket") {
    return "4";
  }
  if (type == "App\\Models\\Hotel") {
    return "6";
  }
  if (type == "App\\Models\\Airline") {
    return "7";
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

const totalAmountCheck = (q, s, d, discount) => {
  let totalsub = 0;
  totalsub = q * s * d - discount;
  console.log(q, s, d, discount, "this is total amount");
  return totalsub;
};

const getProductId = (item) => {
  if (!item) return ""; // Handle undefined or null item

  switch (item.product_type) {
    case "App\\Models\\PrivateVanTour":
      return item.car?.id || "";

    case "App\\Models\\EntranceTicket":
      return item.variation?.id || "";

    case "App\\Models\\Hotel":
      return item.room?.id || "";

    case "App\\Models\\Airline":
      return item.ticket?.id || "";

    default:
      return ""; // Handle unknown product_type
  }
};
const getProductName = (item) => {
  if (!item) return ""; // Handle undefined or null item

  switch (item.product_type) {
    case "App\\Models\\PrivateVanTour":
      return item.car?.name || "";

    case "App\\Models\\EntranceTicket":
      return item.variation?.name || "";

    case "App\\Models\\Hotel":
      return item.room?.name || "";

    case "App\\Models\\Airline":
      return item.ticket?.price || "";

    default:
      return ""; // Handle unknown product_type
  }
};

// Helper functions - move these outside component or to a separate utility file
const formatNullValue = (value, defaultValue = "") => {
  return value === null || value === "null" || value === undefined
    ? defaultValue
    : value;
};

const processItem = (item, isInclusive) => {
  const productType = choiceProductType(item.product_type);
  const car_id = getProductId(item);
  const item_name = getProductName(item);

  return {
    reservation_id: item.id,
    product_type: productType,
    crm_id: item.crm_id,
    product_id: item.product_id,
    product_name: item.product?.name,
    product_image:
      item.product?.cover_image || item.product?.images?.[0]?.image || "",
    service_date: item.service_date,
    is_inclusive: isInclusive ? 1 : 0,
    cancellation: item.cancellation ?? null,
    discount: item.discount,
    quantity: item.quantity,
    days: formatNullValue(item.days),
    duration: item.duration,
    selling_price: item.selling_price,
    comment: formatNullValue(item.comment),
    special_request: formatNullValue(item.special_request),
    reservation_status: item.reservation_status,
    payment_method: item.payment_method,
    payment_status: item.payment_status,
    exchange_rate: item.exchange_rate,
    cost_price: item.cost_price,
    pickup_location: formatNullValue(item.pickup_location),
    pickup_time: formatNullValue(item.pickup_time),
    is_driver_collect:
      item.is_driver_collect === null ? null : item.is_driver_collect === 1,
    dropoff_location: formatNullValue(item.dropoff_location),
    route_plan: formatNullValue(item.route_plan),
    days: daysBetween(item.checkin_date, item.checkout_date),
    car_list: checkType(item.product),
    car_id: car_id || "",
    item_name: item_name || "",
    checkin_date: formatNullValue(item.checkin_date),
    checkout_date: formatNullValue(item.checkout_date),
    room_number: formatNullValue(item.room_number),
    total_amount: Number(item.amount),
    total_cost_price: Number(item.total_cost_price),
    individual_pricing: item.individual_pricing ?? {},
    child_info: item?.variation?.child_info
      ? JSON.parse(item.variation.child_info)
      : [],
    payment_status: item.payment_status,
    associated_customer: item.associated_customer,
    customer_passport: item.customer_passports,
    reservation_status: item.reservation_status,
  };
};

const processReceipt = (receipt) => {
  return {
    id: receipt.id,
    image: receipt.image,
  };
};

// Main function
const getDetail = async () => {
  try {
    updatingLoading.value = true;
    const response = await bookingStore.getDetailAction(route.params.id);
    console.log("Booking detail response:", response);

    const data = response.result;

    // Process basic information first
    formData.value = {
      id: data.id,
      payment_notes: formatNullValue(data.payment_notes),
      transfer_code: data.transfer_code,
      customer_id: data.customer.id,
      user_id: response.result.user?.id,
      user_name: response.result.user?.name,
      customer_name: data.customer?.name,
      customer_email: formatNullValue(data.customer?.email),
      customer_phone: formatNullValue(data.customer?.phone_number),
      is_corporate: data.customer?.is_corporate_customer,
      sold_from: data?.sold_from,
      is_past_info: data.is_past_info,
      past_crm_id: data.past_crm_id,
      past_user_id: data.past_user_id,
      payment_method: formatNullValue(data.payment_method),
      payment_currency: formatNullValue(data.payment_currency),
      bank_name: formatNullValue(data.bank_name),
      payment_status: formatNullValue(data.payment_status),
      booking_date: formatNullValue(data.booking_date),
      money_exchange_rate: formatNullValue(data.money_exchange_rate),
      crm_id: formatNullValue(data.crm_id),
      items: [],
      receipt_image: [],
      receipt_images: [],
      balance_due_date: data.balance_due_date,
      deposit: data.deposit,
      is_inclusive: data.is_inclusive,
      inclusive_name: data.inclusive_name,
      inclusive_quantity: data.inclusive_quantity,
      inclusive_rate: data.inclusive_rate,
      inclusive_start_date: data.inclusive_start_date,
      inclusive_end_date: data.inclusive_end_date,
      inclusive_description: data.inclusive_description,
      comment: data.comment,
    };

    // Process receipts using map
    formData.value.receipt_images = data.receipts.map(processReceipt);

    // Process items using map
    formData.value.items = data.items.map((item) =>
      processItem(item, data.is_inclusive)
    );

    console.log("Processed form data:", formData.value);
  } catch (error) {
    console.error("Error fetching booking details:", error);
    toast.error("စာရင်းအသေးစိတ် ရယူရာတွင် အမှားဖြစ်ပွားခဲ့သည်။");
  } finally {
    updatingLoading.value = false;
  }
};

const showEditPart = ref(false);

const openPaid = () => {
  window.open(
    import.meta.env.VITE_API_URL +
      "/bookings/" +
      route.params.id +
      "/receipt?paid=1"
  );
};

const deleteImage = async (id) => {
  updatingLoading.value = true;
  await bookingStore.deleteBookingImage(id);
  toast.success("success delete sale Image");
  window.location.reload();
  // await getDetail();
};

// add user to this sale
// this will be called when add user button is clicked
const unique_key = ref("");
const user = ref(null);
const openAddUserModal = ref(false);

const cancelAddUser = () => {
  unique_key.value = "";
  user.value = null;
  formData.value.user_id = "";
  formData.value.user_name = "";
  openAddUserModal.value = false;
};

const removeUserAdd = async () => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        formData.value.user_id = "";
        user.value = null;
        formData.value.user_name = "";
        await onSubmitHandler();
      } catch (error) {
        console.log(
          "🚀 ~ file: BlogView.vue:65 ~ onDeleteHandler ~ error:",
          error
        );
      }
    }
  });
};

const addUserToBooking = async (id) => {
  console.log(id);
  formData.value.user_id = id;
  openAddUserModal.value = false;
  await onSubmitHandler();
};

const searchWithUnique = async () => {
  if (unique_key.value != "") {
    const res = await userStore.getListAction({ unique_key: unique_key.value });
    console.log(res?.result?.data, "this is search user with unique");
    if (res?.result?.data?.length > 0) {
      user.value = res.result.data;
    } else {
      toast.warning("User not found");
    }
  } else {
    user.value = null;
    toast.warning("Please enter user unique key");
  }
};

const queryCrmId = ref("");

onMounted(async () => {
  await getDetail();
  queryCrmId.value = route.query.crm_id ? route.query.crm_id : "";
  await adminStore.getSimpleListAction();
});
</script>

<template>
  <Layout>
    <div
      class="grid grid-cols-6 gap-4 relative"
      :class="updatingLoading ? 'opacity-50 ' : ''"
    >
      <div class="col-span-4 h-[85vh] overflow-hidden">
        <div class="space-y-4" v-if="!showEditPart">
          <DetailListVue
            :data="formData"
            :total="grand_total"
            :balance_due="balance_due"
          />
          <div class="">
            <DetailItemVue
              :data="formData"
              :showEditPart="
                () => {
                  showEditPart = !showEditPart;
                }
              "
              :uploadingAction="
                () => {
                  updatingLoading = !updatingLoading;
                }
              "
            />
          </div>
        </div>
        <div class="space-y-4" v-if="showEditPart">
          <!-- sale info part -->
          <div
            class="flex justify-start items-center gap-x-2 overflow-x-scroll no-sidebar-container pb-2 border-r border-gray-300"
          >
            <div
              @click="showEditPart = !showEditPart"
              class="p-2 shadow-sm bg-white rounded-md flex justify-start items-center gap-x-2 cursor-pointer hover:bg-[#ff613c]/20"
            >
              <img
                src="https://placehold.co/400"
                class="w-12 h-12 rounded-xl text-[#FF5B00]"
                alt=""
              />
              <div class="w-[130px] space-y-1">
                <p class="whitespace-nowrap text-[10px] font-medium">
                  View Items
                </p>
                <p
                  class="text-[8px] text-gray-500 font-normal whitespace-nowrap"
                >
                  Go Back
                </p>
              </div>
            </div>
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
        <div class="flex justify-end items-center space-x-2">
          <!-- router.push({
            name: 'bookings_png',
            query: { id: route.params.id },
          }) -->
          <button
            @click="openPrintModal = !openPrintModal"
            class="text-center bg-orange-600 px-4 py-2 text-xs flex justify-center items-center text-white rounded-xl"
          >
            <PrinterIcon class="w-4 h-4 text-white" />
            <span class="pl-2">PNG</span>
          </button>
          <button
            v-if="formData.is_inclusive == 1"
            @click="openPaid"
            class="text-center bg-gray-600 px-4 py-2 text-xs flex justify-center items-center text-white rounded-xl"
          >
            <PrinterIcon class="w-4 h-4 text-white" />
            <span class="pl-2">PDF</span>
          </button>
          <div
            @click="openAddUserModal = true"
            class="text-center cursor-pointer relative max-w-[200px] bg-green-500 py-2 px-4 text-xs text-white rounded-xl flex justify-start items-center gap-x-2"
          >
            <!-- <UserPlusIcon class="w-4 h-4 text-white" />Connect -->
            <div class="flex justify-center items-center cursor-pointer">
              <UserPlusIcon class="w-4 h-4 mr-2 cursor-pointer" />
              <p
                v-if="formData.user_name && formData.user_id && user == null"
                class="text-[10px] whitespace-nowrap line-clamp-1"
              >
                {{ formData.user_name }}
              </p>
              <p v-if="user != null">
                {{ user[0]?.name }}
              </p>
              <p v-if="formData.user_id == null">Connect</p>
            </div>
            <div
              @click="removeUserAdd"
              v-if="authStore.isSuperAdmin && formData.user_id != undefined"
              class="absolute right-0.5 top-0.5 z-40 cursor-pointer rounded-xl bg-white p-1.5"
            >
              <TrashIcon class="w-4 h-4 text-red-500" />
            </div>
          </div>
          <button
            @click="onSubmitHandler"
            v-show="allowCreate"
            class="text-center bg-[#ff613c] py-2 px-4 text-xs text-white rounded-xl flex justify-center items-center gap-x-2"
          >
            <PencilSquareIcon class="w-4 h-4 text-white" />Update
          </button>
          <button
            v-show="!allowCreate"
            class="text-center bg-gray-400 py-2 px-4 text-xs text-white rounded-xl flex justify-center items-center gap-x-2"
          >
            <PencilSquareIcon class="w-4 h-4 text-white" />Update
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
            Tax information
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
              v-model="formData.payment_notes"
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

        <div
          class="flex items-center justify-start mt-4 mb-4 space-x-3 flex-nowrap"
        >
          <input
            type="checkbox"
            name=""
            id=""
            v-model="checkCondition"
            class="w-6 h-6 bg-[#ff613c] border-gray-300 rounded-lg"
          />
          <p class="text-xs">click get allow update !</p>
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
        <p
          class="text-xs font-medium pb-2"
          v-if="formData.receipt_images.length > 0"
        >
          receipt images
        </p>
        <div class="grid grid-cols-3 col-span-2 gap-3 mt-4">
          <div
            class="relative"
            v-for="(image, index) in formData.receipt_images"
            :key="index"
          >
            <button
              class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
            >
              <XCircleIcon
                class="w-8 h-8 font-semibold"
                v-if="authStore.isSuperAdmin"
                @click="deleteImage(image.id)"
              />
            </button>
            <a :href="image.image" target="_blink">
              <img class="h-auto w-full rounded" :src="image.image" alt="" />
            </a>
          </div>
        </div>
      </div>
    </div>
    <ArchiveConfirmationModal
      :openModalArchive="openModalArchiveConfirmation"
      :formData="formData"
      :sub_total_discount="sub_total_discount"
      :grand_total_real="grand_total_real"
      :sub_total_real="sub_total_real"
      @closeModal="closeModal"
      @archiveUpdate="handleArchiveUpdate"
      @normalUpdate="handleNormalUpdate"
    />
    <p
      v-if="updatingLoading"
      class="absolute w-full bg-black/80 text-white z-50 h-full top-0 left-0 flex justify-center items-center text-3xl"
    >
      Please wait loading process ...
    </p>
    <Modal :isOpen="openAddUserModal" @closeModal="openAddUserModal = false">
      <DialogPanel
        class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-5"
        >
          {{ formData.user_id ? "Edit User" : "Add User" }}
        </DialogTitle>
        <div>
          <div class="relative">
            <input
              type="search"
              v-model="unique_key"
              name=""
              id=""
              class="w-full h-10 px-4 py-2 text-xs text-gray-900 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:border-gray-300"
              placeholder="Paste User Unique Key"
            />
            <div
              class="absolute right-1 top-1 text-xs cursor-pointer flex justify-start items-center gap-2 bg-[#ff613c] text-white px-2 py-2 rounded-xl"
              @click="searchWithUnique"
            >
              <MagnifyingGlassIcon class="w-4 h-4" />
              search
            </div>
          </div>
          <div>
            <div
              v-if="user"
              class="w-full h-auto pb-5 border border-gray-300 rounded-xl mt-4 px-4"
            >
              <div class="w-20 h-20 overflow-hidden rounded-full mx-auto mt-5">
                <img
                  :src="
                    user[0]?.profile !=
                    'https://thanywhere.sgp1.cdn.digitaloceanspaces.com/images/'
                      ? user[0]?.profile
                      : '../../public/logo.jpg'
                  "
                  alt=""
                  class="w-full h-full object-cover"
                />
              </div>
              <p class="text-center text-xl font-semibold">
                {{ user[0]?.name }}
              </p>
              <p class="text-center text-sm">{{ user[0]?.email }}</p>
              <p class="text-center text-sm">
                phone : {{ user[0]?.phone ? user[0]?.phone : "-" }}
              </p>
              <p
                class="text-center text-xs text-red-600 bg-red-300/50 p-2 mt-4 rounded"
              >
                Please check user information before add user. if you wrong,
                user privacy is exposed. So please be careful.
              </p>
              <div class="flex justify-end items-center gap-x-4 pt-5">
                <button
                  @click.prevent="cancelAddUser"
                  class="bg-white border border-gray-300 px-3 py-2 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  @click.prevent="addUserToBooking(user[0]?.id)"
                  class="bg-[#ff613c] text-white border border-gray-300 px-3 py-2 rounded-lg text-xs"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Modal>
    <Modal :isOpen="openModalArchive" @closeModal="openModalArchive = false">
      <DialogPanel
        class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-lg font-medium leading-6 text-gray-900 mb-5 flex justify-between items-center"
        >
          ⚠️ Archive Confirmation
          <XMarkIcon
            class="w-6 h-6 text-black cursor-pointer"
            @click="openModalArchive = false"
          />
        </DialogTitle>
        <div class="space-y-1">
          <p class="text-sm font-medium">
            Do you want to archive this invoice ?
          </p>
          <p class="text-sm">Please check this invoice before archive</p>
          <p class="text-sm pt-2">
            <span
              class="bg-[#ff613c] w-3 h-3 mr-2 inline-block rounded-full"
            ></span
            >Is all items is correct ?
          </p>
          <p class="text-sm">
            <span
              class="bg-[#ff613c] w-3 h-3 mr-2 inline-block rounded-full"
            ></span
            >Is payment is correct ?
          </p>
          <p class="text-sm">
            <span
              class="bg-[#ff613c] w-3 h-3 mr-2 inline-block rounded-full"
            ></span
            >Is tax is correct ?
          </p>
          <p class="text-sm">
            <span
              class="bg-[#ff613c] w-3 h-3 mr-2 inline-block rounded-full"
            ></span
            >Is discount is correct ?
          </p>
          <p class="text-sm pb-4">
            <span
              class="bg-[#ff613c] w-3 h-3 mr-2 inline-block rounded-full"
            ></span
            >Is total is correct ?
          </p>
          <div class="flex justify-between items-center gap-x-4">
            <p
              @click="archiveUpdate"
              class="w-full bg-[#ff613c] py-2 shadow text-white text-center text-xs rounded-xl"
            >
              Archive Update
            </p>
            <p
              @click="normalUpdate"
              class="w-full bg-white py-2 shadow text-[#ff613c] border border-[#ff613c] text-center text-xs rounded-xl"
            >
              Normal Update
            </p>
          </div>
        </div>
      </DialogPanel>
    </Modal>
    <Modal :isOpen="openPrintModal" @closeModal="openPrintModal = false">
      <DialogPanel
        class="w-full max-w-6xl transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-lg font-medium leading-6 text-gray-900 mb-5 flex justify-between items-center"
        >
          <span class="pl-4">Print Invoice as PNG</span>
          <XMarkIcon
            class="w-6 h-6 text-black cursor-pointer"
            @click="openPrintModal = false"
          />
        </DialogTitle>
        <div>
          <PngUsage :invoice_id="route.params.id" />
        </div>
      </DialogPanel>
    </Modal>
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
