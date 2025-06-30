<template>
  <div class="relative">
    <div class="relative">
      <input
        ref="searchInput"
        v-model="searchTerm"
        @focus="showDropdown = true"
        @blur="handleBlur"
        @keydown="handleKeydown"
        type="text"
        class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs pr-8"
        :placeholder="
          selectedAccount
            ? `${selectedAccount.account_code} - ${selectedAccount.account_name}`
            : 'Search account...'
        "
      />
      <div class="absolute inset-y-0 right-0 flex items-center pr-2">
        <svg
          class="w-4 h-4 text-gray-400 transform transition-transform"
          :class="{ 'rotate-180': showDropdown }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>

    <!-- Dropdown -->
    <div
      v-if="showDropdown"
      class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
    >
      <div
        v-if="filteredAccounts.length === 0"
        class="px-3 py-2 text-xs text-gray-500"
      >
        No accounts found
      </div>
      <div
        v-for="(account, index) in filteredAccounts"
        :key="account.id"
        @mousedown.prevent="selectAccount(account)"
        class="px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 flex items-center justify-between"
        :class="{
          'bg-blue-100': index === highlightedIndex,
          'bg-green-100': modelValue === account.id,
        }"
      >
        <span>
          <span class="font-medium text-blue-600">{{
            account.account_code
          }}</span>
          <span class="text-gray-700"> - {{ account.account_name }}</span>
        </span>
        <span v-if="modelValue === account.id" class="text-green-600">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  accounts: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: "Search account...",
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const searchTerm = ref("");
const showDropdown = ref(false);
const highlightedIndex = ref(-1);
const searchInput = ref(null);

// Get the currently selected account
const selectedAccount = computed(() => {
  return props.accounts.find((account) => account.id == props.modelValue);
});

// Filter accounts based on search term
const filteredAccounts = computed(() => {
  if (!searchTerm.value) {
    return props.accounts;
  }

  const term = searchTerm.value.toLowerCase();
  return props.accounts.filter(
    (account) =>
      account.account_code?.toLowerCase().includes(term) ||
      account.account_name?.toLowerCase().includes(term)
  );
});

// Reset highlighted index when filtered accounts change
watch(filteredAccounts, () => {
  highlightedIndex.value = -1;
});

// Clear search when dropdown closes
watch(showDropdown, (isOpen) => {
  if (!isOpen) {
    searchTerm.value = "";
    highlightedIndex.value = -1;
  }
});

const selectAccount = (account) => {
  emit("update:modelValue", account.id);
  emit("change", account);
  showDropdown.value = false;
  searchTerm.value = "";
};

const handleBlur = () => {
  // Small delay to allow click events to fire
  setTimeout(() => {
    showDropdown.value = false;
  }, 150);
};

const handleKeydown = (event) => {
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      if (highlightedIndex.value < filteredAccounts.value.length - 1) {
        highlightedIndex.value++;
      }
      break;
    case "ArrowUp":
      event.preventDefault();
      if (highlightedIndex.value > 0) {
        highlightedIndex.value--;
      }
      break;
    case "Enter":
      event.preventDefault();
      if (
        highlightedIndex.value >= 0 &&
        filteredAccounts.value[highlightedIndex.value]
      ) {
        selectAccount(filteredAccounts.value[highlightedIndex.value]);
      }
      break;
    case "Escape":
      showDropdown.value = false;
      searchInput.value?.blur();
      break;
  }
};

// Clear selection method (optional - can be called from parent)
const clearSelection = () => {
  emit("update:modelValue", "");
  searchTerm.value = "";
  showDropdown.value = false;
};

// Expose methods to parent component
defineExpose({
  clearSelection,
  focus: () => searchInput.value?.focus(),
});
</script>
