<template>
  <Layout>
    <div class="min-h-auto bg-gradient-to-br from-gray-50 to-gray-100">
      <!-- Header -->

      <!-- Dashboard Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- 1. Sales Analytics -->
        <div
          @click="navigateTo('/home/sale-analysics')"
          class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-blue-300 transform hover:-translate-y-1"
        >
          <div
            class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"
          ></div>
          <div class="p-6 relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div
                class="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
              >
                <svg
                  class="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <span
                class="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              Sales Analytics
            </h3>
            <p class="text-gray-500 text-sm">Sales performance and trends</p>
          </div>
        </div>

        <!-- 2. Overall Analytics -->
        <div
          @click="navigateTo('/home/overall-analysics')"
          class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-purple-300 transform hover:-translate-y-1"
        >
          <div
            class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"
          ></div>
          <div class="p-6 relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div
                class="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
              >
                <svg
                  class="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                  />
                </svg>
              </div>
              <span
                class="text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              Overall Analytics
            </h3>
            <p class="text-gray-500 text-sm">Comprehensive business insights</p>
          </div>
        </div>

        <!-- 3. Calendar -->
        <div
          @click="navigateTo('/home/calendar')"
          class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-green-300 transform hover:-translate-y-1"
        >
          <div
            class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"
          ></div>
          <div class="p-6 relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div
                class="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
              >
                <svg
                  class="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span
                class="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Calendar</h3>
            <p class="text-gray-500 text-sm">
              Manage reservations and bookings
            </p>
          </div>
        </div>

        <!-- 4. Account Receivable -->
        <div
          @click="navigateTo('/home/receivable')"
          class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-orange-300 transform hover:-translate-y-1"
        >
          <div
            class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"
          ></div>
          <div class="p-6 relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div
                class="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
              >
                <svg
                  class="w-7 h-7 text-white"
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
              <span
                class="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              Account Receivable
            </h3>
            <p class="text-gray-500 text-sm">Monitor outstanding invoices</p>
          </div>
        </div>

        <!-- 5. Cash Flow Report -->
        <div
          @click="navigateTo('/home/cashImageReport')"
          class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-teal-300 transform hover:-translate-y-1"
        >
          <div
            class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-400 to-teal-600 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"
          ></div>
          <div class="p-6 relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div
                class="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
              >
                <svg
                  class="w-7 h-7 text-white"
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
              <span
                class="text-teal-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              Cash Flow Report
            </h3>
            <p class="text-gray-500 text-sm">View cash flow and liquidity</p>
          </div>
        </div>

        <!-- 5. Cash Flow Report -->
        <div
          @click="navigateTo('/home/funnel-report')"
          class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-indigo-300 transform hover:-translate-y-1"
        >
          <div
            class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"
          ></div>
          <div class="p-6 relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div
                class="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FFFFFF"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-view-icon lucide-view"
                >
                  <path d="M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2" />
                  <path d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" />
                  <circle cx="12" cy="12" r="1" />
                  <path
                    d="M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0"
                  />
                </svg>
              </div>
              <span
                class="text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              Funnel Report
            </h3>
            <p class="text-gray-500 text-sm">
              View funnel analytics and conversion
            </p>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import Layout from "./Layout.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const navigateTo = (path) => {
  router.push(path);
};
</script>
