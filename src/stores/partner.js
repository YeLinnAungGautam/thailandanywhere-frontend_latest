import axios from "axios";
import { defineStore } from "pinia";

export const usePartnerStore = defineStore("partner", {
  state: () => ({
    partners: null,
    partner: null,
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    assigning: false,
  }),
  getters: {
    getPartners: (state) => state.partners,
    getPartner: (state) => state.partner,
    isLoading: (state) => state.loading,
    isCreating: (state) => state.creating,
    isUpdating: (state) => state.updating,
    isDeleting: (state) => state.deleting,
    isAssigning: (state) => state.assigning,
  },
  actions: {
    async getSimpleListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/partners?limit=2000&page=1");
        this.partners = response.data.result;
        this.loading = false;
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },

    async getChangePage(url) {
      this.loading = true;
      const response = await axios.get(url);
      this.partners = response.data.result;
      this.loading = false;
      return response.data;
    },

    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get("/partners", {
          params: params,
        });
        this.partners = response.data.result;
        this.loading = false;
        console.log(response);
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },

    async getPartnerAction(id) {
      try {
        this.loading = true;
        const response = await axios.get(`/partners/${id}`);
        this.partner = response.data.result;
        this.loading = false;
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },

    async addNewAction(data) {
      try {
        this.creating = true;
        const response = await axios.post("/partners", data);
        this.creating = false;
        return response.data;
      } catch (error) {
        this.creating = false;
        throw error;
      }
    },

    async updateAction(data, id) {
      try {
        this.updating = true;
        const response = await axios.put(`/partners/${id}`, data);
        this.updating = false;
        return response.data;
      } catch (error) {
        this.updating = false;
        throw error;
      }
    },

    async deleteAction(id) {
      try {
        this.deleting = true;
        const response = await axios.delete(`/partners/${id}`);
        this.deleting = false;
        return response.data;
      } catch (error) {
        this.deleting = false;
        throw error;
      }
    },

    async assignProductAction(partnerId, data) {
      try {
        this.assigning = true;
        const response = await axios.post(
          `/partners/${partnerId}/assign-product`,
          data
        );
        this.assigning = false;
        return response.data;
      } catch (error) {
        this.assigning = false;
        throw error;
      }
    },

    clearPartner() {
      this.partner = null;
    },
  },
});
