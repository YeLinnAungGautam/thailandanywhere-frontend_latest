import axios from "axios";
import { defineStore } from "pinia";

export const useCashBookStore = defineStore("cashBook", {
  state: () => ({ cashBooks: null, loading: false, errors: {} }),
  getters: {},
  actions: {
    async getSimpleListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/cash-books");
        this.cashBooks = response.data.result;
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
      this.cashBooks = response.data.result;
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/cash-books", {
          params: params,
        });
        this.cashBooks = response.data.result;
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
        const response = await axios.post("/cash-books", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/cash-books/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/cash-books/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async getByIdAction(id) {
      loading.value = true;
      errors.value = {};

      try {
        const response = await axios.get(`/cash-books/${id}`);
        return response.data;
      } catch (error) {
        errors.value = error.response?.data?.errors || {};
        throw error;
      } finally {
        loading.value = false;
      }
    },

    clearErrors() {
      errors.value = {};
    },

    clearData() {
      cashBooks.value = {};
    },
  },
});
