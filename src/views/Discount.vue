<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
    <!-- Page Header -->
    <div class="mb-4">
      <h1 class="text-xl font-bold text-gray-900 mb-2">Discount Management</h1>
      <p class="text-gray-600 text-sm">
        Manage discount percentages for hotels and entrance tickets
      </p>
    </div>

    <!-- Tab Navigation -->
    <div class="border-b border-gray-200 mb-4">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-xs transition-colors duration-200',
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          ]"
        >
          <i :class="tab.icon" class="text-lg"></i>
          <span>{{ tab.label }}</span>
        </button>
      </nav>
    </div>

    <!-- Loading Overlay -->
    <div
      v-if="discountStore.loading"
      class="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 rounded-lg"
    >
      <div class="flex flex-col items-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"
        ></div>
        <p class="mt-3 text-gray-600 font-medium">Loading...</p>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- Hotel Discount Tab -->
      <div
        v-show="activeTab === 'hotel'"
        class="transition-all duration-300 ease-in-out"
      >
        <div
          class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
        >
          <!-- Card Header -->
          <div
            class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center"
          >
            <h2 class="text-sm font-semibold text-gray-900">
              Hotel Discount Settings
            </h2>
            <button
              @click="loadDiscount('hotel')"
              :disabled="discountStore.loading"
              class="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <i class="fas fa-sync-alt mr-2"></i>
              Refresh
            </button>
          </div>

          <!-- Card Body -->
          <div class="p-4">
            <!-- Form -->
            <form @submit.prevent="handleSubmit('hotel')" class="mb-8">
              <div class="space-y-6">
                <div>
                  <label
                    for="hotelDiscount"
                    class="block text-xs font-medium text-gray-700 mb-2"
                  >
                    Discount Percentage
                    <span class="text-red-500 ml-1">*</span>
                  </label>
                  <div class="relative">
                    <input
                      id="hotelDiscount"
                      v-model.number="discounts.hotel.form.meta_value"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      :class="[
                        'block w-full pr-12 sm:text-sm rounded-lg border px-4 py-3 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200',
                        discounts.hotel.errors.meta_value
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : '',
                      ]"
                      placeholder="Enter discount percentage"
                      required
                    />
                    <div
                      class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                    >
                      <span class="text-gray-500 text-sm font-medium">%</span>
                    </div>
                  </div>
                  <p
                    v-if="discounts.hotel.errors.meta_value"
                    class="mt-2 text-sm text-red-600"
                  >
                    {{ discounts.hotel.errors.meta_value }}
                  </p>
                </div>

                <!-- Form Actions -->
                <div class="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    :disabled="discountStore.loading || !isFormValid('hotel')"
                    class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-xs font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    <i class="fas fa-save mr-2"></i>
                    {{ discounts.hotel.data ? "Update" : "Save" }} Hotel
                    Discount
                  </button>

                  <button
                    v-if="discounts.hotel.data"
                    type="button"
                    @click="handleDelete('hotel')"
                    :disabled="discountStore.loading"
                    class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-xs font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    <i class="fas fa-trash mr-2"></i>
                    Delete
                  </button>
                </div>
              </div>
            </form>

            <!-- Current Hotel Discount Display -->
            <div
              v-if="discounts.hotel.data"
              class="bg-blue-50 rounded-xl p-4 border border-blue-200"
            >
              <h3 class="text-xs font-semibold text-gray-900 mb-4">
                Current Hotel Discount
              </h3>
              <div
                class="flex flex-col lg:flex-row lg:items-center lg:space-x-8"
              >
                <div class="mb-4 lg:mb-0">
                  <div class="text-5xl font-bold text-blue-600">
                    0.{{ discounts.hotel.data.meta_value }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Entrance Ticket Discount Tab -->
      <div
        v-show="activeTab === 'entrance'"
        class="transition-all duration-300 ease-in-out"
      >
        <div
          class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
        >
          <!-- Card Header -->
          <div
            class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center"
          >
            <h2 class="text-sm font-semibold text-gray-900">
              Entrance Ticket Discount Settings
            </h2>
            <button
              @click="loadDiscount('entrance')"
              :disabled="discountStore.loading"
              class="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <i class="fas fa-sync-alt mr-2"></i>
              Refresh
            </button>
          </div>

          <!-- Card Body -->
          <div class="p-4">
            <!-- Form -->
            <form @submit.prevent="handleSubmit('entrance')" class="mb-8">
              <div class="space-y-6">
                <div>
                  <label
                    for="entranceDiscount"
                    class="block text-xs font-medium text-gray-700 mb-2"
                  >
                    Discount Percentage
                    <span class="text-red-500 ml-1">*</span>
                  </label>
                  <div class="relative">
                    <input
                      id="entranceDiscount"
                      v-model.number="discounts.entrance.form.meta_value"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      :class="[
                        'block w-full pr-12 sm:text-sm rounded-lg border px-4 py-3 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200',
                        discounts.entrance.errors.meta_value
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : '',
                      ]"
                      placeholder="Enter discount percentage"
                      required
                    />
                    <div
                      class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                    >
                      <span class="text-gray-500 text-sm font-medium">%</span>
                    </div>
                  </div>
                  <p
                    v-if="discounts.entrance.errors.meta_value"
                    class="mt-2 text-sm text-red-600"
                  >
                    {{ discounts.entrance.errors.meta_value }}
                  </p>
                </div>

                <!-- Form Actions -->
                <div class="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    :disabled="
                      discountStore.loading || !isFormValid('entrance')
                    "
                    class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-xs font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    <i class="fas fa-save mr-2"></i>
                    {{ discounts.entrance.data ? "Update" : "Save" }} Entrance
                    Discount
                  </button>

                  <button
                    v-if="discounts.entrance.data"
                    type="button"
                    @click="handleDelete('entrance')"
                    :disabled="discountStore.loading"
                    class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-xs font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    <i class="fas fa-trash mr-2"></i>
                    Delete
                  </button>
                </div>
              </div>
            </form>

            <!-- Current Entrance Discount Display -->
            <div
              v-if="discounts.entrance.data"
              class="bg-green-50 rounded-xl p-4 border border-green-200"
            >
              <h3 class="text-xs font-semibold text-gray-900 mb-4">
                Current Entrance Ticket Discount
              </h3>
              <div
                class="flex flex-col lg:flex-row lg:items-center lg:space-x-8"
              >
                <div class="mb-4 lg:mb-0">
                  <div class="text-5xl font-bold text-green-600">
                    0.{{ discounts.entrance.data.meta_value }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vantour Discount Tab -->
      <div
        v-show="activeTab === 'vantour'"
        class="transition-all duration-300 ease-in-out"
      >
        <div
          class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
        >
          <!-- Card Header -->
          <div
            class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center"
          >
            <h2 class="text-sm font-semibold text-gray-900">
              Vantour Discount Settings
            </h2>
            <button
              @click="loadDiscount('vantour')"
              :disabled="discountStore.loading"
              class="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <i class="fas fa-sync-alt mr-2"></i>
              Refresh
            </button>
          </div>

          <!-- Card Body -->
          <div class="p-4">
            <!-- Form -->
            <form @submit.prevent="handleSubmit('vantour')" class="mb-8">
              <div class="space-y-6">
                <div>
                  <label
                    for="vantourDiscount"
                    class="block text-xs font-medium text-gray-700 mb-2"
                  >
                    Discount Percentage
                    <span class="text-red-500 ml-1">*</span>
                  </label>
                  <div class="relative">
                    <input
                      id="vantourDiscount"
                      v-model.number="discounts.vantour.form.meta_value"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      :class="[
                        'block w-full pr-12 sm:text-sm rounded-lg border px-4 py-3 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200',
                        discounts.vantour.errors.meta_value
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : '',
                      ]"
                      placeholder="Enter discount percentage"
                      required
                    />
                    <div
                      class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                    >
                      <span class="text-gray-500 text-sm font-medium">%</span>
                    </div>
                  </div>
                  <p
                    v-if="discounts.vantour.errors.meta_value"
                    class="mt-2 text-sm text-red-600"
                  >
                    {{ discounts.vantour.errors.meta_value }}
                  </p>
                </div>

                <!-- Form Actions -->
                <div class="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    :disabled="discountStore.loading || !isFormValid('vantour')"
                    class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-xs font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    <i class="fas fa-save mr-2"></i>
                    {{ discounts.vantour.data ? "Update" : "Save" }} Vantour
                    Discount
                  </button>

                  <button
                    v-if="discounts.vantour.data"
                    type="button"
                    @click="handleDelete('vantour')"
                    :disabled="discountStore.loading"
                    class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-xs font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    <i class="fas fa-trash mr-2"></i>
                    Delete
                  </button>
                </div>
              </div>
            </form>

            <!-- Current Vantour Discount Display -->
            <div
              v-if="discounts.vantour.data"
              class="bg-purple-50 rounded-xl p-4 border border-purple-200"
            >
              <h3 class="text-xs font-semibold text-gray-900 mb-4">
                Current Vantour Discount
              </h3>
              <div
                class="flex flex-col lg:flex-row lg:items-center lg:space-x-8"
              >
                <div class="mb-4 lg:mb-0">
                  <div class="text-5xl font-bold text-purple-600">
                    0.{{ discounts.vantour.data.meta_value }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="transform opacity-0 translate-x-full"
      enter-to-class="transform opacity-100 translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="transform opacity-100 translate-x-0"
      leave-to-class="transform opacity-0 translate-x-full"
    >
      <div
        v-if="notification.show"
        :class="[
          'fixed top-4 right-4 max-w-sm w-full shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 z-50',
          {
            'bg-green-600': notification.type === 'success',
            'bg-red-600': notification.type === 'error',
            'bg-yellow-600': notification.type === 'warning',
            'bg-blue-600': notification.type === 'info',
          },
        ]"
      >
        <div class="flex-1 w-0 p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <i :class="[getNotificationIcon(), 'text-white text-xl']"></i>
            </div>
            <div class="ml-3 flex-1">
              <p class="text-sm font-medium text-white">
                {{ notification.message }}
              </p>
            </div>
          </div>
        </div>
        <div class="flex border-l border-gray-200">
          <button
            @click="hideNotification"
            class="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-white hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useDiscountStore } from "@/stores/discount";

