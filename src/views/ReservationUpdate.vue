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
});

const showImage = ref({
  receipt_image: "",
  confirmation_letter: "",
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
  frmData.append("comment", formData.value.comment);
  frmData.append("confirmation_letter", formData.value.confirmation_letter);
  frmData.append("cost_price", formData.value.cost_price);
  frmData.append("duration", formData.value.duration);
  frmData.append("exchange_rate", formData.value.exchange_rate);
  frmData.append("payment_method", formData.value.payment_method);
  frmData.append("payment_status", formData.value.payment_status);
  frmData.append("product_id", formData.value.comment);
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
    formData.value = {
      comment: "",
      confirmation_letter: "",
      cost_price: "",
      duration: "",
      exchange_rate: "",
      payment_method: "",
      payment_status: "",
      product_id: "",
      car_id: "",
      car_name: "",
      product_type: "",
      quantity: "",
      receipt_image: "",
      reservation_status: "",
      selling_price: "",
      service_date: "",
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
const getDetail = async () => {
  try {
    const response = await reservationStore.getDetailAction(route.params.id);
    console.log(response, "this is response");
    // formData.value.comment = response.result.comment;
    showImage.value.confirmation_letter = response.result.confirmation_letter;
    // formData.value.cost_price = response.result.cost_price;
    formData.value.duration = response.result.duration;

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
    } else if (response.result.car != null) {
      formData.value.car_id = response.result.car.id;
      formData.value.car_name = response.result.car.name;
    }
    if (response.result.comment == "null") {
      formData.value.comment = "";
    } else {
      formData.value.comment = response.result.comment;
    }
    formData.value.product_id = response.result.product_id;
    formData.value.product_type = response.result.product_type;
    formData.value.quantity = response.result.quantity;
    showImage.value.receipt_image = response.result.receipt_image;
    // formData.value.reservation_status = response.result.reservation_status;
    formData.value.selling_price = response.result.selling_price;
    formData.value.service_date = response.result.service_date;
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

const action = ref("");

onMounted(async () => {
  await getDetail();
  await vantourStore.getSimpleListAction();
  await grouptourStore.getSimpleListAction();
  await airportStore.getSimpleListAction();
  await entranceStore.getSimpleListAction();
  await customerStore.getSimpleListAction();
  await inclusiveStore.getSimpleListAction();
  action.value = route.params.action;
  console.log(action.value);
});
</script>

<template>
  <Layout>
    <div class="mb-5 flex items-center justify-between">
      <h3 class="text-2xl font-medium text-gray-600" v-if="action === 'view'">
        View Reservation
      </h3>
      <h3 class="text-2xl font-medium text-gray-600" v-if="action === 'update'">
        Update Reservation
      </h3>
      <div class="space-x-3"></div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-white/60 col-span-2 p-6 rounded-lg shadow-sm mb-5">
        <div class="space-y-4">
          <div class="col-span-2">
            <div class="col-span-2">
              <div class="grid grid-cols-1">
                <div class="grid grid-cols-12 relative">
                  <div class="grid grid-cols-3 gap-8 col-span-12 rounded-lg">
                    <div class="flex-1">
                      <p class="text-gray-800 text-sm mb-2">Product Choose</p>

                      <v-select
                        v-if="
                          formData.product_type ==
                            'App\\Models\\PrivateVanTour' ||
                          formData.product_type == '1'
                        "
                        v-model="formData.product_id"
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
                          formData.product_type == 'App\\Models\\GroupTour' ||
                          formData.product_type == '2'
                        "
                        v-model="formData.product_id"
                        class="style-chooser"
                        :options="grouptours?.data"
                        label="name"
                        :clearable="false"
                        :reduce="(d) => d.id"
                        placeholder="Choose product type"
                      ></v-select>
                      <v-select
                        v-if="
                          formData.product_type ==
                            'App\\Models\\AirportPickup' ||
                          formData.product_type == '3'
                        "
                        v-model="formData.product_id"
                        class="style-chooser"
                        :options="airports?.data"
                        label="name"
                        :clearable="false"
                        :reduce="(d) => d.id"
                        placeholder="Choose product type"
                      ></v-select>
                      <v-select
                        v-if="
                          formData.product_type ==
                            'App\\Models\\EntranceTicket' ||
                          formData.product_type == '4'
                        "
                        v-model="formData.product_id"
                        class="style-chooser"
                        :options="entrances?.data"
                        label="name"
                        :clearable="false"
                        :reduce="(d) => d.id"
                        placeholder="Choose product type"
                      ></v-select>
                      <v-select
                        v-if="
                          formData.product_type == 'App\\Models\\Inclusive' ||
                          formData.product_type == '5'
                        "
                        v-model="formData.product_id"
                        class="style-chooser"
                        :options="inclusives?.data"
                        label="name"
                        :clearable="false"
                        :reduce="(d) => d.id"
                        placeholder="Choose product type"
                      ></v-select>
                    </div>
                    <!-- <p>{{ formData.car_name }}</p> -->
                    <div class="flex-1" v-if="formData.car_name">
                      <p class="text-gray-800 text-sm mb-2">Car Type</p>
                      <input
                        v-model="formData.car_name"
                        type="text"
                        disabled
                        id="title"
                        class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                      />
                    </div>
                    <div class="flex-1">
                      <p class="text-gray-800 text-sm mb-2">Service Date</p>
                      <input
                        v-model="formData.service_date"
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
                    <div class="flex-1">
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
                    <div class="flex-1">
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
                    <div class="flex-1">
                      <p class="text-gray-800 text-sm mb-2">Exchange Rate</p>
                      <input
                        v-model="formData.exchange_rate"
                        type="text"
                        id="title"
                        class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                      />
                    </div>
                    <div class="flex-1">
                      <p class="text-gray-800 text-sm mb-2">Quantity</p>
                      <input
                        v-model="formData.quantity"
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
                        v-model="formData.duration"
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
                        v-model="formData.selling_price"
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
                    <div class="flex-1">
                      <p class="text-gray-800 text-sm mb-2">Cost Price</p>
                      <input
                        v-model="formData.cost_price"
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
                    <!-- <div class="flex-1">
                      <p class="text-gray-800 text-sm mb-2">Comment</p>
                      <input
                        v-model="formData.comment"
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
                    </div> -->
                    <div class="flex-1">
                      <p class="text-gray-800 text-sm mb-2">
                        Reservation Status
                      </p>
                      <v-select
                        v-model="formData.reservation_status"
                        class="style-chooser"
                        :options="reservation_status"
                        label="name"
                        :clearable="false"
                        :reduce="(d) => d.name"
                        placeholder="Choose Payment Status"
                      ></v-select>
                    </div>
                    <div class="flex-1">
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
                    <div class="flex-1">
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
                    <div class="col-span-3 mb-2">
                      <p class="text-gray-800 text-sm mb-2 mt-2">Comment</p>
                      <textarea
                        v-model="formData.comment"
                        rows="3"
                        id="title"
                        class="w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                      />
                      <p
                        v-if="errors?.comment"
                        class="mt-1 text-sm text-red-600"
                      >
                        {{ errors.comment[0] }}
                      </p>
                    </div>
                    <div
                      class="grid grid-cols-3 gap-8 col-span-3"
                      v-if="showImage.receipt_image"
                    >
                      <div>
                        <p class="text-gray-800 text-sm mb-2 mt-2">
                          Receipt Image
                        </p>
                        <a :href="showImage.receipt_image" target="_blink">
                          <img
                            class="p-2 rounded-lg shadow w-full border border-gray-300 h-auto"
                            :src="showImage.receipt_image"
                            alt=""
                          />
                        </a>
                      </div>
                      <div>
                        <p class="text-gray-800 text-sm mb-2 mt-2">
                          Confirmation Letter
                        </p>
                        <a
                          :href="showImage.confirmation_letter"
                          target="_blink"
                        >
                          <img
                            class="p-2 rounded-lg shadow w-full border border-gray-300 h-auto"
                            :src="showImage.confirmation_letter"
                            alt=""
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="text-end" v-if="action == 'update'">
          <Button @click.prevent="onSubmitHandler"> Update </Button>
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
