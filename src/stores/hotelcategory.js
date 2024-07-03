import axios from "axios";
import { defineStore } from "pinia";

export const useHotelCategoryStore = defineStore("category", {
    state: () => ({ data: null, loading: false, hcategories: null }),
    getters: {},
    actions: {
        async getSimpleListAction(params) {
            try {
                this.loading = true;
                const response = await axios.get("/hotel-categories?limit=1000&page=1");
                this.hcategories = response.data.result;
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
            this.hcategories = response.data.result;
            this.loading = false;
            return response.data;
        },
        async getListAction(params) {
            try {
                this.loading = true;
                const response = await axios.get("/hotel-categories", {
                    params: params,
                });
                this.hcategories = response.data.result;
                this.loading = false;
                return response.data;
            } catch (error) {
                this.loading = false;
                throw error;
            }
        },
        async addNewAction(data) {
            try {
                const response = await axios.post("/hotel-categories", data);
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        async updateAction(data, id) {
            try {
                const response = await axios.post("/hotel-categories/" + id, data);
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        async deleteAction(id) {
            try {
                const response = await axios.delete("/hotel-categories/" + id);
                return response.data;
            } catch (error) {
                throw error;
            }
        },
    },
});