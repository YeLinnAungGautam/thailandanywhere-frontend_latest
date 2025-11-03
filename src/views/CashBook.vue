<template>
  <Layout :is_white="true" class="relative">
    <!-- Header -->
    <div
      :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
      class="space-x-8 col-span-3 flex justify-start items-center transition-all duration-200 gap-2 text-sm pb-4 absolute top-6"
    >
      <p class="text-3xl font-medium text-[#FF613c]">
        Cash Book
        <span class="w-2 h-2 bg-[#FF613c] rounded-full inline-block"></span>
      </p>
    </div>

    <div class="grid grid-cols-1 gap-4">
      <!-- Header Component -->
      <div>
        <CashHeader />
      </div>

      <!-- Filters Section -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div class="grid grid-cols-7 gap-4">
          <div class="col-span-1">
            <label class="block text-xs font-medium text-gray-700 mb-1"
              >Type</label
            >
            <select
              v-model="filters.type"
              class="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div class="col-span-1">
            <label class="block text-xs font-medium text-gray-700 mb-1"
              >Structure</label
            >
            <select
              v-model="filters.cash_structure_id"
              class="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Structures</option>
              <option
                v-for="structure in cash_structures?.data ?? []"
                :key="structure.id"
                :value="structure.id"
              >
                {{ structure.name }}
              </option>
            </select>
          </div>
          <div class="col-span-1">
            <label class="block text-xs font-medium text-gray-700 mb-1"
              >Start Date</label
            >
            <input
              v-model="filters.start_date"
              type="date"
              class="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="col-span-1">
            <label class="block text-xs font-medium text-gray-700 mb-1"
              >End Date</label
            >
            <input
              v-model="filters.end_date"
              type="date"
              class="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="col-span-1">
            <label class="block text-xs font-medium text-gray-700 mb-1"
              >Limit</label
            >
            <input
              v-model="filters.limit"
              type="number"
              min="1"
              max="100"
              class="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="col-span-1 flex items-end">
            <button
              @click="clearFilters"
              class="w-full bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 text-xs rounded transition-colors"
            >
              Clear Filters
            </button>
          </div>
          <div class="col-span-1 flex items-end">
            <button
              @click="addNewRow"
              class="w-full bg-[#FF613c] hover:bg-[#e5552f] text-white px-3 py-2 text-xs rounded transition-colors"
            >
              Add Entry
            </button>
          </div>
        </div>
      </div>

      <!-- Excel-like Table -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full excel-table">
            <thead>
              <tr class="bg-[#FF613c] text-white">
                <th class="excel-header w-32">Date</th>
                <th class="excel-header w-32">Ref Number</th>
                <th class="excel-header w-32">AC/Code</th>
                <th class="excel-header w-48">AC/Name</th>
                <th class="excel-header w-32">COA</th>
                <th class="excel-header w-32">ACC Head</th>
                <th class="excel-header w-64">Description</th>
                <th class="excel-header w-40">Income/Expense</th>
                <th class="excel-header w-24">Images</th>
                <th class="excel-header w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              <!-- New Entry Row -->
              <tr
                v-if="newEntry"
                class="excel-row bg-yellow-50 border-2 border-yellow-400"
              >
                <td class="excel-cell">
                  <input
                    v-model="newEntry.date"
                    type="date"
                    class="excel-input"
                  />
                </td>
                <td class="excel-cell">
                  <input
                    v-model="newEntry.reference"
                    type="text"
                    class="excel-input"
                    placeholder="Auto-gen"
                  />
                </td>
                <td class="excel-cell">
                  <div class="flex items-center gap-1">
                    <input
                      v-model="newEntry.ac_code"
                      type="text"
                      class="excel-input"
                      placeholder="Select..."
                      readonly
                    />
                    <button
                      @click="openCOAModal('new')"
                      class="text-blue-600 hover:text-blue-800 font-bold text-lg flex-shrink-0"
                      title="Select COA"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td class="excel-cell">
                  <div class="flex items-center gap-1">
                    <input
                      v-model="newEntry.ac_name"
                      type="text"
                      class="excel-input"
                      placeholder="Select..."
                      readonly
                    />
                    <button
                      @click="openCashStructureModal('new')"
                      class="text-blue-600 hover:text-blue-800 font-bold text-lg flex-shrink-0"
                      title="Select Cash Structure"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td class="excel-cell">
                  <input
                    v-model="newEntry.coa"
                    type="text"
                    class="excel-input"
                    placeholder="COA"
                    readonly
                  />
                </td>
                <td class="excel-cell">
                  <input
                    v-model="newEntry.acc_head"
                    type="text"
                    class="excel-input"
                    placeholder="Account Head"
                    readonly
                  />
                </td>
                <td class="excel-cell">
                  <div class="flex items-center gap-1">
                    <input
                      v-model="newEntry.description"
                      type="text"
                      class="excel-input w-[150px] truncate"
                      placeholder="Description..."
                      readonly
                      :title="newEntry.description"
                    />
                    <button
                      @click="openDescriptionModal('new')"
                      class="text-blue-600 hover:text-blue-800 font-bold text-lg flex-shrink-0"
                      title="Add Description"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td class="excel-cell">
                  <div class="flex items-center gap-1">
                    <input
                      v-model="newEntry.displayAmount"
                      type="text"
                      class="excel-input font-semibold truncate"
                      :class="
                        newEntry.income_or_expense === 'income'
                          ? 'text-green-600'
                          : newEntry.income_or_expense === 'expense'
                          ? 'text-red-600'
                          : 'text-gray-600'
                      "
                      placeholder="0.00"
                      readonly
                    />
                    <button
                      @click="openAmountModal('new')"
                      class="text-blue-600 hover:text-blue-800 font-bold text-lg flex-shrink-0"
                      title="Set Amount"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td class="excel-cell">
                  <button
                    class="text-blue-600 hover:text-blue-800 text-xs underline"
                  >
                    {{ getTotalImagesCount(newEntry) }}
                    imgs
                  </button>
                </td>
                <td class="excel-cell">
                  <div class="flex justify-center gap-1">
                    <button
                      @click="saveNewEntry"
                      class="text-green-600 hover:text-green-800"
                      title="Save"
                    >
                      <svg
                        class="w-5 h-5"
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
                    </button>
                    <button
                      @click="cancelNewEntry"
                      class="text-red-600 hover:text-red-800"
                      title="Cancel"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Existing Entries -->
              <tr
                v-for="item in cashBooks?.data ?? []"
                :key="item.id"
                class="excel-row hover:bg-gray-50"
              >
                <td class="excel-cell">{{ formatDateExcel(item.date) }}</td>
                <td class="excel-cell whitespace-nowrap">
                  {{ item.reference }}
                </td>
                <td class="excel-cell">
                  {{ item.chart_of_accounts?.[0]?.account_code || "-" }}
                </td>
                <td class="excel-cell">
                  {{ item.cash_structure?.name || "-" }}
                </td>
                <td class="excel-cell">
                  {{ item.chart_of_accounts?.[0]?.account_name || "-" }}
                </td>
                <td class="excel-cell">
                  {{ item.chart_of_accounts?.[0]?.account_head?.name || "-" }}
                </td>
                <td class="excel-cell truncate" :title="item.description">
                  {{ item.description || "-" }}
                </td>
                <td class="excel-cell">
                  <span
                    class="font-semibold"
                    :class="
                      item.income_or_expense === 'income'
                        ? 'text-green-600'
                        : item.income_or_expense === 'expense'
                        ? 'text-red-600'
                        : 'text-gray-600'
                    "
                  >
                    <span v-if="item.income_or_expense === 'income'">+</span>
                    <span v-if="item.income_or_expense === 'expense'">-</span>
                    {{ item.amount }}
                  </span>
                </td>
                <td class="excel-cell">
                  <button
                    @click="openEditDrawer(item)"
                    class="text-blue-600 hover:text-blue-800 text-xs underline"
                  >
                    {{ getTotalImagesCount(item) }}
                    imgs
                  </button>
                </td>
                <td class="excel-cell">
                  <div class="flex justify-center gap-1">
                    <button
                      @click="openEditDrawer(item)"
                      class="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      @click="deleteEntry(item.id)"
                      class="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr
                v-if="
                  !loading &&
                  !newEntry &&
                  (!cashBooks?.data || cashBooks.data.length === 0)
                "
              >
                <td colspan="9" class="text-center py-12 text-gray-500">
                  <svg
                    class="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 class="mt-2 text-sm font-medium text-gray-900">
                    No cash book entries
                  </h3>
                  <p class="mt-1 text-sm text-gray-500">
                    Click "Add Entry" button to create a new entry.
                  </p>
                </td>
              </tr>

              <!-- Loading State -->
              <tr v-if="loading">
                <td colspan="9" class="text-center py-12">
                  <div class="inline-flex items-center">
                    <svg
                      class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500"
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
                    <span class="text-sm text-gray-500">Loading...</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          v-if="!loading && cashBooks?.data?.length > 0"
          class="border-t border-gray-200 bg-white px-4 py-3"
        >
          <Pagination :data="cashBooks" @change-page="changePage" />
        </div>
      </div>
    </div>

    <!-- COA Selection Modal -->
    <div
      v-if="showCOAModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeCOAModal"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div class="sticky top-0 bg-[#FF613c] text-white px-6 py-4 z-10">
          <div class="flex justify-between items-center">
            <h3 class="text-sm font-semibold">Select Chart of Account</h3>
            <button
              @click="closeCOAModal"
              class="text-white hover:text-gray-200"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6">
          <div class="mb-4">
            <input
              v-model="coaSearchQuery"
              type="text"
              placeholder="Search by code, name..."
              class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div class="space-y-2 max-h-[500px] overflow-y-auto">
            <div
              v-for="coa in filteredCOA"
              :key="coa.id"
              @click="selectCOA(coa)"
              class="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-semibold text-gray-900 text-sm">
                      {{ coa.account_code }}
                    </span>
                    <span class="text-xs text-gray-500">•</span>
                    <span class="text-sm text-gray-700">
                      {{ coa.account_name }}
                    </span>
                  </div>
                  <div class="flex gap-4 text-xs text-gray-600">
                    <span
                      ><strong>Head:</strong>
                      {{ coa.account_head?.name || "-" }}</span
                    >
                  </div>
                </div>
                <svg
                  class="w-5 h-5 text-gray-400"
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
              </div>
            </div>

            <div
              v-if="filteredCOA.length === 0"
              class="text-center py-12 text-gray-500"
            >
              <p class="text-sm">No accounts found</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Allocation Modal (After COA Selection) -->
    <div
      v-if="showAllocationModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
      @click.self="closeAllocationModal"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="bg-[#FF613c] text-white px-6 py-4 rounded-t-lg">
          <h3 class="text-lg font-semibold">Set Allocation Details</h3>
        </div>
        <div class="p-6">
          <div class="mb-4 p-4 bg-gray-50 rounded-lg">
            <div class="text-sm">
              <p class="font-semibold text-gray-900">
                {{ selectedCOA?.account_code }}
              </p>
              <p class="text-gray-600">{{ selectedCOA?.account_name }}</p>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Allocated Amount *
            </label>
            <input
              v-model="allocationAmount"
              type="number"
              step="0.01"
              min="0"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              autofocus
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Transaction Type *
            </label>
            <div class="grid grid-cols-2 gap-3">
              <button
                @click="allocationNote = '1'"
                :class="[
                  'px-4 py-3 rounded-lg font-medium transition-colors',
                  allocationNote === '1'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                ]"
              >
                Debit (+)
              </button>
              <button
                @click="allocationNote = '2'"
                :class="[
                  'px-4 py-3 rounded-lg font-medium transition-colors',
                  allocationNote === '2'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                ]"
              >
                Credit (-)
              </button>
            </div>
          </div>

          <div class="flex gap-3">
            <button
              @click="closeAllocationModal"
              class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              @click="confirmAllocation"
              :disabled="!allocationAmount || parseFloat(allocationAmount) <= 0"
              :class="[
                'flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                allocationAmount && parseFloat(allocationAmount) > 0
                  ? 'bg-[#FF613c] hover:bg-[#e5552f] text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed',
              ]"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cash Structure Selection Modal -->
    <div
      v-if="showCashStructureModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeCashStructureModal"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div class="sticky top-0 bg-[#FF613c] text-white px-6 py-4 z-10">
          <div class="flex justify-between items-center">
            <h3 class="text-sm font-semibold">Select Cash Structure</h3>
            <button
              @click="closeCashStructureModal"
              class="text-white hover:text-gray-200"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6">
          <div class="mb-4">
            <input
              v-model="cashStructureSearchQuery"
              type="text"
              placeholder="Search by code, name..."
              class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div class="space-y-2 max-h-[500px] overflow-y-auto">
            <div
              v-for="structure in filteredCashStructure"
              :key="structure.id"
              @click="selectCashStructure(structure)"
              class="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-semibold text-gray-900 text-sm">
                      {{ structure.code }}
                    </span>
                    <span class="text-xs text-gray-500">•</span>
                    <span class="text-sm text-gray-700">
                      {{ structure.name }}
                    </span>
                  </div>
                </div>
                <svg
                  class="w-5 h-5 text-gray-400"
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
              </div>
            </div>

            <div
              v-if="filteredCashStructure.length === 0"
              class="text-center py-12 text-gray-500"
            >
              <p class="text-sm">No structures found</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Description Modal -->
    <div
      v-if="showDescriptionModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeDescriptionModal"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div class="bg-[#FF613c] text-white px-6 py-4 rounded-t-lg">
          <h3 class="text-lg font-semibold">Add Description</h3>
        </div>
        <div class="p-6">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              v-model="descriptionText"
              rows="6"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Enter detailed description..."
              autofocus
            ></textarea>
          </div>
          <div class="flex justify-end gap-3">
            <button
              @click="closeDescriptionModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              @click="confirmDescription"
              class="px-4 py-2 text-sm font-medium text-white bg-[#FF613c] hover:bg-[#e5552f] rounded-lg transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Amount Modal -->
    <div
      v-if="showAmountModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeAmountModal"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="bg-[#FF613c] text-white px-6 py-4 rounded-t-lg">
          <h3 class="text-lg font-semibold">Set Amount</h3>
        </div>
        <div class="p-6">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Transaction Type
            </label>
            <div class="grid grid-cols-2 gap-3">
              <button
                @click="amountType = 'income'"
                :class="
                  amountType === 'income'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                "
                class="px-4 py-3 rounded-lg font-medium transition-colors"
              >
                Income (+)
              </button>
              <button
                @click="amountType = 'expense'"
                :class="
                  amountType === 'expense'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                "
                class="px-4 py-3 rounded-lg font-medium transition-colors"
              >
                Expense (-)
              </button>
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <input
              v-model="amountValue"
              type="number"
              step="0.01"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
          </div>
          <div class="flex justify-end gap-3">
            <button
              @click="closeAmountModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              @click="confirmAmount"
              class="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
              :class="
                amountType === 'income'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              "
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Drawer -->
    <div
      v-if="showEditDrawer"
      class="fixed inset-0 bg-black bg-opacity-50 z-50"
      @click.self="closeEditDrawer"
    >
      <div
        class="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl overflow-y-auto"
      >
        <div
          class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10"
        >
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">
              Edit Cash Book Entry
            </h3>
            <button
              @click="closeEditDrawer"
              class="text-gray-400 hover:text-gray-600"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6">
          <CashBookForm
            v-if="editingItem"
            :getData="editingItem"
            @refresh="handleRefresh"
          />
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useToast } from "vue-toastification";
import debounce from "lodash/debounce";
import Swal from "sweetalert2";

