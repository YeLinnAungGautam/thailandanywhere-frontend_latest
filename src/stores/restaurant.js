import axios from "axios";
import { defineStore } from "pinia";

export const useRestaurantStore = defineStore("restaurant", {
  state: () => ({
    restaurants: null,
    restaurant: null,
    loading: false,
    importLoading: false,
  }),
  getters: {},
  actions: {
    async getSimpleListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/restaurants?limit=1000&page=1");
        this.restaurant = response.data.result;
        this.loading = false;
        console.log(response);
        return response.data;
      } catch (error) {
        this.loading = true;
        throw error;
      }
    },
    async getChangePage(url, params) {
      this.loading = true;
      const response = await axios.get(url, {
        params: params,
      });
      this.restaurants = response.data.result;
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/restaurants", {
          params: params,
        });
        this.restaurants = response.data.result;
        this.loading = false;
        console.log(response);
        return response.data;
      } catch (error) {
        this.loading = true;
        throw error;
      }
    },
    async addNewAction(data) {
      try {
        const response = await axios.post("/restaurants", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/restaurants/" + id, data);
        return response.data;
      } catch (error) {
        this.loading = true;
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/restaurants/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteImageAction(id, imageID) {
      try {
        const response = await axios.delete(
          "/restaurants/" + id + "/images/" + imageID
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async getDetailAction(id) {
      try {
        const response = await axios.get("/restaurants/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async toggleLoading() {
      this.loading = !this.loading;
    },
    async downloadExport() {
      try {
        const res = await axios.get("/restaurants/export/csv");
        return res.data;
      } catch (err) {
        throw err;
      }
    },
    async importAction(data) {
      try {
        this.importLoading = true;
        const res = await axios.post("/restaurants/import/csv", data);
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
