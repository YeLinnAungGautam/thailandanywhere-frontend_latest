import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";
import { useAuthStore } from "../stores/auth";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem("token");
  const authStore = useAuthStore();

  if (to.meta.guest) {
    next();
  } else if (to.name === "login" && token != null) {
    next("/");
  } else {
    if (!token) {
      next("login");
    } else {
      try {
        await authStore.getMe();
        next();
      } catch (error) {
        localStorage.removeItem("token");
        next("/login");
      }
    }
  }
});

export default router;
