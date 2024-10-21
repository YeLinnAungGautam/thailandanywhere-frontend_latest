<script setup>
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { PlusIcon, ListBulletIcon } from "@heroicons/vue/24/outline";
import { computed, onMounted, onUnmounted, ref, defineProps } from "vue";
import Button from "../components/Button.vue";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import Modal from "../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";

import { useToast } from "vue-toastification";
import { useRouter, useRoute } from "vue-router";
import { useInclusiveStore } from "../stores/inclusion";

const toast = useToast();
const router = useRouter();
const route = useRoute();
const inclusiveStore = useInclusiveStore();

const props = defineProps({
  data: Object,
});

const formData = ref({
  name: "",
  day: "",
  night: "",
  description: "",
  cover_image: "",
  sku_code: "",
  images: [],
  price: "",
  items: [],
  agent_price: "",
  feature_image: "",
});

formData.value.day = computed(() => {
  return formData.value.night + 1;
});

const formitem = ref({
  product_type: "",
  product_name: "",
  product_id: "",
  car_id: "",
  car_name: "",
  variation_id: "",
  variation_name: "",
  room_id: "",
  room_name: "",
  ticket_id: "",
  ticket_name: "",
  selling_price: "",
  cost_price: "",
  quantity: "",
  days: "",
});

const errors = ref(null);

