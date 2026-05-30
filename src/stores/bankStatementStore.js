import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useBankStatementStore = defineStore("bankStatement", () => {
  // ─── State ───────────────────────────────────────────────
  const records = ref(null); // Laravel paginator: { data:[...], total, ... }
  const summary = ref(null); // { total, match, duplicate, unmatch, total_withdrawal, total_deposit }
  const loading = ref(false);
  const importing = ref(false);
  const error = ref(null);

  // ─── GET /bank-statements?month=&year=&limit= ────────────
  async function getRecords(params = {}) {
    loading.value = true;
    error.value = null;
    try {
      const res = await axios.get("/bank-statements", { params });
      records.value = res.data.result;
    } catch (err) {
      error.value = err?.response?.data?.message ?? err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /** Follow a Laravel paginator next/prev URL */
  async function getRecordsPage(url, params = {}) {
    loading.value = true;
    error.value = null;
    try {
      const res = await axios.get(url, { params });
      records.value = res.data.result;
    } catch (err) {
      error.value = err?.response?.data?.message ?? err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // ─── GET /bank-statements/summary?month=&year= ───────────
  async function getSummary(params = {}) {
    error.value = null;
    try {
      const res = await axios.get("/bank-statements/summary", { params });
      summary.value = res.data.result;
    } catch (err) {
      error.value = err?.response?.data?.message ?? err.message;
      throw err;
    }
  }

  // ─── POST /bank-statements/import ────────────────────────
  /**
   * Returns { imported, match, duplicate, unmatch, month, year, account_number }
   * The store automatically refreshes records + summary after a successful import.
   */
  async function importCsv(file, month, year) {
    importing.value = true;
    error.value = null;
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("month", month);
      formData.append("year", year);

      const res = await axios.post("/bank-statements/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Auto-refresh so callers don't need to manually reload
      await Promise.all([
        getRecords({ month, year, limit: 20 }),
        getSummary({ month, year }),
      ]);

      return res.data.result; // { imported, match, duplicate, unmatch, month, year, account_number }
    } catch (err) {
      error.value = err?.response?.data?.message ?? err.message;
      throw err;
    } finally {
      importing.value = false;
    }
  }

  // ─── GET /bank-statements/{id}/duplicates ────────────────
  /**
   * Returns { statement_record, candidates: [...CashImage] }
   */
  async function getDuplicateCandidates(statementRecordId) {
    error.value = null;
    try {
      const res = await axios.get(
        `/bank-statements/${statementRecordId}/duplicates`,
      );
      return res.data.result;
    } catch (err) {
      error.value = err?.response?.data?.message ?? err.message;
      throw err;
    }
  }

  // ─── POST /bank-statements/{id}/resolve ──────────────────
  /**
   * User picks which cash_image_id to link from duplicate candidates.
   * Sets bank_verify = true on the chosen CashImage.
   */
  async function resolveRecord(statementRecordId, cashImageId) {
    error.value = null;
    try {
      const res = await axios.post(
        `/bank-statements/${statementRecordId}/resolve`,
        {
          cash_image_id: cashImageId,
        },
      );
      return res.data.result;
    } catch (err) {
      error.value = err?.response?.data?.message ?? err.message;
      throw err;
    }
  }

  // ─── POST /bank-statements/{id}/bank-verify ──────────────
  /**
   * Directly bank-verify a 'match' row (no duplicate picking needed).
   */
  async function bankVerifyRecord(statementRecordId) {
    error.value = null;
    try {
      const res = await axios.post(
        `/bank-statements/${statementRecordId}/bank-verify`,
      );
      return res.data.result;
    } catch (err) {
      error.value = err?.response?.data?.message ?? err.message;
      throw err;
    }
  }

  async function bankVerifyRecordAll(data) {
    error.value = null;
    try {
      const res = await axios.post(`/bank-statements/bank-verify-all`, data);
      return res.data.result;
    } catch (err) {
      error.value = err?.response?.data?.message ?? err.message;
      throw err;
    }
  }

  function $reset() {
    records.value = null;
    summary.value = null;
    loading.value = false;
    importing.value = false;
    error.value = null;
  }

  return {
    records,
    summary,
    loading,
    importing,
    error,
    getRecords,
    getRecordsPage,
    getSummary,
    importCsv,
    getDuplicateCandidates,
    resolveRecord,
    bankVerifyRecord,
    bankVerifyRecordAll,
    $reset,
  };
});
