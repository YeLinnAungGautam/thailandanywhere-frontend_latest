<template>
  <Modal :isOpen="modelValue" @closeModal="closeModal">
    <DialogPanel
      class="w-full max-w-4xl transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all"
    >
      <DialogTitle
        as="div"
        class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-3 px-4 rounded-t-xl"
      >
        <span class="uppercase">Tax Receipt Declaration</span>
        <button
          @click="closeModal"
          class="text-white hover:text-gray-200 transition-colors"
        >
          <XMarkIcon class="h-5 w-5" />
        </button>
      </DialogTitle>

      <div class="p-6">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF613c]"
          ></div>
          <p class="mt-2 text-gray-600">Loading tax receipts...</p>
        </div>

        <!-- No Data State -->
        <div
          v-else-if="!taxReceipts || taxReceipts.length === 0"
          class="text-center py-8"
        >
          <div class="text-gray-400 text-6xl mb-4">📋</div>
          <p class="text-gray-600">No tax receipts found for declaration</p>
        </div>

        <!-- Tax Receipts List -->
        <div v-else>
          <!-- Header Controls -->
          <div class="mb-4 flex justify-between items-center">
            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  :checked="allSelected"
                  @change="toggleSelectAll"
                  class="rounded border-gray-300 text-[#FF613c] focus:ring-[#FF613c]"
                />
                <span class="ml-2 text-sm font-medium">Select All</span>
              </label>
              <span class="text-sm text-gray-500">
                {{ selectedItems.length }} of {{ taxReceipts.length }} selected
              </span>
            </div>

            <div class="flex space-x-2">
              <button
                v-if="selectedItems.length > 0"
                @click="handleDeclare"
                :disabled="declaring"
                class="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <span v-if="declaring">Declaring...</span>
                <span v-else
                  >Declare Selected ({{ selectedItems.length }})</span
                >
              </button>

              <button
                v-if="selectedDeclaredItems.length > 0"
                @click="handleRemoveDeclaration"
                :disabled="removing"
                class="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <span v-if="removing">Removing...</span>
                <span v-else
                  >Remove Declaration ({{ selectedDeclaredItems.length }})</span
                >
              </button>
            </div>
          </div>

          <!-- Filter Options -->
          <div class="mb-4 flex space-x-4">
            <select
              v-model="statusFilter"
              class="px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20"
            >
              <option value="all">All Status</option>
              <option value="declared">Declared</option>
              <option value="not_declared">Not Declared</option>
            </select>

            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by invoice number or product..."
              class="px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20 flex-1"
            />
          </div>

          <!-- Tax Receipts Table -->
          <div class="overflow-x-auto max-h-96">
            <table class="w-full text-xs border border-gray-300">
              <thead class="bg-gray-50 sticky top-0">
                <tr class="divide-x divide-gray-300">
                  <th class="text-xs text-center font-medium py-3 w-[50px]">
                    <input
                      type="checkbox"
                      :checked="allFilteredSelected"
                      @change="toggleSelectAllFiltered"
                      class="rounded border-gray-300 text-[#FF613c] focus:ring-[#FF613c]"
                    />
                  </th>
                  <th class="text-xs text-center font-medium py-3 w-[80px]">
                    Status
                  </th>
                  <th class="text-xs text-center font-medium py-3 w-[120px]">
                    Invoice Number
                  </th>
                  <th class="text-xs text-center font-medium py-3 w-[150px]">
                    Product Type
                  </th>
                  <th class="text-xs text-center font-medium py-3 w-[100px]">
                    Start Date
                  </th>
                  <th class="text-xs text-center font-medium py-3 w-[100px]">
                    End Date
                  </th>
                  <th class="text-xs text-center font-medium py-3 w-[100px]">
                    Amount
                  </th>
                  <th class="text-xs text-center font-medium py-3 w-[100px]">
                    VAT
                  </th>
                  <th class="text-xs text-center font-medium py-3 w-[150px]">
                    Company
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="receipt in filteredTaxReceipts"
                  :key="receipt.id"
                  class="hover:bg-gray-50 transition-colors"
                  :class="{
                    'bg-green-50': receipt.declaration,
                    'bg-white': !receipt.declaration,
                  }"
                >
                  <td class="text-center py-3">
                    <input
                      type="checkbox"
                      :value="receipt.id"
                      v-model="selectedItems"
                      class="rounded border-gray-300 text-[#FF613c] focus:ring-[#FF613c]"
                    />
                  </td>
                  <td class="text-center py-3">
                    <span
                      class="px-2 py-1 rounded-full text-xs font-medium"
                      :class="
                        receipt.declaration
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      "
                    >
                      {{ receipt.declaration ? "Declared" : "Pending" }}
                    </span>
                  </td>
                  <td class="text-center py-3">
                    {{ receipt.invoice_number || "-" }}
                  </td>
                  <td class="text-center py-3">
                    {{ formatProductType(receipt.product?.name) }}
                  </td>
                  <td class="text-center py-3">
                    {{ formatDate(receipt.service_start_date) }}
                  </td>
                  <td class="text-center py-3">
                    {{ formatDate(receipt.service_end_date) }}
                  </td>
                  <td class="text-center py-3">
                    {{ formatAmount(receipt.total_after_tax) }}
                  </td>
                  <td class="text-center py-3">
                    {{ formatAmount(receipt.total_tax_withold) }}
                  </td>
                  <td
                    class="text-center py-3 max-w-[150px] truncate"
                    :title="receipt.company_legal_name"
                  >
                    {{ receipt.company_legal_name || "-" }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Summary -->
          <div class="mt-4 p-4 bg-gray-50 rounded-lg">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span class="text-gray-600">Total Records:</span>
                <span class="font-medium ml-1">{{ taxReceipts.length }}</span>
              </div>
              <div>
                <span class="text-gray-600">Declared:</span>
                <span class="font-medium ml-1 text-green-600">{{
                  declaredCount
                }}</span>
              </div>
              <div>
                <span class="text-gray-600">Pending:</span>
                <span class="font-medium ml-1 text-yellow-600">{{
                  pendingCount
                }}</span>
              </div>
              <div>
                <span class="text-gray-600">Selected:</span>
                <span class="font-medium ml-1 text-blue-600">{{
                  selectedItems.length
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t bg-gray-50 rounded-b-xl">
        <div class="flex justify-end">
          <button
            @click="closeModal"
            class="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </DialogPanel>
  </Modal>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { useTaxReceiptStore } from "../../stores/taxReceipt";

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  cashImages: {
    type: Object,
    default: () => ({}),
  },
});

// Emits
const emit = defineEmits(["update:modelValue", "declared", "close"]);

// Composables
const toast = useToast();
const taxReceiptStore = useTaxReceiptStore();

// Reactive data
const loading = ref(false);
const declaring = ref(false);
const removing = ref(false);
const taxReceipts = ref([]);
const selectedItems = ref([]);
const statusFilter = ref("all");
const searchQuery = ref("");

// Methods
const closeModal = () => {
  emit("update:modelValue", false);
  emit("close");
  resetModal();
};

const resetModal = () => {
  selectedItems.value = [];
  statusFilter.value = "all";
  searchQuery.value = "";
  taxReceipts.value = [];
};

const loadTaxReceipts = () => {
  if (!props.cashImages?.data) return;

  loading.value = true;
  taxReceipts.value = [];

  try {
    // Extract tax receipts from cashImages data
    props.cashImages.data.forEach((cashImage) => {
      if (
        cashImage.relatable?.tax_credit &&
        Array.isArray(cashImage.relatable.tax_credit)
      ) {
        cashImage.relatable.tax_credit.forEach((taxCredit) => {
          taxReceipts.value.push({
            ...taxCredit,
            cash_image_id: cashImage.id,
            product_type:
              cashImage.relatable?.items?.[0]?.product_type || "N/A",
          });
        });
      }
    });
  } catch (error) {
    console.error("Error loading tax receipts:", error);
    toast.error("Failed to load tax receipts");
  } finally {
    loading.value = false;
  }
};

// Computed properties
const filteredTaxReceipts = computed(() => {
  let filtered = taxReceipts.value;

  // Filter by status
  if (statusFilter.value === "declared") {
    filtered = filtered.filter((receipt) => receipt.declaration);
  } else if (statusFilter.value === "not_declared") {
    filtered = filtered.filter((receipt) => !receipt.declaration);
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (receipt) =>
        receipt.invoice_number?.toLowerCase().includes(query) ||
        receipt.product?.name?.toLowerCase().includes(query) ||
        receipt.company_legal_name?.toLowerCase().includes(query)
    );
  }

  return filtered;
});

