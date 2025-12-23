<template>
  <Layout :is_white="true">
    <!-- Header -->
    <div
      :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
      class="flex justify-start items-center transition-all duration-200 gap-2 text-sm pb-4 absolute top-6"
    >
      <div
        class="text-2xl md:text-3xl flex justify-start items-center font-medium text-[#FF613c]"
      >
        Expense
        <div class="flex justify-start items-center gap-x-4 pl-4">
          <div class="w-4 h-4 bg-red-500 rounded-full"></div>
          <p class="text-xs">Deadline</p>
          <div class="w-4 h-4 bg-yellow-500 rounded-full"></div>
          <p class="text-xs">2 Day Deadline</p>
          <div class="w-4 h-4 bg-gray-500 rounded-full"></div>
          <p class="text-xs">5 Day Deadline</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="w-full rounded-lg shadow-sm">
      <div class="flex justify-between items-center mb-3">
        <div
          class="bg-gradient-to-r from-[#FF613c]/80 via-[#FF613c] to-[#f63307] rounded-full p-1 shadow-md"
        >
          <div class="flex justify-start items-center gap-1">
            <!-- Prove Booking -->
            <div
              @click="activeTag = 1"
              class="flex-1 px-3 py-2 rounded-full cursor-pointer transition-all duration-300 relative"
              :class="activeTag == 1 ? 'bg-white/20' : 'hover:bg-white/10'"
            >
              <div class="flex items-center justify-center gap-2">
                <div
                  class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-white text-[#FF613c]"
                >
                  1
                </div>
                <p class="text-xs font-medium text-white whitespace-nowrap">
                  Get Invoice
                </p>
              </div>
              <div
                v-if="activeTag == 1"
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
              @click="activeTag = 2"
              class="flex-1 px-3 py-2 rounded-full cursor-pointer transition-all duration-300 relative"
              :class="activeTag == 2 ? 'bg-white/20' : 'hover:bg-white/10'"
            >
              <div class="flex items-center justify-center gap-2">
                <div
                  class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-white text-[#FF613c]"
                >
                  2
                </div>
                <p class="text-xs font-medium whitespace-nowrap text-white">
                  Pay Expense
                </p>
              </div>
              <div
                v-if="activeTag == 2"
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
              @click="activeTag = 3"
              class="flex-1 px-3 py-2 rounded-full cursor-pointer transition-all duration-300 relative"
              :class="activeTag == 3 ? 'bg-white/20' : 'hover:bg-white/10'"
            >
              <div class="flex items-center justify-center gap-2">
                <div
                  class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-white text-[#FF613c]"
                >
                  3
                </div>
                <p class="text-xs font-medium whitespace-nowrap text-white">
                  Expense Mail
                </p>
              </div>
              <div
                v-if="activeTag == 3"
                class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-white rounded-full"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <!-- Filters -->
      <div
        class="p-3 md:p-4 border-b border-gray-200 sticky bg-white -top-6 z-20"
      >
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <!-- Search Input -->
            <div class="relative min-w-[200px] max-w-[400px]">
              <input
                type="search"
                v-model="searchKey"
                placeholder="Search by CRM ID"
                class="w-full px-4 py-3 rounded-full shadow border border-gray-100 focus:outline-none text-xs"
                @keyup.enter="searchAction"
              />
              <div
                @click="searchAction"
                class="absolute right-2 top-2 rounded-full text-xs p-1 bg-[#FF613c] cursor-pointer"
              >
                <MagnifyingGlassIcon class="w-4 h-4 text-white" />
              </div>
            </div>

            <!-- Filter Button -->
            <button
              @click="filterShow = !filterShow"
              class="bg-[#FF613c] px-4 rounded-full shadow py-2.5 flex justify-center items-center gap-x-2 text-white text-xs cursor-pointer"
            >
              <FunnelIcon class="w-5 h-5 text-white" />
              <p>Date Range</p>
            </button>
            <button
              @click="deadlineFilterShow = !deadlineFilterShow"
              class="bg-[#FF613c] px-4 rounded-full shadow py-2.5 flex justify-center items-center gap-x-2 text-white text-xs cursor-pointer"
            >
              <FunnelIcon class="w-5 h-5 text-white" />
              <p>Deadline filter</p>
            </button>
          </div>

          <div class="flex items-center gap-2">
            <!-- Customer Status Dropdown -->
            <div class="relative">
              <select
                v-model="paymentStatus"
                @change="searchAction"
                class="appearance-none bg-[#FF613c] text-white text-xs px-4 py-3 pr-8 rounded-full shadow cursor-pointer focus:outline-none"
              >
                <option value="all">Customer Status</option>
                <option value="not_paid">Customer Not Paid</option>
                <option value="partially_paid">Customer Partially Paid</option>
                <option value="fully_paid">Customer Fully Paid</option>
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

            <!-- Expense Status Dropdown -->
            <div class="relative">
              <select
                v-model="statusFilter"
                @change="searchAction"
                class="appearance-none bg-[#FF613c] text-white text-xs px-4 py-3 pr-8 rounded-full shadow cursor-pointer focus:outline-none"
              >
                <option value="all">Expense Status</option>
                <option value="not_paid">Expense Not Paid</option>
                <option value="partially_paid">Expense Partially Paid</option>
                <option value="fully_paid">Expense Fully Paid</option>
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

            <!-- Refresh Button -->
            <button
              @click="searchAction"
              class="flex items-center gap-2 px-4 py-2.5 text-xs text-white bg-[#FF613c] rounded-full cursor-pointer hover:bg-[#e55139] transition-colors"
            >
              <svg
                class="w-5 h-5"
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
              Refresh
            </button>
          </div>
        </div>

        <!-- Filter Dropdown -->
        <transition name="slide-down">
          <div>
            <div
              v-if="filterShow"
              class="mt-3 px-4 py-3 bg-white rounded-lg shadow-lg border border-gray-100 space-y-3"
            >
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <p class="text-xs font-medium mb-2">Start Date</p>
                  <input
                    type="date"
                    v-model="startDate"
                    class="border border-gray-300 px-4 focus:outline-none w-full py-2 text-xs rounded-lg"
                  />
                </div>
                <div>
                  <p class="text-xs font-medium mb-2">End Date</p>
                  <input
                    type="date"
                    v-model="endDate"
                    class="border border-gray-300 px-4 focus:outline-none w-full py-2 text-xs rounded-lg"
                  />
                </div>
              </div>
              <div class="flex items-center gap-2 pt-2">
                <button
                  @click="clearFilter"
                  class="flex-1 text-xs bg-gray-100 px-2 py-2 rounded-lg text-center text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  Clear
                </button>
                <button
                  @click="searchAction"
                  class="flex-1 text-xs bg-[#FF613c] px-2 py-2 rounded-lg text-center text-white cursor-pointer hover:bg-[#e55139] transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
            <div
              v-if="deadlineFilterShow"
              class="mt-3 px-4 py-3 bg-white rounded-lg shadow-lg border border-gray-100 space-y-3"
            >
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <p class="text-xs font-medium mb-2">Filter Date</p>
                  <input
                    type="date"
                    v-model="deadlineDate"
                    class="border border-gray-300 px-4 focus:outline-none w-full py-2 text-xs rounded-lg"
                  />
                </div>
                <div>
                  <p class="text-xs font-medium mb-2">Deadline Days</p>
                  <input
                    type="number"
                    v-model="deadlineNumber"
                    class="border border-gray-300 px-4 focus:outline-none w-full py-2 text-xs rounded-lg"
                  />
                </div>
              </div>
              <div class="flex items-center gap-2 pt-2">
                <button
                  @click="clearDeadlineFilter"
                  class="flex-1 text-xs bg-gray-100 px-2 py-2 rounded-lg text-center text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  Clear
                </button>
                <button
                  @click="searchAction"
                  class="flex-1 text-xs bg-[#FF613c] px-2 py-2 rounded-lg text-center text-white cursor-pointer hover:bg-[#e55139] transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto relative w-[92vw]">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
              >
                CRM ID
              </th>
              <th
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700"
              >
                Expense Status
              </th>
              <th
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700"
              >
                Booking Start & End Date
              </th>
              <th
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700"
              >
                Hotel Name
              </th>
              <th
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
              >
                Customer Name
              </th>
              <th
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
              >
                Customer Status
              </th>
              <th
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
              >
                Invoice
              </th>
              <th
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700"
              >
                Deadline
              </th>

              <th
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
              >
                Sale Amount
              </th>
              <th
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
              >
                Expense Amount
              </th>
              <th
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
              >
                Discount
              </th>
              <th
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
              >
                Total Item
              </th>
              <th
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
              >
                Margin Score
              </th>
              <th
                class="px-2 md:px-4 py-3 text-right text-xs font-semibold text-gray-700"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody v-if="!loading" class="divide-y divide-gray-200">
            <template v-for="item in groups?.data || []" :key="item.id">
              <!-- Main row -->
              <tr
                class="hover:bg-gray-50 transition-colors cursor-pointer"
                @click="toggleRow(item.id)"
              >
                <!-- CRM ID -->
                <td class="px-2 md:px-4 py-4 relative">
                  <p
                    v-if="checkStatusClass(item.items) == 'red'"
                    class="w-4 h-4 bg-red-500 absolute rounded-full top-2 left-2"
                  ></p>
                  <p
                    v-if="checkStatusClass(item.items) == 'yellow'"
                    class="w-4 h-4 bg-yellow-500 absolute rounded-full top-2 left-2"
                  ></p>
                  <p
                    v-if="checkStatusClass(item.items) == 'orange'"
                    class="w-4 h-4 bg-gray-500 absolute rounded-full top-2 left-2"
                  ></p>
                  <button
                    @click.stop="openInfoDrawer(item)"
                    class="text-sm font-medium whitespace-nowrap px-3 py-1.5 bg-[#FF613c] text-white shadow-md rounded-full"
                  >
                    {{ item.booking_crm_id }}
                  </button>
                </td>

                <!-- Expense Status -->
                <td class="px-2 md:px-4 py-4">
                  <span
                    class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                    :class="getExpenseStatusClass(item.expense_status)"
                  >
                    {{ formatExpenseStatus(item.expense_status) }}
                  </span>
                </td>

                <!-- Booking Date -->
                <td class="px-2 md:px-4 py-4">
                  <div class="text-sm text-gray-700">
                    <div>{{ formatDate(item.firstest_service_date) }}</div>
                    <div class="text-xs text-gray-500 whitespace-nowrap">
                      to {{ formatDate(item.latest_service_date) }}
                    </div>
                  </div>
                </td>

                <!-- Hotel Name -->
                <td
                  class="px-2 md:px-4 py-4"
                  @click="goToProduct(item.product_id)"
                >
                  <div
                    class="text-sm text-white max-w-[150px] px-3 py-1.5 bg-[#FF613c] rounded-full shadow-md truncate"
                  >
                    {{ item.product_name }}
                  </div>
                </td>

                <!-- Customer Status -->
                <td class="px-2 md:px-4 py-4">
                  <div class="text-sm text-gray-900 max-w-[150px] truncate">
                    {{ item.customer_name }}
                  </div>
                </td>

                <!-- Customer Payment Status -->
                <td class="px-2 md:px-4 py-4">
                  <span
                    class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                    :class="getPaymentStatusClass(item.customer_payment_status)"
                  >
                    {{ formatPaymentStatus(item.customer_payment_status) }}
                  </span>
                </td>

                <!-- Invoice -->
                <td class="px-2 md:px-4 py-4">
                  <div class="text-sm text-gray-900 max-w-[150px] truncate">
                    <XCircleIcon
                      class="w-5 h-5 text-red-500"
                      v-if="!item.has_booking_confirm_letter"
                    />
                    <CheckBadgeIcon
                      class="w-5 h-5 text-green-500"
                      v-if="item.has_booking_confirm_letter"
                    />
                  </div>
                </td>

                <!-- Deadline -->
                <td class="px-2 md:px-4 py-4">
                  <div class="text-sm text-gray-900 whitespace-nowrap">
                    {{ getDeadlineDate(item.firstest_service_date) }}
                  </div>
                </td>

                <!-- Sale Amount -->
                <td class="px-2 md:px-4 py-4 text-sm font-medium text-gray-900">
                  {{ formatCurrency(item.total_amount) }}
                </td>

                <!-- Expense Amount -->
                <td class="px-2 md:px-4 py-4 text-sm font-medium text-gray-900">
                  {{ formatCurrency(item.total_cost_price) }}
                </td>

                <!-- Discount Amount -->
                <td class="px-2 md:px-4 py-4 text-sm font-medium text-gray-900">
                  {{ totalDiscount(item.items) }}
                </td>

                <!-- Res Count -->
                <td class="px-2 md:px-4 py-4 text-sm font-medium text-gray-900">
                  {{ item.items.length }}
                </td>

                <!-- Margin Score -->
                <td class="px-2 md:px-4 py-4 text-sm font-medium text-gray-900">
                  {{ marginCalc(item.total_amount, item.total_cost_price) }}
                </td>

                <!-- Actions -->
                <td class="px-2 md:px-4 py-4">
                  <div class="flex items-center justify-end gap-1">
                    <button
                      @click.stop="openPayDrawer(item)"
                      class="px-3 py-2 text-xs text-white bg-green-600 rounded-lg shadow-md transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95"
                    >
                      Pay
                    </button>
                    <button
                      @click.stop="copyReservation(item)"
                      class="p-1.5 bg-orange-100 text-orange-600 rounded-lg shadow-md transition-all duration-200 hover:bg-orange-200 hover:shadow-md active:scale-95"
                      title="Copy"
                    >
                      <DocumentDuplicateIcon class="w-5 h-5" />
                    </button>
                    <button
                      @click.stop="openInfoDrawer(item)"
                      class="p-1.5 bg-blue-100 text-blue-600 rounded-lg shadow-md transition-all duration-200 hover:bg-blue-200 hover:shadow-md active:scale-95"
                      title="View Details"
                    >
                      <InformationCircleIcon class="w-5 h-5" />
                    </button>
                    <button
                      @click.stop="openCommentAction(item)"
                      class="p-1.5 bg-orange-100 text-orange-600 rounded-lg shadow-md transition-all duration-200 hover:bg-orange-200 hover:shadow-md active:scale-95"
                      title="Comments"
                    >
                      <ChatBubbleBottomCenterIcon class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>

              <tr
                v-if="item.comment_sale || item.comment_res"
                class="bg-gray-50"
              >
                <td
                  colspan="14"
                  class="pr-4 pl-16 py-3 border-t-2 border-gray-200"
                  style="box-shadow: inset 0 8px 6px -6px rgba(0, 0, 0, 0.1)"
                >
                  <div class="space-y-2">
                    <!-- Sale Message -->
                    <div
                      v-if="item.comment_sale"
                      class="flex items-center gap-2"
                    >
                      <div class="flex-shrink-0">
                        <div
                          class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold"
                        >
                          Sale
                        </div>
                      </div>
                      <div class="flex-1">
                        <div
                          class="bg-blue-100 flex justify-start items-center gap-x-4 rounded-lg shadow-sm px-3 py-2 border border-gray-200"
                        >
                          <div class="text-sm text-gray-700">
                            {{ item.comment_sale }}
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Reservation Message -->
                    <div
                      v-if="item.comment_res"
                      class="flex items-center gap-2"
                    >
                      <div class="flex-shrink-0">
                        <div
                          class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-semibold"
                        >
                          Res
                        </div>
                      </div>
                      <div class="flex-1">
                        <div
                          class="bg-orange-100 flex justify-start items-center gap-x-4 rounded-lg shadow-sm px-3 py-2 border border-gray-200"
                        >
                          <div class="text-sm text-gray-700">
                            {{ item.comment_res }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Expandable Room Details Row -->
              <tr v-show="expandedRows.includes(item.id)">
                <td colspan="10" class="px-2 md:px-4 py-0">
                  <div class="bg-gray-50 rounded-lg p-4 mb-2">
                    <div
                      class="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2"
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
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      Room Details
                    </div>
                    <div
                      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
                    >
                      <div
                        v-for="(roomItem, index) in item.items"
                        :key="index"
                        class="bg-white rounded-lg p-3 border border-gray-200 hover:border-[#FF613c] transition-colors"
                      >
                        <div class="flex items-start justify-between gap-2">
                          <div class="flex-1">
                            <p class="text-sm font-medium text-gray-900 mb-1">
                              {{ roomItem.variant_name }}
                            </p>
                            <div
                              class="flex items-center gap-1 text-xs text-gray-500"
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
                                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                />
                              </svg>
                              <span
                                >Quantity: {{ roomItem.quantity }} ,
                                {{ roomItem.service_date }} to
                                {{ formatDate(roomItem.checkout_date) }}</span
                              >
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

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="flex flex-col items-center gap-3">
            <div
              class="w-8 h-8 border-4 border-gray-200 border-t-[#ff613c] rounded-full animate-spin"
            ></div>
            <p class="text-xs text-gray-500">Loading...</p>
          </div>
        </div>

        <!-- Empty -->
        <div
          v-if="(!loading && !groups?.data) || groups?.data.length === 0"
          class="flex flex-col items-center justify-center py-12"
        >
          <BuildingOfficeIcon class="w-12 h-12 text-gray-300 mb-2" />
          <p class="text-sm text-gray-500">No expense records found</p>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="!loading && groups?.data && groups?.data.length > 0"
        class="px-3 md:px-4 py-3 border-t border-gray-200"
      >
        <Pagination v-if="!loading" :data="groups" @change-page="changePage" />
      </div>
    </div>

    <!-- Enhanced Info Drawer with Full Details -->
    <Teleport to="body">
      <div
        v-if="infoDrawerOpen"
        class="fixed inset-0 z-50 overflow-hidden"
        @click.self="closeInfoDrawer"
      >
        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
          @click="closeInfoDrawer"
        ></div>

        <!-- Drawer -->
        <div
          class="absolute right-0 top-0 h-full w-full sm:w-[600px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto"
          :class="infoDrawerOpen ? 'translate-x-0' : 'translate-x-full'"
        >
          <div class="p-6">
            <!-- Header -->
            <div
              class="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b z-10"
            >
              <h3
                class="text-xl font-semibold text-gray-900 flex items-center gap-2"
              >
                <InformationCircleIcon class="w-6 h-6 text-[#FF613c]" />
                Expense Details
              </h3>
              <button
                @click="closeInfoDrawer"
                class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon class="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <!-- Content -->
            <div v-if="detailData" class="space-y-6">
              <!-- Add your detail content here -->
              <Payment
                :detail="detailData"
                :getDetailAction="getDetailAction"
              />
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Status Change Modal -->
    <Modal :isOpen="payDrawerOpen" @closeModal="closePayDrawer">
      <DialogPanel
        class="w-full max-w-xl transform rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
        >
          <AdjustmentsHorizontalIcon class="w-6 h-6 text-[#FF613c]" />
          Change Status
        </DialogTitle>

        <div class="space-y-4">
          <!-- Status Options -->
          <div class="space-y-2">
            <button
              @click="openModalStatus('not_paid')"
              class="w-full flex items-center justify-between px-4 py-3 border-2 border-red-200 rounded-lg hover:bg-red-50 transition-all duration-200 group"
            >
              <div class="flex items-center gap-3">
                <div
                  class="p-2 bg-red-100 rounded-full group-hover:bg-red-200 transition-colors"
                >
                  <ExclamationTriangleIcon class="w-5 h-5 text-red-600" />
                </div>
                <div class="text-left">
                  <p class="text-sm font-medium text-gray-900">Not Paid</p>
                  <p class="text-xs text-gray-500">Awaiting payment</p>
                </div>
              </div>
            </button>
            <button
              @click="openModalStatus('partially_paid')"
              class="w-full flex items-center justify-between px-4 py-3 border-2 border-orange-200 rounded-lg hover:bg-orange-50 transition-all duration-200 group"
            >
              <div class="flex items-center gap-3">
                <div
                  class="p-2 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors"
                >
                  <WalletIcon class="w-5 h-5 text-orange-600" />
                </div>
                <div class="text-left">
                  <p class="text-sm font-medium text-gray-900">
                    Partially Paid
                  </p>
                  <p class="text-xs text-gray-500">Payment isn't complete</p>
                </div>
              </div>
            </button>
            <button
              @click="openModalStatus('fully_paid')"
              class="w-full flex items-center justify-between px-4 py-3 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-all duration-200 group"
            >
              <div class="flex items-center gap-3">
                <div
                  class="p-2 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors"
                >
                  <CheckIcon class="w-5 h-5 text-green-600" />
                </div>
                <div class="text-left">
                  <p class="text-sm font-medium text-gray-900">Fully Paid</p>
                  <p class="text-xs text-gray-500">Payment is complete</p>
                </div>
              </div>
            </button>
          </div>

          <!-- Cancel Button -->
          <div class="pt-4 border-t border-gray-200">
            <button
              @click="closePayDrawer"
              class="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogPanel>
    </Modal>

    <!-- File Upload Modal -->
    <Modal :isOpen="fileModalOpen" @closeModal="closeFileModal">
      <DialogPanel
        class="w-full max-w-3xl transform rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
        >
          <AdjustmentsHorizontalIcon class="w-6 h-6 text-[#FF613c]" />
          Upload Expense Payment Slip
        </DialogTitle>

        <div class="space-y-4">
          <p class="text-xs text-gray-600">
            Please upload the payment slip to update status to
            <span class="font-semibold">{{
              formatExpenseStatus(statusChangeData.status)
            }}</span>
          </p>

          <!-- Image Upload Section -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <input
                type="file"
                id="statusImageInput"
                ref="statusFileInput"
                class="hidden"
                @change="handleStatusImageChange"
                accept="image/*"
              />

              <div
                v-if="!statusChangeData.imagePreview"
                @click="openStatusFilePicker"
                class="w-full h-[300px] border-2 border-dashed border-[#FF613c] rounded-lg flex flex-col justify-center items-center cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <svg
                  class="w-12 h-12 text-[#FF613c] mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <p class="text-sm text-[#FF613c] font-medium">
                  Upload Payment Slip
                </p>
                <p class="text-xs text-gray-500 mt-1">Click to select image</p>
              </div>

              <div v-else class="relative">
                <img
                  :src="statusChangeData.imagePreview"
                  alt="Payment Slip Preview"
                  class="w-full h-[300px] object-cover rounded-lg"
                />
                <button
                  @click="
                    statusChangeData.imagePreview = null;
                    statusChangeData.image = null;
                  "
                  class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <XCircleIcon class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- Payment Details -->
            <div class="space-y-3">
              <div>
                <label class="text-xs font-medium text-gray-700 mb-1 block"
                  >Date & Time</label
                >
                <input
                  type="datetime-local"
                  v-model="statusChangeData.date"
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]"
                />
              </div>

              <div>
                <label class="text-xs font-medium text-gray-700 mb-1 block"
                  >Amount (THB)</label
                >
                <input
                  type="number"
                  v-model="statusChangeData.amount"
                  placeholder="Enter amount"
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]"
                />
              </div>

              <div>
                <label class="text-xs font-medium text-gray-700 mb-1 block"
                  >Sender</label
                >
                <input
                  type="text"
                  v-model="statusChangeData.sender"
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]"
                />
              </div>

              <div>
                <label class="text-xs font-medium text-gray-700 mb-1 block"
                  >Receiver</label
                >
                <input
                  type="text"
                  v-model="statusChangeData.reciever"
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]"
                />
              </div>

              <div>
                <label class="text-xs font-medium text-gray-700 mb-1 block"
                  >Bank Account Type</label
                >
                <select
                  v-model="statusChangeData.interact_bank"
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]"
                >
                  <option value="personal">Personal</option>
                  <option value="company">Company</option>
                  <option value="cash_at_office">Cash at Office</option>
                  <option value="to_money_changer">To Money Changer</option>
                  <option value="deposit_management">Deposit Management</option>
                  <option value="pay_to_driver">Pay to Driver</option>
                </select>
              </div>

              <div>
                <label class="text-xs font-medium text-gray-700 mb-1 block"
                  >Currency</label
                >
                <select
                  v-model="statusChangeData.currency"
                  class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]"
                >
                  <option value="THB">THB</option>
                  <option value="MMK">MMK</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div
            class="flex items-center justify-end gap-2 pt-4 border-t border-gray-200"
          >
            <button
              @click="closeFileModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="submitStatusChangeWithImage"
              :disabled="!statusChangeData.image || loading"
              class="px-4 py-2 text-sm font-medium text-white bg-[#FF613c] rounded-lg hover:bg-[#e55139] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? "Submitting..." : "Submit & Update Status" }}
            </button>
          </div>
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
          <!-- Status Options -->
          <textarea
            name=""
            class="w-full rounded-lg border border-gray-200 focus:outline-none px-4 py-3 text-sm text-gray-700"
            rows="5"
            v-model="comment"
            placeholder="Comment"
            id=""
          ></textarea>
          <!-- Cancel Button -->
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
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import Layout from "./Layout.vue";
import { useSidebarStore } from "../stores/sidebar";
import Payment from "./GroupComponent/ExpensePart/Payment.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import {
  FunnelIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CheckIcon,
  XCircleIcon,
  BuildingOfficeIcon,
  AdjustmentsHorizontalIcon,
  ExclamationTriangleIcon,
  ChatBubbleBottomCenterIcon,
  WalletIcon,
} from "@heroicons/vue/24/outline";
import { CheckBadgeIcon, DocumentDuplicateIcon } from "@heroicons/vue/24/solid";
import { useToast } from "vue-toastification";
import { useGroupStore } from "../stores/group";
import { useCashImageStore } from "../stores/cashImage";
import Pagination from "../components/Pagination.vue";
import Modal from "../components/Modal.vue";
import { useReservationStore } from "../stores/reservation";
import { useAuthStore } from "../stores/auth";

