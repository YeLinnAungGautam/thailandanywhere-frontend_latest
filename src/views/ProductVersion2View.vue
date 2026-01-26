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
    count: "124",
    icon: "../../public/van-svgrepo-com.svg",
    routeName: "products",
    params: { id: 0 },
    bgColor: "bg-orange-500",
    iconColor: "text-white",
  },
  {
    id: 1,
    title: "Group Tours",
    count: "124",
    icon: "../../public/group-svgrepo-com.svg",
    routeName: "products",
    params: { id: 1 },
    bgColor: "bg-orange-600",
    iconColor: "text-white",
  },
  {
    id: 2,
    title: "Hotels",
    count: "124",
    icon: "../../public/holiday-hotel-tourism-svgrepo-com.svg",
    routeName: "hotel-v2",
    params: { id: 2 },
    bgColor: "bg-orange-500",
    iconColor: "text-white",
  },
  {
    id: 3,
    title: "Rooms",
    count: "124",
    icon: "../../public/holiday-hotel-tourism-svgrepo-com.svg",
    routeName: "products",
    params: { id: 3 },
    bgColor: "bg-orange-500",
    iconColor: "text-white",
  },
  {
    id: 4,
    title: "Airlines",
    count: "124",
    icon: "../../public/airline-boarding-pass-flight-svgrepo-com.svg",
    routeName: "products",
    params: { id: 4 },
    bgColor: "bg-orange-500",
    iconColor: "text-white",
  },
  {
    id: 5,
    title: "Airline Tickets",
    count: "124",
    icon: "../../public/airline-boarding-pass-flight-svgrepo-com.svg",
    routeName: "products",
    params: { id: 5 },
    bgColor: "bg-orange-500",
    iconColor: "text-white",
  },
  {
    id: 6,
    title: "Attractions",
    count: "124",
    icon: "../../public/favorite-place-svgrepo-com.svg",
    routeName: "attraction-v2",
    params: { id: 6 },
    bgColor: "bg-orange-500",
    iconColor: "text-white",
  },
  {
    id: 7,
    title: "Entrance Tickets",
    count: "124",
    icon: "../../public/favorite-place-svgrepo-com.svg",
    routeName: "products",
    params: { id: 7 },
    bgColor: "bg-orange-500",
    iconColor: "text-white",
  },
  {
    id: 8,
    title: "Restaurants",
    count: "124",
    icon: "../../public/restaurant-svgrepo-com.svg",
    routeName: "products",
    params: { id: 8 },
    bgColor: "bg-orange-500",
    iconColor: "text-white",
  },
  {
    id: 9,
    title: "Meals",
    count: "124",
    icon: "../../public/restaurant-svgrepo-com.svg",
    routeName: "products",
    params: { id: 9 },
    bgColor: "bg-orange-500",
    iconColor: "text-white",
  },
  {
    id: 10,
    title: "Inclusive",
    count: "124",
    icon: "https://cdn-icons-png.flaticon.com/128/5793/5793406.png",
    routeName: "products",
    params: { id: 10 },
    bgColor: "bg-orange-500",
    iconColor: "text-white",
  },
]);

// Handle card click
const navigateToProduct = (card) => {
  router.push({
    name: card.routeName,
    params: card.params,
    query: { ...route.query }, // Preserve existing query parameters
  });
};

// Check if current route matches card
const isActiveCard = (cardId) => {
  return parseInt(route.params.id) === cardId;
};
</script>

<template>
  <Layout>
    <div class="p-6">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Products</h1>
        <p class="text-gray-600 mt-2">Manage all your products in one place</p>
      </div>

      <!-- Grid Container -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <!-- Product Cards -->
        <div
          v-for="card in productCards"
          :key="card.id"
          @click="navigateToProduct(card)"
          :class="[
            'bg-white rounded-2xl shadow-lg  p-6 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl border-2',
            isActiveCard(card.id) 
              ? 'border-[#FF5B00] ring-2 ring-[#FF5B00]/20' 
              : 'border-transparent hover:border-[#FF5B00]/30'
          ]"
        >
          <div class="flex flex-col items-center justify-center space-y-4">
            <div 
              :class="[
                'w-20 h-20 rounded-2xl flex items-center justify-center transition-colors duration-300',
                isActiveCard(card.id) ? 'bg-[#FF5B00]' : card.bgColor
              ]"
            >
              <img
                :src="card.icon"
                :class="[
                  'w-12 h-12 p-2 rounded-lg',
                  isActiveCard(card.id) ? 'bg-white' : ''
                ]"
                :alt="card.title"
              />
            </div>
            
            <!-- Content -->
            <div class="text-center">
              <h3 
                :class="[
                  'text-2xl font-bold transition-colors duration-300',
                  isActiveCard(card.id) ? 'text-[#FF5B00]' : 'text-gray-800'
                ]"
              >
                {{ card.count }}
              </h3>
              <p class="text-sm text-gray-600 mt-1">{{ card.title }}</p>
            </div>
            
            <!-- Status Indicator -->
            <div class="flex items-center space-x-2 mt-2">
              <span 
                :class="[
                  'w-2 h-2 rounded-full',
                  isActiveCard(card.id) ? 'bg-[#FF5B00]' : 'bg-green-500'
                ]"
              ></span>
              <span class="text-xs text-gray-500">
                {{ isActiveCard(card.id) ? 'Active' : 'Available' }}
              </span>
            </div>
          </div>
          
          <!-- Hover Indicator -->
          <div 
            :class="[
              'absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300',
              'hover:opacity-100 bg-gradient-to-br from-[#FF5B00]/5 to-transparent'
            ]"
          ></div>
        </div>

        <!-- Add New Product Card -->
        <!-- <div
          @click="router.push({ name: 'add-product' })"
          class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl border-2 border-dashed border-gray-300 hover:border-[#FF5B00]"
        >
          <div class="flex flex-col items-center justify-center space-y-4 h-full">
            <div class="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center group-hover:bg-[#FF5B00]/10 transition-colors duration-300">
              <svg
                class="w-10 h-10 text-gray-400 group-hover:text-[#FF5B00] transition-colors duration-300"
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
            </div>
            <div class="text-center">
              <h3 class="text-lg font-semibold text-gray-700">Add New</h3>
              <p class="text-xs text-gray-500 mt-1">Create new product</p>
            </div>
          </div>
        </div> -->
      </div>

      <!-- Quick Stats -->
      <!-- <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Total Products</p>
              <h3 class="text-2xl font-bold text-gray-800 mt-2">1,364</h3>
            </div>
            <div class="p-3 bg-orange-100 rounded-lg">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Active Products</p>
              <h3 class="text-2xl font-bold text-gray-800 mt-2">1,124</h3>
            </div>
            <div class="p-3 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Categories</p>
              <h3 class="text-2xl font-bold text-gray-800 mt-2">11</h3>
            </div>
            <div class="p-3 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </Layout>
</template>

<style scoped>
/* Smooth transition effects */
.card-enter-active,
.card-leave-active {
  transition: all 0.3s ease;
}

.card-enter-from,
.card-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>