<script setup>
import Layout from "./Layout.vue";
import { ref } from "vue";
import Button from "../components/Button.vue";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import Pagination from "../components/Pagination.vue";
import { useAuthStore } from "../stores/auth";
import {
  PencilSquareIcon,
  TrashIcon,
  ShareIcon,
  EyeIcon,
  TicketIcon,
  BuildingOfficeIcon,
  PlusIcon,
  UserGroupIcon,
  UsersIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/vue/24/outline";
const data = ref([
  {
    id: 1,
    image: "https://chatbot.thanywhere.com/uploads/products/1677472922891.jpeg",
    name: "Ayutthaya Sunset Package",
    mm_name: "လှပညနေခင်းပက်ကေ့ချ်",
    sku: "AYU-001",
  },
  {
    id: 2,
    image: "https://chatbot.thanywhere.com/uploads/products/1677476324730.jpeg",
    name: "Ayutthaya Historical Package",
    mm_name: "သမိုင်းဝင်ပက်ကေ့ချ်",
    sku: "AYU-002",
  },
  {
    id: 3,
    image: "https://chatbot.thanywhere.com/uploads/products/1677476415179.jpeg",
    name: "Ayutthaya Package 3",
    mm_name: "အယုဒ္ဓယပက်ကေ့ချ် ၃",
    sku: "AYU-003",
  },
  {
    id: 4,
    image: "https://chatbot.thanywhere.com/uploads/products/1681893057800.jpg",
    name: "Ayutthaya Package 4",
    mm_name: "အယုဒ္ဓယပက်ကေ့ချ် ၄",
    sku: "AYU-004",
  },
  {
    id: 5,
    image: "https://chatbot.thanywhere.com/uploads/products/1681965261552.jpeg",
    name: "Ayutthaya & Nakhon Nayok",
    mm_name: "အယုဒ္ဓယ နှင့် နခွန်နယွတ် ပက်ကေ့ချ်",
    sku: "AYU-005",
  },
  {
    id: 6,
    image: "https://chatbot.thanywhere.com/uploads/products/1677477095220.jpeg",
    name: "Nakhon Nayok Treasure Package",
    mm_name: "နခွန်နယွတ် ရတနာသိုက်ပက်ကေ့ချ်",
    sku: "AYU-006",
  },
  {
    id: 7,
    image: "https://chatbot.thanywhere.com/uploads/products/1677477242299.jpeg",
    name: "Khao Yai Package 1",
    mm_name: "ခေါင်ရိုင်ပက်ကေ့ချ် ၁",
    sku: "KOH-006",
  },
  {
    id: 8,
    image: "https://chatbot.thanywhere.com/uploads/products/1680766296123.jpg",
    name: "Khao Yai Package 2",
    mm_name: "ခေါင်ရိုင်ပက်ကေ့ချ် ၂",
    sku: "KOH-002",
  },
  {
    id: 9,
    image: "https://chatbot.thanywhere.com/uploads/products/1680766512600.jpg",
    name: "Khao Yai Package 3",
    mm_name: "ခေါင်ရိုင်ပက်ကေ့ချ် ၃",
    sku: "KOH-003",
  },
  {
    id: 10,
    image: "https://chatbot.thanywhere.com/uploads/products/1680772637255.jpg",
    name: "Khao Yai Package 4",
    mm_name: "ခေါင်ရိုင်ပက်ကေ့ချ် ၄",
    sku: "KOH-004",
  },
]);

const authStore = useAuthStore();
</script>

<template>
  <Layout>
    <div class="">
      <div class="flex items-center justify-between gap-3 mb-3">
        <div class="w-full p-6 rounded-lg shadow-sm bg-white/60">
          <div>
            <h3 class="mb-1 text-xl font-medium tracking-wide text-gray-600">
              Sales
            </h3>
            <p
              class="text-3xl font-medium tracking-wide text-blue-500 font-roboto"
            >
              35
            </p>
          </div>
        </div>
        <div class="w-full p-6 rounded-lg shadow-sm bg-white/60">
          <div>
            <h3 class="mb-1 text-xl font-medium tracking-wide text-gray-600">
              Enquires
            </h3>
            <p
              class="text-3xl font-medium tracking-wide text-blue-500 font-roboto"
            >
              350
            </p>
          </div>
        </div>
        <div class="w-full p-6 rounded-lg shadow-sm bg-white/60">
          <div>
            <h3 class="mb-1 text-xl font-medium tracking-wide text-gray-600">
              SE Ratio
            </h3>
            <p
              class="text-3xl font-medium tracking-wide text-blue-500 font-roboto"
            >
              0.1
            </p>
          </div>
        </div>
        <div class="w-full p-6 rounded-lg shadow-sm bg-white/60">
          <div>
            <h3 class="mb-1 text-xl font-medium tracking-wide text-gray-600">
              Bonus
            </h3>
            <p
              class="text-3xl font-medium tracking-wide text-blue-500 font-roboto"
            >
              15.0k
            </p>
          </div>
        </div>
      </div>
      <div
        class="hidden p-6 mb-5 rounded-lg shadow-sm bg-white/60 md:col-span-3 md:block"
      >
        <!-- search input sort filter -->
        <div class="flex items-center justify-between mb-8">
          <div class="">
            <input
              type="text"
              class="w-3/5 sm:w-3/5 md:w-[300px] mr-3 border px-4 py-2 rounded-md shadow-sm focus:ring-0 focus:outline-none text-gray-500"
              placeholder="Search Sales..."
            />
            <input
              type="text"
              class="px-4 py-2 mr-3 text-gray-500 border rounded-md shadow-sm focus:ring-0 focus:outline-none"
            />
            <input
              type="text"
              class="px-4 py-2 mr-3 text-gray-500 border rounded-md shadow-sm focus:ring-0 focus:outline-none"
            />
            <AdjustmentsHorizontalIcon
              class="inline-block w-6 h-6 mx-2 text-gray-600 cursor-pointer"
            />
          </div>
          <div class="space-x-3">
            <Button :leftIcon="ShareIcon" intent="text"> Export </Button>
            <Button :leftIcon="PlusIcon"> Create Sale </Button>
          </div>
        </div>
        <div class="mb-5 overflow-auto rounded-lg shadow">
          <table class="w-full">
            <thead class="border-b-2 border-gray-200 bg-gray-50">
              <tr>
                <th
                  class="w-20 p-3 text-sm font-medium tracking-wide text-left"
                >
                  No.
                </th>
                <th class="p-3 text-sm font-medium tracking-wide text-left">
                  Customer Name
                </th>
                <th class="p-3 text-sm font-medium tracking-wide text-left">
                  Deal Stage
                </th>
                <th class="p-3 text-sm font-medium tracking-wide text-left">
                  SKU
                </th>
                <th
                  class="p-3 text-sm font-medium tracking-wide text-left w-30"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="r in data"
                :key="r.id"
                class="bg-white even:bg-gray-50 hover:bg-gray-50"
              >
                <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                  {{ r.id }}
                </td>
                <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                  {{ r.name }}
                </td>
                <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                  {{ r.mm_name }}
                </td>
                <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                  {{ r.sku }}
                </td>
                <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <button
                      class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-blue-500 hover:text-white"
                    >
                      <EyeIcon class="w-5 h-5" />
                    </button>
                    <button
                      class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                    >
                      <PencilSquareIcon class="w-5 h-5" />
                    </button>
                    <button
                      v-if="authStore.isSuperAdmin"
                      class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-red-500 hover:text-white"
                    >
                      <TrashIcon class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- pagination -->
        <Pagination />
      </div>
    </div>
  </Layout>
</template>
