import { defineStore } from "pinia";
import axios from "axios";

export const useAttractionStore = defineStore("attraction", {
  state: () => ({
    entranceTickets: [],
    destinations: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchProductsByCities(cityIds, search = "", type = "both") {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post(
          "/entrance-tickets-multiple/by-cities",
          {
            city_ids: cityIds,
            search: search,
            type: type,
          },
        );

        console.log(response);

        if (response.data.status == 1) {
          this.entranceTickets = response.data.result.entrance_tickets || [];
          this.destinations = response.data.result.destinations || [];
        }

        console.log(
          this.entranceTickets,
          this.destinations,
          "this is get from api",
        );
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to fetch products";
        console.error("Error fetching products:", error);
      } finally {
        this.loading = false;
      }
    },

    clearProducts() {
      this.entranceTickets = [];
      this.destinations = [];
      this.error = null;
    },
  },

  getters: {
    allProducts: (state) => {
      return [
        ...state.entranceTickets.map((t) => ({
          ...t,
          product_type: "entrance_ticket",
        })),
        ...state.destinations.map((d) => ({
          ...d,
          product_type: "destination",
        })),
      ];
    },

    getProductsByType: (state) => (type) => {
      if (type === "entrance_ticket") return state.entranceTickets;
      if (type === "destination") return state.destinations;
      return [];
    },
  },
});
