<template>
  <div
    class="bg-white/60 p-6 rounded-lg shadow-sm mb-5 md:col-span-3 hidden md:block"
  >
    <h3 class="text-xl font-medium text-gray-600 tracking-wide mb-3">
      Attraction
    </h3>

    <!-- modal -->
    <Modal :isOpen="createModalOpen" @closeModal="createModalOpen = false">
      <DialogPanel
        class="w-[900px] p-4 text-left align-middle transition-all transform bg-white rounded-lg shadow-xl"
      >
        <DialogTitle
          as="h3"
          class="mb-5 text-lg font-medium leading-6 text-gray-900"
        >
          {{ formData.id ? "Edit Attraction" : "Add New Attraction" }}
        </DialogTitle>
        <form @submit.prevent="onSubmitHandler" class="mt-2">
          <div class="grid grid-cols-2 gap-4">
            <div class="mb-2 space-y-1">
              <label for="name" class="text-sm text-gray-800"
                >Ticket Name</label
              >
              <input
                type="text"
                v-model="formData.name"
                id="name"
                class="w-full h-10 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.name" class="mt-1 text-sm text-red-600">
                {{ errors.name[0] }}
              </p>
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
            <!-- <div>
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
            </div> -->
            <!-- <div class="mb-2 space-y-1">
              <label for="name" class="text-sm text-gray-800">Place</label>
              <input
                type="text"
                v-model="formData.place"
                id="name"
                class="w-full h-10 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.name" class="mt-1 text-sm text-red-600">
                {{ errors.place[0] }}
              </p>
            </div> -->
            <div class="mb-2 space-y-1">
              <label for="name" class="text-sm text-gray-800">Legal Name</label>
              <input
                type="text"
                v-model="formData.legal_name"
                id="name"
                class="w-full h-10 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.legal_name" class="mt-1 text-sm text-red-600">
                {{ errors.legal_name[0] }}
              </p>
            </div>
            <div>
              <p class="mb-2 text-sm text-gray-800 space-y-1">Bank Name</p>
              <v-select
                v-model="formData.bank_name"
                class="style-chooser"
                :options="bankName ?? []"
                label="name"
                :clearable="false"
                :reduce="(bank) => bank.name"
                placeholder="Choose Bank"
              ></v-select>
            </div>
            <div>
              <p class="mb-2 mt-2 text-sm text-gray-800 space-y-1">
                Payment Method
              </p>
              <v-select
                v-model="formData.payment_method"
                class="style-chooser"
                :options="paymentMethod ?? []"
                label="name"
                :clearable="false"
                :reduce="(payment) => payment.name"
                placeholder="Choose Payment"
              ></v-select>
            </div>
            <div class="mb-2 mt-2 space-y-1">
              <label for="name" class="text-sm text-gray-800"
                >Bank Account Number</label
              >
              <input
                v-model="formData.bank_account_number"
                type="number"
                class="w-full h-10 px-4 py-2 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-gray-300"
              />
            </div>
            <div class="mb-2 mt-2 space-y-1">
              <label for="name" class="text-sm text-gray-800">
                Account Name</label
              >
              <input
                v-model="formData.account_name"
                type="text"
                class="w-full h-10 px-4 py-2 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-gray-300"
              />
            </div>
            <div class="mb-2 space-y-1">
              <label for="name" class="text-sm text-gray-800">Contracts</label>
              <input
                type="file"
                multiple
                @change="contract_file"
                id="name"
                class="w-full h-10 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.contracts" class="mt-1 text-sm text-red-600">
                {{ errors.contracts[0] }}
              </p>
            </div>
            <!-- <div class="mb-2 space-y-2">
              <label for="name" class="text-sm text-gray-800"
                >Contract Due Date</label
              >
              <input
                v-model="formData.contract_due"
                type="date"
                class="w-full h-10 px-4 py-2 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-gray-300"
              />
            </div> -->

            <div class="mb-2 space-y-1" v-if="linkContract.length != 0">
              <p v-for="(a, index) in linkContract.contacts" :key="index">
                <a :href="a.file" target="_blink" class="text-sm text-red-500"
                  >link</a
                >
              </p>
            </div>
            <div class="col-span-2">
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
            <div class="col-span-2" v-if="!formData.id">
              <div class="bg-white/60 p-6 rounded-lg shadow-sm mb-5">
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
            <div class="col-span-2" v-if="formData.id">
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
                <div
                  class="grid grid-cols-3 gap-2"
                  v-if="imagesPreview.length != 0"
                >
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
                    <img
                      class="h-auto w-full rounded"
                      :src="image.image"
                      alt=""
                    />
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
          <div class="text-end flex justify-end items-center">
            <p
              class="text-[#ff613c] cursor-pointer px-2 py-1.5 mr-2 rounded bg-transparent border border-[#ff613c]"
              @click="createModalOpen = false"
            >
              close
            </p>
            <Button type="submit" v-if="!loading"> Submit </Button>
            <Button type="button" class="bg-gray-300" v-if="loading">
              Submit
            </Button>
          </div>
        </form>
      </DialogPanel>
    </Modal>
    <!-- search input sort filter -->
    <div class="flex items-center justify-between mb-8">
      <div class="">
        <input
          type="text"
          v-model="search"
          class="w-3/5 sm:w-3/5 md:w-[300px] mr-3 border px-4 py-2 rounded-md shadow-sm focus:ring-0 focus:outline-none text-gray-500"
          placeholder="Search Attraction..."
        />

        <AdjustmentsHorizontalIcon
          class="w-6 text-gray-600 h-6 inline-block mx-2 cursor-pointer"
        />
      </div>
      <div class="space-x-3">
        <Button :leftIcon="ShareIcon" intent="text"> Export </Button>
        <Button :leftIcon="PlusIcon" @click="VantourCreate"> Create </Button>
      </div>
    </div>
    <div class="overflow-auto rounded-lg shadow mb-5">
      <table class="w-full">
        <thead class="bg-gray-50 border-b-2 border-gray-200">
          <tr>
            <th class="w-20 p-3 text-xs font-medium tracking-wide text-left">
              No.
            </th>
            <th class="w-30 p-3 text-xs font-medium tracking-wide text-left">
              Image
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              Ticket Name
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              Legal Name
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              Place
            </th>
            <th class="w-30 p-3 text-xs font-medium tracking-wide text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            class="bg-white even:bg-gray-50 hover:bg-gray-50"
            v-for="(r, index) in entrances?.data"
            :key="index"
          >
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ r.id }}
            </td>
            <td
              class="p-3 text-xs text-gray-700 whitespace-nowrap"
              v-if="r.cover_image"
            >
              <img :src="r.cover_image" class="w-14 h-10 rounded-lg" alt="" />
            </td>
            <td
              class="p-3 text-xs text-gray-700 whitespace-nowrap"
              v-if="!r.cover_image"
            >
              -
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ r.name }}
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ r.legal_name }}
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ r.place }}
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <button
                  @click="editModalOpenHandler(r.id)"
                  class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-blue-500 hover:text-white"
                >
                  <EyeIcon class="w-5 h-5" />
                </button>

                <button
                  @click="editModalOpenHandler(r.id)"
                  class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                >
                  <PencilSquareIcon class="w-5 h-5" />
                </button>

                <button
                  v-if="authStore.isSuperAdmin"
                  @click.prevent="onDeleteHandler(r.id)"
                  class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-red-500 hover:text-white"
                >
                  <TrashIcon class="w-5 h-5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- pagination -->
    <Pagination v-if="!loading" :data="entrances" @change-page="changePage" />
  </div>
