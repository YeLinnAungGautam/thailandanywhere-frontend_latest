<template>
  <div class="space-y-6">
    <!-- Step Indicator -->
    <div class="flex items-center justify-center mb-8">
      <div class="flex items-center space-x-4">
        <!-- Step 1 -->
        <div class="flex items-center">
          <div
            @click="prevStep"
            class="flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200"
            :class="
              currentStep === 1
                ? 'bg-[#FF613c] border-[#FF613c] text-white'
                : currentStep > 1
                ? 'bg-green-500 border-green-500 text-white'
                : 'bg-white border-gray-300 text-gray-400'
            "
          >
            <span v-if="currentStep > 1">
              <svg
                class="w-6 h-6"
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
            </span>
            <span v-else class="text-sm font-semibold">1</span>
          </div>
          <span
            class="ml-2 text-sm font-medium"
            :class="currentStep >= 1 ? 'text-gray-900' : 'text-gray-400'"
          >
            Expense Cost
          </span>
        </div>

        <!-- Connector Line -->
        <div
          class="w-16 h-0.5 transition-all duration-200"
          :class="currentStep > 1 ? 'bg-green-500' : 'bg-gray-300'"
        ></div>

        <!-- Step 2 -->
        <div class="flex items-center">
          <div
            @click="nextStep"
            class="flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200"
            :class="
              currentStep === 2
                ? 'bg-[#FF613c] border-[#FF613c] text-white'
                : currentStep > 2
                ? 'bg-green-500 border-green-500 text-white'
                : 'bg-white border-gray-300 text-gray-400'
            "
          >
            <span v-if="currentStep > 2">
              <svg
                class="w-6 h-6"
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
            </span>
            <span v-else class="text-sm font-semibold">2</span>
          </div>
          <span
            class="ml-2 text-sm font-medium"
            :class="currentStep >= 2 ? 'text-gray-900' : 'text-gray-400'"
          >
            Receipt Slips
          </span>
        </div>
      </div>
    </div>

    <!-- Step Content -->
    <div class="transition-all duration-300">
      <!-- Step 1: Expense Cost Table -->
      <div v-show="currentStep === 1" class="space-y-4">
        <div class="bg-white rounded-lg shadow-sm">
          <ExpenseCostTable
            :detail="detail"
            :getDetailAction="getDetailAction"
          />
        </div>

        <!-- Navigation Buttons for Step 1 -->
        <!-- <div class="flex justify-end gap-3">
          <button
            @click="nextStep"
            class="px-6 py-2.5 bg-[#FF613c] text-white text-sm font-medium rounded-lg hover:bg-[#e55139] transition-colors flex items-center gap-2"
          >
            Next: Receipt Slips
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div> -->
      </div>

      <!-- Step 2: Receipt Slips -->
      <div v-show="currentStep === 2" class="space-y-4">
        <div class="bg-white rounded-lg shadow-sm p-4">
          <ExpenseReceiptSlips
            :detail="detail"
            :getDetailAction="getDetailAction"
          />
        </div>

        <!-- Navigation Buttons for Step 2 -->
        <!-- <div class="flex justify-between gap-3 pt-4">
          <button
            @click="prevStep"
            class="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Expense Cost
          </button>
          <button
            @click="completePayment"
            class="px-6 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Complete Payment
          </button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
import ExpenseCostTable from "./PaymentData.vue";
import ExpenseReceiptSlips from "./PaymentSlip.vue";
import { useToast } from "vue-toastification";

const toast = useToast();

const props = defineProps({
  detail: {
    type: Object,
    required: true,
  },
  getDetailAction: {
    type: Function,
    required: true,
  },
});

// Step management
const currentStep = ref(1);

const nextStep = () => {
  if (currentStep.value < 2) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const completePayment = () => {
  // You can add your completion logic here
  toast.success("Payment process completed!");
  // Reset to step 1 if needed
  // currentStep.value = 1;
};
</script>
