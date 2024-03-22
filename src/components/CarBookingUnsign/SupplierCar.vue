<script setup>
import HomeSecondPartVue from "../HomeSecondPart.vue";
import {
  HeartIcon,
  ExclamationCircleIcon,
  PuzzlePieceIcon,
  BanknotesIcon,
  BriefcaseIcon,
} from "@heroicons/vue/24/outline";
import { useCarBookingStore } from "../../stores/carbooking";
import { computed, onMounted, ref } from "vue";
import Pagination from "../Pagination.vue";
import Modal from "../Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useSupplierStore } from "../../stores/supplier";
import { useDriverStore } from "../../stores/driver";
import { storeToRefs } from "pinia";
import { useToast } from "vue-toastification";
import Button from "../Button.vue";
import { useAuthStore } from "../../stores/auth";

const supplierStore = useSupplierStore();
const driverStore = useDriverStore();
const toast = useToast();
const assignModalOpen = ref(false);
const carBookingStore = useCarBookingStore();
const authStore = useAuthStore();

const { suppliers } = storeToRefs(supplierStore);
const { drivers } = storeToRefs(driverStore);
const { user } = storeToRefs(authStore);

const formData = ref({
  id: "",
  supplier_id: "",
  driver_id: "",
  quantity: "",
  car_number: "",
  cost_price: "",
  extra_collect_amount: "",
  route_plan: "",
  special_request: "",
  driver_contact: "",
  car_photo: "",
});

const openModel = async (id) => {
  const res = await carBookingStore.getDetailAction(id);
  console.log(res, id, "this is detail");
  let data = res.result;
  formData.value = {
    id: data.id,
    supplier_id: data.supplier_id,
    driver_id: data.driver_id,
    driver_contact: data.driver_contact,
    car_number: data.car_number,
    quantity: data.quantity,
    cost_price: data.cost_price,
    total_cost_price: data.quantity * data.cost_price,
    extra_collect_amount: data.extra_collect,
    route_plan:
      data.route_plan == null || data.route_plan == "null"
        ? ""
        : data.route_plan,
    special_request: data.special_request,
  };
  assignModalOpen.value = true;
};

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
    route_plan: "",
    special_request: "",
    driver_contact: "",
    car_photo: "",
  };
  assignModalOpen.value = false;
};

const supplierAction = async () => {
  console.log(formData.value.supplier_id);
  const res = await driverStore.getSimpleListAction({
    supplier_id: formData.value.supplier_id,
  });
  console.log(drivers.value, "this is driver");
};

const total_cost_price = computed(() => {
  return formData.value.cost_price * formData.value.quantity;
});

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

const changePage = async (url) => {
  let first = props?.daterange[0];
  let second = props?.daterange[1];
  console.log(dateFormat(first), "this is date", dateFormat(second));
  let data = {
    first: dateFormat(first),
    second: dateFormat(second),
    supplier_id: props?.part != "unassigned" ? props?.part : "",
  };
  if (user.value.id != 1) {
    data.agent_id = user.value.id;
  } else {
    data.agent_id = props?.agent;
  }
  await carBookingStore.getChangePage(url, data);
};

const emit = defineEmits();
const onSubmitHandler = async () => {
  // console.log(formData.value.total_cost_price);
  try {
    const frmData = new FormData();
    frmData.append("supplier_id", formData.value.supplier_id);
    frmData.append("driver_id", formData.value.driver_id);
    frmData.append("driver_contact", formData.value.driver_contact);
    frmData.append("car_number", formData.value.car_number);
    frmData.append("cost_price", formData.value.cost_price);
    frmData.append("total_cost_price", total_cost_price.value);
    frmData.append("extra_collect_amount", formData.value.extra_collect_amount);
    frmData.append("route_plan", formData.value.route_plan);
    frmData.append("special_request", formData.value.special_request);
    const res = await carBookingStore.addNewAction(
      formData.value,
      formData.value.id
    );
    console.log(res, "this is response");
    closeFunction();
    if ((res.status = "Request was successful.")) {
      toast.success(res.message);
      emit("change", "updated");
    }
  } catch (error) {
    console.log(error, "this is error");
    toast.error(error.message);
  }
};

const props = defineProps({
  list: Object,
  loading: Boolean,
  part: String | Number,
  daterange: Array,
  agent: Number,
});

