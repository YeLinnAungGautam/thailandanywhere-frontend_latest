<template>
  <Layout>
    <div class="w-full mx-auto">
      <!-- Loading Overlay -->
      <div
        v-if="emailStore.loading"
        class="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-4 shadow-xl">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF613c]"
          ></div>
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
            <option value="sent">Sent</option>
            <option value="received">Received</option>
            <option value="failed">Failed</option>
          </select>

          <label
            class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm cursor-pointer hover:bg-gray-50"
          >
            <input
              v-model="filters.unread_only"
              @change="fetchEmails"
              type="checkbox"
              class="rounded text-[#FF613c] focus:ring-[#FF613c]"
            />
            <span>Unread only</span>
          </label>

          <button
            @click="showCompose = true"
            class="bg-[#FF613c] hover:bg-[#e55534] text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          >
            + New Email
          </button>
        </div>

        <!-- Stats -->
        <div v-if="emailStore.stats" class="flex gap-4 mt-4 text-sm">
          <div class="text-gray-600">
            Total:
            <span class="font-semibold">{{
              emailStore.stats.total_emails
            }}</span>
          </div>
          <div class="text-[#FF613c]">
            Unread:
            <span class="font-semibold">{{
              emailStore.stats.unread_count
            }}</span>
          </div>
          <div class="text-gray-600">
            Sent:
            <span class="font-semibold">{{ emailStore.stats.sent_count }}</span>
          </div>
          <div class="text-gray-600">
            Received:
            <span class="font-semibold">{{
              emailStore.stats.received_count
            }}</span>
          </div>
        </div>
      </div>

      <div
        class="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5 h-[calc(100vh-220px)]"
      >
        <!-- Mail List Sidebar -->
        <div
          class="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col"
        >
          <div
            class="px-5 py-5 border-b border-gray-100 flex justify-between items-center"
          >
            <h2 class="text-lg font-semibold text-gray-900">Inbox</h2>
            <span
              class="bg-gray-100 text-gray-600 px-3 py-1 rounded-xl text-sm font-medium"
            >
              {{ emailStore.emails?.data?.length || 0 }}
            </span>
          </div>

          <div class="overflow-y-auto flex-1">
            <div
              v-for="email in emailStore.emails?.data"
              :key="email.id"
              @click="selectEmail(email)"
              :class="[
                'px-5 py-4 border-b border-gray-50 cursor-pointer transition-all duration-200',
                selectedEmail?.id === email.id
                  ? 'bg-[#fff5f2] border-l-4 border-l-[#FF613c]'
                  : 'hover:bg-gray-50',
                !email.is_read && 'bg-blue-50',
              ]"
            >
              <div class="flex justify-between items-start mb-1.5">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span
                      :class="[
                        'font-semibold text-sm truncate',
                        !email.is_read ? 'text-gray-900' : 'text-gray-700',
                      ]"
                    >
                      {{
                        email.type === "sent"
                          ? email.to_email
                          : email.from_email
                      }}
                    </span>
                    <span
                      v-if="email.has_attachments"
                      class="text-gray-400"
                      title="Has attachments"
                    >
                      📎
                    </span>
                  </div>
                  <span class="text-xs text-gray-500">
                    {{ email.from_name || "No name" }}
                  </span>
                </div>
                <span class="text-xs text-gray-400 ml-2 whitespace-nowrap">
                  {{ formatTime(email.created_at) }}
                </span>
              </div>

              <div
                :class="[
                  'text-sm mb-1 truncate',
                  !email.is_read
                    ? 'font-semibold text-gray-900'
                    : 'text-gray-700',
                ]"
              >
                {{ email.subject }}
              </div>

              <div class="text-sm text-gray-500 truncate">
                {{ email.preview || stripHtml(email.body) }}
              </div>

              <div class="flex gap-2 mt-2">
                <span
                  :class="[
                    'text-xs px-2 py-0.5 rounded-full',
                    email.type === 'sent'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700',
                  ]"
                >
                  {{ email.type }}
                </span>
                <span
                  v-if="email.status === 'failed'"
                  class="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700"
                >
                  Failed
                </span>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div
            v-if="emailStore.emails?.pagination"
            class="px-5 py-3 border-t border-gray-100 flex justify-between items-center"
          >
            <button
              @click="previousPage"
              :disabled="emailStore.emails.pagination.current_page === 1"
              :class="[
                'px-3 py-1 rounded text-sm',
                emailStore.emails.pagination.current_page === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-[#FF613c] hover:bg-[#fff5f2]',
              ]"
            >
              Previous
            </button>

            <span class="text-sm text-gray-600">
              Page {{ emailStore.emails.pagination.current_page }} of
              {{ emailStore.emails.pagination.last_page }}
            </span>

            <button
              @click="nextPage"
              :disabled="!emailStore.emails.pagination.has_more"
              :class="[
                'px-3 py-1 rounded text-sm',
                !emailStore.emails.pagination.has_more
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-[#FF613c] hover:bg-[#fff5f2]',
              ]"
            >
              Next
            </button>
          </div>

          <div
            v-if="!emailStore.emails?.data?.length && !emailStore.loading"
            class="flex flex-col items-center justify-center py-16 px-5 text-gray-400"
          >
            <div class="text-5xl mb-3">📭</div>
            <p>No messages found</p>
          </div>
        </div>

        <!-- Mail Viewer -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div v-if="selectedEmail" class="h-full flex flex-col">
            <div
              class="px-6 py-6 border-b border-gray-100 overflow-y-auto flex-1"
            >
              <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                  <h2 class="text-2xl font-semibold text-gray-900 mb-3">
                    {{ selectedEmail.subject }}
                  </h2>
                  <div class="space-y-2 text-sm">
                    <div class="flex items-start gap-2">
                      <span class="font-medium text-gray-600 min-w-[60px]"
                        >From:</span
                      >
                      <div>
                        <span class="text-[#FF613c] font-medium">{{
                          selectedEmail.from_email
                        }}</span>
                        <span
                          v-if="selectedEmail.from_name"
                          class="text-gray-600 ml-2"
                        >
                          ({{ selectedEmail.from_name }})
                        </span>
                      </div>
                    </div>
                    <div class="flex items-start gap-2">
                      <span class="font-medium text-gray-600 min-w-[60px]"
                        >To:</span
                      >
                      <span class="text-gray-700">{{
                        selectedEmail.to_email
                      }}</span>
                    </div>
                    <div v-if="selectedEmail.cc" class="flex items-start gap-2">
                      <span class="font-medium text-gray-600 min-w-[60px]"
                        >CC:</span
                      >
                      <span class="text-gray-700">{{
                        formatArray(selectedEmail.cc)
                      }}</span>
                    </div>
                    <div class="flex items-start gap-2">
                      <span class="font-medium text-gray-600 min-w-[60px]"
                        >Date:</span
                      >
                      <span class="text-gray-700">{{
                        formatFullTime(selectedEmail.created_at)
                      }}</span>
                    </div>
                    <div
                      v-if="selectedEmail.booking"
                      class="flex items-start gap-2"
                    >
                      <span class="font-medium text-gray-600 min-w-[60px]"
                        >Booking:</span
                      >
                      <span class="text-gray-700"
                        >#{{ selectedEmail.booking.crm_id }}</span
                      >
                    </div>
                  </div>
                </div>
                <div class="flex gap-2 ml-4">
                  <button
                    @click="toggleReadStatus"
                    class="px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all duration-200 hover:bg-gray-50"
                    :class="
                      selectedEmail.is_read
                        ? 'border-gray-300 text-gray-600'
                        : 'border-blue-500 text-blue-600'
                    "
                  >
                    {{ selectedEmail.is_read ? "Mark Unread" : "Mark Read" }}
                  </button>
                  <button
                    @click="startReply"
                    class="bg-white flex justify-center items-center gap-x-2 hover:bg-[#FF613c] text-[#FF613c] hover:text-white border-2 border-[#FF613c] px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    <ArrowUturnLeftIcon class="w-4 h-4" /> Reply
                  </button>
                </div>
              </div>

              <!-- Email Body -->
              <div class="mt-6 pt-6 border-t border-gray-100">
                <div
                  v-html="selectedEmail.body"
                  class="prose max-w-none text-[15px] leading-relaxed text-gray-700"
                ></div>
              </div>

              <!-- Attachments -->
              <div
                v-if="selectedEmail.attachments"
                class="mt-6 pt-6 border-t border-gray-100"
              >
                <h3 class="text-sm font-semibold text-gray-900 mb-3">
                  Attachments ({{ selectedEmail.attachment_count }})
                </h3>
                <div class="flex flex-wrap gap-2">
                  <div
                    v-for="(attachment, index) in parseAttachments(
                      selectedEmail.attachments,
                    )"
                    :key="index"
                    class="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <span class="text-gray-600">📎</span>
                    <span class="text-sm text-gray-700">{{
                      attachment.name
                    }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reply Form -->
            <div
              v-if="showReply"
              class="border-t-2 border-gray-100 px-6 py-6 bg-gray-50"
            >
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-base font-semibold text-gray-900">
                  Reply to {{ selectedEmail.from_email }}
                </h3>
                <button
                  @click="showReply = false"
                  class="w-8 h-8 flex items-center justify-center text-2xl text-gray-400 hover:bg-gray-200 hover:text-gray-700 rounded-md transition-all duration-200"
                >
                  ✕
                </button>
              </div>
              <textarea
                v-model="replyMessage"
                placeholder="Type your reply..."
                rows="6"
                class="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm resize-y mb-3 focus:outline-none focus:border-[#FF613c]"
              ></textarea>
              <div class="flex gap-3">
                <button
                  @click="sendReply"
                  :disabled="!replyMessage.trim()"
                  class="bg-[#FF613c] hover:bg-[#e55534] text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Reply
                </button>
                <button
                  @click="showReply = false"
                  class="bg-white hover:bg-gray-100 text-gray-600 border border-gray-300 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <div
            v-else
            class="h-full flex flex-col items-center justify-center text-gray-400"
          >
            <div class="text-6xl mb-4">✉️</div>
            <p>Select a message to read</p>
          </div>
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
              class="w-8 h-8 flex items-center justify-center text-2xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-md transition-all duration-200"
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
                class="bg-[#FF613c] hover:bg-[#e55534] text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Message
              </button>
              <button
                @click="showCompose = false"
                class="bg-white hover:bg-gray-100 text-gray-600 border border-gray-300 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200"
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

const emailStore = useEmailStore();

// State
const selectedEmail = ref(null);
const showCompose = ref(false);
const showReply = ref(false);
const replyMessage = ref("");
const composeMail = ref({
  to: "",
  subject: "",
  body: "",
});

const filters = ref({
  search: "",
  status: "",
  unread_only: false,
  per_page: 20,
});

let searchTimeout = null;

// Fetch emails
const fetchEmails = async () => {
  try {
    await emailStore.getInbox(filters.value);
  } catch (error) {
    console.error("Error fetching emails:", error);
    alert("Failed to load emails");
  }
};

// Debounced search
const debounceSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchEmails();
  }, 500);
};

