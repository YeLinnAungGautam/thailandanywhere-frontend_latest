<template>
  <div class="relative">
    <!-- Loading overlay -->
    <!-- <Transition name="fade">
      <div
        v-if="isLoadingInit"
        class="absolute inset-0 flex items-center justify-center bg-white/10 z-10"
      >
        <img
          :src="animation"
          alt="Loading"
          class="w-full h-full object-cover"
        />
      </div>
    </Transition> -->

    <div class="bg-white rounded-lg shadow-sm p-8">
      <!-- Next target info -->
      <div v-if="nextTargetInfo" class="mt-2">
        <p class="text-xs text-gray-400">
          Next:
          <span class="font-semibold text-lg text-gray-600">
            {{ nextTargetInfo.target.toLocaleString() }}
          </span>
          avg
          <span class="text-gray-400">({{ nextTargetInfo.tierLabel }})</span>
        </p>
        <p class="text-xs mt-1">
          <span class="font-semibold text-lg text-red-700">
            {{
              (nextTargetInfo.needed / (nextTargetInfo.daysLeft - 1)).toFixed(2)
            }}
            THB
          </span>
          <span class="text-gray-400">
            average needed in {{ nextTargetInfo.daysLeft }} day{{
              nextTargetInfo.daysLeft !== 1 ? "s" : ""
            }}
          </span>
        </p>
      </div>
      <div v-else-if="commissionAmount > 0" class="mt-2">
        <p class="text-xs text-green-500 font-semibold">🎉 Max tier reached!</p>
      </div>

      <!-- Commission display -->
      <div class="mt-4 pt-4 border-t border-gray-200">
        <div class="flex items-center gap-2 mb-2">
          <p class="text-gray-500 text-sm font-medium">COMMISSION</p>
          <button
            @click="showPopup = true"
            class="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 text-xs font-bold flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
            title="Commission Tiers Info"
          >
            i
          </button>
        </div>
        <p class="text-4xl font-bold text-[#FF613c]">
          {{ calculateCommission() }}
        </p>
      </div>
    </div>

    <!-- ── Tiers Popup ── -->
    <Transition name="fade">
      <div
        v-if="showPopup"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        @click.self="showPopup = false"
      >
        <div
          class="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between px-5 py-4 border-b border-gray-100"
          >
            <h3 class="text-base font-semibold text-gray-800">
              Commission Tiers
            </h3>
            <div class="flex items-center gap-2" v-if="authStore.isSuperAdmin">
              <button
                @click="openCreateModal"
                class="text-xs px-3 py-1.5 bg-[#FF613c] text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                + Add Tier
              </button>
              <button
                @click="showPopup = false"
                class="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
              >
                &times;
              </button>
            </div>
          </div>

          <!-- Error banner -->
          <div v-if="tierStore.error" class="px-5 pt-3">
            <p class="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
              {{ tierStore.error }}
            </p>
          </div>

          <!-- Tier list -->
          <div class="px-5 py-4 space-y-2 max-h-96 overflow-y-auto">
            <!-- Warning row -->
            <div
              class="flex items-center justify-between py-2 px-3 rounded-lg bg-red-50"
            >
              <div class="flex items-center gap-2">
                <span class="text-red-500 font-bold text-sm">⚠</span>
                <span class="text-sm text-gray-700">Less than 15,000</span>
              </div>
              <span class="text-sm font-semibold text-red-500">Warning</span>
            </div>

            <!-- Loading skeleton -->
            <template v-if="tierStore.isLoading">
              <div
                v-for="n in 5"
                :key="n"
                class="h-10 bg-gray-100 rounded-lg animate-pulse"
              />
            </template>

            <!-- Tier rows -->
            <div
              v-for="tier in tierStore.tiers"
              :key="tier.id"
              class="flex items-center justify-between py-2 px-3 rounded-lg transition-colors group"
              :class="
                commissionAmount >= tier.minSalary
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-gray-50'
              "
            >
              <div class="flex items-center gap-2 flex-1 min-w-0">
                <span
                  class="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                  :class="tier.badgeClass"
                >
                  {{ tier.label }}
                </span>
                <span class="text-sm text-gray-600 truncate">
                  Average {{ tier.minSalary.toLocaleString() }}
                </span>
              </div>
              <div class="flex items-center gap-3 ml-2">
                <span class="text-sm font-bold text-gray-800"
                  >{{ tier.rate }} lakh</span
                >
                <!-- Edit / Delete — visible on hover -->
                <div
                  class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <button
                    @click="openEditModal(tier)"
                    class="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                    title="Edit"
                  >
                    <svg
                      class="w-3.5 h-3.5"
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
                    @click="confirmDelete(tier)"
                    class="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <svg
                      class="w-3.5 h-3.5"
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
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-5 py-3 bg-gray-50 border-t border-gray-100">
            <p class="text-xs text-gray-400 text-center">
              Base Salary &gt; 7 lakh required to qualify
            </p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── Create / Edit Modal ── -->
    <Transition name="fade">
      <div
        v-if="showFormModal"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50"
        @click.self="closeFormModal"
      >
        <div
          class="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
        >
          <div
            class="flex items-center justify-between px-5 py-4 border-b border-gray-100"
          >
            <h3 class="text-base font-semibold text-gray-800">
              {{ editingTier ? "Edit Tier" : "Add New Tier" }}
            </h3>
            <button
              @click="closeFormModal"
              class="text-gray-400 hover:text-gray-600 text-xl leading-none"
            >
              &times;
            </button>
          </div>

          <form @submit.prevent="submitForm" class="px-5 py-4 space-y-4">
            <!-- Label -->
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1"
                >Label</label
              >
              <input
                v-model="form.label"
                type="text"
                placeholder="e.g. Tier 18"
                required
                class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF613c]/40 focus:border-[#FF613c]"
              />
            </div>

            <!-- Min Salary & Avg Daily -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1"
                  >Avg</label
                >
                <input
                  v-model.number="form.min_salary"
                  type="number"
                  min="0"
                  required
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF613c]/40 focus:border-[#FF613c]"
                />
              </div>
              <!-- <div>
                <label class="block text-xs font-medium text-gray-600 mb-1"
                  >Avg Daily</label
                >
                <input
                  v-model.number="form.avg_daily"
                  type="number"
                  min="0"
                  required
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF613c]/40 focus:border-[#FF613c]"
                />
              </div> -->
            </div>

            <!-- Rate & Sort Order -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1"
                  >Rate (lakh MMK)</label
                >
                <input
                  v-model.number="form.rate"
                  type="number"
                  min="0"
                  step="0.5"
                  required
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF613c]/40 focus:border-[#FF613c]"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1"
                  >Sort Order</label
                >
                <input
                  v-model.number="form.sort_order"
                  type="number"
                  min="0"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF613c]/40 focus:border-[#FF613c]"
                />
              </div>
            </div>

            <!-- Is Active -->
            <div class="flex items-center gap-2">
              <input
                id="is_active"
                v-model="form.is_active"
                type="checkbox"
                class="w-4 h-4 accent-[#FF613c]"
              />
              <label for="is_active" class="text-sm text-gray-600"
                >Active</label
              >
            </div>

            <!-- Actions -->
            <div class="flex gap-2 pt-1">
              <button
                type="button"
                @click="closeFormModal"
                class="flex-1 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="tierStore.isLoading"
                class="flex-1 py-2 text-sm bg-[#FF613c] text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50"
              >
                {{
                  tierStore.isLoading
                    ? "Saving..."
                    : editingTier
                    ? "Update"
                    : "Create"
                }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- ── Delete Confirm Modal ── -->
    <Transition name="fade">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50"
        @click.self="showDeleteModal = false"
      >
        <div
          class="bg-white rounded-xl shadow-2xl w-full max-w-xs mx-4 p-6 text-center"
        >
          <div
            class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3"
          >
            <svg
              class="w-6 h-6 text-red-500"
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
          </div>
          <h3 class="text-base font-semibold text-gray-800 mb-1">
            Delete Tier
          </h3>
          <p class="text-sm text-gray-500 mb-4">
            Are you sure you want to delete
            <strong>{{ deletingTier?.label }}</strong
            >? This cannot be undone.
          </p>
          <div class="flex gap-2">
            <button
              @click="showDeleteModal = false"
              class="flex-1 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="executeDelete"
              :disabled="tierStore.isLoading"
              class="flex-1 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
            >
              {{ tierStore.isLoading ? "Deleting..." : "Delete" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../stores/auth";
import { useCommissionTierStore } from "../../stores/commissionTier";
import animation from "../../assets/congratulations-7600_256.gif";

// ── Stores ────────────────────────────────────────────
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const tierStore = useCommissionTierStore();

// ── Props ─────────────────────────────────────────────
const props = defineProps({
  salesReps: { type: Array, required: true },
});

// ── State ─────────────────────────────────────────────
const isLoadingInit = ref(true);
const commissionAmount = ref(0);
const showPopup = ref(false);

// Form modal
const showFormModal = ref(false);
const editingTier = ref(null);
const form = ref(emptyForm());

// Delete modal
const showDeleteModal = ref(false);
const deletingTier = ref(null);

function emptyForm() {
  return {
    label: "",
    min_salary: 0,
    avg_daily: 0,
    rate: 0,
    sort_order: 0,
    is_active: true,
  };
}

// ── Commission logic ──────────────────────────────────
const calculateCommission = () => {
  const tier = [...tierStore.tiers]
    .reverse()
    .find((t) => commissionAmount.value >= t.minSalary);
  return tier ? `${tier.rate} lakh MMK` : "0";
};

const nextTargetInfo = computed(() => {
  const today = new Date();
  const currentDay = today.getDate();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
  ).getDate();
  const daysLeft = daysInMonth - currentDay + 1;

  const currentMonthSales = commissionAmount.value * currentDay;
  const nextTier = tierStore.tiers.find(
    (t) => t.minSalary > commissionAmount.value,
  );
  if (!nextTier) return null;

  const needed = nextTier.minSalary * daysInMonth - currentMonthSales;
  return {
    target: nextTier.minSalary,
    tierLabel: nextTier.label,
    needed: Math.max(0, Math.round(needed)),
    daysLeft,
  };
});

const syncCommission = (reps) => {
  if (reps?.length) {
    const rep = reps.find((r) => r.id === user.value.id);
    if (rep) commissionAmount.value = rep.amount;
  }
};

// ── CRUD helpers ──────────────────────────────────────
const openCreateModal = () => {
  editingTier.value = null;
  form.value = emptyForm();
  showFormModal.value = true;
};

const openEditModal = (tier) => {
  editingTier.value = tier;
  form.value = {
    label: tier.label,
    min_salary: tier.minSalary,
    avg_daily: tier.avgDaily,
    rate: tier.rate,
    sort_order: tier.sortOrder,
    is_active: tier.isActive,
  };
  showFormModal.value = true;
};

const closeFormModal = () => {
  showFormModal.value = false;
  editingTier.value = null;
  form.value = emptyForm();
};

const submitForm = async () => {
  try {
    if (editingTier.value) {
      await tierStore.updateTier(editingTier.value.id, form.value);
    } else {
      await tierStore.createTier(form.value);
    }
    closeFormModal();
  } catch {
    // error shown via store.error
  }
};

const confirmDelete = (tier) => {
  deletingTier.value = tier;
  showDeleteModal.value = true;
};

const executeDelete = async () => {
  try {
    await tierStore.deleteTier(deletingTier.value.id);
    showDeleteModal.value = false;
    deletingTier.value = null;
  } catch {
    // error shown via store.error
  }
};

// ── Lifecycle ─────────────────────────────────────────
watch(
  () => props.salesReps,
  (reps) => syncCommission(reps),
  { deep: true },
);

onMounted(async () => {
  syncCommission(props.salesReps);
  await tierStore.fetchTiers();
  setTimeout(() => {
    isLoadingInit.value = false;
  }, 6000);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
