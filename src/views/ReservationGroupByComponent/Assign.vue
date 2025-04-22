<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Header -->
    <div class="flex justify-between items-center col-span-3">
      <h1 class="text-lg font-medium text-[#FF613c]">Batch Assign Cars</h1>
    </div>
  
    <!-- Items selection section -->
    <div class="border border-gray-200 rounded-lg p-4 col-span-1">
      <div class="flex justify-between items-center mb-4 gap-x-3">
        <h2 class="text-sm font-medium">Items</h2>
        <div class="flex items-center space-x-2">
          <button 
            @click="selectAll" 
            class="px-3 py-1 border border-gray-300 rounded-lg text-xs"
          >
            Select All
          </button>
          <button 
            @click="clearSelection" 
            class="px-3 py-1 border border-gray-300 rounded-lg text-xs"
          >
            Clear
          </button>
        </div>
      </div>

      <div class="h-[40vh] overflow-y-auto border border-gray-200 rounded-lg">
        <div 
          v-for="item in allItems" 
          :key="item.id" 
          :class="{'bg-green-50': selectedItems.includes(item.id)}"
          @click="toggleItemSelection(item.id)"
          class="cursor-pointer hover:bg-gray-50 border-b border-gray-200 py-2 pl-10 pr-4 space-y-2 relative"
        >
          <input 
            type="checkbox" 
            v-model="selectedItems" 
            :value="item.id"
            class="h-4 w-4 text-[#FF613c] rounded absolute top-4 left-2"
            @click.stop
          />
          <p class="text-xs">{{ item.crm_id }}</p>
          <p class="text-xs">{{ item.product?.name }}</p>
          <p class="text-xs">{{ item.service_date }}</p>
          <p 
            class="px-4 text-center py-1 rounded-lg text-xs"
            :class="getStatusClass(item)"
          >
            {{ getAssignmentStatus(item) }}
          </p>
        </div>
      </div>

      <!-- Common settings toggle -->
      <button 
        class="px-3 py-2 mt-4 w-full border border-gray-300 rounded-lg text-xs bg-[#FF613c] text-white" 
        @click="commonShow = !commonShow"
      >
        {{ commonShow ? 'Hide Common Settings' : 'Show Common Settings' }}
      </button>
    </div>

    <!-- Configuration section -->
    <div class="flex flex-col space-y-6 col-span-2 h-[55vh] overflow-y-auto">
      <!-- Common Settings Section -->
      <div class="border border-gray-200 rounded-lg p-4" v-if="commonShow">
        <h2 class="text-sm font-medium mb-4 text-[#FF613c]">Common Settings (Optional)</h2>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label for="common_supplier" class="text-xs pb-1.5 font-medium">Supplier</label>
            <select 
              v-model="commonData.supplier_id" 
              id="common_supplier"
              class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full"
              @change="onCommonSupplierChange"
            >
              <option value="">Select Supplier</option>
              <option v-for="supplier in suppliers?.data" :key="supplier.id" :value="supplier.id">
                {{ supplier.name }}
              </option>
            </select>
          </div>
          
          <div class="space-y-1">
            <label for="common_driver" class="text-xs pb-1.5 font-medium">Driver</label>
            <select 
              v-model="commonData.driver_id" 
              id="common_driver"
              class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full"
              @change="onCommonDriverChange"
            >
              <option value="">Select Driver</option>
              <option v-for="driver in commonDrivers" :key="driver.id" :value="driver.id">
                {{ driver.name }}
              </option>
            </select>
          </div>
          
          <div class="space-y-1">
            <label for="common_car_number" class="text-xs pb-1.5 font-medium">Car Number</label>
            <select 
              v-model="commonData.car_number" 
              id="common_car_number"
              class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full"
            >
              <option value="">Select Car Number</option>
              <option v-for="car in commonCarNumbers" :key="car.id" :value="car.id">
                {{ car.car_number }}
              </option>
            </select>
          </div>
          
          <div class="space-y-1">
            <label for="common_driver_contact" class="text-xs pb-1.5 font-medium">Driver Contact</label>
            <input
              type="text"
              v-model="commonData.driver_contact"
              id="common_driver_contact"
              placeholder="Driver contact"
              class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full"
            />
          </div>
        </div>

        <div class="mt-4">
          <button 
            @click="applyToSelected" 
            class="px-4 py-2 bg-[#FF613c] text-white rounded-lg text-xs"
            :disabled="selectedItems.length === 0"
          >
            Apply Common Settings to Selected ({{ selectedItems.length }})
          </button>
        </div>
      </div>

      <!-- Item configuration -->
      <div v-if="selectedItems.length > 0 && !commonShow" class="border border-gray-200 rounded-lg p-4 flex-1 overflow-y-auto">
        <div class="flex justify-between items-center pb-4">
          <h2 class="text-sm font-medium text-[#FF613c]">Configure Selected Items</h2>
          <div class="flex justify-end space-x-3">
            <button 
              @click="goBack" 
              class="px-4 py-2 border border-gray-300 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button 
              @click="saveAllAssignments" 
              class="px-4 py-2 bg-green-500 text-white rounded-lg text-xs"
              :disabled="selectedItems.length === 0 || loading || !canSave"
            >
              {{ loading ? 'Saving...' : 'Save All Assignments' }}
            </button>
          </div>
        </div>
        
        <div class="space-y-6 overflow-y-auto pr-2">
          <div 
            v-for="itemId in selectedItems" 
            :key="itemId"
            class="border border-gray-200 rounded-lg p-4"
          >
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-xs font-medium text-[#FF613c]">
                {{ getItemById(itemId)?.product?.name }} - {{ getItemById(itemId)?.service_date }}
              </h3>
            </div>
            
            <!-- Item-specific fields -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="space-y-1">
                <label :for="`supplier_${itemId}`" class="text-xs pb-1.5 font-medium">
                  Supplier <span class="text-red-600">*</span>
                </label>
                <select 
                  v-model="itemConfigs[itemId].supplier_id" 
                  :id="`supplier_${itemId}`"
                  class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full"
                  @change="() => onItemSupplierChange(itemId)"
                >
                  <option value="">Select Supplier</option>
                  <option v-for="supplier in suppliers?.data" :key="supplier.id" :value="supplier.id">
                    {{ supplier.name }}
                  </option>
                </select>
              </div>
              
              <div class="space-y-1">
                <label :for="`driver_${itemId}`" class="text-xs pb-1.5 font-medium">
                  Driver <span class="text-red-600">*</span>
                </label>
                <select 
                  v-model="itemConfigs[itemId].driver_id" 
                  :id="`driver_${itemId}`"
                  class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full"
                  @change="() => onItemDriverChange(itemId)"
                >
                  <option value="">Select Driver</option>
                  <option v-for="driver in itemDrivers[itemId] || []" :key="driver.id" :value="driver.id">
                    {{ driver.name }}
                  </option>
                </select>
              </div>
              
              <div class="space-y-1">
                <label :for="`car_number_${itemId}`" class="text-xs pb-1.5 font-medium">Car Number</label>
                <select 
                  v-model="itemConfigs[itemId].car_number" 
                  :id="`car_number_${itemId}`"
                  class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full"
                >
                  <option value="">Select Car Number</option>
                  <option v-for="car in itemCarNumbers[itemId] || []" :key="car.id" :value="car.id">
                    {{ car.car_number }}
                  </option>
                </select>
              </div>
              
              <div class="space-y-1">
                <label :for="`driver_contact_${itemId}`" class="text-xs pb-1.5 font-medium">Driver Contact</label>
                <input
                  type="text"
                  v-model="itemConfigs[itemId].driver_contact"
                  :id="`driver_contact_${itemId}`"
                  placeholder="Driver contact"
                  class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref, onMounted, computed, defineProps, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useCarBookingStore } from "../../stores/carbooking";
