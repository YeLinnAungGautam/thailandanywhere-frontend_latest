<template>
  <Layout :is_white="true">
    <!-- Header -->
    <div
      :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
      class="flex justify-start items-center transition-all duration-200 gap-2 text-sm pb-4 absolute top-6"
    >
      <p class="text-3xl font-medium text-[#FF613c]">
        Mail Management
        <span class="w-2 h-2 bg-[#FF613c] rounded-full inline-block"></span>
      </p>
    </div>

    <!-- Main Container -->
    <div class="relative">
      <!-- Table Section -->
      <div
        class="border shadow-sm rounded-lg pt-4 px-4 transition-all duration-300"
      >
        <!-- Tags Row -->
        <div class="flex justify-between items-center mb-3">
          <div
            class="bg-gradient-to-r from-[#FF613c]/80 via-[#FF613c] to-[#f63307] rounded-full p-1 shadow-md"
          >
            <div class="flex justify-start items-center gap-1">
              <!-- Prove Booking -->
              <div
                @click="filterByType('prove_booking')"
                class="flex-1 px-3 py-2 rounded-full cursor-pointer transition-all duration-300 relative"
                :class="
                  activeTag === 'prove_booking'
                    ? 'bg-white/20'
                    : 'hover:bg-white/10'
                "
              >
                <div class="flex items-center justify-center gap-2">
                  <div
                    class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-white text-[#FF613c]"
                  >
                    1
                  </div>
                  <p class="text-xs font-medium text-white whitespace-nowrap">
                    Prove Booking
                  </p>
                </div>
                <div
                  v-if="activeTag === 'prove_booking'"
                  class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-white rounded-full"
                ></div>
              </div>

              <!-- Arrow 1->2 -->
              <div class="flex items-center justify-center">
                <svg
                  class="w-5 h-5 text-white/60"
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
              </div>

              <!-- Invoice -->
              <div
                @click="filterByType('invoice')"
                class="flex-1 px-3 py-2 rounded-full cursor-pointer transition-all duration-300 relative"
                :class="
                  activeTag === 'invoice' ? 'bg-white/20' : 'hover:bg-white/10'
                "
              >
                <div class="flex items-center justify-center gap-2">
                  <div
                    class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-white text-[#FF613c]"
                  >
                    2
                  </div>
                  <p class="text-xs font-medium text-white">Invoice</p>
                </div>
                <div
                  v-if="activeTag === 'invoice'"
                  class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-white rounded-full"
                ></div>
              </div>

              <!-- Arrow 2->3 -->
              <div class="flex items-center justify-center">
                <svg
                  class="w-5 h-5 text-white/60"
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
              </div>

              <!-- Expense -->
              <div
                @click="filterByType('expense')"
                class="flex-1 px-3 py-2 rounded-full cursor-pointer transition-all duration-300 relative"
                :class="
                  activeTag === 'expense' ? 'bg-white/20' : 'hover:bg-white/10'
                "
              >
                <div class="flex items-center justify-center gap-2">
                  <div
                    class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-white text-[#FF613c]"
                  >
                    3
                  </div>
                  <p class="text-xs font-medium text-white">Expense</p>
                </div>
                <div
                  v-if="activeTag === 'expense'"
                  class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-white rounded-full"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <!-- Filter and Tags Header -->
        <div class="space-y-4 pb-4">
          <!-- Filter Button and Search Row -->
          <div class="flex justify-between items-center">
            <div class="flex justify-start items-center gap-x-3 relative">
              <div
                @click="filterShow = !filterShow"
                class="bg-[#FF613c] px-4 rounded-full shadow py-2 flex justify-center items-center gap-x-2 text-white text-xs cursor-pointer"
              >
                <FunnelIcon class="w-5 h-5 text-white" />
                <p>Filter</p>
              </div>

              <!-- Filter Dropdown -->
              <transition name="slide-down">
                <div
                  v-if="filterShow"
                  class="absolute top-full px-4 left-0 w-[300px] mt-2 transition-all duration-150 bg-white rounded-lg shadow-lg z-50 border border-gray-100 space-y-2 max-h-[50vh] overflow-y-scroll"
                >
                  <div
                    class="flex justify-between items-center pt-4 border-b border-gray-100 pb-1 sticky top-0 bg-white"
                  >
                    <p class="text-xs font-medium">Filter</p>
                    <p class="text-[10px] cursor-pointer" @click="clearFilter">
                      clear
                    </p>
                  </div>

                  <div>
                    <p class="text-[10px] pb-2">Date Range</p>
                    <input
                      type="date"
                      v-model="searchKey.startDate"
                      class="border border-gray-300 px-4 focus:outline-none w-full py-2 text-[10px] rounded-lg mb-2"
                      placeholder="Start Date"
                    />
                    <input
                      type="date"
                      v-model="searchKey.endDate"
                      class="border border-gray-300 px-4 focus:outline-none w-full py-2 text-[10px] rounded-lg"
                      placeholder="End Date"
                    />
                  </div>

                  <div
                    class="sticky bottom-0 w-full pb-4 pt-2 border-t border-gray-200 bg-white"
                  >
                    <p
                      class="text-[12px] bg-[#FF613c] px-2 py-2 rounded-lg text-center text-white cursor-pointer"
                      @click="searchAction"
                    >
                      Search
                    </p>
                  </div>
                </div>
              </transition>

              <!-- Search Input -->
              <div class="relative min-w-[200px] max-w-[400px] flex-1">
                <input
                  type="search"
                  v-model="searchKey.searchId"
                  placeholder="Search by CRM ID"
                  class="w-full px-4 py-2.5 rounded-full shadow border border-gray-100 focus:outline-none text-xs"
                  @keyup.enter="searchAction"
                />
                <div
                  @click="searchAction"
                  class="absolute right-2 top-2 rounded-full text-xs p-1 bg-[#FF613c] cursor-pointer"
                >
                  <MagnifyingGlassIcon class="w-4 h-4 text-white" />
                </div>
              </div>

              <!-- Unified Filters for All Tags -->
            </div>
            <div class="flex justify-center items-center gap-x-2">
              <!-- Sent/Not Sent Dropdown -->
              <div class="relative">
                <select
                  v-model="searchKey.sentStatus"
                  @change="searchAction"
                  class="appearance-none bg-[#FF613c] text-white text-xs px-4 py-2.5 pr-8 rounded-full shadow cursor-pointer focus:outline-none"
                >
                  <option value="all">All Sent Status</option>
                  <option value="sent">Sent</option>
                  <option value="not_sent">Not Sent</option>
                </select>
                <svg
                  class="w-4 h-4 text-white absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Active Filters -->
          <div
            v-if="hasActiveFilters"
            class="flex justify-start items-center overflow-x-scroll no-sidebar-container pt-0.5 space-x-3"
          >
            <p
              v-if="searchKey.startDate || searchKey.endDate"
              class="text-[12px] px-2 py-0.5 rounded-lg whitespace-nowrap relative"
            >
              <XCircleIcon
                class="w-4 h-4 text-[#FF613c] cursor-pointer absolute -top-1 -right-2"
                @click="clearDateFilter"
              />
              Date: {{ searchKey.startDate }} - {{ searchKey.endDate }}
            </p>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto max-h-[57vh] overflow-y-scroll">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 sticky top-0">
              <tr class="border-b">
                <th
                  v-if="activeTag == 'invoice'"
                  class="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-500"
                >
                  Invoice Status
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-500"
                >
                  Mail Status
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-500"
                >
                  CRM ID
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-500"
                >
                  Hotel Name
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-500"
                >
                  Customer Name
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-500"
                >
                  Service Date
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-500"
                >
                  Room Qty
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-500"
                >
                  C.Status
                </th>

                <th
                  class="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-500"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="item in groups?.data ?? []"
                :key="item.id"
                class="hover:bg-gray-50 cursor-pointer transition-colors"
                :class="{ 'bg-blue-50': selectedItem?.id === item.id }"
              >
                <td class="px-4 py-4" v-if="activeTag == 'invoice'">
                  <span
                    class="px-2 py-1.5 rounded-full text-xs font-medium"
                    :class="
                      item.have_invoice_mail
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    "
                  >
                    {{ item.have_invoice_mail ? "Get" : "Not Get" }}
                  </span>
                </td>
                <td class="px-4 py-4" v-if="activeTag != 'expense'">
                  <span
                    class="px-2 py-1.5 rounded-full text-xs font-medium whitespace-nowrap"
                    :class="
                      item.sent_booking_request == 1
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    "
                  >
                    {{ item.sent_booking_request == 1 ? "Sent" : "Not Sent" }}
                  </span>
                </td>
                <td class="px-4 py-4" v-if="activeTag == 'expense'">
                  <span
                    class="px-2 py-1.5 rounded-full text-xs font-medium whitespace-nowrap"
                    :class="
                      item.sent_expense_mail == 1
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    "
                  >
                    {{ item.sent_expense_mail == 1 ? "Sent" : "Not Sent" }}
                  </span>
                </td>
                <td class="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {{ item.booking_crm_id }}
                </td>
                <td class="px-4 py-4 text-sm font-medium text-gray-900">
                  {{ item.product_name }}
                </td>
                <td class="px-4 py-4 text-sm text-gray-600">
                  {{ item.customer_name }}
                </td>
                <td class="px-4 py-4 text-sm text-gray-600">
                  {{ item.firstest_service_date }}
                  <span
                    v-if="
                      item.latest_service_date !== item.firstest_service_date
                    "
                  >
                    - {{ item.latest_service_date }}
                  </span>
                </td>
                <td class="px-4 py-4 text-sm text-gray-600">
                  {{ getRoomQty(item) }} room
                </td>
                <td class="px-4 py-4">
                  <span
                    class="px-2 py-1.5 rounded-full text-xs font-medium whitespace-nowrap"
                    :class="getPaymentStatusClass(item.customer_payment_status)"
                  >
                    {{ formatPaymentStatus(item.customer_payment_status) }}
                  </span>
                </td>

                <td
                  class="px-4 py-4 space-x-2 flex justify-center items-center"
                >
                  <button
                    @click="selectItemEdit(item)"
                    class="px-2 py-1.5 text-xs shadow-md bg-[#FF613c] rounded-full text-white"
                  >
                    Approve
                  </button>
                  <button
                    @click="selectItem(item)"
                    class="bg-[#FF613c] p-1 rounded-full"
                  >
                    <InformationCircleIcon class="w-5 h-5 text-white" />
                  </button>
                </td>
              </tr>
              <tr v-if="loading">
                <td colspan="8" class="px-4 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
              <tr
                v-if="!loading && (!groups?.data || groups.data.length === 0)"
              >
                <td colspan="8" class="px-4 py-8 text-center text-gray-500">
                  No data found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="groups?.meta" class="pt-5">
          <div class="overflow-x-scroll no-sidebar-container py-2">
            <Pagination
              v-if="!loading"
              :data="groups"
              @change-page="changePage"
            />
          </div>
        </div>
      </div>
    </div>

    <Modal :isOpen="showDetail">
      <DialogPanel
        class="w-full max-w-5xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-start py-3 px-4"
        >
          <p>Email Detail</p>
          <XCircleIcon
            class="w-6 h-6 text-white cursor-pointer"
            @click="closeDetail"
          />
        </DialogTitle>
        <div class="p-6 overflow-y-scroll h-[calc(100vh-80px)]">
          <div v-if="selectedItem">
            <!-- Booking Header -->
            <div class="border-b pb-4 mb-4">
              <div class="flex items-center gap-2 mb-3">
                <span
                  class="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {{ selectedItem.product_type }}
                </span>
                <span
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="
                    getPaymentStatusClass(selectedItem.customer_payment_status)
                  "
                >
                  {{
                    formatPaymentStatus(selectedItem.customer_payment_status)
                  }}
                </span>
              </div>
              <h2 class="text-xl font-semibold text-gray-900 mb-2">
                {{ selectedItem.product_name }}
              </h2>
              <div class="space-y-1 text-sm text-gray-600">
                <p>
                  <span class="font-medium">CRM ID:</span>
                  {{ selectedItem.booking_crm_id }}
                </p>
                <p>
                  <span class="font-medium">Customer:</span>
                  {{ selectedItem.customer_name }}
                </p>
                <p>
                  <span class="font-medium">Service Date:</span>
                  {{ selectedItem.firstest_service_date }}
                  <span
                    v-if="
                      selectedItem.latest_service_date !==
                      selectedItem.firstest_service_date
                    "
                  >
                    - {{ selectedItem.latest_service_date }}
                  </span>
                </p>
              </div>
            </div>

            <!-- email part -->
            <EmailPart :detail="detail" :activeTag="activeTag" />

            <!-- Financial Details -->
            <div class="mb-6 mt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-3">
                Financial Details
              </h3>
              <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-gray-600"
                    >Total Amount</span
                  >
                  <span class="text-sm font-bold text-gray-900">{{
                    formatCurrency(selectedItem.total_amount)
                  }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-gray-600"
                    >Cost Price</span
                  >
                  <span class="text-sm text-gray-900">{{
                    formatCurrency(selectedItem.total_cost_price)
                  }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-gray-600"
                    >Expense Amount</span
                  >
                  <span class="text-sm text-gray-900">{{
                    formatCurrency(selectedItem.expense_amount)
                  }}</span>
                </div>
                <div class="flex justify-between items-center pt-2 border-t">
                  <span class="text-sm font-medium text-gray-600"
                    >Expense Status</span
                  >
                  <span
                    class="px-2 py-1 rounded-full text-xs font-medium"
                    :class="getPaymentStatusClass(selectedItem.expense_status)"
                  >
                    {{ formatPaymentStatus(selectedItem.expense_status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Modal>

    <!-- modal for approve/edit -->
    <Modal :isOpen="showDetailEdit">
      <DialogPanel
        class="w-full max-w-4xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-start py-3 px-4"
        >
          <p>Email Proof</p>
          <XCircleIcon
            class="w-6 h-6 text-white cursor-pointer"
            @click="closeDetailEdit"
          />
        </DialogTitle>

        <!-- Content -->
        <div class="p-6 h-[62vh] overflow-y-auto">
          <div class="space-y-4">
            <!-- Date Input Form -->
            <div>
              <label class="text-base font-medium text-gray-700 mb-4 block"
                >Date*</label
              >
              <div class="flex gap-2">
                <!-- Day Input -->
                <input
                  type="number"
                  v-model="day"
                  @input="updateExpenseDate"
                  placeholder="DD"
                  min="1"
                  max="31"
                  class="w-20 border border-gray-300 px-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent text-center"
                />

                <!-- Month Input -->
                <input
                  type="number"
                  v-model="month"
                  @input="updateExpenseDate"
                  placeholder="MM"
                  min="1"
                  max="12"
                  class="w-20 border border-gray-300 px-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent text-center"
                />

                <!-- Year Input -->
                <input
                  type="number"
                  v-model="year"
                  @input="updateExpenseDate"
                  placeholder="YYYY"
                  min="1900"
                  max="2100"
                  class="w-24 border border-gray-300 px-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent text-center"
                />

                <!-- Calendar Button -->
                <div class="relative">
                  <button
                    type="button"
                    @click="openDatePicker"
                    class="w-36 h-10 flex items-center justify-center bg-[#FF613c] text-white border border-gray-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF613c]"
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
                    ref="datePickerInput"
                    type="date"
                    v-model="formData.date"
                    @change="updateFromDatePicker"
                    class="absolute opacity-0 pointer-events-none"
                  />
                </div>
              </div>
            </div>
            <!-- File Upload Section -->
            <div>
              <label class="text-base font-medium text-gray-700 mb-4 block"
                >Proof*</label
              >

              <input
                multiple
                type="file"
                ref="imagesInput"
                @change="handlerImagesFileChange"
                class="hidden"
                accept="image/*"
              />

              <div
                @click="openFileImagePicker"
                class="w-full h-80 space-y-6 text-center border-2 border-dashed border-[#FF613c] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                v-if="
                  imagesPreview.length === 0 &&
                  formData.editImagesPreview.length === 0
                "
              >
                <div class="flex justify-center">
                  <div class="bg-[#FF613c]/10 p-4 rounded-full">
                    <PlusCircleIcon class="w-8 h-8 text-[#FF613c]" />
                  </div>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-700">
                    Upload Expense Proof
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    Click to browse or drag and drop your files here
                  </p>
                  <p class="text-xs text-gray-400 mt-1">
                    Supported formats: PNG, JPG, JPEG
                  </p>
                </div>
              </div>

              <!-- Images Grid - When images exist -->
              <div
                v-else
                class="grid grid-cols-3 md:grid-cols-4 gap-3 min-h-80"
              >
                <!-- New Images Preview -->
                <div
                  v-for="(image, index) in imagesPreview"
                  :key="'new-' + index"
                  class="relative aspect-square group"
                >
                  <img
                    class="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm"
                    :src="image"
                    alt="Preview"
                  />
                  <button
                    @click="removeImageSelectImage(index)"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XCircleIcon class="w-5 h-5" />
                  </button>
                </div>

                <!-- Existing Images Preview -->
                <div
                  v-for="(image, index) in formData.editImagesPreview"
                  :key="'existing-' + index"
                  v-show="imagesPreview.length === 0"
                  class="relative aspect-square group"
                >
                  <img
                    class="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm"
                    :src="image.file"
                    alt="Existing"
                  />
                  <!-- Eye Icon to View Full Image -->
                  <button
                    @click="openImageViewer(image.file, index)"
                    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <EyeIcon class="w-6 h-6" />
                  </button>
                  <button
                    @click="removeImageUpdateImage(image.id)"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XCircleIcon class="w-5 h-5" />
                  </button>
                  <div
                    v-if="image?.meta?.amount"
                    class="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1 rounded-b-lg"
                  >
                    <p class="text-xs text-white truncate">
                      {{ image.meta.amount }}
                    </p>
                  </div>
                </div>

                <!-- Add More Button (last in grid) -->
                <div
                  @click="openFileImagePicker"
                  class="aspect-square border-2 border-dashed border-[#FF613c] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <PlusCircleIcon class="w-8 h-8 text-[#FF613c] mb-1" />
                  <p class="text-xs text-gray-600">Add more</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="border-t border-gray-200 px-4 py-3 flex justify-end space-x-3"
        >
          <button
            @click="closeDetailEdit"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="imagesPreview.length > 0 && updateReservationAction()"
            :disabled="imagesPreview.length === 0"
            class="px-6 py-2 text-sm font-medium text-white rounded-lg flex items-center space-x-2 transition-all duration-200"
            :class="
              imagesPreview.length > 0
                ? 'bg-gradient-to-r from-[#FF613c] to-[#FF8C6B] hover:shadow-lg transform hover:scale-105 cursor-pointer'
                : 'bg-gradient-to-r from-gray-400 to-gray-300 cursor-not-allowed opacity-60'
            "
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
            <span>Update Status</span>
          </button>
        </div>
      </DialogPanel>
    </Modal>

    <!-- Full Screen Image Viewer Modal -->
    <Modal :isOpen="showImageViewer">
      <DialogPanel
        class="w-full max-w-7xl transform overflow-hidden rounded-lg bg-black text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-black/80 font-medium leading-6 flex justify-between items-center py-3 px-4"
        >
          <p>
            Image Viewer ({{ currentImageIndex + 1 }} /
            {{ formData.editImagesPreview.length }})
          </p>
          <XCircleIcon
            class="w-6 h-6 text-white cursor-pointer hover:text-gray-300"
            @click="closeImageViewer"
          />
        </DialogTitle>

        <!-- Image Display Area -->
        <div
          class="relative bg-black h-[80vh] flex items-center justify-center"
        >
          <img
            :src="currentViewImage"
            alt="Full size"
            class="max-h-full max-w-full object-contain"
          />

          <!-- Previous Button -->
          <button
            v-if="formData.editImagesPreview.length > 1"
            @click="previousImage"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 transition-all"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <!-- Next Button -->
          <button
            v-if="formData.editImagesPreview.length > 1"
            @click="nextImage"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 transition-all"
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </DialogPanel>
    </Modal>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import Layout from "./Layout.vue";
import {
  FunnelIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/outline";
import { XCircleIcon, PlusCircleIcon } from "@heroicons/vue/24/solid";
import { useSidebarStore } from "../stores/sidebar";
import { useGroupStore } from "../stores/group";
import { PencilSquareIcon, EyeIcon } from "@heroicons/vue/24/outline";
import Modal from "../components/Modal.vue";
import { useToast } from "vue-toastification";
import EmailPart from "./GroupComponent/EmailPart.vue";
import Pagination from "../components/Pagination.vue";

const toast = useToast();

const sidebarStore = useSidebarStore();
const { isShowSidebar } = storeToRefs(sidebarStore);

const groupStore = useGroupStore();
const { groups, loading } = storeToRefs(groupStore);

// State
const showDetail = ref(false);
const selectedItem = ref(null);
const activeTag = ref("prove_booking");
const filterShow = ref(false);
const currentPage = ref(1);
const imagesInput = ref(null);
const is_sent_expense_mail = ref(false);
const imagesPreview = ref([]);

// Image Viewer State
const showImageViewer = ref(false);
const currentViewImage = ref("");
const currentImageIndex = ref(0);

const formData = ref({
  images: [],
  date: null,
  editImagesPreview: [],
});

const day = ref("");
const month = ref("");
const year = ref("");

const updateExpenseDate = () => {
  if (day.value && month.value && year.value) {
    const paddedDay = String(day.value).padStart(2, "0");
    const paddedMonth = String(month.value).padStart(2, "0");
    formData.value.date = `${year.value}-${paddedMonth}-${paddedDay}`;
  }
};

const datePickerInput = ref(null);
const openDatePicker = () => {
  datePickerInput.value.showPicker();
};

const updateFromDatePicker = () => {
  if (formData.value.date && formData.value.date.includes("-")) {
    const [y, m, d] = formData.value.date.split("-");
    year.value = y;
    month.value = parseInt(m);
    day.value = parseInt(d);
  }
};

// Image Viewer Functions
const openImageViewer = (imageUrl, index) => {
  currentViewImage.value = imageUrl;
  currentImageIndex.value = index;
  showImageViewer.value = true;
};

const closeImageViewer = () => {
  showImageViewer.value = false;
  currentViewImage.value = "";
  currentImageIndex.value = 0;
};

const nextImage = () => {
  if (currentImageIndex.value < formData.value.editImagesPreview.length - 1) {
    currentImageIndex.value++;
    currentViewImage.value =
      formData.value.editImagesPreview[currentImageIndex.value].file;
  } else {
    // Loop back to first image
    currentImageIndex.value = 0;
    currentViewImage.value = formData.value.editImagesPreview[0].file;
  }
};

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
    currentViewImage.value =
      formData.value.editImagesPreview[currentImageIndex.value].file;
  } else {
    // Loop to last image
    currentImageIndex.value = formData.value.editImagesPreview.length - 1;
    currentViewImage.value =
      formData.value.editImagesPreview[currentImageIndex.value].file;
  }
};

const openFileImagePicker = () => {
  imagesInput.value.click();
};

const getRoomQty = (item) => {
  let total = 0;
  item?.items.forEach((room) => {
    total += room.quantity * room.days;
  });
  return total;
};

const handlerImagesFileChange = (e) => {
  const selectedFiles = e.target.files;
  if (selectedFiles) {
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.value.images.push(selectedFiles[i]);
      imagesPreview.value.push(URL.createObjectURL(selectedFiles[i]));
    }
  }
};

const removeImageUpdateImage = async (imageID) => {
  try {
    const res = await groupStore.groupDocumentDeleteAction(
      selectedItem.value.id,
      imageID
    );
    if (res.status == 1) {
      toast.success("Image successfully deleted");
      await getProofImage();
    }
  } catch (error) {
    console.error("Delete image error:", error);
  }
};

const getProofImage = async (id) => {
  const res = await groupStore.groupDocumentList(id, {
    document_type:
      activeTag.value === "prove_booking"
        ? "booking_request_proof"
        : activeTag.value === "expense"
        ? "expense_mail_proof"
        : "invoice_mail_proof",
  });
  formData.value.editImagesPreview = res.result;
};

const updateReservationAction = async () => {
  const frmData = new FormData();
  if (activeTag.value === "prove_booking") {
    frmData.append("sent_booking_request", 1);
    frmData.append("booking_email_sent_date", formData.value.date);
  } else if (activeTag.value === "expense") {
    frmData.append("sent_expense_mail", 1);
    frmData.append("expense_email_sent_date", formData.value.date);
  } else {
    frmData.append("have_invoice_mail", 1);
    frmData.append("invoice_mail_sent_date", formData.value.date);
  }
  frmData.append("_method", "PUT");

  const res = await groupStore.groupUpdateAction(
    selectedItem.value.id,
    frmData
  );
  toast.success("Update status");

  const responses = [];
  if (formData.value.images.length > 0) {
    for (let i = 0; i < formData.value.images.length; i++) {
      const secData = new FormData();
      if (activeTag.value === "prove_booking") {
        secData.append("document_type", "booking_request_proof");
      } else if (activeTag.value === "expense") {
        secData.append("document_type", "expense_mail_proof");
      } else {
        secData.append("document_type", "invoice_mail_proof");
      }
      secData.append(`documents[${i}][file]`, formData.value.images[i]);
      secData.append(`documents[${i}][meta][name]`, `proof-${i}`);

      const fileRes = await groupStore.groupDocumentCreateAction(
        secData,
        selectedItem.value.id
      );
      responses.push(fileRes);
    }
  }

  if (responses.length > 0) {
    toast.success("Update completed successfully");
  }

  setTimeout(async () => {
    await fetchData();
    closeDetailEdit();
  }, 1000);
};

const resetCloseAction = () => {
  formData.value.images = [];
  imagesPreview.value = [];
  day.value = "";
  month.value = "";
  year.value = "";
  formData.value.editImagesPreview = [];
  formData.value.date = null;
};

const removeImageSelectImage = (index) => {
  formData.value.images.splice(index, 1);
  imagesPreview.value.splice(index, 1);
};

const searchKey = ref({
  searchId: "",
  startDate: "",
  endDate: "",
  sentStatus: "all",
});

// Computed
const watchSystem = computed(() => {
  let result = {};

  if (searchKey.value.searchId) {
    result.crm_id = searchKey.value.searchId;
  }

  if (searchKey.value.startDate && searchKey.value.endDate) {
    result.booking_daterange = `${searchKey.value.startDate},${searchKey.value.endDate}`;
  } else {
    let today = new Date();
    let nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 3);
    searchKey.value.startDate = today.toISOString().split("T")[0];
    searchKey.value.endDate = nextMonth.toISOString().split("T")[0];
    result.booking_daterange = `${today.toISOString().split("T")[0]},${
      nextMonth.toISOString().split("T")[0]
    }`;
  }

  result.product_type = "hotel";
  result.sorting_type = "service_date";
  result.sorting = "asc";

  // Apply filters based on current tag and dropdown selections
  if (searchKey.value.searchId == "") {
    if (activeTag.value == "prove_booking") {
      if (searchKey.value.sentStatus !== "all") {
        result.sent_booking_request = searchKey.value.sentStatus;
      }
    }

    if (activeTag.value == "invoice") {
      result.sent_booking_request = "sent";
      result.booking_request_proof = "proved";

      if (searchKey.value.sentStatus !== "all") {
        result.have_invoice_mail = searchKey.value.sentStatus;
      }
    }

    if (activeTag.value == "expense") {
      result.sent_booking_request = "sent";
      result.booking_request_proof = "proved";
      result.have_invoice_mail = "sent";
      result.invoice_mail_proof = "proved";

      if (searchKey.value.sentStatus !== "all") {
        result.sent_expense_mail = searchKey.value.sentStatus;
      }
    }
  }

  result.page = currentPage.value;
  result.per_page = 30;

  return result;
});

const hasActiveFilters = computed(() => {
  return (
    searchKey.value.searchId ||
    searchKey.value.startDate ||
    searchKey.value.endDate
  );
});

// Methods
const filterByType = (type) => {
  activeTag.value = type;
  searchKey.value.sentStatus = "all";
  searchAction();
};

const clearDateFilter = () => {
  searchKey.value.startDate = "";
  searchKey.value.endDate = "";
  searchAction();
};

const detail = ref({});
const selectItem = async (item) => {
  selectedItem.value = item;
  const res = await groupStore.detailAction(item.id);
  detail.value = res.result;
  showDetail.value = true;
};

const showDetailEdit = ref(false);
const selectItemEdit = async (item) => {
  selectedItem.value = item;
  formData.value.date =
    activeTag.value == "prove_booking"
      ? item.booking_email_sent_date
      : activeTag.value == "expense"
      ? item.expense_email_sent_date
      : item.invoice_mail_sent_date;

  if (formData.value.date && formData.value.date.includes("-")) {
    const [y, m, d] = formData.value.date.split("-");
    year.value = y;
    month.value = parseInt(m);
    day.value = parseInt(d);
  }

  await getProofImage(item.id);
  if (activeTag.value == "prove_booking") {
    is_sent_expense_mail.value = item.sent_booking_request == 0 ? false : true;
  } else {
    is_sent_expense_mail.value = item.sent_expense_mail == 0 ? false : true;
  }
  showDetailEdit.value = true;
};

const closeDetail = () => {
  showDetail.value = false;
  detail.value = {};
  selectedItem.value = null;
};

const closeDetailEdit = () => {
  showDetailEdit.value = false;
  selectedItem.value = null;
  resetCloseAction();
};

const searchAction = async () => {
  filterShow.value = false;
  currentPage.value = 1;
  await groupStore.getListAction(watchSystem.value);
};

const changePage = async (url) => {
  currentPage.value = url.split("page=")[1];
  await groupStore.getChangePage(url, watchSystem.value);
};

const clearFilter = () => {
  searchKey.value = {
    searchId: "",
    startDate: "",
    endDate: "",
    sentStatus: "all",
  };
  filterShow.value = false;
  searchAction();
};

const getPaymentStatusClass = (status) => {
  const classes = {
    paid: "bg-green-100 text-green-800",
    not_paid: "bg-red-100 text-red-800",
    partial: "bg-yellow-100 text-yellow-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

const formatPaymentStatus = (status) => {
  const statuses = {
    fully_paid: "Paid",
    not_paid: "Not Paid",
    partially_paid: "Partial",
  };
  return statuses[status] || status;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
  }).format(amount);
};

watch(currentPage, () => {
  groupStore.getListAction(watchSystem.value);
});

const fetchData = async () => {
  try {
    await groupStore.getListAction(watchSystem.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-right-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.no-sidebar-container::-webkit-scrollbar {
  display: none;
}

.no-sidebar-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
