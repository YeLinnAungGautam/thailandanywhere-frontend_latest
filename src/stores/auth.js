import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    user: null,
    loading: false,
    error: null,
  }),

  getters: {
    isCashier: (state) => state.user?.role === "cashier",
    isAdmin: (state) => state.user?.role === "admin",
    isSuperAdmin: (state) => state.user?.role === "super_admin",
    isReservation: (state) => state.user?.role === "reservation",
    isAgent: (state) => state.user?.role === "agent",
    isCarSupplier: (state) => state.user?.role === "car_supplier",
    isAuditor: (state) => state.user?.role === "auditor",
    isSaleAdmin: (state) => state.user?.role === "sale_manager",
    isExternalAudit: (state) => state.user?.role === "external_audit",
    target: (state) => state.user?.target_amount || 0,
    isAuthenticated: (state) => state.token !== null && state.user !== null,
  },

  actions: {
    async login(data) {
      this.loading = true;
      this.error = null;

      try {
        console.log("🔐 Logging in...");
        const response = await axios.post("/login", data);

        this.token = response.data.result.token;
        this.user = response.data.result.user;

        console.log("✅ Login successful:", this.user.name);

        // Set axios header
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;

        // Save to localStorage
        localStorage.setItem("token", this.token);
        localStorage.setItem("user", JSON.stringify(this.user));

        return response.data;
      } catch (error) {
        console.error("❌ Login failed:", error);
        this.error = error.response?.data?.message || "Login failed";
        this.token = null;
        this.user = null;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getMe() {
      try {
        console.log("👤 Fetching current user...");

        if (this.user !== null) {
          console.log("✅ User already loaded");
          this.token = localStorage.getItem("token");
          return { message: "User already loaded" };
        }

        const response = await axios.get("/me");
        this.user = response.data.result.user;
        this.token = localStorage.getItem("token");

        console.log("✅ User loaded:", this.user.name);
        return response;
      } catch (error) {
        console.error("❌ Get user failed:", error);

        this.user = null;
        this.token = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        router.replace("/login");

        throw error;
      }
    },

    async logout() {
      try {
        console.log("🚪 Logging out...");
        const response = await axios.post("/logout");

        // Clear auth state
        this.clearAuth();

        console.log("✅ Logged out successfully");
        return response.data;
      } catch (error) {
        console.error("❌ Logout failed:", error);
        this.clearAuth();
        throw error;
      }
    },

    async logoutAllUser() {
      try {
        console.log("🚪 Logging out all users...");
        const response = await axios.post("/logout/all");
        return response.data;
      } catch (error) {
        console.error("❌ Logout all failed:", error);
        throw error;
      }
    },

    async logoutAllPartner() {
      try {
        console.log("🚪 Logging out all users...");
        const response = await axios.post("/logout/all-partner");
        return response.data;
      } catch (error) {
        console.error("❌ Logout all failed:", error);
        throw error;
      }
    },

    loadFromStorage() {
      try {
        console.log("📦 Loading auth from storage...");

        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (savedToken && savedUser) {
          this.token = savedToken;
          this.user = JSON.parse(savedUser);

          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${savedToken}`;

          console.log("✅ Auth restored from storage:", this.user.name);
        } else {
          console.log("ℹ️ No auth data in storage");
        }
      } catch (err) {
        console.error("❌ Failed to load auth from storage:", err);
        this.clearAuth();
      }
    },

    clearAuth() {
      console.log("🧹 Clearing auth...");

      this.token = null;
      this.user = null;
      this.error = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      delete axios.defaults.headers.common["Authorization"];
    },
  },
});
