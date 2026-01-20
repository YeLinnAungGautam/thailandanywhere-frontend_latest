<!-- views/Attraction/AttractionList.vue -->
<template>
  <div
    class="bg-white/60 p-6 rounded-lg shadow-sm mb-5 md:col-span-3 hidden md:block"
  >
    <div class="flex justify-between items-center mb-3">
      <h3 class="text-xl font-medium text-gray-600 tracking-wide">
        Attractions
      </h3>
      <p v-if="importLoading" class="text-sm text-blue-600">
        Import process is running...
      </p>
    </div>

    <!-- Search and Actions -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-3">
        <input
          type="text"
          v-model="search"
          class="w-[300px] border px-4 py-2 rounded-md shadow-sm focus:ring-0 focus:outline-none text-gray-500"
          placeholder="Search Attraction..."
        />
        <AdjustmentsHorizontalIcon
          class="w-6 h-6 text-gray-600 cursor-pointer"
        />
      </div>

      <div class="space-x-3">
        <Button
          :leftIcon="DocumentPlusIcon"
          intent="text"
          @click="importModal = true"
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
      </div>
    </div>

    <!-- Attractions Table -->
    <div class="overflow-auto rounded-lg shadow mb-5">
      <div class="grid grid-cols-6 gap-2 bg-gray-100">
        <div class="py-2 text-xs font-medium tracking-wide text-center">
          No.
        </div>
        <div class="py-2 text-xs font-medium tracking-wide text-center">
          Image
        </div>
        <div class="py-2 text-xs font-medium tracking-wide text-center">
          Ticket Name
        </div>
        <div class="py-2 text-xs font-medium tracking-wide text-center">
          Is Show
        </div>
        <div class="py-2 text-xs font-medium tracking-wide text-center"></div>
        <div class="py-2 text-xs font-medium tracking-wide text-center">
          Action
        </div>
      </div>

      <div
        v-if="loading"
        class="flex items-center justify-center py-20 bg-white"
      >
        <div
          class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent mr-4"
        >
          <span class="sr-only">Loading...</span>
        </div>
        <span class="text-gray-600">Loading...</span>
      </div>

      <div v-else>
        <Disclosure
          v-for="attraction in entrances?.data ?? []"
          :key="attraction.id"
          v-slot="{ open }"
        >
          <div class="relative divide-y divide-gray-200 group">
            <DisclosureButton class="w-full">
              <div
                class="grid grid-cols-6 gap-2 bg-white hover:bg-gray-50 transition"
              >
                <div
                  class="flex justify-center items-center text-xs text-gray-700 whitespace-nowrap py-3"
                >
                  {{ attraction.id }}
                </div>
                <div
                  class="flex justify-center items-center text-xs text-gray-700 py-3"
                >
                  <img
                    v-if="attraction.cover_image"
                    :src="attraction.cover_image"
                    class="w-14 h-10 rounded-lg object-cover"
                    alt="Cover"
                  />
                  <span v-else class="text-gray-400">-</span>
                </div>
                <div
                  class="flex justify-start items-center text-xs text-gray-700 px-3 py-3 truncate"
                >
                  {{ attraction.name }}
                </div>
                <div class="flex justify-center items-center text-xs py-3">
                  <span
                    class="px-2 py-0.5 rounded-full text-white text-xs"
                    :class="
                      attraction.meta_data?.is_show == 1
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    "
                  >
                    {{ attraction.meta_data?.is_show == 1 ? "Yes" : "No" }}
                  </span>
                </div>
                <div class="flex items-center justify-center py-3">
                  <ChevronDownIcon
                    class="w-5 h-5 text-gray-500 transition-transform"
                    :class="{ 'transform rotate-180': open }"
                  />
                </div>
                <div
                  class="flex items-center justify-end gap-2 pr-3 py-3"
                  @click.stop
                >
                  <button
                    @click="goToEdit(attraction.id)"
                    class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                    title="Edit"
                  >
                    <PencilSquareIcon class="w-5 h-5" />
                  </button>
                  <button
                    v-if="authStore.isSuperAdmin || authStore.isReservation"
                    @click="onDeleteHandler(attraction.id)"
                    class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-red-500 hover:text-white"
                    title="Delete"
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
                <div class="grid grid-cols-6 gap-2 bg-gray-200">
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
                    Is Main
                  </div>
                  <div
                    class="py-2 text-xs font-medium tracking-wide text-start"
                  >
                    Is Show
                  </div>
                  <div
                    class="py-2 text-xs font-medium tracking-wide text-center"
                  >
                    Price
                  </div>
                </div>

                <div
                  v-for="variation in attraction.variations"
                  :key="variation.id"
                  class="grid grid-cols-6 gap-2 bg-gray-50 hover:bg-gray-100 cursor-pointer transition"
                  @click="goToVariation(variation.entrance_ticket_id)"
                >
                  <div class="p-3 text-xs text-center text-gray-700">
                    {{ variation.id }}
                  </div>
                  <div
                    class="p-3 text-xs col-span-2 text-start text-gray-700 truncate"
                  >
                    {{ variation.name }}
                  </div>
                  <div class="p-3 text-xs text-gray-700">
                    <span
                      v-if="variation.meta_data"
                      class="text-white inline-block px-2 py-0.5 rounded-full text-xs"
                      :class="
                        JSON.parse(variation.meta_data)[0]?.is_main == 1
                          ? 'bg-green-600'
                          : 'bg-red-600'
                      "
                    >
                      {{
                        JSON.parse(variation.meta_data)[0]?.is_main == 1
                          ? "Yes"
                          : "No"
                      }}
                    </span>
                  </div>
                  <div class="p-3 text-xs text-gray-700">
                    <span
                      v-if="variation.meta_data"
                      class="text-white inline-block px-2 py-0.5 rounded-full text-xs"
                      :class="
                        JSON.parse(variation.meta_data)[0]?.is_show == 1
                          ? 'bg-green-600'
                          : 'bg-red-600'
                      "
                    >
                      {{
                        JSON.parse(variation.meta_data)[0]?.is_show == 1
                          ? "Yes"
                          : "No"
                      }}
                    </span>
                  </div>
                  <div class="p-3 text-xs text-center text-gray-700">
                    {{ variation.price }} THB
                  </div>
                </div>
              </DisclosurePanel>
            </transition>
          </div>
        </Disclosure>
      </div>
    </div>

    <!-- Pagination -->
    <Pagination v-if="!loading" :data="entrances" @change-page="changePage" />

    <!-- Import Modal -->
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
          <input type="file" @change="importFileAction" accept=".csv" />
          <button
            class="border hover:shadow-md border-gray-400 px-4 py-2 rounded-md"
          >
            Import
          </button>
        </form>
        <div class="mt-5 space-y-3 border border-gray-400 p-4 rounded-md">
          <p class="font-semibold">Notice</p>
          <p class="text-xs">- File input must be CSV file.</p>
          <p class="text-xs">- All table data must be present.</p>
          <p class="text-xs">- Import process will take time, may be longer.</p>
          <p class="text-xs">- Process is working behind.</p>
          <p class="text-xs">
            - When finish process, system will show notification message.
          </p>
          <p class="text-xs">
            - When fail the process, system will show notification message.
          </p>
        </div>
      </DialogPanel>
    </Modal>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
