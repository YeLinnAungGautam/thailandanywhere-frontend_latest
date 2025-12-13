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
const hoveredRowId = ref(null);
const hoveredCommentId = ref(null);
const popupPosition = ref({ top: 0, left: 0 });

const product_type = ref("hotel");
const product_id = ref("");
const variation_id = ref("");
const daterange = ref("");
const date = ref("");
const status = ref("");
const order_by = ref("asc");
const created_by = ref("");

const productNameArray = ref([]);
const productVariationArray = ref([]);

const errors = ref(null);

const statusOptions = [
  { id: "", name: "All" },
  { id: "pending", name: "Pending" },
  { id: "available", name: "Available" },
  { id: "unavailable", name: "Unavailable" },
];

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
  if (product_type.value != "") {
    result.product_type = product_type.value;
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
  if (status.value != "") {
    result.status = status.value;
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
  await availableStore.getChangePage(url);
};

const openChangeStatusModal = (availability) => {
  selectedAvailability.value = { ...availability };
  changeStatusModal.value = true;
};

const closeChangeStatusModal = () => {
  changeStatusModal.value = false;
  selectedAvailability.value = null;
};

const updateAction = async (action, id, quantity) => {
  const frmData = new FormData();
  frmData.append("_method", "PUT");
  frmData.append("status", action);
  frmData.append("quantity", quantity);
  const res = await availableStore.updateAction(frmData, id);
  toast.success("Status changed successfully!");
  closeChangeStatusModal();
  await availableStore.getListAction(watchSystem.value);
};

const deleteAction = async (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ff613c",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await availableStore.deleteAction(id);
        if (res.result) {
          toast.success("Deleted successfully");
          await availableStore.getListAction(watchSystem.value);
        }
      } catch (error) {
        if (error.response.data.errors) {
          errors.value = error.response.data.errors;
        }
        toast.error(error.response.data.message);
      }
    }
  });
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
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const activeFiltersCount = computed(() => {
  let count = 0;
  if (product_id.value) count++;
  if (variation_id.value) count++;
  if (daterange.value) count++;
  if (date.value) count++;
  if (created_by.value) count++;
  return count;
});

const handleCommentHover = (event, rowId) => {
  hoveredCommentId.value = rowId;
  const rect = event.currentTarget.getBoundingClientRect();
  popupPosition.value = {
    top: rect.top + window.scrollY - 10,
    left: rect.left + rect.width + 10,
  };
};

const handleCommentLeave = () => {
  hoveredCommentId.value = null;
};