const onSubmitHandler = async () => {
  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("sku_code", formData.value.sku_code);
  frmData.append("day", formData.value.day);
  frmData.append("night", formData.value.night);
  // frmData.append("description", formData.value.description);
  formData.value.price ? frmData.append("price", formData.value.price) : 0;
  formData.value.agent_price
    ? frmData.append("agent_price", formData.value.agent_price)
    : 0;

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
    frmData.append("products[" + x + "][day]", formData.value.items[x].days);
    formData.value.items[x].cost_price
      ? frmData.append(
          "products[" + x + "][cost_price]",
          formData.value.items[x].cost_price
        )
      : frmData.append(
          "products[" + x + "][cost_price]",
          formData.value.items[x].selling_price
        );
    frmData.append(
      "products[" + x + "][selling_price]",
      formData.value.items[x].selling_price
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
          formData.value.items[x].variation_id
        )
      : "";
    formData.value.items[x].product_type == "5"
      ? frmData.append(
          "products[" + x + "][room_id]",
          formData.value.items[x].room_id
        )
      : "";

    formData.value.items[x].product_type == "6"
      ? frmData.append(
          "products[" + x + "][ticket_id]",
          formData.value.items[x].ticket_id
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
      day: "",
      night: "",
      images: [],
      items: [],
      price: "",
      feature_image: "",
    };
    errors.value = null;
    toast.success(response.message);
    setTimeout(() => window.location.reload(), 3000);
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

const formItemType = [
  { id: "1", name: "Van Tour", data: "AppModelsPrivateVanTour" },
  { id: "2", name: "Group Tour", data: "AppModelsGroupTour" },
  { id: "3", name: "Airport Pickup", data: " AppModelsAirportPickup" },
  { id: "4", name: "Entrance Ticket", data: "AppModelsEntranceTicket" },
  { id: "5", name: "Hotel Room", data: "AppModelsRoom" },
  { id: "6", name: "AirLine", data: "AppModelsAirline" },
];

const getData = () => {
  let data = props?.data;
  formData.value.name = data.inclusive_name;
  formData.value.price = data.inclusive_rate;
  formData.value.agent_price = 0;
  if (data?.items.length > 0) {
    for (let i = 0; i < data?.items.length; i++) {
      if (
        data?.items[i].product_type != "App\\Models\\InclusiveProduct" &&
        data?.items[i].product?.id != undefined &&
        data?.items[i].product?.name != undefined
      ) {
        if (data?.items[i].product_type == "App\\Models\\PrivateVanTour") {
          formitem.value.product_type = 1;
        } else if (data?.items[i].product_type == "App\\Models\\GroupTour") {
          formitem.value.product_type = 2;
        } else if (
          data?.items[i].product_type == "App\\Models\\AirportPickup"
        ) {
          formitem.value.product_type = 3;
        } else if (
          data?.items[i].product_type == "App\\Models\\EntranceTicket"
        ) {
          formitem.value.product_type = 4;
        } else if (data?.items[i].product_type == "App\\Models\\Hotel") {
          formitem.value.product_type = 5;
        } else if (
          data?.items[i].product_type == "App\\Models\\AirlineTicket"
        ) {
          formitem.value.product_type = 6;
        }

        formitem.value.product_name = data?.items[i].product?.name;
        formitem.value.product_id = data?.items[i].product?.id;
        formitem.value.car_id = data?.items[i].car?.id
          ? data?.items[i].car?.id
          : null;
        formitem.value.car_name = data?.items[i].car?.name
          ? data?.items[i].car?.name
          : null;
        formitem.value.variation_id = data?.items[i].variation?.id
          ? data?.items[i].variation?.id
          : null;
        formitem.value.variation_name = data?.items[i].variation?.name
          ? data?.items[i].variation?.name
          : null;
        formitem.value.room_id = data?.items[i].room?.id
          ? data?.items[i].room?.id
          : null;
        formitem.value.room_name = data?.items[i].room?.name
          ? data?.items[i].room?.name
          : null;
        formitem.value.ticket_id = data?.items[i].ticket?.id
          ? data?.items[i].ticket?.id
          : null;
        formitem.value.ticket_name = data?.items[i].ticket?.name
          ? data?.items[i].ticket?.name
          : null;
        formitem.value.selling_price = data?.items[i].selling_price
          ? data?.items[i].selling_price
          : 0;
        formitem.value.cost_price = data?.items[i].cost_price
          ? data?.items[i].cost_price
          : 0;
        formitem.value.quantity = 1;
        formitem.value.days = "";

        // add to items
        formData.value.items.push(formitem.value);
        formitem.value = {
          product_type: "",
          product_name: "",
          product_id: "",
          car_id: "",
          car_name: "",
          variation_id: "",
          variation_name: "",
          room_id: "",
          room_name: "",
          ticket_id: "",
          ticket_name: "",
          selling_price: "",
          cost_price: "",
          quantity: "",
          days: "",
        };
        console.log(formData.value.items, "this is items data for looop");
      }
    }
  }
};

onMounted(async () => {
  console.log(props.data, "this is props data");
  if (props?.data) {
    getData();
  }
});
</script>

<template>
  <div>
    <div class="grid grid-cols-1 gap-3">
      <div class="bg-white/60 col-span-2">
        <div class="space-y-2">
          <div class="grid grid-cols-2 gap-6">
            <div class="col-span-2">
              <div class="grid grid-cols-2 gap-4">
                <div class="">
                  <p class="text-gray-800 text-xs mb-2">Name</p>
                  <input
                    v-model="formData.name"
                    type="text"
                    id="title"
                    class="h-8 w-full text-xs bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
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
                    class="h-8 w-full text-xs bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
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
                    class="h-8 w-full text-xs bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
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
                    class="h-8 w-full text-xs bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                  />
                  <p
                    v-if="errors?.agent_price"
                    class="mt-1 text-xs text-red-600"
                  >
                    {{ errors.agent_price[0] }}
                  </p>
                </div>
                <div class="">
                  <p class="text-gray-800 text-xs mb-2">
                    Days <small class="text-[#ff613c]">(only number)</small>
                  </p>
                  <input
                    v-model="formData.day"
                    type="number"
                    id="title"
                    disabled
                    class="h-8 w-full text-xs bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                  />
                  <p v-if="errors?.day" class="mt-1 text-xs text-red-600">
                    {{ errors.day[0] }}
                  </p>
                </div>
                <div class="">
                  <p class="text-gray-800 text-xs mb-2">
                    Nights <small class="text-[#ff613c]">(only number)</small>
                  </p>
                  <input
                    v-model="formData.night"
                    type="number"
                    id="title"
                    class="h-8 w-full text-xs bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                  />
                  <p v-if="errors?.night" class="mt-1 text-xs text-red-600">
                    {{ errors.night[0] }}
                  </p>
                </div>
                <!-- <div class="col-span-2">
                  <p class="text-gray-800 text-xs mb-2">Description</p>
                  <textarea
                    v-model="formData.description"
                    rows="3"
                    id="title"
                    class="w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                  />
                  <p
                    v-if="errors?.description"
                    class="mt-1 text-xs text-red-600"
                  >
                    {{ errors.description[0] }}
                  </p>
                </div> -->
              </div>
            </div>
          </div>

          <div class="py-3 space-y-3 h-[400px] overflow-scroll">
            <div
              class="grid grid-cols-6 gap-x-2"
              v-for="(i, index) in formData.items"
              :key="i"
              :class="
                i.product_type == 'App\\Models\\InclusiveProduct'
                  ? 'hidden'
                  : ''
              "
            >
              <div
                class="border border-gray-100 col-span-4 shadow-sm rounded-lg p-3 space-y-1 w-full"
              >
                <div
                  class="text-sm flex justify-start items-center gap-x-3 text-[#ff613c] font-medium"
                >
                  {{ index + 1 }} . prodct :
                  <p
                    v-for="d in formItemType"
                    :key="d"
                    :class="d.id == i.product_type ? '' : 'hidden'"
                  >
                    {{ d.name }}
                  </p>
                </div>
                <p class="text-xs font-medium">name : {{ i.product_name }}</p>
                <p class="text-xs" v-if="i.car_id">{{ i.car_name }}</p>
                <p class="text-xs" v-if="i.room_id">{{ i.room_name }}</p>
                <p class="text-xs" v-if="i.ticket_id">{{ i.ticket_name }}</p>
                <p class="text-xs" v-if="i.variation_id">
                  {{ i.variation_name }}
                </p>
                <div class="flex justify-start gap-x-4 items-center">
                  <p class="text-xs font-normal">selling price</p>
                  <p class="text-xs font-normal text-[#ff613c]">
                    {{ i.selling_price }} thb
                  </p>
                </div>
                <div class="flex justify-start gap-x-4 items-center">
                  <p class="text-xs font-normal">cost price</p>
                  <p class="text-xs font-normal text-[#ff613c]">
                    {{ i.cost_price }} thb
                  </p>
                </div>
                <div class="flex justify-start gap-x-4 items-center">
                  <p class="text-xs font-normal">quantity</p>
                  <p class="text-xs font-normal text-[#ff613c]">
                    {{ i.quantity }}
                  </p>
                </div>
              </div>
              <div
                class="border border-gray-100 shadow-sm col-span-2 rounded-lg p-2 space-y-3 w-full"
              >
                <p
                  class="text-sm text-[#ff613c] font-medium border-b border-gray-100 pb-1"
                >
                  day
                  <span class="text-xs text-black font-normal"
                    >(we do this service)</span
                  >
                </p>
                <div class="py-3">
                  <select
                    name="days"
                    id=""
                    class="w-full border border-gray-100 focus:outline-none rounded px-4 py-2"
                    v-model="i.days"
                  >
                    <option
                      :value="d"
                      v-for="d in formData.day"
                      class="text-xs"
                      :key="d"
                    >
                      {{ d }} th
                    </option>
                    <option class="text-xs" :value="100">all</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="w-full flex gap-x-4">
            <Button
              class="bg-gray-300 w-full"
              v-if="formData.items.length == 0 || formData.name == ''"
            >
              Change Inclusive Product
            </Button>
            <Button
              @click.prevent="onSubmitHandler"
              class="w-full"
              v-if="formData.items.length != 0 && formData.name != ''"
            >
              Change Inclusive Product
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
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
