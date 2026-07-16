import axios from "axios";
import { defineStore } from "pinia";

export const useVantourV2Store = defineStore("vantourV2", {
  state: () => ({
    vantours: null,
    loading: false,
    importLoading: false,
    searchResults: [],
    searchLoading: false,
  }),
  getters: {},
  actions: {
    async getSimpleListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/vantours?limit=1000&page=1");
        this.vantours = response.data.result;
        this.loading = false;

        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async getChangePage(url, params) {
      this.loading = true;
      // const urlSearchParams = new URLSearchParams(new URL(url).search);
      // const pageValue = urlSearchParams.get("page");
      const response = await axios.get(url, {
        params: params,
      });
      this.vantours = response.data.result;
      console.log(response.data.result, "pagi");
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/vantours", {
          params: params,
        });
        this.vantours = response.data.result;
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
        const response = await axios.post("/vantours", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async getDetailAction(id) {
      try {
        const response = await axios.get("/vantours/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/vantours/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/vantours/" + id);
        console.log(response.data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
