<!-- ExpenseModal.vue -->
<template>
  <Modal :marginTop="5" :isOpen="isOpen" @closeModal="handleClose">
    <DialogPanel
      class="w-full max-w-6xl transform rounded-xl bg-white text-left align-middle shadow-xl transition-all max-h-[95vh] overflow-hidden flex flex-col"
    >
      <!-- Header -->
      <DialogTitle
        as="div"
        class="text-lg font-semibold text-gray-900 p-6 pb-4 flex justify-between items-center border-b"
      >
        <div class="flex items-center gap-2">
          <WalletIcon class="w-6 h-6 text-[#FF613c]" />
          {{ expenseData?.id ? "Edit Expense" : "Add New Expense" }}
          <span class="text-xs font-normal text-gray-500 ml-2">
            ({{ groupData?.booking_crm_id }})
          </span>
        </div>
        <button
          @click="handleClose"
          class="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <XMarkIcon class="w-5 h-5 text-gray-500" />
        </button>
      </DialogTitle>

      <!-- Content -->
      <div class="flex-1 overflow-hidden flex">
        <!-- Left Sidebar - Steps -->
        <div
          class="w-72 bg-gradient-to-br from-[#FF613c]/5 to-orange-50 border-r p-6 overflow-y-auto"
        >
          <div class="space-y-1 relative">
            <!-- Vertical Line -->
            <div
              class="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-[#FF613c] via-orange-300 to-gray-200"
            ></div>

            <!-- Step 1: Expense Details -->
            <div
              @click="currentStep = 1"
              :class="[
                'relative flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300',
                currentStep === 1
                  ? 'bg-white shadow-lg scale-105'
                  : currentStep > 1
                  ? 'hover:bg-white/50'
                  : 'hover:bg-white/30',
              ]"
            >
              <div class="relative z-10 flex-shrink-0">
                <div
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                    currentStep === 1
                      ? 'bg-[#FF613c] text-white shadow-lg shadow-[#FF613c]/50 ring-4 ring-[#FF613c]/20'
                      : currentStep > 1
                      ? 'bg-[#FF613c] text-white'
                      : 'bg-white text-gray-400 border-2 border-gray-300',
                  ]"
                >
                  <CheckCircleIcon
                    v-if="isStep1Complete && currentStep !== 1"
                    class="w-5 h-5"
                  />
                  <span v-else>1</span>
                </div>
                <div
                  v-if="currentStep === 1"
                  class="absolute inset-0 rounded-full bg-[#FF613c] animate-ping opacity-20"
                ></div>
              </div>

              <div class="flex-1 min-w-0 pt-0.5">
                <h3
                  :class="[
                    'text-sm font-bold mb-0.5 transition-colors',
                    currentStep === 1
                      ? 'text-[#FF613c]'
                      : currentStep > 1
                      ? 'text-gray-800'
                      : 'text-gray-400',
                  ]"
                >
                  Payment Details
                </h3>
                <p class="text-[10px] text-gray-500 mt-0.5">
                  Amount & payment info
                </p>
              </div>

              <div v-if="isStep1Complete" class="flex-shrink-0">
                <div
                  class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <CheckCircleIcon class="w-4 h-4 text-green-600" />
                </div>
              </div>
            </div>

            <!-- Step 2: Payment Status -->
            <div
              @click="currentStep = 2"
              :class="[
                'relative flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300',
                currentStep === 2
                  ? 'bg-white shadow-lg scale-105'
                  : currentStep > 2
                  ? 'hover:bg-white/50'
                  : 'hover:bg-white/30',
              ]"
            >
              <div class="relative z-10 flex-shrink-0">
                <div
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                    currentStep === 2
                      ? 'bg-[#FF613c] text-white shadow-lg shadow-[#FF613c]/50 ring-4 ring-[#FF613c]/20'
                      : currentStep > 2
                      ? 'bg-[#FF613c] text-white'
                      : 'bg-white text-gray-400 border-2 border-gray-300',
                  ]"
                >
                  <CheckCircleIcon
                    v-if="isStep2Complete && currentStep !== 2"
                    class="w-5 h-5"
                  />
                  <span v-else>2</span>
                </div>
                <div
                  v-if="currentStep === 2"
                  class="absolute inset-0 rounded-full bg-[#FF613c] animate-ping opacity-20"
                ></div>
              </div>

              <div class="flex-1 min-w-0 pt-0.5">
                <h3
                  :class="[
                    'text-sm font-bold mb-0.5 transition-colors',
                    currentStep === 2
                      ? 'text-[#FF613c]'
                      : currentStep > 2
                      ? 'text-gray-800'
                      : 'text-gray-400',
                  ]"
                >
                  Payment Status
                </h3>
                <p class="text-[10px] text-gray-500 mt-0.5">
                  Update expense status
                </p>
              </div>

              <div v-if="isStep2Complete" class="flex-shrink-0">
                <div
                  class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <CheckCircleIcon class="w-4 h-4 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          <!-- Progress Section -->
          <div class="mt-8 pt-6 border-t border-orange-200">
            <div
              class="flex items-center justify-between text-xs font-medium text-gray-700 mb-3"
            >
              <span>Overall Progress</span>
              <span class="text-[#FF613c] font-bold"
                >{{ completionPercentage }}%</span
              >
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                class="bg-gradient-to-r from-[#FF613c] to-orange-400 h-2.5 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                :style="{ width: completionPercentage + '%' }"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
                ></div>
              </div>
            </div>
            <div class="mt-2 text-[10px] text-gray-500 text-center">
              {{ Math.round(completionPercentage / 50) }} of 2 steps completed
            </div>
          </div>
        </div>

        <!-- Right Content Area -->
        <div class="flex-1 overflow-y-auto p-6">
          <!-- Step 1: Payment Details -->
          <div v-show="currentStep === 1" class="space-y-4">
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">
                Payment Slip Details
              </h3>
              <p class="text-[10px] text-gray-500">
                Upload payment slip and enter payment information
              </p>
            </div>

            <!-- Payment Slip Image -->
            <div class="grid grid-cols-2 gap-x-4">
              <div>
                <label class="text-xs font-medium text-gray-700 mb-1.5 block">
                  Payment Slip Image *
                </label>

                <!-- Existing Image -->
                <div
                  v-if="formData.imagePreview && !newImagePreview"
                  class="w-full h-[300px]"
                >
                  <img
                    :src="formData.imagePreview"
                    class="rounded-lg shadow hover:shadow-lg h-full object-contain w-full cursor-pointer border"
                    alt="Current slip"
                    @click="viewImage(formData.imagePreview)"
                  />
                  <button
                    @click="formData.imagePreview = ''"
                    class="mt-3 w-full px-4 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Remove Current Image
                  </button>
                </div>

                <!-- Upload Area -->
                <div
                  v-else-if="!formData.imagePreview && !newImagePreview"
                  @click="openFileUpload"
                  class="w-full h-[300px] border-2 rounded-lg border-dashed flex flex-col justify-center items-center text-[#FF613c] border-[#FF613c] cursor-pointer hover:bg-[#FF613c]/5 transition-colors"
                >
                  <PlusCircleIcon class="w-12 h-12 text-[#FF613c] mb-2" />
                  <span class="mt-2 text-sm font-medium">
                    Click to Upload Payment Slip
                  </span>
                  <span class="mt-1 text-xs text-gray-500">
                    PNG, JPG, JPEG up to 10MB
                  </span>
                </div>

                <!-- Preview New Image -->
                <div
                  v-else-if="newImagePreview"
                  class="w-full h-[300px] relative"
                >
                  <img
                    :src="newImagePreview"
                    class="rounded-lg shadow h-full object-contain w-full cursor-pointer border"
                    alt="Slip preview"
                    @click="viewImage(newImagePreview)"
                  />
                  <button
                    @click="clearImage"
                    class="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                  >
                    <XCircleIcon class="w-5 h-5" />
                  </button>
                </div>

                <input
                  type="file"
                  ref="fileInput"
                  class="hidden"
                  @change="handleFileChange"
                  accept="image/*"
                  :disabled="loading"
                />
              </div>

              <div class="gap-4 space-y-2">
                <!-- Date & Time -->
                <div>
                  <label class="text-xs font-medium text-gray-700 mb-1.5 block">
                    Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    v-model="formData.date"
                    :disabled="loading"
                    class="border text-sm border-gray-200 px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20 focus:border-[#FF613c] disabled:bg-gray-50"
                    required
                  />
                </div>

                <!-- Amount -->
                <div>
                  <label class="text-xs font-medium text-gray-700 mb-1.5 block">
                    Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    v-model="formData.amount"
                    placeholder="Enter amount"
                    :disabled="loading"
                    class="border text-sm border-gray-200 px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20 focus:border-[#FF613c] disabled:bg-gray-50"
                    required
                  />
                  <p
                    v-if="groupData?.total_cost_price"
                    class="text-xs text-blue-600 mt-1"
                  >
                    💡 Suggested:
                    {{ formatCurrency(groupData.total_cost_price) }}
                  </p>
                </div>

                <!-- Currency -->
                <div>
                  <label class="text-xs font-medium text-gray-700 mb-1.5 block">
                    Currency *
                  </label>
                  <select
                    v-model="formData.currency"
                    :disabled="loading"
                    class="border text-sm border-gray-200 px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20 focus:border-[#FF613c] disabled:bg-gray-50"
                    required
                  >
                    <option value="THB">THB</option>
                    <option value="MMK">MMK</option>
                    <option value="USD">USD</option>
                  </select>
                </div>

                <!-- Bank Type -->
                <div>
                  <label class="text-xs font-medium text-gray-700 mb-1.5 block">
                    Bank Type *
                  </label>
                  <select
                    v-model="formData.interact_bank"
                    :disabled="loading"
                    class="border text-sm border-gray-200 px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20 focus:border-[#FF613c] disabled:bg-gray-50"
                    required
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

                <!-- Sender -->
                <div>
                  <label class="text-xs font-medium text-gray-700 mb-1.5 block">
                    Sender
                  </label>
                  <input
                    type="text"
                    v-model="formData.sender"
                    placeholder="Enter sender name"
                    :disabled="loading"
                    class="border text-sm border-gray-200 px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20 focus:border-[#FF613c] disabled:bg-gray-50"
                  />
                </div>

                <!-- Receiver -->
                <div>
                  <label class="text-xs font-medium text-gray-700 mb-1.5 block">
                    Receiver
                  </label>
                  <input
                    type="text"
                    v-model="formData.receiver"
                    placeholder="Enter receiver name"
                    :disabled="loading"
                    class="border text-sm border-gray-200 px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20 focus:border-[#FF613c] disabled:bg-gray-50"
                  />
                  <p
                    v-if="groupData?.items?.[0]?.product?.account_name"
                    class="text-xs text-green-600 mt-1"
                  >
                    ✓ Suggested: {{ groupData.items[0].product.account_name }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Payment Status -->
          <div v-show="currentStep === 2" class="space-y-4">
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">
                Update Payment Status
              </h3>
              <p class="text-[10px] text-gray-500">
                Select the expense payment status
              </p>
            </div>

            <!-- Status Selection -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                v-for="status in statusOptions"
                :key="status.value"
                @click="
                  canChangeStatus(status.value) &&
                    (formData.status = status.value)
                "
                :disabled="loading || !canChangeStatus(status.value)"
                :class="[
                  'flex items-center gap-3 px-4 py-3 border-2 rounded-lg transition-all',
                  formData.status === status.value
                    ? `border-${status.color}-500 bg-${status.color}-50 shadow-md`
                    : `border-${status.color}-200 hover:bg-${status.color}-50`,
                  !canChangeStatus(status.value)
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer',
                ]"
              >
                <div :class="`p-2 bg-${status.color}-100 rounded-full`">
                  <component
                    :is="status.icon"
                    :class="`w-5 h-5 text-${status.color}-600`"
                  />
                </div>
                <div class="text-left flex-1">
                  <p class="text-sm font-medium text-gray-900">
                    {{ status.label }}
                  </p>
                  <p class="text-xs text-gray-500">{{ status.description }}</p>
                </div>
                <div
                  v-if="formData.status === status.value"
                  class="flex-shrink-0"
                >
                  <CheckIcon :class="`w-5 h-5 text-${status.color}-600`" />
                </div>
              </button>
            </div>

            <!-- Info message for create mode -->
            <div
              v-if="isCreateMode"
              class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
            >
              <div class="flex items-start gap-3">
                <InformationCircleIcon
                  class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p class="text-sm font-medium text-blue-900">
                    {{
                      isStep1Complete
                        ? "Status Can Be Changed"
                        : "Complete Payment Details First"
                    }}
                  </p>
                  <p class="text-xs text-blue-700 mt-1">
                    <span v-if="!isStep1Complete">
                      You can only select "Not Paid" status until you complete
                      all payment details (image, amount, date, etc.). Once
                      completed, all status options will be available.
                    </span>
                    <span v-else>
                      All payment details are complete. You can now select any
                      status (Not Paid, Partially Paid, or Fully Paid). Current
                      status:
                      <span class="font-semibold">{{
                        formatExpenseStatus(formData.status)
                      }}</span>
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <!-- Current Group Status -->
            <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div class="flex items-start gap-3">
                <InformationCircleIcon
                  class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p class="text-sm font-medium text-blue-900">
                    Current Status
                  </p>
                  <p class="text-xs text-blue-700 mt-1">
                    Group Expense Status:
                    <span class="font-semibold">
                      {{ formatExpenseStatus(groupData?.expense_status) }}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="border-t flex justify-between items-center p-6 pt-4 gap-3 bg-gray-50"
      >
        <div class="flex justify-start items-center gap-x-3">
          <button
            v-if="currentStep > 1"
            @click="currentStep--"
            :disabled="loading"
            class="px-4 py-2.5 bg-gray-200 text-black text-sm rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ChevronLeftIcon class="w-4 h-4" />
            Previous
          </button>

          <button
            v-if="currentStep < 2 && !formData.id"
            @click="currentStep++"
            :disabled="loading || !isStep1Complete"
            class="px-4 py-2.5 bg-[#FF613c] text-white text-sm rounded-lg hover:bg-[#e55139] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Next
            <ChevronRightIcon class="w-4 h-4" />
          </button>

          <button
            v-if="currentStep === 1 && formData.id"
            @click="currentStep++"
            :disabled="loading || !isStep1Complete"
            class="px-4 py-2.5 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span v-if="loading && currentAction === 'next_update'">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  fill="none"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </span>
            Next
            <ChevronRightIcon class="w-4 h-4" />
          </button>
        </div>
        <div class="flex justify-start items-center gap-x-3">
          <button
            v-if="formData.id"
            @click="handleDelete"
            :disabled="loading"
            class="px-4 py-2.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span v-if="loading && currentAction === 'delete'">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  fill="none"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </span>
            Delete
          </button>

          <button
            @click="handleClose"
            :disabled="loading"
            class="px-4 py-2.5 bg-white border border-gray-300 text-sm rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <!-- Final Save/Update Button -->
          <button
            v-if="currentStep === 2 && isCreateMode"
            @click="isCreateMode ? handleSave() : updateOnlyStatus()"
            :disabled="loading || !isFormValid"
            class="px-4 py-2.5 bg-[#FF613c] text-white text-sm rounded-lg hover:bg-[#e55139] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span
              v-if="
                loading &&
                (currentAction === 'save' || currentAction === 'status')
              "
            >
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  fill="none"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </span>
            {{ formData.id ? "Update Status" : "Create Expense" }}
          </button>

          <!-- Full Update Button in Step 2 for Edit Mode -->
          <button
            v-if="currentStep === 2 && formData.id"
            @click="handleSave"
            :disabled="loading || !isFormValid"
            class="px-4 py-2.5 bg-[#FF613c] text-white text-sm rounded-lg hover:bg-[#e55139] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span v-if="loading && currentAction === 'save'">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  fill="none"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </span>
            Update Status
          </button>
        </div>
      </div>
    </DialogPanel>
  </Modal>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import {
  XMarkIcon,
  PlusCircleIcon,
  WalletIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/vue/24/outline";
import Modal from "../../../components/Modal.vue";
import { useToast } from "vue-toastification";
import { useCashImageStore } from "../../../stores/cashImage";
import { useGroupStore } from "../../../stores/group";
import { useReservationStore } from "../../../stores/reservation";
import Swal from "sweetalert2";

const props = defineProps({
  isOpen: Boolean,
  expenseData: Object,
  groupData: Object,
  groupId: [String, Number],
});

const emit = defineEmits(["close", "refresh"]);

const toast = useToast();
const cashImageStore = useCashImageStore();
const groupStore = useGroupStore();
const reservationStore = useReservationStore();

const loading = ref(false);
const currentAction = ref("");
const fileInput = ref(null);
const newImagePreview = ref("");
const newImageFile = ref(null);
const currentStep = ref(1);

const formData = ref({
  id: null,
  image: null,
  imagePreview: null,
  amount: 0,
  date: "",
  sender: "MR. THIHA@KUMAR BHUSAL",
  receiver: "",
  interact_bank: "personal",
  currency: "THB",
  status: "not_paid",
});

const statusOptions = [
  {
    value: "not_paid",
    label: "Not Paid",
    description: "Mark as unpaid",
    icon: ExclamationTriangleIcon,
    color: "red",
  },
  {
    value: "partially_paid",
    label: "Partially Paid",
    description: "Partial payment",
    icon: WalletIcon,
    color: "orange",
  },
  {
    value: "fully_paid",
    label: "Fully Paid",
    description: "Complete payment",
    icon: CheckIcon,
    color: "green",
  },
];

// Computed Properties
const isCreateMode = computed(() => !formData.value.id);

const isFormValid = computed(() => {
  if (formData.value.id) {
    return (
      formData.value.amount > 0 && formData.value.date && formData.value.status
    );
  }
  return (
    (formData.value.imagePreview || newImageFile.value) &&
    formData.value.amount > 0 &&
    formData.value.date
  );
});

const isStep1Complete = computed(() => {
  return (
    (formData.value.imagePreview || newImageFile.value) &&
    formData.value.amount > 0 &&
    formData.value.date &&
    formData.value.currency &&
    formData.value.interact_bank
  );
});

const isStep2Complete = computed(() => {
  return formData.value.status !== "";
});

const completionPercentage = computed(() => {
  let completed = 0;
  if (isStep1Complete.value) completed++;
  if (isStep2Complete.value) completed++;
  return (completed / 2) * 100;
});

// Status Change Control
const canChangeStatus = (statusValue) => {
  // In update mode, all statuses can be changed
  if (!isCreateMode.value) {
    return true;
  }

  // In create mode:
  // - If Step 1 is NOT complete, only "not_paid" can be selected
  // - If Step 1 IS complete, all statuses can be selected
  if (!isStep1Complete.value) {
    return statusValue === "not_paid";
  }

  return true;
};

// Helper Functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
  }).format(amount);
};

