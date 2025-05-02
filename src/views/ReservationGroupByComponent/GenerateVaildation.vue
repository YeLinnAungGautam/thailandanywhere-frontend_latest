<template>
  <Modal :isOpen="openModalArchive" @closeModal="closeArchiveModal">
    <DialogPanel
      class="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all"
    >
      <DialogTitle
        as="div"
        class="text-lg font-medium leading-6 text-gray-900 mb-5 flex justify-between items-center"
      >
        ⚠️ Validation Required
        <button
          type="button"
          class="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="closeArchiveModal"
        >
          <XMarkIcon class="w-6 h-6 text-black cursor-pointer" />
          <span class="sr-only">Close</span>
        </button>
      </DialogTitle>

      <div class="space-y-4">
        <p class="text-sm font-medium">
          Review all items before generate accounting
        </p>

        <!-- Items validation section -->
        <div
          class="max-h-96 overflow-y-auto border rounded-lg p-4"
          v-if="!showTextCopy"
        >
          <div
            v-if="validationStatus.basic"
            class="flex items-center mb-3 text-sm"
          >
            <CheckCircleIcon class="w-5 h-5 text-green-600 mr-2" />
            <span>Basic information validated successfully</span>
          </div>
          <div v-else class="flex items-center mb-3 text-sm">
            <ExclamationCircleIcon class="w-5 h-5 text-orange-500 mr-2" />
            <span>Validating basic information...</span>
          </div>

          <!-- Items list -->
          <div
            v-for="(item, index) in bookingItems"
            :key="index"
            class="mb-4 border-b pb-3"
          >
            <div class="flex justify-between items-center">
              <div class="font-medium">
                Booking #{{ index + 1 }}: {{ item.crm_id || "Unknown" }}
              </div>
              <div
                v-if="validationStatus.items[index]"
                class="flex items-center text-green-600"
              >
                <CheckCircleIcon class="w-5 h-5 mr-1" />
                <span class="text-xs">Validated</span>
              </div>
              <div v-else class="flex items-center text-orange-500">
                <ExclamationCircleIcon class="w-5 h-5 mr-1" />
                <span class="text-xs">Validation Failed</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 mt-2 text-xs">
              <div class="flex">
                <span class="font-medium mr-1">Supplier:</span>
                <span>{{
                  item.reservation_car_info?.supplier_name || "Not specified"
                }}</span>
                <ExclamationCircleIcon
                  v-if="!item.reservation_car_info?.supplier_name"
                  class="w-4 h-4 text-red-500 ml-1"
                />
              </div>

              <div class="flex">
                <span class="font-medium mr-1">Driver Collect:</span>
                <span v-if="item.is_driver_collect !== undefined">
                  {{
                    item.is_driver_collect === null
                      ? "Empty"
                      : item.is_driver_collect == 1
                      ? "Yes"
                      : "No"
                  }}
                </span>
                <span v-else>Not specified</span>
                <ExclamationCircleIcon
                  v-if="item.is_driver_collect === undefined"
                  class="w-4 h-4 text-red-500 ml-1"
                />
              </div>

              <div class="flex">
                <span class="font-medium mr-1">Cost Price:</span>
                <span>{{ item.cost_price || "Not specified" }}</span>
                <ExclamationCircleIcon
                  v-if="!item.cost_price"
                  class="w-4 h-4 text-red-500 ml-1"
                />
              </div>

              <div class="flex">
                <span class="font-medium mr-1">Driver Name:</span>
                <span>{{
                  item.reservation_car_info?.driver_name || "Not specified"
                }}</span>
                <ExclamationCircleIcon
                  v-if="!item.reservation_car_info?.driver_name"
                  class="w-4 h-4 text-red-500 ml-1"
                />
              </div>
            </div>

            <!-- Display validation errors if any -->
            <div
              v-if="!validationStatus.items[index]"
              class="mt-2 text-xs text-red-500"
            >
              <div
                v-for="(error, errorIndex) in getItemValidationErrors(item)"
                :key="errorIndex"
              >
                <ExclamationCircleIcon class="w-4 h-4 inline mr-1" />
                {{ error }}
              </div>
            </div>
          </div>
        </div>

        <!-- Summary validation section -->
        <div class="border rounded-lg p-4 space-y-2" v-if="!showTextCopy">
          <h3 class="font-medium text-sm">Booking Validation Summary</h3>

          <div class="grid grid-cols-2 gap-y-2 text-sm">
            <div class="flex items-center">
              <div
                v-if="validationStatus.supplier"
                class="bg-green-500 w-3 h-3 mr-2 inline-block rounded-full"
              ></div>
              <div
                v-else
                class="bg-orange-400 w-3 h-3 mr-2 inline-block rounded-full"
              ></div>
              <span>Supplier Information</span>
            </div>

            <div class="flex items-center">
              <div
                v-if="validationStatus.driverCollect"
                class="bg-green-500 w-3 h-3 mr-2 inline-block rounded-full"
              ></div>
              <div
                v-else
                class="bg-orange-400 w-3 h-3 mr-2 inline-block rounded-full"
              ></div>
              <span>Driver Collect Status</span>
            </div>

            <div class="flex items-center">
              <div
                v-if="validationStatus.costPrice"
                class="bg-green-500 w-3 h-3 mr-2 inline-block rounded-full"
              ></div>
              <div
                v-else
                class="bg-orange-400 w-3 h-3 mr-2 inline-block rounded-full"
              ></div>
              <span>Cost Pricing</span>
            </div>

            <div class="flex items-center">
              <div
                v-if="validationStatus.driver"
                class="bg-green-500 w-3 h-3 mr-2 inline-block rounded-full"
              ></div>
              <div
                v-else
                class="bg-orange-400 w-3 h-3 mr-2 inline-block rounded-full"
              ></div>
              <span>Driver Information</span>
            </div>
          </div>
        </div>

        <!-- Preview text section (NEW) -->
        <div v-if="showTextCopy" class="border rounded-lg p-4 space-y-2">
          <div class="flex justify-between items-center">
            <h3 class="font-medium text-sm">Generated Text Preview</h3>
            <button
              @click="copyFormattedText"
              class="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
            >
              <span v-if="copyStatus === 'idle'">Copy Text</span>
              <span
                v-else-if="copyStatus === 'copied'"
                class="flex items-center"
              >
                <CheckCircleIcon class="w-4 h-4 mr-1" />
                Copied!
              </span>
              <span v-else class="flex items-center">
                <svg
                  class="animate-spin h-4 w-4 mr-1"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Copying...
              </span>
            </button>
          </div>

          <div
            class="bg-gray-50 p-3 rounded-md text-sm font-mono text-gray-700 whitespace-pre-wrap max-h-[450px] overflow-y-auto"
          >
            {{ formattedOutputText }}
          </div>
        </div>

        <!-- Progress & Action buttons -->
        <div class="pt-2" v-if="!showTextCopy">
          <div class="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              class="bg-green-500 h-2.5 rounded-full"
              :style="{ width: validationProgress + '%' }"
            ></div>
          </div>

          <div class="flex justify-between items-center gap-x-4">
            <button
              type="button"
              :disabled="!isValidationComplete"
              @click="archiveUpdate"
              class="w-full py-2 shadow text-white text-center text-sm rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              :class="
                isValidationComplete
                  ? 'bg-[#ff613c] hover:bg-[#e04e2e]'
                  : 'bg-gray-400'
              "
              :tabindex="isValidationComplete ? 0 : -1"
            >
              Pass Validation
            </button>
          </div>
        </div>
      </div>
    </DialogPanel>
  </Modal>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import {
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from "@heroicons/vue/24/outline";
import { useToast } from "vue-toastification";

const toast = useToast();

const props = defineProps({
  openModalArchive: Boolean,
  bookingItems: Array,
});

const emit = defineEmits(["closeModal", "archiveUpdate"]);

// Copy status tracking
const copyStatus = ref("idle"); // 'idle', 'copying', 'copied'

// Validation status tracking
const validationStatus = ref({
  basic: false,
  items: [],
  supplier: false,
  driverCollect: false,
  costPrice: false,
  driver: false,
  car: false,
});

// Function to get validation errors for an item
const getItemValidationErrors = (item) => {
  const errors = [];

  if (!item.reservation_car_info?.supplier_name) {
    errors.push("Supplier name is required");
  }

  if (item.is_driver_collect === undefined || item.is_driver_collect === null) {
    errors.push("Driver collect status is required");
  }

  if (!item.cost_price) {
    errors.push("Cost price is required");
  }

  if (!item.reservation_car_info?.driver_name) {
    errors.push("Driver name is required");
  }

  return errors;
};

// Validate a single booking item
const validateItem = (item, index) => {
  let isValid = true;

  // Check all required fields
  if (
    !item.reservation_car_info?.supplier_name ||
    item.is_driver_collect === null ||
    !item.cost_price ||
    !item.reservation_car_info?.driver_name
  ) {
    isValid = false;
  }

  // Update validation status for this item
  validationStatus.value.items[index] = isValid;
  return isValid;
};

// Run all validations with visual delays
const runValidation = () => {
  // Reset validation statuses
  validationStatus.value.basic = false;
  validationStatus.value.supplier = false;
  validationStatus.value.driverCollect = false;
  validationStatus.value.costPrice = false;
  validationStatus.value.driver = false;
  validationStatus.value.car = false;
  copyStatus.value = "idle";

  // Initialize items validation array
  if (props.bookingItems) {
    validationStatus.value.items = Array(props.bookingItems.length).fill(false);
  }

  // Simulate validation process with delays for visual effect
  setTimeout(() => {
    // Basic validation
    validationStatus.value.basic =
      props.bookingItems && props.bookingItems.length > 0;

    // Validate each item with sequential delays
    if (props.bookingItems) {
      props.bookingItems.forEach((item, index) => {
        setTimeout(() => {
          validateItem(item, index);
        }, 300 * (index + 1));
      });
    }

    // Validate categories with delays
    setTimeout(() => {
      let allSuppliers = true;
      if (props.bookingItems && props.bookingItems.length > 0) {
        props.bookingItems.forEach((item) => {
          if (!item.reservation_car_info?.supplier_name) allSuppliers = false;
        });
      } else {
        allSuppliers = false;
      }
      validationStatus.value.supplier = allSuppliers;
    }, 500);

    setTimeout(() => {
      let allDriverCollect = true;
      if (props.bookingItems && props.bookingItems.length > 0) {
        props.bookingItems.forEach((item) => {
          if (item.is_driver_collect === null) allDriverCollect = false;
        });
      } else {
        allDriverCollect = false;
      }
      validationStatus.value.driverCollect = allDriverCollect;
    }, 700);

    setTimeout(() => {
      let allCostPrice = true;
      if (props.bookingItems && props.bookingItems.length > 0) {
        props.bookingItems.forEach((item) => {
          if (!item.cost_price) allCostPrice = false;
        });
      } else {
        allCostPrice = false;
      }
      validationStatus.value.costPrice = allCostPrice;
    }, 900);

    setTimeout(() => {
      let allDrivers = true;
      if (props.bookingItems && props.bookingItems.length > 0) {
        props.bookingItems.forEach((item) => {
          if (!item.reservation_car_info?.driver_name) allDrivers = false;
        });
      } else {
        allDrivers = false;
      }
      validationStatus.value.driver = allDrivers;
    }, 1100);
  }, 200);
};

// Calculate validation progress
const validationProgress = computed(() => {
  if (!props.bookingItems || props.bookingItems.length === 0) {
    return 0;
  }

  const itemsValidated = validationStatus.value.items.filter(Boolean).length;
  const totalItems = validationStatus.value.items.length;

  const categoryChecks = [
    validationStatus.value.basic,
    validationStatus.value.supplier,
    validationStatus.value.driverCollect,
    validationStatus.value.costPrice,
    validationStatus.value.driver,
  ].filter(Boolean).length;

  const totalChecks = totalItems + 5; // 5 category checks (removed car check)
  const completedChecks = itemsValidated + categoryChecks;

  return Math.round((completedChecks / totalChecks) * 100);
});

const showTextCopy = ref(false);

// Check if all validations are complete
const isValidationComplete = computed(() => {
  if (!props.bookingItems || props.bookingItems.length === 0) {
    return false;
  }

  return (
    validationStatus.value.basic &&
    validationStatus.value.items.every(Boolean) &&
    validationStatus.value.supplier &&
    validationStatus.value.driverCollect &&
    validationStatus.value.costPrice &&
    validationStatus.value.driver
  );
});

// Formatted output text
const formattedOutputText = computed(() => {
  if (!props.bookingItems || props.bookingItems.length === 0) {
    return "";
  }

  let outputText = `
📆S. Date: ${props.bookingItems[0]?.service_date}
👨‍💼Supplier Name: ${props.bookingItems[0]?.reservation_car_info?.supplier_name}
🚙Total Trip: ${props.bookingItems.length}
    `;

  // Calculate total balance
  let totalBalance = 0;

  props.bookingItems.forEach((trip, index) => {
    // Calculate individual trip balance
    const tripBalance =
      trip.is_driver_collect == 1
        ? trip.amount - trip.cost_price
        : -trip.cost_price;

    // Add to total balance
    totalBalance += tripBalance;

    outputText += `
${index + 1}️⃣ CRMID: ${trip.crm_id}
➖Trip Name: ${trip.product?.name}
➖Variation: ${trip.car?.name}
➖Collect: ${trip.is_driver_collect == 1 ? "Collect" : "No Collect"}
➖Amount: ${trip.amount}thb
➖Cost: ${trip.cost_price}thb
⭕${
      trip.is_driver_collect == 1
        ? trip.amount + "-" + trip.cost_price + "=" + tripBalance
        : tripBalance
    }
`;
  });

  // Format total balance with + or - sign for clarity
  const formattedTotalBalance =
    totalBalance > 0 ? `+${totalBalance}` : `${totalBalance}`;

  outputText += `
~~~~~~~~~~~
Total: ${formattedTotalBalance} thb
Previous: ( ______ )
Balance: ( ______ )
  `;

  return outputText;
});

// Copy the formatted text to clipboard
const copyFormattedText = async () => {
  copyStatus.value = "copying";

  try {
    await navigator.clipboard.writeText(formattedOutputText.value);
    copyStatus.value = "copied";
    toast.success("Text copied to clipboard");

    // Reset status after a delay
    setTimeout(() => {
      copyStatus.value = "idle";
    }, 2000);
  } catch (err) {
    toast.error("Failed to copy text");
    copyStatus.value = "idle";
  }
};

// Handle actions
const closeArchiveModal = () => {
  showTextCopy.value = false;
  emit("closeModal");
};

const archiveUpdate = () => {
  // First copy the text to clipboard
  // navigator.clipboard
  //   .writeText(formattedOutputText.value)
  //   .then(() => {
  //     toast.success("Success copy reservation");
  //     emit("archiveUpdate");
  //   })
  //   .catch(() => {
  //     toast.error("Error copy reservation");
  //   });

  showTextCopy.value = true;
};

// Start validation process when modal opens
watch(
  () => props.openModalArchive,
  (isOpen) => {
    if (isOpen) {
      runValidation();
    }
  }
);

// Watch for booking items changes
watch(
  () => props.bookingItems,
  () => {
    if (props.openModalArchive) {
      runValidation();
    }
  },
  { deep: true }
);

// Initialize on component mount
onMounted(() => {
  if (props.bookingItems) {
    validationStatus.value.items = Array(props.bookingItems.length).fill(false);
  }
});
</script>
