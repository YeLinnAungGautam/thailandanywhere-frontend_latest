import axios from "axios";
import { defineStore } from "pinia";

export const useCustomerStore = defineStore("customer", {
    state: () => ({
        customer: null,
        loading: false,
        customers: null,
    }),
    getters: {},
    actions: {
        async getSimpleListAction(params) {
            try {
                if (!params) {
                    params = {}; // Initialize params as an empty object
                }

                this.loading = true;

                let limit = params.limit ? params.limit : 2000;

                let page = params.page ? params.page : 1;
                const response = await axios.get(
                    `/customers?limit=${limit}&page=${page}`,
                    params
                );
                this.customers = response.data.result;

                this.loading = false;

                return response.data;
            } catch (error) {
                this.loading = false;
                throw error;
            }
        },
        async getChangePage(url) {
            this.loading = true;
            const urlSearchParams = new URLSearchParams(new URL(url).search);
            const pageValue = urlSearchParams.get("page");
            const response = await axios.get("/customers?limit=10&page=" + pageValue);
            this.customer = response.data.result;
            console.log(response.data.result, "pagi");
            this.loading = false;
            return response.data;
        },
        async getListAction(params) {
            try {
                this.loading = true;
                const response = await axios.get("/customers", {
                    params: params,
                });
                this.customer = response.data.result;

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
                const response = await axios.post("/customers", data);
                return response.data;
            } catch (error) {
                throw error;
            }
        },

        async getDetailAction(id) {
            try {
                const response = await axios.get("/customers/" + id);
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        async getDetailSalesAction(id) {
            try {
                this.loading = true;
                const response = await axios.get(`/customers/${id}/sales`);
                this.loading = false;
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        async updateAction(data, id) {
            try {
                const response = await axios.post("/customers/" + id, data);
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        async deleteAction(id) {
            try {
                const response = await axios.delete("/customers/" + id);
                console.log(response.data);
                return response.data;
            } catch (error) {
                throw error;
            }
        },
    },
});