<template>
  <Layout>
    <div class="w-full mx-auto">
      <!-- Gmail Connection Status Banner -->
      <div
        v-if="!emailStore.isConnected && !emailStore.loading"
        class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-5 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <span class="text-2xl">⚠️</span>
          <div>
            <p class="font-semibold text-yellow-800">Gmail Not Connected</p>
            <p class="text-sm text-yellow-700">
              Connect your Gmail account to start managing emails
            </p>
          </div>
        </div>
        <button
          @click="connectGmail"
          class="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200"
        >
          Connect Gmail
        </button>
      </div>

      <!-- Connected Status -->
      <div
        v-else-if="emailStore.connectionStatus?.connected"
        class="bg-green-50 border border-green-200 rounded-xl p-4 mb-5 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <span class="text-2xl">✅</span>
          <div>
            <p class="font-semibold text-green-800">Gmail Connected</p>
            <p class="text-sm text-green-700">
              {{ emailStore.connectionStatus.email_address }}
            </p>
          </div>
        </div>
        <div class="flex gap-2">
          <button
            @click="syncEmails"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          >
            🔄 Sync Emails
          </button>
          <button
            @click="disconnectGmail"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          >
            Disconnect
          </button>
        </div>
      </div>

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
            <option value="sent">Sent</option>
            <option value="received">Received</option>
            <option value="delivered">Delivered</option>
            <option value="read">Read</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
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
            :disabled="!emailStore.isConnected"
            class="bg-[#FF613c] hover:bg-[#e55534] text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + New Email
          </button>
        </div>

        <!-- Stats -->
        <div v-if="emailStore.stats" class="flex gap-4 mt-4 text-sm flex-wrap">
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
          <div class="text-green-600">
            Sent:
            <span class="font-semibold">{{ emailStore.stats.sent_count }}</span>
          </div>
          <div class="text-blue-600">
            Received:
            <span class="font-semibold">{{
              emailStore.stats.received_count
            }}</span>
          </div>
          <div class="text-red-600">
            Failed:
            <span class="font-semibold">{{
              emailStore.stats.failed_count
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
        class="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5 h-[calc(100vh-280px)]"
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
              {{ emailStore.emails?.length || 0 }}
            </span>
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
                !email.is_read && 'bg-blue-50 font-semibold',
              ]"
            >
              <div class="flex justify-between items-start mb-1.5">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span
                      :class="[
                        'text-sm truncate',
                        !email.is_read
                          ? 'font-bold text-gray-900'
                          : 'text-gray-700',
                      ]"
                    >
                      {{
                        email.type === "sent"
                          ? email.to.display
                          : email.from.display
                      }}
                    </span>
                    <span
                      v-if="email.has_attachments"
                      class="text-gray-400 flex-shrink-0"
                      :title="`${email.attachment_count} attachment(s)`"
                    >
                      📎
                    </span>
                  </div>
                </div>
                <span class="text-xs text-gray-400 ml-2 whitespace-nowrap">
                  {{ formatTime(email.dates.created_at) }}
                </span>
              </div>

              <div
                :class="[
                  'text-sm mb-1 truncate',
                  !email.is_read ? 'font-bold text-gray-900' : 'text-gray-700',
                ]"
              >
                {{ email.subject }}
              </div>

              <div class="text-sm text-gray-500 truncate">
                {{ email.preview }}
              </div>

              <div class="flex gap-2 mt-2 flex-wrap">
                <span
                  :class="[
                    'text-xs px-2 py-0.5 rounded-full',
                    getTypeClass(email.type),
                  ]"
                >
                  {{ email.type_label }}
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
                  v-if="email.related_booking"
                  class="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700"
                  :title="`Booking: ${email.related_booking.customer_name}`"
                >
                  {{ email.related_booking.crm_id }}
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
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-[#FF613c] hover:bg-[#fff5f2]',
              ]"
            >
              ← Previous
            </button>

            <span class="text-sm text-gray-600">
              Page {{ paginationData.current_page }} of
              {{ paginationData.last_page }}
            </span>

            <button
              @click="nextPage"
              :disabled="!paginationData.has_more"
              :class="[
                'px-3 py-1 rounded text-sm transition-all',
                !paginationData.has_more
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-[#FF613c] hover:bg-[#fff5f2]',
              ]"
            >
              Next →
            </button>
          </div>

          <div
            v-if="!emailStore.emails?.length && !emailStore.loading"
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
                          selectedEmail.from.email
                        }}</span>
                        <span
                          v-if="selectedEmail.from.name"
                          class="text-gray-600 ml-2"
                        >
                          ({{ selectedEmail.from.name }})
                        </span>
                      </div>
                    </div>
                    <div class="flex items-start gap-2">
                      <span class="font-medium text-gray-600 min-w-[60px]"
                        >To:</span
                      >
                      <span class="text-gray-700">{{
                        selectedEmail.to.display
                      }}</span>
                    </div>
                    <div
                      v-if="selectedEmail.cc?.length"
                      class="flex items-start gap-2"
                    >
                      <span class="font-medium text-gray-600 min-w-[60px]"
                        >CC:</span
                      >
                      <span class="text-gray-700">{{
                        selectedEmail.cc.join(", ")
                      }}</span>
                    </div>
                    <div class="flex items-start gap-2">
                      <span class="font-medium text-gray-600 min-w-[60px]"
                        >Date:</span
                      >
                      <span class="text-gray-700">{{
                        formatFullTime(selectedEmail.dates.created_at)
                      }}</span>
                    </div>
                    <div class="flex items-start gap-2">
                      <span class="font-medium text-gray-600 min-w-[60px]"
                        >Status:</span
                      >
                      <span
                        :class="[
                          'px-2 py-0.5 rounded text-xs font-medium',
                          getStatusClass(selectedEmail.status),
                        ]"
                      >
                        {{ selectedEmail.status }}
                      </span>
                    </div>
                    <div
                      v-if="selectedEmail.related_booking"
                      class="flex items-start gap-2"
                    >
                      <span class="font-medium text-gray-600 min-w-[60px]"
                        >Booking:</span
                      >
                      <span class="text-gray-700">
                        {{ selectedEmail.related_booking.crm_id }} -
                        {{ selectedEmail.related_booking.customer_name }}
                      </span>
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
                    @click="archiveEmail"
                    class="px-4 py-2 rounded-lg text-sm font-medium border-2 border-gray-300 text-gray-600 transition-all duration-200 hover:bg-gray-50"
                  >
                    📦 Archive
                  </button>
                  <button
                    @click="deleteEmail"
                    class="px-4 py-2 rounded-lg text-sm font-medium border-2 border-red-300 text-red-600 transition-all duration-200 hover:bg-red-50"
                  >
                    🗑️ Delete
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
                v-if="selectedEmail.attachments?.length"
                class="mt-6 pt-6 border-t border-gray-100"
              >
                <h3 class="text-sm font-semibold text-gray-900 mb-3">
                  Attachments ({{ selectedEmail.attachment_count }})
                </h3>
                <div class="flex flex-wrap gap-2">
                  <div
                    v-for="(attachment, index) in selectedEmail.attachments"
                    :key="index"
                    class="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer"
                  >
                    <span class="text-gray-600">📎</span>
                    <span class="text-sm text-gray-700">{{ attachment }}</span>
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
                  Reply to {{ selectedEmail.from.display }}
                </h3>
                <button
                  @click="showReply = false"
                  class="w-8 h-8 flex items-center justify-center text-2xl text-gray-400 hover:bg-gray-200 hover:text-gray-700 rounded-md transition-all duration-200"
                >
                  ✕
                </button>
              </div>
              <input
                v-model="replySubject"
                type="text"
                placeholder="Subject"
                class="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm mb-3 focus:outline-none focus:border-[#FF613c]"
              />
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
            <div class="flex gap-3 mb-3">
              <input
                v-model="ccInput"
                type="text"
                placeholder="CC: (comma separated)"
                class="flex-1 px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#FF613c]"
              />
              <input
                v-model="bccInput"
                type="text"
                placeholder="BCC: (comma separated)"
                class="flex-1 px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#FF613c]"
              />
            </div>
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
import { ref, onMounted, computed } from "vue";
import Layout from "./Layout.vue";
import { ArrowUturnLeftIcon } from "@heroicons/vue/24/outline";
import { useEmailStore } from "../stores/email";

