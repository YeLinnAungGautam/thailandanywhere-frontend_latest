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
          class="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col"
        >
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  Review & Edit Extracted Data
                </h3>
                <p class="text-xs text-gray-600 mt-1">
                  ✏️ You can edit the AI-extracted values before applying them.
                  Only checked items will be updated.
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

            <!-- Info Banner -->
            <!-- <div class="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-start gap-3">
                <svg
                  class="w-5 h-5 text-blue-600 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
                <div>
                  <h4 class="text-sm font-semibold text-blue-900">
                    Editable Values
                  </h4>
                  <p class="text-sm text-blue-700 mt-1">
                    Click on any blue field in the "New Value" column to edit
                    the AI-extracted data. Your changes will be applied when you
                    click "Apply Changes".
                  </p>
                </div>
              </div>
            </div> -->

            <!-- Comparison Tables -->
            <div class="space-y-8">
              <!-- Basic Info -->
              <ComparisonSection
                title="Basic Information"
                icon="🏨"
                :fields="basicInfoFields"
                v-model="approvedFields"
                @update:editableValues="handleEditableUpdate"
              />

              <!-- Contact Info -->
              <ComparisonSection
                title="Contact Details"
                icon="📞"
                :fields="contactFields"
                v-model="approvedFields"
                @update:editableValues="handleEditableUpdate"
              />

              <!-- Financial Info -->
              <ComparisonSection
                title="Financial Details"
                icon="💳"
                :fields="financialFields"
                v-model="approvedFields"
                @update:editableValues="handleEditableUpdate"
              />

              <!-- Policies -->
              <ComparisonSection
                title="Policies"
                icon="📋"
                :fields="policyFields"
                v-model="approvedFields"
                @update:editableValues="handleEditableUpdate"
              />

              <!-- Contract Info -->
              <ComparisonSection
                title="Contract Information"
                icon="📄"
                :fields="contractFields"
                v-model="approvedFields"
                @update:editableValues="handleEditableUpdate"
              />
            </div>
          </div>

          <!-- Footer -->
          <div
            class="px-6 py-4 border-t border-gray-200 flex justify-between items-center flex-shrink-0"
          >
            <div class="text-sm text-gray-600">
              <span class="font-semibold">{{ approvedFieldsCount }}</span>
              changes selected
              <span v-if="hasEdits" class="ml-2 text-blue-600 font-medium">
                ({{ editCount }} edited)
              </span>
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
const editableValues = ref({});

// Computed
const approvedFieldsCount = computed(() => {
  return Object.values(approvedFields.value).filter(Boolean).length;
});

const hasEdits = computed(() => {
  return Object.keys(editableValues.value).length > 0;
});

const editCount = computed(() => {
  return Object.keys(editableValues.value).length;
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
  // {
  //   key: "place",
  //   label: "Place/Location",
  //   current: props.currentData?.place,
  //   extracted: props.extractedData?.basic_info?.place,
  // },
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

// Handle editable value updates
const handleEditableUpdate = ({ key, value }) => {
  editableValues.value[key] = value;
};

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
};

const deselectAll = () => {
  approvedFields.value = {};
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
};

const closeModal = () => {
  emit("close");
};

const applyChanges = () => {
  const changes = {
    fields: approvedFields.value,
    editableValues: editableValues.value,
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
      editableValues.value = {}; // Reset edits
    }
  },
);
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
