import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({ token: null, user: null }),
  getters: {
    isSuperAdmin: (state) => {
      return state.user.is_super;
    },
  },
  actions: {
    async login(data) {
      try {
        const response = await axios.post("/login", data);
        this.token = response.data.result.token;
        this.user = response.data.result.user;
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
        localStorage.setItem("token", this.token);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async getMe() {
      try {
        const response = await axios.get("/me");
        this.user = response.data.result.user;
        this.token = localStorage.getItem("token");
        return response;
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
  },
});
