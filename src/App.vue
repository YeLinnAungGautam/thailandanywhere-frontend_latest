<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <main>
    <div class="bg-image bg-with-image font-roboto">
      <div
        class="main-content bg-opacity-50 backdrop-filter backdrop-blur-xl"
      >
        <RouterView />
      </div>
    </div>
  </main>
</template>

<style>
.bg-with-image {
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("./background.png");
}
</style>
