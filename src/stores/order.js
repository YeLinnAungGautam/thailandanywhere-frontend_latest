import axios from "axios";
import { defineStore } from "pinia";

export const useOrderStore = defineStore("order", {
  state: () => ({ orders: null, loading: false }),
  getters: {},
  actions: {
    async getChangePage(url) {
      this.loading = true;
      const response = await axios.get(url);
      this.orders = response.data.result;
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/orders", {
          params: params,
        });
        this.orders = response.data.result;
        this.loading = false;
        console.log(response);
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },

    async addPayment(data, id) {
      try {
        const response = await axios.post("/orders/" + id + "/payment", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async changeToBooking(id) {
      try {
        const response = await axios.post(
          "/orders/" + id + "/change-to-booking"
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