// Store
const discountStore = useDiscountStore();

// Active tab
const activeTab = ref("hotel");

// Discount types configuration
const discountTypes = {
  hotel: {
    name: "Hotel",
    loadMethod: "getDiscountHotel",
    storeMethod: "storeDiscountHotel",
    updateMethod: "updateDiscountHotel",
    deleteMethod: "deleteDiscountHotel",
  },
  entrance: {
    name: "Entrance",
    loadMethod: "getDiscountEntrance",
    storeMethod: "storeDiscountEntrance",
    updateMethod: "updateDiscountEntrance",
    deleteMethod: "deleteDiscountEntrance",
  },
  vantour: {
    name: "Vantour",
    loadMethod: "getDiscountVantour",
    storeMethod: "storeDiscountVantour",
    updateMethod: "updateDiscountVantour",
    deleteMethod: "deleteDiscountVantour",
  },
};

// Centralized discount state
const discounts = reactive({
  hotel: {
    data: null,
    form: { meta_value: null },
    errors: { meta_value: null },
  },
  entrance: {
    data: null,
    form: { meta_value: null },
    errors: { meta_value: null },
  },
  vantour: {
    data: null,
    form: { meta_value: null },
    errors: { meta_value: null },
  },
});

// Notification system
const notification = reactive({
  show: false,
  type: "success",
  message: "",
});

