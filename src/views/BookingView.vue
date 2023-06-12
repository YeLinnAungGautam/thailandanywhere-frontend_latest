<script setup>
import Layout from "./Layout.vue";
import { ref } from "vue";
import Button from "../components/Button.vue";
import Input from "../components/Input.vue";
import InputField from "../components/InputField.vue";
import Pagination from "../components/Pagination.vue";
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  TicketIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  UsersIcon,
  DocumentCheckIcon,
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
</script>

<template>
  <Layout>
    <div class="mb-5">
      <h3 class="text-2xl font-medium text-gray-600">Bookings</h3>
    </div>
    <div class="grid grid-cols-1 gap-2 md:grid-cols-4 md:gap-5">
      <div class="bg-white/60 p-4 rounded-lg shadow-sm mb-5">
        <h4 class="text-gray-600 font-medium mb-8 text-base">
          Customer Booking Form
        </h4>
        <form action="" class="space-y-8 mb-5">
          <InputField label="Name" required>
            <Input type="text" />
          </InputField>
          <InputField label="Email address" required>
            <Input type="email" />
          </InputField>
          <InputField label="Phone Number" required>
            <Input type="text" />
          </InputField>
          <InputField label="Date" required>
            <Input type="date" />
          </InputField>
          <InputField label="Address" required>
            <textarea
              rows="5"
              placeholder="Enter address"
              class="peer w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-600 placeholder-transparent"
            />
          </InputField>
        </form>
        <div class="text-center">
          <Button :left-icon="DocumentCheckIcon" class="text-sm"
            >Book New
          </Button>
        </div>
      </div>
      <div
        class="bg-white/60 p-6 rounded-lg shadow-sm mb-5 md:col-span-3 hidden md:block"
      >
        <!-- search input sort filter -->
        <div class="flex items-center justify-between mb-5">
          <div>
            <p class="inline-block mr-2 text-gray-500 font-medium">Show</p>
            <select
              class="border-2 p-2 rounded-md w-16 focus:outline-none focus:ring-0"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
            </select>
            <p class="inline-block ml-2 text-gray-500 font-medium">entries</p>
          </div>
          <div class="">
            <input
              type="text"
              class="w-3/5 sm:w-3/5 md:w-[300px] mr-3 border px-4 py-2 rounded-md shadow focus:ring-0 focus:outline-none text-gray-500"
              placeholder="Search for bookings.."
            />
          </div>
        </div>
        <div class="overflow-auto rounded-lg shadow mb-5">
          <table class="w-full">
            <thead class="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th
                  class="w-20 p-3 text-sm font-medium tracking-wide text-left"
                >
                  No.
                </th>
                <th
                  class="w-30 p-3 text-sm font-medium tracking-wide text-left"
                >
                  Image
                </th>
                <th class="p-3 text-sm font-medium tracking-wide text-left">
                  Name
                </th>
                <th class="p-3 text-sm font-medium tracking-wide text-left">
                  Name (Burmese)
                </th>
                <th class="p-3 text-sm font-medium tracking-wide text-left">
                  SKU
                </th>
                <th
                  class="w-30 p-3 text-sm font-medium tracking-wide text-left"
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
                  <img :src="r.image" class="w-14 h-12 rounded-lg" alt="" />
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
                      class="hover:bg-blue-500 p-2 bg-white text-blue-500 transition shadow rounded hover:text-white"
                    >
                      <EyeIcon class="w-5 h-5" />
                    </button>
                    <button
                      class="hover:bg-yellow-500 p-2 bg-white text-blue-500 transition shadow rounded hover:text-white"
                    >
                      <PencilSquareIcon class="w-5 h-5" />
                    </button>
                    <button
                      class="hover:bg-red-500 p-2 bg-white text-blue-500 transition shadow rounded hover:text-white"
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