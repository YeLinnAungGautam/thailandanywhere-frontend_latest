<template>
  <div>
    <div class="col-span-2 pb-20">
      <div class="flex justify-between pb-2 items-center">
        <div class="flex justify-start items-center gap-x-2">
          <p class="pb-1 text-lg font-medium text-[#FF613c]">
            Payment Received
          </p>
          <p
            @click="router.push(`/bookings/new-update/${detail?.booking?.id}`)"
            class="text-center rounded-lg text-[10px] bg-[#FF613c] text-white px-3 py-0.5 cursor-pointer hover:bg-[#e55139]"
          >
            {{ detail?.booking?.crm_id }}
          </p>
          <p
            class="text-center rounded-lg text-[8px] text-white px-3 py-1"
            :class="{
              'bg-green-500': detail?.booking?.payment_status == 'fully_paid',
              'bg-red-500': detail?.booking?.payment_status != 'fully_paid',
            }"
          >
            {{ detail?.booking?.payment_status }}
          </p>
        </div>
      </div>
      <div class="pt-2 space-y-4 h-auto pb-6 overflow-y-auto">
        <!-- Regular receipts and Internal transfers -->
        <template
          v-for="(receipt, index) in detail?.booking?.receipts ?? []"
          :key="index"
        >
          <!-- Internal Transfer Card -->
          <div
            v-if="receipt?.is_internal_transfer"
            class="border border-gray-200 rounded-lg p-4 bg-white shadow"
          >
            <div class="flex justify-between items-center mb-3">
              <div class="flex items-center gap-2">
                <span
                  class="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium"
                >
                  Internal Transfer
                </span>
                <span class="text-xs text-gray-600"
                  >Rate: {{ receipt.exchange_rate }}</span
                >
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <!-- FROM Section -->
              <div class="bg-red-50 rounded-lg p-3">
                <h4 class="text-xs font-semibold text-red-700 mb-2">FROM</h4>
                <div
                  v-for="fromFile in receipt.from_files"
                  :key="fromFile.id"
                  class="space-y-2"
                >
                  <div
                    class="bg-white rounded border border-red-200 overflow-hidden"
                  >
                    <img
                      :src="fromFile.image"
                      class="w-full h-32 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      @click="openModal(fromFile.image, fromFile)"
                      alt="From receipt"
                    />
                  </div>
                  <div class="text-xs space-y-1">
                    <p class="font-semibold text-gray-900">
                      Amount:
                      <span class="text-red-600"
                        >{{ fromFile.currency }}
                        {{ formattedNumber(fromFile.amount) }}</span
                      >
                    </p>
                    <p class="text-gray-600">From: {{ fromFile.sender }}</p>
                    <p class="text-gray-600">To: {{ fromFile.receiver }}</p>
                    <p class="text-gray-600">
                      Bank: {{ fromFile.interact_bank }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- TO Section -->
              <div class="bg-green-50 rounded-lg p-3">
                <h4 class="text-xs font-semibold text-green-700 mb-2">TO</h4>
                <div class="space-y-3">
                  <div
                    v-for="toFile in receipt.to_files"
                    :key="toFile.id"
                    class="space-y-2"
                  >
                    <div
                      class="bg-white rounded border border-green-200 overflow-hidden"
                    >
                      <img
                        :src="toFile.image"
                        class="w-full h-32 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        @click="openModal(toFile.image, toFile)"
                        alt="To receipt"
                      />
                    </div>
                    <div class="text-xs space-y-1">
                      <p class="font-semibold text-gray-900">
                        Amount:
                        <span class="text-green-600"
                          >{{ toFile.currency }}
                          {{ formattedNumber(toFile.amount) }}</span
                        >
                      </p>
                      <p class="text-gray-600">From: {{ toFile.sender }}</p>
                      <p class="text-gray-600">To: {{ toFile.receiver }}</p>
                      <p class="text-gray-600">
                        Bank: {{ toFile.interact_bank }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notes Section -->
            <div
              v-if="receipt.notes"
              class="mt-3 pt-3 border-t border-gray-200"
            >
              <p class="text-xs text-gray-600">
                <span class="font-medium">Note:</span> {{ receipt.notes }}
              </p>
            </div>
          </div>

          <!-- Regular Receipt Card (non-internal transfer) -->
          <div v-else class="inline-block">
            <div
              class="flex flex-col relative justify-stretch group space-y-2 w-64"
            >
              <div
                class="h-[286px] w-full cursor-pointer"
                @click="openModal(receipt.image, receipt)"
              >
                <img
                  :src="receipt?.image"
                  class="rounded-lg shadow hover:shadow-lg transition-shadow h-full object-cover object-top w-full"
                  alt="Payment receipt"
                />
              </div>
              <div
                class="w-full px-4 pb-1 border space-y-2 text-[#FF613c] border-gray-200 shadow hover:shadow-none rounded-lg"
              >
                <p class="text-[12px] flex justify-start items-center pt-2">
                  {{ receipt?.amount }} thb
                </p>
                <p class="text-[12px] flex justify-start items-center pb-2">
                  {{
                    receipt?.date ? formatDateFromDb(receipt?.date) : "--/--/--"
                  }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <!-- Expense Images -->
        <div class="col-span-2">
          <p class="pb-1 text-lg font-medium text-[#FF613c]">Expense slip</p>
        </div>
        <div
          v-for="(image, index) in detail.expense ?? []"
          :key="index"
          @click="openModal(image.image, image)"
          class="relative space-y-1 pb-20"
        >
          <img
            :src="image.image"
            alt=""
            class="rounded-lg w-full h-full min-h-[210px] object-cover"
          />

          <div
            class="w-full px-4 pb-1 mt-2 border space-y-2 text-[#FF613c] border-gray-200 shadow hover:shadow-none rounded-lg"
          >
            <p class="text-[10px] flex justify-start items-center pt-2">
              {{ image?.bank_name }}
            </p>
            <p class="text-[10px] flex justify-start items-center">
              {{ image?.amount }}
            </p>
            <p class="text-[10px] flex justify-start items-center pb-2">
              {{ image?.date }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="modalOpen"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90"
          @click.self="closeModal"
        >
          <!-- Close Button -->
          <button
            @click="closeModal"
            class="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>

          <!-- Zoom Controls -->
          <div
            class="absolute top-4 left-4 z-10 flex gap-2 bg-white/10 rounded-lg p-2"
          >
            <button
              @click="zoomOut"
              class="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Zoom Out"
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                />
              </svg>
            </button>
            <button
              @click="resetZoom"
              class="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
            >
              {{ Math.round(zoomLevel * 100) }}%
            </button>
            <button
              @click="zoomIn"
              class="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Zoom In"
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                />
              </svg>
            </button>
          </div>

          <!-- Image Container -->
          <div
            class="relative max-w-7xl max-h-full flex items-center justify-center"
          >
            <div
              class="relative overflow-auto max-h-[90vh] rounded-lg"
              ref="imageContainer"
            >
              <img
                :src="selectedImage"
                :style="{ transform: `scale(${zoomLevel})` }"
                class="max-w-full max-h-full object-contain transition-transform duration-200 cursor-move"
                alt="Preview"
                @wheel.prevent="handleWheel"
                @mousedown="startDrag"
                @mousemove="onDrag"
                @mouseup="stopDrag"
                @mouseleave="stopDrag"
              />
            </div>
          </div>

          <!-- Receipt Details (if available) -->
          <div
            v-if="selectedReceipt"
            class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6"
          >
            <div
              class="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-white"
            >
              <div>
                <p class="text-xs text-gray-300">Amount</p>
                <p class="text-lg font-semibold">
                  {{ selectedReceipt.currency || "THB" }}
                  {{ formattedNumber(selectedReceipt.amount) }}
                </p>
              </div>
              <div v-if="selectedReceipt.sender">
                <p class="text-xs text-gray-300">From</p>
                <p class="text-sm font-medium">{{ selectedReceipt.sender }}</p>
              </div>
              <div v-if="selectedReceipt.receiver">
                <p class="text-xs text-gray-300">To</p>
                <p class="text-sm font-medium">
                  {{ selectedReceipt.receiver }}
                </p>
              </div>
              <div v-if="selectedReceipt.date">
                <p class="text-xs text-gray-300">Date</p>
                <p class="text-sm font-medium">
                  {{ formatDateFromDb(selectedReceipt.date) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Download Button -->
          <a
            :href="selectedImage"
            download
            class="absolute bottom-4 right-4 z-10 p-3 rounded-full bg-[#FF613c] hover:bg-[#e55139] text-white transition-colors shadow-lg"
            title="Download Image"
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </a>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { XMarkIcon } from "@heroicons/vue/24/outline";

defineProps({
  detail: {
    type: Object,
    required: true,
  },
  getDetailAction: {
    type: Function,
    required: true,
  },
});

const router = useRouter();

// Modal state
const modalOpen = ref(false);
const selectedImage = ref("");
const selectedReceipt = ref(null);
const zoomLevel = ref(1);
const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });
const imageContainer = ref(null);

// Open modal
const openModal = (image, receipt = null) => {
  selectedImage.value = image;
  selectedReceipt.value = receipt;
  modalOpen.value = true;
  zoomLevel.value = 1;
  document.body.style.overflow = "hidden";
};

// Close modal
const closeModal = () => {
  modalOpen.value = false;
  selectedImage.value = "";
  selectedReceipt.value = null;
  zoomLevel.value = 1;
  document.body.style.overflow = "";
};

// Zoom functions
const zoomIn = () => {
  if (zoomLevel.value < 3) {
    zoomLevel.value += 0.2;
  }
};

const zoomOut = () => {
  if (zoomLevel.value > 0.5) {
    zoomLevel.value -= 0.2;
  }
};

const resetZoom = () => {
  zoomLevel.value = 1;
};

const handleWheel = (event) => {
  if (event.deltaY < 0) {
    zoomIn();
  } else {
    zoomOut();
  }
};

// Drag functions
const startDrag = (event) => {
  if (zoomLevel.value > 1) {
    isDragging.value = true;
    dragStart.value = {
      x: event.clientX - (imageContainer.value?.scrollLeft || 0),
      y: event.clientY - (imageContainer.value?.scrollTop || 0),
    };
  }
};

const onDrag = (event) => {
  if (isDragging.value && imageContainer.value) {
    const x = event.clientX - dragStart.value.x;
    const y = event.clientY - dragStart.value.y;
    imageContainer.value.scrollLeft = -x;
    imageContainer.value.scrollTop = -y;
  }
};

const stopDrag = () => {
  isDragging.value = false;
};

// Utility function
const formattedNumber = (number) => {
  return new Intl.NumberFormat("en-US").format(number);
};

const formatDateFromDb = (dateString) => {
  const [datePart, timePart] = dateString.split(" ");
  const [day, month, year] = datePart.split("-");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = monthNames[parseInt(month) - 1];
  return `${day}/${monthName}/${year} ${timePart}`;
};

// Close modal on ESC key
const handleKeydown = (event) => {
  if (event.key === "Escape" && modalOpen.value) {
    closeModal();
  }
};

// Add event listener
onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = "";
});
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar for image container */
.overflow-auto::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
