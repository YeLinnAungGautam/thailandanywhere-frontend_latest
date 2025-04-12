import axios from "axios";
import { defineStore } from "pinia";

export const useAccountClassStore = defineStore("accountClass", {
  state: () => ({ accountClasses: null, loading: false }),
  getters: {},
  actions: {
    async getSimpleListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/account-classes");
        this.accountClasses = response.data.result;
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
      this.accountClasses = response.data.result;
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/account-classes", {
          params: params,
        });
        this.accountClasses = response.data.result;
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
        const response = await axios.post("/account-classes", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/account-classes/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/account-classes/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
