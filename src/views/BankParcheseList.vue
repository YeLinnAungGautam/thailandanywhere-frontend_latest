<template>
  <Layout :is_white="true" class="relative">
    <div
      :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
      class="space-x-8 col-span-3 flex justify-start items-center transition-all duration-200 gap-2 text-sm pb-4 absolute top-6"
    >
      <p
        class="text-2xl flex justify-start items-center font-medium text-[#FF613c]"
      >
        Bank Parchase
        <span
          class="w-2 h-2 mx-3 bg-[#FF613c] rounded-full inline-block"
        ></span>
        <span>{{ year }}</span>
        <span
          class="w-2 h-2 mx-3 bg-[#FF613c] rounded-full inline-block"
        ></span>
        <span>{{ monthArray.find((m) => m.id == selectedMonth)?.name }}</span>
      </p>
    </div>

    <div class="relative">
      <!-- Filters and Search -->
      <div class="pb-4 space-y-3 sticky -top-5 bg-white z-40">
        <div class="flex justify-start items-center space-x-2">
          <p
            @click="table_type = false"
            class="px-3 rounded-lg py-2 text-xs cursor-pointer"
            :class="
              !table_type ? 'bg-[#FF613c] text-white' : 'border border-gray-200'
            "
          >
            Cash View Table
          </p>
          <p
            @click="
              () => {
                invoice = 'tax_receipt_have';
                table_type = true;
              }
            "
            class="px-3 rounded-lg py-2 text-xs cursor-pointer"
            :class="
              table_type ? 'bg-[#FF613c] text-white' : 'border border-gray-200'
            "
          >
            Tax View Table
          </p>
          <div
            class="flex justify-center cursor-pointer items-center gap-x-2 bg-blue-600 rounded-lg text-xs text-white px-3 py-2"
            @click="goTaxMissingTable"
          >
            <p>Tax Report Table</p>
          </div>
        </div>
        <!-- Date and Type Filters -->
        <div class="flex justify-start space-x-2 items-center">
          <p
            v-if="!authStore.isExternalAudit"
            @click="filterType = 'all'"
            class="px-5 py-2.5 rounded-lg text-xs"
            :class="
              filterType == 'all'
                ? 'bg-[#FF613c] text-white'
                : ' border border-[#FF613x]'
            "
          >
            All
          </p>
          <select
            name=""
            class="px-3 text-black text-xs py-2 rounded-lg border border-gray-400/20 focus:outline-none"
            id=""
            v-model="invoice"
          >
            <option value="">Filter by Tax</option>
            <option value="tax_receipt_have">Have Tax Receipt</option>
            <option value="tax_receipt_missing">Non Tax Receipt</option>
          </select>
          <select
            name=""
            class="px-3 text-black text-xs py-2 rounded-lg border border-gray-400/20 focus:outline-none"
            id=""
            v-model="invoiceTax"
          >
            <option value="">Filter by Invoice</option>
            <option value="invoice_have">Have Invoice</option>
            <option value="invoice_missing">Non Invoice</option>
          </select>
          <YearPickerVue @year-change="handleYearChange" />
          <select
            v-model="selectedMonth"
            @change="handleMonthChange(selectedMonth)"
            class="px-3 text-black text-xs py-2 rounded-lg border border-gray-400/20 focus:outline-none"
          >
            <option :value="m.id" v-for="m in monthArray" :key="m.id">
              {{ m.name }}
            </option>
          </select>

          <div
            class="px-3 text-xs py-2 rounded-lg border border-gray-400/20 focus:outline-none bg-[#FF613c] text-white"
            @click="showExport = true"
          >
            <p>All CSV & PDF Feature</p>
          </div>

          <div
            class="flex justify-center items-center gap-x-2 bg-blue-600 rounded-lg text-xs text-white px-3 py-2"
            @click="openTaxModal"
          >
            <PlusIcon class="w-5 h-5 text-white" />
            <p>Create New Tax Receipt</p>
          </div>

          <TaxReceiptModal v-model="showTaxModal" @close="closeTaxModal" />
        </div>

        <!-- Search Filters -->
        <div class="flex space-x-2 items-center">
          <div class="relative">
            <input
              v-model="senderSearch"
              type="text"
              placeholder="Search by sender..."
              class="pl-3 pr-3 py-2 text-xs border border-gray-400/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20"
            />
          </div>
          <div class="relative">
            <input
              v-model="crmSearch"
              type="text"
              placeholder="Search by crm..."
              class="pl-3 pr-3 py-2 text-xs border border-gray-400/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20"
            />
          </div>

          <div class="relative">
            <input
              v-model="amountSearch"
              type="number"
              placeholder="Search by amount..."
              class="pl-3 pr-3 py-2 text-xs border border-gray-400/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20"
            />
          </div>
          <div class="relative" v-if="authStore.isSuperAdmin">
            <select
              name=""
              v-model="interactSearch"
              class="pl-3 pr-3 py-2 text-xs border border-gray-400/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20"
              id=""
            >
              <option value="">Search by interact bank</option>
              <option value="personal">Personal</option>
              <option value="company">Company</option>
              <option value="cash_at_office">Cash at Office</option>
              <option value="to_money_changer">To Money Changer</option>
              <option value="pay_to_driver">Pay to Driver</option>
            </select>
          </div>
          <div class="relative">
            <select
              name=""
              v-model="per_page"
              class="pl-3 pr-3 py-2 text-xs border border-gray-400/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20"
              id=""
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
              <option value="60">60</option>
              <option value="70">70</option>
              <option value="80">80</option>
              <option value="90">90</option>
              <option value="100">100</option>
            </select>
          </div>
          <div>
            <select
              name=""
              id=""
              v-model="sort_by"
              class="pl-3 pr-3 py-2 text-xs border border-gray-400/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="sender">Sender</option>
              <option value="receiver">Receiver</option>
            </select>
          </div>
          <div>
            <select
              name=""
              id=""
              v-model="sort_order"
              class="pl-3 pr-3 py-2 text-xs border border-gray-400/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
          <button
            @click="clearSearch"
            class="px-3 py-2 text-xs bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <!-- Mobile Card Layout -->
      <div>
        <div v-if="loading" class="text-center py-10">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF613c]"
          ></div>
          <p class="mt-2 text-gray-600">Loading transactions...</p>
        </div>
        <div
          v-else-if="!cashImages?.data || cashImages.data.length === 0"
          class="text-center py-10"
        >
          <div class="text-gray-400 text-6xl mb-4">📄</div>
          <p class="text-gray-600">No receipts found</p>
        </div>
        <div
          v-if="
            cashImages?.data &&
            !table_type &&
            cashImages?.data.length > 0 &&
            !loading
          "
          class="overflow-x-auto"
        >
          <table class="w-full text-xs border border-gray-500">
            <thead class="border border-gray-500">
              <tr class="bg-gray-200 divide-x divide-gray-500">
                <th class="text-xs text-center font-medium py-3 w-[100px]">
                  TR.Date
                </th>
                <th class="text-xs text-center font-medium py-3 w-[100px]">
                  EXP Number
                </th>
                <th class="text-xs text-center font-medium py-3 w-[100px]">
                  Company
                </th>
                <th class="text-xs text-center font-medium py-3 w-[100px]">
                  S.Total Value
                </th>
                <th class="text-xs text-center font-medium py-3 w-[100px]">
                  S.Amount VAT
                </th>
                <th class="text-xs text-center font-medium py-3 w-[100px]">
                  I.Total Value
                </th>
                <th class="text-xs text-center font-medium py-3 w-[100px]">
                  I.Amount VAT
                </th>
                <th class="text-xs text-center font-medium py-3 w-[100px]">
                  C.Total Value
                </th>
                <th class="text-xs text-center font-medium py-3 w-[100px]">
                  C.Amount VAT
                </th>
                <th class="text-xs text-center font-medium py-3 w-[100px]">
                  Hotel
                </th>
                <th class="text-xs text-center font-medium py-3 w-[100px]">
                  Attraction
                </th>
                <th class="text-xs text-center font-medium py-3 w-[100px]">
                  Cash Amount
                </th>
                <th class="text-xs text-center font-medium py-3 w-[100px]">
                  Deposit Count
                </th>
                <th class="text-xs text-center font-medium py-3 w-[100px]">
                  DateTime
                </th>
                <th class="text-xs text-center font-medium py-3 w-[100px]">
                  Crm Number
                </th>
                <th class="text-xs text-center font-medium py-3 w-[100px]">
                  Invoice
                </th>
                <th class="text-xs text-center font-medium py-3 w-[100px]">
                  Tax Credit
                </th>
              </tr>
            </thead>
            <tbody>
              <template
                v-for="(item, index) in cashImages?.data"
                :key="item.id"
              >
                <!-- Main transaction row -->
                <tr
                  class="bg-gray-50 odd:bg-white group relative divide-x divide-gray-500 hover:bg-gray-100 cursor-pointer"
                  :class="
                    expandedItems[item.id] ? 'border border-[#FF613c]' : ''
                  "
                  @click="toggleExpand(item.id)"
                >
                  <td class="px-3 py-2 text-xs text-center whitespace-nowrap">
                    {{ formatDateForTime(item?.date) }}

                    <!-- Action buttons - moved inside a table cell -->
                  </td>
                  <td class="px-3 py-2 text-xs text-center">
                    {{ "EXP" + "0" + selectedMonth + "000" + (index + 1) }}
                  </td>
                  <td class="px-3 py-2 text-xs text-center min-w-[200px]">
                    {{ item?.relatable?.items[0]?.product?.legal_name }}
                  </td>
                  <td class="px-3 py-2 text-xs text-end">
                    <p
                      v-if="
                        item.relatable_type == 'App\\Models\\BookingItemGroup'
                      "
                    >
                      {{ getTotalValue(item?.relatable?.items) }}
                    </p>
                    <p v-else></p>
                  </td>
                  <td class="px-3 py-2 text-xs w-[80px]">
                    {{ item.vat ? formattedNumber(item.vat.toFixed(2)) : "-" }}
                  </td>
                  <td class="px-3 py-2 text-xs w-[80px]">
                    {{
                      calculateInvoiceTotal(
                        item?.relatable?.booking_confirm_letter
                      )
                    }}
                  </td>
                  <td class="px-3 py-2 text-xs w-[80px]">
                    {{
                      calculateInvoiceVat(
                        item?.relatable?.booking_confirm_letter
                      )
                    }}
                  </td>
                  <td class="px-3 py-2 text-xs w-[80px]">
                    {{ calculateTaxTotal(item?.relatable?.tax_credit) }}
                  </td>
                  <td class="px-3 py-2 text-xs w-[80px]">
                    {{ calculateTaxVAT(item?.relatable?.tax_credit) }}
                  </td>
                  <td class="px-3 py-2 text-xs">
                    {{
                      item?.relatable?.product_type == "App\\Models\\Hotel"
                        ? "✓"
                        : "-"
                    }}
                  </td>
                  <td class="px-3 py-2 text-xs">
                    {{
                      item?.relatable?.product_type ==
                      "App\\Models\\EntranceTicket"
                        ? "✓"
                        : "-"
                    }}
                  </td>
                  <td class="px-3 py-2 text-xs">
                    {{ item?.amount }}
                  </td>
                  <td class="px-3 py-2 text-xs">final deposit</td>
                  <td class="px-3 py-2 text-xs whitespace-nowrap">
                    {{ formatDateForTime(item?.date) }} ,
                    {{ formatTime(item?.date) }}
                  </td>
                  <td class="px-3 py-2 text-xs whitespace-nowrap">
                    {{ item?.crm_id }}
                  </td>

                  <td class="px-3 py-2 text-xs whitespace-nowrap">
                    <!-- {{ item?.has_invoice ? "✓" : "-" }} -->
                    <CheckBadgeIcon
                      v-if="item?.has_invoice"
                      class="h-5 w-5 text-green-500"
                    />
                  </td>
                  <td class="px-3 py-2 text-xs whitespace-nowrap">
                    <!-- {{ item?.tax_receipts?.length > 0 ? "✓" : "-" }} -->
                    <CheckBadgeIcon
                      v-if="item?.tax_receipts?.length > 0"
                      class="h-5 w-5 text-green-500"
                    />
                  </td>
                </tr>

                <!-- Loading row -->
                <tr v-if="loadingDetails[item?.id]">
                  <td colspan="17" class="px-3 py-4 text-center">
                    <div class="flex justify-center items-center">
                      <div
                        class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FF613c]"
                      ></div>
                      <span class="ml-2 text-sm text-gray-600"
                        >Loading details...</span
                      >
                    </div>
                  </td>
                </tr>

                <!-- Expanded details row -->
                <tr
                  v-if="
                    expandedItems[item.id] &&
                    !loadingDetails[item.id] &&
                    getRelatableData(item.id)
                  "
                >
                  <td colspan="17" class="p-0">
                    <div class="bg-gray-50 pb-4 px-4">
                      <div class="w-full flex justify-end items-center py-2">
                        <div
                          class="bg-white/90 max-w-[100px] px-2 shadow-lg border border-gray-200 py-1 rounded-2xl backdrop-blur-sm flex items-center justify-center space-x-2"
                        >
                          <button
                            v-if="!authStore.isExternalAudit"
                            @click.stop="goToView(item)"
                            class="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <MagnifyingGlassIcon class="w-4 h-4" />
                          </button>
                          <button
                            @click.stop="update(item)"
                            class="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <PencilSquareIcon
                              class="w-4 h-4"
                              v-if="!authStore.isExternalAudit"
                            />
                            <EyeIcon class="w-4 h-4 text-blue-600" v-else />
                          </button>
                        </div>
                      </div>
                      <table
                        class="min-w-full"
                        v-if="
                          item?.relatable_type == 'App\\Models\\Booking' ||
                          item?.relatable_type ==
                            'App\\Models\\BookingItemGroup'
                        "
                      >
                        <!-- Table Header -->
                        <thead class="bg-gray-50">
                          <tr class="bg-[#FF613c] divide-x divide-gray-50">
                            <th
                              class="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider text-start"
                            >
                              List
                            </th>
                            <th
                              class="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider text-end"
                            >
                              Product Variation
                            </th>
                            <th
                              class="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider text-end"
                            >
                              Price
                            </th>
                            <th
                              class="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider text-end"
                            >
                              VAT (7%)
                            </th>
                            <th
                              class="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider text-end"
                            >
                              Slip
                            </th>
                            <th
                              class="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider text-end"
                            >
                              Invoice
                            </th>
                            <th
                              class="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider text-end"
                            >
                              Tax Credit
                            </th>
                          </tr>
                        </thead>

                        <!-- Table Body -->
                        <tbody
                          class="bg-white divide-y divide-gray-200"
                          v-if="item.relatable_type == 'App\\Models\\Booking'"
                        >
                          <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-start">
                              <span
                                class="text-xs font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded"
                              >
                                Total Sale
                              </span>
                            </td>
                            <td
                              class="px-6 py-4 whitespace-nowrap text-end w-[200px]"
                            >
                              <span class="text-xs font-mono px-2 py-1 rounded"
                                >-</span
                              >
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-end">
                              <span class="text-xs font-mono px-2 py-1 rounded">
                                {{
                                  formattedNumber(
                                    getRelatableData(item.id)?.grand_total
                                  )
                                }}
                              </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-end">
                              <span class="text-xs font-mono px-2 py-1 rounded">
                                {{
                                  formattedNumber(
                                    getRelatableData(item.id)?.output_vat
                                  )
                                }}
                              </span>
                            </td>
                            <td
                              class="px-6 py-4 whitespace-nowrap text-end cursor-pointer"
                              @click="show(getRelatableData(item.id)?.receipts)"
                            >
                              <span
                                class="text-xs underline text-blue-600 font-mono px-2 py-1 rounded"
                              >
                                sale slip ({{
                                  getRelatableData(item.id)?.receipts?.length ||
                                  0
                                }})
                              </span>
                            </td>
                            <td
                              class="px-6 py-4 whitespace-nowrap text-end cursor-pointer"
                              @click="openCredit(getRelatableData(item.id)?.id)"
                            >
                              <span
                                class="text-xs underline text-blue-600 font-mono px-2 py-1 rounded"
                              >
                                tax Invoice
                              </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-end">
                              <span
                                class="text-xs underline text-blue-600 font-mono px-2 py-1 rounded"
                                >-</span
                              >
                            </td>
                          </tr>

                          <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-start">
                              <span
                                class="text-xs font-mono text-gray-900 bg-red-100 px-2 py-1 rounded"
                              >
                                Deduct Commission
                              </span>
                            </td>
                            <td
                              class="px-6 py-4 whitespace-nowrap text-end w-[200px]"
                            >
                              <span
                                class="text-xs font-mono px-2 py-1 rounded"
                              ></span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-end">
                              <span class="text-xs font-mono px-2 py-1 rounded">
                                -
                                {{
                                  formattedNumber(
                                    getRelatableData(item.id)?.commission
                                  )
                                }}
                              </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-end">
                              <span class="text-xs font-mono px-2 py-1 rounded"
                                >-</span
                              >
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-end">
                              <span class="text-xs font-mono px-2 py-1 rounded"
                                >-</span
                              >
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-end">
                              <span class="text-xs font-mono px-2 py-1 rounded"
                                >-</span
                              >
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-end">
                              <span class="text-xs font-mono px-2 py-1 rounded"
                                >-</span
                              >
                            </td>
                          </tr>

                          <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-start">
                              <span
                                class="text-xs font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded"
                              >
                                Subtotal
                              </span>
                            </td>
                            <td
                              class="px-6 py-4 whitespace-nowrap text-end w-[200px]"
                            >
                              <span
                                class="text-xs font-mono px-2 py-1 rounded"
                              ></span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-end">
                              <span class="text-xs font-mono px-2 py-1 rounded">
                                {{
                                  formattedNumber(
                                    getRelatableData(item.id)?.grand_total -
                                      getRelatableData(item.id)?.commission
                                  )
                                }}
                              </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-end">
                              <span class="text-xs font-mono px-2 py-1 rounded">
                                {{
                                  formattedNumber(
                                    (
                                      getRelatableData(item.id)?.grand_total -
                                      getRelatableData(item.id)?.commission -
                                      (getRelatableData(item.id)?.grand_total -
                                        getRelatableData(item.id)?.commission) /
                                        1.07
                                    ).toFixed(2)
                                  )
                                }}
                              </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-end">
                              <span class="text-xs font-mono px-2 py-1 rounded"
                                >-</span
                              >
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-end">
                              <span class="text-xs font-mono px-2 py-1 rounded"
                                >-</span
                              >
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-end">
                              <span class="text-xs font-mono px-2 py-1 rounded"
                                >-</span
                              >
                            </td>
                          </tr>

                          <!-- Grouped items -->
                          <tr
                            v-for="v in getGroupedItems(item.id)"
                            :key="v.group_id"
                          >
                            <td class="px-6 py-4 whitespace-nowrap text-start">
                              <div class="text-xs font-mono flex flex-wrap">
                                <span
                                  @click="goToGroup(v)"
                                  class="text-gray-900 bg-blue-100 px-2 mr-2 py-1 rounded cursor-pointer"
                                >
                                  Group
                                </span>
                                <span
                                  v-for="i in v.items"
                                  class="text-gray-900 bg-gray-100 px-2 py-1 rounded mr-2"
                                  :key="i.id"
                                >
                                  {{ i.crm_id.split("_")[1] }}
                                </span>
                              </div>
                            </td>
                            <td
                              class="px-6 py-4 whitespace-nowrap text-end w-[200px]"
                            >
                              <span class="text-xs font-mono px-2 py-1 rounded">
                                {{ v.items[0]?.product_name }}
                              </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-end">
                              <span class="text-xs font-mono px-2 py-1 rounded">
                                {{ formattedNumber(totalCost(v.items)) }}
                              </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-end">
                              <span class="text-xs font-mono px-2 py-1 rounded">
                                {{
                                  formattedNumber(
                                    (
                                      totalCost(v.items) -
                                      totalCost(v.items) / 1.07
                                    ).toFixed(2)
                                  )
                                }}
                              </span>
                            </td>
                            <td
                              class="px-6 py-4 whitespace-nowrap text-end cursor-pointer"
                              @click="
                                v.related_slip.length > 0 &&
                                  show(v.related_slip)
                              "
                            >
                              <span
                                class="text-xs font-mono px-2 py-1 rounded"
                                :class="
                                  v.related_slip.length > 0
                                    ? 'text-blue-600 underline'
                                    : 'text-red-600 font-medium'
                                "
                              >
                                {{
                                  v.related_slip.length > 0
                                    ? "slip (" + v.related_slip.length + ")"
                                    : "missing"
                                }}
                              </span>
                            </td>
                            <td
                              class="px-6 py-4 whitespace-nowrap text-end cursor-pointer"
                              @click="
                                v.related_tax.length > 0 &&
                                  showTax(v.related_tax)
                              "
                            >
                              <span
                                class="text-xs font-mono px-2 py-1 rounded"
                                :class="
                                  v.related_tax.length > 0
                                    ? 'text-blue-600 underline'
                                    : 'text-red-600 font-medium'
                                "
                              >
                                {{
                                  v.related_tax.length > 0
                                    ? "Invoice (" + v.related_tax.length + ")"
                                    : "missing"
                                }}
                              </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-end">
                              <span
                                :class="
                                  v.related_credit.length > 0
                                    ? ''
                                    : 'text-red-600 font-medium'
                                "
                                class="text-xs text-blue-500 underline font-mono px-2 py-1 rounded"
                                @click="showCredit(v.related_credit)"
                              >
                                {{
                                  v.related_credit.length > 0
                                    ? "Credit (" + v.related_credit.length + ")"
                                    : "missing"
                                }}
                              </span>
                            </td>
                          </tr>

                          <!-- Net Summary Row -->
                          <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-start">
                              <span
                                class="text-xs font-mono text-gray-900 bg-blue-100 px-2 py-1 rounded"
                              >
                                Net Summary
                              </span>
                            </td>
                            <td
                              class="px-6 py-4 whitespace-nowrap text-end w-[200px]"
                            >
                              <span
                                class="text-xs font-mono px-2 py-1 rounded"
                              ></span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-end">
                              <span class="text-xs font-mono px-2 py-1 rounded">
                                {{
                                  formattedNumber(
                                    calculateGrandVat(
                                      getRelatableData(item.id)?.items,
                                      getRelatableData(item.id)?.grand_total
                                    ) - getRelatableData(item.id)?.commission
                                  )
                                }}
                              </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-end">
                              <span class="text-xs font-mono px-2 py-1 rounded">
                                {{
                                  formattedNumber(
                                    (
                                      getRelatableData(item.id)?.commission -
                                      getRelatableData(item.id)?.commission /
                                        1.07
                                    ).toFixed(2)
                                  )
                                }}
                              </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-end">
                              <span class="text-xs font-mono px-2 py-1 rounded"
                                >-</span
                              >
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-end">
                              <span class="text-xs font-mono px-2 py-1 rounded"
                                >-</span
                              >
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-end">
                              <span class="text-xs font-mono px-2 py-1 rounded"
                                >-</span
                              >
                            </td>
                          </tr>
                        </tbody>
                        <tbody
                          v-if="
                            item.relatable_type ==
                            'App\\Models\\BookingItemGroup'
                          "
                          class="bg-white divide-y divide-gray-200"
                        >
                          <!-- {{
                              getExpenseItems(item.id)
                            }} -->
                          <tr>
                            <td
                              class="px-6 py-4 w-[200px] whitespace-nowrap text-start"
                            >
                              <div
                                class="text-xs flex justify-start items-center flex-wrap gap-2 font-mono rounded-md"
                              >
                                <span
                                  @click="goToGroup(getExpenseItems(item.id))"
                                  class="text-gray-900 bg-blue-100 px-2 mr-2 py-1 rounded cursor-pointer"
                                >
                                  Group
                                </span>
                                <span
                                  class="text-xs font-mono px-2 py-1 bg-gray-200 rounded"
                                  v-for="a in getExpenseItems(item.id)?.items"
                                  :key="a.id"
                                >
                                  {{ a?.crm_id.split("_")[1] }}
                                </span>
                              </div>
                            </td>

                            <td class="px-6 py-4 whitespace-normal text-end">
                              <p class="text-xs font-mono px-2 py-1 rounded">
                                {{
                                  getExpenseItems(item.id)?.items[0]?.product
                                    ?.name
                                }}
                                /
                                <span
                                  class="text-blue-600"
                                  v-for="a in getExpenseItems(item.id)?.items"
                                  :key="a.id"
                                >
                                  S: {{ a.service_date }}, </span
                                >/
                                <span
                                  class="text-red-600"
                                  v-for="a in getExpenseItems(item.id)?.items"
                                  :key="a.id"
                                >
                                  Q: {{ a.quantity }},
                                </span>
                              </p>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-end">
                              <span class="text-xs font-mono px-2 py-1 rounded">
                                {{
                                  formattedNumber(
                                    getExpenseItems(item.id)?.items.reduce(
                                      (total, a) => {
                                        return total + a.total_cost_price;
                                      },
                                      0
                                    )
                                  )
                                }}
                              </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-end">
                              <span class="text-xs font-mono px-2 py-1 rounded">
                                {{
                                  formattedNumber(
                                    getExpenseItems(item.id)?.items.reduce(
                                      (total, a) => {
                                        return total + a.output_vat;
                                      },
                                      0
                                    )
                                  )
                                }}
                              </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-end">
                              <span
                                class="text-xs text-blue-500 underline font-mono px-2 py-1 rounded"
                                @click="
                                  viewReceipt(detailedItems[item.id]?.image)
                                "
                              >
                                slip
                              </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-end">
                              <span
                                :class="
                                  getRelatableData(item.id)
                                    ?.booking_confirm_letter.length > 0
                                    ? 'text-blue-500 underline'
                                    : 'text-red-500'
                                "
                                class="text-xs font-mono px-2 py-1 rounded"
                                @click="
                                  showTax(
                                    getRelatableData(item.id)
                                      ?.booking_confirm_letter
                                  )
                                "
                              >
                                {{
                                  getRelatableData(item.id)
                                    ?.booking_confirm_letter.length > 0
                                    ? "tax"
                                    : "missing"
                                }}
                              </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-end">
                              <span
                                :class="
                                  getRelatableData(item.id)?.tax_credit.length >
                                  0
                                    ? 'text-blue-500 underline'
                                    : 'text-orange-500'
                                "
                                class="text-xs bg-orange-200 font-mono px-2 py-1 rounded cursor-pointer"
                                @click="
                                  getRelatableData(item.id)?.tax_credit.length >
                                  0
                                    ? showCredit(
                                        getRelatableData(item.id)?.tax_credit
                                      )
                                    : addTaxReceipt(getRelatableData(item.id))
                                "
                              >
                                {{
                                  getRelatableData(item.id)?.tax_credit.length >
                                  0
                                    ? "credit"
                                    : "add credit"
                                }}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div
          v-if="
            cashImages?.data &&
            table_type &&
            cashImages?.data.length > 0 &&
            !loading
          "
          class="overflow-x-auto"
        >
          <table class="w-full text-xs border border-gray-500">
            <thead class="border border-gray-500">
              <tr class="bg-gray-200 divide-x divide-gray-500">
                <th class="text-xs text-center font-medium py-3 w-[100px]">
                  TR.Datetime
                </th>
                <th class="text-xs text-center font-medium py-3 w-[100px]">
                  EXP Number
                </th>
                <th class="text-xs text-center font-medium py-3 w-[100px]">
                  Cash Amount
                </th>
                <th class="text-xs text-center font-medium py-3 w-[100px]">
                  Tax Receipt Number
                </th>
                <th class="text-xs text-center font-medium py-3 w-[100px]">
                  Tax Receipt Date
                </th>
                <th class="text-xs text-center font-medium py-3 w-[100px]">
                  Supplier Name
                </th>
                <th class="text-xs text-center font-medium py-3 w-[100px]">
                  Order Description
                </th>
                <th class="text-xs text-center font-medium py-3 w-[100px]">
                  Sale Value
                </th>
                <th class="text-xs text-center font-medium py-3 w-[100px]">
                  VAT Value
                </th>
                <th class="text-xs text-center font-medium py-3 w-[100px]">
                  CRM ID
                </th>
                <th class="text-xs text-center font-medium py-3 w-[100px]">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in cashImages?.data"
                :key="item.id"
                class="bg-gray-50 odd:bg-white group relative divide-x divide-gray-500 hover:bg-gray-100 cursor-pointer"
              >
                <td class="text-xs whitespace-nowrap text-center px-3 py-3">
                  {{ formatDateForTime(item?.date) }},
                  {{ formatTime(item?.date) }}
                </td>
                <td class="px-3 py-2 text-xs text-center">
                  {{ "EXP" + "0" + selectedMonth + "000" + (index + 1) }}
                </td>
                <td class="text-xs text-center py-3">
                  {{ item.amount }}
                </td>
                <td class="text-xs text-center py-3">
                  {{ item.relatable?.tax_credit[0]?.invoice_number ?? "N/A" }}
                </td>
                <td class="text-xs text-center py-3">
                  {{ item.relatable?.tax_credit[0]?.receipt_date }}
                </td>
                <td class="text-xs text-center py-3">
                  {{ item.relatable?.items[0]?.product?.vat_name ?? "N/A" }}
                </td>
                <td class="text-xs text-center py-3">
                  {{ item.relatable?.items[0]?.product_type.split("\\")[2] }}
                </td>
                <td class="text-xs text-center py-3">
                  {{ item.relatable?.tax_credit[0]?.total_after_tax }}
                </td>
                <td class="text-xs text-center py-3">
                  {{ item.relatable?.tax_credit[0]?.total_tax_withold }}
                </td>
                <td class="px-3 py-2 text-xs whitespace-nowrap">
                  {{ item?.crm_id }}
                </td>
                <td class="px-3 py-2 text-xs whitespace-nowrap">
                  <!-- {{ item?.has_invoice ? "✓" : "-" }} -->
                  <CheckBadgeIcon
                    v-if="item?.has_invoice"
                    class="h-5 w-5 text-green-500"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-8">
          <Pagination
            v-if="!loading && cashImages?.data?.length > 0"
            :data="cashImages"
            @change-page="changePage"
          />
        </div>
      </div>
    </div>

    <!-- Modals -->
    <Modal :isOpen="placeholderFile != ''" @closeModal="placeholderFile = ''">
      <DialogPanel
        class="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-5"
        >
          Receipt
        </DialogTitle>
        <div>
          <img :src="placeholderFile" alt="Receipt" class="w-full rounded-lg" />
        </div>
      </DialogPanel>
    </Modal>

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
            <!-- Left column for image -->
            <div
              class="flex items-center justify-center bg-gray-100 rounded-lg"
            >
              <img
                :src="
                  showData[currentIndex].image.includes(
                    'https://thanywhere.sgp1.cdn.digitaloceanspaces.com/images'
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

            <!-- Right column for data -->
            <div class="pb-4">
              <div>
                <div class="mt-2 space-y-4 text-sm">
                  <div class="space-y-2">
                    <p class="">Amount:</p>
                    <p class="text-base font-medium">
                      {{ showData[currentIndex].amount }}
                      {{ showData[currentIndex].currency }}
                    </p>
                  </div>
                  <div class="space-y-2">
                    <p class="">Date:</p>
                    <p class="text-base font-medium">
                      {{ showData[currentIndex].date }}
                    </p>
                  </div>
                  <div class="space-y-2">
                    <p class="">Sender:</p>
                    <p class="text-base font-medium">
                      {{ showData[currentIndex].sender }}
                    </p>
                  </div>
                  <div class="space-y-2">
                    <p class="">Receiver:</p>
                    <p class="text-base font-medium">
                      {{ showData[currentIndex].receiver }}
                    </p>
                  </div>
                  <div class="space-y-2">
                    <p class="">Bank:</p>
                    <p class="text-base font-medium">
                      {{ showData[currentIndex].interact_bank }}
                    </p>
                  </div>
                  <div class="space-y-2">
                    <p class="">Created At:</p>
                    <p class="text-base font-medium">
                      {{ showData[currentIndex].created_at }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination controls -->
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

            <span class="text-sm">
              {{ currentIndex + 1 }} of {{ showData.length }}
            </span>

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
            <!-- Left column for image -->
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

            <!-- Right column for data -->
            <div class="space-y-3">
              <div class="pb-4 px-3">
                <h3 class="font-semibold text-gray-700 mb-4">Details</h3>

                <div class="space-y-3 text-sm">
                  <div class="space-y-2">
                    <p class="">Company Legal Name:</p>
                    <p class="text-base font-medium">
                      {{ taxData[currentIndex2]?.meta?.company_legal_name }}
                    </p>
                  </div>

                  <div class="space-y-2">
                    <p class="">Invoice Number:</p>
                    <p class="text-base font-medium">
                      {{ taxData[currentIndex2]?.meta?.invoice_number }}
                    </p>
                  </div>

                  <div class="space-y-2">
                    <p class="">Product Name:</p>
                    <p class="text-base font-medium">
                      {{ taxData[currentIndex2]?.meta?.product_name }}
                    </p>
                  </div>

                  <div class="space-y-2">
                    <p class="">Receipt Date:</p>
                    <p class="text-base font-medium">
                      {{ taxData[currentIndex2]?.meta?.receipt_date }}
                    </p>
                  </div>

                  <div class="space-y-2">
                    <p class="">Service Start Date:</p>
                    <p class="text-base font-medium">
                      {{ taxData[currentIndex2]?.meta?.service_start_date }}
                    </p>
                  </div>

                  <div class="space-y-2">
                    <p class="">Service End Date:</p>
                    <p class="text-base font-medium">
                      {{ taxData[currentIndex2]?.meta?.service_end_date }}
                    </p>
                  </div>
                  <div class="space-y-2">
                    <p class="">Total Before Tax:</p>
                    <p class="text-base font-medium">
                      {{ taxData[currentIndex2]?.meta?.total_tax_amount }}
                    </p>
                  </div>
                  <div class="space-y-2">
                    <p class="">Total Tax Withheld:</p>
                    <p class="text-base font-medium">
                      {{ taxData[currentIndex2]?.meta?.total_tax_withold }}
                    </p>
                  </div>
                  <div class="space-y-2">
                    <p class="">Total After Tax:</p>
                    <p class="text-base font-medium">
                      {{ taxData[currentIndex2]?.meta?.total_after_tax }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination controls -->
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

            <span class="text-sm">
              {{ currentIndex2 + 1 }} of {{ taxData.length }}
            </span>

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
    <Modal :isOpen="IsCredit" @closeModal="showCreditOff">
      <DialogPanel
        class="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white/95 backdrop-blur-md text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-3 px-4 rounded-t-xl"
        >
          <span class="uppercase">Credit Receipt </span>
          <div class="flex justify-end items-center gap-x-2">
            <p
              class="bg-blue-500 px-2 py-1 rounded"
              @click="editCredit(creditData[currentIndex2]?.id)"
            >
              Go Tax Credit
            </p>
          </div>
        </DialogTitle>

        <div class="p-4">
          <div v-if="creditData.length > 0" class="grid grid-cols-2 gap-4">
            <!-- Left column for image -->
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

            <!-- Right column for data -->
            <div class="space-y-3">
              <div class="pb-4 px-3">
                <h3 class="font-semibold text-gray-700 mb-4">Details</h3>

                <div class="space-y-3 text-sm">
                  <div class="space-y-2">
                    <p class="">Company Legal Name:</p>
                    <p class="text-base font-medium">
                      {{ creditData[currentIndex2]?.company_legal_name }}
                    </p>
                  </div>

                  <div class="space-y-2">
                    <p class="">Invoice Number:</p>
                    <p class="text-base font-medium">
                      {{ creditData[currentIndex2]?.invoice_number }}
                    </p>
                  </div>

                  <div class="space-y-2">
                    <p class="">Product Name:</p>
                    <p class="text-base font-medium">
                      {{ creditData[currentIndex2]?.product?.name }}
                    </p>
                  </div>

                  <div class="space-y-2">
                    <p class="">Receipt Date:</p>
                    <p class="text-base font-medium">
                      {{ creditData[currentIndex2]?.receipt_date }}
                    </p>
                  </div>

                  <div class="space-y-2">
                    <p class="">Service Start Date:</p>
                    <p class="text-base font-medium">
                      {{ creditData[currentIndex2]?.service_start_date }}
                    </p>
                  </div>

                  <div class="space-y-2">
                    <p class="">Service End Date:</p>
                    <p class="text-base font-medium">
                      {{ creditData[currentIndex2]?.service_end_date }}
                    </p>
                  </div>
                  <div class="space-y-2">
                    <p class="">Total Before Tax:</p>
                    <p class="text-base font-medium">
                      {{ creditData[currentIndex2]?.total_tax_amount }}
                    </p>
                  </div>
                  <div class="space-y-2">
                    <p class="">Total Tax Withheld:</p>
                    <p class="text-base font-medium">
                      {{ creditData[currentIndex2]?.total_tax_withold }}
                    </p>
                  </div>
                  <div class="space-y-2">
                    <p class="">Total After Tax:</p>
                    <p class="text-base font-medium">
                      {{ creditData[currentIndex2]?.total_after_tax }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination controls -->
          <div class="flex justify-between items-center gap-x-2 pt-2">
            <div
              v-if="creditData.length > 1"
              class="flex justify-between items-center mt-4"
            >
              <button
                @click="prev2Item"
                :disabled="currentIndex2 === 0"
                class="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
              >
                &lt; Previous
              </button>

              <span class="text-sm">
                {{ currentIndex2 + 1 }} of {{ creditData.length }}
              </span>

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
              class="bg-red-600 px-2 py-1.5 text-white text-sm rounded"
              @click="deleteCredit(creditData[currentIndex2]?.id)"
            >
              Delete Tax Credit
            </p>
          </div>
        </div>
      </DialogPanel>
    </Modal>

    <!-- Add this modal after your existing showPdfModal -->

    <!-- Batch PDF Modal -->
    <Modal :isOpen="showBatchModal" @closeModal="closeBatchModal">
      <DialogPanel
        class="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 p-4 border-b bg-[#FF613c] text-white rounded-t-xl"
        >
          PDF Batch Generation
        </DialogTitle>

        <div class="p-6">
          <!-- Progress Section -->
          <div v-if="isBatchProcessing" class="space-y-4">
            <div class="text-center">
              <div class="text-sm text-gray-600 mb-2">
                {{ batchStatus.message }}
              </div>

              <!-- Progress Bar -->
              <div class="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  class="bg-[#FF613c] h-3 rounded-full transition-all duration-300"
                  :style="{ width: batchStatus.progress + '%' }"
                ></div>
              </div>

              <div class="text-sm text-gray-500">
                {{ batchStatus.progress }}%
              </div>
            </div>

            <!-- Batch Info -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="flex justify-between text-sm">
                <span>Completed Batches:</span>
                <span class="font-medium">
                  {{ batchStatus.completed_batches }} /
                  {{ batchStatus.total_batches }}
                </span>
              </div>
              <div class="flex justify-between text-sm mt-1">
                <span>Status:</span>
                <span class="font-medium text-blue-600"> လုပ်နေတယ် </span>
              </div>
            </div>
          </div>

          <!-- Completed Files Section -->
          <div v-if="batchStatus.batch_files.length > 0" class="mt-6">
            <h4
              class="text-md font-medium text-gray-900 mb-3 flex items-center"
            >
              <svg
                class="w-5 h-5 mr-2 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              ပြီးသွားတဲ့ PDF Files ({{ batchStatus.batch_files.length }})
            </h4>

            <div class="space-y-2 max-h-60 overflow-y-auto">
              <div
                v-for="(file, index) in batchStatus.batch_files"
                :key="index"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div class="flex-1">
                  <div class="font-medium text-sm text-gray-900">
                    Batch {{ file.batch_number }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ file.item_count }} items •
                    {{ parchasePDFStore.formatFileSize(file.size) }}
                  </div>
                  <div class="text-xs text-gray-400">
                    {{
                      file.generated_at
                        ? new Date(file.generated_at).toLocaleString()
                        : ""
                    }}
                  </div>
                </div>

                <button
                  @click="downloadBatchFile(file)"
                  class="ml-3 px-3 py-1 bg-[#FF613c] text-white text-xs rounded hover:bg-[#e55139] transition-colors"
                >
                  📄 Download
                </button>
              </div>
            </div>
          </div>

          <!-- Completion Message -->
          <div
            v-if="isBatchCompleted"
            class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <div class="flex items-center">
              <svg
                class="w-6 h-6 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              <div>
                <h4 class="text-green-800 font-medium">အားလုံး ပြီးပါပြီ!</h4>
                <p class="text-green-700 text-sm">
                  {{ batchStatus.total_batches }} batches successfully
                  generated. အပေါ်မှာ files တွေ download လုပ်နိုင်ပါတယ်။
                </p>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div
            v-if="isBatchFailed"
            class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div class="flex items-center">
              <svg
                class="w-6 h-6 text-red-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <div>
                <h4 class="text-red-800 font-medium">အမှားဖြစ်ပါတယ်</h4>
                <p class="text-red-700 text-sm">{{ batchStatus.message }}</p>
              </div>
            </div>

            <div class="mt-3 flex space-x-2">
              <button
                @click="handleBatchRetry()"
                class="px-4 py-2 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition-colors"
              >
                🔄 Try Again
              </button>
            </div>
          </div>

          <!-- Initial State -->
          <div v-if="batchStatus.status === 'idle'" class="text-center py-8">
            <div class="text-gray-400 text-4xl mb-2">📄</div>
            <p class="text-gray-600">Ready to generate PDF batches</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t bg-gray-50 rounded-b-xl">
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-500">Job ID: {{ batchJobId }}</div>
            <button
              @click="closeBatchModal"
              :disabled="isBatchProcessing"
              class="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
              :class="
                isBatchProcessing ? 'cursor-not-allowed' : 'cursor-pointer'
              "
            >
              {{ isBatchProcessing ? "Processing..." : "Close" }}
            </button>
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

    <Modal
      :isOpen="showExport"
      @closeModal="
        () => {
          showExport = false;
        }
      "
    >
      <DialogPanel
        class="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 p-4 border-b bg-[#FF613c] text-white rounded-t-xl"
        >
          ALL FEATURE FOR CSV & PRINT
        </DialogTitle>
        <div class="p-6 space-y-3">
          <div class="relative group space-y-2">
            <div
              class="rounded-xl left-0 w-full space-y-3 transition-all duration-200"
            >
              <p class="text-xs font-medium">
                Export CSV for Company of All Tax Have
              </p>
              <div class="flex justify-center items-center h-full">
                <p
                  @click="exportCSV"
                  class="px-6 font-medium text-xs py-4 bg-[#FF613c]/20 w-full rounded-lg border border-gray-400/20 focus:outline-none"
                >
                  Export Parchase CSV
                </p>
              </div>
              <p class="text-xs font-medium">
                Export CSV for Company of All Invoice Have
              </p>
              <div class="flex justify-center items-center h-full">
                <p
                  @click="exportInvoiceCSV"
                  class="px-6 font-medium text-xs py-4 bg-[#FF613c]/20 w-full rounded-lg border border-gray-400/20 focus:outline-none"
                >
                  Export Invoice CSV
                </p>
              </div>
              <p class="text-xs font-medium">
                Export CSV for Company of All No Tax Have
              </p>
              <div class="flex justify-center items-center h-full">
                <p
                  @click="exportNoTaxCSV"
                  class="px-6 font-medium text-xs py-4 bg-[#FF613c]/20 w-full rounded-lg border border-gray-400/20 focus:outline-none"
                >
                  Export No Tax CSV
                </p>
              </div>
            </div>
          </div>

          <p class="text-xs font-medium">Print All invoices have</p>
          <p
            @click="printPDF"
            class="px-6 font-medium text-xs py-4 rounded-lg border border-gray-400/20 focus:outline-none bg-[#FF613c] text-white"
          >
            Print Parchase PDF
          </p>
          <p class="text-xs font-medium">Print All Tax no have</p>
          <p
            @click="printNoTaxPDF"
            class="px-6 font-medium text-xs py-4 rounded-lg border border-gray-400/20 focus:outline-none bg-[#FF613c] text-white"
          >
            Print No Tax PDF
          </p>
        </div>
      </DialogPanel>
    </Modal>
  </Layout>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useSidebarStore } from "../stores/sidebar";
import Layout from "./Layout.vue";
import { computed, onMounted, ref, watch } from "vue";
import Pagination from "../components/Pagination.vue";
import { useToast } from "vue-toastification";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  FaceSmileIcon,
} from "@heroicons/vue/24/outline";
import debounce from "lodash/debounce";
import Swal from "sweetalert2";
import AccountanceHeader from "../components/AccountanceHeader.vue";
import { useAuthStore } from "../stores/auth";
import YearPickerVue from "./AccountingComponent/yearPicker.vue";
import { useRoute, useRouter } from "vue-router";
import { useBookingReceiptStore } from "../stores/bookingReceipt";
import Modal from "../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle, Tab } from "@headlessui/vue";
import { useReservationStore } from "../stores/reservation";
import ReceiptEdit from "./ReceiptEdit.vue";
import { useCashImageStore } from "../stores/cashImage";
import { useGroupStore } from "../stores/group";
import { CheckBadgeIcon, XCircleIcon } from "@heroicons/vue/24/solid";
import { formattedNumber } from "./help/FormatData";
import { useParchasePDFStore } from "../stores/parchasePDF";
import { onUnmounted } from "vue";
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
// const { receipts } = storeToRefs(bookingReceiptStore);
const { cashImages, loading } = storeToRefs(cashImageStore);
const parchasePDFStore = useParchasePDFStore();
const showPdfModal = ref(false);

const showConnectModal = ref(false);
const table_type = ref(false);
const showExport = ref(false);

const addingGroupId = ref(null);
const addingGroupInfo = ref(null);
const addTaxReceipt = (data) => {
  console.log(data, "this is group info");
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

const {
  // Existing
  isGenerating: pdfIsGenerating,
  progress: pdfProgress,
  status: pdfStatus,
  message: pdfMessage,
  downloadUrl: pdfDownloadUrl,
  filename: pdfFilename,
  error: pdfError,
  currentJob: pdfCurrentJob,
  canGenerate: pdfCanGenerate,
  isCompleted: pdfIsCompleted,
  isFailed: pdfIsFailed,
  isProcessing: pdfIsProcessing,

  // New batch refs
  isBatchGenerating,
  batchJobId,
  batchStatus,
  isBatchCompleted,
  isBatchFailed,
  isBatchProcessing,
} = storeToRefs(parchasePDFStore);

// Search and filter states
const date_range = ref("");
const filterType = ref("all");
const senderSearch = ref("");
const crmSearch = ref("");
const invoice = ref("");
const invoiceTax = ref("");
const tax_receipts = ref("all");
const sort_by = ref("date");
const sort_order = ref("asc");
const bankNameSearch = ref("");
const amountSearch = ref("");
const interactSearch = ref("");
const per_page = ref(100);

// Expanded items for mobile view
const expandedItems = ref({});

// Set current year and month
const currentDate = new Date();
const year = ref(currentDate.getFullYear());
const selectedMonth = ref(currentDate.getMonth() + 1);

const detailedItems = ref({});
const loadingDetails = ref({});

const calculateRealTax = (data) => {
  let totalTax = 0;
  data.forEach((item) => {
    totalTax += item.detail?.total_tax_withold * 1;
  });
  return totalTax;
};

const showTaxModal = ref(false);

const openTaxModal = () => {
  showTaxModal.value = true;
};

const closeTaxModal = () => {
  showTaxModal.value = false;
};

// Method to get detailed data when user expands
const getDetailAction = async (itemId) => {
  // If already loaded, don't load again
  if (detailedItems.value[itemId]) {
    return detailedItems.value[itemId];
  }

  // Set loading state
  loadingDetails.value[itemId] = true;

  try {
    const response = await cashImageStore.getDetailAction(itemId);
    if (response.status == 1) {
      detailedItems.value[itemId] = response.result;
      console.log(response.result, "this is response");

      return response.result;
    } else {
      toast.error("Failed to load details");
      return null;
    }
  } catch (error) {
    console.error("Error loading details:", error);
    toast.error("Error loading details");
    return null;
  } finally {
    loadingDetails.value[itemId] = false;
  }
};

const goTaxMissingTable = () => {
  router.push({
    name: "taxMissing",
    query: {
      daterange: date_range.value,
    },
  });
};

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

// Group receipts by date
// const groupedReceipts = computed(() => {
//   if (!cashImages.value?.data) return {};

//   const groups = {};

//   // Use the data as-is from backend (respects your backend sorting)
//   cashImages.value.data.forEach((item) => {
//     const date = item.date ? item.date.split(" ")[0] : "Unknown Date";
//     const time =
//       item.date && item.date.includes(" ") ? item.date.split(" ")[1] : null;
//     const itemWithTime = { ...item, time };

//     if (!groups[date]) {
//       groups[date] = [];
//     }
//     groups[date].push(itemWithTime);
//   });

//   return groups;
// });

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
        } else {
          toast.error("Failed to delete tax credit");
        }
      } catch (error) {
        toast.error("Failed to delete tax credit");
      }
    }
  });
};

