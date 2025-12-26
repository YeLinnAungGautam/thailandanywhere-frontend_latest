<!-- InvoiceModal.vue -->
<template>
  <Modal :marginTop="5" :isOpen="isOpen" @closeModal="handleClose">
    <DialogPanel
      class="w-full max-w-6xl transform rounded-xl bg-white text-left align-middle shadow-xl transition-all max-h-[95vh] overflow-hidden flex flex-col"
    >
      <!-- Header -->
      <DialogTitle
        as="div"
        class="text-lg font-semibold text-gray-900 p-6 pb-4 flex justify-between items-center border-b"
      >
        <div class="flex items-center gap-2">
          <DocumentDuplicateIcon class="w-6 h-6 text-[#FF613c]" />
          {{ invoiceData?.id ? "Edit Invoice" : "Add New Invoice" }}
          <span class="text-xs font-normal text-gray-500 ml-2">
            ({{ groupData?.booking_crm_id }})
          </span>
        </div>
        <button
          @click="handleClose"
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

            <!-- Step 1: Product Details -->
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
              <!-- Step Number Circle -->
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
                <!-- Pulse Animation for Active Step -->
                <div
                  v-if="currentStep === 1"
                  class="absolute inset-0 rounded-full bg-[#FF613c] animate-ping opacity-20"
                ></div>
              </div>

              <!-- Step Content -->
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
                  Product Details
                </h3>

                <p class="text-[10px] text-gray-500 mt-0.5">
                  About the product
                </p>
              </div>

              <!-- Completion Badge -->
              <div v-if="isStep1Complete" class="flex-shrink-0">
                <div
                  class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <CheckCircleIcon class="w-4 h-4 text-green-600" />
                </div>
              </div>
            </div>

            <!-- Step 2: Dates -->
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
                  Dates
                </h3>

                <p class="text-[10px] text-gray-500 mt-0.5">
                  Receipt & service dates
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

            <!-- Step 3: Amount -->
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
                  Amount Details
                </h3>

                <p class="text-[10px] text-gray-500 mt-0.5">
                  Tax & total amount
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

            <!-- Step 4: Image -->
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
                  Invoice Document
                </h3>

                <p class="text-[10px] text-gray-500 mt-0.5">
                  Upload invoice image
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
                <!-- Shimmer Effect -->
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
          <!-- Step 1: Product Details -->
          <div v-show="currentStep === 1" class="space-y-4">
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">
                Product Details
              </h3>
              <p class="text-[10px] text-gray-500">
                Select the product type and search for the specific product
              </p>
            </div>

            <!-- Invoice Number -->
            <div>
              <label class="text-xs font-medium text-gray-700 mb-1.5 block">
                Invoice Number
              </label>
              <input
                type="text"
                v-model="formData.invoice_number"
                placeholder="Enter invoice number (optional)"
                :disabled="loading"
                class="border text-sm border-gray-200 px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20 focus:border-[#FF613c] disabled:bg-gray-50"
              />
            </div>

            <!-- Product Type -->
            <div>
              <label class="text-xs font-medium text-gray-700 mb-1.5 block">
                Product Type *
              </label>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  v-for="status in invoiceOptions"
                  :key="status.value"
                  :disabled="true"
                  @click="onProductTypeChange"
                  :class="[
                    'flex items-center gap-3 px-4 py-3 border-2 rounded-lg transition-all',
                    formData.product_type === status.value
                      ? `border-${status.color}-500 bg-${status.color}-50 shadow-md`
                      : `border-${status.color}-200 hover:bg-${status.color}-50`,
                  ]"
                >
                  <div :class="`p-2 bg-${status.color}-100 rounded-full`">
                    <component
                      :is="status.icon"
                      :class="`w-5 h-5 text-${status.color}-600`"
                    />
                  </div>
                  <div class="text-left flex-1">
                    <p class="text-sm font-medium text-gray-900">
                      {{ status.label }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ status.description }}
                    </p>
                  </div>
                  <div
                    v-if="formData.product_type === status.value"
                    class="flex-shrink-0"
                  >
                    <CheckIcon :class="`w-5 h-5 text-${status.color}-600`" />
                  </div>
                </button>
              </div>
              <p v-if="isAutoFilled" class="text-xs text-green-600 mt-1">
                ✓ Auto-filled from booking
              </p>
            </div>

            <!-- Product Name with Search -->
            <div>
              <label class="text-xs font-medium text-gray-700 mb-1.5 block">
                Product Name *
              </label>
              <div class="relative">
                <input
                  v-model="productSearch"
                  @input="onProductSearch"
                  @focus="showDropdown = true"
                  type="text"
                  placeholder="Search product..."
                  :disabled="!formData.product_type || loading || isAutoFilled"
                  class="border text-sm border-gray-200 px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20 focus:border-[#FF613c] disabled:bg-gray-50"
                  required
                />

                <!-- Dropdown -->
                <div
                  v-if="
                    showDropdown &&
                    !isAutoFilled &&
                    (filteredProducts.length > 0 || isSearchLoading)
                  "
                  class="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg"
                >
                  <div
                    v-if="isSearchLoading"
                    class="p-3 text-center text-gray-500 text-sm"
                  >
                    <div class="flex items-center justify-center space-x-2">
                      <div
                        class="animate-spin rounded-full h-4 w-4 border-b-2 border-[#FF613c]"
                      ></div>
                      <span>Searching...</span>
                    </div>
                  </div>

                  <div
                    v-else-if="
                      !isSearchLoading &&
                      filteredProducts.length === 0 &&
                      productSearch.length >= 2
                    "
                    class="p-3 text-center text-gray-500 text-sm"
                  >
                    No products found
                  </div>

                  <div
                    v-for="product in filteredProducts"
                    :key="product.id"
                    @click="selectProduct(product)"
                    class="p-2 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-b-0"
                  >
                    <div class="font-medium">{{ product.name }}</div>
                    <div class="text-xs text-gray-500">
                      {{ product.company_legal_name || product.legal_name }}
                    </div>
                  </div>
                </div>
              </div>
              <p v-if="isAutoFilled" class="text-xs text-green-600 mt-1">
                ✓ Auto-filled from booking
              </p>
            </div>

            <!-- Company Legal Name -->
            <div>
              <label class="text-xs font-medium text-gray-700 mb-1.5 block">
                Company Legal Name
              </label>
              <input
                v-model="formData.company_legal_name"
                type="text"
                placeholder="Auto-filled from product"
                class="border text-sm border-gray-200 px-4 py-3 rounded-lg w-full bg-gray-100 cursor-not-allowed"
              />
              <p
                v-if="formData.company_legal_name"
                class="text-xs text-green-600 mt-1"
              >
                ✓ Auto-filled from product
              </p>
            </div>
          </div>

          <!-- Step 2: Dates -->
          <div v-show="currentStep === 2" class="space-y-4">
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">
                Date Information
              </h3>
              <p class="text-[10px] text-gray-500">
                Set receipt date and service period
              </p>
            </div>

            <!-- Receipt Date -->
            <div>
              <label class="text-xs font-medium text-gray-700 mb-1.5 block">
                Receipt Date
              </label>
              <div class="flex items-center gap-2">
                <!-- Day Input -->
                <input
                  type="number"
                  v-model.number="receiptDay"
                  @input="updateReceiptDate"
                  placeholder="DD"
                  min="1"
                  max="31"
                  :disabled="loading"
                  class="w-16 border border-gray-300 px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent text-center disabled:bg-gray-50"
                />

                <!-- Month Input -->
                <input
                  type="number"
                  v-model.number="receiptMonth"
                  @input="updateReceiptDate"
                  placeholder="MM"
                  min="1"
                  max="12"
                  :disabled="loading"
                  class="w-16 border border-gray-300 px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent text-center disabled:bg-gray-50"
                />

                <!-- Year Input -->
                <input
                  type="number"
                  v-model.number="receiptYear"
                  @input="updateReceiptDate"
                  placeholder="YYYY"
                  min="2000"
                  max="2100"
                  :disabled="loading"
                  class="w-20 border border-gray-300 px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent text-center disabled:bg-gray-50"
                />

                <!-- Calendar Button -->
                <div class="relative">
                  <button
                    type="button"
                    @click="openReceiptDatePicker"
                    :disabled="loading"
                    class="h-10 px-4 flex items-center justify-center bg-[#FF613c] text-white rounded-lg hover:bg-[#e55139] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF613c] disabled:opacity-50"
                  >
                    <svg
                      class="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span class="text-sm ml-2">Choose Date</span>
                  </button>

                  <!-- Hidden Date Input -->
                  <input
                    ref="receiptDatePickerInput"
                    type="date"
                    v-model="receiptDateValue"
                    @change="updateFromReceiptDatePicker"
                    class="absolute opacity-0 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            <!-- Service Start Date -->
            <div>
              <label class="text-xs font-medium text-gray-700 mb-1.5 block">
                Service Start Date
              </label>
              <div class="flex items-center gap-2">
                <!-- Day Input -->
                <input
                  type="number"
                  v-model.number="serviceStartDay"
                  @input="updateServiceStartDate"
                  placeholder="DD"
                  min="1"
                  max="31"
                  :disabled="loading"
                  class="w-16 border border-gray-300 px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent text-center disabled:bg-gray-50"
                />

                <!-- Month Input -->
                <input
                  type="number"
                  v-model.number="serviceStartMonth"
                  @input="updateServiceStartDate"
                  placeholder="MM"
                  min="1"
                  max="12"
                  :disabled="loading"
                  class="w-16 border border-gray-300 px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent text-center disabled:bg-gray-50"
                />

                <!-- Year Input -->
                <input
                  type="number"
                  v-model.number="serviceStartYear"
                  @input="updateServiceStartDate"
                  placeholder="YYYY"
                  min="2000"
                  max="2100"
                  :disabled="loading"
                  class="w-20 border border-gray-300 px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent text-center disabled:bg-gray-50"
                />

                <!-- Calendar Button -->
                <div class="relative">
                  <button
                    type="button"
                    @click="openServiceStartDatePicker"
                    :disabled="loading"
                    class="h-10 px-4 flex items-center justify-center bg-[#FF613c] text-white rounded-lg hover:bg-[#e55139] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF613c] disabled:opacity-50"
                  >
                    <svg
                      class="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span class="text-sm ml-2">Choose Date</span>
                  </button>

                  <!-- Hidden Date Input -->
                  <input
                    ref="serviceStartDatePickerInput"
                    type="date"
                    v-model="serviceStartDateValue"
                    @change="updateFromServiceStartDatePicker"
                    class="absolute opacity-0 pointer-events-none"
                  />
                </div>
              </div>
              <p
                v-if="groupData?.firstest_service_date"
                class="text-xs text-green-600 mt-1"
              >
                ✓ Auto-filled: {{ groupData.firstest_service_date }}
              </p>
            </div>

            <!-- Service End Date -->
            <div>
              <label class="text-xs font-medium text-gray-700 mb-1.5 block">
                Service End Date
              </label>
              <div class="flex items-center gap-2">
                <!-- Day Input -->
                <input
                  type="number"
                  v-model.number="serviceEndDay"
                  @input="updateServiceEndDate"
                  placeholder="DD"
                  min="1"
                  max="31"
                  :disabled="loading"
                  class="w-16 border border-gray-300 px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent text-center disabled:bg-gray-50"
                />

                <!-- Month Input -->
                <input
                  type="number"
                  v-model.number="serviceEndMonth"
                  @input="updateServiceEndDate"
                  placeholder="MM"
                  min="1"
                  max="12"
                  :disabled="loading"
                  class="w-16 border border-gray-300 px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent text-center disabled:bg-gray-50"
                />

                <!-- Year Input -->
                <input
                  type="number"
                  v-model.number="serviceEndYear"
                  @input="updateServiceEndDate"
                  placeholder="YYYY"
                  min="2000"
                  max="2100"
                  :disabled="loading"
                  class="w-20 border border-gray-300 px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent text-center disabled:bg-gray-50"
                />

                <!-- Calendar Button -->
                <div class="relative">
                  <button
                    type="button"
                    @click="openServiceEndDatePicker"
                    :disabled="loading"
                    class="h-10 px-4 flex items-center justify-center bg-[#FF613c] text-white rounded-lg hover:bg-[#e55139] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF613c] disabled:opacity-50"
                  >
                    <svg
                      class="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span class="text-sm ml-2">Choose Date</span>
                  </button>

                  <!-- Hidden Date Input -->
                  <input
                    ref="serviceEndDatePickerInput"
                    type="date"
                    v-model="serviceEndDateValue"
                    @change="updateFromServiceEndDatePicker"
                    class="absolute opacity-0 pointer-events-none"
                  />
                </div>
              </div>
              <p
                v-if="groupData?.latest_service_date"
                class="text-xs text-green-600 mt-1"
              >
                ✓ Auto-filled: {{ groupData.latest_service_date }}
              </p>
            </div>
          </div>

          <!-- Step 3: Amount -->
          <div v-show="currentStep === 3" class="space-y-4">
            <div class="grid grid-cols-2 gap-x-4">
              <div class="space-y-4">
                <div class="mb-4">
                  <h3 class="text-lg font-semibold text-gray-900 mb-1">
                    Amount Details
                  </h3>
                  <p class="text-[10px] text-gray-500">
                    Enter tax withholding and total amounts
                  </p>
                </div>
                <!-- Total After Tax -->
                <div>
                  <label class="text-xs font-medium text-gray-700 mb-1.5 block">
                    Total After Tax (Auto-calculated)
                  </label>
                  <div class="relative">
                    <input
                      type="number"
                      step="0.01"
                      v-model="totalAfterTax"
                      placeholder="Auto-calculated"
                      class="border text-sm border-gray-200 px-4 py-3 rounded-lg w-full"
                    />
                    <div
                      v-if="totalAfterTax > 0"
                      class="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <span class="text-xs font-semibold text-green-600">
                        {{ formatCurrency(totalAfterTax) }}
                      </span>
                    </div>
                  </div>
                  <p
                    v-if="groupData?.total_cost_price"
                    class="text-xs text-blue-600 mt-1"
                  >
                    💡 Suggested:
                    {{ formatCurrency(groupData.total_cost_price) }} (from
                    booking cost)
                  </p>
                </div>
                <!-- Total Before Tax -->
                <div>
                  <label class="text-xs font-medium text-gray-700 mb-1.5 block">
                    Total Before Tax
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    v-model="formData.total_tax_amount"
                    placeholder="Enter tax amount"
                    :disabled="loading"
                    class="border text-sm border-gray-200 px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20 focus:border-[#FF613c] disabled:bg-gray-50"
                  />
                </div>
                <!-- Total Tax Withheld -->
                <div>
                  <label class="text-xs font-medium text-gray-700 mb-1.5 block">
                    Total Tax Withheld
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    v-model="formData.total_tax_withold"
                    placeholder="Enter tax withheld amount"
                    :disabled="loading"
                    class="border text-sm border-gray-200 px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20 focus:border-[#FF613c] disabled:bg-gray-50"
                  />
                </div>
              </div>
              <div
                class="bg-white border border-gray-200 rounded-xl px-4"
                v-if="groupData"
              >
                <p class="font-medium py-2 border-b border-gray-400">
                  Room Detail
                </p>
                <div
                  class="px-2 py-2 border-b border-gray-300"
                  v-for="room in (groupData.items && groupData.items) || []"
                  :key="room.id"
                >
                  <div class="flex justify-between space-x-3 items-start py-1">
                    <div>
                      <p class="text-sm font-medium text-gray-900">
                        {{ room.variant_name }}
                      </p>
                      <p class="text-xs text-gray-700">
                        Qty: {{ room.quantity }} | Nights: {{ room.days }}
                      </p>
                    </div>
                    <div>
                      <div class="text-sm font-semibold text-gray-900">
                        <p class="whitespace-nowrap">{{ room.checkin_date }}</p>

                        <p class="text-xs whitespace-nowrap">
                          to {{ room.checkout_date }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 4: Image -->
          <div v-show="currentStep === 4" class="space-y-4">
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">
                Invoice Document
              </h3>
              <p class="text-[10px] text-gray-500">
                Upload the invoice image or document
              </p>
            </div>

            <!-- Image Upload -->
            <div>
              <!-- Existing Image -->
              <div
                v-if="formData.file && !invoicePreview"
                class="w-full h-[300px]"
              >
                <img
                  :src="formData.file"
                  class="rounded-lg shadow hover:shadow-lg h-full object-contain w-full cursor-pointer border"
                  alt="Current invoice"
                  @click="viewImage(formData.file)"
                />
                <button
                  @click="formData.file = ''"
                  class="mt-3 w-full px-4 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition-colors"
                >
                  Remove Current Image
                </button>
              </div>

              <!-- Upload Area -->
              <div
                v-else-if="!formData.file && !invoicePreview"
                @click="openFileUpload"
                class="w-full h-[300px] border-2 rounded-lg border-dashed flex flex-col justify-center items-center text-[#FF613c] border-[#FF613c] cursor-pointer hover:bg-[#FF613c]/5 transition-colors"
              >
                <PlusCircleIcon class="w-12 h-12 text-[#FF613c] mb-2" />
                <span class="mt-2 text-sm font-medium">
                  Click to Upload Invoice Image
                </span>
                <span class="mt-1 text-xs text-gray-500">
                  PNG, JPG, JPEG up to 10MB
                </span>
              </div>

              <!-- Preview New Image -->
              <div v-else-if="invoicePreview" class="w-full h-[300px] relative">
                <img
                  :src="invoicePreview"
                  class="rounded-lg shadow h-full object-contain w-full cursor-pointer border"
                  alt="Invoice preview"
                  @click="viewImage(invoicePreview)"
                />
                <button
                  @click="clearImage"
                  class="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                >
                  <XMarkIcon class="w-5 h-5" />
                </button>
              </div>

              <input
                type="file"
                ref="fileInput"
                class="hidden"
                @change="handleFileChange"
                accept="image/*"
                :disabled="loading"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="border-t p-6 pt-4 flex items-center justify-end gap-3 bg-gray-50"
      >
        <button
          v-if="formData.id"
          @click="handleDelete"
          :disabled="loading"
          class="px-4 py-2.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span v-if="loading && currentAction === 'delete'">
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
          </span>
          Delete
        </button>

        <button
          @click="handleClose"
          :disabled="loading"
          class="px-4 py-2.5 bg-white border border-gray-300 text-sm rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>

        <!-- previous -->
        <!-- next -->
        <button
          v-if="currentStep > 1"
          @click="currentStep--"
          :disabled="loading"
          class="px-4 py-2.5 bg-gray-200 text-black text-sm rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <ChevronLeftIcon class="w-4 h-4" />
          Previous
        </button>

        <!-- next -->
        <button
          v-if="currentStep < 4"
          @click="currentStep++"
          :disabled="loading"
          class="px-4 py-2.5 bg-[#FF613c] text-white text-sm rounded-lg hover:bg-[#e55139] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Next
          <ChevronRightIcon class="w-4 h-4" />
        </button>

        <button
          v-if="currentStep == 4"
          @click="handleSave"
          :disabled="loading || !isFormValid"
          class="px-4 py-2.5 bg-[#FF613c] text-white text-sm rounded-lg hover:bg-[#e55139] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span v-if="loading && currentAction === 'save'">
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
          </span>
          {{ formData.id ? "Update Invoice" : "Create Invoice" }}
        </button>
      </div>
    </DialogPanel>
  </Modal>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import {
  XMarkIcon,
  PlusCircleIcon,
  DocumentDuplicateIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  TicketIcon,
  CheckIcon,
} from "@heroicons/vue/24/outline";
import Modal from "../../../components/Modal.vue";
import { useToast } from "vue-toastification";
import { useGroupStore } from "../../../stores/group";
import { useEntranceStore } from "../../../stores/entrance";
import { useHotelStore } from "../../../stores/hotel";
import Swal from "sweetalert2";

const props = defineProps({
  isOpen: Boolean,
  invoiceData: Object,
  groupData: Object,
  groupId: [String, Number],
});

const emit = defineEmits(["close", "refresh"]);

const toast = useToast();
const groupStore = useGroupStore();
const hotelStore = useHotelStore();
const entranceStore = useEntranceStore();

const loading = ref(false);
const currentAction = ref("");
const fileInput = ref(null);
const invoicePreview = ref("");
const invoiceFile = ref(null);
const productSearch = ref("");
const showDropdown = ref(false);
const filteredProducts = ref([]);
const isSearchLoading = ref(false);
const searchTimeout = ref(null);
const currentStep = ref(1);
const isAutoFilled = ref(false);

const formData = ref({
  id: "",
  product_type: "",
  product_id: null,
  company_legal_name: "",
  receipt_date: "",
  service_start_date: "",
  service_end_date: "",
  total_tax_withold: 0,
  total_tax_amount: 0,
  invoice_number: "",
  file: "",
});

const invoiceOptions = [
  {
    value: "App\\Models\\Hotel",
    label: "Hotel",
    description: "Hotel booking invoice",
    icon: HomeIcon,
    color: "green",
  },
  {
    value: "App\\Models\\Entrance",
    label: "Entrance",
    description: "Entrance ticket invoice",
    icon: TicketIcon,
    color: "gray",
  },
];

// Computed Properties

const totalAfterTax = ref(0);
const lastEditedField = ref("none"); // 'total_tax_amount', 'total_tax_withold', 'totalAfterTax', 'none'

// Watch totalAfterTax to auto-calculate the other two fields
watch(
  () => totalAfterTax.value,
  (newTotal) => {
    if (
      lastEditedField.value === "total_tax_amount" ||
      lastEditedField.value === "total_tax_withold"
    ) {
      return;
    }

    lastEditedField.value = "totalAfterTax";

    if (newTotal > 0) {
      // Calculate total_tax_amount = totalAfterTax / 1.07
      const calculatedTaxAmount = newTotal / 1.07;

      // Calculate total_tax_withold = totalAfterTax - total_tax_amount
      const calculatedTaxWithhold = newTotal - calculatedTaxAmount;

      formData.value.total_tax_amount =
        Math.round(calculatedTaxAmount * 100) / 100;
      formData.value.total_tax_withold =
        Math.round(calculatedTaxWithhold * 100) / 100;
    } else if (newTotal === 0) {
      formData.value.total_tax_amount = 0;
      formData.value.total_tax_withold = 0;
    }

    setTimeout(() => {
      lastEditedField.value = "none";
    }, 50);
  }
);

const isFormValid = computed(() => {
  return formData.value.product_type && formData.value.product_id;
});

const isStep1Complete = computed(() => {
  return (
    formData.value.product_type &&
    formData.value.product_id &&
    formData.value.company_legal_name
  );
});

const isStep2Complete = computed(() => {
  return formData.value.service_start_date && formData.value.service_end_date;
});

const isStep3Complete = computed(() => {
  return formData.value.total_tax_amount > 0;
});

const isStep4Complete = computed(() => {
  return formData.value.file || invoicePreview.value || invoiceFile.value;
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
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
  }).format(amount);
};

