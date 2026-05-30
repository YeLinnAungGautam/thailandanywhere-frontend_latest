<template>
  <div class="bg-gray-50 py-6 min-h-screen font-sans">
    <!-- ───── Header ───── -->
    <div class="flex items-center justify-between mb-5 flex-wrap gap-3">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-[#FF613c] inline-block"></span>
        <h1 class="text-xl font-bold text-[#FF613c] tracking-tight">
          Bank Verify
        </h1>
      </div>
      <div class="flex items-center gap-2">
        <YearPickerVue @year-change="handleYearChange" />
        <select
          v-model="selectedMonth"
          @change="handleMonthChange(selectedMonth)"
          class="text-xs px-3 py-2 border border-gray-200 rounded-lg bg-white outline-none cursor-pointer"
        >
          <option :value="m.id" v-for="m in monthArray" :key="m.id">
            {{ m.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- ───── Tabs ───── -->
    <div class="flex items-center gap-1 mb-5 border-b border-gray-200">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold transition-all relative',
          activeTab === tab.id
            ? 'text-[#FF613c] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#FF613c] after:rounded-t'
            : 'text-gray-500 hover:text-gray-700',
        ]"
      >
        <component :is="tab.icon" class="w-3.5 h-3.5" />
        {{ tab.label }}
        <!-- Badge: shows duplicate count (orange) or unmatch count (yellow) or ✓ (green) -->
        <template v-if="tab.id === 'statement' && bsSummary">
          <span
            v-if="bsSummary.duplicate > 0"
            class="text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none bg-orange-400 text-white"
            >{{ bsSummary.duplicate }}</span
          >
          <span
            v-else-if="bsSummary.unmatch > 0"
            class="text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none bg-yellow-400 text-white"
            >{{ bsSummary.unmatch }}</span
          >
          <span
            v-else-if="bsSummary.total > 0"
            class="text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none bg-green-500 text-white"
            >✓</span
          >
        </template>
      </button>
    </div>

    <!-- ══════════════════════════════════════════════════════
         TAB 1 – CASH IMAGE VERIFY
    ══════════════════════════════════════════════════════ -->
    <template v-if="activeTab === 'verify'">
      <!-- Toolbar -->
      <div class="flex items-center gap-2 mb-4 flex-wrap relative">
        <div class="relative flex-shrink-0 w-64">
          <MagnifyingGlassIcon
            class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
          />
          <input
            type="search"
            v-model="searchKey.crm_id"
            placeholder="Search CRM ID or Amount…"
            @keyup.enter="searchAction"
            class="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg bg-white outline-none focus:border-[#FF613c] transition-colors"
          />
        </div>
        <div class="relative flex-shrink-0 w-64">
          <MagnifyingGlassIcon
            class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
          />
          <input
            type="search"
            v-model="cashImageIds"
            placeholder="Search Cash Image IDs"
            @keyup.enter="searchAction"
            class="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg bg-white outline-none focus:border-[#FF613c] transition-colors"
          />
        </div>

        <div class="relative">
          <button
            @click="filterShow = !filterShow"
            class="flex items-center gap-1.5 px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white hover:border-[#FF613c] hover:text-[#FF613c] transition-colors"
          >
            <FunnelIcon class="w-3.5 h-3.5" />
            Filter
            <span
              v-if="searchCount > 0"
              class="bg-[#FF613c] text-white text-[10px] px-1.5 rounded-full leading-5"
            >
              {{ searchCount }}
            </span>
          </button>

          <transition
            enter-active-class="transition ease-out duration-150"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-100"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div
              v-if="filterShow"
              class="absolute top-full left-0 mt-1.5 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-3 flex flex-col gap-2.5"
            >
              <div
                class="flex justify-between items-center pb-2 border-b border-gray-100"
              >
                <span class="text-xs font-semibold text-gray-700">Filters</span>
                <button
                  @click="clearFilter"
                  class="text-[11px] text-[#FF613c] hover:underline"
                >
                  Clear all
                </button>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[11px] text-gray-500 font-medium"
                  >Sender</label
                >
                <input
                  type="text"
                  v-model="searchKey.sender"
                  placeholder="Sender name"
                  class="px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#FF613c]"
                />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[11px] text-gray-500 font-medium"
                  >Receiver</label
                >
                <input
                  type="text"
                  v-model="searchKey.receiver"
                  placeholder="Receiver name"
                  class="px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#FF613c]"
                />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[11px] text-gray-500 font-medium"
                  >Currency</label
                >
                <select
                  v-model="searchKey.currency"
                  class="px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#FF613c] bg-white"
                >
                  <option value="">All</option>
                  <option value="THB">THB</option>
                  <option value="MMK">MMK</option>
                  <option value="USD">USD</option>
                </select>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[11px] text-gray-500 font-medium"
                  >Interact Bank</label
                >
                <select
                  v-model="searchKey.interact_bank"
                  class="px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#FF613c] bg-white"
                >
                  <option value="">Interact All</option>
                  <option value="personal">Personal</option>
                  <option value="company">Company</option>
                  <option value="cash_at_office">Cash at Office</option>
                  <option value="to_money_changer">To Money Changer</option>
                  <option value="deposit_management">Deposit Management</option>
                  <option value="pay_to_driver">Pay to Driver</option>
                </select>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[11px] text-gray-500 font-medium"
                  >Data Verify</label
                >
                <select
                  v-model="searchKey.data_verify"
                  class="px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#FF613c] bg-white"
                >
                  <option value="">Choose Status</option>
                  <option value="1">Verify</option>
                  <option value="0">Un verify</option>
                </select>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[11px] text-gray-500 font-medium"
                  >Bank Verify</label
                >
                <select
                  v-model="searchKey.bank_verify"
                  class="px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#FF613c] bg-white"
                >
                  <option value="">Choose Bank Status</option>
                  <option value="1">Verify</option>
                  <option value="0">Un verify</option>
                </select>
              </div>
              <div class="pt-1.5 border-t border-gray-100">
                <button
                  @click="searchAction"
                  class="w-full py-2 bg-[#FF613c] text-white text-xs font-semibold rounded-lg hover:bg-[#e84e2a] transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </transition>
        </div>

        <!-- Active chips -->
        <div class="flex gap-1.5 flex-wrap items-center">
          <span
            v-if="searchKey.sender"
            class="flex items-center gap-1 text-[11px] px-2 py-0.5 bg-orange-50 border border-orange-200 text-[#FF613c] rounded-full"
          >
            Sender: {{ searchKey.sender }}
            <XMarkIcon
              class="w-3 h-3 cursor-pointer"
              @click="removeFilter('sender')"
            />
          </span>
          <span
            v-if="searchKey.receiver"
            class="flex items-center gap-1 text-[11px] px-2 py-0.5 bg-orange-50 border border-orange-200 text-[#FF613c] rounded-full"
          >
            Receiver: {{ searchKey.receiver }}
            <XMarkIcon
              class="w-3 h-3 cursor-pointer"
              @click="removeFilter('receiver')"
            />
          </span>
          <span
            v-if="searchKey.currency"
            class="flex items-center gap-1 text-[11px] px-2 py-0.5 bg-orange-50 border border-orange-200 text-[#FF613c] rounded-full"
          >
            {{ searchKey.currency }}
            <XMarkIcon
              class="w-3 h-3 cursor-pointer"
              @click="removeFilter('currency')"
            />
          </span>
          <span
            v-if="searchKey.interact_bank"
            class="flex items-center gap-1 text-[11px] px-2 py-0.5 bg-orange-50 border border-orange-200 text-[#FF613c] rounded-full capitalize"
          >
            {{ searchKey.interact_bank }}
            <XMarkIcon
              class="w-3 h-3 cursor-pointer"
              @click="removeFilter('interact_bank')"
            />
          </span>
          <span
            v-if="searchKey.data_verify"
            class="flex items-center gap-1 text-[11px] px-2 py-0.5 bg-orange-50 border border-orange-200 text-[#FF613c] rounded-full capitalize"
          >
            {{ searchKey.data_verify == 1 ? "Data Verify" : "Data Un Verify" }}
            <XMarkIcon
              class="w-3 h-3 cursor-pointer"
              @click="removeFilter('data_verify')"
            />
          </span>
          <span
            v-if="searchKey.bank_verify"
            class="flex items-center gap-1 text-[11px] px-2 py-0.5 bg-orange-50 border border-orange-200 text-[#FF613c] rounded-full capitalize"
          >
            {{ searchKey.bank_verify == 1 ? "Bank Verify" : "Bank Un Verify" }}
            <XMarkIcon
              class="w-3 h-3 cursor-pointer"
              @click="removeFilter('bank_verify')"
            />
          </span>
        </div>
      </div>

      <!-- Cash Image Table -->
      <div
        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <template v-if="loading">
          <div class="divide-y divide-gray-100">
            <div
              v-for="i in 8"
              :key="i"
              class="flex gap-4 px-5 py-3.5 items-center"
            >
              <div
                class="h-3 bg-gray-100 rounded-full w-20 animate-pulse"
              ></div>
              <div
                class="h-3 bg-gray-100 rounded-full w-36 animate-pulse"
              ></div>
              <div
                class="h-3 bg-gray-100 rounded-full w-28 animate-pulse"
              ></div>
              <div
                class="h-3 bg-gray-100 rounded-full w-20 animate-pulse ml-auto"
              ></div>
              <div
                class="h-3 bg-gray-100 rounded-full w-16 animate-pulse"
              ></div>
              <div class="h-7 bg-gray-100 rounded-lg w-20 animate-pulse"></div>
            </div>
          </div>
        </template>

        <table v-else class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th
                class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
              >
                Date
              </th>
              <th
                class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
              >
                Time/ Eff.Date
              </th>
              <th
                class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
              >
                Sender → Receiver
              </th>
              <th
                colspan="2"
                class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
              >
                Withdrawal / Deposit
              </th>
              <th
                class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide"
              >
                Currency
              </th>
              <th
                class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
              >
                Interact Bank
              </th>
              <th
                class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide"
              >
                Status
              </th>
              <th
                class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="item in cashImages?.data ?? []"
              :key="item.id"
              :class="
                item.bank_verify == 1
                  ? 'bg-green-50/60 hover:bg-green-100/60'
                  : 'bg-white hover:bg-gray-50'
              "
              class="transition-colors"
            >
              <td class="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                {{ item.date.split(" ")[0] }}
              </td>
              <td class="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                {{ item.date.split(" ")[1] }}
              </td>
              <td class="px-5 py-3.5 w-[200px]">
                <div class="flex items-center gap-1.5 text-xs">
                  <span class="font-medium text-gray-700">{{
                    item.sender
                  }}</span>
                  <ArrowRightIcon class="w-3 h-3 text-gray-400 shrink-0" />
                  <span class="text-gray-500">{{ item.receiver }}</span>
                </div>
              </td>
              <td
                class="px-5 py-3.5 text-xs font-bold text-red-600 tabular-nums"
              >
                <p v-if="item.relatable_type != 'App\\Models\\Booking'">
                  {{ item.amount }}
                </p>
              </td>
              <td
                class="px-5 py-3.5 text-xs font-bold text-green-600 tabular-nums"
              >
                <p v-if="item.relatable_type == 'App\\Models\\Booking'">
                  {{ item.amount }}
                </p>
              </td>
              <td class="px-5 py-3.5">
                <span
                  class="inline-block text-[11px] font-semibold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md"
                  >{{ item.currency }}</span
                >
              </td>
              <td class="px-5 py-3.5">
                <span
                  class="inline-block text-[11px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md capitalize whitespace-nowrap"
                  >{{ item.interact_bank }}</span
                >
              </td>
              <td class="px-5 py-3.5">
                <span
                  :class="
                    item.bank_verify == 1
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  "
                  class="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
                >
                  <span
                    :class="
                      item.bank_verify == 1 ? 'bg-green-500' : 'bg-yellow-500'
                    "
                    class="w-1.5 h-1.5 rounded-full"
                  ></span>
                  {{ item.bank_verify == 1 ? "Verified" : "Pending" }}
                </span>
              </td>
              <td class="px-5 py-3.5">
                <button
                  @click="openModal(item)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-black border border-gray-200 text-[11px] font-semibold rounded-lg transition-all hover:-translate-y-px hover:shadow-md active:translate-y-0"
                >
                  <CheckCircleIcon class="w-3.5 h-3.5" />
                  Bank Verify
                </button>
              </td>
            </tr>
            <tr v-if="(cashImages?.data ?? []).length === 0">
              <td colspan="9" class="text-center text-gray-400 text-sm py-16">
                No records found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-3" v-if="!loading">
        <Pagination :data="cashImages" @change-page="changePage" />
      </div>
    </template>

    <!-- ══════════════════════════════════════════════════════
         TAB 2 – BANK STATEMENT
    ══════════════════════════════════════════════════════ -->
    <template v-if="activeTab === 'statement'">
      <!-- Summary bar + Import button -->
      <div class="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div class="flex items-center gap-2 flex-wrap">
          <template v-if="bsSummary">
            <div
              @click="verifiedStatus = ''"
              :class="
                verifiedStatus == ''
                  ? 'border border-[#FF613c]'
                  : 'border border-gray-200'
              "
              class="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-xs"
            >
              <span class="w-2 h-2 rounded-full bg-gray-400"></span>
              <span class="text-gray-500">Total</span>
              <span class="font-bold text-gray-700 tabular-nums">{{
                bsSummary.total
              }}</span>
            </div>
            <div
              @click="verifiedStatus = 'match'"
              :class="
                verifiedStatus == 'match'
                  ? 'border border-[#FF613c]'
                  : 'border border-gray-200'
              "
              class="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-lg text-xs"
            >
              <span class="w-2 h-2 rounded-full bg-green-500"></span>
              <span class="text-green-600">Match</span>
              <span class="font-bold text-green-700 tabular-nums">{{
                bsSummary.match
              }}</span>
            </div>
            <div
              @click="verifiedStatus = 'duplicate'"
              :class="
                verifiedStatus == 'duplicate'
                  ? 'border border-[#FF613c]'
                  : 'border border-gray-200'
              "
              class="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 rounded-lg text-xs"
            >
              <span class="w-2 h-2 rounded-full bg-orange-400"></span>
              <span class="text-orange-600">Duplicate</span>
              <span class="font-bold text-orange-700 tabular-nums">{{
                bsSummary.duplicate
              }}</span>
            </div>
            <div
              @click="verifiedStatus = 'unmatch'"
              :class="
                verifiedStatus == 'unmatch'
                  ? 'border border-[#FF613c]'
                  : 'border border-gray-200'
              "
              class="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 rounded-lg text-xs"
            >
              <span class="w-2 h-2 rounded-full bg-yellow-400"></span>
              <span class="text-yellow-600">Unmatch</span>
              <span class="font-bold text-yellow-700 tabular-nums">{{
                bsSummary.unmatch
              }}</span>
            </div>
          </template>
          <div
            v-else-if="bsStore.loading"
            class="h-7 w-64 bg-gray-100 rounded-lg animate-pulse"
          ></div>
        </div>

        <div class="flex justify-end items-center gap-x-2">
          <button
            @click="doBankVerifyAll"
            class="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white text-xs font-semibold rounded-lg hover:bg-green-600 transition-colors"
          >
            <ShieldCheckIcon class="w-3.5 h-3.5" />
            All Match Verify
          </button>
          <button
            @click="importModalOpen = true"
            class="flex items-center gap-1.5 px-4 py-2 bg-[#FF613c] text-white text-xs font-semibold rounded-lg hover:bg-[#e84e2a] transition-colors"
          >
            <ArrowUpTrayIcon class="w-3.5 h-3.5" />
            Import CSV
          </button>
        </div>
      </div>

      <!-- Statement table -->
      <div
        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <template v-if="bsStore.loading">
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
                class="h-3 bg-gray-100 rounded-full w-16 animate-pulse"
              ></div>
              <div
                class="h-3 bg-gray-100 rounded-full w-48 animate-pulse"
              ></div>
              <div
                class="h-3 bg-gray-100 rounded-full w-20 animate-pulse ml-auto"
              ></div>
              <div
                class="h-6 bg-gray-100 rounded-full w-24 animate-pulse"
              ></div>
            </div>
          </div>
        </template>

        <table v-else class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th
                class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
              >
                Date
              </th>
              <th
                class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide"
              >
                Time
              </th>
              <th
                class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide"
              >
                Description
              </th>
              <th
                class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide"
              >
                Detail
              </th>
              <th
                class="text-right px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
              >
                Withdrawal
              </th>
              <th
                class="text-right px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide"
              >
                Deposit
              </th>
              <th
                class="text-right px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide"
              >
                Balance
              </th>
              <th
                class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
              >
                Matched #
              </th>
              <th
                class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide"
              >
                Status
              </th>
              <th
                class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="row in bsStore.records?.data ?? []"
              :key="row.id"
              :class="bsRowBg(row.verified)"
              class="transition-colors"
            >
              <td class="px-5 py-3 text-xs text-gray-500 whitespace-nowrap">
                {{ row.txn_date }}
              </td>
              <td class="px-5 py-3 text-xs text-gray-500 font-mono">
                {{ row.txn_time ?? "—" }}
              </td>
              <td
                class="px-5 py-3 text-xs text-gray-600 max-w-[160px] truncate"
                :title="row.description"
              >
                {{ row.description }}
              </td>
              <td
                class="px-5 py-3 text-xs text-gray-400 max-w-[160px] truncate"
                :title="row.detail"
              >
                {{ row.detail }}
              </td>
              <td
                class="px-5 py-3 text-xs font-bold text-red-500 tabular-nums text-right"
              >
                {{ row.withdrawal ? fmtNum(row.withdrawal) : "" }}
              </td>
              <td
                class="px-5 py-3 text-xs font-bold text-green-600 tabular-nums text-right"
              >
                {{ row.deposit ? fmtNum(row.deposit) : "" }}
              </td>
              <td
                class="px-5 py-3 text-xs text-gray-500 tabular-nums text-right"
              >
                {{ row.balance ? fmtNum(row.balance) : "" }}
              </td>
              <!-- <td class="px-5 py-3">
                <span
                  v-if="row.cash_image_id"
                  class="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md"
                >
                  #{{ row.cash_image_id }}
                </span>
                <span
                  v-if="row.duplicate_ids"
                  class="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md"
                >
                  #{{ row.duplicate_ids }}
                </span>
                <span v-else class="text-[11px] text-gray-300">—</span>
              </td> -->
              <td class="px-5 py-3">
                <template v-if="row.cash_image_id || row.duplicate_ids">
                  <span
                    v-if="row.cash_image_id"
                    @click="goToVerifyWithIds(row.cash_image_id)"
                    class="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md cursor-pointer hover:bg-blue-100 transition-colors"
                  >
                    #{{ row.cash_image_id }}
                  </span>
                  <span
                    v-if="row.duplicate_ids"
                    @click="goToVerifyWithIds(row.duplicate_ids)"
                    class="text-[11px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md cursor-pointer hover:bg-orange-100 transition-colors ml-1"
                  >
                    #{{ row.duplicate_ids }}
                  </span>
                </template>
                <span v-else class="text-[11px] text-gray-300">—</span>
              </td>
              <!-- Status badge -->
              <td class="px-5 py-3">
                <span
                  :class="bsStatusBadge(row.verified)"
                  class="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
                >
                  <span
                    :class="bsStatusDot(row.verified)"
                    class="w-1.5 h-1.5 rounded-full"
                  ></span>
                  {{ bsStatusLabel(row.verified) }}
                </span>
              </td>
              <!-- Action -->
              <td class="px-5 py-3 whitespace-nowrap">
                <!-- match → Bank Verify button -->
                <button
                  v-if="row.verified === 'match'"
                  @click="doBankVerify(row)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-[11px] font-semibold rounded-lg transition-all hover:-translate-y-px hover:shadow-md active:translate-y-0"
                >
                  <CheckCircleIcon class="w-3.5 h-3.5 text-green-600" />
                  Bank Verify
                </button>
                <!-- duplicate → Resolve button -->
                <button
                  v-else-if="row.verified === 'duplicate'"
                  @click="openResolveModal(row)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-[11px] font-semibold rounded-lg transition-all hover:-translate-y-px hover:shadow-md active:translate-y-0"
                >
                  <AdjustmentsHorizontalIcon class="w-3.5 h-3.5" />
                  Resolve
                </button>
                <!-- unmatch → nothing or dash -->
                <span v-else class="text-[11px] text-gray-300">—</span>
              </td>
            </tr>
            <tr v-if="(bsStore.records?.data ?? []).length === 0">
              <td colspan="10" class="text-center py-16 text-gray-400 text-sm">
                No statement data for {{ monthName(selectedMonth) }} {{ year }}.
                <button
                  @click="importModalOpen = true"
                  class="ml-2 text-[#FF613c] underline text-xs"
                >
                  Import CSV
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-3" v-if="!bsStore.loading && bsStore.records">
        <Pagination :data="bsStore.records" @change-page="bsChangePage" />
      </div>
    </template>

    <!-- ═══════════════════════════════════════════
         CASH IMAGE VERIFY MODAL (unchanged)
    ═══════════════════════════════════════════ -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modalOpen"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="modalOpen"
            class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
          >
            <div
              class="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0"
            >
              <div>
                <p
                  class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest"
                >
                  Bank Verification
                </p>
                <p class="text-lg font-bold text-gray-800 mt-0.5">
                  {{ modalItem?.crm_id || `#${modalItem?.id}` }}
                </p>
              </div>
              <button
                @click="closeModal"
                class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon class="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div
              v-if="loadingDetail"
              class="flex flex-col items-center justify-center gap-3 h-72 text-gray-400 text-sm"
            >
              <div
                class="w-8 h-8 border-2 border-gray-200 border-t-[#FF613c] rounded-full animate-spin"
              ></div>
              Loading details…
            </div>
            <div v-else-if="detailVal" class="p-6 overflow-y-auto flex-1">
              <div class="grid grid-cols-2 gap-6">
                <div
                  class="col-span-1 rounded-xl overflow-hidden border border-gray-100 max-h-96 overflow-y-auto"
                >
                  <img
                    :src="detailVal.image"
                    class="w-full h-auto block"
                    alt="Cash slip"
                  />
                </div>
                <div class="col-span-1 flex flex-col gap-3">
                  <div class="flex items-center justify-between gap-3">
                    <label
                      class="text-xs font-medium text-gray-500 w-28 shrink-0"
                      >Currency</label
                    >
                    <select
                      v-model="formData.currency"
                      class="flex-1 px-3 py-2 text-sm font-semibold border border-gray-200 rounded-lg outline-none focus:border-[#FF613c] bg-white transition-colors"
                    >
                      <option value="THB">THB</option>
                      <option value="MMK">MMK</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                  <div class="flex items-center justify-between gap-3">
                    <label
                      class="text-xs font-medium text-gray-500 w-28 shrink-0"
                      >Sender</label
                    >
                    <input
                      type="text"
                      v-model="formData.sender"
                      class="flex-1 px-3 py-2 text-sm font-semibold border border-gray-200 rounded-lg outline-none focus:border-[#FF613c] transition-colors"
                    />
                  </div>
                  <div class="flex items-center justify-between gap-3">
                    <label
                      class="text-xs font-medium text-gray-500 w-28 shrink-0"
                      >Receiver</label
                    >
                    <input
                      type="text"
                      v-model="formData.receiver"
                      class="flex-1 px-3 py-2 text-sm font-semibold border border-gray-200 rounded-lg outline-none focus:border-[#FF613c] transition-colors"
                    />
                  </div>
                  <div class="flex items-center justify-between gap-3">
                    <label
                      class="text-xs font-medium text-gray-500 w-28 shrink-0"
                      >Interact Bank</label
                    >
                    <select
                      v-model="formData.interact_bank"
                      class="flex-1 px-3 py-2 text-sm font-semibold border border-gray-200 rounded-lg outline-none focus:border-[#FF613c] bg-white transition-colors"
                    >
                      <option value="personal">Personal</option>
                      <option value="company">Company</option>
                      <option value="cash_at_office">Cash at Office</option>
                      <option value="to_money_changer">To Money Changer</option>
                      <option value="deposit_management">
                        Deposit Management
                      </option>
                      <option value="pay_to_driver">Pay to Driver</option>
                    </select>
                  </div>
                  <div class="flex items-center justify-between gap-3">
                    <label
                      class="text-xs font-medium text-gray-500 w-28 shrink-0"
                      >Amount</label
                    >
                    <input
                      type="number"
                      v-model="formData.amount"
                      class="flex-1 px-3 py-2 text-sm font-semibold border border-gray-200 rounded-lg outline-none focus:border-[#FF613c] transition-colors"
                    />
                  </div>
                  <div class="flex items-center justify-between gap-3">
                    <label
                      class="text-xs font-medium text-gray-500 w-28 shrink-0"
                      >Date</label
                    >
                    <div class="flex-1">
                      <div
                        v-if="!showDate"
                        @click="showDate = true"
                        class="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:border-[#FF613c] transition-colors"
                      >
                        <span
                          class="text-sm font-semibold flex-1 text-gray-700"
                          >{{ formattedDateTime(formData.date) }}</span
                        >
                        <PencilIcon
                          class="w-3.5 h-3.5 text-gray-400 shrink-0"
                        />
                      </div>
                      <input
                        v-else
                        type="datetime-local"
                        v-model="formData.date"
                        class="w-full px-3 py-2 text-sm font-semibold border border-gray-200 rounded-lg outline-none focus:border-[#FF613c] transition-colors"
                      />
                    </div>
                  </div>
                  <div class="flex-1 min-h-4"></div>
                  <div
                    class="flex items-center gap-2 pt-3 border-t border-gray-100"
                  >
                    <button
                      @click="verifyStatus(false)"
                      :disabled="submitting"
                      class="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-500 border border-red-200 bg-white rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <XCircleIcon class="w-4 h-4" />
                      Not Verified
                    </button>
                    <button
                      @click="submitUpdate"
                      :disabled="submitting"
                      class="flex items-center gap-1.5 flex-1 justify-center px-4 py-2 text-xs font-semibold text-white bg-[#FF613c] hover:bg-[#e84e2a] rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <CheckIcon class="w-4 h-4" />
                      {{ submitting ? "Saving…" : "Save & Verify" }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <!-- ═══════════════════════════════════════════
         IMPORT CSV MODAL
    ═══════════════════════════════════════════ -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="importModalOpen"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="importModalOpen = false"
      >
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="importModalOpen"
            class="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden"
          >
            <div
              class="flex items-center justify-between px-6 py-4 border-b border-gray-100"
            >
              <div>
                <p
                  class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest"
                >
                  KBank Statement
                </p>
                <p class="text-base font-bold text-gray-800 mt-0.5">
                  Import CSV
                </p>
              </div>
              <button
                @click="importModalOpen = false"
                class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon class="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div class="p-6 flex flex-col gap-4">
              <!-- Result banner after import -->
              <transition
                enter-active-class="transition ease-out duration-300"
                enter-from-class="opacity-0 -translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
              >
                <div
                  v-if="importResult"
                  class="rounded-xl border border-green-200 bg-green-50 p-4"
                >
                  <p
                    class="text-xs font-semibold text-green-700 mb-3 flex items-center gap-1.5"
                  >
                    <CheckCircleIcon class="w-4 h-4" />
                    Import complete · {{ monthName(importResult.month) }}
                    {{ importResult.year }}
                  </p>
                  <div class="grid grid-cols-4 gap-2">
                    <div
                      class="bg-white rounded-lg border border-green-100 px-2 py-2 text-center"
                    >
                      <p class="text-base font-bold text-blue-600 tabular-nums">
                        {{ importResult.imported }}
                      </p>
                      <p class="text-[10px] text-gray-400 mt-0.5">Imported</p>
                    </div>
                    <div
                      class="bg-white rounded-lg border border-green-100 px-2 py-2 text-center"
                    >
                      <p
                        class="text-base font-bold text-green-600 tabular-nums"
                      >
                        {{ importResult.match }}
                      </p>
                      <p class="text-[10px] text-gray-400 mt-0.5">Match</p>
                    </div>
                    <div
                      class="bg-white rounded-lg border border-orange-100 px-2 py-2 text-center"
                    >
                      <p
                        class="text-base font-bold text-orange-500 tabular-nums"
                      >
                        {{ importResult.duplicate }}
                      </p>
                      <p class="text-[10px] text-gray-400 mt-0.5">Duplicate</p>
                    </div>
                    <div
                      class="bg-white rounded-lg border border-yellow-100 px-2 py-2 text-center"
                    >
                      <p
                        class="text-base font-bold text-yellow-500 tabular-nums"
                      >
                        {{ importResult.unmatch }}
                      </p>
                      <p class="text-[10px] text-gray-400 mt-0.5">Unmatch</p>
                    </div>
                  </div>
                  <p
                    v-if="importResult.account_number"
                    class="mt-2 text-[11px] text-green-600"
                  >
                    Account:
                    <span class="font-semibold">{{
                      importResult.account_number
                    }}</span>
                  </p>
                </div>
              </transition>

              <!-- Month / Year -->
              <div class="flex gap-3">
                <div class="flex flex-col gap-1 flex-1">
                  <label class="text-[11px] text-gray-500 font-medium"
                    >Month</label
                  >
                  <select
                    v-model="importMonth"
                    class="px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white outline-none focus:border-[#FF613c]"
                  >
                    <option v-for="m in monthArray" :key="m.id" :value="m.id">
                      {{ m.name }}
                    </option>
                  </select>
                </div>
                <div class="flex flex-col gap-1 flex-1">
                  <label class="text-[11px] text-gray-500 font-medium"
                    >Year</label
                  >
                  <select
                    v-model="importYear"
                    class="px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white outline-none focus:border-[#FF613c]"
                  >
                    <option v-for="y in yearOptions" :key="y" :value="y">
                      {{ y }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Drop zone -->
              <div
                class="relative border-2 border-dashed rounded-xl transition-colors cursor-pointer"
                :class="
                  isDragging
                    ? 'border-[#FF613c] bg-orange-50'
                    : importFile
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-200 bg-gray-50 hover:border-[#FF613c]'
                "
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="onDrop"
                @click="$refs.csvInput.click()"
              >
                <input
                  ref="csvInput"
                  type="file"
                  accept=".csv,.txt"
                  class="hidden"
                  @change="onFileSelected"
                />
                <div
                  class="flex flex-col items-center justify-center py-7 gap-2 pointer-events-none"
                >
                  <template v-if="importFile">
                    <CheckCircleIcon class="w-7 h-7 text-green-500" />
                    <p class="text-sm font-semibold text-green-700">
                      {{ importFile.name }}
                    </p>
                    <p class="text-[11px] text-green-500">
                      {{ (importFile.size / 1024).toFixed(1) }} KB · Click to
                      change
                    </p>
                  </template>
                  <template v-else>
                    <ArrowUpTrayIcon class="w-7 h-7 text-gray-300" />
                    <p class="text-sm font-semibold text-gray-500">
                      Drop CSV here or
                      <span class="text-[#FF613c]">browse</span>
                    </p>
                    <p class="text-[11px] text-gray-400">
                      KBank statement · .csv only · max 10 MB
                    </p>
                  </template>
                </div>
              </div>

              <!-- Overwrite warning -->
              <div
                v-if="importFile"
                class="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2"
              >
                <ExclamationTriangleIcon
                  class="w-4 h-4 text-amber-500 mt-0.5 shrink-0"
                />
                <p class="text-[11px] text-amber-700">
                  Existing data for
                  <strong>{{ monthName(importMonth) }} {{ importYear }}</strong>
                  will be deleted and re-matched.
                </p>
              </div>

              <!-- Actions -->
              <div class="flex gap-2 pt-1">
                <button
                  @click="importModalOpen = false"
                  class="flex-1 py-2.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  @click="doImport"
                  :disabled="!importFile || bsStore.importing"
                  class="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#FF613c] text-white text-xs font-semibold rounded-lg transition-all hover:bg-[#e84e2a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowPathIcon
                    v-if="bsStore.importing"
                    class="w-4 h-4 animate-spin"
                  />
                  <ArrowUpTrayIcon v-else class="w-4 h-4" />
                  {{ bsStore.importing ? "Importing…" : "Import & Match" }}
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <!-- ═══════════════════════════════════════════
         RESOLVE DUPLICATE MODAL
    ═══════════════════════════════════════════ -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="resolveModalOpen"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="closeResolveModal"
      >
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="resolveModalOpen"
            class="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden"
          >
            <div
              class="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0"
            >
              <div>
                <p
                  class="text-[10px] font-semibold text-orange-400 uppercase tracking-widest"
                >
                  Duplicate Found
                </p>
                <p class="text-base font-bold text-gray-800 mt-0.5">
                  Select the correct Cash Image
                </p>
              </div>
              <button
                @click="closeResolveModal"
                class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon class="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div class="p-6 flex flex-col gap-4">
              <!-- Statement row summary -->
              <div
                class="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 flex flex-col gap-1"
              >
                <div class="flex justify-between">
                  <span class="text-gray-400">Date / Time</span>
                  <span class="font-semibold"
                    >{{ resolveRow?.txn_date }} {{ resolveRow?.txn_time }}</span
                  >
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Withdrawal</span>
                  <span class="font-bold text-red-500">{{
                    resolveRow?.withdrawal ? fmtNum(resolveRow.withdrawal) : "—"
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Deposit</span>
                  <span class="font-bold text-green-600">{{
                    resolveRow?.deposit ? fmtNum(resolveRow.deposit) : "—"
                  }}</span>
                </div>
              </div>

              <!-- Loading candidates -->
              <div
                v-if="loadingCandidates"
                class="flex items-center justify-center gap-2 py-8 text-gray-400 text-xs"
              >
                <div
                  class="w-5 h-5 border-2 border-gray-200 border-t-[#FF613c] rounded-full animate-spin"
                ></div>
                Loading candidates…
              </div>

              <!-- Candidate list -->
              <div v-else-if="candidates.length" class="flex flex-col gap-2">
                <p class="text-[11px] text-gray-400">
                  {{ candidates.length }} matching cash images found:
                </p>
                <div
                  v-for="ci in candidates"
                  :key="ci.id"
                  @click="selectedCandidateId = ci.id"
                  :class="
                    selectedCandidateId === ci.id
                      ? 'border-[#FF613c] bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  "
                  class="border-2 rounded-xl p-3 cursor-pointer transition-all"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div
                        :class="
                          selectedCandidateId === ci.id
                            ? 'bg-[#FF613c]'
                            : 'bg-gray-200'
                        "
                        class="w-3.5 h-3.5 rounded-full transition-colors flex items-center justify-center"
                      >
                        <div
                          v-if="selectedCandidateId === ci.id"
                          class="w-1.5 h-1.5 bg-white rounded-full"
                        ></div>
                      </div>
                      <span class="text-xs font-bold text-gray-700"
                        >#{{ ci.id }}</span
                      >
                    </div>
                    <span
                      :class="
                        ci.bank_verify
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      "
                      class="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    >
                      {{ ci.bank_verify ? "Already Verified" : "Pending" }}
                    </span>
                  </div>
                  <div
                    class="mt-2 text-xs text-gray-600 grid grid-cols-2 gap-1"
                  >
                    <span class="text-gray-400">Sender</span
                    ><span class="font-medium truncate">{{ ci.sender }}</span>
                    <span class="text-gray-400">Receiver</span
                    ><span class="font-medium truncate">{{ ci.receiver }}</span>
                    <span class="text-gray-400">Amount</span
                    ><span class="font-bold">{{ fmtNum(ci.amount) }}</span>
                    <span class="text-gray-400">Date</span
                    ><span>{{ ci.date }}</span>
                  </div>
                </div>
              </div>

              <div v-else class="text-center text-gray-400 text-xs py-6">
                No candidates found.
              </div>

              <!-- Actions -->
              <div class="flex gap-2 pt-1">
                <button
                  @click="closeResolveModal"
                  class="flex-1 py-2.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  @click="doResolve"
                  :disabled="!selectedCandidateId || resolvingRecord"
                  class="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#FF613c] text-white text-xs font-semibold rounded-lg transition-all hover:bg-[#e84e2a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowPathIcon
                    v-if="resolvingRecord"
                    class="w-4 h-4 animate-spin"
                  />
                  <CheckIcon v-else class="w-4 h-4" />
                  {{ resolvingRecord ? "Resolving…" : "Confirm & Bank Verify" }}
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import Pagination from "../components/PaginationExpense.vue";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  CheckIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  TableCellsIcon,
  ShieldCheckIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/vue/24/outline";
import { XCircleIcon } from "@heroicons/vue/24/solid";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { useCashImageStore } from "../stores/cashImage";
import { useBankStatementStore } from "../stores/bankStatementStore";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
import YearPickerVue from "./AccountingComponent/yearPicker.vue";
import { formattedDateTime, formattedDateTimeDB } from "./help/FormatData";

// ─── Stores ──────────────────────────────────────────────
const router = useRouter();
const route = useRoute();
const cashImageStore = useCashImageStore();
const bsStore = useBankStatementStore();
const { cashImages, loading } = storeToRefs(cashImageStore);
const toast = useToast();

// ─── Tabs ────────────────────────────────────────────────
const activeTab = ref("verify");
const tabs = [
  { id: "verify", label: "Cash Image Verify", icon: ShieldCheckIcon },
  { id: "statement", label: "Bank Statement", icon: TableCellsIcon },
];

// ─── Shared date state ───────────────────────────────────
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
const monthName = (id) => monthArray.find((m) => m.id === id)?.name ?? "";

const yearOptions = computed(() => {
  const opts = [];
  for (let y = currentDate.getFullYear(); y >= 2020; y--) opts.push(y);
  return opts;
});

// ─── Cash image tab ───────────────────────────────────────
const modalOpen = ref(false);
const modalItem = ref(null);
const detailVal = ref(null);
const loadingDetail = ref(false);
const submitting = ref(false);
const showDate = ref(false);
const filterShow = ref(false);
const saveUrl = ref("");

const searchKey = ref({
  crm_id: "",
  sender: "",
  receiver: "",
  currency: "",
  interact_bank: "",
  bank_verify: "",
  data_verify: "",
});

const formData = ref({
  id: "",
  date: "",
  sender: "",
  receiver: "",
  amount: 0,
  interact_bank: "personal",
  currency: "THB",
  relatable_id: "",
  relatable_type: "",
});

const searchCount = computed(
  () => Object.values(searchKey.value).filter((v) => v && v !== "").length,
);

const watchSystem = computed(() => {
  const result = {};
  result.interact_bank = "company";
  Object.keys(searchKey.value).forEach((k) => {
    if (searchKey.value[k]) result[k] = searchKey.value[k];
  });
  if (cashImageIds.value) {
    result.cash_image_ids = cashImageIds.value;
  }
  if (year.value && selectedMonth.value) {
    const start = new Date(year.value, selectedMonth.value - 1, 1);
    const end = new Date(year.value, selectedMonth.value, 0);
    const fmt = (d) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate(),
      ).padStart(2, "0")}`;
    result.date = `${fmt(start)},${fmt(end)}`;
  }
  result.limit = 20;
  result.data_verify = 1;
  result.sort_by = "date";
  result.sort_order = "asc";
  result.include_relatable = true;
  return result;
});

const getAction = async () => {
  if (saveUrl.value === "")
    await cashImageStore.getListAction(watchSystem.value);
  else await changePage(saveUrl.value);
};
const changePage = async (url) => {
  saveUrl.value = url;
  await cashImageStore.getChangePage(url, watchSystem.value);
};
const searchAction = async () => {
  filterShow.value = false;
  await getAction();
};
// const clearFilter = () => {
//   searchKey.value = {
//     crm_id: "",
//     sender: "",
//     receiver: "",
//     currency: "",
//     interact_bank: "",
//   };
//   filterShow.value = false;
//   getAction();
// };
const clearFilter = () => {
  searchKey.value = {
    crm_id: "",
    sender: "",
    receiver: "",
    currency: "",
    interact_bank: "",
    bank_verify: "",
    data_verify: "",
  };
  cashImageIds.value = ""; // ← add this
  filterShow.value = false;
  getAction();
};
const removeFilter = (key) => {
  searchKey.value[key] = "";
  searchAction();
};

const handleYearChange = (y) => {
  year.value = y;
  activeTab.value === "verify" ? getAction() : loadBsData();
};
const handleMonthChange = (m) => {
  selectedMonth.value = m;
  activeTab.value === "verify" ? getAction() : loadBsData();
};

const convertToDatetimeLocal = (dateString) => {
  if (!dateString) return "";
  try {
    if (dateString.includes("T")) return dateString.slice(0, 16);
    const [datePart, timePart] = dateString.split(" ");
    const [d, mo, y] = datePart.split("-");
    const [h, mi] = timePart.split(":");
    return `${y}-${mo}-${d}T${h}:${mi}`;
  } catch {
    return "";
  }
};

const openModal = async (item) => {
  modalItem.value = item;
  modalOpen.value = true;
  showDate.value = false;
  loadingDetail.value = true;
  try {
    const res = await cashImageStore.getDetailAction(item.id);
    detailVal.value = res.result;
    formData.value = {
      id: detailVal.value.id,
      date: convertToDatetimeLocal(detailVal.value.date),
      sender: detailVal.value.sender,
      receiver: detailVal.value.receiver,
      amount: detailVal.value.amount,
      interact_bank: detailVal.value.interact_bank || "personal",
      currency: detailVal.value.currency,
      relatable_id: detailVal.value.relatable_id,
      relatable_type: detailVal.value.relatable_type,
    };
  } catch {
    toast.error("Failed to load details");
    closeModal();
  } finally {
    loadingDetail.value = false;
  }
};
const closeModal = () => {
  modalOpen.value = false;
  modalItem.value = null;
  detailVal.value = null;
};

const submitUpdate = async () => {
  submitting.value = true;
  try {
    const fd = new FormData();
    fd.append("_method", "PUT");
    fd.append("amount", formData.value.amount);
    fd.append("date", formattedDateTimeDB(formData.value.date));
    fd.append("sender", formData.value.sender);
    fd.append("reciever", formData.value.receiver);
    fd.append("interact_bank", formData.value.interact_bank);
    fd.append("currency", formData.value.currency);
    fd.append("relatable_id", formData.value.relatable_id);
    fd.append("relatable_type", formData.value.relatable_type);
    await cashImageStore.updateAction(fd, formData.value.id);
    await verifyStatus(true);
  } catch {
    toast.error("Update failed");
  } finally {
    submitting.value = false;
  }
};

const verifyStatus = async (status) => {
  const res = await Swal.fire({
    title: "Are you sure?",
    text: `Mark this item as ${status ? "Verified" : "Not Verified"}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#FF613c",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, confirm",
  });
  if (res.isConfirmed) {
    try {
      const fd = new FormData();
      fd.append("_method", "PUT");
      fd.append("bank_verify", status ? 1 : 0);
      await cashImageStore.cashImageBankVerify(fd, formData.value.id);
      toast.success(`Marked as ${status ? "Verified" : "Not Verified"}`);
      closeModal();
      await getAction();
    } catch {
      toast.error("Verification failed");
    }
  }
};

// ─── Bank Statement tab ───────────────────────────────────
const bsSummary = computed(() => bsStore.summary);
const verifiedStatus = ref("");

const watchSystemRecord = computed(() => {
  let result = {};
  result.month = selectedMonth.value;
  result.year = year.value;
  result.limit = 20;
  result.verified = verifiedStatus.value;
  return result;
});

const loadBsData = async () => {
  await Promise.all([
    bsStore.getRecords(watchSystemRecord.value),
    bsStore.getSummary({ month: selectedMonth.value, year: year.value }),
  ]);
};

const bsChangePage = async (url) => {
  await bsStore.getRecordsPage(url, watchSystemRecord.value);
};

watch(verifiedStatus, async () => {
  await loadBsData();
});

watch(activeTab, (tab) => {
  if (tab === "statement") loadBsData();
});

// ─── BS row helpers ───────────────────────────────────────
const bsRowBg = (v) => {
  if (v === "match") return "bg-green-50/40 hover:bg-green-50/80";
  if (v === "duplicate") return "bg-orange-50/40 hover:bg-orange-50/80";
  return "bg-white hover:bg-gray-50";
};
const bsStatusBadge = (v) => {
  if (v === "match") return "bg-green-100 text-green-700";
  if (v === "duplicate") return "bg-orange-100 text-orange-700";
  return "bg-yellow-100 text-yellow-700";
};
const bsStatusDot = (v) => {
  if (v === "match") return "bg-green-500";
  if (v === "duplicate") return "bg-orange-400";
  return "bg-yellow-400";
};
const bsStatusLabel = (v) => {
  if (v === "match") return "Match";
  if (v === "duplicate") return "Duplicate";
  return "Unmatch";
};

// ─── Bank Verify direct action (match rows) ──────────────
const doBankVerify = async (row) => {
  const res = await Swal.fire({
    title: "Bank Verify?",
    text: `Confirm bank verify for cash image #${row.cash_image_id}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#FF613c",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, verify",
  });
  if (!res.isConfirmed) return;
  try {
    await bsStore.bankVerifyRecord(row.id);
    toast.success("Cash image bank-verified");
    await loadBsData();
    await getAction(); // refresh cash image tab too
  } catch {
    toast.error("Bank verify failed");
  }
};

const doBankVerifyAll = async () => {
  const res = await Swal.fire({
    title: "Bank Verify?",
    text: `Confirm bank verify for cash image match?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#FF613c",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, verify",
  });
  if (!res.isConfirmed) return;
  try {
    await bsStore.bankVerifyRecordAll({
      month: selectedMonth.value,
      year: year.value,
    });
    toast.success("Cash image bank-verified");
    await loadBsData();
    await getAction(); // refresh cash image tab too
  } catch {
    toast.error("Bank verify failed");
  }
};

// ─── Import modal ─────────────────────────────────────────
const importModalOpen = ref(false);
const importFile = ref(null);
const importResult = ref(null);
const isDragging = ref(false);
const importMonth = ref(currentDate.getMonth() + 1);
const importYear = ref(currentDate.getFullYear());

watch(importModalOpen, (open) => {
  if (open) {
    importMonth.value = selectedMonth.value;
    importYear.value = year.value;
    importFile.value = null;
    importResult.value = null;
  }
});

const onFileSelected = (e) => {
  importFile.value = e.target.files[0] ?? null;
};
const onDrop = (e) => {
  isDragging.value = false;
  const f = e.dataTransfer.files[0];
  if (f && (f.name.endsWith(".csv") || f.name.endsWith(".txt")))
    importFile.value = f;
  else toast.error("Please drop a .csv file");
};

const doImport = async () => {
  if (!importFile.value) return;
  try {
    // store.importCsv auto-refreshes records + summary internally
    const result = await bsStore.importCsv(
      importFile.value,
      importMonth.value,
      importYear.value,
    );
    importResult.value = result;
    importFile.value = null;
    toast.success(
      `Imported ${result.imported} rows · ${result.match} matched · ${result.duplicate} duplicate · ${result.unmatch} unmatched`,
    );
    await getAction(); // also refresh cash image tab
  } catch (err) {
    toast.error(err?.response?.data?.message ?? "Import failed");
  }
};

const cashImageIds = ref("");
const goToVerifyWithIds = async (ids) => {
  activeTab.value = "verify";
  // reuse the search bar as the display chip
  // store cash_image_ids separately so watchSystem picks it up
  cashImageIds.value = String(ids);
  saveUrl.value = "";
  await getAction();
};

// ─── Resolve duplicate modal ─────────────────────────────
const resolveModalOpen = ref(false);
const resolveRow = ref(null);
const candidates = ref([]);
const selectedCandidateId = ref(null);
const loadingCandidates = ref(false);
const resolvingRecord = ref(false);

const openResolveModal = async (row) => {
  resolveRow.value = row;
  resolveModalOpen.value = true;
  selectedCandidateId.value = null;
  candidates.value = [];
  loadingCandidates.value = true;
  try {
    const data = await bsStore.getDuplicateCandidates(row.id);
    candidates.value = data.candidates ?? [];
  } catch {
    toast.error("Failed to load candidates");
    closeResolveModal();
  } finally {
    loadingCandidates.value = false;
  }
};

const closeResolveModal = () => {
  resolveModalOpen.value = false;
  resolveRow.value = null;
  candidates.value = [];
  selectedCandidateId.value = null;
};

const doResolve = async () => {
  if (!selectedCandidateId.value || !resolveRow.value) return;
  resolvingRecord.value = true;
  try {
    await bsStore.resolveRecord(resolveRow.value.id, selectedCandidateId.value);
    toast.success(`Cash image #${selectedCandidateId.value} bank-verified`);
    closeResolveModal();
    await loadBsData();
    await getAction();
  } catch (err) {
    toast.error(err?.response?.data?.message ?? "Resolve failed");
  } finally {
    resolvingRecord.value = false;
  }
};

// ─── Helpers ─────────────────────────────────────────────
const fmtNum = (n) =>
  n != null
    ? new Intl.NumberFormat("th-TH", { minimumFractionDigits: 2 }).format(n)
    : "";

// ─── Mount ───────────────────────────────────────────────
onMounted(async () => {
  if (route.query.month) selectedMonth.value = parseInt(route.query.month);
  if (route.query.year) year.value = parseInt(route.query.year);
  await getAction();
  bsStore.getSummary({ month: selectedMonth.value, year: year.value });
});
</script>
