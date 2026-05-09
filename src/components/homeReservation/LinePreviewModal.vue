<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div
      class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col"
    >
      <!-- Header -->
      <div
        class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-lg"
      >
        <h2 class="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <svg
            class="w-6 h-6 text-[#06C755]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"
            />
          </svg>
          Send to LINE
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="overflow-y-auto flex-1 p-6">
        <!-- Step indicator -->
        <div class="flex items-center gap-2 mb-6">
          <div
            :class="[
              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0',
              currentStep === 1
                ? 'bg-[#06C755] text-white'
                : 'bg-green-100 text-[#06C755]',
            ]"
          >
            <svg
              v-if="currentStep === 2"
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
            <span v-else>1</span>
          </div>
          <span class="text-xs text-gray-500">Edit details</span>
          <div class="flex-1 h-px bg-gray-200"></div>
          <div
            :class="[
              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0',
              currentStep === 2
                ? 'bg-[#06C755] text-white'
                : 'bg-gray-100 text-gray-400',
            ]"
          >
            2
          </div>
          <span class="text-xs text-gray-500">Preview & send</span>
        </div>

        <!-- STEP 1: Edit form -->
        <div v-if="currentStep === 1" class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1"
                >CRM ID (read-only)</label
              >
              <input
                :value="editableData.crmId"
                disabled
                type="text"
                class="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1"
                >Customer name (read-only)</label
              >
              <input
                :value="editableData.customerName"
                disabled
                type="text"
                class="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1"
              >Contact (read-only)</label
            >
            <input
              :value="editableData.contact"
              disabled
              type="text"
              class="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1"
                >Service date (read-only)</label
              >
              <input
                :value="editableData.serviceDate"
                disabled
                type="text"
                class="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1"
                >Pickup time <span class="text-red-500">*</span></label
              >
              <input
                v-model="editableData.pickupTime"
                type="time"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#06C755] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1"
              >Pickup location</label
            >
            <textarea
              v-model="editableData.pickupLocation"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#06C755] focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1"
              >Dropoff location</label
            >
            <textarea
              v-model="editableData.dropoffLocation"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#06C755] focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1"
              >Route plan</label
            >
            <textarea
              v-model="editableData.routePlan"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#06C755] focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1"
              >Product variation (read-only)</label
            >
            <input
              :value="editableData.productVariation"
              disabled
              type="text"
              class="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div
            v-if="isDriverCollect"
            class="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <p class="text-sm font-medium text-gray-800 mb-3">
              Driver collect payment
            </p>
            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1"
                  >Payment method (read-only)</label
                >
                <input
                  :value="bookingData.payment_method"
                  disabled
                  type="text"
                  class="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1"
                  >Sale amount (read-only)</label
                >
                <input
                  :value="bookingData.sale_amount"
                  disabled
                  type="text"
                  class="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1"
                  >Extra collect</label
                >
                <input
                  v-model="editableData.extraCollect"
                  type="number"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#06C755] focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1"
              >Special request</label
            >
            <textarea
              v-model="editableData.specialRequest"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#06C755] focus:border-transparent"
            />
          </div>
        </div>

        <!-- STEP 2: Preview -->
        <div v-if="currentStep === 2">
          <div
            class="bg-gray-50 rounded-lg p-3 mb-4 text-sm text-gray-600 flex items-center gap-2"
          >
            <svg
              class="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Review the message below before sending to LINE.
          </div>
          <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p class="text-xs font-medium text-gray-700 mb-2">
              Message preview:
            </p>
            <pre class="text-xs text-gray-800 whitespace-pre-wrap font-mono">{{
              formattedMessage
            }}</pre>
          </div>
        </div>
      </div>

      <!-- Footer buttons -->
      <div class="flex gap-3 px-6 py-4 border-t border-gray-200">
        <button
          @click="handleLeft"
          :disabled="loading"
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {{ currentStep === 1 ? "Cancel" : "← Back" }}
        </button>
        <button
          @click="handleRight"
          :disabled="loading"
          class="flex-1 px-4 py-2 bg-[#06C755] text-white rounded-lg hover:bg-[#05b04b] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {{ currentStep === 1 ? "Next: preview →" : "Save & send to LINE" }}
        </button>
      </div>

      <!-- Confirm dialog overlay -->
      <Transition name="fade">
        <div
          v-if="showConfirm"
          class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg z-10"
        >
          <div class="bg-white rounded-xl shadow-xl p-6 w-72 text-center mx-4">
            <div
              class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <svg
                class="w-6 h-6 text-[#06C755]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </div>
            <h3 class="text-base font-semibold text-gray-800 mb-2">
              Send to LINE?
            </h3>
            <p class="text-sm text-gray-500 mb-5">
              This will save the booking details and send the message to the
              System LINE chat.
            </p>
            <div class="flex gap-2">
              <button
                @click="showConfirm = false"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
              >
                Go back
              </button>
              <button
                @click="sendMessage"
                :disabled="loading"
                class="flex-1 px-4 py-2 bg-[#06C755] text-white rounded-lg hover:bg-[#05b04b] text-sm flex items-center justify-center gap-1 disabled:bg-gray-400"
              >
                <span v-if="!loading">Yes, send</span>
                <span v-else class="flex items-center gap-1">
                  <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                      fill="none"
                    />
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Sending...
                </span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  bookingData: { type: Object, required: true },
});

