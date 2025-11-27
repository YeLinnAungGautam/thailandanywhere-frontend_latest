<template>
  <div class="relative inline-block" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2 bg-transparent rounded px-3 py-1 transition-colors min-w-[150px] justify-between"
    >
      <span class="text-gray-700 text-sm pr-4">{{ getDisplayMonth() }}</span>
      <svg
        class="w-4 h-4 text-gray-600 transition-transform"
        :class="{ 'rotate-180': isOpen }"
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
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[200px] z-50 max-h-[300px] overflow-y-auto"
      >
        <button
          v-for="month in monthOptions"
          :key="month.value"
          @click="selectMonth(month)"
          class="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
          :class="{
            'bg-blue-50 text-blue-600': selectMonthValue === month.value,
          }"
        >
          <span class="text-sm">{{ month.label }}</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const dropdownRef = ref(null);
const selectMonthValue = ref(props.modelValue);

// Generate month options (current month and previous 11 months)
const monthOptions = computed(() => {
  const options = [];
  const currentDate = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const value = `${year}-${month}`;
    const label = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    options.push({ value, label });
  }

  return options;
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectMonth = (month) => {
  selectMonthValue.value = month.value;
  emit("update:modelValue", month.value);
  isOpen.value = false;
};

const getDisplayMonth = () => {
  if (!selectMonthValue.value) {
    return "Select Month";
  }

  const selected = monthOptions.value.find(
    (m) => m.value === selectMonthValue.value
  );
  return selected ? selected.label : "Select Month";
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);

  // Set default to current month if no value
  if (!props.modelValue) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    selectMonthValue.value = `${year}-${month}`;
    emit("update:modelValue", selectMonthValue.value);
  }
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