// Select email
const selectEmail = async (email) => {
  selectedEmail.value = email;
  showReply.value = false;

  // Mark as read if unread
  if (!email.is_read) {
    try {
      await emailStore.markAsRead([email.id]);
      email.is_read = true;
      // Update stats
      if (emailStore.stats) {
        emailStore.stats.unread_count--;
      }
    } catch (error) {
      console.error("Error marking email as read:", error);
    }
  }
};

// Toggle read status
const toggleReadStatus = async () => {
  if (!selectedEmail.value) return;

  try {
    if (selectedEmail.value.is_read) {
      await emailStore.markAsUnread([selectedEmail.value.id]);
      selectedEmail.value.is_read = false;
      if (emailStore.stats) emailStore.stats.unread_count++;
    } else {
      await emailStore.markAsRead([selectedEmail.value.id]);
      selectedEmail.value.is_read = true;
      if (emailStore.stats) emailStore.stats.unread_count--;
    }
  } catch (error) {
    console.error("Error toggling read status:", error);
    alert("Failed to update read status");
  }
};

// Start reply
const startReply = () => {
  showReply.value = true;
  replyMessage.value = "";
};

// Send reply
const sendReply = async () => {
  if (!replyMessage.value.trim() || !selectedEmail.value) return;

  try {
    const response = await emailStore.sendReply(selectedEmail.value.id, {
      body: replyMessage.value,
    });

    alert("Reply sent successfully!");
    showReply.value = false;
    replyMessage.value = "";
    fetchEmails(); // Refresh emails
  } catch (error) {
    console.error("Error sending reply:", error);
    alert("Failed to send reply");
  }
};

