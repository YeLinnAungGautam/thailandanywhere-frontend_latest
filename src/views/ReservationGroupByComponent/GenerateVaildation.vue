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
        <div class="max-h-96 overflow-y-auto border rounded-lg p-4">
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
        <div class="border rounded-lg p-4 space-y-2">
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

        <!-- Progress & Action buttons -->
        <div class="pt-2">
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

// Handle actions
const closeArchiveModal = () => {
  emit("closeModal");
};

const archiveUpdate = () => {
  // console.log("Archive update triggered");
  if (props.bookingItems != null) {
    let formattedOutput;

    formattedOutput = `
  📆S. Date: ${props.bookingItems[0]?.service_date}
  👨‍💼Supplier Name: ${props.bookingItems[0]?.reservation_car_info?.supplier_name}
  🚙Total Trip: ${props.bookingItems.length}
      `;

    props.bookingItems.forEach((trip, index) => {
      formattedOutput += `
  ${index + 1}️⃣ CRMID: ${trip.crm_id}
  ➖Trip Name: ${trip.product?.name}
  ➖Variation: ${trip.car?.name}
  ➖P. Method: ${trip.is_driver_collect == 1 ? "Collect" : trip.payment_status}
  ➖Amount: ${trip.amount}thb
  `;
    });

    setTimeout(() => {
      navigator.clipboard.writeText(formattedOutput);
      toast.success("success copy reservation");
    }, 0);
  } else {
    toast.error("error copy reservation");
  }
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
