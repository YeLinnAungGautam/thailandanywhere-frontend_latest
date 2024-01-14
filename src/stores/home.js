import axios from "axios";
import { defineStore } from "pinia";

export const useHomeStore = defineStore("home", {
  state: () => ({
    sales: null,
    salesAmount: null,
    salesCount: null,
    totalSales: null,
    totalSalesPrice: null,
    bookings: null,
    bookingsCount: null,
    totalBookings: null,
    reservationsHome: null,
    reservationAmount: null,
    reservationCount: null,
    totalReservationCount: null,
    totalReservationPrice: null,
    loading: false,
  }),
  getters: {},
  actions: {
    async getSaleAgent(params) {
      try {
        this.loading = true;
        const response = await axios.get("/sales-report");
        console.log(response, "this isres");
        this.sales = response.data.result;
        this.salesAmount = response.data.result.amount;
        this.totalSales = 0;
        for (let x = 0; x < this.salesAmount.length; x++) {
          this.totalSales += this.salesAmount[x];
        }

        this.loading = false;
        // console.log(response);
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async getSaleCount(params) {
      try {
        this.loading = true;
        const response = await axios.get("/sales-count");
        console.log(response, "this isres count");
        // this.sales = response.data.result;
        this.salesCount = response.data.result.amount;
        this.totalSalesPrice = 0;
        for (let x = 0; x < this.salesCount.length; x++) {
          this.totalSalesPrice += this.salesCount[x];
        }

        this.loading = false;
        // console.log(response);
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async getBookingCount(params) {
      try {
        this.loading = true;
        const response = await axios.get("/bookings-count");
        this.loading = false;
        console.log(response, "this is booking");
        this.bookings = response.data.result;
        this.bookingsCount = response.data.result.bookings;
        this.totalBookings = 0;
        for (let x = 0; x < this.bookingsCount.length; x++) {
          this.totalBookings += this.bookingsCount[x];
        }
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async getReservationCount(params) {
      try {
        this.loading = true;
        const response = await axios.get("/reservations-count");
        console.log(response, "this is reservation");
        this.reservationsHome = response.data.result;
        this.reservationAmount = response.data.result.amount;
        this.reservationCount = response.data.result.prices;
        this.totalReservationCount = 0;
        for (let x = 0; x < response.data.result.amount.length; x++) {
          this.totalReservationCount += this.reservationAmount[x];
        }
        this.totalReservationPrice = 0;
        for (let x = 0; x < response.data.result.prices.length; x++) {
          this.totalReservationPrice += this.reservationCount[x];
        }
        this.loading = false;
        return response.data;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async getTimeFilter(params) {
      try {
        this.loading = true;
        const response = await axios.get(`/get-reports/${params.startDate}`);
        console.log(response, "one day filter");

        // bookings
        this.bookings = response.data.result.bookings.original.result;
        this.bookingsCount =
          response.data.result.bookings.original.result.bookings;
        this.totalBookings = 0;
        if (this.bookingsCount != null) {
          for (let x = 0; x < this.bookingsCount.length; x++) {
            this.totalBookings += this.bookingsCount[x];
          }
        }
        // reservation
        this.reservationsHome =
          response.data.result.reservations.original.result;
        this.reservationAmount =
          response.data.result.reservations.original.result.amount;
        this.reservationCount =
          response.data.result.reservations.original.result.prices;
        this.totalReservationCount = 0;
        if (this.reservationAmount != null) {
          for (let x = 0; x < this.reservationAmount.length; x++) {
            this.totalReservationCount += this.reservationAmount[x];
          }
        }
        this.totalReservationPrice = 0;
        if (this.reservationCount != null) {
          for (let x = 0; x < this.reservationCount.length; x++) {
            this.totalReservationPrice += this.reservationCount[x];
          }
        }
        // sale Count
        this.sales = response.data.result.sales.original.result;
        this.totalSales = 0;
        this.salesAmount = response.data.result.sales.original.result.amount;
        if (this.salesAmount != null) {
          for (let x = 0; x < this.salesAmount.length; x++) {
            this.totalSales += this.salesAmount[x];
          }
        }
        // sale price
        this.salesCount =
          response.data.result.sales_count.original.result.amount;
        this.totalSalesPrice = 0;
        if (this.salesCount != null) {
          for (let x = 0; x < this.salesCount.length; x++) {
            this.totalSalesPrice += this.salesCount[x];
          }
        }

        this.loading = false;
        return response.data;
      } catch (error) {
        this.loading = true;
        // console.log(error, "this is error");
        return error;
      }
    },
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
  },
});
