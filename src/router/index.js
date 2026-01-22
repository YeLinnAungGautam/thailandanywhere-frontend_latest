import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";
import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const token = localStorage.getItem("token");

  // Allow guest routes
  if (to.meta.guest) {
    return next();
  }

  // If on login page and already has token, redirect to home
  if (to.name === "login" && token) {
    return next("/");
  }

  // Require authentication for protected routes
  if (!token) {
    return next("/login");
  }

  // If user data not loaded yet, try to load it (only once)
  if (!authStore.user) {
    try {
      await authStore.getMe();
      next();
    } catch (error) {
      console.error("❌ Auth check failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      next("/login");
    }
  } else {
    // User already loaded, proceed
    next();
  }
});

export default router;
