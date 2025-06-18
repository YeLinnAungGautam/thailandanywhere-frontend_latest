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
    async detailAction(id) {
      try {
        const response = await axios.get("/booking-item-groups/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async groupDocumentList(id, params) {
      try {
        const response = await axios.get(
          "/booking-item-groups/" + id + "/documents",
          {
            params: params,
          }
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async groupUpdateAction(id, data) {
      try {
        const response = await axios.post(`booking-item-groups/${id}`, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async groupDocumentCreateAction(data, id) {
      try {
        const response = await axios.post(
          "/booking-item-groups/" + id + "/documents",
          data
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async groupDocumentUpdateAction(data, id, documentId) {
      try {
        const response = await axios.post(
          "/booking-item-groups/" + id + "/documents/" + documentId,
          data
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async groupDocumentDeleteAction(id, documentId) {
      try {
        const response = await axios.delete(
          "/booking-item-groups/" + id + "/documents/" + documentId
        );
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