// Store imports
import { useSidebarStore } from "../stores/sidebar";
import { useCashBookStore } from "../stores/cashBook";
import { useCashStructureStore } from "../stores/cashStructure";
import { useChartOfAccountStore } from "../stores/chartofAccount";

// Component imports
import Layout from "./Layout.vue";
import Pagination from "../components/Pagination.vue";
import CashHeader from "../components/CashHeader.vue";
import CashBookForm from "./cash/CashBookEdit.vue";

// Store initialization
const sideBarStore = useSidebarStore();
const cashBookStore = useCashBookStore();
const cashStructureStore = useCashStructureStore();
const chartOfAccountStore = useChartOfAccountStore();
const toast = useToast();

// Store refs
const { isShowSidebar } = storeToRefs(sideBarStore);
const { cashBooks, loading } = storeToRefs(cashBookStore);
const { cash_structures } = storeToRefs(cashStructureStore);
const { chartOfAccounts } = storeToRefs(chartOfAccountStore);

// Local state
const newEntry = ref(null);
const filters = ref({
  type: "",
  cash_structure_id: "",
  start_date: "",
  end_date: "",
  limit: 10,
});

// Modal states
const showDescriptionModal = ref(false);
const showAmountModal = ref(false);
const showCOAModal = ref(false);
const showCashStructureModal = ref(false);
const showEditDrawer = ref(false);
const showAllocationModal = ref(false);
const currentModalContext = ref(null);
const descriptionText = ref("");
const amountType = ref("income");
const amountValue = ref("");
const coaSearchQuery = ref("");
const cashStructureSearchQuery = ref("");
const editingItem = ref(null);
const selectedCOA = ref(null);
const allocationAmount = ref("");
const allocationNote = ref("1");

