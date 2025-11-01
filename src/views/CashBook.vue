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
                <th class="excel-header w-40">Amount</th>
                <th class="excel-header w-24">COA List</th>
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
                      @click="openAccountModal('new')"
                      class="text-blue-600 hover:text-blue-800 font-bold text-lg flex-shrink-0"
                      title="Select Account Code"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td class="excel-cell">
                  <input
                    v-model="newEntry.ac_name"
                    type="text"
                    class="excel-input"
                    placeholder="Account Name"
                    readonly
                  />
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
                    @click="openCOASelectionModal('new')"
                    class="text-orange-600 hover:text-orange-800 text-xs underline"
                  >
                    {{ newEntry.accounts?.length || 0 }} COA
                  </button>
                </td>
                <td class="excel-cell">
                  <button
                    @click="openImageManagementModal('new')"
                    class="text-blue-600 hover:text-blue-800 text-xs underline"
                  >
                    {{ getTotalImagesCount("new") }} imgs
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
                class="excel-row"
                :class="{
                  'bg-blue-50': editingId === item.id,
                  'hover:bg-gray-50': editingId !== item.id,
                }"
              >
                <td class="excel-cell">
                  <input
                    v-if="editingId === item.id"
                    v-model="editData.date"
                    type="date"
                    class="excel-input"
                  />
                  <span v-else>{{ formatDateExcel(item.date) }}</span>
                </td>
                <td class="excel-cell">
                  <input
                    v-if="editingId === item.id"
                    v-model="editData.reference"
                    type="text"
                    class="excel-input"
                    readonly
                  />
                  <span v-else class="whitespace-nowrap">{{
                    item.reference
                  }}</span>
                </td>
                <td class="excel-cell">
                  <div
                    v-if="editingId === item.id"
                    class="flex items-center gap-1"
                  >
                    <input
                      v-model="editData.ac_code"
                      type="text"
                      class="excel-input"
                      placeholder="Select..."
                      readonly
                    />
                    <button
                      @click="openAccountModal('edit')"
                      class="text-blue-600 hover:text-blue-800 font-bold text-lg flex-shrink-0"
                      title="Select Account Code"
                    >
                      +
                    </button>
                  </div>
                  <span v-else>{{ item.cash_structure?.code || "-" }}</span>
                </td>
                <td class="excel-cell">
                  <input
                    v-if="editingId === item.id"
                    v-model="editData.ac_name"
                    type="text"
                    class="excel-input"
                    readonly
                  />
                  <span v-else class="truncate block">{{
                    item.cash_structure?.name || "-"
                  }}</span>
                </td>
                <td class="excel-cell">
                  <span>{{
                    editingId === item.id
                      ? editData.coa
                      : item.cash_structure?.coa || "-"
                  }}</span>
                </td>
                <td class="excel-cell">
                  <span>{{
                    editingId === item.id
                      ? editData.acc_head
                      : item.cash_structure?.acc_head || "-"
                  }}</span>
                </td>
                <td class="excel-cell">
                  <div
                    v-if="editingId === item.id"
                    class="flex items-center gap-1"
                  >
                    <input
                      v-model="editData.description"
                      type="text"
                      class="excel-input w-[150px] truncate"
                      placeholder="Description..."
                      readonly
                      :title="editData.description"
                    />
                    <button
                      @click="openDescriptionModal('edit')"
                      class="text-blue-600 hover:text-blue-800 font-bold text-lg flex-shrink-0"
                      title="Edit Description"
                    >
                      +
                    </button>
                  </div>
                  <span
                    v-else
                    class="truncate block"
                    :title="item.description"
                    >{{ item.description || "-" }}</span
                  >
                </td>
                <td class="excel-cell">
                  <div
                    v-if="editingId === item.id"
                    class="flex items-center gap-1"
                  >
                    <input
                      v-model="editData.displayAmount"
                      type="text"
                      class="excel-input font-semibold truncate"
                      :class="
                        editData.income_or_expense === 'income'
                          ? 'text-green-600'
                          : editData.income_or_expense === 'expense'
                          ? 'text-red-600'
                          : 'text-gray-600'
                      "
                      readonly
                    />
                    <button
                      @click="openAmountModal('edit')"
                      class="text-blue-600 hover:text-blue-800 font-bold text-lg flex-shrink-0"
                      title="Edit Amount"
                    >
                      +
                    </button>
                  </div>
                  <span
                    v-else
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
                    @click="
                      openCOASelectionModal(
                        editingId === item.id ? 'edit' : 'view',
                        item
                      )
                    "
                    class="text-orange-600 hover:text-orange-800 text-xs underline"
                  >
                    {{ item.chart_of_accounts?.length || 0 }} COA
                  </button>
                </td>
                <td class="excel-cell">
                  <button
                    @click="
                      openImageManagementModal(
                        editingId === item.id ? 'edit' : 'view',
                        item
                      )
                    "
                    class="text-blue-600 hover:text-blue-800 text-xs underline"
                  >
                    {{
                      getTotalImagesCount(
                        editingId === item.id ? "edit" : "view",
                        item
                      )
                    }}
                    imgs
                  </button>
                </td>
                <td class="excel-cell">
                  <div
                    v-if="editingId === item.id"
                    class="flex justify-center gap-1"
                  >
                    <button
                      @click="saveEdit"
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
                      @click="cancelEdit"
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
                  <div v-else class="flex justify-center gap-1">
                    <button
                      @click="startEdit(item)"
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
                <td colspan="11" class="text-center py-12 text-gray-500">
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
                <td colspan="11" class="text-center py-12">
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

    <!-- Cash Structure Selection Modal -->
    <div
      v-if="showAccountModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeAccountModal"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div class="sticky top-0 bg-[#FF613c] text-white px-6 py-4 z-10">
          <div class="flex justify-between items-center">
            <h3 class="text-sm font-semibold">
              Select Chart of Account & Cash Structure
            </h3>
            <button
              @click="closeAccountModal"
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
        <div
          class="flex justify-start cursor-pointer pt-4 pl-6 items-center gap-x-2"
        >
          <p
            class="px-2 py-2 rounded-lg border border-gray-200 text-xs"
            @click="selectPart = false"
            :class="!selectPart ? 'bg-[#ff613c] text-white' : ''"
          >
            Select Chart of Account
          </p>
          <p
            class="px-2 py-2 rounded-lg border border-gray-200 text-xs"
            @click="selectPart = true"
            :class="selectPart ? 'bg-[#ff613c] text-white' : ''"
          >
            Select Cash Structure
          </p>
        </div>

        <div class="p-6" v-if="!selectPart">
          <div class="mb-4" v-if="!coaModalReadOnly">
            <button
              @click="openCOASelector"
              class="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              + Add Chart of Account
            </button>
          </div>

          <div class="space-y-3">
            <div
              v-for="(account, index) in tempCOAList"
              :key="index"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex justify-between items-start mb-2">
                <div class="flex-1">
                  <div class="font-medium text-gray-900">
                    {{ account.code }} - {{ account.name }}
                  </div>
                  <div class="text-xs text-gray-600 mt-1">
                    Allocated: {{ account.allocated_amount }} | Type:
                    {{ account.note === "1" ? "Debit (+)" : "Credit (-)" }}
                  </div>
                </div>
                <button
                  v-if="!coaModalReadOnly"
                  @click="removeCOAFromList(index)"
                  class="text-red-600 hover:text-red-800"
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
            </div>

            <div
              v-if="tempCOAList.length === 0"
              class="text-center py-8 text-gray-500"
            >
              <p class="text-sm">No chart of accounts added yet.</p>
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <button
              @click="closeCOAModal"
              class="px-6 py-2 bg-[#FF613c] hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Next
            </button>
          </div>
        </div>
        <div class="p-6" v-if="selectPart">
          <div class="mb-4">
            <input
              v-model="accountSearchQuery"
              type="text"
              placeholder="Search by code, name, COA, or account head..."
              class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div class="space-y-2 max-h-[500px] overflow-y-auto">
            <div
              v-for="structure in filteredAccountStructures"
              :key="structure.id"
              @click="selectAccount(structure)"
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
                  <div class="flex gap-4 text-xs text-gray-600">
                    <span
                      ><strong>COA:</strong> {{ structure.coa || "-" }}</span
                    >
                    <span
                      ><strong>Head:</strong>
                      {{ structure.acc_head || "-" }}</span
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
              v-if="filteredAccountStructures.length === 0"
              class="text-center py-12 text-gray-500"
            >
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
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p class="mt-2 text-sm">No accounts found</p>
              <p class="text-xs text-gray-400 mt-1">
                Try a different search term
              </p>
            </div>
          </div>
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
        class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div class="sticky top-0 bg-orange-600 text-white px-6 py-4 z-10">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">Chart of Accounts</h3>
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
          <div class="mb-4" v-if="!coaModalReadOnly">
            <button
              @click="openCOASelector"
              class="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              + Add Chart of Account
            </button>
          </div>

          <div class="space-y-3">
            <div
              v-for="(account, index) in tempCOAList"
              :key="index"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex justify-between items-start mb-2">
                <div class="flex-1">
                  <div class="font-medium text-gray-900">
                    {{ account.code }} - {{ account.name }}
                  </div>
                  <div class="text-xs text-gray-600 mt-1">
                    Allocated: {{ account.allocated_amount }} | Type:
                    {{ account.note === "1" ? "Debit (+)" : "Credit (-)" }}
                  </div>
                </div>
                <button
                  v-if="!coaModalReadOnly"
                  @click="removeCOAFromList(index)"
                  class="text-red-600 hover:text-red-800"
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
            </div>

            <div
              v-if="tempCOAList.length === 0"
              class="text-center py-8 text-gray-500"
            >
              <p class="text-sm">No chart of accounts added yet.</p>
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <button
              @click="closeCOAModal"
              class="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- COA Selector Sub-Modal -->
    <div
      v-if="showCOASelector"
      class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]"
      @click.self="closeCOASelectorModal"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
      >
        <div class="sticky top-0 bg-orange-600 text-white px-6 py-4 z-10">
          <div class="flex justify-between items-center">
            <h3 class="text-sm font-semibold">Select Chart of Account</h3>
            <button
              @click="closeCOASelectorModal"
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
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Chart of Account *
              </label>
              <select
                v-model="tempCOA.id"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Account</option>
                <option
                  v-for="coa in chartOfAccounts?.data ?? []"
                  :key="coa.id"
                  :value="coa.id"
                >
                  {{ coa.account_code }} - {{ coa.account_name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Allocated Amount *
              </label>
              <input
                v-model="tempCOA.allocated_amount"
                type="number"
                step="0.01"
                min="0"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Transaction Type *
              </label>
              <div class="grid grid-cols-2 gap-3">
                <button
                  @click="tempCOA.note = '1'"
                  :class="[
                    'px-4 py-3 rounded-lg font-medium transition-colors',
                    tempCOA.note === '1'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                  ]"
                >
                  Debit (+)
                </button>
                <button
                  @click="tempCOA.note = '2'"
                  :class="[
                    'px-4 py-3 rounded-lg font-medium transition-colors',
                    tempCOA.note === '2'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                  ]"
                >
                  Credit (-)
                </button>
              </div>
            </div>
          </div>

          <div class="flex gap-3 mt-6">
            <button
              @click="closeCOASelectorModal"
              class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              @click="confirmCOASelection"
              :disabled="!isCOAValid"
              :class="[
                'flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                isCOAValid
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed',
              ]"
            >
              Add Account
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Management Modal with TransferImageComponent -->
    <div
      v-if="showImageModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeImageModal"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div
          class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10"
        >
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Manage Images</h3>
            <button
              @click="closeImageModal"
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
          <!-- Cash Book Images (Prove Images) - Simple Multiple Upload -->
          <div class="mb-6">
            <h4 class="text-md font-semibold text-gray-800 mb-3">
              Prove Images (Documents)
            </h4>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                ref="proveImageInput"
                @change="handleProveImageUpload"
                multiple
                accept="image/*"
                class="hidden"
              />
              <button
                v-if="!imageModalReadOnly"
                @click="$refs.proveImageInput.click()"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Upload Prove Images
              </button>
              <div class="grid grid-cols-4 gap-4 mt-4">
                <div
                  v-for="(image, index) in proveImages"
                  :key="index"
                  class="relative group"
                >
                  <img
                    :src="image.preview || image.url"
                    alt="Prove"
                    class="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    v-if="!imageModalReadOnly"
                    @click="removeProveImage(index)"
                    class="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Transfer Images Component (Cash Images) -->
          <div v-if="!imageModalReadOnly">
            <h4 class="text-md font-semibold text-gray-800 mb-3">
              Transaction Images
            </h4>
            <TransferImageComponent
              :editData="transferImageEditData"
              @internal-transfer-submitted="handleInternalTransferSubmit"
              @direct-banking-submitted="handleDirectBankingSubmit"
            />
          </div>

          <!-- View Existing Transaction Images -->
          <div
            v-if="imageModalReadOnly && transactionImagesList.length > 0"
            class="mt-6"
          >
            <h4 class="text-md font-semibold text-gray-800 mb-3">
              Transaction Images
            </h4>
            <div class="space-y-3">
              <div
                v-for="(receipt, index) in transactionImagesList"
                :key="index"
                class="border border-gray-200 rounded-lg p-3"
              >
                <div v-if="receipt.is_internal_transfer" class="space-y-2">
                  <div class="flex items-center justify-between mb-2">
                    <span
                      class="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium"
                    >
                      Internal Transfer
                    </span>
                    <span class="text-xs text-gray-600">
                      Rate: {{ receipt.exchange_rate }}
                    </span>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="bg-red-50 p-2 rounded">
                      <p class="text-xs font-semibold text-red-700 mb-2">
                        FROM
                      </p>
                      <div class="space-y-2">
                        <div
                          v-for="(fromFile, fIdx) in receipt.from_files"
                          :key="fIdx"
                          class="bg-white p-2 rounded"
                        >
                          <img
                            v-if="fromFile.image"
                            :src="fromFile.image"
                            class="w-full h-24 object-cover rounded mb-1"
                          />
                          <div class="text-[10px] space-y-0.5">
                            <p>
                              <strong>Amount:</strong> {{ fromFile.currency }}
                              {{ fromFile.amount }}
                            </p>
                            <p><strong>From:</strong> {{ fromFile.sender }}</p>
                            <p><strong>To:</strong> {{ fromFile.receiver }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="bg-green-50 p-2 rounded">
                      <p class="text-xs font-semibold text-green-700 mb-2">
                        TO
                      </p>
                      <div class="space-y-2">
                        <div
                          v-for="(toFile, tIdx) in receipt.to_files"
                          :key="tIdx"
                          class="bg-white p-2 rounded"
                        >
                          <img
                            v-if="toFile.image"
                            :src="toFile.image"
                            class="w-full h-24 object-cover rounded mb-1"
                          />
                          <div class="text-[10px] space-y-0.5">
                            <p>
                              <strong>Amount:</strong> {{ toFile.currency }}
                              {{ toFile.amount }}
                            </p>
                            <p><strong>From:</strong> {{ toFile.sender }}</p>
                            <p><strong>To:</strong> {{ toFile.receiver }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="flex items-start gap-3">
                  <img
                    v-if="receipt.image"
                    :src="receipt.image"
                    class="w-24 h-24 object-cover rounded"
                  />
                  <div class="flex-1">
                    <span
                      class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium"
                    >
                      Direct Banking
                    </span>
                    <div class="text-xs space-y-1 mt-2">
                      <p>
                        <strong>Amount:</strong> {{ receipt.currency }}
                        {{ receipt.amount }}
                      </p>
                      <p><strong>From:</strong> {{ receipt.sender }}</p>
                      <p><strong>To:</strong> {{ receipt.receiver }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <button
              @click="closeImageModal"
              class="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
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
import TransferImageComponent from "./CashImageCreate/CashImage.vue";

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
const editingId = ref(null);
const editData = ref({});
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
const showAccountModal = ref(false);
const showCOAModal = ref(false);
const showCOASelector = ref(false);
const showImageModal = ref(false);
const currentModalContext = ref(null);
const descriptionText = ref("");
const amountType = ref("income");
const amountValue = ref("");
const accountSearchQuery = ref("");
const coaModalReadOnly = ref(false);
const imageModalReadOnly = ref(false);

// Image management
const proveImages = ref([]);
const transactionImages = ref([]);
const transactionImagesList = ref([]);
const transferImageEditData = ref(null);

// Select part
const selectPart = ref(false);

// COA management
const tempCOAList = ref([]);
const tempCOA = ref({
  id: "",
  code: "",
  name: "",
  allocated_amount: "",
  note: "1",
});

// Computed
const filteredAccountStructures = computed(() => {
  if (!accountSearchQuery.value) {
    return cash_structures.value?.data ?? [];
  }
  const search = accountSearchQuery.value.toLowerCase();
  return (cash_structures.value?.data ?? []).filter(
    (s) =>
      s.code?.toLowerCase().includes(search) ||
      s.name?.toLowerCase().includes(search) ||
      s.coa?.toLowerCase().includes(search) ||
      s.acc_head?.toLowerCase().includes(search)
  );
});

const isCOAValid = computed(() => {
  return (
    tempCOA.value.id &&
    tempCOA.value.allocated_amount &&
    parseFloat(tempCOA.value.allocated_amount) > 0 &&
    tempCOA.value.note
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

// Add new entry
const addNewRow = () => {
  if (editingId.value) {
    toast.warning("Please save or cancel the current edit first");
    return;
  }
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
    amount: "",
    displayAmount: "",
    accounts: [],
    interact_bank: "personal",
  };
  proveImages.value = [];
  transactionImages.value = [];
};

const cancelNewEntry = () => {
  newEntry.value = null;
  proveImages.value = [];
  transactionImages.value = [];
};

const saveNewEntry = async () => {
  // Validation
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
  if (!newEntry.value.accounts || newEntry.value.accounts.length === 0) {
    toast.error("Please add at least one chart of account");
    return;
  }

  try {
    const formData = new FormData();

    // Basic fields
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

    // Add accounts
    newEntry.value.accounts.forEach((account, index) => {
      formData.append(`accounts[${index}][id]`, account.id);
      formData.append(
        `accounts[${index}][allocated_amount]`,
        account.allocated_amount
      );
      formData.append(`accounts[${index}][note]`, account.note || "1");
    });

    // Add transaction images from TransferImageComponent
    transactionImages.value.forEach((img, index) => {
      if (img.is_internal_transfer) {
        formData.append(`images[${index}][is_internal_transfer]`, "true");
        formData.append(`images[${index}][exchange_rate]`, img.exchange_rate);
        formData.append(`images[${index}][note]`, img.note || "");

        if (img.id) {
          formData.append(`images[${index}][id]`, img.id);
        }

        // From files
        img.from_files.forEach((fromFile, fromIndex) => {
          if (fromFile.file) {
            formData.append(
              `images[${index}][from_files][${fromIndex}][file]`,
              fromFile.file
            );
            formData.append(
              `images[${index}][from_files][${fromIndex}][date]`,
              fromFile.date
            );
            formData.append(
              `images[${index}][from_files][${fromIndex}][sender]`,
              fromFile.sender
            );
            formData.append(
              `images[${index}][from_files][${fromIndex}][receiver]`,
              fromFile.receiver
            );
            formData.append(
              `images[${index}][from_files][${fromIndex}][amount]`,
              fromFile.amount
            );
            formData.append(
              `images[${index}][from_files][${fromIndex}][currency]`,
              fromFile.currency
            );
            formData.append(
              `images[${index}][from_files][${fromIndex}][interact_bank]`,
              fromFile.interact_bank
            );
          }
        });

        // To files
        img.to_files.forEach((toFile, toIndex) => {
          if (toFile.file) {
            formData.append(
              `images[${index}][to_files][${toIndex}][file]`,
              toFile.file
            );
            formData.append(
              `images[${index}][to_files][${toIndex}][date]`,
              toFile.date
            );
            formData.append(
              `images[${index}][to_files][${toIndex}][sender]`,
              toFile.sender
            );
            formData.append(
              `images[${index}][to_files][${toIndex}][receiver]`,
              toFile.receiver
            );
            formData.append(
              `images[${index}][to_files][${toIndex}][amount]`,
              toFile.amount
            );
            formData.append(
              `images[${index}][to_files][${toIndex}][currency]`,
              toFile.currency
            );
            formData.append(
              `images[${index}][to_files][${toIndex}][interact_bank]`,
              toFile.interact_bank
            );
          }
        });
      } else {
        // Direct banking
        formData.append(`images[${index}][is_internal_transfer]`, "false");
        formData.append(`images[${index}][file]`, img.file);
        formData.append(`images[${index}][date]`, img.date);
        formData.append(`images[${index}][sender]`, img.sender);
        formData.append(`images[${index}][reciever]`, img.receiver);
        formData.append(`images[${index}][amount]`, img.amount);
        formData.append(`images[${index}][currency]`, img.currency);
        formData.append(`images[${index}][interact_bank]`, img.interact_bank);
      }
    });

    // Add prove images (cash_book_images)
    proveImages.value.forEach((img, index) => {
      if (img.file) {
        formData.append(`cash_book_images[${index}][image]`, img.file);
      }
    });

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
const startEdit = (item) => {
  if (newEntry.value) {
    toast.warning("Please save or cancel the new entry first");
    return;
  }
  editingId.value = item.id;
  editData.value = {
    date: item.date ? item.date.split(" ")[0] : "",
    reference: item.reference || "",
    ac_code: item.cash_structure?.code || "",
    ac_name: item.cash_structure?.name || "",
    coa: item.cash_structure?.coa || "",
    acc_head: item.cash_structure?.acc_head || "",
    description: item.description || "",
    income_or_expense: item.income_or_expense,
    cash_structure_id: item.cash_structure_id,
    amount: item.amount,
    displayAmount: `${item.income_or_expense === "income" ? "+" : "-"}${
      item.amount
    }`,
    accounts:
      item.chart_of_accounts?.map((acc) => ({
        id: acc.id,
        code: acc.code,
        name: acc.name,
        allocated_amount: acc.pivot?.allocated_amount || 0,
        note: acc.pivot?.note || "1",
      })) || [],
    interact_bank: item.interact_bank || "personal",
  };

  // Load existing images
  proveImages.value = (item.cash_book_images || []).map((img) => ({
    url: img.image,
    id: img.id,
    existing: true,
  }));

  transactionImages.value = processExistingCashImages(item.cash_images || []);
};

const processExistingCashImages = (cashImages) => {
  const grouped = {};

  cashImages.forEach((img) => {
    if (img.internal_transfer_id) {
      if (!grouped[img.internal_transfer_id]) {
        grouped[img.internal_transfer_id] = {
          is_internal_transfer: true,
          id: img.internal_transfer_id,
          exchange_rate: img.exchange_rate,
          note: img.notes || "",
          from_files: [],
          to_files: [],
        };
      }

      const fileData = {
        id: img.id,
        file: null,
        image: img.image,
        date: img.date,
        sender: img.sender,
        receiver: img.receiver,
        amount: img.amount,
        currency: img.currency,
        interact_bank: img.interact_bank,
      };

      if (img.direction === "from") {
        grouped[img.internal_transfer_id].from_files.push(fileData);
      } else {
        grouped[img.internal_transfer_id].to_files.push(fileData);
      }
    } else {
      // Direct banking
      return {
        is_internal_transfer: false,
        id: img.id,
        file: null,
        image: img.image,
        date: img.date,
        sender: img.sender,
        receiver: img.receiver,
        amount: img.amount,
        currency: img.currency,
        interact_bank: img.interact_bank,
      };
    }
  });

  return Object.values(grouped);
};

const cancelEdit = () => {
  editingId.value = null;
  editData.value = {};
  proveImages.value = [];
  transactionImages.value = [];
};

const saveEdit = async () => {
  if (!editData.value.cash_structure_id) {
    toast.error("Please select a cash structure");
    return;
  }
  if (!editData.value.income_or_expense) {
    toast.error("Please select transaction type");
    return;
  }
  if (!editData.value.amount || parseFloat(editData.value.amount) <= 0) {
    toast.error("Please enter a valid amount");
    return;
  }
  if (!editData.value.accounts || editData.value.accounts.length === 0) {
    toast.error("Please add at least one chart of account");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("_method", "PUT");

    const datetime = `${editData.value.date} 00:00:00`;
    formData.append("date", datetime);
    formData.append("income_or_expense", editData.value.income_or_expense);
    formData.append("cash_structure_id", editData.value.cash_structure_id);
    formData.append("amount", editData.value.amount);

    if (editData.value.description) {
      formData.append("description", editData.value.description);
    }

    if (editData.value.interact_bank) {
      formData.append("interact_bank", editData.value.interact_bank);
    }

    // Add accounts
    editData.value.accounts.forEach((account, index) => {
      formData.append(`accounts[${index}][id]`, account.id);
      formData.append(
        `accounts[${index}][allocated_amount]`,
        account.allocated_amount
      );
      formData.append(`accounts[${index}][note]`, account.note || "1");
    });

    // Add new transaction images only
    transactionImages.value.forEach((img, index) => {
      if (!img.id) {
        // Only add new images
        if (img.is_internal_transfer) {
          formData.append(`images[${index}][is_internal_transfer]`, "true");
          formData.append(`images[${index}][exchange_rate]`, img.exchange_rate);
          formData.append(`images[${index}][note]`, img.note || "");

          img.from_files.forEach((fromFile, fromIndex) => {
            if (fromFile.file) {
              formData.append(
                `images[${index}][from_files][${fromIndex}][file]`,
                fromFile.file
              );
              formData.append(
                `images[${index}][from_files][${fromIndex}][date]`,
                fromFile.date
              );
              formData.append(
                `images[${index}][from_files][${fromIndex}][sender]`,
                fromFile.sender
              );
              formData.append(
                `images[${index}][from_files][${fromIndex}][receiver]`,
                fromFile.receiver
              );
              formData.append(
                `images[${index}][from_files][${fromIndex}][amount]`,
                fromFile.amount
              );
              formData.append(
                `images[${index}][from_files][${fromIndex}][currency]`,
                fromFile.currency
              );
              formData.append(
                `images[${index}][from_files][${fromIndex}][interact_bank]`,
                fromFile.interact_bank
              );
            }
          });

          img.to_files.forEach((toFile, toIndex) => {
            if (toFile.file) {
              formData.append(
                `images[${index}][to_files][${toIndex}][file]`,
                toFile.file
              );
              formData.append(
                `images[${index}][to_files][${toIndex}][date]`,
                toFile.date
              );
              formData.append(
                `images[${index}][to_files][${toIndex}][sender]`,
                toFile.sender
              );
              formData.append(
                `images[${index}][to_files][${toIndex}][receiver]`,
                toFile.receiver
              );
              formData.append(
                `images[${index}][to_files][${toIndex}][amount]`,
                toFile.amount
              );
              formData.append(
                `images[${index}][to_files][${toIndex}][currency]`,
                toFile.currency
              );
              formData.append(
                `images[${index}][to_files][${toIndex}][interact_bank]`,
                toFile.interact_bank
              );
            }
          });
        } else {
          formData.append(`images[${index}][is_internal_transfer]`, "false");
          formData.append(`images[${index}][file]`, img.file);
          formData.append(`images[${index}][date]`, img.date);
          formData.append(`images[${index}][sender]`, img.sender);
          formData.append(`images[${index}][reciever]`, img.receiver);
          formData.append(`images[${index}][amount]`, img.amount);
          formData.append(`images[${index}][currency]`, img.currency);
          formData.append(`images[${index}][interact_bank]`, img.interact_bank);
        }
      }
    });

    // Add new prove images only
    proveImages.value.forEach((img, index) => {
      if (img.file) {
        formData.append(`cash_book_images[${index}][image]`, img.file);
      }
    });

    const response = await cashBookStore.updateAction(
      editingId.value,
      formData
    );
    toast.success(response.message || "Entry updated successfully");
    cancelEdit();
    await getAction();
  } catch (error) {
    console.error("Update error:", error);
    toast.error(error.response?.data?.message || "Failed to update entry");
  }
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

// Cash Structure Modal
const openAccountModal = (context) => {
  currentModalContext.value = context;
  accountSearchQuery.value = "";
  showAccountModal.value = true;
};

const closeAccountModal = () => {
  showAccountModal.value = false;
  currentModalContext.value = null;
  accountSearchQuery.value = "";
};

const selectAccount = (structure) => {
  const target =
    currentModalContext.value === "new" ? newEntry.value : editData.value;

  target.ac_code = structure.code;
  target.ac_name = structure.name;
  target.coa = structure.coa || "";
  target.acc_head = structure.acc_head || "";
  target.cash_structure_id = structure.id;

  closeAccountModal();
};

// COA Selection Modal
const openCOASelectionModal = (context, item = null) => {
  currentModalContext.value = context;

  if (context === "view" && item) {
    coaModalReadOnly.value = true;
    tempCOAList.value =
      item.chart_of_accounts?.map((acc) => ({
        id: acc.id,
        code: acc.code,
        name: acc.name,
        allocated_amount: acc.pivot?.allocated_amount || 0,
        note: acc.pivot?.note || "1",
      })) || [];
  } else {
    coaModalReadOnly.value = false;
    const target = context === "new" ? newEntry.value : editData.value;
    tempCOAList.value = [...(target.accounts || [])];
  }

  showCOAModal.value = true;
};

const closeCOAModal = () => {
  if (!coaModalReadOnly.value) {
    const target =
      currentModalContext.value === "new" ? newEntry.value : editData.value;
    target.accounts = [...tempCOAList.value];
  }
  showCOAModal.value = false;
  selectPart.value = true;
  tempCOAList.value = [];
};

const openCOASelector = () => {
  tempCOA.value = {
    id: "",
    code: "",
    name: "",
    allocated_amount: "",
    note: "1",
  };
  showCOASelector.value = true;
};

const closeCOASelectorModal = () => {
  showCOASelector.value = false;
};

const confirmCOASelection = () => {
  if (!isCOAValid.value) {
    toast.error("Please fill in all required fields");
    return;
  }

  const selectedCOA = chartOfAccounts.value?.data?.find(
    (coa) => coa.id === tempCOA.value.id
  );

  if (selectedCOA) {
    tempCOAList.value.push({
      id: selectedCOA.id,
      code: selectedCOA.account_code,
      name: selectedCOA.account_name,
      allocated_amount: tempCOA.value.allocated_amount,
      note: tempCOA.value.note,
    });
    toast.success("Account added successfully");
    closeCOASelectorModal();
  }
};

const removeCOAFromList = (index) => {
  tempCOAList.value.splice(index, 1);
};

// Description Modal
const openDescriptionModal = (context) => {
  currentModalContext.value = context;
  const target = context === "new" ? newEntry.value : editData.value;
  descriptionText.value = target.description || "";
  showDescriptionModal.value = true;
};

const closeDescriptionModal = () => {
  showDescriptionModal.value = false;
  descriptionText.value = "";
};

const confirmDescription = () => {
  const target =
    currentModalContext.value === "new" ? newEntry.value : editData.value;
  target.description = descriptionText.value;
  closeDescriptionModal();
};

// Amount Modal
const openAmountModal = (context) => {
  currentModalContext.value = context;
  const target = context === "new" ? newEntry.value : editData.value;
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

  const target =
    currentModalContext.value === "new" ? newEntry.value : editData.value;

  target.income_or_expense = amountType.value;
  target.amount = amountValue.value;
  target.displayAmount = `${amountType.value === "income" ? "+" : "-"}${
    amountValue.value
  }`;

  closeAmountModal();
};

// Image Management Modal
const openImageManagementModal = (context, item = null) => {
  currentModalContext.value = context;

  if (context === "view" && item) {
    imageModalReadOnly.value = true;
    proveImages.value = (item.cash_book_images || []).map((img) => ({
      url: img.image,
      id: img.id,
      existing: true,
    }));
    transactionImagesList.value = processTransactionImagesForView(
      item.cash_images || []
    );
  } else {
    imageModalReadOnly.value = false;
    transferImageEditData.value = null;
  }

  showImageModal.value = true;
};

const processTransactionImagesForView = (cashImages) => {
  const grouped = {};
  const direct = [];

  cashImages.forEach((img) => {
    if (img.internal_transfer_id) {
      if (!grouped[img.internal_transfer_id]) {
        grouped[img.internal_transfer_id] = {
          is_internal_transfer: true,
          exchange_rate: img.exchange_rate,
          note: img.notes || "",
          from_files: [],
          to_files: [],
        };
      }

      const fileData = {
        id: img.id,
        image: img.image,
        date: img.date,
        sender: img.sender,
        receiver: img.receiver,
        amount: img.amount,
        currency: img.currency,
        interact_bank: img.interact_bank,
      };

      if (img.direction === "from") {
        grouped[img.internal_transfer_id].from_files.push(fileData);
      } else {
        grouped[img.internal_transfer_id].to_files.push(fileData);
      }
    } else {
      direct.push({
        is_internal_transfer: false,
        image: img.image,
        date: img.date,
        sender: img.sender,
        receiver: img.receiver,
        amount: img.amount,
        currency: img.currency,
        interact_bank: img.interact_bank,
      });
    }
  });

  return [...Object.values(grouped), ...direct];
};

const closeImageModal = () => {
  showImageModal.value = false;
  imageModalReadOnly.value = false;
  transferImageEditData.value = null;
  transactionImagesList.value = [];
};

const handleProveImageUpload = (event) => {
  const files = Array.from(event.target.files);
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      proveImages.value.push({
        file: file,
        preview: e.target.result,
        existing: false,
      });
    };
    reader.readAsDataURL(file);
  });
  event.target.value = "";
};

const removeProveImage = (index) => {
  proveImages.value.splice(index, 1);
};

const handleInternalTransferSubmit = (data) => {
  const transferData = {
    is_internal_transfer: true,
    id: data.data.id,
    exchange_rate: data.data.exchange_rate,
    note: data.data.notes,
    from_files: data.data.from_images.map((img) => ({
      file: img.image,
      date: img.date,
      sender: img.sender,
      receiver: img.receiver,
      amount: img.amount,
      currency: img.currency,
      interact_bank: img.interact_bank,
    })),
    to_files: data.data.to_images.map((img) => ({
      file: img.image,
      date: img.date,
      sender: img.sender,
      receiver: img.receiver,
      amount: img.amount,
      currency: img.currency,
      interact_bank: img.interact_bank,
    })),
  };

  if (transferData.id) {
    const index = transactionImages.value.findIndex(
      (item) => item.id === transferData.id && item.is_internal_transfer
    );
    if (index !== -1) {
      transactionImages.value[index] = transferData;
    } else {
      transactionImages.value.push(transferData);
    }
  } else {
    transactionImages.value.push(transferData);
  }

  toast.success("Internal transfer added successfully");
};

const handleDirectBankingSubmit = (data) => {
  const directData = {
    is_internal_transfer: false,
    file: data.data.image,
    date: data.data.date,
    sender: data.data.sender,
    receiver: data.data.receiver,
    amount: data.data.amount,
    currency: data.data.currency,
    interact_bank: data.data.interact_bank,
  };

  transactionImages.value.push(directData);
  toast.success("Direct banking transaction added successfully");
};

const getTotalImagesCount = (context, item = null) => {
  if (context === "new") {
    return proveImages.value.length + transactionImages.value.length;
  } else if (context === "edit") {
    return proveImages.value.length + transactionImages.value.length;
  } else if (context === "view" && item) {
    return (
      (item.cash_images?.length || 0) + (item.cash_book_images?.length || 0)
    );
  }
  return 0;
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