import debounce from "lodash/debounce";
import {
  DocumentPlusIcon,
  ShareIcon,
  PlusIcon,
  AdjustmentsHorizontalIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronDownIcon,
} from "@heroicons/vue/24/outline";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";

import Button from "../components/Button.vue";
import Pagination from "../components/Pagination.vue";
import Modal from "../components/Modal.vue";

import { useEntranceStore } from "../stores/entrance";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const toast = useToast();

const entranceStore = useEntranceStore();
const authStore = useAuthStore();

const { entrances, loading, importLoading } = storeToRefs(entranceStore);

const search = ref("");
const importModal = ref(false);
const fileImport = ref(null);

const goToCreate = () => {
  router.push("/entrance/create");
};

const goToEdit = (id) => {
  router.push(`/entrance/update/${id}`);
};

const goToVariation = (id) => {
  router.push(`/products/7?id=${id}`);
};

const changePage = async (url) => {
  await entranceStore.getChangePage(url, { search: search.value });
};

const onDeleteHandler = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      const response = await entranceStore.deleteAction(id);
      toast.success(response.message);
      await entranceStore.getListAction();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  }
};

const exportAction = async () => {
  const res = await entranceStore.downloadExport();
  if (res?.result?.download_link) {
    window.open(res.result.download_link);
  }
};

const importFileAction = (e) => {
  fileImport.value = e.target.files[0];
};

const importActionHandler = async () => {
  const frmData = new FormData();
  frmData.append("file", fileImport.value);

  try {
    importModal.value = false;
    const res = await entranceStore.importAction(frmData);
    fileImport.value = null;
    toast.success(`Attractions ${res.message}`);
  } catch (e) {
    importModal.value = false;
    toast.error(e.response?.data?.message || "Import failed");
  }
};

watch(
  search,
  debounce(async () => {
    await entranceStore.getListAction({ search: search.value });
  }, 500),
);

onMounted(async () => {
  await entranceStore.getListAction();
});
</script>
