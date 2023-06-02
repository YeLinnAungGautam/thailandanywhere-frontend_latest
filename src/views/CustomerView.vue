<script setup>
import Layout from "./Layout.vue";
import Input from "../components/Input.vue";
import InputField from "../components/InputField.vue";
import Pagination from "../components/Pagination.vue";
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  TicketIcon,
  BuildingOfficeIcon,
  SquaresPlusIcon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/vue/24/outline";
import { ref } from "vue";
import Button from "../components/Button.vue";

const form = ref({
  name: "",
  email: "",
  password: "",
  phone: "",
});

const data = ref([
  {
    id: 1,
    name: "Kyaw Kyaw",
    email: "kyawkyaw@gmail.com",
    phone: "+91 9999999999",
    address: "Yangon",
  },
  {
    id: 2,
    name: "Mg Mg",
    email: "mgmg@gmail.com",
    phone: "+91 9999999999",
    address: "Yangon",
  },
  {
    id: 3,
    name: "Aye Aye",
    email: "ayeaye@gmail.com",
    phone: "+91 9999999999",
    address: "Mandalay",
  },
  {
    id: 4,
    name: "Zaw Zaw",
    email: "zawzaw@gmail.com",
    phone: "+91 9999999999",
    address: "Naypyidaw",
  },
]);
</script>

<template>
  <Layout>
    <div class="mb-5 flex items-center justify-between">
      <h3 class="text-2xl font-medium text-gray-600">Customers</h3>
    </div>
    <div class="bg-white/60 p-6 rounded-lg shadow-sm mb-5">
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
            placeholder="Search for customers.."
          />
        </div>
      </div>
      <div class="overflow-auto rounded-lg shadow mb-5">
        <table class="w-full">
          <thead class="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th class="w-20 p-3 text-sm font-medium tracking-wide text-left">
                No.
              </th>
              <th class="w-30 p-3 text-sm font-medium tracking-wide text-left">
                Name
              </th>
              <th class="p-3 text-sm font-medium tracking-wide text-left">
                Email
              </th>
              <th class="p-3 text-sm font-medium tracking-wide text-left">
                Phone
              </th>
              <th class="p-3 text-sm font-medium tracking-wide text-left">
                Address
              </th>
              <th class="w-30 p-3 text-sm font-medium tracking-wide text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="r in data" :key="r.id" class="bg-white even:bg-gray-50  hover:bg-gray-50">
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                {{ r.id }}
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                {{ r.name }}
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                {{ r.email }}
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                {{ r.phone }}
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                {{ r.address }}
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
  </Layout>
</template>
