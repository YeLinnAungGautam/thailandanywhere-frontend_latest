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
const hoveredRowId = ref(null);
const popupPosition = ref({ top: 0, left: 0 });

const product_type = ref("hotel");
const product_id = ref("");
const variation_id = ref("");
const daterange = ref("");
const date = ref("");
const status = ref("");
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
  await availableStore.getListAction(watchSystem.value);
});

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

const updateAction = async (action, id, quantity) => {
  const frmData = new FormData();
  frmData.append("_method", "PUT");
  frmData.append("status", action);
  frmData.append("quantity", quantity);
  const res = await availableStore.updateAction(frmData, id);
  toast.success("Status changed successfully!");
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

const openSearchModal = async () => {
  searchModal.value = true;
  await chooseTypeAction();
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

const setStatus = (statusValue) => {
  status.value = statusValue;
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

const handleRowHover = (event, rowId) => {
  hoveredRowId.value = rowId;
  const rect = event.currentTarget.getBoundingClientRect();
  popupPosition.value = {
    top: rect.top + window.scrollY,
    left: rect.left + 10,
  };
};

const handleRowLeave = () => {
  hoveredRowId.value = null;
};

const getCurrentCommand = computed(() => {
  if (!hoveredRowId.value) return null;
  const row = availables.value?.data?.find((r) => r.id === hoveredRowId.value);
  return row?.commands || null;
});

onMounted(async () => {
  await availableStore.getListAction(watchSystem.value);
});
</script>

<template>
  <Layout>
    <!-- Header -->
    <div class="mb-5">
      <h3 class="text-2xl font-medium text-gray-800">Availabilities</h3>
      <p class="text-sm text-gray-500 mt-1">
        Manage product availability schedules
      </p>
    </div>

    <!-- Main Content -->
    <div class="bg-white/60 rounded-lg shadow-sm">
      <!-- Filters -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <!-- Product Type -->
            <div
              class="flex items-center gap-2 border border-gray-300 rounded p-1"
            >
              <button
                @click="product_type = 'hotel'"
                :class="[
                  'px-3 py-1 text-xs font-medium rounded transition-all',
                  product_type == 'hotel'
                    ? 'bg-[#ff613c] text-white'
                    : 'text-gray-600 hover:bg-gray-100',
                ]"
              >
                Hotels
              </button>
              <button
                @click="product_type = 'entrance_ticket'"
                :class="[
                  'px-3 py-1 text-xs font-medium rounded transition-all',
                  product_type == 'entrance_ticket'
                    ? 'bg-[#ff613c] text-white'
                    : 'text-gray-600 hover:bg-gray-100',
                ]"
              >
                Attractions
              </button>
            </div>

            <!-- Status Filters -->
            <div class="flex items-center gap-2">
              <button
                v-for="statusOption in statusOptions"
                :key="statusOption.id"
                @click="setStatus(statusOption.id)"
                :class="[
                  'px-3 py-1 text-xs font-medium rounded border transition-all',
                  status === statusOption.id
                    ? 'border-[#ff613c] bg-[#ff613c] text-white'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400',
                ]"
              >
                {{ statusOption.name }}
              </button>
            </div>
          </div>

          <!-- Advanced Filter Button -->
          <button
            @click="openSearchModal"
            class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-all"
          >
            <AdjustmentsHorizontalIcon class="w-4 h-4" />
            Filters
            <span
              v-if="activeFiltersCount > 0"
              class="ml-1 px-1.5 py-0.5 bg-[#ff613c] text-white rounded-full text-[10px] font-bold"
            >
              {{ activeFiltersCount }}
            </span>
          </button>
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
                Product
              </th>
              <th
                class="px-4 py-2 text-left text-xs font-semibold text-gray-700"
              >
                Variation
              </th>
              <th
                class="px-4 py-2 text-left text-xs font-semibold text-gray-700"
              >
                Qty
              </th>
              <th
                class="px-4 py-2 text-left text-xs font-semibold text-gray-700"
              >
                Date
              </th>
              <th
                class="px-4 py-2 text-left text-xs font-semibold text-gray-700"
              >
                Status
              </th>
              <th
                class="px-4 py-2 text-left text-xs font-semibold text-gray-700"
              >
                Created By
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
              @mouseenter="handleRowHover($event, r.id)"
              @mouseleave="handleRowLeave"
              class="hover:bg-gray-50 transition-colors relative"
            >
              <!-- ID -->
              <td class="px-4 py-3 text-xs text-gray-900">
                <div class="flex items-center gap-2">
                  #{{ r.id }}
                  <ChatBubbleLeftIcon
                    v-if="r.commands"
                    class="w-3 h-3 text-blue-500"
                  />
                </div>
              </td>

              <!-- Product -->
              <td class="px-4 py-3">
                <div class="text-xs text-gray-900 font-medium">
                  {{ r.ownerable?.name }}
                </div>
                <div class="text-[10px] text-gray-500">
                  {{
                    r.ownerable_type == "App\\Models\\Hotel"
                      ? "Hotel"
                      : "Attraction"
                  }}
                </div>
              </td>

              <!-- Variation -->
              <td class="px-4 py-3">
                <div class="text-xs text-gray-900">{{ r.variable?.name }}</div>
                <div
                  v-if="r.variable?.room_price"
                  class="text-[10px] text-gray-500"
                >
                  ฿{{ r.variable?.room_price?.toLocaleString() }}
                </div>
              </td>

              <!-- Quantity -->
              <td class="px-4 py-3 text-xs text-gray-900">
                {{ r.quantity }}
              </td>

              <!-- Date -->
              <td class="px-4 py-3">
                <div v-if="!r.date" class="text-xs text-gray-700">
                  <div>{{ r.checkin_date }}</div>
                  <div>{{ r.checkout_date }}</div>
                </div>
                <div v-if="r.date" class="text-xs text-gray-700">
                  {{ r.date }}
                </div>
              </td>

              <!-- Status -->
              <td class="px-4 py-3">
                <span
                  :class="getStatusBadgeClass(r.status)"
                  class="inline-block px-2 py-1 rounded text-[10px] font-medium"
                >
                  {{ r.status }}
                </span>
              </td>

              <!-- Created By -->
              <td class="px-4 py-3">
                <div class="text-xs text-gray-900">
                  {{ r.created_by?.name }}
                </div>
                <div class="text-[10px] text-gray-500">
                  {{ new Date(r.created_at).toLocaleDateString() }}
                </div>
              </td>

              <!-- Actions -->
              <td class="px-4 py-3">
                <div class="flex items-center justify-end gap-1">
                  <div
                    v-if="authStore.isReservation || authStore.isSuperAdmin"
                    class="flex items-center gap-1"
                  >
                    <button
                      @click.prevent="updateAction('pending', r.id, r.quantity)"
                      class="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                      title="Pending"
                    >
                      <ExclamationTriangleIcon class="w-4 h-4" />
                    </button>
                    <button
                      @click.prevent="
                        updateAction('available', r.id, r.quantity)
                      "
                      class="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                      title="Available"
                    >
                      <CheckIcon class="w-4 h-4" />
                    </button>
                    <button
                      @click.prevent="
                        updateAction('unavailable', r.id, r.quantity)
                      "
                      class="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Unavailable"
                    >
                      <XMarkIcon class="w-4 h-4" />
                    </button>
                    <button
                      v-if="authStore.isSuperAdmin"
                      @click.prevent="deleteAction(r.id)"
                      class="p-1.5 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
                      title="Delete"
                    >
                      <TrashIcon class="w-4 h-4" />
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

        <!-- Command Popup -->
        <div
          v-if="hoveredRowId && getCurrentCommand"
          :style="{
            position: 'fixed',
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`,
            zIndex: 9999,
          }"
          class="bg-white border border-gray-300 rounded-lg shadow-lg p-3 max-w-sm animate-fadeIn"
        >
          <p
            class="text-xs flex justify-start items-center space-x-2 text-gray-700 leading-relaxed"
          >
            <ChatBubbleLeftIcon
              class="w-4 h-4 text-blue-500 mr-3 flex-shrink-0 mt-0.5"
            />
            {{ getCurrentCommand }}
          </p>
        </div>

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