const emailStore = useEmailStore();

// State
const selectedEmail = ref(null);
const showCompose = ref(false);
const showReply = ref(false);
const replyMessage = ref("");
const replySubject = ref("");
const composeMail = ref({
  to: "",
  subject: "",
  body: "",
});
const ccInput = ref("");
const bccInput = ref("");
const paginationData = ref(null);

const filters = ref({
  search: "",
  status: "",
  unread_only: false,
  per_page: 20,
  page: 1,
});

let searchTimeout = null;

// Computed
const currentPage = computed(() => filters.value.page);

// Gmail Connection Methods
const connectGmail = async () => {
  try {
    const response = await emailStore.getAuthUrl();
    console.log(response, "this is auth url");

    if (response.result.auth_url) {
      // Redirect to Google OAuth
      window.location.href = response.result.auth_url;
    }
  } catch (error) {
    console.error("Error getting auth URL:", error);
    alert("Failed to get authorization URL");
  }
};

const disconnectGmail = async () => {
  if (!confirm("Are you sure you want to disconnect Gmail?")) return;

  try {
    await emailStore.disconnect();
    alert("Gmail disconnected successfully");
    emailStore.emails = null;
    selectedEmail.value = null;
  } catch (error) {
    console.error("Error disconnecting Gmail:", error);
    alert("Failed to disconnect Gmail");
  }
};

