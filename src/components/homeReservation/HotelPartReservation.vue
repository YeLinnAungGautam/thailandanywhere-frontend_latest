<script setup>
import {
  PencilSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckBadgeIcon,
  InformationCircleIcon,
  XCircleIcon,
  PrinterIcon,
  DocumentDuplicateIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import { useAdminStore } from "../../stores/admin";
import { useReservationStore } from "../../stores/reservation";
import { useAuthStore } from "../../stores/auth";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import Pagination from "../Pagination.vue";
import { useToast } from "vue-toastification";
import Modal from "../Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";

const reservationStore = useReservationStore();
const adminStore = useAdminStore();
const authStore = useAuthStore();
const toast = useToast();

const { reservations, loading } = storeToRefs(reservationStore);
const { admin } = storeToRefs(adminStore);

const search = ref("App\\Models\\Hotel");

const props = defineProps({
  date: "String",
  searchId: "String",
});

const sale_daterange = ref(props.date);
const searchId = ref(props.searchId);

const watchSystem = computed(() => {
  const result = {};

  if (authStore.isSuperAdmin || authStore.isReservation) {
    result.user_id = "";
  } else {
    result.user_id = authStore.user.id;
  }

  result.product_type = "App\\Models\\Hotel";

  if (sale_daterange.value != undefined && searchId.value == "") {
    result.sale_daterange = sale_daterange.value;
  }
  if (searchId.value != "" && searchId.value != undefined) {
    result.crm_id = searchId.value;
  }

  console.log(result);
  return result;
});

watch(
  () => [props.date, props.searchId],
  ([newDate, newSearchId]) => {
    sale_daterange.value = newDate;
    searchId.value = newSearchId;
    // Assuming searchId is also used in the watchSystem computation or the store action
    reservationStore.getListAction(watchSystem.value);
  }
);

const infoData = ref({
  passports: null,
  booking_confirmations: null,
  special_request: "",
});

const printHotelConfirm = (id) => {
  window.open(
    import.meta.env.VITE_API_URL + "/hotel-reservation/" + id + "/receipt"
  );
};

const showInfoFormModal = ref(false);
const editId = ref("");
const openInfoFormModal = async (id) => {
  const res = await reservationStore.getDetailAction(id);
  console.log(res.result);
  let data = res.result;
  editId.value = data?.id;
  customer_passport_data.value = data?.customer_passports;
  paid_slip_data.value = data?.paid_slip;
  special_request_data.value = data?.special_request;
  slip_code.value = data?.slip_code;
  receipt_image_data.value = data?.receipt_images;

  showInfoFormModal.value = true;
};
const closeInfoFormModal = () => {
  showInfoFormModal.value = false;
  editId.value = "";
  customer_passport_data.value = [];
  paid_slip_data.value = [];
  special_request_data.value = "";
  slip_code.value = "";
  receipt_image_data.value = [];
  featureCusPassPreview.value = [];
  customer_passport.value = [];
  paid_slip.value = [];
  receipt_image.value = [];
  previewImage.value = null;
  uploadRecePreview.value = [];
  expPreviewImage.value = [];
};

// add data

const featureImageInput = ref(null);
const featureCusPassPreview = ref([]);
const customer_passport = ref([]);
const customer_passport_data = ref([]);
const paid_slip_data = ref([]);
const receipt_image_data = ref([]);
const special_request_data = ref("");
const slip_code = ref("");

const openFileFeaturePicker = () => {
  featureImageInput.value.click();
};

const handlerCustomerPassport = (e) => {
  let selectedFile = e.target.files;

  for (let index = 0; index < selectedFile.length; index++) {
    customer_passport.value.push(selectedFile[index]);
    featureCusPassPreview.value.push(URL.createObjectURL(selectedFile[index]));
    console.log(customer_passport.value, "this is customer passport array");
  }
};

const removeCustomerPassportImage = (index) => {
  customer_passport.value.splice(index, 1);
  featureCusPassPreview.value.splice(index, 1);
  console.log(customer_passport.value, "this is remove");
};

const deleteCustomerPassport = async (id) => {
  const res = await reservationStore.deleteCustomerPassportAction(id);
  await reservationStore.getListAction(watchSystem.value);
  toast.success("success delete customer passport");
  closeInfoFormModal();
};

const deleteImagePaid = async (id) => {
  console.log(id, "this is delete id");
  await reservationStore.deletePaidImage(id);
  toast.success("success delete");
  await reservationStore.getListAction(watchSystem.value);
  closeInfoFormModal();
};
const deleteImage = async (id) => {
  console.log(id, "this is delete id");
  await reservationStore.deleteResImage(id);
  toast.success("success delete receipt");
  await reservationStore.getListAction(watchSystem.value);

  closeInfoFormModal();
};

const fileInput = ref(null);
const fileInputTwo = ref(null);
const fileInputThree = ref(null);
const previewImage = ref(null);
const paid_slip = ref([]);
const receipt_image = ref([]);
const uploadRecePreview = ref([]);

const openFilePicker = () => {
  fileInput.value.click();
};
const openFilePickerTwo = () => {
  fileInputTwo.value.click();
};
const openFilePickerThree = () => {
  fileInputThree.value.click();
};

const removeSelectedImage = () => {
  secForm.value.car_photo = null;
  previewImage.value = null;
};

const expPreviewImage = ref([]);

const exphandleFileChange = (e) => {
  console.log(e.target.files);
  let selectedFile = e.target.files;
  if (selectedFile) {
    for (let index = 0; index < selectedFile.length; index++) {
      paid_slip.value.push(selectedFile[index]);
      expPreviewImage.value.push(URL.createObjectURL(selectedFile[index]));
    }
  }
  console.log(paid_slip.value, "this is paid slip");
};

const expremoveSelectedImage = (index) => {
  paid_slip.value.splice(index, 1);
  expPreviewImage.value.splice(index, 1);
  console.log(paid_slip.value, "this is remove");
};
const expremoveSecSelectedImage = (index) => {
  receipt_image.value.splice(index, 1);
  uploadRecePreview.value.splice(index, 1);
  console.log(receipt_image.value, "this is remove");
};

const recehandleFileChange = (e) => {
  let selectedFile = e.target.files;
  if (selectedFile) {
    for (let index = 0; index < selectedFile.length; index++) {
      receipt_image.value.push(selectedFile[index]);
      uploadRecePreview.value.push(URL.createObjectURL(selectedFile[index]));
    }
  }
  console.log(receipt_image.value, "receipt");
};

// end

const showInfoModal = ref(false);
const showInfoFunction = async (id) => {
  const res = await reservationStore.getDetailAction(id);
  let data = res.result;
  infoData.value = {
    passports: data?.customer_passports,
    booking_confirmations: data?.paid_slip,
    special_request: data?.special_request,
  };
  console.log(res, "this is a function");
  showInfoModal.value = true;
};
const closeInfoModal = () => {
  infoData.value = {
    passports: null,
    booking_confirmations: null,
    special_request: "",
  };
  showInfoModal.value = false;
};

const copyReservation = async (id) => {
  const res = await reservationStore.copyReservationDetail(id);
  console.log(res, "this is cpy reservation");
  let formattedOutput;
  if (res.result.checkin_date != undefined) {
    formattedOutput = `
💰 Total Cost: ${res.result.total_cost} THB 🏦 Bank Name: ${
      res.result.bank_name != "null" ? res.result.bank_name : "-"
    }
🔢 Bank Account Number: ${
      res.result.bank_account_number != "null"
        ? `➖${res.result.bank_account_number}`
        : "-"
    }
🧑‍💼 Account Name: ${
      res.result.account_name != "null" ? res.result.account_name : "-"
    }
#️⃣ CRM ID: ${res.result.crm_id}
#️⃣ Reservation Code: ${res.result.reservation_code}
🏨 Hotel Name: ${res.result.product_name}
🏩 Room Name : ${res.result.room_name != "null" ? res.result.room_name : "-"}
🛌 Total Rooms: ${
      res.result.total_rooms != "null" ? res.result.total_rooms : "-"
    }
🌙 Total Nights: ${
      res.result.total_nights != "null" ? res.result.total_nights : "-"
    }
💵 Sale Price: ${res.result.sale_price} THB
💵 Balance Due: ${res.result.balance_due} THB
📝 Payment Status: ${res.result.payment_status}
📅 Sale Date: ${res.result.sale_date != "null" ? res.result.sale_date : "-"}
📅 Check-in Date: ${
      res.result.checkin_date != "null" ? res.result.checkin_date : "-"
    }
📅 Checkout Date: ${
      res.result.checkout_date != "null" ? res.result.checkout_date : "-"
    }
🤑 Score : ${res.result.score}
    `;
  }

  setTimeout(() => {
    navigator.clipboard.writeText(formattedOutput);
  }, 0);

  toast.success("success copy reservation");
};

const onSubmitHandler = async (id) => {
  if (authStore.user.role == "reservation") {
    const frmData = new FormData();
    frmData.append("_method", "PUT");
    if (receipt_image.value.length != 0) {
      if (receipt_image.value.length > 0) {
        for (let i = 0; i < receipt_image.value.length; i++) {
          let file = receipt_image.value[i];
          frmData.append("receipt_image[" + i + "]", file);
        }
      }
    }
    if (paid_slip.value.length != 0) {
      if (paid_slip.value.length > 0) {
        for (let i = 0; i < paid_slip.value.length; i++) {
          let file = paid_slip.value[i];
          frmData.append("paid_slip[" + i + "]", file);
        }
      }
    }
    if (slip_code.value) {
      frmData.append("slip_code", slip_code.value);
    }
    try {
      const res = await reservationStore.updateInfoAction(frmData, id);
      const response = await reservationStore.updateAction(frmData, id);
      toast.success(res.message);
      closeInfoFormModal();
    } catch (error) {
      console.log(error);
    }
  } else if (authStore.user.role == "admin") {
    const frmData = new FormData();
    frmData.append("_method", "PUT");
    if (special_request_data.value) {
      frmData.append("special_request", special_request_data.value);
    }

    if (customer_passport.value.length != 0) {
      if (customer_passport.value.length > 0) {
        for (let i = 0; i < customer_passport.value.length; i++) {
          let file = customer_passport.value[i];
          frmData.append("customer_passport[" + i + "]", file);
        }
      }
    }
    try {
      const response = await reservationStore.updateAction(frmData, id);
      // console.log(response, "this is on submit");
      toast.success(response.message);
      closeInfoFormModal();
    } catch (error) {
      console.log(error);
    }
  }
};

const changePage = async (url) => {
  await reservationStore.getChangePage(url, watchSystem.value);
};

// Initial call to load data
reservationStore.getListAction(watchSystem.value);
</script>

<template>
  <div>
    <div class="overflow-auto rounded-lg shadow mb-2" v-if="!loading">
      <table class="w-full">
        <thead class="bg-gray-50 border-b-2 w-full border-gray-200">
          <tr>
            <th class="p-4 text-[10px] font-medium tracking-wide text-left">
              Resv.ID
            </th>
            <th class="p-4 text-[10px] font-medium tracking-wide text-left">
              Checkin
            </th>
            <th class="p-4 text-[10px] font-medium tracking-wide text-left">
              Checkout
            </th>
            <th class="p-4 text-[10px] font-medium tracking-wide text-left">
              Customer
            </th>
            <th class="p-4 text-[10px] font-medium tracking-wide text-left">
              Hotel
            </th>
            <th class="p-4 text-[10px] font-medium tracking-wide text-left">
              Room Type
            </th>
            <th class="p-4 text-[10px] font-medium tracking-wide text-left">
              Pay.Status
            </th>
            <th class="p-4 text-[10px] font-medium tracking-wide text-left">
              Exp.Status
            </th>
            <th class="p-4 text-[10px] font-medium tracking-wide text-left">
              Confirmation
            </th>
            <th class="p-4 text-[10px] font-medium tracking-wide text-left">
              Passport
            </th>
            <th
              class="p-4 text-[10px] font-medium tracking-wide text-left"
            ></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="l in reservations?.data"
            :key="l.id"
            class="bg-white even:bg-gray-50 hover:bg-gray-50"
          >
            <td class="p-4 text-[10px] text-gray-700 whitespace-nowrap">
              {{ l.crm_id }}
            </td>
            <td class="p-4 text-[10px] text-gray-700 whitespace-nowrap">
              {{ l.checkin_date }}
            </td>
            <td class="p-4 text-[10px] text-gray-700 whitespace-nowrap">
              {{ l.checkout_date }}
            </td>
            <td
              class="p-4 text-[10px] text-gray-700 max-w-[80px] whitespace-wrap"
            >
              {{ l.customer_info?.name }}
            </td>
            <td
              class="p-4 text-[10px] max-w-[100px] text-gray-700 whitespace-wrap"
            >
              {{ l.product?.name }}
            </td>
            <td
              class="p-4 text-[10px] max-w-[200px] text-gray-700 whitespace-wrap"
            >
              {{ l.room?.name }}
            </td>
            <td class="p-4 text-[10px] text-gray-700 whitespace-nowrap">
              <p
                v-if="
                  !l.booking?.payment_status ||
                  l.booking?.payment_status == 'null'
                "
              >
                -
              </p>
              <p
                v-if="l.booking?.payment_status == 'fully_paid'"
                class="inline-block px-3 py-0.5 mt-2 text-[10px] text-white bg-green-500 rounded-full shadow"
              >
                {{ l.booking?.payment_status }}
              </p>
              <p
                v-if="l.booking?.payment_status == 'not_paid'"
                class="inline-block px-3 py-0.5 mt-2 text-[10px] text-white bg-red-500 rounded-full shadow"
              >
                {{ l.booking?.payment_status }}
              </p>
              <p
                v-if="l.booking?.payment_status == 'partially_paid'"
                class="inline-block px-3 py-0.5 mt-2 text-[10px] text-white bg-yellow-500 rounded-full shadow"
              >
                {{ l.booking?.payment_status }}
              </p>
            </td>
            <td class="p-4 text-[10px] text-gray-700 whitespace-nowrap">
              <p v-if="!l?.payment_status || l?.payment_status == 'null'">-</p>
              <p
                v-if="l?.payment_status == 'fully_paid'"
                class="inline-block px-3 py-0.5 mt-2 text-[10px] text-white bg-green-500 rounded-full shadow"
              >
                {{ l?.payment_status }}
              </p>
              <p
                v-if="l?.payment_status == 'not_paid'"
                class="inline-block px-3 py-0.5 mt-2 text-[10px] text-white bg-red-500 rounded-full shadow"
              >
                {{ l?.payment_status }}
              </p>
              <p
                v-if="l?.payment_status == 'partially_paid'"
                class="inline-block px-3 py-0.5 mt-2 text-[10px] text-white bg-yellow-500 rounded-full shadow"
              >
                {{ l?.payment_status }}
              </p>
            </td>
            <td
              class="p-4 text-[10px] text-gray-700 whitespace-nowrap text-center"
            >
              <CheckBadgeIcon
                class="w-5 h-5 text-green-600"
                v-if="l?.paid_slip.length > 0"
              />
              <XCircleIcon
                class="w-5 h-5 text-red-600"
                v-if="l?.paid_slip.length == 0 || l?.paid_slip == null"
              />
            </td>
            <td
              class="p-4 text-[10px] text-gray-700 whitespace-nowrap text-center"
            >
              <CheckBadgeIcon
                class="w-5 h-5 text-green-600"
                v-if="l?.customer_passports.length > 0"
              />
              <XCircleIcon
                class="w-5 h-5 text-red-600"
                v-if="
                  l?.customer_passports.length == 0 ||
                  l?.customer_passports == null
                "
              />
            </td>
            <td class="pr-2 text-[10px] text-gray-700">
              <div class="flex justify-end items-center gap-x-3">
                <DocumentDuplicateIcon
                  @click="copyReservation(l?.id)"
                  class="w-4 h-4 cursor-pointer hover:text-orange-600"
                />
                <InformationCircleIcon
                  @click="showInfoFunction(l?.id)"
                  class="w-4 h-4 cursor-pointer hover:text-orange-600"
                />
                <PrinterIcon
                  v-if="
                    l?.booking?.payment_status == 'fully_paid' ||
                    l?.booking?.payment_status == 'partially_paid'
                  "
                  @click="printHotelConfirm(l?.id)"
                  class="w-4 h-4 cursor-pointer hover:text-orange-600"
                />
                <PencilSquareIcon
                  @click="openInfoFormModal(l?.id)"
                  class="w-4 h-4 cursor-pointer hover:text-orange-600"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="">
      <Pagination
        v-if="!loading"
        :data="reservations"
        @change-page="changePage"
      />
    </div>
    <Modal :isOpen="showInfoModal" @closeModal="closeInfoModal">
      <DialogPanel
        class="w-full max-w-lg transform rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-base flex justify-between items-center font-semibold leading-6 text-[#ff613c] mb-5"
        >
          <p>Hotel Information</p>
          <button @click="closeInfoModal"><XMarkIcon class="w-5 h-5" /></button>
        </DialogTitle>
        <div class="space-y-3">
          <p class="text-xs font-semibold text-orange-500">Special Request</p>
          <p class="text-start text-sm">{{ infoData.special_request }}</p>
          <div
            class="text-center py-4 text-red-600 text-xs col-span-2"
            v-if="infoData.special_request == null"
          >
            There isn't data here !
          </div>
          <!-- <div class="w-full h-0.5 col-span-2 bg-orange-600"></div> -->
          <p class="text-xs font-semibold text-orange-500">
            Customer Passports
          </p>
          <div class="grid grid-cols-2 gap-2">
            <div v-for="i in infoData?.passports" :key="i.id" class="pb-3">
              <a :href="i.file" target="_blink">
                <img
                  :src="i.file"
                  alt=""
                  class="w-full h-full object-cover cursor-pointer"
                />
              </a>
            </div>
            <div
              class="text-center py-4 text-red-600 text-xs col-span-2"
              v-if="
                infoData.passports == null || infoData.passports.length == 0
              "
            >
              There isn't data or image here !
            </div>
            <!-- <div class="w-full h-0.5 col-span-2 bg-orange-600"></div> -->
          </div>
          <p class="text-xs font-semibold text-orange-500">
            Hotel Confirmations
          </p>
          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="i in infoData?.booking_confirmations"
              :key="i.id"
              class="pb-3"
            >
              <a :href="i.file" target="_blink">
                <img
                  :src="i.file"
                  alt=""
                  class="w-full h-full object-cover cursor-pointer"
                />
              </a>
            </div>
            <div
              class="text-center py-4 text-red-600 text-xs col-span-2"
              v-if="
                infoData.booking_confirmations == null ||
                infoData?.booking_confirmations.length == 0
              "
            >
              There isn't data or image here !
            </div>
            <!-- <div class="w-full h-0.5 col-span-2 bg-orange-600"></div> -->
          </div>
        </div>
      </DialogPanel>
    </Modal>
    <Modal :isOpen="showInfoFormModal" @closeModal="closeInfoFormModal">
      <DialogPanel
        class="w-full max-w-lg transform rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-base flex justify-between items-center font-semibold leading-6 text-[#ff613c] mb-5"
        >
          <p>Hotel Information Form</p>
          <button @click="closeInfoFormModal">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </DialogTitle>
        <div class="space-y-4">
          <div
            class="space-y-2"
            v-if="authStore.isAdmin || authStore.isSuperAdmin"
          >
            <p class="text-xs text-[#ff613c]">Special Request</p>
            <textarea
              name=""
              v-model="special_request_data"
              id=""
              cols="4"
              rows="5"
              class="w-full border border-gray-400 text-xs px-4 py-2 rounded-md focus:outline-none"
            ></textarea>
          </div>

          <div
            class="space-y-2"
            v-if="authStore.isAdmin || authStore.isSuperAdmin"
          >
            <p class="text-xs text-[#ff613c]">Customer Passport Number</p>
            <input
              type="text"
              name=""
              disabled
              placeholder="xxxxxxxx"
              class="w-full border border-gray-400 text-xs px-4 py-2 rounded-md focus:outline-none"
              id=""
            />
          </div>
          <div
            class="space-y-4"
            v-if="authStore.isAdmin || authStore.isSuperAdmin"
          >
            <p class="text-xs text-[#ff613c]">Customer Passports</p>
            <input
              type="file"
              ref="featureImageInput"
              multiple
              class="hidden"
              @change="handlerCustomerPassport"
              accept="image/*"
            />
            <p
              class="font-semibold py-4 px-4 flex justify-center items-center text-xs border border-gray-400 border-dashed rounded-md"
              @click.prevent="openFileFeaturePicker"
            >
              Add New Customer Passport multiple
            </p>
          </div>
          <div
            class="space-y-2 col-span-2"
            v-if="authStore.isAdmin || authStore.isSuperAdmin"
          >
            <p
              class="text-gray-400 text-xs"
              v-if="featureCusPassPreview.length > 0"
            >
              Preview Images for Customer Passport
            </p>
            <div
              v-if="featureCusPassPreview.length > 0"
              class="grid grid-cols-3 gap-4"
            >
              <div
                v-for="(img, index) in featureCusPassPreview"
                :key="index"
                class="relative"
              >
                <img :src="img" alt="" />
                <span
                  class="absolute top-[-10px] right-0"
                  @click="removeCustomerPassportImage(index)"
                >
                  <i class="fa-solid fa-circle-minus text-red-600 text-lg"></i>
                </span>
              </div>
            </div>
            <p
              class="text-gray-400 text-xs"
              v-if="customer_passport_data.length > 0"
            >
              Customer Passports
            </p>
            <div
              v-if="customer_passport_data.length > 0"
              class="grid grid-cols-3 gap-4"
            >
              <div
                v-for="(img, index) in customer_passport_data"
                :key="index"
                class="relative"
              >
                <a :href="img.file">
                  <img :src="img.file" alt="" />
                </a>
                <span
                  class="absolute top-[-10px] right-0"
                  @click="deleteCustomerPassport(img.id)"
                >
                  <i class="fa-solid fa-circle-minus text-red-600 text-lg"></i>
                </span>
              </div>
            </div>
          </div>
          <div
            class="space-y-2"
            v-if="authStore.isReservation || authStore.isSuperAdmin"
          >
            <p class="text-xs text-[#ff613c]">Reservation Code</p>
            <input
              type="text"
              name=""
              v-model="slip_code"
              placeholder="xxxxxxxx"
              class="w-full border border-gray-400 text-xs px-4 py-2 rounded-md focus:outline-none"
              id=""
            />
          </div>
          <div
            class="space-y-4"
            v-if="authStore.isReservation || authStore.isSuperAdmin"
          >
            <p class="text-xs text-[#ff613c]">Hotel Confirmation Receipt</p>
            <input
              type="file"
              id="image"
              ref="fileInputTwo"
              multiple
              class="hidden"
              @change="exphandleFileChange"
              accept="image/*"
            />
            <div
              @click.prevent="openFilePickerTwo"
              class="font-semibold py-4 px-4 flex justify-center items-center text-xs border border-gray-400 border-dashed rounded-md"
            >
              <span class="text-xs">Add Hotel Confirmation Receipts</span>
            </div>

            <div
              class="grid grid-cols-3 gap-3 mt-4"
              v-if="expPreviewImage.length > 0"
            >
              <p
                class="text-gray-400 col-span-3 text-xs"
                v-if="expPreviewImage.length > 0"
              >
                Hotel Confirmation Receipts Preview
              </p>
              <div
                class="relative"
                v-for="(image, index) in expPreviewImage"
                :key="index"
              >
                <button
                  @click.prevent="expremoveSelectedImage(index)"
                  class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
                >
                  <XCircleIcon class="w-8 h-8 font-semibold" />
                </button>

                <img class="h-auto w-full rounded" :src="image" alt="" />
              </div>
            </div>
            <div
              class="grid grid-cols-3 gap-4"
              v-if="paid_slip_data.length != 0"
            >
              <p
                class="text-gray-400 col-span-3 text-xs"
                v-if="paid_slip_data.length > 0"
              >
                Hotel Confirmation Receipts
              </p>
              <div
                class="relative"
                v-for="(image, index) in paid_slip_data"
                :key="index"
              >
                <button
                  @click.prevent="deleteImagePaid(image.id)"
                  class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
                >
                  <XCircleIcon class="w-8 h-8 font-semibold" />
                </button>

                <img class="h-auto w-full rounded" :src="image.file" alt="" />
              </div>
            </div>
          </div>
          <div
            class="space-y-4"
            v-if="authStore.isReservation || authStore.isSuperAdmin"
          >
            <p class="text-xs text-[#ff613c]">Receipt Images</p>
            <div class="space-y-4">
              <input
                type="file"
                id="image"
                ref="fileInputThree"
                multiple
                class="hidden"
                @change="recehandleFileChange"
                accept="image/*"
              />
              <div
                @click.prevent="openFilePickerThree"
                class="font-semibold py-4 px-4 flex justify-center items-center text-xs border border-gray-400 border-dashed rounded-md"
              >
                <span class="text-xs">Add Expense Receipt Images</span>
              </div>

              <div
                class="grid grid-cols-3 gap-3 mt-4"
                v-if="uploadRecePreview.length > 0"
              >
                <p
                  class="text-gray-400 col-span-3 text-xs"
                  v-if="uploadRecePreview.length > 0"
                >
                  Receipt Images Preview
                </p>
                <div
                  class="relative"
                  v-for="(image, index) in uploadRecePreview"
                  :key="index"
                >
                  <button
                    @click.prevent="expremoveSecSelectedImage(index)"
                    class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
                  >
                    <XCircleIcon class="w-8 h-8 font-semibold" />
                  </button>

                  <img class="h-auto w-full rounded" :src="image" alt="" />
                </div>
              </div>
              <div
                class="grid grid-cols-3 gap-4"
                v-if="receipt_image_data.length != 0"
              >
                <p
                  class="text-gray-400 col-span-3 text-xs"
                  v-if="receipt_image_data.length > 0"
                >
                  Receipt Images
                </p>
                <div v-for="(image, index) in receipt_image_data" :key="index">
                  <span
                    ><i
                      class="fa-solid fa-trash-can text-lg text-red-500"
                      @click="deleteImage(image.id)"
                    ></i
                  ></span>
                  <a :href="image.file" target="_blink">
                    <img :src="image.file" alt="" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <button
            @click="onSubmitHandler(editId)"
            class="bg-[#ff613c] w-full py-2 text-white rounded-md text-xs"
          >
            Add Info
          </button>
        </div>
      </DialogPanel>
    </Modal>
  </div>
</template>
