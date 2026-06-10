<template>
  <Layout>
    <div
      :class="isShowSidebar ? 'left-[200px]' : 'left-[100px]'"
      class="space-y-1 transition-all duration-200 gap-2 text-sm pb-4 absolute top-4"
    >
      <div class="text-xl font-semibold text-[#FF613c]">Vantour Management</div>
      <p class="text-gray-800 font-light text-xs">
        Manage vantour graph, assign & accountance.
      </p>
    </div>

    <!-- header -->
    <div class="flex justify-start items-center gap-x-2">
      <div
        class="border-2 p-4 rounded-lg space-y-1"
        :class="
          part == 'graph' ? 'border-[#FF613c] bg-orange-50' : 'border-gray-300'
        "
        @click="part = 'graph'"
      >
        <p :class="part == 'graph' ? 'text-[#FF613c] font-semibold' : ''">
          Graph
        </p>
        <p class="text-xs">Graph of vantour</p>
      </div>
      <div
        class="border-2 p-4 rounded-lg space-y-1"
        :class="
          part == 'assign' ? 'border-[#FF613c] bg-orange-50' : 'border-gray-300'
        "
        @click="part = 'assign'"
      >
        <p :class="part == 'assign' ? 'text-[#FF613c] font-semibold' : ''">
          Assign Driver
        </p>
        <p class="text-xs">Fill Data & Assign Driver</p>
      </div>
      <div
        class="border-2 p-4 rounded-lg space-y-1"
        :class="
          part == 'accountance'
            ? 'border-[#FF613c] bg-orange-50'
            : 'border-gray-300'
        "
        @click="part = 'accountance'"
      >
        <p :class="part == 'accountance' ? 'text-[#FF613c] font-semibold' : ''">
          Accountance item
        </p>
        <p class="text-xs">Accountance of vantour</p>
      </div>
      <div
        class="border-2 p-4 rounded-lg space-y-1"
        :class="
          part == 'accountance_group'
            ? 'border-[#FF613c] bg-orange-50'
            : 'border-gray-300'
        "
        @click="part = 'accountance_group'"
      >
        <p
          :class="
            part == 'accountance_group' ? 'text-[#FF613c] font-semibold' : ''
          "
        >
          Accountance Group
        </p>
        <p class="text-xs">Accountance of vantour</p>
      </div>
    </div>

    <div class="pt-4">
      <div v-if="part == 'graph'">
        <GraphVan />
      </div>
      <div v-if="part == 'assign'">
        <AssignVan />
      </div>
      <div v-if="part == 'accountance'">
        <VanAccountance
          :preFilter="assignFilter"
          @clear-filter="assignFilter = null"
        />
      </div>
      <div v-if="part == 'accountance_group'">
        <VanAccountanceGroup @route-to-date="handleRouteToDate" />
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { storeToRefs } from "pinia";
import AssignVan from "../components/homeReservation/AssignVan.vue";
import { useSidebarStore } from "../stores/sidebar";
import Layout from "./Layout.vue";
import { ref } from "vue";
import GraphVan from "../components/homeReservation/GraphVan.vue";
import VanAccountance from "../components/homeReservation/VanAccountance.vue";
import VanAccountanceGroup from "../components/homeReservation/VanAccountanceGroup.vue";

const sidebarStore = useSidebarStore();
const { isShowSidebar } = storeToRefs(sidebarStore);

const part = ref("graph");

const assignFilter = ref(null); // { supplier_id, date }

const handleRouteToDate = ({ supplier_id, date }) => {
  assignFilter.value = { supplier_id, date };
  part.value = "accountance";
};
</script>
