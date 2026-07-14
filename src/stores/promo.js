import axios from "axios";
import { defineStore } from "pinia";

export const usePromoStore = defineStore("promo", {
  state: () => ({
    promos: [],
    meta: {
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 20,
    },
    search: "",
    loading: false,
    saving: false,
    deleting: false,
    error: null,
  }),

  getters: {
    totalCount: (state) => state.meta.total ?? state.promos.length,

    activeCount: (state) => state.promos.filter((p) => p.is_valid).length,

    expiredCount: (state) => state.promos.filter((p) => p.is_expired).length,

    upcomingCount: (state) => state.promos.filter((p) => p.is_upcoming).length,

    inactiveCount: (state) =>
      state.promos.filter((p) => !p.promo_active).length,
  },

  actions: {
    async fetchPromos(page = 1) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get("/promos", {
          params: {
            page,
            search: this.search || undefined,
          },
        });

        const data = response.data.result;

        // supports both a paginator payload ({data, meta}) and a flat
        // Laravel paginator response ({data, current_page, last_page, total})
        if (data.meta) {
          this.promos = data?.data ?? [];
          this.meta = {
            current_page: data.meta.current_page,
            last_page: data.meta.last_page,
            total: data.meta.total,
            per_page: data.meta.per_page,
          };
        } else if (data.current_page) {
          this.promos = data.result?.data ?? [];
          this.meta = {
            current_page: data.current_page,
            last_page: data.last_page,
            total: data.total,
            per_page: data.per_page,
          };
        } else {
          // plain array response, no pagination
          this.promos = data.result?.data ?? data;
        }

        return data;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to load coupons.";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createPromo(payload) {
      this.saving = true;
      this.error = null;
      try {
        const response = await axios.post("/promos", payload);
        await this.fetchPromos(this.meta.current_page);
        return { success: true, data: response.data };
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to create coupon.";
        return {
          success: false,
          errors: error.response?.data?.errors || {},
          message: this.error,
        };
      } finally {
        this.saving = false;
      }
    },

    async updatePromo(promoId, payload) {
      this.saving = true;
      this.error = null;
      try {
        const response = await axios.put("/promos/" + promoId, payload);
        await this.fetchPromos(this.meta.current_page);
        return { success: true, data: response.data };
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to update coupon.";
        return {
          success: false,
          errors: error.response?.data?.errors || {},
          message: this.error,
        };
      } finally {
        this.saving = false;
      }
    },

    async deletePromo(promoId) {
      this.deleting = true;
      this.error = null;
      try {
        const response = await axios.delete("/promos/" + promoId);
        this.promos = this.promos.filter((p) => p.promo_id !== promoId);
        this.meta.total = Math.max(0, (this.meta.total || 1) - 1);
        return { success: true, data: response.data };
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to delete coupon.";
        return { success: false, message: this.error };
      } finally {
        this.deleting = false;
      }
    },

    setSearch(value) {
      this.search = value;
    },

    async toggleLoading() {
      this.loading = !this.loading;
    },
  },
});
