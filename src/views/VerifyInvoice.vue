<template>
  <Layout :is_white="true" class="relative">
    <div class="">
      <div
        :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
        class="space-x-8 col-span-3 flex justify-start items-center transition-all duration-200 gap-2 text-sm pb-4 absolute top-6"
      >
        <p
          class="text-2xl flex justify-start items-center font-medium text-[#FF613c]"
        >
          Verify Invoice
          <span
            class="w-2 h-2 mx-3 bg-[#FF613c] rounded-full inline-block"
          ></span>
          <span>March</span>
          <span
            class="w-2 h-2 mx-3 bg-[#FF613c] rounded-full inline-block"
          ></span>
          <span>2025</span>
        </p>
      </div>
      <div class="w-full overflow-hidden">
        <ReservationList />
      </div>
      <div class="flex justify-start items-center gap-x-2 py-4">
        <p
          class="border border-gray-200 rounded-lg text-xs px-4 py-1.5 w-1/4 text-center"
        >
          Sales
        </p>
        <p
          class="border border-gray-200 rounded-lg text-xs px-4 py-1.5 w-1/4 text-center"
        >
          Expense
        </p>
      </div>
      <div class="grid grid-cols-3 col-span-2 gap-x-4">
        <div
          class="flex justify-start items-center border-y border-gray-200 py-2 pr-4 mr-4 overflow-x-scroll no-sidebar-container"
        >
          <div
            v-for="i in 20 ?? []"
            :key="i"
            class="rounded-lg px-2 py-1 mx-1"
            :class="i == 2 ? 'text-[#FF613c] font-semibold' : ''"
          >
            <p class="whitespace-nowrap text-xs">HN-{{ i }}00</p>
          </div>
        </div>
        <div class="flex justify-between items-center col-span-2">
          <p class="text-lg font-medium">Expense</p>
          <div class="flex justify-between items-center">
            <div class="flex justify-start items-center gap-x-2">
              <p class="px-3 py-1 text-xs bg-red-500 text-white rounded-lg">
                Raise Issue
              </p>
              <p class="px-3 py-1 text-xs bg-green-500 text-white rounded-lg">
                Verify
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-3 pt-5 gap-x-4">
        <div class="col-span-1 grid grid-cols-3 gap-2">
          <div class="space-y-2 rounded-lg overflow-y-auto h-[400px]">
            <div class="" v-for="i in 5" :key="i">
              <img
                src="https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE="
                alt=""
              />
            </div>
          </div>
          <img
            class="col-span-2 w-full h-auto overflow-hidden rounded-lg"
            src="https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE="
            alt=""
          />
        </div>
        <div class="col-span-2">
          <div class="p-3 rounded-lg border border-gray-200">
            <VerifyExpense />
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useSidebarStore } from "../stores/sidebar";
import Layout from "./Layout.vue";
import ReservationList from "./VerifyInvoiceComponent/ReservationList.vue";
import VerifyExpense from "./VerifyInvoiceComponent/VerifyExpense.vue";

const siderBarStore = useSidebarStore();
const { isShowSidebar } = storeToRefs(siderBarStore);
</script>
