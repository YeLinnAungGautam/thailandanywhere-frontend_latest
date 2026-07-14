<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div class="absolute inset-0 bg-slate-900/50" @click="$emit('close')" />

      <div class="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div
          class="flex h-11 w-11 items-center justify-center rounded-full bg-rose-50"
        >
          <svg
            viewBox="0 0 24 24"
            class="h-5 w-5 text-rose-500"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
            />
          </svg>
        </div>

        <h3 class="mt-4 text-base font-semibold text-slate-800">
          Delete this coupon?
        </h3>
        <p class="mt-1 text-sm text-slate-500">
          <span class="font-medium text-slate-700">{{
            promo?.promo_code
          }}</span>
          will be permanently removed and can no longer be redeemed. This can't
          be undone.
        </p>

        <p v-if="error" class="mt-3 text-xs text-rose-500">{{ error }}</p>

        <div class="mt-6 flex justify-end gap-3">
          <button
            type="button"
            class="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
            @click="$emit('close')"
          >
            Cancel
          </button>
          <button
            type="button"
            :disabled="deleting"
            class="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
            @click="$emit('confirm')"
          >
            <svg
              v-if="deleting"
              class="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                stroke-width="3"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M12 3a9 9 0 0 1 9 9h-3a6 6 0 0 0-6-6V3Z"
              />
            </svg>
            Delete coupon
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  open: { type: Boolean, default: false },
  promo: { type: Object, default: null },
  deleting: { type: Boolean, default: false },
  error: { type: String, default: "" },
});

defineEmits(["close", "confirm"]);
</script>