import { useSupplierStore } from "../../stores/supplier";
import { useDriverStore } from "../../stores/driver";
import { useAuthStore } from "../../stores/auth";
import { useToast } from "vue-toastification";
import { storeToRefs } from "pinia";

// Router and route
const router = useRouter();
const route = useRoute();

// Stores
const carBookingStore = useCarBookingStore();
const supplierStore = useSupplierStore();
const driverStore = useDriverStore();
const authStore = useAuthStore();
const toast = useToast();

// Store refs
const { suppliers } = storeToRefs(supplierStore);
const { drivers } = storeToRefs(driverStore);
const { user } = storeToRefs(authStore);

// Props
const props = defineProps({
  detail: Object,
  getDetailAction: Function,
});

// State
const loading = ref(false);
const allItems = ref([]);
const selectedItems = ref([]);
const selectAllChecked = ref(false);
const commonShow = ref(false);
const commonCarNumbers = ref([]);
const commonDrivers = ref([]);
const itemConfigs = ref({});
const itemDrivers = ref({});
const itemCarNumbers = ref({});

// Common data initialization
const commonData = ref({
  supplier_id: "",
  driver_id: "",
  car_number: "",
  driver_contact: "",
  car_photo: ""
});

// Computed
const canSave = computed(() => {
  return selectedItems.value.length > 0 && 
    selectedItems.value.every(itemId => {
      const config = itemConfigs.value[itemId];
      return config?.supplier_id && config?.driver_id;
    });
});

