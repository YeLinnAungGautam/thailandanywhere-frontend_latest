<template>
  <div>
    <Layout>
      <div class="space-y-6">
        <!-- header -->
        <div
          class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 class="text-xl font-semibold text-slate-800">Coupons</h1>
            <p class="text-sm text-slate-400">
              Manage the coupon codes given out on Facebook posts and elsewhere.
            </p>
          </div>
          <button
            type="button"
            class="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            @click="openCreateModal"
          >
            <svg
              viewBox="0 0 24 24"
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 5v14m-7-7h14"
              />
            </svg>
            New coupon
          </button>
        </div>

        <!-- stat cards -->
        <PromoStatsCards
          :total="promoStore.totalCount"
          :active="promoStore.activeCount"
          :expired="promoStore.expiredCount"
          :upcoming="promoStore.upcomingCount"
        />

        <!-- toolbar -->
        <div
          class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="relative w-full sm:max-w-xs">
            <svg
              viewBox="0 0 24 24"
              class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path stroke-linecap="round" d="m21 21-4.3-4.3" />
            </svg>
            <input
              v-model="searchInput"
              type="text"
              placeholder="Search by name or code..."
              class="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              @input="onSearch"
            />
          </div>
          <p class="text-sm text-slate-400">
            Showing {{ promoStore.promos.length }} of
            {{ promoStore.totalCount }} coupons
          </p>
        </div>

        <!-- error banner -->
        <div
          v-if="promoStore.error"
          class="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-600"
        >
          {{ promoStore.error }}
        </div>

        <!-- table -->
        <div
          class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        >
          <table class="w-full text-left text-sm">
            <thead
              class="border-b border-slate-100 bg-slate-50/70 text-xs uppercase tracking-wide text-slate-400"
            >
              <tr>
                <th class="px-5 py-3 font-medium">Coupon</th>
                <th class="px-5 py-3 font-medium">Discount</th>
                <th class="px-5 py-3 font-medium">Usage</th>
                <th class="px-5 py-3 font-medium">Applies to</th>
                <th class="px-5 py-3 font-medium">Expiry</th>
                <th class="px-5 py-3 font-medium">Status</th>
                <th class="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="promoStore.loading">
                <td colspan="7" class="px-5 py-10 text-center text-slate-400">
                  Loading coupons...
                </td>
              </tr>
              <tr v-else-if="!promoStore.promos.length">
                <td colspan="7" class="px-5 py-10 text-center text-slate-400">
                  No coupons yet — create one to get started.
                </td>
              </tr>
              <tr
                v-for="promo in promoStore.promos"
                :key="promo.promo_id"
                class="hover:bg-slate-50/60"
              >
                <!-- coupon code, ticket-stub style -->
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-10 w-14 shrink-0 items-center justify-center rounded-md border border-dashed border-indigo-300 bg-indigo-50/70 font-mono text-[11px] font-semibold tracking-wide text-indigo-600"
                    >
                      {{ promo.promo_code }}
                    </div>
                    <div>
                      <p class="font-medium text-slate-700">
                        {{ promo.promo_name }}
                      </p>
                      <p
                        class="line-clamp-1 max-w-[220px] text-xs text-slate-400"
                      >
                        {{ promo.promo_des || "No description" }}
                      </p>
                    </div>
                  </div>
                </td>

                <!-- discount -->
                <td class="px-5 py-4 text-slate-600">
                  <span v-if="promo.promo_type === 'percent'"
                    >{{ promo.promo_amount }}% off</span
                  >
                  <span v-else>${{ promo.promo_amount }} off</span>
                </td>

                <!-- usage -->
                <td class="px-5 py-4">
                  <div class="w-32">
                    <div class="flex justify-between text-xs text-slate-400">
                      <span
                        >{{ promo.promo_used_count }}/{{
                          promo.promo_count
                        }}</span
                      >
                      <span>{{ usagePercent(promo) }}%</span>
                    </div>
                    <div
                      class="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
                    >
                      <div
                        class="h-full rounded-full bg-indigo-500"
                        :style="{ width: usagePercent(promo) + '%' }"
                      />
                    </div>
                  </div>
                </td>

                <!-- applies to -->
                <td class="px-5 py-4">
                  <span
                    v-if="promo.promo_applies_to === 'all'"
                    class="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                  >
                    All products
                  </span>
                  <div v-else class="flex flex-wrap gap-1">
                    <span
                      v-for="key in Object.keys(
                        promo.applicable_products || {},
                      )"
                      :key="key"
                      class="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600"
                    >
                      {{ productLabel(key) }}
                    </span>
                  </div>
                </td>

                <!-- expiry -->
                <td class="px-5 py-4 text-slate-500">
                  {{ promo.formatted_end_date || "-" }}
                </td>

                <!-- status -->
                <td class="px-5 py-4">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="statusBadge(promo).class"
                  >
                    <span
                      class="h-1.5 w-1.5 rounded-full"
                      :class="statusBadge(promo).dot"
                    />
                    {{ statusBadge(promo).label }}
                  </span>
                </td>

                <!-- actions -->
                <td class="px-5 py-4">
                  <div class="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
                      title="Edit"
                      @click="openEditModal(promo)"
                    >
                      <PencilSquareIcon class="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      class="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      title="Delete"
                      @click="openDeleteModal(promo)"
                    >
                      <TrashIcon class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- pagination -->
        <div
          v-if="promoStore.meta.last_page > 1"
          class="flex items-center justify-between"
        >
          <button
            type="button"
            class="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-500 disabled:opacity-40"
            :disabled="promoStore.meta.current_page <= 1"
            @click="promoStore.fetchPromos(promoStore.meta.current_page - 1)"
          >
            Previous
          </button>
          <span class="text-sm text-slate-400">
            Page {{ promoStore.meta.current_page }} of
            {{ promoStore.meta.last_page }}
          </span>
          <button
            type="button"
            class="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-500 disabled:opacity-40"
            :disabled="
              promoStore.meta.current_page >= promoStore.meta.last_page
            "
            @click="promoStore.fetchPromos(promoStore.meta.current_page + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </Layout>

    <!-- create / edit modal -->
    <PromoFormModal
      :open="formModalOpen"
      :promo="editingPromo"
      :saving="promoStore.saving"
      :errors="formErrors"
      @close="closeFormModal"
      @submit="handleSubmit"
    />

    <!-- delete confirm modal -->
    <PromoDeleteModal
      :open="deleteModalOpen"
      :promo="deletingPromo"
      :deleting="promoStore.deleting"
      :error="deleteError"
      @close="closeDeleteModal"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Layout from "./Layout.vue";
