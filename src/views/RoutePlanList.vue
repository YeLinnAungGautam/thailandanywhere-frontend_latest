<script setup>
import Layout from "./Layout.vue";
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

import Swal from "sweetalert2";
import Pagination from "../components/Pagination.vue";
import { useRoutePlanStore } from "../stores/routePlan.js";

const router = useRouter();
const toast = useToast();
const store = useRoutePlanStore();

const search = ref("");
const currentPage = ref(1);
const list = ref([]);
const totalPages = ref(null);
const loading = ref(false);

const fetchList = async () => {
  loading.value = true;
  try {
    const res = await store.getListAction({
      search: search.value,
      limit: 10,
    });
    list.value = res.result?.data ?? [];

    totalPages.value = res.result;
    console.log(totalPages.value, "this is response");
  } catch {
    toast.error("Failed to load route plans.");
  } finally {
    loading.value = false;
  }
};

const onDelete = (id) => {
  Swal.fire({
    title: "Delete this route plan?",
    text: "This cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#FF613c",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, delete",
  }).then(async (result) => {
    if (!result.isConfirmed) return;
    try {
      const res = await store.deleteAction(id);
      toast.success(res.message ?? "Deleted.");
      fetchList();
    } catch {
      toast.error("Delete failed.");
    }
  });
};

const changePage = async (url) => {
  console.log(url);
  let data = {
    search: search.value,
  };
  const res = await store.getChangePage(url, data);
  list.value = res.result?.data ?? [];

  totalPages.value = res.result;
};

let searchTimer;
watch(search, () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    currentPage.value = 1;
    fetchList();
  }, 350);
});

onMounted(fetchList);
</script>

<template>
  <Layout>
    <div class="max-w-5xl mx-auto py-8 px-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-widest text-[#FF613c] mb-1"
          >
            Products
          </p>
          <h1 class="text-2xl font-semibold text-gray-800">Route Plans</h1>
        </div>
        <button
          @click="router.push('/route-plan-form')"
          class="inline-flex items-center gap-2 bg-[#FF613c] hover:bg-[#e5522f] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Route Plan
        </button>
      </div>

      <!-- Search -->
      <div class="relative mb-5">
        <svg
          class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
        <input
          v-model="search"
          type="text"
          placeholder="Search by description…"
          class="w-full h-10 pl-9 pr-4 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF613c]/30 focus:border-[#FF613c]"
        />
      </div>

      <!-- Table -->
      <div
        class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <table class="w-full text-sm">
          <thead
            class="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide"
          >
            <tr>
              <th class="px-5 py-3 text-left">#</th>
              <th class="px-5 py-3 text-left">Cover</th>
              <th class="px-5 py-3 text-left">Description (EN)</th>
              <th class="px-5 py-3 text-left">Van Tours</th>
              <th class="px-5 py-3 text-left">Cities</th>
              <th class="px-5 py-3 text-left">Created</th>
              <th class="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <!-- Loading skeleton -->
            <template v-if="loading">
              <tr v-for="n in 5" :key="n" class="animate-pulse">
                <td class="px-5 py-3">
                  <div class="h-3 w-6 bg-gray-100 rounded"></div>
                </td>
                <td class="px-5 py-3">
                  <div class="h-12 w-16 bg-gray-100 rounded-lg"></div>
                </td>
                <td class="px-5 py-3">
                  <div class="h-3 w-48 bg-gray-100 rounded"></div>
                </td>
                <td class="px-5 py-3">
                  <div class="h-3 w-10 bg-gray-100 rounded"></div>
                </td>
                <td class="px-5 py-3">
                  <div class="h-3 w-16 bg-gray-100 rounded"></div>
                </td>
                <td class="px-5 py-3">
                  <div class="h-3 w-20 bg-gray-100 rounded"></div>
                </td>
                <td class="px-5 py-3"></td>
              </tr>
            </template>

            <!-- Empty -->
            <tr v-else-if="list.length === 0">
              <td
                colspan="7"
                class="px-5 py-12 text-center text-sm text-gray-400"
              >
                No route plans found.
              </td>
            </tr>

            <!-- Rows -->
            <tr
              v-else
              v-for="(item, index) in list"
              :key="item.route_id"
              class="hover:bg-gray-50/50 transition-colors"
            >
              <td class="px-5 py-3 text-gray-400 text-xs">{{ index + 1 }}</td>
              <td class="px-5 py-3">
                <img
                  v-if="item.main_cover_photo"
                  :src="item.main_cover_photo"
                  class="w-16 h-12 object-cover rounded-lg"
                  alt=""
                />
                <div
                  v-else
                  class="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-4 h-4 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </td>
              <td class="px-5 py-3 text-gray-700 max-w-xs">
                <p class="truncate">{{ item.english_description || "—" }}</p>
                <p class="text-xs text-gray-400 truncate mt-0.5">
                  {{ item.mm_description || "" }}
                </p>
              </td>
              <td class="px-5 py-3">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-[#FF613c]"
                >
                  {{ item.van_tours?.length ?? 0 }} tours
                </span>
              </td>
              <td class="px-5 py-3 text-gray-600 text-xs">
                {{ (item.city_ids ?? []).length }} cities
              </td>
              <td class="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">
                {{
                  item.created_at
                    ? new Date(item.created_at).toLocaleDateString()
                    : "—"
                }}
              </td>
              <td class="px-5 py-3">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="router.push(`/route-plan-form?id=${item.route_id}`)"
                    class="p-1.5 text-gray-400 hover:text-[#FF613c] transition-colors"
                    title="Edit"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    @click="onDelete(item.route_id)"
                    class="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <!-- <div
        v-if="totalPages > 1"
        class="flex items-center justify-center gap-2 mt-5"
      >
        <button
          @click="
            () => {
              currentPage--;
              fetchList();
            }
          "
          :disabled="currentPage === 1"
          class="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 disabled:opacity-40 hover:border-[#FF613c] hover:text-[#FF613c] transition-colors"
        >
          Prev
        </button>
        <span class="text-xs text-gray-500"
          >{{ currentPage }} / {{ totalPages }}</span
        >
        <button
          @click="
            () => {
              currentPage++;
              fetchList();
            }
          "
          :disabled="currentPage === totalPages"
          class="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 disabled:opacity-40 hover:border-[#FF613c] hover:text-[#FF613c] transition-colors"
        >
          Next
        </button>
      </div> -->
      <div class="pt-4" v-if="totalPages">
        <Pagination
          v-if="!loading"
          :data="totalPages"
          @change-page="changePage"
        />
      </div>
    </div>
  </Layout>
</template>