const formatExpenseStatus = (status) => {
  const statuses = {
    not_paid: "Not Paid",
    partially_paid: "Partially Paid",
    fully_paid: "Fully Paid",
  };
  return statuses[status] || status;
};

const formattedDateTimeDB = (dateString) => {
  if (!dateString) return "";

  // Handle datetime-local format (YYYY-MM-DDTHH:mm)
  if (dateString.includes("T")) {
    return dateString.replace("T", " ") + ":00";
  }

  // Handle DD-MM-YYYY HH:mm:ss format
  const ddmmyyyyRegex = /^(\d{2})-(\d{2})-(\d{4})\s(.*)$/;
  const match = dateString.match(ddmmyyyyRegex);

  if (match) {
    return `${match[3]}-${match[2]}-${match[1]} ${match[4]}`;
  }

  // If already in correct format or other format, return as-is
  return dateString;
};

const formatDateForInput = (dateString) => {
  if (!dateString) return "";

  // Handle DD-MM-YYYY HH:mm:ss format from DB
  const ddmmyyyyRegex = /^(\d{2})-(\d{2})-(\d{4})\s(\d{2}):(\d{2}):(\d{2})$/;
  const match = dateString.match(ddmmyyyyRegex);

  if (match) {
    // Convert to YYYY-MM-DDTHH:mm format for datetime-local input
    return `${match[3]}-${match[2]}-${match[1]}T${match[4]}:${match[5]}`;
  }

  // Handle YYYY-MM-DD HH:mm:ss format
  if (dateString.includes(" ")) {
    const [datePart, timePart] = dateString.split(" ");
    const [hours, minutes] = timePart.split(":");
    return `${datePart}T${hours}:${minutes}`;
  }

  // If already in correct format
  if (dateString.includes("T")) {
    return dateString.slice(0, 16);
  }

  return dateString;
};