</template>

<script setup>
import {
  PencilSquareIcon,
  TrashIcon,
  ShareIcon,
  EyeIcon,
  TicketIcon,
  BuildingOfficeIcon,
  PlusIcon,
  UserGroupIcon,
  UsersIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/vue/24/outline";
import { XCircleIcon } from "@heroicons/vue/24/outline";
import Pagination from "../components/Pagination.vue";
import { onMounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useEntranceStore } from "../stores/entrance";
import Modal from "../components/Modal.vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import { useCityStore } from "../stores/city";
import { useProductStore } from "../stores/product";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const cityStore = useCityStore();
const productStore = useProductStore();
const toast = useToast();
const authStore = useAuthStore();

const entranceStore = useEntranceStore();
const { entrances, loading } = storeToRefs(entranceStore);
const { cities } = storeToRefs(cityStore);
const { products } = storeToRefs(productStore);

const search = ref("");
const errors = ref([]);
const createModalOpen = ref(false);

const bankName = [
  { id: "1", name: "K + " },
  { id: "2", name: "SCB " },
  { id: "3", name: "Bangkok Bank" },
  { id: "4", name: "Other Bank " },
];
const paymentMethod = [
  { id: "1", name: "Bank Transfer" },
  { id: "2", name: "International Remittance" },
  { id: "3", name: "Cash" },
  { id: "4", name: "Other ..." },
];

const formData = ref({
  name: "",
  description: "",
  cover_image: "",
  city_id: [],
  category: [],
  images: [],
  feature_image: "",
  id: "",
  payment_method: "",
  bank_name: "",
  bank_account_number: "",
  account_name: "",
  place: "",
  legal_name: "",
  contract_due: "",
  contracts: [],
});

const linkContract = ref({});

const VantourCreate = () => {
  formData.value.id = "";
  formData.value.name = "";
  formData.value.description = "";
  formData.value.images = [];
  formData.value.feature_image = "";
  formData.value.payment_method = "";
  formData.value.bank_name = "";
  formData.value.account_name = "";
  formData.value.bank_account_number = "";
  formData.value.place = "";
  formData.value.legal_name = "";
  formData.value.contract_due = "";
  formData.value.contracts = [];
  linkContract.value = {};
  createModalOpen.value = true;
};

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

const changePage = async (url) => {
  console.log(url);
  await entranceStore.getChangePage(url);
};

const onDeleteHandler = async (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await entranceStore.deleteAction(id);
        toast.success(response.message);
      } catch (error) {
        console.log(
          "🚀 ~ file: BlogView.vue:65 ~ onDeleteHandler ~ error:",
          error
        );
        if (error.response.data.errors) {
          errors.value = error.response.data.errors;
        }
        toast.error(error.response.data.message);
      }
      await entranceStore.getListAction();
    }
  });
};

