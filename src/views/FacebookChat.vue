<template>
  <div class="flex h-full gap-0">
    <!-- Conversation List -->
    <div
      class="w-72 flex-shrink-0 border-r border-gray-100 flex flex-col bg-white"
    >
      <!-- Header -->
      <div class="px-4 py-3 border-b border-gray-100">
        <div class="flex items-center gap-2 mb-3">
          <div
            class="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-sm"
          >
            f
          </div>
          <span class="font-semibold text-gray-800 text-sm"
            >Facebook Messenger</span
          >
        </div>

        <!-- Stats -->
        <div v-if="store.stats" class="grid grid-cols-3 gap-1.5">
          <div class="bg-white rounded-lg p-2 text-center">
            <div class="text-gray-800 font-bold text-base leading-none">
              {{ store.stats.totalUsers }}
            </div>
            <div class="text-gray-500 text-xs mt-0.5">Total</div>
          </div>
          <div class="bg-white rounded-lg p-2 text-center">
            <div class="text-green-400 font-bold text-base leading-none">
              {{ store.stats.newToday }}
            </div>
            <div class="text-gray-500 text-xs mt-0.5">New</div>
          </div>
          <div class="bg-white rounded-lg p-2 text-center">
            <div class="text-orange-400 font-bold text-base leading-none">
              {{ store.stats.activeToday }}
            </div>
            <div class="text-gray-500 text-xs mt-0.5">Active</div>
          </div>
        </div>
      </div>

      <!-- Search -->
      <div class="px-3 py-2 border-b border-gray-100">
        <input
          v-model="search"
          placeholder="Search…"
          class="w-full bg-gray-100 text-sm text-gray-200 placeholder-gray-500 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-orange-600"
        />
      </div>

      <!-- List -->
      <div class="flex-1 overflow-y-auto">
        <!-- Loading -->
        <template v-if="store.conversationsLoading">
          <div
            v-for="i in 5"
            :key="i"
            class="flex items-center gap-3 px-3 py-3 border-b border-gray-100"
          >
            <div
              class="w-9 h-9 rounded-full bg-white animate-pulse flex-shrink-0"
            />
            <div class="flex-1 space-y-1.5">
              <div class="h-3 bg-white rounded animate-pulse w-2/3" />
              <div class="h-3 bg-white rounded animate-pulse w-1/2" />
            </div>
          </div>
        </template>

        <!-- Error -->
        <div
          v-else-if="store.conversationsError"
          class="p-4 text-center text-red-400 text-sm"
        >
          {{ store.conversationsError }}
          <button
            class="block mx-auto mt-2 text-orange-400 underline text-xs"
            @click="store.fetchConversations()"
          >
            Retry
          </button>
        </div>

        <!-- Conversations -->
        <template v-else>
          <button
            v-for="conv in filteredConversations"
            :key="conv._id"
            @click="store.selectConversation(conv)"
            :class="[
              'w-full flex items-center gap-3 px-3 py-3 border-b border-gray-100 text-left transition-colors',
              store.selectedConversation?._id === conv._id
                ? 'bg-orange-900/10 border-l-2 border-l-orange-500'
                : 'hover:bg-white',
            ]"
          >
            <div
              class="w-9 h-9 rounded-full bg-orange-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            >
              {{ initials(conv.sender_name) }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-1">
                <span class="text-sm font-medium text-gray-900 truncate">{{
                  conv.sender_name
                }}</span>
                <span class="text-xs text-gray-500 flex-shrink-0">{{
                  formatTime(conv.last_message_at)
                }}</span>
              </div>
              <div class="flex items-center gap-1 mt-0.5">
                <span
                  v-if="conv.is_new_today"
                  class="text-xs bg-green-900 text-green-400 px-1.5 py-0.5 rounded font-medium"
                  >New</span
                >
                <span class="text-xs text-gray-500 truncate">{{
                  conv.sender_id
                }}</span>
              </div>
            </div>
          </button>

          <div
            v-if="filteredConversations.length === 0"
            class="text-center text-gray-600 text-sm py-10"
          >
            No conversations
          </div>
        </template>
      </div>
    </div>

    <!-- Message Area -->
    <div class="flex-1 flex flex-col min-w-0 bg-white">
      <!-- No selection -->
      <div
        v-if="!store.selectedConversation"
        class="flex-1 flex flex-col items-center justify-center text-gray-700 gap-3"
      >
        <div
          class="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-2xl font-bold text-orange-600"
        >
          f
        </div>
        <p class="text-sm">Select a conversation to view messages</p>
      </div>

      <template v-else>
        <!-- Chat Header -->
        <div
          class="flex items-center gap-3 px-5 py-3 border-b border-gray-100 bg-white flex-shrink-0"
        >
          <div
            class="w-9 h-9 rounded-full bg-orange-600 flex items-center justify-center text-white text-xs font-bold"
          >
            {{ initials(store.selectedConversation.sender_name) }}
          </div>
          <div>
            <div class="text-sm font-semibold text-gray-800">
              {{ store.selectedConversation.sender_name }}
            </div>
            <div class="text-xs text-gray-500">
              Facebook Messenger · {{ store.selectedConversation.sender_id }}
            </div>
          </div>
          <button
            @click="store.clearSelection()"
            class="ml-auto text-gray-600 hover:text-gray-400 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <!-- Messages -->
        <div
          class="flex-1 overflow-y-auto px-5 py-4 space-y-3"
          ref="messagesEl"
        >
          <div
            v-if="store.messagesLoading"
            class="flex items-center justify-center h-full text-gray-600 text-sm"
          >
            Loading messages…
          </div>
          <div
            v-else-if="store.messagesError"
            class="text-center text-red-400 text-sm py-6"
          >
            {{ store.messagesError }}
          </div>
          <template v-else>
            <div
              v-if="store.messages.length === 0"
              class="text-center text-gray-700 text-sm py-10"
            >
              No messages yet
            </div>
            <div
              v-for="msg in store.messages"
              :key="msg._id"
              :class="[
                'flex',
                msg.type === 'admin' ? 'justify-end' : 'justify-start',
              ]"
            >
              <!-- User avatar -->
              <div
                v-if="msg.type !== 'admin'"
                class="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold mr-2 mt-1 flex-shrink-0"
              >
                {{ initials(store.selectedConversation.sender_name) }}
              </div>

              <div
                :class="[
                  'max-w-xs lg:max-w-md px-3 py-2 rounded-2xl text-sm',
                  msg.type === 'admin'
                    ? 'bg-orange-600 text-gray-100 rounded-br-sm'
                    : 'bg-orange-100 text-gray-800 rounded-bl-sm',
                ]"
              >
                <!-- Image -->
                <img
                  v-if="
                    msg.content_type === 'image' ||
                    msg.content_type === 'sticker'
                  "
                  :src="msg.attachment_url"
                  class="max-w-full rounded-lg"
                />
                <!-- Video -->
                <video
                  v-else-if="msg.content_type === 'video'"
                  :src="msg.attachment_url"
                  controls
                  class="max-w-full rounded-lg"
                />
                <!-- Audio -->
                <audio
                  v-else-if="msg.content_type === 'audio'"
                  :src="msg.attachment_url"
                  controls
                  class="w-48"
                />
                <!-- Text / fallback -->
                <span v-else>{{ msg.message_text }}</span>

                <div
                  :class="[
                    'text-xs mt-1',
                    msg.type === 'admin' ? 'text-orange-200' : 'text-gray-500',
                  ]"
                >
                  {{ formatFullTime(msg.fb_timestamp) }}
                  <span v-if="msg.type === 'admin'" class="ml-1">· Admin</span>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Send error -->
        <div
          v-if="store.sendError"
          class="px-5 py-1 text-xs text-red-400 bg-red-900/20 border-t border-red-900/30"
        >
          Failed to send: {{ store.sendError }}
        </div>

        <!-- Compose -->
        <div
          class="flex gap-2 px-4 py-3 border-t border-gray-100 bg-white flex-shrink-0"
        >
          <input
            v-model="input"
            @keydown.enter.exact.prevent="send"
            placeholder="Reply on Messenger…"
            class="flex-1 bg-white text-sm text-gray-800 placeholder-gray-500 rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-orange-600"
            :disabled="store.sending"
          />
          <button
            @click="send"
            :disabled="!input.trim() || store.sending"
            class="bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            {{ store.sending ? "…" : "Send" }}
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, defineProps, defineEmits } from "vue";
import { useFacebookMessageStore } from "../stores/facebookMessage";

