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

        <!-- 5. Cash Flow Report -->
        <div
          @click="navigateTo('/home/generate-inclusive')"
          class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-gray-300 transform hover:-translate-y-1"
        >
          <div
            class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-400 to-gray-600 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"
          ></div>
          <div class="p-6 relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div
                class="w-14 h-14 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-circle-pile-icon lucide-circle-pile"
                >
                  <circle cx="12" cy="19" r="2" />
                  <circle cx="12" cy="5" r="2" />
                  <circle cx="16" cy="12" r="2" />
                  <circle cx="20" cy="19" r="2" />
                  <circle cx="4" cy="19" r="2" />
                  <circle cx="8" cy="12" r="2" />
                </svg>
              </div>
              <span
                class="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
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
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Inclusive</h3>
            <p class="text-gray-500 text-sm">Generate Inclusive</p>
          </div>
        </div>

        <!-- 6. Inclusive graph Report -->
        <div
          @click="navigateTo('/home/inclusive-graph')"
          class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-gray-300 transform hover:-translate-y-1"
        >
          <div
            class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-400 to-gray-600 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"
          ></div>
          <div class="p-6 relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div
                class="w-14 h-14 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
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
                class="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
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
              Inclusive Graph
            </h3>
            <p class="text-gray-500 text-sm">Inclusive Graph</p>
          </div>
        </div>

        <!-- 6. Expense graph Report -->
        <div
          @click="navigateTo('/home/expense-graph')"
          class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-red-100 hover:border-red-300 transform hover:-translate-y-1"
        >
          <div
            class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400 to-red-600 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"
          ></div>
          <div class="p-6 relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div
                class="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
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
                class="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
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
            <h3 class="text-xl font-semibold text-red-800 mb-2">
              Expense Graph
            </h3>
            <p class="text-red-500 text-sm">Expense Graph</p>
          </div>
        </div>

        <div
          @click="navigateTo('/home/hotel-report')"
          class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-red-100 hover:border-red-300 transform hover:-translate-y-1"
        >
          <div
            class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400 to-red-600 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"
          ></div>
          <div class="p-6 relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div
                class="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
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
                class="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
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
            <h3 class="text-xl font-semibold text-red-800 mb-2">
              Hotel Report
            </h3>
            <p class="text-red-500 text-sm">Hotel Report</p>
          </div>
        </div>

        <!-- 6. Expense graph Report -->
        <div
          @click="navigateTo('/home/reservations')"
          class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-blue-100 hover:border-blue-300 transform hover:-translate-y-1"
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
                  id="fi_8622708"
                  viewBox="0 0 60 60"
                  width="30"
                  fill="white"
                  height="30"
                >
                  <path
                    stroke-width="2"
                    d="M56,11H50a2,2,0,0,0-2-2h-.661a5.7,5.7,0,0,0-8.671,0H38a2,2,0,0,0-2,2H30a4,4,0,0,0-3.858,3H12.162a3.994,3.994,0,0,0-3.794,2.735L6.262,23.051A2.981,2.981,0,0,0,4,22H3a3,3,0,0,0-.524,5.947l-1.021.613A3.02,3.02,0,0,0,0,31.133V44a3,3,0,0,0,2,2.816V49a3,3,0,0,0,3,3H9a3,3,0,0,0,3-3V47H26v2a4,4,0,0,0,4,4H56a4,4,0,0,0,4-4V15A4,4,0,0,0,56,11ZM38,11h1.24a1,1,0,0,0,.908-.581A3.126,3.126,0,0,1,43,9a3.151,3.151,0,0,1,2.864,1.426A1,1,0,0,0,46.77,11L48,11v2H38ZM26,35H14a2,2,0,0,1,2-2H26ZM10.266,17.368A2,2,0,0,1,12.162,16H26V26H7.387ZM2,25a1,1,0,0,1,1-1H4a1,1,0,0,1,1,1v1H3A1,1,0,0,1,2,25Zm8,24a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V47h6ZM3,45a1,1,0,0,1-1-1V31.133a1.01,1.01,0,0,1,.485-.859L6.277,28H26v3H16a4,4,0,0,0-4,4,2,2,0,0,0,2,2H26v3H15a1,1,0,0,0,0,2H26v3Zm55,4a2,2,0,0,1-2,2H30a2,2,0,0,1-2-2V15a2,2,0,0,1,2-2h6a2,2,0,0,0,2,2H48a2,2,0,0,0,2-2h6a2,2,0,0,1,2,2Z"
                  ></path>
                  <path
                    stroke-width="2"
                    d="M7,30a3,3,0,0,0-3,3v2a3,3,0,0,0,6,0V33A3,3,0,0,0,7,30Zm1,5a1,1,0,0,1-2,0V33a1,1,0,0,1,2,0Z"
                  ></path>
                  <path
                    stroke-width="2"
                    d="M38.168,18.445l-3.323,4.986-1.138-1.138a1,1,0,0,0-1.414,1.414l2,2A1,1,0,0,0,35,26c.032,0,.065,0,.1,0a1,1,0,0,0,.733-.44l4-6a1,1,0,1,0-1.664-1.11Z"
                  ></path>
                  <path
                    stroke-width="2"
                    d="M52,20H43a1,1,0,0,0,0,2h9a1,1,0,0,0,0-2Z"
                  ></path>
                  <path
                    stroke-width="2"
                    d="M43,26h5.818a1,1,0,0,0,0-2H43a1,1,0,0,0,0,2Z"
                  ></path>
                  <path
                    stroke-width="2"
                    d="M38.168,28.445l-3.323,4.986-1.138-1.138a1,1,0,0,0-1.414,1.414l2,2A1,1,0,0,0,35,36c.032,0,.065,0,.1-.005a1,1,0,0,0,.733-.44l4-6a1,1,0,1,0-1.664-1.11Z"
                  ></path>
                  <path
                    stroke-width="2"
                    d="M52,30H43a1,1,0,0,0,0,2h9a1,1,0,0,0,0-2Z"
                  ></path>
                  <path
                    stroke-width="2"
                    d="M43,36h5.818a1,1,0,0,0,0-2H43a1,1,0,0,0,0,2Z"
                  ></path>
                  <path
                    stroke-width="2"
                    d="M38.168,38.445l-3.323,4.986-1.138-1.138a1,1,0,0,0-1.414,1.414l2,2A1,1,0,0,0,35,46c.032,0,.065,0,.1-.005a1,1,0,0,0,.733-.44l4-6a1,1,0,1,0-1.664-1.11Z"
                  ></path>
                  <path
                    stroke-width="2"
                    d="M52,40H43a1,1,0,0,0,0,2h9a1,1,0,0,0,0-2Z"
                  ></path>
                  <path
                    stroke-width="2"
                    d="M48.818,44H43a1,1,0,0,0,0,2h5.818a1,1,0,0,0,0-2Z"
                  ></path>
                  <path
                    stroke-width="2"
                    d="M8,40H6a1,1,0,0,0,0,2H8a1,1,0,0,0,0-2Z"
                  ></path>
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
            <h3 class="text-xl font-semibold text-blue-800 mb-2">Car Order</h3>
            <p class="text-blue-500 text-sm">Car Order</p>
          </div>
        </div>

        <!-- 6. Expense graph Report -->
        <div
          @click="navigateTo('/home/product-sale-report')"
          class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-orange-100 hover:border-orange-300 transform hover:-translate-y-1"
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
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-chart-column-stacked-icon lucide-chart-column-stacked"
                >
                  <path d="M11 13H7" />
                  <path d="M19 9h-4" />
                  <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                  <rect x="15" y="5" width="4" height="12" rx="1" />
                  <rect x="7" y="8" width="4" height="9" rx="1" />
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
            <h3 class="text-xl font-semibold text-orange-800 mb-2">
              Product Sale Report
            </h3>
            <p class="text-orange-500 text-sm">product sale report</p>
          </div>
        </div>

        <!-- <SendMessage /> -->
      </div>
    </div>
  </Layout>
</template>

<script setup>
import Layout from "./Layout.vue";
import { useRouter } from "vue-router";
import SendMessage from "../views/Message.vue";

const router = useRouter();

const navigateTo = (path) => {
  router.push(path);
};
</script>
