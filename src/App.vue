<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "./stores/auth";
import { useSocketStore } from "./stores/socket";
import { useChatStore } from "./stores/chat";
import { RouterView } from "vue-router";

const authStore = useAuthStore();
const socketStore = useSocketStore();
const chatStore = useChatStore();

onMounted(async () => {
  console.log("🚀 App mounted");

  // Load auth from localStorage first
  authStore.loadFromStorage();

  // Only proceed if we have a token
  if (authStore.token && authStore.user) {
    console.log("✅ Auth loaded from storage, initializing app...");

    try {
      // Connect socket after a small delay to ensure auth is ready
      await new Promise((resolve) => setTimeout(resolve, 300));
      socketStore.connect();

      // Load initial chat data
      await chatStore.loadInitialData();
    } catch (error) {
      console.error("❌ App initialization failed:", error);
    }
  } else {
    console.log("ℹ️ No auth token, skipping initialization");
  }

  // Listen for login events to initialize after login
  window.addEventListener("auth:login", async (event) => {
    console.log("🔔 Login event detected, initializing...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      socketStore.connect();
      await chatStore.loadInitialData();
    } catch (error) {
      console.error("❌ Post-login initialization failed:", error);
    }
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
