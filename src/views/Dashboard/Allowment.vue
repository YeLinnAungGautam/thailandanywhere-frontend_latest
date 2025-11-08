<template>
  <div class="grid grid-cols-3 gap-4">
    <div class="col-span-2">
      <AllowmentGraph />
    </div>
    <div class="col-span-1">
      <AllowmentSearch />
    </div>
  </div>
</template>

<script setup>
import AllowmentGraph from "./AllowmentGraph.vue";
import AllowmentSearch from "./AllowmentSearch.vue";
</script>
