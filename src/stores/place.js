import axios from "axios";
import { defineStore } from "pinia";

export const usePlaceStore = defineStore("place", {
  state: () => ({ places: null, loading: false }),
  getters: {},
  actions: {
    async getSimpleListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get(`/places?limit=1000&page=1`);
        this.places = response.data.result;
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
      this.places = response.data.result;
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/places", {
          params: params,
        });
        this.places = response.data.result;
        this.loading = false;
        console.log(response.data);
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async addNewAction(data) {
      try {
        const response = await axios.post("/places", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/places/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/places/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async importAction(data) {
      try {
        this.importLoading = true;
        const res = await axios.post("/places/import/csv", data);
        if (res.status === 200) {
          this.importLoading = false;
        }
        return res.data;
      } catch (err) {
        this.importLoading = false;
        throw err;
      }
    },
  },
});
