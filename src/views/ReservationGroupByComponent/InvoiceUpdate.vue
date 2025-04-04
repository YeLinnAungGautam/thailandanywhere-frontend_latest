<template>
  <div>
    <div class="grid grid-cols-3 gap-4">
      <div class="pb-4 border-b border-gray-200 col-span-3">
        <p class="pb-2 text-lg font-medium text-[#FF613c]">Invoice Status</p>
        <div class="flex justify-between items-center gap-x-2">
          <select
            name=""
            id=""
            v-model="booking_status"
            class="w-full border border-gray-200 px-4 py-1 text-sm rounded-lg"
          >
            <option value="receive">receive</option>
            <option value="not_receive">not_receive</option>
          </select>
          <button
            class="text-xs px-3 py-1.5 border whitespace-nowrap rounded-lg shadow border-[#FF6300] bg-[#FF6300] text-white"
            @click="updateAction"
          >
            Update Status
          </button>
        </div>
      </div>
      <div
        class="rounded-lg py-3 relative border space-y-3 border-gray-200 h-auto"
      >
        <p class="text-lg font-medium text-[#FF613c] px-4">Add Invoice</p>

        <div class="h-[34vh] overflow-y-auto space-y-3">
          <div
            class="flex justify-between px-4 items-center"
            v-for="i in editData.invoices ?? []"
            :key="i"
          >
            <div class="flex justify-start items-center space-x-4">
              <div class="bg-[#FF613c]/30 rounded-lg p-2 inline-block">
                <DocumentTextIcon class="w-4 text-[#FF613c] h-4" />
              </div>
              <p class="text-[12px] font-medium">
                invoice: {{ i.invoice }} for {{ i.crm_id }}
              </p>
            </div>
            <p @click="openPassportModal(i)">
              <PencilSquareIcon class="w-5 text-blue-500 h-5" />
            </p>
          </div>
        </div>

        <div class="w-full pt-4 px-4">
          <div
            @click="closeAction"
            class="bg-[#FF613c] text-white rounded-xl text-center text-xs py-3"
          >
            + New Invoice
          </div>
        </div>
      </div>
      <div
        class="col-span-2 py-3 rounded-lg relative border h-auto border-gray-200"
      >
        <p class="text-lg font-medium text-[#FF613c] px-4 pb-4">
          Invoice Detail
        </p>
        <div class="grid grid-cols-2 h-[34vh] overflow-y-auto px-4 gap-4">
          <div class="space-y-4">
            <div>
              <p class="text-xs pb-1.5 font-medium">Company Name (Sender) *</p>
              <select
                v-model="formData.customer"
                name=""
                id=""
                class="border text-xs border-gray-200 px-4 py-2 rounded-lg w-full"
              >
                <option value="">Select</option>
                <option value="TH Anywhere">TH Anyhwere</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <p class="text-xs pb-1.5 font-medium">Invoice Date</p>
              <div
                class="flex justify-between border text-xs border-gray-200 pl-4 items-center rounded-lg w-full"
              >
                <p class="text-start text-xs" v-if="formData?.invoice">
                  {{
                    formData.invoice.includes("T")
                      ? formatDate(formData.invoice)
                      : formatDateFromDb(formData.invoice)
                  }}
                </p>
                <p></p>
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
            <div>
              <p class="text-xs pb-1.5 font-medium">Due Date</p>
              <div
                class="flex justify-between border text-xs border-gray-200 pl-4 items-center rounded-lg w-full"
              >
                <p class="text-start text-xs" v-if="formData?.due_date">
                  {{
                    formData.due_date.includes("T")
                      ? formatDate(formData.due_date)
                      : formatDateFromDb(formData.due_date)
                  }}
                </p>
                <p></p>
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
            <div class="col-span-2" v-if="!formData.id">
              <label for="" class="text-[12px] font-medium">For Which ? </label>
              <div>
                <input
                  type="checkbox"
                  v-model="allReservation"
                  id="car"
                  name="for_which"
                />
                <label for="car" class="text-[12px] ml-2"
                  >For all reservations.</label
                >
              </div>
              <div v-for="i in editData.reservation_ids" :key="i">
                <input
                  type="checkbox"
                  v-model="i.selected"
                  id="car"
                  name="for_which"
                />
                <label for="car" class="text-[12px] ml-2">
                  <span class="text-[#FF613c]">{{ i.crm_id }}</span
                  >: {{ i.name }}</label
                >
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <p class="text-xs pb-1.5 font-medium">Amount</p>
              <input
                type="number"
                v-model="formData.amount"
                name=""
                placeholder="xxxx"
                class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full"
                id=""
              />
            </div>
            <!-- <div
              class="flex justify-center text-[#FF613c] w-full h-[150px] border-dotted items-center border-2 border-[#FF613c] rounded-lg"
            >
              <PlusCircleIcon class="w-8 h-8 text-[#FF613c]" />
            </div> -->
            <div
              v-if="!featureImagePreview"
              class="w-full h-[300px] border rounded-lg border-dashed flex justify-center items-center text-[#FF613c] border-[#FF613c]"
              @click="openFileFeaturePicker"
            >
              <PlusCircleIcon class="w-8 h-8 text-[#FF613c]" />
            </div>
            <div v-if="featureImagePreview" class="w-full h-[300px]">
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
          </div>
          <div
            class="flex justify-end text-[#FF613c] absolute bottom-2 items-center w-full col-span-2 border-t pt-3 space-x-3 px-7"
          >
            <div class="flex justify-end items-center space-x-2">
              <p
                @click="
                  formData.id
                    ? addInvoiceUpdateAction(formData.reservation_id)
                    : askForReservationId()
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
  </div>
