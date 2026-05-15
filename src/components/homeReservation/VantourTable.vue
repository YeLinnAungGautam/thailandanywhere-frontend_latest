<script setup>
import {
  PencilSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckBadgeIcon,
  InformationCircleIcon,
  XCircleIcon,
  DocumentDuplicateIcon,
  XMarkIcon,
  PaperAirplaneIcon, // Add this import
} from "@heroicons/vue/24/outline";
import { computed, onMounted, ref, defineEmits } from "vue";
import Modal from "../Modal.vue";
import Button from "../Button.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useCarBookingStore } from "../../stores/carbooking";
import { useSupplierStore } from "../../stores/supplier";
import { useDriverStore } from "../../stores/driver";
import { useAuthStore } from "../../stores/auth";
import { useToast } from "vue-toastification";
import { storeToRefs } from "pinia";
import { Switch } from "@headlessui/vue";
import { formattedDateTime } from "../../views/help/FormatData";
import LinePreviewModal from "./LinePreviewModal.vue";
import { useMessageStore } from "../../stores/message";

const props = defineProps({
  data: Object || Array,
  loading: Boolean,
  sentToLine: Function,
});

const carBookingStore = useCarBookingStore();
const supplierStore = useSupplierStore();
const driverStore = useDriverStore();
const authStore = useAuthStore();
const messageStore = useMessageStore();
const toast = useToast();

const { suppliers } = storeToRefs(supplierStore);
const { drivers } = storeToRefs(driverStore);
const { user } = storeToRefs(authStore);

const carModalOpen = ref(false);
const showDropDown = ref(false);
const showLineModal = ref(false); // LINE modal state
const lineBookingData = ref(null); // Data for LINE modal

// Open LINE modal — seeds all fields including the 3 new ones
// ── Replace the two functions inside <script setup> ──────────────────────────

// Open LINE modal — seeds all fields including the 3 new ones
const openLineModal = async () => {
  try {
    const res = await carBookingStore.getDetailAction(props?.data.id);

    if (res.status == 1) {
      lineBookingData.value = {
        id: props?.data.id,
        crm_id: props?.data.crm_id,
        customer_name: props?.data.customer_name,
        contact: res?.result?.driver_contact || "null",
        service_date: formattedDateTime(props?.data.service_date),
        pickup_time: props?.data.pickup_time || "",
        pickup_location: props?.data.pickup_location || "",
        dropoff_location: props?.data.dropoff_location || "",
        route_plan: props?.data.route_plan || "",
        product_variation: props?.data.variation_name,
        // Always send the real values — the modal toggle controls visibility.
        // If we sent "xxxx" here, the sale_amount computation would break
        // when the user flips is_driver_collect ON inside the modal.
        payment_method: props?.data.payment_method || "",
        sale_amount: props?.data.selling_price || 0,
        extra_collect: props?.data.extra_collect_amount || 0,
        special_request: props?.data.special_request || "",
        is_driver_collect: props?.data.is_driver_collect,
        // ── new fields from DB ───────────────────────────────────────────
        car_customer_contact: res?.result?.car_customer_contact || "",
        car_total_collect: res?.result?.car_total_collect || "",
        car_payment_method: res?.result?.car_payment_method || "",
      };

      showLineModal.value = true;
    }
  } catch (error) {
    toast.error("Failed to load booking details");
  }
};

// Save booking fields + send LINE message
const handleSendToLine = async (data) => {
  try {
    const payload = {
      pickup_time: data.editedData.pickup_time,
      pickup_location: data.editedData.pickup_location,
      dropoff_location: data.editedData.dropoff_location,
      route_plan: data.editedData.route_plan,
      special_request: data.editedData.special_request,
      is_driver_collect: data.editedData.is_driver_collect,
      extra_collect_amount: data.editedData.is_driver_collect
        ? data.editedData.extra_collect
        : "0",
      // ── new fields ──────────────────────────────────────────────────────
      car_customer_contact: data.editedData.car_customer_contact,
      car_total_collect: data.editedData.car_total_collect,
      car_payment_method: data.editedData.car_payment_method,
      // ── diff / history ──────────────────────────────────────────────────
      message: data.message,
      edited_data: data.editedData,
    };

    const saveRes = await carBookingStore.sendLineAction(
      lineBookingData.value.id,
      payload,
    );

    if (saveRes.status != 1) {
      toast.error("Failed to save booking");
      return;
    }

    // Send to LINE via Node.js — use the assembled message from Laravel
    await messageStore.sendLineMessage(
      saveRes.result?.sent_message ?? data.message,
    );

    toast.success("Saved & sent to LINE");
    showLineModal.value = false;
    lineBookingData.value = null;
    emit("change", "updated");
  } catch (error) {
    console.error("Error sending to LINE:", error);
    toast.error(error.response?.data?.message || "Failed to send to LINE");
  }
};

