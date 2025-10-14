<template>
  <Layout :is_white="true">
    <div
      :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
      class="space-x-8 col-span-3 flex justify-start items-center transition-all duration-200 gap-2 text-sm pb-4 absolute top-6"
    >
      <p class="text-xl font-medium text-[#FF613c]">
        Duplicate Cash Images
        <span class="w-2 h-2 bg-[#FF613c] rounded-full inline-block"></span>
      </p>
      <div class="flex items-center gap-4">
        <YearPickerVue @year-change="handleYearChange" />
        <select
          v-model="selectedMonth"
          @change="handleMonthChange"
          class="px-3 text-black text-xs py-2 rounded-lg border border-gray-400/20 focus:outline-none"
        >
          <option :value="m.id" v-for="m in monthArray" :key="m.id">
            {{ m.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="relative z-40">
      <VerifyList />
    </div>

    <div class="grid gap-4 relative grid-cols-3 pt-2">
      <!-- Left Side - Duplicate Groups List -->
      <div class="border shadow-sm rounded-lg p-4 col-span-1">
        <div class="pb-4 flex justify-between items-center">
          <div class="flex items-center gap-2">
            <p class="text-sm font-medium">Duplicate Groups</p>
            <span
              class="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full"
            >
              {{ duplicateGroups.length }}
            </span>
          </div>
          <button
            @click="refreshDuplicates"
            class="text-xs bg-blue-500 text-white px-3 py-1 rounded-lg"
          >
            Refresh
          </button>
        </div>

        <!-- Filter Options -->
        <div class="space-y-2 mb-4 pb-4 border-b">
          <div>
            <label class="text-xs mb-1 block">Data Verify Status</label>
            <select
              v-model="filters.data_verify"
              @change="refreshDuplicates"
              class="w-full px-2 py-1.5 text-xs border rounded-lg"
            >
              <option :value="null">All</option>
              <option :value="true">Verified</option>
              <option :value="false">Not Verified</option>
            </select>
          </div>

          <div>
            <label class="text-xs mb-1 block">Currency</label>
            <select
              v-model="filters.currency"
              @change="refreshDuplicates"
              class="w-full px-2 py-1.5 text-xs border rounded-lg"
            >
              <option value="">All</option>
              <option value="THB">THB</option>
              <option value="MMK">MMK</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        <!-- Duplicate Groups List -->
        <div
          v-if="!loading"
          class="space-y-3 max-h-[65vh] overflow-y-scroll pr-2"
        >
          <div
            v-for="(group, index) in duplicateGroups"
            :key="index"
            @click="selectGroup(group)"
            class="border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md"
            :class="{
              'border-[#FF613c] bg-[#FF613c]/5': selectedGroup === group,
              'border-gray-200': selectedGroup !== group,
            }"
          >
            <div class="flex items-start justify-between mb-2">
              <div class="flex-1">
                <p class="text-xs font-medium text-gray-700">
                  {{ formatDate(group.duplicate_signature.date) }}
                </p>
                <p class="text-lg font-semibold text-[#FF613c]">
                  {{ formatCurrency(group.duplicate_signature.amount) }}
                  {{ group.cash_images[0].currency || "THB" }}
                </p>
              </div>
              <span
                class="bg-red-500 text-white text-xs px-2 py-1 rounded-full"
              >
                {{ group.duplicate_count }} duplicates
              </span>
            </div>

            <div class="flex items-center gap-2 text-xs text-gray-600">
              <span class="bg-gray-100 px-2 py-0.5 rounded">
                {{ group.duplicate_signature.interact_bank }}
              </span>
              <span
                class="bg-green-100 text-green-700 px-2 py-0.5 rounded"
                v-if="group.verified_count > 0"
              >
                ✓ {{ group.verified_count }} verified
              </span>
              <span
                class="bg-red-100 text-red-700 px-2 py-0.5 rounded"
                v-if="group.unverified_count > 0"
              >
                ✗ {{ group.unverified_count }} unverified
              </span>
            </div>
          </div>

          <div
            v-if="duplicateGroups.length === 0"
            class="text-center py-8 text-gray-500 text-sm"
          >
            No duplicates found
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="space-y-3">
          <div
            class="animate-pulse border rounded-lg p-3"
            v-for="i in 5"
            :key="i"
          >
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>

      <!-- Right Side - Selected Group Details -->
      <div class="border shadow-sm rounded-lg p-4 col-span-2">
        <div v-if="selectedGroup" class="space-y-4">
          <!-- Header -->
          <div class="flex justify-between items-center pb-4 border-b">
            <div>
              <p class="text-lg font-medium">Merge Duplicates</p>
              <p class="text-xs text-gray-500 mt-1">
                Select ONE to keep, others will be deleted
              </p>
            </div>
            <button
              @click="handleMerge"
              :disabled="
                !selectedToKeep || selectedGroup.cash_images.length < 2
              "
              class="px-4 py-2 bg-[#FF613c] text-white text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FF613c]/90"
            >
              Merge Selected ({{ selectedToDelete.length }} to delete)
            </button>
          </div>

          <!-- Summary Box -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <p class="text-xs text-gray-600">Total Duplicates</p>
                <p class="text-2xl font-bold text-blue-600">
                  {{ selectedGroup.duplicate_count }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-600">Total Amount</p>
                <p class="text-2xl font-bold text-green-600">
                  {{ formatCurrency(selectedGroup.total_amount) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-600">Related Bookings</p>
                <p class="text-2xl font-bold text-purple-600">
                  {{ getTotalBookings() }}
                </p>
              </div>
            </div>
          </div>

          <!-- Cash Images List - Horizontal Scroll -->
          <div class="overflow-x-auto pb-4">
            <div class="flex gap-6 min-w-max">
              <div
                v-for="cashImage in selectedGroup.cash_images"
                :key="cashImage.id"
                @click="handleKeepSelection(cashImage.id)"
                class="border rounded-lg overflow-hidden relative transition-all w-[400px] flex-shrink-0"
                :class="{
                  'border-green-500 bg-green-50':
                    selectedToKeep === cashImage.id,
                  'border-red-300 bg-red-50': selectedToDelete.includes(
                    cashImage.id
                  ),
                  'border-gray-200': !isSelected(cashImage.id),
                }"
              >
                <!-- Radio Checkbox - Top Left -->
                <div class="absolute top-3 left-3 z-30">
                  <input
                    type="radio"
                    :id="`keep-${cashImage.id}`"
                    name="keep-radio"
                    :value="cashImage.id"
                    v-model="selectedToKeep"
                    @change="handleKeepSelection(cashImage.id)"
                    class="w-6 h-6 text-green-600 cursor-pointer"
                  />
                </div>

                <!-- Full Image -->
                <div class="relative w-full h-[300px] bg-gray-100">
                  <img
                    :src="cashImage.image"
                    class="w-full h-full object-contain"
                    alt="Cash image"
                  />
                </div>

                <!-- Details Section -->
                <div class="p-4 space-y-3">
                  <!-- Header Info -->
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="font-medium text-sm">
                        ID: {{ cashImage.id }}
                        <span
                          v-if="cashImage.data_verify"
                          class="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded"
                        >
                          ✓ Verified
                        </span>
                        <span
                          v-else
                          class="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded"
                        >
                          ✗ Not Verified
                        </span>
                      </p>
                      <p class="text-xs text-gray-500 mt-1">
                        {{ cashImage.date }}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="font-semibold text-xl text-[#FF613c]">
                        {{ formatCurrency(cashImage.amount) }}
                      </p>
                      <p class="text-xs text-gray-500">
                        {{ cashImage.currency }}
                      </p>
                    </div>
                  </div>

                  <!-- Transaction Details Grid -->
                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span class="text-gray-500">From:</span>
                      <span class="font-medium ml-1">{{
                        cashImage.sender
                      }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">To:</span>
                      <span class="font-medium ml-1">{{
                        cashImage.receiver
                      }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">Bank:</span>
                      <span class="font-medium ml-1">{{
                        cashImage.interact_bank
                      }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">CRM:</span>
                      <span
                        @click="goToSource(cashImage)"
                        class="font-medium ml-1 bg-gray-300 text-gray-700 px-2 py-0.5 rounded cursor-pointer hover:bg-gray-400"
                      >
                        {{ cashImage.crm_id || "N/A" }}
                      </span>
                    </div>
                  </div>

                  <!-- Related Bookings -->
                  <div
                    v-if="cashImage.bookings && cashImage.bookings.length > 0"
                    class="pt-2 border-t"
                  >
                    <p class="text-xs text-gray-600 mb-1">
                      Related Bookings ({{ cashImage.bookings.length }}):
                    </p>
                    <div class="flex flex-wrap gap-1">
                      <span
                        v-for="booking in cashImage.bookings"
                        :key="booking.id"
                        class="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded cursor-pointer hover:bg-purple-200"
                        @click="openBooking(booking.id)"
                      >
                        {{ booking.crm_id }}
                      </span>
                    </div>
                  </div>

                  <!-- Polymorphic Relationship Info -->
                  <div
                    v-if="cashImage.relatable_type && cashImage.relatable_id"
                    class="pt-2 border-t"
                  >
                    <p class="text-xs text-gray-600 mb-1">
                      Direct Relationship:
                    </p>
                    <div class="flex flex-wrap items-center gap-2">
                      <span
                        class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded"
                      >
                        {{ getRelatableType(cashImage.relatable_type) }}:
                        {{ cashImage.relatable_id }}
                      </span>
                      <span
                        v-if="cashImage.type"
                        class="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded"
                      >
                        Type: {{ cashImage.type }}
                      </span>
                      <span
                        v-if="cashImage.deposit"
                        class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded"
                      >
                        Deposit: {{ formatCurrency(cashImage.deposit) }}
                      </span>
                    </div>
                  </div>

                  <!-- Status Label -->
                  <div v-if="selectedToKeep === cashImage.id" class="pt-2">
                    <span
                      class="text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full inline-block"
                    >
                      ✓ THIS WILL BE KEPT
                    </span>
                  </div>
                  <div
                    v-if="selectedToDelete.includes(cashImage.id)"
                    class="pt-2"
                  >
                    <span
                      class="text-xs font-medium text-red-700 bg-red-100 px-3 py-1 rounded-full inline-block"
                    >
                      ✗ THIS WILL BE DELETED
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="!selectedGroup"
          class="flex flex-col items-center justify-center h-[60vh] text-gray-400"
        >
          <svg
            class="w-24 h-24 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p class="text-lg font-medium">Select a duplicate group</p>
          <p class="text-sm mt-2">
            Choose a group from the left to view and merge duplicates
          </p>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import Layout from "./Layout.vue";
import { ref, computed, onMounted } from "vue";
import { useCashImageStore } from "../stores/cashImage";
import { useSidebarStore } from "../stores/sidebar";
import { storeToRefs } from "pinia";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
import YearPickerVue from "./AccountingComponent/yearPicker.vue";
import { useRouter } from "vue-router";
import VerifyList from "./CashImageCreate/VerifyList.vue";

const router = useRouter();
const toast = useToast();
const cashImageStore = useCashImageStore();
const sidebarStore = useSidebarStore();
const { isShowSidebar } = storeToRefs(sidebarStore);

// State
const loading = ref(false);
const duplicateGroups = ref([]);
const selectedGroup = ref(null);
const selectedToKeep = ref(null);
const selectedToDelete = ref([]);

// Date filters
const currentDate = new Date();
const year = ref(currentDate.getFullYear());
const selectedMonth = ref(currentDate.getMonth() + 1);

// Filters
const filters = ref({
  data_verify: null,
  currency: "",
  interact_bank: "",
});

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

// Methods
const generateDateRangeForMonth = (month, yearValue) => {
  const startDate = new Date(yearValue, month - 1, 1);
  const endDate = new Date(yearValue, month, 0);

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return `${formatDate(startDate)},${formatDate(endDate)}`;
};

const refreshDuplicates = async () => {
  loading.value = true;
  try {
    const params = {
      date: generateDateRangeForMonth(selectedMonth.value, year.value),
      group_by_duplicate: 1,
    };

    if (filters.value.data_verify !== null) {
      params.data_verify = filters.value.data_verify ? 1 : 0;
    }
    if (filters.value.currency) {
      params.currency = filters.value.currency;
    }
    if (filters.value.interact_bank) {
      params.interact_bank = filters.value.interact_bank;
    }

    console.log("Fetching duplicates with params:", params);

    const response = await cashImageStore.cashImageDuplicate(params);

    console.log("Duplicate response:", response);

    if (response.result && response.result.duplicate_groups) {
      duplicateGroups.value = response.result.duplicate_groups;
      // toast.success(`Found ${duplicateGroups.value.length} duplicate groups`);
    } else {
      duplicateGroups.value = [];
      toast.info("No duplicates found");
    }

    // Reset selections
    selectedGroup.value = null;
    selectedToKeep.value = null;
    selectedToDelete.value = [];
  } catch (error) {
    console.error("Error fetching duplicates:", error);
    toast.error(error.response?.data?.message || "Failed to load duplicates");
    duplicateGroups.value = [];
  } finally {
    loading.value = false;
  }
};

const selectGroup = (group) => {
  selectedGroup.value = group;
  selectedToKeep.value = null;
  selectedToDelete.value = [];

  console.log("Selected group:", group);
};

const handleKeepSelection = (id) => {
  selectedToKeep.value = id;

  // Auto-select all others for deletion
  selectedToDelete.value = selectedGroup.value.cash_images
    .map((ci) => ci.id)
    .filter((ciId) => ciId !== id);

  console.log("Keep:", selectedToKeep.value);
  console.log("Delete:", selectedToDelete.value);
};

const isSelected = (id) => {
  return selectedToKeep.value === id || selectedToDelete.value.includes(id);
};

const getTotalBookings = () => {
  if (!selectedGroup.value) return 0;

  const allBookings = selectedGroup.value.cash_images.reduce((acc, ci) => {
    if (ci.bookings) {
      return acc + ci.bookings.length;
    }
    return acc;
  }, 0);

  return allBookings;
};

const getRelatableType = (type) => {
  const types = {
    "App\\Models\\Booking": "Booking",
    "App\\Models\\CashBook": "Cash Book",
    "App\\Models\\BookingItemGroup": "Booking Group",
  };
  return types[type] || type;
};

const extractRelationships = () => {
  const relationships = [];

  // Collect relationships from all cash images to be deleted
  selectedToDelete.value.forEach((deleteId) => {
    const cashImage = selectedGroup.value.cash_images.find(
      (ci) => ci.id === deleteId
    );

    if (cashImage) {
      // Add direct polymorphic relationship if exists
      if (cashImage.relatable_type && cashImage.relatable_id) {
        relationships.push({
          imageable_type: cashImage.relatable_type,
          imageable_id: cashImage.relatable_id,
          type: cashImage.type || null,
          deposit: cashImage.deposit || null,
          notes: `Merged from cash image #${cashImage.id}`,
        });
      }

      // Add bookings relationships
      if (cashImage.bookings && cashImage.bookings.length > 0) {
        cashImage.bookings.forEach((booking) => {
          relationships.push({
            imageable_type: "App\\Models\\Booking",
            imageable_id: booking.id,
            type: booking.pivot?.type || null,
            deposit: booking.pivot?.deposit || null,
            notes:
              booking.pivot?.notes || `Merged from cash image #${cashImage.id}`,
          });
        });
      }

      // Note: For cash_books and booking_item_groups, you would need to add similar logic
      // if those relationships are available in your cashImage data structure
    }
  });

  return relationships;
};

const handleMerge = async () => {
  if (!selectedToKeep.value || selectedToDelete.value.length === 0) {
    toast.warning("Please select one cash image to keep");
    return;
  }

  // Get details of kept cash image
  const keptCashImage = selectedGroup.value.cash_images.find(
    (ci) => ci.id === selectedToKeep.value
  );

  // Extract relationships from deleted cash images
  const relationships = extractRelationships();

  const result = await Swal.fire({
    title: "Confirm Merge",
    html: `
      <div class="text-left space-y-3 p-4">
        <div class="bg-green-50 border border-green-200 rounded-lg p-3">
          <p class="font-semibold text-green-700 mb-2">✓ WILL BE KEPT:</p>
          <p class="text-sm">Cash Image #${selectedToKeep.value}</p>
          <p class="text-xs text-gray-600 mt-1">Amount: ${formatCurrency(
            keptCashImage.amount
          )} ${keptCashImage.currency}</p>
          <p class="text-xs text-gray-600">CRM: ${
            keptCashImage.crm_id || "N/A"
          }</p>
        </div>
        
        <div class="bg-red-50 border border-red-200 rounded-lg p-3">
          <p class="font-semibold text-red-700 mb-2">✗ WILL BE DELETED:</p>
          <ul class="list-disc pl-5 space-y-1">
            ${selectedToDelete.value
              .map((id) => {
                const ci = selectedGroup.value.cash_images.find(
                  (c) => c.id === id
                );
                return `<li class="text-sm">Cash Image #${id} - ${formatCurrency(
                  ci.amount
                )} ${ci.currency}</li>`;
              })
              .join("")}
          </ul>
        </div>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p class="font-semibold text-blue-700 mb-2">📋 Relationships to Transfer:</p>
          <ul class="list-disc pl-5 space-y-1 text-sm">
            <li>${relationships.length} relationships will be transferred</li>
            <li>All bookings will be moved to kept image</li>
            <li>Deleted images will be permanently removed</li>
          </ul>
        </div>
        
        <p class="text-red-600 font-bold text-center mt-4">⚠️ This action cannot be undone!</p>
      </div>
    `,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#FF613c",
    cancelButtonColor: "#6B7280",
    confirmButtonText: "Yes, Merge Now!",
    cancelButtonText: "Cancel",
    width: "600px",
  });

  if (result.isConfirmed) {
    loading.value = true;
    try {
      console.log("Starting merge...");
      console.log("Keep ID:", selectedToKeep.value);
      console.log("Delete IDs:", selectedToDelete.value);
      console.log("Relationships:", relationships);

      const response = await cashImageStore.mergeCashImages(
        selectedToKeep.value,
        selectedToDelete.value
      );

      console.log("Merge response:", response);

      if (response.status === 1) {
        await Swal.fire({
          title: "Success!",
          html: `
            <div class="text-left p-4">
              <p class="text-green-600 font-semibold mb-2">✓ Merge completed successfully!</p>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>Kept Cash Image: #${response.result.kept_cash_image_id}</li>
                <li>Deleted: ${response.result.deleted_count} duplicates</li>
                <li>Transferred: ${relationships.length} relationships</li>
                <li>All relationships moved to cash_imageables table</li>
              </ul>
            </div>
          `,
          icon: "success",
          confirmButtonColor: "#10B981",
        });

        toast.success(
          `Successfully merged ${selectedToDelete.value.length} duplicates`
        );

        // Refresh the list
        await refreshDuplicates();
      }
    } catch (error) {
      console.error("Merge error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to merge duplicates";

      toast.error(errorMessage);

      await Swal.fire({
        title: "Merge Failed",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      loading.value = false;
    }
  }
};

const openBooking = (bookingId) => {
  const route = router.resolve(`/bookings/new-update/${bookingId}`);
  window.open(route.href, "_blank");
};

const goToSource = (detail) => {
  if (detail.relatable_type == "App\\Models\\Booking") {
    if (detail.relatable_id && detail.relatable_id > 0) {
      const route = router.resolve(
        `/bookings/new-update/${detail.relatable_id}`
      );
      window.open(route.href, "_blank");
    }
  }

  if (detail.relatable_type == "App\\Models\\BookingItemGroup") {
    if (detail.relatable_id && detail.relatable_id > 0) {
      const route = router.resolve(`/group-hotel?id=${detail.relatable_id}`);
      window.open(route.href, "_blank");
    }
  }
};

const handleYearChange = (newYear) => {
  year.value = newYear;
  refreshDuplicates();
};

const handleMonthChange = () => {
  refreshDuplicates();
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (amount) => {
  if (!amount) return "0";
  return new Intl.NumberFormat().format(amount);
};

// Lifecycle
onMounted(() => {
  refreshDuplicates();
});
</script>

<style scoped>
/* Custom scrollbar */
.overflow-y-scroll::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-scroll::-webkit-scrollbar-thumb {
  background: #ff613c;
  border-radius: 10px;
}

.overflow-y-scroll::-webkit-scrollbar-thumb:hover {
  background: #e5532f;
}
</style>
