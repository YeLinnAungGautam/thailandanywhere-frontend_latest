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
                for Sale Part
              </div>
              <div
                class="cursor-pointer px-3 py-2.5 text-xs"
                @click="toggleSale"
                :class="!forSale ? 'bg-[#ff613c] text-white' : 'bg-white'"
              >
                for User Web
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
          <table class="w-full">
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
                v-for="(r, index) in filteredHotelList"
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
                    <!-- v-if="authStore.isSuperAdmin" -->
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
          </table>
        </div>
      </div>
    </div>
    <!-- pagination -->
    <Pagination v-if="!loading" :data="hotels" @change-page="changePage" />
    <!-- <Pagination
      v-if="!loadingIncomplete && incomplete"
      :data="incompleteHotel"
      @change-page="changeIncompletePage"
    /> -->
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
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import Modal from "../components/Modal.vue";
import { useCityStore } from "../stores/city";
import { useHotelStore } from "../stores/hotel";
import { useAuthStore } from "../stores/auth";
import FacilitoryStoreVue from "../components/FacilitoryStore.vue";
// import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";

const createModalOpen = ref(false);
const toast = useToast();
const cityStore = useCityStore();
const hotelStore = useHotelStore();
const authStore = useAuthStore();
const router = useRouter();

const { hotels, loading, importLoading, incompleteHotel, loadingIncomplete } =
  storeToRefs(hotelStore);

const search = ref("");
const errors = ref([]);

const hotelShowList = ref(null);

const { cities } = storeToRefs(cityStore);
const citylist = ref([]);

// select function

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

onMounted(async () => {
  await hotelStore.getListAction({
    search: search.value,
    type: forSale.value ? "other_booking" : "direct_booking",
  });
  await cityStore.getSimpleListAction();
  citylist.value = cities.value.data;
});

watch(search, async (newValue) => {
  selectedFilter.value = "";
  await hotelStore.getListAction({
    search: search.value,
    type: forSale.value ? "other_booking" : "direct_booking",
  });
  // if (incomplete.value == true) {
  //   await hotelStore.incompleteHotelAction({ search: search.value });
  // }
});

watch(forSale, async (newValue) => {
  await hotelStore.getListAction({
    search: search.value,
    type: forSale.value ? "other_booking" : "direct_booking",
  });
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
</script>
