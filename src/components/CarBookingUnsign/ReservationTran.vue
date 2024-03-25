<script setup>
import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";
import { TrashIcon, XCircleIcon } from "@heroicons/vue/24/outline";
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import Modal from "../Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import Button from "../Button.vue";
import { useSupplierStore } from "../../stores/supplier";
import { storeToRefs } from "pinia";
import ReservationSelectVue from "../ReservationSelect.vue";
import { useReservationStore } from "../../stores/reservation";
import { useReservationTransactionStore } from "../../stores/resertran";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import Pagination from "../Pagination.vue";
import { useAuthStore } from "../../stores/auth";
import Swal from "sweetalert2";

const daterange = ref("");
const router = useRouter();
const toast = useToast();
const reservationStore = useReservationStore();
const supplierStore = useSupplierStore();
const { suppliers } = storeToRefs(supplierStore);
const authStore = useAuthStore();
const { reservation } = storeToRefs(reservationStore);
const reservationTransactionStore = useReservationTransactionStore();
const { reservationTransactions, loading } = storeToRefs(
  reservationTransactionStore
);

const presetDates = ref([
  { label: "Today", value: [new Date(), new Date()] },
  {
    label: "Today (Slot)",
    value: [new Date(), new Date()],
    slot: "preset-date-range-button",
  },
  {
    label: "This month",
    value: [startOfMonth(new Date()), endOfMonth(new Date())],
  },
  {
    label: "Last month",
    value: [
      startOfMonth(subMonths(new Date(), 1)),
      endOfMonth(subMonths(new Date(), 1)),
    ],
  },
  {
    label: "This year",
    value: [startOfYear(new Date()), endOfYear(new Date())],
  },
]);

const openModel = ref(false);

const closeModel = () => {
  openModel.value = false;
};

const formData = ref({
  vendor: "",
  datetime: "",
  total_paid: "",
  notes: "",
  crm_ids: [],
  payment_slips: [],
});

const props = defineProps({
  vendor: Number,
});

const page = ref(1);
const handleChildData = (data) => {
  page.value = data;
};
const searchI = ref("");
const handleSearchData = (data) => {
  searchI.value = data;
  console.log(data);
};
const handleSelected = (data) => {
  formData.value.crm_ids = data;
  console.log(data, "this is selected");
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
      formData.value.payment_slips.push(selectedFile[index]);
      imagesPreview.value.push(URL.createObjectURL(selectedFile[index]));
    }
  }
};
const removeImageSelectImage = (index) => {
  formData.value.payment_slips.splice(index, 1);
  imagesPreview.value.splice(index, 1);
};

watch(searchI, async (newValue) => {
  await reservationStore.getSimpleListAction({
    limit: 20,
    page: page.value,
    crm_id: searchI.value,
    search: "App\\Models\\PrivateVanTour",
  });
});
watch(page, async (newValue) => {
  await reservationStore.getSimpleListAction({
    limit: 20,
    page: page.value,
    search: "App\\Models\\PrivateVanTour",
  });
});
watch(daterange, async (newValue) => {
  await getList();
});

watchEffect(async () => {
  if (props.vendor) {
    formData.value.vendor = props.vendor;
    await getList();
  }
}, props);

const formatDate = (datechange) => {
  const date = new Date(datechange);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const getList = async () => {
  let data = {
    daterange: `${formatDate(daterange.value[0])},${formatDate(
      daterange.value[1]
    )}`,
    supplier_id: props.vendor,
  };
  // console.log(data, "this is getlist");
  const res = await reservationTransactionStore.getListAction(data);
  console.log(reservationTransactions.value, "this is getlist");
};

const changePage = async (url) => {
  let data = {
    daterange: `${formatDate(daterange.value[0])},${formatDate(
      daterange.value[1]
    )}`,
    supplier_id: props.vendor,
  };
  const res = await reservationTransactionStore.getListAction(url, data);
};

const errors = ref(null);
const onSubmitHandler = async () => {
  const frmData = new FormData();
  frmData.append("supplier_id", formData.value.vendor);
  frmData.append("datetime", formatDate(formData.value.datetime));
  frmData.append("total_paid", formData.value.total_paid);
  frmData.append("notes", formData.value.notes);
  if (formData.value.crm_ids.length > 0) {
    for (let i = 0; i < formData.value.crm_ids.length; i++) {
      frmData.append("crm_ids[" + i + "]", formData.value.crm_ids[i]);
    }
  }
  if (formData.value.payment_slips.length > 0) {
    for (let i = 0; i < formData.value.payment_slips.length; i++) {
      frmData.append(
        "payment_slips[" + i + "]",
        formData.value.payment_slips[i]
      );
    }
  }
  console.log(frmData);
  try {
    const res = await reservationTransactionStore.addNewAction(frmData);
    await getList();
    console.log(res, "this is submit");
    if ((res.status = "Request was successful.")) {
      toast.success(res.message);
      errors.value = null;
      emit("change", "updated");
    }
  } catch (error) {
    if (error.response.data.errors) {
      errors.value = error.response.data.errors;
      console.log(errors.value, "this is error");
    }
    toast.error(error.message);
  }
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
      console.log("delete");
    }
  });
};

