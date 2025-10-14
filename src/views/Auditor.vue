<template>
  <div>
    <Layout :title="`Welcome back, ${authStore.user.name.split(' ')[0]}!`">
      <div>
        <div
          :class="isShowSidebar ? 'left-[250px]' : 'left-[100px]'"
          class="space-x-8 col-span-3 flex justify-start transistion-all duration-200 items-center gap-2 text-sm pb-4 absolute top-8"
        >
          <HomeFirstPartVue
            :title="'Account Receivable'"
            :isActive="homeSectionPartView == 'account-receivable'"
            @click="homeSectionPartView = 'account-receivable'"
          />
          <HomeFirstPartVue
            :title="'Cash Image Report'"
            :isActive="homeSectionPartView == 'cash-image-report'"
            @click="homeSectionPartView = 'cash-image-report'"
          />
        </div>
      </div>
      <div>
        <div
          class="col-span-3 w-full"
          v-if="homeSectionPartView == 'account-receivable'"
        >
          <AccountReceivable />
        </div>
        <div
          class="col-span-3 w-full"
          v-if="homeSectionPartView == 'cash-image-report'"
        >
          <CashImageReport />
        </div>
      </div>
    </Layout>
  </div>
</template>

<script setup>
import Layout from "./Layout.vue";
import { useAuthStore } from "../stores/auth";
import { useSidebarStore } from "../stores/sidebar";
import HomeFirstPartVue from "../components/HomeFirstPart.vue";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import AccountReceivable from "./Dashboard/AccountReceivable.vue";
import CashImageReport from "./Dashboard/CashImageReport.vue";

const sidebarStore = useSidebarStore();
const { isShowSidebar } = storeToRefs(sidebarStore);
const authStore = useAuthStore();

const homeSectionPartView = ref("account-receivable");
</script>
