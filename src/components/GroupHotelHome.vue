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
          <h2 class="text-2xl font-semibold text-gray-800">Overview</h2>
          <p class="text-gray-500 text-xs text-center">
            View and manage your general
          </p>
        </div>
      </div>

      <!-- Fill Data Card -->
      <div
        @click="goToFillData"
        class="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <div class="flex flex-col items-center justify-center space-y-4">
          <div
            class="w-20 h-20 bg-[#FF613c] rounded-2xl flex items-center justify-center"
          >
            <!--
            category: Database
            version: "2.13"
            unicode: "fa14"
            -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M4 6c0 1.657 3.582 3 8 3s8 -1.343 8 -3s-3.582 -3 -8 -3s-8 1.343 -8 3"
              />
              <path d="M4 6v6c0 1.453 2.755 2.665 6.414 2.941" />
              <path d="M20 11v-5" />
              <path d="M4 12v6c0 1.579 3.253 2.873 7.383 2.991" />
              <path
                d="M18 22l3.35 -3.284a2.143 2.143 0 0 0 .005 -3.071a2.242 2.242 0 0 0 -3.129 -.006l-.224 .22l-.223 -.22a2.242 2.242 0 0 0 -3.128 -.006a2.143 2.143 0 0 0 -.006 3.071l3.355 3.296z"
              />
            </svg>
          </div>
          <h2 class="text-2xl font-semibold text-gray-800">Fill Data</h2>
          <p class="text-gray-500 text-xs text-center">
            View and manage your bookings fill data
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
          <h2 class="text-2xl font-semibold text-gray-800">Reserve</h2>
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

      <!-- Confirmation Card -->
      <div
        @click="goToConfirmation"
        class="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <div class="flex flex-col items-center justify-center space-y-4">
          <div
            class="w-20 h-20 bg-[#FF613c] rounded-2xl flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M9 11l3 3l8 -8" />
              <path
                d="M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9"
              />
            </svg>
          </div>
          <h2 class="text-2xl font-semibold text-gray-800">Confirmation</h2>
          <p class="text-gray-500 text-xs text-center">
            View and manage your confirmation
          </p>
        </div>
      </div>

      <!-- Amends Card -->
      <div
        @click="goToExpense"
        class="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <div class="flex flex-col items-center justify-center space-y-4">
          <div
            class="w-20 h-20 bg-[#FF613c] rounded-2xl flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M12.29 20.977c-.818 .132 -1.724 -.3 -1.965 -1.294a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c.983 .238 1.416 1.126 1.298 1.937"
              />
              <path d="M19 19m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
              <path d="M17 21l4 -4" />
              <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
            </svg>
          </div>
          <h2 class="text-2xl font-semibold text-gray-800">Amends</h2>
          <p class="text-gray-500 text-xs text-center">
            View and manage your amends
          </p>
        </div>
      </div>

      <!-- Invoices Card -->
      <!-- <div
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
      </div> -->

      <!-- Tickets Card -->
      <!-- <div
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
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
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

const goToFillData = () => {
  router.push({ name: "group-fill-data" });
};
const goToConfirmation = () => {
  router.push({ name: "group-confirmation" });
};
</script>
