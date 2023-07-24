import axios from "axios";
import { defineStore } from "pinia";

export const useSubProductStore = defineStore("subproduct", {
  state: () => ({ loading: false, subData: null }),
  getters: {},
  actions: {
    // product sub category
    async getSimpleListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/product-sub-categories");
        this.subData = response.data.result;
        this.loading = false;

        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async getChangePage(url) {
      this.loading = true;
      const response = await axios.get(url);
      this.subData = response.data.result;
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/product-sub-categories", {
          params: params,
        });
        this.subData = response.data.result;
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
        const response = await axios.post("/product-sub-categories", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post(
          "/product-sub-categories/" + id,
          data
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/product-sub-categories/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
