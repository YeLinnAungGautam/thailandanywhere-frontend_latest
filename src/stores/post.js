import axios from "axios";
import { defineStore } from "pinia";

export const usePostStore = defineStore("post", {
  state: () => ({ data: null, loading: false }),
  getters: {},
  actions: {
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/posts", {
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
        const response = await axios.post("/posts", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async getDetailAction(slug) {
      try {
        const response = await axios.get("/posts/" + slug);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/posts/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/posts/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
