<template>
  <div class="p-6">
    <!-- Grid Container -->
    <div class="grid grid-cols-4 gap-6">
      <!-- General Card -->
      <div
        @click="handleStay"
        class="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <div class="flex flex-col items-center justify-center space-y-4">
          <div
            class="w-20 h-20 bg-[#FF613c] rounded-2xl flex items-center justify-center"
          >
            <svg
              class="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </div>
          <h2 class="text-2xl font-semibold text-gray-800">General</h2>
          <p class="text-gray-500 text-xs text-center">
            View and manage your general
          </p>
        </div>
      </div>

      <!-- Emails Card -->
      <div
        @click="goToMainPage"
        class="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <div class="flex flex-col items-center justify-center space-y-4">
          <div
            class="w-20 h-20 bg-[#FF613c] rounded-2xl flex items-center justify-center"
          >
            <svg
              class="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 class="text-2xl font-semibold text-gray-800">Emails</h2>
          <p class="text-gray-500 text-xs text-center">
            View and manage your emails
          </p>
        </div>
      </div>

      <!-- Expenses Card -->
      <div
        @click="goToExpense"
        class="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <div class="flex flex-col items-center justify-center space-y-4">
          <div
            class="w-20 h-20 bg-[#FF613c] rounded-2xl flex items-center justify-center"
          >
            <svg
              class="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h2 class="text-2xl font-semibold text-gray-800">Expenses</h2>
          <p class="text-gray-500 text-xs text-center">
            View and manage your expenses
          </p>
        </div>
      </div>

      <!-- Invoices Card -->
      <div
        @click="goToMainPage"
        class="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <div class="flex flex-col items-center justify-center space-y-4">
          <div
            class="w-20 h-20 bg-[#FF613c] rounded-2xl flex items-center justify-center"
          >
            <svg
              class="w-10 h-10 text-white"
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
          </div>
          <h2 class="text-2xl font-semibold text-gray-800">Invoices</h2>
          <p class="text-gray-500 text-xs text-center">
            View and manage your invoices
          </p>
        </div>
      </div>

      <!-- Tickets Card -->
      <div
        @click="goToMainPage"
        class="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <div class="flex flex-col items-center justify-center space-y-4">
          <div
            class="w-20 h-20 bg-[#FF613c] rounded-2xl flex items-center justify-center"
          >
            <svg
              class="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
          </div>
          <h2 class="text-2xl font-semibold text-gray-800">Tickets</h2>
          <p class="text-gray-500 text-xs text-center">
            View and manage your tickets
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  goToMainPage: {
    type: Function,
  },
  handleStay: {
    type: Function,
  },
  goToExpense: {
    type: Function,
  },
});
</script>
