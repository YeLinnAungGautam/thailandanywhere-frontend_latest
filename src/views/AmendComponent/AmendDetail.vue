<script setup>
import { ref, watch, onMounted, computed, defineProps } from "vue";
import {
  ChevronDoubleRightIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/vue/24/outline";
import { useRoute, useRouter } from "vue-router";
import productIcon from "../../assets/window.png";
import checkImage from "../../assets/check.png";
import { useToast } from "vue-toastification";
import { useAuthStore } from "../../stores/auth";
import { daysBetween } from "../help/DateBetween";
import { getFormatDate } from "../help/FormatData";
import AmendGenral from "./AmendGenral.vue";
import AmendRequest from "./AmendRequest.vue";
import AmendMailSent from "./AmendMailSent.vue";
import AmendApprove from "./AmendApprove.vue";
import { useAmendStore } from "../../stores/amend";
import Swal from "sweetalert2";
import AmendStatus from "./AmendStatus.vue";

const props = defineProps({
  show: Number,
});

const part = ref("general");
const route = useRoute();
const router = useRouter();
const amendStore = useAmendStore();
const authStore = useAuthStore();
const detail = ref(null);
const getLoading = ref(false);
const toast = useToast();
const hasRouteId = ref(false);

const state = ref({
  general: false,
  request: false,
  sent: false,
  approve: false,
  status: false,
});

const showCommentPropup = ref(false);

const partArray = ref([
  { id: 1, name: "general" },
  { id: 2, name: "request" },
  { id: 3, name: "sent" },
  { id: 4, name: "approve" },
  { id: 5, name: "status" },
]);

const transition = ref("slide-right");

const score = computed(() => {
  if (detail.value?.amount && detail.value?.total_cost_price) {
    let score =
      (detail.value?.amount * 1 - detail.value?.total_cost_price) /
      (detail.value?.amount * 1);
    return score.toFixed(4);
  }
  return 0;
});

const reservation_ids = ref({
  id: null,
  name: null,
});
const showFailModal = ref(false);
const selectTicketModal = ref(false);
const generateConfirmation = () => {
  if (detail.value?.booking?.payment_status != "not_paid") {
    selectTicketModal.value = true;
  } else {
    showFailModal.value = true;
  }
};

const getComponent = (part) => {
  const components = {
    general: AmendGenral,
    request: AmendRequest,
    sent: AmendMailSent,
    approve: AmendApprove,
    status: AmendStatus,
  };
  return components[part];
};

const getDetailAction = async (id) => {
  getLoading.value = true;
  reservation_ids.value = [];

  const res = await amendStore.getDetailAction(id);
  detail.value = res.result;
  console.log(detail.value, "this is detail");

  getLoading.value = false;
};

const deleteAction = async () => {
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
      const res = await amendStore.deleteAction(detail.value?.id);
      console.log("====================================");
      console.log(res, "this is delete");
      console.log("====================================");
      if (res.status == 1) {
        toast.success("Delete successfully");
        router.push({
          name: "amend",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Delete failed");
      }
    }
  });
};

watch(
  () => route.query.id,
  (newId) => {
    if (newId) {
      hasRouteId.value = false;
      getDetailAction(newId);
    }
  },
  { immediate: true }
);

watch(
  () => part.value,
  (newPart) => {
    router.push({
      query: {
        id: route.query.id,
        crm_id: route.query.crm_id,
        part: newPart,
      },
    });
  }
);

onMounted(() => {
  if (!route.query.id) {
    hasRouteId.value = true;
  }
  if (route.query.part) {
    part.value = route.query.part;
  }
});

const hide = ref(true);
</script>

