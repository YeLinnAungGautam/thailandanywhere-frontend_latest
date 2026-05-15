<template>
  <Layout>
    <!-- ... existing filter section ... -->
    <div
      class="flex items-center justify-between py-5 bg-white/60 rounded-md shadow-sm p-4 mb-2"
    >
      <p class="text-lg font-semibold tracking-wider mr-4">Filter:</p>
      <div class="flex justify-start items-center gap-3">
        <div class="flex w-full text-xs justify-end items-center gap-4">
          <div
            class="flex justify-center items-center gap-0.5 border overflow-hidden bg-black/10 rounded-md"
          >
            <p
              class="px-2 py-2"
              :class="agent_id == user?.id ? 'bg-white' : ''"
              @click="agent_id = user?.id"
            >
              Mine
            </p>
            <p
              class="px-3 py-2"
              :class="agent_id == '' ? 'bg-white' : ''"
              @click="agent_id = ''"
            >
              All
            </p>
          </div>
          <p
            @click="changeServiceDate('today&90day')"
            class="flex gap-2 justify-start items-center cursor-pointer whitespace-nowrap"
            :class="
              changeDate == 'today&90day' ? ' text-[#FF5B00]' : 'text-black'
            "
          >
            <span
              class="w-2 h-2 rounded-full bg-[#FF5B00]"
              v-if="changeDate == 'today&90day'"
            ></span
            >Today & Next 90 Days
          </p>
          <p
            @click="changeServiceDate('today')"
            class="flex gap-2 justify-start items-center cursor-pointer"
            :class="changeDate == 'today' ? ' text-[#FF5B00]' : 'text-black'"
          >
            <span
              class="w-2 h-2 rounded-full bg-[#FF5B00]"
              v-if="changeDate == 'today'"
            ></span
            >Today
          </p>
          <p
            @click="changeServiceDate('tomorrow')"
            class="flex gap-2 justify-start items-center cursor-pointer"
            :class="changeDate == 'tomorrow' ? ' text-[#FF5B00]' : 'text-black'"
          >
            <span
              class="w-2 h-2 rounded-full bg-[#FF5B00]"
              v-if="changeDate == 'tomorrow'"
            ></span
            >Tomorrow
          </p>
          <p
            @click="changeServiceDate('7day')"
            class="flex gap-2 justify-start items-center cursor-pointer whitespace-nowrap"
            :class="changeDate == '7day' ? ' text-[#FF5B00]' : 'text-black'"
          >
            <span
              class="w-2 h-2 rounded-full bg-[#FF5B00]"
              v-if="changeDate == '7day'"
            ></span
            >Next 7 Days
          </p>
          <p
            @click="changeServiceDate('30day')"
            class="flex gap-2 justify-start items-center cursor-pointer whitespace-nowrap"
            :class="changeDate == '30day' ? ' text-[#FF5B00]' : 'text-black'"
          >
            <span
              class="w-2 h-2 rounded-full bg-[#FF5B00]"
              v-if="changeDate == '30day'"
            ></span
            >Next 30 Days
          </p>
        </div>
        <VueDatePicker
          v-model="dateRange"
          range
          :format="'yyyy-MM-dd'"
          placeholder="date range"
        />
        <input
          v-model="searchId"
          v-if="part != 'vantour'"
          type="text"
          class="h-9 text-sm w-4/5 border px-4 py-2 rounded-xl focus:ring-0 focus:outline-none text-gray-500"
          placeholder="Search CRM ID"
        />
      </div>
    </div>

    <!-- show data -->
    <div class="flex justify-start items-center space-x-4 col-span-3 my-4">
      <HomePersent
        :icon="TruckIcon"
        :title="'Van Tour'"
        :amount="carbookingPersent"
        :isActive="part == 'vantour'"
        @click="part = 'vantour'"
      />
      <HomePersent
        :icon="HomeModernIcon"
        :title="'Hotels'"
        :amount="20"
        :isActive="part == 'hotel'"
        @click="part = 'hotel'"
      />
      <HomePersent
        :icon="TicketIcon"
        :title="'Attractions'"
        :amount="20"
        :isActive="part == 'attraction'"
        @click="part = 'attraction'"
      />
      <HomePersent
        :icon="PaperAirplaneIcon"
        :title="'Air Tickets'"
        :amount="0"
        :isActive="part == 'airticket'"
      />
    </div>

    <!-- table for reservation -->
    <div class="space-y-1" v-if="part == 'vantour'">
      <!-- part of unasign -->
      <div
        :class="
          partOfReservation != '' ? 'bg-[#FF5B00] text-white' : 'bg-white'
        "
        class="rounded-lg px-4 py-5 flex justify-between items-center gap-2 cursor-pointer"
      >
        <div
          class="flex justify-start items-center gap-2 cursor-pointer"
          @click="openUnassigned"
        >
          <TruckIcon class="w-5 h-5" />
          <p class="text-sm">unassigned</p>
          <ChevronDownIcon class="w-5 h-5" />
        </div>
        <Pagination
          v-if="!loading & (partOfReservation != '')"
          :data="carbookings"
          @change-page="changePage"
        />
      </div>
      <div
        class="w-full bg-gray-50 flex rounded-md pl-2 items-center"
        v-if="partOfReservation != ''"
      >
        <p class="w-[10%] text-[10px] font-semibold py-2 px-2">Resev ID</p>
        <p class="w-[10%] text-[10px] font-semibold py-2 px-2">Serv Date</p>
        <p class="w-[10%] text-[10px] font-semibold py-2 px-2">Customer</p>
        <p class="w-[20%] text-[10px] font-semibold py-2 px-2">Product Name</p>
        <p class="w-[10%] text-[10px] font-semibold py-2 px-2">Variation</p>
        <p class="w-[15%] text-[10px] font-semibold py-2 px-2">Dri_Collect?</p>
        <p class="w-[10%] text-[10px] font-semibold py-2 px-2">Assign</p>
        <p class="w-[10%] text-[10px] font-semibold py-2 px-2">Total Collect</p>
        <p class="w-[10%] text-[10px] font-semibold py-2 px-2">complete?</p>
        <p class="w-[12%] text-[10px] font-semibold py-2 px-2"></p>
      </div>
      <div class="space-y-1" v-if="partOfReservation != ''">
        <div v-for="(l, index) in carbookings?.data" :key="index">
          <VantourTable
            :data="l"
            :loading="loading"
            :pag="carbookings"
            @change="changeFunction"
            @send-to-line="openLinePreview"
          />
        </div>
      </div>
      <div
        :class="partOfAssign != '' ? 'bg-[#FF5B00] text-white' : 'bg-white'"
        class="rounded-lg px-4 py-5 flex justify-between items-center gap-2"
      >
        <div
          class="flex justify-start items-center gap-2 cursor-pointer"
          @click="openElse"
        >
          <TruckIcon class="w-5 h-5" />
          <p class="text-sm">assigned</p>
          <ChevronDownIcon class="w-5 h-5" />
        </div>

        <Pagination
          v-if="!loading & (partOfAssign != '')"
          :data="carbookings"
          @change-page="changePage"
        />
      </div>
      <div class="space-y-1" v-if="partOfAssign != ''">
        <div class="w-full bg-gray-50 flex rounded-md pl-2 items-center">
          <p class="w-[10%] text-[10px] font-semibold py-2 px-2">Resev ID</p>
          <p class="w-[10%] text-[10px] font-semibold py-2 px-2">Serv Date</p>
          <p class="w-[10%] text-[10px] font-semibold py-2 px-2">Customer</p>
          <p class="w-[20%] text-[10px] font-semibold py-2 px-2">
            Product Name
          </p>
          <p class="w-[10%] text-[10px] font-semibold py-2 px-2">Variation</p>
          <p class="w-[15%] text-[10px] font-semibold py-2 px-2">
            Dri_Collect?
          </p>
          <p class="w-[10%] text-[10px] font-semibold py-2 px-2">Assign</p>
          <p class="w-[10%] text-[10px] font-semibold py-2 px-2">
            Total Collect
          </p>
          <p class="w-[10%] text-[10px] font-semibold py-2 px-2">complete?</p>
          <p class="w-[12%] text-[10px] font-semibold py-2 px-2"></p>
        </div>
        <div v-for="(l, index) in carbookings?.data" :key="index">
          <VantourTable
            :data="l"
            :loading="loading"
            :pag="carbookings"
            @change="changeFunction"
            @send-to-line="openLinePreview"
          />
        </div>
      </div>
    </div>
    <div v-if="part == 'hotel'">
      <HotelPartReservation :date="dateFilterRange" :searchId="searchId" />
    </div>
    <div v-if="part == 'attraction'">
      <AttractionPartHome :date="dateFilterRange" :searchId="searchId" />
    </div>

    <!-- LINE Preview Modal -->
    <!-- <LinePreviewModal
      v-if="showLinePreview"
      :bookingData="selectedBooking"
      @close="showLinePreview = false"
      @send="handleLineSend"
    /> -->
    <Modal :isOpen="queryModalOpen" @closeModal="queryModalOpen = false">
      <DialogPanel
        class="w-full max-w-md transform rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h5"
          class="text-base font-semibold leading-6 text-[#ff613c] mb-5"
        >
          {{
            permission
              ? "Assign Car Booking Vendor"
              : "Complete Car Information"
          }}
        </DialogTitle>
        <form
          @submit.prevent="onSubmitHandler"
          class="mt-2 grid grid-cols-2 gap-4 relative"
        >
          <input
            type="text"
            name=""
            class="opacity-0 col-span-2 absolute top-0"
            id=""
          />
          <div class="space-y-1" v-if="user.role != 'admin'">
            <label for="name" class="text-gray-800 text-xs"
              >Supplier Name
              <span class="text-red-600 text-base pl-2">*</span></label
            >
            <v-select
              v-model="formData.supplier_id"
              class="style-chooser bg-white rounded-lg"
              :options="suppliers?.data"
              @option:selected="supplierAction"
              label="name"
              :clearable="false"
              :reduce="(d) => d.id"
            ></v-select>
            <p v-if="errors?.supplier_id" class="mt-1 text-sm text-red-600">
              {{ errors.supplier_id[0] }}
            </p>
          </div>
          <div class="space-y-1" v-if="user.role != 'admin'">
            <label for="name" class="text-gray-800 text-xs">Car Number</label>
            <v-select
              v-model="formData.car_number"
              class="style-chooser bg-white rounded-lg"
              :options="driverCarNumberList ?? []"
              label="car_number"
              :clearable="false"
              :reduce="(d) => d.id"
            ></v-select>
            <p v-if="errors?.driver_info_id" class="mt-1 text-sm text-red-600">
              {{ errors.driver_info_id[0] }}
            </p>
          </div>
          <div class="space-y-1" v-if="user.role != 'admin'">
            <label for="name" class="text-gray-800 text-xs">Driver Name</label>
            <v-select
              v-model="formData.driver_id"
              class="style-chooser bg-white rounded-lg"
              :options="drivers?.data"
              @option:selected="driverAction"
              label="name"
              :clearable="false"
              :reduce="(d) => d.id"
            ></v-select>
            <p v-if="errors?.driver_id" class="mt-1 text-sm text-red-600">
              {{ errors.driver_id[0] }}
            </p>
          </div>
          <div class="space-y-1" v-if="user.role != 'admin'">
            <div class="flex justify-between items-center gap-2">
              <div class="space-y-1">
                <label for="name" class="text-gray-800 text-xs"
                  >Cost Price</label
                >
                <input
                  type="number"
                  v-model="formData.cost_price"
                  id="name"
                  class="h-9.5 col-span-2 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-300"
                />
              </div>
              <div class="space-y-1">
                <label for="name" class="text-gray-800 text-xs">Quantity</label>
                <input
                  type="number"
                  v-model="formData.quantity"
                  id="name"
                  disabled
                  class="h-9.5 w-20 bg-gray-200 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-300"
                />
              </div>
            </div>
            <p v-if="errors?.cost_price" class="mt-1 text-sm text-red-600">
              {{ errors.cost_price[0] }}
            </p>
          </div>
          <div class="space-y-1" v-if="user.role != 'admin'">
            <label for="name" class="text-gray-800 text-xs"
              >Driver Contact</label
            >
            <input
              type="text"
              v-model="formData.driver_contact"
              id="name"
              class="h-9 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.driver_contact" class="mt-1 text-sm text-red-600">
              {{ errors.driver_contact[0] }}
            </p>
          </div>
          <div class="space-y-1" v-if="user.role != 'admin'">
            <label for="name" class="text-gray-800 text-xs"
              >Total Cost Price</label
            >
            <input
              type="number"
              disabled
              v-model="total_cost_price"
              id="name"
              class="h-9 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-300"
            />
            <p
              v-if="errors?.total_cost_price"
              class="mt-1 text-sm text-red-600"
            >
              {{ errors.total_cost_price[0] }}
            </p>
          </div>
          <div class="col-span-2" v-if="user.role != 'admin'">
            <a
              :href="formData.car_photo"
              target="_blink"
              class="text-sm font-medium cursor-pointer text-orange-600"
              v-if="formData.car_photo"
              >car photo link -- click to see</a
            >
          </div>
          <div class="space-y-1 col-span-2" v-if="user.role != 'reservation'">
            <label for="name" class="text-gray-800 text-xs">Pickup Time</label>
            <input
              type="time"
              name=""
              v-model="formData.pickup_time"
              id=""
              class="h-10 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-300"
            />
          </div>
          <div class="space-y-1 col-span-2" v-if="user.role != 'reservation'">
            <label for="name" class="text-gray-800 text-xs">Route Plan</label>
            <textarea
              name=""
              v-model="formData.route_plan"
              id=""
              class="w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-300"
              cols="30"
              rows="3"
            ></textarea>
          </div>
          <div class="space-y-1 col-span-2" v-if="user.role != 'reservation'">
            <label for="name" class="text-gray-800 text-xs"
              >Special Request & Notes</label
            >
            <textarea
              name=""
              id=""
              v-model="formData.special_request"
              class="w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-300"
              cols="30"
              rows="3"
            ></textarea>
          </div>
          <div class="space-y-1 col-span-2" v-if="user.role != 'reservation'">
            <label for="name" class="text-gray-800 text-xs"
              >Pickup Location</label
            >
            <textarea
              name=""
              id=""
              v-model="formData.pickup_location"
              class="w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-300"
              cols="30"
              rows="3"
            ></textarea>
          </div>
          <div class="space-y-1 col-span-2" v-if="user.role != 'reservation'">
            <label for="name" class="text-gray-800 text-xs"
              >Dropoff Location</label
            >
            <textarea
              name=""
              id=""
              v-model="formData.dropoff_location"
              class="w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-300"
              cols="30"
              rows="3"
            ></textarea>
          </div>

          <div class="space-y-1 col-span-1" v-if="user.role != 'reservation'">
            <label for="name" class="text-gray-800 text-xs"
              >Is Driver Collect ?</label
            >
            <div class="pt-2">
              <Switch
                v-model="formData.is_driver_collect"
                :class="
                  formData.is_driver_collect ? 'bg-orange-600' : 'bg-gray-200'
                "
                class="relative inline-flex h-6 w-11 items-center rounded-full"
              >
                <span class="sr-only">Enable notifications</span>
                <span
                  :class="
                    formData.is_driver_collect
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  "
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                />
              </Switch>
            </div>
          </div>
          <div
            class="space-y-1 col-span-1"
            v-if="formData.is_driver_collect && !permission"
          >
            <label for="name" class="text-gray-800 text-xs"
              >Total Collect</label
            >
            <input
              type="text"
              v-model="formData.extra_collect_amount"
              id="name"
              class="h-10 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-300"
            />
          </div>
          <div class="text-end col-span-2">
            <Button type="submit"> Assign </Button>
          </div>
        </form>
      </DialogPanel>
    </Modal>
  </Layout>