// Initialize on mount
onMounted(async () => {
  try {
    loading.value = true;
    
    await Promise.all([
      supplierStore.getSimpleListAction(),
      driverStore.getSimpleListAction()
    ]);
    
    await fetchItems();
  } catch (error) {
    console.error("Initialization error:", error);
    toast.error("Failed to initialize");
  } finally {
    loading.value = false;
  }
});

// Watch for changes in selected items
watch(selectedItems, (newVal) => {
  selectAllChecked.value = newVal.length === allItems.value.length && allItems.value.length > 0;
}, { deep: true });

// Helper functions
const getStatusClass = (item) => {
  return item.driver_id ? 'bg-green-400 text-white' : 'bg-gray-100 text-gray-800';
};

const getAssignmentStatus = (item) => {
  return item.driver_id ? 'Assigned' : 'Unassigned';
};

const getItemById = (id) => {
  return allItems.value.find(item => item.id === id);
};

// Selection handlers
const toggleItemSelection = (itemId) => {
  const index = selectedItems.value.indexOf(itemId);
  if (index === -1) {
    selectedItems.value.push(itemId);
  } else {
    selectedItems.value.splice(index, 1);
  }
};

const selectAll = () => {
  selectedItems.value = allItems.value.map(item => item.id);
};

const clearSelection = () => {
  selectedItems.value = [];
};

const toggleSelectAll = () => {
  selectAllChecked.value ? selectAll() : clearSelection();
};

// Navigation
const goBack = () => {
  router.back();
};

// Data fetching
const fetchItems = async () => {
  try {
    if (!props.detail?.booking?.items) {
      toast.warning("No items found");
      return;
    }
    
    const privateVanTourItems = props.detail.booking.items.filter(
      item => item.product_type === 'App\\Models\\PrivateVanTour'
    );
    
    if (privateVanTourItems.length === 0) {
      toast.warning("No private van tour items found");
      return;
    }
    
    allItems.value = privateVanTourItems;
    await fetchItemDetails(privateVanTourItems);
  } catch (error) {
    console.error("Error fetching items:", error);
    toast.error("Failed to load items");
  }
};

const fetchItemDetails = async (items) => {
  for (const item of items) {
    if (!item.id) continue;
    
    try {
      const res = await carBookingStore.getDetailAction(item.id);
      
      if (res?.result) {
        const data = res.result;
        const itemIndex = allItems.value.findIndex(i => i.id === item.id);
        
        if (itemIndex !== -1) {
          allItems.value[itemIndex] = { ...allItems.value[itemIndex], ...data };
          initializeItemConfig(item.id, data);
        }
      }
    } catch (error) {
      console.error(`Error fetching details for item ${item.id}:`, error);
    }
  }
};