const editCredit = (id) => {
  window.open(`/tax_receipt?id=${id}`, "_blank");
};

const formatDateForTime = (dateString) => {
  if (!dateString) return "";

  // Parse the date string (assuming DD-MM-YYYY HH:mm:ss format)
  const [datePart] = dateString.split(" ");
  const [day, month, year] = datePart.split("-");

  // Create date object
  const date = new Date(`${year}-${month}-${day}`);

  // Month names abbreviated
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

  // Format: DD MMM YY
  const formattedDay = day.padStart(2, "0");
  const formattedMonth = monthNames[date.getMonth()];
  const formattedYear = year.slice(-2); // Last 2 digits of year

  return `${formattedDay} ${formattedMonth} ${formattedYear}`;
};

const goToGroup = (data) => {
  console.log("====================================");
  console.log(data);
  console.log("====================================");
  if (authStore.user.role != "external_audit") {
    if (
      data?.group_info?.product_type == "App\\Models\\EntranceTicket" ||
      data?.product_type == "App\\Models\\EntranceTicket"
    ) {
      if (data?.group_id) {
        // router.push(`/group-attraction?id=${data?.group_id}`);
        window.open(`/group-attraction?id=${data?.group_id}`, "_blank");
      } else {
        // router.push(`/group-attraction?id=${data?.id}`);
        window.open(`/group-attraction?id=${data?.id}`, "_blank");
      }
    }
    if (
      data?.group_info?.product_type == "App\\Models\\Hotel" ||
      data?.product_type == "App\\Models\\Hotel"
    ) {
      if (data?.group_id) {
        // router.push(`/group-hotel?id=${data?.group_id}`);
        window.open(`/group-hotel?id=${data?.group_id}`, "_blank");
      } else {
        // router.push(`/group-hotel?id=${data?.id}`);
        window.open(`/group-hotel?id=${data?.id}`, "_blank");
      }
    }
    if (
      data?.group_info?.product_type == "App\\Models\\PrivateVanTour" ||
      data?.product_type == "App\\Models\\PrivateVanTour"
    ) {
      if (data?.group_id) {
        // router.push(`/group-private-van-tour?id=${data?.group_id}`);
        window.open(`/group-private-van-tour?id=${data?.group_id}`, "_blank");
      } else {
        // router.push(`/group-private-van-tour?id=${data?.id}`);
        window.open(`/group-private-van-tour?id=${data?.id}`, "_blank");
      }
    }
  }
};

