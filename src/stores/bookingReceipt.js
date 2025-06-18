import axios from "axios";
import { defineStore } from "pinia";

export const useBookingReceiptStore = defineStore("bookingReceipt", {
  state: () => ({ receipts: null, loading: false }),
  getters: {},
  actions: {
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get(`/all/receipts`, {
          params: params,
        });
        this.receipts = response.data.data;
        this.loading = false;

        return response.data.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async getChangePage(url, params) {
      this.loading = true;
      const response = await axios.get(url, {
        params: params,
      });
      this.receipts = response.data.data;
      this.loading = false;
      return response.data.data;
    },
  },
});
