<script setup>
import Layout from "./Layout.vue";
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useSidebarStore } from "../stores/sidebar";

const router = useRouter();
const route = useRoute();
const sidebarStore = useSidebarStore();

// Grid card data
const productCards = ref([
  {
    id: 0,
    title: "Van Tours",
    count: "...",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-van-icon lucide-van"><path d="M13 6v5a1 1 0 0 0 1 1h6.102a1 1 0 0 1 .712.298l.898.91a1 1 0 0 1 .288.702V17a1 1 0 0 1-1 1h-3"/><path d="M5 18H3a1 1 0 0 1-1-1V8a2 2 0 0 1 2-2h12c1.1 0 2.1.8 2.4 1.8l1.176 4.2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>`,
    routeName: "products",
    params: { id: 0 },
    gradient: "from-orange-400 to-orange-600",
    lightBg: "bg-orange-50",
    accentColor: "text-orange-600",
  },

  {
    id: 2,
    title: "Hotels",
    count: "...",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bed-double-icon lucide-bed-double"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M12 4v6"/><path d="M2 18h20"/></svg>`,
    routeName: "hotel-v2",
    params: { id: 2 },
    gradient: "from-blue-400 to-blue-600",
    lightBg: "bg-blue-50",
    accentColor: "text-blue-600",
  },

  {
    id: 4,
    title: "Airlines",
    count: "...",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plane-icon lucide-plane"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`,
    routeName: "products",
    params: { id: 4 },
    gradient: "from-indigo-400 to-indigo-600",
    lightBg: "bg-indigo-50",
    accentColor: "text-indigo-600",
  },

  {
    id: 6,
    title: "Attractions",
    count: "...",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ferris-wheel-icon lucide-ferris-wheel"><circle cx="12" cy="12" r="2"/><path d="M12 2v4"/><path d="m6.8 15-3.5 2"/><path d="m20.7 7-3.5 2"/><path d="M6.8 9 3.3 7"/><path d="m20.7 17-3.5-2"/><path d="m9 22 3-8 3 8"/><path d="M8 22h8"/><path d="M18 18.7a9 9 0 1 0-12 0"/></svg>`,
    routeName: "attraction-v2",
    params: { id: 6 },
    gradient: "from-pink-400 to-pink-600",
    lightBg: "bg-pink-50",
    accentColor: "text-pink-600",
  },

  {
    id: 8,
    title: "Restaurants",
    count: "...",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-utensils-icon lucide-utensils"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`,
    routeName: "products",
    params: { id: 8 },
    gradient: "from-amber-400 to-amber-600",
    lightBg: "bg-amber-50",
    accentColor: "text-amber-600",
  },

  {
    id: 10,
    title: "Inclusive",
    count: "...",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-earth-lock-icon lucide-earth-lock"><path d="M7 3.34V5a3 3 0 0 0 3 3"/><path d="M11 21.95V18a2 2 0 0 0-2-2 2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05"/><path d="M21.54 15H17a2 2 0 0 0-2 2v4.54"/><path d="M12 2a10 10 0 1 0 9.54 13"/><path d="M20 6V4a2 2 0 1 0-4 0v2"/><rect width="8" height="5" x="14" y="6" rx="1"/></svg>`,
    routeName: "products",
    params: { id: 10 },
    gradient: "from-emerald-400 to-emerald-600",
    lightBg: "bg-emerald-50",
    accentColor: "text-emerald-600",
  },
]);

// Handle card click
const navigateToProduct = (card) => {
  router.push({
    name: card.routeName,
    params: card.params,
    query: { ...route.query },
  });
};

// Check if current route matches card
const isActiveCard = (cardId) => {
  return parseInt(route.params.id) === cardId;
};
</script>

