<script setup>
import Layout from "./Layout.vue";
import { ref, watch, onMounted } from "vue";
import { CheckCircleIcon } from "@heroicons/vue/24/solid";
import GeneralDetailVue from "./InclusiveComponent/GeneralDetail.vue";
import ItemDetail from "./InclusiveComponent/ItemDetail.vue";
import ContentDetail from "./InclusiveComponent/ContentDetail.vue";
import OtherMaterial from "./InclusiveComponent/OtherMaterial.vue";
import { useToast } from "vue-toastification";
import { useInclusiveStore } from "../stores/inclusion";
import { useRouter, useRoute } from "vue-router";
import OtherDetail from "./InclusiveComponent/OtherDetail.vue";
import DesignDetail from "./InclusiveComponent/DesignDetail.vue";

const inclusiveStore = useInclusiveStore();
const toast = useToast();
const router = useRouter();
const route = useRoute();
const session = ref(1);
const finish = ref({
  session1: false,
  session2: false,
  session3: false,
  session4: false,
  session5: false,
  session6: false,
});

const formData = ref({
  name: "",
  day: "",
  night: "",
  description: "",
  details: [],
  price_range: [],
  cover_image: "",
  sku_code: "",
  images: [],

  other_materials: [],
  price: "",
  items: [],
  agent_price: "",
  feature_image: "",
});

const editData = ref({
  cover_image: "",
  pdfs: null,
  images: [],
});

const saveSession1 = () => {
  finish.value.session1 = true;
  console.log(formData.value);
};

watch(formData.value, () => {
  if (
    formData.value.name != "" &&
    formData.value.day != "" &&
    formData.value.night != "" &&
    formData.value.price != "" &&
    formData.value.sku_code != "" &&
    formData.value.price_range.length > 0
  ) {
    finish.value.session1 = true;
  }
  if (formData.value.items.length > 0) {
    finish.value.session2 = true;
  }
  if (formData.value.details.length > 0) {
    if (
      formData.value.details[0].title_name != "" &&
      formData.value.details[0].cities?.length != 0 &&
      formData.value.details[0].destinations.length != 0
    ) {
      finish.value.session3 = true;
    }
  }
  if (formData.value.details.length > 0) {
    if (
      formData.value.description != "" &&
      formData.value.details[0].summary_mm &&
      formData.value.details[0].summary
    ) {
      finish.value.session4 = true;
    }
  }
  if (formData.value.details.length > 0) {
    if (
      formData.value.images.length > 0 &&
      formData.value.details[0].image_url != null
    ) {
      finish.value.session5 = true;
    }
  }
  if (
    formData.value.other_materials?.length > 0 &&
    editData.value.pdfs?.length > 0
  ) {
    finish.value.session6 = true;
  }
});

const errors = ref(null);

