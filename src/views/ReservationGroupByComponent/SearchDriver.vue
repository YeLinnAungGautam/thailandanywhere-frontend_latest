<template>
  <div class="relative w-full">
    <!-- Search Input -->
    <input
      v-model="searchQuery"
      type="text"
      :placeholder="
        selectedDriver ? selectedDriver.name : 'Search and select driver...'
      "
      class="w-full h-10 px-4 py-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      @focus="showDropdown = true"
      @blur="handleBlur"
      @input="filterDrivers"
    />

    <!-- Dropdown Arrow -->
    <div
      class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
      :class="{ 'rotate-180': showDropdown }"
    >
      <svg
        class="w-4 h-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        ></path>
      </svg>
    </div>

    <!-- Dropdown List -->
    <div
      v-if="showDropdown"
      class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
    >
      <!-- No results message -->
      <div
        v-if="filteredDrivers.length === 0"
        class="px-4 py-3 text-xs text-gray-500"
      >
        No drivers found
      </div>

      <!-- Driver options -->
      <div
        v-for="driver in filteredDrivers"
        :key="driver.id"
        class="px-4 py-3 text-xs hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
        @mousedown="selectDriver(driver)"
      >
        {{ driver.name }}
      </div>

      <!-- Clear selection option -->
      <div
        v-if="selectedDriver"
        class="px-4 py-3 text-xs text-red-500 hover:bg-red-50 cursor-pointer border-t border-gray-200"
        @mousedown="clearSelection"
      >
        Clear selection
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    drivers: {
      type: Object,
      default: () => ({ data: [] }),
    },
    modelValue: {
      type: [String, Number],
      default: "",
    },
  },

  emits: ["update:modelValue", "change"],

  data() {
    return {
      searchQuery: "",
      showDropdown: false,
      filteredDrivers: [],
    };
  },

  computed: {
    selectedDriver() {
      if (!this.modelValue) return null;
      return (
        this.drivers?.data?.find((driver) => driver.id === this.modelValue) ||
        null
      );
    },
  },

  watch: {
    drivers: {
      handler() {
        this.filterDrivers();
      },
      immediate: true,
    },

    modelValue() {
      // Clear search when external value changes
      if (!this.modelValue) {
        this.searchQuery = "";
      }
    },
  },

  methods: {
    filterDrivers() {
      const query = this.searchQuery.toLowerCase();
      this.filteredDrivers = (this.drivers?.data || []).filter((driver) =>
        driver.name.toLowerCase().includes(query)
      );
    },

    selectDriver(driver) {
      this.$emit("update:modelValue", driver.id);
      this.$emit("change", driver.id);
      this.searchQuery = "";
      this.showDropdown = false;
    },

    clearSelection() {
      this.$emit("update:modelValue", "");
      this.$emit("change", "");
      this.searchQuery = "";
      this.showDropdown = false;
    },

    handleBlur() {
      // Delay hiding dropdown to allow click events to fire
      setTimeout(() => {
        this.showDropdown = false;
        this.searchQuery = "";
      }, 150);
    },
  },
};
</script>
