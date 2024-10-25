<script setup>
import { ref, onMounted, watch, computed, defineEmits } from "vue";
import {
  MagnifyingGlassIcon,
  BarsArrowDownIcon,
} from "@heroicons/vue/24/outline";
import { MapPinIcon } from "@heroicons/vue/24/solid";
import { useVantourStore } from "../../stores/vantour";
import { storeToRefs } from "pinia";
import debounce from "lodash/debounce";
import { InformationCircleIcon } from "@heroicons/vue/24/solid";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useRouter } from "vue-router";
import van from "../../../public/1.png";
import saloon from "../../../public/2.png";
import deluxe from "../../../public/3.png";
import attractionImage from "../../../public/attractions.png";
import { useCityStore } from "../../stores/city";

const bottomOfWindow = ref(false);
const vantourStore = useVantourStore();
const cityStore = useCityStore();
const { cities } = storeToRefs(cityStore);
const { vantours, loading } = storeToRefs(vantourStore);
const destsList = ref([]);
const search = ref("");
const type = ref("van_tour");
const addItemModal = ref(false);
const addInfoModal = ref(false);
const detailModal = ref(false);
const details = ref(null);
const details_images = ref([]);
const router = useRouter();

const viewDetail = (data) => {
  console.log(data, "this is data");
  details_images.value = [];
  details.value = data;
  detailModal.value = true;
  if (details.value != null) {
    details_images.value.push(details.value.cover_image);
    for (let i = 0; i < details.value.destinations.length; i++) {
      details_images.value.push(details.value.destinations[i].feature_img);
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
  product_type: 1,
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
  closeDetail();
  console.log("====================================");
  console.log(item, "this is item");
  console.log("====================================");
  formitem.value.comment = item.long_description ? item.long_description : "";
  formitem.value.product_id = item.id;
  formitem.value.product_name = item.name;
  formitem.value.product_image = item?.cover_image;
  if (item?.cars.length > 0) {
    formitem.value.car_list = item?.cars;
  }
  addItemModal.value = true;
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
  formitem.value.item_name = item.name;
  formitem.value.selling_price = item.price;
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
    await vantourStore.getChangePage(url, watchSystem.value);
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
    product_type: 1,
    product_id: "",
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

// filter action
const search_city = ref("");
const search_type = ref("van");
const city_id = ref("");
const filterModal = ref(false);

const cityIdSelect = (id) => {
  city_id.value = id;
  filterModal.value = !filterModal.value;
};
const filterAction = async () => {
  await searchFilterCity();
  filterModal.value = !filterModal.value;
};
const searchFilterCity = async () => {
  await cityStore.getListAction({ search: search_city.value });
};

watch(
  [search_city],
  debounce(async (newValue) => {
    await searchFilterCity();
  }, 500)
);

watch(bottomOfWindow, (newVal) => {
  console.log("bottomOfWindow changed:", newVal);
  if (bottomOfWindow.value == true) {
    let changePageCalled = false;
    if (newVal && !changePageCalled) {
      console.log("This is the bottom of the window");

      if (
        vantours?.value?.meta?.current_page < vantours?.value?.meta?.last_page
      ) {
        changePageCalled = true; // Set the flag to true

        changePage(
          vantours?.value?.meta?.links[vantours?.value?.meta?.current_page + 1]
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
  if (type.value != null) {
    result.type = type.value;
  }
  if (city_id.value != "null") {
    result.city_id = city_id.value;
  }

  return result;
});

watch(vantours, async (newValue) => {
  if (newValue) {
    destsList.value = [...destsList.value, ...newValue?.data];
  }
});

watch(
  [search, type, city_id],
  debounce(async (newValue) => {
    destsList.value = [];
    await vantourStore.getListAction(watchSystem.value);
  }, 500)
);

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

onMounted(async () => {
  window.addEventListener("scroll", handleScroll);
  await vantourStore.getListAction(watchSystem.value);
  formitem.value.product_type = 1;
});
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h1 class="text-sm font-medium">Product Vantours</h1>
      <div class="flex justify-end items-center gap-x-2 mr-2">
        <div
          class="border border-gray-200 bg-white flex justify-start items-center gap-x-1 rounded-lg p-1"
        >
          <p
            class="text-xs px-2 py-0.5 rounded-md cursor-pointer"
            @click="type = 'van_tour'"
            :class="
              type == 'van_tour'
                ? 'bg-[#ff613c] text-white'
                : 'bg-white text-black'
            "
          >
            van tour
          </p>
          <p
            class="text-xs bg-[#ff613c] px-2 py-0.5 rounded-md cursor-pointer"
            @click="type = 'car_rental'"
            :class="
              type == 'car_rental'
                ? 'bg-[#ff613c] text-white'
                : 'bg-white text-black'
            "
          >
            car rental
          </p>
        </div>
      </div>
    </div>
    <!-- search part -->
    <div
      class="flex justify-start items-center gap-x-2 flex-nowrap relative mr-2"
    >
      <div class="relative w-full">
        <input
          type="text"
          v-if="search_type == 'van'"
          v-model="search"
          name=""
          class="bg-white w-full px-8 py-2.5 rounded-lg focus:outline-none text-xs"
          placeholder="Search van tour !"
          id=""
        />
        <input
          type="text"
          v-if="search_type == 'des'"
          v-model="search"
          name=""
          class="bg-white w-full px-8 py-2.5 rounded-lg focus:outline-none text-xs"
          placeholder="Search destination !"
          id=""
        />
        <MagnifyingGlassIcon
          class="w-4 h-4 absolute text-[#ff613c] top-2.5 left-2"
        />
        <div
          class="flex justify-end items-center absolute bottom-0.5 right-1 gap-x-2"
        >
          <div
            class="border border-gray-200 bg-white flex justify-start items-center gap-x-1 rounded-lg p-1"
          >
            <p
              class="text-xs px-2 py-0.5 rounded-md cursor-pointer"
              @click="search_type = 'van'"
              :class="
                search_type == 'van'
                  ? 'bg-[#ff613c] text-white'
                  : 'bg-white text-black'
              "
            >
              van
            </p>
            <p
              class="text-xs bg-[#ff613c] px-2 py-0.5 rounded-md cursor-pointer"
              @click="search_type = 'des'"
              :class="
                search_type == 'des'
                  ? 'bg-[#ff613c] text-white'
                  : 'bg-white text-black'
              "
            >
              des
            </p>
          </div>
        </div>
      </div>
      <div class="bg-[#ff613c] p-2 rounded-full">
        <!-- filter icon -->
        <BarsArrowDownIcon class="w-4 h-4 text-white" @click="filterAction" />
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
            <p class="text-xs font-medium">{{ i?.name }}</p>
            <p class="text-[10px]">{{ i?.type }}</p>
            <div class="flex justify-start gap-x-2 items-center pt-2">
              <p
                class="flex justify-start items-center gap-x-1 text-[10px] line-clamp-1"
              >
                <MapPinIcon class="w-3 h-3 text-[#ff613c]" />
                {{ i?.cities[0]?.name }}
              </p>
              <p class="text-[10px] flex justify-start items-center gap-x-1">
                {{ i?.destinations?.length }}
                <img :src="attractionImage" alt="" class="w-2.5 h-2.5" />
              </p>
            </div>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <p class="font-medium">{{ i?.lowest_car_price }} ฿</p>
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
            <div class="space-y-1">
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
                >Pick up date</label
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
          <div class="space-y-1">
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
            <div class="space-y-1">
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
          <div class="space-y-1">
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
            @click="clearAction"
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
            @click="getFunction"
            class="bg-[#ff613c] text-white px-3 py-2.5 rounded-lg text-xs"
            :class="todayVali ? 'bg-[#ff613c]' : 'bg-gray-300'"
          >
            Add Item
          </button>
        </div>
      </DialogPanel>
    </Modal>

    <!-- filter modal -->
    <Modal :isOpen="filterModal" @closeModal="filterModal = false">
      <DialogPanel
        class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-1"
        >
          Filter Cities
        </DialogTitle>
        <div class="space-y-2.5 pb-3 border-b border-gray-300">
          <p class="text-xs text-gray-500">
            Search with city, for action click result city.
          </p>
          <div class="relative w-full border border-gray-300 rounded-lg">
            <input
              type="text"
              v-model="search_city"
              name=""
              class="bg-white w-full px-8 py-2.5 rounded-lg focus:outline-none text-xs"
              placeholder="Search for products here !"
              id=""
            />
            <MagnifyingGlassIcon
              class="w-4 h-4 absolute text-[#ff613c] top-2.5 left-2"
            />
          </div>
        </div>
        <div class="h-[300px] overflow-y-scroll py-2 space-y-2">
          <div
            class="border rounded-lg"
            @click="cityIdSelect('null')"
            :class="
              city_id == 'null'
                ? 'bg-[#ff613c] text-white border-[#ff613c]'
                : 'border-gray-300'
            "
          >
            <p class="py-3 px-4 text-xs">All City</p>
          </div>
          <div
            v-for="c in cities?.data ?? []"
            :key="c"
            class="border rounded-lg"
            @click="cityIdSelect(c.id)"
            :class="
              city_id == c.id
                ? 'bg-[#ff613c] text-white border-[#ff613c]'
                : 'border-gray-300'
            "
          >
            <p class="py-3 px-4 text-xs">{{ c.name }}</p>
          </div>
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
          Van Tour Information
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
            {{ details?.destinations?.length }} destinations
          </p>
          <div
            class="flex justify-start items-center gap-x-2 w-full overflow-x-scroll no-scrollbar"
          >
            <div
              v-for="i in details?.destinations"
              :key="i"
              class="min-w-[200px] space-y-2"
            >
              <img
                :src="
                  i?.feature_img ? i?.feature_img : 'https://placehold.co/400'
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
            <p v-html="details?.long_description" class="text-sm pt-4"></p>
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
            @click="router.push(`/vantour/view/${details?.id}/edit`)"
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
