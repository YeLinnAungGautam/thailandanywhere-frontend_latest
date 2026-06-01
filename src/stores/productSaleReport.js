import axios from "axios";
import { defineStore } from "pinia";

export const useProductSalesReportStore = defineStore("productSalesReport", {
  state: () => ({
    loadingGraph: false,
    loadingDetail: false,
    loadingProducts: false,
    seriesData: [],
    reservations: [],
    detailMeta: { last_page: 1, total: 0 },
    availableProducts: [],
    productMeta: { last_page: 1, total: 0 },
  }),

  actions: {
    async fetchAvailableProducts(productType, params = {}) {
      this.loadingProducts = true;
      const endpointMap = {
        "App\\Models\\Hotel": "/hotels",
        "App\\Models\\EntranceTicket": "/entrance-tickets",
        "App\\Models\\PrivateVanTour": "/private-van-tours",
      };
      try {
        const url = endpointMap[productType];
        if (!url) {
          this.availableProducts = [];
          return;
        }
        const response = await axios.get(url, {
          params: { limit: 10, page: 1, ...params },
        });
        this.availableProducts = (response.data?.result?.data ?? []).map(
          (p) => ({
            id: p.id,
            name: p.name,
          }),
        );
        this.productMeta = response.data?.result?.meta ?? {
          last_page: 1,
          total: 0,
        };
        return response.data;
      } catch (error) {
        this.availableProducts = [];
        throw error;
      } finally {
        this.loadingProducts = false;
      }
    },

    async searchAvailableProducts(productType, search = "", page = 1) {
      this.loadingProducts = true;
      const endpointMap = {
        "App\\Models\\Hotel": "/hotels",
        "App\\Models\\EntranceTicket": "/entrance-tickets",
        "App\\Models\\PrivateVanTour": "/private-van-tours",
      };
      try {
        const url = endpointMap[productType];
        if (!url) {
          this.availableProducts = [];
          return;
        }
        const response = await axios.get(url, {
          params: { limit: 10, page, ...(search ? { search } : {}) },
        });
        this.availableProducts = (response.data?.result?.data ?? []).map(
          (p) => ({
            id: p.id,
            name: p.name,
          }),
        );
        this.productMeta = response.data?.result?.meta ?? {
          last_page: 1,
          total: 0,
        };
        return response.data;
      } catch (error) {
        this.availableProducts = [];
        throw error;
      } finally {
        this.loadingProducts = false;
      }
    },

    async fetchProductSalesGraph(
      daterange,
      period,
      productType,
      productIds = [],
    ) {
      this.loadingGraph = true;
      try {
        const params = { daterange, period, product_type: productType };
        if (productIds.length) params.product_ids = productIds.join(",");
        const response = await axios.get("/reports/product-sales-graph", {
          params,
        });
        this.seriesData = response.data?.result ?? [];
        return response.data;
      } catch (error) {
        this.seriesData = [];
        throw error;
      } finally {
        this.loadingGraph = false;
      }
    },

    async fetchProductSalesDetail(
      productId,
      productType,
      period,
      periodType,
      page = 1,
    ) {
      this.loadingDetail = true;
      try {
        const response = await axios.get("/reports/product-sales-detail", {
          params: {
            product_id: productId,
            product_type: productType,
            period,
            period_type: periodType,
            page,
          },
        });
        this.reservations = response.data?.result?.data ?? [];
        this.detailMeta = response.data?.result?.meta ?? {
          last_page: 1,
          total: 0,
        };
        return response.data;
      } catch (error) {
        this.reservations = [];
        throw error;
      } finally {
        this.loadingDetail = false;
      }
    },

    clearDetail() {
      this.reservations = [];
      this.detailMeta = { last_page: 1, total: 0 };
    },
  },
});
