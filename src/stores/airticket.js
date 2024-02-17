import axios from "axios";
import { defineStore } from "pinia";

export const useAirTicketStore = defineStore("airticket", {
  state: () => ({ airtickets: null, loading: false }),
  getters: {},
  actions: {
    async getSimpleListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/airline-tickets?limit=1000&page=1");
        this.airtickets = response.data.result;
        this.loading = false;

        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async getChangePage(url, params) {
      this.loading = true;
      const response = await axios.get(url, {
        params: params,
      });
      this.airtickets = response.data.result;
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/airline-tickets", {
          params: params,
        });
        this.airtickets = response.data.result;
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
        const response = await axios.post("/airline-tickets", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/airline-tickets/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/airline-tickets/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async downloadExport() {
      try {
        const res = await axios.get("/airline-tickets/export/csv");
        return res.data;
      } catch (err) {
        throw err;
      }
    },
  },
});
