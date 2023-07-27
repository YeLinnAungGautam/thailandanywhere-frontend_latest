<script setup>
import Layout from "./Layout.vue";
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { PlusIcon, ListBulletIcon } from "@heroicons/vue/24/outline";
import { onMounted, onUnmounted, ref } from "vue";
import Button from "../components/Button.vue";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { Switch } from "@headlessui/vue";

import { useToast } from "vue-toastification";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useCustomerStore } from "../stores/customer";

const toast = useToast();
const router = useRouter();
const route = useRoute();

const enabled = ref(false);

const customerStore = useCustomerStore();

const formData = ref({
  name: "",
  photo: "",
  email: "",
  phone_number: "",
  dob: "",
  line_id: "",
  nrc_number: "",
  company_name: "",
  is_corporate_customer: "",
  cover_image: "",
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

const onSubmitHandler = async () => {
  const frmData = new FormData();
  frmData.append("_method", "PUT");
  frmData.append("name", formData.value.name);
  if (formData.value.cover_image) {
    frmData.append("photo", formData.value.cover_image);
  }
  frmData.append("email", formData.value.email);
  frmData.append("phone_number", formData.value.phone_number);
  frmData.append("dob", formData.value.dob);
  frmData.append("line_id", formData.value.line_id);
  frmData.append("nrc_number", formData.value.nrc_number);
  frmData.append("company_name", formData.value.company_name);
  // frmData.append("is_corporate_customer", formData.value.is_corporate_customer);
  if (enabled.value == true) {
    formData.value.is_corporate_customer = 1;
    frmData.append(
      "is_corporate_customer",
      formData.value.is_corporate_customer
    );
  } else {
    formData.value.is_corporate_customer = 0;
    frmData.append(
      "is_corporate_customer",
      formData.value.is_corporate_customer
    );
  }
  try {
    const response = await customerStore.updateAction(frmData, route.params.id);
    formData.value = {
      name: "",
      phone: "",
      email: "",
      phone_number: "",
      dob: "",
      line_id: "",
      nrc_number: "",
      company_name: "",
      is_corporate_customer: "",
    };
    enabled.value = false;
    errors.value = null;
    toast.success(response.message);
    router.push("/customers");
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
    const response = await customerStore.getDetailAction(route.params.id);
    console.log(response.result, "data");
    formData.value.name = response.result.name;
    formData.value.email = response.result.email;
    formData.value.photo = response.result.photo;
    formData.value.phone_number = response.result.phone_number;
    formData.value.dob = response.result.dob;
    formData.value.line_id = response.result.line_id;
    formData.value.nrc_number = response.result.nrc_number;
    formData.value.company_name = response.result.company_name;
    formData.value.company_name = response.result.company_name;
    if (response.result.is_corporate_customer == "1") {
      enabled.value = true;
    } else {
      enabled.value = false;
    }
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
    <div class="mb-5 flex items-center justify-between">
      <h3 class="text-2xl font-medium text-gray-600">Edit Customer</h3>
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
              <p class="text-gray-800 text-sm mb-2">Email address</p>
              <input
                v-model="formData.email"
                type="email"
                id="title"
                class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.email" class="mt-1 text-sm text-red-600">
                {{ errors.email[0] }}
              </p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-8">
            <div class="">
              <p class="text-gray-800 text-sm mb-2">Phone Number</p>
              <input
                v-model="formData.phone_number"
                type="number"
                id="title"
                class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.phone_number" class="mt-1 text-sm text-red-600">
                {{ errors.phone_number[0] }}
              </p>
            </div>
            <div class="">
              <p class="text-gray-800 text-sm mb-2">DOB</p>
              <input
                v-model="formData.dob"
                type="date"
                id="title"
                class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.dob" class="mt-1 text-sm text-red-600">
                {{ errors.dob[0] }}
              </p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-8">
            <div class="">
              <p class="text-gray-800 text-sm mb-2">Line ID</p>
              <input
                v-model="formData.line_id"
                type="text"
                id="title"
                class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.line_id" class="mt-1 text-sm text-red-600">
                {{ errors.line_id[0] }}
              </p>
            </div>
            <div class="">
              <p class="text-gray-800 text-sm mb-2">NRC Number</p>
              <input
                v-model="formData.nrc_number"
                type="text"
                id="title"
                class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.nrc_number" class="mt-1 text-sm text-red-600">
                {{ errors.nrc_number[0] }}
              </p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-8">
            <div class="">
              <p class="text-gray-800 text-sm mb-2">Company Name</p>
              <input
                v-model="formData.company_name"
                type="text"
                id="title"
                class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.company_name" class="mt-1 text-sm text-red-600">
                {{ errors.company_name[0] }}
              </p>
            </div>
            <div class="">
              <p class="text-gray-800 text-sm mb-2">Is Corporate Customer</p>
              <div class="py-3">
                <Switch
                  v-model="enabled"
                  :class="enabled ? ' bg-blue-600' : 'bg-red-500'"
                  class="relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                >
                  <span class="sr-only">Use setting</span>
                  <span
                    aria-hidden="true"
                    :class="enabled ? 'translate-x-9' : 'translate-x-0'"
                    class="pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                  />
                </Switch>
              </div>
            </div>
          </div>

          <div class="text-end">
            <Button @click.prevent="onSubmitHandler"> Update </Button>
          </div>
        </div>
      </div>
      <div class="bg-white/60 p-6 rounded-lg shadow-sm mb-5">
        <div class="flex items-center justify-between gap-3 mb-3">
          <p>Profile Image</p>
          <input
            type="file"
            ref="featureImageInput"
            class="hidden"
            @change="handlerFeatureFileChange"
            accept="image/*"
          />

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
            v-if="featureImagePreview || !formData.photo"
            class="h-auto w-full rounded"
            :src="featureImagePreview"
            alt=""
          />
        </div>
        <div v-if="!featureImagePreview" class="p-2 bg-white rounded-md shadow">
          <img :src="formData.photo" alt="" class="w-full" />
        </div>
        <p v-if="errors?.image" class="mt-1 text-sm text-red-600">
          {{ errors.image[0] }}
        </p>
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
