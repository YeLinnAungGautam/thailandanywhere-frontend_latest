import axios from "axios";
import { defineStore } from "pinia";

export const useTaxReceiptStore = defineStore("taxReceipt", {
  state: () => ({ taxReceipts: null, loading: false }),
  getters: {},
  actions: {
    async getChangePage(url) {
      this.loading = true;
      const response = await axios.get(url);
      this.taxReceipts = response.data.result;
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/tax-receipts", {
          params: params,
        });
        this.taxReceipts = response.data.result;
        this.loading = false;
        console.log(response);
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async getDetailAction(id) {
      try {
        const response = await axios.get("/tax-receipts/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async addNewAction(data) {
      try {
        const response = await axios.post("/tax-receipts", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/tax-receipts/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/tax-receipts/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async attachAction(id, data) {
      try {
        const response = await axios.post(
          `/tax-receipts/${id}/attach-reservations`,
          data
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async detachAction(id, data) {
      try {
        const response = await axios.post(
          `/tax-receipts/${id}/detach-reservations`,
          data
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async asyncAction(id, data) {
      try {
        const response = await axios.post(
          `/tax-receipts/${id}/async-reservations`,
          data
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
