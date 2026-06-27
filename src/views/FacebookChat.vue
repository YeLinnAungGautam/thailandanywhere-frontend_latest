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
                <img
                  v-if="
                    msg.content_type === 'image' ||
                    msg.content_type === 'sticker'
                  "
                  :src="msg.attachment_url"
                  class="max-w-full rounded-lg"
                />
                <video
                  v-else-if="msg.content_type === 'video'"
                  :src="msg.attachment_url"
                  controls
                  class="max-w-full rounded-lg"
                />
                <audio
                  v-else-if="msg.content_type === 'audio'"
                  :src="msg.attachment_url"
                  controls
                  class="w-48"
                />
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

            <!-- AI Suggestion inline row (left side, after last message) -->
            <div v-if="aiSuggestion" class="flex justify-start items-end gap-2">
              <!-- i button -->
              <button
                @click="toggleSuggestion"
                :class="[
                  'w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 transition-colors',
                  showSuggestion
                    ? 'bg-indigo-700'
                    : 'bg-indigo-500 hover:bg-indigo-600',
                ]"
                title="View AI suggested reply"
              >
                i
              </button>

              <!-- Suggestion bubble or hint -->
              <div v-if="showSuggestion" class="max-w-xs lg:max-w-md">
                <div
                  class="bg-indigo-50 border border-indigo-200 rounded-2xl rounded-bl-sm px-3 py-2"
                >
                  <div
                    class="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-1"
                  >
                    Suggested reply
                  </div>
                  <p
                    class="text-sm text-indigo-900 leading-relaxed whitespace-pre-wrap"
                  >
                    {{ aiSuggestion.suggestedMessage }}
                  </p>
                  <div
                    v-if="aiSuggestion.rate !== undefined"
                    class="mt-2 flex items-center gap-2"
                  >
                    <div
                      class="h-1.5 flex-1 bg-indigo-100 rounded-full overflow-hidden"
                    >
                      <div
                        :class="[
                          'h-full rounded-full transition-all',
                          aiSuggestion.rate >= 70
                            ? 'bg-green-500'
                            : aiSuggestion.rate >= 40
                            ? 'bg-yellow-500'
                            : 'bg-red-400',
                        ]"
                        :style="{ width: aiSuggestion.rate + '%' }"
                      />
                    </div>
                    <span class="text-xs font-semibold text-indigo-600"
                      >{{ aiSuggestion.rate }}%</span
                    >
                  </div>
                  <button
                    @click="send"
                    :disabled="!input.trim() || store.sending"
                    class="mt-2 text-xs text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-400 rounded px-2 py-1 transition-colors"
                  >
                    Send
                  </button>
                  <button
                    @click="showLearnFromAi = true"
                    class="mt-2 text-xs ml-3 text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-400 rounded px-2 py-1 transition-colors"
                  >
                    Learn From AI
                  </button>
                </div>
              </div>
              <div v-else class="text-xs text-gray-400 italic">
                AI suggestion ready — tap
                <strong class="font-medium text-indigo-500">i</strong>
              </div>
            </div>
          </template>
        </div>

        <Teleport to="body">
          <div v-if="showLearnFromAi">
            <div
              class="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 p-0 md:p-4"
              @click.self="showLearnFromAi = false"
            >
              <div
                class="bg-white w-[500px] min-h-[500px] rounded-2xl flex flex-col max-h-[92dvh] md:max-h-[90vh] overflow-hidden shadow-2xl"
              >
                <div v-if="aiSuggestion" class="px-4 pb-6 space-y-3">
                  <div class="border-t border-gray-100 mb-4" />

                  <!-- Success Rate -->
                  <div class="bg-gray-50 rounded-xl p-4">
                    <div class="flex items-center justify-between mb-2">
                      <p
                        class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
                      >
                        Sale Success Rate
                      </p>
                      <span
                        :class="[
                          'text-sm font-bold px-3 py-1 rounded-full',
                          aiSuggestion.rate >= 70
                            ? 'bg-green-100 text-green-700'
                            : aiSuggestion.rate >= 40
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700',
                        ]"
                        >{{ aiSuggestion.rate }}%</span
                      >
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div
                        :class="[
                          'h-2 rounded-full transition-all duration-700',
                          aiSuggestion.rate >= 70
                            ? 'bg-green-500'
                            : aiSuggestion.rate >= 40
                            ? 'bg-yellow-500'
                            : 'bg-red-500',
                        ]"
                        :style="{ width: aiSuggestion.rate + '%' }"
                      />
                    </div>
                    <p class="text-xs text-gray-500 mt-2">
                      {{ aiSuggestion.rateReason }}
                    </p>
                  </div>

                  <!-- Reason -->
                  <div class="bg-white border border-gray-200 rounded-xl p-4">
                    <p
                      class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2"
                    >
                      Why This Works
                    </p>
                    <p class="text-sm text-gray-700 leading-relaxed">
                      {{ aiSuggestion.reason }}
                    </p>
                  </div>

                  <!-- Tips -->
                  <div
                    v-if="aiSuggestion.tips && aiSuggestion.tips.length"
                    class="bg-white border border-gray-200 rounded-xl p-4"
                  >
                    <p
                      class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2"
                    >
                      Quick Tips
                    </p>
                    <ul class="space-y-1.5">
                      <li
                        v-for="(tip, i) in aiSuggestion.tips"
                        :key="i"
                        class="flex gap-2 text-sm text-gray-700"
                      >
                        <span class="text-indigo-400 flex-shrink-0">•</span>
                        <span>{{ tip }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Teleport>

        <!-- Send error -->
        <div
          v-if="store.sendError"
          class="px-5 py-1 text-xs text-red-400 bg-red-900/20 border-t border-red-900/30"
        >
          Failed to send: {{ store.sendError }}
        </div>

        <!-- Compose + AI panel wrapper -->
        <div class="flex-shrink-0 border-t border-gray-100">
          <!-- Compose bar -->
          <div class="flex gap-2 px-4 py-3 bg-white items-center">
            <textarea
              v-model="input"
              :rows="input ? '3' : '1'"
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

            <!-- Settings icon -->
            <button
              @click="toggleAiPanel"
              class="w-9 h-9 flex items-center justify-center rounded-xl transition-colors flex-shrink-0"
              :class="[
                'w-9 h-9 flex items-center justify-center rounded-xl border transition-colors flex-shrink-0 text-sm font-bold',
                showAiPanel
                  ? 'bg-purple-700 border-purple-700 text-white'
                  : 'border-purple-400 text-purple-600 hover:bg-purple-50',
              ]"
              title="Settings"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-settings-icon lucide-settings"
              >
                <path
                  d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"
                />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>

            <!-- AI Trainer toggle button -->
            <!-- <button
              @click="runAnalysis"
              :disabled="
                aiLoading ||
                (editableMessages.length === 0 && aiContext.length === 0)
              "
              :class="[
                'min-w-9 h-9 flex items-center justify-center px-2 rounded-xl border transition-colors flex-shrink-0 text-sm font-bold',
                aiLoading ||
                (editableMessages.length === 0 && aiContext.length === 0)
                  ? 'bg-purple-700 border-purple-700 text-white'
                  : 'border-purple-400 text-purple-600 hover:bg-purple-50',
              ]"
              title="Sales AI Trainer"
            >
              <span v-if="aiLoading" class="animate-spin inline-block">⟳</span>
              <span>{{ aiLoading ? "Analyzing..." : "✦" }}</span>
            </button> -->

            <!-- AI selector + run button -->
            <div class="relative flex-shrink-0">
              <div
                class="flex items-center rounded-xl border border-purple-400 overflow-hidden"
              >
                <button
                  @click="runAnalysis"
                  :disabled="
                    aiLoading ||
                    (editableMessages.length === 0 && aiContext.length === 0)
                  "
                  :class="[
                    'h-9 px-2 flex items-center gap-1 text-sm font-bold transition-colors',
                    aiLoading ||
                    (editableMessages.length === 0 && aiContext.length === 0)
                      ? 'bg-purple-700 text-white'
                      : 'text-purple-600 hover:bg-purple-50',
                  ]"
                  title="Run AI Analysis"
                >
                  <span v-if="aiLoading" class="animate-spin inline-block"
                    >⟳</span
                  >
                  <span>{{ aiLoading ? "" : "✦" }}</span>
                </button>
                <button
                  @click="showAiDropdown = !showAiDropdown"
                  class="h-9 px-1.5 border-l border-purple-400 text-purple-600 hover:bg-purple-50 flex items-center text-xs"
                >
                  <span class="font-medium">{{
                    selectedAi === "gemini" ? "G" : "C"
                  }}</span>
                  <svg
                    class="w-3 h-3 ml-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
              <!-- Dropdown -->
              <div
                v-if="showAiDropdown"
                class="absolute bottom-11 right-0 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50 w-36"
              >
                <button
                  @click="
                    selectedAi = 'gemini';
                    showAiDropdown = false;
                  "
                  :class="[
                    'w-full flex items-center gap-2 px-3 py-2.5 text-xs text-left hover:bg-gray-50 transition-colors',
                    selectedAi === 'gemini'
                      ? 'text-purple-700 font-semibold bg-purple-50'
                      : 'text-gray-700',
                  ]"
                >
                  <span class="text-base">✦</span> Gemini
                  <span
                    v-if="selectedAi === 'gemini'"
                    class="ml-auto text-purple-500"
                    >✓</span
                  >
                </button>
                <button
                  @click="
                    selectedAi = 'chatgpt';
                    showAiDropdown = false;
                  "
                  :class="[
                    'w-full flex items-center gap-2 px-3 py-2.5 text-xs text-left hover:bg-gray-50 transition-colors',
                    selectedAi === 'chatgpt'
                      ? 'text-green-700 font-semibold bg-green-50'
                      : 'text-gray-700',
                  ]"
                >
                  <span class="text-base">⊕</span> ChatGPT
                  <span
                    v-if="selectedAi === 'chatgpt'"
                    class="ml-auto text-green-500"
                    >✓</span
                  >
                </button>
              </div>
            </div>
          </div>

          <!-- AI Trainer inline panel -->
          <transition name="slide">
            <div v-if="showAiPanel" class="border-t border-gray-100 bg-white">
              <!-- Panel tabs -->
              <div class="flex border-b border-gray-100">
                <button
                  @click="aiTab = 'messages'"
                  :class="[
                    'flex-1 py-2 text-xs font-semibold transition-colors',
                    aiTab === 'messages'
                      ? 'text-purple-700 border-b-2 border-purple-600'
                      : 'text-gray-500 hover:text-gray-700',
                  ]"
                >
                  Messages
                </button>
                <button
                  @click="aiTab = 'context'"
                  :class="[
                    'flex-1 py-2 text-xs font-semibold transition-colors',
                    aiTab === 'context'
                      ? 'text-purple-700 border-b-2 border-purple-600'
                      : 'text-gray-500 hover:text-gray-700',
                  ]"
                >
                  Extra context
                </button>
              </div>

              <div class="px-4 py-3">
                <!-- Messages tab -->
                <template v-if="aiTab === 'messages'">
                  <div class="max-h-36 overflow-y-auto space-y-1.5 mb-3">
                    <div
                      v-for="(msg, i) in editableMessages"
                      :key="i"
                      class="flex gap-2 items-start"
                    >
                      <button
                        @click="toggleMsgRole(i)"
                        :class="[
                          'flex-shrink-0 text-[10px] font-semibold px-2 py-1 rounded-md w-16 text-center transition-colors',
                          msg.role === 'customer'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-blue-100 text-blue-700',
                        ]"
                      >
                        {{ msg.role === "customer" ? "Customer" : "Admin" }}
                      </button>
                      <textarea
                        v-model="msg.text"
                        rows="1"
                        class="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-800 outline-none focus:ring-1 focus:ring-purple-400 resize-none overflow-hidden"
                        @input="autoResize($event)"
                      />
                      <button
                        @click="editableMessages.splice(i, 1)"
                        class="text-gray-300 hover:text-red-400 text-base leading-none mt-1"
                      >
                        ×
                      </button>
                    </div>
                    <div
                      v-if="editableMessages.length === 0"
                      class="text-xs text-gray-400 text-center py-2"
                    >
                      No messages — add one below
                    </div>
                  </div>
                  <button
                    @click="
                      editableMessages.push({ role: 'customer', text: '' })
                    "
                    class="text-xs text-purple-600 hover:text-purple-800 mb-2"
                  >
                    + Add line
                  </button>
                </template>

                <!-- Context tab -->
                <template v-else>
                  <textarea
                    v-model="aiContext"
                    rows="4"
                    placeholder="e.g. Family of 4, budget ~3000 THB/night, looking for pool villa near BNH hospital…"
                    class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 placeholder-gray-400 outline-none focus:ring-1 focus:ring-purple-400 resize-none mb-2"
                  />
                </template>

                <div v-if="aiError" class="mt-2 text-xs text-red-500">
                  {{ aiError }}
                </div>
              </div>
            </div>
          </transition>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from "vue";
