<template>
  <Layout>
    <div class="flex gap-4 w-full min-h-[580px]">
      <!-- LEFT: Chart -->
      <div class="flex-[2] bg-white rounded-xl shadow-sm p-5 flex flex-col">
        <!-- Header -->
        <div class="flex items-start justify-between flex-wrap gap-3 mb-4">
          <div>
            <p class="text-sm font-semibold text-gray-800">Expense Graph</p>
            <p class="text-xs text-gray-500 mt-1">
              Total Amount:
              <span class="text-[#D85A30] font-semibold"
                >{{ formatNumber(summary.grand_total_amount) }} THB</span
              >
              &nbsp; Cost:
              <span class="font-semibold text-gray-700"
                >{{ formatNumber(summary.grand_total_cost_price) }} THB</span
              >
            </p>
          </div>

          <div class="flex justify-between items-start gap-x-2">
            <div class="flex items-center gap-2 flex-wrap">
              <!-- Product Type -->
              <div
                class="flex border border-gray-200 rounded-lg overflow-hidden text-xs"
              >
                <button
                  v-for="t in typeOptions"
                  :key="t.val"
                  @click="
                    productType = t.val;
                    fetchData();
                  "
                  :class="[
                    'px-3 py-1.5 font-medium transition-colors',
                    productType === t.val
                      ? 'bg-[#D85A30] text-white'
                      : 'text-gray-600 hover:bg-gray-50',
                  ]"
                >
                  {{ t.label }}
                </button>
              </div>

              <!-- Mode -->
              <div
                class="flex border border-gray-200 rounded-lg overflow-hidden text-xs"
              >
                <button
                  v-for="m in modeOptions"
                  :key="m.val"
                  @click="mode = m.val"
                  :class="[
                    'px-3 py-1.5 font-medium transition-colors',
                    mode === m.val
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-50',
                  ]"
                >
                  {{ m.label }}
                </button>
              </div>

              <!-- Expense Status -->
              <!-- <div
                class="flex border border-gray-200 rounded-lg overflow-hidden text-xs"
              >
                <button
                  @click="
                    expenseStatus = null;
                    fetchData();
                  "
                  :class="[
                    'px-3 py-1.5 font-medium transition-colors',
                    expenseStatus === null
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-600 hover:bg-gray-50',
                  ]"
                >
                  All Expense
                </button>
                <button
                  @click="
                    expenseStatus = 'not_paid';
                    fetchData();
                  "
                  :class="[
                    'px-3 py-1.5 font-medium transition-colors',
                    expenseStatus === 'not_paid'
                      ? 'bg-red-500 text-white'
                      : 'text-gray-600 hover:bg-gray-50',
                  ]"
                >
                  Not Paid
                </button>
              </div> -->

              <!-- Customer Payment Status -->
              <div
                class="flex border border-gray-200 rounded-lg overflow-hidden text-xs"
              >
                <button
                  @click="
                    customerPaymentStatus = null;
                    fetchData();
                  "
                  :class="[
                    'px-3 py-1.5 font-medium transition-colors',
                    customerPaymentStatus === null
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-600 hover:bg-gray-50',
                  ]"
                >
                  All Customer
                </button>
                <button
                  @click="
                    customerPaymentStatus = 'fully_paid';
                    fetchData();
                  "
                  :class="[
                    'px-3 py-1.5 font-medium transition-colors',
                    customerPaymentStatus === 'fully_paid'
                      ? 'bg-green-500 text-white'
                      : 'text-gray-600 hover:bg-gray-50',
                  ]"
                >
                  Fully Paid
                </button>
                <button
                  @click="
                    customerPaymentStatus = 'not_paid';
                    fetchData();
                  "
                  :class="[
                    'px-3 py-1.5 font-medium transition-colors',
                    customerPaymentStatus === 'not_paid'
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-600 hover:bg-gray-50',
                  ]"
                >
                  Not Paid
                </button>
              </div>

              <!-- Year -->
              <select
                v-model="selectedYear"
                @change="fetchData"
                class="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#D85A30]"
              >
                <option v-for="y in yearOptions" :key="y" :value="y">
                  {{ y }}
                </option>
              </select>

              <!-- Month -->
              <select
                v-model="selectedMonth"
                @change="fetchData"
                class="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#D85A30]"
              >
                <option
                  v-for="(m, i) in monthLabels"
                  :key="i + 1"
                  :value="i + 1"
                >
                  {{ m }}
                </option>
              </select>
            </div>
            <!-- Refresh -->
            <div
              class="p-2 border border-gray-200 flex justify-center items-center gap-x-2 text-xs text-white bg-[#FF613c] rounded-lg"
              @click="refresh"
            >
              <ArrowPathIcon class="w-4 h-4 text-white" /> Refresh
            </div>
          </div>
        </div>

        <!-- Active filters display -->
        <div
          v-if="expenseStatus || customerPaymentStatus"
          class="flex gap-2 mb-3 flex-wrap"
        >
          <span
            v-if="expenseStatus"
            class="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium flex items-center gap-1"
          >
            Expense: {{ expenseStatus }}
            <button
              @click="
                expenseStatus = null;
                fetchData();
              "
              class="ml-1 hover:text-red-800"
            >
              ×
            </button>
          </span>
          <span
            v-if="customerPaymentStatus"
            class="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-600 font-medium flex items-center gap-1"
          >
            Customer: {{ customerPaymentStatus }}
            <button
              @click="
                customerPaymentStatus = null;
                fetchData();
              "
              class="ml-1 hover:text-green-800"
            >
              ×
            </button>
          </span>
        </div>

        <!-- Summary cards -->
        <div class="grid grid-cols-3 gap-2 mb-4" v-if="authStore.isSuperAdmin">
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-[10px] text-gray-500 mb-1">Grand Total Amount</p>
            <p class="text-sm font-semibold text-[#D85A30]">
              {{ formatNumber(summary.grand_total_amount) }} THB
            </p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-[10px] text-gray-500 mb-1">Grand Total Cost</p>
            <p class="text-sm font-semibold text-gray-800">
              {{ formatNumber(summary.grand_total_cost_price) }} THB
            </p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-[10px] text-gray-500 mb-1">Total Groups</p>
            <p class="text-sm font-semibold text-gray-800">{{ totalGroups }}</p>
          </div>
        </div>

        <!-- Legend -->
        <div class="flex flex-wrap gap-3 text-[11px] text-gray-500 mb-3">
          <span class="flex items-center gap-1.5"
            ><span class="w-2.5 h-2.5 rounded-sm bg-[#D85A30]"></span>Hotel
            amount</span
          >
          <span class="flex items-center gap-1.5"
            ><span class="w-2.5 h-2.5 rounded-sm bg-blue-500"></span>Ticket
            amount</span
          >
          <span class="flex items-center gap-1.5"
            ><span class="w-2.5 h-2.5 rounded-sm bg-[#D85A30] opacity-40"></span
            >Hotel cost</span
          >
          <span class="flex items-center gap-1.5"
            ><span class="w-2.5 h-2.5 rounded-sm bg-blue-500 opacity-40"></span
            >Ticket cost</span
          >
        </div>

        <!-- Chart -->
        <div class="flex-1 relative min-h-[360px]">
          <div
            v-if="loadingGraph"
            class="absolute inset-0 flex items-center justify-center"
          >
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D85A30]"
            ></div>
          </div>
          <BarChart
            v-else
            :chartData="chartData"
            :options="chartOptions"
            class="w-full h-full"
          />
        </div>
      </div>

      <!-- RIGHT: Day detail + group lists -->
      <div class="flex-1 bg-white rounded-xl shadow-sm flex flex-col h-[85vh]">
        <!-- Header -->
        <div class="px-4 py-3 border-b border-gray-100">
          <div v-if="selectedDay">
            <p class="text-sm font-semibold text-gray-800">
              {{ selectedDay.day_label }}
            </p>
            <p class="text-xs text-gray-400 mt-0.5">
              {{ selectedDay.combined_total_groups }} groups &nbsp;·&nbsp;
              {{ formatNumber(selectedDay.combined_total_amount) }} THB
            </p>
          </div>
          <p v-else class="text-sm text-gray-400 py-1">
            Click a bar to see day detail
          </p>
        </div>

        <!-- Tab switcher — only shown when day selected -->
        <div v-if="selectedDay" class="flex border-b border-gray-100 text-xs">
          <button
            v-for="tab in visibleTabs"
            :key="tab.val"
            @click="activeTab = tab.val"
            :class="[
              'flex-1 py-2 font-medium transition-colors',
              activeTab === tab.val
                ? 'border-b-2 border-[#D85A30] text-[#D85A30]'
                : 'text-gray-400 hover:text-gray-600',
            ]"
          >
            {{ tab.label }}
            <span
              v-if="tab.val === 'hotel' && selectedDay.hotel?.total_groups"
              class="ml-1 text-[10px] bg-orange-100 text-[#D85A30] px-1.5 py-0.5 rounded-full"
            >
              {{ selectedDay.hotel.total_groups }}
            </span>
            <span
              v-if="
                tab.val === 'ticket' &&
                selectedDay.entrance_ticket?.total_groups
              "
              class="ml-1 text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full"
            >
              {{ selectedDay.entrance_ticket.total_groups }}
            </span>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-4 py-3">
          <!-- Empty state -->
          <div
            v-if="!selectedDay"
            class="flex flex-col items-center justify-center h-full text-gray-300 py-12"
          >
            <svg
              class="w-12 h-12 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p class="text-xs text-center leading-relaxed">
              Select a date on the<br />graph to view details
            </p>
          </div>

          <!-- Summary tab -->
          <template v-else-if="activeTab === 'summary'">
            <div
              v-if="showHotel && selectedDay.hotel"
              class="border border-gray-100 rounded-lg p-3 mb-3"
            >
              <div class="flex items-center gap-2 mb-2">
                <span class="w-2 h-2 rounded-full bg-[#D85A30]"></span>
                <p class="text-xs font-semibold text-gray-800">Hotel</p>
              </div>
              <DetailRow
                label="Amount"
                :val="formatNumber(selectedDay.hotel.total_amount) + ' THB'"
              />
              <DetailRow
                label="Cost Price"
                :val="formatNumber(selectedDay.hotel.total_cost_price) + ' THB'"
              />
              <DetailRow label="Groups" :val="selectedDay.hotel.total_groups" />
            </div>

            <div
              v-if="showTicket && selectedDay.entrance_ticket"
              class="border border-gray-100 rounded-lg p-3 mb-3"
            >
              <div class="flex items-center gap-2 mb-2">
                <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                <p class="text-xs font-semibold text-gray-800">
                  Entrance Ticket
                </p>
              </div>
              <DetailRow
                label="Amount"
                :val="
                  formatNumber(selectedDay.entrance_ticket.total_amount) +
                  ' THB'
                "
              />
              <DetailRow
                label="Cost Price"
                :val="
                  formatNumber(selectedDay.entrance_ticket.total_cost_price) +
                  ' THB'
                "
              />
              <DetailRow
                label="Groups"
                :val="selectedDay.entrance_ticket.total_groups"
              />
            </div>

            <div class="border-t border-gray-100 pt-3 mt-1">
              <p class="text-[11px] font-medium text-gray-500 mb-2">Combined</p>
              <DetailRow
                label="Total Amount"
                :val="formatNumber(selectedDay.combined_total_amount) + ' THB'"
                highlight
              />
              <DetailRow
                label="Total Cost"
                :val="
                  formatNumber(selectedDay.combined_total_cost_price) + ' THB'
                "
              />
              <DetailRow
                label="Total Groups"
                :val="selectedDay.combined_total_groups"
              />
            </div>
          </template>

          <!-- Hotel groups tab -->
          <template v-else-if="activeTab === 'hotel'">
            <div
              v-if="loadingHotelGroups"
              class="flex items-center justify-center h-40"
            >
              <div
                class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#D85A30]"
              ></div>
            </div>
            <div
              v-else-if="hotelGroups.length === 0"
              class="flex flex-col items-center justify-center h-40 text-gray-300"
            >
              <p class="text-xs">No hotel groups this day</p>
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="group in hotelGroups"
                :key="group.id"
                class="border border-gray-100 rounded-lg p-3 hover:border-[#D85A30]/40 hover:bg-orange-50/30 transition-all cursor-pointer"
                @click="console.log(group)"
              >
                <div class="flex items-start justify-between mb-1.5">
                  <div>
                    <p class="text-xs font-semibold text-gray-800">
                      {{ group.customer_name }}
                    </p>
                    <p class="text-[10px] text-gray-400 mt-0.5">
                      {{ group.booking_crm_id }}
                    </p>
                  </div>
                  <span
                    :class="[
                      'text-[10px] font-medium px-2 py-0.5 rounded-full',
                      group.expense_status === 'fully_paid'
                        ? 'bg-green-100 text-green-700'
                        : group.expense_status === 'partially_paid'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-600',
                    ]"
                  >
                    E: {{ group.expense_status ?? "not_paid" }}
                  </span>
                </div>
                <p class="text-[11px] text-gray-500">
                  {{ group.product_name }}
                </p>
                <div
                  class="flex items-center justify-between mt-1.5 pt-1.5 border-t border-gray-50"
                >
                  <p class="text-[10px] text-gray-400">
                    Date:
                    <span class="text-gray-600">{{
                      group.firstest_service_date
                    }}</span>
                  </p>
                  <p class="text-xs font-semibold text-gray-700">
                    {{ formatNumber(group.total_cost_price) }}
                    <span class="text-[10px] font-normal text-gray-400"
                      >THB</span
                    >
                  </p>
                </div>
                <!-- Add this action row at the bottom of each card -->
                <div
                  class="flex items-center justify-between mt-2 pt-2 border-t border-gray-50"
                >
                  <button
                    @click="goToGroup(group, 'hotel')"
                    class="text-[10px] text-gray-400 hover:text-gray-600"
                  >
                    Open →
                  </button>
                  <button
                    @click.stop="openGroupAmendPicker(group)"
                    class="flex items-center gap-1 text-[10px] bg-[#D85A30] text-white px-2 py-1 rounded-lg"
                  >
                    <PencilSquareIcon class="w-3 h-3" />
                    Amend
                  </button>
                </div>
              </div>

              <!-- Pagination -->
              <div
                v-if="hotelTotalPages > 1"
                class="flex items-center justify-center gap-2 pt-2"
              >
                <button
                  @click="changeHotelPage(hotelPage - 1)"
                  :disabled="hotelPage === 1"
                  class="text-xs px-2 py-1 rounded border border-gray-200 disabled:opacity-40 hover:border-[#D85A30] hover:text-[#D85A30]"
                >
                  ‹
                </button>
                <span class="text-xs text-gray-500"
                  >{{ hotelPage }} / {{ hotelTotalPages }}</span
                >
                <button
                  @click="changeHotelPage(hotelPage + 1)"
                  :disabled="hotelPage === hotelTotalPages"
                  class="text-xs px-2 py-1 rounded border border-gray-200 disabled:opacity-40 hover:border-[#D85A30] hover:text-[#D85A30]"
                >
                  ›
                </button>
              </div>
            </div>
          </template>

          <!-- Attraction groups tab -->
          <template v-else-if="activeTab === 'ticket'">
            <div
              v-if="loadingTicketGroups"
              class="flex items-center justify-center h-40"
            >
              <div
                class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"
              ></div>
            </div>
            <div
              v-else-if="ticketGroups.length === 0"
              class="flex flex-col items-center justify-center h-40 text-gray-300"
            >
              <p class="text-xs">No ticket groups this day</p>
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="group in ticketGroups"
                :key="group.id"
                class="border border-gray-100 rounded-lg p-3 hover:border-blue-400/40 hover:bg-blue-50/30 transition-all cursor-pointer"
                @click="goToGroup(group, 'attraction')"
              >
                <div class="flex items-start justify-between mb-1.5">
                  <div>
                    <p class="text-xs font-semibold text-gray-800">
                      {{ group.customer_name }}
                    </p>
                    <p class="text-[10px] text-gray-400 mt-0.5">
                      {{ group.booking_crm_id }}
                    </p>
                  </div>
                  <span
                    :class="[
                      'text-[10px] font-medium px-2 py-0.5 rounded-full',
                      group.expense_status === 'fully_paid'
                        ? 'bg-green-100 text-green-700'
                        : group.expense_status === 'partially_paid'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-600',
                    ]"
                  >
                    E: {{ group.expense_status ?? "not_paid" }}
                  </span>
                </div>
                <p class="text-[11px] text-gray-500">
                  {{ group.product_name }}
                </p>
                <div
                  class="flex items-center justify-between mt-1.5 pt-1.5 border-t border-gray-50"
                >
                  <p class="text-[10px] text-gray-400">
                    Date:
                    <span class="text-gray-600">{{
                      group.firstest_service_date
                    }}</span>
                  </p>
                  <p class="text-xs font-semibold text-gray-700">
                    {{ formatNumber(group.total_cost_price) }}
                    <span class="text-[10px] font-normal text-gray-400"
                      >THB</span
                    >
                  </p>
                </div>
                <!-- Add this action row at the bottom of each card -->
                <div
                  class="flex items-center justify-between mt-2 pt-2 border-t border-gray-50"
                >
                  <button
                    @click="goToGroup(group, 'attraction')"
                    class="text-[10px] text-gray-400 hover:text-gray-600"
                  >
                    Open →
                  </button>
                  <button
                    @click.stop="openGroupAmendPicker(group)"
                    class="flex items-center gap-1 text-[10px] bg-[#D85A30] text-white px-2 py-1 rounded-lg"
                  >
                    <PencilSquareIcon class="w-3 h-3" />
                    Amend
                  </button>
                </div>
              </div>

              <!-- Pagination -->
              <div
                v-if="ticketTotalPages > 1"
                class="flex items-center justify-center gap-2 pt-2"
              >
                <button
                  @click="changeTicketPage(ticketPage - 1)"
                  :disabled="ticketPage === 1"
                  class="text-xs px-2 py-1 rounded border border-gray-200 disabled:opacity-40 hover:border-blue-500 hover:text-blue-500"
                >
                  ‹
                </button>
                <span class="text-xs text-gray-500"
                  >{{ ticketPage }} / {{ ticketTotalPages }}</span
                >
                <button
                  @click="changeTicketPage(ticketPage + 1)"
                  :disabled="ticketPage === ticketTotalPages"
                  class="text-xs px-2 py-1 rounded border border-gray-200 disabled:opacity-40 hover:border-blue-500 hover:text-blue-500"
                >
                  ›
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <!-- ── Amend Modal ── -->
    <!-- ── Amend Modal ── -->
    <Modal :isOpen="amendModal" @closeModal="closeAmendModal">
      <DialogPanel
        class="w-full max-w-4xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
      >
        <!-- Header -->
        <div class="flex justify-between items-center bg-[#D85A30] px-4 py-2.5">
          <div>
            <p class="text-white font-medium text-sm">
              Amend: {{ amendData?.crm_id }}
            </p>
            <p class="text-white/70 text-[10px]">
              {{ amendData?.product_name }} — {{ amendData?.item_name }}
            </p>
          </div>
          <XCircleIcon
            class="w-5 h-5 text-white cursor-pointer"
            @click="closeAmendModal"
          />
        </div>

        <!-- Tab bar -->
        <div class="flex border-b border-gray-200 bg-gray-50 px-4">
          <button
            @click="amendTab = 'history'"
            class="px-4 py-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5"
            :class="
              amendTab === 'history'
                ? 'border-[#D85A30] text-[#D85A30]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            "
          >
            <ClockIcon class="w-3.5 h-3.5" />
            Amendment History
            <span
              v-if="amendData?.amend_info?.length"
              class="bg-[#D85A30] text-white text-[9px] font-bold rounded-full px-1.5 py-0.5 leading-none"
            >
              {{ amendData.amend_info.length }}
            </span>
          </button>
          <button
            @click="amendTab = 'create'"
            class="px-4 py-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5"
            :class="
              amendTab === 'create'
                ? 'border-[#D85A30] text-[#D85A30]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            "
          >
            <PencilSquareIcon class="w-3.5 h-3.5" />
            Create Amendment
          </button>
        </div>

        <div class="p-4 max-h-[70vh] overflow-y-auto">
          <!-- ── HISTORY TAB ── -->
          <div v-if="amendTab === 'history'">
            <!-- Empty state -->
            <div
              v-if="!amendData?.amend_info?.length"
              class="flex flex-col items-center justify-center py-12 text-gray-400"
            >
              <ClockIcon class="w-10 h-10 mb-2 opacity-40" />
              <p class="text-xs">No amendment history yet</p>
              <button
                @click="amendTab = 'create'"
                class="mt-3 text-xs bg-[#D85A30] text-white px-4 py-1.5 rounded-lg"
              >
                Create First Amendment
              </button>
            </div>

            <!-- History list -->
            <div v-else class="space-y-4">
              <div
                v-for="am in amendData.amend_info"
                :key="am.id"
                class="border border-gray-200 rounded-xl overflow-hidden"
              >
                <!-- Card header -->
                <div
                  class="flex justify-between items-center px-4 py-2.5 bg-gray-50 border-b border-gray-200"
                >
                  <div class="flex items-center gap-2 flex-wrap">
                    <span
                      class="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      :class="amendStatusLabel(am.amend_status).cls"
                    >
                      {{ amendStatusLabel(am.amend_status).text }}
                    </span>
                    <span
                      v-if="am.is_delete"
                      class="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-[10px] font-semibold"
                    >
                      🗑 Delete Request
                    </span>
                    <span
                      v-if="am.amend_request"
                      class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px]"
                      >Requested</span
                    >
                    <span
                      v-if="am.amend_approve"
                      class="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px]"
                      >Approved</span
                    >
                    <span
                      v-if="am.amend_mail_sent"
                      class="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-[10px]"
                      >Mail Sent</span
                    >
                  </div>
                  <span class="text-[10px] text-gray-400">
                    {{ formatTs(am.created_at) }}
                  </span>
                </div>

                <!-- Changes diff table -->
                <div
                  class="px-4 py-3"
                  v-if="!am.is_delete && am.amend_history?.length"
                >
                  <p
                    class="text-[10px] font-semibold text-gray-500 mb-2 uppercase tracking-wide"
                  >
                    Changes
                  </p>
                  <table class="w-full text-[10px]">
                    <thead>
                      <tr class="text-gray-400 border-b border-gray-100">
                        <th class="text-left py-1 w-1/3">Field</th>
                        <th class="text-center py-1 w-1/3">Before</th>
                        <th class="text-center py-1 w-1/3">After</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template
                        v-for="history in am.amend_history"
                        :key="history.timestamp"
                      >
                        <tr
                          v-for="key in diffKeys(history.changes)"
                          :key="key"
                          class="border-b border-gray-50 hover:bg-gray-50"
                        >
                          <td class="py-1.5 text-gray-600 font-medium">
                            {{ changeLabel(key) }}
                          </td>
                          <td
                            class="py-1.5 text-center text-gray-400 line-through"
                          >
                            {{ prevValue(history, key) }}
                          </td>
                          <td
                            class="py-1.5 text-center font-semibold"
                            :class="
                              key.includes('total')
                                ? 'text-green-600'
                                : 'text-[#D85A30]'
                            "
                          >
                            {{ history.changes[key] }}
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>

                  <!-- Activity log -->
                  <div class="mt-3 space-y-1" v-if="am.amend_history?.length">
                    <p
                      class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1"
                    >
                      Activity Log
                    </p>
                    <div
                      v-for="h in am.amend_history"
                      :key="h.timestamp"
                      class="flex items-center gap-2 text-[10px] text-gray-500"
                    >
                      <span
                        class="w-1.5 h-1.5 rounded-full bg-[#D85A30] flex-shrink-0"
                      ></span>
                      <span class="font-medium text-gray-700">{{
                        h.user_name
                      }}</span>
                      <span>requested changes</span>
                      <span class="ml-auto text-gray-400">{{
                        formatTs(h.timestamp)
                      }}</span>
                    </div>
                  </div>
                </div>

                <!-- Delete request info -->
                <div class="px-4 py-3" v-if="am.is_delete">
                  <p class="text-xs text-red-600 font-medium">
                    This item has been requested for deletion.
                  </p>
                  <p class="text-[10px] text-gray-500 mt-1">
                    Original amount:
                    <span class="font-semibold"
                      >{{ am.latest_changes?.total_amount }} ฿</span
                    >
                  </p>
                </div>
              </div>

              <!-- Create new button -->
              <div class="flex justify-end pt-2">
                <button
                  @click="amendTab = 'create'"
                  class="text-xs bg-[#D85A30] text-white px-4 py-2 rounded-lg flex items-center gap-1.5"
                >
                  <PencilSquareIcon class="w-3.5 h-3.5" />
                  Create New Amendment
                </button>
              </div>
            </div>
          </div>

          <!-- ── CREATE TAB ── -->
          <div v-if="amendTab === 'create'">
            <AmendCancel
              :amendData="amendData"
              :amendCloseAction="closeAmendModal"
            />
          </div>
        </div>
      </DialogPanel>
    </Modal>

    <!-- ── Item Picker Modal ── -->
    <!-- ── Item Picker Modal ── -->
    <Modal :isOpen="itemPickerModal" @closeModal="itemPickerModal = false">
      <DialogPanel
        class="w-full max-w-md transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
      >
        <!-- Header -->
        <div class="flex justify-between items-center bg-[#D85A30] px-4 py-2.5">
          <div>
            <p class="text-white font-medium text-sm">
              {{ selectedAmendItem?.booking_crm_id }}
            </p>
            <p class="text-white/70 text-[10px]">
              {{ selectedAmendItem?.product_name }} — select item to amend
            </p>
          </div>
          <XCircleIcon
            class="w-5 h-5 text-white cursor-pointer"
            @click="itemPickerModal = false"
          />
        </div>

        <div class="p-4 space-y-2 max-h-[65vh] overflow-y-auto">
          <div
            v-for="item in selectedAmendItem?.items"
            :key="item.id"
            @click="openAmendFromItem(selectedAmendItem, item)"
            class="border rounded-xl p-3 cursor-pointer transition-all"
            :class="
              item.amend_info?.length
                ? 'border-orange-300 bg-orange-50/40 hover:border-[#D85A30]'
                : 'border-gray-200 hover:border-[#D85A30]/60 hover:bg-orange-50/20'
            "
          >
            <div class="flex justify-between items-start gap-2">
              <!-- Left: item info -->

              <div class="flex-1 min-w-0">
                <p
                  class="text-xs font-semibold text-white px-1 py-1 rounded-lg inline-block truncate bg-[#FF613c]"
                >
                  {{ item.crm_id }}
                </p>
                <div class="flex items-center gap-2 flex-wrap">
                  <p class="text-xs font-semibold text-gray-800 truncate">
                    {{ item.variant_name }}
                  </p>
                  <!-- Amend count badge -->
                  <span
                    v-if="item.amend_info?.length"
                    class="flex items-center gap-1 bg-[#D85A30] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                  >
                    <ClockIcon class="w-2.5 h-2.5" />
                    {{ item.amend_info.length }} amend{{
                      item.amend_info.length > 1 ? "s" : ""
                    }}
                  </span>
                </div>

                <p class="text-[10px] text-gray-400 mt-0.5 truncate">
                  {{ item.product_name }}
                </p>

                <!-- Hotel dates -->
                <div
                  v-if="selectedAmendItem?.product_type === 'Hotel'"
                  class="flex items-center gap-2 mt-1.5 flex-wrap"
                >
                  <span class="text-[10px] text-gray-500">
                    {{ item.checkin_date }} → {{ item.checkout_date }}
                  </span>
                  <span
                    class="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full"
                  >
                    {{ item.days }} night{{ item.days > 1 ? "s" : "" }}
                  </span>
                  <span
                    class="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full"
                  >
                    x{{ item.quantity }} room{{ item.quantity > 1 ? "s" : "" }}
                  </span>
                </div>

                <!-- Attraction date + qty -->
                <div v-else class="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span class="text-[10px] text-gray-500">
                    {{ item.service_date }}
                  </span>
                  <span
                    class="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full"
                  >
                    Adult x{{ item.quantity }}
                  </span>
                  <span
                    v-if="item.child_quantity > 0"
                    class="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full"
                  >
                    Child x{{ item.child_quantity }}
                  </span>
                </div>

                <!-- Latest amend status pills -->
                <div
                  v-if="item.amend_info?.length"
                  class="flex flex-wrap gap-1 mt-2"
                >
                  <span
                    v-for="am in item.amend_info"
                    :key="am.id"
                    class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium"
                    :class="amendStatusLabel(am.amend_status).cls"
                  >
                    <span v-if="am.is_delete">🗑</span>
                    {{ amendStatusLabel(am.amend_status).text }}
                  </span>
                </div>
              </div>

              <!-- Right: status + price -->
              <div class="text-right flex-shrink-0 space-y-1">
                <span
                  class="text-[9px] font-medium px-2 py-0.5 rounded-full block"
                  :class="
                    item.reservation_status === 'confirmed'
                      ? 'bg-green-100 text-green-700'
                      : item.reservation_status === 'cancelled'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-yellow-100 text-yellow-700'
                  "
                >
                  {{ item.reservation_status }}
                </span>
                <span
                  class="text-[9px] font-medium px-2 py-0.5 rounded-full block"
                  :class="
                    item.expense_status === 'fully_paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  "
                >
                  E: {{ item.expense_status ?? "not paid" }}
                </span>
                <p class="text-xs font-semibold text-gray-700 pt-1">
                  {{
                    (selectedAmendItem?.product_type === "Hotel"
                      ? (item.variation?.room_price ?? 0) *
                        (item.days ?? 1) *
                        (item.quantity ?? 1)
                      : (item.variation?.price ?? 0) * (item.quantity ?? 1)
                    ).toLocaleString()
                  }}
                  ฿
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer hint -->
        <div class="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
          <p class="text-[10px] text-gray-400 text-center">
            Click an item to view amendment history or create a new amendment
          </p>
        </div>
      </DialogPanel>
    </Modal>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { BarChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
import { useRouter } from "vue-router";
import Layout from "./Layout.vue";
import { useHomeStore } from "../stores/home";
import { useGroupStore } from "../stores/group";
import { useAuthStore } from "../stores/auth";
import annotationPlugin from "chartjs-plugin-annotation";
import { ArrowPathIcon } from "@heroicons/vue/24/outline";

import Modal from "../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import {
  XCircleIcon,
  ClockIcon,
  PencilSquareIcon,
} from "@heroicons/vue/24/outline";
import { useHotelStore } from "../stores/hotel";
import AmendCancel from "./BookingComponent/AmendCancel.vue";

