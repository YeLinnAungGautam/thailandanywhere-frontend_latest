<!-- components/GenerateInclusive/SaveChoiceModal.vue -->
<!--
  Shows when the user edits a loaded package and clicks Save.
  Two choices:
    1. "Update Existing"  → update the original package (same ID, same name)
    2. "Save as New"      → create a brand-new package (ask for a new name)
-->
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
          class="modal-card relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          <!-- Header -->
          <div class="bg-slate-700 px-6 py-4 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-white">Save Package</h3>
              <p class="text-slate-300 text-xs mt-0.5">
                မည်သည့် နည်းလမ်းဖြင့် သိမ်းဆည်းမည်နည်း?
              </p>
            </div>
            <button
              @click="$emit('close')"
              class="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-xl transition"
            >
              ×
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-4">
            <!-- Current package info -->
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <p class="text-xs text-slate-500 mb-1">Currently editing</p>
              <p class="font-semibold text-slate-800 text-sm">
                {{ originalName }}
              </p>
              <p class="text-xs text-slate-400 mt-0.5">ID #{{ originalId }}</p>
            </div>

            <!-- Choice 1: Update existing -->
            <button
              @click="choose('update')"
              class="w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition group text-left"
            >
              <div
                class="w-10 h-10 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center shrink-0 transition"
              >
                <svg
                  class="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </div>
              <div>
                <p
                  class="font-semibold text-slate-800 text-sm group-hover:text-blue-700 transition"
                >
                  Update Existing
                </p>
                <p class="text-xs text-slate-500 mt-0.5">
                  "<span class="font-medium">{{ originalName }}</span
                  >" ကို တိုက်ရိုက် အပ်ဒိတ်လုပ်မည်
                </p>
              </div>
            </button>

            <!-- Choice 2: Save as new -->
            <button
              @click="choose('new')"
              class="w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 border-slate-200 hover:border-orange-400 hover:bg-orange-50 transition group text-left"
            >
              <div
                class="w-10 h-10 rounded-full bg-orange-100 group-hover:bg-orange-200 flex items-center justify-center shrink-0 transition"
              >
                <svg
                  class="w-5 h-5 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                  />
                </svg>
              </div>
              <div>
                <p
                  class="font-semibold text-slate-800 text-sm group-hover:text-orange-700 transition"
                >
                  Save as New Package
                </p>
                <p class="text-xs text-slate-500 mt-0.5">
                  မူရင်းကို မထိဘဲ Package အသစ်တစ်ခု ဖန်တီးမည်
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false },
  originalName: { type: String, default: "" },
  originalId: { type: [Number, String], default: null },
});

const emit = defineEmits(["close", "choose"]);

const choose = (mode) => {
  // mode: 'update' | 'new'
  emit("choose", mode);
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
