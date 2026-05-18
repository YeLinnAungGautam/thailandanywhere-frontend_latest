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

        <!-- ══ STEP 1 ══════════════════════════════════════════════════════ -->
        <div v-if="currentStep === 1" class="space-y-3">
          <!-- CRM ID + Customer name -->
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

          <!-- Customer contact -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Customer contact <span class="text-red-500">*</span>
            </label>
            <input
              v-model="editableData.carCustomerContact"
              @input="clearError('carCustomerContact')"
              type="text"
              placeholder="e.g. +66 81 234 5678"
              :class="[
                'w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#06C755] focus:border-transparent',
                validationErrors.carCustomerContact
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-300',
              ]"
            />
            <p
              v-if="validationErrors.carCustomerContact"
              class="mt-1 text-xs text-red-500 flex items-center gap-1"
            >
              <svg
                class="w-3 h-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ validationErrors.carCustomerContact }}
            </p>
          </div>

          <!-- Service date + Pickup time -->
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
              <label class="block text-xs font-medium text-gray-700 mb-1">
                Pickup time <span class="text-red-500">*</span>
              </label>
              <input
                v-model="editableData.pickupTime"
                @change="clearError('pickupTime')"
                type="time"
                :class="[
                  'w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#06C755] focus:border-transparent',
                  validationErrors.pickupTime
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-300',
                ]"
              />
              <p
                v-if="validationErrors.pickupTime"
                class="mt-1 text-xs text-red-500 flex items-center gap-1"
              >
                <svg
                  class="w-3 h-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ validationErrors.pickupTime }}
              </p>
            </div>
          </div>

          <!-- Pickup / Dropoff -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Pickup location <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="editableData.pickupLocation"
              @input="clearError('pickupLocation')"
              rows="2"
              :class="[
                'w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#06C755] focus:border-transparent',
                validationErrors.pickupLocation
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-300',
              ]"
            />
            <p
              v-if="validationErrors.pickupLocation"
              class="mt-1 text-xs text-red-500 flex items-center gap-1"
            >
              <svg
                class="w-3 h-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ validationErrors.pickupLocation }}
            </p>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Dropoff location <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="editableData.dropoffLocation"
              @input="clearError('dropoffLocation')"
              rows="2"
              :class="[
                'w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#06C755] focus:border-transparent',
                validationErrors.dropoffLocation
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-300',
              ]"
            />
            <p
              v-if="validationErrors.dropoffLocation"
              class="mt-1 text-xs text-red-500 flex items-center gap-1"
            >
              <svg
                class="w-3 h-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ validationErrors.dropoffLocation }}
            </p>
          </div>

          <!-- Route plan -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Route plan <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="editableData.routePlan"
              @input="clearError('routePlan')"
              rows="3"
              :class="[
                'w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#06C755] focus:border-transparent',
                validationErrors.routePlan
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-300',
              ]"
            />
            <p
              v-if="validationErrors.routePlan"
              class="mt-1 text-xs text-red-500 flex items-center gap-1"
            >
              <svg
                class="w-3 h-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ validationErrors.routePlan }}
            </p>
          </div>

          <!-- Product variation -->
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

          <!-- ── Driver collect toggle ──────────────────────────────────── -->
          <div
            class="flex items-center justify-between py-2.5 px-3 border border-gray-200 rounded-md bg-gray-50"
          >
            <div>
              <p class="text-sm font-medium text-gray-700">
                Driver collect payment
              </p>
              <p class="text-xs text-gray-400 mt-0.5">
                Driver collects money from customer on service day
              </p>
            </div>
            <button
              type="button"
              @click="
                editableData.isDriverCollect = !editableData.isDriverCollect
              "
              :class="
                editableData.isDriverCollect ? 'bg-[#06C755]' : 'bg-gray-300'
              "
              class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#06C755] focus:ring-offset-1"
              role="switch"
              :aria-checked="editableData.isDriverCollect"
            >
              <span
                :class="
                  editableData.isDriverCollect
                    ? 'translate-x-5'
                    : 'translate-x-0'
                "
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              />
            </button>
          </div>

          <!-- ── Payment section (visible only when toggle is ON) ───────── -->
          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div
              v-if="editableData.isDriverCollect"
              class="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3"
            >
              <p
                class="text-xs font-semibold text-green-800 uppercase tracking-wide"
              >
                Payment details
              </p>

              <!-- Payment method -->
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">
                  Payment method <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="editableData.carPaymentMethod"
                  @input="clearError('carPaymentMethod')"
                  type="text"
                  placeholder="e.g. Cash, QR, Card"
                  :class="[
                    'w-full px-3 py-2 border rounded-md bg-white focus:ring-2 focus:ring-[#06C755] focus:border-transparent',
                    validationErrors.carPaymentMethod
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-300',
                  ]"
                />
                <p
                  v-if="validationErrors.carPaymentMethod"
                  class="mt-1 text-xs text-red-500 flex items-center gap-1"
                >
                  <svg
                    class="w-3 h-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {{ validationErrors.carPaymentMethod }}
                </p>
              </div>

              <!-- Sale amount (read-only) + Total collect (user input) -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-500 mb-1"
                    >Sale amount (read-only)</label
                  >
                  <div class="relative">
                    <input
                      :value="saleAmount"
                      disabled
                      type="text"
                      class="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed pr-12"
                    />
                    <span
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400"
                      >THB</span
                    >
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">
                    Total collect <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <input
                      v-model.number="editableData.carTotalCollect"
                      @input="clearError('carTotalCollect')"
                      type="number"
                      min="0"
                      placeholder="0"
                      :class="[
                        'w-full px-3 py-2 border rounded-md bg-white focus:ring-2 focus:ring-[#06C755] focus:border-transparent pr-12',
                        validationErrors.carTotalCollect
                          ? 'border-red-400 bg-red-50'
                          : 'border-gray-300',
                      ]"
                    />
                    <span
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400"
                      >THB</span
                    >
                  </div>
                  <p
                    v-if="validationErrors.carTotalCollect"
                    class="mt-1 text-xs text-red-500 flex items-center gap-1"
                  >
                    <svg
                      class="w-3 h-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    {{ validationErrors.carTotalCollect }}
                  </p>
                </div>
              </div>

              <!-- Extra collect: auto-computed read-only display -->
              <div
                :class="[
                  'flex items-center justify-between rounded-md px-3 py-2.5 border',
                  computedExtraCollect < 0
                    ? 'bg-red-50 border-red-200'
                    : 'bg-white border-gray-200',
                ]"
              >
                <div>
                  <p class="text-xs font-medium text-gray-600">Extra collect</p>
                  <p class="text-[10px] text-gray-400 mt-0.5">
                    Total collect − Sale amount (auto)
                  </p>
                </div>
                <p
                  :class="[
                    'text-xl font-semibold tabular-nums',
                    computedExtraCollect < 0
                      ? 'text-red-500'
                      : 'text-[#06C755]',
                  ]"
                >
                  {{ computedExtraCollect }}
                  <span class="text-sm font-normal">THB</span>
                </p>
              </div>

              <!-- Negative warning -->
              <p
                v-if="computedExtraCollect < 0"
                class="text-xs text-red-500 flex items-center gap-1.5"
              >
                <svg
                  class="w-3.5 h-3.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  />
                </svg>
                Total collect is less than the sale amount — please verify.
              </p>
            </div>
          </Transition>

          <!-- Special request -->
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

          <!-- Summary error banner -->
          <div
            v-if="Object.keys(validationErrors).length > 0"
            class="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-md"
          >
            <svg
              class="w-4 h-4 text-red-500 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <p class="text-xs text-red-600">
              Please fill in all required fields before continuing.
            </p>
          </div>
        </div>

        <!-- ══ STEP 2: Preview ════════════════════════════════════════════ -->
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

      <!-- Confirm overlay -->
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
const validationErrors = ref({});

