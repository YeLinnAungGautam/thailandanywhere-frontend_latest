<template>
  <!-- Modal Backdrop -->
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click="closeModal"
  >
    <!-- Modal Content -->
    <div
      class="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 my-4 max-h-[90vh] overflow-hidden"
      @click.stop
    >
      <!-- Modal Header -->
      <div
        class="flex items-center justify-between p-6 border-b border-gray-200"
      >
        <h2 class="text-xl font-semibold text-gray-800">
          Connect to Tax Receipt
        </h2>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 transition-colors"
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

      <!-- Modal Body -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
        <!-- Group Information -->
        <div
          v-if="groupId"
          class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <h3 class="text-sm font-medium text-blue-800 mb-2">
            Connecting Group
          </h3>
          <p class="text-sm text-blue-700">
            Group ID: <span class="font-semibold">{{ groupId }}</span>
          </p>
          <p v-if="groupInfo" class="text-sm text-blue-600 mt-1">
            <!-- {{ groupInfo }} -->
            Group CrmId :
            <span v-for="a in groupInfo.items" :key="a">{{ a.crm_id }}, </span>
          </p>
        </div>

        <!-- Search Tax Receipt -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Search Tax Receipt by Invoice Number
          </label>
          <div class="flex gap-3">
            <div class="flex-1 relative">
              <input
                v-model="searchInvoice"
                @input="onSearchInput"
                @keyup.enter="searchTaxReceipt"
                type="text"
                placeholder="Enter invoice number..."
                class="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm rounded-lg p-3"
              />

              <!-- Search Results Dropdown -->
              <div
                v-if="
                  showSearchResults && (searchResults.length > 0 || isSearching)
                "
                class="absolute z-20 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg"
              >
                <!-- Loading state -->
                <div
                  v-if="isSearching"
                  class="p-4 text-center text-gray-500 text-sm"
                >
                  <div class="flex items-center justify-center space-x-2">
                    <div
                      class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"
                    ></div>
                    <span>Searching...</span>
                  </div>
                </div>

                <!-- No results -->
                <div
                  v-else-if="
                    !isSearching &&
                    searchResults.length === 0 &&
                    searchInvoice.length >= 2
                  "
                  class="p-4 text-center text-gray-500 text-sm"
                >
                  No tax receipts found
                </div>

                <!-- Search results -->
                <div
                  v-for="receipt in searchResults"
                  :key="receipt.id"
                  @click="selectTaxReceipt(receipt)"
                  class="p-3 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-b-0"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="font-medium text-gray-800">
                        {{ receipt.invoice_number }}
                      </p>
                      <p class="text-xs text-gray-600">
                        {{ receipt.company_legal_name }}
                      </p>
                      <p class="text-xs text-gray-500">
                        {{ formatDate(receipt.receipt_date) }}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm font-semibold text-gray-800">
                        {{ formatCurrency(receipt.total_after_tax) }}
                      </p>
                      <span
                        class="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                      >
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              @click="searchTaxReceipt"
              :disabled="isSearching || !searchInvoice.trim()"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Search
            </button>
          </div>
        </div>

        <!-- Selected Tax Receipt -->
        <div v-if="selectedTaxReceipt" class="mb-6">
          <h3 class="text-sm font-medium text-gray-700 mb-3">
            Selected Tax Receipt
          </h3>
          <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Tax Receipt Info -->
              <div>
                <p class="text-sm font-semibold text-gray-800 mb-2">
                  Invoice: {{ selectedTaxReceipt.invoice_number }}
                </p>
                <p class="text-xs text-gray-600 mb-1">
                  Company: {{ selectedTaxReceipt.company_legal_name }}
                </p>
                <p class="text-xs text-gray-600 mb-1">
                  Receipt Date:
                  {{ formatDate(selectedTaxReceipt.receipt_date) }}
                </p>
                <p class="text-xs text-gray-600 mb-1">
                  Service Period:
                  {{ formatDate(selectedTaxReceipt.service_start_date) }} -
                  {{ formatDate(selectedTaxReceipt.service_end_date) }}
                </p>
              </div>

              <!-- Tax Amounts -->
              <div>
                <p class="text-xs font-medium text-gray-700 mb-2">
                  Tax Details:
                </p>
                <div class="space-y-1">
                  <p class="text-xs text-gray-600">
                    Before Tax:
                    <span class="font-medium">{{
                      formatCurrency(selectedTaxReceipt.total_tax_amount)
                    }}</span>
                  </p>
                  <p class="text-xs text-gray-600">
                    Withheld Tax:
                    <span class="font-medium">{{
                      formatCurrency(selectedTaxReceipt.total_tax_withold)
                    }}</span>
                  </p>
                  <p class="text-xs text-gray-600">
                    After Tax:
                    <span class="font-medium text-green-600">{{
                      formatCurrency(selectedTaxReceipt.total_after_tax)
                    }}</span>
                  </p>
                </div>
              </div>
            </div>

            <!-- Currently Connected Groups -->
            <div
              v-if="
                selectedTaxReceipt.connected_groups &&
                selectedTaxReceipt.connected_groups.length > 0
              "
              class="mt-4 pt-4 border-t border-gray-200"
            >
              <p class="text-xs font-medium text-gray-700 mb-2">
                Currently Connected Groups:
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="group in selectedTaxReceipt.connected_groups"
                  :key="group.id"
                  class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded border"
                  :class="{
                    'bg-yellow-100 text-yellow-800': group.id === groupId,
                  }"
                >
                  ID: {{ group.id }}
                  <span v-if="group.id === groupId" class="ml-1"
                    >(Current)</span
                  >
                </span>
              </div>
            </div>

            <!-- Warning if group is already connected -->
            <div
              v-if="isGroupAlreadyConnected"
              class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded"
            >
              <div class="flex items-center">
                <svg
                  class="w-5 h-5 text-yellow-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <p class="text-sm text-yellow-800">
                  This group is already connected to this tax receipt.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- No Tax Receipt Selected -->
        <div v-else class="text-center py-8 text-gray-500">
          <svg
            class="w-12 h-12 mx-auto mb-3 text-gray-400"
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
          <p class="text-sm">Search for a tax receipt to connect</p>
          <p class="text-xs text-gray-400">Enter an invoice number above</p>
        </div>
      </div>

      <!-- Modal Footer -->
      <div
        class="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50"
      >
        <button
          type="button"
          @click="closeModal"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="connectGroup"
          :disabled="
            !selectedTaxReceipt || isGroupAlreadyConnected || connecting
          "
          class="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="connecting" class="flex items-center">
            <div
              class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
            ></div>
            Connecting...
          </span>
          <span v-else>Connect Group</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useTaxReceiptStore } from "../../stores/taxReceipt";
