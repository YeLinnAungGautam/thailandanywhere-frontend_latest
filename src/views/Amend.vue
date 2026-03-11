<script setup>
import { storeToRefs } from "pinia";
import Layout from "./Layout.vue";
import ListReservation from "./AmendComponent/ListAmend.vue";
import ReservationCartLoadingVue from "./Dashboard/ReservationCartLoading.vue";
import { onMounted, ref, watch, computed } from "vue";
import Pagination from "../components/PaginationExpense.vue";
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  XCircleIcon as XCircleOutline,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowsUpDownIcon,
} from "@heroicons/vue/24/outline";
import { XCircleIcon } from "@heroicons/vue/24/solid";
import ReservationDetail from "./AmendComponent/AmendDetail.vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter, useRoute } from "vue-router";
import { useAdminStore } from "../stores/admin";
import Modal from "../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { format } from "date-fns";
import { useSidebarStore } from "../stores/sidebar";
import { useAmendStore } from "../stores/amend";

// ── Stores ──────────────────────────────────────────────────────────────────
const sidebarStore = useSidebarStore();
const { isShowSidebar } = storeToRefs(sidebarStore);

const amendStore = useAmendStore();
const { amends, loading } = storeToRefs(amendStore);

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const adminStore = useAdminStore();
const router = useRouter();
const route = useRoute();

// ── Filter State ─────────────────────────────────────────────────────────────
const limit = ref(10);
const crmId = ref(""); // crm_id filter
const amendStatus = ref(""); // amend_status filter
const userFilter = ref(""); // user_id filter
const sale_daterange = ref(""); // daterange filter
const sorting = ref("desc");

