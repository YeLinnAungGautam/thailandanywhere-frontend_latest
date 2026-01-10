<template>
  <Modal :isOpen="openModal" @closeModal="closeAction">
    <DialogPanel
      class="w-full max-w-xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all"
    >
      <DialogTitle
        as="div"
        class="text-lg font-medium leading-6 text-gray-900 mb-3 flex justify-between items-center"
      >
        Booking Copy For Line
        <button
          type="button"
          class="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="closeAction"
        >
          <XMarkIcon class="w-6 h-6 text-black cursor-pointer" />
          <span class="sr-only">Close</span>
        </button>
      </DialogTitle>

      <div class="text-sm" v-if="!isNext">
        <p class="pb-3">Select item at least one</p>
        <div
          class="pt-3 space-y-2"
          v-for="i in bookingItem?.items ?? []"
          :key="i"
        >
          <div
            class="border border-gray-200 p-4 rounded-lg space-y-2"
            :class="{ 'bg-[#FF613c] text-white': i.id == selected?.id }"
            @click="selectedAction(i)"
          >
            <p>{{ i.variation?.name }} {{ i.room?.name }}</p>
            <div
              class="flex justify-start items-center gap-x-2"
              :class="{ ' text-[#FF613c]': i.id == selected?.id }"
            >
              <p class="px-3 py-1 rounded-lg text-xs bg-gray-100">
                {{ i.crm_id }}
              </p>
              <p class="px-3 py-1 rounded-lg text-xs bg-gray-100">
                {{ i.service_date }}
              </p>
            </div>
          </div>
        </div>
        <div class="flex justify-end items-center mt-6">
          <p
            @click="nextAction"
            class="px-8 py-2 bg-[#FF613c] border border-[#FF613c] text-white cursor-pointer rounded-lg"
            :class="{
              'cursor-not-allowed border-gray-300 bg-gray-300': !Isselected,
            }"
          >
            Next
          </p>
        </div>
      </div>

      <div class="text-sm" v-if="isNext && selected != null">
        <p class="pb-3">
          Choose one traveller (recommended choose in traveller)
        </p>
        <div class="pt-3 space-y-2" v-for="i in passportLists ?? []" :key="i">
          <div
            class="border border-gray-200 flex justify-start space-x-4 items-start p-4 rounded-lg space-y-2"
            :class="userName == i?.meta?.name ? 'bg-[#FF613c] text-white' : ''"
            @click="selectedUserAction(i?.meta?.name)"
          >
            <img
              v-if="i?.file"
              :src="i?.file"
              alt=""
              class="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <p>{{ i?.meta?.name }}</p>
              <div class="flex justify-start items-center gap-x-2 pt-2">
                <p
                  :class="userName == i?.meta?.name ? 'text-[#FF613c]' : ''"
                  class="px-3 py-1 rounded-lg text[#FF613c] text-xs bg-gray-100"
                >
                  {{ i?.meta?.passport_number }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="relative py-4 mt-3">
          <div
            class="absolute -top-0 left-[45%] w-auto px-4 z-10 h-full bg-white rounded-lg"
          >
            Or
          </div>
          <div class="h-0.5 w-full bg-gray-700 absolute top-2 left-0"></div>
        </div>
        <div
          class="border border-gray-200 flex justify-start space-x-4 items-start p-4 rounded-lg space-y-2"
          :class="
            userName == selected?.customer_info?.name
              ? 'bg-[#FF613c] text-white'
              : ''
          "
          @click="selectedUserAction(selected?.customer_info?.name)"
        >
          <div>
            <p class="text-xs">Customer Name</p>
            <div class="flex justify-start items-center gap-x-2 pt-2">
              <p class="text-sm font-medium">
                {{ selected?.customer_info?.name }}
              </p>
            </div>
          </div>
        </div>
        <div class="flex justify-end space-x-3 items-center mt-6">
          <p
            @click="
              () => {
                isNext = false;
                userName = null;
              }
            "
            class="px-8 py-2 border border-[#FF613c] text-[#FF613c] cursor-pointer rounded-lg"
            :class="{ 'cursor-not-allowed bg-gray-300': !Isselected }"
          >
            Prev
          </p>
          <p
            @click="copyAction"
            class="px-8 py-2 bg-[#FF613c] border border-[#FF613c] text-white cursor-pointer rounded-lg"
            :class="{ 'cursor-not-allowed bg-gray-300': !Isselected }"
          >
            Copy
          </p>
        </div>
      </div>
    </DialogPanel>
  </Modal>
</template>

<script setup>
import Modal from "../../components/Modal.vue";
import { ref, defineProps, defineEmits, onMounted } from "vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { useToast } from "vue-toastification";
import { formattedDate, getFormatDate } from "../help/FormatData";
import { useGroupStore } from "../../stores/group";
import { useRoute } from "vue-router";

const route = useRoute();

const props = defineProps({
  openModal: Boolean,
  bookingItem: Object,
  closeModal: Function,
});

const passportLists = ref([]);
const loading = ref(false);
const groupStore = useGroupStore();

const getListAction = async () => {
  loading.value = true;
  const id = props.bookingItem.id;
  if (id) {
    const res = await groupStore.groupDocumentList(id, {
      document_type: "passport",
    });
    console.log(res);
    passportLists.value = res.result;
    loading.value = false;
  }
};

const selected = ref(null);
const Isselected = ref(false);
const userName = ref(null);
const isNext = ref(false);
const toast = useToast();

const selectedAction = (data) => {
  Isselected.value = true;
  selected.value = data;
  console.log(selected.value, "this is selected");
};

const selectedUserAction = (data) => {
  console.log("====================================");
  console.log(data);
  console.log("====================================");
  userName.value = data;
};

const closeAction = () => {
  selected.value = null;
  Isselected.value = false;
  userName.value = null;
  props.closeModal();
};

const nextAction = () => {
  if (selected.value != null) {
    isNext.value = true;
  }
};

const copyAction = () => {
  console.log("====================================", selected.value);
  if (userName.value != null) {
    let output = "";

    output += `TH Anywhere Travel and Tour \n
🚢_${selected.value.product?.name}_ 🛳 \n
Date: ${getFormatDate(selected.value.service_date)}
Ticket: ${selected.value.variation?.name}
Name: ${userName.value}
Total: ${selected.value.quantity}Adult ${
      selected.value.individual_pricing?.child?.quantity
        ? selected.value.individual_pricing?.child?.quantity
        : ""
    }${selected.value.individual_pricing?.child?.quantity ? "Child" : ""}
ID: ${selected.value.crm_id} \n
Special Request: ${selected.value.special_request} \n
Officer: Sunshine
Contact: 0950423254, 0637602448 \n
Payment will be done soon. \n
Thank You ❤️
`;

    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
    closeAction();
  }
};

onMounted(() => {
  console.log(props.bookingItem, "this is booking item from booking ");
  if (props.bookingItem) {
    getListAction();
  }
});
</script>
