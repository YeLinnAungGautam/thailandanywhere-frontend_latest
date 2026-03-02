<template>
  <div class="space-y-6">
    <!-- Amendment Changes Table -->
    <div>
      <div class="text-2xl font-bold">General</div>
      <div class="text-sm text-gray-500 pt-2">
        General information about the amendment.
      </div>
    </div>

    <div class="pt-4">
      <div class="font-semibold">
        Amendment Changes by {{ detail?.amend_history?.[0]?.user_name }}
      </div>
      <table class="w-full mt-4">
        <thead>
          <tr
            class="border border-gray-200 bg-[#FF613c] text-white divide-x-2 divide-gray-200"
          >
            <th class="text-left font-medium text-sm px-4 py-2">Field</th>
            <th class="text-left font-medium text-sm px-4 py-2">
              Previous Value
            </th>
            <th class="text-left font-medium text-sm px-4 py-2">New Value</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="changedFields.length > 0">
            <tr
              v-for="row in changedFields"
              :key="row.key"
              class="even:bg-gray-50"
            >
              <td
                class="border px-4 py-3 text-xs font-medium"
                :class="row.label == 'Variation ID' ? 'hidden' : ''"
              >
                {{ row.label }}
              </td>
              <td
                class="border px-4 py-3 text-xs text-red-500"
                :class="row.label == 'Variation ID' ? 'hidden' : ''"
              >
                {{ row.previous }}
              </td>
              <td
                class="border px-4 py-3 text-xs text-green-600 font-medium"
                :class="row.label == 'Variation ID' ? 'hidden' : ''"
              >
                {{ row.newVal }}
              </td>
            </tr>
          </template>
          <tr v-else>
            <td colspan="3" class="text-center py-4 text-xs text-gray-400">
              No amendment history available
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Reservation Info Badges -->
    <div class="pt-2">
      <div class="font-semibold mb-3">Reservation Information</div>
      <div class="flex flex-wrap justify-start items-center gap-2">
        <p
          class="text-[12px] bg-[#ff613c] whitespace-nowrap text-white inline-block rounded-lg px-4 py-2 cursor-pointer"
          @click="
            router.push(
              `/bookings/new-update/${detail?.booking_item?.booking?.id}`,
            )
          "
        >
          {{ detail?.booking_item?.crm_id }}
        </p>
        <p
          class="text-[12px] bg-gray-600 text-white whitespace-nowrap inline-block rounded-lg px-4 py-2"
        >
          {{ detail?.booking_item?.customer_info?.name }}
        </p>
        <p
          class="text-[12px] text-white whitespace-nowrap inline-block rounded-lg px-4 py-2"
          :class="{
            'bg-green-600':
              detail?.booking_item?.booking?.payment_status == 'fully_paid',
            'bg-yellow-600':
              detail?.booking_item?.booking?.payment_status == 'partially_paid',
            'bg-red-600':
              detail?.booking_item?.booking?.payment_status == 'not_paid',
          }"
        >
          Pay: {{ detail?.booking_item?.booking?.payment_status }}
        </p>
        <p
          class="text-[12px] text-white whitespace-nowrap inline-block rounded-lg px-4 py-2"
          :class="{
            'bg-green-600':
              detail?.booking_item?.payment_status == 'fully_paid',
            'bg-yellow-600':
              detail?.booking_item?.payment_status == 'partially_paid',
            'bg-red-600': detail?.booking_item?.payment_status == 'not_paid',
          }"
        >
          Exp: {{ detail?.booking_item?.payment_status }}
        </p>
        <p
          class="text-[12px] bg-orange-600 text-white whitespace-nowrap inline-block rounded-lg px-4 py-2"
        >
          Bal: {{ detail?.booking_item?.booking?.balance_due }}
        </p>
      </div>
    </div>

    <!-- Loading state for group detail -->
    <div v-if="groupLoading" class="flex justify-center items-center py-8">
      <svg
        class="text-gray-300 animate-spin mr-2"
        viewBox="0 0 64 64"
        fill="none"
        width="18"
        height="18"
      >
        <path
          d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3Z"
          stroke="currentColor"
          stroke-width="5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
          stroke="currentColor"
          stroke-width="5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-gray-900"
        ></path>
      </svg>
      <p class="text-xs text-gray-500">Loading reservation data...</p>
    </div>

    <!-- 3 Section Grid: Payment / Expense / Booking Request -->
    <div v-if="!groupLoading" class="grid grid-cols-3 gap-4">
      <!-- Payment Images -->
      <div class="border border-gray-200 rounded-lg p-3">
        <div class="flex justify-between items-center mb-3">
          <p class="text-sm font-semibold text-[#FF613c]">Payment</p>
          <span
            class="text-[10px] px-2 py-0.5 rounded-full text-white"
            :class="{
              'bg-green-500':
                groupDetail?.booking?.payment_status == 'fully_paid',
              'bg-yellow-500':
                groupDetail?.booking?.payment_status == 'partially_paid',
              'bg-red-500': groupDetail?.booking?.payment_status == 'not_paid',
            }"
          >
            {{
              groupDetail?.booking?.payment_status ??
              detail?.booking_item?.booking?.payment_status
            }}
          </span>
        </div>
        <div class="space-y-3 max-h-[350px] overflow-y-auto">
          <template v-if="paymentReceipts.length > 0">
            <div v-for="receipt in paymentReceipts" :key="receipt.id">
              <!-- Internal Transfer -->
              <div
                v-if="receipt?.is_internal_transfer"
                class="border border-gray-200 rounded-lg p-2 bg-gray-50"
              >
                <span
                  class="text-[9px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full"
                  >Internal Transfer</span
                >
                <div class="grid grid-cols-2 gap-2 mt-2">
                  <div v-for="f in receipt.from_files" :key="f.id">
                    <img
                      :src="f.image"
                      class="w-full h-20 object-cover rounded cursor-pointer"
                      @click="openImageModal(f.image)"
                    />
                    <p class="text-[9px] text-gray-500 mt-1">
                      FROM: {{ f.amount }} {{ f.currency }}
                    </p>
                  </div>
                  <div v-for="t in receipt.to_files" :key="t.id">
                    <img
                      :src="t.image"
                      class="w-full h-20 object-cover rounded cursor-pointer"
                      @click="openImageModal(t.image)"
                    />
                    <p class="text-[9px] text-gray-500 mt-1">
                      TO: {{ t.amount }} {{ t.currency }}
                    </p>
                  </div>
                </div>
              </div>
              <!-- Regular Receipt -->
              <div v-else class="space-y-1">
                <img
                  :src="receipt?.image"
                  class="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                  @click="openImageModal(receipt?.image)"
                />
                <div
                  class="flex justify-between items-center text-[9px] text-gray-500 px-1"
                >
                  <span>{{ receipt?.amount }} ฿</span>
                  <span>{{
                    receipt?.date ? receipt.date.slice(0, 10) : "--"
                  }}</span>
                </div>
              </div>
            </div>
          </template>
          <div
            v-else
            class="flex justify-center items-center h-20 text-[10px] text-gray-400"
          >
            No payment images
          </div>
        </div>
      </div>

      <!-- Expense Images -->
      <div class="border border-gray-200 rounded-lg p-3">
        <div class="flex justify-between items-center mb-3">
          <p class="text-sm font-semibold text-[#FF613c]">Expense</p>
          <span
            class="text-[10px] px-2 py-0.5 rounded-full text-white"
            :class="{
              'bg-green-500': groupDetail?.expense_status == 'fully_paid',
              'bg-yellow-500': groupDetail?.expense_status == 'partially_paid',
              'bg-red-500':
                groupDetail?.expense_status == 'not_paid' ||
                !groupDetail?.expense_status,
            }"
          >
            {{ groupDetail?.expense_status || "not_paid" }}
          </span>
        </div>
        <div class="space-y-3 max-h-[350px] overflow-y-auto">
          <template v-if="expenseImages.length > 0">
            <div v-for="exp in expenseImages" :key="exp.id" class="space-y-1">
              <a :href="exp.image" target="_blank">
                <img
                  :src="exp.image"
                  class="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                  @click.prevent="openImageModal(exp.image)"
                />
              </a>
              <div
                class="flex justify-between items-center text-[9px] text-gray-500 px-1"
              >
                <span>{{ exp?.amount }} ฿</span>
                <span>{{ exp?.bank_name }}</span>
                <span>{{ exp?.date ? exp.date.slice(0, 10) : "--" }}</span>
              </div>
            </div>
          </template>
          <div
            v-else
            class="flex justify-center items-center h-20 text-[10px] text-gray-400"
          >
            No expense images
          </div>
        </div>
      </div>

      <!-- Booking Request -->
      <div class="border border-gray-200 rounded-lg p-3">
        <div class="flex justify-between items-center mb-3">
          <p class="text-sm font-semibold text-[#FF613c]">Booking Request</p>
          <span
            class="text-[10px] px-2 py-0.5 rounded-full text-white"
            :class="
              bookingRequestImages.length > 0 ? 'bg-green-500' : 'bg-red-500'
            "
          >
            {{ bookingRequestImages.length > 0 ? "Has Files" : "No Files" }}
          </span>
        </div>
        <div class="space-y-3 max-h-[350px] overflow-y-auto">
          <template v-if="bookingRequestImages.length > 0">
            <div
              v-for="img in bookingRequestImages"
              :key="img.id"
              class="space-y-1"
            >
              <img
                :src="img.file ?? img.image"
                class="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                @click="openImageModal(img.file ?? img.image)"
              />
              <p class="text-[9px] text-gray-500 px-1">
                {{ img?.meta?.name ?? img?.name ?? img?.document_type ?? "" }}
              </p>
            </div>
          </template>
          <div
            v-else
            class="flex justify-center items-center h-20 text-[10px] text-gray-400"
          >
            No booking request images
          </div>
        </div>
      </div>
    </div>

    <!-- Image Lightbox Modal -->
    <div
      v-if="lightboxImage"
      class="fixed inset-0 bg-black/80 z-50 flex justify-center items-center"
      @click="lightboxImage = null"
    >
      <img
        :src="lightboxImage"
        class="max-w-[90vw] max-h-[90vh] rounded-lg shadow-xl object-contain"
      />
      <button
        class="absolute top-4 right-4 text-white bg-black/50 rounded-full w-8 h-8 flex items-center justify-center text-xs"
        @click="lightboxImage = null"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useGroupStore } from "../../stores/group";

