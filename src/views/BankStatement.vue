<template>
  <Layout :is_white="true" class="relative">
    <div
      :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
      class="space-x-8 col-span-3 flex justify-start items-center transition-all duration-200 gap-2 text-sm pb-4 absolute top-6"
    >
      <p
        class="text-2xl flex justify-start items-center font-medium text-[#FF613c]"
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
    </div>

    <div class="">
      <!-- Filters and Search -->
      <div class="pb-4 space-y-3">
        <!-- Date and Type Filters -->
        <div class="flex justify-start space-x-2 items-center">
          <p
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
          <div class="relative">
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
      <div class="space-y-6">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-10">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF613c]"
          ></div>
          <p class="mt-2 text-gray-600">Loading transactions...</p>
        </div>

        <!-- No Data State -->
        <div
          v-else-if="!cashImages?.data || cashImages.data.length === 0"
          class="text-center py-10"
        >
          <div class="text-gray-400 text-6xl mb-4">📄</div>
          <p class="text-gray-600">No receipts found</p>
        </div>

        <!-- Transaction Groups by Date -->
        <div v-else>
          <div
            v-for="(group, date) in groupedReceipts"
            :key="date"
            class="mb-6 bg-white rounded-2xl shadow-sm overflow-hidden"
          >
            <!-- Date Header -->
            <div class="pb-3 px-4">
              <h3 class="text-lg font-semibold text-gray-800">
                {{ formatDateHeader(date) }}
              </h3>
              <p class="text-xs text-gray-500">
                {{ group.length }} transaction{{ group.length > 1 ? "s" : "" }}
              </p>
            </div>

            <!-- Transaction Cards -->
            <div class="space-y-2">
              <div
                v-for="item in group"
                :key="item.id"
                class="px-5 py-3 hover:bg-gray-100 bg-gray-50 cursor-pointer transition-colors duration-150"
              >
                <div
                  class="flex justify-between items-start"
                  @click="toggleExpand(item.id)"
                >
                  <!-- Left Side - Transaction Info -->
                  <div class="flex-1">
                    <div class="flex items-center mb-2">
                      <h4 class="font-semibold text-gray-900 text-base">
                        {{ getTransactionType(item) }}
                      </h4>
                    </div>

                    <div class="text-sm text-gray-500 mb-2">
                      {{
                        formatTime(item.time) || extractTime(item.date) || "-"
                      }}
                    </div>

                    <!-- Transaction Details -->
                    <div
                      class="space-y-1 text-sm text-gray-600"
                      v-if="expandedItems[item.id]"
                    >
                      <div
                        v-if="item?.sender && item.sender !== 'null'"
                        class="flex items-center"
                      >
                        <span class="text-gray-400 mr-2">•</span>
                        <span>From: {{ item.sender }}</span>
                      </div>
                      <div
                        v-if="item?.reciever && item.reciever !== 'null'"
                        class="flex items-center"
                      >
                        <span class="text-gray-400 mr-2">•</span>
                        <span>To: {{ item.reciever }}</span>
                      </div>

                      <div class="pt-3">
                        <span
                          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                          :class="getTransactionBadgeClass(item)"
                        >
                          {{
                            item?.relatable_type == "App\\Models\\Booking"
                              ? "Booking"
                              : item?.relatable_type ==
                                "App\\Models\\BookingItemGroup"
                              ? "Group Expense"
                              : "Cash Book"
                          }}
                        </span>
                      </div>
                    </div>

                    <!-- Transaction Type Badge -->
                  </div>

                  <!-- Right Side - Amount and Actions -->
                  <div class="text-right ml-6">
                    <p
                      class="font-bold text-lg mb-3"
                      :class="getAmountColorClass(item)"
                    >
                      {{ formatTransactionAmount(item) }}
                    </p>

                    <!-- Expand Arrow -->
                    <button
                      @click="toggleExpand(item.id)"
                      class="text-white bg-gray-500 px-6 py-1 rounded-full hover:text-white mb-3"
                    >
                      <svg
                        class="w-5 h-5 transform transition-transform"
                        :class="{ 'rotate-180': expandedItems[item.id] }"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </button>

                    <!-- Action Buttons (shown when expanded) -->
                    <div
                      v-if="expandedItems[item.id]"
                      class="flex space-x-1 justify-end"
                    >
                      <button
                        v-if="item?.image"
                        @click="viewReceipt(item)"
                        class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Receipt"
                      >
                        <EyeIcon class="w-4 h-4" />
                      </button>
                      <button
                        @click="goToView(item)"
                        class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <MagnifyingGlassIcon class="w-4 h-4" />
                      </button>
                      <button
                        @click="update(item)"
                        class="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <PencilSquareIcon class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <table
                  class="min-w-full divide-y divide-gray-200 mt-4"
                  v-if="
                    item?.relatable_type == 'App\\Models\\Booking' &&
                    expandedItems[item.id]
                  "
                >
                  <!-- Table Header -->
                  <thead class="bg-gray-50">
                    <tr class="bg-white">
                      <th
                        class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-end"
                      >
                        List
                      </th>
                      <th
                        class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-end"
                      >
                        Product Variation
                      </th>
                      <th
                        class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-end"
                      >
                        Price
                      </th>
                      <th
                        class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-end"
                      >
                        VAT (7%)
                      </th>
                      <th
                        class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-end"
                      >
                        Slip
                      </th>
                      <th
                        class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-end"
                      >
                        Invoice
                      </th>
                      <th
                        class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-end"
                      >
                        Tax Credit
                      </th>
                    </tr>
                  </thead>

                  <!-- Table Body -->
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr class="">
                      <td class="px-6 py-4 whitespace-nowrap text-start">
                        <span
                          class="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded"
                        >
                          Total Sale
                        </span>
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-end w-[200px]"
                      >
                        <span class="text-sm font-mono px-2 py-1 rounded">
                          -
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-end">
                        <span class="text-sm font-mono px-2 py-1 rounded">
                          {{ item?.relatable?.grand_total }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-end">
                        <span class="text-sm font-mono px-2 py-1 rounded">
                          {{ item?.relatable?.output_vat }}
                        </span>
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-end"
                        @click="show(item?.relatable?.receipts)"
                      >
                        <span
                          class="text-sm underline text-blue-600 font-mono px-2 py-1 rounded"
                        >
                          sale slip ({{ item?.relatable?.receipts?.length }})
                        </span>
                      </td>
                      <!-- @click="showTax(item?.customer_documents)" -->
                      <td class="px-6 py-4 whitespace-nowrap text-end">
                        <span
                          class="text-sm underline text-blue-600 font-mono px-2 py-1 rounded"
                        >
                          -
                        </span>
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-end"
                        @click="openCredit(item?.relatable?.id)"
                      >
                        <span
                          class="text-sm underline text-blue-600 font-mono px-2 py-1 rounded"
                        >
                          tax credit
                        </span>
                      </td>
                    </tr>
                    <tr class="">
                      <td class="px-6 py-4 whitespace-nowrap text-start">
                        <span
                          class="text-sm font-mono text-gray-900 bg-red-100 px-2 py-1 rounded"
                        >
                          Deduct Commission
                        </span>
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-end w-[200px]"
                      >
                        <span class="text-sm font-mono px-2 py-1 rounded">
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-end">
                        <span class="text-sm font-mono px-2 py-1 rounded">
                          - {{ item?.relatable?.commission }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-end">
                        <span class="text-sm font-mono px-2 py-1 rounded">
                          -
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-end">
                        <span class="text-sm font-mono px-2 py-1 rounded">
                          -
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-end">
                        <span class="text-sm font-mono px-2 py-1 rounded">
                          -
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-end">
                        <span class="text-sm font-mono px-2 py-1 rounded">
                          -
                        </span>
                      </td>
                    </tr>
                    <tr class="">
                      <td class="px-6 py-4 whitespace-nowrap text-start">
                        <span
                          class="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded"
                        >
                          Subtotal
                        </span>
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-end w-[200px]"
                      >
                        <span class="text-sm font-mono px-2 py-1 rounded">
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-end">
                        <span class="text-sm font-mono px-2 py-1 rounded">
                          <!-- {{ item?.relatable.grand_total }} -->

                          {{
                            item?.relatable?.grand_total -
                            item?.relatable?.commission
                          }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-end">
                        <span class="text-sm font-mono px-2 py-1 rounded">
                          {{
                            (
                              (item?.relatable?.grand_total -
                                item?.relatable?.commission) *
                              0.07
                            ).toFixed(2)
                          }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-end">
                        <span class="text-sm font-mono px-2 py-1 rounded">
                          -
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-end">
                        <span class="text-sm font-mono px-2 py-1 rounded">
                          -
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-end">
                        <span class="text-sm font-mono px-2 py-1 rounded">
                          -
                        </span>
                      </td>
                    </tr>

                    <tr
                      class=""
                      v-for="v in item?.grouped_items"
                      :key="v.group_id"
                    >
                      <td class="px-6 py-4 whitespace-nowrap text-start">
                        <div class="text-sm font-mono">
                          <span
                            @click="goToGroup(v)"
                            class="text-gray-900 bg-blue-100 px-2 mr-2 py-1 rounded"
                          >
                            Group
                          </span>
                          <span
                            v-for="i in v.items"
                            class="text-gray-900 bg-gray-100 px-2 py-1 rounded mr-2"
                            :key="i.id"
                            >{{ i.crm_id.split("_")[1] }}</span
                          >
                        </div>
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-end w-[200px]"
                      >
                        <span class="text-sm font-mono px-2 py-1 rounded">
                          {{ v.items[0]?.product_name }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-end">
                        <span class="text-sm font-mono px-2 py-1 rounded">
                          {{ totalCost(v.items) }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-end">
                        <span class="text-sm font-mono px-2 py-1 rounded">
                          {{ (totalCost(v.items) * 0.07).toFixed(2) }}
                        </span>
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-end"
                        @click="
                          v.related_slip.length > 0 && show(v.related_slip)
                        "
                      >
                        <span
                          class="text-sm font-mono px-2 py-1 rounded"
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
                        class="px-6 py-4 whitespace-nowrap text-end"
                        @click="
                          v.related_tax.length > 0 && showTax(v.related_tax)
                        "
                      >
                        <span
                          class="text-sm font-mono px-2 py-1 rounded"
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
                        <span class="text-sm font-mono px-2 py-1 rounded">
                          -
                        </span>
                      </td>
                    </tr>

                    <tr class="">
                      <td class="px-6 py-4 whitespace-nowrap text-start">
                        <span
                          class="text-sm font-mono text-gray-900 bg-blue-100 px-2 py-1 rounded"
                        >
                          Net Summary
                        </span>
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-end w-[200px]"
                      >
                        <span class="text-sm font-mono px-2 py-1 rounded">
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-end">
                        <span class="text-sm font-mono px-2 py-1 rounded">
                          <!-- {{ item?.relatable.grand_total }} -->
                          {{
                            calculateGrandVat(
                              item?.relatable?.items,
                              item?.relatable?.grand_total
                            ) - item?.relatable?.commission
                          }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-end">
                        <span class="text-sm font-mono px-2 py-1 rounded">
                          {{
                            (
                              calculateVat(
                                item?.relatable?.items,
                                item?.relatable?.output_vat
                              ) -
                              item?.relatable?.commission * 0.07
                            ).toFixed(2)
                          }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-end">
                        <span class="text-sm font-mono px-2 py-1 rounded">
                          -
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-end">
                        <span class="text-sm font-mono px-2 py-1 rounded">
                          -
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-end">
                        <span class="text-sm font-mono px-2 py-1 rounded">
                          -
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
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
                :src="showData[currentIndex].image"
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
                      {{ showData[currentIndex].reciever }}
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
} from "@heroicons/vue/24/outline";
import debounce from "lodash/debounce";
import Swal from "sweetalert2";
import AccountanceHeader from "../components/AccountanceHeader.vue";
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
const bankNameSearch = ref("");
const amountSearch = ref("");
const interactSearch = ref("");
const per_page = ref(10);

// Expanded items for mobile view
const expandedItems = ref({});

// Set current year and month
const currentDate = new Date();
const year = ref(currentDate.getFullYear());
const selectedMonth = ref(currentDate.getMonth() + 1);

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

const goToGroup = (data) => {
  console.log("====================================");
  console.log(data);
  console.log("====================================");
  if (data.group_info.product_type == "App\\Models\\EntranceTicket") {
    router.push(`/group-attraction?id=${data?.group_id}`);
  }
  if (data.group_info.product_type == "App\\Models\\Hotel") {
    router.push(`/group-hotel?id=${data?.group_id}`);
  }
  if (data.group_info.product_type == "App\\Models\\PrivateVanTour") {
    router.push(`/group-private-van-tour?id=${data?.group_id}`);
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

const getTransactionType = (item) => {
  return item.sender != "null" && item.sender
    ? item.sender
    : item.reciever
    ? item.reciever
    : "Payment";
};

const getTransactionBadgeClass = (item) => {
  if (item?.relatable_type == "App\\Models\\Booking") {
    return "bg-green-100 text-green-800";
  } else if (item?.relatable_type == "App\\Models\\BookingItemGroup") {
    return "bg-red-100 text-red-800";
  } else if (item?.relatable_type == "App\\Models\\CashBook") {
    return "bg-blue-100 text-blue-800";
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
      : ".";

  return `${prefix}${formattedAmount} ${item.currency}`;
};

const toggleExpand = (itemId) => {
  expandedItems.value[itemId] = !expandedItems.value[itemId];
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

  if (filterType.value) {
    params.type = filterType.value;
  } else {
    params.type = "all";
  }

  if (senderSearch.value) {
    params.sender = senderSearch.value;
  }

  if (crmSearch.value) {
    params.crm_id = crmSearch.value;
  }

  if (amountSearch.value) {
    params.amount = amountSearch.value;
  }

  if (interactSearch.value) {
    params.interact_bank = interactSearch.value;
  }

  params.limit = per_page.value ? per_page.value : 10;

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
  bankNameSearch.value = "";
  amountSearch.value = "";
  interactSearch.value = "";
  filterType.value = "";
};

const placeholderFile = ref("");
const viewReceipt = (item) => {
  if (item.image) {
    placeholderFile.value = item.image;
  } else {
    toast.warning("No receipt file available");
  }
};

const formatAmount = (amount) => {
  if (!amount) return "-";
  return new Intl.NumberFormat("en-US").format(amount);
};

const goToView = async (data) => {
  if (data.relatable_type == "App\\Models\\Booking") {
    router.push(`bookings/new-update/${data?.relatable?.id}`);
  } else if (data.relatable_type == "App\\Models\\BookingItemGroup") {
    if (data?.relatable?.product_type == "App\\Models\\EntranceTicket") {
      router.push(`/group-attraction?id=${data?.relatable?.id}`);
    } else if (data?.relatable?.product_type == "App\\Models\\Hotel") {
      router.push(`/group-hotel?id=${data?.relatable?.id}`);
    } else if (data?.relatable?.product_type == "App\\Models\\PrivateVanTour") {
      router.push(`/group-private-van-tour?id=${data?.relatable?.id}`);
    }
  } else if (data.relatable_type == "App\\Models\\CashBook") {
    router.push(`/cash-book/${data?.relatable_id}`);
  }
};

const calculateVat = (items, vat) => {
  if (items && vat) {
    let vat_minus = 0;
    items.forEach((item) => {
      if (item.total_cost_price) {
        vat_minus += item.total_cost_price * 0.07;
      }
    });

    return (vat - vat_minus).toFixed(2);
  } else {
    return 0;
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
  reciever: "",
  interact_bank: "",
  currency: "",
  relatable_type: "",
});

const update = (data) => {
  updateModalOpen.value = true;
  updateData.value.id = data.id;
  updateData.value.date = data.date;
  updateData.value.sender = data.sender;
  updateData.value.amount = data.amount;
  updateData.value.reciever = data.reciever;
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
    reciever: "",
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
  await getAction();
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
  ],
  debounce(async () => {
    await getAction();
  }, 500)
);
</script>
