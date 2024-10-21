import axios from "axios";
import { defineStore } from "pinia";

export const useVantourStore = defineStore("vantour", {
  state: () => ({ vantours: null, loading: false, importLoading: false }),
  getters: {},
  actions: {
    async getSimpleListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get(
          "/private-van-tours?limit=1000&page=1"
        );
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
        const response = await axios.get("/private-van-tours", {
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
        const response = await axios.post("/private-van-tours", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async getDetailAction(id) {
      try {
        const response = await axios.get("/private-van-tours/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/private-van-tours/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/private-van-tours/" + id);
        console.log(response.data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteCoverImageAction(id) {
      try {
        const response = await axios.delete(
          "/private-van-tours/" + id + "/delete-cover-image"
        );
        console.log(response.data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async downloadExport() {
      try {
        const res = await axios.get("/private-van-tours/export/csv");
        return res.data;
      } catch (err) {
        throw err;
      }
    },
    async importAction(data) {
      try {
        this.importLoading = true;
        const res = await axios.post("/private-van-tours/import/csv", data);
        if (res.status === 200) {
          this.importLoading = false;
        }
        return res.data;
      } catch (err) {
        this.importLoading = false;
        throw err;
      }
    },
  },
});
