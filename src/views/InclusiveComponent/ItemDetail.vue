<script setup>
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
import Button from "../../components/Button.vue";
import OverView from "../BookingComponent/Vantour.vue";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { Switch } from "@headlessui/vue";
import Modal from "../../components/Modal.vue";
import { useToast } from "vue-toastification";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import Vantour from "../BookingComponent/Vantour.vue";
import ItemList from "../BookingComponent/ItemList.vue";
import VantourImage from "../../../src/assets/road-trip.png";
import HotelImage from "../../../src/assets/hotel.png";
import AttractionImage from "../../../src/assets/attractions icon.svg";
import AirlineImage from "../../../src/assets/flight icon.svg";
import InclusivePart from "../BookingComponent/InclusivePart.vue";
import CustomerInfo from "../BookingComponent/CustomerInfo.vue";
import PaymentDetail from "../BookingComponent/PaymentDetail.vue";
import { useBookingStore } from "../../stores/booking";
import Attraction from "../BookingComponent/Attraction.vue";
import Hotel from "../BookingComponent/Hotel.vue";
import Airline from "../BookingComponent/Airline.vue";
import TaxInfo from "../BookingComponent/TaxInfo.vue";
import { useAdminStore } from "../../stores/admin";
// import RestaurantImage from "../../public/restaurant-svgrepo-com.svg";

// for tag
const currentTag = ref("Van Tours");
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
      totalsub = totalsub + formData.value.items[i].total_amount;
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
          totalsub = totalsub + formData.value.items[i].total_amount;
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

onMounted(async () => {
  await adminStore.getSimpleListAction();
});
</script>

<template>
  <div class="grid grid-cols-6 gap-4">
    <div class="col-span-4 h-[85vh] overflow-hidden">
      <div class="space-y-4">
        <!-- sale info part -->
        <div
          class="flex justify-start items-center gap-x-2 overflow-x-scroll pb-2 border-r border-gray-300"
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
    <div class="col-span-2 h-[85vh] relative overflow-y-scroll space-y-4">
      <!-- create -->

      <!-- tags -->
      <div
        class="bg-white flex justify-start sticky top-0 overflow-x-scroll z-30 items-center gap-x-2 rounded-xl p-1.5"
      >
        <p
          class="rounded-lg px-5 py-1.5 text-[10px] cursor-pointer hover:bg-[#ff613c]/20 whitespace-nowrap"
        >
          Items
        </p>
      </div>
      <!-- tags result -->
      <div
        class="min-h-[10vh] max-h-[50vh] bg-white rounded-lg overflow-y-scroll px-3"
      >
        <ItemList :data="formData" @remove="removeItemList" />
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
</style>