const formatDateDb = (dateString) => {
  if (!dateString) return "";
  if (dateString.includes("T")) {
    return dateString.replace("T", " ");
  }
  return dateString;
};

const parseDateToLocal = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const getStepClass = (step) => {
  if (currentStep.value === step) {
    return "bg-[#FF613c]/10 border-2 border-[#FF613c]";
  }
  return "bg-white border border-gray-200 hover:bg-gray-50";
};

const getStepNumberClass = (step) => {
  if (currentStep.value === step) {
    return "bg-[#FF613c] text-white";
  }
  if (
    (step === 1 && isStep1Complete.value) ||
    (step === 2 && isStep2Complete.value) ||
    (step === 3 && isStep3Complete.value) ||
    (step === 4 && isStep4Complete.value)
  ) {
    return "bg-green-500 text-white";
  }
  return "bg-gray-200 text-gray-600";
};

// Product Functions
const onProductTypeChange = () => {
  formData.value.product_id = null;
  formData.value.company_legal_name = "";
  productSearch.value = "";
  filteredProducts.value = [];
  showDropdown.value = false;
  if (searchTimeout.value) clearTimeout(searchTimeout.value);
};

const onProductSearch = async () => {
  if (searchTimeout.value) clearTimeout(searchTimeout.value);

  searchTimeout.value = setTimeout(async () => {
    if (!productSearch.value || productSearch.value.length < 2) {
      filteredProducts.value = [];
      showDropdown.value = false;
      return;
    }

    if (!formData.value.product_type) {
      toast.error("Please select product type first");
      return;
    }

    isSearchLoading.value = true;
    let response = null;

    try {
      if (formData.value.product_type === "App\\Models\\Hotel") {
        response = await hotelStore.getListAction({
          search: productSearch.value,
          limit: 10,
        });
      } else if (
        formData.value.product_type === "App\\Models\\EntranceTicket"
      ) {
        response = await entranceStore.getListAction({
          search: productSearch.value,
          limit: 10,
        });
      }

      filteredProducts.value = response?.result?.data || [];
      showDropdown.value = true;
    } catch (error) {
      console.error("Search error:", error);
      filteredProducts.value = [];
      toast.error("Failed to search products");
    } finally {
      isSearchLoading.value = false;
    }
  }, 500);
};

