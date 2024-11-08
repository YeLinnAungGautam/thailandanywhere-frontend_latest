<template>
  <div
    class="hidden p-6 mb-5 rounded-lg shadow-sm bg-white/60 md:col-span-3 md:block"
  >
    <!-- search input sort filter -->
    <div class="grid grid-cols-6 gap-4">
      <div class="col-span-6">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-medium text-gray-600 tracking-wide mb-3">
            Hotels
          </h3>
          <p v-if="importLoading">import process is doing ...</p>
          <div class="flex justify-end items-center gap-4">
            <!-- <div
              class="flex justify-center items-center border-2 shadow-sm rounded-md overflow-hidden"
            >
              <div
                class="cursor-pointer px-3 py-2.5 text-xs"
                :class="!incomplete ? 'bg-[#ff613c] text-white' : 'bg-white'"
                @click="incomplete = false"
              >
                normal list
              </div>
              <div
                class="cursor-pointer px-3 py-2.5 text-xs"
                @click="incomplete = true"
                :class="incomplete ? 'bg-[#ff613c] text-white' : 'bg-white'"
              >
                incomplete
              </div>
            </div> -->
            <div
              class="flex justify-center items-center border-2 shadow-sm rounded-md overflow-hidden"
            >
              <div
                class="cursor-pointer px-3 py-2.5 text-xs"
                :class="forSale ? 'bg-[#ff613c] text-white' : 'bg-white'"
                @click="toggleSale"
              >
                Other Bookings
              </div>
              <div
                class="cursor-pointer px-3 py-2.5 text-xs"
                @click="toggleSale"
                :class="!forSale ? 'bg-[#ff613c] text-white' : 'bg-white'"
              >
                Direct Bookings
              </div>
            </div>
          </div>
        </div>
        <div class="mb-4 mt-2">
          <div class="space-x-3 flex justify-between items-start gap-2">
            <div class="flex justify-start items-start gap-2">
              <input
                type="text"
                v-model="search"
                class="w-3/5 sm:w-3/5 md:w-[300px] border px-4 py-2 rounded-md shadow-sm focus:ring-0 focus:outline-none text-gray-500"
                placeholder="Search Hotels..."
              />
              <v-select
                class="style-chooser min-w-[200px] max-w-[400px] bg-white"
                :options="selectedArray ?? []"
                v-model="selectedFilter"
                label="name"
                :clearable="false"
                :reduce="(d) => d.value"
                placeholder="Choose Missing"
              ></v-select>
            </div>
            <div class="flex justify-end items-center gap-3">
              <Button
                :leftIcon="DocumentPlusIcon"
                intent="text"
                @click="importHandler"
              >
                Import
              </Button>
              <Button :leftIcon="ShareIcon" intent="text" @click="exportAction">
                Export
              </Button>
              <Button
                :leftIcon="PlusIcon"
                @click="goEditPage(`create`)"
                v-if="!authStore.isAgent"
              >
                Create
              </Button>
            </div>
          </div>
        </div>
        <div class="mb-5 overflow-auto rounded-lg shadow">
          <!-- <table class="w-full">
            <thead class="border-b-2 border-gray-200 bg-gray-50">
              <tr>
                <th
                  class="w-20 p-3 text-xs font-medium tracking-wide text-left"
                >
                  No.
                </th>
                <th class="p-3 text-xs font-medium tracking-wide text-left">
                  Name
                </th>
                <th class="p-3 text-xs font-medium tracking-wide text-left">
                  City
                </th>
                <th class="p-3 text-xs font-medium tracking-wide text-left">
                  Place
                </th>
                <th
                  class="p-3 text-xs font-medium tracking-wide text-left w-30"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                class="bg-white even:bg-gray-50 hover:bg-gray-50"
                v-for="(r, index) in paginatedItems"
                :key="index"
              >
                <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
                  {{ r.id }}
                </td>
                <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
                  {{ r.name }}
                </td>
                <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
                  {{ r.city?.name }}
                </td>
                <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
                  {{ r.place }}
                </td>
                <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <button
                      @click.prevent="goEditPage(r.id)"
                      class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                    >
                      <PencilSquareIcon
                        class="w-5 h-5"
                        v-if="!authStore.isAgent"
                      />
                      <EyeIcon class="w-5 h-5" v-if="authStore.isAgent" />
                    </button>
                    <button
                      v-if="authStore.isSuperAdmin"
                      @click.prevent="onDeleteHandler(r.id)"
                      class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-red-500 hover:text-white"
                    >
                      <TrashIcon class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredHotelList.length == 0">
                <td
                  class="text-center h-[300px] text-sm text-red-500 font-medium"
                  colspan="10"
                >
                  this page isn't have {{ selectedFilter }} missing please go
                  next page or for normal please select choose missing
                </td>
              </tr>
            </tbody>
          </table> -->
          <div class="mb-5 overflow-auto rounded-lg shadow">
            <div class="grid grid-cols-6 gap-2 bg-gray-100">
              <div class="py-2 text-xs font-medium tracking-wide text-center">
                No.
              </div>
              <div class="py-2 text-xs font-medium tracking-wide text-center">
                Name
              </div>
              <div class="py-2 text-xs font-medium tracking-wide text-center">
                City
              </div>
              <div class="py-2 text-xs font-medium tracking-wide text-center">
                Place
              </div>
              <div
                class="py-2 text-xs font-medium tracking-wide text-center"
              ></div>
              <div class="py-2 text-xs font-medium tracking-wide text-center">
                Action
              </div>
            </div>
            <div
              v-show="!loading"
              class="relative divide-y divide-gray-200 group"
              v-for="r in paginatedItems ?? []"
              :key="r.id"
            >
              <Disclosure>
                <DisclosureButton class="w-full">
                  <div class="grid grid-cols-6 gap-2 bg-white">
                    <div
                      class="flex justify-center items-center text-xs text-gray-700 whitespace-nowrap"
                    >
                      {{ r.id }}
                    </div>
                    <div
                      class="flex justify-start items-center text-xs text-gray-700 whitespace-nowrap overflow-hidden"
                    >
                      {{ r.name }}
                    </div>
                    <div
                      class="flex justify-center items-center text-xs text-gray-700 whitespace-nowrap"
                    >
                      {{ r.city?.name }}
                    </div>
                    <div
                      class="flex justify-start items-center text-xs text-gray-700 whitespace-nowrap overflow-hidden"
                    >
                      {{ r.hotel_place ? r.hotel_place?.name : "-" }}
                    </div>

                    <div
                      class="flex items-center justify-end col-span-2 p-3 space-x-2 text-xs text-gray-700 whitespace-nowrap"
                      @click="seenClick"
                    >
                      <p
                        class="inline-block px-3 py-2 text-blue-500 transition bg-white rounded shadow hover:bg-blue-500 hover:text-white"
                      >
                        <i class="fa-solid fa-chevron-down"></i>
                      </p>

                      <button
                        @click.prevent="goEditPage(r.id)"
                        class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                      >
                        <PencilSquareIcon class="w-5 h-5" />
                      </button>
                      <!-- </router-link> -->
                      <button
                        v-if="authStore.isSuperAdmin"
                        @click.prevent="onDeleteHandler(r.id)"
                        class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-red-500 hover:text-white"
                      >
                        <TrashIcon class="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </DisclosureButton>
                <transition
                  enter-active-class="transition duration-150 ease-out"
                  enter-from-class="transform scale-95 opacity-0"
                  enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-75 ease-out"
                  leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0"
                >
                  <DisclosurePanel class="w-full text-gray-500">
                    <div class="grid grid-cols-6 gap-2 bg-gray-300">
                      <div
                        class="py-2 text-xs font-medium tracking-wide text-center"
                      >
                        No.
                      </div>
                      <div
                        class="py-2 text-xs col-span-2 font-medium tracking-wide text-start pl-14"
                      >
                        Name
                      </div>

                      <div
                        class="py-2 text-xs font-medium tracking-wide text-start"
                      >
                        Is Extra
                      </div>
                      <div
                        class="py-2 text-xs font-medium tracking-wide text-start"
                      >
                        Has Breakfast
                      </div>
                      <div
                        class="py-2 text-xs font-medium tracking-wide text-center"
                      >
                        Price
                      </div>
                    </div>
                    <div
                      class="grid w-full grid-cols-6 gap-2 bg-gray-100"
                      v-for="d in r?.rooms"
                      :key="d.id"
                      @click="goRoomPage(d.hotel_id)"
                    >
                      <div
                        class="p-3 text-xs text-center text-gray-700 whitespace-nowrap"
                      >
                        {{ d?.id }}
                      </div>

                      <div
                        class="p-3 text-xs col-span-2 text-start text-gray-700 whitespace-nowrap overflow-hidden"
                      >
                        <p>{{ d?.name }}</p>
                      </div>
                      <div
                        class="p-3 text-xs text-gray-700 whitespace-nowrap overflow-hidden"
                      >
                        <p
                          class="text-white inline-block px-2 py-0.5 rounded-full"
                          :class="
                            d?.is_extra == 1 ? 'bg-green-600' : 'bg-red-600'
                          "
                        >
                          {{ d?.is_extra == 1 ? "Yes" : "No" }}
                        </p>
                      </div>
                      <div
                        class="p-3 text-xs text-gray-700 whitespace-nowrap overflow-hidden"
                      >
                        <p
                          class="text-white inline-block px-2 py-0.5 rounded-full"
                          :class="
                            d?.has_breakfast == 1
                              ? 'bg-green-600'
                              : 'bg-red-600'
                          "
                        >
                          {{ d?.has_breakfast == 1 ? "Yes" : "No" }}
                        </p>
                      </div>
                      <div
                        class="p-3 text-xs text-center text-gray-700 whitespace-nowrap overflow-hidden"
                      >
                        <p>{{ d?.room_price }} thb</p>
                      </div>
                    </div>
                  </DisclosurePanel>
                </transition>
              </Disclosure>
            </div>
            <div v-if="loading" class="flex items-center justify-center py-20">
              <div
                class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-4"
                role="status"
              >
                <span
                  class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                  >Loading...</span
                >
              </div>
              Loading ...
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- pagination -->
    <Pagination
      v-if="!loading && !pagiantionShow"
      :data="hotels"
      @change-page="changePage"
    />
    <!-- <Pagination
      v-if="!loadingIncomplete && incomplete"
      :data="incompleteHotel"
      @change-page="changeIncompletePage"
    /> -->
    <div
      v-if="!loading && pagiantionShow"
      class="flex justify-between items-center text-sm"
    >
      <div class="px-4 py-2 bg-gray-300 rounded-lg">
        Page: {{ currentPage }} / {{ totalPages }}
      </div>
      <div class="flex justify-end items-center gap-2 text-sm">
        <button
          @click="prevPage"
          class="px-4 py-2 bg-[#FF5B00] text-white rounded-lg"
          :disabled="currentPage === 1"
        >
          Previous
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-[#FF5B00] text-white rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
    <Modal :isOpen="importModal" @closeModal="importModal = false">
      <DialogPanel
        class="w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-5"
        >
          Import Process
        </DialogTitle>
        <form
          class="flex justify-between items-center"
          @submit.prevent="importActionHandler"
        >
          <input type="file" name="" @change="importFileAction" id="" />
          <button
            class="border hover:shadow-md border-gray-400 px-4 py-2 rounded-md"
          >
            Import
          </button>
        </form>
        <div class="mt-5 space-y-3 border border-gray-400 p-4 rounded-md">
          <p class="font-semibold">notice</p>
          <p class="text-xs">- file input must be CSV file .</p>
          <p class="text-xs">- All table data must be have .</p>
          <p class="text-xs">- Import process will take time may be longer</p>
          <p class="text-xs">- Process is working behind .</p>
          <p class="text-xs">
            - When finish process , system will show noti message
          </p>
          <p class="text-xs">
            - When fail the process , system will show noti message
          </p>
        </div>
      </DialogPanel>
    </Modal>
  </div>
</template>

<script setup>
import {
  PencilSquareIcon,
  TrashIcon,
  ShareIcon,
  EyeIcon,
  TicketIcon,
  BuildingOfficeIcon,
  PlusIcon,
  DocumentPlusIcon,
  UserGroupIcon,
  XCircleIcon,
  UsersIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/vue/24/outline";
import { QuillEditor } from "@vueup/vue-quill";
import Pagination from "../components/Pagination.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { computed, onMounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import { storeToRefs } from "pinia";
import { useRouter, useRoute } from "vue-router";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import Modal from "../components/Modal.vue";
// import { useCityStore } from "../stores/city";
import { useHotelStore } from "../stores/hotel";
import { useAuthStore } from "../stores/auth";
import FacilitoryStoreVue from "../components/FacilitoryStore.vue";
import debounce from "lodash/debounce";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
// import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";

const createModalOpen = ref(false);
const toast = useToast();
// const cityStore = useCityStore();
const hotelStore = useHotelStore();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const { hotels, loading, importLoading, incompleteHotel, loadingIncomplete } =
  storeToRefs(hotelStore);

const search = ref("");
const errors = ref([]);

const hotelShowList = ref(null);

// const { cities } = storeToRefs(cityStore);
// const citylist = ref([]);

// pagiantion

const currentPage = ref(1);
const itemsPerPage = ref(10);

// Computed property for paginated items
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredHotelList.value.slice(start, end);
});