// Tab configuration
const tabs = [
  { id: "hotel", label: "Hotel Discount", icon: "fas fa-hotel" },
  { id: "entrance", label: "Entrance Tickets", icon: "fas fa-ticket-alt" },
  { id: "vantour", label: "Vantour", icon: "fas fa-car-side" },
];

// Computed: Form validation
const isFormValid = (type) => {
  return computed(() => {
    const form = discounts[type].form;
    const errors = discounts[type].errors;
    return (
      form.meta_value !== null &&
      form.meta_value >= 0 &&
      form.meta_value <= 100 &&
      !errors.meta_value
    );
  });
};

// Notification methods
const showNotification = (message, type = "success") => {
  notification.message = message;
  notification.type = type;
  notification.show = true;
  setTimeout(() => hideNotification(), 5000);
};

const hideNotification = () => {
  notification.show = false;
};

const getNotificationIcon = () => {
  const icons = {
    success: "fas fa-check-circle",
    error: "fas fa-exclamation-circle",
    warning: "fas fa-exclamation-triangle",
    info: "fas fa-info-circle",
  };
  return icons[notification.type] || icons.info;
};

// Form validation
const validateForm = (type) => {
  const discount = discounts[type];
  discount.errors.meta_value = null;

  if (discount.form.meta_value === null || discount.form.meta_value === "") {
    discount.errors.meta_value = "Discount percentage is required";
    return false;
  }

  if (discount.form.meta_value < 0 || discount.form.meta_value > 100) {
    discount.errors.meta_value = "Discount must be between 0 and 100";
    return false;
  }

  return true;
};