// Date input refs
const receiptDay = ref(null);
const receiptMonth = ref(null);
const receiptYear = ref(null);
const receiptDateValue = ref("");
const receiptDatePickerInput = ref(null);

const serviceStartDay = ref(null);
const serviceStartMonth = ref(null);
const serviceStartYear = ref(null);
const serviceStartDateValue = ref("");
const serviceStartDatePickerInput = ref(null);

const serviceEndDay = ref(null);
const serviceEndMonth = ref(null);
const serviceEndYear = ref(null);
const serviceEndDateValue = ref("");
const serviceEndDatePickerInput = ref(null);

// Update date when manual inputs change
const updateReceiptDate = () => {
  if (receiptDay.value && receiptMonth.value && receiptYear.value) {
    const date = new Date(
      receiptYear.value,
      receiptMonth.value - 1,
      receiptDay.value,
      12,
      0,
      0
    );
    if (!isNaN(date.getTime())) {
      formData.value.receipt_date = parseDateToLocal(date.toISOString());
      receiptDateValue.value = `${receiptYear.value}-${String(
        receiptMonth.value
      ).padStart(2, "0")}-${String(receiptDay.value).padStart(2, "0")}`;
    }
  }
};

const updateServiceStartDate = () => {
  if (
    serviceStartDay.value &&
    serviceStartMonth.value &&
    serviceStartYear.value
  ) {
    const date = new Date(
      serviceStartYear.value,
      serviceStartMonth.value - 1,
      serviceStartDay.value,
      12,
      0,
      0
    );
    if (!isNaN(date.getTime())) {
      formData.value.service_start_date = parseDateToLocal(date.toISOString());
      serviceStartDateValue.value = `${serviceStartYear.value}-${String(
        serviceStartMonth.value
      ).padStart(2, "0")}-${String(serviceStartDay.value).padStart(2, "0")}`;
    }
  }
};