import { useFacebookMessageStore } from "../stores/facebookMessage";

const store = useFacebookMessageStore();
const search = ref("");
const input = ref("");
const messagesEl = ref(null);

// AI Trainer state (inline panel)
const showAiPanel = ref(false);
const aiTab = ref("messages");
const aiContext = ref("");
const aiLoading = ref(false);
const aiError = ref(null);
const editableMessages = ref([]);
const aiSuggestion = ref(null);
const showSuggestion = ref(false);

const showLearnFromAi = ref(false);

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash-lite";

const props = defineProps({
  pendingConvId: { type: String, default: null },
});
const emit = defineEmits(["conv-opened"]);

store.fetchConversations();

const selectedAi = ref("gemini"); // 'gemini' | 'chatgpt'
const showAiDropdown = ref(false);

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

// FIX 3: In toggleAiPanel — also limit + clean
function toggleAiPanel() {
  showAiPanel.value = !showAiPanel.value;
  if (showAiPanel.value) {
    const seen = new Set();
    editableMessages.value = store.messages
      .slice(-15)
      .map((m) => ({
        role: m.type === "admin" ? "admin" : "customer",
        text: m.message_text || "",
      }))
      .filter((m) => {
        if (!m.text.trim()) return false;
        if (
          m.text === "[image]" ||
          m.text === "[video]" ||
          m.text === "[audio]"
        )
          return false;
        const key = `${m.role}:${m.text}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }
}

function toggleSuggestion() {
  showSuggestion.value = !showSuggestion.value;
}

function useAiSuggestion() {
  if (aiSuggestion.value?.suggestedMessage) {
    input.value = aiSuggestion.value.suggestedMessage;
    showSuggestion.value = false;
  }
}

function toggleMsgRole(i) {
  editableMessages.value[i].role =
    editableMessages.value[i].role === "customer" ? "admin" : "customer";
}

function autoResize(e) {
  const el = e.target;
  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";
}

// FIX 6: Cap input in buildPlainText to avoid huge prompts
// Deduplicate + simplify role labels
function buildPlainText() {
  const seen = new Set();
  return editableMessages.value
    .filter((m) => {
      const key = `${m.role}:${m.text}`;
      if (seen.has(key)) return false; // ← skip duplicates
      seen.add(key);
      return true;
    })
    .map((m) => `${m.role === "customer" ? "C" : "A"}: ${m.text}`) // ← short labels save tokens
    .join("\n")
    .slice(0, 2000);
}

// FIX 1: Clean pasted text helper
function cleanText(text) {
  return text
    .replace(/Sent by \[.*?\]\(.*?\)/g, "") // remove "Sent by [name](url)"
    .replace(/https?:\/\/\S+/g, "") // remove URLs
    .replace(/\w[\w\s]+ assigned this conversation.*$/gm, "") // remove system events
    .replace(/replied to (an ad|You)\./g, "") // remove metadata
    .replace(/\n{3,}/g, "\n\n") // collapse blank lines
    .trim();
}

async function runAnalysis() {
  if (aiLoading.value) return;
  aiLoading.value = true;
  aiError.value = null;
  showAiDropdown.value = false;

  const conversationText = buildPlainText();
  const contextNote = aiContext.value.trim()
    ? `\n\nExtra context: ${aiContext.value.trim()}`
    : "";
  const promptText = conversationText + contextNote;

  const prompt = `You are the sales coach for Thailand Anywhere, a travel agency serving Myanmar customers. Your job is to analyze the conversation between the customer (C) and sales agent (A), then help the sales agent send the NEXT best message to increase the chance of closing the sale.

  Principles:
  Focus ONLY on the latest stage of the conversation. The suggested message should feel like it was written by an experienced Myanmar travel sales agent. Never repeat information the customer already knows. Ask at most ONE question, and only if it helps move the booking forward. If the customer has already shown buying intent, move naturally toward booking instead of asking unnecessary questions. Be specific to THIS conversation. Never generate generic follow-ups. Keep every reply short, natural and conversational. Avoid long greetings, unnecessary thanks, or salesy wording.

  Scoring Guide:
  10 = Excellent sales handling, likely to convert.
  8-9 = Good but could improve.
  5-7 = Missed opportunities.
  0-4 = Poor sales handling or likely to lose the customer.

  Conversation:
  ${promptText}

  Return JSON only:
  {"suggestedMessage":"Maximum 2 short sentences (under 35 words total).","reason":"Myanmar language only. Explain briefly why the score was given. Maximum 20 words.","rate":0,"rateReason":"Myanmar language only. Maximum 10 words.","tips":["Myanmar only. Maximum 8 words.","Myanmar only. Maximum 8 words."]}`;

  try {
    let raw = "";

    if (selectedAi.value === "chatgpt") {
      const CHATGPT_API_KEY = import.meta.env.VITE_CHATGPT_API_KEY;
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CHATGPT_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.2,
          max_tokens: 300,
          response_format: { type: "json_object" },
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      if (data?.error) {
        aiError.value = data.error.message;
        return;
      }
      raw = data?.choices?.[0]?.message?.content || "";
    } else {
      const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      const GEMINI_MODEL =
        import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash-lite";
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 300,
              responseMimeType: "application/json",
              thinkingConfig: { thinkingBudget: 0 },
            },
          }),
        },
      );
      const data = await res.json();
      const finishReason = data?.candidates?.[0]?.finishReason;
      raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (!raw) {
        aiError.value = data?.error?.message || "Empty response from Gemini.";
        return;
      }
      if (finishReason === "MAX_TOKENS") raw = repairTruncatedJson(raw);
    }

    if (!raw) {
      aiError.value = "Empty AI response. Try again.";
      return;
    }

    let clean = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    try {
      aiSuggestion.value = JSON.parse(clean);
    } catch {
      aiSuggestion.value = extractFieldsFallback(clean);
      if (!aiSuggestion.value) {
        aiError.value = "Could not parse AI response. Please try again.";
        return;
      }
    }

    showAiPanel.value = false;
    showSuggestion.value = false;
    useAiSuggestion();

    await nextTick();
    if (messagesEl.value)
      messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
  } catch (e) {
    aiError.value = "Network error. Check your connection and API key.";
    console.error(e);
  } finally {
    aiLoading.value = false;
  }
}

function repairTruncatedJson(str) {
  let obj = 0,
    arr = 0,
    inStr = false,
    esc = false;
  for (const ch of str) {
    if (esc) {
      esc = false;
      continue;
    }
    if (ch === "\\" && inStr) {
      esc = true;
      continue;
    }
    if (ch === '"' && !esc) {
      inStr = !inStr;
      continue;
    }
    if (inStr) continue;
    if (ch === "{") obj++;
    if (ch === "}") obj--;
    if (ch === "[") arr++;
    if (ch === "]") arr--;
  }
  if (inStr) str += '"';
  str += "]".repeat(Math.max(0, arr));
  str += "}".repeat(Math.max(0, obj));
  return str;
}

function extractFieldsFallback(str) {
  try {
    const get = (key) => {
      const m = str.match(
        new RegExp(`"${key}"\\s*:\\s*"((?:[^"\\\\]|\\\\[\\s\\S])*)"`, "s"),
      );
      return m ? m[1].replace(/\\n/g, "\n").replace(/\\"/g, '"') : "";
    };
    const getNum = (key) => {
      const m = str.match(new RegExp(`"${key}"\\s*:\\s*(\\d+)`));
      return m ? parseInt(m[1]) : 50;
    };
    return {
      suggestedMessage:
        get("suggestedMessage") || "Could not extract suggestion.",
      reason: get("reason") || "",
      rate: getNum("rate"),
      rateReason: get("rateReason") || "",
      tips: [],
    };
  } catch {
    return null;
  }
}

