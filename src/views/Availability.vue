<script setup>
import Layout from "./Layout.vue";
import Input from "../components/Input.vue";
import VselectVue from "../components/Vselect.vue";
import InputField from "../components/InputField.vue";
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
  ExclamationTriangleIcon,
  MinusIcon,
  CheckBadgeIcon,
  XMarkIcon,
  XCircleIcon,
  CheckIcon,
  UsersIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/vue/24/outline";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import { computed, onMounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";
import AvailabilyListVue from "../components/AvailabilyList.vue";
import Modal from "../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useHotelStore } from "../stores/hotel";
import { useEntranceStore } from "../stores/entrance";
import { useRoomStore } from "../stores/room";
import { useVariationStore } from "../stores/variations";
import { useAvailableStore } from "../stores/available";
// import { PlusIcon, XCircleIcon, CheckBadgeIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const hotelStore = useHotelStore();
const entranceStore = useEntranceStore();
const authStore = useAuthStore();
const roomStore = useRoomStore();
const variationStore = useVariationStore();
const availableStore = useAvailableStore();
const { availables, loading } = storeToRefs(availableStore);
const toast = useToast();

const searchModal = ref(false);
const formModal = ref(false);

const Product_type = [
  {
    id: 1,
    name: "hotel",
  },
  {
    id: 2,
    name: "entrance_ticket",
  },
];

const formData = ref({
  product_type: "",
  product_id: "",
  variation: [],
});

const product_variation = ref({
  variation_id: "",
  quantity: "",
  checkin_date: "",
  checkout_date: "",
  date: "",
  status: "",
});
const errors = ref(null);

const dateFormat = (inputDateString) => {
  if (inputDateString != null) {
    const inputDate = new Date(inputDateString);

    // Get the year, month, and day components
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
    const day = String(inputDate.getDate()).padStart(2, "0");

    // Format the date in "YYYY-MM-DD" format
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  } else {
    return null;
  }
};

const addItem = () => {
  let data = {
    variation_id: product_variation.value.variation_id.id,
    variation_name: product_variation.value.variation_id.name,
    quantity: product_variation.value.quantity,
    checkin_date: dateFormat(product_variation.value.checkin_date),
    checkout_date: dateFormat(product_variation.value.checkout_date),
    date: dateFormat(product_variation.value.date),
    status: "pending",
  };
  formData.value.variation.push(data);
  console.log(formData.value.variation);
  product_variation.value = {
    variation_id: "",
    quantity: "",
    checkin_date: "",
    checkout_date: "",
    date: "",
    status: "",
  };
};

const removeItem = (index) => {
  formData.value.variation.splice(index, 1);
};

const closeFunction = () => {
  formData.value = {
    product_type: "",
    product_id: "",
    variation: [],
  };
  product_variation.value = {
    variation_id: "",
    quantity: "",
    checkin_date: "",
    checkout_date: "",
    date: "",
    status: "",
  };
  formModal.value = false;
};

const productNameArray = ref([]);
const chooseTypeAction = async () => {
  console.log(formData.value.product_type);
  if (formData.value.product_type == "hotel") {
    const res = await hotelStore.getSimpleListAction();
    productNameArray.value = res.result.data;
    // console.log(res, "this is hotel");
  } else if (formData.value.product_type == "entrance_ticket") {
    const res = await entranceStore.getSimpleListAction();
    // console.log(res, "this is entrance");
    productNameArray.value = res.result.data;
  }
  if (product_type.value == "hotel") {
    const res = await hotelStore.getSimpleListAction();
    productNameArray.value = res.result.data;
    // console.log(res, "this is hotel");
  } else if (product_type.value == "entrance_ticket") {
    const res = await entranceStore.getSimpleListAction();
    // console.log(res, "this is entrance");
    productNameArray.value = res.result.data;
  }
};

const productVariationArray = ref([]);
const chooseNameAction = async () => {
  console.log(formData.value.product_id, "this is product");
  if (formData.value.product_id && formData.value.product_type == "hotel") {
    const res = await roomStore.getSimpleListAction({
      hotel_id: formData.value.product_id,
    });
    // console.log(res, "this is room");
    productVariationArray.value = res.result.data;
  } else if (
    formData.value.product_id &&
    formData.value.product_type == "entrance_ticket"
  ) {
    const res = await variationStore.getSimpleListAction({
      entrance_ticket_id: formData.value.product_id,
    });
    // console.log(res, "this is entr");
    productVariationArray.value = res.result.data;
  }
  if (product_id.value && product_type.value == "hotel") {
    const res = await roomStore.getSimpleListAction({
      hotel_id: product_id.value,
    });
    // console.log(res, "this is room");
    productVariationArray.value = res.result.data;
  } else if (product_id.value && product_type.value == "entrance_ticket") {
    const res = await variationStore.getSimpleListAction({
      entrance_ticket_id: product_id.value,
    });
    // console.log(res, "this is entr");
    productVariationArray.value = res.result.data;
  }
};