const totalCost = (items) => {
  if (!items) return 0;
  let total = 0;
  items.forEach((item) => {
    total += item.expense;
  });
  return total;
};

// Helper functions
const formatDateHeader = (dateString) => {
  // Match DD-MM-YYYY or DD/MM/YYYY format
  const ddmmyyyyPattern = /^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/;
  const match = dateString.match(ddmmyyyyPattern);

  if (match) {
    const [, day, month, year] = match;
    const date = new Date(year, month - 1, day);

    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    const dayNum = date.getDate();
    const monthName = date.toLocaleDateString("en-US", { month: "short" });
    const yearShort = date.getFullYear().toString().slice(-2);
    return `${dayNum} ${monthName} ${yearShort}`;
  } else {
    // Fallback to original parsing
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear().toString().slice(-2);
    return `${day} ${month} ${year}`;
  }
};

// Add this with your other helper functions
const formatTime = (timeString) => {
  if (!timeString) return "-";

  // Extract hours, minutes, seconds
  const [hours, minutes] = timeString.split(":");

  // Convert to 12-hour format
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12; // Convert 0 to 12 for 12 AM

  // Remove leading zero from hour if needed
  const displayHour = hour12 < 10 ? hour12.toString() : hour12;

  return `${displayHour}:${minutes} ${ampm}`;
};

