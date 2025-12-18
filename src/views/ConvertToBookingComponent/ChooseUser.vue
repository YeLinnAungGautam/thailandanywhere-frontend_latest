<template>
  <div class="h-full bg-white">
    <div class="w-full">
      <!-- Tab Selection -->
      <div class="mb-6">
        <div class="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            @click="activeTab = 'new'"
            :class="[
              'flex-1 px-4 py-2.5 text-xs font-medium rounded-lg transition-all duration-200',
              activeTab === 'new'
                ? 'bg-white text-[#FF613c] shadow-sm'
                : 'text-gray-600 hover:text-gray-900',
            ]"
          >
            New Customer
          </button>
          <button
            @click="activeTab = 'existing'"
            :class="[
              'flex-1 px-4 py-2.5 text-xs font-medium rounded-lg transition-all duration-200',
              activeTab === 'existing'
                ? 'bg-white text-[#FF613c] shadow-sm'
                : 'text-gray-600 hover:text-gray-900',
            ]"
          >
            {{ selectedRows.filter((u) => u.customer_name).length }} Availabily
            Customers
          </button>
        </div>
      </div>

      <!-- New Customer Form -->
      <div v-if="activeTab === 'new'" class="space-y-6">
        <div class="text-start mb-6">
          <h1 class="text-lg font-semibold text-gray-800 mb-1">
            New Customer Information
          </h1>
          <p class="text-gray-600 text-xs">
            Fill in the details for the new customer
          </p>
        </div>

        <!-- Form Fields -->
        <div class="space-y-4">
          <!-- Customer Name -->
          <div>
            <label
              for="customer_name"
              class="block text-xs font-medium text-gray-700 mb-2"
            >
              Customer Name <span class="text-red-500">*</span>
            </label>
            <input
              id="customer_name"
              v-model="customerData.name"
              type="text"
              placeholder="Enter customer name"
              class="w-full px-4 py-2.5 text-xs focus:outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF613c] focus:border-transparent transition-all"
            />
          </div>

          <!-- Phone Number -->
          <div>
            <label
              for="customer_phone"
              class="block text-xs font-medium text-gray-700 mb-2"
            >
              Phone Number <span class="text-red-500">*</span>
            </label>
            <input
              id="customer_phone"
              v-model="customerData.phone"
              type="tel"
              placeholder="Enter phone number"
              class="w-full px-4 py-2.5 text-xs focus:outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF613c] focus:border-transparent transition-all"
            />
          </div>

          <!-- Sold From -->
          <div>
            <label
              for="sold_from"
              class="block text-xs font-medium text-gray-700 mb-2"
            >
              Sold From <span class="text-red-500">*</span>
            </label>

            <v-select
              :style="{ fontSize: '11px !important' }"
              v-model="customerData.soldFrom"
              class="style-chooser text-xs"
              :options="soldFrom"
              label="name"
              :clearable="false"
              :reduce="(d) => d.name"
              placeholder=""
            ></v-select>
          </div>
        </div>

        <!-- Confirm Button -->
        <div class="pt-4">
          <button
            @click="confirmCustomer"
            :disabled="!isFormValid"
            :class="[
              'w-full px-6 py-3 rounded-lg text-xs font-medium transition-all shadow-lg',
              isFormValid
                ? 'bg-[#ff613c] text-white hover:bg-[#e5562f] cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed',
            ]"
          >
            Confirm New Customer
          </button>
        </div>
      </div>

      <!-- Existing Customer Selection -->
      <div v-else class="space-y-6">
        <div class="flex justify-between items-center mb-6">
          <!-- Header -->
          <div class="text-start">
            <p class="text-gray-600 text-xs pb-1">
              {{ selectedRows.length }} customer{{
                selectedRows.length !== 1 ? "s" : ""
              }}
              available
              <span v-if="chosenUser" class="text-[#FF613c] font-semibold">
                · 1 selected
              </span>
            </p>
            <h1 class="text-lg font-semibold text-gray-800">
              Select existing customer
            </h1>
          </div>
        </div>

        <!-- User Cards Grid -->
        <div class="space-y-4">
          <div
            v-for="user in selectedRows?.filter((u) => u.customer_name)"
            :key="user.id"
            :class="[
              'bg-white rounded-xl shadow transition-all duration-300 p-6 cursor-pointer',
              chosenUser?.id === user.id
                ? 'ring-2 ring-[#FF613c] bg-[#fff8f2]'
                : 'border border-gray-200 hover:border-[#FF613c]/30',
            ]"
          >
            <!-- User Info (Always Visible) -->
            <div @click="chooseUser(user)" class="flex items-start gap-4 mb-4">
              <div class="flex-shrink-0 relative">
                <div
                  :class="[
                    'w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md',
                    chosenUser?.id === user.id
                      ? 'bg-gradient-to-br from-[#FF613c] to-red-600'
                      : 'bg-gradient-to-br from-gray-400 to-gray-500',
                  ]"
                >
                  {{ user.customer_name?.charAt(0).toUpperCase() || "U" }}
                </div>

                <!-- Selected Checkmark -->
                <div
                  v-if="chosenUser?.id === user.id"
                  class="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <svg
                    class="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              <!-- User Info -->
              <div class="flex-1 min-w-0">
                <h3
                  :class="[
                    'text-lg font-semibold mb-2 truncate',
                    chosenUser?.id === user.id
                      ? 'text-[#FF613c]'
                      : 'text-gray-800',
                  ]"
                >
                  {{ user.customer_name || "Unknown Customer" }}
                </h3>

                <div
                  v-if="user.customer_phnumber"
                  class="flex items-center gap-2 text-gray-600"
                >
                  <svg
                    class="w-5 h-5 text-[#FF613c]"
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
                  <span class="text-sm">{{ user.customer_phnumber }}</span>
                </div>

                <!-- No Phone Warning -->
                <div
                  v-else
                  class="flex items-center gap-2 text-orange-600 mt-1"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span class="text-sm font-medium">Phone number required</span>
                </div>

                <!-- Status Badge -->
                <div class="mt-3">
                  <span
                    :class="[
                      'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                      chosenUser?.id === user.id
                        ? 'bg-[#FF613c] text-white'
                        : user.status === 'available'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800',
                    ]"
                  >
                    {{
                      chosenUser?.id === user.id
                        ? "Selected"
                        : user.status || "Available"
                    }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Additional Info Form (Show when selected and phone is missing) -->
            <div
              v-if="chosenUser?.id === user.id && !user.customer_phnumber"
              class="mt-4 pt-4 border-t border-gray-200 space-y-4"
            >
              <!-- Phone Number Input -->
              <div>
                <label
                  :for="`phone_${user.id}`"
                  class="block text-xs font-medium text-gray-700 mb-2"
                >
                  Phone Number <span class="text-red-500">*</span>
                </label>
                <input
                  :id="`phone_${user.id}`"
                  v-model="customerData.phone"
                  type="tel"
                  placeholder="Enter phone number"
                  class="w-full px-4 py-2.5 text-xs focus:outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF613c] focus:border-transparent transition-all"
                />
              </div>

              <!-- Sold From Select -->
              <div>
                <label
                  :for="`sold_from_${user.id}`"
                  class="block text-xs font-medium text-gray-700 mb-2"
                >
                  Sold From <span class="text-red-500">*</span>
                </label>

                <v-select
                  :style="{ fontSize: '11px !important' }"
                  v-model="customerData.soldFrom"
                  class="style-chooser text-xs"
                  :options="soldFrom"
                  label="name"
                  :clearable="false"
                  :reduce="(d) => d.name"
                  placeholder=""
                ></v-select>
              </div>
            </div>

            <!-- Sold From for users with phone -->
            <div
              v-if="chosenUser?.id === user.id && user.customer_phnumber"
              class="mt-4 pt-4 border-t border-gray-200 space-y-4"
            >
              <div>
                <label
                  :for="`sold_from_${user.id}`"
                  class="block text-xs font-medium text-gray-700 mb-2"
                >
                  Sold From <span class="text-red-500">*</span>
                </label>
                <v-select
                  :style="{ fontSize: '11px !important' }"
                  v-model="customerData.soldFrom"
                  class="style-chooser text-xs"
                  :options="soldFrom"
                  label="name"
                  :clearable="false"
                  :reduce="(d) => d.name"
                  placeholder=""
                ></v-select>
              </div>
            </div>
          </div>
        </div>

        <!-- Confirm Button for Existing Customer -->
        <div v-if="chosenUser" class="pt-4">
          <button
            @click="confirmCustomer"
            :disabled="!isFormValid"
            :class="[
              'w-full px-6 py-3 rounded-lg text-xs font-medium transition-all shadow-lg',
              isFormValid
                ? 'bg-[#ff613c] text-white hover:bg-[#e5562f] cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed',
            ]"
          >
            Confirm Selected Customer
          </button>
        </div>

        <!-- Empty State -->
        <div
          v-if="selectedRows.length === 0"
          class="text-center py-16 bg-gray-50 rounded-xl"
        >
          <div
            class="inline-flex items-center justify-center w-24 h-24 bg-gray-200 rounded-full mb-4"
          >
            <svg
              class="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-700 mb-2">
            No Customers Available
          </h3>
          <p class="text-gray-500">
            There are no existing customers to choose from
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  confirmUser: Function,
  selectedRows: Array,
});

