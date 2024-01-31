<script setup>
import Layout from "./Layout.vue";
import { XCircleIcon } from "@heroicons/vue/24/outline";
import {
  PlusIcon,
  ListBulletIcon,
  PencilSquareIcon,
} from "@heroicons/vue/24/outline";
import { onMounted, onUnmounted, ref } from "vue";
import Button from "../components/Button.vue";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { Switch } from "@headlessui/vue";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { useToast } from "vue-toastification";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useCustomerStore } from "../stores/customer";
import Pagination from "../components/Pagination.vue";

const toast = useToast();
const router = useRouter();
const route = useRoute();

const enabled = ref(false);

const customerStore = useCustomerStore();
const { loading } = storeToRefs(customerStore);

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

const strippedNumber = (text) => {
  // Split the string by "_", and get the second part (index 1)
  return text.split("_")[1];
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

const saleList = ref(null);
const totalBalanceDue = ref(0);
const getSale = async () => {
  const res = await customerStore.getDetailSalesAction(route.params.id);
  console.log(res, "sales list");
  saleList.value = res.result;
  for (let i = 0; i < saleList.value.data.length; i++) {
    totalBalanceDue.value += saleList.value.data[i].balance_due * 1;
    // console.log(saleList.value.data[i].balance_due, "that is balance due");
  }
};

const limitedText = (text) => {
  if (text != "") {
    if (text?.length <= 10) {
      return text;
    } else {
      return text?.slice(0, 10);
    }
  }
};

onMounted(async () => {
  await getDetail();
  await getSale();
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
              <p class="text-gray-800 text-sm mb-2">Passport Number</p>
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
          <p>Passport Label Name</p>
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
        <div
          class="bg-white/50 rounded-lg flex justify-between items-center my-3 p-4 shadow"
        >
          <div>total balance due :</div>
          <div class="text-[#ff613c] font-semibold">
            {{ totalBalanceDue }} THB
          </div>
        </div>
        <p v-if="errors?.image" class="mt-1 text-sm text-red-600">
          {{ errors.image[0] }}
        </p>
      </div>
    </div>

    <div class="mb-5 overflow-auto rounded-lg shadow bg-white/50">
      <div class="grid grid-cols-9 gap-2 bg-gray-100">
        <div class="py-2 text-xs font-medium tracking-wide text-center">
          Customer
        </div>
        <div class="py-2 text-xs font-medium tracking-wide text-center">
          Invoice Number
        </div>
        <div class="py-2 text-xs font-medium tracking-wide text-center">
          CRM ID
        </div>
        <div class="py-2 text-xs font-medium tracking-wide text-center">
          Sale Date
        </div>
        <div class="py-2 text-xs font-medium tracking-wide text-center">
          Payment
        </div>
        <div class="py-2 text-xs font-medium tracking-wide text-center">
          Reservation Status
        </div>
        <div class="py-2 text-xs font-medium tracking-wide text-center">
          Total Sale Amount
        </div>
        <div class="py-2 text-xs font-medium tracking-wide text-center">
          Balance Due
        </div>

        <div class="py-2 text-xs font-medium tracking-wide text-center"></div>
      </div>
      <div
        v-show="!loading"
        class="relative divide-y divide-gray-200 group"
        v-for="r in saleList?.data"
        :key="r.id"
      >
        <Disclosure>
          <DisclosureButton class="w-full py-2">
            <div class="grid grid-cols-9 gap-2 bg-white">
              <div class="p-3 text-xs text-gray-700 whitespace-nowrap">
                {{ r.customer?.name }}
              </div>
              <!-- r.past_crm_id ? r.past_crm_id :  -->
              <div class="p-3 text-xs text-gray-700 whitespace-nowrap">
                {{ r.invoice_number }}
              </div>
              <div class="p-3 text-xs text-gray-700 whitespace-nowrap">
                {{ r.crm_id }}
              </div>
              <div class="p-3 text-xs text-gray-700 whitespace-nowrap">
                {{ r.booking_date }}
              </div>
              <div class="p-3 text-xs text-gray-700 whitespace-nowrap">
                <p v-if="!r.payment_status">-</p>
                <p
                  v-if="r.payment_status == 'fully_paid'"
                  class="inline-block px-3 py-1 text-xs text-white bg-green-500 rounded-full shadow"
                >
                  {{ r.payment_status }}
                </p>
                <p
                  v-if="r.payment_status == 'not_paid'"
                  class="inline-block px-3 py-1 text-xs text-white bg-red-500 rounded-full shadow"
                >
                  {{ r.payment_status }}
                </p>
                <p
                  v-if="r.payment_status == 'partially_paid'"
                  class="inline-block px-3 py-1 text-xs text-white bg-yellow-500 rounded-full shadow"
                >
                  {{ r.payment_status }}
                </p>
              </div>
              <div class="p-3 text-xs text-gray-700 whitespace-nowrap">
                <p v-if="!r.reservation_status">-</p>

                <p
                  v-if="r.reservation_status == 'confirmed'"
                  class="inline-block px-3 py-1 text-xs text-white bg-green-500 rounded-full shadow"
                >
                  {{ r.reservation_status }}
                </p>
                <p
                  v-if="r.reservation_status == 'declined'"
                  class="inline-block px-3 py-1 text-xs text-white bg-red-500 rounded-full shadow"
                >
                  {{ r.reservation_status }}
                </p>
                <p
                  v-if="r.reservation_status == 'awaiting'"
                  class="inline-block px-3 py-1 text-xs text-white bg-yellow-500 rounded-full shadow"
                >
                  {{ r.reservation_status }}
                </p>
              </div>
              <div class="p-3 text-xs text-gray-700 whitespace-nowrap">
                {{ r.sub_total }}
              </div>
              <div class="p-3 text-xs text-gray-700 whitespace-nowrap">
                {{ r.balance_due }}
              </div>
              <div
                class="flex items-center justify-end col-span-1 p-3 space-x-2 text-xs text-gray-700 whitespace-nowrap"
                @click="seenClick"
              >
                <p
                  class="inline-block px-3 py-2 text-blue-500 transition bg-white rounded shadow hover:bg-blue-500 hover:text-white"
                >
                  <i class="fa-solid fa-chevron-down"></i>
                </p>
              </div>
            </div>
          </DisclosureButton>
          <transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-out"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <DisclosurePanel class="w-full text-gray-500">
              <div class="grid grid-cols-9 gap-2 bg-gray-300">
                <div class="py-2 text-xs font-medium tracking-wide text-center">
                  Sale No.
                </div>
                <div class="py-2 text-xs font-medium tracking-wide text-center">
                  Product Type
                </div>
                <div class="py-2 text-xs font-medium tracking-wide text-center">
                  Product Name
                </div>
                <div class="py-2 text-xs font-medium tracking-wide text-center">
                  Variation Name
                </div>
                <div class="py-2 text-xs font-medium tracking-wide text-center">
                  Expense Status
                </div>
                <div class="py-2 text-xs font-medium tracking-wide text-center">
                  Res Status
                </div>

                <div class="py-2 text-xs font-medium tracking-wide text-center">
                  Service Date
                </div>
              </div>
              <div
                class="grid w-full grid-cols-9 gap-2 bg-gray-100"
                v-for="d in r.items"
                :key="d.id"
              >
                <div
                  class="p-3 text-xs text-center text-gray-700 whitespace-nowrap"
                >
                  {{ strippedNumber(d.crm_id) }}
                </div>
                <div
                  class="p-3 text-xs text-center text-gray-700 whitespace-nowrap"
                >
                  <p v-if="d.product_type == 'App\\Models\\PrivateVanTour'">
                    PrivateVanTour
                  </p>
                  <p v-if="d.product_type == 'App\\Models\\GroupTour'">
                    GroupTour
                  </p>
                  <p v-if="d.product_type == 'App\\Models\\AirportPickup'">
                    Airpot Pickup
                  </p>
                  <p v-if="d.product_type == 'App\\Models\\EntranceTicket'">
                    Entrance Ticket
                  </p>
                  <p v-if="d.product_type == 'App\\Models\\Inclusive'">
                    Inclusive
                  </p>
                  <p v-if="d.product_type == 'App\\Models\\Hotel'">
                    Hotel / Roam
                  </p>
                  <p v-if="d.product_type == 'App\\Models\\Airline'">Airline</p>
                </div>
                <div
                  class="p-3 text-xs text-center text-gray-700 whitespace-nowrap"
                >
                  <p>{{ limitedText(d.product?.name) }}</p>
                </div>
                <div
                  class="p-3 text-xs text-center text-gray-700 whitespace-nowrap"
                >
                  <p v-if="d.car?.name">{{ limitedText(d.car?.name) }}</p>
                  <p v-if="d.variation?.name">
                    {{ limitedText(d.variation?.name) }}
                  </p>
                  <p v-if="d.room?.name">{{ limitedText(d.room?.name) }}</p>
                </div>
                <div
                  class="p-3 text-xs text-center text-gray-700 whitespace-nowrap"
                >
                  <p v-if="!d.payment_status || d.payment_status == 'null'">
                    -
                  </p>
                  <p
                    v-if="d.payment_status == 'fully_paid'"
                    class="inline-block px-3 py-1 text-xs text-white bg-green-500 rounded-full shadow"
                  >
                    {{ d.payment_status }}
                  </p>
                  <p
                    v-if="d.payment_status == 'not_paid'"
                    class="inline-block px-3 py-1 text-xs text-white bg-red-500 rounded-full shadow"
                  >
                    {{ d.payment_status }}
                  </p>
                  <p
                    v-if="d.payment_status == 'partially_paid'"
                    class="inline-block px-3 py-1 text-xs text-white bg-yellow-500 rounded-full shadow"
                  >
                    {{ d.payment_status }}
                  </p>
                </div>
                <div
                  class="p-3 text-xs text-center text-gray-700 whitespace-nowrap"
                >
                  <p
                    v-if="
                      !d.reservation_status || d.reservation_status == 'null'
                    "
                  >
                    -
                  </p>

                  <p
                    v-if="d.reservation_status == 'confirmed'"
                    class="inline-block px-3 py-1 text-xs text-white bg-green-500 rounded-full shadow"
                  >
                    {{ d.reservation_status }}
                  </p>
                  <p
                    v-if="d.reservation_status == 'declined'"
                    class="inline-block px-3 py-1 text-xs text-white bg-red-500 rounded-full shadow"
                  >
                    {{ d.reservation_status }}
                  </p>
                  <p
                    v-if="d.reservation_status == 'awaiting'"
                    class="inline-block px-3 py-1 text-xs text-white bg-yellow-500 rounded-full shadow"
                  >
                    {{ d.reservation_status }}
                  </p>
                </div>

                <div
                  class="p-3 text-xs text-center text-gray-700 whitespace-nowrap"
                >
                  {{ d.service_date }}
                </div>
                <div></div>

                <div
                  class="col-span-1 p-3 text-xs text-end text-gray-700 whitespace-nowrap"
                >
                  <router-link
                    :to="'/reservation/update/' + d.id + '/' + d.crm_id"
                  >
                    <button
                      class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-blue-500 hover:text-white"
                    >
                      <PencilSquareIcon class="w-5 h-5" />
                    </button>
                  </router-link>
                </div>
                <div
                  class="col-span-2 py-3 pl-10 text-xs text-gray-700 whitespace-nowrap"
                ></div>
              </div>
            </DisclosurePanel>
          </transition>
        </Disclosure>
      </div>
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div
          class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-4"
          role="status"
        >
          <span
            class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
            >Loading...</span
          >
        </div>
        Loading ...
      </div>
    </div>
    <Pagination v-if="!loading" :data="saleList" @change-page="changePage" />
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
