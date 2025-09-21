<template>
  <div>
    <div class="flex justify-between items-center">
      <div class="w-full pt-2.5 items-center col-span-2">
        <div class="flex justify-between items-center space-x-2 pb-2">
          <p class="text-xs text-gray-500">
            If expense step isn't green, please update again !
          </p>
          <p
            v-if="!emailBooking"
            @click="expenseUpdateAction"
            class="bg-green-500 text-white border border-gray-300 px-3 py-1 rounded-lg text-[10px] cursor-pointer"
          >
            Update Expense
          </p>
        </div>
      </div>
    </div>
    <div class="col-span-2 h-1 overflow-hidden">
      <input type="text" class="opacity-0" name="" />
    </div>
    <div class="rounded-xl grid grid-cols-2 gap-4" v-if="!emailBooking">
      <div class="space-y-2">
        <p class="text-gray-800 text-[10px]">Expense Method:</p>

        <v-select
          v-model="formData.payment_method"
          class="style-chooser text-xs rounded-lg bg-white"
          :options="paymentArray"
          label="name"
          :clearable="false"
          :reduce="(d) => d.name"
          placeholder=""
        ></v-select>
      </div>
      <div class="space-y-2">
        <p class="text-gray-800 text-[10px]">Bank Name:</p>

        <v-select
          v-model="formData.bank_name"
          class="style-chooser text-xs rounded-lg bg-white"
          :options="payment"
          label="name"
          :clearable="false"
          :reduce="(d) => d.name"
          placeholder=""
        ></v-select>
      </div>
      <div class="space-y-2">
        <p class="text-gray-800 text-[10px]">Expense Status</p>
        <v-select
          v-model="formData.payment_status"
          class="style-chooser text-xs rounded-lg bg-white"
          :options="payment_status"
          label="name"
          :clearable="false"
          :reduce="(d) => d.name"
          placeholder=""
        ></v-select>
      </div>
      <div class="space-y-2">
        <p class="text-gray-800 text-[10px]">Bank Account Number</p>
        <input
          v-model="formData.bank_account_number"
          type="number"
          id="title"
          class="h-9 rounded-lg w-full bg-white border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
        />
      </div>

      <table
        class="w-full rounded-xl col-span-2 overflow-hidden border border-gray-700 shadow-sm"
      >
        <thead class="bg-[#FF613c] text-white border-b-2 border-gray-200">
          <tr>
            <th
              class="py-2 px-4 text-[10px] whitespace-nowrap font-normal text-left"
            >
              Code
            </th>
            <th
              class="py-2 px-4 text-[10px] whitespace-nowrap font-normal text-left"
            >
              Name
            </th>
            <th
              v-if="
                detail?.items[0]?.product_type ==
                  'App\\Models\\EntranceTicket' ||
                detail?.items[0]?.product_type == 'App\\Models\\PrivateVanTour'
              "
              class="py-2 px-4 text-[10px] whitespace-nowrap font-normal text-left"
            >
              Service Date
            </th>

            <th
              v-if="detail?.items[0]?.product_type == 'App\\Models\\Hotel'"
              class="py-2 px-4 text-[10px] whitespace-nowrap font-normal text-left"
            >
              Check-in
            </th>
            <th
              v-if="detail?.items[0]?.product_type == 'App\\Models\\Hotel'"
              class="py-2 px-4 text-[10px] whitespace-nowrap font-normal text-left"
            >
              Check-out
            </th>

            <th
              v-if="
                detail?.items[0]?.product_type == 'App\\Models\\Hotel' ||
                detail?.items[0]?.product_type == 'App\\Models\\PrivateVanTour'
              "
              class="py-2 px-4 text-[10px] whitespace-nowrap font-normal text-left"
            >
              Unit Cost *
            </th>
            <th
              v-if="
                detail?.items[0]?.product_type == 'App\\Models\\EntranceTicket'
              "
              class="py-2 px-4 text-[10px] whitespace-nowrap font-normal text-left"
            >
              Adult Unit Cost *
            </th>
            <th
              v-if="
                detail?.items[0]?.product_type == 'App\\Models\\EntranceTicket'
              "
              class="py-2 px-4 text-[10px] whitespace-nowrap font-normal text-left"
            >
              Child Unit Cost *
            </th>
            <th
              class="py-2 px-4 text-[10px] whitespace-nowrap font-normal text-end"
            >
              Total Cost
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="(item, index) in formData.multiple_id ?? []"
            :key="item"
            class="bg-white even:bg-gray-50 hover:bg-gray-50"
          >
            <td
              class="py-2 px-4 text-[10px] relative whitespace-nowrap font-normal text-left"
            >
              {{ formData.multiple_crm_id[index].split("_")[1] }}
            </td>
            <td
              v-if="
                detail?.items[index]?.product_type ==
                'App\\Models\\EntranceTicket'
              "
              class="py-2 px-4 text-[10px] font-normal max-w-[120px] text-left"
            >
              {{ detail?.items[index]?.variation?.name }}
            </td>
            <td
              v-if="detail?.items[index]?.product_type == 'App\\Models\\Hotel'"
              class="py-2 px-4 text-[10px] font-normal min-w-[120px] text-left"
            >
              {{ detail?.items[index]?.room?.name }}
            </td>
            <td
              v-if="
                detail?.items[index]?.product_type ==
                'App\\Models\\PrivateVanTour'
              "
              class="py-2 px-4 text-[10px] font-normal min-w-[120px] text-left"
            >
              {{ detail?.items[index]?.car?.name }}
            </td>
            <td
              class="py-2 px-4 text-[10px] font-normal text-left"
              v-if="
                detail?.items[index]?.product_type ==
                  'App\\Models\\EntranceTicket' ||
                detail?.items[index]?.product_type ==
                  'App\\Models\\PrivateVanTour'
              "
            >
              {{ detail?.items[index]?.service_date }}
            </td>
            <td
              v-if="detail?.items[index]?.product_type == 'App\\Models\\Hotel'"
              class="py-2 px-4 text-[10px] whitespace-nowrap font-normal text-left"
            >
              {{ detail?.items[index]?.checkin_date }}
            </td>
            <td
              v-if="detail?.items[index]?.product_type == 'App\\Models\\Hotel'"
              class="py-2 px-4 text-[10px] whitespace-nowrap font-normal text-left"
            >
              {{ detail?.items[index]?.checkout_date }}
            </td>

            <td
              class="py-2 px-4 text-[10px] whitespace-nowrap font-normal text-left"
            >
              {{
                detail?.items[index]?.product_type == "App\\Models\\Hotel"
                  ? ` ${daysBetween(
                      detail?.items[index]?.checkin_date,
                      detail?.items[index]?.checkout_date
                    )}N, ${detail?.items[index]?.quantity} Rooms`
                  : `${detail?.items[index]?.quantity} x `
              }}
              <input
                v-model="formData.multiple_cost_price[index]"
                type="number"
                id="title"
                class="h-8 ml-2 col-span-1 rounded-lg bg-white border border-gray-300 px-2 w-[80px] py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
              />
            </td>
            <td
              v-if="
                detail?.items[index]?.product_type ==
                'App\\Models\\EntranceTicket'
              "
              class="py-2 px-4 text-[10px] whitespace-nowrap font-normal text-left"
            >
              {{ formData.multiple_individual[index]?.child?.quantity }} x
              <input
                v-if="
                  formData.multiple_individual[index]?.child?.cost_price != null
                "
                v-model="formData.multiple_individual[index].child.cost_price"
                type="number"
                id="title"
                class="h-8 ml-2 col-span-1 rounded-lg bg-white border border-gray-300 px-2 w-[80px] py-2 text-gray-900 focus:outline-none focus:border-gray-300 text-xs"
              />
            </td>
            <td
              @click="showExpenseUpdateModal(detail?.items[index])"
              class="py-2 px-4 text-[12px] whitespace-nowrap font-normal text-end relative"
            >
              <p
                v-if="
                  detail?.items[index]?.product_type == 'App\\Models\\Hotel'
                "
                class="absolute bottom-0 right-0 rounded-lg text-[8px] px-1.5 py-0.5 bg-[#FF613c] text-white"
              >
                i
              </p>
              {{ detail?.items[index]?.total_cost_price }} thb
            </td>
          </tr>
          <tr class="bg-[#FF613c]/40">
            <td
              v-if="
                detail?.items[0]?.product_type == 'App\\Models\\PrivateVanTour'
              "
              colspan="4"
              class="py-2 px-4 text-[10px] whitespace-nowrap font-normal text-left"
            >
              Total Cost
            </td>
            <td
              v-if="
                detail?.items[0]?.product_type != 'App\\Models\\PrivateVanTour'
              "
              colspan="5"
              class="py-2 px-4 text-[10px] whitespace-nowrap font-normal text-left"
            >
              Total Cost
            </td>
            <td
              colspan="1"
              class="py-2 px-4 text-[14px] whitespace-nowrap font-normal text-end"
            >
              {{ total_cost_calculate }} thb
            </td>
          </tr>
        </tbody>
      </table>

      <div class="space-y-2 col-span-2 w-full">
        <!-- <p class="text-gray-800 text-[10px]">Receipt</p> -->
        <div class="space-y-4 mb-2">
          <input
            type="file"
            id="image"
            ref="fileInputThree"
            class="hidden"
            @change="recehandleFileChange"
            accept="image/*"
          />

          <p class="text-[10px]" v-if="editData.expenses?.length != 0">
            receipt slip
          </p>
          <div class="grid grid-cols-4 gap-4">
            <div class="space-y-2" @click="carModalOpen = true">
              <div
                class="w-full h-[210px] border border-[#FF613c] text-[#FF613c] text-lg flex justify-center items-center rounded-lg border-dashed"
              >
                +
              </div>
              <div
                class="w-full px-4 pb-1 border-dashed border border-[#FF613c] space-y-2 text-[#FF613c] hover:shadow-none rounded-lg"
              >
                <p class="text-[10px] flex justify-start items-center pt-2">
                  <!-- <img :src="bathImage" alt="" class="w-4 h-4 mr-2" /> -->
                  Bank Name
                </p>
                <p class="text-[10px] flex justify-start items-center">
                  <!-- <img :src="dateImage" alt="" class="w-3 h-3 mr-2" /> -->
                  Amount
                </p>
                <p class="text-[10px] flex justify-start items-center pb-2">
                  <!-- <img :src="dateImage" alt="" class="w-3 h-3 mr-2" /> -->
                  Date
                </p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-4 gap-4">
            <div
              v-for="(image, index) in editData.expenses ?? []"
              :key="index"
              class="relative space-y-1"
            >
              <p
                class="text-[10px] px-2 py-1 bg-[#FF613c] rounded-lg text-white"
              >
                {{ image.id }}
              </p>
              <p
                @click="openModal(image, index)"
                class="absolute top-4 cursor-pointer text-[8px] shadow right-2 text-xs text-white bg-[#FF613c] px-2 py-0.5 rounded-lg"
              >
                <span class="text-[10px]">edit</span>
              </p>
              <a :href="image.image" target="_blink" class="w-full h-auto">
                <img
                  :src="image.image"
                  alt=""
                  class="rounded-lg w-full h-[210px] object-cover"
                />
              </a>
              <div
                class="w-full px-4 pb-1 mt-2 border space-y-2 text-[#FF613c] border-gray-200 shadow hover:shadow-none rounded-lg"
              >
                <p class="text-[10px] flex justify-start items-center pt-2">
                  {{ image?.bank_name }}
                </p>
                <p class="text-[10px] flex justify-start items-center">
                  {{ image?.amount }}
                </p>
                <p class="text-[10px] flex justify-start items-center pb-2">
                  {{ image?.date }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div v-if="emailBooking">
      <ExpenseBooking :detail="detail" />
    </div> -->
    <Modal :isOpen="carModalOpen" @closeModal="carModalOpen = false">
      <DialogPanel
        class="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-2 px-4"
        >
          <p>Expense Add</p>
          <XCircleIcon class="w-5 h-5 text-white" @click="cancelAction" />
        </DialogTitle>
        <!-- show date  -->
        <div class="p-4">
          <div class="p-4">
            <div class="grid grid-cols-2 gap-8">
              <p class="text-[10px] text-gray-500 col-span-2">
                Before save, Please make sure for which reservation.
              </p>

              <div
                @click="openFilePickerThree"
                v-if="uploadRecePreview.length == 0 && !expenseData.file"
                class="w-full h-[400px] border rounded-lg border-dashed flex justify-center items-center text-[#FF613c] border-[#FF613c]"
              >
                +
              </div>
              <div
                v-if="uploadRecePreview.length != 0 && !expenseData.file"
                class="w-full min-h-[400px] border rounded-lg border-dashed flex justify-center items-center text-[#FF613c] border-[#FF613c]"
              >
                <img :src="uploadRecePreview[0]" alt="" class="rounded-lg" />
              </div>
              <div
                v-if="expenseData.file"
                class="rounded-lg min-h-[400px] w-full"
              >
                <img :src="expenseData.file" alt="" class="rounded-lg" />
              </div>

              <div class="space-y-4 relative pt-4 pb-14">
                <div class="">
                  <p for="" class="text-[12px] font-medium pb-2">
                    Date <span class="opacity-0">......</span>
                  </p>
                  <div
                    class="flex justify-between items-center w-full bg-white pl-2 rounded-lg"
                  >
                    <p class="text-start text-xs" v-if="expenseData?.date">
                      {{
                        expenseData.date.includes("T")
                          ? formatDate(expenseData.date)
                          : formatDateFromDb(expenseData.date)
                      }}
                    </p>
                    <input
                      type="datetime-local"
                      name=""
                      v-model="expenseData.date"
                      format="YYYY-MM-DD HH:mm:ss"
                      class="w-[35px] px-2 py-2 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                      id=""
                    />
                  </div>
                </div>

                <div class="">
                  <p for="" class="text-[12px] font-medium pb-2">Sender</p>
                  <input
                    type="text"
                    v-model="expenseData.sender"
                    :class="
                      expenseData.sender != '' &&
                      expenseData.sender == 'MR. THIHA@KUMAR BHUSAL'
                        ? 'text-gray-400'
                        : ''
                    "
                    name=""
                    placeholder="xxx"
                    class="w-full px-2 py-2 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                    id=""
                  />
                </div>
                <div class="">
                  <div class="flex justify-between items-center">
                    <p for="" class="text-[12px] font-medium pb-2">Reciever</p>
                    <p
                      class="text-xs text-blue-600 underline cursor-pointer"
                      @click="goToProduct"
                    >
                      link to product
                    </p>
                  </div>
                  <input
                    type="text"
                    v-model="expenseData.reciever"
                    :class="
                      expenseData.reciever != '' &&
                      expenseData.reciever ==
                        detail?.booking?.items[0]?.product?.account_name
                        ? 'text-gray-400'
                        : ''
                    "
                    name=""
                    placeholder="xxx"
                    class="w-full px-2 py-2 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                    id=""
                  />
                </div>
                <div class="">
                  <p for="" class="text-[12px] font-medium pb-2">Amount</p>
                  <input
                    type="number"
                    v-model="expenseData.amount"
                    name=""
                    placeholder="xxx"
                    class="w-full px-2 py-2 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                    id=""
                  />
                </div>
                <div class="">
                  <p for="" class="text-[12px] font-medium pb-2">
                    Interact Bank <span class="opacity-0">.....</span>
                  </p>
                  <select
                    name=""
                    v-model="expenseData.interact_bank"
                    id=""
                    class="w-full px-2 py-2 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                  >
                    <option value="personal">Personal</option>
                    <option value="company">Company</option>
                    <option value="cash_at_office">Cash at Office</option>
                    <option value="to_money_changer">To Money Changer</option>
                    <option value="deposit_management">
                      Deposit Management
                    </option>
                    <option value="pay_to_driver">Pay to Driver</option>
                  </select>
                </div>
                <div class="flex justify-between items-center">
                  <label for="" class="text-[12px] font-medium"
                    >Currency
                  </label>
                  <select
                    name=""
                    v-model="expenseData.currency"
                    id=""
                    class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                  >
                    <option value="MMK">MMK</option>
                    <option value="THB">THB</option>
                    <option value="USD">USD</option>
                  </select>
                </div>

                <div
                  class="flex justify-end items-center space-x-2 absolute bottom-0 right-0"
                >
                  <p
                    v-if="!expenseData?.id"
                    @click="createExpense()"
                    class="px-3 py-1 bg-green-500 text-white text-[12px] cursor-pointer rounded-lg"
                  >
                    Save
                  </p>
                  <p
                    v-if="expenseData?.id"
                    @click="updateExpense(expenseData.reservation_id)"
                    class="px-3 py-1 bg-blue-500 text-white text-[12px] cursor-pointer rounded-lg"
                  >
                    Update
                  </p>
                  <p
                    v-if="expenseData?.id"
                    @click="
                      removeFeatureDeleteImage(
                        expenseData.index,
                        expenseData.id
                      )
                    "
                    class="px-3 py-1 bg-red-500 text-white text-[12px] cursor-pointer rounded-lg"
                  >
                    delete
                  </p>
                  <p
                    @click="cancelAction"
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

    <Modal
      :isOpen="showExpenseUpdate != null"
      @closeModal="closeExpenseUpdateModal"
    >
      <DialogPanel
        class="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-2 px-4"
        >
          <p>How to calculate expense.</p>
          <XCircleIcon
            class="w-5 h-5 text-white"
            @click="closeExpenseUpdateModal"
          />
        </DialogTitle>

        <div class="p-6">
          <div
            class="text-xs flex justify-between items-center border-b border-gray-300 pb-3"
          >
            <p class="px-2 font-medium text-sm whitespace-nowrap">
              Date <span class="opacity-0">-----</span>
            </p>

            <p class="px-2 font-medium text-sm whitespace-nowrap">Sale</p>

            <p class="px-2 font-medium text-sm whitespace-nowrap">Cost</p>
          </div>
          <div class="pb-4">
            <div
              v-for="i in showExpenseUpdate?.daily_pricing"
              :key="i"
              class="text-xs flex justify-between items-center space-y-4"
            >
              <p class="whitespace-nowrap px-2">{{ i.date }}</p>

              <p class="px-2">{{ i.sale_price * showExpenseQuantity }}</p>

              <p class="px-2">{{ i.cost_price * showExpenseQuantity }}</p>
            </div>
          </div>
          <div
            class="text-xs flex justify-between items-center border-t border-gray-300 pt-3"
          >
            <p class="px-2 font-medium text-sm whitespace-nowrap">
              Total <span class="opacity-0">-----</span>
            </p>

            <p class="px-2 font-medium text-sm whitespace-nowrap">
              {{
                showExpenseUpdate?.total_sale_price * showExpenseQuantity
              }}
              THB
            </p>

            <p class="px-2 font-medium text-sm whitespace-nowrap">
              {{
                showExpenseUpdate?.total_cost_price * showExpenseQuantity
              }}
              THB
            </p>
          </div>
        </div>
      </DialogPanel>
    </Modal>
  </div>
</template>

<script setup>
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { ref, defineProps, onMounted, watch, computed } from "vue";
import { useToast } from "vue-toastification";
import { useReservationStore } from "../../stores/reservation";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useRoute, useRouter } from "vue-router";
import { daysBetween } from "../help/DateBetween";
import { useGroupStore } from "../../stores/group";
import { useCashImageStore } from "../../stores/cashImage";
import { formattedDateTimeDB } from "../help/FormatData";
import { useHotelStore } from "../../stores/hotel";
// import ExpenseBooking from "./ExpenseBooking.vue";

