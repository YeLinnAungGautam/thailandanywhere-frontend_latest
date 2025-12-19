<script setup>
import Layout from "./Layout.vue";
import Input from "../components/Input.vue";
import VselectVue from "../components/Vselect.vue";
import InputField from "../components/InputField.vue";
import Pagination from "../components/Pagination.vue";
import {
  PencilSquareIcon,
  TrashIcon,
  ShareIcon,
  EyeIcon,
  TicketIcon,
  BuildingOfficeIcon,
  PlusIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  MinusIcon,
  CheckBadgeIcon,
  XMarkIcon,
  XCircleIcon,
  CheckIcon,
  UsersIcon,
  AdjustmentsHorizontalIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftIcon,
  InformationCircleIcon,
} from "@heroicons/vue/24/outline";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import { computed, onMounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";
import Modal from "../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useHotelStore } from "../stores/hotel";
import { useEntranceStore } from "../stores/entrance";
import { useRoomStore } from "../stores/room";
import { useVariationStore } from "../stores/variations";
import { useAvailableStore } from "../stores/available";
import { useSidebarStore } from "../stores/sidebar";
import { formattedDateTime } from "./help/FormatData";
import MainPage from "./ConvertToBookingComponent/MainPage.vue";
import { DocumentDuplicateIcon } from "@heroicons/vue/24/solid";

const sidebarStore = useSidebarStore();
const { isShowSidebar } = storeToRefs(sidebarStore);

const router = useRouter();
const hotelStore = useHotelStore();
const entranceStore = useEntranceStore();
const authStore = useAuthStore();
const roomStore = useRoomStore();
const variationStore = useVariationStore();
const availableStore = useAvailableStore();
const { availables, loading } = storeToRefs(availableStore);
const toast = useToast();

const searchModal = ref(false);
const changeStatusModal = ref(false);
const selectedAvailability = ref(null);
const infoDrawerOpen = ref(false);
const selectedDetailItem = ref(null);

const product_type = ref("hotel");
const product_id = ref("");
const variation_id = ref("");
const daterange = ref("");
const date = ref("");
const status = ref("");
const order_by = ref("desc");
const created_by = ref("");

const productNameArray = ref([]);
const productVariationArray = ref([]);

const selectedRows = ref([]);
const showBookingTable = ref(false);

const errors = ref(null);

const statusOptions = [
  { id: "", name: "All" },
  { id: "pending", name: "Pending" },
  { id: "available", name: "Available" },
  { id: "unavailable", name: "Unavailable" },
  { id: "other", name: "Other" },
];

const deleteAction = async (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Confirm",
  })
    .then(async (result) => {
      if (result.isConfirmed) {
        const res = await availableStore.deleteAction(id);
        console.log(res);

        if (res.message == "success") {
          toast.success("Availability deleted successfully");
          await availableStore.getListAction(watchSystem.value);
        } else {
          console.error("Failed to delete availability", res.message);
        }
      }
    })
    .catch((error) => {
      toast.error(error.response.data.message);
    });
};

const dateFormat = (inputDateString) => {
  if (inputDateString != null) {
    const inputDate = new Date(inputDateString);
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, "0");
    const day = String(inputDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  } else {
    return null;
  }
};

const watchSystem = computed(() => {
  let result = {};
  if (!openBookingTable.value) {
    if (product_type.value != "") {
      result.product_type = product_type.value;
    }
    if (status.value != "") {
      result.status = status.value;
    }
  } else {
    result.status = "available";
  }
  if (product_id.value != "") {
    result.product_id = product_id.value;
  }
  if (variation_id.value != "") {
    result.variation_id = variation_id.value;
  }
  if (daterange.value != "") {
    result.daterange = daterange.value;
  }
  if (date.value != "") {
    result.date = date.value;
  }

  if (order_by.value != "") {
    result.order_by = order_by.value;
  }
  if (!authStore.isSuperAdmin && !authStore.isReservation) {
    result.created_by = authStore.user?.id;
  } else if (created_by.value != "") {
    result.created_by = created_by.value;
  }
  return result;
});

watch(product_type, async (newValue) => {
  await availableStore.getListAction(watchSystem.value);
});

watch(status, async (newValue) => {
  console.log("status", status.value);
  await availableStore.getListAction(watchSystem.value);
});

watch(order_by, async (newValue) => {
  console.log("order_by", order_by.value);
  await availableStore.getListAction(watchSystem.value);
});

watch(
  () => availables?.data,
  () => {
    selectedRows.value = selectedRows.value.filter((row) =>
      availables.value?.data.some(
        (r) => r.id === row.id && r.status === "available"
      )
    );
  }
);

