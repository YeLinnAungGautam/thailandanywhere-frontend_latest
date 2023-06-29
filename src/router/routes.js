import HomeView from "../views/HomeView.vue";
import ComponentView from "../views/ComponentView.vue";
import TableView from "../views/TableView.vue";
import ProductView from "../views/ProductView.vue";
import BookingView from "../views/BookingView.vue";
import NewBookingView from "../views/NewBookingView.vue";
import CustomerView from "../views/CustomerView.vue";
import EditBookingView from "../views/EditBookingView.vue";
import LoginView from "../views/LoginView.vue";
import CalendarView from "../views/CalendarView.vue";
import SaleView from "../views/SaleView.vue";
import PartnerView from "../views/PartnerView.vue";
import BlogView from "../views/BlogView.vue";
import BlogCategoryView from "../views/BlogCategoryView.vue";
import NewBlogView from "../views/NewBlogView.vue";
import EditBlogView from "../views/EditBlogView.vue";

const routes = [
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: {
      guest: true,
    },
  },
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
    path: "/sales",
    name: "sales",
    component: SaleView,
  },
  {
    path: "/partners",
    name: "partners",
    component: PartnerView,
  },
  {
    path: "/customers",
    name: "customers",
    component: CustomerView,
  },
  {
    path: "/blogs",
    name: "blogs",
    component: BlogView,
  },
  {
    path: "/blogs/new",
    name: "new_blog",
    component: NewBlogView,
  },
  {
    path: "/blogs/edit/:slug",
    name: "edit_blog",
    component: EditBlogView,
  },
  {
    path: "/blogs/categories",
    name: "blog_categories",
    component: BlogCategoryView,
  },
  {
    path: "/bookings",
    name: "bookings",
    component: BookingView,
  },
  {
    path: "/calendar",
    name: "calendar",
    component: CalendarView,
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
