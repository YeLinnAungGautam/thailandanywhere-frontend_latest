<template>
  <Layout>
    <div class="w-full mx-auto">
      <div
        class="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5 h-[calc(100vh-120px)]"
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
              {{ mails.length }}
            </span>
          </div>

          <div class="overflow-y-auto flex-1">
            <div
              v-for="mail in mails"
              :key="mail.id"
              @click="selectMail(mail)"
              :class="[
                'px-5 py-4 border-b border-gray-50 cursor-pointer transition-all duration-200',
                selectedMail?.id === mail.id
                  ? 'bg-[#fff5f2] border-l-4 border-l-[#FF613c]'
                  : 'hover:bg-gray-50',
                !mail.read && 'bg-gray-50',
              ]"
            >
              <div class="flex justify-between items-center mb-1.5">
                <span class="font-semibold text-gray-900 text-sm">{{
                  mail.from
                }}</span>
                <span class="text-xs text-gray-400">{{
                  formatTime(mail.timestamp)
                }}</span>
              </div>
              <div class="text-sm text-gray-700 font-medium mb-1 truncate">
                {{ mail.subject }}
              </div>
              <div class="text-sm text-gray-500 truncate">
                {{ mail.preview }}
              </div>
            </div>
          </div>

          <div
            v-if="mails.length === 0"
            class="flex flex-col items-center justify-center py-16 px-5 text-gray-400"
          >
            <div class="text-5xl mb-3">📭</div>
            <p>No messages yet</p>
          </div>
        </div>

        <!-- Mail Viewer -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div v-if="selectedMail" class="h-full flex flex-col overflow-y-auto">
            <div
              class="px-6 py-6 border-b border-gray-100 flex justify-between items-start"
            >
              <div>
                <h2 class="text-2xl font-semibold text-gray-900 mb-3">
                  {{ selectedMail.subject }}
                </h2>
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <span class="font-medium">From:</span>
                  <span class="text-[#FF613c] font-medium">{{
                    selectedMail.from
                  }}</span>
                  <span class="text-gray-300">•</span>
                  <span>{{ formatFullTime(selectedMail.timestamp) }}</span>
                </div>
              </div>
              <button
                @click="startReply"
                class="bg-white flex justify-center items-center gap-x-2 hover:bg-[#FF613c] text-[#FF613c] hover:text-white border-2 border-[#FF613c] px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              >
                <ArrowUturnLeftIcon class="w-4 h-4" /> Reply
              </button>
            </div>

            <div
              class="px-6 py-6 text-[15px] leading-relaxed text-gray-700 flex-1"
            >
              {{ selectedMail.body }}
            </div>

            <!-- Reply Form -->
            <div
              v-if="showReply"
              class="border-t-2 border-gray-100 px-6 py-6 bg-gray-50"
            >
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-base font-semibold text-gray-900">
                  Reply to {{ selectedMail.from }}
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
                  class="bg-[#FF613c] hover:bg-[#e55534] text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200"
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
          <div class="px-6 py-6">
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
                @click="sendMail"
                class="bg-[#FF613c] hover:bg-[#e55534] text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200"
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

// State
const mails = ref([]);
const selectedMail = ref(null);
const showCompose = ref(false);
const showReply = ref(false);
const replyMessage = ref("");
const composeMail = ref({
  to: "",
  subject: "",
  body: "",
});

// Fetch mails from your webhook/API
const fetchMails = async () => {
  try {
    // Replace with your actual API endpoint
    // const response = await fetch('/api/mails');
    // const data = await response.json();
    // mails.value = data;

    // Demo data - remove when integrating with real API
    mails.value = [
      {
        id: 1,
        from: "john@example.com",
        subject: "Welcome to our platform",
        preview: "Thank you for signing up! We are excited to have you...",
        body: "Thank you for signing up! We are excited to have you on board. Here are some tips to get started with our platform...",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
      },
      {
        id: 2,
        from: "support@example.com",
        subject: "Your request has been received",
        preview: "We have received your inquiry and will respond within...",
        body: "We have received your inquiry and will respond within 24 hours. Thank you for your patience.",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: 3,
        from: "newsletter@example.com",
        subject: "Weekly updates and news",
        preview: "Check out this week's highlights and upcoming events...",
        body: "Check out this week's highlights and upcoming events. We have some exciting announcements to share with you!",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        read: true,
      },
    ];
  } catch (error) {
    console.error("Error fetching mails:", error);
  }
};

// Select mail
const selectMail = (mail) => {
  selectedMail.value = mail;
  mail.read = true;
  showReply.value = false;
};

// Start reply
const startReply = () => {
  showReply.value = true;
  replyMessage.value = "";
};

// Send reply
const sendReply = async () => {
  if (!replyMessage.value.trim()) {
    alert("Please enter a message");
    return;
  }

  try {
    // Replace with your actual API endpoint
    // await fetch('/api/reply', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     to: selectedMail.value.from,
    //     subject: `Re: ${selectedMail.value.subject}`,
    //     body: replyMessage.value
    //   })
    // });

    alert("Reply sent successfully!");
    showReply.value = false;
    replyMessage.value = "";
  } catch (error) {
    console.error("Error sending reply:", error);
    alert("Failed to send reply");
  }
};

// Send new mail
const sendMail = async () => {
  if (
    !composeMail.value.to ||
    !composeMail.value.subject ||
    !composeMail.value.body
  ) {
    alert("Please fill in all fields");
    return;
  }

  try {
    // Replace with your actual API endpoint
    // await fetch('/api/send', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(composeMail.value)
    // });

    alert("Message sent successfully!");
    showCompose.value = false;
    composeMail.value = { to: "", subject: "", body: "" };
  } catch (error) {
    console.error("Error sending mail:", error);
    alert("Failed to send message");
  }
};

// Format time helpers
const formatTime = (date) => {
  const now = new Date();
  const diff = now - date;
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

const formatFullTime = (date) => {
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(() => {
  fetchMails();
});
</script>
