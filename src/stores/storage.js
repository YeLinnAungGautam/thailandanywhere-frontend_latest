import axios from "axios";
import { defineStore } from "pinia";

export const useStorageStore = defineStore("storage", {
  state: () => ({ loading: false, storages: null }),
  getters: {},
  actions: {
    async getFileTypeCount(type) {
      try {
        this.loading = true;
        const response = await axios.get("/files/" + type + "/count");
        console.log(response);

        this.loading = false;
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async getFileTypeList(type) {
      try {
        this.loading = true;
        const response = await axios.get("/files/" + type + "/list");
        console.log(response);

        this.loading = false;
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async getStorageStats() {
      try {
        this.loading = true;
        const response = await axios.get("/storage/stats");
        console.log(response);

        this.loading = false;
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },

    async deleteFile(type, filename) {
      try {
        this.loading = true;
        const response = await axios.delete("/files/" + type + "/" + filename);
        console.log(response);

        this.loading = false;
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
  },
});
