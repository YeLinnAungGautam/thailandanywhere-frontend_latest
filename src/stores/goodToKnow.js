import axios from "axios";
import { defineStore } from "pinia";

export const useGoodToKnowStore = defineStore("goodToKnow", {
  state: () => ({ goodToKnows: null, loading: false }),
  getters: {},
  actions: {
    async addNewAction(data) {
      try {
        const response = await axios.post("/good-to-knows", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.put("/good-to-knows/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateOrderAction(data) {
      try {
        const response = await axios.post("bluck/good-to-knows/orders", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/good-to-knows/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