// File Functions
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    newImageFile.value = file;
    newImagePreview.value = URL.createObjectURL(file);
  }
};

const openFileUpload = () => {
  if (!loading.value) fileInput.value?.click();
};

const clearImage = () => {
  newImageFile.value = null;
  newImagePreview.value = "";
  if (fileInput.value) fileInput.value.value = "";
};

const viewImage = (url) => {
  window.open(url, "_blank");
};

// CRUD Functions
const handleSave = async () => {
  if (!isFormValid.value) {
    toast.error("Please complete all required fields");
    return;
  }

  currentAction.value = "save";

  if (formData.value.id) {
    await updateExpenseAndStatus();
  } else {
    await createExpense();
  }
};

const handleNextAndUpdate = async () => {
  if (!isStep1Complete.value) {
    toast.error("Please complete payment details first");
    return;
  }

  currentAction.value = "next_update";

  if (formData.value.id) {
    await updateExpenseOnly();
    currentStep.value = 2;
  } else {
    currentStep.value = 2;
  }
};

const createExpense = async () => {
  if (!newImageFile.value) {
    toast.error("Please upload a payment slip image");
    return;
  }

  try {
    loading.value = true;
    const expenseFrmData = new FormData();
    expenseFrmData.append("relatable_type", "App\\Models\\BookingItemGroup");
    expenseFrmData.append("relatable_id", props.groupId);
    expenseFrmData.append("amount", formData.value.amount);
    expenseFrmData.append("sender", formData.value.sender);
    expenseFrmData.append("reciever", formData.value.receiver);
    expenseFrmData.append("interact_bank", formData.value.interact_bank);
    expenseFrmData.append("currency", formData.value.currency);
    expenseFrmData.append("date", formattedDateTimeDB(formData.value.date));
    expenseFrmData.append("image", newImageFile.value);

    const response = await cashImageStore.addNewAction(expenseFrmData);

    if (response.status === 1) {
      // Update group status
      await updateGroupStatus(formData.value.status);

      toast.success("Expense payment slip created successfully");
      emit("refresh");
      handleClose();
    } else {
      throw new Error("Failed to create expense");
    }
  } catch (error) {
    console.error("Error creating expense:", error);
    toast.error("Failed to create expense");
  } finally {
    loading.value = false;
    currentAction.value = "";
  }
};