const onSubmitHandler = async () => {
  // console.log("====================================");
  // console.log(formData.value, "this is formData");
  // console.log("====================================");
  const frmData = new FormData();
  frmData.append("_method", "PUT");
  frmData.append("name", formData.value.name);
  frmData.append("day", formData.value.day);
  frmData.append("night", formData.value.night);
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

  if (formData.value.price_range.length > 0) {
    for (let i = 0; i < formData.value.price_range.length; i++) {
      let p = formData.value.price_range[i];
      frmData.append("price_range[" + i + "][from]", p.from);
      frmData.append("price_range[" + i + "][to]", p.to);
      frmData.append("price_range[" + i + "][price]", p.price);
    }
  }

  if (formData.value.other_materials.length > 0) {
    for (let i = 0; i < formData.value.other_materials.length; i++) {
      let p = formData.value.other_materials[i];
      frmData.append("product_itenary_material[" + i + "][link]", p.link);
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
    frmData.append("products[" + x + "][day]", formData.value.items[x].day);
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
    frmData.append("products[" + x + "][quantity]", 1);
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
          formData.value.items[x].car_id
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
    const response = await inclusiveStore.updateAction(
      frmData,
      route.params.id
    );
    const frmData2 = new FormData();
    for (let i = 0; i < formData.value.details.length; i++) {
      frmData2.append(
        `details[${i}][day_name]`,
        formData.value.details[i].day_name
      );
      frmData2.append(`details[${i}][title]`, formData.value.details[i].title);
      frmData2.append(
        `details[${i}][summary]`,
        formData.value.details[i].summary
      );
      frmData2.append(
        `details[${i}][summary_mm]`,
        formData.value.details[i].summary_mm
      );
      frmData2.append(`details[${i}][meals]`, formData.value.details[i].meals);
      frmData2.append(
        `details[${i}][cities]`,
        formData.value.details[i].cities
      );
      frmData2.append(
        `details[${i}][destinations]`,
        formData.value.details[i].destinations
      );
      if (formData.value.details[i].image) {
        frmData2.append(
          `details[${i}][image]`,
          formData.value.details[i].image
        );
      }
    }
    const res = await inclusiveStore.addNewDetailAction(
      frmData2,
      route.params.id
    );
    console.log(res, "====================================");
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
    console.log("====================================");
    console.log(response, "this is response");
    console.log("====================================");
    toast.success(response.message);
    // router.push("/products/10");
    router.push("/inclusive/new/update/" + route.params.id + "/edit");

    setTimeout(() => {
      window.location.reload();
    }, 2000);
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
    const response = await inclusiveStore.getDetailAction(route.params.id);
    console.log(response, "this is response");
    formData.value.name = response.result.name;
    formData.value.description = response.result.description;
    // formData.value.day = response.result.day;
    formData.value.night = response.result.night;
    formData.value.price = response.result.price;
    formData.value.agent_price = response.result.agent_price;
    editData.value.cover_image = response.result.cover_image;
    editData.value.pdfs = response.result.pdfs;
    // editData.value.images = response.result.images;
    // formData.value.images = response.result.images;
    if (response.result.images.length > 0) {
      for (let i = 0; i < response.result.images.length; i++) {
        const image = response.result.images[i].image;
        formData.value.images.push(image);
        editData.value.images.push(response.result.images[i]);
      }
    }
    // formData.value.other_materials =
    //   response.result.other_materials == null
    //     ? []
    //     : response.result.other_materials;
    formData.value.sku_code = response.result.sku_code;
    if (response.result.price_range != null) {
      if (response.result.price_range.length > 0) {
        for (const x in response.result.price_range) {
          formData.value.price_range.push({
            from: response.result.price_range[x].from,
            to: response.result.price_range[x].to,
            price: response.result.price_range[x].price,
          });
        }
      }
    }
    if (response.result.product_itenary_material != null) {
      for (
        let p = 0;
        p < response.result.product_itenary_material.length;
        p++
      ) {
        const element = response.result.product_itenary_material[p];
        formData.value.other_materials.push({
          link: element.link,
        });
      }
    } else {
      formData.value.product_itenary_material = [];
    }
    if (response.result.details != null) {
      if (response.result.details.length > 0) {
        response.result.details.forEach((detail) => {
          formData.value.details.push({
            day_name: detail.day_name,
            title: detail.title,
            summary: detail.summary,
            summary_mm: detail.summary_mm,
            meals: detail.meals,
            cities: detail.cities.map((city) => city.id), // Extracting only the IDs
            destinations: detail.destinations
              ? detail.destinations?.map((destination) => destination.id)
              : "", // Extracting only the IDs
            image_url: detail.image ? detail.image : "",
          });
        });
      }
    }
    if (response.result.entrance_tickets.length != 0) {
      for (const x in response.result.entrance_tickets) {
        const itemData = {
          product_type: "4",
          product_id: response.result.entrance_tickets[x].product?.id,
          product_name: response.result.entrance_tickets[x].product?.name,
          product_image: response.result.entrance_tickets[x].product
            ?.cover_image
            ? response.result.entrance_tickets[x].product?.cover_image
            : "",
          car_id: response.result.entrance_tickets[x].variation
            ? response.result.entrance_tickets[x].variation.id
            : "",
          item_name: response.result.entrance_tickets[x].variation
            ? response.result.entrance_tickets[x].variation.name
            : "",
          car_list: response.result.entrance_tickets[x].product
            ? response.result.entrance_tickets[x].product.variations
            : "",
          cost_price: response.result.entrance_tickets[x].cost_price
            ? response.result.entrance_tickets[x].cost_price
            : response.result.entrance_tickets[x].selling_price,
          selling_price: response.result.entrance_tickets[x].selling_price,
          quantity: response.result.entrance_tickets[x].quantity,
          day: response.result.entrance_tickets[x].day,
          total_amount:
            response.result.entrance_tickets[x].selling_price *
            response.result.entrance_tickets[x].quantity,
        };
        formData.value.items.push(itemData);
      }
    }
    if (response.result.hotels.length != 0) {
      for (const x in response.result.hotels) {
        const itemData = {
          product_type: "5",
          product_id: response.result.hotels[x].product?.id,
          product_name: response.result.hotels[x].product?.name,
          product_image:
            response.result.hotels[x].product?.images.length > 0
              ? response.result.hotels[x].product?.images[0].image
              : "",
          car_id: response.result.hotels[x].room
            ? response.result.hotels[x].room.id
            : "",
          item_name: response.result.hotels[x].room
            ? response.result.hotels[x].room.name
            : "",
          car_list: response.result.hotels[x].product.rooms,
          cost_price: response.result.hotels[x].cost_price
            ? response.result.hotels[x].cost_price
            : response.result.hotels[x].selling_price,
          selling_price: response.result.hotels[x].selling_price,
          quantity: response.result.hotels[x].quantity,

          day: response.result.hotels[x].day,
          total_amount:
            response.result.hotels[x].selling_price *
            response.result.hotels[x].quantity,
        };
        formData.value.items.push(itemData);
      }
    }
    if (response.result.airline_tickets.length != 0) {
      for (const x in response.result.airline_tickets) {
        const itemData = {
          product_type: "6",
          product_id: response.result.airline_tickets[x].product?.id,
          product_name: response.result.airline_tickets[x].product?.name,

          car_id: response.result.airline_tickets[x].ticket
            ? response.result.airline_tickets[x].ticket.id
            : "",
          item_name: response.result.airline_tickets[x].ticket.price,
          car_list: response.result.airline_tickets[x].product
            ? response.result.airline_tickets[x].product.tickets
            : "",
          cost_price: response.result.airline_tickets[x].cost_price
            ? response.result.airline_tickets[x].cost_price
            : response.result.airline_tickets[x].selling_price,
          selling_price: response.result.airline_tickets[x].selling_price,
          quantity: response.result.airline_tickets[x].quantity,
          day: response.result.airline_tickets[x].day,
          total_amount:
            response.result.airline_tickets[x].selling_price *
            response.result.airline_tickets[x].quantity,
        };
        formData.value.items.push(itemData);
      }
    }

    if (response.result.private_van_tours.length != 0) {
      for (const x in response.result.private_van_tours) {
        const itemData = {
          product_type: "1",
          product_name: response.result.private_van_tours[x].product.name,
          product_image: response.result.private_van_tours[x].product
            .cover_image
            ? response.result.private_van_tours[x].product.cover_image
            : "",
          product_id: response.result.private_van_tours[x].product.id,
          car_id: response.result.private_van_tours[x].car
            ? response.result.private_van_tours[x].car.id
            : "",
          item_name: response.result.private_van_tours[x].car
            ? response.result.private_van_tours[x].car.name
            : "",
          car_list: response.result.private_van_tours[x].product
            ? response.result.private_van_tours[x].product.cars
            : "",
          cost_price: response.result.private_van_tours[x].cost_price
            ? response.result.private_van_tours[x].cost_price
            : response.result.private_van_tours[x].selling_price,
          selling_price: response.result.private_van_tours[x].selling_price,
          quantity: response.result.private_van_tours[x].quantity,
          day: response.result.private_van_tours[x].day,
          total_amount:
            response.result.private_van_tours[x].selling_price *
            response.result.private_van_tours[x].quantity,
        };
        formData.value.items.push(itemData);
      }
    }

    console.log(formData.value.items, "this is push");
    formData.value.items.sort((a, b) => a.day - b.day);
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  await getDetail();
});
</script>

<template>
  <Layout>
    <!-- header part -->
    <div
      class="flex justify-start py-3 overflow-x-scroll overflow-y-hidden no-sidebar bg-white border-b border-gray-200 px-8 gap-x-2 items-center"
    >
      <div
        class="flex justify-start items-center gap-2 cursor-pointer"
        :class="session == 1 ? '' : 'opacity-40'"
        @click="session = 1"
      >
        <CheckCircleIcon
          class="text-green-500 w-6 h-6"
          v-if="finish.session1"
        />
        <div
          v-if="!finish.session1"
          class="w-5 h-5 border border-red-300 rounded-full flex justify-center items-center"
        >
          <p class="pb-9 text-red-500 text-6xl">.</p>
        </div>
        <p class="text-sm whitespace-nowrap">General details</p>
        <p class="px-4 text-gray-400 whitespace-nowrap">-----</p>
      </div>
      <div
        class="flex justify-start items-center gap-2 cursor-pointer"
        :class="session == 2 ? '' : 'opacity-40'"
        @click="session = 2"
      >
        <CheckCircleIcon
          class="text-green-500 w-6 h-6"
          v-if="finish.session2"
        />
        <div
          v-if="!finish.session2"
          class="w-5 h-5 border border-red-300 rounded-full flex justify-center items-center"
        >
          <p class="pb-9 text-red-500 text-6xl">.</p>
        </div>
        <p class="text-sm whitespace-nowrap">Item details</p>
        <p class="px-4 text-gray-400 whitespace-nowrap">-----</p>
      </div>
      <div
        class="flex justify-start items-center gap-2 cursor-pointer"
        :class="session == 3 ? '' : 'opacity-40'"
        @click="session = 3"
      >
        <CheckCircleIcon
          class="text-green-500 w-6 h-6"
          v-if="finish.session3"
        />
        <div
          v-if="!finish.session3"
          class="w-5 h-5 border border-red-300 rounded-full flex justify-center items-center"
        >
          <p class="pb-9 text-red-500 text-6xl">.</p>
        </div>
        <p class="text-sm whitespace-nowrap">Other details</p>
        <p class="px-4 text-gray-400 whitespace-nowrap">-----</p>
      </div>
      <div
        class="flex justify-start items-center gap-2 cursor-pointer"
        :class="session == 4 ? '' : 'opacity-40'"
        @click="session = 4"
      >
        <CheckCircleIcon
          class="text-green-500 w-6 h-6"
          v-if="finish.session4"
        />
        <div
          v-if="!finish.session4"
          class="w-5 h-5 border border-red-300 rounded-full flex justify-center items-center"
        >
          <p class="pb-9 text-red-500 text-6xl">.</p>
        </div>
        <p class="text-sm whitespace-nowrap">Content details</p>
        <p class="px-4 text-gray-400 whitespace-nowrap">-----</p>
      </div>
      <div
        class="flex justify-start items-center gap-2 cursor-pointer"
        :class="session == 5 ? '' : 'opacity-40'"
        @click="session = 5"
      >
        <CheckCircleIcon
          class="text-green-500 w-6 h-6"
          v-if="finish.session5"
        />
        <div
          v-if="!finish.session5"
          class="w-5 h-5 border border-red-300 rounded-full flex justify-center items-center"
        >
          <p class="pb-9 text-red-500 text-6xl">.</p>
        </div>
        <p class="text-sm whitespace-nowrap">Design details</p>
        <p class="px-4 text-gray-400 whitespace-nowrap">-----</p>
      </div>
      <div
        class="flex justify-start items-center gap-2 cursor-pointer"
        :class="session == 6 ? '' : 'opacity-40'"
        @click="session = 6"
      >
        <CheckCircleIcon
          class="text-green-500 w-6 h-6"
          v-if="finish.session6"
        />
        <div
          v-if="!finish.session6"
          class="w-5 h-5 border border-red-300 rounded-full flex justify-center items-center"
        >
          <p class="pb-9 text-red-500 text-6xl">.</p>
        </div>
        <p class="text-sm whitespace-nowrap">Other Materials</p>
      </div>
    </div>

    <!-- body part -->
    <div class="px-8 py-6 bg-white" v-if="session == 1">
      <div class="flex justify-between items-center">
        <p class="text-base">General Details</p>
        <div class="flex gap-x-2 justify-end items-center">
          <p
            @click="onSubmitHandler"
            class="bg-green-500 text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Save
          </p>
          <p
            @click="session = 2"
            class="bg-[#FF613C] text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Next
          </p>
        </div>
      </div>
      <div>
        <GeneralDetailVue :formData="formData" />
      </div>
    </div>
    <div class="px-8 py-6 bg-white" v-if="session == 2">
      <div class="flex justify-between items-center">
        <p class="text-base pb-4">Item details</p>
        <div class="flex gap-x-2 justify-end items-center">
          <p
            @click="session = 1"
            class="bg-gray-500 text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Back
          </p>
          <p
            @click="onSubmitHandler"
            class="bg-green-500 text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Save
          </p>
          <p
            @click="session = 3"
            class="bg-[#FF613C] text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Next
          </p>
        </div>
      </div>
      <div>
        <ItemDetail :formData="formData" />
      </div>
    </div>
    <div class="px-8 py-6 bg-white" v-if="session == 3">
      <div class="flex justify-between items-center">
        <p class="text-base">Other Details</p>
        <div class="flex gap-x-2 justify-end items-center">
          <p
            @click="session = 2"
            class="bg-gray-500 text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Back
          </p>
          <p
            @click="onSubmitHandler"
            class="bg-green-500 text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Save
          </p>
          <p
            @click="session = 4"
            class="bg-[#FF613C] text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Next
          </p>
        </div>
      </div>
      <div>
        <OtherDetail :formData="formData" />
      </div>
    </div>
    <div class="px-8 py-6 bg-white" v-if="session == 4">
      <div class="flex justify-between items-center">
        <p class="text-base">Content Details</p>
        <div class="flex gap-x-2 justify-end items-center">
          <p
            @click="session = 3"
            class="bg-gray-500 text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Back
          </p>
          <p
            @click="onSubmitHandler"
            class="bg-green-500 text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Save
          </p>
          <p
            @click="session = 5"
            class="bg-[#FF613C] text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Next
          </p>
        </div>
      </div>
      <div>
        <ContentDetail :formData="formData" />
      </div>
    </div>
    <div class="px-8 py-6 bg-white" v-if="session == 5">
      <div class="flex justify-between items-center">
        <p class="text-base">Design Details</p>
        <div class="flex gap-x-2 justify-end items-center">
          <p
            @click="session = 4"
            class="bg-gray-500 text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Back
          </p>
          <p
            @click="onSubmitHandler"
            class="bg-green-500 text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Save
          </p>
          <p
            @click="session = 6"
            class="bg-[#FF613C] text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Next
          </p>
        </div>
      </div>
      <div>
        <DesignDetail :formData="formData" :editData="editData" />
      </div>
    </div>
    <div class="px-8 py-6 bg-white" v-if="session == 6">
      <div class="flex justify-between items-center">
        <p class="text-base">Other Materials</p>
        <div class="flex gap-x-2 justify-end items-center">
          <p
            @click="session = 5"
            class="bg-gray-500 text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Back
          </p>
          <p
            @click="onSubmitHandler"
            class="bg-[#FF613C] text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Update
          </p>
        </div>
      </div>
      <div>
        <OtherMaterial :formData="formData" :editImage="editData" />
      </div>
    </div>
  </Layout>
</template>
