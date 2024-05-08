<script setup>
import Layout from "./Layout.vue";
import Input from "../components/Input.vue";
import Button from "../components/Button.vue";
import Pagination from "../components/Pagination.vue";
import {
  PencilSquareIcon,
  TrashIcon,
  ShareIcon,
  EyeIcon,
  TicketIcon,
  BuildingOfficeIcon,
  PlusIcon,
  UserGroupIcon,
  XCircleIcon,
  UsersIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/vue/24/outline";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { onMounted, ref, watch } from "vue";
import Modal from "../components/Modal.vue";
import { storeToRefs } from "pinia";
import axios from "axios";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
import { useDestinationStore } from "../stores/destination";
import { useProductStore } from "../stores/product";
import { useCityStore } from "../stores/city";

const destStore = useDestinationStore();
const productStore = useProductStore();
const toast = useToast();
const cityStore = useCityStore();

const carModalOpen = ref(false);

const formData = ref({
  id: "",
  name: "",
  category_id: "",
  description: "",
  entry_fee: "",
  detail: "",
  summary: "",
  city_id: "",
  place_id: "",
  feature_img: "",
  images: [],
});
const showEntries = ref(10);
const errors = ref(null);
const search = ref("");
const { dests, loading } = storeToRefs(destStore);
const { products } = storeToRefs(productStore);
const { cities } = storeToRefs(cityStore);

const changePage = async (url) => {
  await destStore.getChangePage(url);
};

const addNewHandler = async () => {
  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("category_id", formData.value.category_id);
  frmData.append("description", formData.value.description);
  frmData.append("entry_fee", formData.value.entry_fee);
  frmData.append("detail", formData.value.detail);
  frmData.append("summary", formData.value.summary);
  frmData.append("city_id", formData.value.city_id);
  frmData.append("place_id", formData.value.place_id);
  frmData.append("feature_img", formData.value.feature_img);
  if (formData.value.images.length > 0) {
    for (let i = 0; i < formData.value.images.length; i++) {
      let file = formData.value.images[i];
      frmData.append("images[" + i + "]", file);
    }
  }

  try {
    const response = await destStore.addNewAction(frmData);
    formData.value = {
      name: "",
      category_id: "",
      description: "",
      entry_fee: "",
      detail: "",
      summary: "",
      city_id: "",
      place_id: "",
      feature_img: "",
      images: [],
    };
    errors.value = null;
    // carModalOpen.value = false;
    closeModal();
    featureImagePreview.value = null;
    imagesPreview.value = [];
    await destStore.getListAction();
    toast.success(response.message);
  } catch (error) {
    if (error.response.data.errors) {
      errors.value = error.response.data.errors;
    }
    toast.error(error.response.data.message);
  }
};

const updateHandler = async () => {
  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("category_id", formData.value.category_id);
  frmData.append("description", formData.value.description);
  frmData.append("entry_fee", formData.value.entry_fee);
  frmData.append("detail", formData.value.detail);
  frmData.append("summary", formData.value.summary);
  frmData.append("city_id", formData.value.city_id);
  frmData.append("place_id", formData.value.place_id);
  frmData.append("feature_img", formData.value.feature_img);
  if (formData.value.images.length > 0) {
    for (let i = 0; i < formData.value.images.length; i++) {
      let file = formData.value.images[i];
      frmData.append("images[" + i + "]", file);
    }
  }
  frmData.append("_method", "PUT");
  try {
    const response = await destStore.updateAction(frmData, formData.value.id);
    formData.value = {
      category_id: "",
      description: "",
      entry_fee: "",
    };
    errors.value = null;
    // carModalOpen.value = false;
    closeModal();
    await destStore.getListAction();
    toast.success(response.message);
  } catch (error) {
    if (error.response.data.errors) {
      errors.value = error.response.data.errors;
    }
    toast.error(error.response.data.message);
  }
};

const onSubmitHandler = async () => {
  if (formData.value.id) {
    updateHandler();
  } else {
    addNewHandler();
  }
};

const imagesEdit = ref([]);
const editModalOpenHandler = (data) => {
  formData.value.id = data.id;
  formData.value.name = data.name;
  formData.value.category_id = data.category.id;
  formData.value.description = data.description;
  formData.value.entry_fee = data.entry_fee;
  formData.value.city_id = data.city?.id;
  formData.value.detail = data.detail;
  formData.value.summary = data.summary;
  formData.value.place_id = data.place_id;
  featureImagePreview.value = data.feature_img;
  imagesEdit.value = [];
  for (let i = 0; i < data.images.length; i++) {
    imagesEdit.value.push(data.images[i].image);
  }
  console.log(imagesEdit.value, "this is image");
  carModalOpen.value = true;
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
        const response = await destStore.deleteAction(id);
        toast.success(response.message);
      } catch (error) {
        if (error.response.data.errors) {
          errors.value = error.response.data.errors;
        }
        toast.error(error.response.data.message);
      }
      await destStore.getListAction();
    }
  });
};