const toggleRows = (row) => {
  if (row.finish_booking) return;

  const index = selectedRows.value.findIndex((r) => r.id === row.id);
  if (index > -1) {
    selectedRows.value.splice(index, 1);
  } else {
    selectedRows.value.push(row);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

const calculateTotalNights = (checkinDate, checkoutDate) => {
  if (!checkinDate || !checkoutDate) return "-";
  const checkin = new Date(checkinDate);
  const checkout = new Date(checkoutDate);
  const diffTime = Math.abs(checkout - checkin);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const chooseTypeAction = async () => {
  if (product_type.value == "hotel") {
    const res = await hotelStore.getSimpleListAction();
    productNameArray.value = res.result.data;
  } else if (product_type.value == "entrance_ticket") {
    const res = await entranceStore.getSimpleListAction();
    productNameArray.value = res.result.data;
  }
};

const chooseNameAction = async () => {
  if (product_id.value && product_type.value == "hotel") {
    const res = await roomStore.getSimpleListAction({
      hotel_id: product_id.value,
    });
    productVariationArray.value = res.result.data;
  } else if (product_id.value && product_type.value == "entrance_ticket") {
    const res = await variationStore.getSimpleListAction({
      entrance_ticket_id: product_id.value,
    });
    productVariationArray.value = res.result.data;
  }
};

const changePage = async (url) => {
  await availableStore.getChangePage(
    url,
    showBookingTable
      ? Object.assign({}, watchSystem.value, {
          status: "available",
          product_type: "",
        })
      : watchSystem.value
  );
};

const openChangeStatusModal = (availability) => {
  selectedAvailability.value = { ...availability };
  changeStatusModal.value = true;
};

const closeChangeStatusModal = () => {
  changeStatusModal.value = false;
  selectedAvailability.value = null;
};

const openInfoDrawer = (item) => {
  selectedDetailItem.value = item;
  infoDrawerOpen.value = true;
};

const closeInfoDrawer = () => {
  infoDrawerOpen.value = false;
  selectedDetailItem.value = null;
};

const updateAction = async (action, id, quantity, res_comment = "") => {
  const frmData = new FormData();
  frmData.append("_method", "PUT");
  frmData.append("status", action);
  frmData.append("quantity", quantity);
  frmData.append("res_comment", res_comment);
  const res = await availableStore.updateAction(frmData, id);
  toast.success("Status changed successfully!");
  closeChangeStatusModal();
  await availableStore.getListAction(watchSystem.value);
};

const closeSearchAction = () => {
  product_id.value = "";
  variation_id.value = "";
  daterange.value = "";
  date.value = "";
  created_by.value = "";
  searchModal.value = false;
};

const searchActionHandler = async () => {
  searchModal.value = false;
  if (daterange.value != "" && date.value == "") {
    daterange.value = `${dateFormat(daterange.value[0])} , ${dateFormat(
      daterange.value[1]
    )}`;
  }
  if (date.value != "" && daterange.value == "") {
    date.value = dateFormat(date.value);
  }
  await availableStore.getListAction(watchSystem.value);
};

const getStatusBadgeClass = (statusValue) => {
  switch (statusValue) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "available":
      return "bg-green-100 text-green-700";
    case "unavailable":
      return "bg-red-100 text-red-700";
    case "other":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const copyAction = (data) => {
  console.log("data", data);
  if (data.ownerable_type == "App\\Models\\Hotel") {
    let text = `
${data.ownerable.name}
${data.variable.name}
${data.quantity} Rooms

${calculateTotalNights(data.checkin_date, data.checkout_date)} Nights

Check In: ${data.checkin_date}
Check Out: ${data.checkout_date}
Comment: ${data.commands || ""}
    `;

    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  }

  if (data.ownerable_type == "App\\Models\\EntranceTicket") {
    let text = `
${data.ownerable.name}
${data.variable.name}

${data.quantity} Adult ${data.child_qty ? data.child_qty + " Child" : ""} 

Date: ${data.checkin_date}
Comment: ${data.commands || ""}
    `;

    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  }
};

const showBookingDrawer = ref(false);

const openBookingTable = async () => {
  showBookingTable.value = true;
  await availableStore.getListAction(
    Object.assign({}, watchSystem.value, {
      status: "available",
      product_type: "",
    })
  );

  selectedRows.value = [];
};

const closeBookingTable = async () => {
  showBookingTable.value = false;
  showBookingDrawer.value = false;
  selectedRows.value = [];
  await availableStore.getListAction(
    Object.assign({}, watchSystem.value, {
      status: status.value,
      product_type: product_type.value,
    })
  );
};

const generateBooking = () => {
  console.log("Selected Available IDs:", selectedRows.value);
  showBookingDrawer.value = true;
  // showBookingTable.value = false;
};

// Filter only available items for booking table
const availableItems = computed(() => {
  return (
    availables.value?.data?.filter((item) => item.status === "available") || []
  );
});

onMounted(async () => {
  await availableStore.getListAction(watchSystem.value);
});
</script>

<template>
  <Layout :is_white="true">
    <div
      :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
      class="flex justify-start items-center transition-all duration-200 gap-2 text-sm pb-4 absolute top-6"
    >
      <p class="text-2xl md:text-3xl font-medium text-[#FF613c]">
        Availabilities
        <span class="w-2 h-2 bg-[#FF613c] rounded-full inline-block"></span>
      </p>
    </div>

    <!-- Booking Table View -->
    <div
      v-if="showBookingTable"
      class="bg-white/60 w-full rounded-lg shadow-sm"
    >
      <!-- Header -->
      <div
        class="p-3 md:p-4 border-b border-gray-200 sticky bg-white -top-6 z-20"
      >
        <div class="flex items-center justify-between gap-4">
          <h2 class="text-lg font-semibold text-gray-900">
            Select Items for Booking
          </h2>
          <div class="flex items-center gap-2">
            <button
              @click="generateBooking"
              class="appearance-none bg-[#FF613c] text-white text-xs px-4 py-3 rounded-full shadow cursor-pointer focus:outline-none"
              :disabled="selectedRows.length === 0"
              :class="selectedRows.length === 0 ? 'opacity-50' : ''"
            >
              Generate Booking ({{ selectedRows.length }})
            </button>
            <button
              @click="closeBookingTable"
              class="appearance-none bg-gray-500 text-white text-xs px-4 py-3 rounded-full shadow cursor-pointer focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto relative">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                class="px-2 md:px-4 py-2 text-left text-xs font-semibold text-gray-700"
              ></th>
              <th
                class="px-2 md:px-4 py-2 text-left text-xs font-semibold text-gray-700"
              >
                ID
              </th>
              <th
                class="px-2 md:px-4 py-2 text-left text-xs font-semibold text-gray-700"
              >
                Type
              </th>
              <th
                class="px-2 md:px-4 py-2 text-left text-xs font-semibold text-gray-700"
              >
                Status
              </th>
              <th
                class="px-2 md:px-4 whitespace-nowrap py-2 text-left text-xs font-semibold text-gray-700"
              >
                Date
              </th>
              <th
                class="px-2 md:px-4 py-2 text-left text-xs font-semibold text-gray-700"
              >
                Product
              </th>
              <th
                class="px-2 md:px-4 py-2 text-left text-xs font-semibold text-gray-700"
              >
                Variation
              </th>
              <th
                class="px-2 md:px-4 py-2 text-left text-xs font-semibold text-gray-700"
              >
                Quantity
              </th>
              <th
                class="px-2 md:px-4 whitespace-nowrap py-2 text-left text-xs font-semibold text-gray-700"
              >
                Created Date
              </th>
              <th
                class="px-2 md:px-4 py-2 text-left text-xs font-semibold text-gray-700"
              >
                Request By
              </th>
            </tr>
          </thead>
          <tbody v-if="!loading" class="divide-y divide-gray-200">
            <tr
              v-for="r in availableItems"
              :key="r.id"
              :class="
                selectedRows.includes(r) ? 'bg-[#FF613c]/20 text-white' : ''
              "
              @click="toggleRows(r)"
              class="transition-colors cursor-pointer"
            >
              <td class="px-4 py-4">
                <input
                  type="checkbox"
                  :value="r"
                  :disabled="r.finish_booking"
                  v-model="selectedRows"
                  class="w-4 h-4 rounded cursor-pointer border-gray-300 text-[#FF613c] focus:ring-[#FF613c]"
                />
              </td>
              <td class="px-2 md:px-4 py-4 text-sm text-gray-900">
                #{{ r.id }}
              </td>
              <td class="px-2 md:px-4 py-4 text-sm text-gray-900">
                <span
                  class="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100"
                  :class="
                    r.ownerable_type === 'App\\Models\\Hotel'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-orange-100 text-orange-800'
                  "
                >
                  {{
                    r.ownerable_type === "App\\Models\\Hotel"
                      ? "Hotel"
                      : "Ticket"
                  }}
                </span>
              </td>
              <td class="px-2 md:px-4 py-4">
                <p
                  :class="getStatusBadgeClass(r.status)"
                  class="inline-block px-2 py-1 rounded text-xs font-medium"
                >
                  {{ r.status }}
                </p>
              </td>
              <td class="px-2 md:px-4 py-4 min-w-[120px]">
                <div class="text-sm text-gray-700">
                  <div>{{ formatDate(r.checkin_date) }}</div>
                  <div
                    v-if="r.ownerable_type === 'App\\Models\\Hotel'"
                    class="text-xs text-gray-500"
                  >
                    to {{ formatDate(r.checkout_date) }}
                  </div>
                </div>
              </td>
              <td class="px-2 md:px-4 py-4">
                <div
                  class="text-sm text-gray-900 max-w-[150px] font-medium truncate"
                >
                  {{ r.ownerable?.name }}
                </div>
              </td>
              <td class="px-2 md:px-4 py-4">
                <div class="text-sm text-gray-900 max-w-[150px] truncate">
                  {{ r.variable?.name }}
                </div>
              </td>
              <td
                class="px-2 md:px-4 py-4 text-sm text-gray-900 whitespace-nowrap"
              >
                {{ r.quantity }}
                <span class="text-xs text-gray-500">{{
                  r.ownerable_type === "App\\Models\\Hotel" ? "Rooms" : "Adult"
                }}</span>
                <p
                  v-if="
                    r.ownerable_type !== 'App\\Models\\Hotel' && r.child_qty > 0
                  "
                  class="text-sm text-gray-900"
                >
                  {{ r.child_qty }}
                  <span class="text-xs text-gray-500">Child</span>
                </p>
              </td>
              <td class="px-2 md:px-4 py-4 text-sm text-gray-900">
                <p class="whitespace-nowrap">
                  {{ formattedDateTime(r.created_at) }}
                </p>
              </td>
              <td class="px-2 md:px-4 py-4">
                <div class="text-sm text-gray-900 max-w-[120px] truncate">
                  {{ r.created_by?.name }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="flex flex-col items-center gap-3">
            <div
              class="w-8 h-8 border-4 border-gray-200 border-t-[#ff613c] rounded-full animate-spin"
            ></div>
            <p class="text-xs text-gray-500">Loading...</p>
          </div>
        </div>

        <!-- Empty -->
        <div
          v-if="!loading && availableItems.length === 0"
          class="flex flex-col items-center justify-center py-12"
        >
          <BuildingOfficeIcon class="w-12 h-12 text-gray-300 mb-2" />
          <p class="text-sm text-gray-500">No available items found</p>
        </div>

        <!-- Pagination -->
        <div
          v-if="!loading && availables?.data?.length > 0"
          class="px-3 md:px-4 py-3 border-t border-gray-200"
        >
          <Pagination :data="availables" @change-page="changePage" />
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="bg-white/60 w-full rounded-lg shadow-sm">
      <!-- Filters -->
      <div
        class="p-3 md:p-4 border-b border-gray-200 sticky bg-white -top-6 z-20"
      >
        <div class="gap-4">
          <div
            class="flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div class="flex justify-between items-center w-full sm:w-auto">
              <div
                class="bg-gradient-to-r from-[#FF613c]/80 via-[#FF613c] to-[#f63307] rounded-full p-1 shadow-md w-full sm:w-auto"
              >
                <div class="flex justify-start gap-x-2 items-center gap-1">
                  <!-- Hotel -->
                  <div
                    @click="product_type = 'hotel'"
                    class="flex-1 px-3 py-2 rounded-full cursor-pointer transition-all duration-300 relative"
                    :class="
                      product_type == 'hotel'
                        ? 'bg-white/20'
                        : 'hover:bg-white/10'
                    "
                  >
                    <div class="flex items-center justify-center gap-2">
                      <p
                        class="text-xs font-medium text-white whitespace-nowrap"
                      >
                        Hotel
                      </p>
                    </div>
                    <div
                      v-if="product_type === 'hotel'"
                      class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-white rounded-full"
                    ></div>
                  </div>

                  <!-- Ticket -->
                  <div
                    @click="product_type = 'entrance_ticket'"
                    class="flex-1 px-3 py-2 rounded-full cursor-pointer transition-all duration-300 relative"
                    :class="
                      product_type === 'entrance_ticket'
                        ? 'bg-white/20'
                        : 'hover:bg-white/10'
                    "
                  >
                    <div class="flex items-center justify-center gap-2">
                      <p
                        class="text-xs font-medium whitespace-nowrap text-white"
                      >
                        Ticket
                      </p>
                    </div>
                    <div
                      v-if="product_type === 'entrance_ticket'"
                      class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-white rounded-full"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="flex justify-center items-center gap-x-2 w-full sm:w-auto"
            >
              <!-- Create Booking Button -->
              <button
                v-if="!authStore.isReservation"
                @click="openBookingTable"
                class="flex items-center gap-2 appearance-none bg-green-600 text-white text-xs px-4 py-3 rounded-full shadow cursor-pointer focus:outline-none hover:bg-green-700 transition-colors"
              >
                <PlusIcon class="w-4 h-4" />
                Create Booking
              </button>

              <!-- Status Dropdown -->
              <div class="relative flex-1 sm:flex-initial">
                <select
                  v-model="status"
                  class="appearance-none bg-[#FF613c] text-white text-xs px-4 py-3 pr-8 rounded-full shadow cursor-pointer focus:outline-none w-full"
                >
                  <option
                    :value="statusOption.id"
                    v-for="statusOption in statusOptions"
                    :key="statusOption.id"
                  >
                    {{ statusOption.name }}
                  </option>
                </select>
                <svg
                  class="w-4 h-4 text-white absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              <!-- Order Dropdown -->
              <div class="relative flex-1 sm:flex-initial">
                <select
                  v-model="order_by"
                  class="appearance-none bg-[#FF613c] text-white text-xs px-4 py-3 pr-8 rounded-full shadow cursor-pointer focus:outline-none w-full"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
                <svg
                  class="w-4 h-4 text-white absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              <!-- refresh button -->
              <button
                @click="searchActionHandler"
                class="flex items-center gap-2 px-4 py-3 text-xs text-white bg-[#FF613c] rounded-full cursor-pointer"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto relative">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                class="px-2 md:px-4 py-2 text-left text-xs font-semibold text-gray-700"
              >
                ID
              </th>
              <th
                class="px-2 md:px-4 py-2 text-left text-xs font-semibold text-gray-700"
              >
                Status
              </th>
              <th
                class="px-2 md:px-4 whitespace-nowrap py-2 text-left text-xs font-semibold text-gray-700"
              >
                {{ product_type == "hotel" ? "Checkin Date" : "Service Date" }}
              </th>
              <th
                class="px-2 md:px-4 py-2 text-left text-xs font-semibold text-gray-700"
              >
                {{ product_type == "hotel" ? "Hotel" : "Attraction" }}
              </th>
              <th
                class="px-2 md:px-4 py-2 text-left text-xs font-semibold text-gray-700"
              >
                {{ product_type == "hotel" ? "Room" : "Ticket" }} Type
              </th>
              <th
                class="px-2 md:px-4 py-2 text-left text-xs font-semibold text-gray-700"
              >
                {{ product_type == "hotel" ? "Room" : "Ticket" }}
              </th>

              <th
                class="px-2 md:px-4 whitespace-nowrap py-2 text-left text-xs font-semibold text-gray-700"
              >
                Create Date
              </th>
              <th
                class="px-2 md:px-4 py-2 text-left text-xs font-semibold text-gray-700"
              >
                Request By
              </th>
              <th
                class="px-2 md:px-4 py-2 text-right text-xs font-semibold text-gray-700"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody v-if="!loading" class="divide-y divide-gray-200">
            <template v-for="r in availables?.data" :key="r.id">
              <tr class="hover:bg-gray-50 transition-colors relative">
                <!-- ID -->
                <td class="px-2 md:px-4 py-4 text-sm text-gray-900">
                  <div class="flex items-center gap-2">#{{ r.id }}</div>
                </td>

                <!-- Status -->
                <td class="px-2 md:px-4 py-4">
                  <p
                    :class="getStatusBadgeClass(r.status)"
                    class="inline-block px-2 py-1 rounded text-xs font-medium"
                  >
                    {{ r.status }}
                  </p>
                  <p v-if="r.updated_by" class="text-xs text-gray-500 pt-1">
                    by {{ r.updated_by?.name }}
                  </p>
                </td>

                <!-- Checkin/Service Date -->
                <td class="px-2 md:px-4 py-4 min-w-[120px]">
                  <div v-if="!r.date" class="text-sm text-gray-700">
                    <div>{{ formatDate(r.checkin_date) }}</div>
                    <div
                      v-if="product_type == 'hotel'"
                      class="text-xs text-gray-500"
                    >
                      to {{ formatDate(r.checkout_date) }}
                    </div>
                  </div>
                </td>

                <!-- Product -->
                <td class="px-2 md:px-4 py-4">
                  <div
                    class="text-sm text-gray-900 max-w-[150px] font-medium truncate"
                  >
                    {{ r.ownerable?.name }}
                  </div>
                </td>

                <!-- Variation -->
                <td class="px-2 md:px-4 py-4">
                  <div class="text-sm text-gray-900 max-w-[150px] truncate">
                    {{ r.variable?.name }}
                  </div>
                </td>

                <!-- Quantity -->
                <td
                  class="px-2 md:px-4 py-4 text-sm text-gray-900 whitespace-nowrap"
                >
                  {{ r.quantity }}
                  <span class="text-xs text-gray-500">{{
                    product_type == "hotel" ? "Rooms" : "Adult"
                  }}</span>

                  <p class="text-sm text-gray-900">
                    {{
                      product_type != "hotel" && r.child_qty > 0
                        ? `${r.child_qty}`
                        : ""
                    }}
                    <span class="text-xs text-gray-500">{{
                      product_type != "hotel" && r.child_qty > 0 ? "Child" : ""
                    }}</span>
                    {{
                      product_type == "hotel"
                        ? calculateTotalNights(
                            r.checkin_date,
                            r.checkout_date
                          ) + ""
                        : ""
                    }}
                    <span class="text-xs text-gray-500">{{
                      product_type == "hotel" ? "nights" : ""
                    }}</span>
                  </p>
                </td>

                <!-- Create Date -->
                <td class="px-2 md:px-4 py-4 text-sm text-gray-900">
                  <p class="whitespace-nowrap">
                    {{ formattedDateTime(r.created_at) }}
                  </p>
                  <span class="text-xs text-gray-500"
                    >at {{ formattedDateTime(r.updated_at) }}</span
                  >
                </td>

                <!-- Created By -->
                <td class="px-2 md:px-4 py-4">
                  <div class="text-sm text-gray-900 max-w-[120px] truncate">
                    {{ r.created_by?.name }}
                  </div>
                </td>

                <!-- Actions -->
                <td class="px-2 md:px-4 py-4">
                  <div class="flex items-center justify-end gap-1">
                    <div class="flex items-center gap-1">
                      <button
                        v-if="authStore.isSuperAdmin || authStore.isReservation"
                        @click="openChangeStatusModal(r)"
                        class="px-2 md:px-3 py-2 text-xs text-white bg-[#FF613c] rounded-lg transition-all duration-200 hover:bg-[#e55139] hover:shadow-md active:scale-95"
                      >
                        Change
                      </button>
                      <button
                        @click="openInfoDrawer(r)"
                        class="p-1.5 bg-blue-100 text-blue-600 rounded-lg transition-all duration-200 hover:bg-blue-200 hover:shadow-md active:scale-95"
                        title="View Details"
                      >
                        <InformationCircleIcon class="w-5 h-5" />
                      </button>
                      <button
                        @click="copyAction(r)"
                        class="p-1.5 bg-orange-100 text-orange-600 rounded-lg transition-all duration-200 hover:bg-orange-200 hover:shadow-md active:scale-95"
                        title="View Details"
                      >
                        <DocumentDuplicateIcon class="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Comment Row - Only show if status is 'other' and res_comment exists -->
              <tr
                v-if="r.status === 'other' || r.res_comment || r.commands"
                class="bg-gray-50"
              >
                <td
                  :colspan="product_type == 'hotel' ? 10 : 9"
                  class="pr-4 pl-16 py-3 border-t-2 border-gray-200"
                  style="box-shadow: inset 0 8px 6px -6px rgba(0, 0, 0, 0.1)"
                >
                  <div class="space-y-2">
                    <!-- Sale Message -->
                    <div v-if="r.commands" class="flex items-center gap-2">
                      <div class="flex-shrink-0">
                        <div
                          class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold"
                        >
                          {{ r.created_by?.name.charAt(0) }}
                        </div>
                      </div>
                      <div class="flex-1">
                        <div
                          class="bg-blue-100 flex justify-start items-center gap-x-4 rounded-lg shadow-sm px-3 py-2 border border-gray-200"
                        >
                          <div
                            class="text-xs font-semibold bg-blue-300 text-blue-600 px-2 py-1 rounded-lg"
                          >
                            {{ r.created_by?.name }}
                          </div>
                          <div class="text-sm text-gray-700">
                            {{ r.commands }}
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Reservation Message -->
                    <div v-if="r.res_comment" class="flex items-center gap-2">
                      <div class="flex-shrink-0">
                        <div
                          class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-semibold"
                        >
                          {{ r.updated_by?.name.charAt(0) }}
                        </div>
                      </div>
                      <div class="flex-1">
                        <div
                          class="bg-orange-100 flex justify-start items-center gap-x-4 rounded-lg shadow-sm px-3 py-2 border border-gray-200"
                        >
                          <div
                            class="text-xs font-semibold bg-orange-300 text-orange-600 px-2 py-1 rounded-lg"
                          >
                            {{ r.updated_by?.name }}
                          </div>
                          <div class="text-sm text-gray-700">
                            {{ r.res_comment }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="flex flex-col items-center gap-3">
            <div
              class="w-8 h-8 border-4 border-gray-200 border-t-[#ff613c] rounded-full animate-spin"
            ></div>
            <p class="text-xs text-gray-500">Loading...</p>
          </div>
        </div>

        <!-- Empty -->
        <div
          v-if="!loading && (!availables?.data || availables.data.length === 0)"
          class="flex flex-col items-center justify-center py-12"
        >
          <BuildingOfficeIcon class="w-12 h-12 text-gray-300 mb-2" />
          <p class="text-sm text-gray-500">No availabilities found</p>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="!loading && availables?.data?.length > 0"
        class="px-3 md:px-4 py-3 border-t border-gray-200"
      >
        <Pagination :data="availables" @change-page="changePage" />
      </div>
    </div>

    <!-- Filter Modal -->
    <Modal :isOpen="searchModal" @closeModal="closeSearchAction">
      <DialogPanel
        class="w-full max-w-lg transform rounded-lg bg-white p-5 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle as="h3" class="text-lg font-medium text-gray-900 mb-4">
          Advanced Filters
        </DialogTitle>

        <div class="space-y-3">
          <!-- Product Name -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <v-select
              v-model="product_id"
              class="style-chooser w-full"
              :options="productNameArray ?? []"
              @option:selected="chooseNameAction"
              label="name"
              :clearable="true"
              :reduce="(d) => d.id"
              placeholder="Select product"
            ></v-select>
          </div>

          <!-- Variation -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Variation
            </label>
            <v-select
              v-model="variation_id"
              class="style-chooser w-full"
              :options="productVariationArray ?? []"
              label="name"
              :clearable="true"
              :reduce="(d) => d.id"
              placeholder="Select variation"
            ></v-select>
          </div>

          <!-- Date Range (Hotel) -->
          <div v-if="product_type == 'hotel'">
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <VueDatePicker
              v-model="daterange"
              :format="'yyyy-MM-dd'"
              range
              placeholder="Select date range"
            />
          </div>

          <!-- Date (Attraction) -->
          <div v-if="product_type != 'hotel'">
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Date
            </label>
            <VueDatePicker
              v-model="date"
              :format="'yyyy-MM-dd'"
              placeholder="Select date"
            />
          </div>

          <!-- Actions -->
          <div
            class="flex items-center justify-end gap-2 pt-4 border-t border-gray-200"
          >
            <button
              @click="closeSearchAction"
              class="px-4 py-2 text-xs font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Clear & Close
            </button>
            <button
              @click="searchActionHandler"
              class="px-4 py-2 text-xs font-medium text-white bg-[#ff613c] rounded hover:bg-[#ff4d28] transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </DialogPanel>
    </Modal>

    <!-- Change Status Modal -->
    <Modal :isOpen="changeStatusModal" @closeModal="closeChangeStatusModal">
      <DialogPanel
        class="w-full max-w-xl transform rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
        >
          <AdjustmentsHorizontalIcon class="w-6 h-6 text-[#FF613c]" />
          Change Status
        </DialogTitle>

        <div v-if="selectedAvailability" class="space-y-4">
          <!-- Status Options -->
          <div class="space-y-2">
            <button
              @click="
                updateAction(
                  'pending',
                  selectedAvailability.id,
                  selectedAvailability.quantity
                )
              "
              class="w-full flex items-center justify-between px-4 py-3 border-2 border-yellow-200 rounded-lg hover:bg-yellow-50 transition-all duration-200 group"
              :class="
                selectedAvailability.status === 'pending'
                  ? 'bg-yellow-50 border-yellow-400'
                  : ''
              "
            >
              <div class="flex items-center gap-3">
                <div
                  class="p-2 bg-yellow-100 rounded-full group-hover:bg-yellow-200 transition-colors"
                >
                  <ExclamationTriangleIcon class="w-5 h-5 text-yellow-600" />
                </div>
                <div class="text-left">
                  <p class="text-sm font-medium text-gray-900">Pending</p>
                  <p class="text-xs text-gray-500">Awaiting</p>
                </div>
              </div>
              <CheckIcon
                v-if="selectedAvailability.status === 'pending'"
                class="w-5 h-5 text-yellow-600"
              />
            </button>

            <button
              @click="
                updateAction(
                  'available',
                  selectedAvailability.id,
                  selectedAvailability.quantity
                )
              "
              class="w-full flex items-center justify-between px-4 py-3 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-all duration-200 group"
              :class="
                selectedAvailability.status === 'available'
                  ? 'bg-green-50 border-green-400'
                  : ''
              "
            >
              <div class="flex items-center gap-3">
                <div
                  class="p-2 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors"
                >
                  <CheckIcon class="w-5 h-5 text-green-600" />
                </div>
                <div class="text-left">
                  <p class="text-sm font-medium text-gray-900">Available</p>
                  <p class="text-xs text-gray-500">Ready to book</p>
                </div>
              </div>
              <CheckIcon
                v-if="selectedAvailability.status === 'available'"
                class="w-5 h-5 text-green-600"
              />
            </button>

            <button
              @click="
                updateAction(
                  'unavailable',
                  selectedAvailability.id,
                  selectedAvailability.quantity
                )
              "
              class="w-full flex items-center justify-between px-4 py-3 border-2 border-red-200 rounded-lg hover:bg-red-50 transition-all duration-200 group"
              :class="
                selectedAvailability.status === 'unavailable'
                  ? 'bg-red-50 border-red-400'
                  : ''
              "
            >
              <div class="flex items-center gap-3">
                <div
                  class="p-2 bg-red-100 rounded-full group-hover:bg-red-200 transition-colors"
                >
                  <XMarkIcon class="w-5 h-5 text-red-600" />
                </div>
                <div class="text-left">
                  <p class="text-sm font-medium text-gray-900">Unavailable</p>
                  <p class="text-xs text-gray-500">Not available</p>
                </div>
              </div>
              <CheckIcon
                v-if="selectedAvailability.status === 'unavailable'"
                class="w-5 h-5 text-red-600"
              />
            </button>

            <button
              @click="selectedAvailability.status = 'other'"
              class="w-full flex items-center justify-between px-4 py-3 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-all duration-200 group"
              :class="
                selectedAvailability.status === 'other'
                  ? 'bg-purple-50 border-purple-400'
                  : ''
              "
            >
              <div class="flex items-center gap-3">
                <div
                  class="p-2 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors"
                >
                  <InformationCircleIcon class="w-5 h-5 text-purple-600" />
                </div>
                <div class="text-left">
                  <p class="text-sm font-medium text-gray-900">Other</p>
                  <p class="text-xs text-gray-500">Other Recommendation</p>
                </div>
              </div>
              <CheckIcon
                v-if="selectedAvailability.status === 'other'"
                class="w-5 h-5 text-purple-600"
              />
            </button>
            <textarea
              name=""
              id=""
              class="bg-purple-50 border border-purple-200 w-full focus:outline-none rounded-lg p-3 text-sm"
              rows="4"
              v-model="selectedAvailability.res_comment"
              v-if="selectedAvailability.status === 'other'"
              placeholder="Enter other recommendation"
            ></textarea>
            <button
              @click="
                updateAction(
                  'other',
                  selectedAvailability.id,
                  selectedAvailability.quantity,
                  selectedAvailability.res_comment
                )
              "
              v-if="
                selectedAvailability.status === 'other' &&
                selectedAvailability.res_comment
              "
              class="flex justify-center items-center w-full text-sm gap-x-4 py-2 rounded-full px-3 bg-purple-600 text-white"
            >
              <CheckIcon class="w-5 h-5 text-white" />
              Save Recommendation
            </button>
          </div>

          <!-- Cancel Button -->
          <div class="pt-4 border-t border-gray-200">
            <button
              @click="closeChangeStatusModal"
              class="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogPanel>
    </Modal>

    <!-- Info Drawer -->
    <Teleport to="body">
      <div
        v-if="infoDrawerOpen"
        class="fixed inset-0 z-50 overflow-hidden"
        @click.self="closeInfoDrawer"
      >
        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
          @click="closeInfoDrawer"
        ></div>

        <!-- Drawer -->
        <div
          class="absolute right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto"
          :class="infoDrawerOpen ? 'translate-x-0' : 'translate-x-full'"
        >
          <div class="p-6">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
              <h3
                class="text-xl font-semibold text-gray-900 flex items-center gap-2"
              >
                <InformationCircleIcon class="w-6 h-6 text-[#FF613c]" />
                Details
              </h3>
              <button
                @click="closeInfoDrawer"
                class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon class="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <!-- Content -->
            <div v-if="selectedDetailItem" class="space-y-4">
              <!-- Name -->
              <div class="border-b border-gray-200 pb-3">
                <p class="text-xs text-gray-500 mb-1">
                  {{ product_type == "hotel" ? "Hotel" : "Attraction" }}
                </p>
                <p class="text-sm font-medium text-gray-900">
                  {{ selectedDetailItem.ownerable?.name }}
                </p>
              </div>

              <!-- Type -->
              <div class="border-b border-gray-200 pb-3">
                <p class="text-xs text-gray-500 mb-1">
                  {{ product_type == "hotel" ? "Room" : "ticket" }}
                </p>
                <p class="text-sm font-medium text-gray-900">
                  {{ selectedDetailItem.variable?.name }}
                </p>
              </div>

              <!-- Comment -->
              <div class="border-b border-gray-200 pb-3">
                <p class="text-xs text-gray-500 mb-2">Comment</p>
                <div
                  v-if="selectedDetailItem.commands"
                  class="bg-gray-50 rounded-lg p-3"
                >
                  <p class="text-sm text-gray-700 whitespace-pre-wrap">
                    {{ selectedDetailItem.commands }}
                  </p>
                </div>
                <p v-else class="text-sm text-gray-400 italic">No comment</p>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <!-- Check-in Date -->
                <div
                  class="border-b border-gray-200 pb-3"
                  :class="product_type != 'hotel' ? 'col-span-2' : ''"
                >
                  <p class="text-xs text-gray-500 mb-1">
                    {{
                      product_type === "hotel"
                        ? "Check-in Date"
                        : "Service Date"
                    }}
                  </p>
                  <p class="text-sm font-medium text-gray-900">
                    {{ formatDate(selectedDetailItem.checkin_date) }}
                  </p>
                </div>

                <!-- Check-out Date (for hotels only) -->
                <div
                  v-if="product_type === 'hotel'"
                  class="border-b border-gray-200 pb-3"
                >
                  <p class="text-xs text-gray-500 mb-1">Check-out Date</p>
                  <p class="text-sm font-medium text-gray-900">
                    {{ formatDate(selectedDetailItem.checkout_date) }}
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <!-- Qty & Night -->
                <div class="border-b border-gray-200 pb-3">
                  <p class="text-xs text-gray-500 mb-1">
                    {{
                      product_type === "hotel"
                        ? "Room Quantity"
                        : "Adult Quantity"
                    }}
                  </p>
                  <p class="text-sm font-medium text-gray-900">
                    {{ selectedDetailItem.quantity }}
                    {{ product_type == "hotel" ? "Rooms" : "Adult" }}
                  </p>
                </div>

                <!-- Check-out Date (for hotels only) -->
                <div class="border-b border-gray-200 pb-3">
                  <p class="text-xs text-gray-500 mb-1">
                    {{ product_type == "hotel" ? "Nights" : "Child" }}
                  </p>
                  <p class="text-sm font-medium text-gray-900">
                    {{
                      product_type == "hotel"
                        ? calculateTotalNights(
                            selectedDetailItem.checkin_date,
                            selectedDetailItem.checkout_date
                          )
                        : selectedDetailItem.child_qty
                    }}
                  </p>
                </div>
              </div>

              <!-- Customer Detail -->
              <div
                v-if="
                  selectedDetailItem.customer_name !== null ||
                  selectedDetailItem.customer_phnumber !== null
                "
                class="grid grid-cols-2 gap-2"
              >
                <div class="border-b border-gray-200 pb-3">
                  <p class="text-xs text-gray-500 mb-1">Customer Name</p>
                  <p class="text-sm font-medium text-gray-900">
                    {{ selectedDetailItem.customer_name ?? "-" }}
                  </p>
                </div>
                <div class="border-b border-gray-200 pb-3">
                  <p class="text-xs text-gray-500 mb-1">
                    Customer Phone Number
                  </p>
                  <p class="text-sm font-medium text-gray-900">
                    {{ selectedDetailItem.customer_phnumber ?? "-" }}
                  </p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="space-y-3 pt-4">
                <!-- Change Status Button -->
                <button
                  v-if="authStore.isSuperAdmin || authStore.isReservation"
                  @click="
                    openChangeStatusModal(selectedDetailItem);
                    closeInfoDrawer();
                  "
                  class="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-[#FF613c] rounded-lg transition-all duration-200 hover:bg-[#e55139] hover:shadow-md active:scale-95"
                >
                  <AdjustmentsHorizontalIcon class="w-5 h-5" />
                  Change Status
                </button>

                <button
                  v-if="
                    authStore.isSuperAdmin ||
                    authStore.user?.id == selectedDetailItem.created_by.id
                  "
                  @click="
                    deleteAction(selectedDetailItem.id);
                    closeInfoDrawer();
                  "
                  class="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-red-600 rounded-lg transition-all duration-200 hover:bg-red-700 hover:shadow-md active:scale-95"
                >
                  <TrashIcon class="w-5 h-5" />
                  Delete
                </button>

                <!-- Call Button (Disabled) -->
                <button
                  disabled
                  class="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-400 bg-gray-200 rounded-lg cursor-not-allowed opacity-60"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Call (Coming Soon)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Booking Drawer -->
    <Teleport to="body">
      <div
        v-if="showBookingDrawer"
        class="fixed inset-0 z-50 overflow-hidden"
        @click.self="showBookingDrawer = false"
      >
        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
          @click="showBookingDrawer = false"
        ></div>

        <!-- Drawer -->
        <div
          class="absolute right-0 top-0 h-full w-full sm:w-[50%] bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto"
          :class="showBookingDrawer ? 'translate-x-0' : 'translate-x-full'"
        >
          <div class="p-6">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
              <h3
                class="text-xl font-semibold text-gray-900 flex items-center gap-2"
              >
                <InformationCircleIcon class="w-6 h-6 text-[#FF613c]" />
                Convert to Booking
              </h3>
              <button
                @click="showBookingDrawer = false"
                class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon class="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <!-- Content -->
            <div class="px-4">
              <MainPage
                :selectedRows="selectedRows"
                :cancel="closeBookingTable"
              />
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </Layout>
</template>

<style scoped>
/* Minimal scrollbar */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f9fafb;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Drawer scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f9fafb;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
