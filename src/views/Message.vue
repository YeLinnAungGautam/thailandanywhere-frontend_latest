<template>
  <div class="send-message">
    <h2>LINE Message Test</h2>

    <div class="form-group">
      <textarea
        v-model="message"
        placeholder="Type your message here..."
        rows="4"
        :disabled="store.loading"
      />
    </div>

    <button @click="handleSend" :disabled="store.loading || !message.trim()">
      {{ store.loading ? "Sending..." : "Send to LINE" }}
    </button>

    <!-- Success -->
    <div v-if="store.success" class="alert success">
      ✅ Message sent successfully!
    </div>

    <!-- Error -->
    <div v-if="store.error" class="alert error">❌ {{ store.error }}</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useMessageStore } from "../stores/message";

const store = useMessageStore();
const message = ref("");

async function handleSend() {
  await store.sendLineMessage(message.value);
  if (store.success) {
    message.value = ""; // clear after send
  }
}
</script>

<style scoped>
.send-message {
  max-width: 500px;
  margin: 40px auto;
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 12px;
}

h2 {
  margin-bottom: 16px;
  color: #06c755; /* LINE green */
}

.form-group {
  margin-bottom: 12px;
}

textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #06c755;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

.alert {
  margin-top: 16px;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
}

.success {
  background-color: #e6f9ee;
  color: #06c755;
}

.error {
  background-color: #fdecea;
  color: #e00;
}
</style>
