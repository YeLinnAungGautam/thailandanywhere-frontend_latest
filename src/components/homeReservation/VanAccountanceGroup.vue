<template>
  <div class="ledger-wrapper min-h-screen bg-gray-50">
    <!-- ── Filter Bar ────────────────────────────────────────────────────── -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-5">
      <div class="">
        <!-- Supplier -->
        <div class="flex flex-col gap-1 min-w-[180px] flex-1">
          <!-- <label class="text-xs font-medium text-gray-500">Supplier</label>
          <select
            v-model="selectedSupplierId"
            class="px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF613c] transition-colors bg-white"
          >
            <option value="">— Select supplier —</option>
            <option
              v-for="supplier in supplierLists"
              :key="supplier.id"
              :value="supplier.id"
            >
              {{ supplier.name }}
            </option>
          </select> -->
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useToast } from "vue-toastification";
import { useCarBookingStore } from "../../stores/carbooking";

const toast = useToast();
const carbookingStore = useCarBookingStore();

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