const toast = useToast();
const reservationStore = useReservationStore();
const sidebarStore = useSidebarStore();
const { isShowSidebar } = storeToRefs(sidebarStore);
const groupStore = useGroupStore();
const cashImageStore = useCashImageStore();
const { groups } = storeToRefs(groupStore);

// State
const loading = ref(false);
const searchKey = ref("");
const statusFilter = ref("all");
const filterShow = ref(false);
const deadlineFilterShow = ref(false);
const deadlineDate = ref("");
const deadlineNumber = ref(2);
const startDate = ref("");
const endDate = ref("");
const infoDrawerOpen = ref(false);
const payDrawerOpen = ref(false);
const fileModalOpen = ref(false);
const selectedItem = ref(null);
const detailData = ref(null);
const paymentStatus = ref("all");
const sorting_type = ref("service_date");
const sorting = ref("asc");
const expandedRows = ref([]);
const openCommentModal = ref(false);

const activeTag = ref(1);

const comment = ref("");
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

// Methods to open/close drawers and modals
const openCommentAction = async (item) => {
  selectedItem.value = item;
  openCommentModal.value = true;
};

const closeCommentModal = () => {
  openCommentModal.value = false;
  comment.value = "";
  selectedItem.value = null;
};

const marginCalc = (sale, cost) => {
  if (cost === 0) return "N/A";
  const margin = ((sale - cost) / sale) * 100;
  return margin.toFixed(2) + "%";
};