</template>

<script setup>
import {
  DocumentTextIcon,
  PencilSquareIcon,
  UserCircleIcon,
  XCircleIcon,
} from "@heroicons/vue/24/outline";
import { ref, defineProps, onMounted, computed } from "vue";
import { useReservationStore } from "../../stores/reservation";
import { useToast } from "vue-toastification";
import invoice from "../../assets/invoice_exp.jpg";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useRoute } from "vue-router";
import { CheckCircleIcon, PlusCircleIcon } from "@heroicons/vue/24/solid";

const reservationStore = useReservationStore();
const toast = useToast();
const route = useRoute();

const editData = ref({
  car_photo: null,
  reservation_ids: [],
  invoices: [],
});

const loading = ref(false);

const props = defineProps({
  detail: Object,
  getDetailAction: Function,
});

const formData = ref({
  id: "",
  reservation_id: "",
  amount: "",
  file: "",
  invoice: "",
  due_date: "",
  customer: "",
  sender_name: "",
});

const booking_status = ref("");

const updateAction = async () => {
  const frmData = new FormData();
  frmData.append("booking_status", booking_status.value);
  frmData.append("_method", "PUT");

  for (let index = 0; index < editData.value.reservation_ids.length; index++) {
    const res = await reservationStore.updateAction(
      frmData,
      editData.value.reservation_ids[index].id
    );
    toast.success(res.message);
  }

  setTimeout(async () => {
    await props.getDetailAction(route.query.id, route.query.product_id);
  }, 1000);
};

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
    reservation_id: "",
    amount: "",
    invoice: "",
    due_date: "",
    customer: "",
    sender_name: "",
  };
  featureImagePreview.value = null;
  // carModalOpen.value = false;
};

const deleteAction = async (id) => {
  const res = await reservationStore.deleteConfirmationLetterAction(id);
  editData.value.car_photo = null;
  featureImagePreview.value = null;
  // carModalOpen.value = false;
  toast.success("delete successfully");

  setTimeout(async () => {
    await props.getDetailAction(route.query.id, route.query.product_id);
  }, 1000);
};

