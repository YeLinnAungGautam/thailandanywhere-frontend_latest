<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20"
      >
        <!-- Background -->
        <div
          class="fixed inset-0 bg-gray-900 bg-opacity-75"
          @click="handleClose"
        ></div>

        <!-- Modal -->
        <div
          class="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        >
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <div class="flex items-center justify-between">
              <div>
                <h3
                  class="text-xl font-bold text-gray-900 flex items-center gap-2"
                >
                  <span>📅</span>
                  <span>Manage Pricing Periods</span>
                </h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ roomName || "Room" }} - Configure seasonal pricing
                </p>
              </div>
              <button
                @click="handleClose"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon class="w-6 h-6" />
              </button>
            </div>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto p-6">
            <!-- Step Indicator -->
            <div class="mb-6 flex items-center justify-center gap-2">
              <div
                v-for="(period, index) in localPeriods"
                :key="index"
                class="flex items-center"
              >
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors"
                  :class="
                    currentStep === index
                      ? 'bg-blue-600 text-white'
                      : index < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  "
                >
                  <i v-if="index < currentStep" class="fa-solid fa-check"></i>
                  <span v-else>{{ index + 1 }}</span>
                </div>
                <div
                  v-if="index < localPeriods.length - 1"
                  class="w-12 h-1 mx-2"
                  :class="index < currentStep ? 'bg-green-500' : 'bg-gray-200'"
                ></div>
              </div>

              <!-- Add New Period Button -->
              <button
                v-if="localPeriods.length < 10"
                @click="addNewPeriod"
                class="ml-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 transition-colors flex items-center justify-center"
                title="Add another period"
              >
                <i class="fa-solid fa-plus text-sm"></i>
              </button>
            </div>

            <!-- Current Period Form -->
            <div v-if="localPeriods.length > 0" class="space-y-6">
              <div
                class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200"
              >
                <div class="flex items-center justify-between mb-4">
                  <h4
                    class="text-lg font-bold text-gray-900 flex items-center gap-2"
                  >
                    <span>Period {{ currentStep + 1 }}</span>
                    <span class="text-sm font-normal text-gray-600">
                      ({{ currentStep + 1 }} of {{ localPeriods.length }})
                    </span>
                  </h4>
                  <button
                    v-if="localPeriods.length > 1"
                    @click="removeCurrentPeriod"
                    class="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    <i class="fa-solid fa-trash mr-1"></i>
                    Remove
                  </button>
                </div>

                <div class="space-y-4">
                  <!-- Period Name -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Period Name <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="currentPeriod.period_name"
                      type="text"
                      placeholder="e.g., High Season, Low Season"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <!-- Date Range -->
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Start Date <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="currentPeriod.start_date"
                        type="date"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 mb-2"
                      >
                        End Date <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="currentPeriod.end_date"
                        type="date"
                        :min="currentPeriod.start_date"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <!-- Pricing -->
                  <div class="grid grid-cols-3 gap-4">
                    <div>
                      <div class="flex justify-between items-center mb-2">
                        <label class="block text-sm font-medium text-gray-700">
                          Cost Price
                        </label>
                      </div>
                      <input
                        v-model.number="currentPeriod.cost_price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <div class="flex justify-between items-center mb-2">
                        <label class="block text-sm font-medium text-gray-700">
                          Sale Price <span class="text-red-500">*</span>
                        </label>
                        <span
                          v-if="currentPeriod.cost_price"
                          class="text-xs text-red-600"
                        >
                          Suggest: {{ suggestPrice(currentPeriod.cost_price) }}
                        </span>
                      </div>
                      <input
                        v-model.number="currentPeriod.sale_price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Agent Price
                      </label>
                      <input
                        v-model.number="currentPeriod.agent_price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <!-- Period Summary -->
                  <div
                    v-if="isPeriodValid(currentPeriod)"
                    class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div class="flex items-start gap-2">
                      <i
                        class="fa-solid fa-circle-check text-green-600 mt-1"
                      ></i>
                      <div class="flex-1">
                        <p class="text-sm font-medium text-green-900">
                          Period Configuration Complete
                        </p>
                        <p class="text-xs text-green-700 mt-1">
                          {{ currentPeriod.period_name }}:
                          {{ formatDateShort(currentPeriod.start_date) }} -
                          {{ formatDateShort(currentPeriod.end_date) }} | Sale:
                          THB {{ formatPrice(currentPeriod.sale_price) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Period List Summary -->
              <div v-if="localPeriods.length > 1" class="mt-6">
                <h5 class="text-sm font-semibold text-gray-700 mb-3">
                  All Configured Periods:
                </h5>
                <div class="space-y-2">
                  <div
                    v-for="(period, index) in localPeriods"
                    :key="index"
                    @click="currentStep = index"
                    class="p-3 rounded-lg border-2 cursor-pointer transition-all"
                    :class="
                      currentStep === index
                        ? 'border-blue-500 bg-blue-50'
                        : isPeriodValid(period)
                        ? 'border-green-200 bg-green-50 hover:border-green-300'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    "
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div
                          class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                          :class="
                            isPeriodValid(period)
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-300 text-gray-600'
                          "
                        >
                          {{ index + 1 }}
                        </div>
                        <div>
                          <p class="font-medium text-sm text-gray-900">
                            {{ period.period_name || `Period ${index + 1}` }}
                          </p>
                          <p class="text-xs text-gray-600">
                            {{ formatDateShort(period.start_date) }} -
                            {{ formatDateShort(period.end_date) }}
                          </p>
                        </div>
                      </div>
                      <div class="text-right">
                        <p class="text-sm font-bold text-green-600">
                          {{
                            period.sale_price
                              ? `THB ${formatPrice(period.sale_price)}`
                              : "-"
                          }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-12">
              <i
                class="fa-solid fa-calendar-plus text-6xl text-gray-300 mb-4"
              ></i>
              <p class="text-gray-600 mb-4">No periods configured yet</p>
              <button
                @click="addNewPeriod"
                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Add First Period
              </button>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="px-6 py-4 border-t border-gray-200 flex justify-between items-center flex-shrink-0"
          >
            <div class="text-sm text-gray-600">
              <span class="font-semibold">{{ validPeriodsCount }}</span> of
              <span class="font-semibold">{{ localPeriods.length }}</span>
              period(s) valid
            </div>
            <div class="flex gap-3">
              <button
                v-if="currentStep > 0"
                @click="previousStep"
                class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
              >
                <i class="fa-solid fa-arrow-left mr-2"></i>
                Previous
              </button>

              <button
                v-if="currentStep < localPeriods.length - 1"
                @click="nextStep"
                :disabled="!isPeriodValid(currentPeriod)"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <i class="fa-solid fa-arrow-right ml-2"></i>
              </button>

              <button
                v-if="currentStep === localPeriods.length - 1"
                @click="handleSave"
                :disabled="!allPeriodsValid"
                class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="fa-solid fa-check mr-2"></i>
                Confirm & Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  isOpen: Boolean,
  periods: Array,
  roomName: String,
});

const emit = defineEmits(["close", "save"]);

// State
const localPeriods = ref([]);
const currentStep = ref(0);

// Initialize
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      if (props.periods && props.periods.length > 0) {
        localPeriods.value = JSON.parse(JSON.stringify(props.periods));
      } else {
        localPeriods.value = [createEmptyPeriod()];
      }
      currentStep.value = 0;
    }
  },
);