// Handle saving and sending to LINE
// const handleSendToLine = async (data) => {
//   try {
//     const frmData = new FormData();

//     frmData.append("pickup_time", data.editedData.pickupTime || "");
//     frmData.append("pickup_location", data.editedData.pickupLocation || "");
//     frmData.append("dropoff_location", data.editedData.dropoffLocation || "");
//     frmData.append("route_plan", data.editedData.routePlan || "");
//     frmData.append("special_request", data.editedData.specialRequest || "");

//     // Always save is_driver_collect based on the modal toggle
//     frmData.append(
//       "is_driver_collect",
//       data.editedData.isDriverCollect ? "1" : "0",
//     );

//     if (data.editedData.isDriverCollect) {
//       frmData.append(
//         "extra_collect_amount",
//         data.editedData.extraCollect || "0",
//       );
//       // selling_price / sale amount — append if your API supports updating it
//       // frmData.append("selling_price", data.editedData.saleAmount || "0");
//     } else {
//       // Clear payment fields if driver collect is turned off
//       frmData.append("payment_method", "");
//       frmData.append("extra_collect_amount", "0");
//     }

//     const updateRes = await carBookingStore.addNewAction(
//       frmData,
//       lineBookingData.value.id,
//     );

//     if (updateRes.status == 1) {
//       toast.success("Booking updated successfully");
//       await messageStore.sendLineMessage(data.message);
//       showLineModal.value = false;
//       emit("change", "updated");
//     }
//   } catch (error) {
//     console.error("Error updating booking:", error);
//     toast.error(error.response?.data?.message || "Failed to update booking");
//   }
// };

// Close LINE modal
const closeLineModal = () => {
  showLineModal.value = false;
  lineBookingData.value = null;
};

const total_cost_price = computed(() => {
  return formData.value.cost_price * formData.value.quantity;
});

const formData = ref({
  id: "",
  supplier_id: "",
  driver_id: "",
  quantity: "",
  car_number: "",
  cost_price: "",
  extra_collect_amount: "",
  is_driver_collect: "",
  contact_number: "",
  total_pax: "",
  collect_comment: "",
  route_plan: "",
  special_request: "",
  driver_contact: "",
  car_photo: "",
  pickup_location: "",
  dropoff_location: "",
  pickup_time: "",
});

const supplierAction = async () => {
  console.log(formData.value.supplier_id);
  const res = await driverStore.getSimpleListAction({
    supplier_id: formData.value.supplier_id,
  });
  console.log(drivers.value, "this is driver");
};

const driverCarNumberList = ref(null);
const driverAction = async (id) => {
  console.log(id);
  const res = await driverStore.getDetailAction(id?.id ? id?.id : id);
  console.log(res, "this is driver detail action");
  let data = res.result;
  formData.value.driver_contact = data.contact;
  driverCarNumberList.value = data.infos;
  driverInfoData.value.car_image = data.car_photo;
  if (data.infos.length > 0) {
    data.infos.forEach((num) => {
      if (num.is_default == 1) {
        formData.value.car_number = num.id;
      }
    });
  }
};

const errors = ref(null);
const emit = defineEmits(["change", "send-to-line"]); // Add 'send-to-line' to emits

const closeFunction = () => {
  formData.value = {
    id: "",
    supplier_id: "",
    driver_id: "",
    quantity: "",
    car_number: "",
    cost_price: "",
    total_cost_price: "",
    extra_collect_amount: "",
    is_driver_collect: "",
    contact_number: "",
    total_pax: "",
    collect_comment: "",
    route_plan: "",
    special_request: "",
    driver_contact: "",
    car_photo: "",
    pickup_location: "",
    dropoff_location: "",
    pickup_time: "",
  };
  errors.value = null;
  carModalOpen.value = false;
};