// Computed
const filteredCOA = computed(() => {
  if (!coaSearchQuery.value) {
    return chartOfAccounts.value?.data ?? [];
  }
  const search = coaSearchQuery.value.toLowerCase();
  return (chartOfAccounts.value?.data ?? []).filter(
    (coa) =>
      coa.account_code?.toLowerCase().includes(search) ||
      coa.account_name?.toLowerCase().includes(search)
  );
});

const filteredCashStructure = computed(() => {
  if (!cashStructureSearchQuery.value) {
    return cash_structures.value?.data ?? [];
  }
  const search = cashStructureSearchQuery.value.toLowerCase();
  return (cash_structures.value?.data ?? []).filter(
    (s) =>
      s.code?.toLowerCase().includes(search) ||
      s.name?.toLowerCase().includes(search)
  );
});

// Methods
const getAction = async () => {
  try {
    await cashBookStore.getListAction(filters.value);
  } catch (error) {
    toast.error("Failed to load cash book entries");
  }
};

const changePage = (page) => {
  cashBookStore.getChangePage(page, filters.value);
};

const clearFilters = () => {
  filters.value = {
    type: "",
    cash_structure_id: "",
    start_date: "",
    end_date: "",
    limit: 10,
  };
  getAction();
};
const getTotalImagesCount = (item) => {
  return (item.cash_images?.length || 0) + (item.cash_book_images?.length || 0);
};