const initializeItemConfig = (itemId, data) => {
  itemConfigs.value[itemId] = {
    supplier_id: data.supplier_id || '',
    driver_id: data.driver_id || '',
    car_number: data.driver_info_id || '',
    driver_contact: data.driver_contact || '',
    pickup_time: data.pickup_time || '',
    pickup_location: data.pickup_location || '',
    dropoff_location: data.dropoff_location || '',
    route_plan: data.route_plan === 'null' ? '' : data.route_plan || '',
    special_request: data.special_request || '',
    is_driver_collect: data.is_driver_collect === 1,
    extra_collect_amount: data.extra_collect || '',
    cost_price: data.cost_price || '',
  };
  
  if (data.supplier_id) {
    onItemSupplierChange(itemId);
  }
  
  if (data.driver_id) {
    onItemDriverChange(itemId);
  }
};

// Common data handlers
const onCommonSupplierChange = async () => {
  if (!commonData.value.supplier_id) {
    commonDrivers.value = [];
    return;
  }
  
  try {
    const res = await driverStore.getSimpleListAction({ 
      supplier_id: commonData.value.supplier_id 
    });
    
    if (res?.result?.data) {
      commonDrivers.value = res.result.data;
    }
  } catch (error) {
    console.error("Error fetching common drivers:", error);
    toast.error("Failed to load drivers");
  }
};

const onCommonDriverChange = async () => {
  if (!commonData.value.driver_id) {
    commonCarNumbers.value = [];
    return;
  }
  
  try {
    const res = await driverStore.getDetailAction(commonData.value.driver_id);
    
    if (res?.result) {
      const data = res.result;
      commonData.value.driver_contact = data.contact || '';
      commonCarNumbers.value = data.infos || [];
      
      if (data.infos?.length) {
        const defaultCar = data.infos.find(car => car.is_default === 1);
        if (defaultCar) {
          commonData.value.car_number = defaultCar.id;
        }
      }
    }
  } catch (error) {
    console.error("Error fetching common driver details:", error);
    toast.error("Failed to load driver details");
  }
};

// Item-specific handlers
const onItemSupplierChange = async (itemId) => {
  const supplierId = itemConfigs.value[itemId]?.supplier_id;
  if (!supplierId) {
    itemDrivers.value[itemId] = [];
    return;
  }
  
  try {
    const res = await driverStore.getSimpleListAction({ supplier_id: supplierId });
    
    if (res?.result?.data) {
      itemDrivers.value[itemId] = res.result.data;
      
      // Clear driver selection if supplier changed
      if (itemConfigs.value[itemId].driver_id) {
        const driverExists = res.result.data.some(
          driver => driver.id === itemConfigs.value[itemId].driver_id
        );
        
        if (!driverExists) {
          itemConfigs.value[itemId].driver_id = '';
          itemConfigs.value[itemId].car_number = '';
          itemCarNumbers.value[itemId] = [];
        }
      }
    }
  } catch (error) {
    console.error(`Error fetching drivers for item ${itemId}:`, error);
    toast.error("Failed to load drivers");
  }
};

const onItemDriverChange = async (itemId) => {
  const driverId = itemConfigs.value[itemId]?.driver_id;
  if (!driverId) {
    itemCarNumbers.value[itemId] = [];
    return;
  }
  
  try {
    const res = await driverStore.getDetailAction(driverId);
    
    if (res?.result) {
      const data = res.result;
      itemConfigs.value[itemId].driver_contact = data.contact || '';
      itemCarNumbers.value[itemId] = data.infos || [];
      
      if (data.infos?.length) {
        const defaultCar = data.infos.find(car => car.is_default === 1);
        if (defaultCar) {
          itemConfigs.value[itemId].car_number = defaultCar.id;
        }
      }
    }
  } catch (error) {
    console.error(`Error fetching driver details for item ${itemId}:`, error);
    toast.error("Failed to load driver details");
  }
};