const onSubmitHandler = async () => {
  try {
    const frmData = new FormData();
    frmData.append("supplier_id", formData.value.supplier_id ?? "");
    frmData.append("driver_id", formData.value.driver_id ?? "");
    frmData.append("driver_contact", formData.value.driver_contact ?? "");
    frmData.append("driver_info_id", formData.value.car_number ?? "");
    frmData.append("pickup_location", formData.value.pickup_location ?? "");
    frmData.append("dropoff_location", formData.value.dropoff_location ?? "");
    frmData.append("contact_number", formData.value.contact_number ?? "");
    frmData.append("total_pax", formData.value.total_pax ?? "");
    frmData.append("collect_comment", formData.value.collect_comment ?? "");
    frmData.append("pickup_time", formData.value.pickup_time ?? "");
    if (formData.value.cost_price != "" && formData.value.cost_price != null) {
      frmData.append("cost_price", formData.value.cost_price);
    }
    if (
      total_cost_price.value != "" &&
      total_cost_price.value != "NaN" &&
      formData.value.cost_price != ""
    ) {
      frmData.append("total_cost_price", total_cost_price.value);
    }

    if (formData.value.is_driver_collect != "") {
      frmData.append(
        "is_driver_collect",
        formData.value.is_driver_collect == 1 ? "1" : "0",
      );
    } else {
      frmData.append("is_driver_collect", "");
    }

    if (formData.value.is_driver_collect == 1) {
      frmData.append(
        "extra_collect_amount",
        formData.value.extra_collect_amount || "",
      );
    }
    frmData.append("route_plan", formData.value.route_plan);
    frmData.append("special_request", formData.value.special_request);
    const res = await carBookingStore.addNewAction(frmData, formData.value.id);
    console.log(res, "this is response");
    closeFunction();
    if ((res.status = 1)) {
      toast.success(res.message);
      errors.value = null;
      emit("change", "updated");
    }
  } catch (error) {
    console.log(error, "this is error");
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
      console.log(errors.value, "this is error");
    }
    toast.error(error.message);
  }
};

const openModel = async () => {
  await supplierStore.getSimpleListAction();
  await driverStore.getSimpleListAction();
  const res = await carBookingStore.getDetailAction(props?.data.id);
  console.log(res, "this is detail");
  let data = res.result;
  formData.value = {
    id: data.id,
    supplier_id: data.supplier_id,
    driver_id: data.driver_id,
    driver_name: data.driver_name,
    driver_contact: data.driver_contact,
    car_number: data.driver_info_id,
    quantity: data.quantity,
    cost_price: data.cost_price,
    total_cost_price: data.quantity * data.cost_price,
    extra_collect_amount: data.extra_collect,
    route_plan:
      data.route_plan == null || data.route_plan == "null"
        ? ""
        : data.route_plan,
    special_request: data.special_request,
    pickup_location: data.pickup_location,
    dropoff_location: data.dropoff_location,
    contact_number: data.contact_number,
    total_pax: data.total_pax,
    collect_comment: data.collect_comment,
    is_driver_collect:
      data.is_driver_collect == null ? "" : data.is_driver_collect,
    pickup_time: data.pickup_time,
  };

  if (formData.value.supplier_id) {
    await supplierAction();
  }
  if (formData.value.driver_id) {
    await driverAction(formData.value.driver_id);
  }

  carModalOpen.value = true;
};

const driverInfoData = ref({
  driver_name: "",
  supplier_name: "",
  supplier_id: "",
  driver_id: "",
  phone: "",
  car_number: "",
  driver_collect: "",
  extra_collect: "",
  total_collect: "",
  car_image: null,
});

const closeInfoModal = () => {
  driverInfoData.value = {
    driver_name: "",
    supplier_name: "",
    phone: "",
    car_number: "",
    driver_collect: "",
    extra_collect: "",
    total_collect: "",
    car_image: null,
    supplier_id: "",
    driver_id: "",
  };
  showInfoModal.value = false;
};

