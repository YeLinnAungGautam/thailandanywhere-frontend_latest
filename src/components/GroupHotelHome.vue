<template>
  <div class="p-6">
    <!-- Grid Container -->
    <div class="max-w-4xl grid grid-cols-2 gap-6">
      <!-- Mail Card -->
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
          <h2 class="text-2xl font-semibold text-gray-800">Mail</h2>
          <p class="text-gray-500 text-xs text-center">
            View and manage your emails
          </p>
        </div>
      </div>

      <!-- Expenses Card -->
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
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 class="text-2xl font-semibold text-gray-800">Expenses</h2>
          <p class="text-gray-500 text-xs text-center">
            Track your expenses for hotels
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
});
</script>
