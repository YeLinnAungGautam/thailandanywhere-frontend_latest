import HomeView from "../views/HomeView.vue";
import ComponentView from "../views/ComponentView.vue";
import TableView from "../views/TableView.vue";
import ProductView from "../views/ProductView.vue";
import BookingView from "../views/BookingView.vue";
import NewBookingView from "../views/NewBookingView.vue";
import CustomerView from "../views/CustomerView.vue";
import EditBookingView from "../views/EditBookingView.vue";
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
  {
    path: "/tables",
    name: "tables",
    component: TableView,
  },
  {
    path: "/products",
    name: "products",
    component: ProductView,
  },
  {
    path: "/customers",
    name: "customers",
    component: CustomerView,
  },
  {
    path: "/bookings",
    name: "bookings",
    component: BookingView,
  },
  {
    path: "/bookings/new",
    name: "new_bookings",
    component: NewBookingView,
  },
  {
    path: "/bookings/edit",
    name: "edit_bookings",
    component: EditBookingView,
  },
];

export default routes;
