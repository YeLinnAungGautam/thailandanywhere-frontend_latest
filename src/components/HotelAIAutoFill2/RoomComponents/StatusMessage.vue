<template>
  <div
    v-if="status === 'success'"
    class="bg-green-50 rounded-xl p-4 border-2 border-green-200"
  >
    <div class="flex items-center gap-3">
      <span class="text-2xl">✅</span>
      <div>
        <h4 class="font-bold text-green-800">Room Saved Successfully!</h4>
        <p class="text-sm text-green-700">
          This room has been {{ action === "create" ? "created" : "merged" }}.
        </p>
      </div>
    </div>
  </div>

  <div
    v-else-if="status === 'skipped'"
    class="bg-orange-50 rounded-xl p-4 border-2 border-orange-200"
  >
    <div class="flex items-center gap-3">
      <span class="text-2xl">⊘</span>
      <div>
        <h4 class="font-bold text-orange-800">Room Skipped</h4>
        <p class="text-sm text-orange-700">
          You chose to skip this room. You can select it again to process it.
        </p>
      </div>
    </div>
  </div>

  <div
    v-else-if="status === 'error'"
    class="bg-red-50 rounded-xl p-4 border-2 border-red-200"
  >
    <div class="flex items-start gap-3">
      <span class="text-2xl">⚠️</span>
      <div>
        <h4 class="font-bold text-red-800">Error Processing Room</h4>
        <p class="text-sm text-red-700">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  status: String,
  action: String,
  error: String,
});
</script>