const updateServiceEndDate = () => {
  if (serviceEndDay.value && serviceEndMonth.value && serviceEndYear.value) {
    const date = new Date(
      serviceEndYear.value,
      serviceEndMonth.value - 1,
      serviceEndDay.value,
      12,
      0,
      0
    );
    if (!isNaN(date.getTime())) {
      formData.value.service_end_date = parseDateToLocal(date.toISOString());
      serviceEndDateValue.value = `${serviceEndYear.value}-${String(
        serviceEndMonth.value
      ).padStart(2, "0")}-${String(serviceEndDay.value).padStart(2, "0")}`;
    }
  }
};

// Open date picker
const openReceiptDatePicker = () => {
  receiptDatePickerInput.value?.showPicker?.();
};

const openServiceStartDatePicker = () => {
  serviceStartDatePickerInput.value?.showPicker?.();
};

const openServiceEndDatePicker = () => {
  serviceEndDatePickerInput.value?.showPicker?.();
};

// Update from date picker
const updateFromReceiptDatePicker = () => {
  if (receiptDateValue.value) {
    const [year, month, day] = receiptDateValue.value.split("-");
    receiptDay.value = parseInt(day);
    receiptMonth.value = parseInt(month);
    receiptYear.value = parseInt(year);
    updateReceiptDate();
  }
};

