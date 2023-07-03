<script setup>
import Layout from "./Layout.vue";
import { PlusIcon, ListBulletIcon } from "@heroicons/vue/24/outline";
import { onMounted, onUnmounted, ref } from "vue";
import Button from "../components/Button.vue";
import { QuillEditor } from "@vueup/vue-quill";
import { useToast } from "vue-toastification";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { usePostStore } from "../stores/post";
import { useRouter, useRoute } from "vue-router";
import { useCategoryStore } from "../stores/category";
import { useTagStore } from "../stores/tag";
import { storeToRefs } from "pinia";

const postStore = usePostStore();
const categoryStore = useCategoryStore();
const tagStore = useTagStore();

const toast = useToast();
const router = useRouter();
const route = useRoute();

const { categories } = storeToRefs(categoryStore);
const { tags } = storeToRefs(tagStore);

const editorOptions = {
  placeholder: "Write an awesome blog post here ...",
};

const formData = ref({
  slug: null,
  title: "",
  content: "",
  category_id: null,
  tags: [],
});
const errors = ref(null);
const textEditor = ref(null);

const onSubmitHandler = async () => {
  const frmData = new FormData();
  frmData.append("title", formData.value.title);
  frmData.append("category_id", formData.value.category_id);
  frmData.append("tags", formData.value.tags);
  frmData.append("content", formData.value.content);
  frmData.append("_method", "PUT");
  try {
    const response = await postStore.updateAction(frmData, formData.value.slug);
    formData.value = {
      title: "",
      content: "",
      id: null,
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

const getDetail = async () => {
  try {
    const response = await postStore.getDetailAction(route.params.slug);
    const { result } = response;
    formData.value.slug = result.slug;
    formData.value.title = result.title;
    formData.value.category_id = result.category.id;
    formData.value.tags = result.tags;
    // formData.value.content = result.content;
    textEditor.value.setHTML(result.content);
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  await getDetail();
  await categoryStore.getSimpleListAction();
  await tagStore.getSimpleListAction();
});
</script>

<template>
  <Layout>
    <div class="mb-5 flex items-center justify-between">
      <h3 class="text-2xl font-medium text-gray-600">Edit Post</h3>
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
            <Button @click.prevent="onSubmitHandler"> Update Post </Button>
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