const extractTime = (dateString) => {
  if (!dateString) return null;
  if (dateString.includes(" ")) {
    return dateString.split(" ")[1];
  }
  return null;
};

// Update getTransactionType to use relatable_summary from list data
const getTransactionType = (item) => {
  // Use basic data from list instead of relatable
  if (item.sender && item.sender !== "null") {
    return item.sender;
  }
  if (item.receiver && item.receiver !== "null") {
    return item.receiver;
  }

  // Use relatable_summary if available
  if (item.relatable_summary) {
    return item.relatable_summary.type;
  }

  return "Payment";
};

const getTransactionBadgeClass = (item) => {
  if (item?.relatable_type == "App\\Models\\Booking") {
    return " text-green-800";
  } else if (item?.relatable_type == "App\\Models\\BookingItemGroup") {
    return " text-red-800";
  } else if (item?.relatable_type == "App\\Models\\CashBook") {
    return " text-blue-800";
  }
  return "bg-red-100 text-red-800";
};

const getAmountColorClass = (item) => {
  if (item?.relatable_type == "App\\Models\\Booking") {
    return "text-green-600";
  } else if (item?.relatable_type === "App\\Models\\BookingItemGroup") {
    return "text-red-600";
  } else if (item?.relatable_type == "App\\Models\\CashBook") {
    return "text-blue-600";
  }
  return "text-red-600";
};