const updateFromServiceStartDatePicker = () => {
  if (serviceStartDateValue.value) {
    const [year, month, day] = serviceStartDateValue.value.split("-");
    serviceStartDay.value = parseInt(day);
    serviceStartMonth.value = parseInt(month);
    serviceStartYear.value = parseInt(year);
    updateServiceStartDate();
  }
};

const updateFromServiceEndDatePicker = () => {
  if (serviceEndDateValue.value) {
    const [year, month, day] = serviceEndDateValue.value.split("-");
    serviceEndDay.value = parseInt(day);
    serviceEndMonth.value = parseInt(month);
    serviceEndYear.value = parseInt(year);
    updateServiceEndDate();
  }
};

// Watch formData dates to update inputs
watch(
  () => formData.value.receipt_date,
  (newVal) => {
    if (newVal) {
      const date = new Date(newVal);
      if (!isNaN(date.getTime())) {
        receiptDay.value = date.getDate();
        receiptMonth.value = date.getMonth() + 1;
        receiptYear.value = date.getFullYear();
        receiptDateValue.value = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      }
    } else {
      receiptDay.value = null;
      receiptMonth.value = null;
      receiptYear.value = null;
      receiptDateValue.value = "";
    }
  },
  { immediate: true }
);

watch(
  () => formData.value.service_start_date,
  (newVal) => {
    if (newVal) {
      const date = new Date(newVal);
      if (!isNaN(date.getTime())) {
        serviceStartDay.value = date.getDate();
        serviceStartMonth.value = date.getMonth() + 1;
        serviceStartYear.value = date.getFullYear();
        serviceStartDateValue.value = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      }
    } else {
      serviceStartDay.value = null;
      serviceStartMonth.value = null;
      serviceStartYear.value = null;
      serviceStartDateValue.value = "";
    }
  },
  { immediate: true }
);

