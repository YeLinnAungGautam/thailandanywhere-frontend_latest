<template>
  <div>
    <table
      class="w-full text-sm text-left text-gray-500 mb-4 dark:text-gray-400 rounded overflow-hidden"
    >
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-[#FF613c] dark:text-gray-100"
      >
        <tr class="">
          <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
            CRM ID
          </th>
          <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
            CUSTOMER
          </th>
          <th scope="col" class="px-3 py-3 border-l border-gray-50/20">DATE</th>
          <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
            PAYMENT
          </th>
          <th scope="col" class="px-3 py-3 text-end">AMOUNT</th>
          <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
            INCLUSIVE
          </th>
          <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
            CONNECTED
          </th>
          <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
            ACTIONS
          </th>
        </tr>
      </thead>

      <tbody class="border border-gray-400/20" v-if="!loading">
        <tr
          v-for="l in booking?.data ?? []"
          :key="l.id"
          class="border border-gray-400/20 hover:bg-[#FF613c]/10 cursor-pointer even:bg-gray-50"
          :class="{ 'bg-[#FF613c]/20': selectedRow === l.id }"
          @click="handleRowClick(l)"
        >
          <td
            scope="col"
            class="text-[11px] font-medium text-blue-600 px-3 py-3 border-l border-gray-400/20"
          >
            {{ l.crm_id }}
          </td>
          <td
            scope="col"
            class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
          >
            {{ l?.customer?.name }}
          </td>
          <td
            scope="col"
            class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
          >
            {{ getFormatDate(l?.booking_date) }}
          </td>
          <td
            scope="col"
            class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
          >
            <span
              v-if="l?.payment_status === 'fully_paid'"
              class="text-[10px] font-medium text-green-600 px-3 py-1 rounded-lg bg-green-600/10"
              >Succeeded</span
            >
            <span
              v-if="l?.payment_status === 'partially_paid'"
              class="text-[10px] font-medium text-yellow-800 px-3 py-1 rounded-lg bg-yellow-500/10"
              >Pending</span
            >
            <span
              v-if="l?.payment_status === 'not_paid'"
              class="text-[10px] font-medium text-gray-600 px-3 py-1 rounded-lg bg-gray-600/10"
              >Incomplete</span
            >
          </td>
          <td
            scope="col"
            class="text-[14px] font-semibold text-gray-800 px-3 py-3 text-end"
          >
            ฿ {{ l?.grand_total }}
          </td>
          <td
            scope="col"
            class="text-[11px] font-medium text-[#FF613c] px-3 py-3 border-l border-gray-400/20"
          >
            {{ l?.is_inclusive == 1 ? "Inclusive" : "" }}
          </td>
          <td
            scope="col"
            class="text-[11px] font-medium text-[#FF613c] text-center px-3 py-3 border-l border-gray-400/20"
          >
            <!-- {{ l?.user?.name ? l?.user?.name : "Not Connected" }} -->
            <CheckBadgeIcon
              v-if="l?.user?.name"
              class="w-5 h-5 text-green-500 inline-block"
            />
            <XCircleIcon v-else class="w-5 h-5 text-red-500 inline-block" />
          </td>
          <td
            scope="col"
            class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
          >
            <div v-if="selectedRow === l.id" class="flex space-x-2">
              <button
                @click.stop="handleEdit(l)"
                class="text-blue-600 hover:text-blue-800 font-medium"
              >
                Edit
              </button>
              <button
                @click.stop="handleDelete(l)"
                class="text-red-600 hover:text-red-800 font-medium"
              >
                Delete
              </button>
            </div>
            <span v-else>...</span>
          </td>
        </tr>
      </tbody>

      <tbody class="border border-gray-400/20" v-if="loading">
        <tr
          v-for="l in 10"
          :key="l"
          class="border border-gray-400/20 hover:bg-[#FF613c]/10 cursor-pointer even:bg-gray-50"
        >
          <td
            scope="col"
            class="text-[11px] font-medium text-blue-600 px-3 py-3 border-l border-gray-400/20"
          >
            <p
              class="w-[70px] animate-pulse h-3 bg-blue-300 inline-block rounded-lg"
            ></p>
          </td>
          <td
            scope="col"
            class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
          >
            <p
              class="w-[200px] animate-pulse h-3 bg-gray-300 inline-block rounded-lg"
            ></p>
          </td>
          <td
            scope="col"
            class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
          >
            <p
              class="w-[80px] animate-pulse h-3 bg-gray-300 inline-block rounded-lg"
            ></p>
          </td>
          <td
            scope="col"
            class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
          >
            <p
              class="w-[80px] animate-pulse h-3 bg-gray-300 inline-block rounded-lg"
            ></p>
          </td>
          <td
            scope="col"
            class="text-[14px] font-semibold text-gray-800 px-3 py-3 text-end"
          >
            <p
              class="w-[80px] animate-pulse h-3 bg-gray-300 inline-block rounded-lg"
            ></p>
          </td>
          <td
            scope="col"
            class="text-[11px] font-medium text-[#FF613c] px-3 py-3 border-l border-gray-400/20"
          >
            <p
              class="w-[80px] animate-pulse h-3 bg-gray-300 inline-block rounded-lg"
            ></p>
          </td>
          <td
            scope="col"
            class="text-[11px] font-medium text-[#FF613c] px-3 py-3 border-l border-gray-400/20"
          >
            <p
              class="w-[50px] animate-pulse h-3 bg-gray-300 inline-block rounded-lg"
            ></p>
          </td>
          <td
            scope="col"
            class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
          >
            ...
          </td>
        </tr>
      </tbody>
    </table>

    <Modal
      :isOpen="selectedRowData != null"
      @closeModal="
        selectedRowData = null;
        selectedRow = null;
      "
    >
      <DialogPanel
        class="w-full max-w-4xl transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle as="h3" class="font-medium leading-6 mb-5">
          Detail
        </DialogTitle>
        <div v-if="selectedRowData" class="">
          <div>
            <div
              class="grid grid-cols-3 divide-x divide-gray-200 border border-gray-200 p-3 rounded-lg gap-3"
            >
              <div class="flex justify-center items-center flex-col">
                <p class="text-xs font-medium">CRM ID:</p>
                <p class="font-semibold text-blue-600">
                  {{ selectedRowData.crm_id }}
                </p>
              </div>
              <div class="flex justify-center items-center flex-col">
                <p class="text-xs font-medium">Customer:</p>
                <p class="font-semibold">
                  {{ selectedRowData?.customer?.name }}
                </p>
              </div>
              <div class="flex justify-center items-center flex-col">
                <p class="text-xs font-medium">Amount:</p>
                <p class="font-semibold text-[#FF613c]">
                  {{ selectedRowData?.grand_total }} THB
                </p>
              </div>
            </div>

            <p class="py-3 font-medium">Item Detail</p>
            <div class="overflow-x-auto">
              <table
                class="w-full text-sm text-left text-gray-500 mb-4 dark:text-gray-400 rounded overflow-hidden"
              >
                <thead
                  class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-[#FF613c] dark:text-gray-100"
                >
                  <tr>
                    <th
                      scope="col"
                      class="px-3 py-3 border-l border-gray-50/20"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3 border-l border-gray-50/20"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3 border-l border-gray-50/20"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3 border-l border-gray-50/20"
                    >
                      Variation
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3 border-l border-gray-50/20"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3 border-l border-gray-50/20"
                    >
                      Service
                    </th>
                  </tr>
                </thead>

                <tbody class="border border-gray-400/20">
                  <tr
                    v-for="item in selectedRowData?.items"
                    :key="item.id"
                    class="border border-gray-400/20 even:bg-gray-50"
                    :class="
                      item.product_type === 'App\\Models\\InclusiveProduct'
                        ? 'hidden'
                        : ''
                    "
                  >
                    <td
                      scope="col"
                      class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                    >
                      {{ item?.crm_id }}
                    </td>
                    <td
                      scope="col"
                      class="text-[11px] font-medium text-black px-3 py-3 border-l border-gray-400/20"
                    >
                      {{ item?.product_type?.split(`\\`)[2] }}
                    </td>
                    <td
                      scope="col"
                      class="text-[11px] max-w-[180px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                    >
                      {{ item?.product?.name }}
                    </td>
                    <td
                      scope="col"
                      class="text-[11px] max-w-[200px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                    >
                      {{ item?.variation?.name }} {{ item?.room?.name }}
                      {{ item?.car?.name }}
                    </td>
                    <td
                      scope="col"
                      class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                    >
                      {{ item?.amount }}
                    </td>
                    <td
                      scope="col"
                      class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                    >
                      {{ getFormatDate(item?.service_date) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="mt-4 flex justify-center items-center space-x-2">
            <button
              @click="handleEdit(selectedRowData)"
              class="px-3 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Edit Booking
            </button>
            <button
              v-if="authStore.isSuperAdmin"
              @click="handleDelete(selectedRowData)"
              class="px-3 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete Booking
            </button>
            <button
              @click="
                selectedRowData = null;
                selectedRow = null;
              "
              class="px-3 py-1 text-xs bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </DialogPanel>
    </Modal>

    <Pagination :data="booking" @change-page="changePage" />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from "vue";
import { formattedDate, getFormatDate } from "../help/FormatData";
import Pagination from "../../components/Pagination.vue";
import Modal from "../../components/Modal.vue";
import { DialogPanel, DialogTitle } from "@headlessui/vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import { useBookingStore } from "../../stores/booking";
import { useAuthStore } from "../../stores/auth";
import { CalendarDaysIcon } from "@heroicons/vue/24/outline";
import { CheckBadgeIcon, XCircleIcon } from "@heroicons/vue/24/solid";

const router = useRouter();
const toast = useToast();
const bookingStore = useBookingStore();
const authStore = useAuthStore();

const props = defineProps({
  booking: {
    type: [Array, Object],
    required: true,
  },
  changePage: {
    type: Function,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  watchSystem: {
    type: Object,
  },
});

const emit = defineEmits(["edit", "delete"]);

// Track which row is selected
const selectedRow = ref(null);
const selectedRowData = ref(null);

// Handle row click
const handleRowClick = (row) => {
  if (selectedRow.value === row.id) {
    // If clicking the same row again, deselect it
    selectedRow.value = null;
    selectedRowData.value = null;
  } else {
    // Select the row
    selectedRow.value = row.id;
    selectedRowData.value = row;
  }

  console.log("Row clicked:", row);
};

// Handle edit button click
const handleEdit = (row) => {
  router.push("/bookings/new-update/" + row.id);
};

const errors = ref(null);

// Handle delete button click
const handleDelete = (row) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await bookingStore.deleteAction(row.id);
        toast.success(response.message || "Successfully deleted!");
        selectedRow.value = null;
        selectedRowData.value = null;
        // Close the modal
        // Refresh data
        await bookingStore.getListAction(props.watchSystem);
      } catch (error) {
        console.error("Delete error:", error);

        // Safely handle errors
        if (errors && error.response?.data?.errors) {
          errors.value = error.response.data.errors;
        }

        // Show error message
        const errorMessage =
          error.response?.data?.message ||
          "Failed to delete. Please try again.";
        toast.error(errorMessage);
      }
    }
  });
};
</script>
