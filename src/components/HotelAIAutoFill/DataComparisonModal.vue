<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20"
      >
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-900 bg-opacity-75"></div>

        <!-- Modal panel -->
        <div
          class="relative bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col"
        >
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold text-gray-900">
                  Review Extracted Data
                </h3>
                <p class="text-sm text-gray-600 mt-1">
                  Compare and approve changes. Only checked items will be
                  updated.
                </p>
              </div>
              <div class="flex items-center gap-3">
                <div
                  class="text-sm bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg font-medium"
                >
                  AI Confidence:
                  {{ extractedData.ai_confidence?.overall || 0 }}%
                </div>
                <button
                  @click="closeModal"
                  class="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon class="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          <!-- Body - Scrollable -->
          <div class="flex-1 overflow-y-auto p-6">
            <!-- Quick Actions -->
            <div class="mb-6 flex gap-3">
              <button
                @click="selectAll"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
              >
                ✓ Select All
              </button>
              <button
                @click="deselectAll"
                class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium"
              >
                ✗ Deselect All
              </button>
              <button
                @click="selectOnlyChanges"
                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
              >
                ~ Select Only Changes
              </button>
            </div>

            <!-- Comparison Tables -->
            <div class="space-y-8">
              <!-- Basic Info -->
              <ComparisonSection
                title="Basic Information"
                icon="🏨"
                :fields="basicInfoFields"
                v-model="approvedFields"
              />

              <!-- Contact Info -->
              <ComparisonSection
                title="Contact Details"
                icon="📞"
                :fields="contactFields"
                v-model="approvedFields"
              />

              <!-- Financial Info -->
              <ComparisonSection
                title="Financial Details"
                icon="💳"
                :fields="financialFields"
                v-model="approvedFields"
              />

              <!-- Policies -->
              <ComparisonSection
                title="Policies"
                icon="📋"
                :fields="policyFields"
                v-model="approvedFields"
              />

              <!-- Contract Info -->
              <ComparisonSection
                title="Contract Information"
                icon="📄"
                :fields="contractFields"
                v-model="approvedFields"
              />

              <!-- Rooms & Periods -->
              <div
                class="bg-white border-2 border-gray-200 rounded-xl overflow-hidden"
              >
                <div
                  class="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4"
                >
                  <h3
                    class="text-lg font-bold text-white flex items-center gap-2"
                  >
                    <span>🛏️</span>
                    <span>Room Types & Periods</span>
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="px-6 py-4 border-t border-gray-200 flex justify-between items-center flex-shrink-0"
          >
            <div class="text-sm text-gray-600">
              <span class="font-semibold">{{ approvedFieldsCount }}</span>
              changes selected
            </div>
            <div class="flex gap-3">
              <button
                @click="closeModal"
                class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                @click="applyChanges"
                :disabled="approvedFieldsCount === 0"
                class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span>✨</span>
                <span>Apply {{ approvedFieldsCount }} Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import ComparisonSection from "./ComparisonSection.vue";

const props = defineProps({
  isOpen: Boolean,
  extractedData: Object,
  currentData: Object,
  originalFile: Object,
});

const emit = defineEmits(["close", "applyChanges"]);

// State
const approvedFields = ref({});
const approvedRooms = ref([]);

// Computed
const approvedFieldsCount = computed(() => {
  return (
    Object.values(approvedFields.value).filter(Boolean).length +
    approvedRooms.value.length
  );
});

// Helper function to check if values are different
const hasChanged = (newValue, oldValue) => {
  if (newValue === null || newValue === undefined || newValue === "")
    return false;
  if (oldValue === null || oldValue === undefined || oldValue === "")
    return true;
  return JSON.stringify(newValue) !== JSON.stringify(oldValue);
};

// Build field comparisons
const basicInfoFields = computed(() => [
  {
    key: "name",
    label: "Hotel Name",
    current: props.currentData?.name,
    extracted: props.extractedData?.basic_info?.hotel_name,
  },
  {
    key: "legal_name",
    label: "Legal Name",
    current: props.currentData?.legal_name,
    extracted: props.extractedData?.basic_info?.legal_name,
  },
  {
    key: "place",
    label: "Place/Location",
    current: props.currentData?.place,
    extracted: props.extractedData?.basic_info?.place,
  },
]);

