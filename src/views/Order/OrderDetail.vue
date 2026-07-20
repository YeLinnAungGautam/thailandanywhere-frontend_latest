<template>
  <Layout>
    <div class="w-full mx-auto">
      <!-- Loading skeleton -->
      <div v-if="loading" class="space-y-4">
        <div class="h-24 bg-gray-100 rounded-xl animate-pulse"></div>
        <div class="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
      </div>

      <div v-else-if="order">
        <!-- Top summary bar -->
        <div
          class="bg-white border border-gray-200 rounded-xl p-6 flex flex-wrap justify-between gap-4 mb-4"
        >
          <div>
            <p class="text-[11px] font-semibold text-gray-400 tracking-wide">
              ORDER ID
            </p>
            <p class="text-lg font-semibold text-blue-600">
              {{ order.order_number }}
            </p>
            <p class="text-xs text-gray-400 flex items-center gap-1 mt-1">
              <CalendarDaysIcon class="w-4 h-4" />
              Created on {{ order.formatted_order_datetime }}
            </p>
          </div>

          <div>
            <p class="text-[11px] font-semibold text-gray-400 tracking-wide">
              CUSTOMER
            </p>
            <p
              class="text-base font-semibold text-gray-900 flex items-center gap-1"
            >
              <UserIcon class="w-4 h-4 text-gray-400" />
              {{ order.customer?.name }}
            </p>
            <p class="text-sm text-gray-500 flex items-center gap-1">
              <PhoneIcon class="w-4 h-4 text-gray-400" />
              {{ order.phone_number }}
            </p>
          </div>

          <div>
            <p class="text-[11px] font-semibold text-gray-400 tracking-wide">
              AMOUNT
            </p>
            <p class="text-lg font-semibold text-[#FF613c]">
              {{ Number(order.grand_total).toFixed(2) }} THB
            </p>
            <p class="text-xs text-gray-400">Total Amount</p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <!-- Order status stepper -->
          <div class="bg-white border border-gray-200 rounded-xl p-5">
            <p
              class="text-[11px] font-semibold text-gray-400 tracking-wide mb-5"
            >
              ORDER STATUS
            </p>

            <div
              v-if="order.order_status === 'cancelled'"
              class="text-center py-6"
            >
              <XCircleIcon class="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p class="font-semibold text-gray-700">Order Cancelled</p>
              <p class="text-xs text-gray-400 mt-1">
                This order was cancelled.
              </p>
            </div>

            <ol v-else class="space-y-0">
              <li
                v-for="(step, idx) in steps"
                :key="step.title"
                class="relative pl-10 pb-4"
                :class="[
                  idx === activeStepIndex
                    ? 'bg-[#FF613c]/5 rounded-2xl'
                    : 'bg-transparent',
                ]"
              >
                <span
                  v-if="idx !== steps.length - 1"
                  class="absolute left-[15px] top-8 bottom-0 w-px bg-gray-200"
                ></span>

                <span
                  class="absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                  :class="[
                    stepBadgeClass(step),
                    idx === activeStepIndex
                      ? 'ring-2 ring-offset-2 ring-[#FF613c]'
                      : '',
                  ]"
                >
                  <CheckIcon v-if="step.state === 'done'" class="w-4 h-4" />
                  <span v-else>{{ idx + 1 }}</span>
                </span>

                <p
                  class="font-semibold pt-8 text-sm cursor-pointer hover:underline"
                  :class="
                    step.state === 'current'
                      ? 'text-[#FF613c]'
                      : step.state === 'done'
                      ? 'text-green-600'
                      : 'text-gray-400'
                  "
                  @click="handleStepClick(idx)"
                >
                  {{ step.title }}
                </p>
                <p
                  v-if="step.state === 'current'"
                  class="text-[11px] font-medium text-[#FF613c]"
                >
                  Current Stage
                </p>
                <p v-if="step.date" class="text-xs text-gray-400">
                  {{ step.date }}
                </p>
                <p class="text-xs text-gray-500 mt-1">{{ step.description }}</p>
              </li>
            </ol>
          </div>

          <!-- Right panel: content follows whichever step is selected on the left -->
          <div class="col-span-2 space-y-4">
            <!-- Step 1 selected: Customer Generated Order -> order list detail -->
            <div
              v-if="activeStepIndex === 0"
              class="bg-white border border-gray-200 rounded-2xl p-5"
            >
              <p
                class="text-[11px] font-semibold text-gray-400 tracking-wide uppercase mb-4"
              >
                Order List Detail
              </p>
              <div class="overflow-x-auto rounded-xl border border-gray-100">
                <table class="w-full text-xs text-left">
                  <thead class="bg-gray-50 uppercase text-[10px] text-gray-500">
                    <tr>
                      <th class="px-3 py-2 font-semibold">Product</th>
                      <th class="px-3 py-2 font-semibold">Variation</th>
                      <th class="px-3 py-2 font-semibold text-right">Qty</th>
                      <th class="px-3 py-2 font-semibold text-right">
                        Discount
                      </th>
                      <th class="px-3 py-2 font-semibold text-right">Price</th>
                      <th class="px-3 py-2 font-semibold">Service Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, i) in order.items"
                      :key="item.id"
                      class="border-t border-gray-100"
                      :class="i % 2 ? 'bg-gray-50/60' : ''"
                    >
                      <td class="px-3 py-2 text-gray-700">
                        {{ item?.product?.name }}
                      </td>
                      <td class="px-3 py-2 text-gray-500">
                        {{ item?.variation?.name }} {{ item?.room?.name }}
                        {{ item?.car?.name }}
                      </td>
                      <td class="px-3 py-2 text-right text-gray-500">
                        {{ item?.quantity }}
                      </td>
                      <td class="px-3 py-2 text-right text-gray-500">
                        {{ item?.discount }}
                      </td>
                      <td
                        class="px-3 py-2 text-right font-medium text-gray-800"
                      >
                        {{ item?.total_selling_price }}
                      </td>
                      <td class="px-3 py-2 text-gray-500">
                        {{
                          item?.service_date
                            ? getFormatDate(item.service_date)
                            : "-"
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Step 2 selected: Agent Confirms Availability -> order list + go to availability -->
            <div
              v-else-if="activeStepIndex === 1"
              class="bg-white border border-gray-200 rounded-2xl p-5"
            >
              <div class="flex items-center justify-between mb-4">
                <p
                  class="text-[11px] font-semibold text-gray-400 tracking-wide uppercase"
                >
                  Order List
                </p>
                <button
                  @click="goToAvailability"
                  class="px-3 py-1.5 text-[11px] font-medium border border-[#FF613c] text-[#FF613c] rounded-md hover:bg-[#FF613c]/10"
                >
                  Go to Availability
                </button>
              </div>
              <div class="overflow-x-auto rounded-xl border border-gray-100">
                <table class="w-full text-xs text-left">
                  <thead class="bg-gray-50 uppercase text-[10px] text-gray-500">
                    <tr>
                      <th class="px-3 py-2 font-semibold">Product</th>
                      <th class="px-3 py-2 font-semibold">Variation</th>
                      <th class="px-3 py-2 font-semibold text-right">Qty</th>
                      <th class="px-3 py-2 font-semibold text-right">
                        Discount
                      </th>
                      <th class="px-3 py-2 font-semibold text-right">Price</th>
                      <th class="px-3 py-2 font-semibold">Service Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, i) in order.items"
                      :key="item.id"
                      class="border-t border-gray-100"
                      :class="i % 2 ? 'bg-gray-50/60' : ''"
                    >
                      <td class="px-3 py-2 text-gray-700">
                        {{ item?.product?.name }}
                      </td>
                      <td class="px-3 py-2 text-gray-500">
                        {{ item?.variation?.name }} {{ item?.room?.name }}
                        {{ item?.car?.name }}
                      </td>
                      <td class="px-3 py-2 text-right text-gray-500">
                        {{ item?.quantity }}
                      </td>
                      <td class="px-3 py-2 text-right text-gray-500">
                        {{ item?.discount }}
                      </td>
                      <td
                        class="px-3 py-2 text-right font-medium text-gray-800"
                      >
                        {{ item?.total_selling_price }}
                      </td>
                      <td class="px-3 py-2 text-gray-500">
                        {{
                          item?.service_date
                            ? getFormatDate(item.service_date)
                            : "-"
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Step 3 selected: Awaiting Payment -> countdown + payment form -->
            <template v-else-if="activeStepIndex === 2">
              <div class="mt-4">
                <label class="text-sm font-semibold text-gray-800"
                  >Payment Slips</label
                >
                <div
                  class="cursor-pointer w-full h-24 border border-dashed border-[#FF613c]/50 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-[#FF613c] hover:bg-[#FF613c]/5 mt-2"
                  @click="openShowModal = true"
                >
                  <ArrowUpTrayIcon class="w-5 h-5 text-[#FF613c]" />
                  <span class="text-xs text-gray-600">Add payment slip</span>
                </div>

                <div
                  v-for="(receipt, index) in formData.receipt_image"
                  :key="index"
                  class="border border-gray-200 rounded-lg p-3 mt-2 text-xs flex justify-between items-center"
                >
                  <span v-if="receipt.is_internal_transfer">
                    Internal Transfer • Rate {{ receipt.exchange_rate }}
                  </span>
                  <span v-else>
                    {{ receipt.currency }} {{ receipt.amount }} —
                    {{ receipt.sender }} → {{ receipt.reciever }}
                  </span>
                  <XCircleIcon
                    class="w-4 h-4 text-red-500 cursor-pointer"
                    @click="removeReceiptImage(index)"
                  />
                </div>
              </div>
            </template>

            <!-- Step 4 selected : Success Convert -->
            <div
              v-else-if="activeStepIndex === 3"
              class="bg-white border border-gray-200 rounded-2xl p-5"
            >
              <div>
                <img
                  src="https://cdn-icons-png.flaticon.com/128/18416/18416025.png"
                  alt=""
                  class="h-32 mx-auto"
                />
              </div>
              <div class="flex items-center justify-between mb-4">
                <p
                  class="text-[11px] font-semibold text-gray-400 tracking-wide uppercase"
                >
                  Order List
                </p>
                <button
                  v-if="order?.booking_id"
                  @click="goToBooking(order?.booking_id)"
                  class="px-3 py-1.5 text-[11px] font-medium border border-[#FF613c] text-[#FF613c] rounded-md hover:bg-[#FF613c]/10"
                >
                  Go to Booking
                </button>
              </div>
              <div class="overflow-x-auto rounded-xl border border-gray-100">
                <table class="w-full text-xs text-left">
                  <thead class="bg-gray-50 uppercase text-[10px] text-gray-500">
                    <tr>
                      <th class="px-3 py-2 font-semibold">Product</th>
                      <th class="px-3 py-2 font-semibold">Variation</th>
                      <th class="px-3 py-2 font-semibold text-right">Qty</th>
                      <th class="px-3 py-2 font-semibold text-right">
                        Discount
                      </th>
                      <th class="px-3 py-2 font-semibold text-right">Price</th>
                      <th class="px-3 py-2 font-semibold">Service Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, i) in order.items"
                      :key="item.id"
                      class="border-t border-gray-100"
                      :class="i % 2 ? 'bg-gray-50/60' : ''"
                    >
                      <td class="px-3 py-2 text-gray-700">
                        {{ item?.product?.name }}
                      </td>
                      <td class="px-3 py-2 text-gray-500">
                        {{ item?.variation?.name }} {{ item?.room?.name }}
                        {{ item?.car?.name }}
                      </td>
                      <td class="px-3 py-2 text-right text-gray-500">
                        {{ item?.quantity }}
                      </td>
                      <td class="px-3 py-2 text-right text-gray-500">
                        {{ item?.discount }}
                      </td>
                      <td
                        class="px-3 py-2 text-right font-medium text-gray-800"
                      >
                        {{ item?.total_selling_price }}
                      </td>
                      <td class="px-3 py-2 text-gray-500">
                        {{
                          item?.service_date
                            ? getFormatDate(item.service_date)
                            : "-"
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <!-- Action bar -->
        <div class="mt-6 flex flex-wrap justify-end items-center gap-2">
          <button
            v-if="
              order.order_status !== 'cancelled' &&
              order.order_status !== 'sale_convert'
            "
            @click="handleChangeToBooking"
            class="px-4 py-2 text-xs font-medium bg-white text-black border border-gray-200 rounded-lg hover:opacity-90"
          >
            Change to Booking
          </button>

          <div
            class="relative"
            v-if="
              order.order_status !== 'sale_convert' && authStore.isSuperAdmin
            "
          >
            <select
              v-model="changeStatus"
              @change="handleChangeStatus"
              class="appearance-none px-4 py-2 pr-8 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <option value="" disabled selected>Change Order Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <!-- <button
            @click="submitAddPayment"
            class="px-6 py-2 text-xs font-medium bg-[#FF613c] text-white rounded-lg hover:opacity-90"
          >
            Submit Payment
          </button> -->

          <button
            @click="goBack"
            class="px-4 py-2 text-xs font-medium bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Close
          </button>

          <button
            v-if="
              order.order_status !== 'sale_convert' && authStore.isSuperAdmin
            "
            @click="handleDelete"
            class="px-4 py-2 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete Order
          </button>
        </div>
      </div>

      <div v-else class="text-center py-16 text-gray-400 text-sm">
        Order not found.
      </div>
    </div>
    <Modal :isOpen="openShowModal" @closeModal="openShowModal = false">
      <DialogPanel
        class="w-full max-w-5xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-2 px-4"
        >
          <p>Payment Slip Audit</p>
          <XCircleIcon
            class="w-5 h-5 text-white"
            @click="openShowModal = false"
          />
        </DialogTitle>
        <CashImage
          :editData="''"
          @internal-transfer-submitted="internalTransferAction"
          @direct-banking-submitted="directAction"
        />
      </DialogPanel>
    </Modal>
  </Layout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import { useOrderStore } from "../../stores/order";
import { useAuthStore } from "../../stores/auth";
import { getFormatDate } from "../help/FormatData";
import {
  CalendarDaysIcon,
  ClockIcon,
  ArrowUpTrayIcon,
  CheckIcon,
  CreditCardIcon,
  BanknotesIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  ReceiptPercentIcon,
} from "@heroicons/vue/24/outline";
import { UserIcon, PhoneIcon, XCircleIcon } from "@heroicons/vue/24/solid";
import Layout from "../Layout.vue";
import Modal from "../../components/Modal.vue";
import { DialogPanel, DialogTitle } from "@headlessui/vue";
import CashImage from "../CashImageCreate/CashImage.vue";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const orderStore = useOrderStore();
const authStore = useAuthStore();

const loading = ref(true);
const order = ref(null);
const showSummary = ref(false);
const changeStatus = ref("");

const fileInput = ref(null);
const slipPreview = ref(null);
const openShowModal = ref(false);

// Which step is selected on the left stepper — controls what renders on the
// right side. It's driven by the order's status (see setActiveStepFromStatus
// below), but can still be changed by clicking a step.
const activeStepIndex = ref(2);

const setActiveStepFromStatus = (status) => {
  if (status === "pending") activeStepIndex.value = 1;
  else if (status === "confirmed") activeStepIndex.value = 2;
  else if (status === "sale_convert") activeStepIndex.value = 3;
  else activeStepIndex.value = 1;
};

const formData = reactive({
  amount: "",
  payment_method: "",
  payment_datetime: "",
  note: "",
  payment_slip: null,

  // cash images collected from CashImage.vue (used on "Change to Booking")
  receipt_image: [],
});

let timerHandle = null;
const remainingSeconds = ref(0);

const countdown = computed(() => {
  const total = Math.max(remainingSeconds.value, 0);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return { hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds) };
});

const startCountdown = (seconds) => {
  remainingSeconds.value = seconds ?? 0;
  clearInterval(timerHandle);
  timerHandle = setInterval(() => {
    if (remainingSeconds.value > 0) {
      remainingSeconds.value -= 1;
    } else {
      clearInterval(timerHandle);
    }
  }, 1000);
};

const steps = computed(() => {
  const status = order.value?.order_status;
  const stageIndex =
    { pending: 1, processing: 2, confirmed: 3, sale_convert: 4 }[status] ?? 2;

  const definitions = [
    {
      title: "Customer Generated Order",
      description: "Customer has successfully placed the order.",
      date: order.value?.formatted_order_datetime,
    },
    {
      title: "Agent Confirms Availability",
      description: "Availability is confirmed by our agent.",
      date: order.value?.admin ? order.value?.formatted_order_datetime : null,
    },
    {
      title: "Awaiting Payment",
      description: "Waiting for customer to complete the payment.",
      date: null,
    },
    {
      title: "Success Convert",
      description: "Success convert order to booking",
      date: null,
    },
  ];

  return definitions.map((d, idx) => {
    const stepNum = idx + 1;
    let state = "upcoming";
    if (stepNum < stageIndex) state = "done";
    else if (stepNum === stageIndex) state = "current";
    if (status === "sale_convert") state = "done";
    return { ...d, state };
  });
});

const stepBadgeClass = (step) => {
  if (step.state === "done") return "bg-green-600 text-white";
  if (step.state === "current") return "bg-[#FF613c] text-white";
  return "bg-gray-100 text-gray-400";
};

const handleStepClick = (idx) => {
  activeStepIndex.value = idx;
};

const goToAvailability = () => {
  router.push("/availabilities/checker");
};

const fetchDetail = async () => {
  loading.value = true;
  try {
    const res = await orderStore.getDetail(route.params.id);
    console.log(res, "this is order");

    order.value = res?.result?.order;
    startCountdown(res?.result?.remaining_time);
    setActiveStepFromStatus(order.value?.order_status);
  } catch (error) {
    toast.error("Failed to load order detail");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDetail);
onBeforeUnmount(() => clearInterval(timerHandle));

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  formData.payment_slip = file;
  slipPreview.value = URL.createObjectURL(file);
};

const removeSlip = () => {
  formData.payment_slip = null;
  slipPreview.value = null;
};

const paymentChecklist = computed(() => [
  { label: "Payment Method", done: !!formData.payment_method },
  { label: "Amount Paid", done: !!formData.amount },
  { label: "Payment Date & Time", done: !!formData.payment_datetime },
]);
const requiredCount = computed(() => paymentChecklist.value.length);
const completedRequiredCount = computed(
  () => paymentChecklist.value.filter((c) => c.done).length,
);

const isImageSlip = computed(
  () => formData.payment_slip?.type?.startsWith("image/") ?? true,
);

const formatFileSize = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const submitAddPayment = async () => {
  if (
    !formData.payment_method ||
    !formData.amount ||
    !formData.payment_datetime
  ) {
    toast.error("Please fill in payment method, amount, and date & time");
    return;
  }
  try {
    const frmData = new FormData();
    frmData.append("amount", formData.amount);
    frmData.append("payment_method", formData.payment_method);
    frmData.append("payment_datetime", formData.payment_datetime);
    frmData.append("note", formData.note);
    frmData.append("status", "pending");
    if (formData.payment_slip)
      frmData.append("payment_slip", formData.payment_slip);

    const response = await orderStore.addPayment(frmData, order.value.id);
    toast.success(response?.message || "Payment submitted");
    await fetchDetail();
    formData.amount = "";
    formData.payment_method = "";
    formData.payment_datetime = "";
    formData.note = "";
    removeSlip();
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to submit payment");
  }
};

const goToBooking = (id) => {
  if (!id) return;

  router.push(`/bookings/new-update/${id}`);
};

const handleChangeStatus = async () => {
  if (!changeStatus.value) return;
  try {
    await orderStore.changeStatus(order.value.id, {
      status: changeStatus.value,
    });
    toast.success("Order status changed successfully");
    await fetchDetail();
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to change status");
  } finally {
    changeStatus.value = "";
  }
};

// ---------- CashImage.vue integration ----------
const formatDateDb = (dateString) => {
  if (!dateString) return "";
  if (dateString.includes("T")) return dateString.replace("T", " ");
  return dateString;
};

const internalTransferAction = (message) => {
  formData.receipt_image.push({
    is_internal_transfer: true,
    exchange_rate: message.data.exchange_rate,
    id: message.data.id,
    note: message.data.notes,
    from_files: message.data.from_images.map((img) => ({
      id: img.id || null,
      file: img.image,
      amount: img.amount,
      currency: img.currency,
      sender: img.sender,
      receiver: img.receiver,
      interact_bank: img.interact_bank,
      date: formatDateDb(img.date),
    })),
    to_files: message.data.to_images.map((img) => ({
      id: img.id || null,
      file: img.image,
      amount: img.amount,
      currency: img.currency,
      sender: img.sender,
      receiver: img.receiver,
      interact_bank: img.interact_bank,
      date: formatDateDb(img.date),
    })),
  });
  openShowModal.value = false;
};

const directAction = (message) => {
  formData.receipt_image.push({
    is_internal_transfer: false,
    file: message.data.image,
    amount: message.data.amount,
    currency: message.data.currency,
    sender: message.data.sender,
    reciever: message.data.receiver,
    interact_bank: message.data.interact_bank,
    date: formatDateDb(message.data.date),
  });
  openShowModal.value = false;
};

const removeReceiptImage = (index) => {
  formData.receipt_image.splice(index, 1);
};

// ---------- Change to Booking ----------
const handleChangeToBooking = () => {
  if (!formData.receipt_image.length) {
    toast.error("Please add at least one payment slip before converting");
    return;
  }

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Change it!",
  }).then(async (result) => {
    if (!result.isConfirmed) return;
    try {
      const frmData = new FormData();

      for (let x = 0; x < formData.receipt_image.length; x++) {
        const receipt = formData.receipt_image[x];

        if (receipt.is_internal_transfer) {
          frmData.append(`receipt_image[${x}][is_internal_transfer]`, true);
          frmData.append(
            `receipt_image[${x}][exchange_rate]`,
            receipt.exchange_rate,
          );
          frmData.append(`receipt_image[${x}][note]`, receipt.note || "");
          frmData.append(`receipt_image[${x}][id]`, receipt.id || "");

          receipt.from_files.forEach((f, i) => {
            if (f.file)
              frmData.append(
                `receipt_image[${x}][from_files][${i}][file]`,
                f.file,
              );
            frmData.append(
              `receipt_image[${x}][from_files][${i}][amount]`,
              f.amount,
            );
            frmData.append(
              `receipt_image[${x}][from_files][${i}][currency]`,
              f.currency,
            );
            frmData.append(
              `receipt_image[${x}][from_files][${i}][sender]`,
              f.sender,
            );
            frmData.append(
              `receipt_image[${x}][from_files][${i}][receiver]`,
              f.receiver,
            );
            frmData.append(
              `receipt_image[${x}][from_files][${i}][interact_bank]`,
              f.interact_bank,
            );
            frmData.append(
              `receipt_image[${x}][from_files][${i}][date]`,
              f.date,
            );
          });

          receipt.to_files.forEach((f, i) => {
            if (f.file)
              frmData.append(
                `receipt_image[${x}][to_files][${i}][file]`,
                f.file,
              );
            frmData.append(
              `receipt_image[${x}][to_files][${i}][amount]`,
              f.amount,
            );
            frmData.append(
              `receipt_image[${x}][to_files][${i}][currency]`,
              f.currency,
            );
            frmData.append(
              `receipt_image[${x}][to_files][${i}][sender]`,
              f.sender,
            );
            frmData.append(
              `receipt_image[${x}][to_files][${i}][receiver]`,
              f.receiver,
            );
            frmData.append(
              `receipt_image[${x}][to_files][${i}][interact_bank]`,
              f.interact_bank,
            );
            frmData.append(`receipt_image[${x}][to_files][${i}][date]`, f.date);
          });
        } else {
          frmData.append(`receipt_image[${x}][is_internal_transfer]`, false);
          if (receipt.file)
            frmData.append(`receipt_image[${x}][file]`, receipt.file);
          frmData.append(`receipt_image[${x}][amount]`, receipt.amount);
          frmData.append(`receipt_image[${x}][date]`, receipt.date);
          frmData.append(`receipt_image[${x}][sender]`, receipt.sender);
          frmData.append(`receipt_image[${x}][reciever]`, receipt.reciever);
          frmData.append(
            `receipt_image[${x}][interact_bank]`,
            receipt.interact_bank,
          );
          frmData.append(`receipt_image[${x}][currency]`, receipt.currency);
        }
      }

      const response = await orderStore.changeToBooking(
        order.value.id,
        frmData,
      );
      toast.success(response?.message || "Successfully Changed!");
      // router.push("/bookings");
      await fetchDetail();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to change to booking.",
      );
    }
  });
};

const handleDelete = () => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Delete it!",
  }).then(async (result) => {
    if (!result.isConfirmed) return;
    try {
      const response = await orderStore.deleteOrder(order.value.id);
      toast.success(response?.message || "Deleted successfully!");
      router.push("/bookings");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete. Please try again.",
      );
    }
  });
};

const goBack = () => router.push("/bookings");
</script>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.18s ease;
}
.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