const addCommentAction = async () => {
  if (!comment.value.trim()) {
    toast.error("Comment cannot be empty");
    return;
  }
  try {
    const groupFrmData = new FormData();
    groupFrmData.append("_method", "PUT");
    if (authStore.isReservation) {
      groupFrmData.append("comment_res", comment.value);
    } else {
      groupFrmData.append("comment_sale", comment.value);
    }

    await groupStore.groupUpdateAction(selectedItem.value.id, groupFrmData);
    toast.success("Comment added successfully");

    closeCommentModal();
    await getListAction();
  } catch (error) {
    console.error("Error adding comment:", error);
    toast.error("Failed to add comment");
  }
};

// Status change data
const selectedStatus = ref(null);
const statusChangeData = ref({
  status: null,
  image: null,
  imagePreview: null,
  amount: 0,
  date: "",
  bank_name: "",
  sender: "MR. THIHA@KUMAR BHUSAL",
  reciever: "",
  interact_bank: "personal",
  currency: "THB",
});

const checkStatusClass = (items) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day

  const deadlineNumber = 2; // Days before check-in to show warning
  const weekNumber = 7;
  const deadlineDate = new Date(today);
  deadlineDate.setDate(today.getDate() + deadlineNumber);
  const weekDate = new Date(today);
  weekDate.setDate(today.getDate() + weekNumber);

  for (const item of items) {
    const checkinDate = new Date(item.checkin_date);
    checkinDate.setHours(0, 0, 0, 0);

    // Check if check-in date is today - RED (highest priority)
    if (checkinDate.getTime() === today.getTime()) {
      return "red"; // or 'status-red' depending on your CSS
    }

    // Check if check-in date is within deadline (today to today+2) - YELLOW
    if (checkinDate >= today && checkinDate <= deadlineDate) {
      return "yellow"; // or 'status-warning'
    }
    if (checkinDate >= today && checkinDate <= weekDate) {
      return "orange"; // or 'status-warning'
    }
  }

  return ""; // No special status
};

