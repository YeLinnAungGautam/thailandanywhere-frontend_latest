<template>
  <Layout>
    <div class="w-full mx-auto">
      <!-- Loading Overlay -->
      <div
        v-if="emailStore.loading"
        class="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
      >
        <div
          class="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center"
        >
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF613c] mb-3"
          ></div>
          <p class="text-gray-600">Loading...</p>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-5">
        <div class="flex gap-3 flex-wrap">
          <input
            v-model="filters.search"
            @input="debounceSearch"
            type="text"
            placeholder="Search emails..."
            class="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#FF613c]"
          />
          <select
            v-model="filters.status"
            @change="fetchEmails"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#FF613c]"
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="archived">Archived</option>
          </select>
          <button
            @click="showCompose = true"
            class="bg-[#FF613c] hover:bg-[#e55534] text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          >
            + New Email
          </button>
        </div>

        <!-- Stats -->
        <div v-if="emailStore.stats" class="flex gap-4 mt-4 text-sm flex-wrap">
          <div class="text-gray-600">
            Total Threads:
            <span class="font-semibold">{{
              emailStore.stats.total_threads
            }}</span>
          </div>
          <div class="text-[#FF613c]">
            Open:
            <span class="font-semibold">{{ emailStore.stats.open_count }}</span>
          </div>
          <div class="text-green-600">
            Closed:
            <span class="font-semibold">{{
              emailStore.stats.closed_count
            }}</span>
          </div>
          <div class="text-blue-600">
            Messages:
            <span class="font-semibold">{{
              emailStore.stats.total_messages
            }}</span>
          </div>
          <div class="text-gray-600">
            Today:
            <span class="font-semibold">{{
              emailStore.stats.today_count
            }}</span>
          </div>
          <div class="text-gray-600">
            This Week:
            <span class="font-semibold">{{
              emailStore.stats.this_week_count
            }}</span>
          </div>
        </div>
      </div>

      <div
        class="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5 h-[calc(100vh-240px)]"
      >
        <!-- Mail List Sidebar -->
        <div
          class="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col"
        >
          <div
            class="px-5 py-4 border-b border-gray-100 flex justify-between items-center"
          >
            <h2 class="text-lg font-semibold text-gray-900">Inbox</h2>
            <div class="flex items-center gap-2">
              <span
                class="bg-gray-100 text-gray-600 px-3 py-1 rounded-xl text-sm font-medium"
              >
                {{ emailStore.emails?.length || 0 }}
              </span>
              <button
                @click="syncEmails"
                class="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-xs font-medium transition-all"
                title="Sync from Gmail"
              >
                🔄
              </button>
            </div>
          </div>

          <div class="overflow-y-auto flex-1">
            <div
              v-for="email in emailStore.emails"
              :key="email.id"
              @click="selectEmail(email)"
              :class="[
                'px-5 py-4 border-b border-gray-50 cursor-pointer transition-all duration-200',
                selectedEmail?.id === email.id
                  ? 'bg-[#fff5f2] border-l-4 border-l-[#FF613c]'
                  : 'hover:bg-gray-50',
              ]"
            >
              <div class="flex justify-between items-start mb-1">
                <span
                  class="text-sm font-medium text-gray-800 truncate flex-1 mr-2"
                >
                  {{ formatSender(email.is_incoming ? email.from : email.to) }}
                </span>
                <span class="text-xs text-gray-400 whitespace-nowrap">{{
                  formatTime(email.last_message_at)
                }}</span>
              </div>
              <div class="text-sm text-gray-700 truncate mb-1">
                {{ email.subject }}
              </div>
              <div class="text-xs text-gray-400 truncate mb-2">
                {{ stripHtml(email.preview) }}
              </div>
              <div class="flex gap-2 flex-wrap">
                <span
                  :class="[
                    'text-xs px-2 py-0.5 rounded-full',
                    email.is_incoming
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700',
                  ]"
                >
                  {{ email.is_incoming ? "Received" : "Sent" }}
                </span>
                <span
                  :class="[
                    'text-xs px-2 py-0.5 rounded-full',
                    getStatusClass(email.status),
                  ]"
                >
                  {{ email.status }}
                </span>
                <span
                  v-if="email.message_count > 1"
                  class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
                >
                  {{ email.message_count }} msgs
                </span>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div
            v-if="paginationData"
            class="px-5 py-3 border-t border-gray-100 flex justify-between items-center"
          >
            <button
              @click="previousPage"
              :disabled="paginationData.current_page === 1"
              :class="[
                'px-3 py-1 rounded text-sm transition-all',
                paginationData.current_page === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-[#FF613c] hover:bg-[#fff5f2]',
              ]"
            >
              ← Previous
            </button>
            <span class="text-sm text-gray-600"
              >Page {{ paginationData.current_page }} of
              {{ paginationData.last_page }}</span
            >
            <button
              @click="nextPage"
              :disabled="!paginationData.has_more"
              :class="[
                'px-3 py-1 rounded text-sm transition-all',
                !paginationData.has_more
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-[#FF613c] hover:bg-[#fff5f2]',
              ]"
            >
              Next →
            </button>
          </div>

          <div
            v-if="!emailStore.emails?.length && !emailStore.loading"
            class="flex flex-col items-center justify-center py-16 text-gray-400"
          >
            <div class="text-5xl mb-3">📭</div>
            <p>No messages found</p>
          </div>
        </div>

        <!-- Mail Viewer -->
        <div
          class="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col"
        >
          <div
            v-if="!selectedEmail"
            class="flex-1 flex flex-col items-center justify-center text-gray-400"
          >
            <div class="text-6xl mb-4">✉️</div>
            <p>Select a message to read</p>
          </div>

          <template v-else>
            <!-- Header (fixed) -->
            <div class="px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <div class="flex justify-between items-start gap-4">
                <h2 class="text-xl font-semibold text-gray-900 flex-1 min-w-0">
                  {{ selectedEmail.subject }}
                </h2>
                <div class="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                  <button
                    v-if="selectedEmail.status === 'open'"
                    @click="closeTicket(selectedEmail.id)"
                    class="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    ✓ Close
                  </button>
                  <button
                    v-else-if="selectedEmail.status === 'closed'"
                    @click="reopenTicket(selectedEmail.id)"
                    class="px-3 py-1.5 rounded-lg text-sm font-medium border border-green-300 text-green-600 hover:bg-green-50 transition-all"
                  >
                    ↺ Reopen
                  </button>
                  <button
                    @click="archiveEmail"
                    class="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    📦 Archive
                  </button>
                  <button
                    @click="deleteEmail"
                    class="px-3 py-1.5 rounded-lg text-sm font-medium border border-red-300 text-red-600 hover:bg-red-50 transition-all"
                  >
                    🗑️ Delete
                  </button>
                  <button
                    @click="startReply"
                    class="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border-2 border-[#FF613c] text-[#FF613c] hover:bg-[#FF613c] hover:text-white transition-all"
                  >
                    <ArrowUturnLeftIcon class="w-4 h-4" /> Reply
                  </button>
                </div>
              </div>
              <div class="mt-3 space-y-1 text-sm">
                <div class="flex gap-2">
                  <span class="text-gray-500 w-16 flex-shrink-0">From:</span>
                  <span class="text-[#FF613c] font-medium break-all">{{
                    selectedEmail.from
                  }}</span>
                </div>
                <div class="flex gap-2">
                  <span class="text-gray-500 w-16 flex-shrink-0">To:</span>
                  <span class="text-gray-700 break-all">{{
                    selectedEmail.to
                  }}</span>
                </div>
                <div class="flex gap-2">
                  <span class="text-gray-500 w-16 flex-shrink-0">Date:</span>
                  <span class="text-gray-700">{{
                    formatFullTime(selectedEmail.last_message_at)
                  }}</span>
                </div>
                <div class="flex gap-2 items-center">
                  <span class="text-gray-500 w-16 flex-shrink-0">Status:</span>
                  <span
                    :class="[
                      'px-2 py-0.5 rounded text-xs font-medium',
                      getStatusClass(selectedEmail.status),
                    ]"
                  >
                    {{ selectedEmail.status }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Thread Messages (scrollable) -->
            <div class="flex-1 overflow-y-auto px-6 py-4">
              <!-- Loading spinner -->
              <div
                v-if="threadLoading"
                class="flex items-center justify-center py-12 text-gray-400"
              >
                <div
                  class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF613c] mr-3"
                ></div>
                <span class="text-sm">Loading messages...</span>
              </div>

              <!-- Messages -->
              <div v-else-if="threadMessages.length" class="space-y-4">
                <div
                  v-for="msg in threadMessages"
                  :key="msg.id"
                  :class="[
                    'rounded-xl border overflow-hidden',
                    msg.is_incoming ? 'border-gray-200' : 'border-[#ffd5c8]',
                  ]"
                >
                  <!-- Message header bar -->
                  <div
                    :class="[
                      'px-4 py-2.5 flex justify-between items-center border-b text-xs',
                      msg.is_incoming
                        ? 'bg-gray-50 border-gray-200 text-gray-600'
                        : 'bg-[#fff5f2] border-[#ffd5c8] text-[#c94a26]',
                    ]"
                  >
                    <div class="flex flex-col gap-0.5 min-w-0 flex-1 mr-4">
                      <span class="font-medium truncate">
                        {{
                          msg.is_incoming
                            ? "📨 " + msg.from
                            : "📤 To: " + msg.to
                        }}
                      </span>
                      <span class="opacity-70">{{
                        formatFullTime(msg.created_at)
                      }}</span>
                    </div>
                    <span
                      :class="[
                        'px-2 py-0.5 rounded-full flex-shrink-0 font-medium',
                        msg.is_incoming
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700',
                      ]"
                    >
                      {{ msg.is_incoming ? "Received" : "Sent" }}
                    </span>
                  </div>

                  <!-- Full message body -->
                  <div class="px-4 py-4 bg-white">
                    <div
                      v-html="formatBody(msg.body)"
                      class="email-body text-sm text-gray-700 leading-relaxed"
                    ></div>

                    <!-- Attachments -->
                    <div
                      v-if="msg.attachments && msg.attachments.length"
                      class="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2"
                    >
                      <div
                        v-for="(att, idx) in msg.attachments"
                        :key="idx"
                        class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-100 cursor-pointer"
                      >
                        📎 {{ att }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-else
                class="flex flex-col items-center justify-center py-12 text-gray-400"
              >
                <div class="text-4xl mb-2">📭</div>
                <p class="text-sm">No messages found</p>
              </div>
            </div>

            <!-- Reply Form (fixed at bottom) -->
            <div
              v-if="showReply"
              class="border-t-2 border-gray-100 px-6 py-4 bg-gray-50 flex-shrink-0"
            >
              <div class="flex justify-between items-center mb-3">
                <h3 class="text-sm font-semibold text-gray-900">
                  Reply to {{ formatSender(selectedEmail.from) }}
                </h3>
                <button
                  @click="showReply = false"
                  class="w-7 h-7 flex items-center justify-center text-gray-400 hover:bg-gray-200 rounded-md"
                >
                  ✕
                </button>
              </div>
              <input
                v-model="replySubject"
                type="text"
                placeholder="Subject"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm mb-3 focus:outline-none focus:border-[#FF613c]"
              />
              <textarea
                v-model="replyMessage"
                placeholder="Type your reply..."
                rows="4"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm resize-y mb-3 focus:outline-none focus:border-[#FF613c]"
              ></textarea>
              <div class="flex gap-3">
                <button
                  @click="sendReply"
                  :disabled="!replyMessage.trim()"
                  class="bg-[#FF613c] hover:bg-[#e55534] text-white px-5 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Reply
                </button>
                <button
                  @click="showReply = false"
                  class="bg-white hover:bg-gray-100 text-gray-600 border border-gray-300 px-5 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Compose Modal -->
      <div
        v-if="showCompose"
        @click.self="showCompose = false"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <div
          class="bg-white rounded-xl w-[90%] max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
        >
          <div
            class="px-6 py-5 border-b border-gray-100 flex justify-between items-center"
          >
            <h2 class="text-xl font-semibold text-gray-900">New Message</h2>
            <button
              @click="showCompose = false"
              class="w-8 h-8 flex items-center justify-center text-2xl text-gray-400 hover:bg-gray-100 rounded-md"
            >
              ✕
            </button>
          </div>
          <div class="px-6 py-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <input
              v-model="composeMail.to"
              type="email"
              placeholder="To: recipient@example.com"
              class="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm mb-3 focus:outline-none focus:border-[#FF613c]"
            />
            <input
              v-model="ccInput"
              type="text"
              placeholder="CC: (comma separated)"
              class="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm mb-3 focus:outline-none focus:border-[#FF613c]"
            />
            <input
              v-model="composeMail.subject"
              type="text"
              placeholder="Subject"
              class="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm mb-3 focus:outline-none focus:border-[#FF613c]"
            />
            <textarea
              v-model="composeMail.body"
              placeholder="Type your message..."
              rows="10"
              class="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm resize-y mb-4 focus:outline-none focus:border-[#FF613c]"
            ></textarea>
            <div class="flex gap-3">
              <button
                @click="sendNewEmail"
                :disabled="
                  !composeMail.to || !composeMail.subject || !composeMail.body
                "
                class="bg-[#FF613c] hover:bg-[#e55534] text-white px-6 py-3 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Message
              </button>
              <button
                @click="showCompose = false"
                class="bg-white hover:bg-gray-100 text-gray-600 border border-gray-300 px-6 py-3 rounded-lg text-sm font-medium transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Layout from "./Layout.vue";
import { ArrowUturnLeftIcon } from "@heroicons/vue/24/outline";
import { useEmailStore } from "../stores/email";
import axios from "axios";

const emailStore = useEmailStore();

const selectedEmail = ref(null);
const threadMessages = ref([]);
const threadLoading = ref(false);
const showCompose = ref(false);
const showReply = ref(false);
const replyMessage = ref("");
const replySubject = ref("");
const paginationData = ref(null);
const composeMail = ref({ to: "", subject: "", body: "" });
const ccInput = ref("");
const filters = ref({ search: "", status: "", per_page: 20, page: 1 });
let searchTimeout = null;

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatSender = (raw) => {
  if (!raw) return "";
  const match = raw.match(/^(.*?)\s*<(.+?)>$/);
  return match ? match[1].trim() || match[2] : raw;
};

const stripHtml = (html) => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const formatTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const hours = Math.floor((now - date) / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

const formatFullTime = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Gmail-style email body formatter.
 * - Real HTML → render as-is with quoted section collapsed (like Gmail's "..." button)
 * - Plain text → proper paragraph breaks, quoted replies collapsed
 */
const formatBody = (body) => {
  if (!body) return "";

  const hasRealHtml =
    /<(div|table|p|ul|ol|li|h[1-6]|section|article|span\s)[^>]*>/i.test(body);

  if (hasRealHtml) {
    // Wrap Gmail's .gmail_quote in a collapsible block
    return wrapGmailQuote(body);
  }

  // Plain text processing
  let text = body
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "");

  const lines = text.split("\n");

  // Separate main body from quoted section
  // Find first "On ... wrote:" line that's followed by > lines
  let splitIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (
      /^On .+wrote:$/i.test(lines[i].trim()) ||
      /^-{3,}Original Message-{3,}/i.test(lines[i].trim())
    ) {
      splitIndex = i;
      break;
    }
    // Or if line starts with > and previous non-empty line was "On...wrote:"
    if (lines[i].trim().startsWith(">") && i > 0) {
      const prev = lines[i - 1].trim();
      if (/^On .+wrote:$/i.test(prev) || prev === "") {
        splitIndex = i - 1 > 0 ? i - 1 : i;
        break;
      }
    }
  }

  const mainLines = splitIndex >= 0 ? lines.slice(0, splitIndex) : lines;
  const quotedLines = splitIndex >= 0 ? lines.slice(splitIndex) : [];

  const renderLines = (lineArr) =>
    lineArr
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return `<div style="height:6px"></div>`;
        if (/^[-_]{3,}$/.test(trimmed))
          return `<hr style="border:none;border-top:1px solid #e5e7eb;margin:10px 0;">`;
        // Strip leading > for quoted lines inside the collapsed section
        const clean = trimmed.replace(/^>+\s?/, "");
        return `<div style="margin:0;padding:1px 0;line-height:1.6;">${linkify(
          escapeHtml(clean || line),
        )}</div>`;
      })
      .join("");

  let html = `<div style="font-size:14px;color:#1f2937;">${renderLines(
    mainLines,
  )}</div>`;

  if (quotedLines.length) {
    const quotedId = `q_${Math.random().toString(36).slice(2, 7)}`;
    const quotedHtml = renderLines(quotedLines);
    html += `
      <div style="margin-top:12px;">
        <button
          onclick="var el=document.getElementById('${quotedId}');var btn=this;if(el.style.display==='none'){el.style.display='block';btn.innerHTML='▲ Hide quoted text';}else{el.style.display='none';btn.innerHTML='• • •'}"
          style="background:#f3f4f6;border:1px solid #e5e7eb;border-radius:4px;padding:2px 10px;font-size:13px;color:#6b7280;cursor:pointer;letter-spacing:2px;line-height:1.8;"
        >• • •</button>
        <div id="${quotedId}" style="display:none;margin-top:8px;padding:12px 16px;border-left:3px solid #e5e7eb;background:#f9fafb;border-radius:0 6px 6px 0;font-size:14px;color:#374151;line-height:1.6;">
          ${quotedHtml}
        </div>
      </div>`;
  }

  return html;
};

/**
 * For real HTML emails: wrap .gmail_quote / blockquote in a collapsible toggle
 */
const wrapGmailQuote = (html) => {
  // Replace Gmail's quote div with collapsible version
  const id = `q_${Math.random().toString(36).slice(2, 7)}`;

  // Handle .gmail_quote class
  let result = html.replace(
    /(<div[^>]+class="[^"]*gmail_quote[^"]*"[^>]*>)([\s\S]*?)(<\/div>)(?=\s*$|\s*<div)/,
    (_, open, content, close) => `
      <div style="margin-top:12px;">
        <button
          onclick="var el=document.getElementById('${id}');var btn=this;if(el.style.display==='none'){el.style.display='block';btn.innerHTML='▲ Hide quoted text';}else{el.style.display='none';btn.innerHTML='• • •'}"
          style="background:#f3f4f6;border:1px solid #e5e7eb;border-radius:4px;padding:2px 10px;font-size:13px;color:#6b7280;cursor:pointer;letter-spacing:2px;line-height:1.8;"
        >• • •</button>
        <div id="${id}" style="display:none;margin-top:8px;">
          ${open}${content}${close}
        </div>
      </div>`,
  );

  // Handle bare blockquotes if no .gmail_quote found
  if (result === html) {
    result = html.replace(
      /(<blockquote[^>]*>)([\s\S]*?)(<\/blockquote>)/g,
      (_, open, content, close) => {
        const bid = `q_${Math.random().toString(36).slice(2, 7)}`;
        return `
          <div style="margin-top:12px;">
            <button
              onclick="var el=document.getElementById('${bid}');var btn=this;if(el.style.display==='none'){el.style.display='block';btn.innerHTML='▲ Hide quoted text';}else{el.style.display='none';btn.innerHTML='• • •'}"
              style="background:#f3f4f6;border:1px solid #e5e7eb;border-radius:4px;padding:2px 10px;font-size:13px;color:#6b7280;cursor:pointer;letter-spacing:2px;line-height:1.8;"
            >• • •</button>
            <div id="${bid}" style="display:none;margin-top:8px;padding:10px 16px;border-left:3px solid #e5e7eb;background:#f9fafb;border-radius:0 6px 6px 0;">
              ${open}${content}${close}
            </div>
          </div>`;
      },
    );
  }

  return result;
};

const escapeHtml = (str) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const linkify = (str) =>
  str.replace(
    /(https?:\/\/[^\s<>"]+)/g,
    '<a href="$1" target="_blank" rel="noopener" style="color:#FF613c;word-break:break-all;">$1</a>',
  );

const getStatusClass = (status) =>
  ({
    open: "bg-blue-100 text-blue-700",
    closed: "bg-green-100 text-green-700",
    archived: "bg-gray-100 text-gray-600",
  }[status] || "bg-gray-100 text-gray-700");

// ─── Fetch inbox ─────────────────────────────────────────────────────────────

const fetchEmails = async () => {
  try {
    const response = await emailStore.getInbox(filters.value);
    // HttpResponses trait → response.result (not response.data)
    paginationData.value = response.result?.pagination || null;
  } catch (error) {
    console.error("Error fetching emails:", error);
    alert("Failed to load emails");
  }
};

// ─── Select email → auto-load thread ────────────────────────────────────────

const selectEmail = async (email) => {
  selectedEmail.value = email;
  threadMessages.value = [];
  showReply.value = false;
  // Auto-load thread immediately on click
  await loadThread(email.thread_id || email.id);
};

/**
 * GET /gmail/threads/{threadId}
 * Backend returns: { result: { emails: [...] } }
 */
const loadThread = async (threadId) => {
  if (!threadId) return;
  threadLoading.value = true;
  try {
    const response = await axios.get(`/gmail/threads/${threadId}`);
    // Support result or data key
    const payload = response.data.result || response.data.data || response.data;
    threadMessages.value = payload?.emails || [];
  } catch (error) {
    console.error("Error loading thread:", error);
    threadMessages.value = [];
  } finally {
    threadLoading.value = false;
  }
};

// ─── Actions ─────────────────────────────────────────────────────────────────

const syncEmails = async () => {
  if (!confirm("Sync recent emails from Gmail?")) return;
  try {
    const response = await emailStore.syncFromGmail(50);
    const synced =
      response.result?.synced_count ?? response.data?.synced_count ?? 0;
    alert(`Synced ${synced} new email(s)`);
    await fetchEmails();
  } catch (error) {
    alert("Failed to sync emails");
  }
};

const startReply = () => {
  showReply.value = true;
  replyMessage.value = "";
  replySubject.value = `Re: ${selectedEmail.value.subject}`;
};

const sendReply = async () => {
  if (!replyMessage.value.trim() || !selectedEmail.value) return;
  try {
    await emailStore.sendReply(selectedEmail.value.id, {
      body: replyMessage.value,
      subject: replySubject.value,
    });
    alert("Reply sent successfully!");
    showReply.value = false;
    replyMessage.value = "";
    // Reload thread to show the new reply
    await loadThread(selectedEmail.value.thread_id || selectedEmail.value.id);
    await fetchEmails();
  } catch (error) {
    alert(error.response?.data?.message || "Failed to send reply");
  }
};

const sendNewEmail = async () => {
  if (
    !composeMail.value.to ||
    !composeMail.value.subject ||
    !composeMail.value.body
  ) {
    return alert("Please fill in all required fields");
  }
  try {
    const emailData = { ...composeMail.value };
    if (ccInput.value.trim()) {
      emailData.cc = ccInput.value
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);
    }
    await emailStore.composeEmail(emailData);
    alert("Message sent successfully!");
    showCompose.value = false;
    composeMail.value = { to: "", subject: "", body: "" };
    ccInput.value = "";
    await fetchEmails();
  } catch (error) {
    alert(error.response?.data?.message || "Failed to send message");
  }
};

const closeTicket = async (id) => {
  try {
    await axios.patch(`/gmail/tickets/${id}/close`);
    selectedEmail.value.status = "closed";
    await fetchEmails();
  } catch {
    alert("Failed to close ticket");
  }
};

const reopenTicket = async (id) => {
  try {
    await axios.patch(`/gmail/tickets/${id}/reopen`);
    selectedEmail.value.status = "open";
    await fetchEmails();
  } catch {
    alert("Failed to reopen ticket");
  }
};

const archiveEmail = async () => {
  if (!selectedEmail.value || !confirm("Archive this email?")) return;
  try {
    await emailStore.archiveEmails([selectedEmail.value.id]);
    selectedEmail.value = null;
    threadMessages.value = [];
    await fetchEmails();
  } catch {
    alert("Failed to archive email");
  }
};

const deleteEmail = async () => {
  if (!selectedEmail.value || !confirm("Delete this email?")) return;
  try {
    await emailStore.deleteEmails([selectedEmail.value.id]);
    selectedEmail.value = null;
    threadMessages.value = [];
    await fetchEmails();
  } catch {
    alert("Failed to delete email");
  }
};

// ─── Pagination & Search ─────────────────────────────────────────────────────

const debounceSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    filters.value.page = 1;
    fetchEmails();
  }, 500);
};
const nextPage = () => {
  if (paginationData.value?.has_more) {
    filters.value.page++;
    fetchEmails();
  }
};
const previousPage = () => {
  if (filters.value.page > 1) {
    filters.value.page--;
    fetchEmails();
  }
};