const toast = useToast();
const reservationStore = useReservationStore();

const groupStore = useGroupStore();
const hotelStore = useHotelStore();

const props = defineProps({
  detail: Object,
  getDetailAction: Function,
});

const cashImageStore = useCashImageStore();
const carModalOpen = ref(false);
const route = useRoute();
const fileInputThree = ref(null);
const router = useRouter();

const formData = ref({
  multiple_id: [],
  multiple_id_reservation: [],
  multiple_crm_id: [],
  multiple_cost_price: [],
  multiple_individual: [],
  payment_method: "",
  bank_name: "",
  bank_account_number: "",
  payment_status: "",
  hotalQuantity: [],
  multiple_quantity: [],
  receipt_image: [],
  booking_receipt_image: [],
  product_type: "",
  customer_feedback: "",
});

const total_cost_calculate = computed(() => {
  let result = 0;
  for (let i = 0; i < props?.detail?.items.length; i++) {
    result += props?.detail?.items[i]?.total_cost_price;
  }
  return result;
});

const editData = ref({
  reservation_ids: [],
  expenses: [],
});

const expenseData = ref({
  index: "",
  id: "",
  reservation_id: "",
  file: null,
  amount: 0,
  date: "",
  bank_name: "",
  sender: "MR. THIHA@KUMAR BHUSAL",
  reciever: props?.detail?.items[0]?.product?.account_name,
  interact_bank: "",
  currency: "THB",
  is_corporate: false,
  comment: "",
});