// Total number of pages
const totalPages = computed(() => {
  return Math.ceil(filteredHotelList.value.length / itemsPerPage.value);
});

// Methods to change the page
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
};

// select function

const pagiantionShow = ref(false);

const selectedArray = ref([
  { id: 1, name: "choose missing", value: "" },
  { id: 2, name: "description missing", value: "description" },
  { id: 3, name: "photo missing", value: "images" },
  { id: 4, name: "facilities missing", value: "facilities" },
  { id: 5, name: "map missing", value: "map" },
  { id: 6, name: "star rating missing", value: "rating" },
  { id: 7, name: "nearby places missing", value: "nearby_places" },
  { id: 8, name: "banks missing", value: "bank_name" },
  { id: 9, name: "place missing", value: "place" },
  { id: 10, name: "bank account missing", value: "bank_account_number" },
]);

const selectedFilter = ref("");

const filteredHotelList = computed(() => {
  if (!selectedFilter.value) {
    return hotelShowList.value?.data || [];
  }

  return (
    hotelShowList.value?.data.filter((hotel) => {
      if (selectedFilter.value === "description") {
        return (
          !hotel.description ||
          hotel.description === "null" ||
          !hotel.full_description ||
          hotel.full_description == "null"
        );
      } else if (selectedFilter.value === "images") {
        return (
          !hotel.images || hotel.images === "null" || hotel.images.length == 0
        );
      } else if (selectedFilter.value === "facilities") {
        return (
          !hotel.facilities ||
          hotel.facilities === "null" ||
          hotel.facilities.length == 0
        );
      } else if (selectedFilter.value === "map") {
        return (
          !hotel.location_map ||
          hotel.location_map === "null" ||
          !hotel.location_map_title ||
          hotel.location_map_title === "null"
        );
      } else if (selectedFilter.value === "rating") {
        return !hotel.rating || hotel.rating === "null";
      } else if (selectedFilter.value === "nearby_places") {
        return (
          !hotel.nearby_places ||
          hotel.nearbyPlaces === "null" ||
          hotel.nearbyPlaces.length == 0
        );
      } else if (selectedFilter.value === "bank_name") {
        return !hotel.bank_name || hotel.bank_name === "null";
      } else if (selectedFilter.value === "place") {
        return !hotel.place || hotel.place === "null";
      } else if (selectedFilter.value === "bank_account_number") {
        return (
          !hotel.bank_account_number || hotel.bank_account_number === "null"
        );
      } else {
        return true;
      }
    }) || []
  );
});

