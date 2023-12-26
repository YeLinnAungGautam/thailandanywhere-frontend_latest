<template>
  <div
    class="hidden p-6 mb-5 rounded-lg shadow-sm bg-white/60 md:col-span-3 md:block"
  >
    <h3 class="mb-3 text-xl font-medium tracking-wide text-gray-600">
      Restaurants
    </h3>

    <!-- modal -->
    <Modal :isOpen="createModalOpen" @closeModal="closeModal">
      <DialogPanel
        class="max-w-xl p-4 text-left align-middle transition-all transform bg-white rounded-lg shadow-xl"
      >
        <DialogTitle
          as="h3"
          class="mb-5 text-lg font-medium leading-6 text-gray-900"
        >
          {{ formData.id ? "Edit Restaurant" : "Add New Restaurant" }}
        </DialogTitle>
        <form @submit.prevent="onSubmitHandler" class="mt-2">
          <div class="mb-2 space-y-1">
            <label for="name" class="text-sm text-gray-800">Name</label>
            <input
              type="text"
              v-model="formData.name"
              id="name"
              class="w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.name" class="mt-1 text-sm text-red-600">
              {{ errors.name[0] }}
            </p>
          </div>
          <div>
            <p class="mb-2 text-sm text-gray-800">Cities</p>
            <v-select
              v-model="formData.city_id"
              class="style-chooser"
              :options="citylist ?? []"
              label="name"
              :clearable="false"
              :reduce="(city) => city.id"
              placeholder="Choose City"
            ></v-select>
          </div>
          <div class="mb-2 space-y-1">
            <label for="name" class="text-sm text-gray-800">Place</label>
            <input
              type="text"
              v-model="formData.place"
              id="name"
              class="w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.name" class="mt-1 text-sm text-red-600">
              {{ errors.place[0] }}
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
              type="text"
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
            <label for="name" class="text-sm text-gray-800"
              >Contract Due Date</label
            >
            <input
              v-model="formData.contract_due"
              type="date"
              class="w-full h-10 px-4 py-2 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-gray-300"
            />
            <!-- <p>{{ formData.contract_due }}</p> -->
          </div>
          <div class="mb-2 space-y-1">
            <label for="name" class="text-sm text-gray-800">Contracts</label>
            <input
              type="file"
              multiple
              @change="contract_file"
              id="name"
              class="w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.contracts" class="mt-1 text-sm text-red-600">
              {{ errors.contracts[0] }}
            </p>
          </div>
          <div class="mb-2 space-y-1" v-if="linkContract.length != 0">
            <p v-for="(a, index) in linkContract.contacts" :key="index">
              <a :href="a.file" target="_blink" class="text-sm text-red-500"
                >link</a
              >
            </p>
          </div>

          <div class="mb-2 space-y-1">
            <label for="description" class="text-sm text-gray-800"
              >Images</label
            >
            <input
              multiple
              type="file"
              name=""
              ref="imagesInput"
              id=""
              @change="handlerImagesFileChange"
              class="hidden w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
              accept="image/*"
            />
            <button
              class="text-sm text-blue-600 ml-4"
              @click.prevent="openFileImagePicker"
            >
              <i
                class="fa-solid fa-plus text-sm font-semibold px-2 py-1 bg-blue-600 rounded-full shadow text-white"
              ></i>
            </button>
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
              class="grid grid-cols-3 gap-2"
              v-if="editImagesPreview.length != 0 && imagesPreview.length == 0"
            >
              <div
                class="relative"
                v-for="(image, index) in editImagesPreview"
                :key="index"
              >
                <button
                  @click.prevent="removeImageUpdateImage(formData.id, image.id)"
                  class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
                >
                  <XCircleIcon class="w-8 h-8 font-semibold" />
                </button>
                <img class="h-auto w-full rounded" :src="image.image" alt="" />
              </div>
            </div>
          </div>
          <div class="text-end flex justify-end items-center">
            <p
              class="text-[#ff613c] cursor-pointer px-2 py-1.5 mr-2 rounded bg-transparent border border-[#ff613c]"
              @click="closeModal"
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
          placeholder="Search restaurants..."
        />

        <AdjustmentsHorizontalIcon
          class="inline-block w-6 h-6 mx-2 text-gray-600 cursor-pointer"
        />
      </div>
      <div class="space-x-3">
        <Button :leftIcon="ShareIcon" intent="text"> Export </Button>
        <Button :leftIcon="PlusIcon" @click.prevent="openCreate()">
          Create
        </Button>
      </div>
    </div>
    <div class="mb-5 overflow-auto rounded-lg shadow">
      <table class="w-full">
        <thead class="border-b-2 border-gray-200 bg-gray-50">
          <tr>
            <th class="w-20 p-3 text-xs font-medium tracking-wide text-left">
              No.
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              Name
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              City
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              Place
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left w-30">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            class="bg-white even:bg-gray-50 hover:bg-gray-50"
            v-for="(r, index) in restaurants?.data"
            :key="index"
          >
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ r.id }}
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ r.name }}
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ r.city?.name }}
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ r.place }}
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <button
                  @click.prevent="editModalOpenHandler(r)"
                  class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                >
                  <PencilSquareIcon class="w-5 h-5" />
                </button>
                <!-- v-if="authStore.isSuperAdmin" -->
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
    <Pagination v-if="!loading" :data="restaurants" @change-page="changePage" />
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
  XCircleIcon,
  UsersIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/vue/24/outline";
