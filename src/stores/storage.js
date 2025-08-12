import axios from "axios";
import { defineStore } from "pinia";

export const useStorageStore = defineStore("storage", {
  state: () => ({
    loading: false,
    storages: null,
  }),
  getters: {},
  actions: {
    async getFileTypeCount(type) {
      try {
        this.loading = true;
        // Handle subdirectories like 'pdfs/batches'
        const endpoint = type.includes("/")
          ? `/admin/files/${type}/count`.replace("/", "/").replace("//", "/")
          : `/admin/files/${type}/count`;

        const response = await axios.get(endpoint);
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
        // Handle subdirectories like 'pdfs/batches'
        const endpoint = type.includes("/")
          ? `/admin/files/${type}/list`
          : `/admin/files/${type}/list`;

        const response = await axios.get(endpoint);
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
        const response = await axios.get("/admin/files/stats");
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
        // Handle subdirectories like 'pdfs/batches'
        const endpoint = type.includes("/")
          ? `/admin/files/${type}/${filename}`
          : `/admin/files/${type}/${filename}`;

        const response = await axios.delete(endpoint);
        console.log(response);

        this.loading = false;
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },

    // New method to get filtered files
    async getFilteredFiles(type, filters = {}) {
      try {
        this.loading = true;
        const endpoint = type.includes("/")
          ? `/admin/files/${type}/filtered`
          : `/admin/files/${type}/filtered`;

        const response = await axios.get(endpoint, { params: filters });
        console.log(response);

        this.loading = false;
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    // New method to get file serving URL
    getFileUrl(type, filename) {
      if (type.includes("/")) {
        const [mainType, subType] = type.split("/");
        return `/admin/files/${mainType}/${subType}/serve/${filename}`;
      }
      return `/admin/files/${type}/serve/${filename}`;
    },
  },
});
