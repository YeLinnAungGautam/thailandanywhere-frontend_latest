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
import { useCityStore } from "../stores/city";
import { useProductStore } from "../stores/product";
import { useDestinationStore } from "../stores/destination";
import { useCarStore } from "../stores/car";
import { useVantourStore } from "../stores/vantour";
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

const { cities } = storeToRefs(cityStore);
const { tags } = storeToRefs(productStore);
const { dests } = storeToRefs(destinationStore);
const { cars } = storeToRefs(carStore);

const typeList = ref([
  { id: 1, name: "Van Tour", value: "van_tour" },
  { id: 2, name: "Car Rental", value: "car_rental" },
]);

const formData = ref({
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
});

const formPrice = ref({
  car: "",
  price: "",
  agent_price: "",
});
const addNewPrice = () => {
  formData.value.prices.push(formPrice.value);
  console.log(formData.value.prices);
  formPrice.value = {
    car: "",
    price: "",
    agent_price: "",
  };
};

const removeFromPrice = (index) => {
  formData.value.prices.splice(index, 1);
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
  frmData.append("ticket_price", formData.value.ticket_price);
  frmData.append("type", formData.value.type);
  frmData.append("long_description", formData.value.long_description);
  frmData.append("full_description_en", formData.value.full_description_en);
  frmData.append("description", formData.value.description);
  if (formData.value.images.length > 0) {
    for (let i = 0; i < formData.value.images.length; i++) {
      let file = formData.value.images[i];
      frmData.append("images[" + i + "]", file);
    }
  }
  frmData.append("cover_image", formData.value.cover_image);
  for (var x = 0; x < formData.value.city_id.length; x++) {
    frmData.append("city_ids[" + x + "]", formData.value.city_id[x]);
  }
  console.log(formData.value.city_id, "cityId");
  for (var x = 0; x < formData.value.tag.length; x++) {
    frmData.append("tag_ids[" + x + "]", formData.value.tag[x]);
  }
  for (var x = 0; x < formData.value.destination.length; x++) {
    frmData.append("destination_ids[" + x + "]", formData.value.destination[x]);
  }
  for (var x = 0; x < formData.value.prices.length; x++) {
    frmData.append("car_ids[" + x + "]" + [x], formData.value.prices[x].car);
  }
  for (var x = 0; x < formData.value.prices.length; x++) {
    frmData.append("prices[" + x + "]" + [x], formData.value.prices[x].price);
  }
  for (var x = 0; x < formData.value.prices.length; x++) {
    frmData.append(
      "agent_prices[" + x + "]" + [x],
      formData.value.prices[x].agent_price
    );
  }
  try {
    const response = await vantourStore.addNewAction(frmData);
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
const citylist = ref([]);
const taglist = ref([]);
const destlist = ref([]);
const carList = ref([]);

// const limit = ref(10);
// const onOpen = async () => {
//   console.log(cities.value);
//   if (cities.value.meta.total == citylist.value.length) {
//     console.log("this is limit");
//   } else {
//     console.log("still loading");
//     limit.value = cities.value.meta.total;
//     await cityStore.getSimpleListAction({
//       limit: limit.value,
//     });
//     citylist.value = cities.value.data;
//     console.log(citylist.value);
//   }
// };

onMounted(async () => {
  await cityStore.getSimpleListAction();
  await productStore.getSimpleListTagAction();
  await carStore.getSimpleListAction();
  await destinationStore.getSimpleListAction();
  citylist.value = cities.value.data;

  taglist.value = tags.value.data;
  destlist.value = dests.value.data;
  console.log(cars.value, "this is dest");
  carList.value = cars.value.data;
  console.log(carList.value);
});
// @open="onOpen"
</script>

<template>
  <Layout>
    <div class="mb-5 flex items-center justify-between">
      <h3 class="text-2xl font-medium text-gray-600">Create VanTour</h3>
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
            <v-select
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
            <v-select
              v-model="formData.tag"
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
            <v-select
              v-model="formData.destination"
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
              type="number"
              id="title"
              placeholder="eg : 800"
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
                  <v-select
                    v-model="formPrice.car"
                    class="style-chooser"
                    :options="carList ?? []"
                    label="name"
                    :clearable="false"
                    :reduce="(car) => car.id"
                    placeholder="Choose car type"
                  ></v-select>
                </div>
                <div class="flex-1">
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
                  <button @click.prevent="addNewPrice" class="">
                    <i
                      class="fa-solid fa-plus text-sm font-semibold px-2 py-1 bg-blue-600 rounded-full shadow text-white"
                    ></i>
                  </button>
                </div>
              </div>
              <div
                v-for="(price, index) in formData.prices"
                :key="index"
                class="flex items-center justify-between gap-3 mb-3"
              >
                <div class="flex-1">
                  <v-select
                    v-if="carList"
                    label="name"
                    value="_id"
                    :reduce="(car) => car.id"
                    v-model="price.car"
                    :options="carList"
                    class="style-chooser"
                    placeholder="Choose cars"
                  ></v-select>
                </div>
                <div class="flex-1">
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
          <div class="">
            <p class="text-gray-800 text-sm mb-2">Summary (mm)</p>
            <!-- <textarea
              v-model="formData.long_description"
              rows="3"
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
              rows="3"
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
            <Button @click.prevent="onSubmitHandler"> Create </Button>
          </div>
        </div>
      </div>
      <div>
        <!-- <div class="bg-white/60 p-6 rounded-lg shadow-sm mb-5">
          <div class="flex items-center justify-start gap-3 mb-3">
            <p>Images</p>

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
                  class="fa-solid fa-plus text-lg font-semibold py-1 px-3 bg-[#ff613c] rounded-full shadow text-white"
                ></i
              ></span>
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
            <button
              v-if="!featureImagePreview"
              @click.prevent="openFileFeaturePicker"
              class="text-sm text-[#ff613c]"
            ></button>
            <button
              v-else
              @click.prevent="removeFeatureSelectImage"
              class="rounded-full text-sm text-red-600 items-center justify-center flex"
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
