import axios from "axios";
import { defineStore } from "pinia";

export const useFunnelStore = defineStore("funnel", {
  state: () => ({
    loading: false,
    funnel: null,
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
    async getFunnelReportWithProductType(params) {
      try {
        this.loading = true;
        const response = await axios.get(
          "/funnel-events/product-type/" + params,
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
