import axios from "axios";
import { defineStore } from "pinia";

export const useRoomStore = defineStore("room", {
    state: () => ({ rooms: null, loading: false, importLoading: false }),
    getters: {},
    actions: {
        async getSimpleListAction(params) {
            try {
                this.loading = true;
                const response = await axios.get("/rooms?limit=1000&page=1", {
                    params: params,
                });
                this.rooms = response.data.result;
                this.loading = false;

                return response.data;
            } catch (error) {
                this.loading = false;
                throw error;
            }
        },
        async getChangePage(url, params) {
            this.loading = true;
            const response = await axios.get(url, {
                params: params,
            });
            this.rooms = response.data.result;
            this.loading = false;
            return response.data;
        },
        async getListAction(params) {
            try {
                this.loading = true;
                const response = await axios.get("/rooms", {
                    params: params,
                });
                this.rooms = response.data.result;
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
                const response = await axios.post("/rooms", data);
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        async updateAction(data, id) {
            try {
                const response = await axios.post("/rooms/" + id, data);
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        async deleteAction(id) {
            try {
                const response = await axios.delete("/rooms/" + id);
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        async deleteImageAction(id, imageID) {
            try {
                const response = await axios.delete(
                    "/rooms/" + id + "/images/" + imageID
                );
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        async downloadExport() {
            try {
                const res = await axios.get("/rooms/export/csv");
                return res.data;
            } catch (err) {
                throw err;
            }
        },

        async importAction(data) {
            try {
                this.importLoading = true;
                const res = await axios.post("/rooms/import/csv", data);
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