const getTotalValue = (items) => {
  if (!items) return 0;
  let total = 0;
  items.forEach((item) => {
    total += item.total_cost_price * 1;
  });
  return total;
};

const calculateInvoiceTotal = (item) => {
  if (!item) return 0;

  let total = 0;
  item.forEach((item) => {
    total += item.meta?.total_after_tax * 1;
  });
  return total;
};

const calculateInvoiceVat = (item) => {
  if (!item) return 0;

  let total = 0;
  item.forEach((item) => {
    total += item.meta?.total_tax_withold * 1;
  });
  return formattedNumber(total);
};
const calculateTaxTotal = (item) => {
  if (!item) return 0;

  let total = 0;
  item.forEach((item) => {
    total += item?.total_after_tax ? item?.total_after_tax * 1 : 0;
  });
  return total;
};

const calculateTaxVAT = (item) => {
  if (!item) return 0;

  let total = 0;
  item.forEach((item) => {
    total += item?.total_tax_withold ? item?.total_tax_withold * 1 : 0;
  });
  return total;
};

const formatTransactionAmount = (item) => {
  const amount = item?.amount;
  if (!amount) return "-";

  const formattedAmount = new Intl.NumberFormat("en-US").format(amount);
  const prefix =
    item?.relatable_type === "App\\Models\\Booking"
      ? "+"
      : item?.relatable_type === "App\\Models\\BookingItemGroup"
      ? "-"
      : "-";

  return `${prefix}${formattedAmount}`;
};

