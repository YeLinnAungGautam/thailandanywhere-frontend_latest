<script setup>
import Layout from "./Layout.vue";
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { PlusIcon, ListBulletIcon } from "@heroicons/vue/24/outline";
import { computed, onMounted, onUnmounted, ref } from "vue";
import Button from "../components/Button.vue";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import Modal from "../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";

import { useToast } from "vue-toastification";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useVantourStore } from "../stores/vantour";
import { useGrouptourStore } from "../stores/grouptour";
import { useAirportStore } from "../stores/airport";
import { useEntranceStore } from "../stores/entrance";
import { useBookingStore } from "../stores/booking";
import { useInclusiveStore } from "../stores/inclusion";
import { useRoomStore } from "../stores/room";
import { useHotelStore } from "../stores/hotel";
import { useAirLineStore } from "../stores/airline";

const vantourStore = useVantourStore();
const grouptourStore = useGrouptourStore();
const airportStore = useAirportStore();
const entranceStore = useEntranceStore();
const bookingStore = useBookingStore();
const inclusiveStore = useInclusiveStore();
const roomStore = useRoomStore();
const hotelStore = useHotelStore();
const airlineStore = useAirLineStore();

const { vantours } = storeToRefs(vantourStore);
const { grouptours } = storeToRefs(grouptourStore);
const { airports } = storeToRefs(airportStore);
// const { inclusives } = storeToRefs(inclusiveStore);
const { entrances } = storeToRefs(entranceStore);
const { airlines } = storeToRefs(airlineStore);
const { rooms } = storeToRefs(roomStore);
const { hotels } = storeToRefs(hotelStore);
// const { isOpenCustomerCreate } = storeToRefs(sidebar);
// const { admin } = storeToRefs(adminStore);

const toast = useToast();
const router = useRouter();
const route = useRoute();

const formData = ref({
  name: "",
  description: "",
  cover_image: "",
  sku_code: "",
  images: [],
  price: "",
  items: [],
  agent_price: "",
  feature_image: "",
});

const formItemType = [
  { id: "1", name: "Van Tour", data: "AppModelsPrivateVanTour" },
  { id: "2", name: "Group Tour", data: "AppModelsGroupTour" },
  { id: "3", name: "Airport Pickup", data: " AppModelsAirportPickup" },
  { id: "4", name: "Entrance Ticket", data: "AppModelsEntranceTicket" },
  { id: "5", name: "Hotel Room", data: "AppModelsRoom" },
  { id: "6", name: "AirLine", data: "AppModelsAirline" },
];