Chart.register(...registerables, annotationPlugin);

const homeStore = useHomeStore();
const hotelStore = useHotelStore();
const groupStore = useGroupStore();
const router = useRouter();
const authStore = useAuthStore();

// ── Amend modal state ──
const amendModal = ref(false);
const amendData = ref(null);
const amendTab = ref("create");
const selectedAmendItem = ref(null); // which item within the group

// Open item picker first, then amend modal
const openGroupAmendPicker = (group) => {
  console.log(group);

  selectedAmendItem.value = group; // store group to show item picker
  itemPickerModal.value = true;
};

const itemPickerModal = ref(false);

const openAmendFromItem = async (group, item) => {
  itemPickerModal.value = false;

  const isHotel = group.product_type === "Hotel";
  const isAttraction =
    group.product_type === "Attraction" ||
    group.product_type === "EntranceTicket";

  // fetch variation list for switching
  let variationList = [];
  try {
    if (isHotel) {
      const res = await hotelStore.getRoomList(group.product_id);
      variationList = res.data ?? [];
    } else if (isAttraction) {
      const res = await attractionStore.getVariationList(group.product_id);
      variationList = res.data ?? [];
    }
  } catch {
    /* non-critical */
  }

  const sellPrice = isHotel
    ? item.variation?.room_price ?? 0
    : item.variation?.price ?? 0;

  const costPrice = isHotel
    ? item.variation?.cost_price ?? 0
    : item.variation?.cost_price ?? 0;

  const totalSell = isHotel
    ? sellPrice * (item.days ?? 1) * (item.quantity ?? 1)
    : sellPrice * (item.quantity ?? 1);

  const totalCost = isHotel
    ? costPrice * (item.days ?? 1) * (item.quantity ?? 1)
    : costPrice * (item.quantity ?? 1);

  // child info for attraction
  const childInfo =
    isAttraction && item.variation?.child_info
      ? typeof item.variation.child_info === "string"
        ? JSON.parse(item.variation.child_info)
        : item.variation.child_info
      : [];

  amendData.value = {
    reservation_id: item.id,
    crm_id: group.booking_crm_id,
    product_id: group.product_id,
    product_name: item.product_name,
    product_image: item.product_image ?? "",
    item_name: item.variant_name,
    product_type: isHotel ? 6 : 4,
    service_date: isHotel ? item.checkin_date : item.service_date,
    checkout_date: item.checkout_date ?? null,
    checkin_date: item.checkin_date ?? null,
    quantity: item.quantity ?? 1,
    days: item.days ?? 1,
    selling_price: sellPrice,
    cost_price: costPrice,
    total_amount: totalSell,
    total_cost_price: totalCost,
    discount: item.discount ?? 0,
    car_id: item.variation?.id ?? null,
    car_list: variationList,
    amend_info: item.amend_info ?? [],
    // child pricing (attraction only)
    child_info: childInfo,
    child_price: item.child_price ?? childInfo[0]?.child_price ?? 0,
    child_cost: item.child_cost ?? childInfo[0]?.child_cost_price ?? 0,
    child_quantity: item.child_quantity ?? 0,
    child_total_selling_price: item.child_total_selling_price ?? 0,
    child_total_cost: item.child_total_cost ?? 0,
  };

  amendTab.value = amendData.value.amend_info.length > 0 ? "history" : "create";
  amendModal.value = true;
};

