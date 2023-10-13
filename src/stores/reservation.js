import axios from "axios";
import { defineStore } from "pinia";

export const useReservationStore = defineStore("reservation", {
  state: () => ({ reservations: null, loading: false }),
  getters: {},
  actions: {
    async getSimpleListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/reservations?limit=1000&page=1");
        this.reservations = response.data.result;
        this.loading = false;

        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async getChangePage(url, userFilter) {
      this.loading = true;
      const urlSearchParams = new URLSearchParams(new URL(url).search);
      const pageValue = urlSearchParams.get("page");
      const response = await axios.get(
        "/reservations?limit=10&page=" + pageValue + "&user_id=" + userFilter
      );
      this.reservations = response.data.result;
      console.log(response.data.result, "pagi");
      this.loading = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get(
          `/reservations?limit=${params.limit}&user_id=${params.user_id}`,
          {
            params,
          }
        );
        this.reservations = response.data.result;

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
        const response = await axios.post("/reservations", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async getDetailAction(id) {
      try {
        const response = await axios.get("/reservations/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/reservations/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateInfoAction(data, id) {
      try {
        const response = await axios.post("/reservations/info/" + id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/reservations/" + id);
        console.log(response.data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteCustomerPassportAction(id) {
      try {
        const response = await axios.delete("/customer-passport/" + id);
        console.log(response.data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteResImage(id) {
      try {
        const response = await axios.delete("/reservation-receipt/" + id);
        console.log(response.data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deletePaidImage(id) {
      try {
        const response = await axios.delete("/confirmation-receipt/" + id);
        console.log(response.data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