// UI state
const filterShow = ref(false);
const softShow = ref(false);
const searchModel = ref(false);
const searchTime = ref("");
const showSide = ref(1);
const detailId = ref("");
const adminLists = ref([]);

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (datePut) => {
  const date = new Date(datePut);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const showFormat = (dateStr) => {
  if (!dateStr) return "";
  const singlePattern = /^\d{4}-\d{2}-\d{2}$/;
  const multiplePattern = /^(\d{4}-\d{2}-\d{2})(,\d{4}-\d{2}-\d{2})*$/;
  if (singlePattern.test(dateStr))
    return format(new Date(dateStr), "MMM dd, yyyy");
  if (multiplePattern.test(dateStr))
    return dateStr
      .split(",")
      .map((d) => format(new Date(d), "MMM dd"))
      .join(" → ");
  return dateStr;
};

// ── Computed: query params object ────────────────────────────────────────────
const watchSystem = computed(() => {
  const result = { limit: limit.value };

  // crm_id
  if (crmId.value) result.crm_id = crmId.value;

  // amend_status
  if (amendStatus.value) result.amend_status = amendStatus.value;

  // user_id
  if (userFilter.value) {
    result.user_id = userFilter.value;
  } else if (
    !authStore.isSuperAdmin &&
    !authStore.isReservation &&
    !authStore.isAuditor
  ) {
    result.user_id = user?.value?.id;
  }

  // daterange
  if (sale_daterange.value) result.daterange = sale_daterange.value;

  // sort
  result.order_by = "created_at";
  result.order_direction = sorting.value || "desc";

  return result;
});

// Active filter badge count
const searchCount = computed(() => {
  let count = 0;
  if (crmId.value) count++;
  if (amendStatus.value) count++;
  if (userFilter.value) count++;
  if (sale_daterange.value) count++;
  return count;
});

const userName = computed(() => {
  const found = adminLists.value.find((u) => u.id === userFilter.value);
  return found ? found.name : undefined;
});

// ── Status helpers ────────────────────────────────────────────────────────────
const amendStatusOptions = [
  { value: "", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
];

const statusColor = (val) => {
  if (val === "pending")
    return "bg-yellow-100 text-yellow-700 border-yellow-300";
  if (val === "approved") return "bg-green-100 text-green-700 border-green-300";
  if (val === "rejected") return "bg-red-100 text-red-700 border-red-300";
  return "bg-gray-100 text-gray-600 border-gray-300";
};

// ── Actions ──────────────────────────────────────────────────────────────────
const searchAction = async () => {
  filterShow.value = false;
  await amendStore.getListAction(watchSystem.value);
};

const changePage = async (url) => {
  await amendStore.getChangePage(url, watchSystem.value);
};

const clearFilter = () => {
  crmId.value = "";
  amendStatus.value = "";
  userFilter.value =
    authStore.isSuperAdmin || authStore.isReservation || authStore.isAuditor
      ? ""
      : user?.value?.id;
  sale_daterange.value = "";
  searchTime.value = "";
  sorting.value = "desc";
  filterShow.value = false;
  softShow.value = false;
  limit.value = 10;
  searchAction();
};

const getDetailAction = (id) => {
  detailId.value = id.id;
  if (detailId.value) {
    router.push("amend?id=" + detailId.value + "&crm_id=" + id.crm_id);
  }
};

const detailGetAction = (id) => getDetailAction(id);

const getListUser = async () => {
  try {
    const res = await adminStore.getSimpleListAction();
    adminLists.value = res.result.data
      .filter((item) => item.role === "admin")
      .map((item) => ({ id: item.id, name: item.name }));
  } catch (e) {
    console.error(e);
  }
};

// ── Watchers ─────────────────────────────────────────────────────────────────
watch(userFilter, () => searchAction());

watch(amendStatus, () => searchAction());

watch(
  searchTime,
  (newValue) => {
    if (!newValue) {
      sale_daterange.value = "";
      searchAction();
      searchModel.value = false;
      return;
    }
    const date = new Date(newValue);
    if (isNaN(date.getTime())) return;
    const pad = (n) => String(n).padStart(2, "0");
    sale_daterange.value = `${date.getFullYear()}-${pad(
      date.getMonth() + 1,
    )}-${pad(date.getDate())}`;
    searchAction();
    searchModel.value = false;
  },
  { immediate: true },
);

// ── Mount ─────────────────────────────────────────────────────────────────────
onMounted(async () => {
  if (route.query.id) detailId.value = route.query.id;
  // Pre-fill crm_id from URL if present
  if (route.query.crm_id) crmId.value = route.query.crm_id;
  await getListUser();
});
</script>

<template>
  <Layout :is_white="true">
    <!-- ── Page Header ── -->
    <div
      :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
      class="flex items-center gap-3 absolute top-6 transition-all duration-200"
    >
      <div class="flex items-center gap-2">
        <span class="w-1 h-7 bg-[#FF613c] rounded-full inline-block"></span>
        <p class="text-2xl font-semibold text-gray-800 tracking-tight">
          Amend Reservations
        </p>
      </div>
      <span
        v-if="route.query.crm_id"
        class="text-xs font-medium px-3 py-1 rounded-full bg-[#FF613c]/10 text-[#FF613c] border border-[#FF613c]/20"
      >
        {{ route.query.crm_id }}
      </span>
    </div>

    <!-- ── Main Grid ── -->
    <div class="grid gap-4 relative grid-cols-3">
      <!-- ══ LEFT PANEL: List ══ -->
      <transition name="slide">
        <div
          class="border shadow-sm rounded-xl px-4 py-3 bg-white"
          :class="{
            hidden: showSide == 2,
            'col-span-1': showSide == 1,
            'col-span-2': showSide == 3,
          }"
        >
          <!-- ── Toolbar ── -->
          <div class="pb-3 flex items-center gap-2 relative">
            <!-- Filter Button -->
            <button
              @click="
                () => {
                  filterShow = !filterShow;
                  softShow = false;
                }
              "
              class="relative flex items-center gap-1.5 bg-[#FF613c] hover:bg-[#e0522e] text-white text-xs px-3 py-1.5 rounded-lg shadow transition-colors"
            >
              <FunnelIcon class="w-4 h-4" />
              <span>Filter</span>
              <span
                v-if="searchCount > 0"
                class="absolute -top-1.5 -right-1.5 bg-white text-[#FF613c] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#FF613c]"
              >
                {{ searchCount }}
              </span>
            </button>

            <!-- Sort Button -->
            <button
              @click="
                () => {
                  softShow = !softShow;
                  filterShow = false;
                }
              "
              class="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 shadow-sm transition-colors"
              title="Sort"
            >
              <ArrowsUpDownIcon class="w-4 h-4 text-gray-500" />
            </button>

            <!-- CRM ID Search -->
            <div class="relative flex-1">
              <input
                type="search"
                v-model="crmId"
                @keyup.enter="searchAction"
                placeholder="Search CRM ID…"
                class="w-full pl-3 pr-8 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FF613c] text-xs shadow-sm"
              />
              <button
                @click="searchAction"
                class="absolute right-1 top-1/2 -translate-y-1/2 p-1 bg-[#FF613c] rounded-md"
              >
                <MagnifyingGlassIcon class="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            <!-- ── Filter Dropdown ── -->
            <transition name="dropdown">
              <div
                v-if="filterShow"
                class="absolute top-full mt-1 left-0 w-[280px] bg-white rounded-xl shadow-xl z-50 border border-gray-100 overflow-hidden"
              >
                <!-- Header -->
                <div
                  class="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-gray-50"
                >
                  <p class="text-xs font-semibold text-gray-700">Filters</p>
                  <button
                    @click="clearFilter"
                    class="text-[10px] text-[#FF613c] hover:underline font-medium"
                  >
                    Clear all
                  </button>
                </div>

                <div class="px-4 py-3 space-y-4 max-h-[60vh] overflow-y-auto">
                  <!-- Amend Status -->
                  <div>
                    <p
                      class="text-[10px] font-semibold text-gray-500 uppercase tracking-wider pb-1.5"
                    >
                      Amend Status
                    </p>
                    <div class="grid grid-cols-2 gap-1.5">
                      <button
                        v-for="opt in amendStatusOptions"
                        :key="opt.value"
                        @click="amendStatus = opt.value"
                        :class="[
                          'text-[10px] px-2 py-1.5 rounded-lg border font-medium transition-all',
                          amendStatus === opt.value
                            ? 'bg-[#FF613c] text-white border-[#FF613c]'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-[#FF613c] hover:text-[#FF613c]',
                        ]"
                      >
                        {{ opt.label }}
                      </button>
                    </div>
                  </div>

                  <!-- Date Filter -->
                  <div>
                    <p
                      class="text-[10px] font-semibold text-gray-500 uppercase tracking-wider pb-1.5"
                    >
                      Service Date
                    </p>
                    <Modal
                      :isOpen="searchModel"
                      @closeModal="searchModel = false"
                    >
                      <DialogPanel
                        class="w-full max-w-lg transform rounded-xl bg-white p-4 text-left shadow-xl transition-all"
                      >
                        <DialogTitle
                          as="div"
                          class="text-xs font-semibold text-gray-800 mb-4"
                        >
                          Select Service Date
                        </DialogTitle>
                        <VueDatePicker
                          v-model="searchTime"
                          multi-calendars
                          :format="'yyyy-MM-dd'"
                          placeholder="Service Date"
                          text-input
                        />
                      </DialogPanel>
                    </Modal>
                    <button
                      @click="searchModel = true"
                      class="w-full text-left text-[10px] text-gray-500 px-3 py-2 border border-gray-200 rounded-lg hover:border-[#FF613c] transition-colors"
                    >
                      <span
                        v-if="searchTime || sale_daterange"
                        class="text-[#FF613c] font-medium"
                      >
                        {{
                          showFormat(
                            searchTime
                              ? formatDate(searchTime)
                              : sale_daterange,
                          )
                        }}
                      </span>
                      <span v-else class="text-gray-400">Select date…</span>
                    </button>
                  </div>

                  <!-- Agent / User -->
                  <div>
                    <p
                      class="text-[10px] font-semibold text-gray-500 uppercase tracking-wider pb-1.5"
                    >
                      Agent / User
                    </p>
                    <select
                      v-model="userFilter"
                      class="w-full border border-gray-200 px-3 py-2 bg-white text-[10px] text-gray-600 rounded-lg focus:outline-none focus:border-[#FF613c]"
                    >
                      <option value="">All Users</option>
                      <option
                        v-for="admin in adminLists"
                        :key="admin.id"
                        :value="admin.id"
                      >
                        {{ admin.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Footer -->
                <div class="px-4 pb-4 pt-2 border-t border-gray-100">
                  <button
                    @click="searchAction"
                    class="w-full text-xs bg-[#FF613c] hover:bg-[#e0522e] text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </transition>

            <!-- ── Sort Dropdown ── -->
            <transition name="dropdown">
              <div
                v-if="softShow"
                class="absolute top-full mt-1 left-10 w-[220px] bg-white rounded-xl shadow-xl z-50 border border-gray-100 overflow-hidden"
              >
                <div
                  class="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-gray-50"
                >
                  <p class="text-xs font-semibold text-gray-700">Sort</p>
                  <button
                    @click="softShow = false"
                    class="text-[10px] text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <div class="px-4 py-3 space-y-2">
                  <p
                    class="text-[10px] font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Direction
                  </p>
                  <div class="grid grid-cols-2 gap-1.5">
                    <button
                      @click="sorting = 'desc'"
                      :class="[
                        'text-[10px] px-2 py-1.5 rounded-lg border font-medium transition-all',
                        sorting === 'desc'
                          ? 'bg-[#FF613c] text-white border-[#FF613c]'
                          : 'border-gray-200 text-gray-600 hover:border-[#FF613c]',
                      ]"
                    >
                      Newest First
                    </button>
                    <button
                      @click="sorting = 'asc'"
                      :class="[
                        'text-[10px] px-2 py-1.5 rounded-lg border font-medium transition-all',
                        sorting === 'asc'
                          ? 'bg-[#FF613c] text-white border-[#FF613c]'
                          : 'border-gray-200 text-gray-600 hover:border-[#FF613c]',
                      ]"
                    >
                      Oldest First
                    </button>
                  </div>
                </div>
                <div class="px-4 pb-4 border-t border-gray-100 pt-2">
                  <button
                    @click="
                      () => {
                        searchAction();
                        softShow = false;
                      }
                    "
                    class="w-full text-xs bg-[#FF613c] hover:bg-[#e0522e] text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    Apply Sort
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <!-- ── Active Filter Tags ── -->
          <div
            v-if="searchCount > 0 || sale_daterange || crmId"
            class="flex items-center flex-wrap gap-1.5 pb-2.5"
          >
            <!-- CRM ID tag -->
            <span
              v-if="crmId"
              class="flex items-center gap-1 text-[10px] bg-orange-50 text-[#FF613c] border border-orange-200 px-2 py-0.5 rounded-full"
            >
              CRM: {{ crmId }}
              <XCircleIcon
                class="w-3.5 h-3.5 cursor-pointer"
                @click="
                  () => {
                    crmId = '';
                    searchAction();
                  }
                "
              />
            </span>

            <!-- Amend Status tag -->
            <span
              v-if="amendStatus"
              :class="[
                'flex items-center gap-1 text-[10px] border px-2 py-0.5 rounded-full capitalize',
                statusColor(amendStatus),
              ]"
            >
              {{ amendStatus }}
              <XCircleIcon
                class="w-3.5 h-3.5 cursor-pointer"
                @click="
                  () => {
                    amendStatus = '';
                    searchAction();
                  }
                "
              />
            </span>

            <!-- User tag -->
            <span
              v-if="userName"
              class="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full"
            >
              {{ userName }}
              <XCircleIcon
                class="w-3.5 h-3.5 cursor-pointer"
                @click="
                  () => {
                    userFilter = '';
                    searchAction();
                  }
                "
              />
            </span>

            <!-- Date tag -->
            <span
              v-if="sale_daterange"
              class="flex items-center gap-1 text-[10px] bg-purple-50 text-purple-600 border border-purple-200 px-2 py-0.5 rounded-full"
            >
              {{ showFormat(sale_daterange) }}
              <XCircleIcon
                class="w-3.5 h-3.5 cursor-pointer"
                @click="
                  () => {
                    sale_daterange = '';
                    searchTime = '';
                    searchAction();
                  }
                "
              />
            </span>

            <!-- Clear all -->
            <button
              @click="clearFilter"
              class="text-[10px] text-gray-400 hover:text-red-500 px-2 py-0.5 rounded-full border border-gray-200 hover:border-red-300 transition-colors"
            >
              Clear all
            </button>
          </div>

          <!-- ── Stats Bar ── -->
          <div class="flex items-center justify-between pb-2.5">
            <!-- Quick date filters -->
            <div class="flex items-center gap-3 text-[10px]">
              <button
                v-for="qf in [
                  { key: 'today', label: 'Today' },
                  { key: 'tomorrow', label: 'Tomorrow' },
                ]"
                :key="qf.key"
                @click="
                  () => {
                    const d = new Date();
                    if (qf.key === 'tomorrow') d.setDate(d.getDate() + 1);
                    searchTime = formatDate(d);
                  }
                "
                class="text-gray-500 hover:text-[#FF613c] transition-colors"
              >
                {{ qf.label }}
              </button>
            </div>

            <!-- Total count -->
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-[#FF613c]"></span>
              <span class="text-[10px] font-semibold text-gray-700">
                {{ amends?.meta?.total ?? 0 }} amendments
              </span>
            </div>
          </div>

          <!-- ── List ── -->
          <div
            v-if="!loading"
            class="bg-white rounded-xl divide-y divide-gray-100 max-h-[60vh] overflow-y-auto border border-gray-100"
          >
            <div
              v-for="i in amends?.data ?? []"
              :key="i.id"
              class="hover:bg-orange-50/40 transition-colors"
            >
              <ListReservation
                :data="i"
                :detailId="detailId"
                @detailId="detailGetAction"
              />
            </div>
            <div
              v-if="(amends?.data ?? []).length === 0"
              class="py-12 text-center text-xs text-gray-400"
            >
              No amendments found
            </div>
          </div>

          <!-- Loading Skeleton -->
          <div
            v-if="loading"
            class="bg-white rounded-xl divide-y divide-gray-200 max-h-[60vh] overflow-y-auto border border-gray-100"
          >
            <div v-for="i in 8" :key="i">
              <ReservationCartLoadingVue />
            </div>
          </div>

          <!-- ── Pagination ── -->
          <div class="overflow-x-auto pt-2">
            <Pagination
              v-if="!loading"
              :data="amends"
              @change-page="changePage"
            />
          </div>
        </div>
      </transition>

      <!-- ══ RIGHT PANEL: Detail ══ -->
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
          <!-- Panel toggle chevrons -->
          <div class="absolute -top-4 -left-0 z-20">
            <button
              v-if="showSide == 1"
              @click="showSide = 2"
              class="w-6 h-6 bg-white shadow-md border border-gray-200 p-1.5 rounded-full hover:bg-gray-50 transition-colors"
            >
              <ChevronLeftIcon class="w-full h-full" />
            </button>
            <button
              v-if="showSide == 2"
              @click="showSide = 1"
              class="w-6 h-6 bg-white shadow-md border border-gray-200 p-1.5 rounded-full hover:bg-gray-50 transition-colors"
            >
              <ChevronRightIcon class="w-full h-full" />
            </button>
          </div>
          <div class="absolute -top-4 -left-10 z-20">
            <button
              v-if="showSide == 1"
              @click="showSide = 3"
              class="w-6 h-6 bg-white shadow-md border border-gray-200 p-1.5 rounded-full hover:bg-gray-50 transition-colors"
            >
              <ChevronRightIcon class="w-full h-full" />
            </button>
            <button
              v-if="showSide == 3"
              @click="showSide = 1"
              class="w-6 h-6 bg-white shadow-md border border-gray-200 p-1.5 rounded-full hover:bg-gray-50 transition-colors"
            >
              <ChevronLeftIcon class="w-full h-full" />
            </button>
          </div>

          <div class="rounded-xl h-[85vh] overflow-y-auto no-scrollbar">
            <ReservationDetail :show="showSide" />
          </div>
        </div>
      </transition>
    </div>
  </Layout>
</template>

<style scoped>
/* Slide animation for panels */
.slide-enter-active {
  animation: slideIn 0.25s ease-out;
}
.slide-leave-active {
  animation: slideOut 0.25s ease-in;
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

/* Dropdown animation */
.dropdown-enter-active {
  animation: dropIn 0.15s ease-out;
}
.dropdown-leave-active {
  animation: dropIn 0.15s ease-in reverse;
}
@keyframes dropIn {
  from {
    transform: translateY(-6px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Hide scrollbar */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