const closeAmendModal = () => {
  amendModal.value = false;
  amendData.value = null;
};

// ── State ──────────────────────────────────────────────────────────────────
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth() + 1);
const productType = ref("all");
const mode = ref("cost");
const expenseStatus = ref("not_paid"); // null | 'not_paid'
const customerPaymentStatus = ref("fully_paid"); // null | 'fully_paid' | 'not_paid'
const loadingGraph = ref(false);
const days = ref([]);
const summary = ref({ grand_total_amount: 0, grand_total_cost_price: 0 });
const selectedDay = ref(null);
const activeTab = ref("summary"); // 'summary' | 'hotel' | 'ticket'

// Hotel groups
const hotelGroups = ref([]);
const loadingHotelGroups = ref(false);
const hotelPage = ref(1);
const hotelTotalPages = ref(1);

// Ticket groups
const ticketGroups = ref([]);
const loadingTicketGroups = ref(false);
const ticketPage = ref(1);
const ticketTotalPages = ref(1);

// ── Options ────────────────────────────────────────────────────────────────
const curYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 4 }, (_, i) => curYear - i);
const monthLabels = [
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
const typeOptions = [
  { val: "all", label: "All" },
  { val: "hotel", label: "Hotel" },
  { val: "entrance_ticket", label: "Tickets" },
];
const modeOptions = [
  { val: "amount", label: "Amount" },
  { val: "cost", label: "Cost" },
  { val: "groups", label: "Groups" },
];

// ── Computed ───────────────────────────────────────────────────────────────
const formatNumber = (n) => Math.round(n ?? 0).toLocaleString();

const showHotel = computed(
  () => productType.value === "all" || productType.value === "hotel",
);
const showTicket = computed(
  () => productType.value === "all" || productType.value === "entrance_ticket",
);

const totalGroups = computed(() =>
  days.value.reduce((s, d) => s + (d.combined_total_groups ?? 0), 0),
);

// Tabs visible depend on product type
const visibleTabs = computed(() => {
  const tabs = [{ val: "summary", label: "Summary" }];
  if (showHotel.value) tabs.push({ val: "hotel", label: "Hotel" });
  if (showTicket.value) tabs.push({ val: "ticket", label: "Tickets" });
  return tabs;
});

// ── Chart ──────────────────────────────────────────────────────────────────
const chartData = computed(() => {
  const labels = days.value.map((d) => d.day_label);
  const pt = productType.value;
  const m = mode.value;
  const opacity = m === "cost" ? "0.45" : "0.78";
  const datasets = [];

  if (pt === "all" || pt === "hotel") {
    datasets.push({
      label: `Hotel ${m}`,
      data: days.value.map((d) =>
        m === "amount"
          ? d.hotel?.total_amount ?? 0
          : m === "cost"
          ? d.hotel?.total_cost_price ?? 0
          : d.hotel?.total_groups ?? 0,
      ),
      backgroundColor: `rgba(216,90,48,${opacity})`,
      borderColor: "#D85A30",
      borderWidth: 1,
      borderRadius: 3,
      stack: "stack",
    });
  }
  if (pt === "all" || pt === "entrance_ticket") {
    datasets.push({
      label: `Ticket ${m}`,
      data: days.value.map((d) =>
        m === "amount"
          ? d.entrance_ticket?.total_amount ?? 0
          : m === "cost"
          ? d.entrance_ticket?.total_cost_price ?? 0
          : d.entrance_ticket?.total_groups ?? 0,
      ),
      backgroundColor: `rgba(55,138,221,${opacity})`,
      borderColor: "#378ADD",
      borderWidth: 1,
      borderRadius: 3,
      stack: "stack",
    });
  }
  return { labels, datasets };
});

const threshold = ref(65000);

const formatTs = (ts) => {
  if (!ts) return "-";
  return new Date(ts).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const changeLabel = (key) => {
  const map = {
    service_date: "Service Date",
    checkout_date: "Checkout Date",
    quantity: "Quantity",
    child_quantity: "Child Qty",
    selling_price: "Selling Price",
    cost_price: "Cost Price",
    total_amount: "Total Amount",
    total_cost_price: "Total Cost",
    variation_id: "Variation ID",
    variation_name: "Variation",
    delete: "Delete Request",
  };
  return map[key] ?? key;
};

const diffKeys = (changes) =>
  Object.keys(changes).filter(
    (k) =>
      !k.startsWith("current_") && changes[k] !== "" && changes[k] !== null,
  );

const prevValue = (history, key) => {
  const prev = history.previous_values ?? {};
  return prev[`current_${key}`] ?? "-";
};

const chartOptions = computed(() => {
  const isMoney = mode.value !== "groups";
  return {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (evt, els) => {
      if (!els.length) return;
      const clickedDay = days.value[els[0].index];
      const clickedDataset = els[0].datasetIndex;
      if (!clickedDay) return;

      selectedDay.value = clickedDay;

      // Auto-switch tab based on which bar was clicked
      if (productType.value === "all") {
        // dataset 0 = hotel, dataset 1 = ticket
        activeTab.value = clickedDataset === 0 ? "hotel" : "ticket";
      } else if (productType.value === "hotel") {
        activeTab.value = "hotel";
      } else {
        activeTab.value = "ticket";
      }

      fetchDayGroups(clickedDay.date);
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 9 }, maxRotation: 55, autoSkip: false },
        stacked: true,
      },
      y: {
        beginAtZero: true,
        stacked: true,
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: {
          font: { size: 10 },
          callback: (v) =>
            isMoney ? (v >= 1000 ? (v / 1000).toFixed(0) + "k" : v) : v,
        },
      },
    },
    // plugins: {
    //   legend: { display: false },

    // },
    plugins: {
      legend: { display: false },
      annotation: {
        annotations:
          mode.value === "groups"
            ? {}
            : {
                thresholdLine: {
                  type: "line",
                  yMin: threshold.value,
                  yMax: threshold.value,
                  borderColor: "rgba(220, 38, 38, 0.8)",
                  borderWidth: 2,
                  borderDash: [6, 4],
                  label: {
                    display: true,
                    content: `${formatNumber(threshold.value)} THB`,
                    position: "end",
                    backgroundColor: "rgba(220,38,38,0.85)",
                    color: "#fff",
                    font: { size: 10 },
                    padding: { x: 6, y: 3 },
                    borderRadius: 4,
                  },
                },
              },
      },
      tooltip: {
        callbacks: {
          title: (ctx) => days.value[ctx[0].dataIndex]?.day_label ?? "",
          afterBody: (ctx) => {
            const d = days.value[ctx[0].dataIndex];
            if (!d) return [];
            return [
              `Combined amount: ${formatNumber(d.combined_total_amount)} THB`,
              `Combined cost:   ${formatNumber(
                d.combined_total_cost_price,
              )} THB`,
              `Total groups:    ${d.combined_total_groups}`,
            ];
          },
        },
      }, // keep existing
    },
  };
});