const createHandler = async () => {
  // console.log(formData.value);
  const frmData = new FormData();
  frmData.append("product_type", formData.value.product_type);
  frmData.append("product_id", formData.value.product_id);
  for (let i = 0; i < formData.value.variation.length; i++) {
    frmData.append(
      "variations[" + i + "][variable_id]",
      formData.value.variation[i].variation_id
    );
    frmData.append(
      "variations[" + i + "][quantity]",
      formData.value.variation[i].quantity
    );
    if (formData.value.product_type == "hotel") {
      frmData.append(
        "variations[" + i + "][checkin_date]",
        formData.value.variation[i].checkin_date
      );
      frmData.append(
        "variations[" + i + "][checkout_date]",
        formData.value.variation[i].checkout_date
      );
    } else if (formData.value.product_type == "entrance_ticket") {
      frmData.append(
        "variations[" + i + "][date]",
        formData.value.variation[i].date
      );
    }
    frmData.append(
      "variations[" + i + "][status]",
      formData.value.variation[i].status
    );
  }
  const res = await availableStore.addNewAction(frmData);
  console.log(res);
  if (res.result) {
    toast.success(res.message);
    closeFunction();
  }
};

const changePage = async (url) => {
  await availableStore.getChangePage(url);
};

const updateAction = async (action, id, quantity) => {
  console.log(action);
  const frmData = new FormData();
  frmData.append("_method", "PUT");
  frmData.append("status", action);
  frmData.append("quantity", quantity);
  const res = await availableStore.updateAction(frmData, id);
  console.log(res);
  toast.success("Success Changed !!");
  await availableStore.getListAction(watchSystem.value);
};

const deleteAction = async (id) => {
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
        const res = await availableStore.deleteAction(id);
        console.log(res);
        if (res.result) {
          toast.success("deleted successfully");
          await availableStore.getListAction(watchSystem.value);
        }
      } catch (error) {
        if (error.response.data.errors) {
          errors.value = error.response.data.errors;
        }
        toast.error(error.response.data.message);
      }
      await availableStore.getListAction(watchSystem.value);
    }
  });
};

// const searchData = ref({
//   product_type: "hotel",
//   product_id: "",
//   variation_id: "",
//   daterange: "",
//   date: "",
// });
const product_type = ref("hotel");
const product_id = ref("");
const variation_id = ref("");
const daterange = ref("");
const date = ref("");

const watchSystem = computed(() => {
  let result = {};
  if (product_type.value != "") {
    result.product_type = product_type.value;
  }
  if (product_id.value != "") {
    result.product_id = product_id.value;
  }
  if (variation_id.value != "") {
    result.variation_id = variation_id.value;
  }
  if (daterange.value != "") {
    result.daterange = daterange.value;
  }
  if (date.value != "") {
    result.date = date.value;
  }
  return result;
});

watch(product_type, async (newValue) => {
  await availableStore.getListAction(watchSystem.value);
});

const closeSearchAction = () => {
  product_type.value = "";
  product_id.value = "";
  variation_id.value = "";
  daterange.value = "";
  date.value = "";
  searchModal.value = false;
};

const openSearchModal = () => {
  product_type.value = "";
  product_id.value = "";
  variation_id.value = "";
  daterange.value = "";
  date.value = "";
  searchModal.value = true;
};

const searchActionHandler = async () => {
  // console.log(
  //   product_type.value,
  //   product_id.value,
  //   variation_id.value,
  //   daterange.value,
  //   date.value
  // );

  searchModal.value = false;
  if (daterange.value != "" && date.value == "") {
    daterange.value = `${dateFormat(daterange.value[0])} , ${dateFormat(
      daterange.value[1]
    )}`;
  }
  if (date.value != "" && daterange.value == "") {
    date.value = dateFormat(date.value);
  }
  await availableStore.getListAction(watchSystem.value);
};

onMounted(async () => {
  await availableStore.getListAction(watchSystem.value);
  console.log(availables.value, "this is list");
});
</script>

