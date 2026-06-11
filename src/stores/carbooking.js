import axios from "axios";
import { defineStore } from "pinia";

export const useCarBookingStore = defineStore("carbooking", {
  state: () => ({
    carbookings: null,
    loading: false,
    // ── Ledger ──────────────────────────────────────────────
    ledger: [],
    grandTotal: null,
    supplier: null,
    supplierLists: {}, // { id: name, ... }
    error: null,
  }),

  getters: {},

  actions: {
    // ── existing actions (unchanged) ─────────────────────────────────────
    async getSimpleListAction() {
      try {
        this.loading = true;
        const response = await axios.get("/car-bookings");
        this.carbookings = response.data;
        return response.data;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getChangePage(url, params) {
      this.loading = true;
      const response = await axios.get(url, {
        params: {
          supplier_id: params.supplier_id,
          daterange: `${params.first},${params.second}`,
          agent_id: params.agent_id,
        },
      });
      this.carbookings = response.data;
      this.loading = false;
      return response.data;
    },

    async getListAction(params) {
      try {
        this.loading = true;
        const response = await axios.get(
          `/car-bookings?daterange=${params.first},${params.second}`,
          { params },
        );
        this.carbookings = response.data;
        return response.data;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async addNewAction(data, id) {
      const response = await axios.post(`/car-bookings/${id}`, data);
      return response.data;
    },

    async getDetailAction(id) {
      const response = await axios.get(`/car-bookings/${id}/edit`);
      return response.data;
    },

    async getCarDetailAction(id) {
      const response = await axios.get(`/car-bookings/${id}/detail`);
      return response.data;
    },

    async getCarBookingSummary(params) {
      const response = await axios.get(`/car-bookings/summary`, { params });
      return response.data;
    },

    async sendLineAction(id, data) {
      const response = await axios.post(`/car-bookings/${id}/send-line`, data);
      return response.data;
    },

    async getMonthlyGraph(year, month, params = {}) {
      const response = await axios.get("/car-bookings/monthly-graph", {
        params: { year, month, ...params },
      });
      return response.data;
    },

    async getDateDetail(date, params = {}) {
      const response = await axios.get("/car-bookings/date-detail", {
        params: { date, ...params },
      });
      return response.data;
    },

    // ── Ledger actions ────────────────────────────────────────────────────

    /**
     * Fetch supplier list for the dropdown.
     * Expected response shape: { data: { id: name, ... } }  — adjust if yours differs.
     */
    async fetchSupplierLists() {
      try {
        const response = await axios.get("/suppliers");
        console.log("====================================");
        console.log(response, "this is supplier");
        console.log("====================================");
        this.supplierLists = response.data.result.data;
      } catch (error) {
        console.error("fetchSupplierLists error", error);
      }
    },

    /**
     * Fetch ledger for a date range + supplier.
     * @param {{ date_from: string, date_to: string, supplier_id: string|number }} params
     */
    async fetchLedger(params) {
      this.loading = true;
      this.error = null;
      this.ledger = [];
      this.grandTotal = null;
      this.supplier = null;

      try {
        const response = await axios.get("/car-bookings/ledger", { params }); // ← flat params, correct spelling
        const data = response.data.result;
        console.log(data, "this is data");

        this.ledger = data.ledger ?? [];
        this.grandTotal = data.grand_total ?? null;
        this.supplier = data.supplier ?? null;
      } catch (error) {
        this.error =
          error.response?.data?.message ??
          error.message ??
          "Something went wrong.";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Mark a single day as paid.
     * @param {string} date  "YYYY-MM-DD"
     */
    // async markDayPaid(date) {
    //   const response = await axios.post("/car-bookings/ledger/pay", {
    //     date,
    //     supplier_id: this.supplier?.id,
    //   });

    //   // Optimistically flip the flag in local state so the UI updates instantly
    //   const day = this.ledger.find((d) => d.date === date);
    //   if (day) day.is_paid = true;

    //   return response.data;
    // },
  },
});