const updateExpenseOnly = async () => {
  try {
    loading.value = true;
    const expenseFrmData = new FormData();
    expenseFrmData.append("_method", "PUT");
    expenseFrmData.append("amount", formData.value.amount);
    expenseFrmData.append("sender", formData.value.sender);
    expenseFrmData.append("reciever", formData.value.receiver);
    expenseFrmData.append("interact_bank", formData.value.interact_bank);
    expenseFrmData.append("currency", formData.value.currency);
    expenseFrmData.append("date", formattedDateTimeDB(formData.value.date));

    if (newImageFile.value) {
      expenseFrmData.append("image", newImageFile.value);
    }

    const response = await cashImageStore.updateAction(
      expenseFrmData,
      formData.value.id
    );

    if (response.status === 1) {
      toast.success("Expense details updated successfully");
    } else {
      throw new Error("Failed to update expense");
    }
  } catch (error) {
    console.error("Error updating expense:", error);
    toast.error("Failed to update expense");
  } finally {
    loading.value = false;
    currentAction.value = "";
  }
};

const updateExpenseAndStatus = async () => {
  try {
    loading.value = true;
    const expenseFrmData = new FormData();
    expenseFrmData.append("_method", "PUT");
    expenseFrmData.append("amount", formData.value.amount);
    expenseFrmData.append("sender", formData.value.sender);
    expenseFrmData.append("reciever", formData.value.receiver);
    expenseFrmData.append("interact_bank", formData.value.interact_bank);
    expenseFrmData.append("currency", formData.value.currency);
    expenseFrmData.append("date", formattedDateTimeDB(formData.value.date));

    if (newImageFile.value) {
      expenseFrmData.append("image", newImageFile.value);
    }

    const response = await cashImageStore.updateAction(
      expenseFrmData,
      formData.value.id
    );

    if (response.status === 1) {
      // Update group status
      await updateGroupStatus(formData.value.status);

      toast.success("Expense payment slip and status updated successfully");
      emit("refresh");
      handleClose();
    } else {
      throw new Error("Failed to update expense");
    }
  } catch (error) {
    console.error("Error updating expense:", error);
    toast.error("Failed to update expense");
  } finally {
    loading.value = false;
    currentAction.value = "";
  }
};

