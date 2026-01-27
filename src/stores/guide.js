import axios from "axios";
import { defineStore } from "pinia";

export const useGuideStore = defineStore("guide", {
  state: () => ({
    guides: null,
    loading: false,
    importLoading: false,
  }),
  getters: {},
  actions: {
    async getSimpleListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get(`/guides?limit=50&page=1`);
        this.guides = response.data.result;
        this.loading = false;

        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async getChangePage(url) {
      this.loading = true;
      const response = await axios.get(url);
      this.guides = response.data.result;
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/guides", {
          params: params,
        });
        this.guides = response.data.result;
        this.loading = false;
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async addNewAction(data) {
      try {
        const response = await axios.post("/guides", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/guides/" + id, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/guides/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async toggleStatusAction(id) {
      try {
        const response = await axios.patch(`/guides/${id}/toggle-status`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async removeAreaAction(id, data) {
      try {
        const response = await axios.post(`/guides/${id}/remove-area`, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