// const incomplete = ref(false);

const goEditPage = (data) => {
  router.push({ name: "hoteledit", params: { id: data } });
  console.log(data);
};

const editImagesPreview = ref([]);
const imagesPreview = ref([]);
const imagesInput = ref(null);

const formatDate = (getDate) => {
  if (getDate != null) {
    const dateParts = getDate?.split(" ");
    return dateParts[0];
  }
};

const changePage = async (url) => {
  console.log(url);
  let data = {
    search: search.value,
    type: forSale.value ? "other_booking" : "direct_booking",
  };
  await hotelStore.getChangePage(url, data);
};

// const changeIncompletePage = async (url) => {
//   await hotelStore.getChangeIncompletePage(url, { search: search.value });
// };

const onDeleteHandler = async (id) => {
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
      try {
        const response = await hotelStore.deleteAction(id);
        toast.success(response.message);
      } catch (error) {
        if (error.response.data.errors) {
          errors.value = error.response.data.errors;
        }
        toast.error(error.response.data.message);
      }
      await hotelStore.getListAction();
    }
  });
};

const exportAction = async () => {
  const res = await hotelStore.downloadExport();
  if (res) {
    window.open(res.result.download_link);
  }
};

const forSale = ref(false);
const toggleSale = () => {
  forSale.value = !forSale.value;
};

