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
              @click="loadHotelDiscount"
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
            <form @submit.prevent="handleHotelSubmit" class="mb-8">
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
                      v-model.number="hotelForm.meta_value"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      :class="[
                        'block w-full pr-12 sm:text-sm rounded-lg border px-4 py-3 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200',
                        hotelErrors.meta_value
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
                    v-if="hotelErrors.meta_value"
                    class="mt-2 text-sm text-red-600"
                  >
                    {{ hotelErrors.meta_value }}
                  </p>
                </div>

                <!-- Form Actions -->
                <div class="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    :disabled="discountStore.loading || !isHotelFormValid"
                    class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-xs font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    <i class="fas fa-save mr-2"></i>
                    {{ hotelDiscount ? "Update" : "Save" }} Hotel Discount
                  </button>

                  <button
                    v-if="hotelDiscount"
                    type="button"
                    @click="deleteHotelDiscount"
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
              v-if="hotelDiscount"
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
                    0.{{ hotelDiscount.meta_value }}%
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
              @click="loadEntranceDiscount"
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
            <form @submit.prevent="handleEntranceSubmit" class="mb-8">
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
                      v-model.number="entranceForm.meta_value"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      :class="[
                        'block w-full pr-12 sm:text-sm rounded-lg border px-4 py-3 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200',
                        entranceErrors.meta_value
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
                    v-if="entranceErrors.meta_value"
                    class="mt-2 text-sm text-red-600"
                  >
                    {{ entranceErrors.meta_value }}
                  </p>
                </div>

                <!-- Form Actions -->
                <div class="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    :disabled="discountStore.loading || !isEntranceFormValid"
                    class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-xs font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    <i class="fas fa-save mr-2"></i>
                    {{ entranceDiscount ? "Update" : "Save" }} Entrance Discount
                  </button>

                  <button
                    v-if="entranceDiscount"
                    type="button"
                    @click="deleteEntranceDiscount"
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
              v-if="entranceDiscount"
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
                    0.{{ entranceDiscount.meta_value }}%
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
import { useDiscountStore } from "@/stores/discount"; // Adjust path as needed

// Store
const discountStore = useDiscountStore();

// Reactive data
const activeTab = ref("hotel");
const hotelDiscount = ref(null);
const entranceDiscount = ref(null);

// Form data
const hotelForm = reactive({
  meta_value: null,
});

const entranceForm = reactive({
  meta_value: null,
});

// Form errors
const hotelErrors = reactive({
  meta_value: null,
});

const entranceErrors = reactive({
  meta_value: null,
});

// Notification system
const notification = reactive({
  show: false,
  type: "success", // success, error, warning, info
  message: "",
});

// Tab configuration
const tabs = [
  {
    id: "hotel",
    label: "Hotel Discount",
    icon: "fas fa-hotel",
  },
  {
    id: "entrance",
    label: "Entrance Tickets",
    icon: "fas fa-ticket-alt",
  },
];

// Computed properties
const isHotelFormValid = computed(() => {
  return (
    hotelForm.meta_value !== null &&
    hotelForm.meta_value >= 0 &&
    hotelForm.meta_value <= 100 &&
    !hotelErrors.meta_value
  );
});

const isEntranceFormValid = computed(() => {
  return (
    entranceForm.meta_value !== null &&
    entranceForm.meta_value >= 0 &&
    entranceForm.meta_value <= 100 &&
    !entranceErrors.meta_value
  );
});

// Methods
const showNotification = (message, type = "success") => {
  notification.message = message;
  notification.type = type;
  notification.show = true;

  // Auto hide after 5 seconds
  setTimeout(() => {
    hideNotification();
  }, 5000);
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

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString();
};

const validateHotelForm = () => {
  hotelErrors.meta_value = null;

  if (hotelForm.meta_value === null || hotelForm.meta_value === "") {
    hotelErrors.meta_value = "Discount percentage is required";
    return false;
  }

  if (hotelForm.meta_value < 0 || hotelForm.meta_value > 100) {
    hotelErrors.meta_value = "Discount must be between 0 and 100";
    return false;
  }

  return true;
};

const validateEntranceForm = () => {
  entranceErrors.meta_value = null;

  if (entranceForm.meta_value === null || entranceForm.meta_value === "") {
    entranceErrors.meta_value = "Discount percentage is required";
    return false;
  }

  if (entranceForm.meta_value < 0 || entranceForm.meta_value > 100) {
    entranceErrors.meta_value = "Discount must be between 0 and 100";
    return false;
  }

  return true;
};

