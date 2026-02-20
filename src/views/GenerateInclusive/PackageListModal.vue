<!-- components/GenerateInclusive/PackageListModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="show"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="$emit('close')"
        />

        <div
          class="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[88vh] flex flex-col overflow-hidden"
        >
          <!-- ── Header ── -->
          <div
            class="bg-gradient-to-r from-slate-700 to-slate-600 px-6 py-4 flex items-center justify-between shrink-0"
          >
            <div>
              <h2 class="text-lg font-bold text-white">Package List</h2>
              <p class="text-slate-300 text-xs mt-0.5">
                ရှာဖွေ၊ ရွေးချယ်၊ Edit သို့မဟုတ် Delete လုပ်ပါ
              </p>
            </div>
            <button
              @click="$emit('close')"
              class="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-xl transition"
            >
              ×
            </button>
          </div>

          <!-- ── Filters ── -->
          <div class="px-5 py-3 border-b border-slate-200 shrink-0 space-y-2">
            <div class="flex gap-2">
              <div class="relative flex-1">
                <input
                  v-model="store.filters.search"
                  @input="onSearchInput"
                  type="text"
                  placeholder="Package name ရှာပါ..."
                  class="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
                <svg
                  class="w-4 h-4 absolute left-3 top-2.5 text-slate-400"
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
                class="px-3 py-2 border border-slate-300 rounded-xl text-sm outline-none"
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="confirmed">Confirmed</option>
                <option value="sent">Sent</option>
              </select>
              <button
                @click="
                  store.resetFilters();
                  store.fetchPackages();
                "
                class="px-3 py-2 text-xs text-slate-500 hover:text-red-500 border border-slate-300 rounded-xl transition"
              >
                Reset
              </button>
            </div>
            <div class="flex gap-2 items-center">
              <input
                v-model="store.filters.start_date"
                @change="store.fetchPackages()"
                type="date"
                class="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-sm outline-none"
              />
              <span class="text-slate-400 text-sm shrink-0">to</span>
              <input
                v-model="store.filters.end_date"
                @change="store.fetchPackages()"
                type="date"
                class="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-sm outline-none"
              />
            </div>
          </div>

          <!-- ── List ── -->
          <div class="flex-1 overflow-y-auto px-5 py-3 space-y-2">
            <!-- Loading -->
            <div v-if="store.listLoading" class="flex justify-center py-12">
              <div
                class="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full"
              />
            </div>

            <!-- Empty -->
            <div
              v-else-if="store.packages.length === 0"
              class="text-center py-12 text-slate-400"
            >
              <p class="text-sm">Package မတွေ့ပါ</p>
            </div>

            <!-- Cards -->
            <div
              v-else
              v-for="pkg in store.packages"
              :key="pkg.id"
              :class="[
                'border-2 rounded-xl p-4 transition',
                selectedId === pkg.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-slate-200 hover:border-orange-200',
              ]"
            >
              <div class="flex items-start gap-3">
                <!-- Info (click to select) -->
                <div
                  class="flex-1 min-w-0 cursor-pointer"
                  @click="selectedId = pkg.id"
                >
                  <div class="flex items-center gap-2 flex-wrap">
                    <p class="font-semibold text-slate-800">
                      {{ pkg.package_name }}
                    </p>
                    <span
                      :class="statusClass(pkg.status)"
                      class="text-xs px-2 py-0.5 rounded-full font-medium"
                    >
                      {{ pkg.status }}
                    </span>
                  </div>
                  <div class="flex flex-wrap gap-3 mt-1">
                    <span class="text-xs text-slate-500"
                      >📅 {{ formatDate(pkg.start_date) }}</span
                    >
                    <span class="text-xs text-slate-500"
                      >🌙 {{ pkg.nights }}N / {{ pkg.total_days }}D</span
                    >
                    <span class="text-xs text-slate-500"
                      >👥 {{ pkg.adults }}A
                      <span v-if="pkg.children > 0">/ {{ pkg.children }}C</span>
                    </span>
                  </div>
                  <div class="mt-1">
                    <span class="text-sm font-bold text-orange-600"
                      >฿{{
                        Number(pkg.total_selling_price).toLocaleString()
                      }}</span
                    >
                    <span class="text-xs text-slate-400 ml-2"
                      >Cost: ฿{{
                        Number(pkg.total_cost_price).toLocaleString()
                      }}</span
                    >
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col gap-1.5 shrink-0">
                  <!-- Use / Select -->
                  <button
                    @click="confirmSelect(pkg)"
                    :disabled="store.detailLoading"
                    class="flex items-center gap-1 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded-lg font-medium transition"
                  >
                    <span
                      v-if="store.detailLoading && selectedId === pkg.id"
                      class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"
                    />
                    <span v-else>↗</span>
                    Use
                  </button>

                  <!-- Edit -->
                  <button
                    @click="onEdit(pkg)"
                    :disabled="store.detailLoading"
                    class="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg font-medium transition"
                  >
                    ✏️ Edit
                  </button>

                  <!-- Delete -->
                  <button
                    @click="onDelete(pkg)"
                    :disabled="store.deleteLoading"
                    class="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg font-medium transition"
                  >
                    <span
                      v-if="store.deleteLoading && deletingId === pkg.id"
                      class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"
                    />
                    <span v-else>🗑</span>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- ── Pagination ── -->
          <div
            v-if="store.meta && store.meta.last_page > 1"
            class="px-5 py-3 border-t border-slate-200 flex items-center justify-between shrink-0"
          >
            <span class="text-xs text-slate-500"
              >Total: {{ store.meta.total }} packages</span
            >
            <div class="flex gap-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="changePage(page)"
                :class="[
                  'w-8 h-8 rounded-lg text-xs font-medium transition',
                  store.filters.page === page
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-orange-100',
                ]"
              >
                {{ page }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── Delete Confirm Dialog ── -->
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
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useInclusivePackageStore } from "../../stores/inclusivePackage";

const props = defineProps({ show: Boolean });
const emit = defineEmits(["close", "select", "edit"]);

const store = useInclusivePackageStore();
const selectedId = ref(null);
const deletingId = ref(null);
const deletingPkg = ref(null);
const showDeleteConfirm = ref(false);
let searchTimeout = null;

watch(
  () => props.show,
  (val) => {
    if (val) {
      store.resetFilters();
      store.fetchPackages();
      selectedId.value = null;
    }
  },
);

// ── Use package ──
const confirmSelect = async (pkg) => {
  selectedId.value = pkg.id;
  const detail = await store.fetchPackageDetail(pkg.id);
  if (detail) {
    emit("select", detail);
    emit("close");
  }
};

// ── Edit package ──
const onEdit = async (pkg) => {
  selectedId.value = pkg.id;
  const detail = await store.fetchPackageDetail(pkg.id);
  if (detail) {
    emit("edit", detail);
    emit("close");
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
