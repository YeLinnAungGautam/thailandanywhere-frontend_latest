// stores/inclusivePackage.js
import { defineStore } from "pinia";
import axios from "axios";

export const useInclusivePackageStore = defineStore("inclusivePackage", {
  state: () => ({
    packages: [],
    meta: null,
    listLoading: false,
    saveLoading: false,
    deleteLoading: false,
    detailLoading: false,
    error: null,
    filters: {
      search: "",
      status: "",
      start_date: "",
      end_date: "",
      per_page: 15,
      page: 1,
    },
  }),

  actions: {
    // ── LIST ──
    async fetchPackages(filters = {}) {
      this.listLoading = true;
      this.error = null;
      try {
        const params = { ...this.filters, ...filters };
        const res = await axios.get("/inclusive-packages", { params });
        this.packages = res.data.data;
        this.meta = res.data.meta;
      } catch (err) {
        this.error = err.response?.data?.message ?? "Failed to load packages";
      } finally {
        this.listLoading = false;
      }
    },

    // ── DETAIL ──
    async fetchPackageDetail(id) {
      this.detailLoading = true;
      try {
        const res = await axios.get(`/inclusive-packages/${id}`);
        return res.data.data ?? res.data;
      } catch (err) {
        this.error = err.response?.data?.message ?? "Failed to load detail";
        return null;
      } finally {
        this.detailLoading = false;
      }
    },

    // ── CREATE ──
    async createPackage(payload) {
      this.saveLoading = true;
      this.error = null;
      try {
        const res = await axios.post("/inclusive-packages", payload);
        await this.fetchPackages();
        return { success: true, data: res.data };
      } catch (err) {
        this.error = err.response?.data?.message ?? "Failed to create";
        return { success: false, error: this.error };
      } finally {
        this.saveLoading = false;
      }
    },

    // ── UPDATE ──
    async updatePackage(id, payload) {
      this.saveLoading = true;
      this.error = null;
      try {
        const res = await axios.put(`/inclusive-packages/${id}`, payload);
        // Update local list
        const idx = this.packages.findIndex((p) => p.id === id);
        if (idx !== -1) this.packages[idx] = res.data.data ?? res.data;
        return { success: true, data: res.data };
      } catch (err) {
        this.error = err.response?.data?.message ?? "Failed to update";
        return { success: false, error: this.error };
      } finally {
        this.saveLoading = false;
      }
    },

    // ── DELETE ──
    async deletePackage(id) {
      this.deleteLoading = true;
      this.error = null;
      try {
        await axios.delete(`/inclusive-packages/${id}`);
        this.packages = this.packages.filter((p) => p.id !== id);
        if (this.meta) this.meta.total -= 1;
        return { success: true };
      } catch (err) {
        this.error = err.response?.data?.message ?? "Failed to delete";
        return { success: false, error: this.error };
      } finally {
        this.deleteLoading = false;
      }
    },

    // ── HELPERS ──
    setFilter(key, value) {
      this.filters[key] = value;
      this.filters.page = 1;
    },

    resetFilters() {
      this.filters = {
        search: "",
        status: "",
        start_date: "",
        end_date: "",
        per_page: 15,
        page: 1,
      };
    },

    // Build payload from packageData + dayCityMap
    buildPayload(packageData, dayCityMap, packageName = "Tour Package") {
      const totalCost = [
        ...packageData.attractions,
        ...packageData.hotels,
        ...packageData.vanTours,
      ].reduce((sum, i) => sum + (Number(i.costPrice) || 0), 0);

      const totalSelling = [
        ...packageData.attractions,
        ...packageData.hotels,
        ...packageData.vanTours,
      ].reduce((sum, i) => sum + (Number(i.sellingPrice) || 0), 0);

      return {
        package_name: packageName,
        adults: packageData.adults,
        children: packageData.children,
        start_date: packageData.startDate,
        nights: packageData.nights,
        day_city_map: dayCityMap,
        attractions: packageData.attractions,
        hotels: packageData.hotels,
        van_tours: packageData.vanTours,
        ordered_items: packageData.orderedItems,
        descriptions: packageData.descriptions,
        total_cost_price: totalCost,
        total_selling_price: totalSelling,
      };
    },
  },
});