const toggleExpand = async (itemId) => {
  const isCurrentlyExpanded = expandedItems.value[itemId];

  // Close all expanded items
  expandedItems.value = {};

  // If the clicked item wasn't expanded, expand it
  if (!isCurrentlyExpanded) {
    expandedItems.value[itemId] = true;
    await getDetailAction(itemId);
  }
};

// Method to get relatable data for an item
const getRelatableData = (itemId) => {
  const detailedItem = detailedItems.value[itemId];
  return detailedItem ? detailedItem.relatable : null;
};

// Method to get grouped items for an item
const getGroupedItems = (itemId) => {
  const detailedItem = detailedItems.value[itemId];
  return detailedItem ? detailedItem.grouped_items : [];
};

const getExpenseItems = (itemId) => {
  const detailedItem = detailedItems.value[itemId];
  console.log(detailedItem.relatable, "this is expense item");

  return detailedItem ? detailedItem.relatable : [];
};

// Your existing functions...
const generateDateRangeForMonth = (month, yearValue) => {
  const startDate = new Date(yearValue, month - 1, 1);
  const endDate = new Date(yearValue, month, 0);

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return `${formatDate(startDate)},${formatDate(endDate)}`;
};

const setMonthDateRange = (month, yearValue) => {
  date_range.value = generateDateRangeForMonth(month, yearValue);
};

