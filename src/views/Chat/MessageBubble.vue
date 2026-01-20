<template>
  <div class="flex" :class="{ 'justify-end': isOwnMessage }">
    <div
      class="flex items-end space-x-2 max-w-md"
      :class="{ 'flex-row-reverse space-x-reverse': isOwnMessage }"
    >
      <!-- Avatar (only for received messages) -->
      <div
        v-if="!isOwnMessage"
        class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 text-xs font-semibold flex-shrink-0"
      >
        {{ senderInitials }}
      </div>

      <!-- Message Content -->
      <div>
        <!-- Sender Name (only for received messages) -->
        <div v-if="!isOwnMessage" class="text-xs text-gray-600 mb-1 ml-2">
          {{ message.senderName }}
        </div>

        <!-- Message Bubble -->
        <div
          class="px-4 py-2 rounded-2xl"
          :class="{
            'bg-orange-100 text-gray-900': isOwnMessage,
            'bg-gray-200 text-gray-900': !isOwnMessage,
          }"
        >
          <p class="text-sm whitespace-pre-wrap break-words">
            {{ message.message }}
          </p>
        </div>

        <!-- Message Info -->
        <div
          class="flex items-center space-x-2 mt-1 px-2"
          :class="{ 'justify-end': isOwnMessage }"
        >
          <!-- Time -->
          <span class="text-xs text-gray-600">
            {{ formatMessageTime(message.createdAt) }}
          </span>

          <!-- Read Receipts (only for sent messages) -->
          <div
            v-if="isOwnMessage && message.readBy && message.readBy.length > 0"
            class="flex items-center text-xs text-gray-600"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              />
            </svg>
            <svg class="w-4 h-4 -ml-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              />
            </svg>
          </div>

          <!-- Edited Badge -->
          <span v-if="message.isEdited" class="text-xs text-gray-600 italic">
            edited
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { formatMessageTime } from "../../utils/formatDate";

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  isOwnMessage: {
    type: Boolean,
    default: false,
  },
});

const senderInitials = computed(() => {
  return (
    props.message.senderName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??"
  );
});
</script>
