<template>
  <Modal :isOpen="isOpen" @closeModal="$emit('close')" :marginTop="5">
    <DialogPanel
      class="w-full max-w-6xl transform rounded-xl bg-white text-left align-middle shadow-xl transition-all max-h-[95vh] overflow-hidden flex flex-col"
    >
      <!-- Header -->
      <DialogTitle
        as="div"
        class="text-lg font-semibold text-gray-900 p-6 pb-4 flex justify-between items-center border-b"
      >
        <div class="flex items-center gap-2">
          <svg
            class="w-6 h-6 text-[#FF613c]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          {{ driverData ? "Edit Driver Assignment" : "Assign Driver" }}
          <span class="text-xs font-normal text-gray-500 ml-2">
            ({{ itemData?.variation_name || "Car Booking" }})
          </span>
        </div>
        <button
          @click="$emit('close')"
          class="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <XMarkIcon class="w-5 h-5 text-gray-500" />
        </button>
      </DialogTitle>

      <!-- Content -->
      <div class="flex-1 overflow-hidden flex">
        <!-- Left Sidebar -->
        <div
          class="w-72 bg-gradient-to-br from-purple-50 to-indigo-50 border-r p-6 overflow-y-auto"
        >
          <div class="space-y-1 relative">
            <!-- Vertical Line -->
            <div
              class="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-purple-600 via-purple-300 to-gray-200"
            ></div>

            <!-- Step 1: Trip Details -->
            <div
              @click="currentStep = 1"
              :class="[
                'relative flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300',
                currentStep === 1
                  ? 'bg-white shadow-lg scale-105'
                  : 'hover:bg-white/50',
              ]"
            >
              <div class="relative z-10 flex-shrink-0">
                <div
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                    currentStep === 1
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50 ring-4 ring-purple-600/20'
                      : isStep1Complete
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-400 border-2 border-gray-300',
                  ]"
                >
                  <CheckCircleIcon
                    v-if="isStep1Complete && currentStep !== 1"
                    class="w-5 h-5"
                  />
                  <span v-else>1</span>
                </div>
                <div
                  v-if="currentStep === 1"
                  class="absolute inset-0 rounded-full bg-purple-600 animate-ping opacity-20"
                ></div>
              </div>
              <div class="flex-1 min-w-0 pt-0.5">
                <h3
                  :class="[
                    'text-sm font-bold mb-0.5 transition-colors',
                    currentStep === 1
                      ? 'text-purple-600'
                      : isStep1Complete
                      ? 'text-gray-800'
                      : 'text-gray-400',
                  ]"
                >
                  Trip Details
                </h3>
                <p class="text-[10px] text-gray-500 mt-0.5">
                  Route, pax, locations & payment
                </p>
              </div>
              <div v-if="isStep1Complete" class="flex-shrink-0">
                <div
                  class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <CheckCircleIcon class="w-4 h-4 text-green-600" />
                </div>
              </div>
            </div>

            <!-- Step 2: Supplier & Driver -->
            <div
              v-if="authStore.isSuperAdmin || authStore.isReservation"
              @click="currentStep = 2"
              :class="[
                'relative flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300',
                currentStep === 2
                  ? 'bg-white shadow-lg scale-105'
                  : 'hover:bg-white/50',
              ]"
            >
              <div class="relative z-10 flex-shrink-0">
                <div
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                    currentStep === 2
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50 ring-4 ring-purple-600/20'
                      : isStep2Complete
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-400 border-2 border-gray-300',
                  ]"
                >
                  <CheckCircleIcon
                    v-if="isStep2Complete && currentStep !== 2"
                    class="w-5 h-5"
                  />
                  <span v-else>2</span>
                </div>
                <div
                  v-if="currentStep === 2"
                  class="absolute inset-0 rounded-full bg-purple-600 animate-ping opacity-20"
                ></div>
              </div>
              <div class="flex-1 min-w-0 pt-0.5">
                <h3
                  :class="[
                    'text-sm font-bold mb-0.5 transition-colors',
                    currentStep === 2
                      ? 'text-purple-600'
                      : isStep2Complete
                      ? 'text-gray-800'
                      : 'text-gray-400',
                  ]"
                >
                  Supplier
                </h3>
                <p class="text-[10px] text-gray-500 mt-0.5">
                  Choose supplier, cost & driver
                </p>
              </div>
              <div v-if="isStep2Complete" class="flex-shrink-0">
                <div
                  class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <CheckCircleIcon class="w-4 h-4 text-green-600" />
                </div>
              </div>
            </div>

            <!-- Step 3: Send to LINE -->
            <div
              @click="currentStep = 3"
              :class="[
                'relative flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300',
                currentStep === 3
                  ? 'bg-white shadow-lg scale-105'
                  : 'hover:bg-white/50',
              ]"
            >
              <div class="relative z-10 flex-shrink-0">
                <div
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                    currentStep === 3
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/50 ring-4 ring-green-500/20'
                      : 'bg-white text-gray-400 border-2 border-gray-300',
                  ]"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"
                    />
                  </svg>
                </div>
                <div
                  v-if="currentStep === 3"
                  class="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"
                ></div>
              </div>
              <div class="flex-1 min-w-0 pt-0.5">
                <h3
                  :class="[
                    'text-sm font-bold mb-0.5 transition-colors',
                    currentStep === 3 ? 'text-green-600' : 'text-gray-400',
                  ]"
                >
                  Send to LINE
                </h3>
                <p class="text-[10px] text-gray-500 mt-0.5">
                  Notify driver via LINE
                </p>
              </div>
            </div>
          </div>

          <!-- Progress Section -->
          <div class="mt-8 pt-6 border-t border-purple-200">
            <div
              class="flex items-center justify-between text-xs font-medium text-gray-700 mb-3"
            >
              <span>Assignment Progress</span>
              <span class="text-purple-600 font-bold"
                >{{ completionPercentage }}%</span
              >
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                class="bg-gradient-to-r from-purple-600 to-indigo-400 h-2.5 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                :style="{ width: completionPercentage + '%' }"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
                ></div>
              </div>
            </div>
            <div class="mt-2 text-[10px] text-gray-500 text-center">
              {{ completedStepsCount }} of 2 steps completed
            </div>
          </div>
        </div>

        <!-- Right Content Area -->
        <div class="flex-1 overflow-y-auto p-6">
          <!-- ── STEP 1: Trip Details ── -->
          <div v-show="currentStep === 1" class="space-y-4">
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">
                Trip Details
              </h3>
              <p class="text-[10px] text-gray-500">
                Fill in the route, pax count, pickup/dropoff details and payment
                preference
              </p>
            </div>

            <!-- Booking info pill -->
            <div
              class="bg-gradient-to-r from-purple-50 to-indigo-100 rounded-xl p-4 mb-4 border border-purple-200"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm"
                >
                  <TruckIcon class="w-6 h-6 text-purple-600" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-900">
                    {{ itemData?.variation_name || "Vehicle" }}
                  </p>
                  <p class="text-xs text-gray-600">
                    {{ formatDate(itemData?.service_date) }}
                  </p>
                </div>
                <div class="px-3 py-1 bg-white rounded-full">
                  <p class="text-xs font-medium text-purple-600">
                    {{ itemData?.crm_id }}
                  </p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <!-- Customer Name (read-only) -->
              <div>
                <label
                  class="text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1"
                >
                  <svg
                    class="w-4 h-4 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Customer Name
                </label>
                <input
                  type="text"
                  :value="itemData?.customer_name || ''"
                  disabled
                  class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-100 text-gray-600"
                />
              </div>

              <!-- Pickup Time -->
              <div>
                <label
                  class="text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1"
                >
                  <svg
                    class="w-4 h-4 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Pickup Time
                </label>
                <input
                  type="time"
                  v-model="tripForm.pickup_time"
                  class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
                />
              </div>

              <!-- Customer Contact -->
              <div>
                <label
                  class="text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1"
                >
                  <svg
                    class="w-4 h-4 text-purple-600"
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
                  Customer Contact
                </label>
                <input
                  type="text"
                  v-model="tripForm.car_customer_contact"
                  placeholder="e.g. +66 81 234 5678"
                  class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
                />
              </div>

              <!-- Pickup Location -->
              <div>
                <label
                  class="text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1"
                >
                  <svg
                    class="w-4 h-4 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Pickup Location
                </label>
                <input
                  type="text"
                  v-model="tripForm.pickup_location"
                  placeholder="Pickup location"
                  class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
                />
              </div>

              <!-- Dropoff Location -->
              <div>
                <label
                  class="text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1"
                >
                  <svg
                    class="w-4 h-4 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Dropoff Location
                </label>
                <input
                  type="text"
                  v-model="tripForm.dropoff_location"
                  placeholder="Dropoff location"
                  class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
                />
              </div>

              <!-- Route Plan -->
              <div class="col-span-2">
                <label
                  class="text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1"
                >
                  <svg
                    class="w-4 h-4 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  Route Plan
                </label>
                <textarea
                  v-model="tripForm.route_plan"
                  rows="3"
                  placeholder="Describe the route plan"
                  class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
                ></textarea>
              </div>

              <!-- Special Request -->
              <div class="col-span-2">
                <label
                  class="text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1"
                >
                  <svg
                    class="w-4 h-4 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Special Request
                </label>
                <textarea
                  v-model="tripForm.special_request"
                  rows="2"
                  placeholder="Any special requests or notes"
                  class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- ── STEP 2: Supplier & Driver ── -->
          <div v-show="currentStep === 2" class="space-y-4">
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">
                Supplier & Driver
              </h3>
              <p class="text-[10px] text-gray-500">
                Select supplier, set cost price, then assign a driver and
                vehicle
              </p>
            </div>

            <!-- Car Info Display -->
            <div
              class="bg-gradient-to-r from-purple-50 to-indigo-100 rounded-xl p-4 mb-4 border border-purple-200"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm"
                >
                  <TruckIcon class="w-6 h-6 text-purple-600" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-900">
                    {{ itemData?.car?.name || "Vehicle" }}
                  </p>
                  <p class="text-xs text-gray-600">
                    {{ formatDate(itemData?.service_date) }}
                  </p>
                </div>
                <div class="px-3 py-1 bg-white rounded-full">
                  <p class="text-xs font-medium text-purple-600">
                    {{ itemData?.crm_id }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Supplier + Cost Price side by side -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label
                  class="text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1"
                >
                  <svg
                    class="w-4 h-4 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  Supplier *
                </label>
                <select
                  v-model="formData.supplier_id"
                  @change="onSupplierChange"
                  class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
                >
                  <option value="">Select Supplier</option>
                  <option
                    v-for="supplier in suppliers?.data"
                    :key="supplier.id"
                    :value="supplier.id"
                  >
                    {{ supplier.name }}
                  </option>
                </select>
              </div>

              <div>
                <label
                  class="text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1"
                >
                  <svg
                    class="w-4 h-4 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Cost Price *
                </label>
                <div class="relative">
                  <input
                    type="number"
                    v-model="formData.cost_price"
                    placeholder="0.00"
                    class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
                  />
                  <span
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500"
                    >THB</span
                  >
                </div>
              </div>
            </div>

            <!-- Driver Collect Toggle -->
            <div
              class="flex items-center justify-between py-3 px-4 border border-gray-200 rounded-xl bg-gray-50 mt-2"
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
                  lineForm.is_driver_collect = !lineForm.is_driver_collect
                "
                :class="
                  lineForm.is_driver_collect ? 'bg-purple-500' : 'bg-gray-300'
                "
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
                role="switch"
                :aria-checked="lineForm.is_driver_collect"
              >
                <span
                  :class="
                    lineForm.is_driver_collect
                      ? 'translate-x-5'
                      : 'translate-x-0'
                  "
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                />
              </button>
              <!-- Payment Details -->
            </div>
            <div
              v-if="lineForm.is_driver_collect"
              class="bg-purple-50 border border-purple-200 rounded-xl p-4 space-y-3"
            >
              <p
                class="text-xs font-semibold text-purple-800 uppercase tracking-wide"
              >
                Payment Details
              </p>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs font-medium text-gray-700 mb-1.5 block"
                    >Payment Method</label
                  >
                  <input
                    type="text"
                    v-model="lineForm.car_payment_method"
                    placeholder="e.g. Cash, QR, Card"
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#06C755]/30 focus:border-[#06C755]"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs font-medium text-gray-500 mb-1.5 block"
                    >Sale Amount (read-only)</label
                  >
                  <div class="relative">
                    <input
                      :value="saleAmount || 0"
                      disabled
                      type="text"
                      class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed pr-12"
                    />
                    <span
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400"
                      >THB</span
                    >
                  </div>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-700 mb-1.5 block"
                    >Total Collect</label
                  >
                  <div class="relative">
                    <input
                      v-model.number="lineForm.car_total_collect"
                      type="number"
                      min="0"
                      placeholder="0"
                      class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#06C755]/30 focus:border-[#06C755] pr-12"
                    />
                    <span
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400"
                      >THB</span
                    >
                  </div>
                </div>
              </div>

              <div
                :class="[
                  'flex items-center justify-between rounded-lg px-3 py-2.5 border',
                  lineForm.is_driver_collect && computedExtraCollect < 0
                    ? 'bg-red-50 border-red-200'
                    : 'bg-white border-gray-200',
                ]"
              >
                <div>
                  <p class="text-xs font-medium text-gray-600">Extra Collect</p>
                  <p class="text-[10px] text-gray-400 mt-0.5">
                    Total collect − Sale amount (auto)
                  </p>
                </div>
                <p
                  :class="[
                    'text-xl font-semibold tabular-nums',
                    lineForm.is_driver_collect && computedExtraCollect < 0
                      ? 'text-red-500'
                      : lineForm.is_driver_collect
                      ? 'text-[#06C755]'
                      : 'text-gray-400',
                  ]"
                >
                  {{ lineForm.is_driver_collect ? computedExtraCollect : "-" }}
                  <span class="text-sm font-normal">THB</span>
                </p>
              </div>

              <p
                v-if="lineForm.is_driver_collect && computedExtraCollect < 0"
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

            <div class="">
              <label
                class="text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1"
              >
                <svg
                  class="w-4 h-4 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Car Collect Comment (Note)
              </label>
              <textarea
                v-model="tripForm.car_comment"
                rows="2"
                placeholder="Any special requests or notes"
                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
              ></textarea>
            </div>
          </div>

          <!-- ── STEP 3: Send to LINE ── -->
          <div v-show="currentStep === 3" class="space-y-4">
            <div class="mb-4">
              <h3
                class="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2"
              >
                <svg
                  class="w-5 h-5 text-green-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"
                  />
                </svg>
                Send to LINE
              </h3>
              <p class="text-[10px] text-gray-500">
                Review details, configure payment, then send to driver via LINE
              </p>
            </div>

            <!-- LINE Message Preview -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-medium text-gray-700"
                  >LINE Message</label
                >
                <button
                  @click="buildLineMessage"
                  class="text-[10px] text-purple-600 hover:text-purple-800 flex items-center gap-1 transition-colors"
                >
                  <svg
                    class="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Regenerate
                </button>
              </div>
              <textarea
                v-model="lineMessage"
                rows="14"
                class="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 font-mono bg-gray-50"
                placeholder="LINE message will appear here..."
              ></textarea>
            </div>

            <!-- Send Button -->
            <button
              @click="handleSendToLine"
              :disabled="sendingLine || !lineMessage.trim()"
              class="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all"
              :class="
                sendingLine || !lineMessage.trim()
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/30 hover:shadow-green-500/50'
              "
            >
              <svg
                v-if="!sendingLine"
                class="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"
                />
              </svg>
              <div
                v-else
                class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
              />
              {{ sendingLine ? "Sending to LINE..." : "Send to LINE" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="border-t p-6 pt-4 flex items-center justify-between gap-3 bg-gray-50"
      >
        <button
          @click="$emit('close')"
          :disabled="saving"
          class="px-4 py-2.5 bg-white border border-gray-300 text-sm rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>

        <div class="flex items-center gap-3">
          <button
            v-if="currentStep > 1"
            @click="previousAction"
            :disabled="loading || saving"
            class="px-4 py-2.5 bg-gray-200 text-black text-sm rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ChevronLeftIcon class="w-4 h-4" /> Previous
          </button>

          <!-- Step 1 → 2 -->
          <button
            v-if="currentStep === 1"
            @click="nextAction"
            :disabled="loading || saving"
            class="px-4 py-2.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Next & Save <ChevronRightIcon class="w-4 h-4" />
          </button>

          <!-- Step 2: Save then go to Step 3 -->
          <button
            v-if="currentStep === 2"
            @click="nextAction"
            :disabled="saving || !isStep2Complete"
            class="px-4 py-2.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg
              v-if="saving"
              class="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{
              saving
                ? "Saving..."
                : driverData
                ? "Update Assignment"
                : "Save & Continue"
            }}
            <ChevronRightIcon v-if="!saving" class="w-4 h-4" />
          </button>

          <!-- Step 3: Done -->
          <button
            v-if="
              currentStep === 3 &&
              (authStore.isSuperAdmin || authStore.isReservation)
            "
            @click="checkedAndClose"
            class="px-4 py-2.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <CheckCircleIcon class="w-4 h-4" /> Checked & Close
          </button>

          <button
            v-if="
              currentStep === 3 && (authStore.isAdmin || authStore.isSaleAdmin)
            "
            @click="$emit('close')"
            class="px-4 py-2.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <CheckCircleIcon class="w-4 h-4" /> Done
          </button>
        </div>
      </div>
    </DialogPanel>
  </Modal>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import {
  TruckIcon,
  XMarkIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/vue/24/outline";
import { useToast } from "vue-toastification";
import { useCarBookingStore } from "../../../stores/carbooking";
import { useSupplierStore } from "../../../stores/supplier";
import { useDriverStore } from "../../../stores/driver";
import { storeToRefs } from "pinia";
import Modal from "../../../components/Modal.vue";
import SearchDriver from "../../ReservationGroupByComponent/SearchDriver.vue";
import { useAuthStore } from "../../../stores/auth.js";
import { useMessageStore } from "../../../stores/message.js";

const props = defineProps({
  isOpen: Boolean,
  driverData: Object,
  itemData: Object,
  groupId: [String, Number],
  groupData: Object,
});

const emit = defineEmits(["close", "refresh"]);

const toast = useToast();
const messageStore = useMessageStore();
const carBookingStore = useCarBookingStore();
const authStore = useAuthStore();
const supplierStore = useSupplierStore();
const driverStore = useDriverStore();

const { suppliers } = storeToRefs(supplierStore);
const { drivers } = storeToRefs(driverStore);

const loading = ref(false);
const saving = ref(false);
const sendingLine = ref(false);
const currentStep = ref(1);
const carNumbers = ref([]);
const lineMessage = ref("");

// ── Trip form (Step 1) ─────────────────────────────────
const tripForm = ref({
  total_pax: "",
  pickup_time: "",
  pickup_location: "",
  dropoff_location: "",
  route_plan: "",
  special_request: "",
  car_customer_contact: "",
  is_checked: false,
  car_comment: "",
});

// ── Driver/Supplier form (Step 2) ──────────────────────
const formData = ref({
  supplier_id: "",
  driver_id: "",
  driver_contact: "",
  car_number: "",
  cost_price: "",
  car_photo: "",
});

// ── LINE-specific form (Step 3) ────────────────────────
const lineForm = ref({
  is_driver_collect: false,
  car_payment_method: "",
  car_total_collect: 0,
});

// ── Computed ───────────────────────────────────────────
const isStep1Complete = computed(
  () => !!(tripForm.value.pickup_location || tripForm.value.total_pax),
);
const isStep2Complete = computed(
  () => !!(formData.value.supplier_id && formData.value.cost_price),
);
// Step 3 has no required gate — always accessible
const isStep3Complete = computed(() => true);

const completedStepsCount = computed(
  () => [isStep1Complete.value, isStep2Complete.value].filter(Boolean).length,
);
const completionPercentage = computed(() =>
  Math.round((completedStepsCount.value / 2) * 100),
);

const computedExtraCollect = computed(() => {
  const sale = Number(props.itemData?.amount) || 0;
  return (Number(lineForm.value.car_total_collect) || 0) - sale;
});

const saleAmount = computed(() => Number(props.itemData?.amount) || 0);

// Auto-build LINE message on step 3
watch(currentStep, (val) => {
  if (val === 3) buildLineMessage();
});

// Rebuild LINE message when payment fields change
watch(
  () => [
    lineForm.value.is_driver_collect,
    lineForm.value.car_payment_method,
    lineForm.value.car_total_collect,
    tripForm.value.car_customer_contact,
  ],
  () => {
    if (currentStep.value === 3) buildLineMessage();
  },
);

// ── Helpers ────────────────────────────────────────────
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${String(date.getDate()).padStart(2, "0")} ${
    months[date.getMonth()]
  } ${date.getFullYear()}`;
};

const getSupplierName = (id) =>
  suppliers.value?.data?.find((s) => s.id === id)?.name || "-";
const getCarNumber = (id) =>
  carNumbers.value.find((c) => c.id === id)?.car_number || "-";

// ── Supplier / Driver handlers ─────────────────────────
const onSupplierChange = async () => {
  if (formData.value.supplier_id) {
    try {
      await driverStore.getSimpleListAction({
        supplier_id: formData.value.supplier_id,
      });
    } catch (e) {
      toast.error("Failed to load drivers");
    }
  }
};

const onDriverChange = async (driverId) => {
  if (!driverId) return;
  try {
    const res = await driverStore.getDetailAction(driverId);
    if (res?.result) {
      const data = res.result;
      formData.value.driver_contact = data.contact || "";
      formData.value.car_photo = data.car_photo || "";
      carNumbers.value = data.infos || [];
      const def = data.infos?.find((c) => c.is_default === 1);
      if (def) formData.value.car_number = def.id;
    }
  } catch (e) {
    toast.error("Failed to load driver details");
  }
};

const previousAction = () => {
  if (authStore.isAdmin || authStore.isSaleAdmin) {
    currentStep.value = 1;
  } else {
    currentStep.value--;
  }
};

// ── Load existing data ─────────────────────────────────
const loadDriverData = async () => {
  if (!props.itemData?.id) {
    resetForm();
    console.log("reset");

    return;
  }
  loading.value = true;
  try {
    const res = await carBookingStore.getDetailAction(props.itemData.id);
    console.log(res, "this is result");

    const d = res?.result;

    // Helper: pull from API result first, fallback to prop itemData
    const item = props.itemData;

    formData.value = {
      supplier_id:
        d?.supplier_id || item?.reservation_supplier_info?.supplier_id || "",
      driver_id: d?.driver_id || "",
      driver_contact: d?.driver_contact || "",
      car_number: d?.driver_info_id || "",
      cost_price:
        d?.cost_price || item?.price_snapshot?.cost_price || item?.cost || "",
      car_photo: d?.car_photo || "",
    };

    tripForm.value = {
      total_pax: d?.total_pax || item?.total_pax || item?.total_guest || "",
      pickup_time: d?.pickup_time || item?.pickup_time || "",
      pickup_location: d?.pickup_location || item?.pickup_location || "",
      dropoff_location: d?.dropoff_location || item?.dropoff_location || "",
      route_plan:
        d?.route_plan && d.route_plan !== "null"
          ? d.route_plan
          : item?.route_plan && item.route_plan !== "null"
          ? item.route_plan
          : "",
      special_request: d?.special_request || item?.special_request || "",
      // Auto-fill from customer_info
      car_customer_contact:
        d?.car_customer_contact || item?.customer_info?.phone_number || "",
      car_comment: d?.car_comment,
      is_checked: d?.is_checked == 1 ? true : false,
    };

    lineForm.value = {
      is_driver_collect: d?.is_driver_collect == 1,
      car_payment_method: d?.car_payment_method || "",
      car_total_collect: Number(d?.car_total_collect) || 0,
    };

    if (formData.value.supplier_id) await onSupplierChange();
    // if (formData.value.driver_id)
    //   await onDriverChange(formData.value.driver_id);
  } catch (e) {
    toast.error("Failed to load driver details");
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  tripForm.value = {
    total_pax: "",
    pickup_time: "",
    pickup_location: "",
    dropoff_location: "",
    route_plan: "",
    special_request: "",
    car_customer_contact: "",
    car_comment: "",
    is_checked: false,
  };
  formData.value = {
    supplier_id: "",
    driver_id: "",
    driver_contact: "",
    car_number: "",
    cost_price: "",
    car_photo: "",
  };
  lineForm.value = {
    is_driver_collect: false,
    car_payment_method: "",
    car_total_collect: 0,
  };
  carNumbers.value = [];
  lineMessage.value = "";
  currentStep.value = 1;
};

// ── Save Assignment ────────────────────────────────────
const saveDriver = async () => {
  try {
    saving.value = true;
    const frmData = new FormData();
    frmData.append("supplier_id", formData.value.supplier_id || "");
    frmData.append("driver_id", formData.value.driver_id || "");
    frmData.append("driver_contact", formData.value.driver_contact || "");
    frmData.append("driver_info_id", formData.value.car_number || "");
    frmData.append("cost_price", formData.value.cost_price || "");
    frmData.append("pickup_location", tripForm.value.pickup_location || "");
    frmData.append("dropoff_location", tripForm.value.dropoff_location || "");
    frmData.append("total_pax", tripForm.value.total_pax || "");
    frmData.append("route_plan", tripForm.value.route_plan || "");
    frmData.append("special_request", tripForm.value.special_request || "");
    frmData.append("pickup_time", tripForm.value.pickup_time || "");
    frmData.append("is_checked", tripForm.value.is_checked ? 1 : 0);
    frmData.append("car_comment", tripForm.value.car_comment);
    frmData.append(
      "is_driver_collect",
      lineForm.value.is_driver_collect ? 1 : 0,
    );
    frmData.append(
      "car_customer_contact",
      tripForm.value.car_customer_contact || "",
    );

    if (lineForm.value.is_driver_collect) {
      frmData.append(
        "car_total_collect",
        lineForm.value.car_total_collect || "",
      );
      frmData.append(
        "car_payment_method",
        lineForm.value.car_payment_method || "",
      );
      frmData.append("extra_collect_amount", computedExtraCollect.value || "");
    }

    if (formData.value.cost_price && props.itemData?.quantity) {
      frmData.append(
        "total_cost_price",
        formData.value.cost_price * props.itemData.quantity,
      );
    }

    const res = await carBookingStore.addNewAction(frmData, props.itemData?.id);
    console.log(res, "this is res");

    if (res?.status === 1) {
      toast.success("Driver assigned successfully");
      // Make sure refresh completes
      await loadDriverData();
      return true; // Return success
    } else {
      toast.error("Failed to assign driver");
      return false; // Return failure
    }
  } catch (e) {
    toast.error("Failed to assign driver");
    return false;
  } finally {
    saving.value = false;
  }
};

const nextAction = async () => {
  const success = await saveDriver();

  console.log(success);

  if (success) {
    if (authStore.isAdmin || authStore.isSaleAdmin) {
      console.log("emit");

      currentStep.value = 3;
    } else {
      currentStep.value++;
    }
  } else {
    console.log("hello");
  }
};

// ── LINE message builder ───────────────────────────────
const buildLineMessage = () => {
  const item = props.itemData;
  const group = props.groupData;
  const saleAmountValue = saleAmount.value;

  const contact =
    tripForm.value.car_customer_contact ||
    item?.customer_info?.phone_number ||
    "-";

  const paymentBlock = lineForm.value.is_driver_collect
    ? `\nPayment Method: ${lineForm.value.car_payment_method || "-"}
Sale Amount: ${saleAmountValue}
Total Collect: ${lineForm.value.car_total_collect || 0}
Extra Collect: ${computedExtraCollect.value}`
    : `\nPayment Method: xxxx
Sale Amount: xxxx
Total Collect: xxxx
Extra Collect: xxxx`;

  lineMessage.value = `CRMID: ${item?.crm_id || "-"}
C. Name: ${group?.customer_name || item?.customer_name || "-"}
Contact: ${contact}

S.Date: ${formatDate(item?.service_date)}
Pickup Time: ${tripForm.value.pickup_time || "-"}
Pickup Location: ${tripForm.value.pickup_location || "-"}
Dropoff Location: ${tripForm.value.dropoff_location || "-"}

Routeplan: ${tripForm.value.route_plan || "-"}

Product Variation: ${item?.variation_name || "-"}${paymentBlock}

Special Request: ${tripForm.value.special_request || "-"}`;
};

// ── Send to LINE ───────────────────────────────────────
const handleSendToLine = async () => {
  if (!lineMessage.value.trim()) {
    toast.error("Message is empty");
    return;
  }

  sendingLine.value = true;
  try {
    const payload = {
      pickup_time: tripForm.value.pickup_time || "",
      pickup_location: tripForm.value.pickup_location || "",
      dropoff_location: tripForm.value.dropoff_location || "",
      route_plan: tripForm.value.route_plan || "",
      special_request: tripForm.value.special_request || "",
      is_driver_collect: lineForm.value.is_driver_collect ? 1 : 0,
      extra_collect_amount: lineForm.value.is_driver_collect
        ? computedExtraCollect.value
        : "0",
      car_customer_contact: tripForm.value.car_customer_contact || "",
      car_total_collect: lineForm.value.car_total_collect || 0,
      car_payment_method: lineForm.value.car_payment_method || "",
      message: lineMessage.value,
      edited_data: {
        crm_id: props.itemData?.crm_id || "",
        customer_name:
          props.groupData?.customer_name || props.itemData?.customer_name || "",
        contact: tripForm.value.car_customer_contact || "",
        service_date: props.itemData?.service_date || "",
        pickup_time: tripForm.value.pickup_time || "",
        pickup_location: tripForm.value.pickup_location || "",
        dropoff_location: tripForm.value.dropoff_location || "",
        route_plan: tripForm.value.route_plan || "",
        product_variation: props.itemData?.variation_name || "",
        special_request: tripForm.value.special_request || "",
        is_driver_collect: lineForm.value.is_driver_collect ? 1 : 0,
        car_customer_contact: tripForm.value.car_customer_contact || "",
        car_payment_method: lineForm.value.car_payment_method || "",
        car_total_collect: lineForm.value.car_total_collect || 0,
        extra_collect: computedExtraCollect.value,
      },
    };

    const saveRes = await carBookingStore.sendLineAction(
      props.itemData?.id,
      payload,
    );

    if (saveRes?.status !== 1) {
      toast.error(saveRes?.message || "Failed to save booking");
      return;
    }

    await messageStore.sendLineMessage(
      saveRes.result?.sent_message ?? lineMessage.value,
    );

    toast.success("Saved & sent to LINE successfully");
    emit("refresh");
    emit("close");
  } catch (e) {
    console.error("Error sending to LINE:", e);
    toast.error(e.response?.data?.message || "Failed to send to LINE");
  } finally {
    sendingLine.value = false;
  }
};

const checkedAndClose = async () => {
  tripForm.value.is_checked = true;
  await saveDriver();
  emit("close");
};

// ── Lifecycle ──────────────────────────────────────────
onMounted(async () => {
  try {
    await supplierStore.getSimpleListAction();
    await driverStore.getSimpleListAction();
  } catch (e) {
    console.error("Error loading initial data:", e);
  }
});

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      loadDriverData();
    } else {
      resetForm();
    }
  },
  { immediate: true }, // Add this to control initial load
);
</script>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
.animate-shimmer {
  animation: shimmer 2s infinite;
}
</style>
