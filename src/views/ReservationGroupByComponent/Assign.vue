<template>
  <div class="grid grid-cols-3 gap-x-4">
    <div
      class="rounded-lg py-3 relative border space-y-3 border-gray-200 h-auto"
    >
      <p class="text-lg font-medium text-[#FF613c] px-4">Reservation Items</p>

      <div class="h-[54vh] w-full overflow-y-auto space-y-1" v-if="!loading">
        <!-- Loop through the grouped items by CRM ID -->
        <div
          v-for="(items, crm_id) in groupedItems"
          :key="crm_id"
          class="px-4 py-2 bg-white rounded-lg shadow-sm"
        >
          <!-- CRM ID header -->
          <!-- <div class="text-xs font-medium text-gray-500 mb-2">
            For CRM ID: {{ crm_id }}
          </div> -->

          <!-- List of items with the same CRM ID -->
          <div
            v-for="(item, index) in items"
            :key="index"
            class="flex justify-start items-center w-full space-x-4 px-2 cursor-pointer py-2"
            @click="selectItem(item)"
            :class="{
              'bg-[#FF613c]/20 text-white rounded-lg': item.id === formData.id,
            }"
          >
            <div class="rounded-lg p-2 inline-block bg-[#FF613c] text-white">
              <TruckIcon class="w-4 h-4" />
            </div>
            <div class="text-[12px] w-[100%] space-y-1 font-medium">
              <div
                v-if="item.service_date"
                class="text-[8px] flex justify-between items-center"
                :class="
                  item.id == formData.id ? 'text-black' : ' text-gray-400'
                "
              >
                <p>{{ item.service_date }}</p>
                <p>{{ item.crm_id.split("_")[1] }}</p>
              </div>
              <p class="text-black text-[10px] font-medium">
                {{ item.product?.product_type }}
                {{ item.product?.name }}
              </p>

              <div class="flex justify-start items-center">
                <p
                  :class="
                    item.reservation_car_info?.driver_id
                      ? ' text-green-600 '
                      : ' text-red-500 '
                  "
                  class="rounded-lg flex justify-start items-center text-[10px]"
                >
                  <CurrencyDollarIcon class="w-3 h-3 mr-1" />
                  {{
                    item.reservation_car_info?.driver_id ? "assign" : "unassign"
                  }}
                </p>
                <p class="pl-2" v-if="item.reservation_car_info?.driver_id">
                  <span
                    class="w-1 h-1 rounded-full bg-[#FF613c] mb-0.5 inline-block"
                  ></span>
                  <span class="pl-2 text-[#FF613c] font-medium">
                    {{ item.cost_price }} thb
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="loading"
        class="h-[54vh] flex justify-center items-center text-xs"
      >
        <p>loading</p>
        <img
          src="https://endlessicons.com/wp-content/uploads/2012/11/loading-icon-614x460.png"
          class="animate-spin w-10 h-10"
          alt=""
        />
      </div>
      <!-- <div class="w-full pt-4 px-4">
        <div
          @click="resetForm()"
          class="bg-[#FF613c] cursor-pointer text-white rounded-xl text-center text-xs py-3"
        >
          Reset
        </div>
      </div> -->
    </div>
    <div class="col-span-2 py-3 rounded-lg relative border border-gray-200">
      <div class="flex justify-between items-center">
        <p class="text-lg font-medium text-[#FF613c] px-4 pb-4">
          Car Booking Details
        </p>
        <div class="flex justify-end items-center space-x-2 px-4">
          <p class="text-xs text-white bg-[#FF613c] px-4 py-1 rounded-lg">
            {{ formData?.service_date }}
          </p>
          <p class="text-xs text-white bg-[#FF613c] px-4 py-1 rounded-lg">
            {{ formData?.crm_id?.split("_")[1] }}
          </p>
        </div>
      </div>
      <div
        class="grid grid-cols-2 overflow-y-auto px-4 gap-4"
        v-if="formData.id"
      >
        <div class="grid grid-cols-2 col-span-2 gap-4 mb-4">
          <div class="space-y-1">
            <label :for="`supplier`" class="text-xs pb-1.5 font-medium">
              Supplier <span class="text-red-600">*</span>
            </label>
            <select
              v-model="formData.supplier_id"
              :id="`supplier`"
              class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full"
              @change="() => onSupplierChange(formData.supplier_id)"
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
          <div class="space-y-1">
            <label :for="`cost_price`" class="text-xs pb-1.5 font-medium"
              >Cost Price</label
            >
            <input
              type="text"
              v-model="formData.cost_price"
              :id="`cost_price`"
              placeholder="Cost Price"
              class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full"
            />
          </div>

          <div class="space-y-1">
            <label :for="`driver`" class="text-xs pb-1.5 font-medium">
              Driver <span class="text-red-600">*</span>
            </label>
            <select
              v-model="formData.driver_id"
              :id="`driver`"
              class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full"
              @change="() => onDriverChange(formData.driver_id)"
            >
              <option value="">Select Driver</option>
              <option
                v-for="driver in drivers?.data || []"
                :key="driver.id"
                :value="driver.id"
              >
                {{ driver.name }}
              </option>
            </select>
          </div>
          <div class="space-y-1">
            <label :for="`driver_contact`" class="text-xs pb-1.5 font-medium"
              >Driver Contact</label
            >
            <input
              type="text"
              v-model="formData.driver_contact"
              :id="`driver_contact`"
              placeholder="Driver contact"
              class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full"
            />
          </div>

          <div class="space-y-1">
            <label :for="`car_number`" class="text-xs pb-1.5 font-medium"
              >Car Number</label
            >
            <select
              v-model="formData.car_number"
              :id="`car_number`"
              class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full"
            >
              <option value="">Select Car Number</option>
              <option
                v-for="car in carNumbers || []"
                :key="car.id"
                :value="car.id"
              >
                {{ car.car_number }}
              </option>
            </select>
          </div>
          <div class="col-span-2 space-y-4 pb-10">
            <label :for="`pickup_location`" class="text-xs pb-4 font-medium"
              >car photo</label
            >
            <img
              :src="formData.car_photo"
              class="object-contain object-left w-full h-[300px]"
              alt=""
            />
          </div>
        </div>
      </div>

      <div
        class="flex justify-center items-center h-[54vh] overflow-y-auto px-4 gap-4"
        v-if="!formData.id"
      >
        <p class="text-sm text-gray-500">Need to select one item</p>
      </div>

      <div
        v-if="formData.id"
        class="flex justify-end text-[#FF613c] absolute bottom-2 items-center w-full border-t pt-3 space-x-3 px-7"
      >
        <div class="flex justify-end items-center space-x-2">
          <button
            @click="saveCarBooking"
            class="px-3 py-1 bg-green-500 text-white text-[12px] cursor-pointer rounded-lg"
          >
            <!-- {{ formData.id ? "Update" : "=" }} -->
            Save: {{ formData?.crm_id?.split("_")[1] }}
          </button>

          <button
            @click="resetForm"
            class="px-3 py-1 bg-white border border-gray-300 text-[12px] cursor-pointer rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
    <Modal :isOpen="showErrorPopup" @closeModal="showErrorPopup = false">
      <DialogPanel
        class="w-full max-w-md transform overflow-hidden rounded-lg mt-10 bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-start pb-20 pt-4 px-4"
        >
          <p></p>
        </DialogTitle>
        <!-- show date  -->
        <div class="relative">
          <div class="absolute -top-8 left-[45%]">
            <img
              :src="logo"
              class="w-16 h-16 bg-white rounded-full p-3"
              alt=""
            />
          </div>
          <div class="py-10 text-center space-y-4">
            <p class="font-medium text-base text-[#FF613c]">
              Collect Amount ကို ဖော်ပြပေးပါရန် !
            </p>
          </div>
          <div>
            <div class="flex justify-center items-center space-x-2 pb-5">
              <button
                @click="showErrorPopup = false"
                class="px-5 py-1 bg-[#FF613c] text-white text-[12px] cursor-pointer rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Modal>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted, computed } from "vue";