<template>
  <Layout>
    <div
      class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50"
    >
      <div class="p-8">
        <!-- Page Header with Stats Bar -->
        <div class="mb-10">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h1 class="text-4xl font-bold text-gray-900 mb-2">
                Product Management
              </h1>
              <p class="text-gray-500 text-sm">
                Manage and organize all your products efficiently
              </p>
            </div>

            <!-- Quick Action Button -->
            <!-- <button
              class="group relative px-6 py-3 bg-gradient-to-r from-[#FF5B00] to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <div class="flex items-center gap-2">
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span>Add New Product</span>
              </div>
              <div
                class="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity"
              ></div>
            </button> -->
          </div>

          <!-- Stats Overview -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div
              class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">
                    Total Products
                  </p>
                  <h3 class="text-3xl font-bold text-gray-900">0,000</h3>
                  <p
                    class="text-xs text-green-600 mt-1 flex items-center gap-1"
                  >
                    <svg
                      class="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    +12% from last month
                  </p>
                </div>
                <div
                  class="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div
              class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">Active</p>
                  <h3 class="text-3xl font-bold text-gray-900">0,000</h3>
                  <p class="text-xs text-gray-500 mt-1">82.4% of total</p>
                </div>
                <div
                  class="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div
              class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">
                    Categories
                  </p>
                  <h3 class="text-3xl font-bold text-gray-900">6</h3>
                  <p class="text-xs text-gray-500 mt-1">Different types</p>
                </div>
                <div
                  class="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div
              class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">Pending</p>
                  <h3 class="text-3xl font-bold text-gray-900">0</h3>
                  <p class="text-xs text-orange-600 mt-1">Needs attention</p>
                </div>
                <div
                  class="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            Product Categories
          </h2>
        </div>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        >
          <!-- Product Cards -->
          <div
            v-for="card in productCards"
            :key="card.id"
            @click="navigateToProduct(card)"
            class="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden"
            :class="[
              isActiveCard(card.id)
                ? 'border-[#FF5B00] ring-4 ring-[#FF5B00]/10 shadow-lg'
                : 'border-gray-100 hover:border-gray-200',
            ]"
          >
            <!-- Background Gradient Overlay -->
            <div
              class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              :class="[
                isActiveCard(card.id) ? 'opacity-100' : '',
                `bg-gradient-to-br ${card.gradient}`,
              ]"
              style="opacity: 0.03"
            ></div>

            <!-- Card Content -->
            <div
              class="relative p-6 flex flex-col items-center justify-center space-y-4"
            >
              <!-- Icon Container -->
              <div class="relative">
                <div
                  class="w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  :class="[
                    isActiveCard(card.id)
                      ? `bg-gradient-to-br ${card.gradient}`
                      : `${card.lightBg} group-hover:bg-gradient-to-br group-hover:${card.gradient}`,
                  ]"
                >
                  <!-- <img
                    :src="card.icon"
                    class="w-10 h-10 transition-all duration-300"
                    :alt="card.title"
                  /> -->
                  <div v-html="card.icon"></div>
                </div>

                <!-- Active Indicator Badge -->
                <div
                  v-if="isActiveCard(card.id)"
                  class="absolute -top-1 -right-1 w-6 h-6 bg-[#FF5B00] rounded-full flex items-center justify-center border-2 border-white shadow-md"
                >
                  <svg
                    class="w-3 h-3 text-black"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <!-- Count -->
              <div class="text-center">
                <h3
                  class="text-3xl font-bold transition-colors duration-300"
                  :class="[
                    isActiveCard(card.id)
                      ? 'text-[#FF5B00]'
                      : `text-gray-800 group-hover:${card.accentColor}`,
                  ]"
                >
                  {{ card.count }}
                </h3>
                <p class="text-sm text-gray-600 mt-1 font-medium">
                  {{ card.title }}
                </p>
              </div>

              <!-- Status Badge -->
              <div
                class="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-300"
                :class="[
                  isActiveCard(card.id)
                    ? 'bg-[#FF5B00]/10 text-[#FF5B00]'
                    : `${card.lightBg} ${card.accentColor} group-hover:bg-opacity-100`,
                ]"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full"
                  :class="[
                    isActiveCard(card.id) ? 'bg-[#FF5B00]' : 'bg-green-500',
                  ]"
                ></span>
                <span>{{
                  isActiveCard(card.id) ? "Active Now" : "Available"
                }}</span>
              </div>
            </div>

            <!-- Bottom Accent Line -->
            <div
              class="absolute bottom-0 left-0 right-0 h-1 transition-all duration-300"
              :class="[
                isActiveCard(card.id)
                  ? `bg-gradient-to-r ${card.gradient}`
                  : 'bg-gray-100 group-hover:bg-gradient-to-r group-hover:' +
                    card.gradient,
              ]"
            ></div>
          </div>
        </div>

        <!-- Empty State or Additional Info -->
        <div class="mt-12 text-center">
          <div
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
            <span>Click on any category to manage products</span>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style scoped>
/* Card animations */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-enter-active {
  animation: slideInUp 0.3s ease-out;
}

/* Smooth gradient transitions */
.group:hover .bg-gradient-to-br {
  animation: gradient 3s ease infinite;
}

@keyframes gradient {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #ff5b00;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #e05530;
}

/* Pulse animation for active cards */
@keyframes pulse-border {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(255, 91, 0, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(255, 91, 0, 0);
  }
}

.border-\[\#FF5B00\].ring-4 {
  animation: pulse-border 2s infinite;
}
</style>
