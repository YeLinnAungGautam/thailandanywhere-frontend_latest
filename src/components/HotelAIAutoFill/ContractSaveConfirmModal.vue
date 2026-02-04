<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20"
      >
        <!-- Background overlay -->
        <div
          class="fixed inset-0 bg-gray-900 bg-opacity-75"
          @click="handleNo"
        ></div>

        <!-- Modal panel -->
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div class="p-6">
            <!-- Icon -->
            <div class="flex justify-center mb-4">
              <div
                class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center"
              >
                <span class="text-3xl">📄</span>
              </div>
            </div>

            <!-- Content -->
            <div class="text-center mb-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                Save Contract File?
              </h3>
              <p class="text-gray-600 text-sm">
                Do you want to save the uploaded contract file ({{ fileName }})
                with the hotel records?
              </p>
            </div>

            <!-- File info -->
            <div class="bg-gray-50 rounded-lg p-3 mb-6">
              <div class="flex items-center gap-3">
                <DocumentIcon class="w-5 h-5 text-gray-600" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ fileName }}
                  </p>
                  <p class="text-xs text-gray-600">
                    {{ fileSize }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
              <button
                @click="handleNo"
                class="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
              >
                No, Don't Save
              </button>
              <button
                @click="handleYes"
                class="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Yes, Save It
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from "vue";
import { DocumentIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  isOpen: Boolean,
  file: Object,
});

const emit = defineEmits(["yes", "no"]);

const fileName = computed(() => props.file?.name || "Contract.pdf");
const fileSize = computed(() => {
  if (!props.file?.size) return "";
  const bytes = props.file.size;
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
});

const handleYes = () => {
  emit("yes");
};

const handleNo = () => {
  emit("no");
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