const syncEmails = async () => {
  if (!confirm("Sync recent emails from Gmail? This may take a moment."))
    return;

  try {
    const response = await emailStore.syncFromGmail(50);
    alert(`Successfully synced ${response.data.synced_count} emails`);
    await fetchEmails();
  } catch (error) {
    console.error("Error syncing emails:", error);
    alert("Failed to sync emails");
  }
};

// Fetch emails
const fetchEmails = async () => {
  try {
    const response = await emailStore.getInbox(filters.value);
    if (response.data.pagination) {
      paginationData.value = response.data.pagination;
    }
  } catch (error) {
    console.error("Error fetching emails:", error);
    if (error.response?.status === 401) {
      alert("Gmail connection expired. Please reconnect.");
    } else {
      alert("Failed to load emails");
    }
  }
};

// Debounced search
const debounceSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    filters.value.page = 1;
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

// Archive email
const archiveEmail = async () => {
  if (!selectedEmail.value) return;
  if (!confirm("Archive this email?")) return;

  try {
    await emailStore.archiveEmails([selectedEmail.value.id]);
    alert("Email archived successfully");
    selectedEmail.value = null;
    await fetchEmails();
  } catch (error) {
    console.error("Error archiving email:", error);
    alert("Failed to archive email");
  }
};

// Delete email
const deleteEmail = async () => {
  if (!selectedEmail.value) return;
  if (!confirm("Delete this email? This action cannot be undone.")) return;

  try {
    await emailStore.deleteEmails([selectedEmail.value.id]);
    alert("Email deleted successfully");
    selectedEmail.value = null;
    await fetchEmails();
  } catch (error) {
    console.error("Error deleting email:", error);
    alert("Failed to delete email");
  }
};

// Start reply
const startReply = () => {
  showReply.value = true;
  replyMessage.value = "";
  replySubject.value = `Re: ${selectedEmail.value.subject}`;
};

// Send reply
const sendReply = async () => {
  if (!replyMessage.value.trim() || !selectedEmail.value) return;

  try {
    const response = await emailStore.sendReply(selectedEmail.value.id, {
      body: replyMessage.value,
      subject: replySubject.value,
    });

    alert("Reply sent successfully!");
    showReply.value = false;
    replyMessage.value = "";
    replySubject.value = "";
    await fetchEmails();
  } catch (error) {
    console.error("Error sending reply:", error);
    alert(error.response?.data?.message || "Failed to send reply");
  }
};

// Send new email
const sendNewEmail = async () => {
  if (
    !composeMail.value.to ||
    !composeMail.value.subject ||
    !composeMail.value.body
  ) {
    alert("Please fill in all required fields");
    return;
  }

  try {
    const emailData = {
      to: composeMail.value.to,
      subject: composeMail.value.subject,
      body: composeMail.value.body,
    };

    // Parse CC and BCC
    if (ccInput.value.trim()) {
      emailData.cc = ccInput.value
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean);
    }
    if (bccInput.value.trim()) {
      emailData.bcc = bccInput.value
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean);
    }

    await emailStore.composeEmail(emailData);
    alert("Message sent successfully!");
    showCompose.value = false;
    composeMail.value = { to: "", subject: "", body: "" };
    ccInput.value = "";
    bccInput.value = "";
    await fetchEmails();
  } catch (error) {
    console.error("Error sending email:", error);
    alert(error.response?.data?.message || "Failed to send message");
  }
};

// Pagination
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

const getTypeClass = (type) => {
  const classes = {
    sent: "bg-green-100 text-green-700",
    received: "bg-blue-100 text-blue-700",
  };
  return classes[type] || "bg-gray-100 text-gray-700";
};

const getStatusClass = (status) => {
  const classes = {
    sent: "bg-green-100 text-green-700",
    delivered: "bg-blue-100 text-blue-700",
    read: "bg-purple-100 text-purple-700",
    failed: "bg-red-100 text-red-700",
    pending: "bg-yellow-100 text-yellow-700",
  };
  return classes[status] || "bg-gray-100 text-gray-700";
};

// Check connection status and OAuth callback on mount
onMounted(async () => {
  // Check if there's an OAuth code in the URL
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  if (code) {
    try {
      await emailStore.handleCallback(code);
      // Remove code from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      alert("Gmail connected successfully!");
    } catch (error) {
      console.error("Error handling OAuth callback:", error);
      alert("Failed to connect Gmail");
    }
  }

  // Check connection status
  await emailStore.checkConnectionStatus();

  // Fetch emails if connected
  if (emailStore.isConnected) {
    await fetchEmails();
  }
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