const contactFields = computed(() => [
  {
    key: "official_phone_number",
    label: "Phone Number",
    current: props.currentData?.official_phone_number,
    extracted: props.extractedData?.contact?.official_phone_number,
  },
  {
    key: "official_email",
    label: "Official Email",
    current: props.currentData?.official_email,
    extracted: props.extractedData?.contact?.official_email,
  },
  {
    key: "email",
    label: "Booking Emails",
    current: props.currentData?.email?.join(", "),
    extracted: props.extractedData?.contact?.email?.join(", "),
    type: "array",
  },
  {
    key: "official_address",
    label: "Address",
    current: props.currentData?.official_address,
    extracted: props.extractedData?.contact?.official_address,
    type: "textarea",
  },
]);

const financialFields = computed(() => [
  {
    key: "vat_inclusion",
    label: "VAT Inclusion",
    current: props.currentData?.vat_inclusion,
    extracted: props.extractedData?.financial?.vat_inclusion,
  },
  {
    key: "vat_id",
    label: "VAT ID",
    current: props.currentData?.vat_id,
    extracted: props.extractedData?.financial?.vat_id,
  },
  {
    key: "vat_name",
    label: "VAT Name",
    current: props.currentData?.vat_name,
    extracted: props.extractedData?.financial?.vat_name,
  },
  {
    key: "vat_address",
    label: "VAT Address",
    current: props.currentData?.vat_address,
    extracted: props.extractedData?.financial?.vat_address,
    type: "textarea",
  },
  {
    key: "bank_name",
    label: "Bank Name",
    current: props.currentData?.bank_name,
    extracted: props.extractedData?.financial?.bank_name,
  },
  {
    key: "bank_account_number",
    label: "Account Number",
    current: props.currentData?.bank_account_number,
    extracted: props.extractedData?.financial?.bank_account_number,
  },
  {
    key: "account_name",
    label: "Account Name",
    current: props.currentData?.account_name,
    extracted: props.extractedData?.financial?.account_name,
  },
  {
    key: "payment_method",
    label: "Payment Method",
    current: props.currentData?.payment_method,
    extracted: props.extractedData?.financial?.payment_method,
  },
]);

const policyFields = computed(() => [
  {
    key: "check_in",
    label: "Check-in Time",
    current: props.currentData?.check_in,
    extracted: props.extractedData?.policies?.check_in,
  },
  {
    key: "check_out",
    label: "Check-out Time",
    current: props.currentData?.check_out,
    extracted: props.extractedData?.policies?.check_out,
  },
  {
    key: "cancellation_policy",
    label: "Cancellation Policy",
    current: props.currentData?.cancellation_policy,
    extracted: props.extractedData?.policies?.cancellation_policy,
    type: "textarea",
  },
]);

const contractFields = computed(() => [
  {
    key: "contract_due",
    label: "Contract Due Date",
    current: props.currentData?.contract_due,
    extracted: props.extractedData?.contract?.contract_due,
  },
]);

// Methods
const selectAll = () => {
  const allFields = [
    ...basicInfoFields.value,
    ...contactFields.value,
    ...financialFields.value,
    ...policyFields.value,
    ...contractFields.value,
  ];

  allFields.forEach((field) => {
    if (field.extracted) {
      approvedFields.value[field.key] = true;
    }
  });

  approvedRooms.value = [...(props.extractedData?.rooms || [])];
};

const deselectAll = () => {
  approvedFields.value = {};
  approvedRooms.value = [];
};

const selectOnlyChanges = () => {
  const allFields = [
    ...basicInfoFields.value,
    ...contactFields.value,
    ...financialFields.value,
    ...policyFields.value,
    ...contractFields.value,
  ];

  allFields.forEach((field) => {
    if (hasChanged(field.extracted, field.current)) {
      approvedFields.value[field.key] = true;
    } else {
      approvedFields.value[field.key] = false;
    }
  });

  // For rooms, select all (they need manual review anyway)
  approvedRooms.value = [...(props.extractedData?.rooms || [])];
};

const closeModal = () => {
  emit("close");
};

const applyChanges = () => {
  const changes = {
    fields: approvedFields.value,
    rooms: approvedRooms.value,
    extractedData: props.extractedData,
  };

  emit("applyChanges", changes);
};

// Auto-select changes on open
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      selectOnlyChanges();
    }
  },
);
</script>

<style scoped>
/* Same modal transitions as before */
</style>
