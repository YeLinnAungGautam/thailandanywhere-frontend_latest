import HomeView from "../views/HomeView.vue";
import ComponentView from "../views/ComponentView.vue";
const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/components",
    name: "components",
    component: ComponentView,
  },
];

export default routes;
