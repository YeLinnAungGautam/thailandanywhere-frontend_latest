import HomeView from "../views/HomeView.vue";
import ComponentView from "../views/ComponentView.vue";
import TableView from "../views/TableView.vue";
import ProductView from "../views/ProductView.vue";
import BookingView from "../views/BookingView.vue";
import BookingCreateView from "../views/BookingCreate.vue";
import BookingNewCreateView from "../views/BookingCreateNewVersion.vue";
import NewBookingView from "../views/NewBookingView.vue";
import CustomerView from "../views/CustomerView.vue";
import AdminView from "../views/AdminView.vue";
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
import ReservationNewView from "../views/ReservationNewVersion.vue";
import ReservationUpdate from "../views/ReservationUpdate.vue";
import ExpensesView from "../views/Expenses.vue";
import InclusiveView from "../views/InclusiveCreate.vue";
import InclusiveDetailView from "../views/InclusiveUpdate.vue";
import ReservationViewView from "../views/ReservationView.vue";
import DashboardView from "../views/UserDashboard.vue";
import SaleDashboardView from "../views/SaleDashboard.vue";
import CarBookingView from "../views/PrivateVanTourCar.vue";
import AvailabilityView from "../views/Availability.vue";
import UserView from "../views/UserView.vue";
import HotelEditView from "../views/HotelEditPage.vue";
import UpdateBookingNewView from "../views/BookingUpdateNewVersion.vue";
import InclusiveNewCreateView from "../views/InclusiveNewCreate.vue";
import InclusiveNewDetailView from "../views/InclusiveNewUpdate.vue";
import ReservationEntranceConfirmationsView from "../views/ReservationEntranceConfirmationsView.vue";
import AuditorDashboardView from "../views/Auditor.vue";
import ReservationEntranceConfirmationsSvgView from "../views/ReservationEntranceConfirmationSvg.vue";
import ReservationSecondView from "../views/Reservation2.vue";

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
    path: "/user_dashboard",
    name: "dashboard",
    component: DashboardView,
  },
  {
    path: "/auditor_dashboard",
    name: "auditor_dashboard",
    component: AuditorDashboardView,
  },
  {
    path: "/sales_dashboard",
    name: "sales_dashboard",
    component: SaleDashboardView,
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
  // {
  //   path: "/sales",
  //   name: "sales",
  //   component: SaleView,
  // },
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
    path: "/bookings/:crm_id/:customer_name/:sale_date",
    name: "bookings",
    component: BookingView,
  },
  {
    path: "/bookings/create",
    name: "bookings_create",
    component: BookingCreateView,
  },
  {
    path: "/bookings/new-create",
    name: "bookings_new_create",
    component: BookingNewCreateView,
  },
  {
    path: "/bookings/new-update/:id",
    name: "update_new_bookings",
    component: UpdateBookingNewView,
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
    path: "/bookings/update/:id/:action",
    name: "update_bookings",
    component: UpdateBookingView,
  },
  {
    path: "/database/:page",
    name: "database",
    component: DatabaseView,
  },
  {
    path: "/vantour/edit",
    name: "vantouredit",
    component: VantourView,
  },
  {
    path: "/product/hotel/edit/:id",
    name: "hoteledit",
    component: HotelEditView,
  },
  {
    path: "/vantour/view/:id/:action",
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
    path: "/grouptour/view/:id/:action",
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
    path: "/airport/update/:id/:action",
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
    path: "/entrance/update/:id/:action",
    name: "entranceupdate",
    component: EntranceUpdateView,
  },
  {
    path: "/reservation/:product_type/:crm_id/:service_date",
    name: "reservation",
    component: ReservationView,
  },
  {
    path: "/reservation-new/:product_type/:crm_id/:service_date",
    name: "reservation-new",
    component: ReservationNewView,
  },
  {
    path: "/reservation-second",
    name: "reservation-second",
    component: ReservationSecondView,
  },
  {
    path: "/reservation/update/:id/:crm",
    name: "reservation-update",
    component: ReservationUpdate,
  },
  {
    path: "/reservation/view/:id/:crm/:old",
    name: "reservation-view",
    component: ReservationViewView,
  },
  {
    path: "/reservation/confirmations/entrance/:id",
    name: "reservation-entrance-confirmations",
    component: ReservationEntranceConfirmationsView,
  },
  {
    path: "/reservation/confirmations/svg/entrance/:id",
    name: "reservation-entrance-svg-confirmations",
    component: ReservationEntranceConfirmationsSvgView,
  },
  {
    path: "/expenses",
    name: "expenses",
    component: ExpensesView,
  },
  {
    path: "/inclusive/create",
    name: "inclusive-create",
    component: InclusiveView,
  },
  {
    path: "/inclusive/new/create",
    name: "inclusive-create-new",
    component: InclusiveNewCreateView,
  },
  {
    path: "/inclusive/view/:id/:action",
    name: "inclusive-view",
    component: InclusiveDetailView,
  },
  {
    path: "/inclusive/new/update/:id/:action",
    name: "inclusive-view-new",
    component: InclusiveNewDetailView,
  },

  {
    path: "/admins",
    name: "admins",
    component: AdminView,
  },
  {
    path: "/car-bookings/:part",
    name: "car-bookings",
    component: CarBookingView,
  },
  {
    path: "/availabilities/",
    name: "availabilities",
    component: AvailabilityView,
  },
  {
    path: "/users",
    name: "UserView",
    component: UserView,
  },
];

export default routes;
