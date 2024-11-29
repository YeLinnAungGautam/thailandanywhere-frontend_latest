<script setup>
import { ref, onMounted, watch, computed, defineEmits } from "vue";
import {
  MagnifyingGlassIcon,
  BarsArrowDownIcon,
} from "@heroicons/vue/24/outline";
import { useAirLineStore } from "../../stores/airline";
import { storeToRefs } from "pinia";
import debounce from "lodash/debounce";
import { InformationCircleIcon } from "@heroicons/vue/24/solid";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useRouter } from "vue-router";
// import { useCityStore } from "../../stores/city";

const bottomOfWindow = ref(false);
const airlineStore = useAirLineStore();
// const cityStore = useCityStore();
// const { cities } = storeToRefs(cityStore);
const { airlines, loading } = storeToRefs(airlineStore);
const destsList = ref([]);
const search = ref("");
// const type = ref("van_tour");
const router = useRouter();
const addItemModal = ref(false);
const addInfoModal = ref(false);
const detailModal = ref(false);
const details = ref(null);
const details_images = ref([]);

const viewDetail = (data) => {
  console.log(data, "this is data");
  details_images.value = [];
  details.value = data;
  detailModal.value = true;
  if (details.value != null) {
    details_images.value.push(details.value.cover_image);
    for (let i = 0; i < details.value.images.length; i++) {
      details_images.value.push(details.value.images[i].image);
    }
  }
  console.log(details_images.value, "this is images");
};

const closeDetail = () => {
  detailModal.value = false;
  details.value = null;
  details_images.value = [];
};

const emit = defineEmits(["formData"]);

