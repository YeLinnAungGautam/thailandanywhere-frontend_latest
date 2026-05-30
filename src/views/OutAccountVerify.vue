<template>
  <div class="relative w-[92vw]">
    <div class="relative pt-4">
      <!-- ── Filters and Search ── -->
      <div class="pb-4 px-4 space-y-3 sticky -top-5 bg-gray-50 pt-4 z-40">
        <!-- View toggle -->
        <div class="flex justify-start items-center space-x-2">
          <p
            @click="table_type = false"
            class="px-3 rounded-lg py-2 text-xs cursor-pointer font-semibold transition-colors"
            :class="
              !table_type
                ? 'bg-[#FF613c] text-white'
                : 'border border-gray-200 text-gray-600 hover:border-[#FF613c] hover:text-[#FF613c]'
            "
          >
            Cash View Table
          </p>
          <div
            class="flex justify-center cursor-pointer items-center gap-x-2 bg-blue-600 rounded-lg text-xs text-white px-3 py-2 font-semibold hover:bg-blue-700 transition-colors"
            @click="goTaxMissingTable"
          >
            <p>Tax Report Table</p>
          </div>
        </div>

        <!-- Date and Type Filters -->
        <div
          class="flex justify-start space-x-2 items-center flex-wrap gap-y-2"
        >
          <p
            v-if="!authStore.isExternalAudit"
            @click="filterType = 'all'"
            class="px-5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            :class="
              filterType == 'all'
                ? 'bg-[#FF613c] text-white'
                : 'border border-gray-200 text-gray-600 hover:border-[#FF613c] hover:text-[#FF613c]'
            "
          >
            All
          </p>
          <select
            v-model="invoice"
            class="px-3 text-black text-xs py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FF613c] bg-white cursor-pointer transition-colors"
          >
            <option value="">Filter by Tax</option>
            <option value="tax_receipt_have">Have Tax Receipt</option>
            <option value="tax_receipt_missing">Non Tax Receipt</option>
          </select>
          <select
            v-model="invoiceTax"
            class="px-3 text-black text-xs py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FF613c] bg-white cursor-pointer transition-colors"
          >
            <option value="">Filter by Invoice</option>
            <option value="invoice_have">Have Invoice</option>
            <option value="invoice_missing">Non Invoice</option>
          </select>
          <YearPickerVue @year-change="handleYearChange" />
          <select
            v-model="selectedMonth"
            @change="handleMonthChange(selectedMonth)"
            class="px-3 text-black text-xs py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FF613c] bg-white cursor-pointer transition-colors"
          >
            <option :value="m.id" v-for="m in monthArray" :key="m.id">
              {{ m.name }}
            </option>
          </select>
          <TaxReceiptModal v-model="showTaxModal" @close="closeTaxModal" />
        </div>

        <!-- Search row -->
        <div class="flex space-x-2 items-center flex-wrap gap-y-2">
          <!-- Search: sender -->
          <div class="relative">
            <MagnifyingGlassIcon
              class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
            />
            <input
              v-model="senderSearch"
              type="text"
              placeholder="Search by sender…"
              class="pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF613c] transition-colors w-44"
            />
          </div>
          <!-- Search: crm -->
          <div class="relative">
            <MagnifyingGlassIcon
              class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
            />
            <input
              v-model="crmSearch"
              type="text"
              placeholder="Search by CRM…"
              class="pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF613c] transition-colors w-44"
            />
          </div>
          <!-- Search: amount -->
          <div class="relative">
            <MagnifyingGlassIcon
              class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
            />
            <input
              v-model="amountSearch"
              type="number"
              placeholder="Search by amount…"
              class="pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF613c] transition-colors w-44"
            />
          </div>
          <!-- Per page -->
          <select
            v-model="per_page"
            class="px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF613c] bg-white"
          >
            <option
              v-for="n in [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]"
              :key="n"
              :value="n"
            >
              {{ n }}
            </option>
          </select>
          <!-- Sort by -->
          <select
            v-model="sort_by"
            class="px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF613c] bg-white"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="sender">Sender</option>
            <option value="receiver">Receiver</option>
          </select>
          <!-- Sort order -->
          <select
            v-model="sort_order"
            class="px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF613c] bg-white"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <button
            @click="clearSearch"
            class="px-3 py-2 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
          >
            Clear
          </button>
        </div>
      </div>

      <!-- ── Table body ── -->
      <div class="px-4 py-4">
        <!-- Loading skeleton (income-style) -->
        <template v-if="loading">
          <div
            class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-scroll"
          >
            <div class="divide-y divide-gray-100">
              <div
                v-for="i in 8"
                :key="i"
                class="flex gap-4 px-5 py-3.5 items-center"
              >
                <div
                  class="h-3 bg-gray-100 rounded-full w-24 animate-pulse"
                ></div>
                <div
                  class="h-3 bg-gray-100 rounded-full w-32 animate-pulse"
                ></div>
                <div
                  class="h-3 bg-gray-100 rounded-full w-20 animate-pulse"
                ></div>
                <div
                  class="h-3 bg-gray-100 rounded-full w-20 animate-pulse ml-auto"
                ></div>
                <div
                  class="h-3 bg-gray-100 rounded-full w-16 animate-pulse"
                ></div>
                <div
                  class="h-7 bg-gray-100 rounded-lg w-20 animate-pulse"
                ></div>
              </div>
            </div>
          </div>
        </template>

        <!-- Empty state -->
        <div
          v-else-if="!cashImages?.data || cashImages.data.length === 0"
          class="bg-white rounded-xl border border-gray-200 shadow-sm text-center py-16"
        >
          <div class="text-gray-300 text-5xl mb-3">📄</div>
          <p class="text-gray-400 text-sm">No records found.</p>
        </div>

        <!-- ── CASH VIEW TABLE (income-style card) ── -->
        <div
          v-if="
            cashImages?.data &&
            !table_type &&
            cashImages.data.length > 0 &&
            !loading
          "
          class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-scroll"
        >
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th
                  class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                >
                  TR. Date
                </th>
                <th
                  class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                >
                  Company
                </th>
                <!-- <th
                  class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                >
                  S. Total Value
                </th>
                <th
                  class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                >
                  S. VAT
                </th>
                <th
                  class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                >
                  I. Total Value
                </th>
                <th
                  class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                >
                  I. VAT
                </th>
                <th
                  class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                >
                  C. Total Value
                </th>
                <th
                  class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                >
                  C. VAT
                </th> -->
                <th
                  class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide"
                >
                  Type
                </th>
                <th
                  class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                >
                  Cash Amount
                </th>
                <th
                  class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                >
                  CRM
                </th>
                <th
                  class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide"
                >
                  Invoice
                </th>
                <th
                  class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide"
                >
                  Tax Credit
                </th>
                <th
                  class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <template
                v-for="(item, index) in cashImages?.data"
                :key="item.id"
              >
                <!-- Main row -->
                <tr
                  class="transition-colors hover:bg-gray-50 cursor-pointer"
                  :class="
                    expandedItems[item.id]
                      ? 'bg-orange-50 ring-1 ring-inset ring-orange-200'
                      : ''
                  "
                  @click="toggleExpand(item.id)"
                >
                  <!-- TR Date -->
                  <td
                    class="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap"
                  >
                    {{ formatDateForTime(item?.date) }}
                  </td>
                  <!-- Company -->
                  <td
                    class="px-5 py-3.5 text-xs font-medium text-gray-700 max-w-[160px] truncate"
                  >
                    {{
                      item?.relatable?.items?.[0]?.product?.legal_name ?? "—"
                    }}
                  </td>
                  <!-- S. Total -->
                  <!-- <td
                    class="px-5 py-3.5 text-xs text-gray-700 tabular-nums text-right"
                  >
                    <span
                      v-if="
                        item.relatable_type == 'App\\Models\\BookingItemGroup'
                      "
                    >
                      {{ getTotalValue(item?.relatable?.items) }}
                    </span>
                    <span v-else>—</span>
                  </td> -->
                  <!-- S. VAT -->
                  <!-- <td class="px-5 py-3.5 text-xs tabular-nums text-right">
                    {{ item.vat ? formattedNumber(item.vat.toFixed(2)) : "—" }}
                  </td> -->
                  <!-- I. Total -->
                  <!-- <td class="px-5 py-3.5 text-xs tabular-nums text-right">
                    {{
                      calculateInvoiceTotal(
                        item?.relatable?.booking_confirm_letter,
                      ) || "—"
                    }}
                  </td> -->
                  <!-- I. VAT -->
                  <!-- <td class="px-5 py-3.5 text-xs tabular-nums text-right">
                    {{
                      calculateInvoiceVat(
                        item?.relatable?.booking_confirm_letter,
                      ) || "—"
                    }}
                  </td> -->
                  <!-- C. Total -->
                  <!-- <td class="px-5 py-3.5 text-xs tabular-nums text-right">
                    {{ calculateTaxTotal(item?.relatable?.tax_credit) || "—" }}
                  </td> -->
                  <!-- C. VAT -->
                  <!-- <td class="px-5 py-3.5 text-xs tabular-nums text-right">
                    {{ calculateTaxVAT(item?.relatable?.tax_credit) || "—" }}
                  </td> -->
                  <!-- Type badges -->
                  <td class="px-5 py-3.5">
                    <span
                      v-if="
                        item?.relatable?.product_type == 'App\\Models\\Hotel'
                      "
                      class="inline-block text-[11px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md"
                      >Hotel</span
                    >
                    <span
                      v-else-if="
                        item?.relatable?.product_type ==
                        'App\\Models\\EntranceTicket'
                      "
                      class="inline-block text-[11px] font-semibold px-2 py-0.5 bg-purple-50 text-purple-600 rounded-md"
                      >Ticket</span
                    >
                    <span v-else class="text-xs text-gray-400">—</span>
                  </td>
                  <!-- Cash Amount -->
                  <td
                    class="px-5 py-3.5 text-xs font-bold text-gray-900 tabular-nums"
                  >
                    {{ item?.amount }}
                  </td>
                  <!-- CRM -->
                  <td
                    class="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap"
                  >
                    {{ item?.crm_id }}
                  </td>
                  <!-- Invoice badge -->
                  <td class="px-5 py-3.5">
                    <span
                      v-if="item?.has_invoice"
                      class="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700 whitespace-nowrap"
                    >
                      <span
                        class="w-1.5 h-1.5 rounded-full bg-green-500"
                      ></span>
                      Yes
                    </span>
                    <span
                      v-else
                      class="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-400"
                    >
                      —
                    </span>
                  </td>
                  <!-- Tax Credit badge -->
                  <td class="px-5 py-3.5">
                    <span
                      v-if="item?.relatable?.tax_credit?.length > 0"
                      class="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700 whitespace-nowrap"
                    >
                      <span
                        class="w-1.5 h-1.5 rounded-full bg-green-500"
                      ></span>
                      Yes
                    </span>
                    <span
                      v-else
                      class="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-400"
                    >
                      —
                    </span>
                  </td>
                  <!-- Action buttons -->
                  <td class="px-5 py-3.5" @click.stop>
                    <div class="flex items-center gap-1.5 flex-nowrap">
                      <!-- View/Edit -->
                      <button
                        v-if="!authStore.isExternalAudit"
                        @click="goToView(item)"
                        class="inline-flex items-center gap-1 px-2.5 py-1.5 border border-gray-200 bg-white hover:bg-green-50 hover:border-green-300 text-green-600 text-[11px] font-semibold rounded-lg transition-all hover:-translate-y-px hover:shadow-md"
                      >
                        <MagnifyingGlassIcon class="w-3.5 h-3.5" />
                      </button>
                      <button
                        @click="update(item)"
                        class="inline-flex items-center gap-1 px-2.5 py-1.5 border border-gray-200 bg-white hover:bg-orange-50 hover:border-orange-300 text-orange-600 text-[11px] font-semibold rounded-lg transition-all hover:-translate-y-px hover:shadow-md"
                      >
                        <PencilSquareIcon
                          v-if="!authStore.isExternalAudit"
                          class="w-3.5 h-3.5"
                        />
                        <EyeIcon v-else class="w-3.5 h-3.5 text-blue-600" />
                      </button>
                      <!-- Print button -->
                      <button
                        v-if="
                          item?.has_invoice &&
                          item?.relatable?.tax_credit?.length > 0
                        "
                        @click="openOutgoingPrint(item)"
                        :disabled="printLoading === item.id"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-[11px] font-semibold rounded-lg transition-all hover:-translate-y-px hover:shadow-md active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        <span
                          v-if="printLoading === item.id"
                          class="w-3.5 h-3.5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"
                        ></span>
                        <PrinterIcon v-else class="w-3.5 h-3.5" />
                        {{ printLoading === item.id ? "Loading…" : "Print" }}
                      </button>
                    </div>
                  </td>
                </tr>

                <!-- Loading details row -->
                <tr v-if="loadingDetails[item?.id]">
                  <td colspan="14" class="px-5 py-4 text-center bg-orange-50">
                    <div class="flex justify-center items-center gap-2">
                      <div
                        class="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FF613c]"
                      ></div>
                      <span class="text-xs text-gray-500"
                        >Loading details…</span
                      >
                    </div>
                  </td>
                </tr>

                <!-- Expanded detail row -->
                <tr
                  v-if="
                    expandedItems[item.id] &&
                    !loadingDetails[item.id] &&
                    getRelatableData(item.id)
                  "
                >
                  <td colspan="14" class="p-0 bg-orange-50/30">
                    <div class="px-5 pb-4 pt-2">
                      <!-- Sub-table header -->
                      <div
                        class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm"
                      >
                        <table class="min-w-full text-xs">
                          <thead>
                            <tr class="bg-[#FF613c] divide-x divide-orange-400">
                              <th
                                class="px-4 py-2.5 text-[11px] font-semibold text-white uppercase tracking-wide text-left"
                              >
                                List
                              </th>
                              <th
                                class="px-4 py-2.5 text-[11px] font-semibold text-white uppercase tracking-wide text-right"
                              >
                                Product Variation
                              </th>
                              <th
                                class="px-4 py-2.5 text-[11px] font-semibold text-white uppercase tracking-wide text-right"
                              >
                                Price
                              </th>
                              <th
                                class="px-4 py-2.5 text-[11px] font-semibold text-white uppercase tracking-wide text-right"
                              >
                                VAT (7%)
                              </th>
                              <th
                                class="px-4 py-2.5 text-[11px] font-semibold text-white uppercase tracking-wide text-right"
                              >
                                Slip
                              </th>
                              <th
                                class="px-4 py-2.5 text-[11px] font-semibold text-white uppercase tracking-wide text-right"
                              >
                                Invoice
                              </th>
                              <th
                                class="px-4 py-2.5 text-[11px] font-semibold text-white uppercase tracking-wide text-right"
                              >
                                Tax Credit
                              </th>
                            </tr>
                          </thead>

                          <!-- Booking body -->
                          <tbody
                            v-if="item.relatable_type == 'App\\Models\\Booking'"
                            class="bg-white divide-y divide-gray-100"
                          >
                            <tr>
                              <td class="px-4 py-3">
                                <span
                                  class="text-[11px] font-semibold bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                  >Total Sale</span
                                >
                              </td>
                              <td class="px-4 py-3 text-right text-gray-500">
                                —
                              </td>
                              <td
                                class="px-4 py-3 text-right font-semibold text-gray-800 tabular-nums"
                              >
                                {{
                                  formattedNumber(
                                    getRelatableData(item.id)?.grand_total,
                                  )
                                }}
                              </td>
                              <td class="px-4 py-3 text-right tabular-nums">
                                {{
                                  formattedNumber(
                                    getRelatableData(item.id)?.output_vat,
                                  )
                                }}
                              </td>
                              <td
                                class="px-4 py-3 text-right cursor-pointer"
                                @click="
                                  show(getRelatableData(item.id)?.receipts)
                                "
                              >
                                <span
                                  class="text-[11px] underline text-blue-600 font-semibold"
                                  >sale slip ({{
                                    getRelatableData(item.id)?.receipts
                                      ?.length || 0
                                  }})</span
                                >
                              </td>
                              <td
                                class="px-4 py-3 text-right cursor-pointer"
                                @click="
                                  openCredit(getRelatableData(item.id)?.id)
                                "
                              >
                                <span
                                  class="text-[11px] underline text-blue-600 font-semibold"
                                  >tax Invoice</span
                                >
                              </td>
                              <td class="px-4 py-3 text-right text-gray-400">
                                —
                              </td>
                            </tr>
                            <tr>
                              <td class="px-4 py-3">
                                <span
                                  class="text-[11px] font-semibold bg-red-50 text-red-600 px-2 py-1 rounded"
                                  >Deduct Commission</span
                                >
                              </td>
                              <td class="px-4 py-3 text-right text-gray-500">
                                —
                              </td>
                              <td
                                class="px-4 py-3 text-right text-red-600 tabular-nums"
                              >
                                -
                                {{
                                  formattedNumber(
                                    getRelatableData(item.id)?.commission,
                                  )
                                }}
                              </td>
                              <td class="px-4 py-3 text-right text-gray-400">
                                —
                              </td>
                              <td class="px-4 py-3 text-right text-gray-400">
                                —
                              </td>
                              <td class="px-4 py-3 text-right text-gray-400">
                                —
                              </td>
                              <td class="px-4 py-3 text-right text-gray-400">
                                —
                              </td>
                            </tr>
                            <tr>
                              <td class="px-4 py-3">
                                <span
                                  class="text-[11px] font-semibold bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                  >Subtotal</span
                                >
                              </td>
                              <td class="px-4 py-3 text-right text-gray-500">
                                —
                              </td>
                              <td
                                class="px-4 py-3 text-right font-semibold tabular-nums"
                              >
                                {{
                                  formattedNumber(
                                    getRelatableData(item.id)?.grand_total -
                                      getRelatableData(item.id)?.commission,
                                  )
                                }}
                              </td>
                              <td class="px-4 py-3 text-right tabular-nums">
                                {{
                                  formattedNumber(
                                    (
                                      getRelatableData(item.id)?.grand_total -
                                      getRelatableData(item.id)?.commission -
                                      (getRelatableData(item.id)?.grand_total -
                                        getRelatableData(item.id)?.commission) /
                                        1.07
                                    ).toFixed(2),
                                  )
                                }}
                              </td>
                              <td class="px-4 py-3 text-right text-gray-400">
                                —
                              </td>
                              <td class="px-4 py-3 text-right text-gray-400">
                                —
                              </td>
                              <td class="px-4 py-3 text-right text-gray-400">
                                —
                              </td>
                            </tr>
                            <tr
                              v-for="v in getGroupedItems(item.id)"
                              :key="v.group_id"
                            >
                              <td class="px-4 py-3">
                                <div class="flex flex-wrap gap-1">
                                  <span
                                    @click="goToGroup(v)"
                                    class="text-[11px] font-semibold bg-blue-50 text-blue-600 px-2 py-1 rounded cursor-pointer hover:bg-blue-100"
                                    >Group</span
                                  >
                                  <span
                                    v-for="i in v.items"
                                    :key="i.id"
                                    class="text-[11px] bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                    >{{ i.crm_id.split("_")[1] }}</span
                                  >
                                </div>
                              </td>
                              <td class="px-4 py-3 text-right text-gray-600">
                                {{ v.items[0]?.product_name }}
                              </td>
                              <td class="px-4 py-3 text-right tabular-nums">
                                {{ formattedNumber(totalCost(v.items)) }}
                              </td>
                              <td class="px-4 py-3 text-right tabular-nums">
                                {{
                                  formattedNumber(
                                    (
                                      totalCost(v.items) -
                                      totalCost(v.items) / 1.07
                                    ).toFixed(2),
                                  )
                                }}
                              </td>
                              <td
                                class="px-4 py-3 text-right cursor-pointer"
                                @click="
                                  v.related_slip.length > 0 &&
                                    show(v.related_slip)
                                "
                              >
                                <span
                                  :class="
                                    v.related_slip.length > 0
                                      ? 'text-blue-600 underline'
                                      : 'text-red-500 font-semibold'
                                  "
                                  class="text-[11px]"
                                >
                                  {{
                                    v.related_slip.length > 0
                                      ? `slip (${v.related_slip.length})`
                                      : "missing"
                                  }}
                                </span>
                              </td>
                              <td
                                class="px-4 py-3 text-right cursor-pointer"
                                @click="
                                  v.related_tax.length > 0 &&
                                    showTax(v.related_tax)
                                "
                              >
                                <span
                                  :class="
                                    v.related_tax.length > 0
                                      ? 'text-blue-600 underline'
                                      : 'text-red-500 font-semibold'
                                  "
                                  class="text-[11px]"
                                >
                                  {{
                                    v.related_tax.length > 0
                                      ? `Invoice (${v.related_tax.length})`
                                      : "missing"
                                  }}
                                </span>
                              </td>
                              <td
                                class="px-4 py-3 text-right cursor-pointer"
                                @click="showCredit(v.related_credit)"
                              >
                                <span
                                  :class="
                                    v.related_credit.length > 0
                                      ? 'text-blue-600 underline'
                                      : 'text-red-500 font-semibold'
                                  "
                                  class="text-[11px]"
                                >
                                  {{
                                    v.related_credit.length > 0
                                      ? `Credit (${v.related_credit.length})`
                                      : "missing"
                                  }}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td class="px-4 py-3">
                                <span
                                  class="text-[11px] font-semibold bg-blue-50 text-blue-600 px-2 py-1 rounded"
                                  >Net Summary</span
                                >
                              </td>
                              <td class="px-4 py-3 text-right text-gray-500">
                                —
                              </td>
                              <td
                                class="px-4 py-3 text-right font-bold tabular-nums"
                              >
                                {{
                                  formattedNumber(
                                    calculateGrandVat(
                                      getRelatableData(item.id)?.items,
                                      getRelatableData(item.id)?.grand_total,
                                    ) - getRelatableData(item.id)?.commission,
                                  )
                                }}
                              </td>
                              <td class="px-4 py-3 text-right tabular-nums">
                                {{
                                  formattedNumber(
                                    (
                                      getRelatableData(item.id)?.commission -
                                      getRelatableData(item.id)?.commission /
                                        1.07
                                    ).toFixed(2),
                                  )
                                }}
                              </td>
                              <td class="px-4 py-3 text-right text-gray-400">
                                —
                              </td>
                              <td class="px-4 py-3 text-right text-gray-400">
                                —
                              </td>
                              <td class="px-4 py-3 text-right text-gray-400">
                                —
                              </td>
                            </tr>
                          </tbody>

                          <!-- BookingItemGroup body -->
                          <tbody
                            v-if="
                              item.relatable_type ==
                              'App\\Models\\BookingItemGroup'
                            "
                            class="bg-white divide-y divide-gray-100"
                          >
                            <tr>
                              <td class="px-4 py-3 w-[220px]">
                                <div class="flex flex-wrap gap-1">
                                  <span
                                    @click="goToGroup(getExpenseItems(item.id))"
                                    class="text-[11px] font-semibold bg-blue-50 text-blue-600 px-2 py-1 rounded cursor-pointer hover:bg-blue-100"
                                    >Group</span
                                  >
                                  <span
                                    v-for="a in getExpenseItems(item.id)?.items"
                                    :key="a.id"
                                    class="text-[11px] bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                    >{{ a?.crm_id.split("_")[1] }}</span
                                  >
                                </div>
                              </td>
                              <td class="px-4 py-3 text-right">
                                <p class="text-[11px] text-gray-600">
                                  {{
                                    getExpenseItems(item.id)?.items[0]?.product
                                      ?.name
                                  }}
                                  <span
                                    class="text-blue-500 mx-1"
                                    v-for="a in getExpenseItems(item.id)?.items"
                                    :key="a.id"
                                    >S:{{ a.service_date }},</span
                                  >
                                  <span
                                    class="text-red-500"
                                    v-for="a in getExpenseItems(item.id)?.items"
                                    :key="a.id"
                                    >Q:{{ a.quantity }},</span
                                  >
                                </p>
                              </td>
                              <td class="px-4 py-3 text-right tabular-nums">
                                {{
                                  formattedNumber(
                                    getExpenseItems(item.id)?.items.reduce(
                                      (t, a) => t + a.total_cost_price,
                                      0,
                                    ),
                                  )
                                }}
                              </td>
                              <td class="px-4 py-3 text-right tabular-nums">
                                {{
                                  formattedNumber(
                                    getExpenseItems(item.id)?.items.reduce(
                                      (t, a) => t + a.output_vat,
                                      0,
                                    ),
                                  )
                                }}
                              </td>
                              <td
                                class="px-4 py-3 text-right cursor-pointer"
                                @click="viewReceipt(item)"
                              >
                                <span
                                  class="text-[11px] underline text-blue-600 font-semibold"
                                  >slip</span
                                >
                              </td>
                              <td
                                class="px-4 py-3 text-right cursor-pointer"
                                @click="
                                  showTax(
                                    getRelatableData(item.id)
                                      ?.booking_confirm_letter,
                                  )
                                "
                              >
                                <span
                                  :class="
                                    getRelatableData(item.id)
                                      ?.booking_confirm_letter?.length > 0
                                      ? 'text-blue-600 underline'
                                      : 'text-red-500 font-semibold'
                                  "
                                  class="text-[11px]"
                                >
                                  {{
                                    getRelatableData(item.id)
                                      ?.booking_confirm_letter?.length > 0
                                      ? "tax"
                                      : "missing"
                                  }}
                                </span>
                              </td>
                              <td
                                class="px-4 py-3 text-right cursor-pointer"
                                @click="
                                  getRelatableData(item.id)?.tax_credit
                                    ?.length > 0
                                    ? showCredit(
                                        getRelatableData(item.id)?.tax_credit,
                                      )
                                    : addTaxReceipt(getRelatableData(item.id))
                                "
                              >
                                <span
                                  :class="
                                    getRelatableData(item.id)?.tax_credit
                                      ?.length > 0
                                      ? 'text-blue-600 underline'
                                      : 'text-orange-500 font-semibold bg-orange-50 px-2 py-0.5 rounded'
                                  "
                                  class="text-[11px]"
                                >
                                  {{
                                    getRelatableData(item.id)?.tax_credit
                                      ?.length > 0
                                      ? `credit (${
                                          getRelatableData(item.id)?.tax_credit
                                            ?.length
                                        })`
                                      : "add credit"
                                  }}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>

              <!-- Empty row fallback -->
              <tr v-if="(cashImages?.data ?? []).length === 0">
                <td
                  colspan="14"
                  class="text-center text-gray-400 text-sm py-16"
                >
                  No records found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ── TAX VIEW TABLE (income-style card) ── -->
        <div
          v-if="
            cashImages?.data &&
            table_type &&
            cashImages.data.length > 0 &&
            !loading
          "
          class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th
                  class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                >
                  TR. Datetime
                </th>
                <th
                  class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                >
                  Cash Amount
                </th>
                <th
                  class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                >
                  Tax Receipt No.
                </th>
                <th
                  class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                >
                  Tax Receipt Date
                </th>
                <th
                  class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                >
                  Supplier Name
                </th>
                <th
                  class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                >
                  Order Description
                </th>
                <th
                  class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                >
                  Sale Value
                </th>
                <th
                  class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                >
                  VAT Value
                </th>
                <th
                  class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide"
                >
                  CRM ID
                </th>
                <th
                  class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide"
                >
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="(item, index) in cashImages?.data"
                :key="item.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                  {{ formatDateForTime(item?.date) }},
                  {{ formatTime(item?.date) }}
                </td>
                <td
                  class="px-5 py-3.5 text-xs font-bold text-gray-900 tabular-nums"
                >
                  {{ item.amount }}
                </td>
                <td class="px-5 py-3.5 text-xs text-gray-600">
                  {{ item.relatable?.tax_credit[0]?.invoice_number ?? "N/A" }}
                </td>
                <td class="px-5 py-3.5 text-xs text-gray-600">
                  {{ item.relatable?.tax_credit[0]?.receipt_date }}
                </td>
                <td class="px-5 py-3.5 text-xs text-gray-700 font-medium">
                  {{ item.relatable?.items[0]?.product?.vat_name ?? "N/A" }}
                </td>
                <td class="px-5 py-3.5 text-xs">
                  <span
                    class="inline-block text-[11px] font-semibold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md"
                  >
                    {{ item.relatable?.items[0]?.product_type?.split("\\")[2] }}
                  </span>
                </td>
                <td class="px-5 py-3.5 text-xs tabular-nums text-gray-700">
                  {{ item.relatable?.tax_credit[0]?.total_after_tax }}
                </td>
                <td class="px-5 py-3.5 text-xs tabular-nums text-gray-700">
                  {{ item.relatable?.tax_credit[0]?.total_tax_withold }}
                </td>
                <td class="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                  {{ item?.crm_id }}
                </td>
                <td class="px-5 py-3.5">
                  <span
                    v-if="item?.has_invoice"
                    class="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Yes
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="mt-3" v-if="!loading && cashImages?.data?.length > 0">
          <Pagination :data="cashImages" @change-page="changePage" />
        </div>
      </div>
    </div>

    <!-- ── Modals ── -->

    <!-- Receipt image modal -->
    <Modal
      :isOpen="placeholderFile != null"
      @closeModal="placeholderFile = null"
    >
      <DialogPanel
        class="w-full max-w-xl transform overflow-hidden rounded-xl bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-5"
          >Receipt</DialogTitle
        >
        <div class="grid grid-cols-2 gap-4">
          <img
            :src="placeholderFile?.image"
            alt="Receipt"
            class="w-full rounded-lg"
          />
          <div class="space-y-2 text-sm">
            <div class="space-y-1">
              <p class="text-xs text-gray-500">Interact Bank:</p>
              <p class="font-medium">{{ placeholderFile?.interact_bank }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-xs text-gray-500">Currency:</p>
              <p class="font-medium">{{ placeholderFile?.currency }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-xs text-gray-500">Date:</p>
              <p class="font-medium">
                {{ formatDateForTime(placeholderFile?.date) }},
                {{ formatTime(placeholderFile?.date) }}
              </p>
            </div>
            <div class="space-y-1">
              <p class="text-xs text-gray-500">Sender:</p>
              <p class="font-medium">{{ placeholderFile?.sender }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-xs text-gray-500">Receiver:</p>
              <p class="font-medium">{{ placeholderFile?.receiver }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-xs text-gray-500">Amount:</p>
              <p class="font-medium">{{ placeholderFile?.amount }}</p>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Modal>

    <!-- Edit modal -->
    <Modal :isOpen="updateModalOpen" @closeModal="closeModal">
      <DialogPanel
        class="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white/95 backdrop-blur-md text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-3 px-4 rounded-t-xl"
        >
          <span class="uppercase">{{
            updateData?.relatable_type == "App\\Models\\Booking"
              ? "Booking"
              : updateData?.relatable_type == "App\\Models\\BookingItemGroup"
              ? "Group Expense"
              : "Cash Book"
          }}</span>
        </DialogTitle>
        <div class="p-4">
          <ReceiptEdit :updateData="updateData" @update="onChangeUpdate" />
        </div>
      </DialogPanel>
    </Modal>

    <!-- Sale slip modal -->
    <Modal :isOpen="IsShow" @closeModal="showOff">
      <DialogPanel
        class="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white/95 backdrop-blur-md text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-3 px-4 rounded-t-xl"
        >
          <span class="uppercase">Sale Slip</span>
        </DialogTitle>
        <div class="p-4">
          <div v-if="showData.length > 0" class="grid grid-cols-2 gap-4">
            <div
              class="flex items-center justify-center bg-gray-100 rounded-lg"
            >
              <img
                :src="
                  showData[currentIndex].image?.includes(
                    'https://thanywhere.sgp1.cdn.digitaloceanspaces.com/images',
                  )
                    ? showData[currentIndex].image
                    : `https://thanywhere.sgp1.cdn.digitaloceanspaces.com/images/${showData[currentIndex].image}`
                "
                alt="Receipt image"
                class="object-cover h-full w-full"
                v-if="showData[currentIndex].image"
              />
              <div v-else class="text-gray-500 p-4">No image available</div>
            </div>
            <div class="pb-4 space-y-3 text-sm">
              <div class="space-y-1">
                <p class="text-xs text-gray-500">Amount:</p>
                <p class="font-semibold">
                  {{ showData[currentIndex].amount }}
                  {{ showData[currentIndex].currency }}
                </p>
              </div>
              <div class="space-y-1">
                <p class="text-xs text-gray-500">Date:</p>
                <p class="font-semibold">{{ showData[currentIndex].date }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-xs text-gray-500">Sender:</p>
                <p class="font-semibold">{{ showData[currentIndex].sender }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-xs text-gray-500">Receiver:</p>
                <p class="font-semibold">
                  {{ showData[currentIndex].receiver }}
                </p>
              </div>
              <div class="space-y-1">
                <p class="text-xs text-gray-500">Bank:</p>
                <p class="font-semibold">
                  {{ showData[currentIndex].interact_bank }}
                </p>
              </div>
              <div class="space-y-1">
                <p class="text-xs text-gray-500">Created At:</p>
                <p class="font-semibold">
                  {{ showData[currentIndex].created_at }}
                </p>
              </div>
            </div>
          </div>
          <div
            v-if="showData.length > 1"
            class="flex justify-between items-center mt-4"
          >
            <button
              @click="prevItem"
              :disabled="currentIndex === 0"
              class="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
            >
              &lt; Previous
            </button>
            <span class="text-sm"
              >{{ currentIndex + 1 }} of {{ showData.length }}</span
            >
            <button
              @click="nextItem"
              :disabled="currentIndex === showData.length - 1"
              class="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
            >
              Next &gt;
            </button>
          </div>
        </div>
      </DialogPanel>
    </Modal>

    <!-- Tax invoice modal -->
    <Modal :isOpen="IsTaxShow" @closeModal="showTaxOff">
      <DialogPanel
        class="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white/95 backdrop-blur-md text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-3 px-4 rounded-t-xl"
        >
          <span class="uppercase">Purchasing Tax Invoice</span>
        </DialogTitle>
        <div class="p-4">
          <div v-if="taxData.length > 0" class="grid grid-cols-2 gap-4">
            <div
              class="flex items-center justify-center bg-gray-100 rounded-lg"
            >
              <img
                :src="taxData[currentIndex2].file"
                alt="Receipt image"
                class="object-cover h-full w-full"
                v-if="taxData[currentIndex2].file"
              />
              <div v-else class="text-gray-500 p-4">No image available</div>
            </div>
            <div class="space-y-3 pb-4 px-3">
              <h3 class="font-semibold text-gray-700 mb-2">Details</h3>
              <div class="space-y-1 text-sm">
                <p class="text-xs text-gray-500">Company Legal Name:</p>
                <p class="font-semibold">
                  {{ taxData[currentIndex2]?.meta?.company_legal_name }}
                </p>
              </div>
              <div class="space-y-1 text-sm">
                <p class="text-xs text-gray-500">Invoice Number:</p>
                <p class="font-semibold">
                  {{ taxData[currentIndex2]?.meta?.invoice_number }}
                </p>
              </div>
              <div class="space-y-1 text-sm">
                <p class="text-xs text-gray-500">Product Name:</p>
                <p class="font-semibold">
                  {{ taxData[currentIndex2]?.meta?.product_name }}
                </p>
              </div>
              <div class="space-y-1 text-sm">
                <p class="text-xs text-gray-500">Receipt Date:</p>
                <p class="font-semibold">
                  {{ taxData[currentIndex2]?.meta?.receipt_date }}
                </p>
              </div>
              <div class="space-y-1 text-sm">
                <p class="text-xs text-gray-500">Total Before Tax:</p>
                <p class="font-semibold">
                  {{ taxData[currentIndex2]?.meta?.total_tax_amount }}
                </p>
              </div>
              <div class="space-y-1 text-sm">
                <p class="text-xs text-gray-500">Total Tax Withheld:</p>
                <p class="font-semibold">
                  {{ taxData[currentIndex2]?.meta?.total_tax_withold }}
                </p>
              </div>
              <div class="space-y-1 text-sm">
                <p class="text-xs text-gray-500">Total After Tax:</p>
                <p class="font-semibold">
                  {{ taxData[currentIndex2]?.meta?.total_after_tax }}
                </p>
              </div>
            </div>
          </div>
          <div
            v-if="taxData.length > 1"
            class="flex justify-between items-center mt-4"
          >
            <button
              @click="prev2Item"
              :disabled="currentIndex2 === 0"
              class="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
            >
              &lt; Previous
            </button>
            <span class="text-sm"
              >{{ currentIndex2 + 1 }} of {{ taxData.length }}</span
            >
            <button
              @click="next2Item"
              :disabled="currentIndex2 === taxData.length - 1"
              class="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
            >
              Next &gt;
            </button>
          </div>
        </div>
      </DialogPanel>
    </Modal>

    <!-- Credit receipt modal -->
    <Modal :isOpen="IsCredit" @closeModal="showCreditOff">
      <DialogPanel
        class="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white/95 backdrop-blur-md text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-3 px-4 rounded-t-xl"
        >
          <span class="uppercase">Credit Receipt</span>
          <div class="flex items-center gap-2">
            <p
              class="bg-blue-500 px-2 py-1 rounded text-xs cursor-pointer hover:bg-blue-600"
              @click="editCredit(creditData[currentIndex2]?.id)"
            >
              Go Tax Credit
            </p>
          </div>
        </DialogTitle>
        <div class="p-4">
          <div v-if="creditData.length > 0" class="grid grid-cols-2 gap-4">
            <div
              class="flex items-center justify-center bg-gray-100 rounded-lg"
            >
              <img
                :src="creditData[currentIndex2].receipt_image"
                alt="Receipt image"
                class="object-cover h-full w-full"
                v-if="creditData[currentIndex2].receipt_image"
              />
              <div v-else class="text-gray-500 p-4">No image available</div>
            </div>
            <div class="space-y-3 pb-4 px-3">
              <h3 class="font-semibold text-gray-700 mb-2">Details</h3>
              <div class="space-y-1 text-sm">
                <p class="text-xs text-gray-500">Company Legal Name:</p>
                <p class="font-semibold">
                  {{ creditData[currentIndex2]?.company_legal_name }}
                </p>
              </div>
              <div class="space-y-1 text-sm">
                <p class="text-xs text-gray-500">Invoice Number:</p>
                <p class="font-semibold">
                  {{ creditData[currentIndex2]?.invoice_number }}
                </p>
              </div>
              <div class="space-y-1 text-sm">
                <p class="text-xs text-gray-500">Product Name:</p>
                <p class="font-semibold">
                  {{ creditData[currentIndex2]?.product?.name }}
                </p>
              </div>
              <div class="space-y-1 text-sm">
                <p class="text-xs text-gray-500">Receipt Date:</p>
                <p class="font-semibold">
                  {{ creditData[currentIndex2]?.receipt_date }}
                </p>
              </div>
              <div class="space-y-1 text-sm">
                <p class="text-xs text-gray-500">Total Before Tax:</p>
                <p class="font-semibold">
                  {{ creditData[currentIndex2]?.total_tax_amount }}
                </p>
              </div>
              <div class="space-y-1 text-sm">
                <p class="text-xs text-gray-500">Total Tax Withheld:</p>
                <p class="font-semibold">
                  {{ creditData[currentIndex2]?.total_tax_withold }}
                </p>
              </div>
              <div class="space-y-1 text-sm">
                <p class="text-xs text-gray-500">Total After Tax:</p>
                <p class="font-semibold">
                  {{ creditData[currentIndex2]?.total_after_tax }}
                </p>
              </div>
            </div>
          </div>
          <div class="flex justify-between items-center gap-x-2 pt-2">
            <div
              v-if="creditData.length > 1"
              class="flex justify-between items-center mt-4 gap-3"
            >
              <button
                @click="prev2Item"
                :disabled="currentIndex2 === 0"
                class="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
              >
                &lt; Previous
              </button>
              <span class="text-sm"
                >{{ currentIndex2 + 1 }} of {{ creditData.length }}</span
              >
              <button
                @click="next2Item"
                :disabled="currentIndex2 === creditData.length - 1"
                class="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
              >
                Next &gt;
              </button>
            </div>
            <p
              v-if="authStore.isSuperAdmin"
              class="bg-red-600 px-2 py-1.5 text-white text-sm rounded cursor-pointer hover:bg-red-700"
              @click="deleteCredit(creditData[currentIndex2]?.id)"
            >
              Delete Tax Credit
            </p>
          </div>
        </div>
      </DialogPanel>
    </Modal>

    <ConnectTaxReceiptModal
      v-model="showConnectModal"
      :group-id="addingGroupId"
      :group-info="addingGroupInfo"
      @connected="onConnected"
      @close="closeConnectModal"
    />
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useSidebarStore } from "../stores/sidebar";
import { computed, onMounted, ref, watch } from "vue";
import Pagination from "../components/Pagination.vue";
import { useToast } from "vue-toastification";
import {
  EyeIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
  PrinterIcon,
} from "@heroicons/vue/24/outline";
import debounce from "lodash/debounce";
import Swal from "sweetalert2";
import { useAuthStore } from "../stores/auth";
import YearPickerVue from "./AccountingComponent/yearPicker.vue";
import { useRoute, useRouter } from "vue-router";
import { useBookingReceiptStore } from "../stores/bookingReceipt";
import Modal from "../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useReservationStore } from "../stores/reservation";
import ReceiptEdit from "./ReceiptEdit.vue";
import { useCashImageStore } from "../stores/cashImage";
import { useGroupStore } from "../stores/group";
import { CheckBadgeIcon } from "@heroicons/vue/24/solid";
import { formattedNumber } from "./help/FormatData";
import TaxReceiptModal from "./TaxComponent/CreateModal.vue";
import ConnectTaxReceiptModal from "./TaxComponent/ConnectModal.vue";
import { useTaxReceiptStore } from "../stores/taxReceipt";

const sideBarStore = useSidebarStore();
const groupStore = useGroupStore();
const toast = useToast();
const { isShowSidebar } = storeToRefs(sideBarStore);
const bookingReceiptStore = useBookingReceiptStore();
const cashImageStore = useCashImageStore();
const taxReceiptStore = useTaxReceiptStore();
const reservationStore = useReservationStore();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { cashImages, loading } = storeToRefs(cashImageStore);

// ── State ──────────────────────────────────────────────────
const showConnectModal = ref(false);
const table_type = ref(false);
const addingGroupId = ref(null);
const addingGroupInfo = ref(null);

const date_range = ref("");
const filterType = ref("all");
const senderSearch = ref("");
const crmSearch = ref("");
const invoice = ref("");
const invoiceTax = ref("");
const sort_by = ref("date");
const sort_order = ref("asc");
const amountSearch = ref("");
const per_page = ref(100);

const expandedItems = ref({});
const currentDate = new Date();
const year = ref(currentDate.getFullYear());
const selectedMonth = ref(currentDate.getMonth() + 1);

const detailedItems = ref({});
const loadingDetails = ref({});

const showTaxModal = ref(false);

// Print state
const printLoading = ref(null);

// Modal display state
const placeholderFile = ref(null);
const updateModalOpen = ref(false);
const updateData = ref({
  id: "",
  date: "",
  file: "",
  sender: "",
  amount: "",
  receiver: "",
  interact_bank: "",
  currency: "",
  relatable_type: "",
});
const showData = ref([]);
const taxData = ref([]);
const currentIndex = ref(0);
const currentIndex2 = ref(0);
const IsShow = ref(false);
const IsTaxShow = ref(false);
const IsCredit = ref(false);
const creditData = ref([]);

const monthArray = [
  { id: 1, name: "January" },
  { id: 2, name: "February" },
  { id: 3, name: "March" },
  { id: 4, name: "April" },
  { id: 5, name: "May" },
  { id: 6, name: "June" },
  { id: 7, name: "July" },
  { id: 8, name: "August" },
  { id: 9, name: "September" },
  { id: 10, name: "October" },
  { id: 11, name: "November" },
  { id: 12, name: "December" },
];

// ── Helpers ────────────────────────────────────────────────
const fmt = (n) =>
  n != null ? new Intl.NumberFormat().format(Math.round(Number(n))) : "0";

const formatDateForTime = (dateString) => {
  if (!dateString) return "";
  const [datePart] = dateString.split(" ");
  const [day, month, year] = datePart.split("-");
  const date = new Date(`${year}-${month}-${day}`);
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
  return `${day.padStart(2, "0")} ${monthNames[date.getMonth()]} ${year.slice(
    -2,
  )}`;
};

const formatTime = (timeString) => {
  if (!timeString) return "-";
  const timePart = timeString.split(" ")[1];
  const [hours, minutes] = timePart.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${minutes} ${ampm}`;
};

const getTotalValue = (items) => {
  if (!items) return 0;
  return items.reduce((total, item) => total + item.total_cost_price * 1, 0);
};

const calculateInvoiceTotal = (item) => {
  if (!item) return 0;
  return item.reduce((total, i) => total + i.meta?.total_after_tax * 1, 0);
};

const calculateInvoiceVat = (item) => {
  if (!item) return 0;
  return formattedNumber(
    item.reduce((t, i) => t + i.meta?.total_tax_withold * 1, 0),
  );
};

const calculateTaxTotal = (item) => {
  if (!item) return 0;
  return item.reduce(
    (total, i) => total + (i?.total_after_tax ? i.total_after_tax * 1 : 0),
    0,
  );
};

const calculateTaxVAT = (item) => {
  if (!item) return 0;
  return item.reduce(
    (total, i) => total + (i?.total_tax_withold ? i.total_tax_withold * 1 : 0),
    0,
  );
};

const totalCost = (items) => {
  if (!items) return 0;
  return items.reduce((total, item) => total + item.expense, 0);
};

const calculateGrandVat = (items, grand_total) => {
  if (grand_total && items) {
    let grand_total_minus = 0;
    items.forEach((item) => {
      if (item.total_cost_price) grand_total_minus += item.total_cost_price * 1;
    });
    return (grand_total - grand_total_minus).toFixed(2);
  }
  return 0;
};

// ── Detail / expand ────────────────────────────────────────
const getDetailAction = async (itemId) => {
  if (detailedItems.value[itemId]) return detailedItems.value[itemId];
  loadingDetails.value[itemId] = true;
  try {
    const response = await cashImageStore.getDetailAction(itemId);
    if (response.status == 1) {
      detailedItems.value[itemId] = response.result;
      return response.result;
    } else {
      toast.error("Failed to load details");
      return null;
    }
  } catch {
    toast.error("Error loading details");
    return null;
  } finally {
    loadingDetails.value[itemId] = false;
  }
};

const toggleExpand = async (itemId) => {
  const isCurrentlyExpanded = expandedItems.value[itemId];
  expandedItems.value = {};
  if (!isCurrentlyExpanded) {
    expandedItems.value[itemId] = true;
    await getDetailAction(itemId);
  }
};

const getRelatableData = (itemId) =>
  detailedItems.value[itemId]?.relatable ?? null;
const getGroupedItems = (itemId) =>
  detailedItems.value[itemId]?.grouped_items ?? [];
const getExpenseItems = (itemId) =>
  detailedItems.value[itemId]?.relatable ?? [];

// ── Search/Filter ──────────────────────────────────────────
const generateDateRangeForMonth = (month, yearValue) => {
  const startDate = new Date(yearValue, month - 1, 1);
  const endDate = new Date(yearValue, month, 0);
  const fmt = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate(),
    ).padStart(2, "0")}`;
  return `${fmt(startDate)},${fmt(endDate)}`;
};

const setMonthDateRange = (month, yearValue) => {
  date_range.value = generateDateRangeForMonth(month, yearValue);
};

const searchParams = computed(() => {
  let params = {};
  if (date_range.value) params.date = date_range.value;
  if (senderSearch.value) params.sender = senderSearch.value;
  if (crmSearch.value) params.crm_id = crmSearch.value;
  if (sort_by.value && sort_order.value) {
    params.sort_by = sort_by.value;
    params.sort_order = sort_order.value;
  }
  if (amountSearch.value) params.amount = amountSearch.value;
  if (invoice.value) params.filter_type = invoice.value;
  if (invoiceTax.value) params.filter_type_invoice = invoiceTax.value;
  params.include_relatable = true;
  params.relatable_type = "App\\Models\\BookingItemGroup";
  params.bank_verify = 1;
  params.data_verify = 1;
  params.interact_bank = "company";
  params.limit = per_page.value ? per_page.value : 100;
  return params;
});

const getAction = async () => {
  await cashImageStore.getListAction(searchParams.value);
};
const changePage = async (url) => {
  await cashImageStore.getChangePage(url, searchParams.value);
};

const handleYearChange = (message) => {
  year.value = message;
  setMonthDateRange(selectedMonth.value, year.value);
};
const handleMonthChange = (month) => {
  selectedMonth.value = month;
  setMonthDateRange(month, year.value);
};

const clearSearch = () => {
  senderSearch.value = "";
  crmSearch.value = "";
  amountSearch.value = "";
  filterType.value = "";
  invoice.value = "";
  invoiceTax.value = "";
  sort_by.value = "date";
  sort_order.value = "desc";
};

const goTaxMissingTable = () => {
  router.push({
    name: "outTaxMissing",
    query: { daterange: date_range.value },
  });
};

// ── Tax/credit actions ─────────────────────────────────────
const addTaxReceipt = (data) => {
  addingGroupId.value = data.items[0].group_id;
  addingGroupInfo.value = data;
  showConnectModal.value = true;
};

const closeConnectModal = () => {
  showConnectModal.value = false;
  addingGroupId.value = null;
  addingGroupInfo.value = null;
};
const onConnected = async () => {
  showConnectModal.value = false;
  addingGroupId.value = null;
  addingGroupInfo.value = null;
  await getAction();
};

const deleteCredit = async (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await taxReceiptStore.deleteAction(id);
        if (response.status == 1) {
          toast.success("Tax Credit Deleted");
          await getAction();
        } else toast.error("Failed to delete tax credit");
      } catch {
        toast.error("Failed to delete tax credit");
      }
    }
  });
};

const editCredit = (id) => {
  window.open(`/tax_receipt?id=${id}`, "_blank");
};
const openCredit = (id) => {
  window.open(
    import.meta.env.VITE_API_URL + "/bookings/" + id + "/credit",
    "_blank",
  );
};
const goToGroup = (data) => {
  if (authStore.user.role != "external_audit") {
    const type = data?.group_info?.product_type ?? data?.product_type;
    const id = data?.group_id ?? data?.id;
    if (!id) return;
    if (type == "App\\Models\\EntranceTicket")
      window.open(`/group-attraction?id=${id}`, "_blank");
    else if (type == "App\\Models\\Hotel")
      window.open(`/group-hotel?id=${id}`, "_blank");
    else if (type == "App\\Models\\PrivateVanTour")
      window.open(`/group-private-van-tour?id=${id}`, "_blank");
  }
};

const goToView = async (data) => {
  if (data.relatable_type == "App\\Models\\Booking")
    router.push(`bookings/new-update/${data?.relatable_id}`);
  else if (data.relatable_type == "App\\Models\\BookingItemGroup") {
    if (data?.product_type == "App\\Models\\EntranceTicket")
      router.push(`/group-attraction?id=${data?.relatable_id}`);
    else if (data?.product_type == "App\\Models\\Hotel")
      router.push(`/group-hotel?id=${data?.relatable_id}`);
    else if (data?.product_type == "App\\Models\\PrivateVanTour")
      router.push(`/group-private-van-tour?id=${data?.relatable_id}`);
  } else if (data.relatable_type == "App\\Models\\CashBook")
    router.push(`/cash-book/${data?.relatable_id}`);
};

// ── Modal helpers ──────────────────────────────────────────
const viewReceipt = (item) => {
  if (item) placeholderFile.value = item;
  else toast.warning("No receipt file available");
};

const show = (data) => {
  showData.value = data;
  IsShow.value = true;
};
const showOff = () => {
  IsShow.value = false;
  showData.value = [];
  currentIndex.value = 0;
};
const showTax = (data) => {
  taxData.value = data;
  IsTaxShow.value = true;
};
const showTaxOff = () => {
  IsTaxShow.value = false;
  taxData.value = [];
  currentIndex2.value = 0;
};
const showCredit = (data) => {
  creditData.value = data;
  IsCredit.value = true;
};
const showCreditOff = () => {
  IsCredit.value = false;
  creditData.value = [];
  currentIndex2.value = 0;
};

const closeTaxModal = () => {
  showTaxModal.value = false;
};

const nextItem = () => {
  if (currentIndex.value < showData.value.length - 1) currentIndex.value++;
};
const prevItem = () => {
  if (currentIndex.value > 0) currentIndex.value--;
};
const next2Item = () => {
  if (currentIndex2.value < taxData.value.length - 1) currentIndex2.value++;
};
const prev2Item = () => {
  if (currentIndex2.value > 0) currentIndex2.value--;
};

const update = (data) => {
  updateModalOpen.value = true;
  updateData.value = {
    id: data.id,
    date: data.date,
    sender: data.sender,
    amount: data.amount,
    receiver: data.receiver,
    interact_bank: data.interact_bank,
    currency: data.currency,
    relatable_type: data.relatable_type,
    file: data.image,
  };
};
const closeModal = () => {
  updateModalOpen.value = false;
  updateData.value = {
    id: "",
    date: "",
    sender: "",
    receiver: "",
    interact_bank: "",
    currency: "",
    amount: "",
    relatable_type: "",
    file: "",
  };
};
const onChangeUpdate = async () => {
  closeModal();
  await getAction();
};

// ── 4-page PRINT feature ───────────────────────────────────

/**
 * Build the full 4-page print HTML:
 *  PAGE 1 – Summary table (booking items with totals)
 *  PAGE 2 – Invoice (booking_confirm_letter images)
 *  PAGE 3 – Tax Credit (tax_credit images)
 *  PAGE 4 – Cash image slip
 */
const buildOutgoingPrintHtml = (
  detail,
  relatable,
  groupedItems,
  expenseItems,
  cashAmount,
  crm,
) => {
  const currency = detail.currency ?? "THB";

  // ── PAGE 2: Invoice images ──────────────────────────────
  const invoiceItems = relatable?.booking_confirm_letter ?? [];
  const invoicePages =
    invoiceItems.length > 0
      ? invoiceItems
          .map(
            (inv, idx) => `
      <div class="slip-page">
        <div class="slip-title">INVOICE${
          invoiceItems.length > 1
            ? ` (${idx + 1} of ${invoiceItems.length})`
            : ""
        }</div>
        <div class="slip-meta">
          <span><strong>Company:</strong> ${
            inv.meta?.company_legal_name ?? "—"
          }</span>
          <span><strong>Invoice No.:</strong> ${
            inv.meta?.invoice_number ?? "—"
          }</span>
          <span><strong>Date:</strong> ${inv.meta?.receipt_date ?? "—"}</span>
          <span><strong>Total:</strong> ${fmt(
            inv.meta?.total_after_tax,
          )} ${currency}</span>
          <span><strong>VAT:</strong> ${fmt(
            inv.meta?.total_tax_withold,
          )} ${currency}</span>
        </div>
        <div class="slip-img-wrap">
          ${
            inv.file
              ? `<img class="slip-img" src="${inv.file}" alt="Invoice ${
                  idx + 1
                }" />`
              : `<p class="no-img">No invoice image available.</p>`
          }
        </div>
      </div>`,
          )
          .join("")
      : `<div class="slip-page"><p class="no-img">No invoice available for this record.</p></div>`;

  // ── PAGE 3: Tax Credit images ───────────────────────────
  const taxCredits = relatable?.tax_credit ?? [];
  const taxPages =
    taxCredits.length > 0
      ? taxCredits
          .map(
            (tc, idx) => `
      <div class="slip-page">
        <div class="slip-title">TAX CREDIT${
          taxCredits.length > 1 ? ` (${idx + 1} of ${taxCredits.length})` : ""
        }</div>
        <div class="slip-meta">
          <span><strong>Company:</strong> ${tc.company_legal_name ?? "—"}</span>
          <span><strong>Invoice No.:</strong> ${tc.invoice_number ?? "—"}</span>
          <span><strong>Date:</strong> ${tc.receipt_date ?? "—"}</span>
          <span><strong>Before Tax:</strong> ${fmt(
            tc.total_tax_amount,
          )} ${currency}</span>
          <span><strong>Tax Withheld:</strong> ${fmt(
            tc.total_tax_withold,
          )} ${currency}</span>
          <span><strong>After Tax:</strong> ${fmt(
            tc.total_after_tax,
          )} ${currency}</span>
        </div>
        <div class="slip-img-wrap">
          ${
            tc.receipt_image
              ? `<img class="slip-img" src="${
                  tc.receipt_image
                }" alt="Tax Credit ${idx + 1}" />`
              : `<p class="no-img">No tax credit image available.</p>`
          }
        </div>
      </div>`,
          )
          .join("")
      : `<div class="slip-page"><p class="no-img">No tax credit available for this record.</p></div>`;

  // ── PAGE 4: Cash slip image ─────────────────────────────
  const cashImageUrl = detail.image ?? null;
  const page4 = `
    <div class="slip-page">
      <div class="slip-title">CASH SLIP</div>
      <div class="slip-meta">
        <span><strong>Date:</strong> ${detail.date ?? "—"}</span>
        <span><strong>Sender:</strong> ${detail.sender ?? "—"}</span>
        <span><strong>Receiver:</strong> ${detail.receiver ?? "—"}</span>
        <span><strong>Amount:</strong> ${fmt(cashAmount)} ${currency}</span>
      </div>
      <div class="slip-img-wrap">
        ${
          cashImageUrl
            ? `<img class="slip-img" src="${cashImageUrl}" alt="Cash slip" />`
            : `<p class="no-img">No cash slip image available.</p>`
        }
      </div>
    </div>`;

  const styles = `
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }

      @page {
        size: A4 portrait;
        margin: 0;
      }

      /* ── PAGE 1: Table page ── */
      .page {
        width: 210mm;
        height: 297mm;
        max-height: 297mm;
        overflow: hidden;
        padding: 16mm 20mm;
        page-break-after: always;
        page-break-inside: avoid;
        display: flex;
        flex-direction: column;
      }

      /* ── Image pages ── */
      .slip-page {
        width: 210mm;
        height: 297mm;
        max-height: 297mm;
        overflow: hidden;
        padding: 14mm 18mm;
        page-break-before: always;
        page-break-after: always;
        page-break-inside: avoid;
        display: flex;
        flex-direction: column;
      }

      .slip-page:last-child {
        page-break-after: avoid;
      }

      .slip-title {
        font-size: 16px;
        font-weight: 800;
        color: #111;
        margin-bottom: 10px;
        flex-shrink: 0;
      }

      .slip-meta {
        font-size: 11px;
        color: #555;
        margin-bottom: 10px;
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        flex-shrink: 0;
      }

      /* Image wrapper fills remaining space */
      .slip-img-wrap {
        flex: 1;
        min-height: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      .slip-img {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
        object-fit: contain;
        border: 1px solid #ddd;
        border-radius: 6px;
        display: block;
      }

      .no-img {
        color: #aaa;
        font-size: 13px;
        text-align: center;
      }

      /* ── Table page internals ── */
      .header-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
        gap: 24px;
        flex-shrink: 0;
      }

      .label {
        font-weight: 700;
        font-size: 10px;
        letter-spacing: .06em;
        margin-bottom: 4px;
        text-transform: uppercase;
        color: #666;
      }

      .val { font-size: 11px; line-height: 1.7; }

      table.items {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
        flex-shrink: 0;
      }

      table.items thead tr {
        border-top: 2px solid #111;
        border-bottom: 2px solid #111;
      }

      table.items th {
        padding: 6px 5px;
        font-size: 9px;
        font-weight: 700;
        letter-spacing: .07em;
        text-align: left;
      }

      table.items td {
        padding: 6px 5px;
        font-size: 10px;
        border-bottom: 1px solid #eee;
        vertical-align: top;
      }

      .total-section {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 3px;
        margin-top: 10px;
        padding-top: 10px;
        border-top: 2px solid #111;
        flex-shrink: 0;
      }

      .total-line {
        display: flex;
        gap: 40px;
        font-size: 11px;
        min-width: 300px;
        justify-content: flex-end;
      }

      .total-line span:last-child {
        min-width: 120px;
        text-align: right;
      }

      .total-line.grand {
        font-weight: 800;
        font-size: 13px;
        border-top: 1px solid #ddd;
        padding-top: 6px;
        margin-top: 3px;
      }

      .footer-note {
        margin-top: 16px;
        padding-top: 10px;
        border-top: 1px solid #eee;
        font-size: 10px;
        color: #aaa;
        flex-shrink: 0;
      }
    </style>`;

  return `${styles}${invoicePages}${taxPages}${page4}`;
};

// ── Open print ─────────────────────────────────────────────
const openOutgoingPrint = async (item) => {
  printLoading.value = item.id;
  try {
    const res = await cashImageStore.getDetailAction(item.id);
    const detail = res?.result ?? {};

    let relatable = detail.relatable ?? null;
    let groupedItems = detail.grouped_items ?? [];
    let expenseItems = relatable;

    // If BookingItemGroup, relatable is the group itself
    // If Booking, use relatable directly
    const cashAmount = Number(detail.amount ?? 0);
    const crm = detail.crm_id ?? item.crm_id ?? `#${item.id}`;

    const printHtml = buildOutgoingPrintHtml(
      detail,
      relatable,
      groupedItems,
      expenseItems,
      cashAmount,
      crm,
    );
    triggerOutgoingPrint(printHtml, crm);
  } catch (e) {
    console.error("Failed to load print detail", e);
    toast.error("Failed to load print data");
  } finally {
    printLoading.value = null;
  }
};

