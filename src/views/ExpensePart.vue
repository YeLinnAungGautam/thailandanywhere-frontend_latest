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
      </div>
    </div>

    <!-- Main Content -->
    <div class="w-full rounded-lg shadow-sm">
      <!-- Scorecard Section -->
      <div
        class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"
        v-if="productType !== 'private_van_tour'"
      >
        <!-- Invoice Next 7 Days Card -->
        <ScoreCard
          :is-active="activeSelect === 'invoice'"
          title="Invoice Next 7 Days"
          :current-value="groups?.meta?.without_confirmation_letter || 0"
          :total-value="groups?.meta?.total_next_7_days || 0"
          :icon="DocumentDuplicateIcon"
          explain_text="Invoice sent finish next 7 days record"
          gradient-from="#ca8a04"
          gradient-to="#a16207"
          border-color="#ca8a04"
          progress-color="#f97316"
          footer-label="Finish Rate"
          :footer-value="`${calculateFinishRate(
            groups?.meta?.total_next_7_days,
            groups?.meta?.without_confirmation_letter
          )} ခုကျန်`"
          :progress-width="
            calculateProgressWidth(
              groups?.meta?.total_next_7_days,
              groups?.meta?.without_confirmation_letter
            )
          "
          @click="activeSelectAction('invoice')"
        />

        <!-- Expense Card -->
        <ScoreCard
          :is-active="activeSelect === 'expense'"
          title="Expense Next 2 Days"
          :current-value="groups?.meta?.expense_not_fully_paid || 0"
          :total-value="groups?.meta?.total_next_2_days || 0"
          :icon="WalletIcon"
          explain_text="Expense fully paid next 2 days record"
          gradient-from="#ef4444"
          gradient-to="#dc2626"
          border-color="#dc2626"
          progress-color="#ef4444"
          footer-label="Finish Rate"
          :footer-value="`${calculateFinishRate(
            groups?.meta?.total_next_2_days,
            groups?.meta?.expense_not_fully_paid
          )} ခုကျန်`"
          :progress-width="
            calculateProgressWidth(
              groups?.meta?.total_next_2_days,
              groups?.meta?.expense_not_fully_paid
            )
          "
          @click="activeSelectAction('expense')"
        />

        <!-- Mail Card -->
        <ScoreCard
          :is-active="activeSelect === 'mail'"
          title="Mail Sent 3 Days"
          :current-value="groups?.meta?.expense_mail_sent || 0"
          :total-value="groups?.meta?.total_next_3_days || 0"
          :icon="WalletIcon"
          explain_text="Invoice get next 3 days record"
          gradient-from="#f97316"
          gradient-to="#ea580c"
          border-color="#ea580c"
          progress-color="#f97316"
          footer-label="Finish Rate"
          :footer-value="`${calculateFinishRate(
            groups?.meta?.total_next_3_days,
            groups?.meta?.expense_mail_sent
          )} ခုကျန်`"
          :progress-width="
            calculateProgressWidth(
              groups?.meta?.total_next_3_days,
              groups?.meta?.expense_mail_sent
            )
          "
          @click="activeSelectAction('mail')"
        />

        <!-- Customer Card -->
        <ScoreCard
          :is-active="activeSelect === 'customer'"
          title="Customer Next 2 Days"
          :current-value="groups?.meta?.customer_fully_paid || 0"
          :total-value="groups?.meta?.total_next_2_days || 0"
          :icon="WalletIcon"
          explain_text="Customer fully paid next 2 days record"
          gradient-from="#3b82f6"
          gradient-to="#2563eb"
          border-color="#2563eb"
          progress-color="#3b82f6"
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
      </div>

      <!-- Van Tour Scorecard Section -->
      <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <ScoreCard
          v-if="productType === 'private_van_tour'"
          :is-active="activeSelect === 'assigned'"
          title="Assign to Driver"
          :current-value="groups?.meta?.customer_fully_paid || 0"
          :total-value="groups?.meta?.total_next_2_days || 0"
          explain_text="Assign to driver next 2 days record"
          :icon="UserIcon"
          gradient-from="#a855f7"
          gradient-to="#9333ea"
          border-color="#9333ea"
          progress-color="#9333ea"
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
          @click="activeSelectAction('assigned')"
        />
      </div>

      <!-- Filters -->
      <div
        class="p-3 md:p-4 border-b border-gray-200 sticky bg-white -top-6 z-20"
      >
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-2 flex-1">
            <div class="relative">
              <div
                @click="showToggleType = !showToggleType"
                class="flex justify-between cursor-pointer items-center space-x-2"
              >
                <p class="capitalize text-[#FF613c] font-semibold text-xl">
                  {{
                    productType == "private_van_tour"
                      ? "Van Tour"
                      : productType || "Hotel"
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
                  @click="setProductType('hotel')"
                >
                  Hotel
                </p>
                <p
                  class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  @click="setProductType('attraction')"
                >
                  Attraction
                </p>
                <p
                  class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  @click="setProductType('private_van_tour')"
                >
                  Van Tour
                </p>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- Day filters -->
            <template v-if="productType !== 'private_van_tour'">
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
            </template>

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
                    : productType == 'private_van_tour'
                    ? 'Search Van Tour'
                    : 'Search Attraction'
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

            <!-- Reset Button -->
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
                <td
                  class="px-2 md:px-4 py-4"
                  v-if="productType != 'private_van_tour'"
                >
                  <XCircleIcon
                    v-if="
                      !isRowExpanded(item.id) &&
                      !item.has_booking_confirm_letter
                    "
                    class="w-5 h-5 text-red-500"
                  />
                  <ArrowDownCircleIcon
                    v-if="
                      isRowExpanded(item.id) && !item.has_booking_confirm_letter
                    "
                    class="w-5 h-5 text-red-500"
                  />
                  <CheckBadgeIcon
                    v-if="item.has_booking_confirm_letter"
                    :class="isRowExpanded(item.id) ? 'rotate-180' : ''"
                    class="w-5 h-5 text-green-500"
                  />
                </td>
                <td
                  class="px-2 md:px-4 py-4"
                  v-if="productType == 'private_van_tour'"
                >
                  <XCircleIcon
                    v-if="
                      !isRowExpanded(item.id) && !item.booking_items_assigned
                    "
                    class="w-5 h-5 text-red-500"
                  />
                  <ArrowDownCircleIcon
                    v-if="
                      isRowExpanded(item.id) && !item.booking_items_assigned
                    "
                    class="w-5 h-5 text-red-500"
                  />
                  <CheckBadgeIcon
                    v-if="item.booking_items_assigned"
                    :class="isRowExpanded(item.id) ? 'rotate-180' : ''"
                    class="w-5 h-5 text-green-500"
                  />
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
                  <div>
                    <p
                      class="absolute top-2 right-4 bg-white text-black px-2 py-1 text-xs rounded-full border border-[#FF613c] font-medium"
                    >
                      {{ item.items.length }}
                    </p>
                    <p
                      class="text-sm text-white line-clamp-1 px-3 py-1.5 bg-[#FF613c] rounded-full shadow-md truncate min-w-[100px] max-w-[200px] cursor-pointer"
                    >
                      {{ item.product_name }}
                    </p>
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

                <!-- V.Confirm -->
                <td class="px-2 md:px-4 py-4">
                  <div class="text-sm text-gray-900 whitespace-nowrap">
                    <button
                      @click="goToVConfirm(item)"
                      class="px-3 py-1.5 shadow-md text-sm rounded-full"
                      :class="
                        item.has_booking_confirm_letter
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                      "
                    >
                      {{
                        item.has_booking_confirm_letter ? "Confirm" : "Not Yet!"
                      }}
                    </button>
                  </div>
                </td>

                <!-- Expense -->
                <td class="px-2 md:px-4 py-4 text-sm font-medium text-gray-900">
                  <p class="text-red-600">
                    {{ formatCurrency(item.total_cost_price) }}
                  </p>
                  <span class="text-xs text-gray-600">{{
                    formatCurrency(item.total_amount)
                  }}</span>
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
                  <button
                    @click.stop="copyReservation(item)"
                    class="flex bg-[#FF613c] text-white items-center gap-2 px-1.5 py-1.5 transition-colors rounded-lg"
                  >
                    <DocumentDuplicateIcon class="w-5 h-5" />
                  </button>
                  <div class="relative group">
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
              <tr v-show="isRowExpanded(item.id)">
                <td colspan="14" class="px-2 md:px-4 py-0">
                  <div class="bg-gray-50 rounded-lg p-4 mb-2">
                    <!-- Loading State -->
                    <div
                      v-if="rowLoadingStates[item.id]"
                      class="flex justify-center items-center py-8"
                    >
                      <div class="flex flex-col items-center gap-3">
                        <div
                          class="w-8 h-8 border-4 border-gray-200 border-t-[#ff613c] rounded-full animate-spin"
                        ></div>
                        <p class="text-xs text-gray-500">Loading details...</p>
                      </div>
                    </div>

                    <!-- Content -->
                    <template v-else>
                      <!-- Van Tour Route Details -->
                      <div v-if="productType === 'private_van_tour'">
                        <div
                          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3"
                        >
                          <div
                            v-for="carItem in itemLists[item.id]?.items || []"
                            :key="carItem.id"
                            @click="openAssignDriverModal(carItem, item)"
                            class="bg-white rounded-lg p-4 border border-gray-200 hover:border-[#FF613c] transition-colors group cursor-pointer"
                          >
                            <div class="flex items-start gap-3">
                              <div
                                class="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center flex-shrink-0"
                              >
                                <svg
                                  class="w-6 h-6 text-orange-600"
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
                              </div>
                              <div class="flex-1 min-w-0">
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
                                    <span
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
                                    <span class="truncate">{{
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
                                    <span class="line-clamp-2">{{
                                      carItem.route_plan
                                    }}</span>
                                  </div>
                                  <div
                                    v-if="carItem.driver_name"
                                    class="flex items-center gap-1 text-xs text-purple-600 font-medium"
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
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                      />
                                    </svg>
                                    <span
                                      >Driver: {{ carItem.driver_name }}</span
                                    >
                                  </div>
                                </div>
                                <div
                                  class="mt-3 text-xs text-purple-600 font-medium flex items-center"
                                >
                                  <svg
                                    class="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                  </svg>
                                  Click to assign driver
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- Tab Switch -->
                      <div class="flex items-center gap-2 mb-4" v-else>
                        <button
                          @click="activeTab[item.id] = 'invoices'"
                          :class="getTabClass(item.id, 'invoices')"
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
                          Invoice List ({{ getInvoiceCount(item.id) }})
                        </button>
                        <button
                          @click="activeTab[item.id] = 'expense'"
                          :class="getTabClass(item.id, 'expense')"
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
                              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          Expense List ({{ getExpenseCount(item.id) }})
                        </button>
                        <button
                          @click="activeTab[item.id] = 'rooms'"
                          :class="getTabClass(item.id, 'rooms')"
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
                          Room Details ({{ getRoomCount(item.id) }})
                        </button>
                      </div>

                      <!-- Room Details Section -->
                      <div v-show="getActiveTab(item.id) === 'rooms'">
                        <div
                          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3"
                        >
                          <div
                            v-for="(roomItem, index) in getRoomItems(item.id)"
                            :key="index"
                            class="bg-white relative rounded-lg p-3 border border-gray-200 hover:border-[#FF613c] transition-colors"
                          >
                            <button
                              @click.stop="goToRoomDetail(roomItem?.room?.id)"
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
                                  {{ getRoomName(roomItem) }}
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

                      <template v-if="productType != 'private_van_tour'">
                        <!-- Invoice List Section -->
                        <div v-show="getActiveTab(item.id) === 'invoices'">
                          <div
                            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3"
                          >
                            <!-- Add New Invoice Card -->
                            <div
                              @click="openNewInvoiceModal(item)"
                              class="bg-white rounded-lg min-h-[120px] cursor-pointer text-[#FF613c] text-sm flex justify-center items-center border border-[#FF613c] p-4 border-dashed hover:bg-[#FF613c]/5 transition-colors group"
                            >
                              <PlusCircleIcon class="w-5 h-5 mr-2" />
                              Add New Invoice
                            </div>

                            <!-- Invoice Cards -->
                            <div
                              v-for="invoice in getInvoices(item.id)"
                              :key="invoice.id"
                              @click="openEditInvoiceModal(invoice, item)"
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
                                      {{
                                        invoice.meta?.invoice_number ||
                                        "No Number"
                                      }}
                                    </h4>
                                    <span
                                      class="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full whitespace-nowrap"
                                    >
                                      {{
                                        invoice.meta?.product_type?.includes(
                                          "Hotel"
                                        )
                                          ? "Hotel"
                                          : "Ticket"
                                      }}
                                    </span>
                                  </div>
                                  <div class="space-y-1">
                                    <div
                                      class="flex items-center justify-between text-xs"
                                    >
                                      <span class="text-gray-500">Amount:</span>
                                      <span class="font-medium text-gray-900">
                                        {{
                                          invoice.meta?.total_after_tax
                                            ? formatCurrency(
                                                invoice.meta.total_after_tax
                                              )
                                            : "-"
                                        }}
                                      </span>
                                    </div>
                                    <div
                                      class="flex items-center justify-between text-xs"
                                    >
                                      <span class="text-gray-500"
                                        >Product:</span
                                      >
                                      <span
                                        class="text-gray-700 truncate ml-2"
                                        >{{
                                          invoice.meta?.product_name || "-"
                                        }}</span
                                      >
                                    </div>
                                    <div
                                      class="flex items-center justify-between text-xs"
                                    >
                                      <span class="text-gray-500"
                                        >Company:</span
                                      >
                                      <span
                                        class="text-gray-700 truncate ml-2"
                                        >{{
                                          invoice.meta?.company_legal_name ||
                                          "-"
                                        }}</span
                                      >
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
                          </div>
                        </div>

                        <!-- Expense List Section -->
                        <div v-show="getActiveTab(item.id) === 'expense'">
                          <div
                            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3"
                          >
                            <!-- Add New Expense Card -->
                            <div
                              @click="openNewExpenseModal(item)"
                              class="bg-white rounded-lg min-h-[120px] cursor-pointer text-[#FF613c] text-sm flex justify-center items-center border border-[#FF613c] p-4 border-dashed hover:bg-[#FF613c]/5 transition-colors group"
                            >
                              <PlusCircleIcon class="w-5 h-5 mr-2" />
                              Add New Expense
                            </div>

                            <!-- Expense Cards -->
                            <div
                              v-for="expense in getExpenses(item.id)"
                              :key="expense.id"
                              @click="openEditExpenseModal(expense, item)"
                              class="bg-white rounded-lg p-4 border border-gray-200 hover:border-[#FF613c] transition-colors group cursor-pointer"
                            >
                              <div class="flex items-start gap-3">
                                <div
                                  class="w-12 h-12 rounded-lg bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center flex-shrink-0"
                                >
                                  <WalletIcon class="w-6 h-6 text-green-600" />
                                </div>
                                <div class="flex-1 min-w-0">
                                  <div
                                    class="flex items-start justify-between gap-2 mb-2"
                                  >
                                    <h4
                                      class="text-sm font-semibold text-gray-900"
                                    >
                                      {{ formatCurrency(expense.amount) }}
                                    </h4>
                                    <span
                                      class="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full whitespace-nowrap"
                                    >
                                      {{ expense.currency }}
                                    </span>
                                  </div>
                                  <div class="space-y-1">
                                    <div
                                      class="flex items-center justify-between text-xs"
                                    >
                                      <span class="text-gray-500">Date:</span>
                                      <span class="font-medium text-gray-900">{{
                                        expense.date
                                      }}</span>
                                    </div>
                                    <div
                                      class="flex items-center justify-between text-xs"
                                    >
                                      <span class="text-gray-500">Sender:</span>
                                      <span
                                        class="text-gray-700 truncate ml-2"
                                        >{{ expense.sender || "-" }}</span
                                      >
                                    </div>
                                    <div
                                      class="flex items-center justify-between text-xs"
                                    >
                                      <span class="text-gray-500"
                                        >Receiver:</span
                                      >
                                      <span
                                        class="text-gray-700 truncate ml-2"
                                        >{{ expense.reciever || "-" }}</span
                                      >
                                    </div>
                                    <div
                                      class="flex items-center justify-between text-xs"
                                    >
                                      <span class="text-gray-500">Bank:</span>
                                      <span class="text-gray-700">{{
                                        expense.interact_bank || "-"
                                      }}</span>
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
                          </div>
                        </div>
                      </template>
                    </template>
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
          <!-- Invoice Status -->
          <div v-if="productType != 'private_van_tour'">
            <label class="text-xs font-medium text-gray-700 mb-3 block"
              >Invoice Status</label
            >
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
              <button
                v-for="status in invoiceOptions"
                :key="status.value"
                @click="invoiceStatus = status.value"
                :class="
                  getFilterStatusClass(
                    invoiceStatus,
                    status.value,
                    status.color
                  )
                "
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
                  v-if="invoiceStatus === status.value"
                  class="flex-shrink-0"
                >
                  <CheckIcon :class="`w-5 h-5 text-${status.color}-600`" />
                </div>
              </button>
            </div>
          </div>

          <!-- Expense Status -->
          <div v-if="productType != 'private_van_tour'">
            <label class="text-xs font-medium text-gray-700 mb-3 block"
              >Expense Status</label
            >
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
              <button
                v-for="status in statusOptions"
                :key="status.value"
                @click="statusFilter = status.value"
                :class="
                  getFilterStatusClass(statusFilter, status.value, status.color)
                "
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
                <div v-if="statusFilter === status.value" class="flex-shrink-0">
                  <CheckIcon :class="`w-5 h-5 text-${status.color}-600`" />
                </div>
              </button>
            </div>
          </div>

          <!-- Assigned Status -->
          <div v-if="productType == 'private_van_tour'">
            <label class="text-xs font-medium text-gray-700 mb-3 block"
              >Assigned Status</label
            >
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
              <button
                v-for="status in AssignedOptions"
                :key="status.value"
                @click="assigned = status.value"
                :class="
                  getFilterStatusClass(assigned, status.value, status.color)
                "
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
                <div v-if="assigned === status.value" class="flex-shrink-0">
                  <CheckIcon :class="`w-5 h-5 text-${status.color}-600`" />
                </div>
              </button>
            </div>
          </div>

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
                :class="
                  getFilterStatusClass(
                    paymentStatus,
                    status.value,
                    status.color
                  )
                "
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

          <!-- Deadline Filter -->
          <div class="pt-3 border-t">
            <label class="text-xs font-medium text-gray-700 mb-2 block"
              >Deadline Filter</label
            >
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs text-gray-600 mb-1 block"
                  >Filter Date</label
                >
                <input
                  type="date"
                  v-model="deadlineDate"
                  class="border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF613c] w-full py-2 text-sm rounded-full shadow-sm"
                />
              </div>
              <div>
                <label class="text-xs text-gray-600 mb-1 block"
                  >Deadline Days</label
                >
                <input
                  type="number"
                  v-model="deadlineNumber"
                  class="border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF613c] w-full py-2 text-sm rounded-full shadow-sm"
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

        <div class="space-y-6" v-if="!loadingDetail">
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
                :class="
                  getFilterStatusClass(
                    selectedStatus,
                    status.value,
                    status.color
                  )
                "
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
              :disabled="!selectedStatus || loadingIn"
              class="px-6 py-2.5 text-sm font-medium text-white bg-[#FF613c] rounded-lg hover:bg-[#e55139] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg
                v-if="loadingIn"
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
              {{ loadingIn ? "Processing..." : "Confirm & Update Status" }}
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
        <div
          v-if="loadingDetail"
          class="h-[50vh] flex justify-center items-center"
        >
          <div
            class="w-8 h-8 border-4 border-gray-200 border-t-[#ff613c] rounded-full animate-spin"
          ></div>
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

    <!-- Invoice Modal -->
    <InvoiceModal
      :isOpen="invoiceModalOpen"
      :invoiceData="selectedInvoice"
      :groupId="selectedItem?.id"
      :groupData="selectedItem"
      :openEditItemCost="openEditItemCost"
      :itemData="itemLists[selectedItem?.id]"
      @close="closeInvoiceModal"
      @refresh="refreshInvoices"
    />

    <!-- Expense Modal -->
    <ExpenseModal
      :isOpen="expenseModalOpen"
      :expenseData="selectedExpense"
      :groupId="selectedItem?.id"
      :groupData="selectedItem"
      @close="closeExpenseModal"
      @refresh="refreshExpenses"
    />

    <!-- Edit Item Cost Modal -->
    <ItemCostModal
      :isOpen="showEditItemCost"
      :groupData="itemLists[selectedItem?.id]"
      :closeAction="closeEditItemCost"
      :refreshAction="refreshExpenses"
    />

    <!-- Assign Driver Modal -->
    <AssignDriverModal
      :isOpen="assignDriverModalOpen"
      :driverData="selectedDriverItem"
      :itemData="selectedDriverItem"
      :groupId="selectedItem?.id"
      @close="closeAssignDriverModal"
      @refresh="refreshDriverAssignments"
    />
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import AssignDriverModal from "./GroupComponent/ExpensePart/AssignDriverModal.vue";

// Components
import Layout from "./Layout.vue";
import Payment from "./GroupComponent/ExpensePart/Payment.vue";
import Pagination from "../components/Pagination.vue";
import Modal from "../components/Modal.vue";
import InvoiceModal from "./GroupComponent/ExpensePart/InvoiceModal.vue";
import ExpenseModal from "./GroupComponent/ExpensePart/ExpenseModal.vue";
import ItemCostModal from "./GroupComponent/ExpensePart/ItemCostModal.vue";

// Icons
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
  ArrowDownCircleIcon,
  CurrencyDollarIcon,
  PlusCircleIcon,
  DocumentCurrencyDollarIcon,
  Bars3BottomRightIcon,
  UserIcon,
} from "@heroicons/vue/24/outline";
import { CheckBadgeIcon, DocumentDuplicateIcon } from "@heroicons/vue/24/solid";
import ScoreCard from "./GroupComponent/ExpensePart/CartScale.vue";

// Stores
import { useGroupStore } from "../stores/group";
import { useCashImageStore } from "../stores/cashImage";
import { useReservationStore } from "../stores/reservation";
import { useAuthStore } from "../stores/auth";
import { useSidebarStore } from "../stores/sidebar";

// Initialize
const toast = useToast();
const router = useRouter();
const groupStore = useGroupStore();
const cashImageStore = useCashImageStore();
const reservationStore = useReservationStore();
const authStore = useAuthStore();
const sidebarStore = useSidebarStore();

// Store refs
const { groups, loading } = storeToRefs(groupStore);
const { user } = storeToRefs(authStore);
const { isShowSidebar } = storeToRefs(sidebarStore);

// State - UI
const filterShow = ref(false);
const infoDrawerOpen = ref(false);
const payDrawerOpen = ref(false);
const openCommentModal = ref(false);
const showToggleType = ref(false);
const showEditItemCost = ref(false);
const invoiceModalOpen = ref(false);
const expenseModalOpen = ref(false);
const assignDriverModalOpen = ref(false);
const selectedDriverItem = ref(null);

// State - Loading
const loadingIn = ref(false);
const loadingDetail = ref(false);
const rowLoadingStates = ref({});

// State - Data
const expandedRows = ref([]);
const activeTab = ref({});
const selectedItem = ref(null);
const detailData = ref(null);
const selectedInvoice = ref(null);
const selectedExpense = ref(null);
const selectedStatus = ref(null);
const comment = ref("");
const invoiceLists = ref({});
const expenseLists = ref({});
const itemLists = ref({});

// State - Filters
const searchKey = ref("");
const hotelName = ref("");
const statusFilter = ref("all");
const paymentStatus = ref("all");
const invoiceStatus = ref("all");
const activeSelect = ref("");
const productType = ref("hotel");
const expense_date_selected = ref("");
const sentExpenseMail = ref("");
const assigned = ref("");
const deadlineDate = ref("");
const deadlineNumber = ref(2);
const startDate = ref("");
const endDate = ref("");

// Constants
// Remove the const tableHeaders and replace with:
const tableHeaders = computed(() => [
  {
    key: "invoice",
    label: productType.value === "private_van_tour" ? "Assigned" : "Invoice",
    class: "whitespace-nowrap",
  },
  { key: "crm_id", label: "CRM ID", class: "whitespace-nowrap" },
  { key: "hotel_name", label: "Product Name", class: "" },
  { key: "expense_status", label: "Expense Status", class: "" },
  { key: "booking_date", label: "Booking Date", class: "" },
  { key: "v_confirm", label: "V.Confirm", class: "" },
  { key: "expense", label: "Expense", class: "whitespace-nowrap" },
  { key: "margin_score", label: "Margin Score", class: "whitespace-nowrap" },
  { key: "actions", label: "Actions", class: "text-right" },
]);

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

const invoiceOptions = [
  {
    value: "",
    label: "Clear",
    description: "Invoice clear",
    icon: XMarkIcon,
    color: "gray",
  },
  {
    value: "not_receive",
    label: "Not Received",
    description: "Awaiting invoice",
    icon: ExclamationTriangleIcon,
    color: "red",
  },
  {
    value: "receive",
    label: "Received",
    description: "Invoice received",
    icon: CheckIcon,
    color: "green",
  },
];

const AssignedOptions = [
  {
    value: "",
    label: "Clear",
    description: "Assigned clear",
    icon: XMarkIcon,
    color: "gray",
  },
  {
    value: "not_have",
    label: "Not Assigned",
    description: "Awaiting assign",
    icon: ExclamationTriangleIcon,
    color: "red",
  },
];

const tableActions = ref([
  {
    name: "pay",
    label: "Pay",
    icon: CurrencyDollarIcon,
    handler: openPayDrawer,
    class:
      "px-3 py-2 text-xs text-white bg-green-600 rounded-lg shadow-md transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95",
    title: "Pay",
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
]);

// Helper Functions - Formatting
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

// Add modal functions
const openAssignDriverModal = (carItem, item) => {
  selectedDriverItem.value = carItem;
  selectedItem.value = item;
  assignDriverModalOpen.value = true;
};

const closeAssignDriverModal = () => {
  assignDriverModalOpen.value = false;
  selectedDriverItem.value = null;
};

const refreshDriverAssignments = async () => {
  if (selectedItem.value?.id) {
    await fetchGroupExpenses(selectedItem.value.id);
    await getListAction();
  }
};

const formatExpenseStatus = (status) => {
  const statuses = {
    not_paid: "Not Paid",
    partially_paid: "Partially Paid",
    fully_paid: "Fully Paid",
  };
  return statuses[status] || status;
};

const formatPaymentStatus = (status) => {
  const statuses = {
    fully_paid: "Paid",
    not_paid: "Not Paid",
    partially_paid: "Partial",
  };
  return statuses[status] || status;
};

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

// Helper Functions - Calculations
const totalDiscount = (items) => {
  return items.reduce((total, item) => total + (item.discount || 0), 0);
};

const marginCalc = (sale, cost) => {
  if (cost === 0) return "N/A";
  return (((sale - cost) / sale) * 100).toFixed(2) + "%";
};

const calculateFinishRate = (total, remaining) => {
  return total > 0 ? (total - remaining).toFixed(0) : 0;
};

const calculateProgressWidth = (total, remaining) => {
  return total > 0 ? (remaining / total) * 100 + "%" : "0%";
};

// Helper Functions - Status Classes
const getExpenseStatusClass = (status) => {
  const classes = {
    not_paid: "bg-red-100 text-red-800",
    partially_paid: "bg-yellow-100 text-yellow-800",
    fully_paid: "bg-green-100 text-green-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

const getPaymentStatusClass = (status) => {
  const classes = {
    fully_paid: "text-green-500",
    not_paid: "text-red-500",
    partially_paid: "text-yellow-500",
  };
  return classes[status] || "text-gray-500";
};

const getFilterStatusClass = (currentValue, statusValue, color) => {
  return [
    "flex items-center gap-3 px-4 py-3 border-2 rounded-lg transition-all",
    currentValue === statusValue
      ? `border-${color}-500 bg-${color}-50 shadow-md`
      : `border-${color}-200 hover:bg-${color}-50`,
  ];
};

// Helper Functions - Row Management
const isRowExpanded = (itemId) => {
  return expandedRows.value.includes(itemId);
};

const getActiveTab = (itemId) => {
  return activeTab.value[itemId] || "invoices";
};

const getTabClass = (itemId, tabName) => {
  const isActive = getActiveTab(itemId) === tabName;
  return [
    "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all",
    isActive
      ? "bg-white text-[#FF613c] shadow-sm border border-[#FF613c]"
      : "bg-transparent text-gray-600 hover:bg-white/50",
  ];
};

// Helper Functions - Data Access
const getInvoices = (itemId) => {
  return invoiceLists.value[itemId] || [];
};

const getExpenses = (itemId) => {
  return expenseLists.value[itemId] || [];
};

const getRoomItems = (itemId) => {
  return itemLists.value[itemId]?.items || [];
};

const getInvoiceCount = (itemId) => {
  return invoiceLists.value[itemId]?.length || 0;
};

const getExpenseCount = (itemId) => {
  return expenseLists.value[itemId]?.length || 0;
};

const getRoomCount = (itemId) => {
  return itemLists.value[itemId]?.items?.length || 0;
};

const getRoomName = (roomItem) => {
  return productType.value === "hotel"
    ? roomItem?.room?.name
    : roomItem?.variation?.name;
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
  await groupStore.getListAction(watchSystem.value);
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

const fetchGroupInvoices = async (groupId) => {
  try {
    rowLoadingStates.value[groupId] = true;
    const response = await groupStore.groupDocumentList(groupId, {
      document_type: "booking_confirm_letter",
    });
    if (response?.result) {
      invoiceLists.value[groupId] = response.result;
    }
  } catch (error) {
    console.error("Error fetching invoices:", error);
    toast.error("Failed to load invoices");
  } finally {
    rowLoadingStates.value[groupId] = false;
  }
};

const fetchGroupExpenses = async (groupId) => {
  try {
    rowLoadingStates.value[groupId] = true;
    const response = await groupStore.detailAction(groupId);
    if (response?.result?.expense) {
      expenseLists.value[groupId] = response.result.expense;
      itemLists.value[groupId] = response.result;
    }
  } catch (error) {
    console.error("Error fetching expenses:", error);
    toast.error("Failed to load expenses");
  } finally {
    rowLoadingStates.value[groupId] = false;
  }
};

// Row Toggle with Single Expansion
const toggleRow = async (itemId) => {
  // Close all other rows first
  const wasExpanded = expandedRows.value.includes(itemId);
  expandedRows.value = [];

  if (!wasExpanded) {
    // Open the clicked row
    expandedRows.value.push(itemId);
    rowLoadingStates.value[itemId] = true;

    try {
      // For van tour, only fetch items
      if (productType.value === "private_van_tour") {
        await fetchGroupExpenses(itemId);
      } else {
        // For hotel/attraction, fetch invoices and expenses
        await Promise.all(
          [
            !invoiceLists.value[itemId] && fetchGroupInvoices(itemId),
            !expenseLists.value[itemId] && fetchGroupExpenses(itemId),
          ].filter(Boolean)
        );
      }
    } finally {
      rowLoadingStates.value[itemId] = false;
    }
  }
};

// Filter Actions
const activeSelectAction = async (option) => {
  if (activeSelect.value !== option) {
    clearFirst();
    activeSelect.value = option;

    const today = new Date();
    const config = {
      invoice: { status: "not_receive", days: 7, statusKey: "invoiceStatus" },
      expense: { status: "not_fully_paid", days: 2, statusKey: "statusFilter" },
      mail: { status: "not_sent", days: 3, statusKey: "sentExpenseMail" },
      customer: {
        status: "not_fully_paid",
        days: 2,
        statusKey: "paymentStatus",
      },
      assigned: { status: "not_have", days: 2, statusKey: "assigned" },
    };

    const settings = config[option];
    if (settings) {
      if (settings.statusKey === "sentExpenseMail") {
        sentExpenseMail.value = settings.status;
      } else if (settings.statusKey === "invoiceStatus") {
        invoiceStatus.value = settings.status;
      } else if (settings.statusKey === "statusFilter") {
        statusFilter.value = settings.status;
      } else if (settings.statusKey === "assigned") {
        assigned.value = settings.status;
      }

      startDate.value = today.toISOString().split("T")[0];
      const endDay = new Date(today);
      endDay.setDate(today.getDate() + settings.days);
      endDate.value = endDay.toISOString().split("T")[0];
      await searchAction();
    }
  } else {
    activeSelect.value = "";
    await clearAllFilters();
  }
};

const getExpenseDate = async (dateType) => {
  const today = new Date();
  const dateConfigs = {
    today: { start: 0, end: 0 },
    tomorrow: { start: 1, end: 1 },
    "next 2 days": { start: 2, end: 2 },
    "this month": {
      start: 0,
      end:
        new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() -
        today.getDate(),
    },
  };

  const config = dateConfigs[dateType];
  if (config) {
    expense_date_selected.value = dateType;
    const startDay = new Date(today);
    startDay.setDate(today.getDate() + config.start);
    startDate.value = startDay.toISOString().split("T")[0];

    const endDay = new Date(today);
    endDay.setDate(today.getDate() + config.end);
    endDate.value = endDay.toISOString().split("T")[0];

    await getListAction();
  }
};

const searchAction = async () => {
  filterShow.value = false;
  await getListAction();
};

const clearFirst = () => {
  deadlineDate.value = "";
  deadlineNumber.value = 2;
  invoiceStatus.value = "all";
  paymentStatus.value = "all";
  sentExpenseMail.value = "";
  assigned.value = "";
  statusFilter.value = "all";
};

const clearAllFilters = async () => {
  clearFirst();
  activeSelect.value = "";
  expense_date_selected.value = "";
  setStartAndEndDate();
  await searchAction();
};

const applyFilters = async () => {
  await searchAction();
};

const setProductType = async (type) => {
  productType.value = type;
  showToggleType.value = false;
};

// Navigation Actions
const openBooking = (bookingId) => {
  window.open(`/bookings/new-update/${bookingId}`);
};

const goToProduct = (id) => {
  window.open(`/product/hotel/edit/${id}`);
};

const goToRoomDetail = (id) => {
  window.open(`/products/3?room_id=${id}`);
};

const goToVConfirm = (item) => {
  window.open(
    `/group-hotel-email?crm_id=${item.booking_crm_id}&product_type=${productType.value}&activeTag=invoice`,
    "_blank"
  );
};

// Drawer Actions
async function openInfoDrawer(item) {
  selectedItem.value = item;
  infoDrawerOpen.value = true;
  await getDetailAction(item.id);
}

function closeInfoDrawer() {
  infoDrawerOpen.value = false;
  selectedItem.value = null;
  detailData.value = null;
}

async function openPayDrawer(item) {
  loadingDetail.value = true;
  payDrawerOpen.value = true;
  selectedItem.value = item;

  await getDetailAction(item.id);
  selectedStatus.value = detailData.value.expense_status;
  loadingDetail.value = false;
}

function closePayDrawer() {
  payDrawerOpen.value = false;
  selectedItem.value = null;
  detailData.value = null;
  selectedStatus.value = null;
}

function openCommentAction(item) {
  selectedItem.value = item;
  openCommentModal.value = true;
}

function closeCommentModal() {
  openCommentModal.value = false;
  comment.value = "";
  selectedItem.value = null;
}

// Modal Actions - Invoice
function openNewInvoiceModal(item) {
  selectedInvoice.value = null;
  selectedItem.value = item;
  invoiceModalOpen.value = true;
}

function openEditInvoiceModal(invoice, item) {
  selectedInvoice.value = invoice;
  selectedItem.value = item;
  invoiceModalOpen.value = true;
}

function closeInvoiceModal() {
  invoiceModalOpen.value = false;
  selectedInvoice.value = null;
}

async function refreshInvoices() {
  if (selectedItem.value?.id) {
    await fetchGroupInvoices(selectedItem.value.id);
    await getListAction();
  }
}

// Modal Actions - Expense
function openNewExpenseModal(item) {
  selectedExpense.value = null;
  selectedItem.value = item;
  expenseModalOpen.value = true;
}

function openEditExpenseModal(expense, item) {
  selectedExpense.value = expense;
  selectedItem.value = item;
  expenseModalOpen.value = true;
}

function closeExpenseModal() {
  expenseModalOpen.value = false;
  selectedExpense.value = null;
  selectedItem.value = null;
}

async function refreshExpenses() {
  if (selectedItem.value?.id) {
    await fetchGroupExpenses(selectedItem.value.id);
    await getListAction();
  }
}

// Modal Actions - Item Cost
function openEditItemCost() {
  if (selectedItem.value) {
    showEditItemCost.value = true;
    invoiceModalOpen.value = false;
  } else {
    toast.error("No booking data available");
  }
}

function closeEditItemCost() {
  showEditItemCost.value = false;
}

// Copy Reservation
const copyReservation = async (item) => {
  try {
    const response = await groupStore.detailAction(item.id);
    const res = response.result;

    if (!res?.items?.length) {
      toast.error("No reservation items found");
      return;
    }

    if (productType.value == "private_van_tour") {
      console.log(res, "this is van tour");
      copyVanReservation(res?.booking);
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

      const labels = {
        0: "*Urgent: Today*  \n",
        1: "*Urgent: Tomorrow*  \n",
        2: "*Urgent: Day After Tomorrow*  \n",
      };
      return labels[diffDays] || "";
    };

    const discount = res.items.reduce(
      (sum, item) => sum + (item.discount || 0),
      0
    );
    const total_amount = res.items.reduce(
      (sum, item) => sum + item.amount * 1,
      0
    );
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

const copyVanReservation = async (booking) => {
  try {
    let res = booking;
    console.log(res, "this is copy reservation");

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

    // Calculate discount - safely handling potential undefined values
    let discount = 0;
    for (let i = 0; i < res.items.length; i++) {
      discount += parseFloat(res.items[i].discount || 0);
    }

    // Calculate score safely
    let score = 0;

    // Check for earliest service date across all items
    let earliestServiceDate = null;
    for (const item of res.items) {
      // Fixed typo from "serivce_date" to "service_date" with fallback
      const serviceDate = item.service_date || item.serivce_date;
      if (serviceDate && serviceDate !== "null") {
        if (!earliestServiceDate || serviceDate < earliestServiceDate) {
          earliestServiceDate = serviceDate;
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

    // Add booking header - safely handling missing values
    const totalCost = "0";
    const totalAmount = res.grand_total || "0";
    const balanceDue = res.balance_due || "0";
    const paymentStatus = res.payment_status || "Unknown";

    allFormattedOutput += `💰 Total Cost: ${totalCost} THB 
