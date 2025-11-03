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
              @click="openCreateDrawer"
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
              <!-- Existing Entries -->
              <tr
                v-for="item in cashBooks?.data ?? []"
                :key="item.id"
                class="excel-row hover:bg-gray-50"
              >
                <td class="excel-cell">
                  <span>{{ formatDateExcel(item.date) }}</span>
                </td>
                <td class="excel-cell">
                  <span class="whitespace-nowrap">{{ item.reference }}</span>
                </td>
                <td class="excel-cell">
                  <span>{{ item.cash_structure?.code || "-" }}</span>
                </td>
                <td class="excel-cell">
                  <span class="truncate block">{{
                    item.cash_structure?.name || "-"
                  }}</span>
                </td>
                <td class="excel-cell">
                  <span>{{ item.cash_structure?.coa || "-" }}</span>
                </td>
                <td class="excel-cell">
                  <span>{{ item.cash_structure?.acc_head || "-" }}</span>
                </td>
                <td class="excel-cell">
                  <span class="truncate block" :title="item.description">{{
                    item.description || "-"
                  }}</span>
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
                    @click="viewCOAList(item)"
                    class="text-orange-600 hover:text-orange-800 text-xs underline"
                  >
                    {{ item.chart_of_accounts?.length || 0 }} COA
                  </button>
                </td>
                <td class="excel-cell">
                  <button
                    @click="viewImages(item)"
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
                  !loading && (!cashBooks?.data || cashBooks.data.length === 0)
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

    <!-- Side Drawer for Create/Edit -->
    <Transition name="drawer">
      <div
        v-if="showDrawer"
        class="fixed inset-0 z-50 overflow-hidden"
        @click.self="closeDrawer"
      >
        <div
          class="absolute inset-0 bg-black bg-opacity-50"
          @click="closeDrawer"
        ></div>
        <div
          class="fixed inset-y-0 right-0 max-w-2xl w-full bg-white shadow-xl overflow-y-auto"
        >
          <div
            class="sticky top-0 bg-[#FF613c] text-white px-6 py-4 z-10 flex justify-between items-center"
          >
            <h3 class="text-lg font-semibold">
              {{
                editingItem ? "Edit Cash Book Entry" : "Create Cash Book Entry"
              }}
            </h3>
            <button @click="closeDrawer" class="text-white hover:text-gray-200">
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

          <div class="p-6">
            <CashBookForm
              :getData="editingItem"
              @refresh="handleRefresh"
              @close="closeDrawer"
            />
          </div>
        </div>
      </div>
    </Transition>

    <!-- COA List View Modal -->
    <div
      v-if="showCOAViewModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeCOAViewModal"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div class="sticky top-0 bg-orange-600 text-white px-6 py-4 z-10">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">Chart of Accounts</h3>
            <button
              @click="closeCOAViewModal"
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
          <div class="space-y-3">
            <div
              v-for="(account, index) in viewCOAData"
              :key="index"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="font-medium text-gray-900">
                    {{ account.code }} - {{ account.name }}
                  </div>
                  <div class="text-xs text-gray-600 mt-1">
                    Allocated: {{ account.allocated_amount }} | Type:
                    {{ account.note === "1" ? "Debit (+)" : "Credit (-)" }}
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="viewCOAData.length === 0"
              class="text-center py-8 text-gray-500"
            >
              <p class="text-sm">No chart of accounts found.</p>
            </div>
          </div>
          <div class="flex justify-end mt-6">
            <button
              @click="closeCOAViewModal"
              class="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Images View Modal -->
    <div
      v-if="showImagesViewModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeImagesViewModal"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div
          class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10"
        >
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">View Images</h3>
            <button
              @click="closeImagesViewModal"
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
          <!-- Prove Images -->
          <div class="mb-6" v-if="viewProveImages.length > 0">
            <h4 class="text-md font-semibold text-gray-800 mb-3">
              Prove Images
            </h4>
            <div class="grid grid-cols-4 gap-4">
              <div
                v-for="(image, index) in viewProveImages"
                :key="index"
                class="relative"
              >
                <img
                  :src="image.url"
                  alt="Prove"
                  class="w-full h-24 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>

          <!-- Transaction Images -->
          <div v-if="viewTransactionImages.length > 0">
            <h4 class="text-md font-semibold text-gray-800 mb-3">
              Transaction Images
            </h4>
            <div class="space-y-3">
              <div
                v-for="(receipt, index) in viewTransactionImages"
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
              @click="closeImagesViewModal"
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

// Component imports
import Layout from "./Layout.vue";
import Pagination from "../components/Pagination.vue";
import CashHeader from "../components/CashHeader.vue";
import CashBookForm from "./cash/CashBookEdit.vue";

// Store initialization
const sideBarStore = useSidebarStore();
const cashBookStore = useCashBookStore();
const cashStructureStore = useCashStructureStore();
const toast = useToast();

// Store refs
const { isShowSidebar } = storeToRefs(sideBarStore);
const { cashBooks, loading } = storeToRefs(cashBookStore);
const { cash_structures } = storeToRefs(cashStructureStore);

// Local state
const showDrawer = ref(false);
const editingItem = ref(null);
const filters = ref({
  type: "",
  cash_structure_id: "",
  start_date: "",
  end_date: "",
  limit: 10,
});

// View modals
const showCOAViewModal = ref(false);
const showImagesViewModal = ref(false);
const viewCOAData = ref([]);
const viewProveImages = ref([]);
const viewTransactionImages = ref([]);

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

// Drawer methods
const openCreateDrawer = () => {
  editingItem.value = null;
  showDrawer.value = true;
};

const openEditDrawer = (item) => {
  editingItem.value = item;
  showDrawer.value = true;
};

const closeDrawer = () => {
  showDrawer.value = false;
  editingItem.value = null;
};

const handleRefresh = async () => {
  closeDrawer();
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

// View methods
const viewCOAList = (item) => {
  viewCOAData.value =
    item.chart_of_accounts?.map((acc) => ({
      code: acc.code || acc.account_code,
      name: acc.name || acc.account_name,
      allocated_amount: acc.pivot?.allocated_amount || 0,
      note: acc.pivot?.note || "1",
    })) || [];
  showCOAViewModal.value = true;
};

const closeCOAViewModal = () => {
  showCOAViewModal.value = false;
  viewCOAData.value = [];
};

const viewImages = (item) => {
  viewProveImages.value = (item.cash_book_images || []).map((img) => ({
    url: img.image,
    id: img.id,
  }));

  viewTransactionImages.value = processTransactionImagesForView(
    item.cash_images || []
  );
  showImagesViewModal.value = true;
};

const closeImagesViewModal = () => {
  showImagesViewModal.value = false;
  viewProveImages.value = [];
  viewTransactionImages.value = [];
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

const getTotalImagesCount = (item) => {
  return (item.cash_images?.length || 0) + (item.cash_book_images?.length || 0);
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
  await Promise.all([getAction(), cashStructureStore.getSimpleListAction()]);
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

/* Drawer animation */
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.3s ease;
}

.drawer-enter-from .drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from > div:last-child,
.drawer-leave-to > div:last-child {
  transform: translateX(100%);
}

.drawer-enter-active > div:last-child,
.drawer-leave-active > div:last-child {
  transition: transform 0.3s ease;
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
</style>
