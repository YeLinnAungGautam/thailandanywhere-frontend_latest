import axios from "axios";
import { defineStore } from "pinia";

export const useGroupByStore = defineStore("groupby", {
  state: () => ({ results: null, loading: false }),
  getters: {},
  actions: {
    async getChangePage(url) {
      this.loading = true;
      const response = await axios.get(url);
      this.results = response.data.result;
      this.loading = false;
      return response.data;
    },
    async ReservationHotelList() {
      try {
        const response = await axios.get("/reservations-hotel");
        this.results = response.data.result;
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async ReservationHotelDetailAction(id) {
      try {
        const response = await axios.get("/reservations-hotel" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