import { useCarBookingStore } from "../../stores/carbooking";
import { useSupplierStore } from "../../stores/supplier";
import { useDriverStore } from "../../stores/driver";
import { useAuthStore } from "../../stores/auth";
import { useToast } from "vue-toastification";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { TruckIcon } from "@heroicons/vue/24/outline";
import { DialogPanel, DialogTitle } from "@headlessui/vue";
import Modal from "../../components/Modal.vue";
import logo from "../../assets/web-logo.png";
import { CurrencyDollarIcon } from "@heroicons/vue/24/solid";

const route = useRoute();

// Define your car icon component

const props = defineProps({
  detail: Object,
  getDetailAction: Function,
});

// Initialize stores
const carBookingStore = useCarBookingStore();
const supplierStore = useSupplierStore();
const driverStore = useDriverStore();
const authStore = useAuthStore();
const toast = useToast();

// Get reactive state from stores
const { suppliers } = storeToRefs(supplierStore);
const { drivers } = storeToRefs(driverStore);
const { user } = storeToRefs(authStore);

// Local state
const carNumbers = ref([]);
const loading = ref(false);
const allItems = ref([]);

// Form data for the selected car booking
const formData = ref({
  id: "",
  supplier_id: "",
  driver_id: "",
  quantity: 1,
  car_number: "",
  cost_price: "",
  extra_collect_amount: 0,
  is_driver_collect: 0,
  route_plan: "",
  special_request: "",
  driver_contact: "",
  car_photo: "",
  pickup_location: "",
  dropoff_location: "",
  pickup_time: "",
  service_date: "",
  crm_id: "",
});

