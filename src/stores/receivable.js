import axios from "axios";
import { defineStore } from "pinia";

export const useReceivableStore = defineStore("receivable", {
  state: () => ({ receivables: null, loading: false }),
  getters: {},
  actions: {
    async getSimpleList(params) {
      this.loading = true;
      const response = await axios.get("/account-receivable", {
        params: params,
      });
      // console.log(response);

      this.receivables = response.data.result;
      this.loading = false;
      return response.data;
    },
  },
});
