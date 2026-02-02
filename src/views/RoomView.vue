<template>
  <div
    class="hidden p-6 mb-5 rounded-lg shadow-sm bg-white/60 md:col-span-3 md:block"
  >
    <div class="flex justify-between items-center">
      <h3 class="text-xl font-medium text-gray-600 tracking-wide mb-3">
        Rooms
      </h3>
      <p v-if="importLoading">import process is doing ...</p>
    </div>

    <!-- search input sort filter -->
    <div class="flex items-start justify-between mb-8">
      <div class="flex justify-start flex-wrap items-center gap-2">
        <input
          type="text"
          v-model="search"
          class="w-3/5 sm:w-3/5 md:w-[200px] border px-4 py-1.5 rounded-lg shadow-sm focus:ring-0 focus:outline-none text-gray-500"
          placeholder="Search Rooms..."
        />

        <!-- Hotel Search Dropdown -->
        <div class="relative min-w-[200px]">
          <input
            type="text"
            v-model="hotelSearchQuery"
            @input="searchHotels"
            @focus="showHotelDropdown = true"
            class="w-full border px-4 py-1.5 rounded-lg shadow-sm focus:ring-0 focus:outline-none text-gray-500"
            placeholder="Search hotels..."
          />
          <div
            v-if="showHotelDropdown && hotelSearchResults.length > 0"
            class="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1"
          >
            <div
              v-for="hotel in hotelSearchResults"
              :key="hotel.id"
              @click="selectHotel(hotel)"
              class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {{ hotel.name }}
            </div>
          </div>
          <button
            v-if="selectedHotel"
            @click="clearHotelSelection"
            type="button"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <input
          type="date"
          v-model="start_date"
          class="w-3/5 sm:w-3/5 md:w-[200px] border px-4 py-1.5 rounded-lg shadow-sm focus:ring-0 focus:outline-none text-gray-500"
          title="start date"
        />
        <input
          type="date"
          v-model="end_date"
          class="w-3/5 sm:w-3/5 md:w-[200px] border px-4 py-1.5 rounded-lg shadow-sm focus:ring-0 focus:outline-none text-gray-500"
          title="end date"
        />

        <select
          v-model="priceSortOrder"
          class="min-w-[200px] border px-4 text-sm py-1.5 rounded-lg shadow-sm focus:ring-0 focus:outline-none text-gray-500"
        >
          <option value="">Sort by Price</option>
          <option value="high_to_low">Price: High to Low</option>
          <option value="low_to_high">Price: Low to High</option>
        </select>

        <select
          v-model="scoreSortOrder"
          class="min-w-[200px] border px-4 text-sm py-1.5 rounded-lg shadow-sm focus:ring-0 focus:outline-none text-gray-500"
        >
          <option value="">Sort by Score</option>
          <option value="high_to_low">Score: High to Low</option>
          <option value="low_to_high">Score: Low to High</option>
        </select>

        <button
          class="px-2 py-1.5 bg-[#ff613c] rounded-md text-white"
          @click="searchFunction"
          v-if="start_date && end_date"
        >
          search
        </button>
        <button
          class="px-2 py-1.5 bg-[#ff613c] rounded-md text-white"
          @click="clearFunction"
          v-if="
            start_date ||
            end_date ||
            search ||
            selectedHotel ||
            scoreSortOrder ||
            priceSortOrder
          "
        >
          clear
        </button>
      </div>
      <div class="space-y-2 flex justify-end items-center gap-2 flex-wrap">
        <div class="gap-3 flex flex-wrap justify-end items-center">
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
            @click="goToCreate"
            v-if="!authStore.isAgent"
          >
            Create
          </Button>
          <Button
            :leftIcon="PlusIcon"
            @click="roomModal = true"
            v-if="!authStore.isAgent"
          >
            Room Facilities
          </Button>
        </div>
      </div>
    </div>

    <div class="mb-5 overflow-auto rounded-lg shadow">
      <table class="w-full">
        <thead class="border-b-2 border-gray-200 bg-gray-50">
          <tr>
            <th class="w-20 p-3 text-xs font-medium tracking-wide text-left">
              No.
            </th>
            <th
              class="p-3 text-xs font-medium tracking-wide text-left max-w-[300px] overflow-hidden"
            >
              Name
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              Description
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              Hotel
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              Room Price
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              Score
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left w-30">
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
            <td
              class="p-3 text-xs text-gray-700 whitespace-wrap max-w-[300px] overflow-hidden"
            >
              {{ r.name }}
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ limitedText(r.description) }}
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ r.hotel?.name }}
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              <p v-if="!authStore.isAgent">{{ r.room_price }}</p>
              <p v-if="authStore.isAgent">{{ r.agent_price }}</p>
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ r.score ?? "N/A" }}
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <button
                  @click="goToEdit(r.id)"
                  class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                >
                  <PencilSquareIcon class="w-5 h-5" v-if="!authStore.isAgent" />
                  <EyeIcon class="w-5 h-5" v-if="authStore.isAgent" />
                </button>

                <button
                  v-if="authStore.isSuperAdmin"
                  @click="onDeleteHandler(r.id)"
                  class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-red-500 hover:text-white"
                >
                  <TrashIcon class="w-5 h-5" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedItems.length == 0">
            <td
              class="text-center h-[300px] text-sm text-red-500 font-medium"
              colspan="7"
            >
              No rooms found. Please adjust your search criteria.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- pagination -->
    <Pagination
      v-if="!loading && !pagiantionShow && rooms?.data"
      :data="rooms"
      @change-page="changePage"
    />
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

    <!-- import modal -->
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
          <input type="file" @change="importFileAction" />
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

    <RoomListModal
      :isOpen="roomModal"
      :closeModal="() => (roomModal = false)"
    />
  </div>
