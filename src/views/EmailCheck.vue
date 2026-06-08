<template>
  <Layout :is_white="true">
    <!-- Header -->
    <div
      :class="isShowSidebar ? 'left-[200px]' : 'left-[100px]'"
      class="space-y-1 transition-all duration-200 gap-2 text-sm pb-4 absolute top-4"
    >
      <div class="text-xl font-semibold text-[#FF613c]">Mail Management</div>
      <p class="text-gray-800 font-light text-xs">
        Use the following module to make sure all data are added ahead of time.
      </p>
    </div>

    <!-- Main Content -->
    <div class="w-full rounded-lg shadow-sm">
      <!-- ── Scorecards: Hotel / Attraction ─────────────────────────────── -->
      <div
        v-if="product_type !== 'private_van_tour'"
        class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"
      >
        <ScoreCard
          :is-active="activeTag == 'prove_booking'"
          title="Prove Booking"
          :current-value="groups?.meta?.prove_booking_sent_next_30_days || 0"
          :total-value="groups?.meta?.total_next_30_days || 0"
          :icon="DocumentDuplicateIcon"
          explain_text="Booking proved next 30 days record"
          gradient-from="#ca8a04"
          gradient-to="#a16207"
          border-color="#ca8a04"
          progress-color="#f97316"
          footer-label="Finish Rate"
          :footer-value="`${calculateFinishRate(
            groups?.meta?.total_next_30_days,
            groups?.meta?.prove_booking_sent_next_30_days,
          )} ခုကျန်`"
          :progress-width="
            calculateProgressWidth(
              groups?.meta?.total_next_30_days,
              groups?.meta?.prove_booking_sent_next_30_days,
            )
          "
          @click="filterByType('prove_booking')"
        />
        <ScoreCard
          :is-active="activeTag == 'invoice'"
          title="Vendor Confirm"
          :current-value="groups?.meta?.invoice_mail_sent_next_7_days || 0"
          :total-value="groups?.meta?.total_next_7_days || 0"
          :icon="DocumentDuplicateIcon"
          explain_text="Invoice sent next 7 days record"
          gradient-from="#f97316"
          gradient-to="#ea580c"
          border-color="#ea580c"
          progress-color="#f97316"
          footer-label="Finish Rate"
          :footer-value="`${calculateFinishRate(
            groups?.meta?.total_next_7_days,
            groups?.meta?.invoice_mail_sent_next_7_days,
          )} ခုကျန်`"
          :progress-width="
            calculateProgressWidth(
              groups?.meta?.total_next_7_days,
              groups?.meta?.invoice_mail_sent_next_7_days,
            )
          "
          @click="filterByType('invoice')"
        />
        <ScoreCard
          :is-active="activeTag == 'invoice_confirm'"
          title="Invoice"
          :current-value="groups?.meta?.invoice_confirmed_next_7_days || 0"
          :total-value="groups?.meta?.total_next_7_days || 0"
          :icon="DocumentDuplicateIcon"
          explain_text="Invoice confirm next 7 days record"
          gradient-from="#3b82f6"
          gradient-to="#2563eb"
          border-color="#2563eb"
          progress-color="#3b82f6"
          footer-label="Finish Rate"
          :footer-value="`${calculateFinishRate(
            groups?.meta?.total_next_7_days,
            groups?.meta?.invoice_confirmed_next_7_days,
          )} ခုကျန်`"
          :progress-width="
            calculateProgressWidth(
              groups?.meta?.total_next_2_days,
              groups?.meta?.invoice_confirmed_next_7_days,
            )
          "
          @click="filterByType('invoice_confirm')"
        />
        <ScoreCard
          :is-active="activeTag == 'expense'"
          title="Expense"
          :current-value="groups?.meta?.expense_mail_sent_next_7_days || 0"
          :total-value="groups?.meta?.total_next_7_days || 0"
          :icon="DocumentDuplicateIcon"
          explain_text="expense fully paid next 7 days record"
          gradient-from="#ef4444"
          gradient-to="#dc2626"
          border-color="#dc2626"
          progress-color="#ef4444"
          footer-label="Finish Rate"
          :footer-value="`${calculateFinishRate(
            groups?.meta?.total_next_2_days,
            groups?.meta?.expense_mail_sent_next_7_days,
          )} ခုကျန်`"
          :progress-width="
            calculateProgressWidth(
              groups?.meta?.total_next_7_days,
              groups?.meta?.expense_mail_sent_next_7_days,
            )
          "
          @click="filterByType('expense')"
        />
      </div>

      <!-- ── Scorecard: Van Tour ─────────────────────────────────────────── -->
      <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <ScoreCard
          :is-active="activeTag == 'assign_driver'"
          title="Assign to Driver"
          :current-value="vanAssignedCount"
          :total-value="vanTotalCount"
          :icon="UsersIcon"
          explain_text="Driver assigned next 2 days record"
          gradient-from="#a855f7"
          gradient-to="#9333ea"
          border-color="#9333ea"
          progress-color="#9333ea"
          footer-label="Finish Rate"
          :footer-value="`${vanTotalCount - vanAssignedCount} ခုကျန်`"
          :progress-width="
            vanTotalCount > 0
              ? (vanAssignedCount / vanTotalCount) * 100 + '%'
              : '0%'
          "
          @click="activeTag = 'assign_driver'"
        />
      </div>

      <!-- ── Product Type Switcher (shared) ─────────────────────────────── -->
      <div
        class="p-3 md:p-4 border-b border-gray-200 sticky bg-white -top-6 z-20"
      >
        <div class="flex items-center gap-4">
          <div class="relative">
            <div
              class="flex justify-between cursor-pointer items-center space-x-2"
              @click="showToggleType = !showToggleType"
            >
              <p class="capitalize text-[#FF613c] font-semibold text-xl">
                {{
                  product_type == "private_van_tour"
                    ? "Van Tour"
                    : product_type || "Hotel"
                }}
              </p>
              <ChevronDownIcon class="w-5 text-[#FF613c] h-5" />
            </div>
            <div
              v-if="showToggleType"
              class="absolute top-10 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]"
            >
              <p
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                @click="changeProductType('hotel')"
              >
                Hotel
              </p>
              <p
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                @click="changeProductType('attraction')"
              >
                Attraction
              </p>
              <p
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                @click="changeProductType('private_van_tour')"
              >
                Van Tour
              </p>
            </div>
          </div>

          <!-- Instant Booking toggle — hotel only -->
          <div
            v-if="product_type == 'hotel'"
            class="text-xs px-3 py-2 rounded-full cursor-pointer"
            @click="instand_booking = instand_booking == 1 ? 0 : 1"
            :class="
              instand_booking == 1
                ? 'bg-[#FF613c] text-white'
                : 'border border-[#FF613c]'
            "
          >
            Instand Booking
          </div>

          <!-- Non-van-tour filters -->
          <template v-if="product_type !== 'private_van_tour'">
            <div class="flex items-center gap-2 ml-auto">
              <div class="relative min-w-[180px]">
                <input
                  type="search"
                  v-model="searchKey.searchId"
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

              <div class="relative">
                <select
                  v-model="searchKey.sentStatus"
                  @change="searchAction"
                  class="appearance-none bg-white text-[#FF613c] border border-gray-200 text-xs px-4 py-2.5 pr-8 rounded-full shadow-lg cursor-pointer hover:bg-[#e55139] hover:text-white transition-colors focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="sent">Sent</option>
                  <option value="not_sent">Not Sent</option>
                </select>
                <svg
                  class="w-4 h-4 text-[#FF613c] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
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
              </div>

              <button
                @click="filterShow = !filterShow"
                class="bg-[#FF613c] px-4 rounded-full shadow-lg py-2.5 flex items-center gap-x-2 text-white text-xs cursor-pointer hover:bg-[#e55139] transition-colors"
              >
                <FunnelIcon class="w-4 h-4 text-white" />
                <p>Filters</p>
              </button>

              <button
                @click="clearFilter"
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
          </template>
        </div>

        <!-- Advanced Filters Modal (non-van-tour only) -->
        <Modal
          v-if="product_type !== 'private_van_tour'"
          :isOpen="filterShow"
          @closeModal="filterShow = false"
        >
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
                      v-model="searchKey.startDate"
                      class="border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF613c] w-full py-2 text-base rounded-full shadow-sm"
                    />
                  </div>
                  <div>
                    <label class="text-xs text-gray-600 mb-1 block"
                      >End Date</label
                    >
                    <input
                      type="date"
                      v-model="searchKey.endDate"
                      class="border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF613c] w-full py-2 text-base rounded-full shadow-sm"
                    />
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-3 pt-4 border-t">
                <button
                  @click="clearDateFilter"
                  class="flex-1 text-sm bg-gray-100 px-4 py-2.5 rounded-full text-center text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors font-medium"
                >
                  Clear All
                </button>
                <button
                  @click="searchAction"
                  class="flex-1 text-sm bg-[#FF613c] px-4 py-2.5 rounded-full text-center text-white cursor-pointer hover:bg-[#e55139] transition-colors font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </DialogPanel>
        </Modal>
      </div>

      <!-- ══════════════════════════════════════════════════════════════════ -->
      <!-- ── Van Tour Section — delegates entirely to AssignVan component ── -->
      <!-- ══════════════════════════════════════════════════════════════════ -->
      <div v-if="product_type === 'private_van_tour'" class="mt-4">
        <AssignVan ref="assignVanRef" />
      </div>

      <!-- ══════════════════════════════════════════════════════════════════ -->
      <!-- ── Hotel / Attraction Section ─────────────────────────────────── -->
      <!-- ══════════════════════════════════════════════════════════════════ -->
      <template v-else>
        <div
          class="overflow-x-auto relative w-[90.5vw] h-[62vh] overflow-y-auto"
        >
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200 z-10">
              <tr class="sticky top-0 z-10 bg-gray-50">
                <th
                  class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
                >
                  {{
                    activeTag != "invoice_confirm"
                      ? "Mail Status"
                      : "Invoice Status"
                  }}
                </th>
                <th
                  class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
                >
                  CRM ID
                </th>
                <th
                  class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
                >
                  Product Name
                </th>
                <th
                  class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
                >
                  Customer
                </th>
                <th
                  class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
                >
                  Service Date
                </th>
                <th
                  class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
                >
                  {{ product_type == "hotel" ? "Room" : "Ticket" }} Qty
                </th>
                <th
                  class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
                >
                  C.Status
                </th>
                <th
                  v-if="activeTag == 'expense'"
                  class="px-2 md:px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
                >
                  E.Status
                </th>
                <th
                  class="px-2 md:px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody v-if="!loading" class="divide-y divide-gray-200">
              <template v-for="item in groups?.data ?? []" :key="item.id">
                <!-- Main row -->
                <tr
                  class="hover:bg-gray-50 transition-colors cursor-pointer"
                  @click="toggleRow(item.id)"
                >
                  <td class="px-2 md:px-4 py-4">
                    <div class="flex flex-col gap-1">
                      <span
                        v-if="
                          activeTag == 'prove_booking' || activeTag == 'invoice'
                        "
                        class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                        :class="
                          item.sent_booking_request == 1
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        "
                      >
                        {{
                          item.sent_booking_request == 1 ? "Sent" : "Not Sent"
                        }}
                      </span>
                      <span
                        v-if="activeTag == 'invoice' || activeTag == 'expense'"
                        class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                        :class="
                          item.have_invoice_mail
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        "
                      >
                        {{ item.have_invoice_mail ? "Complete" : "Missing" }}
                      </span>
                      <span
                        v-if="activeTag == 'invoice_confirm'"
                        class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                        :class="
                          item.has_booking_confirm_letter
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        "
                      >
                        {{
                          item.has_booking_confirm_letter ? "Have" : "Missing"
                        }}
                      </span>
                      <span
                        v-if="activeTag == 'expense'"
                        class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                        :class="
                          item.sent_expense_mail == 1
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        "
                      >
                        Exp:
                        {{ item.sent_expense_mail == 1 ? "Sent" : "Not Sent" }}
                      </span>
                    </div>
                  </td>
                  <td class="px-2 md:px-4 py-4">
                    <p
                      class="text-sm font-medium whitespace-nowrap px-3 py-1.5 bg-[#FF613c] text-white shadow-md rounded-full inline-block"
                    >
                      {{ item.booking_crm_id }}
                    </p>
                  </td>
                  <td class="px-2 md:px-4 py-4">
                    <p
                      class="text-sm text-white px-3 py-1.5 bg-[#FF613c] rounded-full shadow-md truncate max-w-[200px]"
                    >
                      {{ item.product_name }}
                    </p>
                  </td>
                  <td class="px-2 md:px-4 py-4">
                    <p class="text-sm text-gray-700">
                      {{ item.customer_name }}
                    </p>
                  </td>
                  <td class="px-2 md:px-4 py-4">
                    <div class="text-sm text-gray-700">
                      <div class="whitespace-nowrap">
                        {{ item.firstest_service_date }}
                      </div>
                      <div
                        class="text-xs text-gray-500 whitespace-nowrap"
                        v-if="
                          item.latest_service_date !==
                          item.firstest_service_date
                        "
                      >
                        to {{ item.latest_service_date }}
                      </div>
                    </div>
                  </td>
                  <td class="px-2 md:px-4 py-4">
                    <p class="text-sm text-gray-700">
                      {{ getRoomQty(item) }}
                      {{ product_type == "hotel" ? "Room" : "Ticket" }}
                    </p>
                  </td>
                  <td class="px-2 md:px-4 py-4">
                    <span
                      class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                      :class="
                        getPaymentStatusClass(item.customer_payment_status)
                      "
                    >
                      {{ formatPaymentStatus(item.customer_payment_status) }}
                    </span>
                  </td>
                  <td v-if="activeTag == 'expense'" class="px-2 md:px-4 py-4">
                    <span
                      class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                      :class="getPaymentStatusClass(item.expense_status)"
                    >
                      {{ formatPaymentStatus(item.expense_status) }}
                    </span>
                  </td>
                  <td
                    class="px-2 flex justify-end items-center space-x-2 md:px-4 py-4"
                  >
                    <button
                      v-show="activeTag == 'invoice_confirm'"
                      @click.stop="handleEdit(item)"
                      class="flex bg-blue-600 text-white items-center gap-2 px-2 py-1.5 transition-colors rounded-lg hover:bg-blue-700"
                    >
                      <PencilSquareIcon class="w-5 h-5" />
                    </button>
                    <button
                      v-show="activeTag != 'invoice_confirm'"
                      @click.stop="copyModalAction(item)"
                      class="flex bg-orange-600 text-white items-center gap-2 px-2 py-1.5 transition-colors rounded-lg hover:bg-orange-700"
                    >
                      <DocumentDuplicateIcon class="w-5 h-5" />
                    </button>
                    <button
                      @click.stop="selectItem(item)"
                      class="flex bg-green-600 text-white items-center gap-2 px-2 py-1.5 transition-colors rounded-lg hover:bg-green-700"
                    >
                      <InformationCircleIcon class="w-5 h-5" />
                    </button>
                    <button
                      @click.stop="openCommentAction(item)"
                      class="flex bg-orange-600 text-white items-center gap-2 px-2 py-1.5 transition-colors rounded-lg hover:bg-orange-700"
                    >
                      <ChatBubbleLeftRightIcon class="w-5 h-5" />
                    </button>
                  </td>
                </tr>

                <!-- Expandable Row -->
                <tr v-show="expandedRowId === item.id">
                  <td colspan="20" class="px-2 md:px-4 py-0">
                    <div class="bg-gray-50 rounded-lg p-4 mb-2">
                      <div
                        v-if="loadingExpandedRow === item.id"
                        class="flex justify-center items-center py-8"
                      >
                        <div class="flex flex-col items-center gap-3">
                          <div
                            class="w-6 h-6 border-4 border-gray-200 border-t-[#ff613c] rounded-full animate-spin"
                          ></div>
                          <p class="text-xs text-gray-500">
                            Loading details...
                          </p>
                        </div>
                      </div>
                      <div v-else>
                        <div
                          v-if="activeTag != 'invoice_confirm'"
                          class="grid grid-cols-5 gap-3"
                        >
                          <div
                            v-for="(image, index) in getFileProofs(
                              cachedData[item.id]?.images,
                            )"
                            :key="'file-' + index"
                            class="relative aspect-square h-[150px] w-full group"
                          >
                            <img
                              class="w-full h-full object-cover rounded-lg border border-gray-200"
                              :src="image.file"
                              alt="Existing"
                            />
                            <button
                              @click="openImageViewer(image.file, index)"
                              class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <EyeIcon class="w-6 h-6" />
                            </button>
                          </div>
                          <div
                            v-for="(doc, index) in getEmailProofs(
                              cachedData[item.id]?.images,
                            )"
                            :key="'email-' + index"
                            class="relative aspect-square h-[150px] w-full group rounded-lg border border-blue-200 bg-blue-50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 transition-colors"
                          >
                            <div
                              class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center"
                            >
                              <svg
                                class="w-6 h-6 text-blue-600"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                                />
                              </svg>
                            </div>
                            <p class="text-xs text-blue-700 font-medium">
                              Email Proof
                            </p>
                            <p
                              class="text-xs text-blue-400 font-mono truncate px-2 max-w-full"
                            >
                              {{ doc.meta.gmail_message_id?.slice(0, 12) }}...
                            </p>
                            <div
                              class="absolute inset-0 bg-blue-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                            >
                              <button
                                @click.stop="openEmailProofModal(doc)"
                                class="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 transition-colors"
                                title="View Email"
                              >
                                <EyeIcon class="w-4 h-4 text-blue-600" />
                              </button>
                              <button
                                @click.stop="goToMailbox(doc)"
                                class="p-2 bg-white rounded-full shadow-md hover:bg-green-50 transition-colors"
                                title="Open in Mailbox"
                              >
                                <svg
                                  class="w-4 h-4 text-green-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div
                            @click="selectItemEdit(item)"
                            class="w-full h-full min-h-[100px] cursor-pointer rounded-lg overflow-hidden border border-dashed border-[#FF613c] flex justify-center items-center"
                          >
                            <p
                              class="text-[#FF613c] text-sm flex justify-center items-center gap-x-3"
                            >
                              <PlusCircleIcon class="w-6 h-6" />Add New Image
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>

                <!-- Comments row -->
                <tr v-if="item.fill_comment" class="bg-gray-50">
                  <td
                    colspan="14"
                    class="pr-4 pl-12 py-3 border-t-2 border-gray-200"
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
            <svg
              class="w-12 h-12 text-gray-300 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p class="text-sm text-gray-500">No mail records found</p>
          </div>
        </div>

        <!-- Pagination -->
        <div
          v-if="!loading && groups?.data && groups.data.length > 0"
          class="px-3 md:px-4 py-3 border-t border-gray-200"
        >
          <Pagination :data="groups" @change-page="changePage" />
        </div>
      </template>
    </div>

    <!-- ── Modals (Hotel / Attraction only — unchanged) ────────────────── -->

    <!-- Detail Modal -->
    <Modal :isOpen="showDetail">
      <DialogPanel
        class="w-full max-w-5xl transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-lg font-semibold text-gray-900 mb-4 flex justify-between items-center p-6 border-b"
        >
          <div class="flex items-center gap-2">
            <InformationCircleIcon class="w-6 h-6 text-[#FF613c]" />
            Email Details
          </div>
          <button
            @click="closeDetail"
            class="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XCircleIcon class="w-5 h-5 text-gray-500" />
          </button>
        </DialogTitle>
        <div class="p-6 overflow-y-scroll max-h-[calc(100vh-200px)]">
          <div v-if="selectedItem">
            <div class="border-b pb-4 mb-4">
              <div class="flex items-center gap-2 mb-3">
                <span
                  class="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >{{ selectedItem.product_type }}</span
                >
                <span
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="
                    getPaymentStatusClass(selectedItem.customer_payment_status)
                  "
                >
                  {{
                    formatPaymentStatus(selectedItem.customer_payment_status)
                  }}
                </span>
              </div>
              <h2 class="text-xl font-semibold text-gray-900 mb-2">
                {{ selectedItem.product_name }}
              </h2>
              <div class="space-y-1 text-sm text-gray-600">
                <p>
                  <span class="font-medium">CRM ID:</span>
                  {{ selectedItem.booking_crm_id }}
                </p>
                <p>
                  <span class="font-medium">Customer:</span>
                  {{ selectedItem.customer_name }}
                </p>
                <p>
                  <span class="font-medium">Service Date:</span>
                  {{ selectedItem.firstest_service_date }}
                  <span
                    v-if="
                      selectedItem.latest_service_date !==
                      selectedItem.firstest_service_date
                    "
                  >
                    - {{ selectedItem.latest_service_date }}</span
                  >
                </p>
              </div>
            </div>
            <EmailPart :detail="detail" :activeTag="activeTag" />
            <div class="mb-6 mt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-3">
                Financial Details
              </h3>
              <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-gray-600"
                    >Total Amount</span
                  >
                  <span class="text-sm font-bold text-gray-900">{{
                    formatCurrency(selectedItem.total_amount)
                  }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-gray-600"
                    >Cost Price</span
                  >
                  <span class="text-sm text-gray-900">{{
                    formatCurrency(selectedItem.total_cost_price)
                  }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-gray-600"
                    >Expense Amount</span
                  >
                  <span class="text-sm text-gray-900">{{
                    formatCurrency(selectedItem.expense_amount)
                  }}</span>
                </div>
                <div class="flex justify-between items-center pt-2 border-t">
                  <span class="text-sm font-medium text-gray-600"
                    >Expense Status</span
                  >
                  <span
                    class="px-2 py-1 rounded-full text-xs font-medium"
                    :class="getPaymentStatusClass(selectedItem.expense_status)"
                  >
                    {{ formatPaymentStatus(selectedItem.expense_status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Modal>

    <!-- Approve/Edit Modal -->
    <Modal :isOpen="showDetailEdit">
      <DialogPanel
        class="w-full max-w-4xl transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-lg font-semibold text-gray-900 mb-4 flex justify-between items-center p-6 border-b"
        >
          <div class="flex items-center gap-2">
            <svg
              class="w-6 h-6 text-[#FF613c]"
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
              activeTag == "invoice"
                ? "Confirm"
                : activeTag == "expense"
                ? "Expense"
                : "Booking"
            }}
            Email Screenshot
          </div>
          <button
            @click="closeDetailEdit"
            class="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XCircleIcon class="w-5 h-5 text-gray-500" />
          </button>
        </DialogTitle>
        <div class="p-6 max-h-[62vh] overflow-y-auto">
          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium text-gray-700 mb-3 block">
                {{ activeTag == "invoice" ? "Confirm Email" : "Booking" }} Date*
              </label>
              <div class="flex gap-2">
                <input
                  type="number"
                  v-model="day"
                  @input="updateExpenseDate"
                  placeholder="DD"
                  min="1"
                  max="31"
                  class="w-20 border border-gray-300 px-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] text-center"
                />
                <input
                  type="number"
                  v-model="month"
                  @input="updateExpenseDate"
                  placeholder="MM"
                  min="1"
                  max="12"
                  class="w-20 border border-gray-300 px-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] text-center"
                />
                <input
                  type="number"
                  v-model="year"
                  @input="updateExpenseDate"
                  placeholder="YYYY"
                  min="1900"
                  max="2100"
                  class="w-24 border border-gray-300 px-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] text-center"
                />
                <div class="relative">
                  <button
                    type="button"
                    @click="openDatePicker"
                    class="w-36 h-10 flex items-center justify-center bg-[#FF613c] text-white rounded-lg transition-colors hover:bg-[#e55139]"
                  >
                    <svg
                      class="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span class="text-sm ml-2">Choose Date</span>
                  </button>
                  <input
                    ref="datePickerInput"
                    type="date"
                    v-model="formData.date"
                    @change="updateFromDatePicker"
                    class="absolute opacity-0 pointer-events-none"
                  />
                </div>
              </div>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 mb-3 block">
                {{
                  activeTag == "invoice"
                    ? "Confirm"
                    : activeTag == "expense"
                    ? "Expense"
                    : "Booking"
                }}
                Email Screenshot*
              </label>
              <input
                multiple
                type="file"
                ref="imagesInput"
                @change="handlerImagesFileChange"
                class="hidden"
                accept="image/*"
              />
              <div
                v-if="
                  imagesPreview.length === 0 &&
                  formData.editImagesPreview.length === 0
                "
                @click="openFileImagePicker"
                class="w-full h-80 border-2 border-dashed border-[#FF613c] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div class="bg-[#FF613c]/10 p-4 rounded-full">
                  <PlusCircleIcon class="w-8 h-8 text-[#FF613c]" />
                </div>
                <div class="mt-4 text-center">
                  <p class="text-sm font-medium text-gray-700">
                    Upload Email Screenshot
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    Click to browse or drag and drop
                  </p>
                  <p class="text-xs text-gray-400 mt-1">PNG, JPG, JPEG</p>
                </div>
              </div>
              <div
                v-else
                class="grid grid-cols-3 md:grid-cols-4 gap-3 min-h-80"
              >
                <div
                  v-for="(image, index) in imagesPreview"
                  :key="'new-' + index"
                  class="relative aspect-square group"
                >
                  <img
                    class="w-full h-full object-cover rounded-lg border border-gray-200"
                    :src="image"
                    alt="Preview"
                  />
                  <button
                    @click="removeImageSelectImage(index)"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XCircleIcon class="w-5 h-5" />
                  </button>
                </div>
                <div
                  v-for="(image, index) in formData.editImagesPreview"
                  :key="'existing-' + index"
                  v-show="imagesPreview.length === 0"
                  class="relative aspect-square group"
                >
                  <img
                    class="w-full h-full object-cover rounded-lg border border-gray-200"
                    :src="image.file"
                    alt="Existing"
                  />
                  <button
                    @click="openImageViewer(image.file, index)"
                    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <EyeIcon class="w-6 h-6" />
                  </button>
                  <button
                    @click="removeImageUpdateImage(image.id)"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XCircleIcon class="w-5 h-5" />
                  </button>
                </div>
                <div
                  @click="openFileImagePicker"
                  class="aspect-square border-2 border-dashed border-[#FF613c] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <PlusCircleIcon class="w-8 h-8 text-[#FF613c]" />
                  <p class="text-xs text-gray-600 mt-1">Add more</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="border-t px-6 py-3 flex justify-end space-x-3">
          <button
            @click="closeDetailEdit"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="imagesPreview.length > 0 && updateReservationAction()"
            :disabled="imagesPreview.length === 0"
            class="px-6 py-2 text-sm font-medium text-white rounded-lg flex items-center space-x-2 transition-all"
            :class="
              imagesPreview.length > 0
                ? 'bg-[#FF613c] hover:bg-[#e55139] cursor-pointer'
                : 'bg-gray-400 cursor-not-allowed opacity-60'
            "
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Update Status</span>
          </button>
        </div>
      </DialogPanel>
    </Modal>

    <!-- Copy / Email Wizard Modal -->
    <Modal :isOpen="showCopyModal">
      <DialogPanel
        class="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-lg font-semibold text-gray-900 mb-4 flex justify-between items-center p-6 border-b"
        >
          <div class="flex items-center gap-2">
            <svg
              class="w-6 h-6 text-[#FF613c]"
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
            <span>Copy Line or Email</span>
          </div>
          <button
            @click="closeCopyModal"
            class="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XCircleIcon class="w-5 h-5 text-gray-500" />
          </button>
        </DialogTitle>
        <div v-if="detail && detail.id" class="p-6">
          <BookingEmailWizard
            :detail="detail"
            :activeTag="activeTag"
            :showLine="openShowLineModal"
          />
        </div>
        <div class="h-[200px] flex justify-center items-center" v-else>
          <div class="flex flex-col items-center gap-3">
            <div
              class="w-8 h-8 border-4 border-gray-200 border-t-[#ff613c] rounded-full animate-spin"
            ></div>
            <p class="text-xs text-gray-500">Loading...</p>
          </div>
        </div>
      </DialogPanel>
    </Modal>

    <!-- Image Viewer Modal -->
    <Modal :isOpen="showImageViewer">
      <DialogPanel
        class="w-full max-w-7xl transform overflow-hidden rounded-lg bg-black text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-black/80 font-medium flex justify-between items-center py-3 px-4"
        >
          <p>
            Image Viewer ({{ currentImageIndex + 1 }} /
            {{ formData.editImagesPreview.length }})
          </p>
          <XCircleIcon
            class="w-6 h-6 text-white cursor-pointer hover:text-gray-300"
            @click="closeImageViewer"
          />
        </DialogTitle>
        <div
          class="relative bg-black h-[80vh] flex items-center justify-center"
        >
          <img
            :src="currentViewImage"
            alt="Full size"
            class="max-h-full max-w-full object-contain"
          />
          <button
            v-if="formData.editImagesPreview.length > 1"
            @click="previousImage"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 transition-all"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            v-if="formData.editImagesPreview.length > 1"
            @click="nextImage"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 transition-all"
          >
            <svg
              class="w-6 h-6"
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
          </button>
        </div>
      </DialogPanel>
    </Modal>

    <InvoiceModal
      :isOpen="invoiceModalOpen"
      :invoiceData="selectedInvoice"
      :groupId="selectedItem?.id"
      :groupData="selectedItem"
      :openEditItemCost="openEditItemCost"
      :itemData="cachedData[selectedItem?.id]?.items || {}"
      @close="closeInvoiceModal"
      @refresh="refreshInvoices"
    />
    <ItemCostModal
      :isOpen="showEditItemCost"
      :groupData="cachedData[selectedItem?.id]?.items || {}"
      :closeAction="closeEditItemCost"
      :refreshAction="refreshExpenses"
    />
    <BookingCopyModel
      :openModal="showLineCopyModal"
      :closeModal="closeDetail"
      :bookingItem="detail || ''"
    />
    <RouteModal
      :isOpen="routeModalOpen"
      :routeData="selectedRoute"
      :itemData="selectedRoute"
      :groupId="selectedItem?.id"
      @close="closeRouteModal"
      @refresh="refreshRoutes"
    />

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

    <!-- Email Proof Detail Modal -->
    <teleport to="body">
      <div
        v-if="showEmailProofModal"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40"
        @click.self="showEmailProofModal = false"
      >
        <div
          class="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
        >
          <div class="flex items-center justify-between p-4 border-b">
            <div class="flex items-center gap-2">
              <svg
                class="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                />
              </svg>
              <h3 class="font-semibold text-gray-800 text-sm">
                Sent Email Detail
              </h3>
            </div>
            <button
              @click="showEmailProofModal = false"
              class="p-1 hover:bg-gray-100 rounded-lg"
            >
              <XCircleIcon class="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div
            v-if="emailProofLoading"
            class="flex justify-center items-center py-16"
          >
            <div
              class="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"
            ></div>
          </div>
          <div
            v-else-if="emailProofDetail"
            class="p-4 space-y-3 max-h-[60vh] overflow-y-auto"
          >
            <div class="bg-gray-50 rounded-lg p-3 space-y-2 text-xs">
              <div class="flex gap-2">
                <span class="text-gray-500 w-10 flex-shrink-0">From:</span
                ><span class="text-gray-800 font-medium">{{
                  emailProofDetail.from
                }}</span>
              </div>
              <div class="flex gap-2">
                <span class="text-gray-500 w-10 flex-shrink-0">To:</span
                ><span class="text-gray-800">{{ emailProofDetail.to }}</span>
              </div>
              <div class="flex gap-2">
                <span class="text-gray-500 w-10 flex-shrink-0">Date:</span
                ><span class="text-gray-800">{{
                  new Date(emailProofDetail.gmail_datetime).toLocaleString()
                }}</span>
              </div>
            </div>
            <div
              class="text-sm text-gray-700 border border-gray-100 rounded-lg p-3 max-h-[300px] overflow-y-auto [&_pre]:leading-normal [&_pre]:text-sm"
              v-html="emailProofDetail.body"
            ></div>
          </div>
          <div
            v-else
            class="flex justify-center items-center py-12 text-gray-400 text-sm"
          >
            Email not found
          </div>
          <div class="flex justify-between items-center p-4 border-t">
            <button
              v-if="selectedEmailDoc?.meta?.email_ticket_message_id"
              @click="
                () => {
                  showEmailProofModal = false;
                  goToMailbox(selectedEmailDoc);
                }
              "
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
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
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Open in Mailbox
            </button>
            <div v-else></div>
            <button
              @click="showEmailProofModal = false"
              class="px-4 py-2 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import Layout from "./Layout.vue";
import {
  ChatBubbleLeftRightIcon,
  DocumentDuplicateIcon,
  FunnelIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import { XCircleIcon, PlusCircleIcon } from "@heroicons/vue/24/solid";
import { useSidebarStore } from "../stores/sidebar";
import { useGroupStore } from "../stores/group";
import {
  PencilSquareIcon,
  EyeIcon,
  ChevronDownIcon,
} from "@heroicons/vue/24/outline";
import Modal from "../components/Modal.vue";
import { useToast } from "vue-toastification";
import EmailPart from "./GroupComponent/EmailPart.vue";
import Pagination from "../components/Pagination.vue";
import { DialogPanel, DialogTitle } from "@headlessui/vue";
import { useRoute, useRouter } from "vue-router";
import InvoiceModal from "./GroupComponent/ExpensePart/InvoiceModal.vue";
import ItemCostModal from "./GroupComponent/ExpensePart/ItemCostModal.vue";
import BookingCopyModel from "./GroupComponent/BookingCopyModel.vue";
import RouteModal from "./GroupComponent/ExpensePart/RouteModal.vue";
import ScoreCard from "./GroupComponent/ExpensePart/CartScale.vue";
import BookingEmailWizard from "./GroupComponent/Bookingemailwizard.vue";
import { useEmailStore } from "../stores/email";

// ── AssignVan replaces old VanTourReservation — it manages its own store calls ──
import AssignVan from "../components/homeReservation/AssignVan.vue";

const emailStore = useEmailStore();
const toast = useToast();
const router = useRouter();
const sidebarStore = useSidebarStore();
const { isShowSidebar } = storeToRefs(sidebarStore);
const groupStore = useGroupStore();
const { groups, loading } = storeToRefs(groupStore);
const route = useRoute();

// ── State ──────────────────────────────────────────────────────────────────
const showDetail = ref(false);
const selectedItem = ref(null);
const activeTag = ref("prove_booking");
const filterShow = ref(false);
const currentPage = ref(1);
const imagesInput = ref(null);
const imagesPreview = ref([]);
const product_type = ref("hotel");
const instand_booking = ref(0);
const showImageViewer = ref(false);
const currentViewImage = ref("");
const currentImageIndex = ref(0);
const expandedRowId = ref(null);
const showToggleType = ref(false);
const showLineCopyModal = ref(false);
const loadingExpandedRow = ref(null);
const routeModalOpen = ref(false);
const selectedRoute = ref(null);
const cachedData = ref({});
const detail = ref({});
const showDetailEdit = ref(false);
const datePickerInput = ref(null);
const selectedInvoice = ref(null);
const invoiceModalOpen = ref(false);
const showEditItemCost = ref(false);
const showCopyModal = ref(false);
const openCommentModal = ref(false);
const comment = ref("");
const showEmailProofModal = ref(false);
const emailProofLoading = ref(false);
const emailProofDetail = ref(null);
const selectedEmailDoc = ref(null);
const day = ref("");
const month = ref("");
const year = ref("");

const formData = ref({
  images: [],
  date: null,
  editImagesPreview: [],
});

const searchKey = ref({
  searchId: "",
  startDate: "",
  endDate: "",
  sentStatus: "all",
});

// ── Van Tour scorecard counts (derived from AssignVan's carbookings store) ─
// We read carbookingStore here only for scorecard numbers; AssignVan owns fetching.
import { useCarBookingStore } from "../stores/carbooking";
const carBookingStore = useCarBookingStore();
const { carbookings } = storeToRefs(carBookingStore);

const vanTotalCount = computed(() => carbookings.value?.data?.length ?? 0);
const vanAssignedCount = computed(
  () => (carbookings.value?.data ?? []).filter((i) => !!i.driver_name).length,
);

// ── Computed query params ──────────────────────────────────────────────────
const watchSystem = computed(() => {
  const result = {
    page: currentPage.value,
    per_page: 30,
    sorting_type: "service_date",
    sorting: "asc",
  };

  if (searchKey.value.searchId) result.crm_id = searchKey.value.searchId;

  if (searchKey.value.startDate && searchKey.value.endDate) {
    result.booking_daterange = `${searchKey.value.startDate},${searchKey.value.endDate}`;
  } else {
    const today = new Date();
    const next3m = new Date(today);
    next3m.setMonth(next3m.getMonth() + 3);
    const startDate = today.toISOString().split("T")[0];
    const endDate = next3m.toISOString().split("T")[0];
    searchKey.value.startDate = startDate;
    searchKey.value.endDate = endDate;
    result.booking_daterange = `${startDate},${endDate}`;
  }

  if (product_type.value) result.product_type = product_type.value;
  if (product_type.value === "hotel" && instand_booking.value === 1)
    result.is_allowment_have = true;

  if (!searchKey.value.searchId) {
    if (activeTag.value === "prove_booking") {
      if (searchKey.value.sentStatus !== "all")
        result.sent_booking_request = searchKey.value.sentStatus;
    } else if (activeTag.value === "invoice") {
      result.sent_booking_request = "sent";
      result.booking_request_proof = "proved";
      if (searchKey.value.sentStatus !== "all")
        result.have_invoice_mail = searchKey.value.sentStatus;
    } else if (activeTag.value === "expense") {
      result.sent_booking_request = "sent";
      result.booking_request_proof = "proved";
      result.have_invoice_mail = "sent";
      result.invoice_mail_proof = "proved";
      if (searchKey.value.sentStatus !== "all")
        result.sent_expense_mail = searchKey.value.sentStatus;
    }
  }

  return result;
});

// ── Helpers ────────────────────────────────────────────────────────────────
const calculateFinishRate = (total, remaining) =>
  total > 0 ? (total - remaining).toFixed(0) : 0;
const calculateProgressWidth = (total, remaining) =>
  total > 0 ? (remaining / total) * 100 + "%" : "0%";

const getRoomQty = (item) =>
  item?.items?.reduce(
    (t, r) => t + (r.days ? r.quantity * r.days : r.quantity),
    0,
  ) || 0;

const getPaymentStatusClass = (status) =>
  ({
    fully_paid: "bg-green-100 text-green-800",
    not_paid: "bg-red-100 text-red-800",
    partially_paid: "bg-yellow-100 text-yellow-800",
  }[status] || "bg-gray-100 text-gray-800");

const formatPaymentStatus = (status) =>
  ({
    fully_paid: "Paid",
    not_paid: "Not Paid",
    partially_paid: "Partial",
  }[status] || status);

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "THB" }).format(
    amount,
  );

const getFileProofs = (images = []) =>
  images.filter((img) => img.file !== null);
const getEmailProofs = (images = []) =>
  images.filter((img) => img.file === null && img.meta?.gmail_message_id);

const getComments = (item) => {
  const out = [];
  if (item.fill_comment)
    out.push({
      type: "Sale",
      text: item.fill_comment,
      badgeClass: "bg-blue-500",
      bgClass: "bg-blue-100",
    });
  if (item.comment_reserve)
    out.push({
      type: "Res",
      text: item.comment_reserve,
      badgeClass: "bg-orange-500",
      bgClass: "bg-orange-100",
    });
  return out;
};

// ── Product type switch ────────────────────────────────────────────────────
const changeProductType = (type) => {
  product_type.value = type;
  showToggleType.value = false;
  activeTag.value =
    type === "private_van_tour" ? "assign_driver" : "prove_booking";
  cachedData.value = {};
  expandedRowId.value = null;

  // AssignVan mounts and fetches itself when private_van_tour is selected.
  // For other types, trigger a group store fetch.
  if (type !== "private_van_tour") searchAction();
};

// ── Filter / search actions ────────────────────────────────────────────────
const filterByType = (type) => {
  activeTag.value = type;
  searchKey.value.sentStatus = "all";
  expandedRowId.value = null;
  loadingExpandedRow.value = null;
  cachedData.value = {};
  searchAction();
};

const searchAction = async () => {
  filterShow.value = false;
  currentPage.value = 1;
  cachedData.value = {};
  expandedRowId.value = null;
  loadingExpandedRow.value = null;
  await groupStore.getListAction(watchSystem.value);
};

const changePage = async (url) => {
  currentPage.value = url.split("page=")[1];
  await groupStore.getChangePage(url, watchSystem.value);
};

const clearFilter = () => {
  searchKey.value = {
    searchId: "",
    startDate: "",
    endDate: "",
    sentStatus: "all",
  };
  filterShow.value = false;
  searchAction();
};

const clearDateFilter = () => {
  searchKey.value.startDate = "";
  searchKey.value.endDate = "";
  searchAction();
};

const getListAction = () => groupStore.getListAction(watchSystem.value);
const fetchData = async () => {
  try {
    await groupStore.getListAction(watchSystem.value);
  } catch (e) {
    console.error(e);
  }
};

// ── Row expand ─────────────────────────────────────────────────────────────
const toggleRow = async (itemId) => {
  if (expandedRowId.value === itemId) {
    expandedRowId.value = null;
    loadingExpandedRow.value = null;
    return;
  }
  expandedRowId.value = itemId;
  if (!cachedData.value[itemId]) {
    try {
      loadingExpandedRow.value = itemId;
      if (activeTag.value !== "invoice_confirm") {
        const images = await getProofImage(itemId);
        cachedData.value[itemId] = { images };
      } else {
        const [invoices, items] = await Promise.all([
          fetchGroupInvoices(itemId),
          fetchGroupExpenses(itemId),
        ]);
        cachedData.value[itemId] = { invoices, items };
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load data");
    } finally {
      loadingExpandedRow.value = null;
    }
  }
};

// ── Invoices / expenses ────────────────────────────────────────────────────
const fetchGroupInvoices = async (groupId) => {
  try {
    const r = await groupStore.groupDocumentList(groupId, {
      document_type: "booking_confirm_letter",
    });
    return r?.result || [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

const fetchGroupExpenses = async (groupId) => {
  try {
    loadingExpandedRow.value = groupId;
    const r = await groupStore.detailAction(groupId);
    if (r?.result) {
      cachedData.value[groupId] = {
        items: r.result.items || [],
        groupDetail: r.result,
      };
      return r.result;
    }
    return null;
  } catch (e) {
    console.error(e);
    return null;
  } finally {
    loadingExpandedRow.value = null;
  }
};

const refreshExpenses = async () => {
  if (selectedItem.value?.id) {
    await fetchGroupExpenses(selectedItem.value.id);
    await getListAction();
  }
};

// ── Images ─────────────────────────────────────────────────────────────────
const getProofImage = async (id) => {
  if (!id) return [];
  const docType =
    activeTag.value === "prove_booking"
      ? "booking_request_proof"
      : activeTag.value === "expense"
      ? "expense_mail_proof"
      : "invoice_mail_proof";
  const res = await groupStore.groupDocumentList(id, {
    document_type: docType,
  });
  formData.value.editImagesPreview = res.result;
  return res.result;
};

const openFileImagePicker = () => imagesInput.value?.click();
const openImageViewer = (url, i) => {
  currentViewImage.value = url;
  currentImageIndex.value = i;
  showImageViewer.value = true;
};
const closeImageViewer = () => {
  showImageViewer.value = false;
  currentViewImage.value = "";
  currentImageIndex.value = 0;
};
const nextImage = () => {
  const t = formData.value.editImagesPreview.length;
  currentImageIndex.value = (currentImageIndex.value + 1) % t;
  currentViewImage.value =
    formData.value.editImagesPreview[currentImageIndex.value].file;
};
const previousImage = () => {
  const t = formData.value.editImagesPreview.length;
  currentImageIndex.value = (currentImageIndex.value - 1 + t) % t;
  currentViewImage.value =
    formData.value.editImagesPreview[currentImageIndex.value].file;
};
const handlerImagesFileChange = (e) => {
  Array.from(e.target.files || []).forEach((f) => {
    formData.value.images.push(f);
    imagesPreview.value.push(URL.createObjectURL(f));
  });
};
const removeImageSelectImage = (i) => {
  formData.value.images.splice(i, 1);
  imagesPreview.value.splice(i, 1);
};
const removeImageUpdateImage = async (imageID) => {
  try {
    const res = await groupStore.groupDocumentDeleteAction(
      selectedItem.value.id,
      imageID,
    );
    if (res.status === 1) {
      toast.success("Image deleted");
      const images = await getProofImage(selectedItem.value.id);
      if (cachedData.value[selectedItem.value.id])
        cachedData.value[selectedItem.value.id].images = images;
    }
  } catch (e) {
    console.error(e);
    toast.error("Failed to delete image");
  }
};

// ── Date helpers ───────────────────────────────────────────────────────────
const updateExpenseDate = () => {
  if (day.value && month.value && year.value)
    formData.value.date = `${year.value}-${String(month.value).padStart(
      2,
      "0",
    )}-${String(day.value).padStart(2, "0")}`;
};
const openDatePicker = () => datePickerInput.value?.showPicker();
const updateFromDatePicker = () => {
  if (formData.value.date?.includes("-")) {
    const [y, m, d] = formData.value.date.split("-");
    year.value = y;
    month.value = parseInt(m);
    day.value = parseInt(d);
  }
};

// ── Update reservation ─────────────────────────────────────────────────────
const updateReservationAction = async () => {
  const frmData = new FormData();
  if (activeTag.value === "prove_booking") {
    frmData.append("sent_booking_request", 1);
    frmData.append("booking_email_sent_date", formData.value.date);
  } else if (activeTag.value === "expense") {
    frmData.append("sent_expense_mail", 1);
    frmData.append("expense_email_sent_date", formData.value.date);
  } else {
    frmData.append("have_invoice_mail", 1);
    frmData.append("invoice_mail_sent_date", formData.value.date);
  }
  frmData.append("_method", "PUT");
  await groupStore.groupUpdateAction(selectedItem.value.id, frmData);
  toast.success("Update status");
  if (formData.value.images.length > 0) {
    const docType =
      activeTag.value === "prove_booking"
        ? "booking_request_proof"
        : activeTag.value === "expense"
        ? "expense_mail_proof"
        : "invoice_mail_proof";
    await Promise.all(
      formData.value.images.map((file, i) => {
        const s = new FormData();
        s.append("document_type", docType);
        s.append(`documents[${i}][file]`, file);
        s.append(`documents[${i}][meta][name]`, `proof-${i}`);
        return groupStore.groupDocumentCreateAction(s, selectedItem.value.id);
      }),
    );
  }
  const images = await getProofImage(selectedItem.value.id);
  if (cachedData.value[selectedItem.value.id])
    cachedData.value[selectedItem.value.id].images = images;
  setTimeout(async () => {
    await fetchData();
    closeDetailEdit();
  }, 1000);
};

const resetCloseAction = () => {
  formData.value = { images: [], date: null, editImagesPreview: [] };
  imagesPreview.value = [];
  day.value = "";
  month.value = "";
  year.value = "";
};

// ── Modal helpers ──────────────────────────────────────────────────────────
const openEditItemCost = () => {
  if (selectedItem.value) {
    showEditItemCost.value = true;
    invoiceModalOpen.value = false;
  } else toast.error("No booking data available");
};
const closeEditItemCost = () => {
  showEditItemCost.value = false;
};
const closeInvoiceModal = () => {
  invoiceModalOpen.value = false;
};
const closeRouteModal = () => {
  routeModalOpen.value = false;
  selectedRoute.value = null;
};
const closeDetail = () => {
  showDetail.value = false;
  showLineCopyModal.value = false;
};
const closeCopyModal = () => {
  showCopyModal.value = false;
  detail.value = {};
  selectedItem.value = null;
};
const closeDetailEdit = () => {
  showDetailEdit.value = false;
  selectedItem.value = null;
  showCopyModal.value = false;
  detail.value = {};
  resetCloseAction();
};
const openShowLineModal = () => {
  showLineCopyModal.value = true;
  showCopyModal.value = false;
};

const openCommentAction = (item) => {
  selectedItem.value = item;
  comment.value = item.comment_reserve;
  openCommentModal.value = true;
};
const closeCommentModal = () => {
  openCommentModal.value = false;
  comment.value = "";
  selectedItem.value = null;
};

const selectItem = async (item) => {
  selectedItem.value = item;
  const res = await groupStore.detailAction(item.id);
  detail.value = res.result;
  showDetail.value = true;
};

const copyModalAction = async (item) => {
  detail.value = {};
  showCopyModal.value = true;
  selectedItem.value = item;
  const res = await groupStore.detailAction(item.id);
  detail.value = res.result;
};

const handleEdit = async (item) => {
  selectedItem.value = item;
  if (!cachedData.value[item.id]?.items) {
    const items = await fetchGroupExpenses(item.id);
    if (!cachedData.value[item.id]) cachedData.value[item.id] = {};
    cachedData.value[item.id].items = items;
  }
  showEditItemCost.value = true;
  invoiceModalOpen.value = false;
};

const selectItemEdit = async (item) => {
  selectedItem.value = item;
  const dateField =
    activeTag.value === "prove_booking"
      ? item.booking_email_sent_date
      : activeTag.value === "expense"
      ? item.expense_email_sent_date
      : item.invoice_mail_sent_date;
  formData.value.date = dateField;
  if (dateField?.includes("-")) {
    const [y, m, d] = dateField.split("-");
    year.value = y;
    month.value = parseInt(m);
    day.value = parseInt(d);
  }
  await getProofImage(item.id);
  showDetailEdit.value = true;
};

const refreshInvoices = async () => {
  if (selectedItem.value?.id) {
    const invoices = await fetchGroupInvoices(selectedItem.value.id);
    if (cachedData.value[selectedItem.value.id])
      cachedData.value[selectedItem.value.id].invoices = invoices;
    await getListAction();
  }
};

const refreshRoutes = async () => {
  if (selectedItem.value?.id) {
    delete cachedData.value[selectedItem.value.id];
    await fetchGroupExpenses(selectedItem.value.id);
    await getListAction();
  }
};

const addCommentAction = async () => {
  if (!comment.value.trim()) {
    toast.error("Comment cannot be empty");
    return;
  }
  try {
    const f = new FormData();
    f.append("_method", "PUT");
    f.append("comment_reserve", comment.value);
    await groupStore.groupUpdateAction(selectedItem.value.id, f);
    toast.success("Comment added successfully");
    closeCommentModal();
    await getListAction();
  } catch (e) {
    console.error(e);
    toast.error("Failed to add comment");
  }
};

// ── Email proof ────────────────────────────────────────────────────────────
const openEmailProofModal = async (doc) => {
  selectedEmailDoc.value = doc;
  showEmailProofModal.value = true;
  emailProofLoading.value = true;
  emailProofDetail.value = null;
  try {
    const res = await emailStore.getMessageDetails(
      doc.meta.email_ticket_message_id,
    );
    emailProofDetail.value = res.data.result || res.data.data;
  } catch (e) {
    console.error(e);
    toast.error("Failed to load email detail");
  } finally {
    emailProofLoading.value = false;
  }
};

const goToMailbox = (doc) => {
  window.open(
    `/mail-box?ticket_message_id=${doc.meta.email_ticket_message_id}`,
    "_blink",
  );
};

// ── Watchers ───────────────────────────────────────────────────────────────
watch(currentPage, () => groupStore.getListAction(watchSystem.value));
watch(product_type, () => {
  cachedData.value = {};
  expandedRowId.value = null;
  // AssignVan fetches on mount; hotel/attraction fetch via searchAction
  if (product_type.value !== "private_van_tour")
    groupStore.getListAction(watchSystem.value);
});
watch(instand_booking, () => {
  cachedData.value = {};
  expandedRowId.value = null;
  groupStore.getListAction(watchSystem.value);
});

onMounted(() => {
  if (route.query.product_type && route.query.activeTag && route.query.crm_id) {
    product_type.value = route.query.product_type;
    activeTag.value = route.query.activeTag;
    searchKey.value.searchId = route.query.crm_id;
    searchAction();
  } else {
    fetchData();
  }
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