// Computed
const currentPeriod = computed(
  () => localPeriods.value[currentStep.value] || {},
);

const validPeriodsCount = computed(() => {
  return localPeriods.value.filter((p) => isPeriodValid(p)).length;
});

const allPeriodsValid = computed(() => {
  return (
    localPeriods.value.length > 0 &&
    localPeriods.value.every((p) => isPeriodValid(p))
  );
});

// Methods
function createEmptyPeriod() {
  return {
    period_name: "",
    start_date: "",
    end_date: "",
    sale_price: null,
    cost_price: null,
    agent_price: null,
  };
}

function isPeriodValid(period) {
  return (
    period.period_name &&
    period.start_date &&
    period.end_date &&
    period.sale_price > 0
  );
}

function addNewPeriod() {
  localPeriods.value.push(createEmptyPeriod());
  currentStep.value = localPeriods.value.length - 1;
}

function removeCurrentPeriod() {
  if (localPeriods.value.length > 1) {
    localPeriods.value.splice(currentStep.value, 1);
    if (currentStep.value >= localPeriods.value.length) {
      currentStep.value = localPeriods.value.length - 1;
    }
  }
}

function nextStep() {
  if (currentStep.value < localPeriods.value.length - 1) {
    currentStep.value++;
  }
}

function previousStep() {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
}

function suggestPrice(cost) {
  if (!cost) return "0";
  let amount = cost / 0.85;
  let lastTwoDigits = amount % 100;
  if (lastTwoDigits > 50) {
    return Math.ceil(amount / 100) * 100;
  } else {
    return Math.round(amount / 50) * 50;
  }
}

function formatPrice(price) {
  if (!price) return "0";
  return Number(price).toLocaleString();
}

function formatDateShort(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function handleClose() {
  emit("close");
}

function handleSave() {
  if (allPeriodsValid.value) {
    emit("save", localPeriods.value);
  }
}
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