// ─── Mount ───────────────────────────────────────────────────────────────────

onMounted(async () => {
  const code = new URLSearchParams(window.location.search).get("code");
  if (code) {
    try {
      await emailStore.handleCallback(code);
      window.history.replaceState({}, document.title, window.location.pathname);
      alert("Gmail connected successfully!");
    } catch {
      alert("Failed to connect Gmail");
    }
  }
  await emailStore.checkConnectionStatus();
  await fetchEmails();
});
</script>

<style scoped>
.email-body {
  max-width: 100%;
  overflow-x: auto;
  word-break: break-word;
}
.email-body :deep(table) {
  max-width: 100%;
  border-collapse: collapse;
}
.email-body :deep(img) {
  max-width: 100%;
  height: auto;
  display: block;
}
.email-body :deep(a) {
  color: #ff613c;
  word-break: break-all;
}
.email-body :deep(p) {
  margin-bottom: 0.6rem;
}
.email-body :deep(blockquote) {
  border-left: 3px solid #e5e7eb;
  padding-left: 1rem;
  color: #6b7280;
  margin: 0.5rem 0;
}
.email-body :deep(pre) {
  white-space: pre-wrap;
  word-break: break-word;
  font-family: inherit;
}
.email-body :deep(div) {
  max-width: 100%;
}
/* Gmail quoted text toggle */
.email-body :deep(.gmail_quote) {
  color: #6b7280;
  border-left: 3px solid #e5e7eb;
  padding-left: 10px;
  margin: 8px 0;
}
.email-body :deep(.gmail_attr) {
  color: #9ca3af;
  font-size: 0.8em;
  margin: 10px 0 4px;
}
</style>
