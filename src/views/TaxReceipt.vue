<template>
  <Layout :is_white="true">
    <div
      :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
      class="space-x-8 col-span-3 flex justify-start items-center transition-all duration-200 gap-2 text-sm pb-4 absolute top-6"
    >
      <p class="text-3xl font-medium text-[#FF613c]">
        Tax Receipts
        <span class="w-2 h-2 bg-[#FF613c] rounded-full inline-block"></span>
        <!-- <span class="pl-2">{{ route.query.id }}</span> -->
      </p>
    </div>
    <div class="grid gap-4 relative grid-cols-3">
      <transition name="slide">
        <div
          class="border shadow-sm rounded-lg p-4"
          :class="{
            hidden: showSide == 2,
            'col-span-1': showSide == 1,
            'col-span-2': showSide == 3,
          }"
        >
          <div class="pb-4 flex justify-start items-center gap-x-3 relative">
            <div
              @click="
                () => {
                  filterShow = !filterShow;
                  softShow = false;
                }
              "
              class="bg-blue-600 px-2 rounded-lg shadow py-1 flex justify-center items-center gap-x-2 text-white text-xs cursor-pointer"
            >
              <FunnelIcon class="w-5 h-5 text-white" />
              <p>Filter</p>
              <p>{{ searchCount }}</p>
            </div>
            <transition name="slide">
              <div
                v-if="filterShow"
                class="absolute top-full px-4 left-0 w-[300px] transition-all duration-150 bg-white rounded-lg shadow-lg z-50 border border-gray-100 space-y-2 max-h-[50vh] overflow-y-scroll overflow-x-hidden"
              >
                <div
                  class="flex justify-between items-center pt-4 border-b border-gray-100 pb-1 sticky top-0 bg-white"
                >
                  <p class="text-xs font-medium">Filter</p>

                  <p class="text-[10px] cursor-pointer" @click="clearFilter">
                    clear
                  </p>
                </div>
                <p class="text-[10px] pt-1">Product Type</p>
                <div class="">
                  <div
                    class="flex items-center justify-start gap-1 overflow-x-scroll no-sidebar-container"
                  >
                    <p
                      class="text-[10px] px-2 cursor-pointer hover:bg-[#ff613c] hover:text-white hover:shadow-md py-1 border whitespace-nowrap border-gray-200 rounded-lg"
                      @click="searchValue('App\\Models\\EntranceTicket')"
                      :class="
                        search == 'App\\Models\\EntranceTicket'
                          ? 'bg-[#ff613c] text-white'
                          : ''
                      "
                    >
                      Entrance Ticket
                    </p>
                  </div>
                </div>

                <div
                  class="sticky bottom-0 w-full pb-4 pt-2 border-t border-gray-200 bg-white"
                >
                  <p
                    class="text-[12px] bg-[#FF613c] px-2 py-2 rounded-lg text-center text-white cursor-pointer"
                    @click="searchAction"
                  >
                    Search
                  </p>
                </div>
              </div>
            </transition>
            <div
              class="bg-white shadow rounded-full border border-gray-100 p-2"
              @click="
                () => {
                  softShow = !softShow;
                  filterShow = false;
                }
              "
            >
              <ArrowsUpDownIcon class="w-3 h-3" />
            </div>
            <transition name="slide">
              <div
                v-if="softShow"
                class="absolute top-full pb-3 px-4 left-0 w-[250px] transition-all duration-150 bg-white rounded-lg shadow-lg z-50 border border-gray-100 space-y-2 max-h-[70vh] overflow-y-scroll"
              >
                <div
                  class="flex justify-between items-center pt-4 border-b border-gray-100 pb-1 sticky top-0 bg-white"
                >
                  <p class="text-xs font-medium">Sort</p>
                  <!-- <XCircleIcon
                    class="w-6 h-6 text-[#FF613c] cursor-pointer"
                    @click="softShow = !softShow"
                  /> -->
                  <p
                    class="text-[10px] cursor-pointer"
                    @click="
                      () => {
                        softShow = !softShow;
                        filterShow = false;
                      }
                    "
                  >
                    clear
                  </p>
                </div>
                <div class="space-y-1">
                  <div class="flex justify-between items-center">
                    <p class="text-[10px]">Sort By</p>
                    <select
                      name=""
                      id=""
                      v-model="sorting"
                      class="border border-gray-300 px-4 focus:outline-none bg-gray-50 text-gray-400 w-[50%] py-2 text-[10px] rounded-lg"
                    >
                      <option class="text-[10px]" value="desc">
                        Last to First
                      </option>
                      <option class="text-[10px]" value="asc">
                        First to Last
                      </option>
                    </select>
                  </div>
                </div>
                <div
                  @click="
                    () => {
                      searchAction();
                      softShow = !softShow;
                      filterShow = false;
                    }
                  "
                  class="bg-[#FF613c] text-white px-1.5 cursor-pointer inline-block rounded-lg text-sm w-full py-1.5 text-center"
                >
                  sort
                </div>
              </div>
            </transition>
            <div class="relative w-full">
              <input
                type="search"
                name=""
                v-model="searchId"
                placeholder="Search CRM ID"
                class="w-full px-4 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                id=""
              />
              <div
                @click="searchAction"
                class="absolute right-1 top-1 rounded-lg text-xs p-1 bg-[#FF613c]"
              >
                <MagnifyingGlassIcon class="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <div
            class="flex justify-start items-center overflow-x-scroll no-sidebar-container pt-0.5 space-x-3 pb-2"
          >
            <p
              @click="clearFilter"
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap bg-red-500 text-white cursor-pointer"
            >
              clear
            </p>
            <p
              v-if="search == 'App\\Models\\PrivateVanTour'"
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap"
            >
              Van Tour
            </p>
            <p
              v-if="search == 'App\\Models\\EntranceTicket'"
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap"
            >
              Attraction
            </p>
            <p
              v-if="search == 'App\\Models\\Airline'"
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap"
            >
              Airline
            </p>
          </div>

          <div
            v-if="!loading"
            class="bg-white shadow rounded-lg divide-y divide-gray-100 max-h-[65vh] overflow-y-scroll"
          >
            <div
              class=""
              v-for="i in taxReceipts?.data ?? []"
              :key="i"
              @click="getDetailAction(i.id)"
            >
              <ListTax :data="i" />
            </div>
          </div>
          <div class="overflow-x-scroll no-sidebar-container py-2">
            <Pagination
              v-if="!loading"
              :data="taxReceipts"
              @change-page="changePage"
            />
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
      </transition>

      <transition name="slide">
        <div
          @click="
            () => {
              filterShow = false;
              softShow = false;
            }
          "
          class="relative"
          :class="{
            'col-span-2': showSide == 1,
            'col-span-1': showSide == 3,
            'col-span-3': showSide == 2,
          }"
        >
          <div class="absolute -top-4 -left-0 z-20">
            <ChevronLeftIcon
              class="w-6 cursor-pointer h-6 bg-white shadow-md border border-gray-200 p-1.5 rounded-full"
              @click="showSide = 2"
              v-if="showSide == 1"
            />
            <ChevronRightIcon
              class="w-6 cursor-pointer h-6 bg-white shadow-md border border-gray-200 p-1.5 rounded-full"
              @click="showSide = 1"
              v-if="showSide == 2"
            />
          </div>
          <div class="absolute -top-4 -left-10 z-20">
            <ChevronRightIcon
              class="w-6 cursor-pointer h-6 bg-white shadow-md border border-gray-200 p-1.5 rounded-full"
              @click="showSide = 3"
              v-if="showSide == 1"
            />
            <ChevronLeftIcon
              class="w-6 cursor-pointer h-6 bg-white shadow-md border border-gray-200 p-1.5 rounded-full"
              @click="showSide = 1"
              v-if="showSide == 3"
            />
          </div>

          <div
            class="border shadow-sm relative rounded-lg p-4 h-[85vh] transition duration-150 overflow-y-scroll no-scrollbar"
          >
            <TaxDetail :show="showSide" />
          </div>
        </div>
      </transition>
    </div>
  </Layout>