const openModal = (data, index) => {
  carModalOpen.value = true;
  console.log(data, index, "this is data");

  // save.value = data;
  expenseData.value = {
    index: index,
    id: data.id,
    file: data.image,
    amount: data.amount,
    date: data.date,
    bank_name: data.bank_name,
    sender: data.sender ? data.sender : "MR. THIHA@KUMAR BHUSAL",
    reciever: data.reciever
      ? data.reciever
      : props?.detail?.items[0]?.product?.account_name,
    interact_bank: data.interact_bank,
    currency: data.currency ? data.currency : "THB",
  };
};

const clearAction = () => {
  expenseData.value = {
    index: "",
    id: "",
    reservation_id: "",
    file: null,
    amount: 0,
    date: "",
    bank_name: "",
    sender: "MR. THIHA@KUMAR BHUSAL",
    reciever: props?.detail?.items[0]?.product?.account_name,
    interact_bank: "",
    currency: "THB",
    is_corporate: false,
    comment: "",
  };
  carModalOpen.value = false;
};

const goToProduct = () => {
  if (props.detail?.items[0]?.product_type == "App\\Models\\Hotel") {
    router.push(`/product/hotel/edit/${props.detail?.items[0]?.product_id}`);
  } else {
    router.push(`/products/6?edit=${props.detail?.items[0]?.product_id}`);
  }
};

