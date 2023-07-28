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
import { useBookingStore } from "../stores/booking";

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

const { customer, loading } = storeToRefs(customerStore);
const { vantours } = storeToRefs(vantourStore);
const { grouptours } = storeToRefs(grouptourStore);
const { airports } = storeToRefs(airportStore);
const { entrances } = storeToRefs(entranceStore);

const soldFrom = [
  { id: "1", name: "Facebook" },
  { id: "2", name: "Twitter" },
  { id: "3", name: "Instagram" },
  { id: "4", name: "Telegram" },
];
const payment = [
  { id: "1", name: "KBZ Bank" },
  { id: "2", name: "Kpay" },
  { id: "3", name: "WavePay" },
  { id: "4", name: "CB Bank" },
];
const payment_status = [
  { id: "1", name: "fully paid" },
  { id: "2", name: "not paid" },
  { id: "3", name: "partially paid" },
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
  reciept_image: [],
  confirmation_letter: [],
});

const formitem = ref({
  product_type: "",
  product_id: "",
  service_date: "",
  quantity: "",
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
    comment: "",
    reservation_status: "",
    payment_method: "",
    payment_status: "",
    exchange_rate: "",
    cost_price: "",
  };
};

const removeFromitem = (index) => {
  formData.value.items.splice(index, 1);
};

const errors = ref(null);

const handlerFeatureFileChange = (e) => {
  let selectedFile = e.target.files[0];
  if (selectedFile) {
    formData.value.reciept_image.push(selectedFile);
  }
};
const handlerConfirmFileChange = (e) => {
  let selectedFile = e.target.files[0];
  if (selectedFile) {
    formData.value.confirmation_letter.push(selectedFile);
  }
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
  if (formData.value.reciept_image.length > 0) {
    for (let i = 0; i < formData.value.reciept_image.length; i++) {
      let file = formData.value.reciept_image[i];
      frmData.append("items[" + i + "][receipt_image]", file);
    }
  }
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
    }
  }
  for (var x = 0; x < formData.value.items.length; x++) {
    frmData.append(
      "items[" + x + "][product_id]",
      formData.value.items[x].product_id
    );
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
      discount: "",
      comment: "",
    };

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
const getDetail = async () => {
  try {
    const response = await bookingStore.getDetailAction(route.params.id);
    formData.value.customer_id = response.result.customer.id;
    formData.value.sold_from = response.result.sold_from;
    formData.value.payment_method = response.result.payment_method;
    formData.value.payment_status = response.result.payment_status;
    formData.value.booking_date = response.result.booking_date;
    formData.value.money_exchange_rate = response.result.money_exchange_rate;
    formData.value.money_exchange_rate = response.result.money_exchange_rate;
    formData.value.comment = response.result.comment;
    formData.value.discount = response.result.discount;
    console.log(response.result.items, "this is result");
    for (const x in response.result.items) {
      const itemData = {
        product_type: response.result.items[x].product_type,
        product_id: response.result.items[x].product.id,
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
      };
      formData.value.items.push(itemData);
    }
    console.log(formData.value.items, "this is push");
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
    return (a.value = "3");
  }
};

const url = ref("");
const urlPaid = ref("");

onMounted(async () => {
  await getDetail();
  await vantourStore.getSimpleListAction();
  await grouptourStore.getSimpleListAction();
  await airportStore.getSimpleListAction();
  await entranceStore.getSimpleListAction();
  await customerStore.getSimpleListAction();
  url.value =
    "https://api-blog.thanywhere.com/admin/bookings/" +
    route.params.id +
    "/receipt";
  urlPaid.value =
    "https://api-blog.thanywhere.com/admin/bookings/" +
    route.params.id +
    "/receipt?paid=1";
});
</script>

