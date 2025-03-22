import axios from "axios";
import { defineStore } from "pinia";

export const useGroupByStore = defineStore("groupby", {
  state: () => ({ results: null, loading: false }),
  getters: {},
  actions: {
    async getChangePage(url, params) {
      this.loading = true;
      const response = await axios.get(url, {
        params: params,
      });
      this.results = response.data.result;
      this.loading = false;
      return response.data;
    },
    async ReservationHotelList(params) {
      try {
        this.loading = true;
        const response = await axios.get("/reservations-hotel", {
          params: params,
        });
        this.results = response.data.result;
        return response.data;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async ReservationHotelDetailAction(id, product_id) {
      try {
        const response = await axios.get(
          "/reservations-hotel/" + id + "/" + product_id
        );
        return response.data.result;
      } catch (error) {
        throw error;
      }
    },
    async ReservationHotelDetailCopyAction(id, product_id) {
      try {
        const response = await axios.get(
          "/reservations-hotel/" + id + "/copy/" + product_id
        );
        return response.data.result;
      } catch (error) {
        throw error;
      }
    },
  },
});