</template>

<script setup>
import HomePersent from "./HomePersent.vue";
import {
  TruckIcon,
  HomeModernIcon,
  TicketIcon,
  PaperAirplaneIcon,
  ChevronDownIcon,
} from "@heroicons/vue/24/outline";
import VantourTable from "./VantourTable.vue";
import { useCarBookingStore } from "../../stores/carbooking";
import { useHomeStore } from "../../stores/home";
import { useMessageStore } from "../../stores/message";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { useAuthStore } from "../../stores/auth";
import Pagination from "../PaginationExpense.vue";
import HotelPartReservation from "./HotelPartReservation.vue";
import AttractionPartHome from "./AttractionPartHome.vue";
import Layout from "../../views/Layout.vue";
import LinePreviewModal from "./LinePreviewModal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";

import { useRoute, useRouter } from "vue-router";
import { useSupplierStore } from "../../stores/supplier";
import { useDriverStore } from "../../stores/driver";
import Modal from "../Modal.vue";
import Button from "../Button.vue";
import { useToast } from "vue-toastification";
const route = useRoute();
const toast = useToast();
const router = useRouter();

// Modal state in main component
const queryModalOpen = ref(false);
const queryFormData = ref(null);
const supplierStore = useSupplierStore();
const driverStore = useDriverStore();

