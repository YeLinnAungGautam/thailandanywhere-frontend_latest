import axios from "axios";
import { defineStore } from "pinia";

export const useKeyHighLightStore = defineStore("keyHighLight", {
  state: () => ({ keyHighLights: null, loading: false }),
  getters: {},
  actions: {
    async addNewAction(data) {
      try {
        const response = await axios.post("/key-highlights", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/key-highlights/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateOrderAction(data) {
      try {
        const response = await axios.post("bluck/key-highlights/orders", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/key-highlights/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
