<script setup>
import { storeToRefs } from "pinia";
import { useReservationStore } from "../stores/reservation";
import Layout from "./Layout.vue";
import ListReservation from "./Reservation2Component/ListReservation.vue";
import ReservationCartLoadingVue from "./Dashboard/ReservationCartLoading.vue";
import { onMounted } from "vue";
import { ArrowsUpDownIcon, FunnelIcon } from "@heroicons/vue/24/outline";
import ReservationDetail from "./Reservation2Component/ReservationDetail.vue";
const reservationStore = useReservationStore();
const { reservations, loading } = storeToRefs(reservationStore);

onMounted(async () => {
  await reservationStore.getListAction();
  console.log(reservations.value);
});
</script>

<template>
  <Layout :is_white="true">
    <div class="grid grid-cols-3 gap-4">
      <div class="border shadow-sm rounded-lg p-4">
        <div class="pb-4 flex justify-start items-center gap-x-3">
          <div
            class="bg-blue-600 px-2 rounded-lg shadow py-1 flex justify-center items-center gap-x-2 text-white text-xs"
          >
            <FunnelIcon class="w-5 h-5 text-white" />
            <p>Filter</p>
            <p>2</p>
          </div>
          <div class="bg-white shadow rounded-full border border-gray-100 p-2">
            <ArrowsUpDownIcon class="w-3 h-3" />
          </div>
          <input
            type="search"
            name=""
            placeholder="Search CRM ID"
            class="w-full px-4 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
            id=""
          />
        </div>
        <div
          v-if="!loading"
          class="bg-white shadow rounded-lg divide-y divide-gray-100 max-h-[75vh] overflow-y-scroll"
        >
          <div class="" v-for="i in reservations?.data ?? []" :key="i">
            <ListReservation :data="i" />
          </div>
        </div>
        <div
          v-if="loading"
          class="bg-white shadow rounded-lg divide-y-4 divide-gray-200 max-h-[75vh] overflow-y-scroll"
        >
          <div class="" v-for="i in 10 ?? []" :key="i">
            <ReservationCartLoadingVue />
          </div>
        </div>
      </div>
      <div
        class="col-span-2 border shadow-sm rounded-lg p-4 h-[85vh] overflow-y-scroll"
      >
        <ReservationDetail />
      </div>
    </div>
  </Layout>
</template>
