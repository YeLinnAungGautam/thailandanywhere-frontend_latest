<script setup>
import Layout from "./Layout.vue";
import { XCircleIcon } from "@heroicons/vue/24/outline";
import {
  PlusIcon,
  ListBulletIcon,
  ArrowDownTrayIcon,
} from "@heroicons/vue/24/outline";
import { onMounted, onUnmounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

import { useToast } from "vue-toastification";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useCityStore } from "../stores/city";
import { useProductStore } from "../stores/product";
import { useDestinationStore } from "../stores/destination";
import { useCarStore } from "../stores/car";
import { useVantourStore } from "../stores/vantour";
import { useAuthStore } from "../stores/auth";
import { QuillEditor } from "@vueup/vue-quill";

const editorOptions = {
  placeholder: "Description with editor ...",
};

const toast = useToast();
const router = useRouter();
const route = useRoute();
const cityStore = useCityStore();
const productStore = useProductStore();
const destinationStore = useDestinationStore();
const carStore = useCarStore();
const vantourStore = useVantourStore();
const authStore = useAuthStore();

const { cities } = storeToRefs(cityStore);
const { tags } = storeToRefs(productStore);
const { dests } = storeToRefs(destinationStore);
const { cars } = storeToRefs(carStore);

const typeList = ref([
  { id: 1, name: "Van Tour", value: "van_tour" },
  { id: 2, name: "Car Rental", value: "car_rental" },
]);

const formData = ref({
  id: "",
  name: "",
  description: "",
  long_description: "",
  full_description_en: "",
  cover_image: "",
  sku_code: "",
  ticket_price: "",
  type: "car_rental",
  tag: [],
  city_id: [],
  destination: [],
  images: [],

  feature_image: "",
});
const editData = ref({
  tag: [],
  city_id: [],
  destination: [],
  prices: [],
  cover_image: "",
  images: [],
});

const formPrice = ref({
  car: "",
  name: "",
  price: "",
  agent_price: "",
});
const addNewPrice = () => {
  editData.value.prices.push(formPrice.value);
  console.log(editData.value.prices, "prices");
  formPrice.value = {
    car: "",
    name: "",
    price: "",
    agent_price: "",
  };
};

const removeFromPrice = (index) => {
  editData.value.prices.splice(index, 1);
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

const removeFeatureSelectImage = async () => {
  formData.value.feature_image = null;
  featureImagePreview.value = null;
  const res = await vantourStore.deleteCoverImageAction(formData.value.id);
  console.log(res, "delete cover image");
  toast.success(res.message);
  getDetail();
  // editData.value.cover_image = null;
};

const removeFeatureSelectPreviewImage = () => {
  formData.value.feature_image = null;
  editData.value.cover_image = null;
  featureImagePreview.value = null;
  // editData.value.cover_image = null;
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
      editData.value.images.push(selectedFile[index]);
      imagesPreview.value.push(URL.createObjectURL(selectedFile[index]));
    }
  }
};

const removeImageSelectImage = (index) => {
  editData.value.images.splice(index, 1);
  imagesPreview.value.splice(index, 1);
};

