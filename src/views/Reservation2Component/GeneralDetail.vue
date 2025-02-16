<template>
  <div class="space-y-3">
    <div class="grid grid-cols-5 col-span-2 gap-4 py-3">
      <div
        class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
      >
        <p class="text-[10px] text-gray-500">Sales Date</p>
        <p class="text-sm">{{ detail?.booking.booking_date }}</p>
      </div>
      <div
        class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
      >
        <p class="text-[10px] text-gray-500">Item Sale Amount</p>
        <p class="text-sm">{{ detail?.amount }} thb</p>
      </div>
      <div
        class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
      >
        <p class="text-[10px] text-gray-500">Item Discount</p>
        <p class="text-sm">{{ detail?.discount }}</p>
      </div>
      <div
        class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
      >
        <p class="text-[10px] text-gray-500">Balance Due</p>
        <p class="text-sm">{{ detail?.booking?.balance_due }}</p>
      </div>
      <div
        class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
      >
        <p class="text-[10px] text-gray-500">Payment Method</p>
        <p class="text-sm">{{ detail?.booking?.payment_method }}</p>
      </div>
      <div
        class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
      >
        <p class="text-[10px] text-gray-500">Total Quantity</p>
        <p class="text-sm">
          {{
            detail?.quantity +
            (detail?.individual_pricing?.child?.quantity ?? 0) * 1
          }}
        </p>
      </div>
      <div
        class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
      >
        <p class="text-[10px] text-gray-500">Total Cost</p>
        <p class="text-sm">{{ detail?.total_cost_price }}</p>
      </div>
      <div
        class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
      >
        <p class="text-[10px] text-gray-500">Item Discount</p>
        <p class="text-sm">{{ detail?.discount }}</p>
      </div>
      <div
        class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
      >
        <p class="text-[10px] text-gray-500">Adult Qty</p>
        <p class="text-sm">{{ detail?.quantity }}</p>
      </div>
      <div
        class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
      >
        <p class="text-[10px] text-gray-500">Child Qty</p>
        <p class="text-sm">
          {{ detail?.individual_pricing?.child?.quantity ?? 0 }}
        </p>
      </div>
    </div>
    <div>
      <p
        class="px-2 py-1 bg-[#FF613c] text-white inline-block text-xs rounded-lg"
      >
        {{ detail?.crm_id }}
      </p>
    </div>
    <div class="pt-2 grid grid-cols-4 gap-4">
      <div
        @click="router.push(`/bookings/new-update/${detail?.booking?.id}`)"
        class="w-full min-h-[230px] border rounded-lg border-dashed flex justify-center items-center text-[#FF613c] border-[#FF613c] cursor-pointer"
      >
        <p class="px-2 py-1 text-[10px] text-[#FF613c] rounded-lg">
          Click to add payment
        </p>
      </div>
      <div
        v-for="i in detail?.booking?.receipts ?? []"
        :key="i"
        class="flex flex-col relative justify-stretch group space-y-2 w-full"
      >
        <p
          @click="openModal(i)"
          class="absolute top-4 cursor-pointer text-[8px] shadow right-2 text-xs text-white bg-[#FF613c] px-2 py-0.5 rounded-lg"
        >
          <span class="text-[10px]">edit</span>
        </p>
        <div
          @click="openModal(i)"
          class="w-full px-4 pb-1 border space-y-2 text-[#FF613c] border-gray-200 shadow hover:shadow-none rounded-lg"
        >
          <p class="text-[12px] flex justify-start items-center pt-2">
            <!-- <img :src="bathImage" alt="" class="w-4 h-4 mr-2" /> -->
            {{ i?.amount }} thb
          </p>
          <p class="text-[12px] flex justify-start items-center">
            <!-- <img :src="dateImage" alt="" class="w-3 h-3 mr-2" /> -->
            {{ i?.created_at }}
          </p>
        </div>
        <div class="h-[180px] w-full">
          <img
            :src="i?.image"
            class="rounded-lg shadow hover:shadow-none h-full object-cover w-full"
            alt=""
          />
        </div>
      </div>
    </div>

    <Modal :isOpen="carModalOpen" @closeModal="carModalOpen = false">
      <DialogPanel
        class="w-full max-w-xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-2 px-4"
        >
          <p>Payment Slip Audit</p>
          <XCircleIcon
            class="w-5 h-5 text-white"
            @click="carModalOpen = false"
          />
        </DialogTitle>
        <!-- show date  -->
        <div class="p-4">
          <div class="grid grid-cols-2 gap-8">
            <div>
              <img
                :src="save?.image"
                class="rounded-lg shadow hover:shadow-none h-auto w-full"
                alt=""
              />
            </div>
            <div class="space-y-4 relative pt-4">
              <div class="space-x-6">
                <label for="" class="text-[12px] font-medium">Amount</label>
                <input
                  type="text"
                  name=""
                  v-model="save.amount"
                  placeholder="Search CRM ID"
                  class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                  id=""
                />
              </div>
              <div class="space-x-6">
                <label for="" class="text-[12px] font-medium"
                  >Date <span class="opacity-0">......</span></label
                >
                <input
                  type="date"
                  name=""
                  v-model="save.created_at"
                  placeholder="Search CRM ID"
                  class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                  id=""
                />
              </div>
              <div class="space-x-6">
                <label for="" class="text-[12px] font-medium">Bank List</label>
                <select
                  name=""
                  id=""
                  class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                >
                  <option value="">Select Bank</option>
                  <option value="1">Bank A</option>
                  <option value="2">Bank B</option>
                  <option value="3">Bank C</option>
                </select>
              </div>
              <div
                class="flex justify-end items-center space-x-2 absolute bottom-0 right-0"
              >
                <p
                  class="px-3 py-1 bg-gray-500 text-white text-[12px] cursor-pointer rounded-lg"
                >
                  save
                </p>
                <p
                  @click="carModalOpen = false"
                  class="px-3 py-1 bg-white border border-gray-300 text-[12px] cursor-pointer rounded-lg"
                >
                  close
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Modal>
  </div>
</template>

<script setup>
import invoice from "../../assets/invoice_exp.jpg";
import { defineProps, ref } from "vue";
import dateImage from "../../assets/date.png";
import bathImage from "../../assets/baht.png";
import { PencilSquareIcon, XCircleIcon } from "@heroicons/vue/24/outline";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useRouter } from "vue-router";

const props = defineProps({
  detail: Object,
});

const router = useRouter();

const carModalOpen = ref(false);
const save = ref(null);

const openModal = (data) => {
  carModalOpen.value = true;
  save.value = data;
};
</script>
