import axios from "axios";
import { defineStore } from "pinia";

export const useDiscountStore = defineStore("discount", {
  state: () => ({
    loading: false,
  }),
  getters: {},
  actions: {
    async getDiscountHotel() {
      try {
        this.loading = true;
        const response = await axios.get("/settings/hotels/discount");
        this.loading = false;

        // Handle the response structure with status and result
        return response.data.status === 1 ? response.data.result : null;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },

    async storeDiscountHotel(data) {
      try {
        this.loading = true;
        const response = await axios.post("/settings/hotels/discount", data);
        this.loading = false;

        return response.data.status === 1 ? response.data.result : null;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },

    async updateDiscountHotel(id, data) {
      try {
        this.loading = true;
        // Use _method: 'PUT' for Laravel method spoofing
        const formData = {
          ...data,
          _method: "PUT",
        };

        const response = await axios.post(
          `/settings/hotels/discount/${id}`,
          formData
        );
        this.loading = false;

        return response.data.status === 1 ? response.data.result : null;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },

    async deleteDiscountHotel(id) {
      try {
        this.loading = true;
        const response = await axios.delete(`/settings/hotels/discount/${id}`);
        this.loading = false;

        return response.data.status === 1 ? response.data.result : null;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },

    async getDiscountEntrance() {
      try {
        this.loading = true;
        const response = await axios.get("/settings/entrance-tickets/discount");
        this.loading = false;

        return response.data.status === 1 ? response.data.result : null;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },

    async storeDiscountEntrance(data) {
      try {
        this.loading = true;
        const response = await axios.post(
          "/settings/entrance-tickets/discount",
          data
        );
        this.loading = false;

        return response.data.status === 1 ? response.data.result : null;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },

    async updateDiscountEntrance(id, data) {
      try {
        this.loading = true;
        // Use _method: 'PUT' for Laravel method spoofing
        const formData = {
          ...data,
          _method: "PUT",
        };

        const response = await axios.post(
          `/settings/entrance-tickets/discount/${id}`,
          formData
        );
        this.loading = false;

        return response.data.status === 1 ? response.data.result : null;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },

    async deleteDiscountEntrance(id) {
      try {
        this.loading = true;
        const response = await axios.delete(
          `/settings/entrance-tickets/discount/${id}`
        );
        this.loading = false;

        return response.data.status === 1 ? response.data.result : null;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },

    async getDiscountVantour() {
      try {
        this.loading = true;
        const response = await axios.get(
          "/settings/private-van-tours/discount"
        );
        this.loading = false;

        return response.data.status === 1 ? response.data.result : null;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },

    async storeDiscountVantour(data) {
      try {
        this.loading = true;
        const response = await axios.post(
          "/settings/private-van-tours/discount",
          data
        );
        this.loading = false;

        return response.data.status === 1 ? response.data.result : null;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },

    async updateDiscountVantour(id, data) {
      try {
        this.loading = true;
        // Use _method: 'PUT' for Laravel method spoofing
        const formData = {
          ...data,
          _method: "PUT",
        };

        const response = await axios.post(
          `/settings/private-van-tours/discount/${id}`,
          formData
        );
        this.loading = false;

        return response.data.status === 1 ? response.data.result : null;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },

    async deleteDiscountVantour(id) {
      try {
        this.loading = true;
        const response = await axios.delete(
          `/settings/private-van-tours/discount/${id}`
        );
        this.loading = false;

        return response.data.status === 1 ? response.data.result : null;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
  },
});
