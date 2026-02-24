<!-- components/GenerateInclusive/PackageListPage.vue -->
<template>
  <div class="min-h-full bg-slate-50">
    <!-- ── Header ── -->
    <div
      class="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-5 flex items-center justify-between"
    >
      <div>
        <h1 class="text-xl font-bold text-white">Package List</h1>
        <p class="text-slate-300 text-xs mt-0.5">
          ရှာဖွေ၊ ရွေးချယ်၊ Edit သို့မဟုတ် Delete လုပ်ပါ
        </p>
      </div>
      <button
        @click="$emit('back')"
        class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition"
      >
        ← Back
      </button>
    </div>

    <!-- ── Filters ── -->
    <div class="px-6 py-4 bg-white border-b border-slate-200 space-y-3">
      <div class="flex gap-3 flex-wrap">
        <div class="relative flex-1 min-w-[200px]">
          <input
            v-model="store.filters.search"
            @input="onSearchInput"
            type="text"
            placeholder="Package name ရှာပါ..."
            class="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
          />
          <svg
            class="w-4 h-4 absolute left-3 top-3 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <select
          v-model="store.filters.status"
          @change="store.fetchPackages()"
          class="px-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none bg-white"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="confirmed">Confirmed</option>
          <option value="sent">Sent</option>
        </select>
        <input
          v-model="store.filters.start_date"
          @change="store.fetchPackages()"
          type="date"
          class="px-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none"
        />
        <span class="text-slate-400 text-sm self-center">to</span>
        <input
          v-model="store.filters.end_date"
          @change="store.fetchPackages()"
          type="date"
          class="px-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none"
        />
        <button
          @click="
            store.resetFilters();
            store.fetchPackages();
          "
          class="px-4 py-2.5 text-sm text-slate-500 hover:text-red-500 border border-slate-300 rounded-xl transition bg-white"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- ── Table ── -->
    <div class="px-6 py-4">
      <!-- Loading -->
      <div v-if="store.listLoading" class="flex justify-center py-20">
        <div
          class="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full"
        />
      </div>

      <!-- Empty -->
      <div
        v-else-if="store.packages.length === 0"
        class="text-center py-20 text-slate-400"
      >
        <svg
          class="w-16 h-16 mx-auto mb-4 text-slate-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p class="text-base font-medium">Package မတွေ့ပါ</p>
        <p class="text-sm mt-1">Filter ကို ပြင်ဆင်၍ ထပ်မံရှာဖွေပါ</p>
      </div>

      <!-- Table -->
      <div
        v-else
        class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200">
              <th
                class="text-left px-5 py-3.5 font-semibold text-slate-600 w-10"
              >
                #
              </th>
              <th class="text-left px-5 py-3.5 font-semibold text-slate-600">
                Package Name
              </th>
              <th class="text-left px-4 py-3.5 font-semibold text-slate-600">
                Status
              </th>
              <th class="text-left px-4 py-3.5 font-semibold text-slate-600">
                Start Date
              </th>
              <th class="text-left px-4 py-3.5 font-semibold text-slate-600">
                Duration
              </th>
              <th class="text-left px-4 py-3.5 font-semibold text-slate-600">
                Pax
              </th>
              <th class="text-right px-4 py-3.5 font-semibold text-slate-600">
                Selling
              </th>
              <th class="text-right px-4 py-3.5 font-semibold text-slate-600">
                Cost
              </th>
              <th class="text-center px-5 py-3.5 font-semibold text-slate-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(pkg, idx) in store.packages"
              :key="pkg.id"
              class="border-b border-slate-100 hover:bg-orange-50/40 transition-colors group"
            >
              <!-- # -->
              <td class="px-5 py-3.5 text-slate-400 text-xs">
                {{ (store.filters.page - 1) * 15 + idx + 1 }}
              </td>

              <!-- Package Name -->
              <td class="px-5 py-3.5">
                <p
                  class="font-semibold text-slate-800 group-hover:text-orange-600 transition-colors"
                >
                  {{ pkg.package_name }}
                </p>
                <p class="text-xs text-slate-400 mt-0.5">ID #{{ pkg.id }}</p>
              </td>

              <!-- Status -->
              <td class="px-4 py-3.5">
                <span
                  :class="statusClass(pkg.status)"
                  class="text-xs px-2.5 py-1 rounded-full font-medium"
                >
                  {{ pkg.status }}
                </span>
              </td>

              <!-- Start Date -->
              <td class="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                {{ formatDate(pkg.start_date) }}
              </td>

              <!-- Duration -->
              <td class="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                {{ pkg.nights }}N / {{ pkg.total_days }}D
              </td>

              <!-- Pax -->
              <td class="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                {{ pkg.adults }}A<span v-if="pkg.children > 0">
                  / {{ pkg.children }}C</span
                >
              </td>

              <!-- Selling -->
              <td class="px-4 py-3.5 text-right">
                <span class="font-bold text-orange-600"
                  >฿{{ Number(pkg.total_selling_price).toLocaleString() }}</span
                >
              </td>

              <!-- Cost -->
              <td class="px-4 py-3.5 text-right text-slate-400 text-xs">
                ฿{{ Number(pkg.total_cost_price).toLocaleString() }}
              </td>

              <!-- Actions -->
              <td class="px-5 py-3.5">
                <div class="flex items-center justify-center gap-2">
                  <!-- Edit -->
                  <button
                    @click="onEdit(pkg)"
                    :disabled="store.detailLoading && loadingId === pkg.id"
                    class="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg font-medium transition disabled:opacity-60"
                    title="Edit package"
                  >
                    <span
                      v-if="store.detailLoading && loadingId === pkg.id"
                      class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"
                    />
                    <span v-else>✏️</span>
                    Edit
                  </button>

                  <!-- Delete -->
                  <button
                    @click="onDelete(pkg)"
                    :disabled="store.deleteLoading && deletingId === pkg.id"
                    class="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg font-medium transition disabled:opacity-60"
                    title="Delete package"
                  >
                    <span
                      v-if="store.deleteLoading && deletingId === pkg.id"
                      class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"
                    />
                    <span v-else>🗑</span>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- ── Pagination ── -->
        <div
          v-if="store.meta"
          class="px-5 py-4 border-t border-slate-200 flex items-center justify-between"
        >
          <span class="text-xs text-slate-500">
            Total: <strong>{{ store.meta.total }}</strong> packages
            &nbsp;·&nbsp; Page {{ store.meta.current_page }} of
            {{ store.meta.last_page }}
          </span>

          <div class="flex items-center gap-1">
            <!-- First + Prev -->
            <button
              @click="changePage(1)"
              :disabled="store.filters.page === 1"
              class="w-8 h-8 rounded-lg text-xs flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed bg-slate-100 text-slate-600 hover:bg-orange-100"
            >
              «
            </button>
            <button
              @click="changePage(store.filters.page - 1)"
              :disabled="store.filters.page === 1"
              class="w-8 h-8 rounded-lg text-xs flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed bg-slate-100 text-slate-600 hover:bg-orange-100"
            >
              ‹
            </button>

            <!-- Page Numbers -->
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="changePage(page)"
              :class="[
                'w-8 h-8 rounded-lg text-xs font-medium transition',
                store.filters.page === page
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-orange-100',
              ]"
            >
              {{ page }}
            </button>

            <!-- Next + Last -->
            <button
              @click="changePage(store.filters.page + 1)"
              :disabled="store.filters.page === store.meta.last_page"
              class="w-8 h-8 rounded-lg text-xs flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed bg-slate-100 text-slate-600 hover:bg-orange-100"
            >
              ›
            </button>
            <button
              @click="changePage(store.meta.last_page)"
              :disabled="store.filters.page === store.meta.last_page"
              class="w-8 h-8 rounded-lg text-xs flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed bg-slate-100 text-slate-600 hover:bg-orange-100"
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Delete Confirm Dialog ── -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="showDeleteConfirm"
          class="fixed inset-0 z-[10000] flex items-center justify-center p-4"
        >
          <div
            class="absolute inset-0 bg-black/60"
            @click="showDeleteConfirm = false"
          />
          <div
            class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
          >
            <div class="text-center">
              <div
                class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <span class="text-2xl">🗑️</span>
              </div>
              <h3 class="text-lg font-bold text-slate-800 mb-2">
                Delete Package?
              </h3>
              <p class="text-sm text-slate-500 mb-1">
                <span class="font-semibold text-slate-700">{{
                  deletingPkg?.package_name
                }}</span>
              </p>
              <p class="text-xs text-red-500 mb-6">
                ဤ action ကို ပြန်ပြောင်း၍ မရပါ
              </p>
              <div class="flex gap-3">
                <button
                  @click="showDeleteConfirm = false"
                  class="flex-1 py-2.5 border-2 border-slate-300 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  @click="confirmDelete"
                  :disabled="store.deleteLoading"
                  class="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2"
                >
                  <span
                    v-if="store.deleteLoading"
                    class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                  />
                  {{ store.deleteLoading ? "Deleting..." : "Yes, Delete" }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useInclusivePackageStore } from "../../stores/inclusivePackage";

