<template>
  <Layout>
    <div class="flex flex-col h-[86vh] overflow-hidden">
      <!-- Tab Bar -->
      <div
        class="flex items-center bg-gray-100 border-b border-gray-800 flex-shrink-0"
      >
        <button
          @click="activeTab = 'graph'"
          :class="[
            'flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'graph'
              ? 'border-blue-500 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-300',
          ]"
        >
          <div
            class="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs"
          >
            A
          </div>
          Analysics Graph
        </button>
        <button
          @click="activeTab = 'facebook'"
          :class="[
            'flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'facebook'
              ? 'border-blue-500 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-300',
          ]"
        >
          <div
            class="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs"
          >
            f
          </div>
          Facebook Chat
        </button>

        <button
          @click="activeTab = 'local'"
          :class="[
            'flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'local'
              ? 'border-indigo-500 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-300',
          ]"
        >
          <div
            class="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center text-white text-xs"
          >
            💬
          </div>
          Local System Chat
        </button>

        <!-- Refresh button for facebook tab -->
        <button
          v-if="activeTab === 'facebook'"
          @click="fbStore.fetchConversations()"
          :class="[
            'ml-auto mr-4 text-gray-500 hover:text-gray-300 text-base transition-colors',
            fbStore.conversationsLoading && 'animate-spin',
          ]"
          title="Refresh"
        >
          ⟳
        </button>
      </div>

      <!-- Tab Content -->
      <div class="flex-1 min-h-0">
        <!-- Facebook Chat -->
        <div v-show="activeTab === 'facebook'" class="h-full">
          <FacebookChat
            :pending-conv-id="pendingConvId"
            @conv-opened="pendingConvId = null"
          />
        </div>

        <!-- Local System Chat -->
        <div v-show="activeTab === 'local'">
          <ChatView />
        </div>

        <!-- Graph -->
        <div v-show="activeTab === 'graph'">
          <ChatGraph @open-conversation="openConvInChat" />
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref } from "vue";
import Layout from "./Layout.vue";
import FacebookChat from "./FacebookChat.vue";
import { useFacebookMessageStore } from "../stores/facebookMessage.js";
import ChatView from "./ChatView.vue";
import ChatGraph from "./ChatGraph.vue";

const activeTab = ref("facebook");
const fbStore = useFacebookMessageStore();
const pendingConvId = ref(null); // ← new

function openConvInChat(convId) {
  pendingConvId.value = convId;
  activeTab.value = "facebook";
}
</script>
