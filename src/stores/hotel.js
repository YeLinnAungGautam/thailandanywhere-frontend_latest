import axios from "axios";
import { defineStore } from "pinia";

export const useHotelStore = defineStore("hotel", {
  state: () => ({ hotels: null, loading: false }),
  getters: {},
  actions: {
    async getSimpleListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/hotels?limit=1000&page=1");
        this.hotels = response.data.result;
        this.loading = false;
        console.log(response);
        return response.data;
      } catch (error) {
        this.loading = true;
        throw error;
      }
    },
    async getChangePage(url) {
      this.loading = true;
      const response = await axios.get(url);
      this.hotels = response.data.result;
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/hotels", {
          params: params,
        });
        this.hotels = response.data.result;
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
        const response = await axios.post("/hotels", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/hotels/" + id, data);
        return response.data;
      } catch (error) {
        this.loading = true;
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/hotels/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async getDetailAction(id) {
      try {
        const response = await axios.get("/hotels/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async toggleLoading() {
      this.loading = !this.loading;
    },
  },
});
