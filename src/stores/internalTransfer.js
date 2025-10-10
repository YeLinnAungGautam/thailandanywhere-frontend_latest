import axios from "axios";
import { defineStore } from "pinia";

export const useInternalTransferStore = defineStore("internalTransfer", {
  state: () => ({ loading: false }),
  getters: {},
  actions: {
    async addNewAction(data) {
      try {
        const response = await axios.post("/internal-transfers", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/internal-transfers/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/internal-transfers/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