<template>
  <Layout>
    <div class="mb-5 flex items-center justify-between">
      <h3 class="text-2xl font-medium text-gray-600">Update Booking</h3>
      <div class="space-x-3">
        <a :href="urlPaid" target="_blink">
          <Button> Only Paid Print </Button>
        </a>
        <a :href="url" target="_blink">
          <Button> Print Receipt </Button>
        </a>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-white/60 col-span-2 p-6 rounded-lg shadow-sm mb-5">
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-8">
            <div class="">
              <p class="text-gray-800 text-sm mb-2">Customer ID</p>
              <v-select
                v-model="formData.customer_id"
                class="style-chooser"
                :options="customer?.data"
                label="name"
                :clearable="false"
                :reduce="(d) => d.id"
                placeholder="Choose customer"
              ></v-select>
            </div>
            <div class="">
              <p class="text-gray-800 text-sm mb-2">Booking Date</p>
              <input
                v-model="formData.booking_date"
                type="date"
                id="title"
                class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.booking_date" class="mt-1 text-sm text-red-600">
                {{ errors.booking_date[0] }}
              </p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-8">
            <div class="">
              <p class="text-gray-800 text-sm mb-2">Sold From</p>
              <v-select
                v-model="formData.sold_from"
                class="style-chooser"
                :options="soldFrom"
                label="name"
                :clearable="false"
                :reduce="(d) => d.name"
                placeholder="Choose Sold From"
              ></v-select>
            </div>
            <div class="">
              <p class="text-gray-800 text-sm mb-2">Payment Method</p>
              <v-select
                v-model="formData.payment_method"
                class="style-chooser"
                :options="payment"
                label="name"
                :clearable="false"
                :reduce="(d) => d.name"
                placeholder="Choose Payment Method"
              ></v-select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-8">
            <div class="">
              <p class="text-gray-800 text-sm mb-2">Payment Status</p>
              <v-select
                v-model="formData.payment_status"
                class="style-chooser"
                :options="payment_status"
                label="name"
                :clearable="false"
                :reduce="(d) => d.name"
                placeholder="Choose Payment Status"
              ></v-select>
            </div>

            <div class="col-span-2">
              <div class="col-span-2">
                <div class="flex items-center justify-start mb-2">
                  <label class="text-sm block text-gray-600 mr-3" for="">
                    Items
                    <small class="text-xs text-red-600"
                      >( Don't forget add )</small
                    >
                  </label>
                </div>
                <div class="mb-3">
                  <div class="flex items-center justify-start gap-8 mb-6">
                    <div class="w-[200px]">
                      <p class="text-gray-800 text-sm mb-2">Item Type</p>
                      <v-select
                        v-model="formitem.product_type"
                        class="style-chooser"
                        :options="formItemType"
                        label="name"
                        :clearable="false"
                        :reduce="(d) => d.id"
                        placeholder="Choose product type"
                        @option:selected="chooseType"
                      ></v-select>
                    </div>
                    <div class="min-w-[200px]" v-if="formitem.product_type">
                      <p class="text-gray-800 text-sm mb-2">Product Choose</p>
                      <v-select
                        v-model="formitem.product_id"
                        class="style-chooser"
                        :options="productList"
                        label="name"
                        :clearable="false"
                        :reduce="(d) => d.id"
                        placeholder="Choose product type"
                      ></v-select>
                    </div>
                    <div>
                      <button
                        @click.prevent="addNewitem"
                        class="mt-6 flex-1"
                        v-if="formitem.product_id"
                      >
                        <i
                          class="fa-solid fa-plus text-sm font-semibold px-2 py-1 rounded-full shadow text-white bg-blue-600"
                        ></i>
                      </button>
                      <button v-if="!formitem.product_id" class="mt-6 flex-1">
                        <i
                          class="fa-solid fa-plus text-sm font-semibold px-2 py-1 rounded-full shadow text-white bg-gray-500"
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div
                    v-for="(item, index) in formData.items"
                    :key="index"
                    class="grid grid-cols-12 relative"
                  >
                    <div
                      class="grid grid-cols-2 gap-4 col-span-12 p-3 border-2 border-gray-300 rounded-lg"
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
                          <p
                            class="font-semibold text-md border-b-2 border-b-gray-700 inline-block"
                          >
                            Private Van Tour
                          </p>
                        </div>
                        <div
                          class="py-2 text-gray-600"
                          v-if="
                            item.product_type == 'App\\Models\\GroupTour' ||
                            item.product_type == '2'
                          "
                        >
                          <p
                            class="font-semibold text-md border-b-2 border-b-gray-700 inline-block"
                          >
                            Group Tour
                          </p>
                        </div>
                        <div
                          class="py-2 text-gray-600"
                          v-if="
                            item.product_type == 'App\\Models\\AirportPickup' ||
                            item.product_type == '3'
                          "
                        >
                          <p
                            class="font-semibold text-md border-b-2 border-b-gray-700 inline-block"
                          >
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
                          <p
                            class="font-semibold text-md border-b-2 border-b-gray-700 inline-block"
                          >
                            Entrance Ticket
                          </p>
                        </div>
                      </div>
                      <div>
                        <p
                          v-if="item.reservation_status == 'reserved'"
                          class="bg-green-500 rounded-full px-3 py-1 text-center text-white shadow"
                        >
                          {{ item.reservation_status }}
                        </p>
                        <p
                          v-if="item.reservation_status == 'awaiting_payment'"
                          class="bg-yellow-500 rounded-full px-3 py-1 text-center text-white shadow"
                        >
                          {{ item.reservation_status }}
                        </p>
                        <p
                          v-if="item.reservation_status == 'declined'"
                          class="bg-red-500 rounded-full px-3 py-1 text-center text-white shadow"
                        >
                          {{ item.reservation_status }}
                        </p>
                        <p
                          v-if="item.reservation_status == null"
                          class="bg-gray-500 rounded-full px-3 py-1 text-center text-white shadow"
                        >
                          Not Check
                        </p>
                      </div>
                      <div class="flex-1 hidden">
                        <p class="text-gray-800 text-sm mb-2">Item Type</p>
                        <v-select
                          v-model="item.product_type"
                          class="style-chooser"
                          :options="formItemType"
                          label="name"
                          disabled
                          :clearable="false"
                          :reduce="(d) => d.id"
                          placeholder="Choose product type"
                        ></v-select>
                      </div>

                      <div class="flex-1">
                        <p class="text-gray-800 text-sm mb-2">Product Choose</p>

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
                            item.product_type == 'App\\Models\\AirportPickup' ||
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
                      </div>
                      <div class="flex-1">
                        <p class="text-gray-800 text-sm mb-2">Service Date</p>
                        <input
                          v-model="item.service_date"
                          type="date"
                          id="title"
                          class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                        />
                        <p
                          v-if="errors?.service_date"
                          class="mt-1 text-sm text-red-600"
                        >
                          {{ errors.service_date[0] }}
                        </p>
                      </div>
                      <div class="flex-1 hidden">
                        <p class="text-gray-800 text-sm mb-2">Payment Method</p>
                        <v-select
                          v-model="item.payment_method"
                          class="style-chooser"
                          :options="payment"
                          label="name"
                          :clearable="false"
                          :reduce="(d) => d.name"
                          placeholder="Choose Payment Method"
                        ></v-select>
                      </div>
                      <div class="flex-1">
                        <p class="text-gray-800 text-sm mb-2">Payment Status</p>
                        <v-select
                          v-model="item.payment_status"
                          class="style-chooser"
                          :options="payment_status"
                          label="name"
                          disabled
                          :clearable="false"
                          :reduce="(d) => d.name"
                          placeholder="Choose Payment Status"
                        ></v-select>
                      </div>
                      <div class="flex-1 hidden">
                        <p class="text-gray-800 text-sm mb-2">Exchange Rate</p>
                        <input
                          v-model="item.exchange_rate"
                          type="text"
                          id="title"
                          class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                        />
                      </div>
                      <div class="flex-1">
                        <p class="text-gray-800 text-sm mb-2">Quantity</p>
                        <input
                          v-model="item.quantity"
                          type="text"
                          id="title"
                          class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                        />
                        <p
                          v-if="errors?.quantity"
                          class="mt-1 text-sm text-red-600"
                        >
                          {{ errors.quantity[0] }}
                        </p>
                      </div>
                      <div class="flex-1">
                        <p class="text-gray-800 text-sm mb-2">Duration</p>
                        <input
                          v-model="item.duration"
                          type="text"
                          id="title"
                          class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                        />
                        <p
                          v-if="errors?.duration"
                          class="mt-1 text-sm text-red-600"
                        >
                          {{ errors.duration[0] }}
                        </p>
                      </div>
                      <div class="flex-1">
                        <p class="text-gray-800 text-sm mb-2">Selling Price</p>
                        <input
                          v-model="item.selling_price"
                          type="text"
                          id="title"
                          class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                        />
                        <p
                          v-if="errors?.selling_price"
                          class="mt-1 text-sm text-red-600"
                        >
                          {{ errors.selling_price[0] }}
                        </p>
                      </div>
                      <div class="flex-1 hidden">
                        <p class="text-gray-800 text-sm mb-2">Cost Price</p>
                        <input
                          v-model="item.cost_price"
                          type="text"
                          id="title"
                          class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                        />
                        <p
                          v-if="errors?.cost_price"
                          class="mt-1 text-sm text-red-600"
                        >
                          {{ errors.cost_price[0] }}
                        </p>
                      </div>
                      <div class="flex-1 hidden">
                        <p class="text-gray-800 text-sm mb-2">Comment</p>
                        <input
                          v-model="item.comment"
                          type="text"
                          id="title"
                          class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                        />
                        <p
                          v-if="errors?.comment"
                          class="mt-1 text-sm text-red-600"
                        >
                          {{ errors.comment[0] }}
                        </p>
                      </div>
                      <div class="flex-1 hidden">
                        <p class="text-gray-800 text-sm mb-2">
                          Reservation Status
                        </p>
                        <v-select
                          v-model="item.reservation_status"
                          class="style-chooser"
                          :options="reservation_status"
                          label="name"
                          :clearable="false"
                          :reduce="(d) => d.name"
                          placeholder="Choose Payment Status"
                        ></v-select>
                      </div>
                      <div class="flex-1 hidden">
                        <p class="text-gray-800 text-sm mb-2">Receipt Image</p>
                        <input
                          @change="handlerFeatureFileChange"
                          type="file"
                          id="title"
                          class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                        />
                        <p
                          v-if="errors?.receipt_image"
                          class="mt-1 text-sm text-red-600"
                        >
                          {{ errors.receipt_image[0] }}
                        </p>
                      </div>
                      <div class="flex-1 hidden">
                        <p class="text-gray-800 text-sm mb-2">
                          confirmation Letter
                        </p>
                        <input
                          @change="handlerConfirmFileChange"
                          type="file"
                          id="title"
                          class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                        />
                        <p
                          v-if="errors?.confirmation_letter"
                          class="mt-1 text-sm text-red-600"
                        >
                          {{ errors.confirmation_letter[0] }}
                        </p>
                      </div>
                    </div>
                    <div>
                      <button
                        class="text-sm text-red-600 absolute top-[-14px] right-[-8px]"
                        @click.prevent="removeFromitem(index)"
                      >
                        <i
                          class="fa-solid fa-minus text-sm font-semibold px-2 py-1 bg-red-500 rounded-full shadow text-white"
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-8 mt-4">
                <div class="">
                  <p class="text-gray-800 text-sm mb-2">Money Exchange Rate</p>
                  <input
                    v-model="formData.money_exchange_rate"
                    type="text"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                  />
                  <p
                    v-if="errors?.money_exchange_rate"
                    class="mt-1 text-sm text-red-600"
                  >
                    {{ errors.money_exchange_rate[0] }}
                  </p>
                </div>
                <div class="">
                  <p class="text-gray-800 text-sm mb-2">Discount</p>
                  <input
                    v-model="formData.discount"
                    type="text"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                  />
                  <p v-if="errors?.discount" class="mt-1 text-sm text-red-600">
                    {{ errors.discount[0] }}
                  </p>
                </div>
              </div>
              <div class="">
                <p class="text-gray-800 text-sm mb-2 mt-2">Comment</p>
                <textarea
                  v-model="formData.comment"
                  rows="3"
                  id="title"
                  class="w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                />
                <p v-if="errors?.comment" class="mt-1 text-sm text-red-600">
                  {{ errors.comment[0] }}
                </p>
              </div>
            </div>
          </div>
          <div class="text-end space-x-4">
            <!-- <a :href="urlPaid" target="_blink">
              <Button> Only Paid Print </Button>
            </a>
            <a :href="url" target="_blink">
              <Button> Print Receipt </Button>
            </a> -->

            <Button @click.prevent="onSubmitHandler"> Update </Button>
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
