import axios from "axios";
import { defineStore } from "pinia";

export const useCarBookingStore = defineStore("carbooking", {
  state: () => ({ carbookings: null, loading: false }),
  getters: {},
  actions: {
    async getSimpleListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/car-bookings");
        this.carbookings = response.data;
        this.loading = false;

        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async getChangePage(url, params) {
      this.loading = true;
      console.log(params, url, "this is params");
      const response = await axios.get(url, {
        params: {
          supplier_id: params.supplier_id,
          daterange: `${params.first},${params.second}`,
        },
      });
      this.carbookings = response.data;
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        console.log(params, "this is params");
        const response = await axios.get(
          `/car-bookings?daterange=${params.first},${params.second}`,
          {
            params: params,
          }
        );

        this.loading = false;
        console.log(response.data, "this is carbooking");
        this.carbookings = response.data;
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async addNewAction(data, id) {
      try {
        const response = await axios.post(`/car-bookings/${id}`, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async getDetailAction(id) {
      try {
        const response = await axios.get(`/car-bookings/${id}/edit`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
