import { defineStore } from "pinia";
import axios from "axios";

const fbApi = axios.create({
  baseURL: import.meta.env.VITE_CHAT_API_URL,
  headers: { "Content-Type": "application/json" },
});

fbApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const useFacebookMessageStore = defineStore("facebookMessage", {
  state: () => ({
    // conversations list
    conversations: [],
    stats: null,
    conversationsLoading: false,
    conversationsError: null,

    // selected conversation
    selectedConversation: null,
    messages: [],
    messagesLoading: false,
    messagesError: null,

    // sending
    sending: false,
    sendError: null,
  }),

  getters: {
    sortedConversations: (state) =>
      [...state.conversations].sort(
        (a, b) => new Date(b.last_message_at) - new Date(a.last_message_at),
      ),
  },

  actions: {
    async fetchConversations() {
      this.conversationsLoading = true;
      this.conversationsError = null;
      try {
        const { data } = await fbApi.get("/facebook/conversations");
        this.conversations = data.conversations || [];
        this.stats = data.stats || null;
      } catch (e) {
        this.conversationsError = e.response?.data?.error || e.message;
      } finally {
        this.conversationsLoading = false;
      }
    },

    async fetchMessages(conversationId) {
      this.messagesLoading = true;
      this.messagesError = null;
      this.messages = [];
      try {
        const { data } = await fbApi.get(
          `/facebook/conversations/${conversationId}/messages`,
        );
        this.messages = data.messages || [];
      } catch (e) {
        this.messagesError = e.response?.data?.error || e.message;
      } finally {
        this.messagesLoading = false;
      }
    },

    async selectConversation(conv) {
      this.selectedConversation = conv;
      await this.fetchMessages(conv._id);
    },

    async sendMessage(text) {
      if (!this.selectedConversation || !text.trim()) return;
      this.sending = true;
      this.sendError = null;
      try {
        await fbApi.post("/facebook/send", {
          conversation_id: this.selectedConversation._id,
          text: text.trim(),
        });
        // Optimistic: add to messages locally
        this.messages.push({
          _id: `tmp-${Date.now()}`,
          message_text: text.trim(),
          content_type: "text",
          type: "admin",
          fb_timestamp: new Date().toISOString(),
        });
      } catch (e) {
        this.sendError = e.response?.data?.error || e.message;
        throw e;
      } finally {
        this.sending = false;
      }
    },

    async analysics(start, end) {
      const res = await fbApi.get(
        `/facebook/analytics?start=${start}&end=${end}`,
      );
      return res;
    },

    clearSelection() {
      this.selectedConversation = null;
      this.messages = [];
      this.messagesError = null;
    },
  },
});
