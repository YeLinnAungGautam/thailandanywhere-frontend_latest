<template>
  <div class="grid grid-cols-3 gap-x-4">
    <div class="rounded-lg py-3 relative border space-y-3 border-gray-200 h-auto">
      <p class="text-lg font-medium text-[#FF613c] px-4">Reservation Items</p>

      <div class="h-[46vh] overflow-y-auto space-y-1">

        <div class=" px-4 pb-3">
          <p class="pb-3 text-xs font-medium text-gray-700">
            Is Booking Request Sent:
          </p>
          <div class="flex justify-between items-center gap-x-2">
            <select
              name=""
              id=""
              v-model="is_booking_request"
              class="w-full border border-gray-200 px-4 py-1.5 text-[10px] rounded-lg"
            >
              <option :value="true">Email Sent</option>
              <option :value="false">Not Sent</option>
            </select>
            <button
              class="text-xs px-3 py-1 border rounded-lg shadow border-[#FF6300] bg-[#FF6300] text-white"
              @click="updateAction"
            >
              Status
            </button>
          </div>
          
        </div>

        <!-- Loop through the grouped items by CRM ID -->
        <div
          v-for="(items, crm_id) in groupedItems"
          :key="crm_id"
          class="flex flex-col px-4 py-2 bg-white rounded-lg shadow-sm"
        >
          <!-- CRM ID header -->
          <div class="text-xs font-medium text-gray-500 mb-2">
            For CRM ID: {{ crm_id }}
          </div>

          <!-- List of items with the same CRM ID -->
          <div
            v-for="(item, index) in items"
            :key="index"
            class="flex justify-start items-center space-x-4 px-2 cursor-pointer py-1"
            @click="selectItem(item, index)"
            :class="{ 'bg-[#FF613c] text-white rounded-lg': item.id === formData.id }"
          >
            <div class="bg-[#FF613c]/30 rounded-lg p-2 inline-block">
              <TruckIcon class="w-4 h-4" />
            </div>
            <p class="text-[12px] font-medium">
              <span :class="item.id == formData.id ? 'text-white' : 'text-[#FF613c]'">{{ item.product?.name }}</span>
              <span v-if="item.service_date" :class="item.id == formData.id ? 'ml-2 text-gray-200':'ml-2 text-gray-400'">({{ item.service_date }})</span>
            </p>
          </div>
        </div>
      </div>
      <div class="w-full pt-4 px-4">
        <div
          @click="resetForm()"
          class="bg-[#FF613c] cursor-pointer text-white rounded-xl text-center text-xs py-3"
        >
          Reset
        </div>
      </div>
    </div>
    <div class="col-span-2 py-3 rounded-lg relative border border-gray-200">
      <div class=" flex justify-between items-center pb-4">
        <p class="text-lg font-medium text-[#FF613c] px-4 ">Car Booking Details</p>
        <p class="bg-[#FF613c] cursor-pointer text-white rounded-lg px-4 text-center text-xs mr-4 py-1" @click="generatePreview">Generate Preview</p>
      </div>
      <div v-if="showPreview" class="grid grid-cols-2 h-[52vh] overflow-y-auto px-4 gap-4">
        <div>
          <textarea v-model="formattedOutput" rows="20" cols="80" class=" text-sm focus:outline-none"></textarea>
        </div>
        <div class="flex justify-end text-[#FF613c] absolute bottom-2 items-center w-full border-t pt-3 space-x-3 px-7">
          <button @click="copyToClipboard" class="px-3 py-1 bg-[#FF613c] text-white border border-gray-300 text-[12px] cursor-pointer rounded-lg">Copy to Clipboard</button>
          <button @click="showPreview = false" class="px-3 py-1 bg-[#FF613c] text-white border border-gray-300 text-[12px] cursor-pointer rounded-lg">Close</button>
        </div>
      </div>
      <div class="grid grid-cols-2 h-[46vh] overflow-y-auto px-4 gap-4" v-if="formData.id && !showPreview">
        <div class="space-y-4">
          <div v-if="user && (user.role !== 'reservation')" class="space-y-1">
            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                v-model="formData.is_driver_collect"
                id="is_driver_collect"
                class="w-4 h-4 text-[#FF613c] rounded"
              />
              <label for="is_driver_collect" class="text-xs font-medium">Is Driver Collect?</label>
            </div>
          </div>
            
          <div v-if="formData.is_driver_collect && user && (user.role !== 'reservation')" class="space-y-1">
            <label for="extra_collect_amount" class="text-xs pb-1.5 font-medium">Extra Collect Amount</label>
            <input
              type="number"
              v-model="formData.extra_collect_amount"
              id="extra_collect_amount"
              placeholder="Extra amount"
              class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full"
            />
          </div>
          
          <div v-if="user && (user.role === 'super_admin' || user.role === 'reservation')" class="space-y-1">
            <label for="cost_price" class="text-xs pb-1.5 font-medium">Cost Price</label>
            <input
              type="number"
              v-model="formData.cost_price"
              id="cost_price"
              placeholder="Cost price"
              class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full"
            />
          </div>
                  
          <div v-if="user && (user.role !== 'reservation')" class="space-y-1">
            <label for="pickup_time" class="text-xs pb-1.5 font-medium">Pickup Time</label>
            <input
              type="time"
              v-model="formData.pickup_time"
              id="pickup_time"
              class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full"
            />
          </div>
          
          <div v-if="user && (user.role !== 'reservation')" class="space-y-1">
            <label for="route_plan" class="text-xs pb-1.5 font-medium">Route Plan</label>
            <textarea
              v-model="formData.route_plan"
              id="route_plan"
              placeholder="Route plan details"
              class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full"
              rows="3"
            ></textarea>
          </div>
          
        </div>
        
        <div class="space-y-4">
          <div v-if="user && (user.role !== 'reservation')" class="space-y-1">
            <label for="pickup_location" class="text-xs pb-1.5 font-medium">Pickup Location</label>
            <textarea
              v-model="formData.pickup_location"
              id="pickup_location"
              placeholder="Pickup location details"
              class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full"
              rows="3"
            ></textarea>
          </div>
          
          <div v-if="user && (user.role !== 'reservation')" class="space-y-1">
            <label for="dropoff_location" class="text-xs pb-1.5 font-medium">Dropoff Location</label>
            <textarea
              v-model="formData.dropoff_location"
              id="dropoff_location"
              placeholder="Dropoff location details"
              class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full"
              rows="3"
            ></textarea>
          </div>
          
          <div v-if="user && (user.role !== 'reservation')" class="space-y-1">
            <label for="special_request" class="text-xs pb-1.5 font-medium">Special Request</label>
            <textarea
              v-model="formData.special_request"
              id="special_request"
              placeholder="Special request details"
              class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full"
              rows="3"
            ></textarea>
          </div>
        </div>
      </div>

      <div class=" flex justify-center items-center h-[46vh] overflow-y-auto px-4 gap-4" v-if="!formData.id && !showPreview">
        <p class=" text-sm text-gray-500">Need to select one item</p>
      </div>
      
      <div class="flex justify-end text-[#FF613c] absolute bottom-2 items-center w-full border-t pt-3 space-x-3 px-7" v-if="!showPreview">
        <div class="flex justify-end items-center space-x-2">
          <button
            @click="saveCarBooking"
            class="px-3 py-1 bg-green-500 text-white text-[12px] cursor-pointer rounded-lg"
          >
            {{ formData.id ? "Update" : "Save" }}
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
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted, computed } from 'vue';
import { useCarBookingStore } from "../../stores/carbooking";
import { useSupplierStore } from "../../stores/supplier";
import { useDriverStore } from "../../stores/driver";
import { useAuthStore } from "../../stores/auth";
import { useToast } from "vue-toastification";
import { storeToRefs } from "pinia";
import { useRoute } from 'vue-router';
import { TruckIcon } from '@heroicons/vue/24/outline';
import { useReservationStore } from '../../stores/reservation';
import { changeFormat } from '../help/FormatData';

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
  is_driver_collect: false,
  route_plan: "",
  special_request: "",
  driver_contact: "",
  car_photo: "",
  pickup_location: "",
  dropoff_location: "",
  pickup_time: "",
});