<template>
  <Layout>
    <div class="mb-5 flex items-center justify-between">
      <h3 class="text-2xl font-medium text-gray-600">Availabilities</h3>
      <div class="space-x-3">
        <Button :leftIcon="PlusIcon" @click="formModal = true">
          Create Question
        </Button>
      </div>
    </div>
    <div class="bg-white/60 p-6 rounded-lg shadow-sm mb-5">
      <!-- search input sort filter -->
      <div class="mb-5 flex justify-between items-center">
        <div class="flex items-center justify-start gap-2 space-x-2">
          <p
            class="text-xs px-4 cursor-pointer hover:bg-[#ff613c] hover:text-white hover:shadow-md py-2 border border-gray-400 rounded"
            @click="product_type = 'hotel'"
            :class="product_type == 'hotel' ? 'bg-[#ff613c] text-white' : ''"
          >
            Hotels
          </p>
          <p
            class="text-xs px-4 cursor-pointer hover:bg-[#ff613c] hover:text-white hover:shadow-md py-2 border border-gray-400 rounded"
            @click="product_type = 'entrance_ticket'"
            :class="
              product_type == 'entrance_ticket' ? 'bg-[#ff613c] text-white' : ''
            "
          >
            Attractions
          </p>
        </div>
        <div class="flex justify-end items-center">
          <div
            class="bg-white rounded-full p-2 border border-gray-400"
            @click="openSearchModal"
          >
            <AdjustmentsHorizontalIcon class="w-6 h-6" />
          </div>
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
                Product Type
              </th>
              <th
                class="p-3 text-xs font-medium tracking-wide text-left max-w-[300px]"
              >
                Product Name
              </th>
              <th
                class="p-3 text-xs font-medium tracking-wide text-left max-w-[300px]"
              >
                Variation Name
              </th>
              <th class="p-3 text-xs font-medium tracking-wide text-left">
                Quantity
              </th>
              <th class="p-3 text-xs font-medium tracking-wide text-left">
                Date
              </th>
              <th class="p-3 text-xs font-medium tracking-wide text-left">
                Status
              </th>
              <th class="p-3 text-xs font-medium tracking-wide text-left w-30">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800" v-if="!loading">
            <tr
              class="text-white"
              v-for="r in availables?.data"
              :key="r.id"
              :class="{
                'bg-yellow-100': r.status == 'pending',
                'bg-red-100': r.status == 'unavailable',
                'bg-green-100': r.status == 'available',
              }"
            >
              <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
                {{ r.id }}
              </td>
              <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
                {{
                  r.ownerable_type == "App\\Models\\Hotel"
                    ? "Hotel"
                    : "Entrance Ticket"
                }}
              </td>
              <td class="p-3 text-xs text-gray-700 whitespace-wrap">
                {{ r.ownerable?.name }}
              </td>
              <td class="p-3 text-xs text-gray-700 whitespace-wrap">
                {{ r.variable?.name }}
              </td>

              <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
                {{ r.quantity }}
              </td>
              <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
                <p v-if="!r.date">
                  {{ r.checkin_date }} - {{ r.checkout_date }}
                </p>
                <p v-if="r.date">{{ r.date }}</p>
              </td>
              <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
                <p
                  class="px-2 py-1 text-center rounded-full flex justify-start items-center gap-3"
                >
                  <ExclamationTriangleIcon
                    class="w-5 h-5"
                    v-if="r.status == 'pending'"
                  />
                  <CheckBadgeIcon
                    class="w-5 h-5"
                    v-if="r.status == 'available'"
                  />
                  <XCircleIcon
                    class="w-5 h-5"
                    v-if="r.status == 'unavailable'"
                  />

                  {{ r.status }}
                </p>
              </td>
              <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <button
                    v-if="authStore.isReservation || authStore.isSuperAdmin"
                    @click.prevent="updateAction('pending', r.id, r.quantity)"
                    class="hover:bg-yellow-500 p-2 bg-white text-blue-500 transition shadow rounded hover:text-white"
                  >
                    <ExclamationTriangleIcon class="w-5 h-5" />
                  </button>
                  <button
                    v-if="authStore.isReservation || authStore.isSuperAdmin"
                    @click.prevent="updateAction('available', r.id, r.quantity)"
                    class="hover:bg-green-500 p-2 bg-white text-blue-500 transition shadow rounded hover:text-white"
                  >
                    <CheckIcon class="w-5 h-5" />
                  </button>
                  <button
                    v-if="authStore.isReservation || authStore.isSuperAdmin"
                    @click.prevent="
                      updateAction('unavailable', r.id, r.quantity)
                    "
                    class="hover:bg-red-500 p-2 bg-white text-blue-500 transition shadow rounded hover:text-white"
                  >
                    <XMarkIcon class="w-5 h-5" />
                  </button>
                  <button
                    v-if="!authStore.isReservation && !authStore.isSuperAdmin"
                    class="flex justify-center items-center p-2 text-red-500 transition shadow rounded"
                  >
                    <XMarkIcon class="w-5 h-5 mr-2" /> No Permission
                  </button>
                  <button
                    v-if="authStore.isSuperAdmin"
                    @click.prevent="deleteAction(r.id)"
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
      <Pagination
        v-if="!loading"
        :data="availables"
        @change-page="changePage"
      />
      <Modal :isOpen="searchModal" @closeModal="closeSearchAction">
        <DialogPanel
          class="w-full max-w-lg transform rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
        >
          <DialogTitle
            as="h3"
            class="text-lg font-medium leading-6 text-gray-900 mb-5"
          >
            Search
          </DialogTitle>
          <div class="space-y-3">
            <div class="">
              <p class="text-gray-800 text-xs mb-2">Type</p>
              <v-select
                v-model="product_type"
                class="style-chooser w-full"
                :options="Product_type ?? []"
                @option:selected="chooseTypeAction"
                label="name"
                :clearable="true"
                :reduce="(d) => d.name"
                placeholder="Choose product type"
              ></v-select>
              <p v-if="errors?.product_type" class="mt-1 text-xs text-red-600">
                {{ errors.product_type[0] }}
              </p>
            </div>
            <div class="">
              <p class="text-gray-800 text-xs mb-2">Product Name</p>
              <v-select
                v-model="product_id"
                class="style-chooser w-full"
                :options="productNameArray ?? []"
                @option:selected="chooseNameAction"
                label="name"
                :clearable="true"
                :reduce="(d) => d.id"
                placeholder="Choose product"
              ></v-select>
              <p v-if="errors?.product_type" class="mt-1 text-xs text-red-600">
                {{ errors.product_type[0] }}
              </p>
            </div>
            <div class="">
              <p class="text-gray-800 text-xs mb-2">Product Variation</p>
              <v-select
                v-model="variation_id"
                class="style-chooser w-full"
                :options="productVariationArray ?? []"
                label="name"
                :clearable="true"
                :reduce="(d) => d.id"
                placeholder="Choose variation"
              ></v-select>
            </div>
            <div class="" v-if="product_type == 'hotel'">
              <p class="text-gray-800 text-xs mb-2">Date Range</p>
              <VueDatePicker
                v-model="daterange"
                :format="'yyyy-MM-dd'"
                range
                placeholder="Choose date range"
              />
            </div>
            <div class="" v-if="product_type != 'hotel'">
              <p class="text-gray-800 text-xs mb-2">Date</p>
              <VueDatePicker
                v-model="date"
                :format="'yyyy-MM-dd'"
                placeholder="Choose date"
              />
            </div>
            <div class="grid grid-cols-2 gap-6 pt-4">
              <p
                @click="closeSearchAction"
                class="bg-white text-[#ff613c] border border-[#ff613c] px-2 py-2 rounded-md flex justify-center items-center gap-2"
              >
                <XCircleIcon class="w-6 h-6" />Clean & Close
              </p>
              <p
                @click="searchActionHandler"
                class="bg-[#ff613c] text-white border border-[#ff613c] px-2 py-2 rounded-md flex justify-center items-center gap-2"
              >
                <CheckBadgeIcon class="w-6 h-6" />Search
              </p>
            </div>
          </div>
        </DialogPanel>
      </Modal>
      <!-- formModal -->
      <Modal :isOpen="formModal" @closeModal="formModal = false">
        <DialogPanel
          class="w-full max-w-5xl transform rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
        >
          <DialogTitle
            as="h3"
            class="text-lg font-medium leading-6 text-gray-900 mb-5"
          >
            Create Form
          </DialogTitle>
          <form action="" class="gap-4 grid grid-cols-2">
            <div class="">
              <p class="text-gray-800 text-xs mb-2">Type</p>
              <v-select
                v-model="formData.product_type"
                class="style-chooser w-full"
                :options="Product_type ?? []"
                @option:selected="chooseTypeAction"
                label="name"
                :clearable="true"
                :reduce="(d) => d.name"
                placeholder="Choose product type"
              ></v-select>
              <p v-if="errors?.product_type" class="mt-1 text-xs text-red-600">
                {{ errors.product_type[0] }}
              </p>
            </div>
            <div class="">
              <p class="text-gray-800 text-xs mb-2">Product Name</p>
              <v-select
                v-model="formData.product_id"
                class="style-chooser w-full"
                :options="productNameArray ?? []"
                @option:selected="chooseNameAction"
                label="name"
                :clearable="true"
                :reduce="(d) => d.id"
                placeholder="Choose product"
              ></v-select>
              <p v-if="errors?.product_type" class="mt-1 text-xs text-red-600">
                {{ errors.product_type[0] }}
              </p>
            </div>
            <div class="col-span-2 space-y-2">
              <div class="grid grid-cols-9 gap-2">
                <div class="col-span-3">
                  <p class="text-gray-800 text-xs mb-2">Product Variation</p>
                  <v-select
                    v-model="product_variation.variation_id"
                    class="style-chooser w-full"
                    :options="productVariationArray ?? []"
                    label="name"
                    :clearable="true"
                    :reduce="(d) => d"
                    placeholder="Choose variation"
                  ></v-select>
                </div>
                <div class="col-span-2" v-if="formData.product_type == 'hotel'">
                  <p class="text-gray-800 text-xs mb-2">Checkin Date</p>
                  <VueDatePicker
                    v-model="product_variation.checkin_date"
                    :format="'yyyy-MM-dd'"
                    placeholder="checkin date"
                  />
                </div>
                <div class="col-span-2" v-if="formData.product_type == 'hotel'">
                  <p class="text-gray-800 text-xs mb-2">Checkout Date</p>
                  <VueDatePicker
                    v-model="product_variation.checkout_date"
                    :format="'yyyy-MM-dd'"
                    placeholder="checkout date"
                  />
                </div>
                <div class="col-span-2" v-if="formData.product_type != 'hotel'">
                  <p class="text-gray-800 text-xs mb-2">Date</p>
                  <VueDatePicker
                    v-model="product_variation.date"
                    :format="'yyyy-MM-dd'"
                    placeholder="choose date"
                  />
                </div>
                <div class="">
                  <p class="text-gray-800 text-xs mb-2 w-full">Quantity</p>
                  <input
                    type="number"
                    v-model="product_variation.quantity"
                    name=""
                    class="px-4 w-full py-1.5 rounded border border-gray-400 focus:outline-none"
                    id=""
                  />
                </div>
                <div class="">
                  <p class="text-gray-800 text-xs mb-2">Action</p>
                  <p
                    class="bg-[#ff613c] text-white px-2 py-2 w-full rounded-md flex justify-center items-center gap-2"
                    @click="addItem"
                  >
                    <PlusIcon class="w-4 h-4" />Add
                  </p>
                </div>
              </div>
              <div
                class="text-gray-800 text-xs mb-2 flex justify-between items-center"
              >
                <p>Variations</p>
              </div>
              <div
                class="grid grid-cols-4 gap-0 text-xs px-4 py-2 bg-gray-100 hover:bg-gray-100"
              >
                <p class="flex justify-start items-center">Product Variation</p>
                <p class="flex justify-start items-center">Date</p>
                <p class="flex justify-start items-center">Quantities</p>
              </div>
              <div
                v-for="(i, index) in formData.variation"
                :key="index"
                class="grid grid-cols-4 gap-0 text-xs px-4 py-3 bg-yellow-100 hover:bg-gray-100"
              >
                <p class="flex justify-start items-center">
                  {{ i.variation_name }}
                </p>
                <p
                  class="flex justify-start items-center"
                  v-if="formData.product_type != 'hotel'"
                >
                  {{ i.date }}
                </p>
                <p
                  class="flex justify-start items-center"
                  v-if="formData.product_type == 'hotel'"
                >
                  {{ i.checkin_date }} -- {{ i.checkout_date }}
                </p>
                <p class="flex justify-start items-center">{{ i.quantity }}</p>
                <div class="flex items-center justify-end gap-6">
                  <p class="flex justify-center items-center">
                    <ExclamationTriangleIcon class="w-5 h-5 mr-4" /> Pending
                  </p>
                  <p
                    @click="removeItem(index)"
                    class="bg-white text-[#ff613c] border border-[#ff613c] px-2 py-2 rounded-md flex justify-center items-center gap-2"
                  >
                    <MinusIcon class="w-4 h-4" />Remove
                  </p>
                </div>
              </div>
              <div class="flex justify-end items-center space-x-4 pt-6">
                <p
                  @click="closeFunction"
                  class="bg-white text-[#ff613c] border border-[#ff613c] px-2 py-2 rounded-md flex justify-center items-center gap-2"
                >
                  <MinusIcon class="w-4 h-4" />Close & Clean Data
                </p>
                <p
                  @click="createHandler"
                  class="bg-[#ff613c] text-white px-2 py-2 rounded-md flex justify-center items-center gap-2"
                >
                  <PlusIcon class="w-4 h-4" />Create New Availabily
                </p>
              </div>
            </div>
          </form>
        </DialogPanel>
      </Modal>
    </div>
  </Layout>
</template>
