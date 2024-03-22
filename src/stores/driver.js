import axios from "axios";
import { defineStore } from "pinia";

export const useDriverStore = defineStore("driver", {
    state: () => ({
        drivers: null,
        loading: false,
        car_numbers: null,
        loading_car: false,
    }),
    getters: {},
    actions: {
        async getSimpleListAction(params) {
            try {
                this.loading = true;
                const response = await axios.get("/drivers?limit=2000&page=1", {
                    params: params,
                });
                this.drivers = response.data.result;
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
            this.drivers = response.data.result;
            this.loading = false;
            return response.data;
        },
        async getListAction(params) {
            try {
                this.loading = true;
                const response = await axios.get("/drivers", {
                    params: params,
                });
                this.drivers = response.data.result;
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
                const response = await axios.post("/drivers", data);
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        async updateAction(data, id) {
            try {
                const response = await axios.post("/drivers/" + id, data);
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        async deleteAction(id) {
            try {
                const response = await axios.delete("/drivers/" + id);
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        async getDetailAction(id) {
            try {
                const response = await axios.get("/drivers/" + id);
                return response.data;
            } catch (error) {
                throw error;
            }
        },

        // for driver info

        async getListCarAction(params) {
            console.log(params.id);
            try {
                this.loading_car = true;
                const response = await axios.get(`/drivers/${params.id}/infos`, {
                    params: params,
                });
                this.car_numbers = response.data;
                this.loading_car = false;
                console.log(response);
                return response.data;
            } catch (error) {
                this.loading = false;
                throw error;
            }
        },
        async addNewCarAction(data, id) {
            try {
                const response = await axios.post(`/drivers/${id}/infos`, data);
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        async updateCarAction(data, driver_id, id) {
            try {
                const response = await axios.post(
                    `/drivers/${driver_id}/infos/${id}`,
                    data
                );
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        async deleteCarAction(driver_id, id) {
            try {
                const response = await axios.delete(
                    `/drivers/${driver_id}/infos/${id}`
                );
                return response.data;
            } catch (error) {
                throw error;
            }
        },
    },
});