const onSubmitHandler = async () => {
  const frmData = new FormData();
  frmData.append("_method", "PUT");
  frmData.append("name", formData.value.name);
  frmData.append("sku_code", formData.value.sku_code);
  frmData.append("ticket_price", formData.value.ticket_price);
  frmData.append("type", formData.value.type);
  frmData.append("long_description", formData.value.long_description);
  frmData.append("full_description_en", formData.value.full_description_en);
  frmData.append("description", formData.value.description);

  if (editData.value.images.length > 0) {
    for (let i = 0; i < editData.value.images.length; i++) {
      let file = editData.value.images[i];
      frmData.append("images[" + i + "]", file);
    }
  }
  if (formData.value.cover_image) {
    frmData.append("cover_image", formData.value.cover_image);
  }
  for (var x = 0; x < formData.value.city_id.length; x++) {
    frmData.append("city_ids[" + x + "]", formData.value.city_id[x]);
  }
  for (var x = 0; x < formData.value.tag.length; x++) {
    frmData.append("tag_ids[" + x + "]", formData.value.tag[x]);
  }
  for (var x = 0; x < formData.value.destination.length; x++) {
    frmData.append("destination_ids[" + x + "]", formData.value.destination[x]);
  }
  for (var x = 0; x < editData.value.prices.length; x++) {
    frmData.append("car_ids[" + x + "]" + [x], editData.value.prices[x].car);
  }
  for (var x = 0; x < editData.value.prices.length; x++) {
    frmData.append("prices[" + x + "]" + [x], editData.value.prices[x].price);
  }
  for (var x = 0; x < editData.value.prices.length; x++) {
    frmData.append(
      "agent_prices[" + x + "]" + [x],
      editData.value.prices[x].agent_price
    );
  }
  try {
    const response = await vantourStore.updateAction(frmData, route.params.id);
    formData.value = {
      name: "",
      description: "",
      long_description: "",
      full_description_en: "",
      cover_image: "",
      sku_code: "",
      ticket_price: "",
      type: "car_rental",
      tag: [],
      city_id: [],
      destination: [],
      images: [],
      prices: [],
      feature_image: "",
    };
    errors.value = null;
    toast.success(response.message);
    // router.push("/products/0");
    router.back();
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

const updateEditTagData = () => {
  for (const key in editData.value.tag) {
    const tagid = editData.value.tag[key].id;
    formData.value.tag.push(tagid);
  }
  console.log(formData.value.tag, "this is tag");
};
const updateEditCityData = () => {
  for (const key in editData.value.city_id) {
    const cityid = editData.value.city_id[key].id;
    formData.value.city_id.push(cityid);
  }
  console.log(formData.value.tag, "this is city");
};
const updateEditDesData = () => {
  for (const key in editData.value.destination) {
    const destinationid = editData.value.destination[key].id;
    formData.value.destination.push(destinationid);
  }
  console.log(formData.value.destination, "this is destination");
};

const city_list_array = ref(null);
const tag_list_array = ref(null);
const dest_list_array = ref(null);

const getDetail = async () => {
  try {
    const response = await vantourStore.getDetailAction(route.params.id);
    console.log(response, "tag");
    formData.value.id = response.result.id;
    formData.value.name = response.result.name;
    formData.value.description = response.result.description;
    formData.value.long_description = response.result.long_description;
    formData.value.full_description_en = response.result.full_description_en;
    editData.value.cover_image = response.result.cover_image;
    formData.value.sku_code = response.result.sku_code;
    formData.value.ticket_price = response.result.ticket_price;
    formData.value.type = response.result.type;
    editData.value.tag = response.result.tags;
    editData.value.city_id = response.result.cities;
    editData.value.destination = response.result.destinations;
    formData.value.images = response.result.images;
    city_list_array.value = response.result.cities;
    tag_list_array.value = response.result.tags;
    dest_list_array.value = response.result.destinations;
    console.log(response.result.tags);
    // editData.value.prices = response.result.cars;
    for (const x in response.result.cars) {
      const item = {
        car: response.result.cars[x].id,
        name: response.result.cars[x].name,
        price: response.result.cars[x].price,
        agent_price: response.result.cars[x].agent_price,
      };
      editData.value.prices.push(item);
    }
    updateEditTagData();
    updateEditCityData();
    updateEditDesData();
    console.log(formData.value.tag, "tag");
    console.log(formData.value.city_id, "tag");
    console.log(formData.value.destination, "tag");
  } catch (error) {
    console.log(error);
  }
};

const citylist = ref([]);
const taglist = ref([]);
const destlist = ref([]);
const carList = ref([]);

const actionPage = ref("");

const cityAction = ref(false);
const productAction = ref(false);
const carAction = ref(false);
const destinationAction = ref(false);

watch(
  [cityAction, productAction, carAction, destinationAction],
  async ([cityValue, productValue, carValue, destinationValue]) => {
    if (cityValue == true) {
      await cityStore.getSimpleListAction();
      citylist.value = cities.value.data;
    }
    if (productValue == true) {
      await productStore.getSimpleListTagAction();
      taglist.value = tags?.value.data;
    }
    if (carValue == true) {
      await carStore.getSimpleListAction();
      carList.value = cars?.value.data;
    }
    if (destinationValue == true) {
      await destinationStore.getSimpleListAction();
      destlist.value = dests?.value.data;
    }
  }
);

onMounted(async () => {
  await getDetail();
});
</script>

<template>
  <Layout>
    <div class="mb-5 flex items-center justify-between">
      <h3
        class="text-2xl font-medium text-gray-600"
        v-if="actionPage == 'view'"
      >
        View VanTour
      </h3>
      <h3
        class="text-2xl font-medium text-gray-600"
        v-if="actionPage == 'edit'"
      >
        Edit VanTour
      </h3>

      <div class="space-x-3 text-sm">
        Note : Type - Car Rental for Sale Part & Type - VanTour for User Website
        Show Items
      </div>
    </div>
    <div class="grid grid-cols-3 gap-3">
      <div class="bg-white/60 col-span-2 p-6 rounded-lg shadow-sm mb-5">
        <div class="space-y-4">
          <div class="grid grid-cols-3 gap-8">
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
            <div>
              <p class="text-gray-800 text-sm mb-2">Type</p>
              <v-select
                v-model="formData.type"
                class="style-chooser"
                :options="typeList ?? []"
                label="name"
                :clearable="false"
                :reduce="(d) => d.value"
                placeholder="Choose Type"
              ></v-select>
            </div>
          </div>
          <div>
            <p class="text-gray-800 text-sm mb-2">Cities</p>
            <div
              v-if="citylist.length == 0 && !cityAction"
              @click="cityAction = true"
              class="text-sm text-gray-500 hover:text-gray-600 border border-gray-300 rounded-md bg-white px-4 py-1.5 w-full flex justify-between items-center"
            >
              <div class="flex justify-start items-center gap-2 flex-wrap">
                <p
                  v-for="i in city_list_array"
                  :key="i.id"
                  class="text-xs py-1 px-2 bg-gray-100 rounded-md whitespace-nowrap"
                >
                  {{ i.name }}
                </p>
              </div>
              <ArrowDownTrayIcon class="w-4 h-4" />
            </div>
            <v-select
              v-if="cityAction && citylist.length != 0"
              v-model="formData.city_id"
              class="style-chooser"
              :options="citylist ?? []"
              label="name"
              multiple
              :clearable="false"
              :reduce="(city) => city.id"
              placeholder="Choose City"
            ></v-select>
          </div>
          <div>
            <p class="text-gray-800 text-sm mb-2">Tags</p>
            <!-- <v-select
              v-model="formData.tag"
              class="style-chooser"
              :options="taglist ?? []"
              label="name"
              multiple
              :clearable="false"
              :reduce="(tag) => tag.id"
              placeholder="Choose Tag"
            ></v-select> -->
            <div
              v-if="taglist.length == 0 && !productAction"
              @click="productAction = true"
              class="text-sm text-gray-500 hover:text-gray-600 border border-gray-300 rounded-md bg-white px-4 py-1.5 w-full flex justify-between items-center"
            >
              <div class="flex justify-start items-center gap-2 flex-wrap">
                <p
                  v-for="i in tag_list_array"
                  :key="i.id"
                  class="text-xs py-1 px-2 bg-gray-100 rounded-md whitespace-nowrap"
                >
                  {{ i.name }}
                </p>
              </div>
              <ArrowDownTrayIcon class="w-4 h-4" />
            </div>
            <v-select
              v-model="formData.tag"
              v-if="taglist.length != 0 && productAction"
              class="style-chooser"
              :options="taglist ?? []"
              label="name"
              multiple
              :clearable="false"
              :reduce="(tag) => tag.id"
              placeholder="Choose Tag"
            ></v-select>
          </div>
          <div>
            <p class="text-gray-800 text-sm mb-2">Destination</p>
            <!-- <v-select
              v-model="formData.destination"
              class="style-chooser"
              :options="destlist ?? []"
              label="name"
              multiple
              :clearable="false"
              :reduce="(dest) => dest.id"
              placeholder="Choose Destination"
            ></v-select> -->
            <div
              v-if="destlist.length == 0 && !destinationAction"
              @click="destinationAction = true"
              class="text-sm text-gray-500 hover:text-gray-600 border border-gray-300 rounded-md bg-white px-4 py-1.5 w-full flex justify-between items-center"
            >
              <div class="flex justify-start items-center gap-2 flex-wrap">
                <p
                  v-for="i in dest_list_array"
                  :key="i.id"
                  class="text-xs py-1 px-2 bg-gray-100 rounded-md whitespace-nowrap"
                >
                  {{ i.name }}
                </p>
              </div>
              <ArrowDownTrayIcon class="w-4 h-4" />
            </div>
            <v-select
              v-model="formData.destination"
              v-if="destlist.length != 0 && destinationAction"
              class="style-chooser"
              :options="destlist ?? []"
              label="name"
              multiple
              :clearable="false"
              :reduce="(dest) => dest.id"
              placeholder="Choose Destination"
            ></v-select>
          </div>
          <div class="">
            <p class="text-gray-800 text-sm mb-2">Ticket Price</p>
            <input
              v-model="formData.ticket_price"
              type="text"
              id="title"
              class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.ticket_price" class="mt-1 text-sm text-red-600">
              {{ errors.ticket_price[0] }}
            </p>
          </div>
          <div class="col-span-2">
            <div class="col-span-2">
              <div class="flex items-center justify-start mb-2">
                <label class="text-sm block text-gray-600 mr-3" for="">
                  Prices</label
                >
              </div>

              <div class="flex items-center justify-between gap-3 mb-3">
                <div class="flex-1">
                  <!-- <v-select
                    v-model="formPrice.car"
                    class="style-chooser"
                    :options="carList ?? []"
                    label="name"
                    :clearable="false"
                    :reduce="(car) => car.id"
                    placeholder="Choose car type"
                  ></v-select> -->
                  <div
                    v-if="carList.length == 0 && !carAction"
                    @click="carAction = true"
                    class="text-sm text-gray-500 hover:text-gray-600 border border-gray-300 rounded-md bg-white px-4 py-1.5 w-full flex justify-between items-center"
                  >
                    <p>car choose</p>
                    <ArrowDownTrayIcon class="w-4 h-4" />
                  </div>
                  <v-select
                    v-if="carList.length != 0 || carAction"
                    v-model="formPrice.car"
                    class="style-chooser"
                    :options="carList ?? []"
                    label="name"
                    :clearable="false"
                    :reduce="(car) => car.id"
                    placeholder="Choose car type"
                  ></v-select>
                </div>
                <div class="flex-1" v-if="!authStore.isAgent">
                  <input
                    v-model="formPrice.price"
                    type="text"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="enter prices"
                  />
                </div>
                <div class="flex-1">
                  <input
                    v-model="formPrice.agent_price"
                    type="text"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="enter agent prices"
                  />
                </div>
                <div>
                  <div>
                    <button @click.prevent="addNewPrice" class="">
                      <i
                        class="fa-solid fa-plus text-sm font-semibold px-2 py-1 bg-blue-600 rounded-full shadow text-white"
                      ></i>
                    </button>
                  </div>
                </div>
              </div>
              <div
                v-for="(price, index) in editData.prices"
                :key="index"
                class="flex items-center justify-between gap-3 mb-3"
              >
                <div class="flex-1">
                  <p
                    v-if="price.name"
                    class="py-2 px-2 rounded-md border border-gray-300"
                  >
                    {{ price.name }}
                  </p>
                  <v-select
                    v-if="!price?.name"
                    v-model="price.car"
                    class="style-chooser"
                    :options="carList ?? []"
                    label="name"
                    :clearable="false"
                    :reduce="(car) => car.id"
                    placeholder="Choose car type"
                  ></v-select>
                </div>
                <div class="flex-1" v-if="!authStore.isAgent">
                  <input
                    v-model="price.price"
                    type="text"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="enter prices"
                  />
                </div>
                <div class="flex-1">
                  <input
                    v-model="price.agent_price"
                    type="text"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="enter agent prices"
                  />
                </div>
                <div>
                  <div>
                    <button
                      class="text-sm text-red-600"
                      @click.prevent="removeFromPrice(index)"
                    >
                      <i
                        class="fa-solid fa-minus text-sm font-semibold px-2 py-1 bg-red-500 rounded-full shadow text-white"
                      ></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="">
            <p class="text-gray-800 text-sm mb-2">Routes</p>
            <textarea
              v-model="formData.description"
              rows="3"
              id="title"
              class="w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
              placeholder="place , place , place "
            />
            <p v-if="errors?.description" class="mt-1 text-sm text-red-600">
              {{ errors.description[0] }}
            </p>
          </div>
          <!-- <div class="" v-if="actionPage == 'edit'">
            <p class="text-gray-800 text-sm mb-2">Summary</p>
            <textarea
              v-model="formData.long_description"
              rows="10"
              id="title"
              class="w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
            />
            <p
              v-if="errors?.long_description"
              class="mt-1 text-sm text-red-600"
            >
              {{ errors.long_description[0] }}
            </p>
          </div> -->
          <div class="">
            <p class="text-gray-800 text-sm mb-2">Summary (mm)</p>
            <!-- <textarea
              v-model="formData.long_description"
              rows="10"
              id="title"
              class="w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
            />
            <p
              v-if="errors?.long_description"
              class="mt-1 text-sm text-red-600"
            >
              {{ errors.long_description[0] }}
            </p> -->
            <QuillEditor
              ref="textEditor"
              :options="editorOptions"
              theme="snow"
              class="!bg-white/50 !border-1 !border-gray-300 !rounded-bl-md !rounded-br-md !shadow-sm !text-xs !text-gray-900 !h-[300px]"
              toolbar="essential"
              contentType="html"
              v-model:content="formData.long_description"
            />
          </div>
          <div class="">
            <p class="text-gray-800 text-sm mb-2">Summary (eng)</p>
            <!-- <textarea
              v-model="formData.full_description_en"
              rows="10"
              id="title"
              class="w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
            />
            <p
              v-if="errors?.full_description_en"
              class="mt-1 text-sm text-red-600"
            >
              {{ errors.full_description_en[0] }}
            </p> -->
            <QuillEditor
              ref="textEditor"
              :options="editorOptions"
              theme="snow"
              class="!bg-white/50 !border-1 !border-gray-300 !rounded-bl-md !rounded-br-md !shadow-sm !text-xs !text-gray-900 !h-[300px]"
              toolbar="essential"
              contentType="html"
              v-model:content="formData.full_description_en"
            />
          </div>
          <div class="text-end">
            <Button @click.prevent="onSubmitHandler"> Update Vantour </Button>
          </div>
        </div>
      </div>
      <div>
        <!-- <div class="bg-white/60 p-6 rounded-lg shadow-sm mb-5">
          <div class="flex items-center justify-between gap-3 mb-3">
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
          <div class="grid grid-cols-3 gap-2" v-if="imagesPreview.length != 0">
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
          </div>
          <div
            class="grid grid-cols-3 gap-2 mb-6 bg-white rounded-md shadow"
            v-if="imagesPreview.length == 0"
          >
            <div
              class="relative"
              v-for="(image, index) in formData.images"
              :key="index"
            >
              <img class="h-auto w-full rounded" :src="image.image" alt="" />
            </div>
          </div>
        </div> -->
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
            <!-- <button
              v-if="!featureImagePreview"
              @click.prevent="openFileFeaturePicker"
              class="text-sm text-blue-500"
            >
              + Upload
            </button> -->
            <button
              class="text-sm text-red-600"
              v-if="!featureImagePreview && !editData.cover_image"
              @click.prevent="openFileFeaturePicker"
            >
              <i
                class="fa-solid fa-plus text-sm font-semibold px-2 py-1 bg-green-500 rounded-full shadow text-white"
              ></i>
            </button>
            <button
              v-if="editData.cover_image"
              @click.prevent="removeFeatureSelectImage"
              class="text-sm text-red-500"
            >
              <i
                class="fa-solid fa-minus text-sm font-semibold px-2 py-1 bg-red-500 rounded-full shadow text-white"
              ></i>
            </button>
            <button
              v-if="featureImagePreview"
              @click.prevent="removeFeatureSelectPreviewImage"
              class="text-sm text-red-500"
            >
              <i
                class="fa-solid fa-minus text-sm font-semibold px-2 py-1 bg-red-500 rounded-full shadow text-white"
              ></i>
            </button>
          </div>

          <div v-if="featureImagePreview" class="">
            <img
              class="h-auto w-full rounded"
              :src="featureImagePreview"
              alt=""
            />
          </div>
          <div
            v-if="!featureImagePreview && !editData.cover_image"
            @click.prevent="openFileFeaturePicker"
            class="cursor-pointer w-full h-[200px] border-2 border-dashed border-gray-400 rounded flex justify-center items-center"
          >
            <span class="text-xs"
              ><i
                class="fa-solid fa-plus text-lg font-semibold py-3 px-5 bg-[#ff613c] rounded-full shadow text-white"
              ></i
            ></span>
          </div>
          <div
            v-if="!featureImagePreview && editData.cover_image"
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
