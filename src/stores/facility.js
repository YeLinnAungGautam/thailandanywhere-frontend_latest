import axios from "axios";
import { defineStore } from "pinia";

export const useFacilityStore = defineStore("facility", {
  state: () => ({ facilities: null, loading: false }),
  getters: {},
  actions: {
    async getSimpleListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get(`/facilities?limit=1000&page=1`);
        this.facilities = response.data.result;
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
      this.facilities = response.data.result;
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/facilities", {
          params: params,
        });
        this.facilities = response.data.result;
        this.loading = false;
        console.log(response);
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async getOrCreateBulkAction(data) {
      this.loading = true;
      try {
        const response = await axios.post(
          "/facilities/get-or-create-bulk",
          data,
        );
        return response.data;
      } catch (error) {
        this.error = error;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async addNewAction(data) {
      try {
        const response = await axios.post("/facilities", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/facilities/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/facilities/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
