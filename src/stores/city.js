import axios from "axios";
import { defineStore } from "pinia";

export const useCityStore = defineStore("city", {
  state: () => ({ cities: null, loading: false }),
  getters: {},
  actions: {
    async getSimpleListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get(`/cities?limit=50&page=1`);
        this.cities = response.data.result;
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
      this.cities = response.data.result;
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/cities", {
          params: params,
        });
        this.cities = response.data.result;
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
        const response = await axios.post("/cities", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/cities/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/cities/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async importAction(data) {
      try {
        this.importLoading = true;
        const res = await axios.post("/cities/import/csv", data);
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