const formitem = ref({
  product_type: "",
  product_id: "",
  car_id: "",
  car_list: [],
  room_id: "",
  room: null,
  service_date: "",
  cost_price: "",
  quantity: "1",
  days: "1",
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
    await hotelStore.getSimpleListAction();
    productList.value = hotels.value.data;
    console.log(productList.value);
  } else if (formitem.value.product_type == "6") {
    await airlineStore.getSimpleListAction();
    productList.value = airlines.value.data;
    console.log(productList.value, "this is air");
  }
};
const carType = ref([]);
const roomType = ref([]);
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
    formitem.value.cost_price = res.result.price;
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
    const res = await hotelStore.getDetailAction(id);
    // formitem.value.comment = res.result.description;
    console.log(res.result.rooms, "this is rooms");
    roomType.value = res.result.rooms;
  } else if (formitem.value.product_type == "6") {
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
        formitem.value.cost_price = res.result.cars[i].cost_price
          ? res.result.cars[i].cost_price
          : res.result.cars[i].price;
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
        formitem.value.cost_price = res.result.cars[i].cost_price
          ? res.result.cars[i].cost_price
          : res.result.cars[i].price;
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
        console.log(res.result.variations[i].description);
      }
    }
    console.log(res);
  } else if (type == "5") {
    const res = await hotelStore.getDetailAction(productId);
    formitem.value.room_list = res.result.rooms;
    const room = res.result.rooms.filter((r) => r.id === id)[0];
    formitem.value.room = room;
    formitem.value.selling_price = room.room_price;
    formitem.value.cost_price = room.cost ? room.room_price : room.cost;
    formitem.value.extra_price = room.extra_price;
    formitem.value.comment = room.description;
    console.log(room.room_price);
  } else if (type == "6") {
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
const desopen = ref(false);

const clickdes = () => {
  desopen.value = true;
};
const closedes = () => {
  desopen.value = false;
};
const clickdetaildes = ref(false);
const clickdetaildesToggle = (item, index) => {
  clickdetaildes.value = true;
  itemDes.value = item.comment;
  itemSpecial.value = item.special_request;
  itemServiceDate.value = item.service_date;
  itemPickup.value = item.pickup_location;
  itemPickupTime.value = item.pickup_time;
  itemDropoff.value = item.dropoff_location;
  indexValue.value = index;
  itemType.value = item.product_type;
  itemRoutePlan.value = item.route_plan;
  itemFile.value = item.customer_attachment;
  itemCheckIn.value = item.checkin_date;
  itemCheckOut.value = item.checkout_date;
  itemDays.value = item.days;
  itemRoom.value = item.room_number;
  itemQ.value = item.quantity;
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
const itemDes = ref("");
const itemSpecial = ref("");
const itemServiceDate = ref("");

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
const sub_qty_total = computed(() => {
  let totalsub = 0;
  if (formitem.value.days) {
    totalsub =
      formitem.value.quantity * formitem.value.cost_price * formitem.value.days;
    formitem.value.total_amount = totalsub;
    return totalsub;
  } else {
    totalsub = formitem.value.quantity * formitem.value.cost_price;
    formitem.value.total_amount = totalsub;
    return totalsub;
  }
});
const sub_total = computed(() => {
  let totalsub = 0;
  for (let i = 0; i < formData.value.items.length; i++) {
    totalsub = totalsub + formData.value.items[i].total_amount;
  }
  return totalsub;
});
const allowCreate = computed(() => {
  if (formData.value.items.length != 0) {
    return true;
  } else if (formData.value.items.length != 0) {
    return true;
  } else {
    return false;
  }
});
const addNewitem = () => {
  formData.value.items.push(formitem.value);
  console.log(formData.value.items);
  formitem.value = {
    product_type: "",
    product_id: "",
    car_id: "",
    car_list: [],
    room_id: "",
    room: null,
    cost_price: "",
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
  };

  addToggle();
};
const hotelQ = (t, d, q) => {
  let data = 0;
  if (t == 5 || t == "App\\Models\\Hotel") {
    return (data = d * q);
  }
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

const addComment = ref(false);
const addToggle = () => {
  if (addComment.value) {
    addComment.value = false;
  } else {
    addComment.value = true;
  }
};

const removeFromitem = (index) => {
  formData.value.items.splice(index, 1);
};

const errors = ref(null);

const featureImageInput = ref(null);
const featureImagePreview = ref(null);

const openFileFeaturePicker = () => {
  featureImageInput.value.click();
};

const handlerFeatureFileChange = (e) => {
  let selectedFile = e.target.files[0];
  if (selectedFile) {
    formData.value.cover_image = e.target.files[0];
    featureImagePreview.value = URL.createObjectURL(selectedFile);
  }
};

const removeFeatureSelectImage = () => {
  formData.value.feature_image = null;
  featureImagePreview.value = null;
};

const imagesInput = ref(null);
const imagesPreview = ref([]);

const openFileImagePicker = () => {
  imagesInput.value.click();
};

const handlerImagesFileChange = (e) => {
  console.log(e.target.files);
  let selectedFile = e.target.files;
  if (selectedFile) {
    for (let index = 0; index < selectedFile.length; index++) {
      formData.value.images.push(selectedFile[index]);
      imagesPreview.value.push(URL.createObjectURL(selectedFile[index]));
    }
  }
};

const removeImageSelectImage = (index) => {
  formData.value.images.splice(index, 1);
  imagesPreview.value.splice(index, 1);
};

const onSubmitHandler = async () => {
  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("sku_code", formData.value.sku_code);
  frmData.append("description", formData.value.description);
  frmData.append("price", formData.value.price);
  frmData.append("agent_price", formData.value.agent_price);

  if (formData.value.images.length > 0) {
    for (let i = 0; i < formData.value.images.length; i++) {
      let file = formData.value.images[i];
      frmData.append("images[" + i + "]", file);
    }
  }

  for (var x = 0; x < formData.value.items.length; x++) {
    if (formData.value.items[x].product_type == "1") {
      frmData.append("products[" + x + "][product_type]", `private_van_tour`);
    } else if (formData.value.items[x].product_type == "2") {
      frmData.append("products[" + x + "][product_type]", `group_tour`);
    } else if (formData.value.items[x].product_type == "3") {
      frmData.append("products[" + x + "][product_type]", `airport_pickup`);
    } else if (formData.value.items[x].product_type == "4") {
      frmData.append("products[" + x + "][product_type]", `entrance_ticket`);
    } else if (formData.value.items[x].product_type == "5") {
      frmData.append("products[" + x + "][product_type]", `hotel`);
    } else if (formData.value.items[x].product_type == "6") {
      frmData.append("products[" + x + "][product_type]", `airline_ticket`);
    }
  }
  for (var x = 0; x < formData.value.items.length; x++) {
    frmData.append(
      "products[" + x + "][product_id]",
      formData.value.items[x].product_id
    );
    frmData.append(
      "products[" + x + "][cost_price]",
      formData.value.items[x].cost_price
    );
    frmData.append(
      "products[" + x + "][selling_price]",
      formData.value.items[x].selling_price
    );
    frmData.append(
      "products[" + x + "][description]",
      formData.value.items[x].comment
    );
    frmData.append(
      "products[" + x + "][quantity]",
      formData.value.items[x].quantity
    );
  }
  for (var x = 0; x < formData.value.items.length; x++) {
    formData.value.items[x].product_type == "1" ||
    formData.value.items[x].product_type == "3"
      ? frmData.append(
          "products[" + x + "][car_id]",
          formData.value.items[x].car_id
        )
      : "";
    formData.value.items[x].product_type == "4"
      ? frmData.append(
          "products[" + x + "][variation_id]",
          formData.value.items[x].car_id
        )
      : "";
    formData.value.items[x].product_type == "5"
      ? frmData.append(
          "products[" + x + "][room_id]",
          formData.value.items[x].room_id
        )
      : "";
    formData.value.items[x].product_type == "5" &&
    formData.value.items[x].checkin_date
      ? frmData.append(
          "products[" + x + "][checkin_date]",
          formData.value.items[x].checkin_date
        )
      : "";
    formData.value.items[x].product_type == "5" &&
    formData.value.items[x].checkout_date
      ? frmData.append(
          "products[" + x + "][checkout_date]",
          formData.value.items[x].checkout_date
        )
      : "";
    formData.value.items[x].product_type == "6"
      ? frmData.append(
          "products[" + x + "][ticket_id]",
          formData.value.items[x].car_id
        )
      : "";
  }
  frmData.append("cover_image", formData.value.cover_image);

  try {
    const response = await inclusiveStore.addNewAction(frmData);
    formData.value = {
      name: "",
      description: "",
      cover_image: "",
      sku_code: "",
      images: [],
      items: [],
      price: "",
      feature_image: "",
    };
    errors.value = null;
    toast.success(response.message);
    router.push("/products/3");
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

onMounted(async () => {});
</script>

<template>
  <Layout>
    <div class="mb-5 flex items-center justify-between">
      <h3 class="text-2xl font-medium text-gray-600">Create Inclusive</h3>
      <div class="space-x-3"></div>
    </div>
    <div class="grid grid-cols-1 gap-3">
      <div class="bg-white/60 col-span-2 p-6 rounded-lg shadow-sm mb-5">
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-6">
            <div>
              <div class="grid grid-cols-2 gap-8">
                <div class="">
                  <p class="text-gray-800 text-xs mb-2">Name</p>
                  <input
                    v-model="formData.name"
                    type="text"
                    id="title"
                    class="h-8 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                  />
                  <p v-if="errors?.name" class="mt-1 text-xs text-red-600">
                    {{ errors.name[0] }}
                  </p>
                </div>
                <div class="">
                  <p class="text-gray-800 text-xs mb-2">SKU code</p>
                  <input
                    v-model="formData.sku_code"
                    type="text"
                    id="title"
                    class="h-8 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                  />
                  <p v-if="errors?.sku_code" class="mt-1 text-xs text-red-600">
                    {{ errors.sku_code[0] }}
                  </p>
                </div>
                <div class="">
                  <p class="text-gray-800 text-xs mb-2">Price Per Person</p>
                  <input
                    v-model="formData.price"
                    type="text"
                    id="title"
                    class="h-8 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                  />
                  <p v-if="errors?.price" class="mt-1 text-xs text-red-600">
                    {{ errors.price[0] }}
                  </p>
                </div>
                <div class="">
                  <p class="text-gray-800 text-xs mb-2">Agent Price</p>
                  <input
                    v-model="formData.agent_price"
                    type="text"
                    id="title"
                    class="h-8 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                  />
                  <p
                    v-if="errors?.agent_price"
                    class="mt-1 text-xs text-red-600"
                  >
                    {{ errors.agent_price[0] }}
                  </p>
                </div>
                <div class="col-span-2">
                  <p class="text-gray-800 text-xs mb-2">Description</p>
                  <textarea
                    v-model="formData.description"
                    rows="3"
                    id="title"
                    class="w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 h-[300px]"
                  />
                  <p
                    v-if="errors?.description"
                    class="mt-1 text-xs text-red-600"
                  >
                    {{ errors.description[0] }}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div class="bg-white/60 p-6 rounded-lg shadow-sm mb-5">
                <div class="flex items-center justify-start gap-3 mb-3">
                  <p class="text-xs">Images</p>
                  <input
                    multiple
                    type="file"
                    ref="imagesInput"
                    class="hidden"
                    @change="handlerImagesFileChange"
                    accept="image/*"
                  />
                </div>
                <div
                  class="grid grid-cols-3 gap-2"
                  v-if="imagesPreview.length == 0"
                  @click.prevent="openFileImagePicker"
                >
                  <div
                    class="cursor-pointer w-full h-[130px] border-2 border-dashed border-gray-400 rounded flex justify-center items-center"
                  >
                    <span class="text-xs"
                      ><i
                        class="fa-solid fa-plus text-lg font-semibold py-1 px-3 bg-[#ff613c] rounded-full shadow text-white"
                      ></i
                    ></span>
                  </div>
                  <div
                    class="cursor-pointer w-full h-[130px] border-2 border-dashed border-gray-400 rounded flex justify-center items-center"
                  >
                    <span class="text-xs"
                      ><i
                        class="fa-solid fa-plus text-lg font-semibold py-1 px-3 bg-[#ff613c] rounded-full shadow text-white"
                      ></i
                    ></span>
                  </div>
                  <div
                    class="cursor-pointer w-full h-[130px] border-2 border-dashed border-gray-400 rounded flex justify-center items-center"
                  >
                    <span class="text-xs"
                      ><i
                        class="fa-solid fa-plus text-lg font-semibold py-1 px-3 bg-[#ff613c] rounded-full shadow text-white"
                      ></i
                    ></span>
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <div
                    class="relative"
                    v-for="(image, index) in imagesPreview"
                    :key="index"
                  >
                    <button
                      @click.prevent="removeImageSelectImage(index)"
                      class="rounded-full text-xs text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
                    >
                      <XCircleIcon class="w-8 h-8 font-semibold" />
                    </button>
                    <img class="h-auto w-full rounded" :src="image" alt="" />
                  </div>
                  <div
                    v-if="imagesPreview.length != 0"
                    @click.prevent="openFileImagePicker"
                    class="cursor-pointer w-full h-[130px] border-2 border-dashed border-gray-400 rounded flex justify-center items-center mt-2"
                  >
                    <span class="text-xs"
                      ><i
                        class="fa-solid fa-plus text-lg font-semibold py-1 px-3 bg-[#ff613c] rounded-full shadow text-white"
                      ></i
                    ></span>
                  </div>
                </div>
              </div>
              <div class="bg-white/60 p-6 rounded-lg shadow-sm mb-5">
                <div class="flex items-center justify-between gap-3 mb-3">
                  <p class="text-xs">Feature Image</p>
                  <input
                    type="file"
                    ref="featureImageInput"
                    class="hidden"
                    @change="handlerFeatureFileChange"
                    accept="image/*"
                  />
                  <button
                    v-if="!featureImagePreview"
                    @click.prevent="openFileFeaturePicker"
                    class="text-xs text-[#ff613c]"
                  ></button>
                  <button
                    v-else
                    @click.prevent="removeFeatureSelectImage"
                    class="rounded-full text-xs text-red-600 items-center justify-center flex"
                  >
                    <XCircleIcon class="w-8 h-8 font-semibold" />
                  </button>
                </div>
                <div
                  v-if="!featureImagePreview"
                  @click.prevent="openFileFeaturePicker"
                  class="cursor-pointer w-full h-[200px] border-2 border-dashed border-gray-400 rounded flex justify-center items-center"
                >
                  <span class="text-xs"
                    ><i
                      class="fa-solid fa-plus text-lg font-semibold py-3 px-5 bg-[#ff613c] rounded-full shadow text-white"
                    ></i
                  ></span>
                </div>
                <div v-if="featureImagePreview" class="">
                  <img
                    class="h-auto w-full rounded"
                    :src="featureImagePreview"
                    alt=""
                  />
                </div>
                <p v-if="errors?.image" class="mt-1 text-xs text-red-600">
                  {{ errors.image[0] }}
                </p>
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
                      v-if="formitem.product_type == '5'"
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
                      v-if="formitem.product_type == '5'"
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
                      v-if="formitem.product_type == '5'"
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
                      v-if="formitem.product_type == '5'"
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
                  @closeModal="clickdetaildes = false"
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
                      v-if="itemType == '5'"
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
                      v-if="itemType == '5'"
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
                      v-if="itemType == '5'"
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
                      v-if="itemType == '5'"
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
                          Cost Price
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
                          <div class="" v-if="formitem.product_type == '6'">
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
                          <div class="" v-if="formitem.product_type == '5'">
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
                          <!-- <input
                            type="text"
                            disabled
                            v-model="formitem.cost_price"
                            id="title"
                            class="px-1 py-1.5 focus:outline-none text-xs rounded"
                          /> -->
                          <!-- <p>{{ formitem.cost_price }}</p> -->
                          <p v-if="formitem.product_type != '6'">
                            {{ formitem.cost_price }}
                          </p>
                          <input
                            v-if="formitem.product_type == '6'"
                            type="number"
                            v-model="formitem.cost_price"
                            class="border-gray-400 px-1 py-1.5 max-w-[50px] focus:outline-none rounded border"
                          />
                        </td>
                        <td
                          class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
                        >
                          <p v-if="formitem.product_type != '6'">
                            {{ formitem.selling_price }}
                          </p>
                          <input
                            v-if="formitem.product_type == '6'"
                            type="number"
                            v-model="formitem.selling_price"
                            class="border-gray-400 px-1 py-1.5 max-w-[50px] focus:outline-none rounded border"
                          />
                        </td>
                        <td
                          v-if="formitem.product_type == '5'"
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
                          v-if="formitem.product_type != '5'"
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
                            v-if="formitem.product_id"
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
                      >
                        <td
                          class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
                        >
                          <i
                            class="text-lg text-green-600 fa-solid fa-circle-check"
                          ></i>
                        </td>
                        <td
                          class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
                        >
                          <p v-if="item.product_type == '1'">Vantour</p>
                          <p v-if="item.product_type == '2'">Group</p>
                          <p v-if="item.product_type == '3'">Airport</p>
                          <p v-if="item.product_type == '4'">Entrance</p>
                          <p v-if="item.product_type == '5'">Hotel</p>
                          <p v-if="item.product_type == '6'">AirLine</p>
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
                            :options="hotels?.data"
                            label="name"
                            disabled
                            :clearable="false"
                            :reduce="(d) => d.id"
                            placeholder="Choose product type"
                          ></v-select>
                          <v-select
                            v-if="item.product_type == '6'"
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
                            v-if="item.car_id && item.product_type != '6'"
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
                            v-if="item.car_id && item.product_type == '6'"
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
                          <!-- <input
                            type="date"
                            v-model="item.service_date"
                            class="text-xs focus:outline-none"
                          /> -->
                          <p>
                            {{ item.cost_price }}
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
                          v-if="item.product_type == '5'"
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
                          v-if="item.product_type != '5'"
                          class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
                        >
                          <p>{{ item.quantity }}</p>
                        </td>
                        <td
                          class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
                        >
                          <p v-if="item.product_type != '5'">
                            {{ item.cost_price * item.quantity }}
                          </p>
                          <p v-if="item.product_type == '5'">
                            {{ item.cost_price * item.quantity * item.days }}
                          </p>
                        </td>

                        <td
                          class="px-4 py-3 text-sm text-gray-800 border-gray-300 text-start"
                        >
                          <button
                            class="mr-4 text-sm text-blue-600"
                            @click="clickdetaildesToggle(item, index)"
                          >
                            <i
                              class="fa-solid fa-ellipsis text-xs font-semibold px-1 py-[1.5px] bg-blue-500 rounded-full shadow text-white"
                              title="add description"
                            ></i>
                          </button>
                          <button
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
                    </div>

                    <!-- <div class="mt-6 mb-3 text-end" v-show="allowCreate">
                      <Button
                        @click.prevent="onSubmitHandler"
                        class="py-2 px-14"
                      >
                        Create
                      </Button>
                    </div>
                    <div class="mt-6 mb-3 text-end" v-show="!allowCreate">
                      <Button class="py-2 bg-gray-400 px-14"> Create </Button>
                    </div> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="text-end">
            <Button
              class="bg-gray-300"
              v-if="
                formData.items.length == 0 ||
                formData.images.length == 0 ||
                formData.cover_image == '' ||
                formData.name == '' ||
                formData.description == ''
              "
            >
              Create
            </Button>
            <Button
              @click.prevent="onSubmitHandler"
              v-if="
                formData.items.length != 0 &&
                formData.images.length != 0 &&
                formData.cover_image != '' &&
                formData.name != '' &&
                formData.description != ''
              "
            >
              Create
            </Button>
          </div>
        </div>
      </div>
      <!--  -->
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
</style>
