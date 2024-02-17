<template>
  <div
    class="bg-white/60 p-6 rounded-lg shadow-sm mb-5 md:col-span-3 hidden md:block"
  >
    <h3 class="text-xl font-medium text-gray-600 tracking-wide mb-3">
      Group Tours
    </h3>
    <!-- search input sort filter -->
    <div class="flex items-center justify-between mb-8">
      <div class="">
        <input
          type="text"
          v-model="search"
          class="w-3/5 sm:w-3/5 md:w-[300px] mr-3 border px-4 py-2 rounded-md shadow-sm focus:ring-0 focus:outline-none text-gray-500"
          placeholder="Search Group Tours..."
        />

        <AdjustmentsHorizontalIcon
          class="w-6 text-gray-600 h-6 inline-block mx-2 cursor-pointer"
        />
      </div>
      <div class="space-x-3">
        <Button :leftIcon="ShareIcon" intent="text" @click="exportAction">
          Export
        </Button>
        <Button
          :leftIcon="PlusIcon"
          @click="GrouptourCreate"
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
              Prices
            </th>
            <th class="w-30 p-3 text-xs font-medium tracking-wide text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            class="bg-white even:bg-gray-50 hover:bg-gray-50"
            v-for="(r, index) in grouptours?.data"
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
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ r.name }}
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ r.price }} B
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <router-link :to="'/grouptour/view/' + r.id + '/view'">
                  <button
                    class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-blue-500 hover:text-white"
                  >
                    <EyeIcon class="w-5 h-5" />
                  </button>
                </router-link>
                <router-link
                  :to="'/grouptour/view/' + r.id + '/edit'"
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
      </table>
    </div>
    <!-- pagination -->
    <Pagination v-if="!loading" :data="grouptours" @change-page="changePage" />
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
  UserGroupIcon,
  UsersIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/vue/24/outline";
import Pagination from "../components/Pagination.vue";
import { onMounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import { useGrouptourStore } from "../stores/grouptour";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const toast = useToast();
const grouptourStore = useGrouptourStore();
const { grouptours, loading } = storeToRefs(grouptourStore);
const authStore = useAuthStore();

const search = ref("");
const errors = ref([]);

const GrouptourCreate = () => {
  router.push("/grouptour/create");
};

const changePage = async (url) => {
  console.log(url);
  let data = {
    search: search.value,
  };
  await grouptourStore.getChangePage(url, data);
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
        const response = await grouptourStore.deleteAction(id);
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
      await grouptourStore.getListAction();
    }
  });
};

const exportAction = async () => {
  const res = await grouptourStore.downloadExport();
  if (res) {
    window.open(res.result.download_link);
  }
};

onMounted(async () => {
  await grouptourStore.getListAction();
});

watch(search, async (newValue) => {
  await grouptourStore.getListAction({ search: search.value });
});
</script>
