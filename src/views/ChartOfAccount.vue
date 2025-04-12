<script setup>
import { storeToRefs } from "pinia";
import { useSidebarStore } from "../stores/sidebar";
import Layout from "./Layout.vue";
import AccountanceHeader from "../components/AccountanceHeader.vue";

const sideBarStore = useSidebarStore();
const { isShowSidebar } = storeToRefs(sideBarStore);

</script>

<template>
    <Layout :is_white="true" class=" relative">
        <div
          :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
          class="space-x-8 col-span-3 flex justify-start items-center transition-all duration-200 gap-2 text-sm pb-4 absolute top-6"
        >
          <p class="text-3xl font-medium text-[#FF613c]">
            Chart Of Account
            <span class="w-2 h-2 bg-[#FF613c] rounded-full inline-block"></span>
          </p>
        </div>

        <!-- header -->
        <div>
            <AccountanceHeader/>
        </div>
        
        <div class=" grid grid-cols-3 gap-4">
            <div class="overflow-x-auto col-span-2">
              <table
                class="w-full text-sm text-left text-gray-500 mb-4 dark:text-gray-400 rounded overflow-hidden"
              >
                <thead
                  class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-[#FF613c] dark:text-gray-100"
                >
                  <tr>
                    <th
                      scope="col"
                      class="px-3 py-3 border-l border-gray-50/20"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3 border-l border-gray-50/20"
                    >
                      Account Head
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3 border-l border-gray-50/20"
                    >
                      
                    </th>
                    
                  </tr>
                </thead>

                <tbody class="border border-gray-400/20">
                  <tr
                    v-for="item in 3"
                    :key="item"
                    class="border border-gray-400/20 even:bg-gray-50"
                  >
                    <td
                      scope="col"
                      class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                    >
                      {{ item }}
                    </td>
                    <td
                      scope="col"
                      class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                    >
                      {{ item }}
                    </td>
                    <td
                      scope="col"
                      class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                    >
                      {{ item }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
                <div class=" col-span-1 p-4 rounded-lg shadow">
                    <div class=" space-y-2">
                        <label for="" class=" text-[11px]">Account Head</label>
                        <input type="text" class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs" placeholder="name of account head">
                    </div>
                    <div class="mt-4">
                        <button class="bg-[#FF613c] text-white px-4 py-2 text-xs w-full rounded-lg">Save</button>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>