const emit = defineEmits(["edit", "back"]);

const store = useInclusivePackageStore();
const loadingId = ref(null);
const deletingId = ref(null);
const deletingPkg = ref(null);
const showDeleteConfirm = ref(false);
let searchTimeout = null;

onMounted(() => {
  store.resetFilters();
  store.fetchPackages();
});

// ── Edit package ── auto-set package name in SaveNameModal
const onEdit = async (pkg) => {
  loadingId.value = pkg.id;
  const detail = await store.fetchPackageDetail(pkg.id);
  loadingId.value = null;
  if (detail) {
    // Pass package_name so parent can pre-fill SaveNameModal input
    emit("edit", { ...detail, package_name: pkg.package_name });
  }
};

// ── Delete ──
const onDelete = (pkg) => {
  deletingPkg.value = pkg;
  deletingId.value = pkg.id;
  showDeleteConfirm.value = true;
};

const confirmDelete = async () => {
  const result = await store.deletePackage(deletingPkg.value.id);
  if (result.success) {
    showDeleteConfirm.value = false;
    deletingPkg.value = null;
    deletingId.value = null;
  }
};

const onSearchInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => store.fetchPackages(), 500);
};

const changePage = (page) => {
  if (page < 1 || (store.meta && page > store.meta.last_page)) return;
  store.filters.page = page;
  store.fetchPackages();
};

const visiblePages = computed(() => {
  if (!store.meta) return [];
  const total = store.meta.last_page;
  const current = store.filters.page;
  const pages = [];
  for (
    let i = Math.max(1, current - 2);
    i <= Math.min(total, current + 2);
    i++
  ) {
    pages.push(i);
  }
  return pages;
});

const statusClass = (status) =>
  ({
    draft: "bg-slate-100 text-slate-600",
    confirmed: "bg-green-100 text-green-700",
    sent: "bg-blue-100 text-blue-700",
  }[status] ?? "bg-slate-100 text-slate-600");

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
