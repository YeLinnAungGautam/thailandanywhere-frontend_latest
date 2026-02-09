<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20"
      >
        <!-- Background -->
        <div
          class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
          @click="handleClose"
        ></div>

        <!-- Modal -->
        <div
          class="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all"
        >
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-gray-900">
                {{ isEditing ? "Edit Period" : "Add New Period" }}
              </h3>
              <button
                @click="handleClose"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i class="fa-solid fa-times text-xl"></i>
              </button>
            </div>
          </div>

          <!-- Body -->
          <div class="p-6">
            <form @submit.prevent="handleSave" class="space-y-4">
              <!-- Period Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Period Name <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="localPeriod.period_name"
                  type="text"
                  placeholder="e.g., High Season, Low Season"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <!-- Date Range -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Start Date <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="localPeriod.start_date"
                    type="date"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    End Date <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="localPeriod.end_date"
                    type="date"
                    :min="localPeriod.start_date"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <!-- Pricing -->
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Cost Price
                  </label>
                  <input
                    v-model.number="localPeriod.cost_price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <div class="flex justify-between items-center mb-2">
                    <label class="block text-sm font-medium text-gray-700">
                      Sale Price <span class="text-red-500">*</span>
                    </label>
                    <span
                      v-if="localPeriod.cost_price"
                      class="text-xs text-blue-600 font-medium"
                    >
                      Suggest: {{ suggestPrice(localPeriod.cost_price) }}
                    </span>
                  </div>
                  <input
                    v-model.number="localPeriod.sale_price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Agent Price
                  </label>
                  <input
                    v-model.number="localPeriod.agent_price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <!-- Summary -->
              <div
                v-if="isPeriodValid"
                class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <div class="flex items-start gap-2">
                  <i class="fa-solid fa-circle-check text-green-600 mt-0.5"></i>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-green-900">
                      Period Valid
                    </p>
                    <p class="text-xs text-green-700 mt-1">
                      {{ localPeriod.period_name }}:
                      {{ formatDateShort(localPeriod.start_date) }} -
                      {{ formatDateShort(localPeriod.end_date) }} | Sale: THB
                      {{ formatPrice(localPeriod.sale_price) }}
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <!-- Footer -->
          <div
            class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3"
          >
            <button
              @click="handleClose"
              type="button"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleSave"
              type="button"
              :disabled="!isPeriodValid"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fa-solid fa-check mr-2"></i>
              {{ isEditing ? "Update" : "Add" }} Period
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  isOpen: Boolean,
  period: Object,
  isEditing: Boolean,
});

const emit = defineEmits(["close", "save"]);

// Local state
const localPeriod = ref({
  period_name: "",
  start_date: "",
  end_date: "",
  sale_price: null,
  cost_price: null,
  agent_price: null,
});

// Watch for period changes
watch(
  () => props.period,
  (newPeriod) => {
    if (newPeriod) {
      localPeriod.value = { ...newPeriod };
    }
  },
  { immediate: true, deep: true },
);

// Computed
const isPeriodValid = computed(() => {
  return (
    localPeriod.value.period_name &&
    localPeriod.value.start_date &&
    localPeriod.value.end_date &&
    localPeriod.value.sale_price > 0
  );
});

// Methods
const suggestPrice = (cost) => {
  if (!cost) return "0";
  let amount = cost / 0.85;
  let lastTwoDigits = amount % 100;
  if (lastTwoDigits > 50) {
    return Math.ceil(amount / 100) * 100;
  } else {
    return Math.round(amount / 50) * 50;
  }
};

const formatPrice = (price) => {
  if (!price) return "0";
  return Number(price).toLocaleString();
};

const formatDateShort = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};

const handleClose = () => {
  emit("close");
};

const handleSave = () => {
  if (isPeriodValid.value) {
    emit("save", localPeriod.value);
  }
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
