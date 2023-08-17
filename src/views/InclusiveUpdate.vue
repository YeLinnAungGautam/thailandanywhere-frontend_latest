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
import { useVantourStore } from "../stores/vantour";
import { useGrouptourStore } from "../stores/grouptour";
import { useAirportStore } from "../stores/airport";
import { useEntranceStore } from "../stores/entrance";
import { useBookingStore } from "../stores/booking";
import { useInclusiveStore } from "../stores/inclusion";

const vantourStore = useVantourStore();
const grouptourStore = useGrouptourStore();
const airportStore = useAirportStore();
const entranceStore = useEntranceStore();
const bookingStore = useBookingStore();
const inclusiveStore = useInclusiveStore();

const { vantours } = storeToRefs(vantourStore);
const { grouptours } = storeToRefs(grouptourStore);
const { airports } = storeToRefs(airportStore);
const { entrances } = storeToRefs(entranceStore);

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
  { id: "1", name: "Van Tour", data: "App\\Models\\PrivateVanTour" },
  { id: "2", name: "Group Tour", data: "App\\Models\\GroupTour" },
  { id: "3", name: "Airport Pickup", data: " App\\Models\\AirportPickup" },
  { id: "4", name: "Entrance Ticket", data: "App\\Models\\EntranceTicket" },
];

