import axios from "axios";
import { defineStore } from "pinia";

export const useGrouptourStore = defineStore("grouptour", {
  state: () => ({ grouptours: null, loading: false }),
  getters: {},
  actions: {
    async getSimpleListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/group-tours?limit=1000&page=1");
        this.grouptours = response.data.result;
        this.loading = false;

        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async getChangePage(url, params) {
      this.loading = true;
      const urlSearchParams = new URLSearchParams(new URL(url).search);
      const pageValue = urlSearchParams.get("page");
      const response = await axios.get(
        "/group-tours?limit=10&page=" + pageValue,
        {
          params: params,
        }
      );
      this.grouptours = response.data.result;
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/group-tours", {
          params: params,
        });
        this.grouptours = response.data.result;
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
        const response = await axios.post("/group-tours", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async getDetailAction(id) {
      try {
        const response = await axios.get("/group-tours/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/group-tours/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/group-tours/" + id);
        console.log(response.data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async downloadExport() {
      try {
        const res = await axios.get("/group-tours/export/csv");
        return res.data;
      } catch (err) {
        throw err;
      }
    },
  },
});