const triggerOutgoingPrint = (printHtml, crm) => {
  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed;top:0;left:0;width:0;height:0;border:none;";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Expense — ${crm}</title>
</head>
<body>
  <div id="print-content">${printHtml}</div>
  <script>
    window.onload = function() {
      var imgs = document.querySelectorAll('.slip-img');
      var total = imgs.length;
      if (total === 0) { window.print(); window.onafterprint = function() { window.close(); }; return; }
      var loaded = 0;
      imgs.forEach(function(img) {
        if (img.complete) { loaded++; if (loaded === total) { window.print(); window.onafterprint = function() { window.close(); }; } }
        else {
          img.onload = function() { loaded++; if (loaded === total) { window.print(); window.onafterprint = function() { window.close(); }; } };
          img.onerror = function() { loaded++; if (loaded === total) { window.print(); window.onafterprint = function() { window.close(); }; } };
        }
      });
    };
  <\/script>
</body>
</html>`);
  doc.close();
  iframe.contentWindow.onafterprint = () => {
    document.body.removeChild(iframe);
  };
};

// ── Lifecycle ──────────────────────────────────────────────
onMounted(async () => {
  if (route.query.month && route.query.year) {
    selectedMonth.value = parseInt(route.query.month);
    year.value = parseInt(route.query.year);
  }
  setMonthDateRange(selectedMonth.value, year.value);
});

watch(
  [
    date_range,
    filterType,
    senderSearch,
    crmSearch,
    amountSearch,
    per_page,
    sort_by,
    sort_order,
    invoice,
    invoiceTax,
  ],
  debounce(async () => {
    await getAction();
  }, 500),
);
</script>
