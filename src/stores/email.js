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
    connectionStatus: null,
  }),
  getters: {
    unreadCount: (state) => state.stats?.unread_count || 0,
    totalEmails: (state) => state.stats?.total_emails || 0,
    isConnected: (state) => state.connectionStatus?.connected || false,
  },
  actions: {
    // Check Gmail connection status
    async checkConnectionStatus() {
      try {
        const response = await axios.get("/gmail/auth/status");
        this.connectionStatus = response.data.data;
        return response.data;
      } catch (error) {
        this.connectionStatus = { connected: false };
        throw error;
      }
    },

    // Get Gmail auth URL
    async getAuthUrl() {
      try {
        const response = await axios.get("/gmail/auth/url");
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // Handle OAuth callback
    async handleCallback(code) {
      try {
        const response = await axios.post("/gmail/auth/callback", {
          code: code,
        });
        this.connectionStatus = response.data.data;
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // Disconnect Gmail
    async disconnect() {
      try {
        const response = await axios.delete("/gmail/auth/disconnect");
        this.connectionStatus = { connected: false };
        return response.data;
      } catch (error) {
        throw error;
      }
    },

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

        this.emails = response.data.data.emails;
        this.stats = response.data.data.stats;
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

        this.threads = response.data.data;
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
        this.selectedThread = response.data.data;
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
        const response = await axios.patch("/gmail/emails/mark-read", {
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
        const response = await axios.patch("/gmail/emails/mark-unread", {
          email_ids: emailIds,
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // Archive emails
    async archiveEmails(emailIds) {
      try {
        const response = await axios.patch("/gmail/emails/archive", {
          email_ids: emailIds,
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // Delete emails
    async deleteEmails(emailIds) {
      try {
        const response = await axios.delete("/gmail/emails", {
          data: {
            email_ids: emailIds,
          },
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
          `/gmail/emails/${emailId}/reply`,
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
        const response = await axios.post("/gmail/compose", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // Sync from Gmail
    async syncFromGmail(limit = 50) {
      try {
        this.loading = true;
        const response = await axios.post(`/gmail/sync?limit=${limit}`);
        this.loading = false;
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
  },
});
