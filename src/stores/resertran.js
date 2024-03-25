import axios from "axios";
import { defineStore } from "pinia";

export const useReservationTransactionStore = defineStore(
    "reservationTransaction", {
        state: () => ({ reservationTransactions: null, loading: false }),
        getters: {},
        actions: {
            async getSimpleListAction(params) {
                try {
                    this.loading = true;
                    const response = await axios.get(
                        `/reservation-transactions?limit=1000&page=1`
                    );
                    this.reservationTransactions = response.data;
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
                this.reservationTransactions = response.data;
                this.loading = false;
                return response.data;
            },
            async getListAction(params) {
                try {
                    this.loading = true;
                    const response = await axios.get("/reservation-transactions", {
                        params: params,
                    });
                    this.reservationTransactions = response.data;
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
                    const response = await axios.post("/reservation-transactions", data);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            async deleteAction(id, reservation_id) {
                try {
                    const response = await axios.delete(
                        "/reservation-transactions/" + id + "/" + reservation_id
                    );
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },
        },
    }
);