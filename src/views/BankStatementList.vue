<template>
  <Layout :is_white="true" class="relative">
    <div
      :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
      class="space-x-8 col-span-3 flex justify-start items-center transition-all duration-200 gap-2 text-sm pb-4 absolute top-6"
    >
      <p
        class="text-2xl flex justify-start whitespace-nowrap items-center font-medium text-[#FF613c]"
      >
        Bank Statement
        <span
          class="w-2 h-2 mx-3 bg-[#FF613c] rounded-full inline-block"
        ></span>
        <span>{{ year }}</span>
        <span
          class="w-2 h-2 mx-3 bg-[#FF613c] rounded-full inline-block"
        ></span>
        <span>{{ monthArray.find((m) => m.id == selectedMonth)?.name }}</span>
      </p>
      <div class="flex justify-end w-full items-center space-x-2">
        <p
          class="px-3 py-2.5 rounded-xl bg-green-600/50 text-xs backdrop-blur-sm shadow"
        >
          IN: {{ formattedNumber(total_income.toFixed(2)) }} thb ,
          {{ formattedNumber(total_income_mmk.toFixed(2)) }} mmk
        </p>
        <p
          class="px-3 py-2.5 rounded-xl bg-red-600/50 text-xs backdrop-blur-sm shadow"
        >
          EXP: {{ formattedNumber(total_expense.toFixed(2)) }} thb,
          {{ formattedNumber(total_expense_mmk.toFixed(2)) }} mmk
        </p>
      </div>
    </div>

    <div class="">
      <!-- Filters and Search -->
      <div class="pb-4 space-y-3">
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
          <p
            v-if="!authStore.isExternalAudit"
            @click="filterType = 'complete'"
            class="px-5 py-2.5 rounded-lg text-xs"
            :class="
              filterType == 'complete'
                ? 'bg-[#FF613c] text-white'
                : ' border border-[#FF613x]'
            "
          >
            Complete
          </p>
          <p
            v-if="!authStore.isExternalAudit"
            @click="filterType = 'missing'"
            class="px-5 py-2.5 rounded-lg text-xs"
            :class="
              filterType == 'missing'
                ? 'bg-[#FF613c] text-white'
                : ' border border-[#FF613x]'
            "
          >
            Missing
          </p>
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

          <div class="flex justify-end w-full items-center space-x-2">
            <p
              class="px-3 py-2.5 rounded-xl bg-green-600/50 text-xs backdrop-blur-sm shadow"
            >
              Total: {{ formattedNumber(total_vat.toFixed(2)) }}
            </p>
            <p
              class="px-3 py-2.5 rounded-xl bg-yellow-600/50 text-xs backdrop-blur-sm shadow"
            >
              Commission: {{ formattedNumber(total_commission.toFixed(2)) }}
            </p>
            <p
              class="px-3 py-2.5 rounded-xl bg-red-600/50 text-xs backdrop-blur-sm shadow"
            >
              Net Vat: {{ formattedNumber(total_net_vat.toFixed(2)) }}
            </p>
          </div>
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
          <div>
            <select
              v-model="currencySearch"
              class="w-full px-2 py-1.5 text-xs border rounded-lg"
            >
              <option value="">Select Currency</option>
              <option value="THB">THB</option>
              <option value="MMK">MMK</option>
              <option value="USD">USD</option>
            </select>
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
        <table v-else class="w-full text-xs border border-gray-500">
          <thead class="border border-gray-500">
            <tr class="bg-gray-200 divide-x divide-gray-500">
              <th class="text-xs text-center font-medium py-3 w-[100px]">
                Date
              </th>
              <th class="text-xs text-center font-medium py-3 w-[80px]">
                Time/ Eff.Date
              </th>
              <th class="text-xs text-center font-medium py-3 w-[80px]">
                Currency
              </th>
              <th class="text-xs text-center font-medium py-3 w-[80px]">
                Withdrawal
              </th>
              <th class="text-xs text-center font-medium py-3 w-[80px]">
                Deposit
              </th>
              <th class="text-xs text-center font-medium py-3">Sender</th>
              <th class="text-xs text-center font-medium py-3">Receiver</th>
              <th class="text-xs text-center font-medium py-3">CRM ID</th>
              <th class="text-xs text-center font-medium py-3">VAT</th>
              <th class="text-xs text-center font-medium py-3">Commission</th>
              <th class="text-xs text-center font-medium py-3">Net VAT</th>
              <th class="text-xs text-center font-medium py-3">Actual VAT</th>
              <th class="text-xs text-center font-medium py-3">Invoice</th>
              <th class="text-xs text-center font-medium py-3">Tax Credit</th>
            </tr>
          </thead>
          <tbody>
            <template
              v-for="group in groupedReceipts"
              :key="`group-${Object.keys(group)[0]}`"
            >
              <template v-for="item in group" :key="item.id">
                <!-- Main transaction row -->
                <tr
                  class="bg-gray-50 odd:bg-white group relative divide-x divide-gray-500 hover:bg-gray-100 cursor-pointer"
                  :class="
                    expandedItems[item.id] ? 'border border-[#FF613c]' : ''
                  "
                  @click="toggleExpand(item.id)"
                >
                  <td class="px-3 py-2 text-xs text-center">
                    {{ formatDateForTime(item?.date) }}

                    <!-- Action buttons - moved inside a table cell -->
                  </td>
                  <td class="px-3 py-2 text-xs text-center">
                    {{ formatTime(item.time) }}
                  </td>
                  <td class="px-3 py-2 text-xs text-center">
                    {{ item.currency }}
                  </td>
                  <td
                    class="px-3 py-2 text-xs text-end"
                    :class="getTransactionBadgeClass(item)"
                  >
                    <p
                      v-if="
                        item.relatable_type ==
                          'App\\Models\\BookingItemGroup' ||
                        item.relatable_type == 'App\\Models\\CashBook'
                      "
                    >
                      {{ formatTransactionAmount(item) }}
                    </p>
                    <p v-else></p>
                  </td>
                  <td
                    class="px-3 py-2 text-xs text-end"
                    :class="getTransactionBadgeClass(item)"
                  >
                    <p v-if="item.relatable_type == 'App\\Models\\Booking'">
                      {{ formatTransactionAmount(item) }}
                    </p>
                    <p v-else></p>
                  </td>
                  <td class="px-3 py-2 text-xs w-[200px]">
                    {{ item.sender }}
                  </td>
                  <td class="px-3 py-2 text-xs w-[200px]">
                    {{ item.receiver }}
                  </td>
                  <td class="px-3 py-2 text-xs w-[100px]">
                    {{ item.crm_id ?? "-" }}
                  </td>
                  <td class="px-3 py-2 text-xs w-[80px]">
                    {{
                      item.relatable_type == "App\\Models\\BookingItemGroup"
                        ? "-"
                        : ""
                    }}{{
                      item.vat ? formattedNumber(item.vat.toFixed(2)) : "-"
                    }}
                  </td>
                  <td class="px-3 py-2 text-xs w-[80px]">
                    {{
                      item.commission
                        ? formattedNumber(item.commission.toFixed(2))
                        : "-"
                    }}
                  </td>
                  <td class="px-3 py-2 text-xs w-[80px]">
                    {{
                      item.net_vat
                        ? formattedNumber(item.net_vat.toFixed(2))
                        : "-"
                    }}
                  </td>
                  <td
                    class="px-3 py-2 text-xs"
                    :class="
                      item?.tax_receipts?.length > 0
                        ? 'text-blue-500 underline'
                        : ''
                    "
                  >
                    {{
                      item?.tax_receipts?.length > 0
                        ? calculateRealTax(item?.tax_receipts).toFixed(2)
                        : "-"
                    }}
                  </td>
                  <td
                    class="px-3 py-2 text-xs"
                    v-if="
                      item.relatable_type == 'App\\Models\\BookingItemGroup'
                    "
                  >
                    <CheckBadgeIcon
                      v-if="item.has_invoice"
                      class="w-5 h-5 text-green-500 inline-block"
                    />
                    <XCircleIcon
                      v-if="!item.has_invoice"
                      class="w-5 h-5 text-gray-300 inline-block"
                    />
                  </td>
                  <td
                    v-if="
                      item.relatable_type != 'App\\Models\\BookingItemGroup'
                    "
                  ></td>
                  <td class="px-3 py-2 text-xs">
                    <CheckBadgeIcon
                      v-if="item?.tax_receipts?.length > 0"
                      class="w-5 h-5 text-green-500 inline-block"
                    />
                    <XCircleIcon
                      v-if="item?.tax_receipts?.length == 0"
                      class="w-5 h-5 text-gray-300 inline-block"
                    />
                  </td>
                </tr>

                <!-- Loading row -->
                <tr v-if="loadingDetails[item?.id]">
                  <td colspan="14" class="px-3 py-4 text-center">
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

                <!-- Replace the empty tr with this - using the same table structure -->
                <tr
                  v-if="
                    expandedItems[item.id] &&
                    !loadingDetails[item.id] &&
                    !getRelatableData(item.id)
                  "
                >
                  <td colspan="14" class="p-0">
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
                            @click.stop="showUpdate(detailedItems[item.id])"
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

                      <!-- Same table structure as existing -->
                      <table
                        class="min-w-full"
                        v-if="
                          detailedItems[item.id]?.attached_bookings?.length > 0
                        "
                      >
                        <!-- Table Header - Same as existing -->
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

                        <!-- Table Body - Same structure, different data source -->
                        <tbody class="bg-white divide-y divide-gray-200">
                          <!-- Show attached bookings data in same table format -->
                          <template
                            v-for="attachedBooking in detailedItems[item.id]
                              .attached_bookings"
                            :key="attachedBooking.id"
                          >
                            <!-- Booking Summary Row -->
                            <tr class="">
                              <td
                                class="px-6 py-4 whitespace-nowrap border-t border-red-600 text-start"
                              >
                                <span
                                  class="text-xs font-mono text-gray-900 bg-blue-100 px-2 py-1 rounded"
                                >
                                  {{ attachedBooking.crm_id }} -
                                  {{ attachedBooking.booking.customer.name }}
                                </span>
                              </td>
                              <td
                                class="px-6 py-4 whitespace-nowrap text-end w-[200px]"
                              >
                                <span
                                  class="text-xs font-mono px-2 py-1 rounded"
                                >
                                  Booking Total
                                </span>
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-end">
                                <span
                                  class="text-xs font-mono px-2 py-1 rounded"
                                >
                                  {{
                                    formattedNumber(
                                      attachedBooking.booking.grand_total
                                    )
                                  }}
                                </span>
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-end">
                                <span
                                  class="text-xs font-mono px-2 py-1 rounded"
                                >
                                  {{
                                    formattedNumber(
                                      attachedBooking.booking.output_vat.toFixed(
                                        2
                                      )
                                    )
                                  }}
                                </span>
                              </td>
                              <td
                                class="px-6 py-4 whitespace-nowrap text-end cursor-pointer"
                                @click="
                                  show(attachedBooking.booking.receipts || [])
                                "
                              >
                                <span
                                  class="text-xs underline text-blue-600 font-mono px-2 py-1 rounded"
                                >
                                  sale slip ({{
                                    attachedBooking.booking.receipts?.length ||
                                    0
                                  }})
                                </span>
                              </td>
                              <td
                                class="px-6 py-4 whitespace-nowrap text-end cursor-pointer"
                                @click="openCredit(attachedBooking.booking.id)"
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

                            <!-- Commission Deduction Row -->
                            <tr>
                              <td
                                class="px-6 py-4 whitespace-nowrap text-start"
                              >
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
                                <span
                                  class="text-xs font-mono px-2 py-1 rounded"
                                >
                                  -{{
                                    formattedNumber(
                                      attachedBooking.booking.commission
                                    )
                                  }}
                                </span>
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-end">
                                <span
                                  class="text-xs font-mono px-2 py-1 rounded"
                                  >-</span
                                >
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-end">
                                <span
                                  class="text-xs font-mono px-2 py-1 rounded"
                                  >-</span
                                >
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-end">
                                <span
                                  class="text-xs font-mono px-2 py-1 rounded"
                                  >-</span
                                >
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-end">
                                <span
                                  class="text-xs font-mono px-2 py-1 rounded"
                                  >-</span
                                >
                              </td>
                            </tr>

                            <!-- Deposit Row -->
                            <tr>
                              <td
                                class="px-6 py-4 whitespace-nowrap text-start"
                              >
                                <span
                                  class="text-xs font-mono text-gray-900 bg-green-100 px-2 py-1 rounded"
                                >
                                  Deposit Amount
                                </span>
                              </td>
                              <td
                                class="px-6 py-4 whitespace-nowrap text-end w-[200px]"
                              >
                                <span
                                  class="text-xs font-mono px-2 py-1 rounded"
                                >
                                  {{ attachedBooking.pivot.notes || "-" }}
                                </span>
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-end">
                                <span
                                  class="text-xs font-mono px-2 py-1 rounded"
                                >
                                  {{
                                    formattedNumber(
                                      attachedBooking.pivot.deposit
                                    )
                                  }}
                                </span>
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-end">
                                <span
                                  class="text-xs font-mono px-2 py-1 rounded"
                                >
                                  {{
                                    formattedNumber(
                                      (
                                        attachedBooking.pivot.deposit -
                                        attachedBooking.pivot.deposit / 1.07
                                      ).toFixed(2)
                                    )
                                  }}
                                </span>
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-end">
                                <span
                                  class="text-xs font-mono px-2 py-1 rounded"
                                  >-</span
                                >
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-end">
                                <span
                                  class="text-xs font-mono px-2 py-1 rounded"
                                  >-</span
                                >
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-end">
                                <span
                                  class="text-xs font-mono px-2 py-1 rounded"
                                  >-</span
                                >
                              </td>
                            </tr>

                            <!-- Grouped items for each booking -->
                            <tr
                              v-for="group in attachedBooking.booking
                                .grouped_items"
                              :key="group.group_id"
                            >
                              <td
                                class="px-6 py-4 whitespace-nowrap text-start"
                              >
                                <div class="text-xs font-mono flex flex-wrap">
                                  <span
                                    @click="goToGroup(group)"
                                    class="text-gray-900 bg-blue-100 px-2 mr-2 py-1 rounded cursor-pointer"
                                  >
                                    Group
                                  </span>
                                  <span
                                    v-for="groupItem in group.items"
                                    class="text-gray-900 bg-gray-100 px-2 py-1 rounded mr-2"
                                    :key="groupItem.id"
                                  >
                                    {{ groupItem.crm_id.split("_")[1] }}
                                  </span>
                                </div>
                              </td>
                              <td
                                class="px-6 py-4 whitespace-nowrap text-end w-[200px]"
                              >
                                <span
                                  class="text-xs font-mono px-2 py-1 rounded"
                                >
                                  {{ group.items[0]?.product_name }}
                                </span>
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-end">
                                <span
                                  class="text-xs font-mono px-2 py-1 rounded"
                                >
                                  {{
                                    formattedNumber(group.group_total_amount)
                                  }}
                                </span>
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-end">
                                <span
                                  class="text-xs font-mono px-2 py-1 rounded"
                                >
                                  {{
                                    formattedNumber(
                                      (
                                        group.group_total_amount -
                                        group.group_total_amount / 1.07
                                      ).toFixed(2)
                                    )
                                  }}
                                </span>
                              </td>
                              <td
                                class="px-6 py-4 whitespace-nowrap text-end cursor-pointer"
                              >
                                <span
                                  class="text-xs font-mono px-2 py-1 rounded text-red-600 font-medium"
                                >
                                  missing
                                </span>
                              </td>
                              <td
                                class="px-6 py-4 whitespace-nowrap text-end cursor-pointer"
                              >
                                <span
                                  class="text-xs font-mono px-2 py-1 rounded text-red-600 font-medium"
                                >
                                  missing
                                </span>
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-end">
                                <span
                                  class="text-xs font-mono px-2 py-1 rounded text-red-600 font-medium"
                                >
                                  missing
                                </span>
                              </td>
                            </tr>
                          </template>
                        </tbody>
                      </table>
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
                  <td colspan="14" class="p-0">
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

                            <td class="px-6 py-4 whitespace-nowrap text-end">
                              <span class="text-xs font-mono px-2 py-1 rounded">
                                {{
                                  getExpenseItems(item.id)?.items[0]?.product
                                    ?.name
                                }}
                              </span>
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
                                    : 'text-red-500'
                                "
                                class="text-xs font-mono px-2 py-1 rounded"
                                @click="
                                  showCredit(
                                    getRelatableData(item.id)?.tax_credit
                                  )
                                "
                              >
                                {{
                                  getRelatableData(item.id)?.tax_credit.length >
                                  0
                                    ? "credit"
                                    : "missing"
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
            </template>
          </tbody>
        </table>
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
          <div
            v-if="
              showData.length > 0 &&
              !showData[currentIndex]?.is_internal_transfer
            "
            class="grid grid-cols-2 gap-4"
          >
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

          <div
            v-if="
              showData.length > 0 &&
              showData[currentIndex]?.is_internal_transfer
            "
            class=""
          >
            <div
              v-if="showData[currentIndex].is_internal_transfer"
              class="space-y-2"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span
                    class="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium"
                  >
                    Internal Transfer
                  </span>
                  <span class="text-xs text-gray-600">
                    Rate: {{ showData[currentIndex].exchange_rate }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <!-- FROM Section -->
                <div class="bg-red-50 p-2 rounded">
                  <p class="text-xs font-semibold text-red-700 mb-2">FROM</p>
                  <div class="space-y-2">
                    <div
                      v-for="(fromFile, fIdx) in showData[currentIndex]
                        .from_files"
                      :key="fIdx"
                      class="bg-white p-2 rounded"
                    >
                      <img
                        :src="
                          fromFile.image.includes(
                            'https://thanywhere.sgp1.cdn.digitaloceanspaces.com/images'
                          )
                            ? fromFile.image
                            : `https://thanywhere.sgp1.cdn.digitaloceanspaces.com/images/${fromFile.image}`
                        "
                        alt="Receipt image"
                        class="w-full h-24 object-cover rounded mb-1"
                        v-if="fromFile.image"
                      />
                      <div class="text-[10px] space-y-0.5">
                        <p>
                          <strong>Amount:</strong> {{ fromFile.currency }}
                          {{ fromFile.amount.toLocaleString() }}
                        </p>
                        <p><strong>From:</strong> {{ fromFile.sender }}</p>
                        <p><strong>To:</strong> {{ fromFile.receiver }}</p>
                        <p>
                          <strong>Bank:</strong> {{ fromFile.interact_bank }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- TO Section -->
                <div class="bg-green-50 p-2 rounded">
                  <p class="text-xs font-semibold text-green-700 mb-2">TO</p>
                  <div class="space-y-2">
                    <div
                      v-for="(toFile, tIdx) in showData[currentIndex].to_files"
                      :key="tIdx"
                      class="bg-white p-2 rounded"
                    >
                      <img
                        :src="
                          toFile.image.includes(
                            'https://thanywhere.sgp1.cdn.digitaloceanspaces.com/images'
                          )
                            ? toFile.image
                            : `https://thanywhere.sgp1.cdn.digitaloceanspaces.com/images/${toFile.image}`
                        "
                        alt="Receipt image"
                        class="w-full h-24 object-cover rounded mb-1"
                        v-if="toFile.image"
                      />
                      <div class="text-[10px] space-y-0.5">
                        <p>
                          <strong>Amount:</strong> {{ toFile.currency }}
                          {{ toFile.amount.toLocaleString() }}
                        </p>
                        <p><strong>From:</strong> {{ toFile.sender }}</p>
                        <p><strong>To:</strong> {{ toFile.receiver }}</p>
                        <p><strong>Bank:</strong> {{ toFile.interact_bank }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p
                v-if="showData[currentIndex].note"
                class="text-xs text-gray-600 mt-2"
              >
                <strong>Note:</strong> {{ showData[currentIndex].note }}
              </p>
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
          <span class="uppercase">Credit Receipt</span>
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
        </div>
      </DialogPanel>
    </Modal>

    <EditCashImageModal
      :show="showUpdateModal"
      :closeAction="() => (showUpdateModal = false)"
      :cashImageData="showUpdateData"
      @refresh="getEmitRefresh"
    />
  </Layout>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useSidebarStore } from "../stores/sidebar";
import Layout from "./Layout.vue";
import { computed, onMounted, ref, watch } from "vue";
import Pagination from "../components/Pagination.vue";
import { useToast } from "vue-toastification";
import EditCashImageModal from "./cash/CashBookUpdate.vue";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  MagnifyingGlassIcon,
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

const sideBarStore = useSidebarStore();
const groupStore = useGroupStore();
const toast = useToast();
const { isShowSidebar } = storeToRefs(sideBarStore);
const bookingReceiptStore = useBookingReceiptStore();
const cashImageStore = useCashImageStore();
const reservationStore = useReservationStore();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
// const { receipts } = storeToRefs(bookingReceiptStore);
const { cashImages, loading } = storeToRefs(cashImageStore);

// Search and filter states
const date_range = ref("");
const filterType = ref("all");
const senderSearch = ref("");
const crmSearch = ref("");
const currencySearch = ref("");
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

const showUpdateModal = ref(false);
const showUpdateData = ref(null);

const showUpdate = (data) => {
  showUpdateModal.value = true;
  showUpdateData.value = data;
};

const getEmitRefresh = async () => {
  console.log("refresh");
  await getAction();
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
const groupedReceipts = computed(() => {
  if (!cashImages.value?.data) return {};

  const groups = {};
  const sortedData = [...cashImages.value.data].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  sortedData.forEach((item) => {
    const date = item.date ? item.date.split(" ")[0] : "Unknown Date";
    const time =
      item.date && item.date.includes(" ") ? item.date.split(" ")[1] : null;
    const itemWithTime = { ...item, time };

    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(itemWithTime);
  });

  return groups;
});

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

  if (filterType.value != "missing" && date_range.value) {
    params.date = date_range.value;
  }

  // if (filterType.value) {
  //   params.type = filterType.value;
  // } else {
  //   params.type = "all";
  // }

  if (senderSearch.value) {
    params.sender = senderSearch.value;
  }

  if (crmSearch.value) {
    params.crm_id = crmSearch.value;
  }

  if (currencySearch.value) {
    params.currency = currencySearch.value;
  }

  if (amountSearch.value) {
    params.amount = amountSearch.value;
  }

  if (authStore.isSuperAdmin) {
    if (interactSearch.value) {
      params.interact_bank = interactSearch.value;
    }
  } else {
    params.interact_bank = "company";
  }

  params.include_relatable = true;

  params.sort_by = "date";
  params.sort_order = "desc";

  params.limit = per_page.value ? per_page.value : 100;

  return params;
});

const total_vat = ref(0);
const total_commission = ref(0);
const total_net_vat = ref(0);
const total_income = ref(0);
const total_expense = ref(0);
const total_income_mmk = ref(0);
const total_expense_mmk = ref(0);

const getAction = async () => {
  await cashImageStore.getListAction(searchParams.value);

  const res = await cashImageStore.getVatSummary({
    date: date_range.value,
  });

  let data = res.data;

  total_vat.value = data.total_vat;
  total_commission.value = data.total_commission;
  total_net_vat.value = data.total_net_vat;
  total_income.value = data.total_income;
  total_expense.value = data.total_expense;
  total_income_mmk.value = data.total_income_mmk;
  total_expense_mmk.value = data.total_expense_mmk;
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
  currencySearch.value = "";
  bankNameSearch.value = "";
  amountSearch.value = "";
  interactSearch.value = "";
  filterType.value = "";
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
    currencySearch,
    bankNameSearch,
    amountSearch,
    interactSearch,
    per_page,
  ],
  debounce(async () => {
    await getAction();
  }, 500)
);
</script>
