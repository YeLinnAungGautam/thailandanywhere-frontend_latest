<template>
  <div>
    <!-- Update Warning and Button -->
    <div class="flex justify-between items-center">
      <div class="w-full pt-2.5 items-center col-span-2">
        <div class="flex justify-between items-center space-x-2 pb-2">
          <p class="text-xs text-gray-500">
            If expense step isn't green, please update again!
          </p>
          <button
            v-if="!emailBooking"
            @click="expenseUpdateAction"
            :disabled="loading"
            class="bg-green-500 hover:bg-green-600 text-white border border-gray-300 px-3 py-1 rounded-lg text-[10px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ loading ? "Updating..." : "Update Expense" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Hidden Input (for form handling) -->
    <div class="col-span-2 h-1 overflow-hidden">
      <input type="text" class="opacity-0" name="" />
    </div>

    <!-- Main Form -->
    <div class="rounded-xl grid grid-cols-2 gap-4" v-if="!emailBooking">
      <!-- Expense Method -->
      <div class="space-y-2">
        <p class="text-gray-800 text-[10px]">Expense Method:</p>
        <v-select
          v-model="formData.payment_method"
          class="style-chooser text-xs rounded-lg bg-white"
          :options="paymentArray"
          label="name"
          :clearable="false"
          :reduce="(d) => d.name"
          placeholder="Select payment method"
        ></v-select>
      </div>

      <!-- Bank Name -->
      <div class="space-y-2">
        <p class="text-gray-800 text-[10px]">Bank Name:</p>
        <v-select
          v-model="formData.bank_name"
          class="style-chooser text-xs rounded-lg bg-white"
          :options="payment"
          label="name"
          :clearable="false"
          :reduce="(d) => d.name"
          placeholder="Select bank"
        ></v-select>
      </div>

      <!-- Expense Status -->
      <div class="space-y-2">
        <p class="text-gray-800 text-[10px]">Expense Status</p>
        <v-select
          v-model="formData.payment_status"
          class="style-chooser text-xs rounded-lg bg-white"
          :options="payment_status"
          label="name"
          :clearable="false"
          :reduce="(d) => d.name"
          placeholder="Select status"
        ></v-select>
      </div>

      <!-- Bank Account Number -->
      <div class="space-y-2">
        <p class="text-gray-800 text-[10px]">Bank Account Number</p>
        <input
          v-model="formData.bank_account_number"
          type="number"
          class="h-9 rounded-lg w-full bg-white border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:border-[#FF613c] text-xs"
          placeholder="Enter account number"
        />
      </div>

      <!-- Expense Items Table -->
      <div class="col-span-2">
        <table
          class="w-full rounded-xl overflow-hidden border border-gray-700 shadow-sm"
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

              <!-- Service Date for Tickets/Tours -->
              <th
                v-if="
                  detail?.items[0]?.product_type ==
                    'App\\Models\\EntranceTicket' ||
                  detail?.items[0]?.product_type ==
                    'App\\Models\\PrivateVanTour'
                "
                class="py-2 px-4 text-[10px] whitespace-nowrap font-normal text-left"
              >
                Service Date
              </th>

              <!-- Check-in/Check-out for Hotels -->
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

              <!-- Unit Cost Headers -->
              <th
                v-if="
                  detail?.items[0]?.product_type == 'App\\Models\\Hotel' ||
                  detail?.items[0]?.product_type ==
                    'App\\Models\\PrivateVanTour'
                "
                class="py-2 px-4 text-[10px] whitespace-nowrap font-normal text-left"
              >
                Unit Cost *
              </th>
              <th
                v-if="
                  detail?.items[0]?.product_type ==
                  'App\\Models\\EntranceTicket'
                "
                class="py-2 px-4 text-[10px] whitespace-nowrap font-normal text-left"
              >
                Adult Unit Cost *
              </th>
              <th
                v-if="
                  detail?.items[0]?.product_type ==
                  'App\\Models\\EntranceTicket'
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
              <!-- Code -->
              <td
                class="py-2 px-4 text-[10px] relative whitespace-nowrap font-normal text-left"
              >
                {{ formData.multiple_crm_id[index].split("_")[1] }}
              </td>

              <!-- Name - Entrance Ticket -->
              <td
                v-if="
                  detail?.items[index]?.product_type ==
                  'App\\Models\\EntranceTicket'
                "
                class="py-2 px-4 text-[10px] font-normal max-w-[120px] text-left"
              >
                {{ detail?.items[index]?.variation?.name }}
              </td>

              <!-- Name - Hotel -->
              <td
                v-if="
                  detail?.items[index]?.product_type == 'App\\Models\\Hotel'
                "
                class="py-2 px-4 text-[10px] font-normal min-w-[120px] text-left"
              >
                {{ detail?.items[index]?.room?.name }}
              </td>

              <!-- Name - Private Van Tour -->
              <td
                v-if="
                  detail?.items[index]?.product_type ==
                  'App\\Models\\PrivateVanTour'
                "
                class="py-2 px-4 text-[10px] font-normal min-w-[120px] text-left"
              >
                {{ detail?.items[index]?.car?.name }}
              </td>

              <!-- Service Date -->
              <td
                v-if="
                  detail?.items[index]?.product_type ==
                    'App\\Models\\EntranceTicket' ||
                  detail?.items[index]?.product_type ==
                    'App\\Models\\PrivateVanTour'
                "
                class="py-2 px-4 text-[10px] font-normal text-left"
              >
                {{ detail?.items[index]?.service_date }}
              </td>

              <!-- Check-in Date -->
              <td
                v-if="
                  detail?.items[index]?.product_type == 'App\\Models\\Hotel'
                "
                class="py-2 px-4 text-[10px] whitespace-nowrap font-normal text-left"
              >
                {{ detail?.items[index]?.checkin_date }}
              </td>

              <!-- Check-out Date -->
              <td
                v-if="
                  detail?.items[index]?.product_type == 'App\\Models\\Hotel'
                "
                class="py-2 px-4 text-[10px] whitespace-nowrap font-normal text-left"
              >
                {{ detail?.items[index]?.checkout_date }}
              </td>

              <!-- Adult Unit Cost -->
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
                  v-if="
                    detail?.items[index]?.product_type ==
                    'App\\Models\\EntranceTicket'
                  "
                  v-model="formData.multiple_cost_price[index]"
                  type="number"
                  class="h-8 ml-2 col-span-1 rounded-lg bg-white border border-gray-300 px-2 w-[80px] py-2 text-gray-900 focus:outline-none focus:border-[#FF613c] text-xs"
                />
              </td>

              <!-- Child Unit Cost -->
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
                    formData.multiple_individual[index]?.child?.cost_price !=
                    null
                  "
                  v-model="formData.multiple_individual[index].child.cost_price"
                  type="number"
                  class="h-8 ml-2 col-span-1 rounded-lg bg-white border border-gray-300 px-2 w-[80px] py-2 text-gray-900 focus:outline-none focus:border-[#FF613c] text-xs"
                />
              </td>

              <!-- Total Cost -->
              <td
                class="py-2 px-4 text-[12px] whitespace-nowrap font-normal text-end relative"
              >
                <!-- Info Button for Hotels -->
                <button
                  @click="showExpenseUpdateModal(detail?.items[index])"
                  v-if="
                    detail?.items[index]?.product_type == 'App\\Models\\Hotel'
                  "
                  class="absolute bottom-4 left-2 rounded-full text-[8px] px-2 py-1 bg-[#FF613c] text-white hover:bg-[#e55139] transition-colors cursor-pointer"
                  title="View price breakdown"
                >
                  i
                </button>

                <!-- Non-Hotel Total Cost -->
                <p
                  v-if="
                    detail?.items[index]?.product_type != 'App\\Models\\Hotel'
                  "
                >
                  {{ formattedNumber(detail?.items[index]?.total_cost_price) }}
                  thb
                </p>

                <!-- Hotel Total Cost Input -->
                <input
                  v-if="
                    detail?.items[index]?.product_type == 'App\\Models\\Hotel'
                  "
                  type="text"
                  v-model="displayValues[index]"
                  @input="handleInput(index)"
                  @focus="handleFocus(index)"
                  @blur="handleBlur(index)"
                  :placeholder="
                    formattedNumber(detail?.items[index]?.total_cost_price)
                  "
                  class="h-8 col-span-1 rounded-lg bg-white border border-gray-300 px-2 w-[100px] py-2 text-gray-900 focus:outline-none focus:border-[#FF613c] text-xs"
                />
              </td>
            </tr>

            <!-- Total Row -->
            <tr class="bg-[#FF613c]/40">
              <td
                :colspan="
                  detail?.items[0]?.product_type ==
                  'App\\Models\\PrivateVanTour'
                    ? 4
                    : 5
                "
                class="py-2 px-4 text-[10px] whitespace-nowrap font-normal text-left"
              >
                Total Cost
              </td>
              <td
                class="py-2 px-4 text-[14px] whitespace-nowrap font-normal text-end"
              >
                {{ formattedNumber(total_cost_calculate) }} thb
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Price Breakdown Modal -->
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
          <p>How to calculate expense</p>
          <XCircleIcon
            class="w-5 h-5 text-white cursor-pointer hover:text-gray-200"
            @click="closeExpenseUpdateModal"
          />
        </DialogTitle>

        <div class="p-6">
          <!-- Header Row -->
          <div
            class="text-xs flex justify-between items-center border-b border-gray-300 pb-3"
          >
            <p class="px-2 font-medium text-sm whitespace-nowrap">
              Date <span class="opacity-0">-----</span>
            </p>
            <p class="px-2 font-medium text-sm whitespace-nowrap">Sale</p>
            <p class="px-2 font-medium text-sm whitespace-nowrap">Cost</p>
          </div>

          <!-- Daily Pricing Rows -->
          <div class="pb-4">
            <div
              v-for="i in showExpenseUpdate?.daily_pricing"
              :key="i.date"
              class="text-xs flex justify-between items-center space-y-4"
            >
              <p class="whitespace-nowrap px-2">{{ i.date }}</p>
              <p class="px-2">{{ i.sale_price * showExpenseQuantity }}</p>
              <p class="px-2">{{ i.cost_price * showExpenseQuantity }}</p>
            </div>
          </div>

          <!-- Total Row -->
          <div
            class="text-xs flex justify-between items-center border-t border-gray-300 pt-3"
          >
            <p class="px-2 font-medium text-sm whitespace-nowrap">
              Total <span class="opacity-0">-----</span>
            </p>
            <p class="px-2 font-medium text-sm whitespace-nowrap">
              {{ showExpenseUpdate?.total_sale_price * showExpenseQuantity }}
              THB
            </p>
            <p class="px-2 font-medium text-sm whitespace-nowrap">
              {{ showExpenseUpdate?.total_cost_price * showExpenseQuantity }}
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
import { useReservationStore } from "../../../stores/reservation";
import Modal from "../../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useRoute } from "vue-router";
import { daysBetween } from "../../help/DateBetween";
import { useGroupStore } from "../../../stores/group";
import { formattedNumber } from "../../help/FormatData";
import { useHotelStore } from "../../../stores/hotel";