const loadingInfo = ref(false);
const openInfoModal = async () => {
  showInfoModal.value = true;
  loadingInfo.value = true;

  const res = await carBookingStore.getDetailAction(props?.data.id);
  console.log(res, "this is detail");
  let data = res.result;
  driverInfoData.value = {
    driver_name: data.driver_name,
    driver_id: data.driver_id,
    supplier_name: data.supplier_name,
    phone: data.driver_contact,
    car_number: data.car_number,
    is_driver_collect:
      data.is_driver_collect == null
        ? "Empty"
        : data.is_driver_collect == 1
        ? "Yes"
        : "No",
    extra_collect: data.extra_collect,
    total_collect: 0,
    supplier_id: data.supplier_id,
  };

  if (driverInfoData.value.driver_id) {
    await driverAction(driverInfoData.value.driver_id);
  }

  loadingInfo.value = false;
};

const permission = ref(false);
const showInfoModal = ref(false);

const complete = computed(() => {
  if (props.data) {
    switch (user.value.role) {
      case "super_admin":
        return (
          props.data.supplier_name != null &&
          props.data.driver_info_id != null &&
          props.data.car_number != null &&
          props.data.pickup_time != null &&
          props.data.route_plan != null
        );
      case "reservation":
        return (
          props.data.supplier_name != null &&
          props.data.driver_info_id != null &&
          props.data.car_number != null
        );
      case "admin":
        return props.data.pickup_time != null && props.data.route_plan != null;
      default:
        return false;
    }
  }
  return false;
});

// Add this function to handle sending to LINE
const sendToLineHandler = async () => {
  const res = await carBookingStore.getDetailAction(props?.data.id);

  if (res.status == 1) {
    const bookingData = {
      crm_id: props?.data.crm_id,
      customer_name: props?.data.customer_name,
      contact: res?.result?.driver_contact || null,
      service_date: formattedDateTime(props?.data.service_date),
      pickup_time: props?.data.pickup_time,
      pickup_location: props?.data.pickup_location,
      dropoff_location: props?.data.dropoff_location,
      route_plan: props?.data.route_plan,
      product_variation: props?.data.variation_name,
      payment_method:
        props?.data.is_driver_collect == 1
          ? props?.data.payment_method
          : "xxxx",
      sale_amount:
        props?.data.is_driver_collect == 1 ? props?.data.selling_price : "xxxx",
      extra_collect:
        props?.data.is_driver_collect == 1
          ? props?.data.extra_collect_amount
          : "0",
      special_request: props?.data.special_request,
    };

    emit("send-to-line", bookingData);
  }
};

const carOrderCopyFunction = async () => {
  const res = await carBookingStore.getDetailAction(props?.data.id);
  console.log("====================================");
  console.log(props.data, res, "this is order detail");
  console.log("====================================");

  let formattedOutput;
  if (res.status == 1) {
    formattedOutput = `
CRMID: ${props?.data.crm_id}
C. Name: ${props?.data.customer_name}
Contact: ${res?.result?.driver_contact}

S.Date: ${formattedDateTime(props?.data.service_date)}
Pickup Time: ${props?.data.pickup_time}
Pickup Location: ${props?.data.pickup_location}
Dropoff Location: ${props?.data.dropoff_location}

Routeplan: ${props?.data.route_plan}

Product Variation: ${props?.data.variation_name}
PaymentMethod: ${
      props?.data.is_driver_collect == 1 ? props?.data.payment_method : "xxxx"
    }
SaleAmount: ${
      props?.data.is_driver_collect == 1 ? props?.data.selling_price : "xxxx"
    }
ExtraCollect: ${
      props?.data.is_driver_collect == 1
        ? props?.data.extra_collect_amount
        : "0"
    }

SpecialRequest: ${props?.data.special_request}
        `;
  }

  setTimeout(() => {
    navigator.clipboard.writeText(formattedOutput);
  }, 0);

  toast.success("success copy reservation");
};