</template>

<script setup>
import {
  PencilSquareIcon,
  TrashIcon,
  ShareIcon,
  EyeIcon,
  DocumentPlusIcon,
  PlusIcon,
} from "@heroicons/vue/24/outline";
import { DialogPanel, DialogTitle } from "@headlessui/vue";
import Pagination from "../components/Pagination.vue";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import { storeToRefs } from "pinia";
import { useRouter, useRoute } from "vue-router";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import Modal from "../components/Modal.vue";
import { useHotelStore } from "../stores/hotel";
import { useRoomStore } from "../stores/room";
import { useAuthStore } from "../stores/auth";
import debounce from "lodash/debounce";
import RoomListModal from "./RoomfacilityComponent/ListModal.vue";

const roomModal = ref(false);
const toast = useToast();
const hotelStore = useHotelStore();
const roomStore = useRoomStore();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const { rooms, loading, importLoading } = storeToRefs(roomStore);

const search = ref("");
const roomShowList = ref(null);
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Hotel search variables
const hotelSearchQuery = ref("");
const hotelSearchResults = ref([]);
const showHotelDropdown = ref(false);
const selectedHotel = ref(null);

// Sort variables
const scoreSortOrder = ref("");
const priceSortOrder = ref("");

// Pagination
const pagiantionShow = ref(false);

// Search and filter variables
const hotel_id = ref("");
const start_date = ref("");
const end_date = ref("");
const periodAjj = ref("");

// Import
const importModal = ref(false);
const fileImport = ref(null);

// Computed properties
const paginatedItems = computed(() => {
  const data = roomShowList.value?.data || [];
  if (pagiantionShow.value) {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return data.slice(start, end);
  }
  return data;
});

const totalPages = computed(() => {
  if (!pagiantionShow.value) return 1;
  const data = roomShowList.value?.data || [];
  return Math.ceil(data.length / itemsPerPage.value);
});

// Navigation
const goToCreate = () => {
  router.push({ name: "rooms-create" });
};

const goToEdit = (id) => {
  // router.push({ name: "rooms-edit", params: { id } });
  window.open(`/rooms/${id}/edit`, "_blank");
};

// Hotel search functions
const searchHotels = debounce(async (event) => {
  const query = {
    search: event.target.value,
    limit: 5,
  };
  hotelSearchResults.value = [];
  showHotelDropdown.value = false;

  try {
    const response = await hotelStore.getListAction(query);
    hotelSearchResults.value = response.result.data || [];
    showHotelDropdown.value = true;
  } catch (error) {
    console.error("Hotel search error:", error);
    hotelSearchResults.value = [];
    showHotelDropdown.value = false;
  }
}, 300);

