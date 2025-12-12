<template>
  <div class="flex h-[62vh] bg-white">
    <!-- Left Sidebar - Ticket List -->
    <div class="w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto">
      <div class="p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-base font-semibold text-[#FF613c]">
            Ticket Variations
          </h2>
          <span class="text-xs text-gray-500"
            >{{ variations.length }} types</span
          >
        </div>

        <!-- Pricing Summary -->
        <div class="mb-4 p-3 bg-white rounded-lg border border-gray-200">
          <div class="flex justify-between items-center mb-2">
            <span class="text-xs text-gray-500">Starting From</span>
            <span class="text-lg font-bold text-[#FF613c]"
              >{{ detail?.lowest_variation_price || "N/A" }} THB</span
            >
          </div>
          <div
            v-if="
              detail?.lowest_walk_in_price &&
              detail.lowest_walk_in_price !== 'null'
            "
            class="flex justify-between items-center text-xs"
          >
            <span class="text-gray-500">Walk-in Price</span>
            <span class="text-gray-700"
              >{{ detail.lowest_walk_in_price }} THB</span
            >
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-8">
          <div
            class="animate-spin h-8 w-8 border-4 border-[#FF613c] border-t-transparent rounded-full"
          ></div>
        </div>

        <!-- Ticket List -->
        <div v-else-if="variations.length > 0" class="space-y-2">
          <div
            v-for="variation in variations"
            :key="variation.id"
            @click="selectVariation(variation)"
            :class="[
              'p-3 rounded-lg border cursor-pointer transition-all hover:border-[#FF613c]',
              selectedVariation?.id === variation.id
                ? 'border-[#FF613c] bg-[#FF613c]/5'
                : 'border-gray-200 bg-white',
            ]"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="text-sm font-medium text-gray-900">
                  {{ variation.name }}
                </h3>
                <p class="text-xs text-gray-500 mt-1">
                  {{ variation.description || "No description" }}
                </p>
                <div class="flex items-center mt-2 space-x-3">
                  <div class="flex items-center space-x-1">
                    <span class="text-sm font-semibold text-[#FF613c]"
                      >{{ variation.price }} THB</span
                    >
                  </div>
                  <div
                    v-if="
                      variation.walk_in_price &&
                      variation.walk_in_price !== 'null'
                    "
                    class="flex items-center space-x-1"
                  >
                    <span class="text-xs text-gray-500"
                      >Walk-in: {{ variation.walk_in_price }} THB</span
                    >
                  </div>
                </div>
              </div>
              <div v-if="selectedVariation?.id === variation.id" class="ml-2">
                <div class="w-2 h-2 bg-[#FF613c] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-8">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
            ></path>
          </svg>
          <p class="mt-2 text-sm text-gray-600">No ticket variations found</p>
          <p class="text-xs text-gray-400 mt-1">
            This cruise has no ticket types yet
          </p>
        </div>
      </div>
    </div>

    <!-- Right Content Area - Variation Details -->
    <div class="flex-1 overflow-y-auto">
      <div class="p-6">
        <div
          v-if="!selectedVariation"
          class="flex items-center justify-center h-full"
        >
          <div class="text-center">
            <svg
              class="mx-auto h-16 w-16 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              ></path>
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">
              Select a Ticket Type
            </h3>
            <p class="mt-2 text-sm text-gray-500">
              Choose a ticket variation from the list to view details
            </p>
          </div>
        </div>

        <div v-else>
          <!-- Variation Header -->
          <div class="flex justify-between items-start mb-6">
            <div>
              <h1 class="text-xl font-semibold text-gray-900">
                {{ selectedVariation.name }}
              </h1>
              <p class="text-sm text-gray-500 mt-1">
                Ticket ID: {{ selectedVariation.id }}
              </p>
            </div>
          </div>

          <!-- Pricing Information -->
          <div
            class="bg-gradient-to-br from-[#FF613c]/10 to-[#FF613c]/5 p-6 rounded-lg mb-6"
          >
            <h3 class="text-sm font-semibold text-gray-700 mb-4">
              Pricing Information
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-white p-4 rounded-lg">
                <p class="text-xs text-gray-500 mb-1">Online Price</p>
                <p class="text-2xl font-bold text-[#FF613c]">
                  {{ selectedVariation.price }} THB
                </p>
              </div>
              <div
                v-if="
                  selectedVariation.walk_in_price &&
                  selectedVariation.walk_in_price !== 'null'
                "
                class="bg-white p-4 rounded-lg"
              >
                <p class="text-xs text-gray-500 mb-1">Walk-in Price</p>
                <p class="text-2xl font-bold text-gray-700">
                  {{ selectedVariation.walk_in_price }} THB
                </p>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 class="text-sm font-semibold text-gray-700 mb-3">
              Description
            </h3>
            <p class="text-sm text-gray-600 leading-relaxed">
              {{ selectedVariation.description || "No description available" }}
            </p>
          </div>

          <!-- Additional Information -->
          <div class="bg-gray-50 p-6 rounded-lg">
            <h3 class="text-sm font-semibold text-gray-700 mb-4">
              Additional Information
            </h3>
            <div class="space-y-3 text-sm">
              <div
                class="flex justify-between items-center pb-3 border-b border-gray-200"
              >
                <span class="text-gray-500">Variation Type</span>
                <span class="text-gray-900 font-medium">{{
                  selectedVariation.name
                }}</span>
              </div>
              <div
                class="flex justify-between items-center pb-3 border-b border-gray-200"
              >
                <span class="text-gray-500">Status</span>
                <span
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    selectedVariation.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700',
                  ]"
                >
                  {{ selectedVariation.is_active ? "Active" : "Inactive" }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const props = defineProps({
  detail: {
    type: Object,
    required: true,
  },
});

const loading = ref(false);
const selectedVariation = ref(null);

const variations = computed(() => {
  return props.detail?.variations || [];
});

const selectVariation = (variation) => {
  selectedVariation.value = variation;
};

onMounted(() => {
  // Auto-select first variation if available
  if (variations.value.length > 0) {
    selectedVariation.value = variations.value[0];
  }
});
</script>