watch(
  () => formData.value.service_end_date,
  (newVal) => {
    if (newVal) {
      const date = new Date(newVal);
      if (!isNaN(date.getTime())) {
        serviceEndDay.value = date.getDate();
        serviceEndMonth.value = date.getMonth() + 1;
        serviceEndYear.value = date.getFullYear();
        serviceEndDateValue.value = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      }
    } else {
      serviceEndDay.value = null;
      serviceEndMonth.value = null;
      serviceEndYear.value = null;
      serviceEndDateValue.value = "";
    }
  },
  { immediate: true }
);

const selectProduct = (product) => {
  formData.value.product_id = product.id;
  formData.value.company_legal_name =
    product.legal_name || product.company_legal_name || "";
  productSearch.value = product.name;
  showDropdown.value = false;
  if (searchTimeout.value) clearTimeout(searchTimeout.value);
};

const fetchProductDetails = async (productId, productType) => {
  try {
    let response = null;
    if (productType === "App\\Models\\Hotel") {
      response = await hotelStore.getDetailAction(productId);
    } else if (productType === "App\\Models\\EntranceTicket") {
      response = await entranceStore.getDetailAction(productId);
    }

    if (response?.result) {
      formData.value.company_legal_name =
        response.result.legal_name || response.result.company_legal_name || "";
      productSearch.value = response.result.name || "";
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
};

// File Functions
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    invoiceFile.value = file;
    invoicePreview.value = URL.createObjectURL(file);
  }
};