const clearDeadlineFilter = () => {
  deadlineDate.value = "";
  deadlineNumber.value = 2;
  deadlineFilterShow.value = false;
};

const watchSystem = computed(() => {
  let result = {};

  if (searchKey.value) {
    result.crm_id = searchKey.value;
  }
  if (statusFilter.value && statusFilter.value !== "all") {
    result.expense_item_status = statusFilter.value;
  }
  if (paymentStatus.value != "all") {
    result.payment_status = paymentStatus.value;
  }
  if (startDate.value && endDate.value) {
    result.booking_daterange = startDate.value + "," + endDate.value;
  }

  if (deadlineDate.value) {
    result.deadline_date = deadlineDate.value;
    result.deadline_days = deadlineNumber.value;
  }

  if (sorting_type.value) {
    result.sorting_type = sorting_type.value;
  }

  if (!authStore.isReservation && !authStore.isSuperAdmin) {
    result.user_id = user.value.id;
  }

  result.sorting = sorting.value;
  result.product_type = "hotel";
  result.per_page = 10;

  return result;
});

const getListAction = async () => {
  loading.value = true;
  await groupStore.getListAction(watchSystem.value);
  loading.value = false;
};

const getDetailAction = async (id) => {
  try {
    const res = await groupStore.detailAction(id);
    detailData.value = res.result;
    return res.result;
  } catch (error) {
    console.error("Error fetching detail:", error);
    toast.error("Failed to load details");
  }
};

