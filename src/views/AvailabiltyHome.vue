<template>
  <Layout>
    <div class="min-h-auto bg-gradient-to-br from-gray-50 to-gray-100">
      <!-- Header -->

      <!-- Dashboard Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- 1. Sales Analytics -->
        <div
          @click="navigateTo('/availabilities/analytics')"
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
              Avalability Analytics
            </h3>
            <p class="text-gray-500 text-sm">coming soon</p>
          </div>
        </div>
        <!-- 1. Sales Analytics -->
        <div
          @click="navigateTo('/allowment/checker')"
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
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-list-todo-icon lucide-list-todo"
                >
                  <path d="M13 5h8" />
                  <path d="M13 12h8" />
                  <path d="M13 19h8" />
                  <path d="m3 17 2 2 4-4" />
                  <rect x="3" y="4" width="6" height="6" rx="1" />
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
              Allowment Checker
            </h3>
            <p class="text-gray-500 text-sm">...</p>
          </div>
        </div>
        <!-- 1. Sales Analytics -->
        <div
          @click="navigateTo('/availabilities/checker')"
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
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-list-todo-icon lucide-list-todo"
                >
                  <path d="M13 5h8" />
                  <path d="M13 12h8" />
                  <path d="M13 19h8" />
                  <path d="m3 17 2 2 4-4" />
                  <rect x="3" y="4" width="6" height="6" rx="1" />
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
              Avalability Checker
            </h3>
            <p class="text-gray-500 text-sm">...</p>
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