// Add new entry
const addNewRow = () => {
  newEntry.value = {
    date: new Date().toISOString().split("T")[0],
    reference: "",
    ac_code: "",
    ac_name: "",
    coa: "",
    acc_head: "",
    description: "",
    income_or_expense: "",
    cash_structure_id: "",
    chart_of_account_id: "",
    amount: "",
    displayAmount: "",
    interact_bank: "personal",
    allocated_amount: "",
    allocation_note: "1",
  };
};

const cancelNewEntry = () => {
  newEntry.value = null;
  selectedCOA.value = null;
  allocationAmount.value = "";
  allocationNote.value = "1";
};

const saveNewEntry = async () => {
  // Validation
  if (!newEntry.value.chart_of_account_id) {
    toast.error("Please select a chart of account");
    return;
  }
  if (!newEntry.value.cash_structure_id) {
    toast.error("Please select a cash structure");
    return;
  }
  if (!newEntry.value.income_or_expense) {
    toast.error("Please select transaction type (Income/Expense)");
    return;
  }
  if (!newEntry.value.amount || parseFloat(newEntry.value.amount) <= 0) {
    toast.error("Please enter a valid amount");
    return;
  }
  if (
    !newEntry.value.allocated_amount ||
    parseFloat(newEntry.value.allocated_amount) <= 0
  ) {
    toast.error("Please set allocation amount for the account");
    return;
  }

  try {
    const formData = new FormData();

    if (newEntry.value.reference) {
      formData.append("reference_number", newEntry.value.reference);
    }

    const datetime = `${newEntry.value.date} 00:00:00`;
    formData.append("date", datetime);
    formData.append("income_or_expense", newEntry.value.income_or_expense);
    formData.append("cash_structure_id", newEntry.value.cash_structure_id);
    formData.append("amount", newEntry.value.amount);

    if (newEntry.value.description) {
      formData.append("description", newEntry.value.description);
    }

    if (newEntry.value.interact_bank) {
      formData.append("interact_bank", newEntry.value.interact_bank);
    }

    // Add account with allocation
    formData.append("accounts[0][id]", newEntry.value.chart_of_account_id);
    formData.append(
      "accounts[0][allocated_amount]",
      newEntry.value.allocated_amount
    );
    formData.append("accounts[0][note]", newEntry.value.allocation_note);

    const response = await cashBookStore.addNewAction(formData);
    toast.success(response.message || "Entry created successfully");
    cancelNewEntry();
    await getAction();
  } catch (error) {
    console.error("Create error:", error);
    toast.error(error.response?.data?.message || "Failed to create entry");
  }
};

