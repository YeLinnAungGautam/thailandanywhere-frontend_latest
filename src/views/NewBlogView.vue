<script setup>
import Layout from "./Layout.vue";
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { onMounted, onUnmounted, ref } from "vue";
import Button from "../components/Button.vue";
import { QuillEditor } from "@vueup/vue-quill";
import { useToast } from "vue-toastification";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

import { usePostStore } from "../stores/post";
import { useCategoryStore } from "../stores/category";
import { useTagStore } from "../stores/tag";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

const postStore = usePostStore();
const categoryStore = useCategoryStore();
const tagStore = useTagStore();

const toast = useToast();
const router = useRouter();

const editorOptions = {
  placeholder: "Write an awesome blog post here ...",
};

const formData = ref({
  title: "",
  content: null,
  category_id: null,
  tags: [],
  feature_image: null,
  images: [],
});

const errors = ref(null);
const textEditor = ref(null);
const { categories } = storeToRefs(categoryStore);
const { tags } = storeToRefs(tagStore);

const featureImageInput = ref(null);
const featureImagePreview = ref(null);

const openFileFeaturePicker = () => {
  featureImageInput.value.click();
};

const handlerFeatureFileChange = (e) => {
  let selectedFile = e.target.files[0];
  if (selectedFile) {
    formData.value.feature_image = e.target.files[0];
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
  frmData.append("title", formData.value.title);
  frmData.append("category_id", formData.value.category_id);
  frmData.append("tags", formData.value.tags);

  if (formData.value.images.length > 0) {
    for (let i = 0; i < formData.value.images.length; i++) {
      let file = formData.value.images[i];
      frmData.append("images[" + i + "]", file);
    }
  }

  frmData.append("feature_image", formData.value.feature_image);
  frmData.append("content", formData.value.content);
  try {
    const response = await postStore.addNewAction(frmData);
    formData.value = {
      title: "",
      content: null,
      category_id: null,
      tags: [],
    };
    errors.value = null;
    textEditor.value.setHTML("");
    toast.success(response.message);
    router.push("/blogs");
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

onMounted(async () => {
  await categoryStore.getSimpleListAction();
  await tagStore.getSimpleListAction();
});
</script>

<template>
  <Layout>
    <div class="mb-5 flex items-center justify-between">
      <h3 class="text-2xl font-medium text-gray-600">Add New Post</h3>
      <div class="space-x-3"></div>
    </div>
    <div class="grid grid-cols-3 gap-3">
      <div class="bg-white/60 col-span-2 p-6 rounded-lg shadow-sm mb-5">
        <div class="space-y-4">
          <div class="">
            <p class="text-gray-800 text-sm mb-2">Title</p>
            <input
              v-model="formData.title"
              type="text"
              id="title"
              class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-600"
            />
            <p v-if="errors?.name" class="mt-1 text-sm text-red-600">
              {{ errors.name[0] }}
            </p>
          </div>

          <div>
            <p class="text-gray-800 text-sm mb-2">Category</p>
            <v-select
              v-model="formData.category_id"
              class="style-chooser"
              :options="categories ?? []"
              label="name"
              :clearable="false"
              :reduce="(category) => category.id"
              placeholder="Choose category"
            ></v-select>
          </div>
          <div>
            <p class="text-gray-800 text-sm mb-2">Tags</p>
            <v-select
              v-model="formData.tags"
              class="style-chooser"
              multiple
              :options="tags ?? []"
              taggable
              placeholder="Choose Tags"
            ></v-select>
          </div>
          <div class="">
            <p for="name" class="text-gray-800 text-sm mb-2">Blog Content</p>
            <QuillEditor
              ref="textEditor"
              :options="editorOptions"
              theme="snow"
              class="!bg-white/50 !border-1 !border-gray-300 !rounded-bl-md !rounded-br-md !shadow-sm !text-base !text-gray-900 !h-96"
              toolbar="essential"
              contentType="html"
              v-model:content="formData.content"
            />
          </div>
        </div>
      </div>
      <div>
        <div class="bg-white/60 p-6 rounded-lg shadow-sm mb-5">
          <div class="flex items-center justify-start gap-3 mb-3">
            <p>Publish</p>
          </div>
          <div class="">
            <Button @click.prevent="onSubmitHandler"> Publish Now </Button>
          </div>
        </div>
        <div class="bg-white/60 p-6 rounded-lg shadow-sm mb-5">
          <div class="flex items-center justify-start gap-3 mb-3">
            <p>Images</p>
            <button
              @click.prevent="openFileImagePicker"
              class="text-sm text-blue-500"
            >
              + Upload
            </button>
            <input
              multiple
              type="file"
              ref="imagesInput"
              class="hidden"
              @change="handlerImagesFileChange"
              accept="image/*"
            />
          </div>
          <div class="grid grid-cols-3 gap-2">
            <div
              class="relative"
              v-for="(image, index) in imagesPreview"
              :key="index"
            >
              <button
                @click.prevent="removeImageSelectImage(index)"
                class="rounded-full text-sm text-red-500 items-center justify-center flex absolute top-2 right-2"
              >
                <XCircleIcon class="w-6 h-6 font-semibold" />
              </button>
              <img class="h-32 w-full rounded" :src="image" alt="" />
            </div>
          </div>
        </div>
        <div class="bg-white/60 p-6 rounded-lg shadow-sm mb-5">
          <div class="flex items-center justify-start gap-3 mb-3">
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
            >
              + Upload
            </button>
            <button
              v-else
              @click.prevent="removeFeatureSelectImage"
              class="text-sm text-red-500"
            >
              Remove
            </button>
          </div>

          <div v-if="featureImagePreview" class="">
            <img
              class="h-32 w-full rounded"
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