import Pagination from "../components/Pagination.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { onMounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import Modal from "../components/Modal.vue";
import { useCityStore } from "../stores/city";
import { useRestaurantStore } from "../stores/restaurant";
import { useAuthStore } from "../stores/auth";

const createModalOpen = ref(false);
const toast = useToast();
const cityStore = useCityStore();
const restaurantStore = useRestaurantStore();
const authStore = useAuthStore();

const { restaurants, loading } = storeToRefs(restaurantStore);

const search = ref("");
const errors = ref([]);

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

const { cities } = storeToRefs(cityStore);
const citylist = ref([]);

const formData = ref({
  id: "",
  name: "",
  city_id: null,
  payment_method: "",
  bank_name: "",
  bank_account_number: "",
  account_name: "",
  place: "",
  contract_due: "",
  contracts: [],
  images: [],
});

const editImagesPreview = ref([]);
const imagesPreview = ref([]);
const imagesInput = ref(null);

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
  console.log(imagesPreview.value);
};

const closeModal = () => {
  formData.value = {
    id: "",
    name: "",
    city_id: null,
    payment_method: "",
    bank_name: "",
    bank_account_number: "",
    account_name: "",
    place: "",
    contract_due: "",
    contracts: [],
    images: [],
  };

  editImagesPreview.value = [];
  imagesPreview.value = [];
  createModalOpen.value = false;
};

const addNewHandler = async () => {
  console.log(loading.value);
  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("city_id", formData.value.city_id);
  frmData.append("account_name", formData.value.account_name);
  frmData.append("place", formData.value.place);
  frmData.append("payment_method", formData.value.payment_method);
  frmData.append("bank_name", formData.value.bank_name);
  frmData.append("bank_account_number", formData.value.bank_account_number);
  frmData.append("contract_due", formData.value.contract_due);
  if (formData.value.images.length > 0) {
    for (let i = 0; i < formData.value.images.length; i++) {
      let file = formData.value.images[i];
      frmData.append("images[" + i + "]", file);
    }
  }
  console.log(formData.value.contracts);
  if (formData.value.contracts) {
    // frmData.append("contracts", formData.value.contracts);
    for (let i = 0; i < formData.value.contracts.length; i++) {
      let file = formData.value.contracts[i];
      frmData.append("contracts[" + i + "]", file);
    }
  }

  console.log(
    formData.value.bank_account_number,
    "this is bank account number"
  );

  try {
    const response = await restaurantStore.addNewAction(frmData);
    console.log(loading.value);
    formData.value = {
      name: "",
      city_id: null,
      payment_method: "",
      bank_name: "",
      account_name: "",
      bank_account_number: "",
      place: "",
      contract_due: "",
      images: [],
      contracts: [],
    };
    errors.value = null;
    imagesPreview.value = [];
    editImagesPreview.value = [];
    createModalOpen.value = false;
    await restaurantStore.getListAction();
    toast.success(response.message);
  } catch (error) {
    if (error.response.data.errors) {
      errors.value = error.response.data.errors;
    }
    toast.error(error.response.data.message, {
      maxToasts: 1,
    });
    setTimeout(async () => {
      await restaurantStore.toggleLoading();
    }, 5000);
  }
};