// Sale amount from booking — fixed reference for the computation
const saleAmount = Number(props.bookingData.sale_amount) || 0;

// ── All editable state in one ref ─────────────────────────────────────────────
const editableData = ref({
  crmId: props.bookingData.crm_id || "",
  customerName: props.bookingData.customer_name || "",
  contact: props.bookingData.contact || "",
  serviceDate: props.bookingData.service_date || "",
  pickupTime: props.bookingData.pickup_time || "",
  pickupLocation: props.bookingData.pickup_location || "",
  dropoffLocation: props.bookingData.dropoff_location || "",
  routePlan: props.bookingData.route_plan || "",
  productVariation: props.bookingData.product_variation || "",
  specialRequest: props.bookingData.special_request || "",
  // toggle seeded from booking (null → false)
  isDriverCollect: props.bookingData.is_driver_collect == 1,
  // new payment fields
  carCustomerContact: props.bookingData.car_customer_contact || "",
  carPaymentMethod:
    props.bookingData.car_payment_method ||
    props.bookingData.payment_method ||
    "",
  // user enters this; extra_collect is derived
  carTotalCollect: Number(props.bookingData.car_total_collect) || 0,
});

// extra collect = total collect − sale amount  (live, read-only)
const computedExtraCollect = computed(
  () => (Number(editableData.value.carTotalCollect) || 0) - saleAmount,
);

