<template>
  <div class="relative">
    <Transition name="fade">
      <div
        v-if="isLoading"
        class="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white/10"
      >
        <img
          :src="animation"
          alt="Loading"
          class="w-full h-full object-cover"
        />
      </div>
    </Transition>
    <div class="bg-white rounded-lg shadow-sm p-8">
      <p class="text-gray-500 text-sm font-medium mb-2">AVRAGE</p>
      <div class="flex items-end gap-4 mb-2">
        <span class="text-4xl font-bold text-gray-900">{{
          commissionAmount.toFixed(2)
        }}</span>
      </div>
      <div class="mt-4 pt-4 border-t border-gray-200">
        <p class="text-gray-500 text-sm font-medium mb-2">COMMISSION</p>
        <p class="text-4xl font-bold text-[#FF613c]">
          {{ calculateCommission() }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from "vue";
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

const commissionTiers = [
  {
    minSalary: 20000,
    avgDaily: 20000,
    rate: 5,
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
  // Find the highest tier where commissionAmount meets the minimum
  const tier = [...commissionTiers]
    .reverse()
    .find((tier) => commissionAmount.value >= tier.minSalary);
  return tier ? `${tier.rate} LAK MMK` : "0";
};

onMounted(() => {
  // Hide loading animation after 2.5 seconds
  console.log("====================================");
  console.log(props.salesReps, user.value.id);
  console.log("====================================");

  if (props.salesReps.length > 0) {
    const currentUserRep = props.salesReps.find(
      (rep) => rep.id === user.value.id,
    );
    if (currentUserRep) {
      commissionAmount.value = currentUserRep.amount;
    }
  }

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
