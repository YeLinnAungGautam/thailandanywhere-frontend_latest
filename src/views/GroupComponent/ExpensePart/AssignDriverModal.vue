<template>
  <Modal :isOpen="isOpen" @closeModal="$emit('close')" :marginTop="5">
    <DialogPanel
      class="w-full max-w-6xl transform rounded-xl bg-white text-left align-middle shadow-xl transition-all max-h-[95vh] overflow-hidden flex flex-col"
    >
      <!-- Header -->
      <DialogTitle
        as="div"
        class="text-lg font-semibold text-gray-900 p-6 pb-4 flex justify-between items-center border-b"
      >
        <div class="flex items-center gap-2">
          <svg
            class="w-6 h-6 text-[#FF613c]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          {{ driverData ? "Edit Driver Assignment" : "Assign Driver" }}
          <span class="text-xs font-normal text-gray-500 ml-2">
            ({{ itemData?.car?.name || "Car Booking" }})
          </span>
        </div>
        <button
          @click="$emit('close')"
          class="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <XMarkIcon class="w-5 h-5 text-gray-500" />
        </button>
      </DialogTitle>

      <!-- Content -->
      <div class="flex-1 overflow-hidden flex">
        <!-- Left Sidebar - Steps -->
        <div
          class="w-72 bg-gradient-to-br from-purple-50 to-indigo-50 border-r p-6 overflow-y-auto"
        >
          <div class="space-y-1 relative">
            <!-- Vertical Line -->
            <div
              class="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-purple-600 via-purple-300 to-gray-200"
            ></div>

            <!-- Step 1: Supplier -->
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
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50 ring-4 ring-purple-600/20'
                      : currentStep > 1
                      ? 'bg-purple-600 text-white'
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
                  class="absolute inset-0 rounded-full bg-purple-600 animate-ping opacity-20"
                ></div>
              </div>

              <div class="flex-1 min-w-0 pt-0.5">
                <h3
                  :class="[
                    'text-sm font-bold mb-0.5 transition-colors',
                    currentStep === 1
                      ? 'text-purple-600'
                      : currentStep > 1
                      ? 'text-gray-800'
                      : 'text-gray-400',
                  ]"
                >
                  Supplier Selection
                </h3>
                <p class="text-[10px] text-gray-500 mt-0.5">
                  Choose supplier & cost
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

            <!-- Step 2: Driver -->
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
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50 ring-4 ring-purple-600/20'
                      : currentStep > 2
                      ? 'bg-purple-600 text-white'
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
                  class="absolute inset-0 rounded-full bg-purple-600 animate-ping opacity-20"
                ></div>
              </div>

              <div class="flex-1 min-w-0 pt-0.5">
                <h3
                  :class="[
                    'text-sm font-bold mb-0.5 transition-colors',
                    currentStep === 2
                      ? 'text-purple-600'
                      : currentStep > 2
                      ? 'text-gray-800'
                      : 'text-gray-400',
                  ]"
                >
                  Driver Details
                </h3>
                <p class="text-[10px] text-gray-500 mt-0.5">
                  Select driver & vehicle
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
          <div class="mt-8 pt-6 border-t border-purple-200">
            <div
              class="flex items-center justify-between text-xs font-medium text-gray-700 mb-3"
            >
              <span>Assignment Progress</span>
              <span class="text-purple-600 font-bold"
                >{{ completionPercentage }}%</span
              >
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                class="bg-gradient-to-r from-purple-600 to-indigo-400 h-2.5 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
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
          <!-- Step 1: Supplier -->
          <div v-show="currentStep === 1" class="space-y-4">
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">
                Supplier & Cost Information
              </h3>
              <p class="text-[10px] text-gray-500">
                Select supplier and set cost price for this booking
              </p>
            </div>

            <!-- Car Info Display -->
            <div
              class="bg-gradient-to-r from-purple-50 to-indigo-100 rounded-xl p-4 mb-4 border border-purple-200"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm"
                >
                  <TruckIcon class="w-6 h-6 text-purple-600" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-900">
                    {{ itemData?.car?.name || "Vehicle" }}
                  </p>
                  <p class="text-xs text-gray-600">
                    {{ formatDate(itemData?.service_date) }}
                  </p>
                </div>
                <div class="px-3 py-1 bg-white rounded-full">
                  <p class="text-xs font-medium text-purple-600">
                    {{ itemData?.crm_id }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Supplier Selection -->
            <div>
              <label
                class="text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1"
              >
                <svg
                  class="w-4 h-4 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Supplier *
              </label>
              <select
                v-model="formData.supplier_id"
                @change="onSupplierChange"
                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
              >
                <option value="">Select Supplier</option>
                <option
                  v-for="supplier in suppliers?.data"
                  :key="supplier.id"
                  :value="supplier.id"
                >
                  {{ supplier.name }}
                </option>
              </select>
            </div>

            <!-- Cost Price -->
            <div>
              <label
                class="text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1"
              >
                <svg
                  class="w-4 h-4 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Cost Price
              </label>
              <div class="relative">
                <input
                  type="number"
                  v-model="formData.cost_price"
                  placeholder="0.00"
                  class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
                />
                <span
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500"
                  >THB</span
                >
              </div>
            </div>
          </div>

          <!-- Step 2: Driver -->
          <div v-show="currentStep === 2" class="space-y-4">
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">
                Driver & Vehicle Information
              </h3>
              <p class="text-[10px] text-gray-500">
                Assign driver and select vehicle details
              </p>
            </div>

            <!-- Driver Selection -->
            <div>
              <label
                class="text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1"
              >
                <svg
                  class="w-4 h-4 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Driver *
              </label>
              <SearchDriver
                v-model="formData.driver_id"
                :drivers="drivers"
                @change="onDriverChange"
              />
            </div>

            <!-- Driver Contact (Auto-filled) -->
            <div>
              <label
                class="text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1"
              >
                <svg
                  class="w-4 h-4 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Driver Contact
              </label>
              <input
                type="text"
                v-model="formData.driver_contact"
                placeholder="Driver contact number"
                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 bg-gray-50"
                readonly
              />
            </div>

            <!-- Car Number Selection -->
            <div>
              <label
                class="text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1"
              >
                <TruckIcon class="w-4 h-4 text-purple-600" />
                Car Number
              </label>
              <select
                v-model="formData.car_number"
                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
                :disabled="!carNumbers.length"
              >
                <option value="">Select Car Number</option>
                <option v-for="car in carNumbers" :key="car.id" :value="car.id">
                  {{ car.car_number }}
                </option>
              </select>
              <p
                v-if="!formData.driver_id"
                class="text-[10px] text-gray-500 mt-1"
              >
                Please select a driver first
              </p>
            </div>

            <!-- Car Photo Preview -->
            <div v-if="formData.car_photo">
              <label class="text-xs font-medium text-gray-700 mb-1.5 block">
                Vehicle Photo
              </label>
              <div
                class="w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
              >
                <img
                  :src="formData.car_photo"
                  alt="Car photo"
                  class="w-full h-full object-contain"
                />
              </div>
            </div>

            <!-- Driver Summary Card -->
            <div
              v-if="formData.driver_id"
              class="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200"
            >
              <h4
                class="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2"
              >
                <svg
                  class="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Assignment Summary
              </h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Supplier:</span>
                  <span class="font-medium text-gray-900">{{
                    getSupplierName(formData.supplier_id)
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Cost Price:</span>
                  <span class="font-medium text-green-600"
                    >{{ formData.cost_price || 0 }} THB</span
                  >
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Driver Contact:</span>
                  <span class="font-medium text-gray-900">{{
                    formData.driver_contact || "-"
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Car Number:</span>
                  <span class="font-medium text-gray-900">{{
                    getCarNumber(formData.car_number)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="border-t p-6 pt-4 flex items-center justify-end gap-3 bg-gray-50"
      >
        <button
          @click="$emit('close')"
          :disabled="saving"
          class="px-4 py-2.5 bg-white border border-gray-300 text-sm rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>

        <button
          v-if="currentStep > 1"
          @click="currentStep--"
          :disabled="loading || saving"
          class="px-4 py-2.5 bg-gray-200 text-black text-sm rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <ChevronLeftIcon class="w-4 h-4" />
          Previous
        </button>

        <button
          v-if="currentStep < 2"
          @click="currentStep++"
          :disabled="loading || saving || !isStep1Complete"
          class="px-4 py-2.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Next
          <ChevronRightIcon class="w-4 h-4" />
        </button>

        <button
          v-if="currentStep === 2"
          @click="saveDriver"
          :disabled="saving || !isStep2Complete"
          class="px-4 py-2.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg
            v-if="saving"
            class="animate-spin h-4 w-4 text-white"
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
          {{
            saving
              ? "Assigning..."
              : driverData
              ? "Update Assignment"
              : "Assign Driver"
          }}
        </button>
      </div>
    </DialogPanel>
  </Modal>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import {
  TruckIcon,
  XMarkIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/vue/24/outline";
import { useToast } from "vue-toastification";
import { useCarBookingStore } from "../../../stores/carbooking";
import { useSupplierStore } from "../../../stores/supplier";
import { useDriverStore } from "../../../stores/driver";
import { storeToRefs } from "pinia";
import Modal from "../../../components/Modal.vue";
import SearchDriver from "../../ReservationGroupByComponent/SearchDriver.vue";

const props = defineProps({
  isOpen: Boolean,
  driverData: Object,
  itemData: Object,
  groupId: [String, Number],
});

const emit = defineEmits(["close", "refresh"]);

const toast = useToast();
const carBookingStore = useCarBookingStore();
const supplierStore = useSupplierStore();
const driverStore = useDriverStore();

const { suppliers } = storeToRefs(supplierStore);
const { drivers } = storeToRefs(driverStore);

const loading = ref(false);
const saving = ref(false);
const currentStep = ref(1);
const carNumbers = ref([]);

const formData = ref({
  supplier_id: "",
  driver_id: "",
  driver_contact: "",
  car_number: "",
  cost_price: "",
  car_photo: "",
});

// Computed Properties
const isStep1Complete = computed(() => {
  return formData.value.supplier_id && formData.value.cost_price;
});

const isStep2Complete = computed(() => {
  return formData.value.driver_id;
});

const completionPercentage = computed(() => {
  let completed = 0;
  if (isStep1Complete.value) completed++;
  if (isStep2Complete.value) completed++;
  return (completed / 2) * 100;
});

// Helper Functions
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
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
  return `${String(date.getDate()).padStart(2, "0")} ${
    monthNames[date.getMonth()]
  } ${date.getFullYear()}`;
};

const getSupplierName = (supplierId) => {
  const supplier = suppliers.value?.data?.find((s) => s.id === supplierId);
  return supplier?.name || "-";
};

const getCarNumber = (carId) => {
  const car = carNumbers.value.find((c) => c.id === carId);
  return car?.car_number || "-";
};

const onSupplierChange = async () => {
  if (formData.value.supplier_id) {
    try {
      await driverStore.getSimpleListAction({
        supplier_id: formData.value.supplier_id,
      });
    } catch (error) {
      console.error("Error fetching drivers:", error);
      toast.error("Failed to load drivers");
    }
  }
};

const onDriverChange = async (driverId) => {
  if (!driverId) return;

  try {
    const response = await driverStore.getDetailAction(driverId);
    if (response?.result) {
      const data = response.result;
      formData.value.driver_contact = data.contact || "";
      formData.value.car_photo = data.car_photo || "";
      carNumbers.value = data.infos || [];

      // Set default car number if available
      if (data.infos && data.infos.length > 0) {
        const defaultCar = data.infos.find((car) => car.is_default === 1);
        if (defaultCar) {
          formData.value.car_number = defaultCar.id;
        }
      }
    }
  } catch (error) {
    console.error("Error fetching driver details:", error);
    toast.error("Failed to load driver details");
  }
};

const loadDriverData = async () => {
  if (!props.itemData?.id) {
    resetForm();
    return;
  }

  loading.value = true;
  try {
    const response = await carBookingStore.getDetailAction(props.itemData.id);
    if (response?.result) {
      const data = response.result;
      formData.value = {
        supplier_id: data.supplier_id || "",
        driver_id: data.driver_id || "",
        driver_contact: data.driver_contact || "",
        car_number: data.driver_info_id || "",
        cost_price: data.cost_price || "",
        car_photo: data.car_photo || "",
      };

      // Load related data
      if (formData.value.supplier_id) {
        await onSupplierChange();
      }

      if (formData.value.driver_id) {
        await onDriverChange(formData.value.driver_id);
      }
    }
  } catch (error) {
    console.error("Error loading driver assignment:", error);
    toast.error("Failed to load driver details");
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  formData.value = {
    supplier_id: "",
    driver_id: "",
    driver_contact: "",
    car_number: "",
    cost_price: "",
    car_photo: "",
  };
  carNumbers.value = [];
  currentStep.value = 1;
};

const saveDriver = async () => {
  try {
    saving.value = true;

    const frmData = new FormData();
    frmData.append("supplier_id", formData.value.supplier_id || "");
    frmData.append("driver_id", formData.value.driver_id || "");
    frmData.append("driver_contact", formData.value.driver_contact || "");
    frmData.append("driver_info_id", formData.value.car_number || "");
    frmData.append("cost_price", formData.value.cost_price || "");

    // Calculate total cost price
    if (formData.value.cost_price && props.itemData?.quantity) {
      const totalCostPrice =
        formData.value.cost_price * props.itemData.quantity;
      frmData.append("total_cost_price", totalCostPrice);
    }

    const itemId = props.itemData?.id;
    const response = await carBookingStore.addNewAction(frmData, itemId);

    if (response?.status === 1) {
      toast.success(
        props.driverData
          ? "Driver assignment updated successfully"
          : "Driver assigned successfully"
      );
      emit("close");
      emit("refresh");
      resetForm();
    } else {
      toast.error("Failed to assign driver");
    }
  } catch (error) {
    console.error("Error assigning driver:", error);
    toast.error("Failed to assign driver");
  } finally {
    saving.value = false;
  }
};

// Initialize data
onMounted(async () => {
  try {
    await supplierStore.getSimpleListAction();
    await driverStore.getSimpleListAction();
  } catch (error) {
    console.error("Error loading initial data:", error);
  }
});

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      loadDriverData();
    } else {
      resetForm();
    }
  }
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
