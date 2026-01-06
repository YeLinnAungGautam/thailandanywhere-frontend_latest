<template>
  <Layout :is_white="true">
    <!-- Header -->
    <div
      :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
      class="space-y-1 transition-all duration-200 gap-2 text-sm pb-4 absolute top-4"
    >
      <div class="text-xl font-semibold text-[#FF613c]">Mail Management</div>
      <p class="text-gray-600">
        Use the following module to make sure all data are added ahead of time.
      </p>
    </div>

    <!-- Main Content -->
    <div class="w-full rounded-lg shadow-sm">
      <!-- Scorecard Section -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <!-- Prove Booking Card -->
        <div
          @click="filterByType('prove_booking')"
          class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
          :class="
            activeTag == 'prove_booking'
              ? 'border-4 border-yellow-600'
              : 'border border-gray-100'
          "
        >
          <div class="bg-gradient-to-r from-yellow-600 to-yellow-700 p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-white text-sm font-medium opacity-90">
                  Prove Booking
                </p>
                <div class="flex items-baseline gap-2 mt-2">
                  <span class="text-3xl font-bold text-white">Step 1</span>
                </div>
              </div>
              <div class="bg-white/20 p-3 rounded-full">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold bg-white text-yellow-600"
                >
                  1
                </div>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50">
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-600">Booking Requests</span>
              <span class="font-semibold text-gray-900">Pending Review</span>
            </div>
          </div>
        </div>

        <!-- Vendor Confirm Card -->
        <div
          @click="filterByType('invoice')"
          class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
          :class="
            activeTag == 'invoice'
              ? 'border-4 border-blue-600'
              : 'border border-gray-100'
          "
        >
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-white text-sm font-medium opacity-90">
                  Vendor Confirm
                </p>
                <div class="flex items-baseline gap-2 mt-2">
                  <span class="text-3xl font-bold text-white">Step 2</span>
                </div>
              </div>
              <div class="bg-white/20 p-3 rounded-full">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold bg-white text-blue-600"
                >
                  2
                </div>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50">
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-600">Invoice Confirmations</span>
              <span class="font-semibold text-gray-900">Awaiting Response</span>
            </div>
          </div>
        </div>

        <!-- Invoice Card -->
        <div
          @click="filterByType('invoice_confirm')"
          class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
          :class="
            activeTag == 'invoice_confirm'
              ? 'border-4 border-red-600'
              : 'border border-gray-100'
          "
        >
          <div class="bg-gradient-to-r from-red-500 to-red-600 p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-white text-sm font-medium opacity-90">Invoice</p>
                <div class="flex items-baseline gap-2 mt-2">
                  <span class="text-3xl font-bold text-white">Step 3</span>
                </div>
              </div>
              <div class="bg-white/20 p-3 rounded-full">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold bg-white text-red-600"
                >
                  3
                </div>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50">
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-600">Invoice Submissions</span>
              <span class="font-semibold text-gray-900">Awaiting Invoice</span>
            </div>
          </div>
        </div>

        <!-- Expense Card -->
        <div
          @click="filterByType('expense')"
          class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
          :class="
            activeTag == 'expense'
              ? 'border-4 border-orange-600'
              : 'border border-gray-100'
          "
        >
          <div class="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-white text-sm font-medium opacity-90">Expense</p>
                <div class="flex items-baseline gap-2 mt-2">
                  <span class="text-3xl font-bold text-white">Step 4</span>
                </div>
              </div>
              <div class="bg-white/20 p-3 rounded-full">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold bg-white text-orange-600"
                >
                  4
                </div>
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50">
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-600">Expense Submissions</span>
              <span class="font-semibold text-gray-900">Processing</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div
        class="p-3 md:p-4 border-b border-gray-200 sticky bg-white -top-6 z-20"
      >
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-2 flex-1">
            <div class="relative">
              <div
                class="flex justify-between cursor-pointer items-center space-x-2"
                @click="showToggleType = !showToggleType"
              >
                <p class="capitalize text-[#FF613c] font-semibold text-xl">
                  {{ product_type }}
                </p>
                <ChevronDownIcon class="w-5 text-[#FF613c] h-5" />
              </div>
              <div
                v-if="showToggleType"
                class="absolute top-10 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
              >
                <p
                  class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  @click="product_type = 'hotel'"
                >
                  Hotel
                </p>
                <p
                  class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  @click="product_type = 'attraction'"
                >
                  Attraction
                </p>
              </div>
            </div>
            <!-- Search CRM ID -->
            <div class="relative min-w-[180px]">
              <input
                type="search"
                v-model="searchKey.searchId"
                placeholder="Search CRM ID"
                class="w-full px-4 py-2.5 rounded-full shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF613c] text-xs"
                @keyup.enter="searchAction"
              />
              <div
                @click="searchAction"
                class="absolute right-1 top-1 rounded-full text-xs p-1.5 bg-[#FF613c] cursor-pointer hover:bg-[#e55139] transition-colors"
              >
                <MagnifyingGlassIcon class="w-4 h-4 text-white" />
              </div>
            </div>

            <button
              @click="searchAction"
              class="bg-[#FF613c] px-4 rounded-full shadow-lg py-2.5 flex justify-center items-center gap-x-2 text-white text-xs cursor-pointer hover:bg-[#e55139] transition-colors"
            >
              <MagnifyingGlassIcon class="w-4 h-4 text-white" />
              <p>Search</p>
            </button>
          </div>

          <div class="flex items-center gap-2">
            <!-- Sent Status Dropdown -->
            <div class="relative">
              <select
                v-model="searchKey.sentStatus"
                @change="searchAction"
                class="appearance-none bg-white text-[#FF613c] border border-gray-200 text-xs px-4 py-2.5 pr-8 rounded-full shadow-lg cursor-pointer hover:bg-[#e55139] hover:text-white transition-colors focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="sent">Sent</option>
                <option value="not_sent">Not Sent</option>
              </select>
              <svg
                class="w-4 h-4 text-[#FF613c] absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
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

            <!-- Filters Button -->
            <button
              @click="filterShow = !filterShow"
              class="bg-[#FF613c] px-4 rounded-full shadow-lg py-2.5 flex justify-center items-center gap-x-2 text-white text-xs cursor-pointer hover:bg-[#e55139] transition-colors"
            >
              <FunnelIcon class="w-4 h-4 text-white" />
              <p>Filters</p>
            </button>

            <!-- Reset Button -->
            <button
              @click="clearFilter"
              class="flex items-center gap-2 px-4 py-2.5 text-xs text-white bg-[#FF613c] rounded-full cursor-pointer hover:bg-[#e55139] transition-colors shadow-lg"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset
            </button>
          </div>
        </div>

        <!-- Filter Dropdown -->
        <transition name="slide-down">
          <div
            v-if="filterShow"
            class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div class="flex items-center justify-between mb-3">
              <p class="text-sm font-medium text-gray-700">Date Range Filter</p>
              <button
                @click="clearDateFilter"
                class="text-xs text-[#FF613c] hover:text-[#e55139]"
              >
                Clear Dates
              </button>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs text-gray-600 mb-1 block"
                  >Start Date</label
                >
                <input
                  type="date"
                  v-model="searchKey.startDate"
                  class="border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF613c] w-full py-2 text-xs rounded-full shadow-sm"
                />
              </div>
              <div>
                <label class="text-xs text-gray-600 mb-1 block">End Date</label>
                <input
                  type="date"
                  v-model="searchKey.endDate"
                  class="border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF613c] w-full py-2 text-xs rounded-full shadow-sm"
                />
              </div>
            </div>
            <button
              @click="searchAction"
              class="w-full mt-3 bg-[#FF613c] text-white text-xs px-4 py-2 rounded-full hover:bg-[#e55139] transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </transition>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto relative w-[92vw] h-[62vh] overflow-y-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200 z-10">
            <tr class="sticky top-0 z-10 bg-gray-50">
              <th
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
              >
                Mail Status
              </th>
              <th
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
              >
                CRM ID
              </th>
              <th
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
              >
                Product Name
              </th>
              <th
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
              >
                Customer
              </th>
              <th
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
              >
                Service Date
              </th>
              <th
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
              >
                Room Qty
              </th>
              <th
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
              >
                C.Status
              </th>
              <th
                v-if="activeTag == 'expense'"
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
              >
                E.Status
              </th>
              <th
                class="px-2 md:px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody v-if="!loading" class="divide-y divide-gray-200">
            <template v-for="item in groups?.data ?? []" :key="item.id">
              <!-- Main row -->
              <tr
                class="hover:bg-gray-50 transition-colors cursor-pointer"
                @click="toggleRow(item.id)"
              >
                <!-- Mail Status Column -->
                <td class="px-2 md:px-4 py-4">
                  <div class="flex flex-col gap-1">
                    <span
                      v-if="
                        activeTag == 'prove_booking' || activeTag == 'invoice'
                      "
                      class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                      :class="
                        item.sent_booking_request == 1
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      "
                    >
                      {{ item.sent_booking_request == 1 ? "Sent" : "Not Sent" }}
                    </span>
                    <span
                      v-if="activeTag == 'invoice' || activeTag == 'expense'"
                      class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                      :class="
                        item.have_invoice_mail
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      "
                    >
                      {{ item.have_invoice_mail ? "Complete" : "Missing" }}
                    </span>
                    <span
                      v-if="activeTag == 'invoice_confirm'"
                      class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                      :class="
                        item.have_booking_confirm_letter
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      "
                    >
                      {{
                        item.have_booking_confirm_letter ? "Have" : "Missing"
                      }}
                    </span>
                    <span
                      v-if="activeTag == 'expense'"
                      class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                      :class="
                        item.sent_expense_mail == 1
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      "
                    >
                      Exp:
                      {{ item.sent_expense_mail == 1 ? "Sent" : "Not Sent" }}
                    </span>
                  </div>
                </td>

                <!-- CRM ID -->
                <td class="px-2 md:px-4 py-4">
                  <p
                    class="text-sm font-medium whitespace-nowrap px-3 py-1.5 bg-[#FF613c] text-white shadow-md rounded-full inline-block"
                  >
                    {{ item.booking_crm_id }}
                  </p>
                </td>

                <!-- Product Name -->
                <td class="px-2 md:px-4 py-4">
                  <p
                    class="text-sm text-white px-3 py-1.5 bg-[#FF613c] rounded-full shadow-md truncate max-w-[200px]"
                  >
                    {{ item.product_name }}
                  </p>
                </td>

                <!-- Customer Name -->
                <td class="px-2 md:px-4 py-4">
                  <p class="text-sm text-gray-700">{{ item.customer_name }}</p>
                </td>

                <!-- Service Date -->
                <td class="px-2 md:px-4 py-4">
                  <div class="text-sm text-gray-700">
                    <div class="whitespace-nowrap">
                      {{ item.firstest_service_date }}
                    </div>
                    <div
                      class="text-xs text-gray-500 whitespace-nowrap"
                      v-if="
                        item.latest_service_date !== item.firstest_service_date
                      "
                    >
                      to {{ item.latest_service_date }}
                    </div>
                  </div>
                </td>

                <!-- Room Qty -->
                <td class="px-2 md:px-4 py-4">
                  <p class="text-sm text-gray-700">
                    {{ getRoomQty(item) }} room
                  </p>
                </td>

                <!-- Customer Status -->
                <td class="px-2 md:px-4 py-4">
                  <span
                    class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                    :class="getPaymentStatusClass(item.customer_payment_status)"
                  >
                    {{ formatPaymentStatus(item.customer_payment_status) }}
                  </span>
                </td>

                <!-- Expense Status -->
                <td v-if="activeTag == 'expense'" class="px-2 md:px-4 py-4">
                  <span
                    class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                    :class="getPaymentStatusClass(item.expense_status)"
                  >
                    {{ formatPaymentStatus(item.expense_status) }}
                  </span>
                </td>

                <!-- Actions -->
                <td
                  class="px-2 flex justify-end items-center space-x-2 md:px-4 py-4"
                >
                  <button
                    @click.stop="selectItem(item)"
                    class="flex bg-green-600 text-white items-center gap-2 px-3 py-1.5 transition-colors rounded-lg hover:bg-green-700"
                  >
                    <InformationCircleIcon class="w-5 h-5" />
                    <span class="text-xs">Info</span>
                  </button>
                </td>
              </tr>

              <!-- Expandable Approve Row -->
              <tr v-show="expandedRows.includes(item.id)">
                <td colspan="20" class="px-2 md:px-4 py-0">
                  <div class="bg-gray-50 rounded-lg p-4 mb-2">
                    <div
                      class="grid grid-cols-5 gap-3"
                      v-if="activeTag != 'invoice_confirm'"
                    >
                      <div
                        v-for="(image, index) in imageList[item.id]"
                        :key="'existing-' + index"
                        v-show="imagesPreview.length === 0"
                        class="relative aspect-square h-[150px] w-full group"
                      >
                        <img
                          class="w-full h-full object-cover rounded-lg border border-gray-200"
                          :src="image.file"
                          alt="Existing"
                        />
                        <button
                          @click="openImageViewer(image.file, index)"
                          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <EyeIcon class="w-6 h-6" />
                        </button>
                      </div>
                      <div
                        @click="selectItemEdit(item)"
                        class="w-full h-full min-h-[100px] cursor-pointer rounded-lg overflow-hidden border border-dashed border-[#FF613c] flex justify-center items-center"
                      >
                        <p
                          class="text-[#FF613c] text-sm flex justify-center items-center gap-x-3"
                        >
                          <PlusCircleIcon class="w-6 h-6" />Add New Image
                        </p>
                      </div>
                    </div>
                    <div
                      v-if="activeTag == 'invoice_confirm'"
                      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3"
                    >
                      <!-- Add New Invoice Card -->
                      <div
                        @click="openNewInvoiceModal(item)"
                        class="bg-white rounded-lg min-h-[120px] cursor-pointer text-[#FF613c] text-sm flex justify-center items-center border border-[#FF613c] p-4 border-dashed hover:bg-[#FF613c]/5 transition-colors group"
                      >
                        <PlusCircleIcon class="w-5 h-5 mr-2" />
                        Add New Invoice
                      </div>

                      <!-- Invoice Cards -->
                      <div
                        v-for="invoice in invoiceLists[item.id] || []"
                        :key="invoice.id"
                        @click="openEditInvoiceModal(invoice, item)"
                        class="bg-white rounded-lg p-4 border border-gray-200 hover:border-[#FF613c] transition-colors group cursor-pointer"
                      >
                        <div class="flex items-start gap-3">
                          <!-- Invoice Icon/Image -->
                          <div
                            class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center flex-shrink-0"
                          >
                            <DocumentDuplicateIcon
                              class="w-6 h-6 text-blue-600"
                            />
                          </div>

                          <div class="flex-1 min-w-0">
                            <!-- Invoice Number & Status -->
                            <div
                              class="flex items-start justify-between gap-2 mb-2"
                            >
                              <h4
                                class="text-sm font-semibold text-gray-900 truncate"
                              >
                                {{
                                  invoice.meta?.invoice_number || "No Number"
                                }}
                              </h4>
                              <span
                                class="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full whitespace-nowrap"
                              >
                                {{
                                  invoice.meta?.product_type?.includes("Hotel")
                                    ? "Hotel"
                                    : "Ticket"
                                }}
                              </span>
                            </div>

                            <!-- Invoice Details -->
                            <div class="space-y-1">
                              <div
                                class="flex items-center justify-between text-xs"
                              >
                                <span class="text-gray-500">Amount:</span>
                                <span class="font-medium text-gray-900">
                                  {{
                                    invoice.meta?.total_after_tax
                                      ? formatCurrency(
                                          invoice.meta.total_after_tax
                                        )
                                      : "-"
                                  }}
                                </span>
                              </div>
                              <div
                                class="flex items-center justify-between text-xs"
                              >
                                <span class="text-gray-500">Product:</span>
                                <span class="text-gray-700 truncate ml-2">{{
                                  invoice.meta?.product_name || "-"
                                }}</span>
                              </div>
                              <div
                                class="flex items-center justify-between text-xs"
                              >
                                <span class="text-gray-500">Company:</span>
                                <span class="text-gray-700 truncate ml-2">{{
                                  invoice.meta?.company_legal_name || "-"
                                }}</span>
                              </div>
                            </div>

                            <!-- View/Edit Indicator -->
                            <div
                              class="mt-3 text-xs text-[#FF613c] font-medium flex items-center"
                            >
                              <PencilSquareIcon class="w-4 h-4 mr-1" />
                              Click to edit
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="flex flex-col items-center gap-3">
            <div
              class="w-8 h-8 border-4 border-gray-200 border-t-[#ff613c] rounded-full animate-spin"
            ></div>
            <p class="text-xs text-gray-500">Loading...</p>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="!loading && (!groups?.data || groups.data.length === 0)"
          class="flex flex-col items-center justify-center py-12"
        >
          <svg
            class="w-12 h-12 text-gray-300 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p class="text-sm text-gray-500">No mail records found</p>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="!loading && groups?.data && groups.data.length > 0"
        class="px-3 md:px-4 py-3 border-t border-gray-200"
      >
        <Pagination :data="groups" @change-page="changePage" />
      </div>
    </div>

    <!-- Detail Modal -->
    <Modal :isOpen="showDetail">
      <DialogPanel
        class="w-full max-w-5xl transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-lg font-semibold text-gray-900 mb-4 flex justify-between items-center p-6 border-b"
        >
          <div class="flex items-center gap-2">
            <InformationCircleIcon class="w-6 h-6 text-[#FF613c]" />
            Email Details
          </div>
          <button
            @click="closeDetail"
            class="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XCircleIcon class="w-5 h-5 text-gray-500" />
          </button>
        </DialogTitle>

        <div class="p-6 overflow-y-scroll max-h-[calc(100vh-200px)]">
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

            <!-- Email Part -->
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

    <!-- Approve/Edit Modal -->
    <Modal :isOpen="showDetailEdit">
      <DialogPanel
        class="w-full max-w-4xl transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-lg font-semibold text-gray-900 mb-4 flex justify-between items-center p-6 border-b"
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {{
              activeTag == "invoice"
                ? "Confirm"
                : activeTag == "expense"
                ? "Expense"
                : "Booking"
            }}
            Email Screenshot
          </div>
          <button
            @click="closeDetailEdit"
            class="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XCircleIcon class="w-5 h-5 text-gray-500" />
          </button>
        </DialogTitle>

        <!-- Content -->
        <div class="p-6 max-h-[62vh] overflow-y-auto">
          <div class="space-y-4">
            <!-- Date Input Form -->
            <div>
              <label class="text-sm font-medium text-gray-700 mb-3 block">
                {{ activeTag == "invoice" ? "Confirm Email" : "Booking" }} Date*
              </label>
              <div class="flex gap-2">
                <input
                  type="number"
                  v-model="day"
                  @input="updateExpenseDate"
                  placeholder="DD"
                  min="1"
                  max="31"
                  class="w-20 border border-gray-300 px-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] text-center"
                />
                <input
                  type="number"
                  v-model="month"
                  @input="updateExpenseDate"
                  placeholder="MM"
                  min="1"
                  max="12"
                  class="w-20 border border-gray-300 px-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] text-center"
                />
                <input
                  type="number"
                  v-model="year"
                  @input="updateExpenseDate"
                  placeholder="YYYY"
                  min="1900"
                  max="2100"
                  class="w-24 border border-gray-300 px-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] text-center"
                />
                <div class="relative">
                  <button
                    type="button"
                    @click="openDatePicker"
                    class="w-36 h-10 flex items-center justify-center bg-[#FF613c] text-white rounded-lg transition-colors hover:bg-[#e55139]"
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
              <label class="text-sm font-medium text-gray-700 mb-3 block">
                {{
                  activeTag == "invoice"
                    ? "Confirm"
                    : activeTag == "expense"
                    ? "Expense"
                    : "Booking"
                }}
                Email Screenshot*
              </label>

              <input
                multiple
                type="file"
                ref="imagesInput"
                @change="handlerImagesFileChange"
                class="hidden"
                accept="image/*"
              />

              <div
                v-if="
                  imagesPreview.length === 0 &&
                  formData.editImagesPreview.length === 0
                "
                @click="openFileImagePicker"
                class="w-full h-80 border-2 border-dashed border-[#FF613c] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div class="bg-[#FF613c]/10 p-4 rounded-full">
                  <PlusCircleIcon class="w-8 h-8 text-[#FF613c]" />
                </div>
                <div class="mt-4 text-center">
                  <p class="text-sm font-medium text-gray-700">
                    Upload Email Screenshot
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    Click to browse or drag and drop
                  </p>
                  <p class="text-xs text-gray-400 mt-1">PNG, JPG, JPEG</p>
                </div>
              </div>

              <!-- Images Grid -->
              <div
                v-else
                class="grid grid-cols-3 md:grid-cols-4 gap-3 min-h-80"
              >
                <!-- New Images -->
                <div
                  v-for="(image, index) in imagesPreview"
                  :key="'new-' + index"
                  class="relative aspect-square group"
                >
                  <img
                    class="w-full h-full object-cover rounded-lg border border-gray-200"
                    :src="image"
                    alt="Preview"
                  />
                  <button
                    @click="removeImageSelectImage(index)"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XCircleIcon class="w-5 h-5" />
                  </button>
                </div>

                <!-- Existing Images -->
                <div
                  v-for="(image, index) in formData.editImagesPreview"
                  :key="'existing-' + index"
                  v-show="imagesPreview.length === 0"
                  class="relative aspect-square group"
                >
                  <img
                    class="w-full h-full object-cover rounded-lg border border-gray-200"
                    :src="image.file"
                    alt="Existing"
                  />
                  <button
                    @click="openImageViewer(image.file, index)"
                    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <EyeIcon class="w-6 h-6" />
                  </button>
                  <button
                    @click="removeImageUpdateImage(image.id)"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XCircleIcon class="w-5 h-5" />
                  </button>
                </div>

                <!-- Add More Button -->
                <div
                  @click="openFileImagePicker"
                  class="aspect-square border-2 border-dashed border-[#FF613c] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <PlusCircleIcon class="w-8 h-8 text-[#FF613c]" />
                  <p class="text-xs text-gray-600 mt-1">Add more</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t px-6 py-3 flex justify-end space-x-3">
          <button
            @click="closeDetailEdit"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="imagesPreview.length > 0 && updateReservationAction()"
            :disabled="imagesPreview.length === 0"
            class="px-6 py-2 text-sm font-medium text-white rounded-lg flex items-center space-x-2 transition-all"
            :class="
              imagesPreview.length > 0
                ? 'bg-[#FF613c] hover:bg-[#e55139] cursor-pointer'
                : 'bg-gray-400 cursor-not-allowed opacity-60'
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

    <!-- Image Viewer Modal -->
    <Modal :isOpen="showImageViewer">
      <DialogPanel
        class="w-full max-w-7xl transform overflow-hidden rounded-lg bg-black text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-black/80 font-medium flex justify-between items-center py-3 px-4"
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

        <div
          class="relative bg-black h-[80vh] flex items-center justify-center"
        >
          <img
            :src="currentViewImage"
            alt="Full size"
            class="max-h-full max-w-full object-contain"
          />

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

    <!-- Comment Modal -->
    <Modal :isOpen="openCommentModal" @closeModal="closeCommentModal">
      <DialogPanel
        class="w-full max-w-xl transform rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
        >
          <AdjustmentsHorizontalIcon class="w-6 h-6 text-[#FF613c]" />
          Add Comment
        </DialogTitle>

        <div class="space-y-4">
          <textarea
            v-model="comment"
            class="w-full rounded-lg border border-gray-200 focus:outline-none px-4 py-3 text-sm text-gray-700"
            rows="5"
            placeholder="Comment"
          ></textarea>
          <div class="pt-4 border-t border-gray-200">
            <button
              @click="addCommentAction"
              class="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
            >
              + Add Comment
            </button>
          </div>
        </div>
      </DialogPanel>
    </Modal>

    <InvoiceModal
      :isOpen="invoiceModalOpen"
      :invoiceData="selectedInvoice"
      :groupId="selectedItem?.id"
      :groupData="selectedItem"
      :openEditItemCost="openEditItemCost"
      :itemData="itemLists[selectedItem?.id]"
      @close="closeInvoiceModal"
      @refresh="refreshInvoices"
    />

    <ItemCostModal
      :isOpen="showEditItemCost"
      :groupData="itemLists[selectedItem?.id] || {}"
      :closeAction="closeEditItemCost"
      :refreshAction="refreshExpenses"
    />
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
import {
  PencilSquareIcon,
  EyeIcon,
  ChevronDownIcon,
} from "@heroicons/vue/24/outline";
import Modal from "../components/Modal.vue";
import { useToast } from "vue-toastification";
import EmailPart from "./GroupComponent/EmailPart.vue";
import Pagination from "../components/Pagination.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useRoute } from "vue-router";
import router from "../router";
import InvoiceModal from "./GroupComponent/ExpensePart/InvoiceModal.vue";
import ItemCostModal from "./GroupComponent/ExpensePart/ItemCostModal.vue";

const toast = useToast();
const sidebarStore = useSidebarStore();
const { isShowSidebar } = storeToRefs(sidebarStore);
const groupStore = useGroupStore();
const { groups, loading } = storeToRefs(groupStore);
const route = useRoute();

// State
const showDetail = ref(false);
const selectedItem = ref(null);
const activeTag = ref("prove_booking");
const filterShow = ref(false);
const currentPage = ref(1);
const imagesInput = ref(null);
const imagesPreview = ref([]);
const product_type = ref("hotel");
const showImageViewer = ref(false);
const currentViewImage = ref("");
const currentImageIndex = ref(0);
const expandedRows = ref([]);
const showToggleType = ref(false);

const formData = ref({
  images: [],
  date: null,
  editImagesPreview: [],
});

const showEditItemCost = ref(false);

const openEditItemCost = () => {
  if (selectedItem.value) {
    console.log("Selected Item:", selectedItem.value);
    console.log("Item Lists:", itemLists.value);
    console.log("Current Group Data:", itemLists.value[selectedItem.value.id]);
    showEditItemCost.value = true;
    invoiceModalOpen.value = false;
  } else {
    toast.error("No booking data available");
  }
};

const day = ref("");
const month = ref("");
const year = ref("");

const searchKey = ref({
  searchId: "",
  startDate: "",
  endDate: "",
  sentStatus: "all",
});

const detail = ref({});
const showDetailEdit = ref(false);
const datePickerInput = ref(null);

// Toggle row expansion
const imageList = ref({});

const invoiceLists = ref({});

// Add function to fetch invoices for a specific group
const fetchGroupInvoices = async (groupId) => {
  try {
    const response = await groupStore.groupDocumentList(groupId, {
      document_type: "booking_confirm_letter",
    });

    if (response?.result) {
      invoiceLists.value[groupId] = response.result;
    }
  } catch (error) {
    console.error("Error fetching invoices:", error);
  }
};

const toggleRow = async (itemId) => {
  const index = expandedRows.value.indexOf(itemId);

  if (index > -1) {
    expandedRows.value.splice(index, 1);
  } else {
    if (activeTag.value != "invoice_confirm") {
      if (imageList.value[itemId] === undefined) {
        const data = await getProofImage(itemId);
        imageList.value[itemId] = data;
      }
    } else {
      if (!invoiceLists.value[itemId]) {
        await fetchGroupInvoices(itemId);
      }
      if (!itemLists.value[itemId]) {
        await fetchGroupExpenses(itemId);
      }
    }
    expandedRows.value.push(itemId);

    console.log("====================================");
    console.log(imageList.value, "this is image list");
    console.log("====================================");
  }
};

const selectedInvoice = ref(null);
const invoiceModalOpen = ref(false);

const openNewInvoiceModal = (item) => {
  selectedInvoice.value = null;
  selectedItem.value = item;
  invoiceModalOpen.value = true;
};

const closeEditItemCost = () => {
  showEditItemCost.value = false;
};

// Open modal for editing invoice
const openEditInvoiceModal = (invoice, item) => {
  selectedInvoice.value = invoice;
  selectedItem.value = item;
  invoiceModalOpen.value = true;
};

// Date functions
const updateExpenseDate = () => {
  if (day.value && month.value && year.value) {
    const paddedDay = String(day.value).padStart(2, "0");
    const paddedMonth = String(month.value).padStart(2, "0");
    formData.value.date = `${year.value}-${paddedMonth}-${paddedDay}`;
  }
};

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

// Image viewer functions
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
  } else {
    currentImageIndex.value = 0;
  }
  currentViewImage.value =
    formData.value.editImagesPreview[currentImageIndex.value].file;
};

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  } else {
    currentImageIndex.value = formData.value.editImagesPreview.length - 1;
  }
  currentViewImage.value =
    formData.value.editImagesPreview[currentImageIndex.value].file;
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
      await getProofImage(selectedItem.value.id);
    }
  } catch (error) {
    console.error("Delete image error:", error);
  }
};