const props = defineProps({
  detail: Object,
  getDetailAction: Function,
});

const router = useRouter();
const route = useRoute();
const groupStore = useGroupStore();

const groupDetail = ref(null);
const groupLoading = ref(false);
const lightboxImage = ref(null);
const bookingProofImages = ref([]);

// ── Fetch group detail using booking_item's group_id ──
const fetchGroupDetail = async () => {
  const groupId = props.detail?.booking_item?.group_id;
  if (!groupId) return;

  groupLoading.value = true;
  try {
    const res = await groupStore.detailAction(groupId);
    if (res?.result) {
      groupDetail.value = res.result;
    }
  } catch (e) {
    console.error("Failed to fetch group detail:", e);
  } finally {
    groupLoading.value = false;
  }
};

// ── Fetch booking request proof images via groupDocumentList ──
const getProofImage = async () => {
  try {
    const res = await groupStore.groupDocumentList(
      props.detail?.booking_item?.group_id,
      {
        document_type: "booking_request_proof",
      },
    );
    bookingProofImages.value = res?.result ?? [];
  } catch (e) {
    console.error("Failed to fetch booking proof images:", e);
    bookingProofImages.value = [];
  }
};

watch(
  () => props.detail,
  (val) => {
    if (val) {
      fetchGroupDetail();
      getProofImage();
    }
  },
  { immediate: true },
);