const openPassportModal = (data) => {
  console.log(data, "this is data");
  // open passport modal
  if (data) {
    featureImagePreview.value = data.file;
    formData.value.id = data.id;
    formData.value.reservation_id = data.reservation_id;
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
  // carModalOpen.value = true;
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
  if (!dateString) return "";

  // Case 1: Replace 'T' with space
  if (dateString.includes("T")) {
    return dateString.replace("T", " ");
  }

  // Case 2: Check if it's in DD-MM-YYYY format with regex
  const ddmmyyyyRegex = /^(\d{2})-(\d{2})-(\d{4})\s(.*)$/;
  const match = dateString.match(ddmmyyyyRegex);

  if (match) {
    // match[1] = day, match[2] = month, match[3] = year, match[4] = time part
    return `${match[3]}-${match[2]}-${match[1]} ${match[4]}`;
  }

  // If it doesn't match any of our cases, return as-is
  return dateString;
};

const allReservation = ref(true);

const selectedReservationIds = computed(() => {
  return editData.value.reservation_ids
    .filter((item) => item.selected)
    .map((item) => item.id);
});

const askForReservationId = () => {
  // if (formData.value.id) {
  //   addTravellerUpdateAction();
  // } else {
  //   addAction();
  // }
  console.log(
    allReservation.value,
    editData.value.reservation_ids,
    "this is reservation"
  );
  processTravellerAction();
};

const processTravellerAction = async () => {
  try {
    loading.value = true;

    // Determine which reservation IDs to use
    let targetReservationIds = [];

    if (allReservation.value) {
      // Use all reservation IDs
      targetReservationIds = editData.value.reservation_ids.map(
        (item) => item.id
      );
    } else {
      // Use only selected reservation IDs
      targetReservationIds = selectedReservationIds.value;
    }

    // Process each reservation ID
    for (const reservationId of targetReservationIds) {
      if (!formData.value.id) {
        await addInvoiceAction(reservationId);
      }
      console.log("====================================");
      console.log(formData.value, "this is a valid reservation");
      console.log("====================================");
    }

    // Refresh data after all operations
  } catch (error) {
    console.error("Error processing traveller actions:", error);
    toast.error("An error occurred while processing");
  } finally {
    closeAction();
    loading.value = false;
    setTimeout(async () => {
      await props.getDetailAction(route.query.id, route.query.product_id);
    }, 3000);
  }
};

const addInvoiceAction = async (id) => {
  const frmData = new FormData();
  frmData.append("amount", formData.value.amount);
  frmData.append("invoice", formatDateDb(formData.value.invoice));
  frmData.append("due_date", formatDateDb(formData.value.due_date));
  frmData.append("customer", formData.value.customer);
  frmData.append("sender_name", formData.value.sender_name);

  frmData.append("file", editData.value.car_photo);

  const res = await reservationStore.bookingConfirmationAction(id, frmData);

  console.log(res, "this is res");

  toast.success(res.message);
};

const addInvoiceUpdateAction = async (id) => {
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
    id,
    formData.value.id,
    frmData
  );

  console.log(res, "this is res");
  closeAction();

  toast.success(res.message);

  // props.closeTravellerModal();
  setTimeout(async () => {
    await props.getDetailAction(route.query.id, route.query.product_id);
  }, 1000);
};

onMounted(() => {
  if (props.detail) {
    loading.value = true;
    booking_status.value = props?.detail?.booking?.items[0]?.booking_status;
    for (let i = 0; i < props.detail?.booking?.items.length; i++) {
      editData.value.reservation_ids.push({
        id: props.detail?.booking?.items[i].id,
        crm_id: props.detail?.booking?.items[i].crm_id,
        name:
          props.detail?.booking?.items[i].product_type == "App\\Models\\Hotel"
            ? props.detail?.booking?.items[i].room?.name
            : props.detail?.booking?.items[i].variation?.name,
        selected: false,
      });
      if (props.detail?.booking?.items[i].booking_confirm_letters.length > 0) {
        for (
          let a = 0;
          a < props.detail?.booking?.items[i].booking_confirm_letters.length;
          a++
        ) {
          editData.value.invoices.push({
            id: props.detail?.booking?.items[i].booking_confirm_letters[a].id,
            reservation_id: props.detail?.booking?.items[i].id,
            crm_id: props.detail?.booking?.items[i].crm_id,
            amount:
              props.detail?.booking?.items[i].booking_confirm_letters[a].amount,
            invoice:
              props.detail?.booking?.items[i].booking_confirm_letters[a]
                .invoice,
            due_date:
              props.detail?.booking?.items[i].booking_confirm_letters[a]
                .due_date,
            customer:
              props.detail?.booking?.items[i].booking_confirm_letters[a]
                .customer,
            sender_name: props.detail?.booking?.items[i]
              .booking_confirm_letters[a].sender_name
              ? props.detail?.booking?.items[i].booking_confirm_letters[a]
                  .sender_name
              : props?.detail?.booking?.items[i].product?.legal_name,
            file: props.detail?.booking?.items[i].booking_confirm_letters[a]
              .file,
          });
        }
      }
    }
    loading.value = false;
  }
});
</script>
