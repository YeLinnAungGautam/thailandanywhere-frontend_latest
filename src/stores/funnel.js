import axios from "axios";
import { defineStore } from "pinia";

export const useFunnelStore = defineStore("funnel", {
  state: () => ({
    loading: false,
    funnel: null,
    timeSeriesData: null,
    timeSeriesLoading: false,
  }),
  getters: {},
  actions: {
    async getFunnelReport(params) {
      try {
        this.loading = true;
        const response = await axios.get("/funnel-events", {
          params: params,
        });
        this.funnel = response.data.result;
        this.loading = false;
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },

    async getTimeSeries(params) {
      try {
        this.timeSeriesLoading = true;
        const response = await axios.get("/funnel-events/time-series", {
          params: params,
        });
        this.timeSeriesData = response.data.result;
        this.timeSeriesLoading = false;
        return response.data;
      } catch (error) {
        this.timeSeriesLoading = false;
        throw error;
      }
    },

    async getFunnelReportWithProductType(productType, params) {
      try {
        this.loading = true;
        const response = await axios.get(
          `/funnel-events/product-type/${productType}`,
          {
            params: params,
          },
        );
        this.funnel = response.data.result;
        this.loading = false;
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
  },
});