// Hotel discount methods
const loadHotelDiscount = async () => {
  try {
    const response = await discountStore.getDiscountHotel();
    hotelDiscount.value = response;
    if (response) {
      hotelForm.meta_value = response.meta_value;
    }
  } catch (error) {
    console.error("Failed to load hotel discount:", error);

    // Handle API error response
    let errorMessage = "Failed to load hotel discount";
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    showNotification(errorMessage, "error");
  }
};

const handleHotelSubmit = async () => {
  if (!validateHotelForm()) return;

  try {
    let response;
    let successMessage = "";

    if (hotelDiscount.value) {
      response = await discountStore.updateDiscountHotel(
        hotelDiscount.value.id,
        hotelForm
      );
      successMessage = "Hotel discount updated successfully";
    } else {
      response = await discountStore.storeDiscountHotel(hotelForm);
      successMessage = "Hotel discount saved successfully";
    }

    if (response) {
      hotelDiscount.value = response;
      showNotification(successMessage, "success");
    }
  } catch (error) {
    console.error("Failed to save hotel discount:", error);

    // Handle validation errors
    if (
      error.response &&
      error.response.status === 422 &&
      error.response.data.errors
    ) {
      const errors = error.response.data.errors;
      if (errors.meta_value) {
        hotelErrors.meta_value = errors.meta_value[0];
      }
      showNotification("Please check the form for errors", "error");
    } else {
      let errorMessage = "Failed to save hotel discount";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      showNotification(errorMessage, "error");
    }
  }
};

const deleteHotelDiscount = async () => {
  if (!confirm("Are you sure you want to delete the hotel discount?")) return;

  try {
    await discountStore.deleteDiscountHotel(hotelDiscount.value.id);
    hotelDiscount.value = null;
    hotelForm.meta_value = null;
    showNotification("Hotel discount deleted successfully", "success");
  } catch (error) {
    console.error("Failed to delete hotel discount:", error);

    let errorMessage = "Failed to delete hotel discount";
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    showNotification(errorMessage, "error");
  }
};

// Entrance discount methods
const loadEntranceDiscount = async () => {
  try {
    const response = await discountStore.getDiscountEntrance();
    entranceDiscount.value = response;
    if (response) {
      entranceForm.meta_value = response.meta_value;
    }
  } catch (error) {
    console.error("Failed to load entrance discount:", error);

    let errorMessage = "Failed to load entrance discount";
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    showNotification(errorMessage, "error");
  }
};

const handleEntranceSubmit = async () => {
  if (!validateEntranceForm()) return;

  try {
    let response;
    let successMessage = "";

    if (entranceDiscount.value) {
      response = await discountStore.updateDiscountEntrance(
        entranceDiscount.value.id,
        entranceForm
      );
      successMessage = "Entrance discount updated successfully";
    } else {
      response = await discountStore.storeDiscountEntrance(entranceForm);
      successMessage = "Entrance discount saved successfully";
    }

    if (response) {
      entranceDiscount.value = response;
      showNotification(successMessage, "success");
    }
  } catch (error) {
    console.error("Failed to save entrance discount:", error);

    // Handle validation errors
    if (
      error.response &&
      error.response.status === 422 &&
      error.response.data.errors
    ) {
      const errors = error.response.data.errors;
      if (errors.meta_value) {
        entranceErrors.meta_value = errors.meta_value[0];
      }
      showNotification("Please check the form for errors", "error");
    } else {
      let errorMessage = "Failed to save entrance discount";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      showNotification(errorMessage, "error");
    }
  }
};

const deleteEntranceDiscount = async () => {
  if (!confirm("Are you sure you want to delete the entrance discount?"))
    return;

  try {
    await discountStore.deleteDiscountEntrance(entranceDiscount.value.id);
    entranceDiscount.value = null;
    entranceForm.meta_value = null;
    showNotification("Entrance discount deleted successfully", "success");
  } catch (error) {
    console.error("Failed to delete entrance discount:", error);

    let errorMessage = "Failed to delete entrance discount";
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    showNotification(errorMessage, "error");
  }
};

// Lifecycle
onMounted(async () => {
  await loadHotelDiscount();
  await loadEntranceDiscount();
});
</script>