// Reset AI suggestion when conversation changes
watch(
  () => store.selectedConversation?._id,
  () => {
    aiSuggestion.value = null;
    showSuggestion.value = false;
    showAiPanel.value = false;
    editableMessages.value = [];
    aiContext.value = "";
  },
);

// FIX 2: In the messages watch — limit to last 15 messages only
// Also deduplicate when seeding editableMessages
watch(
  () => store.messages.length,
  async () => {
    const seen = new Set();
    editableMessages.value = store.messages
      .slice(-15)
      .map((m) => ({
        role: m.type === "admin" ? "admin" : "customer",
        text: m.message_text || "",
      }))
      .filter((m) => {
        if (!m.text.trim()) return false;
        if (
          m.text === "[image]" ||
          m.text === "[video]" ||
          m.text === "[audio]"
        )
          return false; // ← skip attachments
        const key = `${m.role}:${m.text}`;
        if (seen.has(key)) return false; // ← skip duplicates
        seen.add(key);
        return true;
      });
  },
);

watch(
  () => props.pendingConvId,
  async (id) => {
    if (!id) return;
    if (!store.conversations?.length) await store.fetchConversations();
    const conv = store.conversations.find((c) => String(c._id) === String(id));
    if (conv) {
      store.selectConversation(conv);
    }
    emit("conv-opened");
  },
);
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
.slide-enter-to,
.slide-leave-from {
  max-height: 400px;
  opacity: 1;
}
</style>
