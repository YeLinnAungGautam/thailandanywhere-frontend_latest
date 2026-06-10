<template>
  <div class="ledger-wrapper min-h-screen bg-gray-50">
    <!-- ── Filter Bar ────────────────────────────────────────────────────── -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-5">
      <div class="">
        <!-- Supplier -->
        <div class="flex flex-col gap-1 min-w-[180px] flex-1">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                v-for="supplier in supplierLists"
                :key="supplier.id"
                @click="selectedSupplierId = supplier.id"
                class="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150"
                :class="
                  selectedSupplierId === supplier.id
                    ? 'bg-[#FF613c] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                "
              >
                {{ supplier.name }}
              </button>
            </div>
            <div class="flex justify-end items-center gap-x-2">
              <!-- Date From -->
              <div class="flex flex-col gap-1 min-w-[140px]">
                <input
                  type="date"
                  v-model="dateFrom"
                  class="px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF613c] transition-colors"
                />
              </div>

              <!-- Date To -->
              <div class="flex flex-col gap-1 min-w-[140px]">
                <input
                  type="date"
                  v-model="dateTo"
                  class="px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF613c] transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-start items-center gap-x-2 pt-2">
          <!-- Quick range pills -->
          <div class="flex items-center gap-1.5 pb-0.5">
            <button
              v-for="q in quickRanges"
              :key="q.label"
              @click="applyQuick(q)"
              class="px-3 py-2 text-xs rounded-lg border transition-all font-medium whitespace-nowrap"
              :class="
                activeQuick === q.label
                  ? 'bg-[#FF613c] text-white border-[#FF613c]'
                  : 'border-gray-200 text-gray-600 hover:border-[#FF613c] hover:text-[#FF613c]'
              "
            >
              {{ q.label }}
            </button>
          </div>

          <!-- Search + Reset -->
          <div class="flex items-center gap-2 pb-0.5 ml-auto">
            <button
              @click="resetFilters"
              class="px-3 py-2 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1 transition-colors"
            >
              <svg
                class="w-3.5 h-3.5"
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
            <!-- LINE Send button — only show when results loaded -->
            <button
              v-if="ledger.length > 0"
              @click="openLineModal"
              class="px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 text-white"
              style="background: #06c755"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"
                />
              </svg>
              Send LINE
            </button>
            <button
              @click="search"
              :disabled="!canSearch || loading"
              class="px-5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2"
              :class="
                canSearch && !loading
                  ? 'bg-[#FF613c] text-white hover:bg-[#e55139] shadow-sm'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              "
            >
              <svg
                v-if="loading"
                class="w-3.5 h-3.5 animate-spin"
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
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              <svg
                v-else
                class="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z"
                />
              </svg>
              {{ loading ? "Loading…" : "Search" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div
        v-if="error"
        class="mt-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600"
      >
        {{ error }}
      </div>
    </div>

    <!-- ── Loading skeleton ─────────────────────────────────────────────── -->
    <div v-if="loading" class="space-y-3">
      <div
        v-for="i in 4"
        :key="i"
        class="h-16 bg-white rounded-xl border border-gray-200 animate-pulse"
      />
    </div>

    <!-- ── Empty ─────────────────────────────────────────────────────────── -->
    <div
      v-else-if="!loading && hasSearched && ledger.length === 0"
      class="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200"
    >
      <div
        class="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3"
      >
        <svg
          class="w-7 h-7 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0120 9.414V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <p class="text-sm font-medium text-gray-500">No ledger records found</p>
      <p class="text-xs text-gray-400 mt-1">
        Try a different date range or supplier
      </p>
    </div>

    <!-- ── Ledger table ──────────────────────────────────────────────────── -->
    <template v-else-if="ledger.length > 0">
      <!-- Grand Total summary cards -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
        <div
          v-for="card in summaryCards"
          :key="card.label"
          class="bg-white rounded-xl border border-gray-200 p-3 flex flex-col gap-1 shadow-sm"
        >
          <span
            class="text-[10px] font-medium text-gray-400 uppercase tracking-wide"
            >{{ card.label }}</span
          >
          <span
            class="text-base font-bold"
            :class="card.color ?? 'text-gray-800'"
          >
            {{ card.value }}
          </span>
        </div>
      </div>

      <!-- Day rows -->
      <div
        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap"
                >
                  Ledger Date
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-semibold text-gray-600 whitespace-nowrap"
                >
                  Total Trips
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-semibold text-gray-600 whitespace-nowrap"
                >
                  Sale Amount
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-semibold text-gray-600 whitespace-nowrap"
                >
                  Cost Amount
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-semibold text-gray-600 whitespace-nowrap"
                >
                  Profit / Loss
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-semibold text-gray-600 whitespace-nowrap"
                >
                  Balance
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-semibold text-gray-600 whitespace-nowrap"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <template v-for="day in ledger" :key="day.date">
                <!-- Day summary row -->
                <tr
                  class="hover:bg-gray-50 transition-colors cursor-pointer"
                  :class="day.is_paid ? 'bg-green-50' : ''"
                  @click="toggleDay(day.date)"
                >
                  <!-- Date -->
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                      <!-- Expand chevron -->
                      <svg
                        class="w-3.5 h-3.5 text-gray-400 transition-transform duration-200 flex-shrink-0"
                        :class="expandedDates.has(day.date) ? 'rotate-90' : ''"
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
                      <div>
                        <p class="text-xs font-semibold text-gray-800">
                          {{ formatDate(day.date) }}
                        </p>
                        <p class="text-[10px] text-gray-400">
                          {{ dayOfWeek(day.date) }}
                        </p>
                      </div>
                      <!-- Paid badge -->
                      <span
                        v-if="day.is_paid"
                        class="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-semibold rounded-full"
                      >
                        Paid
                      </span>
                    </div>
                  </td>
                  <!-- Total trips -->
                  <td class="px-4 py-3 text-right">
                    <span
                      class="inline-flex items-center justify-center px-2.5 py-0.5 bg-[#FF613c]/10 text-[#FF613c] text-xs font-bold rounded-full"
                    >
                      {{ day.total_trips }}
                    </span>
                  </td>
                  <!-- Sale -->
                  <td class="px-4 py-3 text-right">
                    <span class="text-xs font-medium text-gray-700">{{
                      fmt(day.total_sale_amount)
                    }}</span>
                  </td>
                  <!-- Cost -->
                  <td class="px-4 py-3 text-right">
                    <span class="text-xs font-medium text-gray-700">{{
                      fmt(day.total_cost_amount)
                    }}</span>
                  </td>
                  <!-- P/L -->
                  <td class="px-4 py-3 text-right">
                    <span
                      class="text-xs font-semibold"
                      :class="
                        day.total_profit_loss >= 0
                          ? 'text-green-600'
                          : 'text-red-500'
                      "
                    >
                      {{ fmtSigned(day.total_profit_loss) }}
                    </span>
                  </td>
                  <!-- Balance -->
                  <td class="px-4 py-3 text-right">
                    <span
                      class="text-sm font-bold"
                      :class="
                        day.total_balance >= 0
                          ? 'text-green-600'
                          : 'text-red-500'
                      "
                    >
                      {{ fmtSigned(day.total_balance) }}
                    </span>
                  </td>
                  <!-- Actions -->
                  <td class="px-4 py-3 text-right" @click.stop>
                    <div class="flex items-center justify-end gap-2">
                      <!-- Detail -->
                      <button
                        @click="toggleDay(day.date)"
                        class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all border-gray-200 text-gray-600 hover:border-[#FF613c] hover:text-[#FF613c]"
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
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        Detail
                      </button>
                      <!-- Pay -->
                      <button
                        v-if="!day.is_paid"
                        @click="confirmPay(day)"
                        class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all bg-[#FF613c] hover:bg-[#e55139] text-white shadow-sm"
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
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                          />
                        </svg>
                        Pay
                      </button>
                      <span
                        v-else
                        class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-green-100 text-green-700"
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Paid
                      </span>
                    </div>
                  </td>
                </tr>

                <!-- ── Expanded detail rows ─────────────────────────────── -->
                <template v-if="expandedDates.has(day.date)">
                  <!-- Sub-header -->
                  <tr class="bg-orange-50/50">
                    <th
                      class="pl-12 pr-4 py-2 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap"
                    >
                      CRM / Customer
                    </th>
                    <th
                      class="px-4 py-2 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap"
                    >
                      Product
                    </th>
                    <th
                      class="px-4 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap"
                    >
                      Qty
                    </th>
                    <th
                      class="px-4 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap"
                    >
                      Sale
                    </th>
                    <th
                      class="px-4 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap"
                    >
                      Cost
                    </th>
                    <th
                      class="px-4 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap"
                    >
                      Collect
                    </th>
                    <th
                      class="px-4 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap"
                    >
                      Balance
                    </th>
                  </tr>
                  <!-- Detail item rows -->
                  <tr
                    v-for="item in day.items"
                    :key="item.id"
                    class="bg-orange-50/20 hover:bg-orange-50/50 transition-colors border-b border-orange-100/50"
                  >
                    <!-- CRM / Customer -->
                    <td class="pl-12 pr-4 py-2.5">
                      <div class="flex items-center gap-2">
                        <span
                          class="px-2 py-0.5 bg-[#FF613c] text-white text-[10px] font-bold rounded-full whitespace-nowrap"
                        >
                          {{ item.crm_id }}
                        </span>
                        <span
                          class="text-xs text-gray-600 truncate max-w-[120px]"
                          :title="item.customer_name"
                        >
                          {{ item.customer_name || "—" }}
                        </span>
                      </div>
                      <div class="flex items-center gap-1.5 mt-0.5 pl-0.5">
                        <span class="text-[10px] text-gray-400">{{
                          item.pickup_time || ""
                        }}</span>
                        <span
                          v-if="item.pickup_location"
                          class="text-[10px] text-gray-400 truncate max-w-[140px]"
                        >
                          · {{ item.pickup_location }}
                        </span>
                      </div>
                    </td>
                    <!-- Product -->
                    <td class="px-4 py-2.5">
                      <p
                        class="text-xs text-gray-700 truncate max-w-[160px]"
                        :title="item.product_name"
                      >
                        {{ item.product_name || "—" }}
                      </p>
                    </td>
                    <!-- Qty -->
                    <td class="px-4 py-2.5 text-right">
                      <span class="text-xs text-gray-600">{{
                        item.qty ?? "—"
                      }}</span>
                    </td>
                    <!-- Sale -->
                    <td class="px-4 py-2.5 text-right">
                      <span class="text-xs text-gray-600">{{
                        fmt(item.sale_amount)
                      }}</span>
                    </td>
                    <!-- Cost -->
                    <td class="px-4 py-2.5 text-right">
                      <span class="text-xs text-gray-600">{{
                        fmt(item.cost_amount)
                      }}</span>
                    </td>
                    <!-- Collect -->
                    <td class="px-4 py-2.5 text-right">
                      <div class="flex flex-col items-end gap-0.5">
                        <span
                          class="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                          :class="
                            item.is_driver_collect == 1
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          "
                        >
                          {{
                            item.is_driver_collect == 1
                              ? "Collect"
                              : "No collect"
                          }}
                        </span>
                        <span
                          v-if="item.car_total_collect"
                          class="text-xs font-medium text-gray-700"
                        >
                          {{ fmt(item.car_total_collect) }}
                        </span>
                      </div>
                    </td>
                    <!-- Balance -->
                    <td class="px-4 py-2.5 text-right">
                      <span
                        class="text-xs font-semibold"
                        :class="
                          item.balance >= 0 ? 'text-green-600' : 'text-red-500'
                        "
                      >
                        {{ fmtSigned(item.balance) }}
                      </span>
                    </td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- ── Pay Confirm Modal ─────────────────────────────────────────────── -->
    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="payModal.open"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          @click.self="payModal.open = false"
        >
          <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <div class="flex items-center gap-3 mb-4">
              <div
                class="w-10 h-10 bg-[#FF613c]/10 rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <svg
                  class="w-5 h-5 text-[#FF613c]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-bold text-gray-800">Confirm Payment</h3>
                <p class="text-xs text-gray-400">{{ supplier?.name }}</p>
              </div>
            </div>

            <div class="bg-gray-50 rounded-xl p-3 mb-5 space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-xs text-gray-500">Date</span>
                <span class="text-xs font-semibold text-gray-800">{{
                  formatDate(payModal.day?.date)
                }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs text-gray-500">Total trips</span>
                <span class="text-xs font-semibold text-gray-800">{{
                  payModal.day?.total_trips
                }}</span>
              </div>
              <div
                class="flex justify-between items-center border-t border-gray-200 pt-2"
              >
                <span class="text-xs font-medium text-gray-600"
                  >Balance to pay</span
                >
                <span
                  class="text-base font-bold"
                  :class="
                    (payModal.day?.total_balance ?? 0) >= 0
                      ? 'text-green-600'
                      : 'text-red-500'
                  "
                >
                  {{ fmtSigned(payModal.day?.total_balance ?? 0) }}
                </span>
              </div>
            </div>

            <div class="flex gap-2">
              <button
                @click="payModal.open = false"
                class="flex-1 px-4 py-2.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                @click="executePay"
                :disabled="payModal.loading"
                class="flex-1 px-4 py-2.5 text-xs font-semibold text-white bg-[#FF613c] hover:bg-[#e55139] rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <svg
                  v-if="payModal.loading"
                  class="w-3.5 h-3.5 animate-spin"
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
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
    <transition name="fade">
      <div
        v-if="lineModal.open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        @click.self="lineModal.open = false"
      >
        <div
          class="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
        >
          <!-- Header -->
          <div class="flex items-center gap-3 p-4" style="background: #06c755">
            <div
              class="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center flex-shrink-0"
            >
              <svg
                class="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-bold text-white">LINE Summary Preview</h3>
              <p class="text-[11px] text-white/75">
                {{ supplier?.name }} · {{ dateFrom }} – {{ dateTo }}
              </p>
            </div>
          </div>
          <!-- Preview -->
          <div
            class="mx-4 my-3 bg-[#EFEFE9] rounded-xl p-3 font-mono text-[11px] leading-relaxed text-gray-700 whitespace-pre-wrap max-h-64 overflow-y-auto border border-gray-200"
          >
            {{ lineMessage }}
          </div>
          <!-- Footer -->
          <div class="flex gap-2 p-4 border-t border-gray-100">
            <button
              @click="lineModal.open = false"
              class="flex-1 px-4 py-2.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="executeSendLine"
              :disabled="lineModal.sending"
              class="flex-1 px-4 py-2.5 text-xs font-semibold text-white rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              style="background: #06c755"
            >
              <svg
                v-if="lineModal.sending"
                class="w-3.5 h-3.5 animate-spin"
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
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              {{ lineModal.sending ? "Sending…" : "Confirm Send" }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useToast } from "vue-toastification";
import { useCarBookingStore } from "../../stores/carbooking";
import { useMessageStore } from "../../stores/message";

const toast = useToast();
const carbookingStore = useCarBookingStore();
const messageStore = useMessageStore();

const { ledger, grandTotal, supplier, loading, error, supplierLists } =
  storeToRefs(carbookingStore);

// ── Filter state ───────────────────────────────────────────────────────────
const dateFrom = ref("");
const dateTo = ref("");
const selectedSupplierId = ref("");
const activeQuick = ref("");
const hasSearched = ref(false);

// ── Expanded rows ──────────────────────────────────────────────────────────
const expandedDates = ref(new Set());

// ── Pay modal ──────────────────────────────────────────────────────────────
const payModal = ref({ open: false, day: null, loading: false });

// ── Quick date ranges ──────────────────────────────────────────────────────
const quickRanges = [
  { label: "This week", fn: () => thisWeek() },
  { label: "This month", fn: () => thisMonth() },
  { label: "Last month", fn: () => lastMonth() },
];

const toYMD = (d) => {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

const thisWeek = () => {
  const now = new Date();
  const day = now.getDay() || 7;
  const mon = new Date(now);
  mon.setDate(now.getDate() - day + 1);
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  dateFrom.value = toYMD(mon);
  dateTo.value = toYMD(sun);
};
const thisMonth = () => {
  const now = new Date();
  dateFrom.value = toYMD(new Date(now.getFullYear(), now.getMonth(), 1));
  dateTo.value = toYMD(new Date(now.getFullYear(), now.getMonth() + 1, 0));
};
const lastMonth = () => {
  const now = new Date();
  dateFrom.value = toYMD(new Date(now.getFullYear(), now.getMonth() - 1, 1));
  dateTo.value = toYMD(new Date(now.getFullYear(), now.getMonth(), 0));
};

const applyQuick = (q) => {
  activeQuick.value = q.label;
  q.fn();
};

// ── Helpers ────────────────────────────────────────────────────────────────
const fmt = (n) => {
  if (n == null) return "—";
  return Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};
const fmtSigned = (n) => {
  if (n == null) return "—";
  const abs = Math.abs(Number(n));
  const formatted = abs.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return n >= 0 ? `+${formatted}` : `-${formatted}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
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
  return `${String(d.getDate()).padStart(2, "0")} ${
    months[d.getMonth()]
  } ${d.getFullYear()}`;
};
const dayOfWeek = (dateStr) => {
  if (!dateStr) return "";
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[new Date(dateStr).getDay()];
};

// ── Computed ───────────────────────────────────────────────────────────────
const canSearch = computed(
  () => dateFrom.value && dateTo.value && selectedSupplierId.value,
);

const summaryCards = computed(() => {
  if (!grandTotal.value) return [];
  const g = grandTotal.value;
  return [
    { label: "Total Days", value: ledger.value.length, color: "text-gray-800" },
    { label: "Total Trips", value: g.total_trips, color: "text-[#FF613c]" },
    {
      label: "Sale Amount",
      value: fmt(g.total_sale_amount),
      color: "text-gray-800",
    },
    {
      label: "Cost Amount",
      value: fmt(g.total_cost_amount),
      color: "text-gray-800",
    },
    {
      label: "Profit / Loss",
      value: fmtSigned(g.total_profit_loss),
      color: g.total_profit_loss >= 0 ? "text-green-600" : "text-red-500",
    },
    {
      label: "Balance",
      value: fmtSigned(g.total_balance),
      color: g.total_balance >= 0 ? "text-green-600" : "text-red-500",
    },
  ];
});

// ── Actions ────────────────────────────────────────────────────────────────
const search = async () => {
  if (!canSearch.value) return;
  expandedDates.value = new Set();
  hasSearched.value = true;
  await carbookingStore.fetchLedger({
    date_from: dateFrom.value,
    date_to: dateTo.value,
    supplier_id: selectedSupplierId.value,
  });
};

const resetFilters = () => {
  dateFrom.value = "";
  dateTo.value = "";
  selectedSupplierId.value = "";
  activeQuick.value = "";
  hasSearched.value = false;
  expandedDates.value = new Set();
  carbookingStore.ledger = [];
  carbookingStore.grandTotal = null;
  carbookingStore.supplier = null;
};

const toggleDay = (date) => {
  const s = new Set(expandedDates.value);
  s.has(date) ? s.delete(date) : s.add(date);
  expandedDates.value = s;
};

const confirmPay = (day) => {
  payModal.value = { open: true, day, loading: false };
};

const executePay = async () => {
  payModal.value.loading = true;

  setTimeout(() => {
    payModal.value.loading = false;
  }, 3000);
};

const lineModal = ref({ open: false, sending: false });

const openLineModal = () => {
  lineModal.value = { open: true, sending: false };
};

const executeSendLine = async () => {
  lineModal.value.sending = true;
  try {
    await messageStore.sendLineMessage(lineMessage.value);
    toast.success("LINE message sent successfully!");
    lineModal.value.open = false;
  } catch (e) {
    toast.error("Failed to send LINE message");
  } finally {
    lineModal.value.sending = false;
  }
};

const lineMessage = computed(() => {
  if (!ledger.value.length || !supplier.value || !grandTotal.value) return "";
  const g = grandTotal.value;
  const lines = [];

  // Header
  lines.push(`📊 Supplier Ledger Summary`);
  lines.push(`👨‍💼 Supplier: ${supplier.value.name}`);
  lines.push(`📅 ${dateFrom.value} ~ ${dateTo.value}`);
  lines.push(`━━━━━━━━━━━━━━━━━━━━━━`);

  // Day-by-day breakdown
  for (const day of ledger.value) {
    lines.push(``);
    lines.push(`📆 S. Date: ${day.date}`);
    lines.push(`👨‍💼 Supplier Name: ${supplier.value.name}`);
    lines.push(`🚙 Total Trip: ${day.total_trips}`);
    lines.push(``);

    day.items?.forEach((item, index) => {
      const num = `${index + 1}️⃣`;
      const isCollect = item.is_driver_collect == 1;
      const balance = Number(item.balance ?? 0);
      const balanceSign =
        balance >= 0
          ? `+${balance.toLocaleString()}`
          : balance.toLocaleString();

      lines.push(`${num} CRMID: ${item.crm_id}`);
      lines.push(`➖ Customer: ${item.customer_name ?? "—"}`);
      lines.push(`➖ Trip Name: ${item.product_name ?? "—"}`);
      if (item.pickup_time) lines.push(`➖ Pickup Time: ${item.pickup_time}`);
      if (item.pickup_location)
        lines.push(`➖ Pickup: ${item.pickup_location}`);
      lines.push(`➖ Qty: ${item.qty ?? 1}`);
      lines.push(`➖ P. Method: ${isCollect ? "Collect" : "Not Collect"}`);
      lines.push(`➖ Amount: ${Number(item.sale_amount).toLocaleString()} THB`);
      lines.push(`⭕ (${balanceSign})`);
      lines.push(``);
    });

    lines.push(`📊 Day Total`);
    lines.push(`   💰 Sale   : ${day.total_sale_amount.toLocaleString()} THB`);
    lines.push(`   💸 Cost   : ${day.total_cost_amount.toLocaleString()} THB`);
    lines.push(
      `   📈 P/L    : ${
        day.total_profit_loss >= 0 ? "+" : ""
      }${day.total_profit_loss.toLocaleString()} THB`,
    );
    lines.push(
      `   💳 Balance: ${
        day.total_balance >= 0 ? "+" : ""
      }${day.total_balance.toLocaleString()} THB`,
    );
    lines.push(`~~~~~~~~~~~~~~~~~~~~~~~~`);
  }

  // Grand total
  lines.push(``);
  lines.push(`━━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`📋 GRAND TOTAL`);
  lines.push(`🚙 Total Trips  : ${g.total_trips}`);
  lines.push(
    `💰 Sale Amount  : ${Number(g.total_sale_amount).toLocaleString()} THB`,
  );
  lines.push(
    `💸 Cost Amount  : ${Number(g.total_cost_amount).toLocaleString()} THB`,
  );
  lines.push(
    `📈 Profit / Loss: ${g.total_profit_loss >= 0 ? "+" : ""}${Number(
      g.total_profit_loss,
    ).toLocaleString()} THB`,
  );
  lines.push(
    `💳 Balance      : ${g.total_balance >= 0 ? "+" : ""}${Number(
      g.total_balance,
    ).toLocaleString()} THB`,
  );
  lines.push(``);
  lines.push(`⚠️ Please note: Balance as of ${dateTo.value}`);

  return lines.join("\n");
});

// ── Init ───────────────────────────────────────────────────────────────────
onMounted(() => carbookingStore.fetchSupplierLists());
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