const openCreate = () => {
  formData.value.name = "";
  formData.value.city_id = null;
  formData.value.payment_method = "";
  formData.value.bank_name = "";
  formData.value.account_name = "";
  formData.value.bank_account_number = "";
  formData.value.place = "";
  formData.value.contract_due = "";
  formData.value.contracts = [];
  linkContract.value = {};
  imagesPreview.value = [];
  editImagesPreview.value = [];
  createModalOpen.value = true;
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
  frmData.append("place", formData.value.place);
  frmData.append("city_id", formData.value.city_id);
  frmData.append("payment_method", formData.value.payment_method);
  frmData.append("bank_name", formData.value.bank_name);
  frmData.append("bank_account_number", formData.value.bank_account_number);
  frmData.append("account_name", formData.value.account_name);
  frmData.append("contract_due", formData.value.contract_due);
  if (formData.value.contracts) {
    // frmData.append("contracts", formData.value.contracts);
    for (let i = 0; i < formData.value.contracts.length; i++) {
      let file = formData.value.contracts[i];
      frmData.append("contracts[" + i + "]", file);
    }
  }
  if (formData.value.images.length > 0) {
    for (let i = 0; i < formData.value.images.length; i++) {
      let file = formData.value.images[i];
      frmData.append("images[" + i + "]", file);
    }
  }

  frmData.append("_method", "PUT");
  try {
    const response = await restaurantStore.updateAction(
      frmData,
      formData.value.id
    );
    formData.value = {
      name: "",
      city_id: null,
      place: "",
      id: "",
      payment_method: "",
      bank_name: "",
      bank_account_number: "",
      account_name: "",
      contract_due: "",
      contracts: [],
      images: [],
    };
    errors.value = null;
    imagesPreview.value = [];
    editImagesPreview.value = [];
    createModalOpen.value = false;
    await restaurantStore.getListAction();
    toast.success(response.message);
  } catch (error) {
    if (error.response.data.errors) {
      errors.value = error.response.data.errors;
    }
    toast.error(error.response.data.message);
    setTimeout(async () => {
      await restaurantStore.toggleLoading();
    }, 5000);
  }
};

const onSubmitHandler = async () => {
  if (formData.value.id) {
    updateHandler();
  } else {
    addNewHandler();
  }
};

const formatDate = (getDate) => {
  const dateParts = getDate.split(" ");
  return dateParts[0];
};

const linkContract = ref({});
const editModalOpenHandler = (data) => {
  formData.value.id = data.id;
  formData.value.name = data.name;
  formData.value.city_id = data.city.id;
  formData.value.place = data.place;
  formData.value.contract_due = formatDate(data.contract_due);
  formData.value.bank_account_number = data.bank_account_number;
  formData.value.account_name = data.account_name;
  formData.value.payment_method = data.payment_method;
  formData.value.bank_name = data.bank_name;
  formData.value.contracts = [];
  console.log(formData.value.contract_due);
  linkContract.value = data;
  console.log(data, "this is file");
  if (data.images.length > 0) {
    for (let i = 0; i < data.images.length; i++) {
      editImagesPreview.value.push(data.images[i]);
    }
  }
  createModalOpen.value = true;
};

const changePage = async (url) => {
  console.log(url);
  let data = {
    search: search.value,
  };
  await restaurantStore.getChangePage(url, data);
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
        const response = await restaurantStore.deleteAction(id);
        toast.success(response.message);
      } catch (error) {
        if (error.response.data.errors) {
          errors.value = error.response.data.errors;
        }
        toast.error(error.response.data.message);
      }
      await restaurantStore.getListAction();
    }
  });
};

const removeImageUpdateImage = async (id, imageID) => {
  const res = restaurantStore.deleteImageAction(id, imageID);
  console.log(res, "delete image res");
  toast.success("delete image success");
  closeModal();
  await restaurantStore.getListAction({ search: search.value });
};

onMounted(async () => {
  await restaurantStore.getListAction();
  await cityStore.getSimpleListAction();
  citylist.value = cities.value.data;
});

watch(search, async (newValue) => {
  await restaurantStore.getListAction({ search: search.value });
});
</script>
