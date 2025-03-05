<template>
  <div>
    <div class="py-2 space-y-2 pr-1" v-if="!loading">
      <div class="flex justify-between items-center"></div>

      <div class="pt-2 grid grid-cols-4 gap-x-4">
        <div class="space-y-2 pt-2" @click="openPassportModal">
          <div
            class="w-full h-[180px] border border-[#FF613c] text-[#FF613c] text-lg flex justify-center items-center rounded-lg border-dashed"
          >
            +
          </div>
          <div
            class="w-full px-4 pb-1 border-dashed border border-[#FF613c] space-y-2 text-[#FF613c] hover:shadow-none rounded-lg"
          >
            <p class="text-[10px] flex justify-start items-center pt-2">
              Invoice Date
            </p>
            <p class="text-[10px] flex justify-start items-center">
              Company Name
            </p>
            <p class="text-[10px] flex justify-start items-center pb-2">
              Invoice Amount
            </p>
          </div>
        </div>
        <div
          v-for="image in detail?.booking_confirm_letters"
          :key="image"
          class="flex flex-col relative justify-stretch group space-y-2 w-full"
        >
          <p
            @click="openPassportModal(image)"
            class="absolute top-4 cursor-pointer text-[8px] shadow right-2 text-xs text-white bg-[#FF613c] px-2 py-0.5 rounded-lg"
          >
            <span class="text-[10px]">edit</span>
          </p>
          <div class="h-[180px] w-full">
            <img
              :src="image.file"
              class="rounded-lg shadow hover:shadow-none h-full object-cover w-full"
              alt=""
            />
          </div>
          <div
            class="w-full px-4 pb-1 border space-y-2 text-[#FF613c] border-gray-200 shadow hover:shadow-none rounded-lg"
          >
            <p class="text-[10px] flex justify-start items-center pt-2">
              {{ image.invoice }}
            </p>
            <p class="text-[10px] flex justify-start items-center">
              {{ image.customer }}
            </p>
            <p class="text-[10px] flex justify-start items-center pb-2">
              {{ image.amount }} thb
            </p>
          </div>
        </div>
      </div>
    </div>
    <Modal :isOpen="carModalOpen" @closeModal="closeAction">
      <DialogPanel
        class="w-full max-w-xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-2 px-4"
        >
          <p>Invoice Update</p>
          <XCircleIcon class="w-5 h-5 text-white" @click="closeAction" />
        </DialogTitle>
        <!-- show date  -->
        <div class="p-4">
          <div class="p-4">
            <div class="grid grid-cols-2 gap-8">
              <div
                v-if="!featureImagePreview"
                class="w-[220px] h-[300px] border rounded-lg border-dashed flex justify-center items-center text-[#FF613c] border-[#FF613c]"
                @click="openFileFeaturePicker"
              >
                +
              </div>
              <div v-if="featureImagePreview" class="w-[220px] h-[300px]">
                <img
                  :src="featureImagePreview"
                  class="rounded-lg shadow hover:shadow-none h-full object-cover w-full"
                  alt=""
                />
              </div>
              <input
                type="file"
                ref="featureImageInput"
                class="hidden"
                @change="handlerFeatureFileChange"
                accept="image/*"
              />
              <div class="space-y-4 relative pt-4">
                <div class="flex justify-between items-center">
                  <label for="" class="text-[12px] font-medium">Amount</label>
                  <input
                    type="number"
                    v-model="formData.amount"
                    name=""
                    placeholder="xxxx"
                    class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                    id=""
                  />
                </div>
                <div class="flex justify-between items-center">
                  <label for="" class="text-[12px] font-medium"
                    >Invoice <span class="opacity-0">.</span></label
                  >
                  <div class="flex justify-between items-center w-[160px]">
                    <p class="text-start text-xs" v-if="formData?.invoice">
                      {{
                        formData.invoice.includes("T")
                          ? formatDate(formData.invoice)
                          : formatDateFromDb(formData.invoice)
                      }}
                    </p>
                    <input
                      type="datetime-local"
                      name=""
                      v-model="formData.invoice"
                      format="YYYY-MM-DD HH:mm:ss"
                      class="w-[35px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                      id=""
                    />
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <label for="" class="text-[12px] font-medium">Due </label>
                  <div class="flex justify-between items-center w-[160px]">
                    <p class="text-start text-xs" v-if="formData?.due_date">
                      {{
                        formData.due_date.includes("T")
                          ? formatDate(formData.due_date)
                          : formatDateFromDb(formData.due_date)
                      }}
                    </p>
                    <input
                      type="datetime-local"
                      name=""
                      v-model="formData.due_date"
                      format="YYYY-MM-DD HH:mm:ss"
                      class="w-[35px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                      id=""
                    />
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <label for="" class="text-[12px] font-medium"
                    >Customer
                  </label>
                  <select
                    v-model="formData.customer"
                    name=""
                    id=""
                    class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                  >
                    <option value="">Select</option>
                    <option value="TH Anywhere">TH Anyhwere</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div class="flex justify-between items-center">
                  <label for="" class="text-[12px] font-medium">Sender</label>
                  <input
                    type="text"
                    v-model="formData.sender_name"
                    name=""
                    placeholder="xxxx"
                    class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                    id=""
                  />
                </div>

                <div
                  class="flex justify-end items-center space-x-2 absolute bottom-0 right-0"
                >
                  <p
                    @click="
                      formData.id
                        ? addInvoiceUpdateAction()
                        : addInvoiceAction()
                    "
                    class="px-3 py-1 bg-green-500 text-white text-[12px] cursor-pointer rounded-lg"
                  >
                    {{ formData.id ? "Update" : "Save" }}
                  </p>
                  <p
                    v-if="formData.id"
                    @click="deleteAction(formData.id)"
                    class="px-3 py-1 bg-red-500 text-white text-[12px] cursor-pointer rounded-lg"
                  >
                    Delete
                  </p>
                  <p
                    @click="closeAction"
                    class="px-3 py-1 bg-white border border-gray-300 text-[12px] cursor-pointer rounded-lg"
                  >
                    Close
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Modal>
  </div>
