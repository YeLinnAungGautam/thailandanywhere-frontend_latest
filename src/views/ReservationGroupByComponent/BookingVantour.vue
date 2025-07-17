<template>
  <div class="grid grid-cols-3 gap-x-4">
    <div
      class="rounded-lg py-3 relative border space-y-3 border-gray-200 h-auto"
    >
      <div class="flex justify-between items-center">
        <p class="text-lg font-medium text-[#FF613c] px-4">Items</p>
        <p
          @click="prepareCopySelection"
          class="text-[10px] text-white bg-[#FF613c] px-4 py-1 mr-4 rounded-lg"
        >
          Copy Booking
        </p>
      </div>

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
            @click="selectItem(item, index)"
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
                <p>
                  {{ item.service_date }}
                  <span
                    class="w-1 h-1 bg-[#FF613c] inline-block mx-1 rounded-full"
                  ></span>
                  {{ item.car?.name }}
                </p>
                <p>{{ item.crm_id.split("_")[1] }}</p>
              </div>
              <p class="text-black text-[10px] font-medium">
                {{ item.product?.product_type }}
                {{ item.product?.name }}
              </p>

              <div class="flex justify-start items-center">
                <p
                  :class="
                    item.is_driver_collect
                      ? ' text-green-600 '
                      : ' text-red-500 '
                  "
                  class="rounded-lg flex justify-start items-center text-[10px]"
                >
                  <CurrencyDollarIcon class="w-3 h-3 mr-1" />{{
                    item.is_driver_collect == null
                      ? "Empty"
                      : item.is_driver_collect == 1
                      ? "Collect"
                      : "No Collect"
                  }}
                </p>
                <p class="pl-2" v-if="item.is_driver_collect">
                  <span
                    class="w-1 h-1 rounded-full bg-[#FF613c] mb-0.5 inline-block"
                  ></span>
                  <span class="pl-2 text-[#FF613c] font-medium">
                    {{ item.extra_collect_amount }} thb
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
    </div>
    <div class="col-span-2 py-3 rounded-lg relative border border-gray-200">
      <div class="flex justify-between items-center pb-4">
        <p class="text-lg font-medium text-[#FF613c] px-4">
          Car Booking Details
        </p>
        <p class="text-white bg-[#FF613c] px-4 py-1 text-xs mr-4 rounded-lg">
          {{ formData?.car_type }}
        </p>
      </div>
      <div
        class="grid grid-cols-2 h-[46vh] overflow-y-auto px-4 gap-2"
        v-if="formData.id"
      >
        <div class="space-y-1">
          <label for="pickup_time" class="text-xs pb-1.5 font-medium"
            >Pickup Time</label
          >
          <input
            type="time"
            v-model="formData.pickup_time"
            id="pickup_time"
            class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full"
          />
        </div>
        <div class="space-y-1">
          <label for="special_request" class="text-xs pb-1.5 font-medium"
            >Special Request</label
          >
          <textarea
            v-model="formData.special_request"
            id="special_request"
            placeholder="Special request details"
            class="border text-xs border-gray-200 h-[45px] px-4 py-3 rounded-lg w-full"
          ></textarea>
        </div>

        <div class="space-y-1">
          <label for="pickup_location" class="text-xs pb-1.5 font-medium"
            >Pickup Location</label
          >
          <textarea
            v-model="formData.pickup_location"
            id="pickup_location"
            placeholder="Pickup location details"
            class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full"
          ></textarea>
        </div>

        <div class="space-y-1">
          <label for="dropoff_location" class="text-xs pb-1.5 font-medium"
            >Dropoff Location</label
          >
          <textarea
            v-model="formData.dropoff_location"
            id="dropoff_location"
            placeholder="Dropoff location details"
            class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full"
          ></textarea>
        </div>
        <div class="space-y-1">
          <label for="pickup_time" class="text-xs pb-1.5 font-medium"
            >Phone Number</label
          >
          <input
            type="text"
            v-model="formData.contact_number"
            id="pickup_time"
            class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full"
          />
        </div>
        <div class="space-y-1">
          <label for="pickup_time" class="text-xs pb-1.5 font-medium"
            >Total Pax</label
          >
          <input
            type="text"
            v-model="formData.total_pax"
            id="pickup_time"
            class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full"
          />
        </div>
        <div class="space-y-1 col-span-2">
          <label for="route_plan" class="text-xs pb-1.5 font-medium"
            >Route Plan</label
          >
          <textarea
            v-model="formData.route_plan"
            id="route_plan"
            placeholder="Route plan details"
            class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full"
            rows="7"
          ></textarea>
        </div>
      </div>

      <div
        class="flex justify-center items-center h-[46vh] overflow-y-auto px-4 gap-4"
        v-if="!formData.id"
      >
        <p class="text-sm text-gray-500">Need to select one item</p>
      </div>

      <div
        class="flex justify-end text-[#FF613c] absolute bottom-2 items-center w-full border-t pt-3 space-x-3 px-7"
      >
        <div class="flex justify-end items-center space-x-2" v-if="formData.id">
          <button
            @click="saveCarBooking"
            class="px-3 py-1 bg-green-500 text-white text-[12px] cursor-pointer rounded-lg"
          >
            Save: {{ formData?.crm_id?.split("_")[1] }}
          </button>

          <button
            v-if="formData.id"
            @click="deleteCarBooking"
            class="px-3 py-1 bg-red-600 text-white border border-gray-300 text-[12px] cursor-pointer rounded-lg"
          >
            Delete
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
    <Modal
      :isOpen="showSelectionModal"
      @closeModal="showSelectionModal = false"
    >
      <DialogPanel
        class="w-full max-w-lg transform rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-xs flex justify-between items-center font-medium leading-6 text-gray-900 mb-5"
        >
          copy booking
        </DialogTitle>
        <div class="item-list">
          <div
            v-for="item in props.detail?.booking?.items"
            :key="item.id"
            class="flex justify-start items-center w-full space-x-4 px-2 cursor-pointer py-1 space-y-2"
            :class="{
              'text-[#FF613c] rounded-lg': selectedItems.some(
                (selected) => selected.id === item.id
              ),
            }"
            @click="toggleItemSelection(item)"
          >
            <input
              type="checkbox"
              :checked="
                selectedItems.some((selected) => selected.id === item.id)
              "
              @click.stop
              @change="toggleItemSelection(item)"
            />
            <div class="text-[14px] w-[100%] space-y-1 font-medium">
              <span>Day: {{ changeFormat(item.service_date) }}</span>
              <span>{{ item.product?.name || "Day Activity" }}</span>
            </div>
          </div>
        </div>

        <div class="flex justify-end items-center space-x-2 mt-4">
          <button
            class="text-xs px-4 py-1.5 border border-gray-200 rounded-lg"
            @click="showSelectionModal = false"
          >
            Cancel
          </button>
          <button
            class="text-xs px-4 py-1.5 bg-[#FF613c] text-white rounded-lg"
            @click="copySelectedToClipboard"
          >
            Copy Selected
          </button>
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
import { CurrencyDollarIcon, TruckIcon } from "@heroicons/vue/24/outline";
import { useReservationStore } from "../../stores/reservation";
import { changeFormat } from "../help/FormatData";
import Modal from "../../components/Modal.vue";
import { DialogPanel, DialogTitle } from "@headlessui/vue";

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
const reservationStore = useReservationStore();
const authStore = useAuthStore();
const toast = useToast();