💵 Price: ${totalAmount} THB 
💵 Balance Due: ${balanceDue} THB 
📝 Payment Status: ${paymentStatus}
---------------------
🏦 Bank Name: ${
      res.items[0]?.bank_name !== "null" && res.items[0]?.bank_name
        ? res.items[0].bank_name
        : "-"
    } 
🔢 Bank Account Number: ${
      res.items[0]?.bank_account_number !== "null" &&
      res.items[0]?.bank_account_number
        ? `➖${res.items[0].bank_account_number}`
        : "-"
    }
🧑‍💼 Account Name: ${
      res.items[0]?.account_name !== "null" && res.items[0]?.account_name
        ? res.items[0].account_name
        : "-"
    } 
#️⃣ CRM ID: ${res.crm_id || "-"}\n`;

    // Process each item with proper error handling
    res.items.forEach((item) => {
      // Fix typo in service_date field name and provide fallbacks
      const serviceDate = item.service_date || item.serivce_date || "-";
      const itemUrgencyLabel = getUrgencyLabel(serviceDate).trim();
      const urgencyPrefix = itemUrgencyLabel ? `[${itemUrgencyLabel}] ` : "";

      allFormattedOutput += `🏩 Name: ${item.product?.name || "-"}
📆 Service Date: ${urgencyPrefix}${serviceDate}
#️⃣ Reservation Code: ${item.crm_id || "-"}: S: (${item.selling_price || "-"})
---------------------\n`;
    });

    // Add summary information with proper fallbacks
    allFormattedOutput += `💵 Total Sale Amount: ${res.sub_total || "0"} THB 
💸 Discount: ${discount} THB 
📅 Sale Date: ${res.booking_date || "-"}
🤑 Score: ${score.toFixed(2)}\n`;

    // Add customer information if available
    if (res.customer_info) {
      allFormattedOutput += `👤 Customer Name: ${res.customer_info.name || "-"}
📱 Contact: ${res.customer_info.phone_number || "-"}
✉️ Email: ${res.customer_info.email || "-"}\n`;
    }

    // Copy to clipboard with a short timeout to ensure UI isn't blocked
    setTimeout(() => {
      navigator.clipboard.writeText(allFormattedOutput);
      // toast.success("Reservation copied successfully");
    }, 0);

    return allFormattedOutput;
  } catch (error) {
    console.error("Error copying reservations:", error);
    toast.error("Failed to copy reservation");
    return "Error: Failed to format reservation information";
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
    loadingIn.value = true;
    const detail = await getDetailAction(selectedItem.value.id);

    if (!detail?.items?.length) {
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
    loadingIn.value = false;
  }
};

// Computed
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
  if (assigned.value) result.assigned = assigned.value;
  if (invoiceStatus.value && invoiceStatus.value !== "all")
    result.invoice_status = invoiceStatus.value;
  if (!authStore.isReservation && !authStore.isSuperAdmin)
    result.user_id = user.value.id;

  return result;
});

// Initialization
const setStartAndEndDate = () => {
  const now = new Date();
  const end = new Date(now);
  end.setDate(now.getDate() + 90);
  startDate.value = now.toISOString().split("T")[0];
  endDate.value = end.toISOString().split("T")[0];
};

// Watchers
watch(productType, async () => {
  await getListAction();
});

// Lifecycle
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