const selectHotel = (hotel) => {
  selectedHotel.value = hotel;
  hotelSearchQuery.value = hotel.name;
  hotel_id.value = hotel.id;
  showHotelDropdown.value = false;
  performSearch();
};

const clearHotelSelection = () => {
  selectedHotel.value = null;
  hotelSearchQuery.value = "";
  hotel_id.value = "";
  showHotelDropdown.value = false;
  performSearch();
};

// Search function
const performSearch = async () => {
  const searchParams = {
    hotel_id: hotel_id.value,
    search: search.value,
    period: periodAjj.value,
    limit: 10,
  };

  if (scoreSortOrder.value) {
    searchParams.order_by_score = scoreSortOrder.value;
    priceSortOrder.value = "";
  }

  if (priceSortOrder.value && !scoreSortOrder.value) {
    searchParams.order_by_price = priceSortOrder.value;
  }

  await roomStore.getListAction(searchParams);
  pagiantionShow.value = false;
  currentPage.value = 1;
};

// Pagination methods
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

// Utility functions
const limitedText = (text) => {
  if (text && text.length > 30) {
    return text.slice(0, 30) + "...";
  }
  return text || "";
};

const changePage = async (url) => {
  const data = {
    search: search.value,
    hotel_id: hotel_id.value,
    period: periodAjj.value,
  };
  await roomStore.getChangePage(url, data);
};

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
        const response = await roomStore.deleteAction(id);
        toast.success(response.message);
        performSearch();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete room");
      }
    }
  });
};

const exportAction = async () => {
  try {
    const res = await roomStore.downloadExport();
    if (res?.result?.download_link) {
      window.open(res.result.download_link);
    }
  } catch (error) {
    toast.error("Export failed");
  }
};

const searchFunction = async () => {
  if (start_date.value && end_date.value) {
    periodAjj.value = `${start_date.value} , ${end_date.value}`;
    performSearch();
  }
};

const clearFunction = () => {
  selectedHotel.value = null;
  hotelSearchQuery.value = "";
  hotel_id.value = "";
  start_date.value = "";
  end_date.value = "";
  search.value = "";
  periodAjj.value = "";
  scoreSortOrder.value = "";
  priceSortOrder.value = "";
  performSearch();
};

// Import functions
const importHandler = () => {
  importModal.value = !importModal.value;
};

const importFileAction = (e) => {
  fileImport.value = e.target.files[0];
};

const importActionHandler = async () => {
  if (!fileImport.value) {
    toast.error("Please select a file");
    return;
  }

  const frmData = new FormData();
  frmData.append("file", fileImport.value);

  try {
    importModal.value = false;
    const res = await roomStore.importAction(frmData);
    fileImport.value = null;
    toast.success(`Room ${res.message}`);
    performSearch();
  } catch (e) {
    importModal.value = false;
    toast.error(e.response?.data?.message || "Import failed");
  }
};

// Watchers
watch(
  search,
  debounce(async () => {
    performSearch();
  }, 500),
);

watch(hotel_id, async () => {
  performSearch();
});

watch(periodAjj, async () => {
  performSearch();
});

watch(scoreSortOrder, async (newValue) => {
  if (newValue) {
    priceSortOrder.value = "";
  }
  performSearch();
});

watch(priceSortOrder, async (newValue) => {
  if (newValue) {
    scoreSortOrder.value = "";
  }
  performSearch();
});

watch(rooms, async (newValue) => {
  if (newValue) {
    roomShowList.value = newValue;
  }
});

// Mounted
onMounted(async () => {
  search.value =
    route.query.search && route.query.search !== "null"
      ? route.query.search
      : "";

  if (route.query.hotel && route.query.hotel !== "null") {
    hotel_id.value = route.query.hotel;
    try {
      const hotels = await hotelStore.searchHotels("");
      const hotel = hotels.data.find((h) => h.id == hotel_id.value);
      if (hotel) {
        selectedHotel.value = hotel;
        hotelSearchQuery.value = hotel.name;
      }
    } catch (error) {
      console.error("Failed to fetch hotel details:", error);
    }
  }

  if (search.value || hotel_id.value) {
    performSearch();
  } else {
    await roomStore.getListAction();
  }
});

onMounted(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest(".relative")) {
      showHotelDropdown.value = false;
    }
  };

  document.addEventListener("click", handleClickOutside);

  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });
});
</script>