import PromoStatsCards from "./Promo/Promostatscards.vue";
import PromoFormModal from "./Promo/Promoformmodal.vue";
import PromoDeleteModal from "./Promo/Promodeletemodal.vue";
import { usePromoStore } from "../stores/promo";
import {
  PencilSquareIcon,
  TrashIcon,
  TruckIcon,
} from "@heroicons/vue/24/outline";

const promoStore = usePromoStore();

const searchInput = ref("");
let searchTimeout = null;

function onSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    promoStore.setSearch(searchInput.value);
    promoStore.fetchPromos(1);
  }, 350);
}

// ----- create / edit modal state -----
const formModalOpen = ref(false);
const editingPromo = ref(null);
const formErrors = ref({});

function openCreateModal() {
  editingPromo.value = null;
  formErrors.value = {};
  formModalOpen.value = true;
}

function openEditModal(promo) {
  editingPromo.value = promo;
  formErrors.value = {};
  formModalOpen.value = true;
}

function closeFormModal() {
  formModalOpen.value = false;
  editingPromo.value = null;
  formErrors.value = {};
}

async function handleSubmit(payload) {
  formErrors.value = {};

  const result = editingPromo.value
    ? await promoStore.updatePromo(editingPromo.value.promo_id, payload)
    : await promoStore.createPromo(payload);

  if (result.success) {
    closeFormModal();
  } else {
    formErrors.value = result.errors || {};
  }
}

// ----- delete modal state -----
const deleteModalOpen = ref(false);
const deletingPromo = ref(null);
const deleteError = ref("");

function openDeleteModal(promo) {
  deletingPromo.value = promo;
  deleteError.value = "";
  deleteModalOpen.value = true;
}

function closeDeleteModal() {
  deleteModalOpen.value = false;
  deletingPromo.value = null;
  deleteError.value = "";
}

async function handleDelete() {
  const result = await promoStore.deletePromo(deletingPromo.value.promo_id);
  if (result.success) {
    closeDeleteModal();
  } else {
    deleteError.value = result.message;
  }
}

// ----- helpers -----
const productLabels = {
  hotel: "Hotels",
  entrance_ticket: "Entrance tickets",
  vantour: "Van tours",
  inclusive: "Group tours",
  airline: "Airlines",
  airport_pickup: "Airport pickup",
};

function productLabel(key) {
  return productLabels[key] || key;
}

function usagePercent(promo) {
  if (!promo.promo_count) return 0;
  return Math.min(
    100,
    Math.round((promo.promo_used_count / promo.promo_count) * 100),
  );
}

function statusBadge(promo) {
  if (!promo.promo_active) {
    return {
      label: "Inactive",
      class: "bg-slate-100 text-slate-500",
      dot: "bg-slate-400",
    };
  }
  if (promo.is_expired) {
    return {
      label: "Expired",
      class: "bg-rose-50 text-rose-600",
      dot: "bg-rose-500",
    };
  }
  if (promo.is_upcoming) {
    return {
      label: "Upcoming",
      class: "bg-amber-50 text-amber-600",
      dot: "bg-amber-500",
    };
  }
  return {
    label: "Active",
    class: "bg-emerald-50 text-emerald-600",
    dot: "bg-emerald-500",
  };
}

onMounted(() => {
  promoStore.fetchPromos();
});
</script>
