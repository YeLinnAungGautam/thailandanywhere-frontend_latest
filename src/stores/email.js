import axios from "axios";
import { defineStore } from "pinia";

export const useEmailStore = defineStore("email", {
  state: () => ({
    emails: null,
    selectedEmail: null,
    threads: null,
    selectedThread: null,
    loading: false,
    stats: null,
  }),
  getters: {
    unreadCount: (state) => state.stats?.unread_count || 0,
    totalEmails: (state) => state.stats?.total_emails || 0,
  },
  actions: {
    // Get inbox emails with filters
    async getInbox(params = {}) {
      try {
        this.loading = true;
        const response = await axios.get("/gmail/inbox", {
          params: {
            per_page: params.per_page || 20,
            status: params.status,
            search: params.search,
            unread_only: params.unread_only,
            start_date: params.start_date,
            end_date: params.end_date,
            booking_id: params.booking_id,
          },
        });

        this.emails = response.data.result.emails;
        this.stats = response.data.result.stats;
        this.loading = false;
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },

    // Get email threads
    async getThreads(params = {}) {
      try {
        this.loading = true;
        const response = await axios.get("/gmail/threads", {
          params: {
            per_page: params.per_page || 15,
            search: params.search,
            unread_only: params.unread_only,
          },
        });

        this.threads = response.data.result.threads;
        this.loading = false;
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },

    // Get specific thread details
    async getThreadDetails(threadId) {
      try {
        this.loading = true;
        const response = await axios.get(`/gmail/threads/${threadId}`);
        this.selectedThread = response.data.result;
        this.loading = false;
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },

    // Mark emails as read
    async markAsRead(emailIds) {
      try {
        const response = await axios.post("/gmail/inbox/mark-read", {
          email_ids: emailIds,
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // Mark emails as unread
    async markAsUnread(emailIds) {
      try {
        const response = await axios.post("/gmail/inbox/mark-unread", {
          email_ids: emailIds,
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // Send reply
    async sendReply(emailId, data) {
      try {
        const response = await axios.post(
          `/gmail/inbox/reply/${emailId}`,
          data,
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // Compose new email
    async composeEmail(data) {
      try {
        const response = await axios.post("/gmail/inbox/compose", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // Pagination helper
    async getChangePage(url, params) {
      this.loading = true;
      const response = await axios.get(url, {
        params: params,
      });
      this.emails = response.data.result.emails;
      this.stats = response.data.result.stats;
      this.loading = false;
      return response.data;
    },
  },
});