// Get reactive state from stores
const { user } = storeToRefs(authStore);

const is_booking_request = ref(false);
const reservation_ids = ref([]);

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
  extra_collect_amount: "",
  is_driver_collect: "",
  route_plan: "",
  special_request: "",
  driver_contact: "",
  car_photo: "",
  pickup_location: "",
  dropoff_location: "",
  pickup_time: "",
  contact_number: "",
  total_pax: "",
  collect_comment: "",
  car_type: "",
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

const updateAction = async () => {
  // Create form data for reservation update
  const frmData = new FormData();
  frmData.append("is_booking_request", is_booking_request.value ? 1 : 0);
  frmData.append("_method", "PUT");
  // Store for responses
  let responses = [];

  // Loop through each reservation ID
  for (let a = 0; a < reservation_ids.value.length; a++) {
    try {
      // Update main reservation data
      const updateRes = await reservationStore.updateAction(
        frmData,
        reservation_ids.value[a]
      );
      responses.push(updateRes);
    } catch (error) {
      console.error("Reservation update error:", error);
    }
  }

  // Show success message if any operation was successful
  if (responses.length > 0) {
    toast.success("Update completed successfully");
  }

  // Refresh data after a short delay
  setTimeout(async () => {
    await props.getDetailAction(route.query.id);
  }, 1000);
};

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