const getCurrentComment = computed(() => {
  if (!hoveredCommentId.value) return null;
  const row = availables.value?.data?.find(
    (r) => r.id === hoveredCommentId.value
  );
  return row?.commands || null;
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
      <p class="text-3xl font-medium text-[#FF613c]">
        Availabilities
        <span class="w-2 h-2 bg-[#FF613c] rounded-full inline-block"></span>
      </p>
    </div>
    <!-- Main Content -->
    <div class="bg-white/60 rounded-lg shadow-sm">
      <!-- Filters -->
      <div class="p-4 border-b border-gray-200">
        <div class="gap-4">
          <div class="flex items-center justify-between gap-4">
            <div class="flex justify-between items-center">
              <div
                class="bg-gradient-to-r from-[#FF613c]/80 via-[#FF613c] to-[#f63307] rounded-full p-1 shadow-md"
              >
                <div class="flex justify-start gap-x-2 items-center gap-1">
                  <!-- Prove Booking -->
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

            <div class="flex justify-center items-center gap-x-2">
              <!-- Sent/Not Sent Dropdown -->
              <div class="relative">
                <select
                  v-model="status"
                  class="appearance-none bg-[#FF613c] text-white text-xs px-4 py-3 pr-8 rounded-full shadow cursor-pointer focus:outline-none"
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
              <div class="relative">
                <select
                  v-model="order_by"
                  class="appearance-none bg-[#FF613c] text-white text-xs px-4 py-3 pr-8 rounded-full shadow cursor-pointer focus:outline-none"
                >
                  <option value="asc">Asscending</option>
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
                class="px-4 py-2 text-left text-xs font-semibold text-gray-700"
              >
                ID
              </th>
              <th
                class="px-4 py-2 text-left text-xs font-semibold text-gray-700"
              >
                Status
              </th>
              <th
                class="px-4 whitespace-nowrap py-2 text-left text-xs font-semibold text-gray-700"
              >
                Create Date
              </th>
              <th
                class="px-4 py-2 text-left text-xs font-semibold text-gray-700"
              >
                Product
              </th>
              <th
                class="px-4 py-2 text-left text-xs font-semibold text-gray-700"
              >
                {{ product_type == "hotel" ? "Room" : "Ticket" }} Type
              </th>
              <th
                class="px-4 py-2 text-left text-xs font-semibold text-gray-700"
              >
                {{ product_type == "hotel" ? "Room" : "Ticket" }}
              </th>
              <th
                class="px-4 py-2 text-left text-xs font-semibold text-gray-700"
              >
                {{ product_type == "hotel" ? "Checkin Date" : "Service Date" }}
              </th>
              <th
                class="px-4 py-2 text-left text-xs font-semibold text-gray-700"
              >
                Comment
              </th>
              <th
                class="px-4 py-2 text-left text-xs font-semibold text-gray-700"
              >
                Request By
              </th>
              <th
                class="px-4 py-2 text-right text-xs font-semibold text-gray-700"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody v-if="!loading" class="divide-y divide-gray-200">
            <tr
              v-for="r in availables?.data"
              :key="r.id"
              class="hover:bg-gray-50 transition-colors relative"
            >
              <!-- ID -->
              <td class="px-4 py-4 text-sm text-gray-900">
                <div class="flex items-center gap-2">#{{ r.id }}</div>
              </td>

              <!-- Status -->
              <td class="px-4 py-4">
                <span
                  :class="getStatusBadgeClass(r.status)"
                  class="inline-block px-2 py-1 rounded text-sm font-medium"
                >
                  {{ r.status }}
                </span>
              </td>

              <!-- Quantity -->
              <td class="px-4 py-4 text-sm text-gray-900">
                {{ formatDate(r.created_at.split("T")[0]) }}
              </td>

              <!-- Product -->
              <td class="px-4 py-4">
                <div class="text-sm text-gray-900 w-[150px] font-medium">
                  {{ r.ownerable?.name }}
                </div>
              </td>

              <!-- Variation -->
              <td class="px-4 py-4">
                <div class="text-sm text-gray-900 w-[150px]">
                  {{ r.variable?.name }}
                </div>
              </td>

              <!-- Quantity -->
              <td class="px-4 py-4 text-sm text-gray-900">
                {{ r.quantity }}
                {{ product_type == "hotel" ? "Rooms" : "Tickets" }}
              </td>

              <!-- Date -->
              <td class="px-4 py-4">
                <div v-if="!r.date" class="text-sm text-gray-700">
                  <div>{{ formatDate(r.checkin_date) }}</div>
                  <div v-if="product_type == 'hotel'">
                    {{ formatDate(r.checkout_date) }}
                  </div>
                </div>
              </td>

              <!-- Comment -->
              <td
                v-if="r.commands"
                class="px-2 py-2 w-[100px] cursor-pointer text-gray-900 relative"
                @mouseenter="handleCommentHover($event, r.id)"
                @mouseleave="handleCommentLeave"
              >
                <p
                  class="bg-gray-300 text-sm text-gray-500 px-2 py-1 rounded-lg line-clamp-1"
                >
                  {{ r.commands }}
                </p>
              </td>
              <td
                v-if="!r.commands"
                class="px-2 py-2 w-[100px] cursor-pointer text-gray-900 relative"
              ></td>

              <!-- Created By -->
              <td class="px-4 py-4">
                <div class="text-sm text-gray-900">
                  {{ r.created_by?.name }}
                </div>
              </td>

              <!-- Actions -->
              <td class="px-4 py-4">
                <div class="flex items-center justify-end gap-1">
                  <div
                    v-if="authStore.isReservation || authStore.isSuperAdmin"
                    class="flex items-center gap-1"
                  >
                    <button
                      v-if="authStore.isSuperAdmin"
                      @click="openChangeStatusModal(r)"
                      class="px-3 py-2 text-xs text-white bg-[#FF613c] rounded-lg transition-all duration-200 hover:bg-[#e55139] hover:shadow-md active:scale-95"
                    >
                      Change
                    </button>
                    <button
                      v-if="authStore.isSuperAdmin"
                      @click.prevent="deleteAction(r.id)"
                      class="p-1.5 bg-red-100 text-red-600 rounded-lg transition-all duration-200 hover:bg-red-200 hover:shadow-md active:scale-95"
                      title="Delete"
                    >
                      <TrashIcon class="w-5 h-5" />
                    </button>
                  </div>
                  <div
                    v-if="!authStore.isReservation && !authStore.isSuperAdmin"
                    class="text-[10px] text-red-600 px-2 py-1 bg-red-50 rounded"
                  >
                    No Access
                  </div>
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
          v-if="!loading && (!availables?.data || availables.data.length === 0)"
          class="flex flex-col items-center justify-center py-12"
        >
          <BuildingOfficeIcon class="w-12 h-12 text-gray-300 mb-2" />
          <p class="text-sm text-gray-500">No availabilities found</p>
        </div>

        <!-- Comment Hover Popup -->
        <Teleport to="body">
          <div
            v-if="hoveredCommentId && getCurrentComment"
            :style="{
              position: 'fixed',
              top: popupPosition.top + 'px',
              left: popupPosition.left + 'px',
              zIndex: 9999,
            }"
            class="bg-gray-800 text-white px-4 py-3 rounded-lg shadow-2xl max-w-md animate-fadeIn"
          >
            <div class="flex items-start gap-2">
              <ChatBubbleLeftIcon
                class="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5"
              />
              <div>
                <p class="text-xs font-semibold text-gray-200 mb-1">Comment:</p>
                <p class="text-sm text-white whitespace-pre-wrap">
                  {{ getCurrentComment }}
                </p>
              </div>
            </div>
            <div
              class="absolute -left-2 top-4 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-gray-800"
            ></div>
          </div>
        </Teleport>
      </div>

      <!-- Pagination -->
      <div
        v-if="!loading && availables?.data?.length > 0"
        class="px-4 py-3 border-t border-gray-200"
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
        class="w-full max-w-md transform rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all"
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
            <p class="text-sm font-medium text-gray-700 mb-3">
              Select New Status:
            </p>

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
                  <p class="text-xs text-gray-500">Awaiting review</p>
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
                  <p class="text-xs text-gray-500">Ready to use</p>
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
          </div>

          <!-- Cancel Button -->
          <div class="pt-4 border-t border-gray-200">
            <button
              @click="closeChangeStatusModal"
              class="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogPanel>
    </Modal>
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

/* Fade in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}
</style>