onMounted(async () => {
  await authStore.getMe();
  const supplier = await supplierStore.getSimpleListAction();
  const driver = await driverStore.getSimpleListAction();
});
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-start items-center space-x-3 col-span-3">
      <HomeSecondPartVue
        :icon="HeartIcon"
        :title="'Total Bookings'"
        :amount="list?.summary?.total_booking"
        :isActive="true"
      />
      <HomeSecondPartVue
        :icon="PuzzlePieceIcon"
        :title="'Total Sales'"
        :amount="list?.summary?.total_sales"
        :isActive="false"
      />
      <HomeSecondPartVue
        :icon="BanknotesIcon"
        :title="'Total Cost'"
        :amount="list?.summary?.total_cost"
        :isActive="false"
      />
      <HomeSecondPartVue
        :icon="BriefcaseIcon"
        :title="'Balance'"
        :amount="list?.summary?.total_balance"
        :isActive="false"
      />
    </div>
    <div class="overflow-auto rounded-lg shadow mb-5" v-if="!loading">
      <table class="w-full">
        <thead class="bg-gray-50 border-b-2 border-gray-200">
          <tr>
            <th class="px-4 py-2 text-xs font-medium tracking-wide text-left">
              CRM.ID
            </th>
            <th class="px-4 py-2 text-xs font-medium tracking-wide text-left">
              Service Date
            </th>
            <th
              class="px-4 py-2 text-xs font-medium w-[300px] overflow-hidden tracking-wide text-left"
            >
              Product Name
            </th>
            <th class="px-4 py-2 text-xs font-medium tracking-wide text-left">
              Variation
            </th>
            <th class="px-4 py-2 text-xs font-medium tracking-wide text-left">
              Payment
            </th>
            <th class="px-4 py-2 text-xs font-medium tracking-wide text-left">
              Payment Method
            </th>
            <th class="px-4 py-2 text-xs font-medium tracking-wide text-left">
              Price
            </th>
            <th class="px-4 py-2 text-xs font-medium tracking-wide text-left">
              Extras
            </th>
            <th class="px-4 py-2 text-xs font-medium tracking-wide text-left">
              Cost
            </th>
            <th class="px-4 py-2 text-xs font-medium tracking-wide text-left">
              Balance
            </th>
            <th
              class="px-4 py-2 text-xs font-medium tracking-wide text-left"
            ></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            class="bg-white even:bg-gray-50 hover:bg-gray-50"
            v-for="l in list?.data"
            :key="l"
          >
            <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
              {{ l.crm_id }}
            </td>
            <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
              {{ l.service_date }}
            </td>
            <td
              class="p-4 text-xs text-gray-700 max-w-[200px] overflow-hidden whitespace-nowrap"
            >
              {{ l.product_name }}
            </td>
            <td
              class="p-4 text-xs text-gray-700 max-w-[200px] overflow-hidden whitespace-nowrap"
            >
              {{ l.variation_name }}
            </td>
            <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
              {{ l.payment_status }}
            </td>
            <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
              {{ l.payment_method }}
            </td>
            <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
              {{ l.selling_price }}
            </td>
            <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
              {{ l.extra_collect_amount }}
            </td>
            <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
              {{ l.total_cost }}
            </td>
            <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
              {{ l.balance_amount }}
            </td>
            <td
              class="p-4 text-xs text-gray-700 whitespace-nowrap flex justify-center items-center gap-4"
            >
              <ExclamationCircleIcon class="w-5 h-5 cursor-pointer" />
              <button
                @click="openModel(l.id)"
                class="bg-[#FF5B00] text-white px-4 text-xs py-1 rounded-lg hover:shadow-md"
              >
                edit
              </button>
            </td>
          </tr>
          <tr class="" v-if="list?.data.length == 0">
            <td colspan="10 " class="text-center py-5">
              Ohh ! there isn't data !
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="px-4">
      <Pagination v-if="!loading" :data="list" @change-page="changePage" />
    </div>
    <Modal :isOpen="assignModalOpen" @closeModal="closeFunction">
      <DialogPanel
        class="w-full max-w-xl transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-semibold leading-6 text-[#FF5B00] mb-5"
        >
          {{
            formData.id
              ? "Assign Car Booking Vendor"
              : "Assign Car Booking Vendor"
          }}
        </DialogTitle>
        <form
          @submit.prevent="onSubmitHandler"
          class="mt-2 grid grid-cols-2 gap-4"
        >
          <div class="space-y-1">
            <label for="name" class="text-gray-800 text-xs"
              >Supplier Name</label
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
          </div>
          <div class="space-y-1">
            <label for="name" class="text-gray-800 text-xs">Car Number</label>
            <input
              type="text"
              v-model="formData.car_number"
              id="name"
              class="h-9 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-300"
            />
          </div>
          <div class="space-y-1">
            <label for="name" class="text-gray-800 text-xs">Driver Name</label>
            <v-select
              v-model="formData.driver_id"
              class="style-chooser bg-white rounded-lg"
              :options="drivers?.data"
              label="name"
              :clearable="false"
              :reduce="(d) => d.id"
            ></v-select>
          </div>
          <div class="space-y-1">
            <label for="name" class="text-gray-800 text-xs"
              >Cost Price & Quantity</label
            >
            <div class="flex justify-between items-center gap-2">
              <input
                type="number"
                v-model="formData.cost_price"
                id="name"
                class="h-9 col-span-2 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-300"
              />
              <input
                type="number"
                v-model="formData.quantity"
                id="name"
                disabled
                class="h-9 w-20 bg-gray-200 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-300"
              />
            </div>
          </div>
          <div class="space-y-1">
            <label for="name" class="text-gray-800 text-xs"
              >Driver Contact</label
            >
            <input
              type="text"
              v-model="formData.driver_contact"
              id="name"
              class="h-9 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-300"
            />
          </div>
          <div class="space-y-1">
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
          </div>
          <div class="col-span-2">
            <a
              :href="formData.car_photo"
              target="_blink"
              class="text-sm font-medium cursor-pointer text-orange-600"
              v-if="formData.car_photo"
              >car photo link -- click to see</a
            >
          </div>
          <div class="space-y-1 col-span-2">
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
          <div class="space-y-1 col-span-2">
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
          <div class="space-y-1 col-span-2">
            <label for="name" class="text-gray-800 text-xs"
              >Extra Collect</label
            >
            <input
              type="text"
              v-model="formData.extra_collect_amount"
              id="name"
              class="h-9 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-300"
            />
          </div>
          <div class="text-end col-span-2">
            <Button type="submit"> Submit </Button>
          </div>
        </form>
      </DialogPanel>
    </Modal>
  </div>
</template>