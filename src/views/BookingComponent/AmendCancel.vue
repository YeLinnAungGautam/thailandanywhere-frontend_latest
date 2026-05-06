<template>
  <div class="space-y-4" v-if="amendData != null">
    <!-- Item Summary Card -->
    <div class="border border-gray-200 rounded-xl p-4 bg-gray-50">
      <p
        class="text-[10px] text-gray-400 uppercase tracking-wide font-medium mb-2"
      >
        Item to Cancel
      </p>
      <div class="flex items-center gap-3">
        <div
          class="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0"
        >
          <img
            v-if="amendData.product_image"
            :src="amendData.product_image"
            class="w-full h-full object-cover"
            alt=""
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <TrashIcon class="w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-800 truncate">
            {{ amendData.product_name }}
          </p>
          <p class="text-[11px] text-gray-500 truncate">
            {{ amendData.item_name }}
          </p>
          <p class="text-[10px] text-gray-400 mt-0.5">
            {{ amendData.crm_id }}
          </p>
        </div>
      </div>

      <!-- Hotel dates -->
      <div v-if="isHotel" class="mt-3 flex items-center gap-3 flex-wrap">
        <div class="flex items-center gap-1.5 text-[10px] text-gray-500">
          <CalendarIcon class="w-3.5 h-3.5" />
          {{ amendData.service_date }} → {{ amendData.checkout_date }}
        </div>
        <span
          class="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full"
        >
          {{ amendData.days }} night{{ amendData.days > 1 ? "s" : "" }}
        </span>
        <span
          class="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full"
        >
          x{{ amendData.quantity }} room{{ amendData.quantity > 1 ? "s" : "" }}
        </span>
      </div>

      <!-- Attraction date -->
      <div v-else class="mt-3 flex items-center gap-3 flex-wrap">
        <div class="flex items-center gap-1.5 text-[10px] text-gray-500">
          <CalendarIcon class="w-3.5 h-3.5" />
          {{ amendData.service_date }}
        </div>
        <span
          class="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full"
        >
          Adult x{{ amendData.quantity }}
        </span>
        <span
          v-if="amendData.child_quantity > 0"
          class="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full"
        >
          Child x{{ amendData.child_quantity }}
        </span>
      </div>

      <!-- Amount summary -->
      <div class="mt-3 pt-3 border-t border-gray-200 grid grid-cols-2 gap-2">
        <div>
          <p class="text-[10px] text-gray-400">Total Selling</p>
          <p class="text-sm font-semibold text-gray-700">
            {{ Number(amendData.total_amount).toLocaleString() }} ฿
          </p>
        </div>
        <div>
          <p class="text-[10px] text-gray-400">Total Cost</p>
          <p class="text-sm font-semibold text-gray-700">
            {{ Number(amendData.total_cost_price).toLocaleString() }} ฿
          </p>
        </div>
      </div>
    </div>

    <!-- Warning box -->
    <div
      class="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
    >
      <ExclamationTriangleIcon
        class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
      />
      <div class="space-y-1">
        <p class="text-xs font-semibold text-red-700">Cancel Request</p>
        <p class="text-[11px] text-red-600 leading-relaxed">
          This will submit a cancellation request for this booking item. The
          request will be reviewed and confirmed by an administrator. This
          action cannot be undone.
        </p>
      </div>
    </div>

    <!-- Confirmation checkbox -->
    <label class="flex items-center gap-3 cursor-pointer group">
      <input
        type="checkbox"
        v-model="confirmed"
        class="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-400 cursor-pointer"
      />
      <span
        class="text-xs text-gray-600 group-hover:text-gray-800 transition-colors"
      >
        I understand this will request cancellation of the above item
      </span>
    </label>

    <!-- Action Buttons -->
    <div class="flex justify-end items-center gap-x-2 pt-2">
      <button
        @click="amendCloseAction"
        class="bg-white text-gray-600 border border-gray-300 px-4 py-2.5 rounded-lg text-xs hover:bg-gray-50 transition-colors"
      >
        Keep Item
      </button>
      <button
        @click="submitCancel"
        :disabled="!confirmed || loading"
        class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs text-white transition-colors"
        :class="
          confirmed && !loading
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-gray-300 cursor-not-allowed'
        "
      >
        <span
          v-if="loading"
          class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"
        />
        <TrashIcon v-else class="w-3.5 h-3.5" />
        {{ loading ? "Submitting..." : "Submit Cancel Request" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  TrashIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
} from "@heroicons/vue/24/outline";
import { useAmendStore } from "../../stores/amend";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";

const props = defineProps({
  amendData: { type: Object, default: null },
  amendCloseAction: { type: Function, default: () => {} },
});

const amendStore = useAmendStore();
const toast = useToast();

const confirmed = ref(false);
const loading = ref(false);

const isHotel = computed(() => props.amendData?.product_type == 6);

const submitCancel = async () => {
  if (!confirmed.value || loading.value) return;

  const result = await Swal.fire({
    title: "Submit Cancel Request?",
    text: `This will request cancellation for "${props.amendData?.item_name}". An admin will review and confirm.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, request cancel",
    cancelButtonText: "Go back",
  });

  if (!result.isConfirmed) return;

  loading.value = true;
  try {
    const changes = {
      delete: true,
      total_amount: props.amendData.total_amount,
      total_cost_price: props.amendData.total_cost_price,
    };

    const frmData = new FormData();
    frmData.append("booking_item_id", props.amendData.reservation_id);
    frmData.append("changes", JSON.stringify(changes));

    const res = await amendStore.addNewAction(frmData);

    if (res.status == 1) {
      toast.success("Cancel request submitted successfully.");
      props.amendCloseAction();
    } else {
      toast.error("Failed to submit cancel request.");
    }
  } catch {
    toast.error("Something went wrong. Please try again.");
  } finally {
    loading.value = false;
  }
};
</script>