const updateOnlyStatus = async () => {
  try {
    loading.value = true;
    currentAction.value = "status";

    await updateGroupStatus(formData.value.status);

    toast.success("Payment status updated successfully");
    emit("refresh");
    handleClose();
  } catch (error) {
    console.error("Error updating status:", error);
    toast.error("Failed to update status");
  } finally {
    loading.value = false;
    currentAction.value = "";
  }
};

const updateGroupStatus = async (status) => {
  try {
    // Update all items in the group
    if (props.groupData?.items && props.groupData.items.length > 0) {
      for (const item of props.groupData.items) {
        const frmData = new FormData();
        frmData.append("_method", "PUT");
        frmData.append("payment_status", status);
        await reservationStore.updateAction(frmData, item.id);
      }
    }

    // Update group expense status
    const groupFrmData = new FormData();
    groupFrmData.append("_method", "PUT");
    groupFrmData.append("expense_status", status);
    await groupStore.groupUpdateAction(props.groupId, groupFrmData);
  } catch (error) {
    console.error("Error updating group status:", error);
    throw error;
  }
};

const handleDelete = async () => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        loading.value = true;
        currentAction.value = "delete";

        const response = await cashImageStore.deleteAction(formData.value.id);

        if (response.status === 1) {
          toast.success("Expense deleted successfully");
          emit("refresh");
          handleClose();
        } else {
          throw new Error("Failed to delete expense");
        }
      } catch (error) {
        console.error("Error deleting expense:", error);
        toast.error("Failed to delete expense");
      } finally {
        loading.value = false;
        currentAction.value = "";
      }
    }
  });
};

