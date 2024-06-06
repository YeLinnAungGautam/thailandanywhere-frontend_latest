import axios from "axios";
import { defineStore } from "pinia";

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({ dashboard: null, monthlyData: null, loading: false }),
  getters: {},
  actions: {
    async getAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/get-each-user-report");
        this.dashboard = response.data.result;
        this.loading = false;
        console.log(response.data);
        return response;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    // async getSaleByAgent(params) {
    //   try {
    //     this.loading = true;
    //     const response = await axios.get("/sales-by-agent");
    //     this.dashboard = response.data.result;
    //     this.loading = false;
    //     console.log(response.data);
    //     return response;
    //   } catch (error) {
    //     this.loading = false;
    //     throw error;
    //   }
    // },
    async getMonthData(params) {
      try {
        this.loading = true;
        const response = await axios.get("/reports", {
          params: params,
        });
        this.monthlyData = response.data.result.sales_count.original.result;
        this.loading = false;
        // console.log(response.data);
        return response;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
  },
});
