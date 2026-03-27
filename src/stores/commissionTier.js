import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useCommissionTierStore = defineStore("commissionTier", () => {
  const tiers = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // Badge classes assigned by index on the frontend (no DB needed)
  const badgeClasses = [
    "bg-blue-100 text-blue-600",
    "bg-cyan-100 text-cyan-700",
    "bg-teal-100 text-teal-700",
    "bg-green-100 text-green-700",
    "bg-lime-100 text-lime-700",
    "bg-yellow-100 text-yellow-700",
    "bg-amber-100 text-amber-700",
    "bg-orange-100 text-orange-600",
    "bg-red-100 text-red-600",
    "bg-rose-100 text-rose-600",
    "bg-pink-100 text-pink-600",
    "bg-fuchsia-100 text-fuchsia-600",
    "bg-purple-100 text-purple-600",
    "bg-violet-100 text-violet-600",
    "bg-indigo-100 text-indigo-600",
    "bg-sky-100 text-sky-600",
    "bg-blue-100 text-blue-700",
  ];

  const mapTier = (tier, index) => ({
    id: tier.id,
    label: tier.label,
    minSalary: tier.min_salary,
    avgDaily: tier.avg_daily,
    rate: tier.rate,
    sortOrder: tier.sort_order,
    isActive: tier.is_active,
    badgeClass: badgeClasses[index] ?? "bg-gray-100 text-gray-600",
  });

  // ── READ ──────────────────────────────────────────────
  const fetchTiers = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const { data } = await axios.get("/commission-tiers");
      tiers.value = data.data.map(mapTier);
    } catch (err) {
      error.value = err?.response?.data?.message ?? "Failed to fetch tiers.";
    } finally {
      isLoading.value = false;
    }
  };

  // ── CREATE ────────────────────────────────────────────
  const createTier = async (payload) => {
    isLoading.value = true;
    error.value = null;
    try {
      await axios.post("/commission-tiers", payload);
      await fetchTiers();
    } catch (err) {
      error.value = err?.response?.data?.message ?? "Failed to create tier.";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // ── UPDATE ────────────────────────────────────────────
  const updateTier = async (id, payload) => {
    isLoading.value = true;
    error.value = null;
    try {
      await axios.put(`/commission-tiers/${id}`, payload);
      await fetchTiers();
    } catch (err) {
      error.value = err?.response?.data?.message ?? "Failed to update tier.";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // ── DELETE ────────────────────────────────────────────
  const deleteTier = async (id) => {
    isLoading.value = true;
    error.value = null;
    try {
      await axios.delete(`/commission-tiers/${id}`);
      tiers.value = tiers.value.filter((t) => t.id !== id);
    } catch (err) {
      error.value = err?.response?.data?.message ?? "Failed to delete tier.";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    tiers,
    isLoading,
    error,
    fetchTiers,
    createTier,
    updateTier,
    deleteTier,
  };
});
