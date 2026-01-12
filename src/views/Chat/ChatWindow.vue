<template>
  <div class="flex-1 flex flex-col bg-white">
    <!-- Chat Header -->
    <ChatHeader />

    <!-- Messages Container -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
      <!-- Loading -->
      <div v-if="chatStore.messagesLoading" class="text-center text-gray-600">
        Loading messages...
      </div>

      <!-- Messages -->
      <div v-else>
        <MessageBubble
          v-for="message in chatStore.currentMessages"
          :key="message._id"
          :message="message"
          :is-own-message="isOwnMessage(message)"
        />
      </div>

      <!-- Typing Indicator -->
      <div
        v-if="typingUsers.length > 0"
        class="flex items-center space-x-2 text-sm text-gray-600"
      >
        <div class="flex space-x-1">
          <span
            class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style="animation-delay: 0ms"
          ></span>
          <span
            class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style="animation-delay: 150ms"
          ></span>
          <span
            class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style="animation-delay: 300ms"
          ></span>
        </div>
        <span
          >{{ typingUsers.join(", ") }}
          {{ typingUsers.length === 1 ? "is" : "are" }} typing...</span
        >
      </div>
    </div>

    <!-- Message Input -->
    <MessageInput @send="handleSendMessage" />
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { useChatStore } from "../../stores/chat";
import { useSocketStore } from "../../stores/socket";
import { useAuthStore } from "../../stores/auth";
import ChatHeader from "./ChatHeader.vue";
import MessageBubble from "./MessageBubble.vue";
import MessageInput from "./MessageInput.vue";

const chatStore = useChatStore();
const socketStore = useSocketStore();
const authStore = useAuthStore();

const messagesContainer = ref(null);

const typingUsers = computed(() => {
  if (!chatStore.currentConversation) return [];
  return socketStore.getTypingUsers(chatStore.currentConversation._id);
});

function isOwnMessage(message) {
  // console.log(message);

  return message.senderId == authStore.user?.id;
}

const isSocketConnected = computed(() => {
  return socketStore.isConnected || socketStore.socket?.connected || false;
});

function handleSendMessage(message) {
  if (!chatStore.currentConversation) {
    console.error("❌ No conversation selected");
    return;
  }

  console.log("📊 Connection check before sending:");
  console.log("  - socketStore.connected:", socketStore.connected);
  console.log("  - socketStore.isConnected:", socketStore.isConnected);
  console.log("  - socket?.connected:", socketStore.socket?.connected);
  console.log("  - isSocketConnected:", isSocketConnected.value);

  if (!isSocketConnected.value) {
    console.error("❌ Socket not connected, attempting to reconnect...");
    alert("Connection lost. Please wait...");
    socketStore.connect();
    return;
  }

  try {
    socketStore.sendMessage(chatStore.currentConversation._id, message);
  } catch (error) {
    console.error("❌ Failed to send message:", error.message);
    alert("Failed to send message: " + error.message);
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
}

// Watch for new messages and scroll to bottom
watch(
  () => chatStore.currentMessages.length,
  () => {
    scrollToBottom();
  }
);

// Scroll to bottom when conversation changes
watch(
  () => chatStore.currentConversation,
  () => {
    scrollToBottom();
  }
);
</script>
