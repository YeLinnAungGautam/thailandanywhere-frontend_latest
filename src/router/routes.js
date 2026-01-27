import HomeView from "../views/HomeView.vue";
import ComponentView from "../views/ComponentView.vue";
import TableView from "../views/TableView.vue";
import ProductView from "../views/ProductView.vue";
import BookingView from "../views/BookingView.vue";
import BookingOldView from "../views/BookingOldVersion.vue";
import BookingCreateView from "../views/BookingCreate.vue";
import BookingNewCreateView from "../views/BookingCreateNewVersion.vue";
import NewBookingView from "../views/NewBookingView.vue";
import CustomerView from "../views/CustomerView.vue";
import AdminView from "../views/AdminView.vue";
import EditBookingView from "../views/EditBookingView.vue";
import LoginView from "../views/LoginView.vue";
import CalendarView from "../views/CalendarView.vue";
import SaleView from "../views/SaleView.vue";
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
import ReservationHotelConfirmationsView from "../views/PngGenerate/HotelConfirmationPng.vue";
import AuditorDashboardView from "../views/Auditor.vue";
import ReservationEntranceConfirmationsSvgView from "../views/ReservationEntranceConfirmationSvg.vue";
import ReservationSecondView from "../views/Reservation2.vue";
import PngUsage from "../views/PngGenerate/PngUsage.vue";
import Accounting from "../views/Accounting.vue";
import ReservationHotelView from "../views/Reservationhotel.vue";
import ReservationHotelGroupConfirmationsView from "../views/PngGenerate/HotelGroupConfirmationPng.vue";
import ReservationHotelGroupNewConfirmationsView from "../views/PngGenerate/HotelConfirmationGroupNew.vue";
import ReservationAttractionView from "../views/ReservationAttraction.vue";
import AccountHead from "../views/AccountHead.vue";
import AccountClass from "../views/AccountClass.vue";
import ChartOfAccount from "../views/ChartOfAccount.vue";
import ReservationVantourView from "../views/ReservationVantour.vue";
import AmendView from "../views/Amend.vue";
import productIncomeChecker from "../views/ProductIncomeChecker.vue";
import verifyInvoices from "../views/VerifyInvoice.vue";
import ReceiptableChecker from "../views/ReceiptableChecker.vue";
import OrderView from "../views/OrderPage.vue";
import GroupItemView from "../views/GroupItem.vue";
import TaxReceipt from "../views/TaxReceipt.vue";
import GroupVantour from "../views/GroupVantour.vue";
import GroupHotel from "../views/GroupHotel.vue";
import BankStatement from "../views/BankStatement.vue";
import CashBook from "../views/CashBook.vue";
import CashStructure from "../views/CashStructure.vue";
import AccountancePdf from "../views/AccountancePdf.vue";
import BankStatementList from "../views/BankStatementList.vue";
import BankStatementSummary from "../views/BankStatementSummary.vue";
import BankParcheseList from "../views/BankParcheseList.vue";
import BankStatementFilter from "../views/BankStatementFilter.vue";
import CashInternalTransfer from "../views/CashInternalTransfer.vue";
import StorageView from "../views/Storage.vue";
import PartnerView from "../views/Partner.vue";
import dataVerify from "../views/DataVerify.vue";
import RemaindTaxReceiptModal from "../views/TaxReceiptComponent/RemaindTaxReceiptModal.vue";
import duplicateChecker from "../views/DuplateChecker.vue";
import internalTransferChecker from "../views/InternalTransferChecker.vue";
import bankVerify from "../views/BankVerify.vue";
import BankStatementType from "../views/BankStatementType.vue";
import HomeNewView from "../views/HomeNew.vue";
import MapHotel from "../views/MapHotel.vue";
import EmailCheck from "../views/EmailCheck.vue";
import MailBox from "../views/MailBox.vue";
import ExpensePart from "../views/ExpensePart.vue";
import FillData from "../views/FillData.vue";
import ConfirmationGroup from "../views/ConfirmationGroup.vue";
import ReservationGroup from "../views/ReservationGroup.vue";
import ChatView from "../views/ChatView.vue";

import HomeSaleAnalysics from "../views/DashboardPageSplit/SaleAnalysics.vue";
import HomeNew from "../views/HomeNew.vue";
import HomeCalendarView from "../views/Dashboard/ReservationCalendarHome.vue";
import HomeReceivableView from "../views/Dashboard/AccountReceivable.vue";
import HomeCashImageReportView from "../views/Dashboard/CashImageReport.vue";
import HomeReservationsView from "../components/homeReservation/ReservationPartHome.vue";