const openFilePickerThree = () => {
  fileInputThree.value.click();
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

const bankList = ref([
  { id: "1", name: "KPAY" },
  { id: "2", name: "AYAPAY" },
  { id: "3", name: "CBPAY" },
  { id: "4", name: "KBZ BANKING" },
  { id: "5", name: "CB BANKING" },
  { id: "6", name: "MAB BANKING" },
  { id: "7", name: "YOMA BANK" },
  { id: "8", name: "Kasikorn" },
  { id: "9", name: "Bangkok Bank" },
  { id: "10", name: "Bank of Ayudhaya" },
  { id: "11", name: "SCB Bank" },
  { id: "12", name: "KPAY" },
  { id: "13", name: "AYAPAY" },
  { id: "14", name: "CBPAY" },
  { id: "15", name: "KBZ BANKING" },
  { id: "16", name: "CB BANKING" },
  { id: "17", name: "MAB BANKING" },
  { id: "18", name: "YOMA BANK" },
  { id: "19", name: "Kasikorn" },
  { id: "20", name: "Bangkok Bank" },
  { id: "21", name: "Bank of Ayudhaya" },
  { id: "22", name: "SCB Bank" },
  { id: "23", name: "Others..." },
]);

const recehandleFileChange = (e) => {
  let selectedFile = e.target.files;
  if (selectedFile) {
    for (let index = 0; index < selectedFile.length; index++) {
      formData.value.receipt_image.push(selectedFile[index]);
      uploadRecePreview.value.push(URL.createObjectURL(selectedFile[index]));
    }
  }
};

const uploadRecePreview = ref([]);

const cancelAction = () => {
  // your logic to cancel the update goes here
  formData.value.receipt_image = [];
  uploadRecePreview.value = [];
  carModalOpen.value = false;

  clearAction();
};

const expenseUpdateAction = async () => {
  loading.value = true;
  let successCount = 0;
  let failCount = 0;

  try {
    // Get the array of IDs to update
    const itemIds = formData.value.multiple_id || [];

    if (itemIds.length === 0) {
      toast.error("No items found to update");
      loading.value = false;
      return;
    }

    // Process each item ID
    for (let i = 0; i < itemIds.length; i++) {
      try {
        const itemId = itemIds[i];

        // Create form data for the first update (reservation)
        const frmData = new FormData();
        frmData.append("_method", "PUT");

        // Get item-specific data if available, otherwise use general data
        const costPrice =
          formData.value.multiple_cost_price &&
          formData.value.multiple_cost_price[i]
            ? formData.value.multiple_cost_price[i]
            : formData.value.cost_price;

        const quantity =
          formData.value.multiple_quantity &&
          formData.value.multiple_quantity[i]
            ? formData.value.multiple_quantity[i]
            : 0;

        const hotalQuantity =
          formData.value.hotalQuantity && formData.value.hotalQuantity[i]
            ? formData.value.hotalQuantity[i]
            : 0;

        if (
          props.detail?.items[0]?.product_type ==
            "App\\Models\\EntranceTicket" &&
          formData.value.multiple_individual[i] != "null"
        ) {
          frmData.append(
            "individual_pricing[child][quantity]",
            formData.value.multiple_individual[i]?.child?.quantity ?? 0
          );
          frmData.append(
            "individual_pricing[child][selling_price]",
            formData.value.multiple_individual[i]?.child?.selling_price ?? 0
          );
          frmData.append(
            "individual_pricing[child][cost_price]",
            formData.value.multiple_individual[i]?.child?.cost_price ?? 0
          );
          frmData.append(
            "individual_pricing[child][total_cost_price]",
            formData.value.multiple_individual[i]?.child?.cost_price ??
              0 * formData.value.multiple_individual[i]?.child?.quantity
          );
          frmData.append(
            "individual_pricing[child][amount]",
            formData.value.multiple_individual[i]?.child?.selling_price
              ? formData.value.multiple_individual[i]?.child?.selling_price *
                  formData.value.multiple_individual[i]?.child?.quantity
              : 0
          );
        }

        // Append data to form
        if (costPrice) frmData.append("cost_price", costPrice);
        if (formData.value.payment_method)
          frmData.append("payment_method", formData.value.payment_method);
        if (quantity) frmData.append("quantity", quantity);
        if (formData.value.payment_status)
          frmData.append("payment_status", formData.value.payment_status);

        // Calculate and append total cost price
        if (costPrice) {
          if (hotalQuantity == 0) {
            // This is for tickets (non-hotel products)
            let childCostTotal = 0;

            // Only calculate child costs if the data exists
            if (
              formData.value.multiple_individual &&
              formData.value.multiple_individual[i] &&
              formData.value.multiple_individual[i].child
            ) {
              const childCost =
                formData.value.multiple_individual[i].child.cost_price * 1 || 0;
              const childQty =
                formData.value.multiple_individual[i].child.quantity * 1 || 0;

              childCostTotal = childCost * childQty;
            }

            // Calculate total cost as adult cost + child cost
            const totalCostPrice = costPrice * quantity + childCostTotal;
            frmData.append("total_cost_price", totalCostPrice);
          } else {
            // This is for hotels
            const totalCostPrice = costPrice * hotalQuantity;
            frmData.append("total_cost_price", totalCostPrice);
          }
        }

        // Send first update request
        const response = await reservationStore.updateAction(frmData, itemId);

        // If first update was successful, send second update
        if (response.status == 1) {
          const secfrm = new FormData();
          secfrm.append("_method", "PUT");

          if (formData.value.bank_name) {
            secfrm.append("expense_bank_name", formData.value.bank_name);
          }
          if (formData.value.payment_method) {
            secfrm.append("expense_method", formData.value.payment_method);
          }
          if (formData.value.payment_status) {
            secfrm.append("expense_status", formData.value.payment_status);
          }

          if (formData.value.bank_account_number) {
            secfrm.append(
              "expense_bank_account",
              formData.value.bank_account_number
            );
          }

          // Send second update request
          await groupStore.groupUpdateAction(route.query.id, secfrm);

          console.log(`Successfully updated item ${itemId}`);
          successCount++;
        } else {
          console.error(`Failed to update item ${itemId}: ${response.message}`);
          failCount++;
        }
      } catch (error) {
        console.error(`Error updating item ${itemIds[i]}:`, error);
        failCount++;
      }
    }

    // Show appropriate toast based on results
    if (failCount === 0) {
      toast.success(`Successfully updated ${successCount} items`);
    } else if (successCount === 0) {
      toast.error(`Failed to update all ${failCount} items`);
    } else {
      toast.info(
        `Updated ${successCount} items, failed to update ${failCount} items`
      );
    }

    // Refresh the data
  } catch (error) {
    console.error("Error in expenseUpdateAction:", error);
    toast.error("An unexpected error occurred");
  } finally {
    setTimeout(async () => {
      await props.getDetailAction(route.query.id);
    }, 1000);
    loading.value = false;
  }
};

const paymentArray = [
  // Bank Transfer, International Remittance, Cash, etc
  { id: "1", name: "Bank Transfer" },
  { id: "2", name: "International Remittance" },
  { id: "3", name: "Cash" },
  { id: "4", name: "Other ..." },
];

const payment = [
  { id: "1", name: "K + " },
  { id: "2", name: "SCB " },
  { id: "3", name: "Bangkok Bank" },
  { id: "4", name: "Other Bank " },
];

const payment_status = [
  { id: "1", name: "fully_paid" },
  { id: "2", name: "not_paid" },
  { id: "3", name: "partially_paid" },
];

const removeFeatureDeleteImage = async (index, id) => {
  const res = await cashImageStore.deleteAction(expenseData.value.id);
  console.log(res, "this is res");
  if (res.status == 1) {
    toast.success("Passport successfully deleted");
    cancelAction();
    await props.getDetailAction(route.query.id);
  }
  carModalOpen.value = false;
  // console.log(editData.value.customer_passport, "this is remove");

  cancelAction();
};

const emailBooking = ref(false);

const loading = ref(false);

const createExpense = async () => {
  // console.log(formData.value);
  loading.value = true;
  try {
    const frmData = new FormData();
    frmData.append("relatable_type", "App\\Models\\BookingItemGroup");
    frmData.append("relatable_id", route.query.id);
    frmData.append("amount", expenseData.value.amount);
    frmData.append("sender", expenseData.value.sender);
    frmData.append("reciever", expenseData.value.reciever);
    frmData.append(
      "interact_bank",
      expenseData.value.interact_bank ?? "personal"
    );
    frmData.append("currency", expenseData.value.currency ?? "THB");
    frmData.append("date", formattedDateTimeDB(expenseData.value.date));

    if (formData.value.receipt_image.length != 0) {
      if (formData.value.receipt_image.length > 0) {
        for (let i = 0; i < formData.value.receipt_image.length; i++) {
          let file = formData.value.receipt_image[0];
          frmData.append("image", file);
        }
      }
    }

    const res = await cashImageStore.addNewAction(frmData);
    console.log(res);
    toast.success({
      title: "Success",
      description: "Create success",
    });

    await props.getDetailAction(route.query.id);

    clearAction();
    loading.value = false;

    // setTimeout(async () => {
    //   await props.getDetailAction(route.query.id,route.query.product_id);
    // }, 1000);
  } catch (error) {
    console.log(error);
  }
};

const updateExpense = async () => {
  // console.log(formData.value);
  loading.value = true;
  try {
    const frmData = new FormData();
    frmData.append("_method", "PUT");
    frmData.append("relatable_type", "App\\Models\\BookingItemGroup");
    frmData.append("relatable_id", route.query.id);
    frmData.append("amount", expenseData.value.amount);
    frmData.append("sender", expenseData.value.sender);
    frmData.append("reciever", expenseData.value.reciever);
    frmData.append(
      "interact_bank",
      expenseData.value.interact_bank ?? "personal"
    );
    frmData.append("currency", expenseData.value.currency ?? "THB");
    frmData.append("date", formattedDateTimeDB(expenseData.value.date));

    const res = await cashImageStore.updateAction(
      frmData,
      expenseData.value.id
    );
    console.log(res);
    toast.success({
      title: "Success",
      description: "Update success",
    });
    await props.getDetailAction(route.query.id);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
    carModalOpen.value = false;
  }
};

// const getExpenseList = async () => {
//   const id = route.query.id;
//   const res = await groupStore.groupDocumentList(id, {
//     document_type: "expense_receipt",
//   });
//   console.log(res);
//   editData.value.expenses = res.result;

//   console.log(editData.value.expenses, "this is editData");
//   loading.value = false;
// };

const populateFormData = async () => {
  if (props.detail && props.detail.items.length > 0) {
    // Reset arrays to avoid duplicate data if this function is called multiple times
    formData.value.multiple_id = [];
    formData.value.multiple_id_reservation = [];
    formData.value.multiple_crm_id = [];
    formData.value.multiple_cost_price = [];
    formData.value.multiple_individual = [];
    formData.value.hotalQuantity = [];
    formData.value.multiple_quantity = [];
    formData.value.child_quantity = [];
    formData.value.child_price = [];
    editData.value.reservation_ids = [];
    editData.value.expenses = [];

    // Get common data from the first item (assuming common data is the same across items)
    const firstItem = props.detail.items[0];
    formData.value.payment_method =
      props.detail.expense_method != null
        ? props.detail.expense_method
        : firstItem?.payment_method || "";
    formData.value.bank_name =
      props.detail.expense_bank_name != null
        ? props.detail.expense_bank_name
        : firstItem?.product?.bank_name;
    formData.value.bank_account_number =
      props.detail.expense_bank_account != null
        ? props.detail.expense_bank_account
        : firstItem?.product?.bank_account_number;
    formData.value.payment_status =
      props.detail.expense_status != null
        ? props.detail.expense_status
        : firstItem?.payment_status;
    formData.value.booking_receipt_image = firstItem?.receipt_images || [];
    formData.value.product_type = firstItem?.product_type || "";
    formData.value.customer_feedback =
      firstItem?.reservation_info?.customer_feedback || "";

    // Loop through each item and collect data
    props.detail.items.forEach((item) => {
      // Push item-specific data to arrays
      formData.value.multiple_id.push(item.id);
      formData.value.multiple_id_reservation.push(item.id); // Or any other reservation ID if needed
      formData.value.multiple_crm_id.push(item.crm_id);
      formData.value.multiple_cost_price.push(item.cost_price);
      formData.value.multiple_individual.push(item.individual_pricing);
      editData.value.reservation_ids.push({
        id: item.id,
        crm_id: item.crm_id,
        name: item.room?.name,
        selected: false,
      });

      // Calculate hotel quantity (nights × room quantity)
      if (item.product_type == "App\\Models\\Hotel") {
        const nights = daysBetween(item.checkin_date, item.checkout_date);
        formData.value.hotalQuantity.push(item.quantity * nights);
      }
      formData.value.multiple_quantity.push(item.quantity);
    });

    editData.value.expenses = props.detail.expense;

    // await props.getDetailAction(route.query.id); // Call getDetailAction();
    console.log(
      "Form data populated with multiple items:",
      formData.value,
      editData.value
    );
  }
};

const allReservation = ref(true);

const selectedReservationIds = computed(() => {
  return editData.value.reservation_ids
    .filter((item) => item.selected)
    .map((item) => item.id);
});

const askForReservationId = () => {
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
      if (!expenseData.value.id) {
        await createExpense(reservationId);
      }
      console.log("====================================");
      console.log(expenseData.value, "this is a valid reservation");
      console.log("====================================");
    }

    // Refresh data after all operations
  } catch (error) {
    console.error("Error processing traveller actions:", error);
    toast.error("An error occurred while processing");
  } finally {
    loading.value = false;
    setTimeout(async () => {
      await props.getDetailAction(route.query.id, route.query.product_id);
    }, 3000);
  }
};

const showExpenseUpdate = ref(null);
const showExpenseQuantity = ref(0);
const showExpenseUpdateModal = async (item) => {
  console.log(item);
  // showExpenseUpdate.value = item;
  showExpenseQuantity.value = item.quantity;

  let data = {
    checkin_date: item.checkin_date,
    checkout_date: item.checkout_date,
  };

  const res = await hotelStore.getRoomPrice(data, item.room.id);
  console.log(res, "this is room price");

  if (res) {
    showExpenseUpdate.value = res.data;
  }
};

const closeExpenseUpdateModal = () => {
  showExpenseUpdate.value = null;
  showExpenseQuantity.value = 0;
};

watch(
  () => props.detail,
  (newValue) => {
    if (newValue) {
      populateFormData();
    }
  },
  { immediate: true }
);

// Or call it in onMounted if props are available immediately
onMounted(() => {
  if (props.detail) {
    populateFormData();
  }
});
</script>
