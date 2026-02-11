<template>
  <div class="space-y-6">
    <!-- Quick Actions -->
    <!-- <div class="bg-white rounded-xl p-4 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="flex gap-3">
          <button
            @click="selectAll"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            ✓ Select All
          </button>
          <button
            @click="deselectAll"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium transition-colors"
          >
            ✗ Deselect All
          </button>
          <button
            @click="selectOnlyChanges"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            ~ Select Only Changes
          </button>
        </div>

        <div class="text-sm">
          AI Confidence:
          <span
            class="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg font-semibold ml-2"
          >
            {{ extractedData.ai_confidence?.overall || 0 }}%
          </span>
        </div>
      </div>
    </div> -->

    <!-- Comparison Sections -->
    <div class="space-y-6">
      <!-- Basic Info -->
      <ComparisonSection
        title="Basic Information"
        icon="🏨"
        :fields="basicInfoFields"
        v-model="localApprovedFields"
        @update:editableValues="handleEditableUpdate"
      />

      <!-- Contact Info -->
      <ComparisonSection
        title="Contact Details"
        icon="📞"
        :fields="contactFields"
        v-model="localApprovedFields"
        @update:editableValues="handleEditableUpdate"
      />

      <!-- Financial Info -->
      <ComparisonSection
        title="Financial Details"
        icon="💳"
        :fields="financialFields"
        v-model="localApprovedFields"
        @update:editableValues="handleEditableUpdate"
      />

      <!-- Policies -->
      <ComparisonSection
        title="Policies"
        icon="📋"
        :fields="policyFields"
        v-model="localApprovedFields"
        @update:editableValues="handleEditableUpdate"
      />

      <!-- Contract Info -->
      <ComparisonSection
        title="Contract Information"
        icon="📄"
        :fields="contractFields"
        v-model="localApprovedFields"
        @update:editableValues="handleEditableUpdate"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import ComparisonSection from "./ComparisonSection.vue";

const props = defineProps({
  extractedData: Object,
  currentData: Object,
  approvedFields: Object,
  editableValues: Object,
});

const emit = defineEmits(["update:approvedFields", "update:editableValues"]);

const localApprovedFields = computed({
  get: () => props.approvedFields,
  set: (val) => emit("update:approvedFields", val),
});

const localEditableValues = computed({
  get: () => props.editableValues,
  set: (val) => emit("update:editableValues", val),
});

// Helper function
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
  {
    key: "child_policy",
    label: "Child Policy",
    current: props.currentData?.child_policy,
    extracted: props.extractedData?.policies?.child_policy,
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
const handleEditableUpdate = ({ key, value }) => {
  const updated = { ...props.editableValues };
  updated[key] = value;
  emit("update:editableValues", updated);
};

const selectAll = () => {
  const allFields = [
    ...basicInfoFields.value,
    ...contactFields.value,
    ...financialFields.value,
    ...policyFields.value,
    ...contractFields.value,
  ];

  const approved = {};
  allFields.forEach((field) => {
    if (field.extracted) {
      approved[field.key] = true;
    }
  });

  emit("update:approvedFields", approved);
};

const deselectAll = () => {
  emit("update:approvedFields", {});
};

const selectOnlyChanges = () => {
  const allFields = [
    ...basicInfoFields.value,
    ...contactFields.value,
    ...financialFields.value,
    ...policyFields.value,
    ...contractFields.value,
  ];

  const approved = {};
  allFields.forEach((field) => {
    if (hasChanged(field.extracted, field.current)) {
      approved[field.key] = true;
    }
  });

  emit("update:approvedFields", approved);
};

// Auto-select changes on mount
watch(
  () => props.extractedData,
  () => {
    if (Object.keys(props.approvedFields).length === 0) {
      selectOnlyChanges();
    }
  },
  { immediate: true },
);
</script>
