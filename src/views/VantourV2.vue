<template>
  <Layout>
    <div class="mb-5 w-full flex gap-x-6 items-center">
      <button
        @click="$router.push('/products')"
        class="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-50"
      >
        <svg
          class="w-5 h-5 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <div class="text-xl font-semibold">Van Tours</div>
      <div class="flex-1"></div>
      <div
        v-if="!authStore.isAgent"
        @click="router.push('/vantour-v2')"
        class="pl-3 pr-4 py-2.5 bg-[#FF5B00] text-white cursor-pointer rounded-lg hover:bg-[#ff4400] transition-colors"
      >
        <div class="flex items-center gap-2 text-sm">
          <PlusCircleIcon class="w-5 h-5" /> Create Van Tour
        </div>
      </div>
    </div>

    <div>
      <div
        class="hidden p-6 mb-5 rounded-lg shadow-sm bg-white/60 md:col-span-3 md:block"
      >
        <div class="flex justify-between items-center mb-5">
          <div class="flex gap-4">
            <div
              class="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-5 w-48"
            >
              <div class="flex items-center gap-2 mb-1">
                <span class="text-2xl font-medium text-black-800">{{
                  totalCount
                }}</span>
              </div>
              <p class="text-sm text-black-500">Total Van Tours</p>
            </div>

            <div
              class="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-5 w-48"
            >
              <div class="flex items-center gap-2 mb-1">
                <span class="text-2xl font-medium text-black-800">{{
                  displayedCount
                }}</span>
              </div>
              <p class="text-sm text-black-500">Search Result</p>
            </div>
          </div>
        </div>

        <div class="flex gap-6">
          <!-- Sidebar filter -->
          <div class="w-80 flex-shrink-0 h-[calc(100vh-100px)] overflow-y-auto">
            <div
              class="bg-white rounded-2xl shadow-lg p-5 pb-7 h-full sticky top-6 border border-gray-200"
            >
              <div class="mb-6 mt-2">
                <div class="relative">
                  <input
                    type="text"
                    v-model="search"
                    @input="onSearchInput"
                    placeholder="Search van tours..."
                    class="w-full px-4 py-2.5 pr-10 text-sm border border-gray-200 rounded-full focus:ring-2 focus:ring-[#FF5B00]/40 focus:outline-none"
                  />
                  <svg
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#FF5B00]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
              </div>

              <div class="flex items-center justify-between mb-5 border-b pb-3">
                <h4 class="text-md font-semibold text-gray-700">Filter</h4>
                <div class="flex items-center gap-2">
                  <span
                    v-if="filterCount > 0"
                    class="text-xs bg-[#ff613c] text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {{ filterCount }}
                  </span>
                  <button
                    @click="clearAllFilters"
                    class="text-xs text-gray-400 hover:text-[#FF5B00]"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <!-- Type -->
              <div class="mb-5 border-b pb-4">
                <div class="flex justify-between items-center mb-2">
                  <h5 class="text-xs font-semibold text-gray-600">Type</h5>
                  <button @click="showType = !showType">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4 text-gray-400 transition-transform"
                      :class="{ 'rotate-180': !showType }"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                </div>

                <div v-if="showType" class="space-y-1">
                  <label
                    class="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-50 rounded-md p-2"
                    :class="
                      selectedType === '' ? 'text-[#FF5B00]' : 'text-black'
                    "
                    @click="selectType('')"
                  >
                    <input
                      type="radio"
                      :checked="selectedType === ''"
                      class="accent-[#FF5B00]"
                    />
                    All Types
                  </label>

                  <label
                    v-for="t in typeOptions"
                    :key="t.value"
                    class="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-50 rounded-md p-2"
                    :class="
                      selectedType === t.value ? 'text-[#FF5B00]' : 'text-black'
                    "
                    @click="selectType(t.value)"
                  >
                    <input
                      type="radio"
                      :checked="selectedType === t.value"
                      class="accent-[#FF5B00]"
                    />
                    {{ t.label }}
                  </label>
                </div>
              </div>

              <!-- Cities -->
              <div class="">
                <div class="flex justify-between items-center mb-2">
                  <h5 class="text-xs font-semibold text-gray-600">Cities</h5>
                  <button @click="showCities = !showCities">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4 text-gray-400 transition-transform"
                      :class="{ 'rotate-180': !showCities }"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                </div>

                <div
                  v-if="showCities"
                  class="space-y-1 max-h-[380px] overflow-y-auto pr-1"
                >
                  <label
                    class="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-50 rounded-md p-2"
                    :class="
                      selectedCity === '' ? 'text-[#FF5B00]' : 'text-black'
                    "
                    @click="selectCity('')"
                  >
                    <input
                      type="radio"
                      :checked="selectedCity === ''"
                      class="accent-[#FF5B00]"
                    />
                    All Cities
                  </label>

                  <label
                    v-for="city in citiesList"
                    :key="city.id"
                    class="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-50 rounded-md p-2"
                    :class="
                      selectedCity === city.id ? 'text-[#FF5B00]' : 'text-black'
                    "
                    @click="selectCity(city.id)"
                  >
                    <input
                      type="radio"
                      :checked="selectedCity === city.id"
                      class="accent-[#FF5B00]"
                    />
                    {{ city.name }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- List -->
          <div class="flex-1">
            <div v-if="!loading" class="bg-white rounded-lg shadow">
              <div class="overflow-auto rounded-lg shadow">
                <div class="grid grid-cols-7 gap-2 bg-gray-100">
                  <div
                    class="py-3 text-xs font-medium tracking-wide text-center"
                  >
                    No.
                  </div>
                  <div class="py-3 text-xs font-medium tracking-wide">Name</div>
                  <div class="py-3 text-xs font-medium tracking-wide">
                    SKU Code
                  </div>
                  <div class="py-3 text-xs font-medium tracking-wide">Type</div>
                  <div class="py-3 text-xs font-medium tracking-wide">
                    Cities
                  </div>
                  <div class="py-3 text-xs font-medium tracking-wide">
                    Cars / Price
                  </div>
                  <div
                    class="py-3 text-xs font-medium tracking-wide text-center"
                  >
                    Actions
                  </div>
                </div>

                <div>
                  <div
                    v-for="vt in displayedVantours"
                    :key="vt.id"
                    class="grid grid-cols-7 gap-2 bg-white even:bg-gray-50 py-3 border-b border-gray-100"
                  >
                    <div
                      class="flex justify-center items-center text-xs text-gray-700"
                    >
                      {{ vt.id }}
                    </div>
                    <div
                      class="flex items-center text-xs text-gray-700 overflow-hidden truncate"
                    >
                      {{ vt.name }}
                    </div>
                    <div class="flex items-center text-xs text-gray-700">
                      {{ vt.sku_code || "-" }}
                    </div>
                    <div class="flex items-center text-xs text-gray-700">
                      {{ vt.type || "-" }}
                    </div>
                    <div
                      class="flex items-center text-xs text-gray-700 truncate"
                    >
                      {{
                        vt.cities && vt.cities.length
                          ? vt.cities.map((c) => c.name).join(", ")
                          : "-"
                      }}
                    </div>
                    <div class="text-xs text-gray-700 space-y-1 py-1">
                      <p v-for="car in vt.cars" :key="car.car_id">
                        {{ car.name }}
                        <span v-if="!authStore.isAgent"
                          >- {{ car.price }} B</span
                        >
                      </p>
                      <p v-if="!vt.cars || vt.cars.length === 0">-</p>
                    </div>
                    <div class="flex items-center justify-center gap-2">
                      <button
                        v-if="!authStore.isAgent"
                        @click="goEditPage(vt.id)"
                        class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                      >
                        <PencilSquareIcon class="w-4 h-4" />
                      </button>
                      <button
                        v-if="authStore.isSuperAdmin"
                        @click="onDeleteHandler(vt.id)"
                        class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-red-500 hover:text-white"
                      >
                        <TrashIcon class="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div
                    v-if="displayedVantours.length === 0"
                    class="text-center py-16 text-gray-500 text-sm"
                  >
                    No van tours found
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="flex flex-col items-center justify-center py-20">
              <div
                class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#FF5B00] border-r-transparent"
              ></div>
              <p class="mt-4 text-gray-600">Loading van tours...</p>
            </div>

            <div class="pt-3">
              <Pagination
                v-if="!loading && vantours?.data?.length > 0"
                :data="vantours"
                @change-page="changePage"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import {
  PencilSquareIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/vue/24/outline";
import Pagination from "../components/Pagination.vue";
import Layout from "./Layout.vue";
import { useSidebarStore } from "../stores/sidebar";
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";

import { useAuthStore } from "../stores/auth";
import { useCityStore } from "../stores/city";
// ASSUMPTION: no dedicated route-plan store existed in the codebase shared with me.
// This mirrors useFacilityStore's shape (a `routePlans` state + `getListAction()`),
// backed by an assumed `/route-plans` endpoint. See stores/routePlan.js — rename/adjust
// to match your real store or endpoint if it's different.
import { useRoutePlanStore } from "../stores/routePlan";
import debounce from "lodash/debounce";
import { useVantourV2Store } from "../stores/vantourv2.js";

const toast = useToast();
const router = useRouter();
const vantourStore = useVantourV2Store();
const authStore = useAuthStore();
const cityStore = useCityStore();
const routePlanStore = useRoutePlanStore();
const sidebarStore = useSidebarStore();

const { vantours, loading } = storeToRefs(vantourStore);
const { cities } = storeToRefs(cityStore);
const { routePlans } = storeToRefs(routePlanStore);

const search = ref("");
const selectedType = ref("");
const selectedCity = ref("");
const selectedRoutePlan = ref("");
const currentPage = ref(1);

const showType = ref(true);
const showCities = ref(true);
const showRoutePlans = ref(true);

// Matches the type values already used elsewhere in this codebase
// (see the old vantour list's "for Sale Part" / "for User Web" toggle).
const typeOptions = [
  { value: "car_rental", label: "Car Rental (Sale)" },
  { value: "van_tour", label: "Van Tour (User Web)" },
];

const citiesList = computed(() => cities.value?.data || []);
const routePlansList = computed(() => routePlans.value?.data || []);

const displayedVantours = computed(() => vantours.value?.data || []);
const totalCount = computed(
  () => vantours.value?.meta?.total_count || vantours.value?.meta?.total || 0,
);
const displayedCount = computed(() => displayedVantours.value.length);

const filterCount = computed(() => {
  let count = 0;
  if (search.value) count++;
  if (selectedType.value) count++;
  if (selectedCity.value) count++;
  if (selectedRoutePlan.value) count++;
  return count;
});

const buildParams = () => {
  const params = { page: currentPage.value, limit: 12 };
  if (search.value) params.search = search.value;
  if (selectedType.value) params.type = selectedType.value;
  if (selectedCity.value) params.city_id = selectedCity.value;
  if (selectedRoutePlan.value) params.route_plan_id = selectedRoutePlan.value;
  return params;
};

const fetchVantours = async () => {
  try {
    await vantourStore.getListAction(buildParams());
  } catch (error) {
    toast.error("Failed to fetch van tours");
  }
};

const onSearchInput = debounce(() => {
  currentPage.value = 1;
  fetchVantours();
}, 500);

const selectType = (value) => {
  selectedType.value = value;
  currentPage.value = 1;
  fetchVantours();
};

const selectCity = (id) => {
  selectedCity.value = id;
  currentPage.value = 1;
  fetchVantours();
};

const selectRoutePlan = (id) => {
  selectedRoutePlan.value = id;
  currentPage.value = 1;
  fetchVantours();
};

const clearAllFilters = () => {
  search.value = "";
  selectedType.value = "";
  selectedCity.value = "";
  selectedRoutePlan.value = "";
  currentPage.value = 1;
  fetchVantours();
};

const changePage = async (url) => {
  await vantourStore.getChangePage(url, buildParams());
};

const goEditPage = (id) => {
  router.push(`/vantour-v2?id=${id}`);
};

const onDeleteHandler = async (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await vantourStore.deleteAction(id);
        toast.success(response.message);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to delete van tour",
        );
      }
      await fetchVantours();
    }
  });
};

onMounted(async () => {
  await Promise.all([
    cityStore.getListHotelCityAction({ limit: 100 }),
    routePlanStore.getListAction(),
  ]);
  await fetchVantours();
});
</script>