const searchParams = computed(() => {
  let params = {};

  if (date_range.value) {
    params.date = date_range.value;
  }

  if (filterType.value != "all" && filterType.value != "") {
    params.tax_receipts = filterType.value;
  }

  if (senderSearch.value) {
    params.sender = senderSearch.value;
  }

  if (crmSearch.value) {
    params.crm_id = crmSearch.value;
  }

  if (sort_by.value && sort_order.value) {
    params.sort_by = sort_by.value;
    params.sort_order = sort_order.value;
  }

  if (amountSearch.value) {
    params.amount = amountSearch.value;
  }

  if (authStore.isSuperAdmin) {
    if (interactSearch.value) {
      params.interact_bank = interactSearch.value;
    }
  }

  if (invoice.value) {
    params.filter_type = invoice.value;
  }

  if (invoiceTax.value) {
    params.filter_type_invoice = invoiceTax.value;
  }

  params.include_relatable = true;

  params.relatable_type = "App\\Models\\BookingItemGroup";

  params.limit = per_page.value ? per_page.value : 100;

  return params;
});

const total_vat = ref(0);
const total_commission = ref(0);
const total_net_vat = ref(0);

const getAction = async () => {
  await cashImageStore.getListAction(searchParams.value);

  // const res = await cashImageStore.getVatSummary({
  //   date: date_range.value,
  // });

  // let data = res.data;

  // total_vat.value = data.total_vat;
  // total_commission.value = data.total_commission;
  // total_net_vat.value = data.total_net_vat;
};

const changePage = async (url) => {
  await cashImageStore.getChangePage(url, searchParams.value);
};

const exportCSV = async () => {
  let searchParchase = {
    sort_by: "receiver",
    sort_order: "asc",
    include_relatable: true,
    relatable_type: "App\\Models\\BookingItemGroup",
    filter_type: "tax_receipt_have",
  };
  if (date_range.value) {
    searchParchase.date = date_range.value;
  }

  const res = await cashImageStore.exportParchaseCsv(searchParchase);
  if (res.status == 1) {
    window.open(res.result.download_link);
  } else {
    toast.error(res.message);
  }
};

const exportInvoiceCSV = async () => {
  let searchParchase = {
    sort_by: "date",
    sort_order: "asc",
    include_relatable: true,
    relatable_type: "App\\Models\\BookingItemGroup",
    filter_type_invoice: "invoice_have",
  };
  if (date_range.value) {
    searchParchase.date = date_range.value;
  }
  const res = await cashImageStore.exportInvoiceCsv(searchParchase);
  if (res.status == 1) {
    window.open(res.result.download_link);
  } else {
    toast.error(res.message);
  }
};

const exportNoTaxCSV = async () => {
  let searchParchase = {
    sort_by: "date",
    sort_order: "asc",
    interact_bank: "company",
    include_relatable: true,
    relatable_type: "App\\Models\\BookingItemGroup",
    filter_type: "tax_receipt_missing",
  };
  if (date_range.value) {
    searchParchase.date = date_range.value;
  }
  const res = await cashImageStore.exportInvoiceCsv(searchParchase);
  if (res.status == 1) {
    window.open(res.result.download_link);
  } else {
    toast.error(res.message);
  }
};

const showBatchModal = ref(false);