// ── Image helpers ──

// Payment receipts: prefer groupDetail receipts, fall back to booking_item.receipt_images
const paymentReceipts = computed(() => {
  return (
    groupDetail.value?.booking?.receipts ??
    props.detail?.booking_item?.receipt_images ??
    []
  );
});

const expenseImages = computed(() => groupDetail.value?.expense ?? []);

// Booking request proof: use dedicated groupDocumentList API result
const bookingRequestImages = computed(() => bookingProofImages.value ?? []);

const openImageModal = (url) => {
  lightboxImage.value = url;
};

// ── Amendment changes computed ──
// FIX: Previous values live in amend_history[0].previous_values, not flat in changes
const changedFields = computed(() => {
  const history = props.detail?.amend_history?.[0];
  if (!history) return [];

  const changes = history.changes;
  const previousValues = history.previous_values ?? {};

  if (!changes) return [];

  const labelMap = {
    service_date: "Service Date",
    checkout_date: "Checkout Date",
    quantity: "Quantity",
    child_quantity: "Child Quantity",
    selling_price: "Selling Price",
    cost_price: "Cost Price",
    variation_id: "Variation ID",
    variation_name: "Variation Name",
    total_amount: "Total Amount",
    total_cost_price: "Total Cost Price",
  };

  return Object.entries(changes).map(([key, newVal]) => ({
    key,
    label:
      labelMap[key] ??
      key
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
    // FIX: previous values are stored as "current_<key>" inside previous_values object
    previous: previousValues[`current_${key}`] ?? "-",
    newVal: newVal ?? "-",
  }));
});
</script>