// for import
const importModal = ref(false);
const importHandler = () => {
  importModal.value = !importModal.value;
};
const fileImport = ref(null);
const importFileAction = (e) => {
  let file = e.target.files[0];
  fileImport.value = file;
};
const importActionHandler = async () => {
  const frmData = new FormData();
  frmData.append("file", fileImport.value);
  try {
    importModal.value = false;
    const res = await hotelStore.importAction(frmData);
    fileImport.value = null;
    console.log(res);
    toast.success(`Hotel ${res.message}`);
  } catch (e) {
    // errors.value = e.response.data.errors;
    importModal.value = false;
    toast.error(e.response.data.message);
  }
};

const goRoomPage = (data) => {
  // console.log(data, "this is data");
  router.push(`/products/3?edit=${data}`);
};

onMounted(async () => {
  await hotelStore.getListAction({
    search: search.value,
    type: forSale.value ? "other_booking" : "direct_booking",
  });
  // await cityStore.getSimpleListAction();
  // citylist.value = cities.value.data;
});

// watch(search, async (newValue) => {
//   if (selectedFilter.value != "") {
//     await hotelStore.getListAction({
//       search: search.value,
//       type: forSale.value ? "other_booking" : "direct_booking",
//       limit: 1000,
//     });
//     currentPage.value = 1;
//     pagiantionShow.value = true;
//   } else if (selectedFilter.value == "") {
//     await hotelStore.getListAction({
//       search: search.value,
//       type: forSale.value ? "other_booking" : "direct_booking",
//       limit: 10,
//     });
//     pagiantionShow.value = false;
//     currentPage.value = 1;
//   }
// });