// ── API calls ──────────────────────────────────────────────────────────────
async function fetchData() {
  loadingGraph.value = true;
  selectedDay.value = null;
  activeTab.value = "summary";
  try {
    const res = await homeStore.getExpenseGraphList(
      selectedYear.value,
      selectedMonth.value,
      {
        product_type: productType.value,
        expense_status: expenseStatus.value ?? undefined,
        customer_payment_status: customerPaymentStatus.value ?? undefined,
      },
    );
    const result = res.data?.result ?? res.data ?? {};
    days.value = result.days ?? [];
    summary.value = result.summary ?? {};
  } catch (e) {
    console.error("Expense graph error:", e);
    days.value = [];
    summary.value = {};
  } finally {
    loadingGraph.value = false;
  }
}

async function fetchDayGroups(date) {
  // Build shared filter params matching your hotel/attraction pages
  const sharedParams = {
    booking_daterange: `${date},${date}`, // single date = exact day match
    expense_item_status: expenseStatus.value ?? undefined,
    payment_status: customerPaymentStatus.value ?? undefined,
    sorting_type: "service_date",
    sorting: "asc",
    per_page: 10,
  };

  // Fetch hotel groups
  if (showHotel.value) {
    loadingHotelGroups.value = true;
    hotelPage.value = 1;
    hotelGroups.value = [];
    try {
      const res = await groupStore.getListAction({
        ...sharedParams,
        product_type: "hotel",
      });
      hotelGroups.value = groupStore.groups?.data ?? [];
      hotelTotalPages.value = groupStore.groups?.meta?.total_page ?? 1;
    } catch (e) {
      console.error("Hotel groups error:", e);
    } finally {
      loadingHotelGroups.value = false;
    }
  }

  // Fetch ticket groups
  if (showTicket.value) {
    loadingTicketGroups.value = true;
    ticketPage.value = 1;
    ticketGroups.value = [];
    try {
      const res = await groupStore.getListAction({
        ...sharedParams,
        product_type: "attraction",
      });
      ticketGroups.value = groupStore.groups?.data ?? [];
      ticketTotalPages.value = groupStore.groups?.meta?.total_page ?? 1;
    } catch (e) {
      console.error("Ticket groups error:", e);
    } finally {
      loadingTicketGroups.value = false;
    }
  }
}