const featureImageInput = ref(null);
const featureImagePreview = ref(null);

const openFileFeaturePicker = () => {
  featureImageInput.value.click();
};

const handlerFeatureFileChange = (e) => {
  let selectedFile = e.target.files[0];
  if (selectedFile) {
    formData.value.feature_img = e.target.files[0];
    featureImagePreview.value = URL.createObjectURL(selectedFile);
  }
};

const removeFeatureSelectImage = () => {
  formData.value.feature_img = null;
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

const closeModal = () => {
  formData.value = {
    name: "",
    category_id: "",
    description: "",
    entry_fee: "",
    detail: "",
    summary: "",
    city_id: "",
    place_id: "",
    feature_img: "",
    images: [],
  };
  imagesPreview.value = [];
  imagesEdit.value = [];
  carModalOpen.value = false;
};

//For import Process
const importModal = ref(false);
const importHandler = () => {
  importModal.value = !importModal.value;
};
const fileImport = ref(null);
const importFileAction = (e) => {
  let file = e.target.files[0];
  fileImport.value = file;
};
const importActionHandler = async () => {
  const frmData = new FormData();
  frmData.append("file", fileImport.value);
  try {
    importModal.value = false;
    const res = await destStore.importAction(frmData);
    fileImport.value = null;
    console.log(res);
    toast.success(`Cities ${res.message}`);
  } catch (e) {
    // errors.value = e.response.data.errors;
    importModal.value = false;
    toast.error(e.response.data.message);
  }
};

onMounted(async () => {
  await destStore.getListAction();
  await productStore.getSimpleListAction();
  await cityStore.getSimpleListAction();
  console.log(cities.value, "pro");
});

watch(showEntries, async (newValue) => {
  await destStore.getListAction({ limit: showEntries.value });
});

watch(search, async (newValue) => {
  await destStore.getListAction({ search: search.value });
});
</script>

<template>
  <div
    class="bg-white/60 p-6 rounded-lg shadow-sm mb-5 md:col-span-3 hidden md:block"
  >
    <h3 class="text-xl font-medium text-gray-600 tracking-wide mb-3">
      Destination
    </h3>
    <!-- search input sort filter -->
    <div class="flex items-center justify-between mb-8">
      <div class="">
        <div class="">
          <input
            v-model="search"
            type="text"
            class="w-3/5 sm:w-3/5 md:w-[300px] mr-3 border px-4 py-2 rounded-md shadow focus:ring-0 focus:outline-none text-gray-500"
            placeholder="Search for destination.."
          />
        </div>
      </div>
      <div class="space-x-3">
        <Button :leftIcon="ShareIcon" intent="text" @click="importModal = true">
          Import
        </Button>
        <Button :leftIcon="PlusIcon" @click.prevent="carModalOpen = true">
          Add Destination
        </Button>
      </div>
    </div>
    <div class="bg-white/60 p-6 rounded-lg shadow-sm mb-5">
      <!-- search input sort filter -->
      <div class="flex items-center justify-between mb-5">
        <!-- <div>
          <p class="inline-block mr-2 text-gray-500 font-medium">Show</p>
          <select
            v-model="showEntries"
            class="border-2 p-2 rounded-md w-16 focus:outline-none focus:ring-0"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <p class="inline-block ml-2 text-gray-500 font-medium">entries</p>
        </div> -->
      </div>
      <div class="overflow-auto rounded-lg shadow mb-5" v-if="!loading">
        <table class="w-full">
          <thead class="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th class="p-4 text-xs font-medium tracking-wide text-left">
                Name
              </th>
              <th class="p-4 text-xs font-medium tracking-wide text-left">
                Category
              </th>
              <th class="p-4 text-xs font-medium tracking-wide text-left">
                Description
              </th>
              <th class="p-4 text-xs font-medium tracking-wide text-left">
                Entry_fee
              </th>
              <th class="p-4 text-xs font-medium tracking-wide text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="des in dests?.data"
              :key="des.id"
              class="bg-white even:bg-gray-50 hover:bg-gray-50"
            >
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                {{ des.name }}
              </td>
              <td
                class="p-4 text-xs text-gray-700 whitespace-nowrap"
                v-if="des.category?.name"
              >
                {{ des.category?.name }}
              </td>
              <td
                class="p-4 text-xs text-gray-700 whitespace-nowrap max-w-[200px] overflow-hidden"
              >
                {{ des.description }}
              </td>
              <td
                class="p-4 text-xs text-gray-700 whitespace-nowrap"
                v-if="des.entry_fee"
              >
                {{ des.entry_fee }}
              </td>
              <td
                class="p-4 text-xs text-gray-700 whitespace-nowrap"
                v-if="!des.entry_fee"
              >
                -
              </td>
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <button
                    @click.prevent="editModalOpenHandler(des)"
                    class="hover:bg-yellow-500 p-2 bg-white text-blue-500 transition shadow rounded hover:text-white"
                  >
                    <PencilSquareIcon class="w-5 h-5" />
                  </button>
                  <button
                    @click.prevent="onDeleteHandler(des.id)"
                    class="hover:bg-red-500 p-2 bg-white text-blue-500 transition shadow rounded hover:text-white"
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
      <Pagination v-if="!loading" :data="dests" @change-page="changePage" />
    </div>
    <!-- modal -->
    <Modal :isOpen="carModalOpen" @closeModal="closeModal">
      <DialogPanel
        class="w-full max-w-[1000px] transform rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-5"
        >
          {{ formData.id ? "Edit Destination" : "Add New Destination" }}
        </DialogTitle>
        <form
          @submit.prevent="onSubmitHandler"
          class="mt-2 grid grid-cols-3 gap-4"
        >
          <div class="col-span-2 grid grid-cols-2 gap-4">
            <div class="space-y-1 mb-2">
              <label for="name" class="text-gray-800 text-sm">Name</label>
              <input
                type="text"
                v-model="formData.name"
                id="name"
                class="h-10 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.name" class="mt-1 text-sm text-red-600">
                {{ errors.name[0] }}
              </p>
            </div>
            <div class="space-y-1 mb-4">
              <p class="text-gray-800 text-sm mb-2">Category</p>
              <v-select
                v-model="formData.category_id"
                class="style-chooser"
                :options="products.data ?? []"
                label="name"
                :clearable="false"
                :reduce="(product) => product.id"
                placeholder="Choose category"
              ></v-select>
            </div>

            <div class="space-y-1 mb-4">
              <p class="text-gray-800 text-sm mb-2">City</p>
              <v-select
                v-model="formData.city_id"
                class="style-chooser"
                :options="cities?.data ?? []"
                label="name"
                :clearable="false"
                :reduce="(product) => product.id"
                placeholder="Choose city"
              ></v-select>
            </div>
            <div class="space-y-1 mb-2">
              <label for="name" class="text-gray-800 text-sm">Entry_fee</label>
              <input
                type="text"
                v-model="formData.entry_fee"
                id="name"
                class="h-10 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.entry_fee" class="mt-1 text-sm text-red-600">
                {{ errors.entry_fee[0] }}
              </p>
            </div>
            <div class="space-y-1 mb-2">
              <label for="name" class="text-gray-800 text-sm"
                >Description</label
              >
              <textarea
                class="w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                name=""
                id=""
                cols="30"
                rows="5"
                v-model="formData.description"
              ></textarea>
              <p v-if="errors?.description" class="mt-1 text-sm text-red-600">
                {{ errors.description[0] }}
              </p>
            </div>
            <div class="space-y-1 mb-2">
              <label for="name" class="text-gray-800 text-sm">Detail</label>
              <textarea
                class="w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                name=""
                id=""
                cols="30"
                rows="5"
                v-model="formData.detail"
              ></textarea>
              <p v-if="errors?.detail" class="mt-1 text-sm text-red-600">
                {{ errors.detail[0] }}
              </p>
            </div>
            <div class="space-y-1 mb-2">
              <label for="name" class="text-gray-800 text-sm">Summary</label>
              <textarea
                class="w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                name=""
                id=""
                cols="30"
                rows="5"
                v-model="formData.summary"
              ></textarea>
              <p v-if="errors?.summary" class="mt-1 text-sm text-red-600">
                {{ errors.summary[0] }}
              </p>
            </div>
            <div class="space-y-1 mb-2">
              <label for="name" class="text-gray-800 text-sm">Place Id</label>
              <textarea
                class="w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                name=""
                id=""
                cols="30"
                rows="5"
                v-model="formData.place_id"
              ></textarea>
              <p v-if="errors?.place_id" class="mt-1 text-sm text-red-600">
                {{ errors.place_id[0] }}
              </p>
            </div>
          </div>
          <div class="col-span-1">
            <div class="bg-white/60 px-2 rounded-lg mb-5">
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
                v-if="imagesPreview.length == 0 && imagesEdit.length == 0"
                @click.prevent="openFileImagePicker"
              >
                <div
                  class="cursor-pointer w-full h-[80px] border-2 border-dashed border-gray-400 rounded flex justify-center items-center"
                >
                  <span class="text-xs"
                    ><i
                      class="fa-solid fa-plus text-lg font-semibold py-1 px-3 bg-[#ff613c] rounded-full shadow text-white"
                    ></i
                  ></span>
                </div>
                <div
                  class="cursor-pointer w-full h-[80px] border-2 border-dashed border-gray-400 rounded flex justify-center items-center"
                >
                  <span class="text-xs"
                    ><i
                      class="fa-solid fa-plus text-lg font-semibold py-1 px-3 bg-[#ff613c] rounded-full shadow text-white"
                    ></i
                  ></span>
                </div>
                <div
                  class="cursor-pointer w-full h-[80px] border-2 border-dashed border-gray-400 rounded flex justify-center items-center"
                >
                  <span class="text-xs"
                    ><i
                      class="fa-solid fa-plus text-lg font-semibold py-1 px-3 bg-[#ff613c] rounded-full shadow text-white"
                    ></i
                  ></span>
                </div>
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
                <div
                  v-if="imagesPreview.length != 0"
                  @click.prevent="openFileImagePicker"
                  class="cursor-pointer w-full h-[90px] border-2 border-dashed border-gray-400 rounded flex justify-center items-center mt-2"
                >
                  <span class="text-xs"
                    ><i
                      class="fa-solid fa-plus text-lg font-semibold py-1 px-3 bg-[#ff613c] rounded-full shadow text-white"
                    ></i
                  ></span>
                </div>
              </div>
              <div
                class="grid grid-cols-3 gap-2"
                v-if="imagesEdit.length != 0 && imagesPreview.length == 0"
              >
                <div
                  class="relative"
                  v-for="(image, index) in imagesEdit"
                  :key="index"
                >
                  <!-- <button
                    @click.prevent="removeImageSelectImage(index)"
                    class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
                  >
                    <XCircleIcon class="w-8 h-8 font-semibold" />
                  </button> -->
                  <img class="h-auto w-full rounded" :src="image" alt="" />
                </div>
                <div
                  v-if="imagesEdit.length != 0"
                  @click.prevent="openFileImagePicker"
                  class="cursor-pointer w-full h-[90px] border-2 border-dashed border-gray-400 rounded flex justify-center items-center mt-2"
                >
                  <span class="text-xs"
                    ><i
                      class="fa-solid fa-plus text-lg font-semibold py-1 px-3 bg-[#ff613c] rounded-full shadow text-white"
                    ></i
                  ></span>
                </div>
              </div>
            </div>
            <div class="bg-white/60 px-2 pt-6 rounded-lg shadow-sm mb-5">
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
          <div class="text-end col-span-2">
            <Button type="submit"> Submit </Button>
          </div>
        </form>
      </DialogPanel>
    </Modal>
    <Modal :isOpen="importModal" @closeModal="importModal = false">
      <DialogPanel
        class="w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-5"
        >
          Import Process
        </DialogTitle>
        <form
          class="flex justify-between items-center"
          @submit.prevent="importActionHandler"
        >
          <input type="file" name="" @change="importFileAction" id="" />
          <button
            class="border hover:shadow-md border-gray-400 px-4 py-2 rounded-md"
          >
            Import
          </button>
        </form>
        <div class="mt-5 space-y-3 border border-gray-400 p-4 rounded-md">
          <p class="font-semibold">notice</p>
          <p class="text-xs">- file input must be CSV file .</p>
          <p class="text-xs">- All table data must be have .</p>
          <p class="text-xs">- Import process will take time may be longer</p>
          <p class="text-xs">- Process is working behind .</p>
          <p class="text-xs">
            - When finish process , system will show noti message
          </p>
          <p class="text-xs">
            - When fail the process , system will show noti message
          </p>
        </div>
      </DialogPanel>
    </Modal>
  </div>
</template>