</template>

<script setup>
import Layout from "./Layout.vue";
import Modal from "../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { onMounted, ref } from "vue";
import Pagination from "../components/PaginationExpense.vue";
import {
  ArrowDownTrayIcon,
  ArrowsUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import { useTaxReceiptStore } from "../stores/taxReceipt";
import { storeToRefs } from "pinia";
import ReservationCartLoadingVue from "./Dashboard/ReservationCartLoading.vue";
import TaxDetail from "./TaxComponent/TaxDetail.vue";
import { useRoute, useRouter } from "vue-router";
import { useSidebarStore } from "../stores/sidebar";
import ListTax from "./TaxComponent/ListTax.vue";

const showSide = ref(1);
const filterShow = ref(false);
const router = useRouter();
const route = useRoute();
const softShow = ref(false);
const search = ref("");
const taxReceiptStore = useTaxReceiptStore();
const { taxReceipts, loading } = storeToRefs(taxReceiptStore);
const sidebarStore = useSidebarStore();
const { isShowSidebar } = storeToRefs(sidebarStore);
const searchId = ref("");

const searchValue = (val) => {
  search.value = val;
};

const searchAction = () => {
  console.log("searchAction", search.value, searchId.value);
};

const clearFilter = () => {
  filterShow.value = false;
};

const getAllAction = async () => {
  await taxReceiptStore.getListAction();
};

const getDetailAction = (id) => {
  console.log("getDetailAction", id);

  router.push({
    name: "TaxReceipt",
    query: {
      id: id,
    },
  });
};

const changePage = async (url) => {
  await taxReceiptStore.getChangePage(url);
};

onMounted(async () => {
  await getAllAction();
  console.log("====================================");
  console.log("taxReceipts", taxReceipts.value);
  console.log("====================================");
});
</script>

<style scoped>
/* Slide-in and slide-out animations */
.slide-enter-active {
  animation: slideIn 0.3s ease-out;
}

.slide-leave-active {
  animation: slideOut 0.3s ease-in;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}
</style>
