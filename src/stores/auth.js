import { defineStore } from "pinia";
import axios from "axios";
import { useChatStore } from "./chat"; // ✅ ADD THIS
import { useSocketStore } from "./socket"; // ✅ ADD THIS
import { useNotificationStore } from "./notification"; // ✅ ADD THIS

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    user: null,
    loading: false,
    error: null,
  }),

  getters: {
    // Role checks with null safety
    isCashier: (state) => {
      return state.user?.role === "cashier";
    },
    isAdmin: (state) => {
      return state.user?.role === "admin";
    },
    isSuperAdmin: (state) => {
      return state.user?.role === "super_admin";
    },
    isReservation: (state) => {
      return state.user?.role === "reservation";
    },
    isAgent: (state) => {
      return state.user?.role === "agent";
    },
    isCarSupplier: (state) => {
      return state.user?.role === "car_supplier";
    },
    isAuditor: (state) => {
      return state.user?.role === "auditor";
    },
    isSaleAdmin: (state) => {
      return state.user?.role === "sale_manager";
    },
    isExternalAudit: (state) => {
      return state.user?.role === "external_audit";
    },
    target: (state) => {
      return state.user?.target_amount || 0;
    },
    isAuthenticated: (state) => {
      return state.token !== null && state.user !== null;
    },
  },

  actions: {
    // Login action
    async login(data) {
      this.loading = true;
      this.error = null;

      try {
        console.log("🔐 Logging in...");
        const response = await axios.post("/login", data);

        // Extract token and user
        this.token = response.data.result.token;
        this.user = response.data.result.user;

        console.log("✅ Login successful:", this.user.name);

        // Set axios header
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;

        // Save to localStorage
        localStorage.setItem("token", this.token);
        localStorage.setItem("user", JSON.stringify(this.user));

        window.dispatchEvent(
          new CustomEvent("auth:login", {
            detail: { token: this.token },
          }),
        );

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

    // Get current user
    async getMe() {
      try {
        console.log("👤 Fetching current user...");

        // If user already loaded, skip API call
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

        // Clear auth on error
        this.user = null;
        this.token = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        throw error;
      }
    },

    // Logout
    async logout() {
      try {
        console.log("🚪 Logging out...");
        const response = await axios.post("/logout");

        // ✅ ADD THIS - Reset all stores before clearing auth
        const chatStore = useChatStore();
        const socketStore = useSocketStore();
        const notificationStore = useNotificationStore();

        // Disconnect socket
        socketStore.disconnect();

        // Reset stores
        chatStore.reset();
        notificationStore.reset();

        // Clear state
        this.clearAuth();

        console.log("✅ Logged out successfully");
        return response.data;
      } catch (error) {
        console.error("❌ Logout failed:", error);

        // Clear anyway
        this.clearAuth();

        throw error;
      }
    },

    // Logout all users (admin function)
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

    // Load from localStorage
    loadFromStorage() {
      try {
        console.log("📦 Loading auth from storage...");

        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (savedToken && savedUser) {
          this.token = savedToken;
          this.user = JSON.parse(savedUser);

          // Restore axios header
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

    // Clear authentication
    clearAuth() {
      console.log("🧹 Clearing auth...");

      this.token = null;
      this.user = null;
      this.error = null;

      // Remove from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Remove from axios header
      delete axios.defaults.headers.common["Authorization"];
    },
  },
});
