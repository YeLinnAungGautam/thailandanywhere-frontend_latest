<template>
  <div
    class="hidden p-6 mb-5 rounded-lg shadow-sm bg-white/60 md:col-span-3 md:block"
  >
    <h3 class="mb-3 text-xl font-medium tracking-wide text-gray-600">
      Inclusive List
    </h3>
    <!-- search input sort filter -->
    <div class="flex items-center justify-between mb-8">
      <div class="">
        <input
          type="text"
          v-model="search"
          class="w-3/5 sm:w-3/5 md:w-[300px] mr-3 border px-4 py-2 rounded-md shadow-sm focus:ring-0 focus:outline-none text-gray-500"
          placeholder="Search Inclusive List..."
        />

        <AdjustmentsHorizontalIcon
          class="inline-block w-6 h-6 mx-2 text-gray-600 cursor-pointer"
        />
      </div>
      <div class="space-x-3">
        <Button :leftIcon="ShareIcon" intent="text"> Export </Button>
        <Button :leftIcon="PlusIcon" @click="inclusiveHandling">
          Create
        </Button>
      </div>
    </div>
    <div class="mb-5 overflow-auto rounded-lg shadow">
      <table class="w-full">
        <thead class="border-b-2 border-gray-200 bg-gray-50">
          <tr>
            <th class="w-20 p-3 text-sm font-medium tracking-wide text-left">
              No.
            </th>
            <th class="p-3 text-sm font-medium tracking-wide text-left w-30">
              Image
            </th>
            <th class="p-3 text-sm font-medium tracking-wide text-left">
              Name
            </th>
            <th class="p-3 text-sm font-medium tracking-wide text-left">
              Prices
            </th>
            <th class="p-3 text-sm font-medium tracking-wide text-left">
              Agent Prices
            </th>
            <th class="p-3 text-sm font-medium tracking-wide text-left w-30">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            class="bg-white even:bg-gray-50 hover:bg-gray-50"
            v-for="(r, index) in inclusives?.data"
            :key="index"
          >
            <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
              {{ r.id }}
            </td>
            <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
              <img :src="r.cover_image" class="h-12 rounded-lg w-14" alt="" />
            </td>
            <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
              {{ r.name }}
            </td>
            <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
              {{ r.price }} B
            </td>
            <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
              {{ r.agent_price }} B
            </td>
            <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <router-link :to="'/inclusive/view/' + r.id + '/view'">
                  <button
                    class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-blue-500 hover:text-white"
                  >
                    <EyeIcon class="w-5 h-5" />
                  </button>
                </router-link>
                <router-link :to="'/inclusive/view/' + r.id + '/edit'">
                  <button
                    class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                  >
                    <PencilSquareIcon class="w-5 h-5" />
                  </button>
                </router-link>
                <button
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
    <Pagination v-if="!loading" :data="inclusives" @change-page="changePage" />
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
import { useInclusiveStore } from "../stores/inclusion";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";

const router = useRouter();
const toast = useToast();
const inclusiveStore = useInclusiveStore();
const { inclusives, loading } = storeToRefs(inclusiveStore);

const search = ref("");
const errors = ref([]);

const inclusiveHandling = () => {
  router.push("/inclusive/create");
};

const changePage = async (url) => {
  console.log(url);
  await inclusiveStore.getChangePage(url);
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
        const response = await inclusiveStore.deleteAction(id);
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
      await inclusiveStore.getListAction();
    }
  });
};

onMounted(async () => {
  await inclusiveStore.getListAction();
});

watch(search, async (newValue) => {
  await inclusiveStore.getListAction({ search: search.value });
});
</script>