// Group items by CRM ID
const groupedItems = computed(() => {
  const grouped = {};

  if (allItems.value && allItems.value.length > 0) {
    allItems.value.forEach((item) => {
      if (!grouped[item.crm_id]) {
        grouped[item.crm_id] = [];
      }
      grouped[item.crm_id].push(item);
    });
  }

  return grouped;
});

// Actions
const onSupplierChange = async () => {
  if (formData.value.supplier_id) {
    try {
      const res = await driverStore.getSimpleListAction({
        supplier_id: formData.value.supplier_id,
      });
    } catch (error) {
      console.error("Error fetching drivers:", error);
      toast.error("Failed to load drivers");
    }
  }
};

const onDriverChange = async (id) => {
  if (formData.value.driver_id) {
    try {
      const res = await driverStore.getDetailAction(formData.value.driver_id);
      if (res && res.result) {
        const data = res.result;
        formData.value.driver_contact = data.contact || "";
        formData.value.car_photo = data.car_photo || "";
        carNumbers.value = data.infos || [];

        // Set default car number if available
        if (data.infos && data.infos.length > 0) {
          data.infos.forEach((car) => {
            if (car.is_default === 1) {
              formData.value.car_number = car.id;
            }
          });
        }
      }
    } catch (error) {
      console.error("Error fetching driver details:", error);
      toast.error("Failed to load driver details");
    }
  }
};

const selectItem = async (item) => {
  resetForm();

  try {
    loading.value = true;
    const res = await carBookingStore.getDetailAction(item.id);

    if (res && res.result) {
      const data = res.result;

      formData.value = {
        id: data.id,
        supplier_id: data.supplier_id || "",
        driver_id: data.driver_id || "",
        quantity: data.quantity || 1,
        car_number: data.driver_info_id || "",
        cost_price: data.cost_price || "",
        extra_collect_amount: data.extra_collect || 0,
        is_driver_collect: data.is_driver_collect,
        route_plan: data.route_plan === "null" ? "" : data.route_plan,
        special_request: data.special_request || "",
        driver_contact: data.driver_contact || "",
        car_photo: data.car_photo || "",
        pickup_location: data.pickup_location || "",
        dropoff_location: data.dropoff_location || "",
        pickup_time: data.pickup_time || "",
        service_date: item.service_date || "",
        crm_id: item.crm_id || "",
      };

      // Load related data
      if (formData.value.supplier_id) {
        await onSupplierChange();
      }

      if (formData.value.driver_id) {
        await onDriverChange();
      }

      console.log("Selected item:", formData.value);
    }
  } catch (error) {
    console.error("Error fetching item details:", error);
    toast.error("Failed to load item details");
  } finally {
    loading.value = false;
  }
};

