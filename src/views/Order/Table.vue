<template>
  <div>
    <table
      class="w-full text-sm text-left text-gray-500 mb-4 dark:text-gray-400 rounded overflow-hidden"
    >
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-[#FF613c] dark:text-gray-100"
      >
        <tr class="">
          <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
            ORDER ID
          </th>

          <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
            USER NAME
          </th>
          <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
            CUSTOMER
          </th>
          <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
            ORDER CREATE
          </th>
          <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
            AGENT
          </th>
          <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
            ORDER STATUS
          </th>
          <th scope="col" class="px-3 py-3 text-end">AMOUNT</th>
          <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
            CONTACT
          </th>
          <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
            ACTIONS
          </th>
        </tr>
      </thead>

      <tbody class="border border-gray-400/20" v-if="!loading">
        <tr
          v-for="l in booking?.data ?? []"
          :key="l.id"
          class="border border-gray-400/20 hover:bg-[#FF613c]/10 cursor-pointer even:bg-gray-50"
          :class="{ 'bg-[#FF613c]/20': selectedRow === l.id }"
          @click="handleRowClick(l)"
        >
          <td
            scope="col"
            class="text-[11px] font-medium text-blue-600 px-3 py-3 border-l border-gray-400/20"
          >
            {{ l.order_number }}
          </td>
          <td
            scope="col"
            class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
          >
            {{ l?.user?.name }}
          </td>
          <td
            scope="col"
            class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
          >
            {{ l?.customer?.name }}
          </td>
          <td
            scope="col"
            class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
          >
            {{ l?.admin?.name }}
          </td>
          <td
            scope="col"
            class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
          >
            {{ getFormatDate(l?.order_datetime.split("T")[0]) }}
          </td>
          <td
            scope="col"
            class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
          >
            <span
              v-if="l?.order_status === 'confirmed'"
              class="text-[10px] font-medium text-green-600 px-3 py-1 rounded-lg bg-green-600/10"
              >Confirmed</span
            >
            <span
              v-if="l?.order_status === 'sale_convert'"
              class="text-[10px] font-medium text-blue-600 px-3 py-1 rounded-lg bg-blue-600/10"
              >Sale_convert</span
            >
            <span
              v-if="l?.order_status === 'processing'"
              class="text-[10px] font-medium text-yellow-800 px-3 py-1 rounded-lg bg-yellow-500/10"
              >Processing</span
            >
            <span
              v-if="l?.order_status === 'pending'"
              class="text-[10px] font-medium text-orange-600 px-3 py-1 rounded-lg bg-orange-600/10"
              >Pending</span
            >
            <span
              v-if="l?.order_status === 'cancelled'"
              class="text-[10px] font-medium text-gray-600 px-3 py-1 rounded-lg bg-gray-600/10"
              >Cancelled</span
            >
          </td>
          <td
            scope="col"
            class="text-[14px] font-semibold text-gray-800 px-3 py-3 text-end"
          >
            ฿ {{ l?.grand_total }}
          </td>
          <td
            scope="col"
            class="text-[11px] font-medium text-[#FF613c] px-3 py-3 border-l border-gray-400/20"
          >
            {{ l?.phone_number }}
          </td>
          <td
            scope="col"
            class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
          >
            <div v-if="selectedRow === l.id" class="flex space-x-2">
              <button
                @click.stop="handleEdit(l)"
                class="text-blue-600 hover:text-blue-800 font-medium"
              >
                Edit
              </button>
              <!-- <button
                @click.stop="handleDelete(l)"
                class="text-red-600 hover:text-red-800 font-medium"
              >
                Delete
              </button> -->
            </div>
            <span v-else>...</span>
          </td>
        </tr>
      </tbody>

      <tbody class="border border-gray-400/20" v-if="loading">
        <tr
          v-for="l in 10"
          :key="l"
          class="border border-gray-400/20 hover:bg-[#FF613c]/10 cursor-pointer even:bg-gray-50"
        >
          <td
            scope="col"
            class="text-[11px] font-medium text-blue-600 px-3 py-3 border-l border-gray-400/20"
          >
            <p
              class="w-[70px] animate-pulse h-3 bg-blue-300 inline-block rounded-lg"
            ></p>
          </td>
          <td
            scope="col"
            class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
          >
            <p
              class="w-[200px] animate-pulse h-3 bg-gray-300 inline-block rounded-lg"
            ></p>
          </td>
          <td
            scope="col"
            class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
          >
            <p
              class="w-[80px] animate-pulse h-3 bg-gray-300 inline-block rounded-lg"
            ></p>
          </td>
          <td
            scope="col"
            class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
          >
            <p
              class="w-[80px] animate-pulse h-3 bg-gray-300 inline-block rounded-lg"
            ></p>
          </td>
          <td
            scope="col"
            class="text-[14px] font-semibold text-gray-800 px-3 py-3 text-end"
          >
            <p
              class="w-[80px] animate-pulse h-3 bg-gray-300 inline-block rounded-lg"
            ></p>
          </td>
          <td
            scope="col"
            class="text-[11px] font-medium text-[#FF613c] px-3 py-3 border-l border-gray-400/20"
          >
            <p
              class="w-[80px] animate-pulse h-3 bg-gray-300 inline-block rounded-lg"
            ></p>
          </td>
          <td
            scope="col"
            class="text-[11px] font-medium text-[#FF613c] px-3 py-3 border-l border-gray-400/20"
          >
            <p
              class="w-[50px] animate-pulse h-3 bg-gray-300 inline-block rounded-lg"
            ></p>
          </td>
          <td
            scope="col"
            class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
          >
            ...
          </td>
        </tr>
      </tbody>
    </table>

    <Modal :isOpen="selectedRowData != null" @closeModal="close">
      <DialogPanel
        class="w-full max-w-6xl transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="font-medium leading-6 mb-5 flex justify-between"
        >
          <h3>{{ showPaymentForm ? "Detail & Payment" : "Detail" }}</h3>
        </DialogTitle>
        <div v-if="selectedRowData" class="">
          <div
            class="grid"
            :class="showPaymentForm ? 'grid-cols-2 gap-4' : 'grid-cols-1'"
          >
            <!-- Detail Column -->
            <div>
              <div
                class="grid grid-cols-3 divide-x divide-gray-200 border border-gray-200 p-3 rounded-lg gap-3"
              >
                <div class="flex justify-center items-center flex-col">
                  <p class="text-xs font-medium">ORDER:</p>
                  <p class="font-semibold text-blue-600">
                    {{ selectedRowData.order_number }}
                  </p>
                </div>
                <div class="flex justify-center items-center flex-col">
                  <p class="text-xs font-medium">Customer:</p>
                  <p class="font-semibold">
                    {{ selectedRowData?.customer?.name }}
                  </p>
                </div>
                <div class="flex justify-center items-center flex-col">
                  <p class="text-xs font-medium">Amount:</p>
                  <p class="font-semibold text-[#FF613c]">
                    {{ selectedRowData?.grand_total }} THB
                  </p>
                </div>
              </div>

              <p class="py-3 font-medium">Item Detail</p>
              <div class="overflow-x-auto">
                <table
                  class="w-full text-sm text-left text-gray-500 mb-4 dark:text-gray-400 rounded overflow-hidden"
                >
                  <thead
                    class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-[#FF613c] dark:text-gray-100"
                  >
                    <tr>
                      <th
                        scope="col"
                        class="px-3 py-3 border-l border-gray-50/20"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3 border-l border-gray-50/20"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3 border-l border-gray-50/20"
                      >
                        Product
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3 border-l border-gray-50/20"
                      >
                        Variation
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3 border-l border-gray-50/20"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3 border-l border-gray-50/20"
                      >
                        Discount
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3 border-l border-gray-50/20"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3 border-l border-gray-50/20"
                      >
                        Service
                      </th>
                    </tr>
                  </thead>

                  <tbody class="border border-gray-400/20">
                    <tr
                      v-for="item in selectedRowData?.items"
                      :key="item.id"
                      class="border border-gray-400/20 even:bg-gray-50"
                      :class="
                        item.product_type === 'App\\Models\\InclusiveProduct'
                          ? 'hidden'
                          : ''
                      "
                    >
                      <td
                        scope="col"
                        class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                      >
                        {{ item?.crm_id }}
                      </td>
                      <td
                        scope="col"
                        class="text-[11px] font-medium text-black px-3 py-3 border-l border-gray-400/20"
                      >
                        {{ item?.product_type?.split(`\\`)[2] }}
                      </td>
                      <td
                        scope="col"
                        class="text-[11px] min-w-[180px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                      >
                        {{ item?.product?.name }}
                      </td>
                      <td
                        scope="col"
                        class="text-[11px] min-w-[200px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                      >
                        {{ item?.variation?.name }} {{ item?.room?.name }}
                        {{ item?.car?.name }} {{ item?.ticket?.price }}
                      </td>
                      <td
                        scope="col"
                        class="text-[11px] min-w-[180px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                      >
                        {{ item?.quantity }}
                        {{
                          JSON.parse(item?.individual_pricing)?.child?.quantity
                            ? `Adult + ${
                                JSON.parse(item?.individual_pricing)?.child
                                  ?.quantity
                              } Child`
                            : ""
                        }}
                      </td>
                      <td
                        scope="col"
                        class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                      >
                        {{ item?.discount }}
                      </td>
                      <td
                        scope="col"
                        class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                      >
                        {{ item?.total_selling_price }}
                      </td>
                      <td
                        scope="col"
                        class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                      >
                        {{ getFormatDate(item?.service_date) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Payment Form Column -->
            <div v-if="showPaymentForm" class="border-l pl-4">
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-medium">Order Payment</h3>
                <XMarkIcon
                  v-if="showPaymentForm"
                  class="w-5 h-5 text-black cursor-pointer"
                  @click="showPaymentForm = false"
                />
              </div>
              <div class="space-y-2">
                <div class="space-y-1">
                  <label for="" class="text-[10px]"> Amount </label>
                  <input
                    type="number"
                    v-model="formData.amount"
                    name=""
                    class="w-full px-4 py-2 text-sm border border-gray-100 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
                    id=""
                  />
                </div>
                <div class="space-y-1">
                  <label for="" class="text-[10px]"> Payment Method </label>
                  <select
                    name=""
                    v-model="formData.payment_method"
                    id=""
                    class="w-full px-4 py-2 text-sm border border-gray-100 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Online">Online</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
                <div class="space-y-1">
                  <label for="" class="text-[10px]"> Payment Slip </label>
                  <div
                    v-if="!featureImagePreview"
                    @click="handleFeatureImageClick"
                    class="w-full h-16 border border-[#FF613c] border-dashed rounded-lg flex items-center justify-center"
                  >
                    <span class="text-xs text-[#FF613c]"
                      >+ Upload Payment Slip</span
                    >
                  </div>
                  <input
                    type="file"
                    id="image"
                    ref="featureImageInput"
                    class="hidden"
                    @change="handleFileChange"
                    accept="image/*"
                  />
                  <div
                    v-if="featureImagePreview"
                    class="w-[100px] h-auto relative"
                  >
                    <img
                      :src="featureImagePreview"
                      alt="Image preview"
                      class="w-[100px] h-auto rounded"
                    /><span
                      v-if="featureImagePreview"
                      @click.prevent="handleFileRemove"
                      class="text-red-400 text-xs cursor-pointer font-semibold underline absolute -top-[10px] -right-[10px]"
                      ><i class="text-xl fa-solid fa-circle-minus"></i
                    ></span>
                  </div>
                </div>
                <div class="space-y-1 grid grid-cols-3">
                  <p class="col-span-3 text-xs pt-4 pb-2">payment pre</p>
                  <div v-for="p in selectedRowData?.payments ?? []" :key="p">
                    <p>{{ p?.amount }} {{ p?.payment_method }}</p>
                    <img :src="p?.payment_slip" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 flex justify-end items-center space-x-2">
          <button
            @click="ChangeToBooking(selectedRowData.id)"
            v-if="
              !showPaymentForm &&
              selectedRowData?.order_status != 'cancelled' &&
              selectedRowData?.order_status != 'sale_convert'
            "
            class="px-4 py-2 text-xs bg-[#FF613c] text-white rounded-lg hover:bg-[#FF613c]"
          >
            Change To Booking
          </button>
          <button
            @click="
              () => {
                changeOrderStatusShow = true;
                changeStatusId = selectedRowData.id;
                close();
              }
            "
            v-if="
              selectedRowData?.order_status != 'sale_convert' &&
              authStore.isSuperAdmin
            "
            class="px-4 py-2 text-xs bg-green-600 text-white rounded-lg hover:bg-green-600"
          >
            Change Order Status
          </button>
          <!-- 
          <button
            v-if="!showPaymentForm"
            @click="showPaymentForm = true"
            class="px-4 py-2 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add Payment Order
          </button> -->
          <button
            v-if="showPaymentForm"
            @click="submitAddPayment(selectedRowData.id)"
            class="px-8 py-2 text-xs bg-[#FF613c] text-white rounded-lg hover:bg-[#FF613c]"
          >
            Submit Payment
          </button>
          <div class="" v-if="showPaymentForm">
            <button
              @click="showPaymentForm = false"
              class="px-4 py-2 text-xs bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Cancel Payment
            </button>
          </div>
          <div class="">
            <button
              @click="close"
              class="px-4 py-2 text-xs bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
          <div
            class=""
            v-if="
              selectedRowData?.order_status != 'sale_convert' &&
              !showPaymentForm &&
              authStore.isSuperAdmin
            "
          >
            <button
              @click="handleDelete(selectedRowData?.id)"
              class="px-4 py-2 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete Order
            </button>
          </div>
        </div>
      </DialogPanel>
    </Modal>

    <Modal :isOpen="changeOrderStatusShow" @closeModal="closeStatusModal">
      <DialogPanel
        class="w-full max-w-xl mt-10 transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="font-medium leading-6 mb-5 flex justify-between"
        >
          <h3>Change Order Status</h3>
          <XMarkIcon
            class="w-5 h-5 text-black cursor-pointer"
            @click="closeStatusModal"
          />
        </DialogTitle>
        <div>
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-medium text-xs">Change Status</h3>
          </div>
          <div class="flex justify-between items-center mb-4">
            <select
              v-model="changeStatus"
              class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div class="flex justify-end items-center">
            <button
              @click="submitChangeStatus(changeStatusId)"
              class="px-4 py-2 text-xs bg-[#FF613c] text-white rounded-lg hover:bg-[#FF613c]"
            >
              Submit
            </button>
          </div>
        </div>
      </DialogPanel>
    </Modal>

    <Pagination :data="booking" @change-page="changePage" />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from "vue";
import { formattedDate, getFormatDate } from "../help/FormatData";
import Pagination from "../../components/Pagination.vue";
import Modal from "../../components/Modal.vue";
import { DialogPanel, DialogTitle } from "@headlessui/vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import { useBookingStore } from "../../stores/booking";
import { useAuthStore } from "../../stores/auth";
import { CalendarDaysIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { CheckBadgeIcon, XCircleIcon } from "@heroicons/vue/24/solid";
import { useOrderStore } from "../../stores/order";
import { id } from "date-fns/locale";

const router = useRouter();
const toast = useToast();
const orderStore = useOrderStore();
const authStore = useAuthStore();

const props = defineProps({
  booking: {
    type: [Array, Object],
    required: true,
  },
  changePage: {
    type: Function,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  watchSystem: {
    type: Object,
  },
});

const emit = defineEmits(["edit", "delete"]);

const changeOrderStatusShow = ref(false);
const changeStatus = ref(null);
const changeStatusId = ref(null);

// Track which row is selected
const selectedRow = ref(null);
const selectedRowData = ref(null);
const showPaymentForm = ref(false);

const submitChangeStatus = async (id) => {
  const res = await orderStore.changeStatus(id, {
    status: changeStatus.value,
  });

  toast.success("order status change successfully");
  await orderStore.getListAction(props.watchSystem);
  changeOrderStatusShow.value = false;
};

const closeStatusModal = () => {
  changeOrderStatusShow.value = false;
  changeStatus.value = null;
};

const close = () => {
  selectedRowData.value = null;
  selectedRow.value = null;
  showPaymentForm.value = false;
};

// Handle row click
const handleRowClick = (row) => {
  if (selectedRow.value === row.id) {
    // If clicking the same row again, deselect it
    selectedRow.value = null;
    selectedRowData.value = null;
  } else {
    // Select the row
    selectedRow.value = row.id;
    selectedRowData.value = row;
  }

  console.log("Row clicked:", row);
};

// Handle edit button click
const handleEdit = (row) => {
  router.push("/bookings/new-update/" + row.id);
};

const formData = ref({
  amount: "",
  payment_method: "",
  status: "pending",
  payment_slip: null,
});

const featureImagePreview = ref(null);
const featureImageInput = ref(null);

const handleFeatureImageClick = () => {
  featureImageInput.value.click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  formData.value.payment_slip = file;
  featureImagePreview.value = URL.createObjectURL(file);
};
const handleFileRemove = () => {
  formData.value.payment_slip = null;
  featureImagePreview.value = null;
};

const errors = ref(null);

const submitAddPayment = async (id) => {
  try {
    const frmData = new FormData();
    frmData.append("amount", formData.value.amount);
    frmData.append("payment_method", formData.value.payment_method);
    frmData.append("status", formData.value.status);
    frmData.append("payment_slip", formData.value.payment_slip);

    const response = await orderStore.addPayment(frmData, id);
    formData.value = {
      amount: "",
      payment_method: "",
      status: "pending",
      payment_slip: null,
    };
    featureImagePreview.value = null;
    errors.value = null;
    showPaymentForm.value = false;
    await orderStore.getListAction();
    selectedRowData.value = null;
    selectedRow.value = null;
    toast.success(response.message);
  } catch (error) {
    if (error.response.data.errors) {
      errors.value = error.response.data.errors;
    }
    toast.error(error.response.data.message);
  }
};

// Handle delete button click
const ChangeToBooking = (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Change it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await orderStore.changeToBooking(id);
        toast.success(response.message || "Successfully Changed!");
        selectedRow.value = null;
        selectedRowData.value = null;
        // Close the modal
        // Refresh data
        await orderStore.getListAction(props.watchSystem);
      } catch (error) {
        console.error("Delete error:", error);

        // Safely handle errors
        if (errors && error.response?.data?.errors) {
          errors.value = error.response.data.errors;
        }

        // Show error message
        const errorMessage =
          error.response?.data?.message ||
          "Failed to delete. Please try again.";
        toast.error(errorMessage);
      }
    }
  });
};

const handleDelete = (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await orderStore.deleteOrder(id);
        toast.success(response.message || "Successfully Changed!");
        selectedRow.value = null;
        selectedRowData.value = null;
        // Close the modal
        // Refresh data
        await orderStore.getListAction(props.watchSystem);
      } catch (error) {
        console.error("Delete error:", error);

        // Safely handle errors
        if (errors && error.response?.data?.errors) {
          errors.value = error.response.data.errors;
        }

        // Show error message
        const errorMessage =
          error.response?.data?.message ||
          "Failed to delete. Please try again.";
        toast.error(errorMessage);
      }
    }
  });
};
</script>