const { suppliers } = storeToRefs(supplierStore);
const { drivers } = storeToRefs(driverStore);

const carBookingStore = useCarBookingStore();
const homeStore = useHomeStore();
const messageStore = useMessageStore();

const authStore = useAuthStore();
const { carbookings, loading } = storeToRefs(carBookingStore);
const { user } = storeToRefs(authStore);

const showLinePreview = ref(false);
const selectedBooking = ref(null);

const formatDate = (datePut) => {
  const date = new Date(datePut);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  let formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

const dateFilterRange = ref("");
const changeDate = ref("");
const agent_id = ref("");

const changeServiceDate = (data) => {
  console.log(data);
  changeDate.value = data;
  if (data == "today&90day") {
    let today = new Date();
    let startDate = formatDate(today);
    let endDate = new Date();
    endDate.setDate(today.getDate() + 90);
    endDate = formatDate(endDate);
    console.log(`${startDate},${endDate}`);
    dateFilterRange.value = `${startDate},${endDate}`;
    dateRange.value = "";
  }
  if (data == "today") {
    let startDate = formatDate(new Date());
    let endDate = formatDate(new Date());
    console.log(`${startDate},${endDate}`);
    dateFilterRange.value = `${startDate},${endDate}`;
    dateRange.value = "";
  } else if (data == "tomorrow") {
    let tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    let startDate = formatDate(tomorrowDate);
    let endDate = formatDate(tomorrowDate);
    console.log(`${startDate},${endDate}`);
    dateFilterRange.value = `${startDate},${endDate}`;
    dateRange.value = "";
  } else if (data == "7day") {
    let startDate = formatDate(new Date());
    let endDate = formatDate(
      new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
    );
    console.log(`${startDate},${endDate}`);
    dateFilterRange.value = `${startDate},${endDate}`;
    dateRange.value = "";
  } else if (data == "30day") {
    let startDate = formatDate(new Date());
    let endDate = formatDate(
      new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
    );
    console.log(`${startDate},${endDate}`);
    dateFilterRange.value = `${startDate},${endDate}`;
    dateRange.value = "";
  }
};

const partOfReservation = ref("");
const partOfAssign = ref("");

const openUnassigned = () => {
  if (partOfReservation.value != "unassigned") {
    partOfReservation.value = "unassigned";
    partOfAssign.value = "";
    getWithDate(dateFilterRange.value);
  } else {
    partOfReservation.value = "";
    partOfAssign.value = "";
    getWithDate(dateFilterRange.value);
  }
};

const openElse = () => {
  if (partOfAssign.value != "open") {
    partOfAssign.value = "open";
    partOfReservation.value = "";
    getWithDate(dateFilterRange.value);
  } else {
    partOfAssign.value = "";
    partOfReservation.value = "";
    getWithDate(dateFilterRange.value);
  }
};

const getWithDate = async (date) => {
  console.log(date, "this is date data for function");
  let first;
  let second;
  if (Array.isArray(date) && date.length >= 2) {
    first = dateFormat(date[0]);
    second = dateFormat(date[1]);
  } else if (typeof date == "string" && date.includes(",")) {
    first = date.split(",")[0];
    second = date.split(",")[1];
  }
  let data = {
    first: first,
    second: second,
  };
  // if (user.value.role == "reservation" || user.value.role == "super_admin") {
  //   data.agent_id = agent_id.value;
  // } else {
  //   data.agent_id = user.value.id;
  // }
  data.agent_id = agent_id.value;
  if (partOfReservation.value != "") {
    data.supplier_id = partOfReservation.value;
  }
  if (partOfAssign.value != "") {
    data.assigned_only = true;
  }
  console.log(data, "this is data from car booking");
  const res = await carBookingStore.getListAction(data);
  console.log(carbookings.value?.data, "this is data from car booking");
  await getPersent();
};

watch(dateFilterRange, (newValue) => {
  if (dateFilterRange.value != null) {
    getWithDate(dateFilterRange.value);
  }
});

const changePage = async (url) => {
  let first = dateFilterRange.value.split(",")[0];
  let second = dateFilterRange.value.split(",")[1];
  let data = {
    first,
    second,
    supplier_id: "",
  };
  if (user.value.role == "reservation" || user.value.role == "super_admin") {
    data.agent_id = "";
  } else {
    data.agent_id = user.value.id;
  }
  await carBookingStore.getChangePage(url, data);
  console.log(data, "thsi is params");
};

const changeFunction = (data) => {
  if (data == "updated") {
    getWithDate(dateFilterRange.value);
  }
};

const openLinePreview = (bookingData) => {
  selectedBooking.value = bookingData;
  showLinePreview.value = true;
};

// const handleLineSend = async (messageData) => {
//   await messageStore.sendLineMessage(messageData.message);
//   if (messageStore.success) {
//     showLinePreview.value = false;
//     // Optionally show success notification
//   }
// };

const part = ref("vantour");
const dateRange = ref("");
const searchId = ref("");

watch(dateRange, async (newValue) => {
  console.log(dateRange.value, "this is date");
  if (dateRange.value != "" && dateRange.value != null) {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const startDate = dateRange?.value[0]?.toLocaleDateString("en-GB", options);
    const endDate = dateRange?.value[1]?.toLocaleDateString("en-GB", options);

    const formatDateAsDDMMYYYY = (date) => {
      if (date) {
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yyyy = date.getFullYear();
        return `${yyyy}-${mm}-${dd}`;
      }
    };

    const formattedStartDate = formatDateAsDDMMYYYY(dateRange.value[0]);
    const formattedEndDate = formatDateAsDDMMYYYY(dateRange.value[1]);

    dateFilterRange.value = `${formattedStartDate},${formattedEndDate}`;
    changeServiceDate("");
  } else {
    changeServiceDate("today");
  }
});

const carbookingPersent = ref("");

const getPersent = async () => {
  const data = {
    daterange: dateFilterRange.value,
  };
  const res = await homeStore.getPersent(data);
  console.log(res, "this is home result");
  carbookingPersent.value = res.data?.data?.complete_percentage;
};

const formData = ref({
  id: "",
  supplier_id: "",
  driver_id: "",
  quantity: "",
  car_number: "",
  cost_price: "",
  extra_collect_amount: "",
  is_driver_collect: "",
  contact_number: "",
  total_pax: "",
  collect_comment: "",
  route_plan: "",
  special_request: "",
  driver_contact: "",
  car_photo: "",
  pickup_location: "",
  dropoff_location: "",
  pickup_time: "",
});

const errors = ref(null);

const supplierAction = async () => {
  console.log(formData.value.supplier_id);
  const res = await driverStore.getSimpleListAction({
    supplier_id: formData.value.supplier_id,
  });
  console.log(drivers.value, "this is driver");
};

const driverInfoData = ref({
  driver_name: "",
  supplier_name: "",
  supplier_id: "",
  driver_id: "",
  phone: "",
  car_number: "",
  driver_collect: "",
  extra_collect: "",
  total_collect: "",
  car_image: null,
});

const closeInfoModal = () => {
  driverInfoData.value = {
    driver_name: "",
    supplier_name: "",
    phone: "",
    car_number: "",
    driver_collect: "",
    extra_collect: "",
    total_collect: "",
    car_image: null,
    supplier_id: "",
    driver_id: "",
  };
  // showInfoModal.value = false;
};

const driverCarNumberList = ref(null);
const driverAction = async (id) => {
  console.log(id, "this is driver id");
  const res = await driverStore.getDetailAction(id?.id ? id?.id : id);
  console.log(res, "this is driver detail action");
  let data = res.result;
  formData.value.driver_contact = data.contact;
  driverCarNumberList.value = data.infos;
  driverInfoData.value.car_image = data.car_photo;
  if (data.infos.length > 0) {
    data.infos.forEach((num) => {
      if (num.is_default == 1) {
        formData.value.car_number = num.id;
      }
    });
  }
};

const total_cost_price = computed(() => {
  return formData.value.cost_price * formData.value.quantity;
});

const openQueryModal = async (id) => {
  await supplierStore.getSimpleListAction();
  await driverStore.getSimpleListAction();
  const res = await carBookingStore.getDetailAction(id);
  console.log(res, "this is detail");
  let data = res.result;
  formData.value = {
    id: data.id,
    supplier_id: data.supplier_id,
    driver_id: data.driver_id,
    driver_name: data.driver_name,
    driver_contact: data.driver_contact,
    car_number: data.driver_info_id,
    quantity: data.quantity,
    cost_price: data.cost_price,
    total_cost_price: data.quantity * data.cost_price,
    extra_collect_amount: data.extra_collect,
    route_plan:
      data.route_plan == null || data.route_plan == "null"
        ? ""
        : data.route_plan,
    special_request: data.special_request,
    pickup_location: data.pickup_location,
    dropoff_location: data.dropoff_location,
    contact_number: data.contact_number,
    total_pax: data.total_pax,
    collect_comment: data.collect_comment,
    is_driver_collect:
      data.is_driver_collect == null ? "" : data.is_driver_collect,
    pickup_time: data.pickup_time,
  };

  if (formData.value.supplier_id) {
    await supplierAction();
  }
  if (formData.value.driver_id) {
    await driverAction(formData.value.driver_id);
  }
  if (res.status == 1) {
    queryFormData.value = res.result;
    queryModalOpen.value = true;
  }
};

const closeFunction = () => {
  formData.value = {
    id: "",
    supplier_id: "",
    driver_id: "",
    quantity: "",
    car_number: "",
    cost_price: "",
    total_cost_price: "",
    extra_collect_amount: "",
    is_driver_collect: "",
    contact_number: "",
    total_pax: "",
    collect_comment: "",
    route_plan: "",
    special_request: "",
    driver_contact: "",
    car_photo: "",
    pickup_location: "",
    dropoff_location: "",
    pickup_time: "",
  };
  errors.value = null;
  queryModalOpen.value = false;
};

const onSubmitHandler = async () => {
  try {
    const frmData = new FormData();
    frmData.append("supplier_id", formData.value.supplier_id ?? "");
    frmData.append("driver_id", formData.value.driver_id ?? "");
    frmData.append("driver_contact", formData.value.driver_contact ?? "");
    frmData.append("driver_info_id", formData.value.car_number ?? "");
    frmData.append("pickup_location", formData.value.pickup_location ?? "");
    frmData.append("dropoff_location", formData.value.dropoff_location ?? "");
    frmData.append("contact_number", formData.value.contact_number ?? "");
    frmData.append("total_pax", formData.value.total_pax ?? "");
    frmData.append("collect_comment", formData.value.collect_comment ?? "");
    frmData.append("pickup_time", formData.value.pickup_time ?? "");
    if (formData.value.cost_price != "" && formData.value.cost_price != null) {
      frmData.append("cost_price", formData.value.cost_price);
    }
    if (
      total_cost_price.value != "" &&
      total_cost_price.value != "NaN" &&
      formData.value.cost_price != ""
    ) {
      frmData.append("total_cost_price", total_cost_price.value);
    }

    if (formData.value.is_driver_collect != "") {
      frmData.append(
        "is_driver_collect",
        formData.value.is_driver_collect == 1 ? "1" : "0",
      );
    } else {
      frmData.append("is_driver_collect", "");
    }

    if (formData.value.is_driver_collect == 1) {
      frmData.append(
        "extra_collect_amount",
        formData.value.extra_collect_amount || "",
      );
    }
    frmData.append("route_plan", formData.value.route_plan);
    frmData.append("special_request", formData.value.special_request);
    const res = await carBookingStore.addNewAction(frmData, formData.value.id);
    console.log(res, "this is response");
    closeFunction();
    if ((res.status = 1)) {
      toast.success(res.message);
      errors.value = null;
      router.push(`/home/reservations`);
    }
  } catch (error) {
    console.log(error, "this is error");
    if (error.response?.data?.errors) {
      console.log(errors.value, "this is error");
    }
    toast.error(error.message);
  }
};

watch(agent_id, () => {
  getWithDate(dateFilterRange.value);
});

onMounted(async () => {
  changeServiceDate("today");

  if (route.query.id) {
    await openQueryModal(route.query.id);
  }

  if (user.value.role == "reservation" || user.value.role == "super_admin") {
    agent_id.value = "";
  } else {
    agent_id.value = user.value.id;
  }
});
</script>