const selectItem = async (item, index) => {
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
        extra_collect_amount: data.extra_collect || "",
        is_driver_collect:
          data.is_driver_collect == null ? "" : data.is_driver_collect,
        route_plan: data.route_plan === "null" ? "" : data.route_plan,
        special_request: data.special_request || "",
        driver_contact: data.driver_contact || "",
        car_photo: data.car_photo || "",
        pickup_location: data.pickup_location || "",
        dropoff_location: data.dropoff_location || "",
        pickup_time: data.pickup_time || "",
        contact_number: data.contact_number || "",
        total_pax: data.total_pax || "",
        collect_comment: data.collect_comment || "",
        car_type: item.car?.name || "",
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
    }
  } catch (error) {
    console.error("Error fetching item details:", error);
    toast.error("Failed to load item details");
  } finally {
    loading.value = false;
  }
};

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
    frmData.append("contact_number", formData.value.contact_number || "");
    frmData.append("total_pax", formData.value.total_pax || "");
    frmData.append("collect_comment", formData.value.collect_comment || "");

    if (formData.value.cost_price) {
      frmData.append("cost_price", formData.value.cost_price);

      // Calculate total cost price
      const totalCostPrice =
        formData.value.cost_price * formData.value.quantity;
      if (totalCostPrice) {
        frmData.append("total_cost_price", totalCostPrice);
      }
    }

    if (formData.value.is_driver_collect != "") {
      frmData.append(
        "is_driver_collect",
        formData.value.is_driver_collect == 1 ? "1" : "0"
      );
    } else {
      frmData.append("is_driver_collect", "");
    }
    if (formData.value.is_driver_collect) {
      frmData.append(
        "extra_collect_amount",
        formData.value.extra_collect_amount || 0
      );
    }

    frmData.append("route_plan", formData.value.route_plan || "");
    frmData.append("special_request", formData.value.special_request || "");

    const res = await carBookingStore.addNewAction(frmData, formData.value.id);

    if (res && res.status == 1) {
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

    if (res && res.status == 1) {
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

// Create a booking object with your trip details

// Mock function for the copyAction to test the formatting
const showPreview = ref(false);

const selectedItems = ref([]);
const showSelectionModal = ref(false);
const formattedOutput = ref("");

// Toggle item selection
const toggleItemSelection = (item) => {
  const index = selectedItems.value.findIndex(
    (selected) => selected.id === item.id
  );
  if (index === -1) {
    selectedItems.value.push(item);
  } else {
    selectedItems.value.splice(index, 1);
  }

  console.log("====================================");
  console.log("Selected items:", selectedItems.value);
  console.log("====================================");
};

// Prepare modal with all items
const prepareCopySelection = () => {
  selectedItems.value = []; // Reset selection
  showSelectionModal.value = true;
};

// Format and copy only selected items
const copySelectedToClipboard = () => {
  if (selectedItems.value.length === 0) {
    toast.warning("Please select at least one item to copy");
    return;
  }

  formattedOutput.value = formatTripDetails(selectedItems.value);

  navigator.clipboard
    .writeText(formattedOutput.value)
    .then(() => {
      toast.success("Selected trip details copied to clipboard");
      showSelectionModal.value = false;
    })
    .catch((err) => {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy trip details");
    });
};

// Modified format function to work with selected items
const formatTripDetails = (itemsToFormat) => {
  let bookingData = props.detail?.booking || {};

  try {
    // Keep all your existing helper functions (getTripDateRange, formatTime, formatRoutePlan)
    function getTripDateRange(items) {
      if (!items || items.length === 0) return "";

      const sortedItems = [...items].sort((a, b) => {
        if (!a.service_date) return 1;
        if (!b.service_date) return -1;
        return new Date(a.service_date) - new Date(b.service_date);
      });

      const firstDate = sortedItems[0]?.service_date;
      const lastDate = sortedItems[sortedItems.length - 1]?.service_date;

      if (!firstDate) return "";

      const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.getDate();
      };

      const formatMonth = (dateStr) => {
        const date = new Date(dateStr);
        const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        return months[date.getMonth()];
      };

      if (formatMonth(firstDate) === formatMonth(lastDate)) {
        return `${formatDate(firstDate)} to ${formatDate(
          lastDate
        )} ${formatMonth(firstDate)}`;
      } else {
        return `${formatDate(firstDate)} ${formatMonth(
          firstDate
        )} to ${formatDate(lastDate)} ${formatMonth(lastDate)}`;
      }
    }

    function formatTime(timeStr) {
      if (!timeStr || timeStr === "-") return timeStr;

      if (
        timeStr.toLowerCase().includes("am") ||
        timeStr.toLowerCase().includes("pm")
      ) {
        return timeStr;
      }

      try {
        const [hours, minutes] = timeStr
          .split(":")
          .map((num) => parseInt(num, 10));
        const period = hours >= 12 ? "pm" : "am";
        const hour12 = hours % 12 || 12;
        return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`;
      } catch (e) {
        return timeStr;
      }
    }

    function formatRoutePlan(routePlan) {
      if (!routePlan || routePlan === "-") return "";

      if (routePlan.includes("\n")) {
        return routePlan.split("\n").join(" ");
      }

      if (routePlan.includes(",")) {
        return routePlan;
      }

      return routePlan;
    }

    const customerName = bookingData.customer_info?.name || "-";
    const customerPhone = bookingData.customer_info?.phone || "-";
    const pax = bookingData.items[0]?.pax || bookingData.pax || "0";
    const flightNumber = bookingData.items[0]?.flight_number || "-";
    const flightTime = bookingData.items[0]?.pickup_time || "-";
    const pickupLocation = bookingData.items[0]?.pickup_location || "-";
    const totalAmount =
      bookingData.items?.reduce((sum, item) => {
        return sum + (parseFloat(item.extra_collect_amount) || 0);
      }, 0) || "0";

    let output = `Trip - ${getTripDateRange(itemsToFormat)}
CRMID - ${bookingData.crm_id || ""}
Name - ${customerName}
Phone - ${customerPhone}
Pax - ${pax} pax
Pick up location - ${pickupLocation}
Flight time - ${formatTime(flightTime)}
Flight number - ${flightNumber}
Trip plan\n`;

    // Sort selected items by date
    const sortedItems = [...itemsToFormat].sort((a, b) => {
      if (!a.service_date) return 1;
      if (!b.service_date) return -1;
      return new Date(a.service_date) - new Date(b.service_date);
    });

    sortedItems.forEach((item, index) => {
      const dayNumber = index + 1;
      const productName = item.product?.name || "Day Activity";
      const routePlan = item.route_plan || "No itinerary details provided";

      output += `\nDay-${dayNumber
        .toString()
        .padStart(2, "0")} : (${changeFormat(item.service_date)})\n
${productName}\n
${formatRoutePlan(routePlan)}\n
Pickup time - ${formatTime(item.pickup_time)}
Pickup location - ${item.pickup_location || "-"}
Dropoff location - ${item.dropoff_location || "-"}
Special request - ${item.special_request || "-"}
Extra collect amount - ${item.extra_collect_amount || "0"}
Product Variation - ${item.car?.name || "-"}\n
-------------------------------
`;
    });

    output += `\n🟢 Van
🟢 Collect from customer - ${totalAmount} THb
🟢 12 hours per/day
✅ 300 per extra hour`;

    return output;
  } catch (error) {
    console.error("Error formatting trip details:", error);
    return "Failed to format trip information";
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
    is_driver_collect: "",
    route_plan: "",
    special_request: "",
    driver_contact: "",
    car_photo: "",
    pickup_location: "",
    dropoff_location: "",
    pickup_time: "",
    contact_number: "",
    total_pax: "",
    collect_comment: "",
    car_type: "",
    service_date: "",
    crm_id: "",
  };
  carNumbers.value = [];
};

onMounted(async () => {
  try {
    is_booking_request.value =
      props?.detail?.booking?.items[0].is_booking_request == 1 ? true : false;

    reservation_ids.value = [];
    for (let i = 0; i < props?.detail?.booking?.items.length; i++) {
      reservation_ids.value.push(props?.detail?.booking?.items[i].id);
    }

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