const toast = useToast();
const reservationStore = useReservationStore();
const groupStore = useGroupStore();
const hotelStore = useHotelStore();
const route = useRoute();

const props = defineProps({
  detail: Object,
  getDetailAction: Function,
});

// State
const loading = ref(false);
const emailBooking = ref(false);
const showExpenseUpdate = ref(null);
const showExpenseQuantity = ref(0);
const displayValues = ref([]);
const actualValues = ref([]);

// Form Data
const formData = ref({
  multiple_id: [],
  multiple_id_reservation: [],
  multiple_crm_id: [],
  multiple_cost_price: [],
  multiple_total_cost_price: [],
  multiple_individual: [],
  payment_method: "",
  bank_name: "",
  bank_account_number: "",
  payment_status: "",
  hotalQuantity: [],
  multiple_quantity: [],
  product_type: "",
});

// Options Arrays
const paymentArray = [
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

// Computed
const total_cost_calculate = computed(() => {
  let result = 0;
  for (let i = 0; i < props?.detail?.items.length; i++) {
    result +=
      Number(formData.value.multiple_total_cost_price[i]) ||
      props?.detail?.items[i]?.total_cost_price;
  }
  return result;
});

// Methods
const handleInput = (index) => {
  const inputValue = displayValues.value[index] || "";
  const numericValue = inputValue.replace(/[^\d.]/g, "");
  actualValues.value[index] = parseFloat(numericValue) || 0;
  formData.value.multiple_total_cost_price[index] = actualValues.value[index];
};

const handleFocus = (index) => {
  displayValues.value[index] = String(actualValues.value[index] || "");
};

const handleBlur = (index) => {
  const value = actualValues.value[index];
  displayValues.value[index] = value ? formattedNumber(value) : "";
};

const initializeDisplayArrays = () => {
  if (props.detail && props.detail.items) {
    displayValues.value = [];
    actualValues.value = [];

    props.detail.items.forEach((item, index) => {
      const value = item.total_cost_price || 0;
      actualValues.value[index] = value;
      displayValues.value[index] = formattedNumber(value);

      if (!formData.value.multiple_total_cost_price) {
        formData.value.multiple_total_cost_price = [];
      }
      formData.value.multiple_total_cost_price[index] = value;
    });
  }
};

const showExpenseUpdateModal = async (item) => {
  showExpenseQuantity.value = item.quantity;

  let data = {
    checkin_date: item.checkin_date,
    checkout_date: item.checkout_date,
  };

  const res = await hotelStore.getRoomPrice(data, item.room.id);

  if (res) {
    showExpenseUpdate.value = res.data;
  }
};

const closeExpenseUpdateModal = () => {
  showExpenseUpdate.value = null;
  showExpenseQuantity.value = 0;
};

const expenseUpdateAction = async () => {
  loading.value = true;
  let successCount = 0;
  let failCount = 0;

  try {
    const itemIds = formData.value.multiple_id || [];

    if (itemIds.length === 0) {
      toast.error("No items found to update");
      loading.value = false;
      return;
    }

    for (let i = 0; i < itemIds.length; i++) {
      try {
        const itemId = itemIds[i];
        const frmData = new FormData();
        frmData.append("_method", "PUT");

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

        // Handle Entrance Ticket individual pricing
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
            (formData.value.multiple_individual[i]?.child?.cost_price ?? 0) *
              formData.value.multiple_individual[i]?.child?.quantity
          );
          frmData.append(
            "individual_pricing[child][amount]",
            formData.value.multiple_individual[i]?.child?.selling_price
              ? formData.value.multiple_individual[i]?.child?.selling_price *
                  formData.value.multiple_individual[i]?.child?.quantity
              : 0
          );
        }

        if (costPrice) frmData.append("cost_price", costPrice);
        if (formData.value.payment_method)
          frmData.append("payment_method", formData.value.payment_method);
        if (quantity) frmData.append("quantity", quantity);
        if (formData.value.payment_status)
          frmData.append("payment_status", formData.value.payment_status);

        // Calculate total cost price
        if (costPrice) {
          if (
            props.detail?.items[0]?.product_type ==
            "App\\Models\\EntranceTicket"
          ) {
            let childCostTotal = 0;

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

            const totalCostPrice = costPrice * quantity + childCostTotal;
            frmData.append("total_cost_price", totalCostPrice);
          } else {
            const totalCostPrice = formData.value.multiple_total_cost_price[i];
            frmData.append("total_cost_price", totalCostPrice);
          }
        } else if (formData.value.multiple_total_cost_price[i]) {
          const totalCostPrice = formData.value.multiple_total_cost_price[i];
          frmData.append("total_cost_price", totalCostPrice);
        }

        const response = await reservationStore.updateAction(frmData, itemId);

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

          await groupStore.groupUpdateAction(route.query.id, secfrm);
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        console.error(`Error updating item ${itemIds[i]}:`, error);
        failCount++;
      }
    }

    if (failCount === 0) {
      toast.success(`Successfully updated ${successCount} items`);
    } else if (successCount === 0) {
      toast.error(`Failed to update all ${failCount} items`);
    } else {
      toast.info(
        `Updated ${successCount} items, failed to update ${failCount} items`
      );
    }
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

const populateFormData = async () => {
  if (props.detail && props.detail.items.length > 0) {
    formData.value.multiple_id = [];
    formData.value.multiple_id_reservation = [];
    formData.value.multiple_crm_id = [];
    formData.value.multiple_cost_price = [];
    formData.value.multiple_total_cost_price = [];
    formData.value.multiple_individual = [];
    formData.value.hotalQuantity = [];
    formData.value.multiple_quantity = [];

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
    formData.value.product_type = firstItem?.product_type || "";

    props.detail.items.forEach((item) => {
      formData.value.multiple_id.push(item.id);
      formData.value.multiple_id_reservation.push(item.id);
      formData.value.multiple_crm_id.push(item.crm_id);
      formData.value.multiple_cost_price.push(item.cost_price || 0);
      formData.value.multiple_total_cost_price.push(item.total_cost_price || 0);
      formData.value.multiple_individual.push(item.individual_pricing);

      if (item.product_type == "App\\Models\\Hotel") {
        const nights = daysBetween(item.checkin_date, item.checkout_date);
        formData.value.hotalQuantity.push(item.quantity * nights);
      }
      formData.value.multiple_quantity.push(item.quantity);
    });
  }
};

// Watchers
watch(
  () => props.detail,
  (newValue) => {
    if (newValue) {
      populateFormData();
      initializeDisplayArrays();
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (props.detail) {
    populateFormData();
    initializeDisplayArrays();
  }
});
</script>
