<template>
  <div
    class="bg-white/60 p-6 rounded-lg shadow-sm mb-5 md:col-span-3 hidden md:block"
  >
    <div class="flex justify-between items-center">
      <h3 class="text-xl font-medium text-gray-600 tracking-wide mb-3">
        Van Tours
      </h3>
      <p v-if="importLoading">import process is doing ...</p>
    </div>
    <!-- search input sort filter -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex justify-start items-center gap-4">
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
        <input
          type="text"
          v-model="search"
          class="w-3/5 sm:w-3/5 md:w-[300px] text-sm mr-3 border px-4 py-2 rounded-md shadow-sm focus:ring-0 focus:outline-none text-gray-500"
          placeholder="Search Van Tours..."
        />

        <AdjustmentsHorizontalIcon
          class="w-6 text-gray-600 h-6 inline-block mx-2 cursor-pointer"
        />
      </div>
      <div class="flex justify-end items-center gap-4">
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
          @click="VantourCreate"
          v-if="!authStore.isAgent"
        >
          Create
        </Button>
      </div>
    </div>
    <div class="overflow-auto rounded-lg shadow mb-5">
      <table class="w-full">
        <thead class="bg-gray-50 border-b-2 border-gray-200">
          <tr>
            <th class="w-20 p-3 text-xs font-medium tracking-wide text-left">
              No.
            </th>
            <th class="w-30 p-3 text-xs font-medium tracking-wide text-left">
              Image
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              Name
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              <p v-if="authStore.isAgent">Car</p>
              <p v-if="!authStore.isAgent">Prices</p>
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              Prices ( Agent )
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              Destination Count
            </th>
            <th class="w-30 p-3 text-xs font-medium tracking-wide text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100" v-if="!loading">
          <tr
            class="bg-white even:bg-gray-50 hover:bg-gray-50"
            v-for="(r, index) in vantours?.data"
            :key="index"
          >
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ r.id }}
            </td>
            <td
              class="p-3 text-xs text-gray-700 whitespace-nowrap"
              v-if="r.cover_image"
            >
              <img :src="r.cover_image" class="w-14 h-12 rounded-lg" alt="" />
            </td>
            <td
              class="p-3 text-xs text-gray-700 whitespace-nowrap"
              v-if="!r.cover_image"
            >
              -
            </td>
            <td
              class="p-3 text-xs text-gray-700 max-w-[300px] text-wrap overflow-hidden whitespace-nowrap"
            >
              {{ r.name }}
            </td>

            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              <div class="block space-y-1 text-start">
                <p v-for="(p, index) in r.cars" :key="index" class="">
                  {{ p.name }} -
                  <span v-if="!authStore.isAgent">{{ p.price }} B</span>
                </p>
              </div>
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              <div class="block space-y-1 text-start">
                <p v-for="(p, index) in r.cars" :key="index">
                  {{ p.agent_price }} B
                </p>
              </div>
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              <div class="flex space-x-2 items-center">
                <!-- <p v-for="(e, index) in r.destinations" :key="index">
                  {{ e.entry_fee }}/
                </p> -->
                <p>{{ r.destinations.length }}</p>
              </div>
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <router-link :to="'/vantour/view/' + r.id + '/view'">
                  <button
                    class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-blue-500 hover:text-white"
                  >
                    <EyeIcon class="w-5 h-5" />
                  </button>
                </router-link>
                <router-link
                  :to="'/vantour/view/' + r.id + '/edit'"
                  v-if="!authStore.isAgent"
                >
                  <button
                    class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                  >
                    <PencilSquareIcon class="w-5 h-5" />
                  </button>
                </router-link>
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
        </tbody>
        <tbody class="w-full" v-if="loading">
          <tr class="">
            <td colspan="9" class="text-center py-10">loading ...</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- pagination -->
    <Pagination v-if="!loading" :data="vantours" @change-page="changePage" />
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
  UsersIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/vue/24/outline";
import Pagination from "../components/Pagination.vue";
import { onMounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import { useVantourStore } from "../stores/vantour";
import { storeToRefs } from "pinia";
import { useRouter, useRoute } from "vue-router";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import { useAuthStore } from "../stores/auth";
import Modal from "../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const vantourStore = useVantourStore();
const authStore = useAuthStore();
const { vantours, loading, importLoading } = storeToRefs(vantourStore);

const search = ref("");
const errors = ref([]);

// import functions
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
    const res = await vantourStore.importAction(frmData);
    fileImport.value = null;
    console.log(res);
    toast.success(`private van tour ${res.message}`);
  } catch (e) {
    // errors.value = e.response.data.errors;
    importModal.value = false;
    toast.error(e.response.data.message);
  }
};

const VantourCreate = () => {
  router.push("/vantour/edit");
};

const changePage = async (url) => {
  console.log(url);
  let data = {
    search: search.value,
    type: forSale.value ? "car_rental" : "van_tour",
  };
  router.push({
    name: "products",
    params: { id: 1 },
    query: {
      search: search.value,
      type: forSale.value ? "car_rental" : "van_tour",
    },
  });
  await vantourStore.getChangePage(url, data);
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
        const response = await vantourStore.deleteAction(id);
        toast.success(response.message);
      } catch (error) {
        console.log(
          "🚀 ~ file: BlogView.vue:65 ~ onDeleteHandler ~ error:",
          error
        );
        if (error.response.data.errors) {
          errors.value = error.response.data.errors;
        }
        toast.error(error.response.data.message);
      }
      await vantourStore.getListAction({
        search: search.value,
        type: forSale.value ? "car_rental" : "van_tour",
      });
    }
  });
};

const forSale = ref(true);

const toggleSale = () => {
  forSale.value = !forSale.value;
  router.push({
    name: "products",
    params: { id: 0 },
    query: {
      search: search.value,
      type: forSale.value ? "car_rental" : "van_tour",
    },
  });
};

const exportAction = async () => {
  const res = await vantourStore.downloadExport();
  if (res) {
    window.open(res.result.download_link);
  }
};

onMounted(async () => {
  search.value = route.query.search ? route.query.search : "";
  forSale.value = route.query.type == "van_tour" ? false : true;
  await vantourStore.getListAction({
    search: search.value,
    type: forSale.value ? "car_rental" : "van_tour",
  });
});

watch(search, async (newValue) => {
  await vantourStore.getListAction({
    search: search.value,
    type: forSale.value ? "car_rental" : "van_tour",
  });
  router.push({
    name: "products",
    params: { id: 0 },
    query: {
      search: search.value,
      type: forSale.value ? "car_rental" : "van_tour",
    },
  });
});
watch(forSale, async (newValue) => {
  await vantourStore.getListAction({
    search: search.value,
    type: forSale.value ? "car_rental" : "van_tour",
  });
  router.push({
    name: "products",
    params: { id: 0 },
    query: {
      search: search.value,
      type: forSale.value ? "car_rental" : "van_tour",
    },
  });
});
</script>
