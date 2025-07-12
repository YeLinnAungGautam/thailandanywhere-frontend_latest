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

    <div class="grid grid-cols-5 gap-4">
      <div class="col-span-5">
        <!-- Header Component -->
        <div>
          <CashHeader />
        </div>

        <!-- Filters -->
        <div class="pb-4 grid grid-cols-6 gap-4">
          <div class="col-span-1">
            <select
              v-model="filters.type"
              class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div class="col-span-1">
            <select
              v-model="filters.cash_structure_id"
              class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
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
            <input
              v-model="filters.start_date"
              type="date"
              class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
              placeholder="Start Date"
            />
          </div>
          <div class="col-span-1">
            <input
              v-model="filters.end_date"
              type="date"
              class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
              placeholder="End Date"
            />
          </div>
          <div class="col-span-1">
            <input
              v-model="filters.limit"
              type="number"
              min="1"
              max="100"
              class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
              placeholder="Limit"
            />
          </div>
          <div class="col-span-1">
            <button
              @click="clearFilters"
              class="w-full bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 text-xs rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-5 gap-4">
          <!-- Table Section -->
          <div class="col-span-3">
            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
              <!-- Table Header -->
              <div class="bg-[#FF613c] text-white">
                <div
                  class="grid grid-cols-8 gap-3 px-4 py-3 text-xs font-medium uppercase"
                >
                  <div class="col-span-1">Reference</div>
                  <div class="col-span-1">Date</div>
                  <div class="col-span-1">Type</div>
                  <div class="col-span-1">Structure</div>
                  <div class="col-span-1">Amount</div>
                  <div class="col-span-1">Bank</div>
                  <div class="col-span-1">Images</div>
                  <div class="col-span-1 text-center">Actions</div>
                </div>
              </div>

              <!-- Table Body -->
              <div
                class="divide-y divide-gray-200 max-h-[500px] overflow-y-auto"
              >
                <div
                  v-for="item in cashBooks?.data ?? []"
                  :key="item.id"
                  class="grid grid-cols-8 gap-3 px-4 py-3 text-xs hover:bg-gray-50 transition-colors"
                  :class="{ 'bg-blue-50': selectedEntry?.id === item.id }"
                >
                  <div class="col-span-1 font-medium text-gray-800">
                    {{ item?.reference }}
                  </div>
                  <div class="col-span-1 text-gray-600">
                    {{ formatDate(item?.date) }}
                  </div>
                  <div class="col-span-1">
                    <span
                      :class="
                        item?.income_or_expense === 'income'
                          ? 'text-green-600 bg-green-100'
                          : 'text-red-600 bg-red-100'
                      "
                      class="px-2 py-1 rounded-full text-[10px] font-medium"
                    >
                      {{ item?.income_or_expense }}
                    </span>
                  </div>
                  <div class="col-span-1 text-gray-600 truncate">
                    {{ item?.cash_structure?.name ?? "-" }}
                  </div>
                  <div class="col-span-1 font-medium text-gray-800">
                    {{ item?.amount }}
                  </div>
                  <div class="col-span-1 text-gray-600 truncate">
                    {{ item?.interact_bank ?? "-" }}
                  </div>
                  <div class="col-span-1">
                    <div class="flex flex-col gap-1">
                      <span
                        v-if="item?.cash_images?.length > 0"
                        class="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-[9px] text-center"
                      >
                        {{ item.cash_images.length }} slip
                      </span>
                      <span
                        v-if="item?.cash_book_images?.length > 0"
                        class="bg-green-100 text-green-600 px-2 py-1 rounded-full text-[9px] text-center"
                      >
                        {{ item.cash_book_images.length }} image
                      </span>
                      <span
                        v-if="
                          !item?.cash_images?.length &&
                          !item?.cash_book_images?.length
                        "
                        class="text-gray-400 text-center"
                      >
                        No images
                      </span>
                    </div>
                  </div>
                  <div
                    class="col-span-1 flex justify-center items-center space-x-2"
                  >
                    <button
                      @click="editEntry(item)"
                      class="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Edit"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      @click="deleteEntry(item.id)"
                      class="text-red-600 hover:text-red-800 transition-colors"
                      title="Delete"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Empty State -->
                <div
                  v-if="
                    !loading &&
                    (!cashBooks?.data || cashBooks.data.length === 0)
                  "
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 class="mt-2 text-sm font-medium text-gray-900">
                    No cash book entries
                  </h3>
                  <p class="mt-1 text-sm text-gray-500">
                    Get started by creating a new entry.
                  </p>
                </div>

                <!-- Loading State -->
                <div v-if="loading" class="text-center py-12">
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
                </div>
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

          <!-- Form Section -->
          <div class="col-span-2 h-[75vh] overflow-y-auto">
            <CashBookEdit
              :getData="selectedEntry"
              @refresh="handleRefresh"
              @clear="clearSelection"
            />
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
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
import CashBookEdit from "./cash/CashBookEdit.vue";

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
const selectedEntry = ref(null);
const filters = ref({
  type: "",
  cash_structure_id: "",
  start_date: "",
  end_date: "",
  limit: 10,
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

const editEntry = (entry) => {
  selectedEntry.value = { ...entry };
};

const clearSelection = () => {
  selectedEntry.value = null;
};

const handleRefresh = async () => {
  await getAction();
  clearSelection();
};

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

      // Clear selection if the deleted entry was selected
      if (selectedEntry.value?.id === id) {
        clearSelection();
      }

      await getAction();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete entry");
    }
  }
};

// Utility functions
const formatDate = (date) => {
  if (!date) return "-";

  try {
    let dateObj;

    // Check if date is in DD-MM-YYYY HH:mm:ss format
    if (
      typeof date === "string" &&
      date.includes("-") &&
      date.split("-")[0].length === 2
    ) {
      // Convert DD-MM-YYYY HH:mm:ss to YYYY-MM-DD HH:mm:ss
      const [datePart, timePart] = date.split(" ");
      const [day, month, year] = datePart.split("-");
      const isoDateStr = `${year}-${month}-${day} ${timePart}`;
      dateObj = new Date(isoDateStr);
    } else {
      // Handle other date formats
      dateObj = new Date(date);
    }

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }

    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting date:", date, error);
    return "Invalid Date";
  }
};

const getTotalAmount = (accounts) => {
  if (!accounts || accounts.length === 0) return "0.00";
  const total = accounts.reduce((sum, account) => {
    return sum + (parseFloat(account.pivot?.allocated_amount) || 0);
  }, 0);
  return total.toFixed(2);
};

// Watch filters for auto-refresh
watch(
  filters,
  debounce(async () => {
    await getAction();
  }, 500),
  { deep: true }
);

// Initialize data on component mount
onMounted(async () => {
  await Promise.all([getAction(), cashStructureStore.getSimpleListAction()]);
});
</script>

<style scoped>
/* Custom scrollbar for table */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
