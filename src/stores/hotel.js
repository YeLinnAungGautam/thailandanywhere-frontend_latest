import axios from "axios";
import { defineStore } from "pinia";

export const useHotelStore = defineStore("hotel", {
  state: () => ({
    hotels: null,
    loading: false,
    importLoading: false,
    loadingIncomplete: false,
    incompleteHotel: null,
    searchResults: [],
    searchLoading: false,
  }),
  getters: {},
  actions: {
    async searchHotels(
      cityIds,
      search = "",
      checkinDate = null,
      checkoutDate = null,
    ) {
      try {
        this.searchLoading = true;

        const payload = {
          city_ids: cityIds,
        };
        if (search) payload.search = search;
        if (checkinDate) payload.checkin_date = checkinDate;
        if (checkoutDate) payload.checkout_date = checkoutDate;

        const response = await axios.post(
          "/hotels-multiple/by-cities",
          payload,
        );

        console.log(response, "this is from api");

        // Response shape: { data: { data: [...hotels], meta: {...} } }
        this.searchResults = response.data?.result?.data ?? [];
        return response.data;
      } catch (error) {
        this.searchResults = [];
        throw error;
      } finally {
        this.searchLoading = false;
      }
    },

    clearSearchResults() {
      this.searchResults = [];
    },
    async getSimpleListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/hotels?limit=1000&page=1");
        this.hotels = response.data.result;
        this.loading = false;
        console.log(response);
        return response.data;
      } catch (error) {
        this.loading = true;
        throw error;
      }
    },
    async getChangePage(url, params) {
      this.loading = true;
      const response = await axios.get(url, {
        params: params,
      });
      this.hotels = response.data.result;
      this.loading = false;
      return response.data;
    },
    async getRoomPrice(params, id) {
      try {
        const response = await axios.get(/rooms/ + id + "/price", {
          params: params,
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async getChangeIncompletePage(url, params) {
      this.loadingIncomplete = true;
      const response = await axios.get(url, {
        params: params,
      });
      this.incompleteHotel = response.data.result;
      this.loadingIncomplete = false;
      return response.data;
    },
    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/hotels", {
          params: params,
        });
        this.hotels = response.data.result;
        this.loading = false;
        console.log(response);
        return response.data;
      } catch (error) {
        this.loading = true;
        throw error;
      }
    },
    async addNewAction(data) {
      try {
        const response = await axios.post("/hotels", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateAction(data, id) {
      try {
        const response = await axios.post("/hotels/" + id, data);
        return response.data;
      } catch (error) {
        this.loading = true;
        throw error;
      }
    },
    async deleteAction(id) {
      try {
        const response = await axios.delete("/hotels/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteHotelContractAction(id, contract_id) {
      try {
        const response = await axios.delete(
          "/hotels/" + id + "/contracts/" + contract_id,
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async deleteImageAction(id, imageID) {
      try {
        const response = await axios.delete(
          "/hotels/" + id + "/images/" + imageID,
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async getDetailAction(id) {
      try {
        const response = await axios.get("/hotels/" + id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async toggleLoading() {
      this.loading = !this.loading;
    },
    async downloadExport() {
      try {
        const res = await axios.get("/hotels/export/csv");
        return res.data;
      } catch (err) {
        throw err;
      }
    },

    async importAction(data) {
      try {
        this.importLoading = true;
        const res = await axios.post("/hotels/import/csv", data);
        if (res.status === 200) {
          this.importLoading = false;
        }
        return res.data;
      } catch (err) {
        this.importLoading = false;
        throw err;
      }
    },
    async incompleteHotelAction(params) {
      try {
        this.loadingIncomplete = true;
        const res = await axios.get("/incomplete-hotels", { params: params });
        console.log(res, "this is incomplete");
        this.incompleteHotel = res.data.result;
        this.loadingIncomplete = false;
      } catch (error) {
        this.loadingIncomplete = false;
      } finally {
        this.importLoading = false;
      }
    },
    async addSlugAction(data, id) {
      try {
        const response = await axios.post("/hotels/" + id + "/slug", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async getMapListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get(
          "https://api-blog.thanywhere.com/api/v2/map/hotels",
          {
            params: params,
          },
        );
        this.loading = false;

        return response.data;
      } catch (error) {
        this.loading = true;
        throw error;
      }
    },
  },
});
