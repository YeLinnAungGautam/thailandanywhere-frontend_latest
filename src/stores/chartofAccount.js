import axios from "axios";
import { defineStore } from "pinia";

export const useChartOfAccountStore = defineStore("chartOfAccount", {
  state: () => ({ chartOfAccounts: null, loading: false, balances: null }),
  getters: {},
  actions: {
    async getSimpleListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/chart-of-accounts?limit=300");
        this.chartOfAccounts = response.data.result;
        this.loading = false;

        return response.data;
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
      this.chartOfAccounts = response.data.result;
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/chart-of-accounts", {
          params: params,
        });
        this.chartOfAccounts = response.data.result;
        this.loading = false;
        console.log(response);
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async addNewAction(data) {
      try {
        const response = await axios.post("/chart-of-accounts", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/chart-of-accounts/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/chart-of-accounts/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async getOverBalanceDue(params) {
      try {
        this.loading = true;
        const response = await axios.get("/balance-due-over", {
          params: params,
        });
        this.loading = false;
        this.balances = response.data.result;
        console.log(response);
        return response.data.result;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },

    async getChangeBalanceDuePage(url, params) {
      this.loading = true;
      const response = await axios.get(url, {
        params: params,
      });
      this.balances = response.data.result;
      this.loading = false;
      return response.data;
    },
  },
});
