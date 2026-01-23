<template>
  <Layout>
    <div class="min-h-auto bg-gradient-to-br from-gray-50 to-gray-100">
      <!-- Header -->

      <!-- Dashboard Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
