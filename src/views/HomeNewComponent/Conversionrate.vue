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
      <p class="text-gray-500 text-sm font-medium mb-2">COMMISSION</p>
      <div class="flex items-end gap-4 mb-2">
        <span class="text-4xl font-bold text-gray-900"> --- MMK</span>
      </div>
      <div class="mt-4 pt-4 border-t border-gray-200">
        <p class="text-gray-500 text-sm font-medium mb-2">
          AVERAGE DAILY TARGET
        </p>
        <p class="text-4xl font-bold text-[#FF613c]">--- DAYS</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import animation from "../../assets/congratulations-7600_256.gif";

defineProps({
  rate: {
    type: Number,
    default: 120000,
  },
  value: {
    type: Number,
    default: 2730,
  },
});

const isLoading = ref(true);

onMounted(() => {
  // Hide loading animation after 2.5 seconds
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
