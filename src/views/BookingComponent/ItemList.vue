<script setup>
import { TrashIcon, PencilSquareIcon } from "@heroicons/vue/24/outline";
import { onMounted, defineProps, ref, defineEmits } from "vue";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";

const props = defineProps({
  data: Object,
});
const emit = defineEmits(["remove"]);
const itemList = ref([]);
const editIndex = ref("");
const openModal = ref(false);

const formitem = ref({
  reservation_id: null,
  product_type: "",
  product_id: "",
  car_id: "",
  car_list: [],
  discount: 0,
  room_id: "",
  room: null,
  service_date: "",
  quantity: "1",
  days: "",
  duration: "",
  selling_price: "",
  comment: "",
  reservation_status: "",
  payment_method: "",
  payment_status: "",
  amount: "",
  exchange_rate: "",
  cost_price: "",
  special_request: "",
  total_amount: "",
  pickup_location: "",
  pickup_time: "",
  is_driver_collect: false,
  dropoff_location: "",
  route_plan: "",
  checkin_date: "",
  room_number: "",
  checkout_date: "",
  customer_attachment: "",
});

const getRemoveFunction = (id) => {
  emit("remove", id);
};

const editAction = (index, data) => {
  editIndex.value = index;
  formitem.value = data;
  openModal.value = true;
  console.log("====================================");
  console.log(formitem.value, "this is formitem");
  console.log("====================================");
};

const closeModalAction = () => {
  editIndex.value = "";
  formitem.value = {
    reservation_id: null,
    product_type: "",
    product_name: "",
    item_name: "",
    product_id: "",
    car_id: "",
    car_list: [],
    discount: 0,
    room_id: "",
    room: null,
    service_date: "",
    quantity: "1",
    days: "",
    duration: "",
    selling_price: "",
    comment: "",
    reservation_status: "",
    payment_method: "",
    payment_status: "",
    amount: "",
    exchange_rate: "",
    cost_price: "",
    special_request: "",
    total_amount: "",
    pickup_location: "",
    pickup_time: "",
    is_driver_collect: false,
    dropoff_location: "",
    route_plan: "",
    checkin_date: "",
    room_number: "",
    checkout_date: "",
    customer_attachment: "",
  };
  openModal.value = false;
};

const addItemModal = ref(false);
const addInfoModal = ref(false);

const nextState = () => {
  openModal.value = true;
  addItemModal.value = false;
};

const openAddItemModalAction = () => {
  openModal.value = false;
  addItemModal.value = true;
};

const selectAction = (item) => {
  console.log("====================================");
  console.log(item);
  console.log("====================================");
  formitem.value.car_id = item.id;
  formitem.value.item_name = item.name;
  formitem.value.selling_price = item.price;
  console.log(formitem.value, "this is formItem");
};

const goInfoModal = () => {
  console.log("====================================");
  console.log(formitem.value, "this is item");
  console.log("====================================");

  todayVali.value = true;
  addItemModal.value = false;
  openModal.value = false;
  addInfoModal.value = true;
};

const todayVali = ref(false);
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const isAfterToday = (date) => {
  const today = new Date();
  let selectDate = new Date(date);
  // console.log(formatDate(today) == formatDate(selectDate), "this is date ");

  return formatDate(selectDate) >= formatDate(today);
};
const todayCheck = () => {
  console.log(formitem.value.service_date);
  todayVali.value = isAfterToday(formitem.value.service_date);
  console.log(todayVali.value, "this is value");
};

// send item
const getFunction = () => {
  formitem.value.total_amount =
    formitem.value.selling_price * formitem.value.quantity -
    formitem.value.discount;
  console.log("====================================");
  console.log(formitem.value, "thsi is ");
  console.log("====================================");
  // emit("formData", formitem.value);
  cancelAction();
};

const cancelAction = () => {
  closeModalAction();
  addItemModal.value = false;
  addInfoModal.value = false;
};

