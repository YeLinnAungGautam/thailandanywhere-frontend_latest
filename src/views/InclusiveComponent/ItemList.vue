<script setup>
import { TrashIcon, PencilSquareIcon } from "@heroicons/vue/24/outline";
import { onMounted, defineProps, ref, defineEmits, watch } from "vue";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import van from "../../../public/1.png";
import saloon from "../../../public/2.png";
import deluxe from "../../../public/3.png";
import { useAuthStore } from "../../stores/auth";
import { useHotelStore } from "../../stores/hotel";

const props = defineProps({
  data: Object,
});
const emit = defineEmits(["remove"]);
const itemList = ref([]);
const editIndex = ref("");
const openModal = ref(false);
const authStore = useAuthStore();
const hotelStore = useHotelStore();

const formitem = ref({
  reservation_id: null,
  product_type: "",
  product_id: "",
  car_id: "",
  car_list: [],
  day: 1,
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

const getRemoveFunction = (id, index) => {
  let data = {
    id: id,
    index: index,
  };
  console.log("====================================");
  console.log(data, "this is emit id");
  console.log("====================================");
  emit("remove", data);
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
  formitem.value.car_id = item.id;
  console.log("====================================");
  console.log(item, "this is selected item");
  console.log("====================================");
  if (formitem.value.product_type != 7) {
    formitem.value.item_name = item.name;
    if (formitem.value.product_type == 1) {
      let des = formitem.value.comment.replace(/^[^;]*;\s*/, "");
      formitem.value.comment = `Car Type : ${item.name} ; ${des}`;
      // formitem.value.selling_price = item.price ? item.price : item.room_price;
    }
    formitem.value.selling_price = item.price ? item.price : item.room_price;
    if (formitem.value.product_type == 6) {
      formitem.value.cost_price = item.cost ? item.cost : 0;
      formitem.value.selling_price = item.room_price
        ? item.room_price
        : item.price;
    }
    if (formitem.value.product_type == 4) {
      formitem.value.cost_price = item.cost_price ? item.cost_price : 0;
      formitem.value.comment = `Variation : ${formitem.value.item_name}`;
    }
  }
  if (formitem.value.product_type == 7) {
    formitem.value.item_name = item.description;
    formitem.value.comment = `Ticket : ${formitem.value.item_name}`;
  }
  console.log(formitem.value, "this is formItem");
  getFunction();
};

const goInfoModal = () => {
  console.log("====================================");
  console.log(formitem.value, "this is item");
  addItemModal.value = false;
  openModal.value = false;
  addInfoModal.value = true;
};
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

// send item
const getFunction = () => {
  formitem.value.total_amount = formitem.value.selling_price * 1;

  console.log("====================================");
  console.log(formitem.value, "thsi is ");
  console.log("====================================");
  // emit("formData", formitem.value);
  // cancelAction();
};

const cancelAction = () => {
  getFunction();
  closeModalAction();
  addItemModal.value = false;
  addInfoModal.value = false;
};

const getCarImage = (type) => {
  // Define the car images for each van tour type
  const carImages = {
    car1: van,
    car2: saloon,
    car3: deluxe,
    // Add more car types and their corresponding images as needed
  };

  // Return the car image based on the van tour type
  // return carImages[type.toLowerCase()] || 'https://placehold.co/400';
  switch (type) {
    case "SUV":
      return carImages["car2"]; // Use this for SUV logic
    case "Saloon":
      return carImages["car1"];
    case "VIP Van": // Example of a different case, instead of repeating 'SUV'
      return carImages["car2"];
    default:
      return carImages["car2"]; // Default case
  }
};

const calculateDaysBetween = (a, b) => {
  if (a && b) {
    const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const startDateTimestamp = new Date(a).getTime();
    const endDateTimestamp = new Date(b).getTime();
    let result = Math.abs(
      Math.round((endDateTimestamp - startDateTimestamp) / oneDay)
    );
    // formitem.value.days = result;
    return result;
  }
};

const checkRoomPrice = async () => {
  if (
    formitem.value.car_id != "" &&
    formitem.value.checkin_date != "" &&
    formitem.value.checkout_date != ""
  ) {
    let data = {
      checkin_date: formitem.value.checkin_date,
      checkout_date: formitem.value.checkout_date,
    };
    const res = await hotelStore.getRoomPrice(data, formitem.value.car_id);
    console.log("====================================");
    console.log(res, "this is room price");
    console.log("====================================");
    // formitem.value.selling_price = res.data.room_price;
    // formitem.value.selling_price = res.data.room_price;
    // formitem.value.cost_price = res.data.room?.cost ? res.data.room.cost : 0;
  } else {
    console.log("need to fill");
  }
};

const calculateRateRoom = () => {
  if (formitem.value.checkin_date && formitem.value.checkout_date) {
    formitem.value.days = calculateDaysBetween(
      formitem.value.checkin_date,
      formitem.value.checkout_date
    );
  }
};

watch(
  () => [
    formitem.value.service_date,
    formitem.value.checkout_date,
    formitem.value.item_name,
  ],
  ([newData, secData, thirdData]) => {
    if (formitem.value.product_type == "6") {
      // checkRoomPrice();
      formitem.value.checkin_date = formitem.value.service_date;
      formitem.value.comment = `Room : ${formitem.value.item_name}; Checkin : ${formitem.value.checkin_date} Checkout : ${formitem.value.checkout_date}`;
    }
    calculateRateRoom();
  }
);

watch(
  () => props.data?.items, // Watch for changes in items
  (newItems) => {
    console.log("props.data.items changed:", newItems);
    if (newItems) {
      itemList.value = newItems; // Update itemList when items change
    }
  },
  { deep: true, immediate: true } // Optional: immediate triggers the callback initially
);

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
    <div
      class="sticky top-0 bg-white z-10 py-2 text-xs font-medium text-[#ff613c] flex justify-between items-center"
    >
      <p>Added items</p>
      <p>
        {{ data?.is_inclusive ? itemList.length - 1 : itemList.length }} items
      </p>
    </div>
    <div
      class="space-y-3 divide-y-2 pb-3 divide-gray-200"
      v-if="itemList.length > 0"
    >
      <div
        class="flex justify-start items-start gap-x-2 pt-3"
        v-for="(i, index) in itemList ?? []"
        :key="i"
        :class="i?.product_type != undefined ? '' : 'hidden'"
      >
        <img
          :src="
            i?.product_image ? i?.product_image : 'https://placehold.co/400'
          "
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
                @click="getRemoveFunction(i?.product_id, index)"
              />
            </div>
          </div>
          <p
            v-if="i?.crm_id"
            class="text-[10px] mt-1 bg-[#ff613c] py-0.5 text-white px-2 inline-block rounded-md"
          >
            {{ i?.crm_id }}
          </p>
          <p class="text-[10px] pt-1">{{ i?.item_name }}</p>

          <div class="flex justify-between items-center">
            <p class="text-[10px]">Day :</p>
            <p
              class="font-semibold bg-[#FF613c] text-white text-sm border border-gray-100 rounded-lg px-3 py-1"
            >
              Day {{ i?.day }}
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
                      formitem?.day
                        ? "change day " + formitem.day
                        : "choose day"
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
    <Modal :isOpen="addItemModal" @closeModal="cancelAction">
      <DialogPanel
        class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-1"
        >
          Choose Type
        </DialogTitle>
        <div class="space-y-2.5 pb-3 border-b border-gray-300">
          <p class="text-xs text-gray-500">Please Choose the type.</p>
          <div class="relative w-full border border-gray-300 rounded-lg">
            <input
              type="text"
              v-model="search"
              class="bg-white w-full px-8 py-2 rounded-lg focus:outline-none text-[10px]"
              placeholder="Search Type"
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
            <div
              class="flex justify-start items-start gap-x-2"
              v-if="formitem?.product_type == 1"
            >
              <img
                :src="getCarImage(i.name)"
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
            <div
              class="flex justify-start items-start gap-x-2"
              v-if="formitem?.product_type == 4"
            >
              <img
                :src="
                  i?.cover_image ? i.cover_image : 'https://placehold.co/400'
                "
                class="w-16 h-16 rounded-lg"
                alt=""
              />
              <div class="flex justify-between items-start w-full">
                <div class="space-y-1">
                  <p class="text-xs font-medium text-[#ff613c]">{{ i.name }}</p>
                  <div class="flex justify-start items-center gap-x-1">
                    <p
                      class="text-[8px] text-white px-2 py-0.5 rounded-full inline-block"
                      :class="
                        i?.meta_data != null &&
                        JSON.parse(i?.meta_data)[0].is_main == 1
                          ? 'bg-green-500'
                          : 'hidden'
                      "
                    >
                      {{
                        i?.meta_data != null &&
                        JSON.parse(i?.meta_data)[0].is_show == 1
                          ? "main"
                          : "-"
                      }}
                    </p>
                    <p
                      class="text-[8px] text-white px-2 py-0.5 rounded-full inline-block"
                      :class="
                        i?.meta_data != null &&
                        JSON.parse(i?.meta_data)[0].is_show == 1
                          ? 'bg-green-500'
                          : 'hidden'
                      "
                    >
                      {{
                        i?.meta_data != null &&
                        JSON.parse(i?.meta_data)[0].is_show == 1
                          ? "show"
                          : "no show"
                      }}
                    </p>
                  </div>
                  <div>
                    <p
                      class="text-[10px] text-gray-800"
                      v-for="a in i?.including_services != null &&
                      i?.including_services != ''
                        ? JSON.parse(i?.including_services)
                        : []"
                      :key="a"
                    >
                      <span
                        class="h-1.5 w-1.5 mr-2 bg-gray-500 inline-block rounded-full"
                      ></span
                      >{{ a }}
                    </p>
                  </div>
                </div>
                <div class="my-auto">
                  <p class="text-xs font-semibold whitespace-nowrap">
                    <span class="text-lg">{{ i?.price }}</span> / ticket
                  </p>
                </div>
              </div>
            </div>
            <div
              class="flex justify-start items-start gap-x-2"
              v-if="formitem?.product_type == 5"
            >
              <img
                :src="
                  i.images[0]?.image
                    ? i.images[0]?.image
                    : 'https://placehold.co/400'
                "
                class="w-16 h-16 rounded-lg"
                alt=""
              />
              <div class="flex justify-between items-start w-full gap-x-2">
                <div class="space-y-1">
                  <p class="text-xs font-medium text-[#ff613c]">{{ i.name }}</p>
                  <p class="text-xs">{{ i.max_person }} Pax</p>
                  <p class="text-[10px] text-green-600">
                    {{ i?.has_breakfast == 1 ? "Breakfast included" : "" }}
                  </p>
                </div>
                <div class="my-auto">
                  <p class="text-xs font-semibold whitespace-nowrap">
                    <span class="text-lg">{{ i?.room_price }}</span> / night
                  </p>
                </div>
              </div>
            </div>
            <div v-if="formitem?.product_type == 6">
              <div class="flex justify-start items-start gap-x-2">
                <img
                  src="https://placehold.co/400"
                  class="w-16 h-16 object-cover rounded-lg"
                  alt=""
                />
                <div
                  class="flex justify-between items-start gap-x-2 w-full h-auto"
                >
                  <div class="pt-2">
                    <p class="text-xs font-medium">{{ i?.description }}</p>
                  </div>
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
          <div class="space-y-2">
            <label for="" class="text-[12px] text-gray-500">Day *</label>
            <input
              type="number"
              v-model="formitem.day"
              class="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none text-xs w-full"
            />
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
            v-if="formitem.product_id && formitem.day"
            @click="cancelAction"
            class="bg-[#ff613c] text-white px-3 py-2.5 rounded-lg text-xs"
            :class="formitem.day ? 'bg-[#ff613c]' : 'bg-gray-300'"
          >
            Add Item
          </button>
          <button
            v-if="!formitem.product_id || !formitem.day"
            class="bg-[#ff613c] text-white px-3 py-2.5 rounded-lg text-xs"
            :class="formitem.day ? 'bg-[#ff613c]' : 'bg-gray-300'"
          >
            Add Item
          </button>
        </div>
      </DialogPanel>
    </Modal>
  </div>
</template>