const allSelected = computed(() => {
  return (
    taxReceipts.value.length > 0 &&
    selectedItems.value.length === taxReceipts.value.length
  );
});

const allFilteredSelected = computed(() => {
  return (
    filteredTaxReceipts.value.length > 0 &&
    filteredTaxReceipts.value.every((receipt) =>
      selectedItems.value.includes(receipt.id)
    )
  );
});

const declaredCount = computed(() => {
  return taxReceipts.value.filter((receipt) => receipt.declaration).length;
});

const pendingCount = computed(() => {
  return taxReceipts.value.filter((receipt) => !receipt.declaration).length;
});

const selectedDeclaredItems = computed(() => {
  return selectedItems.value.filter((id) => {
    const receipt = taxReceipts.value.find((r) => r.id === id);
    return receipt?.declaration;
  });
});

// Event handlers
const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedItems.value = [];
  } else {
    selectedItems.value = taxReceipts.value.map((receipt) => receipt.id);
  }
};

const toggleSelectAllFiltered = () => {
  if (allFilteredSelected.value) {
    // Remove filtered items from selection
    const filteredIds = filteredTaxReceipts.value.map((receipt) => receipt.id);
    selectedItems.value = selectedItems.value.filter(
      (id) => !filteredIds.includes(id)
    );
  } else {
    // Add filtered items to selection
    const filteredIds = filteredTaxReceipts.value.map((receipt) => receipt.id);
    const newSelection = [
      ...selectedItems.value,
      ...filteredIds.filter((id) => !selectedItems.value.includes(id)),
    ];
    selectedItems.value = newSelection;
  }
};