const emit = defineEmits(["close", "send"]);

const loading = ref(false);
const currentStep = ref(1);
const showConfirm = ref(false);

const isDriverCollect = props.bookingData.is_driver_collect == 1;

const editableData = ref({
  crmId: props.bookingData.crm_id || "",
  customerName: props.bookingData.customer_name || "",
  contact: props.bookingData.contact || "null",
  serviceDate: props.bookingData.service_date || "",
  pickupTime: props.bookingData.pickup_time || "",
  pickupLocation: props.bookingData.pickup_location || "",
  dropoffLocation: props.bookingData.dropoff_location || "",
  routePlan: props.bookingData.route_plan || "",
  productVariation: props.bookingData.product_variation || "",
  extraCollect: props.bookingData.extra_collect || "0",
  specialRequest:
    props.bookingData.special_request || "Good Car and Good Driver",
});

const formattedMessage = computed(() => {
  const paymentDisplay = isDriverCollect
    ? props.bookingData.payment_method || "xxxx"
    : "xxxx";
  const saleAmountDisplay = isDriverCollect
    ? props.bookingData.sale_amount || "xxxx"
    : "xxxx";
  const extraCollectDisplay = isDriverCollect
    ? editableData.value.extraCollect || "0"
    : "0";

  return `CRMID: ${editableData.value.crmId}
C. Name: ${editableData.value.customerName}
Contact: ${editableData.value.contact}

S.Date: ${editableData.value.serviceDate}
Pickup Time: ${editableData.value.pickupTime}
Pickup Location: ${editableData.value.pickupLocation}
Dropoff Location: ${editableData.value.dropoffLocation}

Routeplan: ${editableData.value.routePlan}

Product Variation: ${editableData.value.productVariation}
PaymentMethod: ${paymentDisplay}
SaleAmount: ${saleAmountDisplay}
ExtraCollect: ${extraCollectDisplay}

SpecialRequest: ${editableData.value.specialRequest}`;
});

function handleLeft() {
  if (currentStep.value === 1) emit("close");
  else currentStep.value = 1;
}

function handleRight() {
  if (currentStep.value === 1) {
    // if (!editableData.value.pickupTime) return;
    currentStep.value = 2;
  } else {
    showConfirm.value = true;
  }
}

const sendMessage = () => {
  loading.value = true;
  emit("send", {
    message: formattedMessage.value,
    editedData: {
      crm_id: editableData.value.crmId,
      customer_name: editableData.value.customerName,
      contact: editableData.value.contact,
      service_date: editableData.value.serviceDate,
      pickup_time: editableData.value.pickupTime,
      pickup_location: editableData.value.pickupLocation,
      dropoff_location: editableData.value.dropoffLocation,
      route_plan: editableData.value.routePlan,
      product_variation: editableData.value.productVariation,
      extra_collect: editableData.value.extraCollect,
      special_request: editableData.value.specialRequest,
      is_driver_collect: isDriverCollect ? 1 : 0,
    },
  });
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
