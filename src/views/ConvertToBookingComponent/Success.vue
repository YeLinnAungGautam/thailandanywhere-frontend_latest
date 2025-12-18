<template>
  <div class="min-h-[60vh] flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center">
        <div class="bg-white rounded-2xl p-8 space-y-6">
          <!-- Animated Spinner -->
          <div class="flex justify-center">
            <div class="relative">
              <div
                class="w-20 h-20 border-4 border-orange-200 border-t-[#ff613c] rounded-full animate-spin"
              ></div>
              <div
                class="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-[#ff613c] rounded-full animate-ping opacity-20"
              ></div>
            </div>
          </div>

          <!-- Loading Text -->
          <div class="space-y-2">
            <h3 class="text-xl font-semibold text-gray-800">
              Processing Your Booking
            </h3>
            <p class="text-sm text-gray-500">
              Please wait while we confirm your reservation...
            </p>
          </div>

          <!-- Progress Dots -->
          <div class="flex justify-center gap-2">
            <div
              class="w-2 h-2 bg-[#ff613c] rounded-full animate-bounce"
              style="animation-delay: 0ms"
            ></div>
            <div
              class="w-2 h-2 bg-[#ff613c] rounded-full animate-bounce"
              style="animation-delay: 150ms"
            ></div>
            <div
              class="w-2 h-2 bg-[#ff613c] rounded-full animate-bounce"
              style="animation-delay: 300ms"
            ></div>
          </div>
        </div>
      </div>

      <!-- Success State -->
      <div v-else class="bg-white rounded-2xl p-2 space-y-6 animate-fadeIn">
        <!-- Success Animation -->
        <div class="flex justify-center">
          <div class="relative">
            <!-- Success Circle -->
            <div
              class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-scaleIn"
            >
              <!-- Checkmark -->
              <svg
                class="w-12 h-12 text-green-500 animate-checkmark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <!-- Confetti Animation -->
            <div class="absolute inset-0 -z-10">
              <div
                v-for="i in 8"
                :key="i"
                class="absolute w-2 h-2 bg-[#ff613c] rounded-full animate-confetti"
                :style="getConfettiStyle(i)"
              ></div>
            </div>
          </div>
        </div>

        <!-- Success Message -->
        <div class="text-center space-y-2">
          <h2 class="text-2xl font-bold text-gray-900">
            Booking Successful! 🎉
          </h2>
          <p class="text-sm text-gray-600">
            Your reservation has been confirmed
          </p>
        </div>

        <!-- CRM ID Card -->
        <div
          class="bg-gradient-to-r from-[#ff613c] to-[#ff8566] rounded-xl p-6 text-white space-y-2 transform hover:scale-105 transition-transform duration-300"
        >
          <p class="text-sm font-medium opacity-90">Booking Reference</p>
          <div class="flex items-center justify-between">
            <p class="text-3xl font-bold tracking-wider">
              {{ response?.crm_id }}
            </p>
            <button
              @click="copyCrmId"
              class="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
              title="Copy to clipboard"
            >
              <svg
                v-if="!copied"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <svg
                v-else
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
          </div>
          <p class="text-xs opacity-75">
            {{ copied ? "Copied!" : "Click to copy" }}
          </p>
        </div>

        <!-- Additional Info -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <div class="flex items-start gap-3">
            <svg
              class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p class="text-sm font-medium text-blue-900">Confirmation Sent</p>
              <p class="text-xs text-blue-700">
                Booking is created , now you can check your booking .
              </p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            @click="goToBooking"
            class="flex-1 bg-[#ff613c] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#e5562f] transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            View Booking
          </button>

          <button
            @click="goBack"
            class="flex-1 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go Back
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  response: Object,
  loading: Boolean,
});

const emit = defineEmits(["goToBooking", "goBack"]);

const copied = ref(false);
const isLoading = ref(true);

watch(
  props.response,
  () => {
    if (props.response) {
      console.log(props.response, "this is response");

      isLoading.value = false;
    }
  },
  { immediate: true }
);

watch(
  () => props.loading,
  () => {
    isLoading.value = props.loading;
  }
);

// Copy CRM ID to clipboard
const copyCrmId = async () => {
  try {
    await navigator.clipboard.writeText(props.crmId);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};

// Navigate to booking details
const goToBooking = () => {
  // router.push("/bookings/new-update/" + props.response.id);
  window.open("/bookings/new-update/" + props.response.id, "_blank");
};

// Go back to previous page
const goBack = () => {
  window.location.reload();
};

// Generate confetti animation styles
const getConfettiStyle = (index) => {
  const angle = (360 / 8) * index;
  const distance = 60;
  const x = Math.cos((angle * Math.PI) / 180) * distance;
  const y = Math.sin((angle * Math.PI) / 180) * distance;

  return {
    left: "50%",
    top: "50%",
    transform: `translate(-50%, -50%)`,
    animationDelay: `${index * 0.1}s`,
    "--tx": `${x}px`,
    "--ty": `${y}px`,
  };
};
</script>

<style scoped>
/* Fade In Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.6s ease-out;
}

/* Scale In Animation */
@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scaleIn {
  animation: scaleIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Checkmark Animation */
@keyframes checkmark {
  0% {
    stroke-dasharray: 0, 100;
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dasharray: 100, 100;
    stroke-dashoffset: 0;
  }
}

.animate-checkmark {
  stroke-dasharray: 100;
  stroke-dashoffset: 0;
  animation: checkmark 0.6s ease-out 0.3s forwards;
}

/* Confetti Animation */
@keyframes confetti {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translate(
        calc(-50% + var(--tx, 0px)),
        calc(-50% + var(--ty, 0px))
      )
      scale(0);
    opacity: 0;
  }
}

.animate-confetti {
  animation: confetti 1s ease-out forwards;
}

/* Bounce Animation for Loading Dots */
@keyframes bounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
}

.animate-bounce {
  animation: bounce 1.4s ease-in-out infinite;
}

/* Spin Animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Ping Animation */
@keyframes ping {
  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>