const refreshExpenses = async () => {
  if (selectedItem.value?.id) {
    await fetchGroupExpenses(selectedItem.value.id);
    await getListAction(); // Refresh main list
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
  return res.result;
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

  await groupStore.groupUpdateAction(selectedItem.value.id, frmData);
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

const closeInvoiceModal = () => {
  invoiceModalOpen.value = false;
};

const removeImageSelectImage = (index) => {
  formData.value.images.splice(index, 1);
  imagesPreview.value.splice(index, 1);
};

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

  if (product_type.value) {
    result.product_type = product_type.value;
  }
  result.sorting_type = "service_date";
  result.sorting = "asc";

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

const filterByType = (type) => {
  activeTag.value = type;
  searchKey.value.sentStatus = "all";
  expandedRows.value = [];
  imageList.value = {};
  searchAction();
};

const clearDateFilter = () => {
  searchKey.value.startDate = "";
  searchKey.value.endDate = "";
  searchAction();
};

const selectItem = async (item) => {
  selectedItem.value = item;
  const res = await groupStore.detailAction(item.id);
  detail.value = res.result;
  showDetail.value = true;
};

const refreshInvoices = async () => {
  if (selectedItem.value?.id) {
    await fetchGroupInvoices(selectedItem.value.id);

    await getListAction(); // Refresh main list
  }
};

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
    fully_paid: "bg-green-100 text-green-800",
    not_paid: "bg-red-100 text-red-800",
    partially_paid: "bg-yellow-100 text-yellow-800",
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

// Add this near your other ref declarations at the top
const expenseLists = ref({});
const itemLists = ref({});

// Update the fetchGroupExpenses function
const fetchGroupExpenses = async (groupId) => {
  try {
    const response = await groupStore.detailAction(groupId);
    if (response?.result) {
      // Store the expense data
      if (response.result.expense) {
        expenseLists.value[groupId] = response.result.expense;
      }
      // Store the full result including items
      itemLists.value[groupId] = response.result;
      console.log(response.result, "this is group expense");
    }
  } catch (error) {
    console.error("Error fetching expenses:", error);
    toast.error("Failed to fetch expense data");
  }
};

const fetchData = async () => {
  try {
    await groupStore.getListAction(watchSystem.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

watch(currentPage, () => {
  groupStore.getListAction(watchSystem.value);
});

watch(product_type, () => {
  groupStore.getListAction(watchSystem.value);
});

onMounted(() => {
  fetchData();

  if (route.query.product_type && route.query.activeTag && route.query.crm_id) {
    product_type.value = route.query.product_type;
    activeTag.value = route.query.activeTag;
    searchKey.value.searchId = route.query.crm_id;
    searchAction();
  }
});
</script>

<style scoped>
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

.overflow-x-auto::-webkit-scrollbar,
.overflow-y-auto::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track,
.overflow-y-auto::-webkit-scrollbar-track {
  background: #f9fafb;
}

.overflow-x-auto::-webkit-scrollbar-thumb,
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}
</style>