const handleDeclare = async () => {
  if (selectedItems.value.length === 0) {
    toast.warning("Please select at least one tax receipt");
    return;
  }

  // Filter out already declared items
  const undeclaredItems = selectedItems.value.filter((id) => {
    const receipt = taxReceipts.value.find((r) => r.id === id);
    return !receipt?.declaration;
  });

  if (undeclaredItems.length === 0) {
    toast.warning("Selected items are already declared");
    return;
  }

  const result = await Swal.fire({
    title: "Confirm Declaration",
    text: `Are you sure you want to declare ${undeclaredItems.length} tax receipt(s)?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#10b981",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, Declare",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  declaring.value = true;

  try {
    const response = await taxReceiptStore.addDeclaration({
      tax_receipt_ids: undeclaredItems,
    });

    if (response.success) {
      toast.success(response.message);

      // Update local data
      undeclaredItems.forEach((id) => {
        const receipt = taxReceipts.value.find((r) => r.id === id);
        if (receipt) {
          receipt.declaration = true;
        }
      });

      selectedItems.value = [];
      emit("declared");
    } else {
      toast.error(response.message || "Failed to declare tax receipts");
    }
  } catch (error) {
    console.error("Error declaring tax receipts:", error);
    toast.error("Failed to declare tax receipts");
  } finally {
    declaring.value = false;
  }
};

const handleRemoveDeclaration = async () => {
  const declaredItems = selectedDeclaredItems.value;

  if (declaredItems.length === 0) {
    toast.warning("No declared items selected");
    return;
  }

  const result = await Swal.fire({
    title: "Confirm Remove Declaration",
    text: `Are you sure you want to remove declaration from ${declaredItems.length} tax receipt(s)?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, Remove",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  removing.value = true;

  try {
    // Process each item individually since the backend expects single ID
    let successCount = 0;
    let errorCount = 0;

    for (const id of declaredItems) {
      try {
        const response = await taxReceiptStore.removeDeclaration({
          tax_receipt_id: id,
        });

        if (response.success) {
          successCount++;
          // Update local data
          const receipt = taxReceipts.value.find((r) => r.id === id);
          if (receipt) {
            receipt.declaration = false;
          }
        } else {
          errorCount++;
        }
      } catch (error) {
        errorCount++;
        console.error(`Error removing declaration for ID ${id}:`, error);
      }
    }

    if (successCount > 0) {
      toast.success(
        `Successfully removed declaration from ${successCount} tax receipt(s)`
      );
      selectedItems.value = [];
      emit("declared");
    }

    if (errorCount > 0) {
      toast.error(
        `Failed to remove declaration from ${errorCount} tax receipt(s)`
      );
    }
  } catch (error) {
    console.error("Error removing declarations:", error);
    toast.error("Failed to remove declarations");
  } finally {
    removing.value = false;
  }
};

// Utility functions
const formatProductType = (productName) => {
  if (!productName) return "N/A";

  // Extract the last part after the last backslash if it contains App\Models\
  if (productName.includes("App\\Models\\")) {
    return productName.split("\\").pop() || productName;
  }

  return productName;
};

const formatDate = (dateString) => {
  if (!dateString) return "-";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch (error) {
    return dateString;
  }
};

const formatAmount = (amount) => {
  if (!amount) return "-";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Watchers
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      loadTaxReceipts();
    }
  }
);

watch(
  () => props.cashImages,
  () => {
    if (props.modelValue) {
      loadTaxReceipts();
    }
  },
  { deep: true }
);

// Lifecycle
onMounted(() => {
  if (props.modelValue) {
    loadTaxReceipts();
  }
});
</script>
