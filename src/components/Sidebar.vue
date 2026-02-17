<template>
  <div
    class="bg-white z-[1002] text-white absolute md:relative border-r border-gray-200 shadow-inner-custom transition-all duration-500 ease-in-out"
    :class="isShowSidebar ? 'w-[260px]' : 'w-[80px]'"
  >
    <div class="h-[80px] w-full flex items-center">
      <div class="flex w-full items-center justify-between px-[20px]">
        <div class="flex items-center">
          <h3 class="text-sm font-medium md:text-sm lg:text-base">
            <img
              @click.prevent="toggleSidebarHandler"
              src="../../public/web-logo.png"
              class="min-w-10 max-w-10 max-h-10 min-h-10 rounded"
              alt=""
            />
          </h3>
          <p
            class="ml-2 font-medium tracking-wide text-sm text-[#FF5B00] transition-opacity duration-500 ease-in-out"
            :class="isShowSidebar ? 'opacity-100' : 'hidden'"
          >
            thanywhere
          </p>
        </div>
        <button
          class="block p-3 text-white bg-blue-500 rounded-md shadow md:hidden transition-transform duration-500 ease-in-out"
          @click.prevent="toggleSidebarHandler"
          :class="isShowSidebar ? 'rotate-180' : 'rotate-0'"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
    <div class="h-[calc(100vh-80px)] bg-opacity-0 py-[20px] z-50 relative">
      <div class="flex justify-between h-full space-y-[10px]">
        <div
          :class="!isShowSidebar ? 'pl-[14px]' : 'px-[14px]'"
          class="flex flex-col justify-between h-full overflow-y-auto no-scrollbar"
        >
          <div>
            <!-- Sidebar items here -->
            <div>
              <div class="bg-white">
                <p class="text-black font-semibold text-[8px]">Dashboard</p>
                <SidebarItem
                  name="Dashboard"
                  :icon="Squares2X2Icon"
                  to="/"
                  v-show="authStore.isSuperAdmin"
                />
                <SidebarItem
                  name="Dashboard"
                  :icon="Squares2X2Icon"
                  to="/auditor_dashboard"
                  v-show="authStore.isAuditor"
                />
                <SidebarItem
                  name="Dashboard"
                  :icon="Squares2X2Icon"
                  to="/sales_dashboard"
                  v-show="authStore.isSaleAdmin"
                />
                <SidebarItem
                  name="Dashboard"
                  :icon="Squares2X2Icon"
                  to="/user_dashboard"
                  v-show="
                    !authStore.isSuperAdmin &&
                    !authStore.isAuditor &&
                    !authStore.isSaleAdmin &&
                    !authStore.isExternalAudit
                  "
                />
              </div>

              <div>
                <p class="text-black font-semibold text-[8px]">Sale</p>
                <SidebarItem
                  name="Sales"
                  v-if="
                    authStore.isSuperAdmin ||
                    authStore.isCashier ||
                    authStore.isAdmin ||
                    authStore.isSaleAdmin ||
                    authStore.isAuditor ||
                    authStore.isReservation
                  "
                  :icon="CalendarIcon"
                  to="/bookings/%25/%25/%25"
                  :activePaths="[
                    'bookings',
                    'bookings_create',
                    'edit_bookings',
                    'update_bookings',
                    'bookings_new_create',
                    'update_new_bookings',
                  ]"
                />
                <SidebarItem
                  v-if="!authStore.isExternalAudit && !authStore.isAuditor"
                  name="Order"
                  :icon="ListBulletIcon"
                  to="/order"
                  :activePaths="['order']"
                />
              </div>
              <div>
                <p class="text-black font-semibold text-[8px]">Booking</p>
                <SidebarItem name="MapHotel" :icon="MapIcon" to="/map_hotel" />
                <SidebarItem
                  name="availabilities"
                  :icon="ChatBubbleOvalLeftEllipsisIcon"
                  to="/availabilities"
                  :activePaths="['availabilities']"
                />
                <!-- <div
                  v-if="!authStore.isExternalAudit"
                  @click="toggleGroupShow"
                  class="text-gray-600 bg-white cursor-pointer inline-flex mb-1 text-[.75rem] rounded-xl relative items-center py-[8px] pr-[10px] pl-[5px] w-full text-sm font-roboto hover:text-[#FF5B00] hover:bg-[#FF5B00]/20 transition duration-150"
                >
                  <ClipboardDocumentListIcon class="w-4 h-4" />
                  <p
                    class="flex justify-between w-[80%] text-[12px] ml-[1.2rem] items-center"
                    v-if="isShowSidebar"
                  >
                    Group new
                    <ChevronDownIcon
                      class="w-4 h-4 transition-opacity duration-500 ease-in-out"
                      :class="isGroupShow ? 'opacity-0' : 'opacity-100'"
                      v-if="!isGroupShow"
                    />
                    <ChevronUpIcon
                      class="w-4 h-4 transition-opacity duration-500 ease-in-out"
                      :class="isGroupShow ? 'opacity-100' : 'opacity-0'"
                      v-if="isGroupShow"
                    />
                  </p>
                </div> -->
                <div class="transition-all duration-150">
                  <SidebarItem
                    name="Reservation"
                    label="reservation"
                    :icon="RectangleGroupIcon"
                    to="/reservation-group"
                    :activePaths="[
                      'group-vantour',
                      'group-attraction',
                      'group-hotel',
                      'reservation-group',
                      'group-fill-data',
                      'group-hotel-email',
                      'group-hotel-expense',
                      'group-confirmation',
                    ]"
                  />
                </div>
                <SidebarItem
                  name="MailBox"
                  :icon="EnvelopeIcon"
                  to="/mail-box"
                  :activePaths="['mailBox']"
                />
                <SidebarItem
                  name="Chat"
                  :icon="ChatBubbleOvalLeftIcon"
                  to="/chat"
                  :activePaths="['chat']"
                />
                <SidebarItem
                  v-if="authStore.isSuperAdmin"
                  name="Amend"
                  :icon="ArrowPathIcon"
                  to="/amend"
                  :activePaths="['amend']"
                />
              </div>

              <div>
                <p class="text-black font-semibold text-[8px]">Account</p>
                <SidebarItem
                  name="Accounting"
                  v-if="!authStore.isExternalAudit"
                  :icon="CalculatorIcon"
                  to="/accounting"
                  :activePaths="['accounting']"
                />
                <div
                  v-if="!authStore.isExternalAudit"
                  @click="sidebarStore.toggleAccount"
                  class="text-gray-600 bg-white cursor-pointer inline-flex mb-1 text-[.75rem] rounded-xl relative items-center py-[8px] pr-[10px] pl-[5px] w-full text-sm font-roboto hover:text-[#FF5B00] hover:bg-[#FF5B00]/20 transition duration-150"
                >
                  <FolderIcon class="w-4 h-4" />
                  <p
                    class="flex justify-between w-[80%] text-[12px] ml-[1.2rem] items-center"
                    v-if="isShowSidebar"
                  >
                    Accountance
                    <ChevronDownIcon
                      class="w-4 h-4 transition-opacity duration-500 ease-in-out"
                      :class="isShowAccount ? 'opacity-0' : 'opacity-100'"
                      v-if="!isShowAccount"
                    />
                    <ChevronUpIcon
                      class="w-4 h-4 transition-opacity duration-500 ease-in-out"
                      :class="isShowAccount ? 'opacity-100' : 'opacity-0'"
                      v-if="isShowAccount"
                    />
                  </p>
                </div>
                <div
                  class="transition-all duration-150"
                  :class="isShowAccount ? '' : ''"
                  v-if="isShowAccount"
                >
                  <SidebarItem
                    name="Accountance PDF"
                    label="PDF"
                    v-if="authStore.isSuperAdmin || authStore.isAuditor"
                    :icon="FolderIcon"
                    to="/accountance-pdf"
                  />
                  <SidebarItem
                    name="Chart of Accounts"
                    label="COA"
                    v-if="authStore.isSuperAdmin || authStore.isAuditor"
                    :icon="FolderIcon"
                    to="/chart_of_account"
                  />
                  <SidebarItem
                    name="Income Checker"
                    label="ICheck"
                    v-if="authStore.isSuperAdmin || authStore.isAuditor"
                    :icon="FolderIcon"
                    to="/product_income_checker"
                  />
                  <SidebarItem
                    name="Receiptable Checker"
                    label="RCheck"
                    v-if="authStore.isSuperAdmin || authStore.isAuditor"
                    :icon="FolderIcon"
                    to="/receiptable_checker"
                  />
                  <SidebarItem
                    name="Verify Invoices"
                    label="VInvoice"
                    v-if="authStore.isSuperAdmin || authStore.isAuditor"
                    :icon="FolderIcon"
                    to="/data_verify"
                  />
                  <SidebarItem
                    name="Cash Book"
                    label="Cash Book"
                    v-if="authStore.isSuperAdmin || authStore.isAuditor"
                    :icon="FolderIcon"
                    to="/cash_book"
                  />
                  <!-- <SidebarItem
                    name="Account Head"
                    label="AHead"
                    v-if="authStore.isSuperAdmin || authStore.isAuditor"
                    :icon="FolderIcon"
                    to="/account_head"
                  /> -->
                  <SidebarItem
                    name="Tax Receipts"
                    label="Tax"
                    :icon="FolderIcon"
                    to="/tax_receipt"
                  />

                  <SidebarItem
                    v-if="authStore.isSuperAdmin || authStore.isAuditor"
                    name="Bank Statement"
                    label="Statement"
                    :icon="FolderIcon"
                    to="/bank_statement_list"
                  />
                  <SidebarItem
                    v-if="authStore.isSuperAdmin || authStore.isAuditor"
                    name="Bank Statement"
                    label="Statement"
                    :icon="FolderIcon"
                    to="/bank_statement_type"
                  />
                </div>

                <SidebarItem
                  v-if="authStore.isExternalAudit"
                  name="Bank Statement"
                  label="Statement"
                  :icon="FolderIcon"
                  to="/bank_statement_list"
                />

                <SidebarItem
                  v-if="
                    authStore.isExternalAudit ||
                    authStore.isAuditor ||
                    authStore.isSuperAdmin
                  "
                  name="external audit"
                  label="External"
                  :icon="FolderIcon"
                  to="/invoice_audit"
                />
                <!-- <SidebarItem
                  v-if="authStore.isSuperAdmin || authStore.isReservation"
                  name="Bank Statement Filter"
                  label="Statement"
                  :icon="FolderIcon"
                  to="/bank_statement_filter"
                /> -->
                <SidebarItem
                  v-if="authStore.isSuperAdmin || authStore.isReservation"
                  name="Bank Purchase"
                  label="Purchase"
                  :icon="FolderIcon"
                  to="/bank_statement_purchese"
                />
              </div>
              <SidebarItem
                v-if="!authStore.isAgent && !authStore.isExternalAudit"
                name="Products"
                :icon="ArchiveBoxIcon"
                :activePaths="[
                  'products',
                  'inclusive-create',
                  'inclusive-view',
                  'vantourview',
                  'vantouredit',
                  'vantour',
                  'airportcreate',
                  'airportupdate',
                  'grouptour',
                  'grouptourview',
                  'grouptourcreate',
                  'entrance',
                  'entrancecreate',
                  'entranceupdate',
                  'hoteledit',
                  'inclusive-create-new',
                  'inclusive-view-new',
                ]"
                to="/products/page"
              />
              <SidebarItem
                name="Product V2"
                :icon="ArchiveBoxIcon"
                to="/products-v2"
                :activePaths="['products-v2']"
              />
              <SidebarItem
                v-if="!authStore.isAgent && !authStore.isExternalAudit"
                name="Database"
                :icon="CircleStackIcon"
                :activePaths="['database', 'blog_categories']"
                to="/database/page"
              />
              <SidebarItem
                name="Blogs"
                v-if="!authStore.isAgent && !authStore.isExternalAudit"
                :icon="DocumentTextIcon"
                to="/blogs"
                :activePaths="['new_blog']"
              />
              <SidebarItem
                name="Customers"
                v-if="
                  !authStore.isAgent &&
                  !authStore.isAuditor &&
                  !authStore.isExternalAudit
                "
                :icon="UsersIcon"
                to="/customers"
                :activePaths="[
                  'customers',
                  'customerscreate',
                  'customersupdate',
                ]"
              />
              <SidebarItem
                name="Users"
                v-if="authStore.isSuperAdmin"
                :icon="UsersIcon"
                to="/users"
                :activePaths="['users']"
              />
              <SidebarItem
                v-if="authStore.isSuperAdmin"
                name="Admins"
                :icon="UserCircleIcon"
                to="/admins"
                :activePaths="['admins']"
              />
              <div
                v-if="!authStore.isAuditor && !authStore.isExternalAudit"
                @click="toggleSidebarShowSetting"
                class="text-gray-600 bg-white cursor-pointer inline-flex mb-1 text-[.75rem] rounded-xl relative items-center py-[8px] pr-[10px] pl-[5px] w-full text-sm font-roboto hover:text-[#FF5B00] hover:bg-[#FF5B00]/20 transition duration-150"
              >
                <Cog6ToothIcon class="w-4 h-4" />
                <p
                  class="flex justify-between w-[80%] text-[12px] ml-[1.2rem] items-center"
                  v-if="isShowSidebar"
                >
                  Setting
                  <ChevronDownIcon
                    class="w-4 h-4 transition-opacity duration-500 ease-in-out"
                    :class="isShowSetting ? 'opacity-0' : 'opacity-100'"
                    v-if="!isShowSetting"
                  />
                  <ChevronUpIcon
                    class="w-4 h-4 transition-opacity duration-500 ease-in-out"
                    :class="isShowSetting ? 'opacity-100' : 'opacity-0'"
                    v-if="isShowSetting"
                  />
                </p>
              </div>
              <div
                class="transition-all duration-150"
                :class="isShowSetting ? '' : ''"
                v-if="isShowSetting"
              >
                <SidebarItem
                  v-if="!authStore.isAgent && !authStore.isAuditor"
                  name="Calendar"
                  :icon="CalendarDaysIcon"
                  to="/calendar"
                />
              </div>
              <SidebarItem
                v-if="
                  !authStore.isAgent &&
                  !authStore.isAuditor &&
                  !authStore.isExternalAudit
                "
                name="CarBookings"
                :icon="DocumentTextIcon"
                to="/car-bookings/unassigned"
                :activePaths="['car-bookings']"
              />
              <SidebarItem
                v-if="authStore.isSuperAdmin"
                name="File Storage"
                :icon="FolderIcon"
                to="/storage"
                :activePaths="['storage']"
              />
              <SidebarItem
                v-if="authStore.isSuperAdmin"
                name="Partners"
                :icon="UserGroupIcon"
                to="/partner"
                :activePaths="['partner']"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SidebarItem from "./SidebarItem.vue";
