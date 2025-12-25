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
          <div class="w-4 h-4 bg-green-500 rounded-full"></div>
          <p class="text-xs">5 Day Deadline</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="w-full rounded-lg shadow-sm">
      <!-- Tab Navigation -->
      <div class="flex justify-between items-center mb-3">
        <div
          class="bg-gradient-to-r from-[#FF613c]/80 via-[#FF613c] to-[#f63307] rounded-full p-1 shadow-md"
        >
          <div class="flex justify-start items-center gap-1">
            <div
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTag = tab.id"
              class="flex-1 px-3 py-2 rounded-full cursor-pointer transition-all duration-300 relative"
              :class="activeTag == tab.id ? 'bg-white/20' : 'hover:bg-white/10'"
            >
              <div class="flex items-center justify-center gap-2">
                <div
                  class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-white text-[#FF613c]"
                >
                  {{ tab.id }}
                </div>
                <p class="text-xs font-medium text-white whitespace-nowrap">
                  {{ tab.label }}
                </p>
              </div>
              <div
                v-if="activeTag == tab.id"
                class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-white rounded-full"
              ></div>
            </div>

            <div
              v-for="(arrow, index) in [1, 2]"
              :key="`arrow-${index}`"
              class="flex items-center justify-center"
            >
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

            <!-- Filter Buttons -->
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
              <ChevronDownIcon
                class="w-4 h-4 text-white absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
              />
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
              <ChevronDownIcon
                class="w-4 h-4 text-white absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
              />
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

        <!-- Filter Dropdowns -->
        <transition name="slide-down">
          <div>
            <!-- Date Range Filter -->
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

            <!-- Deadline Filter -->
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
      <div class="overflow-x-auto relative w-[92vw] h-[62vh] overflow-y-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200 z-10">
            <tr class="sticky top-0 z-10 bg-gray-50">
              <th
                v-for="header in tableHeaders"
                :key="header.key"
                class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700"
                :class="header.class"
              >
                {{ header.label }}
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
                  <div
                    :class="getDeadlineIconClass(item.items)"
                    class="w-6 h-6 absolute border border-white flex justify-center items-center rounded-full top-2 left-0"
                  >
                    <ChevronDownIcon
                      :class="
                        !expandedRows.includes(item.id) ? 'rotate-180' : ''
                      "
                      class="w-5 h-5 text-white"
                    />
                  </div>

                  <button
                    @click.stop="openBooking(item.booking_id)"
                    class="text-sm font-medium whitespace-nowrap px-3 py-1.5 bg-[#FF613c] text-white shadow-md rounded-full"
                  >
                    {{ item.booking_crm_id }}
                  </button>
                </td>

                <!-- Hotel Name -->
                <td
                  class="px-2 md:px-4 py-4 cursor-pointer relative"
                  @click.stop="goToProduct(item.product_id)"
                >
                  <div
                    class="text-sm text-white line-clamp-1 min-w-[150px] px-3 py-1.5 bg-[#FF613c] rounded-full shadow-md truncate"
                  >
                    <p
                      class="absolute top-2 right-4 bg-white text-black px-2 py-1 text-xs rounded-full border border-[#FF613c] font-medium"
                    >
                      {{ item.items.length }}
                    </p>
                    {{ item.product_name }}
                  </div>
                </td>

                <!-- Expense Status -->
                <td class="px-2 md:px-4 py-4">
                  <p
                    class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                    :class="getExpenseStatusClass(item.expense_status)"
                  >
                    {{ formatExpenseStatus(item.expense_status) }}
                  </p>
                  <span
                    class="px-1 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap"
                    :class="getPaymentStatusClass(item.customer_payment_status)"
                  >
                    C: {{ formatPaymentStatus(item.customer_payment_status) }}
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

                <!-- Customer Name -->
                <!-- <td class="px-2 md:px-4 py-4">
                  <div class="text-sm text-gray-900 max-w-[150px] truncate">
                    {{ item.customer_name }}
                  </div>
                </td> -->

                <!-- Customer Payment Status -->
                <!-- <td class="px-2 md:px-4 py-4">
                  <span
                    class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                    :class="getPaymentStatusClass(item.customer_payment_status)"
                  >
                    {{ formatPaymentStatus(item.customer_payment_status) }}
                  </span>
                </td> -->

                <!-- Invoice -->
                <td class="px-2 md:px-4 py-4">
                  <XCircleIcon
                    class="w-5 h-5 text-red-500"
                    v-if="!item.has_booking_confirm_letter"
                  />
                  <CheckBadgeIcon class="w-5 h-5 text-green-500" v-else />
                </td>

                <!-- Deadline -->
                <td class="px-2 md:px-4 py-4">
                  <div class="text-sm text-gray-900 whitespace-nowrap">
                    {{ getDeadlineDate(item.firstest_service_date) }}
                  </div>
                </td>

                <!-- Sale Amount -->
                <td class="px-2 md:px-4 py-4 text-sm font-medium text-gray-900">
                  <p class="text-red-600">
                    {{ formatCurrency(item.total_cost_price) }}
                  </p>
                  <span class="text-xs text-gray-600">
                    {{ formatCurrency(item.total_amount) }}
                  </span>
                </td>

                <!-- Expense Amount -->
                <!-- <td class="px-2 md:px-4 py-4 text-sm font-medium text-gray-900">
                  {{ formatCurrency(item.total_cost_price) }}
                </td> -->

                <!-- Discount -->
                <!-- <td class="px-2 md:px-4 py-4 text-sm font-medium text-gray-900">
                  {{ totalDiscount(item.items) }}
                </td> -->

                <!-- Margin Score -->
                <td class="px-2 md:px-4 py-4 text-sm font-medium text-gray-900">
                  <p>
                    {{ marginCalc(item.total_amount, item.total_cost_price) }}
                  </p>
                  <span class="text-xs text-gray-500">
                    D: {{ totalDiscount(item.items) }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="px-2 md:px-4 py-4">
                  <div class="flex items-center justify-end gap-1">
                    <button
                      v-for="action in tableActions"
                      :key="action.name"
                      @click.stop="action.handler(item)"
                      :class="action.class"
                      :title="action.title"
                    >
                      <component :is="action.icon" class="w-5 h-5" />
                      <span v-if="action.label">{{ action.label }}</span>
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Expandable Room Details Row -->
              <tr v-show="expandedRows.includes(item.id)">
                <td colspan="14" class="px-2 md:px-4 py-0">
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
                      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3"
                    >
                      <div
                        v-for="(roomItem, index) in item.items"
                        :key="index"
                        class="bg-white relative rounded-lg p-3 border border-gray-200 hover:border-[#FF613c] transition-colors"
                      >
                        <button
                          @click.stop="goToRoomDetail(roomItem?.variation?.id)"
                          class="absolute right-2 top-2"
                        >
                          <PencilSquareIcon
                            class="w-5 h-5 text-gray-800 hover:text-[#FF613c]"
                          />
                        </button>
                        <div class="flex items-start justify-between gap-2">
                          <div class="flex-1">
                            <p
                              class="text-sm font-medium line-clamp-1 max-w-[300px] text-gray-900 mb-1"
                            >
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
                              <span>
                                Quantity: {{ roomItem.quantity }},
                                {{ roomItem.service_date }} to
                                {{ formatDate(roomItem.checkout_date) }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Comments Row -->
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
                    <div
                      v-for="comment in getComments(item)"
                      :key="comment.type"
                      class="flex items-center gap-2"
                    >
                      <div class="flex-shrink-0">
                        <div
                          :class="comment.badgeClass"
                          class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                        >
                          {{ comment.type }}
                        </div>
                      </div>
                      <div class="flex-1">
                        <div
                          :class="comment.bgClass"
                          class="flex justify-start items-center gap-x-4 rounded-lg shadow-sm px-3 py-2 border border-gray-200"
                        >
                          <div class="text-sm text-gray-700">
                            {{ comment.text }}
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
          v-if="(!loading && !groups?.data) || groups?.data?.length === 0"
          class="flex flex-col items-center justify-center py-12"
        >
          <BuildingOfficeIcon class="w-12 h-12 text-gray-300 mb-2" />
          <p class="text-sm text-gray-500">No expense records found</p>
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

    <!-- Info Drawer -->
    <Teleport to="body">
      <div
        v-if="infoDrawerOpen"
        class="fixed inset-0 z-50 overflow-hidden"
        @click.self="closeInfoDrawer"
      >
        <div
          class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
          @click="closeInfoDrawer"
        ></div>

        <div
          class="absolute right-0 top-0 h-full w-full sm:w-[600px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto"
          :class="infoDrawerOpen ? 'translate-x-0' : 'translate-x-full'"
        >
          <div class="p-6">
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

            <div v-if="detailData" class="space-y-6">
              <Payment
                :detail="detailData"
                :getDetailAction="getDetailAction"
              />
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Pay Drawer Modal -->
    <Modal :isOpen="payDrawerOpen" @closeModal="closePayDrawer">
      <DialogPanel
        class="w-full max-w-5xl transform rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all max-h-[90vh] overflow-y-auto"
      >
        <DialogTitle
          as="div"
          class="text-lg font-semibold text-gray-900 mb-4 flex justify-between items-center gap-2"
        >
          <p class="flex justify-start items-center gap-x-2">
            <AdjustmentsHorizontalIcon class="w-6 h-6 text-[#FF613c]" />
            Change Expense Status
          </p>
          <p
            class="text-sm font-normal px-2 py-1 rounded-full"
            :class="getExpenseStatusClass(detailData?.expense_status)"
          >
            {{ detailData?.expense_status }}
          </p>
        </DialogTitle>

        <div class="space-y-6">
          <!-- Status Selection -->
          <div class="border-t pt-4">
            <h4 class="text-sm font-semibold text-gray-900 mb-3">
              Select New Status *
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                v-for="status in statusOptions"
                :key="status.value"
                @click="selectedStatus = status.value"
                :class="[
                  'flex items-center gap-3 px-4 py-3 border-2 rounded-lg transition-all',
                  selectedStatus === status.value
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
                  <p class="text-xs text-gray-500">{{ status.description }}</p>
                </div>
                <div
                  v-if="selectedStatus === status.value"
                  class="flex-shrink-0"
                >
                  <CheckIcon :class="`w-5 h-5 text-${status.color}-600`" />
                </div>
              </button>
            </div>
          </div>

          <!-- Payment Slips -->
          <div class="border-t pt-4">
            <div
              v-if="newSlips.length > 0"
              class="space-y-3 max-h-[400px] overflow-y-auto"
            >
              <div
                v-for="(slip, index) in newSlips"
                :key="index"
                class="bg-gray-50 border border-gray-200 rounded-lg p-3 relative"
              >
                <!-- <button
                  v-if="newSlips.length > 1 && !slip.id"
                  @click="removeSlip(index)"
                  class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                  title="Remove slip"
                >
                  <XCircleIcon class="w-4 h-4" />
                </button> -->

                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <!-- Image Upload/Display -->
                  <div>
                    <label class="text-xs font-medium text-gray-700 mb-1 block">
                      {{ slip.id ? "Existing" : "Payment" }} Slip Image *
                    </label>
                    <div v-if="!slip.id">
                      <input
                        type="file"
                        :id="`slipImageInput${index}`"
                        class="hidden"
                        @change="(e) => handleSlipImageChange(e, index)"
                        accept="image/*"
                      />

                      <div
                        v-if="!slip.imagePreview"
                        @click="openSlipFilePicker(index)"
                        class="w-full h-[180px] border-2 border-dashed border-[#FF613c] rounded-lg flex flex-col justify-center items-center cursor-pointer hover:bg-white transition-colors"
                      >
                        <svg
                          class="w-10 h-10 text-[#FF613c] mb-2"
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
                        <p class="text-xs text-[#FF613c] font-medium">
                          Click to Upload
                        </p>
                        <p class="text-xs text-gray-500 mt-1">
                          Slip #{{ index + 1 }}
                        </p>
                      </div>

                      <div v-else class="relative">
                        <img
                          :src="slip.imagePreview"
                          alt="Payment Slip"
                          class="w-full h-[180px] object-cover rounded-lg"
                        />
                        <button
                          @click="clearSlipImage(index)"
                          class="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <XCircleIcon class="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <img
                      v-else
                      :src="slip.imagePreview"
                      alt="Payment Slip"
                      class="w-full h-[180px] object-cover rounded-lg border"
                    />
                  </div>

                  <!-- Payment Details Column 1 -->
                  <div class="space-y-2">
                    <div>
                      <label
                        class="text-xs font-medium text-gray-700 mb-1 block"
                      >
                        Date & Time *
                      </label>
                      <input
                        v-if="!slip.id"
                        type="datetime-local"
                        v-model="slip.date"
                        class="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]"
                      />
                      <p
                        v-else
                        class="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg"
                      >
                        {{ slip.date }}
                      </p>
                    </div>

                    <div>
                      <label
                        class="text-xs font-medium text-gray-700 mb-1 block"
                      >
                        Amount *
                      </label>
                      <input
                        type="number"
                        v-model="slip.amount"
                        placeholder="Enter amount"
                        class="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]"
                      />
                    </div>

                    <div>
                      <label
                        class="text-xs font-medium text-gray-700 mb-1 block"
                      >
                        Currency *
                      </label>
                      <select
                        v-model="slip.currency"
                        class="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]"
                      >
                        <option
                          v-for="currency in currencies"
                          :key="currency"
                          :value="currency"
                        >
                          {{ currency }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <!-- Payment Details Column 2 -->
                  <div class="space-y-2">
                    <div>
                      <label
                        class="text-xs font-medium text-gray-700 mb-1 block"
                      >
                        Sender
                      </label>
                      <input
                        type="text"
                        v-model="slip.sender"
                        class="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]"
                      />
                    </div>

                    <div>
                      <label
                        class="text-xs font-medium text-gray-700 mb-1 block"
                      >
                        Receiver
                      </label>
                      <input
                        type="text"
                        v-model="slip.reciever"
                        class="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]"
                      />
                    </div>

                    <div>
                      <label
                        class="text-xs font-medium text-gray-700 mb-1 block"
                      >
                        Bank Type
                      </label>
                      <select
                        v-model="slip.interact_bank"
                        class="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]"
                      >
                        <option
                          v-for="bank in bankTypes"
                          :key="bank.value"
                          :value="bank.value"
                        >
                          {{ bank.label }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="col-span-3 text-end">
                    <template v-if="!slip.id">
                      <button
                        @click="saveNewSlip(slip, index)"
                        class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm mr-2 rounded-lg transition-colors"
                      >
                        Save
                      </button>
                      <button
                        @click="removeNewSlip(index)"
                        class="bg-gray-200 hover:bg-gray-300 px-3 py-1 text-sm mr-3 rounded-lg transition-colors"
                      >
                        Clear
                      </button>
                    </template>
                    <template v-else>
                      <button
                        @click="updateExistingSlip(slip, index)"
                        class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm mr-2 rounded-lg transition-colors"
                      >
                        Update
                      </button>
                      <button
                        @click="resetSlipToOriginal(slip, index)"
                        class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 text-sm mr-2 rounded-lg transition-colors"
                      >
                        Reset
                      </button>
                      <button
                        @click="deleteSlip(slip.id)"
                        class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm mr-3 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div
              v-else
              class="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
            >
              <svg
                class="w-12 h-12 text-gray-400 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p class="text-sm text-gray-600 mb-2">
                No new payment slips added
              </p>
              <p class="text-xs text-gray-500">
                Click "Add Payment Slip" to add new slips
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div
            class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200"
          >
            <button
              @click="closePayDrawer"
              class="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="confirmStatusChange"
              :disabled="!selectedStatus || loading"
              class="px-6 py-2.5 text-sm font-medium text-white bg-[#FF613c] rounded-lg hover:bg-[#e55139] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg
                v-if="loading"
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
              {{ loading ? "Processing..." : "Confirm & Update Status" }}
            </button>
          </div>

          <!-- Validation Messages -->
          <div
            v-if="!selectedStatus"
            class="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
          >
            <p class="text-xs text-yellow-800">
              <svg
                class="w-4 h-4 inline mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Please select a new status to continue
            </p>
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
  ChevronDownIcon,
  PencilSquareIcon,
} from "@heroicons/vue/24/outline";
import { CheckBadgeIcon, DocumentDuplicateIcon } from "@heroicons/vue/24/solid";
import { useToast } from "vue-toastification";
import { useGroupStore } from "../stores/group";
import { useCashImageStore } from "../stores/cashImage";
import Pagination from "../components/Pagination.vue";
import Modal from "../components/Modal.vue";
import { useReservationStore } from "../stores/reservation";
import { useAuthStore } from "../stores/auth";

// Stores
const toast = useToast();
const reservationStore = useReservationStore();
const sidebarStore = useSidebarStore();
const { isShowSidebar } = storeToRefs(sidebarStore);
const groupStore = useGroupStore();
const cashImageStore = useCashImageStore();
const { groups } = storeToRefs(groupStore);
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

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
const selectedItem = ref(null);
const detailData = ref(null);
const paymentStatus = ref("all");
const sorting_type = ref("service_date");
const sorting = ref("asc");
const expandedRows = ref([]);
const openCommentModal = ref(false);
const activeTag = ref(1);
const comment = ref("");
const newSlips = ref([]);
const selectedStatus = ref(null);

// Constants
const tabs = [
  { id: 1, label: "Get Invoice" },
  { id: 2, label: "Pay Expense" },
  { id: 3, label: "Expense Mail" },
];

const tableHeaders = [
  { key: "crm_id", label: "CRM ID", class: "whitespace-nowrap" },
  { key: "hotel_name", label: "Hotel Name", class: "" },
  { key: "expense_status", label: "Expense Status", class: "" },
  { key: "booking_date", label: "Booking Start & End Date", class: "" },

  // { key: "customer_name", label: "Customer Name", class: "whitespace-nowrap" },
  // {
  //   key: "customer_status",
  //   label: "Customer Status",
  //   class: "whitespace-nowrap",
  // },
  { key: "invoice", label: "Invoice", class: "whitespace-nowrap" },
  { key: "deadline", label: "Deadline", class: "" },
  { key: "expense", label: "Expense", class: "whitespace-nowrap" },
  // {
  //   key: "expense_amount",
  //   label: "Expense Amount",
  //   class: "whitespace-nowrap",
  // },
  // { key: "discount", label: "Discount", class: "whitespace-nowrap" },
  { key: "margin_score", label: "Margin Score", class: "whitespace-nowrap" },
  { key: "actions", label: "Actions", class: "text-right" },
];

const statusOptions = [
  {
    value: "not_paid",
    label: "Not Paid",
    description: "Mark as unpaid",
    icon: ExclamationTriangleIcon,
    color: "red",
  },
  {
    value: "partially_paid",
    label: "Partially Paid",
    description: "Partial payment",
    icon: WalletIcon,
    color: "orange",
  },
  {
    value: "fully_paid",
    label: "Fully Paid",
    description: "Complete payment",
    icon: CheckIcon,
    color: "green",
  },
];

const currencies = ["THB", "MMK", "USD"];

const bankTypes = [
  { value: "personal", label: "Personal" },
  { value: "company", label: "Company" },
  { value: "cash_at_office", label: "Cash at Office" },
  { value: "to_money_changer", label: "To Money Changer" },
  { value: "deposit_management", label: "Deposit Management" },
  { value: "pay_to_driver", label: "Pay to Driver" },
];

// Helper Functions
const formattedDateTimeDB = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")} ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
    date.getSeconds()
  ).padStart(2, "0")}`;
};

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

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
  }).format(amount);
};

const totalDiscount = (items) => {
  return items.reduce((total, item) => total + (item.discount || 0), 0);
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

const marginCalc = (sale, cost) => {
  if (cost === 0) return "N/A";
  return (((sale - cost) / sale) * 100).toFixed(2) + "%";
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
    fully_paid: " text-green-500",
    not_paid: " text-red-500",
    partially_paid: " text-yellow-500",
  };
  return classes[status] || " text-gray-500";
};

const formatPaymentStatus = (status) => {
  const statuses = {
    fully_paid: "Paid",
    not_paid: "Not Paid",
    partially_paid: "Partial",
  };
  return statuses[status] || status;
};

const getDeadlineIconClass = (items) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadlineDate = new Date(today);
  deadlineDate.setDate(today.getDate() + 2);

  const weekDate = new Date(today);
  weekDate.setDate(today.getDate() + 7);

  for (const item of items) {
    const checkinDate = new Date(item.checkin_date);
    checkinDate.setHours(0, 0, 0, 0);

    if (checkinDate.getTime() === today.getTime()) return "bg-red-500";
    if (checkinDate >= today && checkinDate <= deadlineDate)
      return "bg-yellow-500";
    if (checkinDate >= today && checkinDate <= weekDate) return "bg-green-500";
  }

  return "bg-gray-400";
};

const getComments = (item) => {
  const comments = [];
  if (item.comment_sale) {
    comments.push({
      type: "Sale",
      text: item.comment_sale,
      badgeClass: "bg-blue-500",
      bgClass: "bg-blue-100",
    });
  }
  if (item.comment_res) {
    comments.push({
      type: "Res",
      text: item.comment_res,
      badgeClass: "bg-orange-500",
      bgClass: "bg-orange-100",
    });
  }
  return comments;
};

// API Functions
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

const changePage = async (url) => {
  await groupStore.getChangePage(url, watchSystem.value);
};

// UI Actions
const toggleRow = (itemId) => {
  const index = expandedRows.value.indexOf(itemId);
  if (index > -1) {
    expandedRows.value.splice(index, 1);
  } else {
    expandedRows.value.push(itemId);
  }
};

const searchAction = async () => {
  filterShow.value = false;
  deadlineFilterShow.value = false;
  await getListAction();
};

const clearFilter = () => {
  startDate.value = "";
  endDate.value = "";
  searchKey.value = "";
  statusFilter.value = "all";
  filterShow.value = false;
};

const clearDeadlineFilter = () => {
  deadlineDate.value = "";
  deadlineNumber.value = 2;
  deadlineFilterShow.value = false;
};

const openBooking = (bookingId) => {
  window.open(`/bookings/new-update/${bookingId}`);
};

const goToProduct = (id) => {
  window.open(`/product/hotel/edit/${id}`);
};

const goToRoomDetail = (id) => {
  window.open(`/products/3?room_id=${id}`);
};

// Drawer Actions
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

const originalSlipsData = ref({});

// Modify the openPayDrawer function to store original data
const openPayDrawer = async (item) => {
  selectedItem.value = item;
  await getDetailAction(item.id);
  selectedStatus.value = detailData.value.expense_status;

  // Store original data for reset functionality
  originalSlipsData.value = {};

  newSlips.value = detailData.value.expense.map((slip) => {
    const slipData = {
      image: slip.image || null,
      imagePreview: slip.image_url || null,
      amount: slip.amount || 0,
      date: slip.date,
      sender: slip.sender || "MR. THIHA@KUMAR BHUSAL",
      reciever:
        slip.reciever ||
        detailData.value?.items?.[0]?.product?.account_name ||
        "",
      interact_bank: slip.interact_bank || "personal",
      currency: slip.currency || "THB",
      id: slip.id,
    };

    // Store original data for slips with ID
    if (slip.id) {
      originalSlipsData.value[slip.id] = { ...slipData };
    }

    return slipData;
  });

  addNewSlip();
  payDrawerOpen.value = true;
};

// Add reset function
const resetSlipToOriginal = (slip, index) => {
  if (!slip.id || !originalSlipsData.value[slip.id]) {
    toast.error("Cannot reset: No original data found");
    return;
  }

  const originalData = originalSlipsData.value[slip.id];

  // Reset the slip to original values
  newSlips.value[index] = {
    ...originalData,
    // Create a deep copy to avoid reference issues
    image: originalData.image,
    imagePreview: originalData.imagePreview,
    amount: originalData.amount,
    date: originalData.date,
    sender: originalData.sender,
    reciever: originalData.reciever,
    interact_bank: originalData.interact_bank,
    currency: originalData.currency,
    id: originalData.id,
  };

  toast.success("Slip data reset to original values");
};

// Also update closePayDrawer to clear original data
const closePayDrawer = () => {
  payDrawerOpen.value = false;
  selectedItem.value = null;
  detailData.value = null;
  selectedStatus.value = null;
  newSlips.value = [];
  originalSlipsData.value = {}; // Clear original data
};

const openCommentAction = (item) => {
  selectedItem.value = item;
  openCommentModal.value = true;
};

const closeCommentModal = () => {
  openCommentModal.value = false;
  comment.value = "";
  selectedItem.value = null;
};

// Copy Reservation
const copyReservation = async (item) => {
  try {
    const response = await groupStore.detailAction(item.id);
    const res = response.result;

    if (!res || !res.items || res.items.length === 0) {
      toast.error("No reservation items found");
      return;
    }

    const getUrgencyLabel = (dateString) => {
      if (!dateString || dateString === "null" || dateString === "-") return "";

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const serviceDate = new Date(dateString);
      serviceDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (serviceDate - today) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 0) return "*Urgent: Today*  \n";
      if (diffDays === 1) return "*Urgent: Tomorrow*  \n";
      if (diffDays === 2) return "*Urgent: Day After Tomorrow*  \n";
      return "";
    };

    const discount = res.items.reduce(
      (sum, item) => sum + (item.discount || 0),
      0
    );
    const total_amount = res.items.reduce((sum, item) => sum + item.amount, 0);
    const score = res.total_cost_price
      ? ((total_amount - res.total_cost_price) / total_amount).toFixed(2)
      : 0;

    const earliestServiceDate = res.items.reduce((earliest, item) => {
      if (item.service_date && item.service_date !== "null") {
        return !earliest || item.service_date < earliest
          ? item.service_date
          : earliest;
      }
      return earliest;
    }, null);

    const urgencyLabel = earliestServiceDate
      ? getUrgencyLabel(earliestServiceDate)
      : "";

    let output = urgencyLabel;
    output += `💰 Total Cost: ${res.total_cost_price} THB
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
💸 Discount: ${res.booking?.discount || discount} THB 
💵 Balance Due: ${res.booking?.balance_due || 0} THB 
📝 Payment Status: ${res.booking?.payment_status || "unknown"}
---------------------
`;

    res.items.forEach((item) => {
      const itemUrgencyLabel = getUrgencyLabel(
        item.checkin_date || item.service_date
      ).trim();
      const urgencyPrefix = itemUrgencyLabel ? `[${itemUrgencyLabel}] ` : "";

      if (res.product_type === "Hotel") {
        output += `🏩 Room Name: ${item.room?.name}
📆 Check-in Date: ${urgencyPrefix}${item.checkin_date || item.service_date} : ${
          item.checkout_date || ""
        }
#️⃣ Reservation Code: ${item.crm_id}: S: (${item.sale_price || item.amount})
---------------------\n`;
      } else {
        output += `🎫 Ticket Name: ${item.variation?.name}
📆 Service Date: ${urgencyPrefix}${item.service_date}
#️⃣ Reservation Code: ${item.crm_id}: S: (${item.sale_price || item.amount})
🧑‍🧑‍🧒 Quantity: ${item.quantity || 1}A${
          item.individual_pricing?.child?.quantity
            ? ` - ${item.individual_pricing.child.quantity}C`
            : ""
        }
---------------------\n`;
      }
    });

    output += `💵 Total Sale Amount: ${res.booking?.grand_total || 0} THB 
📅 Sale Date: ${res.booking?.booking_date}
🤑 Score: ${score}
🚨 Verify Status: ${res.booking?.verify_status}\n`;

    await navigator.clipboard.writeText(output);
    toast.success("Success copy reservation");
  } catch (error) {
    console.error("Error copying reservations:", error);
    toast.error("Failed to copy reservation");
  }
};

// TABLE ACTIONS - MOVED HERE AFTER FUNCTION DEFINITIONS
const tableActions = [
  {
    name: "pay",
    label: "Pay",
    icon: null,
    handler: openPayDrawer,
    class:
      "px-3 py-2 text-xs text-white bg-green-600 rounded-lg shadow-md transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95",
    title: "Pay",
  },
  {
    name: "copy",
    icon: DocumentDuplicateIcon,
    handler: copyReservation,
    class:
      "p-1.5 bg-orange-100 text-orange-600 rounded-lg shadow-md transition-all duration-200 hover:bg-orange-200 hover:shadow-md active:scale-95",
    title: "Copy",
  },
  {
    name: "info",
    icon: InformationCircleIcon,
    handler: openInfoDrawer,
    class:
      "p-1.5 bg-blue-100 text-blue-600 rounded-lg shadow-md transition-all duration-200 hover:bg-blue-200 hover:shadow-md active:scale-95",
    title: "View Details",
  },
  {
    name: "comment",
    icon: ChatBubbleBottomCenterIcon,
    handler: openCommentAction,
    class:
      "p-1.5 bg-orange-100 text-orange-600 rounded-lg shadow-md transition-all duration-200 hover:bg-orange-200 hover:shadow-md active:scale-95",
    title: "Comments",
  },
];

// Slip Actions
const addNewSlip = () => {
  newSlips.value.unshift({
    image: null,
    imagePreview: null,
    amount: detailData.value?.total_cost_price || 0,
    date: new Date().toISOString().slice(0, 16),
    sender: "MR. THIHA@KUMAR BHUSAL",
    reciever: detailData.value?.items?.[0]?.product?.account_name || "",
    interact_bank: "personal",
    currency: "THB",
    id: null,
  });
};

const removeSlip = (index) => {
  if (newSlips.value.length > 1) {
    newSlips.value.splice(index, 1);
  }
  addNewSlip();
};

const handleSlipImageChange = (e, index) => {
  const file = e.target.files[0];
  if (file) {
    newSlips.value[index].image = file;
    newSlips.value[index].imagePreview = URL.createObjectURL(file);
  }
};

const openSlipFilePicker = (index) => {
  document.getElementById(`slipImageInput${index}`).click();
};

const clearSlipImage = (index) => {
  newSlips.value[index].image = null;
  newSlips.value[index].imagePreview = null;
};

const saveNewSlip = async (slip, index) => {
  if (!slip.image) {
    toast.error("Please upload a payment slip image");
    return;
  }
  if (!slip.amount || slip.amount <= 0) {
    toast.error("Please enter a valid amount");
    return;
  }
  if (!slip.date) {
    toast.error("Please select a date and time");
    return;
  }

  try {
    loading.value = true;
    const expenseFrmData = new FormData();
    expenseFrmData.append("relatable_type", "App\\Models\\BookingItemGroup");
    expenseFrmData.append("relatable_id", selectedItem.value.id);
    expenseFrmData.append("amount", slip.amount);
    expenseFrmData.append("sender", slip.sender);
    expenseFrmData.append("reciever", slip.reciever);
    expenseFrmData.append("interact_bank", slip.interact_bank);
    expenseFrmData.append("currency", slip.currency);
    expenseFrmData.append("date", formattedDateTimeDB(slip.date));
    expenseFrmData.append("image", slip.image);

    const response = await cashImageStore.addNewAction(expenseFrmData);

    if (response.status === 1) {
      toast.success("Payment slip saved successfully");
      await getDetailAction(selectedItem.value.id);
      newSlips.value[index].id = response.result.id;
      newSlips.value[index].imagePreview = response.result.image_url;
    } else {
      toast.error("Failed to save payment slip");
    }
  } catch (error) {
    console.error("Error saving slip:", error);
    toast.error("An error occurred while saving the slip");
  } finally {
    loading.value = false;
    addNewSlip();
  }
};

const removeNewSlip = (index) => {
  const slip = newSlips.value[index];
  if (!slip.id) {
    if (newSlips.value.length > 1) {
      newSlips.value.splice(index, 1);
      toast.success("Slip removed");
      addNewSlip();
    } else {
      toast.error("At least one slip is required");
    }
  } else {
    toast.error("Use delete button for saved slips");
  }
};

const updateExistingSlip = async (slip, index) => {
  if (!slip.id) {
    toast.error("Invalid slip ID");
    return;
  }

  try {
    loading.value = true;
    const expenseFrmData = new FormData();
    expenseFrmData.append("_method", "PUT");
    expenseFrmData.append("amount", slip.amount);
    expenseFrmData.append("sender", slip.sender);
    expenseFrmData.append("reciever", slip.reciever);
    expenseFrmData.append("interact_bank", slip.interact_bank);
    expenseFrmData.append("currency", slip.currency);
    expenseFrmData.append("date", formattedDateTimeDB(slip.date));

    const response = await cashImageStore.updateAction(expenseFrmData, slip.id);

    if (response.status === 1) {
      toast.success("Payment slip updated successfully");
      await getDetailAction(selectedItem.value.id);
    } else {
      toast.error("Failed to update payment slip");
    }
  } catch (error) {
    console.error("Error updating slip:", error);
    toast.error("An error occurred while updating the slip");
  } finally {
    loading.value = false;
  }
};

const deleteSlip = async (slipId) => {
  if (!slipId) {
    toast.error("Invalid slip ID");
    return;
  }

  try {
    loading.value = true;
    const response = await cashImageStore.deleteAction(slipId);

    if (response.status === 1) {
      toast.success("Payment slip deleted successfully");
      await getDetailAction(selectedItem.value.id);
      const index = newSlips.value.findIndex((slip) => slip.id === slipId);
      if (index > -1) {
        newSlips.value.splice(index, 1);
      }
    } else {
      toast.error("Failed to delete payment slip");
    }
  } catch (error) {
    console.error("Error deleting slip:", error);
    toast.error("An error occurred while deleting the slip");
  } finally {
    loading.value = false;
  }
};

// Status Change
const confirmStatusChange = async () => {
  if (!selectedStatus.value) {
    toast.error("Please select a status");
    return;
  }
  if (!selectedItem.value?.id) {
    toast.error("No item selected");
    return;
  }

  try {
    loading.value = true;
    const detail = await getDetailAction(selectedItem.value.id);

    if (!detail || !detail.items || detail.items.length === 0) {
      toast.error("No items found to update");
      return;
    }

    let successCount = 0;
    for (const item of detail.items) {
      try {
        const frmData = new FormData();
        frmData.append("_method", "PUT");
        frmData.append("payment_status", selectedStatus.value);

        const response = await reservationStore.updateAction(frmData, item.id);
        if (response.status === 1) successCount++;
      } catch (error) {
        console.error(`Error updating item ${item.id}:`, error);
      }
    }

    if (successCount > 0) {
      const groupFrmData = new FormData();
      groupFrmData.append("_method", "PUT");
      groupFrmData.append("expense_status", selectedStatus.value);

      const groupRes = await groupStore.groupUpdateAction(
        selectedItem.value.id,
        groupFrmData
      );

      if (groupRes.status === 1) {
        toast.success(
          `Status updated to ${formatExpenseStatus(
            selectedStatus.value
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

// Comment Action
const addCommentAction = async () => {
  if (!comment.value.trim()) {
    toast.error("Comment cannot be empty");
    return;
  }

  try {
    const groupFrmData = new FormData();
    groupFrmData.append("_method", "PUT");
    groupFrmData.append(
      authStore.isReservation ? "comment_res" : "comment_sale",
      comment.value
    );

    await groupStore.groupUpdateAction(selectedItem.value.id, groupFrmData);
    toast.success("Comment added successfully");
    closeCommentModal();
    await getListAction();
  } catch (error) {
    console.error("Error adding comment:", error);
    toast.error("Failed to add comment");
  }
};

// Computed - MOVED HERE AFTER ALL FUNCTIONS ARE DEFINED
const watchSystem = computed(() => {
  const result = {
    sorting: sorting.value,
    product_type: "hotel",
    per_page: 10,
  };

  if (searchKey.value) result.crm_id = searchKey.value;
  if (statusFilter.value && statusFilter.value !== "all") {
    result.expense_item_status = statusFilter.value;
  }
  if (paymentStatus.value !== "all") {
    result.payment_status = paymentStatus.value;
  }
  if (startDate.value && endDate.value) {
    result.booking_daterange = `${startDate.value},${endDate.value}`;
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

  return result;
});

// Initialization
const setStartAndEndDate = () => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);
  end.setDate(start.getDate() + 90);

  startDate.value = start.toISOString().split("T")[0];
  endDate.value = end.toISOString().split("T")[0];
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

.slide-down-enter-from,
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
