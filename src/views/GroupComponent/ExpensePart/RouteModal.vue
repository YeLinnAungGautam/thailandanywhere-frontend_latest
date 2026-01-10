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
          <TruckIcon class="w-6 h-6 text-[#FF613c]" />
          {{ routeData ? "Edit Route Details" : "Add Route Details" }}
          <span class="text-xs font-normal text-gray-500 ml-2">
            ({{ itemData?.car?.name || "Car Booking" }})
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
        <!-- Left Sidebar - Steps -->
        <div
          class="w-72 bg-gradient-to-br from-[#FF613c]/5 to-orange-50 border-r p-6 overflow-y-auto"
        >
          <div class="space-y-1 relative">
            <!-- Vertical Line -->
            <div
              class="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-[#FF613c] via-orange-300 to-gray-200"
            ></div>

            <!-- Step 1: Basic Info -->
            <div
              @click="currentStep = 1"
              :class="[
                'relative flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300',
                currentStep === 1
                  ? 'bg-white shadow-lg scale-105'
                  : currentStep > 1
                  ? 'hover:bg-white/50'
                  : 'hover:bg-white/30',
              ]"
            >
              <div class="relative z-10 flex-shrink-0">
                <div
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                    currentStep === 1
                      ? 'bg-[#FF613c] text-white shadow-lg shadow-[#FF613c]/50 ring-4 ring-[#FF613c]/20'
                      : currentStep > 1
                      ? 'bg-[#FF613c] text-white'
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
                  class="absolute inset-0 rounded-full bg-[#FF613c] animate-ping opacity-20"
                ></div>
              </div>

              <div class="flex-1 min-w-0 pt-0.5">
                <h3
                  :class="[
                    'text-sm font-bold mb-0.5 transition-colors',
                    currentStep === 1
                      ? 'text-[#FF613c]'
                      : currentStep > 1
                      ? 'text-gray-800'
                      : 'text-gray-400',
                  ]"
                >
                  Basic Information
                </h3>
                <p class="text-[10px] text-gray-500 mt-0.5">
                  Contact & timing details
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

            <!-- Step 2: Locations -->
            <div
              @click="currentStep = 2"
              :class="[
                'relative flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300',
                currentStep === 2
                  ? 'bg-white shadow-lg scale-105'
                  : currentStep > 2
                  ? 'hover:bg-white/50'
                  : 'hover:bg-white/30',
              ]"
            >
              <div class="relative z-10 flex-shrink-0">
                <div
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                    currentStep === 2
                      ? 'bg-[#FF613c] text-white shadow-lg shadow-[#FF613c]/50 ring-4 ring-[#FF613c]/20'
                      : currentStep > 2
                      ? 'bg-[#FF613c] text-white'
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
                  class="absolute inset-0 rounded-full bg-[#FF613c] animate-ping opacity-20"
                ></div>
              </div>

              <div class="flex-1 min-w-0 pt-0.5">
                <h3
                  :class="[
                    'text-sm font-bold mb-0.5 transition-colors',
                    currentStep === 2
                      ? 'text-[#FF613c]'
                      : currentStep > 2
                      ? 'text-gray-800'
                      : 'text-gray-400',
                  ]"
                >
                  Locations
                </h3>
                <p class="text-[10px] text-gray-500 mt-0.5">
                  Pickup & dropoff points
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

            <!-- Step 3: Route & Request -->
            <div
              @click="currentStep = 3"
              :class="[
                'relative flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300',
                currentStep === 3
                  ? 'bg-white shadow-lg scale-105'
                  : currentStep > 3
                  ? 'hover:bg-white/50'
                  : 'hover:bg-white/30',
              ]"
            >
              <div class="relative z-10 flex-shrink-0">
                <div
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                    currentStep === 3
                      ? 'bg-[#FF613c] text-white shadow-lg shadow-[#FF613c]/50 ring-4 ring-[#FF613c]/20'
                      : currentStep > 3
                      ? 'bg-[#FF613c] text-white'
                      : 'bg-white text-gray-400 border-2 border-gray-300',
                  ]"
                >
                  <CheckCircleIcon
                    v-if="isStep3Complete && currentStep !== 3"
                    class="w-5 h-5"
                  />
                  <span v-else>3</span>
                </div>
                <div
                  v-if="currentStep === 3"
                  class="absolute inset-0 rounded-full bg-[#FF613c] animate-ping opacity-20"
                ></div>
              </div>

              <div class="flex-1 min-w-0 pt-0.5">
                <h3
                  :class="[
                    'text-sm font-bold mb-0.5 transition-colors',
                    currentStep === 3
                      ? 'text-[#FF613c]'
                      : currentStep > 3
                      ? 'text-gray-800'
                      : 'text-gray-400',
                  ]"
                >
                  Route & Requests
                </h3>
                <p class="text-[10px] text-gray-500 mt-0.5">
                  Plan & special requests
                </p>
              </div>

              <div v-if="isStep3Complete" class="flex-shrink-0">
                <div
                  class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <CheckCircleIcon class="w-4 h-4 text-green-600" />
                </div>
              </div>
            </div>

            <!-- Step 4: Payment -->
            <div
              @click="currentStep = 4"
              :class="[
                'relative flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300',
                currentStep === 4
                  ? 'bg-white shadow-lg scale-105'
                  : currentStep > 4
                  ? 'hover:bg-white/50'
                  : 'hover:bg-white/30',
              ]"
            >
              <div class="relative z-10 flex-shrink-0">
                <div
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                    currentStep === 4
                      ? 'bg-[#FF613c] text-white shadow-lg shadow-[#FF613c]/50 ring-4 ring-[#FF613c]/20'
                      : currentStep > 4
                      ? 'bg-[#FF613c] text-white'
                      : 'bg-white text-gray-400 border-2 border-gray-300',
                  ]"
                >
                  <CheckCircleIcon
                    v-if="isStep4Complete && currentStep !== 4"
                    class="w-5 h-5"
                  />
                  <span v-else>4</span>
                </div>
                <div
                  v-if="currentStep === 4"
                  class="absolute inset-0 rounded-full bg-[#FF613c] animate-ping opacity-20"
                ></div>
              </div>

              <div class="flex-1 min-w-0 pt-0.5">
                <h3
                  :class="[
                    'text-sm font-bold mb-0.5 transition-colors',
                    currentStep === 4
                      ? 'text-[#FF613c]'
                      : currentStep > 4
                      ? 'text-gray-800'
                      : 'text-gray-400',
                  ]"
                >
                  Payment Details
                </h3>
                <p class="text-[10px] text-gray-500 mt-0.5">
                  Collection & amount
                </p>
              </div>

              <div v-if="isStep4Complete" class="flex-shrink-0">
                <div
                  class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <CheckCircleIcon class="w-4 h-4 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          <!-- Progress Section -->
          <div class="mt-8 pt-6 border-t border-orange-200">
            <div
              class="flex items-center justify-between text-xs font-medium text-gray-700 mb-3"
            >
              <span>Overall Progress</span>
              <span class="text-[#FF613c] font-bold"
                >{{ completionPercentage }}%</span
              >
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                class="bg-gradient-to-r from-[#FF613c] to-orange-400 h-2.5 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                :style="{ width: completionPercentage + '%' }"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
                ></div>
              </div>
            </div>
            <div class="mt-2 text-[10px] text-gray-500 text-center">
              {{ Math.round(completionPercentage / 25) }} of 4 steps completed
            </div>
          </div>
        </div>

        <!-- Right Content Area -->
        <div class="flex-1 overflow-y-auto p-6">
          <!-- Step 1: Basic Info -->
          <div v-show="currentStep === 1" class="space-y-4">
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">
                Basic Information
              </h3>
              <p class="text-[10px] text-gray-500">
                Set pickup time, contact details, and passenger count
              </p>
            </div>

            <!-- Car Info Display -->
            <div
              class="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 mb-4 border border-orange-200"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm"
                >
                  <TruckIcon class="w-6 h-6 text-[#FF613c]" />
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
                  <p class="text-xs font-medium text-[#FF613c]">
                    {{ itemData?.crm_id }}
                  </p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <!-- Pickup Time -->
              <div>
                <label
                  class="text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1"
                >
                  <svg
                    class="w-4 h-4 text-[#FF613c]"
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
                  Pickup Time *
                </label>
                <input
                  type="time"
                  v-model="formData.pickup_time"
                  class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20 focus:border-[#FF613c] disabled:bg-gray-50"
                />
              </div>

              <!-- Phone Number -->
              <div>
                <label
                  class="text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1"
                >
                  <svg
                    class="w-4 h-4 text-[#FF613c]"
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
                  Phone Number
                </label>
                <input
                  type="text"
                  v-model="formData.contact_number"
                  placeholder="Enter contact number"
                  class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20 focus:border-[#FF613c]"
                />
              </div>
            </div>

            <!-- Total Pax -->
            <div>
              <label
                class="text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1"
              >
                <svg
                  class="w-4 h-4 text-[#FF613c]"
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
                Total Passengers
              </label>
              <input
                type="number"
                v-model="formData.total_pax"
                placeholder="Enter total passengers"
                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20 focus:border-[#FF613c]"
              />
            </div>
          </div>

          <!-- Step 2: Locations -->
          <div v-show="currentStep === 2" class="space-y-4">
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">
                Location Details
              </h3>
              <p class="text-[10px] text-gray-500">
                Specify pickup and dropoff locations
              </p>
            </div>

            <!-- Pickup Location -->
            <div>
              <label
                class="text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1"
              >
                <svg
                  class="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Pickup Location
              </label>
              <textarea
                v-model="formData.pickup_location"
                placeholder="Enter pickup location details"
                rows="3"
                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20 focus:border-[#FF613c]"
              ></textarea>
            </div>

            <!-- Dropoff Location -->
            <div>
              <label
                class="text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1"
              >
                <svg
                  class="w-4 h-4 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Dropoff Location
              </label>
              <textarea
                v-model="formData.dropoff_location"
                placeholder="Enter dropoff location details"
                rows="3"
                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20 focus:border-[#FF613c]"
              ></textarea>
            </div>
          </div>

          <!-- Step 3: Route & Request -->
          <div v-show="currentStep === 3" class="space-y-4">
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">
                Route Plan & Special Requests
              </h3>
              <p class="text-[10px] text-gray-500">
                Add detailed itinerary and special requirements
              </p>
            </div>

            <!-- Route Plan -->
            <div>
              <label
                class="text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1"
              >
                <svg
                  class="w-4 h-4 text-[#FF613c]"
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
                v-model="formData.route_plan"
                placeholder="Enter detailed route plan (e.g., Airport → Hotel → Temple → Restaurant → Return)"
                rows="6"
                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20 focus:border-[#FF613c]"
              ></textarea>
            </div>

            <!-- Special Request -->
            <div>
              <label
                class="text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1"
              >
                <svg
                  class="w-4 h-4 text-[#FF613c]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                Special Requests
              </label>
              <textarea
                v-model="formData.special_request"
                placeholder="Enter any special requests (e.g., child seat, wheelchair access, stops)"
                rows="3"
                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20 focus:border-[#FF613c]"
              ></textarea>
            </div>
          </div>

          <!-- Step 4: Payment -->
          <div v-show="currentStep === 4" class="space-y-4">
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">
                Payment Information
              </h3>
              <p class="text-[10px] text-gray-500">
                Set collection method and extra charges
              </p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <!-- Extra Collect Amount -->
              <div>
                <label
                  class="text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1"
                >
                  <svg
                    class="w-4 h-4 text-[#FF613c]"
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
                  Extra Collect Amount
                </label>
                <div class="relative">
                  <input
                    type="number"
                    v-model="formData.extra_collect_amount"
                    placeholder="0.00"
                    class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20 focus:border-[#FF613c]"
                  />
                  <span
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500"
                    >THB</span
                  >
                </div>
              </div>

              <!-- Driver Collect Toggle -->
              <div>
                <label
                  class="text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1"
                >
                  <svg
                    class="w-4 h-4 text-[#FF613c]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Driver Collection
                </label>
                <div
                  class="flex items-center gap-3 h-[42px] bg-gray-50 rounded-lg px-4 border border-gray-200"
                >
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      :value="1"
                      v-model="formData.is_driver_collect"
                      class="w-4 h-4 text-[#FF613c] focus:ring-[#FF613c]"
                    />
                    <span class="text-sm font-medium text-gray-700">Yes</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      :value="0"
                      v-model="formData.is_driver_collect"
                      class="w-4 h-4 text-[#FF613c] focus:ring-[#FF613c]"
                    />
                    <span class="text-sm font-medium text-gray-700">No</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Summary Card -->
            <div
              class="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200"
            >
              <h4
                class="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2"
              >
                <svg
                  class="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                Booking Summary
              </h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Pickup Time:</span>
                  <span class="font-medium text-gray-900">{{
                    formData.pickup_time || "-"
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Total Passengers:</span>
                  <span class="font-medium text-gray-900">{{
                    formData.total_pax || "-"
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Extra Collection:</span>
                  <span class="font-medium text-green-600"
                    >{{ formData.extra_collect_amount || 0 }} THB</span
                  >
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Driver Collects:</span>
                  <span
                    :class="
                      formData.is_driver_collect === 1
                        ? 'text-green-600'
                        : 'text-gray-900'
                    "
                    class="font-medium"
                  >
                    {{
                      formData.is_driver_collect === 1
                        ? "Yes"
                        : formData.is_driver_collect === 0
                        ? "No"
                        : "-"
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="border-t p-6 pt-4 flex items-center justify-end gap-3 bg-gray-50"
      >
        <button
          @click="$emit('close')"
          :disabled="saving"
          class="px-4 py-2.5 bg-white border border-gray-300 text-sm rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>

        <button
          v-if="currentStep > 1"
          @click="currentStep--"
          :disabled="loading || saving"
          class="px-4 py-2.5 bg-gray-200 text-black text-sm rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <ChevronLeftIcon class="w-4 h-4" />
          Previous
        </button>

        <button
          v-if="currentStep < 4"
          @click="currentStep++"
          :disabled="loading || saving"
          class="px-4 py-2.5 bg-[#FF613c] text-white text-sm rounded-lg hover:bg-[#e55139] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Next
          <ChevronRightIcon class="w-4 h-4" />
        </button>

        <button
          v-if="currentStep === 4"
          @click="saveRoute"
          :disabled="saving"
          class="px-4 py-2.5 bg-[#FF613c] text-white text-sm rounded-lg hover:bg-[#e55139] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
            saving ? "Saving..." : routeData ? "Update Route" : "Create Route"
          }}
        </button>
      </div>
    </DialogPanel>
  </Modal>
</template>

<script setup>
import { ref, watch, computed } from "vue";
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
import Modal from "../../../components/Modal.vue";

const props = defineProps({
  isOpen: Boolean,
  routeData: Object,
  itemData: Object,
  groupId: [String, Number],
});

const emit = defineEmits(["close", "refresh"]);

const toast = useToast();
const carBookingStore = useCarBookingStore();

const loading = ref(false);
const saving = ref(false);
const currentStep = ref(1);

const formData = ref({
  pickup_time: "",
  contact_number: "",
  total_pax: "",
  pickup_location: "",
  dropoff_location: "",
  special_request: "",
  route_plan: "",
  extra_collect_amount: "",
  is_driver_collect: null,
});

// Computed Properties
const isStep1Complete = computed(() => {
  return (
    formData.value.pickup_time &&
    formData.value.contact_number &&
    formData.value.total_pax
  );
});

const isStep2Complete = computed(() => {
  return formData.value.pickup_location && formData.value.dropoff_location;
});

const isStep3Complete = computed(() => {
  return formData.value.route_plan;
});

const isStep4Complete = computed(() => {
  return formData.value.is_driver_collect !== null;
});

const completionPercentage = computed(() => {
  let completed = 0;
  if (isStep1Complete.value) completed++;
  if (isStep2Complete.value) completed++;
  if (isStep3Complete.value) completed++;
  if (isStep4Complete.value) completed++;
  return (completed / 4) * 100;
});

// Helper Functions
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const monthNames = [
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
    monthNames[date.getMonth()]
  } ${date.getFullYear()}`;
};

const loadRouteData = async () => {
  if (!props.routeData?.id) {
    resetForm();
    return;
  }

  loading.value = true;
  try {
    const response = await carBookingStore.getDetailAction(props.routeData.id);
    if (response?.result) {
      const data = response.result;
      formData.value = {
        pickup_time: data.pickup_time || "",
        contact_number: data.contact_number || "",
        total_pax: data.total_pax || "",
        pickup_location: data.pickup_location || "",
        dropoff_location: data.dropoff_location || "",
        special_request: data.special_request || "",
        route_plan: data.route_plan === "null" ? "" : data.route_plan || "",
        extra_collect_amount: data.extra_collect || "",
        is_driver_collect: data.is_driver_collect,
      };
    }
  } catch (error) {
    console.error("Error loading route:", error);
    toast.error("Failed to load route details");
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  formData.value = {
    pickup_time: "",
    contact_number: "",
    total_pax: "",
    pickup_location: "",
    dropoff_location: "",
    special_request: "",
    route_plan: "",
    extra_collect_amount: "",
    is_driver_collect: null,
  };
  currentStep.value = 1;
};

const saveRoute = async () => {
  try {
    saving.value = true;

    const frmData = new FormData();
    frmData.append("pickup_time", formData.value.pickup_time || "");
    frmData.append("contact_number", formData.value.contact_number || "");
    frmData.append("total_pax", formData.value.total_pax || "");
    frmData.append("pickup_location", formData.value.pickup_location || "");
    frmData.append("dropoff_location", formData.value.dropoff_location || "");
    frmData.append("special_request", formData.value.special_request || "");
    frmData.append("route_plan", formData.value.route_plan || "");
    frmData.append(
      "extra_collect_amount",
      formData.value.extra_collect_amount || "0"
    );

    if (formData.value.is_driver_collect !== null) {
      frmData.append("is_driver_collect", formData.value.is_driver_collect);
    }

    const routeId = props.routeData?.id;
    const response = await carBookingStore.addNewAction(frmData, routeId);

    if (response?.status === 1) {
      toast.success(
        props.routeData
          ? "Route updated successfully"
          : "Route added successfully"
      );
      emit("close");
      emit("refresh");
      resetForm();
    } else {
      toast.error("Failed to save route details");
    }
  } catch (error) {
    console.error("Error saving route:", error);
    toast.error("Failed to save route details");
  } finally {
    saving.value = false;
  }
};

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      loadRouteData();
    } else {
      resetForm();
    }
  }
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
