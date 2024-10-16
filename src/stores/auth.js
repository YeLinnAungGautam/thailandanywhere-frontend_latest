import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({ token: null, user: null }),
  getters: {
    isCashier: (state) => {
      return state.user.role === "cashier";
    },
    isAdmin: (state) => {
      return state.user.role === "admin";
    },
    isSuperAdmin: (state) => {
      return state.user.role === "super_admin";
    },
    isReservation: (state) => {
      return state.user.role === "reservation";
    },
    isAgent: (state) => {
      return state.user.role === "agent";
    },
    isCarSupplier: (state) => {
      return state.user.role === "car_supplier";
    },
    isAuditor: (state) => {
      return state.user.role === "auditor";
    },
    target: (state) => {
      return state.user.target_amount;
    },
  },
  actions: {
    async login(data) {
      try {
        const response = await axios.post("/login", data);
        this.token = response.data.result.token;
        this.user = response.data.result.user;
        console.log(this.user, "this is user");
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
        localStorage.setItem("token", this.token);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async getMe() {
      try {
        if (this.user == null) {
          const response = await axios.get("/me");
          this.user = response.data.result.user;
          this.token = localStorage.getItem("token");
          return response;
        } else {
          this.token = localStorage.getItem("token");
          return "get already";
        }
      } catch (error) {
        this.user = null;
        this.token = null;
        localStorage.removeItem("token");
        throw error;
      }
    },
    async logout() {
      try {
        const response = await axios.post("/logout");
        localStorage.removeItem("token");
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async logoutAllUser() {
      try {
        const response = await axios.post("/logout/all");
        // localStorage.removeItem("token");
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