// Load discount
const loadDiscount = async (type) => {
  try {
    const config = discountTypes[type];
    const response = await discountStore[config.loadMethod]();

    discounts[type].data = response;
    if (response) {
      discounts[type].form.meta_value = response.meta_value;
    }
  } catch (error) {
    console.error(`Failed to load ${type} discount:`, error);

    let errorMessage = `Failed to load ${discountTypes[
      type
    ].name.toLowerCase()} discount`;
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    showNotification(errorMessage, "error");
  }
};

// Handle form submit
const handleSubmit = async (type) => {
  if (!validateForm(type)) return;

  try {
    const config = discountTypes[type];
    const discount = discounts[type];
    let response;
    let successMessage = "";

    if (discount.data) {
      response = await discountStore[config.updateMethod](
        discount.data.id,
        discount.form
      );
      successMessage = `${config.name} discount updated successfully`;
    } else {
      response = await discountStore[config.storeMethod](discount.form);
      successMessage = `${config.name} discount saved successfully`;
    }

    if (response) {
      discount.data = response;
      showNotification(successMessage, "success");
    }
  } catch (error) {
    console.error(`Failed to save ${type} discount:`, error);

    if (error.response?.status === 422 && error.response?.data?.errors) {
      const errors = error.response.data.errors;
      if (errors.meta_value) {
        discounts[type].errors.meta_value = errors.meta_value[0];
      }
      showNotification("Please check the form for errors", "error");
    } else {
      let errorMessage = `Failed to save ${discountTypes[
        type
      ].name.toLowerCase()} discount`;
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      showNotification(errorMessage, "error");
    }
  }
};

// Handle delete
const handleDelete = async (type) => {
  const config = discountTypes[type];
  if (
    !confirm(
      `Are you sure you want to delete the ${config.name.toLowerCase()} discount?`
    )
  ) {
    return;
  }

  try {
    const discount = discounts[type];
    await discountStore[config.deleteMethod](discount.data.id);

    discount.data = null;
    discount.form.meta_value = null;

    showNotification(`${config.name} discount deleted successfully`, "success");
  } catch (error) {
    console.error(`Failed to delete ${type} discount:`, error);

    let errorMessage = `Failed to delete ${config.name.toLowerCase()} discount`;
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    showNotification(errorMessage, "error");
  }
};

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadDiscount("hotel"),
    loadDiscount("entrance"),
    loadDiscount("vantour"),
  ]);
});
</script>