const printPDF = async () => {
  if (!parchasePDFStore.canGenerate) {
    toast.warning("PDF generation လုပ်နေဆဲပါ၊ ခဏစောင့်ပါ...");
    return;
  }

  let searchParchase = {
    sort_by: "date",
    sort_order: "asc",
    include_relatable: true,
    relatable_type: "App\\Models\\BookingItemGroup",
    filter_type_invoice: "invoice_have",
  };
  if (date_range.value) {
    searchParchase.date = date_range.value;
  }

  try {
    const result = await parchasePDFStore.generatePdf(searchParchase);

    // Check if it became a batch job
    if (parchasePDFStore.isBatchGenerating) {
      showBatchModal.value = true;
      toast.success(
        `PDF များကို ${batchStatus.value.total_batches} အပိုင်း ခွဲပြီး လုပ်နေပါသည်`
      );
    } else {
      // Single job - show existing modal
      showPdfModal.value = true;
      toast.success("PDF generation started");
    }
  } catch (error) {
    console.error("PDF Generation failed:", error);
    toast.error("PDF generation မှာ အမှားဖြစ်ပါတယ်");
  }
};

const printNoTaxPDF = async () => {
  if (!parchasePDFStore.canGenerate) {
    toast.warning("PDF generation လုပ်နေဆဲပါ၊ ခဏစောင့်ပါ...");
    return;
  }

  let searchParchase = {
    sort_by: "date",
    sort_order: "asc",
    interact_bank: "company",
    include_relatable: true,
    relatable_type: "App\\Models\\BookingItemGroup",
    filter_type: "tax_receipt_missing",
  };
  if (date_range.value) {
    searchParchase.date = date_range.value;
  }

  try {
    const result = await parchasePDFStore.generatePdf(searchParchase);

    // Check if it became a batch job
    if (parchasePDFStore.isBatchGenerating) {
      showBatchModal.value = true;
      toast.success(
        `PDF များကို ${batchStatus.value.total_batches} အပိုင်း ခွဲပြီး လုပ်နေပါသည်`
      );
    } else {
      // Single job - show existing modal
      showPdfModal.value = true;
      toast.success("PDF generation started");
    }
  } catch (error) {
    console.error("PDF Generation failed:", error);
    toast.error("PDF generation မှာ အမှားဖြစ်ပါတယ်");
  }
};

// Modal management functions
const closeBatchModal = () => {
  // Only close if not processing
  if (!parchasePDFStore.isBatchProcessing) {
    showBatchModal.value = false;
    parchasePDFStore.resetBatchState();
  }
};

const downloadBatchFile = (file) => {
  parchasePDFStore.downloadBatchFile(file);
  toast.success(`Downloaded: ${file.filename}`);
};

const handleBatchRetry = async () => {
  try {
    await parchasePDFStore.generatePdf(searchParams.value);
  } catch (error) {
    console.error("Batch retry failed:", error);
    toast.error("Retry မှာ အမှားဖြစ်ပါတယ်");
  }
};

// Helper functions for the modal
const getStatusClass = () => {
  switch (parchasePDFStore.status) {
    case "completed":
      return "text-green-600";
    case "failed":
      return "text-red-600";
    case "processing":
      return "text-blue-600";
    default:
      return "text-gray-600";
  }
};

const getStatusText = () => {
  const statusTexts = {
    queued: "Queue မှာ စောင့်နေတယ်",
    processing: "လုပ်နေတယ်",
    completed: "ပြီးပါပြီ",
    failed: "အမှားဖြစ်တယ်",
  };
  return statusTexts[parchasePDFStore.status] || parchasePDFStore.status;
};

const formatDateTime = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Watch for PDF completion to show success message
watch(
  () => parchasePDFStore.isBatchCompleted,
  (newVal) => {
    if (newVal) {
      toast.success(
        "PDF batch generation ပြီးပါပြီ! Files တွေ download လုပ်လို့ရပါပြီ။"
      );
    }
  }
);

// Watch for batch errors
watch(
  () => parchasePDFStore.isBatchFailed,
  (newVal) => {
    if (newVal) {
      toast.error("PDF batch generation မှာ အမှားဖြစ်ပါတယ်");
    }
  }
);

// Update the existing onUnmounted
onUnmounted(() => {
  // parchasePDFStore.stopStatusChecking();
  parchasePDFStore.stopBatchStatusChecking();
});

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
  bankNameSearch.value = "";
  amountSearch.value = "";
  interactSearch.value = "";
  filterType.value = "";
  sort_by.value = "date";
  sort_order.value = "desc";
};

const placeholderFile = ref("");
const viewReceipt = (item) => {
  console.log("====================================");
  console.log(item);
  console.log("====================================");
  if (item) {
    placeholderFile.value = item;
  } else {
    toast.warning("No receipt file available");
  }
};

const formatAmount = (amount) => {
  if (!amount) return "-";
  return new Intl.NumberFormat("en-US").format(amount);
};

const goToView = async (data) => {
  console.log(data, "this is data");
  if (data.relatable_type == "App\\Models\\Booking") {
    router.push(`bookings/new-update/${data?.relatable_id}`);
  } else if (data.relatable_type == "App\\Models\\BookingItemGroup") {
    if (data?.product_type == "App\\Models\\EntranceTicket") {
      router.push(`/group-attraction?id=${data?.relatable_id}`);
    } else if (data?.product_type == "App\\Models\\Hotel") {
      router.push(`/group-hotel?id=${data?.relatable_id}`);
    } else if (data?.product_type == "App\\Models\\PrivateVanTour") {
      router.push(`/group-private-van-tour?id=${data?.relatable_id}`);
    }
  } else if (data.relatable_type == "App\\Models\\CashBook") {
    router.push(`/cash-book/${data?.relatable_id}`);
  }
};

const openCredit = (id) => {
  window.open(
    import.meta.env.VITE_API_URL + "/bookings/" + id + "/credit",
    "_blank"
  );
};

const calculateGrandVat = (items, grand_total) => {
  if (grand_total && items) {
    let grand_total_minus = 0;
    items.forEach((item) => {
      if (item.total_cost_price) {
        grand_total_minus += item.total_cost_price * 1;
      }
    });

    return (grand_total - grand_total_minus).toFixed(2);
  } else {
    return 0;
  }
};

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

const update = (data) => {
  console.log("====================================");
  console.log(data);
  console.log("====================================");
  updateModalOpen.value = true;
  updateData.value.id = data.id;
  updateData.value.date = data.date;
  updateData.value.sender = data.sender;
  updateData.value.amount = data.amount;
  updateData.value.receiver = data.receiver;
  updateData.value.interact_bank = data.interact_bank;
  updateData.value.currency = data.currency;
  updateData.value.relatable_type = data.relatable_type;
  updateData.value.file = data.image;
};

const showData = ref([]);
const taxData = ref([]);
const currentIndex = ref(0);
const currentIndex2 = ref(0);
const nextItem = () => {
  if (currentIndex.value < showData.value.length - 1) {
    currentIndex.value++;
  }
};
const prevItem = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};
const next2Item = () => {
  if (currentIndex2.value < taxData.value.length - 1) {
    currentIndex2.value++;
  }
};
const prev2Item = () => {
  if (currentIndex2.value > 0) {
    currentIndex2.value--;
  }
};
const IsShow = ref(false);
const IsTaxShow = ref(false);
const IsCredit = ref(false);
const creditData = ref([]);
const show = (data) => {
  console.log("====================================");
  console.log(data);
  showData.value = data;
  IsShow.value = true;
  console.log("====================================");
};
const showTax = (data) => {
  console.log("====================================");
  console.log(data);
  taxData.value = data;
  IsTaxShow.value = true;
  console.log("====================================");
};
const showCredit = (data) => {
  console.log("====================================");
  console.log(data);
  creditData.value = data;
  IsCredit.value = true;
  console.log("====================================");
};
const showCreditOff = () => {
  IsCredit.value = false;
  creditData.value = [];
  currentIndex2.value = 0;
};

const getGroupDocument = async (id) => {
  try {
    const response = await groupStore.groupDocumentList(id, {
      document_type: "booking_confirm_letter",
    });
    // taxData.value = response.data.result;
    // console.log(response);
    // taxData.value = response.result;
    showTax(response.result);
  } catch (error) {
    console.error("Error fetching invoice list:", error);
    toast.error("Failed to load invoice list");
  }
};

const showTaxOff = () => {
  IsTaxShow.value = false;
  taxData.value = [];
  currentIndex2.value = 0;
};

const showOff = () => {
  IsShow.value = false;
  showData.value = [];
  currentIndex.value = 0;
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

const onChangeUpdate = async (message) => {
  closeModal();
  await getAction();
};

onMounted(async () => {
  if (route.query.month && route.query.year) {
    selectedMonth.value = parseInt(route.query.month);
    year.value = parseInt(route.query.year);
  }

  setMonthDateRange(selectedMonth.value, year.value);
  // await getAction();
});

watch(
  [
    date_range,
    filterType,
    senderSearch,
    crmSearch,
    bankNameSearch,
    amountSearch,
    interactSearch,
    per_page,
    sort_by,
    sort_order,
    invoice,
    invoiceTax,
  ],
  debounce(async () => {
    await getAction();
  }, 500)
);
</script>