onMounted(async () => {
  daterange.value = [startOfMonth(new Date()), endOfMonth(new Date())];
  getList();
  await supplierStore.getSimpleListAction();
  await reservationStore.getSimpleListAction({
    limit: 20,
    page: page.value,
    search: "App\\Models\\PrivateVanTour",
  });
  console.log(reservation.value, "this is value");
});
</script>

<template>
  <div>
    <!-- filter -->
    <div class="flex col-span-3 items-center justify-between py-3">
      <p class="text-md font-semibold tracking-wider mr-4"></p>
      <div class="flex justify-end items-center gap-2">
        <div
          class="bg-[#FF5B00] text-white px-4 py-1.5 rounded-md cursor-pointer"
          @click="openModel = true"
        >
          create
        </div>
        <div class="w-[400px]">
          <VueDatePicker
            v-model="daterange"
            range
            :preset-dates="presetDates"
            placeholder="select date range"
          >
            <template #preset-date-range-button="{ label, value, presetDate }">
              <span
                role="button"
                :tabindex="0"
                @click="presetDate(value)"
                @keyup.enter.prevent="presetDate(value)"
                @keyup.space.prevent="presetDate(value)"
              >
                {{ label }}
              </span>
            </template>
          </VueDatePicker>
        </div>
      </div>
    </div>

    <!-- table -->
    <div class="space-y-4 pt-2">
      <div class="overflow-auto rounded-lg shadow mb-5" v-if="!loading">
        <table class="w-full">
          <thead class="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th class="px-4 py-2 text-xs font-medium tracking-wide text-left">
                Date
              </th>
              <th class="px-4 py-2 text-xs font-medium tracking-wide text-left">
                Vendor
              </th>
              <th
                class="px-4 py-2 text-xs font-medium overflow-hidden tracking-wide text-left"
              >
                Total Paid
              </th>
              <th class="px-4 py-2 text-xs font-medium tracking-wide text-left">
                Note
              </th>
              <th class="px-4 py-2 text-xs font-medium tracking-wide text-left">
                Payment Slipping
              </th>
              <th class="px-4 py-2 text-xs font-medium tracking-wide text-left">
                Reservations
              </th>

              <th
                class="px-4 py-2 text-xs font-medium tracking-wide text-left"
              ></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              class="bg-white even:bg-gray-50 hover:bg-gray-50"
              v-for="res in reservationTransactions?.data"
              :key="res.id"
            >
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                {{ res.datetime }}
              </td>
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                {{ res.supplier_name }}
              </td>
              <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                {{ res.total_paid }}
              </td>
              <td class="p-4 text-xs text-gray-700 max-w-[200px]">
                {{ res.notes }}
              </td>
              <td class="p-4 text-xs text-gray-700 max-w-[200px]">
                <p
                  v-for="l in res.payment_slips"
                  :key="l"
                  class="inline-block px-2 mr-1.5 py-1 bg-orange-500 text-white rounded-md"
                >
                  <a :href="l" target="_blink">link</a>
                </p>
              </td>
              <td class="p-4 text-xs text-gray-700 max-w-[200px]">
                <p
                  v-for="(r, index) in res.reservation_ids"
                  :key="index"
                  class="inline-block px-2 mr-1.5 py-1 bg-orange-500 text-white rounded-md"
                >
                  <span
                    class="cursor-pointer"
                    @click="
                      router.push({
                        name: 'reservation-update',
                        params: {
                          id: r,
                          crm: res.crm_ids[index],
                        },
                      })
                    "
                    >{{ res.crm_ids[index] }}</span
                  >
                </p>
              </td>
              <td
                class="p-4 text-xs text-gray-700 whitespace-nowrap flex justify-center items-center gap-4"
              >
                <TrashIcon
                  @click="onDeleteHandler(res.id)"
                  class="w-5 h-5 cursor-pointer"
                  v-if="authStore.isSuperAdmin"
                />
              </td>
            </tr>
            <tr class="" v-if="reservationTransactions?.data.length == 0">
              <td colspan="10 " class="text-center py-5">
                Ohh ! there isn't data !
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-4">
        <Pagination
          v-if="!loading"
          :data="reservationTransactions"
          @change-page="changePage"
        />
      </div>
      <Modal :isOpen="openModel" @closeModal="closeModel">
        <DialogPanel
          class="w-full max-w-xl transform rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
        >
          <DialogTitle
            as="h3"
            class="text-lg font-semibold leading-6 text-[#FF5B00] mb-5"
          >
            Create a Transcation
          </DialogTitle>
          <form
            @submit.prevent="onSubmitHandler"
            class="mt-2 grid grid-cols-2 gap-4 relative"
          >
            <div class="space-y-1">
              <label for="name" class="text-gray-800 text-xs"
                >Date Time<span class="text-red-600 text-base pl-2"
                  >*</span
                ></label
              >
              <VueDatePicker
                v-model="formData.datetime"
                placeholder="Y M D , H:m:s"
              />
              <p v-if="errors?.datetime" class="mt-1 text-sm text-red-600">
                {{ errors.datetime[0] }}
              </p>
            </div>
            <div class="space-y-1">
              <label for="name" class="text-gray-800 text-xs"
                >Supplier Name<span class="text-red-600 text-base pl-2"
                  >*</span
                ></label
              >
              <v-select
                v-model="formData.vendor"
                class="style-chooser bg-white rounded-lg"
                :options="suppliers?.data"
                label="name"
                disabled
                :clearable="false"
                :reduce="(d) => d.id"
              ></v-select>
            </div>
            <div class="space-y-1 col-span-2">
              <label for="name" class="text-gray-800 text-xs"
                >Add Reservations
                <span class="text-red-600 text-base pl-2">*</span></label
              >
              <ReservationSelectVue
                :data="reservation"
                :isMult="true"
                @childData="handleChildData"
                @searchData="handleSearchData"
                @selected="handleSelected"
              />
              <p v-if="errors?.crm_ids" class="mt-1 text-sm text-red-600">
                {{ errors.crm_ids[0] }}
              </p>
            </div>
            <div class="space-y-1 col-span-2">
              <label for="name" class="text-gray-800 text-xs"
                >Notes<span class="text-red-600 text-base pl-2">*</span></label
              >
              <textarea
                name=""
                class="w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-300"
                id=""
                v-model="formData.notes"
                cols="30"
                rows="3"
              ></textarea>
              <p v-if="errors?.notes" class="mt-1 text-sm text-red-600">
                {{ errors.notes[0] }}
              </p>
            </div>
            <div class="space-y-1 col-span-2">
              <label for="name" class="text-gray-800 text-xs"
                >Total Payment<span class="text-red-600 text-base pl-2"
                  >*</span
                ></label
              >
              <input
                type="number"
                v-model="formData.total_paid"
                id="name"
                class="h-9 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.total_paid" class="mt-1 text-sm text-red-600">
                {{ errors.total_paid[0] }}
              </p>
            </div>
            <div class="space-y-1 col-span-2">
              <label for="name" class="text-gray-800 text-xs"
                >Payment Slip<span class="text-red-600 text-base pl-2"
                  >*</span
                ></label
              >
              <div class="py-4">
                <div class="flex items-center justify-start gap-3 mb-3">
                  <button
                    @click.prevent="openFileImagePicker"
                    class="text-sm text-orange-500 w-full py-10 border rounded-md border-orange-600 border-dashed"
                  >
                    choose payment slips
                  </button>
                  <input
                    multiple
                    type="file"
                    ref="imagesInput"
                    class="hidden"
                    @change="handlerImagesFileChange"
                    accept="image/*"
                  />
                  <p
                    v-if="errors?.payment_slips"
                    class="mt-1 text-sm text-red-600"
                  >
                    {{ errors.payment_slips[0] }}
                  </p>
                </div>
                <div class="grid grid-cols-2 gap-2">
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
                    <img class="h-auto w-full rounded" :src="image" alt="" />
                  </div>
                </div>
              </div>
            </div>

            <div class="text-end col-span-2">
              <Button type="submit"> Submit </Button>
            </div>
          </form>
        </DialogPanel>
      </Modal>
    </div>
  </div>
</template>
