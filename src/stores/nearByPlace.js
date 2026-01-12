import axios from "axios";
import { defineStore } from "pinia";

export const useNearByPlaceStore = defineStore("nearByPlace", {
  state: () => ({ nearByPlaces: null, loading: false }),
  getters: {},
  actions: {
    async addNewAction(data) {
      try {
        const response = await axios.post("/nearby-places", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.put("/nearby-places/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateOrderAction(data) {
      try {
        const response = await axios.post("bluck/nearby-places/orders", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/nearby-places/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