const store = useFacebookMessageStore();
const search = ref("");
const input = ref("");
const messagesEl = ref(null);

const props = defineProps({
  pendingConvId: { type: String, default: null },
});
const emit = defineEmits(["conv-opened"]);

// Load on mount
store.fetchConversations();

const filteredConversations = computed(() => {
  const q = search.value.toLowerCase();
  if (!q) return store.sortedConversations;
  return store.sortedConversations.filter((c) =>
    c.sender_name?.toLowerCase().includes(q),
  );
});

function initials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
}

function formatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  const diff = Date.now() - d;
  if (diff < 60000) return "now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000)
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function formatFullTime(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function send() {
  if (!input.value.trim() || store.sending) return;
  const text = input.value;
  input.value = "";
  try {
    await store.sendMessage(text);
    await nextTick();
    if (messagesEl.value)
      messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
  } catch {
    input.value = text;
  }
}

// Auto-scroll when messages load
watch(
  () => store.messages.length,
  async () => {
    await nextTick();
    if (messagesEl.value)
      messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
  },
);

watch(
  () => props.pendingConvId,
  async (id) => {
    if (!id) return;

    // Make sure conversations are loaded first
    if (!store.conversations?.length) {
      await store.fetchConversations();
    }

    const conv = store.conversations.find((c) => String(c._id) === String(id));
    if (conv) {
      store.selectConversation(conv);
    }

    emit("conv-opened"); // tell parent to clear pendingConvId
  },
);
</script>
