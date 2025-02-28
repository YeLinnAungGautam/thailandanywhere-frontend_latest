<template>
  <div class="deepseek-chat">
    <!-- <div class="input-container">
      <input
        v-model="userInput"
        placeholder="Ask something..."
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage" :disabled="loading">Send</button>
    </div> -->

    <!-- <div class="messages">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="[
          'message',
          message.role === 'user' ? 'user-message' : 'assistant-message',
        ]"
      >
        {{ message.content }}
      </div>
    </div> -->

    <!-- <div v-if="loading" class="loading">Loading...</div> -->
    <div v-if="apiError" class="error">{{ apiError }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, defineProps, watch } from "vue";
import { useDeepseek } from "../../services/useDeepseek";

const props = defineProps({
  userInput: String,
});
const emit = defineEmits(["generateMessage"]);

// Get API key from environment variables
const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY; // For Vite
// Or if using Vue CLI:
// const apiKey = process.env.VUE_APP_DEEPSEEK_API_KEY;

// State management
const messages = ref([]);
const loading = ref(false);

// Initialize DeepSeek API
const {
  initialize,
  getChatCompletion,
  error: apiError,
  isInitialized,
} = useDeepseek(apiKey);

// Initialize on component mount
onMounted(() => {
  initialize();
});

// watch userInput
watch(
  () => props.userInput,
  (newVal) => {
    if (newVal) {
      sendMessage();
    }
  }
);

// Send message to DeepSeek API
const sendMessage = async () => {
  if (!props.userInput.trim() || !isInitialized.value) return;

  // Add user message to the list
  messages.value.push({ role: "user", content: props.userInput });
  const query = props.userInput;
  props.userInput = "";

  loading.value = true;

  try {
    // Prepare messages for the API call
    const apiMessages = [
      { role: "system", content: "You are a helpful assistant." },
      ...messages.value,
    ];

    // Get completion from DeepSeek API
    const response = await getChatCompletion(apiMessages);

    // return response
    console.log(response);
    // Emit the generated message
    emit("generateMessage", response);

    // Add assistant's response to the chat
    messages.value.push({ role: "assistant", content: response });
  } catch (error) {
    console.error("Error getting chat completion:", error);
  } finally {
    loading.value = false;
  }
};
</script>
