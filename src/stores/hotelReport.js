// stores/report.js  (add these to your existing report store, or create new)
import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios"; // or your project's http client

export const useReportStore = defineStore("report", () => {
  // ── State ──────────────────────────────────────────────────────────────
  const priceGroupSummary = ref([]); // array of { group, label, total_amount, total_quantity, hotel_count }
  const loadingPriceGroup = ref(false);
  const loadingPriceGroupDetail = ref(false);

  // ── Actions ────────────────────────────────────────────────────────────

  /**
   * Fetch the 4-group summary for the bar chart
   * GET /hotel-price-group?daterange=YYYY-MM-DD,YYYY-MM-DD
   */
  async function fetchHotelPriceGroupSummary(daterange) {
    loadingPriceGroup.value = true;
    priceGroupSummary.value = [];
    try {
      const { data } = await axios.get("/hotel-price-group", {
        params: { daterange },
      });
      // Backend returns array directly in data.result or data
      priceGroupSummary.value = data?.result ?? data ?? [];
    } catch (e) {
      console.error("fetchHotelPriceGroupSummary error:", e);
      priceGroupSummary.value = [];
    } finally {
      loadingPriceGroup.value = false;
    }
  }

  /**
   * Fetch paginated hotel list for a specific price group
   * GET /hotel-price-group/detail?daterange=...&group=budget&page=1
   * Returns { data: [...], meta: { last_page, total, ... } }
   */
  async function fetchHotelPriceGroupDetail(daterange, group, page = 1) {
    loadingPriceGroupDetail.value = true;
    try {
      const { data } = await axios.get("/hotel-price-group/detail", {
        params: { daterange, group, page },
      });
      return data?.result ?? data ?? { data: [], meta: {} };
    } catch (e) {
      console.error("fetchHotelPriceGroupDetail error:", e);
      return { data: [], meta: {} };
    } finally {
      loadingPriceGroupDetail.value = false;
    }
  }

  return {
    // state
    priceGroupSummary,
    loadingPriceGroup,
    loadingPriceGroupDetail,
    // actions
    fetchHotelPriceGroupSummary,
    fetchHotelPriceGroupDetail,
  };
});