<template>
  <div>
    <div v-if="hasRouteId">
      <div class="flex justify-center text-xs items-center h-[70vh]">
        <p>Please select one reservation group.</p>
      </div>
    </div>
    <div v-if="getLoading">
      <div class="flex justify-center text-xs items-center h-[70vh]">
        <svg
          class="text-gray-300 animate-spin mr-2"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
        >
          <path
            d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
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
        <p>loading</p>
      </div>
    </div>
    <div class="space-y-4" v-if="!getLoading && !hasRouteId">
      <div class="space-y-4 border border-gray-200 p-3 rounded-lg">
        <div class="grid grid-cols-5 gap-2">
          <div class="col-span-5 flex justify-between items-center">
            <div>
              <p class="text-[10px] text-gray-500">customer name</p>
              <p class="text-[18px] text-[#FF613c] font-medium pb-2">
                {{ detail?.booking_item?.customer_info?.name }}
              </p>
              <div class="flex justify-start items-center gap-x-2">
                <p
                  @click="
                    router.push(
                      `/bookings/new-update/${detail?.booking_item?.booking?.id}`
                    )
                  "
                  class="text-[10px] bg-[#FF613c] text-white whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-lg"
                >
                  {{ detail?.booking_item?.crm_id }}
                </p>
                <p
                  class="text-[10px] bg-[#FF613c] text-white whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-lg"
                >
                  {{ detail?.booking_item?.product?.name }}
                </p>
                <p
                  class="text-[12px] bg-[#FF613c]/20 text-[#FF613c] font-semibold whitespace-nowrap cursor-pointer px-3 py-1 rounded-lg"
                >
                  {{ detail?.amend_status }}
                </p>
              </div>
            </div>
            <div class="">
              <p class="text-[10px] text-gray-500 text-end">score</p>
              <p class="text-lg text-red-500 font-medium pb-2 text-end">
                {{ score }}
              </p>
              <div class="flex justify-end items-center gap-x-2">
                <p
                  @click="deleteAction"
                  class="text-[10px] bg-red-600 text-white whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-lg flex justify-center items-center gap-x-1"
                >
                  <TrashIcon class="w-3 h-3" /> Delete
                </p>
                <p
                  @click="showCommentPropup = true"
                  class="text-[10px] bg-[#FF613c] text-white whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-lg flex justify-center items-center gap-x-1"
                >
                  <img :src="productIcon" alt="" class="w-3 h-3" />Note
                </p>

                <p
                  @click="hide = !hide"
                  class="text-[10px] bg-black text-white whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-lg flex justify-center items-center gap-x-1"
                >
                  <ChevronDownIcon class="w-3 h-3 text-white" />{{
                    !hide ? "Hide" : "Show"
                  }}
                </p>
              </div>
            </div>
          </div>
          <div :class="show != 3 ? 'col-span-5' : 'col-span-5'" v-if="!hide">
            <div class="flex justify-between items-start gap-x-4 pt-3">
              <div class="w-full overflow-scroll max-h-[200px]">
                <table
                  class="w-full rounded-xl overflow-hidden border border-gray-700 shadow-sm"
                >
                  <thead
                    class="bg-[#FF613c] text-white border-b-2 border-gray-200"
                  >
                    <tr>
                      <th
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        Code
                      </th>
                      <th
                        class="py-1 px-4 text-[10px] whitespace-nowrap min-w-[120px] font-normal text-left"
                      >
                        Product Name
                      </th>
                      <th
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        Item Name
                      </th>

                      <th
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        Service Date
                      </th>
                      <th
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        Qty
                      </th>
                      <th
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        Price
                      </th>

                      <th
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        Total
                      </th>
                      <th
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        Discount
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr class="bg-white even:bg-gray-50 hover:bg-gray-50">
                      <td
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        {{ detail?.booking_item?.crm_id }}
                      </td>
                      <td
                        class="py-1 px-4 text-[10px] w-[300px] font-normal text-left"
                      >
                        {{ detail?.booking_item?.product?.name }}
                      </td>
                      <td
                        class="py-1 px-4 min-w-[120px] text-[10px] font-normal text-left"
                      >
                        {{ detail?.booking_item?.car?.name }}
                        {{ detail?.booking_item?.room?.name }}
                        {{ detail?.booking_item?.variation?.name }}
                        {{ detail?.booking_item?.ticket?.name }}
                      </td>
                      <top-destination-cart
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        {{ getFormatDate(detail?.booking_item?.service_date) }}
                      </top-destination-cart>
                      <td
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        {{ detail?.booking_item?.quantity }}
                      </td>
                      <td
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        {{ detail?.booking_item?.selling_price }}
                      </td>
                      <td
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        {{ detail?.booking_item?.amount }}
                      </td>
                      <td
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        {{ detail?.booking_item?.discount }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="pt-2 relative flex justify-between items-center">
          <div
            class="flex justify-start items-center gap-x-3 cursor-pointer"
            @click="part = 'general'"
          >
            <div
              v-if="!state.general"
              @click="part = 'general'"
              class="w-6 h-6 flex justify-center shadow hover:shadow-nano cursor-pointer items-center text-[10px] rounded-full relative z-10"
              :class="
                part == 'general' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
              "
            >
              1
            </div>
            <div
              v-if="state.general"
              class="w-6 h-6 flex justify-center shadow hover:shadow-nano cursor-pointer items-center text-[10px] rounded-full relative z-10"
              :class="part == 'general' ? 'bg-white text-white' : ''"
              @click="part = 'general'"
            >
              <img :src="checkImage" alt="" />
            </div>
            <p
              class="text-xs"
              :class="state.general ? 'text-[#04BA00]' : 'text-gray-800'"
            >
              Review
            </p>
          </div>
          <div
            class="relative z-10"
            :class="state.general ? 'text-[#04BA00]' : 'text-gray-800'"
          >
            <ChevronRightIcon class="w-4 h-4" />
          </div>
          <div
            class="flex justify-start items-center gap-x-3 cursor-pointer"
            @click="part = 'request'"
          >
            <div
              v-if="!state.request"
              @click="part = 'request'"
              class="w-6 h-6 flex justify-center cursor-pointer items-center text-[10px] rounded-full relative z-10"
              :class="
                part == 'request' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
              "
            >
              2
            </div>
            <div
              v-if="state.request"
              @click="part = 'request'"
              class="w-6 h-6 flex justify-center cursor-pointer shadow hover:shadow-none items-center text-[10px] rounded-full relative z-10"
              :class="part == 'request' ? 'bg-white text-white' : ''"
            >
              <img :src="checkImage" alt="" />
            </div>
            <p
              class="text-xs"
              :class="state.request ? 'text-[#04BA00]' : 'text-gray-800'"
            >
              Amend Request
            </p>
          </div>
          <div
            class="relative z-10"
            :class="state.request ? 'text-[#04BA00]' : 'text-gray-800'"
          >
            <ChevronRightIcon class="w-4 h-4" />
          </div>

          <div
            class="flex justify-start items-center gap-x-3 cursor-pointer"
            @click="part = 'sent'"
          >
            <div
              v-if="
                !state.sent &&
                (authStore.isReservation || authStore.isSuperAdmin)
              "
              @click="part = 'sent'"
              class="w-6 h-6 flex justify-center cursor-pointer items-center text-[10px] rounded-full relative z-10"
              :class="
                part == 'sent' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
              "
            >
              3
            </div>
            <div
              v-if="
                state.sent &&
                (authStore.isReservation || authStore.isSuperAdmin)
              "
              @click="part = 'sent'"
              class="w-6 h-6 flex justify-center cursor-pointer shadow hover:shadow-none items-center text-[10px] rounded-full relative z-10"
              :class="part == 'sent' ? 'bg-white text-white' : ''"
            >
              <img :src="checkImage" alt="" />
            </div>
            <p
              class="text-xs"
              :class="state.sent ? 'text-[#04BA00]' : 'text-gray-800'"
            >
              Amend Mail Sent
            </p>
          </div>
          <div
            class="relative z-10"
            :class="state.sent ? 'text-[#04BA00]' : 'text-gray-800'"
          >
            <ChevronRightIcon class="w-4 h-4" />
          </div>
          <div
            class="flex justify-start items-center gap-x-3 cursor-pointer"
            @click="part = 'approve'"
          >
            <div
              v-if="
                !state.approve &&
                (authStore.isReservation || authStore.isSuperAdmin)
              "
              @click="part = 'approve'"
              class="w-6 h-6 flex justify-center items-center shadow hover:shadow-nano cursor-pointer text-[10px] rounded-full relative z-10"
              :class="
                part == 'approve' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
              "
            >
              4
            </div>
            <div
              v-if="
                state.approve &&
                (authStore.isReservation || authStore.isSuperAdmin)
              "
              @click="part = 'approve'"
              class="w-6 h-6 flex justify-center shadow hover:shadow-nano cursor-pointer items-center text-[10px] rounded-full relative z-10"
              :class="part == 'approve' ? 'bg-white text-white' : ''"
            >
              <img :src="checkImage" alt="" />
            </div>
            <p
              class="text-xs"
              :class="state.approve ? 'text-[#04BA00]' : 'text-gray-800'"
            >
              Amend Approve
            </p>
          </div>
          <div
            class="relative z-10"
            :class="state.status ? 'text-[#04BA00]' : 'text-gray-800'"
          >
            <ChevronRightIcon class="w-4 h-4" />
          </div>
          <div
            class="flex justify-start items-center gap-x-3 cursor-pointer"
            @click="part = 'status'"
          >
            <div
              v-if="
                !state.status &&
                (authStore.isReservation || authStore.isSuperAdmin)
              "
              @click="part = 'status'"
              class="w-6 h-6 flex justify-center items-center shadow hover:shadow-nano cursor-pointer text-[10px] rounded-full relative z-10"
              :class="
                part == 'status' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
              "
            >
              5
            </div>
            <div
              v-if="
                state.status &&
                (authStore.isReservation || authStore.isSuperAdmin)
              "
              @click="part = 'status'"
              class="w-6 h-6 flex justify-center shadow hover:shadow-nano cursor-pointer items-center text-[10px] rounded-full relative z-10"
              :class="part == 'status' ? 'bg-white text-white' : ''"
            >
              <img :src="checkImage" alt="" />
            </div>
            <p
              class="text-xs"
              :class="state.status ? 'text-[#04BA00]' : 'text-gray-800'"
            >
              Amend Status
            </p>
          </div>
        </div>

        <div class="pt-2 flex justify-between items-center gap-x-6">
          <p
            class="w-full rounded-lg h-1"
            :class="{
              'bg-green-500': part === 'general' && state.general,
              'bg-[#FF613c]': part === 'general' && !state.general,
              'opacity-0': part !== 'general',
            }"
          ></p>
          <p
            class="w-full rounded-lg h-1"
            :class="{
              'bg-green-500': part === 'request' && state.request,
              'bg-[#FF613c]': part === 'request' && !state.request,
              'opacity-0': part !== 'request',
            }"
          ></p>
          <p
            class="w-full rounded-lg h-1"
            :class="{
              'bg-green-500': part === 'sent' && state.sent,
              'bg-[#FF613c]': part === 'sent' && !state.sent,
              'opacity-0': part !== 'sent',
            }"
          ></p>
          <p
            class="w-full rounded-lg h-1"
            :class="{
              'bg-green-500': part === 'approve' && state.approve,
              'bg-[#FF613c]': part === 'approve' && !state.approve,
              'opacity-0': part !== 'approve',
            }"
          ></p>
          <p
            class="w-full rounded-lg h-1"
            :class="{
              'bg-green-500': part === 'status' && state.status,
              'bg-[#FF613c]': part === 'status' && !state.status,
              'opacity-0': part !== 'status',
            }"
          ></p>
        </div>

        <div class="relative" v-if="show != 3">
          <Transition :name="transition" mode="out-in">
            <div class="pt-6" :key="part">
              <component
                :is="getComponent(part)"
                :detail="detail"
                :getDetailAction="getDetailAction"
              />
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Slide Right (enter from right, leave to left) */
.slide-right-enter-active {
  transition: transform 0.4s ease-out, opacity 0.4s ease-out;
}
.slide-right-leave-active {
  transition: transform 0.3s ease-in, opacity 0.3s ease-in;
}
.slide-right-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-right-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* Slide Left (enter from left, leave to right) */
.slide-left-enter-active {
  transition: transform 0.4s ease-out, opacity 0.4s ease-out;
}
.slide-left-leave-active {
  transition: transform 0.3s ease-in, opacity 0.3s ease-in;
}
.slide-left-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-left-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