//version 2 imports
import ProductVersion2View from "../views/ProductVersion2View.vue";
import HotelViewVersion2 from "../views/HotelViewVersion2.vue";
import AttractionViewVersion2 from "../views/AttractionViewVersion2.vue";
import HotelEditViewVersion2 from "../views/HotelEditPageVersion2.vue";
import HotelCreateVersionV2 from "../views/HotelCreateVersionV2.vue";

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
    path: "/home/sale-analysics",
    name: "home_sale_analysics",
    component: HomeSaleAnalysics,
  },
  {
    path: "/home/overall-analysics",
    name: "home_overall_analysics",
    component: HomeNew,
  },
  {
    path: "/home/calendar",
    name: "home_calendar",
    component: HomeCalendarView,
  },
  {
    path: "/home/receivable",
    name: "home_receivable",
    component: HomeReceivableView,
  },
  {
    path: "/home/cashImageReport",
    name: "home_cashImageReport",
    component: HomeCashImageReportView,
  },
  {
    path: "/home/reservations",
    name: "home_reservations",
    component: HomeReservationsView,
  },
  {
    path: "/map_hotel",
    name: "MapHotel",
    component: MapHotel,
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

  //version 2 routes
  {
    path: "/products-v2/",
    name: "products-v2",
    component: ProductVersion2View,
  },
  {
    path: "/hotel-v2/",
    name: "hotel-v2",
    component: HotelViewVersion2,
  },
  {
    path: "/attraction-v2/",
    name: "attraction-v2",
    component: AttractionViewVersion2,
  },
  {
    path: "/products-v2/hotel/edit/:id",
    name: "hoteledit-v2",
    component: HotelEditViewVersion2,
  },
  {
    path: "/products-v2/hotel/create",
    name: "hotelcreate-v2",
    component: HotelCreateVersionV2,
  },
  // {
  //   path: "/sales",
  //   name: "sales",
  //   component: SaleView,
  // },

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
    path: "/bookings-old/:crm_id/:customer_name/:sale_date",
    name: "bookingsOld",
    component: BookingOldView,
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
    path: "/bookings/png",
    name: "bookings_png",
    component: PngUsage,
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
    path: "/entrance/update/:id",
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
    path: "/reservation-hotel",
    name: "reservation-hotel",
    component: ReservationHotelView,
  },
  {
    path: "/reservation-attraction",
    name: "reservation-attraction",
    component: ReservationAttractionView,
  },
  {
    path: "/reservation-group",
    name: "reservation-group",
    component: ReservationGroup,
  },
  {
    path: "/group-hotel",
    name: "group-hotel",
    component: GroupHotel,
  },
  {
    path: "/group-hotel-email",
    name: "group-hotel-email",
    component: EmailCheck,
  },
  {
    path: "/group-hotel-expense",
    name: "group-hotel-expense",
    component: ExpensePart,
  },
  {
    path: "/group-fill-data",
    name: "group-fill-data",
    component: FillData,
  },
  {
    path: "/group-confirmation",
    name: "group-confirmation",
    component: ConfirmationGroup,
  },
  {
    path: "/group-attraction",
    name: "group-attraction",
    component: GroupItemView,
  },
  {
    path: "/group-vantour",
    name: "group-vantour",
    component: GroupVantour,
  },
  {
    path: "/reservation-vantour",
    name: "reservation-vantour",
    component: ReservationVantourView,
  },
  {
    path: "/accounting",
    name: "accounting",
    component: Accounting,
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
    path: "/reservation/confirmations/hotel/png",
    name: "reservation-hotel-confirmations",
    component: ReservationHotelConfirmationsView,
  },
  {
    path: "/reservation/confirmations/group/hotel/png",
    name: "reservation-hotel-group-confirmations",
    component: ReservationHotelGroupConfirmationsView,
  },
  {
    path: "/reservation/confirmations/group/hotel/new/png",
    name: "reservation-hotel-group-new-confirmations",
    component: ReservationHotelGroupNewConfirmationsView,
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
  {
    path: "/account_head",
    name: "accountHead",
    component: AccountHead,
  },
  {
    path: "/account_class",
    name: "accountClass",
    component: AccountClass,
  },
  {
    path: "/chart_of_account",
    name: "chartOfAccount",
    component: ChartOfAccount,
  },
  {
    path: "/product_income_checker",
    name: "productIncomeChecker",
    component: productIncomeChecker,
  },
  {
    path: "/verify_invoices",
    name: "verifyInvoices",
    component: verifyInvoices,
  },
  {
    path: "/data_verify",
    name: "dataVerify",
    component: dataVerify,
  },
  {
    path: "/bank_verify",
    name: "bankVerify",
    component: bankVerify,
  },
  {
    path: "/duplicate_checker",
    name: "duplicateChecker",
    component: duplicateChecker,
  },
  {
    path: "/internalTransfer_checker",
    name: "internalTransferChecker",
    component: internalTransferChecker,
  },
  {
    path: "/receiptable_checker",
    name: "receiptableChecker",
    component: ReceiptableChecker,
  },
  {
    path: "/amend",
    name: "amend",
    component: AmendView,
  },
  {
    path: "/order",
    name: "order",
    component: OrderView,
  },
  {
    path: "/tax_receipt",
    name: "TaxReceipt",
    component: TaxReceipt,
  },
  {
    path: "/bank_statement",
    name: "bankStatement",
    component: BankStatement,
  },
  {
    path: "/bank_statement_list",
    name: "bankStatementList",
    component: BankStatementList,
  },
  {
    path: "/bank_statement_type",
    name: "bankStatementType",
    component: BankStatementType,
  },
  {
    path: "/bank_statement_filter",
    name: "bankStatementFilter",
    component: BankStatementFilter,
  },
  {
    path: "/invoice_audit",
    name: "invoiceAudit",
    component: BankStatementSummary,
  },
  {
    path: "/bank_statement_purchese",
    name: "bankParcheseList",
    component: BankParcheseList,
  },
  {
    path: "/cash_book",
    name: "cashBook",
    component: CashBook,
  },
  {
    path: "/cash_structure",
    name: "cashStructure",
    component: CashStructure,
  },
  {
    path: "/cash_internal_transfer",
    name: "cashInternalTransfer",
    component: CashInternalTransfer,
  },
  {
    path: "/accountance-pdf",
    name: "accountancePdf",
    component: AccountancePdf,
  },
  {
    path: "/storage",
    name: "storage",
    component: StorageView,
  },
  {
    path: "/partner",
    name: "partner",
    component: PartnerView,
  },
  {
    path: "/tax-missing",
    name: "taxMissing",
    component: RemaindTaxReceiptModal,
  },
  {
    path: "/mail-box",
    name: "mailBox",
    component: MailBox,
  },
  {
    path: "/chat",
    name: "chat",
    component: ChatView,
  },
];

export default routes;