// Edit entry
const openEditDrawer = (item) => {
  editingItem.value = item;
  showEditDrawer.value = true;
};

const closeEditDrawer = () => {
  showEditDrawer.value = false;
  editingItem.value = null;
};

const handleRefresh = async () => {
  closeEditDrawer();
  await getAction();
};

// Delete entry
const deleteEntry = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#EF4444",
    cancelButtonColor: "#6B7280",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      const response = await cashBookStore.deleteAction(id);
      toast.success(response.message || "Entry deleted successfully");
      await getAction();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete entry");
    }
  }
};

// COA Modal
const openCOAModal = (context) => {
  currentModalContext.value = context;
  coaSearchQuery.value = "";
  showCOAModal.value = true;
};

const closeCOAModal = () => {
  showCOAModal.value = false;
  currentModalContext.value = null;
  coaSearchQuery.value = "";
};

const selectCOA = (coa) => {
  selectedCOA.value = coa;
  allocationAmount.value = "";
  allocationNote.value = "1";
  closeCOAModal();
  showAllocationModal.value = true;
};

// Allocation Modal
const closeAllocationModal = () => {
  showAllocationModal.value = false;
  selectedCOA.value = null;
  allocationAmount.value = "";
  allocationNote.value = "1";
};

const confirmAllocation = () => {
  if (!allocationAmount.value || parseFloat(allocationAmount.value) <= 0) {
    toast.error("Please enter a valid allocated amount");
    return;
  }

  const target = newEntry.value;

  target.ac_code = selectedCOA.value.account_code;
  target.coa = selectedCOA.value.account_name;
  target.acc_head = selectedCOA.value.account_head?.name || "";
  target.chart_of_account_id = selectedCOA.value.id;
  target.allocated_amount = allocationAmount.value;
  target.allocation_note = allocationNote.value;

  toast.success("Account allocation set successfully");
  closeAllocationModal();
};

