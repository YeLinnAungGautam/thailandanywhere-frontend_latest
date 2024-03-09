import axios from "axios";
import { defineStore } from "pinia";

export const useHomeStore = defineStore("home", {
    state: () => ({
        loading: false,
    }),
    getters: {},
    actions: {
        async getTimeFilterArray(params) {
            try {
                const response = await axios.get(`/general-reports/${params}`);
                // console.log(response, "one day filter");

                // bookings
                return response.data;
            } catch (error) {
                // console.log(error, "this is error");
                return error;
            }
        },
        async getTimeFilterAdminArray(params) {
            try {
                const response = await axios.get(
                    `/general-reports/${params.date}?created_by=${params.created_by}`
                );
                // console.log(response, "one day filter");

                // bookings
                return response.data;
            } catch (error) {
                // console.log(error, "this is error");
                return error;
            }
        },
        async getHotelMostSell(params) {
            try {
                const response = await axios.get(`/reports/hotels`, { params });
                // console.log(response, "one day filter");

                // bookings
                return response.data;
            } catch (error) {
                // console.log(error, "this is error");
                return error;
            }
        },
        async getReportByChannel(params) {
            try {
                const response = await axios.get(
                    `/report-by-channel?daterange=${params.first},${params.second}`
                );
                return response.data;
            } catch (error) {
                // console.log(error, "this is error");
                return error;
            }
        },
        async getReportByMethod(params) {
            try {
                const response = await axios.get(
                    `/report-by-payment-method?daterange=${params.first},${params.second}`
                );
                return response.data;
            } catch (error) {
                // console.log(error, "this is error");
                return error;
            }
        },
        async getReportByStatus(params) {
            try {
                const response = await axios.get(
                    `/report-by-payment-status?daterange=${params.first},${params.second}`
                );
                return response.data;
            } catch (error) {
                // console.log(error, "this is error");
                return error;
            }
        },
        async getReportByPaymentMethod(params) {
            try {
                const response = await axios.get(
                    `/report-by-payment-and-product?daterange=${params.first},${params.second}`
                );
                return response.data;
            } catch (error) {
                // console.log(error, "this is error");
                return error;
            }
        },
        async getAgentSales(params) {
            try {
                const response = await axios.get(
                    `/sales-by-agent?daterange=${params.first},${params.second}`
                );
                return response.data;
            } catch (error) {
                // console.log(error, "this is error");
                return error;
            }
        },
    },
});