const handleClose = () => {
  formData.value = {
    id: null,
    image: null,
    imagePreview: null,
    amount: 0,
    date: "",
    sender: "MR. THIHA@KUMAR BHUSAL",
    receiver: "",
    interact_bank: "personal",
    currency: "THB",
    status: "not_paid",
  };
  newImagePreview.value = "";
  newImageFile.value = null;
  currentStep.value = 1;
  if (fileInput.value) fileInput.value.value = "";
  emit("close");
};

// Watchers
watch(
  () => props.expenseData,
  (newData) => {
    if (newData && props.isOpen) {
      formData.value = {
        id: newData.id,
        image: newData.image,
        imagePreview: newData.image,
        amount: newData.amount || 0,
        date: formatDateForInput(newData.date) || "",
        sender: newData.sender || "MR. THIHA@KUMAR BHUSAL",
        receiver: newData.reciever || "",
        interact_bank: newData.interact_bank || "personal",
        currency: newData.currency || "THB",
        status: props.groupData?.expense_status || "not_paid",
      };
      newImagePreview.value = "";
      newImageFile.value = null;
    }
  },
  { immediate: true }
);

watch(
  () => props.groupData,
  (newData) => {
    console.log("this is new", newData);
    if (newData && !props.expenseData && props.isOpen) {
      formData.value.amount = newData.total_cost_price || 0;
      formData.value.receiver = newData.account_name || "";
      formData.value.date = new Date().toISOString().slice(0, 16);
      formData.value.status = newData.expense_status || "not_paid";
    }
  },
  { immediate: true }
);
</script>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
</style>