// Cash Structure Modal
const openCashStructureModal = (context) => {
  currentModalContext.value = context;
  cashStructureSearchQuery.value = "";
  showCashStructureModal.value = true;
};

const closeCashStructureModal = () => {
  showCashStructureModal.value = false;
  currentModalContext.value = null;
  cashStructureSearchQuery.value = "";
};

const selectCashStructure = (structure) => {
  const target = newEntry.value;

  target.ac_name = structure.name;
  target.cash_structure_id = structure.id;

  closeCashStructureModal();
};

// Description Modal
const openDescriptionModal = (context) => {
  currentModalContext.value = context;
  const target = newEntry.value;
  descriptionText.value = target.description || "";
  showDescriptionModal.value = true;
};

const closeDescriptionModal = () => {
  showDescriptionModal.value = false;
  descriptionText.value = "";
};

const confirmDescription = () => {
  const target = newEntry.value;
  target.description = descriptionText.value;
  closeDescriptionModal();
};

// Amount Modal
const openAmountModal = (context) => {
  currentModalContext.value = context;
  const target = newEntry.value;
  amountType.value = target.income_or_expense || "income";
  amountValue.value = target.amount || "";
  showAmountModal.value = true;
};

const closeAmountModal = () => {
  showAmountModal.value = false;
  amountValue.value = "";
  amountType.value = "income";
};

