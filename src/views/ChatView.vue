<template>
  <div>
    <Layout>
      <div class="h-[85vh] flex flex-col bg-gray-50">
        <!-- Loading State -->
        <div
          v-if="chatStore.loading"
          class="flex-1 flex items-center justify-center"
        >
          <div class="text-center">
            <div
              class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
            ></div>
            <p class="text-gray-600">Loading conversations...</p>
          </div>
        </div>

        <!-- Error State -->
        <div
          v-else-if="chatStore.error"
          class="flex-1 flex items-center justify-center"
        >
          <div class="text-center">
            <div class="text-red-600 text-4xl mb-4">⚠️</div>
            <p class="text-gray-900 font-semibold mb-2">Failed to load chat</p>
            <p class="text-gray-600 mb-4">{{ chatStore.error }}</p>
            <button
              @click="retry"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>

        <!-- Main Chat UI -->
        <template v-else>
          <!-- Navbar -->
          <Navbar />

          <!-- Main Chat Container -->
          <div class="flex-1 flex overflow-hidden">
            <!-- Conversation List Sidebar -->
            <ConversationList />

            <!-- Chat Window -->
            <ChatWindow v-if="chatStore.currentConversation" />

            <!-- Empty State -->
            <div
              v-else
              class="flex-1 flex items-center justify-center bg-white"
            >
              <div class="text-center">
                <div class="text-6xl mb-4">💬</div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">
                  Select a conversation
                </h3>
                <p class="text-gray-600">
                  Choose a conversation from the list to start chatting
                </p>
              </div>
            </div>
          </div>
        </template>
      </div>
    </Layout>
  </div>
</template>

<script setup>
import Layout from "./Layout.vue";
import { onMounted, onBeforeUnmount } from "vue";
import { useChatStore } from "../stores/chat";
import { useSocketStore } from "../stores/socket";
import { useAuthStore } from "../stores/auth";
import Navbar from "./Chat/Navbar.vue";
import ConversationList from "./Chat/ConservationList.vue";
import ChatWindow from "./Chat/ChatWindow.vue";

const chatStore = useChatStore();
const socketStore = useSocketStore();
const authStore = useAuthStore();

let mounted = false;

onMounted(async () => {
  // Prevent double mounting
  if (mounted) {
    console.log("⚠️ Component already mounted");
    return;
  }
  mounted = true;

  console.log("🚀 Chat view mounted");

  // ✅ ADD THIS - Request notification permission
  if ("Notification" in window && Notification.permission === "default") {
    console.log("📢 Requesting notification permission...");
    Notification.requestPermission().then((permission) => {
      console.log("Notification permission:", permission);
    });
  }

  // Check authentication
  if (!authStore.isAuthenticated) {
    console.error("❌ Not authenticated");
    return;
  }

  try {
    // Fetch conversations
    await chatStore.fetchConversations();

    // ✅ MODIFY THIS - Only connect if not already connected
    if (!socketStore.connected && !socketStore.isConnecting) {
      console.log("🔌 Connecting socket from Chat.vue...");
      setTimeout(() => {
        socketStore.connect();
      }, 500);
    } else {
      console.log("ℹ️ Socket already connected/connecting");
    }
  } catch (error) {
    console.error("❌ Failed to initialize chat:", error);
  }
});

onBeforeUnmount(() => {
  console.log("🔌 Chat view unmounting");
  // ✅ DON'T disconnect here if using global socket
  // socketStore.disconnect();
  mounted = false;
});

async function retry() {
  console.log("🔄 Retrying...");
  chatStore.error = null;
  await chatStore.fetchConversations();
  socketStore.connect();
}
</script>