const copyFunction = async () => {
  const res = await carBookingStore.getDetailAction(props?.data.id);
  console.log(res, "this is copy function");

  if (res.result?.driver_id != null) {
    const resDriver = await driverStore.getDetailAction(res?.result?.driver_id);
    console.log(resDriver, "this is cpy res");
    let formattedOutput;
    if (resDriver.status == 1) {
      formattedOutput = `
    🆔 CRM ID : ${props?.data.crm_id}
    📝 Product Name : ${props?.data.product_name}
    📅 Departure Date : ${formattedDateTime(props?.data.service_date)}
    🕧 Pickup Time : ${props?.data.pickup_time}
    🧑‍✈️ Driver Name : ${resDriver?.result.name}
    ☎️ Driver Contact : ${resDriver?.result.contact}
    🚗 Car Number : ${resDriver?.result.infos[0]?.car_number}
    💸 Driver Collect : ${
      props?.data.is_driver_collect == null
        ? "Empty"
        : props?.data.is_driver_collect == 1
        ? "Yes"
        : "No"
    }
    💰 Total Collect : ${
      props?.data.selling_price * 1 + props?.data.extra_collect_amount * 1
    } thb
          `;
    }

    setTimeout(() => {
      navigator.clipboard.writeText(formattedOutput);
    }, 0);

    toast.success("success copy reservation");
  } else {
    toast.error("Driver Information not found");
  }
};

onMounted(async () => {
  if (props?.data) {
    formData.value = {
      id: props.data.id,
      supplier_id: props.data?.supplier_id,
      driver_id: props.data?.driver_info_id,
      quantity: props?.data?.quantity ?? 1,
      car_number: props?.data?.car_number,
      cost_price: props?.data.cost_price,
      extra_collect_amount: props?.data?.extra_collect_amount,
      is_driver_collect: props.data.is_driver_collect,
      route_plan: props.data.route_plan,
      special_request: props.data.special_request,
      driver_contact: "",
      car_photo: "",
      pickup_location: props.data.pickup_location,
      dropoff_location: props.data.dropoff_location,
      pickup_time: props.data.pickup_time,
    };
  }
});
</script>