const confirmAmount = () => {
  if (!amountValue.value || parseFloat(amountValue.value) <= 0) {
    toast.error("Please enter a valid amount");
    return;
  }

  const target = newEntry.value;

  target.income_or_expense = amountType.value;
  target.amount = amountValue.value;
  target.displayAmount = `${amountType.value === "income" ? "+" : "-"}${
    amountValue.value
  }`;

  closeAmountModal();
};

// Utility functions
const formatDateExcel = (date) => {
  if (!date) return "-";
  try {
    let dateObj;
    if (
      typeof date === "string" &&
      date.includes("-") &&
      date.split("-")[0].length === 2
    ) {
      const [datePart] = date.split(" ");
      const [day, month, year] = datePart.split("-");
      dateObj = new Date(`${year}-${month}-${day}`);
    } else {
      dateObj = new Date(date);
    }
    if (isNaN(dateObj.getTime())) return "Invalid Date";
    return dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (error) {
    return "Invalid Date";
  }
};

// Watch filters
watch(
  filters,
  debounce(async () => {
    await getAction();
  }, 500),
  { deep: true }
);

// Initialize
onMounted(async () => {
  await Promise.all([
    getAction(),
    cashStructureStore.getSimpleListAction(),
    chartOfAccountStore.getSimpleListAction(),
  ]);
});
</script>

<style scoped>
/* Excel-like table styles */
.excel-table {
  border-collapse: separate;
  border-spacing: 0;
  font-size: 12px;
}

.excel-header {
  padding: 12px 8px;
  text-align: left;
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.excel-header:last-child {
  border-right: none;
}

.excel-row {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.15s ease;
}

.excel-cell {
  padding: 8px;
  border-right: 1px solid #e5e7eb;
  vertical-align: middle;
}

.excel-cell:last-child {
  border-right: none;
}

.excel-input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  transition: all 0.15s ease;
}

.excel-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.excel-input:read-only {
  background-color: #f9fafb;
  cursor: not-allowed;
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar,
.overflow-x-auto::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track,
.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar-thumb,
.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover,
.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.excel-row {
  animation: fadeIn 0.3s ease;
}
</style>