const openFileUpload = () => {
  if (!loading.value) fileInput.value?.click();
};

const clearImage = () => {
  invoiceFile.value = null;
  invoicePreview.value = "";
  if (fileInput.value) fileInput.value.value = "";
};

const viewImage = (url) => {
  window.open(url, "_blank");
};

// CRUD Functions
const handleSave = async () => {
  if (!isFormValid.value) {
    toast.error("Please complete all required fields");
    return;
  }

  currentAction.value = "save";

  if (formData.value.id) {
    await updateInvoice();
  } else {
    await createInvoice();
  }
};

const createInvoice = async () => {
  if (!invoiceFile.value) {
    toast.error("Please upload an invoice image");
    return;
  }

  try {
    loading.value = true;
    const frmData = new FormData();

    frmData.append("document_type", "booking_confirm_letter");
    frmData.append("documents[0][file]", invoiceFile.value);
    frmData.append(
      "documents[0][meta][total_tax_amount]",
      formData.value.total_tax_amount
    );
    frmData.append(
      "documents[0][meta][total_tax_withold]",
      formData.value.total_tax_withold
    );
    frmData.append(
      "documents[0][meta][company_legal_name]",
      formData.value.company_legal_name
    );
    frmData.append(
      "documents[0][meta][receipt_date]",
      formatDateDb(formData.value.receipt_date)
    );
    frmData.append(
      "documents[0][meta][service_start_date]",
      formatDateDb(formData.value.service_start_date)
    );
    frmData.append(
      "documents[0][meta][service_end_date]",
      formatDateDb(formData.value.service_end_date)
    );
    frmData.append("documents[0][meta][product_id]", formData.value.product_id);
    frmData.append("documents[0][meta][product_name]", productSearch.value);
    frmData.append(
      "documents[0][meta][product_type]",
      formData.value.product_type
    );
    frmData.append("documents[0][meta][total_after_tax]", totalAfterTax.value);
    frmData.append(
      "documents[0][meta][invoice_number]",
      formData.value.invoice_number
    );

    const response = await groupStore.groupDocumentCreateAction(
      frmData,
      props.groupId
    );

    if (response?.status === 1) {
      toast.success("Invoice created successfully");
      emit("refresh");
      handleClose();
    } else {
      throw new Error("Failed to create invoice");
    }
  } catch (error) {
    console.error("Error creating invoice:", error);
    toast.error("Failed to create invoice");
  } finally {
    loading.value = false;
    currentAction.value = "";
  }
};