async function changeHotelPage(page) {
  if (page < 1 || page > hotelTotalPages.value || !selectedDay.value) return;
  loadingHotelGroups.value = true;
  hotelPage.value = page;
  try {
    await groupStore.getListAction({
      booking_daterange: `${selectedDay.value.date},${selectedDay.value.date}`,
      expense_item_status: expenseStatus.value ?? undefined,
      payment_status: customerPaymentStatus.value ?? undefined,
      sorting_type: "service_date",
      sorting: "asc",
      per_page: 10,
      page,
      product_type: "hotel",
    });
    hotelGroups.value = groupStore.groups?.data ?? [];
  } finally {
    loadingHotelGroups.value = false;
  }
}

async function changeTicketPage(page) {
  if (page < 1 || page > ticketTotalPages.value || !selectedDay.value) return;
  loadingTicketGroups.value = true;
  ticketPage.value = page;
  try {
    await groupStore.getListAction({
      booking_daterange: `${selectedDay.value.date},${selectedDay.value.date}`,
      expense_item_status: expenseStatus.value ?? undefined,
      payment_status: customerPaymentStatus.value ?? undefined,
      sorting_type: "service_date",
      sorting: "asc",
      per_page: 10,
      page,
      product_type: "attraction",
    });
    ticketGroups.value = groupStore.groups?.data ?? [];
  } finally {
    loadingTicketGroups.value = false;
  }
}

