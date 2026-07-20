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
            ORDER ID
          </th>
          <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
            USER NAME
          </th>
          <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
            CUSTOMER
          </th>
          <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
            AGENT
          </th>
          <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
            ORDER CREATE
          </th>
          <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
            ORDER STATUS
          </th>
          <th scope="col" class="px-3 py-3 text-end">AMOUNT</th>
          <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
            CONTACT
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
          @click="handleRowClick(l)"
        >
          <td
            scope="col"
            class="text-[11px] font-medium text-blue-600 px-3 py-3 border-l border-gray-400/20"
          >
            {{ l.order_number }}
          </td>
          <td
            scope="col"
            class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
          >
            {{ l?.user?.name }}
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
            {{ l?.admin?.name }}
          </td>
          <td
            scope="col"
            class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
          >
            {{ getFormatDate(l?.order_datetime.split("T")[0]) }}
          </td>
          <td
            scope="col"
            class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
          >
            <span
              v-if="l?.order_status === 'confirmed'"
              class="text-[10px] font-medium text-green-600 px-3 py-1 rounded-lg bg-green-600/10"
              >Confirmed</span
            >
            <span
              v-if="l?.order_status === 'sale_convert'"
              class="text-[10px] font-medium text-blue-600 px-3 py-1 rounded-lg bg-blue-600/10"
              >Sale_convert</span
            >
            <span
              v-if="l?.order_status === 'processing'"
              class="text-[10px] font-medium text-yellow-800 px-3 py-1 rounded-lg bg-yellow-500/10"
              >Processing</span
            >
            <span
              v-if="l?.order_status === 'pending'"
              class="text-[10px] font-medium text-orange-600 px-3 py-1 rounded-lg bg-orange-600/10"
              >Pending</span
            >
            <span
              v-if="l?.order_status === 'cancelled'"
              class="text-[10px] font-medium text-gray-600 px-3 py-1 rounded-lg bg-gray-600/10"
              >Cancelled</span
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
            {{ l?.phone_number }}
          </td>
          <td
            scope="col"
            class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
          >
            <div class="flex space-x-2">
              <button
                @click.stop="handleEdit(l)"
                class="text-blue-600 hover:text-blue-800 font-medium"
              >
                View
              </button>
            </div>
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

    <div v-if="booking?.data?.length > 0" class="flex justify-end">
      <Pagination :data="booking" @change-page="changePage" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import { getFormatDate } from "../help/FormatData";
import Pagination from "../../components/Pagination.vue";
import { useRouter } from "vue-router";

const router = useRouter();

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

// Clicking a row now navigates to the dedicated order detail page,
// which fetches the detail data itself on mount.
const handleRowClick = (row) => {
  router.push(`/orders/${row.id}`);
};

// Handle edit button click
const handleEdit = (row) => {
  router.push("/bookings/new-update/" + row.id);
};
</script>