const formitem = ref({
  product_type: "",
  product_id: "",
  car_id: "",
  car_list: [],
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
const carType = ref([]);
const chooseCar = async (id) => {
  if (formitem.value.product_type == "1" && id) {
    const res = await vantourStore.getDetailAction(id);
    console.log(res);
    carType.value = res.result.cars;
  } else if (formitem.value.product_type == "2") {
    const res = await grouptourStore.getDetailAction(id);
    formitem.value.selling_price = res.result.price;
    carType.value = res.result.cars;
    console.log(res);
  } else if (formitem.value.product_type == "3") {
    const res = await airportStore.getDetailAction(id);
    carType.value = res.result.cars;
    console.log(res);
  } else if (formitem.value.product_type == "4") {
    const res = await entranceStore.getDetailAction(id);
    formitem.value.selling_price = res.result.variations[0].price;
    console.log(res.result.variations[0].price);
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
    formitem.value.car_list = res.result.cars;
    for (i = 0; i < res.result.cars.length; i++) {
      if (res.result.cars[i].id == id) {
        formitem.value.selling_price = res.result.cars[i].price;
        console.log(res.result.cars[i].price);
      }
    }
    console.log(res);
  }
};
const addNewitem = () => {
  formData.value.items.push(formitem.value);
  console.log(formData.value.items);
  formitem.value = {
    product_type: "",
    product_id: "",
    service_date: "",
    car_id: "",
    car_list: [],
  };

  addToggle();
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
  frmData.append("_method", "PUT");

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
    }
  }
  for (var x = 0; x < formData.value.items.length; x++) {
    frmData.append(
      "products[" + x + "][product_id]",
      formData.value.items[x].product_id
    );
  }
  for (var x = 0; x < formData.value.items.length; x++) {
    frmData.append(
      "products[" + x + "][car_id]",
      formData.value.items[x].car_id
    );
  }
  frmData.append("cover_image", formData.value.cover_image);

  try {
    const response = await inclusiveStore.updateAction(
      frmData,
      route.params.id
    );
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
    router.push("/products/4");
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

const editData = ref({
  cover_image: "",
  images: [],
});

const getDetail = async () => {
  try {
    const response = await inclusiveStore.getDetailAction(route.params.id);
    console.log(response, "this is response");
    formData.value.name = response.result.name;
    formData.value.description = response.result.description;
    formData.value.price = response.result.price;
    formData.value.agent_price = response.result.agent_price;
    editData.value.cover_image = response.result.cover_image;
    editData.value.images = response.result.images;
    formData.value.sku_code = response.result.sku_code;
    if (response.result.airport_pickups.length != 0) {
      for (const x in response.result.airport_pickups) {
        const itemData = {
          product_type: "3",
          product_id: response.result.airport_pickups[x].product.id,
          car_id: response.result.airport_pickups[x].car
            ? response.result.airport_pickups[x].car.id
            : "",
          car_name: response.result.airport_pickups[x].car
            ? response.result.airport_pickups[x].car.name
            : "",
        };
        formData.value.items.push(itemData);
      }
    }
    if (response.result.entrance_tickets.length != 0) {
      for (const x in response.result.entrance_tickets) {
        const itemData = {
          product_type: "4",
          product_id: response.result.entrance_tickets[x].product.id,
          car_id: response.result.entrance_tickets[x].car
            ? response.result.entrance_tickets[x].car.id
            : "",
          car_name: response.result.entrance_tickets[x].car
            ? response.result.entrance_tickets[x].car.name
            : "",
        };
        formData.value.items.push(itemData);
      }
    }
    if (response.result.group_tours.length != 0) {
      for (const x in response.result.group_tours) {
        const itemData = {
          product_type: "2",
          product_id: response.result.group_tours[x].product.id,
          car_id: response.result.group_tours[x].car
            ? response.result.group_tours[x].car.id
            : "",
          car_name: response.result.group_tours[x].car
            ? response.result.group_tours[x].car.name
            : "",
        };
        formData.value.items.push(itemData);
      }
    }
    if (response.result.private_van_tours.length != 0) {
      for (const x in response.result.private_van_tours) {
        const itemData = {
          product_type: "1",
          product_id: response.result.private_van_tours[x].product.id,
          car_id: response.result.private_van_tours[x].car
            ? response.result.private_van_tours[x].car.id
            : "",
          car_name: response.result.private_van_tours[x].car
            ? response.result.private_van_tours[x].car.name
            : "",
        };
        formData.value.items.push(itemData);
      }
    }

    console.log(formData.value.items, "this is push");
    console.log(formData.value.receipt_images, "this is image");
  } catch (error) {
    console.log(error);
  }
};

const pageAction = ref("");

onMounted(async () => {
  await getDetail();
  pageAction.value = route.params.action;
  await vantourStore.getSimpleListAction();
  await grouptourStore.getSimpleListAction();
  await airportStore.getSimpleListAction();
  await entranceStore.getSimpleListAction();
});
</script>

<template>
  <Layout>
    <div class="mb-5 flex items-center justify-between">
      <h3
        class="text-2xl font-medium text-gray-600"
        v-if="pageAction == 'view'"
      >
        View Inclusive
      </h3>
      <h3
        class="text-2xl font-medium text-gray-600"
        v-if="pageAction == 'edit'"
      >
        Edit Inclusive
      </h3>
      <div class="space-x-3"></div>
    </div>
    <div class="grid grid-cols-3 gap-3">
      <div class="bg-white/60 col-span-2 p-6 rounded-lg shadow-sm mb-5">
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-8">
            <div class="">
              <p class="text-gray-800 text-sm mb-2">Name</p>
              <input
                v-model="formData.name"
                type="text"
                id="title"
                class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.name" class="mt-1 text-sm text-red-600">
                {{ errors.name[0] }}
              </p>
            </div>
            <div class="">
              <p class="text-gray-800 text-sm mb-2">SKU code</p>
              <input
                v-model="formData.sku_code"
                type="text"
                id="title"
                class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.sku_code" class="mt-1 text-sm text-red-600">
                {{ errors.sku_code[0] }}
              </p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-8">
            <div class="">
              <p class="text-gray-800 text-sm mb-2">Price</p>
              <input
                v-model="formData.price"
                type="text"
                id="title"
                class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.price" class="mt-1 text-sm text-red-600">
                {{ errors.price[0] }}
              </p>
            </div>
            <div class="">
              <p class="text-gray-800 text-sm mb-2">Agent Price</p>
              <input
                v-model="formData.agent_price"
                type="text"
                id="title"
                class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.agent_price" class="mt-1 text-sm text-red-600">
                {{ errors.agent_price[0] }}
              </p>
            </div>
          </div>
          <div class="gird grid-cols-1 col-span-3 py-5">
            <div
              class="mb-3 text-sm font-semibold cursor-pointer flex justify-end"
            >
              <p @click="addToggle" v-if="!addComment">+ Add Item</p>
              <p @click="addToggle" v-if="addComment">- Remove Item</p>
            </div>
            <div class="col-span-1 rounded">
              <div class="col-span-1">
                <div class="px-6 pt-3">
                  <table class="w-full">
                    <thead>
                      <tr class="border-b border-gray-300">
                        <th
                          class="border-r py-2 text-start px-4 border-gray-300 text-xs text-blue-400"
                        ></th>

                        <th
                          class="border-r py-2 text-start px-4 font-base border-gray-300 text-xs text-gray-800"
                        >
                          P Type
                        </th>
                        <th
                          class="border-r py-2 text-start px-4 font-base border-gray-300 text-xs text-gray-800"
                        >
                          Product Name
                        </th>
                        <th
                          class="border-r py-2 text-start px-4 font-base border-gray-300 text-xs text-gray-800"
                        >
                          Car Type
                        </th>
                        <th
                          class="py-2 text-start px-4 border-gray-300 text-xs text-blue-400"
                        ></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="rounded-lg" v-if="addComment">
                        <td
                          colspan="2"
                          class="py-3 text-start px-4 border-gray-300 text-sm text-gray-800"
                        >
                          <v-select
                            v-model="formitem.product_type"
                            class="style-chooser min-w-[80px]"
                            :options="formItemType"
                            label="name"
                            :clearable="false"
                            :reduce="(d) => d.id"
                            @option:selected="chooseType"
                          ></v-select>
                        </td>
                        <td
                          class="py-3 text-start px-4 border-gray-300 text-sm text-gray-800"
                        >
                          <v-select
                            v-model="formitem.product_id"
                            class="style-chooser min-w-[100px]"
                            :options="productList"
                            label="name"
                            :clearable="false"
                            :reduce="(d) => d.id"
                            @option:selected="chooseCar(formitem.product_id)"
                          ></v-select>
                        </td>
                        <td
                          class="py-3 text-start px-4 border-gray-300 text-sm text-gray-800"
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
                        </td>

                        <td
                          class="py-3 text-start px-4 border-gray-300 text-sm text-gray-800"
                        >
                          <button @click.prevent="addNewitem" class="flex-1">
                            <i
                              class="fa-solid fa-plus text-xs font-semibold px-1 py-[1.5px] rounded-full shadow text-white bg-blue-600"
                            ></i>
                          </button>
                        </td>
                      </tr>
                      <tr class="border-b border-gray-300 text-xs text-red-500">
                        <td
                          class="text-right pb-2"
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
                          class="py-3 text-start px-4 border-gray-300 text-sm text-gray-800"
                        >
                          <i class="fa-solid fa-check"></i>
                        </td>
                        <td
                          class="py-3 text-start px-4 border-gray-300 text-sm text-gray-800"
                        >
                          <p v-if="item.product_type == '1'">Vantour</p>
                          <p v-if="item.product_type == '2'">Group</p>
                          <p v-if="item.product_type == '3'">Airport</p>
                          <p v-if="item.product_type == '4'">Entrance</p>
                        </td>
                        <td
                          class="py-3 text-start px-4 border-gray-300 text-sm text-gray-800"
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
                        </td>
                        <td
                          class="py-3 text-start px-4 border-gray-300 text-sm text-gray-800"
                        >
                          <v-select
                            v-if="item.car_id && !item.car_name"
                            v-model="item.car_id"
                            class="style-chooser"
                            :options="item.car_list"
                            label="name"
                            disabled
                            :clearable="false"
                            :reduce="(d) => d.id"
                            placeholder="Choose product type"
                          ></v-select>
                          <p v-if="item.car_id && item.car_name">
                            {{ item.car_name }}
                          </p>
                          <p v-if="!item.car_id">-</p>
                        </td>

                        <td
                          class="py-3 text-start px-4 border-gray-300 text-sm text-gray-800"
                        >
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
                          class="py-3 px-4 text-center border-gray-300 text-sm text-red-500"
                        >
                          there isn't item !
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="">
            <p class="text-gray-800 text-sm mb-2">Description</p>
            <textarea
              v-model="formData.description"
              rows="3"
              id="title"
              class="w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.description" class="mt-1 text-sm text-red-600">
              {{ errors.description[0] }}
            </p>
          </div>

          <div class="text-end" v-if="pageAction == 'edit'">
            <Button @click.prevent="onSubmitHandler"> Create </Button>
          </div>
        </div>
      </div>
      <div>
        <div class="bg-white/60 p-6 rounded-lg shadow-sm mb-5">
          <div class="flex items-center justify-start gap-3 mb-3">
            <p>Images</p>
            <div>
              <button
                class="text-sm text-blue-600"
                @click.prevent="openFileImagePicker"
              >
                <i
                  class="fa-solid fa-plus text-sm font-semibold px-2 py-1 bg-blue-600 rounded-full shadow text-white"
                ></i>
              </button>
            </div>
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
            class="grid grid-cols-3 gap-2 mb-6 bg-white rounded-md shadow"
            v-if="imagesPreview.length == 0"
          >
            <div
              class="relative"
              v-for="(image, index) in editData.images"
              :key="index"
            >
              <img class="h-auto w-full rounded" :src="image.image" alt="" />
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
                class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
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
                  class="fa-solid fa-plus text-lg font-semibold py-1 px-3 bg-blue-500 rounded-full shadow text-white"
                ></i
              ></span>
            </div>
          </div>
        </div>
        <div class="bg-white/60 p-6 rounded-lg shadow-sm mb-5">
          <div class="flex items-center justify-between gap-3 mb-3">
            <p>Feature Image</p>
            <input
              type="file"
              ref="featureImageInput"
              class="hidden"
              @change="handlerFeatureFileChange"
              accept="image/*"
            />

            <button
              class="text-sm text-red-600"
              v-if="!featureImagePreview"
              @click.prevent="openFileFeaturePicker"
            >
              <i
                class="fa-solid fa-minus text-sm font-semibold px-2 py-1 bg-red-500 rounded-full shadow text-white"
              ></i>
            </button>
            <button
              v-else
              @click.prevent="removeFeatureSelectImage"
              class="text-sm text-red-500"
            >
              <i
                class="fa-solid fa-minus text-sm font-semibold px-2 py-1 bg-red-500 rounded-full shadow text-white"
              ></i>
            </button>
          </div>

          <div v-if="featureImagePreview" class="">
            <img
              v-if="featureImagePreview || !formData.cover_image"
              class="h-auto w-full rounded"
              :src="featureImagePreview"
              alt=""
            />
          </div>
          <div
            v-if="!featureImagePreview"
            class="p-2 bg-white rounded-md shadow"
          >
            <img :src="editData.cover_image" alt="" class="w-full" />
          </div>
          <p v-if="errors?.image" class="mt-1 text-sm text-red-600">
            {{ errors.image[0] }}
          </p>
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
</style>
