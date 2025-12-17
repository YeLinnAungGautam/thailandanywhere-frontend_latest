import axios from "axios";
import { defineStore } from "pinia";

export const useEmailStore = defineStore("email", {
  state: () => ({
    emails: null,
    loading: false,
  }),
  getters: {},
  actions: {
    async getChangePage(url, params) {
      this.loading = true;
      const response = await axios.get(url, {
        params: params,
      });
      this.emails = response.data.result;
      this.loading = false;
      return response.data;
    },
    async getEmailAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("gmail/inbox", {
          params: params,
        });
        this.emails = response.data.result;

        this.loading = false;
        console.log(response);
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
  },
});