const formitem = ref({
  reservation_id: null,
  product_type: 7,
  product_id: "",
  product_name: "",
  product_image: "",
  item_name: "",
  car_id: "",
  car_list: [],
  room_id: "",
  room: null,
  service_date: "",
  quantity: "1",
  discount: 0,
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

// add item function
const openAddItemModal = (item) => {
  console.log("====================================");
  console.log(item);
  console.log("====================================");
  closeDetail();

  // formitem.value.comment = item.long_description ? item.long_description : "";
  formitem.value.product_id = item.id;
  formitem.value.product_name = item.name;
  formitem.value.product_image = item.cover_image;
  if (item?.tickets.length > 0) {
    formitem.value.car_list = item?.tickets;
  }
  addItemModal.value = true;
  console.log("====================================");
  console.log(formitem.value, "this is item");
  console.log("====================================");
};
const closeItemModal = () => {
  addItemModal.value = false;
  formitem.value.car_id = "";
  formitem.value.car_list = [];
  formitem.value.product_id = "";
  formitem.value.product_name = "";
  formitem.value.product_image = "";
  formitem.value.item_name = "";
  formitem.value.selling_price = "";
};
const selectAction = (item) => {
  formitem.value.car_id = item.id;
  formitem.value.item_name = item.description;
  formitem.value.selling_price = item.price;
  formitem.value.cost_price = item.cost_price ? item.cost_price : 0;
  formitem.value.comment = `Ticket : ${formitem.value.item_name}`;
  console.log(formitem.value, "this is formItem");
};
const goInfoModal = () => {
  if (formitem.value.car_id != "") {
    addItemModal.value = false;
    addInfoModal.value = true;
  }
};

const handleScroll = (event) => {
  const target = event.target;
  const isAtBottom =
    Math.floor(target.scrollTop + target.clientHeight) >=
    target.scrollHeight - 100;
  bottomOfWindow.value = isAtBottom;
};

const changePage = async (url) => {
  console.log(url);
  if (url != null) {
    await airlineStore.getChangePage(url, watchSystem.value);
  }
};

// check isAfterToday
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

// cear item
const clearAction = () => {
  formitem.value = {
    reservation_id: null,
    product_type: 7,
    product_id: "",
    product_image: "",
    product_name: "",
    car_id: "",
    car_list: [],
    room_id: "",
    room: null,
    service_date: "",
    quantity: "1",
    discount: 0,
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
  todayVali.value = false;
  addInfoModal.value = false;
};

// send item
const getFunction = () => {
  formitem.value.total_amount =
    formitem.value.selling_price * formitem.value.quantity -
    formitem.value.discount;
  emit("formData", formitem.value);
  clearAction();
};

const backAction = () => {
  addInfoModal.value = false;
  addItemModal.value = true;
};

watch(bottomOfWindow, (newVal) => {
  console.log("bottomOfWindow changed:", newVal);
  if (bottomOfWindow.value == true) {
    let changePageCalled = false;
    if (newVal && !changePageCalled) {
      console.log("This is the bottom of the window");

      if (
        airlines?.value?.meta?.current_page < airlines?.value?.meta?.last_page
      ) {
        changePageCalled = true; // Set the flag to true

        changePage(
          airlines?.value?.meta?.links[airlines?.value?.meta?.current_page + 1]
            .url
        );
      }
    }
  }
});

const watchSystem = computed(() => {
  let result = {};
  if (search.value != null) {
    result.search = search.value;
  }
  result.limit = 20;
  // if (type.value != null) {
  //   result.type = type.value;
  // }

  return result;
});

watch(airlines, async (newValue) => {
  if (newValue) {
    destsList.value = [...destsList.value, ...newValue?.data];
    // console.log(destsList.value, "this is add new");
  }
});

watch(
  [search],
  debounce(async (newValue) => {
    destsList.value = [];
    await airlineStore.getListAction(watchSystem.value);
  }, 500)
);

onMounted(async () => {
  window.addEventListener("scroll", handleScroll);
  await airlineStore.getListAction(watchSystem.value);
  formitem.value.product_type = 7;
});
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h1 class="text-sm font-medium">Product Airline</h1>
    </div>
    <!-- search part -->
    <div
      class="flex justify-start items-center gap-x-2 flex-nowrap relative mr-2"
    >
      <div class="relative w-full">
        <input
          type="text"
          v-model="search"
          name=""
          class="bg-white w-full px-8 py-2.5 rounded-lg focus:outline-none text-xs"
          placeholder="Search for products here !"
          id=""
        />
        <MagnifyingGlassIcon
          class="w-4 h-4 absolute text-[#ff613c] top-2.5 left-2"
        />
        <!-- <div class="bg-white absolute bottom-[-30px] right-0">
          <p>van tour</p>
          <p>car rental</p>
        </div> -->
      </div>
      <div class="bg-[#ff613c] p-2 rounded-full">
        <!-- filter icon -->
        <BarsArrowDownIcon class="w-4 h-4 text-white" />
      </div>
      <div
        class="bg-[#ff613c] py-2 px-4 cursor-pointer text-xs text-white rounded-xl"
      >
        Search
      </div>
    </div>
    <!-- product part -->
    <div
      class="max-h-[60vh] grid grid-cols-3 gap-3 pr-4 overflow-y-scroll"
      @scroll="handleScroll"
    >
      <div
        class="bg-white px-2 pb-2 rounded-lg shadow-sm space-y-2 relative"
        v-for="i in destsList ?? []"
        :key="i"
      >
        <div class="right-1 top-1 rounded-full absolute" @click="viewDetail(i)">
          <InformationCircleIcon class="w-5 h-5 text-[#ff613c] bg-white" />
        </div>
        <div class="flex justify-start items-start gap-x-2">
          <img
            :src="
              i?.cover_image != null
                ? i?.cover_image
                : 'https://placehold.co/400'
            "
            class="w-16 h-16 rounded-lg"
            alt=""
          />
          <div>
            <p class="text-xs font-medium line-clamp-3">{{ i?.name }}</p>
            <!-- <p class="text-[10px]">{{ i?.type }}</p> -->
          </div>
        </div>
        <div class="flex justify-between items-center">
          <p class="font-medium">{{ i?.starting_balance }} ฿</p>
          <button
            @click="openAddItemModal(i)"
            class="bg-blue-500 text-white px-2 py-1 rounded-full text-[10px]"
          >
            + Add item
          </button>
        </div>
      </div>
      <div v-if="loading" class="text-xs p-6 text-center">
        <p>loading , please wait ...</p>
      </div>
    </div>

    <!-- choose room type modal -->
    <Modal :isOpen="addItemModal" @closeModal="addItemModal = false">
      <DialogPanel
        class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-1"
        >
          Choose Ticket Type
        </DialogTitle>
        <div class="space-y-2.5 pb-3 border-b border-gray-300">
          <p class="text-xs text-gray-500">Please Choose Ticket type.</p>
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
        <div class="flex justify-end items-center gap-x-2 pt-2">
          <button
            @click="closeItemModal"
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
            <!-- <div class="space-y-1">
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
            </div> -->
            <div class="space-y-1">
              <label for="" class="text-[12px] text-gray-500"
                >Service date <span class="text-red-800">*</span></label
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
          <!-- <div class="space-y-1">
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
          </div> -->
          <div class="grid grid-cols-2 gap-x-2">
            <!-- <div class="space-y-1">
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
            </div> -->
            <div class="space-y-1 col-span-2">
              <label for="" class="text-[12px] text-gray-500"
                >Ticket Info <span class="text-red-800">*</span></label
              >
              <div class="grid-cols-2 grid gap-2">
                <div class="relative space-y-1">
                  <label for="" class="text-xs text-gray-500"
                    >Selling Price <span class="text-red-800">*</span></label
                  >
                  <input
                    type="number"
                    v-model="formitem.selling_price"
                    name=""
                    class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                    id=""
                  />
                </div>
                <div class="relative space-y-1">
                  <label for="" class="text-xs text-gray-500"
                    >Ticket Qty <span class="text-red-800">*</span></label
                  >
                  <input
                    type="number"
                    v-model="formitem.quantity"
                    name=""
                    class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                    id=""
                  />
                  <p
                    @click="formitem.quantity++"
                    class="bg-[#ff613c]/10 text-[#ff613c] cursor-pointer inline-block px-2 z-50 rounded-lg absolute top-7 right-8"
                  >
                    +
                  </p>
                  <p
                    @click="formitem.quantity--"
                    v-if="formitem.quantity > 1"
                    class="bg-[#ff613c]/10 text-[#ff613c] cursor-pointer inline-block px-2 z-50 rounded-lg absolute top-7 right-1"
                  >
                    -
                  </p>
                  <p
                    v-if="formitem.quantity == 1"
                    class="bg-[#ff613c]/10 text-[#ff613c] cursor-pointer inline-block px-2 z-50 rounded-lg absolute top-7 right-1"
                  >
                    -
                  </p>
                </div>
              </div>
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
          <!-- <div class="space-y-1">
            <label for="" class="text-[12px] text-gray-500">Route Plan</label>
            <textarea
              name=""
              v-model="formitem.route_plan"
              class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
              id=""
            ></textarea>
          </div> -->
          <div class="space-y-1">
            <label for="" class="text-[12px] text-gray-500"
              >Special Request <span class="text-red-800">*</span></label
            >
            <textarea
              name=""
              v-model="formitem.special_request"
              class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
              id=""
            ></textarea>
          </div>
          <div class="space-y-1">
            <label for="" class="text-[12px] text-gray-500"
              >Description <span class="text-red-800">*</span></label
            >
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
            @click="clearAction"
            class="bg-white border border-gray-300 px-3 py-2.5 rounded-lg text-xs"
          >
            Cancel
          </button>
          <button
            @click="backAction"
            class="bg-white border border-gray-300 px-3 py-2.5 rounded-lg text-xs"
          >
            Back
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
            @click="getFunction"
            class="bg-[#ff613c] text-white px-3 py-2.5 rounded-lg text-xs"
            :class="todayVali ? 'bg-[#ff613c]' : 'bg-gray-300'"
          >
            Add Item
          </button>
        </div>
      </DialogPanel>
    </Modal>

    <!-- vantour detail  -->
    <!-- choose info booking modal -->
    <Modal :isOpen="detailModal" @closeModal="closeDetail">
      <DialogPanel
        class="w-full max-w-xl transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-1"
        >
          Attraction Information
        </DialogTitle>
        <div class="space-y-2.5 pb-3 border-b border-gray-300">
          <p class="text-xs text-gray-500">
            Please notify data issues if you see any incorrect data.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-2 pt-2">
          <!-- Large image on the left (index 0) -->
          <div class="col-span-1">
            <img
              :src="
                details_images[0]
                  ? details_images[0]
                  : 'https://placehold.co/400'
              "
              alt="Large Image"
              class="w-full h-[200px] object-cover object-center rounded-lg"
            />
          </div>

          <!-- Small images on the right -->
          <div class="flex flex-col gap-2 h-[200px] overflow-y-scroll">
            <img
              v-for="(img, index) in details_images.slice(1)"
              :key="index"
              :src="img ? img : 'https://placehold.co/400'"
              alt="Small Image"
              class="w-full min-h-[100px] h-full object-cover object-center rounded-lg"
            />
          </div>
        </div>
        <div class="py-4 space-y-1">
          <p class="text-sm font-medium text-[#ff613c]">{{ details?.name }}</p>
          <p class="text-xs text-[#ff613c] pb-3">
            {{ details?.variations?.length }} variations
          </p>
          <div
            class="flex justify-start items-center gap-x-2 w-full overflow-x-scroll no-scrollbar"
          >
            <div
              v-for="i in details?.variations"
              :key="i"
              class="min-w-[200px] space-y-2"
            >
              <img
                :src="
                  i?.image_links?.length
                    ? i?.image_links[0].image
                    : 'https://placehold.co/400'
                "
                alt=""
                class="w-full h-[100px] object-cover object-center rounded-lg"
              />
              <p class="text-xs line-clamp-2">{{ i?.name }}</p>
            </div>
          </div>
          <div>
            <p
              class="border-l-4 border-[#ff613c] pl-3 text-sm font-medium mt-4"
            >
              Package Summary
            </p>
            <p v-html="details?.description" class="text-sm pt-4"></p>
          </div>
        </div>
        <div class="flex justify-end items-center gap-x-2 pt-2">
          <button
            @click="closeDetail"
            class="bg-white border border-gray-300 px-3 py-2.5 rounded-lg text-xs"
          >
            Cancel
          </button>
          <button
            @click="router.push(`/products/6?edit=${details?.id}`)"
            class="bg-blue-500 text-white border border-gray-300 px-3 py-2.5 rounded-lg text-xs"
          >
            Update
          </button>
          <button
            @click="openAddItemModal(details)"
            class="bg-[#ff613c] text-white border border-gray-300 px-3 py-2.5 rounded-lg text-xs"
          >
            Add Item
          </button>
        </div>
      </DialogPanel>
    </Modal>
  </div>
</template>