watch(
  search,
  debounce(async (newValue) => {
    if (selectedFilter.value != "") {
      await hotelStore.getListAction({
        search: search.value,
        type: forSale.value ? "other_booking" : "direct_booking",
        limit: 1000,
      });
      currentPage.value = 1;
      pagiantionShow.value = true;
    } else if (selectedFilter.value == "") {
      await hotelStore.getListAction({
        search: search.value,
        type: forSale.value ? "other_booking" : "direct_booking",
        limit: 10,
      });
      pagiantionShow.value = false;
      currentPage.value = 1;
    }
  }, 500)
);

watch(forSale, async (newValue) => {
  if (selectedFilter.value != "") {
    await hotelStore.getListAction({
      search: search.value,
      type: forSale.value ? "other_booking" : "direct_booking",
      limit: 1000,
    });
    currentPage.value = 1;
    pagiantionShow.value = true;
  } else if (selectedFilter.value == "") {
    await hotelStore.getListAction({
      search: search.value,
      type: forSale.value ? "other_booking" : "direct_booking",
      limit: 10,
    });
    pagiantionShow.value = false;
    currentPage.value = 1;
  }
});

//watch(incomplete, async (newValue) => {
// if (incomplete.value == true) {
// await hotelStore.incompleteHotelAction({ search: search.value });
//}
// });

watch(hotels, async (newValue) => {
  if (newValue) {
    hotelShowList.value = newValue;
  }
});

watch(selectedFilter, async (newValue) => {
  if (selectedFilter.value != "") {
    await hotelStore.getListAction({
      search: search.value,
      type: forSale.value ? "other_booking" : "direct_booking",
      limit: 1000,
    });
    currentPage.value = 1;
    pagiantionShow.value = true;
  } else if (selectedFilter.value == "") {
    await hotelStore.getListAction({
      search: search.value,
      type: forSale.value ? "other_booking" : "direct_booking",
      limit: 10,
    });
    pagiantionShow.value = false;
    currentPage.value = 1;
  }
});
</script>