import { useToast } from "vue-toastification";

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  groupId: {
    type: [String, Number],
    required: true,
  },
  groupInfo: {
    type: Object,
    default: () => ({}),
  },
});

// Emits
const emit = defineEmits(["update:modelValue", "connected", "close"]);

// Stores
const taxReceiptStore = useTaxReceiptStore();
const toast = useToast();

// Component state
const searchInvoice = ref("");
const searchResults = ref([]);
const selectedTaxReceipt = ref(null);
const isSearching = ref(false);
const connecting = ref(false);
const showSearchResults = ref(false);
const searchTimeout = ref(null);

// Computed
const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const isGroupAlreadyConnected = computed(() => {
  if (!selectedTaxReceipt.value || !selectedTaxReceipt.value.connected_groups) {
    return false;
  }

  return selectedTaxReceipt.value.connected_groups.some(
    (group) => group.id == props.groupId
  );
});

// Methods
const closeModal = () => {
  resetModal();
  emit("close");
  isVisible.value = false;
};

const resetModal = () => {
  searchInvoice.value = "";
  searchResults.value = [];
  selectedTaxReceipt.value = null;
  showSearchResults.value = false;

  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
};

const onSearchInput = () => {
  // Clear existing timeout
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  // Set new timeout for debouncing (300ms delay)
  searchTimeout.value = setTimeout(() => {
    if (searchInvoice.value.length >= 2) {
      searchTaxReceipt();
    } else {
      searchResults.value = [];
      showSearchResults.value = false;
    }
  }, 300);
};