const activeTab = ref("new");
const chosenUser = ref(null);

const emit = defineEmits(["confirm-user"]);

// Unified Customer Data (shared between new and existing)
const customerData = ref({
  name: "",
  phone: "",
  soldFrom: "",
});

// Watch for tab changes and reset form
watch(activeTab, () => {
  resetForm();
});

// Validation
const isFormValid = computed(() => {
  return (
    customerData.value.name.trim() !== "" &&
    customerData.value.phone.trim() !== "" &&
    customerData.value.soldFrom !== ""
  );
});

const chooseUser = (user) => {
  chosenUser.value = user;
  // Auto-fill data from selected user
  customerData.value.name = user.customer_name || "";
  customerData.value.phone = user.customer_phnumber || "";
  customerData.value.soldFrom = ""; // Reset sold from, user must select
};

const resetForm = () => {
  chosenUser.value = null;
  customerData.value = {
    name: "",
    phone: "",
    soldFrom: "",
  };
};

const soldFrom = [
  { id: "1", name: "Facebook" },
  { id: "2", name: "Twitter" },
  { id: "3", name: "Instagram" },
  { id: "4", name: "Twitter" },
  { id: "5", name: "Viber" },
  { id: "6", name: "Phone" },
  { id: "7", name: "Office" },
];

const confirmCustomer = () => {
  console.log("this is confirm");

  if (isFormValid.value && props.confirmUser) {
    const data = {
      type: activeTab.value,
      name: customerData.value.name,
      phone: customerData.value.phone,
      soldFrom: customerData.value.soldFrom,
    };

    if (activeTab.value === "existing") {
      data.user = chosenUser.value;
    }

    props.confirmUser(data);
    // emit("confirm-user", data);
  }
};
</script>

<style scoped>
/* Custom scrollbar for the container */
.space-y-4::-webkit-scrollbar {
  width: 6px;
}

.space-y-4::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.space-y-4::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.space-y-4::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