const showErrorPopup = ref(false);

const saveCarBooking = async () => {
  try {
    loading.value = true;

    const frmData = new FormData();
    frmData.append("supplier_id", formData.value.supplier_id || "");
    frmData.append("driver_id", formData.value.driver_id || "");
    frmData.append("driver_contact", formData.value.driver_contact || "");
    frmData.append("driver_info_id", formData.value.car_number || "");
    frmData.append("pickup_location", formData.value.pickup_location || "");
    frmData.append("dropoff_location", formData.value.dropoff_location || "");
    frmData.append("pickup_time", formData.value.pickup_time || "");

    if (formData.value.cost_price) {
      frmData.append("cost_price", formData.value.cost_price);

      // Calculate total cost price
      const totalCostPrice =
        formData.value.cost_price * formData.value.quantity;
      if (totalCostPrice) {
        frmData.append("total_cost_price", totalCostPrice);
      }
    }

    frmData.append(
      "is_driver_collect",
      formData.value.is_driver_collect == 1 ? "1" : "0"
    );
    if (formData.value.is_driver_collect == 1) {
      frmData.append(
        "extra_collect_amount",
        formData.value.extra_collect_amount || ""
      );
    }

    frmData.append("route_plan", formData.value.route_plan || "");
    frmData.append("special_request", formData.value.special_request || "");

    const res = await carBookingStore.addNewAction(frmData, formData.value.id);

    if (res && res.status === "Request was successful.") {
      toast.success(res.message || "Car booking saved successfully");
      resetForm();

      // Refresh data
      if (props.getDetailAction) {
        await props.getDetailAction(route.query.id);
      }
    }
  } catch (error) {
    console.error("Error saving car booking:", error);
    toast.error(error.message || "Failed to save car booking");
  } finally {
    loading.value = false;
  }
};

const deleteCarBooking = async () => {
  if (!formData.value.id) return;

  try {
    loading.value = true;
    const res = await carBookingStore.deleteAction(formData.value.id);

    if (res && res.status === "Request was successful.") {
      toast.success("Car booking deleted successfully");
      resetForm();

      // Refresh data
      if (props.getDetailAction) {
        await props.getDetailAction(route.query.id);
      }
    }
  } catch (error) {
    console.error("Error deleting car booking:", error);
    toast.error("Failed to delete car booking");
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  formData.value = {
    id: "",
    supplier_id: "",
    driver_id: "",
    quantity: 1,
    car_number: "",
    cost_price: "",
    extra_collect_amount: "",
    is_driver_collect: 0,
    route_plan: "",
    special_request: "",
    driver_contact: "",
    car_photo: "",
    pickup_location: "",
    dropoff_location: "",
    pickup_time: "",
    service_date: "",
    crm_id: "",
  };
  carNumbers.value = [];
};

onMounted(async () => {
  try {
    loading.value = true;

    // Load initial data
    await supplierStore.getSimpleListAction();
    await driverStore.getSimpleListAction();

    // Extract booking items from props
    if (props.detail && props.detail.booking && props.detail.booking.items) {
      // Filter items for PrivateVanTour type
      allItems.value = props.detail.booking.items.filter(
        (item) => item.product_type === "App\\Models\\PrivateVanTour"
      );
    }

    selectItem(allItems.value[0]);
  } catch (error) {
    console.error("Error loading initial data:", error);
    toast.error("Failed to load initial data");
  } finally {
    loading.value = false;
  }
});
</script>
