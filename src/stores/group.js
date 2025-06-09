import axios from "axios";
import { defineStore } from "pinia";

export const useGroupStore = defineStore("group", {
  state: () => ({ groups: null, loading: false }),
  getters: {},
  actions: {
    async getChangePage(url, params) {
      this.loading = true;
      const response = await axios.post(url, params);
      this.groups = response.data.result;
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.post("/booking-item-groups", params);
        this.groups = response.data.result;
        this.loading = false;
        console.log(response);
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/booking-item-groups/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updatePassportAction(data, id) {
      try {
        const response = await axios.post(
          "/booking-item-groups/" + id + "/passports",
          data
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