const updateInvoice = async () => {
  try {
    loading.value = true;
    const frmData = new FormData();

    frmData.append("document_type", "booking_confirm_letter");
    if (invoiceFile.value) frmData.append("file", invoiceFile.value);
    frmData.append("meta[product_type]", formData.value.product_type);
    frmData.append("meta[product_id]", formData.value.product_id);
    frmData.append("meta[product_name]", productSearch.value);
    frmData.append(
      "meta[company_legal_name]",
      formData.value.company_legal_name
    );
    frmData.append(
      "meta[receipt_date]",
      formatDateDb(formData.value.receipt_date)
    );
    frmData.append(
      "meta[service_start_date]",
      formatDateDb(formData.value.service_start_date)
    );
    frmData.append(
      "meta[service_end_date]",
      formatDateDb(formData.value.service_end_date)
    );
    frmData.append("meta[total_tax_withold]", formData.value.total_tax_withold);
    frmData.append("meta[total_tax_amount]", formData.value.total_tax_amount);
    frmData.append("meta[total_after_tax]", totalAfterTax.value);
    frmData.append("meta[invoice_number]", formData.value.invoice_number);
    frmData.append("_method", "PUT");

    const response = await groupStore.groupDocumentUpdateAction(
      frmData,
      props.groupId,
      formData.value.id
    );

    if (response?.status === 1) {
      toast.success("Invoice updated successfully");
      emit("refresh");
      handleClose();
    } else {
      throw new Error("Failed to update invoice");
    }
  } catch (error) {
    console.error("Error updating invoice:", error);
    toast.error("Failed to update invoice");
  } finally {
    loading.value = false;
    currentAction.value = "";
  }
};

const handleDelete = async () => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        loading.value = true;
        currentAction.value = "delete";

        const response = await groupStore.groupDocumentDeleteAction(
          props.groupId,
          formData.value.id
        );

        if (response?.status === 1) {
          toast.success("Invoice deleted successfully");
          emit("refresh");
          handleClose();
        } else {
          throw new Error("Failed to delete invoice");
        }
      } catch (error) {
        console.error("Error deleting invoice:", error);
        toast.error("Failed to delete invoice");
      } finally {
        loading.value = false;
        currentAction.value = "";
      }
    }
  });
};

const handleClose = () => {
  formData.value = {
    id: "",
    product_type: "",
    product_id: null,
    company_legal_name: "",
    receipt_date: "",
    service_start_date: "",
    service_end_date: "",
    total_tax_withold: 0,
    total_tax_amount: 0,
    invoice_number: "",
    file: "",
  };
  productSearch.value = "";
  filteredProducts.value = [];
  showDropdown.value = false;
  invoicePreview.value = "";
  invoiceFile.value = null;
  currentStep.value = 1;
  isAutoFilled.value = false;
  if (fileInput.value) fileInput.value.value = "";
  if (searchTimeout.value) clearTimeout(searchTimeout.value);
  emit("close");
};

// Watchers
watch(
  () => props.invoiceData,
  (newData) => {
    if (newData && props.isOpen) {
      formData.value = {
        id: newData.id,
        file: newData.file,
        product_type: newData.meta?.product_type || "",
        product_id: newData.meta?.product_id || null,
        company_legal_name: newData.meta?.company_legal_name || "",
        receipt_date: newData.meta?.receipt_date || "",
        service_start_date: newData.meta?.service_start_date || "",
        service_end_date: newData.meta?.service_end_date || "",
        total_tax_withold: newData.meta?.total_tax_withold || 0,
        total_tax_amount: newData.meta?.total_tax_amount || 0,
        invoice_number: newData.meta?.invoice_number || "",
      };
      productSearch.value = newData.meta?.product_name || "";
      totalAfterTax.value = newData.meta?.total_after_tax || 0;
      invoicePreview.value = "";
      invoiceFile.value = null;
      isAutoFilled.value = false;
    }
  },
  { immediate: true }
);

watch(
  () => props.groupData,
  async (newData) => {
    console.log("this is new", newData);

    if (newData && !props.invoiceData) {
      isAutoFilled.value = true;

      // Auto-fill product type
      formData.value.product_type =
        newData.product_type === "Hotel"
          ? "App\\Models\\Hotel"
          : "App\\Models\\EntranceTicket";

      // Auto-fill product ID
      formData.value.product_id = newData.product_id || null;

      // Fetch product details for company name
      if (formData.value.product_id && formData.value.product_type) {
        await fetchProductDetails(
          formData.value.product_id,
          formData.value.product_type
        );
      }

      // Auto-fill dates
      if (newData.firstest_service_date) {
        formData.value.service_start_date = parseDateToLocal(
          newData.firstest_service_date
        );
      }

      if (newData.latest_service_date) {
        formData.value.service_end_date = parseDateToLocal(
          newData.latest_service_date
        );
      }

      formData.value.receipt_date =
        new Date().toISOString().split("T")[0] + "T12:00:00";

      // Auto-fill amounts
      if (newData.total_cost_price) {
        totalAfterTax.value = newData.total_cost_price;
      }
    }
  },
  { immediate: true }
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
