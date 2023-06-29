<script setup>
import Layout from "./Layout.vue";
import { PlusIcon, ListBulletIcon } from "@heroicons/vue/24/outline";
import { onMounted, onUnmounted, ref } from "vue";
import Button from "../components/Button.vue";
import { QuillEditor } from "@vueup/vue-quill";
import { useToast } from "vue-toastification";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { usePostStore } from "../stores/post";
import { useRouter } from "vue-router";
const postStore = usePostStore();
const toast = useToast();
const router = useRouter();

const editorOptions = {
  placeholder: "Write an awesome blog post here ...",
};

const formData = ref({
  title: "",
  content: "",
});
const errors = ref(null);
const textEditor = ref(null);

const onSubmitHandler = async () => {
  const frmData = new FormData();
  frmData.append("title", formData.value.title);
  frmData.append("content", formData.value.content);
  try {
    const response = await postStore.addNewAction(frmData);
    formData.value = {
      title: "",
      content: "",
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

onMounted(() => {});
</script>

<template>
  <Layout>
    <div class="mb-5 flex items-center justify-between">
      <h3 class="text-2xl font-medium text-gray-600">Add New Post</h3>
      <div class="space-x-3"></div>
    </div>
    <div class="bg-white/60 p-6 rounded-lg shadow-sm mb-5">
      <form @submit.prevent="onSubmitHandler" class="space-y-4">
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
        <div class="text-end">
          <Button type="submit"> Publish Now </Button>
        </div>
      </form>
    </div>
  </Layout>
</template>