</template>

<script setup>
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { ref, defineProps, onMounted } from "vue";
import { useReservationStore } from "../../stores/reservation";
import { useToast } from "vue-toastification";
import invoice from "../../assets/invoice_exp.jpg";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useRoute } from "vue-router";

const reservationStore = useReservationStore();
const toast = useToast();
const route = useRoute();

const editData = ref({
  car_photo: null,
});

const loading = ref(false);

const props = defineProps({
  detail: Object,
  getDetailAction: Function,
});

const formData = ref({
  id: "",
  amount: "",
  file: "",
  invoice: "",
  due_date: "",
  customer: "",
  sender_name: "",
});

const carModalOpen = ref(false);

const featureImageInput = ref(null);

const featureImagePreview = ref(null);
const handlerFeatureFileChange = (e) => {
  let selectedFile = e.target.files[0];
  editData.value.car_photo = e.target.files[0];
  featureImagePreview.value = URL.createObjectURL(selectedFile);
};

const openFileFeaturePicker = () => {
  featureImageInput.value.click();
};

const closeAction = async () => {
  editData.value.car_photo = null;
  formData.value = {
    id: "",
    amount: "",
    invoice: "",
    due_date: "",
    customer: "",
    sender_name: "",
  };
  featureImagePreview.value = null;
  carModalOpen.value = false;
};

const deleteAction = async (id) => {
  const res = await reservationStore.deleteConfirmationLetterAction(id);
  editData.value.car_photo = null;
  featureImagePreview.value = null;
  carModalOpen.value = false;
  toast.success("delete successfully");

  setTimeout(async () => {
    await props.getDetailAction(route.query.id);
  }, 1000);
};

const openPassportModal = (data) => {
  console.log(data, "this is data");
  // open passport modal
  if (data) {
    featureImagePreview.value = data.file;
    formData.value.id = data.id;
    formData.value.amount = data.amount;
    formData.value.invoice = data.invoice;
    formData.value.due_date = data.due_date;
    formData.value.customer = data.customer;
    formData.value.sender_name = data.sender_name
      ? data.sender_name
      : props?.detail?.product?.legal_name;
  } else {
    formData.value = {
      id: "",
      amount: "",
      invoice: "",
      due_date: "",
      customer: "",
      sender_name: props?.detail?.product?.legal_name,
    };
    featureImagePreview.value = null;
  }
  carModalOpen.value = true;
};

const formatDate = (dateString) => {
  // Parse the input string into a Date object
  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "Invalid Date"; // Handle invalid dates
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Extract date components
  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Extract time components
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Return formatted date and time
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

const formatDateFromDb = (dateString) => {
  // Split the input string into date and time parts
  const [datePart, timePart] = dateString.split(" ");

  // Split the date part into day, month, year
  const [day, month, year] = datePart.split("-");

  // Define month names
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get the month name
  const monthName = monthNames[parseInt(month) - 1]; // Subtract 1 because months are 0-indexed

  // Return the formatted date
  return `${day}/${monthName}/${year} ${timePart}`;
};

const formatDateDb = (dateString) => {
  // Parse the input string into a Date object
  return dateString.replace("T", " ");
};

const addInvoiceAction = async () => {
  const frmData = new FormData();
  frmData.append("amount", formData.value.amount);
  frmData.append("invoice", formatDateDb(formData.value.invoice));
  frmData.append("due_date", formatDateDb(formData.value.due_date));
  frmData.append("customer", formData.value.customer);
  frmData.append("sender_name", formData.value.sender_name);
  if (
    props.detail?.product_type == "App\\Models\\EntranceTicket" ||
    props.detail?.product_type == "App\\Models\\Hotel"
  ) {
    frmData.append("file", editData.value.car_photo);
  }

  const res = await reservationStore.bookingConfirmationAction(
    props.detail?.id,
    frmData
  );

  console.log(res, "this is res");
  closeAction();

  toast.success(res.message);

  // props.closeTravellerModal();
  setTimeout(async () => {
    await props.getDetailAction(route.query.id);
  }, 1000);
};

const addInvoiceUpdateAction = async () => {
  const frmData = new FormData();
  frmData.append("_method", "PUT");
  frmData.append("amount", formData.value.amount);
  frmData.append("invoice", formatDateDb(formData.value.invoice));
  frmData.append("due_date", formatDateDb(formData.value.due_date));
  frmData.append("customer", formData.value.customer);
  frmData.append("sender_name", formData.value.sender_name);
  // if (
  //   (props.detail?.product_type == "App\\Models\\EntranceTicket" ||
  //     props.detail?.product_type == "App\\Models\\Hotel") &&
  //   editData.value.car_photo != null
  // ) {
  //   frmData.append("file", editData.value.car_photo);
  // }

  const res = await reservationStore.bookingConfirmationUpdateAction(
    props.detail?.id,
    formData.value.id,
    frmData
  );

  console.log(res, "this is res");
  closeAction();

  toast.success(res.message);

  // props.closeTravellerModal();
  setTimeout(async () => {
    await props.getDetailAction(route.query.id);
  }, 1000);
};

onMounted(() => {
  if (props.data) {
    loading.value = true;
    loading.value = false;
  }
});
</script>
