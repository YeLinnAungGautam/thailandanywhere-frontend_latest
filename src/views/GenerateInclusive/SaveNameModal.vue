<!-- components/GenerateInclusive/SaveNameModal.vue -->
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
          class="modal-card relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        >
          <!-- Header -->
          <div
            class="bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-4 flex items-center justify-between"
          >
            <div>
              <h3 class="text-lg font-bold text-white">
                {{ isUpdate ? "Update Package" : "Save Package" }}
              </h3>
              <p class="text-orange-100 text-xs mt-0.5">
                {{
                  isUpdate ? "Package name ပြင်ဆင်ပါ" : "Package name ထည့်ပါ"
                }}
              </p>
            </div>
            <button
              @click="$emit('close')"
              class="w-7 h-7 rounded-full bg-white/25 hover:bg-white/40 text-white flex items-center justify-center text-xl transition"
            >
              ×
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 py-5 space-y-4">
            <!-- Package Name Input -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Package Name <span class="text-red-400">*</span>
              </label>
              <input
                ref="nameInput"
                v-model="localName"
                @keyup.enter="confirm"
                type="text"
                placeholder="e.g. Chiang Mai 4D3N Tour"
                class="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-slate-800 transition"
                :class="{ 'border-red-400': showError }"
              />
              <p v-if="showError" class="text-xs text-red-500 mt-1">
                Package name ထည့်ရန် လိုအပ်သည်
              </p>
            </div>

            <!-- Trip Summary Preview -->
            <div
              class="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5"
            >
              <p class="text-xs font-semibold text-slate-500 mb-2">
                Trip Summary
              </p>
              <div class="flex justify-between text-xs">
                <span class="text-slate-500">📅 Start Date</span>
                <span class="font-medium text-slate-700">{{
                  formatDate(startDate)
                }}</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-slate-500">🌙 Duration</span>
                <span class="font-medium text-slate-700"
                  >{{ nights }} nights / {{ nights + 1 }} days</span
                >
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-slate-500">👥 Pax</span>
                <span class="font-medium text-slate-700">
                  {{ adults }} Adults{{
                    children > 0 ? ` / ${children} Children` : ""
                  }}
                </span>
              </div>
              <div
                class="flex justify-between text-xs pt-1 border-t border-slate-200"
              >
                <span class="text-slate-500">💰 Total Selling</span>
                <span class="font-bold text-orange-600"
                  >฿{{ totalSelling.toLocaleString() }}</span
                >
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 flex gap-3">
            <button
              @click="$emit('close')"
              class="flex-1 py-3 rounded-xl border-2 border-slate-300 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              @click="confirm"
              :disabled="loading"
              class="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition flex items-center justify-center gap-2"
            >
              <span
                v-if="loading"
                class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
              />
              <span v-else>💾</span>
              {{ loading ? "Saving..." : isUpdate ? "Update" : "Save" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";

const props = defineProps({
  show: { type: Boolean, default: false },
  modelValue: { type: String, default: "" }, // package name
  isUpdate: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  startDate: { type: String, default: "" },
  nights: { type: Number, default: 0 },
  adults: { type: Number, default: 0 },
  children: { type: Number, default: 0 },
  totalSelling: { type: Number, default: 0 },
});

const emit = defineEmits(["close", "confirm", "update:modelValue"]);

const nameInput = ref(null);
const localName = ref(props.modelValue);
const showError = ref(false);

// Sync modelValue → localName
watch(
  () => props.modelValue,
  (val) => {
    localName.value = val;
  },
);

// Focus input when modal opens
watch(
  () => props.show,
  async (val) => {
    if (val) {
      showError.value = false;
      await nextTick();
      nameInput.value?.focus();
    }
  },
);

const confirm = () => {
  if (!localName.value.trim()) {
    showError.value = true;
    nameInput.value?.focus();
    return;
  }
  showError.value = false;
  emit("update:modelValue", localName.value.trim());
  emit("confirm", localName.value.trim());
};

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
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
.modal-fade-enter-active .modal-card,
.modal-fade-leave-active .modal-card {
  transition: transform 0.22s ease, opacity 0.22s ease;
}
.modal-fade-enter-from .modal-card {
  transform: scale(0.94) translateY(10px);
  opacity: 0;
}
.modal-fade-leave-to .modal-card {
  transform: scale(0.94) translateY(10px);
  opacity: 0;
}
</style>
