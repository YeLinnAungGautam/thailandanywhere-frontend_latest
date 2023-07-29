import HomeView from "../views/HomeView.vue";
import ComponentView from "../views/ComponentView.vue";
import TableView from "../views/TableView.vue";
import ProductView from "../views/ProductView.vue";
import BookingView from "../views/BookingView.vue";
import BookingCreateView from "../views/BookingCreate.vue";
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
import DatabaseView from "../views/DatabaseView.vue";
import VantourView from "../views/EditVantour.vue";
import VantourlistView from "../views/VanTour.vue";
import VantourviewView from "../views/VantourView.vue";
import GrouptourlistView from "../views/Grouptour.vue";
import GrouptourviewView from "../views/GrouptourView.vue";
import GrouptourcreateView from "../views/GrouptourEdit.vue";
import AirportcreateView from "../views/AirportCreate.vue";
import AirportupdateView from "../views/AirportEdit.vue";
import EntranceView from "../views/EntranceTicket.vue";
import EntranceCreateView from "../views/EntranceCreate.vue";
import EntranceUpdateView from "../views/EntranceUpdate.vue";
import CustomerCreateView from "../views/CustomerCreate.vue";
import CustomerUpdateView from "../views/CustomerEdit.vue";
import UpdateBookingView from "../views/BookingUpdate.vue";
import ReservationView from "../views/Reservation.vue";
import ReservationUpdateView from "../views/ReservationUpdate.vue";
import ExpensesView from "../views/Expenses.vue";

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
    path: "/products/:id",
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
    path: "/customers/create",
    name: "customerscreate",
    component: CustomerCreateView,
  },
  {
    path: "/customers/update/:id",
    name: "customersupdate",
    component: CustomerUpdateView,
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
    path: "/bookings/create",
    name: "bookings_create",
    component: BookingCreateView,
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
  {
    path: "/bookings/update/:id",
    name: "update_bookings",
    component: UpdateBookingView,
  },
  {
    path: "/database",
    name: "database",
    component: DatabaseView,
  },
  {
    path: "/vantour/edit",
    name: "vantouredit",
    component: VantourView,
  },
  {
    path: "/vantour/view/:id",
    name: "vantourview",
    component: VantourviewView,
  },
  {
    path: "/vantour",
    name: "vantour",
    component: VantourlistView,
  },
  {
    path: "/grouptour",
    name: "grouptour",
    component: GrouptourlistView,
  },
  {
    path: "/grouptour/view/:id",
    name: "grouptourview",
    component: GrouptourviewView,
  },
  {
    path: "/grouptour/create",
    name: "grouptourcreate",
    component: GrouptourcreateView,
  },
  {
    path: "/airport/create",
    name: "airportcreate",
    component: AirportcreateView,
  },
  {
    path: "/airport/update/:id",
    name: "airportupdate",
    component: AirportupdateView,
  },
  {
    path: "/entrance",
    name: "entrance",
    component: EntranceView,
  },
  {
    path: "/entrance/create",
    name: "entrancecreate",
    component: EntranceCreateView,
  },
  {
    path: "/entrance/update/:id",
    name: "entranceupdate",
    component: EntranceUpdateView,
  },
  {
    path: "/reservation",
    name: "reservation",
    component: ReservationView,
  },
  {
    path: "/reservation/update/:id",
    name: "reservationupdate",
    component: ReservationUpdateView,
  },
  {
    path: "/expenses",
    name: "expenses",
    component: ExpensesView,
  },
];

export default routes;
