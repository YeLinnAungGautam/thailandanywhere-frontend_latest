import { defineStore } from "pinia";
import { chatApi } from "@/api/chat"; // ရှိပြီးသား chatApi သုံးပါ

export const useMessageStore = defineStore("message", {
  state: () => ({
    loading: false,
    success: false,
    error: null,
  }),

  actions: {
    async sendLineMessage(message) {
      this.loading = true;
      this.success = false;
      this.error = null;

      try {
        // Node.js server (localhost:5001) → LINE API
        const response = await chatApi.post("/line/send", {
          message: message,
        });

        this.success = true;
        return response.data;
      } catch (err) {
        this.error = err.response?.data?.error || "Failed to send message";
      } finally {
        this.loading = false;
      }
    },
  },
});