onMounted(() => {
  console.log("====================================");
  console.log(props.data, "this is props");
  if (props.data) {
    itemList.value = props.data.items;
  }
  console.log("====================================");
});
</script>
<template>
  <div class="relative w-full h-full">
    <h1
      class="sticky top-0 bg-white z-10 py-2 text-xs font-medium text-[#ff613c]"
    >
      Added items ({{ itemList.length }})
    </h1>
    <div
      class="space-y-3 divide-y-2 pb-3 divide-gray-200"
      v-if="itemList.length > 0"
    >
      <div
        class="flex justify-start items-start gap-x-2 pt-3"
        v-for="(i, index) in itemList ?? []"
        :key="i"
      >
        <img
          src="https://placehold.co/400"
          class="w-16 h-16 rounded-lg"
          alt=""
        />
        <div class="w-full space-y-0.5">
          <div class="flex justify-between items-center">
            <p class="text-xs font-medium">{{ i?.product_name }}</p>
            <div class="flex justify-end items-center gap-x-2">
              <PencilSquareIcon
                class="w-4 h-4 cursor-pointer text-blue-800"
                @click="editAction(index, i)"
              />
              <TrashIcon
                class="w-4 h-4 cursor-pointer text-red-800"
                @click="getRemoveFunction(i?.product_id)"
              />
            </div>
          </div>
          <p class="text-[10px] pt-1">{{ i?.item_name }}</p>
          <div class="flex justify-between items-center">
            <p class="text-[10px]">{{ i?.service_date }}</p>
            <p class="text-[10px]">
              Discount :
              <span class="font-medium text-xs">{{ i?.discount }} ฿</span>
            </p>
          </div>
          <div class="flex justify-between items-center">
            <p class="text-[10px]">
              {{ i?.quantity }} x {{ i?.selling_price }} ฿
            </p>
            <p class="text-[10px]">
              Amount :
              <span class="font-medium text-sm">{{ i?.total_amount }} ฿</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="itemList.length == 0"
      class="text-xs font-medium text-gray-500 w-full h-[200px] flex justify-center items-center"
    >
      <p>please add items !</p>
    </div>
    <!-- choose room type modal -->
    <Modal :isOpen="openModal" @closeModal="closeModalAction">
      <DialogPanel
        class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-1"
        >
          Choose Detail Type
        </DialogTitle>
        <div class="space-y-2.5 pb-3 border-b border-gray-300">
          <p class="text-xs text-gray-500">Please Choose detail type.</p>
        </div>
        <div class="h-[300px] overflow-y-scroll">
          <div class="bg-white p-2 rounded-xl border mt-2 shadow-sm space-y-2">
            <div class="flex justify-start items-start gap-x-2">
              <img
                src="https://placehold.co/400"
                class="w-16 h-16 rounded-lg"
                alt=""
              />

              <div class="w-full">
                <p class="text-sm font-medium pb-1 text-[#ff613c] line-clamp-1">
                  <!-- {{ formitem?.product_name }} -->
                  Change type
                </p>
                <p class="text-xs">{{ formitem.item_name }}</p>
                <div class="flex justify-between items-center">
                  <p class="text-xs">{{ formitem?.quantity }} Qty</p>
                  <div class="flex justify-end items-center">
                    <p
                      @click="openAddItemModalAction"
                      class="text-xs font-medium bg-[#ff613c] rounded-lg px-4 py-1 text-white"
                    >
                      Edit
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white p-2 rounded-xl border mt-2 shadow-sm space-y-2">
            <div class="flex justify-start items-start gap-x-2">
              <img
                src="https://placehold.co/400"
                class="w-16 h-16 rounded-lg"
                alt=""
              />

              <div class="w-full">
                <p class="text-sm font-medium pb-1 line-clamp-1">
                  Booking information
                </p>
                <p class="text-xs">{{ formitem.service_date }}</p>
                <div class="flex justify-between items-center">
                  <p class="text-xs">
                    {{
                      formitem?.is_driver_collect ? "collect" : "bank tranfer"
                    }}
                  </p>
                  <div class="flex justify-end items-center">
                    <p
                      @click="goInfoModal"
                      class="text-xs font-medium bg-[#ff613c] rounded-lg px-4 py-1 text-white"
                    >
                      Edit
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end items-center gap-x-2 pt-2">
          <button
            @click="closeModalAction"
            class="bg-white border border-gray-300 px-3 py-2.5 rounded-lg text-xs"
          >
            Cancel
          </button>
        </div>
      </DialogPanel>
    </Modal>

    <!-- choose room type modal -->
    <Modal :isOpen="addItemModal" @closeModal="addItemModal = false">
      <DialogPanel
        class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-1"
        >
          Choose Car Type
        </DialogTitle>
        <div class="space-y-2.5 pb-3 border-b border-gray-300">
          <p class="text-xs text-gray-500">Please Choose the Car type.</p>
          <div class="relative w-full border border-gray-300 rounded-lg">
            <input
              type="text"
              v-model="search"
              class="bg-white w-full px-8 py-2 rounded-lg focus:outline-none text-[10px]"
              placeholder="Search Car Type"
            />
            <MagnifyingGlassIcon
              class="w-4 h-4 absolute text-[#ff613c] top-2 left-2"
            />
          </div>
        </div>
        <div class="h-[300px] overflow-y-scroll pr-2">
          <div
            class="bg-white p-2 rounded-xl border mt-2 shadow-sm space-y-2"
            v-for="i in formitem.car_list.length > 0 ? formitem.car_list : []"
            :key="i"
            @click="selectAction(i)"
            :class="
              formitem.car_id == i.id
                ? 'border-[#ff613c] bg-[#ff613c]/20'
                : 'border-gray-200'
            "
          >
            <div class="flex justify-start items-start gap-x-2">
              <img
                src="https://placehold.co/400"
                class="w-16 h-16 rounded-lg"
                alt=""
              />
              <div class="flex justify-between items-start w-full h-16">
                <div class="space-y-1">
                  <p class="text-sm font-medium text-[#ff613c]">{{ i.name }}</p>
                  <p class="text-xs">{{ i.max_person }} Pax</p>
                </div>
                <div class="my-auto">
                  <p class="text-xs font-semibold whitespace-nowrap">
                    <span class="text-lg">{{ i?.price }}</span> / car
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end items-center gap-x-2 pt-2">
          <button
            @click="cancelAction"
            class="bg-white border border-gray-300 px-3 py-2.5 rounded-lg text-xs"
          >
            Cancel
          </button>
          <button
            @click="goInfoModal"
            class="bg-[#ff613c] text-white px-3 py-2.5 rounded-lg text-xs"
            :class="formitem.car_id ? 'bg-[#ff613c]' : 'bg-gray-300'"
          >
            Next : Details
          </button>
        </div>
      </DialogPanel>
    </Modal>

    <!-- choose info booking modal -->
    <Modal :isOpen="addInfoModal" @closeModal="addInfoModal = false">
      <DialogPanel
        class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-1"
        >
          Provide Booking Information
        </DialogTitle>
        <div class="space-y-2.5 pb-3 border-b border-gray-300">
          <p class="text-xs text-gray-500">
            Please provide booking information.
          </p>
        </div>
        <div class="h-[450px] overflow-y-scroll py-2 space-y-2 pr-1">
          <div class="grid grid-cols-2 gap-x-2">
            <div class="space-y-1" v-if="formitem.product_type == 1">
              <label for="" class="text-[12px] text-gray-500"
                >Pick up time</label
              >
              <input
                type="time"
                v-model="formitem.pickup_time"
                name=""
                class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                id=""
              />
            </div>
            <div class="space-y-1">
              <label for="" class="text-[12px] text-gray-500"
                >Service date</label
              >
              <input
                type="date"
                v-model="formitem.service_date"
                @change="todayCheck"
                name=""
                class="border w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                :class="
                  todayVali ? 'border-gray-300' : 'border-red-600 text-red-600'
                "
                id=""
              />
              <p v-if="!todayVali" class="text-[8px] text-red-600">
                ! please change date
              </p>
            </div>
          </div>
          <div class="space-y-1" v-if="formitem.product_type == 1">
            <label for="" class="text-[12px] text-gray-500"
              >Pick up location</label
            >
            <input
              type="text"
              v-model="formitem.pickup_location"
              name=""
              class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
              id=""
            />
          </div>
          <div class="grid grid-cols-2 gap-x-2">
            <div class="space-y-1" v-if="formitem.product_type == 1">
              <label for="" class="text-[12px] text-gray-500"
                >Payment Method</label
              >
              <div class="flex justify-start items-center gap-x-2">
                <input
                  type="checkbox"
                  name=""
                  v-model="formitem.is_driver_collect"
                  class="px-4 w-6 h-6 py-4 text-sm border border-gray-300 rounded-sm focus:outline-none"
                  id=""
                />
                <p class="text-xs">Is Driver Collect ?</p>
              </div>
            </div>
            <div class="space-y-1">
              <label for="" class="text-[12px] text-gray-500">Qty</label>
              <input
                type="number"
                v-model="formitem.quantity"
                name=""
                class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                id=""
              />
            </div>
          </div>
          <div class="space-y-1">
            <label for="" class="text-[12px] text-gray-500">Discount</label>
            <input
              type="number"
              v-model="formitem.discount"
              name=""
              class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
              id=""
            />
          </div>
          <div class="space-y-1" v-if="formitem.product_type == 1">
            <label for="" class="text-[12px] text-gray-500">Route Plan</label>
            <textarea
              name=""
              v-model="formitem.route_plan"
              class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
              id=""
            ></textarea>
          </div>
          <div class="space-y-1">
            <label for="" class="text-[12px] text-gray-500"
              >Special Request</label
            >
            <textarea
              name=""
              v-model="formitem.special_request"
              class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
              id=""
            ></textarea>
          </div>
          <div class="space-y-1">
            <label for="" class="text-[12px] text-gray-500">Description</label>
            <textarea
              name=""
              v-model="formitem.comment"
              class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
              id=""
            ></textarea>
          </div>
        </div>
        <div class="flex justify-end items-center gap-x-2 pt-2">
          <button
            @click="cancelAction"
            class="bg-white border border-gray-300 px-3 py-2.5 rounded-lg text-xs"
          >
            Cancel
          </button>
          <button
            v-if="formitem.product_id && todayVali"
            @click="getFunction"
            class="bg-[#ff613c] text-white px-3 py-2.5 rounded-lg text-xs"
            :class="todayVali ? 'bg-[#ff613c]' : 'bg-gray-300'"
          >
            Add Item
          </button>
          <button
            v-if="!formitem.product_id || !todayVali"
            class="bg-[#ff613c] text-white px-3 py-2.5 rounded-lg text-xs"
            :class="todayVali ? 'bg-[#ff613c]' : 'bg-gray-300'"
          >
            Add Item
          </button>
        </div>
      </DialogPanel>
    </Modal>
  </div>
</template>
