import axios from "axios";
import { defineStore } from "pinia";

export const useMealStore = defineStore("meal", {
  state: () => ({ meals: null, loading: false }),
  getters: {},
  actions: {
    async getSimpleListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/meals?limit=1000&page=1");
        this.meals = response.data.result;
        this.loading = false;

        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async getChangePage(url, params) {
      this.loading = true;
      const response = await axios.get(url, {
        params: params,
      });
      this.meals = response.data.result;
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/meals", {
          params: params,
        });
        this.meals = response.data.result;
        this.loading = false;
        console.log(response);
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async addNewAction(data) {
      try {
        const response = await axios.post("/meals", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async getDetailAction(id) {
      try {
        const response = await axios.get("/meals/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/meals/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/meals/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteImageAction(id, imageID) {
      try {
        const response = await axios.delete(
          "/meals/" + id + "/images/" + imageID
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
