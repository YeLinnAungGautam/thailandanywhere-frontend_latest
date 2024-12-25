<script setup>
import Layout from "./Layout.vue";
import { ref, watch } from "vue";
import { CheckCircleIcon } from "@heroicons/vue/24/solid";
import GeneralDetailVue from "./InclusiveComponent/GeneralDetail.vue";
import ItemDetail from "./InclusiveComponent/ItemDetail.vue";
import ContentDetail from "./InclusiveComponent/ContentDetail.vue";
import OtherMaterial from "./InclusiveComponent/OtherMaterial.vue";
import { useToast } from "vue-toastification";
import { useInclusiveStore } from "../stores/inclusion";
import { useRouter } from "vue-router";

const inclusiveStore = useInclusiveStore();
const toast = useToast();
const router = useRouter();
const session = ref(1);
const finish = ref({
  session1: false,
  session2: false,
  session3: false,
  session4: false,
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
  price: "",
  items: [],
  agent_price: "",
  feature_image: "",
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
  if (formData.value.cover_image) {
    finish.value.session4 = true;
  }
});

const errors = ref(null);

const onSubmitHandler = async () => {
  console.log("====================================");
  console.log(formData.value, "this is formData");
  console.log("====================================");
  const frmData = new FormData();
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
    const response = await inclusiveStore.addNewAction(frmData);
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
      response.result.id
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
    router.push("/products/10");
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
</script>

<template>
  <Layout>
    <!-- header part -->
    <div
      class="flex justify-start py-3 bg-white border-b border-gray-200 px-8 gap-x-2 items-center"
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
        <p class="text-sm">General details</p>
        <p class="px-4 text-gray-400">-----</p>
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
        <p class="text-sm">Item details</p>
        <p class="px-4 text-gray-400">-----</p>
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
        <p class="text-sm">Content details</p>
        <p class="px-4 text-gray-400">-----</p>
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
        <p class="text-sm">Other Materials</p>
      </div>
    </div>

    <!-- body part -->
    <div class="px-8 py-6 bg-white" v-if="session == 1">
      <div class="flex justify-between items-center">
        <p class="text-base">General Details</p>
        <div class="flex gap-x-2 justify-end items-center">
          <!-- <p
            @click="saveSession1()"
            class="bg-green-500 text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Save
          </p> -->
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
          <!-- <p
            @click="finish.session2 = true"
            class="bg-green-500 text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Save
          </p> -->
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
        <p class="text-base">Content Details</p>
        <div class="flex gap-x-2 justify-end items-center">
          <p
            @click="session = 2"
            class="bg-gray-500 text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Back
          </p>
          <!-- <p
            @click="finish.session3 = true"
            class="bg-green-500 text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Save
          </p> -->
          <p
            @click="session = 4"
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
    <div class="px-8 py-6 bg-white" v-if="session == 4">
      <div class="flex justify-between items-center">
        <p class="text-base">Other Materials</p>
        <div class="flex gap-x-2 justify-end items-center">
          <p
            @click="session = 3"
            class="bg-gray-500 text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Back
          </p>
          <!-- <p
            @click="finish.session4 = true"
            class="bg-green-500 text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Save
          </p> -->
          <p
            @click="onSubmitHandler"
            class="bg-[#FF613C] text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Create
          </p>
        </div>
      </div>
      <div>
        <OtherMaterial :formData="formData" />
      </div>
    </div>
  </Layout>
</template>
