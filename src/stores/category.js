import axios from "axios";
import { defineStore } from "pinia";

export const useCategoryStore = defineStore("category", {
  state: () => ({ data: null, loading: false, categories: null }),
  getters: {},
  actions: {
    async getSimpleListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/categories-list");
        this.categories = response.data.result;
        this.loading = false;
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/categories", {
          params: params,
        });
        this.data = response.data.result;
        this.loading = false;
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async addNewAction(data) {
      try {
        const response = await axios.post("/categories", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/categories/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/categories/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