const onSubmitHandler = async () => {
  if (formData.value.id) {
    updateHandler();
    console.log("update", formData.value.id);
  } else {
    addNewHandler();
    console.log("doing add");
  }
};

const addNewHandler = async () => {
  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("description", formData.value.description);
  frmData.append("account_name", formData.value.account_name);
  // frmData.append("place", formData.value.place);
  frmData.append("payment_method", formData.value.payment_method);
  frmData.append("bank_name", formData.value.bank_name);
  frmData.append("bank_account_number", formData.value.bank_account_number);
  frmData.append("legal_name", formData.value.legal_name);

  console.log(formData.value.contracts);

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

  // for (var x = 0; x < formData.value.category.length; x++) {
  //   frmData.append("category_ids[" + x + "]", formData.value.category[x]);
  // }
  if (formData.value.contracts) {
    // frmData.append("contracts", formData.value.contracts);
    for (let i = 0; i < formData.value.contracts.length; i++) {
      let file = formData.value.contracts[i];
      frmData.append("contracts[" + i + "]", file);
    }
  }

  try {
    const response = await entranceStore.addNewAction(frmData);
    formData.value = {
      name: "",
      description: "",
      cover_image: "",
      city_id: [],
      category: [],
      images: [],
      feature_image: "",
      id: "",
      payment_method: "",
      bank_name: "",
      bank_account_number: "",
      account_name: "",
      place: "",
      contracts: [],
      legal_name: "",
    };
    errors.value = null;
    toast.success(response.message);
    createModalOpen.value = false;
    await entranceStore.getListAction();
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

const contract_file = (e) => {
  let selectedFile = e.target.files;
  if (selectedFile) {
    for (let index = 0; index < selectedFile.length; index++) {
      // formData.value.contracts.push(selectedFile[index]);
      let file = selectedFile[index];
      formData.value.contracts.push(file);
    }
    console.log(formData.value.contracts, "this is contracts");
  }
};

const updateHandler = async () => {
  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("_method", "PUT");

  frmData.append("description", formData.value.description);
  frmData.append("account_name", formData.value.account_name);
  // frmData.append("place", formData.value.place);
  frmData.append("payment_method", formData.value.payment_method);
  frmData.append("bank_name", formData.value.bank_name);
  frmData.append("bank_account_number", formData.value.bank_account_number);
  frmData.append("legal_name", formData.value.legal_name);

  console.log(formData.value.contracts);

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
  if (formData.value.contracts) {
    // frmData.append("contracts", formData.value.contracts);
    for (let i = 0; i < formData.value.contracts.length; i++) {
      let file = formData.value.contracts[i];
      frmData.append("contracts[" + i + "]", file);
    }
  }

  // for (var x = 0; x < formData.value.category.length; x++) {
  //   frmData.append("category_ids[" + x + "]", formData.value.category[x]);
  // }

  try {
    const response = await entranceStore.updateAction(
      frmData,
      formData.value.id
    );
    formData.value = {
      id: "",
      name: "",
      description: "",
      cover_image: "",
      city_id: [],
      category: [],
      images: [],
      feature_image: "",
      id: "",
      payment_method: "",
      bank_name: "",
      bank_account_number: "",
      account_name: "",
      place: "",
      legal_name: "",
    };
    errors.value = null;
    toast.success(response.message);
    createModalOpen.value = false;
    await entranceStore.getListAction();
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

const editData = ref({
  city_id: [],

  category: [],
  cover_image: "",
  images: [],
});
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

// const linkContract = ref({});
const editModalOpenHandler = async (id) => {
  try {
    const response = await entranceStore.getDetailAction(id);
    console.log(response, "this is entrance");
    formData.value.name = response.result.name;
    formData.value.id = id;

    formData.value.description = response.result.description;
    formData.value.account_name = response.result.account_name;
    formData.value.payment_method = response.result.payment_method;
    formData.value.bank_name = response.result.bank_name;
    formData.value.bank_account_number = response.result.bank_account_number;
    // formData.value.place = response.result.place;
    formData.value.legal_name = response.result.legal_name;

    editData.value.cover_image = response.result.cover_image;
    linkContract.value = response.result;
    editData.value.city_id = response.result.cities;
    // editData.value.category = response.result.categories;
    formData.value.images = response.result.images;
    editData.value.variations = response.result.variations;
    console.log(response.result.tags);
    console.log(editData.value.category, "edit category");

    updateEditCityData();

    updateEditCategoryData();
    createModalOpen.value = true;
  } catch (error) {
    console.log(error);
  }
};

const citylist = ref([]);
const categorylist = ref([]);
onMounted(async () => {
  await entranceStore.getListAction();
  await cityStore.getSimpleListAction();
  await productStore.getSimpleListAction();
  citylist.value = cities.value.data;
  categorylist.value = products.value.data;
  console.log(categorylist.value, "this is category");
});

watch(search, async (newValue) => {
  await entranceStore.getListAction({ search: search.value });
});
</script>