const searchTaxReceipt = async () => {
  if (!searchInvoice.value.trim()) {
    toast.error("Please enter an invoice number");
    return;
  }

  isSearching.value = true;
  showSearchResults.value = true;

  try {
    // Search tax receipts by invoice number
    const response = await taxReceiptStore.getListAction({
      search: searchInvoice.value.trim(),
      per_page: 10,
    });

    if (response && response.result && response.result.data) {
      searchResults.value = response.result.data.filter((receipt) =>
        receipt.invoice_number
          .toLowerCase()
          .includes(searchInvoice.value.toLowerCase())
      );
    } else {
      searchResults.value = [];
    }
  } catch (error) {
    console.error("Error searching tax receipts:", error);
    toast.error("Failed to search tax receipts");
    searchResults.value = [];
  } finally {
    isSearching.value = false;
  }
};

const selectTaxReceipt = async (receipt) => {
  selectedTaxReceipt.value = receipt;
  showSearchResults.value = false;
  searchInvoice.value = receipt.invoice_number;

  // Fetch full details including connected groups
  try {
    const detailResponse = await taxReceiptStore.getDetailAction(receipt.id);
    if (detailResponse && detailResponse.result) {
      selectedTaxReceipt.value = {
        ...selectedTaxReceipt.value,
        connected_groups: detailResponse.result.groups || [],
      };
    }
  } catch (error) {
    console.error("Error fetching tax receipt details:", error);
  }
};

const connectGroup = async () => {
  if (!selectedTaxReceipt.value) {
    toast.error("Please select a tax receipt");
    return;
  }

  if (!props.groupId) {
    toast.error("No group ID provided");
    return;
  }

  connecting.value = true;

  try {
    // Get current connected group IDs
    const currentGroupIds = selectedTaxReceipt.value.connected_groups
      ? selectedTaxReceipt.value.connected_groups.map((g) => g.id)
      : [];

    // Add the new group ID if not already connected
    const updatedGroupIds = [...new Set([...currentGroupIds, props.groupId])];

    const payload = {
      group_ids: updatedGroupIds,
    };

    console.log("Connecting group:", payload);

    // Use the syncReservations API endpoint
    const response = await taxReceiptStore.asyncAction(
      selectedTaxReceipt.value.id,
      payload
    );

    console.log("Sync response:", response);

    if (response.status == "1") {
      toast.success("Group connected successfully!");

      // Emit the connected event with details
      emit("connected", {
        taxReceiptId: selectedTaxReceipt.value.id,
        groupId: props.groupId,
        taxReceipt: selectedTaxReceipt.value,
      });

      closeModal();
    } else {
      const message = response?.message || "Failed to connect group";
      toast.error(message);
    }
  } catch (error) {
    console.error("Error connecting group:", error);
    toast.error("Failed to connect group to tax receipt");
  } finally {
    connecting.value = false;
  }
};

// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  }).format(amount || 0);
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Handle clicks outside dropdown
const handleClickOutside = (event) => {
  if (!event.target.closest(".relative")) {
    showSearchResults.value = false;
  }
};

// Handle ESC key
const handleEscKey = (event) => {
  if (event.key === "Escape" && isVisible.value) {
    closeModal();
  }
};

// Watchers
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      resetModal();
    }
  }
);

// Lifecycle
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("keydown", handleEscKey);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("keydown", handleEscKey);

  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
});
</script>
