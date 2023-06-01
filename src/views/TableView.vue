<script setup>
import Layout from "./Layout.vue";
import { ref } from "vue";
</script>

<template>
  <Layout>
    <div class="mb-5">
      <h3 class="text-2xl font-medium text-gray-600">Tables</h3>
    </div>
    <div class="bg-white/60 p-4 rounded-lg shadow-sm mb-5">
      <h4 class="text-gray-600 font-medium mb-3 text-base">Default Table</h4>
      <div class="overflow-auto rounded-lg shadow">
        <table class="w-full">
          <thead class="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th class="w-20 p-3 text-sm font-medium tracking-wide text-left">
                No.
              </th>
              <th class="p-3 text-sm font-medium tracking-wide text-left">
                Detail
              </th>
              <th class="w-30 p-3 text-sm font-medium tracking-wide text-left">
                Date
              </th>
              <th class="w-30 p-3 text-sm font-medium tracking-wide text-left">
                Status
              </th>
              <th class="w-32 p-3 text-sm font-medium tracking-wide text-left">
                Total
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr class="bg-white">
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                <a
                  href="#"
                  class="font-bold text-blue-500 hover:underline underline-offset-4"
                  >00001</a
                >
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis,
                vero!
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                16/10/2023
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                <span
                  class="p-1.5 px-2 text-xs font-medium uppercase tracking-wide text-green-800 bg-green-200 rounded-lg bg-opacity-50"
                  >Done</span
                >
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                Lorem, ipsum.
              </td>
            </tr>
            <tr class="bg-gray-50">
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                <a
                  href="#"
                  class="font-bold text-blue-500 hover:underline underline-offset-4"
                  >00002</a
                >
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis,
                vero!
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                16/10/2023
              </td>

              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                <span
                  class="p-1.5 px-2 text-xs font-medium uppercase tracking-wide text-yellow-800 bg-yellow-200 rounded-lg bg-opacity-50"
                  >Pending</span
                >
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                Lorem, ipsum.
              </td>
            </tr>
            <tr class="bg-white">
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                <a
                  href="#"
                  class="font-bold text-blue-500 hover:underline underline-offset-4"
                  >00003</a
                >
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis,
                vero!
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                16/10/2023
              </td>

              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                <span
                  class="p-1.5 px-2 text-xs font-medium uppercase tracking-wide text-red-800 bg-red-200 rounded-lg bg-opacity-50"
                  >Rejected</span
                >
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                Lorem, ipsum.
              </td>
            </tr>
            <tr class="bg-gray-50">
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                <a
                  href="#"
                  class="font-bold text-blue-500 hover:underline underline-offset-4"
                  >00004</a
                >
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis,
                vero!
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                16/10/2023
              </td>

              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                <span
                  class="p-1.5 px-2 text-xs font-medium uppercase tracking-wide text-green-800 bg-green-200 rounded-lg bg-opacity-50"
                  >Done</span
                >
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                Lorem, ipsum.
              </td>
            </tr>
            <tr class="bg-white">
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                <a
                  href="#"
                  class="font-bold text-blue-500 hover:underline underline-offset-4"
                  >00005</a
                >
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis,
                vero!
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                16/10/2023
              </td>

              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                <span
                  class="p-1.5 px-2 text-xs font-medium uppercase tracking-wide text-yellow-800 bg-yellow-200 rounded-lg bg-opacity-50"
                  >Pending</span
                >
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                Lorem, ipsum.
              </td>
            </tr>
            <tr class="bg-gray-50">
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                <a
                  href="#"
                  class="font-bold text-blue-500 hover:underline underline-offset-4"
                  >00006</a
                >
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis,
                vero!
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                16/10/2023
              </td>

              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                <span
                  class="p-1.5 px-2 text-xs font-medium uppercase tracking-wide text-red-800 bg-red-200 rounded-lg bg-opacity-50"
                  >Rejected</span
                >
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                Lorem, ipsum.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Layout>
</template>