import { useSidebarStore } from "../stores/sidebar";

import {
  Squares2X2Icon,
  UserCircleIcon,
  XMarkIcon,
  ArchiveBoxIcon,
  CalendarDaysIcon,
  UsersIcon,
  DocumentTextIcon,
  WalletIcon,
  Cog6ToothIcon,
  CalendarIcon,
  UserGroupIcon,
  DocumentCheckIcon,
  PuzzlePieceIcon,
  TableCellsIcon,
  CircleStackIcon,
  PresentationChartBarIcon,
  ClockIcon,
  ChevronDownIcon,
  NewspaperIcon,
  ClipboardDocumentListIcon,
  CheckBadgeIcon,
  ChevronUpIcon,
  CalculatorIcon,
  HomeModernIcon,
  TicketIcon,
  FolderIcon,
  TruckIcon,
  ChatBubbleBottomCenterTextIcon,
  ArrowPathIcon,
  ListBulletIcon,
  MapIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  EnvelopeIcon,
  RectangleGroupIcon,
  ChatBubbleOvalLeftIcon,
} from "@heroicons/vue/24/outline";
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth";
const sidebarStore = useSidebarStore();
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();
const {
  isShowSidebar,
  isShowSetting,
  isReservationShow,
  isShowAccount,
  isShowReservation,
  isGroupShow,
} = storeToRefs(sidebarStore);
const authStore = useAuthStore();
const toggleSidebarHandler = () => {
  sidebarStore.toggleSidebar();
};

const toggleSidebarShowSetting = () => {
  sidebarStore.toggleShowSetting();
};

const toggleReservationShow = () => {
  sidebarStore.toggleReservation();
};

const toggleGroupShow = () => {
  sidebarStore.toggleGroup();
};

import { useToast } from "vue-toastification";
const toast = useToast();

const reservationTypeShow = ref(false);

onMounted(() => {
  // console.log(window.innerWidth);
  if (window.innerWidth < 991) {
    sidebarStore.customSideBar();
  }
  console.log(authStore.isAdmin);

  if (
    route.name == "reservation-attraction" ||
    route.name == "reservation-hotel" ||
    route.name == "reservation-vantour"
  ) {
    sidebarStore.toggleShowReservation();
  }
});
</script>

<style scoped>
.shadow-inner-custom {
  box-shadow: inset -10px 0 10px -10px rgba(0, 0, 0, 0.1);
}
.sidebar-enter-active,
.sidebar-leave-active {
  transition: width 0.5s ease-in-out;
}

.sidebar-enter-from,
.sidebar-leave-to {
  width: 80px;
}

.sidebar-enter-to,
.sidebar-leave-from {
  width: 260px;
}
</style>