const refresh = () => {
  fetchData();
};

function goToGroup(group, type) {
  // const name = type === "hotel" ? "group-hotel" : "group-attraction";
  // const route = router.resolve({ name, query: { id } });
  // window.open(route.href, "_blank");

  console.log(group, type, "this is data");
  window.open(
    `/group-hotel-expense?type=${type}&crmid=${group.booking_crm_id}`,
    "_blank",
  );
}

const openAmendModal = (group) => {
  amendData.value = {
    reservation_id: group.booking_item_id, // adjust key to match your group object
    crm_id: group.booking_crm_id,
    product_name: group.product_name,
    item_name: group.item_name ?? "",
    product_type: group.product_type,
    service_date: group.firstest_service_date,
    checkout_date: group.checkout_date ?? null,
    quantity: group.quantity ?? 1,
    selling_price: group.selling_price ?? 0,
    cost_price: group.cost_price ?? 0,
    total_amount: group.total_amount ?? 0,
    total_cost_price: group.total_cost_price ?? 0,
    discount: group.discount ?? 0,
    days: group.days ?? 1,
    car_list: group.car_list ?? [],
    car_id: group.car_id ?? null,
    amend_info: group.amend_info ?? [],
    child_price: group.child_price ?? 0,
    child_cost: group.child_cost ?? 0,
    child_quantity: group.child_quantity ?? 0,
    child_total_selling_price: group.child_total_selling_price ?? 0,
    child_total_cost: group.child_total_cost ?? 0,
  };
  amendTab.value = amendData.value.amend_info.length > 0 ? "history" : "create";
  amendModal.value = true;
};

// Helper used inside the modal
const amendStatusLabel = (status) => {
  const map = {
    pending: { text: "Pending", cls: "bg-yellow-100 text-yellow-700" },
    approved: { text: "Approved", cls: "bg-green-100 text-green-700" },
    rejected: { text: "Rejected", cls: "bg-red-100 text-red-700" },
  };
  return map[status] ?? { text: status, cls: "bg-gray-100 text-gray-600" };
};

onMounted(fetchData);
</script>