// Send new email
const sendNewEmail = async () => {
  if (
    !composeMail.value.to ||
    !composeMail.value.subject ||
    !composeMail.value.body
  ) {
    alert("Please fill in all fields");
    return;
  }

  try {
    await emailStore.composeEmail(composeMail.value);
    alert("Message sent successfully!");
    showCompose.value = false;
    composeMail.value = { to: "", subject: "", body: "" };
    fetchEmails(); // Refresh emails
  } catch (error) {
    console.error("Error sending email:", error);
    alert("Failed to send message");
  }
};

// Pagination
const nextPage = () => {
  if (emailStore.emails?.pagination?.has_more) {
    filters.value.page = emailStore.emails.pagination.current_page + 1;
    fetchEmails();
  }
};

const previousPage = () => {
  if (emailStore.emails?.pagination?.current_page > 1) {
    filters.value.page = emailStore.emails.pagination.current_page - 1;
    fetchEmails();
  }
};

// Helper functions
const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

const formatFullTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const stripHtml = (html) => {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
};

const formatArray = (arr) => {
  if (typeof arr === "string") {
    try {
      arr = JSON.parse(arr);
    } catch (e) {
      return arr;
    }
  }
  return Array.isArray(arr) ? arr.join(", ") : arr;
};

const parseAttachments = (attachments) => {
  if (typeof attachments === "string") {
    try {
      return JSON.parse(attachments);
    } catch (e) {
      return [];
    }
  }
  return attachments || [];
};

onMounted(() => {
  fetchEmails();
});
</script>

<style scoped>
.prose {
  max-width: none;
}

.prose img {
  max-width: 100%;
  height: auto;
}
</style>