<template>
  <div v-if="!loading">
    <div class="w-full bg-white flex items-center rounded-md pl-2">
      <p class="w-[10%] text-[10px] py-2 px-2">{{ data?.crm_id }}</p>
      <p class="w-[10%] text-[10px] py-2 px-2">
        {{ formattedDateTime(data?.service_date) }}
      </p>
      <p class="w-[10%] text-[10px] py-2 px-2">{{ data?.customer_name }}</p>
      <p class="w-[20%] text-[10px] py-2 px-2">{{ data?.product_name }}</p>
      <p class="w-[10%] text-[10px] py-2 px-2">{{ data?.variation_name }}</p>
      <div class="w-[15%] text-[10px] py-2 px-2">
        <CheckBadgeIcon
          class="w-5 h-5 text-green-600"
          v-if="data?.is_driver_collect == 1"
        />
        <XCircleIcon
          class="w-5 h-5 text-red-600"
          v-if="data?.is_driver_collect == 0"
        />
      </div>
      <div class="w-[10%] text-[10px] py-2 px-2">
        <p class="">
          {{ data?.supplier_name }}
        </p>
      </div>
      <p class="w-[10%] text-[10px] py-2 px-2 text-[#ff613c] font-semibold">
        {{ data?.selling_price * 1 + data?.extra_collect_amount * 1 }} thb
      </p>
      <div class="w-[10%] text-[10px] py-2 px-2 text-[#ff613c] font-semibold">
        <p class="text-green-600" v-if="complete">R.complete</p>
        <p class="text-red-600" v-if="!complete">R.incomplete</p>
      </div>

      <div
        class="w-[150px] text-[10px] py-2 px-2 flex justify-end items-center gap-3"
      >
        <!-- Send to LINE Button -->
        <!-- <button
          @click="sendToLineHandler"
          class="hover:scale-110 transition-transform"
          title="Send to LINE"
        >
          <svg
            class="w-4 h-4 text-[#06C755] hover:text-[#05b04b] cursor-pointer"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"
            />
          </svg>
        </button> -->
        <button
          @click="openLineModal"
          class="hover:scale-110 transition-transform"
          title="Send to LINE"
        >
          <svg
            class="w-4 h-4 text-[#06C755] hover:text-[#05b04b] cursor-pointer"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"
            />
          </svg>
        </button>
        <DocumentDuplicateIcon
          @click="carOrderCopyFunction"
          class="w-4 h-4 cursor-pointer hover:text-orange-600"
        />
        <InformationCircleIcon
          @click="openInfoModal"
          class="w-4 h-4 cursor-pointer hover:text-orange-600"
        />
        <ChevronDownIcon
          v-if="!showDropDown"
          class="w-4 h-4 cursor-pointer hover:text-orange-600"
          @click="showDropDown = !showDropDown"
        />
        <ChevronUpIcon
          v-if="showDropDown"
          class="w-4 h-4 cursor-pointer hover:text-orange-600"
          @click="showDropDown = !showDropDown"
        />
        <PencilSquareIcon
          @click="openModel"
          class="w-4 h-4 cursor-pointer hover:text-orange-600"
        />
      </div>
    </div>

    <!-- Rest of the template remains the same -->
    <div
      class="w-full bg-gray-300 flex items-center rounded-md pl-2"
      v-if="showDropDown"
    >
      <p class="w-[26%] text-[10px] py-1.5 px-2 font-medium">Route Plan</p>
      <p class="w-[26%] text-[10px] py-1.5 px-2 font-medium">Special Request</p>
      <p class="w-[15%] text-[10px] py-1.5 px-2 font-medium">Pickup Time</p>
      <p class="w-[15%] text-[10px] py-1.5 px-2 font-medium">Sale Amount</p>
      <p class="w-[15%] text-[10px] py-1.5 px-2 font-medium">Extra Amount</p>
    </div>
    <form
      @submit.prevent=""
      class="w-full bg-gray-200 flex items-start rounded-md pl-2"
      v-if="showDropDown"
    >
      <div class="w-[26%] text-[10px] py-2 px-2">
        <textarea
          name=""
          class="w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-300"
          id=""
          v-model="formData.route_plan"
          cols="5"
          rows="2"
        ></textarea>
      </div>
      <div class="w-[26%] text-[10px] py-2 px-2">
        <textarea
          name=""
          class="w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-300"
          id=""
          v-model="formData.special_request"
          cols="5"
          rows="2"
        ></textarea>
      </div>
      <div class="w-[15%] text-[10px] py-2 px-2">
        <input
          type="time"
          name=""
          v-model="formData.pickup_time"
          class="w-full bg-white/50 border h-8 border-gray-300 rounded-md shadow-sm px-4 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-300"
          id=""
        />
      </div>
      <div class="w-[15%] text-[10px] py-2 px-2">
        <input
          type="number"
          v-model="data.selling_price"
          disabled
          name=""
          class="w-full bg-white/50 border h-8 border-gray-300 rounded-md shadow-sm px-4 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-300"
          id=""
        />
      </div>
      <div class="w-[15%] text-[10px] py-2 px-2">
        <input
          type="number"
          v-if="data.is_driver_collect == 1"
          v-model="formData.extra_collect_amount"
          name=""
          class="w-full bg-white/50 border h-8 border-gray-300 rounded-md shadow-sm px-4 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-300"
          id=""
        />
      </div>
    </form>

    <!-- Modals remain the same -->
    <Modal :isOpen="carModalOpen" @closeModal="carModalOpen = false">
      <DialogPanel
        class="w-full max-w-md transform rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h5"
          class="text-base font-semibold leading-6 text-[#ff613c] mb-5"
        >
          {{
            permission
              ? "Assign Car Booking Vendor"
              : "Complete Car Information"
          }}
        </DialogTitle>
        <form
          @submit.prevent="onSubmitHandler"
          class="mt-2 grid grid-cols-2 gap-4 relative"
        >
          <input
            type="text"
            name=""
            class="opacity-0 col-span-2 absolute top-0"
            id=""
          />
          <div class="space-y-1" v-if="user.role != 'admin'">
            <label for="name" class="text-gray-800 text-xs"
              >Supplier Name
              <span class="text-red-600 text-base pl-2">*</span></label
            >
            <v-select
              v-model="formData.supplier_id"
              class="style-chooser bg-white rounded-lg"
              :options="suppliers?.data"
              @option:selected="supplierAction"
              label="name"
              :clearable="false"
              :reduce="(d) => d.id"
            ></v-select>
            <p v-if="errors?.supplier_id" class="mt-1 text-sm text-red-600">
              {{ errors.supplier_id[0] }}
            </p>
          </div>
          <div class="space-y-1" v-if="user.role != 'admin'">
            <label for="name" class="text-gray-800 text-xs">Car Number</label>
            <v-select
              v-model="formData.car_number"
              class="style-chooser bg-white rounded-lg"
              :options="driverCarNumberList ?? []"
              label="car_number"
              :clearable="false"
              :reduce="(d) => d.id"
            ></v-select>
            <p v-if="errors?.driver_info_id" class="mt-1 text-sm text-red-600">
              {{ errors.driver_info_id[0] }}
            </p>
          </div>
          <div class="space-y-1" v-if="user.role != 'admin'">
            <label for="name" class="text-gray-800 text-xs">Driver Name</label>
            <v-select
              v-model="formData.driver_id"
              class="style-chooser bg-white rounded-lg"
              :options="drivers?.data"
              @option:selected="driverAction"
              label="name"
              :clearable="false"
              :reduce="(d) => d.id"
            ></v-select>
            <p v-if="errors?.driver_id" class="mt-1 text-sm text-red-600">
              {{ errors.driver_id[0] }}
            </p>
          </div>
          <div class="space-y-1" v-if="user.role != 'admin'">
            <div class="flex justify-between items-center gap-2">
              <div class="space-y-1">
                <label for="name" class="text-gray-800 text-xs"
                  >Cost Price</label
                >
                <input
                  type="number"
                  v-model="formData.cost_price"
                  id="name"
                  class="h-9.5 col-span-2 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-300"
                />
              </div>
              <div class="space-y-1">
                <label for="name" class="text-gray-800 text-xs">Quantity</label>
                <input
                  type="number"
                  v-model="formData.quantity"
                  id="name"
                  disabled
                  class="h-9.5 w-20 bg-gray-200 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-300"
                />
              </div>
            </div>
            <p v-if="errors?.cost_price" class="mt-1 text-sm text-red-600">
              {{ errors.cost_price[0] }}
            </p>
          </div>
          <div class="space-y-1" v-if="user.role != 'admin'">
            <label for="name" class="text-gray-800 text-xs"
              >Driver Contact</label
            >
            <input
              type="text"
              v-model="formData.driver_contact"
              id="name"
              class="h-9 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.driver_contact" class="mt-1 text-sm text-red-600">
              {{ errors.driver_contact[0] }}
            </p>
          </div>
          <div class="space-y-1" v-if="user.role != 'admin'">
            <label for="name" class="text-gray-800 text-xs"
              >Total Cost Price</label
            >
            <input
              type="number"
              disabled
              v-model="total_cost_price"
              id="name"
              class="h-9 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-300"
            />
            <p
              v-if="errors?.total_cost_price"
              class="mt-1 text-sm text-red-600"
            >
              {{ errors.total_cost_price[0] }}
            </p>
          </div>
          <div class="col-span-2" v-if="user.role != 'admin'">
            <a
              :href="formData.car_photo"
              target="_blink"
              class="text-sm font-medium cursor-pointer text-orange-600"
              v-if="formData.car_photo"
              >car photo link -- click to see</a
            >
          </div>
          <div class="space-y-1 col-span-2" v-if="user.role != 'reservation'">
            <label for="name" class="text-gray-800 text-xs">Pickup Time</label>
            <input
              type="time"
              name=""
              v-model="formData.pickup_time"
              id=""
              class="h-10 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-300"
            />
          </div>
          <div class="space-y-1 col-span-2" v-if="user.role != 'reservation'">
            <label for="name" class="text-gray-800 text-xs">Route Plan</label>
            <textarea
              name=""
              v-model="formData.route_plan"
              id=""
              class="w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-300"
              cols="30"
              rows="3"
            ></textarea>
          </div>
          <div class="space-y-1 col-span-2" v-if="user.role != 'reservation'">
            <label for="name" class="text-gray-800 text-xs"
              >Special Request & Notes</label
            >
            <textarea
              name=""
              id=""
              v-model="formData.special_request"
              class="w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-300"
              cols="30"
              rows="3"
            ></textarea>
          </div>
          <div class="space-y-1 col-span-2" v-if="user.role != 'reservation'">
            <label for="name" class="text-gray-800 text-xs"
              >Pickup Location</label
            >
            <textarea
              name=""
              id=""
              v-model="formData.pickup_location"
              class="w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-300"
              cols="30"
              rows="3"
            ></textarea>
          </div>
          <div class="space-y-1 col-span-2" v-if="user.role != 'reservation'">
            <label for="name" class="text-gray-800 text-xs"
              >Dropoff Location</label
            >
            <textarea
              name=""
              id=""
              v-model="formData.dropoff_location"
              class="w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-300"
              cols="30"
              rows="3"
            ></textarea>
          </div>

          <div class="space-y-1 col-span-1" v-if="user.role != 'reservation'">
            <label for="name" class="text-gray-800 text-xs"
              >Is Driver Collect ?</label
            >
            <div class="pt-2">
              <Switch
                v-model="formData.is_driver_collect"
                :class="
                  formData.is_driver_collect ? 'bg-orange-600' : 'bg-gray-200'
                "
                class="relative inline-flex h-6 w-11 items-center rounded-full"
              >
                <span class="sr-only">Enable notifications</span>
                <span
                  :class="
                    formData.is_driver_collect
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  "
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                />
              </Switch>
            </div>
          </div>
          <div
            class="space-y-1 col-span-1"
            v-if="formData.is_driver_collect && !permission"
          >
            <label for="name" class="text-gray-800 text-xs"
              >Total Collect</label
            >
            <input
              type="text"
              v-model="formData.extra_collect_amount"
              id="name"
              class="h-10 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-300"
            />
          </div>
          <div class="text-end col-span-2">
            <Button type="submit"> Assign </Button>
          </div>
        </form>
      </DialogPanel>
    </Modal>
    <Modal :isOpen="showInfoModal" @closeModal="closeInfoModal">
      <DialogPanel
        class="w-full max-w-md transform rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-base flex justify-between items-center font-semibold leading-6 text-[#ff613c] mb-5"
        >
          <p>Driver Information</p>
          <button @click="closeInfoModal"><XMarkIcon class="w-5 h-5" /></button>
        </DialogTitle>
        <div v-if="loadingInfo">
          <p class="text-sm text-red-600 py-6 text-center">
            Form is loading , Please wait
          </p>
        </div>
        <div class="grid grid-cols-2 gap-6" v-if="!loadingInfo">
          <div class="space-y-2">
            <p class="text-xs font-semibold">Name of Driver :</p>
            <p class="text-sm font-normal">{{ driverInfoData?.driver_name }}</p>
          </div>
          <div class="space-y-2">
            <p class="text-xs font-semibold">Supplier Name :</p>
            <p class="text-sm font-normal">
              {{ driverInfoData?.supplier_name }}
            </p>
          </div>
          <div class="space-y-2">
            <p class="text-xs font-semibold">Mobile Number (Contact) :</p>
            <p class="text-sm font-normal">{{ driverInfoData?.phone }}</p>
          </div>
          <div class="space-y-2">
            <p class="text-xs font-semibold">Car Number :</p>
            <p class="text-sm font-normal">{{ driverInfoData?.car_number }}</p>
          </div>
          <div class="space-y-2">
            <p class="text-xs font-semibold">Dirver Collect :</p>
            <p class="text-sm font-normal">
              {{ driverInfoData?.driver_collect }}
            </p>
          </div>
          <div class="space-y-2">
            <p class="text-xs font-semibold">Extra Collect :</p>
            <p class="text-sm font-normal">
              {{ driverInfoData?.extra_collect }}
            </p>
          </div>
          <div class="space-y-2">
            <p class="text-xs font-semibold">Total Collect :</p>
            <p class="text-sm font-normal">
              {{ driverInfoData?.total_collect }}
            </p>
          </div>
          <div class="space-y-2 col-span-2">
            <p class="text-xs font-semibold">Car Image :</p>
            <img
              :src="driverInfoData?.car_image"
              class="pt-4"
              alt=""
              v-if="driverInfoData.car_image != null"
            />
            <p
              v-if="driverInfoData.car_image == null"
              class="text-xs font-medium pt-6 text-red-600 text-center"
            >
              Image isn't have
            </p>
          </div>
          <div class="col-span-2">
            <p
              @click="copyFunction"
              class="bg-[#FF5B00] text-center text-xs rounded-md py-2 text-white cursor-pointer"
            >
              copy for car order
            </p>
          </div>
        </div>
      </DialogPanel>
    </Modal>
    <LinePreviewModal
      v-if="showLineModal"
      :bookingData="lineBookingData"
      @close="closeLineModal"
      @send="handleSendToLine"
    />
  </div>
</template>
