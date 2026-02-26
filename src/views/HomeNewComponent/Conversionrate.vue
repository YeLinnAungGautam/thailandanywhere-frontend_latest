<template>
  <div class="relative">
    <Transition name="fade">
      <div
        v-if="isLoading"
        class="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white/10 z-10"
      >
        <img
          :src="animation"
          alt="Loading"
          class="w-full h-full object-cover"
        />
      </div>
    </Transition>

    <div class="bg-white rounded-lg shadow-sm p-8">
      <p class="text-gray-500 text-sm font-medium mb-2">AVERAGE</p>
      <div class="flex items-end gap-4 mb-2">
        <span class="text-4xl font-bold text-gray-900">{{
          commissionAmount.toFixed(2)
        }}</span>
      </div>

      <div class="mt-4 pt-4 border-t border-gray-200">
        <div class="flex items-center gap-2 mb-2">
          <p class="text-gray-500 text-sm font-medium">COMMISSION</p>
          <!-- Info Icon -->
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

    <!-- Info Popup Overlay -->
    <Transition name="fade">
      <div
        v-if="showPopup"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        @click.self="showPopup = false"
      >
        <div
          class="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 overflow-hidden"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between px-5 py-4 border-b border-gray-100"
          >
            <h3 class="text-base font-semibold text-gray-800">
              Commission Tiers
            </h3>
            <button
              @click="showPopup = false"
              class="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
            >
              &times;
            </button>
          </div>

          <!-- Tier Table -->
          <div class="px-5 py-4 space-y-2 max-h-96 overflow-y-auto">
            <!-- Warning Row -->
            <div
              class="flex items-center justify-between py-2 px-3 rounded-lg bg-red-50"
            >
              <div class="flex items-center gap-2">
                <span class="text-red-500 font-bold text-sm">⚠</span>
                <span class="text-sm text-gray-700">Less than 15,000</span>
              </div>
              <span class="text-sm font-semibold text-red-500">Warning</span>
            </div>

            <!-- Tier Rows -->
            <div
              v-for="tier in commissionTiers"
              :key="tier.label"
              class="flex items-center justify-between py-2 px-3 rounded-lg transition-colors"
              :class="[
                commissionAmount >= tier.minSalary
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-gray-50',
              ]"
            >
              <div class="flex items-center gap-2">
                <span
                  class="text-xs font-semibold px-2 py-0.5 rounded-full"
                  :class="tier.badgeClass"
                >
                  {{ tier.label }}
                </span>
                <span class="text-sm text-gray-600">
                  Average {{ tier.avgDaily.toLocaleString() }}
                </span>
              </div>
              <span class="text-sm font-bold text-gray-800">
                {{ tier.rate }} lakh
              </span>
            </div>
          </div>

          <!-- Footer note -->
          <div class="px-5 py-3 bg-gray-50 border-t border-gray-100">
            <p class="text-xs text-gray-400 text-center">
              Base Salary &gt; 7 lakh required to qualify
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, defineProps } from "vue";
import animation from "../../assets/congratulations-7600_256.gif";
import { useAuthStore } from "../../stores/auth";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const props = defineProps({
  salesReps: {
    type: Array,
    required: true,
  },
});

const isLoading = ref(true);
const commissionAmount = ref(0);
const showPopup = ref(false);

const commissionTiers = [
  {
    minSalary: 20000,
    avgDaily: 20000,
    rate: 7,
    label: "Tier 1",
    badgeClass: "bg-blue-100 text-blue-600",
  },
  {
    minSalary: 30000,
    avgDaily: 30000,
    rate: 8,
    label: "Tier 2",
    badgeClass: "bg-cyan-100 text-cyan-700",
  },
  {
    minSalary: 40000,
    avgDaily: 40000,
    rate: 10,
    label: "Tier 3",
    badgeClass: "bg-teal-100 text-teal-700",
  },
  {
    minSalary: 50000,
    avgDaily: 50000,
    rate: 12,
    label: "Tier 4",
    badgeClass: "bg-green-100 text-green-700",
  },
  {
    minSalary: 60000,
    avgDaily: 60000,
    rate: 15,
    label: "Tier 5",
    badgeClass: "bg-yellow-100 text-yellow-700",
  },
  {
    minSalary: 70000,
    avgDaily: 70000,
    rate: 18,
    label: "Tier 6",
    badgeClass: "bg-orange-100 text-orange-600",
  },
  {
    minSalary: 80000,
    avgDaily: 80000,
    rate: 20,
    label: "Tier 7",
    badgeClass: "bg-rose-100 text-rose-600",
  },
  {
    minSalary: 90000,
    avgDaily: 90000,
    rate: 22,
    label: "Tier 8",
    badgeClass: "bg-pink-100 text-pink-600",
  },
  {
    minSalary: 100000,
    avgDaily: 100000,
    rate: 25,
    label: "Tier 9",
    badgeClass: "bg-purple-100 text-purple-700",
  },
];

const calculateCommission = () => {
  const tier = [...commissionTiers]
    .reverse()
    .find((tier) => commissionAmount.value >= tier.minSalary);
  return tier ? `${tier.rate} lakh MMK` : "0";
};

// Helper to sync commission from salesReps
const syncCommission = (reps) => {
  if (reps && reps.length > 0) {
    const currentUserRep = reps.find((rep) => rep.id === user.value.id);
    if (currentUserRep) {
      commissionAmount.value = currentUserRep.amount;
    }
  }
};

// Watch salesReps prop for changes (e.g. when parent fetches data async)
watch(
  () => props.salesReps,
  (newReps) => {
    console.log("salesReps updated:", newReps);
    syncCommission(newReps);
  },
  { deep: true, immediate: false },
);

onMounted(() => {
  console.log("====================================");
  console.log(props.salesReps, user.value.id);
  console.log("====================================");

  syncCommission(props.salesReps);

  console.log(commissionAmount.value, "this is amount");

  setTimeout(() => {
    isLoading.value = false;
  }, 6000);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
