<template>
  <Layout :is_white="true">
    <!-- Header -->
    <div
      :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
      class="space-y-1 transition-all duration-200 gap-2 text-sm pb-4 absolute top-4"
    >
      <div class="text-xl font-semibold text-[#FF613c]">Fill Data</div>
      <p class="text-gray-600">
        Use the following module to make sure all data are added ahead of time.
      </p>
    </div>

    <!-- Main Content -->
    <div class="w-full rounded-lg shadow-sm">
      <!-- Scorecard Section -->
      <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-4">
        <!-- Passport Card -->

        <ScoreCard
          v-if="productType !== 'private_van_tour'"
          :is-active="activeSelect === 'passport'"
          title="Passports Next 2 Days"
          :current-value="groups?.meta?.passport_have_2_days || 0"
          :total-value="groups?.meta?.total_next_2_days || 0"
          :icon="DocumentDuplicateIcon"
          explain_text="Passport filled next 2 days record"
          gradient-from="#ca8a04"
          gradient-to="#a16207"
          border-color="#ca8a04"
          progress-color="#f97316"
          footer-label="Finish Rate"
          :footer-value="`${calculateFinishRate(
            groups?.meta?.total_next_2_days,
            groups?.meta?.passport_have_2_days
          )} ခုကျန်`"
          :progress-width="
            calculateProgressWidth(
              groups?.meta?.total_next_2_days,
              groups?.meta?.passport_have_2_days
            )
          "
          @click="activeSelectAction('passport')"
        />

        <ScoreCard
          v-if="productType === 'private_van_tour'"
          :is-active="activeSelect === 'trip'"
          title="Trips Next 2 Days"
          :current-value="groups?.meta?.filled_next_2_days || 0"
          :total-value="groups?.meta?.total_next_2_days || 0"
          :icon="TruckIcon"
          explain_text="Trip filled next 2 days record"
          gradient-from="#a855f7"
          gradient-to="#9333ea"
          border-color="#9333ea"
          progress-color="#9333ea"
          footer-label="Finish Rate"
          :footer-value="`${calculateFinishRate(
            groups?.meta?.total_next_2_days,
            groups?.meta?.filled_next_2_days
          )} ခုကျန်`"
          :progress-width="
            calculateProgressWidth(
              groups?.meta?.total_next_2_days,
              groups?.meta?.filled_next_2_days
            )
          "
          @click="activeSelectAction('trip')"
        />

        <!-- Customer Card -->
        <ScoreCard
          :is-active="activeSelect === 'customer'"
          title="Customers Next 2 Days"
          :current-value="groups?.meta?.customer_fully_paid || 0"
          :total-value="groups?.meta?.total_next_2_days || 0"
          :icon="CurrencyDollarIcon"
          explain_text="Customer fully paid next 2 days record"
          gradient-from="#ef4444"
          gradient-to="#dc2626"
          border-color="#dc2626"
          progress-color="#ef4444"
          footer-label="Finish Rate"
          :footer-value="`${calculateFinishRate(
            groups?.meta?.total_next_2_days,
            groups?.meta?.customer_fully_paid
          )} ခုကျန်`"
          :progress-width="
            calculateProgressWidth(
              groups?.meta?.total_next_2_days,
              groups?.meta?.customer_fully_paid
            )
          "
          @click="activeSelectAction('customer')"
        />

        <!-- Customer Card -->
        <ScoreCard
          :is-active="activeSelect === 'comment'"
          title="Comments Next 2 Days"
          :current-value="groups?.meta?.fill_status_not_pending_2_days || 0"
          :total-value="groups?.meta?.total_next_2_days || 0"
          :icon="ChatBubbleBottomCenterTextIcon"
          explain_text="Comments have next 2 days record"
          gradient-from="#3b82f6"
          gradient-to="#2563eb"
          border-color="#2563eb"
          progress-color="#3b82f6"
          footer-label="Finish Rate"
          :footer-value="`${calculateFinishRate(
            groups?.meta?.total_next_2_days,
            groups?.meta?.fill_status_not_pending_2_days
          )} ခုကျန်`"
          :progress-width="
            calculateProgressWidth(
              groups?.meta?.total_next_2_days,
              groups?.meta?.fill_status_not_pending_2_days
            )
          "
          @click="activeSelectAction('comment')"
        />
      </div>

      <!-- Filters -->
      <div
        class="p-3 md:p-4 border-b border-gray-200 sticky bg-white -top-6 z-20"
      >
        <div class="flex items-center justify-between gap-4">
          <div class="relative">
            <div
              class="flex justify-between cursor-pointer items-center space-x-2"
              @click="showToggleType = !showToggleType"
            >
              <p
                class="capitalize whitespace-nowrap text-[#FF613c] font-semibold text-xl"
              >
                {{
                  productType == "hotel"
                    ? "Hotel"
                    : productType == "attraction"
                    ? "Attraction"
                    : "Van Tour"
                }}
              </p>
              <ChevronDownIcon class="w-5 text-[#FF613c] h-5" />
            </div>
            <div
              v-if="showToggleType"
              class="absolute top-10 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
            >
              <p
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                @click="productType = 'hotel'"
              >
                Hotel
              </p>
              <p
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                @click="productType = 'attraction'"
              >
                Attraction
              </p>
              <p
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                @click="productType = 'private_van_tour'"
              >
                Van Tour
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-1"></div>

          <div class="flex items-center gap-2">
            <!-- Day filter -->
            <button
              @click="getExpenseDate('today')"
              :class="
                expense_date_selected == 'today'
                  ? 'text-white bg-[#e55139]'
                  : 'text-[#FF613c] bg-white'
              "
              class="flex items-center gap-2 px-4 py-2.5 text-xs hover:text-white rounded-full cursor-pointer hover:bg-[#e55139] transition-colors"
            >
              Today
            </button>
            <button
              @click="getExpenseDate('tomorrow')"
              :class="
                expense_date_selected == 'tomorrow'
                  ? 'text-white bg-[#e55139]'
                  : 'text-[#FF613c] bg-white'
              "
              class="flex items-center gap-2 px-4 py-2.5 text-xs hover:text-white rounded-full cursor-pointer hover:bg-[#e55139] transition-colors"
            >
              Tomorrow
            </button>
            <button
              @click="getExpenseDate('next 2 days')"
              :class="
                expense_date_selected == 'next 2 days'
                  ? 'text-white bg-[#e55139]'
                  : 'text-[#FF613c] bg-white'
              "
              class="flex items-center gap-2 px-4 py-2.5 text-xs hover:text-white rounded-full cursor-pointer hover:bg-[#e55139] transition-colors"
            >
              Next 2 Days
            </button>
            <button
              @click="getExpenseDate('this month')"
              :class="
                expense_date_selected == 'this month'
                  ? 'text-white bg-[#e55139]'
                  : 'text-[#FF613c] bg-white'
              "
              class="flex items-center gap-2 px-4 py-2.5 text-xs hover:text-white rounded-full cursor-pointer hover:bg-[#e55139] transition-colors"
            >
              This Month
            </button>
            <!-- Search CRM ID -->
            <div class="relative min-w-[180px]">
              <input
                type="search"
                v-model="searchKey"
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

            <!-- Search Hotel Name -->
            <div class="relative min-w-[180px]">
              <input
                type="search"
                v-model="hotelName"
                :placeholder="
                  productType == 'hotel'
                    ? 'Search Hotel'
                    : productType == 'attraction'
                    ? 'Search Attraction'
                    : 'Search Van Tour'
                "
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
            <!-- Filters Button -->
            <button
              @click="filterShow = !filterShow"
              class="bg-[#FF613c] px-4 rounded-full shadow-lg py-2.5 flex justify-center items-center gap-x-2 text-white text-xs cursor-pointer hover:bg-[#e55139] transition-colors"
            >
              <Bars3BottomRightIcon class="w-4 h-4 text-white" />
            </button>
            <!-- Refresh Button -->
            <button
              @click="clearAllFilters"
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
      </div>

      <!-- Table -->
      <div class="overflow-x-auto relative w-[90vw] h-[62vh] overflow-y-auto">
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
                <td class="px-2 md:px-4 py-4">
                  <div class="flex items-center justify-center">
                    <div
                      v-if="rowLoading === item.id"
                      class="w-5 h-5 border-2 border-gray-200 border-t-[#FF613c] rounded-full animate-spin"
                    ></div>
                    <template v-else>
                      <div v-if="productType != 'private_van_tour'">
                        <XCircleIcon
                          v-if="expandedRow !== item.id && !item.has_passport"
                          class="w-5 h-5 text-red-500"
                        />
                        <ArrowDownCircleIcon
                          v-if="expandedRow === item.id && !item.has_passport"
                          class="w-5 h-5 text-red-500"
                        />
                        <CheckBadgeIcon
                          v-if="item.has_passport"
                          :class="expandedRow === item.id ? 'rotate-180' : ''"
                          class="w-5 h-5 text-green-500"
                        />
                      </div>
                      <div v-else>
                        <XCircleIcon
                          v-if="
                            expandedRow !== item.id && !item.is_fully_filled
                          "
                          class="w-5 h-5 text-red-500"
                        />
                        <ArrowDownCircleIcon
                          v-if="
                            expandedRow === item.id && !item.is_fully_filled
                          "
                          class="w-5 h-5 text-red-500"
                        />
                        <CheckBadgeIcon
                          v-if="item.is_fully_filled"
                          :class="expandedRow === item.id ? 'rotate-180' : ''"
                          class="w-5 h-5 text-green-500"
                        />
                      </div>
                    </template>
                  </div>
                </td>

                <!-- CRM ID -->
                <td class="px-2 md:px-4 py-4 relative">
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
                  <div class="">
                    <p
                      class="absolute top-2 right-4 bg-white text-black px-2 py-1 text-xs rounded-full border border-[#FF613c] font-medium"
                    >
                      {{ item.items.length }}
                    </p>
                    <p
                      class="text-sm text-white line-clamp-1 px-3 py-1.5 bg-[#FF613c] rounded-full shadow-md truncate min-w-[100px] max-w-[180px] cursor-pointer"
                    >
                      {{ item.product_name }}
                    </p>
                  </div>
                </td>

                <!-- Customer Name -->
                <td class="px-2 md:px-4 py-4 cursor-pointer relative">
                  <div class="">
                    <p
                      class="text-sm line-clamp-1 truncate min-w-[100px] max-w-[200px] cursor-pointer"
                    >
                      {{ item.customer_name }}
                    </p>
                  </div>
                </td>

                <!-- Expense Status -->
                <td class="px-2 md:px-4 py-4">
                  <p
                    class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                    :class="getExpenseStatusClass(item.customer_payment_status)"
                  >
                    {{ formatExpenseStatus(item.customer_payment_status) }}
                  </p>
                  <span
                    class="px-1 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap"
                    :class="getPaymentStatusClass(item.expense_status)"
                  >
                    E: {{ formatPaymentStatus(item.expense_status) }}
                  </span>
                </td>

                <!-- Booking Date -->
                <td class="px-2 md:px-4 py-4">
                  <div class="text-sm text-gray-700">
                    <div class="whitespace-nowrap">
                      {{ formatDate(item.firstest_service_date) }}
                    </div>
                    <div
                      class="text-xs text-gray-500 whitespace-nowrap"
                      v-if="productType == 'hotel'"
                    >
                      to {{ formatDate(item.latest_service_date) }}
                    </div>
                  </div>
                </td>

                <!-- Total Sale -->
                <td class="px-2 md:px-4 py-4 text-sm font-medium text-gray-900">
                  <p>
                    {{ item.booking_sale_amount }}
                  </p>
                </td>

                <!-- Balance Due -->
                <td class="px-2 md:px-4 py-4 text-sm font-medium text-gray-900">
                  <p>
                    {{ item.booking_balance_due }}
                  </p>
                </td>

                <!-- Comment status -->
                <td class="px-2 md:px-4 py-4 text-sm font-medium text-gray-900">
                  <p
                    :class="
                      item.fill_status == 'pending' || item.fill_status == null
                        ? 'text-red-500'
                        : 'text-green-500'
                    "
                  >
                    {{
                      item.fill_status == null ? "pending" : item.fill_status
                    }}
                  </p>
                </td>

                <!-- Margin Score -->
                <td class="px-2 md:px-4 py-4 text-sm font-medium text-gray-900">
                  <p>
                    {{ marginCalc(item.total_amount, item.total_cost_price) }}
                  </p>
                  <span class="text-xs text-gray-500"
                    >D: {{ totalDiscount(item.items) }}</span
                  >
                </td>

                <!-- Actions -->
                <td
                  class="px-2 flex justify-end items-center space-x-2 md:px-4 py-4"
                >
                  <div class="relative group">
                    <!-- Main action button -->
                    <button
                      :class="tableActions[0]?.class"
                      :title="tableActions[0]?.title"
                      class="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <span v-if="tableActions[0]?.label">Action</span>
                      <svg
                        v-if="tableActions.length > 1"
                        class="w-4 h-4 transition-transform group-hover:rotate-180"
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
                    </button>

                    <!-- Dropdown menu -->
                    <div
                      v-if="tableActions.length > 1"
                      class="absolute right-0 top-full p-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 space-y-2"
                    >
                      <button
                        v-for="action in tableActions"
                        :key="action.name"
                        @click.stop="action.handler(item)"
                        :class="action.class"
                        :title="action.title"
                        class="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        <component :is="action.icon" class="w-5 h-5" />
                        <span class="text-xs">{{
                          action.label || action.name
                        }}</span>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Expandable Details Row -->
              <tr v-show="expandedRow === item.id">
                <td colspan="14" class="px-2 md:px-4 py-0">
                  <div class="bg-gray-50 rounded-lg p-4 mb-2">
                    <!-- Tab Switch -->
                    <div class="flex items-center gap-2 mb-4">
                      <button
                        @click="activeTab[item.id] = 'passport'"
                        :class="[
                          'flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all',
                          activeTab[item.id] === 'passport' ||
                          !activeTab[item.id]
                            ? 'bg-white text-[#FF613c] shadow-sm border border-[#FF613c]'
                            : 'bg-transparent text-gray-600 hover:bg-white/50',
                        ]"
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        {{
                          productType == "hotel" || productType == "attraction"
                            ? "Passport"
                            : "Route"
                        }}
                        List
                        <p v-if="productType != 'private_van_tour'">
                          <span
                            v-if="passportLoading[item.id]"
                            class="inline-block"
                          >
                            <div
                              class="w-3 h-3 border-2 border-gray-300 border-t-[#FF613c] rounded-full animate-spin"
                            ></div>
                          </span>
                          <span v-else
                            >({{ passportLists[item.id]?.length || 0 }})</span
                          >
                        </p>
                        <p v-if="productType == 'private_van_tour'">
                          <span
                            v-if="passportLoading[item.id]"
                            class="inline-block"
                          >
                            <div
                              class="w-3 h-3 border-2 border-gray-300 border-t-[#FF613c] rounded-full animate-spin"
                            ></div>
                          </span>
                          <span v-else
                            >({{
                              itemLists[item.id]?.items?.length || 0
                            }})</span
                          >
                        </p>
                      </button>

                      <button
                        @click="activeTab[item.id] = 'rooms'"
                        :class="[
                          'flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all',
                          activeTab[item.id] === 'rooms'
                            ? 'bg-white text-[#FF613c] shadow-sm border border-[#FF613c]'
                            : 'bg-transparent text-gray-600 hover:bg-white/50',
                        ]"
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
                        {{
                          productType == "hotel"
                            ? "Room"
                            : productType == "attraction"
                            ? "Ticket"
                            : "Car"
                        }}
                        Details
                        <span v-if="itemLoading[item.id]" class="inline-block">
                          <div
                            class="w-3 h-3 border-2 border-gray-300 border-t-[#FF613c] rounded-full animate-spin"
                          ></div>
                        </span>
                        <span v-else
                          >({{ itemLists[item.id]?.items?.length || 0 }})</span
                        >
                      </button>
                      <button
                        @click="activeTab[item.id] = 'slips'"
                        :class="[
                          'flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all',
                          activeTab[item.id] === 'slips'
                            ? 'bg-white text-[#FF613c] shadow-sm border border-[#FF613c]'
                            : 'bg-transparent text-gray-600 hover:bg-white/50',
                        ]"
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
                        Payment Slips
                        <span v-if="itemLoading[item.id]" class="inline-block">
                          <div
                            class="w-3 h-3 border-2 border-gray-300 border-t-[#FF613c] rounded-full animate-spin"
                          ></div>
                        </span>
                        <span v-else
                          >({{
                            itemLists[item.id]?.booking?.receipts?.length || 0
                          }})</span
                        >
                      </button>
                    </div>

                    <!-- Room Details Section -->
                    <div v-show="activeTab[item.id] === 'rooms'">
                      <div
                        v-if="itemLoading[item.id]"
                        class="flex justify-center items-center py-8"
                      >
                        <div class="flex flex-col items-center gap-3">
                          <div
                            class="w-8 h-8 border-4 border-gray-200 border-t-[#FF613c] rounded-full animate-spin"
                          ></div>
                          <p class="text-xs text-gray-500">Loading rooms...</p>
                        </div>
                      </div>
                      <div
                        v-else
                        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3"
                      >
                        <div
                          v-for="(roomItem, index) in itemLists[item.id]
                            ?.items || []"
                          :key="index"
                          class="bg-white relative rounded-lg p-3 border border-gray-200 hover:border-[#FF613c] transition-colors"
                        >
                          <button
                            @click.stop="goToRoomDetail(roomItem)"
                            class="absolute right-2 top-2"
                          >
                            <PencilSquareIcon
                              class="w-5 h-5 text-gray-800 hover:text-[#FF613c]"
                            />
                          </button>
                          <div class="flex items-start justify-between gap-2">
                            <div class="flex-1">
                              <p
                                class="text-sm font-medium line-clamp-1 max-w-[250px] text-gray-900 mb-1"
                              >
                                {{
                                  productType == "hotel"
                                    ? roomItem?.room?.name
                                    : productType == "attraction"
                                    ? roomItem?.variation?.name
                                    : roomItem?.car?.name
                                }}
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
                                  {{ roomItem.service_date }}
                                  <span v-if="productType == 'hotel'"
                                    >to
                                    {{
                                      formatDate(roomItem.checkout_date)
                                    }}</span
                                  >
                                </span>
                              </div>
                              <div
                                class="flex items-center mt-1 gap-1 text-xs text-gray-500"
                              >
                                <DocumentCurrencyDollarIcon class="w-4 h-4" />
                                <span
                                  >Cost : {{ roomItem.cost_price }} (total :
                                  {{ roomItem.total_cost_price }})</span
                                >
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Slip Section -->
                    <div v-show="activeTab[item.id] === 'slips'">
                      <div
                        v-if="itemLoading[item.id]"
                        class="flex justify-center items-center py-8"
                      >
                        <div class="flex flex-col items-center gap-3">
                          <div
                            class="w-8 h-8 border-4 border-gray-200 border-t-[#FF613c] rounded-full animate-spin"
                          ></div>
                          <p class="text-xs text-gray-500">
                            Loading payment slips...
                          </p>
                        </div>
                      </div>
                      <div
                        v-else
                        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3"
                      >
                        <div
                          v-for="(slip, index) in itemLists[item.id]?.booking
                            ?.receipts || []"
                          :key="index"
                          class="bg-white relative flex gap-x-2 justify-between rounded-lg p-3 border border-gray-200 hover:border-[#FF613c] transition-colors"
                        >
                          <img
                            :src="slip.image"
                            class="w-20 h-20 object-cover"
                            alt=""
                          />
                          <div>
                            <p class="text-sm font-medium text-gray-900 mb-1">
                              {{ slip.receiver }}
                            </p>
                            <div
                              class="flex items-center gap-1 text-xs text-gray-500"
                            >
                              <DocumentCurrencyDollarIcon class="w-4 h-4" />
                              <span>A : {{ slip.amount }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Passport List Section -->
                    <div
                      v-show="
                        activeTab[item.id] === 'passport' || !activeTab[item.id]
                      "
                    >
                      <div
                        v-if="passportLoading[item.id]"
                        class="flex justify-center items-center py-8"
                      >
                        <div class="flex flex-col items-center gap-3">
                          <div
                            class="w-8 h-8 border-4 border-gray-200 border-t-[#FF613c] rounded-full animate-spin"
                          ></div>
                          <p class="text-xs text-gray-500">
                            {{
                              productType === "private_van_tour"
                                ? "Loading routes..."
                                : "Loading passports..."
                            }}
                          </p>
                        </div>
                      </div>
                      <!-- Content -->
                      <div
                        v-else
                        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3"
                      >
                        <!-- Van Tour - Show Car Items with Route Data -->
                        <template v-if="productType === 'private_van_tour'">
                          <div
                            v-for="carItem in itemLists[item.id]?.items || []"
                            :key="carItem.id"
                            @click="openEditRouteModal(carItem, item)"
                            class="bg-white rounded-lg p-4 border border-gray-200 hover:border-[#FF613c] transition-colors group cursor-pointer"
                          >
                            <div class="flex items-start gap-3">
                              <div
                                class="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center flex-shrink-0"
                              >
                                <TruckIcon class="w-6 h-6 text-orange-600" />
                              </div>

                              <div class="flex-1 min-w-0">
                                <!-- Car Name & Date -->
                                <div
                                  class="flex items-start justify-between gap-2 mb-2"
                                >
                                  <h4
                                    class="text-sm font-semibold text-gray-900 truncate"
                                  >
                                    {{ carItem.car?.name || "No Car" }}
                                  </h4>
                                  <span
                                    class="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 rounded-full whitespace-nowrap"
                                  >
                                    {{ formatDate(carItem.service_date) }}
                                  </span>
                                </div>

                                <!-- Route Details -->
                                <div class="space-y-1">
                                  <div
                                    class="flex items-center gap-1 text-xs text-gray-500"
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
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    <span class="line-clamp-1"
                                      >Pickup:
                                      {{ carItem.pickup_time || "-" }}</span
                                    >
                                  </div>
                                  <div
                                    class="flex items-center gap-1 text-xs text-gray-500"
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
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                      />
                                    </svg>
                                    <span
                                      >Pax: {{ carItem.total_pax || "-" }}</span
                                    >
                                  </div>
                                  <div
                                    class="flex items-center gap-1 text-xs text-gray-500"
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
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                      />
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                      />
                                    </svg>
                                    <span class="truncate line-clamp-1">{{
                                      carItem.pickup_location ||
                                      "No pickup location"
                                    }}</span>
                                  </div>
                                  <div
                                    v-if="carItem.route_plan"
                                    class="flex items-start gap-1 text-xs text-gray-500"
                                  >
                                    <svg
                                      class="w-3 h-3 mt-0.5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                                      />
                                    </svg>
                                    <span class="truncate line-clamp-2">{{
                                      carItem.route_plan
                                    }}</span>
                                  </div>
                                  <div
                                    v-if="carItem.extra_collect_amount"
                                    class="flex items-center gap-1 text-xs"
                                  >
                                    <CurrencyDollarIcon
                                      class="w-3 h-3 text-green-600"
                                    />
                                    <span class="font-medium text-green-600"
                                      >{{
                                        carItem.extra_collect_amount
                                      }}
                                      THB</span
                                    >
                                  </div>
                                </div>

                                <!-- Edit Indicator -->
                                <div
                                  class="mt-3 text-xs text-[#FF613c] font-medium flex items-center"
                                >
                                  <PencilSquareIcon class="w-4 h-4 mr-1" />
                                  Click to edit route
                                </div>
                              </div>
                            </div>
                          </div>
                        </template>

                        <!-- Hotel/Attraction - Show Passport List -->
                        <template v-else>
                          <!-- Add New Passport Card -->
                          <div
                            @click="openNewPassportModal(item)"
                            class="bg-white rounded-lg min-h-[100px] cursor-pointer text-[#FF613c] text-sm flex justify-center items-center border border-[#FF613c] p-4 border-dashed hover:bg-[#FF613c]/5 transition-colors group"
                          >
                            <PlusCircleIcon class="w-5 h-5 mr-2" />
                            Add New Passport
                          </div>

                          <!-- Passport Cards -->
                          <div
                            v-for="passport in passportLists[item.id] || []"
                            :key="passport.id"
                            @click="openEditPassportModal(passport, item)"
                            class="bg-white rounded-lg p-4 border border-gray-200 hover:border-[#FF613c] transition-colors group cursor-pointer"
                          >
                            <div class="flex items-start gap-3">
                              <div
                                class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center flex-shrink-0"
                              >
                                <DocumentDuplicateIcon
                                  class="w-6 h-6 text-blue-600"
                                />
                              </div>

                              <div class="flex-1 min-w-0">
                                <div
                                  class="flex items-start justify-between gap-2 mb-2"
                                >
                                  <h4
                                    class="text-sm font-semibold text-gray-900 truncate"
                                  >
                                    {{ passport.meta?.name || "No Name" }}
                                  </h4>
                                </div>

                                <div class="space-y-1">
                                  <div
                                    class="flex items-center justify-between text-xs"
                                  >
                                    <span class="text-gray-500">Pass NO.:</span>
                                    <span class="font-medium text-gray-900">
                                      {{ passport.meta?.passport_number }}
                                    </span>
                                  </div>
                                </div>

                                <div
                                  class="mt-3 text-xs text-[#FF613c] font-medium flex items-center"
                                >
                                  <PencilSquareIcon class="w-4 h-4 mr-1" />
                                  Click to edit
                                </div>
                              </div>
                            </div>
                          </div>
                        </template>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Comments Row -->
              <tr v-if="item.fill_comment" class="bg-gray-50">
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
          v-if="!loading && (!groups?.data || groups.data.length === 0)"
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

    <!-- Filter Modal -->
    <Modal :isOpen="filterShow" @closeModal="filterShow = false">
      <DialogPanel
        class="w-full max-w-5xl transform rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-lg font-semibold text-gray-900 mb-4 flex justify-between items-center"
        >
          <div class="flex items-center gap-2">
            <FunnelIcon class="w-6 h-6 text-[#FF613c]" />
            Advanced Filters
          </div>
          <button
            @click="filterShow = false"
            class="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon class="w-5 h-5 text-gray-500" />
          </button>
        </DialogTitle>

        <div class="space-y-4">
          <!-- Customer Payment Status -->
          <div>
            <label class="text-xs font-medium text-gray-700 mb-3 block"
              >Customer Payment Status</label
            >
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
              <button
                v-for="status in statusOptions"
                :key="status.value"
                @click="paymentStatus = status.value"
                :class="[
                  'flex items-center gap-3 px-4 py-3 border-2 rounded-lg transition-all',
                  paymentStatus === status.value
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
                  v-if="paymentStatus === status.value"
                  class="flex-shrink-0"
                >
                  <CheckIcon :class="`w-5 h-5 text-${status.color}-600`" />
                </div>
              </button>
            </div>
          </div>
          <div v-if="productType != 'private_van_tour'">
            <label class="text-xs font-medium text-gray-700 mb-3 block"
              >Passport</label
            >
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
              <button
                v-for="status in passportOptons"
                :key="status.value"
                @click="passportFilter = status.value"
                :class="[
                  'flex items-center gap-3 px-4 py-3 border-2 rounded-lg transition-all',
                  passportFilter === status.value
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
                  v-if="passportFilter === status.value"
                  class="flex-shrink-0"
                >
                  <CheckIcon :class="`w-5 h-5 text-${status.color}-600`" />
                </div>
              </button>
            </div>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-700 mb-3 block"
              >Comments</label
            >
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
              <button
                v-for="status in commmentOptons"
                :key="status.value"
                @click="commentFilter = status.value"
                :class="[
                  'flex items-center gap-3 px-4 py-3 border-2 rounded-lg transition-all',
                  commentFilter === status.value
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
                  v-if="commentFilter === status.value"
                  class="flex-shrink-0"
                >
                  <CheckIcon :class="`w-5 h-5 text-${status.color}-600`" />
                </div>
              </button>
            </div>
          </div>
          <div v-if="productType == 'private_van_tour'">
            <label class="text-xs font-medium text-gray-700 mb-3 block"
              >Fill Status</label
            >
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
              <button
                v-for="status in fillOptons"
                :key="status.value"
                @click="fillStatusFilter = status.value"
                :class="[
                  'flex items-center gap-3 px-4 py-3 border-2 rounded-lg transition-all',
                  fillStatusFilter === status.value
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
                  v-if="fillStatusFilter === status.value"
                  class="flex-shrink-0"
                >
                  <CheckIcon :class="`w-5 h-5 text-${status.color}-600`" />
                </div>
              </button>
            </div>
          </div>

          <!-- Date Range Filter -->
          <div>
            <label class="text-xs font-medium text-gray-700 mb-2 block"
              >Service Date Range</label
            >
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs text-gray-600 mb-1 block"
                  >Start Date</label
                >
                <input
                  type="date"
                  v-model="startDate"
                  class="border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF613c] w-full py-2 text-base rounded-full shadow-sm"
                />
              </div>
              <div>
                <label class="text-xs text-gray-600 mb-1 block">End Date</label>
                <input
                  type="date"
                  v-model="endDate"
                  class="border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF613c] w-full py-2 text-base rounded-full shadow-sm"
                />
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-3 pt-4 border-t">
            <button
              @click="clearAllFilters"
              class="flex-1 text-sm bg-gray-100 px-4 py-2.5 rounded-full text-center text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors font-medium"
            >
              Clear All
            </button>
            <button
              @click="applyFilters"
              class="flex-1 text-sm bg-[#FF613c] px-4 py-2.5 rounded-full text-center text-white cursor-pointer hover:bg-[#e55139] transition-colors font-medium"
            >
              Apply Filters
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
          <div>
            <!-- Status Options -->
            <div class="space-y-2">
              <button
                @click="fill_status = 'pending'"
                class="w-full flex items-center justify-between px-4 py-3 border-2 border-yellow-200 rounded-lg hover:bg-yellow-50 transition-all duration-200 group"
                :class="
                  fill_status === 'pending'
                    ? 'bg-yellow-50 border-yellow-400'
                    : ''
                "
              >
                <div class="flex items-center gap-3">
                  <div
                    class="p-2 bg-yellow-100 rounded-full group-hover:bg-yellow-200 transition-colors"
                  >
                    <ExclamationTriangleIcon class="w-5 h-5 text-yellow-600" />
                  </div>
                  <div class="text-left">
                    <p class="text-sm font-medium text-gray-900">Pending</p>
                    <p class="text-xs text-gray-500">Awaiting</p>
                  </div>
                </div>
                <CheckIcon
                  v-if="fill_status === 'pending'"
                  class="w-5 h-5 text-yellow-600"
                />
              </button>

              <button
                @click="fill_status = 'no_comment'"
                class="w-full flex items-center justify-between px-4 py-3 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-all duration-200 group"
                :class="
                  fill_status === 'no_comment'
                    ? 'bg-green-50 border-green-400'
                    : ''
                "
              >
                <div class="flex items-center gap-3">
                  <div
                    class="p-2 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors"
                  >
                    <CheckIcon class="w-5 h-5 text-green-600" />
                  </div>
                  <div class="text-left">
                    <p class="text-sm font-medium text-gray-900">No Comment</p>
                    <p class="text-xs text-gray-500">No Comment</p>
                  </div>
                </div>
                <CheckIcon
                  v-if="fill_status === 'no_comment'"
                  class="w-5 h-5 text-green-600"
                />
              </button>

              <button
                @click="fill_status = 'other'"
                class="w-full flex items-center justify-between px-4 py-3 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-all duration-200 group"
                :class="
                  fill_status === 'other'
                    ? 'bg-purple-50 border-purple-400'
                    : ''
                "
              >
                <div class="flex items-center gap-3">
                  <div
                    class="p-2 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors"
                  >
                    <InformationCircleIcon class="w-5 h-5 text-purple-600" />
                  </div>
                  <div class="text-left">
                    <p class="text-sm font-medium text-gray-900">Other</p>
                    <p class="text-xs text-gray-500">Add Comment</p>
                  </div>
                </div>
                <CheckIcon
                  v-if="fill_status === 'other'"
                  class="w-5 h-5 text-purple-600"
                />
              </button>
            </div>
          </div>
          <textarea
            v-if="fill_status == 'other'"
            v-model="comment"
            class="w-full rounded-lg border border-gray-200 focus:outline-none px-4 py-3 text-sm text-gray-700"
            rows="5"
            placeholder="Comment"
          ></textarea>
          <div class="pt-4 border-t border-gray-200">
            <button
              @click="addCommentAction"
              :disabled="commentSubmitting"
              class="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <div
                v-if="commentSubmitting"
                class="w-4 h-4 border-2 border-gray-300 border-t-[#FF613c] rounded-full animate-spin"
              ></div>
              <span>{{ commentSubmitting ? "Saving..." : "+ Save" }}</span>
            </button>
          </div>
        </div>
      </DialogPanel>
    </Modal>

    <!-- Passport Modal -->
    <PassportModal
      :isOpen="invoiceModalOpen"
      :passportData="selectedInvoice"
      :groupId="selectedItem?.id"
      :groupData="selectedItem"
      @close="closePassportModal"
      @refresh="refreshPassports"
    />

    <!-- Route Modal -->
    <RouteModal
      :isOpen="routeModalOpen"
      :routeData="selectedRoute"
      :itemData="selectedRoute"
      :groupId="selectedItem?.id"
      @close="closeRouteModal"
      @refresh="refreshRoutes"
    />
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import Layout from "./Layout.vue";
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
  PencilSquareIcon,
  ArrowDownCircleIcon,
  PlusCircleIcon,
  DocumentCurrencyDollarIcon,
  Bars3BottomRightIcon,
  ChevronDownIcon,
  TruckIcon,
} from "@heroicons/vue/24/outline";
import {
  ChatBubbleBottomCenterTextIcon,
  CheckBadgeIcon,
  CurrencyDollarIcon,
  DocumentDuplicateIcon,
} from "@heroicons/vue/24/solid";
import { useToast } from "vue-toastification";
import { useGroupStore } from "../stores/group";
import Pagination from "../components/Pagination.vue";
import Modal from "../components/Modal.vue";
import { useAuthStore } from "../stores/auth";
import { useSidebarStore } from "../stores/sidebar";
import PassportModal from "./GroupComponent/ExpensePart/Passport.vue";
import RouteModal from "./GroupComponent/ExpensePart/RouteModal.vue";
import { useCarBookingStore } from "../stores/carbooking";
import ScoreCard from "./GroupComponent/ExpensePart/CartScale.vue";

const toast = useToast();
const sidebarStore = useSidebarStore();
const { isShowSidebar } = storeToRefs(sidebarStore);
const groupStore = useGroupStore();
const { groups, loading } = storeToRefs(groupStore);
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
// Add store
const carBookingStore = useCarBookingStore();

const searchKey = ref("");
const hotelName = ref("");
const statusFilter = ref("all");
const filterShow = ref(false);
const deadlineDate = ref("");
const deadlineNumber = ref(2);
const startDate = ref("");
const endDate = ref("");
const selectedItem = ref(null);
const paymentStatus = ref("all");
const expandedRow = ref(null);
const rowLoading = ref(null);
const activeTab = ref({});
const openCommentModal = ref(false);
const comment = ref("");
const fill_status = ref("pending");
const invoiceStatus = ref("all");
const activeSelect = ref("");
const sentExpenseMail = ref("");
const passportFilter = ref("");
const commentFilter = ref("");
const fillStatusFilter = ref("");
const productType = ref("hotel");
const invoiceModalOpen = ref(false);
const selectedInvoice = ref(null);
const passportLists = ref({});
const itemLists = ref({});
const showToggleType = ref(false);
const expense_date_selected = ref("");
const commentSubmitting = ref(false);
const passportLoading = ref({});
const itemLoading = ref({});
const routeModalOpen = ref(false);
const selectedRoute = ref(null);

const tableHeaders = [
  { key: "data", label: "Data", class: "whitespace-nowrap" },
  { key: "crm_id", label: "CRM ID", class: "whitespace-nowrap" },
  { key: "hotel_name", label: "Product Name", class: "" },
  { key: "customer_name", label: "Customer Name", class: "" },
  { key: "payment_status", label: "Payment Status", class: "" },
  { key: "booking_date", label: "Booking Date", class: "" },
  { key: "sale_amount", label: "Sale Amount", class: "" },
  { key: "balance_due", label: "Balance Due", class: "" },
  { key: "comment", label: "Comment", class: "" },
  { key: "margin_score", label: "Margin Score", class: "whitespace-nowrap" },
  { key: "actions", label: "Actions", class: "text-right" },
];

const statusOptions = [
  {
    value: "",
    label: "Clear",
    description: "Status clear",
    icon: XMarkIcon,
    color: "gray",
  },
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

const passportOptons = [
  {
    value: "",
    label: "Clear",
    description: "Status clear",
    icon: XMarkIcon,
    color: "gray",
  },
  {
    value: "not_have",
    label: "Not Have",
    description: "Awaiting passport",
    icon: ExclamationTriangleIcon,
    color: "red",
  },
  {
    value: "have",
    label: "Have",
    description: "Passport received",
    icon: CheckIcon,
    color: "green",
  },
];

const commmentOptons = [
  {
    value: "",
    label: "Clear",
    description: "Status clear",
    icon: XMarkIcon,
    color: "gray",
  },
  {
    value: "pending",
    label: "Pending",
    description: "Awaiting comment",
    icon: ExclamationTriangleIcon,
    color: "red",
  },
  {
    value: "no_comment",
    label: "No Comment",
    description: "No comment",
    icon: CheckIcon,
    color: "green",
  },
  {
    value: "other",
    label: "Other",
    description: "Other",
    icon: CheckIcon,
    color: "green",
  },
];

const fillOptons = [
  {
    value: "",
    label: "Clear",
    description: "Status clear",
    icon: XMarkIcon,
    color: "gray",
  },
  {
    value: "unfilled",
    label: "Unfilled",
    description: "Awaiting filled",
    icon: ExclamationTriangleIcon,
    color: "red",
  },
  {
    value: "filled",
    label: "Filled",
    description: "Filled",
    icon: CheckIcon,
    color: "green",
  },
];

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

const totalDiscount = (items) => {
  return items.reduce((total, item) => total + (item.discount || 0), 0);
};

const marginCalc = (sale, cost) => {
  if (cost === 0) return "Missing ";
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
    fully_paid: "text-green-500",
    not_paid: "text-red-500",
    partially_paid: "text-yellow-500",
  };
  return classes[status] || "text-gray-500";
};

const formatPaymentStatus = (status) => {
  const statuses = {
    fully_paid: "Paid",
    not_paid: "Not Paid",
    partially_paid: "Partial",
  };
  return statuses[status] || status;
};

const getComments = (item) => {
  const comments = [];
  if (item.fill_comment) {
    comments.push({
      type: "Sale",
      text: item.fill_comment,
      badgeClass: "bg-blue-500",
      bgClass: "bg-blue-100",
    });
  }
  return comments;
};

const getListAction = async () => {
  await groupStore.getListAction(watchSystem.value);
};

const changePage = async (url) => {
  await groupStore.getChangePage(url, watchSystem.value);
};

const toggleRow = async (itemId) => {
  if (expandedRow.value === itemId) {
    expandedRow.value = null;
  } else {
    rowLoading.value = itemId;
    expandedRow.value = itemId;

    if (!passportLists.value[itemId] && !itemLists.value[itemId]) {
      await Promise.all([fetchPassports(itemId), fetchGroupExpenses(itemId)]);
    }

    rowLoading.value = null;
  }
};

const searchAction = async () => {
  filterShow.value = false;
  await getListAction();
};

const clearAllFilters = () => {
  deadlineDate.value = "";
  deadlineNumber.value = 2;
  invoiceStatus.value = "all";
  paymentStatus.value = "all";
  filterShow.value = false;
  setStartAndEndDate();
  activeSelect.value = "";
  sentExpenseMail.value = "";
  passportFilter.value = "";
  commentFilter.value = "";
  fillStatusFilter.value = "";
  statusFilter.value = "all";
  searchAction();
  expense_date_selected.value = "";
};

const applyFilters = () => {
  filterShow.value = false;
  searchAction();
};

const openBooking = (bookingId) => {
  window.open(`/bookings/new-update/${bookingId}`);
};

const goToProduct = (id) => {
  window.open(`/product/hotel/edit/${id}`);
};

const goToRoomDetail = (item) => {
  console.log("====================================");
  console.log(item);
  console.log("====================================");

  switch (productType.value) {
    case "hotel":
      window.open(`/products/3?room_id=${item.room.id}`);
      break;
    case "attraction":
      window.open(`/products/6?edit=${item.variation.id}`);
      break;
    case "private_van_tour":
      window.open(`/vantour/view/${item.product.id}/edit`);
      break;
    default:
      break;
  }
};

const calculateFinishRate = (total, remaining) => {
  return total > 0 ? (total - remaining).toFixed(0) : 0;
};

const calculateProgressWidth = (total, remaining) => {
  return total > 0 ? (remaining / total) * 100 + "%" : "0%";
};

const openCommentAction = (item) => {
  selectedItem.value = item;
  fill_status.value = item.fill_status == null ? "pending" : item.fill_status;
  comment.value = item.fill_comment;
  openCommentModal.value = true;
};

const closeCommentModal = () => {
  openCommentModal.value = false;
  comment.value = "";
  selectedItem.value = null;
  fill_status.value = "";
};

const openNewPassportModal = (item) => {
  selectedInvoice.value = null;
  selectedItem.value = item;
  invoiceModalOpen.value = true;
};

// Add functions
const openEditRouteModal = (carItem, item) => {
  selectedRoute.value = carItem;
  selectedItem.value = item;
  routeModalOpen.value = true;
};

const closeRouteModal = () => {
  routeModalOpen.value = false;
  selectedRoute.value = null;
};

const refreshRoutes = async () => {
  console.log("this is refresh", selectedItem.value?.id);
  if (selectedItem.value?.id) {
    // Clear the cached data to force refresh

    itemLists.value[selectedItem.value.id] = null;

    // Force reactivity update
    itemLists.value = {};

    // Fetch fresh data
    await fetchGroupExpenses(selectedItem.value.id);
    await getListAction();
    console.log(itemLists.value[selectedItem.value.id]);
  }
};

const tableActions = ref([
  {
    name: "comment",
    icon: ChatBubbleBottomCenterIcon,
    handler: openCommentAction,
    label: "Comments",
    class:
      "p-1.5 bg-orange-100 text-xs text-orange-600 rounded-lg shadow-md transition-all duration-200 hover:bg-orange-200 hover:shadow-md active:scale-95",
    title: "Comments",
  },
  {
    name: "cancel",
    label: "Cancel",
    icon: InformationCircleIcon,
    handler: () => {},
    class:
      "px-3 py-2 text-xs text-white bg-red-600 rounded-lg shadow-md transition-all duration-200 hover:bg-red-700 hover:shadow-md active:scale-95",
    title: "Cancel",
  },
  {
    name: " passport",
    label: " Passport",
    icon: InformationCircleIcon,
    handler: openNewPassportModal,
    class:
      "px-3 py-2 text-xs text-white bg-green-600 rounded-lg shadow-md transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95",
    title: " Passport",
  },
]);

const getExpenseDate = async (date) => {
  const today = new Date().toISOString().split("T")[0];

  switch (date) {
    case "today":
      expense_date_selected.value = "today";
      startDate.value = today;
      endDate.value = today;
      await getListAction();
      break;

    case "tomorrow":
      expense_date_selected.value = "tomorrow";
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDate = tomorrow.toISOString().split("T")[0];
      startDate.value = tomorrowDate;
      endDate.value = tomorrowDate;
      await getListAction();
      break;

    case "next 2 days":
      expense_date_selected.value = "next 2 days";
      const next = new Date();
      next.setDate(next.getDate() + 2);
      const nextDate = next.toISOString().split("T")[0];
      startDate.value = nextDate;
      endDate.value = nextDate;
      await getListAction();
      break;

    case "this month":
      expense_date_selected.value = "this month";
      const now = new Date();
      startDate.value = today;
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endDate.value = lastDay.toISOString().split("T")[0];
      await getListAction();
      break;
  }
};

const addCommentAction = async () => {
  try {
    commentSubmitting.value = true;
    const groupFrmData = new FormData();
    groupFrmData.append("_method", "PUT");
    groupFrmData.append("fill_status", fill_status.value);
    if (fill_status.value === "other") {
      groupFrmData.append("fill_comment", comment.value);
    } else if (fill_status.value === "no_comment") {
      groupFrmData.append("fill_comment", "no comment");
    }

    await groupStore.groupUpdateAction(selectedItem.value.id, groupFrmData);
    toast.success("Comment added successfully");
    closeCommentModal();
    await getListAction();
  } catch (error) {
    console.error("Error adding comment:", error);
    toast.error("Failed to add comment");
  } finally {
    commentSubmitting.value = false;
  }
};

const activeSelectAction = (option) => {
  const filterConfigs = {
    passport: { status: "not_have", days: 2, field: "passportFilter" },
    comment: { status: "pending", days: 2, field: "commentFilter" },
    customer: { status: "not_fully_paid", days: 2, field: "paymentStatus" },
    trip: { status: "unfilled", days: 2, field: "filled_status" },
  };

  const config = filterConfigs[option];
  if (!config) return;

  if (activeSelect.value !== option) {
    clearFirst();
    activeSelect.value = option;

    if (config.field === "passportFilter") {
      passportFilter.value = config.status;
    } else if (config.field === "commentFilter") {
      commentFilter.value = config.status;
    } else if (config.field === "paymentStatus") {
      paymentStatus.value = config.status;
    } else if (config.field === "filled_status") {
      fillStatusFilter.value = config.status;
    }

    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + config.days);

    endDate.value = futureDate.toISOString().split("T")[0];
    startDate.value = today.toISOString().split("T")[0];
    searchAction();
  } else {
    activeSelect.value = "";
    clearAllFilters();
  }
};

const clearFirst = () => {
  deadlineDate.value = "";
  deadlineNumber.value = 2;
  invoiceStatus.value = "all";
  paymentStatus.value = "all";
  filterShow.value = false;
  sentExpenseMail.value = "";
  passportFilter.value = "";
  commentFilter.value = "";
  fillStatusFilter.value = "";
  statusFilter.value = "all";
};

const fetchPassports = async (groupId) => {
  try {
    passportLoading.value[groupId] = true;
    const response = await groupStore.groupDocumentList(groupId, {
      document_type: "passport",
    });

    if (response?.result) {
      passportLists.value[groupId] = response.result;
    }
  } catch (error) {
    console.error("Error fetching passports:", error);
  } finally {
    passportLoading.value[groupId] = false;
  }
};

const openEditPassportModal = (invoice, item) => {
  selectedInvoice.value = invoice;
  selectedItem.value = item;
  invoiceModalOpen.value = true;
};

const closePassportModal = () => {
  invoiceModalOpen.value = false;
};

const refreshPassports = async () => {
  if (selectedItem.value?.id) {
    await fetchPassports(selectedItem.value.id);
    await getListAction();
  }
};

const fetchGroupExpenses = async (groupId) => {
  try {
    itemLoading.value[groupId] = true;
    const response = await groupStore.detailAction(groupId);
    if (response?.result) {
      itemLists.value[groupId] = response.result;
    }
  } catch (error) {
    console.error("Error fetching expenses:", error);
  } finally {
    itemLoading.value[groupId] = false;
  }
};

const watchSystem = computed(() => {
  const result = {
    sorting: "asc",
    sorting_type: "service_date",
    per_page: 10,
  };

  if (productType.value) result.product_type = productType.value;
  if (hotelName.value) result.product_name = hotelName.value;
  if (statusFilter.value && statusFilter.value !== "all")
    result.expense_item_status = statusFilter.value;
  if (paymentStatus.value !== "all")
    result.payment_status = paymentStatus.value;
  if (searchKey.value) result.crm_id = searchKey.value;
  if (startDate.value && endDate.value && !searchKey.value) {
    result.booking_daterange = `${startDate.value},${endDate.value}`;
  }
  if (deadlineDate.value) {
    result.deadline_date = deadlineDate.value;
    result.deadline_days = deadlineNumber.value;
  }
  if (sentExpenseMail.value) result.sent_expense_mail = sentExpenseMail.value;
  if (passportFilter.value) result.passportFilter = passportFilter.value;
  if (commentFilter.value) result.commentFilter = commentFilter.value;
  if (fillStatusFilter.value) result.fillStatusFilter = fillStatusFilter.value;
  if (invoiceStatus.value && invoiceStatus.value !== "all")
    result.invoice_status = invoiceStatus.value;
  if (!authStore.isReservation && !authStore.isSuperAdmin)
    result.user_id = user.value.id;

  return result;
});

const setStartAndEndDate = () => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);
  end.setDate(start.getDate() + 90);

  startDate.value = start.toISOString().split("T")[0];
  endDate.value = end.toISOString().split("T")[0];
};

watch(productType, async () => {
  await getListAction();
});

onMounted(async () => {
  setStartAndEndDate();
  await getListAction();
});
</script>

<style scoped>
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
