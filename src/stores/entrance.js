import axios from "axios";
import { defineStore } from "pinia";

export const useEntranceStore = defineStore("entrance", {
    state: () => ({ entrances: null, loading: false, importLoading: false }),
    getters: {},
    actions: {
        async getSimpleListAction(params) {
            try {
                this.loading = true;
                const response = await axios.get("/entrance-tickets?limit=1000&page=1");
                this.entrances = response.data.result;
                this.loading = false;

                return response.data;
            } catch (error) {
                this.loading = false;
                throw error;
            }
        },
        async getChangePage(url, params) {
            this.loading = true;
            const urlSearchParams = new URLSearchParams(new URL(url).search);
            const pageValue = urlSearchParams.get("page");
            const response = await axios.get(
                "/entrance-tickets?limit=10&page=" + pageValue, {
                    params: params,
                }
            );
            this.entrances = response.data.result;
            this.loading = false;
            return response.data;
        },
        async getListAction(params) {
            try {
                this.loading = true;
                const response = await axios.get("/entrance-tickets", {
                    params: params,
                });
                this.entrances = response.data.result;
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
                const response = await axios.post("/entrance-tickets", data);
                return response.data;
            } catch (error) {
                throw error;
            }
        },

        async getDetailAction(id) {
            try {
                const response = await axios.get("/entrance-tickets/" + id);
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        async updateAction(data, id) {
            try {
                const response = await axios.post("/entrance-tickets/" + id, data);
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        async deleteAction(id) {
            try {
                const response = await axios.delete("/entrance-tickets/" + id);
                console.log(response.data);
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        async deleteContractAction(id, contract_id) {
            try {
                const response = await axios.delete(
                    "/entrance-tickets/" + id + "/contracts/" + contract_id
                );
                console.log(response.data);
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        async downloadExport() {
            try {
                const res = await axios.get("/entrance-tickets/export/csv");
                return res.data;
            } catch (err) {
                throw err;
            }
        },
        async importAction(data) {
            try {
                this.importLoading = true;
                const res = await axios.post("/entrance-tickets/import/csv", data);
                if (res.status === 200) {
                    this.importLoading = false;
                }
                return res.data;
            } catch (err) {
                this.importLoading = false;
                throw err;
            }
        },
    },
});