// Actions
const applyToSelected = () => {
  if (selectedItems.value.length === 0) {
    toast.warning("No items selected");
    return;
  }
  
  selectedItems.value.forEach(itemId => {
    const config = itemConfigs.value[itemId];
    if (!config) return;
    
    // Apply supplier if provided
    if (commonData.value.supplier_id) {
      config.supplier_id = commonData.value.supplier_id;
      onItemSupplierChange(itemId);
    }
    
    // Apply driver if provided (after supplier drivers are loaded)
    if (commonData.value.driver_id) {
      config.driver_id = commonData.value.driver_id;
      onItemDriverChange(itemId);
    }
    
    // Apply car number if provided
    if (commonData.value.car_number) {
      config.car_number = commonData.value.car_number;
    }
    
    // Apply driver contact if provided
    if (commonData.value.driver_contact) {
      config.driver_contact = commonData.value.driver_contact;
    }
  });
  
  toast.success(`Applied settings to ${selectedItems.value.length} items`);
  commonShow.value = false; // Hide common settings after applying
};

const saveAllAssignments = async () => {
  if (selectedItems.value.length === 0) {
    toast.warning("No items selected");
    return;
  }
  
  // Validate required fields
  const invalidItems = selectedItems.value.filter(itemId => {
    const config = itemConfigs.value[itemId];
    return !config?.supplier_id || !config?.driver_id;
  });
  
  if (invalidItems.length > 0) {
    toast.warning(`${invalidItems.length} item(s) missing required fields`);
    return;
  }
  
  try {
    loading.value = true;
    
    // Process each item
    const results = await Promise.allSettled(
      selectedItems.value.map(async (itemId) => {
        const itemConfig = itemConfigs.value[itemId];
        const item = getItemById(itemId);
        const formData = new FormData();
        
        // Required fields
        formData.append("supplier_id", itemConfig.supplier_id);
        formData.append("driver_id", itemConfig.driver_id);
        
        // Optional fields with null checks
        if (itemConfig.driver_contact) 
          formData.append("driver_contact", itemConfig.driver_contact);
          
        if (itemConfig.car_number) 
          formData.append("driver_info_id", itemConfig.car_number);
          
        if (itemConfig.pickup_location) 
          formData.append("pickup_location", itemConfig.pickup_location);
          
        if (itemConfig.dropoff_location) 
          formData.append("dropoff_location", itemConfig.dropoff_location);
          
        if (itemConfig.pickup_time) 
          formData.append("pickup_time", itemConfig.pickup_time);
        
        // Cost price calculation
        if (itemConfig.cost_price) {
          formData.append("cost_price", itemConfig.cost_price);
          const quantity = item?.quantity || 1;
          formData.append("total_cost_price", itemConfig.cost_price * quantity);
        }
        
        // Driver collection handling
        formData.append("is_driver_collect", itemConfig.is_driver_collect ? 1 : 0);
        if (itemConfig.is_driver_collect && itemConfig.extra_collect_amount) {
          formData.append("extra_collect_amount", itemConfig.extra_collect_amount);
        }
        
        // Additional info
        if (itemConfig.route_plan) 
          formData.append("route_plan", itemConfig.route_plan);
          
        if (itemConfig.special_request) 
          formData.append("special_request", itemConfig.special_request);
        
        try {
          return await carBookingStore.addNewAction(formData, itemId);
        } catch (err) {
          console.error(`Error saving item ${itemId}:`, err);
          throw err;
        }
      })
    );
    
    // Count successes
    const successCount = results.filter(
      res => res.status === "fulfilled" && res.value?.status === "Request was successful."
    ).length;
    
    if (successCount === selectedItems.value.length) {
      toast.success(`Successfully assigned ${successCount} items`);
      
      // Refresh parent data if callback provided
      if (props.getDetailAction && route.query.id) {
        await props.getDetailAction(route.query.id);
      }
      
      goBack();
    } else {
      const failCount = selectedItems.value.length - successCount;
      toast.warning(`Assigned ${successCount} items (${failCount} failed)`);
    }
  } catch (error) {
    console.error("Error saving assignments:", error);
    toast.error("Failed to save assignments");
  } finally {
    loading.value = false;
  }
};
</script>