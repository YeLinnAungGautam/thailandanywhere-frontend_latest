import axios from "axios";
import { defineStore } from "pinia";

export const useRoutePlanStore = defineStore("routePlan", {
  state: () => ({
    routePlans: null,
    loading: false,
  }),

  actions: {
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/route-plans", { params });
        this.routePlans = response.data.result;
        return response.data;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async getChangePage(url, params) {
      this.loading = true;
      // const urlSearchParams = new URLSearchParams(new URL(url).search);
      // const pageValue = urlSearchParams.get("page");
      const response = await axios.get(url, {
        params: params,
      });
      this.routePlans = response.data.result;
      this.loading = false;
      return response.data;
    },

    async getDetailAction(id) {
      try {
        const response = await axios.get(`/route-plans/${id}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async addNewAction(data) {
      try {
        const response = await axios.post("/route-plans", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async updateAction(data, id) {
      try {
        const response = await axios.post(`/route-plans/${id}`, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async deleteAction(id) {
      try {
        const response = await axios.delete(`/route-plans/${id}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
