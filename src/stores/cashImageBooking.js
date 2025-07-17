import axios from "axios";
import { defineStore } from "pinia";

export const useCashImageBookingStore = defineStore("cashImageBooking", {
  state: () => ({ cashImageBookings: null, loading: false }),
  getters: {},
  actions: {
    async getSimpleListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/cash-image-bookings", {
          params: params,
        });
        this.cashImageBookings = response.data.result;
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
      this.cashImageBookings = response.data.result;
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/cash-image-bookings", {
          params: params,
        });
        this.cashImageBookings = response.data.result;
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
        const response = await axios.post("/cash-image-bookings", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async getDetailAction(id) {
      try {
        const response = await axios.get("/cash-image-bookings/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/cash-image-bookings/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/cash-image-bookings/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async createAllAction(data) {
      try {
        const response = await axios.post("/cash-image-bookings/bulk", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAllAction(data) {
      try {
        const response = await axios.delete("/cash-image-bookings/bulk", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
