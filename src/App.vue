<!-- <script setup>
import { RouterLink, RouterView } from "vue-router";
</script> -->

<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "./stores/auth";
import { useSocketStore } from "./stores/socket";
import { RouterLink, RouterView } from "vue-router";

const authStore = useAuthStore();
const socketStore = useSocketStore();

onMounted(() => {
  console.log("🚀 App mounted");

  // Load auth from localStorage
  authStore.loadFromStorage();

  // ✅ ADD THIS - Auto-connect socket if logged in
  if (authStore.isAuthenticated && authStore.token) {
    console.log("✅ User authenticated, connecting socket...");

    setTimeout(() => {
      socketStore.connect();
    }, 1000);
  }

  // ✅ ADD THIS - Listen for login events
  window.addEventListener("auth:login", (event) => {
    console.log("🔔 Login event detected");
    setTimeout(() => {
      socketStore.connect();
    }, 500);
  });
});
</script>

<template>
  <main>
    <div class="bg-image bg-with-image font-roboto">
      <div class="main-content bg-opacity-50 backdrop-filter backdrop-blur-xl">
        <RouterView />
      </div>
    </div>
  </main>
</template>

<style>
.bg-with-image {
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("/background.png");
}
</style>