// ── Validation ────────────────────────────────────────────────────────────────
function clearError(field) {
  if (validationErrors.value[field]) {
    const errors = { ...validationErrors.value };
    delete errors[field];
    validationErrors.value = errors;
  }
}

function validateStep1() {
  const errors = {};

  const requiredFields = [
    { key: "carCustomerContact", label: "Customer contact" },
    { key: "pickupTime", label: "Pickup time" },
    { key: "pickupLocation", label: "Pickup location" },
    { key: "dropoffLocation", label: "Dropoff location" },
    { key: "routePlan", label: "Route plan" },
  ];

  for (const field of requiredFields) {
    const val = editableData.value[field.key];
    if (!val || String(val).trim() === "") {
      errors[field.key] = `${field.label} is required`;
    }
  }

  // Payment fields required when driver collect is ON
  if (editableData.value.isDriverCollect) {
    if (!editableData.value.carPaymentMethod?.trim()) {
      errors.carPaymentMethod = "Payment method is required";
    }
    const tc = editableData.value.carTotalCollect;
    if (tc === null || tc === "" || isNaN(Number(tc))) {
      errors.carTotalCollect = "Total collect is required";
    }
  }

  validationErrors.value = errors;
  return Object.keys(errors).length === 0;
}

// ── LINE message ──────────────────────────────────────────────────────────────
const formattedMessage = computed(() => {
  const contact =
    editableData.value.carCustomerContact || editableData.value.contact || "-";

  const paymentBlock = editableData.value.isDriverCollect
    ? `\nPayment Method: ${editableData.value.carPaymentMethod || "-"}
Sale Amount: ${saleAmount}
Total Collect: ${editableData.value.carTotalCollect || 0}
Extra Collect: ${computedExtraCollect.value}`
    : `\nPayment Method: xxxx
Sale Amount: xxxx
Total Collect: xxxx
Extra Collect: xxxx`;

  return `CRMID: ${editableData.value.crmId}
C. Name: ${editableData.value.customerName}
Contact: ${contact}

S.Date: ${editableData.value.serviceDate}
Pickup Time: ${editableData.value.pickupTime}
Pickup Location: ${editableData.value.pickupLocation}
Dropoff Location: ${editableData.value.dropoffLocation}

Routeplan: ${editableData.value.routePlan}

Product Variation: ${editableData.value.productVariation}${paymentBlock}

Special Request: ${editableData.value.specialRequest}`;
});

// ── Navigation ────────────────────────────────────────────────────────────────
function handleLeft() {
  if (currentStep.value === 1) emit("close");
  else currentStep.value = 1;
}

function handleRight() {
  if (currentStep.value === 1) {
    if (!validateStep1()) return;
    currentStep.value = 2;
  } else {
    showConfirm.value = true;
  }
}

// ── Send ──────────────────────────────────────────────────────────────────────
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
      special_request: editableData.value.specialRequest,
      is_driver_collect: editableData.value.isDriverCollect ? 1 : 0,
      car_customer_contact: editableData.value.carCustomerContact,
      car_payment_method: editableData.value.carPaymentMethod,
      car_total_collect: editableData.value.carTotalCollect,
      // send the computed value so Laravel can store/use it directly
      extra_collect: computedExtraCollect.value,
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