// Toggle row expansion
const toggleRow = (itemId) => {
  const index = expandedRows.value.indexOf(itemId);
  if (index > -1) {
    expandedRows.value.splice(index, 1);
  } else {
    expandedRows.value.push(itemId);
  }
};

// Utility function to format datetime for database
const formattedDateTimeDB = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// Methods
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
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
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
  }).format(amount);
};

const goToProduct = (id) => {
  window.open(`/product/hotel/edit/${id}`);
};

const totalDiscount = (item) => {
  let total = 0;
  for (let i = 0; i < item.length; i++) {
    total += item[i].discount || 0;
  }
  return total;
};

const getDeadlineDate = (serviceDateStr) => {
  const serviceDate = new Date(serviceDateStr);
  const deadline = new Date(serviceDate);
  deadline.setDate(deadline.getDate() - 1);
  return deadline.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getExpenseStatusClass = (status) => {
  const classes = {
    not_paid: "bg-red-100 text-red-800",
    partially_paid: "bg-yellow-100 text-yellow-800",
    fully_paid: "bg-green-100 text-green-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

const formatExpenseStatus = (status) => {
  const statuses = {
    not_paid: "Not Paid",
    partially_paid: "Partially Paid",
    fully_paid: "Fully Paid",
  };
  return statuses[status] || status;
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

const searchAction = async () => {
  filterShow.value = false;
  await getListAction();
};

const clearFilter = () => {
  startDate.value = "";
  endDate.value = "";
  searchKey.value = "";
  statusFilter.value = "all";
  filterShow.value = false;
};

const copyReservation = async (item) => {
  try {
    const response = await groupStore.detailAction(item.id);
    let res = response.result;
    console.log(res, "this is copy");

    // Check if we have data and items
    if (!res || !res.items || res.items.length === 0) {
      toast.error("No reservation items found");
      return;
    }

    // Helper function to check if a date is today, tomorrow, or the day after tomorrow
    function getUrgencyLabel(dateString) {
      if (!dateString || dateString === "null" || dateString === "-") return "";

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const dayAfterTomorrow = new Date(today);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

      // Parse the service date
      const serviceDateParts = dateString.split("-");
      // Assuming format is YYYY-MM-DD or DD-MM-YYYY
      let serviceDate;

      if (serviceDateParts[0].length === 4) {
        // YYYY-MM-DD format
        serviceDate = new Date(dateString);
      } else {
        // DD-MM-YYYY format
        serviceDate = new Date(
          `${serviceDateParts[2]}-${serviceDateParts[1]}-${serviceDateParts[0]}`
        );
      }

      serviceDate.setHours(0, 0, 0, 0);

      if (serviceDate.getTime() === today.getTime()) {
        return "*Urgent: Today*  \n";
      } else if (serviceDate.getTime() === tomorrow.getTime()) {
        return "*Urgent: Tomorrow*  \n";
      } else if (serviceDate.getTime() === dayAfterTomorrow.getTime()) {
        return "*Urgent: Day After Tomorrow*  \n";
      }

      return "";
    }

    // Calculate discount from items
    let discount = 0;
    for (let i = 0; i < res.items.length; i++) {
      discount += res.items[i].discount || 0;
    }

    // Calculate score using booking data
    let score = 0;
    let total_amount = 0;
    if (res.items && res.total_cost_price) {
      // FIXED: Changed from forEach(res.items, ...) to res.items.forEach(...)
      res.items.forEach((item) => {
        total_amount += item.amount * 1;
      });
      score = (total_amount - res.total_cost_price) / total_amount;
    }

    // Check for earliest service date across all items
    let earliestServiceDate = null;
    for (const item of res.items) {
      if (item.service_date && item.service_date !== "null") {
        if (!earliestServiceDate || item.service_date < earliestServiceDate) {
          earliestServiceDate = item.service_date;
        }
      }
    }

    // Get urgency label based on earliest service date
    const urgencyLabel = earliestServiceDate
      ? getUrgencyLabel(earliestServiceDate)
      : "";

    // Create formatted output for all items
    let allFormattedOutput = "";

    // Add urgency label at the top if needed
    if (urgencyLabel) {
      allFormattedOutput += urgencyLabel;
    }

    // Add booking header using booking data
    allFormattedOutput += `💰 Total Cost: ${res.total_cost_price} THB
🏦 Bank Name: ${res.expense_bank_name ?? res.items[0]?.product?.bank_name}  
🔢 Bank Account Number: ${
      res.expense_bank_account
        ? `➖${res.expense_bank_account}`
        : `➖${res.items[0]?.product?.bank_account_number}`
    }
#️⃣ CRM ID: ${res.booking_crm_id}
🧑‍💼 Account Name: ${res.items[0]?.product?.account_name || "-"} 
---------------------
🏨 Product Name: ${res.items[0]?.product?.name}
💵 Price: ${total_amount || 0} THB 
💸 Discount : ${res.booking?.discount || discount} THB 
💵 Balance Due: ${res.booking?.balance_due || 0} THB 
📝 Payment Status: ${res.booking?.payment_status || "unknown"}
---------------------
`;

    if (res.product_type == "Hotel") {
      res.items.forEach((item, index) => {
        const itemUrgencyLabel = getUrgencyLabel(item.checkin_date).trim();
        const urgencyPrefix = itemUrgencyLabel ? `[${itemUrgencyLabel}] ` : "";
        allFormattedOutput += `🏩 Room Name: ${item.room?.name}
📆 Check-in Date: ${urgencyPrefix}${item.checkin_date || item.service_date} : ${
          item.checkout_date || ""
        }
#️⃣ Reservation Code: ${item.crm_id}: S: (${item.sale_price || item.amount})
---------------------\n`;
      });
    } else {
      res.items.forEach((item, index) => {
        const itemUrgencyLabel = getUrgencyLabel(item.service_date).trim();
        const urgencyPrefix = itemUrgencyLabel ? `[${itemUrgencyLabel}] ` : "";
        allFormattedOutput += `🎫 Ticket Name: ${item.variation?.name}
📆 Service Date: ${urgencyPrefix}${item.service_date}
#️⃣ Reservation Code: ${item.crm_id}: S: (${item.sale_price || item.amount})
🧑‍🧑‍🧒 Quantity: ${item.quantity || 1}A${
          item.individual_pricing?.child?.quantity
            ? ` - ${item.individual_pricing.child.quantity}C`
            : ""
        }
---------------------\n`;
      });
    }

    allFormattedOutput += `💵 Total Sale Amount: ${
      res.booking?.grand_total || 0
    } THB 
📅 Sale Date: ${res.booking?.booking_date}
🤑 Score : ${score.toFixed(2)}
🚨 Verify Status : ${res.booking?.verify_status}\n`;

    // Copy to clipboard
    setTimeout(() => {
      navigator.clipboard.writeText(allFormattedOutput);
      toast.success("Success copy reservation");
    }, 0);

    return allFormattedOutput;
  } catch (error) {
    console.error("Error copying reservations:", error);
    toast.error("Failed to copy reservation");
  }
};

const openInfoDrawer = async (item) => {
  selectedItem.value = item;
  infoDrawerOpen.value = true;
  await getDetailAction(item.id);
};

const closeInfoDrawer = () => {
  infoDrawerOpen.value = false;
  selectedItem.value = null;
  detailData.value = null;
};

const openPayDrawer = async (item) => {
  selectedItem.value = item;
  payDrawerOpen.value = true;
  await getDetailAction(item.id);
};

const closePayDrawer = () => {
  payDrawerOpen.value = false;
  selectedItem.value = null;
  detailData.value = null;
};

// Status change functions
const openModalStatus = (status) => {
  selectedStatus.value = status;

  // If status is "not_paid", skip image upload and directly update status
  if (status === "not_paid") {
    updateExpenseStatus(status);
    closePayDrawer();
  } else {
    // For "partially_paid" or "fully_paid", open file modal
    fileModalOpen.value = true;
    payDrawerOpen.value = false;

    // Initialize status change data
    statusChangeData.value = {
      status: status,
      image: null,
      imagePreview: null,
      amount: detailData.value?.total_cost_price || 0,
      date: new Date().toISOString().slice(0, 16),
      bank_name: detailData.value?.expense_bank_name || "",
      sender: "MR. THIHA@KUMAR BHUSAL",
      reciever: detailData.value?.items?.[0]?.product?.account_name || "",
      interact_bank: "personal",
      currency: "THB",
    };
  }
};

// Handle file selection for status change
const handleStatusImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    statusChangeData.value.image = file;
    statusChangeData.value.imagePreview = URL.createObjectURL(file);
  }
};

// Open file picker for status change
const openStatusFilePicker = () => {
  document.getElementById("statusImageInput").click();
};

// Update expense status (for not_paid - no image needed)
const updateExpenseStatus = async (status) => {
  if (!selectedItem.value?.id) {
    toast.error("No item selected");
    return;
  }

  try {
    loading.value = true;
    let successCount = 0;
    let failCount = 0;

    // Get detail data to access all items
    const detail = await getDetailAction(selectedItem.value.id);

    if (!detail || !detail.items || detail.items.length === 0) {
      toast.error("No items found to update");
      loading.value = false;
      return;
    }

    // First, update each item's payment_status
    for (let i = 0; i < detail.items.length; i++) {
      try {
        const item = detail.items[i];
        const frmData = new FormData();
        frmData.append("_method", "PUT");
        frmData.append("payment_status", status);

        const response = await reservationStore.updateAction(frmData, item.id);

        if (response.status === 1) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        console.error(`Error updating item ${detail.items[i].id}:`, error);
        failCount++;
      }
    }

    // Then, update the group's expense_status
    if (successCount > 0) {
      const groupFrmData = new FormData();
      groupFrmData.append("_method", "PUT");
      groupFrmData.append("expense_status", status);

      const groupRes = await groupStore.groupUpdateAction(
        selectedItem.value.id,
        groupFrmData
      );

      if (groupRes.status === 1) {
        toast.success(
          `Status updated to ${formatExpenseStatus(
            status
          )} for ${successCount} items`
        );
        await getListAction();
        closePayDrawer();
      } else {
        toast.error("Items updated but failed to update group status");
      }
    } else {
      toast.error("Failed to update all items");
    }
  } catch (error) {
    console.error("Error updating status:", error);
    toast.error("An error occurred while updating status");
  } finally {
    loading.value = false;
  }
};

// Submit status change with image (for partially_paid and fully_paid)
const submitStatusChangeWithImage = async () => {
  if (!statusChangeData.value.image) {
    toast.error("Please upload a payment slip");
    return;
  }

  if (!statusChangeData.value.amount || statusChangeData.value.amount <= 0) {
    toast.error("Please enter a valid amount");
    return;
  }

  if (!selectedItem.value?.id) {
    toast.error("No item selected");
    return;
  }

  try {
    loading.value = true;
    let successCount = 0;
    let failCount = 0;

    // Get detail data to access all items
    const detail = await getDetailAction(selectedItem.value.id);

    if (!detail || !detail.items || detail.items.length === 0) {
      toast.error("No items found to update");
      loading.value = false;
      return;
    }

    // First, update each item's payment_status
    for (let i = 0; i < detail.items.length; i++) {
      try {
        const item = detail.items[i];
        const frmData = new FormData();
        frmData.append("_method", "PUT");
        frmData.append("payment_status", statusChangeData.value.status);

        const response = await reservationStore.updateAction(frmData, item.id);

        if (response.status === 1) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        console.error(`Error updating item ${detail.items[i].id}:`, error);
        failCount++;
      }
    }

    // If items were updated successfully, proceed with image upload and group status update
    if (successCount > 0) {
      // Create the expense image
      const expenseFrmData = new FormData();
      expenseFrmData.append("relatable_type", "App\\Models\\BookingItemGroup");
      expenseFrmData.append("relatable_id", selectedItem.value.id);
      expenseFrmData.append("amount", statusChangeData.value.amount);
      expenseFrmData.append("sender", statusChangeData.value.sender);
      expenseFrmData.append("reciever", statusChangeData.value.reciever);
      expenseFrmData.append(
        "interact_bank",
        statusChangeData.value.interact_bank
      );
      expenseFrmData.append("currency", statusChangeData.value.currency);
      expenseFrmData.append(
        "date",
        formattedDateTimeDB(statusChangeData.value.date)
      );
      expenseFrmData.append("image", statusChangeData.value.image);

      const expenseRes = await cashImageStore.addNewAction(expenseFrmData);

      if (expenseRes.status === 1) {
        // Then update the group's expense_status
        const statusFrmData = new FormData();
        statusFrmData.append("_method", "PUT");
        statusFrmData.append("expense_status", statusChangeData.value.status);

        const statusRes = await groupStore.groupUpdateAction(
          selectedItem.value.id,
          statusFrmData
        );

        if (statusRes.status === 1) {
          toast.success(
            `Status updated to ${formatExpenseStatus(
              statusChangeData.value.status
            )} with payment slip for ${successCount} items`
          );
          await getListAction();
          closeFileModal();
        } else {
          toast.error(
            "Payment slip uploaded but failed to update group status"
          );
        }
      } else {
        toast.error("Failed to upload payment slip");
      }
    } else {
      toast.error("Failed to update all items");
    }
  } catch (error) {
    console.error("Error submitting status change:", error);
    toast.error("An error occurred while processing your request");
  } finally {
    loading.value = false;
  }
};

// Close file modal
const closeFileModal = () => {
  fileModalOpen.value = false;
  statusChangeData.value = {
    status: null,
    image: null,
    imagePreview: null,
    amount: 0,
    date: "",
    bank_name: "",
    sender: "MR. THIHA@KUMAR BHUSAL",
    reciever: "",
    interact_bank: "personal",
    currency: "THB",
  };
  selectedStatus.value = null;
};

const setStartAndEndDate = () => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);
  end.setDate(start.getDate() + 90);

  startDate.value = start.toISOString().split("T")[0];
  endDate.value = end.toISOString().split("T")[0];
};

const changePage = async (url) => {
  await groupStore.getChangePage(url, watchSystem.value);
};

onMounted(async () => {
  setStartAndEndDate();
  await getListAction();
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

.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f9fafb;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f9fafb;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}
</style>
