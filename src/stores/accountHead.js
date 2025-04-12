import axios from "axios";
import { defineStore } from "pinia";

export const useAccountHeadStore = defineStore("accountHead", {
  state: () => ({ accountHeads: null, loading: false }),
  getters: {},
  actions: {
    async getSimpleListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/account-heads");
        this.accountHeads = response.data.result;
        this.loading = false;

        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async getChangePage(url,params) {
      this.loading = true;
      const response = await axios.get(url,{
        params: params,
      });
      this.accountHeads = response.data.result;
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/account-heads", {
          params: params,
        });
        this.accountHeads = response.data.result;
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
        const response = await axios.post("/account-heads", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/account-heads/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/account-heads/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
