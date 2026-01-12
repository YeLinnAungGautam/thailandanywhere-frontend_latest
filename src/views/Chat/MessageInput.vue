<template>
  <div class="border-t border-gray-200 p-4 bg-white">
    <form @submit.prevent="handleSubmit" class="flex items-end space-x-2">
      <!-- Text Input -->
      <div class="flex-1">
        <textarea
          v-model="message"
          ref="textareaRef"
          @input="handleInput"
          @keydown.enter.exact.prevent="handleSubmit"
          rows="1"
          placeholder="Type a message..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          style="max-height: 120px"
        ></textarea>
      </div>

      <!-- Send Button -->
      <button
        type="submit"
        :disabled="!message.trim()"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex-shrink-0"
      >
        Send
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useChatStore } from "../../stores/chat";
import { useSocketStore } from "../../stores/socket";

const emit = defineEmits(["send"]);

const chatStore = useChatStore();
const socketStore = useSocketStore();

const message = ref("");
const textareaRef = ref(null);
let typingTimeout = null;

function handleInput() {
  const textarea = textareaRef.value;
  if (textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }

  // Typing indicator
  if (chatStore.currentConversation) {
    socketStore.startTyping(chatStore.currentConversation._id);

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socketStore.stopTyping(chatStore.currentConversation._id);
    }, 1000);
  }
}

function handleSubmit() {
  const text = message.value.trim();
  if (!text) return;

  emit("send", text);
  message.value = "";

  // Reset textarea height
  if (textareaRef.value) {
    textareaRef.value.style.height = "auto";
  }

  // Stop typing indicator
  if (chatStore.currentConversation) {
    socketStore.stopTyping(chatStore.currentConversation._id);
  }
}

// Stop typing when conversation changes
watch(
  () => chatStore.currentConversation,
  () => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
  }
);
</script>
