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
import { useEntranceStore } from "../stores/entrance";
import { useVariationStore } from "../stores/variations";

const toast = useToast();
const router = useRouter();
const route = useRoute();
const cityStore = useCityStore();
const productStore = useProductStore();
const variationsStore = useVariationStore();

const vantourStore = useEntranceStore();

const { cities } = storeToRefs(cityStore);
const { tags } = storeToRefs(productStore);
const { products } = storeToRefs(productStore);
const { variations } = storeToRefs(variationsStore);

const formData = ref({
  name: "",
  description: "",
  cover_image: "",
  provider: "",
  tag: [],
  city_id: [],
  images: [],
  category: [],
  variations: [],
  feature_image: "",
});
const editData = ref({
  tag: [],
  city_id: [],
  variations: [],
  category: [],
  cover_image: "",
  images: [],
});

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
  frmData.append("provider", formData.value.provider);
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
  for (var x = 0; x < formData.value.category.length; x++) {
    frmData.append("category_ids[" + x + "]", formData.value.category[x]);
  }
  for (var x = 0; x < formData.value.variations.length; x++) {
    frmData.append("variations[" + x + "]", formData.value.variations[x]);
  }

  try {
    const response = await vantourStore.updateAction(frmData, route.params.id);
    formData.value = {
      name: "",
      description: "",
      cover_image: "",
      provider: "",
      category: [],
      tag: [],
      city_id: [],
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

const updateEditTagData = () => {
  for (const key in editData.value.tag) {
    const tagid = editData.value.tag[key].id;
    formData.value.tag.push(tagid);
  }
  console.log(formData.value.tag, "this is tag");
};
const updateEditvariationsData = () => {
  for (const key in editData.value.variations) {
    const variationsid = editData.value.variations[key].id;
    formData.value.variations.push(variationsid);
  }
  console.log(formData.value.variations, "this is variations");
};
const updateEditCityData = () => {
  for (const key in editData.value.city_id) {
    const cityid = editData.value.city_id[key].id;
    formData.value.city_id.push(cityid);
  }
};
const updateEditCategoryData = () => {
  for (const key in editData.value.category) {
    const categoryId = editData.value.category[key].id;
    formData.value.category.push(categoryId);
  }
  console.log(formData.value.category, "form category");
};

const getDetail = async () => {
  try {
    const response = await vantourStore.getDetailAction(route.params.id);
    console.log(response, "this is response");
    console.log(response.result.tags, "tag");
    console.log(response.result.cities, "city");
    console.log(response.result.destinations, "description");

    formData.value.name = response.result.name;
    formData.value.description = response.result.description;

    editData.value.cover_image = response.result.cover_image;
    formData.value.provider = response.result.provider;
    editData.value.tag = response.result.tags;
    editData.value.city_id = response.result.cities;
    editData.value.category = response.result.categories;
    formData.value.images = response.result.images;
    editData.value.variations = response.result.variations;
    console.log(response.result.tags);
    console.log(editData.value.category, "edit category");

    updateEditTagData();
    updateEditCityData();
    updateEditvariationsData();
    updateEditCategoryData();
  } catch (error) {
    console.log(error);
  }
};

const citylist = ref([]);
const taglist = ref([]);
const categorylist = ref([]);
const variationslist = ref([]);
const pageaction = ref("");

onMounted(async () => {
  await getDetail();
  await cityStore.getSimpleListAction();
  await productStore.getSimpleListTagAction();
  await productStore.getSimpleListAction();
  await variationsStore.getSimpleListAction();
  citylist.value = cities.value.data;
  taglist.value = tags.value.data;
  categorylist.value = products.value.data;
  pageaction.value = route.params.action;
  variationslist.value = variations.value.data;
  // console.log(variations, "categorylist");
});
</script>

<template>
  <Layout>
    <div class="mb-5 flex items-center justify-between">
      <h3
        class="text-2xl font-medium text-gray-600"
        v-if="pageaction == 'view'"
      >
        View Entrance Ticket
      </h3>
      <h3
        class="text-2xl font-medium text-gray-600"
        v-if="pageaction == 'edit'"
      >
        Edit Entrance Ticket
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
            <p class="text-gray-800 text-sm mb-2">Categories</p>
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
              <div>
                <p class="text-gray-800 text-sm mb-2">Variations</p>
                <v-select
                  v-model="formData.variations"
                  class="style-chooser"
                  :options="variationslist ?? []"
                  label="name"
                  multiple
                  :clearable="false"
                  :reduce="(variations) => variations.id"
                  placeholder="Choose variations"
                ></v-select>
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
            <Button
              @click.prevent="onSubmitHandler"
              v-if="pageaction == 'edit'"
            >
              Update Vantour
            </Button>
          </div>
        </div>
      </div>
      <div>
        <div class="bg-white/60 p-6 rounded-lg shadow-sm mb-5">
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
            <!-- <button
              v-if="!featureImagePreview"
              @click.prevent="openFileFeaturePicker"
              class="text-sm text-blue-500"
            >
              + Upload
            </button> -->
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
