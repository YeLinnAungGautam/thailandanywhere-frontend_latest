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

const props = defineProps({
  data: Object || Array,
  loading: Boolean,
});

const carBookingStore = useCarBookingStore();
const supplierStore = useSupplierStore();
const driverStore = useDriverStore();
const authStore = useAuthStore();
const toast = useToast();

const { suppliers } = storeToRefs(supplierStore);
const { drivers } = storeToRefs(driverStore);
const { user } = storeToRefs(authStore);

const carModalOpen = ref(false);
const showDropDown = ref(false);

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
  const res = await driverStore.getDetailAction(id);
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
const emit = defineEmits();

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
  // console.log(formData.value.pickup_time);
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
        formData.value.is_driver_collect == 1 ? "1" : "0"
      );
    } else {
      frmData.append("is_driver_collect", "");
    }

    if (formData.value.is_driver_collect == 1) {
      frmData.append(
        "extra_collect_amount",
        formData.value.extra_collect_amount || ""
      );
    }
    frmData.append("route_plan", formData.value.route_plan);
    frmData.append("special_request", formData.value.special_request);
    const res = await carBookingStore.addNewAction(frmData, formData.value.id);
    console.log(res, "this is response");
    closeFunction();
    if ((res.status = "Request was successful.")) {
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
    // driver_collect: data.is_driver_collect == 1 ? "Yes" : "No",
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

const carOrderCopyFunction = async () => {
  const res = await carBookingStore.getDetailAction(props?.data.id);
  console.log("====================================");
  console.log(props.data, res, "this is order detail");
  console.log("====================================");

  let formattedOutput;
  if (res.status == "Request was successful.") {
    formattedOutput = `
CRMID: ${props?.data.crm_id}
C. Name: ${props?.data.customer_name}
Contact: ${res?.result?.driver_contact}

S.Date: ${props?.data.service_date}
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
    if (resDriver.status == "Request was successful.") {
      formattedOutput = `
    🆔 CRM ID : ${props?.data.crm_id}
    📝 Product Name : ${props?.data.product_name}
    📅 Departure Date : ${props?.data.service_date}
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
      <p class="w-[10%] text-[10px] py-2 px-2">{{ data?.service_date }}</p>
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
        class="w-[150px] text-[10px] py-2 px-2 flex justify-end items-center gap-4"
      >
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
            <!-- <input
              type="text"
              v-model="formData.car_number"
              id="name"
              class="h-9 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-300"
            /> -->
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
            <!-- <p class="text-sm font-normal">{{ driverInfoData?.car_image }}</p> -->
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
  </div>
</template>