// Group items by CRM ID
const groupedItems = computed(() => {
  const grouped = {};
  
  if (allItems.value && allItems.value.length > 0) {
    allItems.value.forEach(item => {
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
        supplier_id: formData.value.supplier_id
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
        formData.value.driver_contact = data.contact || '';
        formData.value.car_photo = data.car_photo || '';
        carNumbers.value = data.infos || [];
        
        // Set default car number if available
        if (data.infos && data.infos.length > 0) {
          data.infos.forEach(car => {
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
        supplier_id: data.supplier_id || '',
        driver_id: data.driver_id || '',
        quantity: data.quantity || 1,
        car_number: data.driver_info_id || '',
        cost_price: data.cost_price || '',
        extra_collect_amount: data.extra_collect || '',
        is_driver_collect: data.is_driver_collect === 1,
        route_plan: data.route_plan === 'null' ? '' : data.route_plan,
        special_request: data.special_request || '',
        driver_contact: data.driver_contact || '',
        car_photo: data.car_photo || '',
        pickup_location: data.pickup_location || '',
        dropoff_location: data.dropoff_location || '',
        pickup_time: data.pickup_time || '',
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
    frmData.append("supplier_id", formData.value.supplier_id || '');
    frmData.append("driver_id", formData.value.driver_id || '');
    frmData.append("driver_contact", formData.value.driver_contact || '');
    frmData.append("driver_info_id", formData.value.car_number || '');
    frmData.append("pickup_location", formData.value.pickup_location || '');
    frmData.append("dropoff_location", formData.value.dropoff_location || '');
    frmData.append("pickup_time", formData.value.pickup_time || '');
    
    if (formData.value.cost_price) {
      frmData.append("cost_price", formData.value.cost_price);
      
      // Calculate total cost price
      const totalCostPrice = formData.value.cost_price * formData.value.quantity;
      if (totalCostPrice) {
        frmData.append("total_cost_price", totalCostPrice);
      }
    }
    
    frmData.append("is_driver_collect", formData.value.is_driver_collect ? true : false);
    if (formData.value.is_driver_collect) {
      frmData.append("extra_collect_amount", formData.value.extra_collect_amount || 0);
    }
    
    frmData.append("route_plan", formData.value.route_plan || '');
    frmData.append("special_request", formData.value.special_request || '');
    
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

// Create a booking object with your trip details

// Mock function for the copyAction to test the formatting
const showPreview = ref(false);
const formattedOutput = ref('');

const generatePreview = () => {
  formattedOutput.value = formatTripDetails();
  showPreview.value = !showPreview.value;
};

const copyToClipboard = () => {
  navigator.clipboard.writeText(formattedOutput.value)
    .then(() => {
      toast.success("Trip details copied to clipboard");
      showPreview.value = false;
    })
    .catch(err => {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy trip details");
    });
};

const formatTripDetails = () => {
  let bookingData = props.detail?.booking || {};
  
  try {
    // Helper function to extract date range from items
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
        const months = ["January", "February", "March", "April", "May", "June", 
                        "July", "August", "September", "October", "November", "December"];
        return months[date.getMonth()];
      };
      
      if (formatMonth(firstDate) === formatMonth(lastDate)) {
        return `${formatDate(firstDate)} to ${formatDate(lastDate)} ${formatMonth(firstDate)}`;
      } else {
        return `${formatDate(firstDate)} ${formatMonth(firstDate)} to ${formatDate(lastDate)} ${formatMonth(lastDate)}`;
      }
    }
    
    function formatTime(timeStr) {
      if (!timeStr || timeStr === "-") return timeStr;
      
      if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm')) {
        return timeStr;
      }
      
      try {
        const [hours, minutes] = timeStr.split(':').map(num => parseInt(num, 10));
        const period = hours >= 12 ? 'pm' : 'am';
        const hour12 = hours % 12 || 12;
        return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
      } catch (e) {
        return timeStr;
      }
    }
    
    function formatRoutePlan(routePlan) {
      if (!routePlan || routePlan === "-") return "";
      
      if (routePlan.includes('\n')) {
        return routePlan.split('\n').join(' ');
      }
      
      if (routePlan.includes(',')) {
        return routePlan;
      }
      
      return routePlan;
    }
    
    const customerName = bookingData.customer_info?.name || "-";
    const pax = bookingData.items[0]?.pax || bookingData.pax || "0";
    const flightNumber = bookingData.items[0]?.flight_number || "-";
    const flightTime = bookingData.items[0]?.pickup_time || "-";
    const pickupLocation = bookingData.items[0]?.pickup_location || "-";
    const totalAmount = bookingData.items?.reduce((sum, item) => {
      return sum + (parseFloat(item.extra_collect_amount) || 0);
    }, 0) || "0";
    
    let output = `Trip - ${getTripDateRange(bookingData.items)}
CRMID - ${bookingData.crm_id || ""}  
Name - ${customerName}  
Pax - ${pax} pax  
Pick up location - ${pickupLocation} 
Flight time - ${formatTime(flightTime)}  
Flight number - ${flightNumber}  
Trip plan`;

    const sortedItems = [...bookingData.items].sort((a, b) => {
      if (!a.service_date) return 1;
      if (!b.service_date) return -1;
      return new Date(a.service_date) - new Date(b.service_date);
    });

    sortedItems.forEach((item, index) => {
      const dayNumber = index + 1;
      const productName = item.product?.name || "Day Activity";
      const city = item.product?.cities[0]?.name || "City";
      const routePlan = item.route_plan || "No itinerary details provided";
      
      output += `\n\nDay-${dayNumber.toString().padStart(2, '0')} : (${changeFormat(item.service_date)})\n
${productName} ${city ? `( in ${city} )` : ''}\n
${formatRoutePlan(routePlan)}`;
    });
    
    output += `\n\n🟢 Van  
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
    is_driver_collect: false,
    route_plan: "",
    special_request: "",
    driver_contact: "",
    car_photo: "",
    pickup_location: "",
    dropoff_location: "",
    pickup_time: "",
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
        item => item.product_type === 'App\\Models\\PrivateVanTour'
      );
    }
    
  } catch (error) {
    console.error("Error loading initial data:", error);
    toast.error("Failed to load initial data");
  } finally {
    loading.value = false;
  }
});
</script>