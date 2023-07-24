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
// import { useCategoryStore } from "../stores/category";

import { useEntranceStore } from "../stores/entrance";

const toast = useToast();
const router = useRouter();
const route = useRoute();
const cityStore = useCityStore();
const productStore = useProductStore();
// const categoryStore = useCategoryStore();

const entranceStore = useEntranceStore();

const { cities } = storeToRefs(cityStore);
const { tags } = storeToRefs(productStore);
const { products } = storeToRefs(productStore);

const formData = ref({
  name: "",
  description: "",
  cover_image: "",
  provider: "",
  tag: [],
  city_id: [],
  category: [],
  images: [],
  variations: [],
  feature_image: "",
});

const formPrice = ref({
  name: "",
  age_group: "",
  price: "",
});
const addNewPrice = () => {
  formData.value.variations.push(formPrice.value);
  console.log(formData.value.variations);
  formPrice.value = {
    name: "",
    age_group: "",
    price: "",
  };
};

const removeFromPrice = (index) => {
  formData.value.variations.splice(index, 1);
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
  // console.log(formData.value.tag, "tag");
  // console.log(formData.value.city_id, "city");
  // console.log(formData.value.destination, "description");

  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("provider", formData.value.provider);
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
  for (var x = 0; x < formData.value.category.length; x++) {
    frmData.append("category_ids[" + x + "]", formData.value.category[x]);
  }
  for (var x = 0; x < formData.value.variations.length; x++) {
    frmData.append(
      "variations[" + x + "][name]",
      formData.value.variations[x].name
    );
  }
  for (var x = 0; x < formData.value.variations.length; x++) {
    frmData.append(
      "variations[" + x + "][age_group]",
      formData.value.variations[x].age_group
    );
  }
  for (var x = 0; x < formData.value.variations.length; x++) {
    frmData.append(
      "variations[" + x + "][price]",
      formData.value.variations[x].price
    );
  }
  try {
    const response = await entranceStore.addNewAction(frmData);
    formData.value = {
      name: "",
      description: "",
      cover_image: "",
      provider: "",
      tag: [],
      city_id: [],
      category: [],
      images: [],
      variations: [],
      feature_image: "",
    };
    errors.value = null;
    toast.success(response.message);
    router.push("/products/2");
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
const categorylist = ref([]);

onMounted(async () => {
  await cityStore.getSimpleListAction();
  await productStore.getSimpleListTagAction();

  await productStore.getSimpleListAction();
  citylist.value = cities.value.data;

  taglist.value = tags.value.data;
  categorylist.value = products.value.data;
});
</script>

<template>
  <Layout>
    <div class="mb-5 flex items-center justify-between">
      <h3 class="text-2xl font-medium text-gray-600">Create Entrance Ticket</h3>
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
              <p class="text-gray-800 text-sm mb-2">Provider</p>
              <input
                v-model="formData.provider"
                type="text"
                id="title"
                class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.provider" class="mt-1 text-sm text-red-600">
                {{ errors.provider[0] }}
              </p>
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
            <p class="text-gray-800 text-sm mb-2">Category</p>
            <v-select
              v-model="formData.category"
              class="style-chooser"
              :options="categorylist ?? []"
              label="name"
              multiple
              :clearable="false"
              :reduce="(category) => category.id"
              placeholder="Choose category"
            ></v-select>
          </div>
          <div class="col-span-2">
            <div class="col-span-2">
              <div class="flex items-center justify-start mb-2">
                <label class="text-sm block text-gray-600 mr-3" for="">
                  Variations</label
                >
              </div>
              <div class="flex items-center justify-between gap-3 mb-3">
                <div class="flex-1">
                  <input
                    v-model="formPrice.name"
                    type="text"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="enter name"
                  />
                </div>
                <div class="flex-1">
                  <input
                    v-model="formPrice.age_group"
                    type="text"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="enter age group"
                  />
                </div>
                <div class="flex-1">
                  <input
                    v-model="formPrice.price"
                    type="text"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="enter price"
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
                v-for="(price, index) in formData.variations"
                :key="index"
                class="flex items-center justify-between gap-3 mb-3"
              >
                <div class="flex-1">
                  <input
                    v-model="price.name"
                    type="text"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="enter name"
                  />
                </div>
                <div class="flex-1">
                  <input
                    v-model="price.age_group"
                    type="text"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="enter age group"
                  />
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

          <div class="text-end">
            <Button @click.prevent="onSubmitHandler"> Create </Button>
          </div>
        </div>
      </div>
      <div>
        <div class="bg-white/60 p-6 rounded-lg shadow-sm mb-5">
          <div class="flex items-center justify-start gap-3 mb-3">
            <p>Images</p>
            <!-- <button
              @click.prevent="openFileImagePicker"
              class="text-sm text-blue-500"
            >
              + Upload
            </button> -->

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
                  class="fa-solid fa-plus text-lg font-semibold py-1 px-3 bg-blue-500 rounded-full shadow text-white"
                ></i
              ></span>
            </div>
            <div
              class="cursor-pointer w-full h-[130px] border-2 border-dashed border-gray-400 rounded flex justify-center items-center"
            >
              <span class="text-xs"
                ><i
                  class="fa-solid fa-plus text-lg font-semibold py-1 px-3 bg-blue-500 rounded-full shadow text-white"
                ></i
              ></span>
            </div>
            <div
              class="cursor-pointer w-full h-[130px] border-2 border-dashed border-gray-400 rounded flex justify-center items-center"
            >
              <span class="text-xs"
                ><i
                  class="fa-solid fa-plus text-lg font-semibold py-1 px-3 bg-blue-500 rounded-full shadow text-white"
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
              v-if="!featureImagePreview"
              @click.prevent="openFileFeaturePicker"
              class="text-sm text-blue-500"
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
                class="fa-solid fa-plus text-lg font-semibold py-3 px-5 bg-blue-500 rounded-full shadow text-white"
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
